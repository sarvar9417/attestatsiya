-- ──────────────────────────────────────────────────────────────────────────
-- Seed: Informatika attestatsiya platformasi
-- Bazadagi joriy schema (20260730) bo'yicha yozilgan.
-- ──────────────────────────────────────────────────────────────────────────

-- 1. SUBJECT
insert into public.subjects (id, code, name_uz) values
  ('a0000000-0000-0000-0000-000000000001', 'INF', 'Informatika');

-- 2. MODULES (9 ta)
insert into public.modules (id, subject_id, order_idx, slug, title_uz, summary_uz, status) values
  ('m0010000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 'axborot-tizimlari', 'Axborot tizimlari va nazariy asoslar', 'Axborot hajmi, sanoq sistemalari, mantiq', 'published'),
  ('m0020000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2, 'kompyuter-tarmoqlari', 'Kompyuter tarmoqlari va Internet', 'Tarmoq topologiyasi, IP-maska, protokollar', 'published'),
  ('m0030000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 3, 'axborot-xavfsizligi', 'Axborot xavfsizligi va maʼlumotlarni himoyalash', 'Kriptografiya, ERI, tarmoq himoyasi', 'published'),
  ('m0040000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 4, 'malumotlar-bazasi', 'Maʼlumotlar bazasi boshqaruv tizimlari', 'SQL, normalizatsiya, indekslar', 'published'),
  ('m0050000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 5, 'dasturlash', 'Dasturlash va algoritmlar', 'Algoritmlar, tarmoqlanish, sikllar, massivlar', 'published'),
  ('m0060000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 6, 'operatsion-tizimlar', 'Operatsion tizimlar va amaliy dasturlar', 'Fayl tizimlari, jarayonlar, xotira', 'published'),
  ('m0070000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 7, 'multimedia', 'Multimedia va kompyuter grafikasi', 'Rang modellari, grafika va audio formatlari', 'published'),
  ('m0080000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 8, 'suniy-intellekt', 'Sunʼiy intellekt va maʼlumotlar tahlili', 'Mashina oʻqitish, neyron tarmoqlar, Big Data', 'published'),
  ('m0090000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 9, 'web-texnologiyalar', 'Web texnologiyalar va mobil ilovalar', 'HTML, CSS, JavaScript, API, mobil', 'published');

-- 3. CONSTRUCTS (76 ta, subject=INF, group_code S1-S9)
insert into public.constructs (id, subject_id, group_code, code, slug, title_uz) values
  ('c0010101','a0000000-0000-0000-0000-000000000001','S1','S1.INFO','axborot-hajmi','Axborot hajmi va oʻlchov birliklari'),
  ('c0010102','a0000000-0000-0000-0000-000000000001','S1','S1.NUM','sanoq-sistemalari','Sanoq sistemalari va ular orasidagi oʻtish'),
  ('c0010103','a0000000-0000-0000-0000-000000000001','S1','S1.TEXT','matnli-axborot','Matnli axborotni kodlashtirish'),
  ('c0010104','a0000000-0000-0000-0000-000000000001','S1','S1.GRAPH','grafik-axborot','Grafik axborotni kodlashtirish'),
  ('c0010105','a0000000-0000-0000-0000-000000000001','S1','S1.BOOL','mantiq-amallari','Mantiq amallari va ifodalar'),
  ('c0010106','a0000000-0000-0000-0000-000000000001','S1','S1.CIRC','mantiq-sxemalari','Mantiq sxemalari va jadvallar'),
  ('c0010107','a0000000-0000-0000-0000-000000000001','S1','S1.DATA','malumot-modellari','Maʼlumot modellari va tuzilmalari'),
  ('c0010108','a0000000-0000-0000-0000-000000000001','S1','S1.SYS','axborot-tizimlari','Axborot tizimlari turlari'),

  ('c0020101','a0000000-0000-0000-0000-000000000001','S2','S2.TOPO','tarmoq-topologiyasi','Tarmoq topologiyalari va klassifikatsiyasi'),
  ('c0020102','a0000000-0000-0000-0000-000000000001','S2','S2.DEV','tarmoq-qurilmalari','Tarmoq qurilmalari va ularning vazifalari'),
  ('c0020103','a0000000-0000-0000-0000-000000000001','S2','S2.OSI','osi-modeli','OSI va TCP/IP modellari'),
  ('c0020104','a0000000-0000-0000-0000-000000000001','S2','S2.IP','ip-maska','IP-maska va manzillash'),
  ('c0020105','a0000000-0000-0000-0000-000000000001','S2','S2.DNS','domen-dns','Domen nomlari va DNS'),
  ('c0020106','a0000000-0000-0000-0000-000000000001','S2','S2.PROTO','internet-protokollari','Internet protokollari (HTTP, FTP, SMTP)'),
  ('c0020107','a0000000-0000-0000-0000-000000000001','S2','S2.MAIL','elektron-pochta','Elektron pochta va messenjerlar'),
  ('c0020108','a0000000-0000-0000-0000-000000000001','S2','S2.CLOUD','bulutli-texnologiyalar','Bulutli texnologiyalar va masofaviy xizmatlar'),

  ('c0030101','a0000000-0000-0000-0000-000000000001','S3','S3.THREAT','xavfsizlik-tahdidlari','Axborot xavfsizligi tahdidlari'),
  ('c0030102','a0000000-0000-0000-0000-000000000001','S3','S3.CRYPTO','kriptografiya','Kriptografiya asoslari'),
  ('c0030103','a0000000-0000-0000-0000-000000000001','S3','S3.SIGN','elektron-imzo','Elektron raqamli imzo'),
  ('c0030104','a0000000-0000-0000-0000-000000000001','S3','S3.PASS','parol-siylari','Parol siyosati va autentifikatsiya'),
  ('c0030105','a0000000-0000-0000-0000-000000000001','S3','S3.MAL','zararli-dasturlar','Zararli dasturlar va viruslardan himoya'),
  ('c0030106','a0000000-0000-0000-0000-000000000001','S3','S3.FW','tarmoq-himoyasi','Tarmoq xavfsizligi (firewall, IDS)'),
  ('c0030107','a0000000-0000-0000-0000-000000000001','S3','S3.PRIV','shaxsiy-malumot','Shaxsiy maʼlumotlarni himoyalash (GDPR)'),
  ('c0030108','a0000000-0000-0000-0000-000000000001','S3','S3.SAFE','xavfsiz-internet','Xavfsiz internet va onlayn xulq'),

  ('c0040101','a0000000-0000-0000-0000-000000000001','S4','S4.TYPE','mbt-turlari','MBT turlari (relatsion, NoSQL)'),
  ('c0040102','a0000000-0000-0000-0000-000000000001','S4','S4.SQL','sql-asoslari','SQL asoslari (SELECT, INSERT, UPDATE, DELETE)'),
  ('c0040103','a0000000-0000-0000-0000-000000000001','S4','S4.JOIN','murakkab-sql','Murakkab SQL soʻrovlar (JOIN, subquery)'),
  ('c0040104','a0000000-0000-0000-0000-000000000001','S4','S4.NORM','normalizatsiya','Maʼlumotlar bazasini normalizatsiyalash'),
  ('c0040105','a0000000-0000-0000-0000-000000000001','S4','S4.IDX','indekslar','Indekslar va soʻrov optimizatsiyasi'),
  ('c0040106','a0000000-0000-0000-0000-000000000001','S4','S4.ACID','transaksiyalar','Transaksiyalar va ACID prinsiplari'),
  ('c0040107','a0000000-0000-0000-0000-000000000001','S4','S4.ER','er-modeli','ER modeli va diagrammalar'),
  ('c0040108','a0000000-0000-0000-0000-000000000001','S4','S4.DWH','malumotlar-ombori','Maʼlumotlar ombori va ETL'),

  ('c0050101','a0000000-0000-0000-0000-000000000001','S5','S5.ALGO','algoritm-tushunchasi','Algoritm tushunchasi va xossalari'),
  ('c0050102','a0000000-0000-0000-0000-000000000001','S5','S5.FLOW','blok-sxemalari','Blok-sxemalar va psevdokod'),
  ('c0050103','a0000000-0000-0000-0000-000000000001','S5','S5.LANG','dasturlash-tillari','Dasturlash tillari klassifikatsiyasi'),
  ('c0050104','a0000000-0000-0000-0000-000000000001','S5','S5.VAR','ozgaruvchilar','Oʻzgaruvchilar, turlar, konstantalar'),
  ('c0050105','a0000000-0000-0000-0000-000000000001','S5','S5.IF','shart-operatorlari','Shart operatorlari (if, switch)'),
  ('c0050106','a0000000-0000-0000-0000-000000000001','S5','S5.LOOP','sikllar','Sikllar (for, while)'),
  ('c0050107','a0000000-0000-0000-0000-000000000001','S5','S5.ARR','massivlar','Massivlar va roʻyxatlar'),
  ('c0050108','a0000000-0000-0000-0000-000000000001','S5','S5.FUNC','funktsiyalar','Funksiyalar va protseduralar'),
  ('c0050109','a0000000-0000-0000-0000-000000000001','S5','S5.SORT','saralash-qidirish','Saralash va qidirish algoritmlari'),
  ('c0050110','a0000000-0000-0000-0000-000000000001','S5','S5.FILE','fayllar-bilan-ishlash','Fayllar va maʼlumotlar oqimi bilan ishlash'),

  ('c0060101','a0000000-0000-0000-0000-000000000001','S6','S6.OS','ot-tushunchasi','Operatsion tizim tushunchasi va vazifalari'),
  ('c0060102','a0000000-0000-0000-0000-000000000001','S6','S6.FS','fayl-tizimlari','Fayl tizimlari (FAT, NTFS, ext4)'),
  ('c0060103','a0000000-0000-0000-0000-000000000001','S6','S6.PROC','jarayonlar','Jarayonlar va ularni boshqarish'),
  ('c0060104','a0000000-0000-0000-0000-000000000001','S6','S6.MEM','xotira-boshqaruvi','Xotirani boshqarish'),
  ('c0060105','a0000000-0000-0000-0000-000000000001','S6','S6.APP','amaliy-dasturlar','Amaliy dasturlar va utilitalar'),
  ('c0060106','a0000000-0000-0000-0000-000000000001','S6','S6.EDIT','matn-muharrirlari','Matn muharrirlari va ofis dasturlari'),
  ('c0060107','a0000000-0000-0000-0000-000000000001','S6','S6.GUI','grafik-interfeys','Grafik interfeys va buyruqlar satri'),
  ('c0060108','a0000000-0000-0000-0000-000000000001','S6','S6.BACKUP','malumot-arxivlash','Maʼlumotlarni arxivlash va zaxiralash'),

  ('c0070101','a0000000-0000-0000-0000-000000000001','S7','S7.TYPE','grafika-turlari','Kompyuter grafikasi turlari (rastr, vektor)'),
  ('c0070102','a0000000-0000-0000-0000-000000000001','S7','S7.COLOR','rang-modellari','Rang modellari (RGB, CMYK, HSB)'),
  ('c0070103','a0000000-0000-0000-0000-000000000001','S7','S7.FMT','grafika-formatlari','Grafik formatlari (JPEG, PNG, SVG)'),
  ('c0070104','a0000000-0000-0000-0000-000000000001','S7','S7.AUDIO','audio-formati','Audio formatlari va kodlash'),
  ('c0070105','a0000000-0000-0000-0000-000000000001','S7','S7.VIDEO','video','Video formatlari va montaj asoslari'),
  ('c0070106','a0000000-0000-0000-0000-000000000001','S7','S7.MMEDIA','multimedia-ilovalari','Multimedia ilovalari vositalari'),
  ('c0070107','a0000000-0000-0000-0000-000000000001','S7','S7.3D','3d-grafika','3D grafikaga kirish'),
  ('c0070108','a0000000-0000-0000-0000-000000000001','S7','S7.DESIGN','dizayn-prinsiplari','Dizayn prinsiplari va kompozitsiya'),

  ('c0080101','a0000000-0000-0000-0000-000000000001','S8','S8.AI','si-tushunchasi','Sunʼiy intellekt tushunchasi va tarixi'),
  ('c0080102','a0000000-0000-0000-0000-000000000001','S8','S8.ML','mashina-oqitish','Mashina oʻqitish turlari'),
  ('c0080103','a0000000-0000-0000-0000-000000000001','S8','S8.NN','neyron-tarmoqlar','Neyron tarmoqlar asoslari'),
  ('c0080104','a0000000-0000-0000-0000-000000000001','S8','S8.NLP','tabiiy-til','Tabiiy tilni qayta ishlash'),
  ('c0080105','a0000000-0000-0000-0000-000000000001','S8','S8.CV','kompyuter-korish','Kompyuter koʻrish'),
  ('c0080106','a0000000-0000-0000-0000-000000000001','S8','S8.EXPERT','ekspert-tizimlari','Ekspert tizimlari va bilim bazalari'),
  ('c0080107','a0000000-0000-0000-0000-000000000001','S8','S8.DS','malumotlar-tahlili','Maʼlumotlar tahlili (Data Science)'),
  ('c0080108','a0000000-0000-0000-0000-000000000001','S8','S8.BIGDATA','katta-malumotlar','Katta maʼlumotlar (Big Data)'),

  ('c0090101','a0000000-0000-0000-0000-000000000001','S9','S9.HTML','web-asoslari','Web texnologiyalar asoslari (HTML, CSS)'),
  ('c0090102','a0000000-0000-0000-0000-000000000001','S9','S9.JS','javascript-asoslari','JavaScript asoslari'),
  ('c0090103','a0000000-0000-0000-0000-000000000001','S9','S9.FRONT','frontend','Frontend freymvorklari (React, Vue)'),
  ('c0090104','a0000000-0000-0000-0000-000000000001','S9','S9.BACK','backend','Backend texnologiyalari (Node.js, PHP)'),
  ('c0090105','a0000000-0000-0000-0000-000000000001','S9','S9.API','api','API va RESTful xizmatlar'),
  ('c0090106','a0000000-0000-0000-0000-000000000001','S9','S9.JSON','malumotlar-almashinuvi','Maʼlumotlar almashinuvi (JSON, XML)'),
  ('c0090107','a0000000-0000-0000-0000-000000000001','S9','S9.MOBILE','mobil-ilovalar','Mobil ilovalar turlari (native, hybrid)'),
  ('c0090108','a0000000-0000-0000-0000-000000000001','S9','S9.WSEC','web-xavfsizligi','Web xavfsizligi (CORS, XSS, CSRF)');

-- 4. BLUEPRINT (2026-yil uchun, 50 savol, 150 min)
insert into public.blueprints (id, subject_id, version, effective_year, total_questions, duration_min, points_per_item, is_active) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 2026, 50, 150, 2, true);

-- 5. BLUEPRINT QUOTAS (9 group, jami 50)
insert into public.blueprint_quotas (id, blueprint_id, group_code, order_idx, question_count, n_bilish, n_qollash, n_mulohaza) values
  ('bq010000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S1',1, 8,  5, 1, 2),
  ('bq020000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S2',2, 7,  4, 1, 2),
  ('bq030000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S3',3, 5,  3, 1, 1),
  ('bq040000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S4',4, 6,  4, 1, 1),
  ('bq050000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S5',5, 10, 7, 1, 2),
  ('bq060000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S6',6, 4,  3, 0, 1),
  ('bq070000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S7',7, 3,  2, 0, 1),
  ('bq080000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S8',8, 4,  3, 0, 1),
  ('bq090000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','S9',9, 3,  2, 1, 0);
-- jami: 8+7+5+6+10+4+3+4+3 = 50; bilish=33, qollash=5, mulohaza=12 → 50

-- 6. LESSONS (M01 uchun 3 ta dars + M02 uchun 1 ta)
insert into public.lessons (id, module_id, order_idx, slug, title_uz, body_mdx, est_minutes, status) values
  ('l0010100-0000-0000-0000-000000000001','m0010000-0000-0000-0000-000000000001',1,'axborot-hajmi','Axborot hajmi va oʻlchov birliklari','# Axborot hajmi\n\nAxborot hajmi bitlarda oʻlchanadi. 1 bayt = 8 bit.',15,'published'),
  ('l0010100-0000-0000-0000-000000000002','m0010000-0000-0000-0000-000000000001',2,'sanoq-sistemalari','Sanoq sistemalari','# Sanoq sistemalari\n\nIkkilik, sakkizlik, oʻnlik, oʻn oltilik.',15,'published'),
  ('l0010100-0000-0000-0000-000000000003','m0010000-0000-0000-0000-000000000001',3,'mantiq-amallari','Mantiq amallari','# Mantiq amallari\n\nVA (AND), YOKI (OR), EMAS (NOT).',15,'published');

-- 7. LESSON_CONSTRUCTS
insert into public.lesson_constructs (lesson_id, construct_id) values
  ('l0010100-0000-0000-0000-000000000001','c0010101'),
  ('l0010100-0000-0000-0000-000000000002','c0010102'),
  ('l0010100-0000-0000-0000-000000000003','c0010105'),
  ('l0010100-0000-0000-0000-000000000003','c0010106');

-- 8. SAMPLE QUESTIONS (Y1, published)
do $$
declare
  v_id uuid;
begin
  insert into public.questions (id, subject_id, construct_id, group_code, format, cognitive, difficulty, stem_md, is_generated, status) values
    ('q0000010-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','c0010101','S1','Y1','bilish',2,'512 bayt necha **bit**?',false,'published')
  on conflict (id) do nothing returning id into v_id;
  if v_id is not null then
    insert into public.question_options (question_id, side, order_idx, content_md) values
      (v_id,'a',1,'512'), (v_id,'a',2,'4096'), (v_id,'a',3,'2048'), (v_id,'a',4,'1024');
    insert into public.question_keys (question_id, payload, explanation_md) values
      (v_id,'{"correct_option_id":"a2"}','1 bayt = 8 bit, 512 × 8 = 4096 bit');
  end if;

  insert into public.questions (id, subject_id, construct_id, group_code, format, cognitive, difficulty, stem_md, is_generated, status) values
    ('q0000020-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','c0010102','S1','Y1','qollash',3,'1010₂ sonining oʻnlik qiymatini toping.',false,'published')
  on conflict (id) do nothing returning id into v_id;
  if v_id is not null then
    insert into public.question_options (question_id, side, order_idx, content_md) values
      (v_id,'a',1,'10'), (v_id,'a',2,'8'), (v_id,'a',3,'12'), (v_id,'a',4,'14');
    insert into public.question_keys (question_id, payload, explanation_md) values
      (v_id,'{"correct_option_id":"a1"}','1010₂ = 1×8 + 0×4 + 1×2 + 0×1 = 10₁₀');
  end if;

  insert into public.questions (id, subject_id, construct_id, group_code, format, cognitive, difficulty, stem_md, is_generated, status) values
    ('q0000030-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','c0010105','S1','Y1','bilish',2,'A ∧ (B ∨ ¬B) ifodasi nimaga teng?',false,'published')
  on conflict (id) do nothing returning id into v_id;
  if v_id is not null then
    insert into public.question_options (question_id, side, order_idx, content_md) values
      (v_id,'a',1,'A'), (v_id,'a',2,'B'), (v_id,'a',3,'¬A'), (v_id,'a',4,'1');
    insert into public.question_keys (question_id, payload, explanation_md) values
      (v_id,'{"correct_option_id":"a1"}','B ∨ ¬B = 1, A ∧ 1 = A');
  end if;

  insert into public.questions (id, subject_id, construct_id, group_code, format, cognitive, difficulty, stem_md, is_generated, status) values
    ('q0000040-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','c0020104','S2','Y1','qollash',3,'255.255.255.0 ni CIDR formatida yozing.',false,'published')
  on conflict (id) do nothing returning id into v_id;
  if v_id is not null then
    insert into public.question_options (question_id, side, order_idx, content_md) values
      (v_id,'a',1,'16'), (v_id,'a',2,'24'), (v_id,'a',3,'8'), (v_id,'a',4,'32');
    insert into public.question_keys (question_id, payload, explanation_md) values
      (v_id,'{"correct_option_id":"a2"}','255.255.255.0 = 24 ta 1-bit (3 oktet toʻliq)');
  end if;

  insert into public.questions (id, subject_id, construct_id, group_code, format, cognitive, difficulty, stem_md, is_generated, status) values
    ('q0000050-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','c0040102','S4','Y1','bilish',1,'Maʼlumot olish uchun qaysi SQL buyrugʻi ishlatiladi?',false,'published')
  on conflict (id) do nothing returning id into v_id;
  if v_id is not null then
    insert into public.question_options (question_id, side, order_idx, content_md) values
      (v_id,'a',1,'SELECT'), (v_id,'a',2,'INSERT'), (v_id,'a',3,'UPDATE'), (v_id,'a',4,'DELETE');
    insert into public.question_keys (question_id, payload, explanation_md) values
      (v_id,'{"correct_option_id":"a1"}','SELECT — maʼlumot olish; INSERT — qoʻshish; UPDATE — yangilash; DELETE — oʻchirish');
  end if;
end $$;
