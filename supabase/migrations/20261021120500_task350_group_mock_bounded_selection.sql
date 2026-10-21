-- TASK-350: bounded authenticated group-mock question selection.
-- Reason: production PostgREST group_mock_create('spec', '{}') hit SQLSTATE
-- 57014 statement_timeout under the nested official question quality checker.
-- The sample is randomized BEFORE the costly helper runs; an exhaustive
-- fallback preserves quotas and never admits a non-eligible question.
-- No grants to anon, no RLS changes, no answer key exposure.
begin;

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
  if p_mode not in ('spec','topics','manual') or jsonb_typeof(p_config)<>'object'
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

  insert into public.group_mock_rooms(code,owner_id,mode,total_count)
    values(v_code,v_user,p_mode,v_total) returning id into v_room;
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

revoke all on function public.group_mock_create(text,jsonb) from public, anon;
grant execute on function public.group_mock_create(text,jsonb) to authenticated;
commit;
