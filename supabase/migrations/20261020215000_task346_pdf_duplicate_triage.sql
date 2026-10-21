-- TASK-346: candidate-only cross-PDF exact normalized-stem duplicate inventory.
CREATE OR REPLACE VIEW attest_ingest.telegram_informatika_pdf_duplicate_candidates
WITH (security_invoker = true) AS
WITH normalized AS (
 SELECT source_file_id,source_file_name,source_question_no,
 md5(lower(regexp_replace(regexp_replace(btrim(extracted_question_text),
     '^[[:space:]]*[0-9]{1,3}\.[[:space:]]*', '', 'g'),'[[:space:]]+', ' ', 'g'))) stem_hash
 FROM attest_ingest.telegram_informatika_pdf_question_candidates
 WHERE length(btrim(extracted_question_text)) >= 24
), duplicates AS (
 SELECT stem_hash,count(*) AS candidate_count,count(DISTINCT source_file_id) AS pdf_source_count
 FROM normalized GROUP BY stem_hash
 HAVING count(DISTINCT source_file_id)>1
)
SELECT n.source_file_id,n.source_file_name,n.source_question_no,n.stem_hash,
d.candidate_count,d.pdf_source_count,
false::boolean AS source_answers_reconciled,
false::boolean AS human_approved
FROM normalized n JOIN duplicates d USING (stem_hash);
REVOKE ALL ON attest_ingest.telegram_informatika_pdf_duplicate_candidates FROM PUBLIC,anon,authenticated;
COMMENT ON VIEW attest_ingest.telegram_informatika_pdf_duplicate_candidates IS
'Private exact normalized-stem candidate duplicates across different source PDFs. Candidate matches require editorial text, option and answer comparison.';