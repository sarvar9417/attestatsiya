-- TASK-064 prerequisite: move learner-visible legacy lesson order slots out of
-- the canonical range before source-backed canonical lesson insertion.
--
-- Why this exists:
-- production has legacy published lessons occupying order_idx 1..N while the
-- canonical source-backed migrations use those same order slots. lessons has a
-- UNIQUE(module_id, order_idx) constraint, so inserting canonical rows before
-- moving legacy rows would fail.
--
-- Safety:
-- * no lesson is deleted or archived here;
-- * no slug/body/content is changed;
-- * learner/exam/topic-test references on a non-canonical published lesson
--   abort the whole transaction;
-- * target order values are allocated above the current module maximum;
-- * idempotent: once rows are above the reserved canonical range, reruns do
--   not move them again.
--
-- On a fresh chain the source-backed canonical lessons already exist before this
-- migration, so only legacy published rows are shifted. On production release,
-- this migration is deliberately applied before replaying the missing
-- source-backed lesson migrations.

begin;

do $$
declare
  lane record;
  v_module uuid;
  v_refs bigint;
  v_topic_refs bigint;
  v_base int;
begin
  for lane in
    select *
    from (
      values
        ('M02',4,array[
          '92000000-0000-4000-8000-000000000001'::uuid,
          '92000000-0000-4000-8000-000000000002'::uuid,
          '92000000-0000-4000-8000-000000000003'::uuid,
          '92000000-0000-4000-8000-000000000004'::uuid
        ]),
        ('M03',4,array[
          '93000000-0000-4000-8000-000000000001'::uuid,
          '93000000-0000-4000-8000-000000000002'::uuid,
          '93000000-0000-4000-8000-000000000003'::uuid,
          '93000000-0000-4000-8000-000000000004'::uuid
        ]),
        ('M04',4,array[
          '94000000-0000-4000-8000-000000000001'::uuid,
          '94000000-0000-4000-8000-000000000002'::uuid,
          '94000000-0000-4000-8000-000000000003'::uuid,
          '94000000-0000-4000-8000-000000000004'::uuid
        ]),
        ('M05',3,array[
          '95000000-0000-4000-8000-000000000001'::uuid,
          '95000000-0000-4000-8000-000000000002'::uuid,
          '95000000-0000-4000-8000-000000000003'::uuid
        ]),
        ('M06',4,array[
          '96000000-0000-4000-8000-000000000001'::uuid,
          '96000000-0000-4000-8000-000000000002'::uuid,
          '96000000-0000-4000-8000-000000000003'::uuid,
          '96000000-0000-4000-8000-000000000004'::uuid
        ]),
        ('M07',5,array[
          '97000000-0000-4000-8000-000000000001'::uuid,
          '97000000-0000-4000-8000-000000000002'::uuid,
          '97000000-0000-4000-8000-000000000003'::uuid,
          '97000000-0000-4000-8000-000000000004'::uuid,
          '97000000-0000-4000-8000-000000000005'::uuid
        ]),
        ('M08',5,array[
          '98000000-0000-4000-8000-000000000001'::uuid,
          '98000000-0000-4000-8000-000000000002'::uuid,
          '98000000-0000-4000-8000-000000000003'::uuid,
          '98000000-0000-4000-8000-000000000004'::uuid,
          '98000000-0000-4000-8000-000000000005'::uuid
        ]),
        ('M10',3,array[
          'a1000000-0000-4000-8000-000000000001'::uuid,
          'a1000000-0000-4000-8000-000000000002'::uuid,
          'a1000000-0000-4000-8000-000000000003'::uuid
        ]),
        ('M11',3,array[
          'b1100000-0000-4000-8000-000000000001'::uuid,
          'b1100000-0000-4000-8000-000000000002'::uuid,
          'b1100000-0000-4000-8000-000000000003'::uuid
        ]),
        ('M12',5,array[
          'c1200000-0000-4000-8000-000000000001'::uuid,
          'c1200000-0000-4000-8000-000000000002'::uuid,
          'c1200000-0000-4000-8000-000000000003'::uuid,
          'c1200000-0000-4000-8000-000000000004'::uuid,
          'c1200000-0000-4000-8000-000000000005'::uuid
        ]),
        ('M13',6,array[
          'd1300000-0000-4000-8000-000000000001'::uuid,
          'd1300000-0000-4000-8000-000000000002'::uuid,
          'd1300000-0000-4000-8000-000000000003'::uuid,
          'd1300000-0000-4000-8000-000000000004'::uuid,
          'd1300000-0000-4000-8000-000000000005'::uuid,
          'd1300000-0000-4000-8000-000000000006'::uuid
        ])
    ) as x(module_code,reserved_order_count,canonical_lesson_ids)
  loop
    select id into v_module from public.modules where code=lane.module_code;
    if v_module is null then
      raise exception 'TASK-064 order prepare module not found: %',lane.module_code;
    end if;

    -- Only published non-canonical rows still occupying canonical order slots
    -- need to move. Rows already moved on a prior run are left untouched.
    if not exists (
      select 1
      from public.lessons l
      where l.module_id=v_module
        and l.status='published'::public.content_status
        and not (l.id=any(lane.canonical_lesson_ids))
        and l.order_idx between 1 and lane.reserved_order_count
    ) then
      continue;
    end if;

    select
      (
        select count(*)
        from public.user_lesson_progress p
        join public.lessons l on l.id=p.lesson_id
        where l.module_id=v_module
          and l.status='published'::public.content_status
          and not (l.id=any(lane.canonical_lesson_ids))
          and l.order_idx between 1 and lane.reserved_order_count
      )
      +
      (
        select count(*)
        from public.exams e
        join public.lessons l on l.id=e.lesson_id
        where l.module_id=v_module
          and l.status='published'::public.content_status
          and not (l.id=any(lane.canonical_lesson_ids))
          and l.order_idx between 1 and lane.reserved_order_count
      )
      into v_refs;

    v_topic_refs := 0;
    if to_regclass('public.topic_test_attempts') is not null then
      execute $sql$
        select count(*)
        from public.topic_test_attempts t
        join public.lessons l on l.id=t.lesson_id
        where l.module_id=$1
          and l.status='published'::public.content_status
          and not (l.id=any($2))
          and l.order_idx between 1 and $3
      $sql$
      into v_topic_refs
      using v_module,lane.canonical_lesson_ids,lane.reserved_order_count;
    end if;

    v_refs := v_refs + v_topic_refs;
    if v_refs <> 0 then
      raise exception
        'TASK-064 order prepare refuses %: % learner/exam refs on legacy reserved slots',
        lane.module_code,v_refs;
    end if;

    select coalesce(max(order_idx),0)+100
      into v_base
      from public.lessons
     where module_id=v_module;

    with moving as (
      select
        l.id,
        row_number() over(order by l.order_idx,l.id) as rn
      from public.lessons l
      where l.module_id=v_module
        and l.status='published'::public.content_status
        and not (l.id=any(lane.canonical_lesson_ids))
        and l.order_idx between 1 and lane.reserved_order_count
    )
    update public.lessons l
       set order_idx=v_base+moving.rn,
           updated_at=now()
      from moving
     where l.id=moving.id;
  end loop;
end
$$;

commit;
