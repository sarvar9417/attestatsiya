-- P0-004: protect profile security fields and make answer submission
-- owner-scoped, exam-scoped and idempotent.

begin;

create or replace function public.protect_profile_security_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (
    new.role is distinct from old.role
    or new.is_blocked is distinct from old.is_blocked
  )
  and current_user not in ('postgres', 'service_role', 'supabase_admin')
  and public.auth_role() <> 'admin'::public.user_role then
    raise exception 'profile_security_fields_forbidden'
      using errcode = '42501';
  end if;

  return new;
end
$$;

drop trigger if exists protect_profile_security_fields on public.profiles;
create trigger protect_profile_security_fields
  before update of role, is_blocked on public.profiles
  for each row execute function public.protect_profile_security_fields();

-- Supabase normally supplies these grants through its default privileges.
-- Keeping them explicit makes the intended RLS + trigger boundary testable and
-- preserves administrator profile management through the authenticated API.
grant select, update on table public.profiles to authenticated;

create or replace function public.submit_answer(
  p_exam_id     uuid,
  p_question_id uuid,
  p_answer      jsonb,
  p_time_spent  int default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
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

  if v_item.answered_at is not null then
    if v_exam.kind in ('mock', 'bolim') then
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
   where id = v_item.id
     and answered_at is null;

  if v_exam.kind in ('mavzu', 'bolim', 'mock', 'takrorlash', 'zaif', 'diagnostika') then
    perform public.apply_sm2(v_user, v_item.construct_id, v_correct);
  end if;

  if v_exam.kind in ('mock', 'bolim') then
    return jsonb_build_object('saved', true);
  end if;

  return jsonb_build_object(
    'saved', true,
    'correct', v_correct,
    'explanation_md', v_key.explanation_md
  );
end
$$;

revoke all on function public.submit_answer(uuid, uuid, jsonb, int)
  from public, anon;
grant execute on function public.submit_answer(uuid, uuid, jsonb, int)
  to authenticated;

commit;
