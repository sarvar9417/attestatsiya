-- Restore two source-backed lessons that are required by the professional-bank
-- taxonomy but were absent from the live migration history.
--
-- No private question-bank payload or answer keys are stored here.

begin;

do $$
declare
  v_m02 uuid;
  v_m05 uuid;
begin
  select id into v_m02 from public.modules where code = 'M02';
  select id into v_m05 from public.modules where code = 'M05';

  if v_m02 is null or v_m05 is null then
    raise exception 'required modules M02/M05 are missing';
  end if;

  insert into public.lessons
    (id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status)
  values
    (
      '92000000-0000-4000-8000-000000000004'::uuid,
      v_m02,
      6,
      'm02-06',
      'Dasturiy ta’minot turlari',
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

Xizmat dasturlari tizimni saqlash, tekshirish yoki ma’lumotni qulay shaklga keltirishga yordam beradi. Arxivator fayllarni siqish va bir paketga jamlash uchun, antivirus zararli dasturlarni aniqlash va zararsizlantirish uchun ishlatiladi. Kodek va konvertor kabi vositalar media yoki fayl formatlari bilan ishlashga yordam beradi.

> **Manba izi:** ICT 5-sinf (2020), PDF 38–42; ICT 10-sinf (2021), PDF 28–32; Cambridge+ 10–11-sinf, 2-bob, PDF 32–42.
$md$,
      18,
      'published'::public.content_status
    ),
    (
      '95000000-0000-4000-8000-000000000002'::uuid,
      v_m05,
      2,
      'm05-02',
      'Sanoq sistemalari orasida o‘tkazish',
      $md$
## Maqsad

O‘nlikdan boshqa asosga, boshqa asosdan o‘nlikka hamda 2↔4/8/16 o‘tkazish usullarini to‘g‘ri tanlash.

## Boshqa asosdan o‘nlikka

Pozitsiyali sonni o‘nlikka o‘tkazishda har bir raqam asosning o‘z razryadiga mos darajasiga ko‘paytiriladi va natijalar qo‘shiladi.

## O‘nlikdan boshqa asosga

Butun sonni yangi asosga ketma-ket bo‘lib boring va qoldiqlarni oxiridan boshiga o‘qing.

## Ikkilik bilan ko‘prik usullari

- 2↔4 — 2 bitli guruhlar (diada);
- 2↔8 — 3 bitli guruhlar (triada);
- 2↔16 — 4 bitli guruhlar (tetrada).

> **Manba izi:** ICT 7-sinf (2021), PDF 13–16; Axborot va axborot jarayonlari qo‘llanmasi, 6-bob.
$md$,
      22,
      'published'::public.content_status
    )
  on conflict (id) do update
  set module_id = excluded.module_id,
      order_idx = excluded.order_idx,
      slug = excluded.slug,
      title_uz = excluded.title_uz,
      body_mdx = excluded.body_mdx,
      est_minutes = excluded.est_minutes,
      status = excluded.status,
      updated_at = now();

  insert into public.lesson_constructs (lesson_id, construct_id)
  select '92000000-0000-4000-8000-000000000004'::uuid, id
  from public.constructs
  where code = 'S2.HW.04' and is_active
  on conflict do nothing;

  insert into public.lesson_constructs (lesson_id, construct_id)
  select '95000000-0000-4000-8000-000000000002'::uuid, id
  from public.constructs
  where code = 'S3.NUM.02' and is_active
  on conflict do nothing;
end
$$;

commit;
