-- TASK-205: READ-ONLY post-import verification (not a data migration).
-- Safe to run against a staged database; never exposes option text or keys.
WITH staged AS (
  SELECT q.id, q.status, q.format, q.construct_id, q.source_lesson_id,
         q.source_reference, k.payload, l.status AS lesson_status
  FROM public.questions AS q
  LEFT JOIN public.question_keys AS k ON k.question_id = q.id
  LEFT JOIN public.lessons AS l ON l.id = q.source_lesson_id
  WHERE q.source_reference LIKE 'pyjs-2026-v2:%'
), audit AS (
  SELECT
    s.*,
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.id AND o.side='a') AS left_count,
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.id AND o.side='b') AS right_count,
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=s.id AND o.id::text=s.payload->>'correct_option_id') AS y1_key_hits,
    (SELECT count(*) FROM jsonb_object_keys(s.payload->'pairs')) AS y2_pair_count,
    (SELECT count(*) FROM jsonb_array_elements_text(s.payload->'order')) AS y3_step_count,
    EXISTS(SELECT 1 FROM public.lesson_constructs lc WHERE lc.lesson_id=s.source_lesson_id AND lc.construct_id=s.construct_id) AS linked_to_construct
  FROM staged s
)
SELECT
  count(*) AS questions,
  count(*) FILTER(WHERE format='Y1') AS y1,
  count(*) FILTER(WHERE format='Y2') AS y2,
  count(*) FILTER(WHERE format='Y3') AS y3,
  count(*) FILTER(WHERE status='review') AS review_questions,
  count(*) FILTER(WHERE status='published') AS published_questions,
  count(*) FILTER(WHERE payload IS NULL OR lesson_status IS DISTINCT FROM 'review' OR NOT linked_to_construct) AS missing_integrity,
  count(*) FILTER(WHERE format='Y1' AND (left_count<>4 OR right_count<>0 OR y1_key_hits<>1)) AS invalid_y1,
  count(*) FILTER(WHERE format='Y2' AND (left_count<>4 OR right_count<>4 OR y2_pair_count<>4)) AS invalid_y2,
  count(*) FILTER(WHERE format='Y3' AND (left_count<>4 OR right_count<>0 OR y3_step_count<>4)) AS invalid_y3,
  (SELECT count(*) FROM public.lessons WHERE slug LIKE 'pyjs-v2-%' AND status='review') AS review_lessons
FROM audit;
