-- TASK-346 QA6: editorial source defect type, single-page visual reconciliation, safe priority.
-- Forward-only migration; deliberately does nothing if the privately imported source is absent.
ALTER TABLE attest_ingest.telegram_informatika_pdf_release_blockers
 DROP CONSTRAINT IF EXISTS telegram_informatika_pdf_release_blockers_issue_code_check;
ALTER TABLE attest_ingest.telegram_informatika_pdf_release_blockers
 ADD CONSTRAINT telegram_informatika_pdf_release_blockers_issue_code_check
 CHECK (issue_code IN ('insufficient_problem_data','ambiguous_or_nonunique_answer',
 'unspecified_unit_or_encoding','no_correct_choice','invalid_source_formula'));

-- Original source PDF was opened/rendered and all 40 numbered examples checked against the one page.
-- Do not claim review for any altered/transcribed question: exact original text must match the
-- independently recorded worked review (and there must be precisely 40 matching original rows).
WITH validated AS (
 SELECT c.source_file_id
 FROM attest_ingest.telegram_informatika_pdf_question_candidates c
 JOIN attest_ingest.telegram_informatika_pdf_formula_worked_qa f
 USING(source_file_id,source_question_no)
 WHERE c.source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU'
 AND c.extracted_question_text=f.formula_text AND c.answer_key IS NULL
 AND jsonb_array_length(c.extracted_answer_options)=0
 GROUP BY c.source_file_id
 HAVING count(*)=40 AND count(DISTINCT c.source_question_no)=40
)
UPDATE attest_ingest.telegram_informatika_pdf_question_candidates c
SET source_page_number=1,source_visually_checked=true
FROM validated v
WHERE c.source_file_id=v.source_file_id
 AND c.source_question_no BETWEEN 1 AND 40
 AND EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_formula_worked_qa f
  WHERE f.source_file_id=c.source_file_id AND f.source_question_no=c.source_question_no
  AND f.formula_text=c.extracted_question_text);

WITH defects(question_no,evidence_uz) AS (
 VALUES
 (16,'Asl PDF 16-mashqda COUNT(47;A;B;R;6) ichidagi A,B,R nomlari qo‘shtirnoqsiz kiritilgan, lekin nomli diapazonning ta’rifi berilmagan. Ishchi daftarsiz yagona hisoblash natijasini tasdiqlash mumkin emas.'),
 (28,'Asl PDF 28-mashqda LEFT(O\`QITUVCHI”;4) formulasida satrni ochuvchi qo‘shtirnoq yo‘q. Asl sintaksis yaroqsiz, to‘g‘rilangan matnni javob kaliti sifatida bermaslik kerak.'),
 (35,'Asl PDF 35-mashqda REPLACE funksiyasida to‘rtinchi argument oldidan ajratuvchi nuqtali vergul qo‘yilmagan. Berilgan ifoda sintaktik noto‘g‘ri; manba tuzatilmaguncha beriladigan natija faqat taxmin bo‘lishi mumkin.')
)
INSERT INTO attest_ingest.telegram_informatika_pdf_release_blockers
(source_file_id,source_question_no,issue_code,evidence_uz)
SELECT f.source_file_id,f.source_question_no,'invalid_source_formula',d.evidence_uz
FROM defects d
JOIN attest_ingest.telegram_informatika_pdf_formula_worked_qa f
 ON f.source_file_id='1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU'
 AND f.source_question_no=d.question_no
 AND f.review_state='invalid_source_formula'
JOIN attest_ingest.telegram_informatika_pdf_question_candidates c
 USING(source_file_id,source_question_no)
ON CONFLICT(source_file_id,source_question_no,issue_code) DO NOTHING;

CREATE OR REPLACE VIEW attest_ingest.telegram_informatika_pdf_review_queue
WITH (security_invoker=true) AS
SELECT c.source_file_id,c.source_file_name,c.source_question_no,c.module_hint,c.source_page_number,
 c.source_visually_checked,
 (c.answer_key IS NOT NULL) AS has_original_source_key,
 (pq.source_question_no IS NOT NULL) AS has_independent_mc_proposal,
 (fr.source_question_no IS NOT NULL) AS has_independent_free_response_proposal,
 (fx.source_question_no IS NOT NULL) AS has_independent_formula_proposal,
 (vi.source_question_no IS NOT NULL AND vi.asset_review_state='pdf_figure_not_exported_to_platform') AS missing_required_visual_asset,
 CASE
  WHEN fx.review_state='invalid_source_formula'
   OR EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_release_blockers b
     WHERE b.source_file_id=c.source_file_id AND b.source_question_no=c.source_question_no)
   OR EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_source_issues a
     WHERE a.source_file_id=c.source_file_id AND a.source_question_no=c.source_question_no)
  THEN '01_fix_source_defect'
  WHEN vi.source_question_no IS NOT NULL AND vi.asset_review_state='pdf_figure_not_exported_to_platform'
  THEN '02_restore_visual_source_asset'
  WHEN NOT c.source_visually_checked THEN '03_original_page_visual_check'
  WHEN pq.source_question_no IS NULL AND fr.source_question_no IS NULL AND fx.source_question_no IS NULL
  THEN '04_independent_solution'
  ELSE '05_human_editorial_approval'
 END AS next_action,
 false::boolean AS learner_publish_ready
FROM attest_ingest.telegram_informatika_pdf_question_candidates c
LEFT JOIN attest_ingest.telegram_informatika_pdf_visual_index vi
 ON vi.source_file_id=c.source_file_id AND vi.source_question_no=c.source_question_no
LEFT JOIN attest_ingest.telegram_informatika_pdf_independent_qa pq
 ON pq.source_file_id=c.source_file_id AND pq.source_question_no=c.source_question_no
LEFT JOIN attest_ingest.telegram_informatika_pdf_free_response_qa fr
 ON fr.source_file_id=c.source_file_id AND fr.source_question_no=c.source_question_no
LEFT JOIN attest_ingest.telegram_informatika_pdf_formula_worked_qa fx
 ON fx.source_file_id=c.source_file_id AND fx.source_question_no=c.source_question_no;
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_review_queue FROM PUBLIC,anon,authenticated;