-- TASK-054 A4 source-backed programming lessons regression.
begin;

do $$
declare
  v_count int;
  v_bad int;
begin
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M07','M08')
    and l.status = 'published'::public.content_status
    and l.slug in (
      'scratch-ozgaruvchi-va-koordinata','scratch-bloklar-bilan-algoritm','scratch-shart-va-takrorlash',
      'scratch-pen-shakllar','logo-toshbaqa-grafika',
      'python-sintaksis-asoslari','python-ozgaruvchi-shart-sikl','python-funksiya-va-massiv',
      'javascript-sintaksis-asoslari','javascript-shart-sikl-funksiya-massiv'
    );
  if v_count <> 10 then
    raise exception 'A4 expected 10 published programming lessons, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    join public.modules m on m.id = l.module_id
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    where m.code in ('M07','M08')
      and l.slug in (
        'scratch-ozgaruvchi-va-koordinata','scratch-bloklar-bilan-algoritm','scratch-shart-va-takrorlash',
        'scratch-pen-shakllar','logo-toshbaqa-grafika',
        'python-sintaksis-asoslari','python-ozgaruvchi-shart-sikl','python-funksiya-va-massiv',
        'javascript-sintaksis-asoslari','javascript-shart-sikl-funksiya-massiv'
      )
    group by l.id
    having count(lc.construct_id) <> 1
  ) q;
  if v_bad <> 0 then
    raise exception 'A4 each new lesson must map to exactly one construct';
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.constructs c on c.id = lc.construct_id
  join public.lessons l on l.id = lc.lesson_id
  where c.code in (
    'S4.BLOCK.01','S4.BLOCK.02','S4.BLOCK.03','S4.BLOCK.04','S4.BLOCK.05',
    'S4.CODE.01','S4.CODE.02','S4.CODE.03','S4.CODE.04','S4.CODE.05'
  )
    and l.slug in (
      'scratch-ozgaruvchi-va-koordinata','scratch-bloklar-bilan-algoritm','scratch-shart-va-takrorlash',
      'scratch-pen-shakllar','logo-toshbaqa-grafika',
      'python-sintaksis-asoslari','python-ozgaruvchi-shart-sikl','python-funksiya-va-massiv',
      'javascript-sintaksis-asoslari','javascript-shart-sikl-funksiya-massiv'
    );
  if v_count <> 10 then
    raise exception 'A4 expected 10 exact construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code in ('M07','M08')
    and l.slug in (
      'scratch-ozgaruvchi-va-koordinata','scratch-bloklar-bilan-algoritm','scratch-shart-va-takrorlash',
      'scratch-pen-shakllar','logo-toshbaqa-grafika',
      'python-sintaksis-asoslari','python-ozgaruvchi-shart-sikl','python-funksiya-va-massiv',
      'javascript-sintaksis-asoslari','javascript-shart-sikl-funksiya-massiv'
    )
    and (l.body_mdx is null or length(l.body_mdx) < 500 or l.body_mdx not like '%Manba izi:%');
  if v_bad <> 0 then
    raise exception 'A4 body/source trace invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
