-- TASK-291: Native structure guard for unapproved V2 review revisions.
-- No destructive mutation, no production question or answer text in this test.
DO $$
DECLARE n int;
BEGIN
 SELECT count(*) INTO n FROM public.questions q
 WHERE q.group_code='S5.WEB' AND q.status='review'
   AND q.source_reference LIKE '%TASK-240 review revision%';
 IF n>0 AND n<>380 THEN
  RAISE EXCEPTION 'TASK-291: TASK-240 V2 review-bank cardinality drift: %',n;
 END IF;

 -- Every staged/native Y1 must have exactly four options and a server key.
 SELECT count(*) INTO n FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code='S5.WEB' AND q.status='review'
   AND q.source_reference LIKE '%TASK-240 review revision%'
   AND q.format='Y1'
   AND (k.question_id IS NULL OR
     (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
    OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
      AND o.id::text=k.payload->>'correct_option_id'));
 IF n<>0 THEN RAISE EXCEPTION 'TASK-291: reviewed Y1 answer/shape is inconsistent: %',n; END IF;

 -- Y2 must use separate a/b option sides. 3x3 original and 4x4 expanded both supported.
 SELECT count(*) INTO n FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code='S5.WEB' AND q.status='review'
  AND q.source_reference LIKE '%TASK-240 review revision%'
  AND q.format='Y2'
  AND (
    (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') NOT IN (3,4)
    OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')
       <> (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')
    OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))
       <> (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')
  );
 IF n<>0 THEN RAISE EXCEPTION 'TASK-291: reviewed native Y2 side/pairs invalid: %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.group_code='S5.WEB' AND q.status='review'
  AND q.source_reference LIKE '%TASK-240 review revision%'
  AND q.format='Y3'
  AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a') NOT IN (3,4)
    OR jsonb_array_length(k.payload->'order')
       <> (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a'));
 IF n<>0 THEN RAISE EXCEPTION 'TASK-291: reviewed native Y3 order invalid: %',n; END IF;

 -- Historical original is never silently discarded.
 SELECT count(*) INTO n FROM public.questions q
 WHERE q.group_code='S5.WEB' AND q.source_reference LIKE 'GV2:GV-%'
   AND q.source_reference NOT LIKE '%TASK-240 review revision%'
   AND q.status='archived';
 IF n>0 AND n<>300 THEN RAISE EXCEPTION 'TASK-291: immutable archive count changed: %',n; END IF;
END $$;
