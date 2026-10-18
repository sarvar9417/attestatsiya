-- TASK-210 phase 2: user-owned reusable personal test configurations.
-- Isolated from official/mock generator; no question keys or attempts stored here.
begin;

create table public.custom_exam_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (
    char_length(name) between 2 and 60 and name = btrim(name)
  ),
  config jsonb not null check (
    jsonb_typeof(config) = 'object' and octet_length(config::text) <= 16384
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index custom_exam_presets_owner_name_ci
  on public.custom_exam_presets (user_id, lower(name));
create index custom_exam_presets_owner_updated
  on public.custom_exam_presets (user_id, updated_at desc);

alter table public.custom_exam_presets enable row level security;

create policy custom_exam_presets_select_self on public.custom_exam_presets
  for select to authenticated using (user_id = auth.uid());
create policy custom_exam_presets_insert_self on public.custom_exam_presets
  for insert to authenticated with check (user_id = auth.uid());
create policy custom_exam_presets_update_self on public.custom_exam_presets
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy custom_exam_presets_delete_self on public.custom_exam_presets
  for delete to authenticated using (user_id = auth.uid());

create or replace function public.guard_custom_exam_preset()
returns trigger language plpgsql security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or new.user_id is distinct from auth.uid() then
    raise exception 'preset_owner_mismatch';
  end if;
  if tg_op = 'INSERT' then
    -- Serialize count/insert for one owner: two simultaneous creates cannot bypass 30.
    perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 210));
    if (select count(*) from public.custom_exam_presets where user_id = new.user_id) >= 30 then
      raise exception 'preset_limit_reached';
    end if;
  elsif new.user_id is distinct from old.user_id then
    raise exception 'preset_owner_immutable';
  end if;
  new.updated_at := now();
  return new;
end
$$;

create trigger guard_custom_exam_preset_before_write
  before insert or update on public.custom_exam_presets
  for each row execute function public.guard_custom_exam_preset();

revoke all on public.custom_exam_presets from public, anon;
grant select, insert, update, delete on public.custom_exam_presets to authenticated;
revoke all on function public.guard_custom_exam_preset() from public, anon, authenticated;

commit;
