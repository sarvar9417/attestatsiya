-- TASK-206 M08 private rebalance read-only audit; safe in production.
-- Expected: 14 chapters * (18 Y1, 6 Y2, 6 Y3) = 420 review; 140 archived old Y1.
-- NO secret key / answer payload values are selected.
WITH bank AS (
  SELECT q.id, q.source_reference, q.format, q.status, q.construct_id,
    q.source_lesson_id, l.status AS lesson_status, k.payload,
    substring(q.source_reference FROM 'pyjs-2026-v2:([PJ][0-9][0-9])-') chapter
  FROM public.questions q
  LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE 'pyjs-2026-v2:%'
),
checks AS (
  SELECT b.*,
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id AND o.side='a') a_count,
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=b.id AND o.side='b') b_count,
    EXISTS (
      SELECT 1 FROM public.lesson_constructs lc
      WHERE lc.lesson_id=b.source_lesson_id AND lc.construct_id=b.construct_id
    ) mapped,
    (SELECT count(*) FROM public.question_options o
      WHERE o.question_id=b.id AND o.id::text=b.payload->>'correct_option_id') y1_key_hits,
    COALESCE(jsonb_typeof(b.payload->'pairs'),'null') y2_payload_type,
    COALESCE(jsonb_typeof(b.payload->'order'),'null') y3_payload_type,
    CASE WHEN jsonb_typeof(b.payload->'pairs')='object' THEN
      (SELECT count(*) FROM jsonb_object_keys(b.payload->'pairs')) ELSE -1 END y2_pairs,
    CASE WHEN jsonb_typeof(b.payload->'order')='array' THEN
      (SELECT count(*) FROM jsonb_array_elements_text(b.payload->'order')) ELSE -1 END y3_steps,
    EXISTS(SELECT 1 FROM jsonb_each_text(CASE WHEN jsonb_typeof(b.payload->'pairs')='object'
                                            THEN b.payload->'pairs' ELSE '{}'::jsonb END) kv
      WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.side='a' AND o.id::text=kv.key)
         OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.side='b' AND o.id::text=kv.value)
    ) y2_bad_ref,
    EXISTS(SELECT 1 FROM jsonb_array_elements_text(CASE WHEN jsonb_typeof(b.payload->'order')='array'
                                  THEN b.payload->'order' ELSE '[]'::jsonb END) v
      WHERE NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=b.id AND o.side='a' AND o.id::text=v.value)
    ) y3_bad_ref
  FROM bank b
)
SELECT
  count(*) FILTER (WHERE status='review') review_total,
  count(*) FILTER (WHERE status='review' AND format='Y1') review_y1,
  count(*) FILTER (WHERE status='review' AND format='Y2') review_y2,
  count(*) FILTER (WHERE status='review' AND format='Y3') review_y3,
  count(*) FILTER (WHERE status='archived' AND format='Y1') archived_y1,
  count(*) FILTER (WHERE status='published') unexpectedly_published,
  count(*) FILTER (WHERE status='review' AND (payload IS NULL OR NOT mapped OR lesson_status<>'review')) broken_source_key_link,
  count(*) FILTER (WHERE status='review' AND format='Y1' AND (a_count<>4 OR b_count<>0 OR y1_key_hits<>1)) broken_y1,
  count(*) FILTER (WHERE status='review' AND format='Y2' AND (a_count<>4 OR b_count<>4 OR y2_pairs<>4 OR y2_bad_ref)) broken_y2,
  count(*) FILTER (WHERE status='review' AND format='Y3' AND (a_count<>4 OR b_count<>0 OR y3_steps<>4 OR y3_bad_ref)) broken_y3,
  count(distinct chapter) FILTER(WHERE status='review') chapter_count,
  (SELECT count(*) FROM public.lessons WHERE slug LIKE 'pyjs-v2-%' AND status='review') review_lessons
FROM checks;

-- Chapter-by-chapter distribution, with retained archived history.
SELECT
  substring(source_reference FROM 'pyjs-2026-v2:([PJ][0-9][0-9])-') chapter,
  count(*) FILTER (WHERE status='review' AND format='Y1') y1,
  count(*) FILTER (WHERE status='review' AND format='Y2') y2,
  count(*) FILTER (WHERE status='review' AND format='Y3') y3,
  count(*) FILTER (WHERE status='archived' AND format='Y1') archived_y1
FROM public.questions
WHERE source_reference LIKE 'pyjs-2026-v2:%'
GROUP BY chapter
ORDER BY chapter;
