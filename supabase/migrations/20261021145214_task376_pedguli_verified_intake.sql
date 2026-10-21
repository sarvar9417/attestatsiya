-- TASK-376: expert-screened Telegram pedagogy intake.
-- The Telegram channel is a discovery/audit source, not an authoritative answer key.
-- Every retained item below was rewritten, mapped to a canonical lesson and staged in
-- REVIEW. Publication still requires the repository's human editorial approval gate.
BEGIN;

DO $task376$
DECLARE
  v jsonb;
  v_subject uuid;
  v_construct uuid;
  v_lesson uuid;
  v_question uuid;
  v_option uuid;
  v_option_ids uuid[];
  v_source_reference text;
  i integer;
BEGIN
  SELECT id INTO STRICT v_subject
  FROM public.subjects
  WHERE code = 'informatika';

  FOR v IN
    SELECT value
    FROM jsonb_array_elements($bank$
    [
      {"m":2341,"c":"KS.01","k":"qollash","d":3,"s":"Tasviriy san’at darsida o‘quvchilar «Suv — hayot manbai» mavzusida ish tayyorlaydi. O‘qituvchi topshiriqqa suvning kimyoviy xususiyatlarini tushuntirishni ham kiritdi. Bu rejalashtirishning qaysi mehnat harakatiga misol?","o":["Fanlararo kompetensiyalarni singdirish va fanlar o‘rtasida bog‘lanish yaratish","O‘quv dasturini faqat sinfdagi texnik jihozlarga moslashtirish","Baholash mezonlarini o‘quvchilarga bildirmasdan o‘zgartirish","Dars maqsadini sinfdan tashqari tadbir bilan almashtirish"],"a":0,"e":"Tasviriy san’at topshirig‘iga kimyo mazmunining maqsadli bog‘lanishi fanlararo integratsiya va korrelyatsiyani ifodalaydi."},
      {"m":2342,"c":"KS.01","k":"qollash","d":3,"s":"Odatda 7-sinfga dars beradigan pedagog ertaga boshlang‘ich sinfdagi hamkasbini almashtiradi. Darsni rejalashtirishda eng asosli birinchi moslashtirish qaysi?","o":["Avvalgi 7-sinf ishlanmasini o‘zgarishsiz qo‘llash","Dars shakli va usullarini maqsad, yosh xususiyati hamda tayyorgarlik darajasiga moslash","Faqat ko‘rgazmali materiallar sonini ko‘paytirish","Dars maqsadidan qat’i nazar barcha topshiriqni raqamlashtirish"],"a":1,"e":"Dars shakli va usuli o‘quv natijasi bilan birga o‘quvchilarning yoshi va o‘zlashtirish imkoniyatiga mos rejalashtiriladi."},
      {"m":2343,"c":"KS.02","k":"qollash","d":3,"s":"Sinfdagi ayrim o‘quvchilar diagrammadagi mayda yozuvlarni ko‘rishda qiynaladi. O‘qituvchi bir xil o‘quv maqsadini saqlab, diagrammani yirik shaklda beradi va undagi axborotni og‘zaki tavsiflaydi. Qaysi harakat ustuvor?","o":["Individual ta’lim ehtiyojiga mos, o‘z vaqtida differensial yordam ko‘rsatish","Mavzuni baholashsiz erkin muhokama bilan almashtirish","Faqat yuqori natijali o‘quvchilarni faol qatnashtirish","O‘quv dasturidagi natijani butunlay bekor qilish"],"a":0,"e":"Maqsad saqlangan holda material formati va yordam usuli ehtiyojga moslashtirilmoqda; bu differensial va inklyuziv qo‘llab-quvvatlashdir."},
      {"m":2345,"c":"KS.04","k":"mulohaza","d":4,"s":"Maktabga kelgan shaxs o‘quvchini boshqalar oldida ayblay boshladi. Sinf rahbari bolaning sha’ni kamsitilishiga yo‘l qo‘ymadi, vaziyatni tinchlantirdi va masalani dalillar asosida vakolatli xodimlar bilan ko‘rib chiqdi. Qaysi kasbiy harakat eng aniq ifodalangan?","o":["Bolalar jamoasida faqat musobaqa muhitini kuchaytirish","O‘quvchining qadr-qimmati va manfaatini himoya qilib, ziddiyatli vaziyatda yordam berish","Barcha nizolarni o‘quvchilarning o‘ziga topshirish","Ota-onalar bilan ishlashni faqat yozma ogohlantirish bilan cheklash"],"a":1,"e":"Pedagog bolani asossiz ommaviy ayblovdan himoya qiladi, nizoni xavfsiz yo‘l bilan boshqaradi va xulosani dalilga tayaydi."},
      {"m":2348,"c":"KS.03","k":"qollash","d":3,"s":"O‘qituvchi har bir mavzudan keyin qisqa tekshiruv o‘tkazib, natijalarni vaqt davomida taqqoslaydi. Ushbu faoliyat baholashning qaysi mehnat harakatiga eng mos?","o":["Bitta yakuniy baho asosida barcha xulosa chiqarish","Faqat nazorat vositasining tashqi ko‘rinishini almashtirish","Bilimlarni egallash darajasini muntazam va tizimli kuzatib borish","Natijalarni tahlil qilmasdan arxivlash"],"a":2,"e":"Takroriy tekshiruvlar va natijalarni vaqt bo‘yicha kuzatish o‘zlashtirish darajasining tizimli monitoringini tashkil etadi."},
      {"m":2392,"c":"KS.01","k":"mulohaza","d":4,"s":"Diagnostika natijalari 9-sinf o‘quvchilarining bir qismi algebra bo‘yicha tayanch mashqlarga muhtojligini ko‘rsatdi. O‘qituvchi asosiy maqsadlarni saqlagan holda qo‘shimcha mashg‘ulot va tayanch vazifalarni rejaladi. Qaysi mehnat harakati bajarildi?","o":["O‘quv dasturini aniqlangan ehtiyojga qarab zarur darajada moslashtirish","Dars maqsadini diagnostika natijalaridan qat’i nazar o‘zgartirmaslik","Fanlararo bog‘lanishni baholash o‘rniga qo‘llash","Faqat yakuniy bahoni oshirish uchun topshiriqlarni olib tashlash"],"a":0,"e":"Aniqlangan o‘quv ehtiyojiga javoban qo‘shimcha tayanch va vaqt rejalash — dastur ijrosini ehtiyojga moslashtirishdir."},
      {"m":2394,"c":"KS.02","k":"qollash","d":3,"s":"Tarix darsida guruhlar manbalarni muhokama qildi, umumiy xulosa tuzdi va boshqa guruhlarning dalillariga munosabat bildirdi. O‘qituvchining qaysi harakati vaziyatni eng aniq tavsiflaydi?","o":["Faqat individual yodlashni nazorat qilish","O‘quvchilarning jamoaviy ishini tashkil etish","Barcha javobni o‘qituvchi nomidan e’lon qilish","Metakognitiv strategiyani baholashsiz tushuntirish"],"a":1,"e":"Vazifani guruhda bajarish, umumiy xulosa yaratish va o‘zaro tahlil jamoaviy ishning bevosita belgilaridir."},
      {"m":2396,"c":"KS.04","k":"mulohaza","d":4,"s":"Sinf soatida o‘qituvchi oldindan tanlangan voqea va savollar orqali o‘quvchilarni yaqinlariga bo‘lgan munosabatini tahlil qilishga, hamdardlik va minnatdorlik haqida xulosa chiqarishga yo‘naltirdi. Qaysi tarbiyaviy harakat ustuvor?","o":["Faqat ichki tartib qoidalarini yodlatish","O‘lkashunoslik ekspeditsiyasini tashkil etish","Bolaning emotsional-qadriyat sohasini rivojlantiradigan vaziyatni loyihalash","Baholash natijasini ota-onalar bilan solishtirish"],"a":2,"e":"Maxsus tanlangan vaziyat hissiy munosabatni anglash va qadriyatli xulosa chiqarishga xizmat qilmoqda."},
      {"m":2714,"c":"KS.03","k":"qollash","d":3,"s":"O‘qituvchi nazorat ishidan so‘ng faqat ballni aytmadi: mezonga tayangan holda o‘quvchining kuchli tomonlari, xatosi va keyingi qadamini tushuntirdi. Qaysi mehnat harakati eng aniq bajarildi?","o":["Natijalarni tahlilsiz reyting jadvaliga kiritish","Dars rejasini dalilsiz almashtirish","O‘quvchi yutug‘ini baholash va qo‘yilgan bahoni asoslab berish","Baholash mezonini natija chiqqandan keyin yashirin o‘zgartirish"],"a":2,"e":"Mezon, kuchli tomon va xatoga tayangan izoh bahoning asosini ochib beradi hamda foydali qayta aloqa yaratadi."},
      {"m":2715,"c":"KS.04","k":"qollash","d":3,"s":"Tarix o‘qituvchisi o‘quvchilar bilan mahalliy tarixiy joyga ekskursiya uyushtirdi. Ular hudud qahramonlari haqidagi dalillarni yig‘ib, yakunda taqdimot tayyorladi. Qaysi mehnat harakati ustuvor?","o":["Hududning tarixiy-madaniy xususiyatini hisobga olib sinfdan tashqari ishni tashkil etish","Nizoni mediatsiya orqali hal qilish","Faqat sinfdagi yozma nazoratni ko‘paytirish","O‘quv dasturidagi barcha darslarni ekskursiya bilan almashtirish"],"a":0,"e":"Mahalliy tarixiy-madaniy imkoniyatdan foydalanilgan ekskursiya maqsadli sinfdan tashqari tarbiyaviy faoliyatdir."},
      {"m":2718,"c":"KS.06","k":"qollash","d":3,"s":"Pedagog har oy o‘z darsidagi muvaffaqiyat va qiyinchiliklarni yozma tahlil qiladi, takomillashtirish yo‘lini belgilaydi va zarur masalada tajribali hamkasbdan maslahat oladi. Qaysi mehnat harakati ustuvor?","o":["Faqat ochiq darsda o‘z tajribasini namoyish etish","Metodik kengash bayonnomasini tayyorlash","Boshqa pedagogning darsini baholash bilan cheklanish","O‘z faoliyatining kuchli va zaif tomonlarini baholab, kasbiy rivojlanish ehtiyojini belgilash"],"a":3,"e":"Muntazam o‘zini tahlil qilish va shu asosda keyingi rivojlanish yo‘lini tanlash kasbiy refleksiyaning amaliy ko‘rinishidir."},
      {"m":2745,"c":"KS.03","k":"mulohaza","d":4,"s":"Sinfda o‘quvchilarning ehtiyoji va javob berish imkoniyati turlicha. O‘qituvchi bir xil o‘quv natijasini baholash uchun ayrim o‘quvchiga og‘zaki, boshqasiga yozma dalil taqdim etish imkonini berdi va hammaga oldindan bir xil mezonni e’lon qildi. Qaysi ko‘nikma namoyon bo‘ldi?","o":["Baholash natijasini faqat ota-onaga aytish","Barcha o‘quvchiga sharoitidan qat’i nazar bitta javob formatini majburlash","Baholash usulini ehtiyoj va qobiliyatga mos shaxsga yo‘naltirish","Mezonni har bir javobdan keyin o‘zgartirish"],"a":2,"e":"O‘quv natijasi va mezon saqlanadi, dalil taqdim etish usuli esa ehtiyojga moslashtiriladi; bu adolatli, shaxsga yo‘naltirilgan baholashdir."},
      {"m":2257,"c":"PM.GEN.06","k":"bilish","d":2,"s":"O‘qituvchi hayajonlangan o‘quvchini gapini bo‘lmasdan, bosh barmog‘ini yuqoriga ko‘tarish orqali ruhlantirdi. Pedagogik texnikaning qaysi vositasi qo‘llandi?","o":["Pantomimika","Jest","Mimika","Nutq texnikasi"],"a":1,"e":"Qo‘l va barmoqlar orqali ma’no ifodalovchi ongli harakat jest hisoblanadi."},
      {"m":2263,"c":"PM.GEN.08","k":"qollash","d":3,"s":"Orol dengizi muammosi bo‘yicha o‘quvchilar avval tanqidsiz imkon qadar ko‘p g‘oya aytdi. Barcha g‘oyalar qayd etilgach, ular mezonlar asosida saralandi. Qaysi metod qo‘llandi?","o":["Aqliy hujum","Debat","Debrifing","Ma’ruza"],"a":0,"e":"G‘oyalarni dastlab baholamasdan yig‘ish, keyin esa tahlil va saralash aqliy hujum metodining asosiy tartibidir."},
      {"m":2571,"c":"PM.GEN.08","k":"qollash","d":3,"s":"Fizika o‘qituvchisi magnit, sim va ampermetr yordamida magnit harakatlanganda tok hosil bo‘lish jarayonini sinf oldida bevosita ko‘rsatdi. Yetakchi o‘qitish metodi qaysi?","o":["Hikoya","Tushuntirish","Namoyish","Tasvir (illyustratsiya)"],"a":2,"e":"O‘qituvchi hodisani real asboblar va jarayon orqali bevosita ko‘rsatgani uchun yetakchi metod namoyishdir."},
      {"m":2573,"c":"PM.GEN.08","k":"qollash","d":3,"s":"Biologiya o‘qituvchisi yurak tuzilishini statik rasm va sxemalar orqali ko‘rsatdi; o‘quvchilar shu tasvirlar asosida qismlarni aniqladi. Yetakchi ko‘rgazmali metod qaysi?","o":["Tushuntirish","Tasvir (illyustratsiya)","Hikoya","Namoyish"],"a":1,"e":"Statik rasm, sxema va grafiklardan foydalanish tasvir (illyustratsiya) metodiga kiradi; namoyishda esa obyekt yoki jarayonning o‘zi ko‘rsatiladi."}
    ]
    $bank$::jsonb)
  LOOP
    v_source_reference := 'telegram:@PedMahoratGuli:' || (v->>'m') || '|task376:expert-rewrite:v1';

    IF EXISTS (
      SELECT 1 FROM public.questions WHERE source_reference = v_source_reference
    ) THEN
      CONTINUE;
    END IF;

    SELECT c.id, l.id
      INTO STRICT v_construct, v_lesson
    FROM public.constructs c
    JOIN public.lesson_constructs lc ON lc.construct_id = c.id
    JOIN public.lessons l ON l.id = lc.lesson_id
    WHERE c.code = v->>'c'
      AND c.is_active
      AND l.status = 'published'::public.content_status
      AND l.slug !~ '^m(14|15|16)-[0-9]+$'
    ORDER BY l.created_at, l.id
    LIMIT 1;

    v_question := gen_random_uuid();
    INSERT INTO public.questions (
      id, subject_id, construct_id, group_code, format, cognitive, difficulty,
      stem_md, status, author_id, is_generated, source_lesson_id, source_reference
    ) VALUES (
      v_question,
      v_subject,
      v_construct,
      CASE
        WHEN v->>'c' LIKE 'KS.%' THEN 'KS'
        WHEN v->>'c' LIKE 'PM.GEN.%' THEN 'PM.GEN'
        ELSE 'PM.MET'
      END,
      'Y1'::public.question_format,
      (v->>'k')::public.cognitive_level,
      (v->>'d')::integer,
      v->>'s',
      'review'::public.content_status,
      NULL,
      false,
      v_lesson,
      v_source_reference
    );

    v_option_ids := ARRAY[]::uuid[];
    FOR i IN 0..3 LOOP
      v_option := gen_random_uuid();
      v_option_ids := array_append(v_option_ids, v_option);
      INSERT INTO public.question_options (
        id, question_id, side, order_idx, content_md
      ) VALUES (
        v_option, v_question, 'a', i, v->'o'->>i
      );
    END LOOP;

    INSERT INTO public.question_keys (question_id, payload, explanation_md)
    VALUES (
      v_question,
      jsonb_build_object('correct_option_id', v_option_ids[(v->>'a')::integer + 1]),
      v->>'e'
    );
  END LOOP;

  IF (
    SELECT count(*)
    FROM public.questions
    WHERE source_reference LIKE 'telegram:@PedMahoratGuli:%|task376:expert-rewrite:v1'
  ) <> 16 THEN
    RAISE EXCEPTION 'TASK-376 expected 16 staged questions';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.questions q
    LEFT JOIN public.question_keys k ON k.question_id = q.id
    WHERE q.source_reference LIKE 'telegram:@PedMahoratGuli:%|task376:expert-rewrite:v1'
      AND (
        q.status <> 'review'::public.content_status
        OR q.format <> 'Y1'::public.question_format
        OR q.source_lesson_id IS NULL
        OR k.question_id IS NULL
        OR (SELECT count(*) FROM public.question_options o WHERE o.question_id = q.id) <> 4
        OR NOT EXISTS (
          SELECT 1
          FROM public.question_options o
          WHERE o.question_id = q.id
            AND o.id::text = k.payload->>'correct_option_id'
        )
      )
  ) THEN
    RAISE EXCEPTION 'TASK-376 question integrity check failed';
  END IF;
END
$task376$;

COMMIT;
