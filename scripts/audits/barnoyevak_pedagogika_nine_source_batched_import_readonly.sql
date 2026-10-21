-- Barnoyevak Pedagogika: read-only verification across nine privately staged test PDFs.
-- DO NOT select raw_question_private or raw_answer_private in CI/public output.
SELECT source_file_name,
       count(*) source_occurrences,
       count(DISTINCT source_question_no) printed_question_positions,
       count(DISTINCT text_sha256) distinct_staged_hashes,
       count(*) FILTER(WHERE editorial_status='needs_review') awaiting_review,
       count(*) FILTER(WHERE answer_key_status='missing') missing_keys,
       count(*) FILTER(WHERE linked_question_id IS NOT NULL) linked_public_questions,
       count(*) FILTER(WHERE duplicate_of_candidate_id IS NOT NULL) cross_source_duplicates,
       count(*) FILTER(WHERE extraction_confidence='needs_manual_parse') technical_review,
       min(page_no) first_source_page,max(page_no) last_source_page
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN (
 'Pedagogika testi 3.pdf',
 'Pedagogik kompetentlik test 1.pdf',
 'Ped mahorat kasb standarti test 6.pdf',
 'Mirayeva test 1.pdf',
 'Test Mirzayeva.pdf',
 'Test Mirzayeva 2.pdf',
 'diagnostika.pdf',
 'pedagogika6.pdf',
 'Pedmahorat 4.pdf')
GROUP BY source_file_name ORDER BY source_file_name;

-- Source-only manual repair queue, never show answers in public.
SELECT source_file_name,source_question_no,page_no,source_quality_flags
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN ('pedagogika6.pdf','Pedmahorat 4.pdf')
AND (extraction_confidence='needs_manual_parse'
     OR 'potential_duplicate_answer_options'=ANY(source_quality_flags)
     OR 'source_encoding_typo_review'=ANY(source_quality_flags))
ORDER BY source_file_name,source_question_no;
