-- ============================================================
-- RLS (Row Level Security) Migration
-- Barcha jadvallarga RLS + policy qo'shish
-- Xavfsizlik: har bir foydalanuvchi faqat o'z ma'lumotini ko'radi
-- ============================================================

-- ============================================================
-- 1. USER-OWNED TABLES — faqat o'z ma'lumotini o'qish/yozish
-- ============================================================

-- daily_progress
ALTER TABLE daily_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_progress_select" ON daily_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_progress_insert" ON daily_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_progress_update" ON daily_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "daily_progress_delete" ON daily_progress FOR DELETE USING (auth.uid() = user_id);

-- lesson_progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_progress_select" ON lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lesson_progress_insert" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_progress_update" ON lesson_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lesson_progress_delete" ON lesson_progress FOR DELETE USING (auth.uid() = user_id);

-- lesson_sessions
ALTER TABLE lesson_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_sessions_select" ON lesson_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lesson_sessions_insert" ON lesson_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_sessions_update" ON lesson_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lesson_sessions_delete" ON lesson_sessions FOR DELETE USING (auth.uid() = user_id);

-- lesson_exercise_answers
ALTER TABLE lesson_exercise_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_exercise_answers_select" ON lesson_exercise_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lesson_exercise_answers_insert" ON lesson_exercise_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_exercise_answers_update" ON lesson_exercise_answers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lesson_exercise_answers_delete" ON lesson_exercise_answers FOR DELETE USING (auth.uid() = user_id);

-- lesson_viewed_tabs
ALTER TABLE lesson_viewed_tabs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_viewed_tabs_select" ON lesson_viewed_tabs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lesson_viewed_tabs_insert" ON lesson_viewed_tabs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_viewed_tabs_delete" ON lesson_viewed_tabs FOR DELETE USING (auth.uid() = user_id);

-- lesson_vocab_progress
ALTER TABLE lesson_vocab_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_vocab_progress_select" ON lesson_vocab_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lesson_vocab_progress_insert" ON lesson_vocab_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lesson_vocab_progress_update" ON lesson_vocab_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lesson_vocab_progress_delete" ON lesson_vocab_progress FOR DELETE USING (auth.uid() = user_id);

-- vocabulary_progress
ALTER TABLE vocabulary_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vocabulary_progress_select" ON vocabulary_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vocabulary_progress_insert" ON vocabulary_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vocabulary_progress_update" ON vocabulary_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "vocabulary_progress_delete" ON vocabulary_progress FOR DELETE USING (auth.uid() = user_id);

-- vocabulary_sessions
ALTER TABLE vocabulary_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vocabulary_sessions_select" ON vocabulary_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vocabulary_sessions_insert" ON vocabulary_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vocabulary_sessions_update" ON vocabulary_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "vocabulary_sessions_delete" ON vocabulary_sessions FOR DELETE USING (auth.uid() = user_id);

-- vocabulary (shaxsiy lug'at — user_id bor)
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vocabulary_select" ON vocabulary FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "vocabulary_insert" ON vocabulary FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "vocabulary_update" ON vocabulary FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "vocabulary_delete" ON vocabulary FOR DELETE USING (auth.uid() = user_id);

-- phrase_progress
ALTER TABLE phrase_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "phrase_progress_select" ON phrase_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "phrase_progress_insert" ON phrase_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "phrase_progress_update" ON phrase_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "phrase_progress_delete" ON phrase_progress FOR DELETE USING (auth.uid() = user_id);

-- phrase_sessions
ALTER TABLE phrase_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "phrase_sessions_select" ON phrase_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "phrase_sessions_insert" ON phrase_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "phrase_sessions_update" ON phrase_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "phrase_sessions_delete" ON phrase_sessions FOR DELETE USING (auth.uid() = user_id);

-- grammar_progress
ALTER TABLE grammar_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "grammar_progress_select" ON grammar_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "grammar_progress_insert" ON grammar_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "grammar_progress_update" ON grammar_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "grammar_progress_delete" ON grammar_progress FOR DELETE USING (auth.uid() = user_id);

-- listening_progress
ALTER TABLE listening_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listening_progress_select" ON listening_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "listening_progress_insert" ON listening_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "listening_progress_update" ON listening_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "listening_progress_delete" ON listening_progress FOR DELETE USING (auth.uid() = user_id);

-- reading_progress
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reading_progress_select" ON reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "reading_progress_insert" ON reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reading_progress_update" ON reading_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reading_progress_delete" ON reading_progress FOR DELETE USING (auth.uid() = user_id);

-- speaking_progress
ALTER TABLE speaking_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "speaking_progress_select" ON speaking_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "speaking_progress_insert" ON speaking_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "speaking_progress_update" ON speaking_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "speaking_progress_delete" ON speaking_progress FOR DELETE USING (auth.uid() = user_id);

-- writings
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "writings_select" ON writings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "writings_insert" ON writings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "writings_update" ON writings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "writings_delete" ON writings FOR DELETE USING (auth.uid() = user_id);

-- mock_tests
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mock_tests_select" ON mock_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "mock_tests_insert" ON mock_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mock_tests_update" ON mock_tests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "mock_tests_delete" ON mock_tests FOR DELETE USING (auth.uid() = user_id);

-- sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_select" ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_insert" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sessions_update" ON sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sessions_delete" ON sessions FOR DELETE USING (auth.uid() = user_id);

-- achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "achievements_insert" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "achievements_update" ON achievements FOR UPDATE USING (auth.uid() = user_id);

-- placement_results
ALTER TABLE placement_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "placement_results_select" ON placement_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "placement_results_insert" ON placement_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "placement_results_update" ON placement_results FOR UPDATE USING (auth.uid() = user_id);

-- adaptive_plans
ALTER TABLE adaptive_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "adaptive_plans_select" ON adaptive_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "adaptive_plans_insert" ON adaptive_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "adaptive_plans_update" ON adaptive_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "adaptive_plans_delete" ON adaptive_plans FOR DELETE USING (auth.uid() = user_id);

-- user_words
ALTER TABLE user_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_words_select" ON user_words FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_words_insert" ON user_words FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_words_update" ON user_words FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_words_delete" ON user_words FOR DELETE USING (auth.uid() = user_id);

-- user_elo
ALTER TABLE user_elo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_elo_select" ON user_elo FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_elo_insert" ON user_elo FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_elo_update" ON user_elo FOR UPDATE USING (auth.uid() = user_id);

-- elo_history
ALTER TABLE elo_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "elo_history_select" ON elo_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "elo_history_insert" ON elo_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_grammar_progress
ALTER TABLE user_grammar_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_grammar_progress_select" ON user_grammar_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_grammar_progress_insert" ON user_grammar_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_grammar_progress_update" ON user_grammar_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_grammar_progress_delete" ON user_grammar_progress FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- 2. SHARED / PARTNER-SCOPED TABLES — juftlik a'zolari ko'rishi mumkin
-- ============================================================

-- study_buddies
ALTER TABLE study_buddies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "study_buddies_select" ON study_buddies FOR SELECT USING (auth.uid() = user_id OR auth.uid() = buddy_id);
CREATE POLICY "study_buddies_insert" ON study_buddies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_buddies_delete" ON study_buddies FOR DELETE USING (auth.uid() = user_id OR auth.uid() = buddy_id);

-- duo_streaks
ALTER TABLE duo_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "duo_streaks_select" ON duo_streaks FOR SELECT USING (auth.uid() = user_id OR auth.uid() = buddy_id);
CREATE POLICY "duo_streaks_insert" ON duo_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "duo_streaks_update" ON duo_streaks FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = buddy_id);


-- ============================================================
-- 3. PUBLIC READ TABLES — hamma auth user o'qiy oladi, faqat owner yozadi
-- ============================================================

-- users (profil ko'rinishi uchun)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select" ON users FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "users_update" ON users FOR UPDATE USING (auth.uid() = id);


-- ============================================================
-- 4. PUBLIC CONTENT TABLES — referens ma'lumotlar, faqat o'qish
-- ============================================================

-- lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons_select" ON lessons FOR SELECT USING (true);

-- review_lessons
ALTER TABLE review_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "review_lessons_select" ON review_lessons FOR SELECT USING (true);

-- words
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "words_select" ON words FOR SELECT USING (true);

-- phrases (global)
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "phrases_select" ON phrases FOR SELECT USING (true);

-- system_words
ALTER TABLE system_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_words_select" ON system_words FOR SELECT USING (true);

-- grammar_topics
ALTER TABLE grammar_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "grammar_topics_select" ON grammar_topics FOR SELECT USING (true);

-- listening_lessons
ALTER TABLE listening_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listening_lessons_select" ON listening_lessons FOR SELECT USING (true);

-- speaking_prompts
ALTER TABLE speaking_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "speaking_prompts_select" ON speaking_prompts FOR SELECT USING (true);

-- writing_prompts
ALTER TABLE writing_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "writing_prompts_select" ON writing_prompts FOR SELECT USING (true);

-- reading_texts
ALTER TABLE reading_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reading_texts_select" ON reading_texts FOR SELECT USING (true);

-- mocktest_listening
ALTER TABLE mocktest_listening ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mocktest_listening_select" ON mocktest_listening FOR SELECT USING (true);

-- mocktest_questions
ALTER TABLE mocktest_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mocktest_questions_select" ON mocktest_questions FOR SELECT USING (true);

-- mocktest_writing
ALTER TABLE mocktest_writing ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mocktest_writing_select" ON mocktest_writing FOR SELECT USING (true);

-- lesson_skills
ALTER TABLE lesson_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lesson_skills_select" ON lesson_skills FOR SELECT USING (true);
