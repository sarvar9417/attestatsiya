-- Attestatsiya local QA: Y1 / Y2 / Y3 review bank integrity.
-- READ-ONLY. Designed for local SQL Editor/psql use after git pull.
-- No DDL, no history-migration replay, no review->published changes.
-- Intentionally returns IDs and counts, never actual exam key payloads or option text.
-- A valid UUID mapping does not prove a question's subject-matter correctness.
-- It also does not authorize human editorial approval.

-- 1) Inventory: expected at snapshot 2026-10-21: Y1=1059, Y2=126, Y3=106.
-- Do not hard-fail if local fixture/import counts differ from live.
SELECT q.format::text AS format, q.status::text AS status, count(*) AS question_count
FROM public.questions q
WHERE q.status = 'review'
GROUP BY 1,2 ORDER BY 1,2;

-- 2) Y1 integrity: exactly four options, one UUID-correct key, four distinct choices.
WITH y1 AS (
 SELECT q.id, q.group_code, q.source_reference, k.payload,
 count(o.id) AS option_count,
 count(DISTINCT lower(btrim(o.content_md))) AS distinct_option_texts,
 count(o.id) FILTER (
   WHERE o.id::text = k.payload->>'correct_option_id'
 ) AS correct_uuid_hits
 FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.question_options o ON o.question_id=q.id
 WHERE q.status='review' AND q.format='Y1'
 GROUP BY q.id,q.group_code,q.source_reference,k.payload
)
SELECT id, group_code, source_reference, option_count,
       distinct_option_texts,correct_uuid_hits,
       CASE WHEN payload IS NULL THEN 'missing_key'
            WHEN option_count <> 4 THEN 'wrong_option_count'
            WHEN distinct_option_texts <> 4 THEN 'duplicate_option_text'
            WHEN correct_uuid_hits <> 1 THEN 'wrong_or_missing_key_uuid'
            ELSE 'ok' END AS defect
FROM y1
WHERE payload IS NULL OR option_count <> 4
   OR distinct_option_texts <> 4 OR correct_uuid_hits <> 1
ORDER BY group_code,id;

-- 3) Y2 shape distribution: 3x3 and 4x4 are distinguished, not conflated.
-- Whether a 3x3 question is permissible in a particular exam is an
-- independent SPEC / learner renderer / scoring requirement.
WITH y2 AS (
 SELECT q.id,q.group_code,k.payload,
 count(o.id) FILTER (WHERE o.side='a') AS left_count,
 count(o.id) FILTER (WHERE o.side='b') AS right_count
 FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.question_options o ON o.question_id=q.id
 WHERE q.status='review' AND q.format='Y2'
 GROUP BY q.id,q.group_code,k.payload
), mapped AS (
 SELECT q.id,
 count(p.key) AS pairs,
 count(DISTINCT p.value) AS distinct_right_targets,
 count(*) FILTER (WHERE p.key IS NOT NULL AND (a.id IS NULL OR b.id IS NULL))
   AS invalid_pair_links
 FROM y2 q
 LEFT JOIN LATERAL jsonb_each_text(
   CASE WHEN jsonb_typeof(q.payload->'pairs')='object'
     THEN q.payload->'pairs' ELSE '{}'::jsonb END
 ) p ON TRUE
 LEFT JOIN public.question_options a
   ON a.question_id=q.id AND a.side='a' AND a.id::text=p.key
 LEFT JOIN public.question_options b
   ON b.question_id=q.id AND b.side='b' AND b.id::text=p.value
 GROUP BY q.id
)
SELECT q.left_count,q.right_count,m.pairs,m.distinct_right_targets,
       m.invalid_pair_links,count(*) AS review_questions
FROM y2 q JOIN mapped m USING(id)
GROUP BY 1,2,3,4,5 ORDER BY review_questions DESC,1,2;

-- 4) Y2 actual structural errors only, not arbitrary 4x4 heuristics.
WITH y2 AS (
 SELECT q.id,q.group_code,q.source_reference,k.payload,
 count(o.id) FILTER (WHERE o.side='a') AS left_count,
 count(o.id) FILTER (WHERE o.side='b') AS right_count
 FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.question_options o ON o.question_id=q.id
 WHERE q.status='review' AND q.format='Y2'
 GROUP BY q.id,q.group_code,q.source_reference,k.payload
), mapped AS (
 SELECT q.id,
 count(p.key) AS pairs,
 count(DISTINCT p.value) AS distinct_right_targets,
 count(*) FILTER (WHERE p.key IS NOT NULL AND (a.id IS NULL OR b.id IS NULL))
   AS invalid_pair_links
 FROM y2 q
 LEFT JOIN LATERAL jsonb_each_text(
   CASE WHEN jsonb_typeof(q.payload->'pairs')='object'
     THEN q.payload->'pairs' ELSE '{}'::jsonb END
 ) p ON TRUE
 LEFT JOIN public.question_options a
   ON a.question_id=q.id AND a.side='a' AND a.id::text=p.key
 LEFT JOIN public.question_options b
   ON b.question_id=q.id AND b.side='b' AND b.id::text=p.value
 GROUP BY q.id
)
SELECT q.id,q.group_code,q.source_reference,q.left_count,q.right_count,
       m.pairs,m.distinct_right_targets,m.invalid_pair_links
FROM y2 q JOIN mapped m USING(id)
WHERE q.left_count NOT IN (3,4) OR q.left_count <> q.right_count
   OR q.payload IS NULL OR jsonb_typeof(q.payload->'pairs') IS DISTINCT FROM 'object'
   OR m.pairs <> q.left_count OR m.distinct_right_targets <> m.pairs
   OR m.invalid_pair_links <> 0
ORDER BY q.group_code,q.id;

-- 5) Y3 permutations: every displayed option must appear once in saved key order.
WITH y3 AS (
 SELECT q.id,q.group_code,q.source_reference,k.payload,count(o.id) AS option_count
 FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 LEFT JOIN public.question_options o ON o.question_id=q.id
 WHERE q.status='review' AND q.format='Y3'
 GROUP BY q.id,q.group_code,q.source_reference,k.payload
), members AS (
 SELECT q.id,
 count(p.value) AS order_size,
 count(DISTINCT p.value) AS distinct_option_ids,
 count(*) FILTER (WHERE p.value IS NOT NULL AND o.id IS NULL)
   AS invalid_order_option_ids
 FROM y3 q
 LEFT JOIN LATERAL jsonb_array_elements_text(
   CASE WHEN jsonb_typeof(q.payload->'order')='array'
     THEN q.payload->'order' ELSE '[]'::jsonb END
 ) p ON TRUE
 LEFT JOIN public.question_options o
   ON o.question_id=q.id AND o.side='a' AND o.id::text=p.value
 GROUP BY q.id
)
SELECT q.id,q.group_code,q.source_reference,q.option_count,
       m.order_size,m.distinct_option_ids,m.invalid_order_option_ids
FROM y3 q JOIN members m USING(id)
WHERE q.option_count NOT IN (3,4)
   OR q.payload IS NULL
   OR jsonb_typeof(q.payload->'order') IS DISTINCT FROM 'array'
   OR m.order_size <> q.option_count
   OR m.distinct_option_ids <> m.order_size
   OR m.invalid_order_option_ids <> 0
ORDER BY q.group_code,q.id;

-- 6) Weak explanations / missing source / blank stems: review only.
-- Less than 30 characters is a QA TRIAGE signal, not automatic rejection.
SELECT q.group_code,q.format::text AS format,
 count(*) AS total,
 count(*) FILTER (WHERE length(btrim(coalesce(k.explanation_md,''))) < 30)
   AS short_explanations,
 count(*) FILTER (WHERE nullif(btrim(coalesce(q.source_reference,'')),'') IS NULL)
   AS missing_source_refs,
 count(*) FILTER (WHERE length(btrim(coalesce(q.stem_md,''))) = 0)
   AS blank_question_stems
FROM public.questions q
LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='review'
GROUP BY 1,2
ORDER BY short_explanations DESC,total DESC;
