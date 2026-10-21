CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_drive_pdf_inventory (
 source_file_id text PRIMARY KEY,
 source_file_name text NOT NULL,
 source_url text NOT NULL,
 source_size_bytes bigint CHECK (source_size_bytes IS NULL OR source_size_bytes >= 0),
 source_folder_id text NOT NULL DEFAULT '1s2-Df2t1nbITiYIc8xsEimFtj7SAHykp',
 category_hint text NOT NULL DEFAULT 'unclassified'
   CHECK (category_hint IN ('assessment','theory','curriculum','pedagogy','administrative','unclassified')),
 inventory_state text NOT NULL DEFAULT 'not_comprehensively_reviewed'
   CHECK (inventory_state='not_comprehensively_reviewed'),
 inserted_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE attest_ingest.telegram_informatika_drive_pdf_inventory ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_drive_pdf_inventory FROM PUBLIC,anon,authenticated;
CREATE INDEX IF NOT EXISTS telegram_informatika_drive_pdf_inventory_category_idx ON attest_ingest.telegram_informatika_drive_pdf_inventory(category_hint);
COMMENT ON TABLE attest_ingest.telegram_informatika_drive_pdf_inventory IS
 'Metadata inventory only for all Google Drive Informatika/files PDFs; a file inventory record does not mean source content was read or verified. Category is a filename heuristic.';