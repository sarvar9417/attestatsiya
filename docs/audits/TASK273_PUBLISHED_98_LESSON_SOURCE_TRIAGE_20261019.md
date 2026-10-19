# TASK-273 — Published theory database: 98-lesson read-only inventory (2026-10-19)

**Haqiqiy ishlab turgan loyiha:** Supabase `attestatsiya100%`, id `plyqezulrfowyblsfpzy`. **Faqat SELECT:** ma’lumotlar bazasiga yozilmadi, content revision/answer key/attempt o‘zgarmadi. Ushbu hisobot bo‘yicha production release mumkin emas.

## Faktlar

- Published `public.lessons`: **98 ta** yozuv, **12 ta bo‘sh body_mdx**, **35 ta 2000 belgidan kam** matnli dars va **8 ta chuqurlashtirilgan nazariya bo‘limiga ajratilgan** dars.
- `M01`dagi bo‘sh DB yozuvlari **kitobda bo‘sh nazariya degani emas**: frontendning alohida `src/data/topics/m01.ts` source kitobi mavjud. Render qayerdan o‘qishini mavzuma-mavzu tekshirish zarur.
- Qisqa matn **sifat xatosiga avtomatik teng emas**; uzun matn ham **darslikka moslikni isbotlamaydi**.
- `M15`da serverda 8 ta 4844–7721 belgili published dars mavjud, ammo learner kodi asosiy kitobda qisqa `staticContent`ni ushlab qoladi; chuqurlashtirilgan material ajratilgan. TASK-273 asosiy kitobga static source konspektlarini qo‘shmoqda; remote manbani 1:1 audit qilish navbatda.
- Manba so‘zi mavjudligi (`mentions_source`) real PDF nomi va sahifa raqamini tekshirish emas.
- `M08` published darslari 977–1183 belgi: Python/JavaScript mavzularidagi misol va mashqlarni asosiy darslik bilan majburiy solishtirish ustuvor.

| Module | Order | Slug | DB body chars | “Manba” mentioned | QA triage |
|---|---:|---|---:|---|---|
| M01 | 1 | m01-01 | 0 | no | EMPTY |
| M01 | 2 | m01-02 | 0 | no | EMPTY |
| M01 | 3 | m01-03 | 0 | no | EMPTY |
| M01 | 4 | m01-04 | 0 | no | EMPTY |
| M01 | 5 | m01-05 | 0 | no | EMPTY |
| M01 | 6 | m01-06 | 0 | no | EMPTY |
| M01 | 7 | m01-07 | 0 | no | EMPTY |
| M01 | 8 | m01-08 | 0 | no | EMPTY |
| M01 | 9 | m01-09 | 0 | no | EMPTY |
| M01 | 10 | m01-10 | 0 | no | EMPTY |
| M01 | 11 | m01-11 | 0 | no | EMPTY |
| M01 | 12 | m01-12 | 0 | no | EMPTY |
| M01 | 20 | axborot-uzatish-tezligi | 1731 | yes | SHORT_REVIEW |
| M02 | 1 | kompyuter-qurilmalari-va-vazifalari | 4668 | yes | UNVERIFIED |
| M02 | 2 | operatsion-tizimlar-va-imkoniyatlari | 3265 | yes | UNVERIFIED |
| M02 | 3 | fayl-papka-va-fayl-tizimi | 5255 | yes | UNVERIFIED |
| M02 | 4 | tizimli-amaliy-va-xizmat-dasturlari | 3371 | yes | UNVERIFIED |
| M03 | 1 | word-hujjat-formatlash-va-tuzilma | 1464 | yes | SHORT_REVIEW |
| M03 | 2 | excel-formulalar-va-funksiyalar | 1454 | yes | SHORT_REVIEW |
| M03 | 3 | excel-filtr-saralash-diagramma | 1407 | yes | SHORT_REVIEW |
| M03 | 4 | powerpoint-taqdimot-animatsiya-otish | 1346 | yes | SHORT_REVIEW |
| M04 | 1 | mantiqiy-mulohazalar | 7200 | yes | UNVERIFIED |
| M04 | 2 | mantiqiy-amallar | 14024 | yes | UNVERIFIED |
| M04 | 3 | m04-rostlik-jadvallari-2026 | 6713 | yes | UNVERIFIED |
| M04 | 4 | rostlik-jadvali-va-mantiqiy-sxema | 13423 | yes | UNVERIFIED |
| M04 | 5 | mantiqiy-xulosa-va-masala | 9393 | yes | UNVERIFIED |
| M04 | 6 | m04-model-va-modellar-2026 | 10736 | yes | UNVERIFIED |
| M05 | 1 | sanoq-sistemalari-asoslari | 7254 | yes | UNVERIFIED |
| M05 | 2 | sanoq-sistemalari-otkazish | 5542 | no | UNVERIFIED |
| M05 | 3 | sanoq-sistemalari-arifmetika | 11504 | yes | UNVERIFIED |
| M06 | 1 | algoritm-va-turlari | 1430 | yes | SHORT_REVIEW |
| M06 | 2 | blok-sxema-va-psevdokod | 1332 | yes | SHORT_REVIEW |
| M06 | 3 | masala-algoritmini-tuzish | 1325 | yes | SHORT_REVIEW |
| M06 | 4 | algoritm-tahlili-va-maqbullik | 1458 | yes | SHORT_REVIEW |
| M07 | 1 | scratch-ozgaruvchi-va-koordinata | 5798 | yes | UNVERIFIED |
| M07 | 2 | scratch-ozgaruvchilar-v2 | 4695 | yes | UNVERIFIED |
| M07 | 3 | scratch-bloklar-bilan-algoritm | 6025 | yes | UNVERIFIED |
| M07 | 4 | scratch-shart-va-takrorlash | 6368 | yes | UNVERIFIED |
| M07 | 5 | scratch-pen-shakllar | 6323 | yes | UNVERIFIED |
| M07 | 6 | logo-toshbaqa-grafika | 9973 | yes | UNVERIFIED |
| M07 | 7 | scratch-v3-klonlash | 1507 | yes | SHORT_REVIEW |
| M07 | 8 | scratch-v3-grafik-muharrir | 1349 | yes | SHORT_REVIEW |
| M07 | 9 | scratch-v3-sensorlar-sikllar | 1296 | yes | SHORT_REVIEW |
| M07 | 10 | scratch-v3-royxat-myblocks | 1286 | yes | SHORT_REVIEW |
| M07 | 11 | scratch-v3-pen-geometriya | 1089 | yes | SHORT_REVIEW |
| M07 | 12 | scratch-v3-logo-geometriya | 1310 | yes | SHORT_REVIEW |
| M08 | 1 | python-sintaksis-asoslari | 1140 | yes | SHORT_REVIEW |
| M08 | 2 | python-ozgaruvchi-shart-sikl | 977 | yes | SHORT_REVIEW |
| M08 | 3 | python-funksiya-va-massiv | 1108 | yes | SHORT_REVIEW |
| M08 | 4 | javascript-sintaksis-asoslari | 1117 | yes | SHORT_REVIEW |
| M08 | 5 | javascript-shart-sikl-funksiya-massiv | 1183 | yes | SHORT_REVIEW |
| M09 | 1 | malumotlar-bazasi-va-mbbt-asoslari | 1300 | yes | SHORT_REVIEW |
| M09 | 2 | access-jadval-va-malumot-kiritish | 1215 | yes | SHORT_REVIEW |
| M09 | 3 | kalitlar-va-jadvallarni-boglash | 1300 | yes | SHORT_REVIEW |
| M09 | 4 | sorovlar-yaratish | 1227 | yes | SHORT_REVIEW |
| M09 | 5 | murakkab-sorovlar-va-natijani-tahlil-qilish | 1211 | yes | SHORT_REVIEW |
| M10 | 1 | kompyuter-grafikasi-turlari | 1385 | yes | SHORT_REVIEW |
| M10 | 2 | rastr-vektor-amallari | 1411 | yes | SHORT_REVIEW |
| M10 | 3 | paint-va-photoshop-asoslari | 2610 | yes | UNVERIFIED |
| M11 | 1 | html-matn-rasm-royxat | 2257 | yes | UNVERIFIED |
| M11 | 2 | html-jadval-va-forma | 2512 | yes | UNVERIFIED |
| M11 | 3 | css-stillarini-qollash | 2464 | yes | UNVERIFIED |
| M12 | 1 | tarmoqlar-va-qurilmalar | 1363 | yes | SHORT_REVIEW |
| M12 | 2 | arxitektura-va-topologiyalar | 1238 | yes | SHORT_REVIEW |
| M12 | 3 | ip-manzil-va-tarmoq-maskasi | 2384 | yes | UNVERIFIED |
| M12 | 4 | internetdan-xavfsiz-va-maqsadli-foydalanish | 1275 | yes | SHORT_REVIEW |
| M12 | 5 | brauzer-qidiruv-dns | 1325 | yes | SHORT_REVIEW |
| M13 | 1 | xavfsizlik-tahdidlari-va-himoya | 1197 | yes | SHORT_REVIEW |
| M13 | 2 | zararli-dastur-va-phishing | 2509 | yes | UNVERIFIED |
| M13 | 3 | antivirus-va-himoya-vositalari | 1141 | yes | SHORT_REVIEW |
| M13 | 4 | elektron-hukumat-va-elektron-imzo | 1196 | yes | SHORT_REVIEW |
| M13 | 5 | smm-cms-lms-mooc | 1222 | yes | SHORT_REVIEW |
| M13 | 6 | web-freelance-asoslari | 2593 | yes | UNVERIFIED |
| M13 | 61 | m13-axr-01 | 5509 | yes | UNVERIFIED |
| M13 | 62 | m13-axr-02 | 5449 | yes | UNVERIFIED |
| M13 | 63 | m13-axr-03 | 4848 | yes | UNVERIFIED |
| M13 | 64 | m13-axr-04 | 4767 | yes | UNVERIFIED |
| M13 | 65 | m13-axr-05 | 5509 | yes | UNVERIFIED |
| M13 | 66 | m13-axr-06 | 4699 | yes | UNVERIFIED |
| M13 | 67 | m13-axr-07 | 5741 | yes | UNVERIFIED |
| M14 | 1 | oquv-jarayonini-rejalashtirish | 3150 | yes | UNVERIFIED |
| M14 | 2 | talim-samaradorligini-taminlash | 3112 | yes | UNVERIFIED |
| M14 | 3 | ozlashtirishni-baholash-va-qayta-aloqa | 2786 | yes | UNVERIFIED |
| M14 | 4 | tarbiyaviy-faoliyatni-tashkil-etish | 2841 | yes | UNVERIFIED |
| M14 | 5 | xavfsiz-rivojlantiruvchi-talim-muhiti | 4078 | yes | UNVERIFIED |
| M14 | 6 | oz-ozini-rivojlantirish-va-kasbiy-osish | 2317 | yes | UNVERIFIED |
| M14 | 7 | hamkasblar-va-ota-onalar-bilan-hamkorlik | 2250 | yes | UNVERIFIED |
| M15 | 1 | pedagogika-didaktika-tarbiya-va-yosh-psixologiyasi | 7721 | yes | SPLIT_CORE_SUPPLEMENT |
| M15 | 2 | pedagogikaning-asosiy-tamoyillari | 5204 | yes | SPLIT_CORE_SUPPLEMENT |
| M15 | 3 | tarbiya-va-uning-turlari | 5334 | yes | SPLIT_CORE_SUPPLEMENT |
| M15 | 4 | dars-turlari-rejalashtirish-va-sinfni-boshqarish | 4844 | yes | SPLIT_CORE_SUPPLEMENT |
| M15 | 5 | sinf-rahbari-hujjatlar-jamoa-va-ota-ona | 4893 | yes | SPLIT_CORE_SUPPLEMENT |
| M15 | 6 | pedagogik-etika-nutq-texnika-va-takt | 5355 | yes | SPLIT_CORE_SUPPLEMENT |
| M15 | 7 | pedagogik-qobiliyat-va-uning-turlari | 6847 | yes | SPLIT_CORE_SUPPLEMENT |
| M15 | 8 | talim-texnologiyalari-va-vaziyatga-mos-tanlov | 7653 | yes | SPLIT_CORE_SUPPLEMENT |
| M16 | 1 | informatika-oqitish-yondashuvlari-va-metodikasi | 2698 | yes | UNVERIFIED |
| M16 | 2 | oqitish-usullari-va-metodlarini-farqlash | 4596 | yes | UNVERIFIED |
| M16 | 3 | talimiy-vaziyat-va-pedagogik-qarorni-baholash | 3226 | yes | UNVERIFIED |

## Triage qoidasi

**EMPTY:** dasturga maxsus static source bo‘lmasa dars bo‘sh ko‘rinishi mumkin. **SHORT_REVIEW:** 2000 belgidan kam, ayniqsa kod/formula/jadval mavzulariga mavzuiy review shart. **SPLIT_CORE_SUPPLEMENT:** manbali qo‘shimcha asosiy readerdan tashqarida qolishi mumkin. **UNVERIFIED:** raqamli statistikada avtomatik gap isboti yo‘q — birma-bir original darslikni tekshirish zarur.

**Hech bir qator `verified` emas.** Tanlangan 2026-10-19 snapshot brauzerda real matn ko‘rinishi, PDF sahifa raqami, rasmlar, animatsiyalar yoki foydalanuvchi sahifalarining bugungi deployini tasdiqlamaydi.

Keyingi mustaqil QA: har bir dars uchun canonical learner view, required topic constructs, paper PDF page/printed page, citation, evidence + reviewer, test alignment, accessibility, responsive proof va stable fallbacks.
