-- TASK-211: user-owned reusable custom test presets.
begin;
create table if not exists public.custom_test_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(btrim(title)) between 1 and 80),
  config jsonb not null check (jsonb_typeof(config) = 'object' and pg_column_size(config) <= 16384),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id,title)
);
create index if not exists custom_test_presets_owner_updated_idx
  on public.custom_test_presets(user_id,updated_at desc);
alter table public.custom_test_presets enable row level security;
revoke all on public.custom_test_presets from public, anon;
grant select,insert,update,delete on public.custom_test_presets to authenticated;
create policy custom_test_presets_select on public.custom_test_presets
  for select to authenticated using (user_id=auth.uid());
create policy custom_test_presets_insert on public.custom_test_presets
  for insert to authenticated with check (user_id=auth.uid());
create policy custom_test_presets_update on public.custom_test_presets
  for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy custom_test_presets_delete on public.custom_test_presets
  for delete to authenticated using (user_id=auth.uid());
create or replace function public.custom_test_preset_limit()
returns trigger language plpgsql security definer set search_path=''
as $$
begin
  if new.user_id is distinct from auth.uid() then raise exception 'preset_owner_invalid'; end if;
  if tg_op='INSERT' then
    perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 210));
    if (select count(*) from public.custom_test_presets where user_id=new.user_id)>=30 then
      raise exception 'custom_preset_limit';
    end if;
  elsif old.user_id is distinct from new.user_id then
    raise exception 'preset_owner_immutable';
  end if;
  new.updated_at:=now();
  return new;
end $$;
drop trigger if exists custom_test_preset_limit_trigger on public.custom_test_presets;
create trigger custom_test_preset_limit_trigger before insert or update on public.custom_test_presets
for each row execute function public.custom_test_preset_limit();
revoke all on function public.custom_test_preset_limit() from public,anon,authenticated;
commit;
