-- TASK-346: byte-level duplicate evidence must not count as content approval.
BEGIN;
DO $$
BEGIN
 IF EXISTS (
 SELECT 1 FROM attest_ingest.telegram_informatika_drive_pdf_verified_duplicates
 WHERE source_file_id_a>=source_file_id_b OR
       sha256_hex !~ '^[0-9a-f]{64}$' OR
       NOT duplicate_verified OR content_review_approved OR published
 ) THEN RAISE EXCEPTION 'Unverified PDF pair or incorrectly released duplicate'; END IF;
 IF has_table_privilege('anon','attest_ingest.telegram_informatika_drive_pdf_verified_duplicates','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_drive_pdf_verified_duplicates','SELECT')
 THEN RAISE EXCEPTION 'Learner can inspect private source PDF fingerprints'; END IF;
END $$;
ROLLBACK;