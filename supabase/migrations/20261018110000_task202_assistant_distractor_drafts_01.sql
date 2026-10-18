-- TASK-202: ten assistant-curated possible distractor revisions, PRIVATE.
-- Never approve or publish based on word count alone.
begin;
create table if not exists public.pedagogy_rewrite_proposals(
 source_question_id uuid primary key references public.questions(id) on delete restrict,
 proposed_distractors text[] not null check(cardinality(proposed_distractors)=3),
 provenance text not null default 'assistant_semantic_draft_unapproved',
 proposal_status text not null default 'draft'
   check(proposal_status in('draft','approved','rejected')),
 reviewed_at timestamptz
);
alter table public.pedagogy_rewrite_proposals enable row level security;
revoke all on public.pedagogy_rewrite_proposals from public,anon,authenticated;
grant select,insert,update on public.pedagogy_rewrite_proposals to service_role;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors)
values
('00f6512b-e8c1-4647-a1b1-9a7238f3b638',array[
'Ota-onaga sinf reytingini tushuntirib, boshqa bolalarning individual baholarini qiyoslash',
'Hamkorlik uchun boshqa bolaning o‘zlashtirish natijasini uning roziligisiz qisqacha aytish',
'Suhbatni sinfdagi barcha bolalarning xulqi va baholarini ko‘rib chiqishdan boshlash']),
('089d2d34-4127-455c-98b6-9425fc52b4ab',array[
'Ha, xavfsizlik rejasi o‘qituvchida bo‘lsa, o‘quvchilar bilan mashq qilish shart emas',
'Yo‘q, o‘quvchilar qoidalarni yodlashi kifoya, vaziyatli mashq o‘tkazish shart emas',
'Ha, favqulodda hodisa ro‘y berganda o‘qituvchi qoidalarni o‘sha paytda tushuntiradi']),
('0d556a8a-124f-4c79-b415-803e9f7ddd56',array[
'Baholarni qayta hisoblab jurnalga kiritish',
'Natijalarni ota-onalarga alohida xabar qilish',
'Takroriy nazorat topshiriqlari sonini oshirish']),
('104139c2-4efd-4c7c-a72e-ac35469d7214',array[
'Sinfdan tashqari tadbirlar ko‘lamini muntazam oshirishga',
'Dars davomida intizom talablarini qat’iy nazorat qilishga',
'Maktabning tarbiyaviy faoliyatiga oid hujjatlarni to‘liq yuritishga']),
('10b68383-9377-49e0-8526-31b0511896a9',array[
'Malaka oshirish kurslari ro‘yxatini avvaldan to‘liq shakllantirish',
'Yangi metodik qo‘llanmalar uchun xarid rejasini ishlab chiqish',
'Hamkasblar darsidagi kamchiliklarni umumiy hisobotga kiritish']),
('113b9be5-5f96-4895-9c7b-d25c7416dd49',array[
'Og‘zaki ko‘rsatmani balandroq ovoz bilan takrorlash',
'Ko‘rsatmani barcha o‘quvchilarga faqat videoda taqdim etish',
'Ko‘makni mashg‘ulot oxirigacha boshqa o‘quvchiga topshirish']),
('142da6d9-625c-455a-90d2-98227d04e5b9',array[
'Kasbiy o‘sish kurslarda qatnashilgan soatlar va berilgan sertifikatlar bilan baholanadi',
'Amaliyot o‘zgarmasa ham yangi kurslarga qatnashish pedagogik mahoratning oshganini isbotlaydi',
'Dars natijalari tahlilidan ko‘ra o‘qituvchining qoniqishi kasbiy o‘sishning dalilidir']),
('1a3b7a49-3aa5-4209-bea1-83c82b319f32',array[
'Grafikdagi rang va belgilarni daftariga ko‘chirish',
'Grafik bo‘yicha o‘qituvchi izohini tinglab yozish',
'Grafikni yaratish dasturining nomini aniq aytish']),
('25ad0a5d-0e7c-40c4-b2ef-51232d7dfdea',array[
'Ota-onalar yig‘ilishida umumiy intizom talablarini kuchaytirish',
'Ota-onalardan uy vazifasini qat’iy nazorat qilishni so‘rash',
'Boshqa sinflardagi natijalar bilan muntazam taqqoslashni tashkil etish']),
('2616bbee-8e7e-4052-ad03-eb0c3bf1aac4',array[
'Tomoshabinlar uchun tadbirning umumiy vaqtini uzaytirish',
'Tadbir oxirida batafsil hisobot va fotosurat tayyorlash',
'Tadbirning barcha bosqichlarini faqat o‘qituvchi boshqarishi'])
on conflict(source_question_id) do nothing;
commit;