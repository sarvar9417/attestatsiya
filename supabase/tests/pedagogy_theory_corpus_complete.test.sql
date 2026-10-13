-- Full-corpus pedagogy theory completion regression.

do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M15'
    and l.order_idx between 1 and 8
    and l.status='published'::public.content_status
    and length(coalesce(l.body_mdx,''))>=2000;

  if v_count<>8 then
    raise exception 'expected 8 substantial canonical M15 lessons, found %',v_count;
  end if;

  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M16'
    and l.order_idx between 1 and 3
    and l.status='published'::public.content_status
    and position('[THEORY-CORPUS-2026-10-13-P2]' in coalesce(l.body_mdx,''))>0;

  if v_count<>3 then
    raise exception 'expected 3 P2-expanded M16 lessons, found %',v_count;
  end if;

  if not exists (
    select 1 from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M15'
      and l.slug='pedagogikaning-asosiy-tamoyillari'
      and l.body_mdx ilike '%Onglilik va faollik%'
      and l.body_mdx ilike '%Ko‘rgazmalilik%'
      and l.body_mdx ilike '%Tizimlilik%'
  ) then
    raise exception 'teaching-principles source coverage missing';
  end if;

  if not exists (
    select 1 from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M15'
      and l.slug='tarbiya-va-uning-turlari'
      and l.body_mdx ilike '%Aqliy tarbiya%'
      and l.body_mdx ilike '%Estetik tarbiya%'
      and l.body_mdx ilike '%Ekologik tarbiya%'
  ) then
    raise exception 'upbringing-types source coverage missing';
  end if;

  if not exists (
    select 1 from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M15'
      and l.slug='sinf-rahbari-hujjatlar-jamoa-va-ota-ona'
      and l.body_mdx ilike '%shaxsiy rivojlanishini kuzatish%'
      and l.body_mdx ilike '%ota-onalar%'
  ) then
    raise exception 'class-teacher source coverage missing';
  end if;

  if not exists (
    select 1 from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code='M16'
      and l.slug='oqitish-usullari-va-metodlarini-farqlash'
      and l.body_mdx ilike '%Muammoli bayon%'
      and l.body_mdx ilike '%Evristik%'
      and l.body_mdx ilike '%Tadqiqot%'
  ) then
    raise exception 'method-distinction source coverage missing';
  end if;
end
$$;
