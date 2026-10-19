# TASK-258 — 0/20 mavzular uchun manba va review-bank triage (2026-10-19)

**Holat:** source crosswalk + source-independent structural QA tayyor; real savol manbasi va ekspert tasdig‘i **YETISHMAYDI**. Production bazasida `SELECT`dan boshqa amal bajarilmadi. Kontent nashr etilmadi, foydalanuvchi imtihonlari o‘zgartirilmadi, deploy qilinmadi.

## 1. To‘rtta P0 dars — production ko‘rsatkichlari

| Dars (kod) | Exact topic test | Bevosita review | Y1/Y2/Y3 | Shu constructdagi **boshqa darslar** review banki | Nashrga tayyor |
|---|---:|---:|---|---:|---|
| M06, `masala-algoritmini-tuzish` (S3.ALGO.03) | 0/20 | 6 | 4/1/1 | 108 | Yo‘q |
| M08, `javascript-sintaksis-asoslari` (S4.CODE.04) | 0/20 | 6 | 4/1/1 | 60 | Yo‘q |
| M12, `arxitektura-va-topologiyalar` (S6.NET.02) | 0/20 | 6 | 4/1/1 | 76 | Yo‘q |
| M12, `internetdan-xavfsiz-va-maqsadli-foydalanish` (S6.NET.04) | 0/20 | 6 | 4/1/1 | 38 | Yo‘q |
| **Jami** | **0/80** | **24** | **16/4/4** | **282** | **0 approved** |

Shu 24 savol `specgap-2026:ZC-*` manba oilasiga mansub, status `review`, kognitiv daraja va difficulty qiymatlari bor, kerakli konstrukt/lesson bog‘lanishlari hamda serverdagi answer keys mavjud. **0 ta `question_editorial_checks`**. Barchasining `source_reference` maydoni *ichki seed identifikator*, lekin kitob nomi, bet raqami, qaysi original topshiriqdan olingani yo‘q. Kalitning borligi uning to‘g‘riligiga mustaqil tasdiq emas.

Shu konstruktga moslangan **282 ta boshqa dars savoli** umumiy konstrukt orqali chiqadi. Ular:
- M06: `algoritmlash-v2` 84, `algoritmlash-v3` 24;
- M08: `pyjs-2026-v2` 60;
- M12 arxitektura: `network-v2-20261018` 60, `network-v3-extra-20261018` 16;
- M12 Internet: `network-v2-20261018` 30, `network-v3-extra-20261018` 8.

**Bu ro‘yxat 282 ta alohida mos keladigan savol ekanini anglatmaydi**. Bir xil `construct_id` boshqa dars mavzusi, mavzu ketma-ketligi, murakkablik va source edition mosligini kafolatlamaydi. O‘zboshimchalik bilan bir darsning savolini boshqasiga ko‘chirish taqiqlanadi.

## 2. Foydalanuvchi bergan asl PDF manbalari bilan mavzu xaritasi

*Quyidagilar mavzuga mos manbalar, **24 savolning har biri aynan shu betdan olinganining dalili emas**. Sahifalar PDF fayldagi 1-asosli fizik sahifa raqamlaridir.*

| Dars | Attestatsiya spetsifikatsiyasi | Darslikdan tekshirilgan qamrov | Hali bajariladigan original manba dalili |
|---|---|---|---|
| M06 — Masalaning algoritmini tuzish | `Informatika Testlar spesifikatsiyasi.pdf`, 4-bet: Algoritmlash, 11–18-savollar guruhidagi 3 ta savol, algoritmni tuzish/tahlil qilish | `ICT 9_sinf-2020(1).pdf`, fizik 28–32-betlar: algoritm, ketma-ketlik, to‘g‘ri to‘rtburchak perimetri, formulada ifodalash | Har 6 savol uchun alohida aynan qaysi bob/bet va natija/algoritm yechimi |
| M08 — JavaScript sintaksisi asoslari | Shu spetsifikatsiya, 4-bet: 19–26-savollardagi Python/JavaScript, sintaksisni bilish va qo‘llash | `10-11-sinf informatika (Cambridge +)(1).pdf`, fizik 316–319-betlar: 19-bob JavaScript, `var`, ma’lumot turlari, operatorlar | Har 6 savol uchun aniq sahifa va JS kodining mustaqil bajarilish dalili |
| M12 — Tarmoq arxitekturasi/topologiyalari | Shu spetsifikatsiya, 5-bet: 32–33-savollar, tarmoq arxitekturasi, topologiyalar, ishlash prinsipi | `ICT 11_sinf-2021(1).pdf`, fizik 140–145-betlar: arxitektura; 167–170-betlar: bus/star/mesh/hybrid va topologiya | Har 6 savol uchun original darslik paragrafi yoki rasm, buzilish ssenariysi va diagramma tasdig‘i |
| M12 — Internetdan xavfsiz va maqsadli foydalanish | Shu spetsifikatsiya, 5-bet: 32–33-savollar, brauzer, qidiruv, xavfsiz foydalanish | `ICT 6_sinf-2021(1).pdf`, fizik 80–83-betlar: brauzer va xavfsiz qidiruv; 96–97-betlar: elektron pochta xavfsizligi | Har 6 savol uchun aynan kitob sahifasi, dolzarb xavfsizlik xatti-harakati va manbaning amaldagi holati |

## 3. Birlamchi savol auditi (ekspert signoff o‘rniga o‘tmaydi)

- **16 Y1:** ko‘rsatilgan vazifalar, variant matnlari va yopiq kalit referenslari birma-bir ko‘rib chiqildi. Oddiy algoritm, `var`/`console.log`, client/server, P2P, tarmoq uzilishi va Internet xavfsizligi bo‘yicha yaqqol arifmetik/sintaktik qarama-qarshilik topilmadi. Lekin bu 16 savolning asli kitobdan nusxa ekanini tasdiqlamaydi.
- **4 Y2:** har birida 8 ta tarixiy `side=a` saqlash holati va kalit bilan 4+4 asoslangan moslashtirish mavjud. Production `exam_payload()`ning xavfsiz o‘qish payti moslashtirishi ishlatiladi; **asl immutable savol variantlari update qilinmaydi**. Haqiqiy learner UI’da 4+4 mobile tekshiruv talab.
- **4 Y3:** to‘rtta bosqichning yopiq tartib xaritalari strukturaviy to‘liq. Birlamchi semantik tartib mantiqan mos. Asl manba, bitta qat’iy tartibning haqiqatan yagona ekanligi, alternativ to‘g‘ri tartiblar mumkinligi ekspert tomonidan tekshirilsin.
- **Distractor zaifligi bo‘yicha editorial bayroqlar:** `specgap-2026:ZC-N02-Y1-004`, `specgap-2026:ZC-A03-Y1-002` va xavfsizlik mavzusidagi ba’zi Y1 variantlari mavzu bilan bog‘lanmagan darajada oson rad etilishi mumkin. Bu faktik noto‘g‘ri kalit degani emas; attestatsiya darajasiga mos, realistik, xato tushunchalardan olingan distraktorlar talab. Keyin **ekspert va muallif** qayta ko‘radi.

**24 ta savollik navbat:** [`TASK258_24_REVIEW_SOURCE_QUEUE.tsv`](TASK258_24_REVIEW_SOURCE_QUEUE.tsv) — faqat ochiq metadata, `source_ref`, format, *mavzuga mos* kitob va fizik sahifalar, bo‘sh ekspert tasdiq maydonlari. Unda savol matni yoki javob kaliti mavjud emas; `item_exact_page_verified = NO` degani aynan shu savolning kitobdan olingani tasdiqlanmagan. To‘ldiriladigan barcha review/distractor/signoff statuslari `NO`.

## 4. Resursga tayyorlik va qabul shartlari

- **24 nomzod qayta yozilmasdan oldin** asl darslikdagi aniq sahifaga source crosswalk, iqtibos emas, tekshiriladigan original topshiriq lokatori va sifat guvohligi qayd etilishi kerak.
- Har dars uchun **kamida 20 ta** alohida **approved/published/keyed** va kerakli required constructga mos savol kerak. 4 × (20–6) = **56 ta qo‘shimcha slot** — bu faqat 24 nomzodning hammasi ekspert tasdiqlansa, nazariy eng kam qo‘shimcha miqdor. Ular hali approved emas; real tanqislikning nashrga tayyor qismini 80 deb hisoblash mumkin emas.
- Formatlar Y1/Y2/Y3; to‘g‘ri variant/moslik/tartib, distractor, qiyinlik, source, copyright, image asset, sezgir savol kalitini clientga chiqarmaslik va 15/50 imtihonga ta’sirini alohida tasdiqlash shart.
- **Reproduktiv kod:** `scripts/sql/TASK258_four_zero_topic_review_triage.sql` faqat yig‘ma hisob beradi va kalitlar payloadini qaytarmaydi. `supabase/tests/task258_four_priority_topics.test.sql` fresh-DB regressiyada review savollarni available poolga qo‘shmay, kam pool uchun `topic_pool_insufficient`, `question_count=0` natijasini majbur qiladi.
- **Production**: ushbu GitHub testining o‘tishi production’da strict migration/deploy borligining dalili emas. Production SQL yozish, publish, fake `question_editorial_checks`, real user attempt edit va deploy **taqiqlangan**, alohida release roziligi yo‘q.

**Handoff:** kontent muharriri xuddi shu 24 item uchun maxfiy (public GitHub emas) savol-ID/source-page/solution/expert verdict jadvalini to‘ldirsin. Ma’lumotlarda allaqachon mavjud `specgap` belgilari original kitobdan olinganini ko‘rsatmaydi.
