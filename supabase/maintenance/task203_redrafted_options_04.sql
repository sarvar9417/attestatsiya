-- TASK-203: production-proven AI-redrafted wrong options (4/4).
-- Replay script: do not auto-run as a Supabase migration.
-- This file is idempotent for an already-published source; it DOES NOT mutate
-- published immutable revisions. Correct keys and attempt history stay unchanged.
BEGIN;
DO $repair$
DECLARE item record; opt record; n integer; mn integer; mx integer; cw integer; max_wrong integer; uq integer; hits integer;
BEGIN
  FOR item IN SELECT * FROM (VALUES
('79300000-0000-4000-8000-000000000318'::uuid, ARRAY['Indeks xatosini ko‘rmasdan, butun kodni boshidan yozib chiqdingmi?', 'Ro‘yxat tarkibini tekshirmasdan, qiymatlarni tartib bilan o‘zgartirdingmi?', 'Xato satrini aniqlamasdan, boshqa dastur nusxasini ishlatdingmi?']::text[]),
('79300000-0000-4000-8000-000000000319'::uuid, ARRAY['Faol ikki o‘quvchiga murakkab vazifalarni to‘liq topshirib, boshqalarni kuzatuvchi qoldirish', 'Har bir guruhdagi natijani kim bajarganini ajratmay bir xil baholash', 'Jamoa ishini butunlay bekor qilib, faqat yakka ma’ruza bilan cheklanish']::text[]),
('79300000-0000-4000-8000-000000000320'::uuid, ARRAY['Dars davomida vaqtni o‘lchamasdan, barcha materialni avvalgidek davom ettirish', 'Faqat tushuntirishga vaqt ajratib, amaliy mashqlarni keyinroqqa qoldirish', 'Yakuniy baholashni bekor qilib, dastlabki maqsadlarni o‘zgartirmasdan saqlash']::text[]),
('79300000-0000-4000-8000-000000000321'::uuid, ARRAY['Boshqalarning tayyor mahsulotidan foydalanishni muhokamasiz davom ettirishga imkon berish', 'Barcha o‘quvchilarni bir xil jazolab, mualliflik masalasini tushuntirmaslik', 'Loyiha mazmunini chetga surib, faqat ko‘rgazma sifatini baholash']::text[]),
('79300000-0000-4000-8000-000000000322'::uuid, ARRAY['Faqat taqdimotdagi slaydlar soni va bezaklarning sifat ko‘rsatkichlaridan', 'Yakuniy loyiha faylining hajmi va texnik ko‘rinishidan xulosa chiqarish', 'Faqat guruhdagi o‘quvchilarning darsga kelgan kunlarini hisoblashdan']::text[]),
('79300000-0000-4000-8000-000000000323'::uuid, ARRAY['Seminarda qatnashgani haqida hujjat yig‘ib, metodni darsda sinamaslik', 'Yangi usulning nomini rejasiga yozib, natijani tahlil qilmaslik', 'Metod o‘rniga sinf jihozlarini almashtirib, pedagogik faoliyatni baholamaslik']::text[]),
('79300000-0000-4000-8000-000000000324'::uuid, ARRAY['Yozuvdagi o‘quvchilar tasvirini barcha ochiq onlayn guruhlarga joylashtirish', 'Videodan ayrim lavhalarni rozilik olmasdan namoyish qilishga qaror berish', 'Shaxsiy ma’lumotlar aks etgan qismni darsda hammaga ko‘rsatib muhokama qilish']::text[]),
('79300000-0000-4000-8000-000000000325'::uuid, ARRAY['Hamkasblarga yagona platformani sinab ko‘rmasdan darhol majburiy joriy qildirish', 'Fikrlar farqini muhokama qilmasdan, barcha loyihalarni vaqtincha to‘xtatib turish', 'Platformani baholash o‘rniga hamkasblarning shaxsiy qarashlarini omma oldida tanqid qilish']::text[]),
('79300000-0000-4000-8000-000000000326'::uuid, ARRAY['Bolaning xatolarini sinfdoshlar natijalari bilan taqqoslab, oldida tanbeh berish', 'Qiyinchilik sabablarini aniqlamasdan, ota-onaga umumiy keskin ogohlantirish yuborish', 'Suhbatda faqat salbiy baholarni sanab, yordam rejasini muhokama qilmaslik']::text[]),
('79300000-0000-4000-8000-000000000327'::uuid, ARRAY['Har bir mavzuda bezakli animatsiyalar sonini imkon qadar ko‘paytirish', 'Mavzuga bog‘lanmagan rangli slaydlarni ko‘rsatish orqali e’tiborni oshirish', 'Raqamli vositaning dizaynini tanlab, o‘quvchi faoliyatini e’tibordan chetda qoldirish']::text[]),
('79300000-0000-4000-8000-000000000328'::uuid, ARRAY['Topshiriqdan oldin umumiy baholar sonini oshirib, mavzuni yakunlash', 'Avval qiyinchilikni tushunmasdan, barcha o‘quvchilarga bir xil nazorat berish', 'Diagnostika o‘rniga faqat yakuniy test natijasini hisoblash bilan cheklanish']::text[]),
('79300000-0000-4000-8000-000000000329'::uuid, ARRAY['O‘quvchini bo‘ysundirishga qaratilgan keskin intizomiy ogohlantirish', 'O‘quvchi javobini tinglamasdan darhol summativ baholash', 'Qiyinchilikni muhokama qilmasdan mavzuni tez yakunlash']::text[]),
('79300000-0000-4000-8000-000000000330'::uuid, ARRAY['Eng ommalashgan va yangi nomga ega metodni darhol tanlash', 'O‘qituvchiga avvaldan yaxshi tanish bo‘lmagan metodni ishlatish', 'Taqdimotda mavjud rasm va slaydlar soniga qarab metod belgilash']::text[]),
('81b34a2e-c7a0-4506-8f11-c037cdcb490b'::uuid, ARRAY['Yangi usulni natijani ko‘rmasdan boshqa darslarga majburiy tatbiq qilish', 'Usul ishlatilganini tasdiqlovchi hujjatlarni yig‘ib, natijani tekshirmaslik', 'Hamkasb yondashuvini yangi sinfga xuddi shu shaklda ko‘chirish']::text[]),
('92a2be61-074a-483e-96f7-cb9095273c76'::uuid, ARRAY['Ota-onani tanqid qilib, o‘zlashtirish pasayishiga faqat oilani sabab qilish', 'Qiyinchilikni boshqa o‘quvchilar oldida muhokama qilib, oila bilan gaplashmaslik', 'Sabablarni tahlil qilmasdan bahoni pasaytirish va umumiy ogohlantirish yuborish']::text[]),
('b13f58c3-5907-48f3-922c-6dfe6a325e07'::uuid, ARRAY['Dars mavzusining sarlavhasini qayta yozib, umumiy taassurotni yakuniy xulosa qilish', 'Faqat sinfda qatnashgan o‘quvchilar sonini hisoblab, keyingi rejalarga tegmaslik', 'Darsdagi muammolarni tahlil qilmasdan, keyingi mavzuni avvalgidek davom ettirish']::text[]),
('c3d2cc91-fc2b-4f06-a972-2574783dd9a3'::uuid, ARRAY['Onglilik hamda faol ishtirok', 'Tizimlilik va mantiqiy izchillik', 'Ko‘rgazmalilik va tasviriy taqdimot']::text[]),
('ecfd15a4-72c7-4c42-a47a-9679f8064472'::uuid, ARRAY['Faqat salbiy holat yuzaga kelganda ota-onaga keskin ogohlantirish yuborish', 'O‘quvchi rivoji bo‘yicha qarorlarni ota-onasiz bir tomonlama qabul qilish', 'Uchrashuvda boshqa bolalarning bahosini misol qilib birga muhokama qilish']::text[]),
('f625ec26-0621-46e9-8678-2c3ba7b7673e'::uuid, ARRAY['Pedagogik nazorat', 'Pedagogik diagnostika', 'Pedagogik prognoz']::text[])
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
