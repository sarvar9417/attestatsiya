-- TASK-063: reconcile legacy production M02/M05 lesson rows to canonical
-- source-backed stable lesson IDs used by the fresh migration chain.
--
-- Safety:
-- * only rewrites a module when canonical stable IDs are incomplete;
-- * aborts if legacy lessons have learner progress/exam/attempt references;
-- * rebinds questions by active construct before archiving legacy rows;
-- * preserves archived legacy rows instead of deleting them.

begin;

do $$
declare
  v_m02 uuid;
  v_m05 uuid;
  v_subject uuid;
  v_legacy_refs bigint;
begin
  select id,subject_id into v_m02,v_subject from public.modules where code='M02';
  select id into v_m05 from public.modules where code='M05';

  if v_m02 is null or v_m05 is null then
    raise exception 'TASK-063 M02/M05 modules not found';
  end if;

  if not (
    exists(select 1 from public.lessons where id='92000000-0000-4000-8000-000000000001'::uuid)
    and exists(select 1 from public.lessons where id='92000000-0000-4000-8000-000000000002'::uuid)
    and exists(select 1 from public.lessons where id='92000000-0000-4000-8000-000000000003'::uuid)
    and exists(select 1 from public.lessons where id='92000000-0000-4000-8000-000000000004'::uuid)
  ) then
    select
      (select count(*) from public.user_lesson_progress p join public.lessons l on l.id=p.lesson_id
       where l.module_id=v_m02 and l.id not in (
        '92000000-0000-4000-8000-000000000001'::uuid,
        '92000000-0000-4000-8000-000000000002'::uuid,
        '92000000-0000-4000-8000-000000000003'::uuid,
        '92000000-0000-4000-8000-000000000004'::uuid))
      +
      (select count(*) from public.exams e join public.lessons l on l.id=e.lesson_id
       where l.module_id=v_m02 and l.id not in (
        '92000000-0000-4000-8000-000000000001'::uuid,
        '92000000-0000-4000-8000-000000000002'::uuid,
        '92000000-0000-4000-8000-000000000003'::uuid,
        '92000000-0000-4000-8000-000000000004'::uuid))
      +
      (select count(*) from public.topic_test_attempts t join public.lessons l on l.id=t.lesson_id
       where l.module_id=v_m02 and l.id not in (
        '92000000-0000-4000-8000-000000000001'::uuid,
        '92000000-0000-4000-8000-000000000002'::uuid,
        '92000000-0000-4000-8000-000000000003'::uuid,
        '92000000-0000-4000-8000-000000000004'::uuid))
    into v_legacy_refs;

    if v_legacy_refs <> 0 then
      raise exception 'TASK-063 refuses M02 reconcile: % learner/exam references on legacy lessons',v_legacy_refs;
    end if;

    with legacy as (
      select id,row_number() over(order by order_idx,id) rn
      from public.lessons
      where module_id=v_m02
        and id not in (
          '92000000-0000-4000-8000-000000000001'::uuid,
          '92000000-0000-4000-8000-000000000002'::uuid,
          '92000000-0000-4000-8000-000000000003'::uuid,
          '92000000-0000-4000-8000-000000000004'::uuid
        )
    )
    update public.lessons l
    set order_idx=100+legacy.rn,
        slug='legacy-archived-'||left(l.id::text,8)||'-'||l.slug,
        status='archived'::public.content_status,
        updated_at=now()
    from legacy
    where l.id=legacy.id;

    insert into public.lessons(id,module_id,order_idx,slug,title_uz,body_mdx,est_minutes,status)
    values
    (
      '92000000-0000-4000-8000-000000000001'::uuid,v_m02,1,
      'kompyuter-qurilmalari-va-vazifalari',
      'Kompyuter qurilmalari va ularning vazifalari',
      $md$
## Maqsad
Kompyuterning asosiy apparat qismlarini vazifasi bo‘yicha farqlash va vaziyatga mos qurilmani tanlash.

## Asosiy qismlar
**CPU** dastur buyruqlarini bajaradi va arifmetik-mantiqiy qayta ishlashni amalga oshiradi. **RAM** ishlayotgan dastur va ma’lumotni vaqtincha saqlaydi; elektr uzilganda mazmuni odatda yo‘qoladi. **SSD/HDD** esa fayllarni uzoq muddat saqlash uchun ishlatiladi.

Kiritish qurilmalariga klaviatura, sichqoncha, mikrofon va skaner; chiqarish qurilmalariga monitor, printer va karnay misol bo‘ladi. Sensorli ekran kabi qurilmalar bir vaqtning o‘zida kiritish va chiqarish vazifasini bajarishi mumkin.

## Test strategiyasi
Savolda qurilma nomidan ko‘ra uning **asosiy vazifasi**ga qarang: hisoblash — CPU, vaqtinchalik ishchi xotira — RAM, doimiy saqlash — SSD/HDD, tashqi ma’lumotni kiritish — input qurilmasi.

> **Manba izi:** 2026 Informatika spetsifikatsiyasi, “Kompyuterning texnik va dasturiy ta’minoti”; ICT 5-sinf darsligi, kompyuter qurilmalari bo‘limi.
$md$,18,'published'::public.content_status
    ),
    (
      '92000000-0000-4000-8000-000000000002'::uuid,v_m02,2,
      'operatsion-tizimlar-va-imkoniyatlari',
      'Operatsion tizimlar va ularning imkoniyatlari',
      $md$
## Maqsad
Operatsion tizimning vazifalarini bilish va turli vaziyatlarda uning rolini aniqlash.

## Operatsion tizim
Operatsion tizim kompyuter apparat resurslari va amaliy dasturlar o‘rtasida boshqaruv qatlamini yaratadi. U protsessor va xotiradan foydalanishni muvofiqlashtiradi, fayl tizimini boshqaradi, qurilmalar bilan ishlashga yordam beradi va foydalanuvchi interfeysini taqdim etadi.

**GUI** oynalar, tugmalar, menyular va piktogrammalar orqali boshqarishni ta’minlaydi. **CLI** esa matnli buyruqlar orqali ishlashga tayangan interfeysdir. Qurilma drayveri operatsion tizimning muayyan apparat bilan ishlashiga yordam beradi.

## Test strategiyasi
“Resurslarni boshqarish”, “fayl tizimi”, “dasturlarni ishga tushirish”, “qurilmalar bilan ishlash” kabi belgilar operatsion tizim roliga ishora qiladi.

> **Manba izi:** 2026 Informatika spetsifikatsiyasi, operatsion tizimlar va ularning imkoniyatlari; ICT darsliklarining operatsion tizimlar bo‘limlari.
$md$,18,'published'::public.content_status
    ),
    (
      '92000000-0000-4000-8000-000000000003'::uuid,v_m02,3,
      'fayl-papka-va-fayl-tizimi',
      'Fayl, papka va fayl tizimi',
      $md$
## Maqsad
Fayl, papka, kengaytma va yo‘l tushunchalarini farqlash hamda fayllar bilan asosiy amallarni bajarish.

## Fayl va papka
**Fayl** — nom bilan saqlanadigan ma’lumotlar birligi. **Papka** fayl va boshqa papkalarni mantiqiy guruhlash uchun ishlatiladi. Fayl nomining oxiridagi **kengaytma** (.docx, .png, .pdf va boshqalar) fayl turini aniqlashga yordam beradi.

**Fayl yo‘li** disk, papkalar va fayl nomi orqali joylashuvni ko‘rsatadi. Asosiy amallar: yaratish, nusxalash, ko‘chirish, qayta nomlash va o‘chirish.

> **Manba izi:** ICT 5-sinf (2020), “Fayl va papka tushunchasi”, PDF 42–46; 2026 Informatika spetsifikatsiyasi.
$md$,18,'published'::public.content_status
    )
    on conflict(id) do nothing;

    update public.lessons
    set order_idx=4,
        slug='tizimli-amaliy-va-xizmat-dasturlari',
        title_uz='Tizimli, amaliy va xizmat ko‘rsatuvchi dasturlar',
        status='published'::public.content_status,
        updated_at=now()
    where id='92000000-0000-4000-8000-000000000004'::uuid;

    insert into public.lesson_constructs(lesson_id,construct_id)
    select x.lesson_id,c.id
    from (values
      ('92000000-0000-4000-8000-000000000001'::uuid,'S2.HW.01'),
      ('92000000-0000-4000-8000-000000000002'::uuid,'S2.HW.02'),
      ('92000000-0000-4000-8000-000000000003'::uuid,'S2.HW.03'),
      ('92000000-0000-4000-8000-000000000004'::uuid,'S2.HW.04')
    ) x(lesson_id,code)
    join public.constructs c on c.code=x.code and c.is_active
    on conflict do nothing;

    update public.questions q
    set source_lesson_id=case c.code
      when 'S2.HW.01' then '92000000-0000-4000-8000-000000000001'::uuid
      when 'S2.HW.02' then '92000000-0000-4000-8000-000000000002'::uuid
      when 'S2.HW.03' then '92000000-0000-4000-8000-000000000003'::uuid
      when 'S2.HW.04' then '92000000-0000-4000-8000-000000000004'::uuid
    end,
    updated_at=now()
    from public.constructs c
    where q.construct_id=c.id and c.code in ('S2.HW.01','S2.HW.02','S2.HW.03','S2.HW.04');

    delete from public.lesson_constructs lc
    using public.lessons l
    where lc.lesson_id=l.id and l.module_id=v_m02 and l.status='archived'::public.content_status;
  end if;

  if not (
    exists(select 1 from public.lessons where id='95000000-0000-4000-8000-000000000001'::uuid)
    and exists(select 1 from public.lessons where id='95000000-0000-4000-8000-000000000002'::uuid)
    and exists(select 1 from public.lessons where id='95000000-0000-4000-8000-000000000003'::uuid)
  ) then
    select
      (select count(*) from public.user_lesson_progress p join public.lessons l on l.id=p.lesson_id
       where l.module_id=v_m05 and l.id not in (
        '95000000-0000-4000-8000-000000000001'::uuid,
        '95000000-0000-4000-8000-000000000002'::uuid,
        '95000000-0000-4000-8000-000000000003'::uuid))
      +
      (select count(*) from public.exams e join public.lessons l on l.id=e.lesson_id
       where l.module_id=v_m05 and l.id not in (
        '95000000-0000-4000-8000-000000000001'::uuid,
        '95000000-0000-4000-8000-000000000002'::uuid,
        '95000000-0000-4000-8000-000000000003'::uuid))
      +
      (select count(*) from public.topic_test_attempts t join public.lessons l on l.id=t.lesson_id
       where l.module_id=v_m05 and l.id not in (
        '95000000-0000-4000-8000-000000000001'::uuid,
        '95000000-0000-4000-8000-000000000002'::uuid,
        '95000000-0000-4000-8000-000000000003'::uuid))
    into v_legacy_refs;

    if v_legacy_refs <> 0 then
      raise exception 'TASK-063 refuses M05 reconcile: % learner/exam references on legacy lessons',v_legacy_refs;
    end if;

    with legacy as (
      select id,row_number() over(order by order_idx,id) rn
      from public.lessons
      where module_id=v_m05
        and id not in (
          '95000000-0000-4000-8000-000000000001'::uuid,
          '95000000-0000-4000-8000-000000000002'::uuid,
          '95000000-0000-4000-8000-000000000003'::uuid
        )
    )
    update public.lessons l
    set order_idx=100+legacy.rn,
        slug='legacy-archived-'||left(l.id::text,8)||'-'||l.slug,
        status='archived'::public.content_status,
        updated_at=now()
    from legacy
    where l.id=legacy.id;

    insert into public.lessons(id,module_id,order_idx,slug,title_uz,body_mdx,est_minutes,status)
    values
    (
      '95000000-0000-4000-8000-000000000001'::uuid,v_m05,1,
      'sanoq-sistemalari-asoslari',
      'Sanoq sistemalari asoslari',
      $md$
## Maqsad
Sanoq sistemasi, asos, raqam va razryad tushunchalarini farqlash hamda pozitsiyali yozuvni tahlil qilish.

## Asosiy tushunchalar
Sanoq sistemasi sonlarni belgilar yordamida yozish va ular ustida amal bajarish qoidalari tizimidir. Pozitsiyali sistemada raqam qiymati uning yozuvdagi o‘rniga bog‘liq.

Asos p bo‘lsa, ruxsat etilgan raqamlar 0 dan p−1 gacha. Ikkilikda 0 va 1; sakkizlikda 0–7; o‘nlikda 0–9; o‘n oltilikda 0–9 va A–F ishlatiladi.

> **Manba izi:** ICT 7-sinf (2021), “Sanoq sistemalari haqida”, PDF 9–12; 2026 Informatika spetsifikatsiyasi S3.NUM.01.
$md$,18,'published'::public.content_status
    ),
    (
      '95000000-0000-4000-8000-000000000003'::uuid,v_m05,3,
      'sanoq-sistemalari-arifmetika',
      'Turli sanoq sistemalarida arifmetik amallar',
      $md$
## Maqsad
Ikkilik va boshqa pozitsiyali sanoq sistemalarida qo‘shish, ayirish va arifmetik ifodalarni to‘g‘ri bajarish.

## Bir xil asosda amal
Arifmetik amal boshlanishidan oldin barcha operandlar bir xil asosda ekanini tekshiring. Ikkilik qo‘shishda 1+1=10₂; keyingi razryadga ko‘chirish amalga oshiriladi. Ayirishda zarur bo‘lsa keyingi razryaddan qarz olinadi.

Turli asosdagi sonlar bir ifodada berilsa, ishonchli strategiya — ularni bitta umumiy asosga o‘tkazish, amalni bajarish va talab etilgan asosga qaytarish.

> **Manba izi:** ICT 7-sinf (2021), “Turli sanoq sistemalarida arifmetik amallarning bajarilishi”, PDF 17–21; 2026 Informatika spetsifikatsiyasi S3.NUM.03.
$md$,22,'published'::public.content_status
    )
    on conflict(id) do nothing;

    update public.lessons
    set order_idx=2,
        slug='sanoq-sistemalari-otkazish',
        title_uz='Sonlarni sanoq sistemalari orasida o‘tkazish',
        status='published'::public.content_status,
        updated_at=now()
    where id='95000000-0000-4000-8000-000000000002'::uuid;

    insert into public.lesson_constructs(lesson_id,construct_id)
    select x.lesson_id,c.id
    from (values
      ('95000000-0000-4000-8000-000000000001'::uuid,'S3.NUM.01'),
      ('95000000-0000-4000-8000-000000000002'::uuid,'S3.NUM.02'),
      ('95000000-0000-4000-8000-000000000003'::uuid,'S3.NUM.03')
    ) x(lesson_id,code)
    join public.constructs c on c.code=x.code and c.is_active
    on conflict do nothing;

    update public.questions q
    set source_lesson_id=case c.code
      when 'S3.NUM.01' then '95000000-0000-4000-8000-000000000001'::uuid
      when 'S3.NUM.02' then '95000000-0000-4000-8000-000000000002'::uuid
      when 'S3.NUM.03' then '95000000-0000-4000-8000-000000000003'::uuid
    end,
    updated_at=now()
    from public.constructs c
    where q.construct_id=c.id and c.code in ('S3.NUM.01','S3.NUM.02','S3.NUM.03');

    delete from public.lesson_constructs lc
    using public.lessons l
    where lc.lesson_id=l.id and l.module_id=v_m05 and l.status='archived'::public.content_status;
  end if;
end
$$;

commit;
