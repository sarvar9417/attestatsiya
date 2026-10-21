-- 2026-10-21: privacy-safe read-only audit of 16 cleaned private spring PDF source markers.
-- All original source answers before cleanup are preserved in private review_notes.
WITH source AS (
 SELECT source_question_no,editorial_status,answer_key_status,linked_question_id,
        raw_answer_private,source_quality_flags
 FROM public.pedagogy_pdf_source_candidates
 WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
)
SELECT count(*) FILTER(WHERE 'source_answer_watermark_removed_original_pdf_verified_20261021'=ANY(source_quality_flags))
       AS source_markers_cleaned,
       count(*) FILTER(WHERE editorial_status='needs_review'
                     AND raw_answer_private LIKE '%@PedMahoratGuli%') AS remaining_review_markers,
       count(*) FILTER(WHERE 'source_answer_watermark_removed_original_pdf_verified_20261021'=ANY(source_quality_flags)
                     AND linked_question_id IS NOT NULL) AS published_link_risk,
       count(*) FILTER(WHERE 'source_answer_watermark_removed_original_pdf_verified_20261021'=ANY(source_quality_flags)
                     AND answer_key_status<>'source_marker_unverified') AS wrongly_promoted_answer_keys
FROM source;

-- Provenance only, no actual source or scored answers exposed.
SELECT source_question_no,editorial_status,answer_key_status,
       length(raw_answer_private) AS cleaned_marker_length,
       linked_question_id IS NOT NULL AS has_public_link
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
AND 'source_answer_watermark_removed_original_pdf_verified_20261021'=ANY(source_quality_flags)
ORDER BY source_question_no;
