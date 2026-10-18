-- TASK-203: production-proven AI-redrafted wrong options (3/4).
-- Replay script: do not auto-run as a Supabase migration.
-- This file is idempotent for an already-published source; it DOES NOT mutate
-- published immutable revisions. Correct keys and attempt history stay unchanged.
BEGIN;
DO $repair$
DECLARE item record; opt record; n integer; mn integer; mx integer; cw integer; max_wrong integer; uq integer; hits integer;
BEGIN
  FOR item IN SELECT * FROM (VALUES
('79250000-0000-4000-8000-000000000219'::uuid, ARRAY['Har bir vaziyat uchun tayyor yechimni bosqichma-bosqich bayon qilish', 'O‘quvchilarning barcha javoblarini yagona andozaga moslashtirishga intilish', 'Mustaqil savollar o‘rniga faqat yakuniy baholash natijasini muhokama qilish']::text[]),
('79250000-0000-4000-8000-000000000220'::uuid, ARRAY['Reproduktiv yondashuv', 'Frontal yondashuv', 'Avtoritar yondashuv']::text[]),
('79250000-0000-4000-8000-000000000222'::uuid, ARRAY['Eslash', 'Tushunish', 'Baholash']::text[]),
('79250000-0000-4000-8000-000000000223'::uuid, ARRAY['Algoritm nomlariga qarab bittasini tanlash va natijani qayta sinamaslik', 'Faqat dastur tezligini solishtirib, chegaraviy qiymatlarda xatoni e’tiborsiz qoldirish', 'Yakuniy bahoni yozib, tekshiruv dalillarini o‘quvchilar bilan muhokama qilmaslik']::text[]),
('79250000-0000-4000-8000-000000000224'::uuid, ARRAY['O‘quvchi o‘rniga to‘g‘ri kodni qayta yozib, natijani ko‘rsatib berish', 'Xato haqidagi xabarni o‘qimasdan, yangi tayyor loyiha bilan almashtirish', 'Sinov vaziyatini aniqlamasdan, barcha sintaksis qoidalarini boshidan takrorlash']::text[]),
('79300000-0000-4000-8000-000000000301'::uuid, ARRAY['Algoritm nomlarini qayta ayttirib, o‘quvchining yodlash tezligini baholash', 'Bitta tayyor kodni namoyish etib, boshqalarning mustaqil tekshiruvini cheklash', 'Algoritmlarni tezlikdan qat’i nazar faqat dastur uzunligiga ko‘ra tartiblash']::text[]),
('79300000-0000-4000-8000-000000000302'::uuid, ARRAY['SQL buyruqlari ro‘yxatini yozdirib, ularning nomlarini og‘zaki so‘rash', 'Natija olish o‘rniga ma’lumotlar bazasi jadvalining dizaynini bezatish', 'Faqat o‘qituvchi tuzgan SQL kodini tushuntirmasdan ko‘chirish']::text[]),
('79300000-0000-4000-8000-000000000303'::uuid, ARRAY['Har bir mashqda faqat bir o‘quvchini kompyuterga qo‘yib, ikkinchisini kuzatish', 'Qurilmalar yetishmagani uchun amaliy topshiriqlarni nazariy ma’ruza bilan almashtirish', 'Kompyuterga tezroq ishlaydiganlarni ajratib, qolganlarga faqat yozma mashq berish']::text[]),
('79300000-0000-4000-8000-000000000304'::uuid, ARRAY['Dars oxirida o‘quvchi qanday bilimni egallab olishi kerak?', 'O‘rganilayotgan algoritmning muhim tushunchalari va xususiyatlari nimalardan iborat?', 'Mazkur mavzuni o‘qitishning umumiy tarbiyaviy va ta’limiy maqsadi nimada?']::text[]),
('79300000-0000-4000-8000-000000000305'::uuid, ARRAY['O‘quvchilarga kodni yana bir marta namoyish etish kifoya bo‘lishini', 'Siklni yodlash darajasi mustaqil dasturlashni to‘liq ifodalay olishini', 'Barcha xatolarni o‘quvchilarning shaxsiy qobiliyatsizligi bilan bog‘lash mumkinligini']::text[]),
('79300000-0000-4000-8000-000000000306'::uuid, ARRAY['Xavfsizlik atamalarini muntazam yozdirib, lug‘atni yod olishni talab qilish', 'Tarmoq qurilmalarining tashqi ko‘rinishi va ishlab chiqaruvchisini farqlash', 'Provayder nomi va qurilma modelini yodlashni asosiy maqsad qilish']::text[]),
('79300000-0000-4000-8000-000000000308'::uuid, ARRAY['Harakat va shart bloklarining ta’riflarini ketma-ket ko‘chirib, kodni sinamaslik', 'Bir xil skriptni ranglar bilan bezatib, ishlash shartini solishtirmaslik', 'O‘quvchilarga faqat bloklar nomini yodlatib, amaliy natijani tekshirmaslik']::text[]),
('79300000-0000-4000-8000-000000000309'::uuid, ARRAY['Har bir ekspert guruhida o‘rganilgan javobni faqat o‘zlari uchun saqlash', 'Asl guruhda o‘qituvchi taqdimotini tinglab, muhokamani keyingi darsga qoldirish', 'Barcha turlarni ko‘rmasdan, faqat birinchi misolni umumiy deb tanlash']::text[]),
('79300000-0000-4000-8000-000000000310'::uuid, ARRAY['Blok-sxema va psevdokod sarlavhalarini yodlab, amaliy qadamlarni tekshirmaslik', 'Ustozning tayyor xulosasini ko‘chirib, boshqa ifoda bilan solishtirmaslik', 'Diagrammalarning ranglarini tanlab, algoritm mantiqini baholashni chetlab o‘tish']::text[]),
('79300000-0000-4000-8000-000000000311'::uuid, ARRAY['Xabar sarlavhasini muallif va sanaga qaramasdan qayta yozib olish', 'Xabarning qanchalik ko‘p tarqalganiga qarab uning to‘g‘riligini taxmin qilish', 'Birgina veb-sahifadagi rang va emojilarga qarab xulosa chiqarish']::text[]),
('79300000-0000-4000-8000-000000000312'::uuid, ARRAY['Sinfda qo‘l ko‘targanlarning umumiy soniga qarab hamma tushungan deb bilish', 'O‘qituvchi for sikli qoidalarini aytib berib, darhol mavzuni yakunlash', 'Bitta ixtiyoriy o‘quvchining javobini umumlashtirib, boshqa bolalarni tekshirmaslik']::text[]),
('79300000-0000-4000-8000-000000000313'::uuid, ARRAY['Faqat normal kirish uchun qayta test o‘tkazish', 'Xatoli kirishni tekshirmay, dastur oynasini qayta ishga tushirish', 'Bo‘sh ro‘yxat muammosini koddan tashqari boshqa mavzuga bog‘lash']::text[]),
('79300000-0000-4000-8000-000000000314'::uuid, ARRAY['Bir necha qatorni birdan almashtirib, keyingi natijani faqat oxirida ko‘rish', 'Testlarni kamaytirish uchun tayyor ishlaydigan kodni to‘liq nusxalash', 'Dastur qatorlarini boshidan yozib, avvalgi xato manbasini qayd etmaslik']::text[]),
('79300000-0000-4000-8000-000000000315'::uuid, ARRAY['Kodlash muammosini tekshirmasdan, faylni boshqa nomda saqlatib ko‘rish', 'Belgilar buzilganini hisobga olmay, faqat dasturning tashqi ko‘rinishini baholash', 'O‘quvchiga tayyor kod berib, muammoni mustaqil tekshirishni to‘xtatish']::text[]),
('79300000-0000-4000-8000-000000000316'::uuid, ARRAY['Qiyin vazifani orqada qolganlar uchun butunlay olib tashlash', 'Har bir o‘quvchiga bir xil murakkab misolni izohsiz bajarishni talab qilish', 'Tayyor algoritmni ularga nusxalashga berib, bosqichlarni muhokama qilmaslik']::text[]),
('79300000-0000-4000-8000-000000000317'::uuid, ARRAY['Natija tartibini qayta ko‘rdingmi, jadval ranglarini tekshirib chiqqanmisan?', 'So‘rovni tushunmasdan, boshqa dastur interfeysida takrorlashni xohlaysanmi?', 'Jadval nomini ko‘p marta o‘zgartirib, xatoni izlaganmisan?']::text[])
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
