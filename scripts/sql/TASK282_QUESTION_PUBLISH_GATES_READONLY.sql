-- 2026-10-19: safely report question publication blockers.
-- SELECT ONLY. Never mark expert flags, modify lesson statuses, or expose answer keys.
WITH staged AS (
 SELECT q.id,q.group_code,q.source_reference,q.format,
        q.source_lesson_id,
        l.status::text lesson_status,
        c.is_active construct_active,
        EXISTS (SELECT 1 FROM public.lesson_constructs lc
                WHERE lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id) lesson_construct_linked,
        EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id) key_present,
        CASE WHEN q.source_reference LIKE 'ktd-540-2026:%'
                  OR q.source_reference LIKE 'authored:m02-source-20261018:%'
             THEN true ELSE false END ktd_gate,
        CASE WHEN q.source_reference LIKE 'GV2:%'
                  OR q.source_reference LIKE 'Grafika va veb-texnologiyalar V2,%'
                  OR q.source_reference LIKE 'MSACCESS-V2/%'
                  OR q.source_reference LIKE 'MSACCESS-V2-NATIVE/%'
             THEN true ELSE false END independent_editorial_gate
 FROM public.questions q
 LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
 LEFT JOIN public.constructs c ON c.id=q.construct_id
 WHERE q.status='review'
), verified AS (
 SELECT s.*,
   EXISTS(
    SELECT 1 FROM ktd_quality.editorial_reviews r
    WHERE r.question_id=s.id
      AND r.reviewer_id IS NOT NULL
      AND r.answer_verified AND r.source_verified
      AND r.distractors_verified AND r.wording_verified
      AND length(btrim(r.source_book))>=3
      AND r.source_pdf_page>0
      AND length(btrim(r.source_excerpt))>=30
      AND length(btrim(r.answer_rationale))>=30
      AND length(btrim(r.wrong_options_rationale))>=30
      AND r.item_fingerprint=ktd_quality.item_fingerprint(s.id)
   ) ktd_expert_ok,
   EXISTS(
    SELECT 1 FROM public.question_editorial_checks e
    WHERE e.question_id=s.id
      AND e.reviewer_id IS NOT NULL
      AND e.answer_verified AND e.reference_verified
      AND e.wording_verified AND e.original_authorship_verified
      AND length(btrim(e.reviewer_notes))>=20
      AND e.content_fingerprint=public.professional_question_fingerprint(s.id)
   ) editorial_ok
 FROM staged s
)
SELECT group_code,
 count(*) review_items,
 count(*) FILTER (WHERE lesson_status='published') linked_published_lesson,
 count(*) FILTER (WHERE lesson_status IS DISTINCT FROM 'published') unpublished_source_lesson,
 count(*) FILTER (WHERE NOT construct_active OR NOT lesson_construct_linked OR NOT key_present) structural_or_link_blocked,
 count(*) FILTER (WHERE ktd_gate) ktd_expert_gate_items,
 count(*) FILTER (WHERE ktd_gate AND NOT ktd_expert_ok) ktd_missing_expert_evidence,
 count(*) FILTER (WHERE independent_editorial_gate) other_source_gate_items,
 count(*) FILTER (WHERE independent_editorial_gate AND NOT editorial_ok) missing_independent_editorial_evidence,
 count(*) FILTER (
    WHERE lesson_status='published'
      AND construct_active AND lesson_construct_linked AND key_present
      AND (NOT ktd_gate OR ktd_expert_ok)
      AND (NOT independent_editorial_gate OR editorial_ok)
 ) basic_preflight_pass_only
FROM verified
GROUP BY group_code
ORDER BY group_code;
