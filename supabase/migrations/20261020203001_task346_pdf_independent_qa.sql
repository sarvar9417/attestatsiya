CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_independent_qa (
 source_file_id text NOT NULL,
 source_question_no integer NOT NULL,
 suggested_option_index smallint NOT NULL CHECK (suggested_option_index BETWEEN 0 AND 3),
 explanation_uz text NOT NULL,
 review_state text NOT NULL DEFAULT 'needs_editorial_review',
 confirmed_by_human boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id,source_question_no),
 FOREIGN KEY(source_file_id,source_question_no)
 REFERENCES attest_ingest.telegram_informatika_pdf_question_candidates(source_file_id,source_question_no)
);
ALTER TABLE attest_ingest.telegram_informatika_pdf_independent_qa ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_independent_qa FROM PUBLIC,anon,authenticated;