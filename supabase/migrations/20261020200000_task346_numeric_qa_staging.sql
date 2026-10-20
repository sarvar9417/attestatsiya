-- TASK-346 continuation: AI-derived arithmetic/code answers are NOT source answer keys.
-- Private review-only table. Never join to learner-facing answer endpoints.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_numeric_qa (
  candidate_id text PRIMARY KEY REFERENCES attest_ingest.telegram_informatika_polls(candidate_id) ON DELETE RESTRICT,
  source_message_id bigint NOT NULL,
  suggested_answer_index smallint NOT NULL CHECK (suggested_answer_index BETWEEN 0 AND 3),
  suggested_answer_text text NOT NULL CHECK (length(trim(suggested_answer_text)) > 0),
  computed_output text NOT NULL,
  explanation_uz text NOT NULL CHECK (length(trim(explanation_uz)) > 25),
  verification_method text NOT NULL DEFAULT 'restricted_python_ast_v1'
      CHECK (verification_method = 'restricted_python_ast_v1'),
  review_state text NOT NULL DEFAULT 'machine_verified_review_only'
      CHECK (review_state = 'machine_verified_review_only'),
  reviewer_kind text NOT NULL DEFAULT 'ai' CHECK (reviewer_kind = 'ai'),
  human_approved boolean NOT NULL DEFAULT false CHECK (human_approved = false),
  published boolean NOT NULL DEFAULT false CHECK (published = false),
  reviewed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE attest_ingest.telegram_informatika_numeric_qa ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE attest_ingest.telegram_informatika_numeric_qa FROM PUBLIC, anon, authenticated;
CREATE INDEX IF NOT EXISTS telegram_informatika_numeric_qa_message_idx
  ON attest_ingest.telegram_informatika_numeric_qa(source_message_id);
COMMENT ON TABLE attest_ingest.telegram_informatika_numeric_qa IS
  'Independent restricted AST candidate computations; NOT source keys, editorial sign-offs, or published learner content.';
