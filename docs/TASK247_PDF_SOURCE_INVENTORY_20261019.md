# TASK-247 — pedagogika papkasi: 59 PDF va 5 DOCX dastlabki o‘qish reyestri

**Sana:** 2026-10-19. **Papka:** [pedagogika](https://drive.google.com/drive/folders/1XryoV_toq5QDVfLBxhKnsa-jwbcmk-KS) / [files](https://drive.google.com/drive/folders/1ERclL2nngkrPpSAtuHBBwemdw9zhFgw6). Ishchi branch, **main merge va deploy YO‘Q**.

## Joriy yuklash inventari
- `files` papkasi: **104 ta obyekt**, **59 ta PDF**, **5 ta DOCX**; qolganlari multimedia/thumbnail.
- **59/59 PDF uchun matnni ochish urinishi bajarildi; 55/59 da matn bor, 4/59 da oddiy connector matn qaytarmadi.** Bu **59/59 kitob betma-bet tekshirildi degani emas**. Matn OCR xatolariga ega bo‘lishi mumkin.
- **5/5 DOCX matni ochildi.** Ular ikkilamchi konspekt va nazariy savol-javoblar, rasmiy javob kalitining o‘rnini bosmaydi.
- **2 ta PDFda shaxsiy sinov natijalari** topildi: `pdf_6aa7467ea6c64_2026-09-14_00-57-34.pdf` va `pdf_69b393b18c2a9_2026-03-13_04-33-53.pdf`. Ularning ismlari, ballari va sanalari bu repoga, backendga va o‘quvchi ko‘radigan sahifalarga ko‘chirilmaydi.
- **1 ta reklama katalogi:** `Xodiyev Academy Turbo Marafon- 2026.pdf`. Uni pedagogika nazariyasining asosiy manbasi deb ishlatmang.
- O‘qilmagan PDFlar: `Attestatsiya-2026. Robiya Xatamova 1.pdf`; `Maktab pedagoglari - Kasb standarti (Oʻzbek tili).pdf`; `O._Tolipova_Pedagogik_texnologiyalar_va_pedagogik_mahorat.pdf`; `ВМ_322_24_06_2026_Олий_тоифалилар_магистратурага_қабули.pdf`. Ular fizik sahifa orqali qo‘shimcha tekshiruvda.
- **Dublikat manbalar:** `Pedagogik mahorat to'plam 2025 (5).pdf` va `(6).pdf` ning connector chiqarib bergan matni 88 088 belgidan iborat va **aynan bir xil**. Bitta manba sifatida deduplikatsiya qiling, binary hash hali tekshirilmagan. 2025 kuzgi nusxalari ham qisman ustma-ust tushadi; ular uchun savol-level fingerprint talab.

## PDFma-PDF boshlang‘ich natija (matn extract + sarlavha bo‘yicha toifa)

| № | Fayl | Manba toifasi | Matn statusi | Mavzuga moslik |
|---:|---|---|---|---|
| 1 | 03ff4260-7061-49e2-a5d4-9f6ee74eebe7.pdf | Kitob yoki katta uslubiy qo‘llanma (Tolipov–Ro‘ziyeva, Pedagogik texnologiyalar (2019)) | Matnni ochish tekshirildi | M15.02, M15.08 |
| 2 | 12 ta ibora.pdf | Mavzu yoki toifasi qayta ko‘riladi | Matnni ochish tekshirildi | Mapping ochiq |
| 3 | 1723545826.pdf | Kitob yoki katta uslubiy qo‘llanma (Jalilov, Baholash nazariyasi (2020)) | Matnni ochish tekshirildi | M14.03, M15.02, test QA |
| 4 | 3_М_Х_Тохтаходжаева_Педагогик_маҳорат_дарслик.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 5 | 4_А_Қ_Мунавваров_Педагогика_ўқув_қўлланма.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 6 | 4-Inklyuziv-talim-nazariya-va-metodika.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | M14.05, M15.08 |
| 7 | 5_У_И_Иноятов_ва_б_Педагогика_нопедагогик_ОТМ_учун_дарслик.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 8 | 6_Алиқулова_М_М_Инновацион_педагогика.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 9 | 7_Н_Муслимов_ва_б_Педагогик_компетентлик_ва_креативлик_асослари.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 10 | 8_Н_Махмудов,_Ўқитувчи_нутқ_маданияти_дарслик.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 11 | 9_Ф_О_Мирзаева_Педагогика_назарияси_ва_тарихи_дарслик.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 12 | Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 13 | Attestatsiya-2026. Robiya Xatamova 1.pdf | Tarixiy test/mashq | Matn olinmadi | Mapping ochiq |
| 14 | dars tahlili turlari.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | M15.04 |
| 15 | Dars turlari.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | M15.04 |
| 16 | diagnostika.pdf | Mavzu yoki toifasi qayta ko‘riladi | Matnni ochish tekshirildi | Mapping ochiq |
| 17 | kasb standarti (2).pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 18 | kasb standarti 1-soha o'quv jarayonini rejalashtirish.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 19 | Kasb standarti 2-soha.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 20 | Kasb standarti 3-soha.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 21 | Kasb-standarti.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | M14.01–07 |
| 22 | Kasbiy demo test.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 23 | Maktab pedagoglari - Kasb standarti (Oʻzbek tili).pdf | Mavzuli qo‘llanma | Matn olinmadi | Mapping ochiq |
| 24 | Methodological_manual_on_implemenation_of_teacher_standards_ўзб.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | M14.01–07 |
| 25 | Mirayeva test 1.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 26 | Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | M15.01–03 |
| 27 | O._Tolipova_Pedagogik_texnologiyalar_va_pedagogik_mahorat.pdf | Mavzu yoki toifasi qayta ko‘riladi | Matn olinmadi | Mapping ochiq |
| 28 | pdf_69b393b18c2a9_2026-03-13_04-33-53.pdf | Shaxsiy reyting/ball | SHAXSIY NATIJA — IMPORT YO‘Q | Mapping ochiq |
| 29 | pdf_6aa7467ea6c64_2026-09-14_00-57-34.pdf | Shaxsiy reyting/ball | SHAXSIY NATIJA — IMPORT YO‘Q | Mapping ochiq |
| 30 | Ped mahorat kasb standarti test 6.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 31 | Pedagogik kompetentlik test 1.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 32 | Pedagogik mahorat spetsifikatsiyasi-2025.pdf | 2025 spesifikatsiyasi — 2026 o‘rniga emas | Matnni ochish tekshirildi | Mapping ochiq |
| 33 | Pedagogik mahorat to'plam 2025 (1).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 34 | Pedagogik mahorat to'plam 2025 (2).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 35 | Pedagogik mahorat to'plam 2025 (3).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 36 | Pedagogik mahorat to'plam 2025 (4).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 37 | Pedagogik mahorat to'plam 2025 (5).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 38 | Pedagogik mahorat to'plam 2025 (6).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 39 | Pedagogik mahorat to'plam 2025.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 40 | Pedagogik qobilyatlar umumiy.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | M15.07 |
| 41 | Pedagogika testi 3.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 42 | pedagogika6.pdf | Mavzu yoki toifasi qayta ko‘riladi | Matnni ochish tekshirildi | Mapping ochiq |
| 43 | Pedagogning kasbiy standarti - qollanma.pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 44 | PedKasb tushgan testlar PedMahoratGuli (1) (1) (1).pdf | Mavzuli qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 45 | Pedmahorat 4.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 46 | PedMahorat demo.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 47 | Pedmahorat to'plam 2025 kuzgi (1).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 48 | Pedmahorat to'plam 2025 kuzgi (2).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 49 | Pedmahorat to'plam 2025 kuzgi (3).pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 50 | Pedmahorat to'plam 2025 kuzgi.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 51 | Repetitsion test 2025.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 52 | Test Mirzayeva 2.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 53 | Test Mirzayeva.pdf | Tarixiy test/mashq | Matnni ochish tekshirildi | Mapping ochiq |
| 54 | Xodiyev Academy Turbo Marafon- 2026.pdf | Reklama — darslik emas | Matnni ochish tekshirildi | Mapping ochiq |
| 55 | Xoliqov Pedagogik mahorat I bob.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | Mapping ochiq |
| 56 | Xoliqov Pedagogik mahorat.pdf | Kitob yoki katta uslubiy qo‘llanma | Matnni ochish tekshirildi | M15.01, .06–07 |
| 57 | xrpt_lirt9ie9nr6t8akemjblcs2z5vu2yvha5zt48z2lfv6dxghapjlt3chxz3.pdf | Kitob yoki katta uslubiy qo‘llanma (Madatov, Inklyuziv ta’lim (2024)) | Matnni ochish tekshirildi | Mapping ochiq |
| 58 | xrpt_uz6b84v91iitco6thk37r6vh4uya9xfskauh4fgtnocp69adi402yv9rfv.pdf | Kitob yoki katta uslubiy qo‘llanma (Jalilov, Baholash nazariyasi (qisqartirilgan nusxa)) | Matnni ochish tekshirildi | Mapping ochiq |
| 59 | ВМ_322_24_06_2026_Олий_тоифалилар_магистратурага_қабули.pdf | Mavzu yoki toifasi qayta ko‘riladi | Matn olinmadi | Mapping ochiq |

## 5 ta DOCX

| Fayl | Xulosa | Ishlatish sharti |
|---|---|---|
| `Inklyuziv_talim_va_korreksion_pedagogika_qollanma.docx` | Moslashtirish, inklyuziya va korreksion pedagogika | M15.08 — Qodirova/Pulatova darsligi bilan solishtirish |
| `Baholash_nazariyasi_1_betlik_yodlash_konspekti.docx` | Domen, konstrukt, diagnostika, ipsativ/norma/mezon | M14.03 — Jalilov (2020) bilan fakt tekshirish |
| `Baholash_nazariyasi_40_nazariy_savol_javob.docx` | 40 ta yodlash savoli | Faqat editorial candidate; to‘g‘ri kalitni avtomatik nashrga qo‘shmaslik |
| `Bugungi_mavzu_test_baholash_konspekt.docx` | Test tuzish bosqichlari va Bloom izohlari | M15.02/QA — original 1956 va 2001 Bloomni farqlash |
| `Pedmahoratguli_Bugungi_mavzu_konspekt.docx` | Validlik, validatsiya, parallel test formalar | Test QA — Jalilov dalillari bilan solishtirish |

## Aniqlangan nomi mavhum kitoblar

- `03ff4260-7061-49e2-a5d4-9f6ee74eebe7.pdf`: Tolipov O‘., Ro‘ziyeva D. **«Pedagogik texnologiyalar va pedagogik mahorat»**, 2019 — kitobning old sahifalari va boblari matnida ko‘rildi.
- `1723545826.pdf`: Komil Jalilov **«Baholash nazariyasi asoslari»**, 2020 — mundarija va validlik / ishonchlilik / distraktor tahlili.
- `xrpt_uz6b84v91iitco6thk37r6vh4uya9xfskauh4fgtnocp69adi402yv9rfv.pdf`: shu Jalilov kitobining qisqaroq matnli nusxasi; to‘liq dublikatligi tekshirilmagan.
- `xrpt_lirt9ie9nr6t8akemjblcs2z5vu2yvha5zt48z2lfv6dxghapjlt3chxz3.pdf`: Madatov I.Y. **«Inklyuziv ta’lim»**, 2024 (bosma darslik matni OCR sifati past).
- `Kasb-standarti.pdf`: «Umumiy o‘rta ta’lim maktabi o‘qituvchisining kasb standarti»; 7 mehnat yo‘nalishi. Keng qo‘llanma bilan alohida farq va yuridik kuch tekshiriladi.

## Hali bajarilmagan

1. 59 PDFning har birini **fizik bet/fakt/sahifa lokatori** bo‘yicha mazmuniy audit qilish.
2. 4 ta oddiy matn fetch ishlamagan PDFni raw/PDF ko‘rinishida alohida o‘qish.
3. 2025/2026 tarixiy testlarga dublikat va yagona correct key ekspertizasi, format Y1/Y2/Y3, origin/reference, 18 kanonik mavzu mapping.
4. 18/18 mavzuga har bir materialni solishtirib, 2026 rasmiy spetsifikatsiya va production DB lesson bilan tafovutlarini yopish.
5. Full CI, mobile E2E, owner signoff; hech qanday savol `published`ga avtomatik o‘tmaydi.

**Muhim provenance qoidasi:** matn mavjudligi ≠ manba sifatida tekshirilganlik; tarixiy PDF javobi ≠ rasmiy test kaliti; 2025 spetsifikatsiyasi ≠ 2026 spetsifikatsiyasi. Shaxsiy ma’lumotni import qilmaslik majburiy.
