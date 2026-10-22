-- TASK-428 — second expert-screened PedMahoratGuli intake batch.
-- Telegram is discovery evidence, not an authoritative answer key. The 22 new
-- items below are independently rewritten and mapped to canonical constructs.
-- Two already-staged REVIEW items are released with exact fingerprint guards.
-- This is owner-authorized AI editorial work; independent human signoff is not claimed.
BEGIN;
SET LOCAL lock_timeout = '8s';
SET LOCAL statement_timeout = '120s';

CREATE TEMP TABLE task428_bank (
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

INSERT INTO task428_bank (
  message_id, construct_code, lesson_slug, cognitive, difficulty,
  stem_md, options, correct_index, explanation_md
)
SELECT
  (item->>'m')::bigint,
  item->>'c',
  item->>'l',
  (item->>'k')::public.cognitive_level,
  (item->>'d')::integer,
  item->>'s',
  item->'o',
  (item->>'a')::integer,
  item->>'e'
FROM jsonb_array_elements($bank$
[
  {"m":2393,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"qollash","d":3,"s":"Dars boshida o‘qituvchi o‘quvchilarning darsdan tashqari qiziqishlarini aniqladi. Keyingi topshiriqlarni shu qiziqishlar bilan bog‘lagach, barcha o‘quvchi faol qatnashdi. Qaysi kasbiy harakat qo‘llandi?","o":["Darsning barcha bosqichlari uchun bir xil usulni tanlash","Shaxsiy qiziqishlardan darsdagi ishtirokni rag‘batlantirish uchun foydalanish","Faollikni faqat yakuniy baho orqali rag‘batlantirish","Dars vaqtini ko‘proq nazariy bayonga ajratish"],"a":1,"e":"O‘qituvchi o‘quvchilarning shaxsiy qiziqishlarini bilib, ularni dars vazifalariga bog‘ladi. Bu ichki motivatsiyani kuchaytirib, ta’lim jarayonidagi faol ishtirokni ta’minlaydi."},
  {"m":2395,"c":"KS.03","l":"ozlashtirishni-baholash-va-qayta-aloqa","k":"qollash","d":3,"s":"O‘qituvchi nazorat natijalarini tahlil qilib, har bir o‘quvchiga xatosi va keyingi qadamini tushuntirdi; ota-onalarga esa rivojlanish dinamikasini suhbat va yozma hisobot orqali yetkazdi. Qaysi ko‘nikma ustuvor?","o":["Baholash vositalarini faqat yakuniy nazorat uchun ishlab chiqish","Barcha o‘quvchiga natijadan qat’i nazar bir xil maslahat berish","Baholash usulini faqat o‘quvchining qobiliyatiga qarab almashtirish","O‘quvchi va ota-onaga qayta aloqa berishning turli strategiyalaridan foydalanish"],"a":3,"e":"Vaziyatda natija o‘quvchiga rivojlantiruvchi izoh bilan, ota-onaga esa turli aloqa shakllari orqali yetkazilmoqda. Bu baholash natijalari bo‘yicha maqsadli qayta aloqa strategiyalaridir."},
  {"m":2398,"c":"KS.01","l":"oquv-jarayonini-rejalashtirish","k":"qollash","d":3,"s":"Oraliq baholash natijalari ayrim mavzularga ko‘proq vaqt kerakligini ko‘rsatdi. O‘qituvchi keyingi darslar rejasidagi vaqt va mashqlarni shu ma’lumot asosida o‘zgartirdi. Qaysi kompetensiya namoyon bo‘ldi?","o":["O‘quv jarayonini baholash dalillari asosida rejalashtirish","Ta’lim samaradorligini faqat yakuniy natija bilan o‘lchash","Tarbiyaviy tadbirlarni sinf rejasiga muvofiq tashkil etish","Bahoni ota-onaga muntazam ravishda ma’lum qilib borish"],"a":0,"e":"Baholashdan olingan dalil keyingi darslarning vaqti hamda mashqlarini qayta rejalash uchun ishlatilgan. Shu sababli vaziyat o‘quv jarayonini rejalashtirish kompetensiyasiga kiradi."},
  {"m":2403,"c":"KS.05","l":"xavfsiz-rivojlantiruvchi-talim-muhiti","k":"qollash","d":3,"s":"Sinf sardori saylovida o‘qituvchi bahosi yoki oilaviy sharoitidan qat’i nazar istagan o‘quvchiga nomzod bo‘lish va ovoz berish imkonini berdi. Qaysi tamoyil amalga oshirildi?","o":["Faqat yuqori natijali o‘quvchilarni yetakchilik vazifalariga oldindan tayyorlash","Har bir o‘quvchiga sinf hayotida qatnashish uchun teng imkoniyat yaratish","Nomzodlarni o‘qituvchining shaxsiy mezoni bo‘yicha saralash","Saylov natijasini sinfdagi baholar asosida qayta belgilash"],"a":1,"e":"Nomzodlik va ovoz berish imkoniyati o‘zlashtirish darajasi yoki ijtimoiy sharoit bilan cheklanmagan. Bu xavfsiz va inklyuziv muhitdagi teng ishtirok tamoyilidir."},
  {"m":2471,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"bilish","d":2,"s":"Matematika o‘qituvchisi Arximed qonunini tushuntirishdan oldin uning kashf etilishi haqidagi qisqa, izchil voqeani og‘zaki bayon qildi. Qaysi metod qo‘llandi?","o":["Hikoya metodi orqali voqeani izchil bayon qilish","Tushuntirish metodi orqali sababiy bog‘lanishni ochish","Amaliy metod orqali o‘lchash ishlarini bajarish","Tasvir metodi orqali statik chizmani ko‘rsatish"],"a":0,"e":"Qisqa voqeani obrazli va izchil og‘zaki bayon qilish hikoya metodining belgisidir. Bu yerda qonun isbotlanmayapti yoki amaliy tajriba bajarilmayapti."},
  {"m":2475,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"qollash","d":3,"s":"Aylana uzunligi mavzusida o‘quvchilar turli dumaloq buyumlarni o‘zlari o‘lchab, natijalarni formula yordamida hisobladilar. Yetakchi o‘qitish metodi qaysi?","o":["Hikoya metodi orqali mavzu tarixini og‘zaki bayon qilish","Tushuntirish metodi orqali tayyor yechimni bosqichma-bosqich berish","Amaliy metod orqali o‘lchash va hisoblash ishlarini bajarish","Tasvir metodi orqali tayyor chizma va rasmlarni ko‘rsatish"],"a":2,"e":"O‘quvchilar buyumni bevosita o‘lchab va natijani hisoblab amaliy harakat bajarmoqda. Shuning uchun yetakchi metod amaliy metoddir."},
  {"m":2482,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":2,"s":"O‘quvchi matndagi fikrlarni qismlarga ajratdi, dalillarni o‘zaro solishtirdi va xulosaning qanday asoslanganini aniqladi. Bu Blum taksonomiyasining qaysi bosqichiga mos?","o":["Bilish — o‘rganilgan ma’lumotni esga tushirish","Tushunish — mazmunni o‘z so‘zi bilan ifodalash","Sintez — qismlardan yangi yaxlit mahsulot yaratish","Tahlil — qismlar va ular orasidagi bog‘lanishni aniqlash"],"a":3,"e":"Fikrni qismlarga ajratish, dalillarni taqqoslash va bog‘lanishni aniqlash tahlil amalidir. Yangi mahsulot yaratish esa sintez bosqichiga tegishli bo‘lardi."},
  {"m":2575,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"qollash","d":3,"s":"Biologiya o‘qituvchisi yurak, o‘pka va buyrakning hajmli modellarini sinfga olib kirib, ularning joylashuvi hamda tuzilishini modelda bevosita ko‘rsatdi. Qaysi metod yetakchi?","o":["Namoyish metodi — hajmli modelni bevosita ko‘rsatish","Hikoya metodi — tuzilish tarixini og‘zaki bayon qilish","Evristik metod — ochiq muammo yechimini mustaqil izlash","Amaliy mashq — modelni o‘quvchilarga mustaqil yasatish"],"a":0,"e":"Hajmli model real obyektning o‘rnini bosuvchi ko‘rgazmali vosita sifatida bevosita ko‘rsatilmoqda. Bu holatda yetakchi usul namoyish metodidir."},
  {"m":2576,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"bilish","d":2,"s":"Kimyo o‘qituvchisi davriy sistema mavzusi oldidan Mendeleyev jadvalni yaratgan jarayon haqida qiziqarli voqeani izchil og‘zaki bayon qildi. Qaysi metod qo‘llandi?","o":["Namoyish metodi orqali tajribani bevosita ko‘rsatish","Hikoya metodi orqali voqeani izchil og‘zaki bayon qilish","Tasvir metodi orqali statik jadval va chizmalarni ko‘rsatish","Tushuntirish metodi orqali qonuniyat sababini dalillash"],"a":1,"e":"Tarixiy voqeani qiziqarli va izchil og‘zaki bayon qilish hikoya metodiga xos. Namoyish va tasvir metodlarida esa ko‘rgazmali obyekt yetakchi bo‘ladi."},
  {"m":2577,"c":"PM.GEN.08","l":"talim-texnologiyalari-va-vaziyatga-mos-tanlov","k":"qollash","d":3,"s":"Fizika darsida o‘quvchilar berilgan massa va kuch qiymatlarini F = ma formulasiga qo‘yib, tezlanishni mustaqil hisobladilar. Yetakchi o‘qitish metodi qaysi?","o":["Namoyish metodi orqali fizik hodisani bevosita ko‘rsatish","Laboratoriya metodi orqali asboblar bilan tajriba o‘tkazish","Tasvir metodi orqali statik sxema va grafiklarni ko‘rsatish","Amaliy mashq orqali formuladan foydalanib masala yechish"],"a":3,"e":"O‘quvchilar o‘rganilgan formulani aniq sonli vazifada mustaqil qo‘llab, hisoblash amaliyotini bajarmoqda. Bu amaliy mashq metodidir."},
  {"m":2585,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"qollash","d":3,"s":"O‘quvchi F = ma qoidasini biladi. U 2 kg massali jismga 10 N kuch ta’sir qilganda tezlanishni hisoblash uchun shu qoidani yangi masalada qo‘lladi. Blum taksonomiyasining qaysi bosqichi bajarildi?","o":["Bilish — formula va atamani xotiradan qayta aytish","Tushunish — formulaning mazmunini o‘z so‘zi bilan izohlash","Tahlil — yechim qismlari orasidagi bog‘lanishni tekshirish","Qo‘llash — o‘rganilgan qoidani aniq masalada ishlatish"],"a":3,"e":"Tayyor qoida yangi, aniq sonli vaziyatni yechishda ishlatilmoqda. Bu Blum taksonomiyasidagi qo‘llash bosqichining bevosita belgisidir."},
  {"m":2694,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":2,"s":"O‘quvchilar kimyoviy elementlarni metall va metallmas guruhlarga ajratib, ularning xossalaridagi farqlarni solishtirdilar. Bu Blum taksonomiyasining qaysi bosqichiga mos?","o":["Bilish — element nomlarini xotiradan sanab berish","Tushunish — berilgan ta’rifni o‘z so‘zi bilan izohlash","Tahlil — elementlarni belgilari bo‘yicha ajratib solishtirish","Sintez — elementlardan yangi nazariy model yaratish"],"a":2,"e":"Obyektlarni belgilariga ko‘ra guruhlarga ajratish va farqlarini solishtirish tarkibiy munosabatlarni ochadi. Bu tahlil bosqichiga mos keladi."},
  {"m":2697,"c":"PM.GEN.01","l":"pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi","k":"bilish","d":2,"s":"O‘quvchilar Bobur haqidagi turli adabiy ma’lumotlarni birlashtirib, «Shoh va shoir» nomli yangi sahna asarini yaratdilar. Blum taksonomiyasining an’anaviy tasnifida bu qaysi bosqich?","o":["Bilish — o‘rganilgan faktlarni xotiradan qayta aytish","Tushunish — ma’lumot mazmunini o‘z so‘zi bilan izohlash","Qo‘llash — tayyor qoidani o‘xshash vaziyatda ishlatish","Sintez — qismlarni birlashtirib yangi mahsulot yaratish"],"a":3,"e":"Turli ma’lumotlarni birlashtirib yangi sahna asari yaratish an’anaviy Blum tasnifidagi sintez bosqichidir. Qayta ko‘rilgan tasnifda bu yaratish darajasiga mos keladi."},
  {"m":2711,"c":"KS.07","l":"hamkasblar-va-ota-onalar-bilan-hamkorlik","k":"qollash","d":3,"s":"O‘qituvchi har oy ota-onalarga farzandining yutuq va qiyinchiliklarini tushuntiradi, uyda qo‘llab-quvvatlash bo‘yicha kelishilgan qadamlarni belgilaydi. Qaysi mehnat harakati bajarildi?","o":["Ota-onalarni o‘quvchining ta’lim jarayoniga maqsadli jalb qilish","Ota-onalarni faqat maktab tadbirlarini o‘tkazishga jalb qilish","Qarorlarni ota-onaga bildirmasdan pedagogning o‘zi qabul qilish","Kasbiy muammoni faqat fan o‘qituvchilari bilan muhokama qilish"],"a":0,"e":"Suhbat faqat ma’lumot berish bilan tugamaydi: ota-ona bilan o‘quvchini qo‘llab-quvvatlash qadamlari kelishiladi. Bu ota-onani ta’lim jarayoniga jalb qilishdir."},
  {"m":2719,"c":"KS.04","l":"tarbiyaviy-faoliyatni-tashkil-etish","k":"qollash","d":3,"s":"Sinf rahbari o‘quvchilar bilan mahalladagi yolg‘iz keksalarga muntazam yordam berish loyihasini rejaladi. O‘quvchilar vazifalarni taqsimlab, tashabbus ko‘rsatdi va bajarilgan ishni tahlil qildi. Qaysi tarbiyaviy natija ustuvor?","o":["Faqat tarixiy-madaniy ma’lumotlarni yodda saqlash ko‘nikmasi","Nizoni muzokara orqali hal qilish bo‘yicha muloqot ko‘nikmasi","Fuqarolik pozitsiyasi, tashabbuskorlik va mehnat ko‘nikmalarini rivojlantirish","O‘quv natijasini standart test orqali muntazam nazorat qilish"],"a":2,"e":"Jamiyat ehtiyojiga xizmat qiluvchi loyiha, vazifalarni taqsimlash va tashabbus ko‘rsatish fuqarolik pozitsiyasi hamda mehnatga mas’uliyatni rivojlantiradi."},
  {"m":2720,"c":"KS.05","l":"xavfsiz-rivojlantiruvchi-talim-muhiti","k":"qollash","d":3,"s":"Ikki o‘quvchi o‘rtasidagi janjalda sinf rahbari har ikki tomonni alohida tingladi, dalillarni tekshirdi va kamsitmasdan kelishuvga erishishga yordam berdi. Qaysi kasbiy harakat bajarildi?","o":["O‘zaro hurmat muhitini faqat umumiy qoida bilan e’lon qilish","Nizoli vaziyatni xolis tahlil qilib, tinch yo‘l bilan hal etish","O‘quvchilar faoliyatini qat’iy ko‘rsatmalar bilan to‘liq boshqarish","Har bir o‘quvchiga alohida o‘quv dasturini ishlab chiqish"],"a":1,"e":"Tomonlarni tinglash, dalilni tekshirish va kamsitmasdan kelishuvga yo‘naltirish nizoni xolis hamda xavfsiz boshqarish harakatidir."},
  {"m":2721,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"bilish","d":2,"s":"Dars davomida har bir o‘quvchiga o‘z g‘oyasi va nuqtayi nazarini asoslab ifodalash imkonini yaratish qaysi kompetensiya sohasiga kiradi?","o":["O‘quv jarayonini uzoq muddatli rejalashtirish","Ta’lim samaradorligini faol ishtirok orqali ta’minlash","Sinfdan tashqari tarbiyaviy tadbirlarni tashkil etish","O‘zlashtirishni baholash va yakuniy natijani qayd etish"],"a":1,"e":"Har bir o‘quvchining fikr bildirishiga sharoit yaratish ularning faol ishtiroki va o‘quv muloqotini kuchaytiradi. Bu ta’lim samaradorligini ta’minlash sohasiga kiradi."},
  {"m":2739,"c":"KS.07","l":"hamkasblar-va-ota-onalar-bilan-hamkorlik","k":"qollash","d":3,"s":"O‘quvchining darsdan chetlashuvi oilaviy qiyinchilik bilan bog‘liqligi aniqlandi. Sinf rahbari maktab psixologi bilan vaziyatni muhokama qilib, qo‘llab-quvvatlash choralarini kelishdi. Qaysi harakat bajarildi?","o":["Muammoni faqat shu sinfda dars beradigan pedagoglar bilan muhokama qilish","O‘quvchi qiyinchiligi bo‘yicha tegishli soha mutaxassisi bilan maslahatlashish","Barcha o‘quvchilarga bir xil qo‘shimcha topshiriq va nazorat belgilash","O‘quvchining holatini sinf jamoasi oldida batafsil muhokama qilish"],"a":1,"e":"Psixolog o‘quvchining hissiy va oilaviy vaziyati bo‘yicha tegishli mutaxassisdir. U bilan maxfiy va maqsadli hamkorlik qilish mutaxassis bilan maslahatlashish kompetensiyasidir."},
  {"m":2740,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"qollash","d":3,"s":"Tarix o‘qituvchisi mavzuning maqsadiga qarab xarita, tarixiy hujjat nusxasi, qisqa videolavha va tarqatma topshiriqni tanlab qo‘lladi. Qaysi mehnat harakati eng aniq bajarildi?","o":["Dars maqsadidan qat’i nazar barcha raqamli vositalarni qo‘llash","Mavzuga mos namoyish va tarqatma materiallardan foydalanish","Dars vaqtini faqat nazariy ma’lumot berishga yo‘naltirish","Baholash mezonini mashg‘ulot tugagandan keyin ishlab chiqish"],"a":1,"e":"Vositalar soni emas, ularning mavzu maqsadiga mos tanlangani muhim. Xarita, hujjat, video va tarqatma materialdan maqsadli foydalanish shu mehnat harakatini ko‘rsatadi."},
  {"m":2741,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"qollash","d":3,"s":"Ingliz tili o‘qituvchisi grammatik mashq uchun interaktiv platforma, tinglab tushunish uchun original video va tezkor qayta aloqa uchun onlayn shakldan foydalandi. Qaysi kompetensiya namoyon bo‘ldi?","o":["Dars vaqtini faqat raqamli topshiriqlar soni bilan boshqarish","Ta’lim samaradorligini oshirish uchun AKTdan maqsadli foydalanish","Mustaqil ishni o‘quv maqsadidan alohida holda tashkil etish","Har bir o‘quvchining qobiliyatini faqat onlayn testda aniqlash"],"a":1,"e":"Har bir raqamli vosita aniq o‘quv vazifasiga — mashq, tinglash yoki qayta aloqaga xizmat qilmoqda. Bu AKTdan ta’lim samaradorligi uchun maqsadli foydalanishdir."},
  {"m":2742,"c":"KS.05","l":"xavfsiz-rivojlantiruvchi-talim-muhiti","k":"qollash","d":3,"s":"Sinfga nogironligi bo‘lgan o‘quvchi qo‘shildi. O‘qituvchi uning kirish va topshiriq bajarish ehtiyojlarini aniqlab, materialni moslashtirdi hamda guruh ishida teng rol berdi. Qaysi harakat ustuvor?","o":["Ta’lim faoliyatini individual xususiyat va alohida ehtiyojni hisobga olib tashkil etish","O‘quvchini sinfdan ajratib, barcha topshiriqni alohida bajarishga yo‘naltirish","Sinf bilan faqat nogironlik haqidagi nazariy ma’lumotni muhokama qilish","Boshqa o‘quvchilarga yangi o‘quvchi vazifalarini to‘liq bajarishni topshirish"],"a":0,"e":"Kirish sharoiti va material moslashtirilgan, lekin umumiy maqsad hamda teng ishtirok saqlangan. Bu individual ehtiyojni hisobga olgan inklyuziv ta’lim faoliyatidir."},
  {"m":2743,"c":"KS.02","l":"talim-samaradorligini-taminlash","k":"qollash","d":3,"s":"Topshiriqdan keyin o‘qituvchi o‘quvchilarga mezonli o‘z-o‘zini baholash varaqasini berdi. Ular qaysi usul yordam bergani, qayerda qiynalgani va keyingi safar nimani o‘zgartirishini yozdi. Qaysi yondashuv qo‘llandi?","o":["Asosiy kompetensiyalarni faqat yakuniy nazorat orqali tekshirish","Jamoaviy loyiha vazifalarini o‘qituvchi tomonidan taqsimlash","Metakognitiv strategiyalar orqali o‘z o‘qishini tahlil qildirish","Differensial yordamni barcha o‘quvchiga bir xil shaklda berish"],"a":2,"e":"O‘quvchi o‘z fikrlash va o‘rganish usulini kuzatib, natijasini baholaydi hamda keyingi qadamni rejalaydi. Bu metakognitiv strategiyaning amaliy ko‘rinishidir."}
]
$bank$::jsonb) AS source(item);

DO $preflight$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM task428_bank;
  IF n <> 22 THEN
    RAISE EXCEPTION 'TASK428_BANK_COUNT_%', n;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM task428_bank b
    JOIN public.questions q
      ON q.source_reference = b.source_reference
      OR q.source_reference = 'telegram:@PedMahoratGuli:' || b.message_id::text
      OR q.source_reference LIKE 'telegram:@PedMahoratGuli:' || b.message_id::text || '|%'
  ) THEN
    RAISE EXCEPTION 'TASK428_SOURCE_ALREADY_REPRESENTED';
  END IF;

  SELECT count(*) INTO n
  FROM task428_bank b
  JOIN public.constructs c ON c.code = b.construct_code AND c.is_active
  JOIN public.lesson_constructs lc ON lc.construct_id = c.id
  JOIN public.lessons l ON l.id = lc.lesson_id
    AND l.slug = b.lesson_slug
    AND l.status = 'published'::public.content_status;
  IF n <> 22 THEN
    RAISE EXCEPTION 'TASK428_CANONICAL_MAPPING_%_OF_22', n;
  END IF;

  IF EXISTS (
    SELECT 1 FROM task428_bank b
    JOIN public.questions q ON q.status IN ('review','published')
      AND regexp_replace(lower(btrim(q.stem_md)), '[^[:alnum:]]+', '', 'g') =
          regexp_replace(lower(btrim(b.stem_md)), '[^[:alnum:]]+', '', 'g')
  ) THEN
    RAISE EXCEPTION 'TASK428_ACTIVE_EXACT_STEM_DUPLICATE';
  END IF;

  IF (SELECT count(*) FROM public.questions
      WHERE source_reference IN (
          'telegram:@PedMahoratGuli:2447',
          'telegram:@PedMahoratGuli:11756'
        )
        AND status = 'review'::public.content_status
        AND public.professional_question_fingerprint(id) IN (
          'b7226c526366733f4df709aafa21d351',
          '58eaceea538e451c6cea6515224b73a4'
        )) <> 2 THEN
    RAISE EXCEPTION 'TASK428_PINNED_REVIEW_CHANGED';
  END IF;
END
$preflight$;

DO $insert_questions$
DECLARE
  b task428_bank%rowtype;
  v_subject uuid;
  v_construct uuid;
  v_lesson uuid;
  v_question uuid;
  v_option uuid;
  v_option_ids uuid[];
  i integer;
BEGIN
  SELECT id INTO STRICT v_subject FROM public.subjects WHERE code = 'informatika';

  FOR b IN SELECT * FROM task428_bank ORDER BY message_id LOOP
    SELECT c.id, l.id INTO STRICT v_construct, v_lesson
    FROM public.constructs c
    JOIN public.lesson_constructs lc ON lc.construct_id = c.id
    JOIN public.lessons l ON l.id = lc.lesson_id
    WHERE c.code = b.construct_code AND c.is_active
      AND l.slug = b.lesson_slug
      AND l.status = 'published'::public.content_status;

    v_question := gen_random_uuid();
    INSERT INTO public.questions (
      id, subject_id, construct_id, group_code, format, cognitive, difficulty,
      stem_md, status, author_id, is_generated, source_lesson_id, source_reference
    ) VALUES (
      v_question, v_subject, v_construct,
      CASE WHEN b.construct_code LIKE 'KS.%' THEN 'KS' ELSE 'PM.GEN' END,
      'Y1'::public.question_format, b.cognitive, b.difficulty,
      b.stem_md, 'review'::public.content_status, NULL, true,
      v_lesson, b.source_reference
    );

    v_option_ids := ARRAY[]::uuid[];
    FOR i IN 0..3 LOOP
      v_option := gen_random_uuid();
      v_option_ids := array_append(v_option_ids, v_option);
      INSERT INTO public.question_options (id, question_id, side, order_idx, content_md)
      VALUES (v_option, v_question, 'a', i, b.options->>i);
    END LOOP;

    INSERT INTO public.question_keys (question_id, payload, explanation_md)
    VALUES (
      v_question,
      jsonb_build_object('correct_option_id', v_option_ids[b.correct_index + 1]),
      b.explanation_md
    );
  END LOOP;
END
$insert_questions$;

-- The only content edit to the two pinned REVIEW rows: length-balance one
-- distractor before publication. The keyed option UUID is untouched.
UPDATE public.question_options o
SET content_md = '1 — raqamli qurilmalarni sozlash; 2 — individual farazlarni amalda tekshirishga ko‘proq vaqt'
FROM public.questions q
WHERE q.id = o.question_id
  AND q.source_reference = 'telegram:@PedMahoratGuli:11756'
  AND q.status = 'review'::public.content_status
  AND o.order_idx = 3
  AND o.content_md = '1 — raqamli qurilmalarni sozlash; 2 — individual farazlarni tekshirishga vaqt';

DO $release$
DECLARE
  actor uuid;
  n integer;
  bad integer;
BEGIN
  SELECT id INTO STRICT actor
  FROM public.profiles
  WHERE role = 'admin' AND NOT coalesce(is_blocked, false);
  IF (SELECT count(*) FROM public.profiles
      WHERE role = 'admin' AND NOT coalesce(is_blocked, false)) <> 1 THEN
    RAISE EXCEPTION 'TASK428_OWNER_NOT_UNIQUE';
  END IF;

  CREATE TEMP TABLE task428_release_ids (id uuid PRIMARY KEY) ON COMMIT DROP;
  INSERT INTO task428_release_ids
  SELECT q.id FROM public.questions q
  JOIN task428_bank b ON b.source_reference = q.source_reference
  WHERE q.status = 'review'::public.content_status
  UNION ALL
  SELECT q.id FROM public.questions q
  WHERE q.source_reference IN (
    'telegram:@PedMahoratGuli:2447',
    'telegram:@PedMahoratGuli:11756'
  ) AND q.status = 'review'::public.content_status;

  SELECT count(*) INTO n FROM task428_release_ids;
  IF n <> 24 THEN RAISE EXCEPTION 'TASK428_RELEASE_SCOPE_%_OF_24', n; END IF;

  WITH checks AS (
    SELECT q.id,
      count(o.id) AS option_count,
      count(DISTINCT lower(btrim(o.content_md))) AS distinct_count,
      count(*) FILTER (WHERE o.id::text = k.payload->>'correct_option_id') AS correct_count,
      min(array_length(regexp_split_to_array(btrim(o.content_md), '[[:space:]]+'), 1)) AS minw,
      max(array_length(regexp_split_to_array(btrim(o.content_md), '[[:space:]]+'), 1)) AS maxw,
      max(array_length(regexp_split_to_array(btrim(o.content_md), '[[:space:]]+'), 1))
        FILTER (WHERE o.id::text = k.payload->>'correct_option_id') AS correctw,
      max(array_length(regexp_split_to_array(btrim(o.content_md), '[[:space:]]+'), 1))
        FILTER (WHERE o.id::text <> k.payload->>'correct_option_id') AS maxwrong
    FROM task428_release_ids r
    JOIN public.questions q ON q.id = r.id
    JOIN public.question_options o ON o.question_id = q.id AND btrim(o.side) = 'a'
    JOIN public.question_keys k ON k.question_id = q.id
    WHERE q.status = 'review'::public.content_status
      AND q.format = 'Y1'::public.question_format
      AND q.group_code IN ('KS','PM.GEN')
      AND q.source_reference IS NOT NULL
      AND q.source_lesson_id IS NOT NULL
    GROUP BY q.id
  )
  SELECT
    count(*) FILTER (WHERE option_count <> 4 OR distinct_count <> 4 OR correct_count <> 1
      OR minw < 1 OR maxw > minw * 1.8 OR correctw > maxwrong * 1.25),
    count(*)
  INTO bad, n
  FROM checks;
  IF bad <> 0 OR n <> 24 THEN
    RAISE EXCEPTION 'TASK428_BALANCE_OR_KEY_FAILURE_%', bad;
  END IF;

  SELECT count(*) INTO bad
  FROM task428_release_ids r
  JOIN public.questions q ON q.id = r.id
  JOIN public.questions other ON other.id <> q.id
    AND other.status IN ('review','published')
    AND regexp_replace(lower(btrim(other.stem_md)), '[^[:alnum:]]+', '', 'g') =
        regexp_replace(lower(btrim(q.stem_md)), '[^[:alnum:]]+', '', 'g');
  IF bad <> 0 THEN RAISE EXCEPTION 'TASK428_EXACT_DUPLICATE_%', bad; END IF;

  INSERT INTO public.pedagogy_owner_release_waivers (
    question_id, authorized_by, content_fingerprint, authority, provenance
  )
  SELECT q.id, actor, public.professional_question_fingerprint(q.id),
    'owner_explicit_no_external_expert_20261018',
    'TASK-428 batch 02; user delegated complete PedMahoratGuli pedagogy-bank review and final editorial decisions to ChatGPT on 2026-10-21/22; AI-assisted expert rewrite with source key independently checked; independent human expert signoff NOT claimed'
  FROM task428_release_ids r
  JOIN public.questions q ON q.id = r.id
  WHERE q.status = 'review'::public.content_status
    AND NOT EXISTS (
      SELECT 1 FROM public.pedagogy_owner_release_waivers w WHERE w.question_id = q.id
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 22 THEN RAISE EXCEPTION 'TASK428_NEW_WAIVER_COUNT_%', n; END IF;

  UPDATE public.pedagogy_owner_release_waivers w
  SET content_fingerprint = public.professional_question_fingerprint(w.question_id),
      authorized_by = actor,
      provenance = 'TASK-428 batch 02; previously staged REVIEW item independently rechecked under the user-delegated AI editorial authority on 2026-10-22; independent human expert signoff NOT claimed'
  WHERE w.question_id IN (
    SELECT q.id FROM public.questions q
    WHERE q.source_reference IN (
      'telegram:@PedMahoratGuli:2447',
      'telegram:@PedMahoratGuli:11756'
    )
  )
    AND EXISTS (
      SELECT 1 FROM public.questions q
      WHERE q.id = w.question_id AND q.status = 'review'::public.content_status
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 2 THEN RAISE EXCEPTION 'TASK428_EXISTING_WAIVER_REFRESH_%', n; END IF;

  UPDATE public.questions q
  SET status = 'published'::public.content_status, updated_at = now()
  FROM task428_release_ids r
  WHERE q.id = r.id AND q.status = 'review'::public.content_status;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 24 THEN RAISE EXCEPTION 'TASK428_PUBLISHED_COUNT_%', n; END IF;

  SELECT count(*) INTO n
  FROM task428_release_ids r
  JOIN public.questions q ON q.id = r.id
  JOIN public.pedagogy_owner_release_waivers w ON w.question_id = q.id
  JOIN public.pedagogy_published_revisions p ON p.question_id = q.id
  WHERE q.status = 'published'::public.content_status
    AND w.authorized_by = actor
    AND w.content_fingerprint = public.professional_question_fingerprint(q.id);
  IF n <> 24 THEN RAISE EXCEPTION 'TASK428_POSTFLIGHT_%_OF_24', n; END IF;
END
$release$;

COMMIT;
