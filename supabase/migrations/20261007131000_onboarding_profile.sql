-- T-033: learner onboarding profile fields.
-- Keeps role/is_blocked protection from 20260730000010_rpc_security_hardening.sql.

alter table public.profiles
  add column if not exists timezone text not null default 'Asia/Tashkent',
  add column if not exists locale text not null default 'uz-Latn',
  add column if not exists exam_date date,
  add column if not exists daily_goal_minutes smallint not null default 30,
  add column if not exists onboarding_completed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  drop constraint if exists profiles_daily_goal_minutes_check;

alter table public.profiles
  add constraint profiles_daily_goal_minutes_check
  check (daily_goal_minutes between 5 and 240);

create or replace function public.touch_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_profile_updated_at();

comment on column public.profiles.exam_date is
  'Learner attestatsiya sanasi; null = sana hali noma''lum.';
comment on column public.profiles.daily_goal_minutes is
  'Kunlik o''qish maqsadi, daqiqalarda.';
comment on column public.profiles.onboarding_completed_at is
  'Learner majburiy onboarding ma''lumotlarini saqlagan vaqt.';
