-- TASK-051: M02 source-backed hardware/software lessons.
--
-- Sources summarized in original wording:
--   * ICT 5-sinf (2020), "Kompyuter va uning tuzilishi",
--     "Kompyuterni boshqaruvchi dasturlar" va "Fayl va papka" mavzulari.
--   * ICT 10-sinf (2021), 7-dars "Operatsion tizimlar",
--     8-9-darslar "Xizmat ko'rsatish dasturlari" va fayl tizimi bo'limi.
--   * 10-11-sinf Informatika va axborot texnologiyalari (Cambridge+),
--     2-bob "Texnik va dasturiy ta'minot".
--
-- The migration adds one published lesson per active S2.HW construct and
-- preserves source trace inside body_mdx. It does not copy textbook passages.

begin;

do $$
declare
  v_module uuid;
begin
  select id into strict v_module
  from public.modules
  where code = 'M02';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '92000000-0000-4000-8000-000000000001',
    v_module,
    1,
    'kompyuter-qurilmalari-va-vazifalari',
    'Kompyuter qurilmalari va ularning vazifalari',
    $md$
## Maqsad

Kompyuterning asosiy apparat qismlarini vazifasi bo‘yicha ajratish va berilgan vazifa uchun mos qurilmani tanlash.

## Apparat qismlarini vazifa bo‘yicha tushunish

Kompyuter tizimi ma’lumotni **kiritadi**, **qayta ishlaydi**, **saqlaydi** va **chiqaradi**. Shu sabab qurilmani faqat nomi bilan emas, axborot jarayonidagi vazifasi bilan tanish muhim.

**Markaziy protsessor (CPU)** buyruqlarni bajaradi, arifmetik va mantiqiy amallarni amalga oshiradi hamda tizim ishini muvofiqlashtiradi. **Operativ xotira (RAM)** ishlayotgan dastur va ma’lumotlarni vaqtincha saqlaydi; elektr ta’minoti uzilganda uning mazmuni saqlanib qolmaydi. SSD yoki HDD kabi **doimiy saqlash qurilmalari** esa fayllarni uzoq muddat saqlash uchun xizmat qiladi.

**Asosiy plata** protsessor, xotira va boshqa komponentlar o‘zaro bog‘lanadigan asosiy elektron platformadir. Videokarta tasvirni qayta ishlashga, tarmoq adapteri tarmoqqa ulanishga xizmat qiladi.

## Kiritish va chiqarish

Klaviatura, sichqoncha, skaner, mikrofon va sensorlar ma’lumotni kompyuterga yuboradi. Monitor, printer, karnay kabi qurilmalar qayta ishlangan natijani foydalanuvchiga chiqaradi. Ayrim qurilmalar vaziyatga qarab bir nechta rolni bajarishi mumkin: masalan, sensorli ekran ham kiritish, ham chiqarish vazifasiga ega.

## Vazifaga mos tanlash

Qurilmani baholashda quyidagilarni so‘rang:
1. qanday ma’lumot kiritiladi yoki chiqariladi;
2. tezlik va aniqlik talabi qanday;
3. qancha ma’lumot saqlanadi;
4. qurilma ko‘chma yoki statsionar bo‘lishi kerakmi.

Attestatsiyada “eng kuchli qurilma” emas, **berilgan vazifa uchun eng mos qurilma** tanlanadi.

> **Manba izi:** ICT 5-sinf (2020), “Kompyuter va uning tuzilishi”, PDF 25–28; Cambridge+ 10–11-sinf, 2-bob “Texnik va dasturiy ta’minot”, PDF 32–42.
$md$,
    20,
    'published'::public.content_status
  ),
  (
    '92000000-0000-4000-8000-000000000002',
    v_module,
    2,
    'operatsion-tizimlar-va-imkoniyatlari',
    'Operatsion tizimlar va ularning imkoniyatlari',
    $md$
## Maqsad

Operatsion tizimning vazifasini, foydalanuvchi interfeyslarini va desktop hamda mobil OT misollarini farqlash.

## Operatsion tizim nima qiladi?

**Operatsion tizim (OT)** foydalanuvchi, dasturlar va kompyuter qurilmalari o‘rtasidagi boshqaruv qatlamidir. U dasturlarni ishga tushirish, xotira va saqlash qurilmalaridan foydalanish, fayllarni boshqarish, kiritish-chiqarish qurilmalarini muvofiqlashtirish kabi vazifalarni bajaradi.

OT mavjud bo‘lmasa, foydalanuvchi odatiy amaliy dasturlarni qulay tarzda ishga tushira olmaydi va apparat resurslarini boshqarish ancha murakkablashadi.

## CLI va GUI

**CLI**da foydalanuvchi buyruqlarni matn ko‘rinishida kiritadi. **GUI** esa oyna, menyu, tugma va piktogramma kabi grafik elementlar orqali ishlash imkonini beradi. Bu ikki tushunchani operatsion tizimning o‘zi bilan aralashtirmang: ular foydalanuvchi bilan muloqot usulidir.

## OT oilalari

Shaxsiy kompyuterlarda Windows, Linux va macOS kabi tizimlar ishlatiladi. Mobil qurilmalarda Android va iOS keng qo‘llanadi. Bir OT oilasining turli versiyalari yoki distributivlari bo‘lishi mumkin.

## Attestatsiya uchun farqlash

- OT — tizimli dasturiy ta’minotning bir turi;
- brauzer yoki matn protsessori — OT emas, amaliy dastur;
- GUI — operatsion tizimning nomi emas, interfeys turi;
- fayl tizimi — saqlashni tashkil etish usuli; OT undan foydalanadi va uni boshqaradi.

Vaziyatli savolda “qaysi dastur qurilmalarni, xotirani va ilovalarni boshqaradi?” deyilsa, javob operatsion tizim bo‘ladi.

> **Manba izi:** ICT 10-sinf (2021), 7-dars “Operatsion tizimlar”, PDF 24–26; ICT 5-sinf (2020), “Kompyuterni boshqaruvchi dasturlar”, PDF 38–42.
$md$,
    18,
    'published'::public.content_status
  ),
  (
    '92000000-0000-4000-8000-000000000003',
    v_module,
    3,
    'fayl-papka-va-fayl-tizimi',
    'Fayl, papka va fayl tizimi bilan ishlash',
    $md$
## Maqsad

Fayl, papka, fayl kengaytmasi, yo‘l va fayl tizimi tushunchalarini ajratish hamda asosiy fayl boshqaruvi amallarini tushunish.

## Fayl va papka

**Fayl** — ma’lum nom bilan saqlangan ma’lumotlar birligi. Fayl nomi ko‘pincha uning **kengaytmasi** bilan birga ko‘rsatiladi. Kengaytma faylning turi yoki uni odatda qaysi dastur bilan ochish mumkinligi haqida signal beradi, ammo fayl mazmunining o‘zi bilan bir xil tushuncha emas.

**Papka** fayllar va boshqa papkalarni tartibli guruhlash uchun ishlatiladi. Papka ichida ichki papkalar bo‘lishi mumkin, natijada ierarxik tuzilma hosil bo‘ladi.

## Faylga yo‘l

Faylning qayerda joylashganini ko‘rsatuvchi ketma-ket manzil **faylga yo‘l** deb qaraladi. Bir xil nomli fayllar turli papkalarda mavjud bo‘lishi mumkin, shuning uchun to‘liq yo‘l ularni aniq ajratishga yordam beradi.

## Fayl tizimi va file manager

**Fayl tizimi** saqlash qurilmasida fayl va papkalarni qanday nomlash, joylashtirish va kuzatishni tashkil etadi. NTFS, FAT32 va ext oilalari turli fayl tizimlariga misol bo‘la oladi.

**Fayl menejeri** esa foydalanuvchiga fayl va papkalarni yaratish, nusxa olish, ko‘chirish, qayta nomlash va o‘chirish kabi amallarni bajarish uchun interfeys beradi. Fayl menejeri bilan fayl tizimini bir tushuncha deb qabul qilmang.

## Amallarni farqlash

- **nusxa olish** — asl obyektni saqlab, yana bir nusxa yaratadi;
- **ko‘chirish** — obyektning joylashuvini o‘zgartiradi;
- **qayta nomlash** — joylashuvni o‘zgartirmasdan nomini almashtiradi;
- **o‘chirish** — obyektni odatiy foydalanishdan chiqaradi.

Attestatsiyada ko‘pincha aynan shu amallarning natijasi so‘raladi.

> **Manba izi:** ICT 10-sinf (2021), “Fayl tizimi”, PDF 26–27; ICT 5-sinf (2020), “Fayl va papka tushunchasi”, PDF 42–46.
$md$,
    18,
    'published'::public.content_status
  ),
  (
    '92000000-0000-4000-8000-000000000004',
    v_module,
    4,
    'tizimli-amaliy-va-xizmat-dasturlari',
    'Tizimli, amaliy va xizmat ko‘rsatuvchi dasturlar',
    $md$
## Maqsad

Dasturiy ta’minotning tizimli, amaliy va xizmat ko‘rsatuvchi turlarini vazifasi bo‘yicha farqlash.

## Dasturiy ta’minot

Kompyuter qurilmalari o‘z-o‘zidan foydalanuvchining vazifasini bajarmaydi. Buning uchun buyruqlar va dasturlar kerak bo‘ladi. Dasturiy ta’minotni ajratishda eng ishonchli mezon — **dastur nima uchun ishlatilishi**.

## Tizimli dasturiy ta’minot

Tizimli dasturlar kompyuter resurslari va boshqa dasturlar ishlashi uchun muhit yaratadi. Operatsion tizim bunga eng muhim misol. Drayverlar ham operatsion tizimga ma’lum qurilma bilan ishlash imkonini beradigan tizimli komponentlardir.

## Amaliy dasturlar

Amaliy dasturlar foydalanuvchining bevosita ishini bajaradi: matn yozish, jadval hisoblash, rasm tahrirlash, taqdimot yaratish yoki brauzer orqali veb resurslardan foydalanish shular jumlasidan.

## Xizmat ko‘rsatuvchi dasturlar

Xizmat dasturlari tizimni saqlash, tekshirish yoki ma’lumotni qulay shaklga keltirishga yordam beradi. **Arxivator** fayllarni siqish va bir paketga jamlash uchun, antivirus zararli dasturlarni aniqlash va zararsizlantirish uchun ishlatiladi. Kodek va konvertor kabi vositalar media yoki fayl formatlari bilan ishlashga yordam beradi.

## Testdagi chalg‘ituvchi variantlar

- Windows — tizimli dastur, Word esa amaliy dastur;
- arxivator odatda foydalanuvchining asosiy mazmunini yaratmaydi, u xizmat vazifasini bajaradi;
- “dastur” umumiy atama; “operatsion tizim”, “amaliy dastur” va “utilita” uning vazifaga ko‘ra turlaridir.

Savolda dastur nomi emas, uning **asosiy vazifasi**ga qarab tasniflang.

> **Manba izi:** ICT 5-sinf (2020), “Kompyuterni boshqaruvchi dasturlar”, PDF 38–42; ICT 10-sinf (2021), 8–9-darslar “Xizmat ko‘rsatish dasturlari”, PDF 28–32; Cambridge+ 10–11-sinf, 2-bob, PDF 32–42.
$md$,
    18,
    'published'::public.content_status
  )
  on conflict (module_id, slug) do update
  set
    order_idx = excluded.order_idx,
    title_uz = excluded.title_uz,
    body_mdx = excluded.body_mdx,
    est_minutes = excluded.est_minutes,
    status = excluded.status,
    updated_at = now();

  delete from public.lesson_constructs lc
  using public.lessons l
  where lc.lesson_id = l.id
    and l.module_id = v_module
    and l.slug in (
      'kompyuter-qurilmalari-va-vazifalari',
      'operatsion-tizimlar-va-imkoniyatlari',
      'fayl-papka-va-fayl-tizimi',
      'tizimli-amaliy-va-xizmat-dasturlari'
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('kompyuter-qurilmalari-va-vazifalari', 'S2.HW.01'),
      ('operatsion-tizimlar-va-imkoniyatlari', 'S2.HW.02'),
      ('fayl-papka-va-fayl-tizimi', 'S2.HW.03'),
      ('tizimli-amaliy-va-xizmat-dasturlari', 'S2.HW.04')
  ) as mapping(slug, construct_code)
  join public.lessons l
    on l.module_id = v_module
   and l.slug = mapping.slug
  join public.constructs c
    on c.code = mapping.construct_code
   and c.is_active
  on conflict do nothing;
end
$$;

commit;
