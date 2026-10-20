-- TASK-063 regression: Y2/Y3 expansion + M02/M05 canonical lesson reconciliation.
-- TASK-305 counts the corrected published version of T063-Y2-022 while preserving the archived original.

do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.questions
  where (source_reference like 'formatbank-2026:T063-Y2-%'
         or source_reference='m13-qa-fix:v2:T063-Y2-022')
    and format='Y2'::public.question_format
    and status='published'::public.content_status;
  if v_count <> 24 then
    raise exception 'TASK-063 expected 24 published Y2 items, found %',v_count;
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
    select 1
    from public.questions q
    join public.question_keys qk on qk.question_id=q.id
    where (q.source_reference like 'formatbank-2026:T063-Y2-%'
           or q.source_reference='m13-qa-fix:v2:T063-Y2-022')
      and (
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
