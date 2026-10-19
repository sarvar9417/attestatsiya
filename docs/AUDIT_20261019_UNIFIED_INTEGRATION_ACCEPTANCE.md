# TASK-245 — Unmerged audit integration & production read-only acceptance (2026-10-19)

**Status:** integration prepared; **NOT RELEASED**. Draft PR #193. No main merge, deploy, real production migration, bulk publish, answer-key extraction, account impersonation or user-attempt mutations.

## 1. Snapshot and overlap decisions

- Integration base SHA `03198c3` (before deployment-control changes); main advanced to `11d9f10` while the audit was running. Review newer main commits before eventual release; current draft branch is not a deployment target.
- #186: authoritative publication/auth/offline/session protection; retained.
- #170: only previously missing non-empty Bearer parser and AXB 19 unique chapter strict count contract + tests retained; older conflicting offline and ExamRunner implementations excluded.
- #165: strict 20-question SQL generator/preflight parity and rollback-only DB regression retained; older TopicView/BookReader/main-route versions excluded since #181/#182/main and #186 already contain newer safeguards.
- #187: race-guarded AXB catalog, exam result and review route responses and tests retained.
- Source PRs remain unchanged Draft; **do not merge them independently into this integration without conflict review**.

## 2. Production evidence — SELECT only, `plyqezulrfowyblsfpzy`

As-of 2026-10-19, production Supabase has 16 published modules, 98 published lessons; published questions 3,344; review 2,603; archived 737; draft 19. Metadata itself is **not** evidence of semantic correctness.

Per-lesson current `topic_test_preview()` checked across all published lessons. Four M01 lessons are non-assessed reference appendices and are excluded from the 20-question completion requirement.

| Module | Real assessed lessons below configured 20 | Deficit slots across those lessons | Short-count results returned with no failure reason |
|---|---:|---:|---:|
| M03 | 4 | 52 | 4 |
| M06 | 3 | 38 | 2 |
| M08 | 5 | 55 | 4 |
| M09 | 5 | 75 | 5 |
| M10 | 2 | 26 | 2 |
| M11 | 3 | 43 | 3 |
| M12 | 3 | 50 | 1 |
| **Total** | **25** | **339** | **21** |

This is a necessary **pool/count** comparison and not a semantic inspection of 25 lessons or a guarantee that 339 unique new questions are needed. Source-checked review candidates can fill gaps; do not bypass editorial checks. The original database `topic_test_preview` allows 21 of these short topic tests without returning an error; strict count fix included **only in draft SQL migration** and NOT applied to production.

## 3. Official blueprint checks — SELECT only

The active 2026 v1 blueprint is 50 questions / 120 min, quota sum 50, cognitive 8 knowledge / 35 application / 7 reasoning. Professional portion: KS 5, PM.GEN 7, PM.MET 3 = 15. All 15 quota groups have >= their required count of `published` questions with keys. That establishes structural capacity only; it does not prove actual authenticated 50/15 generator execution, Y1/Y2/Y3 mix, uniqueness or validity of every key.

## 4. Production deployment mismatch

Latest inspected `READY target=production` **frontend** Vercel deployment points to `c3b60c3655093343d7530ec8bf2be901520f4ce7` (task 240 GV2 quarantine). During this audit `main` reached `11d9f10` and the integration branch had further unmerged code. Therefore **production/main/integration parity is not satisfied**. Do not infer production correctness from PR CI. Automatic Vercel deployment controls added to main must remain intact.

## 5. Verification

Draft PR #193 integration CI: https://github.com/sarvar9417/attestatsiya/actions/runs/39201987481 — **quality (including E2E smoke), backend, database all PASS**, commit `ecab5d56c6b9ee84f778c9543278e97204202ba4`. Initial typecheck failure (AXB catalog schema not exported to its new regression test) was fixed before this green run. CI includes fresh DB migration testing and a synthetic browser smoke, not a production-login test.

## 6. Release blockers and next handoff

1. 25 assessed lessons have 339 missing configured-test slots; review candidate → correct source, answer, originality, construct, format, visual assets, independent editorial evidence → release only with separate owner authorization.
2. Authenticated end-to-end sessions for 16 modules, 19 AXB practice chapters, 15 professional/50 official tests, Y1/Y2/Y3, mobile scrolling, history, retry, timer, account switching and Admin RLS not fully verified in production.
3. Rebase/reconcile current `main` and inspect other active QA PR dependencies; do not clobber ongoing modifications.
4. Formal approval, controlled migration, staged release and production SHA smoke are **still absent**.

**Decision:** draft integration is technically validated by CI, but not ready for unattended publication/merge/deploy.
