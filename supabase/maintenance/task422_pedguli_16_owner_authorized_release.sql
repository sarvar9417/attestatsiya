-- TASK-422 — owner-authorized final editorial release of 16 Telegram-discovered
-- pedagogy questions. The channel is discovery evidence, not an answer authority.
-- The owner delegated final review on 2026-10-21. This records AI-assisted
-- editorial authority and MUST NOT be described as independent human signoff.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='45s';

CREATE TEMP TABLE task422_bank(
  source_reference text PRIMARY KEY,
  expected_fingerprint text NOT NULL,
  stem_md text NOT NULL,
  options jsonb NOT NULL CHECK(jsonb_array_length(options)=4)
) ON COMMIT DROP;

INSERT INTO task422_bank VALUES
('telegram:@PedMahoratGuli:2257|task421:expert-rewrite:v1','b77d434e36bed2ff0552f0301b11fbd2',
 'O‘qituvchi hayajonlangan o‘quvchining gapini bo‘lmasdan, bosh barmog‘ini yuqoriga ko‘tarish orqali ruhlantirdi. Pedagogik texnikaning qaysi vositasi qo‘llandi?',
 '["Pantomimika (tana harakati)","Jest (qo‘l harakati)","Mimika (yuz ifodasi)","Nutq texnikasi"]'),
('telegram:@PedMahoratGuli:2263|task421:expert-rewrite:v1','6e34b40064de0c5fdd92fcca99df0e9d',
 'Orol dengizi muammosi bo‘yicha o‘quvchilar avval tanqidsiz imkon qadar ko‘p g‘oya aytdi. Barcha g‘oyalar qayd etilgach, ular mezonlar asosida saralandi. Qaysi metod qo‘llandi?',
 '["Aqliy hujum","Ochiq debat","Yakuniy debrifing","Muammoli ma’ruza"]'),
('telegram:@PedMahoratGuli:2341|task421:expert-rewrite:v1','c1c42c361bb871c8a31ebb8f104a36d3',
 'Tasviriy san’at darsida o‘quvchilar «Suv — hayot manbai» mavzusida ish tayyorlaydi. O‘qituvchi topshiriqqa suvning kimyoviy xususiyatlarini tushuntirishni ham kiritdi. Bu rejalashtirishning qaysi mehnat harakatiga misol?',
 '["Fanlararo kompetensiyalarni singdirish va fanlar o‘rtasida bog‘lanish yaratish","Mavzu mazmunini faqat ko‘rgazmali vositalar bilan boyitish","Tasviriy topshiriq uchun alohida baholash mezonini tuzish","Loyiha ishini sinfdan tashqari faoliyatga aylantirish"]'),
('telegram:@PedMahoratGuli:2342|task421:expert-rewrite:v1','a386fa600bb557c070398f238544db82',
 'Odatda 7-sinf o‘quvchilariga dars beradigan pedagog ertaga boshlang‘ich sinfdagi hamkasbini almashtiradi. Darsni rejalashtirishda eng asosli birinchi moslashtirish qaysi?',
 '["7-sinf uchun tayyorlangan ishlanmani aynan qo‘llash","Dars usullarini yosh va tayyorgarlik darajasiga moslash","Faqat ko‘rgazmali materiallar sonini ikki baravar oshirish","Avval mavzuni tushuntirib, so‘ng yoshni hisobga olish"]'),
('telegram:@PedMahoratGuli:2343|task421:expert-rewrite:v1','a4e982df119bfbe0775857bcb50a23a7',
 'Sinfdagi ayrim o‘quvchilar diagrammadagi mayda yozuvlarni ko‘rishda qiynaladi. O‘qituvchi bir xil o‘quv maqsadini saqlab, diagrammani yirik shaklda beradi va undagi axborotni og‘zaki tavsiflaydi. Qaysi harakat ustuvor?',
 '["Material va yordam usulini individual ehtiyojga moslashtirish","Barcha o‘quvchiga diagrammaning bir xil nusxasini berish","Diagrammani olib tashlab, faqat og‘zaki bayon qilish","Mavzuni keyingi darsga qoldirib, boshqa topshiriq berish"]'),
('telegram:@PedMahoratGuli:2345|task421:expert-rewrite:v1','d1853093f536e36734a7f17b87365bd1',
 'Maktabga kelgan shaxs o‘quvchini boshqalar oldida ayblay boshladi. Sinf rahbari bolaning sha’ni kamsitilishiga yo‘l qo‘ymadi, vaziyatni tinchlantirdi va masalani dalillar asosida vakolatli xodimlar bilan ko‘rib chiqdi. Qaysi kasbiy harakat eng aniq ifodalangan?',
 '["Mehmonning e’tirozini sinf oldida batafsil muhokama qilish","O‘quvchi qadr-qimmatini himoya qilib, nizoni dalil bilan boshqarish","Vaziyatni o‘quvchilarning o‘zaro kelishuviga to‘liq topshirish","Ayblovni darhol tasdiqlab, o‘quvchidan omma oldida uzr so‘ratish"]'),
('telegram:@PedMahoratGuli:2348|task421:expert-rewrite:v1','b5b4c1fdd5d5faef68b30b66fe8cc443',
 'O‘qituvchi har bir mavzudan keyin qisqa tekshiruv o‘tkazib, natijalarni vaqt davomida taqqoslaydi. Ushbu faoliyat baholashning qaysi mehnat harakatiga eng mos?',
 '["Har chorak oxirida faqat bitta yakuniy baho qo‘yish","Nazorat shaklini tez-tez almashtirib, natijalarni alohida saqlash","O‘zlashtirish darajasini muntazam tekshirib, o‘zgarishini tizimli kuzatish","Natijalarni taqqoslamasdan faqat elektron jurnalga qayd etish"]'),
('telegram:@PedMahoratGuli:2392|task421:expert-rewrite:v1','92c1ad66a179f82de5f2b90ead7f82d2',
 'Diagnostika natijalari 9-sinf o‘quvchilarining bir qismi algebra bo‘yicha tayanch mashqlarga muhtojligini ko‘rsatdi. O‘qituvchi asosiy maqsadlarni saqlagan holda qo‘shimcha mashg‘ulot va tayanch vazifalarni rejaladi. Qaysi mehnat harakati bajarildi?',
 '["O‘quv dasturini aniqlangan ehtiyojga qarab zarur darajada moslashtirish","Diagnostika natijalarini faqat chorak yakunida qayd etish","Barcha o‘quvchiga aynan bir xil qo‘shimcha vazifa berish","Asosiy maqsadlarni soddalashtirib, murakkab mavzularni olib tashlash"]'),
('telegram:@PedMahoratGuli:2394|task421:expert-rewrite:v1','fce3538ce0e4dade37b70ee0fd256ac3',
 'Tarix darsida guruhlar manbalarni muhokama qildi, umumiy xulosa tuzdi va boshqa guruhlarning dalillariga munosabat bildirdi. O‘qituvchining qaysi harakati vaziyatni eng aniq tavsiflaydi?',
 '["Har bir o‘quvchiga manbani mustaqil yodlatish","O‘quvchilarning jamoaviy ishini tashkil etish","Guruhlar javobini o‘qituvchi o‘zi umumlashtirish","Tayyor xulosalarni doskaga ko‘chirib yozdirish"]'),
('telegram:@PedMahoratGuli:2396|task421:expert-rewrite:v1','6d1a02fa1f17dd234c43688374646726',
 'Sinf soatida o‘qituvchi oldindan tanlangan voqea va savollar orqali o‘quvchilarning yaqinlariga bo‘lgan munosabatini tahlil qilishga, hamdardlik va minnatdorlik haqida xulosa chiqarishga yo‘naltirdi. Qaysi tarbiyaviy harakat ustuvor?',
 '["Tarbiyaviy qoidalarni izohsiz yodlatish","Mahalliy tarix bo‘yicha ekspeditsiya o‘tkazish","Bolaning emotsional-qadriyat sohasini rivojlantiradigan vaziyatni loyihalash","Ota-onalar bilan baholash natijalarini muhokama qilish"]'),
('telegram:@PedMahoratGuli:2571|task421:expert-rewrite:v1','48fa345fae2bed88322177979a970de8',
 'Fizika o‘qituvchisi magnit, sim va ampermetr yordamida magnit harakatlanganda tok hosil bo‘lish jarayonini sinf oldida bevosita ko‘rsatdi. Yetakchi o‘qitish metodi qaysi?',
 '["Og‘zaki hikoya","Og‘zaki tushuntirish","Amaliy namoyish","Statik tasvir"]'),
('telegram:@PedMahoratGuli:2573|task421:expert-rewrite:v1','21973ac18edc90b20261123c62ce71b9',
 'Biologiya o‘qituvchisi yurak tuzilishini statik rasm va sxemalar orqali ko‘rsatdi; o‘quvchilar shu tasvirlar asosida qismlarni aniqladi. Yetakchi ko‘rgazmali metod qaysi?',
 '["Og‘zaki tushuntirish","Statik tasvir","Og‘zaki hikoya","Amaliy namoyish"]'),
('telegram:@PedMahoratGuli:2714|task421:expert-rewrite:v1','fcec34b41432b0cd338c8db3390737f6',
 'O‘qituvchi nazorat ishidan so‘ng faqat ballni aytmadi: mezonga tayangan holda o‘quvchining kuchli tomonlari, xatosi va keyingi qadamini tushuntirdi. Qaysi mehnat harakati eng aniq bajarildi?',
 '["Nazorat natijalarini faqat reyting jadvaliga kiritish","Keyingi dars uchun yangi topshiriqlar rejasini tuzish","O‘quvchi yutug‘ini mezon asosida baholab, bahoni asoslash","Baho qo‘ygach, umumiy mezonni qaytadan belgilash"]'),
('telegram:@PedMahoratGuli:2715|task421:expert-rewrite:v1','d5a54347fdfc0f4c6fac64069000a813',
 'Tarix o‘qituvchisi o‘quvchilar bilan mahalliy tarixiy joyga ekskursiya uyushtirdi. Ular hudud qahramonlari haqidagi dalillarni yig‘ib, yakunda taqdimot tayyorladi. Qaysi mehnat harakati ustuvor?',
 '["Hudud xususiyatiga tayangan sinfdan tashqari tarbiyaviy ishni tashkil etish","Mahalliy manbalarni faqat sinfda o‘qib, yakunda muhokama qilish","Tarixiy joy haqida o‘qituvchi ma’ruzasini tashkil etish","Barcha tarix darslarini ekskursiya shaklida o‘tkazish"]'),
('telegram:@PedMahoratGuli:2718|task421:expert-rewrite:v1','f558382cdf50a49ce12a6f960f85d935',
 'Pedagog har oy o‘z darsidagi muvaffaqiyat va qiyinchiliklarni yozma tahlil qiladi, takomillashtirish yo‘lini belgilaydi va zarur masalada tajribali hamkasbdan maslahat oladi. Qaysi mehnat harakati ustuvor?',
 '["Ochiq darsda muvaffaqiyatli usullarini hamkasblarga namoyish etish","Metodik kengash uchun majlis bayonnomasini rasmiylashtirish","Boshqa pedagog darsini kuzatib, unga tavsiya berish","O‘z faoliyatini tahlil qilib, kasbiy rivojlanish ehtiyojini belgilash"]'),
('telegram:@PedMahoratGuli:2745|task421:expert-rewrite:v1','591c98d84c6156b343f64ac8f9305b3f',
 'Sinfda o‘quvchilarning ehtiyoji va javob berish imkoniyati turlicha. O‘qituvchi bir xil o‘quv natijasini baholash uchun ayrim o‘quvchiga og‘zaki, boshqasiga yozma dalil taqdim etish imkonini berdi va hammaga oldindan bir xil mezonni e’lon qildi. Qaysi ko‘nikma namoyon bo‘ldi?',
 '["Natijani faqat ota-onaga individual tarzda ma’lum qilish","Hamma o‘quvchiga aynan bitta javob formatini belgilash","Baholash usulini ehtiyoj va imkoniyatga moslashtirish","Har bir o‘quvchi uchun alohida baholash mezoni tuzish"]');

DO $pre$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM task422_bank;
  IF n<>16 THEN RAISE EXCEPTION 'TASK422_BANK_COUNT_%',n; END IF;

  SELECT count(*) INTO n
  FROM task422_bank b JOIN public.questions q ON q.source_reference=b.source_reference
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='review' AND q.format='Y1'
    AND q.group_code IN ('KS','PM.GEN','PM.MET')
    AND public.professional_question_fingerprint(q.id)=b.expected_fingerprint
    AND (SELECT count(*) FROM public.question_options o WHERE o.question_id=q.id AND trim(o.side)='a')=4
    AND EXISTS(SELECT 1 FROM public.question_options o WHERE o.question_id=q.id
      AND o.id::text=k.payload->>'correct_option_id')
    AND NOT EXISTS(SELECT 1 FROM public.pedagogy_owner_release_waivers w WHERE w.question_id=q.id);
  IF n<>16 THEN RAISE EXCEPTION 'TASK422_PRECHECK_%_OF_16',n; END IF;
END $pre$;

UPDATE public.questions q SET stem_md=b.stem_md,updated_at=now()
FROM task422_bank b WHERE q.source_reference=b.source_reference AND q.status='review';

UPDATE public.question_options o SET content_md=b.options->>o.order_idx
FROM public.questions q JOIN task422_bank b ON b.source_reference=q.source_reference
WHERE o.question_id=q.id AND q.status='review' AND trim(o.side)='a';

DO $release$
DECLARE actor uuid; n integer; bad integer;
BEGIN
  SELECT id INTO STRICT actor FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
  THEN RAISE EXCEPTION 'TASK422_OWNER_NOT_UNIQUE'; END IF;

  WITH checks AS (
    SELECT q.id,count(o.id) option_count,count(DISTINCT lower(btrim(o.content_md))) distinct_count,
      count(*) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_count,
      min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) minw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) maxw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correctw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') maxwrong
    FROM public.questions q JOIN task422_bank b ON b.source_reference=q.source_reference
    JOIN public.question_options o ON o.question_id=q.id AND trim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id GROUP BY q.id
  ) SELECT count(*) INTO bad FROM checks WHERE option_count<>4 OR distinct_count<>4
      OR correct_count<>1 OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25;
  IF bad<>0 THEN RAISE EXCEPTION 'TASK422_BALANCE_OR_KEY_FAILURE_%',bad; END IF;

  SELECT count(*) INTO bad
  FROM public.questions q JOIN task422_bank b ON b.source_reference=q.source_reference
  JOIN public.questions other ON other.id<>q.id AND other.status IN ('review','published')
   AND regexp_replace(lower(btrim(other.stem_md)),'[^[:alnum:]]+','','g')=
       regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g');
  IF bad<>0 THEN RAISE EXCEPTION 'TASK422_EXACT_DUPLICATE_%',bad; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers
    (question_id,authorized_by,content_fingerprint,authority,provenance)
  SELECT q.id,actor,public.professional_question_fingerprint(q.id),
    'owner_explicit_no_external_expert_20261018',
    'TASK-422; 2026-10-21 owner delegated final review and decision authority to ChatGPT and instructed work to continue without another review request; AI-assisted editorial release; independent human expert signoff NOT claimed'
  FROM public.questions q JOIN task422_bank b ON b.source_reference=q.source_reference
  WHERE q.status='review';
  GET DIAGNOSTICS n=ROW_COUNT;
  IF n<>16 THEN RAISE EXCEPTION 'TASK422_WAIVER_COUNT_%',n; END IF;

  UPDATE public.questions q SET status='published',updated_at=now()
  FROM task422_bank b WHERE q.source_reference=b.source_reference AND q.status='review';
  GET DIAGNOSTICS n=ROW_COUNT;
  IF n<>16 THEN RAISE EXCEPTION 'TASK422_PUBLISHED_COUNT_%',n; END IF;

  SELECT count(*) INTO n FROM public.questions q
  JOIN task422_bank b ON b.source_reference=q.source_reference
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  WHERE q.status='published' AND w.authorized_by=actor
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF n<>16 THEN RAISE EXCEPTION 'TASK422_POSTFLIGHT_%_OF_16',n; END IF;
END $release$;

COMMIT;
