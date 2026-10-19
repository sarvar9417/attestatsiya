-- TASK-303: SAFE, READ-ONLY published M14 question-bank audit.
-- Target active Supabase project: plyqezulrfowyblsfpzy.
-- Do not paste question keys or other private payloads into public tickets.
-- Refer to the separately reviewed 13-page PDF (SHA256 in TASK303 report).

-- 1) 7 professional-standard constructs must have exactly 20 published questions.
SELECT c.code AS ks_area, count(*) AS published,
       count(*) FILTER (WHERE q.format='Y1') AS y1,
       count(*) FILTER (WHERE q.format='Y2') AS y2,
       count(*) FILTER (WHERE q.format='Y3') AS y3,
       count(*) FILTER (WHERE q.source_lesson_id IS NULL) AS unlinked_lesson,
       count(*) FILTER (WHERE q.source_reference IS NULL OR btrim(q.source_reference)='') AS missing_source,
       count(*) FILTER (WHERE e.question_id IS NOT NULL
           AND e.answer_verified AND e.reference_verified AND e.wording_verified
           AND e.original_authorship_verified AND e.reviewer_id IS NOT NULL) AS editorial_flags_complete
FROM public.questions q
JOIN public.constructs c ON c.id = q.construct_id
LEFT JOIN public.question_editorial_checks e ON e.question_id = q.id
WHERE q.group_code='KS' AND q.status='published'
GROUP BY c.code ORDER BY c.code;

-- 2) Validate option layout and answer-key presence WITHOUT returning answer keys.
SELECT q.id, c.code, q.format,
       count(o.id) AS total_options,
       count(o.id) FILTER (WHERE o.side='a') AS side_a,
       count(o.id) FILTER (WHERE o.side='b') AS side_b,
       count(DISTINCT lower(btrim(o.content_md))) AS distinct_options,
       (count(k.question_id) > 0) AS key_present
FROM public.questions q
JOIN public.constructs c ON c.id=q.construct_id
LEFT JOIN public.question_options o ON o.question_id=q.id
LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE q.group_code='KS' AND q.status='published'
GROUP BY q.id,c.code,q.format
HAVING
   (q.format='Y1' AND (count(o.id)<>4 OR count(o.id) FILTER(WHERE o.side='a')<>4))
OR (q.format='Y2' AND (count(o.id)<>8 OR count(o.id) FILTER(WHERE o.side='a')<>4
                       OR count(o.id) FILTER(WHERE o.side='b')<>4))
OR (q.format='Y3' AND (count(o.id)<>4 OR count(o.id) FILTER(WHERE o.side='a')<>4))
OR count(DISTINCT lower(btrim(o.content_md)))<>count(o.id)
OR count(k.question_id)=0
ORDER BY c.code,q.id;

-- 3) Identical stems are only CANDIDATES, not proof of duplicate questions:
-- The two KS.03/Y2 prompts have different left/right concepts.
SELECT c.code, lower(regexp_replace(btrim(q.stem_md),'\\s+',' ','g')) AS normalized_stem,
       count(*) AS n, array_agg(q.id ORDER BY q.id) AS question_ids
FROM public.questions q JOIN public.constructs c ON c.id=q.construct_id
WHERE q.group_code='KS' AND q.status='published'
GROUP BY c.code, lower(regexp_replace(btrim(q.stem_md),'\\s+',' ','g'))
HAVING count(*)>1;

-- 4) Low-discrimination/short prompts are candidates for independent editorial QA.
SELECT c.code,q.id,length(btrim(q.stem_md)) AS stem_length
FROM public.questions q JOIN public.constructs c ON c.id=q.construct_id
WHERE q.group_code='KS' AND q.status='published'
  AND length(btrim(q.stem_md))<30
ORDER BY c.code,q.id;

-- 5) Review flags are not a substitute for verification of reviewer identity
-- and signed source-page/rationale evidence.
SELECT c.code, count(*) AS published_count,
       count(e.question_id) AS editorial_records,
       count(*) FILTER(WHERE e.reviewer_id IS NOT NULL AND e.answer_verified
            AND e.reference_verified AND e.wording_verified
            AND e.original_authorship_verified) AS all_flags
FROM public.questions q
JOIN public.constructs c ON c.id=q.construct_id
LEFT JOIN public.question_editorial_checks e ON e.question_id=q.id
WHERE q.group_code='KS' AND q.status='published'
GROUP BY c.code ORDER BY c.code;
