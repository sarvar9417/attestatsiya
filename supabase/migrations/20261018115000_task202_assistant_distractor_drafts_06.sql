-- TASK-202: PM.GEN original review distractor proposals; no auto-publication.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors) values
('15a68921-4bcf-4d57-8969-e0a87f18c10a',array[
'Nutqdagi ilmiy atamalar sonini oshirib, mavzuni yanada batafsil bayon qilish',
'Dars vaqtini tejash uchun tushuntirish tezligini saqlab, savollarni keyinga qoldirish',
'Ko‘rgazma sonini ko‘paytirib, og‘zaki nutqdagi aniqlikni ikkinchi o‘ringa qo‘yish']),
('167a3be6-e1b5-43db-8a0b-1101f0703b18',array[
'Didaktik qobiliyat kuchli, akademik qobiliyat yetarli emas',
'Tashkilotchilik qobiliyati kuchli, kommunikativ qobiliyat yetarli emas',
'Perseptiv qobiliyat kuchli, metodik qobiliyat yetarli emas']),
('19b5bd00-98f1-4270-a907-60fab73b9680',array[
'Sinfdagi intizomni mustahkamlashda baholash natijalarini yagona boshqaruv omili deb hisoblaydi',
'Jazo qo‘llanganidan keyin vazifalar mazmuni va o‘quvchilar ishtirokini takomillashtirish shart emasligini nazarda tutadi',
'Tartib buzilishi sababi o‘rganilmasdan ham umumiy jazo orqali faollikni oshirish mumkinligini qabul qiladi']),
('1ee58969-03af-431b-956d-9059591961b1',array[
'Ha, ilmiy terminlarni ko‘p ishlatishning o‘zi mavzuni to‘liq o‘zlashtirishni kafolatlaydi',
'Ha, nutq ilmiy bo‘lsa, uning o‘quvchi yoshiga mosligi muhim mezon hisoblanmaydi',
'Yo‘q, tushunarlilik uchun pedagog ilmiy tushunchalarni umuman ishlatmasligi va ularni izohlamasligi kerak']),
('22482aa6-874d-4473-a1b2-97963ee83930',array[
'Ha, pedagogning subyektiv qoniqishi refleksiyaning boshqa dalillaridan ko‘ra yetarli asos bo‘ladi',
'Ha, dars o‘tganligi qayd etilgan bo‘lsa, keyingi rivojlanish qadamlarini aniqlash shart emas',
'Yo‘q, refleksiya uchun o‘quvchilarning baholarini solishtirishning o‘zi har doim yetarli bo‘ladi']),
('36ab0f31-8663-497e-b345-d409ce84f49b',array[
'Tashkilotchilik qobiliyati yaxshi, perseptiv qobiliyat yetarli emas',
'Akademik qobiliyat yaxshi, didaktik qobiliyat yetarli emas',
'Kommunikativ qobiliyat yaxshi, irodaviy qobiliyat yetarli emas']),
('38a8f7b5-c720-458f-b159-37249f9e30f3',array[
'O‘quvchilar individual xususiyatlari va yosh davrlaridagi rivojlanish qonuniyatlarini',
'Maktabni moliyalashtirish usullari va muassasani boshqarishning tashkiliy me’yorlarini',
'O‘quvchilar jismoniy rivojlanish ko‘rsatkichlari va sog‘liqni muhofaza qilish mezonlarini']),
('3cc4365a-1b71-4ad5-9975-831f634133f2',array[
'O‘quvchilarning yoshini hisobga olmasdan, ilmiy atamalar sonini ko‘paytirib tushuntirish berish',
'Abstrakt tushuntirishni qayta takrorlab, misollarni va ko‘rgazmali modellarni keyingi darsga qoldirish',
'Mavzuning barcha murakkab qismlarini bir vaqtning o‘zida berib, tushunishni faqat test bilan tekshirish']),
('5ece5201-0728-4346-866d-153b8d251854',array[
'Akademik va tashkilotchilik qobiliyati',
'Kommunikativ va irodaviy qobiliyat',
'Tashkilotchilik va ijodiy qobiliyat']),
('5f14d596-2e8e-47b0-bb83-d19b2baa7d26',array[
'Metod barcha yosh guruhlarida o‘zgarmas natija berishi kerakligi sababli baholash mezonlari xato',
'Tanlangan metodni istalgan yoshdagi o‘quvchilarga moslashtirishsiz qo‘llash mumkinligi natijalar bilan isbotlangan',
'Ikki guruhning natijasi farqli bo‘lsa, metodni yosh omillaridan mustaqil ravishda batamom rad etish zarur'])
on conflict(source_question_id) do nothing;
commit;