-- Fixture rows for deterministic pedagogy PDF triage maintenance.

insert into public.pedagogy_pdf_source_candidates(
  source_file_name,source_year,source_sitting,page_no,source_question_no,
  raw_question_private,raw_answer_private,text_sha256
) values
(
  'triage-rule-fixture.pdf',2026,'diagnostic',1,1,
  'O‘quv jarayonini rejalashtirish vazifasida aniq va o‘lchanadigan dars maqsadi qanday belgilanadi?',
  'O‘quvchi bajaradigan kuzatiladigan natija orqali',
  encode(digest('triage-rule-fixture-ks01','sha256'),'hex')
),
(
  'triage-rule-fixture.pdf',2025,'diagnostic',1,2,
  'O‘quv jarayonini rejalashtirish vazifasida aniq va o‘lchanadigan dars maqsadi qanday belgilanadi?',
  'O‘quvchi bajaradigan kuzatiladigan natija orqali',
  encode(digest('triage-rule-fixture-ks01','sha256'),'hex')
),
(
  'PedKasb tushgan testlar fixture.pdf',2026,'spring',1,144,
  'Sinfda o‘quvchini masxara qilishmoqda. Qaysilarini amalga oshirish MUMKIN EMAS?',
  '2, 4',
  encode(digest('triage-rule-fixture-conflict','sha256'),'hex')
);
