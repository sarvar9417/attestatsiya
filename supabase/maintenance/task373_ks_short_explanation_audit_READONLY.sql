-- TASK-373: SELECT ONLY — no production writes.
SELECT q.status::text AS status,q.group_code,q.format::text AS format,
       count(*) AS question_count,
       count(*) FILTER (WHERE length(trim(coalesce(k.explanation_md,''))) < 80) AS short_explanations,
       count(*) FILTER (WHERE EXISTS (
         SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
       )) AS queued
FROM public.questions q JOIN public.question_keys k ON q.id=k.question_id
WHERE q.group_code='KS'
GROUP BY 1,2,3 ORDER BY status,format;

SELECT q.source_reference,
       length(trim(coalesce(k.explanation_md,''))) AS explanation_chars
FROM public.questions q JOIN public.question_keys k ON q.id=k.question_id
WHERE q.status='published' AND q.group_code='KS' AND q.format='Y1'
  AND length(trim(coalesce(k.explanation_md,''))) < 80
  AND NOT EXISTS (
    SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
  )
ORDER BY q.source_reference;
