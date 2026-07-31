-- Forward-fix: 20260730000011_sync_source_reference.sql remote'da ishlamadi.
--
-- Muammo: 000011 dagi question_keys_readable policy'si exam_items.user_id ga
-- murojaat qiladi, lekin bunday ustun yo'q; egasi exams.user_id da saqlanadi.
-- 000011 remote'ga qo'llanmadi (rollback), ushbu fayl uni to'g'ri variantda
-- idempotent tiklaydi. 000011 version supabase migration repair orqali
-- "applied" deb belgilanadi.
--
-- Qoida: faqat staff (editor/admin) va o'z exam'ida shu savol bor
-- authenticated foydalanuvchi question_keys ni o'qiy oladi.

begin;

-- ─── source_reference (000011 dan; idempotent) ─────────────────────
alter table public.questions
  add column if not exists source_reference text;

create index if not exists idx_questions_source_reference
  on public.questions (source_reference)
  where source_reference is not null;

-- ─── question_options RLS ────────────────────────────────────────
alter table public.question_options enable row level security;

drop policy if exists "question_options_readable" on public.question_options;
create policy "question_options_readable"
  on public.question_options for select
  to authenticated, anon
  using (true);

drop policy if exists "question_options_sync" on public.question_options;
create policy "question_options_sync"
  on public.question_options for insert
  to service_role
  with check (true);

-- ─── question_keys RLS ───────────────────────────────────────────
alter table public.question_keys enable row level security;

drop policy if exists "question_keys_readable" on public.question_keys;
create policy "question_keys_readable"
  on public.question_keys for select
  to authenticated
  using (
    public.auth_role() in ('editor', 'admin')
    or exists (
      select 1
        from public.exam_items ei
        join public.exams e on e.id = ei.exam_id
       where ei.question_id = question_keys.question_id
         and e.user_id = auth.uid()
    )
  );

drop policy if exists "question_keys_sync" on public.question_keys;
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
