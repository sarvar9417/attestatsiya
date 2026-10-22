-- Group Mock: pedagogy-only, 20 questions, 30 minute absolute timer.
-- Additive to existing spec/topics/manual modes and historical rooms.
begin;

alter table public.group_mock_rooms
  drop constraint if exists group_mock_rooms_mode_check;
alter table public.group_mock_rooms
  add constraint group_mock_rooms_mode_check
    check (mode in ('spec','topics','manual','pedagogy'));

alter table public.group_mock_rooms
  add column if not exists duration_minutes int,
  add column if not exists deadline_at timestamptz;

alter table public.group_mock_rooms
  add constraint group_mock_pedagogy_timing_check
    check (
      (mode='pedagogy' and total_count=20 and duration_minutes=30)
      or (mode<>'pedagogy' and duration_minutes is null)
    );

-- Called only from state RPC. Anonymous and learner direct invocation revoked.
-- The absolute time limit also applies when the host is offline.
create function public.group_mock_expire(p_room uuid)
returns void language plpgsql security definer set search_path=''
as $gm$
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  if not exists(select 1 from public.group_mock_members m
      where m.room_id=p_room and m.user_id=auth.uid())
  then raise exception 'group_not_member'; end if;
  update public.group_mock_rooms r
  set status='finished',finished_at=clock_timestamp(),
      paused_from_status=null,paused_at=null
  where r.id=p_room and r.mode='pedagogy'
    and r.status not in ('lobby','finished')
    and r.deadline_at is not null and r.deadline_at<=clock_timestamp();
end $gm$;

create or replace function public.group_mock_create(p_mode text, p_config jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $gm$
declare
  v_user uuid := auth.uid();
  v_ids uuid[] := '{}'::uuid[];
  v_pick uuid[];
  v_extra uuid[];
  v_bp public.blueprints%rowtype;
  v_cell record;
  v_topic jsonb;
  v_id_text text;
  v_lesson uuid;
  v_lessons uuid[] := '{}'::uuid[];
  v_diff int;
  v_need int;
  v_total int := 0;
  v_room uuid;
  v_code text;
  v_question uuid;
  v_idx int := 0;
begin
  if v_user is null then raise exception 'group_auth_required'; end if;
  if p_mode not in ('spec','topics','manual','pedagogy') or jsonb_typeof(p_config)<>'object'
  then raise exception 'group_invalid_input'; end if;
  if (select count(*) from public.group_mock_rooms r
      where r.owner_id=v_user and r.status <> 'finished') >= 5
  then raise exception 'group_too_many_rooms'; end if;

  if p_mode='spec' then
    select * into v_bp from public.blueprints where is_active order by version desc limit 1;
    if not found or v_bp.total_questions<>50 then raise exception 'group_blueprint_unavailable'; end if;
    if (select coalesce(sum(b.n_bilish+b.n_qollash+b.n_mulohaza),0)
        from public.blueprint_quotas b where b.blueprint_id=v_bp.id)<>v_bp.total_questions
    then raise exception 'group_blueprint_invalid'; end if;
    for v_cell in
      select b.group_code, c.cognitive, c.n
      from public.blueprint_quotas b
      cross join lateral (values
        ('bilish'::public.cognitive_level,b.n_bilish),
        ('qollash'::public.cognitive_level,b.n_qollash),
        ('mulohaza'::public.cognitive_level,b.n_mulohaza)
      ) c(cognitive,n)
      where b.blueprint_id=v_bp.id and c.n>0
      order by b.order_idx, c.cognitive
    loop
      -- SECURITY: the official eligibility helper is still applied to every
      -- selected question. Limit expensive validation to a shuffled candidate
      -- window before attempting an exhaustive fail-closed fallback.
      with sampled as materialized (
        select q.id from public.questions q
        where q.group_code=v_cell.group_code and q.cognitive=v_cell.cognitive
          and q.status='published'::public.content_status
          and not(q.id=any(v_ids))
        order by random() limit greatest(16, v_cell.n*8)
      )
      select coalesce(array_agg(s.id),'{}'::uuid[]) into v_pick
      from (
        select sampled.id from sampled
        where public.group_mock_eligible(sampled.id)
        limit v_cell.n
      ) s;
      if cardinality(v_pick)<v_cell.n then
        -- Scan the remaining published pool only if the bounded sample
        -- does not fill this quota; never falsely claim bank exhaustion.
        select coalesce(array_agg(s.id),'{}'::uuid[]) into v_extra from (
          select q.id from public.questions q
          where q.group_code=v_cell.group_code and q.cognitive=v_cell.cognitive
            and q.status='published'::public.content_status
            and not(q.id=any(v_ids || v_pick))
            and public.group_mock_eligible(q.id)
          order by random() limit v_cell.n-cardinality(v_pick)
        ) s;
        v_pick := v_pick || v_extra;
      end if;
      if cardinality(v_pick)<>v_cell.n then raise exception 'group_spec_pool_insufficient'; end if;
      v_ids := v_ids || v_pick;
    end loop;
    if cardinality(v_ids)<>v_bp.total_questions then raise exception 'group_blueprint_invalid'; end if;
    v_total := v_bp.total_questions;


  elsif p_mode='pedagogy' then
    -- Scale the official 15-question professional ratio (KS 5, PM.GEN 7,
    -- PM.MET 3) to 20 questions: KS 7, PM.GEN 9, PM.MET 4.
    if p_config->'total_count'<>'20'::jsonb
      or p_config->'duration_minutes'<>'30'::jsonb
    then raise exception 'group_invalid_input'; end if;
    for v_cell in
      select quota.group_code,quota.n
      from (values ('KS',7),('PM.GEN',9),('PM.MET',4)) as quota(group_code,n)
    loop
      with sampled as materialized (
        select q.id from public.questions q
        where q.group_code=v_cell.group_code
          and q.status='published'::public.content_status
          and not(q.id=any(v_ids))
        order by random() limit greatest(16,v_cell.n*8)
      )
      select coalesce(array_agg(p.id),'{}'::uuid[]) into v_pick
      from (
        select sampled.id from sampled
        where public.group_mock_eligible(sampled.id)
        limit v_cell.n
      ) p;
      if cardinality(v_pick)<v_cell.n then
        select coalesce(array_agg(p.id),'{}'::uuid[]) into v_extra
        from (
          select q.id from public.questions q
          where q.group_code=v_cell.group_code
            and q.status='published'::public.content_status
            and not(q.id=any(v_ids || v_pick))
            and public.group_mock_eligible(q.id)
          order by random() limit v_cell.n-cardinality(v_pick)
        ) p;
        v_pick := v_pick || v_extra;
      end if;
      if cardinality(v_pick)<>v_cell.n
      then raise exception 'group_pedagogy_pool_insufficient'; end if;
      v_ids := v_ids || v_pick;
    end loop;
    if cardinality(v_ids)<>20 then raise exception 'group_pedagogy_pool_insufficient'; end if;
    v_total := 20;

  elsif p_mode='topics' then
    if jsonb_typeof(p_config->'topics') <> 'array'
      or jsonb_array_length(p_config->'topics') not between 1 and 30
      or jsonb_typeof(p_config->'total_count') <> 'number'
    then raise exception 'group_invalid_input'; end if;
    for v_topic in select value from jsonb_array_elements(p_config->'topics')
    loop
      if jsonb_typeof(v_topic)<>'object' then raise exception 'group_invalid_input'; end if;
      v_lesson := (v_topic->>'lesson_id')::uuid;
      v_diff := (v_topic->>'difficulty')::int;
      v_need := (v_topic->>'count')::int;
      if v_lesson is null or v_lesson=any(v_lessons)
        or v_need is null or v_need not between 1 and 100
        or v_diff is null or v_diff not between 1 and 5
      then raise exception 'group_invalid_input'; end if;
      if not exists(select 1 from public.lessons l join public.modules m on m.id=l.module_id
        where l.id=v_lesson and l.status='published'::public.content_status
          and m.status='published'::public.content_status)
      then raise exception 'group_lesson_unavailable'; end if;
      v_lessons := v_lessons || v_lesson;
      v_total := v_total+v_need;
      if v_total>100 then raise exception 'group_invalid_input'; end if;
      with sampled as materialized (
        select q.id from public.questions q
        where q.source_lesson_id=v_lesson and q.difficulty=v_diff
          and q.status='published'::public.content_status
          and not(q.id=any(v_ids))
        order by random() limit greatest(16, v_need*5)
      )
      select coalesce(array_agg(s.id),'{}'::uuid[]) into v_pick from (
        select sampled.id from sampled
        where public.group_mock_eligible(sampled.id)
        limit v_need
      ) s;
      if cardinality(v_pick)<v_need then
        select coalesce(array_agg(s.id),'{}'::uuid[]) into v_extra from (
          select q.id from public.questions q
          where q.source_lesson_id=v_lesson and q.difficulty=v_diff
            and q.status='published'::public.content_status
            and not(q.id=any(v_ids || v_pick))
            and public.group_mock_eligible(q.id)
          order by random() limit v_need-cardinality(v_pick)
        ) s;
        v_pick := v_pick || v_extra;
      end if;
      if cardinality(v_pick)<>v_need then raise exception 'group_topic_pool_insufficient'; end if;
      v_ids := v_ids || v_pick;
    end loop;
    if v_total<>(p_config->>'total_count')::int then raise exception 'group_invalid_input'; end if;

  else
    if jsonb_typeof(p_config->'question_ids')<>'array'
      or jsonb_array_length(p_config->'question_ids') not between 1 and 100
    then raise exception 'group_invalid_input'; end if;
    for v_id_text in select value from jsonb_array_elements_text(p_config->'question_ids')
    loop
      v_question := v_id_text::uuid;
      if v_question=any(v_ids) or not public.group_mock_eligible(v_question)
      then raise exception 'group_question_unavailable'; end if;
      v_ids := v_ids || v_question;
    end loop;
    v_total := cardinality(v_ids);
  end if;

  -- Unique, non-sequential invite code. The database unique key protects races.
  for v_idx in 1..10 loop
    v_code := upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
    exit when not exists(select 1 from public.group_mock_rooms where code=v_code);
  end loop;
  if exists(select 1 from public.group_mock_rooms where code=v_code)
  then raise exception 'group_code_unavailable'; end if;

  insert into public.group_mock_rooms(code,owner_id,mode,total_count,duration_minutes)
    values(v_code,v_user,p_mode,v_total,case when p_mode='pedagogy' then 30 else null end) returning id into v_room;
  insert into public.group_mock_members(room_id,user_id) values(v_room,v_user);

  insert into public.group_mock_items(room_id,idx,question_id,payload,answer_key,explanation_md)
  select v_room, picked.ordinality::int, q.id,
    jsonb_build_object(
      'item_id',gen_random_uuid(),
      'order_idx',picked.ordinality,
      'question_id',q.id,
      'format',q.format,
      'stem_md',q.stem_md,
      'assets',coalesce(q.assets,'[]'::jsonb),
      'options',coalesce((
        select jsonb_agg(jsonb_build_object(
          'id',o.id,'side',o.side,'content_md',o.content_md
        ) order by o.side, random())
        from public.question_options o where o.question_id=q.id
      ),'[]'::jsonb)
    ),
    k.payload,
    k.explanation_md
  from unnest(v_ids) with ordinality as picked(qid,ordinality)
  join public.questions q on q.id=picked.qid
  join public.question_keys k on k.question_id=q.id;

  if (select count(*) from public.group_mock_items where room_id=v_room)<>v_total
  then raise exception 'group_question_snapshot_failed'; end if;
  return jsonb_build_object('room_id',v_room,'code',v_code);
end $gm$;

create function public.group_mock_start(p_room uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $gm$
declare v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid() then raise exception 'group_not_host'; end if;
  if v_room.status<>'lobby' then raise exception 'group_invalid_stage'; end if;
  update public.group_mock_rooms set status='question',started_at=now(),
    deadline_at=case when v_room.mode='pedagogy' then clock_timestamp()+interval '30 minutes' else null end
  where id=p_room;
  return jsonb_build_object('ok',true);
end $gm$;

create or replace function public.group_mock_state(p_room uuid)
returns jsonb language plpgsql volatile security definer set search_path = ''
as $gm$
declare
  v_user uuid := auth.uid();
  v_room public.group_mock_rooms%rowtype;
  v_item public.group_mock_items%rowtype;
  v_members jsonb;
  v_messages jsonb;
  v_answers jsonb := '[]'::jsonb;
  v_answer jsonb;
  v_count int;
begin
  if v_user is null then raise exception 'group_auth_required'; end if;
  perform public.group_mock_expire(p_room);
  select * into v_room from public.group_mock_rooms where id=p_room;
  if not found or not exists(select 1 from public.group_mock_members m
     where m.room_id=p_room and m.user_id=v_user)
  then raise exception 'group_not_member'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
      'user_id',m.user_id,
      'name',coalesce(nullif(p.display_name,''),'Ishtirokchi'),
      'score',2*(select count(*) from public.group_mock_answers a
        where a.room_id=m.room_id and a.user_id=m.user_id and a.is_correct
          and (a.idx<v_room.current_idx or v_room.status in ('reveal','finished')
            or (v_room.status='paused' and v_room.paused_from_status='reveal'))),
      'has_answered',exists(select 1 from public.group_mock_answers a
        where a.room_id=p_room and a.idx=v_room.current_idx and a.user_id=m.user_id)
    ) order by m.joined_at),'[]'::jsonb)
  into v_members from public.group_mock_members m
  left join public.profiles p on p.id=m.user_id where m.room_id=p_room;

  select coalesce(jsonb_agg(last_messages.x order by last_messages.created_at),'[]'::jsonb) into v_messages
  from (select m.created_at, jsonb_build_object(
      'id',m.id,'user_id',m.user_id,
      'name',coalesce(nullif(p.display_name,''),'Ishtirokchi'),
      'body',m.body,'created_at',m.created_at
    ) x from public.group_mock_messages m
    left join public.profiles p on p.id=m.user_id
    where m.room_id=p_room order by m.created_at desc limit 60
  ) last_messages;

  if v_room.status<>'lobby' then
    select * into v_item from public.group_mock_items
    where room_id=p_room and idx=v_room.current_idx;
    select answer into v_answer from public.group_mock_answers
    where room_id=p_room and idx=v_room.current_idx and user_id=v_user;
    select count(*) into v_count from public.group_mock_answers
    where room_id=p_room and idx=v_room.current_idx;

    if v_room.status in ('reveal','finished') then
      select coalesce(jsonb_agg(jsonb_build_object(
        'user_id',m.user_id,
        'name',coalesce(nullif(p.display_name,''),'Ishtirokchi'),
        'answer',a.answer,
        'is_correct',a.is_correct
      ) order by m.joined_at),'[]'::jsonb)
      into v_answers from public.group_mock_members m
      left join public.group_mock_answers a
        on a.room_id=m.room_id and a.user_id=m.user_id and a.idx=v_room.current_idx
      left join public.profiles p on p.id=m.user_id
      where m.room_id=p_room;
    end if;
  end if;

  return jsonb_build_object(
    'room_id',v_room.id, 'code',v_room.code,
    'mode',v_room.mode, 'status',v_room.status,
    'is_host',v_room.owner_id=v_user,
    'total_count',v_room.total_count,'current_idx',v_room.current_idx,
    'paused_from_status',v_room.paused_from_status,
    'duration_minutes',v_room.duration_minutes,
    'deadline_at',v_room.deadline_at,
    'members',v_members,'messages',v_messages,
    'question',case when v_room.status='lobby' or
      (v_room.status='paused' and v_room.paused_from_status='lobby')
      then null else v_item.payload end,
    'my_answer',v_answer,'answered_count',coalesce(v_count,0),
    'answers',v_answers,
    'correct_answer',case when v_room.status in ('reveal','finished')
       then v_item.answer_key else null end,
    'explanation_md',case when v_room.status in ('reveal','finished')
       then v_item.explanation_md else null end
  );
end $gm$;

create function public.group_mock_answer(p_room uuid, p_answer jsonb)
returns jsonb language plpgsql security definer set search_path = ''
as $gm$
declare
  v_room public.group_mock_rooms%rowtype;
  v_item public.group_mock_items%rowtype;
  v_user uuid := auth.uid();
  v_format text;
  v_count int;
  v_correct boolean;
  v_existing jsonb;
begin
  if v_user is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found then raise exception 'group_answer_closed'; end if;
  if not exists(select 1 from public.group_mock_members m
     where m.room_id=p_room and m.user_id=v_user)
  then raise exception 'group_not_member'; end if;
  -- An answer at or after the absolute deadline never counts.
  -- Return (instead of raising) so the finish transition commits.
  if v_room.mode='pedagogy' and v_room.status not in ('lobby','finished')
     and v_room.deadline_at is not null and v_room.deadline_at<=clock_timestamp() then
    update public.group_mock_rooms set status='finished',finished_at=clock_timestamp(),
      paused_from_status=null,paused_at=null where id=p_room;
    return jsonb_build_object('saved',false,'expired',true);
  end if;
  select a.answer into v_existing from public.group_mock_answers a
  where a.room_id=p_room and a.idx=v_room.current_idx and a.user_id=v_user;
  if found then
    if v_existing = p_answer then
      return jsonb_build_object('saved',true,'already_answered',true);
    end if;
    raise exception 'group_already_answered';
  end if;
  if v_room.status<>'question' then raise exception 'group_answer_closed'; end if;
  select * into v_item from public.group_mock_items
   where room_id=p_room and idx=v_room.current_idx;
  v_format := v_item.payload->>'format';
  if jsonb_typeof(p_answer)<>'object' then raise exception 'group_invalid_answer'; end if;

  if v_format='Y1' then
    if jsonb_typeof(p_answer->'option_id')<>'string' or
       not exists(select 1 from public.question_options o
                  where o.question_id=v_item.question_id and o.side='a'
                    and o.id::text=p_answer->>'option_id')
    then raise exception 'group_invalid_answer'; end if;
    v_correct := p_answer->>'option_id' = v_item.answer_key->>'correct_option_id';

  elsif v_format='Y2' then
    if jsonb_typeof(p_answer->'pairs')<>'object'
      or (select count(*) from jsonb_object_keys(p_answer->'pairs'))
        <> (select count(*) from public.question_options o
            where o.question_id=v_item.question_id and o.side='a')
      or exists (
        select 1 from jsonb_each_text(p_answer->'pairs') pair
        where not exists(select 1 from public.question_options o
             where o.question_id=v_item.question_id and o.side='a' and o.id::text=pair.key)
           or not exists(select 1 from public.question_options o
             where o.question_id=v_item.question_id and o.side='b' and o.id::text=pair.value)
      )
      or (select count(distinct value) from jsonb_each_text(p_answer->'pairs'))
         <> (select count(*) from jsonb_object_keys(p_answer->'pairs'))
    then raise exception 'group_invalid_answer'; end if;
    v_correct := p_answer->'pairs' = v_item.answer_key->'pairs';

  elsif v_format='Y3' then
    if jsonb_typeof(p_answer->'order')<>'array'
      or jsonb_array_length(p_answer->'order')
          <> (select count(*) from public.question_options o
              where o.question_id=v_item.question_id and o.side='a')
      or (select count(distinct value) from jsonb_array_elements_text(p_answer->'order'))
          <> jsonb_array_length(p_answer->'order')
      or exists (
        select 1 from jsonb_array_elements_text(p_answer->'order') a(value)
        where not exists(select 1 from public.question_options o
          where o.question_id=v_item.question_id and o.side='a' and o.id::text=a.value)
      )
    then raise exception 'group_invalid_answer'; end if;
    v_correct := p_answer->'order' = v_item.answer_key->'order';

  else raise exception 'group_invalid_question'; end if;

  insert into public.group_mock_answers(room_id,idx,user_id,answer,is_correct)
  values(p_room,v_room.current_idx,v_user,p_answer,coalesce(v_correct,false));

  -- The row lock serializes simultaneous final answers. No uncommitted
  -- count or answer key can be observed by other members.
  if (select count(*) from public.group_mock_answers a
      where a.room_id=p_room and a.idx=v_room.current_idx)
     = (select count(*) from public.group_mock_members m where m.room_id=p_room)
  then update public.group_mock_rooms set status='reveal' where id=p_room; end if;
  return jsonb_build_object('saved',true);
end $gm$;

create function public.group_mock_step(p_room uuid, p_action text)
returns jsonb language plpgsql security definer set search_path = ''
as $gm$
declare v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid() then raise exception 'group_not_host'; end if;
  if v_room.mode='pedagogy' and v_room.status not in ('lobby','finished')
     and v_room.deadline_at is not null and v_room.deadline_at<=clock_timestamp() then
    update public.group_mock_rooms set status='finished',finished_at=clock_timestamp(),
      paused_from_status=null,paused_at=null where id=p_room;
    return jsonb_build_object('ok',true,'expired',true);
  end if;
  if p_action='reveal' and v_room.status='question' then
    update public.group_mock_rooms set status='reveal' where id=p_room;
  elsif p_action='next' and v_room.status='reveal' then
    if v_room.current_idx=v_room.total_count then
      update public.group_mock_rooms set status='finished',finished_at=now() where id=p_room;
    else
      update public.group_mock_rooms set status='question',current_idx=current_idx+1 where id=p_room;
    end if;
  else raise exception 'group_invalid_stage'; end if;
  return jsonb_build_object('ok',true);
end $gm$;

create function public.group_mock_pause(p_room uuid)
returns jsonb language plpgsql security definer set search_path=''
as $gm$
declare
  v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid() then raise exception 'group_not_host'; end if;
  -- Timed pedagogy rooms run for 30 wall-clock minutes after start.
  if v_room.mode='pedagogy' and v_room.status<>'lobby' then
    raise exception 'group_pedagogy_pause_unavailable';
  end if;
  if v_room.status not in ('lobby','question','reveal') then
    raise exception 'group_invalid_stage';
  end if;
  update public.group_mock_rooms
  set paused_from_status=v_room.status, paused_at=now(), status='paused'
  where id=p_room;
  return jsonb_build_object('ok',true);
end $gm$;

revoke all on function public.group_mock_expire(uuid) from public,anon,authenticated;
revoke all on function public.group_mock_create(text,jsonb),
  public.group_mock_start(uuid),public.group_mock_state(uuid),
  public.group_mock_answer(uuid,jsonb),public.group_mock_step(uuid,text),
  public.group_mock_pause(uuid) from public,anon;
grant execute on function public.group_mock_create(text,jsonb),
  public.group_mock_start(uuid),public.group_mock_state(uuid),
  public.group_mock_answer(uuid,jsonb),public.group_mock_step(uuid,text),
  public.group_mock_pause(uuid) to authenticated;
commit;
