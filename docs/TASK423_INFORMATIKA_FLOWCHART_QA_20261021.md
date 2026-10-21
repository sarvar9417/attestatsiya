## 2026-10-21 qo‘shimcha — GitHub source/CI holati

- `docs/qa/task423-flowcharts/savol_15.dot` — `savol_24.dot`: **10 ta haqiqiy Graphviz manba fayli GitHub task branch’iga commit qilindi**. Shu manbadan SVGni qayta yaratish mumkin.
- `scripts/task423-render-flowcharts.mjs`: Graphviz `dot` bilan SVG yaratish, tashqi SVG DTDni olib tashlash, script/remote image/filter gate, `public/`ga bevosita yozishdan himoya.
- `scripts/task423-flowcharts.test.mjs`: manba raqami, node/edge, reachability, SVG compile va xavfsizlik regressiyasi.
- `.github/workflows/task423-flowcharts.yml`: Graphviz CI ishga tushgan, ilk status queued. CI yakuni tekshiriladi.
- **Farq:** Graphviz DOT source repository’da mavjud; 10 ta asl lokal sanitized SVG + PNG fayllarining binary nusxalari repositoryga hali kiritilmadi. PNG va SVG browser mapping/deploy qolmoqda. Review-only, nashr YO‘Q.

# TASK-423 — Informatika №15–24 blok-sxema grafiklari: ekspert QA va nashr himoyasi

**Sana:** 2026-10-21  
**Holat:** REVIEW / grafiklarni GitHub va platformaga ulash bajarilmagan, deploy yo‘q.  
**Owner:** ChatGPT; repository branch `task/TASK-423-informatika-flowchart-qa-20261021`.

## Asl manba

- Google Drive PDF: [Python va Algoritm mavzusi savollari tahlili2.pdf](https://drive.google.com/file/d/13k9q8hDA5b-s-5x8p1apCAnRqJaLKtmi/view).
- PDF sahifalar 9–18 → savollar №15–24. №13 va №14 so‘z bilan ifodalangan, ular uchun diagramma talab qilinmaydi.
- Source recordlar: `attest_ingest.telegram_informatika_pdf_question_candidates`, source ID `13k9q8hDA5b-s-5x8p1apCAnRqJaLKtmi`. 2026-10-21 da jami 24 ta savol alohida tiklangan.
- Private QA: `telegram_informatika_pdf_free_response_qa` va `telegram_informatika_pdf_independent_qa`; barcha model takliflari tahririy holatda, human-approved/publish-ready emas.

## Rasmni ko‘rib chiqish natijasi

| № | PDF beti | Muallif sxemasi | Mazmun tekshiruvi | Asset status |
| --- | ---: | --- | --- | --- |
| 15 | 9 | M1 | P=1; i=5; P*=i; i+=2; i≤49 | SVG draft, platformaga yuklanmagan |
| 16 | 10 | M2 | Manfiy kiritilguncha oldingi A yig‘iladi | SVG draft, platformaga yuklanmagan |
| 17 | 11 | M4 | i=1..5 oralig‘idagi ko‘paytma; for chegarasi qo‘shimcha editorial tekshirilsin | SVG draft, platformaga yuklanmagan |
| 18 | 12 | M5 | i=1,3,5; P*=i | SVG draft, platformaga yuklanmagan |
| 19 | 13 | M8 | n=0 uchun 1; aks holda n! | SVG draft, platformaga yuklanmagan |
| 20 | 14 | M11 | n=15: 2+4+...+14=56 | SVG draft, platformaga yuklanmagan |
| 21 | 15 | M13 | 1,6,8,2,-6 → 17, manfiy qo‘shilmaydi | SVG draft, platformaga yuklanmagan |
| 22 | 16 | M18 | c=a+b; c≤n; 1,2,3,5,8,13 chiqadi | SVG draft, platformaga yuklanmagan |
| 23 | 17 | M19 | 1+2+3+4+5=15 | SVG draft, platformaga yuklanmagan |
| 24 | 18 | M20 | 5×4×3×2×1=120 | SVG draft, platformaga yuklanmagan |

## Tayyorlangan lokal aktivlar (REVIEW-only)

- Arxiv: `attestatsiya_informatika_15_24_diagrammalar.zip`; 10 ta `savol_XX.svg`, 10 ta `savol_XX.png`, `README.md`, `manifest.json`.
- Arxiv SHA-256: `77ee58183eb3adadb6281e7b8ca873425a50aaffb44d55d7ee00518f26b8d576`.
- XML SVG parser tekshiruvlari, PNG dekodlanishi, tashqi skript/rasm va Graphviz DTDni tozalash, ZIP integrity — PASS.
- Paket ushbu Git commit ichiga **hali yuklanmagan**. Grafiklar ChatGPTning joriy ish maydoni/artefakti sifatida mavjud; arxiv SHA-256 va ichki manifest bilan keyin alohida ulanishi kerak.
- Muallif PDFidagi qizil qo‘lyozma javoblar chizmalarga ko‘chirilmagan; bu fayllar mustaqil qayta chizmalar.

## Publish-gate / zarur acceptance

1. 10 ta SVG + PNG GitHub/Storage'ga real upload va checksum verification. SVG xavfsizligi saqlansin; learner assetlari uchun CDN/access qonuniyligi tekshirilsin.
2. UI SVG yoki PNGni learnerga aynan kerakli savol revision ID bilan bog‘lasin. Question lookup bo‘yicha cross-question image leakage mumkin bo‘lmasin.
3. SVGni asl PDF bilan mustaqil tahririy solishtirish va sikl/fork shartlarini isbotlash; №17 bo‘yicha for-chegara aniq bo‘lsin.
4. Private Supabase `telegram_informatika_pdf_visual_index` hozir 10 savolni `pdf_figure_not_exported_to_platform` deb ko‘rsatadi; haqiqiy asset deployment bo‘lmaguncha bu holatni kamaytirmang.
5. Learner publish uchun kalit/source audit, options, revision immutability, tarixiy examlar va RLS testlari alohida o'tishi shart.
6. Preview/asset render testlari, no-public-key-leak testlari, typecheck/lint/build va CI pass bo‘lmasdan merge qilinmasin.

## Qo‘shimcha audit

Sanoq sistemalariga oid 49 ta cross-PDF dublikatlar alohida belgilangan; №19 da 636(10)=529(11) talqinining noaniqligi ikkalasi uchun bloklangan. Kitob 128×32×60 belgini 512 bit/s bilan yuborish topshirig‘ida 8 bit/belgi taxmini manbada berilmagani va A=3600 s / B=60 minut tengligi qayd qilingan.

**Release:** ushbu branch REVIEW uchun; mavjud published question revision/key, o‘quvchi natijalari va production frontendga yozmang.

## №17 — asl bosma sxema va qo‘lyozma talqini farqi (2026-10-21)

Asl PDFning **11-betini 2.5x tasvir** bilan tekshirishda M4 for-siklning bosma diapazoni `i = 1,5` ekanligi ko‘rindi. Sahifadagi qizil qo‘lyozma **5 ni chizib tashlagan** va to‘rtinchi iteratsiyagacha `1 × 2 × 3 × 4 = 24` yechimini yozgan. Bu muallifning qizil qo‘lyozmasi bosma shartdan boshqa talqin qo‘llaganini bildiradi; u nashr uchun rasmiy javob kaliti sifatida qabul qilinmaydi.

- **Bosma sxema talqini**: `i=1..5` inkluziv, `P=1×2×3×4×5=120`; mavjud `savol_17.dot` ushbu bosma diapazonga mos.
- **Qo‘lyozma talqini**: `i=1..4`, `P=24`; bosma sxemadagi 5 ustidan chizilgan, PDF originalining bosma qatlamini o‘zgartirmaydi.
- **Database himoyasi**: `attest_ingest.telegram_informatika_pdf_release_blockers`da №17 uchun `ambiguous_or_nonunique_answer` nashr bloki qo‘shildi. Bosma shart, yozuv va javoblar o‘quvchi nashriga chiqmasin; 120 matematik hisob ekani model QA tavsiyasi, inson eksperti tan olgan kalit emas.
- **Keyingi qat’iy test**: Graphviz sxemasida `i=1..5` saqlanishi, manba/provenance izohi va release blocker alohida qayd etilishi; image hamda QA ajratish yakunlanmasdan publish mumkin emas.
