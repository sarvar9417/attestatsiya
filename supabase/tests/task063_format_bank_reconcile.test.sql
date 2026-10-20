-- TASK-063 regression: Y2/Y3 expansion + M02/M05 canonical lesson reconciliation.
-- TASK-305 owns the published native correction for T063-Y2-022; TASK-306
-- supplies review-only native revisions for the remaining legacy rows.

do $$
declare
  v_count int;
begin
  with effective as (
    select r.revision_question_id question_id
    from public.questions source_q
    join public.question_bank_revisions r
      on r.source_question_id=source_q.id
     and r.revision_kind='legacy_y2_native_sides'
    where source_q.source_reference like 'formatbank-2026:T063-Y2-%'
    union all
    select q.id
    from public.questions q
    where q.source_reference='m13-qa-fix:v2:T063-Y2-022'
      and q.status='published'::public.content_status
  )
  select count(*) into v_count
  from effective e
  join public.questions q on q.id=e.question_id
  where q.format='Y2'::public.question_format
    and q.status in ('published'::public.content_status,'review'::public.content_status);
  if v_count <> 24 then
    raise exception 'TASK-063 expected 24 effective native Y2 items, found %',v_count;
  end if;

  select count(*) into v_count
  from public.questions
  where source_reference like 'formatbank-2026:T063-Y3-%'
    and format='Y3'::public.question_format
    and status='published'::public.content_status;
  if v_count <> 24 then
    raise exception 'TASK-063 expected 24 published Y3 items, found %',v_count;
  end if;

  if exists (
    with effective as (
      select r.revision_question_id question_id
      from public.questions source_q
      join public.question_bank_revisions r
        on r.source_question_id=source_q.id
       and r.revision_kind='legacy_y2_native_sides'
      where source_q.source_reference like 'formatbank-2026:T063-Y2-%'
      union all
      select q.id
      from public.questions q
      where q.source_reference='m13-qa-fix:v2:T063-Y2-022'
        and q.status='published'::public.content_status
    )
    select 1
    from effective e
    join public.questions q on q.id=e.question_id
    join public.question_keys qk on qk.question_id=q.id
    where (
        (select count(*) from public.question_options qo where qo.question_id=q.id) <> 8
        or (select count(*) from jsonb_each(qk.payload->'pairs')) <> 4
        or not public.check_answer(q.format,qk.payload,qk.payload)
        or q.source_lesson_id is null
        or not exists (
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
        )
      )
  ) then
    raise exception 'TASK-063 malformed Y2 item detected';
  end if;

  if exists (
    select 1
    from public.questions q
    join public.question_keys qk on qk.question_id=q.id
    where q.source_reference like 'formatbank-2026:T063-Y3-%'
      and (
        (select count(*) from public.question_options qo where qo.question_id=q.id) <> 4
        or jsonb_array_length(qk.payload->'order') <> 4
        or not public.check_answer(q.format,qk.payload,qk.payload)
        or q.source_lesson_id is null
        or not exists (
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
        )
      )
  ) then
    raise exception 'TASK-063 malformed Y3 item detected';
  end if;

  if (
    select count(*)
    from public.lessons
    where id in (
      '92000000-0000-4000-8000-000000000001'::uuid,
      '92000000-0000-4000-8000-000000000002'::uuid,
      '92000000-0000-4000-8000-000000000003'::uuid,
      '92000000-0000-4000-8000-000000000004'::uuid,
      '95000000-0000-4000-8000-000000000001'::uuid,
      '95000000-0000-4000-8000-000000000002'::uuid,
      '95000000-0000-4000-8000-000000000003'::uuid
    )
      and status='published'::public.content_status
      and length(coalesce(body_mdx,'')) > 0
  ) <> 7 then
    raise exception 'TASK-063 canonical M02/M05 source-backed lessons incomplete';
  end if;

  if exists (
    select 1
    from public.questions q
    join public.constructs c on c.id=q.construct_id
    where c.code in (
      'S2.HW.01','S2.HW.02','S2.HW.03','S2.HW.04',
      'S3.NUM.01','S3.NUM.02','S3.NUM.03'
    )
      and (
        q.source_lesson_id is null
        or not exists (
          select 1 from public.lesson_constructs lc
          where lc.lesson_id=q.source_lesson_id and lc.construct_id=q.construct_id
        )
      )
  ) then
    raise exception 'TASK-063 M02/M05 question source-lesson drift remains';
  end if;
end
$$;
