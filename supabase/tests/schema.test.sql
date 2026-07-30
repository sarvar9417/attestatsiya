-- Schema integrity tests (pgTAP)
BEGIN;
SELECT plan(25);

-- Tables exist
SELECT has_table('public', 'roles', 'roles jadvali mavjud');
SELECT has_table('public', 'specification_versions', 'specification_versions jadvali mavjud');
SELECT has_table('public', 'modules', 'modules jadvali mavjud');
SELECT has_table('public', 'subtopics', 'subtopics jadvali mavjud');
SELECT has_table('public', 'lessons', 'lessons jadvali mavjud');
SELECT has_table('public', 'questions', 'questions jadvali mavjud');
SELECT has_table('public', 'options', 'options jadvali mavjud');
SELECT has_table('public', 'question_versions', 'question_versions jadvali mavjud');
SELECT has_table('public', 'attempts', 'attempts jadvali mavjud');
SELECT has_table('public', 'attempt_answers', 'attempt_answers jadvali mavjud');
SELECT has_table('public', 'mastery_records', 'mastery_records jadvali mavjud');
SELECT has_table('public', 'review_queue', 'review_queue jadvali mavjud');
SELECT has_table('public', 'mock_exams', 'mock_exams jadvali mavjud');
SELECT has_table('public', 'mock_exam_questions', 'mock_exam_questions jadvali mavjud');
SELECT has_table('public', 'sources', 'sources jadvali mavjud');
SELECT has_table('public', 'source_references', 'source_references jadvali mavjud');
SELECT has_table('public', 'stimuli', 'stimuli jadvali mavjud');

-- RLS enabled
SELECT has_table_enablerole('public', 'modules', 'RLS modules da yoqilgan');
SELECT has_table_enablerole('public', 'questions', 'RLS questions da yoqilgan');
SELECT has_table_enablerole('public', 'attempts', 'RLS attempts da yoqilgan');

-- Constraints
SELECT col_not_null('public', 'modules', 'code', 'modules.code NOT NULL');
SELECT col_not_null('public', 'questions', 'question_text', 'questions.question_text NOT NULL');
SELECT col_not_null('public', 'options', 'option_text', 'options.option_text NOT NULL');

-- Unique constraints
SELECT has_unique('public', 'roles', 'name', 'roles.name UNIQUE');
SELECT has_unique('public', 'specification_versions', 'version', 'specification_versions.version UNIQUE');
SELECT has_unique('public', 'mastery_records', ARRAY['user_id', 'subtopic_id'], 'mastery_records(user_id, subtopic_id) UNIQUE');

SELECT * FROM finish();
ROLLBACK;
