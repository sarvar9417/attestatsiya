# TASK-240 — Informatika savollar banki chuqur sifat nazorati

**Audit sanasi:** 2026-10-18  
**Production loyiha:** `plyqezulrfowyblsfpzy`  
**Qamrov:** barcha aktiv savollar (`published`, `review`, `draft`) va tarixiy bog‘lanishlar uchun `archived` yozuvlar  
**Yakuniy qaror:** **shartli qabul** — aniqlangan kritik nashr xatosi productionda tuzatildi; bank strukturaviy jihatdan sog‘lom va amaldagi blueprint yig‘iladi, ammo ayrim konstruktlar hali ekspert tasdig‘idan o‘tgan published savolga ega emas.

## 1. Eng muhim xulosa

Audit barcha 5 966 aktiv savolni avtomatik invariantlar, format shartnomalari, taxonomy, manba bog‘lanishi, blueprint, takrorlanish, nashr dalili va provenance bo‘yicha qamrab oldi. Rasmiy 2026 spetsifikatsiya, 5–11-sinf Cambridge+/ICT darsliklari, 20 000-lik savollar banki, ikkita demo va 2026-yil 7/13-aprel real savollari mazmuniy etalon sifatida solishtirildi.

Kritik xato topildi: `S5.WEB` bo‘yicha 380 ta Graphics/Web V2 savol repoda va `source_reference`da **review-only / expert review required** deb belgilangan bo‘lsa-da, productionda bir vaqtda `published` qilingan. Ularning `author_id` qiymati yo‘q va birortasida ham `question_editorial_checks` dalili bo‘lmagan. Bu savollarning learner poolda qolishi mumkin emas edi.

Tuzatish productionga transactionli migration orqali qo‘llandi:

- 380 ta xato published nusxa o‘chirilmasdan `archived` qilindi;
- option/key UUIDlari qayta xaritalangan 380 ta yangi `review` revisiya yaratildi;
- eski va yangi UUIDlar orasidagi lineage `question_quality_quarantines`da saqlandi;
- 21 ta tarixiy `exam_items` bog‘lanishi eski immutable savollarda qoldi, shu sabab oldingi va tugallanmagan urinishlar buzilmadi;
- ekspert checklisti, published source lesson va joriy fingerprint bo‘lmasa kelajakdagi GV2 publish bloklanadi;
- keyin published qilingan revisiya savol/options/key darajasida immutable bo‘ladi.

## 2. Tekshirilgan manbalar

| Manba turi | Fayllar | Auditda ishlatilishi |
|---|---:|---|
| Rasmiy 2026 spetsifikatsiya | `20-Informatika-Testlar-spesifikatsiyasi.pdf` | 50 savol/120 daqiqa, 8/35/7 kognitiv taqsimot, guruh va mavzu chegaralari |
| 5–11-sinf darsliklari | `06`–`18` Cambridge+/ICT PDFlar | termin, algoritm, kod, Office, DB, web, tarmoq va qurilma nazariyasi |
| Qo‘shimcha nazariya/test | `01`–`05`, `19` | an’anaviy savol shakllari va mavzu manbalari |
| Katta savollar banki | `21-20000-LIK-informatika.pdf` | tarixiy savol uslubi va qamrov; scan OCR orqali tekshirildi |
| Demo testlar | `22`, `23` | Y1/Y2/Y3, rasm/kod/jadval va amaliy vazifa uslubi; scan OCR orqali tekshirildi |
| Real 2026 testlar | `24`, `25` | real qiyinchilik va kontekst: Excel/Word, kod, mantiq, sanoq sistemasi, Scratch/Logo, IP, HTML/CSS, DB |

Manbalar javob kalitlarini ko‘paytirish uchun emas, savol konstruktining spetsifikatsiyaga mosligi, terminologiya va real test uslubini baholash uchun ishlatildi.

## 3. Production inventari

### Oldin

| Status | Savollar |
|---|---:|
| Published | 3 724 |
| Review | 2 223 |
| Draft | 19 |
| Archived | 357 |
| **Jami** | **6 323** |

### Tuzatishdan keyin

| Status | Savollar |
|---|---:|
| Published | 3 344 |
| Review | 2 603 |
| Draft | 19 |
| Archived | 737 |
| **Jami** | **6 703** |

Aktiv savollar soni o‘zgarmadi: **5 966**. Jami yozuvlar 380 taga oshdi, chunki immutable tarix saqlanib, review uchun yangi revisiyalar yaratildi.

## 4. To‘liq avtomatik sifat nazorati natijalari

| Tekshiruv | Natija | Izoh |
|---|---:|---|
| Bo‘sh savol matni | 0 | PASS |
| Yo‘q answer key | 0 | PASS |
| Bo‘sh explanation | 0 | PASS |
| Yo‘q `source_reference` | 0 | PASS |
| Yo‘q `source_lesson_id` | 0 | PASS |
| Subject/group/construct mismatch | 0 | PASS |
| Bo‘sh yoki aynan takror variant | 0 | PASS |
| Y1/Y2/Y3 non-legacy contract xatosi | 0 | PASS |
| Aktiv exact semantic duplicate cluster | 0 | PASS |
| Published unresolved-review marker | 0 | Tuzatishdan keyin PASS |
| Review unresolved-review marker | 410 | Kutilgan: ekspert queue |
| Editorial recordlar | 249 | Bankning hammasiga ekspert tasdig‘i deb talqin qilinmaydi |
| Legacy Y2 runtime recovery | 26 | 22 published, 4 review; learner payloadda normalizatsiya qilinadi |

Variantlarda `a5` va `A5` kabi case-sensitive kod natijalari ataylab farqli; ularni noto‘g‘ri duplicate deb o‘zgartirish kerak emas. Shuningdek, raw correct-option pozitsiyasi ayrim eski paketlarda notekis bo‘lsa-da, imtihon yaratishda `option_order` shuffle qilinadi; shu sabab raw pozitsiya learnerga signal bermaydi.

## 5. Spetsifikatsiya va blueprint nazorati

Amaldagi rasmiy blueprint guruh × kognitiv kesimida to‘liq yig‘iladi. GV2 karantinidan keyin ham `S5.WEB` uchun holat:

| Kognitiv daraja | Talab | Published mavjud | Holat |
|---|---:|---:|---|
| Bilish | 1 | 22 | PASS |
| Qo‘llash | 4 | 27 | PASS |
| Mulohaza | 0 | 4 | PASS |

Biroq group-level feasibility konstrukt darajasidagi sifatni yashirmasligi kerak. Quyidagi rasmiy konstruktlarda published qamrov yo‘q yoki juda kam:

| Konstrukt | Published | Review | Draft | Xavf |
|---|---:|---:|---:|---|
| `S3.ALGO.03` | 0 | 114 | 6 | Rasmiy konstrukt learner poolga kira olmaydi |
| `S4.CODE.04` | 0 | 66 | 0 | Rasmiy konstrukt learner poolga kira olmaydi |
| `S6.NET.02` | 0 | 82 | 0 | Rasmiy konstrukt learner poolga kira olmaydi |
| `S6.NET.04` | 0 | 44 | 0 | Rasmiy konstrukt learner poolga kira olmaydi |
| `S4.DB.01` | 3 | 96 | 0 | Zaxira sayoz |
| `S4.DB.05` | 4 | 48 | 0 | Zaxira sayoz |
| `S5.WEB.03` | 3 | 76 | 0 | GV2 ekspert reviewidan keyin to‘ldirilishi mumkin |
| `S5.WEB.05` | 3 | 68 | 0 | GV2 ekspert reviewidan keyin to‘ldirilishi mumkin |

Shu sabab “blueprint yig‘iladi” degan texnik natija “spetsifikatsiyadagi har bir konstrukt yetarli sifatli published savolga ega” degani emas.

## 6. Tuzatilgan kritik xato tafsiloti

### Dalil

- GV2 migratsiya hujjatlari 380 savolni review-only deb belgilagan.
- 300 savolda `expert review required`, 80 savolda `original review` provenance markeri bo‘lgan.
- 380/380 savol `author_id IS NULL`.
- 380/380 savolda editorial checklist yo‘q.
- Ular 2026-10-18 14:31–14:33 UTC da yaratilgan va taxminan 14:41 UTC da mass-published qilingan.

### Qo‘llangan himoya

`20261019032000_task240_graphics_web_v2_quarantine.sql`:

1. production holatini 380/0 yoki fresh-chain holatini 0/380 bo‘lmasa darhol rad etadi;
2. 280 Y1, 50 Y2, 50 Y3 format taqsimoti va barcha key/option UUIDlarini tekshiradi;
3. transaction ichida immutable archive + UUID-rekeyed review revision yaratadi;
4. lineage va fingerprint dalilini private RLS jadvalida saqlaydi;
5. source lesson + construct link + mustaqil checklist + joriy fingerprint bo‘lmasa publishni bloklaydi;
6. published revisiyani keyinchalik tahrirlashni bloklaydi;
7. postflightda 380 review, 0 suspect published, 53 eski published S5 va blueprint feasibilityni qayta tekshiradi.

## 7. Ochiq qarz va release shartlari

### Yuqori ustuvorlik

1. `S3.ALGO.03`, `S4.CODE.04`, `S6.NET.02`, `S6.NET.04` review banklaridan source-qualified mutaxassis tanlab, javob/izoh/reference/wordingni mustaqil tekshirishi kerak. Hech biri avtomatik published qilinmasin.
2. GV2 380 savolni kamida ikki bosqichda ko‘rish kerak: predmet eksperti va testolog. Rasmli/visual savollarda assetning savolni hal qilish uchun yetarliligi alohida tekshirilsin.
3. `S4.DB.01`, `S4.DB.05`, `S5.WEB.03`, `S5.WEB.05` uchun published zaxira kamida konstrukt boshiga 8–12 sifatli savolgacha ko‘tarilsin.

### O‘rta ustuvorlik

1. 26 ta eski `formatbank-2026:T063-Y2-*` yozuvda barcha 8 raw option `side='a'`; runtime ularni 4+4 ko‘rinishga tiklaydi va regressiya testi mavjud. Yangi kontent bunday raw shaklda qabul qilinmasin; alohida immutable revision rekey migratsiyasi rejalashtirilsin.
2. Published generated bankda inson tasdig‘i bir xil siyosatda qayd etilmagan. “Generated” savolning published bo‘lishi uchun universal editorial fingerprint gate joriy etilishi kerak.
3. To‘g‘ri javobning doim eng uzun variant bo‘lib qolishi mumkin bo‘lgan savollar predmet eksperti tomonidan ko‘rilsin. Bu avtomatik xato hukmi emas, lekin test-taking cue xavfi.

## 8. Verifikatsiya

| Tekshiruv | Natija |
|---|---|
| Production migration | PASS |
| TASK-240 production SQL regression | PASS |
| Frontend secret scan/lint/typecheck | PASS |
| Frontend Vitest | 65 fayl, 480 test — PASS |
| Generated parametric pool | 270 savol, 4 generator — PASS |
| Production build + answer-key bundle scan | PASS |
| Backend secret scan/typecheck/API typecheck | PASS |
| Backend Vitest | 22 fayl, 225 test — PASS |
| Supabase security advisor | TASK-240 funksiyalarida public EXECUTE topilmadi; private RLS jadvallari policy-siz va grant-siz ataylab yopiq |

Lokal `supabase db lint --local` Docker/Postgres `127.0.0.1:54322` ishlamagani sabab bajarilmadi. Buni production transaction preflight/postflight, production regression va Supabase security advisor bilan qoplandi.

## 9. Halol chegaralar

Bu audit barcha aktiv DB qatorlarini avtomatik tekshirgan va source corpus bilan qamrov/uslub/terminologiyani tanqidiy solishtirgan. Lekin **5 966 savolning har birini inson predmet eksperti satrma-satr tasdiqladi** degan da’vo qilinmaydi. `review` — aynan shunday inson tekshiruvi uchun navbat. AI yoki avtomatik tekshiruv independent expert sign-off o‘rnini bosa olmaydi.

Shuning uchun yakuniy holat: platforma strukturaviy va runtime nuqtai nazaridan ishlashga tayyor; aniqlangan kritik exposure yopildi; to‘liq mazmuniy sertifikatsiya esa yuqoridagi konstruktlar va review banklar uchun ekspert workflow tugagandan keyingina berilishi mumkin.

