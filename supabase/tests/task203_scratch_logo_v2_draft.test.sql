-- TASK-203 smoke invariants. Run after draft migration on a disposable DB.
do $qa$
declare n int; v_existing int;
begin
 -- On a production DB with the already published SL2 bank, verify consistency
 -- and do not require a duplicate draft copy. On a clean DB, exercise drafts.
 select count(*) into v_existing from public.questions
 where source_reference like 'Scratch-LOGO-2026-v2:SL2-%'
   and status='published'::public.content_status;
 if v_existing > 0 then
   if v_existing<>180 then raise exception 'partial published SL2 bank (%)',v_existing; end if;
   select count(*) into n from public.questions q
     join public.question_keys k on k.question_id=q.id
     join public.question_options o on o.id=(k.payload->>'correct_option_id')::uuid
     where q.source_reference like 'Scratch-LOGO-2026-v2:SL2-%' and q.status='published';
   if n<>180 then raise exception 'invalid published SL2 keys (%)',n; end if;
   select count(*) into n from public.lessons
   where module_id=(select id from public.modules where code='M07')
     and order_idx between 1 and 6 and status='published'
     and length(coalesce(body_mdx,''))>1000;
   if n<>6 then raise exception 'missing published theory chapters (%)',n; end if;
   select count(*) into n from public.questions
     where source_reference like 'scratch-logo-v2:SL2-%';
   if n<>0 then raise exception 'duplicate review bank created in published DB (%)',n; end if;
   return;
 end if;
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

 -- Verify native Y1/Y2/Y3 option arity, key shape, key references, and round-trip scoring.
 if exists (
   select 1 from public.questions q
   join public.question_keys k on k.question_id=q.id
   where q.source_reference like 'scratch-logo-v2:SL2-%'
     and (
       (q.format='Y1'::public.question_format and (
         (select count(*) from public.question_options o where o.question_id=q.id)<>4
         or not exists(select 1 from public.question_options o where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id')
       ))
       or (q.format='Y2'::public.question_format and (
         (select count(*) from public.question_options o where o.question_id=q.id)<>6
         or (select count(*) from jsonb_each(k.payload->'pairs'))<>3
         or not public.check_answer(q.format,k.payload,k.payload)
       ))
       or (q.format='Y3'::public.question_format and (
         (select count(*) from public.question_options o where o.question_id=q.id)<>3
         or jsonb_array_length(k.payload->'order')<>3
         or not public.check_answer(q.format,k.payload,k.payload)
       ))
     )
 ) then raise exception 'TASK-203 native question answer payload validation failed'; end if;
 -- No key may point outside its own question.
 if exists (
   select 1 from public.questions q
   join public.question_keys k on k.question_id=q.id
   where q.source_reference like 'scratch-logo-v2:SL2-%'
     and (q.format='Y2'::public.question_format or q.format='Y3'::public.question_format)
     and exists (
       select 1 from jsonb_array_elements_text(
         case when q.format='Y3'::public.question_format then k.payload->'order'
              else (select jsonb_agg(key) from jsonb_each(k.payload->'pairs'))
         end
       ) s(opt_id)
       where not exists (select 1 from public.question_options o where o.question_id=q.id and o.id::text=s.opt_id)
     )
 ) then raise exception 'TASK-203 answer key UUID missing from own question'; end if;
 -- New draft questions retain canonical M07 source links to avoid published lesson drift.
 if exists (
   select 1 from public.questions q
   left join public.lesson_constructs lc on lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
   join public.lessons l on l.id=q.source_lesson_id
   where q.source_reference like 'scratch-logo-v2:SL2-%'
     and (l.status<>'published'::public.content_status or lc.lesson_id is null)
 ) then raise exception 'TASK-203 canonical M07 source mapping broken'; end if;
end
$qa$;