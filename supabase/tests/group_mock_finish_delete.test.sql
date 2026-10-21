-- TASK-352: owner-only immediate finish and confirmed permanent deletion.
-- Integration test is fully rollback-only.
begin;
insert into auth.users(id,email) values
  ('93520000-0000-4000-8000-000000000001','task352-host@example.invalid'),
  ('93520000-0000-4000-8000-000000000002','task352-member@example.invalid'),
  ('93520000-0000-4000-8000-000000000003','task352-outsider@example.invalid');

create temporary table task352_questions(q uuid, correct_id uuid) on commit drop;
insert into task352_questions(q,correct_id)
select q.id,(k.payload->>'correct_option_id')::uuid
from public.questions q
join public.question_keys k on k.question_id=q.id
where q.format='Y1'::public.question_format and public.group_mock_eligible(q.id)
order by q.id limit 2;

do $check$
begin
  if (select count(*) from task352_questions)<>2
  then raise exception 'TASK352 needs 2 eligible published Y1 questions'; end if;
  if has_function_privilege('anon','public.group_mock_finish(uuid)','execute')
    or has_function_privilege('anon','public.group_mock_delete(uuid,text)','execute')
    or has_function_privilege('public','public.group_mock_delete(uuid,text)','execute')
  then raise exception 'unsafe anonymous delete or finish permissions'; end if;
end $check$;
grant select on task352_questions to authenticated;

set role authenticated;
select set_config('request.jwt.claim.sub','93520000-0000-4000-8000-000000000001',false);

do $suite$
declare
  v_ids uuid[];
  v_key uuid;
  v_room uuid;
  v_code text;
  v_lobby uuid;
  v_paused uuid;
  v_info jsonb;
  v_report jsonb;
  v_failed boolean;
begin
  select array_agg(q order by q), (array_agg(correct_id order by q))[1]
    into v_ids,v_key from task352_questions;
  v_info:=public.group_mock_create('manual',jsonb_build_object('question_ids',to_jsonb(v_ids)));
  v_room:=(v_info->>'room_id')::uuid;
  v_code:=v_info->>'code';

  -- Unstarted rooms cannot create misleading final scores.
  v_failed:=false;
  begin perform public.group_mock_finish(v_room);
  exception when others then v_failed:=position('group_invalid_stage' in sqlerrm)>0; end;
  if not v_failed then raise exception 'unstarted lobby was finalized'; end if;
  perform public.group_mock_pause(v_room);
  v_failed:=false;
  begin perform public.group_mock_finish(v_room);
  exception when others then v_failed:=position('group_invalid_stage' in sqlerrm)>0; end;
  if not v_failed then raise exception 'paused lobby was finalized'; end if;
  perform public.group_mock_resume(v_room);

  -- Another participant can join, but cannot finish or delete host room.
  perform set_config('request.jwt.claim.sub','93520000-0000-4000-8000-000000000002',true);
  perform public.group_mock_join(v_code);
  v_failed:=false;
  begin perform public.group_mock_finish(v_room);
  exception when others then v_failed:=position('group_not_host' in sqlerrm)>0; end;
  if not v_failed then raise exception 'member was allowed to finish'; end if;
  v_failed:=false;
  begin perform public.group_mock_delete(v_room,v_code);
  exception when others then v_failed:=position('group_not_host' in sqlerrm)>0; end;
  if not v_failed then raise exception 'member deleted someone else room'; end if;
  perform set_config('request.jwt.claim.sub','93520000-0000-4000-8000-000000000003',true);
  v_failed:=false;
  begin perform public.group_mock_delete(v_room,v_code);
  exception when others then v_failed:=position('group_not_host' in sqlerrm)>0; end;
  if not v_failed then raise exception 'outsider deleted invite-only room'; end if;

  -- Finish immediately during question #1. Only the one submitted answer
  -- counts; second question and absent member responses remain unanswered.
  perform set_config('request.jwt.claim.sub','93520000-0000-4000-8000-000000000001',true);
  perform public.group_mock_start(v_room);
  perform public.group_mock_answer(v_room,jsonb_build_object('option_id',v_key));
  perform public.group_mock_finish(v_room);
  v_info:=public.group_mock_state(v_room);
  if v_info->>'status'<>'finished' then raise exception 'did not finish immediately'; end if;
  v_report:=public.group_mock_report(v_room);
  if v_report->>'total_count'<>'2'
    or v_report->>'participant_count'<>'2'
    or jsonb_array_length(v_report->'questions')<>2
    or (v_report->'participants'->0->>'correct')::int<>1
    or (v_report->'participants'->0->>'unanswered')::int<>1
    or (v_report->'participants'->1->>'unanswered')::int<>2
    or (v_report->'questions'->1->>'unanswered')::int<>2
  then raise exception 'early finish report lost unanswered items %',v_report; end if;

  v_failed:=false;
  begin perform public.group_mock_start(v_room);
  exception when others then v_failed:=position('group_invalid_stage' in sqlerrm)>0; end;
  if not v_failed then raise exception 'finished test restarted'; end if;
  v_failed:=false;
  begin perform public.group_mock_finish(v_room);
  exception when others then v_failed:=position('group_invalid_stage' in sqlerrm)>0; end;
  if not v_failed then raise exception 'finished room finished twice'; end if;

  -- Bad confirmation must never remove the room or its final report.
  v_failed:=false;
  begin perform public.group_mock_delete(v_room,'BADCODE0');
  exception when others then v_failed:=position('group_delete_code_mismatch' in sqlerrm)>0; end;
  if not v_failed then raise exception 'incorrect delete confirmation accepted'; end if;
  if (public.group_mock_report(v_room)->>'total_count')<>'2'
  then raise exception 'wrong code destroyed results'; end if;

  -- Permanent delete erases membership, items, chat, answers and report.
  perform public.group_mock_delete(v_room,v_code);
  if public.group_mock_my_rooms(20)<>'[]'::jsonb then
    raise exception 'deleted room still listed'; end if;
  v_failed:=false;
  begin perform public.group_mock_report(v_room);
  exception when others then v_failed:=position('group_not_member' in sqlerrm)>0; end;
  if not v_failed then raise exception 'deleted room report still accessible'; end if;
  v_failed:=false;
  begin perform public.group_mock_join(v_code);
  exception when others then v_failed:=position('group_not_found' in sqlerrm)>0; end;
  if not v_failed then raise exception 'deleted invite code still usable'; end if;

  -- A paused running test can also be finalized without resuming first.
  v_info:=public.group_mock_create('manual',jsonb_build_object('question_ids',to_jsonb(v_ids)));
  v_paused:=(v_info->>'room_id')::uuid;
  perform public.group_mock_start(v_paused);
  perform public.group_mock_pause(v_paused);
  perform public.group_mock_finish(v_paused);
  if (public.group_mock_state(v_paused)->>'status')<>'finished' then
    raise exception 'paused started test could not be finalized'; end if;
  if public.group_mock_report(v_paused)->>'total_count'<>'2' then
    raise exception 'paused finished report unavailable'; end if;
  perform public.group_mock_delete(v_paused,v_info->>'code');

  -- Unstarted test can be permanently deleted without first starting.
  v_info:=public.group_mock_create('manual',jsonb_build_object('question_ids',to_jsonb(v_ids)));
  v_lobby:=(v_info->>'room_id')::uuid;
  perform public.group_mock_delete(v_lobby,v_info->>'code');

  if public.group_mock_my_rooms(20)<>'[]'::jsonb then
    raise exception 'deleted rooms remain in personal room list'; end if;
end $suite$;

reset role;
rollback;
