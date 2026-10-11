-- TASK-056 M12/M13 source-backed network/security lessons regression.
begin;

do $$
declare
  v_count int;
  v_bad int;
begin
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M12','M13')
    and l.status = 'published'::public.content_status
    and l.slug in (
      'tarmoqlar-va-qurilmalar','arxitektura-va-topologiyalar','ip-manzil-va-tarmoq-maskasi',
      'internetdan-xavfsiz-va-maqsadli-foydalanish','brauzer-qidiruv-dns',
      'xavfsizlik-tahdidlari-va-himoya','zararli-dastur-va-phishing','antivirus-va-himoya-vositalari',
      'elektron-hukumat-va-elektron-imzo','smm-cms-lms-mooc','web-freelance-asoslari'
    );

  if v_count <> 11 then
    raise exception 'TASK-056 expected 11 published lessons, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    join public.modules m on m.id = l.module_id
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    where m.code in ('M12','M13')
      and l.slug in (
        'tarmoqlar-va-qurilmalar','arxitektura-va-topologiyalar','ip-manzil-va-tarmoq-maskasi',
        'internetdan-xavfsiz-va-maqsadli-foydalanish','brauzer-qidiruv-dns',
        'xavfsizlik-tahdidlari-va-himoya','zararli-dastur-va-phishing','antivirus-va-himoya-vositalari',
        'elektron-hukumat-va-elektron-imzo','smm-cms-lms-mooc','web-freelance-asoslari'
      )
    group by l.id
    having count(lc.construct_id) <> 1
  ) q;

  if v_bad <> 0 then
    raise exception 'TASK-056 each lesson must map to exactly one construct';
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.constructs c on c.id = lc.construct_id
  join public.lessons l on l.id = lc.lesson_id
  where c.code in (
    'S6.NET.01','S6.NET.02','S6.NET.03','S6.NET.04','S6.NET.05',
    'S7.SEC.01','S7.SEC.02','S7.SEC.03','S7.SEC.04','S7.SEC.05','S7.SEC.06'
  )
    and l.slug in (
      'tarmoqlar-va-qurilmalar','arxitektura-va-topologiyalar','ip-manzil-va-tarmoq-maskasi',
      'internetdan-xavfsiz-va-maqsadli-foydalanish','brauzer-qidiruv-dns',
      'xavfsizlik-tahdidlari-va-himoya','zararli-dastur-va-phishing','antivirus-va-himoya-vositalari',
      'elektron-hukumat-va-elektron-imzo','smm-cms-lms-mooc','web-freelance-asoslari'
    );

  if v_count <> 11 then
    raise exception 'TASK-056 expected 11 exact construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M12','M13')
    and l.slug in (
      'tarmoqlar-va-qurilmalar','arxitektura-va-topologiyalar','ip-manzil-va-tarmoq-maskasi',
      'internetdan-xavfsiz-va-maqsadli-foydalanish','brauzer-qidiruv-dns',
      'xavfsizlik-tahdidlari-va-himoya','zararli-dastur-va-phishing','antivirus-va-himoya-vositalari',
      'elektron-hukumat-va-elektron-imzo','smm-cms-lms-mooc','web-freelance-asoslari'
    )
    and (
      l.body_mdx is null
      or length(l.body_mdx) < 500
      or l.body_mdx not like '%Manba izi:%'
    );

  if v_bad <> 0 then
    raise exception 'TASK-056 body/source trace invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
