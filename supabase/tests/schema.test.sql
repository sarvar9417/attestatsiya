-- UUID schema integrity tests (pgTAP)
begin;
select plan(30);

select has_table('public', 'subjects', 'subjects table exists');
select has_table('public', 'modules', 'modules table exists');
select has_table('public', 'lessons', 'lessons table exists');
select has_table('public', 'constructs', 'constructs table exists');
select has_table('public', 'lesson_constructs', 'lesson_constructs table exists');
select has_table('public', 'blueprints', 'blueprints table exists');
select has_table('public', 'blueprint_quotas', 'blueprint_quotas table exists');
select has_table('public', 'questions', 'questions table exists');
select has_table('public', 'question_options', 'question_options table exists');
select has_table('public', 'question_keys', 'question_keys table exists');
select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'exams', 'exams table exists');
select has_table('public', 'exam_items', 'exam_items table exists');
select has_table('public', 'user_construct_stats', 'user_construct_stats table exists');
select has_table('public', 'user_lesson_progress', 'user_lesson_progress table exists');
select has_table('public', 'user_module_progress', 'user_module_progress table exists');
select has_table('public', 'question_stats', 'question_stats table exists');
select has_table('public', 'question_reports', 'question_reports table exists');
select has_table('public', 'audit_log', 'audit_log table exists');

select has_type('public', 'user_role', 'user_role enum exists');
select has_type('public', 'content_status', 'content_status enum exists');
select has_type('public', 'question_format', 'question_format enum exists');
select has_type('public', 'cognitive_level', 'cognitive_level enum exists');
select has_type('public', 'report_status', 'report_status enum exists');
select has_type('public', 'exam_kind', 'exam_kind enum exists');
select has_type('public', 'exam_section', 'exam_section enum exists');

select col_type_is('public', 'subjects', 'id', 'uuid', 'subjects.id is UUID');
select col_type_is('public', 'modules', 'id', 'uuid', 'modules.id is UUID');
select col_type_is('public', 'questions', 'id', 'uuid', 'questions.id is UUID');
select col_type_is('public', 'exams', 'id', 'uuid', 'exams.id is UUID');

select * from finish();
rollback;
