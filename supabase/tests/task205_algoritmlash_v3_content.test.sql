-- TASK-205 source-based V3 review import and diagrams contract
DO $$
DECLARE n integer;
BEGIN
SELECT count(*) INTO n FROM public.lessons WHERE slug like 'algoritmlash-v3-%' AND status='review';
IF n<>2 THEN RAISE EXCEPTION 'V3 lessons count %, want 2',n; END IF;
SELECT count(*) INTO n FROM public.questions WHERE source_reference LIKE 'algoritmlash-v3:%';
IF n<>48 THEN RAISE EXCEPTION 'V3 questions count %, want 48',n; END IF;
IF EXISTS(SELECT 1 FROM public.questions q WHERE q.source_reference LIKE 'algoritmlash-v3:%'
 AND (q.status<>'review' OR q.source_lesson_id IS NULL
   OR NOT EXISTS(SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id AND l.status='review'))) THEN
 RAISE EXCEPTION 'Unexpected publication or linkage'; END IF;
IF EXISTS(SELECT 1 FROM public.questions q WHERE q.source_reference LIKE 'algoritmlash-v3:%'
 AND NOT EXISTS(SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id)) THEN
 RAISE EXCEPTION 'Missing answer key'; END IF;
SELECT count(*) INTO n FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'algoritmlash-v3:%' AND q.format='Y1'
AND ( (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id)<>4
 OR NOT EXISTS(SELECT 1 FROM public.question_options o
  WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id'));
IF n<>0 THEN RAISE EXCEPTION 'Invalid Y1 keys count %',n; END IF;
SELECT count(*) INTO n FROM public.questions q
JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'algoritmlash-v3:%' AND q.format='Y2'
AND ((SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>3
 OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') p
 JOIN public.question_options a ON a.question_id=q.id AND a.side='a' AND a.id::text=p.key
 JOIN public.question_options b ON b.question_id=q.id AND b.side='b' AND b.id::text=p.value)<>3);
IF n<>0 THEN RAISE EXCEPTION 'Invalid Y2 pairs %',n; END IF;
SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
WHERE q.source_reference LIKE 'algoritmlash-v3:%' AND q.format='Y3'
AND (jsonb_array_length(k.payload->'order') NOT BETWEEN 3 AND 5 OR
 (SELECT count(DISTINCT o.id) FROM jsonb_array_elements_text(k.payload->'order') x
 JOIN public.question_options o ON o.question_id=q.id AND o.side='a' AND o.id::text=x.value) <> jsonb_array_length(k.payload->'order'));
IF n<>0 THEN RAISE EXCEPTION 'Invalid Y3 order %',n; END IF;
IF (SELECT count(*) FROM public.questions WHERE source_reference LIKE 'algoritmlash-v2:%')<>240 THEN
RAISE EXCEPTION 'V2 base changed';END IF;
IF (SELECT count(*) FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%' AND status='review')<>11 THEN
RAISE EXCEPTION 'V2 lessons changed';END IF;
IF EXISTS(SELECT 1 FROM public.lessons WHERE slug LIKE 'algoritmlash-v2-%'
AND body_mdx LIKE '%[Blok-sxemaning asl chizmasi V2 PDF%') THEN
RAISE EXCEPTION 'V2 diagram placeholder remains'; END IF;
IF NOT EXISTS(SELECT 1 FROM public.lessons WHERE slug='algoritmlash-v3-shart-keyin-sikl' AND
body_mdx LIKE '%(/algoritmlash-v3/loop_until.svg)%') THEN RAISE EXCEPTION 'New diagram absent'; END IF;
END $$;