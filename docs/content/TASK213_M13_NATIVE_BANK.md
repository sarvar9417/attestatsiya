# TASK-213 — M13 native Y2/Y3 expansion (2026)

**Maqsad:** Spetsifikatsiyaning M13 axborot xavfsizligi va raqamli platformalar bloki uchun yangi **70 Y2 + 70 Y3** interaktiv savol banki (7 bob × har formatga 10 savol).

- **Y2:** 4×4 juftlashtirish; yonma-yon ikki ustun, `question_options.side` = a/b; `question_keys.payload.pairs` xaritasi shaxsiy server jadvalida.
- **Y3:** 4 bosqichni tartiblash; variantlar aralash; `question_keys.payload.order` serverdagi element UUID ketma-ketligi.
- **Mavjud 210 Y1 savol va uchta eski Y2/Y3** saqlanadi, ularning matni va natijasi o‘zgartirilmaydi.
- **Savol manbalari:** Milliy 11-sinf informatika 2021, milliy 8-sinf informatika 2020 va 2026-yil attestatsiya spetsifikatsiyasi. Savollar original didaktik ishlanmalar; rasmiy testlarning nusxasi emas.
- **Taqsimot:** M13.01–07 har bobida 10 Y2 va 10 Y3. Test banki uchun Y2/Y3 rasmiy interaktiv formatdagi dastlabki mustaqil to‘plam.
- **Eslatma:** Loyiha egasi oldingi suhbatda mustaqil ekspert tasdig‘isiz nashr qilishni ochiq so‘ragan; ushbu bankning faqat sxema va avtomatik hisob-kitob yaxlitligi tekshirilgan, savollarning pedagogik haqiqatini inson mustaqil tekshirmagan. Bu manbadagi Y2/Y3 kombinatsiyali Y1lardan boshqa, yangidan yozilgan 140 savoldir.
- **Publication:** TASK-213 migration applies only after M13 seven published lessons exist. Idempotent deterministic IDs, no mutation to any previous published row. Commit + CI + production activation must be reported separately.