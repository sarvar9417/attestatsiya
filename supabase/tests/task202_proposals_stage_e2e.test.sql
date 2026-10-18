-- TASK-202: model-authored suggestions must stage as REVIEW and never rewrite original.
begin;
insert into auth.users(id,email)
values('92a00000-0000-4000-8000-000000000001','task202-suggestion-editor@example.test');
update public.profiles set role='admin',is_blocked=false
where id='92a00000-0000-4000-8000-000000000001';
do $stage_test$
declare actor uuid:='92a00000-0000-4000-8000-000000000001';
 src uuid; rev uuid; suggested text[]; matched int;
begin
 select source_question_id,proposed_distractors into strict src,suggested
 from public.pedagogy_rewrite_proposals order by source_question_id limit 1;
 rev:=public.stage_pedagogy_revision(src,actor);
 if rev=src then raise exception 'TASK202 revision reused old ID';end if;
 if (select status from public.questions where id=src)
     <>'published'::public.content_status
   or (select status from public.questions where id=rev)
     <>'review'::public.content_status
 then raise exception 'TASK202 source or staged status invalid';end if;
 select count(*) into matched from public.question_options
 where question_id=rev and content_md=any(suggested);
 if matched<>3 then raise exception 'TASK202 staged revision not using 3 balanced proposals';end if;
 if (select k.explanation_md from public.question_keys k where k.question_id=src)
  is distinct from (select k.explanation_md from public.question_keys k where k.question_id=rev)
 then raise exception 'TASK202 answer explanation not preserved';end if;
 if (select o.content_md from public.question_options o
     join public.question_keys k on k.question_id=o.question_id
     where o.question_id=rev and o.id::text=k.payload->>'correct_option_id')
  is distinct from
   (select o.content_md from public.question_options o
     join public.question_keys k on k.question_id=o.question_id
     where o.question_id=src and o.id::text=k.payload->>'correct_option_id')
 then raise exception 'TASK202 correct answer changed in draft';end if;
end $stage_test$;
rollback;