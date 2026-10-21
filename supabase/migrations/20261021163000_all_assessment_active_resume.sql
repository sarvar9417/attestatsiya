-- Read-only owner-scoped resume for all ExamRunner assessment types.
-- Never regenerate, extend an expired timer, reveal question keys, or cross users.
create or replace function public.get_active_exam(
 p_kind public.exam_kind,
 p_module_id uuid default null,
 p_lesson_id uuid default null,
 p_chapter_no integer default null,
 p_requested_count integer default null
) returns jsonb
language plpgsql stable security definer
set search_path = ''
as $resume$
declare
  v_user uuid := auth.uid();
  v_exam public.exams%rowtype;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  if p_kind is null then raise exception 'exam_kind_required'; end if;
  if p_kind = 'bolim'::public.exam_kind and p_module_id is null then return null; end if;
  if p_kind = 'mavzu'::public.exam_kind and p_lesson_id is null then return null; end if;
  if p_kind = 'axb_bob'::public.exam_kind and (
     p_chapter_no is null or p_requested_count is null) then return null; end if;
  select e.* into v_exam
    from public.exams e
   where e.user_id = v_user
     and e.kind = p_kind
     and e.finished_at is null
     and (e.duration_sec is null and now() < e.started_at + interval '24 hours'
          or e.duration_sec > 0 and now() < e.started_at +
              pg_catalog.make_interval(secs => e.duration_sec))
     and (p_kind <> 'bolim'::public.exam_kind or e.module_id = p_module_id)
     and (p_kind <> 'mavzu'::public.exam_kind or e.lesson_id = p_lesson_id)
     and (p_kind <> 'mashq'::public.exam_kind or
         (p_lesson_id is null and e.lesson_id is null or e.lesson_id = p_lesson_id))
     and (p_kind <> 'axb_bob'::public.exam_kind or (
         e.selection_meta->>'chapter_no' = p_chapter_no::text and
         e.selection_meta->>'requested_count' = p_requested_count::text))
   order by e.started_at desc, e.id desc
   limit 1;
  if not found then return null; end if;
  return pg_catalog.jsonb_build_object(
    'exam_id', v_exam.id, 'kind', v_exam.kind,
    'duration_sec', v_exam.duration_sec, 'started_at', v_exam.started_at,
    'selection_meta', v_exam.selection_meta,
    'items', coalesce(public.exam_payload(v_exam.id), '[]'::jsonb),
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
$resume$;
revoke all on function public.get_active_exam(public.exam_kind,uuid,uuid,integer,integer) from public,anon;
grant execute on function public.get_active_exam(public.exam_kind,uuid,uuid,integer,integer) to authenticated;
