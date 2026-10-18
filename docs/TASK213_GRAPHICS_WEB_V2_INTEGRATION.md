# TASK-213 — Grafika va veb-texnologiyalar V2: xavfsiz integratsiya

**Vazifa:** 2026-yil spetsifikatsiyasining **27–31-savollar** bo‘yicha manbali V2 nazariya va 300 savollik bankini Attestatsiya platformasining **mavjud M10/M11** modullariga moslash; boshqa modullar va learner tarixi o‘zgarmasin.

## Haqiqiy manbalar va provenance

- ChatGPT suhbatida yaratilgan va foydalanuvchi qabul qilgan `Grafika_veb_2026_QAYTA_ISHLANGAN_LATEX_PDF_JSON.zip`.
- Nazariya: `Grafika_veb_nazariya.pdf` (27 sahifa), `.tex` va beshta bo‘lim.
- Bank: `Grafika_veb_test_bank_300.json`, `schema_version=2.0`, `modified_test_count=105`.
- Audit/izlar: `QAMROV_MATRITSASI_V2.csv`, `SIFAT_AUDIT.md`, `QAMROV_VA_MANBALAR.md`.
- Asosiy manbalar: 2026-yil rasmiy spetsifikatsiya, ICT 5–11, Cambridge 5–11, 2026-yil demo va attestatsiya uslubi. Darsliklarning barcha satrlari mustaqil qayta audit qilingan **deb da'vo qilinmaydi**.

Manba kitoblarni/yirik ZIP/PDF paketlarni repositoryga ko‘chirmadik; Git’ga faqat platforma ishlatadigan transformatsiyalangan kontent va audit kiritildi. 300 savolning **mustaqil inson ekspertizasi yakunlanmagan**.

## Integratsiya xaritasi

| Source bo‘lim | Modul | V2 review lesson | Construct | Savol soni |
|---|---|---|---|---:|
| GFX | M10 | grafika-turlari-v2-review | S5.WEB.01 | 60 |
| RV | M10 | rastr-vektor-amallari-v2-review | S5.WEB.02 | 60 |
| ED | M10 | paint-photoshop-v2-review | S5.WEB.03 | 60 |
| HT | M11 | html-asoslar-v2-review; html-jadval-forma-v2-review | S5.WEB.04 / .05 | 60 |
| CS | M11 | css-stillar-v2-review | S5.WEB.06 | 60 |

6 ta yangi lesson matni PDFning 5 bobidan chiqarildi; HTML mazmuni jadval/formadan oldin va keyin ikki lesson’ga ajratildi. **Avvalgi published lesson’lar o‘zgartirilmadi**.

## Savollar modeli

- 300 savol: **280 Y1, 10 Y2, 10 Y3**; har bir bo‘limdan 60 ta.
- Y1 — 4 variant, `question_keys.payload.correct_option_id`.
- Y2 — chap/o‘ng variantlar (3+3), haqiqiy UUID→UUID `pairs`.
- Y3 — 3 bosqichning haqiqiy UUID `order` massivi.
- `question_options` va `question_keys` ajratilgan; kalit learner API’da e’lon qilinmasligi kerak.
- Avtomatik import faqat `status=review` yaratadi; **0 ta avtomatik published**.
- Stabil `GV2:GV-...` provenance ID'lari va deterministik UUIDlar ikki marta import qilishdagi takrorlarni cheklaydi.
- 9 ta rasmli savol uchun 8 ta original ma'noga mos yangi SVG veb-diagrammalar `public/graphics-web-v2`ga joylashtirildi. **Ko‘rgazma mazmuni original PDF chizmalari bilan inson tomonidan solishtirilishi shart.**

## Amaldagi mavjud kontentni himoyalash

Production bazada integratsiya oldidan **M10/M11 6 published lesson** va **S5.WEB 53 published savol** borligi o‘qib tekshirildi. Migratsiyalar ularni UPDATE/DELETE qilmaydi; attempt/history jadvallariga tegmaydi. Mavjud published savollar o‘quvchilarga odatdagidek xizmat qiladi.

## Testlar

- `supabase/tests/task213_graphics_web_v2_review_contract.test.sql` — 6 dars, 6 konstrukt bog‘lamasi, 300 savol va Y1/Y2/Y3 kalit invarianti, rasm yo‘llari, eski published darslar saqlanishini tekshiradi.
- `.github/workflows/ci.yml` — SQL acceptance test fresh-DB chain’ga kiritildi.
- GitHub CI (database/backend/quality) natijasini PR orqali mustaqil tekshirish kerak; lokal CI o‘tkazilgan deb da'vo qilinmasin.

## Majburiy qabul shartlari (release gate)

1. 300 savolning **har biri** mutaxassis tomonidan mazmun, variant, Y2/Y3 key va source sahifasi bo‘yicha tekshirilib tasdiqlanadi; duplikatlar yechiladi.
2. 9 rasmli savolning 8 diagrammasi asl LaTeX/PDF rasmiga solishtiriladi.
3. PDF-dan olingan 6 nazariy lesson **veb ko‘rinishida** kod/matematika/jadval/chizmalar bo‘yicha yaxlitligini ekspert baholaydi; kerakli `BookReader` bloklariga ko‘chiriladi.
4. `review→published` faqat mavjud staff/expert workflow bilan, kalitlar serverda saqlangan holda bajariladi.
5. Mobil va desktop E2E: mavzu → to‘liq o‘qish → test → yakunlash → xatolar tahlili; Y1/Y2/Y3, 50-savollik section mock va 5/50 rasmiy blueprint, scroll/back/navigatsiya.
6. Vercel production **READY**, haqiqiy database migration va learner smoke tasdiqlanmasdan “production tayyor” deyilmaydi.

## Rollback / forward-fix

Staging faqat yangi review kontentni INSERT qiladi. Agar xato aniqlansa, **published tarixga tegmay** yangi `review` reviziya yoki forward-fix migration yozish kerak; committed migration fayllari tahrirlanmaydi. Mutaxassis tasdiqlamasdan savollarni avtomatik publish qilish yoki eski published kontentni o‘chirish taqiqlanadi.

**Holat:** PRdagi implementatsiya review-only; production deployment, Supabase migration va 300 talik learner-visible release alohida verifikatsiyalanadi.
