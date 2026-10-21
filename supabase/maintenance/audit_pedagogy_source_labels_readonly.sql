-- Read-only inspection of source labels leaking into pedagogy question stems.
-- Do not mutate published questions: assessment attempt integrity requires immutable revisions.
-- Run against Supabase using an administrative SQL console.
WITH suspect AS (
  SELECT q.id, q.group_code, q.status, q.source_reference, q.stem_md,
    CASE
      WHEN q.stem_md ~* '^[[:space:]]*pedmahorat[[:space:]]*[|][[:space:]]*guli' THEN 'pedguli_label'
      WHEN q.stem_md ~* '^[[:space:]]*(manba|telegram|pdf)[[:space:]]*[:|]' THEN 'generic_source_prefix'
      ELSE 'none'
    END AS reason
  FROM public.questions q
  WHERE q.group_code IN ('KS','PM.GEN','PM.MET')
)
SELECT s.id, s.group_code, s.status, s.reason, s.source_reference,
       left(s.stem_md,240) AS stem_preview,
       count(o.id) AS option_count,
       count(DISTINCT nullif(btrim(o.content_md),'')) AS distinct_options,
       coalesce(array_agg(DISTINCT f.finding_code) FILTER (WHERE f.resolved_at IS NULL),ARRAY[]::text[]) AS open_findings
FROM suspect s
LEFT JOIN public.question_options o ON o.question_id=s.id
LEFT JOIN public.question_quality_findings f ON f.question_id=s.id
WHERE s.reason <> 'none'
GROUP BY s.id,s.group_code,s.status,s.reason,s.source_reference,s.stem_md
ORDER BY s.status,s.group_code,s.id;
