-- TASK-202: PM.GEN content review proposals 71-80 (no publication).
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors)
select source_question_id::uuid, proposed_distractors from (values
('8369cc55-9265-487f-9783-a5b891e781b1',array[
'Faqat maktabdagi intizom choralarini o‘rganishga',
'Faqat tarixiy voqealarni yodlab olishga',
'Maktab hujjatlarini to‘g‘ri rasmiylashtirishga']),
('84d4e370-564d-4a42-91e8-e170bba0ff07',array[
'Noaniq yozuvlar maktab tadbirlarining umumiy sonini kamaytiradi',
'Kech qayd etish o‘quvchilar bahosini avtomatik oshirib yuboradi',
'Hujjatdagi kechikish barcha kelajakdagi qarorlarni oldindan belgilaydi']),
('8577ad2c-af42-4a1a-8c70-aec748bb5bc0',array[
'O‘quv rejasi, baholash mezoni va darslik mazmunini tanlash',
'Tarbiyaviy reja, sinf jadvali va davomat daftarini yuritish',
'Ta’lim dasturi, fan standarti va o‘quv yili rejalarini tuzish']),
('91e3719d-547d-48bd-bec6-c4ad313ac527',array[
'O‘qituvchining xulosasini o‘quvchi fikrini tinglamasdan darhol e’lon qilish',
'Farzand natijasini boshqa bolalarning shaxsiy baholariga asoslanib izohlash',
'Suhbatni uy vazifasi bajarilmaganidan kelib chiqib faqat tanbehga qaratish']),
('9851e00a-9b5c-4738-b238-ff77e2b718b5',array[
'Har qanday yoshdagi o‘quvchiga bir xil tezlikdagi topshiriq berishni',
'Faoliyatni faqat pedagogning shaxsiy o‘qitish uslubiga moslashtirishni',
'O‘quvchilarning yoshidan qat’i nazar baholashni bir xil misollarda o‘tkazishni']),
('988270fc-695d-4be7-8f0b-3bb69bee3a09',array[
'Dastur interfeysini faqat og‘zaki tushuntirib, mustaqil bajarishni keyinga qoldirish',
'Dastur menyularining barcha nomlarini yodlab, ularni qayta aytish mashqi',
'Kompyuter bilan ishlash vaqtini kamaytirib, asosan darslik matnini ko‘chirish']),
('9eead81f-f9f0-4584-b8fa-7f63b953b7bd',array[
'Aloqa faqat chorak oxirida bo‘lgani sababli ota-onalar natijani mustaqil baholaydi',
'Munosabat ko‘pincha tanbeh va shikoyatga aylanib, ijobiy hamkorlik uchun imkoniyat kamayadi',
'O‘quvchilar nazorati ota-onalarga to‘liq berilgani sababli o‘qituvchining ishtiroki kamayishi mumkin']),
('ade418bd-cae8-4518-9210-8bf69aec3264',array[
'Ilmiylik va onglilik tamoyillari',
'Muntazamlilik va izchillik tamoyillari',
'Individual yondashuv va mustaqillik tamoyillari']),
('afe15031-4f55-44c9-92bf-a65b7a4b5381',array[
'O‘quvchilar bahosini fan o‘qituvchilaridan alohida hisoblab, reytingni chiqarish',
'Sinfdan tashqari tadbirlar jadvalini tuzib, barcha mashg‘ulotlarga qatnashishni nazorat qilish',
'Har bir dars uchun fan o‘qituvchilari o‘rniga barcha mavzuni tushuntirish']),
('b7325f94-5399-470e-bc29-267408e71993',array[
'Tabiat hodisalarini faqat atama sifatida eslab qolishga',
'Ekologiya haqidagi plakatlar sonini muntazam oshirishga',
'Atrof-muhitning ko‘rinishini ta’riflashni yodlashga'])
) as proposed(source_question_id, proposed_distractors)
where exists(select 1 from public.questions q where q.id=proposed.source_question_id::uuid
  and q.status='published'::public.content_status and q.format='Y1'::public.question_format)
on conflict(source_question_id) do nothing;
commit;