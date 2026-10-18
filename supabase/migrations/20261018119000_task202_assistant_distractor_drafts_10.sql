-- TASK-202: PM.MET methodological distractor drafts 91-100.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors) values
('0cc054bc-f0c9-49c3-a1f9-b06ea6c6ddd9',array[
'Fan maqsadi, o‘quvchilar soni va sinf jadvali',
'Pedagog tajribasi, sinf tarkibi va maktab jihozlari',
'Dars davomatini hisoblash va baholarni qayd etish']),
('14494b73-3eef-475c-a161-3549d4eda563',array[
'Nazariy atamalar sonini oshirib, baholashni asosan yoddan eslashga qaratish',
'Amaliy topshiriqlarni keyingi mavzuga qoldirib, ma’ruza vaqtini yana uzaytirish',
'Dars rejasidagi mashqlarni o‘zgartirmasdan, faqat baholash varaqasini batafsil qilish']),
('27922a21-5cf6-4260-8429-db04350113cd',array[
'Metodik tizimning maqsad-vosita mosligi',
'Metodik tizimning mazmun-tarbiya mosligi',
'Metodik tizimning shakl-jadval mosligi']),
('2956fa8c-9c66-4238-8a7e-bf200f8fe747',array[
'Kuzatilgan faoliyatga ko‘proq vaqt ajratib, tahlilni yana og‘zaki davom ettirish',
'Tahlil jarayonida darslik mavzusini ko‘proq qayta aytish zarurligini ko‘rsatadi',
'Baholashda shaxsiy taassurot muhim bo‘lgani sababli boshqa mezonni ikkinchi o‘ringa qo‘yadi']),
('39463300-9582-4efe-89f1-aae146e487ca',array[
'O‘qituvchining uzluksiz tushuntirishi va namoyishi',
'Atamalarni takrorlash va individual yodlash',
'Yozma nazoratni tashkil qilish va tekshirish']),
('3e81acfd-4933-46b6-b984-d7b5ccd8b409',array[
'Faqat o‘qituvchining nutqi va materialning hajmi to‘g‘risidagi ma’lumotlarni',
'Birinchi navbatda maktab jadvali va o‘quvchilar davomatining umumiy natijasini',
'Fan dasturidagi boblar soni va ko‘rgazmali jihozlarning texnik imkoniyatlarini']),
('4c401d6d-8ae2-477e-b9dd-a3dd328bf3f8',array[
'Fan mazmunini tanlashning asosiy davlat me’yori yoki normativ hujjati',
'O‘quvchilarning yillik rivojlanishini baholovchi yakuniy o‘lchov vositasi',
'Maktabning barcha darslarni tashkil etish uchun tuzgan ish jadvali']),
('6d505c16-6b83-4c8d-ab8c-585b2b870083',array[
'Kuzatuvchini shaxsiy fikrini qat’iyroq aytib, o‘qituvchining xarakterini batafsil ta’riflashga undash',
'O‘qituvchining xarakteri haqida ko‘proq ma’lumot to‘plab, darsdagi aniq vaziyatlarni ikkinchi o‘ringa qo‘yish',
'Kuzatuv natijasini faqat umumiy bahoga aylantirib, uni metodik yechimlar bilan bog‘lamaslik']),
('6eb58030-8962-4608-8067-6f941466a1e0',array[
'Baholash umumiy maqsadga to‘liq mos, chunki individual nazorat ham guruhdagi bilimni ko‘rsatadi',
'Test terminlarni qamrab olgani uchun hamkorlik mahoratini ham bevosita baholash mumkin bo‘ladi',
'Vazifa murakkab bo‘lsa, baholash shakli maqsadning barcha tomonlarini qamrab olishi shart emas']),
('75000000-0000-4000-8000-000000000031',array[
'Qachon va qancha dars o‘tilishini tashkiliy hisoblashni',
'Maktabning moddiy bazasini rivojlantirish rejasini tuzishni',
'Informatika xonasidagi qurilmalarni texnik jihatdan ta’mirlashni'])
on conflict(source_question_id) do nothing;
commit;