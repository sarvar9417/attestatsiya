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
