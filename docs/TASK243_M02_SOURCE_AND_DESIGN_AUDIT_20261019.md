# TASK-243 — M02 kompyuter tizimlari va dasturiy muhit: nazariya/dizayn auditi

**Sana:** 2026-10-19
**Status:** IN_PROGRESS / EDITORIAL REVIEW PENDING. **Release approval emas.**
**Ish branchi:** `task/TASK-243-m02-source-and-theory-audit` (M01 `TASK-242` branchi asosida).
**Cheklov:** `main`ga merge, production deploy, production DB migratsiyasi va savollarni publish qilishga ruxsat yo‘q.

## Rasmiy spetsifikatsiya va kanonik ko‘rinish

Google Drive'dagi «Informatika Testlar spesifikatsiyasi.pdf» (2026): «Kompyuterning texnik va dasturiy ta’minoti» bo‘yicha **2 ta attestatsiya savoli**. Mazmun sohasi M03 ofis dasturlari bilan bir jadvalda kelgan; 2+5=7, M02ning o‘zi 7 ta savol emas.

| Konstrukt | Kanonik sahifa | Avvalgi statik nazariya | Darslik dalili va kontekst |
| --- | --- | --- | --- |
| Qurilmalar, ichki/tashqi, RAM/ROM/CPU | M02.01 | M02.01–M02.05 | ICT 10 PDF 6–20; Cambridge+ 9 PDF 8–46; Cambridge+ 10–11 PDF 32–42 |
| Operatsion tizimlar, CLI/GUI, jarayon va interfeys | M02.02 | M02.07 | ICT 5 PDF 39–42; ICT 10 PDF 24–28; Cambridge+ 9 PDF 9–13; Cambridge+ 10–11 PDF 50–57 |
| Fayl/papka/manzil, kengaytma, nusxalash/ko‘chirish | M02.03 | M02.09 | ICT 5 PDF 43–47; ICT 10 PDF 24–28; Cambridge+ 9 fayllar boshqaruvi |
| Tizimli/amaliy/utilita, drayver, tarjimon, litsenziya | M02.04 | M02.06, M02.08 | ICT 5 PDF 39–42; ICT 10 PDF 28–31; Cambridge+ 9 PDF 9–13; Cambridge+ 10–11 PDF 43–61 |

**Manba ko‘lami:** eski `docs/M02_13_BOOK_COVERAGE_AND_QA_STATUS_20261018.md` 13 ta kitobni **tanlanma** sahifalarda ko‘rib chiqqan, sahifama-sahifa to‘liq audit emas. Bu bosqichda Drive orqali ICT 5, ICT 10, Cambridge+ 9, Cambridge+ 10–11 original matnlarining konkret parchalari qayta ko‘rildi va 2026 spetsifikatsiyasi o‘qildi. Barcha 13 darslikni to‘liq ekspert tekshirdik deb da’vo qilinmaydi. PDF sahifa raqamlari chop sahifalaridan farq qilishi mumkin.

## Kiritilgan aniq tuzatishlar

1. `src/data/topicContent.ts` ning **faqat M02** segmentida texnik xatolar va yangilanishga sezgir ifodalar tuzatildi: SSD uchun noto‘g‘ri «Yaqqol xotira», RAM/kesh/registr tezligi, ROM va flash BIOS/UEFI, virtual xotira, qurilma interfeyslari, mobil bozor ulushini asossiz qat'iy foizda berish, litsenziya bilan bepul/pullikni aralashtirish, dastur turlariga o‘yinlar va o‘quv ilovalarini mustaqil uchinchi/to‘rtinchi turdek qo‘yish, Windowsga xos fayl nomlash qoidalarini barcha OTga tatbiq qilish, katalog/daraxtni chalkashtirish.
2. ENIAC «birinchi elektron kompyuter» sifatidagi noaniq savol tarixiy jihatdan ehtiyotkor formulaga o‘tkazildi; to‘g‘ri javob **ENIAC** va identifikator saqlandi.
3. Eski bankdagi `34` ta ko‘p variantli savoldan `7` tasi `Y2` (moslashtirish) deb belgilangan, lekin `pairs` yo‘q. Frontend `isQuestionCorrect` bunday savolni to‘g‘ri tekshira olmaydi. Ularga haqiqiy format `Y1` berildi; `id`, `options` va `correctIndex` o‘zgarmadi. Bu **faqat statik fallback** banki, production/private DB savollari o‘zgarmadi.
4. «Lazerli printer qanday turdagi printer?» kabi mazmunsiz savol vaziyatni bilishga tekshiradigan so‘rovga o‘girildi; noto‘g‘ri universal «qolganlari amaliy dasturlar» izohi to‘g‘rilandi.
5. `src/data/topics/m02SourceTheory.ts`dagi **CLI/GUI** va **fayl amallari** jadvallarining real ko‘rsatiladigan `headers/rows` matni source Markdown bayoniga moslashdi. Oldin mazmuni soddalashtirilgan satrlar foydalanuvchiga ko‘rsatilgan.
6. `paginateTheoryBlocks`ga ixtiyoriy `keepHeadingWithNext` rejimi qo‘shildi va **faqat M02** uchun yoqildi: keyingi tushuntirishdan ajralgan sarlavha sahifa oxirida qolmaydi. Boshqa modullarning sahifalash algoritmi o‘zgarishsiz.
7. `src/tests/M02SourceFidelity.test.tsx` yangi himoyalar: rasmiy 2-savollik konstrukt, 4 mavzu, 9 oldingi qism, 34 Y1 savolning javob kalitlari tuzilmasi, 2 jadvaldagi `rows`-Markdown tengligi, source izlari, hech qanday blok tushib qolmasligi, heading-aware sahifalash.

## Release oldidan majburiy ishlar

- 13 ta original ICT/Cambridge+ manbaning **M02ga tegishli barcha parchalari** bo‘yicha sahifama-sahifa expert concordance va textbook-version drift tekshiruvi.
- Savollarni faqat statik konstrukt va `correctIndex` bilan emas, haqiqiy published/backend `Y1/Y2/Y3` tarkibi, asoslovchi manba, distraktor va moslik bo‘yicha tekshirish.
- Authenticated learner E2E (4 mavzu, nazariya → test → javob → natija → keyingi mavzu), mobil va desktop real UI ko‘rigi.
- Yakuniy commit uchun lint/typecheck/unit/build/E2E CI va insonning alohida editorial/release roziligi.

**Xulosa:** M02 uchun tekshirish va tuzatishlar kodga saqlandi; to‘liq material/UX/production release tasdig‘i **hali yo‘q**.
