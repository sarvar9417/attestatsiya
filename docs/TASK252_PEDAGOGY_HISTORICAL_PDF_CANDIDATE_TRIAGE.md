# TASK-252 — Pedagogika tarixiy PDF savollarini tahrirga qabul qilish

2026-10-19. Holat: READ-ONLY TRIAGE. Production savollar bankiga 0 ta yangi savol kiritilgan.

## Bevosita o'qilgan fayllar

| PDF | Matn belgisi | Javob markerlari | So'roq | A)-D) markerlari | Status |
|---|---:|---:|---:|---:|---|
| PedKasb tushgan testlar PedMahoratGuli (1) (1) (1).pdf, 2026 bahor | 83079 | 192 | 147 | 0 | SOURCE_UNVERIFIED; variantlar to'liq emas |
| Pedagogik mahorat to'plam 2025 (5).pdf | 88088 | 196 | 161 | 27 | DUPLICATE CHECK |
| Pedagogik mahorat to'plam 2025 (6).pdf | 88088 | 196 | 161 | 27 | (5) matniga aynan teng, karantin |
| Pedmahorat to'plam 2025 kuzgi (1).pdf | 36937 | 68 | 28 | 26 | Dastlabki nazorat |

Bu sonlar Google Drive text-extract chiqishidagi belgilar va leksik markerlardir. Savollar sonini ham, yagona to'g'ri javoblar sonini ham isbotlamaydi. 2025 (5)/(6) fayllari aynan matni bo'yicha teng; baytlar SHA-256 alohida o'rganiladi.

## Tahrir bosqichlari

1. Source: original fayl, sahifa, original raqam va provenance yoziladi; Telegramdagi Javob belgisi rasmiy javob kaliti emas.
2. Mapping: 18 kanonik M14 (7), M15 (8), M16 (3) mavzusi; imtihon savol kvotasi KS 5 / PM.GEN 7 / PM.MET 3 ekanligini ajratish.
3. Mustaqil semantik tekshiruv: kasb standarti, umumiy pedagogika darsligi yoki Mamarajabov 2023 asl PDF sahifasi bilan moslash.
4. Y1: savol, 4 mantiqan teng variant, yagona kalit, 3 distractor, tushunarli asos. Variantlari bo'lmagan PDF qatordan tayyor MCQ yasalgani deb da'vo qilinmasin.
5. Y2/Y3: matching/ordering native va server-scored, kalit clientga chiqmaydi.
6. Dedupe: normalized item+options signature va semantic review; 2025 (5)/(6)ni ikki marta import qilmaslik.
7. Expert review va immutability: source+page+review status, keylashdan oldin ikki mustaqil tekshiruv; test 15/50, preflight va UX acceptance.
8. Shaxsiy ma'lumot: pdf_6aa... va pdf_69b... fayllarida o'quvchi ismlari/ballari bor, shu sabab ular bankka import qilinmaydi.

2026 'tushgan' yorlig'i rasmiy attestatsiya kelib chiqishini isbotlamaydi. To'liq PDFlar, ismlar va tarixiy answer keylar public repoga ko'chirilmaydi.

## Qolgan ish

4 ta ilgari avtomatik matnsiz PDF **asl raw fayl orqali dastlabki vizual ko‘rikdan o‘tdi** (M14 asl standart, 2026 Robiya diagnostika, 13 sahifalik Tolipov/Ro‘ziyeva parcha va 322-sonli qaror). Har bir individual savol uchun fizik sahifa, mualliflik, stem/options va expert key **yakuniy semantik auditi** hali ochiq. Hech bir javob reviewdan nashrga o'tkazilmadi. Bu hujjat aynan to'rtta nomlangan PDFning dastlabki statistik introspeksiyasidir.

## 2026 Robiya diagnostikasi — visual source QA, 15 ta maxsus savol

**Manba:** Attestatsiya-2026. Robiya Xatamova 1.pdf, 24 sahifali tasviriy PDF (https://drive.google.com/file/d/1QWnn28ZveZ2msjbNpqYbT0k3rRvC0Fgf/view). Bu mutaxassisligi **o‘zbek tili/adabiyoti** bo‘lgan mustaqil diagnostik to‘plam; Q1–Q35 aynan o‘sha fandan va informatika bankiga o‘tmasligi kerak. Faqat **Q36–Q50** M14/M15 pedagogika/testologiya mazmunli tahririy nomzod sifatida ko‘rilishi mumkin. Savollarni public repoga qayta yozmadik.

| Q raqam | PDF sahifasi (viewer) | Taxminiy kanonik bo‘lim | Muammo va status |
|---:|---:|---|---|
| Q36–37 | 18–19 | M14.03 (testologiya, domen/konstrukt) | Review only; original key mustaqil tekshirilmagan |
| Q38–39 | 19–20 | M15.01 (tadqiqot, rivojlantirish) | Review only; mustaqil darslik tekshiruvi kerak |
| Q40 | 20 | M14.03 (formativ baholash) | Review only |
| Q41 | 20 | M15.06 (ovoz va texnika) | Review only |
| Q42–43 | 20–21 | M15.06 (sinf muloqoti/refleksiya) | **REVIEW_REQUIRED:** vaziyatdagi harakatlar bilan 'refleksiya turlari' atamasini yaqqol moslikka ekspert tasdiqlashi kerak |
| Q44 | 21 | M15.06 (pedagogik odob) | **P0_QUARANTINE_CANDIDATE:** ijobiy bandlar kombinatsiyasi 1,3,4 bo‘lib ko‘rinsa-da, taklif etilgan variantlarda aynan u kombinatsiya yo‘q; 2-bandda qo‘pol harakatni 'qilish' deb yozilgan |
| Q45 | 21–22 | M15.06 (muloqot va odob) | **REVIEW_REQUIRED:** 1–4 bandlar me’yoriy qanchalik umumiy ekani va taklif etilgan qisman kombinatsiyalar mustaqil tekshiriladi |
| Q46–48 | 22–23 | M15.05–06 (nutq mantiqi, jamoaviy muammo, pedagogik namuna) | Review only |
| Q49–50 | 23–24 | M15.08 / M15.02 (loyihalash va metod/vazifa matching) | Review only; Q50 jadval/variant bir necha sahifaga bo‘lingan |

**Q44 dalil chegarasi:** Bu darslikdagi matnli fakt yoki rasmiy kalit tasdiqlanmasdan turib asossiz 'C' yoki 'D' belgilash mumkin emas. Mazmuniy to‘liq to‘g‘ri kombinatsiya variant sifatida ko‘rsatilmagan ko‘rinadi; pedagogika metodisti **aynan Q44 sahifa 21** ni tekshirib, qayta yozish yoki rad etish qarorini bersin. Boshqa savollar uchun 'quarantine' maqomi faqat editorial risk belgisi, prod published DBda o‘zgartirish emas.

Bu risk tekshiruvi [to‘rtta textless PDF bo‘yicha vizual reyestr](TASK252_FOUR_SCANNED_PDFS_VISUAL_SOURCE_REVIEW_20261019.md) bilan bog‘liq; hech bir historical item key nashr qilinmadi.
