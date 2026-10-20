-- TASK-348 guarded room recovery and lobby lifecycle, fresh DB, rollback-only.
begin;

insert into auth.users(id,email) values
 ('93480000-0000-4000-8000-000000000001','task348-host@example.invalid'),
 ('93480000-0000-4000-8000-000000000002','task348-member@example.invalid'),
 ('93480000-0000-4000-8000-000000000003','task348-outsider@example.invalid');

create temporary table task348_fixture(question_id uuid not null) on commit drop;
insert into task348_fixture
select q.id from public.questions q
where public.group_mock_eligible(q.id)
order by q.id limit 1;
do $fixture$
begin
 if (select count(*) from task348_fixture)<>1
 then raise exception 'TASK348 requires one eligible published question'; end if;
 if has_function_privilege('anon','public.group_mock_my_rooms(integer)','EXECUTE')
    or has_function_privilege('anon','public.group_mock_cancel(uuid)','EXECUTE')
    or has_function_privilege('anon','public.group_mock_leave(uuid)','EXECUTE')
 then raise exception 'anonymous room management granted'; end if;
 if has_table_privilege('authenticated','public.group_mock_rooms','SELECT')
 then raise exception 'private room metadata directly readable'; end if;
end $fixture$;
grant select on task348_fixture to authenticated;

set role authenticated;
select set_config('request.jwt.claim.sub','93480000-0000-4000-8000-000000000001',false);

do $suite$
declare
  v_q uuid;
  v_room uuid;
  v_code text;
  v_state jsonb;
  v_list jsonb;
  v_failed boolean;
begin
  select question_id into v_q from task348_fixture;
  if public.group_mock_my_rooms(20)<>'[]'::jsonb
  then raise exception 'initial host room list not empty'; end if;
  v_state:=public.group_mock_create('manual',jsonb_build_object(
    'question_ids',jsonb_build_array(v_q)));
  v_room:=(v_state->>'room_id')::uuid;
  v_code:=v_state->>'code';
  v_list:=public.group_mock_my_rooms(20);
  if jsonb_array_length(v_list)<>1
    or v_list->0->>'room_id'<>v_room::text
    or v_list->0->>'code'<>v_code
    or v_list->0->>'is_host'<>'true'
    or (v_list->0->>'member_count')::int<>1
    or v_list::text like '%correct_option_id%'
    or v_list::text like '%explanation_md%'
  then raise exception 'unsafe host list %',v_list; end if;

  perform set_config('request.jwt.claim.sub','93480000-0000-4000-8000-000000000003',true);
  if public.group_mock_my_rooms(20)<>'[]'::jsonb
  then raise exception 'outsider enumerated invite-only rooms'; end if;
  v_failed:=false;
  begin perform public.group_mock_cancel(v_room);
  exception when others then v_failed:=position('group_not_host' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'outsider cancelled someone else room'; end if;

  perform set_config('request.jwt.claim.sub','93480000-0000-4000-8000-000000000002',true);
  perform public.group_mock_join(v_code);
  v_list:=public.group_mock_my_rooms(10);
  if jsonb_array_length(v_list)<>1 or v_list->0->>'is_host'<>'false'
  then raise exception 'member could not recover joined room'; end if;
  perform public.group_mock_leave(v_room);
  if public.group_mock_my_rooms(10)<>'[]'::jsonb
  then raise exception 'left room still listed'; end if;
  v_failed:=false;
  begin perform public.group_mock_state(v_room);
  exception when others then v_failed:=position('group_not_member' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'ex-member could access room state'; end if;
  perform public.group_mock_join(v_code);

  perform set_config('request.jwt.claim.sub','93480000-0000-4000-8000-000000000001',true);
  v_failed:=false;
  begin perform public.group_mock_leave(v_room);
  exception when others then v_failed:=position('group_host_cannot_leave' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'host left room without cancelling'; end if;

  perform public.group_mock_start(v_room);
  v_failed:=false;
  begin perform public.group_mock_cancel(v_room);
  exception when others then v_failed:=position('group_invalid_stage' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'started room was cancelled'; end if;

  perform set_config('request.jwt.claim.sub','93480000-0000-4000-8000-000000000002',true);
  v_failed:=false;
  begin perform public.group_mock_leave(v_room);
  exception when others then v_failed:=position('group_invalid_stage' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'member left started room'; end if;

  perform set_config('request.jwt.claim.sub','93480000-0000-4000-8000-000000000001',true);
  perform public.group_mock_step(v_room,'reveal');
  perform public.group_mock_step(v_room,'next');
  if (public.group_mock_my_rooms(20)->0->>'status')<>'finished'
  then raise exception 'finished room not recoverable'; end if;

  -- Host cancels a second lobby; the first finished room remains intact.
  v_state:=public.group_mock_create('manual',jsonb_build_object(
    'question_ids',jsonb_build_array(v_q)));
  v_room:=(v_state->>'room_id')::uuid;
  v_code:=v_state->>'code';
  perform public.group_mock_cancel(v_room);
  if jsonb_array_length(public.group_mock_my_rooms(20))<>1
  then raise exception 'cancelled room still shown'; end if;
  v_failed:=false;
  begin perform public.group_mock_join(v_code);
  exception when others then v_failed:=position('group_not_found' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'cancelled room code still reusable'; end if;
end $suite$;

reset role;
rollback;
