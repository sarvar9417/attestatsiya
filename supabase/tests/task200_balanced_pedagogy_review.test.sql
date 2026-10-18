-- TASK-200: balance + provenance + review-only invariants for the 15-item batch.
do $test200$
declare n int;
begin
 if not exists(select 1 from public.pedagogy_pdf_source_candidates) then
   if exists(select 1 from public.questions where source_reference like 'authored:pedagogy-pdf-corpus:v3:%') then
     raise exception 'TASK-200: orphan review batch without private source records';
   end if;
   raise notice 'TASK-200: no private PDF inbox in clean CI database; review batch QA deferred';
   return;
 end if;
 select count(*) into n from public.questions
 where source_reference like 'authored:pedagogy-pdf-corpus:v3:%';
 if n<>15 then raise exception 'TASK-200: expected 15, got %',n; end if;
 if exists(
   select 1 from public.questions q
   left join public.constructs c on c.id=q.construct_id and c.is_active=true
   where q.source_reference like 'authored:pedagogy-pdf-corpus:v3:%'
   and (q.status<>'review'::public.content_status or c.id is null
        or q.source_lesson_id is null
        or not exists(select 1 from public.lesson_constructs lc
            where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id))
 ) then raise exception 'TASK-200: content status or taxonomy invalid'; end if;
 if exists(
   select 1 from public.questions q
   left join public.question_keys k on k.question_id=q.id
   where q.source_reference like 'authored:pedagogy-pdf-corpus:v3:%'
   and (k.question_id is null
        or (select count(*) from public.question_options o where o.question_id=q.id)<>4
        or not exists (select 1 from public.question_options o
            where o.question_id=q.id and o.id::text=k.payload->>'correct_option_id'))
 ) then raise exception 'TASK-200: options or server key invalid'; end if;
 if exists (
   with item as (
     select q.id,k.payload->>'correct_option_id' as keyid,o.id as oid,
       array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1) as wc
     from public.questions q
     join public.question_keys k on k.question_id=q.id
     join public.question_options o on o.question_id=q.id
     where q.source_reference like 'authored:pedagogy-pdf-corpus:v3:%'
   ), oneq as (
     select id,min(wc) as minwc,max(wc) as maxwc,
       max(wc) filter(where oid::text=keyid) as cw,
       max(wc) filter(where oid::text<>keyid) as maxwrong
     from item group by id
   )
   select 1 from oneq
    where minwc<2 or maxwc>minwc*1.8 or cw>maxwrong*1.25
 ) then raise exception 'TASK-200: option word-length balance failed'; end if;
 if exists (
   select 1 from public.pedagogy_pdf_source_candidates p
   join public.questions q on q.id=p.linked_question_id
   where q.source_reference like 'authored:pedagogy-pdf-corpus:v3:%'
     and (p.editorial_status<>'verified'
          or p.answer_key_status<>'independently_verified'
          or p.mapped_construct_id<>q.construct_id)
 ) then raise exception 'TASK-200: source key or mapping invalid'; end if;
 if (select count(*) from public.pedagogy_pdf_source_candidates p
     join public.questions q on q.id=p.linked_question_id
     where q.source_reference like 'authored:pedagogy-pdf-corpus:v3:%')<>15
 then raise exception 'TASK-200: not all items have linked source provenance'; end if;
end $test200$;
