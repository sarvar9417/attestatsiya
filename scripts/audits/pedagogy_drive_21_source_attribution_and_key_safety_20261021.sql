-- 2026-10-21 Barnoyevak private PDF QA: read only.
-- Original source content was checked through authenticated Google Drive.
-- This script returns no raw stems or private answer-key values.

SELECT source_file_name,
       count(*) FILTER(WHERE 'drive_original_full_text_match_verified_20261021'=ANY(source_quality_flags))
           AS exact_whole_stem_matches,
       count(*) FILTER(WHERE 'drive_original_full_text_match_watermark_excluded_20261021'=ANY(source_quality_flags))
           AS whole_stem_after_watermark_exclusion,
       count(*) FILTER(WHERE 'pdf_file_identity_unverified'=ANY(source_quality_flags))
           AS remaining_wrong_source_warnings
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025.pdf'
GROUP BY source_file_name;

-- Guard: three source-answer contamination cases are not learner-ready.
SELECT source_question_no,page_no,editorial_status,answer_key_status,
       length(raw_answer_private) AS original_or_repaired_marker_chars,
       linked_question_id IS NOT NULL AS public_linked,
       'source_printed_key_incomplete_original'=ANY(source_quality_flags) AS printed_source_incomplete,
       'original_pdf_marker_recovered_from_other_question'=ANY(source_quality_flags) AS marker_corrected_pending_new_review,
       'source_answer_overflow_contains_following_research_methods_table'=ANY(source_quality_flags) AS overflow_preserved_in_original_field
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025.pdf'
  AND source_question_no IN (128,131,200)
ORDER BY source_question_no;

SELECT count(*) FILTER(WHERE editorial_status='needs_review') AS editorial_pending,
       count(*) FILTER(WHERE editorial_status='needs_review'
                       AND answer_key_status='independently_verified') AS pending_claimed_verified_source_keys
FROM public.pedagogy_pdf_source_candidates;
