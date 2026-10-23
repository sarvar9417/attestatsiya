-- 2026-10-23. READ-ONLY published-question editorial risk queue.
-- Safe for production inspection. NO question/options/keys or user-data writes.
-- Unresolved findings are review SIGNALS, not proven invalid answer keys.
-- Do not auto-archive or rewrite published questions from this output.
--
-- 1. Distinct question counts by risk and exam group.
WITH per_question AS (
  SELECT q.id, q.group_code,
         bool_or(f.severity = 'high') AS high_risk,
         bool_or(f.finding_code = 'editorial_evidence_missing') AS missing_evidence,
         bool_or(f.finding_code = 'y1_answer_length_high_risk') AS length_risk,
         bool_or(f.finding_code = 'independent_editorial_review_required') AS needs_independent_review,
         count(*) AS unresolved_flag_count
  FROM public.questions q
  JOIN public.question_quality_findings f ON f.question_id = q.id
  WHERE q.status::text = 'published'
    AND f.resolved_at IS NULL
  GROUP BY q.id, q.group_code
)
SELECT group_code, count(*) AS distinct_questions_with_any_flag,
       count(*) FILTER (WHERE high_risk) AS distinct_high_risk_questions,
       count(*) FILTER (WHERE missing_evidence) AS distinct_missing_evidence,
       count(*) FILTER (WHERE length_risk) AS distinct_longest_answer_risk,
       count(*) FILTER (WHERE needs_independent_review) AS distinct_independent_review,
       sum(unresolved_flag_count) AS flag_rows_not_distinct_questions
FROM per_question
GROUP BY group_code
ORDER BY distinct_high_risk_questions DESC, distinct_questions_with_any_flag DESC;

-- 2. Small, stable review queue, without leaking stems, options or answer keys.
-- Editorial review must consult the original source and stored immutable version.
WITH findings AS (
  SELECT f.question_id,
         bool_or(f.severity='high') AS high_risk,
         bool_or(f.finding_code='independent_editorial_review_required') AS needs_review,
         bool_or(f.finding_code='y1_answer_length_high_risk') AS length_risk,
         bool_or(f.finding_code='editorial_evidence_missing') AS missing_evidence,
         array_agg(DISTINCT f.finding_code ORDER BY f.finding_code) AS flags,
         min(f.detected_at) AS first_detected
  FROM public.question_quality_findings f
  WHERE f.resolved_at IS NULL
  GROUP BY f.question_id
)
SELECT q.id AS question_id,
       q.group_code,
       q.format::text AS format,
       q.cognitive::text AS cognitive,
       q.construct_id,
       q.source_lesson_id,
       coalesce(l.slug,'no_published_source_lesson') AS source_lesson_slug,
       f.flags,
       f.first_detected
FROM findings f
JOIN public.questions q ON q.id=f.question_id
LEFT JOIN public.lessons l ON l.id=q.source_lesson_id AND l.status::text='published'
WHERE q.status::text='published'
  AND (f.high_risk OR f.needs_review OR f.missing_evidence)
ORDER BY
  f.needs_review DESC, f.high_risk DESC,
  f.length_risk DESC, f.missing_evidence DESC,
  f.first_detected ASC, q.id
LIMIT 100;

-- 3. Specific (separate) eligibility check. The source-evidence gate is
-- currently intentionally stricter for KS/PM.GEN/PM.MET pools. A question can
-- have a high-risk heuristic flag without being conclusively wrong.
SELECT q.group_code,
       count(*) AS published_with_open_evidence_flag,
       count(*) FILTER (
         WHERE public.question_source_evidence_eligible(q.id)
       ) AS still_evidence_eligible
FROM public.questions q
JOIN public.question_quality_findings f ON f.question_id=q.id
WHERE q.status::text='published'
  AND f.resolved_at IS NULL
  AND f.finding_code='editorial_evidence_missing'
GROUP BY q.group_code
ORDER BY published_with_open_evidence_flag DESC;
