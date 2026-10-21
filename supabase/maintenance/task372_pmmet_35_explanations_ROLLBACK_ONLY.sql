-- TASK-372: PM.MET short explanations, offline editorial draft only.
-- DO NOT EXECUTE ON PRODUCTION. NOT A MIGRATION. NO PUBLISH AUTHORIZED.
-- Every published version is immutable. 35 independent REVIEW successor candidates.
-- This script cannot persist its changes because it finishes with ROLLBACK.
BEGIN;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '120s';

CREATE TEMP TABLE task372_rationales (
  source_reference text PRIMARY KEY,
  educational_explanation text NOT NULL CHECK (char_length(trim(educational_explanation)) >= 180)
) ON COMMIT DROP;

INSERT INTO task372_rationales(source_reference,educational_explanation) VALUES
  ('authored:pedguli-topic-study:v2:PM.MET.01:127', 'Blok-sxema bilan dastur natijasi farq qilsa, avval bir xil kirish ma’lumotida algoritmning har bir qadamini izma-iz kuzatish kerak. Shart, sikl va o‘zgaruvchi qiymatlarini solishtirish tafovut aynan qayerda paydo bo‘lganini dalil bilan ko‘rsatadi. Taxminan kodni almashtirishdan ko‘ra iz jadvali samaraliroq.'),
  ('revision:pedagogy:27922a21-5cf6-4260-8429-db04350113cd', 'Dars maqsadi amaliy ko‘nikmani shakllantirish bo‘lsa, baholash o‘quvchining shu ishni mustaqil bajara olishini tekshirishi kerak. Faqat terminni eslash nazariy xotirani o‘lchaydi, amaliy natijani emas. Shu sabab maqsad va baholash o‘rtasidagi metodik moslik buzilgan.'),
  ('revision:pedagogy:2956fa8c-9c66-4238-8a7e-bf200f8fe747', 'Metodik tahlil shaxsiy yoqtirish yoki yoqtirmaslikka emas, dars maqsadi, o‘quvchilar faoliyati va erishilgan natija dalillariga tayanadi. Kuzatuvchi metodning qaysi mezonga mos kelmaganini aytmagani uchun uning xulosasi tekshirib bo‘lmaydigan subyektiv fikr bo‘lib qolgan.'),
  ('revision:pedagogy:2a5832a4-4b7e-4ff1-a299-abed5dddad47', 'Dasturda xato yuzaga kelganda o‘quvchi xabar matnini va xato sodir bo‘lgan qatorni o‘qishi, mumkin bo‘lgan sababni taxmin qilishi, so‘ng kichik kirish misolida uni qayta tekshirishi maqsadga muvofiq. Bu tartib tayyor javobni ko‘chirishdan farqli ravishda mustaqil debugging ko‘nikmasini rivojlantiradi.'),
  ('revision:pedagogy:31fecd9e-9a6f-4b83-a191-25a7d73a7cd6', 'Metodik tizimda «Nima o‘qitiladi?» savoli tanlangan mavzu, bilim, tushuncha va amaliy ko‘nikmalar tarkibini bildiradi. Axborot turlari yoki algoritm xossalarini tanlash ta’lim mazmunini belgilashdir. «Qanday o‘qitiladi?» esa metod, vosita va faoliyatni tashkil etishga tegishli.'),
  ('revision:pedagogy:39463300-9582-4efe-89f1-aae146e487ca', 'Interfaol metodning markazida o‘quvchining boshqalar bilan mazmunli fikr almashishi, savol berishi va birgalikda muammo yechishi turadi. Sinfni guruhlarga bo‘lish yoki ekranga interaktiv tasvir chiqarishning o‘zi yetarli emas: bilimni shakllantirishda o‘zaro ta’sir haqiqatan ro‘y berishi kerak.'),
  ('revision:pedagogy:3e81acfd-4933-46b6-b984-d7b5ccd8b409', 'Metodik tahlil darsdagi maqsad, mazmun, tanlangan metod, o‘quvchilarning amaliy faoliyati va baholangan natija bir-biriga qanchalik mosligini aniqlaydi. Masalan, dastur tuzish maqsadida faqat ma’ruza qilinsa, usul va kutilgan ko‘nikma o‘rtasida tafovut mavjudligi ko‘rsatiladi.'),
  ('revision:pedagogy:3f7b4bae-ace8-4e08-9d24-eaee1784b0cb', 'Amaliy ko‘nikma uchun faqat maqsadni yozish va mazmunni tanlash yetarli emas: o‘quvchilarga kompyuter, mashq bajarish vaqti va tegishli yordam ham kerak. Shu shartlar rejalashtirilmasa, o‘quv natijasiga erishish imkoni cheklanadi. Metodik tizim barcha tarkibiy qismlarining mosligini talab qiladi.'),
  ('revision:pedagogy:4c401d6d-8ae2-477e-b9dd-a3dd328bf3f8', 'O‘qitish metodi maqsadga erishish uchun o‘qituvchi va o‘quvchi faoliyatini tashkil etishning umumiy yo‘lidir. Usul esa shu metod doirasidagi konkret amal, masalan namoyish paytida alohida qadamni taqqoslash bo‘lishi mumkin. Usulni butun metod bilan aynan bir tushuncha deb qabul qilish noto‘g‘ri.'),
  ('revision:pedagogy:635c8ce0-13d9-4464-bc84-1fee6c563967', 'Reproduktiv faoliyatda o‘quvchi ilgari ko‘rsatilgan namunani yoki ma’lum algoritmni o‘xshash masalada qayta qo‘llaydi. Savolda ustoz yechim yo‘lini ko‘rsatib, o‘quvchilar shunday qadamlarni boshqa ma’lumot bilan takrorlagan. Bu yangi usulni mustaqil ixtiro etish emas, tayanch ko‘nikmani mashq qilishdir.'),
  ('revision:pedagogy:6eb58030-8962-4608-8067-6f941466a1e0', 'Maqsad hamkorlikda muammo yechish bo‘lsa, natijani baholashda guruhdagi muhokama, rollar taqsimoti va dalillangan yechim jarayoni ko‘rinishi kerak. Individual termin testi faqat eslab qolishni tekshiradi. Shu sabab tanlangan baholash maqsadning ikki muhim qismi — hamkorlik va muammo yechishni qamramagan.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000032', 'Algoritm mavzusida nazariya va amaliyotning bog‘lanishi bitta masalaning avval model yoki blok-sxema ko‘rinishida ifodalanishi, so‘ng kodga aylantirilishi va test bilan tekshirilishida namoyon bo‘ladi. Bunda o‘quvchi har bir nazariy qadamning dastur bajarilishiga ta’sirini kuzatadi; faqat ta’rifni yodlash yetarli emas.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000033', 'Metod o‘qitish jarayonini tashkil etishning umumiy yo‘lini bildiradi, masalan ko‘rgazmali namoyish yoki amaliy mashq. Usul esa tanlangan metod ichida bajariladigan muayyan pedagogik harakatdir. Shu bois namoyishning bir qadamini savol bilan tekshirish usul bo‘lishi mumkin, lekin butun dars metodini almashtirmaydi.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000034', 'Ma’lumotlar bazasi bo‘yicha loyiha metodida o‘quvchi amaliy talabni tahlil qilib, jadval va bog‘lanishlarni loyihalaydi, kichik ishlaydigan bazani yaratadi hamda tanlagan tuzilmasini asoslaydi. Faqat tayyor ta’riflarni aytib berish loyihaning mustaqil izlanish va natijaviy mahsulot yaratish vazifasini bajarmaydi.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000035', 'Siklning bir marta kam yoki ko‘p bajarilishini tushunish uchun indeksning boshlang‘ich qiymati, chegarasi va har qadamdagi o‘zgarishini iz jadvalida ko‘rsatish foydalidir. Masalan, Python `range(1, 5)` qiymatlari 1, 2, 3, 4 bo‘lib, 5 ni olmaydi. Kichik chegaraviy sinov buni kuzatiladigan dalilga aylantiradi.'),
  ('revision:pedagogy:79000000-0000-4000-8000-000000000128', 'Algoritmni turli shaklda ifodalashni o‘rgatish faqat alohida blok-sxema yoki kodni chizish emas. O‘quvchi bitta masalaning matnli qadamlari, shart va takrorlanish bloklari hamda dastur buyruqlari bir-biriga mosligini asoslay olishi kerak. Bu tasvirlardan biridan boshqasiga o‘tish va natijani tekshirish maqsadiga xizmat qiladi.'),
  ('revision:pedagogy:79000000-0000-4000-8000-000000000129', 'Ajurli arra (jigsaw) metodida o‘quvchi avval o‘ziga tegishli topologiyani ekspert guruhida puxta o‘rganadi, keyin dastlabki guruhiga qaytib boshqalarga tushuntiradi. Shunday almashinuv natijasida barcha qatnashchilar umumiy mavzuni yig‘adi. Faqat guruhda yonma-yon o‘tirish bu metodning yetarli belgisi emas.'),
  ('revision:pedagogy:8573a169-c9a1-4913-852e-e872aed798dd', 'Tayyor kodni namoyish qilish boshlang‘ich tayanch beradi, ammo o‘quvchi xatoni izlab topib, sababini tushuntirsa va o‘z variantini tuzsa, bilimni faol qo‘llaydi. Bu ketma-ketlik takrorlashdan tahlil va mustaqil yechimga bosqichma-bosqich o‘tadi. Shu sabab faqat tayyor kodni ko‘chirishga qaraganda samaraliroq.'),
  ('revision:pedagogy:89609646-52ce-416c-9d6c-32a840cf56bd', 'Natija sust bo‘lganda «mavzu qiyin» deyish sababni aniqlamaydi. Metodik tahlilda maqsadning aniqligi, topshiriq qiyinligi, usul, amaliy vaqt, mavjud vosita va baholash mezoni o‘zaro tekshiriladi. Qaysi bo‘g‘inda moslik buzilgani aniqlangandagina keyingi dars uchun asosli tuzatish rejalash mumkin.'),
  ('revision:pedagogy:90f7ea10-4480-4337-b74f-5bb882af5037', 'Yangi raqamli vosita darsni o‘zi uchun o‘zgartirishga sabab bo‘lmasligi kerak. Avval o‘quvchi nimani o‘rganishi, qanday faoliyat bajarishi va natija qanday tekshirilishi belgilanadi. Shundan so‘ng vosita shu vazifalarni yaxshilashi baholanadi. Texnologiya maqsadga xizmat qilishi lozim, aksincha emas.'),
  ('revision:pedagogy:943bd179-b999-4be0-9a5b-5fe37093377a', 'Siklni og‘zaki ta’riflash uni yangi masalada to‘g‘ri tuzish qobiliyatini avtomatik isbotlamaydi. Amaliy mashqda o‘quvchi takrorlanish shartini belgilaydi, kod yozadi, chegaraviy holatlarni sinaydi va xatolarni tuzatadi. Shu orqali ko‘nikma aynan harakat hamda qayta aloqa jarayonida rivojlanadi.'),
  ('revision:pedagogy:964a6340-fd81-4c6a-95b5-1ee61ec0a764', 'Yangi dastur interfeysini kuzatish o‘quvchiga dastlabki tasavvur beradi, lekin tugmalarni o‘zi bosish, vazifani bajarish va xatoni tuzatish ko‘nikmasini almashtirmaydi. Shu sabab uzun namoyishdan so‘ng boshqariladigan va mustaqil mashqqa vaqt ajratish zarur. Amaliy ko‘nikma faol harakat orqali shakllanadi.'),
  ('revision:pedagogy:9ef74414-8806-4401-8c75-466e247ce6e2', 'Darsdagi faoliyat maqsadga mos rejalangani natijaga erishilganini hali isbotlamaydi. O‘quvchi topshiriqni qanchalik mustaqil bajargani, qanday xatoga yo‘l qo‘ygani va mezonga qanchalik javob bergani haqidagi dalil kerak. Baholash o‘tkazilmasa, dars samaradorligi haqida qat’iy xulosa chiqarib bo‘lmaydi.'),
  ('revision:pedagogy:a3f3f897-5736-4608-9239-8b27df6e7110', '«Qanday o‘qitiladi?» degan savol metodik tizimning amalga oshirish tomoniga tegishli: qaysi metod, tashkiliy shakl, texnik vosita va o‘quvchi faoliyati tanlanishi aniqlanadi. «Nima o‘qitiladi?» esa mavzu va mazmunni belgilaydi. Farqni tushunish dars rejasi elementlarini bir-biriga mos tuzishga yordam beradi.'),
  ('revision:pedagogy:a5710804-70f7-4814-82a1-7f6a6d46693f', 'Bir darsda turli metodlardan foydalanish metodik jihatdan xato emas: qisqa tushuntirish tayanch bilimni beradi, namoyish jarayonni ko‘rsatadi, mashq esa o‘quvchiga uni bajarish imkonini yaratadi. Muhimi metodlarning soni emas, ularning dars maqsadi, vaqt va o‘quvchi ehtiyojiga mos uyg‘unlashganidir.'),
  ('revision:pedagogy:a824eddf-4cb7-425f-af04-f707a2d1148f', 'O‘qitish metodi pedagog va o‘quvchi faoliyatini belgilangan natijaga yo‘naltirib tashkil etishning usulidir. Masalan, amaliy mashq metodida o‘qituvchi yo‘naltiradi, o‘quvchi vazifani bajarib ko‘nikma hosil qiladi. Metod faqat o‘qituvchi gapirish uslubi ham, alohida kompyuter qurilmasi ham emas.'),
  ('revision:pedagogy:b59202a1-03c5-43fb-a50f-5c6b56e17dd3', '«Metod yoqdi» yoki «yoqmadi» kabi taassurot o‘quvchilar maqsadga erishganini ko‘rsatmaydi. Asosli dars tahlili kuzatuv, o‘quvchi ishlari va oldindan belgilangan mezonlarni solishtiradi. Masalan, kod yozish maqsadida nechta o‘quvchi mustaqil dastur tuza olgani ishonchliroq dalildir.'),
  ('revision:pedagogy:c32c8bba-de1d-4a83-971d-6484d04cb4f7', 'Muammoli ta’limda o‘quvchilar muammoni tushunib, taxminlarni taklif etishi, dalillarni taqqoslashi va yechimga kelishi kerak. O‘qituvchi savol qo‘yishi bilanoq tayyor javobni aytsa, aynan shu izlanish va mustaqil fikrlash imkoniyati yo‘qoladi. Muammoli vaziyat bezak emas, faol fikrlashni boshlovchi vositadir.'),
  ('revision:pedagogy:c7e312b0-ccfa-4968-a53d-0df6851cc8eb', 'Interaktiv doska — texnik ta’lim vositasi; uni ishlatishning o‘zi darsni interfaol qilmaydi. O‘quvchilar faqat ekranga qarab tinglasa, ular faol o‘zaro ta’sirga kirishmaydi. Savol-javob, hamkorlik, qarorlarni asoslash va birgalikdagi tahlil bo‘lgandagina interfaol metodning asosiy belgilari namoyon bo‘ladi.'),
  ('revision:pedagogy:cc2925cd-7abe-4088-872f-ef66704c5e3e', 'Informatika o‘qitish metodikasi fan mazmunini bilish bilan cheklanmay, uni kimga, nima maqsadda va qanday faoliyat orqali o‘rgatish ma’qul ekanini ilmiy asoslaydi. Bu o‘quv maqsadi, mavzu tarkibi, metod, vosita va baholashni o‘zaro moslashtirishni talab qiladi. Shu bois asosiy savollar «nima», «nima uchun» va «qanday»dir.'),
  ('revision:pedagogy:d5bb5655-114f-4f89-a3f1-ba33719883a8', 'Dars tahlilida natijaning qanday dalil bilan tekshirilgani so‘ralishi baholashning maqsadga mosligini aniqlaydi. Masalan, algoritm tuzish maqsadida faqat atamalarni eslash testi berilsa, amaliy ko‘nikma haqida dalil yetarli bo‘lmaydi. Kuzatiladigan ish yoki mezon bilan tekshirish aniqroq xulosa beradi.'),
  ('revision:pedagogy:d6420642-77a2-4612-9102-562144425613', 'Interaktiv doska darsdagi tasvir va blok-sxemani namoyish etish uchun ishlatilayotgan texnik vositadir. O‘quvchilarning algoritmni guruhda muhokama qilishi esa metod va faoliyatni tashkil etish shakliga tegishli. Vositaning «interaktiv» deb nomlanishi uni alohida pedagogik metodga aylantirmaydi.'),
  ('revision:pedagogy:dda13b50-a79c-43c7-80d9-a44df5550364', 'Dasturlash ko‘nikmasi uchun o‘quvchilar kodni faqat tomosha qilmay, o‘zlari bajarib xatoni tuzatishi kerak. 35 daqiqa namoyish va atigi 5 daqiqa mustaqil mashq berish faoliyatga vaqt qoldirmagan. Qisqa namuna, ustoz ko‘magidagi mashq va keyingi mustaqil topshiriqni muvozanatlash maqsadga muvofiq.'),
  ('revision:pedagogy:f071854a-0451-4506-9025-d2447c7f59b8', 'Metodik tizimning maqsad, mazmun, metod, faoliyat, vosita va baholash qismlari o‘zaro bog‘liq. Amaliy ko‘nikma talab qilinayotgan darsda faqat ta’rifni so‘rash baholashni maqsaddan ajratadi. O‘qituvchining metod va baholashni birgalikda o‘zgartirishi bu qismlarning o‘zaro ta’sirini namoyon qiladi.'),
  ('revision:pedagogy:fc725c05-2bfc-4664-83b6-63edca43cb4c', 'O‘quvchilarning bir stol atrofida o‘tirishi interfaol metod qo‘llanganini isbotlamaydi. Agar har kim alohida vazifa bajarsa, mazmunli fikr almashish yuz bermaydi. Haqiqiy interfaol guruh ishida umumiy muammo, o‘zaro tushuntirish, savol-javob va birgalikda asoslangan qarorga kelish bo‘lishi kerak.');

DO $task372$
DECLARE
  item record;
  v_admin uuid;
  v_new uuid;
  n integer;
BEGIN
  SELECT count(*) INTO n FROM task372_rationales;
  IF n <> 35 THEN RAISE EXCEPTION 'TASK372_EXPECTED_35'; END IF;

  SELECT count(*) INTO n FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);
  IF n <> 1 THEN RAISE EXCEPTION 'TASK372_UNIQUE_ACTIVE_ADMIN_REQUIRED'; END IF;
  SELECT id INTO STRICT v_admin FROM public.profiles
  WHERE role='admin' AND NOT coalesce(is_blocked,false);

  SELECT count(*) INTO n
  FROM task372_rationales t
  JOIN public.questions q ON q.source_reference=t.source_reference
  JOIN public.question_keys k ON k.question_id=q.id
  WHERE q.status='published'
    AND q.group_code='PM.MET'
    AND q.format='Y1'
    AND char_length(trim(k.explanation_md)) < 80
    AND NOT EXISTS (
      SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id
    );
  IF n <> 35 THEN RAISE EXCEPTION 'TASK372_SOURCE_CHANGED_OR_ALREADY_REVISED_%',n; END IF;

  FOR item IN
    SELECT q.id, t.educational_explanation
    FROM task372_rationales t JOIN public.questions q
      ON q.source_reference=t.source_reference
    ORDER BY t.source_reference
  LOOP
    INSERT INTO public.pedagogy_revision_queue(source_question_id,reason)
    VALUES(item.id,'TASK-372: quality review of short PM.MET educational explanation');
    v_new := public.stage_pedagogy_revision(item.id,v_admin);
    UPDATE public.question_keys SET explanation_md=item.educational_explanation,updated_at=now()
      WHERE question_id=v_new;
    GET DIAGNOSTICS n=ROW_COUNT;
    IF n <> 1 OR NOT EXISTS (
      SELECT 1 FROM public.questions WHERE id=v_new AND status='review'
    ) THEN RAISE EXCEPTION 'TASK372_REVIEW_DRAFT_NOT_CREATED'; END IF;
  END LOOP;
END $task372$;

-- NO PRODUCTION PUBLISH, NO COMMIT, NO PERSISTENT STAGING FROM THIS FILE.
ROLLBACK;
