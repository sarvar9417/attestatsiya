-- T-007 RLS regression matrix. The fixture is fully rolled back.
begin;

insert into auth.users (id, email)
values
  ('10000000-0000-4000-8000-000000000001', 'rls-user-a@example.invalid'),
  ('10000000-0000-4000-8000-000000000002', 'rls-user-b@example.invalid'),
  ('10000000-0000-4000-8000-000000000003', 'rls-admin@example.invalid');

update public.profiles
   set role = 'admin'
 where id = '10000000-0000-4000-8000-000000000003';

insert into public.modules (
  id, subject_id, code, slug, title_uz, summary_uz, order_idx, status
)
select
  '10000000-0000-4000-8000-000000000101',
  s.id,
  'RLS-DRAFT',
  'rls-draft',
  'RLS draft module',
  'Faqat staff ko‘rishi kerak',
  999,
  'draft'::public.content_status
from public.subjects s
order by s.code
limit 1;

insert into public.questions (
  id, subject_id, construct_id, group_code, format, cognitive,
  difficulty, stem_md, status
)
select
  '10000000-0000-4000-8000-000000000201',
  c.subject_id,
  c.id,
  c.group_code,
  'Y1'::public.question_format,
  'bilish'::public.cognitive_level,
  1,
  'RLS own-exam key question',
  'published'::public.content_status
from public.constructs c
where c.is_active
order by c.code
limit 1;

insert into public.questions (
  id, subject_id, construct_id, group_code, format, cognitive,
  difficulty, stem_md, status
)
select
  '10000000-0000-4000-8000-000000000202',
  c.subject_id,
  c.id,
  c.group_code,
  'Y1'::public.question_format,
  'bilish'::public.cognitive_level,
  1,
  'RLS foreign key question',
  'published'::public.content_status
from public.constructs c
where c.is_active
order by c.code
limit 1;

insert into public.question_keys (question_id, payload, explanation_md)
values
  (
    '10000000-0000-4000-8000-000000000201',
    '{"correct_option_id":"10000000-0000-4000-8000-000000000211"}',
    'Own-exam key'
  ),
  (
    '10000000-0000-4000-8000-000000000202',
    '{"correct_option_id":"10000000-0000-4000-8000-000000000212"}',
    'Foreign key'
  );

insert into public.exams (id, user_id, kind)
values
  (
    '10000000-0000-4000-8000-000000000301',
    '10000000-0000-4000-8000-000000000001',
    'mavzu'
  ),
  (
    '10000000-0000-4000-8000-000000000302',
    '10000000-0000-4000-8000-000000000002',
    'mavzu'
  );

insert into public.exam_items (
  id, exam_id, question_id, construct_id, order_idx
)
select
  '10000000-0000-4000-8000-000000000401',
  '10000000-0000-4000-8000-000000000301',
  q.id,
  q.construct_id,
  1
from public.questions q
where q.id = '10000000-0000-4000-8000-000000000201';

-- Learner A: published content is readable, draft content is hidden,
-- only own exam and own-exam key are visible.
select set_config(
  'request.jwt.claim.sub',
  '10000000-0000-4000-8000-000000000001',
  false
);
set role authenticated;

do $$
declare
  v_count integer;
begin
  select count(*) into v_count
    from public.modules
   where id = '10000000-0000-4000-8000-000000000101';
  if v_count <> 0 then
    raise exception 'learner must not read draft module';
  end if;

  select count(*) into v_count
    from public.exams
   where id in (
     '10000000-0000-4000-8000-000000000301',
     '10000000-0000-4000-8000-000000000302'
   );
  if v_count <> 1 then
    raise exception 'learner exam isolation failed: % visible', v_count;
  end if;

  select count(*) into v_count
    from public.question_keys
   where question_id = '10000000-0000-4000-8000-000000000201';
  if v_count <> 1 then
    raise exception 'learner must read key only for own exam item';
  end if;

  select count(*) into v_count
    from public.question_keys
   where question_id = '10000000-0000-4000-8000-000000000202';
  if v_count <> 0 then
    raise exception 'learner must not read foreign question key';
  end if;
end
$$;

do $$
begin
  insert into public.modules (
    subject_id, code, slug, title_uz, order_idx, status
  )
  select
    s.id,
    'RLS-USER-WRITE',
    'rls-user-write',
    'Forbidden learner write',
    1000,
    'draft'::public.content_status
  from public.subjects s
  order by s.code
  limit 1;

  raise exception 'learner module write unexpectedly succeeded';
exception
  when sqlstate '42501' then null;
end
$$;

reset role;

-- Admin: can see draft content, all exams and all keys.
select set_config(
  'request.jwt.claim.sub',
  '10000000-0000-4000-8000-000000000003',
  false
);
set role authenticated;

do $$
declare
  v_count integer;
begin
  select count(*) into v_count
    from public.modules
   where id = '10000000-0000-4000-8000-000000000101';
  if v_count <> 1 then
    raise exception 'admin must read draft module';
  end if;

  select count(*) into v_count
    from public.exams
   where id in (
     '10000000-0000-4000-8000-000000000301',
     '10000000-0000-4000-8000-000000000302'
   );
  if v_count <> 2 then
    raise exception 'admin must read both exams: % visible', v_count;
  end if;

  select count(*) into v_count
    from public.question_keys
   where question_id in (
     '10000000-0000-4000-8000-000000000201',
     '10000000-0000-4000-8000-000000000202'
   );
  if v_count <> 2 then
    raise exception 'admin must read both question keys: % visible', v_count;
  end if;
end
$$;

reset role;
select set_config('request.jwt.claim.sub', '', false);
select 'rls_product_access_ok' as result;

rollback;
