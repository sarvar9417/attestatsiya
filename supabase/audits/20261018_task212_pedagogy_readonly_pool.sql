-- TASK-212: REPRODUCIBLE READ-ONLY pedagogy/KS/metodika pool audit
-- Source: official 2026 informatika attestation specification, table 2.
-- Run only as a read-only diagnostic. No user data, answer options, keys or
-- question stems are returned; no question is published by this query.
--
-- 18 canonical lessons: 7 M14 (KS), 8 M15 (PM.GEN), 3 M16 (PM.MET).
-- topic_test_question_count is an application setting (normally 20);
-- published + keyed + canonically attached count is a preliminary proxy,
-- NOT proof that the exam generator/preflight and objective coverage pass.
BEGIN TRANSACTION READ ONLY;

SELECT m.code AS module,
       l.order_idx AS canonical_topic,
       l.slug AS lesson,
       l.topic_test_question_count AS configured_question_count,
       COUNT(DISTINCT q.id) FILTER (
         WHERE q.status = 'published' AND k.question_id IS NOT NULL
       ) AS published_keyed_source_items,
       COUNT(DISTINCT q.id) FILTER (
         WHERE q.status = 'review' AND k.question_id IS NOT NULL
       ) AS review_keyed_source_items,
       GREATEST(
         0,
         COALESCE(l.topic_test_question_count, 20)
           - COUNT(DISTINCT q.id) FILTER (
               WHERE q.status = 'published' AND k.question_id IS NOT NULL
             )
       ) AS preliminary_published_deficit
FROM public.modules m
JOIN public.lessons l ON l.module_id = m.id
LEFT JOIN public.questions q ON q.source_lesson_id = l.id
LEFT JOIN public.question_keys k ON k.question_id = q.id
WHERE m.code IN ('M14', 'M15', 'M16')
  AND l.status = 'published'
  AND l.order_idx BETWEEN 1 AND CASE m.code
     WHEN 'M14' THEN 7 WHEN 'M15' THEN 8 ELSE 3
  END
GROUP BY m.code, l.id, l.order_idx, l.slug, l.topic_test_question_count
ORDER BY m.code, l.order_idx;

-- Only aggregate counts; private answer keys and item payloads stay private.
SELECT q.group_code, q.status, q.format,
       COUNT(*) AS question_count,
       COUNT(k.question_id) AS questions_with_keys
FROM public.questions q
LEFT JOIN public.question_keys k ON k.question_id = q.id
WHERE q.group_code IN ('KS', 'PM.GEN', 'PM.MET')
GROUP BY q.group_code, q.status, q.format
ORDER BY q.group_code, q.status, q.format;

COMMIT;

-- Human editorial gate remains separate: no SELECT result here authorizes
-- auto-publishing review content, changing historical attempts, or bypassing
-- the strict 20-question server preflight.
