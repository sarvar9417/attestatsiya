-- Official 2026 Informatics attestation contract.
-- Sources: files/04-BLUEPRINT.md and src/data/contentTree.ts.
-- This migration is deliberately idempotent so supabase/seed.sql can reuse it.

begin;

do $$
declare
  v_subject_id uuid;
begin
  select id
    into v_subject_id
    from public.subjects
   where code = 'informatika'
   limit 1;

  if v_subject_id is null then
    select id
      into v_subject_id
      from public.subjects
     where code = 'INF'
     limit 1;
  end if;

  if v_subject_id is null then
    insert into public.subjects (code, name_uz, is_active)
    values ('informatika', 'Informatika va axborot texnologiyalari', true)
    returning id into v_subject_id;
  else
    update public.subjects
       set code = 'informatika',
           name_uz = 'Informatika va axborot texnologiyalari',
           is_active = true
     where id = v_subject_id;
  end if;
end
$$;

insert into public.modules (
  subject_id,
  code,
  order_idx,
  slug,
  title_uz,
  summary_uz,
  exam_section,
  exam_question_count,
  status
)
select
  subject.id,
  seed.code,
  seed.order_idx,
  seed.slug,
  seed.title_uz,
  seed.summary_uz,
  seed.exam_section,
  seed.exam_question_count,
  'published'::public.content_status
from public.subjects subject
cross join (
  values
    ('M01', 1, 'axborot-va-raqamli-savodxonlik', 'Axborot va raqamli savodxonlik', 'Informatika, axborot, ma''lumot va bilim. Axborot turlari va manbalari, raqamli texnologiyalar, axborotni kodlash, o''lchov birliklari, axborot hajmi va uzatish tezligi.', 'specialty'::public.exam_section, 3),
    ('M02', 2, 'kompyuter-tizimlari-va-dasturiy-muhit', 'Kompyuter tizimlari va dasturiy muhit', 'Kompyuterlar rivojlanish tarixi, tuzilishi, ichki va tashqi qurilmalar, xotira, mobil qurilmalar, dasturiy ta''minot turlari, operatsion tizimlar, fayl va papkalar.', 'specialty'::public.exam_section, 2),
    ('M03', 3, 'microsoft-office', 'Microsoft Office', 'Word interfeysi, formatlash, obyektlar; Excel formulalar, filtrlash, diagramma; PowerPoint dizayn, multimedia, animatsiya.', 'specialty'::public.exam_section, 5),
    ('M04', 4, 'mantiqiy-fikrlash-va-modellashtirish', 'Mantiqiy fikrlash va modellashtirish', 'Mantiq asoslari, mulohazalar, mantiqiy amallar va ifodalar, rostlik jadvallari, mantiqiy sxemalar, masalani kompyuterda yechish bosqichlari, model turlari.', 'specialty'::public.exam_section, 3),
    ('M05', 5, 'sanoq-sistemalari', 'Sanoq sistemalari', 'Sanoq sistemalari asoslari, ular orasida o''tkazish, turli sanoq sistemalarida arifmetik amallar.', 'specialty'::public.exam_section, 2),
    ('M06', 6, 'algoritmlash', 'Algoritmlash', 'Algoritm tushunchasi, xossalari, turlari, blok-sxema va psevdokodda tasvirlash, algoritmni tekshirish va tahlil qilish.', 'specialty'::public.exam_section, 3),
    ('M07', 7, 'scratch-va-logo', 'Scratch va LOGO', 'Scratch muhiti, sprayt va koordinatalar, bloklar, o''zgaruvchi, shart va sikllar, Pen grafikasi, LOGO va Toshbaqa grafikasi.', 'specialty'::public.exam_section, 3),
    ('M08', 8, 'python-va-javascript', 'Python va JavaScript', 'Dasturlash tillari, Python sintaksisi, o''zgaruvchilar, operatorlar, shartlar, sikllar, funksiyalar, ro''yxatlar, kutubxonalar, JavaScript asoslari.', 'specialty'::public.exam_section, 3),
    ('M09', 9, 'malumotlar-bazasi-ms-access-va-sql', 'Ma''lumotlar bazasi, MS Access va SQL', 'Ma''lumotlar bazasi tushunchasi, jadvallar, kalitlar, MS Access forma va so''rovlar, SQL SELECT, INSERT, UPDATE, DELETE.', 'specialty'::public.exam_section, 2),
    ('M10', 10, 'kompyuter-grafikasi-va-media', 'Kompyuter grafikasi va media', 'Grafika turlari, rang modellari, Paint va Photoshop, 3D modellashtirish, animatsiya, audio va video tahrirlash.', 'specialty'::public.exam_section, 2),
    ('M11', 11, 'html-va-css', 'HTML va CSS', 'Veb va HTML asoslari, matn, ro''yxat, rasm, jadval, forma, havola, iframe, CSS asoslari, ranglar, matn, bloklar, veb-sayt loyihalash.', 'specialty'::public.exam_section, 3),
    ('M12', 12, 'kompyuter-tarmoqlari-va-internet', 'Kompyuter tarmoqlari va internet', 'Tarmoq tushunchasi, turlari, komponentlar, arxitektura, topologiyalar, IP manzil, internet, brauzer, elektron pochta, bulutli texnologiyalar, IoT.', 'specialty'::public.exam_section, 2),
    ('M13', 13, 'axborot-xavfsizligi-va-raqamli-xizmatlar', 'Axborot xavfsizligi va raqamli xizmatlar', 'Axborot xavfsizligi tahdidlari, zararli dasturlar, antivirus, shifrlash, elektron imzo, elektron tijorat, SMM, CMS, LMS.', 'specialty'::public.exam_section, 2),
    ('M14', 14, 'kasb-standarti', 'Kasb standarti', 'O''quv jarayonini rejalashtirish, ta''lim samaradorligi, baholash, tarbiyaviy faoliyat, xavfsiz muhit, kasbiy o''sish, hamkorlik.', 'professional_standard'::public.exam_section, 5),
    ('M15', 15, 'umumiy-pedagogika', 'Umumiy pedagogika', 'Pedagogika, didaktika, yosh psixologiyasi, ta''lim tamoyillari, tarbiya turlari, dars turlari, sinf boshqaruvi, pedagogik etika.', 'pedagogy'::public.exam_section, 7),
    ('M16', 16, 'informatika-oqitish-metodikasi', 'Informatika o''qitish metodikasi', 'Fan mazmunini o''qitish yondashuvlari, o''qitish usul va metodlari, ta''limiy vaziyatdagi qarorlarni baholash.', 'methodology'::public.exam_section, 3)
) as seed(
  code,
  order_idx,
  slug,
  title_uz,
  summary_uz,
  exam_section,
  exam_question_count
)
where subject.code = 'informatika'
on conflict (subject_id, order_idx) do update
set code = excluded.code,
    slug = excluded.slug,
    title_uz = excluded.title_uz,
    summary_uz = excluded.summary_uz,
    exam_section = excluded.exam_section,
    exam_question_count = excluded.exam_question_count,
    status = excluded.status,
    updated_at = now();

update public.blueprints
   set is_active = false
 where subject_id = (
   select id from public.subjects where code = 'informatika'
 );

insert into public.blueprints (
  subject_id,
  version,
  effective_year,
  total_questions,
  duration_min,
  points_per_item,
  is_active
)
select id, 1, 2026, 50, 120, 2, true
  from public.subjects
 where code = 'informatika'
on conflict (subject_id, version) do update
set effective_year = excluded.effective_year,
    total_questions = excluded.total_questions,
    duration_min = excluded.duration_min,
    points_per_item = excluded.points_per_item,
    is_active = excluded.is_active;

delete from public.blueprint_quotas
 where blueprint_id = (
   select blueprint.id
     from public.blueprints blueprint
     join public.subjects subject on subject.id = blueprint.subject_id
    where subject.code = 'informatika'
      and blueprint.version = 1
 );

insert into public.blueprint_quotas (
  blueprint_id,
  group_code,
  order_idx,
  question_count,
  n_bilish,
  n_qollash,
  n_mulohaza
)
select
  blueprint.id,
  seed.group_code,
  seed.order_idx,
  seed.question_count,
  seed.n_bilish,
  seed.n_qollash,
  seed.n_mulohaza
from public.blueprints blueprint
join public.subjects subject on subject.id = blueprint.subject_id
cross join (
  values
    ('S1.INFO', 1, 3, 1, 2, 0),
    ('S2.HW', 2, 2, 1, 1, 0),
    ('S2.OFFICE', 3, 5, 0, 5, 0),
    ('S3.LOGIC', 4, 3, 0, 2, 1),
    ('S3.NUM', 5, 2, 0, 2, 0),
    ('S3.ALGO', 6, 3, 0, 2, 1),
    ('S4.BLOCK', 7, 3, 0, 3, 0),
    ('S4.CODE', 8, 3, 0, 2, 1),
    ('S4.DB', 9, 2, 0, 2, 0),
    ('S5.WEB', 10, 5, 1, 4, 0),
    ('S6.NET', 11, 2, 0, 2, 0),
    ('S7.SEC', 12, 2, 1, 1, 0),
    ('KS', 13, 5, 1, 3, 1),
    ('PM.GEN', 14, 7, 2, 4, 1),
    ('PM.MET', 15, 3, 1, 0, 2)
) as seed(
  group_code,
  order_idx,
  question_count,
  n_bilish,
  n_qollash,
  n_mulohaza
)
where subject.code = 'informatika'
  and blueprint.version = 1;

update public.constructs
   set is_active = false
 where subject_id = (
   select id from public.subjects where code = 'informatika'
 );

insert into public.constructs (
  subject_id,
  code,
  group_code,
  slug,
  title_uz,
  is_active
)
select
  subject.id,
  seed.code,
  seed.group_code,
  seed.slug,
  seed.title_uz,
  true
from public.subjects subject
cross join (
  values
    ('S1.INFO.01', 'S1.INFO', 's1-info-01', 'Informatika, axborot, ma''lumot va bilim tushunchalarini farqlash'),
    ('S1.INFO.02', 'S1.INFO', 's1-info-02', 'Axborot turlari va manbalari'),
    ('S1.INFO.03', 'S1.INFO', 's1-info-03', 'Turli ko''rinishdagi axborotni kodlash'),
    ('S1.INFO.04', 'S1.INFO', 's1-info-04', 'Axborot o''lchov birliklari'),
    ('S1.INFO.05', 'S1.INFO', 's1-info-05', 'Axborot hajmini hisoblash'),
    ('S1.INFO.06', 'S1.INFO', 's1-info-06', 'Axborot uzatish tezligini hisoblash'),
    ('S1.INFO.07', 'S1.INFO', 's1-info-07', 'Raqamli muhitda axloq va mualliflik huquqi'),
    ('S2.HW.01', 'S2.HW', 's2-hw-01', 'Kompyuter qurilmalari va ularning vazifalari'),
    ('S2.HW.02', 'S2.HW', 's2-hw-02', 'Operatsion tizimlar va ularning imkoniyatlari'),
    ('S2.HW.03', 'S2.HW', 's2-hw-03', 'Fayl va papkalar bilan ishlash'),
    ('S2.HW.04', 'S2.HW', 's2-hw-04', 'Tizimli va amaliy dasturlarni farqlash'),
    ('S2.OFFICE.01', 'S2.OFFICE', 's2-office-01', 'MS Word: hujjat formatlash va tuzilma'),
    ('S2.OFFICE.02', 'S2.OFFICE', 's2-office-02', 'MS Excel: formulalar va funksiyalar'),
    ('S2.OFFICE.03', 'S2.OFFICE', 's2-office-03', 'MS Excel: filtr, saralash, diagramma tahlili'),
    ('S2.OFFICE.04', 'S2.OFFICE', 's2-office-04', 'MS PowerPoint: taqdimot, animatsiya, o''tish effektlari'),
    ('S3.LOGIC.01', 'S3.LOGIC', 's3-logic-01', 'Sodda va murakkab mantiqiy mulohazalar tuzish'),
    ('S3.LOGIC.02', 'S3.LOGIC', 's3-logic-02', 'Mantiqiy amallar bajarish'),
    ('S3.LOGIC.03', 'S3.LOGIC', 's3-logic-03', 'Mantiqiy mulohazalar yordamida masala yechish'),
    ('S3.LOGIC.04', 'S3.LOGIC', 's3-logic-04', 'Rostlik jadvali va mantiqiy sxemalar'),
    ('S3.NUM.01', 'S3.NUM', 's3-num-01', 'Sanoq sistemalari asoslari'),
    ('S3.NUM.02', 'S3.NUM', 's3-num-02', 'Sonlarni bir sanoq sistemasidan boshqasiga o''tkazish'),
    ('S3.NUM.03', 'S3.NUM', 's3-num-03', 'Turli sanoq sistemalarida arifmetik amallar'),
    ('S3.ALGO.01', 'S3.ALGO', 's3-algo-01', 'Algoritm va uning turlari'),
    ('S3.ALGO.02', 'S3.ALGO', 's3-algo-02', 'Blok-sxema va psevdokodda ifodalash'),
    ('S3.ALGO.03', 'S3.ALGO', 's3-algo-03', 'Masalaning algoritmini tuzish'),
    ('S3.ALGO.04', 'S3.ALGO', 's3-algo-04', 'Algoritmni tahlil qilish va maqbulini tanlash'),
    ('S4.BLOCK.01', 'S4.BLOCK', 's4-block-01', 'Scratch: o''zgaruvchilar va koordinatalar tekisligi'),
    ('S4.BLOCK.02', 'S4.BLOCK', 's4-block-02', 'Scratch: bloklar yordamida algoritm tuzish'),
    ('S4.BLOCK.03', 'S4.BLOCK', 's4-block-03', 'Scratch: shartli va takrorlanuvchi bloklar'),
    ('S4.BLOCK.04', 'S4.BLOCK', 's4-block-04', 'Scratch: Pen uskunasi bilan shakl chizish'),
    ('S4.BLOCK.05', 'S4.BLOCK', 's4-block-05', 'LOGO: toshbaqa grafikasi'),
    ('S4.CODE.01', 'S4.CODE', 's4-code-01', 'Python sintaksisi asoslari'),
    ('S4.CODE.02', 'S4.CODE', 's4-code-02', 'Python: o''zgaruvchi, shart, sikl'),
    ('S4.CODE.03', 'S4.CODE', 's4-code-03', 'Python: funksiya va massivlar'),
    ('S4.CODE.04', 'S4.CODE', 's4-code-04', 'JavaScript sintaksisi asoslari'),
    ('S4.CODE.05', 'S4.CODE', 's4-code-05', 'JavaScript: o''zgaruvchi, shart, sikl, funksiya, massiv'),
    ('S4.DB.01', 'S4.DB', 's4-db-01', 'Ma''lumotlar bazasi va SQL asoslari'),
    ('S4.DB.02', 'S4.DB', 's4-db-02', 'MS Access: jadval yaratish va ma''lumot kiritish'),
    ('S4.DB.03', 'S4.DB', 's4-db-03', 'Jadvallarni kalitlar orqali bog''lash'),
    ('S4.DB.04', 'S4.DB', 's4-db-04', 'So''rovlar yaratish'),
    ('S4.DB.05', 'S4.DB', 's4-db-05', 'Murakkab so''rovlar bilan masala yechish'),
    ('S5.WEB.01', 'S5.WEB', 's5-web-01', 'Kompyuter grafikasi turlari'),
    ('S5.WEB.02', 'S5.WEB', 's5-web-02', 'Rastrli va vektorli tasvirlar ustida amallar'),
    ('S5.WEB.03', 'S5.WEB', 's5-web-03', 'MS Paint va Adobe Photoshop'),
    ('S5.WEB.04', 'S5.WEB', 's5-web-04', 'HTML: matn, rasm, ro''yxat teglari'),
    ('S5.WEB.05', 'S5.WEB', 's5-web-05', 'HTML: jadval va forma teglari'),
    ('S5.WEB.06', 'S5.WEB', 's5-web-06', 'CSS stillarini HTML elementlariga qo''llash'),
    ('S6.NET.01', 'S6.NET', 's6-net-01', 'Kompyuter tarmoqlari va tarmoq qurilmalari'),
    ('S6.NET.02', 'S6.NET', 's6-net-02', 'Tarmoq arxitekturasi va topologiyalari'),
    ('S6.NET.03', 'S6.NET', 's6-net-03', 'IP manzillash va tarmoq maskasi'),
    ('S6.NET.04', 'S6.NET', 's6-net-04', 'Internetdan xavfsiz va maqsadli foydalanish'),
    ('S6.NET.05', 'S6.NET', 's6-net-05', 'Brauzer va qidiruv tizimlari'),
    ('S7.SEC.01', 'S7.SEC', 's7-sec-01', 'Axborot xavfsizligi tahdidlari va himoya'),
    ('S7.SEC.02', 'S7.SEC', 's7-sec-02', 'Zararli dastur va phishing'),
    ('S7.SEC.03', 'S7.SEC', 's7-sec-03', 'Antivirus va himoya vositalari'),
    ('S7.SEC.04', 'S7.SEC', 's7-sec-04', 'Elektron hukumat xizmatlari'),
    ('S7.SEC.05', 'S7.SEC', 's7-sec-05', 'SMM, CMS, LMS, MOOC tushunchalari'),
    ('S7.SEC.06', 'S7.SEC', 's7-sec-06', 'Freelance yo''nalishlari va platformalari'),
    ('KS.01', 'KS', 'ks-01', 'O''quv jarayonini rejalashtirish'),
    ('KS.02', 'KS', 'ks-02', 'Ta''lim samaradorligini ta''minlash'),
    ('KS.03', 'KS', 'ks-03', 'O''zlashtirishni baholash va qayta aloqa'),
    ('KS.04', 'KS', 'ks-04', 'Tarbiyaviy faoliyatni tashkil etish'),
    ('KS.05', 'KS', 'ks-05', 'Xavfsiz rivojlantiruvchi ta''lim muhiti'),
    ('KS.06', 'KS', 'ks-06', 'O''z-o''zini rivojlantirish va kasbiy o''sish'),
    ('KS.07', 'KS', 'ks-07', 'Hamkasblar va ota-onalar bilan hamkorlik'),
    ('PM.GEN.01', 'PM.GEN', 'pm-gen-01', 'Pedagogika, didaktika, tarbiya va yosh psixologiyasi asoslari'),
    ('PM.GEN.02', 'PM.GEN', 'pm-gen-02', 'Pedagogika tamoyillari'),
    ('PM.GEN.03', 'PM.GEN', 'pm-gen-03', 'Tarbiya va uning turlari'),
    ('PM.GEN.04', 'PM.GEN', 'pm-gen-04', 'Dars turlari, darsni rejalashtirish va sinfni boshqarish'),
    ('PM.GEN.05', 'PM.GEN', 'pm-gen-05', 'Sinf rahbari faoliyati va sinf hujjatlari'),
    ('PM.GEN.06', 'PM.GEN', 'pm-gen-06', 'Pedagogik etika, nutq, texnika, takt'),
    ('PM.GEN.07', 'PM.GEN', 'pm-gen-07', 'Pedagogik qobiliyat va uning turlari'),
    ('PM.GEN.08', 'PM.GEN', 'pm-gen-08', 'Ta''lim texnologiyalari'),
    ('PM.MET.01', 'PM.MET', 'pm-met-01', 'Informatika o''qitish yondashuvlari va metodikasi'),
    ('PM.MET.02', 'PM.MET', 'pm-met-02', 'O''qitish usullari va metodlarini farqlash'),
    ('PM.MET.03', 'PM.MET', 'pm-met-03', 'Ta''limiy vaziyatga oid qarorlarga baho berish')
) as seed(code, group_code, slug, title_uz)
where subject.code = 'informatika'
on conflict (code) do update
set subject_id = excluded.subject_id,
    group_code = excluded.group_code,
    slug = excluded.slug,
    title_uz = excluded.title_uz,
    is_active = true;

do $$
declare
  v_module_count int;
  v_quota_count int;
  v_question_count int;
  v_bilish int;
  v_qollash int;
  v_mulohaza int;
  v_construct_count int;
begin
  select count(*)
    into v_module_count
    from public.modules module
    join public.subjects subject on subject.id = module.subject_id
   where subject.code = 'informatika';

  select
    count(*),
    sum(quota.question_count),
    sum(quota.n_bilish),
    sum(quota.n_qollash),
    sum(quota.n_mulohaza)
  into
    v_quota_count,
    v_question_count,
    v_bilish,
    v_qollash,
    v_mulohaza
  from public.blueprint_quotas quota
  join public.blueprints blueprint on blueprint.id = quota.blueprint_id
  join public.subjects subject on subject.id = blueprint.subject_id
  where subject.code = 'informatika'
    and blueprint.version = 1;

  select count(*)
    into v_construct_count
    from public.constructs construct
    join public.subjects subject on subject.id = construct.subject_id
   where subject.code = 'informatika'
     and construct.is_active;

  if v_module_count <> 16 then
    raise exception 'official_seed_module_count: expected 16, received %',
      v_module_count;
  end if;

  if v_quota_count <> 15
     or v_question_count <> 50
     or v_bilish <> 8
     or v_qollash <> 35
     or v_mulohaza <> 7 then
    raise exception
      'official_seed_blueprint: expected 15/50/8/35/7, received %/%/%/%/%',
      v_quota_count,
      v_question_count,
      v_bilish,
      v_qollash,
      v_mulohaza;
  end if;

  if v_construct_count <> 76 then
    raise exception 'official_seed_construct_count: expected 76, received %',
      v_construct_count;
  end if;
end
$$;

commit;
