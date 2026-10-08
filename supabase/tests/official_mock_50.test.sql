-- TASK-045 official mock regression.
begin;

do $$
declare
  v_subject uuid;
begin
  select id into strict v_subject
  from public.subjects
  order by created_at nulls last, id
  limit 1;

  insert into auth.users (id, email)
  values ('73000000-0000-4000-8000-000000000001', 't045@example.test');

  -- Guarantee a deep enough pool for every active blueprint quota cell.
  with quota as (
    select
      bq.group_code,
      bq.n_bilish,
      bq.n_qollash,
      bq.n_mulohaza
    from public.blueprints bp
    join public.blueprint_quotas bq on bq.blueprint_id = bp.id
    where bp.is_active
  ),
  chosen_construct as (
    select
      q.group_code,
      (
        select c.id
        from public.constructs c
        where c.group_code = q.group_code
          and c.is_active
        order by c.code, c.id
        limit 1
      ) as construct_id,
      q.n_bilish,
      q.n_qollash,
      q.n_mulohaza
    from quota q
  ),
  rows_to_insert as (
    select
      group_code,
      construct_id,
      'bilish'::public.cognitive_level as cognitive,
      n
    from chosen_construct
    cross join lateral generate_series(1, greatest(n_bilish * 3, 0)) n
    where n_bilish > 0
    union all
    select
      group_code,
      construct_id,
      'qollash'::public.cognitive_level,
      n
    from chosen_construct
    cross join lateral generate_series(1, greatest(n_qollash * 3, 0)) n
    where n_qollash > 0
    union all
    select
      group_code,
      construct_id,
      'mulohaza'::public.cognitive_level,
      n
    from chosen_construct
    cross join lateral generate_series(1, greatest(n_mulohaza * 3, 0)) n
    where n_mulohaza > 0
  )
  insert into public.questions (
    subject_id,
    construct_id,
    group_code,
    format,
    cognitive,
    difficulty,
    stem_md,
    status,
    source_reference
  )
  select
    v_subject,
    construct_id,
    group_code,
    'Y1'::public.question_format,
    cognitive,
    case cognitive
      when 'bilish'::public.cognitive_level then 2
      when 'qollash'::public.cognitive_level then 3
      else 4
    end,
    'T045 ' || group_code || ' ' || cognitive::text || ' ' || n,
    'published'::public.content_status,
    'T045:' || group_code || ':' || cognitive::text || ':' || n
  from rows_to_insert
  where construct_id is not null;

  insert into public.question_keys (question_id, payload, explanation_md)
  select q.id, '{}'::jsonb, 'T045 key'
  from public.questions q
  where q.source_reference like 'T045:%'
    and not exists (
      select 1 from public.question_keys qk where qk.question_id = q.id
    );
end
$$;

select set_config(
  'request.jwt.claim.sub',
  '73000000-0000-4000-8000-000000000001',
  false
);

-- Run assertions as the test owner so fixture tables remain readable.
-- generate_official_mock() still resolves auth.uid() from the JWT claim above;
-- execute privilege is checked separately below.
do $$
declare
  i int;
  v_payload jsonb;
  v_exam uuid;
  v_meta jsonb;
  v_count int;
  v_bp uuid;
  v_duration int;
  v_expected int;
  v_actual int;
  v_bilish int;
  v_qollash int;
  v_mulohaza int;
  v_quota record;
begin
  select id, duration_min * 60
    into strict v_bp, v_duration
  from public.blueprints
  where is_active
  order by version desc
  limit 1;

  if v_duration <> 7200 then
    raise exception 'official 2026 duration must be 7200 sec, got %', v_duration;
  end if;

  for i in 1..3 loop
    v_payload := public.generate_official_mock();
    v_exam := (v_payload->>'exam_id')::uuid;

    if (v_payload->>'kind') <> 'mock'
       or (v_payload->>'duration_sec')::int <> 7200 then
      raise exception 'mock payload contract invalid: %', v_payload;
    end if;

    if v_payload::text ~ '"key"[[:space:]]*:' then
      raise exception 'answer key leaked in start payload';
    end if;

    select selection_meta into strict v_meta
    from public.exams where id = v_exam;

    if (v_meta->>'selector_version') <> 'official-mock-v1'
       or (v_meta->>'target_count')::int <> 50
       or (v_meta->>'selected_count')::int <> 50
       or (v_meta->>'duration_sec')::int <> 7200 then
      raise exception 'selection metadata invalid: %', v_meta;
    end if;

    select count(*) into v_count
    from public.exam_items
    where exam_id = v_exam;

    if v_count <> 50 then
      raise exception 'assembly % expected 50 items, got %', i, v_count;
    end if;

    select count(distinct question_id) into v_count
    from public.exam_items
    where exam_id = v_exam;

    if v_count <> 50 then
      raise exception 'assembly % contains duplicate questions', i;
    end if;

    select
      count(*) filter (where q.cognitive = 'bilish'::public.cognitive_level),
      count(*) filter (where q.cognitive = 'qollash'::public.cognitive_level),
      count(*) filter (where q.cognitive = 'mulohaza'::public.cognitive_level)
    into v_bilish, v_qollash, v_mulohaza
    from public.exam_items ei
    join public.questions q on q.id = ei.question_id
    where ei.exam_id = v_exam;

    if v_bilish <> 8 or v_qollash <> 35 or v_mulohaza <> 7 then
      raise exception
        'assembly % cognitive totals invalid: %/%/%',
        i, v_bilish, v_qollash, v_mulohaza;
    end if;

    for v_quota in
      select group_code, n_bilish, n_qollash, n_mulohaza
      from public.blueprint_quotas
      where blueprint_id = v_bp
      order by order_idx, group_code
    loop
      select count(*) into v_actual
      from public.exam_items ei
      join public.questions q on q.id = ei.question_id
      where ei.exam_id = v_exam
        and q.group_code = v_quota.group_code
        and q.cognitive = 'bilish'::public.cognitive_level;
      v_expected := v_quota.n_bilish;
      if v_actual <> v_expected then
        raise exception
          'assembly % group % bilish expected %, got %',
          i, v_quota.group_code, v_expected, v_actual;
      end if;

      select count(*) into v_actual
      from public.exam_items ei
      join public.questions q on q.id = ei.question_id
      where ei.exam_id = v_exam
        and q.group_code = v_quota.group_code
        and q.cognitive = 'qollash'::public.cognitive_level;
      v_expected := v_quota.n_qollash;
      if v_actual <> v_expected then
        raise exception
          'assembly % group % qollash expected %, got %',
          i, v_quota.group_code, v_expected, v_actual;
      end if;

      select count(*) into v_actual
      from public.exam_items ei
      join public.questions q on q.id = ei.question_id
      where ei.exam_id = v_exam
        and q.group_code = v_quota.group_code
        and q.cognitive = 'mulohaza'::public.cognitive_level;
      v_expected := v_quota.n_mulohaza;
      if v_actual <> v_expected then
        raise exception
          'assembly % group % mulohaza expected %, got %',
          i, v_quota.group_code, v_expected, v_actual;
      end if;
    end loop;
  end loop;
end
$;

do $$
begin
  if has_function_privilege(
    'anon',
    'public.generate_official_mock()',
    'EXECUTE'
  ) then
    raise exception 'anon must not execute official mock assembler';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.generate_official_mock()',
    'EXECUTE'
  ) then
    raise exception 'authenticated must execute official mock assembler';
  end if;
end
$$;

rollback;
