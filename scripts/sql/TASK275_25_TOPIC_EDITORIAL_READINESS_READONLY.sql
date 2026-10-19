-- TASK-275: repeatable topic-test editorial readiness inventory.
-- Production SELECT-only; no protected answer payloads or learner records.
-- A keyed review item is NOT eligible as a published topic-test item.
-- Requires privileged review execution of topic_test_preview(); no client exposure.
WITH lesson_snap AS (
  SELECT l.id, l.title_uz, m.code AS module_code,
         l.topic_test_question_count AS target,
         public.topic_test_preview(l.id) AS preview
  FROM public.lessons l
  JOIN public.modules m ON m.id = l.module_id
  WHERE l.status = 'published'
    AND m.status = 'published'
    AND m.code IN ('M03','M06','M08','M09','M10','M11','M12')
    AND l.topic_test_question_count > 0
),
underfilled AS (
  SELECT id, title_uz, module_code, target,
         nullif(preview ->> 'available_count','')::int AS available
  FROM lesson_snap
  WHERE nullif(preview ->> 'available_count','')::int < target
),
review_candidates AS (
  SELECT s.id AS lesson_id, q.id AS question_id, q.format::text AS format,
         q.source_lesson_id,
         EXISTS (
           SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id
         ) AS has_key,
         EXISTS (
           SELECT 1 FROM public.question_editorial_checks ec
           WHERE ec.question_id=q.id
             AND ec.answer_verified
             AND ec.reference_verified
             AND ec.wording_verified
             AND ec.original_authorship_verified
         ) AS independently_checked
  FROM underfilled s
  JOIN public.lesson_constructs lc ON lc.lesson_id=s.id
  JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
  JOIN public.questions q ON q.construct_id=c.id
                         AND q.group_code=c.group_code
                         AND q.status='review'
)
SELECT s.module_code, s.id AS lesson_id, s.title_uz AS lesson,
       s.target, s.available, s.target-s.available AS deficit,
       count(DISTINCT r.question_id) FILTER (WHERE r.has_key) AS keyed_review_mapped,
       count(DISTINCT r.question_id) FILTER (
         WHERE r.has_key AND r.independently_checked
       ) AS independently_checked_mapped,
       count(DISTINCT r.question_id) FILTER (
         WHERE r.has_key AND r.independently_checked AND r.source_lesson_id=s.id
       ) AS independently_checked_same_source,
       count(DISTINCT r.question_id) FILTER (
         WHERE r.has_key AND r.format='Y1'
       ) AS review_y1,
       count(DISTINCT r.question_id) FILTER (
         WHERE r.has_key AND r.format='Y2'
       ) AS review_y2,
       count(DISTINCT r.question_id) FILTER (
         WHERE r.has_key AND r.format='Y3'
       ) AS review_y3,
       CASE WHEN s.available=0 THEN 'P0_ZERO_PUBLISHED'
            ELSE 'EDITORIAL_AND_PREFLIGHT_REQUIRED' END AS next_gate
FROM underfilled s
LEFT JOIN review_candidates r ON r.lesson_id=s.id
GROUP BY s.module_code,s.id,s.title_uz,s.target,s.available
ORDER BY (s.available=0) DESC, s.target-s.available DESC, s.module_code,s.id;
