-- TASK-428 — third expert-screened PedMahoratGuli intake batch.
-- These 21 items are additive expert rewrites. Telegram provides discovery
-- provenance only; every key, construct and distractor is independently checked.
BEGIN;
SET LOCAL lock_timeout = '8s';
SET LOCAL statement_timeout = '120s';

CREATE TEMP TABLE task428_batch03 (
  message_id bigint PRIMARY KEY,
  construct_code text NOT NULL,
  lesson_slug text NOT NULL,
  cognitive public.cognitive_level NOT NULL,
  difficulty integer NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  stem_md text NOT NULL,
  options jsonb NOT NULL CHECK (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) = 4),
  correct_index integer NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  explanation_md text NOT NULL,
  source_reference text GENERATED ALWAYS AS (
    'telegram:@PedMahoratGuli:' || message_id::text || '|task428:expert-rewrite:v1'
  ) STORED
) ON COMMIT DROP;

INSERT INTO task428_batch03 (
  message_id, construct_code, lesson_slug, cognitive, difficulty,
  stem_md, options, correct_index, explanation_md
)
SELECT (v->>'m')::bigint, v->>'c', v->>'l',
  (v->>'k')::public.cognitive_level, (v->>'d')::integer,
  v->>'s', v->'o', (v->>'a')::integer, v->>'e'
FROM jsonb_array_elements($bank$
[
  {"m":2474,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"qollash","d":3,"s":"Matematika o‘qituvchisi perpendikulyar chiziqlarni doskada chizib ko‘rsatdi, so‘ng o‘quvchilarga berilgan shart bo‘yicha shunday chiziqlarni mustaqil chizishni topshirdi. Topshiriq bosqichida qaysi metod yetakchi?","o":["Hikoya metodi orqali chiziqlar tarixini og‘zaki bayon qilish","Tushuntirish metodi orqali tayyor ta’rifni qayta izohlash","Amaliy mashq orqali perpendikulyar chiziqlarni mustaqil chizish","Tasvir metodi orqali tayyor chizma va rasmlarni ko‘rsatish"],"a":2,"e":"Savol topshiriq bajariladigan bosqichni so‘raydi. O‘quvchi chiziqni o‘zi chizib, o‘rganilgan usulni amalda bajargani uchun yetakchi metod amaliy mashqdir."},
  {"m":2744,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"qollash","d":3,"s":"Guruh ishida qatnashmaydigan o‘quvchiga o‘qituvchi avval kichik va aniq vazifa berdi, muvaffaqiyatidan so‘ng vazifani bosqichma-bosqich murakkablashtirdi. Qaysi mehnat harakati bajarildi?","o":["Individual ehtiyojdan kelib chiqib o‘z vaqtida differensial yordam berish","Dars mavzusini faqat kundalik hayot misollari bilan tushuntirish","Barcha o‘quvchiga fikr bildirish uchun aynan bir xil vaqt berish","Faollikni o‘quvchining darsdan tashqari qiziqishiga bog‘lab rag‘batlantirish"],"a":0,"e":"Kichik vazifadan boshlab yordamni o‘quvchining tayyorligiga mos ravishda oshirish differensial qo‘llab-quvvatlashdir. Maqsad o‘quvchini bosqichma-bosqich faol ishtirokka olib kirishdir."},
  {"m":2750,"c":"KS.03","l":"ozlashtirishni-baholash-va-qayta-aloqa","k":"qollash","d":3,"s":"O‘quv yili boshida o‘qituvchi yozma ish, qisqa test va og‘zaki suhbatdan foydalanib, o‘quvchilarning boshlang‘ich bilim darajasini aniqladi va keyingi rejani tuzdi. Qaysi harakat ustuvor?","o":["Yakuniy natijani baholash uchun turli nazorat vositalaridan foydalanish","Boshlang‘ich holatni diagnostika qilish uchun turli vositalardan foydalanish","Bilim egallash dinamikasini butun yil davomida muntazam kuzatib borish","Erishilgan natijalarni faqat chorak yakunida umumiy tahlil qilish"],"a":1,"e":"Nazorat o‘quv yili boshida keyingi rejalash uchun mavjud tayyorgarlikni aniqlash maqsadida o‘tkazilgan. Bu diagnostik baholash bo‘lib, bir nechta vosita dalilning ishonchliligini oshiradi."},
  {"m":2752,"c":"KS.04","l":"tarbiyaviy-faoliyatni-tashkil-etish","k":"bilish","d":2,"s":"Bolaning his-tuyg‘u va qadriyatlarini rivojlantiradigan tarbiyaviy vaziyat hamda hodisalarni maqsadli loyihalash qaysi kasbiy kompetensiya sohasiga kiradi?","o":["O‘quv jarayonini maqsad va muddat asosida rejalashtirish","Ta’lim samaradorligini metod va vositalar orqali ta’minlash","Tarbiyaviy faoliyatni maqsadli ravishda tashkil etish","Hamkasb va ota-onalar bilan kasbiy hamkorlik qilish"],"a":2,"e":"His-tuyg‘u, munosabat va qadriyatlarni rivojlantiradigan vaziyatni loyihalash tarbiyaviy maqsadga xizmat qiladi. Shu sababli u tarbiyaviy faoliyatni tashkil etish sohasiga mansub."},
  {"m":2786,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":2,"s":"Tarix darsida o‘quvchilar o‘rganilgan sana, shaxs va atamalarni xotiradan qayta aytdilar. Bu topshiriq Blum taksonomiyasining qaysi bosqichiga mos?","o":["Tahlil — faktlar orasidagi sababiy bog‘lanishni ajratish","Tushunish — mazmunni o‘z so‘zi bilan qayta ifodalash","Bilish — o‘rganilgan fakt va atamalarni esga tushirish","Qo‘llash — qoidani yangi vaziyatda amalda ishlatish"],"a":2,"e":"Sana, shaxs va atamalarni xotiradan qayta aytish ma’lumotni esga tushirishni talab qiladi. Bu Blum taksonomiyasidagi bilish bosqichidir."},
  {"m":2947,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"qollash","d":3,"s":"Internet xavfsizligi darsida o‘qituvchi animatsiya orqali soxta sayt foydalanuvchi ma’lumotini qanday qo‘lga kiritishini ekran orqali bevosita ko‘rsatdi. Qaysi metod yetakchi?","o":["Namoyish metodi orqali jarayonni dinamik tarzda ko‘rsatish","Tushuntirish metodi orqali sabablarni faqat og‘zaki bayon qilish","Amaliy metod orqali o‘quvchiga soxta sayt yaratishni topshirish","Hikoya metodi orqali xavfsizlik voqeasini izchil aytib berish"],"a":0,"e":"Animatsiya jarayonning qanday kechishini dinamik ko‘rgazma sifatida bevosita ko‘rsatadi. Shuning uchun yetakchi metod namoyishdir; o‘quvchi xavfli amalni o‘zi bajarmaydi."},
  {"m":2113,"c":"KS.04","l":"tarbiyaviy-faoliyatni-tashkil-etish","k":"qollash","d":3,"s":"O‘qituvchi o‘quvchilarni yosh bo‘lsa ham mustaqil fikrli shaxs sifatida qabul qiladi, ularni bo‘lmasdan tinglaydi va fikriga hurmat bilan munosabat bildiradi. Qaysi ko‘nikma namoyon bo‘ldi?","o":["Ta’limni faqat yosh va madaniy farqlar bo‘yicha alohida tashkil etish","Bolalar bilan hurmatli muloqot qilib, ularning qadr-qimmatini tan olish","O‘quv guruhini faqat qat’iy nazorat va topshiriq orqali boshqarish","Do‘stona muhitni o‘quvchilarning o‘zlari yaratishini kutib turish"],"a":1,"e":"O‘quvchini shaxs sifatida qabul qilish, diqqat bilan tinglash va fikriga hurmat bildirish uning qadr-qimmatini tan oluvchi pedagogik muloqotdir."},
  {"m":2114,"c":"KS.03","l":"ozlashtirishni-baholash-va-qayta-aloqa","k":"mulohaza","d":4,"s":"O‘qituvchi tuzgan testda topshiriq qiyinligi maqsadga mos taqsimlanmagan va o‘tkazish tartibi barcha o‘quvchi uchun bir xil tushuntirilmagan. Eng avvalo qaysi bilim yetishmayapti?","o":["Baholash nazariyalari va bahoning o‘quvchi motivatsiyasiga umumiy ta’siri","Turli ehtiyojni hisobga olib test tuzish hamda shaffof o‘tkazish qoidalari","Diagnostik va yakuniy testlarning faqat nomlarini bir-biridan ajratish","Baholash usulini har bir o‘quvchi xohishiga ko‘ra butunlay almashtirish"],"a":1,"e":"Muammo test konstruksiyasi va uni shaffof o‘tkazish tartibida. Shuning uchun turli ta’limiy ehtiyojlarni hisobga olgan test tuzish va o‘tkazish qoidalarini bilish zarur."},
  {"m":2115,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"mulohaza","d":4,"s":"Kuzatilgan darsda o‘qituvchi vaqtni noto‘g‘ri taqsimlagani uchun yangi mavzuni tugata olmadi, ayrim o‘quvchilar esa vazifasiz qolib ketdi. Qaysi ko‘nikma yetarli shakllanmagan?","o":["O‘quv mazmuniga mos interfaol metodni tanlash va qo‘llash","Har bir darsda kamida ikkita raqamli vositadan foydalanish","Pedagogik vaziyatni darsdan keyin yozma ravishda tahlil qilish","Dars vaqtini boshqarib, o‘quvchilar ishini mas’uliyatli tashkil etish"],"a":3,"e":"Ikki belgi — vaqt yetmasligi va ayrim o‘quvchilarning vazifasiz qolishi — dars vaqti hamda o‘quvchilar ishini tashkil etishdagi kamchilikni ko‘rsatadi."},
  {"m":2116,"c":"KS.01","l":"oquv-jarayonini-rejalashtirish","k":"qollash","d":3,"s":"O‘qituvchi chorak oxirida insho taqdimoti bo‘lishini belgilab, chorak davomida mazkur natijaga olib boradigan oraliq vazifalarni muddatlari bilan rejalashtirdi. Qaysi ko‘nikma qo‘llandi?","o":["Baholash natijasiga qarab oldingi rejalarni qayta muvofiqlashtirish","Aniq o‘lchanadigan natija, vazifa va muddatlarni rejalarda belgilash","Dars usulini faqat o‘quvchilarning yoshiga qarab tanlash","O‘quv dasturini shaxsiy qiziqish asosida mazmunan almashtirish"],"a":1,"e":"Yakuniy mahsulot oldindan belgilangan va unga olib boradigan vazifalar aniq muddatlarga joylashtirilgan. Bu natija, vazifa va muddatni rejalashtirish ko‘nikmasidir."},
  {"m":2175,"c":"KS.06","l":"oz-ozini-rivojlantirish-va-kasbiy-osish","k":"bilish","d":2,"s":"Pedagog o‘z faoliyatidagi kuchli va zaif tomonlarni anglab, sabablarini tahlil qiladi hamda o‘zini takomillashtirish uchun keyingi qadamlarni belgilaydi. Bu jarayon nima deyiladi?","o":["Intellekt — bilish vazifalarini bajarish imkoniyati","Qobiliyat — faoliyatni muvaffaqiyatli bajarish xususiyati","Refleksiya — o‘z faoliyatini anglash va tahlil qilish","Intuitsiya — yechimni bevosita sezgi orqali topish"],"a":2,"e":"O‘z faoliyatini orqaga nazar tashlab anglash, kuchli va zaif tomonlarni tahlil qilish hamda rivojlanish yo‘lini belgilash refleksiyaning mazmunidir."},
  {"m":2251,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"O‘qituvchi nutqida shevaga xos, qo‘pol, parazit va o‘rinsiz chet so‘zlarni ishlatmaydi; fikrini adabiy til vositalari bilan ifodalaydi. Nutqning qaysi sifati namoyon bo‘lgan?","o":["Nutqning to‘g‘riligi — til me’yorlariga qat’iy rioya qilish","Nutqning aniqligi — fikrni mazmunga aynan mos ifodalash","Nutqning mantiqiyligi — fikrlarni izchil bog‘lab bayon qilish","Nutqning tozaligi — begona va noo‘rin unsurlardan qochish"],"a":3,"e":"Sheva, jargon, parazit va o‘rinsiz chet so‘zlardan qochish nutqning tozaligini ta’minlaydi. To‘g‘rilik esa ko‘proq grammatik va talaffuz me’yorlariga moslikni bildiradi."},
  {"m":2252,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"Pedagog suhbatda fikrlarini sabab va xulosa ketma-ketligida bayon qildi; har bir gap oldingi fikrdan kelib chiqdi va qarama-qarshilik kuzatilmadi. Nutqning qaysi sifati ustuvor?","o":["To‘g‘rilik — so‘z va gaplarni til me’yoriga mos qo‘llash","Aniqlik — so‘zni anglatilgan tushunchaga aynan mos tanlash","Mantiqiylik — fikrlarni izchil va o‘zaro bog‘liq bayon qilish","Ifodalilik — tinglovchiga hissiy ta’sir ko‘rsatadigan vosita qo‘llash"],"a":2,"e":"Sababdan xulosaga izchil o‘tish va gaplar orasida qarama-qarshilik bo‘lmasligi nutqning mantiqiyligini ko‘rsatadi."},
  {"m":2253,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"O‘qituvchi sana, atama va faktlarni tekshirib, predmet hamda hodisani noto‘g‘ri talqin qilmaydigan so‘zlarni tanlab gapirdi. Nutqning qaysi sifati ustuvor?","o":["Aniqlik — so‘z va ma’lumotni ifodalanayotgan mazmunga mos tanlash","Mantiqiylik — fikr qismlarini sababiy ketma-ketlikda joylashtirish","Ravonlik — ortiqcha to‘xtalishsiz bir maromda gapirish","Ifodalilik — obrazli vositalar bilan hissiy ta’sir ko‘rsatish"],"a":0,"e":"Faktning tekshirilishi va so‘zning predmetga mos tanlanishi mazmunni xatosiz, aynan ifodalashga xizmat qiladi. Bu nutq aniqligining belgisidir."},
  {"m":2254,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"bilish","d":2,"s":"O‘qituvchi so‘zlarni adabiy talaffuz va urg‘u me’yoriga mos aytadi, qo‘shimcha hamda gap shakllarini grammatik qoidalarga muvofiq ishlatadi. Nutqning qaysi sifati namoyon?","o":["Tozalik — sheva, jargon va parazit birliklardan xoli bo‘lish","To‘g‘rilik — talaffuz hamda grammatik me’yorlarga rioya qilish","Aniqlik — so‘zni ifodalanayotgan tushunchaga aynan mos tanlash","Mantiqiylik — fikrlarni izchil va o‘zaro bog‘liq bayon qilish"],"a":1,"e":"Adabiy talaffuz, urg‘u va grammatik shakllarga rioya etish nutqning to‘g‘riligini belgilaydi. Tozalik esa noo‘rin til unsurlarining yo‘qligiga taalluqli."},
  {"m":2258,"c":"PM.GEN.06","l":"pedagogik-etika-nutq-texnika-va-takt","k":"qollash","d":3,"s":"Darsda gaplashayotgan o‘quvchi o‘qituvchining jiddiy qarashi va yuz ifodasini ko‘rib, og‘zaki ogohlantirishsiz suhbatni to‘xtatdi. Qaysi pedagogik texnika vositasi qo‘llandi?","o":["Pantomimika — butun gavda va holat orqali ma’no ifodalash","Jest — qo‘l va barmoq harakati orqali ishora qilish","Mimika — yuz hamda nigoh ifodasi orqali ta’sir ko‘rsatish","Nutq texnikasi — ovoz, sur’at va ohangni boshqarish"],"a":2,"e":"Vaziyatda signal yuz ifodasi va nigoh orqali berilgan. Yuz mushaklari hamda qarash bilan ma’no ifodalash mimikaga kiradi."},
  {"m":2264,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"qollash","d":3,"s":"Texnologiya darsida o‘quvchi yasagan sodda uchish qurilmasining ishlashini sinf oldida amalda ko‘rsatdi, boshqalar esa jarayonni kuzatdi. Qaysi metod yetakchi?","o":["Debat — qarama-qarshi nuqtayi nazarlarni dalillar bilan himoya qilish","Munozara — muammo bo‘yicha turli fikrlarni birgalikda muhokama qilish","Namoyish — obyektning ishlash jarayonini bevosita ko‘rsatish","Debrifing — bajarilgan faoliyatni yakunda tizimli tahlil qilish"],"a":2,"e":"Qurilmaning real ishlash jarayoni sinf oldida bevosita ko‘rsatilmoqda. Bu namoyish metodining aniq belgisi; bahs yoki yakuniy tahlil yetakchi emas."},
  {"m":2344,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"qollash","d":3,"s":"Biologiya darsida o‘quvchilar o‘simlik hayoti haqidagi bilimni maktab bog‘ida ko‘chat ekish va parvarish shartlarini belgilash orqali amalda sinab ko‘rdilar. Qaysi mehnat harakati ustuvor?","o":["Asosiy kompetensiyalarni faqat nazariy topshiriqlar orqali rivojlantirish","Jamoaviy loyihani yakuniy mahsulotsiz erkin muhokama sifatida tashkil etish","Metakognitiv strategiyani o‘z-o‘zini baholash varaqasi orqali o‘rgatish","Dars mavzusini hayotiy amaliyot bilan maqsadli bog‘lash"],"a":3,"e":"Ko‘chat ekish va parvarish shartlarini belgilash nazariy bilimni real faoliyatda qo‘llashga imkon beradi. Shu sababli mavzu hayotiy amaliyot bilan bog‘langan."},
  {"m":2346,"c":"KS.04","l":"tarbiyaviy-faoliyatni-tashkil-etish","k":"qollash","d":3,"s":"Bir sinfda turli millat, til va madaniy tajribaga ega o‘quvchilar ta’lim oladi. Tarbiyaviy ishni rejalashda o‘qituvchining eng asosli harakati qaysi?","o":["Barcha tadbirda faqat bitta madaniy tajribani namuna sifatida tanlash","O‘quvchilarning yoshi, madaniyati va individual xususiyatlarini hisobga olish","Sinfdagi farqlarni muhokama qilmasdan faqat umumiy qoidani yodlatish","Tarbiyaviy vazifani o‘quvchilarning o‘zini o‘zi boshqarishiga to‘liq topshirish"],"a":1,"e":"Tarbiyaviy faoliyat inklyuziv bo‘lishi uchun o‘quvchilarning madaniy tajribasi, yoshi va individual xususiyatlari rejalashda inobatga olinadi."},
  {"m":2349,"c":"KS.01","l":"oquv-jarayonini-rejalashtirish","k":"bilish","d":2,"s":"O‘qituvchi darsning maqsadini, unga mos shakl va usullarni hamda vaqt taqsimotini oldindan belgiladi. Bu faoliyat qaysi kasbiy kompetensiya sohasiga kiradi?","o":["O‘quv jarayonini maqsad va usullar asosida rejalashtirish","Ta’lim samaradorligini dars jarayonida bevosita ta’minlash","O‘zlashtirishni mezonlar asosida baholash va qayta aloqa berish","Sinfdan tashqari tarbiyaviy faoliyatni tashkil etish"],"a":0,"e":"Maqsad, shakl, usul va vaqtni darsdan oldin belgilash rejalashtirishning asosiy tarkibidir. Vaziyatda baholash yoki tarbiyaviy tadbir emas, dars loyihasi yaratilmoqda."},
  {"m":2350,"c":"KS.01","l":"oquv-jarayonini-rejalashtirish","k":"qollash","d":3,"s":"O‘qituvchiga qisqa muddat ichida ochiq dars tayyorlash topshirildi. Darsni maqsadga muvofiq va yaxlit tashkil etish uchun qaysi ko‘nikma birinchi navbatda zarur?","o":["Oldingi baholash natijasiga qarab butun o‘quv dasturini qayta tuzish","Har bir topshiriqqa alohida fanlararo kompetensiyani majburan kiritish","Dars maqsadidan qat’i nazar zamonaviy texnologiyani tanlab qo‘llash","Dars vaqtini rejalab, maqsad, shakl va usullarni o‘zaro mos aniqlash"],"a":3,"e":"Qisqa tayyorgarlik vaqtida ham darsning maqsadi, shakli, usuli va vaqt taqsimoti o‘zaro mos bo‘lishi kerak. Bu o‘quv jarayonini rejalashtirishning tayanch ko‘nikmasidir."}
]
$bank$::jsonb) AS source(v);

DO $preflight$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n FROM task428_batch03;
  IF n <> 21 THEN RAISE EXCEPTION 'TASK428_B03_COUNT_%', n; END IF;

  IF EXISTS (
    SELECT 1 FROM task428_batch03 b
    JOIN public.questions q
      ON q.source_reference = 'telegram:@PedMahoratGuli:' || b.message_id::text
      OR q.source_reference LIKE 'telegram:@PedMahoratGuli:' || b.message_id::text || '|%'
  ) THEN RAISE EXCEPTION 'TASK428_B03_SOURCE_ALREADY_REPRESENTED'; END IF;

  SELECT count(*) INTO n
  FROM task428_batch03 b
  JOIN public.constructs c ON c.code=b.construct_code AND c.is_active
  JOIN public.lesson_constructs lc ON lc.construct_id=c.id
  JOIN public.lessons l ON l.id=lc.lesson_id AND l.slug=b.lesson_slug
    AND l.status='published'::public.content_status;
  IF n <> 21 THEN RAISE EXCEPTION 'TASK428_B03_MAPPING_%_OF_21', n; END IF;

  IF EXISTS (
    SELECT 1 FROM task428_batch03 b
    JOIN public.questions q ON q.status IN ('review','published')
      AND regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g') =
          regexp_replace(lower(btrim(b.stem_md)),'[^[:alnum:]]+','','g')
  ) THEN RAISE EXCEPTION 'TASK428_B03_ACTIVE_EXACT_DUPLICATE'; END IF;
END
$preflight$;

DO $insert_and_release$
DECLARE
  b task428_batch03%rowtype;
  actor uuid;
  subject_id uuid;
  construct_id uuid;
  lesson_id uuid;
  question_id uuid;
  option_id uuid;
  option_ids uuid[];
  i integer;
  n integer;
  bad integer;
BEGIN
  SELECT id INTO STRICT actor FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF (SELECT count(*) FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false))<>1
  THEN RAISE EXCEPTION 'TASK428_B03_OWNER_NOT_UNIQUE'; END IF;
  SELECT id INTO STRICT subject_id FROM public.subjects WHERE code='informatika';

  CREATE TEMP TABLE task428_b03_ids(id uuid PRIMARY KEY) ON COMMIT DROP;
  FOR b IN SELECT * FROM task428_batch03 ORDER BY message_id LOOP
    SELECT c.id,l.id INTO STRICT construct_id,lesson_id
    FROM public.constructs c
    JOIN public.lesson_constructs lc ON lc.construct_id=c.id
    JOIN public.lessons l ON l.id=lc.lesson_id
    WHERE c.code=b.construct_code AND c.is_active AND l.slug=b.lesson_slug
      AND l.status='published'::public.content_status;

    question_id:=gen_random_uuid();
    INSERT INTO public.questions(
      id,subject_id,construct_id,group_code,format,cognitive,difficulty,
      stem_md,status,author_id,is_generated,source_lesson_id,source_reference
    ) VALUES (
      question_id,subject_id,construct_id,
      CASE WHEN b.construct_code LIKE 'KS.%' THEN 'KS' ELSE 'PM.GEN' END,
      'Y1'::public.question_format,b.cognitive,b.difficulty,b.stem_md,
      'review'::public.content_status,NULL,true,lesson_id,b.source_reference
    );
    INSERT INTO task428_b03_ids VALUES(question_id);

    option_ids:=ARRAY[]::uuid[];
    FOR i IN 0..3 LOOP
      option_id:=gen_random_uuid();
      option_ids:=array_append(option_ids,option_id);
      INSERT INTO public.question_options(id,question_id,side,order_idx,content_md)
      VALUES(option_id,question_id,'a',i,b.options->>i);
    END LOOP;
    INSERT INTO public.question_keys(question_id,payload,explanation_md)
    VALUES(question_id,jsonb_build_object('correct_option_id',option_ids[b.correct_index+1]),b.explanation_md);
  END LOOP;

  WITH checks AS (
    SELECT q.id,count(o.id) option_count,
      count(DISTINCT lower(btrim(o.content_md))) distinct_count,
      count(*) FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correct_count,
      min(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) minw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1)) maxw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        FILTER(WHERE o.id::text=k.payload->>'correct_option_id') correctw,
      max(array_length(regexp_split_to_array(btrim(o.content_md),'[[:space:]]+'),1))
        FILTER(WHERE o.id::text<>k.payload->>'correct_option_id') maxwrong
    FROM task428_b03_ids r JOIN public.questions q ON q.id=r.id
    JOIN public.question_options o ON o.question_id=q.id AND btrim(o.side)='a'
    JOIN public.question_keys k ON k.question_id=q.id
    WHERE q.status='review'::public.content_status AND q.format='Y1'::public.question_format
    GROUP BY q.id
  )
  SELECT count(*) FILTER(WHERE option_count<>4 OR distinct_count<>4 OR correct_count<>1
      OR minw<1 OR maxw>minw*1.8 OR correctw>maxwrong*1.25),count(*)
  INTO bad,n FROM checks;
  IF bad<>0 OR n<>21 THEN RAISE EXCEPTION 'TASK428_B03_BALANCE_OR_KEY_%_COUNT_%',bad,n; END IF;

  SELECT count(*) INTO bad
  FROM task428_b03_ids r JOIN public.questions q ON q.id=r.id
  JOIN public.questions other ON other.id<>q.id AND other.status IN ('review','published')
    AND regexp_replace(lower(btrim(other.stem_md)),'[^[:alnum:]]+','','g')=
        regexp_replace(lower(btrim(q.stem_md)),'[^[:alnum:]]+','','g');
  IF bad<>0 THEN RAISE EXCEPTION 'TASK428_B03_EXACT_DUPLICATE_%',bad; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers(
    question_id,authorized_by,content_fingerprint,authority,provenance
  )
  SELECT q.id,actor,public.professional_question_fingerprint(q.id),
    'owner_explicit_no_external_expert_20261018',
    'TASK-428 batch 03; user delegated complete PedMahoratGuli pedagogy-bank review and final decisions to ChatGPT; AI-assisted expert rewrite with independently checked key and mapping; independent human expert signoff NOT claimed'
  FROM task428_b03_ids r JOIN public.questions q ON q.id=r.id;
  GET DIAGNOSTICS n=ROW_COUNT;
  IF n<>21 THEN RAISE EXCEPTION 'TASK428_B03_WAIVERS_%',n; END IF;

  UPDATE public.questions q SET status='published'::public.content_status,updated_at=now()
  FROM task428_b03_ids r WHERE q.id=r.id AND q.status='review'::public.content_status;
  GET DIAGNOSTICS n=ROW_COUNT;
  IF n<>21 THEN RAISE EXCEPTION 'TASK428_B03_PUBLISHED_%',n; END IF;

  SELECT count(*) INTO n
  FROM task428_b03_ids r JOIN public.questions q ON q.id=r.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id=q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND w.content_fingerprint=public.professional_question_fingerprint(q.id);
  IF n<>21 THEN RAISE EXCEPTION 'TASK428_B03_POSTFLIGHT_%_OF_21',n; END IF;
END
$insert_and_release$;

COMMIT;
