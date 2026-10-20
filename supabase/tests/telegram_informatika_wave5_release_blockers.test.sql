-- TASK-346 wave5: optional-source review-only tables, clean-DB/production safety.
BEGIN;
DO $$
DECLARE
  n int;
BEGIN
 IF EXISTS (
 SELECT 1 FROM attest_ingest.telegram_informatika_pdf_release_blockers
 WHERE NOT learner_publish_blocked OR human_approved
 OR review_state<>'requires_editorial_source_fix'
 ) THEN RAISE EXCEPTION 'Source defect unexpectedly approved'; END IF;

 IF EXISTS (
 SELECT 1 FROM attest_ingest.telegram_informatika_pdf_free_response_qa f
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates q
 USING(source_file_id,source_question_no)
 WHERE f.human_approved OR f.publish_ready
 OR f.review_state <> 'needs_editorial_review'
 OR q.answer_key IS NOT NULL
 OR jsonb_array_length(q.extracted_answer_options) <> 0
 ) THEN RAISE EXCEPTION 'Unapproved free response exposed as keyed MCQ'; END IF;

 IF has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_release_blockers','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_release_blockers','SELECT')
 OR has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_free_response_qa','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_free_response_qa','SELECT')
 THEN RAISE EXCEPTION 'Learners can see private answer proposals and defect audit'; END IF;

 SELECT count(*) INTO n FROM attest_ingest.telegram_informatika_pdf_free_response_qa
 WHERE source_file_id='1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB';
 IF n>0 AND (n<>18 OR EXISTS(
   SELECT 1 FROM attest_ingest.telegram_informatika_pdf_free_response_qa
   WHERE source_file_id='1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB'
   AND source_question_no IN(10,14)
 )) THEN
   RAISE EXCEPTION 'Test 20 free-response count/ambiguous answer gate failed';
 END IF;
END $$;
ROLLBACK;