-- Read-only pedagogika private source import check; NO raw stems, answer keys or publication.
SELECT source_file_name, count(*) AS private_candidates,
       count(*) FILTER (WHERE editorial_status='needs_review') AS pending_review,
       count(*) FILTER (WHERE answer_key_status='missing') AS unkeyed,
       count(*) FILTER (WHERE linked_question_id IS NOT NULL) AS public_links,
       count(DISTINCT source_question_no) AS source_number_count,
       count(DISTINCT text_sha256) AS distinct_source_hashes,
       count(*) FILTER (WHERE extraction_confidence='needs_manual_parse') AS manual_parse,
       min(page_no) AS start_page, max(page_no) AS end_page
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN (
 'Pedagogika testi 3.pdf',
 'Pedagogik kompetentlik test 1.pdf',
 'Ped mahorat kasb standarti test 6.pdf',
 'Mirayeva test 1.pdf'
)
GROUP BY source_file_name ORDER BY source_file_name;

-- Manual repair queue: only stable source identifiers/flags, no question text or answers.
SELECT source_file_name, source_question_no, page_no, source_quality_flags
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN (
 'Pedagogika testi 3.pdf',
 'Pedagogik kompetentlik test 1.pdf',
 'Ped mahorat kasb standarti test 6.pdf',
 'Mirayeva test 1.pdf'
)
AND (extraction_confidence='needs_manual_parse'
     OR 'pedagogical_safety_concern_public_shaming'=ANY(source_quality_flags))
ORDER BY source_file_name, source_question_no;
