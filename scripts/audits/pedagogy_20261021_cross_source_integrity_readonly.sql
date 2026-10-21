-- Pedagogika Drive: read-only cross-source consistency checks.
-- Never select raw_question_private, raw_answer_private or learner answer keys in shared CI logs.

-- The 2026 set has related *stems* but non-identical full source items, so they
-- must be NEAR references, not exact duplicate references.
SELECT source_file_name,
       count(*) as source_rows,
       count(*) FILTER(WHERE editorial_status='needs_review') as pending,
       count(*) FILTER(WHERE near_duplicate_of_candidate_id IS NOT NULL
                        AND duplicate_of_candidate_id IS NULL) as near_only,
       count(*) FILTER(WHERE linked_question_id IS NOT NULL) as linked_public
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='2026 tushgan test 1.pdf'
GROUP BY source_file_name;

-- Only complete-stem normalized duplicates are retired.
SELECT source_file_name,source_question_no,editorial_status,answer_key_status,
       duplicate_of_candidate_id IS NOT NULL as canonical_reference_present
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name IN ('Test Mirzayeva.pdf','Test Mirzayeva 2.pdf')
  AND source_question_no=1
ORDER BY source_file_name;

-- Linked spring 2025 candidates must retain private review status.
SELECT count(*) as spring_stem_links,
       count(*) FILTER(WHERE current.editorial_status='needs_review') as still_review,
       count(*) FILTER(WHERE current.near_duplicate_of_candidate_id=current.id) as invalid_self_link,
       count(*) FILTER(WHERE previous.id IS NULL) as broken_link,
       count(*) FILTER(WHERE previous.source_file_name <>
            'Pedagogik mahorat to''plam 2025.pdf') as wrong_source_file,
       count(*) FILTER(WHERE previous.linked_question_id IS NOT NULL) as matched_to_published
FROM public.pedagogy_pdf_source_candidates current
LEFT JOIN public.pedagogy_pdf_source_candidates previous
  ON previous.id=current.near_duplicate_of_candidate_id
WHERE current.source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND 'whole_stem_normalized_match_spring_2025_base'=ANY(current.source_quality_flags);

-- Eleven source-only copies of existing published questions: no public link on the copy.
SELECT count(*) AS redundant_published_source_copies,
       count(*) FILTER(WHERE editorial_status='rejected') AS retired,
       count(*) FILTER(WHERE linked_question_id IS NOT NULL) AS copy_public_links,
       count(*) FILTER(WHERE near_duplicate_of_candidate_id IS NULL) AS missing_representative
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND 'editorial_reject_duplicate_already_published_same_full_stem_and_key'=ANY(source_quality_flags);

-- Autumn source Q2 was also a complete answer-and-stem copy of a previously
-- verified and publicly linked base-source item. Verify its provenance link.
SELECT copy.source_question_no,copy.editorial_status,
       canonical.source_file_name AS representative_file,
       canonical.source_question_no AS representative_source_no,
       canonical.linked_question_id IS NOT NULL AS representative_published,
       copy.linked_question_id IS NOT NULL AS copy_published
FROM public.pedagogy_pdf_source_candidates copy
LEFT JOIN public.pedagogy_pdf_source_candidates canonical
  ON canonical.id=copy.near_duplicate_of_candidate_id
WHERE copy.source_file_name='Pedmahorat to''plam 2025 kuzgi (3).pdf'
  AND copy.source_question_no=2;

-- Source-only truncated answers must not be treated as independently keyed or published.
SELECT source_question_no,page_no,editorial_status,answer_key_status,
       linked_question_id IS NOT NULL as public_link
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND 'printed_answer_fragment_truncated_source_line'=ANY(source_quality_flags)
ORDER BY source_question_no;

-- Counts are a live snapshot; other changes can occur concurrently.
SELECT count(*) as private_candidates,
       count(*) FILTER(WHERE editorial_status='needs_review') as pending
FROM public.pedagogy_pdf_source_candidates;
