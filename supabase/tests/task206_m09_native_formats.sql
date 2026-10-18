-- TASK-206: database-level native format invariants; no answer key text is checked into Git.
DO $$
DECLARE y2_count int; y3_count int; malformed int; y2_test uuid; y3_test uuid; blocked int:=0;
BEGIN
 SELECT count(*) FILTER(WHERE format='Y2'),count(*) FILTER(WHERE format='Y3')
 INTO y2_count,y3_count
 FROM public.questions WHERE source_reference LIKE 'MSACCESS-V2-NATIVE/%';
 IF y2_count=0 AND y3_count=0 THEN
   RAISE NOTICE 'TASK-206 bank not staged in clean environment; skip staging-specific assertions';
   RETURN;
 END IF;
 IF y2_count<>60 OR y3_count<>60 THEN
   RAISE EXCEPTION 'TASK-206 expected 60 Y2 / 60 Y3; got % / %',y2_count,y3_count;
 END IF;
 WITH qdata AS (
 SELECT q.id,q.format,k.payload,
    count(*) FILTER(WHERE o.side='a') a_count,
    count(*) FILTER(WHERE o.side='b') b_count
 FROM public.questions q
 LEFT JOIN public.question_options o ON o.question_id=q.id
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'MSACCESS-V2-NATIVE/%'
 GROUP BY q.id,q.format,k.payload
 )
 SELECT count(*) INTO malformed FROM qdata q
 WHERE (q.format='Y2' AND (a_count<>4 OR b_count<>4
   OR (SELECT count(*) FROM jsonb_each_text(q.payload->'pairs'))<>4))
 OR (q.format='Y3' AND (a_count<>4 OR b_count<>0
   OR jsonb_array_length(q.payload->'order')<>4));
 IF malformed<>0 THEN RAISE EXCEPTION 'TASK-206 % malformed native questions',malformed; END IF;
 SELECT id INTO y2_test FROM public.questions WHERE source_reference LIKE 'MSACCESS-V2-NATIVE/%' AND format='Y2' LIMIT 1;
 SELECT id INTO y3_test FROM public.questions WHERE source_reference LIKE 'MSACCESS-V2-NATIVE/%' AND format='Y3' LIMIT 1;
 BEGIN
    UPDATE public.questions SET status='published' WHERE id=y2_test;
    RAISE EXCEPTION 'TASK-206 unsafe Y2 was published';
 EXCEPTION WHEN check_violation THEN blocked:=blocked+1; END;
 BEGIN
    UPDATE public.questions SET status='published' WHERE id=y3_test;
    RAISE EXCEPTION 'TASK-206 unsafe Y3 was published';
 EXCEPTION WHEN check_violation THEN blocked:=blocked+1; END;
 IF blocked<>2 THEN RAISE EXCEPTION 'TASK-206 guard tests failed'; END IF;
 RAISE NOTICE 'TASK-206: 60 Y2, 60 Y3, native key shapes and release guards PASS';
END $$;