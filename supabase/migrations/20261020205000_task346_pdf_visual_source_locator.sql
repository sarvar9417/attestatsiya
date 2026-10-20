ALTER TABLE attest_ingest.telegram_informatika_pdf_question_candidates
 ADD COLUMN IF NOT EXISTS source_page_number integer
 CHECK (source_page_number IS NULL OR source_page_number > 0);
ALTER TABLE attest_ingest.telegram_informatika_pdf_question_candidates
 ADD COLUMN IF NOT EXISTS source_visually_checked boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN attest_ingest.telegram_informatika_pdf_question_candidates.source_page_number IS
 'Physical page number in original PDF; null when unverified. Do not infer from sequence of questions.';
COMMENT ON COLUMN attest_ingest.telegram_informatika_pdf_question_candidates.source_visually_checked IS
 'True only when the actual PDF page image has been inspected. Does NOT imply answer key or editorial approval.';