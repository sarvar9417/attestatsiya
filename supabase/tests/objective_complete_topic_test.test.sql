-- T-041 objective-complete topic-test regression.
begin;

do $$
declare
  v_subject uuid;
  v_group text;
begin
  select bp.subject_id, bq.group_code
    into v_subject, v_group
  from public.blueprints bp
  join public.blueprint_quotas bq on bq.blueprint_id = bp.id
  where bp.is_active
  order by bq.order_idx
  limit 1;

  insert into auth.users (id, email)
  values ('60000000-0000-4000-8000-000000000001', 't041@example.test');

  insert into public.modules
    (id, subject_id, order_idx, slug, title_uz, status, code)
  values
    ('60000000-0000-4000-8000-000000000010', v_subject, 99,
     't041-module', 'T041 module', 'published', 'M99');

  insert into public.lessons
    (id, module_id, order_idx, slug, title_uz, status, topic_test_question_count)
  values
    ('60000000-0000-4000-8000-000000000020',
     '60000000-0000-4000-8000-000000000010',
     1, 't041-lesson', 'T041 lesson', 'published', 10);

  insert into public.constructs
    (id, subject_id, group_code, code, slug, title_uz)
  values
    ('60000000-0000-4000-8000-000000000031', v_subject, v_group, 'T041.A', 't041-a', 'Critical A'),
    ('60000000-0000-4000-8000-000000000032', v_subject, v_group, 'T041.B', 't041-b', 'Required B'),
    ('60000000-0000-4000-8000-000000000033', v_subject, v_group, 'T041.C', 't041-c', 'Optional C');

  insert into public.lesson_constructs
    (lesson_id, construct_id, is_required, is_critical, min_questions)
  values
    ('60000000-0000-4000-8000-000000000020', '60000000-0000-4000-8000-000000000031', true, true, 2),
    ('60000000-0000-4000-8000-000000000020', '60000000-0000-4000-8000-000000000032', true, false, 1),
    ('60000000-0000-4000-8000-000000000020', '60000000-0000-4000-8000-000000000033', false, false, 1);

  insert into public.questions
    (subject_id, construct_id, group_code, format, cognitive, difficulty,
     stem_md, status, source_reference, source_lesson_id)
  select v_subject, '60000000-0000-4000-8000-000000000031'::uuid, v_group,
         'Y1'::public.question_format, 'qollash'::public.cognitive_level, 3, 'T041 A' || n, 'published'::public.content_status,
         'T041:A' || n, '60000000-0000-4000-8000-000000000020'::uuid
  from generate_series(1,4) n
  union all
  select v_subject, '60000000-0000-4000-8000-000000000032'::uuid, v_group,
         'Y1'::public.question_format, 'qollash'::public.cognitive_level, 3, 'T041 B' || n, 'published'::public.content_status,
         'T041:B' || n, '60000000-0000-4000-8000-000000000020'::uuid
  from generate_series(1,3) n
  union all
  select v_subject, '60000000-0000-4000-8000-000000000033'::uuid, v_group,
         'Y1'::public.question_format, 'qollash'::public.cognitive_level, 3, 'T041 C' || n, 'published'::public.content_status,
         'T041:C' || n, '60000000-0000-4000-8000-000000000020'::uuid
  from generate_series(1,5) n;

  insert into public.question_keys (question_id, payload, explanation_md)
  select id, '{}'::jsonb, 'T041 key'
  from public.questions
  where stem_md like 'T041 %';

  -- A3/A4 old exposure: exactly 10 other questions remain fresh.
  insert into public.exams
    (id, user_id, kind, module_id, lesson_id, started_at, finished_at)
  values
    ('62000000-0000-4000-8000-000000000001',
     '60000000-0000-4000-8000-000000000001',
     'mavzu',
     '60000000-0000-4000-8000-000000000010',
     '60000000-0000-4000-8000-000000000020',
     now() - interval '7 days', now() - interval '7 days' + interval '5 minutes');

  insert into public.exam_items
    (exam_id, question_id, construct_id, order_idx)
  select '62000000-0000-4000-8000-000000000001'::uuid,
         q.id, q.construct_id,
         row_number() over (order by q.stem_md)::int
  from public.questions q
  where q.stem_md in ('T041 A3', 'T041 A4');
end
$$;

select set_config('request.jwt.claim.sub',
  '60000000-0000-4000-8000-000000000001', false);
set role authenticated;
select public.generate_topic_test('60000000-0000-4000-8000-000000000020');
reset role;

do $$
declare
  v_exam uuid;
  v_meta jsonb;
  v_n int;
begin
  select id, selection_meta into strict v_exam, v_meta
  from public.exams
  where user_id = '60000000-0000-4000-8000-000000000001'
    and id <> '62000000-0000-4000-8000-000000000001'
  order by started_at desc limit 1;

  select count(*) into v_n from public.exam_items where exam_id = v_exam;
  if v_n <> 10 then raise exception 'expected 10 items, got %', v_n; end if;

  if (select duration_sec from public.exams where id=v_exam) <> 1200 then
    raise exception 'duration must be 1200';
  end if;

  if (select count(*) from public.exam_items
      where exam_id=v_exam
        and construct_id='60000000-0000-4000-8000-000000000031') < 2 then
    raise exception 'critical objective A hard slot missing';
  end if;

  if (select count(*) from public.exam_items
      where exam_id=v_exam
        and construct_id='60000000-0000-4000-8000-000000000032') < 1 then
    raise exception 'required objective B hard slot missing';
  end if;

  if exists (
    select 1 from public.exam_items ei
    join public.questions q on q.id=ei.question_id
    where ei.exam_id=v_exam and q.stem_md in ('T041 A3','T041 A4')
  ) then
    raise exception 'low-exposure preference failed';
  end if;

  if v_meta->>'selector_version' <> 'objective-complete-v1'
     or (v_meta->>'target_count')::int <> 10
     or (v_meta->>'required_objective_count')::int <> 2
     or (v_meta->>'critical_objective_count')::int <> 1
     or (v_meta->>'required_slots')::int <> 3 then
    raise exception 'coverage metadata incorrect: %', v_meta;
  end if;
end
$$;

-- Required objective B loses its pool: no new exam may be created.
update public.questions
set status='archived'
where construct_id='60000000-0000-4000-8000-000000000032';

select set_config('request.jwt.claim.sub',
  '60000000-0000-4000-8000-000000000001', false);
set role authenticated;

do $$
declare
  v_before int;
  v_after int;
  v_failed boolean := false;
begin
  select count(*) into v_before from public.exams
  where user_id=auth.uid()
    and lesson_id='60000000-0000-4000-8000-000000000020';

  begin
    perform public.generate_topic_test('60000000-0000-4000-8000-000000000020');
  exception when others then
    if sqlerrm not like '%topic_pool_insufficient%' then raise; end if;
    v_failed := true;
  end;

  if not v_failed then raise exception 'insufficient pool must fail'; end if;

  select count(*) into v_after from public.exams
  where user_id=auth.uid()
    and lesson_id='60000000-0000-4000-8000-000000000020';

  if v_after <> v_before then
    raise exception 'failed assembly created exam: % -> %', v_before, v_after;
  end if;
end
$$;

reset role;
select set_config('request.jwt.claim.sub', '', false);
select 'objective_complete_topic_test_ok' as result;
rollback;
