# TASK-211 — M09 owner-authorized AI-only release: eight verified Y1

**Authorization:** 2026-10-20 the project owner directly instructed ChatGPT to act as subject expert and publish reviewed M09 questions. This is an explicit owner **exception**, not proof that a human independently reviewed these questions. This follows the narrowly scoped M13 owner-release precedent in root `DECISIONS.md` ADR-002 (M13).

## Exact permitted cohort
`MSACCESS-DEMO-STYLE-2026/DBS-Q01` through `DBS-Q08` (and no other).
- Q01–Q04 Access QBE with AND/OR, ANSI-89 LIKE, Show/Sort, row-result analysis.
- Q05 SQL LEFT JOIN COUNT(*) vs COUNT(non-NULL FK).
- Q06 GROUP BY/HAVING count(non-NULL Ball) and average.
- Q07 Text code preserving initial zero, Currency/YesNo/DateTime field choices.
- Q08 referential integrity and PK/FK valid update.
- 8/8 source, scope, construct, metadata, distinct choices, server-stored key and worked explanation reviewed by AI. Q01–Q06 cross-checked on synthetic PostgreSQL, 6/6.
- **Not a claim of live Microsoft Access.exe verification**. Questions original and demo-style, not copied past exam pages.
- 0 `question_editorial_checks` added or forged.

## Explicit, narrow owner authorization ledger
- `public.m09_owner_ai_release_waivers`, RLS ON, service-role-only, row per question, source-evidence/owner-message text, historical original lesson link, SHA-256 fingerprint.
- `reviewer_kind='ai'`; `owner_account_id` is owner-account attribution based on the single active admin; **not** an impersonated human reviewer action.
- Existing independent-human editorial approval path unchanged for all other content.
- Demo-style guard accepts a fingerprint-matching waiver ONLY for those 8 exact source IDs.
- The 8 questions re-map to the corresponding **already published canonical M09 lessons**, retaining the original V2 draft-source lesson in the ledger. This makes them accessible in existing topic/exam pools without publishing 6 unverified V2 lessons.
- The question/option/key immutable revision lock is added for these 8. Further edits require new versions, not mutation.
- No new answer payload goes into GitHub/public frontend.
- DB migration requires exact eight review items, correct construct and lesson mapping, 4 unique choices, valid correct-option pointer, nonempty evidence, no images or supplementary markers; fails closed on partial/unexpected data.
- Legacy canonical published questions, attempts and all other 288 V2 review questions remain untouched.

## Deployment strategy
1. Perform atomic ROLLBACK rehearsal on live schema.
2. Merge code, docs, migration and SQL test with green backend/db/frontend/quality.
3. Apply one-time migration once on the named Supabase project; verify eight published and no fake human editorial checks.
4. Confirm live Vercel source and learner exam/topic smoke.
5. Record the remaining 288 as review, plus six V2 lesson drafts as review. Do not imply whole M09 V2 edition is published.

**Risk:** AI review can be wrong; an owner-authorized AI exception is inherently riskier than independent subject expert review. Recheck learner complaints and revise mistakes as new question revisions.
