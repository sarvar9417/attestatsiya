-- T-039: adaptive practice selector (50/25/15/10) with exposure control.
--
-- Adaptive 10-question practice target:
--   50% weak objectives, 25% due review, 15% new/low exposure, 10% strong control.
-- The selector never exposes answer keys, avoids immediate exact retries, prefers
-- low-exposure revisions, and records any ratio fallback in exams.selection_meta.

begin;

alter table public.exams
  add column if not exists selection_meta jsonb;

create or replace function public.pick_adaptive_bucket(
  p_user uuid,
  p_bucket text,
  p_n int,
  p_exclude uuid[] default '{}'::uuid[],
  p_lesson_id uuid default null
) returns uuid[]
language sql
volatile
security definer
set search_path = ''
as $$
  with last_answered_exam as (
    select e.id
    from public.exams e
    where e.user_id = p_user
      and exists (
        select 1
        from public.exam_items ei
        where ei.exam_id = e.id
          and ei.answered_at is not null
      )
    order by coalesce(e.finished_at, e.started_at) desc, e.started_at desc
    limit 1
  ),
  immediate_wrong as (
    select ei.question_id
    from public.exam_items ei
    join last_answered_exam le on le.id = ei.exam_id
    where ei.answered_at is not null
      and ei.is_correct is false
  ),
  eligible as (
    select
      q.id,
      q.construct_id,
      coalesce(ucs.attempts, 0) as attempts,
      coalesce(ucs.correct, 0) as correct,
      coalesce(ucs.independent_attempts, 0) as independent_attempts,
      coalesce(ucs.review_stage, 0) as review_stage,
      ucs.mastery_status,
      ucs.due_at,
      coalesce(exp.exposures, 0) as exposures,
      exp.last_exposed_at
    from public.questions q
    left join public.user_construct_stats ucs
      on ucs.user_id = p_user
     and ucs.construct_id = q.construct_id
    left join lateral (
      select
        count(*)::int as exposures,
        max(e.started_at) as last_exposed_at
      from public.exam_items ei
      join public.exams e on e.id = ei.exam_id
      where e.user_id = p_user
        and ei.question_id = q.id
    ) exp on true
    where q.status = 'published'::public.content_status
      and not (q.id = any(coalesce(p_exclude, '{}'::uuid[])))
      and not exists (
        select 1 from immediate_wrong iw where iw.question_id = q.id
      )
      and exists (
        select 1
        from public.blueprint_quotas bq
        join public.blueprints bp on bp.id = bq.blueprint_id
        where bp.is_active
          and bp.subject_id = q.subject_id
          and bq.group_code = q.group_code
      )
      and (
        p_bucket <> 'weak'
        or p_lesson_id is null
        or exists (
          select 1
          from public.lesson_constructs lc
          where lc.lesson_id = p_lesson_id
            and lc.construct_id = q.construct_id
        )
      )
  ),
  ranked as (
    select e.*
    from eligible e
    where case p_bucket
      when 'weak' then
        e.attempts > 0
        and (
          e.mastery_status = 'regressed'::public.mastery_status
          or e.review_stage < 2
          or e.correct::numeric / nullif(e.attempts, 0) < 0.80
        )
      when 'due' then
        e.due_at is not null and e.due_at <= now()
      when 'new' then
        e.independent_attempts = 0
      when 'strong' then
        e.mastery_status = 'stable'::public.mastery_status
        or (
          e.attempts >= 3
          and e.correct::numeric / nullif(e.attempts, 0) >= 0.80
          and coalesce(e.due_at, now() + interval '100 years') > now()
        )
      when 'fallback' then true
      else false
    end
    order by
      case p_bucket
        when 'weak' then
          case when e.mastery_status = 'regressed'::public.mastery_status then 0 else 1 end
        when 'due' then 0
        when 'new' then 0
        when 'strong' then 0
        else 0
      end,
      case when p_bucket = 'weak'
        then e.correct::numeric / nullif(e.attempts, 0)
        else null
      end asc nulls first,
      case when p_bucket = 'due' then e.due_at else null end asc nulls first,
      e.exposures asc,
      e.last_exposed_at asc nulls first,
      random()
    limit greatest(p_n, 0)
  )
  select coalesce(array_agg(id), '{}'::uuid[])
  from ranked;
$$;

create or replace function public.start_adaptive_practice(
  p_lesson_id uuid default null,
  p_n int default 10
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_bp public.blueprints%rowtype;
  v_exam uuid;
  v_module uuid;
  v_ids uuid[] := '{}'::uuid[];
  v_pick uuid[] := '{}'::uuid[];
  v_weak_target int;
  v_due_target int;
  v_new_target int;
  v_strong_target int;
  v_remaining int;
  v_weak_selected int := 0;
  v_due_selected int := 0;
  v_new_selected int := 0;
  v_strong_selected int := 0;
  v_fallback_selected int := 0;
  v_meta jsonb;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  if p_n < 4 or p_n > 20 then
    raise exception 'practice_count_invalid';
  end if;

  select *
  into v_bp
  from public.blueprints
  where is_active
  limit 1;

  if not found then
    raise exception 'blueprint_topilmadi';
  end if;

  if p_lesson_id is not null then
    select l.module_id
    into v_module
    from public.lessons l
    where l.id = p_lesson_id
      and l.status = 'published'::public.content_status;

    if v_module is null then
      raise exception 'lesson_topilmadi';
    end if;
  end if;

  -- Largest-remainder approximation of 50/25/15/10.
  v_weak_target := floor(p_n * 0.50);
  v_due_target := floor(p_n * 0.25);
  v_new_target := floor(p_n * 0.15);
  v_strong_target := floor(p_n * 0.10);
  v_remaining := p_n - (
    v_weak_target + v_due_target + v_new_target + v_strong_target
  );

  if v_remaining > 0 then
    v_due_target := v_due_target + 1;
    v_remaining := v_remaining - 1;
  end if;
  if v_remaining > 0 then
    v_new_target := v_new_target + 1;
    v_remaining := v_remaining - 1;
  end if;
  if v_remaining > 0 then
    v_weak_target := v_weak_target + 1;
    v_remaining := v_remaining - 1;
  end if;
  if v_remaining > 0 then
    v_strong_target := v_strong_target + v_remaining;
  end if;

  v_pick := public.pick_adaptive_bucket(
    v_user, 'weak', v_weak_target, v_ids, p_lesson_id
  );
  v_weak_selected := cardinality(v_pick);
  v_ids := v_ids || v_pick;

  v_pick := public.pick_adaptive_bucket(
    v_user, 'due', v_due_target, v_ids, null
  );
  v_due_selected := cardinality(v_pick);
  v_ids := v_ids || v_pick;

  v_pick := public.pick_adaptive_bucket(
    v_user, 'new', v_new_target, v_ids, null
  );
  v_new_selected := cardinality(v_pick);
  v_ids := v_ids || v_pick;

  v_pick := public.pick_adaptive_bucket(
    v_user, 'strong', v_strong_target, v_ids, null
  );
  v_strong_selected := cardinality(v_pick);
  v_ids := v_ids || v_pick;

  if cardinality(v_ids) < p_n then
    v_pick := public.pick_adaptive_bucket(
      v_user, 'fallback', p_n - cardinality(v_ids), v_ids, null
    );
    v_fallback_selected := cardinality(v_pick);
    v_ids := v_ids || v_pick;
  end if;

  if cardinality(v_ids) <> p_n then
    raise exception 'savol_yetarli_emas: % / %', cardinality(v_ids), p_n;
  end if;

  v_meta := jsonb_build_object(
    'selector_version', 'adaptive-v1',
    'target_percent', jsonb_build_object(
      'weak', 50,
      'due', 25,
      'new', 15,
      'strong', 10
    ),
    'target_count', jsonb_build_object(
      'weak', v_weak_target,
      'due', v_due_target,
      'new', v_new_target,
      'strong', v_strong_target
    ),
    'selected_count', jsonb_build_object(
      'weak', v_weak_selected,
      'due', v_due_selected,
      'new', v_new_selected,
      'strong', v_strong_selected
    ),
    'fallback_count', v_fallback_selected,
    'fallback_used', v_fallback_selected > 0,
    'lesson_id', p_lesson_id,
    'rules', jsonb_build_array(
      'published_active_blueprint_only',
      'no_duplicate_revision',
      'no_immediate_exact_retry',
      'low_exposure_first'
    )
  );

  insert into public.exams (
    user_id,
    kind,
    blueprint_id,
    module_id,
    lesson_id,
    duration_sec,
    selection_meta
  )
  values (
    v_user,
    'mashq'::public.exam_kind,
    v_bp.id,
    v_module,
    p_lesson_id,
    null,
    v_meta
  )
  returning id into v_exam;

  perform public.attach_questions(v_exam, v_ids);

  return jsonb_build_object(
    'exam_id', v_exam,
    'kind', 'mashq',
    'duration_sec', null,
    'started_at', now(),
    'items', public.exam_payload(v_exam),
    'selection_meta', v_meta
  );
end
$$;

revoke all on function public.pick_adaptive_bucket(uuid, text, int, uuid[], uuid)
  from public, anon, authenticated;
revoke all on function public.start_adaptive_practice(uuid, int)
  from public;
grant execute on function public.start_adaptive_practice(uuid, int)
  to authenticated;

commit;
