# TASK-429 — 5 ta Mantiq PDF savolini yangi versiya sifatida nashr qilish

2026-10-22. Manba: [Mantiq 2-dars.pdf](https://drive.google.com/file/d/1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa/view).

## Nima o‘zgardi

Manbadagi №44, 46, 47, 49, 50 masalalarda A yoki B mantiqiy o‘zgaruvchisi noaniq tabiiy tildagi bayonot orqali belgilangan. Ularni aynan o‘zgarmagan original sifatida nashr qilish mumkin emas. Har biri uchun yangi, **A,B,C erkin 0/1 qiymatlarga ega** shartli tahrir yaratildi; formulalarning sakkiz qiymati tekshirildi.

| № | Asl formuladan olingan yangi tahrir | Sakkiz holatdan | Javob |
|---|---|---|---|
| 44 | A → (B ∨ (¬C ∧ A)) | YOLG‘ON 1 ta | A |
| 46 | (A ∨ ¬C) → (¬A ∧ B) | YOLG‘ON 5 ta | C |
| 47 | (¬A ∨ B) → (C ∧ ¬B) | ROST 3 ta | B |
| 49 | (¬A → B) ∨ (C ∧ ¬B) | ROST 7 ta | C |
| 50 | (¬A ∨ C) → (B ∧ ¬C) | YOLG‘ON 5 ta | B |

## GitHub va Supabase dalili

- `supabase/maintenance/task429_publish_five_truth_table_y1.sql` — alohida source+construct+published lesson QA, 5×4 option unique check, key+explanation, old question mutation yo‘q, immutable publish snapshot va public eligibility gate.
- Database transaksion rehearsal `BEGIN…ROLLBACK`: **PASS**.
- Durable `COMMIT`: **PASS**. Live postflight: `task429:pdf-editorial:20261022:%` bilan **5/5 published**, source info `is_generated=true`, active lesson `Rostlik jadvallari`.
- Predecessor TASK-428: 10/10 newly authored published with 40 options. Two waves total **15 published**, **60 options**, **15 immutable snapshot** and 15/15 official-eligible.
- Original source `attest_ingest.telegram_informatika_pdf_question_candidates` totals **695**, answer_key=0. Source candidates edited over/nashr qilib yuborilmagan.
- Independent human editorial signature **claimed: NO**. Owner-delegated AI editorial correction.
- `scripts/task429-truth-counts.test.mjs` enumerates all 8 configurations; PR CI workflow included.
- No mock exam historic link, no learner answer, no Vercel deployment modified.

## Qolgan ishlar

695 source candidateni asl PDF nuqsonlari va grafika tiklangandan keyin alohida editorial ko‘rib chiqish kerak; 15 yangi tuzatilgan Y1 bu source candidate rows nashr holatini avtomatik o‘zgartirmaydi. TASK-423 graph QA diagramlari hali learner storage/public UIga ulanishi kerak.
