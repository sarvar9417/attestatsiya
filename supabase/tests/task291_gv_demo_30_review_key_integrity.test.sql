-- TASK-291: 30 exam-style candidates are review-only, source-linked, correctly keyed and structurally sound.
-- No simulation of independent human approval.
DO $$
DECLARE n integer; t public.question_format; expected integer; part text;
BEGIN
 SELECT count(*) INTO n FROM public.questions q WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%';
 IF n<>30 THEN RAISE EXCEPTION 'TASK291 expected 30 new review candidates, got %',n; END IF;

 FOR t,expected IN SELECT * FROM (VALUES
  ('Y1'::public.question_format,20),('Y2'::public.question_format,5),
  ('Y3'::public.question_format,5)) s(format,count)
 LOOP
  SELECT count(*) INTO n FROM public.questions q WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%' AND q.format=t;
  IF n<>expected THEN RAISE EXCEPTION 'TASK291 format % expected %, got %',t,expected,n; END IF;
 END LOOP;

 FOR part IN SELECT unnest(ARRAY['GFX','RV','ED','HT','CS']) LOOP
  SELECT count(*) INTO n FROM public.questions q
   WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:GV-DEMO-2026-'||part||'-%';
  IF n<>6 THEN RAISE EXCEPTION 'TASK291 % chapter expected 6, got %',part,n; END IF;
 END LOOP;

 SELECT count(*) INTO n FROM public.questions q
 JOIN public.lessons l ON l.id=q.source_lesson_id
 JOIN public.constructs c ON c.id=q.construct_id
 WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%'
 AND q.status='review' AND q.is_generated AND q.group_code='S5.WEB'
 AND c.code LIKE 'S5.WEB.0%' AND c.is_active AND l.status='published'
 AND q.subject_id=(SELECT subject_id FROM public.modules m WHERE m.id=l.module_id)
 AND EXISTS (SELECT 1 FROM public.question_keys k WHERE k.question_id=q.id
             AND length(btrim(k.explanation_md))>=35);
 IF n<>30 THEN RAISE EXCEPTION 'TASK291 invalid review status, source lesson, taxonomy, key or rationale: passed %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%' AND q.format='Y1'
 AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
   OR (SELECT count(distinct lower(btrim(o.content_md))) FROM public.question_options o WHERE o.question_id=q.id)<>4
   OR NOT EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
    AND o.id::text=k.payload->>'correct_option_id'));
 IF n>0 THEN RAISE EXCEPTION 'TASK291 Y1 incorrect key or distractors %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%' AND q.format='Y2'
 AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
   OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')<>4
   OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>4
   OR (SELECT count(distinct p.value) FROM jsonb_each_text(k.payload->'pairs') p)<>4
   OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') p
     JOIN public.question_options a ON a.id::text=p.key AND a.question_id=q.id AND a.side='a'
     JOIN public.question_options b ON b.id::text=p.value AND b.question_id=q.id AND b.side='b')<>4);
 IF n>0 THEN RAISE EXCEPTION 'TASK291 Y2 wrong 4x4 pairing %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%' AND q.format='Y3'
 AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
   OR jsonb_array_length(k.payload->'order')<>4
   OR (SELECT count(distinct o.id) FROM jsonb_array_elements_text(k.payload->'order') z
       JOIN public.question_options o ON o.id::text=z.value AND o.question_id=q.id AND o.side='a')<>4);
 IF n>0 THEN RAISE EXCEPTION 'TASK291 Y3 wrong 4-step order %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%' AND
 (q.stem_md LIKE '%Yashiriladigan fon qismini belgilash%' OR
  (q.source_reference LIKE '%ED-018%' AND q.stem_md NOT LIKE '%Photoshop%'));
 IF n<>0 THEN RAISE EXCEPTION 'TASK291 rejected outdated masking instruction %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'GV-EXAMSTYLE:20261020:%' AND
 (q.status='published' OR q.status='archived');
 IF n<>0 THEN RAISE EXCEPTION 'TASK291 staged content inadvertently exposed'; END IF;
END $$;
