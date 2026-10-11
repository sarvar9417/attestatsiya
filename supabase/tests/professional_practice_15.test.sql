-- Professional practice 2026: real source-backed 36-item seed + strict 5/7/3 assembler.
begin;

insert into auth.users(id,email)
values ('77000000-0000-4000-8000-000000000001','professional15@example.test');

do $qa$
declare
  n int;
  v_count int;
  v_group text;
begin
  select count(*) into v_count from public.questions
  where id::text like '75000000-0000-4000-8000-%';
  if v_count <> 36 then raise exception 'expected 36 authored source-backed questions, got %', v_count; end if;

  for v_group in select * from (values ('KS'),('PM.GEN'),('PM.MET')) as t(code)
  loop
    select count(*) into v_count
      from public.questions q join public.question_keys k on k.question_id=q.id
      join public.constructs c on c.id=q.construct_id
     where q.id::text like '75000000-0000-4000-8000-%'
       and q.group_code=v_group and c.group_code=v_group and c.is_active
       and q.source_lesson_id is not null and q.source_reference is not null
       and (select count(*) from public.question_options o where o.question_id=q.id)=4
       and exists(select 1 from public.question_options o
                   where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id');
    if (v_group = 'KS' and v_count < 14)
       or (v_group = 'PM.GEN' and v_count < 16)
       or (v_group = 'PM.MET' and v_count < 6) then
      raise exception 'invalid authored bank: group=% available=%',v_group,v_count;
    end if;
  end loop;
end
$qa$;

select set_config('request.jwt.claim.sub','77000000-0000-4000-8000-000000000001',false);

do $qa$
declare
  r jsonb;
  v_exam uuid;
  v_total int;
  v_group text;
  v_expected int;
  v_actual int;
  i int;
begin
  for i in 1..3 loop
    r := public.generate_professional_practice_15();
    v_exam := (r->>'exam_id')::uuid;

    if r->>'kind' <> 'pedagogik_15'
       or (r->>'duration_sec')::int <> 1800
       or jsonb_array_length(r->'items') <> 15 then
      raise exception 'professional 15 payload invalid';
    end if;
    if r::text like '%correct_option_id%' or r::text like '%explanation_md%' then
      raise exception 'answer key/explanation leaked before finalization';
    end if;
    select count(*),count(distinct question_id) into v_total,v_actual
      from public.exam_items where exam_id=v_exam;
    if v_total <> 15 or v_actual <> 15 then
      raise exception 'invalid item count or duplicates: % %',v_total,v_actual;
    end if;

    for v_group,v_expected in
      select * from (values ('KS'::text,5),('PM.GEN'::text,7),('PM.MET'::text,3)) t(code,required)
    loop
      select count(*) into v_actual
      from public.exam_items ei
      join public.questions q on q.id=ei.question_id
      where ei.exam_id=v_exam and q.group_code=v_group;
      if v_actual <> v_expected then
        raise exception 'wrong % quota: expected %, got %',v_group,v_expected,v_actual;
      end if;
    end loop;

    if (select string_agg(q.group_code,',' order by ei.order_idx)
        from public.exam_items ei join public.questions q on q.id=ei.question_id
        where ei.exam_id=v_exam)
       <> concat_ws(',', 'KS','KS','KS','KS','KS',
                      'PM.GEN','PM.GEN','PM.GEN','PM.GEN','PM.GEN','PM.GEN','PM.GEN',
                      'PM.MET','PM.MET','PM.MET') then
      raise exception '36–50 slot group order incorrect';
    end if;

    if (select selection_meta->>'selector_version' from public.exams where id=v_exam)
       <> 'professional-15-v1' then raise exception 'missing audit selection meta'; end if;
  end loop;
end
$qa$;

do $qa$
begin
  if has_function_privilege('anon','public.generate_professional_practice_15()','EXECUTE') then
    raise exception 'anonymous callers must be denied';
  end if;
  if not has_function_privilege('authenticated','public.generate_professional_practice_15()','EXECUTE') then
    raise exception 'authenticated callers must be permitted';
  end if;
end
$qa$;

rollback;
