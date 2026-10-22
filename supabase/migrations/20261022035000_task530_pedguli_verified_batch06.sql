-- TASK-530 — sixth expert-screened PedMahoratGuli intake batch.
-- General pedagogy, didactics, teaching forms and educational resources.
BEGIN;
SET LOCAL lock_timeout='8s';
SET LOCAL statement_timeout='120s';

CREATE TEMP TABLE task530_batch06(
  message_id bigint PRIMARY KEY, construct_code text NOT NULL, lesson_slug text NOT NULL,
  cognitive public.cognitive_level NOT NULL, difficulty integer NOT NULL,
  stem_md text NOT NULL, options jsonb NOT NULL CHECK(jsonb_array_length(options)=4),
  correct_index integer NOT NULL CHECK(correct_index BETWEEN 0 AND 3), explanation_md text NOT NULL,
  source_reference text GENERATED ALWAYS AS(
    'telegram:@PedMahoratGuli:'||message_id::text||'|task428:expert-rewrite:v1') STORED
) ON COMMIT DROP;

INSERT INTO task530_batch06(message_id,construct_code,lesson_slug,cognitive,difficulty,stem_md,options,correct_index,explanation_md)
SELECT (v->>'m')::bigint,v->>'c',v->>'l',(v->>'k')::public.cognitive_level,
  (v->>'d')::integer,v->>'s',v->'o',(v->>'a')::integer,v->>'e'
FROM jsonb_array_elements($bank$
[
  {"m":121,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":2,"s":"Pedagogika fanining metodologik vazifasi nimadan iborat?","o":["Pedagogik fanlarning umumiy nazariy asoslarini aniqlashtirish","Yangi texnologiyalarni bevosita amaliyotga joriy etish","Ta’lim tajribasini kuzatish va natijalarni baholash","Ta’lim tizimining istiqbol strategiyasini oldindan belgilash"],"a":0,"e":"Metodologik vazifa pedagogik bilimlarning umumiy nazariy asoslari, kategoriyalari va tadqiqot yo‘nalishlarini aniqlashtiradi. Amaliy, tahliliy va prognostik vazifalar boshqa natijalarga qaratilgan."},
  {"m":129,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":1,"s":"Egallangan bilim, ko‘nikma va malakalarni kundalik hamda kasbiy faoliyatda samarali qo‘llay olish qobiliyati nima deyiladi?","o":["Malaka — mashq orqali avtomatlashgan harakat","Kompetensiya — bilimni vaziyatda qo‘llash layoqati","Ma’lumot — o‘zlashtirilgan bilimlar tizimi","Ta’lim — maqsadli o‘qitish jarayoni"],"a":1,"e":"Kompetensiya shaxsning bilim, ko‘nikma va malakalarni real faoliyat vazifalarini hal etishda safarbar qila olish qobiliyatini bildiradi."},
  {"m":131,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":1,"s":"Shaxsning muayyan faoliyatni ongli ravishda tashkil eta olish layoqati qaysi tushuncha bilan ifodalanadi?","o":["Kasbiy malaka","Amaliy ko‘nikma","Nazariy ma’lumot","Maqsadli ta’lim"],"a":1,"e":"Ko‘nikma bilimga tayangan holda faoliyat yoki harakatni ongli bajarish layoqatidir. Malaka esa ko‘p mashq natijasida avtomatlashgan bajarishni anglatadi."},
  {"m":159,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":1,"s":"Ta’lim jarayoni, uning mazmuni, qonuniyatlari, tamoyillari, shakl, metod va vositalarini ilmiy asoslaydigan pedagogika sohasi qaysi?","o":["Didaktika — ta’lim nazariyasini o‘rganadigan soha","Tarbiya nazariyasi — tarbiyaviy jarayonni o‘rganadigan soha","Maktabshunoslik — ta’lim tashkilotini boshqarish sohasi","Pedagogik psixologiya — o‘rganish psixikasini tadqiq etadigan soha"],"a":0,"e":"Didaktika ta’lim va o‘qitish nazariyasi bo‘lib, mazmun, qonuniyat, tamoyil, metod, vosita va tashkiliy shakllarni tadqiq etadi."},
  {"m":248,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":2,"s":"O‘qitish jarayonining tarbiyaviy vazifasi qaysi natijada namoyon bo‘ladi?","o":["Nutq, tafakkur va hissiy-irodaviy sifatlar rivojlanishida","Ma’naviy-axloqiy qarash va xulq-atvor shakllanishida","Bilim, ko‘nikma va kompetensiyalar egallanishida","O‘zlashtirishning to‘liqligi va mustahkamligi ortishida"],"a":1,"e":"Tarbiyaviy vazifa o‘quvchining ma’naviy-axloqiy, estetik qarashlari, dunyoqarashi va xulq-atvori shakllanishiga qaratiladi. Qolganlari rivojlantiruvchi yoki ta’limiy natijalardir."},
  {"m":264,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"O‘quv-metodik majmuaning asosiy tarkibiy qismlari qaysi javobda to‘liq berilgan?","o":["Darslik, metodik qo‘llanma, multimedia ilova va jurnal","Darslik, mashq daftari, metodik qo‘llanma va jurnal","Darslik, mashq daftari, jurnal va multimedia ilova","Darslik, mashq daftari, metodik qo‘llanma va multimedia ilova"],"a":3,"e":"O‘quv-metodik majmua darslik, mashq daftari, o‘qituvchi uchun metodik qo‘llanma va darslikning multimedia ilovasini qamrab oladi; sinf jurnali majmua tarkibi emas."},
  {"m":268,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"bilish","d":1,"s":"STEAM ta’limining asosiy maqsadi nimadan iborat?","o":["Raqamli texnologiyalarni alohida fan sifatida o‘rgatishdan","Muammoni hal qilish va ijodiy fikrlashni rivojlantirishdan","Ilmiy faktlarni tayyor ko‘rinishda yodlatib borishdan","San’at va dizayn mashqlarini takroriy bajartirishdan"],"a":1,"e":"STEAM fanlararo yondashuv orqali real muammolarni yechish, izlanish, loyihalash va ijodiy fikrlashni rivojlantiradi; u bitta fan bilan cheklanmaydi."},
  {"m":269,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"bilish","d":1,"s":"STEAM ta’limida loyiha asosida o‘qitishning muhim afzalligi qaysi?","o":["Real muammolarni hamkorlikda yechishni o‘rganish","Nazariy ma’lumotni tayyor tartibda qabul qilish","Vazifalarni o‘zaro aloqasiz qismlarga ajratib bajarish","Tayyor yechimni ko‘rsatma asosida qayta takrorlash"],"a":0,"e":"Loyiha asosida o‘qitish o‘quvchini real muammo ustida izlanish, bilimlarni birlashtirish, hamkorlik qilish va amaliy yechim yaratishga jalb etadi."},
  {"m":352,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"bilish","d":1,"s":"Ta’lim oluvchini faollashtiradigan, mustaqil fikrlashga undaydigan va o‘quvchini jarayon markaziga qo‘yadigan metodlar qanday ataladi?","o":["An’anaviy bayon metodlari","Didaktik nazorat metodlari","Yaxlit tashkiliy metodlar","Interfaol ta’lim metodlari"],"a":3,"e":"Interfaol metodlar o‘quvchilarning o‘zaro hamkorligi, faol ishtiroki va mustaqil fikrlashiga tayangan holda ta’lim jarayonini tashkil etadi."},
  {"m":357,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":1,"s":"O‘quv va ko‘rgazmali qo‘llanmalar, namoyish qurilmalari hamda texnik jihozlar umumiy holda nima deyiladi?","o":["Pedagogik texnologiyalar","Ta’lim metodlari","Ta’lim usullari","Didaktik vositalar"],"a":3,"e":"O‘quv mazmunini yetkazish va o‘zlashtirishga xizmat qiladigan qo‘llanma, model, qurilma hamda texnik jihozlar didaktik vositalar hisoblanadi."},
  {"m":358,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":3,"s":"Ta’lim vositalarini tasniflashning asosiy mezonlari qaysi qatorda to‘g‘ri ko‘rsatilgan?","o":["Subyekt, obyekt, qo‘llanish va tashkiliy shakliga ko‘ra","Subyekt, obyekt, axborotga munosabat va vazifasiga ko‘ra","Subyekt, obyekt, axborotga munosabat va tuzilishiga ko‘ra","Subyekt, axborotga munosabat, vazifa va shakliga ko‘ra"],"a":1,"e":"Didaktik tasnifda vositalar faoliyat subyekti, faoliyat obyekti, o‘quv axborotiga munosabati va o‘quv jarayonidagi vazifasiga ko‘ra farqlanadi."},
  {"m":359,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":1,"s":"Yangi bilimni o‘zlashtirishda o‘qituvchi va o‘quvchi foydalanadigan moddiy yoki ideal obyekt nima deyiladi?","o":["Ta’lim metodi","Ta’lim vositasi","Ta’lim usuli","Texnik qurilma"],"a":1,"e":"Ta’lim vositasi o‘qitish maqsadiga erishish uchun foydalaniladigan moddiy yoki ideal obyektni anglatadi. Metod esa faoliyatni tashkil etish yo‘lidir."},
  {"m":360,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":2,"s":"An’anaviy ta’lim vositalari qaysi qatorda keng va to‘g‘ri ifodalangan?","o":["Darslik, rasm, jadval, nutq, ustaxona va laboratoriya jihozlari","Ko‘rgazmali qo‘llanma, namoyish qurilmasi va texnik vositalar","Darslik, maket, model, laboratoriya qurilmasi va sinf mebeli","Chizma, sxema, diagramma, tasviriy san’at va yozma nutq"],"a":0,"e":"An’anaviy vositalar tarkibiga bosma va ko‘rgazmali materiallar, o‘qituvchi nutqi, ustaxona hamda laboratoriya jihozlari va tashkiliy vositalar kiradi."},
  {"m":362,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":1,"s":"Sezgi kanali orqali qabul qilinishiga ko‘ra didaktik vositalar qanday guruhlarga ajratiladi?","o":["Axborot, aralash va nazorat vositalariga","Vizual, audial va audiovizual vositalarga","Moddiy, ideal va ramziy vositalarga","O‘rgatish, o‘rganish va boshqarish vositalariga"],"a":1,"e":"Axborotni qaysi sezgi kanali orqali qabul qilishiga qarab vositalar ko‘rish uchun vizual, eshitish uchun audial va ikkalasini birlashtiruvchi audiovizual guruhlarga ajratiladi."},
  {"m":384,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":1,"s":"Tarixan o‘qitishni tashkil etishning eng qadimgi shakli qaysi?","o":["Sinf-dars ta’lim shakli","Individual ta’lim shakli","Jamoaviy ta’lim shakli","Ma’ruza-seminar shakli"],"a":1,"e":"Ta’limning dastlabki tashkil etilishida ustoz alohida o‘quvchi bilan ishlagan; shu sabab individual ta’lim tarixan eng qadimgi shakl hisoblanadi."},
  {"m":400,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"Yo‘nalishi, mazmuni va ish usuli bilan ajralib, o‘quvchining qiziqish hamda qobiliyatini rivojlantiradigan yordamchi ta’lim shakli qaysi?","o":["Fan to‘garagi","O‘quv ekskursiyasi","Fakultativ mashg‘ulot","Individual konsultatsiya"],"a":0,"e":"Fan to‘garagi ma’lum yo‘nalish bo‘yicha muntazam faoliyatni tashkil etib, o‘quvchining qiziqishi va qobiliyatini chuqur rivojlantirishga xizmat qiladi."},
  {"m":401,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"O‘quvchi va ota-onaning istagi, ijtimoiy talab hamda maktab imkoniyati asosida tashkil etiladigan mashg‘ulot qaysi?","o":["Fan to‘garagi","O‘quv ekskursiyasi","Fakultativ mashg‘ulot","Individual konsultatsiya"],"a":2,"e":"Fakultativ va tanlov mashg‘ulotlari o‘quvchi qiziqishi bilan birga ijtimoiy ehtiyoj va ta’lim tashkilotining real imkoniyatlarini hisobga olib belgilanadi."},
  {"m":405,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"O‘qituvchining darsga tayyorgarlik faoliyati qaysi ketma-ketlikni qamrab oladi?","o":["Tashkil etish, bashoratlash, loyihalash va rejalashtirish","Tashxislash, bashoratlash, loyihalash va rejalashtirish","Tashxislash, bashoratlash, loyihalash va yakuniy baholash","Tashxislash, nazorat qilish, loyihalash va rejalashtirish"],"a":1,"e":"Darsga puxta tayyorgarlik mavjud sharoitni tashxislash, natijani bashoratlash, dars modelini loyihalash va aniq rejani tuzishni o‘z ichiga oladi."},
  {"m":406,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"Didaktik jarayon kechadigan sharoitlarni aniqlash va boshlang‘ich holatni oydinlashtirish darsga tayyorgarlikning qaysi bosqichi?","o":["Rejalashtirish bosqichi","Bashoratlash bosqichi","Nazorat bosqichi","Tashxislash bosqichi"],"a":3,"e":"Tashxislash bosqichida o‘quvchi tayyorgarligi, resurslar, vaqt va boshqa sharoitlar aniqlanadi. Bashoratlash esa shu ma’lumotlar asosida kutiladigan natijani oldindan ko‘radi."},
  {"m":613,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"Ta’limni tarixiy tashkil etish shakllari qaysi javobda to‘g‘ri jamlangan?","o":["Individual, sinf-dars va ma’ruza-seminar shakllari","Guruhli, sinf-dars va ma’ruza-seminar shakllari","Individual, sinf-dars va jamoaviy shakllar","Individual, guruhli va ma’ruza-seminar shakllari"],"a":0,"e":"Pedagogika tarixida individual, sinf-dars va ma’ruza-seminar tizimlari ta’limni tashkil etishning asosiy tarixiy shakllari sifatida ko‘rsatiladi."},
  {"m":618,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":1,"s":"Dastlabki universitetlarning paydo bo‘lishi bilan qaysi ta’lim shakli rivojlangan?","o":["Guruhli ta’lim shakli","Ma’ruza-seminar shakli","Individual ta’lim shakli","Sinf-dars ta’lim shakli"],"a":1,"e":"Universitet ta’limining shakllanishi ma’ruza orqali nazariy bayon va seminar orqali muhokamani birlashtiruvchi ma’ruza-seminar tizimini rivojlantirdi."},
  {"m":627,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":1,"s":"O‘qituvchi rahbarligida belgilangan vaqt davomida muayyan o‘quvchilar guruhi bilan olib boriladigan asosiy ta’lim shakli nima?","o":["Ma’ruza mashg‘uloti","Seminar mashg‘uloti","Dars mashg‘uloti","Laboratoriya mashg‘uloti"],"a":2,"e":"Dars — doimiy tarkibli o‘quvchilar guruhi bilan jadval va belgilangan vaqt asosida, o‘qituvchi rahbarligida tashkil etiladigan asosiy ta’lim shaklidir."},
  {"m":630,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"Ommaviy, guruhli yoki kichik guruhli ko‘rinishda bir yoki bir necha fan bo‘yicha tashkil etilishi mumkin bo‘lgan yordamchi shakl qaysi?","o":["Fan to‘garagi","O‘quv ekskursiyasi","Fakultativ mashg‘ulot","Individual konsultatsiya"],"a":1,"e":"Ekskursiya ishtirokchilar soniga ko‘ra ommaviy, guruhli yoki kichik guruhli bo‘lishi, mazmuniga ko‘ra bir yoxud bir necha fan bilan bog‘lanishi mumkin."},
  {"m":1212,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"qollash","d":2,"s":"Darsda uy vazifasi tekshirildi, o‘tgan mavzu so‘raldi, yangi mazmun tushuntirildi, bilim baholandi va yangi uy vazifasi berildi. Bu qaysi dars turi?","o":["Aralash dars","Yangi bilim darsi","Mustahkamlash darsi","Umumlashtirish darsi"],"a":0,"e":"Bir darsda tekshirish, yangi bilim berish, mustahkamlash, baholash va uy vazifasi kabi bir nechta didaktik vazifa birlashsa, u aralash dars hisoblanadi."},
  {"m":1213,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"qollash","d":2,"s":"O‘qituvchi o‘tilgan mavzu bo‘yicha og‘zaki va yozma mashqlar berdi, bajarilishini tekshirdi hamda uyga qo‘shimcha mashq tayinladi. Bu qaysi dars turi?","o":["Aralash turdagi dars","Yangi bilim darsi","Mustahkamlash va takrorlash darsi","Umumlashtirish va tizimlashtirish darsi"],"a":2,"e":"Vaziyatda yangi mazmun bayoni emas, ilgari o‘rganilgan bilimlarni mashq qildirish, takrorlash va mustahkamlash ustuvor. Shuning uchun bu mustahkamlash va takrorlash darsidir."},
  {"m":1217,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"qollash","d":2,"s":"O‘qituvchi avval tayanch bilimlarni takrorladi, keyin yangi mavzuni o‘rgatdi, uni tekshirib mustahkamladi va uy vazifasi berdi. Bu qaysi dars turi?","o":["Aralash dars","Yangi bilim darsi","Mustahkamlash darsi","Umumlashtirish darsi"],"a":0,"e":"Tayanch bilimni faollashtirish, yangi mazmun, tekshirish, mustahkamlash va uy vazifasi bir mashg‘ulotda uyg‘unlashgani aralash darsning belgisidir."},
  {"m":1218,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"qollash","d":2,"s":"O‘quvchilar o‘tilgan mavzuni savollar orqali takrorlab, bilimlarini guruhli amaliy topshiriqda qo‘lladi va xulosalarini taqdim etdi. Bu qaysi dars turi?","o":["Aralash turdagi dars","Yangi bilim darsi","Mustahkamlash va takrorlash darsi","Umumlashtirish va tizimlashtirish darsi"],"a":2,"e":"Asosiy faoliyat ilgari o‘rganilgan bilimni esga tushirish, amalda qo‘llash va mustahkamlashdan iborat. Yangi bilimni birlamchi o‘zlashtirish vazifasi ko‘zda tutilmagan."},
  {"m":1555,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"Ta’limni tashkil etish shakliga berilgan eng to‘liq ta’rifni toping.","o":["O‘quvchining belgilangan tartibdagi tashqi faoliyati","O‘qituvchining maqsadli tartibdagi tashqi faoliyati","O‘qituvchi va o‘quvchining darsdan tashqari faoliyati","O‘qituvchi va o‘quvchining maqsadli, tartibli faoliyati"],"a":3,"e":"Ta’limni tashkil etish shakli o‘qituvchi va o‘quvchining muayyan maqsad, tartib va rejim asosida tashkil qilinadigan o‘quv-bilish faoliyatining tashqi ifodasidir."},
  {"m":1561,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":1,"s":"Talabaning muayyan nazariy kursni qay darajada o‘zlashtirganini faol muhokama va chiqishlar orqali aniqlashga xizmat qiladigan mashg‘ulot qaysi?","o":["Ma’ruza mashg‘uloti","Seminar mashg‘uloti","Dars mashg‘uloti","Laboratoriya mashg‘uloti"],"a":1,"e":"Seminar nazariy mavzuni oldindan o‘rganish, ma’ruza va savol-javoblar asosida muhokama qilish hamda o‘zlashtirishni aniqlashga xizmat qiladi."},
  {"m":1576,"c":"PM.GEN.04","l":"dars-turlari-rejalashtirish-va-sinfni-boshqarish","k":"bilish","d":2,"s":"O‘quvchi mustaqil ishlash jarayonida yuzaga kelgan savollariga o‘qituvchidan tushuntirish va yo‘l-yo‘riq oladigan yordamchi ta’lim shakli qaysi?","o":["Fan to‘garagi","O‘quv ekskursiyasi","Fakultativ mashg‘ulot","Individual konsultatsiya"],"a":3,"e":"Konsultatsiyada o‘quvchi mustaqil o‘rganishda tushunmagan masalalari bo‘yicha savol beradi, o‘qituvchi esa aniqlashtiruvchi tushuntirish va yo‘l-yo‘riq ko‘rsatadi."}
]
$bank$::jsonb) AS source(v);

DO $task530_b06$
DECLARE
  b task530_batch06%rowtype; actor uuid; subject_id uuid; construct_id uuid; lesson_id uuid;
  question_id uuid; option_id uuid; option_ids uuid[]; i integer; n integer; bad integer;
  bad_id uuid; bad_code text; bad_source text;
BEGIN
  IF (SELECT count(*) FROM task530_batch06)<>30 THEN RAISE EXCEPTION 'TASK530_B06_COUNT'; END IF;
  IF EXISTS(SELECT 1 FROM task530_batch06 tb JOIN public.questions q
    ON q.source_reference='telegram:@PedMahoratGuli:'||tb.message_id::text
    OR q.source_reference LIKE 'telegram:@PedMahoratGuli:'||tb.message_id::text||'|%')
  THEN RAISE EXCEPTION 'TASK530_B06_SOURCE_ALREADY_REPRESENTED'; END IF;
  SELECT id INTO STRICT actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
  THEN RAISE EXCEPTION 'TASK530_B06_OWNER_NOT_UNIQUE'; END IF;
  SELECT id INTO STRICT subject_id FROM public.subjects WHERE code='informatika';
  CREATE TEMP TABLE task530_b06_ids(id uuid PRIMARY KEY) ON COMMIT DROP;

  FOR b IN SELECT * FROM task530_batch06 ORDER BY message_id LOOP
    SELECT c.id,l.id INTO STRICT construct_id,lesson_id
    FROM public.constructs c JOIN public.lesson_constructs lc ON lc.construct_id=c.id
    JOIN public.lessons l ON l.id=lc.lesson_id
    WHERE c.code=b.construct_code AND c.is_active AND l.slug=b.lesson_slug
      AND l.status='published'::public.content_status;
    IF EXISTS(SELECT 1 FROM public.questions q WHERE q.status IN('review','published')
      AND regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g')=
          regexp_replace(lower(btrim(b.stem_md)),'[^[:alnum:]]+','','g'))
    THEN RAISE EXCEPTION 'TASK530_B06_ACTIVE_EXACT_DUPLICATE_%',b.message_id; END IF;

    question_id:=gen_random_uuid();
    INSERT INTO public.questions(id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,status,author_id,is_generated,source_lesson_id,source_reference)
    VALUES(question_id,subject_id,construct_id,'PM.GEN','Y1'::public.question_format,b.cognitive,b.difficulty,
      b.stem_md,'review'::public.content_status,NULL,true,lesson_id,b.source_reference);
    INSERT INTO task530_b06_ids VALUES(question_id);
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
    FROM task530_b06_ids r JOIN public.questions q ON q.id=r.id
    JOIN public.question_options o ON o.question_id=q.id AND btrim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id GROUP BY q.id
  ) SELECT count(*) FILTER(WHERE option_count<>4 OR distinct_count<>4 OR correct_count<>1
      OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25),count(*) INTO bad,n FROM checks;
  IF bad<>0 OR n<>30 THEN RAISE EXCEPTION 'TASK530_B06_BALANCE_%_COUNT_%',bad,n; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers(question_id,authorized_by,content_fingerprint,authority,provenance)
  SELECT q.id,actor,public.professional_question_fingerprint(q.id),'owner_explicit_no_external_expert_20261018',
    'TASK-530 batch 06; owner-delegated AI expert rewrite of PedMahoratGuli general pedagogy/didactics items; key independently checked; independent human expert signoff NOT claimed'
  FROM task530_b06_ids r JOIN public.questions q ON q.id=r.id;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>30 THEN RAISE EXCEPTION 'TASK530_B06_WAIVERS_%',n; END IF;
  SELECT r.id,q.source_reference,s.finding_code INTO bad_id,bad_source,bad_code
  FROM task530_b06_ids r JOIN public.questions q ON q.id=r.id
  CROSS JOIN LATERAL public.pedagogy_semantic_quality_signals(r.id) s
  WHERE s.severity='high' ORDER BY r.id,s.finding_code LIMIT 1;
  IF bad_id IS NOT NULL THEN RAISE EXCEPTION 'TASK530_B06_SEMANTIC_%_%',bad_source,bad_code; END IF;
  UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
  FROM task530_b06_ids r WHERE q.id=r.id AND q.status='review'::public.content_status;
  GET DIAGNOSTICS n=ROW_COUNT; IF n<>30 THEN RAISE EXCEPTION 'TASK530_B06_PUBLISHED_%',n; END IF;
  SELECT count(*) INTO n FROM task530_b06_ids r JOIN public.questions q ON q.id=r.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF n<>30 THEN RAISE EXCEPTION 'TASK530_B06_POSTFLIGHT_%_OF_30',n; END IF;
END
$task530_b06$;
COMMIT;
