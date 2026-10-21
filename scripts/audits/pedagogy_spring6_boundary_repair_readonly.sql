-- Read-only spring PDF integrity audit. No private stems or answer keys are selected.
WITH source AS (
  SELECT source_question_no,editorial_status,answer_key_status,page_no,
         linked_question_id,source_quality_flags,raw_question_private,text_sha256
  FROM public.pedagogy_pdf_source_candidates
  WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
)
SELECT count(*) AS total_source_occurrences,
       count(*) FILTER(WHERE editorial_status='needs_review') AS review_pending,
       count(*) FILTER(WHERE editorial_status='needs_review' AND
          'extraction_stem_missing_printed_question_start'=ANY(source_quality_flags)) AS unresolved_missing_source_starts,
       count(*) FILTER(WHERE 'stem_exact_pdf_text_verified_after_trim'=ANY(source_quality_flags)) AS exact_source_trim_fixes,
       count(*) FILTER(WHERE 'stem_boundary_source_verified_trimmed_previous_answer_tail'=ANY(source_quality_flags)) AS earlier_manual_trim_fixes,
       count(*) FILTER(WHERE 'source_pdf_comma_numbered_question_start_verified'=ANY(source_quality_flags)) AS valid_comma_numbering,
       count(*) FILTER(WHERE 'source_unnumbered_matching_item_requires_layout_review'=ANY(source_quality_flags)) AS source_unnumbered_matching,
       count(*) FILTER(WHERE 'recovered_split_from_extraction_slot_8'=ANY(source_quality_flags)) AS recovered_source_questions,
       count(*) FILTER(WHERE encode(sha256(convert_to(raw_question_private,'UTF8')),'hex')<>text_sha256) AS source_hash_mismatch
FROM source;

-- The old merged extraction is preserved but must not be scored.
-- The two recovered source slots should stay private and have unverified markers.
SELECT source_question_no,page_no,editorial_status,answer_key_status,
       linked_question_id IS NOT NULL AS public_question_linked,
       'recovered_split_from_extraction_slot_8'=ANY(source_quality_flags) AS recovered
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND source_question_no IN (8,197,198)
ORDER BY source_question_no;

-- A clean printed-number prefix is not sufficient for a verified answer key.
SELECT answer_key_status,count(*) AS count_of_repaired_source_stems
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND ('stem_exact_pdf_text_verified_after_trim'=ANY(source_quality_flags)
    OR 'stem_boundary_source_verified_trimmed_previous_answer_tail'=ANY(source_quality_flags))
GROUP BY answer_key_status;
