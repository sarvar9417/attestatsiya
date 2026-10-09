-- TASK-053 A3 source-backed lesson regression.
begin;

do $$
declare
  v_count int;
  v_bad int;
begin
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M04','M05','M06')
    and l.status = 'published'::public.content_status
    and l.slug in (
      'mantiqiy-mulohazalar','mantiqiy-amallar','mantiqiy-xulosa-va-masala','rostlik-jadvali-va-mantiqiy-sxema',
      'sanoq-sistemalari-asoslari','sanoq-sistemalari-otkazish','sanoq-sistemalari-arifmetika',
      'algoritm-va-turlari','blok-sxema-va-psevdokod','masala-algoritmini-tuzish','algoritm-tahlili-va-maqbullik'
    );
  if v_count <> 11 then
    raise exception 'A3 expected 11 published source-backed lessons, got %', v_count;
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.lessons l on l.id = lc.lesson_id
  join public.constructs c on c.id = lc.construct_id
  where c.code like 'S3.LOGIC.%'
     or c.code like 'S3.NUM.%'
     or c.code like 'S3.ALGO.%';
  if v_count < 11 then
    raise exception 'A3 expected at least 11 construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    join public.modules m on m.id = l.module_id
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    where m.code in ('M04','M05','M06')
      and l.slug in (
        'mantiqiy-mulohazalar','mantiqiy-amallar','mantiqiy-xulosa-va-masala','rostlik-jadvali-va-mantiqiy-sxema',
        'sanoq-sistemalari-asoslari','sanoq-sistemalari-otkazish','sanoq-sistemalari-arifmetika',
        'algoritm-va-turlari','blok-sxema-va-psevdokod','masala-algoritmini-tuzish','algoritm-tahlili-va-maqbullik'
      )
    group by l.id
    having count(lc.construct_id) <> 1
  ) q;
  if v_bad <> 0 then
    raise exception 'A3 each new lesson must map to exactly one construct';
  end if;

  select count(*) into v_bad
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M04','M05','M06')
    and l.slug in (
      'mantiqiy-mulohazalar','mantiqiy-amallar','mantiqiy-xulosa-va-masala','rostlik-jadvali-va-mantiqiy-sxema',
      'sanoq-sistemalari-asoslari','sanoq-sistemalari-otkazish','sanoq-sistemalari-arifmetika',
      'algoritm-va-turlari','blok-sxema-va-psevdokod','masala-algoritmini-tuzish','algoritm-tahlili-va-maqbullik'
    )
    and (l.body_mdx is null or length(l.body_mdx) < 500 or l.body_mdx not like '%Manba izi:%');
  if v_bad <> 0 then
    raise exception 'A3 lesson body/source trace invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
