# PedGuli — PDFda bosilgan raqam / import sloti muvofiqlashtirishi (2026-10-21)

## Qamrov va tamoyil

Manba: `Pedagogik mahorat to'plam 2025 (6).pdf`, **43 sahifa**, SHA-256 `324e1e1c0a837ff6e7b7c163fe7c5459f0ef7cdfdb47ea98b8236856316493a6`. Manba PDFning 2–9-sahifalari bevosita matn qatlamidan tekshirildi. PDFdagi **bosilgan raqam** `source_question_no` (import sloti) bilan bir xil bo‘lishi shart emas: ekstraksiya satrlari ayrim javob va navbatdagi savollarni birlashtirib yuborgan. Asl importning `raw_question_private`/`raw_answer_private` qiymatlarini almashtirmaslik, mavjud foydalanuvchi natijalariga tegmaslik talab qilinadi.

**Bajarilgan baza o‘zgarishi:** nashrdagi `authored:pedagogy-pdf-corpus:2025-spring-pNN` savollarining **14 tasi** asl PDFning savol `NN` va mos kandidat qatoriga ulangani tekshirildi (`public.pedagogy_pdf_source_candidates.linked_question_id`). Har birida `review_notes` va `verification_basis`ga asl *bosma raqam* va PDF beti qayd etildi. **Savol, variant, answer key, exam snapshot yoki statusga teginilmadi.** Yangi test nashr qilinmadi.

## Mustaqil o‘qilgan va bog‘langan yozuvlar

| PDFda bosilgan savol | Bazadagi eski import sloti | PDF beti | Nashrdagi manba ID oxiri |
|---:|---:|---:|---|
| 5 | 6 | 2 | `spring-p5` |
| 9 | 9 | 3 | `spring-p9` |
| 10 | 10 | 3 | `spring-p10` |
| 12 | 12 | 4 | `spring-p12` |
| 18 | 18 | 4 | `spring-p18` |
| 22 | 20 | 5 | `spring-p22` |
| 25 | 23 | 6 | `spring-p25` |
| 28 | 26 | 6 | `spring-p28` |
| 29 | 27 | 7 | `spring-p29` |
| 31 | 29 | 7 | `spring-p31` |
| 35 | 33 | 8 | `spring-p35` |
| 36 | 34 | 8 | `spring-p36` |
| 42 | 40 | 9 | `spring-p42` |
| 43 | 41 | 9 | `spring-p43` |

**Muhim:** `spring-p22`ga mos kandidat `raw_answer_private` matni keyingi kandidatga ham davom etadi; auditda asl manbaning 5-beti tekshirildi. `editorial_status=needs_review` va texnik parse bayroqlari atay saqlandi. Bitta testga manba qo‘shilgani `raw_*` ajratilishi to‘g‘ri yoki barcha mazmuniy ekspertizalar yopilganini bildirmaydi.

## Maxsus ehtiyot talab qiladigan joylar

- **PDF №7:** baholash turlarini 1-b, 2-a, 3-c tarzida moslaydi. Importning ichki **slot №8** savol №7ni olgan, ammo javob maydonida keyingi **№8 pedagogik texnologiya darajalari** uchun `1,3,2` ketma-ketligi turibdi. Shunchaki `linked_question_id` yoki `answer_key_status` bilan xatoni yashirish mumkin emas. Matn, variant va javobni kanonik ravishda ajratish kerak.
- **PDF №8:** pedagogik texnologiya darajalari ketma-ketligi `1,3,2`. Alohida, sof `source_question_no=8` import qatori mavjud emas. Uni PDF №7 nomzodiga ikkinchi savol deb bog‘lash noto‘g‘ri.
- **PDF №23:** bosma savolning boshlanishi importdagi avvalgi kandidat oxiriga qo‘shilgan. Sof raqamli manba qatori mavjud emas.
- **PDF №10 va №42:** manbada ota-onalar majlisidagi o‘xshash nizo vaziyati bor, biroq №10 uchun «xatti-harakat noto‘g‘riligini tushuntirish», №42 uchun «talab» deb alohida javob berilgan. Nashrdagi matnlar bu farqni **muloyim tushuntirish / qat’iy talab** bilan ajratadi. Bularni avtomatik deduplikatsiya qilish manba mazmunini buzadi.
- **PDF №17 va №32:** asl matnda tekshirish savollari Bloomning «Qo‘llash» darajasiga bog‘langan. Qisqa savol/yozma tekshirishning o‘zi avtomatik «Qo‘llash» bo‘lmaydi; alohida konseptual ekspertiza zarur.
- `Pedagogik mahorat to'plam 2025.pdf` (**9 sahifa**) va `(6).pdf` (**43 sahifa**) bir fayl emas. Ularga tegishli identifikatsiya muammolari `docs/PEDGULI_PDF_SOURCE_INTEGRITY_20261020.md`da ko‘rsatilgan.

## Keyingi yopilishi shart bo‘lgan ishlar

1. `needs_review` ichidagi har bir kandidatni bosma savol raqami / javobning asl betdagi joyi / mazmun / mavjud nashr bilan solishtirish. `source_marker_unverified`ga faqat yozilgan «Javob» satri borligi bilan emas, shu savolga tegishliligi bilan yondashish.
2. №7/8 va №23 singari yutilib ketgan savollarni alohida manba segmenti bilan tiklash, boshqa slotlardagi tarixni o‘zgartirmaslik.
3. Telegram `poll_unkeyed` savollari oldingi xabar bilan bog‘langan bo‘lsa ham, `answer_key_status=missing` saqlash — poll ovozlari to‘g‘ri javob manbasi emas.
4. Fotolarni asl Drive ID bilan, ovozlarni haqiqiy transkript bilan tekshirmasdan `published`ga chiqarish mumkin emas.
5. Merge — **faqat audit hujjati/kod**, production deploy **bajarilmaydi**. Supabase’dagi metadata o‘zgarishlari main branchga merge qilish o‘rnini bosmaydi.

### Baza kontrol so‘rovlari (2026-10-21 tekshiruvidan)

`linked_question_id IS NOT NULL` bo‘lgan umumiy PDF kandidatlari: **235**; shulardan `(6).pdf`: **50**. `(6).pdf`ning linklanmagan `needs_review`lari **146**, umumiy PDF `needs_review`: **298**. Pedagogika guruhlaridagi jami published: **824**. Bu ma’lumotlar vaqtga bog‘liq snapshot, dinamik standart emas.

***Tarixiy test javoblari saqlandi. PDF bo‘yicha ayrim oldindan nashr qilingan savollarga endi asl manba izini kuzatish mumkin.***
