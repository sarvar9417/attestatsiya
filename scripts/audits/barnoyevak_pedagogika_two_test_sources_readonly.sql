-- Pedagogika Drive PDF staged test import verification (READ ONLY).
-- Important: never expose raw_question_private, raw_answer_private or correct keys in a public report.
WITH source_rollup AS (
  SELECT source_file_name,
         count(*) AS total,
         count(*) FILTER (WHERE editorial_status = 'needs_review') AS pending,
         count(*) FILTER (WHERE answer_key_status = 'missing') AS missing_keys,
         count(*) FILTER (WHERE linked_question_id IS NOT NULL) AS linked_to_public_question,
         count(DISTINCT source_question_no) AS distinct_slots,
         count(DISTINCT text_sha256) AS distinct_hashes,
         count(*) FILTER (WHERE extraction_confidence = 'needs_manual_parse') AS manual_parse,
         min(page_no) AS first_page,
         max(page_no) AS last_page
  FROM public.pedagogy_pdf_source_candidates
  WHERE source_file_name IN ('Pedagogika testi 3.pdf','Pedagogik kompetentlik test 1.pdf')
  GROUP BY source_file_name
)
SELECT * FROM source_rollup ORDER BY source_file_name;

-- Report precisely which entries need reconstructing before constructing scored variants.
SELECT source_file_name, source_question_no, page_no,
       extraction_confidence, answer_key_status, source_quality_flags
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN ('Pedagogika testi 3.pdf','Pedagogik kompetentlik test 1.pdf')
  AND extraction_confidence='needs_manual_parse'
ORDER BY source_file_name,source_question_no;

-- Raw-text exact matching only, NOT semantic/near duplicate adjudication.
SELECT count(*) AS cross_source_hash_collision_rows
FROM public.pedagogy_pdf_source_candidates a
JOIN public.pedagogy_pdf_source_candidates b ON a.text_sha256=b.text_sha256 AND a.id<>b.id
WHERE a.source_file_name IN ('Pedagogika testi 3.pdf','Pedagogik kompetentlik test 1.pdf');
