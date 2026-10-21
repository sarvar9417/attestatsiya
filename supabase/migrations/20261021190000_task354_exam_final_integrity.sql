-- TASK-354: P0 test-integrity corrections; requires QA acceptance before remote deployment.
-- New revisioned attempts defer mastery/evidence until last answer at finish.
-- Legacy attempts remain first-write for compatibility; mock mutable-v1 is finalized at finish.
-- Security: deprecated batch finalize bypasses expiry and revision guard; remove client execution.
BEGIN;
DO $ BEGIN
 IF to_regprocedure('public.finish_exam_batch(uuid,jsonb)') IS NOT NULL THEN
   EXECUTE 'REVOKE ALL ON FUNCTION public.finish_exam_batch(uuid,jsonb) FROM PUBLIC,anon,authenticated';
 END IF;
END $;
CREATE OR REPLACE FUNCTION public.persist_final_mastery_evidence(p_exam_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
AS $final$
declare
  v_item record;
  v_inserted boolean;
  v_kind public.mastery_evidence_kind;
begin
  for v_item in
    select ei.*,e.user_id,q.cognitive,e.kind
    from public.exam_items ei
    join public.exams e on e.id=ei.exam_id
    join public.questions q on q.id=ei.question_id
    where ei.exam_id=p_exam_id and ei.answered_at is not null
    order by ei.order_idx
  loop
    v_kind:=case when v_item.kind='mashq' then
      'guided'::public.mastery_evidence_kind
      else 'independent'::public.mastery_evidence_kind end;
    v_inserted:=false;
    insert into public.mastery_evidence
      (user_id,construct_id,question_id,exam_id,exam_item_id,cognitive,
       evidence_kind,is_correct,observed_at)
    values
      (v_item.user_id,v_item.construct_id,v_item.question_id,p_exam_id,v_item.id,
       v_item.cognitive,v_kind,v_item.is_correct,v_item.answered_at)
    on conflict (exam_item_id) do nothing
    returning true into v_inserted;
    if not coalesce(v_inserted,false) then continue; end if;
    insert into public.user_construct_stats(user_id,construct_id)
      values(v_item.user_id,v_item.construct_id)
      on conflict(user_id,construct_id) do nothing;
    update public.user_construct_stats
       set independent_attempts=independent_attempts+case when v_kind='independent' then 1 else 0 end,
           guided_attempts=guided_attempts+case when v_kind='guided' then 1 else 0 end,
           bilish_attempts=bilish_attempts+case when v_item.cognitive='bilish' then 1 else 0 end,
           bilish_correct=bilish_correct+case when v_item.cognitive='bilish' and v_item.is_correct then 1 else 0 end,
           qollash_attempts=qollash_attempts+case when v_item.cognitive='qollash' then 1 else 0 end,
           qollash_correct=qollash_correct+case when v_item.cognitive='qollash' and v_item.is_correct then 1 else 0 end,
           mulohaza_attempts=mulohaza_attempts+case when v_item.cognitive='mulohaza' then 1 else 0 end,
           mulohaza_correct=mulohaza_correct+case when v_item.cognitive='mulohaza' and v_item.is_correct then 1 else 0 end
    where user_id=v_item.user_id and construct_id=v_item.construct_id;
  end loop;
end
$final$;
REVOKE ALL ON FUNCTION public.persist_final_mastery_evidence(uuid)
  FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.capture_mastery_evidence()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_exam public.exams%rowtype;
  v_question public.questions%rowtype;
  v_kind public.mastery_evidence_kind;
  v_inserted boolean := false;
begin
  if old.answered_at is not null or new.answered_at is null then
    return new;
  end if;

  select * into v_exam
  from public.exams
  where id = new.exam_id;

  select * into v_question
  from public.questions
  where id = new.question_id;

  if v_exam.id is null or v_question.id is null or new.is_correct is null then
    return new;
  end if;

  -- Correctness can change until finalization for versioned attempts.
  -- Defer append-only evidence, too, not just SM-2 counters.
  if v_exam.selection_meta->>'mastery_policy'='final-only-v2'
     or (v_exam.kind='mock' and v_exam.selection_meta->>'answer_revision_policy'='mutable-v1')
  then return new; end if;

  v_kind := case
    when v_exam.kind = 'mashq'::public.exam_kind
      then 'guided'::public.mastery_evidence_kind
    else 'independent'::public.mastery_evidence_kind
  end;

  insert into public.mastery_evidence (
    user_id,
    construct_id,
    question_id,
    exam_id,
    exam_item_id,
    cognitive,
    evidence_kind,
    is_correct,
    observed_at
  )
  values (
    v_exam.user_id,
    new.construct_id,
    new.question_id,
    new.exam_id,
    new.id,
    v_question.cognitive,
    v_kind,
    new.is_correct,
    coalesce(new.answered_at, now())
  )
  on conflict (exam_item_id) do nothing
  returning true into v_inserted;

  if not coalesce(v_inserted, false) then
    return new;
  end if;

  insert into public.user_construct_stats (user_id, construct_id)
  values (v_exam.user_id, new.construct_id)
  on conflict (user_id, construct_id) do nothing;

  update public.user_construct_stats
  set
    independent_attempts = independent_attempts
      + case when v_kind = 'independent'::public.mastery_evidence_kind then 1 else 0 end,
    guided_attempts = guided_attempts
      + case when v_kind = 'guided'::public.mastery_evidence_kind then 1 else 0 end,
    bilish_attempts = bilish_attempts
      + case when v_question.cognitive = 'bilish'::public.cognitive_level then 1 else 0 end,
    bilish_correct = bilish_correct
      + case when v_question.cognitive = 'bilish'::public.cognitive_level and new.is_correct then 1 else 0 end,
    qollash_attempts = qollash_attempts
      + case when v_question.cognitive = 'qollash'::public.cognitive_level then 1 else 0 end,
    qollash_correct = qollash_correct
      + case when v_question.cognitive = 'qollash'::public.cognitive_level and new.is_correct then 1 else 0 end,
    mulohaza_attempts = mulohaza_attempts
      + case when v_question.cognitive = 'mulohaza'::public.cognitive_level then 1 else 0 end,
    mulohaza_correct = mulohaza_correct
      + case when v_question.cognitive = 'mulohaza'::public.cognitive_level and new.is_correct then 1 else 0 end
  where user_id = v_exam.user_id
    and construct_id = new.construct_id;

  return new;
end
$function$

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

  -- Version only fresh revisioned attempts. In-flight legacy attempts keep
  -- their first-answer evidence/SM-2 semantics.
  if v_exam.kind in ('mavzu','bolim','takrorlash','zaif','diagnostika','axb_bob')
     and p_answer ? '_client_revision'
     and v_exam.selection_meta->>'mastery_policy' is null
     and not exists (select 1 from public.exam_items prior
                     where prior.exam_id=p_exam_id and prior.answered_at is not null)
  then
    update public.exams
    set selection_meta=jsonb_set(coalesce(selection_meta,'{}'::jsonb),
       '{mastery_policy}',to_jsonb('final-only-v2'::text),true)
    where id=p_exam_id;
    v_exam.selection_meta:=jsonb_set(coalesce(v_exam.selection_meta,'{}'::jsonb),
       '{mastery_policy}',to_jsonb('final-only-v2'::text),true);
  end if;

  update public.exam_items
     set user_answer = p_answer,
         is_correct = v_correct,
         score = v_pts,
         time_spent_sec = coalesce(p_time_spent, time_spent_sec),
         client_answered_at = to_timestamp(v_revision / 1000.0),
         answered_at = now()
   where id = v_item.id;

  if v_item.answered_at is null
    and v_exam.selection_meta->>'mastery_policy' is distinct from 'final-only-v2'
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
  if (v_exam.kind = 'mock' and v_exam.selection_meta ->> 'answer_revision_policy' = 'mutable-v1')
      or (v_exam.kind in ('mavzu','bolim','takrorlash','zaif','diagnostika','axb_bob')
          and v_exam.selection_meta->>'mastery_policy'='final-only-v2') then
    perform public.persist_final_mastery_evidence(p_exam_id);
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

CREATE OR REPLACE FUNCTION public.generate_topic_test(p_lesson_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- A topic assessment must never silently shrink its configured scope.
  if v_available < v_target then
    raise exception 'topic_pool_insufficient: configured=% available=%',
      v_target,v_available;
  end if;

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
    'selector_version', 'objective-complete-v1',
    'adaptive_pool_version', 2,
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
$function$

COMMIT;
