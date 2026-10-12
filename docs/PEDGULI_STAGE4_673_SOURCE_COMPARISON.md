# Pedmahorat | Guli Stage 4 — 673 missing-topic source records, source comparison and rights quarantine

**Private-source basis:** the user's 20 Telegram Desktop HTML files and private SQLite v3, not previously published exam keys. Rights to redistribute original Telegram text, media, and poll content are **not established**.

**NO PRODUCTION RELEASE:** user has reserved separate explicit approval. Do not merge Draft PR #97, deploy Vercel production, or apply new migrations to production Supabase (now connected under account `sarvar9417`, project `attestatsiya100%`, ref `plyqezulrfowyblsfpzy`).

## Actual verified local staging work

- Database: `/mnt/data/pedguli_1394_staging_review_v4.sqlite3`, SHA-256 unique source candidate and source message data preserved from v3.
- Total source questions: **1,394**; canonical duplicate message references: **1,014**. No original texts committed to public Git.
- This batch: **673** records lacking an accepted topic proposal after stage 3, all assessed in `remaining_673_extended_review` with one machine-proposed best and runner-up construct, score margin, warning, and release gates.
- **91** have a relatively high classifier margin, **580** low, **2** flagged as missing-media material and left with **no** proposed construct.
- Character n-gram SVM trained on 449 previously singly tagged source items (prior heuristic tags are imperfect labels). Single held-out test of 113: **73.5% overall accuracy**. The 0.5-margin subset: 49 held-out, **91.8% accuracy**. This is too small and noisy to imply 91.8% accuracy on Telegram's remaining data. **Neither tier is human validated.**
- Exactly **7 privately recorded source-textbook answer correspondences** in `answer_source_comparison`; this is **not** expert approval and does not confer rights to reproduce original source wording. Source message IDs: 127, 128, 130, 172, 173, 175, 657. Candidate's `answer_key_status` and `editorial_status` remain unverified/review.
- `source_candidates` original rights status remains **not_cleared for all 1,394**; no learner-visible `questions`/grading tables changed.
- Offline import update: `/mnt/data/pedguli_stage4_private_import.json` contains metadata only, 673+7; **do not commit it to public Git**.

## Source-to-answer comparisons (editorial leads, not exam keys)

| Telegram ID | Suspected concept | Correct letter as matched with textbook | Independent reference |
|---|---|---|---|
| 127 | Ta’lim | C | Umumiy pedagogika, pedagogikaning asosiy kategoriyalari |
| 128 | Bilim | D | Same |
| 130 | Malaka | A | Same |
| 172 | Bilim | D | Boshlang‘ich ta’lim pedagogikasi |
| 173 | Ko‘nikma | A | Same |
| 175 | Malaka | B | Umumiy pedagogika |
| 657 | Didaktik qobiliyat | C | Pedagogik mahorat |

Sources:
- https://lib.bimm.uz/items/download/10389
- https://turan-edu.uz/media/books/2026/01/24/D_Abdusamiyev_Boshlangich_talimpedagogikasi_Darslik__2.pdf
- https://milliytarbiya.uzedu.uz/storage/pdf/EnfsQusXigfpdz5TVgHqqnaFRBqqsWBMRMQ6KdWL.pdf
- Official 2026 Informatics attestation specification (user-provided PDF) establishes KS 5 / PM.GEN 7 / PM.MET 3 only; it does NOT verify Telegram answers.

**Important observation:** at least one textbook-supported simple pedagogy term was mistakenly predicted by the statistical topic classifier as `KS.03`. The source-supported topical recommendation is kept in the *separate private answer-comparison table*, NOT silently replacing the source tag. An expert must independently review the construct.

## Safe platform code

- `20261012115000_pedguli_private_stage4_673_triage.sql` creates two service-role-only RLS tables for machine suggestions and cited-answer comparisons.
- `POST /api/admin/pedguli-candidates/stage4` is active-admin-only, bounded to 50 topic and 10 source comparisons per request, validates source IDs against existing 1,394 candidates, and **rejects production Supabase** without final separate authorization.
- `scripts/import-pedguli-stage4.mjs` performs strict local dry-run validation and optional staging-only 14-batch import.
- `GET /api/admin/pedguli-candidates` exposes nested private data only to active staff via authenticated backend; the student API stays unchanged.
- Admin's Telegram source-candidate inbox displays topic certainty tiers and a reference link while emphasizing **pending human reviewer and copyright permissions**.
- PostgreSQL, API and importer tests enforce no submission of auto-publish fields and no transfer to `question_keys`.

## Actual uncompleted blockers

1. **580 low-margin items remain unconfirmed**; the classifier's 73.5% held-out overall accuracy precludes declaring these correctly categorized. They have a provisional guess + alternative for the human reviewer.
2. **2 source questions are incomplete without their original images.**
3. Original Telegram reuse rights are **not established for any source**, and cannot be inferred from a public channel or by an AI. Written authorization from the rights holder is needed for wholesale reproduction.
4. Aside from seven textbook-correspondence leads, **other source answers are not verified** by independent accessible textbooks. The original post's ✅ is not a verified key.
5. The authenticated Supabase connection can now see the **production** Attestatsiya project, but **no isolated remote staging project has been provided**. Until there is one, the full private source content remains in local SQLite; deployment SQL and safe importer are staged in Draft PR, not executed against production.

This is deliberate source integrity, not a failed import: we have **accounted for every 673 source candidate** but do not misrepresent inferred category or licensing as validated.
