-- TASK-057: every active official construct must have at least one published lesson.
begin;

do $$
declare
  v_active int;
  v_covered int;
  v_missing text;
begin
  select count(*) into v_active
  from public.constructs
  where is_active;

  select count(distinct c.id) into v_covered
  from public.constructs c
  join public.lesson_constructs lc on lc.construct_id = c.id
  join public.lessons l on l.id = lc.lesson_id
  where c.is_active
    and l.status = 'published'::public.content_status;

  if v_covered <> v_active then
    select string_agg(c.code, ', ' order by c.code)
      into v_missing
    from public.constructs c
    where c.is_active
      and not exists (
        select 1
        from public.lesson_constructs lc
        join public.lessons l on l.id = lc.lesson_id
        where lc.construct_id = c.id
          and l.status = 'published'::public.content_status
      );

    raise exception
      'Official lesson coverage incomplete: %/% active constructs covered. Missing: %',
      v_covered, v_active, coalesce(v_missing, '(unknown)');
  end if;

  if v_active <> 76 then
    raise exception 'Expected 76 active official constructs, got %', v_active;
  end if;
end
$$;

rollback;
