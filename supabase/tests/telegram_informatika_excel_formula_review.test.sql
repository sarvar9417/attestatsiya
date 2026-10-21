-- TASK-346: review-only Excel free-response formula and source integrity tests.
BEGIN;
DO $$
DECLARE
  n integer;
BEGIN
  IF EXISTS (
    SELECT 1 FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa f
    JOIN attest_ingest.telegram_informatika_pdf_question_candidates q
    USING(source_file_id,source_question_no)
    WHERE f.formula_text IS DISTINCT FROM q.extracted_question_text
       OR q.answer_key IS NOT NULL
       OR jsonb_array_length(q.extracted_answer_options)<>0
       OR f.human_approved OR f.published
  ) THEN
    RAISE EXCEPTION 'Excel free-response worked answer not quarantined';
  END IF;

  IF EXISTS (
    SELECT 1 FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa f
    WHERE (f.review_state='invalid_source_formula' AND f.computed_result IS NOT NULL)
       OR (f.review_state='computed_review_only' AND f.computed_result IS NULL)
  ) THEN
    RAISE EXCEPTION 'Excel source error received a computed answer';
  END IF;

  SELECT count(*) INTO n
  FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa
  WHERE source_file_id='1QiqRt1THGPr86C4MraFDpJrSLbjF0K-s';

  IF n>0 AND (
      n<>52 OR
      (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa
        WHERE source_file_id='1QiqRt1THGPr86C4MraFDpJrSLbjF0K-s'
        AND review_state='computed_review_only')<>48 OR
      (SELECT count(*) FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa
        WHERE source_file_id='1QiqRt1THGPr86C4MraFDpJrSLbjF0K-s'
        AND review_state='invalid_source_formula')<>4
  ) THEN
    RAISE EXCEPTION 'Incomplete Excel formula staging or issue classification';
  END IF;

  IF has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_formula_worked_qa','SELECT')
     OR has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_formula_worked_qa','SELECT')
  THEN
    RAISE EXCEPTION 'Private formula solutions exposed to learners';
  END IF;
END $$;
ROLLBACK;
