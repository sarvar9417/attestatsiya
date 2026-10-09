-- TASK-049 M16 Informatika o'qitish metodikasi regression.
begin;

do $$
declare
  v_module uuid;
  v_count int;
  v_bad int;
begin
  select id into strict v_module from public.modules where code = 'M16';

  select count(*) into v_count
  from public.lessons
  where module_id = v_module
    and status = 'published'::public.content_status
    and slug in (
      'informatika-oqitish-yondashuvlari-va-metodikasi',
      'oqitish-usullari-va-metodlarini-farqlash',
      'talimiy-vaziyat-va-pedagogik-qarorni-baholash'
    );

  if v_count <> 3 then
    raise exception 'M16 expected 3 published source-backed lessons, got %', v_count;
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.lessons l on l.id = lc.lesson_id
  join public.constructs c on c.id = lc.construct_id
  where l.module_id = v_module
    and c.code in ('PM.MET.01','PM.MET.02','PM.MET.03')
    and l.slug in (
      'informatika-oqitish-yondashuvlari-va-metodikasi',
      'oqitish-usullari-va-metodlarini-farqlash',
      'talimiy-vaziyat-va-pedagogik-qarorni-baholash'
    );

  if v_count <> 3 then
    raise exception 'M16 expected three PM.MET construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    where l.module_id = v_module
      and l.slug in (
        'informatika-oqitish-yondashuvlari-va-metodikasi',
        'oqitish-usullari-va-metodlarini-farqlash',
        'talimiy-vaziyat-va-pedagogik-qarorni-baholash'
      )
    group by l.id
    having count(lc.construct_id) <> 1
  ) bad_links;

  if v_bad <> 0 then
    raise exception 'M16 each lesson must map to exactly one construct';
  end if;

  select count(*) into v_bad
  from public.lessons
  where module_id = v_module
    and slug in (
      'informatika-oqitish-yondashuvlari-va-metodikasi',
      'oqitish-usullari-va-metodlarini-farqlash',
      'talimiy-vaziyat-va-pedagogik-qarorni-baholash'
    )
    and (
      body_mdx is null
      or length(body_mdx) < 700
      or body_mdx not like '%Manba izi:%'
      or body_mdx not like '%Mamarajabov%'
    );

  if v_bad <> 0 then
    raise exception 'M16 lesson body/source invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
