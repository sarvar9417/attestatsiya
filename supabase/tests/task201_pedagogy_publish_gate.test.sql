-- TASK-201: DB-enforced editorial gate and immutable published revisions.
-- All fixtures and writes are rolled back; no production data changes.
begin;
do $qa$
declare
  v_q uuid;
  v_second uuid;
  v_existing uuid;
  v_reviewer uuid:='79400000-0000-4000-8000-000000000201';
  v_stem text;
  v_key_option uuid;
  v_failed boolean;
begin
  select id into strict v_q from public.questions
    where source_reference='authored:pedagogy-pdf-corpus:v1:PM.GEN.03:001';
  select id into strict v_second from public.questions
    where source_reference='authored:pedagogy-pdf-corpus:v1:PM.GEN.03:002';
  select id into strict v_existing from public.questions
    where source_reference like 'authored:professional-15:v1:%'
      and group_code='KS' and status='published'::public.content_status
    order by id limit 1;

  if not exists(select 1 from public.pedagogy_published_revisions where question_id=v_existing)
  then raise exception 'TASK201 old published item is not snapshotted';end if;

  -- Previously published baseline may not be modified in place.
  v_failed:=false;
  begin
    update public.questions set stem_md=stem_md||' changed' where id=v_existing;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 old published text is editable';end if;

  v_failed:=false;
  begin
    update public.question_options set content_md=content_md||' altered'
      where question_id=v_existing;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 old published options are editable';end if;

  -- Historical PDF review question MUST NOT reach published without human signoff.
  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_q;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 unsigned PDF source was published';end if;

  insert into auth.users(id,email) values(v_reviewer,'task201-reviewer@example.test');
  insert into public.question_editorial_checks(
    question_id,reviewer_id,answer_verified,reference_verified,
    wording_verified,original_authorship_verified,reviewer_notes,content_fingerprint
  ) values(v_q,v_reviewer,false,true,true,true,
    'Reviewed original pedagogy source, but answer has not been checked.',
    'trigger-will-stamp');

  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_q;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 incomplete human approval passed';end if;

  update public.question_editorial_checks
     set answer_verified=true,
         reviewer_notes='Independently checked answer and canonical lesson, source, wording, provenance and authorship.'
    where question_id=v_q;
  select stem_md into v_stem from public.questions where id=v_q;
  update public.questions set stem_md=stem_md||' drift' where id=v_q;

  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_q;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 stale fingerprint passed';end if;
  update public.questions set stem_md=v_stem where id=v_q;

  -- Atomic edit+publish cannot reuse the signed fingerprint of previous text.
  v_failed:=false;
  begin
    update public.questions
      set stem_md=stem_md||' same-statement-change',
          status='published'::public.content_status where id=v_q;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 atomic edit-and-publish bypassed review';end if;

  -- Balanced question + intact fingerprint may be approved by independent reviewer.
  update public.questions set status='published'::public.content_status where id=v_q;
  if not exists(select 1 from public.pedagogy_published_revisions where question_id=v_q)
  then raise exception 'TASK201 newly published question has no immutable snapshot';end if;

  -- Archival is allowed, but editing an archived published revision is NOT.
  update public.questions set status='archived'::public.content_status where id=v_q;
  v_failed:=false;
  begin
    update public.questions set stem_md=stem_md||' changed after archival' where id=v_q;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 archived published text editable';end if;

  v_failed:=false;
  begin
    update public.question_keys set explanation_md=explanation_md||' altered'
      where question_id=v_q;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 archived published answer key editable';end if;

  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_q;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 archived snapshot was recycled';end if;

  -- Even a correctly signed question with a one-word outlier is blocked.
  update public.question_options set content_md='x'
    where question_id=v_second and order_idx=2 and side='a';
  insert into public.question_editorial_checks(
    question_id,reviewer_id,answer_verified,reference_verified,
    wording_verified,original_authorship_verified,reviewer_notes,content_fingerprint
  ) values(v_second,v_reviewer,true,true,true,true,
    'Examined the canonical source, distractor balance, answer key and authoring chain.',
    'trigger-will-stamp');
  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_second;
  exception when check_violation then v_failed:=true;end;
  if not v_failed then raise exception 'TASK201 unbalanced answer options were released';end if;

  -- Private fingerprint/lock tables are not exposed to learners.
  if has_table_privilege('authenticated','public.question_editorial_checks','SELECT')
     or has_table_privilege('anon','public.pedagogy_published_revisions','SELECT')
  then raise exception 'TASK201 private editorial evidence leaked';end if;
end
$qa$;
rollback;
