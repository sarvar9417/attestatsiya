-- TASK-343 read-only inventory. No learner answer keys, options or source texts exposed.
-- Run before and after any editorial replacement batch.
SELECT q.status::text AS status, q.group_code, q.format::text AS format,
       count(*) AS source_only,
       count(*) FILTER (WHERE EXISTS(
         SELECT 1 FROM public.exam_items ei WHERE ei.question_id=q.id
       )) AS in_historical_exams,
       count(*) FILTER (WHERE q.assets='[]'::jsonb
          AND q.stem_md ~* '(surat|rasmda|tasvirlangan)') AS missing_asset_review
FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE public.question_explanation_is_source_only(k.explanation_md)
  AND k.explanation_md IS NOT NULL AND btrim(k.explanation_md) <> ''
GROUP BY q.status,q.group_code,q.format
ORDER BY source_only DESC, q.status,q.group_code;

-- Specific affected question IDs for secure editor workflow, without answer material.
SELECT q.id,q.status::text,q.group_code,q.source_reference
FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE public.question_explanation_is_source_only(k.explanation_md)
  AND k.explanation_md IS NOT NULL AND btrim(k.explanation_md)<>''
ORDER BY q.status,q.source_reference;
