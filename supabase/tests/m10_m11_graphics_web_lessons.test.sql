-- TASK-055 M10/M11 source-backed graphics/web lessons regression.
begin;

do $$
declare
  v_count int;
  v_bad int;
begin
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M10','M11')
    and l.status = 'published'::public.content_status
    and l.slug in (
      'kompyuter-grafikasi-turlari','rastr-vektor-amallari','paint-va-photoshop-asoslari',
      'html-matn-rasm-royxat','html-jadval-va-forma','css-stillarini-qollash'
    );

  if v_count <> 6 then
    raise exception 'TASK-055 expected 6 published lessons, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    join public.modules m on m.id = l.module_id
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    where m.code in ('M10','M11')
      and l.slug in (
        'kompyuter-grafikasi-turlari','rastr-vektor-amallari','paint-va-photoshop-asoslari',
        'html-matn-rasm-royxat','html-jadval-va-forma','css-stillarini-qollash'
      )
    group by l.id
    having count(lc.construct_id) <> 1
  ) q;

  if v_bad <> 0 then
    raise exception 'TASK-055 each lesson must map to exactly one construct';
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.constructs c on c.id = lc.construct_id
  join public.lessons l on l.id = lc.lesson_id
  where c.code in (
    'S5.WEB.01','S5.WEB.02','S5.WEB.03','S5.WEB.04','S5.WEB.05','S5.WEB.06'
  )
    and l.slug in (
      'kompyuter-grafikasi-turlari','rastr-vektor-amallari','paint-va-photoshop-asoslari',
      'html-matn-rasm-royxat','html-jadval-va-forma','css-stillarini-qollash'
    );

  if v_count <> 6 then
    raise exception 'TASK-055 expected 6 exact construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M10','M11')
    and l.slug in (
      'kompyuter-grafikasi-turlari','rastr-vektor-amallari','paint-va-photoshop-asoslari',
      'html-matn-rasm-royxat','html-jadval-va-forma','css-stillarini-qollash'
    )
    and (
      l.body_mdx is null
      or length(l.body_mdx) < 500
      or l.body_mdx not like '%Manba izi:%'
    );

  if v_bad <> 0 then
    raise exception 'TASK-055 body/source trace invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
