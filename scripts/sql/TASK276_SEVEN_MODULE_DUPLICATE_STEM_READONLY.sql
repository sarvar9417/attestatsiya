-- TASK-276: source-aware normalized stem collision audit.
-- READ-ONLY; returns only short hashes + aggregates, never stems, options, keys, or learner data.
-- A collision is NOT an automatic correctness verdict: parametric stems may be intentionally reused.
WITH scoped AS (
 SELECT DISTINCT m.code AS module_code, q.id AS question_id,
        q.status::text AS question_status, q.format::text AS question_format,
        q.is_generated, q.source_lesson_id,
        q.assets IS NOT NULL AND q.assets NOT IN ('{}'::jsonb,'[]'::jsonb)
          AS has_assets,
        lower(regexp_replace(btrim(q.stem_md),'[[:space:]]+',' ','g')) AS normalized_stem
 FROM public.modules m
 JOIN public.lessons l ON l.module_id=m.id AND l.status='published'
 JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
 JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
 JOIN public.questions q ON q.construct_id=c.id AND q.group_code=c.group_code
 WHERE m.code IN ('M03','M06','M08','M09','M10','M11','M12')
   AND q.status IN ('published','review')
   AND coalesce(btrim(q.stem_md),'') <> ''
),
collision_groups AS (
 SELECT module_code, normalized_stem,
        count(DISTINCT question_id) AS item_ids,
        count(*) FILTER (WHERE question_status='review') AS review_items,
        count(*) FILTER (WHERE question_status='published') AS published_items,
        count(*) FILTER (WHERE is_generated) AS generated_items,
        count(DISTINCT question_format) AS format_types,
        count(DISTINCT source_lesson_id) AS distinct_source_lessons,
        count(*) FILTER (WHERE has_assets) AS asset_backed_items
 FROM scoped
 GROUP BY module_code, normalized_stem
 HAVING count(DISTINCT question_id) > 1
)
SELECT module_code, left(md5(normalized_stem),12) AS pseudonymous_stem_id,
       item_ids, item_ids-1 AS excess_same_stem_ids,
       review_items, published_items, generated_items,
       format_types, distinct_source_lessons, asset_backed_items,
       'REVIEW_EACH_REVISION_NO_AUTO_DELETE'::text AS review_gate
FROM collision_groups
ORDER BY module_code, item_ids DESC, pseudonymous_stem_id;
