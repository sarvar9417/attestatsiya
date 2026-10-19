-- TASK-276: source-aware normalized stem + option-payload collision audit.
-- READ-ONLY; returns only pseudonymous stem hashes + aggregates, never stems/options/keys or learner data.
-- Same-stem Y2/Y3 tasks with different options are expected; NEVER auto-hide or archive based on stem alone.
WITH option_signatures AS (
 SELECT o.question_id,
        md5(string_agg(
          lower(regexp_replace(btrim(o.content_md),'[[:space:]]+',' ','g')),
          '|' ORDER BY lower(regexp_replace(btrim(o.content_md),'[[:space:]]+',' ','g'))
        )) AS option_fingerprint
 FROM public.question_options o
 GROUP BY o.question_id
),
scoped AS (
 SELECT DISTINCT m.code AS module_code, q.id AS question_id,
        q.status::text AS question_status, q.format::text AS question_format,
        q.is_generated, q.source_lesson_id,
        q.assets IS NOT NULL AND q.assets NOT IN ('{}'::jsonb,'[]'::jsonb) AS has_assets,
        lower(regexp_replace(btrim(q.stem_md),'[[:space:]]+',' ','g')) AS normalized_stem,
        coalesce(os.option_fingerprint,'NO_OPTIONS') AS option_fingerprint
 FROM public.modules m
 JOIN public.lessons l ON l.module_id=m.id AND l.status='published'
 JOIN public.lesson_constructs lc ON lc.lesson_id=l.id
 JOIN public.constructs c ON c.id=lc.construct_id AND c.is_active
 JOIN public.questions q ON q.construct_id=c.id AND q.group_code=c.group_code
 LEFT JOIN option_signatures os ON os.question_id=q.id
 WHERE m.code IN ('M03','M06','M08','M09','M10','M11','M12')
   AND q.status IN ('published','review')
   AND coalesce(btrim(q.stem_md),'') <> ''
),
collision_groups AS (
 SELECT module_code, normalized_stem,
        count(DISTINCT question_id) AS item_ids,
        count(DISTINCT option_fingerprint) AS distinct_option_sets,
        min(question_format) AS example_format,
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
       example_format, item_ids, item_ids-1 AS excess_same_stem_ids,
       distinct_option_sets,
       greatest(item_ids-distinct_option_sets,0) AS possible_same_options_excess,
       review_items, published_items, generated_items,
       format_types, distinct_source_lessons, asset_backed_items,
       CASE WHEN distinct_option_sets=item_ids
          THEN 'GENERIC_STEM_DISTINCT_OPTIONS_NO_AUTO_DELETE'
          ELSE 'POTENTIAL_OPTIONS_COLLISION_EXPERT_REVIEW' END AS review_gate
FROM collision_groups
ORDER BY module_code, item_ids DESC, pseudonymous_stem_id;
