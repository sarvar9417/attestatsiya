-- T-041: objective-complete topic-test assembler.
--
-- Replaces the old "up to 20 random questions" behavior with a strict
-- lesson blueprint:
--   * every required objective gets its configured minimum slot;
--   * critical objectives are always required;
--   * published question + answer key + correct taxonomy are mandatory;
--   * remaining slots prefer direct lesson sources and low exposure;
--   * insufficient pools abort before an exam row is created;
--   * target size is configurable per lesson (10..50, default 20).

begin;

alter table public.lessons
  add column if not exists topic_test_question_count int not null default 20;

alter table public.lessons
  drop constraint if exists lessons_topic_test_question_count_check;

alter table public.lessons
  add constraint lessons_topic_test_question_count_check
  check (topic_test_question_count between 10 and 50);

alter table public.lesson_constructs
  add column if not exists is_required boolean not null default true,
  add column if not exists is_critical boolean not null default false,
  add column if not exists min_questions int not null default 1;

alter table public.lesson_constructs
  drop constraint if exists lesson_constructs_min_questions_check;

alter table public.lesson_constructs
  add constraint lesson_constructs_min_questions_check
  check (min_questions between 1 and 10);

alter table public.lesson_constructs
  drop constraint if exists lesson_constructs_critical_requires_required_check;

alter table public.lesson_constructs
  add constraint lesson_constructs_critical_requires_required_check
  check (not is_critical or is_required);

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
    'selector_version', 'objective-complete-v1',
    'target_count', v_target,
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

commit;
