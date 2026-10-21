# TASK-424 — Full-bank answer quality wave 2 (eight more REVIEW proposals)

The owner explicitly approved full database audit and safe staged improvements on 2026-10-21. TASK-423 wave 1 successfully went live: eight new Y1 questions published, eight old versions archived, all correct options/snapshots valid, and three past exam-item links preserved.

## Wave 2 reviewed source questions
| Group | Original stem | UUID |
|---|---|---|
| S1.INFO | HSV/HSL modelining qulayligi nimada? | 3a2ebffc-55df-5bee-8847-fc78c6c319a8 |
| S1.INFO | Xartli formulasi qachon qo‘llanadi? | 651a433e-3f2b-5432-a4a5-fd6e76b7536d |
| S1.INFO | Mashina so‘zi nimaga bog‘liq? | 6c8224c8-deb3-5aaf-9152-05b105967235 |
| S1.INFO | Kodlash nima? | 85c85aa0-e86c-50e4-8fb5-43a156a70694 |
| S1.INFO | Kod jadvali nima? | a0bdd6d1-2ad7-54ac-a4e1-c83faefde4c9 |
| S1.INFO | Ma’lumot → axborot → bilim (sensor scenario) | ce096d06-2532-503a-b6bb-38258514f5ea |
| S1.INFO | Fayl formati nima? | dcc19fdb-0b46-5562-a9c1-4b1b7c521538 |
| S4.BLOCK | LOGO REPEAT square then FD 30 | 9766b2d1-260c-5265-89cf-9230d20775d9 |

## Content and integrity
- Three topic-relevant alternative answers per item; retain exact original correct option content and order via remapped option UUID. Clear explanation of why alternatives are not the most accurate.
- All new content `is_generated=true`, human editorial approval explicitly `false`. This is REVIEW staging only, not a human-verified final release.
- Source preflight original status `published`, original correct answer text exact match, valid Y1 4-option structure, no other successor in revision ledger.
- New review: four distinct case-sensitive strings, unique key, word-count max/min <=1.8, correct/max wrong <=1.25, original fingerprints unchanged, eight new review ledger links.
- Source stem/options/key/history untouched.
- `supabase/maintenance/task424_wave2_EIGHT_REVIEW_STAGE.sql` was executed against real production inside transaction with final `ROLLBACK`: **8 review, 32 options, 8 matching revisions verified.** No durable writes at rehearsal.
- Add regression `src/tests/task424BankwideWave2Review.test.ts` and run full GitHub CI before one-time review-only staging via Supabase migration runner.
- Only after deliberate further content adjudication and separately verified release gates may these revisions become published. Do not imply all bank questions have been reviewed.

Follow-up: continue cross-topic candidate triage and 1,900+ short rationales in issue #469, preserving the source books' actual assertions where a citation is available.
