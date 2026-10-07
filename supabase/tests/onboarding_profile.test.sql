-- T-033 onboarding profile schema regression.
do $$
declare
  v_constraint text;
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'exam_date'
      and data_type = 'date'
  ) then
    raise exception 'profiles.exam_date missing';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'onboarding_completed_at'
      and data_type = 'timestamp with time zone'
  ) then
    raise exception 'profiles.onboarding_completed_at missing';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'daily_goal_minutes'
      and is_nullable = 'NO'
      and column_default like '%30%'
  ) then
    raise exception 'profiles.daily_goal_minutes contract mismatch';
  end if;

  select pg_get_constraintdef(oid)
    into v_constraint
  from pg_constraint
  where conrelid = 'public.profiles'::regclass
    and conname = 'profiles_daily_goal_minutes_check';

  if v_constraint is null
     or v_constraint not like '%daily_goal_minutes >= 5%'
     or v_constraint not like '%daily_goal_minutes <= 240%' then
    raise exception 'profiles daily goal constraint missing: %', v_constraint;
  end if;

  if not exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.profiles'::regclass
      and tgname = 'profiles_touch_updated_at'
      and not tgisinternal
  ) then
    raise exception 'profiles_touch_updated_at trigger missing';
  end if;
end
$$;
