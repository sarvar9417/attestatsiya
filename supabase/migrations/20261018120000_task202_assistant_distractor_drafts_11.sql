-- TASK-202: applied-computing pedagogy distractor drafts; no learner release.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors) values
('75000000-0000-4000-8000-000000000032',array[
'Algoritm tuzishni keyinga qoldirib, tayyor kod buyruqlarini yodlash',
'Mavzuni faqat blok-sxema atamalarini yozdirish orqali yakunlash',
'Algoritm natijasini tekshirmasdan, faqat dastur oynasini bezash']),
('75000000-0000-4000-8000-000000000034',array[
'Bazaga oid barcha atamalarni yodlab, ularni sinf oldida takrorlash',
'Faqat ma’lumotlar bazasi dasturining interfeysini ko‘chirib chizish',
'Tayyor ma’lumotlar jadvalini tahlilsiz ko‘chirib, loyiha deb topshirish']),
('75000000-0000-4000-8000-000000000035',array[
'Sikl nomlarini yodlash bilan chegaraviy holatni tekshirmasdan mavzuni yakunlash',
'O‘quvchilarga tayyor ishlaydigan kodni berib, uni bir necha marta nusxalash',
'Xatoni topish uchun kodning faqat tashqi bezak va izohlarini o‘zgartirish']),
('75000000-0000-4000-8000-000000000036',array[
'Xatolik xabarini e’tiborsiz qoldirib, dastur matnini butunlay qayta yozish',
'Muammoni tekshirmasdan, boshqa o‘quvchining kodidan tayyor qismini ko‘chirish',
'Xato satrini bilmasdan, taxmin asosida bir nechta buyruqni almashtirish']),
('8573a169-c9a1-4913-852e-e872aed798dd',array[
'Namuna ko‘rsatilgani uchun o‘quvchi qolgan faoliyatni bajarmasa ham metod samarali bo‘ladi',
'Tayyor kodni ko‘chirish o‘quvchining algoritm tuzish va xatoni topish malakasini avtomatik rivojlantiradi',
'Barcha vazifalarni o‘qituvchi bajarganida ham mustaqil mashqdagi o‘quvchi natijasi to‘liq baholanadi']),
('89609646-52ce-416c-9d6c-32a840cf56bd',array[
'Barcha o‘quvchilarning o‘tgan chorakdagi bahosini faqat umumiy reyting ko‘rinishida chiqarish',
'Mavzuni murakkab deb belgilab, darsning qolgan bosqichlarini o‘zgartirmasdan davom ettirish',
'Faqat o‘quvchilar intizomi va sinfdagi qurilmalar sonini umumiy hisoblash bilan cheklanish']),
('8dbbecce-3c01-4526-b50f-3b2fc984223c',array[
'Maqsadga erishilgan, chunki ko‘proq ta’rif yodlash algoritm tuzish ko‘nikmasini to‘liq beradi',
'O‘quvchilar atamalarni bilsa, tahlil va algoritmni tekshirish mashqlarini keyinga qoldirish mumkin',
'Ta’riflarni eslashni chuqurlashtirish orqali barcha o‘quvchilarda mustaqil algoritmik fikrlash shakllanadi']),
('90f7ea10-4480-4337-b74f-5bb882af5037',array[
'Yangi vosita mavjud ekan, uni barcha mavzularda qo‘llashni majburiy qilish',
'Maqsadni vositaning imkoniyatlariga moslab, fan mazmunini keyin tanlash',
'Qurilma imkoniyatlarini tekshirmasdan, barcha dars jarayonini unga bog‘lash']),
('951a7c0d-4a9d-46c2-ac74-b8f2a4815e3e',array[
'Darsdagi kuzatuvdan qat’i nazar, barcha qiyinchilikni o‘quvchi xatti-harakati bilan bog‘lash uchun',
'Metodni takomillashtirishdan ko‘ra dars jadvalini o‘zgartirishni asoslash uchun',
'O‘qituvchining umumiy taassurotini dars samaradorligining yagona dalili deb olish uchun']),
('a3f3f897-5736-4608-9239-8b27df6e7110',array[
'Faqat mavzu nomi va dars sanasini',
'O‘qituvchi maoshi va sinf jihozlari ro‘yxatini',
'Yillik ta’til jadvali va davomat shaklini'])
on conflict(source_question_id) do nothing;
commit;