-- Editorial safety must be enforced in PostgreSQL, even for service-role
-- writes that bypass the Fastify admin endpoints. All edits roll back.
begin;
do $review_gate_test$
declare
  v_question uuid:='79000000-0000-4000-8000-000000000101';
  v_reviewer uuid:='79400000-0000-4000-8000-000000000001';
  v_original text;
  v_failed boolean;
  v_count int;
begin
  select stem_md into strict v_original from public.questions where id=v_question;
  select count(*) into v_count from public.questions
   where source_reference like 'authored:pedguli-%'
   and status='review'::public.content_status;
  if v_count<>84 then raise exception '84 reviewed-only candidates expected, found %',v_count; end if;
  if (select count(*) from public.questions
      where source_reference like 'authored:professional-15:v1:%'
        and status='published'::public.content_status)<>36
  then raise exception '36 published baseline questions must remain available';end if;

  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_question;
  exception when check_violation then
    v_failed:=true;
  end;
  if not v_failed then raise exception 'Unsigned question reached published status';end if;

  insert into auth.users(id,email) values (v_reviewer,'pedguli-qa-local@example.test');

  insert into public.question_editorial_checks(
    question_id,reviewer_id,answer_verified,reference_verified,
    wording_verified,original_authorship_verified,reviewer_notes,content_fingerprint)
  values (
    v_question,v_reviewer,false,true,true,true,
    'Method/source note checked locally, answer NOT independently verified.','ignored-by-trigger'
  );
  if (select content_fingerprint from public.question_editorial_checks
      where question_id=v_question)
     <> public.professional_question_fingerprint(v_question)
  then raise exception 'Fingerprint not stamped by DB'; end if;

  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_question;
  exception when check_violation then v_failed:=true; end;
  if not v_failed then raise exception 'Incomplete signoff did not block publication';end if;

  update public.question_editorial_checks
     set answer_verified=true,
         reviewer_notes='Answer checked against the canonical lesson and evidence; source and originality reviewed.'
   where question_id=v_question;

  update public.questions set stem_md=stem_md||' - changed after review' where id=v_question;
  v_failed:=false;
  begin
    update public.questions set status='published'::public.content_status where id=v_question;
  exception when check_violation then v_failed:=true; end;
  if not v_failed then raise exception 'Question modified after approval still published';end if;

  update public.questions set stem_md=v_original where id=v_question;
  update public.questions set status='published'::public.content_status where id=v_question;
  if (select status from public.questions where id=v_question) <> 'published'
  then raise exception 'Complete, unchanged question could not publish'; end if;

  v_failed:=false;
  begin
    update public.questions set stem_md=stem_md||' changed' where id=v_question;
  exception when check_violation then v_failed:=true; end;
  if not v_failed then raise exception 'Published question stem was unexpectedly editable'; end if;

  v_failed:=false;
  begin
    update public.question_keys set explanation_md=explanation_md||' updated'
    where question_id=v_question;
  exception when check_violation then v_failed:=true; end;
  if not v_failed then raise exception 'Published answer key was unexpectedly editable'; end if;

  v_failed:=false;
  begin
    update public.question_options set content_md=content_md||' updated'
    where question_id=v_question and order_idx=1 and side='a';
  exception when check_violation then v_failed:=true; end;
  if not v_failed then raise exception 'Published options were unexpectedly editable'; end if;

  -- The original practice pool was available before any editorial approvals.
  if (select count(*) from public.questions
      where source_reference like 'authored:professional-15:v1:%'
        and status='published'::public.content_status)<>36
  then raise exception 'Baseline pool was accidentally changed';end if;
end
$review_gate_test$;
rollback;