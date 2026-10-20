-- TASK-346 original-PDF visual provenance invariants; safe on an empty local seed.
BEGIN;
DO $$
BEGIN
 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_pdf_question_candidates p
  WHERE p.source_visually_checked AND
   (p.source_page_number IS NULL OR p.source_page_number<=0)
 ) THEN
  RAISE EXCEPTION 'visual source checked without physical PDF page';
 END IF;
 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_pdf_question_candidates p
  JOIN attest_ingest.telegram_informatika_pdf_independent_qa q
   USING(source_file_id,source_question_no)
  WHERE p.answer_key IS NOT NULL OR q.confirmed_by_human
     OR jsonb_array_length(p.extracted_answer_options)<>4
     OR p.quality_flags @> ARRAY['source_question_or_options_not_consistent_manual_review']::text[]
 ) THEN
  RAISE EXCEPTION 'unverified or conflicting PDF answer proposal';
 END IF;
 IF has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_independent_qa','SELECT')
   OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_independent_qa','SELECT') THEN
  RAISE EXCEPTION 'private PDF QA visible to learner';
 END IF;
END $$;
ROLLBACK;
