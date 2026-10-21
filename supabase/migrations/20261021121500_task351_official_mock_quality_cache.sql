-- TASK-351: avoid repeated expensive published-item quality validation for
-- every official-mock quota and every selected question.
-- The source is patched with explicit guards so all official 2026 quotas,
-- least-exposure ordering, format/stem/construct soft diversity,
-- answer-key secrecy, metadata and active-session behavior remain intact.
-- No client grants to question_keys or other protected tables.
begin;

do $task351_official_cache$
declare
  v_source text;
  v_needle text := 'and public.is_question_official_mock_eligible(q.id)';
  v_anchor text := '  -- Feasibility is checked completely before an exam row is inserted.';
  v_declaration text := '  v_quota_count int := 0;';
  v_occurrences int;
  v_cache text := $cache_body$
  -- Evaluate the SAME official quality predicate once per eligible published
  -- candidate, instead of 27 quota checks + pool counts + 50 slot rescans.
  -- Limit the materialized set to active blueprint cells with nonzero quota;
  -- the existing per-cell taxonomy/key checks below still apply unchanged.
  select coalesce(array_agg(q.id), '{}'::uuid[])
    into v_official_eligible_ids
  from public.questions q
  join public.blueprint_quotas bq
    on bq.blueprint_id=v_bp.id and bq.group_code=q.group_code
  join public.constructs c
    on c.id=q.construct_id and c.is_active and c.group_code=q.group_code
  where q.status='published'::public.content_status
    and (
      (q.cognitive='bilish'::public.cognitive_level and bq.n_bilish>0)
      or (q.cognitive='qollash'::public.cognitive_level and bq.n_qollash>0)
      or (q.cognitive='mulohaza'::public.cognitive_level and bq.n_mulohaza>0)
    )
    and exists(select 1 from public.question_keys k where k.question_id=q.id)
    and public.is_question_official_mock_eligible(q.id);

$cache_body$;
begin
  select p.prosrc into strict v_source
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='generate_official_mock'
    and pg_get_function_identity_arguments(p.oid)='';

  -- Replay-safe without silently changing an unknown future selector.
  if position('v_official_eligible_ids uuid[]' in v_source)>0 then
    if position('and public.is_question_official_mock_eligible(q.id)' in v_source)>0
    then
      -- The once-per-pool gate remains present in optimized functions.
      null;
    end if;
    return;
  end if;

  v_occurrences :=
    (length(v_source)-length(replace(v_source,v_needle,''))) / length(v_needle);
  if v_occurrences<>4
    or position('official-mock-v4' in v_source)=0
    or position(v_anchor in v_source)=0
    or position(v_declaration in v_source)=0
  then
    raise exception 'TASK-351 official-mock-v4 source changed (quality=%): refusing unsafe patch',
      v_occurrences;
  end if;

  v_source := replace(v_source, v_needle, 'and q.id = any(v_official_eligible_ids)');
  v_source := replace(
    v_source, v_declaration,
    v_declaration || E'\n' || '  v_official_eligible_ids uuid[] := ''{}''::uuid[];'
  );
  v_source := replace(v_source, v_anchor, v_cache || v_anchor);

  execute format(
    'create or replace function public.generate_official_mock() ' ||
    'returns jsonb language plpgsql security definer set search_path=public as %L',
    v_source
  );
end
$task351_official_cache$;

revoke all on function public.generate_official_mock() from public,anon;
grant execute on function public.generate_official_mock() to authenticated;

do $task351_postflight$
declare
  v_definition text;
  v_gates int;
  v_cache_uses int;
begin
  select pg_get_functiondef('public.generate_official_mock()'::regprocedure)
    into strict v_definition;
  v_gates := (
    length(v_definition) -
    length(replace(v_definition,'public.is_question_official_mock_eligible(q.id)',''))
  ) / length('public.is_question_official_mock_eligible(q.id)');
  v_cache_uses := (
    length(v_definition)-length(replace(v_definition,'q.id = any(v_official_eligible_ids)',''))
  ) / length('q.id = any(v_official_eligible_ids)');
  if v_gates<>1 or v_cache_uses<>4
     or position('official-mock-v4' in v_definition)=0
     or position('official_mock_blueprint_invalid: 2026_subject_group_quotas' in v_definition)=0
     or position('least_exposure_quality_gated_diverse_random' in v_definition)=0
     or has_function_privilege('anon','public.generate_official_mock()','EXECUTE')
     or not has_function_privilege('authenticated','public.generate_official_mock()','EXECUTE')
  then
    raise exception 'TASK-351 cache/security/quota postflight failed: gates=%, cache_uses=%',
      v_gates, v_cache_uses;
  end if;
end
$task351_postflight$;

commit;
