-- TASK-064: canonical lesson drift reconciliation for the official curriculum.
--
-- Source-backed migrations intentionally define one canonical published lesson
-- per active construct. Historical production contains older empty/legacy
-- lesson rows in the same modules. Keeping both sets published inflates the
-- learner-visible lesson list and makes source_lesson selection ambiguous.
--
-- Safety contract:
-- * canonical source-backed lessons must already exist and be published;
-- * exact construct -> canonical lesson mapping must exist;
-- * any learner progress, exam, or topic-test attempt on a non-canonical
--   published lesson aborts the whole transaction;
-- * questions are rebound by active construct before legacy mappings are
--   removed;
-- * legacy lessons are archived, never deleted;
-- * re-running is idempotent.

begin;

do $$
declare
  lane record;
  v_module uuid;
  v_expected int;
  v_have int;
  v_refs bigint;
  v_topic_refs bigint;
begin
  for lane in
    select *
    from (
      values
        (
          'M02',
          array[
            '92000000-0000-4000-8000-000000000001'::uuid,
            '92000000-0000-4000-8000-000000000002'::uuid,
            '92000000-0000-4000-8000-000000000003'::uuid,
            '92000000-0000-4000-8000-000000000004'::uuid
          ],
          array['S2.HW.01','S2.HW.02','S2.HW.03','S2.HW.04']::text[]
        ),
        (
          'M03',
          array[
            '93000000-0000-4000-8000-000000000001'::uuid,
            '93000000-0000-4000-8000-000000000002'::uuid,
            '93000000-0000-4000-8000-000000000003'::uuid,
            '93000000-0000-4000-8000-000000000004'::uuid
          ],
          array['S2.OFFICE.01','S2.OFFICE.02','S2.OFFICE.03','S2.OFFICE.04']::text[]
        ),
        (
          'M04',
          array[
            '94000000-0000-4000-8000-000000000001'::uuid,
            '94000000-0000-4000-8000-000000000002'::uuid,
            '94000000-0000-4000-8000-000000000003'::uuid,
            '94000000-0000-4000-8000-000000000004'::uuid
          ],
          array['S3.LOGIC.01','S3.LOGIC.02','S3.LOGIC.03','S3.LOGIC.04']::text[]
        ),
        (
          'M05',
          array[
            '95000000-0000-4000-8000-000000000001'::uuid,
            '95000000-0000-4000-8000-000000000002'::uuid,
            '95000000-0000-4000-8000-000000000003'::uuid
          ],
          array['S3.NUM.01','S3.NUM.02','S3.NUM.03']::text[]
        ),
        (
          'M06',
          array[
            '96000000-0000-4000-8000-000000000001'::uuid,
            '96000000-0000-4000-8000-000000000002'::uuid,
            '96000000-0000-4000-8000-000000000003'::uuid,
            '96000000-0000-4000-8000-000000000004'::uuid
          ],
          array['S3.ALGO.01','S3.ALGO.02','S3.ALGO.03','S3.ALGO.04']::text[]
        ),
        (
          'M07',
          array[
            '97000000-0000-4000-8000-000000000001'::uuid,
            '97000000-0000-4000-8000-000000000002'::uuid,
            '97000000-0000-4000-8000-000000000003'::uuid,
            '97000000-0000-4000-8000-000000000004'::uuid,
            '97000000-0000-4000-8000-000000000005'::uuid
          ],
          array['S4.BLOCK.01','S4.BLOCK.02','S4.BLOCK.03','S4.BLOCK.04','S4.BLOCK.05']::text[]
        ),
        (
          'M08',
          array[
            '98000000-0000-4000-8000-000000000001'::uuid,
            '98000000-0000-4000-8000-000000000002'::uuid,
            '98000000-0000-4000-8000-000000000003'::uuid,
            '98000000-0000-4000-8000-000000000004'::uuid,
            '98000000-0000-4000-8000-000000000005'::uuid
          ],
          array['S4.CODE.01','S4.CODE.02','S4.CODE.03','S4.CODE.04','S4.CODE.05']::text[]
        ),
        (
          'M10',
          array[
            'a1000000-0000-4000-8000-000000000001'::uuid,
            'a1000000-0000-4000-8000-000000000002'::uuid,
            'a1000000-0000-4000-8000-000000000003'::uuid
          ],
          array['S5.WEB.01','S5.WEB.02','S5.WEB.03']::text[]
        ),
        (
          'M11',
          array[
            'b1100000-0000-4000-8000-000000000001'::uuid,
            'b1100000-0000-4000-8000-000000000002'::uuid,
            'b1100000-0000-4000-8000-000000000003'::uuid
          ],
          array['S5.WEB.04','S5.WEB.05','S5.WEB.06']::text[]
        ),
        (
          'M12',
          array[
            'c1200000-0000-4000-8000-000000000001'::uuid,
            'c1200000-0000-4000-8000-000000000002'::uuid,
            'c1200000-0000-4000-8000-000000000003'::uuid,
            'c1200000-0000-4000-8000-000000000004'::uuid,
            'c1200000-0000-4000-8000-000000000005'::uuid
          ],
          array['S6.NET.01','S6.NET.02','S6.NET.03','S6.NET.04','S6.NET.05']::text[]
        ),
        (
          'M13',
          array[
            'd1300000-0000-4000-8000-000000000001'::uuid,
            'd1300000-0000-4000-8000-000000000002'::uuid,
            'd1300000-0000-4000-8000-000000000003'::uuid,
            'd1300000-0000-4000-8000-000000000004'::uuid,
            'd1300000-0000-4000-8000-000000000005'::uuid,
            'd1300000-0000-4000-8000-000000000006'::uuid
          ],
          array['S7.SEC.01','S7.SEC.02','S7.SEC.03','S7.SEC.04','S7.SEC.05','S7.SEC.06']::text[]
        )
    ) as x(module_code, canonical_lesson_ids, construct_codes)
  loop
    if cardinality(lane.canonical_lesson_ids) <> cardinality(lane.construct_codes) then
      raise exception 'TASK-064 invalid lane mapping for %', lane.module_code;
    end if;

    select id into v_module
      from public.modules
     where code=lane.module_code;

    if v_module is null then
      raise exception 'TASK-064 module not found: %', lane.module_code;
    end if;

    v_expected := cardinality(lane.canonical_lesson_ids);

    select count(*)
      into v_have
      from public.lessons l
     where l.module_id=v_module
       and l.id=any(lane.canonical_lesson_ids)
       and l.status='published'::public.content_status
       and length(coalesce(l.body_mdx,'')) > 0;

    if v_have <> v_expected then
      raise exception
        'TASK-064 % canonical source-backed lesson prerequisite failed: % / %',
        lane.module_code, v_have, v_expected;
    end if;

    if exists (
      select 1
      from generate_subscripts(lane.canonical_lesson_ids,1) s(i)
      left join public.constructs c
        on c.code=lane.construct_codes[s.i]
       and c.is_active
      left join public.lesson_constructs lc
        on lc.lesson_id=lane.canonical_lesson_ids[s.i]
       and lc.construct_id=c.id
      where c.id is null or lc.lesson_id is null
    ) then
      raise exception 'TASK-064 % canonical construct mapping prerequisite failed', lane.module_code;
    end if;

    if exists (
      select 1
      from public.lessons l
      where l.module_id=v_module
        and l.status='published'::public.content_status
        and not (l.id=any(lane.canonical_lesson_ids))
        and length(coalesce(l.body_mdx,'')) > 0
    ) then
      raise exception
        'TASK-064 refuses % reconcile: non-empty non-canonical published lesson detected',
        lane.module_code;
    end if;

    select
      (
        select count(*)
        from public.user_lesson_progress p
        join public.lessons l on l.id=p.lesson_id
        where l.module_id=v_module
          and l.status='published'::public.content_status
          and not (l.id=any(lane.canonical_lesson_ids))
      )
      +
      (
        select count(*)
        from public.exams e
        join public.lessons l on l.id=e.lesson_id
        where l.module_id=v_module
          and l.status='published'::public.content_status
          and not (l.id=any(lane.canonical_lesson_ids))
      )
      into v_refs;

    -- topic_test_attempts exists in current production but not in the oldest
    -- fresh bootstrap schema. Guard it dynamically so the migration remains
    -- compatible with both histories while still refusing real learner refs.
    v_topic_refs := 0;
    if to_regclass('public.topic_test_attempts') is not null then
      execute $sql$
        select count(*)
        from public.topic_test_attempts t
        join public.lessons l on l.id=t.lesson_id
        where l.module_id=$1
          and l.status='published'::public.content_status
          and not (l.id=any($2))
      $sql$
      into v_topic_refs
      using v_module,lane.canonical_lesson_ids;
    end if;
    v_refs := v_refs + v_topic_refs;

    if v_refs <> 0 then
      raise exception
        'TASK-064 refuses % reconcile: % learner/exam references on published legacy lessons',
        lane.module_code, v_refs;
    end if;

    -- Rebind every question in the lane to the canonical one-to-one source lesson.
    update public.questions q
       set source_lesson_id=m.lesson_id,
           updated_at=now()
      from public.constructs c
      join (
        select
          lane.construct_codes[s.i] as construct_code,
          lane.canonical_lesson_ids[s.i] as lesson_id
        from generate_subscripts(lane.canonical_lesson_ids,1) s(i)
      ) m on m.construct_code=c.code
     where q.construct_id=c.id
       and q.source_lesson_id is distinct from m.lesson_id;

    -- Archive only the published non-canonical rows. Never delete history.
    with legacy as (
      select
        l.id,
        row_number() over(order by l.order_idx,l.id) as rn
      from public.lessons l
      where l.module_id=v_module
        and l.status='published'::public.content_status
        and not (l.id=any(lane.canonical_lesson_ids))
    )
    update public.lessons l
       set order_idx=100+legacy.rn,
           slug='legacy-archived-'||left(l.id::text,8)||'-'||l.slug,
           status='archived'::public.content_status,
           updated_at=now()
      from legacy
     where l.id=legacy.id;

    delete from public.lesson_constructs lc
    using public.lessons l
    where lc.lesson_id=l.id
      and l.module_id=v_module
      and l.status='archived'::public.content_status
      and not (l.id=any(lane.canonical_lesson_ids));
  end loop;
end
$$;

commit;
