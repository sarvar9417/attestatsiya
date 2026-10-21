# TASK-422 — PedGuli savollarining owner-authorized release'i

## Natija

2026-10-21 kuni foydalanuvchi 16 ta Telegram-discovered pedagogika savoli bo‘yicha yakuniy tahririy qaror vakolatini ChatGPTga berdi va qayta review so‘ramaslikni buyurdi. Savollar `review` holatida mazmuniy va texnik audit qilindi, tahrir qilindi va bitta atomar production migratsiya orqali nashr qilindi.

Bu release mustaqil inson eksperti tekshiruvi sifatida ko‘rsatilmaydi. `pedagogy_owner_release_waivers.provenance` aynan owner-authorized, AI-assisted qarorni qayd qiladi.

## Tahrir va nazorat

- `2257`: `o‘quvchini gapini` → `o‘quvchining gapini`.
- `2396`: `o‘quvchilarni ... munosabatini` → `o‘quvchilarning ... munosabatini`.
- 16 savolning chalg‘ituvchi variantlari yagona uslubda qayta muvozanatlandi.
- To‘g‘ri javob option UUIDlari va `question_keys` yozuvlari o‘zgartirilmadi.
- Har savolda aynan 4 ta o‘zaro farqli variant va aynan 1 ta mavjud kalit tekshirildi.
- Production publish gate talabi: `max_words <= min_words * 1.8` va `correct_words <= max_wrong_words * 1.25`; natija 16/16.
- Normalizatsiya qilingan stem bo‘yicha faol `review`/`published` aniq dublikatlar: 0.
- Construct, lesson va source reference bog‘lanishlari saqlandi.

## Production dalili

- Migration: `20261021151001_task422_pedguli_16_owner_authorized_release`.
- Published: 16/16.
- Structural key/options integrity: 16/16.
- Distractor balance: 16/16.
- Owner-authority waiver: 16/16.
- Immutable publication snapshot: 16/16.
- Open quality findings: 0.
- Old exam item references: 0; savollar review holatida bo‘lgani uchun tarixiy urinishlarga ta’sir qilinmadi.

## Repository

- Release SQL: `supabase/maintenance/task422_pedguli_16_owner_authorized_release.sql`.
- Regression: `src/tests/task422PedguliOwnerRelease.test.ts`.
- TASK-357 bilan birlashganda migratsiya timestamp to‘qnashuvi TASK-382 faylini `20261021221001`ga ko‘chirish orqali hal qilingan; TASK-376 va undan keyingi TASK-421 source-reference reconcile tartibi saqlandi.
- Vercel yoki application deploy qilinmadi.
