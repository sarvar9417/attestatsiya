-- TASK-346 QA7: private source paraphrase + independent proposal review contract.
BEGIN;
DO $$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM attest_ingest.telegram_informatika_pdf_question_candidates
 WHERE source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC';
 IF n>0 THEN
  IF n<>10
  OR (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_independent_qa
      WHERE source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC')<>9
  OR (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_visual_index
      WHERE source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC'
       AND source_question_no IN(1,8)
       AND asset_review_state='pdf_figure_not_exported_to_platform')<>2
  OR NOT EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_release_blockers
      WHERE source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC' AND source_question_no=1
       AND learner_publish_blocked AND issue_code='insufficient_problem_data')
  THEN RAISE EXCEPTION 'TASK-346 QA7 source/visual/QA counts invalid'; END IF;
 END IF;

 IF EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_independent_qa
      WHERE source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC'
       AND (source_question_no=1 OR confirmed_by_human))
 THEN RAISE EXCEPTION 'Cannot invent an answer or automatically approve AI calculation'; END IF;
 IF EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_question_candidates
      WHERE source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC' AND answer_key IS NOT NULL)
 THEN RAISE EXCEPTION 'Source answer key should remain withheld'; END IF;
 IF EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_visual_index
      WHERE source_file_id='1RUY2J0G_A5oYzca03MRtQr1lU_vpkaqC' AND content_publish_ready)
 THEN RAISE EXCEPTION 'No image without approved learner asset can publish'; END IF;
 IF has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_question_candidates','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_question_candidates','SELECT')
 OR has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_independent_qa','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_independent_qa','SELECT')
 THEN RAISE EXCEPTION 'Private source review leaked'; END IF;
END $$;
ROLLBACK;