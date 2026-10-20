-- TASK-348: resumable rooms and safe lobby-only lifecycle.
-- All private tables remain inaccessible directly; additive authenticated RPCs only.
begin;

create function public.group_mock_my_rooms(p_limit int default 20)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $gm$
declare
  v_user uuid := auth.uid();
  v_rooms jsonb;
begin
  if v_user is null then raise exception 'group_auth_required'; end if;
  if p_limit is null or p_limit not between 1 and 20
  then raise exception 'group_invalid_input'; end if;
  select coalesce(jsonb_agg(x.entry order by x.created_at desc, x.room_id desc),'[]'::jsonb)
  into v_rooms
  from (
    select r.id as room_id,r.created_at,
      jsonb_build_object(
        'room_id',r.id,'code',r.code,'mode',r.mode,'status',r.status,
        'is_host',r.owner_id=v_user,
        'total_count',r.total_count,'current_idx',r.current_idx,
        'created_at',r.created_at,
        'member_count',(
          select count(*) from public.group_mock_members all_members where all_members.room_id=r.id
        )
      ) as entry
    from public.group_mock_members m
    join public.group_mock_rooms r on r.id=m.room_id
    where m.user_id=v_user
    order by r.created_at desc,r.id desc
    limit p_limit
  ) x;
  return v_rooms;
end $gm$;

-- Deleting ONLY a never-started lobby also frees a user's five-active-room quota.
-- No exam results, answers or chat history exist in a cancelled lobby.
create function public.group_mock_cancel(p_room uuid)
returns jsonb
language plpgsql security definer set search_path = ''
as $gm$
declare v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid()
  then raise exception 'group_not_host'; end if;
  if v_room.status<>'lobby' then raise exception 'group_invalid_stage'; end if;
  delete from public.group_mock_rooms where id=p_room and status='lobby';
  return jsonb_build_object('ok',true);
end $gm$;

-- Members may leave only before the test starts; otherwise departing mid-vote
-- could destroy their scores and make the all-answered gate untrustworthy.
create function public.group_mock_leave(p_room uuid)
returns jsonb
language plpgsql security definer set search_path = ''
as $gm$
declare v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found then raise exception 'group_not_member'; end if;
  if v_room.owner_id=auth.uid() then raise exception 'group_host_cannot_leave'; end if;
  if v_room.status<>'lobby' then raise exception 'group_invalid_stage'; end if;
  if not exists(select 1 from public.group_mock_members m
    where m.room_id=p_room and m.user_id=auth.uid())
  then raise exception 'group_not_member'; end if;
  delete from public.group_mock_members
    where room_id=p_room and user_id=auth.uid();
  return jsonb_build_object('ok',true);
end $gm$;

revoke all on function public.group_mock_my_rooms(int),
 public.group_mock_cancel(uuid), public.group_mock_leave(uuid)
 from public,anon;
grant execute on function public.group_mock_my_rooms(int),
 public.group_mock_cancel(uuid),public.group_mock_leave(uuid)
 to authenticated;

commit;
