-- Adaptive topic tests: preserve required construct quotas while allowing a
-- published lesson to run with its actual pool rather than failing at 20.
-- No question, answer, attempt or progress rows are modified.
begin;

create or replace function public.generate_topic_test(p_lesson_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_lesson public.lessons%rowtype;
  v_exam uuid;
  v_ids uuid[] := '{}'::uuid[];
  v_pick uuid[] := '{}'::uuid[];
  v_target int;
  v_required_slots int;
  v_required_count int;
  v_critical_count int;
  v_remaining int;
  v_available int;
  v_dur int;
  v_meta jsonb;
  v_objectives jsonb;
  v_lc record;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select *
  into v_lesson
  from public.lessons
  where id = p_lesson_id
    and status = 'published'::public.content_status;

  if not found then
    raise exception 'lesson_topilmadi';
  end if;

  v_target := v_lesson.topic_test_question_count;

  select
    count(*) filter (where lc.is_required),
    count(*) filter (where lc.is_critical),
    coalesce(sum(lc.min_questions) filter (where lc.is_required), 0)
  into v_required_count, v_critical_count, v_required_slots
  from public.lesson_constructs lc
  where lc.lesson_id = p_lesson_id;

  if not exists (
    select 1
    from public.lesson_constructs lc
    where lc.lesson_id = p_lesson_id
  ) then
    raise exception 'topic_blueprint_missing';
  end if;

  if v_required_slots > v_target then
    raise exception
      'topic_blueprint_invalid: required_slots=% target=%',
      v_required_slots,
      v_target;
  end if;

  -- Available pool can be below the configured maximum (10..50).
  -- Use only published, keyed questions for ACTIVE linked objectives, matching
  -- the eligibility rules used by the actual question selector below.
  select count(distinct q.id)
  into v_available
  from public.questions q
  join public.lesson_constructs lc
    on lc.lesson_id = p_lesson_id
   and lc.construct_id = q.construct_id
  join public.constructs c
    on c.id = q.construct_id
   and c.is_active
  where q.status = 'published'::public.content_status
    and q.group_code = c.group_code
    and exists (
      select 1 from public.question_keys k where k.question_id = q.id
    );

  if v_available = 0 then
    raise exception 'topic_pool_insufficient: available=0';
  end if;

  v_target := least(v_target, v_available);

  if v_target < v_required_slots then
    raise exception
      'topic_pool_insufficient: required_slots=% available=%',
      v_required_slots, v_available;
  end if;

  -- Required/critical objective hard slots.
  for v_lc in
    select
      lc.construct_id,
      lc.min_questions,
      lc.is_critical,
      c.code as construct_code,
      c.group_code
    from public.lesson_constructs lc
    join public.constructs c on c.id = lc.construct_id
    where lc.lesson_id = p_lesson_id
      and lc.is_required
      and c.is_active
    order by lc.is_critical desc, c.code
  loop
    select count(*)
    into v_available
    from public.questions q
    where q.construct_id = v_lc.construct_id
      and q.status = 'published'::public.content_status
      and q.group_code = v_lc.group_code
      and exists (
        select 1
        from public.question_keys qk
        where qk.question_id = q.id
      );

    if v_available < v_lc.min_questions then
      raise exception
        'topic_pool_insufficient: construct=% required=% available=%',
        v_lc.construct_code,
        v_lc.min_questions,
        v_available;
    end if;

    select coalesce(array_agg(id), '{}'::uuid[])
    into v_pick
    from (
      select q.id
      from public.questions q
      where q.construct_id = v_lc.construct_id
        and q.status = 'published'::public.content_status
        and q.group_code = v_lc.group_code
        and exists (
          select 1
          from public.question_keys qk
          where qk.question_id = q.id
        )
        and not (q.id = any(v_ids))
      order by
        case when q.source_lesson_id = p_lesson_id then 0 else 1 end,
        (
          select count(*)
          from public.exam_items ei
          join public.exams e on e.id = ei.exam_id
          where e.user_id = v_user
            and ei.question_id = q.id
        ) asc,
        (
          select max(e.started_at)
          from public.exam_items ei
          join public.exams e on e.id = ei.exam_id
          where e.user_id = v_user
            and ei.question_id = q.id
        ) asc nulls first,
        random()
      limit v_lc.min_questions
    ) ranked;

    if cardinality(v_pick) <> v_lc.min_questions then
      raise exception
        'topic_pool_insufficient: construct=% required=% selected=%',
        v_lc.construct_code,
        v_lc.min_questions,
        cardinality(v_pick);
    end if;

    v_ids := v_ids || v_pick;
  end loop;

  -- Fill remaining slots across every objective linked to the lesson.
  v_remaining := v_target - cardinality(v_ids);

  if v_remaining > 0 then
    select coalesce(array_agg(id), '{}'::uuid[])
    into v_pick
    from (
      select q.id
      from public.questions q
      join public.lesson_constructs lc
        on lc.lesson_id = p_lesson_id
       and lc.construct_id = q.construct_id
      join public.constructs c
        on c.id = q.construct_id
       and c.is_active
      where q.status = 'published'::public.content_status
        and q.group_code = c.group_code
        and exists (
          select 1
          from public.question_keys qk
          where qk.question_id = q.id
        )
        and not (q.id = any(v_ids))
      order by
        case when q.source_lesson_id = p_lesson_id then 0 else 1 end,
        (
          select count(*)
          from public.exam_items ei
          join public.exams e on e.id = ei.exam_id
          where e.user_id = v_user
            and ei.question_id = q.id
        ) asc,
        (
          select max(e.started_at)
          from public.exam_items ei
          join public.exams e on e.id = ei.exam_id
          where e.user_id = v_user
            and ei.question_id = q.id
        ) asc nulls first,
        random()
      limit v_remaining
    ) ranked;

    v_ids := v_ids || v_pick;
  end if;

  if cardinality(v_ids) <> v_target then
    raise exception
      'topic_pool_insufficient: target=% selected=%',
      v_target,
      cardinality(v_ids);
  end if;

  -- Snapshot the objective coverage before creating the session.
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'construct_id', lc.construct_id,
        'construct_code', c.code,
        'required', lc.is_required,
        'critical', lc.is_critical,
        'min_questions', lc.min_questions,
        'selected_count', (
          select count(*)
          from public.questions q
          where q.id = any(v_ids)
            and q.construct_id = lc.construct_id
        )
      )
      order by lc.is_critical desc, c.code
    ),
    '[]'::jsonb
  )
  into v_objectives
  from public.lesson_constructs lc
  join public.constructs c on c.id = lc.construct_id
  where lc.lesson_id = p_lesson_id
    and c.is_active;

  v_meta := jsonb_build_object(
    'selector_version', 'objective-complete-adaptive-v2',
    'target_count', v_target,
    'configured_count', v_lesson.topic_test_question_count,
    'available_count', (
      select count(distinct q.id)
      from public.questions q
      join public.lesson_constructs lc
        on lc.lesson_id = p_lesson_id and lc.construct_id = q.construct_id
      join public.constructs c
        on c.id = q.construct_id and c.is_active
      where q.status = 'published'::public.content_status
        and q.group_code = c.group_code
        and exists (select 1 from public.question_keys k where k.question_id = q.id)
    ),
    'selected_count', cardinality(v_ids),
    'required_objective_count', v_required_count,
    'critical_objective_count', v_critical_count,
    'required_slots', v_required_slots,
    'objective_coverage', v_objectives,
    'rules', jsonb_build_array(
      'required_objective_hard_slots',
      'critical_objective_hard_slots',
      'published_with_key_only',
      'taxonomy_match_required',
      'direct_lesson_source_preferred',
      'low_exposure_preferred',
      'insufficient_pool_no_session'
    )
  );

  v_dur := v_target * 120;

  insert into public.exams (
    user_id,
    kind,
    lesson_id,
    module_id,
    duration_sec,
    selection_meta
  )
  values (
    v_user,
    'mavzu'::public.exam_kind,
    p_lesson_id,
    v_lesson.module_id,
    v_dur,
    v_meta
  )
  returning id into v_exam;

  perform public.attach_questions(v_exam, v_ids);

  update public.exam_items ei
  set option_order = (
    select array_agg(o.id order by o.side nulls first, random())
    from public.question_options o
    where o.question_id = ei.question_id
  )
  where ei.exam_id = v_exam;

  return jsonb_build_object(
    'exam_id', v_exam,
    'kind', 'mavzu',
    'duration_sec', v_dur,
    'started_at', now(),
    'items', public.exam_payload(v_exam),
    'selection_meta', v_meta
  );
end
$$;

revoke all on function public.generate_topic_test(uuid) from public;
grant execute on function public.generate_topic_test(uuid) to authenticated;

-- Public learner metadata: counts only, no answers or question identifiers.
-- Uses the same keyed/active/taxonomy eligibility rules as generate_topic_test.
create or replace function public.topic_test_preview(p_lesson_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_configured int;
  v_available int;
  v_required_slots int;
  v_required_feasible boolean;
  v_links int;
  v_target int;
begin
  select topic_test_question_count into v_configured
  from public.lessons
  where id=p_lesson_id and status='published'::public.content_status;

  if not found then
    raise exception 'lesson_topilmadi';
  end if;

  select count(*),
         coalesce(sum(min_questions) filter(where is_required), 0)
  into v_links, v_required_slots
  from public.lesson_constructs
  where lesson_id=p_lesson_id;

  if v_links = 0 then
    return jsonb_build_object(
      'question_count', 0, 'duration_sec', 0,
      'configured_count', v_configured, 'available_count', 0,
      'reason', 'topic_blueprint_missing'
    );
  end if;

  if v_required_slots > v_configured then
    return jsonb_build_object(
      'question_count', 0, 'duration_sec', 0,
      'configured_count', v_configured, 'available_count', 0,
      'reason', 'topic_blueprint_invalid'
    );
  end if;

  select count(distinct q.id)
  into v_available
  from public.questions q
  join public.lesson_constructs lc on lc.lesson_id=p_lesson_id
    and lc.construct_id=q.construct_id
  join public.constructs c on c.id=q.construct_id and c.is_active
  where q.status='published'::public.content_status
    and q.group_code=c.group_code
    and exists(select 1 from public.question_keys k where k.question_id=q.id);

  select coalesce(bool_and((
    select count(*)
    from public.questions q
    join public.question_keys k on k.question_id=q.id
    where q.construct_id=lc.construct_id
      and q.status='published'::public.content_status
      and q.group_code=c.group_code
  ) >= lc.min_questions), true)
  into v_required_feasible
  from public.lesson_constructs lc
  join public.constructs c on c.id=lc.construct_id and c.is_active
  where lc.lesson_id=p_lesson_id and lc.is_required;

  v_target := least(v_configured, v_available);

  return jsonb_build_object(
    'question_count', case when v_target>0 and v_target>=v_required_slots
                              and v_required_feasible then v_target else 0 end,
    'duration_sec', case when v_target>0 and v_target>=v_required_slots
                              and v_required_feasible then v_target*120 else 0 end,
    'configured_count', v_configured,
    'available_count', v_available,
    'reason', case
      when v_available=0 or v_target<v_required_slots or not v_required_feasible
        then 'topic_pool_insufficient' else null end
  );
end
$$;

-- Backend service-role exposes only counts via an authenticated/controlled route.
revoke all on function public.topic_test_preview(uuid) from public, anon, authenticated;
grant execute on function public.topic_test_preview(uuid) to service_role;

commit;
