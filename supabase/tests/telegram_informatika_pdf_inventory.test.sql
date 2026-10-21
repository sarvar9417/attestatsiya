-- TASK-346 complete-Drive-PDF inventory and embedded-figure source QA.
BEGIN;
DO $$
BEGIN
 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_drive_pdf_inventory
  WHERE source_file_id='' OR source_file_name='' OR source_url NOT LIKE 'https://%'
     OR source_size_bytes<0
 ) THEN RAISE EXCEPTION 'invalid private Drive PDF provenance'; END IF;

 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_pdf_visual_index v
  LEFT JOIN attest_ingest.telegram_informatika_drive_pdf_inventory i
    ON i.source_file_id=v.source_file_id
  WHERE i.source_file_id IS NULL OR v.source_page_number<1
     OR v.content_publish_ready
     OR (v.source_format_hint='text_only' AND v.asset_review_state<>'source_text_only')
 ) THEN RAISE EXCEPTION 'invalid or published visual dependency metadata'; END IF;

 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_pdf_visual_index v
  JOIN attest_ingest.telegram_informatika_pdf_question_candidates q
    ON q.source_file_id=v.source_file_id AND q.source_question_no=v.source_question_no
  WHERE q.source_page_number IS NOT NULL
    AND q.source_page_number<>v.source_page_number
 ) THEN RAISE EXCEPTION 'physical page number disagrees with visual index'; END IF;

 IF has_table_privilege('anon','attest_ingest.telegram_informatika_drive_pdf_inventory','SELECT')
   OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_drive_pdf_inventory','SELECT')
   OR has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_visual_index','SELECT')
   OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_visual_index','SELECT')
 THEN RAISE EXCEPTION 'private source inventory exposed to learners'; END IF;
END $$;
ROLLBACK;
