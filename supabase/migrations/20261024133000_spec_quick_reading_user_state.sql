-- TASK-601: account-scoped study marks and reading position.
-- Only the authenticated Fastify backend (service role) accesses these tables;
-- no client-side Data API access is granted.
CREATE TABLE IF NOT EXISTS public.user_spec_question_marks (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  section_code text NOT NULL CHECK (section_code IN ('S1','S2','S3','S4','S5','S6','S7','KS','PM')),
  mark text NOT NULL CHECK (mark IN ('memorized','review')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id,question_id)
);
CREATE INDEX IF NOT EXISTS user_spec_question_marks_scope_idx
 ON public.user_spec_question_marks (user_id,section_code,mark,question_id);
ALTER TABLE public.user_spec_question_marks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.user_spec_question_marks FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.user_spec_question_marks TO service_role;

CREATE TABLE IF NOT EXISTS public.user_spec_read_positions (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_code text NOT NULL CHECK (section_code IN ('S1','S2','S3','S4','S5','S6','S7','KS','PM')),
  page_number int NOT NULL DEFAULT 1 CHECK (page_number BETWEEN 1 AND 100000),
  page_size int NOT NULL DEFAULT 30 CHECK (page_size IN (30,50,100)),
  search_text text NOT NULL DEFAULT '' CHECK (char_length(search_text)<=80),
  review_only boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id,section_code)
);
ALTER TABLE public.user_spec_read_positions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.user_spec_read_positions FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.user_spec_read_positions TO service_role;
