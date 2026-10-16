# TASK-200 — Muvozanatli pedagogika testlari: 1-partiya

**Sana:** 2026-10-16. **Holat:** IN_PROGRESS. 15 savol production Supabase'da REVIEW; learnerga chiqarilmagan.

## Source va scope
2024 bahor (4), 2025 bahor (4), 2025 kuz (3), 2026 bahor (4).
Private pedagogy_pdf_source_candidates jadvalida bundan oldin 649 source candidate mavjud: 195 verified, 335 accepted_general, 119 rejected/quarantine.
Faqat verified va independently_verified, mapped construct va duplicate bo‘lmagan candidate-lar ishlatildi.
Raw source matni public Gitga kiritilmadi; savollar yangi, original ifodalangan.

## New batch
- 15 ta Y1 (7 KS va 8 PM.GEN), jami 60 option va 15 server-only answer key.
- Source lokatori source_reference'da, private candidate bilan linked_question_id yordamida ulangan.
- 4 variant; maxWords/minWords <= 1.8; correctWords <= 1.25*longestWrongWords.
- Original stem + izoh mavjud; har bir savol human expert review kutmoqda.
- Migration: supabase/migrations/20261016210000_task200_balanced_pedagogy_review_batch.sql.
- Regression: supabase/tests/task200_balanced_pedagogy_review.test.sql — remote DB'da passed.
- Audit: supabase/maintenance/20261016_pedagogy_length_bias_audit.sql — admin-only, answer keys learnerga berilmaydi.

## Existing-bank risk (2026-10-16)
KS/PM.GEN/PM.MET dagi 169 ta published Y1 savolning 118 tasida correct javob boshqa barcha variantlardan 30% dan ortiq uzun.
Eski published savollar immutable: bevosita update emas, yangi revision, editor approval va oldingi urinishlar tarixini saqlash orqali ta'mirlanadi.

## Completion gate (TASK-200 hali DONE emas)
1. Qolgan 649 source candidate barcha verified/general/quarantine statuslarini shaffof saqlash va noyoblarini birma-bir qayta ishlash.
2. 15 ta yangi savol mazmuni va distractorlarini ekspert tekshirib tasdiqlashi.
3. Mavjud published length-biased savollarga approved revision/remediation.
4. Faqat published savollarni Testlar va Maxsus pedagogikadan tayyorlanish ekranlarida ko‘rsatish, real UI E2E tekshiruvi.
5. PR CI, migration history, production smoke va handoff tekshiruvi.