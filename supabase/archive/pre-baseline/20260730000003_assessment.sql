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
