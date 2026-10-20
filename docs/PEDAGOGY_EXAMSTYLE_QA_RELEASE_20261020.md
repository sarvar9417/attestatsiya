# 2026-10-20 — Pedagogika attestatsiya uslubi: live yakuniy QA hisobot

## Manba chegarasi
Drive'dagi 2024, 2025 bahor/kuz va 2026-yilgi `PedMahoratGuli` PDF to‘plamlari **imtihon formati va uslubining tarixiy namunasi** sifatida o‘qildi. Bu to‘plamlarning o‘zi «rasmiy imtihonda tushgan» degan da’vo yoki tekshirilmagan javoblar uchun rasmiy dalil emas. Normativ tayanch: `Informatika Testlar spesifikatsiyasi.pdf` va platformadagi M14–M16 nazariya (18 canonical lessons). Matnlar PDFdan mexanik nusxalanmadi; yangi savollar original qayta ifoda.

## Release dalili: production Supabase, 2026-10-20
1. Dastlab **450** published pedagogy (KS 140, PM.GEN 233, PM.MET 77): Y1 426, Y2 11, Y3 13.
2. Avvalgi PR #322 doirasida yaratilgan **19 ta original** Y1(13), Y2(3), Y3(3) savolni source/key/format SQL tekshiruvidan keyin, owner oldingi «tashqi ekspert shart emas» qarori asosida, auditli bitta tranzaksiyada `review → published` qildik. **469 active** (KS 148, PM.GEN 241, PM.MET 80).
3. Dastlabki Y1 metama’lumot triage `docs/audits/20261020_pedagogy_y1_review_flags.csv`: 40 ta ko‘p-belgili ustuvor nomzod, ularning **40/40** tasi original tekshirish asosida kengroq pedagogik vaziyat va mantiqan yaqinroq uchta distractor bilan qayta yaratildi.
4. Qolgan barcha faol Y1 bo‘yicha option so‘z uzunligi chegarasini tekshirib, yana **3 ta** uzunlik nomutanosibligini tuzatdik.
5. Jami **43 ta immutable question revision** — `stage_pedagogy_revision`, fingerprint bilan owner waiver, `publish_pedagogy_revision` orqali `original archived + replacement published`. Har partiya production transaction bilan `ROLLBACK` rehearsal → `COMMIT` qilindi, source UUID shartlari fail-closed.
6. **43/43** oldingi savol archived va yangi versiya published, **0** original correct-answer matni yoki explanation o‘zgargan, **0** source-lesson bog‘lanishi o‘zgargan, **0** to‘rt xil variant yoki 1.8x so‘z balansi buzilgan. **69 ta** tarixiy `exam_items` eski arxivlangan savollarga ishora qilib saqlanib qolgan.
7. Owner waiver: oldingi tashqi ekspert talabini bekor qilish haqidagi foydalanuvchi qarori; **mustaqil ekspert sertifikati yoki haqiqiy imtihon savollarining rasmiyligi da’vo qilinmaydi**. Boshqa savollarni “exam identical” deb baholamaymiz.

## End-state structural QA (live production)
| Group | Published Y1 | Published Y2 | Published Y3 | Y1 stem <70 | Y1 stem <45 | Y1 stem >=180 | Strictly longest correct | Word spread >1.8 | 4-option/key failure |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| KS | 136 | 9 | 3 | 19 | 6 | 12 | 0 | 0 | 0 |
| PM.GEN | 229 | 4 | 8 | 27 | 7 | 37 | 0 | 0 | 0 |
| PM.MET | 74 | 1 | 5 | 12 | 4 | 9 | 0 | 0 | 0 |
| **Jami** | **439** | **14** | **16** | **58** | **17** | **58** | **0** | **0** | **0** |

Published 469 total. Y2/Y3 original source-key format verification passed; all 19 new Y1/Y2/Y3 have source lessons and valid keys. **Qisqa savol avtomatik ravishda noto‘g‘ri emas.**

## Exam selector preflight
2026 active `blueprint_quotas`: **50 savol, 120 daqiqa**, KS 5 (1 bilish/3 qo‘llash/1 mulohaza), PM.GEN 7 (2/4/1), PM.MET 3 (1/0/2); qolgan fan 35. Oldingi 30-daqiqali, 15-savolli mashq alohida. DB question source and quotas checked read-only; **logged-in browser E2E 15/50 actual submission not performed in this run**. CI branch regressions and integration tests are separate.

## Tarixiy tekshiruv va kod xavfsizligi
Physical option order is not the learner-displayed order: `generate_official_mock`, `generate_topic_test`, `generate_professional_practice_15` server-side `exam_items.option_order` randomization handles it. Client-side second shuffle is correctly **not** applied.
Migrations `20261020083000` and `20261020084000` were updated to accept previously owner-published original items **without republishing** and tested via `ROLLBACK` in live production. `supabase/tests/pedagogy_examstyle_review_20261020.test.sql` now checks structure for either review (fresh install) or published (authorized release). No migration silently promotes draft questions.

## Open boundaries
- Remaining **58 Y1 short stems** need context-aware editorial scrutiny; 17 are <45 chars but may be valid terminology recall.
- The pre-existing **32 other REVIEW Y1** remain unpublished; historical PDF inbox **119 rejected/quarantined candidates** remain private pending independent resolution of duplicate, parsed-key and source-conflict problems. No claim of full semantic independent certification for all 469.
- A full authenticated **15/50 exam E2E** and real browser production confirmation should still be performed before claiming finished end-to-end UX.
- Avoid leaking answer keys in public Git documentation; this report and `published_revisions_43.csv` contain only IDs/status counts, no answers.

## Reproducibility
- `docs/audits/20261020_pedagogy_published_revisions_43.csv`: source→revision ID, group and stem lengths, no keys.
- `supabase/audits/20261020_pedagogy_release_readonly.sql`: production-safe aggregate counts.
- Review of detailed SQL release can be reconstructed privately from Supabase `pedagogy_revision_queue`, `pedagogy_rewrite_proposals`, `pedagogy_owner_release_waivers` and fingerprint snapshots. Already executed release operations must **never** be re-run as non-idempotent maintenance.
