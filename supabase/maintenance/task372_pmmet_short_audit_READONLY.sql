-- TASK-372: READ ONLY. Do not change production data.
SELECT q.group_code,q.status::text status,q.format::text format,
       count(*) AS count,
       count(*) FILTER (WHERE char_length(trim(coalesce(k.explanation_md,'')))<80) AS shorter_than_80,
       count(*) FILTER (WHERE EXISTS (
         SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
       )) AS already_queued
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.group_code='PM.MET'
GROUP BY 1,2,3 ORDER BY status,format;

-- Recheck the identity of 35 candidate sources without revealing answer keys.
SELECT q.source_reference,q.status::text status,
       char_length(trim(k.explanation_md)) AS explanation_chars
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.group_code='PM.MET' AND q.status='published' AND q.format='Y1'
  AND char_length(trim(k.explanation_md)) < 80
  AND NOT EXISTS (
    SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
  )
ORDER BY q.source_reference;
