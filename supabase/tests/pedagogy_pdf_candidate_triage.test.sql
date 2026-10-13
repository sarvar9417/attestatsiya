-- Regression for private pedagogy PDF candidate triage metadata.

do $$
declare
  v_id uuid;
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='pedagogy_pdf_source_candidates'
      and column_name='mapped_construct_id'
  ) then
    raise exception 'mapped_construct_id missing';
  end if;

  insert into public.pedagogy_pdf_source_candidates(
    source_file_name,source_year,source_sitting,page_no,source_question_no,
    raw_question_private,text_sha256
  ) values (
    'triage-fixture.pdf',2026,'diagnostic',1,1,
    'Fixture question for private triage metadata validation.',
    repeat('c',64)
  ) returning id into v_id;

  update public.pedagogy_pdf_source_candidates
     set mapping_confidence='ambiguous',
         source_quality_flags=array['fixture_flag']
   where id=v_id;

  if not exists (
    select 1 from public.pedagogy_pdf_source_candidates
    where id=v_id and mapping_confidence='ambiguous'
      and source_quality_flags @> array['fixture_flag']
  ) then
    raise exception 'triage metadata write failed';
  end if;

  begin
    update public.pedagogy_pdf_source_candidates
       set duplicate_of_candidate_id=v_id
     where id=v_id;
    raise exception 'self duplicate reference unexpectedly allowed';
  exception when check_violation then
    null;
  end;

  delete from public.pedagogy_pdf_source_candidates where id=v_id;
end
$$;
