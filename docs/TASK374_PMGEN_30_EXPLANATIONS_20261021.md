# TASK-374 — M15dan tashqari 30 PM.GEN pedagogika izohini chuqurlashtirish

## Release qoidasiga qat’iy rioya

Foydalanuvchi ruxsatisiz production deploy, Supabase’ga yozish, migratsiya va publish **taqiqlangan**. Faqat GitHub `main` merge. Published savollar, javoblar va exam attempts immutable. Inson ekspertining bo‘lmagan tasdig‘i yozilmaydi.

## Read-only audit

2026-10-21: `PM.GEN` bo‘yicha jami 495 published Y1 savol, 80 belgidan qisqa izohlar 152 ta. Avvalgi TASK-371 56 ta M15 pedagogika savoli uchun review paket tayyorlagan. M15dan tashqari **96 ta qisqa izoh** aniqlandi. Ulardan 30 tasi, eng qisqa matnlardan boshlab, savol va serverdagi javobning mazmuniga qarab individual tahlil qilindi. Qisqalikning o‘zi albatta noto‘g‘ri javobni bildirmaydi.

## Tayyor material

- `supabase/maintenance/task374_pmgen_30_explanations_ROLLBACK_ONLY.sql`: 30 ta noyob source-reference, 30 ta 297–355 belgilik, vaziyatni tushuntiruvchi pedagogik asoslash.
- `src/tests/task374GeneralPedagogyRationales.test.ts`: noyob manba va mazmun, pedagogik yo‘nalish qamrovi, rollback-only, no-COMMIT, no-publish guard.
- `supabase/maintenance/task374_pmgen_short_audit_READONLY.sql`: faqat SELECT.
- PM.GEN metodika: etika, nutq, axloqiy tarbiya, ilmiylik, didaktika, yoshga moslash, o‘quvchi faolligi, sinf rahbarligi, inklyuzivlik va muammoli ta’lim.
- Frontend bundle’ga javob kaliti yoki key mapping olib o‘tilmagan.

## Immutable/review-only tamoyil

Manba published holatda qoladi. Fayl migration emas va har qanday tranzaksiya `ROLLBACK` bilan tugaydi. Ushbu materiallar productionda ishga tushirilmagan, faqat mustaqil inson ekspertizasidan keyin alohida ruxsat bilan nashr etilishi mumkin.

## Handoff

Task: TASK-374
Natija: 30 PM.GEN individual didaktik izoh tayyor.
Migratsiya: yo‘q.
Tekshiruv: avtomatik struktura/mazmun smoke va repo GitHub CI.
Blocker: human review/release, production ma’lumoti o‘zgartirilmaydi.
Keyingi ustuvor paket: M15dan tashqari qolgan `PM.GEN` qisqa izohlar.
