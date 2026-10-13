do $$
begin
  if (
    select count(*)
    from public.pedagogy_pdf_source_candidates
    where source_file_name='wave2-verify-fixture.pdf'
      and editorial_status='verified'
      and answer_key_status='independently_verified'
      and mapping_confidence='high'
      and mapped_construct_id is not null
  )<>13 then
    raise exception 'wave2 verification fixture did not produce 13 verified candidates';
  end if;

  if exists(
    select 1
    from public.pedagogy_pdf_source_candidates
    where source_file_name='wave2-verify-fixture.pdf'
      and cardinality(suggested_constructs)<>1
  ) then
    raise exception 'wave2 verified candidates must have one explicit construct suggestion';
  end if;
end
$$;

delete from public.pedagogy_pdf_source_candidates
where source_file_name='wave2-verify-fixture.pdf';
