-- TASK-044: M01/general module 50-question section mock.
--
-- Guarantees:
--   * 50 published, keyed, taxonomy-valid questions or no session;
--   * one hard slot for every assessable topic (published lesson with a direct pool);
--   * configured minimum slots for every critical objective;
--   * unseen/low-exposure questions are preferred;
--   * deterministic feasibility is checked before an exam row is created;
--   * pass = at least 45/50 correct AND every critical floor met;
--   * selection/pass evidence is snapshotted in exams.selection_meta.

begin;

create or replace function public.generate_section_mock(p_module_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_module public.modules%rowtype;
  v_exam uuid;
  v_ids uuid[] := '{}'::uuid[];
  v_pick uuid[] := '{}'::uuid[];\n  v_one uuid;
  v_target int := 50;
  v_topic_count int := 0;
  v_unassessable_topic_count int := 0;
  v_critical_count int := 0;
  v_critical_slots int := 0;
  v_pool_count int := 0;
  v_unseen_pool_count int := 0;
  v_remaining int := 0;
  v_needed int := 0;
  v_available int := 0;
  v_dur int := 6000;
  v_meta jsonb;
  v_topic_coverage jsonb;
  v_critical_coverage jsonb;
  v_unseen_selected int := 0;
  v_lesson record;
  v_critical record;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select *
    into v_module
    from public.modules
   where id = p_module_id
     and status = 'published'::public.content_status;

  if not found then
    raise exception 'module_topilmadi';
  end if;

  -- Assessable topic = a published lesson with at least one direct-source,
  -- published, keyed, taxonomy-valid question. Appendix/reference lessons with
  -- no direct question pool are recorded but do not consume a hard slot.
  select
    count(*) filter (where has_pool),
    count(*) filter (where not has_pool)
  into v_topic_count, v_unassessable_topic_count
  from (
    select l.id,
      exists (
        select 1
          from public.questions q
          join public.constructs c on c.id = q.construct_id
         where q.source_lesson_id = l.id
           and q.status = 'published'::public.content_status
           and c.is_active
           and q.group_code = c.group_code
           and exists (
             select 1
               from public.question_keys qk
              where qk.question_id = q.id
           )
      ) as has_pool
    from public.lessons l
    where l.module_id = p_module_id
      and l.status = 'published'::public.content_status
  ) topics;

  if v_topic_count = 0 then
    raise exception 'section_mock_no_topics';
  end if;

  select
    count(*),
    coalesce(sum(min_questions), 0)
  into v_critical_count, v_critical_slots
  from (
    select
      lc.construct_id,
      greatest(max(lc.min_questions), 1) as min_questions
    from public.lesson_constructs lc
    join public.lessons l on l.id = lc.lesson_id
    join public.constructs c on c.id = lc.construct_id
    where l.module_id = p_module_id
      and l.status = 'published'::public.content_status
      and lc.is_critical
      and c.is_active
    group by lc.construct_id
  ) criticals;

  if v_topic_count + v_critical_slots > v_target then
    raise exception
      'section_mock_blueprint_invalid: topic_slots=% critical_slots=% target=%',
      v_topic_count,
      v_critical_slots,
      v_target;
  end if;

  -- Global eligible pool for the module.
  select count(distinct q.id)
    into v_pool_count
    from public.questions q
    join public.constructs c on c.id = q.construct_id
   where q.status = 'published'::public.content_status
     and c.is_active
     and q.group_code = c.group_code
     and exists (
       select 1
         from public.lesson_constructs lc
         join public.lessons l on l.id = lc.lesson_id
        where lc.construct_id = q.construct_id
          and l.module_id = p_module_id
          and l.status = 'published'::public.content_status
     )
     and exists (
       select 1 from public.question_keys qk where qk.question_id = q.id
     );

  if v_pool_count < v_target then
    raise exception
      'section_mock_pool_insufficient: target=% available=%',
      v_target,
      v_pool_count;
  end if;

  -- Check every critical objective deterministically before creating a session.
  for v_critical in
    select
      lc.construct_id,
      c.code as construct_code,
      c.group_code,
      greatest(max(lc.min_questions), 1)::int as min_questions
    from public.lesson_constructs lc
    join public.lessons l on l.id = lc.lesson_id
    join public.constructs c on c.id = lc.construct_id
    where l.module_id = p_module_id
      and l.status = 'published'::public.content_status
      and lc.is_critical
      and c.is_active
    group by lc.construct_id, c.code, c.group_code
    order by c.code
  loop
    select count(*)
      into v_available
      from public.questions q
     where q.construct_id = v_critical.construct_id
       and q.status = 'published'::public.content_status
       and q.group_code = v_critical.group_code
       and exists (
         select 1 from public.question_keys qk where qk.question_id = q.id
       );

    if v_available < v_critical.min_questions then
      raise exception
        'section_mock_pool_insufficient: critical=% required=% available=%',
        v_critical.construct_code,
        v_critical.min_questions,
        v_available;
    end if;
  end loop;

  -- Hard slot: one question per assessable topic.
  for v_lesson in
    select l.id, l.slug
      from public.lessons l
     where l.module_id = p_module_id
       and l.status = 'published'::public.content_status
       and exists (
         select 1
           from public.questions q
           join public.constructs c on c.id = q.construct_id
          where q.source_lesson_id = l.id
            and q.status = 'published'::public.content_status
            and c.is_active
            and q.group_code = c.group_code
            and exists (
              select 1 from public.question_keys qk where qk.question_id = q.id
            )
       )
     order by l.order_idx, l.slug
  loop
    select q.id
      into v_pick[1]
      from public.questions q
      join public.constructs c on c.id = q.construct_id
     where q.source_lesson_id = v_lesson.id
       and q.status = 'published'::public.content_status
       and c.is_active
       and q.group_code = c.group_code
       and exists (
         select 1 from public.question_keys qk where qk.question_id = q.id
       )
       and not (q.id = any(v_ids))
     order by
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
       q.id
     limit 1;

    if v_one is null then
      raise exception 'section_mock_pool_insufficient: topic=%', v_lesson.slug;
    end if;

    v_ids := v_ids || v_pick[1];
    v_pick := '{}'::uuid[];
  end loop;

  -- Critical objective floors; topic slots may already satisfy part/all of them.
  for v_critical in
    select
      lc.construct_id,
      c.code as construct_code,
      c.group_code,
      greatest(max(lc.min_questions), 1)::int as min_questions
    from public.lesson_constructs lc
    join public.lessons l on l.id = lc.lesson_id
    join public.constructs c on c.id = lc.construct_id
    where l.module_id = p_module_id
      and l.status = 'published'::public.content_status
      and lc.is_critical
      and c.is_active
    group by lc.construct_id, c.code, c.group_code
    order by c.code
  loop
    select greatest(
      0,
      v_critical.min_questions - count(*) filter (where q.construct_id = v_critical.construct_id)
    )::int
    into v_needed
    from public.questions q
    where q.id = any(v_ids);

    if v_needed > 0 then
      select coalesce(array_agg(id), '{}'::uuid[])
        into v_pick
        from (
          select q.id
            from public.questions q
           where q.construct_id = v_critical.construct_id
             and q.status = 'published'::public.content_status
             and q.group_code = v_critical.group_code
             and exists (
               select 1 from public.question_keys qk where qk.question_id = q.id
             )
             and not (q.id = any(v_ids))
           order by
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
             q.id
           limit v_needed
        ) ranked;

      if cardinality(v_pick) <> v_needed then
        raise exception
          'section_mock_pool_insufficient: critical=% required_additional=% selected=%',
          v_critical.construct_code,
          v_needed,
          cardinality(v_pick);
      end if;

      v_ids := v_ids || v_pick;
    end if;
  end loop;

  -- Fill the remainder from the whole module pool, always preferring unseen
  -- then least-exposed/oldest-seen questions.
  v_remaining := v_target - cardinality(v_ids);

  if v_remaining > 0 then
    select coalesce(array_agg(id), '{}'::uuid[])
      into v_pick
      from (
        select distinct q.id,
          (
            select count(*)
              from public.exam_items ei
              join public.exams e on e.id = ei.exam_id
             where e.user_id = v_user
               and ei.question_id = q.id
          ) as exposure_count,
          (
            select max(e.started_at)
              from public.exam_items ei
              join public.exams e on e.id = ei.exam_id
             where e.user_id = v_user
               and ei.question_id = q.id
          ) as last_seen
        from public.questions q
        join public.constructs c on c.id = q.construct_id
        where q.status = 'published'::public.content_status
          and c.is_active
          and q.group_code = c.group_code
          and exists (
            select 1
              from public.lesson_constructs lc
              join public.lessons l on l.id = lc.lesson_id
             where lc.construct_id = q.construct_id
               and l.module_id = p_module_id
               and l.status = 'published'::public.content_status
          )
          and exists (
            select 1 from public.question_keys qk where qk.question_id = q.id
          )
          and not (q.id = any(v_ids))
        order by exposure_count asc, last_seen asc nulls first, q.id
        limit v_remaining
      ) ranked;

    v_ids := v_ids || v_pick;
  end if;

  if cardinality(v_ids) <> v_target then
    raise exception
      'section_mock_pool_insufficient: target=% selected=%',
      v_target,
      cardinality(v_ids);
  end if;

  select count(distinct q.id)
    into v_unseen_pool_count
    from public.questions q
    join public.constructs c on c.id = q.construct_id
   where q.status = 'published'::public.content_status
     and c.is_active
     and q.group_code = c.group_code
     and exists (
       select 1
         from public.lesson_constructs lc
         join public.lessons l on l.id = lc.lesson_id
        where lc.construct_id = q.construct_id
          and l.module_id = p_module_id
          and l.status = 'published'::public.content_status
     )
     and exists (
       select 1 from public.question_keys qk where qk.question_id = q.id
     )
     and not exists (
       select 1
         from public.exam_items ei
         join public.exams e on e.id = ei.exam_id
        where e.user_id = v_user
          and ei.question_id = q.id
     );

  select count(*)
    into v_unseen_selected
    from unnest(v_ids) picked(question_id)
   where not exists (
     select 1
       from public.exam_items ei
       join public.exams e on e.id = ei.exam_id
      where e.user_id = v_user
        and ei.question_id = picked.question_id
   );

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'lesson_id', l.id,
        'lesson_slug', l.slug,
        'selected_count', (
          select count(*)
            from public.questions q
           where q.id = any(v_ids)
             and q.source_lesson_id = l.id
        )
      )
      order by l.order_idx, l.slug
    ),
    '[]'::jsonb
  )
  into v_topic_coverage
  from public.lessons l
  where l.module_id = p_module_id
    and l.status = 'published'::public.content_status
    and exists (
      select 1
        from public.questions q
        join public.constructs c on c.id = q.construct_id
       where q.source_lesson_id = l.id
         and q.status = 'published'::public.content_status
         and c.is_active
         and q.group_code = c.group_code
         and exists (
           select 1 from public.question_keys qk where qk.question_id = q.id
         )
    );

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'construct_id', critical.construct_id,
        'construct_code', critical.construct_code,
        'min_questions', critical.min_questions,
        'min_correct', critical.min_questions,
        'selected_count', (
          select count(*)
            from public.questions q
           where q.id = any(v_ids)
             and q.construct_id = critical.construct_id
        )
      )
      order by critical.construct_code
    ),
    '[]'::jsonb
  )
  into v_critical_coverage
  from (
    select
      lc.construct_id,
      c.code as construct_code,
      greatest(max(lc.min_questions), 1)::int as min_questions
    from public.lesson_constructs lc
    join public.lessons l on l.id = lc.lesson_id
    join public.constructs c on c.id = lc.construct_id
    where l.module_id = p_module_id
      and l.status = 'published'::public.content_status
      and lc.is_critical
      and c.is_active
    group by lc.construct_id, c.code
  ) critical;

  v_meta := jsonb_build_object(
    'selector_version', 'section-mock-v1',
    'target_count', v_target,
    'selected_count', cardinality(v_ids),
    'assessable_topic_count', v_topic_count,
    'unassessable_topic_count', v_unassessable_topic_count,
    'critical_objective_count', v_critical_count,
    'critical_required_slots', v_critical_slots,
    'eligible_pool_count', v_pool_count,
    'unseen_pool_count_before_selection', v_unseen_pool_count,
    'unseen_selected_count', v_unseen_selected,
    'topic_coverage', v_topic_coverage,
    'critical_coverage', v_critical_coverage,
    'pass_rule', jsonb_build_object(
      'min_correct', 45,
      'total_questions', 50,
      'critical_floor', 'each_critical_min_correct'
    ),
    'rules', jsonb_build_array(
      'assessable_topic_hard_slot',
      'critical_objective_hard_slots',
      'published_with_key_only',
      'taxonomy_match_required',
      'unseen_then_low_exposure',
      'deterministic_feasibility_before_session',
      'insufficient_pool_no_session'
    )
  );

  insert into public.exams (
    user_id,
    kind,
    blueprint_id,
    module_id,
    duration_sec,
    selection_meta
  )
  select
    v_user,
    'bolim'::public.exam_kind,
    bp.id,
    p_module_id,
    v_dur,
    v_meta
  from public.blueprints bp
  where bp.is_active
  order by bp.version desc
  limit 1
  returning id into v_exam;

  if v_exam is null then
    raise exception 'blueprint_topilmadi';
  end if;

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
    'kind', 'bolim',
    'duration_sec', v_dur,
    'started_at', now(),
    'items', public.exam_payload(v_exam),
    'selection_meta', v_meta
  );
end
$$;

create or replace function public.apply_section_mock_pass()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_correct int := 0;
  v_critical_ok boolean := true;
  v_entry jsonb;
  v_have int;
  v_need int;
begin
  if new.kind <> 'bolim'::public.exam_kind
     or old.finished_at is not null
     or new.finished_at is null then
    return new;
  end if;

  select count(*) filter (where coalesce(ei.is_correct, false))
    into v_correct
    from public.exam_items ei
   where ei.exam_id = new.id;

  if coalesce(new.selection_meta->>'selector_version', '') <> 'section-mock-v1' then
    new.passed := false;
    return new;
  end if;

  for v_entry in
    select value
      from jsonb_array_elements(
        coalesce(new.selection_meta->'critical_coverage', '[]'::jsonb)
      )
  loop
    v_need := greatest(coalesce((v_entry->>'min_correct')::int, 1), 1);

    select count(*) filter (where coalesce(ei.is_correct, false))
      into v_have
      from public.exam_items ei
     where ei.exam_id = new.id
       and ei.construct_id = (v_entry->>'construct_id')::uuid;

    if v_have < v_need then
      v_critical_ok := false;
    end if;
  end loop;

  new.passed := v_correct >= 45 and v_critical_ok;
  new.selection_meta := jsonb_set(
    coalesce(new.selection_meta, '{}'::jsonb),
    '{completion}',
    jsonb_build_object(
      'correct_count', v_correct,
      'min_correct', 45,
      'critical_floor_met', v_critical_ok,
      'passed', new.passed
    ),
    true
  );

  if new.passed and new.module_id is not null then
    insert into public.user_module_progress (
      user_id,
      module_id,
      exam_best_score,
      completed_at
    )
    values (
      new.user_id,
      new.module_id,
      coalesce(new.total_score, 0),
      now()
    )
    on conflict (user_id, module_id) do update set
      exam_best_score = greatest(
        coalesce(public.user_module_progress.exam_best_score, 0),
        excluded.exam_best_score
      ),
      completed_at = coalesce(public.user_module_progress.completed_at, excluded.completed_at);
  end if;

  return new;
end
$$;

drop trigger if exists apply_section_mock_pass on public.exams;
create trigger apply_section_mock_pass
before update of finished_at, total_score on public.exams
for each row
execute function public.apply_section_mock_pass();

revoke all on function public.generate_section_mock(uuid) from public;
grant execute on function public.generate_section_mock(uuid) to authenticated;

revoke all on function public.apply_section_mock_pass() from public, anon, authenticated;

commit;
