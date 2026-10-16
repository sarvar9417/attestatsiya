-- All 120 original professional exercises must resolve to the *same*
-- canonical lesson shown to students in TopicView, not historical legacy rows.
-- Does not read/reproduce original Telegram text.
begin;
do $all_professional_link_test$
declare
 v_total integer;v_group record;v_missing integer;v_wrong integer;v_constructs integer;
begin
 select count(*) into v_total from public.questions q
 where q.source_reference like 'authored:professional-15:v1:%'
 or q.source_reference like 'authored:pedguli-topic-study:v2:%'
 or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
 or q.source_reference like 'authored:pedguli-topic-audit:v4:%';
 if v_total<>120 then raise exception 'expected 120 original professional questions, got %',v_total;end if;
 for v_group in select * from (values('KS'::text,34),('PM.GEN'::text,56),('PM.MET'::text,30)) v(code,n)
 loop
  select count(*) into v_wrong from public.questions q
  where q.group_code=v_group.code and (
   q.source_reference like 'authored:professional-15:v1:%'
   or q.source_reference like 'authored:pedguli-topic-study:v2:%'
   or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
   or q.source_reference like 'authored:pedguli-topic-audit:v4:%'
  );
  if v_wrong<>v_group.n then
   raise exception 'authored % quota wrong, expected %, got %',v_group.code,v_group.n,v_wrong;end if;
 end loop;
 with authored as (
  select q.* from public.questions q
  where q.source_reference like 'authored:professional-15:v1:%'
     or q.source_reference like 'authored:pedguli-topic-study:v2:%'
     or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
     or q.source_reference like 'authored:pedguli-topic-audit:v4:%'
 )
 select count(*) into v_missing from authored q
 where not exists (
   select 1 from public.lessons l
   join public.lesson_constructs lc on lc.lesson_id=l.id
   join public.modules m on m.id=l.module_id
   where l.id=q.source_lesson_id and lc.construct_id=q.construct_id
     and m.code in ('M14','M15','M16')
     and l.status='published'::public.content_status
     and l.order_idx between 1 and 8
     and l.slug !~ '^m(14|15|16)-[0-9]+$'
 );
 if v_missing<>0 then raise exception '% questions lack canonical lessons',v_missing;end if;

 select count(distinct c.code) into v_constructs
 from public.questions q join public.constructs c on c.id=q.construct_id
 where q.source_reference like 'authored:professional-15:v1:%'
    or q.source_reference like 'authored:pedguli-topic-study:v2:%'
    or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
    or q.source_reference like 'authored:pedguli-topic-audit:v4:%';
 if v_constructs<>18 then raise exception 'professional bank must cover 18 constructs, got %',v_constructs;end if;
end
$all_professional_link_test$;
rollback;