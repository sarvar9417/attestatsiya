-- Adaptive topic test regression: no invented questions, no empty sessions.
begin;

do $$
declare
  v_subject uuid;
  v_group text;
begin
  select bp.subject_id, bq.group_code into v_subject,v_group
  from public.blueprints bp
  join public.blueprint_quotas bq on bq.blueprint_id=bp.id
  where bp.is_active order by bq.order_idx limit 1;

  insert into auth.users (id,email) values
    ('66000000-0000-4000-8000-000000000001', 'topic-pool-test@example.test');

  insert into public.modules (id,subject_id,order_idx,slug,title_uz,status,code)
  values ('66000000-0000-4000-8000-000000000010',v_subject,98,
          'adaptive-topic-test','Adaptive topic test','published','M98');

  insert into public.lessons (id,module_id,order_idx,slug,title_uz,status,topic_test_question_count)
  values ('66000000-0000-4000-8000-000000000020',
          '66000000-0000-4000-8000-000000000010',1,
          'adaptive-topic-test-lesson','Adaptive test lesson','published',20);

  insert into public.constructs (id,subject_id,group_code,code,slug,title_uz)
  values ('66000000-0000-4000-8000-000000000030',
          v_subject,v_group,'ADAPT.TEST','adaptive-topic-objective','Adaptive objective');

  insert into public.lesson_constructs
    (lesson_id,construct_id,is_required,is_critical,min_questions)
  values ('66000000-0000-4000-8000-000000000020',
          '66000000-0000-4000-8000-000000000030',true,false,1);

  insert into public.questions
    (subject_id,construct_id,group_code,format,cognitive,difficulty,stem_md,
     status,source_reference,source_lesson_id)
  select v_subject,'66000000-0000-4000-8000-000000000030'::uuid,v_group,
         'Y1'::public.question_format,'bilish'::public.cognitive_level,
         1,'Adaptive question '||n,'published'::public.content_status,
         'topic-pool-fixture:'||n,'66000000-0000-4000-8000-000000000020'::uuid
  from generate_series(1,3) n;

  insert into public.question_options(question_id,side,order_idx,content_md)
  select q.id,'a',g.n,'Variant '||g.n
  from public.questions q cross join generate_series(1,4) g(n)
  where q.source_reference like 'topic-pool-fixture:%';

  insert into public.question_keys(question_id,payload,explanation_md)
  select q.id,jsonb_build_object('correct_option_id', (
    select o.id::text from public.question_options o
    where o.question_id=q.id and o.order_idx=1
    limit 1
  )),'ok'
  from public.questions q where q.source_reference like 'topic-pool-fixture:%';
end
$$;

do $$
declare v_meta jsonb;
begin
  v_meta:=public.topic_test_preview('66000000-0000-4000-8000-000000000020');
  if (v_meta->>'question_count')::int<>3
    or (v_meta->>'available_count')::int<>3
    or (v_meta->>'configured_count')::int<>20
    or (v_meta->>'duration_sec')::int<>360
    or v_meta->>'reason' is not null
  then raise exception 'adaptive preview mismatch: %',v_meta;
  end if;
end
$$;

select set_config('request.jwt.claim.sub',
  '66000000-0000-4000-8000-000000000001',false);
set role authenticated;
select public.generate_topic_test('66000000-0000-4000-8000-000000000020');
reset role;

do $$
declare v_exam uuid; v_meta jsonb; v_n int;
begin
  select id,selection_meta into strict v_exam,v_meta from public.exams
  where lesson_id='66000000-0000-4000-8000-000000000020'::uuid
    and user_id='66000000-0000-4000-8000-000000000001'::uuid;
  select count(*) into v_n from public.exam_items where exam_id=v_exam;
  if v_n<>3 or (select duration_sec from public.exams where id=v_exam)<>360
    or (v_meta->>'target_count')::int<>3
    or (v_meta->>'configured_count')::int<>20
    or (v_meta->>'required_slots')::int<>1
  then raise exception 'short topic test failed: items=%, meta=%',v_n,v_meta;
  end if;
end
$$;

update public.questions set status='archived'::public.content_status
where source_reference like 'topic-pool-fixture:%';

do $$
declare v_meta jsonb;
begin
  v_meta:=public.topic_test_preview('66000000-0000-4000-8000-000000000020');
  if (v_meta->>'question_count')::int<>0 or v_meta->>'reason'<>'topic_pool_insufficient'
  then raise exception 'empty pool preview mismatch: %',v_meta; end if;
end
$$;

select set_config('request.jwt.claim.sub',
  '66000000-0000-4000-8000-000000000001',false);
set role authenticated;
do $$
declare v_failed boolean:=false;
begin
  begin
    perform public.generate_topic_test('66000000-0000-4000-8000-000000000020');
  exception when others then
    if sqlerrm not like '%topic_pool_insufficient%' then raise; end if;
    v_failed:=true;
  end;
  if not v_failed then raise exception 'empty pool should not start a session'; end if;
end
$$;
reset role;

do $$
declare v_total int;
begin
  select count(*) into v_total from public.exams
  where lesson_id='66000000-0000-4000-8000-000000000020'::uuid
    and user_id='66000000-0000-4000-8000-000000000001'::uuid;
  if v_total<>1 then raise exception 'empty pool generated extra exam: %',v_total; end if;
end
$$;

select set_config('request.jwt.claim.sub','',false);
select 'adaptive_topic_test_pool_ok' as result;
rollback;
