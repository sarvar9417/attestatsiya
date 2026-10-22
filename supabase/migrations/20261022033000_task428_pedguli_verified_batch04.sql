-- TASK-428 — fourth expert-screened PedMahoratGuli intake batch.
-- Assessment and control terminology is rewritten into independent, clear Y1 items.
BEGIN;
SET LOCAL lock_timeout='8s';
SET LOCAL statement_timeout='120s';

CREATE TEMP TABLE task428_batch04(
  message_id bigint PRIMARY KEY,
  cognitive public.cognitive_level NOT NULL,
  difficulty integer NOT NULL CHECK(difficulty BETWEEN 1 AND 5),
  stem_md text NOT NULL,
  options jsonb NOT NULL CHECK(jsonb_array_length(options)=4),
  correct_index integer NOT NULL CHECK(correct_index BETWEEN 0 AND 3),
  explanation_md text NOT NULL,
  source_reference text GENERATED ALWAYS AS(
    'telegram:@PedMahoratGuli:'||message_id::text||'|task428:expert-rewrite:v1'
  ) STORED
) ON COMMIT DROP;

INSERT INTO task428_batch04(message_id,cognitive,difficulty,stem_md,options,correct_index,explanation_md)
SELECT (v->>'m')::bigint,(v->>'k')::public.cognitive_level,(v->>'d')::integer,
  v->>'s',v->'o',(v->>'a')::integer,v->>'e'
FROM jsonb_array_elements($bank$
[
  {"m":902,"k":"bilish","d":2,"s":"Ta’lim oluvchining bilim, ko‘nikma va malaka darajasini aniqlash, o‘lchash hamda baholashni qamrab oladigan umumiy jarayon nima deyiladi?","o":["Tekshirish — o‘zlashtirish haqida dalil to‘plash amali","Nazorat — aniqlash, o‘lchash va baholashning umumiy jarayoni","Baholash — natijani belgilangan mezon bilan solishtirish","Tahlil — olingan dalillar orasidagi bog‘lanishni sharhlash"],"a":1,"e":"Nazorat o‘zlashtirish darajasini aniqlash, o‘lchash va baholashni birlashtiradigan keng jarayondir. Tekshirish va baholash esa nazoratning tarkibiy amallaridir."},
  {"m":906,"k":"bilish","d":2,"s":"Nazoratning qaysi tarkibiy qismi o‘qituvchiga o‘zlashtirish haqida obyektiv axborot beradi, kamchiliklarni o‘z vaqtida topadi va qayta aloqani ta’minlaydi?","o":["Tekshirish — o‘zlashtirish dalillarini aniqlash va qayd etish","Baholash — natijani mezon bilan taqqoslab xulosa chiqarish","Rejalashtirish — keyingi dars maqsadi va vazifasini belgilash","Rag‘batlantirish — o‘quvchini faoliyatga hissiy jihatdan undash"],"a":0,"e":"Tekshirish o‘quv materialining qay darajada o‘zlashtirilganini aniqlaydi va kamchiliklar haqida qayta aloqa beradi. Baholash esa to‘plangan dalilni mezon bilan solishtiradi."},
  {"m":908,"k":"bilish","d":2,"s":"O‘quv yili boshida avvalgi tayyorgarlik darajasini aniqlash va keyingi ta’limni rejalash uchun o‘tkaziladigan tekshiruv turi qaysi?","o":["Boshlang‘ich diagnostik tekshiruv — mavjud tayyorgarlikni aniqlash","Joriy tekshiruv — har bir mavzu o‘zlashtirilishini kuzatish","Oraliq tekshiruv — bo‘lim yakunidagi natijani aniqlash","Yakuniy tekshiruv — davr oxiridagi umumiy natijani baholash"],"a":0,"e":"Ta’lim boshlanishidan oldin mavjud bilim va bo‘shliqlarni aniqlash boshlang‘ich diagnostik tekshiruvning vazifasidir. Natija keyingi rejalash uchun tayanch bo‘ladi."},
  {"m":909,"k":"bilish","d":2,"s":"Har bir mavzuni o‘rganish davomida alohida bilim va ko‘nikmalarning o‘zlashtirilishini muntazam aniqlab boradigan tekshiruv turi qaysi?","o":["Boshlang‘ich tekshiruv — ta’lim oldidagi tayyorgarlikni aniqlash","Joriy tekshiruv — mavzu jarayonidagi o‘zlashtirishni kuzatish","Oraliq tekshiruv — butun bo‘lim yakunini umumlashtirish","Yakuniy tekshiruv — yil oxiridagi natijani hisobga olish"],"a":1,"e":"O‘rganish jarayonining har bir bosqichida alohida elementlar bo‘yicha dalil yig‘ish joriy tekshiruvdir. U kamchilikni darhol aniqlab tuzatishga yordam beradi."},
  {"m":910,"k":"bilish","d":2,"s":"Chorak yoki o‘quv yili oxirida butun davr davomida egallangan bilim, ko‘nikma va malakalarni umumlashtirib tekshirish qanday ataladi?","o":["Boshlang‘ich tekshiruv — avvalgi tayyorgarlikni aniqlash","Joriy tekshiruv — mavzuni o‘rganish jarayonini kuzatish","Oraliq tekshiruv — alohida bo‘lim natijasini aniqlash","Yakuniy tekshiruv — davr bo‘yicha umumiy natijani hisoblash"],"a":3,"e":"Chorak yoki yil oxiridagi umumlashtiruvchi tekshiruv yakuniy nazoratga kiradi. U butun davrda shakllangan bilim va ko‘nikmalar natijasini hisobga oladi."},
  {"m":912,"k":"bilish","d":2,"s":"Baholash natijasining qabul qilingan ball yoki raqam shaklida ifodalangan sonli o‘lchami nima deyiladi?","o":["Baho — natijaning ball yoki raqam bilan ifodalangan o‘lchami","Reyting — bir nechta natija asosida tuzilgan nisbiy o‘rin","Normativ — natija taqqoslanadigan oldindan belgilangan talab","Kredit — o‘quv yuklamasining shartli hisob birligi"],"a":0,"e":"Baho o‘quv natijasiga berilgan qiymatning ball yoki raqamdagi ifodasidir. Reyting nisbiy o‘rinni, normativ mezonni, kredit esa yuklama hajmini bildiradi."},
  {"m":914,"k":"bilish","d":2,"s":"O‘quvchining bilim, ko‘nikma va malakasini dasturda belgilangan mezon yoki etalon bilan solishtirib xulosa chiqarish jarayoni nima deyiladi?","o":["Tekshirish — o‘zlashtirish haqidagi dalillarni yig‘ish","Nazorat — tekshirish va baholashni qamrab oluvchi jarayon","Anglash — ma’lumot mazmunini tushunib, qayta ifodalash","Baholash — natijani mezon bilan solishtirib qiymat berish"],"a":3,"e":"Natijani oldindan belgilangan mezon bilan taqqoslash va unga qiymat berish baholashning mohiyatidir. Tekshirish esa buning uchun dalil yig‘adi."},
  {"m":917,"k":"qollash","d":3,"s":"Nazoratga tayyorlanish o‘quvchini vaqtini tartibga solishga, topshiriqni o‘z vaqtida bajarishga va intizomli bo‘lishga odatlantirdi. Nazoratning qaysi vazifasi namoyon bo‘ldi?","o":["O‘qitish vazifasi — takrorlash orqali bilimni mustahkamlash","Nazorat vazifasi — o‘zlashtirish darajasini aniqlab baholash","Tarbiyalash vazifasi — mas’uliyat va intizomni shakllantirish","Rivojlantirish vazifasi — tafakkur amallarini takomillashtirish"],"a":2,"e":"Vaqtdan unumli foydalanish, o‘z vaqtida tayyorlanish va intizomga odatlanish shaxsiy sifatlarni shakllantiradi. Bu nazoratning tarbiyalash vazifasidir."},
  {"m":918,"k":"qollash","d":3,"s":"Tekshiruv o‘quvchining keyingi mavzuga tayyorligini ko‘rsatdi va o‘qituvchiga tanlangan metodlarning samaradorligini aniqlash imkonini berdi. Qaysi vazifa bajarildi?","o":["O‘qitish vazifasi — mavzuni takrorlash va mustahkamlash","Nazorat vazifasi — holatni aniqlash va baholash","Tarbiyalash vazifasi — mas’uliyat va intizomni shakllantirish","Rivojlantirish vazifasi — fikrlash usullarini takomillashtirish"],"a":1,"e":"O‘zlashtirish darajasi, keyingi bosqichga tayyorlik va metod samarasi aniqlanmoqda. Bu nazorat qilish va baholash vazifasining mazmunidir."},
  {"m":919,"k":"qollash","d":3,"s":"Uy vazifasini tekshirish paytida o‘quvchilar mavzuni takrorladi, tushunmagan joylarini aniqladi va o‘qituvchi izohi bilan bilimini mustahkamladi. Qaysi vazifa ustuvor?","o":["O‘qitish vazifasi — takrorlash va tushuntirish orqali bilimni mustahkamlash","Nazorat vazifasi — natijani faqat ball bilan qayd etish","Tarbiyalash vazifasi — o‘quvchini intizom qoidalariga odatlantirish","Rivojlantirish vazifasi — faqat murakkab tafakkur amallarini o‘stirish"],"a":0,"e":"Tekshiruvning o‘zi takrorlash, tushunmagan joyni aniqlash va qayta tushuntirishga xizmat qilmoqda. Bu nazoratning o‘qitish vazifasidir."},
  {"m":920,"k":"bilish","d":2,"s":"Nazoratning o‘qitish va tarbiyalash vazifalari izchil amalga oshirilganda o‘quvchining tafakkuri, xotirasi va mustaqil ishlash usullari ham takomillashadi. Bu qaysi vazifa?","o":["O‘qitish vazifasi — bilimni takrorlash va mustahkamlash","Nazorat vazifasi — natijani aniqlash va mezon bilan baholash","Tarbiyalash vazifasi — mas’uliyat va intizomni shakllantirish","Rivojlantirish vazifasi — bilish jarayonlarini takomillashtirish"],"a":3,"e":"Tafakkur, xotira va mustaqil ishlash usullarining o‘sishi shaxsning bilish imkoniyatlari rivojlanishini anglatadi. Bu nazoratning rivojlantiruvchi vazifasidir."},
  {"m":938,"k":"bilish","d":2,"s":"Ta’lim natijalarini tashxislash va nazorat qilishda eng muhim tamoyillar qaysi qatorda to‘g‘ri berilgan?","o":["Boshlang‘ich, joriy, oraliq va yakuniy nazorat turlari","Xolislik, tizimlilik hamda natijalarning oshkoraligi","Og‘zaki, yozma, amaliy va test tekshiruv metodlari","Bilimlilik, qiziqarlilik hamda topshiriqning murakkabligi"],"a":1,"e":"Xolislik dalilni tarafkashliksiz baholashni, tizimlilik nazoratning izchilligini, oshkoralik esa mezon va natijaning tushunarli bo‘lishini ta’minlaydi."},
  {"m":940,"k":"bilish","d":2,"s":"Muayyan bob yoki yirik bo‘lim o‘zlashtirilgach, shu bo‘lim natijasini umumlashtirib tekshirish qanday nazorat turi hisoblanadi?","o":["Oraliq nazorat — bob yoki bo‘lim yakunini tekshirish","Joriy nazorat — har bir mavzu jarayonini kuzatish","Yakuniy nazorat — chorak yoki yil natijasini umumlashtirish","Boshlang‘ich nazorat — avvalgi tayyorgarlikni aniqlash"],"a":0,"e":"Alohida bob yoki bo‘lim tugagach uning o‘zlashtirilishini umumlashtirib tekshirish oraliq nazoratdir. U joriy va yakuniy nazorat orasida turadi."},
  {"m":941,"k":"bilish","d":2,"s":"O‘qituvchi o‘quvchilarning har bir mavzu va kundalik topshiriqni qanday o‘zlashtirayotganini darslar davomida muntazam tekshiradi. Bu qaysi nazorat turi?","o":["Oraliq nazorat — bo‘lim tugagach natijani umumlashtirish","Joriy nazorat — kundalik o‘zlashtirishni muntazam kuzatish","Yakuniy nazorat — davr oxiridagi umumiy natijani aniqlash","Boshlang‘ich nazorat — ta’lim oldidagi tayyorgarlikni aniqlash"],"a":1,"e":"Kundalik ish va har bir mavzu bo‘yicha o‘zlashtirishni muntazam kuzatish joriy nazoratdir. U ta’lim jarayonida tezkor qayta aloqa beradi."},
  {"m":942,"k":"bilish","d":2,"s":"Choraklik, yarim yillik, yillik va davlat attestatsiyasi sinovlarini birlashtiruvchi nazorat turi qaysi?","o":["Oraliq nazorat — alohida bo‘lim natijasini tekshirish","Joriy nazorat — kundalik o‘zlashtirishni kuzatib borish","Yakuniy nazorat — belgilangan davr natijasini umumlashtirish","Boshlang‘ich nazorat — avvalgi bilim darajasini aniqlash"],"a":2,"e":"Chorak, yarim yil, yil yoki davlat attestatsiyasi kabi davr yakunidagi sinovlar yakuniy nazorat turlaridir. Ular umumiy natijani hisobga oladi."},
  {"m":944,"k":"bilish","d":2,"s":"O‘qituvchi bir o‘quvchini doska oldiga chaqirib, uning javobini batafsil tingladi va bilim hamda ko‘nikmasini chuqur aniqladi. Qaysi nazorat shakli qo‘llandi?","o":["Individual nazorat — bitta o‘quvchi javobini batafsil tekshirish","Frontal nazorat — butun sinfga bir vaqtda savol berish","Guruhli nazorat — kichik jamoa natijasini birgalikda tekshirish","Kombinatsiyalangan nazorat — bir nechta shaklni bir paytda qo‘llash"],"a":0,"e":"Bitta o‘quvchining javobi batafsil o‘rganilgani uchun bu individual nazorat shaklidir. Frontal nazoratda esa savollar bir vaqtning o‘zida sinfga beriladi."},
  {"m":947,"k":"bilish","d":2,"s":"O‘quvchi o‘z ishini mezon bilan mustaqil solishtirib, xatosini aniqladi va tuzatish rejasini tuzdi. Bu qaysi nazorat shakli?","o":["O‘z-o‘zini nazorat — o‘quvchining o‘z natijasini mezon bilan tekshirishi","Frontal nazorat — o‘qituvchining butun sinfni bir vaqtda tekshirishi","Guruhli nazorat — jamoa natijasining birgalikda baholanishi","Kombinatsiyalangan nazorat — turli shakllarning bir vaqtda qo‘llanishi"],"a":0,"e":"O‘quvchi o‘z natijasini mezon bilan mustaqil taqqoslab, xatosini aniqlamoqda. Bu ichki qayta aloqani ta’minlovchi o‘z-o‘zini nazorat shaklidir."},
  {"m":950,"k":"bilish","d":2,"s":"O‘qituvchi bo‘lim tugagach nazorat ishi, insho yoki diktant orqali qisqa vaqtda barcha o‘quvchilarning natijasini tekshirdi. Qaysi metod qo‘llandi?","o":["Og‘zaki tekshirish — javobni suhbat va savol orqali aniqlash","Yozma tekshirish — javoblarni yozma ish orqali yig‘ish","Amaliy tekshirish — faoliyat natijasini bajarilgan ishda ko‘rish","Uy vazifasini tekshirish — mustaqil topshiriq bajarilishini aniqlash"],"a":1,"e":"Nazorat ishi, insho va diktant javobni yozma shaklda olishga asoslanadi. Bu metod qisqa vaqt ichida butun sinf natijasini tekshirish imkonini beradi."},
  {"m":952,"k":"bilish","d":2,"s":"O‘qituvchi o‘quvchining mustaqil ishlash odati, o‘tilgan materialni egallashi va topshiriqqa munosabatini aniqlash uchun muntazam ravishda bajarilgan mustaqil topshiriqlarni ko‘rib chiqdi. Qaysi metod qo‘llandi?","o":["Og‘zaki tekshirish — o‘quvchi javobini suhbat orqali aniqlash","Yozma tekshirish — sinfdagi yozma ish natijasini baholash","Amaliy tekshirish — ko‘nikmani faoliyat jarayonida kuzatish","Uy vazifasini tekshirish — mustaqil bajarilgan topshiriqni ko‘rib chiqish"],"a":3,"e":"Mustaqil bajarilgan topshiriqlarni muntazam ko‘rish o‘quvchining mas’uliyati, mustaqilligi va o‘zlashtirishini baholashga yordam beradi. Bu uy vazifasini tekshirish metodidir."}
]
$bank$::jsonb) AS source(v);

DO $task428_b04$
DECLARE
  b task428_batch04%rowtype;
  actor uuid; subject_id uuid; construct_id uuid; lesson_id uuid;
  question_id uuid; option_id uuid; option_ids uuid[];
  i integer; n integer; bad integer;
BEGIN
  IF (SELECT count(*) FROM task428_batch04)<>19
  THEN RAISE EXCEPTION 'TASK428_B04_COUNT'; END IF;
  IF EXISTS(
    SELECT 1 FROM task428_batch04 tb JOIN public.questions q
      ON q.source_reference='telegram:@PedMahoratGuli:'||tb.message_id::text
      OR q.source_reference LIKE 'telegram:@PedMahoratGuli:'||tb.message_id::text||'|%'
  ) THEN RAISE EXCEPTION 'TASK428_B04_SOURCE_ALREADY_REPRESENTED'; END IF;

  SELECT id INTO STRICT actor FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
  THEN RAISE EXCEPTION 'TASK428_B04_OWNER_NOT_UNIQUE'; END IF;
  SELECT id INTO STRICT subject_id FROM public.subjects WHERE code='informatika';
  SELECT c.id,l.id INTO STRICT construct_id,lesson_id
  FROM public.constructs c JOIN public.lesson_constructs lc ON lc.construct_id=c.id
  JOIN public.lessons l ON l.id=lc.lesson_id
  WHERE c.code='PM.GEN.01' AND c.is_active
    AND l.slug='pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi'
    AND l.status='published'::public.content_status;

  CREATE TEMP TABLE task428_b04_ids(id uuid PRIMARY KEY) ON COMMIT DROP;
  FOR b IN SELECT * FROM task428_batch04 ORDER BY message_id LOOP
    IF EXISTS(SELECT 1 FROM public.questions q WHERE q.status IN('review','published')
      AND regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g')=
          regexp_replace(lower(btrim(b.stem_md)),'[^[:alnum:]]+','','g'))
    THEN RAISE EXCEPTION 'TASK428_B04_ACTIVE_EXACT_DUPLICATE_%',b.message_id; END IF;

    question_id:=gen_random_uuid();
    INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,
      difficulty,stem_md,status,author_id,is_generated,source_lesson_id,source_reference)
    VALUES(question_id,subject_id,construct_id,'PM.GEN','Y1'::public.question_format,b.cognitive,
      b.difficulty,b.stem_md,'review'::public.content_status,NULL,true,lesson_id,b.source_reference);
    INSERT INTO task428_b04_ids VALUES(question_id);
    option_ids:=ARRAY[]::uuid[];
    FOR i IN 0..3 LOOP
      option_id:=gen_random_uuid(); option_ids:=array_append(option_ids,option_id);
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      VALUES(option_id,question_id,'a',i,b.options->>i);
    END LOOP;
    INSERT INTO public.question_keys(question_id,payload,explanation_md)
    VALUES(question_id,jsonb_build_object('correct_option_id',option_ids[b.correct_index+1]),b.explanation_md);
  END LOOP;

  WITH checks AS(
    SELECT q.id,count(o.id) option_count,count(DISTINCT lower(btrim(o.content_md))) distinct_count,
      count(*) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_count,
      min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) minw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) maxw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correctw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') maxwrong
    FROM task428_b04_ids r JOIN public.questions q ON q.id=r.id
    JOIN public.question_options o ON o.question_id=q.id AND btrim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id GROUP BY q.id
  ) SELECT count(*) FILTER(WHERE option_count<>4 OR distinct_count<>4 OR correct_count<>1
      OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25),count(*) INTO bad,n FROM checks;
  IF bad<>0 OR n<>19 THEN RAISE EXCEPTION 'TASK428_B04_BALANCE_%_COUNT_%',bad,n; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers(
    question_id,authorized_by,content_fingerprint,authority,provenance)
  SELECT q.id,actor,public.professional_question_fingerprint(q.id),
    'owner_explicit_no_external_expert_20261018',
    'TASK-428 batch 04; owner-delegated AI expert rewrite of PedMahoratGuli assessment terminology; source key independently checked; independent human expert signoff NOT claimed'
  FROM task428_b04_ids r JOIN public.questions q ON q.id=r.id;
  GET DIAGNOSTICS n=ROW_COUNT;
  IF n<>19 THEN RAISE EXCEPTION 'TASK428_B04_WAIVERS_%',n; END IF;

  UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
  FROM task428_b04_ids r WHERE q.id=r.id AND q.status='review'::public.content_status;
  GET DIAGNOSTICS n=ROW_COUNT;
  IF n<>19 THEN RAISE EXCEPTION 'TASK428_B04_PUBLISHED_%',n; END IF;

  SELECT count(*) INTO n FROM task428_b04_ids r JOIN public.questions q ON q.id=r.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF n<>19 THEN RAISE EXCEPTION 'TASK428_B04_POSTFLIGHT_%_OF_19',n; END IF;
END
$task428_b04$;
COMMIT;
