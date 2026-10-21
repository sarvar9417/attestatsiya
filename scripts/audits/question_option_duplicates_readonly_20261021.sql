-- READ ONLY. Find exact normalized duplicate options within the same existing question.
-- This does not alter original options or grading keys, and does not expose answer-key payloads.
WITH repeated_options AS (
 SELECT question_id,side,
        lower(regexp_replace(trim(content_md),'[[:space:][:punct:]]+',' ','g')) AS normalized_option,
        count(*) AS occurrences
 FROM public.question_options
 WHERE side='a'
 GROUP BY question_id,side,
          lower(regexp_replace(trim(content_md),'[[:space:][:punct:]]+',' ','g'))
 HAVING count(*)>1
)
SELECT s.code AS subject_code,q.status::text AS question_status,
       q.format::text AS format,count(DISTINCT q.id) AS affected_questions
FROM repeated_options r
JOIN public.questions q ON q.id=r.question_id
LEFT JOIN public.subjects s ON s.id=q.subject_id
GROUP BY s.code,q.status::text,q.format::text
ORDER BY question_status,format,affected_questions DESC;

-- Metadata-only remediation queue; no stem, option text or private key.
WITH repeat_ids AS (
 SELECT question_id
 FROM public.question_options
 WHERE side='a'
 GROUP BY question_id,lower(regexp_replace(trim(content_md),'[[:space:][:punct:]]+',' ','g'))
 HAVING count(*)>1
)
SELECT q.id,q.status::text AS question_status,q.format::text AS format,
       q.group_code,s.code AS subject_code,q.source_reference
FROM public.questions q
JOIN public.subjects s ON s.id=q.subject_id
WHERE q.id IN (SELECT question_id FROM repeat_ids)
  AND q.status::text='published'
ORDER BY s.code,q.group_code,q.id;

-- Full first-pass manifest scope and private source pending overview (counts only).
SELECT count(*) AS private_source_candidates,
       count(*) FILTER(WHERE editorial_status='needs_review') AS pending_private_review
FROM public.pedagogy_pdf_source_candidates;
