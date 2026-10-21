# TASK-373 — Kasbiy standart (KS): 60 qisqa javob izohi ekspert tahriri

## Release cheklovi

**Foydalanuvchi faqat GitHub `main`ga merge qilishga ruxsat bergan.** Production Vercel deploy, Supabase ma’lumotlarini o‘zgartirish, migratsiya qo‘llash, savolni publish qilish va inson eksperti tasdig‘ini qalbakilashtirish mumkin emas.

## Read-only tahlil

2026-10-21 holatidagi live query: **211 ta published Y1 KS savolidan 60 ta izoh 80 belgidan qisqa**, ular uchun reviziya navbatida yozuv yo‘q. Har bir savolning matni, avvalgi izohi hamda serverda belgilangan to‘g‘ri javob varianti mazmunan solishtirildi. Qisqalik mutlaq xatolik emas; bu to‘plamda tushuntirishni o‘quvchi uchun chuqurlashtirish afzal deb topildi.

## Natija

- `supabase/maintenance/task373_ks_60_explanations_ROLLBACK_ONLY.sql`: 60 ta noyob manba identifikatori, 60 ta mustaqil 285–359 belgilik pedagogik asoslash.
- Rejalashtirish, natija va baholash mosligi, diagnostika, guruhda teng qatnashish, konflikt, maxfiylik, xavfsizlik, inklyuzivlik, refleksiya, kasbiy rivojlanish va oila-maktab hamkorligi bo‘yicha savollarning o‘ziga mos sabablar yozildi.
- `src/tests/task373KSExplanationReview.test.ts` 60 ta source reference, noyob izoh, ilmiy-pedagogik mazmun sohalari, rollback va no-publish invarianti bilan tekshiradi.
- `supabase/maintenance/task373_ks_short_explanation_audit_READONLY.sql` mustaqil qayta audit SELECT’lari.
- Ishlangan savollarning to‘g‘ri javob belgilari va javob kalitlari hech qanday frontend kodiga ko‘chirilmagan.

## Immutable content va ishonch

Mavjud published savollar, kalitlar va oldingi imtihon urinishlari joyida o‘zgartirilmaydi. SQL fayl `supabase/maintenance`da, migration papkasida emas; u `BEGIN` bilan boshlanib doim `ROLLBACK` bilan tugaydi. Shuning uchun script productionda bajarilmagan va bajarilishi ham foydalanuvchi ruxsatisiz taqiqlanadi. Mazkur izohlar inson ekspertining qayta tekshiruvi uchun **review draft** hisoblanadi, avtomatik nashr qilinmaydi.

## Handoff

Task: TASK-373
Natija: 60 KS pedagogik izoh va ularning manba asoslangan tayyorlama paketi.
O‘zgargan fayllar: SQL maint, test, read-only audit, ushbu hisobot, TASKS.md, PROJECT_STATE.md.
Migratsiyalar: yo‘q.
Testlar: GitHub CI / Vitest bilan tekshiriladi.
Qolgan xavf: production live ko‘rinishi eski izohlarni ko‘rsatishda davom etadi; kelgusida egasining aniq ruxsati va mustaqil inson ekspert nazorati shart.
Keyingi ustuvor vazifa: `PM.GEN` bo‘yicha M15dan tashqari hali qisqa izohlarni semantik QA va alohida review paketga ajratish.
