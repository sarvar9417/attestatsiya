# TASK-230–218: Non-production completion / QA handoff

**Status 2026-10-18:** PR #168 va #172 main'ga merge; TASK-230–236 tests and CI passed. Five new migrations have not been deployed to production. Staging and production acceptance remain open.

## Bosqich va qabul mezonlari

| Task | Ishlar | Tekshiruv |
|---|---|---|
| 211 | Nomlash, yaratish, o‘zgartirish, yuklash, o‘chirish va 30 ta RLS preset | Main’da allaqachon mavjud, old PR #159 takroriy |
| 213 | Modullar → mavzular → konstruktlar, optional construct_id, preflight/selector fail-closed | Invalid / unrelated construct reject, two modules in Playwright |
| 214 | Mavzu, qiyinchilik, format bo‘yicha foiz va answered/correct aggregation | Finished-only, owner-only, no keys, exact counts SQL |
| 215 | Active attempt server restore, submitted answers and navigation, same-config idempotent POST start | Saved answers, no duplicate exam, expired/finished not resumed |
| 216 | Learning-only explanation post-submit; other modes remain protected; equal quotas | SQL mode guard, Vitest exact total and E2E suggestion |
| 217 | Authenticated staff query → service-role only aggregated published question pool | No client key, admin guards and SQL privileges |
| 218 | P0–P2 regression: fresh DB, backend typecheck/unit, root lint/unit/build, Playwright | All checks green, branch review; no prod acceptance claimed |

## Boundary

- DB migrations are **new** and additive/replacement safe RPCs; never rewrite an earlier applied migration.
- All list/preflight/start/analytics/session access authenticated; attempted owner is checked DB-side.
- `get_review` and exam correctness remain secret until finish except submitted learning item.
- A–E / format quotas never silently relaxed. Auto suggestion is explicit and user-visible.
- Daily/weekly existing official mock 50/120 generator and pedagogy professional 5+7+3 unchanged.
- No production database write, Vercel deployment, main merge or review-only question publication in this task.
- Existing published revisions and `exam_items` untouched; no destructive data migration.
- Required follow-up: independent reviewer approval of PR and staging smoke with real authenticated learner/admin roles; later controlled production release after explicit owner approval.

## Current release gates

PR #168 and #172 are merged; staging remains blocked on user-approved paid Supabase branch and isolated test accounts. See docs/TASK237_CUSTOM_BUILDER_STAGING_ACCEPTANCE.md. Main merge does not imply production migration or Vercel deployment.
