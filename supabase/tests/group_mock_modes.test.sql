-- TASK-347: specification and topic selection invariants; rollback-only.
begin;

insert into auth.users(id,email)
values ('93470000-0000-4000-8000-000000000040','task347-modes@example.invalid');

create temporary table task347_mode_fixture(
  lesson_id uuid not null, difficulty int not null
) on commit drop;

insert into task347_mode_fixture
select q.source_lesson_id, q.difficulty
from public.questions q
join public.lessons l on l.id=q.source_lesson_id
join public.modules m on m.id=l.module_id
where public.group_mock_eligible(q.id)
  and l.status='published'::public.content_status
  and m.status='published'::public.content_status
group by q.source_lesson_id,q.difficulty
order by count(*) desc, q.source_lesson_id
limit 1;

do $fixture$
begin
  if (select count(*) from task347_mode_fixture)<>1
  then raise exception 'TASK347 no eligible topic/difficulty'; end if;
end $fixture$;

create temporary table task347_mode_rooms(
  mode text primary key, room_id uuid not null
) on commit drop;
grant select on task347_mode_fixture to authenticated;
grant select,insert on task347_mode_rooms to authenticated;

set role authenticated;
select set_config('request.jwt.claim.sub','93470000-0000-4000-8000-000000000040',false);

do $test$
declare
  v_lesson uuid;
  v_difficulty int;
  v_result jsonb;
  v_state jsonb;
  v_spec uuid;
  v_topics uuid;
  v_bank jsonb;
  v_failed boolean;
begin
  select lesson_id,difficulty into v_lesson,v_difficulty
  from task347_mode_fixture;
  v_bank := public.group_mock_bank(v_lesson,'',4);
  if jsonb_array_length(v_bank)=0
     or (v_bank->0->'options') is null
     or jsonb_array_length(v_bank->0->'options')<2
     or v_bank::text like '%correct_option_id%'
     or v_bank::text like '%explanation_md%'
     or v_bank::text like '%"order_idx"%'
  then raise exception 'unsafe or empty manual bank catalog'; end if;

  v_result := public.group_mock_create('topics',jsonb_build_object(
    'total_count',1,
    'topics',jsonb_build_array(jsonb_build_object(
      'lesson_id',v_lesson,'difficulty',v_difficulty,'count',1
    ))
  ));
  v_topics := (v_result->>'room_id')::uuid;
  insert into task347_mode_rooms values('topics',v_topics);
  v_state := public.group_mock_state(v_topics);
  if v_state->>'status'<>'lobby' or (v_state->>'total_count')::int<>1
     or (v_state->>'current_idx')::int<>1
  then raise exception 'incorrect topic room %',v_state; end if;

  -- Exact quotas, no answer key in lobby, and no partial rooms on shortage.
  v_result := public.group_mock_create('spec','{}'::jsonb);
  v_spec := (v_result->>'room_id')::uuid;
  insert into task347_mode_rooms values('spec',v_spec);
  v_state := public.group_mock_state(v_spec);
  if v_state->>'mode'<>'spec' or (v_state->>'total_count')::int<>50
     or v_state->>'status'<>'lobby'
     or v_state->'question'<>'null'::jsonb
  then raise exception 'incorrect official blueprint room %',v_state; end if;

  v_failed := false;
  begin
    perform public.group_mock_create('topics',jsonb_build_object(
      'total_count',1,
      'topics',jsonb_build_array(jsonb_build_object(
        'lesson_id',v_lesson,'difficulty',v_difficulty,'count',101
      ))
    ));
  exception when others then
    v_failed := position('group_invalid_input' in sqlerrm)>0;
  end;
  if not v_failed then raise exception 'invalid topic count accepted'; end if;
end $test$;

reset role;

do $quota$
declare
  v_room uuid;
  v_bp uuid;
  v_count int;
  v_diff_count int;
begin
  select room_id into v_room from task347_mode_rooms where mode='spec';
  select id into v_bp from public.blueprints where is_active order by version desc limit 1;
  select count(*),count(distinct i.question_id) into v_count,v_diff_count
  from public.group_mock_items i where i.room_id=v_room;
  if v_count<>50 or v_diff_count<>50
  then raise exception 'spec duplicated or missing questions'; end if;
  if exists (
    with expected as (
      select group_code,'bilish'::public.cognitive_level as cognitive,n_bilish as target
      from public.blueprint_quotas where blueprint_id=v_bp
      union all
      select group_code,'qollash'::public.cognitive_level,n_qollash
      from public.blueprint_quotas where blueprint_id=v_bp
      union all
      select group_code,'mulohaza'::public.cognitive_level,n_mulohaza
      from public.blueprint_quotas where blueprint_id=v_bp
    ), actual as (
      select q.group_code,q.cognitive,count(*) as selected
      from public.group_mock_items i
      join public.questions q on q.id=i.question_id
      where i.room_id=v_room
      group by q.group_code,q.cognitive
    )
    select 1 from expected e left join actual a
    on a.group_code=e.group_code and a.cognitive=e.cognitive
    where coalesce(a.selected,0) <> e.target
  )
  then raise exception 'group specification quota mismatch'; end if;

  select room_id into v_room from task347_mode_rooms where mode='topics';
  select count(*) into v_count
  from public.group_mock_items i join public.questions q on q.id=i.question_id
  join task347_mode_fixture f on f.lesson_id=q.source_lesson_id
  where i.room_id=v_room and q.difficulty=f.difficulty;
  if v_count<>1 then raise exception 'topic count/difficulty mismatch'; end if;
end $quota$;

rollback;
