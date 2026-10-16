# 2026-10-16 — Read-only Production Content Release Audit

**Safety:** this report documents production SELECT-only diagnostics. No SQL UPDATE/INSERT, migration, merge to main, or Vercel deploy has been authorized or performed. New work is on feature branch `audit/20261016-release-content-gates` only.

## Verified production counts

| Indicator | Production |
|---|---:|
| Modules | 16 |
| Lessons total | 122 |
| Published lessons | 114 |
| Questions total | 1,680 |
| Questions published | 1,650 |
| Questions in review | 30 |
| Published Y1/Y2/Y3 | 1,580 / 31 / 39 |
| Active objective constructs | 77 |
| Constructs with zero published items | **6** |
| Constructs with fewer than 20 published items | **59** |
| Constructs with at least 20 published items | 18 |
| Published questions with no source_reference | **5** |
| Published questions with NULL source_lesson_id | **185** |
| Published questions with a *non-null* source_lesson_id but without a matching published lesson+construct pairing | **0** |
| Private Telegram candidate table on production | **DOES NOT EXIST** |

Six currently empty construct codes:
`S3.ALGO.03`, `S3.LOGIC.01`, `S3.LOGIC.03`, `S4.CODE.04`, `S6.NET.02`, `S6.NET.04`.

**Important distinctions:**
- The 185 `NULL` source-lesson links are not evidence that the underlying questions are necessarily pedagogically invalid: legacy item structures may deliberately use external source references. Inspect individually. Never attach a random lesson to silence an error.
- Zero explicit mismatches among *non-null* lesson links is reassuring, but does not validate the content or answer keys of the 185 unlinked questions.
- `status=published` is a database state, **not proof of independent human/expert signoff**.
- 1,394 Telegram source candidates in offline SQLite and the Draft PR #97 must **not** be conflated with the 1,650 published production questions.

## Current PR review

- PR #100 `TASK-063: expand Y2/Y3 bank and reconcile lesson drift` is **MERGED**. It has 48 original Y2/Y3 additions, according to its changelog.
- PR #95 `Harden admin publish workflow` is **CLOSED and UNMERGED**. Its requirements are not automatically considered fixed just because the PR was closed; check `main` independently.
- PR #97 Pedmahorat source bank is **DRAFT, UNMERGED**. Its 1,394 candidate archive and 84 additional original items have not been released to production.
- `live-auth.spec.ts` uses named live-test credentials and **skips under CI when real Supabase credentials are absent**. Green CI therefore does not prove real SMTP-password-reset, redirect-url, refresh and email confirmation round trips.

## Prioritized implementation gates

1. **P0 source/objective repair:** create reviewed, source-backed items for the six zero-pool constructs. Independently validate answer/explanation; correct objective mapping. Don't publish yet.
2. **P0 investigate 5+185 source anomalies:** provide immutable per-ID audit evidence. Fix only after authoritative source/lesson mapping; keep old learner attempts stable.
3. **P0 auth end-to-end:** user registration/verification/login/forgot-password via real email, callback refresh, token expiry and no unauthorized access in isolated test environment. Address any failures, rerun.
4. **P1 question bank expansion:** reach 3,000 verified published questions and at least 20 distinct eligible candidates per required blueprint slot/construct as specified in release checks (not simply 3,000 nominal rows).
5. **P1 editorial readiness:** validate 84 original pedagogical Draft items and privately review 1,394 Telegram candidates; rights-holder permission is needed for copying original channel texts.
6. **P1 exact 50/120 exam constraint checks:** at least 20 audited feasible assemblies and 1,000+ deterministic/random invariant checks, refresh/timeout/submit and answer-key secrecy.
7. **P1 release operational readiness:** separate staging DB, independent migrations, accessibility, production-like load and rollback/restore test evidence, closed beta.
8. **Release remains blocked:** wait for user to authorize production.

**Repeatable query:** `supabase/audits/20261016_readonly_release_coverage.sql` is SELECT-only and is intended for diagnostic use. It never repairs database content implicitly.
