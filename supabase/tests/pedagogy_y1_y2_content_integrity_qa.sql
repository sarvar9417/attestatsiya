-- Read-only quality gates for pedagogy Y1 / Y2 staging.
-- Historical published question/answer snapshots are never altered.
BEGIN;
DO $qa$
DECLARE bad_y1 integer; bad_y2 integer; total_y1 integer; total_y2 integer;
BEGIN
 WITH y1 AS (
  SELECT q.id, count(o.id) AS n,
  count(DISTINCT lower(btrim(o.content_md))) AS distinct_n,
  min(length(o.content_md)) AS shortest,
  max(length(o.content_md)) AS longest,
  count(o.id) FILTER(WHERE o.id=(k.payload->>'correct_option_id')::uuid) AS keyed_options,
  max(length(o.content_md)) FILTER(WHERE o.id=(k.payload->>'correct_option_id')::uuid) AS keylen
  FROM public.questions q
  LEFT JOIN public.question_options o ON o.question_id=q.id
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='review'::public.content_status
    AND q.group_code IN ('KS','PM.GEN','PM.MET')
    AND q.format='Y1'::public.question_format
  GROUP BY q.id
 )
 SELECT count(*),count(*) FILTER(
  WHERE n<>4 OR distinct_n<>4 OR shortest IS NULL OR shortest=0
  OR keyed_options<>1 OR keylen>1.6*shortest OR longest>2*shortest
 ) INTO total_y1,bad_y1 FROM y1;
 IF bad_y1<>0 THEN
  RAISE EXCEPTION 'Pedagogika Y1 balance/key QA failed for % of %',bad_y1,total_y1;
 END IF;

 WITH y2 AS (
  SELECT q.id,
   count(o.id) FILTER (WHERE o.side='a') AS n_a,
   count(o.id) FILTER (WHERE o.side='b') AS n_b,
   count(DISTINCT lower(btrim(o.content_md))) FILTER (WHERE o.side='a') AS unique_a,
   count(DISTINCT lower(btrim(o.content_md))) FILTER (WHERE o.side='b') AS unique_b,
   count(DISTINCT o.id) FILTER (WHERE o.side='a' AND o.id::text IN (
     SELECT key FROM jsonb_each_text(coalesce(k.payload->'pairs','{}'::jsonb)))) AS mapped_a,
   count(DISTINCT o.id) FILTER (WHERE o.side='b' AND o.id::text IN (
     SELECT value FROM jsonb_each_text(coalesce(k.payload->'pairs','{}'::jsonb)))) AS mapped_b
  FROM public.questions q
  LEFT JOIN public.question_options o ON o.question_id=q.id
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='review'::public.content_status
    AND q.group_code IN ('KS','PM.GEN','PM.MET')
    AND q.format='Y2'::public.question_format
  GROUP BY q.id
 )
 SELECT count(*),count(*) FILTER(
 WHERE n_a<>4 OR n_b<>4 OR unique_a<>4 OR unique_b<>4 OR mapped_a<>4 OR mapped_b<>4)
 INTO total_y2,bad_y2 FROM y2;
 IF bad_y2<>0 THEN
  RAISE EXCEPTION 'Pedagogika Y2 matching QA failed for % of %',bad_y2,total_y2;
 END IF;
 RAISE NOTICE 'Pedagogika question QA passed: Y1 %, Y2 %', total_y1,total_y2;
END
$qa$;
ROLLBACK;