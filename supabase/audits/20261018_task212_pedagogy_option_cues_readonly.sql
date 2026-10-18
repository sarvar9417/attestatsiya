-- TASK-212: aggregate Y1 pedagogy quality cues, STRICTLY READ-ONLY.
-- No question text, author identity, UUID, correct answer or options returned.
-- Signals are heuristic, NOT evidence of wrong answer or automatic approval.
-- 'length_cue_30pct': the correct answer's word count exceeds longest other
-- answer's word count by >30%. It needs human editorial review.
-- This SQL must not UPDATE/DELETE/PUBLISH any data.
BEGIN TRANSACTION READ ONLY;

WITH y AS (
  SELECT
    q.id,
    q.group_code,
    q.status,
    q.stem_md,
    q.source_reference,
    k.explanation_md,
    k.payload ->> 'correct_option_id' AS correct_id,
    (
      SELECT count(*)
      FROM public.question_options o
      WHERE o.question_id = q.id AND trim(o.side) = 'a'
    ) AS option_count,
    (
      SELECT count(DISTINCT lower(trim(o.content_md)))
      FROM public.question_options o
      WHERE o.question_id = q.id AND trim(o.side) = 'a'
    ) AS unique_option_count,
    (
      SELECT count(*)
      FROM public.question_options o
      WHERE o.question_id = q.id
        AND o.id::text = (k.payload ->> 'correct_option_id')
        AND trim(o.side) = 'a'
    ) AS key_option_count,
    (
      SELECT array_length(regexp_split_to_array(trim(o.content_md), E'\\s+'), 1)
      FROM public.question_options o
      WHERE o.question_id = q.id
        AND o.id::text = (k.payload ->> 'correct_option_id')
    ) AS correct_words,
    (
      SELECT max(array_length(regexp_split_to_array(trim(o.content_md), E'\\s+'), 1))
      FROM public.question_options o
      WHERE o.question_id = q.id
        AND o.id::text <> (k.payload ->> 'correct_option_id')
        AND trim(o.side) = 'a'
    ) AS max_wrong_words,
    lower(regexp_replace(trim(q.stem_md), E'\\s+', ' ', 'g')) AS normalized_stem
  FROM public.questions q
  LEFT JOIN public.question_keys k ON k.question_id = q.id
  WHERE q.group_code IN ('KS', 'PM.GEN', 'PM.MET')
    AND q.format = 'Y1'
    AND q.status IN ('published', 'review')
)
SELECT
  group_code,
  status,
  count(*) AS questions,
  count(*) FILTER (WHERE option_count <> 4 OR unique_option_count <> 4)
    AS invalid_y1_option_structure,
  count(*) FILTER (WHERE key_option_count <> 1) AS broken_key_option_reference,
  count(*) FILTER (WHERE coalesce(trim(source_reference), '') = '')
    AS empty_source_reference,
  count(*) FILTER (WHERE coalesce(trim(explanation_md), '') = '')
    AS empty_explanation,
  count(*) FILTER (WHERE coalesce(trim(stem_md), '') = '') AS empty_stem,
  count(*) FILTER (WHERE correct_words > max_wrong_words * 1.3)
    AS length_cue_30pct,
  count(*) FILTER (WHERE correct_words >= max_wrong_words + 4)
    AS length_cue_plus4words,
  count(*) FILTER (
    WHERE EXISTS (
      SELECT 1 FROM y other
      WHERE other.id <> y.id AND other.normalized_stem = y.normalized_stem
    )
  ) AS exact_normalized_stem_duplicates
FROM y
GROUP BY group_code, status
ORDER BY group_code, status;

COMMIT;

-- A missing reference is a structural flag; a nonempty reference is NOT
-- proof the referenced source has been independently verified.
-- A length cue is editorial triage, not a basis for changing a marked key.
