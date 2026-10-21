-- Source-answer watermark QA, read-only. Do not show raw source text or any keys.
SELECT source_file_name,count(*) AS candidates_with_verified_watermark_flags,
       count(*) FILTER (WHERE editorial_status='needs_review') AS pending,
       count(*) FILTER (WHERE linked_question_id IS NOT NULL) AS linked_to_public
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND 'source_answer_watermark_must_be_removed_before_key_review'=ANY(source_quality_flags)
GROUP BY source_file_name;

-- Editorial identifiers only; no answers are disclosed.
SELECT source_question_no,page_no,answer_key_status,editorial_status
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND 'source_answer_watermark_must_be_removed_before_key_review'=ANY(source_quality_flags)
ORDER BY source_question_no;
