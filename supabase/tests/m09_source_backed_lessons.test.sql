-- TASK-047 M09 source-backed lessons regression.
begin;

do $$
declare
  v_module uuid;
  v_count int;
  v_bad int;
begin
  select id into strict v_module
  from public.modules
  where code = 'M09';

  select count(*) into v_count
  from public.lessons
  where module_id = v_module
    and status = 'published'::public.content_status
    and slug in (
      'malumotlar-bazasi-va-mbbt-asoslari',
      'access-jadval-va-malumot-kiritish',
      'kalitlar-va-jadvallarni-boglash',
      'sorovlar-yaratish',
      'murakkab-sorovlar-va-natijani-tahlil-qilish'
    );

  if v_count <> 5 then
    raise exception 'M09 expected 5 published source-backed lessons, got %', v_count;
  end if;

  select count(*) into v_count
  from public.lesson_constructs lc
  join public.lessons l on l.id = lc.lesson_id
  join public.constructs c on c.id = lc.construct_id
  where l.module_id = v_module
    and l.slug in (
      'malumotlar-bazasi-va-mbbt-asoslari',
      'access-jadval-va-malumot-kiritish',
      'kalitlar-va-jadvallarni-boglash',
      'sorovlar-yaratish',
      'murakkab-sorovlar-va-natijani-tahlil-qilish'
    )
    and c.code in ('S4.DB.01','S4.DB.02','S4.DB.03','S4.DB.04','S4.DB.05');

  if v_count <> 5 then
    raise exception 'M09 expected five construct links, got %', v_count;
  end if;

  select count(*) into v_bad
  from (
    select l.id
    from public.lessons l
    left join public.lesson_constructs lc on lc.lesson_id = l.id
    left join public.constructs c on c.id = lc.construct_id
    where l.module_id = v_module
      and l.slug in (
        'malumotlar-bazasi-va-mbbt-asoslari',
        'access-jadval-va-malumot-kiritish',
        'kalitlar-va-jadvallarni-boglash',
        'sorovlar-yaratish',
        'murakkab-sorovlar-va-natijani-tahlil-qilish'
      )
    group by l.id
    having count(c.id) <> 1
  ) bad_links;

  if v_bad <> 0 then
    raise exception 'M09 each new lesson must map to exactly one construct';
  end if;

  select count(*) into v_bad
  from public.lessons
  where module_id = v_module
    and slug in (
      'malumotlar-bazasi-va-mbbt-asoslari',
      'access-jadval-va-malumot-kiritish',
      'kalitlar-va-jadvallarni-boglash',
      'sorovlar-yaratish',
      'murakkab-sorovlar-va-natijani-tahlil-qilish'
    )
    and (
      body_mdx is null
      or length(body_mdx) < 500
      or body_mdx not like '%Manba izi:%'
    );

  if v_bad <> 0 then
    raise exception 'M09 lesson body/source trace invariant failed for % row(s)', v_bad;
  end if;
end
$$;

rollback;
