-- TASK-346 wave5: one-to-one private priority queue and optional-source safeguards.
BEGIN;
DO $$
DECLARE original_count bigint; queue_count bigint;
BEGIN
 SELECT count(*) INTO original_count FROM attest_ingest.telegram_informatika_pdf_question_candidates;
 SELECT count(*) INTO queue_count FROM attest_ingest.telegram_informatika_pdf_review_queue;
 IF original_count<>queue_count THEN
  RAISE EXCEPTION 'Priority queue dropped/duplicated source candidates: % vs %',original_count,queue_count;
 END IF;
 IF EXISTS (SELECT 1 FROM attest_ingest.telegram_informatika_pdf_review_queue WHERE learner_publish_ready OR has_original_source_key) THEN
  RAISE EXCEPTION 'Source-only QA queue contained a released question/key';
 END IF;
 IF EXISTS (SELECT 1 FROM attest_ingest.telegram_informatika_pdf_review_queue q
 WHERE q.next_action='01_fix_source_defect'
 AND NOT EXISTS (SELECT 1 FROM attest_ingest.telegram_informatika_pdf_release_blockers b
                 WHERE b.source_file_id=q.source_file_id AND b.source_question_no=q.source_question_no)
 AND NOT EXISTS (SELECT 1 FROM attest_ingest.telegram_informatika_pdf_source_issues s
                 WHERE s.source_file_id=q.source_file_id AND s.source_question_no=q.source_question_no)
 ) THEN RAISE EXCEPTION 'Source defect queue misclassified a candidate'; END IF;
 IF has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_review_queue','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_review_queue','SELECT')
 THEN RAISE EXCEPTION 'Private source queue accessible to learners'; END IF;
END $$;
ROLLBACK;