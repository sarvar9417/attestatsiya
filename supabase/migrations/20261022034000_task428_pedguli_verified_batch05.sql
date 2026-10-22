-- TASK-428 — fifth expert-screened PedMahoratGuli intake batch.
-- Pedagogical technique and ability concepts, independently rewritten and keyed.
BEGIN;
SET LOCAL lock_timeout='8s';
SET LOCAL statement_timeout='120s';

CREATE TEMP TABLE task428_batch05(
  message_id bigint PRIMARY KEY, construct_code text NOT NULL, lesson_slug text NOT NULL,
  cognitive public.cognitive_level NOT NULL, difficulty integer NOT NULL,
  stem_md text NOT NULL, options jsonb NOT NULL CHECK(jsonb_array_length(options)=4),
  correct_index integer NOT NULL CHECK(correct_index BETWEEN 0 AND 3), explanation_md text NOT NULL,
  source_reference text GENERATED ALWAYS AS(
    'telegram:@PedMahoratGuli:'||message_id::text||'|task428:expert-rewrite:v1') STORED
) ON COMMIT DROP;

INSERT INTO task428_batch05(message_id,construct_code,lesson_slug,cognitive,difficulty,stem_md,options,correct_index,explanation_md)
SELECT (v->>'m')::bigint,v->>'c',v->>'l',(v->>'k')::public.cognitive_level,
  (v->>'d')::integer,v->>'s',v->'o',(v->>'a')::integer,v->>'e'
FROM jsonb_array_elements($bank$
[
  {"m":847,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Quyidagilardan qaysi majmua pedagogik texnikaning asosiy ko‘rinishlarini to‘liqroq ifodalaydi?","o":["Hissiy o‘zini boshqarish, mimika-pantomimika, jest, nutq va ritmika","Fan mazmunini bilish, darslik tanlash, baholash va hisobot yozish","O‘quv reja tuzish, jurnal yuritish, majlis va navbatchilikni boshqarish","Tadqiqot o‘tkazish, maqola yozish, tajriba va statistikani tahlil qilish"],"a":0,"e":"Pedagogik texnika o‘qituvchining o‘z holatini, tana va yuz ifodasini, jestni hamda ovoz-nutq vositalarini boshqarish usullarini qamrab oladi. Fan bilimining o‘zi texnika tarkibi emas."},
  {"m":848,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Pedagogik ta’sir metodlarini alohida o‘quvchi va jamoaga amalda samarali qo‘llash uchun zarur bilim, ko‘nikma va malakalar majmui nima deyiladi?","o":["Pedagogik takt — vaziyatda me’yor va hurmatni saqlash","Pedagogik texnika — ta’sir vositalarini mohirona boshqarish","Pedagogik empatiya — boshqaning hissiy holatini tushunish","Pedagogik strategiya — uzoq muddatli maqsadlar tizimini belgilash"],"a":1,"e":"Pedagogik texnika ta’sir ko‘rsatish vositalari va usullarini amalda boshqarishga xizmat qiladigan bilim hamda ko‘nikmalar majmuidir. Takt esa bu vositalarni odob bilan qo‘llash mezonidir."},
  {"m":849,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Fikr, kayfiyat va hissiy holatni qosh, ko‘z hamda yuz mushaklari harakati orqali ifodalash san’ati nima deyiladi?","o":["Pantomimika — gavda, qo‘l va oyoq harakati bilan ifodalash","Mimika — yuz mushaklari va nigoh orqali ifodalash","Nutq texnikasi — ovoz, nafas va sur’atni boshqarish","Pedagogik takt — muloqot me’yorini vaziyatga mos saqlash"],"a":1,"e":"Qosh, ko‘z, nigoh va yuz mushaklari orqali hissiy holatni ifodalash mimika hisoblanadi. Pantomimika esa butun gavda va yirik tana harakatlariga taalluqli."},
  {"m":1111,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"Musobaqada yutqazgan o‘quvchilarning tushkunligini o‘qituvchi his qildi, ularning holatini tushunib, dalda berdi va keyingi tanlovga tayyorlashni taklif qildi. Qaysi qobiliyat namoyon?","o":["Konstruktiv qobiliyat — faoliyat mazmunini oldindan loyihalash","Tashkilotchilik qobiliyati — jamoa ishini uyushtirib boshqarish","Didaktik qobiliyat — bilimni sodda va tushunarli yetkazish","Empatik qobiliyat — boshqaning hissiy holatini his etish"],"a":3,"e":"O‘qituvchi o‘quvchilarning tushkunligini ichdan tushunib, ularning hissiy ehtiyojiga mos dalda berdi. Bu empatik qobiliyatning amaliy namoyonidir."},
  {"m":1114,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"O‘qituvchi o‘quv-tarbiyaviy faoliyatni puxta loyihaladi, ehtimoliy vaziyatlarni oldindan hisobga oldi va muammolar uchun muqobil yechimlarni rejalashtirdi. Qaysi qobiliyat ustuvor?","o":["Perseptiv qobiliyat — o‘quvchining ichki holatini nozik anglash","Kommunikativ qobiliyat — turli ishtirokchi bilan aloqa o‘rnatish","Konstruktiv qobiliyat — faoliyat va yechimlarni oldindan loyihalash","Akademik qobiliyat — o‘qitiladigan fan mazmunini chuqur bilish"],"a":2,"e":"Faoliyatni oldindan loyihalash, ehtimoliy vaziyatlarni hisobga olish va yechim variantlarini tuzish konstruktiv qobiliyatning asosiy belgilaridir."},
  {"m":1117,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"O‘qituvchi o‘z fanini chuqur biladi, sohadagi yangiliklarni muntazam o‘rganadi va murakkab savollarga ilmiy asoslangan javob beradi. Qaysi qobiliyat namoyon bo‘lgan?","o":["Akademik qobiliyat — fan mazmunini chuqur va yangilanib boruvchi bilish","Perseptiv qobiliyat — o‘quvchining ichki holatini nozik anglash","Konstruktiv qobiliyat — ta’lim faoliyatini oldindan loyihalash","Kommunikativ qobiliyat — ishtirokchilar bilan samarali aloqa o‘rnatish"],"a":0,"e":"Fanni chuqur egallash, yangiliklarni kuzatish va ilmiy asoslangan javob berish akademik qobiliyatga xos. Bu qobiliyat predmet bilimining puxtaligini bildiradi."},
  {"m":1162,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"O‘qituvchining gavda, qo‘l va oyoq harakatlarini maqsadga muvofiq boshqarish usullari qanday ataladi?","o":["Pantomimika — gavda va yirik tana harakatlarini boshqarish","Mimika — yuz mushaklari va nigoh ifodasini boshqarish","Pedagogik takt — vaziyatda axloqiy me’yorni saqlash","Nutq texnikasi — ovoz, nafas va talaffuzni boshqarish"],"a":0,"e":"Gavda, qo‘l va oyoq kabi yirik tana harakatlari pantomimika vositalaridir. Mimika esa yuz ifodasi va nigoh bilan bog‘liq."},
  {"m":1166,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Pedagogning muloqotda axloqiy tamoyil va xulq-atvor me’yorlariga rioya qilib, o‘quvchiga vaziyatga mos va hurmatli yondashish malakasi nima deyiladi?","o":["Pedagogik takt — me’yor va ta’sir usulini vaziyatga mos tanlash","Pedagogik texnika — tana, ovoz va hissiy holatni boshqarish","Kommunikativ ta’sir — xabar orqali munosabatni o‘zgartirish","Pedagogik mahorat — kasbiy faoliyatni yuksak darajada bajarish"],"a":0,"e":"Pedagogik takt muloqotda axloqiy me’yorni, hurmatni va vaziyatga mos ta’sir chegarasini saqlashdir. U texnik vositalardan foydalanishdan kengroq axloqiy mezon hisoblanadi."},
  {"m":563,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"O‘quvchi, ota-ona, hamkasb va rahbar bilan oson aloqa o‘rnatish hamda munosabatni maqsadga muvofiq yo‘lga qo‘yishga yordam beradigan qobiliyat qaysi?","o":["Perseptiv qobiliyat — ichki holat va kechinmani anglash","Akademik qobiliyat — fan mazmunini chuqur o‘zlashtirish","Kommunikativ qobiliyat — turli ishtirokchilar bilan aloqa o‘rnatish","Konstruktiv qobiliyat — faoliyat mazmunini oldindan loyihalash"],"a":2,"e":"Turli ta’lim ishtirokchilari bilan aloqa o‘rnatish va munosabatni to‘g‘ri yo‘lga qo‘yish kommunikativ qobiliyatning mazmunidir."},
  {"m":564,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Quyidagi harakatlardan qaysi biri didaktik qobiliyatning eng aniq namoyoni hisoblanadi?","o":["Murakkab mazmunni tushunarli qilib, fanga qiziqish uyg‘otish","Nazorat hujjatlarini belgilangan muddatda rasmiylashtirib borish","Pedagogik nizoni ma’muriy tartib bilan tezda yakunlash","Tadbir ishtirokchilariga vazifalarni tashkiliy taqsimlash"],"a":0,"e":"Didaktik qobiliyat o‘quv materialini ravshan va oson tushuntirish, o‘quvchida qiziqish hamda mustaqil fikrlashni uyg‘otish bilan namoyon bo‘ladi."},
  {"m":565,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"O‘quvchilar jamoasini uyushtirish, jipslashtirish, vazifalarni muvofiqlashtirish va birgalikdagi faoliyatni samarali boshqarish qaysi qobiliyatga kiradi?","o":["Tashkilotchilik qobiliyati — jamoa faoliyatini uyushtirib boshqarish","Akademik qobiliyat — o‘qitiladigan fan mazmunini chuqur bilish","Kommunikativ qobiliyat — suhbatdosh bilan samarali aloqa o‘rnatish","Perseptiv qobiliyat — o‘quvchining ichki holatini nozik anglash"],"a":0,"e":"Jamoani jipslashtirish, vazifalarni taqsimlash va birgalikdagi ishni boshqarish tashkilotchilik qobiliyatining to‘g‘ridan-to‘g‘ri belgilaridir."},
  {"m":567,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"O‘quv materialini aniq va oson tushuntirish, fanga qiziqish uyg‘otish hamda mustaqil fikrlashni rivojlantirish qaysi qobiliyatga xos?","o":["Pedagogik xayol — kelajakdagi rivojlanishni tasavvur qilish","Perseptiv qobiliyat — o‘quvchining ruhiy holatini anglash","Didaktik qobiliyat — mazmunni tushunarli o‘rgata olish","Avtoritar qobiliyat — irodaviy ta’sir bilan obro‘ qozonish"],"a":2,"e":"Mazmunni o‘quvchiga ravshan yetkazish, qiziqish uyg‘otish va tafakkurni rivojlantirish didaktik qobiliyatning asosiy mazmunidir."},
  {"m":568,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Psixologik kuzatuvchanlik orqali o‘quvchining ichki dunyosi va vaqtinchalik ruhiy holatidagi nozik o‘zgarishlarni tushuna olish qaysi qobiliyat?","o":["Pedagogik xayol — kelajakdagi natijani tasavvur qilish","Perseptiv qobiliyat — ichki holatni nozik anglash","Didaktik qobiliyat — mazmunni tushunarli o‘rgatish","Avtoritar qobiliyat — irodaviy ta’sir bilan obro‘ qozonish"],"a":1,"e":"O‘quvchining ichki holati va nozik ruhiy o‘zgarishlarini kuzatib anglash perseptiv qobiliyatga kiradi. Bu oddiy muloqotdan ko‘ra psixologik sezgirlikni talab qiladi."},
  {"m":569,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"O‘quvchilarga hissiy-irodaviy ta’sir ko‘rsatish, qat’iyat va mas’uliyat bilan ular orasida kasbiy obro‘ qozonish qaysi qobiliyatga xos?","o":["Pedagogik xayol — rivojlanish istiqbolini tasavvur qilish","Perseptiv qobiliyat — o‘quvchining ichki holatini anglash","Didaktik qobiliyat — o‘quv materialini tushunarli yetkazish","Avtoritar qobiliyat — irodaviy ta’sir bilan obro‘ qozonish"],"a":3,"e":"Hissiy-irodaviy ta’sir, talabchanlik va shaxsiy mas’uliyat orqali kasbiy obro‘ qozonish avtoritar qobiliyatning pedagogik ma’nosidir. Bu zo‘ravon boshqaruv degani emas."},
  {"m":570,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"O‘qituvchi fikr va hislarini ta’sirchan nutq bilan ifodalaydi, ovoz ohangi, mimika va pantomimikani uyg‘un qo‘llab, tinglovchilar diqqatini saqlaydi. Qaysi qobiliyat ustuvor?","o":["Tashkilotchilik qobiliyati — jamoa vazifalarini muvofiqlashtirish","Akademik qobiliyat — fan mazmunini chuqur va puxta bilish","Kommunikativ qobiliyat — turli ishtirokchi bilan aloqa o‘rnatish","Nutq qobiliyati — fikrni ovoz va ifoda bilan ta’sirchan yetkazish"],"a":3,"e":"Vaziyatning markazida fikrni ovoz, ohang, yuz va tana ifodasi bilan ravshan hamda ta’sirchan yetkazish turibdi. Bu nutq qobiliyatidir."},
  {"m":571,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"Sinf rahbari o‘quvchining odatdagi faolligi pasayganini sezdi, suhbat orqali ichki holatini aniqladi va unga mos qo‘llab-quvvatlash yo‘lini tanladi. Qaysi qobiliyat namoyon?","o":["Tashkilotchilik qobiliyati — jamoa ishini uyushtirib boshqarish","Akademik qobiliyat — fan mazmunini chuqur egallash","Perseptiv qobiliyat — ruhiy holatdagi o‘zgarishni anglash","Nutq qobiliyati — fikrni ifodali va ravon yetkazish"],"a":2,"e":"O‘quvchidagi nozik xulqiy o‘zgarishni sezish, suhbat orqali ruhiy holatini anglash va mos yordam tanlash perseptiv qobiliyatni ko‘rsatadi."},
  {"m":572,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"qollash","d":3,"s":"O‘qituvchi bilim, xulq va izchil talabi bilan o‘quvchilarga ijobiy hissiy-irodaviy ta’sir ko‘rsatib, ular orasida barqaror kasbiy obro‘ qozondi. Qaysi qobiliyat namoyon?","o":["Tashkilotchilik qobiliyati — jamoa faoliyatini muvofiqlashtirish","Avtoritar qobiliyat — shaxsiy fazilat bilan kasbiy obro‘ qozonish","Perseptiv qobiliyat — ichki ruhiy holatni nozik anglash","Nutq qobiliyati — fikrni ovoz va ifoda bilan yetkazish"],"a":1,"e":"Kasbiy bilim, xulq, qat’iyat va izchil talab orqali o‘quvchilar orasida obro‘ qozonish avtoritar qobiliyatning ijobiy pedagogik ko‘rinishidir."},
  {"m":574,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"O‘quvchining his-tuyg‘usini uning nuqtayi nazaridan tushunish, og‘ir vaziyatda o‘zini uning o‘rniga qo‘yib ko‘rish va dalda berish nima deyiladi?","o":["Pedagogik ziyraklik — vaziyatdagi nozik belgini tez payqash","Pedagogik empatiya — boshqaning kechinmasini tushunib hamdard bo‘lish","Pedagogik intuitsiya — yechimni tajriba va sezgi bilan topish","Pedagogik simpatiya — shaxsga nisbatan ijobiy moyillik bildirish"],"a":1,"e":"Boshqa insonning kechinmasini uning nuqtayi nazaridan his etish va hamdardlik bilan qo‘llab-quvvatlash pedagogik empatiyadir."},
  {"m":575,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"O‘quvchilarning kayfiyati, faoliyatga ishtiyoqi va ziddiyat belgilarini tez payqab, pedagogik ta’sir uchun qulay vaziyatni tanlay olish nima deyiladi?","o":["Pedagogik ziyraklik — vaziyat va holatdagi nozik belgini payqash","Pedagogik empatiya — boshqaning kechinmasiga hamdard bo‘lish","Pedagogik intuitsiya — dalilsiz sezgi asosida xulosa qilish","Pedagogik simpatiya — o‘quvchiga ijobiy moyillik bildirish"],"a":0,"e":"Kayfiyat, ishtiyoq va ziddiyatning nozik belgilarini o‘z vaqtida sezib, ta’sir uchun mos paytni tanlash pedagogik ziyraklikdir."},
  {"m":576,"c":"PM.GEN.07","l":"pedagogik-qobiliyat-va-uning-turlari","k":"bilish","d":2,"s":"Pedagogik hodisaning mohiyatini orttirilgan tajriba va sezgi asosida, batafsil mantiqiy dalillashdan oldin tez anglash qaysi tushuncha bilan ifodalanadi?","o":["Pedagogik ziyraklik — ko‘rinadigan nozik belgilarni tez payqash","Pedagogik empatiya — o‘quvchining kechinmasiga hamdard bo‘lish","Pedagogik intuitsiya — tajriba va sezgi bilan tez anglash","Pedagogik simpatiya — shaxsga nisbatan ijobiy moyillik bildirish"],"a":2,"e":"Tajriba va sezgi yordamida vaziyat mohiyatini batafsil dalillashdan oldin tez anglash pedagogik intuitsiya hisoblanadi. Ziyraklik esa belgilarni payqashga urg‘u beradi."}
]
$bank$::jsonb) AS source(v);

DO $task428_b05$
DECLARE
  b task428_batch05%rowtype; actor uuid; subject_id uuid; construct_id uuid; lesson_id uuid;
  question_id uuid; option_id uuid; option_ids uuid[]; i integer; n integer; bad integer;
BEGIN
  IF (SELECT count(*) FROM task428_batch05)<>20 THEN RAISE EXCEPTION 'TASK428_B05_COUNT'; END IF;
  IF EXISTS(SELECT 1 FROM task428_batch05 tb JOIN public.questions q
    ON q.source_reference='telegram:@PedMahoratGuli:'||tb.message_id::text
    OR q.source_reference LIKE 'telegram:@PedMahoratGuli:'||tb.message_id::text||'|%')
  THEN RAISE EXCEPTION 'TASK428_B05_SOURCE_ALREADY_REPRESENTED'; END IF;
  SELECT id INTO STRICT actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
  THEN RAISE EXCEPTION 'TASK428_B05_OWNER_NOT_UNIQUE'; END IF;
  SELECT id INTO STRICT subject_id FROM public.subjects WHERE code='informatika';
  CREATE TEMP TABLE task428_b05_ids(id uuid PRIMARY KEY) ON COMMIT DROP;

  FOR b IN SELECT * FROM task428_batch05 ORDER BY message_id LOOP
    SELECT c.id,l.id INTO STRICT construct_id,lesson_id
    FROM public.constructs c JOIN public.lesson_constructs lc ON lc.construct_id=c.id
    JOIN public.lessons l ON l.id=lc.lesson_id
    WHERE c.code=b.construct_code AND c.is_active AND l.slug=b.lesson_slug
      AND l.status='published'::public.content_status;
    IF EXISTS(SELECT 1 FROM public.questions q WHERE q.status IN('review','published')
      AND regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g')=
          regexp_replace(lower(btrim(b.stem_md)),'[^[:alnum:]]+','','g'))
    THEN RAISE EXCEPTION 'TASK428_B05_ACTIVE_EXACT_DUPLICATE_%',b.message_id; END IF;

    question_id:=gen_random_uuid();
    INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,status,author_id,is_generated,source_lesson_id,source_reference)
    VALUES(question_id,subject_id,construct_id,'PM.GEN','Y1'::public.question_format,b.cognitive,b.difficulty,
      b.stem_md,'review'::public.content_status,NULL,true,lesson_id,b.source_reference);
    INSERT INTO task428_b05_ids VALUES(question_id);
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
    FROM task428_b05_ids r JOIN public.questions q ON q.id=r.id
    JOIN public.question_options o ON o.question_id=q.id AND btrim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id GROUP BY q.id
  ) SELECT count(*) FILTER(WHERE option_count<>4 OR distinct_count<>4 OR correct_count<>1
      OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25),count(*) INTO bad,n FROM checks;
  IF bad<>0 OR n<>20 THEN RAISE EXCEPTION 'TASK428_B05_BALANCE_%_COUNT_%',bad,n; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance)
  SELECT q.id,actor,public.professional_question_fingerprint(q.id),'owner_explicit_no_external_expert_20261018',
    'TASK-428 batch 05; owner-delegated AI expert rewrite of PedMahoratGuli pedagogy technique/ability items; key independently checked; independent human expert signoff NOT claimed'
  FROM task428_b05_ids r JOIN public.questions q ON q.id=r.id;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>20 THEN RAISE EXCEPTION 'TASK428_B05_WAIVERS_%',n; END IF;
  UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
  FROM task428_b05_ids r WHERE q.id=r.id AND q.status='review'::public.content_status;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>20 THEN RAISE EXCEPTION 'TASK428_B05_PUBLISHED_%',n; END IF;
  SELECT count(*) INTO n FROM task428_b05_ids r JOIN public.questions q ON q.id=r.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF n<>20 THEN RAISE EXCEPTION 'TASK428_B05_POSTFLIGHT_%_OF_20',n; END IF;
END
$task428_b05$;
COMMIT;
