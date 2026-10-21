-- TASK-369 -- READ ONLY, safe for manual review. No production writes.
-- The 2026-10-21 investigation included 8,363 questions, 5,415 published.
-- Identifies source/candidate notes, not automatically bad educational content.
SELECT q.status::text AS status, count(*) AS question_count,
  count(*) FILTER (WHERE k.explanation_md ~* '(Manba javobi shu|Asl manba javobi shu|baza kandidati|PDF muallif kaliti saqlandi|Asl Javob belgisi saqlandi)') AS strong_editorial_signal,
  count(*) FILTER (WHERE k.explanation_md ~* '[\\r\\n]{2,}(\\*?Manba:|Asl manba:)') AS separate_source_paragraph,
  count(*) FILTER (WHERE public.question_explanation_is_source_only(k.explanation_md)) AS existing_source_only_guard
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
GROUP BY q.status ORDER BY status;

-- Keyless target overview only. No answers, option IDs, or student records.
SELECT q.source_reference, q.status::text AS status,
       EXISTS(SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id) AS queued
FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'authored:pedagogy-pdf-corpus:%'
AND k.explanation_md ~* '(Manba javobi shu|Asl manba javobi shu|baza kandidati|PDF muallif kaliti saqlandi|Asl Javob belgisi saqlandi)'
ORDER BY q.source_reference;
