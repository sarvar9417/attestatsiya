# TASK-244 — Cambridge+ 10–11-sinf (2021): M01ga daxldor manbalar

**Darslik:** Paul Long, Sarah Lawrey, Victoria Ellis, *Informatika va axborot texnologiyalari* (Cambridge International AS & A Level IT moslashtirilgan nashr), 2021. Drive ID `1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ`.

**Fayl:** 360 PDF sahifa, 9 619 312 bayt, SHA-256 `70cc04baf99b61958e40967ff3feda0fa349fd50014585721424817bcfaf5b79`. Bosma 1-sahifa = PDF 10-sahifa (9 sahifa siljish).

**Yondashuv:** mundarijadagi 19 bob M01 va boshqa modullar o‘rtasida ajratildi. M01 manbalari bo‘yicha asl sahifa matni o‘qildi va grafik/jadvalga oid mavzular konsept darajasida tekshirildi. Bu barcha 360 sahifadagi barcha diagrammalar to‘liq vizual ekspertizadan o‘tdi degani emas.

| PDF sahifalar | Asl darslik bo‘limi va fakt | M01 joyi | Natija |
|---|---|---|---|
| 10–12 | Xom maʼlumot, kontekstga ega axborot va inson tajribasiga tayanuvchi bilimlar | M01.03 | Uch tushunchani farqlovchi original jadval qo‘shildi |
| 13–16 | Statik va avtomatik yangilanadigan dinamik axborot; bevosita/bilvosita manbalar va sifat | M01.03 | Statik/dinamik, birlamchi/ikkilamchi manba va aniqlik/dolzarblikni aralashtirmaslik izohi |
| 17–26 | Kodlash, RLE va kriptografiya; aloqa xavfsizligi | M01.05 va M01.04 | Kengroq mavjud M01 nazariyasi bilan mosligini solishtirish kerak; ayni commitda yangi insert yo‘q |
| 27–31 | Validation vs verification va maʼlumot xatosini aniqlash | M01.04 | Mavjud «Xatolarni aniqlash» bo‘limi; maxsus jadval/rasmlarni visual QA davomida yana tekshirish kerak |
| 64–72 | Sensorli kuzatuv/boshqaruv, analog-raqamli konvertatsiya | M01.03/M02 | Asosiy taʼrif bor, apparat boshqaruvi M02ga qoldirildi |
| 80–86 | Raqamli tengsizlik: iqtisodiy, ijtimoiy va texnik cheklovlar | M01.04 | 4 omilli jadval va «ulanishning o‘zi kifoya emas» izohi |
| 87–102 | Tarmoq yordamida xabar almashish | M01.04/M02 | M01da raqamli kommunikatsiya tamoyillari; tarmoq konfiguratsiyasi M02ga |
| 103–112 | Ekspert tizimlari | M01.02/M04 | Fan konteksti va amaliy qarorlarni ajratish; maxsus algoritmlar tegishli modulga |
| 193–205 | Tovush va videoni tahrirlash, yo‘lakchalar, effektlar, raqamli namunalash | M01.06 | Original tahrir/konvertatsiya farqi va sahifali izoh |
| 210–231 | Yangi texnologiya va jamiyatga taʼsir | M01.02/M01.04 | Jamiyat va raqamli tengsizlik bo‘yicha keyingi chuqur vizual auditga saqlandi |
| 232–360 | Tarmoq, loyiha, animatsiya, veb va amaliy faoliyat boblari | M02/M03 va tegishli modullar | Avtomatik M01ga ko‘chirilmadi |

**Kodda bajarildi:** `src/data/topics/m01TextbookAuditCambridge1011.ts` — to‘rtta sahifali original qo‘shimcha; `src/data/topics/m01TextbookAudit.ts` — M01 nazariya agregatoriga ulandi; `src/tests/M01Cambridge1011BookAudit.test.tsx` — manba sahifalari, mavjud heading va barcha 12 kanonik M01 mavzularining yo‘qolmasligini tekshiradi.

**Release:** asosiy `m01.ts` generatsiya fayli o‘zgartirilmadi. Merge, production deploy va production DB write yo‘q. Barcha materiallar bo‘yicha to‘liq grafik QA va yakuniy CI natijasi alohida tekshiriladi.
