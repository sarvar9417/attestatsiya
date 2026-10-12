-- Verify 24 independently authored pedagogy questions derived from topic review.
-- Original Telegram post texts are not imported; user production release required.
begin;
do $qa$
declare
  v_count integer;
  v_group record;
  v_bad integer;
begin
  select count(*) into v_count from public.questions
  where source_reference like 'authored:pedguli-html-concepts:v3:%';
  if v_count<>24 then raise exception 'expected 24 Guli HTML thematic originals, found %',v_count; end if;

  for v_group in select * from (values('KS'::text,4),('PM.GEN'::text,18),('PM.MET'::text,2)) t(code,n)
  loop
    select count(*) into v_count from public.questions q
     where q.source_reference like 'authored:pedguli-html-concepts:v3:%'
       and q.group_code=v_group.code;
    if v_count<>v_group.n then
      raise exception 'Guli HTML bank % quota expected %, got %',v_group.code,v_group.n,v_count;
    end if;
  end loop;

  select count(*) into v_bad from public.questions q
    left join public.question_keys k on k.question_id=q.id
    left join public.constructs c on c.id=q.construct_id
    left join public.lessons l on l.id=q.source_lesson_id
   where q.source_reference like 'authored:pedguli-html-concepts:v3:%'
   and (
      k.question_id is null or c.id is null or not c.is_active or q.group_code<>c.group_code
      or l.id is null or l.status<>'published'::public.content_status
      or not exists(select 1 from public.lesson_constructs lc
                    where lc.lesson_id=l.id and lc.construct_id=q.construct_id)
      or q.format<>'Y1'::public.question_format
      or q.status<>'review'::public.content_status
      or (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')<>4
      or (select count(distinct content_md) from public.question_options o
          where o.question_id=q.id and o.side='a')<>4
      or not exists(select 1 from public.question_options o
                    where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id')
      or length(coalesce(k.explanation_md,''))<20
   );
  if v_bad<>0 then raise exception 'Guli HTML bank invalid item(s): %',v_bad; end if;

  if (select count(*) from (
    select lower(trim(stem_md)) s from public.questions
    where source_reference like 'authored:pedguli-html-concepts:v3:%'
    group by lower(trim(stem_md)) having count(*)>1
  ) duplicate_stems)>0 then
    raise exception 'duplicate Guli HTML original question stems'; end if;
end
$qa$;
rollback;