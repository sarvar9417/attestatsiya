-- Reconciliation is idempotent. Never assign ambiguous/different construct.
begin;
do $rebind_test$
declare
  v_remaining int;
  v_invalid int;
begin
  with available as (
    select q.id,count(distinct l.id) as published_lesson_count
    from public.questions q
    join public.lesson_constructs lc on lc.construct_id=q.construct_id
    join public.lessons l on l.id=lc.lesson_id
    where q.source_reference like 'generated:%'
      and q.status='published'::public.content_status
      and l.status='published'::public.content_status
    group by q.id
  )
  select count(*) into v_remaining from public.questions q
  join available a on a.id=q.id
  where q.source_lesson_id is null and a.published_lesson_count=1;
  if v_remaining>0 then
    raise exception '% generated questions still have an unambiguous published lesson but no link',v_remaining;
  end if;

  select count(*) into v_invalid from public.questions q
  where q.source_reference like 'generated:%' and q.source_lesson_id is not null
  and not exists (
    select 1 from public.lesson_constructs lc
    where lc.construct_id=q.construct_id and lc.lesson_id=q.source_lesson_id
  );
  if v_invalid<>0 then
    raise exception '% generated questions have mismatched lesson links',v_invalid;
  end if;

  -- Two-or-more-published-lesson cases remain subject to separate review.
end
$rebind_test$;
rollback;