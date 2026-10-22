-- P0: Guard legacy atomic batch submission against late answer injection.
-- Existing finished attempts remain idempotent. Expired attempts may still
-- finalize without any newly supplied answers (p_answers=[]).
-- Generated from the inspected production function body with one narrow guard.
CREATE OR REPLACE FUNCTION public.finish_exam_batch(p_exam_id uuid, p_answers jsonb DEFAULT '[]'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_user   uuid := auth.uid();
  v_exam   public.exams%rowtype;
  v_total  int;
  v_max    int;
  v_pct    numeric;
  v_break  jsonb;
  v_all_constructs boolean;
  v_was_finished boolean;
  v_ans    jsonb;
  v_qid    uuid;
  v_item   public.exam_items%rowtype;
  v_q      public.questions%rowtype;
  v_key    public.question_keys%rowtype;
  v_correct boolean;
  v_pts    int;
  v_time   int;
  v_items  jsonb;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  if p_answers is null or jsonb_typeof(p_answers) <> 'array' then
    raise exception 'answers_array_kerak';
  end if;

  -- finish_exam bilan bir xil qulf tartibi: exam row'ni oldin lock qilamiz,
  -- bu javob yozish bilan finalizatsiya o'rtasidagi raqobatni to'xtatadi.
  select *
    into v_exam
    from public.exams
   where id = p_exam_id
     and user_id = v_user
   for update;

  if not found then
    raise exception 'sinov_topilmadi';
  end if;

  v_was_finished := v_exam.finished_at is not null;

  if v_exam.finished_at is null then
    -- Expired exams may be finalized with no new answers, but a client must
    -- never submit late answers through the legacy batch-finalize endpoint.
    -- Keep this check under the exam row lock to prevent a race with submits.
    if v_exam.duration_sec is not null
       and clock_timestamp() > v_exam.started_at + make_interval(secs => v_exam.duration_sec)
       and jsonb_array_length(p_answers) > 0 then
      raise exception 'vaqt_tugadi';
    end if;
    -- 1) hali saqlanmagan javoblarni yozamiz (bitta transaksiya).
    --    answered_at is not null bo'lganlar immutable — ularga tegmaymiz.
    for v_ans in select value from jsonb_array_elements(p_answers)
    loop
      v_qid := (v_ans ->> 'question_id')::uuid;
      if v_qid is null then continue; end if;

      select *
        into v_item
        from public.exam_items
       where exam_id = p_exam_id
         and question_id = v_qid
       for update;

      if not found or v_item.answered_at is not null then
        continue;
      end if;

      select *
        into v_q
        from public.questions
       where id = v_qid;

      select *
        into v_key
        from public.question_keys
       where question_id = v_qid;

      if not found then
        continue;
      end if;

      v_correct := public.check_answer(v_q.format, v_key.payload, v_ans -> 'answer');
      v_pts := case when v_correct then 2 else 0 end;
      v_time := coalesce(nullif((v_ans ->> 'time_spent_sec')::int, 0), 0);

      update public.exam_items
         set user_answer = v_ans -> 'answer',
             is_correct = v_correct,
             score = v_pts,
             time_spent_sec = case when v_time > 0 then v_time else time_spent_sec end,
             client_answered_at = coalesce(client_answered_at, now()),
             answered_at = now()
       where id = v_item.id
         and answered_at is null;

      if v_exam.kind in ('mavzu', 'bolim', 'mock', 'takrorlash', 'zaif', 'diagnostika') then
        perform public.apply_sm2(v_user, v_item.construct_id, v_correct);
      end if;
    end loop;

    -- 2) ball va breakdown hisoblaymiz.
    select coalesce(sum(score), 0), count(*) * 2
      into v_total, v_max
      from public.exam_items
     where exam_id = p_exam_id;

    select jsonb_agg(x)
      into v_break
      from (
        select q.group_code,
               count(*) as jami,
               count(*) filter (where ei.is_correct) as togri
          from public.exam_items ei
          join public.questions q on q.id = ei.question_id
         where ei.exam_id = p_exam_id
         group by q.group_code
         order by q.group_code
      ) x;

    -- 3) imtihonni yopamiz.
    update public.exams
       set finished_at = now(),
           total_score = v_total,
           max_score = v_max,
           breakdown = v_break
     where id = p_exam_id;

    -- 4) mavzu: dars progress (attempts, best_score, mastered).
    if v_exam.kind = 'mavzu' and v_exam.lesson_id is not null then
      v_pct := case when v_max > 0 then v_total::numeric / v_max else 0 end;

      select bool_and(has_correct)
        into v_all_constructs
        from (
          select bool_or(coalesce(is_correct, false)) as has_correct
            from public.exam_items
           where exam_id = p_exam_id
           group by construct_id
        ) c;

      insert into public.user_lesson_progress (user_id, lesson_id, attempts, best_score)
      values (v_user, v_exam.lesson_id, 1, v_total)
      on conflict (user_id, lesson_id) do update set
        attempts   = public.user_lesson_progress.attempts + 1,
        best_score = greatest(
          coalesce(public.user_lesson_progress.best_score, 0), v_total);

      if v_pct >= 0.75 and coalesce(v_all_constructs, false) then
        update public.user_lesson_progress
           set mastered_at = coalesce(mastered_at, now())
         where user_id = v_user and lesson_id = v_exam.lesson_id;
        update public.exams set passed = true where id = p_exam_id;
      else
        update public.exams set passed = false where id = p_exam_id;
      end if;
    end if;

    -- 5) modul: eng yaxshi ball.
    if v_exam.kind = 'bolim' and v_exam.module_id is not null then
      insert into public.user_module_progress (user_id, module_id, exam_best_score)
      values (v_user, v_exam.module_id, v_total)
      on conflict (user_id, module_id) do update set
        exam_best_score = greatest(
          coalesce(public.user_module_progress.exam_best_score, 0), v_total);
    end if;
  end if;

  -- 6) natija: har bir savol bo'yicha tahlil (faqat tugagan sinovdan keyin).
  --    key/explanations client'ga faqat shu yerda — sinov yakunlangach qaytadi.
  select *
    into v_exam
    from public.exams
   where id = p_exam_id;

  select coalesce(jsonb_agg(x), '[]'::jsonb)
    into v_items
    from (
      select jsonb_build_object(
               'question_id',    ei.question_id,
               'order_idx',      ei.order_idx,
               'format',         q.format,
               'is_correct',     ei.is_correct,
               'user_answer',    ei.user_answer,
               'key',            k.payload,
               'explanation_md', k.explanation_md
             ) as x
        from public.exam_items ei
        join public.questions q on q.id = ei.question_id
        join public.question_keys k on k.question_id = q.id
       where ei.exam_id = p_exam_id
       order by ei.order_idx
    ) s;

  return jsonb_build_object(
    'exam_id', v_exam.id,
    'total_score', v_exam.total_score,
    'max_score', v_exam.max_score,
    'passed', v_exam.passed,
    'breakdown', v_exam.breakdown,
    'already_finished', v_was_finished,
    'items', v_items
  );
end
$function$;

-- The legacy function was PUBLIC-executable on a fresh database.
-- Only authenticated users should be able to invoke this privileged path.
REVOKE EXECUTE ON FUNCTION public.finish_exam_batch(uuid,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.finish_exam_batch(uuid,jsonb) TO authenticated;
