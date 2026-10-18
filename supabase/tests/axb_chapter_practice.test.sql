-- AXB chapter practice: exercise a 3-question fixture in an isolated CI database.
BEGIN;
DO $qa$
DECLARE
  v_template public.questions%ROWTYPE;
  v_user uuid := 'aa100000-0000-4000-8000-000000000001';
  v_question uuid;
  v_key uuid;
  v_answer uuid;
  v_count int;
  v_exam uuid;
  v_payload jsonb;
  v_result jsonb;
  v_i int;
  v_fail bool := false;
BEGIN
  INSERT INTO auth.users(id,email) VALUES(v_user,'axb-chapter-ci@example.test');
  SELECT q.* INTO v_template
  FROM public.questions q
  JOIN public.constructs c ON c.id=q.construct_id AND c.is_active AND c.group_code=q.group_code
  JOIN public.lessons l ON l.id=q.source_lesson_id AND l.status='published'::public.content_status
  JOIN public.lesson_constructs lc ON lc.lesson_id=l.id AND lc.construct_id=c.id
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND q.format='Y1'::public.question_format
    AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND o.side='a')=4
    AND EXISTS (SELECT 1 FROM public.question_options o WHERE o.question_id=q.id AND o.id::text=k.payload->>'correct_option_id')
  ORDER BY q.created_at LIMIT 1;
  IF v_template.id IS NULL THEN RAISE EXCEPTION 'need valid Y1 fixture template'; END IF;

  FOR v_i IN 1..3 LOOP
    v_question := gen_random_uuid();
    INSERT INTO public.questions
      (id,subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,assets,is_generated,status,author_id,source_reference,source_lesson_id)
    VALUES (v_question,v_template.subject_id,v_template.construct_id,v_template.group_code,
      'Y1'::public.question_format,v_template.cognitive,v_template.difficulty,
      'AXB isolated CI question '||v_i,'[]'::jsonb,false,'published'::public.content_status,
      v_template.author_id,'m01-professional-bank:AXB-16-'||lpad(v_i::text,3,'0'),v_template.source_lesson_id);
    INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
    VALUES(gen_random_uuid(),v_question,'a',1,'option A'),
          (gen_random_uuid(),v_question,'a',2,'option B'),
          (gen_random_uuid(),v_question,'a',3,'option C'),
          (gen_random_uuid(),v_question,'a',4,'option D');
    SELECT id INTO v_answer FROM public.question_options WHERE question_id=v_question AND order_idx=2;
    INSERT INTO public.question_keys(question_id,payload,explanation_md)
    VALUES(v_question,jsonb_build_object('correct_option_id',v_answer),'Isolated fixture explanation');
  END LOOP;

  -- Chapter catalog is 19 and reflects the 3 isolated published rows.
  PERFORM set_config('request.jwt.claim.sub',v_user::text,true);
  v_result := public.axb_chapter_catalog();
  IF jsonb_array_length(v_result) <> 19 OR
     (v_result->15->>'published_count')::int <> 3 THEN
    RAISE EXCEPTION 'catalog mismatch: %',v_result->15;
  END IF;

  BEGIN
    PERFORM public.generate_axb_chapter_practice(16,10);
  EXCEPTION WHEN others THEN
    v_fail := sqlerrm LIKE 'axb_chapter_pool_insufficient:%';
  END;
  IF NOT v_fail THEN RAISE EXCEPTION 'chapter pool must fail closed at 10'; END IF;

  v_result := public.generate_axb_chapter_practice(16,3);
  v_exam := (v_result->>'exam_id')::uuid;
  IF v_result->>'kind'<>'axb_bob' OR
    jsonb_array_length(v_result->'items')<>3 OR
    (v_result->>'duration_sec')::int<>360 THEN
      RAISE EXCEPTION 'invalid practice session payload';
  END IF;
  IF v_result::text LIKE '%correct_option_id%' OR v_result::text LIKE '%explanation_md%' THEN
    RAISE EXCEPTION 'answer key leaked';
  END IF;
  SELECT count(*) INTO v_count FROM public.exam_items ei
    JOIN public.questions q ON q.id=ei.question_id
  WHERE ei.exam_id=v_exam
    AND q.source_reference LIKE 'm01-professional-bank:AXB-16-%';
  IF v_count<>3 THEN RAISE EXCEPTION 'selected question chapter mismatch'; END IF;

  SELECT ei.question_id INTO v_question FROM public.exam_items ei WHERE ei.exam_id=v_exam LIMIT 1;
  SELECT o.id INTO v_answer FROM public.question_options o
    JOIN public.question_keys k ON k.question_id=o.question_id
   WHERE o.question_id=v_question AND o.id::text=k.payload->>'correct_option_id';
  v_result := public.submit_answer(v_exam,v_question,jsonb_build_object('option_id',v_answer),1);
  IF v_result ? 'correct' OR v_result ? 'explanation_md' THEN
    RAISE EXCEPTION 'answer feedback leaked before finalization: %',v_result;
  END IF;
  v_result := public.submit_answer(v_exam,v_question,jsonb_build_object('option_id',v_answer),1);
  IF v_result ? 'correct' OR v_result ? 'explanation_md' OR v_result->>'already_answered'<>'true' THEN
    RAISE EXCEPTION 'retry leaked answer or was not idempotent';
  END IF;

  PERFORM public.finish_exam(v_exam);
  v_result := public.get_review(v_exam);
  IF jsonb_array_length(v_result)<>3 THEN RAISE EXCEPTION 'finished review missing'; END IF;
  IF (SELECT kind FROM public.exams WHERE id=v_exam) <> 'axb_bob'::public.exam_kind THEN
    RAISE EXCEPTION 'wrong exam kind';
  END IF;

  PERFORM set_config('request.jwt.claim.sub','aa100000-0000-4000-8000-000000000002',true);
  v_fail:=false;
  BEGIN
    PERFORM public.get_review(v_exam);
  EXCEPTION WHEN others THEN
    v_fail := sqlerrm='sinov_topilmadi';
  END;
  IF NOT v_fail THEN RAISE EXCEPTION 'cross-account review leak'; END IF;
END $qa$;
DO $qa$ BEGIN
  IF has_function_privilege('anon','public.generate_axb_chapter_practice(integer,integer)','EXECUTE')
    OR has_function_privilege('anon','public.axb_chapter_catalog()','EXECUTE') THEN
    RAISE EXCEPTION 'anonymous RPC access present';
  END IF;
END $qa$;
ROLLBACK;
