-- TASK-202: further KS/PM.GEN answer-length repair suggestions; not published.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors) values
('d1b8b7c1-4e76-429c-b4e9-cd509d038259',array[
'Pedagogning o‘z xotirasidagi umumiy taassurotlariga',
'Faqat boshqa o‘qituvchilar bilan mavzu suhbatlariga',
'Taqdimotlar soni va dars davomiyligi haqidagi hisobotlarga']),
('d217c54c-54b0-464c-a907-a71818597e44',array[
'Sinf o‘rtachasiga yetmagani uchun barcha ijobiy o‘zgarishlarni yetarli emas deb hisoblash',
'O‘quvchining o‘zlashtirishidagi o‘sishni e’tiborsiz qoldirib, reytingdagi o‘rniga qarab qat’iy xulosa qilish',
'Sinfdagi eng yuqori natijani yagona maqsad qilib, o‘quvchining individual mezonlarini qayta belgilamaslik']),
('d35bd047-1f02-4305-88c3-a10ccaa19a8f',array[
'Natijalar haqida suhbatlashmasdan, ota-onadan uy nazoratini kuchaytirishni talab qilish',
'Baholash mezonlarini tushuntirmasdan, suhbatni sinfdagi reyting haqidagi axborotga qaratish',
'Ota-ona fikrini eshitmasdan, mavjud bahoni o‘zgarmas qaror sifatida ko‘rsatish']),
('de6c80a4-96c0-46d6-86b9-7d83c4b871d6',array[
'Loyihada qatnashganlarni ish hajmiga qarab baholab, mazmuniy suhbatni tashkil etmaslik',
'Keyingi ish uchun buyruqlar ro‘yxatini uzaytirib, o‘quvchilar taklifini chetga surish',
'Tadbir suratlarini taqdim qilib, ekologik mas’uliyat va natijalarni tahlil qilmaslik']),
('dead68a9-6619-4244-94ce-8c12a8d96c0e',array[
'Teng imkoniyatni hamma uchun aynan bir xil baho qo‘yish bilan tenglashtiradi',
'Moslashtirish o‘rniga faqat ayrim o‘quvchilarga alohida dastur tuzishni majburiy deb hisoblaydi',
'O‘quv natijasini aniqlash uchun barcha o‘quvchini faqat umumiy testga jalb etadi']),
('df86a484-666e-470a-8e26-5205e5f3cd27',array[
'Natija 6/10 bo‘lgani uchun qayta aloqa o‘rniga faqat yakuniy reytingni tushuntirish',
'Xatolarni aniqlamasdan, o‘quvchiga keyingi ishni mustaqil topishni tavsiya qilish',
'Formulani to‘g‘ri tanlaganini aytib, birliklar xatosini muhokama qilmaslik']),
('edab125b-22ca-4045-99ae-8178040af3aa',array[
'Kabelni keyingi dars tugagach tekshirish uchun mas’ul xodimga topshirish',
'Qoqilish xavfini vaqtincha ogohlantirish bilan cheklab, mashg‘ulotni davom ettirish',
'Xavfsizlik haqida umumiy suhbat o‘tkazib, kabelning joylashuvini o‘zgartirmaslik']),
('fb854e85-12e5-4c45-bd26-556a70463eda',array[
'Sinf o‘rtachasi bilan bir marta solishtirib, vaziyatga qo‘shimcha aralashmasdan kutish',
'O‘quvchining bahosini vaqtincha o‘zgartirib, pasayish sabablarini tahlil qilmaslik',
'Barcha mavzular uchun bir xil qo‘shimcha topshiriqni belgilab, natijani qayta ko‘rmaslik']),
('0088a26c-143b-477f-ad59-e43205cb54df',array[
'O‘rganilgan atamaning ta’rifini turli shaklda takrorlab yodlashni',
'Nazariy mavzu yuzasidan umumiy og‘zaki savollarni ko‘paytirishni',
'Bilimni qo‘llashdan avval faqat yozma ta’rifni ko‘chirishni']),
('1250392e-7fc5-40cf-aade-8c52c24a9edc',array[
'Ha, ish taqsimlansa, vazifalar o‘zaro bog‘liq bo‘lishi shart emas',
'Ha, har bir o‘quvchi alohida ishlagan bo‘lsa, umumiy natija muhim emas',
'To‘liq, chunki guruh bir joyda o‘tirishi hamkorlikning yetarli belgisidir'])
on conflict(source_question_id) do nothing;
commit;