# TASK-205 — M09 MS Access / SQL V2 (review-gated integratsiya)

## Asos
- Manbalar: foydalanuvchi tasdiqlagan 2026-yilgi V2 nazariya (27 sahifa), 180 ta savol, o‘qituvchi izohlari, `darslik_qamrov_V2.csv`.
- 2026-yilgi rasmiy sinov: S4.DB konstruktiga 2 ta savol; fan bo‘yicha umumiy sinov 50 ta.
- GitHub: `sarvar9417/attestatsiya` — yagona production monorepo; eski backend repo ishlatilmaydi.
- `M09` 2026-10-18 auditida mavjud: 5 ta `published` dars; S4.DB'da 25 published + 21 review savol.

## Xavfsiz nashr qoidasi
1. Published lesson/question revision joyida o‘zgarmaydi; foydalanuvchi progressi, javob tarixi saqlanadi.
2. Yangi 6 ta nazariya boblari `review` statusida, ayrim sahifalardagi PDF text extraction ma’lumotlari uchun inson tekshiruvi talab etiladi.
3. V2 bankdagi 168 Y1 va 12 kombinatsiyali “paper Y2/Y3” savollar native interaktiv Y2/Y3 emas. Ularni haqiqiy Y2/Y3 deb ko‘rsatmaslik; conversion/QA alohida.
4. Savol tanasi, to‘g‘ri variant va keys **public GitHub'ga kiritilmaydi**. Barcha savollar server-side, kamida `review` statusda. Reviewer sinovlari talab qilinadi.
5. Har bir savol `S4.DB.01–05`, manba locator, source lesson, cognitive/difficulty, explanation va server key bilan bog‘lanadi.
6. Mualliflik va semantik tekshiruv + source page/page image auditidan o‘tmaguncha `published` emas.
7. Y2/Y3ning to‘g‘ri backend payload strukturasi va exam preflight tekshiruviga ulanish keyingi review gate.

## Dars bo‘yicha reja
| Bob | Yangi V2 slug | Spec konstrukt |
|---|---|---|
| 1: Baza va model | `m09-v2-relyatsion-model` | S4.DB.01 |
| 2: Access, maydonlar, forma/report/import | `m09-v2-access-maydonlar` | S4.DB.02 |
| 3: Kalitlar/yaxlitlik | `m09-v2-kalit-va-yaxlitlik` | S4.DB.03 |
| 4: Query Design | `m09-v2-query-design` | S4.DB.04 |
| 5: SQL asoslari | `m09-v2-access-sql` | S4.DB.01 |
| 6: Murakkab SQL | `m09-v2-murakkab-sql` | S4.DB.05 |

## Qabul mezoni
- [ ] 6 review lessons created, no old published lessons altered
- [ ] 180 IDs unique; 0 public answer keys
- [ ] true native Y2/Y3 interaction and scoring validated before publish
- [ ] 22 visual questions preserve Markdown tables and relational context
- [ ] all 5 spec constructs mapped, source locators verified
- [ ] admin shows staged content, published learners unaffected before approval
- [ ] all tasks pass lint/test/build and production E2E
- [ ] independent subject specialist approves per-question and lesson semantics
- [ ] formal publish + smoke + rollback/revision plan approved

## Muhim
Bu hujjat staging/reviewni qayd etadi, `production published` yoki 180 savolni hali sinovdan o‘tgan deyish uchun asos emas.
