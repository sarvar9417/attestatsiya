-- P0: New exam attempts update learning mastery from the final saved
-- answer, not the first mutable draft. Preserve older attempts as-is.
-- Defer only for existing SM-2-enabled exam kinds; learning mode policy for
-- mashq/custom/pedagogik_15 remains unchanged pending separate specification.
BEGIN;
-- New attempts only. Historical/in-flight attempts retain existing policy;
-- never retroactively apply SM-2 a second time to a previously saved answer.
CREATE OR REPLACE FUNCTION public.mark_new_exam_sm2_final_policy()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO ''
AS $policy$
BEGIN
  IF NEW.kind IN ('mock', 'mavzu', 'bolim', 'diagnostika', 'takrorlash', 'zaif', 'axb_bob') THEN
    NEW.selection_meta := coalesce(NEW.selection_meta, '{}'::jsonb)
      || jsonb_build_object('sm2_commit_policy', 'on_finish_v1');
  END IF;
  RETURN NEW;
END;
$policy$;
REVOKE ALL ON FUNCTION public.mark_new_exam_sm2_final_policy() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS trg_new_exam_sm2_final_policy ON public.exams;
CREATE TRIGGER trg_new_exam_sm2_final_policy
  BEFORE INSERT ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.mark_new_exam_sm2_final_policy();


-- Modern submit_answer may update the answer snapshot many times but does not
-- update user_construct_stats for new on_finish_v1 attempts.
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
  v_revision bigint;
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

  -- Membership is checked before question_keys are read; locks serialize
  -- revisions with one another and with final submission.
  select *
    into v_item
    from public.exam_items
   where exam_id = p_exam_id
     and question_id = p_question_id
   for update;

  if not found then
    raise exception 'savol_sinovga_tegisli_emas';
  end if;

  -- Learners can edit all drafts until finish_exam finalizes the attempt.
  if v_exam.finished_at is not null then
    return jsonb_build_object('error', 'sinov_tugagan');
  end if;

  -- Legacy clients without revision metadata keep their prior first-submit
  -- idempotency. New revisioned autosave can always update an existing choice.
  if v_item.answered_at is not null and v_exam.kind <> 'mock'
    and not (p_answer ? '_client_revision') then
    if v_exam.kind in ('bolim', 'axb_bob')
       or (v_exam.kind = 'custom' and v_exam.selection_meta->'config'->>'mode' is distinct from 'learning') then
      return jsonb_build_object('saved', true, 'already_answered', true);
    end if;
    select * into v_key from public.question_keys where question_id=v_item.question_id;
    if not found then raise exception 'kalit_topilmadi'; end if;
    return jsonb_build_object('saved', true, 'already_answered', true,
      'correct', v_item.is_correct, 'explanation_md', v_key.explanation_md);
  end if;

  if v_exam.duration_sec is not null
     and now() > v_exam.started_at + make_interval(secs => v_exam.duration_sec) then
    return jsonb_build_object('error', 'vaqt_tugadi');
  end if;

  -- Guard against stale in-flight/offline mock responses overwriting the latest edit.
  -- Legacy clients without a revision continue to use server time.
  -- All modes reject stale queued revisions.
  if true then
    if p_answer ? '_client_revision' then
      if jsonb_typeof(p_answer -> '_client_revision') <> 'number' then
        raise exception 'client_revision_invalid';
      end if;
      v_revision := (p_answer ->> '_client_revision')::bigint;
      if v_revision < 0 or v_revision > (extract(epoch from now() + interval '5 minutes') * 1000)::bigint then
        raise exception 'client_revision_invalid';
      end if;
    else
      v_revision := (extract(epoch from clock_timestamp()) * 1000)::bigint;
    end if;
    if v_item.answered_at is not null and v_item.client_answered_at is not null
       and v_revision <= (extract(epoch from v_item.client_answered_at) * 1000)::bigint then
      return jsonb_build_object('saved', true, 'already_answered', true);
    end if;
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
         client_answered_at = to_timestamp(v_revision / 1000.0),
         answered_at = now()
   where id = v_item.id;

  -- Existing attempts keep their historic first-answer learning semantics.
  -- Only newly created on_finish_v1 attempts defer mastery updates until finalization.
  if v_item.answered_at is null
     and v_exam.selection_meta ->> 'sm2_commit_policy' is distinct from 'on_finish_v1'
     and (
       v_exam.kind in ('mavzu', 'bolim', 'takrorlash', 'zaif', 'diagnostika', 'axb_bob')
       or (v_exam.kind = 'mock' and v_exam.selection_meta ->> 'answer_revision_policy' is distinct from 'mutable-v1')
     ) then
    perform public.apply_sm2(v_user, v_item.construct_id, v_correct);
  end if;

  -- Do not reveal correctness while the answer can still be edited.
  if v_exam.kind in ('mock', 'bolim', 'axb_bob')
     or (v_exam.kind = 'custom' and v_exam.selection_meta->'config'->>'mode' is distinct from 'learning')
     or p_answer ? '_client_revision' then
    return jsonb_build_object('saved', true);
  end if;

  return jsonb_build_object(
    'saved', true,
    'correct', v_correct,
    'explanation_md', v_key.explanation_md
  );
end
$function$


-- Both finalizers apply SM-2 once under the locked exam row, and are idempotent
-- when called again after finished_at is set.
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
  if v_exam.selection_meta ->> 'sm2_commit_policy' = 'on_finish_v1'
     or (v_exam.kind = 'mock' and v_exam.selection_meta ->> 'answer_revision_policy' = 'mutable-v1') then
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
    -- A timed-out attempt may finalize saved answers, but may not insert
    -- delayed new answers. This guard also ships in preceding migration #500.
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

      -- Legacy attempts retain their prior per-answer updates.
      if v_exam.selection_meta ->> 'sm2_commit_policy' is distinct from 'on_finish_v1'
         and not (v_exam.kind = 'mock' and v_exam.selection_meta ->> 'answer_revision_policy' = 'mutable-v1')
         and v_exam.kind in ('mavzu', 'bolim', 'mock', 'takrorlash', 'zaif', 'diagnostika') then
        perform public.apply_sm2(v_user, v_item.construct_id, v_correct);
      end if;
    end loop;

    -- Apply SM-2 exactly once from final submitted choices (including
    -- previously autosaved items). The attempt row is locked; retries of
    -- an already finalized exam cannot apply the update twice.
    if v_exam.selection_meta ->> 'sm2_commit_policy' = 'on_finish_v1'
       or (v_exam.kind = 'mock' and v_exam.selection_meta ->> 'answer_revision_policy' = 'mutable-v1') then
      perform public.apply_sm2(v_user, x.construct_id, x.is_correct)
      from public.exam_items x
      where x.exam_id = p_exam_id and x.answered_at is not null;
    end if;

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
$function$


COMMIT;
