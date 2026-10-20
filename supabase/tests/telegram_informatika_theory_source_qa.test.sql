-- TASK-346: theory / PDF-scan / source issue and duplicate-review regression.
BEGIN;
DO $$
BEGIN
  IF EXISTS (
     SELECT 1 FROM attest_ingest.telegram_informatika_theory_triage
     WHERE editorial_approved OR learner_publish_ready OR duplicate_occurrence < 1
        OR first_occurrence_source_message_id IS NULL
  ) THEN RAISE EXCEPTION 'TASK-346 theory triage must remain unapproved'; END IF;

  IF EXISTS (
     SELECT 1 FROM attest_ingest.telegram_informatika_pdf_scan_audit
     WHERE source_contents_reviewed OR answer_keys_verified OR extracted_chars < 0
  ) THEN RAISE EXCEPTION 'TASK-346 PDF scan is metadata-only'; END IF;

  IF EXISTS (
     SELECT 1 FROM attest_ingest.telegram_informatika_pdf_duplicate_candidates
     WHERE pdf_source_count < 2 OR source_answers_reconciled OR human_approved
  ) THEN RAISE EXCEPTION 'TASK-346 duplicate matching cannot imply key validation'; END IF;

  IF EXISTS (
     SELECT 1 FROM attest_ingest.telegram_informatika_pdf_source_issues
     WHERE NOT learner_publish_blocked OR source_review_state <> 'expert_editorial_review_required'
  ) THEN RAISE EXCEPTION 'TASK-346 SQL-source inconsistency must block release'; END IF;

  IF has_table_privilege('anon','attest_ingest.telegram_informatika_theory_triage','SELECT')
     OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_theory_triage','SELECT')
     OR has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_scan_audit','SELECT')
     OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_source_issues','SELECT')
     OR has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_duplicate_candidates','SELECT')
  THEN RAISE EXCEPTION 'TASK-346 learner exposed to private QA/source inventory'; END IF;
END $$;
ROLLBACK;
