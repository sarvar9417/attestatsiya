-- Read-only source import verification: no private stems or answer-key values.
SELECT source_file_name,count(*) source_slots,
       count(*) FILTER(WHERE editorial_status='needs_review') needs_review,
       count(*) FILTER(WHERE answer_key_status='missing') missing_key,
       count(*) FILTER(WHERE duplicate_of_candidate_id IS NOT NULL) known_source_duplicates,
       count(*) FILTER(WHERE linked_question_id IS NOT NULL) linked_public,
       count(DISTINCT source_question_no) distinct_slots,
       count(DISTINCT text_sha256) distinct_hashes,
       min(page_no) first_page,max(page_no) last_page
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN (
'Pedagogika testi 3.pdf',
'Pedagogik kompetentlik test 1.pdf',
'Ped mahorat kasb standarti test 6.pdf',
'Mirayeva test 1.pdf',
'Test Mirzayeva.pdf')
GROUP BY source_file_name ORDER BY source_file_name;

-- Audit duplicate mapping without disclosing the original question or answer.
SELECT a.source_file_name AS newer_file,a.source_question_no AS newer_slot,
       b.source_file_name AS existing_file,b.source_question_no AS existing_slot
FROM public.pedagogy_pdf_source_candidates a
JOIN public.pedagogy_pdf_source_candidates b ON b.id=a.duplicate_of_candidate_id
WHERE a.source_file_name='Test Mirzayeva.pdf'
ORDER BY a.source_question_no;
