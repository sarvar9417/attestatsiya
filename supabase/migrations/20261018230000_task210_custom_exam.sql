-- TASK-210 universal custom tests: all-or-nothing, server-authoritative generator.
-- Does not alter the official 50/120 blueprint or existing topic exam generator.
begin;
alter type public.exam_kind add value if not exists 'custom';
commit;

begin;
create or replace function public.custom_exam_preflight(p_config jsonb)
returns jsonb
language plpgsql security definer set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_topic jsonb;
  v_level jsonb;
  v_formats text[];
  v_exposure text;
  v_total int;
  v_topic_total int;
  v_level_total int;
  v_diff int;
  v_n int;
  v_avail int;
  v_sum int := 0;
  v_distinct_lesson uuid[] := '{}'::uuid[];
  v_distinct_diff int[];
  v_id uuid;
  v_gaps jsonb := '[]'::jsonb;
  v_slots jsonb := '[]'::jsonb;
  v_available int := 0;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  if p_config is null or jsonb_typeof(p_config) <> 'object' then
    raise exception 'custom_config_invalid';
  end if;
  if jsonb_typeof(p_config->'topics') <> 'array'
     or jsonb_array_length(p_config->'topics') not between 1 and 30
     or jsonb_typeof(p_config->'formats') <> 'array'
     or jsonb_array_length(p_config->'formats') not between 1 and 3 then
    raise exception 'custom_config_invalid';
  end if;
  v_total := (p_config->>'total_count')::int;
  if v_total not between 1 and 100 then raise exception 'custom_config_invalid'; end if;
  v_exposure := p_config->>'exposure';
  if v_exposure not in ('all','unseen','incorrect') then raise exception 'custom_config_invalid'; end if;
  if p_config->>'mode' not in ('exam','learning','diagnostic','mistakes') then
    raise exception 'custom_config_invalid';
  end if;
  if p_config->'duration_sec' <> 'null'::jsonb then
    if (p_config->>'duration_sec')::int not between 60 and 14400 then
      raise exception 'custom_config_invalid';
    end if;
  end if;
  select array_agg(f.value) into v_formats
  from jsonb_array_elements_text(p_config->'formats') f(value);
  if v_formats is null
     or cardinality(v_formats) <> (select count(distinct x) from unnest(v_formats) x)
     or exists (select 1 from unnest(v_formats) f where f not in ('Y1','Y2','Y3')) then
    raise exception 'custom_config_invalid';
  end if;

  for v_topic in select value from jsonb_array_elements(p_config->'topics')
  loop
    if jsonb_typeof(v_topic) <> 'object' then raise exception 'custom_config_invalid'; end if;
    v_id := (v_topic->>'lesson_id')::uuid;
    v_topic_total := (v_topic->>'count')::int;
    if v_id is null or v_id = any(v_distinct_lesson) or v_topic_total not between 1 and 100 then
      raise exception 'custom_config_invalid';
    end if;
    v_distinct_lesson := array_append(v_distinct_lesson,v_id);
    if not exists(
      select 1 from public.lessons l join public.modules m on m.id=l.module_id
      where l.id=v_id and l.status='published'::public.content_status
        and m.status='published'::public.content_status
    ) then raise exception 'custom_lesson_unavailable'; end if;
    if jsonb_typeof(v_topic->'difficulty_counts') <> 'array'
      or jsonb_array_length(v_topic->'difficulty_counts') not between 1 and 5 then
      raise exception 'custom_config_invalid';
    end if;
    v_level_total := 0;
    v_distinct_diff := '{}'::int[];
    for v_level in select value from jsonb_array_elements(v_topic->'difficulty_counts')
    loop
      v_diff := (v_level->>'difficulty')::int;
      v_n := (v_level->>'count')::int;
      if v_diff not between 1 and 5 or v_diff = any(v_distinct_diff)
         or v_n not between 1 and 100 then
        raise exception 'custom_config_invalid';
      end if;
      v_distinct_diff := array_append(v_distinct_diff,v_diff);
      v_level_total := v_level_total + v_n;
      select count(*) into v_avail
      from public.questions q
      join public.constructs c on c.id=q.construct_id
      join public.question_keys k on k.question_id=q.id
      where q.source_lesson_id=v_id
        and q.status='published'::public.content_status
        and q.difficulty=v_diff
        and q.format::text=any(v_formats)
        and c.is_active and c.group_code=q.group_code
        and q.source_reference is not null
        and exists(select 1 from public.lesson_constructs lc
                   where lc.lesson_id=v_id and lc.construct_id=q.construct_id)
        and exists(select 1 from public.question_options o where o.question_id=q.id)
        and (
          v_exposure='all'
          or (v_exposure='unseen' and not exists(
            select 1 from public.exam_items ei join public.exams e on e.id=ei.exam_id
            where e.user_id=v_user and ei.question_id=q.id
          ))
          or (v_exposure='incorrect' and exists(
            select 1 from public.exam_items ei join public.exams e on e.id=ei.exam_id
            where e.user_id=v_user and e.finished_at is not null
              and ei.question_id=q.id and ei.is_correct=false
          ))
        );
      v_available := v_available + least(v_avail,v_n);
      v_slots := v_slots || jsonb_build_array(jsonb_build_object(
        'lesson_id',v_id,'difficulty',v_diff,'requested',v_n,'available',v_avail
      ));
      if v_avail < v_n then
        v_gaps := v_gaps || jsonb_build_array(jsonb_build_object(
          'lesson_id',v_id,'difficulty',v_diff,'requested',v_n,'available',v_avail
        ));
      end if;
    end loop;
    if v_level_total <> v_topic_total then raise exception 'custom_config_invalid'; end if;
    v_sum := v_sum + v_topic_total;
  end loop;
  if v_sum <> v_total then raise exception 'custom_config_invalid'; end if;
  return jsonb_build_object(
    'ready',jsonb_array_length(v_gaps)=0,'requested',v_total,
    'available',v_available,'gaps',v_gaps,'slots',v_slots
  );
end
$fn$;

create or replace function public.generate_custom_exam(p_config jsonb)
returns jsonb
language plpgsql security definer set search_path = ''
as $fn$
declare
  v_user uuid := auth.uid();
  v_preview jsonb;
  v_formats text[];
  v_exposure text := p_config->>'exposure';
  v_topic jsonb;
  v_level jsonb;
  v_lesson uuid;
  v_diff int;
  v_n int;
  v_pick uuid[];
  v_ids uuid[] := '{}'::uuid[];
  v_exam uuid;
  v_duration int;
  v_meta jsonb;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  -- Validates independent DB callers as well as Fastify/Zod.
  v_preview := public.custom_exam_preflight(p_config);
  if v_preview->>'ready' <> 'true' then
    raise exception 'custom_pool_insufficient';
  end if;
  select array_agg(x.value) into v_formats
  from jsonb_array_elements_text(p_config->'formats') x(value);
  v_duration := (p_config->>'duration_sec')::int;
  for v_topic in select value from jsonb_array_elements(p_config->'topics')
  loop
    v_lesson := (v_topic->>'lesson_id')::uuid;
    for v_level in select value from jsonb_array_elements(v_topic->'difficulty_counts')
    loop
      v_diff := (v_level->>'difficulty')::int;
      v_n := (v_level->>'count')::int;
      select coalesce(array_agg(question_id order by exposure_count,last_seen nulls first,question_id),'{}'::uuid[])
        into v_pick
      from (
        select q.id question_id,
          (select count(*) from public.exam_items ei
           join public.exams e on e.id=ei.exam_id
           where e.user_id=v_user and ei.question_id=q.id) exposure_count,
          (select max(e.started_at) from public.exam_items ei
           join public.exams e on e.id=ei.exam_id
           where e.user_id=v_user and ei.question_id=q.id) last_seen
        from public.questions q
        join public.constructs c on c.id=q.construct_id
        join public.question_keys k on k.question_id=q.id
        where q.source_lesson_id=v_lesson
          and q.difficulty=v_diff and q.format::text=any(v_formats)
          and q.status='published'::public.content_status
          and c.is_active and c.group_code=q.group_code
          and q.source_reference is not null
          and exists(select 1 from public.lesson_constructs lc
                     where lc.lesson_id=v_lesson and lc.construct_id=q.construct_id)
          and exists(select 1 from public.question_options o where o.question_id=q.id)
          and not(q.id=any(v_ids))
          and (
            v_exposure='all'
            or (v_exposure='unseen' and not exists(
              select 1 from public.exam_items ei join public.exams e on e.id=ei.exam_id
              where e.user_id=v_user and ei.question_id=q.id))
            or (v_exposure='incorrect' and exists(
              select 1 from public.exam_items ei join public.exams e on e.id=ei.exam_id
              where e.user_id=v_user and e.finished_at is not null
                and ei.question_id=q.id and ei.is_correct=false))
          )
        order by exposure_count,last_seen nulls first,q.id
        limit v_n
      ) ranked;
      if cardinality(v_pick) <> v_n then
        raise exception 'custom_pool_insufficient';
      end if;
      v_ids := v_ids || v_pick;
    end loop;
  end loop;
  if cardinality(v_ids) <> (p_config->>'total_count')::int
     or (select count(distinct id) from unnest(v_ids) x(id)) <> cardinality(v_ids)
  then raise exception 'custom_selection_invalid'; end if;
  select coalesce(array_agg(question_id order by random()),'{}'::uuid[])
  into v_ids from unnest(v_ids) x(question_id);
  v_meta := jsonb_build_object('selector_version','custom-builder-v1','config',p_config,
    'target_count',cardinality(v_ids),'note','Personal practice; not an official exam');
  insert into public.exams(user_id,kind,duration_sec,selection_meta)
  values(v_user,'custom'::public.exam_kind,v_duration,v_meta)
  returning id into v_exam;
  perform public.attach_questions(v_exam,v_ids);
  update public.exam_items ei
  set option_order=(
    select array_agg(o.id order by o.side,random())
    from public.question_options o where o.question_id=ei.question_id
  ) where ei.exam_id=v_exam;
  return jsonb_build_object(
    'exam_id',v_exam,'kind','custom','duration_sec',v_duration,
    'started_at',(select started_at from public.exams where id=v_exam),
    'items',public.exam_payload(v_exam),'selection_meta',v_meta
  );
end
$fn$;

-- Both RPCs require an authenticated user; anonymous calls are denied even
-- though the first function only returns aggregate counts.
revoke all on function public.custom_exam_preflight(jsonb) from public,anon;
revoke all on function public.generate_custom_exam(jsonb) from public,anon;
grant execute on function public.custom_exam_preflight(jsonb) to authenticated;
grant execute on function public.generate_custom_exam(jsonb) to authenticated;
commit;
