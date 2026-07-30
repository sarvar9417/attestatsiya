-- RLS policy tests (pgTAP)
BEGIN;
SELECT plan(12);

-- RLS policies exist
SELECT has_policy('public', 'modules', 'content_readable', 'modules: content_readable policy');
SELECT has_policy('public', 'questions', 'content_readable', 'questions: content_readable policy');
SELECT has_policy('public', 'questions', 'author_all', 'questions: author_all policy');
SELECT has_policy('public', 'attempts', 'user_own_data', 'attempts: user_own_data policy');
SELECT has_policy('public', 'mastery_records', 'user_own_data', 'mastery_records: user_own_data policy');
SELECT has_policy('public', 'mock_exams', 'user_own_data', 'mock_exams: user_own_data policy');

-- Role seed data
INSERT INTO public.roles (name) VALUES ('student'), ('admin')
ON CONFLICT (name) DO NOTHING;

SELECT results_eq(
  $$ SELECT name FROM public.roles ORDER BY name $$,
  $$ VALUES ('admin'), ('content_author'), ('expert'), ('student') $$,
  'Barcha 4 rol mavjud'
);

-- Specification version
INSERT INTO public.specification_versions (version, year, is_active)
VALUES ('2026', 2026, true)
ON CONFLICT (version) DO NOTHING;

SELECT isnt_empty(
  $$ SELECT * FROM public.specification_versions WHERE is_active = true $$,
  'Active specification version mavjud'
);

-- Module count
SELECT results_eq(
  $$ SELECT count(*)::int FROM public.modules WHERE spec_id = (SELECT id FROM public.specification_versions WHERE is_active) $$,
  $$ SELECT 16 $$,
  '16 modul mavjud'
);

-- Trigger exists for auth.users sync
SELECT has_trigger('public', 'users', 'on_auth_user_created', 'auth.users sync trigger mavjud');

-- Indexes
SELECT has_index('public', 'modules', 'idx_modules_spec', 'modules: idx_modules_spec index');
SELECT has_index('public', 'questions', 'idx_questions_module', 'questions: idx_questions_module index');

SELECT * FROM finish();
ROLLBACK;
