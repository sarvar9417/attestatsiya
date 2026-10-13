-- Exhaustive review regression.
do $$
begin
  if exists(
    select 1
    from public.pedagogy_pdf_source_candidates
    where source_file_name='exhaustive-review-fixture.pdf'
      and editorial_status='needs_review'
  ) then
    raise exception 'exhaustive review left fixture rows in needs_review';
  end if;

  if (
    select count(*)
    from public.pedagogy_pdf_source_candidates
    where source_file_name='exhaustive-review-fixture.pdf'
      and editorial_status='verified'
      and answer_key_status='independently_verified'
      and mapped_construct_id is not null
  )<>3 then
    raise exception 'expected three canonically verified exhaustive-review fixtures';
  end if;

  if (
    select count(*)
    from public.pedagogy_pdf_source_candidates
    where source_file_name='exhaustive-review-fixture.pdf'
      and editorial_status='rejected'
  )<>6 then
    raise exception 'expected six rejected/quarantined exhaustive-review fixtures';
  end if;

  if not exists(
    select 1 from public.pedagogy_pdf_source_candidates
    where id='e1000000-0000-4000-8000-000000000003'
      and editorial_status='rejected'
      and source_quality_flags @> array['editorial_reject_source_conflict']
  ) then
    raise exception 'source-conflict disposition missing';
  end if;

  if not exists(
    select 1 from public.pedagogy_pdf_source_candidates
    where id='e1000000-0000-4000-8000-000000000005'
      and editorial_status='rejected'
      and source_quality_flags @> array['editorial_reject_exact_duplicate']
  ) then
    raise exception 'exact-duplicate disposition missing';
  end if;

  if not exists(
    select 1 from public.pedagogy_pdf_source_candidates
    where id='e1000000-0000-4000-8000-000000000007'
      and editorial_status='rejected'
      and extraction_confidence='needs_manual_parse'
      and source_quality_flags @> array['editorial_reject_parse_bleed']
  ) then
    raise exception 'parse-bleed disposition missing';
  end if;

  if not exists(
    select 1 from public.pedagogy_pdf_source_candidates
    where id='e1000000-0000-4000-8000-000000000008'
      and editorial_status='rejected'
      and source_quality_flags @> array['editorial_reject_no_safe_mapping']
  ) then
    raise exception 'no-safe-mapping disposition missing';
  end if;

  if not exists(
    select 1 from public.pedagogy_pdf_source_candidates
    where id='e1000000-0000-4000-8000-000000000009'
      and editorial_status='rejected'
      and source_quality_flags @> array['editorial_reject_unverified_answer']
  ) then
    raise exception 'unverified-answer disposition missing';
  end if;
end
$$;

delete from public.pedagogy_pdf_source_candidates
where source_file_name='exhaustive-review-fixture.pdf';
