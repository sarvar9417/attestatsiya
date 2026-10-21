-- TASK-352: explicit early finish and permanently delete a group mock.
-- Separate from pause/resume. Only the owner may use these actions.
-- Completed report remains available after finish; deletion cascades all
-- room-specific answers, snapshots, membership and chat. Source questions
-- themselves are never deleted.
begin;

create function public.group_mock_finish(p_room uuid)
returns jsonb language plpgsql security definer set search_path=''
as $gm$
declare v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid() then
    raise exception 'group_not_host';
  end if;
  -- Unstarted rooms should be cancelled/deleted instead of scored.
  if not (
    v_room.status in ('question','reveal')
    or (v_room.status='paused' and v_room.paused_from_status in ('question','reveal'))
  ) then raise exception 'group_invalid_stage'; end if;

  update public.group_mock_rooms
  set status='finished', finished_at=now(),
      paused_from_status=null, paused_at=null
  where id=p_room;

  -- Unanswered items remain unanswered; submitted responses remain immutable
  -- and the existing complete report RPC computes accurate totals.
  return jsonb_build_object('ok',true);
end $gm$;

create function public.group_mock_delete(p_room uuid, p_code text)
returns jsonb language plpgsql security definer set search_path=''
as $gm$
declare v_room public.group_mock_rooms%rowtype;
begin
  if auth.uid() is null then raise exception 'group_auth_required'; end if;
  select * into v_room from public.group_mock_rooms where id=p_room for update;
  if not found or v_room.owner_id<>auth.uid() then
    raise exception 'group_not_host';
  end if;
  -- Server-side confirmation is mandatory, not just the browser prompt.
  if p_code is null or p_code<>v_room.code then
    raise exception 'group_delete_code_mismatch';
  end if;

  -- All room-owned data has ON DELETE CASCADE; the public question bank,
  -- keys, lessons and other rooms have no cascading deletion from this row.
  delete from public.group_mock_rooms where id=p_room and owner_id=auth.uid();
  return jsonb_build_object('ok',true);
end $gm$;

revoke all on function public.group_mock_finish(uuid),
  public.group_mock_delete(uuid,text) from public,anon;
grant execute on function public.group_mock_finish(uuid),
  public.group_mock_delete(uuid,text) to authenticated;
commit;
