-- TASK-351: resumable group rooms and final member-only comprehensive report.
-- Additive, keeps question/answer tables private and keys withheld until finish.
begin;

alter table public.group_mock_rooms
  add column if not exists paused_from_status text,
  add column if not exists paused_at timestamptz;

alter table public.group_mock_rooms drop constraint if exists group_mock_rooms_status_check;
alter table public.group_mock_rooms add constraint group_mock_rooms_status_check
  check (status in ('lobby','question','reveal','paused','finished'));

alter table public.group_mock_rooms add constraint group_mock_rooms_pause_consistency
  check (
    (status='paused' and paused_from_status is not null
      and paused_from_status in ('lobby','question','reveal') and paused_at is not null)
    or
    (status<>'paused' and paused_from_status is null and paused_at is null)
  );

-- Only the host may pause an unfinished room. The persisted stage and
-- answered rows are preserved; no progress can advance while paused.
create function public.group_mock_pause(p_room uuid)
returns jsonb language plpgsql security definer set search_path=''
as $gm$
declare
  v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid() then raise exception 'group_not_host'; end if;
  if v_room.status not in ('lobby','question','reveal') then
    raise exception 'group_invalid_stage';
  end if;
  update public.group_mock_rooms
  set paused_from_status=v_room.status, paused_at=now(), status='paused'
  where id=p_room;
  return jsonb_build_object('ok',true);
end $gm$;

create function public.group_mock_resume(p_room uuid)
returns jsonb language plpgsql security definer set search_path=''
as $gm$
declare
  v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid() then raise exception 'group_not_host'; end if;
  if v_room.status<>'paused' or v_room.paused_from_status not in ('lobby','question','reveal')
  then raise exception 'group_invalid_stage'; end if;
  update public.group_mock_rooms
  set status=v_room.paused_from_status, paused_from_status=null, paused_at=null
  where id=p_room;
  return jsonb_build_object('ok',true);
end $gm$;

create or replace function public.group_mock_state(p_room uuid)
returns jsonb language plpgsql stable security definer set search_path = ''
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

-- Entire report becomes available only when the room is finished.
-- Answers and correct keys are never returned while the test is running
-- or paused. Only existing participants can read this report.
create function public.group_mock_report(p_room uuid)
returns jsonb language plpgsql stable security definer set search_path=''
as $gm$
declare
  v_room public.group_mock_rooms%rowtype;
  v_user uuid := auth.uid();
  v_people jsonb;
  v_questions jsonb;
  v_members int;
begin
  if v_user is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room;
  if not found or not exists (
    select 1 from public.group_mock_members m
    where m.room_id=p_room and m.user_id=v_user
  ) then raise exception 'group_not_member'; end if;
  if v_room.status<>'finished' then raise exception 'group_report_unavailable'; end if;

  select count(*) into v_members from public.group_mock_members m where m.room_id=p_room;
  select coalesce(jsonb_agg(to_jsonb(t) order by t.score desc,t.name,t.user_id),'[]'::jsonb)
  into v_people
  from (
    select
      m.user_id,
      coalesce(nullif(p.display_name,''),'Ishtirokchi') as name,
      (select count(*)::int from public.group_mock_answers a
       where a.room_id=p_room and a.user_id=m.user_id) as answered,
      (select count(*)::int from public.group_mock_answers a
       where a.room_id=p_room and a.user_id=m.user_id and a.is_correct) as correct,
      (select count(*)::int from public.group_mock_answers a
       where a.room_id=p_room and a.user_id=m.user_id and not a.is_correct) as incorrect,
      (v_room.total_count - (select count(*)::int from public.group_mock_answers a
       where a.room_id=p_room and a.user_id=m.user_id)) as unanswered,
      2*(select count(*)::int from public.group_mock_answers a
       where a.room_id=p_room and a.user_id=m.user_id and a.is_correct) as score,
      round(100.0*(select count(*) from public.group_mock_answers a
       where a.room_id=p_room and a.user_id=m.user_id and a.is_correct)
       / v_room.total_count,1) as percentage,
      (select coalesce(jsonb_agg(jsonb_build_object(
        'idx',i.idx,'answer',a.answer,'is_correct',a.is_correct
      ) order by i.idx),'[]'::jsonb)
       from public.group_mock_items i
       left join public.group_mock_answers a on a.room_id=i.room_id and a.idx=i.idx
         and a.user_id=m.user_id
       where i.room_id=p_room) as answers
    from public.group_mock_members m
    left join public.profiles p on p.id=m.user_id
    where m.room_id=p_room
  ) t;

  select coalesce(jsonb_agg(jsonb_build_object(
    'idx',i.idx,
    'stem_md',i.payload->>'stem_md',
    'format',i.payload->>'format',
    'options',coalesce(i.payload->'options','[]'::jsonb),
    'correct_answer',i.answer_key,
    'explanation_md',i.explanation_md,
    'answered',(select count(*)::int from public.group_mock_answers a
      where a.room_id=p_room and a.idx=i.idx),
    'correct',(select count(*)::int from public.group_mock_answers a
      where a.room_id=p_room and a.idx=i.idx and a.is_correct),
    'incorrect',(select count(*)::int from public.group_mock_answers a
      where a.room_id=p_room and a.idx=i.idx and not a.is_correct),
    'unanswered',v_members-(select count(*)::int from public.group_mock_answers a
      where a.room_id=p_room and a.idx=i.idx)
  ) order by i.idx),'[]'::jsonb)
  into v_questions from public.group_mock_items i where i.room_id=p_room;

  return jsonb_build_object(
    'room_id',v_room.id,'code',v_room.code,
    'total_count',v_room.total_count,'participant_count',v_members,
    'finished_at',v_room.finished_at,
    'participants',v_people,'questions',v_questions
  );
end $gm$;

revoke all on function public.group_mock_pause(uuid),
  public.group_mock_resume(uuid),public.group_mock_report(uuid) from public,anon;
grant execute on function public.group_mock_pause(uuid),
  public.group_mock_resume(uuid),public.group_mock_report(uuid) to authenticated;

commit;
