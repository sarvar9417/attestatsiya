-- TASK-231: after-finish, owner-only custom test analytical report.
-- No answer keys, no individual response payload and no pre-finish disclosure.
begin;
create or replace function public.get_custom_exam_analysis(p_exam_id uuid)
returns jsonb language plpgsql security definer set search_path=''
as $analysis$
declare
  v_user uuid := auth.uid();
  v_exam public.exams%rowtype;
  v_by_lesson jsonb;
  v_by_difficulty jsonb;
  v_by_format jsonb;
  v_total integer;
  v_answered integer;
  v_correct integer;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select * into v_exam from public.exams e
  where e.id=p_exam_id and e.user_id=v_user and e.kind='custom';
  if not found then raise exception 'custom_exam_not_found'; end if;
  if v_exam.finished_at is null then raise exception 'custom_exam_not_finished'; end if;

  select count(*), count(ei.answered_at), count(*) filter (where ei.is_correct is true)
  into v_total,v_answered,v_correct
  from public.exam_items ei where ei.exam_id=p_exam_id;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.lesson_title),'[]'::jsonb)
  into v_by_lesson from (
    select q.source_lesson_id as lesson_id,
      coalesce(l.title_uz,'Mavzu aniqlanmadi') as lesson_title,
      count(*)::int as total,
      count(ei.answered_at)::int as answered,
      count(*) filter (where ei.is_correct is true)::int as correct
    from public.exam_items ei
    join public.questions q on q.id=ei.question_id
    left join public.lessons l on l.id=q.source_lesson_id
    where ei.exam_id=p_exam_id
    group by q.source_lesson_id,l.title_uz
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.difficulty),'[]'::jsonb)
  into v_by_difficulty from (
    select q.difficulty::int as difficulty,
      count(*)::int as total,
      count(ei.answered_at)::int as answered,
      count(*) filter (where ei.is_correct is true)::int as correct
    from public.exam_items ei join public.questions q on q.id=ei.question_id
    where ei.exam_id=p_exam_id group by q.difficulty
  ) t;

  select coalesce(jsonb_agg(to_jsonb(t) order by t.format),'[]'::jsonb)
  into v_by_format from (
    select q.format::text as format,
      count(*)::int as total,
      count(ei.answered_at)::int as answered,
      count(*) filter (where ei.is_correct is true)::int as correct
    from public.exam_items ei join public.questions q on q.id=ei.question_id
    where ei.exam_id=p_exam_id group by q.format
  ) t;

  return jsonb_build_object('exam_id',p_exam_id,'total',v_total,
    'answered',v_answered,'correct',v_correct,
    'by_lesson',v_by_lesson,'by_difficulty',v_by_difficulty,
    'by_format',v_by_format);
end
$analysis$;
revoke all on function public.get_custom_exam_analysis(uuid) from public,anon;
grant execute on function public.get_custom_exam_analysis(uuid) to authenticated;
commit;
