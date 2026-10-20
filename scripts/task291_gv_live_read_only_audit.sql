-- TASK-291: Grafika/veb test bank: production READ-ONLY diagnostic audit.
-- Never expose learner answer keys, full stems, or editorial notes.
-- Execute manually; return aggregate counts and anomalous stable UUID only.

SELECT q.status, q.format, count(*) AS n
FROM public.questions q WHERE q.group_code='S5.WEB'
GROUP BY 1,2 ORDER BY 1,2;

WITH active AS (
 SELECT q.id,q.status,q.format,q.stem_md,q.assets,coalesce(k.explanation_md,'') exp,c.code,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') AS left_n,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') AS right_n,
 (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs')) AS pair_n
 FROM public.questions q JOIN public.constructs c ON c.id=q.construct_id
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code='S5.WEB' AND q.status IN ('published','review')
)
SELECT status,format,count(*) AS n,
 count(*) FILTER(WHERE length(stem_md)<55) AS short_stem_review,
 count(*) FILTER(WHERE length(exp)<60) AS short_explanation_review,
 count(*) FILTER(WHERE assets='[]'::jsonb) AS without_diagram,
 count(*) FILTER(WHERE code IN ('S5.WEB.04','S5.WEB.05','S5.WEB.06') AND stem_md !~* '(<[a-z]|&lt;|style=|class=|color:|colspan|rowspan|href=|src=|font-size|@media)') AS web_without_code,
 count(*) FILTER(WHERE format='Y2' AND (left_n NOT IN (3,4) OR right_n<>left_n OR pair_n<>left_n)) AS y2_side_contract_anomalies
FROM active GROUP BY 1,2 ORDER BY 1,2;

SELECT q.id,q.status,c.code AS construct_code,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') AS n_left,
 (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b') AS n_right
FROM public.questions q JOIN public.constructs c ON c.id=q.construct_id
WHERE q.group_code='S5.WEB' AND q.status='published' AND q.format='Y2';
