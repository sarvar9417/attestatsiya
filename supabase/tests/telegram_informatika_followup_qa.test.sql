-- TASK-346: private numeric/media review stage invariants.
BEGIN;
DO $$
BEGIN
 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_numeric_qa q
  JOIN attest_ingest.telegram_informatika_polls p ON p.candidate_id=q.candidate_id
  WHERE p.answer_choices->>q.suggested_answer_index IS DISTINCT FROM q.computed_output
     OR q.published OR q.human_approved
 ) THEN
  RAISE EXCEPTION 'TASK-346 numeric candidate check failed';
 END IF;
 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_missing_media m
  JOIN attest_ingest.telegram_informatika_polls p ON p.candidate_id=m.candidate_id
  WHERE m.source_poll_message_id <> p.source_message_id
     OR m.source_photo_message_id <> m.source_poll_message_id - 1
     OR m.actual_photo_exported
 ) THEN
  RAISE EXCEPTION 'TASK-346 media metadata check failed';
 END IF;
 IF EXISTS (
  SELECT 1 FROM attest_ingest.telegram_informatika_module_suggestions s
  JOIN attest_ingest.telegram_informatika_polls p ON p.candidate_id=s.candidate_id
  WHERE p.module_hint <> 'REVIEW' OR s.human_approved
 ) THEN
  RAISE EXCEPTION 'TASK-346 module suggestion check failed';
 END IF;
END $$;
ROLLBACK;
