-- TASK-203: production-proven AI-redrafted wrong options (1/4).
-- Replay script: do not auto-run as a Supabase migration.
-- This file is idempotent for an already-published source; it DOES NOT mutate
-- published immutable revisions. Correct keys and attempt history stay unchanged.
BEGIN;
DO $repair$
DECLARE item record; opt record; n integer; mn integer; mx integer; cw integer; max_wrong integer; uq integer; hits integer;
BEGIN
  FOR item IN SELECT * FROM (VALUES
('48cdf0b9-0fd7-4e1b-a810-33388a731cb7'::uuid, ARRAY['Perseptiv kuzatish qobiliyati', 'Tashkilotchilikni namoyon qilish qobiliyati', 'Muloqotdagi kommunikativ qobiliyat']::text[]),
('49b79465-7cdd-4929-8c61-7188fae22c87'::uuid, ARRAY['Ko‘rgazmalilik va tasviriylik', 'Ilmiylik va asoslanganlik', 'Tizimlilik va izchillik']::text[]),
('6982071a-cefa-4596-8892-828a4f6e4f59'::uuid, ARRAY['Algoritmning faqat tayyor kod variantlarini misol sifatida takrorlatish', 'Xato natija chiqqanda yechimini o‘qituvchi ko‘rsatib, muhokamani qisqartirish', 'Qadamlarni tahlil qilmasdan ta’rif va buyruqlarni alohida yodlatish']::text[]),
('79000000-0000-4000-8000-000000000101'::uuid, ARRAY['Dars yakunida o‘quvchilar o‘qituvchi ko‘rsatgan kodga qiziqishi ortadi', 'Mavzu bo‘yicha ko‘plab yangi tushunchalarni bilib olishi kutiladi', 'Mashg‘ulot davomida taqdimot slaydlari puxta va tushunarli tayyorlanadi']::text[]),
('79000000-0000-4000-8000-000000000102'::uuid, ARRAY['Darsga ajratilgan jihozlar va xona holatining sifat ko‘rsatkichlari', 'Loyiha taqdimotidagi slaydlar soni va tashqi bezak sifati', 'Yakuniy mahsulotning umumiy ko‘rinishi va elektron format turi']::text[]),
('79000000-0000-4000-8000-000000000103'::uuid, ARRAY['Ikki o‘quvchiga bir xil mashqni qayta bajarishni tavsiya qilish', 'Avval o‘quvchilarni solishtirib, umumiy sinf reytingini eslatib qo‘yish', 'Faqat umumiy ballni ko‘rsatib, tekshiruvni boshqa darsga qoldirish']::text[]),
('79000000-0000-4000-8000-000000000104'::uuid, ARRAY['Avval faol qatnashgan bolalarga so‘z berib, qolganlarni vaqtga qarab tanlash', 'Faol ishtirokchilar tayyorlagan javobni guruh nomidan birga o‘qitish', 'Jamoaga taqdimot matnini o‘qituvchi tayyorlab, guruh nomidan aytib berish']::text[]),
('79000000-0000-4000-8000-000000000105'::uuid, ARRAY['Shaxsiy ma’lumot tarqalganini sinf oldida yana bir bor aytib tushuntirish', 'Voqeani faqat ota-onalar yig‘ilishigacha kuzatib turib, keyin umumiy baholash', 'Tarqatgan o‘quvchilarni ochiq ro‘yxatda aytib, ommaviy muhokama boshlash']::text[]),
('79000000-0000-4000-8000-000000000107'::uuid, ARRAY['Metod nomini va tashqi shaklini yangilab, avvalgi dars jarayonini saqlash', 'O‘quvchilardan tezroq ishlashni talab qilib, boshqa o‘zgarish kiritmaslik', 'Usulni butunlay to‘xtatib, faqat an’anaviy bayonga qaytish']::text[]),
('79000000-0000-4000-8000-000000000108'::uuid, ARRAY['Baholashda eng yuqori natijani birinchi o‘ringa qo‘yib, qolganini cheklash', 'Barcha mashg‘ulotni ota-onalar nazoratiga topshirib, darsga aralashmaslik', 'Loyiha ma’lumotlarini umumiy guruhga joylash orqali xabar berishni tezlashtirish']::text[]),
('79000000-0000-4000-8000-000000000110'::uuid, ARRAY['Darsdagi barcha mashqlarni faqat baholash sanasiga qarab tanlash', 'Barcha yoshlar uchun bir xil mavzu murakkabligini saqlab qolish', 'Sinfni faqat mavjud partalar soniga mos guruhlarga ajratish']::text[]),
('79000000-0000-4000-8000-000000000111'::uuid, ARRAY['Tushunchani faqat darslikdagi aniq ta’rifni qayta yozish orqali yakunlash', 'Kundalik vaziyatni tahlil qilmay, faqat nazariy qoidalarni sinash', 'Faqat yakuniy test yordamida atamalarni eslab qolishni baholash']::text[]),
('79000000-0000-4000-8000-000000000112'::uuid, ARRAY['Ko‘rgazmalilik va tasviriylik', 'Tizimlilik va izchillik', 'Mustahkamlik va takroriylik']::text[]),
('79000000-0000-4000-8000-000000000113'::uuid, ARRAY['Faqat umumiy suratni tayyorlab, bajarilgan ish sifatini muhokama qilmaslik', 'Vazifalarni o‘qituvchiga yuklab, ishning yakuniy natijasini kutib turish', 'Sinfdoshlar mehnatini baholamasdan, faqat o‘z vazifasini rasmiy topshirish']::text[]),
('79000000-0000-4000-8000-000000000114'::uuid, ARRAY['Debat', 'Jigsaw', 'Keys']::text[]),
('79000000-0000-4000-8000-000000000115'::uuid, ARRAY['Guruhdagi har bir o‘quvchining uzoq muddat mustaqil maqola yozishi', 'Bitta yetakchining yakuniy chiqishi, qolganlar esa kuzatuvchi bo‘lishi', 'Har bir guruhning qoida yodlab, javobni faqat yozma topshirishi']::text[]),
('79000000-0000-4000-8000-000000000116'::uuid, ARRAY['O‘z farzandining darsdagi faoliyati va o‘zlashtirish rivojlanishi', 'Ota-ona bilan kelishilgan farzandiga oid individual yordam rejasi', 'O‘z farzandining keyingi darslarda bajarishi mumkin bo‘lgan mashqlari']::text[]),
('79000000-0000-4000-8000-000000000118'::uuid, ARRAY['Didaktik rejalashtirish', 'Baholash metodikasi', 'Tarbiyaviy strategiya']::text[]),
('79000000-0000-4000-8000-000000000119'::uuid, ARRAY['Pedagogik muloqot va tinglash mahoratini rivojlantirish qobiliyati', 'Didaktik material va resurslarni sinfga taqsimlash qobiliyati', 'O‘quvchi javobini baholash mezonlari bilan solishtirish qobiliyati']::text[]),
('79000000-0000-4000-8000-000000000120'::uuid, ARRAY['Akademik qobiliyat', 'Tashkilotchilik qobiliyati', 'Kommunikativ qobiliyat']::text[]),
('79000000-0000-4000-8000-000000000121'::uuid, ARRAY['Har bir a’zo barcha bo‘limni uyda mustaqil o‘rganib keladi', 'Bitta o‘quvchi mavzuni tushuntirib, qolganlar faqat qayta aytib beradi', 'Guruh avval yakuniy mahsulot yasab, keyin mavzuni bo‘limlarga ajratadi']::text[])
  ) AS v(question_id, wrong_options)
  LOOP
    IF NOT EXISTS(SELECT 1 FROM public.questions WHERE id=item.question_id) THEN
      RAISE NOTICE 'TASK-203 absent optional seed: %',item.question_id;
      CONTINUE;
    END IF;
    IF EXISTS(SELECT 1 FROM public.questions WHERE id=item.question_id
      AND status='published'::public.content_status) THEN
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
