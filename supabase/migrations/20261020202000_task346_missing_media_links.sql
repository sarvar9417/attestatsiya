-- TASK-346: metadata-only photo linkage for candidate polls, no images or credentials.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_missing_media (
 candidate_id text PRIMARY KEY REFERENCES attest_ingest.telegram_informatika_polls(candidate_id) ON DELETE RESTRICT,
 source_poll_message_id bigint NOT NULL,
 source_photo_message_id bigint NOT NULL,
 interval_seconds smallint NOT NULL CHECK(interval_seconds BETWEEN 0 AND 1),
 photo_present_in_export boolean NOT NULL DEFAULT true CHECK(photo_present_in_export),
 actual_photo_exported boolean NOT NULL DEFAULT false CHECK(NOT actual_photo_exported),
 review_state text NOT NULL DEFAULT 'source_photo_unavailable_in_export'
 CHECK(review_state = 'source_photo_unavailable_in_export'),
 provenance_rule text NOT NULL DEFAULT 'same_sender_photo_directly_before_poll_0to1sec'
 CHECK(provenance_rule = 'same_sender_photo_directly_before_poll_0to1sec'),
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT distinct_photo_and_poll CHECK (source_photo_message_id = source_poll_message_id - 1)
);
ALTER TABLE attest_ingest.telegram_informatika_missing_media ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_missing_media FROM PUBLIC, anon, authenticated;
COMMENT ON TABLE attest_ingest.telegram_informatika_missing_media IS
 'Metadata only. A photo from the same Telegram sender immediately precedes the poll (0-1 sec). The export omits photo bytes. This is NOT proof the picture is essential to solve the question.';