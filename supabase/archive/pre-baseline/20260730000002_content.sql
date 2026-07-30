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
