-- TASK-202: a signed revision publishes AND archives the source in one DB transaction.
-- Fixture edits are synthetic and rolled back; this is NOT editorial approval.
begin;
insert into auth.users(id,email) values
('92800000-0000-4000-8000-000000000011','task202-author@example.test'),
('92800000-0000-4000-8000-000000000012','task202-approver@example.test');
update public.profiles set role='admin',is_blocked=false where id in (
'92800000-0000-4000-8000-000000000011',
'92800000-0000-4000-8000-000000000012');
do $test$
declare v_old uuid;v_new uuid;v_count int;v_err boolean;
begin
 select source_question_id into v_old from public.pedagogy_revision_queue
 where revision_question_id is null order by source_question_id limit 1;
 if v_old is null then
    raise notice 'TASK202: empty fixture queue, atomism check deferred';
    return;
 end if;
 v_new:=public.stage_pedagogy_revision(
  v_old,'92800000-0000-4000-8000-000000000011');
 update public.question_options
 set content_md=case order_idx
 when 0 then 'Pedagogik vazifa uchun namunaviy yondashuv'
 when 1 then 'Pedagogik vazifa uchun boshqa bir yondashuv'
 when 2 then 'Pedagogik mashg‘ulotda o‘zgacha bir metod tanlash'
 else 'Pedagogik jarayonni umumiy usulda baholash' end
 where question_id=v_new and side='a';
 insert into public.question_editorial_checks(
  question_id,reviewer_id,answer_verified,reference_verified,
  wording_verified,original_authorship_verified,reviewer_notes,content_fingerprint)
 values(v_new,'92800000-0000-4000-8000-000000000012',
 true,true,true,true,
 'TEST FIXTURE ONLY — review signature and content fingerprint for atomicity check.',
 'trigger-will-stamp');

 perform public.publish_pedagogy_revision(
  v_new,'92800000-0000-4000-8000-000000000012');
 if (select status from public.questions where id=v_new)<>'published'::public.content_status
 or (select status from public.questions where id=v_old)<>'archived'::public.content_status
 then raise exception 'TASK202: source and replacement were not atomically transitioned';end if;
 select count(*) into v_count from public.pedagogy_published_revisions
 where question_id in(v_old,v_new);
 if v_count<>2 then raise exception 'TASK202: new publication snapshot missing';end if;
 v_err:=false;
 begin
   perform public.publish_pedagogy_revision(v_new,'92800000-0000-4000-8000-000000000012');
 exception when check_violation then v_err:=true;
 end;
 if not v_err then raise exception 'TASK202: double publish accepted';end if;
end $test$;
rollback;
