-- TASK-351: pause/resume and complete report permissions; full rollback.
begin;
insert into auth.users(id,email) values
 ('93510000-0000-4000-8000-000000000001','task351-host@example.invalid'),
 ('93510000-0000-4000-8000-000000000002','task351-member@example.invalid'),
 ('93510000-0000-4000-8000-000000000003','task351-outsider@example.invalid');

create temporary table task351_fixture(q uuid, correct_id uuid) on commit drop;
insert into task351_fixture
select q.id,(k.payload->>'correct_option_id')::uuid
from public.questions q
join public.question_keys k on k.question_id=q.id
where q.format='Y1'::public.question_format and public.group_mock_eligible(q.id)
order by q.id limit 1;
do $fixture$
begin
  if (select count(*) from task351_fixture)<>1 then
    raise exception 'TASK351 requires a valid published Y1 fixture';
  end if;
  if has_function_privilege('anon','public.group_mock_pause(uuid)','execute')
    or has_function_privilege('anon','public.group_mock_resume(uuid)','execute')
    or has_function_privilege('anon','public.group_mock_report(uuid)','execute')
  then raise exception 'anonymous access to protected room actions'; end if;
  if has_table_privilege('authenticated','public.group_mock_items','select') then
    raise exception 'answer key table readable'; end if;
end $fixture$;
grant select on task351_fixture to authenticated;

set role authenticated;
select set_config('request.jwt.claim.sub','93510000-0000-4000-8000-000000000001',false);
do $test$
declare
  v_q uuid;
  v_key uuid;
  v_room uuid;
  v_code text;
  v_state jsonb;
  v_report jsonb;
  v_failed boolean;
begin
  select q,correct_id into v_q,v_key from task351_fixture;
  v_state:=public.group_mock_create('manual',jsonb_build_object('question_ids',jsonb_build_array(v_q)));
  v_room:=(v_state->>'room_id')::uuid;
  v_code:=v_state->>'code';

  -- Lobby may be paused without revealing the first question.
  perform public.group_mock_pause(v_room);
  v_state:=public.group_mock_state(v_room);
  if v_state->>'status'<>'paused' or v_state->>'paused_from_status'<>'lobby'
    or v_state->'question'<>'null'::jsonb
    or v_state::text like '%correct_option_id%'
  then raise exception 'paused lobby disclosed question or key'; end if;
  if (public.group_mock_my_rooms(20)->0->>'status')<>'paused' then
    raise exception 'paused room not discoverable'; end if;
  perform public.group_mock_resume(v_room);
  if (public.group_mock_state(v_room)->>'status')<>'lobby' then
    raise exception 'lobby resume failed'; end if;

  perform set_config('request.jwt.claim.sub','93510000-0000-4000-8000-000000000002',true);
  perform public.group_mock_join(v_code);
  v_failed:=false;
  begin perform public.group_mock_pause(v_room);
  exception when others then v_failed:=position('group_not_host' in sqlerrm)>0; end;
  if not v_failed then raise exception 'participant paused a room'; end if;

  perform set_config('request.jwt.claim.sub','93510000-0000-4000-8000-000000000003',true);
  v_failed:=false;
  begin perform public.group_mock_report(v_room);
  exception when others then v_failed:=position('group_not_member' in sqlerrm)>0; end;
  if not v_failed then raise exception 'outsider accessed report'; end if;

  perform set_config('request.jwt.claim.sub','93510000-0000-4000-8000-000000000001',true);
  perform public.group_mock_start(v_room);
  perform public.group_mock_answer(v_room,jsonb_build_object('option_id',v_key));
  perform public.group_mock_pause(v_room);
  v_state:=public.group_mock_state(v_room);
  if v_state->>'status'<>'paused' or v_state->>'paused_from_status'<>'question'
    or v_state->'correct_answer'<>'null'::jsonb or v_state->>'answered_count'<>'1'
  then raise exception 'question pause lost answers or disclosed key'; end if;

  perform set_config('request.jwt.claim.sub','93510000-0000-4000-8000-000000000002',true);
  v_failed:=false;
  begin perform public.group_mock_answer(v_room,jsonb_build_object('option_id',v_key));
  exception when others then v_failed:=position('group_answer_closed' in sqlerrm)>0; end;
  if not v_failed then raise exception 'paused test accepted a new answer'; end if;
  v_failed:=false;
  begin perform public.group_mock_resume(v_room);
  exception when others then v_failed:=position('group_not_host' in sqlerrm)>0; end;
  if not v_failed then raise exception 'participant resumed the room'; end if;

  perform set_config('request.jwt.claim.sub','93510000-0000-4000-8000-000000000001',true);
  perform public.group_mock_resume(v_room);
  v_state:=public.group_mock_state(v_room);
  if v_state->>'status'<>'question' or v_state->>'answered_count'<>'1' then
    raise exception 'resume lost saved answer or stage'; end if;
  v_failed:=false;
  begin perform public.group_mock_report(v_room);
  exception when others then v_failed:=position('group_report_unavailable' in sqlerrm)>0; end;
  if not v_failed then raise exception 'report leaked before finish'; end if;

  perform public.group_mock_step(v_room,'reveal');
  perform public.group_mock_step(v_room,'next');
  v_report:=public.group_mock_report(v_room);
  if v_report->>'total_count'<>'1' or v_report->>'participant_count'<>'2'
    or jsonb_array_length(v_report->'participants')<>2
    or jsonb_array_length(v_report->'questions')<>1
    or (v_report->'participants'->0->>'score')::int<>2
    or (v_report->'participants'->0->>'correct')::int<>1
    or (v_report->'participants'->1->>'unanswered')::int<>1
    or (v_report->'questions'->0->>'correct')::int<>1
    or (v_report->'questions'->0->>'unanswered')::int<>1
    or v_report->'questions'->0->'correct_answer'->>'correct_option_id'<>v_key::text
  then raise exception 'incorrect comprehensive report shape or totals'; end if;
  v_failed:=false;
  begin perform public.group_mock_pause(v_room);
  exception when others then v_failed:=position('group_invalid_stage' in sqlerrm)>0; end;
  if not v_failed then raise exception 'finished test was reopened or paused'; end if;

  -- Members, unlike nonmembers, may read the report after completion.
  perform set_config('request.jwt.claim.sub','93510000-0000-4000-8000-000000000002',true);
  if public.group_mock_report(v_room)->>'participant_count'<>'2' then
    raise exception 'participant cannot see completed report'; end if;
end $test$;
reset role;
rollback;
