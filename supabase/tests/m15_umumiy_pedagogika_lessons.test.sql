-- TASK-050 M15 umumiy pedagogika regression.
begin;

do $$
declare
  v_module uuid;
  v_count int;
  v_bad int;
begin
  select id into strict v_module from public.modules where code = 'M15';

  select count(*) into v_count
  from public.lessons
  where module_id = v_module
    and status = 'published'::public.content_status
    and slug in (
      'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
      'pedagogikaning-asosiy-tamoyillari',
      'tarbiya-va-uning-turlari',
      'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
      'sinf-rahbari-hujjatlar-jamoa-va-ota-ona',
      'pedagogik-etika-nutq-texnika-va-takt',
      'pedagogik-qobiliyat-va-uning-turlari',
      'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
    );

  if v_count <> 8 then
    raise exception 'M15 expected 8 published source-backed lessons, got %', v_count;
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.lessons l on l.id = lc.lesson_id
  join public.constructs c on c.id = lc.construct_id
  where l.module_id = v_module
    and c.code in (
      'PM.GEN.01','PM.GEN.02','PM.GEN.03','PM.GEN.04',
      'PM.GEN.05','PM.GEN.06','PM.GEN.07','PM.GEN.08'
    )
    and l.slug in (
      'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
      'pedagogikaning-asosiy-tamoyillari',
      'tarbiya-va-uning-turlari',
      'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
      'sinf-rahbari-hujjatlar-jamoa-va-ota-ona',
      'pedagogik-etika-nutq-texnika-va-takt',
      'pedagogik-qobiliyat-va-uning-turlari',
      'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
    );

  if v_count <> 8 then
    raise exception 'M15 expected eight PM.GEN construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    where l.module_id = v_module
      and l.slug in (
        'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
        'pedagogikaning-asosiy-tamoyillari',
        'tarbiya-va-uning-turlari',
        'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
        'sinf-rahbari-hujjatlar-jamoa-va-ota-ona',
        'pedagogik-etika-nutq-texnika-va-takt',
        'pedagogik-qobiliyat-va-uning-turlari',
        'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
      )
    group by l.id
    having count(lc.construct_id) <> 1
  ) bad_links;

  if v_bad <> 0 then
    raise exception 'M15 each lesson must map to exactly one construct';
  end if;

  select count(*) into v_bad
  from public.lessons
  where module_id = v_module
    and slug in (
      'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
      'pedagogikaning-asosiy-tamoyillari',
      'tarbiya-va-uning-turlari',
      'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
      'sinf-rahbari-hujjatlar-jamoa-va-ota-ona',
      'pedagogik-etika-nutq-texnika-va-takt',
      'pedagogik-qobiliyat-va-uning-turlari',
      'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
    )
    and (
      body_mdx is null
      or length(body_mdx) < 700
      or body_mdx not like '%Manba izi:%'
    );

  if v_bad <> 0 then
    raise exception 'M15 lesson body/source invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
