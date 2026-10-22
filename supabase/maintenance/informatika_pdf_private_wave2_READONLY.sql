-- Informatika PDF wave-2 (2026-10-22) non-mutating, no-private-answer audit.
-- Private answer keys and authored question content are intentionally omitted.
-- This query may be rerun without altering history or learner-facing content.
WITH verified AS (
 SELECT d.source_file_id, d.source_question_no, d.module_hint,
        s.extracted_question_text AS source_stem,
        s.answer_key AS source_answer_key,
        s.source_visually_checked,
        d.source_stem_md5,
        d.authored_options,
        d.correct_option_index,
        d.explanation_uz,
        d.editorial_state,
        d.learner_publish_ready,
        d.independently_human_approved,
        d.published_question_id,
        (SELECT count(DISTINCT lower(btrim(o.option_text)))
         FROM jsonb_array_elements_text(d.authored_options) o(option_text)) AS option_count,
        EXISTS (
          SELECT 1 FROM attest_ingest.telegram_informatika_pdf_release_blockers b
          WHERE b.source_file_id=d.source_file_id
            AND b.source_question_no=d.source_question_no
            AND b.issue_code='insufficient_problem_data'
            AND b.learner_publish_blocked=true
        ) AS original_blocked
 FROM attest_ingest.telegram_informatika_pdf_editorial_derivatives d
 JOIN attest_ingest.telegram_informatika_pdf_question_candidates s
   USING (source_file_id, source_question_no)
)
SELECT count(*) AS total_private_derivatives,
       count(*) FILTER (WHERE source_stem_md5 = md5(source_stem)) AS source_fingerprint_matches,
       count(*) FILTER (WHERE source_answer_key IS NULL AND original_blocked AND source_visually_checked) AS unchanged_blocked_sources,
       count(*) FILTER (WHERE option_count = 4 AND correct_option_index BETWEEN 0 AND 3 AND length(explanation_uz)>70) AS four_unique_keyed,
       count(*) FILTER (WHERE editorial_state='private_review_only'
                           AND learner_publish_ready=false AND independently_human_approved=false
                           AND published_question_id IS NULL) AS never_published,
       (SELECT has_table_privilege('anon','attest_ingest.telegram_informatika_pdf_editorial_derivatives','SELECT')) AS anon_can_read,
       (SELECT has_table_privilege('authenticated','attest_ingest.telegram_informatika_pdf_editorial_derivatives','SELECT')) AS authenticated_can_read
FROM verified;
