-- Quarantine five historical, source-less demo questions. DOES NOT DELETE.
-- Intended for a future release after explicit user signoff; CI dry staging only.
-- Abort on any linked learner attempt, report, mastery or item statistics.
begin;
do $legacy_source_guard$
declare
 v_outsiders int;
 v_affected int;
 v_referenced int;
begin
 select count(*) into v_outsiders
 from public.questions q
 where q.status='published'::public.content_status
   and coalesce(btrim(q.source_reference),'')=''
   and q.id not in (
    '00000000-0000-0000-0000-0000a0a00001'::uuid,
    '00000000-0000-0000-0000-0000a0a00002'::uuid,
    '00000000-0000-0000-0000-0000a0a00003'::uuid,
    '00000000-0000-0000-0000-0000a0a00004'::uuid,
    '00000000-0000-0000-0000-0000a0a00005'::uuid
   );
 if v_outsiders<>0 then
  raise exception 'Unexpected source-less published question(s): %, manual investigation needed',v_outsiders;
 end if;

 select count(*) into v_referenced
 from public.questions q
 where q.id in (
    '00000000-0000-0000-0000-0000a0a00001'::uuid,
    '00000000-0000-0000-0000-0000a0a00002'::uuid,
    '00000000-0000-0000-0000-0000a0a00003'::uuid,
    '00000000-0000-0000-0000-0000a0a00004'::uuid,
    '00000000-0000-0000-0000-0000a0a00005'::uuid
 )
 and (
  exists(select 1 from public.exam_items e where e.question_id=q.id)
  or exists(select 1 from public.mastery_evidence e where e.question_id=q.id)
  or exists(select 1 from public.question_reports e where e.question_id=q.id)
  or exists(select 1 from public.question_stats e where e.question_id=q.id)
 );
 if v_referenced<>0 then
  raise exception 'Legacy demo question(s) referenced by learner data: %; no automatic archive',v_referenced;
 end if;

 update public.questions q
 set status='archived'::public.content_status,updated_at=now()
 where q.id in (
    '00000000-0000-0000-0000-0000a0a00001'::uuid,
    '00000000-0000-0000-0000-0000a0a00002'::uuid,
    '00000000-0000-0000-0000-0000a0a00003'::uuid,
    '00000000-0000-0000-0000-0000a0a00004'::uuid,
    '00000000-0000-0000-0000-0000a0a00005'::uuid
 )
 and q.status='published'::public.content_status
 and coalesce(btrim(q.source_reference),'')='';
 get diagnostics v_affected = row_count;
 raise notice 'Archived source-less legacy examples without deleting data: %',v_affected;
end
$legacy_source_guard$;
commit;