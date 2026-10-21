-- TASK-374 | SELECT ONLY. No production data mutation.
SELECT q.group_code,q.status::text status,q.format::text format,count(*) total,
  count(*) FILTER (WHERE length(trim(coalesce(k.explanation_md,''))) < 80) AS short80,
  count(*) FILTER (WHERE EXISTS(
     SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
  )) AS queued
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.group_code='PM.GEN'
AND q.source_reference NOT LIKE 'authored:m15-topictest-20261018:%'
GROUP BY 1,2,3 ORDER BY status,format;

-- Keyless candidate IDs only; does not return correct answers.
SELECT q.source_reference,length(trim(coalesce(k.explanation_md,''))) explanation_chars
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='published' AND q.group_code='PM.GEN' AND q.format='Y1'
  AND q.source_reference NOT LIKE 'authored:m15-topictest-20261018:%'
  AND length(trim(coalesce(k.explanation_md,''))) < 80
  AND NOT EXISTS(
    SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
  )
ORDER BY length(trim(k.explanation_md)),q.source_reference;
