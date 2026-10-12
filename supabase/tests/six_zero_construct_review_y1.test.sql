-- Human-review-only lesson and question bank validation.
-- Does not certify question answers pedagogically correct; expert review pending.
begin;
do $six_gap_review_test$
declare rec record;cnt int;invalid int;
begin
 select count(*) into cnt from public.questions
 where source_reference like 'authored:zero-construct-y1:20261012:%';
 if cnt<>18 then raise exception 'Expected 18 review-only question drafts, got %',cnt;end if;
 for rec in select * from (values
  ('S3.ALGO.03'),('S3.LOGIC.01'),('S3.LOGIC.03'),
  ('S4.CODE.04'),('S6.NET.02'),('S6.NET.04')) t(code)
 loop
  select count(*) into cnt from public.questions q join public.constructs c on c.id=q.construct_id
  where c.code=rec.code and q.source_reference like 'authored:zero-construct-y1:20261012:%'
    and q.status='review'::public.content_status and q.format='Y1'::public.question_format;
  if cnt<>3 then raise exception 'Expected 3 unpublished review questions for %, got %',rec.code,cnt;end if;
 end loop;
 select count(*) into invalid
 from public.questions q
 where q.source_reference like 'authored:zero-construct-y1:20261012:%'
 and (
  q.status<>'review'::public.content_status
  or q.source_lesson_id is null
  or not exists (
    select 1 from public.lesson_constructs lc
    where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
  )
  or (select count(*) from public.question_options o where o.question_id=q.id and o.side='a')<>4
  or not exists (
    select 1 from public.question_keys k
    join public.question_options o
      on o.id=(k.payload->>'correct_option_id')::uuid
      and o.question_id=k.question_id
    where k.question_id=q.id and length(trim(k.explanation_md))>20
  )
 );
 if invalid<>0 then raise exception 'Invalid draft question shape or wrong source lesson: %',invalid;end if;

 if not exists(
  select 1 from public.lesson_constructs lc
  join public.lessons l on l.id=lc.lesson_id
  join public.constructs c on c.id=lc.construct_id
  where c.code='S4.CODE.04'
  and l.slug='javascript-sintaksisi-m08-11-draft'
  and l.status='review'::public.content_status
 ) then raise exception 'JavaScript syntax lesson must await source QA';end if;

 if not exists(
  select 1 from public.lesson_constructs lc
  join public.lessons l on l.id=lc.lesson_id
  join public.constructs c on c.id=lc.construct_id
  where c.code='S3.ALGO.03' and l.slug in ('m06-03','masala-algoritmini-tuzish')
 ) then raise exception 'Algorithm exercise lesson-objective link missing';end if;

end
$six_gap_review_test$;
rollback;