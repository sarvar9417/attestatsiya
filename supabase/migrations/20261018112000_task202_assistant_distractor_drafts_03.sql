-- TASK-202: additional original alternatives, private editorial proposals only.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors)
values
('75000000-0000-4000-8000-000000000004',array[
'Guruhga umumiy topshiriqni qayta berib, yordamni keyinga qoldirish',
'Barcha guruhlar uchun bir xil murakkablikdagi misollar sonini ko‘paytirish',
'Guruhdagi kuchli o‘quvchiga qolganlarning ishini bajarishni topshirish']),
('75000000-0000-4000-8000-000000000005',array[
'Chorak oxirida umumiy o‘zlashtirish natijalarini yakuniy hisoblash',
'Sinfning o‘rtacha bahosini tashqi sinov mezoniga solishtirish',
'Bo‘lim tugagach o‘quvchilarni umumiy mezon asosida saralash']),
('75000000-0000-4000-8000-000000000006',array[
'Xato joyini ko‘rsatmasdan dasturini butunlay qayta yozishni aytish',
'Boshqa o‘quvchining tayyor kodini o‘rganmasdan nusxalashni tavsiya qilish',
'Faqat yakuniy ballni aytib, tuzatish yo‘lini o‘quvchining o‘ziga qoldirish']),
('75000000-0000-4000-8000-000000000008',array[
'Kamsitish holatini sinf yig‘ilishigacha kechiktirib, tanbehni hammaga berish',
'Jabrlangan o‘quvchini guruhdan ajratib, qolganlar ishini davom ettirish',
'Nizo sabablarini o‘rganmasdan faqat guruhdagi vazifalarni almashtirish']),
('75000000-0000-4000-8000-000000000010',array[
'Holatni muhokama qilish uchun xabar nusxasini sinf guruhiga yuborish',
'Zararli muloqotni e’tiborsiz qoldirishni tavsiya qilib, qo‘shimcha yordam so‘ramaslik',
'Tazyiqni kamaytirish uchun jabrlanuvchining barcha raqamli ishlanmalarini cheklash']),
('75000000-0000-4000-8000-000000000011',array[
'O‘qituvchi qatnashgan malaka oshirish kurslari va sertifikatlar soni',
'Darslik va ko‘rgazmali jihozlarni xarid qilish bo‘yicha umumiy reja',
'Pedagogning ish staji va sinfdagi o‘quvchilar soni']),
('75000000-0000-4000-8000-000000000012',array[
'Yangi metodni barcha mavzularga tatbiq qilib, natijalarni uzoq vaqt kuzatmaslik',
'Natija pasayishini o‘quvchilar intizomi bilan bog‘lab, baholash mezonini o‘zgartirmaslik',
'Metodni darhol bekor qilib, eski testlardan faqat yakuniy nazoratda foydalanish']),
('75000000-0000-4000-8000-000000000013',array[
'Suhbatni asosan ota-onaning uy nazoratidagi kamchiliklarini muhokama qilishga qaratish',
'O‘quvchi natijasini sinfdagi o‘rtacha baholarga taqqoslash bilan cheklanish',
'Uchrashuvni kamchiliklarni sanab, keyingi qadamni belgilamasdan yakunlash']),
('75000000-0000-4000-8000-000000000014',array[
'Hamkorlikni faqat dars jadvalini bir-biriga yuborish bilan cheklash',
'Har ikki fan bo‘yicha alohida topshiriq tuzib, bahoni alohida qo‘yish',
'Loyihaning texnik yechimini faqat bitta o‘qituvchi mustaqil tanlashi']),
('7ec163c0-a7dc-44d3-b1f4-cff475c7f7dd',array[
'Ha, batafsil rejada har bir faoliyat yozilsa, baholash mosligi shart bo‘lmaydi',
'Yo‘q, rejadagi baholashni faqat yakuniy sinovga ko‘chirishning o‘zi yetarli',
'Ha, rejalashtirish sifati faqat vaqt taqsimoti va mavzu soni bilan o‘lchanadi'])
on conflict(source_question_id) do nothing;
commit;