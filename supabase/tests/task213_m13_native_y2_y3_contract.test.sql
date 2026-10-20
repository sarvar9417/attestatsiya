-- TASK-213 native M13 matching/ordering contract, read-only.
DO $task213_contract$
DECLARE v_bad int; v_fmt text; v_count int;
BEGIN
 FOR v_fmt IN SELECT unnest(ARRAY['Y2','Y3']) LOOP
   SELECT count(*) INTO v_count FROM public.questions q
     WHERE (
        q.source_reference LIKE 'm13-axr-native-v1:'||v_fmt||':AXRN-%'
        OR (v_fmt='Y2' AND q.source_reference LIKE 'm13-qc-v2:Y2:AXRN-%')
       )
       AND q.format=v_fmt::public.question_format AND q.status='published'::public.content_status;
   IF v_count<>70 THEN RAISE EXCEPTION 'TASK-213 expected 70 % found %',v_fmt,v_count; END IF;
 END LOOP;
 SELECT count(*) INTO v_bad FROM (
  SELECT l.slug,q.format,count(*) n
  FROM public.questions q JOIN public.lessons l ON l.id=q.source_lesson_id
  WHERE q.source_reference LIKE 'm13-axr-native-v1:%:AXRN-%'
  GROUP BY l.slug,q.format HAVING count(*) <> 10
 ) x;
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-213 7x10 chapter/format distribution invalid'; END IF;
 SELECT count(*) INTO v_bad FROM public.questions q
  JOIN public.lessons l ON l.id=q.source_lesson_id
  JOIN public.constructs c ON c.id=q.construct_id
  LEFT JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'm13-axr-native-v1:%:AXRN-%'
 AND (l.slug !~ '^m13-axr-0[1-7]$' OR l.status<>'published'::public.content_status
 OR c.group_code<>'S7.SEC' OR NOT c.is_active OR k.question_id IS NULL
 OR length(btrim(coalesce(k.explanation_md,'')))<30
 OR NOT EXISTS (SELECT 1 FROM public.lesson_constructs lc WHERE lc.lesson_id=l.id AND lc.construct_id=q.construct_id));
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-213 broken lesson/source/keys %',v_bad; END IF;

 SELECT count(*) INTO v_bad FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'm13-axr-native-v1:Y2:AXRN-%'
 AND (jsonb_typeof(k.payload->'pairs')<>'object'
  OR (SELECT count(*) FROM jsonb_each_text(k.payload->'pairs'))<>4
  OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
  OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='b')<>4
  OR EXISTS (SELECT 1 FROM jsonb_each_text(k.payload->'pairs') pair
    WHERE NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.side='a' AND o.id::text=pair.key)
       OR NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.side='b' AND o.id::text=pair.value))) ;
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-213 broken Y2 mappings %',v_bad; END IF;

 SELECT count(*) INTO v_bad FROM public.questions q
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.source_reference LIKE 'm13-axr-native-v1:Y3:AXRN-%'
 AND (jsonb_typeof(k.payload->'order')<>'array'
  OR jsonb_array_length(k.payload->'order')<>4
  OR (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')<>4
  OR EXISTS (SELECT 1 FROM jsonb_array_elements_text(k.payload->'order') order_id
    WHERE NOT EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=order_id.value))) ;
 IF v_bad<>0 THEN RAISE EXCEPTION 'TASK-213 broken Y3 order keys %',v_bad; END IF;
END
$task213_contract$;