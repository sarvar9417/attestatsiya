-- Sync support: add source_reference for frontend-to-DB question dedup
-- Also add missing RLS policies for questions/options/keys tables

begin;

-- ─── source_reference for question dedup ─────────────────────────
alter table public.questions
  add column if not exists source_reference text;

create index if not exists idx_questions_source_reference
  on public.questions (source_reference)
  where source_reference is not null;

-- ─── question_options RLS ────────────────────────────────────────
alter table public.question_options enable row level security;

create policy "question_options_readable"
  on public.question_options for select
  to authenticated, anon
  using (true);

create policy "question_options_sync"
  on public.question_options for insert
  to service_role
  with check (true);

-- ─── question_keys RLS ───────────────────────────────────────────
alter table public.question_keys enable row level security;

create policy "question_keys_readable"
  on public.question_keys for select
  to authenticated
  using (
    exists (
      select 1 from public.exam_items ei
      where ei.question_id = question_keys.question_id
        and ei.user_id = auth.uid()
    )
  );

create policy "question_keys_sync"
  on public.question_keys for insert
  to service_role
  with check (true);

-- ─── Grant sync permissions ───────────────────────────────────────
grant insert on public.questions       to service_role;
grant insert on public.question_options to service_role;
grant insert on public.question_keys   to service_role;

grant usage on all sequences in schema public to service_role;

commit;
