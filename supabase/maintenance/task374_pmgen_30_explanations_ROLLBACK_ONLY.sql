-- TASK-374 | M15dan tashqari 30 PM.GEN qisqa tushuntirishini chuqurlashtirish
-- EDITORIAL REVIEW PREPARATION ONLY. NOT A PRODUCTION MIGRATION.
-- Published versions and answer keys are immutable. No owner release authorized.
BEGIN;
SET LOCAL lock_timeout='10s';
SET LOCAL statement_timeout='120s';

CREATE TEMP TABLE task374_pmgen_rationales (
 source_reference text PRIMARY KEY,
 educational_explanation text NOT NULL CHECK (char_length(trim(educational_explanation))>=200)
) ON COMMIT DROP;

INSERT INTO task374_pmgen_rationales(source_reference,educational_explanation) VALUES
  ('revision:pedagogy:4cd11649-cf96-c726-a26a-f80b320baa6e', 'Pedagogik etika o‘quvchi fikri o‘qituvchinikidan farq qilgan taqdirda ham uni tinglash, javobda hurmat va muloyimlikni saqlashni talab qiladi. Bu bolaning sha’nini himoya qilib, ochiq suhbatga imkon yaratadi. O‘qituvchi mazmunan tanqid bildirishi mumkin, biroq bolaning shaxsini kamsitishi kasb etikasiga zid.'),
  ('revision:pedagogy:bfa28e5b-0e30-7f45-8d7b-f25627b2caf5', 'Nutq qobiliyati o‘qituvchining fikrini ravon, aniq, mantiqiy va tinglovchiga ta’sirli qilib ifodalash mahoratidir. Savolda ustoz aynan bayonning sifati bilan ajralib turgani uchun shu qobiliyat mos. Fan materialini chuqur bilish akademik qobiliyat bo‘lsa, uni tushunarli so‘z bilan yetkazish nutq va didaktik mahoratni namoyon qiladi.'),
  ('revision:pedagogy:8d12ce72-756f-421e-7362-9b68f464be37', 'Axloqiy tarbiya halollik, rostgo‘ylik, hurmat va mas’uliyat kabi xulqiy qadriyatlarni ongli tanlashga yordam beradi. Munozarada o‘quvchilar bu fazilatlarning ma’nosini va hayotdagi oqibatini tahlil qilgan. Mazkur vaziyatda asosiy maqsad estetik did yoki kasbiy ko‘nikma emas, axloqiy me’yorni shakllantirishdir.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000017', 'Ilmiylik tamoyili qarama-qarshi axborotni tekshirmasdan fakt sifatida o‘rgatmaslikni talab qiladi. O‘qituvchi ishonchli tadqiqot natijalari va aniq atamalarni solishtirib, tasdiqlangan xulosani bayon etadi. Shaxsiy taxmin yoki ijtimoiy tarmoqdagi da’vo ilmiy dalilning o‘rnini bosmaydi; manbaning ishonchliligi muhim.'),
  ('revision:pedagogy:e7695e5b-4237-a79b-75a7-afb49fca77d2', 'Dars turini uning yetakchi didaktik maqsadi belgilaydi. Agar o‘quvchilar mavzu bilan ilk bor tanishib, asosiy tushunchani shakllantirayotgan bo‘lsa, bu yangi bilimni o‘zlashtirish darsidir. Oldingi materialni qayta ishlash mustahkamlash darsiga, erishilgan natijani aniqlash esa nazorat darsiga xos bo‘ladi.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000021', 'Yangi bilim darsida o‘qituvchi noma’lum tushunchani oldingi bilim bilan bog‘lab, sodda misollar orqali ochib beradi va dastlabki o‘zlashtirishni qisqa mashq bilan tekshiradi. Bunday ketma-ketlik tushunchaning mazmunini shakllantirishga xizmat qiladi. Faqat nazorat savollarini berish yoki eski mavzuni takrorlash asosiy maqsadga mos kelmaydi.'),
  ('revision:pedagogy:0136f81f-90a6-1ec4-1af3-486989c7e0da', 'Tashkilotchilik qobiliyati dars bosqichlarini rejalash, vaqtni oqilona taqsimlash, sinf faolligini boshqarish va vazifalarni muvofiqlashtirishda namoyon bo‘ladi. O‘qituvchi vaqtni boshqara olmaganda aynan shu ko‘nikma ustida ishlashi lozim. Nutq yoki fan bilimining yuqori bo‘lishi vaqtni tashkil qilishdagi muammoni avtomatik bartaraf etmaydi.'),
  ('revision:pedagogy:7e8bc4c2-f3f8-4787-b1bd-e7c9763561d1', 'Guruh ishida shovqin va chalkashlik ko‘pincha kim nima qilishi hamda natija qanday bo‘lishi noaniqligidan kuchayadi. Vazifa, rollar, vaqt va baholash mezonini oldindan aniqlashtirish barcha a’zolarga yo‘nalish beradi. Faqat baland ovozda ogohlantirish yoki guruh ishini bekor qilish hamkorlik sababini tuzatmaydi.'),
  ('revision:pedagogy:729cc366-f9b8-e254-807d-b99263b6444b', 'Vaqt yetishmaganda darsning ustuvor o‘quv natijasini saqlash zarur: ikkinchi darajali faoliyatni qisqartirib, muhim tushuntirish va mustaqil mashqqa vaqt qayta ajratiladi. Bu moslashuvchan sinf boshqaruvidir. Rejani qog‘ozda o‘zgartirmasdan oxirgi mashqni butunlay olib tashlash maqsadga erishishni qiyinlashtirishi mumkin.'),
  ('revision:pedagogy:f099a140-e417-431f-839a-afca32139353', 'Jamoaviy tarbiya o‘quvchilarni bir-birining fikri va vazifasiga hurmat bilan qarashga, rollarni adolatli taqsimlashga va umumiy natija uchun javobgar bo‘lishga o‘rgatadi. Shuning uchun sinf rahbari guruh muammosini faqat jazo bilan emas, kelishilgan hamkorlik qoidalari orqali hal qiladi. Mazmunli ishtirok tarbiyaviy maqsadning bir qismidir.'),
  ('revision:pedagogy:3b943bf8-2ce7-5a35-fc2c-9791b4c1c2b1', 'Sinf soati mavzusi tasodifiy tanlanmaydi: oldingi tadbirlarda aniqlangan hamkorlik sustligi va internetdagi muloqot muammolari sinfning ayni tarbiyaviy ehtiyojini ko‘rsatadi. Shu dalillarga tayangan maqsad va faoliyat bolalarga mos bo‘ladi. Faqat bayram taqvimi yoki tayyor sarlavhaga suyanish dolzarb muammoni chetda qoldirishi mumkin.'),
  ('revision:pedagogy:418fbee1-01e4-70a1-9237-c4a9250f90b8', 'Akademik qobiliyat pedagogning o‘z fani nazariyasi, ilmiy tushunchalari va yangiliklarini chuqur egallaganini bildiradi. Savolda o‘qituvchi aynan fan tadqiqotlarini puxta bilishi bilan ta’riflangan. Shu bilimni sodda misol bilan yetkazish esa alohida didaktik yoki kommunikativ mahoratni ham talab etishi mumkin.'),
  ('revision:pedagogy:928b765d-c939-bb1d-c32e-b7470a317bda', 'Ishontirish metodi o‘quvchining qarashi va xulqiga buyruq yoki qo‘rqitish bilan emas, dalil, tushuntirish va suhbat orqali ta’sir ko‘rsatadi. O‘qituvchi axloqiy tanlovning sabab va oqibatlarini asoslagani uchun ushbu metod yetakchi. Shaxsiy namuna boshqa tarbiyaviy metod bo‘lib, unda pedagogning o‘z xatti-harakati bevosita o‘rnak bo‘ladi.'),
  ('revision:pedagogy:43f89532-c8c7-7ef4-74dc-10575e6d02d5', 'Davomat pasayganini ko‘rish muammo belgisi, lekin uning sababi hali noma’lum. Sinf rahbari avval o‘quvchi bilan xavfsiz, ayblovsiz suhbat qilib, zarur hollarda ota-ona bilan hamkorlikda vaziyatni aniqlashi kerak. Sababni bilmasdan tanbeh yoki umumiy jazo berish o‘quv motivatsiyasi va oilaviy vaziyatni e’tibordan qoldiradi.'),
  ('revision:pedagogy:6e583401-8a00-72a1-1d7c-fdaeacc77dbd', 'Onglilik va faollik tamoyili o‘quvchining bilimni shunchaki eslab qolmasdan mazmunini anglashini va o‘rganishda faol qatnashishini talab qiladi. Savol berish, fikrni dalil bilan himoya qilish va suhbatga qo‘shilish shu belgilarni ko‘rsatadi. Faqat ustoz aytgan jumlani takrorlash ongli o‘zlashtirish uchun yetarli dalil emas.'),
  ('revision:pedagogy:b9270878-b0fa-3298-2ddb-0486b8c69edf', 'Nutqning aniqligi o‘qituvchi fikrini tushunchalar ikki ma’noli bo‘lmasdan ifodalashiga bog‘liq. Tez gapirish, hatto ravon ohangda bo‘lsa ham, atamalar chalkash ishlatilsa o‘quvchi xato tushunishi mumkin. Muhim terminni aniq ta’riflash va misol bilan farqlash nutqning mazmuniy aniqligini oshiradi.'),
  ('revision:pedagogy:00f6ced7-2306-532f-cc9e-d51009ea96bd', 'Ko‘rgazmali sxema o‘quvchi uchun axborot manbai bo‘lishi mumkin, ammo uni tomosha qilish bilimni anglashga teng emas. Sxemadagi sabab-oqibatni izohlash, qismlarni taqqoslash yoki xulosa chiqarishni talab etish ongli va faol o‘rganishni kuchaytiradi. Shuning uchun asosiy kamchilik vositaning o‘zida emas, o‘quvchi fikrlash faoliyatining yetishmasligida.'),
  ('revision:pedagogy:f05cb1e0-129f-c4a5-a6ef-ae5e164d3f46', 'Ta’lim o‘quvchining yosh va mavjud rivojlanish darajasini hisobga olib tashkil etilsa, undan keyingi ko‘nikmalarni ham rivojlantira oladi. Tayanch bilimni aniqlash, erishiladigan murakkablikni tanlash va bosqichli yordam berish aynan shu bog‘lanishni ko‘rsatadi. Bir xil vazifani barcha bolaga bir xil ko‘mak bilan berish farqlarni inkor etadi.'),
  ('authored:pedguli-topic-study:v2:PM.GEN.02:112', 'O‘quvchilar tajribani o‘zlari bajarib, dalillarni solishtirib, mustaqil xulosa chiqarishgan. Bu ongli va faol bilish jarayonining belgisidir: bilim shunchaki tayyor shaklda aytilmagan, amaliy faoliyat orqali asoslangan. O‘qituvchining xulosani tekshirishi ilmiylikni ham mustahkamlaydi, ammo savoldagi yetakchi jihat o‘quvchilarning faol tafakkuridir.'),
  ('authored:professional-15:v1:PM.GEN.01:16', 'Boshlang‘ich sinfda yangi mavhum tushunchani tanish buyum, rasm yoki amaliy misoldan boshlab tushuntirish yoshga mos o‘qitishdir. O‘quvchi avval ko‘rinadigan belgini idrok etib, keyin umumiy qoida mazmunini anglaydi. Faqat murakkab ta’rifdan boshlash bolalarning tayanch tajribasi va rivojlanish imkoniyatini yetarli hisobga olmasligi mumkin.'),
  ('revision:pedagogy:24cc5f86-202e-07bb-af53-2b0b1f3bd05f', 'Psixologik tahlil darsdagi bolalarning diqqatini jamlashi, xavotiri, motivatsiyasi va ruhiy muhitini ko‘rib chiqadi. O‘qituvchi aynan bu belgilarni kuzatgan, shuning uchun u metodlarning texnik jihatidan ko‘ra o‘quvchining psixologik faoliyatini baholagan. Natijadan keyin qulay va xavfsiz o‘rganish sharoitini rejalash mumkin.'),
  ('revision:pedagogy:36da375f-27f9-55dc-5048-83103ec04b41', 'O‘quvchi foiz formulasini aynan yoddan takrorlamagan bo‘lsa ham, uning ma’nosini yangi xarid masalasiga mos qo‘llab mustaqil hisoblagan. Bu bilimdan foydalanish ko‘nikmasining amaliy dalilidir. Qoidani tushunmasdan eslashdan farqli ravishda, yangi vaziyatda asosli yechim chiqarish o‘zlashtirishning chuqurroq darajasini ko‘rsatadi.'),
  ('revision:pedagogy:be2ee11a-c30f-45bb-cdb3-04db4cb49e01', 'Tarbiyaviy yo‘nalish qanday qadriyat yoki xulqni shakllantirish ko‘zlanganini bildiradi, metod esa shu maqsadga qanday pedagogik ta’sir bilan erishilishini belgilaydi. Masalan, axloqiy tarbiya yo‘nalish bo‘lsa, suhbat, ishontirish va shaxsiy namuna uning metodlari bo‘lishi mumkin. Bu ikki darajani bir tushuncha sifatida ishlatish metodik chalkashlikdir.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000024', 'Sinf rahbari o‘quvchi haqidagi nozik ma’lumot bilan ishlaganda maxfiylik va bolaning manfaatini birinchi o‘ringa qo‘yadi. Ma’lumotni faqat tegishli mas’ul shaxslar bilan zarur hajmda muhokama qilishi kerak. Uni sinf oldida yoki umumiy chatda oshkor qilish kasbiy etikaga zid va o‘quvchiga zarar yetkazishi mumkin.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000030', 'Ko‘rishida qiyinchiligi bo‘lgan o‘quvchi raqamli topshiriqdagi mayda matnni idrok etmasligi mumkin. Shriftni kattalashtirish, kontrastni yaxshilash yoki ekranni ovozli o‘qish kabi vositalar ma’lumotga kirishni yengillashtiradi. Bu o‘quv maqsadini pasaytirmaydi, balki unga erishish yo‘lini ehtiyojga moslashtiradi.'),
  ('revision:pedagogy:fea25041-deb0-d68f-4434-87a8cfb331f7', 'Pedagogika ta’lim va tarbiya jarayonlari, shaxs shakllanishi va rivojlanishiga doir kengroq qonuniyatlarni o‘rganadi. Didaktika esa pedagogika tarkibida aynan o‘qitishning maqsadi, mazmuni, tamoyillari va metodlariga e’tibor beradi. Shuning uchun didaktikani pedagogika bilan mutlaqo bir xil yoki undan mustaqil butun fan deb ko‘rsatish to‘g‘ri emas.'),
  ('revision:pedagogy:4dee2206-4ffb-236b-1f3f-09c1ab2c9a77', 'O‘quvchining darsga qiziqishi pasaygani tashqi belgi bo‘lib, uning ortida turli sabablar bo‘lishi mumkin. Sinf rahbari avval bolaning fikrini individual va hurmatli suhbatda tinglab, ehtiyojni aniqlashi kerak. Shundan keyin tegishli yordam yoki ota-ona bilan kelishuv rejalashtiriladi; sabab noma’lum paytda tanbeh berish samarasiz.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000015', 'Didaktika pedagogikaning ta’lim nazariyasiga oid bo‘limi bo‘lib, nimani, nima uchun va qanday o‘qitish masalalarini tahlil qiladi. Uning predmetiga o‘quv maqsadi, mazmun, ta’lim tamoyillari, metod, shakl va natijani baholash kiradi. Umumiy tarbiya va sinf rahbarligi esa pedagogikaning didaktikadan kengroq faoliyat doiralarini ham qamraydi.'),
  ('revision:pedagogy:75000000-0000-4000-8000-000000000019', 'Axloqiy tarbiya o‘quvchilarda boshqalarga hurmat, rostgo‘ylik, mas’uliyat, vijdon va jamiyatda qabul qilingan xulq me’yorlarini shakllantirishga qaratiladi. Bu qadriyatlar suhbat, shaxsiy namuna va ijobiy faoliyat orqali mustahkamlanadi. Faqat ma’lumot yodlashdan farqli ravishda, ongli xulq va munosabat asosiy natijadir.'),
  ('revision:pedagogy:79000000-0000-4000-8000-000000000109', 'Ikki kuzatuv natijasi bir-biriga zid bo‘lganda o‘quvchilar sababni topish uchun gipoteza ilgari surib, dalillarni solishtirgan va mustaqil tekshiruv asosida xulosa chiqargan. Bu muammoli ta’limning asosiy siklidir: bilish ziddiyati izlanishga undaydi. Oddiy ma’ruzada tayyor xulosa beriladi, bu vaziyatda esa o‘quvchilar yechimni o‘zlari qidirgan.');

DO $task374$
DECLARE item record; v_actor uuid; v_review uuid; n integer;
BEGIN
 SELECT count(*) INTO n FROM task374_pmgen_rationales;
 IF n<>30 THEN RAISE EXCEPTION 'TASK374_EXPECTED_30'; END IF;
 SELECT count(*) INTO n FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 IF n<>1 THEN RAISE EXCEPTION 'TASK374_UNIQUE_ACTIVE_ADMIN_REQUIRED'; END IF;
 SELECT id INTO STRICT v_actor FROM public.profiles WHERE role='admin' AND NOT coalesce(is_blocked,false);
 SELECT count(*) INTO n
 FROM task374_pmgen_rationales t
 JOIN public.questions q ON q.source_reference=t.source_reference
 JOIN public.question_keys k ON k.question_id=q.id
 WHERE q.status='published' AND q.group_code='PM.GEN' AND q.format='Y1'
   AND char_length(trim(coalesce(k.explanation_md,''))) < 80
   AND NOT EXISTS(SELECT 1 FROM public.pedagogy_revision_queue r WHERE r.source_question_id=q.id);
 IF n<>30 THEN RAISE EXCEPTION 'TASK374_SOURCE_DRIFT_OR_ALREADY_REVISED_%',n; END IF;
 FOR item IN
   SELECT q.id,t.educational_explanation FROM task374_pmgen_rationales t
   JOIN public.questions q ON q.source_reference=t.source_reference
   ORDER BY t.source_reference
 LOOP
   INSERT INTO public.pedagogy_revision_queue(source_question_id,reason)
   VALUES(item.id,'TASK-374: semantic QA and human-review pedagogy explanation draft');
   v_review:=public.stage_pedagogy_revision(item.id,v_actor);
   UPDATE public.question_keys SET explanation_md=item.educational_explanation,updated_at=now()
   WHERE question_id=v_review;
   GET DIAGNOSTICS n=ROW_COUNT;
   IF n<>1 OR NOT EXISTS(SELECT 1 FROM public.questions WHERE id=v_review AND status='review')
   THEN RAISE EXCEPTION 'TASK374_DRAFT_STAGING_FAILED'; END IF;
 END LOOP;
END $task374$;

-- Nothing persists if the file is ever accidentally executed as-is.
ROLLBACK;
