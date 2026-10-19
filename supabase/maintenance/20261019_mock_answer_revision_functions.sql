-- Applied to Supabase live database 2026-10-19; repository record only.
-- Mock: upsert latest answer until finish/time deadline; other exams remain first-write.
-- Lock order and owner checks stay unchanged. Learning SM2 runs once at final mock finish.
CREATE OR REPLACE FUNCTION public.submit_answer(p_exam_id uuid, p_question_id uuid, p_answer jsonb, p_time_spent integer DEFAULT NULL::integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_user    uuid := auth.uid();
  v_exam    public.exams%rowtype;
  v_item    public.exam_items%rowtype;
  v_q       public.questions%rowtype;
  v_key     public.question_keys%rowtype;
  v_correct boolean;
  v_pts     int;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  if p_time_spent is not null and p_time_spent < 0 then
    raise exception 'time_spent_invalid';
  end if;

  -- finish_exam locks this same row first. That shared lock order prevents an
  -- answer from racing with exam finalization.
  select *
    into v_exam
    from public.exams
   where id = p_exam_id
     and user_id = v_user
   for update;

  if not found then
    raise exception 'sinov_topilmadi';
  end if;

  -- Membership is checked before question_keys is touched. Locking the item
  -- makes the first accepted answer immutable under concurrent retries.
  select *
    into v_item
    from public.exam_items
   where exam_id = p_exam_id
     and question_id = p_question_id
   for update;

  if not found then
    raise exception 'savol_sinovga_tegisli_emas';
  end if;

  if v_item.answered_at is not null and v_exam.kind <> 'mock' then
    if v_exam.kind in ('mock', 'bolim', 'axb_bob', 'custom') then
      return jsonb_build_object(
        'saved', true,
        'already_answered', true
      );
    end if;

    select *
      into v_key
      from public.question_keys
     where question_id = v_item.question_id;

    if not found then
      raise exception 'kalit_topilmadi';
    end if;

    return jsonb_build_object(
      'saved', true,
      'already_answered', true,
      'correct', v_item.is_correct,
      'explanation_md', v_key.explanation_md
    );
  end if;

  if v_exam.finished_at is not null then
    return jsonb_build_object('error', 'sinov_tugagan');
  end if;

  if v_exam.duration_sec is not null
     and now() > v_exam.started_at + make_interval(secs => v_exam.duration_sec) then
    return jsonb_build_object('error', 'vaqt_tugadi');
  end if;

  select *
    into v_q
    from public.questions
   where id = v_item.question_id;

  if not found then
    raise exception 'savol_topilmadi';
  end if;

  select *
    into v_key
    from public.question_keys
   where question_id = v_item.question_id;

  if not found then
    raise exception 'kalit_topilmadi';
  end if;

  v_correct := public.check_answer(v_q.format, v_key.payload, p_answer);
  v_pts := case when v_correct then 2 else 0 end;

  update public.exam_items
     set user_answer = p_answer,
         is_correct = v_correct,
         score = v_pts,
         time_spent_sec = coalesce(p_time_spent, time_spent_sec),
         client_answered_at = coalesce(client_answered_at, now()),
         answered_at = now()
   where id = v_item.id;

  if v_item.answered_at is null and v_exam.kind in ('mavzu', 'bolim', 'takrorlash', 'zaif', 'diagnostika', 'axb_bob') then
    perform public.apply_sm2(v_user, v_item.construct_id, v_correct);
  end if;

  if v_exam.kind in ('mock', 'bolim', 'axb_bob', 'custom') then
    return jsonb_build_object('saved', true);
  end if;

  return jsonb_build_object(
    'saved', true,
    'correct', v_correct,
    'explanation_md', v_key.explanation_md
  );
end
$function$
;

CREATE OR REPLACE FUNCTION public.finish_exam(p_exam_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  -- Mock answers can be edited until finish. Apply adaptive learning once,
  -- against the FINAL answer, not the first choice.
  if v_exam.kind = 'mock' then
    perform public.apply_sm2(v_user, x.construct_id, x.is_correct)
    from public.exam_items x
    where x.exam_id = p_exam_id and x.answered_at is not null;
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
end $function$
;
