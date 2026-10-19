# TASK-288 — M03.06/M03.07 va M15.05/M15.06 — manbali o‘qish boblari

**Holat:** to‘rtta avvalgi qisqa statik konspekt o‘rniga to‘liqroq mustaqil bob o‘qiladi; bir xil konspekt pastda ikkinchi nazariya bo‘lib takrorlanmaydi. Savollar, javob kalitlari, manba qaydlari va nashr holati o‘zgarmaydi.

| Mavzu | Yangi blok | Bo‘lim | Nazariya va original amaliy misollar |
|---|---:|---:|---|
| M03.06 Excel: sort/filter | 56 | 12 | qator butunligi, multi-level sort, filter, AND/OR, shartli filtr, tip va yashirin qiymatlar, 6 mashq |
| M03.07 Excel: diagrammalar | 55 | 12 | column, bar, line, pie, scatter, histogram, masshtab, Excel Chart Elements, 6 mashq |
| M15.05 Sinf rahbari/ota-ona | 54 | 12 | oila va fan o‘qituvchisi vazifalari, muloqot, dalil, maxfiylik, xavfsizlik, hamkorlik, 6 keys |
| M15.06 Pedagogik etika/nutq | 54 | 12 | pedagogik takt, texnika, 7 nutq sifati, pedagogik refleksiya, xolis qayta aloqa, 6 keys |

## Manbalar
- [Cambridge+ 10–11-sinf ICT, 8-bob](https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view) — elektron jadvallardagi format/ma’lumot/diagramma va tahlil mantiqi; raqamli masalalar mustaqil didaktik namunalar
- [Kasb standarti — hamkasb va ota-onalar hamkorligi](https://drive.google.com/file/d/1HdlFFazzvvO-FMItZKOIna0jRS6p-Lpq/view) — kasbiy hamkorlik mazmuni. Bu yerda amaldagi majburiy normativ ro‘yxat da’vo qilinmaydi
- [F.O. Mirzayeva, Pedagogika nazariyasi](https://drive.google.com/file/d/1GG9dH4_kdMyj5cqKML21lQoZufO40E38/view) — oila pedagogikasi tushunchasi
- [N. Mahmudov, O‘qituvchi nutqi madaniyati](https://drive.google.com/file/d/1MUrT_uKKg-0jWwV16j97AzkcbU6LGpHL/view) — nutqning yetti kommunikativ sifati
- [N. Muslimov va boshqalar, Pedagogik kompetentlik](https://drive.google.com/file/d/1M0vGhTnSMehXfyEHo3dlHXUgeA_DTbfN/view) — refleksiya

## Texnik himoya
- M03.06/.07 ning 4 tadan asl statik test savoli va to‘g‘ri javob indeksi saqlanadi; oldindan tekshirilgan 5 ta Office manbaviy ilova har darsda saqlangan.
- M15.05/.06 uchun offline javob kaliti yaratilmadi. Serverdagi nashr savollari, `getPedagogyStudyNotes` qaydlari va TopicView o‘qish yo‘li saqlangan.
- Yangi o‘qish boblari sahifama-sahifa PDF nusxasi emas; undagi keyslar va mashqlar mustaqil yozilgan. Rasmlar fizik ko‘rikdan o‘tkazildi degan da’vo qilinmaydi.
- `TASK288FourCanonicalBooks.test.ts` — mazmun struktura, test key, ilova, qo‘shni dars izolatsiyasini tekshiradi.
- Navbat: M03.08–10 PowerPoint, M15.07–08 pedagogika va qolgan ko‘plab M04–M13 qisqa darslar. Qisqa darslarning ro‘yxati `scripts/audit-theory-depth.ts` orqali aniqlanadi; barcha materialning to‘liq tekshirilgani degan da’vo yo‘q.

**Jarayon:** GitHub CI 4/4 yashil bo‘lmasa merge qilinmaydi. Deploy qilinmaydi.
