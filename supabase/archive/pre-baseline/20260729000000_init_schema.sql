-- ─── Attestatsiya platformasi — asosiy sxema ─────────────────────────────

-- Foydalanuvchi rollari
CREATE TABLE roles (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,  -- 'student', 'content_author', 'expert', 'admin'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Foydalanuvchilarni rollarga bog'lash
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id BIGINT REFERENCES roles(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Spetsifikatsiya versiyalari (masalan 2026)
CREATE TABLE specification_versions (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  version     TEXT NOT NULL UNIQUE,         -- '2026', '2027', ...
  year        INTEGER NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Modullar (16 ta vertikal)
CREATE TABLE modules (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  spec_id       BIGINT NOT NULL REFERENCES specification_versions(id) ON DELETE CASCADE,
  code          TEXT NOT NULL,              -- 'M01', 'M02', ...
  title         TEXT NOT NULL,
  description   TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(spec_id, code)
);

-- Mikro-mavzular
CREATE TABLE subtopics (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  module_id     BIGINT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Darslar
CREATE TABLE lessons (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subtopic_id   BIGINT NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  theory        TEXT,                       -- Markdown formatida nazariya
  duration_min  INTEGER DEFAULT 10,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'draft',  -- draft, published, archived
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Manbalar (darsliklar)
CREATE TABLE sources (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title         TEXT NOT NULL,
  author        TEXT,
  isbn          TEXT,
  pdf_url       TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dars-manba bog'lamasi (sahifa bilan)
CREATE TABLE source_references (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lesson_id     BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  source_id     BIGINT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  page_from     INTEGER,
  page_to       INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stimulus (kod, rasm, jadval — bir necha savolga umumiy)
CREATE TABLE stimuli (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content       TEXT NOT NULL,              -- kod snippet, rasm URL, jadval
  type          TEXT NOT NULL DEFAULT 'code', -- code, image, table
  language      TEXT,                       -- 'python', 'javascript', null
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Savollar
CREATE TABLE questions (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  spec_id         BIGINT NOT NULL REFERENCES specification_versions(id),
  module_id       BIGINT NOT NULL REFERENCES modules(id),
  subtopic_id     BIGINT REFERENCES subtopics(id),
  lesson_id       BIGINT REFERENCES lessons(id),
  stimulus_id     BIGINT REFERENCES stimuli(id),
  test_type       TEXT NOT NULL DEFAULT 'Y1',   -- 'Y1' (bilish), 'Y2' (qo'llash), 'Y3' (mulohaza)
  difficulty      INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  cognitive_level TEXT NOT NULL DEFAULT 'bilish', -- 'bilish', 'qo\'llash', 'mulohaza'
  question_text   TEXT NOT NULL,
  explanation     TEXT,                       -- to'liq tushuntirish
  status          TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published', 'archived'
  version         INTEGER NOT NULL DEFAULT 1,
  created_by      UUID REFERENCES auth.users(id),
  reviewed_by     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Savol variantlari
CREATE TABLE options (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_id   BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text   TEXT NOT NULL,
  is_correct    BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Savol versiyalari tarixi
CREATE TABLE question_versions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_id   BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  version       INTEGER NOT NULL,
  snapshot      JSONB NOT NULL,             -- savolning to'liq nusxasi
  changed_by    UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Urinishlar (o'quvchi javoblari)
CREATE TABLE attempts (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id     BIGINT REFERENCES lessons(id),
  test_type     TEXT NOT NULL,              -- 'Y1', 'Y2', 'Y3', 'mixed', 'mock_exam'
  score         INTEGER,
  max_score     INTEGER,
  passed        BOOLEAN,
  time_spent_sec INTEGER,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE attempt_answers (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  attempt_id    BIGINT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  question_id   BIGINT NOT NULL REFERENCES questions(id),
  option_id     BIGINT REFERENCES options(id),
  is_correct    BOOLEAN NOT NULL,
  time_spent_sec INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- O'zlashtirish yozuvlari
CREATE TABLE mastery_records (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtopic_id   BIGINT NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'learning', -- 'learning', 'temporary', 'stable'
  score         REAL,
  reviewed_at   TIMESTAMPTZ,
  next_review   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, subtopic_id)
);

-- Takrorlash navbati
CREATE TABLE review_queue (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subtopic_id   BIGINT NOT NULL REFERENCES subtopics(id) ON DELETE CASCADE,
  due_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  interval_days INTEGER NOT NULL DEFAULT 1,
  ease_factor   REAL NOT NULL DEFAULT 2.5,
  reviewed      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sinov imtihonlari (50 savol)
CREATE TABLE mock_exams (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spec_id       BIGINT NOT NULL REFERENCES specification_versions(id),
  score         INTEGER,
  max_score     INTEGER DEFAULT 50,
  time_spent_sec INTEGER,
  status        TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed'
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ
);

CREATE TABLE mock_exam_questions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mock_exam_id  BIGINT NOT NULL REFERENCES mock_exams(id) ON DELETE CASCADE,
  question_id   BIGINT NOT NULL REFERENCES questions(id),
  sort_order    INTEGER NOT NULL,
  chosen_option_id BIGINT REFERENCES options(id),
  is_correct    BOOLEAN,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indekslar
CREATE INDEX idx_modules_spec ON modules(spec_id);
CREATE INDEX idx_subtopics_module ON subtopics(module_id);
CREATE INDEX idx_questions_module ON questions(module_id);
CREATE INDEX idx_questions_subtopic ON questions(subtopic_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_attempts_user ON attempts(user_id);
CREATE INDEX idx_mastery_user ON mastery_records(user_id);
CREATE INDEX idx_review_queue_user ON review_queue(user_id);
CREATE INDEX idx_mock_exams_user ON mock_exams(user_id);

-- RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE stimuli ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exam_questions ENABLE ROW LEVEL SECURITY;

-- O'quvchi faqat o'z ma'lumotlarini ko'radi
CREATE POLICY user_own_data ON attempts FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_own_data ON attempt_answers FOR ALL USING (attempt_id IN (SELECT id FROM attempts WHERE user_id = auth.uid()));
CREATE POLICY user_own_data ON mastery_records FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_own_data ON review_queue FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_own_data ON mock_exams FOR ALL USING (user_id = auth.uid());

-- Kontent hamma ko'rishi mumkin (o'qish)
CREATE POLICY content_readable ON modules FOR SELECT USING (true);
CREATE POLICY content_readable ON subtopics FOR SELECT USING (true);
CREATE POLICY content_readable ON lessons FOR SELECT USING (true);
CREATE POLICY content_readable ON questions FOR SELECT USING (status IN ('published', 'approved'));
CREATE POLICY content_readable ON options FOR SELECT USING (true);
CREATE POLICY content_readable ON stimuli FOR SELECT USING (true);
CREATE POLICY content_readable ON sources FOR SELECT USING (true);

-- Admin/Author CRUD
CREATE POLICY admin_all ON modules FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin'))
);
CREATE POLICY author_all ON lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id IN (SELECT id FROM roles WHERE name IN ('admin', 'content_author')))
);
CREATE POLICY author_all ON questions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id IN (SELECT id FROM roles WHERE name IN ('admin', 'content_author')))
);
