-- PedGuli source release preflight — SELECT ONLY (2026-10-21)
-- Uses production data read-only. Do not run db push, update auth, or modify immutable questions.
-- Explicit printed PDF question numbers are different from imported candidate slot indexes.

-- 11 source-verified, authored Y1 questions must be published, have exactly 4 options,
-- 1 key identifier that matches an option, 4 distinct answer strings, and a PDF link.
WITH q AS (
  SELECT q.id, q.status, q.source_reference, k.payload,
    COUNT(o.id) AS option_count,
    COUNT(*) FILTER (WHERE o.id::text = k.payload ->> 'correct_option_id') AS correct_count,
    COUNT(DISTINCT lower(btrim(o.content_md))) AS different_options
  FROM public.questions q
  JOIN public.question_keys k ON k.question_id = q.id
  JOIN public.question_options o ON o.question_id = q.id AND o.side = 'a'
  WHERE q.source_reference LIKE 'authored:pedagogy-pdf-corpus:2026-ext6-printed-q%'
  GROUP BY q.id, q.status, q.source_reference, k.payload
)
SELECT count(*) AS created,
  count(*) FILTER (WHERE status = 'published') AS published,
  count(*) FILTER (WHERE option_count = 4 AND correct_count = 1 AND different_options = 4) AS valid_keys,
  count(*) FILTER (WHERE EXISTS (
    SELECT 1 FROM public.pedagogy_pdf_source_candidates s WHERE s.linked_question_id = q.id
  )) AS pdf_backlinked
FROM q;

-- Source archive must never be conflated with verified content. Check remaining work.
SELECT count(*) AS all_pdf_candidates,
  count(*) FILTER (WHERE linked_question_id IS NOT NULL) AS pdf_linked,
  count(*) FILTER (WHERE editorial_status = 'needs_review') AS pdf_needs_review,
  count(*) FILTER (WHERE editorial_status = 'verified'
    AND answer_key_status = 'independently_verified'
    AND linked_question_id IS NULL) AS verified_unlinked
FROM public.pedagogy_pdf_source_candidates;

-- Original 4844 C-diskussiya image must have first-party static asset linked.
SELECT q.source_reference, q.status,
  q.assets::text LIKE '%/pedguli-source/pedguli-4844-discussion.jpg%' AS first_party_asset,
  (k.payload ->> 'correct_option_id') IN (
    SELECT o.id::text FROM public.question_options o WHERE o.question_id = q.id AND o.side = 'a'
  ) AS valid_answer_key
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference='telegram:@PedMahoratGuli:4844';

-- PDF source-bucket anomaly counts (categories overlap).
SELECT count(*) AS ext6_review,
  count(*) FILTER (WHERE substring(ltrim(raw_question_private) FROM '^([0-9]{1,3})[.]') IS NULL) AS missing_printed_number,
  count(*) FILTER (WHERE substring(ltrim(raw_question_private) FROM '^([0-9]{1,3})[.]') IS NOT NULL
     AND substring(ltrim(raw_question_private) FROM '^([0-9]{1,3})[.]')::int <> source_question_no) AS printed_number_drift,
  count(*) FILTER (WHERE raw_answer_private ILIKE '%@PedMahoratGuli%') AS watermark_in_raw_answer
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
  AND editorial_status='needs_review';
