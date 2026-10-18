# TASK-237 / TASK-238 — Isolated staging acceptance and release gates

## Verified state

- PR #168 and PR #172 merged into main; fresh SQL, backend and Playwright CI completed successfully.
- TASK-230 through TASK-234 SQL migrations are in GitHub only. Earlier TASK-210 two migrations were applied to production Supabase.
- Production Vercel currently still serves an old commit: do not claim the new custom builder UI is live.
- Supabase development branches list is empty. The create-branch action requires an explicit paid compute cost confirmation, and none has been obtained.

## Isolation and cost policy

1. Obtain actual price for Supabase branch and show user the hourly cost. Require explicit cost approval before creating a paid staging branch.
2. Use synthetic test users/questions only. Do not copy production user data or touch the Cambridge database.
3. Apply all repository migrations only in staging, including TASK-230–234; never apply them directly in production for tests.
4. Verify Vercel preview env points to isolated staging Supabase before sending an authenticated request; READY preview alone does not prove this.

## Acceptance scenarios

| Test | Expected |
|---|---|
| Cross-module and construct selection | Only published active/mapped construct pool; exact quotas |
| Invalid construct, insufficient pool, invalid formats | Fail closed; no attempt created |
| Y1/Y2/Y3 exact mix and repeated start | Exactly requested items, one active exam |
| Exam/diagnostic feedback before finish | No answer keys, correctness or explanations |
| Learning mode submitted item | Feedback only for answered item |
| Network disconnect, refresh and re-login | Resume same active exam with saved answers and server timer |
| Other user guesses exam ID | No session or finished/unfinished analytics disclosed |
| Finish and review | Correct per-topic, A–E and Y1/Y2/Y3 analysis |
| Saved presets and RLS, 30 limit | Owner isolation; duplicate and overflow rejected |
| Admin pool access from learner token | Forbidden; no answer keys |
| 390px mobile, keyboard accordion, scroll and back | Functional navigation |
| Existing mock 50 questions/120 minutes and professional 15 | Behavior not changed |

## Release steps

- TASK-237 remains BLOCKED until an isolated staging resource is approved and configured; GitHub CI is not a substitute for authenticated staging acceptance.
- TASK-238 requires separate explicit owner approval, pre-release backup/rollback planning, new migrations applied in timestamp order, and Vercel READY production alias smoke.
- Never auto-publish review-only question banks; preserve published question revisions and official exam scoring.
