-- TASK-207 regression: independent V2/V3 baseline and 25 original V4 candidates.
DO $$
DECLARE n int;
BEGIN
SELECT count(*) INTO n FROM public.questions WHERE source_reference LIKE 'algoritmlash-v4:ALG-V4-%';
IF n<>25 THEN RAISE EXCEPTION 'Expected 25 V4 questions, got %',n; END IF;
SELECT count(*) INTO n FROM public.questions q LEFT JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'algoritmlash-v4:%' AND (k.question_id IS NULL OR q.status NOT IN ('review','published'));
IF n<>0 THEN RAISE EXCEPTION 'Invalid release status or missing key V4: %',n; END IF;
SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'algoritmlash-v4:%' AND q.format='Y1'
AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)<>4
OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
AND o.id::text=k.payload->>'correct_option_id'));
IF n<>0 THEN RAISE EXCEPTION 'V4 Y1 invalid keys %',n; END IF;
SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'algoritmlash-v4:%' AND q.format='Y2'
AND ((SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>3
 OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') p JOIN public.question_options a ON a.question_id=q.id AND a.id::text=p.key AND a.side='a'
 JOIN public.question_options b ON b.question_id=q.id AND b.id::text=p.value AND b.side='b')<>3);
IF n<>0 THEN RAISE EXCEPTION 'V4 Y2 invalid keys %',n; END IF;
SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'algoritmlash-v4:%' AND q.format='Y3'
AND (jsonb_array_length(k.payload->'order')<>5 OR (SELECT count(DISTINCT o.id) FROM jsonb_array_elements_text(k.payload->'order') v
JOIN public.question_options o ON o.id::text=v.value AND o.question_id=q.id)<>5);
IF n<>0 THEN RAISE EXCEPTION 'V4 Y3 invalid keys %',n; END IF;
SELECT count(*) INTO n FROM public.questions q WHERE q.source_reference LIKE 'algoritmlash-v4:%' AND jsonb_array_length(q.assets)>0
AND (jsonb_array_length(q.assets)<>1 OR q.assets->0->>'src' NOT LIKE '/algoritmlash-v4/%.svg');
IF n<>0 THEN RAISE EXCEPTION 'V4 nonlocal images %',n; END IF;
IF (SELECT count(*) FROM public.questions q WHERE q.source_reference LIKE 'algoritmlash-v4:%' AND q.assets<>'[]'::jsonb)<>6 THEN
RAISE EXCEPTION 'Expected 6 image-backed V4 questions'; END IF;
SELECT count(*) INTO n FROM public.questions q
WHERE q.source_reference LIKE 'algoritmlash-v4:%'
AND EXISTS (SELECT 1 FROM public.questions q2
 WHERE q2.id<>q.id AND q2.format=q.format
 AND q2.format='Y1' AND lower(btrim(q2.stem_md))=lower(btrim(q.stem_md)));
IF n<>0 THEN RAISE EXCEPTION 'V4 duplicate Y1 stems %',n; END IF;
SELECT count(*) INTO n FROM public.algoritmlash_style_audit;
IF n<>(SELECT count(*) FROM public.questions q WHERE q.source_reference LIKE 'algoritmlash-v2:%' OR q.source_reference LIKE 'algoritmlash-v3:%' OR q.source_reference LIKE 'algoritmlash-v4:%')
THEN RAISE EXCEPTION 'Audit register not comprehensive'; END IF;
IF (SELECT count(*) FROM public.questions WHERE source_reference LIKE 'algoritmlash-v2:%')<>240 THEN RAISE EXCEPTION 'Historic 240 V2 items changed'; END IF;
END $$;
