-- Align S1.INFO taxonomy with the official 2026 specification.
-- The official A1 scope explicitly includes "axborotni saralash va xulosa chiqarish".
-- Keep the existing volume and transfer-speed constructs, and add the missing construct
-- instead of overloading the digital-ethics/copyright construct.

begin;

do $$
declare
  v_subject_id uuid;
  v_construct_id uuid;
  v_source_lesson_id uuid;
begin
  select id into v_subject_id
  from public.subjects
  where code = 'informatika'
  limit 1;

  if v_subject_id is null then
    raise exception 'informatika_subject_not_found';
  end if;

  insert into public.constructs (
    subject_id, group_code, code, slug, title_uz, description_uz, is_active
  )
  values (
    v_subject_id,
    'S1.INFO',
    'S1.INFO.08',
    's1-info-08',
    'Axborotni saralash va xulosa chiqarish',
    'Axborotni saralash, fakt va fikrni ajratish, manba ishonchliligini baholash va asosli xulosa chiqarish.',
    true
  )
  on conflict (code) do update
  set subject_id = excluded.subject_id,
      group_code = excluded.group_code,
      slug = excluded.slug,
      title_uz = excluded.title_uz,
      description_uz = excluded.description_uz,
      is_active = true
  returning id into v_construct_id;

  select l.id into v_source_lesson_id
  from public.lessons l
  join public.modules m on m.id = l.module_id
  where m.code = 'M01'
    and l.slug = 'm01-04'
    and l.status = 'published'::public.content_status
  limit 1;

  if v_source_lesson_id is null then
    raise exception 'm01_source_lesson_not_found';
  end if;

  insert into public.lesson_constructs (lesson_id, construct_id)
  values (v_source_lesson_id, v_construct_id)
  on conflict do nothing;
end
$$;

commit;
