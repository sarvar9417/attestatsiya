-- TASK-261 M09 (DB/Access/SQL) metadata-only QA, 2026-10-19.
-- READ-ONLY SELECT: no answer payload, private learner record, migration or DML.
-- Service-role-only topic_test_preview requires privileged server SQL review.
WITH lessons AS (
  SELECT id, title_uz, topic_test_question_count
  FROM public.lessons
  WHERE id IN (
    '90000000-0000-4000-8000-000000000001'::uuid,
    '90000000-0000-4000-8000-000000000002'::uuid,
    '90000000-0000-4000-8000-000000000003'::uuid,
    '90000000-0000-4000-8000-000000000004'::uuid,
    '90000000-0000-4000-8000-000000000005'::uuid
  )
), eligible AS (
  SELECT l.id, q.id AS qid, q.format::text AS format,
         q.source_lesson_id,
         EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id) AS has_key,
         EXISTS (
           SELECT 1 FROM public.question_editorial_checks ec
           WHERE ec.question_id=q.id
             AND ec.answer_verified
             AND ec.reference_verified
             AND ec.wording_verified
             AND ec.original_authorship_verified
         ) AS has_full_editorial
  FROM lessons l
  JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
  JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
  JOIN public.questions q ON q.construct_id=c.id
                         AND q.group_code=c.group_code
                         AND q.status='review'
)
SELECT l.id AS lesson_id, l.title_uz AS lesson_title,
       l.topic_test_question_count AS target,
       (public.topic_test_preview(l.id)->>'available_count')::int AS eligible_published,
       l.topic_test_question_count - (public.topic_test_preview(l.id)->>'available_count')::int AS deficit,
       count(DISTINCT e.qid) FILTER (WHERE e.has_key) AS keyed_review,
       count(DISTINCT e.qid) FILTER (WHERE e.has_key AND e.format='Y1') AS y1,
       count(DISTINCT e.qid) FILTER (WHERE e.has_key AND e.format='Y2') AS y2,
       count(DISTINCT e.qid) FILTER (WHERE e.has_key AND e.format='Y3') AS y3,
       count(DISTINCT e.qid) FILTER (WHERE e.has_full_editorial) AS full_editorial,
       count(DISTINCT e.qid) FILTER (WHERE e.has_key AND e.source_lesson_id=l.id) AS same_source_lesson,
       count(DISTINCT e.source_lesson_id) AS source_lesson_variants
FROM lessons l
LEFT JOIN eligible e ON e.id=l.id
GROUP BY l.id,l.title_uz,l.topic_test_question_count
ORDER BY l.id;
