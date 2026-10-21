-- TASK-305: READ ONLY. KTD 528 PDF provenance after the 490-row label correction.
-- Never update question keys, approve reviews, or leak private answer text from this script.
-- A physical source PDF page existing does NOT prove the saved answer is correct.
-- Original PDFs and private item-level Excel evidence are stored outside public GitHub.

-- 1. Cohort status, precise extra-page attribution and historical safety.
WITH ktd AS (
  SELECT q.id,q.status,k.explanation_md,q.source_reference,
    regexp_match(k.explanation_md,'Manba: ([^,;]+), PDF ([0-9]+)[–-]([0-9]+)') book_range,
    regexp_match(k.explanation_md,
      'Qo‘shimcha sahifa raqami \(qaysi PDFga tegishli ekani aniqlanmagan; darslik sahifasi deb tasdiqlanmagan\): ([0-9]+)') extra_page
  FROM public.questions q
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'ktd-540-2026:%'
)
SELECT count(*) AS cohort_total,
 count(*) FILTER(WHERE status='review') AS review_only,
 count(*) FILTER(WHERE status='published') AS published,
 count(*) FILTER(WHERE book_range IS NOT NULL) AS named_textbook_ranges,
 count(*) FILTER(WHERE explanation_md LIKE '%Qo‘shimcha sahifa raqami (%') AS extra_page_disambiguated,
 count(*) FILTER(WHERE extra_page IS NOT NULL) AS extra_page_numbers_parsed,
 count(*) FILTER(WHERE explanation_md LIKE '%PDF sahifa %') AS ambiguous_old_label,
 count(*) FILTER(WHERE EXISTS (
   SELECT 1 FROM public.exam_items ei WHERE ei.question_id=ktd.id)) AS used_in_exam,
 count(*) FILTER(WHERE EXISTS (
   SELECT 1 FROM ktd_quality.editorial_reviews er WHERE er.question_id=ktd.id)) AS signed_reviews
FROM ktd;

-- 2. Cohort source families. Detect items that cite the exam specification
-- as the only source for a content-specific factual key.
SELECT
 CASE
  WHEN k.explanation_md LIKE '%Manba: SPEC,%' THEN 'SPEC_ANSWER_SUPPORT_REVIEW_REQUIRED'
  WHEN k.explanation_md LIKE '%Manba: CAM%' THEN 'CAMBRIDGE_BOOK'
  WHEN k.explanation_md LIKE '%Manba: ICT%' THEN 'ICT_BOOK'
  WHEN k.explanation_md LIKE '%Manba: MAR,%' THEN 'LECTURE_PDF'
  ELSE 'OTHER_NOTATION_CHECK'
 END AS source_family,
 count(*) AS review_items
FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='review' AND q.source_reference LIKE 'ktd-540-2026:%'
GROUP BY 1 ORDER BY review_items DESC;

-- 3. KTD priority zero: IDs and explanatory source string only;
-- no exam answer key or private source excerpt is included.
SELECT q.id, q.source_reference,
  substring(k.explanation_md FROM 'Manba: SPEC, PDF ([0-9]+)') AS spec_page
FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='review' AND q.source_reference LIKE 'ktd-540-2026:%'
  AND k.explanation_md LIKE '%Manba: SPEC,%'
ORDER BY q.source_reference;

-- 4. Identify any regression that reintroduces the unscoped old page field.
SELECT q.source_reference
FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.status='review' AND q.source_reference LIKE 'ktd-540-2026:%'
  AND k.explanation_md LIKE '%PDF sahifa %'
ORDER BY q.source_reference
LIMIT 25;
