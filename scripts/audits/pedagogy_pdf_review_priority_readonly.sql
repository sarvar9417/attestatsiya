-- Read-only private-maintainer pedagogy PDF review worklist.
-- Re-check source, key and printed-number semantics independently before publication.
-- Deliberately omit raw_question_private/raw_answer_private and all correct answers.
WITH candidate_worklist AS (
  SELECT
    source_file_name,
    source_year,
    source_sitting,
    page_no,
    source_question_no AS import_slot_not_printed_number,
    id AS private_candidate_id,
    (linked_question_id IS NOT NULL) AS already_linked,
    answer_key_status,
    source_quality_flags,
    CASE
      WHEN source_file_name = 'Pedagogik mahorat to''plam 2025 (6).pdf' THEN 1
      WHEN source_file_name = 'Pedmahorat to''plam 2025 kuzgi (3).pdf' THEN 2
      WHEN source_file_name IN ('2026 tushgan test 1.pdf', 'Attestatsiya-2026. Robiya Xatamova 1.pdf') THEN 3
      ELSE 4
    END AS review_priority
  FROM public.pedagogy_pdf_source_candidates
  WHERE editorial_status = 'needs_review'
)
SELECT review_priority, source_file_name, page_no,
       import_slot_not_printed_number, private_candidate_id,
       already_linked, answer_key_status,
       ('source_question_answer_misaligned' = ANY(source_quality_flags)) AS key_misalignment,
       ('extraction_stem_missing_printed_question_start' = ANY(source_quality_flags)) AS missing_question_start,
       ('source_question_starts_with_previous_answer_tail' = ANY(source_quality_flags)) AS previous_answer_tail,
       ('candidate_index_differs_from_pdf_printed_number' = ANY(source_quality_flags)) AS printed_index_mismatch,
       ('visual_source' = ANY(source_quality_flags)) AS requires_original_visual
FROM candidate_worklist
ORDER BY review_priority, source_file_name, page_no NULLS LAST,
         import_slot_not_printed_number NULLS LAST, private_candidate_id;

-- Aggregate dashboard. Counts can overlap across issue flags.
SELECT source_file_name,
       count(*) AS pending,
       count(*) FILTER (WHERE linked_question_id IS NOT NULL) AS linked_pending,
       count(*) FILTER (WHERE answer_key_status = 'independently_verified') AS keyed_pending,
       count(*) FILTER (WHERE answer_key_status IN ('missing', 'conflict')) AS missing_or_conflicting_key,
       count(*) FILTER (WHERE 'candidate_index_differs_from_pdf_printed_number' = ANY(source_quality_flags)) AS import_index_mismatch,
       count(*) FILTER (WHERE 'extraction_stem_missing_printed_question_start' = ANY(source_quality_flags)) AS boundary_issue
FROM public.pedagogy_pdf_source_candidates
WHERE editorial_status = 'needs_review'
GROUP BY source_file_name
ORDER BY pending DESC, source_file_name;
