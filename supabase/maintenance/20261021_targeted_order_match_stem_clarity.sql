-- Editorial scope: twelve individually reviewed published Y2/Y3 prompts.
-- No answer keys, option IDs, selection rules or scoring metadata changed.
-- Exact-stem preconditions avoid overwriting concurrent editor updates.
with edits(question_id, old_stem, new_stem) as (
values
  ('03fe7137-524c-4936-b1c1-70633af8cfb9'::uuid, 'Uch xil siklni shartni tekshirish usuli bilan moslashtiring.', 'Chapdagi uch xil sikl turini o‘ngdagi bajarilish yoki shartni tekshirish xususiyati bilan moslashtiring. Har bir siklga unga xos bitta ta’rifni tanlang.'),
  ('e2910000-0000-4000-8000-000000000011'::uuid, 'Grafik muharrirdagi amallarni ularning oqibati bilan moslashtiring.', 'Chapdagi Zoom, Crop, Resize va Canvas size buyruqlarini o‘ngdagi tasvirga ta’siri bilan moslashtiring. Piksel soni, ishchi maydon va ekrandagi ko‘rinish o‘zgarishini farqlang.'),
  ('2082660e-a258-574d-91e7-8c30e358eed0'::uuid, 'Modellarni ifodalash shakli, 2-to‘plam: to‘rtta tasvirni ularning asosiy model turi bilan moslashtiring.', 'Modellarni ifodalash shakli, 2-to‘plam: chapdagi to‘rtta vaziyatni o‘ngdagi model turi (moddiy, matematik, verbal, grafik) bilan moslashtiring. Har bir vaziyat uchun qanday ifodalash usuli ishlatilganini aniqlang.'),
  ('72064360-3f8c-42d0-a93e-bbc0cb2a6265'::uuid, 'Baholash va qayta aloqa siklini tartiblang.', 'Baholash va qayta aloqa siklining amallarini vaqt bo‘yicha tartiblang: avval o‘quvchi faoliyatidan dalil yig‘ishdan boshlang, dalilni tahlil qiling, keyingi qadamga yo‘naltiruvchi fikr bildiring va so‘ng progressni kuzating.'),
  ('56a12955-c724-4a9a-accf-cc2461ec37b1'::uuid, 'Darsni metodik tahlil qilish jarayonini tartiblang.', 'Kuzatilgan darsni metodik tahlil qilish bosqichlarini ishning bajarilish ketma-ketligida joylashtiring: dalil yig‘ishdan boshlab maqsad bilan taqqoslash, muammoning sababini aniqlash va takomillashtirish tavsiyasigacha.'),
  ('a9057034-7beb-408a-94d4-310ba72a9fe0'::uuid, 'Fayl uzatish vaqtini hisoblash bosqichlarini to‘g‘ri tartiblang.', 'Faylni uzatish vaqtini t = I / v orqali hisoblashdagi amallarni bajarilish ketma-ketligida joylashtiring: avval hajm va tezlik birliklarini aniqlang, keyin birliklarni moslang, vaqtni hisoblang va natijani tekshiring.'),
  ('c46c5954-023f-42fe-a83c-ce711579da0a'::uuid, 'Taqdimotni tayyorlashning mantiqiy ketma-ketligini tartiblang.', 'Taqdimot yaratish jarayonidagi ishlarni boshlanishdan yakungacha tartiblang: maqsad va auditoriyani aniqlash, slayd mazmunini tuzish, vizual/animatsiya qo‘shish va namoyishni tekshirish tartibiga amal qiling.'),
  ('b01fd173-9b76-40c4-af34-78a066dd6b60'::uuid, 'Masaladan algoritm tuzish jarayonini tartiblang.', 'Masaladan ishlaydigan algoritm tuzish uchun bosqichlarni bajarilish tartibida joylashtiring: maqsad va kirish/chiqishdan boshlang, shart yoki formulani belgilang, algoritm amallarini yozing va sinov ma’lumoti bilan tekshiring.'),
  ('336b7ad1-314f-4b2b-98cc-bd1e721b4b64'::uuid, 'Qiymatlarni tekshirish bosqichlarini tartiblang.', 'Berilgan dastur uchun sinov qiymatlarini tekshirish bosqichlarini ish tartibida joylashtiring: avval chegaraviy kirishni tanlang, kutilgan natijani hisoblang, haqiqiy natijani oling va ikkisini taqqoslang.'),
  ('f371d698-c17e-48ab-b6df-31f1624dc300'::uuid, 'EKUB(28,12) ayirish jarayonini tartiblang.', 'EKUB(28,12) ni Evklidning ayirish usuli bilan topishda hosil bo‘ladigan (a,b) juftliklarni birinchi holatdan oxirgi holatgacha ketma-ket joylashtiring. Har safar katta sondan kichik son ayriladi; tenglashganda jarayon tugaydi.'),
  ('ed169926-b3e4-1b3a-14b4-98f67121e190'::uuid, 'Vebga kirish: berilgan bosqichlarni to‘g‘ri tartiblang.', 'Brauzerda URL kiritilgandan so‘ng veb-sahifadan HTTP javobi olinishi jarayonini vaqt bo‘yicha tartiblang. Kerak bo‘lsa domen nomini DNS orqali aniqlashni ham hisobga oling.'),
  ('fc3edbc6-11f2-0ea3-0e38-fe9a5f16a9e6'::uuid, 'CTR hisobini izohlash bosqichlarini tartiblang.', 'Reklamaning CTR (click-through rate) ko‘rsatkichini hisoblash va izohlashni amaliy tartibda joylashtiring: ko‘rsatishlar va bosishlarni aniqlash, (bosishlar / ko‘rsatishlar) × 100 foizni hisoblash va maqsad bilan solishtirish.')
), updated as (
  update public.questions q
     set stem_md = e.new_stem, updated_at = now()
    from edits e
   where q.id = e.question_id and q.stem_md = e.old_stem
     and q.status = 'published'::public.content_status
     and q.format in ('Y2'::public.question_format,'Y3'::public.question_format)
   returning q.id
)
select count(*) as updated_question_count from updated;
