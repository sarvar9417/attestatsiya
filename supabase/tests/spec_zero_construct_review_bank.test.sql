-- Regression for the review-only specification gap bank.

do $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.questions
  where source_reference like 'specgap-2026:ZC-%';

  if v_count <> 36 then
    raise exception 'spec-gap bank expected 36 review items, found %', v_count;
  end if;

  if exists (
    select 1
    from public.questions q
    left join public.question_bank_revisions r
      on r.source_question_id=q.id
     and r.revision_kind='legacy_y2_native_sides'
    left join public.questions revision_q on revision_q.id=r.revision_question_id
    where q.source_reference like 'specgap-2026:ZC-%'
      and (
        (q.format='Y2'::public.question_format and (
          q.status<>'archived'::public.content_status
          or revision_q.status<>'review'::public.content_status
        ))
        or (q.format<>'Y2'::public.question_format
            and q.status<>'review'::public.content_status)
      )
  ) then
    raise exception 'spec-gap bank must remain review-only';
  end if;

  if (
    select count(*)
    from (
      select c.code, count(*) as n
      from public.questions q
      join public.constructs c on c.id = q.construct_id
      where q.source_reference like 'specgap-2026:ZC-%'
      group by c.code
      having count(*) = 6
    ) x
  ) <> 6 then
    raise exception 'spec-gap bank expected exactly six constructs with six items each';
  end if;

  if exists (
    select 1
    from (
      values
        ('S3.LOGIC.01'),
        ('S3.LOGIC.03'),
        ('S3.ALGO.03'),
        ('S4.CODE.04'),
        ('S6.NET.02'),
        ('S6.NET.04')
    ) expected(code)
    left join (
      select c.code, count(*) as n
      from public.questions q
      join public.constructs c on c.id = q.construct_id
      where q.source_reference like 'specgap-2026:ZC-%'
      group by c.code
    ) actual using(code)
    where coalesce(actual.n, 0) <> 6
  ) then
    raise exception 'spec-gap per-construct count mismatch';
  end if;

  select count(*) into v_count
  from public.questions
  where source_reference like 'specgap-2026:ZC-%'
    and format = 'Y1'::public.question_format;
  if v_count <> 24 then
    raise exception 'spec-gap expected 24 Y1 items, found %', v_count;
  end if;

  select count(*) into v_count
  from public.questions
  where source_reference like 'specgap-2026:ZC-%'
    and format = 'Y2'::public.question_format;
  if v_count <> 6 then
    raise exception 'spec-gap expected 6 Y2 items, found %', v_count;
  end if;

  select count(*) into v_count
  from public.questions
  where source_reference like 'specgap-2026:ZC-%'
    and format = 'Y3'::public.question_format;
  if v_count <> 6 then
    raise exception 'spec-gap expected 6 Y3 items, found %', v_count;
  end if;

  if exists (
    with effective as (
      select coalesce(r.revision_question_id,source_q.id) question_id
      from public.questions source_q
      left join public.question_bank_revisions r
        on r.source_question_id=source_q.id
       and r.revision_kind='legacy_y2_native_sides'
      where source_q.source_reference like 'specgap-2026:ZC-%'
    )
    select 1
    from effective e
    join public.questions q on q.id=e.question_id
    left join public.question_keys qk on qk.question_id = q.id
    where (
        q.construct_id is null
        or q.source_lesson_id is null
        or q.source_reference is null
        or qk.question_id is null
        or not exists (
          select 1
          from public.lesson_constructs lc
          where lc.lesson_id = q.source_lesson_id
            and lc.construct_id = q.construct_id
        )
      )
  ) then
    raise exception 'spec-gap source/key/construct integrity failure';
  end if;

  if exists (
    with effective as (
      select coalesce(r.revision_question_id,source_q.id) question_id
      from public.questions source_q
      left join public.question_bank_revisions r
        on r.source_question_id=source_q.id
       and r.revision_kind='legacy_y2_native_sides'
      where source_q.source_reference like 'specgap-2026:ZC-%'
    )
    select 1
    from effective e
    join public.questions q on q.id=e.question_id
    join public.constructs c on c.id = q.construct_id
    join public.lessons l on l.id = q.source_lesson_id
    where l.slug <> case c.code
        when 'S3.LOGIC.01' then 'mantiqiy-mulohazalar'
        when 'S3.LOGIC.03' then 'mantiqiy-xulosa-va-masala'
        when 'S3.ALGO.03' then 'masala-algoritmini-tuzish'
        when 'S4.CODE.04' then 'javascript-sintaksis-asoslari'
        when 'S6.NET.02' then 'arxitektura-va-topologiyalar'
        when 'S6.NET.04' then 'internetdan-xavfsiz-va-maqsadli-foydalanish'
        else '__unexpected_construct__'
      end
  ) then
    raise exception 'spec-gap canonical source lesson mismatch';
  end if;

  if exists (
    select 1
    from public.questions q
    join public.question_keys qk on qk.question_id = q.id
    where q.source_reference like 'specgap-2026:ZC-%'
      and q.format = 'Y1'::public.question_format
      and (
        (select count(*) from public.question_options qo where qo.question_id = q.id) <> 4
        or not exists (
          select 1
          from public.question_options qo
          where qo.question_id = q.id
            and qo.id = (qk.payload->>'correct_option_id')::uuid
        )
      )
  ) then
    raise exception 'spec-gap malformed Y1 item detected';
  end if;

  if exists (
    select 1
    from public.questions source_q
    join public.question_bank_revisions r
      on r.source_question_id=source_q.id
     and r.revision_kind='legacy_y2_native_sides'
    join public.questions q on q.id=r.revision_question_id
    join public.question_keys qk on qk.question_id = q.id
    where source_q.source_reference like 'specgap-2026:ZC-%'
      and q.format = 'Y2'::public.question_format
      and (
        (select count(*) from public.question_options qo where qo.question_id = q.id) <> 8
        or (select count(*) from jsonb_each(qk.payload->'pairs')) <> 4
        or not public.check_answer(q.format, qk.payload, qk.payload)
      )
  ) then
    raise exception 'spec-gap malformed Y2 item detected';
  end if;

  if exists (
    select 1
    from public.questions q
    join public.question_keys qk on qk.question_id = q.id
    where q.source_reference like 'specgap-2026:ZC-%'
      and q.format = 'Y3'::public.question_format
      and (
        (select count(*) from public.question_options qo where qo.question_id = q.id) <> 4
        or jsonb_array_length(qk.payload->'order') <> 4
        or not public.check_answer(q.format, qk.payload, qk.payload)
      )
  ) then
    raise exception 'spec-gap malformed Y3 item detected';
  end if;

  if (
    select count(*)
    from (
      select lower(regexp_replace(trim(stem_md), '\s+', ' ', 'g')) as normalized_stem
      from public.questions
      where source_reference like 'specgap-2026:ZC-%'
      group by lower(regexp_replace(trim(stem_md), '\s+', ' ', 'g'))
      having count(*) > 1
    ) duplicates
  ) > 0 then
    raise exception 'spec-gap duplicate stems detected inside review batch';
  end if;
end
$$;
