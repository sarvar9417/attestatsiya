-- General-pedagogy attestation bucket regression.
do $$
begin
  if not exists(
    select 1
    from public.pedagogy_pdf_source_candidates
    where id='e2000000-0000-4000-8000-000000000001'
      and editorial_status='accepted_general'
      and attestation_bucket='general_pedagogy'
      and mapped_construct_id is null
      and answer_key_status='source_marker_unverified'
      and source_quality_flags @> array['general_pedagogy_attestation']
      and not (source_quality_flags @> array['editorial_reject_no_safe_mapping'])
  ) then
    raise exception 'eligible general pedagogy candidate was not accepted safely';
  end if;

  if not exists(
    select 1
    from public.pedagogy_pdf_source_candidates
    where id='e2000000-0000-4000-8000-000000000002'
      and editorial_status='rejected'
      and attestation_bucket='quarantine'
      and duplicate_of_candidate_id is not null
  ) then
    raise exception 'duplicate provenance candidate must remain quarantined';
  end if;
end
$$;

delete from public.pedagogy_pdf_source_candidates
where source_file_name='general-pedagogy-fixture.pdf';
