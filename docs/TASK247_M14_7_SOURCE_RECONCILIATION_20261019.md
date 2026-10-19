# TASK-247 — M14 kasb standarti: 7/7 mavzu bo‘yicha manba-matn reconciliatsiyasi
**Sana:** 2026-10-19. **Kelib chiqish branchi:** `task/TASK-247-pedagogy-source-intake-20261019`.
**Integratsiya:** TASK-247 [PR #204](https://github.com/sarvar9417/attestatsiya/pull/204) orqali `main`ga merge qilindi. Yangi asl PDF tekshiruvi TASK-252 draft branchida; qo‘lda deploy/prod DB yozuvi yo‘q. **Expert review:** ochiq.

## Ishlatilgan asosiy materiallar

1. [`Kasb-standarti.pdf`](https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view) — 20 908 belgi sifatida matn fetch qilindi; «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti», yettita aniq mehnat vazifasi sarlavhalari/harakatlari. Bu o‘quv platformasiga **matnli nusxa** sifatida ishlatildi. Undagi hujjatning huquqiy kuchga kirishi hamda fizik PDF sahifa lokatorlari alohida tekshiriladi.
2. [`Pedagogning kasbiy standarti - qollanma.pdf`](https://drive.google.com/file/d/1BSndV9rDBv40mBcbTcZU3DxxZJJU5uH3/view) — 20 837 belgilik ikkilamchi metodik qo‘llanma; boshlang‘ich ro‘yxatda 5/6 soha tartibi asosiy bob sarlavhalaridan farq qiladi. Platformadagi kanonik M14.05 xavfsiz muhit / M14.06 kasbiy o‘sish **asosiy boblariga va alohida `Kasb-standarti.pdf` mehnat vazifalariga mos**.
3. `Kasb standarti 1-soha ...pdf`, `Kasb standarti 2-soha.pdf` va `Kasb standarti 3-soha.pdf` matnlari ochilib, birinchi 3 sohadagi mehnat harakatlari taqqoslandi.
4. [**`Maktab pedagoglari - Kasb standarti (Oʻzbek tili).pdf`**](https://drive.google.com/file/d/1IwpcwvNG4deDFtxwEw1tIU2G121RrVYB/view) — oddiy matn olinmagan bo‘lsa-da, **17 sahifalik asl skanerlangan PDF raw/visual tarzda ochildi**. PDF **2-sahifasida** M14.01–07 bilan aynan mos A/01.6–A/05.6 va B/01.6–B/02.6 kodlari, har biri 6-malaka darajasi mavjudligi ko‘rildi. Asl nusxaning P.003 belgisi 1-sahifada; tekshirilgan tanlangan sahifalar 1, 2, 6, 12, 17. Bu dastlabki manba sahifalari, barcha 17 betning to‘liq bandma-band ekspertizasi yoki normativ bugungi huquqiy kuchining tasdig‘i emas.

## Reconciliatsiya

| Kod | Kasb standarti matnidagi mehnat vazifasi | Aniqlashtirilgan dalil | Statik nazariyadagi tuzatish |
|---|---|---|---|
| M14.01 | O‘quv jarayonini rejalashtirish | DTS/o‘quv dasturi, o‘lchanadigan maqsad, individual ehtiyoj va AKTni rejalash | Jihozlar/namoyish bilan cheklangan ta’rif kengaytirildi; natija va baholash dalili qo‘shildi |
| M14.02 | Ta’lim samaradorligini ta’minlash | Faol metod, differensial yordam, metakognitiv rejalash–nazorat–o‘zini baholash | AKT/olimpiada orqali samaradorlikni baholash soddaligi o‘rniga mazmuniy mezon kiritildi |
| M14.03 | O‘zlashtirishni baholash va qayta aloqa | Diagnostika, tizimli kuzatish, bahoni asoslash, natijaga ko‘ra darsni o‘zgartirish | 5 ballik tizim universal deb ko‘rsatilmaydi; «Balans» isbotsiz vosita o‘chirildi |
| M14.04 | Tarbiyaviy faoliyat | Darsdagi va darsdan tashqaridagi tarbiya, qadr-qimmat, tashabbus va ziddiyatni hal qilish | «Faqat sinf rahbari, sinfdan tashqari» xato cheklovi olib tashlandi |
| M14.05 | Xavfsiz rivojlantiruvchi muhit | Teng imkoniyat, individual ta’limiy ehtiyoj, favqulodda xavfsizlik, mediasavodxonlik | Faqat bino/sanitariya emas, raqamli va psixologik xavfsizlik, ishtirok kiritildi |
| M14.06 | O‘z-o‘zini rivojlantirish va kasbiy o‘sish | Muntazam malaka, dars kuzatuvi, metodik kengash, refleksiya va amaliy yangilash | Normativ asos topilmagan «3–5 yilda bir marta» universal interval o‘chirildi |
| M14.07 | Hamkasblar va ota-onalar bilan hamkorlik | Ota-onani qarorga jalb qilish, individual trayektoriya, mutaxassislararo aloqa | Xabar almashish kanallari hamkorlikning yagona me’yori emas; maxfiylik va ishtirok yoritildi |

## UI va regressiya

- `src/data/topicContent.ts`: M14.01–07 uchun har biri source trace + didaktik jadval + informatika vaziyatli misol + xavfni ajratish eslatmasi. Ular server no-access holatidagi **fallback** hisoblanadi; `questions: []` saqlangan.
- `src/components/learning/TopicView.tsx`: M14 server-published darsi asosiy bo‘lib qoladi; **faqat backend darsi yuklanganida** manbadagi qisqa jadval/misol/note alohida `details` ostida ko‘rinadi. Bu production published darsni va javob kalitini o‘zgartirmaydi, yopiq turadi.
- `src/tests/PedagogyBloomSource.test.ts`: 7 ta M14 source integrity invariantlari, 1 ta qo‘shimcha jadval/namuna coverage testi, M15 kompensatsiya va oldingi source testlari. 23 ta test yozilgan.
- M14 canonical 7 ta learning topic bilan 5 ta rasmiy kasb standarti savoli chalkashtirilmaydi. Barcha M14 lesson per-page PDF citation va production 20-question pool expert signoff hali open.

## Jiddiy tahrir xavflari

1. Metodik qo‘llanma **asl kuchga kirgan normativ hujjat** o‘rnini bosa olmaydi; o‘qilgan nusxalardagi matnlar tartib farqini inkor etmaydi.
2. Malaka oshirish muddati har davrda boshqa normativda belgilanadigan masala; faqat umumiy standartdagi «muntazam» so‘zi manbada tasdiqlangan, avtomatik «3–5 yil» deb berish xato.
3. Tarbiya darsdan tashqarida ham, darsning o‘zida ham kechishi mumkin; bu sinf rahbari vakolatlari bo‘yicha aniq huquqiy cheklov o‘rnini bosmaydi.
4. O‘quvchi ehtiyoji/mutaxassis maslahatlashuvi maxfiylikka rioya qilgan holda bajariladi; umumiy messenjerdagi yozishma maxfiy suhbat bilan tenglashtirilmaydi.
5. Yangi test savollarini **reviewdan publishedga avtomatik o‘tkazish mumkin emas**. PDFdagi tarixiy answer key — mustaqil tasdiq emas.

## Keyingi to‘liq audit shartlari

- Original PDF huquqiy metadata, nashriyot, tasdiqlovchi organ va kuchga kirish sanasi bilan source registryni to‘ldirish.
- Fizik betlar bo‘yicha 7 kompetensiya uchun test banki → manba → official 2026 objective crosswalk.
- Published M14 question pool 7/7 mavzu bo‘yicha expert-reviewed, Y1/Y2/Y3 native format, variant kalit va server score E2E.
- M15/M16 davomli audit, to‘liq CI va owner UX acceptance; aytilmaguncha release qilmaslik.

## Rasmiy 2026 spetsifikatsiyasiga so‘nggi moslashtirish

Sarvar Drive hisobidagi Informatika Testlar spesifikatsiyasi.pdf (2026) bevosita o‘qildi. 2-jadvalda KS=5, PM.GEN=7, PM.MET=3, jami 15 test belgilangan. 7+8+3 platforma mavzulari esa savol kvotasi emas. Rasmiy spetsifikatsiyaning M15.07 ro‘yxatida «persiptiv-pedagogik qobiliyat», qo‘llanmada «Perseptiv qobiliyat» shakli bor. Har ikkala imlo tahrir qilinmasdan manbalar farqi sifatida izohlangan. Spetsifikatsiyada testlar tavsiya qilingan kitoblardan to‘g‘ridan to‘g‘ri ko‘chirib olinmasligi eslatilgan.


## Asl imzolangan kasb standarti — 2-sahifadan kodlar (TASK-252)

| Kanonik topic | Asl A/B kod | Mehnat vazifasi |
|---|---|---|
| M14.01 | A/01.6 | O‘quv jarayonini rejalashtirish |
| M14.02 | A/02.6 | Ta’lim samaradorligini ta’minlash |
| M14.03 | A/03.6 | O‘zlashtirishni baholash va qayta aloqa |
| M14.04 | A/04.6 | Tarbiyaviy faoliyatni tashkil etish |
| M14.05 | A/05.6 | Xavfsiz rivojlantiruvchi ta’lim muhiti |
| M14.06 | B/01.6 | O‘z-o‘zini rivojlantirish va kasbiy o‘sish |
| M14.07 | B/02.6 | Hamkasblar va ota-onalar bilan hamkorlik |

`src/data/topicContent.ts`dagi yettita statik kasb standarti nazariya bo‘limining `source` izlari endi **asl skan PDF 2-sahifasiga hamda har bir vazifa kodiga** ishora qiladi. Qo‘shimcha tafsilot: [TASK252_FOUR_SCANNED_PDFS_VISUAL_SOURCE_REVIEW_20261019.md](TASK252_FOUR_SCANNED_PDFS_VISUAL_SOURCE_REVIEW_20261019.md). Normativning hozirgi qonuniy kuchi va ekspert yakuniy source signoff mustaqil tekshiriladi.
