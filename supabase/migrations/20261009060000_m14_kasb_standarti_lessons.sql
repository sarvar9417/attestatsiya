-- TASK-048: M14 source-backed professional-standard lessons.
--
-- Authoritative source:
-- Pedagogik mahorat va xalqaro baholash ilmiy-amaliy markazi,
-- "Maktab pedagoglari - Kasb standarti (O'zbek tili)", 17 pages.
-- Content below is an original synthesis; source text is not copied verbatim.

begin;

do $$
declare
  v_module uuid;
begin
  select id into strict v_module
  from public.modules
  where code = 'M14';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '14000000-0000-4000-8000-000000000001',
    v_module, 1,
    'oquv-jarayonini-rejalashtirish',
    'O‘quv jarayonini rejalashtirish',
    $md$
## Maqsad

Kasb standartidagi A/01.6 vazifasini tushunish va darsni maqsad, o‘quvchi ehtiyoji, baholash natijasi hamda ta’lim standarti bilan bog‘liq holda rejalashtirish.

## Rejalashtirishning mantiqi

O‘qituvchi reja tuzishni mavzu nomidan emas, **kutiladigan natija**dan boshlaydi. Natija aniq va tekshiriladigan bo‘lishi, o‘quv dasturi va davlat ta’lim standartiga mos kelishi kerak. Keyin o‘quvchilarning avvalgi bilimlari, ehtiyojlari, qiziqishlari va yosh xususiyatlari hisobga olinadi.

Reja quyidagi zanjirni saqlaydi:

1. kutiladigan natijani aniqlash;
2. boshlang‘ich holatni baholash;
3. mos shakl, usul va vositalarni tanlash;
4. vaqtni bosqichlarga taqsimlash;
5. o‘quv va tarqatma materiallarni rejalashtirish;
6. zarur AKT vositalarini integratsiya qilish;
7. natijani qanday tekshirishni oldindan belgilash.

Fanlararo bog‘lanish ham rejalashtirishning bir qismidir. U shunchaki boshqa fan nomini tilga olish emas, balki mazmun va kompetensiyalar o‘rtasidagi haqiqiy aloqani ko‘rsatishi kerak.

## Attestatsiya vaziyati

Agar avvalgi baholash natijasi sinfning bir qismi tayanch bilimni egallamaganini ko‘rsatsa, eski rejani o‘zgartirmasdan davom etish to‘g‘ri emas. O‘qituvchi rejaning sur’ati, usuli yoki tayanch topshiriqlarini natijalarga moslashtiradi.

> **Manba izi:** “Umumiy o‘rta ta’lim maktab o‘qituvchisi” kasb standarti, A/01.6, PDF 4–5.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '14000000-0000-4000-8000-000000000002',
    v_module, 2,
    'talim-samaradorligini-taminlash',
    'Ta’lim samaradorligini ta’minlash',
    $md$
## Maqsad

Kasb standartidagi A/02.6 vazifasiga muvofiq dars jarayonini samarali tashkil etish, faol o‘qitish, individual ehtiyoj va refleksiyani uyg‘unlashtirish.

## Samaradorlik nimadan iborat?

Samarali dars faqat mavzuni “o‘tib bo‘lish” bilan o‘lchanmaydi. O‘quvchi erishishi kerak bo‘lgan natija, unga mos faoliyat va baholash bir-biriga mos bo‘lishi zarur.

O‘qituvchi:
- erishimli vazifalar belgilaydi;
- mavzuga mos namoyish va tarqatmalardan foydalanadi;
- dars vaqtini oqilona boshqaradi;
- faol va interfaol usullarni maqsadga mos tanlaydi;
- jamoaviy va loyihaviy ishlarni tashkil etadi;
- mustaqil fikrlash, muammo yechish va refleksiyani qo‘llab-quvvatlaydi;
- individual ta’lim ehtiyojlarini hisobga oladi;
- mavzuni amaliy hayot bilan bog‘laydi.

## Metakognitiv yondashuv

O‘quvchi “men nimani bildim, qanday bildim, qayerda qiynaldim va keyingi qadamim nima?” degan savollarga javob bera olishi kerak. Refleksiya va o‘z-o‘zini baholash shu maqsadga xizmat qiladi.

## Attestatsiya tuzog‘i

Faol metodning o‘zi samaradorlik kafolati emas. Metod dars maqsadi, mazmuni va o‘quvchining ehtiyojiga mos bo‘lsa samarali hisoblanadi.

> **Manba izi:** Kasb standarti, A/02.6, PDF 6–8.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '14000000-0000-4000-8000-000000000003',
    v_module, 3,
    'ozlashtirishni-baholash-va-qayta-aloqa',
    'O‘zlashtirishni baholash va qayta aloqa',
    $md$
## Maqsad

A/03.6 vazifasi asosida baholash, diagnostika, monitoring va qayta aloqaning vazifalarini farqlash.

## Baholash sikli

Baholash o‘quv jarayonidan ajralgan yakuniy hodisa emas. O‘qituvchi turli usul va vositalardan foydalanib:
1. o‘quvchining holatini aniqlaydi;
2. natijani mezon bilan taqqoslaydi;
3. yutuq va qiyinchilikni tahlil qiladi;
4. asoslangan qayta aloqa beradi;
5. dars rejasi va usullarini zarur bo‘lsa o‘zgartiradi.

**Diagnostika** muammo yoki boshlang‘ich holatni aniqlashga xizmat qiladi. **Monitoring** rivojlanishni vaqt davomida muntazam kuzatadi. **Qayta aloqa** esa o‘quvchiga hozirgi natijasi va keyingi yaxshilash qadamini tushunishga yordam beradi.

## Individual ehtiyoj

Bir xil baholash shakli har bir o‘quvchining ehtiyojiga birdek mos kelmasligi mumkin. Standart baholash usullarini o‘quvchining ta’limiy ehtiyojini hisobga olgan holda tanlash muhim.

## Hamkorlik

Agar o‘quvchining qiyinchiligi davom etsa, o‘qituvchi shu sinfda ishlaydigan hamkasblar, tegishli mutaxassislar va ota-ona bilan muhokama qilib, yordam choralarini uyg‘unlashtiradi.

> **Manba izi:** Kasb standarti, A/03.6, PDF 8–9.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '14000000-0000-4000-8000-000000000004',
    v_module, 4,
    'tarbiyaviy-faoliyatni-tashkil-etish',
    'Tarbiyaviy faoliyatni tashkil etish',
    $md$
## Maqsad

A/04.6 vazifasi doirasida tarbiyaviy faoliyatni o‘quvchining yoshi, individual xususiyati, qadriyatlari va xavfsiz rivojlanishini hisobga olib tashkil etish.

## Tarbiyaviy faoliyatning markazi

Tarbiyaviy ish faqat tadbir o‘tkazish emas. U o‘quvchining aqliy, axloqiy, jismoniy, estetik, ijtimoiy va fuqarolik rivojiga xizmat qiladigan tizimli faoliyatdir.

O‘qituvchi:
- maqsad va vazifalarni o‘quvchi ehtiyojiga mos belgilaydi;
- zamonaviy va interfaol shakllardan foydalanadi;
- yosh, jins, madaniy va individual farqlarni hisobga oladi;
- emotsional-qadriyatli rivojlanishni qo‘llab-quvvatlaydi;
- maktabning odob-axloq va ichki tartib qoidalarini tushunarli tarzda qo‘llaydi;
- o‘quvchilarning o‘zini o‘zi boshqarish faoliyatini rag‘batlantiradi;
- to‘garak, loyiha, sayohat va boshqa sinfdan tashqari ishlarni maqsadli tashkil etadi;
- nizolarni konstruktiv muloqot orqali hal qilishga intiladi.

## Muhim tamoyil

O‘qituvchi har bir bolaning qadr-qimmatini tan oladi. Tarbiya bosim yoki kamsitishga emas, hurmat, mas’uliyat va ongli tanlovga tayangan bo‘lishi kerak.

> **Manba izi:** Kasb standarti, A/04.6, PDF 9–11.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '14000000-0000-4000-8000-000000000005',
    v_module, 5,
    'xavfsiz-rivojlantiruvchi-talim-muhiti',
    'Xavfsiz rivojlantiruvchi ta’lim muhiti',
    $md$
## Maqsad

A/05.6 vazifasi asosida jismoniy, psixologik va ijtimoiy xavfsizlikni ta’minlaydigan, kamsitmaydigan ta’lim muhitini yaratish.

## Xavfsiz muhitning belgilari

Xavfsiz muhitda har bir o‘quvchi kelib chiqishi, jinsi, tili, dini, madaniyati, ijtimoiy holati yoki alohida ehtiyojidan qat’i nazar teng ishtirok eta oladi. O‘qituvchi nizoli vaziyatlarga o‘z vaqtida javob beradi va xavfsizlik qoidalarini o‘quvchilarga tushunarli qiladi.

Standart quyidagi yo‘nalishlarni birlashtiradi:
- hurmat va teng imkoniyat;
- odob-axloq qoidalariga rioya;
- favqulodda vaziyatlarda to‘g‘ri harakat qilish;
- maxsus ta’limiy ehtiyojga moslashtirish;
- media va raqamli muhitda xavfsiz ishlash;
- sog‘liqni saqlash, mehnat gigiyenasi va texnika xavfsizligi;
- zarur holatda birinchi yordam ko‘rsatishga tayyorlik.

## Attestatsiya vaziyati

“Inklyuzivlik” faqat alohida ehtiyojli o‘quvchiga yengillik berish degani emas. Maqsad — o‘quvchining ehtiyojiga mos, mazmunli va teng ishtirok imkonini yaratish.

> **Manba izi:** Kasb standarti, A/05.6, PDF 12–13.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '14000000-0000-4000-8000-000000000006',
    v_module, 6,
    'oz-ozini-rivojlantirish-va-kasbiy-osish',
    'O‘z-o‘zini rivojlantirish va kasbiy o‘sish',
    $md$
## Maqsad

B/01.6 vazifasiga ko‘ra o‘qituvchining kasbiy rivojlanishini doimiy refleksiya, malaka oshirish va hamkasbiy o‘rganish bilan boshqarishini tushunish.

## Kasbiy rivojlanish sikli

Kasbiy o‘sish bir martalik kurs bilan tugamaydi. O‘qituvchi:
1. o‘z faoliyatining kuchli va zaif tomonlarini tahlil qiladi;
2. rivojlanish ehtiyojini belgilaydi;
3. mos kurs, seminar, trening va adabiyotlardan foydalanadi;
4. hamkasblarning darslarini kuzatadi va tahlil qiladi;
5. ochiq dars orqali tajribasini namoyish etadi;
6. o‘rgangan yangilikni amaliyotga kiritadi;
7. natijani qayta baholaydi.

AKT va zarur hollarda xorijiy til kasbiy o‘sish vositasi sifatida ishlatiladi. Maqsad sertifikat yig‘ish emas, o‘qitish sifatini yaxshilashdir.

## Refleksiya

Refleksiya “dars yaxshi o‘tdi” kabi umumiy fikr emas. U dalilga tayangan bo‘lishi kerak: o‘quvchi natijasi, kuzatuv, topshiriq sifati, vaqt boshqaruvi va qayta aloqa kabi ma’lumotlar tahlil qilinadi.

> **Manba izi:** Kasb standarti, B/01.6, PDF 15–16.
$md$,
    18, 'published'::public.content_status
  ),
  (
    '14000000-0000-4000-8000-000000000007',
    v_module, 7,
    'hamkasblar-va-ota-onalar-bilan-hamkorlik',
    'Hamkasblar va ota-onalar bilan hamkorlik',
    $md$
## Maqsad

B/02.6 vazifasi asosida o‘qituvchi, ota-ona, hamkasb va boshqa mutaxassislar o‘rtasidagi hamkorlikning maqsadi va etik tamoyillarini tushunish.

## Hamkorlik nima uchun kerak?

Ta’lim natijasi faqat bitta o‘qituvchining harakatiga bog‘liq emas. O‘quvchining rivojlanishi uchun maktab, oila va zarur mutaxassislar o‘zaro axborot almashishi hamda kelishilgan choralarni qo‘llashi kerak.

O‘qituvchi:
- ota-onani ta’lim jarayoni va maktab hayotiga mazmunli jalb qiladi;
- o‘quvchi rivoji bo‘yicha qarorlarni muhokama qiladi;
- individual ta’lim trayektoriyasini tuzatishda boshqa mutaxassislar bilan ishlaydi;
- tarbiyaviy muammolarni hal qilishda jamoaviy yondashuvdan foydalanadi;
- turli emotsional holatdagi odamlar bilan professional muloqot qiladi;
- mahalliy hamjamiyat xususiyatlarini hisobga oladi.

## Muloqot tamoyili

Hamkorlikda “ko‘proq ma’lumot tarqatish” har doim to‘g‘ri emas. O‘qituvchi maxfiylik, odob va kasb etikasi talablarini saqlagan holda, faqat ta’limiy vazifani hal qilish uchun zarur ma’lumotni ulashadi.

> **Manba izi:** Kasb standarti, B/02.6, PDF 16–17.
$md$,
    18, 'published'::public.content_status
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
      'oquv-jarayonini-rejalashtirish',
      'talim-samaradorligini-taminlash',
      'ozlashtirishni-baholash-va-qayta-aloqa',
      'tarbiyaviy-faoliyatni-tashkil-etish',
      'xavfsiz-rivojlantiruvchi-talim-muhiti',
      'oz-ozini-rivojlantirish-va-kasbiy-osish',
      'hamkasblar-va-ota-onalar-bilan-hamkorlik'
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('oquv-jarayonini-rejalashtirish', 'KS.01'),
      ('talim-samaradorligini-taminlash', 'KS.02'),
      ('ozlashtirishni-baholash-va-qayta-aloqa', 'KS.03'),
      ('tarbiyaviy-faoliyatni-tashkil-etish', 'KS.04'),
      ('xavfsiz-rivojlantiruvchi-talim-muhiti', 'KS.05'),
      ('oz-ozini-rivojlantirish-va-kasbiy-osish', 'KS.06'),
      ('hamkasblar-va-ota-onalar-bilan-hamkorlik', 'KS.07')
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
