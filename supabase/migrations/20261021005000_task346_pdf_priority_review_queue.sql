-- TASK-346 wave5: actionable review queue, source stays private, no auto-publish.
CREATE OR REPLACE VIEW attest_ingest.telegram_informatika_pdf_review_queue
WITH (security_invoker = true) AS
SELECT c.source_file_id,c.source_file_name,c.source_question_no,c.module_hint,c.source_page_number,
 c.source_visually_checked,
 (c.answer_key IS NOT NULL) AS has_original_source_key,
 (pq.source_question_no IS NOT NULL) AS has_independent_mc_proposal,
 (fr.source_question_no IS NOT NULL) AS has_independent_free_response_proposal,
 (fx.source_question_no IS NOT NULL) AS has_independent_formula_proposal,
 (vi.source_question_no IS NOT NULL AND vi.asset_review_state='pdf_figure_not_exported_to_platform') AS missing_required_visual_asset,
 CASE
  WHEN EXISTS(SELECT 1 FROM attest_ingest.telegram_informatika_pdf_release_blockers b
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
COMMENT ON VIEW attest_ingest.telegram_informatika_pdf_review_queue IS
'Private deterministic priority queue for imported source-only questions. Never sets release readiness or assumes AI/human signoff.';