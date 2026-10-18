-- TASK-215: resume unfinished, non-expired sessions; prevent repeat start duplicates.
-- Returns only the owner's original answers, never question keys or correctness.
begin;
create or replace function public.get_active_custom_exam(p_config jsonb default null)
returns jsonb language plpgsql security definer set search_path=''
as $resume$
declare
  v_user uuid := auth.uid();
  v_exam public.exams%rowtype;
  v_answers jsonb;
  v_answered_ids jsonb;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select e.* into v_exam from public.exams e
  where e.user_id=v_user and e.kind='custom'
    and e.finished_at is null
    and (p_config is null or e.selection_meta->'config'=p_config)
    and now() < case when e.duration_sec is null
      then e.started_at + interval '24 hours'
      else e.started_at + make_interval(secs=>e.duration_sec) end
  order by e.started_at desc limit 1;

  if not found then return null; end if;
  select coalesce(jsonb_object_agg(ei.question_id::text,ei.user_answer)
    filter (where ei.answered_at is not null),'{}'::jsonb),
    coalesce(jsonb_agg(ei.question_id) filter (where ei.answered_at is not null),'[]'::jsonb)
  into v_answers,v_answered_ids
  from public.exam_items ei where ei.exam_id=v_exam.id;
  return jsonb_build_object(
    'exam_id',v_exam.id,'kind','custom','duration_sec',v_exam.duration_sec,
    'started_at',v_exam.started_at,'selection_meta',v_exam.selection_meta,
    'items',public.exam_payload(v_exam.id),
    'saved_answers',v_answers,'answered_question_ids',v_answered_ids
  );
end
$resume$;
revoke all on function public.get_active_custom_exam(jsonb) from public,anon;
grant execute on function public.get_active_custom_exam(jsonb) to authenticated;

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
  v_construct uuid;
  v_diff int;
  v_n int;
  v_pick uuid[];
  v_ids uuid[] := '{}'::uuid[];
  v_exam uuid;
  v_duration int;
  v_meta jsonb;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  -- Serialize one owner's starts; duplicate POSTs never create a second active exam.
  perform pg_advisory_xact_lock(hashtextextended(v_user::text,213));
  v_meta := public.get_active_custom_exam(p_config);
  if v_meta is not null then return v_meta; end if;
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
    v_construct := nullif(v_topic->>'construct_id','')::uuid;
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
          and (v_construct is null or q.construct_id=v_construct)
          and q.difficulty=v_diff and q.format::text=any(v_formats)
          and q.status='published'::public.content_status
          and c.is_active and c.group_code=q.group_code
          and q.source_reference is not null
          and exists(select 1 from public.lesson_constructs lc
                     where lc.lesson_id=v_lesson and lc.construct_id=q.construct_id)
          and (
          (q.format='Y1'::public.question_format
            and (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')>=2
            and exists(select 1 from public.question_options o
                       where o.question_id=q.id and o.side='a'
                         and o.id::text=k.payload->>'correct_option_id'))
          or (q.format='Y2'::public.question_format
            and jsonb_typeof(k.payload->'pairs')='object'
            and exists(select 1 from public.question_options o where o.question_id=q.id and o.side='a')
            and exists(select 1 from public.question_options o where o.question_id=q.id and o.side='b'))
          or (q.format='Y3'::public.question_format
            and jsonb_typeof(k.payload->'order')='array'
            and (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')>=2)
        )
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
