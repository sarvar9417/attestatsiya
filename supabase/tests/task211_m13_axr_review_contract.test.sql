-- TASK-211 read-only staged import regression.
DO $$
DECLARE v int;
BEGIN
 SELECT count(*) INTO v FROM public.lessons WHERE slug BETWEEN 'm13-axr-01' AND 'm13-axr-07' AND status='review';
 IF v <> 7 THEN RAISE EXCEPTION 'Expected 7 M13 AXR review lessons; got %',v; END IF;
 SELECT count(*) INTO v FROM public.questions WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' AND status='review';
 IF v <> 210 THEN RAISE EXCEPTION 'Expected 210 non-published M13 AXR questions; got %',v; END IF;
 SELECT count(*) INTO v FROM (
    SELECT split_part(source_reference,':',3) AS code FROM public.questions
     WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' GROUP BY 1 HAVING count(*) <> 1
 ) x;
 IF v <> 0 THEN RAISE EXCEPTION 'Duplicate question codes'; END IF;
 SELECT count(*) INTO v FROM public.questions q
 LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'm13-axr-v1:%:AXR-%' AND
 (l.id IS NULL OR l.status <> 'review' OR k.question_id IS NULL
 OR q.format <> 'Y1' OR q.group_code <> 'S7.SEC'
 OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id) <> 4);
 IF v <> 0 THEN RAISE EXCEPTION 'M13 AXR invalid question/lesson/key/option records: %',v; END IF;
 SELECT count(*) INTO v FROM (
    SELECT source_lesson_id, count(*) n FROM public.questions
    WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' GROUP BY source_lesson_id HAVING count(*) <> 30
 ) x;
 IF v <> 0 THEN RAISE EXCEPTION 'Each M13 AXR chapter must contain 30 questions'; END IF;
 SELECT count(*) INTO v FROM public.questions WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' AND status='published';
 IF v <> 0 THEN RAISE EXCEPTION 'Expert review gate was bypassed'; END IF;
END $$;