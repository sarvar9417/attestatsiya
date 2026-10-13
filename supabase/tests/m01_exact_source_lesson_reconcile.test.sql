-- TASK-065 regression: exact M01 source-lesson reconciliation.

do $$
declare
  v_media uuid;
  v_volume uuid;
  v_transfer uuid;
  v_c03 uuid;
  v_c05 uuid;
  v_c06 uuid;
begin
  select l.id into strict v_media
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M01' and l.slug='m01-06'
    and l.status='published'::public.content_status;

  select l.id into strict v_volume
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M01' and l.slug='m01-07'
    and l.status='published'::public.content_status;

  select l.id into strict v_transfer
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M01' and l.slug='axborot-uzatish-tezligi'
    and l.status='published'::public.content_status;

  select id into strict v_c03 from public.constructs where code='S1.INFO.03' and is_active;
  select id into strict v_c05 from public.constructs where code='S1.INFO.05' and is_active;
  select id into strict v_c06 from public.constructs where code='S1.INFO.06' and is_active;

  if not exists (
    select 1 from public.lesson_constructs
    where lesson_id=v_media and construct_id=v_c03
  ) then
    raise exception 'TASK-065 m01-06 -> S1.INFO.03 canonical mapping missing';
  end if;

  if exists (
    select 1 from public.lesson_constructs
    where lesson_id=v_media and construct_id in (v_c05,v_c06)
  ) then
    raise exception 'TASK-065 m01-06 still has ambiguous S1.INFO.05/.06 mapping';
  end if;

  if not exists (
    select 1 from public.lesson_constructs
    where lesson_id=v_volume and construct_id=v_c05
  ) then
    raise exception 'TASK-065 m01-07 -> S1.INFO.05 mapping missing';
  end if;

  if exists (
    select 1 from public.lesson_constructs
    where lesson_id=v_volume and construct_id=v_c03
  ) then
    raise exception 'TASK-065 m01-07 still has legacy S1.INFO.03 mapping';
  end if;

  if not exists (
    select 1 from public.lesson_constructs
    where lesson_id=v_transfer and construct_id=v_c06
  ) then
    raise exception 'TASK-065 transfer lesson -> S1.INFO.06 mapping missing';
  end if;

  if exists (
    select 1
    from public.questions q
    where q.status='published'::public.content_status
      and q.construct_id=v_c05
      and q.source_lesson_id is distinct from v_volume
  ) then
    raise exception 'TASK-065 published S1.INFO.05 source lesson drift remains';
  end if;

  if exists (
    select 1
    from public.questions q
    where q.status='published'::public.content_status
      and q.construct_id=v_c06
      and q.source_lesson_id is distinct from v_transfer
  ) then
    raise exception 'TASK-065 published S1.INFO.06 source lesson drift remains';
  end if;
end
$$;
