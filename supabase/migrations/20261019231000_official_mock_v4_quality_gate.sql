-- TASK-305 official mock v4.
--
-- v3 already implements exact official quotas, least-exposure randomization,
-- and soft format/construct/stem diversity. This append-only migration wraps
-- every v3 candidate-set predicate with the audited quality-eligibility
-- function without duplicating the long assembler body. Exact source-shape
-- assertions make the transformation fail closed if v3 ever drifts.

begin;

do $task305_mock_v4$
declare
  v_source text;
  v_needle text := 'q.status = ''published''::public.content_status';
  v_replacement text :=
    'q.status = ''published''::public.content_status' || E'\n' ||
    '         and public.is_question_official_mock_eligible(q.id)';
  v_occurrences integer;
begin
  select p.prosrc into strict v_source
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public'
    and p.proname='generate_official_mock'
    and pg_get_function_identity_arguments(p.oid)='';

  if position('official-mock-v3' in v_source)=0 then
    raise exception 'TASK-305 expected official-mock-v3 as the active source';
  end if;

  v_occurrences :=
    (length(v_source)-length(replace(v_source,v_needle,''))) / length(v_needle);
  if v_occurrences<>4 then
    raise exception 'TASK-305 expected four v3 candidate predicates, found %',
      v_occurrences;
  end if;

  v_source:=replace(v_source,v_needle,v_replacement);
  v_source:=replace(v_source,'official-mock-v3','official-mock-v4');
  v_source:=replace(
    v_source,'least_exposure_diverse_random',
    'least_exposure_quality_gated_diverse_random'
  );
  v_source:=replace(
    v_source,'''published_with_key_only''',
    '''published_keyed_quality_gate'''
  );
  v_source:=replace(
    v_source,'''active_taxonomy_match_required''',
    '''active_taxonomy_match_required'',
      ''unresolved_high_quality_finding_excluded'',
      ''native_format_contract_required'''
  );

  execute format(
    'create or replace function public.generate_official_mock() ' ||
    'returns jsonb language plpgsql security definer set search_path=public as %L',
    v_source
  );
end
$task305_mock_v4$;

revoke all on function public.generate_official_mock() from public;
grant execute on function public.generate_official_mock() to authenticated;

do $task305_mock_v4_postflight$
declare
  v_definition text;
  v_gate_calls integer;
begin
  select pg_get_functiondef(p.oid) into strict v_definition
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='generate_official_mock'
    and pg_get_function_identity_arguments(p.oid)='';

  select count(*) into v_gate_calls
  from regexp_matches(
    v_definition,
    'public\.is_question_official_mock_eligible\(q\.id\)',
    'g'
  );
  if position('official-mock-v4' in v_definition)=0 or v_gate_calls<>4 then
    raise exception 'TASK-305 official mock v4 postflight failed: gate_calls=%',
      v_gate_calls;
  end if;
end
$task305_mock_v4_postflight$;

commit;
