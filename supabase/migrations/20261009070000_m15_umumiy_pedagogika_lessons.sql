-- TASK-050: M15 source-backed umumiy pedagogika lessons.
--
-- Sources:
--   * R.A. Mavlonova va boshq., "Umumiy pedagogika", 2018.
--   * O'. Tolipov, D. Ro'ziyeva, "Pedagogik texnologiyalar va pedagogik mahorat", 2019.
--   * 2026 attestatsiya spetsifikatsiyasi: pedagogik mahorat 2.1 constructs.
-- Content is original synthesis, not copied source text.

begin;

do $$
declare
  v_module uuid;
begin
  select id into strict v_module
  from public.modules
  where code = 'M15';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '15000000-0000-4000-8000-000000000001',
    v_module, 1,
    'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
    'Pedagogika, didaktika, tarbiya va yosh psixologiyasi asoslari',
    $md$
## Maqsad

Pedagogika, didaktika, tarbiya va yosh psixologiyasining vazifalarini farqlash hamda pedagogik vaziyatga mos tushunchani tanlash.

## Pedagogika va didaktika

**Pedagogika** ta’lim-tarbiya jarayonida shaxsning shakllanishi va rivojlanishiga oid qonuniyatlarni o‘rganadi. **Didaktika** esa pedagogikaning ta’lim nazariyasiga doir yo‘nalishi bo‘lib, o‘qitish maqsadi, mazmuni, tamoyillari, metodlari, vositalari va tashkiliy shakllarini tahlil qiladi.

**Tarbiya** shaxsning qadriyatlari, munosabatlari, xulqi va ijtimoiy sifatlarini maqsadli rivojlantirish jarayonidir. Ta’lim va tarbiya amaliyotda bir-biridan mutlaqo ajralmaydi: dars mazmuni ham bilim beradi, ham munosabat va mas’uliyatni shakllantiradi.

## Yosh va individual xususiyatlar

Bir xil topshiriq turli yoshdagi yoki turli tayyorgarlikdagi o‘quvchilar uchun turlicha qiyinchilik tug‘diradi. O‘qituvchi rivojlanish bosqichi, avvalgi tajriba, motivatsiya, diqqat va individual farqlarni hisobga olishi kerak.

## Vaziyatni yechish

Agar o‘quvchi vazifani bajarmasa, darhol “qobiliyatsiz” degan xulosa chiqarilmaydi. Topshiriqning murakkabligi, tushuntirish sifati, avvalgi bilim, motivatsiya va qo‘llab-quvvatlash sharoiti tekshiriladi.

> **Manba izi:** Mavlonova va boshq., Umumiy pedagogika (2018), pedagogika asoslari va didaktika bo‘limlari; 2026 attestatsiya spetsifikatsiyasi, Pedagogik mahorat 2.1.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '15000000-0000-4000-8000-000000000002',
    v_module, 2,
    'pedagogikaning-asosiy-tamoyillari',
    'Pedagogikaning asosiy tamoyillari',
    $md$
## Maqsad

Ta’lim tamoyillarini yodlash emas, konkret pedagogik vaziyatda qaysi tamoyil buzilgan yoki to‘g‘ri qo‘llanganini aniqlash.

## Asosiy tamoyillar

**Onglilik va faollik** — o‘quvchi mazmunni tushunib, faol fikrlashi va harakat qilishi kerak.

**Ko‘rgazmalilik** — abstrakt mazmunni model, namuna, sxema, tajriba yoki boshqa mos tasvir orqali tushunishni qo‘llab-quvvatlash.

**Tizimlilik va muntazamlik** — yangi bilim oldingi bilim bilan mantiqiy bog‘lanib, izchil rivojlanadi.

**Ilmiylik** — mazmun ishonchli, asoslangan va fan nuqtai nazaridan to‘g‘ri bo‘lishi kerak.

**Nazariya va amaliyot birligi** — tushuncha real vazifa yoki faoliyatda qo‘llanadi.

**Tushunarlilik va individual yondashuv** — vazifa o‘quvchining rivojlanish darajasiga mos bo‘lib, zarur yordam va differensiallashuvni ko‘zda tutadi.

## Attestatsiya vaziyati

O‘qituvchi formulani tayyor aytib beradi, o‘quvchilar uni takrorlaydi, lekin nima sababdan ishlashini tushuntirmaydi va qo‘llamaydi. Bu holatda ayniqsa onglilik-faollik hamda nazariya-amaliyot birligi zaif.

Bir vaziyat bir nechta tamoyilga tegishli bo‘lishi mumkin. Savolda eng bevosita buzilgan tamoyilni tanlang.

> **Manba izi:** Mavlonova va boshq., Umumiy pedagogika (2018), didaktika va ta’lim tamoyillari bo‘limi; 2026 spetsifikatsiya 2.1.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '15000000-0000-4000-8000-000000000003',
    v_module, 3,
    'tarbiya-va-uning-turlari',
    'Tarbiya va uning turlari',
    $md$
## Maqsad

Tarbiya yo‘nalishlarini farqlash va vaziyatdagi asosiy tarbiyaviy maqsadni aniqlash.

## Tarbiya yo‘nalishlari

Tarbiya yaxlit jarayon bo‘lsa-da, tahlil qilish uchun yo‘nalishlarga ajratiladi:

- **aqliy tarbiya** — fikrlash, bilishga qiziqish va intellektual faoliyat;
- **axloqiy tarbiya** — qadriyat, mas’uliyat va xulq me’yorlari;
- **jismoniy tarbiya** — sog‘lom rivojlanish va jismoniy madaniyat;
- **mehnat tarbiyasi** — mehnatga mas’uliyatli munosabat va amaliy faoliyat;
- **estetik tarbiya** — go‘zallikni idrok etish va ijodiy did;
- **ekologik tarbiya** — tabiat va resurslarga mas’uliyat;
- **huquqiy tarbiya** — huquq va majburiyatlarni anglash;
- **iqtisodiy tarbiya** — resurs, mehnat, tejamkorlik va iqtisodiy qarorlarni tushunish;
- **fuqarolik tarbiyasi** — jamiyat, Vatan va ijtimoiy mas’uliyat.

## Vaziyatni tahlil qilish

Bir faoliyat bir nechta yo‘nalishga xizmat qilishi mumkin. Masalan, maktab hududini obodonlashtirish loyihasi mehnat, ekologik, estetik va jamoaviy mas’uliyatni birlashtiradi. Testda savol qaysi maqsadni markazga qo‘yganiga e’tibor bering.

## Tarbiya metodini tanlash

Tushuntirish, namuna, mashq, jamoaviy faoliyat, rag‘batlantirish va refleksiya vaziyatga qarab qo‘llanadi. Jazoni avtomatik “eng samarali” usul sifatida tanlash pedagogik jihatdan noto‘g‘ri yondashuvdir.

> **Manba izi:** Mavlonova va boshq., Umumiy pedagogika (2018), tarbiya nazariyasi va tarbiya turlari bo‘limlari; 2026 spetsifikatsiya 2.1.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '15000000-0000-4000-8000-000000000004',
    v_module, 4,
    'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
    'Dars turlari, rejalashtirish va sinfni boshqarish',
    $md$
## Maqsad

Dars turini didaktik maqsadga mos tanlash, darsni bosqichli rejalashtirish va sinfni boshqarishda vaziyatga mos qaror chiqarish.

## Dars turi maqsaddan kelib chiqadi

Amaliyotda yangi bilimni o‘zlashtirish, ko‘nikma-malaka shakllantirish, takrorlash-umumlashtirish, nazorat va kombinatsiyalashgan darslar uchraydi. Dars turi nomi emas, uning **yetakchi didaktik vazifasi** muhim.

Darsni rejalashtirishda:
1. natija belgilanadi;
2. avvalgi bilim aniqlanadi;
3. mazmun va faoliyat ketma-ketligi tuziladi;
4. metod va vosita tanlanadi;
5. vaqt taqsimlanadi;
6. baholash dalili rejalashtiriladi.

## Sinfni boshqarish

Sinfni boshqarish faqat intizomni saqlash emas. Aniq qoida, vaqtni boshqarish, vazifani tushunarli berish, o‘tish bosqichlarini rejalash, o‘quvchilarni faol jalb qilish va nizoga konstruktiv javob berish ham uning tarkibidir.

## Vaziyat

Agar guruhli ish shovqinli bo‘lsa, birinchi yechim guruhli ishni butunlay bekor qilish emas. Vazifa aniqligi, rollar, vaqt, natija mezoni va sinf qoidalari qayta ko‘rib chiqiladi.

> **Manba izi:** Mavlonova va boshq., Umumiy pedagogika (2018), dars — ta’limni tashkil etishning asosiy shakli, taxminan 125–135-betlar atrofidagi bo‘lim; 2026 spetsifikatsiya 2.1.
$md$,
    22, 'published'::public.content_status
  ),
  (
    '15000000-0000-4000-8000-000000000005',
    v_module, 5,
    'sinf-rahbari-hujjatlar-jamoa-va-ota-ona',
    'Sinf rahbari: hujjatlar, jamoa va ota-ona bilan hamkorlik',
    $md$
## Maqsad

Sinf rahbarining vazifalarini, hujjat yuritishdagi izchillikni, sinf jamoasini shakllantirish va ota-onalar bilan hamkorlikni pedagogik vaziyatda qo‘llash.

## Sinf rahbarining roli

Sinf rahbari o‘quvchi, fan o‘qituvchilari, maktab va oila o‘rtasida muvofiqlashtiruvchi rol bajaradi. U tarbiyaviy ishni rejalashtiradi, sinf jamoasining rivojlanishini kuzatadi, muammolarni erta aniqlaydi va zarur hamkorlikni tashkil qiladi.

## Hujjat bilan ishlash

Hujjatni yuritishning maqsadi qog‘oz to‘ldirish emas, ta’lim-tarbiya jarayonini tartibli qayd etish va qaror uchun dalil yaratishdir. Yozuvlar aniq, o‘z vaqtida va maxfiylik talablariga mos bo‘lishi kerak.

## Ota-onalar bilan hamkorlik

Samarali hamkorlik:
- faqat muammo chiqqanda emas, muntazam bo‘ladi;
- ayblashga emas, dalil va yechimga tayanadi;
- o‘quvchi manfaatini markazga qo‘yadi;
- maxfiy ma’lumotni ehtiyotsiz tarqatmaydi;
- ota-onaning fikrini tinglaydi va kelishilgan keyingi qadamni belgilaydi.

## Muammoli vaziyat

Ikki o‘quvchi o‘rtasidagi nizoda sinf rahbari faqat bir tomonning gapiga asoslanib jazo bermaydi. Vaziyatni aniqlaydi, tomonlarni tinglaydi, xavfsizlikni ta’minlaydi, zarur bo‘lsa ota-ona va mutaxassislarni jalb qiladi hamda tiklovchi yechim izlaydi.

> **Manba izi:** Mavlonova va boshq., Umumiy pedagogika (2018), maktabshunoslik va tarbiyaviy ishlarni tashkil etish bo‘limlari; 2026 spetsifikatsiya 2.1.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '15000000-0000-4000-8000-000000000006',
    v_module, 6,
    'pedagogik-etika-nutq-texnika-va-takt',
    'Pedagogik etika, nutq, texnika va takt',
    $md$
## Maqsad

Pedagogik etika, pedagogik takt, pedagogik texnika, nutq va muloqot madaniyatini bir-biridan farqlash.

## Pedagogik etika va takt

**Pedagogik etika** kasbiy xulqning axloqiy me’yorlarini belgilaydi: hurmat, adolat, mas’uliyat, maxfiylik va o‘quvchi qadr-qimmatini saqlash.

**Pedagogik takt** shu tamoyillarni konkret muloqot vaziyatida me’yor va nazokat bilan qo‘llashdir. Talabchanlik va hurmat bir-biriga zid emas.

## Pedagogik texnika

Pedagogik texnika o‘qituvchining kasbiy ta’sirni samarali tashkil etishiga xizmat qiladigan amaliy ko‘nikmalar majmuasidir. Bunga diqqatni boshqarish, ovoz, mimika, pantomimika, jest, nutq sur’ati va o‘z hissiy holatini boshqarish kabi jihatlar kiradi.

## Nutq madaniyati

Pedagog nutqi tushunarli, mantiqiy, adabiy me’yorlarga mos va auditoriyaga mos bo‘lishi kerak. Juda baland ovoz yoki ko‘p gapirishning o‘zi ta’sirchan nutq degani emas.

## Refleksiya va kasbiy o‘sish

Pedagogik mahorat tayyor holat emas. O‘qituvchi dars dalillarini tahlil qilib, kuchli va zaif tomonlarini aniqlaydi va keyingi rivojlanish maqsadini belgilaydi.

> **Manba izi:** Tolipov, Ro‘ziyeva, Pedagogik texnologiyalar va pedagogik mahorat (2019), PDF 212–244; 2026 spetsifikatsiya 2.1.
$md$,
    22, 'published'::public.content_status
  ),
  (
    '15000000-0000-4000-8000-000000000007',
    v_module, 7,
    'pedagogik-qobiliyat-va-uning-turlari',
    'Pedagogik qobiliyat va uning turlari',
    $md$
## Maqsad

Pedagogik qobiliyatlarning asosiy turlarini vaziyat belgilari orqali ajratish.

## Qobiliyatlar

**Didaktik qobiliyat** — murakkab mazmunni o‘quvchiga tushunarli va o‘zlashtiriladigan shaklga keltirish.

**Akademik qobiliyat** — o‘qitilayotgan fan mazmunini chuqur bilish va yangiliklarni kuzatish.

**Perseptiv-pedagogik qobiliyat** — o‘quvchining ichki holati, qiyinchiligi va ehtiyojini nozik belgilar orqali anglash.

**Nutq qobiliyati** — fikrni aniq, ifodali va ta’sirchan yetkazish.

**Tashkilotchilik qobiliyati** — jamoa faoliyatini maqsadli uyushtirish.

**Kommunikativ qobiliyat** — o‘quvchi va boshqa ishtirokchilar bilan samarali aloqa o‘rnatish.

**Avtoritar ta’sir qobiliyati** — talab va irodani pedagogik jihatdan asosli tarzda namoyon qilish; bu qo‘pollik yoki bosim bilan teng emas.

## Vaziyatni aniqlash

O‘qituvchi o‘quvchining javobidagi ikkilanish va xatti-harakatidan tushunmovchilikni sezib, savolni boshqacha beradi. Bu vaziyatda perseptiv qobiliyat yetakchi, keyingi harakatda didaktik qobiliyat ham ishga tushadi.

> **Manba izi:** Tolipov, Ro‘ziyeva (2019), pedagogik mahorat va qobiliyat bo‘limlari, PDF 213 va 256–261; 2026 spetsifikatsiya 2.1.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '15000000-0000-4000-8000-000000000008',
    v_module, 8,
    'talim-texnologiyalari-va-vaziyatga-mos-tanlov',
    'Ta’lim texnologiyalari va vaziyatga mos tanlov',
    $md$
## Maqsad

Asosiy ta’lim texnologiyalarini farqlash va maqsad hamda o‘quvchi ehtiyojiga mosini tanlash.

## Texnologiyani nomidan emas, vazifasidan tanlang

**Loyihaga asoslangan ta’lim** — mazmunli mahsulot yoki yechim yaratish uchun davomli izlanish va rejalashtirish.

**Muammoli ta’lim** — tayyor javobdan oldin muammo yoki ziddiyatli vaziyatni qo‘yib, yechimni fikrlash orqali topish.

**Hamkorlikdagi ta’lim** — umumiy natija uchun o‘zaro bog‘liq rollar va mas’uliyat bilan ishlash.

**Evristik ta’lim** — yo‘naltiruvchi savol va izlanish orqali yangi xulosaga kelish.

**Shaxsga yo‘naltirilgan ta’lim** — o‘quvchining ehtiyoji, qiziqishi va individual rivojlanishini markazga qo‘yish.

**Interfaol ta’lim** — faol o‘zaro ta’sir, fikr almashish va birgalikdagi ma’no qurishga tayanish.

**Differensial ta’lim** — vazifa, yordam, sur’at yoki murakkablikni o‘quvchi ehtiyojiga moslashtirish.

**Integrallashgan ta’lim** — mazmun va kompetensiyalarni fanlar yoki mavzulararo bog‘lash.

**O‘yinli ta’lim** — maqsadli o‘yin mexanikasi orqali faoliyat va motivatsiyani tashkil etish.

**Inklyuziv ta’lim** — turli ehtiyojli o‘quvchilar uchun mazmunli va teng ishtirok sharoitini yaratish.

## Attestatsiya tuzog‘i

Texnologiya “zamonaviy” bo‘lgani uchun emas, vazifaga mos bo‘lgani uchun tanlanadi. Masalan, qisqa faktni eslab qolish uchun katta loyiha majburiy emas; murakkab real muammoni yechish uchun esa faqat ma’ruza yetarli bo‘lmasligi mumkin.

> **Manba izi:** Tolipov, Ro‘ziyeva (2019), pedagogik texnologiya asoslari va interfaol ta’lim bo‘limlari, PDF 5–8 va 149-betdan boshlab; Mavlonova va boshq. (2018), didaktika bo‘limi; 2026 spetsifikatsiya 2.1.
$md$,
    24, 'published'::public.content_status
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
      'pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi',
      'pedagogikaning-asosiy-tamoyillari',
      'tarbiya-va-uning-turlari',
      'dars-turlari-rejalashtirish-va-sinfni-boshqarish',
      'sinf-rahbari-hujjatlar-jamoa-va-ota-ona',
      'pedagogik-etika-nutq-texnika-va-takt',
      'pedagogik-qobiliyat-va-uning-turlari',
      'talim-texnologiyalari-va-vaziyatga-mos-tanlov'
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi', 'PM.GEN.01'),
      ('pedagogikaning-asosiy-tamoyillari', 'PM.GEN.02'),
      ('tarbiya-va-uning-turlari', 'PM.GEN.03'),
      ('dars-turlari-rejalashtirish-va-sinfni-boshqarish', 'PM.GEN.04'),
      ('sinf-rahbari-hujjatlar-jamoa-va-ota-ona', 'PM.GEN.05'),
      ('pedagogik-etika-nutq-texnika-va-takt', 'PM.GEN.06'),
      ('pedagogik-qobiliyat-va-uning-turlari', 'PM.GEN.07'),
      ('talim-texnologiyalari-va-vaziyatga-mos-tanlov', 'PM.GEN.08')
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
