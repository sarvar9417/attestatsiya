# TASK-369 — Savol izohlaridan manba va ichki kandidat belgilarini ajratish

## Buyruq va qat’iy release cheklovi

Foydalanuvchining ko‘rsatmasi: **productionga deploy qilinmasin, production Supabase o‘zgartirilmasin; faqat GitHub `main`ga merge**. Vercel `vercel.json`dagi `git.deploymentEnabled: false` tekshirildi. Qo‘lda Vercel publish yoki Supabase migratsiya yuritish taqiqlangan.

## Read-only ishlab chiqish auditi

- Supabase savollar jami: **8 363**, nashrdagilar: **5 415** (2026-10-21 paytdagi surat).
- **18 ta published** pedagogik savolda `baza kandidati`, `PDF muallif kaliti saqlandi`, `Manba javobi shu` yoki shunga yaqin bevosita tahririy yozuv bor. Misol: `authored:pedagogy-pdf-corpus:2025-spring6-n66`.
- **972 ta published** izohda ikkita bo‘sh qator ajratilgan `Manba:` / `Asl manba:` bilan boshlanuvchi paragraf bor. Ularning mavjudligi o‘z-o‘zidan javob noto‘g‘riligini anglatmaydi; fanlar kesimida manbalar turlicha.
- Source-identifikator, PDF sahifa, original raqam, kandidat mapping, Telegram ✅/✔ tasdiq belgisi — audit ma’lumoti; foydalanuvchiga izoh bo‘lib ko‘rinmasligi kerak.
- Savolning didaktik sababini tushuntiruvchi asosiy matn, mantiqiy asoslash, matematik formula va foydali misol saqlanishi shart.

## Koddagi aniq tuzatishlar

- `src/features/exam/learnerExplanation.ts`: izohga faqat uni server qaytargandan keyin ishlov beruvchi umumiy taqdimot qatlami.
- Tugallangan individual test tahlili `ExamReviewList`; server baholagandan keyingi izoh `ExamRunner`; guruhli mock natijasi `GroupMockPage`; mavzu mashq javobi `lessonContentGateway` hamda `TopicView` bir xil filtrdan foydalanadi.
- Metama’lumot paragrafini izohdan ajratadi; «Manba javobi shu», «PDF muallif kaliti», shablon moslikni ko‘rsatuvchi kalit-yozuvlarni yashiradi.
- Manbaga qarab javobni frontendda hisoblamaydi; **18 savolning kaliti, stem/options yoki UUID → javob xaritasi browser bundle’ga kiritilmadi**.
- Manba-only tushuntirishdan didaktik izoh to‘qilmaydi: aniqlik bilan editorial pending xabari ko‘rsatiladi.

## 18 ta savolning yaxshilangan alohida izohi

`supabase/maintenance/task369_pdf_explanations_review_ONLY_NO_PRODUCTION.sql` 18 ta savolga **alohida, savol mohiyatini izohlaydigan** tushuntirish tayyorlaydi. Bu **faqat qo‘lda ko‘riladigan, ROLLBACK bilan tugaydigan loyiha skripti**: avtomatik Supabase migratsiyasi EMAS, productionda bajarilmadi, 18 savolning published keys/status/tarixiga tegilmaydi. Kelgusida egasi alohida ruxsat bersa, original saqlangan holda immutable REVIEW vorislari bosqichli tarzda tayyorlanishi mumkin. Ekspert QA va publikatsiya alohida jarayon.

## Regressiya

- `learnerExplanation.test.ts`: PDF/kandidat/Telegram manba, Markdown manba, kod/math, source-only, idempotentlik, bo‘sh izoh va no-key-leak.
- `ExamReviewList.test.tsx`: tugallangan sinov izohida didaktik matn saqlanadi, PDF kandidat yorliqlari yashiriladi.
- `supabase/maintenance/task369_explanation_audit_READONLY.sql` qayta tekshiruv so‘rovi.
- O‘quvchi haqiqiy javobni server-authoritative scoring tugagandan keyingina ko‘radi.

## Halol scope

18 savol uchun sifatli didaktik izohlar ishlab chiqildi, ammo foydalanayotgan production DBga qo‘llash **foydalanuvchining release taqiqi sabab amalga oshirilmagan**. Mavjud 5 415 published savolning har biri alohida ilmiy ekspert tomonidan tasdiqlandi, degan da’vo yo‘q.
