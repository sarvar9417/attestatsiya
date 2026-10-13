-- TASK-065: exact source-lesson reconciliation for the parametric bank.
--
-- Background:
-- * generated questions are tied to official constructs, but the generated SQL
--   historically left source_lesson_id NULL;
-- * S1.INFO.05 and S1.INFO.06 each temporarily had two published lesson
--   candidates, so the generic safe-rebind intentionally left 60 questions
--   unresolved;
-- * TASK-057 introduced a dedicated S1.INFO.06 transfer-rate lesson after older
--   source links had already attached transfer-rate questions to m01-06.
--
-- This forward fix uses explicit construct -> canonical lesson mappings only.
-- It never guesses among arbitrary lessons and is idempotent.

begin;

do $task065$
declare
  v_media_lesson uuid;
  v_volume_lesson uuid;
  v_transfer_lesson uuid;
  v_c03 uuid;
  v_c05 uuid;
  v_c06 uuid;
  v_bad bigint;
begin
  -- Resolve the three M01 lessons involved in the historical ambiguity.
  select l.id into strict v_media_lesson
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M01'
    and l.slug='m01-06'
    and l.status='published'::public.content_status;

  select l.id into strict v_volume_lesson
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M01'
    and l.slug='m01-07'
    and l.status='published'::public.content_status;

  select l.id into strict v_transfer_lesson
  from public.lessons l
  join public.modules m on m.id=l.module_id
  where m.code='M01'
    and l.slug='axborot-uzatish-tezligi'
    and l.status='published'::public.content_status;

  select id into strict v_c03 from public.constructs
  where code='S1.INFO.03' and is_active;
  select id into strict v_c05 from public.constructs
  where code='S1.INFO.05' and is_active;
  select id into strict v_c06 from public.constructs
  where code='S1.INFO.06' and is_active;

  -- Fail closed if the canonical content itself is missing.
  if coalesce(jsonb_array_length((
      select blocks from public.lessons where id=v_media_lesson
    )),0)=0 then
    raise exception 'TASK-065 m01-06 structured lesson content missing';
  end if;

  if coalesce(jsonb_array_length((
      select blocks from public.lessons where id=v_volume_lesson
    )),0)=0 then
    raise exception 'TASK-065 m01-07 structured lesson content missing';
  end if;

  if length(coalesce((
      select body_mdx from public.lessons where id=v_transfer_lesson
    ),''))=0 then
    raise exception 'TASK-065 transfer-rate lesson body missing';
  end if;

  -- Canonical M01 mappings. These mirror scripts/gen_m01_seed_sql.ts and
  -- TASK-057's dedicated S1.INFO.06 lesson.
  insert into public.lesson_constructs(lesson_id,construct_id)
  values
    (v_media_lesson,v_c03),
    (v_volume_lesson,v_c05),
    (v_transfer_lesson,v_c06)
  on conflict do nothing;

  -- Every generator-backed construct has one explicit canonical source lesson.
  -- Rebind all published generated questions to that exact source.
  with expected(construct_code,module_code,lesson_slug) as (
    values
      ('S1.INFO.04','M01','m01-05'),
      ('S1.INFO.05','M01','m01-07'),
      ('S1.INFO.06','M01','axborot-uzatish-tezligi'),
      ('S3.NUM.01','M05','sanoq-sistemalari-asoslari'),
      ('S3.NUM.02','M05','sanoq-sistemalari-otkazish'),
      ('S3.NUM.03','M05','sanoq-sistemalari-arifmetika'),
      ('S3.LOGIC.02','M04','mantiqiy-amallar'),
      ('S3.LOGIC.04','M04','rostlik-jadvali-va-mantiqiy-sxema'),
      ('S6.NET.03','M12','ip-manzil-va-tarmoq-maskasi')
  ),
  resolved as (
    select c.id as construct_id,l.id as lesson_id
    from expected e
    join public.constructs c
      on c.code=e.construct_code and c.is_active
    join public.modules m
      on m.code=e.module_code
    join public.lessons l
      on l.module_id=m.id
     and l.slug=e.lesson_slug
     and l.status='published'::public.content_status
    join public.lesson_constructs lc
      on lc.lesson_id=l.id and lc.construct_id=c.id
  )
  update public.questions q
     set source_lesson_id=r.lesson_id,
         updated_at=now()
    from resolved r
   where q.construct_id=r.construct_id
     and q.status='published'::public.content_status
     and q.source_reference like 'generated:%'
     and q.source_lesson_id is distinct from r.lesson_id;

  -- Older professional-bank transfer questions were linked to m01-06 before
  -- the dedicated transfer-rate lesson existed. Move only that exact lane.
  update public.questions q
     set source_lesson_id=v_transfer_lesson,
         updated_at=now()
   where q.construct_id=v_c06
     and q.status='published'::public.content_status
     and q.source_lesson_id=v_media_lesson;

  -- The legacy broad mappings are no longer needed and are the reason the
  -- generic rebind saw S1.INFO.05/.06 as ambiguous.
  -- Guard first: no question in any status may still depend on them.
  select count(*) into v_bad
  from public.questions q
  where (q.source_lesson_id=v_media_lesson and q.construct_id in (v_c05,v_c06))
     or (q.source_lesson_id=v_volume_lesson and q.construct_id=v_c03);

  if v_bad<>0 then
    raise exception 'TASK-065 cannot remove legacy lesson mappings; % dependent question(s) remain',v_bad;
  end if;

  delete from public.lesson_constructs
  where lesson_id=v_media_lesson
    and construct_id in (v_c05,v_c06);

  delete from public.lesson_constructs
  where lesson_id=v_volume_lesson
    and construct_id=v_c03;

  -- Final invariants: all generated questions in the supported pool resolve to
  -- the exact canonical lesson; all published source links match construct.
  with expected(construct_code,module_code,lesson_slug) as (
    values
      ('S1.INFO.04','M01','m01-05'),
      ('S1.INFO.05','M01','m01-07'),
      ('S1.INFO.06','M01','axborot-uzatish-tezligi'),
      ('S3.NUM.01','M05','sanoq-sistemalari-asoslari'),
      ('S3.NUM.02','M05','sanoq-sistemalari-otkazish'),
      ('S3.NUM.03','M05','sanoq-sistemalari-arifmetika'),
      ('S3.LOGIC.02','M04','mantiqiy-amallar'),
      ('S3.LOGIC.04','M04','rostlik-jadvali-va-mantiqiy-sxema'),
      ('S6.NET.03','M12','ip-manzil-va-tarmoq-maskasi')
  ),
  resolved as (
    select c.id as construct_id,l.id as lesson_id
    from expected e
    join public.constructs c
      on c.code=e.construct_code and c.is_active
    join public.modules m on m.code=e.module_code
    join public.lessons l
      on l.module_id=m.id
     and l.slug=e.lesson_slug
     and l.status='published'::public.content_status
    join public.lesson_constructs lc
      on lc.lesson_id=l.id and lc.construct_id=c.id
  )
  select count(*) into v_bad
  from public.questions q
  join resolved r on r.construct_id=q.construct_id
  where q.status='published'::public.content_status
    and q.source_reference like 'generated:%'
    and q.source_lesson_id is distinct from r.lesson_id;

  if v_bad<>0 then
    raise exception 'TASK-065 % generated question(s) still have non-canonical source lessons',v_bad;
  end if;

  select count(*) into v_bad
  from public.questions q
  where q.status='published'::public.content_status
    and q.source_lesson_id is not null
    and not exists (
      select 1
      from public.lesson_constructs lc
      where lc.lesson_id=q.source_lesson_id
        and lc.construct_id=q.construct_id
    );

  if v_bad<>0 then
    raise exception 'TASK-065 % published question(s) have source/construct mismatch',v_bad;
  end if;
end
$task065$;

commit;
