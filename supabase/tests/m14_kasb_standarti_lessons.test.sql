-- TASK-048 M14 professional-standard lessons regression.
begin;

do $$
declare
  v_module uuid;
  v_count int;
  v_bad int;
begin
  select id into strict v_module from public.modules where code = 'M14';

  select count(*) into v_count
  from public.lessons
  where module_id = v_module
    and status = 'published'::public.content_status
    and slug in (
      'oquv-jarayonini-rejalashtirish',
      'talim-samaradorligini-taminlash',
      'ozlashtirishni-baholash-va-qayta-aloqa',
      'tarbiyaviy-faoliyatni-tashkil-etish',
      'xavfsiz-rivojlantiruvchi-talim-muhiti',
      'oz-ozini-rivojlantirish-va-kasbiy-osish',
      'hamkasblar-va-ota-onalar-bilan-hamkorlik'
    );

  if v_count <> 7 then
    raise exception 'M14 expected 7 published source-backed lessons, got %', v_count;
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.lessons l on l.id = lc.lesson_id
  join public.constructs c on c.id = lc.construct_id
  where l.module_id = v_module
    and c.code in ('KS.01','KS.02','KS.03','KS.04','KS.05','KS.06','KS.07')
    and l.slug in (
      'oquv-jarayonini-rejalashtirish',
      'talim-samaradorligini-taminlash',
      'ozlashtirishni-baholash-va-qayta-aloqa',
      'tarbiyaviy-faoliyatni-tashkil-etish',
      'xavfsiz-rivojlantiruvchi-talim-muhiti',
      'oz-ozini-rivojlantirish-va-kasbiy-osish',
      'hamkasblar-va-ota-onalar-bilan-hamkorlik'
    );

  if v_count <> 7 then
    raise exception 'M14 expected seven KS construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    where l.module_id = v_module
      and l.slug in (
        'oquv-jarayonini-rejalashtirish',
        'talim-samaradorligini-taminlash',
        'ozlashtirishni-baholash-va-qayta-aloqa',
        'tarbiyaviy-faoliyatni-tashkil-etish',
        'xavfsiz-rivojlantiruvchi-talim-muhiti',
        'oz-ozini-rivojlantirish-va-kasbiy-osish',
        'hamkasblar-va-ota-onalar-bilan-hamkorlik'
      )
    group by l.id
    having count(lc.construct_id) <> 1
  ) bad_links;

  if v_bad <> 0 then
    raise exception 'M14 each lesson must map to exactly one construct';
  end if;

  select count(*) into v_bad
  from public.lessons
  where module_id = v_module
    and slug in (
      'oquv-jarayonini-rejalashtirish',
      'talim-samaradorligini-taminlash',
      'ozlashtirishni-baholash-va-qayta-aloqa',
      'tarbiyaviy-faoliyatni-tashkil-etish',
      'xavfsiz-rivojlantiruvchi-talim-muhiti',
      'oz-ozini-rivojlantirish-va-kasbiy-osish',
      'hamkasblar-va-ota-onalar-bilan-hamkorlik'
    )
    and (
      body_mdx is null
      or length(body_mdx) < 700
      or body_mdx not like '%Manba izi:%'
      or body_mdx not like '%Kasb standarti%'
    );

  if v_bad <> 0 then
    raise exception 'M14 lesson body/source invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
