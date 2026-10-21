-- Pedagogika PDF: source boundary triage, read-only.
-- Private maintainer query. Returns identifiers and flags only; never exposes
-- raw_question_private, raw_answer_private or confidential answer keys.
-- Treat adjacent slot IDs as triage leads, NOT evidence of equal printed numbers.
WITH risk AS (
  SELECT id, source_file_name, page_no, source_question_no,
         editorial_status, answer_key_status, linked_question_id,
         source_quality_flags,
         ('source_question_starts_with_previous_answer_tail' = ANY(source_quality_flags)) AS preceding_answer_tail,
         ('extraction_stem_missing_printed_question_start' = ANY(source_quality_flags)) AS missing_question_start,
         ('raw_answer_overflow' = ANY(source_quality_flags)) AS answer_overflow
  FROM public.pedagogy_pdf_source_candidates
  WHERE editorial_status = 'needs_review'
)
SELECT source_file_name, page_no, source_question_no, id,
       preceding_answer_tail, missing_question_start, answer_overflow,
       (linked_question_id IS NOT NULL) AS already_linked,
       answer_key_status
FROM risk
WHERE preceding_answer_tail OR missing_question_start OR answer_overflow
ORDER BY source_file_name, page_no NULLS LAST, source_question_no NULLS LAST, id;

-- Aggregate without double counting overlapping technical quality flags.
SELECT source_file_name,
       count(*) FILTER (WHERE 'source_question_starts_with_previous_answer_tail' = ANY(source_quality_flags)) AS preceding_answer_tail,
       count(*) FILTER (WHERE 'extraction_stem_missing_printed_question_start' = ANY(source_quality_flags)) AS missing_question_start,
       count(*) FILTER (WHERE 'raw_answer_overflow' = ANY(source_quality_flags)) AS answer_overflow,
       count(*) FILTER (WHERE source_quality_flags && ARRAY[
         'source_question_starts_with_previous_answer_tail',
         'extraction_stem_missing_printed_question_start',
         'raw_answer_overflow'
       ]::text[]) AS distinct_boundary_risk_candidates
FROM public.pedagogy_pdf_source_candidates
WHERE editorial_status = 'needs_review'
GROUP BY source_file_name
HAVING count(*) FILTER (WHERE source_quality_flags && ARRAY[
  'source_question_starts_with_previous_answer_tail',
  'extraction_stem_missing_printed_question_start',
  'raw_answer_overflow'
]::text[]) > 0
ORDER BY distinct_boundary_risk_candidates DESC, source_file_name;
