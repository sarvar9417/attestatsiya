-- TASK-057: close the final official lesson coverage gap (S1.INFO.06).
-- Source-backed synthesis from the Axborot va axborot jarayonlari handbook,
-- chapter 14, and the professional test bank. No source passage is copied.

begin;

do $$
declare
  v_module uuid;
  v_lesson uuid := 'a0100000-0000-4000-8000-000000000006';
begin
  select id into strict v_module
  from public.modules
  where code = 'M01';

  insert into public.lessons (
    id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status
  )
  values (
    v_lesson,
    v_module,
    20,
    'axborot-uzatish-tezligi',
    'Axborot uzatish tezligi: hajm, tezlik va vaqt',
    $md$
## Maqsad

Axborot hajmi, uzatish tezligi va vaqt orasidagi bog‘lanishni to‘g‘ri qo‘llash, birliklarni moslashtirish hamda bandwidth, throughput va baud tushunchalarini aralashtirmaslik.

## Asosiy bog‘lanish

Axborot uzatish tezligi vaqt birligida uzatilgan axborot hajmini bildiradi:

**v = I / t**, shundan **I = v × t** va **t = I / v**.

Bu yerda eng ko‘p uchraydigan xato — fayl hajmini baytda qoldirib, tezlikni bit/s bilan bevosita bo‘lish. Hisoblashdan oldin birliklarni bir xil tizimga keltiring. Masalan, tezlik Mbit/s bo‘lsa, baytli fayl hajmini bitga aylantirish kerak. Agar tezlik MB/s bo‘lsa, yana 8 ga bo‘lish noto‘g‘ri bo‘ladi.

## Nazariy va amaliy tezlik

**Bandwidth** kanalning nazariy yoki belgilangan maksimal uzatish imkoniyatini bildiradi. **Throughput** esa amalda vaqt birligida yetkazilgan ma’lumot tezligini ifodalaydi. Reklama qilingan kanal tezligi bilan real uzatish tezligi bir xil bo‘lmasligi mumkin.

**Baud** signal simvollari o‘zgarish tezligiga tegishli. Faqat har bir signal simvoli aynan bitta bit tashiydigan sodda holatda baud son jihatdan bit/s ga teng bo‘lishi mumkin; ularni umumiy holda sinonim deb olish kerak emas.

## Yechish algoritmi

1. Fayl hajmi va tezlik birliklarini aniqlang.
2. Bayt va bitni kerak bo‘lsa 8 koeffitsiyent bilan aylantiring.
3. k/M/G birliklari shartda o‘nlikmi yoki ikkilikmi ekanini tekshiring.
4. Kerakli formulani tanlang.
5. Faqat yakunda yaxlitlang va javob birligini yozing.

**Misol:** 100 Mbit axborot 20 Mbit/s tezlikda ideal sharoitda uzatilsa, t = 100 / 20 = 5 s.

> **Manba izi:** Axborot va axborot jarayonlari qo‘llanmasi, 14-bob “Axborotni uzatish tezligi va aloqa kanali”, PDF 58–60; Professional test banki, 14-bob; ICT 7-sinf, PDF 23–25.
$md$,
    20,
    'published'::public.content_status
  )
  on conflict (module_id, slug) do update
  set title_uz = excluded.title_uz,
      body_mdx = excluded.body_mdx,
      est_minutes = excluded.est_minutes,
      status = excluded.status,
      updated_at = now();

  delete from public.lesson_constructs
  where lesson_id = (
    select id from public.lessons
    where module_id = v_module
      and slug = 'axborot-uzatish-tezligi'
  );

  insert into public.lesson_constructs (lesson_id, construct_id)
  select l.id, c.id
  from public.lessons l
  join public.constructs c
    on c.code = 'S1.INFO.06'
   and c.is_active
  where l.module_id = v_module
    and l.slug = 'axborot-uzatish-tezligi'
  on conflict do nothing;
end
$$;

commit;
