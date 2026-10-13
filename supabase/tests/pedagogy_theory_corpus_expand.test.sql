-- Regression for full pedagogy theory corpus expansion.

do $$
declare
  v_count int;
begin
  -- Seven canonical M14 theory lessons must remain published, source-mapped and expanded.
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id=l.module_id
  join public.lesson_constructs lc on lc.lesson_id=l.id
  join public.constructs c on c.id=lc.construct_id
  where m.code='M14'
    and l.order_idx between 1 and 7
    and l.status='published'::public.content_status
    and length(coalesce(l.body_mdx,''))>=1800
    and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))>0
    and c.code like 'KS.%';

  if v_count<>7 then
    raise exception 'expected 7 expanded canonical M14 lessons, found %',v_count;
  end if;

  -- No empty legacy M14/M15 duplicates may stay learner-visible.
  if exists (
    select 1
    from public.lessons l
    join public.modules m on m.id=l.module_id
    where m.code in ('M14','M15')
      and l.status='published'::public.content_status
      and length(coalesce(l.body_mdx,''))=0
  ) then
    raise exception 'empty published pedagogy lesson remains';
  end if;

  -- The five M15 lessons expanded from the uploaded pedagogical mastery corpus.
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M15'
    and l.status='published'::public.content_status
    and l.slug in (
      'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
      'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
      'pedagogik-etika-nutq-texnika-va-takt',
      'pedagogik-qobiliyat-va-uning-turlari',
      'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
    )
    and position('[THEORY-CORPUS-2026-10-13]' in coalesce(l.body_mdx,''))>0;

  if v_count<>5 then
    raise exception 'expected 5 expanded M15 lessons, found %',v_count;
  end if;

  -- Theory cleanup must never break published question provenance.
  if exists (
    select 1
    from public.questions q
    where q.status='published'::public.content_status
      and (
        q.source_lesson_id is null
        or not exists (
          select 1
          from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id
            and lc.construct_id=q.construct_id
        )
      )
  ) then
    raise exception 'published question source integrity failed after pedagogy theory expansion';
  end if;
end
$$;
