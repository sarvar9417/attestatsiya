# Attestatsiya — yagona release qoidasi (2026-10-18)

Bu loyiha egasining amaldagi talabi.

- Pedagogika bo'yicha TASK-202 faqat **bir marta** yakuniy GitHub merge va **bir marta** production Vercel deploy bilan chiqariladi.
- **Oraliq merge, production deploy, production migratsiya, auto-merge yoki release-branchdan majburiy promout qilish taqiqlanadi.**
- Ishlar faqat `task/TASK-202-pedagogy-single-final-release` yoki release oldi local/feature branchlarda yuritiladi. CI va Vercel preview production deploy emas.
- Faqat to'liq kontent, server xavfsizligi, PDF-source provenance, normativ moslik, javobning yagona to'g'riligi, Y1/Y2/Y3 shakli, variantlar balansi, official 50 va dedicated 15 testlar, natija/history, frontend/backend/db regressiyasi va final release smoke PASS bo'lgandan keyin PR #121 orqali yagona merge.
- Rasmiy ekspert tasdig'i va AI kontent auditi boshqa-boshqa tushunchalar. Manbada tekshirilmagan yoki bahsli savolni asossiz tasdiqlash mumkin emas; karantinga ajratiladi.
- Merge `main` bo'yicha Vercel Git auto-production deploymentni avtomatik boshlashi mumkin. **Yana qo'lda ikkinchi deploy boshlanmaydi.** Avval production deployment ID/SHA/READY holati tekshiriladi.
- Yakuniy production deploymentdan so'ng har qanday yangi merge, database production migration yoki production deploy uchun foydalanuvchining **yangi aniq ruxsati** talab etiladi.
- Boshqa PR yoki vazifa avtomatik ravishda ushbu yakuniy release cheklovini bekor qilmaydi.

Current state: TASK-202 still DRAFT. See `docs/TASK202_ONE_FINAL_PEDAGOGY_RELEASE.md`.
