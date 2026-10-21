-- Read-only audit: exact published pedagogy source-label/hashtag leakage.
-- Reports both original immutable published rows and staged editorial revisions.
-- This is an editorial *candidate* detector; matched items still require source review.
WITH candidate AS (
  SELECT q.id, q.group_code, q.status, q.source_reference, q.stem_md,
    CASE
      WHEN q.stem_md ~* '^#[[:alnum:]_]{3,40}' THEN 'telegram_hashtag'
      WHEN q.stem_md ~* 'pedmahorat[[:space:]]*[|][[:space:]]*guli' THEN 'pedguli_label'
      WHEN q.stem_md ~* '(asl[[:space:]]+(pdf|manba|to.plam)|manbadagi|(^|[[:space:]])manbada[[:space:]]|manbaga[[:space:]]+ko.ra|manba[[:space:]]+qaysi|manba[[:space:]]+to.plam|pdfda)'
        THEN 'external_source_dependent'
      ELSE 'none'
    END AS issue
  FROM public.questions q
  WHERE q.group_code IN ('KS','PM.GEN','PM.MET') AND q.status='published'
)
SELECT c.id, c.group_code, c.status, c.issue, c.source_reference,
       left(c.stem_md,240) AS original_stem_preview,
       count(DISTINCT o.id) AS original_options,
       count(DISTINCT nullif(btrim(o.content_md),'')) AS distinct_original_options,
       r.revision_question_id, rr.status AS revision_status,
       left(rr.stem_md,240) AS replacement_preview,
       coalesce(array_agg(DISTINCT f.finding_code) FILTER (WHERE f.resolved_at IS NULL),ARRAY[]::text[]) AS unresolved_findings
FROM candidate c
LEFT JOIN public.question_options o ON o.question_id=c.id
LEFT JOIN public.pedagogy_revision_queue r ON r.source_question_id=c.id
LEFT JOIN public.questions rr ON rr.id=r.revision_question_id
LEFT JOIN public.question_quality_findings f ON f.question_id=c.id
WHERE c.issue <> 'none'
GROUP BY c.id,c.group_code,c.status,c.issue,c.source_reference,c.stem_md,
  r.revision_question_id,rr.status,rr.stem_md
ORDER BY c.issue,c.group_code,c.id;
