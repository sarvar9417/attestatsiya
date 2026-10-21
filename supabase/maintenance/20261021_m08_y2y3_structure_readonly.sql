-- M08 programming: owner-delegated QA, READ-ONLY.
-- Does not display private question text, answer keys or option content.
-- Does not alter production. A structural pass does not prove semantic correctness.
WITH base AS (
 SELECT q.id, q.format, q.source_reference,q.source_lesson_id,q.construct_id,k.payload,
  (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') a_count,
  (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') b_count,
  (SELECT count(DISTINCT o.content_md) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') a_distinct,
  (SELECT count(DISTINCT o.content_md) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') b_distinct
 FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.group_code='S4.CODE' AND q.format IN ('Y2','Y3')
), validated AS (
 SELECT b.*,
 CASE WHEN jsonb_typeof(payload->'pairs')='object'
   THEN (SELECT count(*) FROM jsonb_each_text(payload->'pairs')) ELSE -1 END pairs_count,
 CASE WHEN jsonb_typeof(payload->'order')='array'
   THEN jsonb_array_length(payload->'order') ELSE -1 END order_count,
 EXISTS (SELECT 1 FROM public.lesson_constructs lc
         WHERE lc.lesson_id=b.source_lesson_id AND lc.construct_id=b.construct_id) lesson_construct_match
 FROM base b
)
SELECT format::text,count(*) AS questions,
 count(*) FILTER(WHERE (format='Y2' AND
   (a_count<>4 OR b_count<>4 OR a_distinct<>4 OR b_distinct<>4 OR pairs_count<>4))
   OR (format='Y3' AND (a_count<>4 OR b_count<>0 OR a_distinct<>4 OR order_count<>4))) AS structural_issues,
 count(*) FILTER(WHERE NOT lesson_construct_match) AS invalid_source_lesson_map,
 count(*) FILTER(WHERE format='Y3' AND source_reference LIKE 'pyjs-2026-v2:%-R3-%') AS code_output_y3
FROM validated GROUP BY format ORDER BY format;

-- Four confirmed editorial clarity cases, reference/state only. No private content.
SELECT q.source_reference,q.status::text,q.format::text,
 EXISTS (SELECT 1 FROM public.question_bank_revisions r WHERE r.source_question_id=q.id) AS has_revision,
 (SELECT count(*) FROM public.exam_items e WHERE e.question_id=q.id) AS historical_exam_items
FROM public.questions q
WHERE q.source_reference IN (
 'pyjs-2026-v2:J02-R2-01',
 'pyjs-2026-v2:J04-R2-05',
 'pyjs-2026-v2:J05-018',
 'pyjs-2026-v2:J05-R2-01'
) ORDER BY q.source_reference;
