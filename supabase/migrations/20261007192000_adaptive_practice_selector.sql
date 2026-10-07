-- T-036: adaptive 10-question practice selector.
--
-- Default target (DOMAIN_RULES.md):
-- 50% weak current-lesson objective, 25% due review,
-- 15% new/low-exposure, 10% strong-objective check.
-- For 10 items deterministic largest-remainder tie-break gives 5/3/1/1.
-- Fallback is persisted in exams.selector_meta.

begin;

alter table public.exams
  add column if not exists selector_meta jsonb;

create or replace function public.start_adaptive_practice(p_lesson_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_exam uuid;
  v_module uuid;
  v_ids uuid[] := '{}';
  v_pick uuid[];
  v_weak int := 0;
  v_due int := 0;
  v_new int := 0;
  v_strong int := 0;
  v_fallback int := 0;
  v_meta jsonb;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select l.module_id
  into v_module
  from public.lessons l
  where l.id = p_lesson_id
    and l.status = 'published';

  if v_module is null then
    raise exception 'lesson_topilmadi';
  end if;

  -- 1) Weak current-lesson objective: attempts < 5 is deliberately excluded
  -- from weak classification to protect against statistical noise.
  select coalesce(array_agg(s.id), '{}') into v_pick
  from (
    select q.id
    from public.questions q
    join public.lesson_constructs lc
      on lc.construct_id = q.construct_id
    join public.user_construct_stats ucs
      on ucs.construct_id = q.construct_id
     and ucs.user_id = v_user
    where lc.lesson_id = p_lesson_id
      and q.status = 'published'
      and ucs.attempts >= 5
      and (
        ucs.mastery_status = 'regressed'::public.mastery_status
        or ucs.correct::numeric / nullif(ucs.attempts, 0) < 0.70
      )
      -- The exact recently missed item is not immediately recycled.
      and not exists (
        select 1
        from public.exam_items recent_item
        join public.exams recent_exam on recent_exam.id = recent_item.exam_id
        where recent_exam.user_id = v_user
          and recent_item.question_id = q.id
          and recent_item.is_correct = false
          and recent_item.answered_at >= now() - interval '7 days'
      )
    order by
      (
        select count(*)
        from public.exam_items exposure_item
        join public.exams exposure_exam on exposure_exam.id = exposure_item.exam_id
        where exposure_exam.user_id = v_user
          and exposure_item.question_id = q.id
      ) asc,
      q.id
    limit 5
  ) s;

  v_ids := v_ids || v_pick;
  v_weak := coalesce(array_length(v_pick, 1), 0);

  -- 2) Due review: one question per due construct, unseen/least-exposed first.
  select coalesce(array_agg(s.id order by s.exposure_count, s.id), '{}')
  into v_pick
  from (
    select ranked.id, ranked.exposure_count
    from (
      select distinct on (q.construct_id)
        q.id,
        q.construct_id,
        (
          select count(*)
          from public.exam_items exposure_item
          join public.exams exposure_exam on exposure_exam.id = exposure_item.exam_id
          where exposure_exam.user_id = v_user
            and exposure_item.question_id = q.id
        ) as exposure_count
      from public.user_construct_stats ucs
      join public.questions q on q.construct_id = ucs.construct_id
      where ucs.user_id = v_user
        and ucs.due_at <= now()
        and q.status = 'published'
        and not (q.id = any(v_ids))
      order by q.construct_id, exposure_count asc, q.id
    ) ranked
    order by ranked.exposure_count asc, ranked.id
    limit 3
  ) s;

  v_ids := v_ids || v_pick;
  v_due := coalesce(array_length(v_pick, 1), 0);

  -- 3) New / low-exposure item from the current lesson.
  select coalesce(array_agg(s.id), '{}') into v_pick
  from (
    select q.id
    from public.questions q
    join public.lesson_constructs lc on lc.construct_id = q.construct_id
    where lc.lesson_id = p_lesson_id
      and q.status = 'published'
      and not (q.id = any(v_ids))
    order by
      (
        select count(*)
        from public.exam_items exposure_item
        join public.exams exposure_exam on exposure_exam.id = exposure_item.exam_id
        where exposure_exam.user_id = v_user
          and exposure_item.question_id = q.id
      ) asc,
      (
        select max(exposure_item.answered_at)
        from public.exam_items exposure_item
        join public.exams exposure_exam on exposure_exam.id = exposure_item.exam_id
        where exposure_exam.user_id = v_user
          and exposure_item.question_id = q.id
      ) asc nulls first,
      q.id
    limit 1
  ) s;

  v_ids := v_ids || v_pick;
  v_new := coalesce(array_length(v_pick, 1), 0);

  -- 4) Strong-objective control. attempts < 5 is not classified strong either.
  select coalesce(array_agg(s.id), '{}') into v_pick
  from (
    select q.id
    from public.questions q
    join public.lesson_constructs lc on lc.construct_id = q.construct_id
    join public.user_construct_stats ucs
      on ucs.construct_id = q.construct_id
     and ucs.user_id = v_user
    where lc.lesson_id = p_lesson_id
      and q.status = 'published'
      and ucs.attempts >= 5
      and ucs.correct::numeric / nullif(ucs.attempts, 0) >= 0.80
      and ucs.mastery_status in (
        'provisional'::public.mastery_status,
        'stable'::public.mastery_status
      )
      and not (q.id = any(v_ids))
    order by
      (
        select count(*)
        from public.exam_items exposure_item
        join public.exams exposure_exam on exposure_exam.id = exposure_item.exam_id
        where exposure_exam.user_id = v_user
          and exposure_item.question_id = q.id
      ) asc,
      q.id
    limit 1
  ) s;

  v_ids := v_ids || v_pick;
  v_strong := coalesce(array_length(v_pick, 1), 0);

  -- Relax ratios if a category pool is short. Prefer current-lesson published
  -- items and least-exposed questions; duplicates inside the session remain forbidden.
  if coalesce(array_length(v_ids, 1), 0) < 10 then
    select coalesce(array_agg(s.id), '{}') into v_pick
    from (
      select q.id
      from public.questions q
      join public.lesson_constructs lc on lc.construct_id = q.construct_id
      where lc.lesson_id = p_lesson_id
        and q.status = 'published'
        and not (q.id = any(v_ids))
      order by
        (
          select count(*)
          from public.exam_items exposure_item
          join public.exams exposure_exam on exposure_exam.id = exposure_item.exam_id
          where exposure_exam.user_id = v_user
            and exposure_item.question_id = q.id
        ) asc,
        q.id
      limit greatest(0, 10 - coalesce(array_length(v_ids, 1), 0))
    ) s;

    v_ids := v_ids || v_pick;
    v_fallback := coalesce(array_length(v_pick, 1), 0);
  end if;

  if coalesce(array_length(v_ids, 1), 0) = 0 then
    raise exception 'savol_yoq: adaptiv mashq uchun savol topilmadi';
  end if;

  v_meta := jsonb_build_object(
    'version', 1,
    'target', jsonb_build_object(
      'weak', 5,
      'due', 3,
      'new', 1,
      'strong', 1
    ),
    'actual', jsonb_build_object(
      'weak', v_weak,
      'due', v_due,
      'new', v_new,
      'strong', v_strong,
      'fallback', v_fallback,
      'total', coalesce(array_length(v_ids, 1), 0)
    ),
    'fallback', case
      when v_fallback > 0 or coalesce(array_length(v_ids, 1), 0) < 10
        then jsonb_build_object(
          'used', true,
          'reason', 'category_pool_insufficient'
        )
      else jsonb_build_object('used', false)
    end
  );

  insert into public.exams (
    user_id,
    kind,
    module_id,
    lesson_id,
    duration_sec,
    selector_meta
  )
  values (
    v_user,
    'mashq'::public.exam_kind,
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
    'selector_meta', v_meta,
    'items', public.exam_payload(v_exam)
  );
end
$$;

revoke all on function public.start_adaptive_practice(uuid) from public, anon;
grant execute on function public.start_adaptive_practice(uuid) to authenticated;

commit;
