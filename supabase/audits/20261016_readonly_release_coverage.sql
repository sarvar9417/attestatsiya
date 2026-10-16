-- Read-only release readiness audit for the active Supabase schema.
-- Production-safe: SELECT only. NEVER auto-fill a missing source or guess a
-- canonical lesson ID. Review orphan-like rows before any repair migration.
-- Execute in production only under read-only permissions.
WITH published AS (
 SELECT q.id,q.construct_id,q.source_lesson_id,q.source_reference,
        q.group_code,q.format,q.cognitive,q.stem_md
 FROM public.questions q WHERE q.status='published'::public.content_status
), objectives AS (
 SELECT c.id,c.code,c.group_code,COUNT(p.id)::integer AS n
 FROM public.constructs c LEFT JOIN published p ON p.construct_id=c.id
 WHERE c.is_active=true GROUP BY c.id,c.code,c.group_code
), summary AS (
 SELECT
  (SELECT count(*) FROM public.questions)::integer AS all_questions,
  (SELECT count(*) FROM published)::integer AS published_questions,
  (SELECT count(*) FROM objectives)::integer AS active_constructs,
  (SELECT count(*) FROM objectives WHERE n=0)::integer AS empty_constructs,
  (SELECT count(*) FROM objectives WHERE n<20)::integer AS under_20_constructs,
  (SELECT count(*) FROM published WHERE coalesce(btrim(source_reference),'')='')::integer AS missing_source_refs,
  (SELECT count(*) FROM published WHERE source_lesson_id IS NULL)::integer AS missing_lesson_links,
  (SELECT count(*) FROM published p WHERE NOT EXISTS(
     SELECT 1 FROM public.question_keys k WHERE k.question_id=p.id))::integer AS missing_answer_keys,
  (SELECT count(*) FROM published p WHERE NOT EXISTS(
     SELECT 1 FROM public.lesson_constructs lc
      JOIN public.lessons l ON l.id=lc.lesson_id
     WHERE lc.lesson_id=p.source_lesson_id AND lc.construct_id=p.construct_id
      AND l.status='published'::public.content_status))::integer AS noncanonical_lesson_links
)
SELECT jsonb_pretty(to_jsonb(summary)) AS release_summary FROM summary;

-- Inspect only zero-question constructs (no source text is copied to logs).
WITH p AS (
 SELECT q.construct_id,COUNT(*) AS n FROM public.questions q
 WHERE q.status='published'::public.content_status GROUP BY q.construct_id
)
SELECT c.code,c.group_code,coalesce(p.n,0) AS published_count
FROM public.constructs c LEFT JOIN p ON p.construct_id=c.id
WHERE c.is_active=true AND coalesce(p.n,0)=0
ORDER BY c.code;

-- Inspect top deficient constructs, strongest bottleneck first.
WITH p AS (
 SELECT q.construct_id,COUNT(*) AS n FROM public.questions q
 WHERE q.status='published'::public.content_status GROUP BY q.construct_id
)
SELECT c.code,c.group_code,coalesce(p.n,0) AS published_count,
       greatest(20-coalesce(p.n,0),0) AS needed_to_reach_twenty
FROM public.constructs c LEFT JOIN p ON p.construct_id=c.id
WHERE c.is_active=true AND coalesce(p.n,0)<20
ORDER BY needed_to_reach_twenty DESC,c.code;

-- Issues have explicit IDs for expert repair; not for automatic mutation.
SELECT q.id,q.group_code,c.code AS construct_code,
       CASE WHEN coalesce(btrim(q.source_reference),'')='' THEN 'source_reference_missing'
            WHEN q.source_lesson_id IS NULL THEN 'source_lesson_missing'
            WHEN NOT EXISTS (
              SELECT 1 FROM public.lesson_constructs lc
              JOIN public.lessons l ON l.id=lc.lesson_id
              WHERE lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id
                AND l.status='published'::public.content_status)
            THEN 'lesson_construct_not_published_or_unmatched' END AS first_issue
FROM public.questions q
LEFT JOIN public.constructs c ON c.id=q.construct_id
WHERE q.status='published'::public.content_status
AND (coalesce(btrim(q.source_reference),'')='' OR q.source_lesson_id IS NULL OR
 NOT EXISTS (SELECT 1 FROM public.lesson_constructs lc JOIN public.lessons l ON l.id=lc.lesson_id
 WHERE lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id
 AND l.status='published'::public.content_status))
ORDER BY c.code,q.id;
