-- TASK-353: schema-only regression test. Always rolls back.
begin;
do $verify$
declare v_count int; v_n text; v_kind text; v_table text;
begin
  if not has_function_privilege('anon','public.auth_role()','execute') then
    raise exception 'Anonymous published-content policies lost the auth_role helper';
  end if;
  foreach v_n in array array[
    'guard_pedguli_candidate_editorial_update',
    'guard_pedguli_candidate_initial_state',
    'guard_pedguli_published_mutation',
    'guard_pedguli_question_publish'
  ] loop
    if has_function_privilege('anon',format('public.%I()',v_n),'execute') or
       has_function_privilege('authenticated',format('public.%I()',v_n),'execute') then
      raise exception 'Trigger-only function still has API EXECUTE grant: %',v_n;
    end if;
  end loop;

  foreach v_table in array array[
    'blueprint_quotas','blueprints','constructs','lesson_constructs',
    'lessons','modules','question_options','questions','subjects'
  ] loop
    select count(*) into v_count from pg_policies
    where schemaname='public' and tablename=v_table and cmd='ALL';
    if v_count<>0 then raise exception 'Old ALL policy remains: %',v_table; end if;

    foreach v_kind in array array['INSERT','UPDATE','DELETE'] loop
      select count(*) into v_count from pg_policies
      where schemaname='public' and tablename=v_table
        and cmd=v_kind and roles='{public}';
      if v_count<1 then raise exception 'Missing write operation % on %',v_kind,v_table; end if;
    end loop;
    select count(*) into v_count from pg_policies where
      schemaname='public' and tablename=v_table and cmd='SELECT';
    if v_count<1 then raise exception 'Lost SELECT policy on %',v_table; end if;
  end loop;

  if exists(select 1 from pg_policies where schemaname='public'
    and tablename='question_keys' and policyname='question_keys_staff_manage')
  then raise exception 'Redundant question_keys policy remains'; end if;

  select count(*) into v_count from pg_policies where schemaname='public'
  and tablename in ('profiles','topic_test_attempts','mastery_evidence','custom_exam_presets')
  and (qual like '%auth.uid()%' and qual not like '%( SELECT auth.uid() %'
    or with_check like '%auth.uid()%' and with_check not like '%( SELECT auth.uid() %');
  if v_count>0 then
    raise exception 'An unoptimized auth.uid() policy remains: %',v_count;
  end if;

  if to_regclass('public.idx_questions_source_ref') is not null
     or to_regclass('public.idx_questions_source_reference') is null then
    raise exception 'Question source reference index was not deduplicated';
  end if;
end $verify$;

-- Verify all TASK-353 indexes exist after the other migration.
do $indexes$
declare v_count int;
begin
  select count(*) into v_count
  from pg_class idx join pg_namespace n on n.oid=idx.relnamespace
  where idx.relkind='i' and idx.relname like 'idx_%_fk'
    and n.nspname in ('public','attest_ingest','ktd_quality');
  if v_count<37 then raise exception 'Only % FK advisor coverage indexes found',v_count; end if;
end $indexes$;
rollback;
