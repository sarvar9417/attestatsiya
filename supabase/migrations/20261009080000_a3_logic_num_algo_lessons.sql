-- TASK-053: A3 source-backed lessons for logic, numeral systems, and algorithms.
--
-- Sources synthesized in original wording:
--   * ICT 9-sinf (2020): logic, modelling, algorithm and flowchart chapters.
--   * ICT 7-sinf (2021): numeral systems, conversion and arithmetic chapters.
--   * Axborot va axborot jarayonlari synthesis: numeral-system calculation strategy.
--
-- Adds one published lesson per active S3.LOGIC, S3.NUM and S3.ALGO construct.

begin;

do $$
declare
  v_m04 uuid;
  v_m05 uuid;
  v_m06 uuid;
begin
  select id into strict v_m04 from public.modules where code = 'M04';
  select id into strict v_m05 from public.modules where code = 'M05';
  select id into strict v_m06 from public.modules where code = 'M06';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '94000000-0000-4000-8000-000000000001', v_m04, 1,
    'mantiqiy-mulohazalar',
    'Mantiqiy mulohazalar: sodda va murakkab ifodalar',
    $md$
## Maqsad

Mulohaza nima ekanini, rost va yolg‘on qiymatlarni hamda sodda va murakkab mantiqiy ifodalarni farqlash.

## Mulohaza

**Mulohaza** — rost yoki yolg‘onligi haqida aniq hukm chiqarish mumkin bo‘lgan darak gap. “7 — tub son” mulohaza va u rost. “Kitobni oching” buyruq gap bo‘lgani uchun mulohaza emas. Savol yoki mazmuni noaniq gap ham odatda mantiqiy mulohaza sifatida olinmaydi.

Mulohazaning mantiqiy qiymati ikki holatdan biri bo‘ladi: **rost (True)** yoki **yolg‘on (False)**. Mantiqiy masalada birinchi vazifa gapning mazmunini tushunish, ikkinchisi esa uning rostlik qiymatini aniqlashdir.

## Sodda va murakkab mulohaza

Bitta hukmni ifodalovchi mulohaza **sodda mulohaza** hisoblanadi. Bir yoki bir nechta mulohaza mantiqiy amallar orqali bog‘lansa, **murakkab mulohaza** hosil bo‘ladi.

Masalan:
- A: “8 juft son.”
- B: “8 soni 3 dan katta.”
- “A VA B” — murakkab mulohaza.

Murakkab ifodada natija faqat gap mazmuniga emas, ishlatilgan mantiqiy bog‘lovchi va tarkibiy mulohazalarning qiymatlariga bog‘liq.

## Test strategiyasi

1. gap mulohazami yoki yo‘qmi — shuni tekshiring;
2. sodda qismlarni A, B, C kabi belgilang;
3. har bir qismning rost/yolg‘on qiymatini toping;
4. keyin bog‘lovchi amallarni qo‘llang.

Attestatsiyada “fikr”, “gap” va “mulohaza” so‘zlari chalg‘ituvchi variant bo‘lishi mumkin. Asosiy mezon — gapga **rost yoki yolg‘on** qiymat berish mumkinligi.

> **Manba izi:** ICT 9-sinf (2020), “Mantiq asoslari” va “Mantiqiy amallar va ifodalar”, PDF 4–9.
$md$,
    16, 'published'::public.content_status
  ),
  (
    '94000000-0000-4000-8000-000000000002', v_m04, 2,
    'mantiqiy-amallar',
    'Mantiqiy amallar: AND, OR va NOT',
    $md$
## Maqsad

Inkor, konyunksiya va dizyunksiya amallarini qo‘llash hamda murakkab ifodadagi amal tartibini aniqlash.

## Asosiy amallar

**NOT (EMAS, inkor)** bitta mulohazaning mantiqiy qiymatini teskarisiga o‘zgartiradi. A rost bo‘lsa, NOT A yolg‘on; A yolg‘on bo‘lsa, NOT A rost.

**AND (VA, konyunksiya)** faqat ikkala mulohaza ham rost bo‘lganda rost natija beradi. Kamida bittasi yolg‘on bo‘lsa, natija yolg‘on.

**OR (YOKI, dizyunksiya)** kamida bitta mulohaza rost bo‘lsa rost bo‘ladi; faqat ikkala mulohaza ham yolg‘on bo‘lganda yolg‘on natija beradi.

## Murakkab ifoda

Murakkab mantiqiy ifodada qavslar va amal ustuvorligiga rioya qilinadi. Ichma-ich qavslar bo‘lsa, eng ichki qism avval hisoblanadi. Teng ustuvor amallar odatda ifodada berilgan tartib bo‘yicha ko‘rib chiqiladi.

Misol: A = rost, B = yolg‘on bo‘lsin.

- NOT B = rost;
- A OR NOT B = rost;
- A AND B = yolg‘on.

Matematik munosabat ham mantiqiy qiymat beradi: masalan, 4 > 9 — yolg‘on. Shu sabab mantiqiy ifodada taqqoslash natijasi keyingi AND/OR kabi amallar uchun kirish qiymati bo‘lishi mumkin.

## Attestatsiya uchun

Murakkab ifodani birdan yechmang. Har bir oraliq qiymatni alohida yozish xatoni kamaytiradi. Ayniqsa inkor belgisi qaysi mulohazaga yoki qavsga tegishli ekanini tekshiring.

> **Manba izi:** ICT 9-sinf (2020), 2–3-darslar “Mantiqiy amallar va ifodalar”, PDF 6–9.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '94000000-0000-4000-8000-000000000003', v_m04, 3,
    'mantiqiy-xulosa-va-masala',
    'Mantiqiy mulohazalar yordamida xulosa chiqarish',
    $md$
## Maqsad

Berilgan shartlarni mantiqiy mulohazalarga aylantirish, ularning o‘zaro bog‘lanishini tekshirish va asosli xulosa chiqarish.

## Shartdan mantiqiy modelga

Mantiqiy masalada matnli shartni darhol taxmin bilan yechish o‘rniga, muhim hukmlarni alohida mulohazalarga ajratish foydali. Har bir mulohazani A, B, C kabi belgilar bilan ifodalab, ular orasidagi VA, YOKI, EMAS kabi munosabatlarni aniqlash mumkin.

Masalan, tizim faqat “foydalanuvchi tasdiqlangan VA parol to‘g‘ri” bo‘lganda kirishga ruxsat bersa, ikkala shart bir vaqtning o‘zida rost bo‘lishi kerak. “Kamida bittasi rost” deyilsa, OR modeli mos keladi.

## Xulosa chiqarish

To‘g‘ri xulosa quyidagi ketma-ketlikka tayanadi:
1. berilgan faktlarni ajratish;
2. ularni mantiqiy ifodalash;
3. ziddiyatli yoki yetarli bo‘lmagan shartni aniqlash;
4. mantiqiy amallar orqali natijani tekshirish;
5. faqat shartlardan kelib chiqadigan xulosani tanlash.

Shartda berilmagan ma’lumotni “odatda shunday bo‘ladi” degan taxmin bilan qo‘shish mantiqiy xato keltirib chiqaradi.

## Vaziyatli savollar

Attestatsiyada mantiq ko‘pincha kundalik yoki kompyuterga oid vaziyat ichida beriladi: kirish shartlari, qidiruv filtri, sensorlar kombinatsiyasi yoki dasturdagi shartlar. Bunday savolda texnik kontekstni emas, shartlarning mantiqiy tuzilishini markazga qo‘ying.

> **Manba izi:** ICT 9-sinf (2020), “Mantiq asoslari” hamda “Mantiqiy amallar va ifodalar”, PDF 4–9; shartlarni rost/yolg‘on qiymatlar orqali tahlil qilish misollari.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '94000000-0000-4000-8000-000000000004', v_m04, 4,
    'rostlik-jadvali-va-mantiqiy-sxema',
    'Rostlik jadvali va mantiqiy sxemalar',
    $md$
## Maqsad

Mantiqiy ifoda uchun rostlik jadvalini tuzish va mantiqiy elementlardan tashkil topgan sxemani ifoda bilan bog‘lash.

## Rostlik jadvali

Rostlik jadvali mantiqiy o‘zgaruvchilarning barcha mumkin bo‘lgan qiymatlari uchun ifoda natijasini ko‘rsatadi. Ikki o‘zgaruvchi A va B bo‘lsa, to‘rtta kombinatsiya mavjud: 00, 01, 10, 11. Uchta o‘zgaruvchi bo‘lsa kombinatsiyalar soni 8 taga teng.

Jadval tuzishda murakkab ifodani oraliq ustunlarga ajratish xavfsiz:
1. A va B qiymatlarini yozing;
2. NOT kabi ichki amallar uchun ustun yarating;
3. keyingi AND/OR amallarini hisoblang;
4. eng oxirgi ustun — butun ifoda natijasi.

## Mantiqiy sxema

Mantiqiy sxemada AND, OR va NOT kabi elementlar kirish signallariga mantiqiy amal qo‘llaydi. Sxemani o‘qishda signal yo‘nalishini kirishdan chiqishga qarab kuzating. Har bir element chiqishini vaqtinchalik X, Y kabi belgilab, keyingi elementga kirish sifatida yozish mumkin.

Ifodadan sxema tuzishda esa qavslar ichidagi amal ichki element sifatida birinchi quriladi. Masalan, NOT A keyin B bilan AND qilinsa, avval A inkor qilinadi, so‘ng uning chiqishi B bilan AND elementiga ulanadi.

## Tekshirish

Sxema va ifodaning ekvivalentligini rostlik jadvali yordamida tekshirish mumkin: barcha kirish kombinatsiyalarida chiqish bir xil bo‘lsa, ular bir xil mantiqiy funksiyani ifodalaydi.

> **Manba izi:** ICT 9-sinf (2020), “Mantiqiy ifodalarning rostlik jadvalini tuzish” va “Mantiqiy sxemalar”, PDF 10–16.
$md$,
    20, 'published'::public.content_status
  ),

  (
    '95000000-0000-4000-8000-000000000001', v_m05, 1,
    'sanoq-sistemalari-asoslari',
    'Sanoq sistemalari: asos, raqam va razryad',
    $md$
## Maqsad

Sanoq sistemasi, asos, raqam, son va razryad tushunchalarini farqlash hamda pozitsiyali yozuvni tahlil qilish.

## Asosiy tushunchalar

**Sanoq sistemasi** — sonlarni belgilar yordamida yozish va ular ustida amallar bajarish qoidalari tizimi. Sanoq sistemasining **asosi p** shu sistemada ishlatiladigan turli raqamlar sonini bildiradi.

Asos 2 bo‘lsa raqamlar 0 va 1; asos 8 bo‘lsa 0 dan 7 gacha; asos 16 bo‘lsa 0–9 hamda A–F belgilaridan foydalaniladi. Shuning uchun 298 yozuvi sakkizlik sanoq sistemasida haqiqiy son emas: 9 raqami bu sistemaning alifbosiga kirmaydi.

**Raqam** — son yozuvida qatnashadigan belgi, **son** esa miqdorni ifodalaydi. Bu ikki atama sinonim emas.

## Pozitsiyali yozuv

Pozitsiyali sanoq sistemasida raqamning qiymati uning qaysi razryadda turganiga bog‘liq. Masalan, p asosli sonning razryadlari p ning darajalari bilan vaznlanadi.

Yoyiq ko‘rinish:
(a_n...a_1a_0)_p = a_n·p^n + ... + a_1·p + a_0.

Shu qoida sonning qaysi asosda yozilganini tekshirish, o‘nlik qiymatini hisoblash va noma’lum asosli masalalarni yechish uchun poydevor bo‘ladi.

## Testdagi nozik farq

Quyi indeks sonning o‘zi emas, **sanoq sistemasi asosini** bildiradi. Ruxsat etilgan eng katta raqam p−1 ga teng.

> **Manba izi:** ICT 7-sinf (2021), 2-dars “Sanoq sistemalari haqida”, PDF 9–12.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '95000000-0000-4000-8000-000000000002', v_m05, 2,
    'sanoq-sistemalari-otkazish',
    'Sonlarni sanoq sistemalari orasida o‘tkazish',
    $md$
## Maqsad

O‘nlikdan boshqa asosga, boshqa asosdan o‘nlikka hamda 2↔4/8/16 o‘tkazish usullarini to‘g‘ri tanlash.

## Boshqa asosdan o‘nlikka

Pozitsiyali sonni o‘nlikka o‘tkazishda har bir raqam asosning o‘z razryadiga mos darajasiga ko‘paytiriladi va natijalar qo‘shiladi.

Masalan:
101101₂ = 1·2⁵ + 0·2⁴ + 1·2³ + 1·2² + 0·2 + 1 = 45₁₀.

## O‘nlikdan boshqa asosga

Butun sonni yangi asosga ketma-ket bo‘lib boring va har bosqichdagi qoldiqni yozing. Yakuniy raqamlar **qoldiqlarni oxiridan boshiga** o‘qish orqali olinadi. Asos 10 dan katta bo‘lsa, 10, 11, ... qiymatlar A, B, ... belgilariga almashtiriladi.

## Ikkilik bilan ko‘prik usullari

Ikkilikdan:
- to‘rtlikka — 2 bitli guruhlar (**diada**);
- sakkizlikka — 3 bitli guruhlar (**triada**);
- o‘n oltilikka — 4 bitli guruhlar (**tetrada**) ishlatiladi.

Teskari yo‘nalishda har bir raqam mos uzunlikdagi ikkilik guruh bilan almashtiriladi. Guruhlash sonning kasr nuqtasi bo‘lsa, nuqtadan chap va o‘ng tomonda alohida amalga oshiriladi.

## Tekshirish

O‘tkazilgan sonni yana o‘nlikka qaytarish — xatoni tez aniqlash usuli.

> **Manba izi:** ICT 7-sinf (2021), 3-dars “Sonlarni bir sanoq sistemasidan boshqa sanoq sistemasiga o‘tkazish”, PDF 13–16; Axborot va axborot jarayonlari qo‘llanmasi, 6-bob.
$md$,
    22, 'published'::public.content_status
  ),
  (
    '95000000-0000-4000-8000-000000000003', v_m05, 3,
    'sanoq-sistemalari-arifmetika',
    'Turli sanoq sistemalarida arifmetik amallar',
    $md$
## Maqsad

Ikkilik va boshqa pozitsiyali sanoq sistemalarida qo‘shish, ayirish va arifmetik ifodalarni xatosiz bajarish.

## Bir xil asosda amal

Arifmetik amal bajarishdan oldin barcha sonlar bir xil asosda ekanini tekshiring. Bir xil asosda ustunlab qo‘shish yoki ayirishda o‘nlikdagi “10” o‘rniga shu sistemaning **asosi p** chegarasi ishlaydi.

Ikkilik qo‘shishda:
- 0+0=0;
- 0+1=1;
- 1+1=10₂;
- 1+1+1=11₂.

Bu yerda chap razryadga ko‘chirish o‘nlik arifmetikasidagi ko‘chirishning aynan p=2 holatidir.

## Aralash asosli ifoda

Agar ifodadagi sonlar turli sanoq sistemalarida bo‘lsa, eng ishonchli strategiya:
1. har bir sonning asosini aniqlash;
2. zarur bo‘lsa barchasini o‘nlikka o‘tkazish;
3. arifmetik amalni bajarish;
4. savol talab qilgan asosga qayta o‘tkazish;
5. raqamlar yangi asos alifbosiga mosligini tekshirish.

Ikkilik↔sakkizlik yoki ikkilik↔o‘n oltilikda triada/tetrada usuli tezroq bo‘lishi mumkin.

## Keng tarqalgan xatolar

- asos ko‘rsatkichini sonning darajasi deb o‘qish;
- o‘n oltilikdagi A–F qiymatlarini noto‘g‘ri talqin qilish;
- qoldiqlarni noto‘g‘ri tartibda yozish;
- turli asosdagi sonlarni bevosita ustunlab qo‘shish.

> **Manba izi:** ICT 7-sinf (2021), 4-dars “Turli sanoq sistemalarida arifmetik amallarning bajarilishi”, PDF 17–21.
$md$,
    22, 'published'::public.content_status
  ),

  (
    '96000000-0000-4000-8000-000000000001', v_m06, 1,
    'algoritm-va-turlari',
    'Algoritm tushunchasi, xossalari va turlari',
    $md$
## Maqsad

Algoritmni ta’riflash, uning asosiy xossalarini tushuntirish va chiziqli, tarmoqlanuvchi hamda takrorlanuvchi tuzilmalarni farqlash.

## Algoritm

**Algoritm** — ijrochi uchun qo‘yilgan masalani yechishga qaratilgan aniq va tushunarli ko‘rsatmalarning chekli ketma-ketligi. Algoritmni bajaruvchi inson, robot yoki kompyuter **ijrochi** bo‘lishi mumkin. Ijrochi bajara oladigan buyruqlar majmui uning ko‘rsatmalar tizimini tashkil etadi.

## Asosiy xossalar

- **diskretlilik** — yechim alohida qadamlar ketma-ketligida beriladi;
- **aniqlilik** — har bir ko‘rsatma bir ma’noli bo‘lishi kerak;
- **tushunarlilik** — buyruq ijrochining imkoniyatiga mos bo‘lishi kerak;
- **ommaviylik** — algoritm bir turdagi masalalar sinfiga qo‘llanishi mumkin;
- **natijaviylik** — chekli qadamlardan keyin natija yoki yechim mavjud emasligi haqidagi xulosa olinadi.

## Tuzilmalar

**Chiziqli algoritm**da buyruqlar ketma-ket bajariladi. **Tarmoqlanuvchi algoritm**da shart natijasiga qarab yo‘nalish tanlanadi. **Takrorlanuvchi algoritm**da bir guruh buyruq bir necha marta bajariladi. Amaliy masalada bu tuzilmalar aralash holda ham kelishi mumkin.

Bir masala uchun bir nechta to‘g‘ri algoritm mavjud bo‘lishi mumkin; keyin ularni qadamlar soni yoki qulaylik bo‘yicha taqqoslash mumkin.

> **Manba izi:** ICT 9-sinf (2020), 13–14-darslar “Algoritm tushunchasi va uning xossalari”, PDF 27–30 va keyingi algoritm turlari mavzulari.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '96000000-0000-4000-8000-000000000002', v_m06, 2,
    'blok-sxema-va-psevdokod',
    'Algoritmni blok-sxema va psevdokodda tasvirlash',
    $md$
## Maqsad

Algoritmni grafik blok-sxema va matnga yaqin psevdokod ko‘rinishida ifodalash hamda asosiy boshqaruv tuzilmalarini tanish.

## Blok-sxema

Blok-sxema algoritm qadamlarini standart shakllar va yo‘nalish chiziqlari orqali grafik ifodalaydi. Boshlash/tugatish, kiritish-chiqarish, amal bajarish va shart tekshirish bloklari turli vazifani bajaradi.

Shart bloki odatda ikki yoki undan ortiq yo‘nalishga ajraladi. “Ha/yo‘q” tarmoqlarini to‘g‘ri joylashtirish algoritmning mantiqiy yo‘lini aniqlashga yordam beradi.

## Psevdokod

**Psevdokod** ma’lum bir dasturlash tilining qat’iy sintaksisiga bog‘lanmagan, lekin algoritm tuzilishini aniq ko‘rsatadigan yozuvdir. Unda kiritish, chiqarish, o‘zlashtirish, IF/ELSE va takrorlash kabi konstruksiyalar tushunarli so‘zlar bilan beriladi.

Masalan:

INPUT x  
IF x > 0 THEN  
&nbsp;&nbsp;OUTPUT "musbat"  
ELSE  
&nbsp;&nbsp;OUTPUT "musbat emas"  
ENDIF

Psevdokodning maqsadi dastur sintaksisini yodlash emas, **algoritm mantiqini** ravshan ko‘rsatishdir.

## Bir ko‘rinishdan boshqasiga

Blok-sxemani psevdokodga aylantirganda signal yo‘nalishini yuqoridan pastga kuzating. Shart blokini IF, qaytuvchi o‘qni esa mos takrorlash konstruksiyasi bilan ifodalang.

> **Manba izi:** ICT 9-sinf (2020), “Algoritm turlari va tasvirlash usullari” hamda blok-sxema misollari, PDF 30–46.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '96000000-0000-4000-8000-000000000003', v_m06, 3,
    'masala-algoritmini-tuzish',
    'Masalaning algoritmini tuzish',
    $md$
## Maqsad

Masala shartidan kirish va chiqish kattaliklarini ajratib, yechim uchun to‘g‘ri algoritmik ketma-ketlik tuzish.

## Muammodan algoritmga

Kompyuter yordamida masala yechish faqat kod yozishdan boshlanmaydi. Avval muammo aniq qo‘yiladi: maqsad, boshlang‘ich ma’lumotlar va olinishi kerak bo‘lgan natija aniqlanadi. Keyin ular orasidagi bog‘lanish model ko‘rinishida ifodalanadi.

ICT darsligidagi ketma-ketlik:
1. masalaning qo‘yilishi;
2. matematik model tuzish;
3. algoritmlash;
4. dasturlash;
5. dasturni kompyuter xotirasiga kiritish;
6. natija olish va tahlil etish.

## Algoritm tuzish qadamlari

Algoritm bosqichida:
- kirish qiymatlarini belgilang;
- kerakli formulalar va shartlarni aniqlang;
- amallar tartibini yozing;
- tarmoqlanish yoki takrorlash zarurligini tekshiring;
- natijani chiqarish qadamini qo‘shing;
- oddiy test ma’lumot bilan qo‘lda bajarib ko‘ring.

Masalada ortiqcha ma’lumot bo‘lishi mumkin. Har bir berilgan kattalik algoritmda kerakmi yoki yo‘qmi — buni model aniqlaydi.

## Tekshirish

Yaxshi algoritm faqat “misolda ishlashi” bilan emas, masala shartiga mos barcha ruxsat etilgan kirishlar uchun mantiqan to‘g‘ri ishlashi bilan baholanadi.

> **Manba izi:** ICT 9-sinf (2020), 8–9-darslar “Masalalarni kompyuterda yechish bosqichlari”, PDF 17–19; algoritmlash bo‘limi, PDF 27–46.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '96000000-0000-4000-8000-000000000004', v_m06, 4,
    'algoritm-tahlili-va-maqbullik',
    'Algoritmni tahlil qilish va maqbul yechimni tanlash',
    $md$
## Maqsad

Bir masala uchun berilgan bir nechta algoritmni to‘g‘rilik, qadamlar soni va ortiqcha amallar bo‘yicha taqqoslash.

## To‘g‘rilik birinchi o‘rinda

Eng qisqa algoritm har doim eng yaxshi algoritm emas. Avval algoritm barcha zarur holatlarda to‘g‘ri natija berishini tekshirish kerak. Noto‘g‘ri, lekin qisqa yechim maqbul hisoblanmaydi.

Tekshirish uchun:
- odatiy qiymat;
- chegara qiymati;
- shart yo‘nalishini o‘zgartiradigan qiymat;
- imkon bo‘lsa nol yoki minimal ruxsat etilgan qiymat

kabi test holatlaridan foydalanish mumkin.

## Taqqoslash mezonlari

Bir xil to‘g‘ri natija beradigan algoritmlarda:
- bajariladigan qadamlar soni;
- takrorlanishlar soni;
- ortiqcha qayta hisoblash;
- tushunarlilik va tekshirish qulayligi

taqqoslanadi.

ICT 9-sinfdagi misollar bir maqsadga olib boruvchi bir nechta harakat ketma-ketligi bo‘lishi mumkinligini ko‘rsatadi. Qisqaroq yo‘l odatda samaraliroq, lekin u algoritm xossalarini buzmasligi kerak.

## Attestatsiya yondashuvi

“Eng maqbul” degan savolda avval barcha variantlarni qo‘lda kuzatib, xato variantlarni chiqarib tashlang. Keyin to‘g‘ri variantlar orasida qadamlar va takrorlashlar sonini solishtiring. Vazifa maxsus mezon bersa — masalan, “eng kam qadam” — aynan shu mezon ustuvor.

> **Manba izi:** ICT 9-sinf (2020), algoritm xossalari va bir masalaga bir nechta algoritm misollari, PDF 27–30; algoritm tahlili uchun keyingi chiziqli/tarmoqlanuvchi/takrorlanuvchi misollar, PDF 35–46.
$md$,
    18, 'published'::public.content_status
  )
  on conflict (module_id, slug) do update
  set order_idx = excluded.order_idx,
      title_uz = excluded.title_uz,
      body_mdx = excluded.body_mdx,
      est_minutes = excluded.est_minutes,
      status = excluded.status,
      updated_at = now();

  delete from public.lesson_constructs lc
  using public.lessons l
  where lc.lesson_id = l.id
    and (
      (l.module_id = v_m04 and l.slug in ('mantiqiy-mulohazalar','mantiqiy-amallar','mantiqiy-xulosa-va-masala','rostlik-jadvali-va-mantiqiy-sxema'))
      or
      (l.module_id = v_m05 and l.slug in ('sanoq-sistemalari-asoslari','sanoq-sistemalari-otkazish','sanoq-sistemalari-arifmetika'))
      or
      (l.module_id = v_m06 and l.slug in ('algoritm-va-turlari','blok-sxema-va-psevdokod','masala-algoritmini-tuzish','algoritm-tahlili-va-maqbullik'))
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('M04','mantiqiy-mulohazalar','S3.LOGIC.01'),
      ('M04','mantiqiy-amallar','S3.LOGIC.02'),
      ('M04','mantiqiy-xulosa-va-masala','S3.LOGIC.03'),
      ('M04','rostlik-jadvali-va-mantiqiy-sxema','S3.LOGIC.04'),
      ('M05','sanoq-sistemalari-asoslari','S3.NUM.01'),
      ('M05','sanoq-sistemalari-otkazish','S3.NUM.02'),
      ('M05','sanoq-sistemalari-arifmetika','S3.NUM.03'),
      ('M06','algoritm-va-turlari','S3.ALGO.01'),
      ('M06','blok-sxema-va-psevdokod','S3.ALGO.02'),
      ('M06','masala-algoritmini-tuzish','S3.ALGO.03'),
      ('M06','algoritm-tahlili-va-maqbullik','S3.ALGO.04')
  ) as mapping(module_code, slug, construct_code)
  join public.modules m on m.code = mapping.module_code
  join public.lessons l on l.module_id = m.id and l.slug = mapping.slug
  join public.constructs c on c.code = mapping.construct_code and c.is_active
  on conflict do nothing;
end
$$;

commit;
