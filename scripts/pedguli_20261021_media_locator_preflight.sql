-- PedGuli original Telegram export media provenance: read-only preflight
-- The metadata fields are private Drive file locators, not public asset URLs.
-- Expected as of 2026-10-21: 4509 photo refs, 167 voice refs, 215 document refs.
SELECT split_part(source_media_path,'/',1) AS original_export_bucket,
count(*) AS archive_records,
count(*) FILTER (WHERE source_metadata ? 'drive_image_id') AS linked_photo,
count(*) FILTER (WHERE source_metadata ? 'drive_audio_id') AS linked_voice,
count(*) FILTER (WHERE source_metadata ? 'drive_document_id') AS linked_document
FROM attest_ingest.telegram_pedagogy_archive_items
WHERE item_kind='media_reference'
GROUP BY 1
ORDER BY archive_records DESC;

-- Verify no false-positive «transcribed» / «reviewed» claims were introduced.
SELECT count(*) AS source_audio_linked,
count(distinct source_metadata->>'drive_audio_id') AS unique_drive_ogg_ids
FROM attest_ingest.telegram_pedagogy_archive_items
WHERE item_kind='media_reference' AND source_metadata ? 'drive_audio_id';

SELECT count(*) AS source_images_linked,
count(distinct source_metadata->>'drive_image_id') AS unique_drive_image_ids
FROM attest_ingest.telegram_pedagogy_archive_items
WHERE item_kind='media_reference' AND source_metadata ? 'drive_image_id';

SELECT count(*) AS source_documents_linked,
count(distinct source_metadata->>'drive_document_id') AS unique_drive_document_ids
FROM attest_ingest.telegram_pedagogy_archive_items
WHERE item_kind='media_reference' AND source_metadata ? 'drive_document_id';

-- A source-image linkage is not pedagogical content verification.
SELECT count(*) AS original_reference_count,
count(*) FILTER (WHERE source_metadata->>'image_content_reviewed'='true') AS original_images_previously_reviewed
FROM attest_ingest.telegram_pedagogy_archive_items WHERE item_kind='media_reference';
