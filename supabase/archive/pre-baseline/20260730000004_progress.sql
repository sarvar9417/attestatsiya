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
