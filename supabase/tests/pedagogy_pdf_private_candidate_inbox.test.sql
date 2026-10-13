-- Private pedagogy PDF candidate inbox security/regression.

do $$
declare
  v_q uuid;
begin
  if to_regclass('public.pedagogy_pdf_source_candidates') is null then
    raise exception 'pedagogy_pdf_source_candidates table missing';
  end if;

  if has_table_privilege('anon','public.pedagogy_pdf_source_candidates','SELECT')
     or has_table_privilege('authenticated','public.pedagogy_pdf_source_candidates','SELECT')
     or has_table_privilege('anon','public.pedagogy_pdf_source_candidates','INSERT')
     or has_table_privilege('authenticated','public.pedagogy_pdf_source_candidates','INSERT')
  then
    raise exception 'raw pedagogy PDF source inbox exposed to learner roles';
  end if;

  begin
    insert into public.pedagogy_pdf_source_candidates(
      source_file_name,source_year,source_sitting,page_no,source_question_no,
      raw_question_private,raw_answer_private,text_sha256,
      editorial_status,answer_key_status,historical_exam_claim_status
    ) values (
      'fixture.pdf',2026,'spring',1,1,
      'Fixture pedagogical source question for guard verification.',
      'A',
      repeat('a',64),
      'verified','independently_verified','independently_verified'
    );
    raise exception 'guard allowed auto-verification';
  exception when check_violation then
    null;
  end;

  insert into public.pedagogy_pdf_source_candidates(
    source_file_name,source_year,source_sitting,page_no,source_question_no,
    raw_question_private,raw_answer_private,text_sha256
  ) values (
    'fixture.pdf',2026,'spring',1,1,
    'Fixture pedagogical source question that must remain private and review-only.',
    'Source marker only',
    repeat('b',64)
  ) returning id into v_q;

  if not exists (
    select 1 from public.pedagogy_pdf_source_candidates
    where id=v_q
      and editorial_status='needs_review'
      and answer_key_status='source_marker_unverified'
      and linked_question_id is null
  ) then
    raise exception 'safe default candidate state missing';
  end if;

  delete from public.pedagogy_pdf_source_candidates where id=v_q;
end
$$;
