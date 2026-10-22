# TASK-547 — Pedagogika nazariyasida manba-audit matnlarini dars bayonidan ajratish

**Sana:** 2026-10-22. **Holat:** GitHub PR/CI nazorati; Supabase production yozuvlari o‘zgartirilmagan, Vercel deploy qilinmagan.

## Foydalanuvchi ko‘rsatgan nuqson
M14.01 — «O‘quv jarayonini rejalashtirish» darsida PDF nomi, original sahifa, SHA-256, ekspertning o‘zi uchun tekshiruv ma’lumoti, «Kuzgi 2025» hamda «Pedmahorat|Guli manbasining 14-betida...» kabi yozuvlar bevosita nazariya tarkibiga kirib qolgan. Bunday ichki audit matni ta’lim maqsadini tushuntirmaydi.

2026-10-22 production read-only kuzatuv: `public.lessons` 249 qator; keng qidiruv naqshida 62 dars, SHA-256 belgisi 7 dars. Bu 62 darsning barchasi xato degani emas; bibliografiya va didaktik tushuntirish alohida baholanadi.

## Sabab va yechim
Kanonik `body_mdx` immutable bo‘lishi kerak. M14–M16 darslari uchun `TopicView`da `completeLessonReader`dan keyin `presentPedagogyTheory` projeksiyasi ishlaydi:
- `Asl manba:`, `Manba izi:`, manba xeshlari va `Qo‘shimcha tekshiruv:` kabi **audit-only** bloklar o‘quvchiga ko‘rsatilmaydi, lekin DB va original mualliflik kontentda saqlanadi;
- Telegram/PDF/to‘plam sarlavhalari tushunarli pedagogik bo‘lim nomlariga moslanadi;
- bir nechta aniq matn, jumladan kuzgi diagnostika, o‘zlashtirishni baholash, nizolar, pedagogik ijod, kasbiy standart normasi va darsga tayyorgarlik bosqichlari, manba ma’muriy yozuvisiz tushuntiriladi;
- A/01.6–B/02.6 kodlar, ta’riflar, amaliy ketma-ketlik, jadvallar, muhim cheklovlar, test savollari va kalitlar saqlanadi;
- boshqa modullar, backend, published revisionlar va Supabase migratsiyalari ushbu task doirasida o‘zgarmaydi.

## Muhim cheklov
O‘quvchi ekranida bibliografik `source` bloklar ko‘rinmaydi. Rasmiy manbalar tekshiruvi uchun kerakli original satrlar `body_mdx`da qoladi; vazifani bajarishda qo‘llanilgan umumiy manba identifikatorlari va auditorlik dalillari yo‘qotilmadi. Ushbu o‘zgartirish dars matnidagi barcha ilmiy xatolar ekspert tekshiruvidan o‘tdi degani emas.

## QA
`src/tests/task547PedagogyTheoryCopy.test.ts` nazorat qiladi: o‘quvchi nusxasi, PDF/SHA-256 izini chiqarib tashlash, didaktik mazmun va A/01.6 kodi, jadval ustuni, kodni buzmaslik, bibliografik bo‘limdan keyingi mavzuni saqlash, idempotentlik va metadata-only input. Eski `task350PedagogyLessonCleanup.test.ts` va `professionalLessonTheory.test.ts` regressiya sifatida saqlanadi.

**Sinov buyrug‘i:** `npm test -- src/tests/task547PedagogyTheoryCopy.test.ts src/tests/task350PedagogyLessonCleanup.test.ts src/tests/professionalLessonTheory.test.ts`; `npm run typecheck`; `npm run lint`.

**Qaytarish:** mazkur PRni revert qilish — immutable Supabase bayoniga ta’sir qilmaydi.

## Handoff
- **Task:** TASK-547
- **Natija:** o‘quvchi uchun reader-only tahririy qatlam va regressiya testi.
- **Fayllar:** `src/features/content/presentPedagogyTheory.ts`, `src/components/learning/TopicView.tsx`, `src/tests/task547PedagogyTheoryCopy.test.ts`, ushbu hisobot.
- **Migratsiyalar:** yo‘q.
- **Production:** yozilmadi; deploy qilinmadi.
- **Qolgan nazorat:** PR CI va learner sahifasi vizual smoke-test; barcha fanlar uchun manba satrlarini umumiy tozalash alohida scope.
