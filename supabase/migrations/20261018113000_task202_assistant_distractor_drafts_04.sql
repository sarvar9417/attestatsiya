-- TASK-202: KS old-revision distractor suggestions 31-40, unapproved.
begin;
insert into public.pedagogy_rewrite_proposals(source_question_id,proposed_distractors) values
('8681c75c-91dc-4a8c-8deb-4523bda39565',array[
'Faqat ota-onaning tavsiyasini qabul qilib, mutaxassis mulohazasini boshqa yig‘ilishgacha qoldirish',
'Mutaxassis qarorini o‘quvchi va uning oilasi bilan kelishmasdan darhol yagona reja sifatida qo‘llash',
'Kelishmovchilikda yordam rejasini tuzmasdan, barcha tomonlarning fikri tenglashishini kutib turish']),
('88bb73ab-11b5-4a58-be6f-9e2580841032',array[
'Maqsadga yetish uchun o‘quvchilar tushunchalarni ko‘proq yod olishi va ularni qayta aytishi yetarli',
'Faoliyat va baholash bir xil bo‘lgani uchun reja maqsaddagi tahlil talabiga ham mos keladi',
'Darsda ta’rif eslash ko‘p mashq qilingani sababli baholash bosqichini qo‘shimcha murakkablashtirish zarur emas']),
('963717dd-c758-4057-8621-05238b92bc52',array[
'O‘quvchining olgan baholarini boshqa o‘quvchilar baholari bilan taqqoslashiga',
'O‘quvchining yangi ma’lumotni qancha vaqtda eslab qolganini aniqlashiga',
'O‘qituvchi bergan topshiriqlar sonini aniq hisoblab, umumiy jadval tuzishiga']),
('992bb41b-8201-4e64-bc5f-166f1288ab09',array[
'Faol qatnashish o‘quvchilarning bilim olganini ko‘rsatadi, shuning uchun maqsadni o‘zgartirish shart emas',
'O‘yin barcha o‘quvchilarni jalb qilgani uchun dars mazmunini undan keyin ham yoritmaslik mumkin',
'Metod zamonaviy bo‘lgani sababli uni baholash mezonlari bilan bog‘lash keyingi darsga qoldiriladi']),
('b41963b6-c602-47ab-8a03-85e82ba5f9c8',array[
'Avvalgi dars rejasini saqlab, sinfning barcha o‘quvchilariga bir xil qo‘shimcha vazifalar belgilash',
'Dars sur’atini oshirib, o‘zlashtirmagan o‘quvchilarga mavzuni uyda yakka tartibda o‘rganishni topshirish',
'Diagnostika natijasini yakuniy bahoga qo‘shib, o‘qitish mazmuni va mashq tartibini o‘zgartirmaslik']),
('bedabf19-18e8-4368-8234-453c52ef9a9a',array[
'Vazifani eng tez o‘quvchiga berib, qolganlarga faqat jarayonni kuzatishni topshirish',
'Guruhning ishini bir o‘quvchiga topshirib, qolganlardan yakuniy hisobotni ko‘chirib yozishni talab qilish',
'Umumiy ish natijasini faqat eng faol o‘quvchining bajarish tezligi asosida baholash']),
('c593ff16-733b-4966-ae7d-01bbdf96593a',array[
'Xatoni o‘qituvchi o‘zi tuzatib, o‘quvchiga tayyor javobni takrorlab yozdirish',
'Bir xil turdagi nazorat savollarini ko‘paytirib, xatoning qanday yuzaga kelganini tahlil qilmaslik',
'O‘quvchi javobini sinfdagilar bilan solishtirib, unga umumiy past baho qo‘yish']),
('c9f321e4-be11-4091-aa09-1f51233d5430',array[
'Jamoa fikrini birlashtirish uchun barcha tomonlarga o‘quvchi haqidagi to‘liq axborotni yuborishni',
'Vaqtni tejash uchun maxfiy ma’lumotlarni tegishli vazifaga aloqasi bo‘lmagan hamkasblar bilan ham ulashishni',
'Hamkorlik bo‘lsa, o‘quvchining shaxsiy ma’lumotlarini alohida roziliksiz umumiy guruhga chiqarishni']),
('ca8461ef-aca6-4e76-a61b-a9952b821f3f',array[
'Avval aybdorni aniqlab, barcha tomonlarga bitta qat’iy jazo qo‘llash',
'Tomonlarning harakatini muhokama qilmasdan, nizoni tezroq yakunlangan deb e’lon qilish',
'Nizo sababini faqat dars jadvaliga bog‘lab, o‘quvchilarning fikrini chetga surish']),
('ce5dc496-b4a2-4038-b541-b451cd12bbef',array[
'O‘qituvchi nazariyani batafsilroq tushuntirib, amaliyotni keyingi haftaga qoldirishi',
'O‘quvchilarga mustaqil mashqsiz ko‘proq tayyor dastur namunalarini ko‘rsatishi',
'Har bir mavzuni og‘zaki bayon qilib, amaliy bajarishni faqat baholashda talab qilishi'])
on conflict(source_question_id) do nothing;
commit;