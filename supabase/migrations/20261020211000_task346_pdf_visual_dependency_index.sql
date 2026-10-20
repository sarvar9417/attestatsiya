CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_pdf_visual_index (
 source_file_id text NOT NULL REFERENCES attest_ingest.telegram_informatika_drive_pdf_inventory(source_file_id),
 source_question_no integer NOT NULL CHECK (source_question_no>0),
 source_page_number integer NOT NULL CHECK (source_page_number>0),
 source_format_hint text NOT NULL CHECK(source_format_hint IN ('text_plus_figure','image_only','text_only')),
 asset_review_state text NOT NULL DEFAULT 'pdf_figure_not_exported_to_platform'
   CHECK(asset_review_state IN ('pdf_figure_not_exported_to_platform','source_text_only')),
 content_publish_ready boolean NOT NULL DEFAULT false CHECK (content_publish_ready=false),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id,source_question_no),
 CONSTRAINT text_only_has_no_asset CHECK(source_format_hint<>'text_only' OR asset_review_state='source_text_only')
);
ALTER TABLE attest_ingest.telegram_informatika_pdf_visual_index ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_visual_index FROM PUBLIC,anon,authenticated;
COMMENT ON TABLE attest_ingest.telegram_informatika_pdf_visual_index IS
 'Private original-PDF per-question visual dependency index. Page noted from rendered PDF; no learner image stored or publish permitted.';