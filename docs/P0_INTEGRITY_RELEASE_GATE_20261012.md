# P0 Release Gate — Auth, CMS and question/source integrity

**2026-10-12**, evidence from read-only production Supabase `attestatsiya100%` (`plyqezulrfowyblsfpzy`), GitHub main, PR #95 and PR #100.

**Release constraint: this is a DRAFT branch. DO NOT MERGE, DEPLOY OR WRITE PRODUCTION DATABASE until user explicitly authorizes release.** CI uses isolated ephemeral Postgres only.

## Verified current production baseline (before draft fixes)

| Metric | Count |
|---|---:|
| All questions | 1680 |
| Published questions | 1650 |
| Review questions | 30 |
| Published Y1 / Y2 / Y3 | 1580 / 31 / 39 |
| Modules | 16 |
| Published lessons | 114 |
| Published questions without source_reference | **5** |
| Published questions without source_lesson_id | **185** |
| Active constructs | 77 |
| Constructs with 0 published questions | **6** |
| Constructs with fewer than 20 published questions | **59** |

The missing 185 lesson links are **not equivalent to 185 absent source references**:

- 5 historical source-less demonstration items have deterministic UUIDs ending `a0a00001` through `a0a00005`; all 5 have zero linked records in `exam_items`, `mastery_evidence`, `question_reports` and `question_stats` in the observed production snapshot.
- 180 `generated:%` exercise items have a source fingerprint but no directly linked lesson.
- **120/180** generated items have exactly one published lesson mapped to their construct; draft maintenance links **only these safely identifiable cases**.
- **60/180** have two published lesson candidates each: `S1.INFO.05` and `S3.LOGIC.04` (30 each). Do not guess between these — human editorial source-context review needed.

## Six constructs with no published questions

| Construct | Official curriculum label in current DB |
|---|---|
| S3.ALGO.03 | Masalaning algoritmini tuzish |
| S3.LOGIC.01 | Sodda va murakkab mantiqiy mulohazalar tuzish |
| S3.LOGIC.03 | Mantiqiy mulohazalar yordamida masala yechish |
| S4.CODE.04 | JavaScript sintaksisi asoslari |
| S6.NET.02 | Tarmoq arxitekturasi va topologiyalari |
| S6.NET.04 | Internetdan xavfsiz va maqsadli foydalanish |

These are **objective-level gaps**; even if global group×cognitive quota pools pass, topic completeness needs separate evidence. New source-backed original exercises and editorial review are required. A previously written question in another construct does not close these zero-item gaps.

## Integration work in this Draft branch

1. **PR #100 already merged into main**: 24 new Y2 and 24 new Y3 questions, plus M02/M05 source lesson drift fixes. No duplicate import or migration copied here. Latest read-only production snapshot records 31 Y2 and 39 Y3.
2. **Stage PR #95 CMS hardening** (unmerged): only admin can publish, author cannot approve own item, construct/source/key required, and existing Published question is immutable. An additional guard refuses blocked staff before any action. Unit tests included.
3. **Stage source-less demo quarantine**: archive five specific demo UUIDs only if no learner/exam/report/stat references exist; do not delete any records or rewrite source claims. If any unexpected source-less published question exists, abort.
4. **Stage generated lesson rebind**: links only exact single-published-lesson mapping; preserves IDs/answer keys/attempts/status. Intentionally leaves 60 ambiguous production cases for human review.
5. SQL scripts are placed under `supabase/maintenance/` and **must be run manually during a release, not silently applied by fresh migration chain**. In GitHub CI they run twice against ephemeral data to prove idempotence and check taxonomy alignment.

## Auth real-email release blockers

Code-level unit tests for reset and session handling exist, but a **real SMTP redirect → email → password reset → fresh login** E2E is still required, in a preview/staging setup with an authorized disposable test inbox. A test-only `live-auth.spec.ts` exercises login/refresh/logout but does **not** test real recovery email. A green CI with placeholder credentials cannot prove real-email recovery.

Required acceptance procedure:
1. Create **temporary dedicated test user**, confirm email address; never reuse a real user's password.
2. Send reset email through staging backend; verify the link opens the expected `/reset-password` route on staging, not production.
3. Verify the form survives hard reload/refresh before submission, and recovery tokens are never logged or exposed to analytics.
4. Change the password exactly once; verify the old password fails, the new password succeeds.
5. Verify expired/used recovery link is rejected and does not authenticate user.
6. Verify separate account/session isolation and sign-out; inspect redirect allowlist, SMTP delivery/rate limiting.
7. Revoke the test sessions and delete the disposable test account; retain only redacted pass/fail log.

**Do not claim this E2E is passed until steps 1–7 have evidence from the actual staging environment.**

## Outstanding work after this branch

- Review the 60 ambiguous generated-to-lesson links by comparing each question's topic with lesson curriculum; do not blindly bind.
- Fill six completely uncovered constructs and the remaining 59 low-coverage constructs with source-backed, human-checked items.
- Close PR #95 and draft integration review without breaking PR #97 source/editorial candidate features.
- Verify full 50/120/8–35–7 exam blueprint, at least 20 audited assemblies, 1,000+ invariant runs and security/backup performance gates.
- Provide isolated staging Supabase and disposable real-email inbox for release QA; no prod until separate final authorization.
