# TASK-244 — 9-sinf darsliklari, M01 manba qarzlari

**Sana:** 2026-10-19.  
**Status:** manba/bo‘lim/source-locator review, savollar uchun inson eksperti `approved` yozilmagan.

## 9-sinf, 2020 o‘zbek darsligi (Fayziyeva, Sayfurov, Xaytullayeva)

**Drive:** https://drive.google.com/file/d/1scsbz-Lgfy6_xAUrO_YVCfNE5KmV1qMe/view

| Sahifa | Mavzu | Asosiy rasmiy guruh |
|---|---|---|
| 4–16 | Mantiq, mantiqiy amallar, rostlik jadvali va sxemalar | `S3`: mantiq va algoritmlash |
| 17–26 | Kompyuterda masala yechish bosqichlari va modellashtirish | `S3` |
| 27–46 | Algoritm, blok-sxema, chiziqli/tarmoqli/takrorlanuvchi jarayon | `S3` |
| 47–108 | Python sintaksisi, operator, sikl, funksiya va masalalar | `S4`: dasturlash |

**M01 uchun izoh:** bir qancha asosiy axborot atamalari umumiy matnda ishlatiladi, ammo ushbu darslikning bosh mazmuni M01 emas. Uni M01dagi bit/bayt yoki raqamli madaniyat savollarining universal source locatoriga aylantirmaslik kerak.

## Cambridge+ 9-sinf (Wright, Taylor; 2021 o‘zbek moslashtirilgan nashri)

**Drive:** https://drive.google.com/file/d/10MX-nD_cW89Kz4aBgEabddM0aS2YgtYm/view

| Kitob bobi/sahifalari | Mazmun | M01 statusi |
|---|---|---|
| 1–3-bob, 1–40 | Kompyuter qurilmalari, xotira, uzatish vositalari | M01ga faqat tematik; asosiy M02 |
| 4–5-bob, 41–63 | Tarmoqlar, IT ta'siri | M01 raqamli madaniyat uchun qisman; asosiy S6/S7 |
| 6-bob, 64–90 | AKTni amaliy tatbiq etish, ekspert tizimlar va **bilimlar bazasi** | **ARS-01-008** manba nomzodi. 5-sinfda topilmagan bilimlar bazasi tushunchasini ushbu bobdagi tibbiy ekspert tizimining qoidalari va faktlari orqali manbaga bog‘lash mumkin; itemning distractorlari alohida tekshirilsin |
| 7-bob, 91–104 | Tizimning hayot davri, ma'lumotni **validatsiya** qilish, turi/format/uzunligini tekshirish | Oldingi 570 private AXB bankidagi `validation/verifikatsiya` 21 ta `review` item uchun **mavzuga mos matn manbasi** bor, ammo rasmiy S1.INFO konstruktida mustaqil bandligi aniq emas; avtomatik nashrga asos bo‘lmaydi |
| 8-bob, 105–121 | Axborot xavfsizligi, shaxsiy ma'lumotlar va tahdidlar | M01 raqamli madaniyatga qisman, asosan S7 |
| 9-bob, 122–129 | Auditoriya va maqsadli kommunikatsiya | M01 axborotni maqsadga mos taqdim etish savollariga kandidat |
| 10-bob, 130–138 | Kommunikatsiya vositalari va kanallar | M01 `xabar`, `aloqa kanali` kabi tushunchalarga qisman |
| 12-bob, 146–159 | Rasm, grafik ishlov berish | M01 media bilan aloqador, asosan S5 |
| 15-bob, 185–193 | Xatolarni tekshirish | Oldingi private AXB paritet, checksum, check-digit kabi 9 `review` itemga manba nomzodi. **Manba mavjudligi rasmiy konstruktga a'zolikni isbotlamaydi** |
| 18–20-bob, 218–277 | Ma'lumotlarni boshqarish va tahlil | M01dagi saralash, guruhlash, filtr va xulosa uchun amaliy manba; chuqurroq S4/office qismi ham mavjud |

**Asosiy topilma:** 5-sinf darsligida `ARS-01-008` — bilimlar bazasi tushunchasiga aniq iz topilmagandi. Cambridge+ 9-sinf **6-bob**da faktlar bazasi, qoidalar bazasi va xulosa chiqarish moduli bilan ekspert tizimi ko‘rsatilgan. Bu **source-gap nomzodini** yopishga xizmat qiladi, biroq ARS-01-008 javobining o‘zi va barcha alternativlari hali mustaqil ekspert ko‘rigini kutadi.

**Xavfsizlik:** `docs/AXBOROT_BANK_IMPORT_AUDIT.md` bo‘yicha oldingi 570 itemli private AXB importda 30 ta item (21 validation/verification, 9 checksum/parity) `review` holatida qolgan. 9-sinfda kitobiy mavzu borligi ularni avtomatik `published` qilishga ruxsat bermaydi: avval rasmiy 2026 spetsifikatsiyadagi tegishli konstruktning mosligi va inson ekspert tasdig‘i zarur.

**To‘liq bo‘lmagan qism:** bir-biridan farqli oldingi M01 manba qarzlari `ARS-01-006/007/009/010/020` kabi atamalar uchun keyingi 10–11-sinf hamda qo‘llanma tekshiruvi kerak. Main merge/production DB/deploy qilinmaydi.
