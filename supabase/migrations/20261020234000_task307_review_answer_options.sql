-- TASK-307: Finished-exam review needs the same per-attempt option order,
-- corrected Y2 sides and allowlisted assets as the original learner exam.
-- Never reveal keys through exam_payload: access is gated before this call.
begin;

create or replace function public.get_review(p_exam_id uuid)
returns jsonb
language plpgsql
security definer set search_path = ''
as $function$
declare
  v_user uuid := auth.uid();
  v_finished boolean;
  v_items jsonb;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select (e.finished_at is not null)
    into v_finished
  from public.exams e
  where e.id = p_exam_id and e.user_id = v_user;

  if v_finished is null then
    raise exception 'sinov_topilmadi';
  end if;
  if not v_finished then
    raise exception 'sinov_tugamagan';
  end if;

  -- exam_payload already respects exam_items.option_order and fixes verified
  -- legacy Y2 a/b ordering. Call only AFTER the owner/finalized checks above.
  with attempt_payload as materialized (
    select coalesce(public.exam_payload(p_exam_id), '[]'::jsonb) as items
  ), visible_options as (
    select (entry.item->>'order_idx')::int as order_idx,
           coalesce(entry.item->'options', '[]'::jsonb) as options
    from attempt_payload payload
    cross join lateral jsonb_array_elements(payload.items) as entry(item)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'order_idx', ei.order_idx,
    'stem_md', q.stem_md,
    'format', q.format,
    'assets', coalesce(q.assets, '[]'::jsonb),
    'options', coalesce(vo.options, '[]'::jsonb),
    'construct', c.title_uz,
    'construct_slug', c.slug,
    'user_answer', ei.user_answer,
    'is_correct', ei.is_correct,
    'key', k.payload,
    'explanation_md', k.explanation_md
  ) order by ei.order_idx), '[]'::jsonb)
  into v_items
  from public.exam_items ei
  join public.questions q on q.id = ei.question_id
  join public.constructs c on c.id = ei.construct_id
  join public.question_keys k on k.question_id = q.id
  left join visible_options vo on vo.order_idx = ei.order_idx
  where ei.exam_id = p_exam_id;

  return v_items;
end;
$function$;

-- Do not reopen keys to anon or unrestricted PUBLIC.
revoke all on function public.get_review(uuid) from public, anon, authenticated;
grant execute on function public.get_review(uuid) to authenticated;

commit;
