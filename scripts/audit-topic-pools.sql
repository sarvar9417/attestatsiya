-- Attestatsiya read-only learner content readiness audit.
-- Run with SELECT privileges; no schema/data changes, answer keys, or user IDs.
-- "linked_pool" is the exact construct-linked published/keyed set used by
-- generate_topic_test; "own_pool" only counts questions whose source_lesson_id
-- is this lesson. A sufficient linked pool is not proof of on-topic quality.
WITH lesson_pools AS (
  SELECT m.code AS module_code, l.id AS lesson_id, l.order_idx, l.title_uz,
    l.topic_test_question_count AS configured,
    count(DISTINCT q.id) FILTER (
      WHERE q.status='published'::public.content_status
        AND k.question_id IS NOT NULL
        AND c.is_active AND q.group_code=c.group_code
    ) AS linked_pool,
    count(DISTINCT q.id) FILTER (
      WHERE q.status='published'::public.content_status
        AND k.question_id IS NOT NULL
        AND c.is_active AND q.group_code=c.group_code
        AND q.source_lesson_id=l.id
    ) AS own_pool
  FROM public.lessons l
  JOIN public.modules m ON m.id=l.module_id
  LEFT JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
  LEFT JOIN public.constructs c ON c.id=lc.construct_id
  LEFT JOIN public.questions q ON q.construct_id=c.id
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE l.status='published'::public.content_status
  GROUP BY m.code,l.id,l.order_idx,l.title_uz,l.topic_test_question_count
)
SELECT module_code,order_idx,title_uz,configured,linked_pool,own_pool,
       greatest(configured-linked_pool,0) AS missing_published,
       CASE
         WHEN linked_pool<configured THEN 'BLOCKED_INSUFFICIENT'
         WHEN own_pool<configured THEN 'BORROWED_CONSTRUCT_POOL_REVIEW'
         ELSE 'COUNT_READY_NEEDS_SEMANTIC_REVIEW'
       END AS readiness
FROM lesson_pools
ORDER BY module_code,order_idx;

-- Published and review counts by module/group can be inspected separately.
-- Never automatically promote review questions or truncate configured counts.
