-- Read-only autumn (3) PDF source-review postflight, 2026-10-21.
-- Returns source numbers / statuses only; never publishes private answers.

SELECT source_question_no,page_no,editorial_status,answer_key_status,
       linked_question_id IS NOT NULL AS linked_public_question,
       length(raw_question_private) AS source_stem_characters,
       length(raw_answer_private) AS source_marker_characters,
       CASE WHEN source_question_no IN (19,47) THEN
          text_sha256=encode(sha256(convert_to(raw_question_private,'UTF8')),'hex')
          ELSE NULL END AS modified_stem_hash_consistent,
       source_quality_flags
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedmahorat to''plam 2025 kuzgi (3).pdf'
AND source_question_no IN(19,33,38,46,47,51,52,56)
ORDER BY source_question_no;

-- Source count is not the scored-question bank count.
SELECT count(*) source_occurrences,
       count(*) FILTER(WHERE editorial_status='needs_review') pending_editorial,
       count(*) FILTER(WHERE editorial_status='needs_review'
          AND answer_key_status='missing') missing_keys,
       count(*) FILTER(WHERE editorial_status='needs_review'
          AND answer_key_status='conflict') conflicted_keys
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedmahorat to''plam 2025 kuzgi (3).pdf';

-- Two flagged review source records link to ALREADY published Y1s.
-- Make sure attribution watermarks have not entered the public stem,
-- options, answer payload or answer explanation.
SELECT c.source_question_no,q.status::text published_status,q.format::text format,
       count(DISTINCT o.id) AS public_options,
       bool_or(coalesce(q.stem_md,'') ILIKE '%@PedMahoratGuli%'
         OR coalesce(o.content_md,'') ILIKE '%@PedMahoratGuli%'
         OR coalesce(o.content_md,'') ILIKE '%@Guli_Eshnazarova%'
         OR coalesce(k.payload::text,'') ILIKE '%@PedMahoratGuli%'
         OR coalesce(k.explanation_md,'') ILIKE '%@Guli_Eshnazarova%') AS any_source_watermark_in_published_question
FROM public.pedagogy_pdf_source_candidates c
JOIN public.questions q ON q.id=c.linked_question_id
LEFT JOIN public.question_options o ON o.question_id=q.id
LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE c.source_file_name='Pedmahorat to''plam 2025 kuzgi (3).pdf'
  AND c.source_question_no IN(33,38)
GROUP BY c.source_question_no,q.status,q.format
ORDER BY c.source_question_no;
