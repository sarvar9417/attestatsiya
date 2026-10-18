-- TASK-202: PM.GEN and PM.MET contextual distractor suggestions, private only.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors)
select source_question_id::uuid, proposed_distractors from (values
('c466b760-5482-470c-8d27-d0cc2a462114',array[
'O‘quvchi topshiriqni bajarmagani uning motivatsiyasi pastligini aniq isbotlaydi, vazifa darajasini tekshirish shart emas',
'Vazifa qiyinligi hamma uchun bir xil bo‘lgani sababli o‘quvchining avvalgi bilimini hisobga olish zarur emas',
'Topshiriq bajarilmaganida eng to‘g‘ri qaror pedagogik sabablarni tekshirmasdan past baho qo‘yish hisoblanadi']),
('cb1c1bc6-51b0-4050-8ba1-07eb684e4539',array[
'O‘quv maqsadlari va dars rejasi',
'Baholash vositalari va kuzatish mezoni',
'Ta’lim metodlari va mashg‘ulot shakli']),
('d0e7e392-6be7-4a21-9cc7-52e0c62e38b0',array[
'Adolat deganda barcha o‘quvchilarga aynan bir xil jihoz va vaqt ajratish tushuniladi',
'Moslashtirilgan yordam ayrim o‘quvchilar uchun natija talabini butunlay bekor qilishni anglatadi',
'Tenglik uchun har bir o‘quvchi individual ehtiyojidan qat’i nazar bir xil vazifani bajarishi zarur']),
('da2c892a-0780-4aca-aa90-768eb8128e81',array[
'Asosan o‘quvchining baholari va nazorat ishlaridagi umumiy reytingini hisobga olishni',
'Faqat dars davomida o‘qituvchi nutqi va material hajmini',
'Faqat fan dasturining mavzular ketma-ketligi va nazorat sanalarini']),
('df67c78d-910d-4fe3-b366-7acff36c2966',array[
'O‘quvchilarga materialni izlashni mustaqil topshirib, guruhga bo‘linishni tasodifga qoldirish',
'Har bir faoliyat uchun vaqtni ko‘paytirib, jihoz izlashni davom ettirish',
'Guruh rollarini kelishmasdan, mavzu tugagach ularning ishlash tartibini baholash']),
('e56b4a41-b455-4942-a8b6-2e6047e68abb',array[
'Topshiriq bajarilmaganini darhol xulq muammosi deb hisoblab umumiy ogohlantirish berish',
'O‘quvchining oldingi natijasini tekshirmasdan faqat qayta nazorat ishini belgilash',
'Darsdagi tushunmovchilikni e’tiborsiz qoldirib, yangi mavzuga o‘sha tezlikda o‘tish']),
('e691afe6-c8a2-4073-b424-4bd7d1100fa6',array[
'O‘quvchilar his-tuyg‘ularini ularning mimikasidan anglay olishga',
'Sinfdagi topshiriqlarni vaqt va rollar bo‘yicha taqsimlashga',
'O‘qituvchi o‘z fanining nazariy asoslarini chuqur o‘rganishiga']),
('ec65cd57-a734-4ce2-a0fb-8007de80b5b0',array[
'Mazmunni o‘quvchining yoshini hisobga olmasdan faqat og‘zaki bayon etish',
'O‘quvchilarga bir xil atamani bir necha marta yoddan yozdirish',
'Ko‘rgazmadan dars maqsadiga aloqasiz bezak sifatida ko‘proq foydalanish']),
('f7e02c8c-95ae-4bdf-b0fc-f1f2c8ff9493',array[
'Pedagogning barcha sinfga bir xil qat’iy talab qo‘yib, vaziyatni inobatga olmasligini',
'O‘qituvchining yangi metodlarni dars jadvaliga mos ravishda tanlash qobiliyatini',
'Fan mazmunini chuqur bilish va ilmiy terminlarni bir xil tarzda qo‘llashni']),
('05320d37-d4a0-448f-8445-762a122b22f6',array[
'Rasmiy fan standarti va umumiy ta’lim maqsadi',
'O‘quv natijasining tekshirilishi uchun asosiy mezon',
'Har bir o‘quvchidan kutiladigan asosiy kompetensiya'])
) as proposed(source_question_id, proposed_distractors)
where exists(select 1 from public.questions q where q.id=proposed.source_question_id::uuid
  and q.status='published'::public.content_status and q.format='Y1'::public.question_format)
on conflict(source_question_id) do nothing;
commit;