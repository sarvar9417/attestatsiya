begin;
do $fixture_guard$
declare v_status text;v_invalid int;
begin
 select status::text into v_status from public.questions
 where id='00000000-0000-0000-0000-0000a0a00001'::uuid;
 if v_status is distinct from 'archived' then
   raise exception 'Source-less demonstration item was not safely archived: %',v_status;
 end if;
 select count(*) into v_invalid from public.questions
 where status='published'::public.content_status
 and coalesce(btrim(source_reference),'')='';
 if v_invalid<>0 then
  raise exception '% published source-less question(s) still accessible after quarantine',v_invalid;
 end if;
end
$fixture_guard$;
rollback;