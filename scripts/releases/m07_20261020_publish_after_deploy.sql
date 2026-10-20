-- Release gate: run ONLY after SVG asset is deployed and the QA migration has applied.
-- Idempotent. Touches 14 audited review items, does not modify attempts or existing published items.
DO $m07_publish$
DECLARE item_total integer; bad integer; updated integer;
BEGIN
 SELECT count(*) INTO item_total FROM public.questions
 WHERE source_reference LIKE 'M07-AUDIT-20261020:%';
 IF item_total=0 THEN
   RAISE NOTICE 'M07 review bank not seeded in this environment; skip publication';
   RETURN;
 END IF;
 IF item_total<>14 THEN RAISE EXCEPTION 'M07 QA release expected 14 items, got %',item_total; END IF;
 SELECT count(*) INTO bad FROM public.questions q
 JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN public.modules m ON m.id=l.module_id
 JOIN public.constructs c ON c.id=q.construct_id
 WHERE q.source_reference LIKE 'M07-AUDIT-20261020:%'
 AND (m.code<>'M07' OR l.status<>'published' OR c.group_code<>'S4.BLOCK' OR
      q.status NOT IN ('review','published') OR q.difficulty NOT BETWEEN 1 AND 5);
 IF bad<>0 THEN RAISE EXCEPTION 'M07 audit: wrong module/construct/status/difficulty %',bad; END IF;
 SELECT count(*) INTO bad FROM public.questions q
 WHERE q.source_reference LIKE 'M07-AUDIT-20261020:%'
 AND (SELECT count(*) FROM public.question_keys k WHERE k.question_id=q.id)<>1;
 IF bad<>0 THEN RAISE EXCEPTION 'M07 audit: missing/multiple answer keys %',bad; END IF;
 SELECT count(*) INTO bad FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'M07-AUDIT-20261020:%'
 AND (
  (q.format='Y1' AND (
     (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4 OR
     (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.id=(k.payload->>'correct_option_id')::uuid AND o.side='a')<>1
  )) OR
  (q.format='Y2' AND (
     (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4 OR
     (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')<>4 OR
     (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') p
       JOIN public.question_options a ON a.id=p.key::uuid AND a.question_id=q.id AND a.side='a'
       JOIN public.question_options b ON b.id=p.value::uuid AND b.question_id=q.id AND b.side='b')<>4 OR
     (SELECT count(DISTINCT value) FROM jsonb_each_text(k.payload->'pairs'))<>4
  )) OR
  (q.format='Y3' AND (
     (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4 OR
     (SELECT count(*) FROM jsonb_array_elements_text(k.payload->'order') p
       JOIN public.question_options a ON a.id=p.value::uuid AND a.question_id=q.id AND a.side='a')<>4 OR
     (SELECT count(DISTINCT value) FROM jsonb_array_elements_text(k.payload->'order'))<>4
  )) OR
  length(trim(k.explanation_md))<15
 );
 IF bad<>0 THEN RAISE EXCEPTION 'M07 QA: invalid option/key/explanation in % items',bad; END IF;
 IF (SELECT count(*) FROM public.questions q WHERE q.source_reference LIKE 'M07-AUDIT-20261020:%' AND q.format='Y1')<>12
 OR (SELECT count(*) FROM public.questions q WHERE q.source_reference LIKE 'M07-AUDIT-20261020:%' AND q.format='Y2')<>1
 OR (SELECT count(*) FROM public.questions q WHERE q.source_reference LIKE 'M07-AUDIT-20261020:%' AND q.format='Y3')<>1
 THEN RAISE EXCEPTION 'M07 QA: 12 Y1 + 1 Y2 + 1 Y3 required'; END IF;
 IF NOT EXISTS (
  SELECT 1 FROM public.questions q
  WHERE q.id='a279bed1-465c-5652-ac9d-221e51081eb3'::uuid
    AND q.source_reference LIKE '%ADAPTED_PAST_EXAM%'
    AND q.assets @> '[{"kind":"image","diagram_id":"m07_logo_nested_squares_20261020","src":"/m07-audit-2026/m07_logo_nested_squares_20261020.svg"}]'::jsonb
 ) THEN RAISE EXCEPTION 'M07 QA: source authenticity or audited graphic missing'; END IF;
 IF NOT EXISTS (
  SELECT 1 FROM public.questions q
  WHERE q.id='8b74787a-ea14-5f35-85d2-df3aaeccc2af'::uuid
    AND q.stem_md LIKE '%to‘rtta kartochkani%'
 ) THEN RAISE EXCEPTION 'M07 QA: Y3 wording was not corrected'; END IF;
 SELECT count(*) INTO bad FROM (
  SELECT lower(regexp_replace(trim(q.stem_md),'\s+',' ','g')) stem
  FROM public.questions q WHERE q.source_reference LIKE 'M07-AUDIT-20261020:%'
  GROUP BY 1 HAVING count(*)>1
 ) duplicate;
 IF bad<>0 THEN RAISE EXCEPTION 'M07 QA: duplicate stems %',bad; END IF;
 UPDATE public.questions SET status='published'::content_status,updated_at=now()
 WHERE source_reference LIKE 'M07-AUDIT-20261020:%' AND status='review'::content_status;
 GET DIAGNOSTICS updated=ROW_COUNT;
 IF updated NOT IN (0,14) THEN RAISE EXCEPTION 'M07 QA: partial publication %, expected 0 or 14',updated; END IF;
 RAISE NOTICE 'M07 final publication complete: updated % questions',updated;
END $m07_publish$;
