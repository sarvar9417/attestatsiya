-- Read-only verification: no private stems, personal details or keyed options shown.
SELECT source_question_no,page_no,editorial_status,answer_key_status,
       linked_question_id IS NOT NULL AS linked_to_public_question,
       source_quality_flags
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedmahorat to''plam 2025 kuzgi (3).pdf'
  AND source_question_no IN (24,28,31,35,36)
ORDER BY source_question_no;

-- Unlinked review candidates whose stored index differs from the original
-- printed PDF item number; exclude unnumbered matching lists.
SELECT source_question_no,page_no,
       substring(raw_question_private from '^([0-9]{1,3})[.,]') AS printed_number,
       answer_key_status
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedmahorat to''plam 2025 kuzgi (3).pdf'
  AND linked_question_id IS NULL
  AND editorial_status='needs_review'
  AND 'candidate_index_differs_from_pdf_printed_number'=ANY(source_quality_flags)
ORDER BY source_question_no;

-- Counts: correct source provenance is not proof of an independently verified key.
SELECT count(*) total_source_rows,
       count(*) FILTER(WHERE editorial_status='needs_review') pending_review,
       count(*) FILTER(WHERE editorial_status='verified') prior_verified,
       count(*) FILTER(WHERE editorial_status='needs_review'
                            AND answer_key_status='conflict') pending_conflicts,
       count(*) FILTER(WHERE 'source_option_4_truncated_in_pdf'=ANY(source_quality_flags)) truncated_option_flags
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedmahorat to''plam 2025 kuzgi (3).pdf';
