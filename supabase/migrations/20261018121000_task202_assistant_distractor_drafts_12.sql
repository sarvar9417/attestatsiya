-- TASK-202: last eight of 118 published Y1 length-bias remediation suggestions.
-- PRIVATE assistant-authored drafts; NOT human editorial checks and NOT learner-published.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors)
values
('a824eddf-4cb7-425f-af04-f707a2d1148f',array['O‘quvchilar bilan mavzuni o‘tishda vosita va resurslarni tanlash tartibi','Dars mazmunini taqvim rejasida bosqichlarga ajratish va vaqt belgilash jarayoni','O‘quvchilarning tayyor bilimlarini nazorat qilish va natijalarni qayd etish tartibi']),
('b59202a1-03c5-43fb-a50f-5c6b56e17dd3',array['Ha, tajribali kuzatuvchining umumiy fikri yetarli bo‘ladi','Ha, o‘quvchilarning umumiy taassuroti asosiy mezon sanaladi','Ha, kuzatuvchining tajribasi belgilangan mezonlardan ustun turadi']),
('bfe57daa-d49b-4dd8-b334-86064390f054',array['O‘quv topshiriqlarini yengillashtirib, o‘tish vaqtini avvalgidek qoldirish va kuzatish','Darsning kirish qismiga ko‘proq vaqt ajratib, asosiy faoliyatni qisqartirish','Sinfning ishlash tezligini kuzatib, faqat baholash vaqtini qayta belgilash']),
('c32c8bba-de1d-4a83-971d-6484d04cb4f7',array['O‘quvchining mavzuga doir zarur atamalarni eslab qolish faoliyati','O‘quvchining tayyor ko‘rsatma yordamida javobni qayta ifodalash faoliyati','O‘quvchining o‘qituvchi yondashuvini kuzatib yozib borish faoliyati']),
('c7e312b0-ccfa-4968-a53d-0df6851cc8eb',array['Ha, o‘quvchilar doskadagi elektron topshiriqlarni kuzatsa ham yetarli','Ha, texnik imkoniyatlarning ko‘pligi o‘quvchi muloqotini to‘liq almashtiradi','Yo‘q, doskaning internetga ulanishi bo‘lmasa interfaol dars bo‘lmaydi']),
('dda13b50-a79c-43c7-80d9-a44df5550364',array['Murakkab kodlar o‘rniga qisqa ta’riflarga ko‘proq vaqt ajratib tushuntirish','Faqat namuna ko‘rsatish bosqichini kengaytirib, mashq vaqtini o‘zgarishsiz qoldirish','Mustaqil ishga ketgan vaqtni qisqartirib, nazariy bayon bosqichini ko‘paytirish']),
('e0eed6fa-689c-4076-8d4b-f7aa46bdf5c3',array['O‘qituvchi eng yaxshi biladigan metodni barcha vaziyatlarga birday tatbiq qilish orqali','Dars vaqtini eng ko‘p tejaydigan usulni barcha mavzularda ustuvor tanlash orqali','Eng ko‘p ko‘rgazmali materiallardan foydalanish mumkin bo‘lgan variantni tanlash orqali']),
('fc725c05-2bfc-4664-83b6-63edca43cb4c',array['Ha, alohida o‘quvchilar yonma-yon o‘tirib ishlasa ham guruh metodi to‘liq bajariladi','Ha, sinfni kichik guruhlarga ajratishning o‘zi o‘zaro hamkorlik natijasini kafolatlaydi','Yo‘q, interfaol guruh ishida o‘qituvchi hech qanday yordam yoki yo‘naltirish bermasligi kerak'])
on conflict(source_question_id) do nothing;
commit;
