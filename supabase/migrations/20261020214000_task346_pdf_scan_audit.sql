-- TASK-346: metadata-only text-scan bookkeeping; never implies visual review or release.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_scan_audit (
  source_file_id text PRIMARY KEY REFERENCES attest_ingest.telegram_informatika_drive_pdf_inventory(source_file_id) ON DELETE RESTRICT,
  extracted_chars integer NOT NULL CHECK (extracted_chars >= 0),
  numbered_line_count integer NOT NULL CHECK(numbered_line_count >= 0),
  mc_option_marker_count integer NOT NULL CHECK(mc_option_marker_count >= 0),
  scan_state text NOT NULL CHECK (scan_state IN ('text_available','image_or_unreadable','connector_error')),
  source_contents_reviewed boolean NOT NULL DEFAULT false CHECK (source_contents_reviewed = false),
  answer_keys_verified boolean NOT NULL DEFAULT false CHECK (answer_keys_verified = false),
  inspected_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE attest_ingest.telegram_informatika_pdf_scan_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_scan_audit FROM PUBLIC,anon,authenticated;
COMMENT ON TABLE attest_ingest.telegram_informatika_pdf_scan_audit IS 'Connector OCR/text availability scan metadata only. NOT a full file review; no question or answer content approved.';