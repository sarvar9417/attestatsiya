# 02 — Ma'lumotlar bazasi

Quyidagi SQL to'g'ridan-to'g'ri `supabase/migrations/` ga ko'chiriladi.
Fayl bo'linishi sarlavhalarda ko'rsatilgan.

---

## 001_extensions_enums.sql

```sql
create extension if not exists "pgcrypto";

create type user_role       as enum ('user', 'editor', 'admin');
create type content_status  as enum ('draft', 'review', 'published', 'archived');
create type question_format as enum ('Y1', 'Y2', 'Y3');
create type cognitive_level as enum ('bilish', 'qollash', 'mulohaza');
create type report_status   as enum ('yangi', 'korilmoqda', 'tuzatildi', 'rad');

create type exam_kind as enum (
  'diagnostika',   -- kirish sinovi, 25 savol
  'mashq',         -- ball hisoblanmaydi
  'mavzu',         -- mavzu testi
  'bolim',         -- bo'lim imtihoni
  'mock',          -- to'liq 50 talik
  'takrorlash',    -- SM-2 navbati
  'zaif'           -- eng past 3 konstrukt
);
```

**Enum tanlash sababi:** bu qiymatlar mahsulot mantig'ining bir qismi, ular
o'zgarsa kod ham o'zgaradi. Lookup jadval ortiqcha join beradi.

---

## 002_content.sql

```sql
create table subjects (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,          -- 'informatika'
  name_uz     text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table modules (
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid not null references subjects(id) on delete cascade,
  order_idx   int  not null,
  slug        text not null,
  title_uz    text not null,
  summary_uz  text,
  status      content_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (subject_id, slug),
  unique (subject_id, order_idx)
);

create table lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references modules(id) on delete cascade,
  order_idx     int  not null,
  slug          text not null,
  title_uz      text not null,
  body_mdx      text,                        -- dars matni, MDX
  est_minutes   int  not null default 15,
  status        content_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (module_id, slug),
  unique (module_id, order_idx)
);

create table constructs (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references subjects(id) on delete cascade,
  group_code    text not null,               -- 'S3.NUM', 'PM.GEN'
  code          text not null unique,        -- 'S3.NUM.01'
  slug          text not null unique,        -- SEO route uchun
  title_uz      text not null,
  description_uz text,
  created_at    timestamptz not null default now()
);

create table lesson_constructs (
  lesson_id     uuid not null references lessons(id) on delete cascade,
  construct_id  uuid not null references constructs(id) on delete cascade,
  primary key (lesson_id, construct_id)
);

create index on modules (subject_id, order_idx);
create index on lessons (module_id, order_idx);
create index on constructs (subject_id, group_code);
create index on lesson_constructs (construct_id);
```

---

## 003_assessment.sql

```sql
create table blueprints (
  id                uuid primary key default gen_random_uuid(),
  subject_id        uuid not null references subjects(id) on delete cascade,
  version           int  not null,
  effective_year    int  not null,           -- 2026
  total_questions   int  not null,           -- 50
  duration_min      int  not null,           -- 120
  points_per_item   int  not null default 2,
  is_active         boolean not null default false,
  created_at        timestamptz not null default now(),
  unique (subject_id, version)
);

-- Faqat bitta faol blueprint bo'lishi mumkin
create unique index blueprints_one_active
  on blueprints (subject_id) where is_active;

create table blueprint_quotas (
  id             uuid primary key default gen_random_uuid(),
  blueprint_id   uuid not null references blueprints(id) on delete cascade,
  group_code     text not null,
  order_idx      int  not null,
  question_count int  not null,
  n_bilish       int  not null default 0,
  n_qollash      int  not null default 0,
  n_mulohaza     int  not null default 0,
  unique (blueprint_id, group_code),
  check (n_bilish + n_qollash + n_mulohaza = question_count)
);

create table questions (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references subjects(id) on delete cascade,
  construct_id  uuid not null references constructs(id) on delete restrict,
  group_code    text not null,               -- constructs dan denormalizatsiya
  format        question_format not null,
  cognitive     cognitive_level not null,
  difficulty    int  not null default 3 check (difficulty between 1 and 5),
  stem_md       text not null,               -- savol matni, markdown
  assets        jsonb not null default '[]', -- rasm, kod bloki
  is_generated  boolean not null default false,
  status        content_status not null default 'draft',
  author_id     uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Variantlar. OMMAVIY O'QISH MUMKIN — kalit bu yerda YO'Q.
create table question_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references questions(id) on delete cascade,
  side         char(1) not null default 'a' check (side in ('a', 'b')),
  order_idx    int  not null,
  content_md   text not null,
  unique (question_id, side, order_idx)
);

-- Javob kaliti. OMMAVIY O'QISH YO'Q.
-- payload formati:
--   Y1: { "correct_option_id": "<uuid>" }
--   Y2: { "pairs": { "<a_option_id>": "<b_option_id>", ... } }
--   Y3: { "order": ["<uuid>", "<uuid>", ...] }
create table question_keys (
  question_id   uuid primary key references questions(id) on delete cascade,
  payload       jsonb not null,
  explanation_md text not null,
  updated_at    timestamptz not null default now()
);

create index on questions (construct_id, status);
create index on questions (group_code, cognitive, status);
create index on question_options (question_id);
```

**`side` ustuni nima uchun:** `Y2` da chap ustun (`a`) va o'ng ustun (`b`) kerak.
`Y1` va `Y3` da hamma variant `a`. Bitta jadval uch formatni ham qoplaydi.

---

## 004_progress.sql

```sql
create table profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         user_role not null default 'user',
  display_name text,
  region       text,                         -- ixtiyoriy, analitika uchun
  is_blocked   boolean not null default false,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);

create table exams (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  kind            exam_kind not null,
  blueprint_id    uuid references blueprints(id) on delete set null,
  module_id       uuid references modules(id) on delete set null,
  lesson_id       uuid references lessons(id) on delete set null,
  duration_sec    int,                        -- null = vaqt cheklovi yo'q
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  total_score     int,
  max_score       int,
  passed          boolean,
  breakdown       jsonb                       -- guruh/konstrukt kesimi
);

create table exam_items (
  id                 uuid primary key default gen_random_uuid(),
  exam_id            uuid not null references exams(id) on delete cascade,
  question_id        uuid not null references questions(id) on delete restrict,
  construct_id       uuid not null references constructs(id) on delete restrict,
  order_idx          int  not null,
  user_answer        jsonb,
  is_correct         boolean,
  score              int  not null default 0,
  time_spent_sec     int,
  flagged            boolean not null default false,
  client_answered_at timestamptz,
  answered_at        timestamptz,
  unique (exam_id, order_idx),
  unique (exam_id, question_id)
);

-- SM-2 holati, konstrukt darajasida
create table user_construct_stats (
  user_id       uuid not null references auth.users(id) on delete cascade,
  construct_id  uuid not null references constructs(id) on delete cascade,
  attempts      int  not null default 0,
  correct       int  not null default 0,
  streak        int  not null default 0,
  ease          numeric(4,2) not null default 2.50,
  interval_days int  not null default 0,
  due_at        timestamptz,
  last_seen_at  timestamptz,
  primary key (user_id, construct_id)
);

create table user_lesson_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references lessons(id) on delete cascade,
  read_at      timestamptz,
  attempts     int  not null default 0,
  best_score   int,
  mastered_at  timestamptz,
  primary key (user_id, lesson_id)
);

create table user_module_progress (
  user_id         uuid not null references auth.users(id) on delete cascade,
  module_id       uuid not null references modules(id) on delete cascade,
  unlocked_at     timestamptz not null default now(),
  exam_best_score int,
  completed_at    timestamptz,
  primary key (user_id, module_id)
);

create index on exams (user_id, kind, started_at desc);
create index on exam_items (exam_id, order_idx);
create index on exam_items (question_id);
create index on user_construct_stats (user_id, due_at);
```

### Profil avtomatik yaratilishi

```sql
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

---

## 005_quality.sql

```sql
create table question_stats (
  question_id    uuid primary key references questions(id) on delete cascade,
  attempts       int  not null default 0,
  correct        int  not null default 0,
  p_value        numeric(4,3),               -- qiyinlik: correct / attempts
  discrimination numeric(4,3),               -- yuqori 27% − quyi 27%
  avg_time_sec   numeric(6,1),
  option_dist    jsonb,                      -- har variant tanlanish ulushi
  updated_at     timestamptz not null default now()
);

create table question_reports (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references questions(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete set null,
  reason       text not null,                -- 'javob_notogri' | 'noaniq' | 'xato' | 'boshqa'
  comment      text,
  status       report_status not null default 'yangi',
  resolved_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz
);

create table audit_log (
  id          bigserial primary key,
  actor_id    uuid references auth.users(id) on delete set null,
  action      text not null,                 -- 'question.update'
  entity      text not null,
  entity_id   uuid,
  diff        jsonb,
  created_at  timestamptz not null default now()
);

create index on question_reports (status, created_at desc);
create index on audit_log (entity, entity_id);
```

**Psixometrika chegaralari** (admin panelda bayroq):

| Ko'rsatkich | Bayroq sharti | Ma'nosi |
|---|---|---|
| `p_value` | `< 0.25` | Juda qiyin yoki kalit noto'g'ri |
| `p_value` | `> 0.90` | Juda oson, ma'lumot bermaydi |
| `discrimination` | `< 0.10` | Savol kuchli/zaifni ajratmaydi |
| `discrimination` | `< 0` | **Deyarli har doim kalit xato** |
| `option_dist` | biror variant `= 0` | O'lik distraktor |

Hisoblash `attempts >= 30` bo'lgandagina ishonchli. Undan past bo'lsa `null`.

---

## 006_rls.sql

```sql
alter table subjects              enable row level security;
alter table modules               enable row level security;
alter table lessons               enable row level security;
alter table constructs            enable row level security;
alter table lesson_constructs     enable row level security;
alter table blueprints            enable row level security;
alter table blueprint_quotas      enable row level security;
alter table questions             enable row level security;
alter table question_options      enable row level security;
alter table question_keys         enable row level security;
alter table profiles              enable row level security;
alter table exams                 enable row level security;
alter table exam_items            enable row level security;
alter table user_construct_stats  enable row level security;
alter table user_lesson_progress  enable row level security;
alter table user_module_progress  enable row level security;
alter table question_stats        enable row level security;
alter table question_reports      enable row level security;
alter table audit_log             enable row level security;

-- Rol yordamchisi
create or replace function auth_role()
returns user_role language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'user'::public.user_role
  );
$$;

-- ---------- Kontent: hamma o'qiydi (published), editor/admin yozadi ----------

create policy "content_read_published" on modules
  for select using (status = 'published' or auth_role() in ('editor','admin'));
create policy "content_write" on modules
  for all using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));

-- lessons uchun ayni siyosat takrorlanadi
create policy "lessons_read_published" on lessons
  for select using (status = 'published' or auth_role() in ('editor','admin'));
create policy "lessons_write" on lessons
  for all using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));

create policy "subjects_read" on subjects for select using (true);
create policy "constructs_read" on constructs for select using (true);
create policy "lesson_constructs_read" on lesson_constructs for select using (true);
create policy "blueprints_read" on blueprints for select using (true);
create policy "blueprint_quotas_read" on blueprint_quotas for select using (true);

create policy "subjects_write" on subjects
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');
create policy "constructs_write" on constructs
  for all using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));
create policy "lesson_constructs_write" on lesson_constructs
  for all using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));
create policy "blueprints_write" on blueprints
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');
create policy "blueprint_quotas_write" on blueprint_quotas
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ---------- Savollar ----------

create policy "questions_read_published" on questions
  for select using (status = 'published' or auth_role() in ('editor','admin'));
create policy "questions_write" on questions
  for all using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));

create policy "options_read" on question_options
  for select using (
    exists (select 1 from questions q
            where q.id = question_id
              and (q.status = 'published' or auth_role() in ('editor','admin')))
  );
create policy "options_write" on question_options
  for all using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));

-- ⚠️ question_keys: anon va user uchun HECH QANDAY siyosat yo'q.
-- Faqat editor/admin. Oddiy foydalanuvchi kalitni faqat get_review RPC orqali,
-- sinov tugagandan keyin ko'radi.
create policy "keys_staff_only" on question_keys
  for all using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));

-- ---------- Foydalanuvchi ma'lumoti ----------

create policy "profiles_self_read" on profiles
  for select using (id = auth.uid() or auth_role() = 'admin');
create policy "profiles_self_update" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and role = auth_role());
create policy "profiles_admin_all" on profiles
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

create policy "exams_self" on exams
  for select using (user_id = auth.uid() or auth_role() = 'admin');

create policy "exam_items_self" on exam_items
  for select using (
    exists (select 1 from exams e
            where e.id = exam_id
              and (e.user_id = auth.uid() or auth_role() = 'admin'))
  );

create policy "ucs_self" on user_construct_stats
  for select using (user_id = auth.uid() or auth_role() = 'admin');
create policy "ulp_self" on user_lesson_progress
  for select using (user_id = auth.uid() or auth_role() = 'admin');
create policy "ump_self" on user_module_progress
  for select using (user_id = auth.uid() or auth_role() = 'admin');
```

**Diqqat:** `exams`, `exam_items`, `user_*` jadvallarida faqat `select` siyosati
bor. `insert` va `update` siyosati **ataylab yo'q** — bu jadvallarga yozish faqat
`security definer` RPC orqali bo'ladi. Klient hech qachon ball yoza olmaydi.

```sql
-- ---------- Sifat ----------

create policy "stats_staff" on question_stats
  for select using (auth_role() in ('editor','admin'));
create policy "stats_admin_write" on question_stats
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

create policy "reports_insert" on question_reports
  for insert with check (user_id = auth.uid());
create policy "reports_self_read" on question_reports
  for select using (user_id = auth.uid() or auth_role() in ('editor','admin'));
create policy "reports_staff_write" on question_reports
  for update using (auth_role() in ('editor','admin'))
  with check (auth_role() in ('editor','admin'));

create policy "audit_admin" on audit_log
  for select using (auth_role() = 'admin');
```

---

## Tekshirish ro'yxati

Migratsiyadan keyin bu so'rovlar **bo'sh natija** qaytarishi shart:

```sql
-- 1. RLS yoqilmagan jadval bormi?
select tablename from pg_tables
where schemaname = 'public'
  and tablename not in (
    select c.relname from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relrowsecurity
  );

-- 2. Siyosatsiz jadval bormi?
select t.tablename from pg_tables t
left join pg_policies p on p.tablename = t.tablename
where t.schemaname = 'public' and p.policyname is null;
```

Anonim rol bilan quyidagi so'rov **0 qator** qaytarishi shart:

```sql
set role anon;
select count(*) from question_keys;   -- 0 bo'lishi kerak
reset role;
```
