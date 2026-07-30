# KONTENT SIFAT HISOBOTI — darsliklar/ va Topics/

> **Sana:** 2026-07-30
> **Tekshirilgan:** 15 ta PDF (711 MB) → 15 ta `.txt` (2 554 sahifa, 4.9 MB) + `Topics/` 26 fayl (3.6 MB)
> **Usul:** sahifa darajasida ekstraksiya zichligi, matn shovqini, takrorlanish, atribusiya, blueprint qamrovi

---

## 0. Xulosa

| Aktiv | Baho | Qaror |
|---|---|---|
| `darsliklar/*.pdf` | ✅ **To'liq** — 15/15 fayl | Saqlanadi (git'dan tashqarida) |
| `darsliklar/extracted/*.txt` | ✅ **Yaxshi** — 2 554 sahifa, 0–2% bo'sh | **Asosiy muallif korpusi** |
| `Topics/*.txt` | ❌ **Ishlatilmaydi** — 43% takror, atribusiya yo'q, xato klassifikatsiya | Qayta generatsiya qilinadi |
| **KS + PM manbalari** | 🔴 **YO'Q** — imtihonning 30%i | **Bloklovchi (B-001)** |

Ikki xulosa muhim:

1. **PDF ekstraksiyasi sifatli.** 2 554 sahifadan atigi 13 tasi bo'sh (0.5%). Sahifa
   markerlari saqlangan → **har iqtibos sahifa raqami bilan tekshirilishi mumkin**.
   Bu `ADR-011` (source traceability) uchun aynan kerak bo'lgan narsa.

2. **`Topics/` papkasi ekstraksiyadan orqada.** U sahifa raqamlarini yo'qotgan,
   43% kontentni takrorlagan, spetsifikatsiya matnini dars materiali deb aralashtirgan
   va bir necha faylni butunlay xato klassifikatsiya qilgan. Uni tuzatishdan ko'ra
   `extracted/` dan qayta generatsiya qilish arzon.

---

## 1. PDF → TXT ekstraksiya sifati ✅

### 1.1 Qamrov

| Darslik | PDF | TXT | Sahifa | Bo'sh sahifa |
|---|---:|---:|---:|---:|
| 10-11-sinf Cambridge+ | 86 MB | 1 144 KB | 360 | 1 |
| 9-sinf Cambridge+ | 133 MB | 940 KB | 316 | 1 |
| ICT 11-sinf 2021 | 49 MB | 577 KB | 340 | 0 |
| ICT 10-sinf 2021 | 28 MB | 421 KB | 257 | 1 |
| ICT 6-sinf 2021 | 25 MB | 275 KB | 160 | 0 |
| 6-sinf Cambridge+ | 93 MB | 271 KB | 244 | 2 |
| ICT 9-sinf 2020 | 2.5 MB | 228 KB | 114 | 2 |
| 7-sinf Cambridge+ | 38 MB | 208 KB | 147 | 2 |
| ICT 8-sinf 2020 | 71 MB | 198 KB | 113 | 1 |
| 8-sinf Cambridge+ | 76 MB | 185 KB | 153 | 1 |
| ICT 5-sinf 2020 | 35 MB | 171 KB | 113 | 1 |
| 5-sinf Cambridge+ | 39 MB | 162 KB | 139 | 1 |
| ICT 7-sinf 2021 | 31 MB | 126 KB | 82 | 0 |
| Spetsifikatsiya 2026 | 300 KB | 16 KB | 10 | 0 |
| Adabiyotlar | 192 KB | 11 KB | 6 | 0 |
| **Jami** | **711 MB** | **4.9 MB** | **2 554** | **13 (0.5%)** |

Barcha 15 PDF ekstraksiya qilingan, yo'qolgan fayl yo'q. Bo'sh sahifalar — muqova
va bo'lim ajratgichlari, ya'ni normal.

### 1.2 Kuchli tomoni — sahifa markerlari

```
===== SAHIFA 47 =====
```

Har sahifa alohida belgilangan. Bu `source_locators.pdf_page_from/to` ni
avtomatik to'ldirish imkonini beradi — muallif "Milliy 7, 23-sahifa" deb yozganda
tekshirib bo'ladi. **Bu korpusning eng qimmatli xususiyati.**

### 1.3 Ekstraksiya cheklovlari 🟡

| Muammo | Ta'siri | Nima qilish |
|---|---|---|
| **Kod indentatsiyasi yo'qolgan** | Python/JS savollari to'g'ridan-to'g'ri ko'chirilmaydi | Kod qo'lda qayta yozilib, ishga tushirib tekshiriladi (`06-CONTENT-STANDARD.md` §10) |
| **Jadval tuzilishi yo'qolgan** | Excel/rostlik jadvali savollari uchun struktura kerak | Jadval qo'lda `table` blokida qayta tuziladi |
| **Rasm/diagramma yo'q** | Blok-sxema, Scratch skrinshot, mantiqiy sxema | Diagrammalar qayta chiziladi (copyright uchun ham shart) |
| **MUNDARIJA shovqini** | `.........13` ko'rinishidagi qatorlar | Muallif ko'radi, avtomatik tozalash oson |
| **Formula Unicode'i** | `“<0”` qiyshiq qo'shtirnoq — kodga tushsa buziladi | Import validatorida normalizatsiya |

**Muhim:** bu cheklovlar aslida **muammo emas**. Copyright qoidasi (`ADR-015`) matnni
ko'chirishni allaqachon taqiqlaydi — korpus faqat **fakt tekshirish va sahifa
iqtibosi** uchun. Kod va jadvalni qo'lda yozish talab qilinadigan ish.

### 1.4 Apostrof normalizatsiyasi 🟠 → ✅ TUZATILDI

> **Tuzatish:** bu bo'limning birinchi versiyasida "99.4% to'g'ri" deb yozilgan edi.
> **Bu xato edi** — o'lchov shell orqali olingan va zsh Unicode qo'shtirnoq
> belgilarini bir-biriga aylashtirib yuborgan. Python bilan qayta o'lchanganda
> muammo ancha kattaligi aniqlandi.

**Tozalashdan oldingi haqiqiy holat:**

| Belgi | Soni | Baho |
|---|---:|---|
| `ʻ` U+02BB | 26 045 | ✅ to'g'ri (oʻ, gʻ) |
| `ʼ` U+02BC | 5 323 | ✅ to'g'ri (tutuq belgisi) |
| `‘` U+2018 | 24 779 | ❌ nostandart |
| `’` U+2019 | 7 037 | ❌ nostandart |
| `'` U+0027 | 883 | ❌ nostandart |
| `` ` `` U+0060 | 18 | ❌ nostandart |

**Nostandart: 32 717 / 64 085 = 51.1%.** Ya'ni `oʻzgaruvchi` deb qidirilganda
korpusning yarmi topilmasdi — bu `NFR-12` uchun kritik.

**Tozalashdan keyin: 97.8% to'g'ri.** Qolgan 1 395 ta — haqiqiy qo'shtirnoq va
Python satr literallari (`['nexia', 'spark']`), ular ataylab o'zgartirilmadi.

### 1.5 Kirill homoglifi 🟠 → ✅ TUZATILDI

Birinchi tekshiruvda o'tkazib yuborilgan muammo: ekstraksiyada ba'zi lotin
harflari **kirill ekvivalenti** bilan chiqqan:

| Xato | To'g'ri | Sabab |
|---|---|---|
| `Тoshkent` | `Toshkent` | kirill `Т` U+0422 |
| `Оperatsion` | `Operatsion` | kirill `О` U+041E |
| `tugmaсhasi` | `tugmachasi` | kirill `с` U+0441 |
| `mikrotо‘lqin` | `mikrotoʻlqin` | kirill `о` U+043E |

**337 ta so'z zararlangan** — ular qidiruvda topilmasdi. Korpusdagi qolgan
~7 000 kirill belgisi asl rus matni va **o'zgartirilmadi** (tuzatish faqat lotin
so'z ichidagi kirill harfiga qo'llanadi).

**Tozalashdan keyin: 0.**

---

## 2. `Topics/` sifati ❌

`Topics/` — `extracted/` matnini 25 mavzu bo'yicha avtomatik guruhlash urinishi.
Natija ishlatishga yaroqsiz.

### 2.1 Sahifa raqami yo'qolgan — eng katta yo'qotish 🔴

`Topics/` da 3 335 kontent blokidan **birortasida ham sahifa markeri yo'q.**
Atribusiya faqat darslik darajasida:

```
📘 10-11-sinf Cambridge+ darsligidan (10-11-sinf informatika (Cambridge +). txt)
```

Qaysi darslik — ma'lum. Qaysi sahifa — **yo'q**. Ya'ni `source_locators` ni
to'ldirib bo'lmaydi va `ADR-011` bajarilmaydi. Muallif 360 sahifalik darslikni
qo'lda titkilashiga to'g'ri keladi — bu `extracted/` dan qidirishdan **sekinroq**.

### 2.2 Takrorlanish: 43% 🔴

```
Jami kontent bloki:              3 335
Takrorlangan (unikal matn):        551
Takrorlangan nusxalar jami:      1 437   ← 43%
```

Bir xil matn o'rtacha 2.6 faylda takrorlanadi. 3.6 MB dan taxminan 1.5 MB — nusxa.

### 2.3 Xato klassifikatsiya 🔴

| Fayl | Sarlavhaga ko'ra | Haqiqiy mazmuni |
|---|---|---|
| `02_Sanoq_sistemalari.txt` | Sanoq sistemalari | **Spetsifikatsiya PDF fragmentlari** — dars materiali yo'q |
| `17_Sun'iy_intellekt.txt` | Sun'iy intellekt | **"Kompyuter turlari"** — laptop, desktop |
| `24_Elektron_hukumat.txt` | Elektron hukumat | **MUNDARIJA** ro'yxati |

`02_Sanoq_sistemalari.txt` eng jiddiy holat: 5 707 bayt, 18 satr, va birinchi blok
kesilgan so'zdan boshlanadi (`stlik jadvali` = `rostlik jadvali`). Sanoq sistemalari
— imtihonda 2 savol va 3 konstrukt. Bu fayl **nol qiymat** beradi, holbuki
`extracted/` da bu mavzu bo'yicha **29 sahifa** bor.

### 2.4 Spetsifikatsiya matni dars materialiga aralashgan 🟠

7 faylda spetsifikatsiya PDF matni kontent sifatida joylashgan:

| Fayl | Marta |
|---|---:|
| `01_Axborot_va_kodlash.txt` | 11 |
| `10_Dasturlash_Scratch.txt` | 6 |
| `18_Mantiq_asoslari.txt` | 4 |
| `02_Sanoq_sistemalari.txt` | 3 |
| `09_Ma'lumotlar_bazasi.txt` | 3 |
| `07_Tasvirlar_va_grafikalar.txt` | 2 |
| `12_Internet_va_tarmoqlar.txt` | 1 |

Xavf: LLM bilan savol yozganda spetsifikatsiya bandining o'zi "dars matni" deb
tushunilib, savol konstruktni tekshirmasdan spetsifikatsiyani takrorlashi mumkin.

### 2.5 Kesilgan bloklar 🟠

- **380 / 3 335 blok (11%)** kichik harf bilan boshlanadi → gap o'rtasidan kesilgan.
- **272 `📌` sarlavhadan faqat 83 tasi (30%)** to'liq gap. Median uzunlik 58 belgi,
  maksimum 90 — ya'ni sarlavhalar qat'iy belgi chegarasida kesilgan.

### 2.6 Atribusiyasiz fayllar 🟠

6 faylda `📘` atribusiya bloki **umuman yo'q**: `02_Sanoq_sistemalari`,
`17_Sun'iy_intellekt`, `20_Blockchain_VR_AR`, `21_Mobil_ilovalar`, `22_SMM_va_media`,
`23_LMS_va_MOOC`, `24_Elektron_hukumat`. Kontent bor, manbasi noma'lum.

### 2.7 Taksonomiya mosligi 🟠

25 mavzu nomlari na 15 blueprint guruhiga, na 16 modulga mos kelmaydi.
`17_Sun'iy_intellekt`, `20_Blockchain_VR_AR`, `21_Mobil_ilovalar` —
**imtihonda alohida blok sifatida mavjud emas** (bu `supabase/seed.sql` dagi
xato taksonomiya bilan bir xil manba xatosi: universitet IT kursi tuzilishi).

---

## 3. Blueprint qamrovi — asosiy natija

`extracted/` da har guruh mavzusi bo'yicha necha sahifa mavjudligi:

| Guruh | Mavzu | Imtihon savoli | Sahifa | Baho |
|---|---|:---:|---:|---|
| `S1.INFO` | Axborot, kodlash, o'lchov | 3 | 26 | 🟡 o'rtacha |
| `S2.HW` | Apparat, OT, fayl | 2 | 165 | ✅ |
| `S2.OFFICE` | Word, Excel, PowerPoint | **5** | 178 | ✅ |
| `S3.LOGIC` | Mantiq, rostlik jadvali | 3 | 19 | 🟡 o'rtacha |
| `S3.NUM` | Sanoq sistemalari | 2 | 29 | 🟡 o'rtacha |
| `S3.ALGO` | Algoritm, blok-sxema | 3 | 142 | ✅ |
| `S4.BLOCK` | Scratch, LOGO | 3 | 100 | ✅ |
| `S4.CODE` | Python, JavaScript | 3 | 98 | ✅ |
| `S4.DB` | MB, Access, SQL | 2 | 242 | ✅ |
| `S5.WEB` | Grafika, HTML, CSS | **5** | 178 | ✅ |
| `S6.NET` | Tarmoq, IP | 2 | 369 | ✅ |
| `S7.SEC` | Xavfsizlik, raqamli xizmat | 2 | 174 | ✅ |
| `KS` | Kasb standarti | **5** | **2** | 🔴 **YO'Q** |
| `PM.GEN` | Umumiy pedagogika | **7** | **1** | 🔴 **YO'Q** |
| `PM.MET` | Informatika metodikasi | **3** | **2** | 🔴 **YO'Q** |

### 3.1 Mutaxassislik fani (35 savol) — manba yetarli ✅

12 guruhning 9 tasida bemalol yetarli material. Uchtasi o'rtacha:

- **`S1.INFO` (26 sahifa, 3 savol)** — axborot hajmi va uzatish tezligi hisoblash
  savollari **parametrik generator** bilan yopiladi (`axborotHajmi.ts`), demak
  manba kamligi muammo emas.
- **`S3.NUM` (29 sahifa, 2 savol)** — xuddi shunday, `sanoqSistema.ts` generatori.
- **`S3.LOGIC` (19 sahifa, 3 savol)** — `mantiqAmal.ts` generatori rostlik jadvali
  va mantiqiy amallarni yopadi. Qolgan "mantiqiy mulohaza tuzish" qismi qo'lda.

Ya'ni **eng kam manbali uch guruh aynan generator yoziladigan guruhlar** — reja
to'g'ri tuzilgan.

### 3.2 Excel formulalari — diqqat talab qiladigan nuqta 🟠

Butun korpusda **10 dan kam** Excel formulasi topildi (`=SUM`, `=INDEX/MATCH`,
`=SUMIF`, `=YEAR`, `=TIME`). Holbuki `S2.OFFICE` — **eng katta yagona guruh
(5 savol)** va spetsifikatsiya "formulalar, funksiyalar, filtrlardan foydalana
olish, diagrammalarni tahlil qila olish" ni talab qiladi, ya'ni **qo'llash**
darajasida.

Sahifa soni yetarli (178), lekin ular ko'proq interfeys tavsifi. Excel savollari
uchun formulalar **qo'lda yozilib, haqiqiy Excel/LibreOffice'da tekshirilishi**
kerak. Bu 5 savollik guruh uchun alohida ish rejasi talab qiladi.

### 3.3 KS + PM (15 savol = imtihonning 30%i) — manba yo'q 🔴

Keng probe bilan tasdiqlandi:

| Tushuncha | Sahifa |
|---|---:|
| `dars rejasi` | **0** |
| `o'quvchini baholash` | **0** |
| `didaktik` | 1 |
| `yosh psixologiya` | 1 |
| `inklyuziv` | 1 |
| `refleksiya` | 1 |
| `sinf rahbari` | 2 |
| `pedagogika` | 3 |
| `pedagogik texnologiya` | 4 |
| `tarbiya` | 9 |

Bu bir necha sahifalarning **hammasi** informatika darsliklaridagi tasodifiy
eslatmalar yoki spetsifikatsiya PDF'ining o'z bibliografiyasi. Pedagogika
nazariyasi manbasi **umuman yo'q**.

`Adabiyotlar.pdf` nomi chalg'ituvchi — u bibliografiya emas, **boshqa (eskiroq)
test spetsifikatsiyasi** ("Pedagog kadrlarining malaka toifalari test tizimi uchun
test spetsifikatsiyasi", `soha kodi` / `baholanadigan mazmun kodi` tuzilishi bilan).
Foydali qo'shimcha manba, lekin 2026 spetsifikatsiyasining o'rnini bosmaydi va
pedagogika kontenti bermaydi.

### 3.4 Yetishmayotgan 5 manba

Rasmiy spetsifikatsiya §VII aynan shularni ko'rsatadi:

| # | Manba | Hajm | Guruh |
|:-:|---|---|---|
| 1 | Mavlonova R.A. *Umumiy pedagogika*. Toshkent: Fan va texnologiyalar, 2018 | 528 b. | `PM.GEN` |
| 2 | Xoliqov A. *Pedagogik mahorat*. Toshkent: Bayoz, 2025 | 504 b. | `PM.GEN` |
| 3 | Tolipov Oʻ., Roʻziyeva D. *Pedagogik texnologiyalar va pedagogik mahorat*. 2019 | 276 b. | `PM.GEN` |
| 4 | *Umumiy oʻrta taʼlim maktab oʻqituvchisi kasb standarti* | — | `KS` |
| 5 | Mamarajabov M.E. va boshq. *Informatika oʻqitish metodikasi*. 2023 | 460 b. | `PM.MET` |

**Ta'siri:** bu manbalar kelmaguncha 50 savollik to'liq mock **yaratilmaydi** —
`start_exam('mock')` `BLUEPRINT_POOL_INSUFFICIENT` qaytaradi. Faqat 35 savollik
mutaxassislik sinovi ishlaydi. Bu `TIZIM_REJASI.md` dagi `B-001` blokeri.

---

## 4. Tavsiyalar

### 4.1 Darhol

1. **`Topics/` ni ishlatishni to'xtatish.** Muallif korpusi —
   `darsliklar/extracted/` (sahifa raqami bor, takrori yo'q, xato klassifikatsiya yo'q).

2. **`darsliklar/` ni `.gitignore`ga** (711 MB). `extracted/*.txt` (4.9 MB) —
   commit qilinadi, chunki bu ishlaydigan aktiv.

3. **5 pedagogik manbani topish** — hozirgi eng katta blokerni yopadi.
   Reja: PDF sotib olish yoki nashriyotdan so'rash → `extracted/` ga ekstraksiya →
   `sources` + `source_locators` ga import. Bu **texnik ish emas, ta'minot ishi** —
   shuning uchun hoziroq boshlanishi kerak, kod tayyor bo'lishini kutmasdan.

### 4.2 `Topics/` o'rniga — indekslash

`Topics/` ning maqsadi to'g'ri edi (mavzu bo'yicha topish), amalga oshirilishi xato.
To'g'ri yechim — **fayl guruhlash emas, indeks**:

```
source_locators jadvali:
  source_id | pdf_page_from | pdf_page_to | chapter_title | construct_id
```

Ya'ni `extracted/` dagi 2 554 sahifani **konstruktga xaritalash**, matnni
ko'chirmasdan. Har sahifa qaysi konstruktni qoplaydi — shu yoziladi.
Natijada muallif "S3.NUM.02 uchun manba" deb so'raganda aniq sahifa ro'yxatini
oladi, va u sahifa **tekshirilishi mumkin**.

Bu bir martalik ish (~2 kun), va u `ADR-011` ni to'liq bajaradi.
Avtomatlashtirish mumkin: har sahifa matni + 76 konstrukt ta'rifi → moslik
taklifi, keyin inson tasdiqlaydi. Muhim: **avtomatik moslik `draft`, inson
tasdig'idan keyin `confirmed`** — `ADR-009` bo'yicha.

### 4.3 Guruhga xos ish rejasi

| Guruh | Holat | Reja |
|---|---|---|
| `S2.HW`, `S3.ALGO`, `S4.BLOCK`, `S4.CODE`, `S4.DB`, `S5.WEB`, `S6.NET`, `S7.SEC` | ✅ Manba yetarli | Standart muallif oqimi |
| `S1.INFO`, `S3.NUM`, `S3.LOGIC` | 🟡 Manba o'rtacha | **Generator** birinchi navbatda (~160 savol) |
| `S2.OFFICE` (5 savol) | 🟠 Formula kam | Formulalar qo'lda yozilib **Excel'da tekshiriladi**. Alohida vazifa |
| `KS`, `PM.GEN`, `PM.MET` (15 savol) | 🔴 Manba yo'q | **5 manba kelguncha bloklangan.** Har savol qo'lda + pedagog ekspert imzosi |

### 4.4 Kod va jadval uchun qoida

Ekstraksiyada indentatsiya va jadval tuzilishi yo'qolgani sababli:

- **Python/JS kodi** — qo'lda yoziladi va ishga tushirib tekshiriladi. Ekstraksiya
  matni faqat mavzu va qiyinlik darajasini aniqlash uchun.
- **Excel formulalari** — haqiqiy jadvalda hisoblanib tekshiriladi.
- **Rostlik jadvallari** — `mantiqAmal.ts` generatori hisoblaydi, qo'lda yozilmaydi.
- **Blok-sxema va diagrammalar** — qayta chiziladi (copyright uchun ham shart).

---

## 5. Bajarilgan tuzatishlar

### 5.1 `darsliklar/extracted/*.txt` — tozalandi

Vosita: [scripts/clean-extracted.py](scripts/clean-extracted.py) (`npm run corpus:clean`).
Idempotent — ikki marta ishlatilsa natija o'zgarmaydi (`npm run corpus:verify`).

| Tuzatish | Soni |
|---|---:|
| Apostrof normalizatsiyasi (`‘’'`` ` `` → `ʻ`/`ʼ`) | 31 322 |
| Kirill homoglifi (`Тoshkent` → `Toshkent`) | 950 token |
| Bo'g'in bo'linishi birlashtirildi | 464 |
| Kod/formula qo'shtirnog'i (`“<0”` → `"<0"`) | 28 |
| **Olib tashlangan shovqin** | |
| Takrorlanuvchi kolontitul (`I BOB.`, `9-sinf Informatika…`) | 562 qator |
| Yolg'iz sahifa raqamlari | 5 718 |
| Nuqtali to'ldirish (`………`) | 236 |
| Yetim `•` markerlar | 1 235 |
| Ortiqcha bo'sh qatorlar | 461 |
| **Jami tozalangan** | **106 KB (2.2%)** |

Kafolatlar (tekshirilgan):

- **2 554 sahifa markeri butun** — sahifa iqtibosi buzilmadi;
- **0 sahifa kontent yo'qotdi** (har sahifa oldin/keyin solishtirildi);
- 10 mundarija sahifasi `[MUNDARIJA]` deb belgilandi — indeksdan chiqarish uchun;
- matn mazmuni, atamalar va imlo o'zgarmadi.

### 5.2 `Topics/` — qayta qurildi

Vosita: [scripts/build-topic-index.ts](scripts/build-topic-index.ts) (`npm run corpus:index`).

**Darslik matni rasmiy taksonomiya bo'yicha ajratib olindi.** Ajratish birligi —
**parcha (abzas)**, sahifa emas. Har konstrukt uchun bitta fayl, ikki qismdan:

1. **Manba jadvali** — darslik, sahifa, parcha soni, moslik kuchi, kalit so'zlar;
2. **Ajratib olingan matn** — mos kelgan abzas va uning tegishli konteksti, har
   biri ustida `Milliy 7-sinf (2021) — 13-sahifa` va
   `ICT 7_sinf-2021.txt → ===== SAHIFA 13 =====` provenansi bilan.

| O'lcham | Eski | Yangi |
|---|---|---|
| Tuzilma | 25 o'ylab topilgan mavzu | **15 blueprint guruh / 76 konstrukt** |
| Ajratish birligi | butun fayl | **abzas (5 148 parcha)** |
| Hajm | 3.6 MB | 3.7 MB (77 fayl) |
| Sahifa provenansi | **0** | **har parchada darslik + sahifa** |
| Kesilgan bloklar | 11% + 70% sarlavha | **0** |
| Spetsifikatsiya aralashgan | 7 fayl, 30 marta | **0** |
| Atribusiyasiz fayl | 6 | **0** |
| Xato klassifikatsiya | 3 fayl butunlay | **0** |
| Manbasiz konstrukt (spetsiallik) | — | **0 / 68** |

#### Uchta ketma-ket tuzatish

Birinchi urinishlar yaroqsiz natija berdi. Har bir muammo o'lchov bilan topildi:

**1. Vaznsiz kalit so'z sanog'i → IDF vaznlash.**
`KS.03` ("O'zlashtirishni baholash") 88 sahifa "topdi", chunki `baholash` so'zi
informatika darsligida boshqa ma'noda uchraydi ("ifodani baholash"). Kalit
so'zlar endi ma'lumot qiymati bo'yicha vaznlanadi: 500 parchada uchraydigan
umumiy so'z deyarli signal bermaydi.

**2. Sahifa darajasidagi ajratish → parcha darajasi.**
`S3.NUM.01` ("Sanoq sistemalari asoslari") ning **1-manbasi**
`Milliy 11-sinf, 94-sahifa` — mavzusi *"Pythonning sun'iy intellektdagi o'rni"*.
Sababi: o'sha sahifada bitta gap bor — *"…ikkilik sanoq sistemasida saqlanadi"*.
Sahifa darajasida bu ~3 KB begona Python matnini olib keldi.

Parcha darajasiga o'tgach o'sha sahifa **15-o'ringa tushdi va 1 abzas** bilan
chiqadi. Kontekst ham filtrlanadi: qo'shni abzas faqat mavzuga tegishli bo'lsa
qo'shiladi.

**3. Substring moslik → so'z chegarasi + o'zbek qo'shimchasi.**
O'lchov shuni ko'rsatdi: `OR` korpusning **98%** sahifasiga, `LAN` 97%, `IF` 70%,
`bit` 22% ga "mos kelgan" — chunki `OR` "bor" ichida, `bit` "bitta" ichida,
`for` "format" ichida uchraydi.

So'z chegarasi qo'shilgach teskari muammo chiqdi: o'zbek tili agglutinativ,
korpusda `sanoq sistemasi`, `sistemasida`, `sistemalari` bor — `sanoq sistema`
shakli yo'q. Qat'iy o'ng chegara bularni rad etdi va 13 konstrukt "manbasiz"
ko'rindi.

Yechim uzunlikka bog'liq: qisqa kalit so'z (≤5 belgi) ikki tomonda qat'iy
(`bit` ≠ `bitta`), uzuni o'ngda 6 belgigacha qo'shimchaga ruxsat beradi
(`sanoq sistema` = `sanoq sistemasida`).

**Qo'shimcha:** shu o'lchov 33 ta "o'lik" kalit so'zni ham ochdi — men o'ylab
topgan iboralar korpusda yo'q edi (`MS Paint` → `Paint`, `GROUP BY` → `GROUP`,
`psevdokod` → `psevdo`). Katalog korpusda tekshirilgan atamalar bilan
to'g'rilandi; hozir spetsiallik guruhlarida o'lik kalit so'z **yo'q**.

### 5.3 Syllabus muvofiqligi auditi

Vosita: [scripts/audit-topics.ts](scripts/audit-topics.ts) (`npm run corpus:audit`).

**Savol:** har konstrukt faylida faqat o'ziga tegishli material bormi? Ya'ni
`S1.INFO` (axborot) ga Excel, `S3.NUM` (sanoq sistemalari) ga Python
aralashib ketmaganmi?

**Usul:** har parcha uchun barcha 76 konstruktga qarshi ball hisoblanadi. Parcha
o'zi joylashgan konstruktdan boshqa **guruhga** kuchliroq mos kelsa —
kontaminatsiya.

| Bosqich | Begona guruhdan | Guruh tozaligi |
|---|---:|---:|
| Boshlang'ich (har mos konstrukt parchani oladi) | **21.6%** | 78.4% |
| + dominantlik chegarasi | 13.0% | 87.0% |
| + texnologiya markerlari | **11.1%** | **88.9%** |

**Uchinchi tuzatish — texnologiya markerlari.** Dominantlik chegarasi yetmadi,
chunki muammo ball hisobining o'zida edi: *"Python dasturlash tilida arifmetik
amallar"* parchasi `arifmetik amal` (IDF 5.8) orqali `S3.NUM.03` ga,
`Python` (IDF 4.9) orqali `S4.CODE` ga mos keladi. **Ball bo'yicha S3.NUM
yutadi** — IDF chastotani o'lchaydi, mavzuni emas.

Yechim: har guruh uchun o'ziga xos texnologiya markerlari
(`GROUP_TECH_MARKERS`, [src/data/blueprint2026.ts](src/data/blueprint2026.ts)).
Parchada boshqa guruhning markeri bo'lsa va shu guruhning markeri bo'lmasa —
biriktirilmaydi. 753 da'vo shu qoida bilan rad etildi.

Natijada sizning aniq holatlaringiz:

| Guruh | Begona marker | Oldin | Hozir |
|---|---|---:|---:|
| `S3.NUM` | Scratch | 5 | **0** |
| `S3.NUM` | MS Excel | 2 | **0** |
| `S3.NUM` | Python | 11 | 6 |
| `S1.INFO` | MS Excel | 2 | **0** |
| `S1.INFO` | elektron jadval | 13 | 3 |
| `S2.OFFICE` | Python / Scratch / IP | 0 | **0** |

`S3.NUM.03` dan Python arifmetikasi butunlay chiqib ketdi.

#### Qolgan 11% — nima uchun to'xtatildim

Ikki sababdan bu chegara oqilona:

**1. Qolgani ko'p qismi qonuniy kesishuv.** Eng yuqori kontaminatsiya
`S4.BLOCK ↔ S4.CODE ↔ S3.ALGO` uchburchagida (76–80% tozalik). Scratch darsi
algoritm o'rgatadi, Python darsi ham algoritm o'rgatadi — bitta parcha ikki
guruhga haqiqatan tegishli bo'lishi mumkin.

**2. "Begona marker" grep'i o'zi noaniq o'lchov.** `S1.INFO.07` da 6 marta
`Scratch` qolgan. Tekshirdim: bu darslikning **copyright sahifasi** —
*"Scratch dasturining skrinshotlari: Scratch MIT Media Lab'dagi…"*. `S1.INFO.07`
esa aynan **"Raqamli muhitda axloq va mualliflik huquqi"**. Ya'ni bu
kontaminatsiya emas, to'g'ri moslik. Bu holatlarni "tuzatish" foydali materialni
o'chirib tashlagan bo'lardi.

Shuning uchun qolgan noaniqlik **yashirilmaydi, ko'rinadigan qilindi**: parcha
boshqa guruhga ham kuchli mos kelsa, jadvalda `⚠️ <guruh>` ustuni va matn ustida
ogohlantirish chiqadi (hozir 353 joyda). Muallif o'zi hal qiladi — `ADR-009`
talab qilgani shu.

**Soxta moslikka qarshi IDF vaznlash.** Birinchi urinishda `KS.03`
("O'zlashtirishni baholash") 88 sahifa "topdi" — chunki `baholash` so'zi
informatika darsliklarida butunlay boshqa ma'noda uchraydi ("ifodani baholash").
Bu muallifni chalg'itardi. Kalit so'zlar endi ma'lumot qiymati (IDF) bo'yicha
vaznlanadi: 500 sahifada uchraydigan umumiy so'z deyarli signal bermaydi,
2 sahifada uchraydigan aniq atama esa kuchli signal beradi.

Natija: **17 413 → 2 084 havola**, va har konstruktda **ishonchlilik darajasi**
(`yuqori`/`o'rta`/`past`) ko'rsatiladi. Past ishonchli konstruktlarda ogohlantirish
chiqadi.

### 5.3 Nima tuzatilmadi (va nega)

| Kamchilik | Sabab |
|---|---|
| Kod indentatsiyasi | PDF'da absolyut joylashuv; matnda tiklanmaydi. `ADR-015` baribir ko'chirishni taqiqlaydi — kod qo'lda yozilib ishga tushirib tekshiriladi |
| Jadval tuzilishi | Xuddi shunday. Jadval `table` blokida qayta tuziladi |
| Rasm/diagramma | Matnda yo'q. Copyright uchun ham qayta chizilishi shart |
| **KS + PM manbalari** | **Bu texnik muammo emas** — 5 kitob hali korpusda yo'q. 4.1-bo'limga qarang |

---

## 6. Yakuniy baho

| O'lcham | Oldin | Keyin |
|---|---|---|
| PDF → TXT to'liqligi | ✅ 15/15, 2 554 sahifa | ✅ o'zgarmadi |
| Sahifa iqtibosi imkoni | ✅ `extracted/` / ❌ `Topics/` | ✅ **ikkisida ham** |
| Kontent ajratilgani | ❌ xato taksonomiya | ✅ **76 konstrukt fayli** |
| Apostrof to'g'riligi | 🟠 48.9% | ✅ **97.8%** |
| Kirill kontaminatsiyasi | 🟠 337 so'z | ✅ **0** |
| Kolontitul shovqini | 🟠 562 qator | ✅ **0** |
| `Topics/` takrorlanishi | ❌ 43% nazoratsiz | ✅ **nazoratli, provenansli** |
| `Topics/` klassifikatsiyasi | ❌ 3 fayl xato | ✅ **rasmiy taksonomiya** |
| Kod/jadval tuzilishi | 🟡 yo'qolgan | 🟡 **yo'qolgan** (tuzatilmaydi) |
| Mutaxassislik qamrovi (35 savol) | ✅ 12/12 guruh | ✅ **12/12, 0 manbasiz konstrukt** |
| KS + PM qamrovi (15 savol) | 🔴 0/3 guruh | 🔴 **9/18 konstrukt manbasiz** |

**Bir gapda:** txt fayllardagi barcha texnik kamchilik tuzatildi va vositalar
qayta ishlatiladigan skriptga aylantirildi; qolgan yagona jiddiy bo'shliq —
**imtihonning 30%i uchun 5 kitob hali korpusda yo'q**, va bu kod bilan
hal qilinmaydi.
