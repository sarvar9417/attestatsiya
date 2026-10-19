-- TASK-251: Production-safe, read-only inventory.
-- Run with a read-only database role or in a read-only SQL session.
-- No DML, migrations, answer keys, or personal user records.
-- topic_test_preview is restricted to the server/service-role.
WITH lesson_snap AS (
  SELECT l.id, l.title_uz, m.code AS module_code,
         l.topic_test_question_count AS configured_count,
         (public.topic_test_preview(l.id)->>'available_count')::int AS available,
         public.topic_test_preview(l.id)->>'reason' AS preview_reason
  FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  WHERE l.status = 'published'
    AND m.status = 'published'
    AND m.code <> 'M01' -- M01 has non-assessed reference appendices: review separately
    AND l.topic_test_question_count > 0
), pool AS (
  SELECT s.id,
    count(DISTINCT q.id) FILTER (
      WHERE q.status = 'review'
      AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id = q.id)
    ) AS review_keyed_mapped,
    count(DISTINCT q.id) FILTER (
      WHERE q.status = 'draft'
      AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id = q.id)
    ) AS draft_keyed_mapped
  FROM lesson_snap s
  LEFT JOIN public.lesson_constructs lc ON lc.lesson_id = s.id
  LEFT JOIN public.constructs c ON c.id = lc.construct_id AND c.is_active
  LEFT JOIN public.questions q ON q.construct_id = c.id AND q.group_code = c.group_code
  GROUP BY s.id
)
SELECT s.module_code, s.title_uz AS lesson, s.id AS lesson_id,
       s.configured_count, s.available,
       s.configured_count - s.available AS deficit,
       coalesce(p.review_keyed_mapped, 0) AS review_keyed_mapped,
       coalesce(p.draft_keyed_mapped, 0) AS draft_keyed_mapped,
       s.preview_reason
FROM lesson_snap s
JOIN pool p ON p.id = s.id
WHERE s.available < s.configured_count
ORDER BY s.module_code, s.title_uz;
