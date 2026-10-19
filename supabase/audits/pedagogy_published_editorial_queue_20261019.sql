-- Published pedagogy editorial triage. SELECT-only: no content, keys or learner data exported.
-- Run this script on an authorized read-only PostgreSQL connection.
BEGIN TRANSACTION READ ONLY;
WITH base AS (
  SELECT q.id AS question_uuid, q.id::text AS question_id,
         q.group_code, c.code AS construct_code, q.format::text AS format,
         split_part(coalesce(q.source_reference, ''), ':', 1) AS source_family,
         regexp_replace(lower(btrim(coalesce(q.stem_md, ''))), '[[:space:]]+', ' ', 'g') AS normalized_stem,
         ec.question_id IS NOT NULL AS has_editorial_record,
         coalesce(ec.answer_verified,false) AND coalesce(ec.reference_verified,false)
           AND coalesce(ec.wording_verified,false) AND coalesce(ec.original_authorship_verified,false) AS four_flags_recorded,
         length(btrim(coalesce(k.explanation_md,''))) AS explanation_chars,
         k.payload->>'correct_option_id' AS correct_option_id
  FROM public.questions q
  JOIN public.constructs c ON c.id = q.construct_id
  LEFT JOIN public.question_editorial_checks ec ON ec.question_id = q.id
  LEFT JOIN public.question_keys k ON k.question_id = q.id
  WHERE q.status = 'published' AND q.group_code IN ('KS','PM.GEN','PM.MET')
),
options AS (
  SELECT b.question_uuid,
         count(o.id) FILTER (WHERE o.side='a') AS option_a_count,
         count(o.id) FILTER (WHERE o.side='b') AS option_b_count,
         count(DISTINCT regexp_replace(lower(btrim(o.content_md)), '[[:space:]]+', ' ', 'g'))
           FILTER (WHERE o.side='a') AS distinct_a_count,
         max(length(btrim(o.content_md))) FILTER (WHERE o.side='a' AND o.id::text = b.correct_option_id) AS correct_chars,
         max(length(btrim(o.content_md))) FILTER (WHERE o.side='a' AND o.id::text IS DISTINCT FROM b.correct_option_id) AS longest_distractor_chars,
         count(o.id) FILTER (WHERE o.side='a' AND o.id::text = b.correct_option_id) AS matched_correct_option_count
  FROM base b
  LEFT JOIN public.question_options o ON o.question_id = b.question_uuid
  GROUP BY b.question_uuid
),
stems AS (
  SELECT construct_code, normalized_stem, count(*) AS identical_stem_count
  FROM base GROUP BY construct_code, normalized_stem
),
scored AS (
  SELECT b.*, o.option_a_count, o.option_b_count, o.distinct_a_count,
         o.matched_correct_option_count, s.identical_stem_count,
         (b.format='Y1' AND o.correct_chars>o.longest_distractor_chars) AS correct_uniquely_longest,
         (b.format='Y1' AND o.correct_chars>o.longest_distractor_chars * 1.30) AS length_gap_over_30pct,
         CASE WHEN NOT b.has_editorial_record THEN 100 ELSE 0 END
         + CASE WHEN NOT b.four_flags_recorded THEN 10 ELSE 0 END
         + CASE WHEN b.explanation_chars < 40 THEN 25 ELSE 0 END
         + CASE WHEN b.format='Y1' AND o.correct_chars>o.longest_distractor_chars THEN 20 ELSE 0 END
         + CASE WHEN b.format='Y1' AND o.correct_chars>o.longest_distractor_chars * 1.30 THEN 15 ELSE 0 END
         + CASE WHEN s.identical_stem_count>1 THEN 30 ELSE 0 END
         + CASE WHEN b.format='Y1' AND (o.option_a_count<>4 OR o.distinct_a_count<>4 OR o.matched_correct_option_count<>1) THEN 100 ELSE 0 END
         AS priority_score
  FROM base b
  JOIN options o ON o.question_uuid=b.question_uuid
  JOIN stems s ON s.construct_code=b.construct_code AND s.normalized_stem=b.normalized_stem
)
SELECT question_id, group_code, construct_code, format, source_family,
       has_editorial_record, four_flags_recorded, explanation_chars,
       option_a_count, option_b_count, identical_stem_count,
       coalesce(correct_uniquely_longest,false) AS correct_uniquely_longest,
       coalesce(length_gap_over_30pct,false) AS length_gap_over_30pct,
       priority_score,
       array_remove(ARRAY[
         CASE WHEN NOT has_editorial_record THEN 'NO_EDITORIAL_RECORD' END,
         CASE WHEN NOT four_flags_recorded THEN 'FOUR_CHECK_FLAGS_MISSING' END,
         CASE WHEN explanation_chars<40 THEN 'SHORT_EXPLANATION' END,
         CASE WHEN identical_stem_count>1 THEN 'IDENTICAL_STEM_REVIEW' END,
         CASE WHEN correct_uniquely_longest THEN 'Y1_CORRECT_LONGEST' END,
         CASE WHEN length_gap_over_30pct THEN 'Y1_LENGTH_GAP_OVER_30PCT' END,
         CASE WHEN format='Y1' AND (option_a_count<>4 OR distinct_a_count<>4 OR matched_correct_option_count<>1)
           THEN 'Y1_OPTION_OR_KEY_SHAPE' END,
         'SOURCE_PAGE_NOT_VERIFIED_BY_THIS_QUERY'
       ],NULL) AS review_reasons
FROM scored
ORDER BY priority_score DESC, construct_code, question_id;
COMMIT;