-- P0-004 regression tests. The whole fixture is rolled back.

begin;

insert into auth.users (id, email)
values
  ('00000000-0000-4000-8000-000000000001', 'security-user@example.invalid'),
  ('00000000-0000-4000-8000-000000000002', 'security-admin@example.invalid');

insert into public.questions (
  id,
  subject_id,
  construct_id,
  group_code,
  format,
  cognitive,
  stem_md,
  status
)
select
  seed.id,
  construct.subject_id,
  construct.id,
  construct.group_code,
  'Y1'::public.question_format,
  'bilish'::public.cognitive_level,
  seed.stem_md,
  'published'::public.content_status
from (
  values
    (
      '00000000-0000-4000-8000-000000000101'::uuid,
      'Imtihondagi test savoli'
    ),
    (
      '00000000-0000-4000-8000-000000000102'::uuid,
      'Imtihonga kiritilmagan test savoli'
    )
) as seed(id, stem_md)
cross join lateral (
  select id, subject_id, group_code
    from public.constructs
   where is_active
   order by code
   limit 1
) as construct;

insert into public.question_keys (question_id, payload, explanation_md)
values
  (
    '00000000-0000-4000-8000-000000000101',
    '{"correct_option_id":"00000000-0000-4000-8000-000000000111"}',
    'Birinchi savol izohi'
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    '{"correct_option_id":"00000000-0000-4000-8000-000000000112"}',
    'Ikkinchi savol izohi'
  );

insert into public.exams (id, user_id, kind)
values (
  '00000000-0000-4000-8000-000000000201',
  '00000000-0000-4000-8000-000000000001',
  'mavzu'
);

insert into public.exam_items (
  id,
  exam_id,
  question_id,
  construct_id,
  order_idx
)
select
  '00000000-0000-4000-8000-000000000301',
  '00000000-0000-4000-8000-000000000201',
  question.id,
  question.construct_id,
  1
from public.questions question
where question.id = '00000000-0000-4000-8000-000000000101';

do $$
begin
  if has_function_privilege(
    'anon',
    'public.submit_answer(uuid,uuid,jsonb,integer)',
    'EXECUTE'
  ) then
    raise exception 'anon must not execute submit_answer';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.submit_answer(uuid,uuid,jsonb,integer)',
    'EXECUTE'
  ) then
    raise exception 'authenticated must execute submit_answer';
  end if;
end
$$;

-- A normal user can edit safe profile fields.
select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000001',
  false
);
set role authenticated;

update public.profiles
   set display_name = 'Xavfsizlik testi'
 where id = '00000000-0000-4000-8000-000000000001';

-- The same user cannot promote themselves or unblock a protected account.
do $$
begin
  update public.profiles
     set role = 'admin'
   where id = '00000000-0000-4000-8000-000000000001';

  raise exception 'expected profile_security_fields_forbidden';
exception
  when sqlstate '42501' then
    if sqlerrm <> 'profile_security_fields_forbidden' then
      raise;
    end if;
end
$$;

reset role;

do $$
begin
  if (
    select role <> 'user'::public.user_role
      from public.profiles
     where id = '00000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'self role escalation changed the stored role';
  end if;
end
$$;

-- An authenticated administrator retains intended staff management access.
update public.profiles
   set role = 'admin'
 where id = '00000000-0000-4000-8000-000000000002';

select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000002',
  false
);
set role authenticated;

update public.profiles
   set is_blocked = true
 where id = '00000000-0000-4000-8000-000000000001';

reset role;

do $$
begin
  if not (
    select is_blocked
      from public.profiles
     where id = '00000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'admin security-field update was not preserved';
  end if;
end
$$;

update public.profiles
   set is_blocked = false
 where id = '00000000-0000-4000-8000-000000000001';

-- First answer is accepted. Retries return the stored result and cannot
-- overwrite the answer or increment spaced-repetition progress twice.
select set_config(
  'request.jwt.claim.sub',
  '00000000-0000-4000-8000-000000000001',
  false
);
set role authenticated;

do $$
declare
  v_result jsonb;
begin
  v_result := public.submit_answer(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000101',
    '{"option_id":"00000000-0000-4000-8000-000000000111"}',
    12
  );

  if v_result <> '{"saved":true,"correct":true,"explanation_md":"Birinchi savol izohi"}'::jsonb then
    raise exception 'unexpected first-answer response: %', v_result;
  end if;

  v_result := public.submit_answer(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000101',
    '{"option_id":"wrong"}',
    99
  );

  if v_result <> '{"saved":true,"already_answered":true,"correct":true,"explanation_md":"Birinchi savol izohi"}'::jsonb then
    raise exception 'unexpected idempotent response: %', v_result;
  end if;
end
$$;

-- A keyed question outside the owned exam must be rejected before scoring.
do $$
begin
  perform public.submit_answer(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000102',
    '{"option_id":"00000000-0000-4000-8000-000000000112"}',
    4
  );

  raise exception 'expected savol_sinovga_tegisli_emas';
exception
  when others then
    if sqlerrm <> 'savol_sinovga_tegisli_emas' then
      raise;
    end if;
end
$$;

do $$
begin
  perform public.submit_answer(
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000101',
    '{"option_id":"00000000-0000-4000-8000-000000000111"}',
    -1
  );

  raise exception 'expected time_spent_invalid';
exception
  when others then
    if sqlerrm <> 'time_spent_invalid' then
      raise;
    end if;
end
$$;

reset role;

do $$
declare
  v_item public.exam_items%rowtype;
  v_attempts int;
begin
  select *
    into strict v_item
    from public.exam_items
   where id = '00000000-0000-4000-8000-000000000301';

  if v_item.user_answer <> '{"option_id":"00000000-0000-4000-8000-000000000111"}'::jsonb
     or not v_item.is_correct
     or v_item.score <> 2
     or v_item.time_spent_sec <> 12 then
    raise exception 'stored first answer was mutated';
  end if;

  select attempts
    into strict v_attempts
    from public.user_construct_stats
   where user_id = '00000000-0000-4000-8000-000000000001'
     and construct_id = v_item.construct_id;

  if v_attempts <> 1 then
    raise exception 'SM-2 attempts expected 1, got %', v_attempts;
  end if;
end
$$;

select set_config('request.jwt.claim.sub', '', false);
select 'security_hardening_ok' as result;

rollback;
