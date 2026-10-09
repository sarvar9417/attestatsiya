-- TASK-047: M09 source-backed database lessons.
--
-- Sources summarized in original wording:
--   * ICT 11-sinf (2021), lessons 1-9, especially pp. 4-65.
--   * 10-11-sinf Informatika va axborot texnologiyalari (Cambridge+),
--     chapter 9 "Ma'lumotlar bazasi va fayl konsepsiyalari", pp. 143-183.
--
-- The migration adds one published lesson per active S4.DB construct and
-- preserves source trace inside body_mdx. It does not copy textbook passages.

begin;

do $$
declare
  v_module uuid;
begin
  select id into strict v_module
  from public.modules
  where code = 'M09';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '90000000-0000-4000-8000-000000000001',
    v_module,
    1,
    'malumotlar-bazasi-va-mbbt-asoslari',
    'Ma’lumotlar bazasi va MBBT asoslari',
    $md$
## Maqsad

Ma’lumotlar bazasi, MBBT, relyatsion model va SQLning vazifasini bir-biridan farqlash.

## Asosiy tushunchalar

**Ma’lumotlar bazasi** — ma’lumotlarni tartibli saqlash, topish, tahlil qilish va boshqarishga mo‘ljallangan tuzilmali to‘plam. **MBBT** esa bazani yaratish va boshqarishni ta’minlaydigan dasturiy vosita.

Relyatsion modelda ma’lumotlar jadvallarda saqlanadi. Jadval **maydonlar** (ustunlar) va **yozuvlar** (qatorlar)dan tashkil topadi. Bir nechta jadval o‘zaro mantiqiy bog‘lanishi mumkin.

**SQL** (Structured Query Language) relyatsion ma’lumotlar bazasidagi ma’lumotlarga so‘rov berish va ular bilan ishlash uchun qo‘llanadigan til. SQLni MBBTning o‘zi bilan adashtirmang: masalan, Microsoft Access, MySQL va PostgreSQL — MBBTlar; SQL esa so‘rov tili.

## Attestatsiya uchun farqlash

- ma’lumotlar bazasi ≠ MBBT;
- jadval ≠ butun ma’lumotlar bazasi;
- relyatsion modelda bog‘lanishlar jadvallar orasida quriladi;
- shaxsiy baza va server bazasi foydalanish ko‘lami bilan farqlanadi.

## Tekshiruv

Maktab kutubxonasi uchun Kitob, O‘quvchi va Ijara jadvallari kerak bo‘lsa, nima uchun bitta katta jadvaldan ko‘ra bog‘langan jadvallar ma’qulroq ekanini izohlay oling.

> **Manba izi:** ICT 11-sinf (2021), 1–2-darslar, PDF 4–13; Cambridge+ 10–11-sinf, 9-bob, PDF 143–151.
$md$,
    18,
    'published'::public.content_status
  ),
  (
    '90000000-0000-4000-8000-000000000002',
    v_module,
    2,
    'access-jadval-va-malumot-kiritish',
    'MS Access: jadval yaratish va ma’lumot kiritish',
    $md$
## Maqsad

Jadval tuzilmasini rejalashtirish, maydon nomi va ma’lumot turini to‘g‘ri tanlash hamda ma’lumot kiritish shaklining vazifasini tushunish.

## Jadvalni loyihalash

Har bir maydon bitta aniq xususiyatni saqlashi kerak. Ma’lumot turi qiymatning qanday saqlanishini belgilaydi. Masalan, telefon raqami ustida arifmetik amal bajarilmaydi, shuning uchun raqamlar qatnashsa ham u ko‘pincha matn sifatida saqlanadi.

Yaxshi jadvalda:
- maydon nomlari mazmunli bo‘ladi;
- ma’lumot turi vazifaga mos tanlanadi;
- takroriy va keraksiz ma’lumot kamaytiriladi;
- yozuvlarni noyob ajratish uchun kalit rejalashtiriladi.

## Forma nima uchun kerak?

Forma ma’lumot kiritishni va mavjud yozuvlarni ko‘rishni qulaylashtiradi. Interfeys o‘qilishi oson, izchil va foydalanuvchiga tushunarli bo‘lishi kerak. Forma jadvalning o‘rnini bosmaydi; u jadvaldagi ma’lumot bilan ishlash uchun interfeysdir.

## Xatoni oldini olish

Maydon turi va kiritish qoidalari noto‘g‘ri qiymatlarni kamaytiradi. Ammo validatsiya qiymatning haqiqatan to‘g‘ri ekanini kafolatlamaydi — u faqat belgilangan qoidalarga mosligini tekshiradi.

> **Manba izi:** ICT 11-sinf (2021), 3–6-darslar, PDF 15–43; Cambridge+ 10–11-sinf, 9-bob, PDF 143–165.
$md$,
    20,
    'published'::public.content_status
  ),
  (
    '90000000-0000-4000-8000-000000000003',
    v_module,
    3,
    'kalitlar-va-jadvallarni-boglash',
    'Birlamchi va tashqi kalitlar, jadvallarni bog‘lash',
    $md$
## Maqsad

Birlamchi, murakkab va tashqi kalitlarni ajratish hamda jadvallar orasidagi munosabatni tahlil qilish.

## Birlamchi kalit

**Birlamchi kalit** jadvaldagi har bir yozuvni noyob aniqlaydi. Barqaror va takrorlanmaydigan alohida ID maydoni ko‘p holatda qulay tanlovdir.

**Murakkab kalit** noyob identifikator hosil qilish uchun ikki yoki undan ortiq maydonning kombinatsiyasidan foydalanadi.

## Tashqi kalit

**Tashqi kalit** boshqa jadvaldagi birlamchi kalitga murojaat qiladigan maydon. U ikki jadval orasidagi bog‘lanishni hosil qiladi. Bog‘lanayotgan kalitlarning ma’lumot turi mos bo‘lishi zarur.

Misol:
- Oquvchi(OquvchiID, Ism, ...)
- Ijara(IjaraID, OquvchiID, KitobID, Sana)

Bu yerda Ijara.OquvchiID — Oquvchi.OquvchiIDga murojaat qiluvchi tashqi kalit.

## Havolali butunlik

Havolali butunlik bog‘langan ma’lumotlarning mantiqiy mosligini saqlashga yordam beradi. Masalan, mavjud bo‘lmagan o‘quvchiga ijara yozuvini bog‘lashga yo‘l qo‘ymaslik kerak.

## Attestatsiya tuzog‘i

“Qiymat takrorlanmaydi” degan xususiyatning o‘zi har doim aynan shu maydonni eng yaxshi birlamchi kalit qiladi degani emas. Kalitning barqarorligi va munosabatlarda foydalanilishi ham hisobga olinadi.

> **Manba izi:** ICT 11-sinf (2021), 5-dars, PDF 30–36; Cambridge+ 10–11-sinf, 9-bob, PDF 153–155.
$md$,
    20,
    'published'::public.content_status
  ),
  (
    '90000000-0000-4000-8000-000000000004',
    v_module,
    4,
    'sorovlar-yaratish',
    'So‘rovlar yaratish va mezonlar bilan tanlash',
    $md$
## Maqsad

So‘rovning vazifasini tushunish va berilgan shartga mos yozuvlarni tanlash mantig‘ini qo‘llash.

## So‘rov nima?

**So‘rov** ma’lumotlar bazasidan kerakli yozuv va maydonlarni ma’lum mezon asosida olish vositasidir. So‘rov manba jadvaldagi barcha ma’lumotni ko‘rsatishi shart emas; faqat talabga mos qismini ajratishi mumkin.

So‘rov tuzishda uch savolni aniqlang:
1. qaysi jadval yoki jadvallar kerak?
2. qaysi maydonlar natijada ko‘rinadi?
3. qanday mezon yozuvni natijaga kiritadi?

## Oddiy va parametrli so‘rov

Oddiy so‘rovda mezon oldindan belgilanadi. Parametrli so‘rovda esa foydalanuvchi ishga tushirish vaqtida kerakli qiymatni kiritishi mumkin. Bu bir xil so‘rovni turli qiymatlar bilan qayta ishlatish imkonini beradi.

## Saralash va tanlashni farqlang

**Saralash** yozuvlarning tartibini o‘zgartiradi. **Mezon bilan tanlash** esa natijaga qaysi yozuvlar kirishini belgilaydi. Test savollarida bu ikkisini aralashtirmang.

## Misol

“2026-yilda ro‘yxatdan o‘tgan va Navoiyda yashaydigan o‘quvchilar” so‘rovida kamida ikki shart mavjud. Har bir shart qaysi maydonga tegishli ekanini alohida aniqlang.

> **Manba izi:** ICT 11-sinf (2021), 7-dars, PDF 44–52; Cambridge+ 10–11-sinf, 9-bob, PDF 158–163.
$md$,
    18,
    'published'::public.content_status
  ),
  (
    '90000000-0000-4000-8000-000000000005',
    v_module,
    5,
    'murakkab-sorovlar-va-natijani-tahlil-qilish',
    'Murakkab so‘rovlar va natijani tahlil qilish',
    $md$
## Maqsad

Bir nechta shart, bir nechta jadval yoki umumlashtirish talab qiladigan so‘rovni bosqichlarga ajratib tahlil qilish.

## Murakkab so‘rovni yechish strategiyasi

Murakkab vazifada avval talabni kichik qismlarga bo‘ling:
1. kerakli jadvallarni aniqlang;
2. jadvallar qanday kalitlar bilan bog‘langanini tekshiring;
3. natijada kerak bo‘ladigan maydonlarni tanlang;
4. har bir mezonni tegishli maydonga qo‘llang;
5. kerak bo‘lsa guruhlash, sanash yoki boshqa umumlashtirish natijasini tekshiring.

Ichki so‘rov murakkab vazifani alohida bosqichlarga ajratishga yordam berishi mumkin. Jadvallararo so‘rov esa bog‘langan jadvallardan ma’lumotni birlashtiradi.

## Jadvallararo vaziyat

Agar Mijoz, Buyurtma va Mahsulot alohida jadvallarda bo‘lsa, “ma’lum hududdagi mijozlar sotib olgan mahsulotlar” savoli bitta jadval bilan yechilmasligi mumkin. Avval munosabatlar zanjirini toping, keyin mezonni qo‘llang.

## Natijani tekshirish

Murakkab so‘rovning natijasini faqat satrlar soni bilan baholamang. Tanlangan maydonlar, bog‘lanishlar va mezonlar masala shartiga mos ekanini tekshiring.

> **Manba izi:** Cambridge+ 10–11-sinf, 9-bob, PDF 161–169 va 182–183; ICT 11-sinf (2021), 7–8-darslar, PDF 44–58.
$md$,
    22,
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
      'malumotlar-bazasi-va-mbbt-asoslari',
      'access-jadval-va-malumot-kiritish',
      'kalitlar-va-jadvallarni-boglash',
      'sorovlar-yaratish',
      'murakkab-sorovlar-va-natijani-tahlil-qilish'
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('malumotlar-bazasi-va-mbbt-asoslari', 'S4.DB.01'),
      ('access-jadval-va-malumot-kiritish', 'S4.DB.02'),
      ('kalitlar-va-jadvallarni-boglash', 'S4.DB.03'),
      ('sorovlar-yaratish', 'S4.DB.04'),
      ('murakkab-sorovlar-va-natijani-tahlil-qilish', 'S4.DB.05')
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
