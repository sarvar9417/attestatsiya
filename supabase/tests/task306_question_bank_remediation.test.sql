-- TASK-306: immutable remediation, private QA queue, universal lock and mock gate.
begin;

do $task306_test$
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
    raise exception 'TASK-306 private quality evidence leaked to learners';
  end if;

  if has_function_privilege(
       'anon','public.fill_question_editorial_fingerprint()','EXECUTE'
     ) or has_function_privilege(
       'authenticated','public.fill_question_editorial_fingerprint()','EXECUTE'
     )
  then
    raise exception 'TASK-306 internal editorial trigger leaked as an RPC';
  end if;

  select count(*) into v_legacy
  from public.questions q
  where q.format='Y2'::public.question_format
    and q.status='review'::public.content_status
    and (select count(*) from public.question_options o
         where o.question_id=q.id and o.side='a')=8;
  if v_legacy<>0 then
    raise exception 'TASK-306 still has % review legacy all-a Y2 rows',v_legacy;
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
  if v_revisions=0 then
    raise exception 'TASK-306 expected native Y2 review revisions in the fresh seed';
  end if;

  if exists (
    select 1 from public.question_bank_revisions r
    join public.questions oldq on oldq.id=r.source_question_id
    where r.revision_kind='legacy_y2_native_sides'
      and (
        (r.evidence->>'source_status'='published'
         and oldq.status<>'published'::public.content_status)
        or (r.evidence->>'source_status'='review'
            and oldq.status<>'archived'::public.content_status)
      )
  ) then
    raise exception 'TASK-306 legacy Y2 source lifecycle is invalid';
  end if;

  if exists (
    select 1 from public.questions oldq
    where oldq.status='published'::public.content_status
      and oldq.format='Y2'::public.question_format
      and (select count(*) from public.question_options o
           where o.question_id=oldq.id and o.side='a')=8
      and not exists (
        select 1 from public.question_bank_revisions r
        join public.questions revision_q on revision_q.id=r.revision_question_id
        where r.source_question_id=oldq.id
          and r.revision_kind='legacy_y2_native_sides'
          and revision_q.status='review'::public.content_status
          and (select count(*) from public.question_options o
               where o.question_id=revision_q.id and o.side='a')=4
          and (select count(*) from public.question_options o
               where o.question_id=revision_q.id and o.side='b')=4
      )
  ) then
    raise exception 'TASK-306 published legacy Y2 lacks a native review successor';
  end if;

  if (select count(*) from public.question_quality_published_revisions r
      join public.questions q on q.id=r.question_id
      where q.status='published'::public.content_status)
     <>(select count(*) from public.questions
        where status='published'::public.content_status)
  then
    raise exception 'TASK-306 did not snapshot every current published question';
  end if;

  if not exists (
    select 1 from public.question_quality_findings
    where finding_code='editorial_evidence_missing' and resolved_at is null
  ) or not exists (
    select 1 from public.question_quality_findings
    where finding_code='y1_answer_length_high_risk'
      and severity='high' and resolved_at is null
  ) then
    raise exception 'TASK-306 truthful editorial/length queues are empty';
  end if;

  if exists (
    select 1 from public.questions q
    join public.question_quality_findings f on f.question_id=q.id
    where q.status='published'::public.content_status
      and f.finding_code='y1_answer_length_high_risk'
      and f.resolved_at is null
      and public.is_question_official_mock_eligible(q.id)
  ) then
    raise exception 'TASK-306 high-risk length cue remained mock eligible';
  end if;

  select pg_get_functiondef(p.oid) into strict v_definition
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='generate_official_mock'
    and pg_get_function_identity_arguments(p.oid)='';
  if position('official-mock-v4' in v_definition)=0
     or position('is_question_official_mock_eligible' in v_definition)=0 then
    raise exception 'TASK-306 official mock v4 quality gate is missing';
  end if;

  if not exists (
    select 1 from pg_trigger t
    join pg_class c on c.oid=t.tgrelid
    where c.oid='public.questions'::regclass
      and t.tgname='universal_question_publish_guard'
      and not t.tgisinternal
  ) then
    raise exception 'TASK-306 universal publication trigger missing';
  end if;
end
$task306_test$;

select 'task306_question_bank_remediation_ok' as result;
rollback;
