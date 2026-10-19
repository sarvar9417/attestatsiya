# TASK-282 — Configured 20/20 topic tests fail closed even on stale adaptive production RPC

Date: 2026-10-19. Owner requested deficit repairs and code merge. **No source/answer-key fabrication, no exam history edits, no production deploy/SQL in this pull request.**

## Verified live defect after owner-authorized 70-question publication

Production `topic_test_preview()` returned `reason=null` and `question_count=6` for **four published canonical 20-item lessons**:
- M06 / `masala-algoritmini-tuzish`: **6/20**
- M08 / `javascript-sintaksis-asoslari`: **6/20**
- M12 / `arxitektura-va-topologiyalar`: **6/20**
- M12 / `internetdan-xavfsiz-va-maqsadli-foydalanish`: **6/20**

M11 `html-matn-rasm-royxat` remained **14/20** with `reason=null`. M09 Access had 26 eligible questions with configured 20.

Existing backend function `withAdaptiveTopicCount()` used old preview `question_count` to lower configured `required`, and could treat a partial result as ready. `examService.start()` invoked `generate_topic_test()` without strict server-side preflight, allowing a direct API call to bypass the lesson UI.

## Fix now in this PR

- `reconcileStrictTopicPreview()` preserves the configured count from the published lesson/strict preflight. **Both** service baseline and legacy RPC must have at least the entire configured size, with exactly configured `question_count`, matching duration and no blueprint gaps. Any mismatch blocks the CTA with `pool_insufficient`. Never count review items.
- `examService.start('mavzu')` verifies authoritative preflight **before** calling mutating generate RPC, returning 409 rather than generating an underfilled exam. Also rejects a stale partial response if the RPC somehow returns fewer than configured.
- Unit regression covers 6/20, stale reason=null, objective gaps, malformed responses, ready 20/20 and partial RPC result.
- Existing `supabase/migrations/20261019190000_exact_topic_test_count.sql` (already in main) is still the **necessary atomic database-side fix** for direct Supabase authenticated RPC callers. Last checked it had **not** been applied to production. This PR is **backend protection until that separate SQL release**. A post-RPC response check cannot roll back a legacy RPC-created exam row; the migration is essential for 100% complete protection.

## Editorial backlog (not automatically correctable by code)

After owner-authorized publication of 70 eligible items, live source-count snapshot had 3,414 `published`, 2,549 `review` questions; 542 KTD items lack their dedicated independent reviewer records and 2,007 review items originate from non-published lessons. The 56 privately authored P0 candidates and M11's 13 drafts require real answer/source/distractor validation and controlled staging, not blanket publication.

A read-only count of *published and keyed* active-construct pool slots shows **24 deficient assessed lessons with 275 missing lesson slots**; previous 25/339 was before the 70-item publication. These counts are **per-lesson gaps**, not necessarily 275 unique new questions. No reviewer signatures, source records, or new content are fabricated by this PR.

## Release gates

1. Run backend TS/unit tests, frontend typecheck/build/E2E smoke, fresh DB migrations + SQL regressions on exact final head, all green.
2. Code merge into protected `main` after required `quality` check.
3. Separately authorize production deployment of **existing** strict SQL migration and backend, then test as authenticated learner + direct RPC. Backend merge alone does not change production behavior.
4. Resume source-verified question-bank enrichment to fill 275 lesson slots; never silently move review questions into published without required editorial protocol, and do not alter prior learner attempts.

Status: CODE FIX / NO PRODUCTION MIGRATION OR DEPLOY / EDITORIAL BACKLOG OPEN.
