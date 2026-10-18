-- TASK-203 smoke invariants. Run after draft migration on a disposable DB.
do $qa$
declare n int;
begin
 select count(*) into n from public.lessons where slug like 'scratch-logo-v2-%' and status='draft';
 if n <> 6 then raise exception 'TASK-203 expected 6 draft lessons, got %',n; end if;
 select count(*) into n from public.questions where source_reference like 'scratch-logo-v2:SL2-%' and status='draft';
 if n <> 180 then raise exception 'TASK-203 expected 180 draft questions, got %',n; end if;
 select count(*) into n from public.questions q left join public.question_keys k on k.question_id=q.id
 where q.source_reference like 'scratch-logo-v2:SL2-%' and k.question_id is null;
 if n <> 0 then raise exception 'TASK-203 % missing answer keys',n; end if;
 select count(*) into n from (select q.id,count(o.id) c from public.questions q left join public.question_options o on o.question_id=q.id
 where q.source_reference like 'scratch-logo-v2:SL2-%' group by q.id) z
 where (z.c not in (3,4,6));
 if n <> 0 then raise exception 'TASK-203 invalid option counts: %',n; end if;
 select count(*) into n from public.questions q join public.lessons l on l.id=q.source_lesson_id
 where q.source_reference like 'scratch-logo-v2:SL2-%' and l.module_id<>(select id from public.modules where code='M07');
 if n <> 0 then raise exception 'TASK-203 % incorrectly mapped lessons',n; end if;
 select count(*) into n from public.questions q where q.source_reference like 'scratch-logo-v2:SL2-%' and q.status='published';
 if n<>0 then raise exception 'TASK-203 published content without human approval'; end if;
end
$qa$;