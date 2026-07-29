-- ═══════════════════════════════════════════════════════════════════════════
-- Personal Vocabulary — to'liq sxema (jadvallar + RLS + RPC)
-- Idempotent: bir necha marta xavfsiz ishga tushirsa bo'ladi.
-- Maxfiy ma'lumot YO'Q — version-control uchun xavfsiz.
-- Reja: docs/SHAXSIY_LUGAT_SPESIFIKATSIYASI.md
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Asosiy so'zlar jadvali ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.personal_vocabulary (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id          UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  english          TEXT    NOT NULL,
  uzbek            TEXT    NOT NULL,
  phonetic         TEXT,
  example          TEXT,
  example_uzbek    TEXT,
  category         TEXT    NOT NULL DEFAULT 'custom',
  level            TEXT    NOT NULL DEFAULT 'A2',
  part_of_speech   TEXT,
  source           TEXT    NOT NULL DEFAULT 'manual',
  ai_suggested_translation TEXT,
  box              INTEGER NOT NULL DEFAULT 1,
  next_review      TEXT    NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Tashkent')::date + 1)::text,
  is_learned       BOOLEAN NOT NULL DEFAULT false,
  correct_count    INTEGER NOT NULL DEFAULT 0,
  wrong_count      INTEGER NOT NULL DEFAULT 0,
  last_rating      TEXT,
  fsrs_stability   REAL,
  fsrs_difficulty  REAL,
  fsrs_reps        INTEGER NOT NULL DEFAULT 0,
  fsrs_lapses      INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Sessiya (flash-card test tarixi) jadvali ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.personal_vocabulary_sessions (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocab_id      BIGINT  NOT NULL REFERENCES public.personal_vocabulary(id) ON DELETE CASCADE,
  session_date  DATE    NOT NULL DEFAULT CURRENT_DATE,
  result        TEXT    NOT NULL CHECK (result IN ('correct', 'wrong')),
  rating        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Indekslar ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_personal_vocab_user
  ON public.personal_vocabulary (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_personal_vocab_review
  ON public.personal_vocabulary (user_id, next_review) WHERE NOT is_learned;
CREATE INDEX IF NOT EXISTS idx_personal_vocab_sessions_user
  ON public.personal_vocabulary_sessions (user_id, session_date DESC);

-- Dublikat so'zlar oldini olish: bir user bir so'zni 2 marta qo'sha olmaydi
CREATE UNIQUE INDEX IF NOT EXISTS idx_personal_vocab_unique_word
  ON public.personal_vocabulary (user_id, lower(trim(english)));

-- ─── RLS — personal_vocabulary (har operatsiya uchun alohida, WITH CHECK bilan) ─
ALTER TABLE public.personal_vocabulary ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pvocab_select" ON public.personal_vocabulary;
CREATE POLICY "pvocab_select" ON public.personal_vocabulary FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pvocab_insert" ON public.personal_vocabulary;
CREATE POLICY "pvocab_insert" ON public.personal_vocabulary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pvocab_update" ON public.personal_vocabulary;
CREATE POLICY "pvocab_update" ON public.personal_vocabulary FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pvocab_delete" ON public.personal_vocabulary;
CREATE POLICY "pvocab_delete" ON public.personal_vocabulary FOR DELETE
  USING (auth.uid() = user_id);

-- ─── RLS — personal_vocabulary_sessions ──────────────────────────────────
ALTER TABLE public.personal_vocabulary_sessions ENABLE ROW LEVEL SECURITY;

-- Eski (dev migration'idan qolgan) ortiqcha policy'larni tozalaymiz
DROP POLICY IF EXISTS "pvocab_sess_select" ON public.personal_vocabulary_sessions;
DROP POLICY IF EXISTS "pvocab_sess_insert" ON public.personal_vocabulary_sessions;
DROP POLICY IF EXISTS "pvocab_sess_delete" ON public.personal_vocabulary_sessions;

DROP POLICY IF EXISTS "pvsess_select" ON public.personal_vocabulary_sessions;
CREATE POLICY "pvsess_select" ON public.personal_vocabulary_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "pvsess_insert" ON public.personal_vocabulary_sessions;
CREATE POLICY "pvsess_insert" ON public.personal_vocabulary_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "pvsess_delete" ON public.personal_vocabulary_sessions;
CREATE POLICY "pvsess_delete" ON public.personal_vocabulary_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ─── updated_at avto-yangilash trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.pvocab_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pvocab_updated_at ON public.personal_vocabulary;
CREATE TRIGGER trg_pvocab_updated_at
  BEFORE UPDATE ON public.personal_vocabulary
  FOR EACH ROW EXECUTE FUNCTION public.pvocab_touch_updated_at();

-- ═══════════════════════════════════════════════════════════════════════════
-- RPC: so'zni baholash (atomik) — box/SRS/sanani yangilaydi, sessiya yozadi.
-- Service shu funksiyani chaqiradi (avval YO'Q edi → rating ishlamayotgandi).
-- ═══════════════════════════════════════════════════════════════════════════
-- Eski versiyasini (qo'lda yaratilgan, boshqa return type) olib tashlaymiz
DROP FUNCTION IF EXISTS public.rate_personal_vocab_word(UUID, BIGINT, TEXT, REAL, REAL, INTEGER, INTEGER) CASCADE;

CREATE OR REPLACE FUNCTION public.rate_personal_vocab_word(
  p_user_id         UUID,
  p_word_id         BIGINT,
  p_rating          TEXT,
  p_fsrs_stability  REAL    DEFAULT NULL,
  p_fsrs_difficulty REAL    DEFAULT NULL,
  p_fsrs_reps       INTEGER DEFAULT NULL,
  p_fsrs_lapses     INTEGER DEFAULT NULL
)
RETURNS public.personal_vocabulary
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cur_box   INTEGER;
  v_new_box   INTEGER;
  v_intervals INTEGER[] := ARRAY[1, 3, 7, 14, 30, 90];
  v_interval  INTEGER;
  v_today     DATE := (now() AT TIME ZONE 'Asia/Tashkent')::date;
  v_row       public.personal_vocabulary;
BEGIN
  -- Spoofing himoyasi: faqat o'z so'zini baholay oladi
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT box INTO v_cur_box
    FROM public.personal_vocabulary
   WHERE id = p_word_id AND user_id = p_user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Word not found';
  END IF;

  -- Box (Leitner) mapping — client computePersonalVocabNextReview bilan bir xil
  v_new_box := CASE
    WHEN p_rating = 'yodladim'  THEN LEAST(v_cur_box + 2, 6)
    WHEN p_rating = 'bildim'    THEN LEAST(v_cur_box + 1, 6)
    WHEN p_rating = 'qiynaldim' THEN v_cur_box
    ELSE 1  -- bilmadim
  END;
  v_interval := v_intervals[v_new_box];

  UPDATE public.personal_vocabulary SET
    box           = v_new_box,
    next_review   = (v_today + v_interval)::text,
    is_learned    = (v_new_box >= 6),
    correct_count = correct_count + CASE WHEN p_rating IN ('bildim','yodladim') THEN 1 ELSE 0 END,
    wrong_count   = wrong_count   + CASE WHEN p_rating IN ('bilmadim','qiynaldim') THEN 1 ELSE 0 END,
    last_rating   = p_rating,
    fsrs_stability  = COALESCE(p_fsrs_stability,  fsrs_stability),
    fsrs_difficulty = COALESCE(p_fsrs_difficulty, fsrs_difficulty),
    fsrs_reps       = COALESCE(p_fsrs_reps,       fsrs_reps),
    fsrs_lapses     = COALESCE(p_fsrs_lapses,     fsrs_lapses)
  WHERE id = p_word_id AND user_id = p_user_id
  RETURNING * INTO v_row;

  -- Sessiya tarixini yozamiz (jadval endi ishlatiladi)
  INSERT INTO public.personal_vocabulary_sessions (user_id, vocab_id, result, rating)
  VALUES (p_user_id, p_word_id,
          CASE WHEN p_rating IN ('bildim','yodladim') THEN 'correct' ELSE 'wrong' END,
          p_rating);

  RETURN v_row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rate_personal_vocab_word(
  UUID, BIGINT, TEXT, REAL, REAL, INTEGER, INTEGER
) TO authenticated;
