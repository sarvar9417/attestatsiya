-- Regression for original Pedmahorat Guli *topic-derived* corpus.
-- No prior-exam provenance claimed and no channel text reproduced.
begin;
do $test$
declare
  v_total integer;
  v_keyed integer;
  v_invalid integer;
  v_group record;
  v_session jsonb;
  v_exam uuid;
  v_count integer;
begin
  select count(*) into v_total
  from public.questions where source_reference like 'authored:pedguli-topic-study:v2:%';
  if v_total<>30 then raise exception 'pedguli topic bank must have 30 authored items; got %',v_total; end if;

  for v_group in select * from (values ('KS'::text,8),('PM.GEN'::text,18),('PM.MET'::text,4)) g(code,required)
  loop
    select count(*) into v_count from public.questions q where q.source_reference like
      'authored:pedguli-topic-study:v2:%' and q.group_code=v_group.code;
    if v_count<>v_group.required then
      raise exception 'pedguli group % must have %, found %',v_group.code,v_group.required,v_count;
    end if;
  end loop;

  select count(*) into v_invalid from public.questions q
  left join public.question_keys k on k.question_id=q.id
  left join public.constructs c on c.id=q.construct_id
  left join public.lessons l on l.id=q.source_lesson_id
  where q.source_reference like 'authored:pedguli-topic-study:v2:%'
    and (k.question_id is null or c.id is null or not c.is_active
      or c.group_code<>q.group_code or l.id is null
      or q.format<>'Y1'::public.question_format
      or q.status<>'published'::public.content_status
      or (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')<>4
      or not exists(select 1 from public.question_options o
                    where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id')
      or length(coalesce(k.explanation_md,''))<20);
  if v_invalid>0 then raise exception 'invalid pedagogy source/keys: %',v_invalid; end if;

  select count(*) into v_invalid from (
    select lower(trim(stem_md)) stem from public.questions
    where source_reference like 'authored:pedguli-topic-study:v2:%'
    group by lower(trim(stem_md)) having count(*)>1
  ) dupes;
  if v_invalid>0 then raise exception 'duplicate stems in new corpus'; end if;

  for v_group in select * from (values
      ('M15'::text,'talim-texnologiyalari-va-vaziyatga-mos-tanlov'::text),
      ('M15','pedagogik-qobiliyat-va-uning-turlari'),
      ('M14','xavfsiz-rivojlantiruvchi-talim-muhiti'),
      ('M16','oqitish-usullari-va-metodlarini-farqlash')
    ) t(module_code,slug)
  loop
    if not exists(select 1 from public.lessons l
      join public.modules m on m.id=l.module_id
      where m.code=v_group.module_code and l.slug=v_group.slug
        and position('[PEDGULI-STUDY-2026-01]' in l.body_mdx)>0)
    then raise exception 'missing source-backed enrichment %.%',v_group.module_code,v_group.slug; end if;
  end loop;
end
$test$;

-- The 5+7+3 assembler must still work after addition, without leaking correct keys.
insert into auth.users(id,email)
values ('79990000-0000-4000-8000-000000000001','pedguli-assembly@example.test');
select set_config('request.jwt.claim.sub','79990000-0000-4000-8000-000000000001',false);
do $test$
declare
  v_payload jsonb;
  v_exam uuid;
  v_group record;
  v_count integer;
begin
  v_payload:=public.generate_professional_practice_15();
  v_exam:=(v_payload->>'exam_id')::uuid;
  if v_payload->>'kind'<>'pedagogik_15' or jsonb_array_length(v_payload->'items')<>15
    or v_payload::text like '%correct_option_id%'
  then raise exception 'professional practice contract violated'; end if;
  for v_group in select * from (values('KS'::text,5),('PM.GEN'::text,7),('PM.MET'::text,3)) t(code,n)
  loop
    select count(*) into v_count from public.exam_items ei
    join public.questions q on q.id=ei.question_id
    where ei.exam_id=v_exam and q.group_code=v_group.code;
    if v_count<>v_group.n then
      raise exception 'invalid group quota %, got %, expected %',v_group.code,v_count,v_group.n;
    end if;
  end loop;
end
$test$;
rollback;
