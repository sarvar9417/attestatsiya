-- Privacy-safe source-only QA: no private source strings or answer keys selected.
-- Authenticated PDF: Barnoyevak Drive spring 2025 (6).
SELECT source_question_no,page_no,editorial_status,answer_key_status,
       linked_question_id IS NOT NULL AS already_publicly_linked,
       length(raw_question_private) AS source_stem_length,
       length(raw_answer_private) AS source_marker_length,
       text_sha256=encode(sha256(convert_to(raw_question_private,'UTF8')),'hex') AS source_stem_sha_valid,
       'source_recovered_split_from_slot_19'=ANY(source_quality_flags) AS recovered_from_old_slot_19,
       'split_from_concatenated_extract'=ANY(source_quality_flags) AS recovered_from_old_slots_120_121,
       'linked_printed_question_22_answer_line_truncated_source_only'=ANY(source_quality_flags)
            AS linked_source_requires_followup
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf'
AND source_question_no IN (19,20,120,121,199,200,201,202)
ORDER BY source_question_no;

SELECT count(*) AS spring_source_occurrences,
       count(*) FILTER(WHERE editorial_status='needs_review') AS needs_review,
       count(*) FILTER(WHERE 'source_recovered_split_from_slot_19'=ANY(source_quality_flags))
          AS recovered_printed_20_21,
       count(*) FILTER(WHERE 'split_from_concatenated_extract'=ANY(source_quality_flags))
          AS recovered_printed_123_125
FROM public.pedagogy_pdf_source_candidates
WHERE source_file_name='Pedagogik mahorat to''plam 2025 (6).pdf';

-- Pending full quality review, not automatically created new scored questions.
SELECT count(*) AS all_private_source_occurrences,
       count(*) FILTER(WHERE editorial_status='needs_review') AS awaiting_review
FROM public.pedagogy_pdf_source_candidates;

-- Immutable revision queue only for remaining Y3 specificity gap.
SELECT r.source_question_id,q.status::text AS existing_question_status,
       r.revision_question_id IS NOT NULL AS revision_already_created
FROM public.pedagogy_revision_queue r
JOIN public.questions q ON q.id=r.source_question_id
WHERE r.reason LIKE 'y3_task_goal_specificity_20261021%';

-- Publication-safe Y3 revision: verify both legacy and new candidate are intact.
WITH pair AS (
 SELECT source_question_id AS old_id,revision_question_id AS new_id
 FROM public.pedagogy_revision_queue
 WHERE source_question_id='527051c4-4a1d-40af-b05a-7e31db939441'::uuid
), scored AS (
 SELECT k.question_id,array_agg(o.content_md ORDER BY t.ord) AS ordered_meanings
 FROM public.question_keys k
 CROSS JOIN LATERAL jsonb_array_elements_text(k.payload->'order')
   WITH ORDINALITY AS t(option_id,ord)
 JOIN public.question_options o ON o.id=t.option_id::uuid AND o.question_id=k.question_id
 WHERE k.question_id IN (SELECT old_id FROM pair UNION SELECT new_id FROM pair)
 GROUP BY k.question_id
)
SELECT oldq.status::text AS old_status,newq.status::text AS new_status,
 (SELECT count(*) FROM public.question_options WHERE question_id=oldq.id) old_options,
 (SELECT count(*) FROM public.question_options WHERE question_id=newq.id) new_options,
 older.ordered_meanings=newer.ordered_meanings AS same_scoring_semantics,
 newq.source_reference
FROM pair r JOIN public.questions oldq ON oldq.id=r.old_id
 JOIN public.questions newq ON newq.id=r.new_id
 JOIN scored older ON older.question_id=r.old_id
 JOIN scored newer ON newer.question_id=r.new_id;
