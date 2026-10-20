-- TASK-305: immutable remediation, private QA queue, universal lock and mock gate.
begin;

do $task305_test$
declare
  v_legacy integer;
  v_revisions integer;
  v_definition text;
begin
  if has_table_privilege('anon','public.question_quality_findings','SELECT')
     or has_table_privilege('authenticated','public.question_quality_findings','SELECT')
     or has_table_privilege('anon','public.question_bank_revisions','SELECT')
     or has_table_privilege('authenticated','public.question_bank_revisions','SELECT')
  then
    raise exception 'TASK-305 private quality evidence leaked to learners';
  end if;

  select count(*) into v_legacy
  from public.questions q
  where q.format='Y2'::public.question_format
    and q.status in ('published'::public.content_status,'review'::public.content_status)
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='a')=8;
  if v_legacy<>0 then
    raise exception 'TASK-305 still has % active legacy all-a Y2 rows',v_legacy;
  end if;

  select count(*) into v_revisions
  from public.question_bank_revisions r
  join public.questions q on q.id=r.revision_question_id
  where r.revision_kind='legacy_y2_native_sides'
    and q.status='review'::public.content_status
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='a')=4
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='b')=4;
  if v_revisions<>26 then
    raise exception 'TASK-305 expected 26 native Y2 review revisions, found %',v_revisions;
  end if;

  if exists (
    select 1 from public.question_bank_revisions r
    join public.questions oldq on oldq.id=r.source_question_id
    where r.revision_kind='legacy_y2_native_sides'
      and oldq.status<>'archived'::public.content_status
  ) then
    raise exception 'TASK-305 legacy Y2 source revision was not archived';
  end if;

  if (select count(*) from public.question_quality_published_revisions r
      join public.questions q on q.id=r.question_id
      where q.status='published'::public.content_status)
     <>(select count(*) from public.questions
        where status='published'::public.content_status)
  then
    raise exception 'TASK-305 did not snapshot every current published question';
  end if;

  if not exists (
    select 1 from public.question_quality_findings
    where finding_code='editorial_evidence_missing' and resolved_at is null
  ) or not exists (
    select 1 from public.question_quality_findings
    where finding_code='y1_answer_length_high_risk'
      and severity='high' and resolved_at is null
  ) then
    raise exception 'TASK-305 truthful editorial/length queues are empty';
  end if;

  if exists (
    select 1 from public.questions q
    join public.question_quality_findings f on f.question_id=q.id
    where q.status='published'::public.content_status
      and f.finding_code='y1_answer_length_high_risk'
      and f.resolved_at is null
      and public.is_question_official_mock_eligible(q.id)
  ) then
    raise exception 'TASK-305 high-risk length cue remained mock eligible';
  end if;

  select pg_get_functiondef(p.oid) into strict v_definition
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='generate_official_mock'
    and pg_get_function_identity_arguments(p.oid)='';
  if position('official-mock-v4' in v_definition)=0
     or position('is_question_official_mock_eligible' in v_definition)=0 then
    raise exception 'TASK-305 official mock v4 quality gate is missing';
  end if;

  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    where c.oid='public.questions'::regclass
      and t.tgname='universal_question_publish_guard'
      and not t.tgisinternal
  ) then
    raise exception 'TASK-305 universal publication trigger missing';
  end if;
end
$task305_test$;

select 'task305_question_bank_remediation_ok' as result;
rollback;
