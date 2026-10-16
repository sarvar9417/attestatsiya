-- Diverse professional practice: cover 5 different KS, 7 different PM.GEN,
-- 3 different PM.MET constructs per attempt. Source links and keys still required.
-- TASK-201: rotate unseen constructs and randomize ties so users do not share a fixed first form.
begin;
create or replace function public.generate_professional_practice_15()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_blueprint public.blueprints%rowtype;
  v_group record;
  v_exam uuid;
  v_ids uuid[] := '{}'::uuid[];
  v_pick uuid[];
  v_available int;
  v_group_coverage jsonb := '[]'::jsonb;
  v_meta jsonb;
  v_duration int := 1800;
begin
  if v_user is null then
    raise exception 'auth_required';
  end if;

  select * into v_blueprint
    from public.blueprints
   where is_active
   order by version desc
   limit 1;
  if not found then
    raise exception 'blueprint_topilmadi';
  end if;

  -- Each cell maps exactly to 2026 specification rows and slots 36-50.
  for v_group in
    select * from (values ('KS'::text, 5), ('PM.GEN'::text, 7), ('PM.MET'::text, 3)) as t(group_code, required)
  loop
    -- Verify published taxonomy, source trace, 4 Y1 choices and valid answer key.
    select count(distinct q.construct_id) into v_available
      from public.questions q
      join public.constructs c on c.id = q.construct_id
      join public.question_keys k on k.question_id = q.id
     where q.group_code = v_group.group_code
       and c.group_code = v_group.group_code
       and c.is_active
       and q.status = 'published'::public.content_status
       and q.format = 'Y1'::public.question_format
       and q.source_reference is not null
       and q.source_lesson_id is not null
       and exists(select 1 from public.lesson_constructs lc
         where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id)
       and (select count(*) from public.question_options o where o.question_id=q.id and o.side='a') = 4
       and exists (
         select 1 from public.question_options o
         where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id'
       );

    if v_available < v_group.required then
      raise exception 'professional_15_pool_insufficient: group=% required=% available=%',
        v_group.group_code, v_group.required, v_available;
    end if;

    -- One question per construct per 15-item practice. Rotate constructs with
    -- the fewest prior appearances for this user, then select their least-seen item.
    with eligible as (
      select q.id, q.construct_id,
        (select count(*)
           from public.exam_items ei
           join public.exams e on e.id=ei.exam_id
           join public.questions oldq on oldq.id=ei.question_id
          where e.user_id=v_user
            and e.kind='pedagogik_15'::public.exam_kind
            and oldq.construct_id=q.construct_id) as construct_exposure_count,
        (select count(*)
           from public.exam_items ei
           join public.exams e on e.id=ei.exam_id
          where ei.question_id=q.id and e.user_id=v_user) as question_exposure_count,
        (select max(e.started_at)
           from public.exam_items ei
           join public.exams e on e.id=ei.exam_id
          where ei.question_id=q.id and e.user_id=v_user) as last_seen
      from public.questions q
      join public.constructs c on c.id=q.construct_id
      join public.question_keys k on k.question_id=q.id
      where q.group_code=v_group.group_code
        and c.group_code=v_group.group_code
        and c.is_active
        and q.status='published'::public.content_status
        and q.format='Y1'::public.question_format
        and q.source_reference is not null
        and q.source_lesson_id is not null
        and exists (
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
        )
        and (select count(*) from public.question_options o
             where o.question_id=q.id and o.side='a')=4
        and exists (select 1 from public.question_options o
                    where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id')
        and not (q.id=any(v_ids))
    ), per_construct as (
      select id, construct_id, construct_exposure_count,
             question_exposure_count, last_seen,
        row_number() over (
          partition by construct_id
          order by question_exposure_count, last_seen nulls first, random(), id
        ) as choice_rank
      from eligible
    ), chosen as (
      select id, construct_exposure_count, question_exposure_count, last_seen
      from per_construct
      where choice_rank=1
      order by construct_exposure_count, question_exposure_count,
               last_seen nulls first, random(), id
      limit v_group.required
    )
    select coalesce(array_agg(id order by construct_exposure_count,
      question_exposure_count, last_seen nulls first, id),'{}'::uuid[])
      into v_pick
    from chosen;

    if cardinality(v_pick) <> v_group.required then
      raise exception 'professional_15_pool_insufficient: group=%', v_group.group_code;
    end if;
    v_ids := v_ids || v_pick;
    v_group_coverage := v_group_coverage || jsonb_build_array(
      jsonb_build_object('group_code', v_group.group_code, 'required', v_group.required, 'selected', cardinality(v_pick))
    );
  end loop;

  if cardinality(v_ids) <> 15 or
    (select count(distinct id) from unnest(v_ids) as t(id)) <> 15 then
    raise exception 'professional_15_blueprint_invalid';
  end if;

  v_meta := jsonb_build_object(
    'selector_version', 'professional-15-v3-diverse-random-ties',
    'specification', '2026',
    'test_range', '36-50',
    'group_coverage', v_group_coverage,
    'construct_strategy', 'one_construct_per_slot_fair_exposure_random_tiebreak',
    'target_count', 15,
    'practice_duration_sec', v_duration,
    'note', '30-minute practice timer, not official full-exam timing'
  );

  insert into public.exams (user_id, kind, blueprint_id, duration_sec, selection_meta)
  values (v_user, 'pedagogik_15'::public.exam_kind, v_blueprint.id, v_duration, v_meta)
  returning id into v_exam;

  perform public.attach_questions(v_exam, v_ids);

  update public.exam_items ei
     set option_order = (
       select array_agg(o.id order by random())
       from public.question_options o
       where o.question_id=ei.question_id
     )
   where ei.exam_id=v_exam;

  return jsonb_build_object(
    'exam_id', v_exam,
    'kind', 'pedagogik_15',
    'duration_sec', v_duration,
    'started_at', (select started_at from public.exams where id=v_exam),
    'items', public.exam_payload(v_exam),
    'selection_meta', v_meta
  );
end
$fn$;

revoke all on function public.generate_professional_practice_15() from public, anon;
grant execute on function public.generate_professional_practice_15() to authenticated;

commit;
