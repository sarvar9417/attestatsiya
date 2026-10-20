-- TASK-346: cryptographically verified duplicate PDFs, metadata only; no copyrighted bytes committed.
CREATE TABLE IF NOT EXISTS attest_ingest.telegram_informatika_drive_pdf_verified_duplicates (
 source_file_id_a text NOT NULL REFERENCES attest_ingest.telegram_informatika_drive_pdf_inventory(source_file_id),
 source_file_id_b text NOT NULL REFERENCES attest_ingest.telegram_informatika_drive_pdf_inventory(source_file_id),
 sha256_hex char(64) NOT NULL CHECK (sha256_hex ~ '^[0-9a-f]{64}$'),
 verification_method text NOT NULL DEFAULT 'local_binary_sha256'
 CHECK(verification_method='local_binary_sha256'),
 duplicate_verified boolean NOT NULL DEFAULT true CHECK (duplicate_verified=true),
 content_review_approved boolean NOT NULL DEFAULT false CHECK (content_review_approved=false),
 published boolean NOT NULL DEFAULT false CHECK (published=false),
 checked_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_file_id_a,source_file_id_b),
 CONSTRAINT file_id_pair_sorted CHECK(source_file_id_a<source_file_id_b)
);
ALTER TABLE attest_ingest.telegram_informatika_drive_pdf_verified_duplicates ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON attest_ingest.telegram_informatika_drive_pdf_verified_duplicates FROM PUBLIC,anon,authenticated;

WITH pairs(a,b,digest) AS (
 VALUES
 ('1B6d2GEdx6EK74WG72xyzhhAOK920B0wW','1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5','a58aa2ce8911f2607e765a4b187176ba0eb95de72c879ea3c7689dc002c596cd'),
 ('1fJ1jP1AT3vTrItYhi_tKtGBIkvwq6zGW','1z9ZUfv7HQVVL0K5w5SVYkYpPHmAwizhE','3aaf64b98b89b7a6ea0ec7e35a91061215e06a8224ad3110388c4bffdb45a1d6')
)
INSERT INTO attest_ingest.telegram_informatika_drive_pdf_verified_duplicates
(source_file_id_a,source_file_id_b,sha256_hex)
SELECT p.a,p.b,p.digest FROM pairs p
JOIN attest_ingest.telegram_informatika_drive_pdf_inventory x ON x.source_file_id=p.a
JOIN attest_ingest.telegram_informatika_drive_pdf_inventory y ON y.source_file_id=p.b
ON CONFLICT(source_file_id_a,source_file_id_b) DO NOTHING;
COMMENT ON TABLE attest_ingest.telegram_informatika_drive_pdf_verified_duplicates IS
'Byte-for-byte SHA256 duplicate source PDF pair confirmed from Google Drive originals. Do not count duplicate filenames as independent reference evidence; editorial question/key review still required.';