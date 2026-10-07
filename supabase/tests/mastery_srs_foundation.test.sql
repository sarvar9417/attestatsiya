-- T-034 mastery/SRS regression. Transaction is rolled back.
begin;

insert into auth.users (id, email)
values ('00000000-0000-4000-8000-000000000701', 'mastery-user@example.invalid');

with target as (
  select id, subject_id, group_code
  from public.constructs
  where is_active
  order by code
  limit 1
)
insert into public.questions (
  id, subject_id, construct_id, group_code, format, cognitive, stem_md, status
)
select *
from (
  select
    '00000000-0000-4000-8000-000000000711'::uuid,
    target.subject_id,
    target.id,
    target.group_code,
    'Y1'::public.question_format,
    'bilish'::public.cognitive_level,
    'Mastery bilish savoli',
    'published'::public.content_status
  from target
  union all
  select
    '00000000-0000-4000-8000-000000000712'::uuid,
    target.subject_id,
    target.id,
    target.group_code,
    'Y1'::public.question_format,
    'qollash'::public.cognitive_level,
    'Mastery qo‘llash savoli',
    'published'::public.content_status
  from target
  union all
  select
    '00000000-0000-4000-8000-000000000713'::uuid,
    target.subject_id,
    target.id,
    target.group_code,
    'Y1'::public.question_format,
    'mulohaza'::public.cognitive_level,
    'Mastery mulohaza savoli',
    'published'::public.content_status
  from target
) seeded;

insert into public.question_keys (question_id, payload, explanation_md)
values
  (
    '00000000-0000-4000-8000-000000000711',
    '{"correct_option_id":"00000000-0000-4000-8000-000000000721"}',
    'Bilish izohi'
  ),
  (
    '00000000-0000-4000-8000-000000000712',
    '{"correct_option_id":"00000000-0000-4000-8000-000000000722"}',
    'Qo‘llash izohi'
  ),
  (
    '00000000-0000-4000-8000-000000000713',
    '{"correct_option_id":"00000000-0000-4000-8000-000000000723"}',
    'Mulohaza izohi'
  );

insert into public.exams (id, user_id, kind)
values
  ('00000000-0000-4000-8000-000000000731', '00000000-0000-4000-8000-000000000701', 'mavzu'),
  ('00000000-0000-4000-8000-000000000732', '00000000-0000-4000-8000-000000000701', 'takrorlash'),
  ('00000000-0000-4000-8000-000000000733', '00000000-0000-4000-8000-000000000701', 'zaif');

insert into public.exam_items (
  id, exam_id, question_id, construct_id, order_idx
)
select
  seed.item_id,
  seed.exam_id,
  seed.question_id,
  q.construct_id,
  1
from (
  values
    (
      '00000000-0000-4000-8000-000000000741'::uuid,
      '00000000-0000-4000-8000-000000000731'::uuid,
      '00000000-0000-4000-8000-000000000711'::uuid
    ),
    (
      '00000000-0000-4000-8000-000000000742'::uuid,
      '00000000-0000-4000-8000-000000000732'::uuid,
      '00000000-0000-4000-8000-000000000712'::uuid
    ),
    (
      '00000000-0000-4000-8000-000000000743'::uuid,
      '00000000-0000-4000-8000-000000000733'::uuid,
      '00000000-0000-4000-8000-000000000713'::uuid
    )
) as seed(item_id, exam_id, question_id)
join public.questions q on q.id = seed.question_id;

select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000701',
  false
);
set role authenticated;

-- First correct answer => learning, +1 day.
select public.submit_answer(
  '00000000-0000-4000-8000-000000000731',
  '00000000-0000-4000-8000-000000000711',
  '{"option_id":"00000000-0000-4000-8000-000000000721"}',
  10
);

-- Immutable retry must not create extra evidence or advance SRS.
select public.submit_answer(
  '00000000-0000-4000-8000-000000000731',
  '00000000-0000-4000-8000-000000000711',
  '{"option_id":"wrong"}',
  99
);

reset role;

do $$
declare
  v public.user_construct_stats%rowtype;
  v_count int;
begin
  select ucs.* into strict v
  from public.user_construct_stats ucs
  join public.questions q on q.construct_id = ucs.construct_id
  where ucs.user_id = '00000000-0000-4000-8000-000000000701'
    and q.id = '00000000-0000-4000-8000-000000000711'
  limit 1;

  if v.attempts <> 1
     or v.correct <> 1
     or v.review_stage <> 1
     or v.interval_days <> 1
     or v.mastery_status <> 'learning'::public.mastery_status
     or v.independent_attempts <> 1
     or v.bilish_attempts <> 1
     or v.bilish_correct <> 1 then
    raise exception 'stage-1 mastery invariant failed: %', row_to_json(v);
  end if;

  select count(*) into v_count
  from public.mastery_evidence
  where user_id = '00000000-0000-4000-8000-000000000701';

  if v_count <> 1 then
    raise exception 'immutable retry created duplicate evidence: %', v_count;
  end if;
end
$$;

-- Second independent correct answer => provisional, +3 days.
select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000701',
  false
);
set role authenticated;

select public.submit_answer(
  '00000000-0000-4000-8000-000000000732',
  '00000000-0000-4000-8000-000000000712',
  '{"option_id":"00000000-0000-4000-8000-000000000722"}',
  11
);

reset role;

do $$
declare
  v public.user_construct_stats%rowtype;
begin
  select * into strict v
  from public.user_construct_stats
  where user_id = '00000000-0000-4000-8000-000000000701';

  if v.attempts <> 2
     or v.correct <> 2
     or v.review_stage <> 2
     or v.interval_days <> 3
     or v.mastery_status <> 'provisional'::public.mastery_status
     or v.independent_attempts <> 2
     or v.qollash_attempts <> 1
     or v.qollash_correct <> 1 then
    raise exception 'stage-2 mastery invariant failed: %', row_to_json(v);
  end if;

  if v.due_at < now() + interval '2 days 23 hours'
     or v.due_at > now() + interval '3 days 1 hour' then
    raise exception 'stage-2 due_at is not approximately +3 days: %', v.due_at;
  end if;
end
$$;

-- Wrong independent answer after provisional => regressed, reset stage, +1 day.
select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000701',
  false
);
set role authenticated;

select public.submit_answer(
  '00000000-0000-4000-8000-000000000733',
  '00000000-0000-4000-8000-000000000713',
  '{"option_id":"wrong"}',
  12
);

-- Learner cannot forge mastery evidence through Data API privileges/RLS.
do $$
begin
  insert into public.mastery_evidence (
    user_id, construct_id, question_id, exam_id, exam_item_id,
    cognitive, evidence_kind, is_correct
  )
  select
    '00000000-0000-4000-8000-000000000701',
    q.construct_id,
    q.id,
    '00000000-0000-4000-8000-000000000733',
    '00000000-0000-4000-8000-000000000743',
    q.cognitive,
    'retry'::public.mastery_evidence_kind,
    true
  from public.questions q
  where q.id = '00000000-0000-4000-8000-000000000713';

  raise exception 'expected mastery evidence insert to be denied';
exception
  when insufficient_privilege then null;
end
$$;

reset role;

do $$
declare
  v public.user_construct_stats%rowtype;
  v_count int;
begin
  select * into strict v
  from public.user_construct_stats
  where user_id = '00000000-0000-4000-8000-000000000701';

  if v.attempts <> 3
     or v.correct <> 2
     or v.review_stage <> 0
     or v.interval_days <> 1
     or v.mastery_status <> 'regressed'::public.mastery_status
     or v.independent_attempts <> 3
     or v.mulohaza_attempts <> 1
     or v.mulohaza_correct <> 0 then
    raise exception 'regression mastery invariant failed: %', row_to_json(v);
  end if;

  select count(*) into v_count
  from public.mastery_evidence
  where user_id = '00000000-0000-4000-8000-000000000701';

  if v_count <> 3 then
    raise exception 'expected 3 append-only evidence rows, got %', v_count;
  end if;
end
$$;

select set_config('request.jwt.claim.sub', '', false);
select 'mastery_srs_foundation_ok' as result;

rollback;
