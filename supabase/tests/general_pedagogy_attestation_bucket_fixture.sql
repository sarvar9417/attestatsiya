-- Fresh-DB fixture for general-pedagogy attestation acceptance.
insert into public.pedagogy_pdf_source_candidates(
  id,source_file_name,source_year,source_sitting,page_no,source_question_no,
  raw_question_private,raw_answer_private,text_sha256
) values
(
  'e2000000-0000-4000-8000-000000000001',
  'general-pedagogy-fixture.pdf',2026,'diagnostic',1,1,
  'Tarixiy attestatsiyadagi umumiy pedagogik chalg‘ituvchi savol.',
  'Tarixiy javob markeri',
  encode(digest('general-pedagogy-fixture-1','sha256'),'hex')
),
(
  'e2000000-0000-4000-8000-000000000002',
  'general-pedagogy-fixture.pdf',2026,'diagnostic',1,2,
  'Takror provenance qatori sifatida qolishi kerak bo‘lgan pedagogik savol.',
  'Pedagogik takt',
  encode(digest('general-pedagogy-fixture-2','sha256'),'hex')
)
on conflict(id) do nothing;

update public.pedagogy_pdf_source_candidates
set editorial_status='rejected',
    source_quality_flags=array['editorial_reject_no_safe_mapping'],
    review_notes='Final disposition: REJECTED — no safe official construct mapping. Source retained privately; no construct was invented.'
where id='e2000000-0000-4000-8000-000000000001';

update public.pedagogy_pdf_source_candidates
set editorial_status='rejected',
    source_quality_flags=array['editorial_reject_exact_duplicate'],
    duplicate_of_candidate_id='e2000000-0000-4000-8000-000000000001'
where id='e2000000-0000-4000-8000-000000000002';
