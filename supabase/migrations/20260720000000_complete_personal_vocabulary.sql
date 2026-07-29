-- Complete and harden Personal Vocabulary for reproducible deployments.

ALTER TABLE public.personal_vocabulary
  ADD COLUMN IF NOT EXISTS example_uzbek TEXT,
  ADD COLUMN IF NOT EXISTS part_of_speech TEXT;

ALTER TABLE public.personal_vocabulary
  DROP CONSTRAINT IF EXISTS personal_vocabulary_level_check,
  ADD CONSTRAINT personal_vocabulary_level_check
    CHECK (level IN ('A1', 'A2', 'B1', 'B2')) NOT VALID,
  DROP CONSTRAINT IF EXISTS personal_vocabulary_category_check,
  ADD CONSTRAINT personal_vocabulary_category_check
    CHECK (category IN (
      'custom', 'grammar', 'travel', 'formal', 'ielts', 'business',
      'food', 'health', 'education', 'social', 'work', 'shopping',
      'relationships', 'environment', 'economy', 'culture', 'feelings',
      'discussion', 'technology', 'communication'
    )) NOT VALID,
  DROP CONSTRAINT IF EXISTS personal_vocabulary_source_check,
  ADD CONSTRAINT personal_vocabulary_source_check
    CHECK (source IN ('manual', 'ai_generated', 'imported')) NOT VALID,
  DROP CONSTRAINT IF EXISTS personal_vocabulary_box_check,
  ADD CONSTRAINT personal_vocabulary_box_check CHECK (box BETWEEN 1 AND 6) NOT VALID,
  DROP CONSTRAINT IF EXISTS personal_vocabulary_rating_check,
  ADD CONSTRAINT personal_vocabulary_rating_check
    CHECK (last_rating IS NULL OR last_rating IN ('bildim', 'qiynaldim', 'bilmadim', 'yodladim')) NOT VALID,
  DROP CONSTRAINT IF EXISTS personal_vocabulary_part_of_speech_check,
  ADD CONSTRAINT personal_vocabulary_part_of_speech_check
    CHECK (part_of_speech IS NULL OR part_of_speech IN (
      'noun', 'verb', 'adjective', 'adverb', 'preposition',
      'conjunction', 'pronoun', 'interjection', 'other'
    )) NOT VALID;

ALTER TABLE public.personal_vocabulary_sessions
  DROP CONSTRAINT IF EXISTS personal_vocabulary_sessions_rating_check,
  ADD CONSTRAINT personal_vocabulary_sessions_rating_check
    CHECK (rating IS NULL OR rating IN ('bildim', 'qiynaldim', 'bilmadim', 'yodladim')) NOT VALID;

-- Prevent duplicates even when two clients insert the same word concurrently.
CREATE UNIQUE INDEX IF NOT EXISTS idx_personal_vocab_unique_word
  ON public.personal_vocabulary (user_id, lower(trim(english)));

CREATE OR REPLACE FUNCTION public.pvocab_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pvocab_updated_at ON public.personal_vocabulary;
CREATE TRIGGER trg_pvocab_updated_at
  BEFORE UPDATE ON public.personal_vocabulary
  FOR EACH ROW EXECUTE FUNCTION public.pvocab_touch_updated_at();

DROP FUNCTION IF EXISTS public.rate_personal_vocab_word(UUID, BIGINT, TEXT, REAL, REAL, INTEGER, INTEGER);
CREATE FUNCTION public.rate_personal_vocab_word(
  p_user_id UUID,
  p_word_id BIGINT,
  p_rating TEXT,
  p_fsrs_stability REAL DEFAULT NULL,
  p_fsrs_difficulty REAL DEFAULT NULL,
  p_fsrs_reps INTEGER DEFAULT NULL,
  p_fsrs_lapses INTEGER DEFAULT NULL
)
RETURNS public.personal_vocabulary
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cur_box INTEGER;
  v_new_box INTEGER;
  v_intervals INTEGER[] := ARRAY[1, 3, 7, 14, 30, 90];
  v_today DATE := (now() AT TIME ZONE 'Asia/Tashkent')::date;
  v_row public.personal_vocabulary;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF p_rating NOT IN ('bildim', 'qiynaldim', 'bilmadim', 'yodladim') THEN
    RAISE EXCEPTION 'Invalid rating';
  END IF;

  SELECT box INTO v_cur_box
  FROM public.personal_vocabulary
  WHERE id = p_word_id AND user_id = p_user_id
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Word not found'; END IF;

  v_new_box := CASE
    WHEN p_rating = 'yodladim' THEN LEAST(v_cur_box + 2, 6)
    WHEN p_rating = 'bildim' THEN LEAST(v_cur_box + 1, 6)
    WHEN p_rating = 'qiynaldim' THEN v_cur_box
    ELSE 1
  END;

  UPDATE public.personal_vocabulary SET
    box = v_new_box,
    next_review = (v_today + v_intervals[v_new_box])::text,
    is_learned = (v_new_box >= 6),
    correct_count = correct_count + CASE WHEN p_rating IN ('bildim', 'yodladim') THEN 1 ELSE 0 END,
    wrong_count = wrong_count + CASE WHEN p_rating IN ('bilmadim', 'qiynaldim') THEN 1 ELSE 0 END,
    last_rating = p_rating,
    fsrs_stability = COALESCE(p_fsrs_stability, fsrs_stability),
    fsrs_difficulty = COALESCE(p_fsrs_difficulty, fsrs_difficulty),
    fsrs_reps = COALESCE(p_fsrs_reps, fsrs_reps),
    fsrs_lapses = COALESCE(p_fsrs_lapses, fsrs_lapses)
  WHERE id = p_word_id AND user_id = p_user_id
  RETURNING * INTO v_row;

  INSERT INTO public.personal_vocabulary_sessions (user_id, vocab_id, result, rating)
  VALUES (
    p_user_id, p_word_id,
    CASE WHEN p_rating IN ('bildim', 'yodladim') THEN 'correct' ELSE 'wrong' END,
    p_rating
  );
  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.rate_personal_vocab_word(UUID, BIGINT, TEXT, REAL, REAL, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rate_personal_vocab_word(UUID, BIGINT, TEXT, REAL, REAL, INTEGER, INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.rate_personal_vocab_words_batch(
  p_user_id UUID,
  p_results JSONB
)
RETURNS SETOF public.personal_vocabulary
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item JSONB;
  v_row public.personal_vocabulary;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF jsonb_typeof(p_results) IS DISTINCT FROM 'array' OR jsonb_array_length(p_results) > 100 THEN
    RAISE EXCEPTION 'Invalid batch';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_results)
  LOOP
    SELECT * INTO v_row FROM public.rate_personal_vocab_word(
      p_user_id,
      (v_item->>'word_id')::BIGINT,
      v_item->>'rating',
      (v_item->>'fsrs_stability')::REAL,
      (v_item->>'fsrs_difficulty')::REAL,
      (v_item->>'fsrs_reps')::INTEGER,
      (v_item->>'fsrs_lapses')::INTEGER
    );
    RETURN NEXT v_row;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.rate_personal_vocab_words_batch(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rate_personal_vocab_words_batch(UUID, JSONB) TO authenticated;

