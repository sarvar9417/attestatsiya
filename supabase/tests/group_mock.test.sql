-- TASK-347: Group mock security, timing, answer privacy and room lifecycle.
-- A transaction rollback leaves production/test fixtures untouched.
begin;

insert into auth.users(id,email)
values
 ('93470000-0000-4000-8000-000000000001','task347-host@example.invalid'),
 ('93470000-0000-4000-8000-000000000002','task347-member@example.invalid'),
 ('93470000-0000-4000-8000-000000000003','task347-outsider@example.invalid');

do $priv$
begin
 if exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
   where n.nspname='public' and c.relname like 'group_mock_%'
     and c.relkind='r' and not c.relrowsecurity)
 then raise exception 'group tables missing RLS'; end if;
 if has_table_privilege('authenticated','public.group_mock_items','SELECT')
    or has_table_privilege('authenticated','public.group_mock_answers','SELECT')
    or has_table_privilege('authenticated','public.group_mock_rooms','SELECT')
    or has_table_privilege('authenticated','public.group_mock_messages','SELECT')
    or has_table_privilege('authenticated','public.group_mock_members','SELECT')
 then raise exception 'private group rows readable by learner'; end if;
 if has_function_privilege('anon','public.group_mock_state(uuid)','EXECUTE')
    or has_function_privilege('anon','public.group_mock_create(text,jsonb)','EXECUTE')
    or has_function_privilege('authenticated','public.group_mock_eligible(uuid)','EXECUTE')
 then raise exception 'group RPC access too broad'; end if;
end $priv$;


create temporary table task347_fixture(question_id uuid, lesson_id uuid, correct_option_id uuid, other_option_id uuid) on commit drop;
insert into task347_fixture
select q.id, q.source_lesson_id,
       (k.payload->>'correct_option_id')::uuid,
       (select o.id from public.question_options o
        where o.question_id=q.id and o.side='a'
          and o.id::text<>k.payload->>'correct_option_id'
        order by o.id limit 1)
from public.questions q
join public.question_keys k on k.question_id=q.id
where q.format='Y1'::public.question_format
  and q.source_lesson_id is not null
  and public.group_mock_eligible(q.id)
order by q.id limit 1;
do $check_fixture$
begin
 if not exists(select 1 from task347_fixture where other_option_id is not null)
 then raise exception 'TASK347 fixture needs a published Y1 question with distractor'; end if;
end $check_fixture$;
grant select on task347_fixture to authenticated;
set role authenticated;
select set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000001',false);

do $test$
declare
 v_q uuid;
 v_correct_id uuid;
 v_other_id uuid;
 v_lesson uuid;
 v_room uuid;
 v_code text;
 v_response jsonb;
 v_state jsonb;
 v_failed boolean;
begin
 -- Existing published source-backed Y1 fixture, collected as DB owner before
 -- switching to authenticated to avoid direct access to question_keys.
 select question_id, lesson_id, correct_option_id, other_option_id
 into v_q,v_lesson,v_correct_id,v_other_id from task347_fixture;

 -- Validation and duplicate question failures cannot leave a room behind.
 v_failed:=false;
 begin
   perform public.group_mock_create('manual',
      jsonb_build_object('question_ids',jsonb_build_array(v_q,v_q)));
 exception when others then
   v_failed := position('group_question_unavailable' in sqlerrm)>0;
 end;
 if not v_failed then raise exception 'duplicate manual questions accepted'; end if;

 v_response := public.group_mock_create('manual',
     jsonb_build_object('question_ids',jsonb_build_array(v_q)));
 v_room := (v_response->>'room_id')::uuid;
 v_code := v_response->>'code';
 if v_code !~ '^[A-F0-9]{8}$' then raise exception 'unsafe invitation code'; end if;
 v_state := public.group_mock_state(v_room);
 if v_state->>'status'<>'lobby' or v_state->'question' <> 'null'::jsonb
    or v_state ? 'answer_key' or v_state::text like '%correct_option_id%'
 then raise exception 'lobby state leaked item/key %',v_state; end if;

 -- Outsider cannot infer question, roster, results or discussion from room UUID.
 perform set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000003',true);
 v_failed:=false;
 begin perform public.group_mock_state(v_room);
 exception when others then v_failed:=position('group_not_member' in sqlerrm)>0;
 end;
 if not v_failed then raise exception 'outsider accessed room'; end if;

 -- Invite-only authenticated peer may join lobby, but cannot start it.
 perform set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000002',true);
 perform public.group_mock_join(v_code);
 perform public.group_mock_join(v_code);
 v_failed:=false;
 begin perform public.group_mock_start(v_room);
 exception when others then v_failed:=position('group_not_host' in sqlerrm)>0;
 end;
 if not v_failed then raise exception 'member started host room'; end if;

 perform set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000001',true);
 perform public.group_mock_start(v_room);
 v_state := public.group_mock_state(v_room);
 if v_state->>'status'<>'question' or v_state::text like '%correct_option_id%'
    or v_state->'explanation_md'<>'null'::jsonb then
   raise exception 'question payload revealed key %',v_state; end if;

 v_failed:=false;
 begin
   perform public.group_mock_answer(v_room,jsonb_build_object('option_id',gen_random_uuid()));
 exception when others then v_failed:=position('group_invalid_answer' in sqlerrm)>0;
 end;
 if not v_failed then raise exception 'foreign option accepted'; end if;

 v_response := public.group_mock_answer(v_room,jsonb_build_object('option_id',v_other_id));
 if v_response<>'{"saved": true}'::jsonb then raise exception 'answer leaked result'; end if;
 v_state := public.group_mock_state(v_room);
 if v_state->>'status'<>'question' or (v_state->>'answered_count')::int<>1
   or jsonb_array_length(v_state->'answers')<>0
   or v_state->'correct_answer'<>'null'::jsonb
 then raise exception 'first answer revealed too early %',v_state; end if;

 v_failed:=false;
 begin perform public.group_mock_answer(v_room,jsonb_build_object('option_id',v_correct_id));
 exception when others then v_failed:=position('group_already_answered' in sqlerrm)>0;
 end;
 if not v_failed then raise exception 'vote was mutable'; end if;

 perform set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000002',true);
 perform public.group_mock_answer(v_room,jsonb_build_object('option_id',v_correct_id));
 v_state := public.group_mock_state(v_room);
 if v_state->>'status'<>'reveal'
    or v_state->'correct_answer'->>'correct_option_id'<>v_correct_id::text
    or jsonb_array_length(v_state->'answers')<>2
    or v_state->>'explanation_md' is null
 then raise exception 'reveal missing answers/key %',v_state; end if;
 v_failed:=false;
 begin perform public.group_mock_step(v_room,'next');
 exception when others then v_failed:=position('group_not_host' in sqlerrm)>0;
 end;
 if not v_failed then raise exception 'member advanced question'; end if;

 perform set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000001',true);
 perform public.group_mock_step(v_room,'next');
 v_state:=public.group_mock_state(v_room);
 if v_state->>'status'<>'finished' then raise exception 'final step did not finish test'; end if;
 if jsonb_array_length(v_state->'answers')<>2 then raise exception 'missing final answers'; end if;
end $test$;

reset role;
rollback;
