-- ─── Helper: check_answer ────────────────────────────────────────────────
create or replace function public.check_answer(
  p_format      public.question_format,
  p_key         jsonb,
  p_user_answer jsonb
) returns boolean
language plpgsql immutable set search_path = public as $$
begin
  if p_user_answer is null then return false; end if;
  case p_format
    when 'Y1' then
      return (p_user_answer ->> 'option_id') is not null
         and (p_user_answer ->> 'option_id') = (p_key ->> 'correct_option_id');
    when 'Y2' then
      return (p_user_answer -> 'pairs') = (p_key -> 'pairs');
    when 'Y3' then
      return (p_user_answer -> 'order') = (p_key -> 'order');
  end case;
  return false;
end $$;

-- ─── Helper: SM-2 ─────────────────────────────────────────────────────────
create or replace function public.apply_sm2(
  p_user uuid,
  p_construct uuid,
  p_correct boolean
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_row    public.user_construct_stats;
  v_q      int;
  v_ease   numeric(4,2);
  v_streak int;
  v_int    int;
begin
  insert into public.user_construct_stats (user_id, construct_id)
  values (p_user, p_construct)
  on conflict (user_id, construct_id) do nothing;
  select * into v_row from public.user_construct_stats
  where user_id = p_user and construct_id = p_construct for update;
  v_q := case when p_correct then 4 else 2 end;
  v_ease := greatest(1.30,
    v_row.ease + (0.1 - (5 - v_q) * (0.08 + (5 - v_q) * 0.02)));
  if p_correct then
    v_streak := v_row.streak + 1;
    v_int := case
      when v_streak = 1 then 1
      when v_streak = 2 then 3
      else greatest(1, round(v_row.interval_days * v_ease)::int)
    end;
  else
    v_streak := 0;
    v_int := 0;
  end if;
  update public.user_construct_stats set
    attempts      = v_row.attempts + 1,
    correct       = v_row.correct + (case when p_correct then 1 else 0 end),
    streak        = v_streak,
    ease          = v_ease,
    interval_days = v_int,
    due_at        = now() + make_interval(days => greatest(v_int, 1)),
    last_seen_at  = now()
  where user_id = p_user and construct_id = p_construct;
end $$;

-- ─── Helper: attach_questions ──────────────────────────────────────────────
create or replace function public.attach_questions(p_exam_id uuid, p_ids uuid[])
returns void
language sql security definer set search_path = public as $$
  insert into public.exam_items (exam_id, question_id, construct_id, order_idx)
  select p_exam_id, q.id, q.construct_id, ord
  from unnest(p_ids) with ordinality as t(qid, ord)
  join public.questions q on q.id = t.qid;
$$;

-- ─── Helper: exam_payload (kalitsiz!) ─────────────────────────────────────
create or replace function public.exam_payload(p_exam_id uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_agg(item order by item->>'order_idx')
  from (
    select jsonb_build_object(
      'item_id',   ei.id,
      'order_idx', ei.order_idx,
      'question_id', q.id,
      'format',    q.format,
      'stem_md',   q.stem_md,
      'assets',    q.assets,
      'options',   (
        select coalesce(jsonb_agg(jsonb_build_object(
                 'id', o.id, 'side', o.side, 'content_md', o.content_md
               ) order by o.side, o.order_idx), '[]'::jsonb)
        from public.question_options o where o.question_id = q.id
      )
    ) as item
    from public.exam_items ei
    join public.questions q on q.id = ei.question_id
    where ei.exam_id = p_exam_id
  ) s;
$$;

-- ─── Pick helpers ──────────────────────────────────────────────────────────
create or replace function public.pick_questions(
  p_group text, p_cog public.cognitive_level, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select id from public.questions
    where group_code = p_group
      and status = 'published'
      and (p_cog is null or cognitive = p_cog)
      and not (id = any(p_exclude))
    order by random() limit p_n
  ) s;
$$;

create or replace function public.pick_module_questions(
  p_module uuid, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id from public.questions q
    where q.status = 'published'
      and q.construct_id in (
        select lc.construct_id from public.lesson_constructs lc
        join public.lessons l on l.id = lc.lesson_id
        where l.module_id = p_module
      )
      and not (q.id = any(p_exclude))
    order by random() limit p_n
  ) s;
$$;

create or replace function public.pick_due_questions(p_user uuid, p_n int)
returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select distinct on (q.construct_id) q.id
    from public.user_construct_stats ucs
    join public.questions q on q.construct_id = ucs.construct_id
    where ucs.user_id = p_user
      and ucs.due_at <= now()
      and q.status = 'published'
    order by q.construct_id, random()
    limit p_n
  ) s;
$$;

create or replace function public.pick_weak_questions(p_user uuid, p_n int)
returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id
    from public.user_construct_stats ucs
    join public.questions q on q.construct_id = ucs.construct_id
    where ucs.user_id = p_user
      and ucs.attempts >= 3
      and q.status = 'published'
    order by (ucs.correct::numeric / nullif(ucs.attempts, 0)) asc, random()
    limit p_n
  ) s;
$$;

-- ─── start_exam ────────────────────────────────────────────────────────────
create or replace function public.start_exam(
  p_kind      public.exam_kind,
  p_module_id uuid default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_bp    public.blueprints%rowtype;
  v_exam  uuid;
  v_ids   uuid[] := '{}';
  v_dur   int;
  q       record;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select * into v_bp from public.blueprints where is_active limit 1;
  if not found then raise exception 'blueprint_topilmadi'; end if;
  if p_kind = 'mock' then
    v_dur := v_bp.duration_min * 60;
    for q in
      select group_code, n_bilish, n_qollash, n_mulohaza
      from public.blueprint_quotas where blueprint_id = v_bp.id order by order_idx
    loop
      v_ids := v_ids || public.pick_questions(q.group_code, 'bilish'::public.cognitive_level,  q.n_bilish,  v_ids);
      v_ids := v_ids || public.pick_questions(q.group_code, 'qollash'::public.cognitive_level, q.n_qollash, v_ids);
      v_ids := v_ids || public.pick_questions(q.group_code, 'mulohaza'::public.cognitive_level, q.n_mulohaza, v_ids);
    end loop;
    if array_length(v_ids, 1) <> v_bp.total_questions then
      raise exception 'savol_yetarli_emas: % / %',
        coalesce(array_length(v_ids, 1), 0), v_bp.total_questions;
    end if;
  elsif p_kind = 'diagnostika' then
    v_dur := null;
    for q in
      select group_code from public.blueprint_quotas
      where blueprint_id = v_bp.id order by order_idx
    loop
      v_ids := v_ids || public.pick_questions(q.group_code, null, 2, v_ids);
    end loop;
  elsif p_kind = 'bolim' then
    if p_module_id is null then raise exception 'module_id_kerak'; end if;
    v_dur := 1800;
    v_ids := public.pick_module_questions(p_module_id, 15, v_ids);
  elsif p_kind = 'takrorlash' then
    v_dur := null;
    v_ids := public.pick_due_questions(v_user, 15);
  elsif p_kind = 'zaif' then
    v_dur := null;
    v_ids := public.pick_weak_questions(v_user, 10);
  else
    raise exception 'qollab_quvvatlanmaydi: %', p_kind;
  end if;
  insert into public.exams (user_id, kind, blueprint_id, module_id, duration_sec)
  values (v_user, p_kind, v_bp.id, p_module_id, v_dur)
  returning id into v_exam;
  perform public.attach_questions(v_exam, v_ids);
  return jsonb_build_object(
    'exam_id', v_exam, 'kind', p_kind,
    'duration_sec', v_dur, 'started_at', now(),
    'items', public.exam_payload(v_exam)
  );
end $$;

-- ─── generate_topic_test ───────────────────────────────────────────────────
create or replace function public.generate_topic_test(p_lesson_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_exam uuid;
  v_ids  uuid[] := '{}';
  v_one  uuid;
  c      record;
  v_need int;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  for c in
    select construct_id from public.lesson_constructs where lesson_id = p_lesson_id
  loop
    select q.id into v_one
    from public.questions q
    where q.construct_id = c.construct_id
      and q.status = 'published'
      and not (q.id = any(v_ids))
    order by (
      select count(*) from public.exam_items ei
      join public.exams e on e.id = ei.exam_id
      where ei.question_id = q.id and e.user_id = v_user
    ) asc, random()
    limit 1;
    if v_one is not null then v_ids := v_ids || v_one; end if;
  end loop;
  if array_length(v_ids, 1) is null then
    raise exception 'savol_yoq: mavzuga savol biriktirilmagan';
  end if;
  v_need := greatest(0, 10 - array_length(v_ids, 1));
  if v_need > 0 then
    v_ids := v_ids || public.pick_lesson_extra(v_user, p_lesson_id, v_need, v_ids);
  end if;
  insert into public.exams (user_id, kind, lesson_id, module_id)
  select v_user, 'mavzu'::public.exam_kind, p_lesson_id, l.module_id
  from public.lessons l where l.id = p_lesson_id
  returning id into v_exam;
  perform public.attach_questions(v_exam, v_ids);
  return jsonb_build_object(
    'exam_id', v_exam, 'kind', 'mavzu',
    'duration_sec', null, 'started_at', now(),
    'items', public.exam_payload(v_exam)
  );
end $$;

create or replace function public.pick_lesson_extra(
  p_user uuid, p_lesson uuid, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id
    from public.questions q
    join public.lesson_constructs lc on lc.construct_id = q.construct_id
    left join public.user_construct_stats ucs
      on ucs.construct_id = q.construct_id and ucs.user_id = p_user
    where lc.lesson_id = p_lesson
      and q.status = 'published'
      and not (q.id = any(p_exclude))
    order by coalesce(ucs.correct::numeric / nullif(ucs.attempts, 0), 0) asc,
             random()
    limit p_n
  ) s;
$$;

-- ─── submit_answer ─────────────────────────────────────────────────────────
create or replace function public.submit_answer(
  p_exam_id     uuid,
  p_question_id uuid,
  p_answer      jsonb,
  p_time_spent  int default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_exam    public.exams%rowtype;
  v_q       public.questions%rowtype;
  v_key     public.question_keys%rowtype;
  v_correct boolean;
  v_pts     int;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select * into v_exam from public.exams where id = p_exam_id and user_id = v_user;
  if not found then raise exception 'sinov_topilmadi'; end if;
  if v_exam.finished_at is not null then
    return jsonb_build_object('error', 'sinov_tugagan');
  end if;
  if v_exam.duration_sec is not null
     and now() > v_exam.started_at + make_interval(secs => v_exam.duration_sec) then
    return jsonb_build_object('error', 'vaqt_tugadi');
  end if;
  select * into v_q   from public.questions     where id = p_question_id;
  select * into v_key from public.question_keys where question_id = p_question_id;
  if not found then raise exception 'kalit_topilmadi'; end if;
  v_correct := public.check_answer(v_q.format, v_key.payload, p_answer);
  v_pts := case when v_correct then 2 else 0 end;
  update public.exam_items set
    user_answer = p_answer,
    is_correct  = v_correct,
    score       = v_pts,
    time_spent_sec = coalesce(p_time_spent, time_spent_sec),
    client_answered_at = coalesce(client_answered_at, now()),
    answered_at = now()
  where exam_id = p_exam_id and question_id = p_question_id;
  if v_exam.kind in ('mavzu','bolim','mock','takrorlash','zaif','diagnostika') then
    perform public.apply_sm2(v_user, v_q.construct_id, v_correct);
  end if;
  if v_exam.kind in ('mock', 'bolim') then
    return jsonb_build_object('saved', true);
  end if;
  return jsonb_build_object(
    'saved', true,
    'correct', v_correct,
    'explanation_md', v_key.explanation_md
  );
end $$;

-- ─── finish_exam ───────────────────────────────────────────────────────────
create or replace function public.finish_exam(p_exam_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_exam  public.exams%rowtype;
  v_total int; v_max int; v_pct numeric;
  v_break jsonb;
  v_all_constructs boolean;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select * into v_exam from public.exams where id = p_exam_id and user_id = v_user for update;
  if not found then raise exception 'sinov_topilmadi'; end if;
  if v_exam.finished_at is not null then
    return jsonb_build_object(
      'exam_id', v_exam.id, 'total_score', v_exam.total_score,
      'max_score', v_exam.max_score, 'passed', v_exam.passed,
      'breakdown', v_exam.breakdown, 'already_finished', true
    );
  end if;
  select coalesce(sum(score), 0), count(*) * 2
    into v_total, v_max
  from public.exam_items where exam_id = p_exam_id;
  select jsonb_agg(x) into v_break from (
    select q.group_code,
           count(*)                        as jami,
           count(*) filter (where ei.is_correct) as togri
    from public.exam_items ei join public.questions q on q.id = ei.question_id
    where ei.exam_id = p_exam_id
    group by q.group_code order by q.group_code
  ) x;
  update public.exams set
    finished_at = now(), total_score = v_total,
    max_score = v_max, breakdown = v_break
  where id = p_exam_id;
  if v_exam.kind = 'mavzu' and v_exam.lesson_id is not null then
    v_pct := case when v_max > 0 then v_total::numeric / v_max else 0 end;
    select bool_and(has_correct) into v_all_constructs from (
      select bool_or(coalesce(is_correct, false)) as has_correct
      from public.exam_items where exam_id = p_exam_id group by construct_id
    ) c;
    insert into public.user_lesson_progress (user_id, lesson_id, attempts, best_score)
    values (v_user, v_exam.lesson_id, 1, v_total)
    on conflict (user_id, lesson_id) do update set
      attempts   = public.user_lesson_progress.attempts + 1,
      best_score = greatest(coalesce(public.user_lesson_progress.best_score, 0), v_total);
    if v_pct >= 0.75 and coalesce(v_all_constructs, false) then
      update public.user_lesson_progress set mastered_at = coalesce(mastered_at, now())
      where user_id = v_user and lesson_id = v_exam.lesson_id;
      update public.exams set passed = true where id = p_exam_id;
    else
      update public.exams set passed = false where id = p_exam_id;
    end if;
  end if;
  if v_exam.kind = 'bolim' and v_exam.module_id is not null then
    insert into public.user_module_progress (user_id, module_id, exam_best_score)
    values (v_user, v_exam.module_id, v_total)
    on conflict (user_id, module_id) do update set
      exam_best_score = greatest(
        coalesce(public.user_module_progress.exam_best_score, 0), v_total);
  end if;
  select * into v_exam from public.exams where id = p_exam_id;
  return jsonb_build_object(
    'exam_id', v_exam.id, 'total_score', v_exam.total_score,
    'max_score', v_exam.max_score, 'passed', v_exam.passed,
    'breakdown', v_exam.breakdown, 'already_finished', false
  );
end $$;

-- ─── get_review ────────────────────────────────────────────────────────────
create or replace function public.get_review(p_exam_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_ok   boolean;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select finished_at is not null into v_ok
  from public.exams where id = p_exam_id and user_id = v_user;
  if v_ok is null then raise exception 'sinov_topilmadi'; end if;
  if not v_ok  then raise exception 'sinov_tugamagan'; end if;
  return (
    select jsonb_agg(jsonb_build_object(
      'order_idx',   ei.order_idx,
      'stem_md',     q.stem_md,
      'format',      q.format,
      'construct',   c.title_uz,
      'construct_slug', c.slug,
      'user_answer', ei.user_answer,
      'is_correct',  ei.is_correct,
      'key',         k.payload,
      'explanation_md', k.explanation_md
    ) order by ei.order_idx)
    from public.exam_items ei
    join public.questions q on q.id = ei.question_id
    join public.constructs c on c.id = ei.construct_id
    join public.question_keys k on k.question_id = q.id
    where ei.exam_id = p_exam_id
  );
end $$;

-- ─── Other helpers ─────────────────────────────────────────────────────────
create or replace function public.mark_lesson_read(p_lesson_id uuid)
returns void
language sql security definer set search_path = public as $$
  insert into public.user_lesson_progress (user_id, lesson_id, read_at)
  values (auth.uid(), p_lesson_id, now())
  on conflict (user_id, lesson_id) do update
    set read_at = coalesce(public.user_lesson_progress.read_at, now());
$$;

create or replace function public.get_due_reviews()
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'construct_id', c.id, 'title_uz', c.title_uz,
    'group_code', c.group_code, 'due_at', ucs.due_at,
    'accuracy', round(ucs.correct::numeric / nullif(ucs.attempts, 0), 2)
  ) order by ucs.due_at), '[]'::jsonb)
  from public.user_construct_stats ucs
  join public.constructs c on c.id = ucs.construct_id
  where ucs.user_id = auth.uid() and ucs.due_at <= now();
$$;

-- ─── RPC permissions ───────────────────────────────────────────────────────
revoke all on function public.start_exam, public.generate_topic_test, public.submit_answer,
  public.finish_exam, public.get_review, public.get_due_reviews, public.mark_lesson_read from public;
grant execute on function public.start_exam(public.exam_kind, uuid)          to anon, authenticated;
grant execute on function public.generate_topic_test(uuid)                   to anon, authenticated;
grant execute on function public.submit_answer(uuid, uuid, jsonb, int)       to anon, authenticated;
grant execute on function public.finish_exam(uuid)                            to anon, authenticated;
grant execute on function public.get_review(uuid)                             to anon, authenticated;
grant execute on function public.get_due_reviews()                            to anon, authenticated;
grant execute on function public.mark_lesson_read(uuid)                       to anon, authenticated;

revoke all on function public.pick_questions, public.pick_module_questions, public.pick_due_questions,
  public.pick_weak_questions, public.pick_lesson_extra, public.attach_questions, public.exam_payload,
  public.apply_sm2, public.check_answer from public, anon, authenticated;
