-- TASK-349: production READ-ONLY quality check. Safe to rerun.
-- No private answer keys, student records, option text, or Telegram post bodies returned.

-- 1. The original imported set is frozen: 140 items, 56 review and 84 archived.
SELECT count(*) AS source_total,
       count(*) FILTER (WHERE q.status='review') AS source_review,
       count(*) FILTER (WHERE q.status='archived') AS source_archived,
       count(*) FILTER (WHERE q.status='published') AS source_in_learner_pool,
       count(*) FILTER (
         WHERE q.status='review'
         AND length(trim(k.explanation_md))>=95
         AND NOT public.question_explanation_is_source_only(k.explanation_md)
       ) AS review_with_educational_explanation
FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'telegram:@PedMahoratGuli:%';

-- 2. Follow immutable revision chains rather than assuming a single replacement.
WITH RECURSIVE lineage AS (
  SELECT id AS original_id,id AS current_id,0 AS depth
  FROM public.questions
  WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%' AND status='archived'
  UNION ALL
  SELECT c.original_id,r.revision_question_id,c.depth+1
  FROM lineage c
  JOIN public.pedagogy_revision_queue r ON r.source_question_id=c.current_id
  WHERE c.depth<8
), terminal AS (
  SELECT original_id,current_id,depth,
     row_number() OVER (PARTITION BY original_id ORDER BY depth DESC) AS rank
  FROM lineage
)
SELECT q.status::text AS terminal_status,count(*) AS original_questions
FROM terminal c JOIN public.questions q ON q.id=c.current_id
WHERE c.rank=1 GROUP BY q.status ORDER BY terminal_status;

-- 3. Check final learner revisions without exposing their correct options.
WITH RECURSIVE lineage AS (
  SELECT id AS original_id,id AS current_id,0 AS depth
  FROM public.questions
  WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%' AND status='archived'
  UNION ALL
  SELECT c.original_id,r.revision_question_id,c.depth+1
  FROM lineage c JOIN public.pedagogy_revision_queue r ON r.source_question_id=c.current_id
  WHERE c.depth<8
), ranked AS (
  SELECT original_id,current_id,depth,
     row_number() OVER (PARTITION BY original_id ORDER BY depth DESC) AS rn
  FROM lineage
), verified AS (
  SELECT c.original_id,c.current_id,c.depth,
    (SELECT o.content_md FROM public.question_options o
      JOIN public.question_keys k ON k.question_id=o.question_id
      WHERE o.question_id=c.original_id
        AND o.id::text=k.payload->>'correct_option_id') AS before_answer,
    (SELECT o.content_md FROM public.question_options o
      JOIN public.question_keys k ON k.question_id=o.question_id
      WHERE o.question_id=c.current_id
        AND o.id::text=k.payload->>'correct_option_id') AS after_answer,
    (SELECT count(*) FROM public.question_options o
      WHERE o.question_id=c.current_id) AS option_count,
    (SELECT count(DISTINCT lower(trim(o.content_md)))
      FROM public.question_options o WHERE o.question_id=c.current_id) AS distinct_options,
    length(trim(k.explanation_md)) AS explanation_length,
    public.question_explanation_is_source_only(k.explanation_md) AS source_only
  FROM ranked c
  JOIN public.questions q ON q.id=c.current_id AND q.status='published'
  JOIN public.question_keys k ON k.question_id=c.current_id
  WHERE c.rn=1
)
SELECT count(*) AS learner_replacements,
  count(*) FILTER (
    WHERE btrim(split_part(before_answer,'◀',1),E' \n\r\t')
        = btrim(split_part(after_answer,'◀',1),E' \n\r\t')
  ) AS preserved_key_meaning,
  count(*) FILTER (WHERE option_count=4 AND distinct_options=4) AS distinct_four_options,
  count(*) FILTER (WHERE explanation_length>=100 AND NOT source_only) AS educational_explanation,
  count(*) FILTER (WHERE depth>=2) AS subsequent_revision_chains
FROM verified;

-- 4. Other source-only explanations must never reappear in a published pool.
SELECT count(*) AS published_source_only
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='published' AND public.question_explanation_is_source_only(k.explanation_md);

-- 5. Evidence-backed quarantine count (do not publish unless individually corrected).
SELECT count(*) AS archived_ambiguous
FROM public.question_quality_findings f
JOIN public.questions q ON q.id=f.question_id
WHERE f.finding_code='task349_ambiguous_key' AND q.status='archived';

-- 6. Original historical answers were not altered. Count only, no learner IDs.
SELECT count(DISTINCT ei.question_id) AS original_questions_used,
  count(*) AS preserved_historical_items
FROM public.exam_items ei JOIN public.questions q ON q.id=ei.question_id
WHERE q.source_reference LIKE 'telegram:@PedMahoratGuli:%';
