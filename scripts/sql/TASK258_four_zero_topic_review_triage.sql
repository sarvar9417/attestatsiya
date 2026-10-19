-- TASK-258: four 0/20 lessons: read-only, no key payload, no student data.
-- Run as service/admin with read-only SQL access; preview RPC is service-only.
-- The query intentionally distinguishes source-lesson questions from every
-- other lesson sharing a construct; construct mapping does not prove relevance.
WITH target AS (
  SELECT m.code AS module_code, l.id AS lesson_id,
         l.slug AS lesson_slug, l.topic_test_question_count AS required_count,
         lc.construct_id
  FROM public.lessons l
  JOIN public.modules m ON m.id=l.module_id
  JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
  WHERE l.status='published' AND m.status='published'
    AND (m.code,l.slug) IN (
      ('M06','masala-algoritmini-tuzish'),
      ('M08','javascript-sintaksis-asoslari'),
      ('M12','arxitektura-va-topologiyalar'),
      ('M12','internetdan-xavfsiz-va-maqsadli-foydalanish')
    )
), candidates AS (
  SELECT t.module_code, t.lesson_id, t.lesson_slug,
         t.required_count, q.id AS candidate_id,
         q.source_lesson_id=t.lesson_id AS exact_lesson_source,
         split_part(q.source_reference, ':', 1) AS source_family,
         q.format::text AS question_format,
         q.status::text AS status,
         EXISTS(SELECT 1 FROM public.question_keys k
                WHERE k.question_id=q.id) AS has_key,
         EXISTS(SELECT 1 FROM public.question_editorial_checks e
                WHERE e.question_id=q.id) AS has_editorial_check
  FROM target t
  JOIN public.questions q ON q.construct_id=t.construct_id
  JOIN public.constructs c ON c.id=q.construct_id
       AND c.is_active AND c.group_code=q.group_code
  WHERE q.status IN ('published','review')
)
SELECT module_code,lesson_slug,required_count,status,source_family,
       CASE WHEN exact_lesson_source THEN 'exact_own_lesson'
            ELSE 'other_lesson_same_construct' END AS source_scope,
       question_format,
       count(DISTINCT candidate_id) AS item_count,
       count(DISTINCT candidate_id) FILTER(WHERE has_key) AS keyed,
       count(DISTINCT candidate_id) FILTER(WHERE has_editorial_check) AS editorial_checked
FROM candidates
GROUP BY module_code,lesson_slug,required_count,status,source_family,
         exact_lesson_source,question_format
ORDER BY module_code,lesson_slug,source_scope,source_family,question_format;
