-- T-039 adaptive selector regression. Transaction is rolled back.
begin;

do $$
declare
  v_subject uuid;
  v_group text;
begin
  select bp.subject_id, bq.group_code
  into v_subject, v_group
  from public.blueprints bp
  join public.blueprint_quotas bq on bq.blueprint_id = bp.id
  where bp.is_active
  order by bq.order_idx
  limit 1;

  if v_subject is null or v_group is null then
    raise exception 'active blueprint quota required for adaptive test';
  end if;

  insert into auth.users (id, email)
  values ('00000000-0000-4000-8000-000000000801', 'adaptive-user@example.invalid');

  insert into public.constructs (
    id, subject_id, group_code, code, slug, title_uz
  )
  values
    ('00000000-0000-4000-8000-000000000811', v_subject, v_group, 'T039.WEAK', 't039-weak', 'T039 weak'),
    ('00000000-0000-4000-8000-000000000812', v_subject, v_group, 'T039.DUE', 't039-due', 'T039 due'),
    ('00000000-0000-4000-8000-000000000813', v_subject, v_group, 'T039.NEW', 't039-new', 'T039 new'),
    ('00000000-0000-4000-8000-000000000814', v_subject, v_group, 'T039.STRONG', 't039-strong', 'T039 strong'),
    ('00000000-0000-4000-8000-000000000815', v_subject, v_group, 'T039.NEUTRAL', 't039-neutral', 'T039 neutral');

  -- 7 weak revisions: one is the most recent wrong answer, one has prior
  -- exposure, five are fresh. First adaptive session should choose the five
  -- fresh revisions and avoid both immediate retry and higher exposure.
  insert into public.questions (
    id, subject_id, construct_id, group_code, format, cognitive, stem_md, status
  )
  select
    ('00000000-0000-4000-8000-00000000082' || n::text)::uuid,
    v_subject,
    '00000000-0000-4000-8000-000000000811'::uuid,
    v_group,
    'Y1'::public.question_format,
    'qollash'::public.cognitive_level,
    'Adaptive weak ' || n,
    'published'::public.content_status
  from generate_series(0, 6) as n;

  insert into public.questions (
    id, subject_id, construct_id, group_code, format, cognitive, stem_md, status
  )
  values
    ('00000000-0000-4000-8000-000000000831', v_subject, '00000000-0000-4000-8000-000000000812', v_group, 'Y1', 'qollash', 'Adaptive due 1', 'published'),
    ('00000000-0000-4000-8000-000000000832', v_subject, '00000000-0000-4000-8000-000000000812', v_group, 'Y1', 'qollash', 'Adaptive due 2', 'published'),
    ('00000000-0000-4000-8000-000000000833', v_subject, '00000000-0000-4000-8000-000000000812', v_group, 'Y1', 'qollash', 'Adaptive due 3', 'published'),
    ('00000000-0000-4000-8000-000000000841', v_subject, '00000000-0000-4000-8000-000000000813', v_group, 'Y1', 'bilish', 'Adaptive new', 'published'),
    ('00000000-0000-4000-8000-000000000851', v_subject, '00000000-0000-4000-8000-000000000814', v_group, 'Y1', 'mulohaza', 'Adaptive strong', 'published'),
    ('00000000-0000-4000-8000-000000000861', v_subject, '00000000-0000-4000-8000-000000000815', v_group, 'Y1', 'bilish', 'Adaptive neutral fallback', 'published');

  insert into public.user_construct_stats (
    user_id, construct_id, attempts, correct, streak, interval_days, due_at,
    last_seen_at, mastery_status, review_stage, independent_attempts
  )
  values
    (
      '00000000-0000-4000-8000-000000000801',
      '00000000-0000-4000-8000-000000000811',
      5, 1, 0, 1, now() + interval '1 day', now(),
      'regressed', 0, 5
    ),
    (
      '00000000-0000-4000-8000-000000000801',
      '00000000-0000-4000-8000-000000000812',
      4, 3, 2, 3, now() - interval '1 day', now(),
      'provisional', 2, 4
    ),
    (
      '00000000-0000-4000-8000-000000000801',
      '00000000-0000-4000-8000-000000000814',
      5, 5, 5, 30, now() + interval '30 days', now(),
      'stable', 5, 5
    ),
    (
      '00000000-0000-4000-8000-000000000801',
      '00000000-0000-4000-8000-000000000815',
      1, 1, 1, 3, now() + interval '3 days', now(),
      'provisional', 2, 1
    );

  -- Earlier exposure for weak revision ...820.
  insert into public.exams (
    id, user_id, kind, started_at, finished_at
  )
  values (
    '00000000-0000-4000-8000-000000000871',
    '00000000-0000-4000-8000-000000000801',
    'mavzu',
    now() - interval '2 days',
    now() - interval '2 days' + interval '10 minutes'
  );

  insert into public.exam_items (
    id, exam_id, question_id, construct_id, order_idx,
    user_answer, is_correct, answered_at
  )
  values (
    '00000000-0000-4000-8000-000000000881',
    '00000000-0000-4000-8000-000000000871',
    '00000000-0000-4000-8000-000000000820',
    '00000000-0000-4000-8000-000000000811',
    1,
    '{}'::jsonb,
    true,
    now() - interval '2 days' + interval '5 minutes'
  );

  -- Most recent answered exam has exact wrong revision ...821.
  insert into public.exams (
    id, user_id, kind, started_at, finished_at
  )
  values (
    '00000000-0000-4000-8000-000000000872',
    '00000000-0000-4000-8000-000000000801',
    'mavzu',
    now() - interval '1 day',
    now() - interval '1 day' + interval '10 minutes'
  );

  insert into public.exam_items (
    id, exam_id, question_id, construct_id, order_idx,
    user_answer, is_correct, answered_at
  )
  values (
    '00000000-0000-4000-8000-000000000882',
    '00000000-0000-4000-8000-000000000872',
    '00000000-0000-4000-8000-000000000821',
    '00000000-0000-4000-8000-000000000811',
    1,
    '{}'::jsonb,
    false,
    now() - interval '1 day' + interval '5 minutes'
  );
end
$$;

select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000801',
  false
);
set role authenticated;

select public.start_adaptive_practice(null, 10);

reset role;

do $$
declare
  v_exam uuid;
  v_meta jsonb;
  v_count int;
begin
  select id, selection_meta
  into strict v_exam, v_meta
  from public.exams
  where user_id = '00000000-0000-4000-8000-000000000801'
    and kind = 'mashq'
  order by started_at desc
  limit 1;

  select count(*) into v_count
  from public.exam_items
  where exam_id = v_exam;

  if v_count <> 10 then
    raise exception 'adaptive session must contain 10 questions, got %', v_count;
  end if;

  if exists (
    select 1
    from public.exam_items
    where exam_id = v_exam
      and question_id = '00000000-0000-4000-8000-000000000821'
  ) then
    raise exception 'immediate exact wrong retry leaked into adaptive session';
  end if;

  if exists (
    select 1
    from public.exam_items
    where exam_id = v_exam
      and question_id = '00000000-0000-4000-8000-000000000820'
  ) then
    raise exception 'exposure penalty did not prefer fresh weak revisions';
  end if;

  if (v_meta #>> '{target_count,weak}')::int <> 5
     or (v_meta #>> '{target_count,due}')::int <> 3
     or (v_meta #>> '{target_count,new}')::int <> 1
     or (v_meta #>> '{target_count,strong}')::int <> 1 then
    raise exception '10-item target count is not 5/3/1/1: %', v_meta;
  end if;

  if (v_meta->>'fallback_used')::boolean then
    raise exception 'unexpected fallback in sufficient-pool case: %', v_meta;
  end if;

  if exists (
    select 1
    from public.exam_items ei
    join public.questions q on q.id = ei.question_id
    where ei.exam_id = v_exam
      and (
        q.status <> 'published'::public.content_status
        or not exists (
          select 1
          from public.blueprint_quotas bq
          join public.blueprints bp on bp.id = bq.blueprint_id
          where bp.is_active
            and bp.subject_id = q.subject_id
            and bq.group_code = q.group_code
        )
      )
  ) then
    raise exception 'adaptive session contains ineligible question';
  end if;
end
$$;

-- Remove two fresh weak revisions. Now weak bucket can only supply four
-- revisions after immediate-wrong exclusion; the neutral revision must be
-- used as audited fallback.
update public.questions
set status = 'archived'::public.content_status
where id in (
  '00000000-0000-4000-8000-000000000825',
  '00000000-0000-4000-8000-000000000826'
);

select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000801',
  false
);
set role authenticated;

select public.start_adaptive_practice(null, 10);

reset role;

do $$
declare
  v_meta jsonb;
begin
  select selection_meta
  into strict v_meta
  from public.exams
  where user_id = '00000000-0000-4000-8000-000000000801'
    and kind = 'mashq'
  order by started_at desc
  limit 1;

  if not (v_meta->>'fallback_used')::boolean
     or (v_meta->>'fallback_count')::int < 1 then
    raise exception 'fallback audit metadata missing: %', v_meta;
  end if;
end
$$;

select set_config('request.jwt.claim.sub', '', false);
select 'adaptive_practice_selector_ok' as result;

rollback;
