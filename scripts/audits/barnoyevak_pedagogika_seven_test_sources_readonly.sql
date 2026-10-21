-- Barnoyevak pedagogika: seven PDF test sources, read-only QA.
-- Never publish or select private raw_question_private / raw_answer_private in PR logs.
WITH selected AS (
 SELECT source_file_name,source_question_no,page_no,editorial_status,
        answer_key_status,linked_question_id,text_sha256,duplicate_of_candidate_id,
        extraction_confidence,source_quality_flags
 FROM public.pedagogy_pdf_source_candidates
 WHERE source_file_name IN (
    'Pedagogika testi 3.pdf',
    'Pedagogik kompetentlik test 1.pdf',
    'Ped mahorat kasb standarti test 6.pdf',
    'Mirayeva test 1.pdf',
    'Test Mirzayeva.pdf',
    'Test Mirzayeva 2.pdf',
    'diagnostika.pdf')
)
SELECT source_file_name,count(*) AS original_source_items,
       count(DISTINCT source_question_no) AS distinct_positions,
       count(DISTINCT text_sha256) AS distinct_hashes,
       count(*) FILTER(WHERE editorial_status='needs_review') AS needs_review,
       count(*) FILTER(WHERE answer_key_status='missing') AS missing_keys,
       count(*) FILTER(WHERE linked_question_id IS NOT NULL) AS published_links,
       count(*) FILTER(WHERE duplicate_of_candidate_id IS NOT NULL) AS duplicate_links,
       count(*) FILTER(WHERE extraction_confidence='needs_manual_parse') AS manual_parse,
       min(page_no) AS min_source_page,max(page_no) AS max_source_page
FROM selected GROUP BY source_file_name ORDER BY source_file_name;

-- Canonical duplicate slots, without answer keys / original stems.
SELECT a.source_file_name,a.source_question_no,a.page_no,
       b.source_file_name AS canonical_file,b.source_question_no AS canonical_slot
FROM public.pedagogy_pdf_source_candidates a
JOIN public.pedagogy_pdf_source_candidates b ON b.id=a.duplicate_of_candidate_id
WHERE a.source_file_name IN ('Test Mirzayeva 2.pdf','diagnostika.pdf')
ORDER BY a.source_file_name,a.source_question_no;

-- All items requiring extraction/wording review, without private source text.
SELECT source_file_name,source_question_no,page_no,source_quality_flags
FROM selected
WHERE extraction_confidence='needs_manual_parse'
ORDER BY source_file_name,source_question_no;

-- A source item's normalized exact hash alone does NOT prove semantic uniqueness.
SELECT count(*) AS all_candidates,count(*) FILTER(WHERE editorial_status='needs_review') AS pending_review
FROM public.pedagogy_pdf_source_candidates;
