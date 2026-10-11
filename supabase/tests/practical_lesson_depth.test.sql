-- TASK-061 practical lesson-depth regression.
begin;

do $$
declare
  v_count int;
  v_bad int;
begin
  select count(*) into v_count
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where (m.code, l.slug) in (
    ('M10','paint-va-photoshop-asoslari'),
    ('M11','html-matn-rasm-royxat'),
    ('M11','html-jadval-va-forma'),
    ('M11','css-stillarini-qollash'),
    ('M12','ip-manzil-va-tarmoq-maskasi'),
    ('M13','zararli-dastur-va-phishing'),
    ('M13','web-freelance-asoslari')
  )
    and l.status = 'published'::public.content_status
    and l.body_mdx like '%## Amaliy mustahkamlash — TASK-061%';

  if v_count <> 7 then
    raise exception 'TASK-061 expected 7 enriched practical lessons, got %', v_count;
  end if;

  select count(*) into v_bad
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where (m.code, l.slug) in (
    ('M11','html-matn-rasm-royxat'),
    ('M11','html-jadval-va-forma'),
    ('M11','css-stillarini-qollash')
  )
    and (
      l.body_mdx not like '%```html%'
      and l.body_mdx not like '%```css%'
    );

  if v_bad <> 0 then
    raise exception 'TASK-061 HTML/CSS worked-code invariant failed for % row(s)', v_bad;
  end if;

  select count(*) into v_bad
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code = 'M12'
    and l.slug = 'ip-manzil-va-tarmoq-maskasi'
    and (
      l.body_mdx not like '%bitma-bit **AND**%'
      or l.body_mdx not like '%192.168.10.64%'
      or l.body_mdx not like '%172.16.5.128%'
    );

  if v_bad <> 0 then
    raise exception 'TASK-061 IP worked-calculation invariant failed';
  end if;

  select count(*) into v_bad
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code = 'M13'
    and l.slug = 'web-freelance-asoslari'
    and (
      l.body_mdx not like '%**Portfolio:**%'
      or l.body_mdx not like '%platforma qoidalarini%'
    );

  if v_bad <> 0 then
    raise exception 'TASK-061 freelance workflow invariant failed';
  end if;
end
$$;

rollback;
