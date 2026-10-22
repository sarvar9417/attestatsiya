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
      and (lane.module_code <> 'M06' or l.slug not like 'algoritmlash-v2-%')
      and (lane.module_code <> 'M13' or l.slug !~ '^m13-axr-0[1-7]$');

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
        and (lane.module_code <> 'M13' or l.slug !~ '^m13-axr-0[1-7]$')
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
        -- TASK-204/205/207/332 source-backed M06 V2/V3/V4 revisions
        -- must not be reconciled onto TASK-064 legacy lesson identifiers.
        and (lane.module_code <> 'M06'
             or coalesce(q.source_reference,'') !~ '^algoritmlash-v[234]:')
        -- TASK-211/212/213 version the seven M13 AXR lessons.
        -- Only the exact AXR bank may use its independent source-lesson ID.
        and not (lane.module_code = 'M13'
                 and q.status in ('review'::public.content_status,'published'::public.content_status,'archived'::public.content_status)
                 and (
                   coalesce(q.source_reference,'') like 'm13-axr-v1:%:AXR-%'
                   or (coalesce(q.source_reference,'') like 'm13-axr-native-v1:Y2:AXRN-%'
                       and q.format='Y2'::public.question_format)
                   or (coalesce(q.source_reference,'') like 'm13-axr-native-v1:Y3:AXRN-%'
                       and q.format='Y3'::public.question_format)
                 )
                 and exists (
                   select 1 from public.lessons edition
                   join public.modules em on em.id=edition.module_id
                   join public.lesson_constructs edlink
                     on edlink.lesson_id=edition.id and edlink.construct_id=q.construct_id
                   where edition.id=q.source_lesson_id
                     and em.code='M13'
                     and edition.slug ~ '^m13-axr-0[1-7]$'
                 ))
        -- TASK-402/403 immutable repairs keep their exact M13 AXR source edition.
        -- Exempt ONLY a properly linked edition revision whose original question
        -- is one of the already-authorized M13 AXR V1 source questions.
        and not (lane.module_code = 'M13'
          and q.status in ('review'::public.content_status,'published'::public.content_status,'archived'::public.content_status)
          and (coalesce(q.source_reference,'') like 'revision:TASK-402:AI-edited:%'
               or coalesce(q.source_reference,'') like 'revision:TASK-403:AI-edited:%')
          and exists (
            select 1 from public.question_bank_revisions br
            join public.questions original on original.id=br.source_question_id
            join public.lessons edition on edition.id=q.source_lesson_id
            join public.modules em on em.id=edition.module_id
            join public.lesson_constructs link on link.lesson_id=edition.id
                 and link.construct_id=q.construct_id
            where br.revision_question_id=q.id
              and br.revision_kind='owner_ai_y1_option_length_semantic_repair'
              and original.source_reference like 'm13-axr-v1:Y1:AXR-%'
              and original.construct_id=q.construct_id
              and original.source_lesson_id=q.source_lesson_id
              and em.code='M13'
              and edition.slug ~ '^m13-axr-0[1-7]
        and not (lane.module_code = 'M13'
          and q.status in ('review'::public.content_status,'published'::public.content_status)
          and q.format = 'Y2'::public.question_format
          and coalesce(q.source_reference,'') ~ '^m13-qc-v2:Y2:AXRN-0[1-7]-Y2-01'
          and length(coalesce(q.source_reference,'')) = length('m13-qc-v2:Y2:AXRN-01-Y2-01')
          and exists (
            select 1 from public.lessons l306
            join public.modules m306 on m306.id=l306.module_id
            join public.lesson_constructs lc306 on lc306.lesson_id=l306.id
            where l306.id=q.source_lesson_id
              and lc306.construct_id=q.construct_id
              and m306.code='M13'
              and l306.slug ~ '^m13-axr-0[1-7]'
              and length(l306.slug)=length('m13-axr-01')
          ))
        -- TASK-213 graphics/web V2 is a separate unpublished content edition.
        -- Do not exempt published items or non-V2 sources from drift checks.
        and not (lane.module_code IN ('M10','M11')
                 and q.status = 'review'::public.content_status
                 and (coalesce(q.source_reference,'') like 'GV2:GV-%'
                      or coalesce(q.source_reference,'') like '%GV2-EXT-%')
                 and EXISTS (
                    SELECT 1 FROM public.lessons v2
                    WHERE v2.id=q.source_lesson_id
                      AND v2.status='review'::public.content_status
                      AND v2.slug LIKE '%-v2-review'
                 ))
        -- TASK-220: isolated REVIEW edition question candidates must remain linked
        -- to their own M12 V2 source snapshots even when lessons are published.
        -- Strict source labels and status-review keep every other item gated.
        and not (lane.module_code = 'M12'
                 and q.status in ('review'::public.content_status,'published'::public.content_status)
                 and (coalesce(q.source_reference,'') like 'network-v2-20261018:TAR-%:original-%'
                      or coalesce(q.source_reference,'') like 'network-v3-extra-20261018:TAR-NET26-Y%'
                      or coalesce(q.source_reference,'') like 'm12-examstyle-20261020:M12-REAL26-%'
                      or coalesce(q.source_reference,'') like 'm12-stylefix-20261020:M12-REV26-%')
                 and exists (
                    select 1 from public.lessons v2
                    join public.modules vm on vm.id=v2.module_id
                    where v2.id=q.source_lesson_id
                      and vm.code='M12'
                      and v2.slug like 'tarmoq-v2-bob-%'
                      and v2.status IN ('draft','published')
                 ))
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

          ))
        -- TASK-306 exact seven source-backed REVIEW 4x5 matching revisions.
        and not (lane.module_code = 'M13'
          and q.status in ('review'::public.content_status,'published'::public.content_status)
          and q.format = 'Y2'::public.question_format
          and coalesce(q.source_reference,'') ~ '^m13-qc-v2:Y2:AXRN-0[1-7]-Y2-01'
          and length(coalesce(q.source_reference,'')) = length('m13-qc-v2:Y2:AXRN-01-Y2-01')
          and exists (
            select 1 from public.lessons l306
            join public.modules m306 on m306.id=l306.module_id
            join public.lesson_constructs lc306 on lc306.lesson_id=l306.id
            where l306.id=q.source_lesson_id
              and lc306.construct_id=q.construct_id
              and m306.code='M13'
              and l306.slug ~ '^m13-axr-0[1-7]'
              and length(l306.slug)=length('m13-axr-01')
          ))
        -- TASK-213 graphics/web V2 is a separate unpublished content edition.
        -- Do not exempt published items or non-V2 sources from drift checks.
        and not (lane.module_code IN ('M10','M11')
                 and q.status = 'review'::public.content_status
                 and (coalesce(q.source_reference,'') like 'GV2:GV-%'
                      or coalesce(q.source_reference,'') like '%GV2-EXT-%')
                 and EXISTS (
                    SELECT 1 FROM public.lessons v2
                    WHERE v2.id=q.source_lesson_id
                      AND v2.status='review'::public.content_status
                      AND v2.slug LIKE '%-v2-review'
                 ))
        -- TASK-220: isolated REVIEW edition question candidates must remain linked
        -- to their own M12 V2 source snapshots even when lessons are published.
        -- Strict source labels and status-review keep every other item gated.
        and not (lane.module_code = 'M12'
                 and q.status in ('review'::public.content_status,'published'::public.content_status)
                 and (coalesce(q.source_reference,'') like 'network-v2-20261018:TAR-%:original-%'
                      or coalesce(q.source_reference,'') like 'network-v3-extra-20261018:TAR-NET26-Y%'
                      or coalesce(q.source_reference,'') like 'm12-examstyle-20261020:M12-REAL26-%'
                      or coalesce(q.source_reference,'') like 'm12-stylefix-20261020:M12-REV26-%')
                 and exists (
                    select 1 from public.lessons v2
                    join public.modules vm on vm.id=v2.module_id
                    where v2.id=q.source_lesson_id
                      and vm.code='M12'
                      and v2.slug like 'tarmoq-v2-bob-%'
                      and v2.status IN ('draft','published')
                 ))
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
