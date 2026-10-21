# TASK-381–386: Office Y3 ketma-ketlik savollarini tuzatish

**Sana:** 2026-10-21. **Muammo:** `OFF-W03-028` savolida "Berilgan vazifani ..." deb yozilgan, ammo bajariladigan vazifa ko‘rsatilmagan. Shuningdek, ketma-ketlik bosqichlari savol matnida `1)–4)` bilan keltirilgan va alohida sortable variantlarda yana takrorlangan.

## Bajarilgan ish

- Dastlab Microsoft Office guruhidagi 62 ta published Y3 ichidan **45** ta `Berilgan vazifani to‘g‘ri bajarish...` qolipi topildi.
- `TASK-381`: boshlang‘ich `OFF-W03-028` aniq MS Word Cross-reference vaziyati bilan tuzatildi.
- `TASK-382`: javob ketma-ketligi ishonchli va amallari aniqlangan **38** ta savolga aniq vazifa matni qo‘yildi.
- `TASK-383`: **6** ta noaniq/bahsli savol senariysi va zarur option/kalitlari qayta ishlab chiqildi.
- Qo‘shimcha audit yana **9** ta `Amallarni to‘g‘ri ketma-ketlikda joylang.` qolipini aniqladi. `TASK-385` bilan ular ham tuzatildi.
- **Jami 54 ta savol** immutable yangi versiya bilan almashtirildi; original 54 savol archived holatda va avvalgi exam-item havolalari o‘z holicha saqlangan.
- **3 ta javob ketma-ketligi tuzatildi**: `OFF-E01-017` = 3-4-2-1; `OFF-W01-028` = 2-3-1-4; `OFF-E02-030` = 2-3-4-1. Qolgan savollarda mavjud asosiy mantiqiy kalit saqlandi.
- Savol variantlari uchun yangi UUIDlar yaratilib, Y3 `payload.order` yangi UUIDlarga moslashtirildi; eski savollarning option/key tarixiy ma’lumotlari o‘zgartirilmadi.
- `question_quality_published_revisions` dagi **54/54** fingerprint qayta tekshirildi. Yangi nashrlar published, eski manbalar archived; javob kalitlari va 4 option bog‘lanishida **0 texnik nomuvofiqlik**.
- `TASK-386` umumiy `Berilgan vazifani...` va `Amallarni to‘g‘ri ketma-ketlikda joylang.` qolipidagi published Y3 kiritilishini bazada bloklaydi.
- Yakunda bu ikki qolipdagi published Y3 savollar soni **0**. Ilgari ochilgan Office sifat ko‘rigi yozuvlari tuzatish identifikatorlari bilan yopildi.

## Sifat va chegaralar

Bu texnik va mazmuniy AI-review orqali qilingan, foydalanuvchi talab qilgan revidir. **Mustaqil inson ekspert attestatsiyasi/sertifikati mavjudligi da’vo qilinmaydi.** `release_scope` va `question_bank_revisions.evidence` buni aniq belgilaydi.

Qolgan boshqa bo‘limlardagi Y3 savollar ham alohida mazmuniy ko‘rikka muhtoj bo‘lishi mumkin; ushbu ish **barcha test bankining to‘liq eksperti auditi emas**.

## Manba kodi

- `supabase/migrations/20261021220000_task381_y3_missing_goal_immutable_fix_and_office_qa_queue.sql`
- `supabase/migrations/20261021221000_task382_office_38_explicit_y3_goals_immutable_revisions.sql`
- `supabase/migrations/20261021222000_task383_office_final_six_y3_semantic_repair.sql`
- `supabase/migrations/20261021223000_task385_office_nine_more_generic_y3_revisions.sql`
- `supabase/migrations/20261021224000_task386_guard_against_generic_y3_task_prompts.sql`
- `supabase/tests/task386_office_y3_task_goal_regression.sql`
