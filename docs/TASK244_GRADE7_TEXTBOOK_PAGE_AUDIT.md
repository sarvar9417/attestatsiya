# TASK-244 — 7-sinf informatika darsligi (2021): M01 manba izlari

**Audit sanasi:** 2026-10-19  
**Kitob:** M. R. Fayziyeva va hammualliflar, *Informatika va axborot texnologiyalari*, 7-sinf, 2021, 160 bet.  
**Drive PDF:** https://drive.google.com/file/d/1QMT7y-6nJLQ-f1-4SySBV8y8JrRpp4q-/view

**Holat:** mavzu va bet-darajasidagi source review; avtomatik savol-javob **editorial approval** emas. Kitobning butun nashri faqat quyidagi mazmuniy kesim bo‘yicha ajratib tahlil qilindi; barcha ARS savollari yakka-yakka sertifikatlangan degani emas.

## Kitobdagi M01 ga tegishli mavzular (bosma sahifalar)

| Sahifa | Asl kitobdagi mavzu | Tegishli M01 va savol nomzodlari |
|---|---|---|
| 4–8 | Axborotni saqlash, qayta ishlash, kiritish va chiqarish; signal; uzluksiz/uzlukli axborot | `M01.02`: `ARS-01-012`, `ARS-01-015`, `ARS-01-019`; `M01.04`: axborot jarayonlari |
| 9–12 | Sanoq sistemalari, diada/triada/tetrada va Xartli mazmuni | `M01.05`: `ARS-04-017`, `ARS-04-032..035`, `ARS-04-059..062` uchun formula tamoyili |
| 13–20 | Sanoq sistemalari orasida o‘tkazish va amallar | M01 kodlash bilan qisman, asosan boshqa rasmiy konstrukt (S3) bilan bog‘liq |
| 21–25 | Axborot hajmi va uzatish tezligi | `M01.05`: `ARS-04-021..031`, `ARS-04-041..046` uchun tushuncha/birliklar |
| 26–28 | Matnli axborot va ASCII/Unicode | `M01.06`: `ARS-05-001`, `ARS-05-002`, `ARS-05-014..016` uchun asos |
| 29–33 | Rastr/vektor, piksel, tasvir hajmi, RGB | `M01.06`: `ARS-05-003..006`, `ARS-05-028..033`, `ARS-05-057..061` uchun ta'rif/hisob |
| 34–38 | Audio va videoaxborotni kodlash | `M01.06`: `ARS-05-007..013`, audio/video hajm hisoblariga mavzu-darajasidagi tayanch |
| 40–46 | Kompyuter grafikasi turlari, RGB/CMYK, grafik formatlar | `M01.06`: `ARS-05-003..006`, `ARS-05-018..020`, rang modelini farqlash |

## Oldingi 5-sinf manba qarzlari bilan bog‘lash

- `ARS-01-015` — kiritish → qayta ishlash → chiqarish modeli: 5-sinf I bobda aniq uch bosqichli sxema topilmadi, ammo **7-sinf 4–5-betdagi kiruvchi axborot, protsessor/xotira, chiqarish qurilmalari chizmasi** tayanch manba bo‘la oladi.
- `ARS-01-012` — signal: **7-sinf 5–6-bet**, axborot kanalida uzatish va ikkilik signal modeli; 5-sinf Morze misolini to‘ldiradi.
- `ARS-01-019` — analog/raqamli: **7-sinf 6-bet**, analog va diskret ta'riflari, 5-sinfdagi soddalashtirilgan ta'rifga aniqlik kiritadi.
- `ARS-04-032..035` — teng ehtimolli holatlar uchun Xartli modeli: **7-sinf 9–12-bet**; mustaqil sonli hisoblarni alohida validator bilan tekshirish kerak.
- `ARS-05-028..031` — `2^i` ranglar modeli: **7-sinf 29–31-bet**; rastr pikselining rang kodi bilan birga.
- `ARS-05-018` — RGB ekran rangi: **7-sinf 31-bet**; `ARS-05-019` CMYK bosma: **7-sinf 43–46-bet**.

## Muhim qamrov va modernizatsiya eslatmasi

7-sinf darsligining 25-betida uzatish birliklari ayrim tarixiy o‘quv ifodalarida `Kbit` uchun 1024 ko‘paytuvchisi bilan berilgan. Platformada mustaqil hisobli savollar **birlikni explicit** berishi kerak:
- `kbit` = 1000 bit; `Mbit` = 10^6 bit (SI);
- `Kibit` = 1024 bit; `Mibit` = 1024^2 bit (IEC);
- `kB` = 1000 B, `KiB` = 1024 B.

5–7-sinf darsliklaridagi eski qisqartmalarni shart qo‘ymasdan zamonaviy SI deb qabul qilish javob xatosi xavfini tug‘diradi. `ARS-04-021..031` savollarining matni allaqachon SI/IEC ni ajratishni so‘raydi; bularni saqlash, lekin boshqa imported savollarda birliklarni tekshirish lozim.

## Holat / tugallanmagan ishlar

- Kitobning M01ga tegishli betlari bilan tematik moslik tekshirildi.
- `M01.05` va `M01.06` masalalaridan avtomatik arifmetik verifikatsiya uchun `src/tests/M01IndependentNumericQA.test.ts` qo‘shilgan.
- Har bir masala, distraktor, formula, rasm, javob va izoh uchun individual **page fingerprint + subject-matter approval** hali bajarilmagan; yashirincha DONE deyilmasin.
- Boshqa sinf darsliklariga manba qarzlari ustida ishlash davom etishi kerak.
- Merge, production DB, publish va deploy taqiqlangan.

