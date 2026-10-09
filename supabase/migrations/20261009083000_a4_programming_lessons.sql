-- TASK-054: A4 source-backed programming lessons for Scratch/LOGO and Python/JavaScript.
--
-- Sources synthesized in original wording:
--   * Cambridge+ 8-sinf: Scratch variables, operators, conditional/repetition blocks.
--   * Cambridge+ 9-sinf: turtle graphics / LOGO-style control commands.
--   * ICT 9-sinf (2020): Python syntax, variables, branching, loops, functions.
--   * Cambridge+ 10–11-sinf: JavaScript chapter 19, arrays/functions/iteration.
--
-- Adds one published lesson per active S4.BLOCK and S4.CODE construct.

begin;

do $$
declare
  v_m07 uuid;
  v_m08 uuid;
begin
  select id into strict v_m07 from public.modules where code = 'M07';
  select id into strict v_m08 from public.modules where code = 'M08';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '97000000-0000-4000-8000-000000000001', v_m07, 1,
    'scratch-ozgaruvchi-va-koordinata',
    'Scratch: o‘zgaruvchilar va koordinatalar',
    $md$
## Maqsad

Scratch dasturida o‘zgaruvchi yaratish va spraytning koordinatalar tekisligidagi holatini baholash.

## O‘zgaruvchi

**O‘zgaruvchi** dastur bajarilishi davomida qiymati saqlanishi va o‘zgarishi mumkin bo‘lgan nomlangan ma’lumot joyidir. Scratchda o‘zgaruvchi ball, vaqt, urinishlar soni yoki boshqa hisoblanadigan qiymatni saqlashi mumkin. O‘zgaruvchini yaratgandan keyin unga qiymat berish, qiymatini ma’lum miqdorga oshirish yoki kamaytirish mumkin.

## Koordinatalar

Scratch sahnasida spraytning o‘rni x va y koordinatalari bilan ifodalanadi. x gorizontal yo‘nalishni, y vertikal yo‘nalishni bildiradi. Musbat x o‘ngga, manfiy x chapga; musbat y yuqoriga, manfiy y pastga siljishni anglatadi.

Spraytni aniq nuqtaga olib borish uchun x va y qiymatlari birgalikda ishlatiladi. Harakat bloklari bilan koordinata bloklarini aralashtirmang: biri nisbiy harakatni, ikkinchisi aniq holatni ifodalashi mumkin.

## Test strategiyasi

Berilgan kod bajarilganda:
1. boshlang‘ich x/y ni yozing;
2. har bir harakatdan keyin koordinatani yangilang;
3. o‘zgaruvchi qiymatini alohida kuzating;
4. oxirgi holatni so‘ralgan natija bilan solishtiring.

> **Manba izi:** Cambridge+ 8-sinf, Scratch dasturlash bo‘limlari; attestatsiya spetsifikatsiyasidagi Scratch o‘zgaruvchi va koordinata talabi.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '97000000-0000-4000-8000-000000000002', v_m07, 2,
    'scratch-bloklar-bilan-algoritm',
    'Scratch: bloklar yordamida algoritm tuzish',
    $md$
## Maqsad

Scratch bloklarini to‘g‘ri ketma-ketlikda joylashtirib, masala algoritmini tuzish va bajarilish tartibini kuzatish.

## Blokli dasturlash

Scratchda dastur kodi matn ko‘rinishida yozilmaydi; buyruqlar ma’nosiga ko‘ra ajratilgan bloklar bir-biriga ulanadi. Hodisa bloklari dastur qachon boshlanishini, harakat bloklari sprayt nima qilishini, boshqaruv bloklari esa bajarilish oqimini belgilaydi.

Algoritm tuzishda maqsadni kichik qadamlarga ajrating. Masalan, “sprayt 100 qadam yurib, so‘ng 90° burilsin va xabar aytsin” vazifasida buyruqlar aynan shu tartibda joylashtirilishi kerak. Bloklarning joylashish tartibi natijaga bevosita ta’sir qiladi.

## Tahlil qilish usuli

Kod fragmentini ko‘rganda:
1. boshlanish hodisasini toping;
2. bloklarni yuqoridan pastga kuzating;
3. qiymat o‘zgartiruvchi bloklarni yozib boring;
4. boshqaruv bloklari ichidagi ichma-ich buyruqlarni alohida hisoblang.

Scratch bloklari algoritmning grafik ko‘rinishi bo‘lsa-da, ular ham ketma-ketlik, shart va takrorlanish kabi umumiy algoritmik tamoyillarga bo‘ysunadi.

> **Manba izi:** ICT 6-sinf (2021) Scratch chiziqli/tarmoqlanuvchi/takrorlanuvchi bloklar; Cambridge+ 8-sinf Scratch bo‘limlari.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '97000000-0000-4000-8000-000000000003', v_m07, 3,
    'scratch-shart-va-takrorlash',
    'Scratch: shartli va takrorlanuvchi bloklar',
    $md$
## Maqsad

Scratchda if, if–else va takrorlash bloklarini vaziyatga mos tanlash hamda natijani aniqlash.

## Shartli bloklar

**if** blokidagi shart rost bo‘lsa, ichidagi buyruqlar bajariladi; yolg‘on bo‘lsa, ular o‘tkazib yuboriladi. **if–else** blokida esa shart rost bo‘lsa birinchi, yolg‘on bo‘lsa ikkinchi tarmoq bajariladi.

Shartlarda =, <, > kabi taqqoslash operatorlari yoki mantiqiy bog‘lovchilar ishlatilishi mumkin. Masalan, ball 10 ga teng bo‘lsa “Siz yutdingiz”, aks holda “Yana urinib ko‘ring” chiqarish if–else bilan ifodalanadi.

## Takrorlash

Bir xil buyruq guruhini bir necha marta bajarish uchun takrorlash bloklaridan foydalaniladi. Takrorlar soni oldindan ma’lum bo‘lsa sanaladigan repeat, shartga bog‘liq bo‘lsa shartli takrorlash mos keladi.

Ichma-ich takrorlashda ichki sikl tashqi siklning har bir aylanishida to‘liq bajariladi. Shu sabab yakuniy bajarilish sonini hisoblashda ko‘paytirish kerak bo‘lishi mumkin.

> **Manba izi:** Cambridge+ 8-sinf, Scratch shartli bloklar va operatorlar bo‘limi; ICT 6-sinf (2021), takrorlanuvchi bloklar.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '97000000-0000-4000-8000-000000000004', v_m07, 4,
    'scratch-pen-shakllar',
    'Scratch Pen: shakllar chizish',
    $md$
## Maqsad

Pen vositasi yordamida chiziq va geometrik shakllar chizish uchun harakat, burilish va takrorlash bloklarini birlashtirish.

## Pen bilan chizish

Pen tushirilganda sprayt harakat qilgan yo‘l bo‘ylab chiziq chiziladi. Pen ko‘tarilganda sprayt siljiydi, lekin iz qoldirmaydi. Shuning uchun chizish algoritmida qalam holati, harakat masofasi va burilish burchagi birgalikda nazorat qilinadi.

Muntazam ko‘pburchak uchun tashqi burilish burchagi:
**360° / tomonlar soni**.

Masalan, kvadrat uchun 4 marta:
- oldinga bir xil masofa;
- 90° burilish

takrorlanadi. Teng tomonli uchburchak uchun tashqi burilish 120° bo‘ladi.

## Algoritmik yondashuv

Bir xil “harakat + burilish” juftligini qayta-qayta yozish o‘rniga repeat blokidan foydalanish kodni qisqartiradi va xatoni kamaytiradi. Chizilgan shakl yopilmasa, avval takrorlar soni va burilish burchagini tekshiring.

Attestatsiyada rasmga qarab qaysi kod chizishini yoki kodga qarab qaysi shakl hosil bo‘lishini aniqlash talab qilinishi mumkin.

> **Manba izi:** Scratch grafik/harakat mavzulari va attestatsiya spetsifikatsiyasidagi Pen yordamida shakl chizish talabi.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '97000000-0000-4000-8000-000000000005', v_m07, 5,
    'logo-toshbaqa-grafika',
    'LOGO va Toshbaqa grafika',
    $md$
## Maqsad

Toshbaqa grafikada oldinga-orqaga harakat, burilish va takrorlash buyruqlarini qo‘llab, shakl natijasini aniqlash.

## Toshbaqa boshqaruvi

Toshbaqa grafika kompyuterga aniq ko‘rsatmalar berib harakatni boshqarish modelidir. **FORWARD (FD)** oldinga, **BACK (BK)** orqaga yuradi. **RIGHT (RT)** va **LEFT (LT)** toshbaqani berilgan gradusga buradi.

Masalan:
FD 4  
RT 90

juftligi to‘rt marta bajarilsa kvadrat hosil bo‘ladi. Toshbaqaning qaysi tomonga qarab turgani muhim: RIGHT va LEFT natijasi aynan joriy yo‘nalishga nisbatan hisoblanadi.

## Takrorlash

Bir xil buyruqlarni takrorlash uchun ularni siklga birlashtirish mumkin. Bu kodni qisqartiradi va shaklning geometrik mantiqini ko‘rsatadi.

Shaklni tahlil qilishda:
1. boshlang‘ich yo‘nalishni belgilang;
2. har bir FD/BK dan keyin joylashuvni yangilang;
3. RT/LT dan keyin yo‘nalishni o‘zgartiring;
4. takrorlash sonini to‘liq bajaring.

> **Manba izi:** Cambridge+ 9-sinf, “Toshbaqa grafika” — FORWARD/BACK/RIGHT/LEFT va takrorlash misollari.
$md$,
    18, 'published'::public.content_status
  ),

  (
    '98000000-0000-4000-8000-000000000001', v_m08, 1,
    'python-sintaksis-asoslari',
    'Python sintaksisi asoslari',
    $md$
## Maqsad

Python kodining asosiy sintaktik qoidalarini, kiritish-chiqarish va keng tarqalgan sintaksis xatolarini tanish.

## Asosiy yozuv

Python dasturida buyruqlar odatda alohida qatorda yoziladi. Natijani chiqarish uchun **print()**, foydalanuvchidan qiymat olish uchun **input()** ishlatiladi. Sonli qiymat kerak bo‘lsa, input natijasi int() yoki float() orqali mos turga o‘tkazilishi mumkin.

Python katta-kichik harflarni farqlaydi: print va Print bir xil nom emas. Qavslar va qo‘shtirnoqlar juft bo‘lishi kerak.

## Chekinish

Python sintaksisida **indentation** — ya’ni qator boshidagi bo‘sh joy — blok tuzilmasining bir qismi. if, for, while va def dan keyingi tana qismi bir xil chekinish bilan yozilishi kerak. Noto‘g‘ri chekinish IndentationError yoki mantiqiy xatoga olib kelishi mumkin.

## Xatolar

SyntaxError — yozuv qoidasi buzilganida, NameError — mavjud bo‘lmagan nom ishlatilganda paydo bo‘lishi mumkin. Dastur ishga tushishi uning mantiqan to‘g‘ri ekanini kafolatlamaydi.

> **Manba izi:** ICT 9-sinf (2020), Pythonni o‘rnatish, xatoliklar va dasturlash asoslari, PDF 51–61; ICT 10-sinf Python xatoliklari bo‘limi.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '98000000-0000-4000-8000-000000000002', v_m08, 2,
    'python-ozgaruvchi-shart-sikl',
    'Python: o‘zgaruvchi, shart va sikl',
    $md$
## Maqsad

Python tilida o‘zgaruvchi yaratish, if/elif/else shartlari va for/while sikllarini masala yechishda qo‘llash.

## O‘zgaruvchi

Python’da qiymat `=` operatori bilan nomga biriktiriladi: `x = 5`. O‘zgaruvchining qiymati keyin o‘zgarishi mumkin. Taqqoslash uchun `==`, `!=`, `<`, `>`, `<=`, `>=` operatorlari ishlatiladi.

## Shart

`if` shart rost bo‘lsa blokni bajaradi. Bir nechta alternativ holat uchun `elif`, oxirgi muqobil uchun `else` qo‘llanadi. Har bir blokdagi buyruqlar chekinish bilan yoziladi.

## Sikllar

`for` sikli takrorlar soni yoki ketma-ketlik elementlari oldindan ma’lum bo‘lgan vaziyatlarda qulay. `while` esa shart rost bo‘lib turguncha davom etadi. While siklida shartga ta’sir qiluvchi qiymat yangilanmasa, cheksiz sikl yuzaga kelishi mumkin.

Kod tahlilida o‘zgaruvchilarning har iteratsiyadagi qiymatini jadval qilib yozish eng ishonchli usullardan biridir.

> **Manba izi:** ICT 9-sinf (2020), if/elif, for va while mavzulari, PDF 76–90.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '98000000-0000-4000-8000-000000000003', v_m08, 3,
    'python-funksiya-va-massiv',
    'Python: funksiyalar va ro‘yxatlar',
    $md$
## Maqsad

Python funksiyasini aniqlash va chaqirish, parametr va return natijasini tushunish hamda ro‘yxat elementlari bilan ishlash.

## Funksiya

Funksiya takror ishlatiladigan kodni nomlangan qismga ajratadi. Python’da funksiya **def** bilan e’lon qilinadi. Qavs ichidagi parametrlar funksiyaga kirish qiymatlarini uzatadi; **return** esa natijani chaqirgan joyga qaytaradi.

Masalan, ikki sonning kattasini qaytaruvchi funksiya ichida shart tekshirilib, mos qiymat return qilinadi. Funksiya natijasini print qilish bilan funksiyaning o‘zida print ishlatishni farqlash kerak.

## Ro‘yxat

Python ro‘yxati bir nom ostida bir nechta qiymatni saqlaydi. Elementlar indeks bilan olinadi; indekslash odatda 0 dan boshlanadi. Sikl yordamida ro‘yxat elementlarini ketma-ket ko‘rib chiqish mumkin.

Attestatsiyada funksiya chaqiruvlari ichma-ich bo‘lishi yoki ro‘yxat indekslari bilan aralashishi mumkin. Har bir funksiya chaqiruvining kirishi va qaytish qiymatini alohida hisoblang.

> **Manba izi:** ICT 9-sinf (2020), “Qism dasturlar: funksiyalar va protseduralar”, funksiyalar va o‘zgaruvchilar, PDF 91–100.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '98000000-0000-4000-8000-000000000004', v_m08, 4,
    'javascript-sintaksis-asoslari',
    'JavaScript sintaksisi asoslari',
    $md$
## Maqsad

JavaScriptning veb-sahifadagi vazifasi, asosiy sintaksis elementlari, o‘zgaruvchi, identifikator va ma’lumot turlarini tushunish.

## JavaScript nima?

JavaScript veb-sahifaga interaktivlik qo‘shish uchun ishlatiladigan dasturlash tilidir. U HTML bilan birga tugma bosilishi, forma ma’lumotini tekshirish, sahifadagi matnni o‘zgartirish kabi harakatlarni bajarishi mumkin.

## Asosiy tushunchalar

**O‘zgaruvchi** — ma’lumot saqlanadigan nomlangan joy. **Identifikator** — o‘zgaruvchi yoki funksiyaning nomi. Ma’lumot turi qiymat qanday ma’lumot ekanini bildiradi, masalan son yoki matn.

JavaScript kodida operatorlar ifoda yaratadi, shartlar esa rost/yolg‘on natija beradi. Qavslar, jingalak qavslar va operatorlarning joylashuvi kod ma’nosiga ta’sir qiladi.

## HTML bilan bog‘lanish

JavaScript alohida skript sifatida yoki HTML bilan bog‘langan holda ishlashi mumkin. HTML elementi identifikatori orqali sahifadagi kerakli obyekt topilib, uning qiymati yoki mazmuni o‘zgartirilishi mumkin.

> **Manba izi:** Cambridge+ 10–11-sinf, 19-bob “Veb uchun dasturlash”, JavaScript kirish qismi, PDF 307–309.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '98000000-0000-4000-8000-000000000005', v_m08, 5,
    'javascript-shart-sikl-funksiya-massiv',
    'JavaScript: shart, sikl, funksiya va massiv',
    $md$
## Maqsad

JavaScriptda boshqaruv konstruksiyalari, funksiyalar va massivlar bilan ishlashni kod tahlilida qo‘llash.

## Shart va sikl

if/else konstruksiyasi shart natijasiga qarab bajariladigan kodni tanlaydi. for yoki boshqa iteratsiya usullari bir guruh amallarni takrorlash uchun ishlatiladi. Siklni tahlil qilishda boshlang‘ich qiymat, davom etish sharti va har iteratsiyadagi o‘zgarishni ajrating.

## Funksiya

**Funksiya** — ma’lum vazifani bajaruvchi va nom orqali chaqiriladigan kod qismi. Parametrlar funksiyaga qiymat uzatadi; return natijani qaytaradi. Bir funksiya massiv elementlarini tekshirish uchun ham ishlatilishi mumkin.

## Massiv

**Massiv** bir identifikator ostida ko‘plab qiymatlarni saqlaydi. JavaScriptda filter ma’lum shartga mos elementlardan yangi massiv hosil qilishi, forEach har bir element uchun amal bajarishi, every esa barcha elementlar shartga mos kelishini tekshirishi mumkin.

Masalan, [10,20,30,40] massivini 35 dan kichik yoki teng qiymatlar bo‘yicha filter qilish [10,20,30] natijasini beradi.

> **Manba izi:** Cambridge+ 10–11-sinf, 19-bob “Veb uchun dasturlash”, JavaScript funksiyalar, massivlar va iteratsiya usullari, PDF 307–319.
$md$,
    20, 'published'::public.content_status
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
      (l.module_id = v_m07 and l.slug in (
        'scratch-ozgaruvchi-va-koordinata','scratch-bloklar-bilan-algoritm','scratch-shart-va-takrorlash',
        'scratch-pen-shakllar','logo-toshbaqa-grafika'
      ))
      or
      (l.module_id = v_m08 and l.slug in (
        'python-sintaksis-asoslari','python-ozgaruvchi-shart-sikl','python-funksiya-va-massiv',
        'javascript-sintaksis-asoslari','javascript-shart-sikl-funksiya-massiv'
      ))
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('M07','scratch-ozgaruvchi-va-koordinata','S4.BLOCK.01'),
      ('M07','scratch-bloklar-bilan-algoritm','S4.BLOCK.02'),
      ('M07','scratch-shart-va-takrorlash','S4.BLOCK.03'),
      ('M07','scratch-pen-shakllar','S4.BLOCK.04'),
      ('M07','logo-toshbaqa-grafika','S4.BLOCK.05'),
      ('M08','python-sintaksis-asoslari','S4.CODE.01'),
      ('M08','python-ozgaruvchi-shart-sikl','S4.CODE.02'),
      ('M08','python-funksiya-va-massiv','S4.CODE.03'),
      ('M08','javascript-sintaksis-asoslari','S4.CODE.04'),
      ('M08','javascript-shart-sikl-funksiya-massiv','S4.CODE.05')
  ) as mapping(module_code, slug, construct_code)
  join public.modules m on m.code = mapping.module_code
  join public.lessons l on l.module_id = m.id and l.slug = mapping.slug
  join public.constructs c on c.code = mapping.construct_code and c.is_active
  on conflict do nothing;
end
$$;

commit;
