-- Group mock pedagogy mode: exact 20, fair KS/PM.GEN/PM.MET,
-- absolute deadline, no answer-key leak and existing modes untouched.
-- Explicit rollback fixture: does not persist rooms or test users.
begin;
insert into auth.users(id,email)
values ('93470000-0000-4000-8000-000000000051','group-pedagogy@example.invalid');

create temporary table task_group_pedagogy_capacity as
select quota.group_code,quota.n,(
  select count(*) from public.questions q
  where q.group_code=quota.group_code and public.group_mock_eligible(q.id)
) available
from (values ('KS',7),('PM.GEN',9),('PM.MET',4)) quota(group_code,n);

grant select on task_group_pedagogy_capacity to authenticated;
create temporary table task_group_pedagogy_room(room_id uuid) on commit drop;
grant select,insert on task_group_pedagogy_room to authenticated;

do $security$
begin
  if has_function_privilege('authenticated','public.group_mock_expire(uuid)','EXECUTE')
    or has_function_privilege('anon','public.group_mock_expire(uuid)','EXECUTE')
  then raise exception 'expiry helper callable from untrusted client'; end if;
  if not exists(select 1 from pg_constraint where conname='group_mock_pedagogy_timing_check')
  then raise exception 'pedagogy duration contract missing'; end if;
end $security$;

set role authenticated;
select set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000051',false);

do $test$
declare
  v_ready boolean;
  v_failed boolean;
  v_ref jsonb;
  v_room uuid;
  v_state jsonb;
begin
  -- An attacker cannot control the count or disable the deadline.
  v_failed:=false;
  begin
    perform public.group_mock_create('pedagogy','{"total_count":20,"duration_minutes":120}'::jsonb);
  exception when others then v_failed:=position('group_invalid_input' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'custom extended duration accepted'; end if;
  v_failed:=false;
  begin
    perform public.group_mock_create('pedagogy','{}'::jsonb);
  exception when others then v_failed:=position('group_invalid_input' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'empty pedagogy configuration accepted'; end if;
  v_failed:=false;
  begin
    perform public.group_mock_create('pedagogy','{"total_count":10,"duration_minutes":30}'::jsonb);
  exception when others then v_failed:=position('group_invalid_input' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'pedagogy count override accepted'; end if;

  select bool_and(available>=n) into v_ready from task_group_pedagogy_capacity;
  if v_ready then
    v_ref:=public.group_mock_create('pedagogy','{"total_count":20,"duration_minutes":30}'::jsonb);
    v_room:=(v_ref->>'room_id')::uuid;
    insert into task_group_pedagogy_room values(v_room);
    v_state:=public.group_mock_state(v_room);
    if v_state->>'mode'<>'pedagogy'
      or (v_state->>'total_count')::int<>20
      or (v_state->>'duration_minutes')::int<>30
      or v_state->'deadline_at'<>'null'::jsonb
      or v_state->'correct_answer'<>'null'::jsonb
    then raise exception 'invalid pedagogy lobby / answer key leaked: %',v_state; end if;

    perform public.group_mock_start(v_room);
    v_state:=public.group_mock_state(v_room);
    if v_state->>'status'<>'question'
      or v_state->'deadline_at'='null'::jsonb
      or v_state->'correct_answer'<>'null'::jsonb
    then raise exception 'timer did not start or early key exposed'; end if;
    v_failed:=false;
    begin perform public.group_mock_pause(v_room);
    exception when others then v_failed:=position('group_pedagogy_pause_unavailable' in sqlerrm)>0;
    end;
    if not v_failed then raise exception 'timed active room accepted pause'; end if;
  else
    v_failed:=false;
    begin
      perform public.group_mock_create('pedagogy','{"total_count":20,"duration_minutes":30}'::jsonb);
    exception when others then v_failed:=position('group_pedagogy_pool_insufficient' in sqlerrm)>0;
    end;
    if not v_failed then raise exception 'insufficient bank accepted or wrong error'; end if;
  end if;
end $test$;

reset role;

do $quota$
declare v_room uuid;
begin
  select room_id into v_room from task_group_pedagogy_room;
  if v_room is null then
    if exists(select 1 from public.group_mock_rooms
      where owner_id='93470000-0000-4000-8000-000000000051')
    then raise exception 'partial room from insufficient pedagogy pool'; end if;
    return;
  end if;
  if (select count(*) from public.group_mock_items where room_id=v_room)<>20
    or (select count(distinct question_id) from public.group_mock_items where room_id=v_room)<>20
  then raise exception '20 unique questions not persisted'; end if;
  if exists(
    select 1 from (values ('KS',7),('PM.GEN',9),('PM.MET',4)) quota(group_code,n)
    where (select count(*) from public.group_mock_items i
      join public.questions q on q.id=i.question_id
      where i.room_id=v_room and q.group_code=quota.group_code)<>quota.n
  ) then raise exception 'pedagogy quotas wrong'; end if;
  if exists(select 1 from public.group_mock_items i where i.room_id=v_room
    and not public.group_mock_eligible(i.question_id))
  then raise exception 'ineligible pedagogy item'; end if;
  update public.group_mock_rooms
    set deadline_at=clock_timestamp()-interval '1 second'
    where id=v_room;
end $quota$;

set role authenticated;
select set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000051',false);
do $expiry$
declare v_room uuid; v_state jsonb; v_reply jsonb;
begin
  select room_id into v_room from task_group_pedagogy_room;
  if v_room is null then return; end if;
  -- State polling must finalize without host intervention.
  v_state:=public.group_mock_state(v_room);
  if v_state->>'status'<>'finished'
    then raise exception 'room not finalized by absolute deadline'; end if;
  v_reply:=public.group_mock_answer(v_room,'{"option_id":"93470000-0000-4000-8000-000000000099"}'::jsonb);
  -- Already finished: rejected; no late record can be inserted.
  raise exception 'late response was accepted %',v_reply;
exception when others then
  if position('group_answer_closed' in sqlerrm)=0 then raise; end if;
end $expiry$;
reset role;
do $post$
declare v_room uuid;
begin
  select room_id into v_room from task_group_pedagogy_room;
  if v_room is not null and
    (select count(*) from public.group_mock_answers where room_id=v_room)<>0
  then raise exception 'late answer recorded'; end if;
end $post$;
rollback;
