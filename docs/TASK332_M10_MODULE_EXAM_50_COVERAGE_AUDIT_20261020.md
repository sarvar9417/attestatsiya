# TASK-332 — 50-question module exam UX and M10 verified pool audit

Date: 2026-10-20. Scope: /exam/bolim/:moduleId and live M10 eligibility.
No production deploy, no SQL writes, no content-status promotion.

## Confirmed root cause
- The React exam intro displayed 15 questions / 30 minutes for `bolim`.
- The existing RPC `generate_section_mock(uuid)` actually requests exactly **50** keyed published taxonomy-valid items, duration **6000 seconds (100 minutes)**, and fails closed otherwise.
- This PR updates intro **50 / 100** and adds an ExamPage regression for M10, preserving server-owned item selection and answer protection.
- The module landing screen's `examQuestionCount: 2` refers to its official full-assessment weighting, **not** the 50-question module practice contract; do not change that count.

## M10 live diagnostic (read-only Supabase SELECT, 2026-10-20)
- Module M10 published UUID `1f986cbd-f783-4788-b92f-eb0417dfc1f8`.
- First check: **41** eligible direct published questions (12 graphics types + 22 raster/vector + 7 Paint/Photoshop), below 50.
- During the audit, another update changed the published bank. Recount: **59 eligible keyed/taxonomy-valid questions**, sourced from **3 published lessons** across three S5.WEB constructs: 18 graphics types, 28 raster/vector, 13 Paint/Photoshop.
- **50-item pool threshold is now met**; active blueprint exists. No authenticated live exam was started here; so an end-to-end production session is NOT certified.
- Content tree enumerates **7 static M10 topics**, but live DB has **3 published canonical lessons**, 3 V2 review lessons and 7 archived legacy lessons. The 50-item pool does **not** guarantee seven-topic direct-source coverage; remaining content reconciliation belongs to a separate tracked task.
- The 59 eligible items have **0 `question_editorial_checks` records** marked fully verified (in fact, no editorial check records). **18 newly published AI-authored examples explicitly say `AI_REVIEW_NOT_INDEPENDENT_HUMAN`** in `source_reference`; quantitative pool sufficiency is NOT equivalent to release-level subject-matter approval.
- Historical 380 GV2 review items remain quarantined/review; do not publish them solely to reach a number (see TASK-240).
- Source-based spot checks of newly added content used Adobe Photoshop raster/vector and PSD documentation. Source citation does not replace independent review of each key, distractor, illustration and provenance.

## Cross-module quantitative gate
The read-only query ran successfully against all 16 published modules. 15/16
have at least 50 eligible questions. **M11 / HTML va CSS has 35, a gap of 15**
and its section-mock fails closed until legitimately verified questions become
eligible. Every other module including M10 meets the numeric threshold.
This is a pool-only check; it is NOT a universal independent editorial audit.

## Verification and constraints
- Code regression: `src/tests/ExamPage.test.tsx` checks M10 intro 50 / 100, server gateway invocation and no fallback to full mock.
- Existing DB property test: `supabase/tests/section_mock_50.test.sql` covers 50 unique items, per-topic/critical coverage and boundary pass.
- Run `scripts/sql/TASK332_MODULE_EXAM_POOL_READONLY.sql` against current DB to recalculate module-by-module eligibility; this file performs SELECT only.
- Do not mutate published revisions, bypass human approval, or weaken the 50-item server preflight.
- Acceptance gaps: authenticated runtime start/finish verification, 59-item independent editorial sign-off, and reconciliation of three DB lessons with seven static topics.

Rollback: revert the two UX labels plus their regression; DB schema/data remain unchanged in this PR.
