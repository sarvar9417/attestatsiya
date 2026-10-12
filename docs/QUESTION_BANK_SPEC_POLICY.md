# Question bank specification-first policy

Sana: 2026-10-12
Status: project-wide content contract

## Asosiy qoida

Attestatsiya platformasida savol banki **mavzu nomi bo‘yicha emas, rasmiy
2026 Informatika attestatsiya spetsifikatsiyasidagi baholanadigan konstrukt
bo‘yicha** quriladi.

Darslik va qo‘llanmalar mazmun manbasi; spetsifikatsiya esa qaysi bilim va
ko‘nikma imtihon pooliga kirishini belgilovchi release contract hisoblanadi.

## Rasmiy exam contract

- 50 savol, 120 daqiqa.
- Mutaxassislik: 35.
- Kasb standarti: 5.
- Pedagogik mahorat: 10.
- Yopiq formatlar: Y1, Y2, Y3.
- Mock assembler faqat published + keyed + active-taxonomy candidate ishlatadi.

Mutaxassislik blueprinti:

| Savollar | Guruh | Soni |
|---|---|---:|
| 1–3 | S1.INFO — Axborot va raqamli savodxonlik | 3 |
| 4–10 | S2.HW + S2.OFFICE — Kompyuter tizimlari va ofis | 7 |
| 11–18 | S3.LOGIC + S3.NUM + S3.ALGO | 8 |
| 19–26 | S4.BLOCK + S4.CODE + S4.DB | 8 |
| 27–31 | S5.WEB — Grafika va veb | 5 |
| 32–33 | S6.NET — Tarmoqlar | 2 |
| 34–35 | S7.SEC — Xavfsizlik va raqamli xizmatlar | 2 |

36–40 kasb standarti, 41–50 pedagogik mahorat/metodika lane’lari bo‘yicha
alohida blueprint guruhlari ishlatiladi.

## Har bir savol uchun majburiy metadata

Published poolga nomzod savol quyidagilarsiz release qilinmaydi:

1. aniq `construct_id`;
2. kognitiv daraja;
3. format: Y1/Y2/Y3;
4. source reference;
5. source-backed lesson yoki verifikatsiya qilinadigan source locator;
6. server-side answer key;
7. explanation;
8. active taxonomy bilan moslik;
9. savol formatiga mos option/key invariantlari.

## Workflow

`source → specification construct → lesson/objective → question draft → structural validation → semantic/source review → published → feasibility audit`

### 1. Source

Savol avval ishonchli darslik/qo‘llanma yoki rasmiy materialga tayanadi.
Source topilmagan savol publish qilinmaydi.

### 2. Specification mapping

Savolning mazmuni rasmiy baholanadigan konstruktga bir qiymatli mos kelishi
kerak. Foydali mavzu bo‘lishi o‘zi yetarli emas.

Agar mos construct topilmasa:
- savol `review`/quarantine holatida qoladi;
- sun’iy mapping berilmaydi;
- official mock poolga kiritilmaydi.

### 3. Cognitive va format

Bank faqat Y1 bilan cheklanmaydi. Rasmiy formatlar Y1/Y2/Y3 alohida
qo‘llab-quvvatlanadi. Cognitive mapping mock blueprint bilan alohida
tekshiriladi; bitta bankning ichki nisbatini majburan exam nisbatiga
o‘xshatish shart emas.

### 4. Structural validation

Importdan oldin:
- duplicate external ID;
- duplicate variant;
- answer/key shape;
- required metadata;
- construct existence;
- source presence;
- format invariantlari;
- exact duplicate stem

tekshiriladi.

### 5. Semantic/source review

Avtomatik validator javobning fan nuqtai nazaridan to‘g‘riligini kafolatlamaydi.
Published status oldidan savol, to‘g‘ri javob, distractor va explanation manbaga
nisbatan tekshiriladi.

### 6. Publish gate

Published poolga faqat:
- active construct;
- source;
- valid answer key;
- valid options;
- construct/source lesson consistency;
- reviewdan o‘tgan savol

kiradi.

Private source banklar public Gitga savol body yoki answer key bilan
commit qilinmaydi.

### 7. Post-publish audit

Har batchdan keyin:
- official 50/50 feasibility;
- group × cognitive exact deficit;
- release reserve;
- construct zero-coverage;
- source lesson drift;
- duplicate/near-duplicate audit

qayta bajariladi.

## Axborot banki — precedent

`Axborot_testlar_oqituvchi.pdf` bo‘yicha 19 bob × 30 = 570 unique AXB savol
strukturasi tasdiqlangan. Production reconciliationda 540 savol published,
30 savol specification ambiguity sabab review quarantine holatida saqlanadi.

Bu yondashuv keyingi barcha test banklari uchun precedent hisoblanadi:
**avval spetsifikatsiya, keyin bank; avval source/construct verifikatsiya, keyin
publish.**
