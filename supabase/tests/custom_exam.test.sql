-- TASK-210 end-to-end SQL verification with rollback.
-- Two unrelated lessons; exact quotas, no answer leak, safe insufficient pool.
begin;

insert into auth.users(id,email)
values
  ('92100000-0000-4000-8000-000000000001', 'task210@example.invalid'),
  ('92100000-0000-4000-8000-000000000002', 'task210-other@example.invalid');

do $setup$
declare
  v_subject uuid;
  v_construct uuid;
  v_group text;
  v_q record;
begin
  select c.subject_id,c.id,c.group_code into v_subject,v_construct,v_group
  from public.constructs c where c.is_active
    and c.group_code not in ('KS','PM.GEN','PM.MET')
  order by c.code limit 1;
  if v_subject is null then raise exception 'TASK210 fixture needs an active specialty construct'; end if;

  insert into public.modules(id,subject_id,order_idx,slug,title_uz,status,code)
  values
    ('92100000-0000-4000-8000-000000000010',v_subject,997,
     'task210-cross-module-a','TASK210 sinov moduli A','published','M97'),
    ('92100000-0000-4000-8000-000000000011',v_subject,998,
     'task210-cross-module-b','TASK210 sinov moduli B','published','M98');

  insert into public.lessons(id,module_id,order_idx,slug,title_uz,status)
  values
    ('92100000-0000-4000-8000-000000000020',
     '92100000-0000-4000-8000-000000000010',1,'task210-lesson-a','Mavzu A','published'),
    ('92100000-0000-4000-8000-000000000021',
     '92100000-0000-4000-8000-000000000011',1,'task210-lesson-b','Mavzu B','published');

  insert into public.lesson_constructs(lesson_id,construct_id,is_required,is_critical,min_questions)
  values
    ('92100000-0000-4000-8000-000000000020',v_construct,true,false,1),
    ('92100000-0000-4000-8000-000000000021',v_construct,true,false,1);

  insert into public.questions
    (subject_id,construct_id,group_code,format,cognitive,difficulty,
     stem_md,status,source_reference,source_lesson_id)
  select v_subject,v_construct,v_group,'Y1'::public.question_format,
     'bilish'::public.cognitive_level,
     case when n <= 4 then 2 else 3 end,
     'TASK210 savol '||n,
     'published'::public.content_status,
     'TASK210:source:'||n,
     case when n <= 4 then '92100000-0000-4000-8000-000000000020'::uuid
          else '92100000-0000-4000-8000-000000000021'::uuid end
  from generate_series(1,7) n;

  for v_q in
    select q.id from public.questions q
    where q.source_reference like 'TASK210:source:%'
  loop
    insert into public.question_options(question_id,side,order_idx,content_md)
    select v_q.id, 'a', i, 'Javob '||i from generate_series(1,4) i;
    insert into public.question_keys(question_id,payload,explanation_md)
    values (
      v_q.id,
      jsonb_build_object('correct_option_id',(
        select id::text from public.question_options
        where question_id=v_q.id order by order_idx limit 1
      )),
      'TASK210 tekshirilgan izoh'
    );
  end loop;
end
$setup$;

do $test$
begin
  if has_function_privilege('anon','public.generate_custom_exam(jsonb)','EXECUTE')
     or has_function_privilege('anon','public.custom_exam_preflight(jsonb)','EXECUTE') then
    raise exception 'anonymous custom RPC access forbidden';
  end if;
  if has_function_privilege('authenticated','public.admin_custom_exam_pool_coverage()','EXECUTE') then
    raise exception 'learner can access staff-only pool coverage';
  end if;
  if not has_function_privilege('authenticated','public.generate_custom_exam(jsonb)','EXECUTE')
     or not has_function_privilege('authenticated','public.custom_exam_preflight(jsonb)','EXECUTE') then
    raise exception 'authenticated custom RPC privileges missing';
  end if;
end
$test$;

select set_config('request.jwt.claim.sub','92100000-0000-4000-8000-000000000001',false);
set role authenticated;

do $test$
declare
  v_config jsonb;
  v_bad jsonb;
  v_preview jsonb;
  v_session jsonb;
  v_exam uuid;
  v_q uuid;
  v_option uuid;
  v_submit jsonb;
  v_finish jsonb;
  v_review jsonb;
  v_analysis jsonb;
  v_total int;
  v_failed boolean := false;
begin
  v_config := jsonb_build_object(
    'total_count',7,
    'topics',jsonb_build_array(
      jsonb_build_object('lesson_id','92100000-0000-4000-8000-000000000020',
        'count',4,'difficulty_counts',jsonb_build_array(jsonb_build_object('difficulty',2,'count',4))),
      jsonb_build_object('lesson_id','92100000-0000-4000-8000-000000000021',
        'count',3,'difficulty_counts',jsonb_build_array(jsonb_build_object('difficulty',3,'count',3)))
    ),
    'formats',jsonb_build_array('Y1'),
    'exposure','all','mode','exam','duration_sec',900
  );

  -- An objective not mapped to the selected lesson is rejected without creating an exam.
  v_bad := jsonb_set(v_config,'{topics,0,construct_id}',
    '"00000000-0000-4000-8000-000000000099"'::jsonb);
  v_failed := false;
  begin
    perform public.custom_exam_preflight(v_bad);
  exception when others then
    if sqlerrm like '%custom_construct_unavailable%' then v_failed := true;
    else raise;
    end if;
  end;
  if not v_failed then raise exception 'unmapped construct was accepted'; end if;

  v_preview := public.custom_exam_preflight(v_config);
  if v_preview->>'ready'<>'true' or (v_preview->>'requested')::int<>7
     or (v_preview->>'available')::int<>7
     or jsonb_array_length(v_preview->'gaps')<>0 then
    raise exception 'preflight wrong counts: %',v_preview;
  end if;

  v_session := public.generate_custom_exam(v_config);
  v_exam := (v_session->>'exam_id')::uuid;
  if v_session->>'kind'<>'custom'
     or jsonb_array_length(v_session->'items')<>7
     or (v_session->>'duration_sec')::int<>900 then
    raise exception 'wrong generated custom exam: %',v_session;
  end if;
  if v_session::text like '%correct_option_id%' or v_session::text like '%explanation_md%' then
    raise exception 'custom session leaked answer key';
  end if;
  -- AUTHENTICATED callers must not query private exam_items or keys directly.
  -- Inspect only the keyless public session payload returned by RPC.
  v_total := jsonb_array_length(v_session->'items');
  if v_total<>7 then raise exception 'wrong item count %',v_total; end if;
  select count(distinct item->>'question_id') into v_total
  from jsonb_array_elements(v_session->'items') item;
  if v_total<>7 then raise exception 'duplicate custom question'; end if;

  -- No private analytics or answers before a custom exam finishes.
  v_failed := false;
  begin
    perform public.get_custom_exam_analysis(v_exam);
  exception when others then
    if sqlerrm like '%custom_exam_not_finished%' then v_failed := true;
    else raise;
    end if;
  end;
  if not v_failed then raise exception 'unfinished custom exam analysis exposed'; end if;

  v_session := public.get_active_custom_exam(v_config);
  if (v_session->>'exam_id')::uuid is distinct from v_exam
     or jsonb_array_length(v_session->'answered_question_ids')<>0
     or v_session->'saved_answers'<>'{}'::jsonb
     or v_session::text like '%correct_option_id%'
     or v_session::text like '%explanation_md%' then
    raise exception 'unsafe active custom exam payload: %',v_session;
  end if;

  v_q := (v_session->'items'->0->>'question_id')::uuid;
  v_option := (v_session->'items'->0->'options'->0->>'id')::uuid;
  v_submit := public.submit_answer(v_exam,v_q,jsonb_build_object('option_id',v_option),1);
  if v_submit->>'saved'<>'true' or v_submit ? 'correct'
     or v_submit ? 'explanation_md' then
    raise exception 'custom answer leaks feedback before finish: %',v_submit;
  end if;
  v_submit := public.submit_answer(v_exam,v_q,jsonb_build_object('option_id',v_option),1);
  if v_submit->>'already_answered'<>'true' or v_submit ? 'correct' then
    raise exception 'custom duplicate submission leaks feedback: %',v_submit;
  end if;
  -- Exact repeat start must reuse persisted submitted answers with no keys.
  v_session := public.generate_custom_exam(v_config);
  if (v_session->>'exam_id')::uuid is distinct from v_exam
     or jsonb_array_length(v_session->'answered_question_ids')<>1
     or v_session->'saved_answers'->v_q::text->>'option_id' is distinct from v_option::text
     or v_session::text like '%correct_option_id%'
     or v_session::text like '%explanation_md%' then
    raise exception 'duplicate start lost response or leaked keys: %',v_session;
  end if;
  if public.get_active_custom_exam(jsonb_set(v_config,'{duration_sec}','null'::jsonb)) is not null then
    raise exception 'resume ignored config filter';
  end if;

  -- Another learner must never see this active session or its analysis.
  perform set_config('request.jwt.claim.sub',
    '92100000-0000-4000-8000-000000000002',true);
  if public.get_active_custom_exam() is not null then
    raise exception 'other learner can resume exam';
  end if;
  v_failed := false;
  begin
    perform public.get_custom_exam_analysis(v_exam);
  exception when others then
    if sqlerrm like '%custom_exam_not_found%' then v_failed := true;
    else raise;
    end if;
  end;
  if not v_failed then raise exception 'other learner sees unfinished analytics'; end if;
  perform set_config('request.jwt.claim.sub',
    '92100000-0000-4000-8000-000000000001',true);


  v_bad := jsonb_set(v_config,'{topics,0,difficulty_counts,0,count}','5'::jsonb);
  v_bad := jsonb_set(v_bad,'{topics,0,count}','5'::jsonb);
  v_bad := jsonb_set(v_bad,'{total_count}','8'::jsonb);
  v_preview := public.custom_exam_preflight(v_bad);
  if v_preview->>'ready'<>'false'
     or jsonb_array_length(v_preview->'gaps')<>1 then
    raise exception 'insufficient pool preflight must fail closed: %',v_preview;
  end if;
  begin
    perform public.generate_custom_exam(v_bad);
  exception when others then
    if sqlerrm like '%custom_pool_insufficient%' then v_failed := true;
    else raise;
    end if;
  end;
  if not v_failed then raise exception 'insufficient pool must fail before writing'; end if;
  v_finish := public.finish_exam(v_exam);
  if public.get_active_custom_exam() is not null then
    raise exception 'finished exam must not be returned as active';
  end if;
  if (v_finish->>'max_score')::int<>14 then raise exception 'custom scoring invalid: %',v_finish; end if;
  v_analysis := public.get_custom_exam_analysis(v_exam);
  if (v_analysis->>'total')::int <> 7 or (v_analysis->>'answered')::int <> 1
     or jsonb_array_length(v_analysis->'by_lesson')<>2 then
    raise exception 'post-finish analytics mismatch %',v_analysis;
  end if;
  -- A completed report is also private, even when its UUID is known.
  perform set_config('request.jwt.claim.sub',
    '92100000-0000-4000-8000-000000000002',true);
  v_failed := false;
  begin
    perform public.get_custom_exam_analysis(v_exam);
  exception when others then
    if sqlerrm like '%custom_exam_not_found%' then v_failed := true;
    else raise;
    end if;
  end;
  if not v_failed then raise exception 'other learner sees finished analytics'; end if;
  perform set_config('request.jwt.claim.sub',
    '92100000-0000-4000-8000-000000000001',true);

  -- In learning mode only, correctness may appear after the answer was saved.
  v_session := public.generate_custom_exam(jsonb_set(v_config,'{mode}','"learning"'::jsonb));
  v_q := (v_session->'items'->0->>'question_id')::uuid;
  v_option := (v_session->'items'->0->'options'->0->>'id')::uuid;
  v_submit := public.submit_answer((v_session->>'exam_id')::uuid,v_q,
    jsonb_build_object('option_id',v_option),1);
  if v_submit->>'saved'<>'true' or not(v_submit ? 'correct')
     or not(v_submit ? 'explanation_md') then
    raise exception 'learning feedback not returned after submit: %',v_submit;
  end if;
  v_review := public.get_review(v_exam);
  if jsonb_array_length(v_review)<>7 then raise exception 'post-finish review missing'; end if;
end
$test$;

reset role;

do $admincheck$
declare v_exam uuid;
        v_total int;
begin
  select id into v_exam from public.exams
  where user_id='92100000-0000-4000-8000-000000000001' and kind='custom';
  select count(*) into v_total from public.exams
  where user_id='92100000-0000-4000-8000-000000000001' and kind='custom';
  if v_total<>2 then raise exception 'unexpected custom exam count after learning'; end if;
  select count(*) into v_total from public.exam_items where exam_id=v_exam;
  if v_total<>7 then raise exception 'custom exam items count incorrect'; end if;
end
$admincheck$;
rollback;
