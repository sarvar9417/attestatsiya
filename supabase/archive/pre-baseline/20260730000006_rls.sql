alter table public.subjects              enable row level security;
alter table public.modules               enable row level security;
alter table public.lessons               enable row level security;
alter table public.constructs            enable row level security;
alter table public.lesson_constructs     enable row level security;
alter table public.blueprints            enable row level security;
alter table public.blueprint_quotas      enable row level security;
alter table public.questions             enable row level security;
alter table public.question_options      enable row level security;
alter table public.question_keys         enable row level security;
alter table public.profiles              enable row level security;
alter table public.exams                 enable row level security;
alter table public.exam_items            enable row level security;
alter table public.user_construct_stats  enable row level security;
alter table public.user_lesson_progress  enable row level security;
alter table public.user_module_progress  enable row level security;
alter table public.question_stats        enable row level security;
alter table public.question_reports      enable row level security;
alter table public.audit_log             enable row level security;

create or replace function public.auth_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'user'::public.user_role
  );
$$;

-- Content: published hamma ko'radi, editor/admin yozadi
create policy "content_read_published" on public.modules
  for select using (status = 'published' or public.auth_role() in ('editor','admin'));
create policy "content_write" on public.modules
  for all using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));

create policy "lessons_read_published" on public.lessons
  for select using (status = 'published' or public.auth_role() in ('editor','admin'));
create policy "lessons_write" on public.lessons
  for all using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));

create policy "subjects_read" on public.subjects for select using (true);
create policy "constructs_read" on public.constructs for select using (true);
create policy "lesson_constructs_read" on public.lesson_constructs for select using (true);
create policy "blueprints_read" on public.blueprints for select using (true);
create policy "blueprint_quotas_read" on public.blueprint_quotas for select using (true);

create policy "subjects_write" on public.subjects
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');
create policy "constructs_write" on public.constructs
  for all using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));
create policy "lesson_constructs_write" on public.lesson_constructs
  for all using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));
create policy "blueprints_write" on public.blueprints
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');
create policy "blueprint_quotas_write" on public.blueprint_quotas
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- Questions: published hamma, yozish staff
create policy "questions_read_published" on public.questions
  for select using (status = 'published' or public.auth_role() in ('editor','admin'));
create policy "questions_write" on public.questions
  for all using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));

create policy "options_read" on public.question_options
  for select using (
    exists (select 1 from public.questions q
            where q.id = question_id
              and (q.status = 'published' or public.auth_role() in ('editor','admin')))
  );
create policy "options_write" on public.question_options
  for all using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));

-- ⚠️ Keys: faqat staff. Anon/user umuman ko'rmaydi.
create policy "keys_staff_only" on public.question_keys
  for all using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));

-- Profiles: o'zi = read/update, admin = all
create policy "profiles_self_read" on public.profiles
  for select using (id = auth.uid() or public.auth_role() = 'admin');
create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_admin_all" on public.profiles
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- Exams: faqat o'zini ko'radi
create policy "exams_self" on public.exams
  for select using (user_id = auth.uid() or public.auth_role() = 'admin');

create policy "exam_items_self" on public.exam_items
  for select using (
    exists (select 1 from public.exams e
            where e.id = exam_id
              and (e.user_id = auth.uid() or public.auth_role() = 'admin'))
  );

create policy "ucs_self" on public.user_construct_stats
  for select using (user_id = auth.uid() or public.auth_role() = 'admin');
create policy "ulp_self" on public.user_lesson_progress
  for select using (user_id = auth.uid() or public.auth_role() = 'admin');
create policy "ump_self" on public.user_module_progress
  for select using (user_id = auth.uid() or public.auth_role() = 'admin');

-- Quality
create policy "stats_staff" on public.question_stats
  for select using (public.auth_role() in ('editor','admin'));
create policy "stats_admin_write" on public.question_stats
  for all using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

create policy "reports_insert" on public.question_reports
  for insert with check (user_id = auth.uid());
create policy "reports_self_read" on public.question_reports
  for select using (user_id = auth.uid() or public.auth_role() in ('editor','admin'));
create policy "reports_staff_write" on public.question_reports
  for update using (public.auth_role() in ('editor','admin'))
  with check (public.auth_role() in ('editor','admin'));

create policy "audit_admin" on public.audit_log
  for select using (public.auth_role() = 'admin');
