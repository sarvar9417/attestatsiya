# TASK-570 — Pedagogika nazariyasida qolgan manba bayonlarini didaktik tilga o‘tkazish

**Sana:** 2026-10-22. PR #563 (TASK-547) ustidagi qo‘shimcha, alohida branch.

## Tekshiruv
Production Supabase `public.lessons`da 18 ta asosiy M14–M16 dars matni o‘qildi; `body_mdx` nashrdagi immutable origin. Mavzuga tegishli 4 ta source-narration jumlasida o‘quvchi uchun ortiqcha metama’lumot borligi aniqlandi.

## Tuzatishlar
1. Xavfsiz ta’lim muhiti vaziyatida `PedKasb ...pdf, 59-savol` iborasini chiqarish va noto‘g‘ri takrorlanadigan `jismoniy tarbiya darsida jismoniy tarbiya o‘qituvchisi` matnini tuzatish.
2. `Pedmahorat|Guli/6075` diagnostika to‘rt vazifasi muhokamasini mazmunli o‘quv bayoniga aylantirish; tasnif universal norma emasligi haqidagi ehtiyotkorlik saqlanadi.
3. Pedagogik qobiliyatlar tasnifida o‘zaro farq haqidagi ilmiy ogohlantirishni saqlagan holda `Pedagogik qobilyatlar umumiy.pdf` fayl nomini bayondan ajratish.
4. Tarixiy namunadagi bahsli analitik/sintetik terminologiyasini o‘quvchiga javob-kaliti yoki ichki editorial yozuv sifatida bermaslik.

## Xavfsizlik va regressiya
Faqat `presentPedagogyTheory.ts`dagi **learner projection** yangilanadi; `public.lessons.body_mdx`, test savollari, to‘g‘ri javob kalitlari, manba auditlari va boshqa fanlar o‘zgarmaydi. `src/tests/task570PedagogyProvenanceRemaining.test.ts` real matn fragmentlari bilan tekshiradi. PR CI quality gate: frontend, backend, database.

**Deploy:** yo‘q. **Production Supabase yozuvi:** yo‘q. **Rollback:** PRni revert qilish.

## CI retrigger va bazaviy repo tekshiruvi

PR #569 ning dastlabki CI ishga tushish paytida asosiy repodagi `20261022009000_task405_...` nomli tarixiy migratsiyani timestamp-validator rad etdi. Ushbu task SQL migratsiya fayllarini o‘zgartirmadi. Joriy `main` `scripts/check_migration_filenames.py` faylida faqat ilgari ishlab chiqarishda kuzatilgan ikkita tarixiy noto‘g‘ri vaqtga aniq allowlist mavjud. PRni yangi `main` bilan qayta tekshirish uchun ushbu eslatma kiritildi; quality gate natijasi muvaffaqiyatli bo‘lmasa birlashtirish mumkin emas.

## CI dependency closed

PR #571 (TASK-572), merge commit `4d34d62c`, passed backend/frontend/database/quality CI and updated the stale group-mock source-evidence regression test for its verified indirect helper chain. This documentation commit retriggers PR #569 on the current main baseline. No production deployment or Supabase data changes.
