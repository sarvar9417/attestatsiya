-- TASK-548: private, non-learner Informatika PDF editorial derivatives.
-- This is intentionally schema-only: answer keys, stems and options are stored
-- exclusively in the private database, never in the public Git repository.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_editorial_derivatives (
  source_file_id text NOT NULL,
  source_question_no integer NOT NULL CHECK (source_question_no > 0),
  editorial_revision integer NOT NULL DEFAULT 1 CHECK (editorial_revision > 0),
  source_file_name text NOT NULL,
  source_pdf_url text NOT NULL,
  source_page_number integer NOT NULL CHECK (source_page_number > 0),
  source_stem_md5 text NOT NULL CHECK (length(source_stem_md5) = 32),
  module_hint text NOT NULL CHECK (module_hint ~ '^M[0-9]{2}$'),
  correction_reason text NOT NULL,
  authored_stem_md text NOT NULL CHECK (length(trim(authored_stem_md)) >= 40),
  authored_options jsonb NOT NULL CHECK (
    CASE WHEN jsonb_typeof(authored_options) = 'array'
      THEN jsonb_array_length(authored_options) = 4 ELSE false END
  ),
  correct_option_index smallint NOT NULL CHECK (correct_option_index BETWEEN 0 AND 3),
  explanation_uz text NOT NULL CHECK (length(trim(explanation_uz)) >= 70),
  validation_evidence jsonb NOT NULL CHECK (jsonb_typeof(validation_evidence) = 'object'),
  generation_provenance text NOT NULL DEFAULT 'ai_assisted_owner_delegated'
    CHECK (generation_provenance = 'ai_assisted_owner_delegated'),
  editorial_state text NOT NULL DEFAULT 'private_review_only'
    CHECK (editorial_state = 'private_review_only'),
  independently_human_approved boolean NOT NULL DEFAULT false
    CHECK (independently_human_approved IS FALSE),
  learner_publish_ready boolean NOT NULL DEFAULT false
    CHECK (learner_publish_ready IS FALSE),
  published_question_id uuid NULL CHECK (published_question_id IS NULL),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source_file_id,source_question_no,editorial_revision)
);
ALTER TABLE attest_ingest.telegram_informatika_pdf_editorial_derivatives ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE attest_ingest.telegram_informatika_pdf_editorial_derivatives FROM PUBLIC, anon, authenticated;
COMMENT ON TABLE attest_ingest.telegram_informatika_pdf_editorial_derivatives IS
  'TASK-548 private AI-assisted source-corrected review only. No original PDF mutation, no public publish or implied independent human signoff.';
