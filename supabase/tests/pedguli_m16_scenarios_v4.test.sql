-- v4 teaching-methodology focused content bank regression.
-- All tests run against ephemeral PostgreSQL in GitHub CI.
begin;
do $pedguli_v4_test$
declare
 rec record; v_count int; v_bad int; v_exam uuid; v_payload jsonb;
begin
 select count(*) into v_count from public.questions q
 where q.source_reference like 'authored:pedguli-topic-audit:v4:%';
 if v_count<>30 then raise exception 'v4 expected exactly 30 original items; got %',v_count;end if;
 for rec in select * from (values('PM.MET'::text,18),('KS'::text,8),('PM.GEN'::text,4)) t(grp,n)
 loop
  select count(*) into v_count from public.questions q
  where q.source_reference like 'authored:pedguli-topic-audit:v4:%' and q.group_code=rec.grp;
  if v_count<>rec.n then raise exception 'v4 group % expected %, got %',rec.grp,rec.n,v_count;end if;
 end loop;
 select count(*) into v_bad from public.questions q
 left join public.constructs c on c.id=q.construct_id
 left join public.lessons l on l.id=q.source_lesson_id
 left join public.question_keys k on k.question_id=q.id
 where q.source_reference like 'authored:pedguli-topic-audit:v4:%'
 and (c.id is null or not c.is_active or c.group_code<>q.group_code
   or l.id is null or l.status<>'published'::public.content_status
   or not exists(select 1 from public.lesson_constructs lc
    where lc.lesson_id=l.id and lc.construct_id=q.construct_id)
   or q.format<>'Y1'::public.question_format or q.status<>'review'::public.content_status
   or q.cognitive not in ('bilish','qollash','mulohaza')
   or k.question_id is null
   or length(coalesce(q.stem_md,''))<40
   or length(coalesce(k.explanation_md,''))<35
   or (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')<>4
   or (select count(distinct trim(o.content_md)) from public.question_options o
    where o.question_id=q.id and o.side='a')<>4
   or not exists(select 1 from public.question_options o
    where o.id::text=k.payload->>'correct_option_id' and o.question_id=q.id)
 );
 if v_bad>0 then raise exception 'v4 invalid questions: %',v_bad;end if;
 select count(*) into v_bad from (
   select lower(trim(stem_md)) stem from public.questions
   where source_reference like 'authored:%'
   group by lower(trim(stem_md)) having count(*)>1
 ) duplicates;
 if v_bad>0 then raise exception 'duplicate authored bank stems: %',v_bad;end if;

 for rec in select * from (values
  ('M16'::text,'informatika-oqitish-yondashuvlari-va-metodikasi'::text),
  ('M16','talimiy-vaziyat-va-pedagogik-qarorni-baholash'),
  ('M14','talim-samaradorligini-taminlash'),
  ('M14','tarbiyaviy-faoliyatni-tashkil-etish'),
  ('M14','oz-ozini-rivojlantirish-va-kasbiy-osish'),
  ('M15','dars-turlari-rejalashtirish-va-sinfni-boshqarish')
 ) t(module_code,slug)
 loop
  if not exists(select 1 from public.lessons l join public.modules m on m.id=l.module_id
  where m.code=rec.module_code and l.slug=rec.slug
    and l.status='published'::public.content_status
    and position('[PEDGULI-EXPAND-2026-02]' in l.body_mdx)>0)
   then raise exception 'enriched lesson missing %.%',rec.module_code,rec.slug;end if;
 end loop;
end
$pedguli_v4_test$;

-- Verify question pool includes at least six eligible unique subject methods
-- across all three M16 constructs and no change to the 15-question quota.
do $pedguli_v4_count$
declare n int;
begin
 select count(distinct q.construct_id) into n from public.questions q
 join public.constructs c on c.id=q.construct_id and c.is_active
 where q.group_code='PM.MET' and q.status='published'
   and q.source_reference is not null and q.source_lesson_id is not null;
 if n<>3 then raise exception 'expected 3 distinct M16 constructs, got %',n;end if;
end
$pedguli_v4_count$;
rollback;