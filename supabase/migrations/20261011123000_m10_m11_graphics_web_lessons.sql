-- TASK-055: M10/M11 source-backed graphics and web lessons.
--
-- Sources synthesized in original wording:
--   * ICT 7-sinf (2021): computer graphics, raster/vector, graphic editors,
--     Photoshop, HTML text/list/image/table/form topics.
--   * Cambridge+ 8-sinf: HTML page structure and browser rendering.
--   * Cambridge+ 9-sinf: CSS inline/internal/external styles and selectors.
--   * Axborot va axborot jarayonlari professional bank/theory: raster/vector,
--     pixel, RGB/CMYK and image representation distinctions.
--
-- Adds one published lesson per active S5.WEB construct. Text is paraphrased;
-- no textbook passage is copied.

begin;

do $$
declare
  v_m10 uuid;
  v_m11 uuid;
begin
  select id into strict v_m10 from public.modules where code = 'M10';
  select id into strict v_m11 from public.modules where code = 'M11';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    'a1000000-0000-4000-8000-000000000001', v_m10, 1,
    'kompyuter-grafikasi-turlari',
    'Kompyuter grafikasi turlari',
    $md$
## Maqsad

Rastr, vektor, fraktal va uch o‘lchovli grafikani asosiy tasvirlash modeli hamda qo‘llanish vaziyatiga ko‘ra farqlash.

## Asosiy tushuncha

**Kompyuter grafikasi** — grafik axborotni kompyuter yordamida yaratish, saqlash, tahrirlash va namoyish etish bilan bog‘liq usullar majmui. Turli grafik modellar tasvirni turlicha ifodalaydi, shuning uchun ularning sifat, o‘lcham va tahrirlash xususiyatlari ham bir xil emas.

**Rastr grafika** tasvirni piksellar to‘ri sifatida saqlaydi. Fotosurat kabi rang o‘tishlari ko‘p bo‘lgan tasvirlarda qulay, lekin rasm kattalashtirilganda alohida piksellar ko‘rina boshlashi mumkin.

**Vektor grafika** tasvirni chiziq, egri chiziq, shakl va boshqa geometrik obyektlarning matematik tavsifi bilan ifodalaydi. Logotip va sxemalarda o‘lchamni kattalashtirishda qirralar silliq qolishi muhim afzallikdir.

**Fraktal grafika** tasvirni matematik qoidalar va takrorlanuvchi tuzilmalar orqali hosil qiladi. **3D grafika** esa obyektni uch o‘lchovli fazoda modellashtirishga qaratilgan.

## Test strategiyasi

Vaziyatda “piksel”, “geometrik obyekt”, “formula” yoki “uch o‘lchov” kabi kalit belgilarni toping. Tasvirning qanday saqlanishi bilan uni qaysi dasturda ochish mumkinligini aralashtirmang.

> **Manba izi:** ICT 7-sinf (2021), kompyuter grafikasi mavzulari, PDF 40–47; Axborot va axborot jarayonlari, grafik axborotni kodlash bo‘limi.
$md$,
    18, 'published'::public.content_status
  ),
  (
    'a1000000-0000-4000-8000-000000000002', v_m10, 2,
    'rastr-vektor-amallari',
    'Rastr va vektor tasvirlar ustida amallar',
    $md$
## Maqsad

Rastr va vektor tasvirlarni tahrirlashda obyekt va piksel darajasidagi amallarni farqlash, masshtablash natijasini oldindan aytish.

## Rastr bilan ishlash

Rastr tasvirda tahrir piksel qiymatlariga ta’sir qiladi. Kesish, o‘lchamni o‘zgartirish, rang va yorqinlikni tuzatish, ma’lum hududni belgilash kabi amallar ko‘p uchraydi. Tasvir o‘lchami piksel soni bilan bog‘liq; rang chuqurligi esa bitta piksel rangini ifodalash uchun qancha bit ishlatilishini bildiradi.

Rastrni haddan tashqari kattalashtirishda yangi tafsilot paydo bo‘lmaydi. Mavjud piksellar kattalashgani uchun tasvir “katakli” ko‘rinishi mumkin. Shu sabab ekran o‘lchami, piksel o‘lchamlari va PPI tushunchalarini bir-biridan ajratish kerak.

## Vektor bilan ishlash

Vektor tasvirda alohida obyektlar tanlanadi, ko‘chiriladi, aylantiriladi, kattalashtiriladi yoki ularning kontur/rang xususiyatlari o‘zgartiriladi. Obyekt matematik tavsif bilan saqlangani uchun masshtablash odatda sifat yo‘qotmasdan bajariladi.

## Attestatsiya uchun farq

Fotosuratni piksel bo‘yicha tahrirlash — rastrga xos. Logotipdagi doira yoki egri chiziqni alohida obyekt sifatida o‘zgartirish — vektorga xos. “Kattalashtirish” so‘zining o‘zi yetarli emas; kattalashtirganda sifat qanday o‘zgarayotganiga qarang.

> **Manba izi:** ICT 7-sinf (2021), grafik axborot va grafik muharrirlar, PDF 29–57; Cambridge+ 8-sinf, rastr va vektor grafika bo‘limlari.
$md$,
    19, 'published'::public.content_status
  ),
  (
    'a1000000-0000-4000-8000-000000000003', v_m10, 3,
    'paint-va-photoshop-asoslari',
    'MS Paint va Adobe Photoshop: asosiy amallar',
    $md$
## Maqsad

Grafik muharrirning vazifasini tushunish va Paint hamda Photoshopdagi asosiy tahrirlash amallarini vaziyatga mos tanlash.

## Grafik muharrir

Grafik muharrir tasvir yaratish va o‘zgartirish uchun mo‘ljallangan dasturdir. Sodda muharrirlar chizish, bo‘yash, shakl va matn qo‘shish kabi bazaviy vazifalarni bajaradi. Kengroq imkoniyatli muharrirlar esa qatlam, murakkab belgilash, rangni tuzatish va kompozitsiyani boshqarish vositalarini beradi.

## Paint

Paint kabi sodda rastr muharririda qalam, cho‘tka, shakllar, rang bilan to‘ldirish, o‘chirg‘ich, matn va tanlash vositalari ishlatiladi. Belgilangan qismni ko‘chirish yoki nusxalashda tanlash chegarasi aynan qaysi piksellar bilan ishlanishini belgilaydi.

## Photoshop

Photoshopda **qatlamlar** obyekt va elementlarni bir-biridan mustaqil boshqarishga yordam beradi. Yuqoridagi qatlam pastdagi elementni qoplashi mumkin; qatlam tartibi yakuniy tasvirga ta’sir qiladi. Selection, crop, transform va matn vositalari turli tahrirlash maqsadlariga xizmat qiladi.

## Xato variantni aniqlash

“Qatlam” bilan “fayl formati” bir tushuncha emas. Crop tasvirning keraksiz chetini olib tashlaydi; resize esa tasvir o‘lchamlarini o‘zgartiradi. Testda amal nomini vaziyatdagi maqsad bilan bog‘lang.

> **Manba izi:** ICT 7-sinf (2021), grafik muharrirlar va Adobe Photoshop, PDF 47–79; ICT 5-sinf (2020), grafik muharrirlar bo‘limi, PDF 67–84.
$md$,
    20, 'published'::public.content_status
  ),
  (
    'b1100000-0000-4000-8000-000000000001', v_m11, 1,
    'html-matn-rasm-royxat',
    'HTML: matn, rasm va ro‘yxatlar',
    $md$
## Maqsad

HTML hujjatining vazifasini tushunish, matn, rasm va ro‘yxat elementlarini to‘g‘ri tanlash hamda teglarning tuzilishini tahlil qilish.

## HTML nima?

**HTML (HyperText Markup Language)** veb-sahifa tarkibi va tuzilishini belgilash uchun ishlatiladi. Brauzer HTML manba kodini o‘qib, elementlarni foydalanuvchiga sahifa ko‘rinishida namoyish etadi. HTMLni sahifaning tashqi bezagi bilan tenglashtirmang: ko‘rinishning katta qismi CSS orqali boshqarilishi mumkin.

Ko‘p elementlarda ochuvchi va yopuvchi teg mavjud. Elementlar ichma-ich joylashganda teglar mantiqiy tartibda yopilishi kerak. Sarlavha uchun heading elementlari, abzats uchun paragraph elementi ishlatiladi.

## Rasm va ro‘yxat

Rasm joylashtirishda manba manzili kerak bo‘ladi; foydalanuvchi rasmni ko‘ra olmagan holat uchun mazmunli alternativ matn accessibility uchun muhim. Tartiblangan ro‘yxat va tartiblanmagan ro‘yxat vazifasi bilan farqlanadi: biri ketma-ketlikni, ikkinchisi oddiy punktlar to‘plamini ifodalaydi.

## Tahlil usuli

Kod fragmentida avval sahifa tuzilmasini, keyin har bir elementning vazifasini aniqlang. Teg nomini yodlashdan ko‘ra, “qaysi ma’lumotni qanday semantik element bilan ifodalash kerak?” savoliga javob bering.

> **Manba izi:** ICT 7-sinf (2021), HTML asoslari, matn, ro‘yxat va rasm mavzulari, PDF 106–127; Cambridge+ 8-sinf, HTML va veb-sahifa yaratish bo‘limi.
$md$,
    20, 'published'::public.content_status
  ),
  (
    'b1100000-0000-4000-8000-000000000002', v_m11, 2,
    'html-jadval-va-forma',
    'HTML: jadval va forma elementlari',
    $md$
## Maqsad

Jadvalli ma’lumotni HTML jadvali bilan ifodalash va foydalanuvchi ma’lumotini qabul qilish uchun forma elementlarini vaziyatga mos tanlash.

## HTML jadvali

Jadval qatorlar va kataklardan tashkil topadi. Sarlavha katagi bilan oddiy ma’lumot katagining semantik vazifasi farq qiladi. Jadvalni faqat sahifa dizaynini joylashtirish uchun ishlatishdan ko‘ra, haqiqiy jadvalli ma’lumotni ifodalash uchun qo‘llash to‘g‘riroq yondashuvdir.

Jadval kodini tahlil qilganda:
1. nechta qator borligini aniqlang;
2. har qatordagi kataklarni sanang;
3. sarlavha va ma’lumot kataklarini farqlang;
4. birlashtirilgan kataklar bo‘lsa qator/ustun tuzilishini qayta hisoblang.

## Forma

Forma foydalanuvchidan ma’lumot olish uchun ishlatiladi. Matn maydoni, tanlash elementlari, radio tugma, belgilash katagi va yuborish tugmasi turli vazifalarni bajaradi. Radio tugmalar odatda bir guruhdan bitta tanlovga, checkbox esa bir nechta mustaqil tanlovga mos keladi.

**label** elementidan foydalanish forma boshqaruvini foydalanuvchiga tushunarli qiladi va accessibilityni yaxshilaydi. Forma ma’lumotini qabul qilish bilan uni serverda ishonchli tekshirish bir xil narsa emas; kiritilgan qiymat alohida validatsiya qilinishi kerak.

> **Manba izi:** ICT 7-sinf (2021), HTML jadval va formalar, PDF 128–144; Cambridge+ 8-sinf, HTML elementlari va veb-sahifa tuzilishi.
$md$,
    21, 'published'::public.content_status
  ),
  (
    'b1100000-0000-4000-8000-000000000003', v_m11, 3,
    'css-stillarini-qollash',
    'CSS stillarini HTML elementlariga qo‘llash',
    $md$
## Maqsad

CSS qoidasi tuzilishini, selector va declaration vazifasini tushunish hamda inline, internal va external usullarni farqlash.

## CSS qoidasi

**CSS (Cascading Style Sheets)** HTML elementlarining ko‘rinishini boshqaradi. CSS qoidasi odatda **selector** va deklaratsiya blokidan iborat. Selector qaysi elementlarga stil qo‘llanishini ko‘rsatadi; deklaratsiyada esa property va value juftligi yoziladi.

Masalan, matn rangi, fon, shrift o‘lchami, chegaralar yoki joylashuv xususiyatlari CSS bilan belgilanadi. HTML mazmun va tuzilmani, CSS esa taqdimot qatlamini boshqarishi — testlarda muhim farq.

## CSSni ulash usullari

**Inline** stil bevosita bitta elementga yoziladi. **Internal** stil HTML hujjatining head qismidagi style elementi ichida joylashadi. **External** stil alohida .css faylda saqlanib, HTMLga link elementi orqali ulanadi.

Bir nechta sahifa umumiy dizayndan foydalansa, external CSS takrorlanishni kamaytiradi va markazlashgan o‘zgartirish imkonini beradi. Kaskad qoidalari bir elementga bir nechta stil ta’sir qilganda qaysi deklaratsiya ustun kelishini aniqlaydi.

## Tekshiruv

Kodda avval selectorni toping, keyin property va value’ni ajrating. “Qaysi element o‘zgaradi?” va “qaysi xususiyat o‘zgaradi?” savollarini alohida yeching.

> **Manba izi:** Cambridge+ 9-sinf, CSS inline/internal/external uslublari va CSS qoidalari, PDF 286–293; ICT 7-sinf (2021), veb-texnologiya bo‘limi.
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
      (l.module_id = v_m10 and l.slug in (
        'kompyuter-grafikasi-turlari','rastr-vektor-amallari','paint-va-photoshop-asoslari'
      ))
      or
      (l.module_id = v_m11 and l.slug in (
        'html-matn-rasm-royxat','html-jadval-va-forma','css-stillarini-qollash'
      ))
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('M10','kompyuter-grafikasi-turlari','S5.WEB.01'),
      ('M10','rastr-vektor-amallari','S5.WEB.02'),
      ('M10','paint-va-photoshop-asoslari','S5.WEB.03'),
      ('M11','html-matn-rasm-royxat','S5.WEB.04'),
      ('M11','html-jadval-va-forma','S5.WEB.05'),
      ('M11','css-stillarini-qollash','S5.WEB.06')
  ) as mapping(module_code, slug, construct_code)
  join public.modules m on m.code = mapping.module_code
  join public.lessons l on l.module_id = m.id and l.slug = mapping.slug
  join public.constructs c on c.code = mapping.construct_code and c.is_active
  on conflict do nothing;
end
$$;

commit;
