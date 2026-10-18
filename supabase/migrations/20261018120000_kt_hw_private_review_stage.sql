-- DRAFT ONLY: no production deployment. No answer data embedded.
-- Private, service-role-only review inbox; no automatic publish action.
CREATE SCHEMA IF NOT EXISTS kt_bank_review;
REVOKE ALL ON SCHEMA kt_bank_review FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA kt_bank_review TO service_role;

CREATE TABLE IF NOT EXISTS kt_bank_review.candidates (
  bank_code text NOT NULL DEFAULT 'KT-HW-2026' CHECK(bank_code='KT-HW-2026'),
  external_id text NOT NULL CHECK (external_id ~ '^KT-[0-9]{2}-[0-9]{3}$'),
  chapter_no integer NOT NULL CHECK (chapter_no BETWEEN 1 AND 19),
  difficulty text NOT NULL CHECK (difficulty IN ('A','B','C','D','E')),
  construct_codes text NOT NULL,
  stem_md text NOT NULL CHECK (length(trim(stem_md)) > 10),
  options_json jsonb NOT NULL CHECK (jsonb_typeof(options_json)='array' AND jsonb_array_length(options_json)=4),
  correct_letter text NOT NULL CHECK (correct_letter IN ('A','B','C','D')),
  explanation_md text NOT NULL CHECK (length(trim(explanation_md)) > 8),
  source_locator text NOT NULL CHECK (length(trim(source_locator)) > 0),
  qa_flags jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(qa_flags)='array'),
  source_verified boolean NOT NULL DEFAULT false,
  expert_verified boolean NOT NULL DEFAULT false,
  editor_approved boolean NOT NULL DEFAULT false,
  review_state text NOT NULL DEFAULT 'held' CHECK(review_state IN ('held','in_review','approved_for_import')),
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(bank_code,external_id),
  CONSTRAINT only_triple_verified_can_approve CHECK (
    review_state <> 'approved_for_import' OR
    (source_verified AND expert_verified AND editor_approved AND approved_at IS NOT NULL)
  )
);
ALTER TABLE kt_bank_review.candidates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON kt_bank_review.candidates FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON kt_bank_review.candidates TO service_role;
COMMENT ON TABLE kt_bank_review.candidates IS
 'Private prepublication bank; official mock and published practice never read this table';
