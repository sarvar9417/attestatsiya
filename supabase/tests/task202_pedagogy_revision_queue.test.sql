-- TASK-202 remediation is review-only, atomic, actor-bound, and idempotent.
begin;
insert into auth.users(id,email)
values('92800000-0000-4000-8000-000000000001','task202-editor@example.test');
update public.profiles set role='admin',is_blocked=false
where id='92800000-0000-4000-8000-000000000001';
do $test$
declare v_old uuid; v_new uuid; v_retry uuid; v_bad boolean; v_old_key uuid; v_new_key uuid;
begin
 select source_question_id into v_old from public.pedagogy_revision_queue
 order by source_question_id limit 1;
 if v_old is null then
   raise notice 'TASK202: clean seeded dataset has no published Y1 length bias';
   return;
 end if;
 v_new:=public.stage_pedagogy_revision(
   v_old,'92800000-0000-4000-8000-000000000001');
 v_retry:=public.stage_pedagogy_revision(
   v_old,'92800000-0000-4000-8000-000000000001');
 if v_new<>v_retry then raise exception 'TASK202: duplicate revision created';end if;
 if not exists(select 1 from public.questions where id=v_new and status='review'
   and author_id='92800000-0000-4000-8000-000000000001'
   and source_reference='revision:pedagogy:'||v_old::text) then
   raise exception 'TASK202: review-only or provenance invariant failed';
 end if;
 if (select count(*) from public.question_options where question_id=v_new)<>4 then
   raise exception 'TASK202: revised option count is not four';
 end if;
 select (payload->>'correct_option_id')::uuid into strict v_old_key
   from public.question_keys where question_id=v_old;
 select (payload->>'correct_option_id')::uuid into strict v_new_key
   from public.question_keys where question_id=v_new;
 if v_old_key=v_new_key or
   (select content_md from public.question_options where id=v_old_key) <>
   (select content_md from public.question_options where id=v_new_key)
 then raise exception 'TASK202: option remap or key changed meaning';end if;
 v_bad:=false;
 begin
   update public.questions set status='published' where id=v_new;
 exception when check_violation then v_bad:=true;
 end;
 if not v_bad then raise exception 'TASK202: unapproved duplicate published';end if;
 v_bad:=false;
 begin
   update public.questions set stem_md=stem_md||' illegally modified' where id=v_old;
 exception when check_violation then v_bad:=true;
 end;
 if not v_bad then raise exception 'TASK202: published original changed';end if;
 if not exists(select 1 from public.pedagogy_revision_queue
     where source_question_id=v_old and revision_question_id=v_new)
 then raise exception 'TASK202: queue link lost';end if;
end $test$;
rollback;
