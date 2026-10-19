# TASK-244 — 10–11-sinf kitoblarini alohida tekshirish: M01 source-trace

**Sana:** 2026-10-19. **Status:** source audit va mapping; student-visible revised content nashr qilinmadi.

## 10-sinf milliy ICT, 2021

**Drive:** https://drive.google.com/file/d/1KNBa9-8wlk-CV8cZPUzEqYgMsvBdZb_3/view

- 4–7-bet: kompyuter rivojlanishi, hisoblash tizimlari, Fon Neyman arxitekturasi — M02 manbasi, M01dagi axborot jarayoniga bilvosita.
- Mazmunda ma'lumotni saralash va filtrlash, media bilan ishlash mavzulari mavjud; to‘liq M01 answer-key/source locator sifatida avtomatik tayinlash mumkin emas.
- **Bibliografik nazorat:** PDF muqovasi `10-SINF` deyilgan, ammo dastlabki ichki nashr ma'lumotida `7-sinf` so‘zi va oldingi darslik mualliflari takrorlangan. Source registry'da muqova, sahifa va nashr identifikatorini alohida verifikatsiya qilish kerak. Bunday metadata qarama-qarshilikni "aniq 10-sinf nashri" deb savolga ko‘r-ko‘rona manba ko‘rsatishda ishlatmang.

## 11-sinf milliy ICT, 2021

**Drive:** https://drive.google.com/file/d/1CFmUVZnq7S7YmZxHGaI1q58ogdD-2fEi/view

| Sahifalar | Mazmun | Asosiy mos guruh |
|---|---|---|
| 4–65 | MBBT, relatsion jadvallar, so‘rov orqali saralash, import/eksport | S4 DB, qisman M01 axborotni saralash/xulosa |
| 66–125 | Big Data, SI, tabiiy til, speech texnologiyalari | Kasbiy bilim va raqamli tizimlar, M01ga bilvosita |
| 129–185 | Kompyuter tarmoqlari, arxitektura, IP manzillash | S6 NET |
| 186–255 | Internet xizmatlari, bulut, IoT, VR/AR, mobil ilovalar | S7 va boshqa modullar |
| 256–311 | Axborot himoyasi, antivirus, shifrlash, raqamli dunyo va kiberxavfsizlik | S7 va M01 raqamli madaniyatga qisman |
| 311–335 | Elektron imzo, elektron hukumat/tijorat, blockchain | S7 |

M01 raqamli madaniyat uchun kitobdan ayrim relevant mavzular bor, ammo M01dagi barcha raqamli axloq/huquq savollariga (birgina) 11-sinf darsligini universal manba qilib qo‘ymang.

## Cambridge+ 10–11-sinf, 2021 (Long, Lawrey, Ellis)

**Drive:** https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view

**Eng muhim source breakthrough: 1-bob, 1–22-betlar.** Kitobda ma'lumot, axborot, bilim, bilimlar bazasi, statik/dinamik axborot manbalari, bevosita/bilvosita manbalar, sifat mezonlari va kodlash-tekshirish aniq tushuntirilgan.

| M01 savol/mavzu | Kitob sahifasi | Dalil holati |
|---|---|---|
| `ARS-01-004` — ma'lumot va kontekst | 1-bob, 1–3 | Bevosita mavzu; savolning alohida variantlari tekshirilishi kerak |
| `ARS-01-005` — axborot mazmuni | 1-bob, 1–3 | Bevosita |
| `ARS-01-006` — bilim | 1-bob, 1–3 | Bevosita; 5-sinfdagi `Y` manba qarzi shu kitob bilan qoplanishi mumkin |
| `ARS-01-007` — ma'lumot/axborot/bilim zanjiri | 1-bob, 1–3 | Bevosita/tematik; noaniqlikni kamaytirish sohaga xos tushuntirish |
| `ARS-01-008` — bilimlar bazasi | 1-bob, 2–3; 7-bob ekspert tizimlar 95-betdan | Ikki ma'no ajratilgan: (a) insonning tajriba va bilimi, (b) avtomatlashtirilgan fakt-qoida tizimi. `src/data/topics/m01.ts` nazariyasida ikki talqin allaqachon bor — qayta nusxalab, yangi termin yaratish shart emas |
| `M01.03`: statik/dinamik manbalar | 1-bob, 1–22 | Bevosita mavzu, item/lesson-level locator kerak |
| `M01.03`: bevosita/bilvosita manbalar | 1-bob, 1–22 | Bevosita mavzu |
| `M01.03`: aniqlik, ishonchlilik, dolzarblik, tafsilot, to‘liqlik | 1-bob, 1–22 | Bevosita mavzu |
| `M01.05`: kodlash va maxfiylik farqi | 1-bob, 1–22 | Mavzu darajasida; murakkab hisoblar 7-sinf kodlash bo‘limida ham tekshirilsin |
| `M01.06`: audio/video ishlov | 10-bob, 184-betdan | Ayni mavzu; namunalash/matn hajmi barcha savollariga individual formula dalili kerak |
| M01 raqamli jamiyat konteksti | 12-bob, 210-betdan | `ARS-01-020` manba nomzodi; to‘liq javob tasdig‘i keyin |

### Xavf — `bilimlar bazasi` atamasining ikki qo‘llanishi

Cambridge+ 10–11-sinfda insonning amaliy bilimlari uchun keng ma'no ham, ekspert tizimlari uchun fakt-qoida bazasi ma'nosi ham ishlatiladi. `ARS-01-008`dagi faqat ekspert tizimi javobi savol kontekstida aniq bo‘lishi kerak; o‘quvchi ikki talqinni bilsa ham chalkashmasin.

Darsning hozirgi nazariyasida `Bilimlar bazasining ikki ma'nosi` sarlavhasi va ikkala izoh borligi kod orqali tasdiqlandi. **Bu joyda keraksiz takror generatsiya qilinmasin; testning qo‘yilishi va variantlari tahririy ekspert ko‘rigi ostida qolsin.**

## Boshqa kitoblar bilan mavzuni aralashtirmaslik

- 10-sinf milliy ICTdagi qurilmalar → M02;
- 11-sinf milliy ICTdagi DB/SQL → S4, tarmoq → S6, xavfsizlik → S7;
- Cambridge+ 10–11-sinf 1-bobdagi ma'lumot–axborot–bilim/manba/sifat → **M01** uchun yuqori ustuvor manba.

**Navbatdagi talab:** ushbu boblarning har bir ARS stem, correct answer, distractor va izohini alohida evidence qatori bilan taqqoslash. Hozirgi ish kitob mavjudligi/mavzu va bet mosligini isbotlaydi, item-level human approval emas. Production published savol versiyasi o‘zgartirilmaydi; merge/deploy yo‘q.
