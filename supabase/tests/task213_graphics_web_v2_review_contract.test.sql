-- TASK-213: Graphics/Web V2 staging acceptance contract. Read-only assertions.
-- Existing published M10/M11 lessons must remain immutable.
DO $$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM public.lessons
 WHERE id::text LIKE 'e2150000-0000-4000-8000-%' AND status='review';
 IF n<>6 THEN RAISE EXCEPTION 'TASK-213 expected 6 review lessons, got %',n; END IF;

 SELECT count(*) INTO n FROM public.lesson_constructs lc
 JOIN public.lessons l ON l.id=lc.lesson_id
 JOIN public.constructs c ON c.id=lc.construct_id
 WHERE l.id::text LIKE 'e2150000-0000-4000-8000-%'
   AND c.code LIKE 'S5.WEB.0%';
 IF n<>6 THEN RAISE EXCEPTION 'TASK-213 expected 6 lesson->construct links, got %',n; END IF;

 SELECT count(*) INTO n FROM public.questions
 WHERE source_reference LIKE 'GV2:GV-%';
 IF n<>300 THEN RAISE EXCEPTION 'TASK-213 expected 300 bank questions, got %',n; END IF;

 SELECT count(*) INTO n FROM public.questions
 WHERE source_reference LIKE 'GV2:GV-%' AND (status<>'review' OR group_code<>'S5.WEB' OR NOT is_generated);
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 unsafe candidate publication or group drift: %',n; END IF;

 SELECT count(*) INTO n FROM (
   SELECT split_part(split_part(source_reference,';',1),':',2) as source_id
   FROM public.questions
   WHERE source_reference LIKE 'GV2:GV-%'
   GROUP BY 1 HAVING count(*)>1
 ) q;
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 duplicate stable source ids %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'GV2:GV-%'
   AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.id=q.source_lesson_id AND l.status='review');
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 source lesson mismatch %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'GV2:GV-%' AND k.question_id IS NULL;
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 missing server-only keys %',n; END IF;

 SELECT count(*) INTO n FROM (
   SELECT q.format, count(*) c FROM public.questions q
   WHERE q.source_reference LIKE 'GV2:GV-%'
   GROUP BY q.format
 ) s
 WHERE NOT (
   (format='Y1' AND c=280) OR (format='Y2' AND c=10) OR (format='Y3' AND c=10)
 );
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 format distribution mismatch'; END IF;

 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'GV2:GV-%'
 AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id) <>
 CASE q.format WHEN 'Y1' THEN 4 WHEN 'Y2' THEN 6 WHEN 'Y3' THEN 3 END;
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 wrong option count for % questions',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'GV2:GV-%' AND q.format='Y1'
 AND NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id');
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 Y1 keys mismatch %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'GV2:GV-%' AND q.format='Y2'
 AND ((SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>3 OR
     (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs') p
      JOIN public.question_options a ON a.question_id=q.id AND a.id::text=p.key AND a.side='a'
      JOIN public.question_options b ON b.question_id=q.id AND b.id::text=p.value AND b.side='b')<>3);
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 Y2 mapping invalid %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'GV2:GV-%' AND q.format='Y3'
 AND (jsonb_array_length(k.payload->'order')<>3 OR
      (SELECT count(DISTINCT o.id) FROM jsonb_array_elements_text(k.payload->'order') s
        JOIN public.question_options o ON o.question_id=q.id AND o.side='a' AND o.id::text=s.value)<>3);
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 Y3 ordering invalid %',n; END IF;

 SELECT count(*) INTO n FROM public.questions q
 WHERE q.source_reference LIKE 'GV2:GV-%'
   AND jsonb_array_length(q.assets)>0
   AND ((q.assets->0->>'kind')<>'image' OR (q.assets->0->>'src') NOT LIKE '/graphics-web-v2/%.svg');
 IF n<>0 THEN RAISE EXCEPTION 'TASK-213 figure asset path mismatch %',n; END IF;

 SELECT count(*) INTO n FROM public.lessons l
 WHERE l.slug IN ('kompyuter-grafikasi-turlari','rastr-vektor-amallari',
 'paint-va-photoshop-asoslari','html-matn-rasm-royxat','html-jadval-va-forma','css-stillarini-qollash')
 AND l.status='published';
 IF n<>6 THEN RAISE EXCEPTION 'TASK-213 original six published lessons changed %',n; END IF;
END $$;
