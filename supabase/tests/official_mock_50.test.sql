-- TASK-045 official mock regression.
begin;

do $mock_fixture_v3$
declare
  v_subject uuid;
  v_qid uuid;
  v_construct uuid;
  v_lesson uuid;
  v_format public.question_format;
  v_group text;
  v_cognitive public.cognitive_level;
  v_key jsonb;
  v_idx int;
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
    source_reference,
    source_lesson_id
  )
  select
    v_subject,
    r.construct_id,
    r.group_code,
    'Y1'::public.question_format,
    cognitive,
    case cognitive
      when 'bilish'::public.cognitive_level then 2
      when 'qollash'::public.cognitive_level then 3
      else 4
    end,
    'T045 ' || r.group_code || ' ' || r.cognitive::text || ' ' || r.n,
    case when r.group_code in ('KS','PM.GEN','PM.MET')
      then 'draft'::public.content_status
      else 'published'::public.content_status end,
    'T045:' || r.group_code || ':' || r.cognitive::text || ':' || r.n,
    (
      select lc.lesson_id
      from public.lesson_constructs lc
      join public.lessons l on l.id=lc.lesson_id
      where lc.construct_id=r.construct_id
        and l.status='published'::public.content_status
      order by l.order_idx,l.id
      limit 1
    )
  from rows_to_insert r
  where r.construct_id is not null;

  insert into public.question_options(question_id,side,order_idx,content_md)
  select q.id,'a',x,'T045 option '||x
  from public.questions q
  cross join generate_series(1,4) x
  where q.source_reference like 'T045:%'
    and q.format='Y1'::public.question_format;

  insert into public.question_keys (question_id, payload, explanation_md)
  select q.id,
    jsonb_build_object(
      'correct_option_id',(
        select o.id from public.question_options o
        where o.question_id=q.id and o.side='a'
        order by o.order_idx,o.id limit 1
      )
    ),
    'T045 regression answer explanation'
  from public.questions q
  where q.source_reference like 'T045:%'
    and not exists (
      select 1 from public.question_keys qk where qk.question_id = q.id
    );

  -- Add real structurally valid Y2/Y3 questions to verify the v4 selector
  -- sees both formats and spreads picks across topic constructs.
  for v_format, v_group, v_cognitive in
    select 'Y2'::public.question_format, 'S5.WEB'::text, 'qollash'::public.cognitive_level
    union all
    select 'Y3'::public.question_format, 'S1.INFO'::text, 'bilish'::public.cognitive_level
  loop
    for v_idx in 1..9 loop
      select c.id into strict v_construct
      from public.constructs c
      where c.group_code = v_group and c.is_active
      order by c.code, c.id
      offset (case when v_group = 'S5.WEB' then (v_idx - 1) % 3 else 0 end)
      limit 1;

      select lc.lesson_id into strict v_lesson
      from public.lesson_constructs lc
      join public.lessons l on l.id=lc.lesson_id
      where lc.construct_id=v_construct
        and l.status='published'::public.content_status
      order by l.order_idx,l.id
      limit 1;

      insert into public.questions (
        subject_id, construct_id, group_code, format, cognitive, difficulty,
        stem_md, status, source_reference, source_lesson_id
      ) values (
        v_subject, v_construct, v_group, v_format, v_cognitive, 3,
        'T045-V3 ' || v_group || ' ' || v_format::text || ' ' || v_idx,
        'published'::public.content_status,
        'T045:V4:' || v_group || ':' || v_format::text || ':' || v_idx,
        v_lesson
      ) returning id into v_qid;

      if v_format = 'Y2'::public.question_format then
        insert into public.question_options(question_id, side, order_idx, content_md)
        select v_qid, case when x <= 4 then 'a' else 'b' end,
               case when x <= 4 then x else x - 4 end,
               'T045 matched ' || x
        from generate_series(1,8) x;
        select jsonb_build_object('pairs',jsonb_object_agg(a.id::text,b.id::text))
        into v_key
        from (
          select id,row_number() over(order by order_idx,id) rn
          from public.question_options
          where question_id=v_qid and side='a'
        ) a join (
          select id,row_number() over(order by order_idx,id) rn
          from public.question_options
          where question_id=v_qid and side='b'
        ) b on a.rn=b.rn;
      else
        insert into public.question_options(question_id, side, order_idx, content_md)
        select v_qid,'a',x,'T045 step ' || x from generate_series(1,4) x;
        select jsonb_build_object('order',jsonb_agg(o.id order by o.order_idx))
        into v_key from public.question_options o where o.question_id=v_qid;
      end if;

      insert into public.question_keys(question_id,payload,explanation_md)
      values(v_qid,v_key,'T045 regression key');
    end loop;
  end loop;

  -- TASK433: The official mock regression needs a complete KS/PM quota,
  -- but genuine published pedagogy questions with unresolved source-evidence
  -- findings must now be excluded. Publish ONLY the synthetic T045 fixture
  -- using its own CI-only editorial record. The outer transaction ROLLBACK
  -- guarantees this assertion fixture never escapes to production.
  UPDATE public.questions
  SET status='review'::public.content_status
  WHERE source_reference LIKE 'T045:%'
    AND group_code IN ('KS','PM.GEN','PM.MET')
    AND status='draft'::public.content_status;

  INSERT INTO public.question_editorial_checks(
    question_id,reviewer_id,answer_verified,reference_verified,
    wording_verified,original_authorship_verified,reviewer_notes,content_fingerprint
  )
  SELECT q.id,'73000000-0000-4000-8000-000000000001'::uuid,
    true,true,true,true,
    'TASK433 CI-only fully synthetic test question; key and reference are controlled by this fixture, not an external exam source or independent human review.',
    public.professional_question_fingerprint(q.id)
  FROM public.questions q
  WHERE q.source_reference LIKE 'T045:%'
    AND q.group_code IN ('KS','PM.GEN','PM.MET')
    AND q.status='review'::public.content_status
  ON CONFLICT(question_id) DO NOTHING;

  UPDATE public.questions
  SET status='published'::public.content_status
  WHERE source_reference LIKE 'T045:%'
    AND group_code IN ('KS','PM.GEN','PM.MET')
    AND status='review'::public.content_status;

  IF EXISTS(
    SELECT 1 FROM public.questions q
    WHERE q.source_reference LIKE 'T045:%'
      AND q.group_code IN ('KS','PM.GEN','PM.MET')
      AND q.status<>'published'::public.content_status
  ) THEN
    RAISE EXCEPTION 'TASK433: synthetic pedagogy mock fixture failed publication';
  END IF;
end
$mock_fixture_v3$;

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
  v_match_pool int;
  v_exam_constructs int;
  v_same_stem_excess int;
  v_counts jsonb;
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

    if (v_meta->>'selector_version') <> 'official-mock-v4'
       or (v_meta->>'target_count')::int <> 50
       or (v_meta->>'selected_count')::int <> 50
       or (v_meta->>'duration_sec')::int <> 7200
       or v_meta->>'selection_strategy' <> 'least_exposure_quality_gated_diverse_random'
       or not (v_meta->'rules' ? 'soft_y2_y3_diversity')
       or not (v_meta->'rules' ? 'soft_distinct_stem_and_construct')
       or not (v_meta->'rules' ? 'selectable_nonzero_cognitive_cells_only') then
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

    -- Pool metadata excludes published items in cells allocated ZERO questions.
    select count(*) into v_match_pool
    from public.questions q
    join public.constructs c on c.id=q.construct_id
    join public.blueprint_quotas bq on bq.blueprint_id=v_bp and bq.group_code=q.group_code
    where q.status='published'::public.content_status
      and public.is_question_official_mock_eligible(q.id)
      and c.is_active and c.group_code=q.group_code
      and exists(select 1 from public.question_keys k where k.question_id=q.id)
      and (
        (q.cognitive='bilish'::public.cognitive_level and bq.n_bilish>0)
        or (q.cognitive='qollash'::public.cognitive_level and bq.n_qollash>0)
        or (q.cognitive='mulohaza'::public.cognitive_level and bq.n_mulohaza>0)
      );
    if (v_meta->>'eligible_pool_count')::int <> v_match_pool then
      raise exception 'v4 eligible pool not actionable: metadata %, actual %',
        v_meta->>'eligible_pool_count', v_match_pool;
    end if;

    select jsonb_build_object(
      'Y1', count(*) filter(where q.format='Y1'::public.question_format),
      'Y2', count(*) filter(where q.format='Y2'::public.question_format),
      'Y3', count(*) filter(where q.format='Y3'::public.question_format)
    ), count(distinct q.construct_id),
    count(*) - count(distinct lower(regexp_replace(btrim(q.stem_md),'[[:space:]]+',' ','g')))
    into v_counts, v_exam_constructs, v_same_stem_excess
    from public.exam_items ei join public.questions q on q.id=ei.question_id
    where ei.exam_id=v_exam;

    if v_counts <> v_meta->'format_counts'
       or v_exam_constructs <> (v_meta->>'distinct_construct_count')::int
       or v_same_stem_excess <> (v_meta->>'same_stem_excess_count')::int then
      raise exception 'v3 selection format/construct/stem audit metadata incorrect';
    end if;

    -- Fixtures provide 9 Y2 and 9 Y3 candidates with different IDs/stems.
    -- These are a product diversity preference, NOT an invented official share.
    if (v_counts->>'Y2')::int < 1 or (v_counts->>'Y3')::int < 1 then
      raise exception 'v3 ignored Y2/Y3 diversity on assembly %: %', i, v_counts;
    end if;

    select count(distinct q.construct_id) into v_exam_constructs
    from public.exam_items ei join public.questions q on q.id=ei.question_id
    where ei.exam_id=v_exam and q.group_code='S5.WEB';
    if v_exam_constructs < 2 then
      raise exception 'v3 failed to diversify S5.WEB constructs: %', v_exam_constructs;
    end if;

    -- This cell has at least 3x its quota in the fixture. Even though
    -- selection is randomized, an unused eligible question MUST be preferred.
    if exists (
      select 1
        from public.exam_items current_item
        join public.questions q on q.id = current_item.question_id
        join public.exam_items prior_item
          on prior_item.question_id = current_item.question_id
         and prior_item.exam_id <> v_exam
        join public.exams prior_exam on prior_exam.id = prior_item.exam_id
       where current_item.exam_id = v_exam
         and q.group_code = 'S1.INFO'
         and prior_exam.user_id = '73000000-0000-4000-8000-000000000001'::uuid
         and prior_exam.kind = 'mock'::public.exam_kind
    ) then
      raise exception 'assembly % repeated S1.INFO before unseen pool exhausted', i;
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
$$;

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

-- Selector audit: randomized candidate ordering must be present in
-- the actual function (option shuffling by itself is not sufficient).
do $$
declare
  v_ddl text;
begin
  select pg_get_functiondef('public.generate_official_mock()'::regprocedure)
  into v_ddl;
  if position('random(),' in v_ddl) = 0
     or position('official_mock_blueprint_invalid: 2026_subject_group_quotas' in v_ddl) = 0
     or position('official-mock-v4' in v_ddl) = 0
     or position('is_question_official_mock_eligible' in v_ddl) = 0 then
    raise exception '2026 selector randomization / quota guard missing';
  end if;
end
$$;

rollback;
