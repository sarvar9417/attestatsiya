-- ─── public.users jadvali va auth.users sinxi ────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id         BIGINT REFERENCES public.roles(id),
  full_name       TEXT,
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Yangi foydalanuvchi ro'yxatdan o'tganda avtomatik public.users yozuvi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Mavjud auth.users larni public.users ga sync (agar yo'q bo'lsa)
INSERT INTO public.users (id, full_name)
SELECT id, COALESCE(raw_user_meta_data ->> 'name', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_read_own ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY user_update_own ON public.users FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY admin_all_users ON public.users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role_id = (SELECT id FROM public.roles WHERE name = 'admin'))
);

-- Indekslar
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role_id);
