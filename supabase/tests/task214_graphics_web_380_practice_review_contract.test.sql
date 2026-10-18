-- TASK-214: professional graphics-web bank grows from 300 to 380 without deleting original published records.
-- 280 Y1, 50 true matching Y2, 50 true ordering Y3.
DO $$
DECLARE n integer; section_code text; v_format public.question_format; expected integer;
BEGIN
 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'GV2:GV-%' OR q.source_reference LIKE '%GV2-EXT-%';
 IF n<>380 THEN RAISE EXCEPTION 'TASK-214 total 380 missing, actual %',n; END IF;

 FOR v_format,expected IN SELECT * FROM (VALUES
    ('Y1'::public.question_format,280),('Y2'::public.question_format,50),('Y3'::public.question_format,50)
 ) v(fmt,total)
 LOOP
   SELECT count(*) INTO n FROM public.questions q WHERE q.format=v_format
      AND (q.source_reference LIKE 'GV2:GV-%' OR q.source_reference LIKE '%GV2-EXT-%');
   IF n<>expected THEN RAISE EXCEPTION 'TASK-214 format % expected %, actual %',v_format,expected,n; END IF;
 END LOOP;

 FOR section_code IN SELECT unnest(ARRAY['GFX','RV','ED','HT','CS'])
 LOOP
    SELECT count(*) INTO n FROM public.questions q WHERE
       q.source_reference LIKE 'GV2:GV-'||section_code||'-%'
       OR q.source_reference LIKE '%GV2-EXT-'||section_code||'-%';
    IF n<>76 THEN RAISE EXCEPTION 'TASK-214 % chapter expected 76, actual %',section_code,n; END IF;
    SELECT count(*) INTO n FROM public.questions q WHERE q.format='Y2'
      AND q.source_reference LIKE '%GV2-EXT-'||section_code||'-Y2-%';
    IF n<>8 THEN RAISE EXCEPTION 'TASK-214 % expected 8 added Y2, got %',section_code,n; END IF;
    SELECT count(*) INTO n FROM public.questions q WHERE q.format='Y3'
      AND q.source_reference LIKE '%GV2-EXT-'||section_code||'-Y3-%';
    IF n<>8 THEN RAISE EXCEPTION 'TASK-214 % expected 8 added Y3, got %',section_code,n; END IF;
 END LOOP;

 SELECT count(*) INTO n FROM public.questions q WHERE q.source_reference LIKE '%GV2-EXT-%'
   AND (q.status<>'review' OR q.group_code<>'S5.WEB'
        OR q.source_lesson_id IS NULL
        OR NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id AND l.status='review'));
 IF n<>0 THEN RAISE EXCEPTION 'TASK-214 new items are not all review/lesson linked: %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
  LEFT JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.source_reference LIKE '%GV2-EXT-%' AND k.question_id IS NULL;
 IF n<>0 THEN RAISE EXCEPTION 'TASK-214 missing server-only keys %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q WHERE q.source_reference LIKE '%GV2-EXT-%'
  AND (q.assets<>'[]'::jsonb OR q.stem_md = '' OR char_length(q.source_reference)<50);
 IF n<>0 THEN RAISE EXCEPTION 'TASK-214 unexpected assets/blank content/provenance %',n; END IF;

 -- Four distinct left options and four right options per new matching question.
 SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.format='Y2' AND q.source_reference LIKE '%GV2-EXT-%'
  AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
    OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')<>4
    OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>4
    OR (SELECT count(DISTINCT pair.value) FROM jsonb_each_text(k.payload->'pairs') pair)<>4
    OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') pair
         JOIN public.question_options leftopt ON leftopt.id::text=pair.key
           AND leftopt.question_id=q.id AND leftopt.side='a'
         JOIN public.question_options rightopt ON rightopt.id::text=pair.value
           AND rightopt.question_id=q.id AND rightopt.side='b')<>4);
 IF n<>0 THEN RAISE EXCEPTION 'TASK-214 invalid Y2 4x4 pairs: %',n; END IF;

 -- Four distinct choices per new ordering question, with same membership as the answer order.
 SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.format='Y3' AND q.source_reference LIKE '%GV2-EXT-%'
  AND ((SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
    OR jsonb_array_length(k.payload->'order')<>4
    OR (SELECT count(DISTINCT o.id)
         FROM jsonb_array_elements_text(k.payload->'order') x
         JOIN public.question_options o ON o.id::text=x.value
           AND o.question_id=q.id AND o.side='a')<>4);
 IF n<>0 THEN RAISE EXCEPTION 'TASK-214 invalid Y3 four-step orders: %',n; END IF;

 -- No duplicate question stems inside the new 80-item collection.
 SELECT count(*) INTO n FROM (
    SELECT lower(trim(q.stem_md)) stem FROM public.questions q WHERE q.source_reference LIKE '%GV2-EXT-%'
    GROUP BY 1 HAVING count(*)>1
 ) duplicates;
 IF n<>0 THEN RAISE EXCEPTION 'TASK-214 duplicate new stems: %',n; END IF;

 -- Publication/preservation invariants for pre-existing 6 lessons and 53 S5.WEB published questions.
 SELECT count(*) INTO n FROM public.lessons l WHERE l.slug IN
 ('kompyuter-grafikasi-turlari','rastr-vektor-amallari','paint-va-photoshop-asoslari',
 'html-matn-rasm-royxat','html-jadval-va-forma','css-stillarini-qollash')
 AND l.status='published';
 IF n<>6 THEN RAISE EXCEPTION 'TASK-214 original 6 lessons changed: %',n; END IF;
 SELECT count(*) INTO n FROM public.questions q WHERE q.group_code='S5.WEB' AND q.status='published';
 -- Fresh-DB seed has 24 published S5.WEB questions, current production has 53;
 -- staged migration contains only INSERTs, so both fixtures must be accepted.
 IF n<24 THEN RAISE EXCEPTION 'TASK-214 published S5.WEB pool below clean-seed baseline: %',n; END IF;
END $$;
