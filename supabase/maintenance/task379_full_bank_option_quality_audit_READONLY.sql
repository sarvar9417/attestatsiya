-- TASK-379 · BANKWIDE READ-ONLY QUALITY AUDIT (all 8,603 records, published + review + draft + archived).
-- No revision is edited here. Numeric/lexical heuristics are CANDIDATES, not verified semantic faults.
-- Case-sensitive exact strings matter for program output: 'True', 'true' and 'TRUE' are distinct.
-- Native Y2 may be 3x3/4x4/4x5; Y3 may be 3..6 ordering items.
-- Safe to repeat in production; single JSON report by group/format.
WITH base AS (
 SELECT q.id,q.group_code,q.format::text AS fmt,q.status::text AS state,
        q.stem_md,q.source_reference,q.source_lesson_id,k.payload,k.explanation_md,
        k.payload->>'correct_option_id' correct_option_id,
        CASE WHEN jsonb_typeof(k.payload->'pairs')='object' THEN k.payload->'pairs'
             ELSE '{}'::jsonb END pairs_payload,
        CASE WHEN jsonb_typeof(k.payload->'order')='array' THEN k.payload->'order'
             ELSE '[]'::jsonb END order_payload
 FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
), shapes AS (
 SELECT b.*,
   (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id) option_n,
   (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id AND trim(o.side)='a') a_n,
   (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id AND trim(o.side)='b') b_n,
   (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=b.id AND trim(o.side)='a') a_distinct,
   (SELECT count(distinct btrim(o.content_md)) FROM public.question_options o WHERE o.question_id=b.id AND trim(o.side)='b') b_distinct,
   (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id AND o.id::text=b.correct_option_id AND trim(o.side)='a') correct_id_n,
   (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id AND trim(o.side)='a' AND o.id::text<>coalesce(b.correct_option_id,'')
     AND o.content_md ~* '(^|[^[:alpha:]])(faqat|hech|mutlaqo|umuman|har doim|hech qachon|faoliyatdan chetlatish)([^[:alpha:]]|$)') negative_cue_n,
   (SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
     FROM public.question_options o WHERE o.question_id=b.id AND o.id::text=b.correct_option_id) correct_words,
   (SELECT max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
     FROM public.question_options o WHERE o.question_id=b.id AND trim(o.side)='a' AND o.id::text<>coalesce(b.correct_option_id,'')) max_wrong_words,
   (SELECT count(*) FROM jsonb_each_text(b.pairs_payload)) pairs_n,
   (SELECT count(DISTINCT v) FROM jsonb_each_text(b.pairs_payload) t(k,v)) pairs_distinct_b,
   (SELECT count(*) FROM jsonb_each_text(b.pairs_payload) t(k,v)
     WHERE NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.side='a' AND o.id::text=t.k)
        OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.side='b' AND o.id::text=t.v)
   ) pairs_invalid_n,
   (SELECT count(*) FROM jsonb_array_elements_text(b.order_payload)) order_n,
   (SELECT count(DISTINCT v) FROM jsonb_array_elements_text(b.order_payload) t(v)) order_distinct_n,
   (SELECT count(*) FROM jsonb_array_elements_text(b.order_payload) t(v)
      WHERE NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.side='a' AND o.id::text=t.v)
   ) order_invalid_n
 FROM base b
), flag AS(
 SELECT *,
   (fmt='Y1' AND (a_n<>4 OR b_n<>0 OR correct_id_n<>1 OR a_distinct<>4)) invalid_y1,
   (fmt='Y2' AND (a_n NOT BETWEEN 3 AND 5 OR b_n<a_n OR b_n>a_n+1 OR a_distinct<>a_n OR b_distinct<>b_n
     OR pairs_n<>a_n OR pairs_distinct_b<>a_n OR pairs_invalid_n<>0)) invalid_y2,
   (fmt='Y3' AND (a_n NOT BETWEEN 3 AND 6 OR b_n<>0 OR a_distinct<>a_n OR order_n<>a_n
     OR order_distinct_n<>a_n OR order_invalid_n<>0)) invalid_y3,
   (fmt='Y1' AND a_n=4 AND correct_id_n=1 AND correct_words>max_wrong_words*1.5) answer_length_signal,
   (fmt='Y1' AND negative_cue_n>=2 AND coalesce(stem_md,'') !~* '(1[)]|2[)]|3[)]|4[)]|qaysilari.*to.g.ri|to.g.ri.*tanlang)') possible_trivial_cues,
   (explanation_md IS NULL OR length(btrim(explanation_md))<70) short_rationale,
   (source_reference IS NULL OR length(btrim(source_reference))=0 OR source_lesson_id IS NULL) source_gap
 FROM shapes
), split AS(
 SELECT group_code,fmt,state,count(*) n,
  count(*) FILTER (WHERE invalid_y1 OR invalid_y2 OR invalid_y3) structurally_invalid,
  count(*) FILTER (WHERE answer_length_signal) length_1_5x,
  count(*) FILTER (WHERE possible_trivial_cues) lexical_candidates,
  count(*) FILTER (WHERE short_rationale) short_rationale,
  count(*) FILTER (WHERE source_gap) source_missing
 FROM flag GROUP BY 1,2,3
)
SELECT jsonb_build_object(
 'scope','all_question_bank',
 'snapshot',now(),
 'question_total',(SELECT count(*) FROM flag),
 'published_total',(SELECT count(*) FROM flag WHERE state='published'),
 'review_total',(SELECT count(*) FROM flag WHERE state='review'),
 'draft_total',(SELECT count(*) FROM flag WHERE state='draft'),
 'archived_total',(SELECT count(*) FROM flag WHERE state='archived'),
 'published_structurally_invalid',(SELECT count(*) FROM flag WHERE state='published' AND (invalid_y1 OR invalid_y2 OR invalid_y3)),
 'published_y1_length_1_5x',(SELECT count(*) FROM flag WHERE state='published' AND answer_length_signal),
 'published_y1_lexical_candidates',(SELECT count(*) FROM flag WHERE state='published' AND possible_trivial_cues),
 'published_short_rationale',(SELECT count(*) FROM flag WHERE state='published' AND short_rationale),
 'published_source_gap',(SELECT count(*) FROM flag WHERE state='published' AND source_gap),
 'by_group_format_status',(SELECT jsonb_agg(x ORDER BY x.state,x.n DESC,x.group_code) FROM split x)
) AS audit;
