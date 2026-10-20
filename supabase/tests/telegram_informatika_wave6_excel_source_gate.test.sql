-- TASK-346 QA6: source-anchored 2026 Excel formula gating and conflicting annotated PDF response.
BEGIN;
DO $$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM attest_ingest.telegram_informatika_pdf_question_candidates
 WHERE source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU';
 IF n>0 THEN
  IF n<>40 OR (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_question_candidates
      WHERE source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU'
        AND NOT source_visually_checked OR source_page_number IS DISTINCT FROM 1
    )>0 THEN
    RAISE EXCEPTION 'Excel 40 items must reconcile to original one-page visual source';
  END IF;
  IF (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa
      WHERE source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU' AND review_state='computed_review_only')<>37
     OR (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa
      WHERE source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU' AND review_state='invalid_source_formula')<>3 THEN
   RAISE EXCEPTION 'Excel formula 37/3 result partition not maintained';
  END IF;
  IF (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_review_queue
      WHERE source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU'
        AND source_question_no IN(16,28,35) AND next_action='01_fix_source_defect')<>3 THEN
   RAISE EXCEPTION 'Invalid formula incorrectly put in editorial approval queue';
  END IF;
 END IF;

 IF EXISTS (SELECT 1 FROM attest_ingest.telegram_informatika_source_answer_conflicts
     WHERE human_approved OR learner_publish_ready OR resolution_state<>'blocked_source_reconciliation') THEN
    RAISE EXCEPTION 'Contradictory annotated answer became release-ready';
 END IF;
 IF EXISTS (SELECT 1 FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa q
     JOIN attest_ingest.telegram_informatika_pdf_question_candidates c
     USING(source_file_id,source_question_no)
     WHERE q.formula_text IS DISTINCT FROM c.extracted_question_text
       OR q.human_approved OR q.published OR c.answer_key IS NOT NULL) THEN
    RAISE EXCEPTION 'Formula answer proposals must match exact original keyless source';
 END IF;
 IF has_table_privilege('anon','attest_ingest.telegram_informatika_source_answer_conflicts','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_source_answer_conflicts','SELECT')
 OR has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_formula_worked_qa','SELECT')
 OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_formula_worked_qa','SELECT')
 THEN RAISE EXCEPTION 'Private source solution accessible to learners'; END IF;
END $$;
ROLLBACK;