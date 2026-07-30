# 04 — Blueprint va seed ma'lumoti

Manba: rasmiy spetsifikatsiya, Toshkent — 2026.
Bu fayldagi raqamlar **o'ylab topilmagan** — ular hujjatdan olingan. O'zgartirmang.

---

## Ball chegaralari

`lib/exam/scoring.ts` da aynan shu mantiq bo'lishi kerak.

| Joriy toifa | Ball | Qaror |
|---|---|---|
| Oliy (bosh o'qituvchi) | ≥ 80 | Oliy toifa saqlanadi |
| Oliy | < 80 | Birinchi toifaga tushiriladi |
| Birinchi (yetakchi) | ≥ 80 | Oliy toifa beriladi |
| Birinchi | 70–79 | Birinchi toifa saqlanadi |
| Birinchi | < 70 | Ikkinchi toifaga tushiriladi |
| Ikkinchi (katta) | ≥ 70 | Birinchi toifa beriladi |
| Ikkinchi | 60–69 | Ikkinchi toifa saqlanadi |
| Ikkinchi | < 60 | Mutaxassis lavozimiga tushiriladi |
| Mutaxassis | ≥ 60 | Ikkinchi toifa beriladi |
| Mutaxassis | 55–59 | Mutaxassis lavozimi saqlanadi |
| Mutaxassis | < 55 | Attestatsiyadan o'tmagan |

**Qo'shimcha:** 86+ ball — vazir jamg'armasi ustamasi va "Yil o'qituvchisi"
saralashining birinchi bosqichi mezoni. Natija ekranida buni ko'rsating.

**Eslatma:** navbatdan tashqari attestatsiyada salbiy qaror qabul qilinmaydi
(toifa tushirilmaydi). UI'da foydalanuvchi joriy toifasini tanlaydi va natija
shunga qarab talqin qilinadi.

---

## Blueprint kvotalari

Jami 50 savol. Kognitiv: bilish 8, qo'llash 35, mulohaza 7.

| # | `group_code` | Guruh | Savol | Bilish | Qo'llash | Mulohaza |
|---|---|---|---|---|---|---|
| 1 | `S1.INFO` | Axborot, kodlash, o'lchov | 3 | 1 | 2 | 0 |
| 2 | `S2.HW` | Apparat, OT, fayl | 2 | 1 | 1 | 0 |
| 3 | `S2.OFFICE` | Word, Excel, PowerPoint | 5 | 0 | 5 | 0 |
| 4 | `S3.LOGIC` | Mantiq, rostlik jadvali | 3 | 0 | 2 | 1 |
| 5 | `S3.NUM` | Sanoq sistemalari | 2 | 0 | 2 | 0 |
| 6 | `S3.ALGO` | Algoritm, blok-sxema | 3 | 0 | 2 | 1 |
| 7 | `S4.BLOCK` | Scratch, LOGO | 3 | 0 | 3 | 0 |
| 8 | `S4.CODE` | Python, JavaScript | 3 | 0 | 2 | 1 |
| 9 | `S4.DB` | MB, SQL, Access | 2 | 0 | 2 | 0 |
| 10 | `S5.WEB` | Grafika, HTML, CSS | 5 | 1 | 4 | 0 |
| 11 | `S6.NET` | Tarmoq, IP | 2 | 0 | 2 | 0 |
| 12 | `S7.SEC` | Xavfsizlik, raqamli xizmat | 2 | 1 | 1 | 0 |
| 13 | `KS` | Kasb standarti | 5 | 1 | 3 | 1 |
| 14 | `PM.GEN` | Umumiy pedagogika | 7 | 2 | 4 | 1 |
| 15 | `PM.MET` | Informatika metodikasi | 3 | 1 | 0 | 2 |
| | **Jami** | | **50** | **8** | **35** | **7** |

Savollar tartibi imtihonda: 1–35 fan, 36–40 kasb standarti, 41–50 pedagogik mahorat.

---

## Bo'limlar (modules)

| # | slug | Sarlavha | Guruhlar | Mavzu | Imtihon savoli |
|---|---|---|---|---|---|
| 1 | `axborot-savodxonlik` | Axborot va raqamli savodxonlik | S1.INFO | 3 | 3 |
| 2 | `kompyuter-va-ofis` | Kompyuter tizimlari va ofis dasturlari | S2.HW, S2.OFFICE | 5 | 7 |
| 3 | `mantiq-va-algoritm` | Mantiq, sanoq sistemalari, algoritm | S3.LOGIC, S3.NUM, S3.ALGO | 6 | 8 |
| 4 | `dasturlash-va-mb` | Dasturlash va ma'lumotlar bazasi | S4.BLOCK, S4.CODE, S4.DB | 6 | 8 |
| 5 | `grafika-va-veb` | Grafika va veb-texnologiyalar | S5.WEB | 5 | 5 |
| 6 | `tarmoqlar` | Kompyuter tarmoqlari va IP | S6.NET | 2 | 2 |
| 7 | `axborot-xavfsizligi` | Axborot xavfsizligi va raqamli xizmatlar | S7.SEC | 2 | 2 |
| 8 | `kasb-standarti` | Kasb standarti | KS | 3 | 5 |
| 9 | `pedagogik-mahorat` | Pedagogik mahorat va metodika | PM.GEN, PM.MET | 3 | 10 |

**8 va 9-bo'limga alohida e'tibor:** ular imtihonning 30% ini (15 savol) tashkil
qiladi, lekin bozorda material kam. Kontent yozishni shu ikkisidan boshlang.

---

## Konstruktlar katalogi (76 ta)

Format: `code — title_uz`

### S1.INFO — 7
```
S1.INFO.01  Informatika, axborot, ma'lumot va bilim tushunchalarini farqlash
S1.INFO.02  Axborot turlari va manbalari
S1.INFO.03  Turli ko'rinishdagi axborotni kodlash
S1.INFO.04  Axborot o'lchov birliklari
S1.INFO.05  Axborot hajmini hisoblash
S1.INFO.06  Axborot uzatish tezligini hisoblash
S1.INFO.07  Raqamli muhitda axloq va mualliflik huquqi
```

### S2.HW — 4
```
S2.HW.01  Kompyuter qurilmalari va ularning vazifalari
S2.HW.02  Operatsion tizimlar va ularning imkoniyatlari
S2.HW.03  Fayl va papkalar bilan ishlash
S2.HW.04  Tizimli va amaliy dasturlarni farqlash
```

### S2.OFFICE — 4
```
S2.OFFICE.01  MS Word: hujjat formatlash va tuzilma
S2.OFFICE.02  MS Excel: formulalar va funksiyalar
S2.OFFICE.03  MS Excel: filtr, saralash, diagramma tahlili
S2.OFFICE.04  MS PowerPoint: taqdimot, animatsiya, o'tish effektlari
```

### S3.LOGIC — 4
```
S3.LOGIC.01  Sodda va murakkab mantiqiy mulohazalar tuzish
S3.LOGIC.02  Mantiqiy amallar bajarish
S3.LOGIC.03  Mantiqiy mulohazalar yordamida masala yechish
S3.LOGIC.04  Rostlik jadvali va mantiqiy sxemalar
```

### S3.NUM — 3
```
S3.NUM.01  Sanoq sistemalari asoslari
S3.NUM.02  Sonlarni bir sanoq sistemasidan boshqasiga o'tkazish
S3.NUM.03  Turli sanoq sistemalarida arifmetik amallar
```

### S3.ALGO — 4
```
S3.ALGO.01  Algoritm va uning turlari
S3.ALGO.02  Blok-sxema va psevdokodda ifodalash
S3.ALGO.03  Masalaning algoritmini tuzish
S3.ALGO.04  Algoritmni tahlil qilish va maqbulini tanlash
```

### S4.BLOCK — 5
```
S4.BLOCK.01  Scratch: o'zgaruvchilar va koordinatalar tekisligi
S4.BLOCK.02  Scratch: bloklar yordamida algoritm tuzish
S4.BLOCK.03  Scratch: shartli va takrorlanuvchi bloklar
S4.BLOCK.04  Scratch: Pen uskunasi bilan shakl chizish
S4.BLOCK.05  LOGO: toshbaqa grafikasi
```

### S4.CODE — 5
```
S4.CODE.01  Python sintaksisi asoslari
S4.CODE.02  Python: o'zgaruvchi, shart, sikl
S4.CODE.03  Python: funksiya va massivlar
S4.CODE.04  JavaScript sintaksisi asoslari
S4.CODE.05  JavaScript: o'zgaruvchi, shart, sikl, funksiya, massiv
```

### S4.DB — 5
```
S4.DB.01  Ma'lumotlar bazasi va SQL asoslari
S4.DB.02  MS Access: jadval yaratish va ma'lumot kiritish
S4.DB.03  Jadvallarni kalitlar orqali bog'lash
S4.DB.04  So'rovlar yaratish
S4.DB.05  Murakkab so'rovlar bilan masala yechish
```

### S5.WEB — 6
```
S5.WEB.01  Kompyuter grafikasi turlari
S5.WEB.02  Rastrli va vektorli tasvirlar ustida amallar
S5.WEB.03  MS Paint va Adobe Photoshop
S5.WEB.04  HTML: matn, rasm, ro'yxat teglari
S5.WEB.05  HTML: jadval va forma teglari
S5.WEB.06  CSS stillarini HTML elementlariga qo'llash
```

### S6.NET — 5
```
S6.NET.01  Kompyuter tarmoqlari va tarmoq qurilmalari
S6.NET.02  Tarmoq arxitekturasi va topologiyalari
S6.NET.03  IP manzillash va tarmoq maskasi
S6.NET.04  Internetdan xavfsiz va maqsadli foydalanish
S6.NET.05  Brauzer va qidiruv tizimlari
```

### S7.SEC — 6
```
S7.SEC.01  Axborot xavfsizligi tahdidlari va himoya
S7.SEC.02  Zararli dastur va phishing
S7.SEC.03  Antivirus va himoya vositalari
S7.SEC.04  Elektron hukumat xizmatlari
S7.SEC.05  SMM, CMS, LMS, MOOC tushunchalari
S7.SEC.06  Freelance yo'nalishlari va platformalari
```

### KS — 7
```
KS.01  O'quv jarayonini rejalashtirish
KS.02  Ta'lim samaradorligini ta'minlash
KS.03  O'zlashtirishni baholash va qayta aloqa
KS.04  Tarbiyaviy faoliyatni tashkil etish
KS.05  Xavfsiz rivojlantiruvchi ta'lim muhiti
KS.06  O'z-o'zini rivojlantirish va kasbiy o'sish
KS.07  Hamkasblar va ota-onalar bilan hamkorlik
```

### PM.GEN — 8
```
PM.GEN.01  Pedagogika, didaktika, tarbiya va yosh psixologiyasi asoslari
PM.GEN.02  Pedagogika tamoyillari
PM.GEN.03  Tarbiya va uning turlari
PM.GEN.04  Dars turlari, darsni rejalashtirish va sinfni boshqarish
PM.GEN.05  Sinf rahbari faoliyati va sinf hujjatlari
PM.GEN.06  Pedagogik etika, nutq, texnika, takt
PM.GEN.07  Pedagogik qobiliyat va uning turlari
PM.GEN.08  Ta'lim texnologiyalari
```

### PM.MET — 3
```
PM.MET.01  Informatika o'qitish yondashuvlari va metodikasi
PM.MET.02  O'qitish usullari va metodlarini farqlash
PM.MET.03  Ta'limiy vaziyatga oid qarorlarga baho berish
```

---

## Seed SQL namunasi

`supabase/seed/01_subject_modules.sql`:

```sql
insert into subjects (code, name_uz) values ('informatika', 'Informatika va AT');

insert into modules (subject_id, order_idx, slug, title_uz, status)
select s.id, v.idx, v.slug, v.title, 'published'
from subjects s, (values
  (1, 'axborot-savodxonlik',  'Axborot va raqamli savodxonlik'),
  (2, 'kompyuter-va-ofis',    'Kompyuter tizimlari va ofis dasturlari'),
  (3, 'mantiq-va-algoritm',   'Mantiq, sanoq sistemalari, algoritm'),
  (4, 'dasturlash-va-mb',     'Dasturlash va ma''lumotlar bazasi'),
  (5, 'grafika-va-veb',       'Grafika va veb-texnologiyalar'),
  (6, 'tarmoqlar',            'Kompyuter tarmoqlari va IP'),
  (7, 'axborot-xavfsizligi',  'Axborot xavfsizligi va raqamli xizmatlar'),
  (8, 'kasb-standarti',       'Kasb standarti'),
  (9, 'pedagogik-mahorat',    'Pedagogik mahorat va metodika')
) as v(idx, slug, title)
where s.code = 'informatika';
```

`supabase/seed/03_blueprint.sql`:

```sql
insert into blueprints
  (subject_id, version, effective_year, total_questions, duration_min, is_active)
select id, 1, 2026, 50, 120, true from subjects where code = 'informatika';

insert into blueprint_quotas
  (blueprint_id, group_code, order_idx, question_count, n_bilish, n_qollash, n_mulohaza)
select b.id, v.g, v.i, v.n, v.nb, v.nq, v.nm
from blueprints b, (values
  ('S1.INFO',   1, 3, 1, 2, 0),
  ('S2.HW',     2, 2, 1, 1, 0),
  ('S2.OFFICE', 3, 5, 0, 5, 0),
  ('S3.LOGIC',  4, 3, 0, 2, 1),
  ('S3.NUM',    5, 2, 0, 2, 0),
  ('S3.ALGO',   6, 3, 0, 2, 1),
  ('S4.BLOCK',  7, 3, 0, 3, 0),
  ('S4.CODE',   8, 3, 0, 2, 1),
  ('S4.DB',     9, 2, 0, 2, 0),
  ('S5.WEB',   10, 5, 1, 4, 0),
  ('S6.NET',   11, 2, 0, 2, 0),
  ('S7.SEC',   12, 2, 1, 1, 0),
  ('KS',       13, 5, 1, 3, 1),
  ('PM.GEN',   14, 7, 2, 4, 1),
  ('PM.MET',   15, 3, 1, 0, 2)
) as v(g, i, n, nb, nq, nm)
where b.version = 1;
```

Seed'dan keyin tekshiring:

```sql
select sum(question_count), sum(n_bilish), sum(n_qollash), sum(n_mulohaza)
from blueprint_quotas;
-- kutilgan natija: 50 | 8 | 35 | 7
```

---

## Savol zaxirasi talabi

Tanlash algoritmi takrorlanmaslikni ta'minlaydi, shuning uchun:

| Bosqich | Konstruktga savol | Jami | Holat |
|---|---|---|---|
| Minimal ishlaydigan | 4 | ~300 | mavzu testi ishlaydi |
| Qulay | 7 | ~530 | mock takrorlanmaydi |
| To'liq | 10 | ~760 | 3+ mock, SM-2 erkin |

**Generator bilan avtomatlashtiriladigan konstruktlar** (parametrik, cheksiz savol):

```
S1.INFO.04, S1.INFO.05, S1.INFO.06    axborot hajmi va tezligi
S3.NUM.01, S3.NUM.02, S3.NUM.03       sanoq sistemalari
S3.LOGIC.02, S3.LOGIC.04              mantiqiy amallar, rostlik jadvali
S6.NET.03                             IP manzil va maska
```

Bu 9 konstrukt ~180 savolni qo'lda yozmasdan beradi. Generator kodi
`lib/exam/generators/` da, natija `questions.is_generated = true` bilan yoziladi.

**Generator yozilmaydigan bloklar:** `KS.*` va `PM.*`. Bu savollar vaziyat
tahliliga asoslanadi va LLM ularda ishonchsiz. Har birini qo'lda yozing va
tekshiring.
