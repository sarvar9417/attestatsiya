-- TASK-211/212 M13 AXR release integrity: human review explicitly waived by project owner.
DO $$
DECLARE v int;
BEGIN
 SELECT count(*) INTO v FROM public.lessons WHERE slug BETWEEN 'm13-axr-01' AND 'm13-axr-07' AND status='published';
 IF v <> 7 THEN RAISE EXCEPTION 'Expected 7 M13 AXR published lessons; got %',v; END IF;
 SELECT count(*) INTO v FROM public.questions WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' AND status='published';
 IF v <> 210 THEN RAISE EXCEPTION 'Expected 210 M13 AXR published questions; got %',v; END IF;
 SELECT count(*) INTO v FROM (
    SELECT split_part(source_reference,':',3) AS code FROM public.questions
     WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' GROUP BY 1 HAVING count(*) <> 1
 ) x;
 IF v <> 0 THEN RAISE EXCEPTION 'Duplicate question codes'; END IF;
 SELECT count(*) INTO v FROM public.questions q
 LEFT JOIN public.lessons l ON l.id=q.source_lesson_id
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'm13-axr-v1:%:AXR-%' AND
 (l.id IS NULL OR l.status <> 'published' OR k.question_id IS NULL
 OR q.format <> 'Y1' OR q.group_code <> 'S7.SEC'
 OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')
 OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id) <> 4);
 IF v <> 0 THEN RAISE EXCEPTION 'M13 AXR invalid question/lesson/key/option records: %',v; END IF;
 SELECT count(*) INTO v FROM (
    SELECT source_lesson_id, count(*) n FROM public.questions
    WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' GROUP BY source_lesson_id HAVING count(*) <> 30
 ) x;
 IF v <> 0 THEN RAISE EXCEPTION 'Each M13 AXR chapter must contain 30 questions'; END IF;
 SELECT count(*) INTO v FROM public.questions WHERE source_reference LIKE 'm13-axr-v1:%:AXR-%' AND status<>'published';
 IF v <> 0 THEN RAISE EXCEPTION 'TASK-212: partial AXR publication'; END IF;
END $$;