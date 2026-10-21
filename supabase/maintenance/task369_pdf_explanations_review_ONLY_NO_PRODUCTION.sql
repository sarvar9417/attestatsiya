-- TASK-369 / EDITORIAL PREPARATION ONLY / DO NOT RUN AGAINST PRODUCTION.
-- This file lives in supabase/maintenance (NOT migrations) and is NEVER auto-applied.
-- User explicitly prohibited production writes until a later direct authorization.
-- By default this script terminates with ROLLBACK. Nothing persists when run as-is.
-- Historic published rows, exam attempts, scoring keys and audit source are immutable.
-- The 18 candidates were inspected using read-only queries on 2026-10-21.
--
-- Expert review before future authorization MUST validate the answer keys and
-- subject taxonomy. Revision rows are only REVIEW, not owner approval.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='120s';

CREATE TEMP TABLE task369_explanations (
 source_reference text PRIMARY KEY,
 educational_explanation text NOT NULL CHECK(length(educational_explanation)>=130)
) ON COMMIT DROP;

INSERT INTO task369_explanations(source_reference,educational_explanation) VALUES
  ('authored:pedagogy-pdf-corpus:2025-kuzgi3-n5', 'Pedagog o‘z qarorlarini pedagogika, psixologiya va sotsiologiyaning ilmiy qarashlariga tayangan holda asoslayapti. Fanlararo nazariy bilimlarni bir butun tasavvurga birlashtirish ilmiy pedagogik dunyoqarash madaniyatining belgisidir. Bu oddiy muloqot mahorati yoki bitta dars usulini tanlash bilan cheklanmaydi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n101', 'Shaxsiy kelishmovchilik sabab guruh ishi to‘xtaganda o‘qituvchi avval har ikki tomonning fikrini eshitib, nizoning sababini aniqlashi kerak. Xolis suhbat muammoni jazodan oldin tushunish, o‘quvchi sha’nini saqlash va kelishuvga erishish imkonini beradi. Majburlash yoki tarafkashlik vaziyatni murakkablashtirishi mumkin.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n119', 'Nutqning aniqligi fikrni ikki ma’nolilikka yo‘l qo‘ymay, tushunarli ifodalashni; ta’sirchanligi esa tinglovchi diqqatini jalb qilib, mazmunning qabul qilinishiga ta’sir etishni anglatadi. Vaziyatda pedagogning ravon va ravshan bayoni shu ikki xususiyatni namoyon qiladi. Tarixiy shaxsga nisbat berilgan iqtibosning muallifligi mazkur didaktik ta’rif uchun shart emas.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n15', 'O‘quvchining o‘zlashtirishdagi qiyinchiligini aniqlashda soha mutaxassisi bilan maslahatlashish pedagogga vaziyatni to‘g‘ri baholash va foydali qayta aloqa rejalashda yordam beradi. Bu yerda hamkorlik — qo‘llanilgan usul, asosiy maqsad esa o‘quvchining qiyinchiligini baholash hamda tegishli tavsiya berishdir.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n5', 'Kooperativ refleksiya pedagoglarning o‘z tajribasi va qo‘llagan metodlarini hamkasblar bilan birgalikda tahlil qilib, xulosalar chiqarishidir. Savolda ustozlar bir-birining faoliyatini muhokama qilib, ishni yaxshilagan; demak bu individual fikrlashdan farqli ravishda o‘zaro hamkorlikdagi refleksiyadir.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n54', 'Virtual 3D model orqali vulqon otilishini ko‘rsatish o‘quvchiga jarayonning bosqichlarini bevosita kuzatish imkonini beradi. Shu sababli bu ko‘rgazmali namoyish metodidir. O‘quvchi jarayonni mustaqil tajriba qilib o‘zgartirmagan va asosiy faoliyat munozara emas, ko‘rish hamda tahlil qilishdir.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n58', 'Umumpedagogik daraja pedagogik texnologiyaning butun ta’lim tizimi yoki keng turdagi o‘quv jarayoniga tatbiq etiladigan umumiy yondashuvidir. Savolda texnologiya bitta fan yoki mashq uchun emas, keng ta’lim tizimi miqyosida ishlab chiqilgan. Shuning uchun lokal yoki xususiy-metodik daraja emas, umumiy daraja mos keladi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n60', 'Lokal pedagogik texnologiya darsning alohida qismi yoki muayyan didaktik vazifasini bajarishga xizmat qiladi. Savolda faqat bitta fikrlash ko‘nikmasini rivojlantirish uchun darsning cheklangan bo‘lagida usul ishlatilgan. Butun fan metodikasi yoki ta’lim tizimini tashkil qilish tasvirlanmagan.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n64', 'Diapazon tovush balandligining pastdan yuqorigacha bo‘lgan chegarasini anglatadi. Artikulyatsiya esa til, lab, jag‘ va boshqa nutq a’zolarining tovushlarni aniq hosil qilishdagi harakatidir. Biri ovozning balandlik imkoniyatiga, ikkinchisi talaffuzning shakllanishiga taalluqli.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n65', 'Tembr tovushning o‘ziga xos ranggi va jarangidir: shu sabab bir xil balandlikdagi ikki ovoz bir-biridan farqlanadi. Ritmika esa nutqdagi sur’at, urg‘u, bo‘g‘inlar davomiyligi va pauzalarning tartibidir. Tembr tovush sifatini, ritmika nutq oqimining vaqt bo‘yicha tuzilishini tavsiflaydi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n66', 'O‘qituvchi hamkasbining tajribasidan yangi metodni o‘rgandi, raqamli xarita vositasini egalladi va uni o‘z darsida amalda qo‘lladi. Bu uning kasbiy bilimlarini yangilashi hamda yangi usullarni ish faoliyatiga joriy etishini bildiradi. Vaziyatda intizomiy jazo, baholarni qayta hisoblash yoki jadvalni rasmiylashtirish emas, o‘z-o‘zini rivojlantirish va kasbiy o‘sish asosiy vazifadir.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n7', 'Xususiy-metodik, ya’ni mezo darajadagi pedagogik texnologiya ma’lum fan yoki metodika doirasida o‘qitish jarayonini loyihalaydi. O‘qituvchining o‘z fani uchun darsma-dars texnologik xarita tuzishi aynan shu darajani ko‘rsatadi. Bu butun ta’lim tizimiga oid umumpedagogik texnologiyadan va bitta mashq uchun lokal usuldan farq qiladi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n73', 'Darslik, maket, jadval va laboratoriya jihozlari ko‘rish, ushlash yoki amaliy tajribada ishlatish mumkin bo‘lgan moddiy obyektlardir. Shuning uchun ular material ta’lim vositalariga kiradi. Ideal vositalar esa so‘z, belgi, mantiqiy sxema va tasavvur kabi axborotni ifodalovchi aqliy shakllarni ham qamrab oladi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n74', 'O‘rgatish vositasi o‘qituvchiga tushunchani tushuntirish va ko‘rsatishga xizmat qiladi: namoyish quroli bunga misoldir. O‘rganish vositasi esa o‘quvchining mustaqil bajarishi, sinab ko‘rishi va mashq qilishi uchun ishlatiladi: praktikum jihozi bunga misol. Farq asosan vositadan kim va qanday maqsadda foydalanishidadir.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n76', 'Huquqiy tarbiya o‘quvchilarda qonun, huquq, burch va fuqarolik mas’uliyati haqidagi bilim hamda qonuniy xulq ko‘nikmalarini shakllantiradi. Konstitutsiya, fuqarolik va oila huquqi mazmunini o‘rgatish shu maqsadga xizmat qiladi; bu estetik yoki ekologik tarbiyadan vazifasi bilan farqlanadi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n87', 'Rasmiy elektron xat yozishni o‘rgatish bosqichma-bosqich tashkil etiladi. Avval namunadagi mavzu, murojaat, asosiy matn va imzo tahlil qilinadi; keyin o‘qituvchi ko‘magida tuzilma bo‘yicha mashq bajariladi; oxirida o‘quvchi mustaqil xat tuzadi. Shu ketma-ketlik ko‘makni asta-sekin kamaytirib, amaliy mustaqillikka olib keladi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n93', 'Samarali qayta aloqa o‘quvchi ishining muvaffaqiyatli tomonini aniq ko‘rsatish va tuzatish talab qiladigan jihat uchun amaliy tavsiya berishni birlashtiradi. Matnning faqat kamchiligini aytish motivatsiyani pasaytirishi, faqat maqtash esa nima yaxshilanishini yashirishi mumkin. Shu sababli kuchli jihat va takomillashuv yo‘li birga aytiladi.'),
  ('authored:pedagogy-pdf-corpus:2025-spring6-n96', 'O‘quvchi fanning o‘ziga kerakligini anglamaganda mavzuni uning qiziqishi va kelajakdagi kasbiy maqsadlariga bog‘lash ichki motivatsiyasini kuchaytirishi mumkin. Pedagog mavzuning haqiqiy hayotdagi qo‘llanishini ko‘rsatib, o‘rganishning shaxsiy ma’nosini ochadi. Tanbeh berish yoki majburlash bu ehtiyojni bartaraf etmaydi.');

DO $task369$
DECLARE
  rec record;
  v_actor uuid;
  v_question uuid;
  v_successor uuid;
  v_count int;
BEGIN
  SELECT count(*) INTO v_count FROM task369_explanations;
  IF v_count <> 18 THEN RAISE EXCEPTION 'TASK369_EXPECTED_18_RECORDS'; END IF;

  SELECT count(*) INTO v_count FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF v_count <> 1 THEN RAISE EXCEPTION 'TASK369_ADMIN_ACTOR_NOT_UNIQUE'; END IF;
  SELECT id INTO STRICT v_actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);

  SELECT count(*) INTO v_count
  FROM task369_explanations t
  JOIN public.questions q ON q.source_reference=t.source_reference
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='published'::public.content_status
    AND q.format='Y1'::public.question_format
    AND q.group_code IN ('KS','PM.GEN','PM.MET')
    AND k.explanation_md ~* '(baza kandidati|PDF muallif kaliti saqlandi|Asl Javob belgisi saqlandi|manba javobi shu)'
    AND NOT EXISTS(SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id);
  IF v_count <> 18 THEN RAISE EXCEPTION 'TASK369_PRODUCTION_SOURCE_DRIFT_OR_ALREADY_REVISED_%', v_count; END IF;

  FOR rec IN
    SELECT q.id, t.educational_explanation
    FROM task369_explanations t
    JOIN public.questions q ON q.source_reference=t.source_reference
    ORDER BY t.source_reference
  LOOP
    INSERT INTO public.pedagogy_revision_queue(source_question_id,reason)
    VALUES(rec.id,'TASK-369: separate teaching explanation from PDF source/candidate editorial notes');
    v_successor := public.stage_pedagogy_revision(rec.id,v_actor);
    UPDATE public.question_keys SET explanation_md=rec.educational_explanation,updated_at=now()
      WHERE question_id=v_successor;
    GET DIAGNOSTICS v_count=ROW_COUNT;
    IF v_count <> 1 THEN RAISE EXCEPTION 'TASK369_REVIEW_KEY_MISSING'; END IF;
    IF NOT EXISTS(SELECT 1 FROM public.questions WHERE id=v_successor AND status='review')
    THEN RAISE EXCEPTION 'TASK369_SUCCESSOR_NOT_REVIEW'; END IF;
  END LOOP;
END
$task369$;

-- Require separate manual authorization to stage these review revisions;
-- never change this to COMMIT as part of a GitHub merge or automated release.
ROLLBACK;
