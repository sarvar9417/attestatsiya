-- M08 programming content release verification, read-only. No keys or private options projected.
WITH staged AS (
  SELECT q.id,q.status,q.format,q.source_reference,q.source_lesson_id,q.construct_id,
    EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id) keyed,
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') left_opts,
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') right_opts,
    EXISTS(SELECT 1 FROM public.lesson_constructs lc WHERE lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id) consistent
  FROM public.questions q
  WHERE q.source_reference LIKE 'pyjs-2026-v2:%'
     OR q.source_reference LIKE 'pyjs-demo-style-20261020:%'
)
SELECT
  CASE WHEN source_reference LIKE 'pyjs-demo-style-20261020:%' THEN '20261020_demo_draft' ELSE '2026_v2' END cohort,
  status::text,format::text,count(*)::int questions,
  count(*) FILTER(WHERE NOT keyed)::int no_key,
  count(*) FILTER(WHERE NOT consistent)::int no_lesson_construct,
  count(*) FILTER(WHERE format='Y1' AND (left_opts<>4 OR right_opts<>0))::int wrong_y1_options,
  count(*) FILTER(WHERE format='Y2' AND (left_opts<>4 OR right_opts<>4))::int wrong_y2_options,
  count(*) FILTER(WHERE format='Y3' AND (left_opts<>4 OR right_opts<>0))::int wrong_y3_options
FROM staged GROUP BY 1,2,3 ORDER BY 1,2,3;