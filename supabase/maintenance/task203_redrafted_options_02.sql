-- TASK-203: production-proven AI-redrafted wrong options (2/4).
-- Replay script: do not auto-run as a Supabase migration.
-- This file is idempotent for an already-published source; it DOES NOT mutate
-- published immutable revisions. Correct keys and attempt history stay unchanged.
BEGIN;
DO $repair$
DECLARE item record; opt record; n integer; mn integer; mx integer; cw integer; max_wrong integer; uq integer; hits integer;
BEGIN
  FOR item IN SELECT * FROM (VALUES
('79000000-0000-4000-8000-000000000122'::uuid, ARRAY['Mustaqil ma’ruza usuli', 'Og‘zaki nazorat metodi', 'Suhbat orqali o‘qitish']::text[]),
('79000000-0000-4000-8000-000000000123'::uuid, ARRAY['Barcha uchun aynan bir xil topshiriqlar va ishlash vaqtini belgilash', 'Kuchli o‘quvchilarni boshqa sinfga o‘tkazib, qolganlarga umumiy topshiriq berish', 'Topshiriqlarni faqat sinfning o‘rtacha ko‘rsatkichiga qarab bir xil tanlash']::text[]),
('79000000-0000-4000-8000-000000000124'::uuid, ARRAY['Debat', 'Akvarium', 'Jigsaw']::text[]),
('79000000-0000-4000-8000-000000000125'::uuid, ARRAY['Cheklovlarni e’tiborsiz qoldirib, yagona yechimni barcha o‘quvchilarga majburlash uchun', 'O‘quvchilarga oldindan tayyor javobni berib, boshqa taxminlarni rad qilish uchun', 'Har bir yechimning dalilini emas, faqat yakuniy shaklini baholash uchun']::text[]),
('79000000-0000-4000-8000-000000000126'::uuid, ARRAY['Yangi atamalarni tez eslab qolish va qayta aytishni', 'Yakuniy ishlanmani nusxalash hamda tayyor andozaga muvofiqlashni', 'Ma’ruzadagi asosiy fikrlarni tinglash va tartib bilan yozishni']::text[]),
('79000000-0000-4000-8000-000000000127'::uuid, ARRAY['Blok-sxemaning ko‘rinishini o‘zgartirib, dastur kodini avvalgicha qoldirish', 'Dastur natijasini tahlil qilmay, faqat boshqa namunani yodlash', 'Qaysi qadam xato ekanini aniqlamasdan dastur matnini almashtirish']::text[]),
('79000000-0000-4000-8000-000000000128'::uuid, ARRAY['Har xil blok-sxemalarning tashqi ko‘rinishini baholab, kod yozishni keyinga qoldirish', 'Bir nechta tayyor kodni nusxalab, qanday ishlashini ko‘rsatmaslik', 'Matn va kod o‘rtasidagi bog‘lanishni tekshirmasdan, ularni alohida yodlash']::text[]),
('79000000-0000-4000-8000-000000000130'::uuid, ARRAY['Kompyuter tizimi resurslarini foydalanish samaradorligi bo‘yicha umumiy baholashni', 'Elektron fayllarning tashqi bezagini tezroq yakunlash va joylashtirishni', 'Dars vaqtini taqsimlash va amaliy topshiriqlarni rejalashtirishni']::text[]),
('79250000-0000-4000-8000-000000000201'::uuid, ARRAY['Mavzuga ko‘proq sarlavha qo‘yib, reja mazmunini kengaytirish', 'Faqat kerakli nazariy matnlarni darslikdan ko‘proq kiritish', 'Dars davomida ko‘rsatiladigan barcha slaydlar sonini oldindan belgilash']::text[]),
('79250000-0000-4000-8000-000000000202'::uuid, ARRAY['Yakuniy natijani yuqori baholab, topshiriqni mustaqil tuzatishga qaytmaslik', 'Topshiriqni keyingi bo‘limga o‘tkazib, avvalgi ko‘nikmani qayta tekshirmaslik', 'Jadval kiritish o‘rniga boshqa mavzudan umumiy baholash olish']::text[]),
('79250000-0000-4000-8000-000000000203'::uuid, ARRAY['Guruh ishini to‘xtatib, muloqot muammosini keyingi darsga qoldirish', 'Har ikkala tomonni sinf oldida tanqid qilib, vaziyatni tez yakunlash', 'Faqat jamoa natijasini baholab, ayrim o‘quvchi holatini hisobga olmaslik']::text[]),
('79250000-0000-4000-8000-000000000204'::uuid, ARRAY['Uchrashuvda boshqa o‘quvchilarning umumiy natijalarini ism bilan solishtirish', 'Sinfning barcha shaxsiy qaydlarini misol sifatida batafsil muhokama qilish', 'Turli bolalarning holatini oila roziligisiz umumiy guruhga yozish']::text[]),
('79250000-0000-4000-8000-000000000205'::uuid, ARRAY['Ta’lim muassasasini xo‘jalik jihatdan boshqarish', 'Maktab binolarini tashkiliy rejalashtirish jarayoni', 'Sinf xonasini jihozlash usullari']::text[]),
('79250000-0000-4000-8000-000000000206'::uuid, ARRAY['Ta’lim faqat bilim berish, tarbiya esa mutlaqo alohida faoliyat hisoblanadi', 'Tarbiya faqat oilada kechadi, maktab ta’limiga hech qanday aloqasi yo‘q', 'Shaxsning qadriyatlari faqat nazorat va baholar yordamida shakllanadi']::text[]),
('79250000-0000-4000-8000-000000000207'::uuid, ARRAY['Ko‘rgazmalilik va tasviriylik', 'Onglilik va faollik', 'Mustahkamlik va takrorlash']::text[]),
('79250000-0000-4000-8000-000000000208'::uuid, ARRAY['Faqat tayyor ma’lumotni ko‘chirish tezligini oshirishni', 'Vazifani mazmunini tushunmasdan yodlashga o‘tishni', 'Darsdan tashqari baholash shakllarini almashtirishni']::text[]),
('79250000-0000-4000-8000-000000000209'::uuid, ARRAY['Ma’ruza darsi', 'Nazorat darsi', 'Seminar darsi']::text[]),
('79250000-0000-4000-8000-000000000210'::uuid, ARRAY['Faqat barcha o‘quvchilarga bir xil baho berib, jarayonni o‘zgartirmaslikka', 'Natijalarni keyingi mavzuga o‘tguncha umuman qayta ko‘rib chiqmaslikka', 'Oldingi topshiriqlarni baholamasdan, yangi mazmunni tezroq boshlashga']::text[]),
('79250000-0000-4000-8000-000000000211'::uuid, ARRAY['Yig‘ilishdan keyin topshiriladigan hisobot shakli va hajmini oldindan belgilash', 'Sinfdagi boshqa o‘quvchilarning baholarini taqqoslash uchun ro‘yxat tuzish', 'Har bir ota-onani bir xil tartibda umumiy majlisga chaqirish']::text[]),
('79250000-0000-4000-8000-000000000212'::uuid, ARRAY['Tembr', 'Intonatsiya', 'Tafakkur']::text[]),
('79250000-0000-4000-8000-000000000213'::uuid, ARRAY['Pedagogik diagnostika', 'Pedagogik prognoz', 'Pedagogik nazorat']::text[])
  ) AS v(question_id, wrong_options)
  LOOP
    IF NOT EXISTS(SELECT 1 FROM public.questions WHERE id=item.question_id) THEN
      RAISE NOTICE 'TASK-203 absent optional seed: %',item.question_id;
      CONTINUE;
    END IF;
    IF EXISTS(SELECT 1 FROM public.questions WHERE id=item.question_id
      AND status='published'::public.content_status) THEN
      -- Published content is immutable: validate exact text parity, never update it.
      IF (SELECT array_agg(o.content_md ORDER BY o.order_idx)
          FROM public.question_options o JOIN public.question_keys k
            ON k.question_id=o.question_id
          WHERE o.question_id=item.question_id AND o.side='a'
            AND o.id::text<>(k.payload->>'correct_option_id')
      ) IS DISTINCT FROM item.wrong_options THEN
        RAISE EXCEPTION 'TASK-203 published content drift for %',item.question_id;
      END IF;
      CONTINUE;
    END IF;
    IF NOT EXISTS(SELECT 1 FROM public.questions WHERE id=item.question_id
      AND status='review'::public.content_status
      AND group_code IN ('KS','PM.GEN','PM.MET')
      AND format='Y1'::public.question_format)
      OR EXISTS(SELECT 1 FROM public.question_editorial_checks
        WHERE question_id=item.question_id) THEN
      RAISE EXCEPTION 'TASK-203 unexpected editable question state: %',item.question_id;
    END IF;
    n:=0;
    FOR opt IN
      SELECT o.id FROM public.question_options o
      JOIN public.question_keys k ON k.question_id=o.question_id
      WHERE o.question_id=item.question_id AND o.side='a'
      AND o.id::text<>(k.payload->>'correct_option_id')
      ORDER BY o.order_idx
    LOOP
      n:=n+1;
      UPDATE public.question_options SET content_md=item.wrong_options[n] WHERE id=opt.id;
    END LOOP;
    IF n<>3 THEN RAISE EXCEPTION 'TASK-203 expected three wrong options for %',item.question_id; END IF;
    SELECT min(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))),
      max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'))),
      max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
        FILTER(WHERE o.id::text=k.payload->>'correct_option_id'),
      max(cardinality(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+')))
        FILTER(WHERE o.id::text<>k.payload->>'correct_option_id'),
      count(DISTINCT lower(btrim(o.content_md))),
      count(*) FILTER(WHERE o.id::text=k.payload->>'correct_option_id')
      INTO mn,mx,cw,max_wrong,uq,hits
    FROM public.question_options o JOIN public.question_keys k ON k.question_id=o.question_id
    WHERE o.question_id=item.question_id;
    IF mx>mn*1.8 OR cw>max_wrong*1.25 OR uq<>4 OR hits<>1
    THEN RAISE EXCEPTION 'TASK-203 option/length gate failed for %',item.question_id; END IF;
  END LOOP;
END $repair$;
COMMIT;
