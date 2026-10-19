# M14 Kasb-standarti.pdf — 12 sahifaning vizual tekshiruvi (2026-10-19)

**Manba**: [Kasb-standarti.pdf, barnoyevak Drive/pedagogika/files](https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view).

## Usul va kuzatilgan natija

Drive ulanishidan asl PDF raw fayl sifatida olindi (**190 555 bayt, 12 fizik sahifa**). Har 12 sahifa raster tasvirga aylantirildi va sarlavha/jadval tuzilishi vizual tekshirildi; 6- va 9-sahifalar katta ko‘rinishda qo‘shimcha ko‘rildi. Matn extract va fizik bet sarlavhalari mos tushdi. Sahifa raqamlari PDF ko‘ruvchidagi **birinchi betdan hisoblangan fizik indekslar**, ichki bosma pagination emas.

| M14 | PDF fizik sahifalari | Tasvirda tasdiqlangan bo‘lim |
|---|---|---|
| M14.01 | 2–3 | O‘quv jarayonini rejalashtirish; mehnat harakatlari, zarur ko‘nikma va bilim |
| M14.02 | 4–5 | Ta’lim samaradorligini ta’minlash; metakognitiv, faol va individual yondashuv |
| M14.03 | 6 | O‘zlashtirishni baholash va qayta aloqani taqdim etish; diagnostika, qayta aloqa, bahoni asoslash |
| M14.04 | 7–8 | Tarbiyaviy faoliyatni tashkil etish; dars ichida va undan tashqaridagi vazifalar |
| M14.05 | 9–10 | Xavfsiz rivojlantiruvchi ta’lim muhiti; teng imkoniyat, favqulodda vaziyat, mediasavodxonlik |
| M14.06 | 11 | O‘z-o‘zini rivojlantirish va kasbiy o‘sish; refleksiya, muntazam rivoj |
| M14.07 | 12 | Hamkasblar va ota-onalar bilan hamkorlik; ota-onani jalb qilish va o‘quvchi trayektoriyasi |

**Manba cheklovi:** Bu tekshiruv *aynan Drive’dagi PDF nusxasining sahifalarini* tasdiqlaydi. PDFning qabul qilingan rasmiy normativ hujjat bilan bir xil nashr ekanligi, huquqiy kuchi, kuchga kirgan sanasi yoki keyingi o‘zgarishlar tekshirilgani **emas**. Bundan hech bir savolning answer key’i avtomatik tasdiqlanmaydi.

## Kod va regressiya

- `src/data/topicContent.ts` dagi 7 ta M14 canonical source bloki aniq sahifa lokatori bilan to‘ldirildi.
- `src/tests/PedagogyKasbStandardPages.test.ts` har bir mavzuning fizik sahifasi va manba maqomi bo‘yicha ehtiyot izohlarini saqlashga xizmat qiladi.
- M14 statik test kalitlari va serverda published savollar o‘zgarmadi.

**Ochiq ishlar:** original normativ identifikatori/hujjat tahririni aniqlash, aniq rasmiy statusi va M14 savol IDlariga qiyoslash, qolgan PDFlar sahifalarini ayni tarzda tekshirish.
