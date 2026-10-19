-- TASK-262 — M08 Python/JavaScript metadata-only QA.
-- Production-safe SELECT. Never select answer payloads or learner attempts.
WITH lessons AS (
  SELECT l.id,l.title_uz,l.topic_test_question_count
  FROM public.lessons l
  JOIN public.modules m ON m.id=l.module_id
  WHERE m.code='M08' AND l.status='published' AND m.status='published'
), review_pool AS (
  SELECT l.id AS lesson_id, q.id AS question_id, q.format::text AS format, q.source_lesson_id,
         EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id) AS keyed,
         EXISTS (SELECT 1 FROM public.question_editorial_checks e
           WHERE e.question_id=q.id AND e.answer_verified AND e.reference_verified
             AND e.wording_verified AND e.original_authorship_verified) AS fully_checked
  FROM lessons l
  JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
  JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
  JOIN public.questions q ON q.construct_id=c.id AND q.group_code=c.group_code
   AND q.status='review'
)
SELECT l.id, l.title_uz,
       (public.topic_test_preview(l.id)->>'available_count')::int AS eligible_published,
       l.topic_test_question_count AS target,
       l.topic_test_question_count -
        (public.topic_test_preview(l.id)->>'available_count')::int AS shortage,
       count(DISTINCT r.question_id) FILTER (WHERE r.keyed) AS review_keyed,
       count(DISTINCT r.question_id) FILTER (WHERE r.keyed AND r.format='Y1') AS y1,
       count(DISTINCT r.question_id) FILTER (WHERE r.keyed AND r.format='Y2') AS y2,
       count(DISTINCT r.question_id) FILTER (WHERE r.keyed AND r.format='Y3') AS y3,
       count(DISTINCT r.question_id) FILTER (WHERE r.fully_checked) AS signed_editorial,
       count(DISTINCT r.question_id) FILTER (WHERE r.keyed AND r.source_lesson_id=l.id) AS same_source_lesson
FROM lessons l
LEFT JOIN review_pool r ON r.lesson_id=l.id
GROUP BY l.id,l.title_uz,l.topic_test_question_count
ORDER BY l.title_uz;
