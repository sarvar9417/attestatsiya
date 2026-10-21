-- Pedagogika PDF source-candidate read-only editorial risk inventory.
-- No UPDATE/INSERT, published answer keys, or user results are exposed.
-- Execute using project maintainer SQL access only; do not expose via anon API.
SELECT
  source_file_name,
  count(*) AS candidates,
  count(*) FILTER (WHERE editorial_status = 'needs_review') AS needs_review,
  count(*) FILTER (WHERE editorial_status = 'needs_review' AND linked_question_id IS NOT NULL) AS linked_still_needs_review,
  count(*) FILTER (WHERE editorial_status = 'needs_review' AND answer_key_status = 'independently_verified') AS keyed_still_needs_review,
  count(*) FILTER (WHERE editorial_status = 'verified' AND linked_question_id IS NULL) AS verified_without_link,
  count(*) FILTER (WHERE editorial_status = 'verified' AND answer_key_status IS DISTINCT FROM 'independently_verified') AS verified_without_verified_key,
  count(*) FILTER (WHERE editorial_status = 'rejected' AND linked_question_id IS NOT NULL) AS rejected_but_linked,
  count(*) FILTER (WHERE answer_key_status = 'conflict') AS key_conflict
FROM public.pedagogy_pdf_source_candidates
GROUP BY source_file_name
ORDER BY needs_review DESC, source_file_name;

-- Returns only aggregate counts. Any non-zero invariant violation must be
-- investigated against original media before a publish or editorial transition.
SELECT
  count(*) FILTER (WHERE editorial_status = 'verified' AND linked_question_id IS NULL) AS verified_without_link,
  count(*) FILTER (WHERE editorial_status = 'verified' AND answer_key_status IS DISTINCT FROM 'independently_verified') AS verified_without_verified_key,
  count(*) FILTER (WHERE editorial_status = 'rejected' AND linked_question_id IS NOT NULL) AS rejected_but_linked
FROM public.pedagogy_pdf_source_candidates;
