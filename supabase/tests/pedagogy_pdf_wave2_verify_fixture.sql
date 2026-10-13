-- Fresh-DB fixture for wave 2 candidate verification maintenance.
insert into public.pedagogy_pdf_source_candidates(
  id,source_file_name,source_year,source_sitting,page_no,source_question_no,
  raw_question_private,raw_answer_private,text_sha256
)
select x.id::uuid,'wave2-verify-fixture.pdf',2026,'diagnostic',1,x.qno,
       'Fixture private pedagogy source candidate '||x.qno,
       'Fixture answer '||x.qno,
       encode(digest('wave2-verify-fixture-'||x.qno::text,'sha256'),'hex')
from (values
('02778030-c9f2-4c5b-8397-05a7be9b37e4',1),
('899eedc0-0e18-410e-aa82-6c03718432cf',2),
('699557f3-1844-485b-9b37-e824c906a845',3),
('a00bb116-a47f-4184-a4a0-9d170da84fa9',4),
('129994d7-9201-4ba2-acf6-101b5a907772',5),
('2db4abf0-ac81-4ad1-9a8f-7fe67dacbdb3',6),
('4699a03d-44ba-49a5-94d4-7e5daa63d6de',7),
('1e1ecf50-d2ce-4451-b94c-b8becdb5cec4',8),
('4c02e22d-ae53-4dc1-af37-a87ce051104f',9),
('1759c2fc-cf61-4129-89f0-745309eb8de4',10),
('2f1459cf-a26f-433b-a401-1be75e799ef4',11),
('f2bd1f89-af2d-47f9-9f02-c6518c2aaca0',12),
('37e40107-87f7-4ea6-9122-e1ecd00764b1',13)
) x(id,qno)
on conflict(id) do nothing;
