-- TASK-220 style-matched ORIGINAL question prototypes: 20 questions, protected keys, draft linking.
BEGIN;
DO $check$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM public.questions q WHERE q.source_reference LIKE 'm12-examstyle-20261020:%';
  IF n<>20 THEN RAISE EXCEPTION 'Expected 20 exam-style review items, got %',n; END IF;
  SELECT count(*) INTO n FROM public.questions q
    JOIN public.lessons l ON l.id=q.source_lesson_id
    JOIN public.modules m ON m.id=l.module_id
  WHERE q.source_reference LIKE 'm12-examstyle-20261020:%'
    AND q.status='review'::public.content_status AND q.format='Y1'::public.question_format
    AND l.status='draft'::public.content_status AND m.code='M12';
  IF n<>20 THEN RAISE EXCEPTION 'M12 exam-style review isolation failed: %',n; END IF;
  SELECT count(*) INTO n FROM public.questions q
    LEFT JOIN public.question_keys k ON k.question_id=q.id
    LEFT JOIN public.question_options cor ON cor.id=(k.payload->>'correct_option_id')::uuid
    LEFT JOIN public.lesson_constructs lc ON lc.lesson_id=q.source_lesson_id AND lc.construct_id=q.construct_id
  WHERE q.source_reference LIKE 'm12-examstyle-20261020:%'
    AND (k.question_id IS NULL OR cor.question_id IS DISTINCT FROM q.id OR lc.lesson_id IS NULL);
  IF n<>0 THEN RAISE EXCEPTION 'Missing answer key or lesson construct mapping in % examples',n; END IF;
  SELECT count(*) INTO n FROM (
    SELECT q.id FROM public.questions q
    JOIN public.question_options o ON o.question_id=q.id
    WHERE q.source_reference LIKE 'm12-examstyle-20261020:%'
    GROUP BY q.id HAVING count(o.id)<>4 OR count(DISTINCT o.content_md)<>4
  ) bad;
  IF n<>0 THEN RAISE EXCEPTION 'Four distinct options required; bad items %',n; END IF;
  SELECT count(*) INTO n FROM public.questions
   WHERE source_reference LIKE 'm12-examstyle-20261020:%' AND status='published'::public.content_status;
  IF n<>0 THEN RAISE EXCEPTION 'Unapproved examples accidentally published: %',n; END IF;
  SELECT count(*) INTO n FROM public.questions q WHERE
     q.source_reference LIKE 'network-v2-20261018:%' OR q.source_reference LIKE 'network-v3-extra-20261018:%';
  IF n<>380 THEN RAISE EXCEPTION 'Earlier 380 original questions modified: %',n; END IF;
END $check$;
ROLLBACK;
