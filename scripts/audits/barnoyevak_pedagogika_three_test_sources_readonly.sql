-- Read-only current QA for Barnoyevak Pedagogika: 3 newly staged PDF test sets.
-- Private source stems and answer keys must not be included in GitHub reports.
WITH source_rollup AS (
 SELECT source_file_name,
        count(*) AS staged,
        count(*) FILTER (WHERE editorial_status='needs_review') AS pending,
        count(*) FILTER (WHERE answer_key_status='missing') AS missing_keys,
        count(*) FILTER (WHERE linked_question_id IS NOT NULL) AS linked_public,
        count(DISTINCT source_question_no) AS distinct_question_numbers,
        count(DISTINCT text_sha256) AS distinct_content_hashes,
        count(*) FILTER (WHERE extraction_confidence='needs_manual_parse') AS needs_manual_parse,
        min(page_no) AS first_page,
        max(page_no) AS last_page
 FROM public.pedagogy_pdf_source_candidates
 WHERE source_file_name IN ('Pedagogika testi 3.pdf',
                            'Pedagogik kompetentlik test 1.pdf',
                            'Ped mahorat kasb standarti test 6.pdf')
 GROUP BY source_file_name
)
SELECT * FROM source_rollup ORDER BY source_file_name;

-- Triage all known manually flagged candidates and content-safety concerns.
SELECT source_file_name,source_question_no,page_no,source_quality_flags
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN ('Pedagogika testi 3.pdf',
                           'Pedagogik kompetentlik test 1.pdf',
                           'Ped mahorat kasb standarti test 6.pdf')
  AND (
    extraction_confidence='needs_manual_parse'
    OR 'pedagogical_safety_concern_public_shaming'=ANY(source_quality_flags)
    OR 'possible_ambiguous_multi_statement_options'=ANY(source_quality_flags)
  )
ORDER BY source_file_name,source_question_no;

-- This tests exact text matches only; semantic near-duplicates require expert check.
SELECT count(*) AS cross_source_exact_hash_collisions
FROM public.pedagogy_pdf_source_candidates a
JOIN public.pedagogy_pdf_source_candidates b
  ON a.text_sha256=b.text_sha256 AND a.id<>b.id
WHERE a.source_file_name IN ('Pedagogika testi 3.pdf',
                             'Pedagogik kompetentlik test 1.pdf',
                             'Ped mahorat kasb standarti test 6.pdf');
