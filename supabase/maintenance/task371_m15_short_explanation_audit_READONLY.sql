-- TASK-371 | READ ONLY. Counts do not imply automatic correctness failures.
-- The only production query permitted without user release authorization.
SELECT q.status::text status,
       count(*) AS m15_topic_test_questions,
       count(*) FILTER (WHERE char_length(trim(coalesce(k.explanation_md,''))) < 80) AS explanation_shorter_than_80,
       count(*) FILTER (WHERE EXISTS(
         SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
       )) AS queued_revisions
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'authored:m15-topictest-20261018:%'
GROUP BY q.status ORDER BY q.status;

-- Keyless, privacy-safe readiness check. Never pull an exam or student's data.
SELECT q.source_reference,q.group_code,q.format::text,
       char_length(trim(k.explanation_md)) AS original_explanation_chars
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'authored:m15-topictest-20261018:%'
  AND q.status='published' AND char_length(trim(k.explanation_md)) < 80
ORDER BY q.source_reference;
