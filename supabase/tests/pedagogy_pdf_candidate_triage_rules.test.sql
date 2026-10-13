-- Assertions after running 20261013_pedagogy_pdf_candidate_triage.sql.

do $$
declare
  v_ks01 uuid;
  v_primary uuid;
  v_dup uuid;
begin
  select id into v_ks01 from public.constructs where code='KS.01' and is_active limit 1;

  select id into v_primary
  from public.pedagogy_pdf_source_candidates
  where source_file_name='triage-rule-fixture.pdf' and source_question_no=1;

  select id into v_dup
  from public.pedagogy_pdf_source_candidates
  where source_file_name='triage-rule-fixture.pdf' and source_question_no=2;

  if not exists (
    select 1
    from public.pedagogy_pdf_source_candidates
    where id=v_primary
      and mapping_confidence='high'
      and mapped_construct_id=v_ks01
      and suggested_constructs @> array['KS.01']
  ) then
    raise exception 'KS.01 high-confidence triage mapping failed';
  end if;

  if not exists (
    select 1
    from public.pedagogy_pdf_source_candidates
    where id=v_dup
      and duplicate_of_candidate_id=v_primary
      and source_quality_flags @> array['exact_duplicate']
  ) then
    raise exception 'exact duplicate provenance link failed';
  end if;

  if not exists (
    select 1
    from public.pedagogy_pdf_source_candidates
    where source_file_name='PedKasb tushgan testlar fixture.pdf'
      and source_question_no=144
      and answer_key_status='conflict'
      and source_quality_flags @> array['known_source_key_conflict']
  ) then
    raise exception 'known source key conflict guard failed';
  end if;
end
$$;

delete from public.pedagogy_pdf_source_candidates
where source_file_name in ('triage-rule-fixture.pdf','PedKasb tushgan testlar fixture.pdf');
