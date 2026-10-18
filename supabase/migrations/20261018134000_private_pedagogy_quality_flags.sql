-- P0-04/P0-05: PRIVATE diagnostics view to triage biased distractors.
-- This is *not* a publishing approval or a substitute for semantic fact-check.
-- Contains key-derived flags: NEVER GRANT this view to anon/authenticated.
BEGIN;
CREATE OR REPLACE VIEW public.pedagogy_option_quality_flags
WITH (security_invoker = true)
AS
WITH option_words AS (
 SELECT q.id AS question_id,q.group_code,q.status,q.source_reference,q.source_lesson_id,q.author_id,
   count(o.id) AS n_options,
   min(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))) AS min_words,
   max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))) AS max_words,
   max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
     FILTER (WHERE o.id::text=k.payload->>'correct_option_id') AS correct_words,
   max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
     FILTER (WHERE o.id::text<>k.payload->>'correct_option_id') AS max_wrong_words,
   count(o.id) FILTER (WHERE
      lower(btrim(o.content_md)) LIKE 'faqat %'
      AND o.id::text<>k.payload->>'correct_option_id'
   ) AS wrong_faqat_count,
   count(o.id) FILTER (WHERE
      lower(btrim(o.content_md)) LIKE 'faqat %'
      AND o.id::text=k.payload->>'correct_option_id'
   ) AS correct_faqat_count,
   count(o.id) FILTER (WHERE o.id::text=k.payload->>'correct_option_id') AS valid_answer_options
 FROM public.questions q
 JOIN public.question_options o ON o.question_id=q.id AND o.side='a'
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code IN('KS','PM.GEN','PM.MET') AND q.format='Y1'::public.question_format
 GROUP BY q.id,q.group_code,q.status,q.source_reference,q.source_lesson_id,q.author_id
)
SELECT question_id,group_code,status,source_reference,source_lesson_id,
  n_options, correct_words, max_wrong_words, wrong_faqat_count,
  (author_id IS NULL) AS authorship_unknown,
  (n_options<>4 OR valid_answer_options<>1) AS invalid_y1_contract,
  (correct_words>max_wrong_words*1.3) AS answer_length_signal,
  (min_words<2 OR max_words>min_words*1.8 OR correct_words>max_wrong_words*1.25) AS publish_word_balance_risk,
  (wrong_faqat_count>0 AND correct_faqat_count=0) AS absolute_word_cue,
  EXISTS(SELECT 1 FROM public.pedagogy_revision_queue rq WHERE rq.source_question_id=question_id) AS flagged_for_revision
FROM option_words;
REVOKE ALL ON public.pedagogy_option_quality_flags FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.pedagogy_option_quality_flags TO service_role;
COMMIT;
