-- ═══════════════════════════════════════════════════════════════════════════
-- Tandem tizimi uchun Supabase jadvallari + RLS politikalar
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Tandem juftlik (1:1) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tandem_pairs (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  combined_streak  INTEGER     NOT NULL DEFAULT 0,
  freeze_used_on   TEXT,
  last_both_active TEXT,
  total_xp         INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_a, user_b)
);

ALTER TABLE public.tandem_pairs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tandem_pairs_select" ON public.tandem_pairs FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "tandem_pairs_insert" ON public.tandem_pairs FOR INSERT
  WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "tandem_pairs_update" ON public.tandem_pairs FOR UPDATE
  USING (auth.uid() = user_a OR auth.uid() = user_b);

-- ── 2. Do'stlik grafi ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.friendships (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     TEXT        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "friendships_select" ON public.friendships FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "friendships_insert" ON public.friendships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "friendships_update" ON public.friendships FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "friendships_delete" ON public.friendships FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ── 3. Async duel ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.duels (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger       UUID        NOT NULL REFERENCES users(id),
  opponent         UUID        REFERENCES users(id),
  mode             TEXT        NOT NULL
                     CHECK (mode IN ('vocab', 'grammar', 'reading', 'speaking', 'hotseat', 'lesson')),
  status           TEXT        NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'opponent_turn', 'done', 'expired')),
  question_set     JSONB       NOT NULL DEFAULT '[]'::jsonb,
  challenger_score INTEGER,
  opponent_score   INTEGER,
  is_bot           BOOLEAN     NOT NULL DEFAULT false,
  lesson_id        TEXT,        -- 'lesson' mode uchun: qaysi dars
  lesson_title     TEXT,        -- dars nomi (UI ko'rsatish uchun)
  expires_at       TIMESTAMPTZ NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;

-- opponent IS NULL = bot duel (createDuel: opponent=null faqat botda). "Ochiq
-- chaqiruv" tushunchasi yo'q, shu sabab opponent IS NULL ni KIRITMAYMIZ — aks
-- holda har qanday user barcha bot duellarni o'qiy/o'zgartira olardi (teshik).
CREATE POLICY "duels_select" ON public.duels FOR SELECT
  USING (auth.uid() = challenger OR auth.uid() = opponent);

CREATE POLICY "duels_insert" ON public.duels FOR INSERT
  WITH CHECK (auth.uid() = challenger);

CREATE POLICY "duels_update" ON public.duels FOR UPDATE
  USING (auth.uid() = challenger OR auth.uid() = opponent);

-- ── 4. AI hakam bahosi (har o'yinchi uchun) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.duel_results (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id       UUID        NOT NULL REFERENCES duels(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES users(id),
  grammar_score INTEGER,
  vocab_score   INTEGER,
  topic_score   INTEGER,
  feedback      TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE (duel_id, user_id)
);

ALTER TABLE public.duel_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "duel_results_select" ON public.duel_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "duel_results_insert" ON public.duel_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "duel_results_upsert" ON public.duel_results FOR UPDATE
  USING (auth.uid() = user_id);

-- ── 5. Haftalik duel (XP bo'yicha 1vs1) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weekly_duels (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id    UUID        NOT NULL REFERENCES tandem_pairs(id) ON DELETE CASCADE,
  week_start TEXT        NOT NULL,
  user_a_xp  INTEGER     NOT NULL DEFAULT 0,
  user_b_xp  INTEGER     NOT NULL DEFAULT 0,
  winner_id  UUID        REFERENCES users(id),
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (pair_id, week_start)
);

ALTER TABLE public.weekly_duels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "weekly_duels_select" ON public.weekly_duels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tandem_pairs
      WHERE id = pair_id
        AND (user_a = auth.uid() OR user_b = auth.uid())
    )
  );

CREATE POLICY "weekly_duels_insert" ON public.weekly_duels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tandem_pairs
      WHERE id = pair_id
        AND (user_a = auth.uid() OR user_b = auth.uid())
    )
  );

CREATE POLICY "weekly_duels_update" ON public.weekly_duels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tandem_pairs
      WHERE id = pair_id
        AND (user_a = auth.uid() OR user_b = auth.uid())
    )
  );

-- ── 6. AI Roleplay Duo sessiya ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roleplay_sessions (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_id            UUID        NOT NULL REFERENCES tandem_pairs(id) ON DELETE CASCADE,
  scenario_id        TEXT        NOT NULL,
  creator_id         UUID        NOT NULL REFERENCES users(id),
  status             TEXT        NOT NULL DEFAULT 'invited'
                       CHECK (status IN (
                         'invited', 'user_a_playing', 'user_a_done',
                         'user_b_playing', 'user_b_done', 'completed'
                       )),
  user_a_messages    JSONB       DEFAULT '[]'::jsonb,
  user_b_messages    JSONB       DEFAULT '[]'::jsonb,
  user_a_evaluation  JSONB,
  user_b_evaluation  JSONB,
  expires_at         TIMESTAMPTZ NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.roleplay_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roleplay_sessions_select" ON public.roleplay_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tandem_pairs
      WHERE id = pair_id
        AND (user_a = auth.uid() OR user_b = auth.uid())
    )
  );

CREATE POLICY "roleplay_sessions_insert" ON public.roleplay_sessions FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "roleplay_sessions_update" ON public.roleplay_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tandem_pairs
      WHERE id = pair_id
        AND (user_a = auth.uid() OR user_b = auth.uid())
    )
  );

-- ── 7. Profil reaksiyalar (🔥💪😂👏🎉) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profile_reactions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  target_user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reactor_user_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reaction_type    TEXT        NOT NULL
                     CHECK (reaction_type IN ('fire', 'muscle', 'laugh', 'clap', 'party')),
  created_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE (target_user_id, reactor_user_id, reaction_type)
);

ALTER TABLE public.profile_reactions ENABLE ROW LEVEL SECURITY;

-- Barcha autentifikatsiyalangan foydalanuvchi reaksiyalarni ko'ra oladi
CREATE POLICY "profile_reactions_select" ON public.profile_reactions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Faqat o'z reaksiyasini qo'shish mumkin (o'ziga emas)
CREATE POLICY "profile_reactions_insert" ON public.profile_reactions FOR INSERT
  WITH CHECK (auth.uid() = reactor_user_id AND auth.uid() <> target_user_id);

-- Faqat o'z reaksiyasini olib tashlash mumkin
CREATE POLICY "profile_reactions_delete" ON public.profile_reactions FOR DELETE
  USING (auth.uid() = reactor_user_id);

-- ── 8. Profil rewardlar (badge/emblem) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profile_rewards (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id  TEXT        NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, reward_id)
);

ALTER TABLE public.profile_rewards ENABLE ROW LEVEL SECURITY;

-- Faqat o'z rewardlarini ko'rish
CREATE POLICY "profile_rewards_select" ON public.profile_rewards FOR SELECT
  USING (auth.uid() = user_id);

-- Faqat o'z rewardini qo'shish (xizmat tomonidan)
CREATE POLICY "profile_rewards_insert" ON public.profile_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── 9. RPC: increment_weekly_xp ───────────────────────────────────────────────
-- Haftalik duel XP ni atomik tarzda oshirish.
-- Agar row mavjud bo'lmasa, yaratadi (week_start bo'yicha).
CREATE OR REPLACE FUNCTION public.increment_weekly_xp(
  p_pair_id    UUID,
  p_week_start TEXT,
  p_field      TEXT,
  p_amount     INTEGER
) RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  -- Xavfsizlik: faqat ruxsat etilgan ustun nomlarini qabul qilish
  IF p_field NOT IN ('user_a_xp', 'user_b_xp') THEN
    RAISE EXCEPTION 'Invalid field: %', p_field;
  END IF;

  EXECUTE FORMAT(
    'INSERT INTO public.weekly_duels (pair_id, week_start, %1$I)
     VALUES ($1, $2, $3)
     ON CONFLICT (pair_id, week_start)
     DO UPDATE SET %1$I = public.weekly_duels.%1$I + EXCLUDED.%1$I',
    p_field
  ) USING p_pair_id, p_week_start, p_amount;
END;
$$;

-- ── Performance indexlar ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tandem_pairs_user_a         ON public.tandem_pairs(user_a);
CREATE INDEX IF NOT EXISTS idx_tandem_pairs_user_b         ON public.tandem_pairs(user_b);
-- Kanonik (tartibdan mustaqil) yagona juftlik: (A,B) va (B,A) bir xil hisoblanadi.
-- unique(user_a,user_b) faqat tartiblangan juftlikni ushlaydi; bu indeks teskari
-- tartibdagi dublikat juftlikni (race condition) ham bloklaydi.
CREATE UNIQUE INDEX IF NOT EXISTS idx_tandem_pairs_canonical
  ON public.tandem_pairs (LEAST(user_a, user_b), GREATEST(user_a, user_b));
CREATE INDEX IF NOT EXISTS idx_friendships_user_id         ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id       ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status          ON public.friendships(status);
CREATE INDEX IF NOT EXISTS idx_duels_challenger            ON public.duels(challenger);
CREATE INDEX IF NOT EXISTS idx_duels_opponent              ON public.duels(opponent);
CREATE INDEX IF NOT EXISTS idx_duels_status                ON public.duels(status);
CREATE INDEX IF NOT EXISTS idx_duels_expires_at            ON public.duels(expires_at);
CREATE INDEX IF NOT EXISTS idx_duel_results_duel_id        ON public.duel_results(duel_id);
CREATE INDEX IF NOT EXISTS idx_duel_results_user_id        ON public.duel_results(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_duels_pair_id        ON public.weekly_duels(pair_id);
CREATE INDEX IF NOT EXISTS idx_weekly_duels_week_start     ON public.weekly_duels(week_start);
CREATE INDEX IF NOT EXISTS idx_roleplay_sessions_pair_id   ON public.roleplay_sessions(pair_id);
CREATE INDEX IF NOT EXISTS idx_roleplay_sessions_creator   ON public.roleplay_sessions(creator_id);
CREATE INDEX IF NOT EXISTS idx_roleplay_sessions_status    ON public.roleplay_sessions(status);
CREATE INDEX IF NOT EXISTS idx_profile_reactions_target    ON public.profile_reactions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_rewards_user_id     ON public.profile_rewards(user_id);
