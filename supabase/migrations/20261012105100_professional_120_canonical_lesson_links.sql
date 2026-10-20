-- Canonical topic links for all 120 independently authored professional questions.
-- v1 initially selected any published lesson by UUID, possibly a legacy lesson.
-- Rebind only source_lesson_id, never change question IDs, answers or attempts.
-- Stage for explicit user production approval only.
begin;
do $canonical_rebind$
declare v_expected int; v_missing int; v_ambiguous int;
begin
 with canonical as (
  select c.id construct_id,count(distinct l.id) n
  from public.constructs c
  join public.lesson_constructs lc on lc.construct_id=c.id
  join public.lessons l on l.id=lc.lesson_id
  join public.modules m on m.id=l.module_id
  where m.code in ('M14','M15','M16')
    and l.status='published'::public.content_status
    and l.order_idx between 1 and 8
    and l.slug !~ '^m(14|15|16)-[0-9]+$'
  group by c.id
 )
 select count(*),count(*) filter(where n<>1) into v_expected,v_ambiguous from canonical;
 if v_expected<>18 or v_ambiguous<>0 then
   raise exception 'professional canonical lesson coverage expected 18 single-mapped constructs, found %, ambiguous %',
     v_expected,v_ambiguous;
 end if;

 with canonical as (
  select c.id construct_id,l.id lesson_id
  from public.constructs c
  join public.lesson_constructs lc on lc.construct_id=c.id
  join public.lessons l on l.id=lc.lesson_id
  join public.modules m on m.id=l.module_id
  where m.code in ('M14','M15','M16')
    and l.status='published'::public.content_status
    and l.order_idx between 1 and 8
    and l.slug !~ '^m(14|15|16)-[0-9]+$'
 )
 update public.questions q
 set source_lesson_id=canonical.lesson_id,updated_at=now()
 from canonical
 where q.construct_id=canonical.construct_id
   and q.status='published'::public.content_status
   and (
     q.source_reference like 'authored:professional-15:v1:%'
     or q.source_reference like 'authored:pedguli-topic-study:v2:%'
     or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
     or q.source_reference like 'authored:pedguli-topic-audit:v4:%'
   )
   and q.source_lesson_id is distinct from canonical.lesson_id;

 with eligible as (
 select q.id,c.id as construct_id
 from public.questions q
 join public.constructs c on c.id=q.construct_id
 where q.source_reference like 'authored:professional-15:v1:%'
 or q.source_reference like 'authored:pedguli-topic-study:v2:%'
 or q.source_reference like 'authored:pedguli-html-concepts:v3:%'
 or q.source_reference like 'authored:pedguli-topic-audit:v4:%'
 )
 select count(*) into v_missing from eligible e
 join public.questions q on q.id=e.id
 where not exists(select 1 from public.lesson_constructs lc
  join public.lessons l on l.id=lc.lesson_id
  join public.modules m on m.id=l.module_id
  where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
   and m.code in ('M14','M15','M16') and l.order_idx between 1 and 8
   and l.slug !~ '^m(14|15|16)-[0-9]+$');
 if v_missing<>0 then
  raise exception 'authored question is not linked to canonical professional lesson: %',v_missing;
 end if;
end
$canonical_rebind$;
commit;