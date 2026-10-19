# TASK-272 — ICT 10-sinf M02.01: chastota va xotira birligi tuzatishi

**Original manba:** Sarvar Google Drive `ICT 10_sinf-2021_compressed.pdf`, fayl ID `1KNBa9-8wlk-CV8cZPUzEqYgMsvBdZb_3`; 10-sinf muqova, 2021. Darslik kirish metadata matnida tasodifiy “7-sinf” yozuvi bor, ammo muqova va mavzu 10-sinf ekanini tasdiqlaydi.

**Aniq sahifa dalili (bosma, PDF indeksini avtomatik tenglashtirmang):** 15–16-betlarda portativ USB/SSD/HDD/microSD qurilmalari sig‘imi aralash `Gb`, `ГБ`, `Tb` belgilarida keltirilgan. 17-bet 4-dars «Kompyuterning ichki qurilmalari» protsessor bo‘limida *1000 Hz = 1 MHz* deb yozilgan, bu SI bo‘yicha noto‘g‘ri. To‘g‘ri: **1000 Hz=1 kHz; 1000 kHz=1 MHz; 1000 MHz=1 GHz**. 1 MHz = 10⁶ Hz. Qurilma sig‘imi uchun bit (`b`) va bayt (`B`) aralashtirilmaydi: 1 B=8 bit, 128 Gb=16 GB (decimal SI).

**Platformadagi chora:** `src/data/topics/m02SourceTheory.ts` M02.01 kanonik qurilmalar nazariyasiga tarixiy kitob xatosini aniq ko‘rsatadigan `trap`, bit/bayt konvensiyasini misol orqali ajratadigan `case` va original kitob/manba izi `source` bloki qo‘shildi. Darslikdagi xato imtihonning to‘g‘ri javobi sifatida takrorlanmasin. Protsessor takt chastotasi bevosita 'sekunddagi amallar soni' sifatida soddalashtirilmasin.

**Test:** `src/tests/M02ICT10UnitsFidelity.test.ts` aniq SI zanjiri, konversiya, ko‘rinuvchi kanonik dars va manba izini tekshiradi.

**Ochiq shartlar:** Rasmli original sahifalar vizual ko‘rilishi, barcha M02 savollari bilan mosligi, published DB nazariyasiga nisbatan farq va haqiqiy o‘quvchi sahifasida namoyoni, telefondagi ko‘rinishi va ekspert imzosi hali tekshirilmagan. No production SQL, answer keys, publication or deploy.
