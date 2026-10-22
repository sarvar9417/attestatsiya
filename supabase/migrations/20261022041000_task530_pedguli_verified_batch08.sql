-- TASK-530 — eighth expert-screened PedMahoratGuli intake batch.
-- Pedagogical abilities, communication styles, tact and conflict factors.
BEGIN;
SET LOCAL lock_timeout='8s';
SET LOCAL statement_timeout='120s';

CREATE TEMP TABLE task530_batch08(
  message_id bigint PRIMARY KEY, construct_code text NOT NULL, lesson_slug text NOT NULL,
  cognitive public.cognitive_level NOT NULL, difficulty integer NOT NULL,
  stem_md text NOT NULL, options jsonb NOT NULL CHECK(jsonb_array_length(options)=4),
  correct_index integer NOT NULL CHECK(correct_index BETWEEN 0 AND 3), explanation_md text NOT NULL,
  source_reference text GENERATED ALWAYS AS(
    'telegram:@PedMahoratGuli:'||message_id::text||'|task428:expert-rewrite:v1') STORED
) ON COMMIT DROP;

INSERT INTO task530_batch08(message_id,construct_code,lesson_slug,cognitive,difficulty,stem_md,options,correct_index,explanation_md)
SELECT (v->>'m')::bigint,v->>'c',v->>'l',(v->>'k')::public.cognitive_level,
  (v->>'d')::integer,v->>'s',v->'o',(v->>'a')::integer,v->>'e'
FROM jsonb_array_elements($bank$
[
  {"m":656,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":2,"s":"O‘qituvchi dars konspektini tuzdi, original material yaratdi va yangi metodni asoslab berdi. Bu faoliyatlarda qaysi qobiliyat umumiy namoyon bo‘lgan?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Kommunikativ qobiliyat","Perseptiv qobiliyat"],"a":1,"e":"Dars mazmunini loyihalash, alohida ma’lumotlardan yaxlit material yaratish va yangi metodni asoslash konstruktiv qobiliyatga xos."},
  {"m":658,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Ta’lim-tarbiya mohiyati, qonuniyatlari, o‘quvchi xususiyatlari va kutiladigan natijalarni tushunishga yordam beradigan qobiliyat qaysi?","o":["Anglash qobiliyati","Bilish qobiliyati","Kommunikativ qobiliyat","Perseptiv qobiliyat"],"a":0,"e":"Anglash qobiliyati pedagogik jarayonning mazmuni, qonuniyatlari, ishtirokchilar xususiyatlari va kutiladigan natijalar o‘rtasidagi bog‘lanishni tushunishni bildiradi."},
  {"m":660,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Ta’lim-tarbiya jarayonini pedagogik talablarga muvofiq uyushtirish va o‘quvchilar jamoasini samarali boshqarish qaysi qobiliyatga xos?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Didaktik qobiliyat","Anglash qobiliyati"],"a":0,"e":"Jarayon va jamoani uyushtirish, vazifalarni muvofiqlashtirish hamda faoliyatni boshqarish tashkilotchilik qobiliyatining asosiy belgilaridir."},
  {"m":661,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Mashg‘ulot yoki tarbiyaviy tadbirning natijasiga olib boradigan samarali yo‘l va vositalarni oldindan topish qaysi qobiliyatga xos?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Didaktik qobiliyat","Anglash qobiliyati"],"a":1,"e":"Faoliyatni metodik jihatdan loyihalash, vositalarni oldindan tanlash va natijaga olib boradigan tuzilmani yaratish konstruktiv qobiliyatga kiradi."},
  {"m":662,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"mulohaza","d":3,"s":"Qaysi uchta harakat kommunikativ qobiliyatga bevosita tegishli? 1) Turli ishtirokchilar bilan mos usulda muloqot qilish. 2) Yosh xususiyatini tashxislash. 3) Axborotni samarali yetkazish. 4) Nazorat topshirig‘ini loyihalash. 5) Xato haqida konstruktiv fikr bildirish.","o":["1, 2 va 3","1, 3 va 5","2, 4 va 5","2, 3 va 4"],"a":1,"e":"Muloqot shaklini tanlash, axborotni tushunarli yetkazish va xato yuzasidan konstruktiv fikr bildirish aloqa jarayoniga bevosita kiradi; tashxis va topshiriq loyihalash boshqa qobiliyatlarga yaqin."},
  {"m":663,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Quyidagi harakatlardan qaysi biri tashkilotchilik qobiliyatini eng aniq ko‘rsatadi?","o":["O‘quv materialini maqsadga muvofiq tanlash","Alohida ma’lumotlardan yaxlit material yaratish","Dars vaqtini oqilona taqsimlab rejani bajarish","Ta’lim qonuniyatlarini faoliyatda hisobga olish"],"a":2,"e":"Vaqt, vazifa va faoliyatni muvofiqlashtirib, rejani to‘liq bajarish tashkilotchilik qobiliyatining bevosita amaliy ko‘rsatkichidir."},
  {"m":665,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":2,"s":"O‘qituvchi tarqoq ma’lumotlardan yaxlit material tuzdi, uni model va diagrammalar bilan boyitib, yangi metodik yechim yaratdi. Qaysi qobiliyat namoyon?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Didaktik qobiliyat","Anglash qobiliyati"],"a":1,"e":"Mazmunni qayta tuzish, ko‘rgazmali vositalar bilan boyitish va original metodik yechim yaratish konstruktiv qobiliyatga xos."},
  {"m":666,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":2,"s":"O‘qituvchi yoshga mos vazifa berdi, diqqatni boshqardi, bahsni uyushtirdi va barcha o‘quvchini o‘yinga jalb etdi. Qaysi qobiliyat ustuvor?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Didaktik qobiliyat","Anglash qobiliyati"],"a":0,"e":"Vazifalarni taqsimlash, diqqat va bahsni boshqarish, barcha ishtirokchini faoliyatga jalb etish tashkilotchilik qobiliyatini ko‘rsatadi."},
  {"m":667,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Maqsad va vazifani belgilash, o‘quv materialini tanlash hamda uni sodda tushuntirish qaysi pedagogik qobiliyatga xos?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Didaktik qobiliyat","Anglash qobiliyati"],"a":2,"e":"Mazmunni maqsadga mos tanlash va o‘quvchiga tushunarli shaklda yetkazish didaktik qobiliyatning markaziy jihatidir."},
  {"m":668,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Hamkorlik muhitini yaratish, rag‘batlantirish va o‘quvchining xatosi haqida konstruktiv fikr bildirish qaysi qobiliyatga xos?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Kommunikativ qobiliyat","Anglash qobiliyati"],"a":2,"e":"Hamkorlikni yo‘lga qo‘yish, rag‘batlantiruvchi aloqa va fikr-mulohaza berish kommunikativ qobiliyat orqali amalga oshadi."},
  {"m":669,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Pedagogik qonuniyatlarni tushunish, o‘quvchini shaxs sifatida anglash va uning yosh-psixologik xususiyatlarini baholash qaysi qobiliyatga xos?","o":["Tashkilotchilik qobiliyati","Konstruktiv qobiliyat","Kommunikativ qobiliyat","Anglash qobiliyati"],"a":3,"e":"Jarayon mohiyatini va o‘quvchining individual xususiyatlarini yaxlit tushunish anglash qobiliyatining mazmunini tashkil etadi."},
  {"m":670,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"O‘qituvchi vaqtni taqsimladi, individual vazifalar berdi, o‘yin va bahsni boshqardi. Kuzatuvchi qaysi qobiliyatni asosiy deb baholashi kerak?","o":["Didaktik qobiliyat","Akademik qobiliyat","Konstruktiv qobiliyat","Tashkilotchilik qobiliyati"],"a":3,"e":"Vaqt, vazifa, o‘yin va bahs jarayonini bir butun faoliyat sifatida boshqarish tashkilotchilik qobiliyatining kompleks namoyonidir."},
  {"m":672,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":2,"s":"Sinf tadbirlarda faol qatnashadi, o‘quvchilar vazifalarni kelishib bajaradi va jamoa jips. Bu natijada o‘qituvchining qaysi qobiliyati ustuvor?","o":["Didaktik qobiliyat","Akademik qobiliyat","Konstruktiv qobiliyat","Tashkilotchilik qobiliyati"],"a":3,"e":"Jamoani jipslashtirish, vazifalarni muvofiqlashtirish va umumiy faoliyatga jalb etish tashkilotchilik qobiliyatining natijasidir."},
  {"m":727,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":3,"s":"Texnologiya va ko‘rgazmali vositalardan foydalanish, ota-onaga pedagogik bilim berish hamda o‘z faoliyatini tahlil qilish qaysi keng qobiliyatga kiritiladi?","o":["Bilish qobiliyati","Konstruktiv qobiliyat","Kommunikativ qobiliyat","Anglash qobiliyati"],"a":0,"e":"Ushbu majmua kasbiy bilimni egallash, yangilash va turli vaziyatlarda asosli qo‘llash bilan bog‘liq bo‘lib, bilish qobiliyatining keng mazmuniga kiradi."},
  {"m":728,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Ishtirokchilar bilan munosabat o‘rnatish, o‘quvchi fikrini tinglash, axborotni yetkazish va nizoni boshqarish qaysi qobiliyatga xos?","o":["Bilish qobiliyati","Konstruktiv qobiliyat","Kommunikativ qobiliyat","Anglash qobiliyati"],"a":2,"e":"Munosabat o‘rnatish, faol tinglash, axborot almashish va nizoni muloqot orqali boshqarish kommunikativ qobiliyatning tarkibiy belgilaridir."},
  {"m":730,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"mulohaza","d":3,"s":"Pedagog vazifalarni belgilaydi, jarayonni rejalashtiradi, metodlarni asosli tanlaydi va natijalarni tahlil qiladi. Ushbu kompleks faoliyat qaysi qobiliyatga yaqin?","o":["Bilish qobiliyati","Konstruktiv qobiliyat","Kommunikativ qobiliyat","Anglash qobiliyati"],"a":0,"e":"Vaziyat haqidagi bilimni rejalash, metod tanlash va natijani tahlil qilishda uyg‘un qo‘llash bilish qobiliyatining kompleks kasbiy namoyoni sifatida talqin etiladi."},
  {"m":731,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":1,"s":"Juda kam uchraydigan va oz sonli shaxslardagina yuqori darajada namoyon bo‘ladigan individual psixologik xususiyat qanday ataladi?","o":["Bilish qobiliyati","Konstruktiv qobiliyat","Noyob qobiliyat","Anglash qobiliyati"],"a":2,"e":"Ko‘pchilikda odatiy darajada uchramaydigan, ayrim shaxslarda favqulodda kuchli namoyon bo‘ladigan imkoniyat noyob qobiliyat deb ataladi."},
  {"m":732,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Bir vaqtda bir necha faoliyatni bajarish, parallel voqealarni kuzatish va g‘ayrioddiy kuchli qiziquvchanlik qaysi qobiliyat belgilaridir?","o":["Bilish qobiliyati","Noyob qobiliyat","Kommunikativ qobiliyat","Anglash qobiliyati"],"a":1,"e":"Bir nechta murakkab faoliyatni parallel boshqarish va favqulodda qiziquvchanlik odatdagi imkoniyatdan yuqori noyob qobiliyat belgilariga kiritiladi."},
  {"m":733,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"Yangi sinfdagi o‘quvchilarning ism va qiziqishlarini bir suhbatdayoq eslab, keyingi darsda barchasiga mos murojaat qilgan pedagogda qaysi qobiliyat ko‘rindi?","o":["Kommunikativ qobiliyat","Bilish qobiliyati","Perseptiv qobiliyat","Noyob qobiliyat"],"a":3,"e":"Bir martalik katta hajmdagi shaxsiy ma’lumotni tez va aniq eslab qolish vaziyatda favqulodda xotira bilan bog‘liq noyob qobiliyatni ko‘rsatadi."},
  {"m":744,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"qollash","d":2,"s":"Sinf rahbari barcha qarorlarni o‘zi qabul qiladi, o‘quvchi tashabbusi va mustaqil fikriga imkon bermaydi. Bu qaysi muloqot uslubi?","o":["Avtoritar uslub","Liberal uslub","Demokratik uslub","Empatik uslub"],"a":0,"e":"Qarorlarni bir tomonlama qabul qilish, qat’iy nazorat va o‘quvchi tashabbusini cheklash avtoritar pedagogik muloqot uslubining belgilaridir."},
  {"m":746,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"qollash","d":2,"s":"O‘qituvchi seminar vazifalarini o‘quvchilarning qobiliyati, qiziqishi va tayyorgarligini hisobga olib, ular bilan kelishgan holda taqsimladi. Qaysi uslub namoyon?","o":["Demokratik uslub","Avtoritar uslub","Liberal uslub","Betaraf uslub"],"a":0,"e":"O‘quvchi xususiyatini hisobga olish, hamkorlik va kelishuv asosida vazifa taqsimlash demokratik muloqot uslubiga xos."},
  {"m":747,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"qollash","d":2,"s":"O‘qituvchi to‘g‘ri javobni rag‘batlantirmadi, tashabbuslarni e’tiborsiz qoldirdi va jarayonga befarq tarzda davom etdi. Qaysi muloqot uslubi ustuvor?","o":["Demokratik uslub","Avtoritar uslub","Liberal uslub","Empatik uslub"],"a":2,"e":"Pedagogning tashabbusga befarqligi, faol rahbarlik va qayta aloqaning sustligi liberal muloqot uslubining salbiy ko‘rinishiga xos."},
  {"m":784,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Pedagogik muloqotda o‘quvchiga tarbiyaviy, hissiy va irodaviy ta’sir ko‘rsatish jarayoni qanday ataladi?","o":["Pedagogik takt","Pedagogik odob","Kommunikativ ta’sir","Pedagogik nazokat"],"a":2,"e":"Kommunikativ ta’sir pedagogning muloqot vositalari orqali o‘quvchi qarashi, hissiy holati yoki xatti-harakatiga maqsadli ta’sir etish jarayonidir."},
  {"m":787,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":1,"s":"Pedagogning o‘ziga, kasbiga, jamiyatga va ta’lim ishtirokchilari bilan munosabatiga qo‘yadigan axloqiy talablar tizimi nima?","o":["Pedagogik bilimdonlik","Pedagogik obro‘","Pedagogik odob","Pedagogik nazokat"],"a":2,"e":"Pedagogik odob kasbiy faoliyat va munosabatlarda amal qilinadigan axloqiy talablar, qadriyatlar va xulq me’yorlari tizimidir."},
  {"m":789,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"qollash","d":2,"s":"O‘quvchi o‘z qo‘l mehnatini ko‘rsatganda o‘qituvchi qiziqib savol berdi va yutug‘ini samimiy e’tirof etdi. Qaysi xususiyat ko‘proq namoyon bo‘ldi?","o":["Pedagogik odob","Pedagogik nazokat","Pedagogik ijodkorlik","Pedagogik madaniyat"],"a":1,"e":"O‘quvchining tashabbusini nozik his etib, unga o‘rinli va samimiy munosabat bildirish pedagogik nazokatning vaziyatga mos ko‘rinishidir."},
  {"m":790,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"qollash","d":2,"s":"Pedagog javobni diqqat bilan tingladi, xatoni vazmin tuzatdi, natijani xolis baholab, baho sababini tushuntirdi. Qaysi xususiyat namoyon?","o":["Pedagogik takt","Pedagogik odob","Pedagogik mahorat","Pedagogik bilimdonlik"],"a":0,"e":"Vaziyatga mos ohang, me’yor, xolislik va o‘quvchi qadr-qimmatini saqlagan holda tuzatish pedagogik taktning amaliy namoyonidir."},
  {"m":791,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"qollash","d":2,"s":"O‘qituvchi talabchanlikni ishonch va hurmat bilan uyg‘unlashtirdi; natijada sinfda nizolar kamaydi. Qaysi xususiyat ustuvor?","o":["Pedagogik takt","Pedagogik odob","Pedagogik mahorat","Pedagogik bilimdonlik"],"a":0,"e":"Talabchanlik va hurmat o‘rtasidagi me’yorni vaziyatga mos saqlash, ishonchni yo‘qotmasdan ta’sir ko‘rsatish pedagogik taktga xos."},
  {"m":794,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Pedagogik munosabatda ko‘zlangan maqsadga erishish uchun vaziyatga mos yo‘l, shakl, metod va vositalar majmui nima deyiladi?","o":["Pedagogik taktika","Pedagogik odob","Pedagogik texnika","Pedagogik nazokat"],"a":0,"e":"Pedagogik taktika muayyan vaziyat va maqsadga mos ravishda tanlanadigan ta’sir yo‘li, shakli, metodi hamda vositalari majmuini anglatadi."},
  {"m":798,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"Rahbar shikoyat bilan kelgan ota-onani tingladi, hissiy holatini hisobga olib, muloyim va asosli suhbat orqali vaziyatni tinchlantirdi. Qaysi qobiliyat ustuvor?","o":["Bilish qobiliyati","Konstruktiv qobiliyat","Kommunikativ qobiliyat","Anglash qobiliyati"],"a":2,"e":"Faol tinglash, vaziyatga mos til va ohang tanlash, suhbat orqali keskinlikni pasaytirish kommunikativ qobiliyatning amaliy namoyonidir."},
  {"m":859,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"mulohaza","d":3,"s":"Pedagogik nizo paydo bo‘lishiga bevosita ta’sir etuvchi omillarni belgilang: 1) axborot omili; 2) munosabat omili; 3) shaxsning o‘zi; 4) xulq-atvor omili.","o":["1, 2 va 3","2, 3 va 4","1, 3 va 4","1, 2 va 4"],"a":3,"e":"Nizo tahlilida axborotning yetishmasligi yoki buzilishi, tomonlar munosabati va kuzatiladigan xulq-atvor bevosita omillar sifatida ajratiladi; shaxsning o‘zi avtomatik ravishda nizo omili deb olinmaydi."}
]
$bank$::jsonb) AS source(v);

DO $task530_b08$
DECLARE
  b task530_batch08%rowtype; actor uuid; subject_id uuid; construct_id uuid; lesson_id uuid;
  question_id uuid; option_id uuid; option_ids uuid[]; i integer; n integer; bad integer;
  bad_id uuid; bad_code text; bad_source text;
BEGIN
  IF (SELECT count(*) FROM task530_batch08)<>30 THEN RAISE EXCEPTION 'TASK530_B08_COUNT'; END IF;
  IF EXISTS(SELECT 1 FROM task530_batch08 tb JOIN public.questions q
    ON q.source_reference='telegram:@PedMahoratGuli:'||tb.message_id::text
    OR q.source_reference LIKE 'telegram:@PedMahoratGuli:'||tb.message_id::text||'|%')
  THEN RAISE EXCEPTION 'TASK530_B08_SOURCE_ALREADY_REPRESENTED'; END IF;
  SELECT id INTO STRICT actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
  THEN RAISE EXCEPTION 'TASK530_B08_OWNER_NOT_UNIQUE'; END IF;
  SELECT id INTO STRICT subject_id FROM public.subjects WHERE code='informatika';
  CREATE TEMP TABLE task530_b08_ids(id uuid PRIMARY KEY) ON COMMIT DROP;
  FOR b IN SELECT * FROM task530_batch08 ORDER BY message_id LOOP
    SELECT c.id,l.id INTO STRICT construct_id,lesson_id
    FROM public.constructs c JOIN public.lesson_constructs lc ON lc.construct_id=c.id
    JOIN public.lessons l ON l.id=lc.lesson_id
    WHERE c.code=b.construct_code AND c.is_active AND l.slug=b.lesson_slug
      AND l.status='published'::public.content_status;
    IF EXISTS(SELECT 1 FROM public.questions q WHERE q.status IN('review','published')
      AND regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g')=
          regexp_replace(lower(btrim(b.stem_md)),'[^[:alnum:]]+','','g'))
    THEN RAISE EXCEPTION 'TASK530_B08_ACTIVE_EXACT_DUPLICATE_%',b.message_id; END IF;
    question_id:=gen_random_uuid();
    INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,status,author_id,is_generated,source_lesson_id,source_reference)
    VALUES(question_id,subject_id,construct_id,'PM.GEN','Y1'::public.question_format,b.cognitive,b.difficulty,
      b.stem_md,'review'::public.content_status,NULL,true,lesson_id,b.source_reference);
    INSERT INTO task530_b08_ids VALUES(question_id);
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
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correctw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') maxwrong
    FROM task530_b08_ids r JOIN public.questions q ON q.id=r.id
    JOIN public.question_options o ON o.question_id=q.id AND btrim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id GROUP BY q.id
  ) SELECT count(*) FILTER(WHERE option_count<>4 OR distinct_count<>4 OR correct_count<>1
      OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25),count(*) INTO bad,n FROM checks;
  IF bad<>0 OR n<>30 THEN RAISE EXCEPTION 'TASK530_B08_BALANCE_%_COUNT_%',bad,n; END IF;
  INSERT INTO public.pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance)
  SELECT q.id,actor,public.professional_question_fingerprint(q.id),'owner_explicit_no_external_expert_20261018',
    'TASK-530 batch 08; owner-delegated AI expert rewrite of PedMahoratGuli ability/communication items; key independently checked; independent human expert signoff NOT claimed'
  FROM task530_b08_ids r JOIN public.questions q ON q.id=r.id;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>30 THEN RAISE EXCEPTION 'TASK530_B08_WAIVERS_%',n; END IF;
  SELECT r.id,q.source_reference,s.finding_code INTO bad_id,bad_source,bad_code
  FROM task530_b08_ids r JOIN public.questions q ON q.id=r.id
  CROSS JOIN LATERAL public.pedagogy_semantic_quality_signals(r.id) s
  WHERE s.severity='high' ORDER BY r.id,s.finding_code LIMIT 1;
  IF bad_id IS NOT NULL THEN RAISE EXCEPTION 'TASK530_B08_SEMANTIC_%_%',bad_source,bad_code; END IF;
  UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
  FROM task530_b08_ids r WHERE q.id=r.id AND q.status='review'::public.content_status;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>30 THEN RAISE EXCEPTION 'TASK530_B08_PUBLISHED_%',n; END IF;
  SELECT count(*) INTO n FROM task530_b08_ids r JOIN public.questions q ON q.id=r.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF n<>30 THEN RAISE EXCEPTION 'TASK530_B08_POSTFLIGHT_%_OF_30',n; END IF;
END
$task530_b08$;
COMMIT;
