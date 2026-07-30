-- RLS and official 2026 seed contract tests (pgTAP)
begin;
select plan(15);

select has_policy(
  'public',
  'modules',
  'content_read_published',
  'published modules are readable'
);
select has_policy('public', 'modules', 'content_write', 'module writes are staff-only');
select has_policy(
  'public',
  'questions',
  'questions_read_published',
  'published questions are readable'
);
select has_policy(
  'public',
  'question_keys',
  'keys_staff_only',
  'answer keys are staff-only'
);
select has_policy('public', 'exams', 'exams_self', 'exams are owner-scoped');
select has_policy('public', 'exam_items', 'exam_items_self', 'exam items are owner-scoped');
select has_policy('public', 'question_reports', 'reports_insert', 'users can report questions');
select has_policy('public', 'audit_log', 'audit_admin', 'audit log is admin-only');

select results_eq(
  $$
    select count(*)::int
      from public.modules module
      join public.subjects subject on subject.id = module.subject_id
     where subject.code = 'informatika'
  $$,
  $$ values (16) $$,
  'official learner taxonomy contains 16 modules'
);

select results_eq(
  $$
    select
      total_questions,
      duration_min,
      points_per_item
      from public.blueprints blueprint
      join public.subjects subject on subject.id = blueprint.subject_id
     where subject.code = 'informatika'
       and blueprint.is_active
  $$,
  $$ values (50, 120, 2) $$,
  'active blueprint is 50 questions / 120 minutes / 2 points'
);

select results_eq(
  $$
    select
      count(*)::int,
      sum(quota.question_count)::int,
      sum(quota.n_bilish)::int,
      sum(quota.n_qollash)::int,
      sum(quota.n_mulohaza)::int
      from public.blueprint_quotas quota
      join public.blueprints blueprint on blueprint.id = quota.blueprint_id
      join public.subjects subject on subject.id = blueprint.subject_id
     where subject.code = 'informatika'
       and blueprint.is_active
  $$,
  $$ values (15, 50, 8, 35, 7) $$,
  'official quotas are 15 / 50 / 8 / 35 / 7'
);

select results_eq(
  $$
    select
      sum((module.exam_section = 'specialty')::int)::int,
      sum((module.exam_section = 'professional_standard')::int)::int,
      sum((module.exam_section = 'pedagogy')::int)::int,
      sum((module.exam_section = 'methodology')::int)::int
      from public.modules module
      join public.subjects subject on subject.id = module.subject_id
     where subject.code = 'informatika'
  $$,
  $$ values (13, 1, 1, 1) $$,
  'module sections are 13 specialty + M14 + M15 + M16'
);

select results_eq(
  $$
    select
      sum(module.exam_question_count)
      filter (where module.exam_section = 'specialty')::int,
      sum(module.exam_question_count)
      filter (where module.exam_section = 'professional_standard')::int,
      sum(module.exam_question_count)
      filter (where module.exam_section = 'pedagogy')::int,
      sum(module.exam_question_count)
      filter (where module.exam_section = 'methodology')::int
      from public.modules module
      join public.subjects subject on subject.id = module.subject_id
     where subject.code = 'informatika'
  $$,
  $$ values (35, 5, 7, 3) $$,
  'section question totals are 35 / 5 / 7 / 3'
);

select results_eq(
  $$
    select count(*)::int
      from public.constructs construct
      join public.subjects subject on subject.id = construct.subject_id
     where subject.code = 'informatika'
       and construct.is_active
  $$,
  $$ values (76) $$,
  'official construct catalog contains 76 active rows'
);

select results_eq(
  $$
    select count(distinct module.code)::int
      from public.modules module
      join public.subjects subject on subject.id = module.subject_id
     where subject.code = 'informatika'
       and module.code between 'M01' and 'M16'
  $$,
  $$ values (16) $$,
  'M01 through M16 are unique stable codes'
);

select * from finish();
rollback;
