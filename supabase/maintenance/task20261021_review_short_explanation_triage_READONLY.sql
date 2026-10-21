-- 2026-10-21: Short-explanation REVIEW bank source QA. READ ONLY.
-- For local Supabase/psql after git pull. Never alters keys, stems, statuses or
-- migration history. Does not return private stems, options or correct answers.
-- Do not classify a short but sufficient mathematical proof as incorrect.
-- A source locator existing does not prove it supports the question's answer.

-- 1. Current review-bank explanation-length distribution.
SELECT
  q.group_code,
  q.format::text AS format,
  count(*) AS review_items,
  count(*) FILTER (WHERE length(btrim(coalesce(k.explanation_md,'')))<30) AS under_30_chars,
  count(*) FILTER (WHERE length(btrim(coalesce(k.explanation_md,'')))=0) AS blank_explanations,
  count(*) FILTER (WHERE k.question_id IS NULL) AS missing_answer_key_row
FROM public.questions q
LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='review'
GROUP BY q.group_code,q.format
ORDER BY under_30_chars DESC,review_items DESC;

-- 2. Local-only triage list of IDs and non-secret source aliases. No key payload.
-- Manually verify exact PDF page, actual tested concept, explanation sufficiency
-- and distractor quality; keep all questions in review until authorized.
WITH candidate AS (
  SELECT q.id,q.group_code,q.format::text AS format,
         split_part(split_part(coalesce(q.source_reference,''),';',1),' | ',1)
           AS source_alias,
         length(btrim(coalesce(k.explanation_md,''))) AS explanation_chars
  FROM public.questions q
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='review'
    AND length(btrim(coalesce(k.explanation_md,'')))<30
)
SELECT id,group_code,format,source_alias,explanation_chars,
  CASE
    WHEN group_code='S4.DB'
      THEN 'source_reference_sql_terminology_check'
    WHEN group_code IN ('S3.LOGIC','S3.NUM')
      THEN 'verify_math_proof_not_automatic_rejection'
    WHEN group_code='S5.WEB'
      THEN 'check_technical_key_and_exact_textbook_page'
    ELSE 'manual_explanation_and_source_review'
  END AS qa_priority
FROM candidate
ORDER BY group_code,source_alias,id;

-- 3. Cohort count and missing-source flags, not private content.
SELECT
 count(*) AS short_explanation_review_total,
 count(*) FILTER (WHERE nullif(btrim(q.source_reference),'') IS NULL)
   AS missing_source_reference,
 count(*) FILTER (WHERE q.group_code='S5.WEB') AS graphics_web_count,
 count(*) FILTER (WHERE q.group_code='S4.DB') AS access_count,
 count(*) FILTER (WHERE q.group_code='S3.LOGIC') AS logic_count,
 count(*) FILTER (WHERE q.group_code='S3.NUM') AS radix_count
FROM public.questions q
LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='review'
  AND length(btrim(coalesce(k.explanation_md,'')))<30;
