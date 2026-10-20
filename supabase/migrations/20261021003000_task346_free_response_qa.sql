-- TASK-346 wave 5: private, non-publishable PDF free-response worked review.
-- Not an official source key and never connected to learner-facing question APIs.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_free_response_qa (
 source_file_id text NOT NULL,
 source_question_no integer NOT NULL CHECK (source_question_no>0),
 suggested_response text NOT NULL CHECK (length(btrim(suggested_response)) BETWEEN 1 AND 240),
 explanation_uz text NOT NULL CHECK (length(btrim(explanation_uz))>=80),
 solution_type text NOT NULL CHECK (solution_type IN ('arithmetic','logic','conceptual')),
 requires_source_visual boolean NOT NULL DEFAULT false,
 review_state text NOT NULL DEFAULT 'needs_editorial_review'
 CHECK (review_state='needs_editorial_review'),
 human_approved boolean NOT NULL DEFAULT false CHECK (human_approved=false),
 publish_ready boolean NOT NULL DEFAULT false CHECK (publish_ready=false),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id,source_question_no),
 FOREIGN KEY(source_file_id,source_question_no)
  REFERENCES attest_ingest.telegram_informatika_pdf_question_candidates(source_file_id,source_question_no)
  ON DELETE RESTRICT
);
CREATE INDEX IF NOT EXISTS idx_telegram_informatika_free_response_qa_review
 ON attest_ingest.telegram_informatika_pdf_free_response_qa(solution_type,created_at);
ALTER TABLE attest_ingest.telegram_informatika_pdf_free_response_qa ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_free_response_qa FROM PUBLIC,anon,authenticated;
COMMENT ON TABLE attest_ingest.telegram_informatika_pdf_free_response_qa IS
'Private independent proposed answers for free-response original PDFs; sources may lack official answer keys or required figures. No editorial approval or publication.';