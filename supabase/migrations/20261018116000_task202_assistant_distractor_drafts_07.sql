-- TASK-202: PM.GEN pedagogical foundations, private revision suggestions only.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors) values
('75000000-0000-4000-8000-000000000015',array[
'O‘quvchilarning yoshiga doir psixologik rivojlanish davrlarini o‘rganadi',
'Maktab jamoasining moliyaviy va tashkiliy boshqaruv tizimini o‘rganadi',
'Pedagoglarning xizmat faoliyati va ish yuritish hujjatlarini o‘rganadi']),
('75000000-0000-4000-8000-000000000019',array[
'Maktab tadbirlari sonini va ularning davomiyligini muntazam oshirish',
'O‘quvchilarning jismoniy chiniqishi va harakat ko‘nikmalarini rivojlantirish',
'O‘quvchilarning badiiy didi va estetik idrokini rivojlantirish']),
('75000000-0000-4000-8000-000000000021',array[
'Oldingi bo‘limdagi barcha mashqlarni takroran nazoratdan o‘tkazish',
'O‘tilgan mavzular bo‘yicha faqat umumiy baholarni e’lon qilish',
'O‘quvchilarning uy vazifalarini tartib bo‘yicha qayta ko‘rib chiqish']),
('75000000-0000-4000-8000-000000000022',array[
'Chalg‘igan o‘quvchilarni barcha faoliyatdan chetlatib, darsni davom ettirish',
'Vazifani tushuntirmasdan, sinfga umumiy past baho qo‘yish',
'Barcha o‘quvchilarni ogohlantirib, faqat o‘qituvchi monologini uzaytirish']),
('75000000-0000-4000-8000-000000000023',array[
'Faqat ota-onalar yig‘ilishining tashkiliy vaqti va joyini belgilash',
'O‘quvchining natijalarini sinf chatida boshqa bolalar bilan taqqoslash',
'Ota-onalarga maktabdagi barcha ma’muriy qarorlarni mustaqil topshirish']),
('75000000-0000-4000-8000-000000000024',array[
'O‘quvchi haqidagi to‘liq xabarni sinf jamoasi bilan cheklovsiz ulashish',
'Ota-onaning fikrini bilmasdan, shaxsiy tafsilotlarni hamma uchun oshkor qilish',
'Muammoni izohlamasdan, barcha nozik hujjatlarni umumiy guruhga joylash']),
('75000000-0000-4000-8000-000000000025',array[
'Pedagogning mavzuni og‘zaki tarzda juda batafsil tushuntira olishi',
'O‘qituvchining barcha sinflarda bir xil uslubni qat’iy qo‘llashi',
'Sinfdagi barcha baholash qarorlarini faqat qoidaga tayanib e’lon qilish']),
('75000000-0000-4000-8000-000000000026',array[
'Noto‘g‘ri javob uchun o‘quvchini sinf oldida batafsil tanqid qilish',
'Xatoni tushuntirmasdan, o‘quvchini boshqa sinfdoshining natijasi bilan taqqoslash',
'Javobni baholashdan oldin o‘quvchiga ogohlantirish berib, savolni yakunlash']),
('75000000-0000-4000-8000-000000000030',array[
'Topshiriqni faqat og‘zaki ko‘rsatma bilan bajarishni majburiy qilish',
'O‘quvchini raqamli ishlarning barchasidan vaqtincha chetlatish',
'Matn o‘lchamini o‘zgartirmasdan, topshiriq hajmini ko‘paytirish']),
('7e8bc4c2-f3f8-4787-b1bd-e7c9763561d1',array[
'Vazifani o‘zgartirmasdan, shovqinni faqat ogohlantirish orqali kamaytirish',
'Barcha guruhlarni tarqatib, yakuniy natijani faqat o‘qituvchi bajarishi',
'Guruh ishiga ajratilgan vaqtni mezonlarsiz yana uzaytirib qo‘yish'])
on conflict(source_question_id) do nothing;
commit;