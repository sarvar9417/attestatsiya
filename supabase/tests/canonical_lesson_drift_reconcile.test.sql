-- Regression for TASK-064 canonical lesson reconciliation.
-- TASK-204 keeps the old published M06 edition as an immutable historical lane;
-- separately versioned Algoritmlash V2 lessons/questions are intentionally exempt.

do $$
declare
  lane record;
  v_module uuid;
  v_published int;
begin
  for lane in
    select *
    from (
      values
        ('M02',array[
          '92000000-0000-4000-8000-000000000001'::uuid,
          '92000000-0000-4000-8000-000000000002'::uuid,
          '92000000-0000-4000-8000-000000000003'::uuid,
          '92000000-0000-4000-8000-000000000004'::uuid
        ],array['S2.HW.01','S2.HW.02','S2.HW.03','S2.HW.04']::text[]),
        ('M03',array[
          '93000000-0000-4000-8000-000000000001'::uuid,
          '93000000-0000-4000-8000-000000000002'::uuid,
          '93000000-0000-4000-8000-000000000003'::uuid,
          '93000000-0000-4000-8000-000000000004'::uuid
        ],array['S2.OFFICE.01','S2.OFFICE.02','S2.OFFICE.03','S2.OFFICE.04']::text[]),
        ('M04',array[
          '94000000-0000-4000-8000-000000000001'::uuid,
          '94000000-0000-4000-8000-000000000002'::uuid,
          '94000000-0000-4000-8000-000000000003'::uuid,
          '94000000-0000-4000-8000-000000000004'::uuid
        ],array['S3.LOGIC.01','S3.LOGIC.02','S3.LOGIC.03','S3.LOGIC.04']::text[]),
        ('M05',array[
          '95000000-0000-4000-8000-000000000001'::uuid,
          '95000000-0000-4000-8000-000000000002'::uuid,
          '95000000-0000-4000-8000-000000000003'::uuid
        ],array['S3.NUM.01','S3.NUM.02','S3.NUM.03']::text[]),
        ('M06',array[
          '96000000-0000-4000-8000-000000000001'::uuid,
          '96000000-0000-4000-8000-000000000002'::uuid,
          '96000000-0000-4000-8000-000000000003'::uuid,
          '96000000-0000-4000-8000-000000000004'::uuid
        ],array['S3.ALGO.01','S3.ALGO.02','S3.ALGO.03','S3.ALGO.04']::text[]),
        ('M07',array[
          '97000000-0000-4000-8000-000000000001'::uuid,
          '97000000-0000-4000-8000-000000000002'::uuid,
          '97000000-0000-4000-8000-000000000003'::uuid,
          '97000000-0000-4000-8000-000000000004'::uuid,
          '97000000-0000-4000-8000-000000000005'::uuid
        ],array['S4.BLOCK.01','S4.BLOCK.02','S4.BLOCK.03','S4.BLOCK.04','S4.BLOCK.05']::text[]),
        ('M08',array[
          '98000000-0000-4000-8000-000000000001'::uuid,
          '98000000-0000-4000-8000-000000000002'::uuid,
          '98000000-0000-4000-8000-000000000003'::uuid,
          '98000000-0000-4000-8000-000000000004'::uuid,
          '98000000-0000-4000-8000-000000000005'::uuid
        ],array['S4.CODE.01','S4.CODE.02','S4.CODE.03','S4.CODE.04','S4.CODE.05']::text[]),
        ('M10',array[
          'a1000000-0000-4000-8000-000000000001'::uuid,
          'a1000000-0000-4000-8000-000000000002'::uuid,
          'a1000000-0000-4000-8000-000000000003'::uuid
        ],array['S5.WEB.01','S5.WEB.02','S5.WEB.03']::text[]),
        ('M11',array[
          'b1100000-0000-4000-8000-000000000001'::uuid,
          'b1100000-0000-4000-8000-000000000002'::uuid,
          'b1100000-0000-4000-8000-000000000003'::uuid
        ],array['S5.WEB.04','S5.WEB.05','S5.WEB.06']::text[]),
        ('M12',array[
          'c1200000-0000-4000-8000-000000000001'::uuid,
          'c1200000-0000-4000-8000-000000000002'::uuid,
          'c1200000-0000-4000-8000-000000000003'::uuid,
          'c1200000-0000-4000-8000-000000000004'::uuid,
          'c1200000-0000-4000-8000-000000000005'::uuid
        ],array['S6.NET.01','S6.NET.02','S6.NET.03','S6.NET.04','S6.NET.05']::text[]),
        ('M13',array[
          'd1300000-0000-4000-8000-000000000001'::uuid,
          'd1300000-0000-4000-8000-000000000002'::uuid,
          'd1300000-0000-4000-8000-000000000003'::uuid,
          'd1300000-0000-4000-8000-000000000004'::uuid,
          'd1300000-0000-4000-8000-000000000005'::uuid,
          'd1300000-0000-4000-8000-000000000006'::uuid
        ],array['S7.SEC.01','S7.SEC.02','S7.SEC.03','S7.SEC.04','S7.SEC.05','S7.SEC.06']::text[])
    ) as x(module_code,canonical_lesson_ids,construct_codes)
  loop
    select id into v_module from public.modules where code=lane.module_code;
    if v_module is null then
      raise exception 'TASK-064 test missing module %',lane.module_code;
    end if;

    select count(*) into v_published
    from public.lessons l
    where l.module_id=v_module and l.status='published'::public.content_status
      and (lane.module_code <> 'M06' or l.slug not like 'algoritmlash-v2-%');

    if v_published <> cardinality(lane.canonical_lesson_ids) then
      raise exception
        'TASK-064 % expected % canonical published lessons, found %',
        lane.module_code,cardinality(lane.canonical_lesson_ids),v_published;
    end if;

    if exists (
      select 1
      from public.lessons l
      where l.module_id=v_module
        and l.status='published'::public.content_status
        and (lane.module_code <> 'M06' or l.slug not like 'algoritmlash-v2-%')
        and (
          not (l.id=any(lane.canonical_lesson_ids))
          or length(coalesce(l.body_mdx,''))=0
        )
    ) then
      raise exception 'TASK-064 % has non-canonical/empty published lesson',lane.module_code;
    end if;

    if exists (
      select 1
      from generate_subscripts(lane.canonical_lesson_ids,1) s(i)
      left join public.constructs c
        on c.code=lane.construct_codes[s.i] and c.is_active
      left join public.lesson_constructs lc
        on lc.construct_id=c.id
       and lc.lesson_id=lane.canonical_lesson_ids[s.i]
      where c.id is null or lc.lesson_id is null
    ) then
      raise exception 'TASK-064 % canonical mapping missing',lane.module_code;
    end if;

    if exists (
      select 1
      from public.questions q
      join public.constructs c on c.id=q.construct_id
      join (
        select
          lane.construct_codes[s.i] as construct_code,
          lane.canonical_lesson_ids[s.i] as lesson_id
        from generate_subscripts(lane.canonical_lesson_ids,1) s(i)
      ) m on m.construct_code=c.code
      where q.source_lesson_id is distinct from m.lesson_id
        -- TASK-204 introduces a separate audited V2 edition with its own
        -- immutable source lesson snapshots, not a TASK-064 drift.
        and (lane.module_code <> 'M06'
             or coalesce(q.source_reference,'') not like 'algoritmlash-v2:%')
        -- TASK-211 adds seven non-published M13 source-book lessons.
        -- Exempt ONLY these exact review records; published drift still fails.
        and not (lane.module_code = 'M13'
                 and q.status = 'review'::public.content_status
                 and coalesce(q.source_reference,'') like 'm13-axr-v1:%:AXR-%')
    ) then
      raise exception 'TASK-064 % question source lesson drift remains',lane.module_code;
    end if;

    if exists (
      select 1
      from public.lesson_constructs lc
      join public.lessons l on l.id=lc.lesson_id
      where l.module_id=v_module and l.status='archived'::public.content_status
    ) then
      raise exception 'TASK-064 % archived legacy construct mapping remains',lane.module_code;
    end if;
  end loop;
end
$$;
