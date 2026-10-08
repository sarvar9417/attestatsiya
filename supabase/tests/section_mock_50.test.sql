-- TASK-044 50-question section mock regression.
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
  values ('72000000-0000-4000-8000-000000000001', 't044@example.test');

  insert into public.modules
    (id, subject_id, order_idx, slug, title_uz, status, code)
  values
    ('72000000-0000-4000-8000-000000000010', v_subject, 98,
     't044-module', 'T044 section mock module', 'published', 'M98');

  insert into public.lessons
    (id, module_id, order_idx, slug, title_uz, status, topic_test_question_count)
  values
    ('72000000-0000-4000-8000-000000000021',
     '72000000-0000-4000-8000-000000000010', 1,
     't044-topic-a', 'T044 Topic A', 'published', 20),
    ('72000000-0000-4000-8000-000000000022',
     '72000000-0000-4000-8000-000000000010', 2,
     't044-topic-b', 'T044 Topic B', 'published', 20),
    ('72000000-0000-4000-8000-000000000023',
     '72000000-0000-4000-8000-000000000010', 3,
     't044-topic-critical', 'T044 Critical topic', 'published', 20),
    ('72000000-0000-4000-8000-000000000024',
     '72000000-0000-4000-8000-000000000010', 4,
     't044-appendix', 'T044 Appendix', 'published', 20);

  insert into public.constructs
    (id, subject_id, group_code, code, slug, title_uz)
  values
    ('72000000-0000-4000-8000-000000000031', v_subject, v_group, 'T044.A', 't044-a', 'T044 A'),
    ('72000000-0000-4000-8000-000000000032', v_subject, v_group, 'T044.B', 't044-b', 'T044 B'),
    ('72000000-0000-4000-8000-000000000033', v_subject, v_group, 'T044.C', 't044-c', 'T044 Critical');

  insert into public.lesson_constructs
    (lesson_id, construct_id, is_required, is_critical, min_questions)
  values
    ('72000000-0000-4000-8000-000000000021', '72000000-0000-4000-8000-000000000031', true, false, 1),
    ('72000000-0000-4000-8000-000000000022', '72000000-0000-4000-8000-000000000032', true, false, 1),
    ('72000000-0000-4000-8000-000000000023', '72000000-0000-4000-8000-000000000033', true, true, 2),
    ('72000000-0000-4000-8000-000000000024', '72000000-0000-4000-8000-000000000031', false, false, 1);

  -- 59 + 57 + 4 = 120 eligible questions. Appendix has no direct source pool.
  insert into public.questions
    (subject_id, construct_id, group_code, format, cognitive, difficulty,
     stem_md, status, source_reference, source_lesson_id)
  select
    v_subject,
    '72000000-0000-4000-8000-000000000031'::uuid,
    v_group,
    'Y1'::public.question_format,
    'qollash'::public.cognitive_level,
    3,
    'T044 A ' || n,
    'published'::public.content_status,
    'T044:A:' || n,
    '72000000-0000-4000-8000-000000000021'::uuid
  from generate_series(1,59) n
  union all
  select
    v_subject,
    '72000000-0000-4000-8000-000000000032'::uuid,
    v_group,
    'Y1'::public.question_format,
    'qollash'::public.cognitive_level,
    3,
    'T044 B ' || n,
    'published'::public.content_status,
    'T044:B:' || n,
    '72000000-0000-4000-8000-000000000022'::uuid
  from generate_series(1,57) n
  union all
  select
    v_subject,
    '72000000-0000-4000-8000-000000000033'::uuid,
    v_group,
    'Y1'::public.question_format,
    'mulohaza'::public.cognitive_level,
    5,
    'T044 C ' || n,
    'published'::public.content_status,
    'T044:C:' || n,
    '72000000-0000-4000-8000-000000000023'::uuid
  from generate_series(1,4) n;

  insert into public.question_keys (question_id, payload, explanation_md)
  select id, '{}'::jsonb, 'T044 key'
  from public.questions
  where source_reference like 'T044:%';
end
$$;

select set_config(
  'request.jwt.claim.sub',
  '72000000-0000-4000-8000-000000000001',
  false
);
set role authenticated;

-- First assembly must be 50/50 unseen.
select public.generate_section_mock('72000000-0000-4000-8000-000000000010');

reset role;

do $$
declare
  v_exam uuid;
  v_meta jsonb;
  v_n int;
begin
  select id, selection_meta
    into strict v_exam, v_meta
  from public.exams
  where user_id = '72000000-0000-4000-8000-000000000001'
    and kind = 'bolim'::public.exam_kind
  order by started_at
  limit 1;

  select count(*) into v_n
  from public.exam_items
  where exam_id = v_exam;
  if v_n <> 50 then
    raise exception 'expected 50 items, got %', v_n;
  end if;

  select count(distinct question_id) into v_n
  from public.exam_items
  where exam_id = v_exam;
  if v_n <> 50 then
    raise exception 'duplicate question in section mock';
  end if;

  if (v_meta->>'selector_version') <> 'section-mock-v1'
     or (v_meta->>'target_count')::int <> 50
     or (v_meta->>'selected_count')::int <> 50
     or (v_meta->>'assessable_topic_count')::int <> 3
     or (v_meta->>'unassessable_topic_count')::int <> 1
     or (v_meta->>'critical_objective_count')::int <> 1
     or (v_meta->>'unseen_selected_count')::int <> 50 then
    raise exception 'selection metadata invalid: %', v_meta;
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_meta->'topic_coverage') x
    where (x->>'selected_count')::int < 1
  ) then
    raise exception 'topic hard-slot coverage failed';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(v_meta->'critical_coverage') x
    where (x->>'selected_count')::int < (x->>'min_questions')::int
  ) then
    raise exception 'critical hard-slot coverage failed';
  end if;
end
$$;

-- Audit 19 more assemblies: every one must preserve 50/no-duplicate/topic/critical invariants.
do $$
declare
  i int;
  v_payload jsonb;
  v_exam uuid;
  v_meta jsonb;
  v_n int;
begin
  for i in 1..19 loop
    perform set_config(
      'request.jwt.claim.sub',
      '72000000-0000-4000-8000-000000000001',
      true
    );
    v_payload := public.generate_section_mock(
      '72000000-0000-4000-8000-000000000010'
    );

    v_exam := (v_payload->>'exam_id')::uuid;

    select count(*)
      into v_n
    from public.exam_items
    where exam_id = v_exam;

    select selection_meta
      into strict v_meta
    from public.exams
    where id = v_exam;

    if v_n <> 50 then
      raise exception 'assembly %: expected 50 items, got %', i + 1, v_n;
    end if;

    if (select count(distinct question_id)
        from public.exam_items where exam_id = v_exam) <> 50 then
      raise exception 'assembly %: duplicate question', i + 1;
    end if;

    if exists (
      select 1
      from jsonb_array_elements(v_meta->'topic_coverage') x
      where (x->>'selected_count')::int < 1
    ) then
      raise exception 'assembly %: topic coverage failed', i + 1;
    end if;

    if exists (
      select 1
      from jsonb_array_elements(v_meta->'critical_coverage') x
      where (x->>'selected_count')::int < (x->>'min_questions')::int
    ) then
      raise exception 'assembly %: critical coverage failed', i + 1;
    end if;
  end loop;
end
$$;

-- Pass boundary: exactly 45/50 with all critical minimums correct => pass + module complete.
do $$
declare
  v_exam uuid;
  v_critical uuid := '72000000-0000-4000-8000-000000000033';
begin
  select id into strict v_exam
  from public.exams
  where user_id = '72000000-0000-4000-8000-000000000001'
    and kind = 'bolim'::public.exam_kind
  order by started_at
  limit 1;

  update public.exam_items
     set is_correct = false,
         score = 0
   where exam_id = v_exam;

  update public.exam_items ei
     set is_correct = true,
         score = 2
   where ei.id in (
     select id
     from public.exam_items
     where exam_id = v_exam
     order by
       case when construct_id = v_critical then 0 else 1 end,
       order_idx
     limit 45
   );

  perform set_config('t044.first_exam_id', v_exam::text, false);
end
$$;

select set_config(
  'request.jwt.claim.sub',
  '72000000-0000-4000-8000-000000000001',
  false
);
set role authenticated;
select public.finish_exam(current_setting('t044.first_exam_id')::uuid);
reset role;

do $$
declare
  v_exam uuid;
  v_meta jsonb;
begin
  select id, selection_meta
    into strict v_exam, v_meta
  from public.exams
  where user_id = '72000000-0000-4000-8000-000000000001'
    and kind = 'bolim'::public.exam_kind
  order by started_at
  limit 1;

  if not (select passed from public.exams where id = v_exam) then
    raise exception '45/50 with critical floor must pass';
  end if;

  if (v_meta#>>'{completion,correct_count}')::int <> 45
     or (v_meta#>>'{completion,critical_floor_met}')::boolean is not true then
    raise exception 'completion evidence invalid: %', v_meta;
  end if;

  if not exists (
    select 1
    from public.user_module_progress
    where user_id = '72000000-0000-4000-8000-000000000001'
      and module_id = '72000000-0000-4000-8000-000000000010'
      and completed_at is not null
  ) then
    raise exception 'module completion not persisted';
  end if;
end
$$;

-- Critical-floor boundary: clone a 50-item assembly, keep 45 correct but only
-- one critical answer correct while minimum is 2 => fail.
do $$
declare
  v_source_exam uuid;
  v_fail_exam uuid := '72000000-0000-4000-8000-000000000099';
  v_meta jsonb;
  v_critical uuid := '72000000-0000-4000-8000-000000000033';
begin
  select id, selection_meta
    into strict v_source_exam, v_meta
  from public.exams
  where user_id = '72000000-0000-4000-8000-000000000001'
    and kind = 'bolim'::public.exam_kind
  order by started_at
  limit 1;

  insert into public.exams
    (id, user_id, kind, module_id, duration_sec, selection_meta)
  values
    (
      v_fail_exam,
      '72000000-0000-4000-8000-000000000001',
      'bolim'::public.exam_kind,
      '72000000-0000-4000-8000-000000000010',
      6000,
      v_meta - 'completion'
    );

  insert into public.exam_items
    (exam_id, question_id, construct_id, order_idx, score, is_correct)
  select
    v_fail_exam,
    question_id,
    construct_id,
    order_idx,
    0,
    false
  from public.exam_items
  where exam_id = v_source_exam;

  -- One critical correct.
  update public.exam_items
     set is_correct = true,
         score = 2
   where id = (
     select id
     from public.exam_items
     where exam_id = v_fail_exam
       and construct_id = v_critical
     order by order_idx
     limit 1
   );

  -- Plus 44 non-critical correct = 45 total.
  update public.exam_items ei
     set is_correct = true,
         score = 2
   where ei.id in (
     select id
     from public.exam_items
     where exam_id = v_fail_exam
       and construct_id <> v_critical
     order by order_idx
     limit 44
   );
end
$$;

select set_config(
  'request.jwt.claim.sub',
  '72000000-0000-4000-8000-000000000001',
  false
);
set role authenticated;
select public.finish_exam('72000000-0000-4000-8000-000000000099');
reset role;

do $$
declare
  v_meta jsonb;
begin
  select selection_meta into strict v_meta
  from public.exams
  where id = '72000000-0000-4000-8000-000000000099';

  if (select passed from public.exams
      where id = '72000000-0000-4000-8000-000000000099') then
    raise exception '45/50 with failed critical floor must fail';
  end if;

  if (v_meta#>>'{completion,correct_count}')::int <> 45
     or (v_meta#>>'{completion,critical_floor_met}')::boolean is not false then
    raise exception 'critical-floor failure evidence invalid: %', v_meta;
  end if;
end
$$;

-- Permission boundary.
do $$
begin
  if has_function_privilege(
    'anon',
    'public.generate_section_mock(uuid)',
    'EXECUTE'
  ) then
    raise exception 'anon must not execute section mock assembler';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.generate_section_mock(uuid)',
    'EXECUTE'
  ) then
    raise exception 'authenticated must execute section mock assembler';
  end if;
end
$$;

rollback;
