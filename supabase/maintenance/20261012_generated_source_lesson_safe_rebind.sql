-- Release-gated maintenance: repair only deterministic, unambiguous
-- generated question -> published lesson source links. DO NOT run on prod
-- until final user authorization. Does not change a question, correct answer,
-- status, author, audit trail or learner attempt. Never guess between 2 lessons.
begin;
do $safe_rebind$
declare
  v_before int;
  v_fixed int;
  v_wrong int;
begin
  select count(*) into v_before
  from public.questions
  where status='published'::public.content_status
    and source_lesson_id is null and source_reference like 'generated:%';

  with unambiguous as (
    select q.id as question_id, min(l.slug) as slug
    from public.questions q
    join public.lesson_constructs lc on lc.construct_id=q.construct_id
    join public.lessons l on l.id=lc.lesson_id
    where q.status='published'::public.content_status
      and q.source_lesson_id is null
      and q.source_reference like 'generated:%'
      and l.status='published'::public.content_status
    group by q.id
    having count(distinct l.id)=1
  ),
  update_rows as (
    update public.questions q set
      source_lesson_id=l.id,
      updated_at=now()
    from unambiguous x, public.lessons l
    where q.id=x.question_id
      and l.slug=x.slug
      and l.status='published'::public.content_status
      and exists (
        select 1 from public.lesson_constructs lc
        where lc.lesson_id=l.id and lc.construct_id=q.construct_id
      )
    returning q.id
  )
  select count(*) into v_fixed from update_rows;

  -- Rebind only if mapping has one published lesson per construct.
  select count(*) into v_wrong
  from public.questions q
  join public.lessons l on l.id=q.source_lesson_id
  where q.source_reference like 'generated:%'
    and not exists (
      select 1 from public.lesson_constructs lc
      where lc.lesson_id=l.id and lc.construct_id=q.construct_id
    );
  if v_wrong<>0 then
    raise exception 'Generated question mapped to wrong lesson construct: %',v_wrong;
  end if;

  raise notice 'Safe generated link reconciliation: before_null=%, fixed=%, remaining_null=%',
    v_before,v_fixed,v_before-v_fixed;
end
$safe_rebind$;
commit;
