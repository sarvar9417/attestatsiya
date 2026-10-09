-- TASK-052 M03 source-backed Office lessons regression.
begin;

do $$
declare
  v_module uuid;
  v_count int;
  v_bad int;
begin
  select id into strict v_module from public.modules where code = 'M03';

  select count(*) into v_count
  from public.lessons
  where module_id = v_module
    and status = 'published'::public.content_status
    and slug in (
      'word-hujjat-formatlash-va-tuzilma',
      'excel-formulalar-va-funksiyalar',
      'excel-filtr-saralash-diagramma',
      'powerpoint-taqdimot-animatsiya-otish'
    );
  if v_count <> 4 then
    raise exception 'M03 expected 4 published source-backed lessons, got %', v_count;
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.lessons l on l.id = lc.lesson_id
  join public.constructs c on c.id = lc.construct_id
  where l.module_id = v_module
    and l.slug in (
      'word-hujjat-formatlash-va-tuzilma',
      'excel-formulalar-va-funksiyalar',
      'excel-filtr-saralash-diagramma',
      'powerpoint-taqdimot-animatsiya-otish'
    )
    and c.code in ('S2.OFFICE.01','S2.OFFICE.02','S2.OFFICE.03','S2.OFFICE.04');
  if v_count <> 4 then
    raise exception 'M03 expected four construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    left join public.constructs c on c.id = lc.construct_id
    where l.module_id = v_module
      and l.slug in (
        'word-hujjat-formatlash-va-tuzilma',
        'excel-formulalar-va-funksiyalar',
        'excel-filtr-saralash-diagramma',
        'powerpoint-taqdimot-animatsiya-otish'
      )
    group by l.id
    having count(c.id) <> 1
  ) bad_links;
  if v_bad <> 0 then
    raise exception 'M03 each new lesson must map to exactly one construct';
  end if;

  select count(*) into v_bad
  from public.lessons
  where module_id = v_module
    and slug in (
      'word-hujjat-formatlash-va-tuzilma',
      'excel-formulalar-va-funksiyalar',
      'excel-filtr-saralash-diagramma',
      'powerpoint-taqdimot-animatsiya-otish'
    )
    and (body_mdx is null or length(body_mdx) < 500 or body_mdx not like '%Manba izi:%');
  if v_bad <> 0 then
    raise exception 'M03 lesson body/source trace invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
