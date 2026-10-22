-- TASK-530 — seventh expert-screened PedMahoratGuli intake batch.
-- Professional competence, self-development, reflection, ethics and ability.
BEGIN;
SET LOCAL lock_timeout='8s';
SET LOCAL statement_timeout='120s';

CREATE TEMP TABLE task530_batch07(
  message_id bigint PRIMARY KEY, construct_code text NOT NULL, lesson_slug text NOT NULL,
  cognitive public.cognitive_level NOT NULL, difficulty integer NOT NULL,
  stem_md text NOT NULL, options jsonb NOT NULL CHECK(jsonb_array_length(options)=4),
  correct_index integer NOT NULL CHECK(correct_index BETWEEN 0 AND 3), explanation_md text NOT NULL,
  source_reference text GENERATED ALWAYS AS(
    'telegram:@PedMahoratGuli:'||message_id::text||'|task428:expert-rewrite:v1') STORED
) ON COMMIT DROP;

INSERT INTO task530_batch07(message_id,construct_code,lesson_slug,cognitive,difficulty,stem_md,options,correct_index,explanation_md)
SELECT (v->>'m')::bigint,v->>'c',v->>'l',(v->>'k')::public.cognitive_level,
  (v->>'d')::integer,v->>'s',v->'o',(v->>'a')::integer,v->>'e'
FROM jsonb_array_elements($bank$
[
  {"m":448,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":1,"s":"Lotincha competence atamasi kasbiy faoliyat nuqtayi nazaridan qaysi ma’noni anglatadi?","o":["Xarakter xususiyati","Temperament xususiyati","Qobiliyat va vakolatlilik","Sezgi va idrok"],"a":2,"e":"Competence atamasi tegishli sohada qobiliyat, layoqat va vakolatlilikni anglatadi. U shaxsning vazifani talab darajasida bajarish salohiyatini ifodalaydi."},
  {"m":449,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":1,"s":"Mutaxassis zarur bilim, ko‘nikma va malakalarni egallab, ularni amalda yuqori darajada qo‘llay olsa, bu qaysi sifatni bildiradi?","o":["Nazariy bilimdonlik","Kasbiy kompetentlik","Amaliy ko‘nikma","Avtomatlashgan malaka"],"a":1,"e":"Kasbiy kompetentlik bilim, ko‘nikma, malaka va tajribani kasbiy vazifalarda samarali qo‘llashga tayyorlik hamda qobiliyatni birlashtiradi."},
  {"m":454,"c":"KS.07","l":"hamkasblar-va-ota-onalar-bilan-hamkorlik","k":"bilish","d":2,"s":"Kasbiy faoliyat ishtirokchilari bilan muloqotga kirishish va ijtimoiy munosabatlarda faol hamkorlik qilish qaysi kompetentlikka xos?","o":["Shaxsiy kompetentlik","Maxsus kompetentlik","Ijtimoiy kompetentlik","Ekstremal kompetentlik"],"a":2,"e":"Ijtimoiy kompetentlik boshqalar bilan aloqa o‘rnatish, hamkorlik qilish, kasbiy munosabatlarda faol va mas’uliyatli ishtirok etishni qamrab oladi."},
  {"m":457,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"Pedagogning muntazam kasbiy o‘sishi, malakasini oshirishi va ichki imkoniyatlarini namoyon qilishi qaysi kompetentlikni ifodalaydi?","o":["Shaxsiy kompetentlik","Maxsus kompetentlik","Ijtimoiy kompetentlik","Ekstremal kompetentlik"],"a":0,"e":"Shaxsiy kompetentlik pedagogning o‘z salohiyatini anglash, uzluksiz rivojlanish, kasbiy o‘sish va o‘zini ro‘yobga chiqarishga tayyorligini bildiradi."},
  {"m":458,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"Ilg‘or texnologiyalarni o‘zlashtirish va zamonaviy vositalardan kasbiy faoliyatda samarali foydalanish qaysi kompetentlikka kiradi?","o":["Texnologik kompetentlik","Maxsus kompetentlik","Ijtimoiy kompetentlik","Ekstremal kompetentlik"],"a":0,"e":"Texnologik kompetentlik zamonaviy vosita, texnika va texnologiyalarni tanlash, o‘zlashtirish hamda pedagogik maqsadga muvofiq qo‘llashni anglatadi."},
  {"m":459,"c":"KS.05","l":"xavfsiz-rivojlantiruvchi-talim-muhiti","k":"qollash","d":3,"s":"Pedagog favqulodda vaziyat yoki keskin pedagogik nizoda tez va asosli qaror qabul qilib, xavfsiz harakat rejasini tanladi. Qaysi kompetentlik namoyon?","o":["Maxsus kompetentlik","Ekstremal kompetentlik","Ijtimoiy kompetentlik","Texnologik kompetentlik"],"a":1,"e":"Ekstremal kompetentlik odatiy bo‘lmagan, xavfli yoki keskin vaziyatda vaziyatni baholab, oqilona va xavfsiz harakat qilish qobiliyatidir."},
  {"m":463,"c":"KS.07","l":"hamkasblar-va-ota-onalar-bilan-hamkorlik","k":"bilish","d":2,"s":"Ta’lim ishtirokchilarini tinglash, ular bilan samimiy muloqot qilish va ijobiy ta’sir ko‘rsatish maxsus kompetentlikning qaysi ko‘rinishi?","o":["Psixologik kompetentlik","Kommunikativ kompetentlik","Kreativ kompetentlik","Metodik kompetentlik"],"a":1,"e":"Kommunikativ kompetentlik suhbatdoshni tinglash, fikrni aniq ifodalash, aloqa o‘rnatish va muloqot orqali konstruktiv ta’sir ko‘rsatishni qamrab oladi."},
  {"m":464,"c":"KS.05","l":"xavfsiz-rivojlantiruvchi-talim-muhiti","k":"bilish","d":2,"s":"Sog‘lom psixologik muhit yaratish, ziddiyat alomatlarini o‘z vaqtida anglash va ularni bartaraf etish qaysi kompetentlikka xos?","o":["Psixologik kompetentlik","Kommunikativ kompetentlik","Kreativ kompetentlik","Metodik kompetentlik"],"a":0,"e":"Psixologik kompetentlik ishtirokchilarning ruhiy holatini tushunish, sog‘lom muhit yaratish va salbiy psixologik ziddiyatlarni oldini olishga yordam beradi."},
  {"m":465,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"Ta’lim sifatini yaxshilash uchun yangi g‘oyalarni ilgari surish va ularni amaliyotga muvaffaqiyatli tatbiq etish qaysi kompetentlikdir?","o":["Psixologik kompetentlik","Kommunikativ kompetentlik","Kreativ kompetentlik","Innovatsion kompetentlik"],"a":3,"e":"Innovatsion kompetentlik yangi pedagogik g‘oyani aniqlash, asoslash, tajribadan o‘tkazish va ta’lim amaliyotiga samarali joriy eta olishni anglatadi."},
  {"m":466,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"bilish","d":2,"s":"Ta’lim shakli, metod va vositalarini maqsadga muvofiq tanlash hamda samarali qo‘llash qaysi kompetentlikni ifodalaydi?","o":["Psixologik kompetentlik","Kommunikativ kompetentlik","Kreativ kompetentlik","Metodik kompetentlik"],"a":3,"e":"Metodik kompetentlik pedagogik jarayonni metodik jihatdan loyihalash, mos shakl va metodlarni tanlash hamda vositalardan samarali foydalanishni bildiradi."},
  {"m":469,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":1,"s":"Shaxsning ijtimoiy va kasbiy kamolotga erishish uchun maqsadli, izchil va tizimli harakatlarni tashkil etishi nima deyiladi?","o":["Shaxsiy rivojlanish jarayoni","O‘zini baholash jarayoni","Faoliyatni tahlil qilish","O‘z ustida ishlash"],"a":3,"e":"O‘z ustida ishlash kasbiy va shaxsiy rivojlanishga qaratilgan rejalashtirilgan, izchil hamda tizimli amaliy harakatlar jarayonidir."},
  {"m":470,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"Pedagogning o‘z ustida ishlash jarayonidagi birinchi bosqich qaysi harakatdan boshlanadi?","o":["Yutuq va kamchilik bo‘yicha qaror qabul qilishdan","Qarorni amalga oshirish yo‘llarini izlab topishdan","Faoliyatdagi yutuq va kamchiliklarni tahlil qilishdan","Qabul qilingan qaror ijrosini nazorat qilishdan"],"a":2,"e":"Rivojlanish jarayoni mavjud faoliyatni tahlil qilib, kuchli va zaif tomonlarni aniqlashdan boshlanadi. Keyingi qaror va reja shu tashxisga tayangan holda tuziladi."},
  {"m":471,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"O‘z ustida ishlashda qabul qilingan qarorning izchil bajarilishini muntazam kuzatib borish qaysi bosqichga tegishli?","o":["Birinchi tahlil bosqichi","Ikkinchi qaror bosqichi","Uchinchi rejalash bosqichi","Beshinchi nazorat bosqichi"],"a":3,"e":"Bosqichli modelda yakuniy, beshinchi bosqich qabul qilingan rivojlanish qarorining amalda izchil bajarilishini muntazam nazorat qilishga qaratiladi."},
  {"m":472,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"O‘z ustida ishlashning to‘rtinchi bosqichida pedagog qaysi harakatni amalga oshiradi?","o":["Yutuq va kamchilik bo‘yicha qaror qabul qiladi","Qarorni bajarishning samarali yo‘llarini izlaydi","Faoliyatidagi kuchli va zaif jihatlarni tahlil qiladi","Xato va kamchiliklarni qayta takrorlamaslikka intiladi"],"a":3,"e":"To‘rtinchi bosqichda pedagog tanlangan yo‘lni amalda bajarib, avval aniqlangan xato va kamchiliklarning takrorlanishiga yo‘l qo‘ymaslikka intiladi."},
  {"m":507,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":1,"s":"Pedagogning kasbiy faoliyatdagi o‘z amaliy harakatlari mazmuni va natijasini o‘rganishi nima deyiladi?","o":["Kasbiy rivojlanish jarayoni","O‘zini baholash jarayoni","Faoliyatni tahlil qilish","Shaxsiy o‘zini anglash"],"a":2,"e":"O‘z faoliyatini tahlil qilish pedagogning bajargan harakatlari, qarorlari va natijalarini dalillar asosida o‘rganib, kuchli hamda zaif jihatlarni aniqlashidir."},
  {"m":508,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":1,"s":"Shaxsning o‘z faoliyatini tahlil qilish natijasida o‘z imkoniyat va natijalariga qiymat berishi nima deyiladi?","o":["Kasbiy rivojlanish jarayoni","O‘zini baholash jarayoni","Faoliyatni tahlil qilish","Shaxsiy o‘zini anglash"],"a":1,"e":"O‘z-o‘zini baholash shaxsning tahlil natijalariga tayanib, o‘z imkoniyati, xatti-harakati va erishgan natijalariga asoslangan baho berishidir."},
  {"m":513,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":1,"s":"Pedagogik jarayonni tashkiliy, metodik va psixologik jihatdan mohirona tashkil etish hamda boshqarish qobiliyati nima deyiladi?","o":["Pedagogik tajriba","Pedagogik yondashuv","Pedagogik mahorat","Pedagogik bilimdonlik"],"a":2,"e":"Pedagogik mahorat kasbiy bilim, qobiliyat, texnika va tajribani uyg‘unlashtirib, ta’lim-tarbiya jarayonini yuqori darajada tashkil etish san’atidir."},
  {"m":516,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":2,"s":"O‘qituvchi kasbiy axborotni izlaydi, mazmunga mos qayta ishlaydi va undan darsda asosli foydalanadi. Bu qaysi xususiyatni ko‘rsatadi?","o":["Pedagogik mahorat","Pedagogik odob","Pedagogik bilimdonlik","Pedagogik refleksiya"],"a":2,"e":"Kasbiy axborotni topish, tushunish, qayta ishlash va mazmunli qo‘llash pedagogik bilimdonlikning namoyonidir. Refleksiya esa o‘z faoliyatini tahlil qilishga qaratiladi."},
  {"m":519,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":1,"s":"Pedagogik refleksiyaning mazmunini qaysi ta’rif aniqroq ifodalaydi?","o":["Kasbiy faoliyatni anglash va o‘zini boshqarish jarayoni","Pedagogika bo‘yicha umumiy nazariy bilimlar majmui","Kasbiy vazifalarni bajarish uchun amaliy malakalar majmui","Pedagogning jamoada egallagan rasmiy mavqeyi"],"a":0,"e":"Refleksiya pedagogning o‘z harakati, qarori, hissiyoti va natijalarini anglash, baholash hamda keyingi faoliyatini ongli boshqarish jarayonidir."},
  {"m":520,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":1,"s":"Pedagogik refleksiya o‘qituvchiga eng avvalo qanday imkoniyat beradi?","o":["Baholarni avtomatik ravishda yuqorilatish","O‘z faoliyatini baholash va takomillashtirish","Yangi darslikni mustaqil ravishda yaratish","Dars vaqtini doimo qisqartirib borish"],"a":1,"e":"Refleksiya o‘qituvchiga o‘z faoliyatining natija va sabablarini anglash, kamchiliklarni aniqlash hamda keyingi ishini maqsadli takomillashtirish imkonini beradi."},
  {"m":524,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":1,"s":"Pedagogik odobning asosiy tayanchi qaysi munosabatda namoyon bo‘ladi?","o":["O‘quvchiga hurmat va samimiyat bilan yondashishda","O‘quvchiga qat’iy va sovuqqon munosabat ko‘rsatishda","O‘quvchi ehtiyojlariga befarq bo‘lib qolishda","Muloqotdan ko‘ra faqat fan mazmunini ustun qo‘yishda"],"a":0,"e":"Pedagogik odob o‘quvchi qadr-qimmatini tan olish, hurmat, samimiyat, adolat va mas’uliyatli munosabatga tayanadi."},
  {"m":528,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"O‘quvchi xulqi va xizmatini xolis mezon asosida haqqoniy baholash pedagogik odobning qaysi ko‘rinishini ifodalaydi?","o":["Pedagogik adolat","Pedagogik burch","Pedagogik majburiyat","Kasbiy mas’uliyat"],"a":0,"e":"Pedagogik adolat o‘quvchining xatti-harakati va natijasini xolis mezon asosida, kamsitmasdan va xizmatiga mos ravishda baholashni anglatadi."},
  {"m":529,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Kasbiy vazifalarni vijdonan bajarish va hamkasblar bilan to‘g‘ri munosabat o‘rnatish pedagogik odobning qaysi shakliga kiradi?","o":["Kasbiy burch","Pedagogik adolat","Pedagogik nazokat","Pedagogik texnika"],"a":0,"e":"Kasbiy pedagogik burch pedagogning ta’limiy vazifalarni mas’uliyat bilan bajarishi, hamkasblar va boshqa ishtirokchilar bilan axloqiy munosabatni saqlashini bildiradi."},
  {"m":531,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Kasbiy pedagogik burchni ado etishda o‘qituvchi o‘quvchi rivojiga qanday yondashishi kerak?","o":["Ilmiy rivojlanishni boshqa jihatlardan ajratib ko‘rish","Axloqiy va ma’naviy rivojlanishni ham qo‘llab-quvvatlash","Baholashni tarbiyadan ustun qo‘yib tashkil etish","Texnik ko‘nikmalarni yagona maqsad sifatida tanlash"],"a":1,"e":"Pedagogik burch bilim berish bilan cheklanmaydi; u o‘quvchining ma’naviy-axloqiy kamoloti, qadr-qimmati va har tomonlama rivojini qo‘llab-quvvatlashni talab qiladi."},
  {"m":532,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Pedagog o‘zining qaysi kasbiy xususiyatiga tayanib o‘quvchi ishonchini qozonadi va xulqiga ijobiy ta’sir ko‘rsatadi?","o":["Pedagogik bilimdonlik","Pedagogik obro‘","Pedagogik odob","Pedagogik nazokat"],"a":1,"e":"Pedagogik obro‘ bilim, adolat, izchillik va shaxsiy namuna asosida shakllanadi; u o‘qituvchining o‘quvchiga zo‘rliksiz ijobiy ta’sir ko‘rsatishiga imkon beradi."},
  {"m":557,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":1,"s":"Psixologiyada shaxs qobiliyatlari qaysi asosiy guruhlarga ajratiladi?","o":["Shaxsiy va ichki qobiliyatlarga","Umumiy va maxsus qobiliyatlarga","Umumiy va xususiy qobiliyatlarga","Pedagogik va kasbiy qobiliyatlarga"],"a":1,"e":"Umumiy qobiliyatlar ko‘plab faoliyat turlarida, maxsus qobiliyatlar esa muayyan faoliyat sohasida muvaffaqiyatni ta’minlaydi."},
  {"m":558,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":1,"s":"Pedagogik faoliyatni oqilona tashkil etish va kasbiy vazifalarni muvaffaqiyatli bajarishga yordam beradigan individual xususiyatlar nima deyiladi?","o":["Pedagogik mahorat","Pedagogik bilimdonlik","Pedagogik qobiliyat","Pedagogik takt"],"a":2,"e":"Pedagogik qobiliyat o‘qituvchining ta’lim-tarbiya vazifalarini muvaffaqiyatli bajarishini ta’minlaydigan individual psixologik xususiyatlar majmuidir."},
  {"m":559,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"Pedagogning faoliyatni ijtimoiy talab, huquqiy me’yor va kasbiy standartlarga muvofiq tashkil eta olish tayyorgarligi nima deyiladi?","o":["Pedagogik tajriba","Pedagogik yondashuv","Pedagogik mahorat","Pedagogik bilimdonlik"],"a":3,"e":"Pedagogik bilimdonlik kasbiy me’yor, standart va zarur bilimlarni anglab, faoliyatni ularga muvofiq tashkil etishga tayyorlikni ifodalaydi."},
  {"m":560,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":1,"s":"Muayyan faoliyat turida muvaffaqiyatni ta’minlaydigan qobiliyatlar qanday ataladi?","o":["Maxsus qobiliyatlar","Umumiy qobiliyatlar","Kasbiy malakalar","Shaxsiy sifatlar"],"a":0,"e":"Maxsus qobiliyatlar musiqa, matematika, pedagogika kabi muayyan faoliyat sohasida yuqori natijaga erishishga yordam beradigan xususiyatlardir."},
  {"m":561,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":1,"s":"Shaxsning muayyan faoliyatni oson va muvaffaqiyatli egallashiga yordam beradigan individual psixologik xususiyat nima?","o":["Qobiliyat","Mahorat","Bilim","Malaka"],"a":0,"e":"Qobiliyat faoliyatni muvaffaqiyatli egallash va bajarishga zamin yaratadigan individual psixologik xususiyatdir; u tayyor bilim yoki malakaning o‘zi emas."}
]
$bank$::jsonb) AS source(v);

DO $task530_b07$
DECLARE
  b task530_batch07%rowtype; actor uuid; subject_id uuid; construct_id uuid; lesson_id uuid;
  question_id uuid; option_id uuid; option_ids uuid[]; i integer; n integer; bad integer;
  bad_id uuid; bad_code text; bad_source text;
BEGIN
  IF (SELECT count(*) FROM task530_batch07)<>30 THEN RAISE EXCEPTION 'TASK530_B07_COUNT'; END IF;
  IF EXISTS(SELECT 1 FROM task530_batch07 tb JOIN public.questions q
    ON q.source_reference='telegram:@PedMahoratGuli:'||tb.message_id::text
    OR q.source_reference LIKE 'telegram:@PedMahoratGuli:'||tb.message_id::text||'|%')
  THEN RAISE EXCEPTION 'TASK530_B07_SOURCE_ALREADY_REPRESENTED'; END IF;
  SELECT id INTO STRICT actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
  THEN RAISE EXCEPTION 'TASK530_B07_OWNER_NOT_UNIQUE'; END IF;
  SELECT id INTO STRICT subject_id FROM public.subjects WHERE code='informatika';
  CREATE TEMP TABLE task530_b07_ids(id uuid PRIMARY KEY) ON COMMIT DROP;

  FOR b IN SELECT * FROM task530_batch07 ORDER BY message_id LOOP
    SELECT c.id,l.id INTO STRICT construct_id,lesson_id
    FROM public.constructs c JOIN public.lesson_constructs lc ON lc.construct_id=c.id
    JOIN public.lessons l ON l.id=lc.lesson_id
    WHERE c.code=b.construct_code AND c.is_active AND l.slug=b.lesson_slug
      AND l.status='published'::public.content_status;
    IF EXISTS(SELECT 1 FROM public.questions q WHERE q.status IN('review','published')
      AND regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g')=
          regexp_replace(lower(btrim(b.stem_md)),'[^[:alnum:]]+','','g'))
    THEN RAISE EXCEPTION 'TASK530_B07_ACTIVE_EXACT_DUPLICATE_%',b.message_id; END IF;
    question_id:=gen_random_uuid();
    INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,status,author_id,is_generated,source_lesson_id,source_reference)
    VALUES(question_id,subject_id,construct_id,
      CASE WHEN b.construct_code LIKE 'KS.%' THEN 'KS' ELSE 'PM.GEN' END,
      'Y1'::public.question_format,b.cognitive,b.difficulty,b.stem_md,
      'review'::public.content_status,NULL,true,lesson_id,b.source_reference);
    INSERT INTO task530_b07_ids VALUES(question_id);
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
    FROM task530_b07_ids r JOIN public.questions q ON q.id=r.id
    JOIN public.question_options o ON o.question_id=q.id AND btrim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id GROUP BY q.id
  ) SELECT count(*) FILTER(WHERE option_count<>4 OR distinct_count<>4 OR correct_count<>1
      OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25),count(*) INTO bad,n FROM checks;
  IF bad<>0 OR n<>30 THEN RAISE EXCEPTION 'TASK530_B07_BALANCE_%_COUNT_%',bad,n; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance)
  SELECT q.id,actor,public.professional_question_fingerprint(q.id),'owner_explicit_no_external_expert_20261018',
    'TASK-530 batch 07; owner-delegated AI expert rewrite of PedMahoratGuli competence/reflection/ethics items; key independently checked; independent human expert signoff NOT claimed'
  FROM task530_b07_ids r JOIN public.questions q ON q.id=r.id;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>30 THEN RAISE EXCEPTION 'TASK530_B07_WAIVERS_%',n; END IF;
  SELECT r.id,q.source_reference,s.finding_code INTO bad_id,bad_source,bad_code
  FROM task530_b07_ids r JOIN public.questions q ON q.id=r.id
  CROSS JOIN LATERAL public.pedagogy_semantic_quality_signals(r.id) s
  WHERE s.severity='high' ORDER BY r.id,s.finding_code LIMIT 1;
  IF bad_id IS NOT NULL THEN RAISE EXCEPTION 'TASK530_B07_SEMANTIC_%_%',bad_source,bad_code; END IF;
  UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
  FROM task530_b07_ids r WHERE q.id=r.id AND q.status='review'::public.content_status;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>30 THEN RAISE EXCEPTION 'TASK530_B07_PUBLISHED_%',n; END IF;
  SELECT count(*) INTO n FROM task530_b07_ids r JOIN public.questions q ON q.id=r.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF n<>30 THEN RAISE EXCEPTION 'TASK530_B07_POSTFLIGHT_%_OF_30',n; END IF;
END
$task530_b07$;
COMMIT;
