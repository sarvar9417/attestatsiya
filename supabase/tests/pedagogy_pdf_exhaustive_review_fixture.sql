-- Fresh-DB fixtures for exhaustive pedagogy PDF editorial disposition.
insert into public.pedagogy_pdf_source_candidates(
  id,source_file_name,source_year,source_sitting,page_no,source_question_no,
  raw_question_private,raw_answer_private,text_sha256
)
values
('e1000000-0000-4000-8000-000000000001','exhaustive-review-fixture.pdf',2026,'diagnostic',1,1,
 'O‘quv yilini rejalashtirish vaziyati haqida savol.',
 'O‘quv jarayonini rejalashtirish',
 encode(digest('exhaustive-1','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000002','exhaustive-review-fixture.pdf',2026,'diagnostic',1,2,
 'Sinf boshqaruv uslubini aniqlash vaziyati.',
 'Demokratik uslub',
 encode(digest('exhaustive-2','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000003','exhaustive-review-fixture.pdf',2026,'diagnostic',1,3,
 'Terminologik ziddiyatli tarixiy savol.',
 'Sintetik usul',
 encode(digest('exhaustive-3','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000004','exhaustive-review-fixture.pdf',2026,'diagnostic',1,4,
 'Takror manba uchun original reprezentativ yozuv.',
 'Pedagogik takt',
 encode(digest('exhaustive-4','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000005','exhaustive-review-fixture.pdf',2026,'diagnostic',1,5,
 'Takror manba uchun ikkinchi yozuv.',
 'Pedagogik takt',
 encode(digest('exhaustive-5','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000006','exhaustive-review-fixture.pdf',2026,'diagnostic',1,6,
 'Yaqin dublikat sifatida saqlanadigan yozuv.',
 'Pedagogik nazokat',
 encode(digest('exhaustive-6','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000007','exhaustive-review-fixture.pdf',2026,'diagnostic',1,7,
 'Javob qismida keyingi savol qo‘shilib ketgan yozuv.',
 E'Diagnostik\n8. Keyingi savol matni',
 encode(digest('exhaustive-7','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000008','exhaustive-review-fixture.pdf',2026,'diagnostic',1,8,
 'Rasmiy constructga xavfsiz bog‘lanmaydigan chekka tarixiy fakt.',
 'Alisher Navoiy',
 encode(digest('exhaustive-8','sha256'),'hex')),
('e1000000-0000-4000-8000-000000000009','exhaustive-review-fixture.pdf',2026,'diagnostic',1,9,
 'Construct signali bor, ammo javobi canonical qoida bilan mustaqil tasdiqlanmagan vaziyat.',
 'Noma’lum tarixiy atama',
 encode(digest('exhaustive-9','sha256'),'hex'))
on conflict(id) do nothing;

update public.pedagogy_pdf_source_candidates
set answer_key_status='conflict',
    source_quality_flags=array['known_source_key_conflict']
where id='e1000000-0000-4000-8000-000000000003';

update public.pedagogy_pdf_source_candidates
set duplicate_of_candidate_id='e1000000-0000-4000-8000-000000000004',
    source_quality_flags=array['exact_duplicate']
where id='e1000000-0000-4000-8000-000000000005';

update public.pedagogy_pdf_source_candidates
set near_duplicate_of_candidate_id='e1000000-0000-4000-8000-000000000004',
    source_quality_flags=array['near_duplicate_review']
where id='e1000000-0000-4000-8000-000000000006';

update public.pedagogy_pdf_source_candidates
set source_quality_flags=array['answer_parse_bleed']
where id='e1000000-0000-4000-8000-000000000007';

update public.pedagogy_pdf_source_candidates
set mapped_construct_id=(select id from public.constructs where code='KS.01' and is_active limit 1),
    mapping_confidence='high',
    suggested_constructs=array['KS.01']
where id='e1000000-0000-4000-8000-000000000009';
