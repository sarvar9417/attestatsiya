-- TASK-049: M16 source-backed Informatika o'qitish metodikasi lessons.
--
-- Authoritative source:
-- M.E. Mamarajabov, D.E. Toshtemirov, O'.A. Yuldashev,
-- "Informatika o'qitish metodikasi", 2023.
-- Content below is original synthesis with page-level trace.

begin;

do $$
declare
  v_module uuid;
begin
  select id into strict v_module
  from public.modules
  where code = 'M16';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values
  (
    '16000000-0000-4000-8000-000000000001',
    v_module, 1,
    'informatika-oqitish-yondashuvlari-va-metodikasi',
    'Informatika o‘qitish yondashuvlari va metodikasi',
    $md$
## Maqsad

Informatika o‘qitish metodikasining vazifasini, uning didaktika bilan aloqasini va metodik tizimning asosiy savollarini tushunish.

## Metodika nimani hal qiladi?

Informatika o‘qitish metodikasi fan mazmunini shunchaki bayon qilish emas. U o‘qituvchiga uchta tayanch savolga asoslangan tizim yaratishga yordam beradi:

1. **Nima uchun o‘qitiladi?** — maqsad va kutiladigan natijalar.
2. **Nima o‘qitiladi?** — mazmun va tushunchalar tizimi.
3. **Qanday o‘qitiladi?** — metod, shakl, vosita va o‘quv faoliyati.

Bu qismlar bir-biridan uzilmagan. Masalan, maqsad algoritmik fikrlashni rivojlantirish bo‘lsa, faqat tayyor ta’riflarni yodlatish metodik jihatdan yetarli emas; o‘quvchi masalani tahlil qilishi, algoritm tuzishi va natijani tekshirishi kerak.

## Metodik tizim

Metodik tizim odatda maqsad, mazmun, metodlar, tashkiliy shakllar va o‘qitish vositalarining o‘zaro bog‘langan majmuasi sifatida qaraladi. Bir elementdagi o‘zgarish boshqalarga ham ta’sir qiladi. Masalan, amaliy kompetensiya maqsadi qo‘yilsa, topshiriq, vaqt taqsimoti, kompyuterda ishlash shakli va baholash ham shunga moslashtiriladi.

## Attestatsiya vaziyati

“Qaysi metod eng yaxshi?” degan savolning yagona javobi yo‘q. To‘g‘ri tanlov maqsad, mazmun, o‘quvchi tayyorgarligi, vaqt va mavjud vositalarga bog‘liq.

> **Manba izi:** Mamarajabov va boshq., Informatika o‘qitish metodikasi (2023), PDF 172–180 va 253–256.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '16000000-0000-4000-8000-000000000002',
    v_module, 2,
    'oqitish-usullari-va-metodlarini-farqlash',
    'O‘qitish usullari va metodlarini farqlash',
    $md$
## Maqsad

O‘qitish metodi, usul va vosita tushunchalarini farqlash hamda informatika darsida ularni maqsadga muvofiq tanlash.

## Metod va usul

**O‘qitish metodi** — o‘qituvchi va o‘quvchining ta’lim maqsadiga erishishga yo‘naltirilgan o‘zaro faoliyatini tashkil etish yo‘li. **Usul** esa metodning aniq vaziyatdagi tarkibiy elementi yoki bajarilish ko‘rinishi bo‘lishi mumkin.

Metodni tasniflashda turli mezonlardan foydalaniladi. Amaliyotda quyidagilar ko‘p uchraydi:
- og‘zaki tushuntirish va suhbat;
- ko‘rgazmali namoyish;
- amaliy mashq va laboratoriya ishi;
- reproduktiv faoliyat;
- muammoli va izlanishga yo‘naltirilgan faoliyat;
- interfaol hamkorlik.

## Informatika darsidagi tanlov

Yangi interfeysni o‘rgatishda qisqa namoyish foydali bo‘lishi mumkin, ammo ko‘nikma shakllanishi uchun o‘quvchi mustaqil amaliy harakat qilishi kerak. Dasturlashda tayyor kodni ko‘rsatish boshlang‘ich tayanch beradi, lekin masala yechish kompetensiyasi uchun kod tuzish, xatoni topish va natijani asoslash talab etiladi.

**Vosita** metod emas. Masalan, interaktiv doska yoki dasturlash muhiti — vosita; u qanday didaktik vazifada va qanday faoliyat bilan qo‘llanishi metodik qarordir.

## Interfaol metod

Interfaollik o‘quvchilar o‘rtasidagi va o‘qituvchi bilan faol fikr almashishga tayanadi. U faqat “guruhga bo‘lish” emas; vazifa hamkorlikni va fikrlashni talab qilishi kerak.

> **Manba izi:** Mamarajabov va boshq. (2023), PDF 45, 79–86, 172–180.
$md$,
    20, 'published'::public.content_status
  ),
  (
    '16000000-0000-4000-8000-000000000003',
    v_module, 3,
    'talimiy-vaziyat-va-pedagogik-qarorni-baholash',
    'Ta’limiy vaziyat va pedagogik qarorni baholash',
    $md$
## Maqsad

Informatika darsidagi pedagogik vaziyatni dalillar asosida tahlil qilish va o‘qituvchi qarorining maqsadga muvofiqligini baholash.

## Qarorni qanday tahlil qilamiz?

Ta’limiy vaziyatni baholashda “menga yoqdi/yoqmadi” yetarli emas. Quyidagi mezonlar asosida xulosa chiqariladi:

1. darsning maqsadi aniqmi;
2. tanlangan mazmun maqsadga mosmi;
3. metod o‘quvchi faoliyatini kerakli darajada tashkil qiladimi;
4. vosita va vaqt oqilona ishlatilganmi;
5. individual farqlar va xavfsizlik hisobga olinganmi;
6. o‘quvchi natijasi qanday dalil bilan tekshirilgan;
7. aniqlangan muammo uchun tavsiya aniq va amalga oshiriladimi.

## Dars tahlili

Metodik manbada dars tahlili kuzatuvga tayyorgarlik, dars jarayonini kuzatish, o‘qituvchining o‘z-o‘zini tahlili va yakuniy tahlil-tavsiyalar kabi bosqichlarda ko‘riladi. Tahlil ilmiy, psixologik, metodik, didaktik yoki umumiy pedagogik yo‘nalishda bo‘lishi mumkin.

## Vaziyat misoli

O‘qituvchi yangi dasturlash mavzusida 35 daqiqa davomida faqat kodni doskada yozadi, so‘ng 5 daqiqada mustaqil topshiriq beradi. O‘quvchilarning ko‘pi vazifani boshlay olmaydi. Muammo “o‘quvchilar sust” degan xulosa bilan yopilmaydi. Maqsad, namuna va mustaqil faoliyat nisbatini, bosqichli yordamni va tezkor diagnostikani tahlil qilish kerak.

## Attestatsiya qoidasi

Eng yaxshi pedagogik qaror — eng zamonaviy ko‘ringani emas, mavjud vaziyatda maqsad va o‘quvchi ehtiyojiga eng asosli javob beradigan qarordir.

> **Manba izi:** Mamarajabov va boshq. (2023), PDF 164–166 va 253–256.
$md$,
    22, 'published'::public.content_status
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
      'informatika-oqitish-yondashuvlari-va-metodikasi',
      'oqitish-usullari-va-metodlarini-farqlash',
      'talimiy-vaziyat-va-pedagogik-qarorni-baholash'
    );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from (
    values
      ('informatika-oqitish-yondashuvlari-va-metodikasi', 'PM.MET.01'),
      ('oqitish-usullari-va-metodlarini-farqlash', 'PM.MET.02'),
      ('talimiy-vaziyat-va-pedagogik-qarorni-baholash', 'PM.MET.03')
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
