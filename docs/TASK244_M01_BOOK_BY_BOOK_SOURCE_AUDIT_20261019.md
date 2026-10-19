# TASK-244 — M01 nazariyasi: darsliklarni bittalab, sahifa asosida tekshirish

**Boshlangan sana:** 2026-10-19  
**Status:** IN_PROGRESS — kitob 1–7/13 (ICT5, ICT6, ICT7, ICT8, ICT9, ICT10, ICT11) bo‘yicha M01ga daxldor sahifalar o‘qildi va nazariya to‘ldirildi. Barcha M01 mavzulari va barcha darsliklar **hali to‘liq tasdiqlanmagan**.  
**Ish branchi:** `task/TASK-244-m01-book-by-book-source-audit`.  
**Release qoidasi:** `main`ga merge qilinmaydi, production deploy, DB write yoki test publish amalga oshirilmaydi.

## Usul (eski kalit-so‘z izlash auditi o‘rniga)

1. Drive’dagi **bitta original PDF** raw-byte qilib olinadi, to‘liq sahifalar soni va nashri aniqlanadi.
2. Barcha sahifalar mundarija va mazmun chegaralari bo‘yicha ko‘riladi; **M01ga tegishli barcha sahifalar ketma-ket o‘qiladi**. Jadval, rasm va formulalar mavjud sahifalar rastrga chiqarib tekshiriladi.
3. Sahifa → asl tushuncha → M01 kanonik topic → platformadagi o‘xshash material → yetishmagan yoki noto‘g‘ri joy **alohida qayd qilinadi**.
4. Uzun darslik parchasi ko‘chirilmaydi. Xatolar **o‘z so‘zlari bilan**, qisqa, ravshan, darslik va PDF sahifasi ko‘rsatilgan nazariya bloklarida tuzatiladi.
5. Generatsiya qilinadigan `m01.ts` qo‘lda o‘zgartirilmaydi: `m01TextbookAudit.ts` original kontentni yo‘qotmasdan o‘z joyiga sahifali addenda joylaydi. Testlar va CI release-gatega kiradi.
6. Keyingi kitobga o‘tilishidan oldin shu kitobning M01 sahifalari reyestri va kodli taqqoslash holati yoziladi. To‘liq 13 kitob tugamaguncha **M01 FULLY COMPLETE** deyilmaydi.

## 1-kitob: ICT 5-sinf (2020) — autentik PDF

- **Drive fayl:** `ICT 5_sinf-2020_compressed.pdf` (Google Drive ID `1KPjag_YqjgQbtd4HFEcEkQviJiwaduC9`).
- **Hajm:** 11 909 775 bayt; **113 PDF sahifa**; Kamaltdinova D.T., Sayfurov D.M., Toshkent: «Tasvir», 2020.
- **SHA-256:** `c9ecf47a8a72159244964635aae635f846f516394dbe73aa9f0e9c678047aac9`.
- **Original sahifa raqami qoidasi:** PDF 10 = bosma 9; PDF 24 = bosma 23. PDFning boshlang‘ich muqova/texnik sahifalari sabab ofset 1.
- **Amaldagi ko‘rik:** 113 sahifaning matn chiqarilishi va boblar xaritasi tekshirildi; M01 bilan bevosita bog‘liq PDF 10–24, maktab xavfsizligi bo‘yicha PDF 6–9 **har bir sahifada** o‘qildi. PDF 11, 14–16, 18–23 va boshqa tanlangan murakkab/rasmli sahifalar grafik ko‘rinishda ham tekshirildi. PDF 25–113 ning boshqa modullarga tegishli matnini M01ning to‘liq asosiy mazmuni sifatida noto‘g‘ri da’vo qilmaymiz.
- **Korpus taqsimoti:** PDF 1–5 — muqova/mundarija/kirish; PDF 6–24 — I bob (M01 konseptlari va xavfsizlik); PDF 25–38 — apparat/klaviatura (M02); PDF 39–48 — OT va fayl/papka (M02); PDF 49–110 — boshqa modullar uchun Office/grafika/dasturlash; PDF 111–113 — manba/nashr/holat sahifalari.

### M01 bo‘yicha PDF sahifa–mavzu reyestri (19 sahifa, ketma-ket)

| PDF sahifa | Darslikdagi dalil/obyekt | M01 mavzusi | Solishtirish va natija |
|---|---|---|---|
| 6 | Elektr xavfi va kompyuter xonasi qoidalariga kirish | M01.04 | Amaliy xavfsizlik addendumi kiritildi |
| 7 | 10 ta laboratoriya/xona qoidasi, o‘tirish | M01.04 | Qisqa amaliy ro‘yxatga sintez qilindi |
| 8 | Ergonomika, tanaffus, sog‘liq | M01.04 | Asosiy prinsiplar kiritildi; raqamli qat’iy meʼyorlar imtihon standarti sifatida olinmadi |
| 9 | Xavfsizlikni mustahkamlash topshiriqlari | M01.04 | Talablar vaziyatli amaliy qoida bilan ifodalandi |
| 10 | Informatika faniga kirish, atama tarixi va vazifalari | M01.02 | Tarixiy atama va zamonaviy farq aniqlandi, addendum |
| 11 | Vosil Qobulov va kibernetika; hardware/software/brainware | M01.02 | Uch yo‘nalish uchun 3 qatorli jadval va tarixiy iz |
| 12 | Mantiq, Arastu, Farobiy, al-Xorazmiy tarixi | M01.02 | Tarixiy bog‘lanish qo‘shildi, yakka mualliflik da’vosi oldi olindi |
| 13 | Fan ta’riflari, texnik/dasturiy/aqliy mehnat mashqlari | M01.02 | Izohli 3 yo‘nalish jadvaliga joylashtirildi |
| 14 | Besh sezgi, axborotni qabul qilish | M01.03 | Mavjud ta’rif bilan solishtirildi; sezgi kanali va ifoda shakli ajratildi |
| 15 | Analog/uzlukli, axborot sifati, 90/9/1 nisbatlari | M01.03 | Sifat mezonlari bor; universal asoslanmagan foizlarni fakt sifatida takrorlamaslik bo‘yicha trap qo‘shildi |
| 16 | Izlash, yig‘ish, saqlash, nusxalash, uzatish va boshqalar | M01.04 | Mavjud hayotiy siklga bog‘landi |
| 17 | Axborot texnologiyalari va real hayotdagi 5 vaziyat | M01.04 | 5 qatorli vaziyat → jarayon jadvali qo‘shildi |
| 18 | Morze signal/belgisi, kodlash motivatsiyasi | M01.05 | Mavjud kodlash/tarixiy alifbo bo‘limi bilan solishtirildi |
| 19 | Kod/dekod, rang kodlari, skitala va shifrlash | M01.05 | Mavjud kriptografiya va RGB tushunchalari bilan tekshirildi |
| 20 | Sezar surish shifri, 01–30 harf-raqam jadvali, ikkilik kod | M01.05 | «VATAN» raqamli kodlash misoli kiritildi; kodlash ≠ shifrlash |
| 21 | 1 bayt = 8 bit, 1024 maktab birligi, ASCII | M01.05–06 | SI `kB` va IEC `KiB` konvensiyalari bo‘yicha aniq trap/izoh |
| 22 | «GUL»ning 3 bayti; 160 × 40 × 60 = 384 000 B / 1024 = 375 | M01.05 | Sharti, 2 ta formula va 375 KiB / 384 kB izohi bilan worked solution |
| 23 | Semafor, Brayl, ikki rangli ikkilik tasvir | M01.05–06 | Mavjud tarixiy alifbo/rastr bilan bog‘landi |
| 24 | 2 rangli yelkanlar, bit/bayt mashqlari va belgi hajmi | M01.05 | 2×2=4 kombinatsiyali vaziyat tushuntirildi |

**Tuzatish meʼyori:** kitobdagi tarixiy soddalashtirishlarni manbasiz universal qonun deb ko‘chirmaymiz. «1 belgi = 1 bayt» faqat misolning maxsus kodlash shartida; hozirgi UTF-8 fayllar uchun doim to‘g‘ri emas. 90/9/1 qabul ulushlari attestatsiya mezoni qilib qabul qilinmaydi.

### Darslikdan platformagacha tayyor bo‘lgan kod o‘zgarishlari

- `src/data/topics/m01TextbookAudit.ts`: to‘rtta mavzu uchun **6 ta aniq joyli addendum** (`M01.02`, `M01.03`, `M01.04` ×2, `M01.05` ×2), har birida PDF sahifali source trace.
- `src/data/topicContent.ts`: `withVerifiedM01Additions(M01_CONTENT)` bilan generatsiyalangan matnlar **bittasi ham tushmay** tegishli bo‘limiga ulanadi.
- `src/tests/M01ICT5BookAudit.test.tsx`: mavzular, asl bloklarning yo‘qolmasligi va tartibi, sahifa izi, formulasining hisob sharti, sarlavha/manba vizual renderer va anchor regressiyasi.

## Keyingi darsliklar: majburiy bittalab navbat

| Tartib | Darslik | M01 sahifa–nazariya tekshiruvi |
|---:|---|---|
| 1 | ICT 5-sinf (2020) | **M01 PDF 6–24 o‘qildi, original izohlar kiritildi; CI kutilmoqda** |
| 2 | ICT 6-sinf (2021) | **M01 PDF 76–127 o‘qildi; 4 ta sahifali addendum qo‘shildi; CI yakuniga bog‘liq**. Tafsilot: `docs/TASK244_ICT6_M01_PAGE_CONCORDANCE_20261019.md` |
| 3 | ICT 7-sinf (2021) | **M01 PDF 4–46 hamda 80–83 o‘qildi; 7 ta sahifali addendum.** `docs/TASK244_ICT7_M01_PAGE_CONCORDANCE_20261019.md` |
| 4 | ICT 8-sinf (2020) | **M01 raqamli savodxonlik PDF 5–36, 94–104 o‘qildi, CMS/LMS/MOOC konseptlari 37–93 bilan qiyoslandi; 4 ta original sahifali addendum.** `docs/TASK244_ICT8_M01_PAGE_CONCORDANCE_20261019.md` |
| 5 | ICT 9-sinf (2020) | **114 sahifa boblari xaritalandi; PDF 5–27 o‘qildi, M01ga tegishli PDF 19–22 va 27 hisoblari tekshirildi; 3 ta original addendum.** M04ga tegishli darslik nomuvofiqliklari reyestrga yozildi. `docs/TASK244_ICT9_M01_PAGE_CONCORDANCE_20261019.md` |
| 6 | ICT 10-sinf (2021) | **257 sahifa bo‘limlar bo‘yicha inventarlandi; PDF 28–34 va 204 relevant sahifalar o‘qildi, 3 ta source-backed insert.** `docs/TASK244_ICT10_M01_PAGE_CONCORDANCE_20261019.md` |
| 7 | ICT 11-sinf (2021) | **340 PDF sahifa inventarlandi; PDF 11, 66–70, 296–305 bittalab qiyoslandi; 5 ta source-backed insert.** `docs/TASK244_ICT11_M01_PAGE_CONCORDANCE_20261019.md` |
| 8 | Cambridge+ 5-sinf | **M01 PDF 93–131 o‘qildi; 4 ta source insert.** `docs/TASK244_CAMBRIDGE5_M01_PAGE_CONCORDANCE_20261019.md` |
| 9 | Cambridge+ 6-sinf | NOT STARTED |
| 10 | Cambridge+ 7-sinf | NOT STARTED |
| 11 | Cambridge+ 8-sinf | NOT STARTED |
| 12 | Cambridge+ 9-sinf | NOT STARTED |
| 13 | Cambridge+ 10–11-sinf | NOT STARTED |

**Oraliq release-gates:** har kitobdagi barcha M01ga daxldor sahifalar, jadvallar/rasmlarni solishtirish; har bir addendum uchun hujjatlashtirilgan page trace; yakuniy CI typecheck/test/build; real mobil/desktop reader va autentifikatsiyalangan nazariya-test E2E; insonning alohida release roziligi.

**Hozirgi umumiy holat:** **7/13 darslik** (ICT5–11) M01ga taalluqli materiallari sahifalar bo‘yicha tekshirildi, **6/13 Cambridge+ darsliklari navbatda**. `src/data/topics/m01TextbookAudit.ts` jami **32 ta manbaga bog‘langan qo‘shimcha** (6+4+7+4+3+3+5) birlashtiradi. 11-sinf bo‘yicha reyestr: `docs/TASK244_ICT11_M01_PAGE_CONCORDANCE_20261019.md`. CI yakuniy commit hamda authenticated learner visual QA alohida release-gate. Keyingi darslik **Cambridge+ 5-sinf**.

**Oldingi M02/M03 nazariyalari hali ushbu yangi sahifama-sahifa usulda qayta tekshirilmagan.**
