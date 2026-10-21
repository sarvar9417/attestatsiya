-- Resume the owner's active official mock without starting/replacing an exam.
-- Response contains questions and the owner's answers only, never the answer key.
create or replace function public.get_active_mock_exam()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_exam public.exams%rowtype;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select e.* into v_exam
    from public.exams e
   where e.user_id = v_user
     and e.kind = 'mock'::public.exam_kind
     and e.finished_at is null
     and e.duration_sec > 0
     and now() < e.started_at + pg_catalog.make_interval(secs => e.duration_sec)
   order by e.started_at desc
   limit 1;

  if not found then
    return null;
  end if;

  return pg_catalog.jsonb_build_object(
    'exam_id', v_exam.id,
    'kind', 'mock',
    'duration_sec', v_exam.duration_sec,
    'started_at', v_exam.started_at,
    'items', coalesce(public.exam_payload(v_exam.id), '[]'::jsonb),
    'selection_meta', v_exam.selection_meta,
    'answered_question_ids', coalesce((
      select pg_catalog.jsonb_agg(ei.question_id order by ei.order_idx)
        from public.exam_items ei
       where ei.exam_id = v_exam.id and ei.answered_at is not null
    ), '[]'::jsonb),
    'saved_answers', coalesce((
      select pg_catalog.jsonb_object_agg(ei.question_id::text, ei.user_answer)
        from public.exam_items ei
       where ei.exam_id = v_exam.id and ei.answered_at is not null
    ), '{}'::jsonb)
  );
end;
$$;

revoke all on function public.get_active_mock_exam() from public, anon;
grant execute on function public.get_active_mock_exam() to authenticated;
