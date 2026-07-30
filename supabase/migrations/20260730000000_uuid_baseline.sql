-- Attestatsiya UUID schema baseline
--
-- Remote read-only audit on 2026-07-30 confirmed that the active database
-- uses this UUID schema but has no supabase_migrations metadata table.
-- The pre-baseline source files are preserved under supabase/archive/.
-- Do not apply this file to the existing remote database; mark only this
-- baseline version as applied, then run later reconciliation migrations.

-- ============================================================================
-- Source: 20260730000001_extensions_enums.sql
-- ============================================================================
create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'editor', 'admin');
create type public.content_status as enum ('draft', 'review', 'published', 'archived');
create type public.question_format as enum ('Y1', 'Y2', 'Y3');
create type public.cognitive_level as enum ('bilish', 'qollash', 'mulohaza');
create type public.report_status as enum ('yangi', 'korilmoqda', 'tuzatildi', 'rad');
create type public.exam_kind as enum ('diagnostika', 'mashq', 'mavzu', 'bolim', 'mock', 'takrorlash', 'zaif');

-- ============================================================================
-- Source: 20260730000002_content.sql
-- ============================================================================
create table public.subjects (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name_uz     text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.modules (
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  order_idx   int  not null,
  slug        text not null,
  title_uz    text not null,
  summary_uz  text,
  status      public.content_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (subject_id, slug),
  unique (subject_id, order_idx)
);

create table public.lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references public.modules(id) on delete cascade,
  order_idx     int  not null,
  slug          text not null,
  title_uz      text not null,
  body_mdx      text,
  est_minutes   int  not null default 15,
  status        public.content_status not null default 'draft',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (module_id, slug),
  unique (module_id, order_idx)
);

create table public.constructs (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references public.subjects(id) on delete cascade,
  group_code    text not null,
  code          text not null unique,
  slug          text not null unique,
  title_uz      text not null,
  description_uz text,
  created_at    timestamptz not null default now()
);

create table public.lesson_constructs (
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  construct_id  uuid not null references public.constructs(id) on delete cascade,
  primary key (lesson_id, construct_id)
);

create index on public.modules (subject_id, order_idx);
create index on public.lessons (module_id, order_idx);
create index on public.constructs (subject_id, group_code);
create index on public.lesson_constructs (construct_id);

-- ============================================================================
-- Source: 20260730000003_assessment.sql
-- ============================================================================
create table public.blueprints (
  id                uuid primary key default gen_random_uuid(),
  subject_id        uuid not null references public.subjects(id) on delete cascade,
  version           int  not null,
  effective_year    int  not null,
  total_questions   int  not null,
  duration_min      int  not null,
  points_per_item   int  not null default 2,
  is_active         boolean not null default false,
  created_at        timestamptz not null default now(),
  unique (subject_id, version)
);

create unique index blueprints_one_active
  on public.blueprints (subject_id) where is_active;

create table public.blueprint_quotas (
  id             uuid primary key default gen_random_uuid(),
  blueprint_id   uuid not null references public.blueprints(id) on delete cascade,
  group_code     text not null,
  order_idx      int  not null,
  question_count int  not null,
  n_bilish       int  not null default 0,
  n_qollash      int  not null default 0,
  n_mulohaza     int  not null default 0,
  unique (blueprint_id, group_code),
  check (n_bilish + n_qollash + n_mulohaza = question_count)
);

create table public.questions (
  id            uuid primary key default gen_random_uuid(),
  subject_id    uuid not null references public.subjects(id) on delete cascade,
  construct_id  uuid not null references public.constructs(id) on delete restrict,
  group_code    text not null,
  format        public.question_format not null,
  cognitive     public.cognitive_level not null,
  difficulty    int  not null default 3 check (difficulty between 1 and 5),
  stem_md       text not null,
  assets        jsonb not null default '[]'::jsonb,
  is_generated  boolean not null default false,
  status        public.content_status not null default 'draft',
  author_id     uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.question_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.questions(id) on delete cascade,
  side         char(1) not null default 'a' check (side in ('a', 'b')),
  order_idx    int  not null,
  content_md   text not null,
  unique (question_id, side, order_idx)
);

create table public.question_keys (
  question_id    uuid primary key references public.questions(id) on delete cascade,
  payload        jsonb not null,
  explanation_md text not null,
  updated_at     timestamptz not null default now()
);

create index on public.questions (construct_id, status);
create index on public.questions (group_code, cognitive, status);
create index on public.question_options (question_id);

-- ============================================================================
-- Source: 20260730000004_progress.sql
-- ============================================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         public.user_role not null default 'user',
  display_name text,
  region       text,
  is_blocked   boolean not null default false,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.exams (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  kind            public.exam_kind not null,
  blueprint_id    uuid references public.blueprints(id) on delete set null,
  module_id       uuid references public.modules(id) on delete set null,
  lesson_id       uuid references public.lessons(id) on delete set null,
  duration_sec    int,
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  total_score     int,
  max_score       int,
  passed          boolean,
  breakdown       jsonb
);

create table public.exam_items (
  id                 uuid primary key default gen_random_uuid(),
  exam_id            uuid not null references public.exams(id) on delete cascade,
  question_id        uuid not null references public.questions(id) on delete restrict,
  construct_id       uuid not null references public.constructs(id) on delete restrict,
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

create table public.user_construct_stats (
  user_id       uuid not null references auth.users(id) on delete cascade,
  construct_id  uuid not null references public.constructs(id) on delete cascade,
  attempts      int  not null default 0,
  correct       int  not null default 0,
  streak        int  not null default 0,
  ease          numeric(4,2) not null default 2.50,
  interval_days int  not null default 0,
  due_at        timestamptz,
  last_seen_at  timestamptz,
  primary key (user_id, construct_id)
);

create table public.user_lesson_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  read_at      timestamptz,
  attempts     int  not null default 0,
  best_score   int,
  mastered_at  timestamptz,
  primary key (user_id, lesson_id)
);

create table public.user_module_progress (
  user_id         uuid not null references auth.users(id) on delete cascade,
  module_id       uuid not null references public.modules(id) on delete cascade,
  unlocked_at     timestamptz not null default now(),
  exam_best_score int,
  completed_at    timestamptz,
  primary key (user_id, module_id)
);

create index on public.exams (user_id, kind, started_at desc);
create index on public.exam_items (exam_id, order_idx);
create index on public.exam_items (question_id);
create index on public.user_construct_stats (user_id, due_at);

-- ============================================================================
-- Source: 20260730000005_quality.sql
-- ============================================================================
create table public.question_stats (
  question_id    uuid primary key references public.questions(id) on delete cascade,
  attempts       int  not null default 0,
  correct        int  not null default 0,
  p_value        numeric(4,3),
  discrimination numeric(4,3),
  avg_time_sec   numeric(6,1),
  option_dist    jsonb,
  updated_at     timestamptz not null default now()
);

create table public.question_reports (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.questions(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete set null,
  reason       text not null,
  comment      text,
  status       public.report_status not null default 'yangi',
  resolved_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now(),
  resolved_at  timestamptz
);

create table public.audit_log (
  id          bigserial primary key,
  actor_id    uuid references auth.users(id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_id   uuid,
  diff        jsonb,
  created_at  timestamptz not null default now()
);

create index on public.question_reports (status, created_at desc);
create index on public.audit_log (entity, entity_id);

-- ============================================================================
-- Source: 20260730000006_rls.sql
-- ============================================================================
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

-- ============================================================================
-- Source: 20260730000007_functions.sql
-- ============================================================================
-- ─── Helper: check_answer ────────────────────────────────────────────────
create or replace function public.check_answer(
  p_format      public.question_format,
  p_key         jsonb,
  p_user_answer jsonb
) returns boolean
language plpgsql immutable set search_path = public as $$
begin
  if p_user_answer is null then return false; end if;
  case p_format
    when 'Y1' then
      return (p_user_answer ->> 'option_id') is not null
         and (p_user_answer ->> 'option_id') = (p_key ->> 'correct_option_id');
    when 'Y2' then
      return (p_user_answer -> 'pairs') = (p_key -> 'pairs');
    when 'Y3' then
      return (p_user_answer -> 'order') = (p_key -> 'order');
  end case;
  return false;
end $$;

-- ─── Helper: SM-2 ─────────────────────────────────────────────────────────
create or replace function public.apply_sm2(
  p_user uuid,
  p_construct uuid,
  p_correct boolean
) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_row    public.user_construct_stats;
  v_q      int;
  v_ease   numeric(4,2);
  v_streak int;
  v_int    int;
begin
  insert into public.user_construct_stats (user_id, construct_id)
  values (p_user, p_construct)
  on conflict (user_id, construct_id) do nothing;
  select * into v_row from public.user_construct_stats
  where user_id = p_user and construct_id = p_construct for update;
  v_q := case when p_correct then 4 else 2 end;
  v_ease := greatest(1.30,
    v_row.ease + (0.1 - (5 - v_q) * (0.08 + (5 - v_q) * 0.02)));
  if p_correct then
    v_streak := v_row.streak + 1;
    v_int := case
      when v_streak = 1 then 1
      when v_streak = 2 then 3
      else greatest(1, round(v_row.interval_days * v_ease)::int)
    end;
  else
    v_streak := 0;
    v_int := 0;
  end if;
  update public.user_construct_stats set
    attempts      = v_row.attempts + 1,
    correct       = v_row.correct + (case when p_correct then 1 else 0 end),
    streak        = v_streak,
    ease          = v_ease,
    interval_days = v_int,
    due_at        = now() + make_interval(days => greatest(v_int, 1)),
    last_seen_at  = now()
  where user_id = p_user and construct_id = p_construct;
end $$;

-- ─── Helper: attach_questions ──────────────────────────────────────────────
create or replace function public.attach_questions(p_exam_id uuid, p_ids uuid[])
returns void
language sql security definer set search_path = public as $$
  insert into public.exam_items (exam_id, question_id, construct_id, order_idx)
  select p_exam_id, q.id, q.construct_id, ord
  from unnest(p_ids) with ordinality as t(qid, ord)
  join public.questions q on q.id = t.qid;
$$;

-- ─── Helper: exam_payload (kalitsiz!) ─────────────────────────────────────
create or replace function public.exam_payload(p_exam_id uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_agg(item order by item->>'order_idx')
  from (
    select jsonb_build_object(
      'item_id',   ei.id,
      'order_idx', ei.order_idx,
      'question_id', q.id,
      'format',    q.format,
      'stem_md',   q.stem_md,
      'assets',    q.assets,
      'options',   (
        select coalesce(jsonb_agg(jsonb_build_object(
                 'id', o.id, 'side', o.side, 'content_md', o.content_md
               ) order by o.side, o.order_idx), '[]'::jsonb)
        from public.question_options o where o.question_id = q.id
      )
    ) as item
    from public.exam_items ei
    join public.questions q on q.id = ei.question_id
    where ei.exam_id = p_exam_id
  ) s;
$$;

-- ─── Pick helpers ──────────────────────────────────────────────────────────
create or replace function public.pick_questions(
  p_group text, p_cog public.cognitive_level, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select id from public.questions
    where group_code = p_group
      and status = 'published'
      and (p_cog is null or cognitive = p_cog)
      and not (id = any(p_exclude))
    order by random() limit p_n
  ) s;
$$;

create or replace function public.pick_module_questions(
  p_module uuid, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id from public.questions q
    where q.status = 'published'
      and q.construct_id in (
        select lc.construct_id from public.lesson_constructs lc
        join public.lessons l on l.id = lc.lesson_id
        where l.module_id = p_module
      )
      and not (q.id = any(p_exclude))
    order by random() limit p_n
  ) s;
$$;

create or replace function public.pick_due_questions(p_user uuid, p_n int)
returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select distinct on (q.construct_id) q.id
    from public.user_construct_stats ucs
    join public.questions q on q.construct_id = ucs.construct_id
    where ucs.user_id = p_user
      and ucs.due_at <= now()
      and q.status = 'published'
    order by q.construct_id, random()
    limit p_n
  ) s;
$$;

create or replace function public.pick_weak_questions(p_user uuid, p_n int)
returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id
    from public.user_construct_stats ucs
    join public.questions q on q.construct_id = ucs.construct_id
    where ucs.user_id = p_user
      and ucs.attempts >= 3
      and q.status = 'published'
    order by (ucs.correct::numeric / nullif(ucs.attempts, 0)) asc, random()
    limit p_n
  ) s;
$$;

-- ─── start_exam ────────────────────────────────────────────────────────────
create or replace function public.start_exam(
  p_kind      public.exam_kind,
  p_module_id uuid default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_bp    public.blueprints%rowtype;
  v_exam  uuid;
  v_ids   uuid[] := '{}';
  v_dur   int;
  q       record;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select * into v_bp from public.blueprints where is_active limit 1;
  if not found then raise exception 'blueprint_topilmadi'; end if;
  if p_kind = 'mock' then
    v_dur := v_bp.duration_min * 60;
    for q in
      select group_code, n_bilish, n_qollash, n_mulohaza
      from public.blueprint_quotas where blueprint_id = v_bp.id order by order_idx
    loop
      v_ids := v_ids || public.pick_questions(q.group_code, 'bilish'::public.cognitive_level,  q.n_bilish,  v_ids);
      v_ids := v_ids || public.pick_questions(q.group_code, 'qollash'::public.cognitive_level, q.n_qollash, v_ids);
      v_ids := v_ids || public.pick_questions(q.group_code, 'mulohaza'::public.cognitive_level, q.n_mulohaza, v_ids);
    end loop;
    if array_length(v_ids, 1) <> v_bp.total_questions then
      raise exception 'savol_yetarli_emas: % / %',
        coalesce(array_length(v_ids, 1), 0), v_bp.total_questions;
    end if;
  elsif p_kind = 'diagnostika' then
    v_dur := null;
    for q in
      select group_code from public.blueprint_quotas
      where blueprint_id = v_bp.id order by order_idx
    loop
      v_ids := v_ids || public.pick_questions(q.group_code, null, 2, v_ids);
    end loop;
  elsif p_kind = 'bolim' then
    if p_module_id is null then raise exception 'module_id_kerak'; end if;
    v_dur := 1800;
    v_ids := public.pick_module_questions(p_module_id, 15, v_ids);
  elsif p_kind = 'takrorlash' then
    v_dur := null;
    v_ids := public.pick_due_questions(v_user, 15);
  elsif p_kind = 'zaif' then
    v_dur := null;
    v_ids := public.pick_weak_questions(v_user, 10);
  else
    raise exception 'qollab_quvvatlanmaydi: %', p_kind;
  end if;
  insert into public.exams (user_id, kind, blueprint_id, module_id, duration_sec)
  values (v_user, p_kind, v_bp.id, p_module_id, v_dur)
  returning id into v_exam;
  perform public.attach_questions(v_exam, v_ids);
  return jsonb_build_object(
    'exam_id', v_exam, 'kind', p_kind,
    'duration_sec', v_dur, 'started_at', now(),
    'items', public.exam_payload(v_exam)
  );
end $$;

-- ─── generate_topic_test ───────────────────────────────────────────────────
create or replace function public.generate_topic_test(p_lesson_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_exam uuid;
  v_ids  uuid[] := '{}';
  v_one  uuid;
  c      record;
  v_need int;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  for c in
    select construct_id from public.lesson_constructs where lesson_id = p_lesson_id
  loop
    select q.id into v_one
    from public.questions q
    where q.construct_id = c.construct_id
      and q.status = 'published'
      and not (q.id = any(v_ids))
    order by (
      select count(*) from public.exam_items ei
      join public.exams e on e.id = ei.exam_id
      where ei.question_id = q.id and e.user_id = v_user
    ) asc, random()
    limit 1;
    if v_one is not null then v_ids := v_ids || v_one; end if;
  end loop;
  if array_length(v_ids, 1) is null then
    raise exception 'savol_yoq: mavzuga savol biriktirilmagan';
  end if;
  v_need := greatest(0, 10 - array_length(v_ids, 1));
  if v_need > 0 then
    v_ids := v_ids || public.pick_lesson_extra(v_user, p_lesson_id, v_need, v_ids);
  end if;
  insert into public.exams (user_id, kind, lesson_id, module_id)
  select v_user, 'mavzu'::public.exam_kind, p_lesson_id, l.module_id
  from public.lessons l where l.id = p_lesson_id
  returning id into v_exam;
  perform public.attach_questions(v_exam, v_ids);
  return jsonb_build_object(
    'exam_id', v_exam, 'kind', 'mavzu',
    'duration_sec', null, 'started_at', now(),
    'items', public.exam_payload(v_exam)
  );
end $$;

create or replace function public.pick_lesson_extra(
  p_user uuid, p_lesson uuid, p_n int, p_exclude uuid[]
) returns uuid[]
language sql stable security definer set search_path = public as $$
  select coalesce(array_agg(id), '{}')
  from (
    select q.id
    from public.questions q
    join public.lesson_constructs lc on lc.construct_id = q.construct_id
    left join public.user_construct_stats ucs
      on ucs.construct_id = q.construct_id and ucs.user_id = p_user
    where lc.lesson_id = p_lesson
      and q.status = 'published'
      and not (q.id = any(p_exclude))
    order by coalesce(ucs.correct::numeric / nullif(ucs.attempts, 0), 0) asc,
             random()
    limit p_n
  ) s;
$$;

-- ─── submit_answer ─────────────────────────────────────────────────────────
create or replace function public.submit_answer(
  p_exam_id     uuid,
  p_question_id uuid,
  p_answer      jsonb,
  p_time_spent  int default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_exam    public.exams%rowtype;
  v_q       public.questions%rowtype;
  v_key     public.question_keys%rowtype;
  v_correct boolean;
  v_pts     int;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select * into v_exam from public.exams where id = p_exam_id and user_id = v_user;
  if not found then raise exception 'sinov_topilmadi'; end if;
  if v_exam.finished_at is not null then
    return jsonb_build_object('error', 'sinov_tugagan');
  end if;
  if v_exam.duration_sec is not null
     and now() > v_exam.started_at + make_interval(secs => v_exam.duration_sec) then
    return jsonb_build_object('error', 'vaqt_tugadi');
  end if;
  select * into v_q   from public.questions     where id = p_question_id;
  select * into v_key from public.question_keys where question_id = p_question_id;
  if not found then raise exception 'kalit_topilmadi'; end if;
  v_correct := public.check_answer(v_q.format, v_key.payload, p_answer);
  v_pts := case when v_correct then 2 else 0 end;
  update public.exam_items set
    user_answer = p_answer,
    is_correct  = v_correct,
    score       = v_pts,
    time_spent_sec = coalesce(p_time_spent, time_spent_sec),
    client_answered_at = coalesce(client_answered_at, now()),
    answered_at = now()
  where exam_id = p_exam_id and question_id = p_question_id;
  if v_exam.kind in ('mavzu','bolim','mock','takrorlash','zaif','diagnostika') then
    perform public.apply_sm2(v_user, v_q.construct_id, v_correct);
  end if;
  if v_exam.kind in ('mock', 'bolim') then
    return jsonb_build_object('saved', true);
  end if;
  return jsonb_build_object(
    'saved', true,
    'correct', v_correct,
    'explanation_md', v_key.explanation_md
  );
end $$;

-- ─── finish_exam ───────────────────────────────────────────────────────────
create or replace function public.finish_exam(p_exam_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_exam  public.exams%rowtype;
  v_total int; v_max int; v_pct numeric;
  v_break jsonb;
  v_all_constructs boolean;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select * into v_exam from public.exams where id = p_exam_id and user_id = v_user for update;
  if not found then raise exception 'sinov_topilmadi'; end if;
  if v_exam.finished_at is not null then
    return jsonb_build_object(
      'exam_id', v_exam.id, 'total_score', v_exam.total_score,
      'max_score', v_exam.max_score, 'passed', v_exam.passed,
      'breakdown', v_exam.breakdown, 'already_finished', true
    );
  end if;
  select coalesce(sum(score), 0), count(*) * 2
    into v_total, v_max
  from public.exam_items where exam_id = p_exam_id;
  select jsonb_agg(x) into v_break from (
    select q.group_code,
           count(*)                        as jami,
           count(*) filter (where ei.is_correct) as togri
    from public.exam_items ei join public.questions q on q.id = ei.question_id
    where ei.exam_id = p_exam_id
    group by q.group_code order by q.group_code
  ) x;
  update public.exams set
    finished_at = now(), total_score = v_total,
    max_score = v_max, breakdown = v_break
  where id = p_exam_id;
  if v_exam.kind = 'mavzu' and v_exam.lesson_id is not null then
    v_pct := case when v_max > 0 then v_total::numeric / v_max else 0 end;
    select bool_and(has_correct) into v_all_constructs from (
      select bool_or(coalesce(is_correct, false)) as has_correct
      from public.exam_items where exam_id = p_exam_id group by construct_id
    ) c;
    insert into public.user_lesson_progress (user_id, lesson_id, attempts, best_score)
    values (v_user, v_exam.lesson_id, 1, v_total)
    on conflict (user_id, lesson_id) do update set
      attempts   = public.user_lesson_progress.attempts + 1,
      best_score = greatest(coalesce(public.user_lesson_progress.best_score, 0), v_total);
    if v_pct >= 0.75 and coalesce(v_all_constructs, false) then
      update public.user_lesson_progress set mastered_at = coalesce(mastered_at, now())
      where user_id = v_user and lesson_id = v_exam.lesson_id;
      update public.exams set passed = true where id = p_exam_id;
    else
      update public.exams set passed = false where id = p_exam_id;
    end if;
  end if;
  if v_exam.kind = 'bolim' and v_exam.module_id is not null then
    insert into public.user_module_progress (user_id, module_id, exam_best_score)
    values (v_user, v_exam.module_id, v_total)
    on conflict (user_id, module_id) do update set
      exam_best_score = greatest(
        coalesce(public.user_module_progress.exam_best_score, 0), v_total);
  end if;
  select * into v_exam from public.exams where id = p_exam_id;
  return jsonb_build_object(
    'exam_id', v_exam.id, 'total_score', v_exam.total_score,
    'max_score', v_exam.max_score, 'passed', v_exam.passed,
    'breakdown', v_exam.breakdown, 'already_finished', false
  );
end $$;

-- ─── get_review ────────────────────────────────────────────────────────────
create or replace function public.get_review(p_exam_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_ok   boolean;
begin
  if v_user is null then raise exception 'auth_required'; end if;
  select finished_at is not null into v_ok
  from public.exams where id = p_exam_id and user_id = v_user;
  if v_ok is null then raise exception 'sinov_topilmadi'; end if;
  if not v_ok  then raise exception 'sinov_tugamagan'; end if;
  return (
    select jsonb_agg(jsonb_build_object(
      'order_idx',   ei.order_idx,
      'stem_md',     q.stem_md,
      'format',      q.format,
      'construct',   c.title_uz,
      'construct_slug', c.slug,
      'user_answer', ei.user_answer,
      'is_correct',  ei.is_correct,
      'key',         k.payload,
      'explanation_md', k.explanation_md
    ) order by ei.order_idx)
    from public.exam_items ei
    join public.questions q on q.id = ei.question_id
    join public.constructs c on c.id = ei.construct_id
    join public.question_keys k on k.question_id = q.id
    where ei.exam_id = p_exam_id
  );
end $$;

-- ─── Other helpers ─────────────────────────────────────────────────────────
create or replace function public.mark_lesson_read(p_lesson_id uuid)
returns void
language sql security definer set search_path = public as $$
  insert into public.user_lesson_progress (user_id, lesson_id, read_at)
  values (auth.uid(), p_lesson_id, now())
  on conflict (user_id, lesson_id) do update
    set read_at = coalesce(public.user_lesson_progress.read_at, now());
$$;

create or replace function public.get_due_reviews()
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'construct_id', c.id, 'title_uz', c.title_uz,
    'group_code', c.group_code, 'due_at', ucs.due_at,
    'accuracy', round(ucs.correct::numeric / nullif(ucs.attempts, 0), 2)
  ) order by ucs.due_at), '[]'::jsonb)
  from public.user_construct_stats ucs
  join public.constructs c on c.id = ucs.construct_id
  where ucs.user_id = auth.uid() and ucs.due_at <= now();
$$;

-- ─── RPC permissions ───────────────────────────────────────────────────────
revoke all on function public.start_exam, public.generate_topic_test, public.submit_answer,
  public.finish_exam, public.get_review, public.get_due_reviews, public.mark_lesson_read from public;
grant execute on function public.start_exam(public.exam_kind, uuid)          to anon, authenticated;
grant execute on function public.generate_topic_test(uuid)                   to anon, authenticated;
grant execute on function public.submit_answer(uuid, uuid, jsonb, int)       to anon, authenticated;
grant execute on function public.finish_exam(uuid)                            to anon, authenticated;
grant execute on function public.get_review(uuid)                             to anon, authenticated;
grant execute on function public.get_due_reviews()                            to anon, authenticated;
grant execute on function public.mark_lesson_read(uuid)                       to anon, authenticated;

revoke all on function public.pick_questions, public.pick_module_questions, public.pick_due_questions,
  public.pick_weak_questions, public.pick_lesson_extra, public.attach_questions, public.exam_payload,
  public.apply_sm2, public.check_answer from public, anon, authenticated;
