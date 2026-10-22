-- TASK-431: READ-ONLY live audit. Run after any source staging updates.
-- No answer key, options, source text, question revisions or publication is changed.
SELECT count(*) AS candidates,
       count(*) FILTER (WHERE answer_key IS NULL) AS keyless_source,
       count(*) FILTER (WHERE jsonb_array_length(extracted_answer_options)=0) AS source_without_options,
       count(*) FILTER (WHERE 'qa20261022_no_original_answer_options_confirmed'=ANY(quality_flags)) AS flagged_without_options,
       count(*) FILTER (WHERE 'qa20261022_cross_source_identical_stem_review_only'=ANY(quality_flags)) AS cross_file_duplicate_rows,
       count(*) FILTER (WHERE 'qa20261022_same_pdf_exact_duplicate_review_only'=ANY(quality_flags)) AS in_file_duplicate_rows,
       count(*) FILTER (WHERE 'separate_corrected_successor_published_20261022_original_remains_blocked'=ANY(quality_flags)) AS linked_corrected_successors
FROM attest_ingest.telegram_informatika_pdf_question_candidates;

SELECT source_file_name,count(*) AS candidate_count,
       count(*) FILTER (WHERE jsonb_array_length(extracted_answer_options)=0) AS no_options,
       count(*) FILTER (WHERE 'qa20261022_cross_source_identical_stem_review_only'=ANY(quality_flags)) AS cross_file_duplicates
FROM attest_ingest.telegram_informatika_pdf_question_candidates
GROUP BY source_file_name ORDER BY candidate_count DESC,source_file_name;

SELECT next_action,count(*) AS questions
FROM attest_ingest.telegram_informatika_pdf_review_queue
GROUP BY next_action ORDER BY next_action;

SELECT count(*) AS falsely_flagged_missing_options
FROM attest_ingest.telegram_informatika_pdf_question_candidates
WHERE jsonb_array_length(extracted_answer_options)>0
  AND 'qa20261022_no_original_answer_options_confirmed'=ANY(quality_flags);

SELECT count(*) AS proposed_published_source_candidates
FROM attest_ingest.telegram_informatika_pdf_review_queue
WHERE learner_publish_ready;

SELECT split_part(source_reference,':',1) AS released_batch,count(*) AS published_new_questions
FROM public.questions
WHERE status='published'
  AND (source_reference LIKE 'task428:pdf-editorial:20261022:%'
       OR source_reference LIKE 'task429:pdf-editorial:20261022:%')
GROUP BY 1 ORDER BY 1;
