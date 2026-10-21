-- Existing clients retain idempotent first answer; revisable UI clients
-- send _client_revision to update it until exam finish.
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
    if v_exam.kind in ('bolim', 'axb_bob', 'custom') then
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

  if v_item.answered_at is null and (
    v_exam.kind in ('mavzu', 'bolim', 'takrorlash', 'zaif', 'diagnostika', 'axb_bob')
    or (v_exam.kind = 'mock' and v_exam.selection_meta ->> 'answer_revision_policy' is distinct from 'mutable-v1')
  ) then
    perform public.apply_sm2(v_user, v_item.construct_id, v_correct);
  end if;

  -- Do not reveal correctness while the answer can still be edited.
  if v_exam.kind in ('mock', 'bolim', 'axb_bob', 'custom')
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
