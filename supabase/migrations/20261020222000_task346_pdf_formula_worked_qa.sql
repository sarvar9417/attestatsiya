-- TASK-346: private Excel formula worked-answer QA; exercises without four choices are not MCQs.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_formula_worked_qa (
 source_file_id text NOT NULL,
 source_question_no integer NOT NULL CHECK(source_question_no > 0),
 formula_text text NOT NULL,
 computed_result text,
 explanation_uz text NOT NULL,
 review_state text NOT NULL CHECK(review_state IN ('computed_review_only','invalid_source_formula')),
 human_approved boolean NOT NULL DEFAULT false CHECK(human_approved=false),
 published boolean NOT NULL DEFAULT false CHECK(published=false),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id,source_question_no),
 FOREIGN KEY(source_file_id,source_question_no)
 REFERENCES attest_ingest.telegram_informatika_pdf_question_candidates(source_file_id,source_question_no),
 CONSTRAINT computed_vs_invalid_consistent CHECK(
 (review_state='computed_review_only' AND computed_result IS NOT NULL)
 OR (review_state='invalid_source_formula' AND computed_result IS NULL))
);
ALTER TABLE attest_ingest.telegram_informatika_pdf_formula_worked_qa ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_formula_worked_qa FROM PUBLIC,anon,authenticated;
COMMENT ON TABLE attest_ingest.telegram_informatika_pdf_formula_worked_qa IS
'Independent formula-only worked review and source syntax defects. No source answer key, user-facing MCQ, or editorial approval.';