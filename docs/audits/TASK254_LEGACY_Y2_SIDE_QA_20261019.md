# TASK-254 — Immutable legacy Y2 payload compatibility and Y1 option QA

Date: 2026-10-19. Evidence: SELECT-only production Supabase aggregates and existing GitHub migrations/tests.

## Verified storage state versus learner behavior

- **22 published** and **4 review** Y2 matching questions have eight stored options flagged entirely as `side='a'`. Their private protected `pairs` maps are four-to-four: all left IDs refer to order 1–4 and all right IDs to order 5–8.
- This is **historical storage**, not proof that learners see eight left choices. The existing `supabase/migrations/20261018102000_repair_mock_y2_options_payload.sql` implements `exam_payload()` read-time recovery using confidential mappings without altering the published record. Its regression `supabase/tests/mock_y2_option_projection.test.sql` tests one representative question and key non-disclosure.
- **Published revisions are immutable.** An early attempt to add an options-side UPDATE migration failed fresh CI with `PEDAGOGY_PUBLISHED_REVISION_IMMUTABLE`. This is an intentional, correct protection. The mutation migration was **removed from this PR before release**. Never disable this trigger, bypass editorial approval, or modify immutable published options.
- An independent, wider test `supabase/tests/task254_y2_side_integrity.test.sql` now builds a transaction-local exam from **all** legacy published Y2 in the fresh seed. It verifies each resulting learner payload is 4-left/4-right, contains no exposed answer keys, and that original persisted data stays unchanged. It also blocks any accidentally published Y1 with duplicate alternatives.
- The four historical `review` Y2 records remain staged; they require any further corrective **new review revision** in the existing editorial pipeline, not in-place published mutation.

## Separate editorial blocker: review Y1 distractor collisions

- 2,603 `review` questions: 1,973 Y1, 315 Y2, 315 Y3 at the observed snapshot; 19 `review` Y1 in group `S4.CODE` repeat at least one normalized answer option.
- No `review` question had a `question_editorial_checks` record in the inspected snapshot.
- **Escalated high-priority correctness issue:** all 19 duplicate-choice Y1 records include their currently keyed correct option among the duplicate-text alternatives; students could see two indistinguishable answers. That is 23 redundant option slots across nine PYJS V2 lessons (J01/J02/J03/J05, P01–P05). A human source-verified editor must fix the answer ambiguity in new review revisions before any publication; automatic deduplication or guessed keys is unacceptable. They remain unpublished.
- All detected review Y1/Y2/Y3 had stored keys, nonempty stems and sources, active constructs, matching group and valid difficulty ranges in the checked sample-wide aggregate. These structural checks are **not** semantic correctness signoff.

## All-question private-key reference integrity — full read-only scan

Verified production aggregate (2026-10-19), without selecting or exposing any key payload value:

| Status | Y1 | Y2 | Y3 | Invalid referenced option IDs |
|---|---:|---:|---:|---:|
| Published | 2,810 | 270 | 264 | 0 |
| Review | 1,973 | 315 | 315 | 0 |
| **Total** | **4,783** | **585** | **579** | **0 / 5,947** |

Y1 validation: protected correct-option ID exists among that question's alternatives. Y3 validation: the private ordering array contains every option ID once and only once. Y2 validation: either complete left→right mapping through stored a/b sides or the guarded, proven legacy 8-a → 4+4 projection (22 published and four review). **All 585 Y2 maps were structurally resolvable:** 248+311 normal and 22+4 legacy.

Source references, academic answer correctness, distractor plausibility, official 2026 objectives and genuinely independent editorial sign-offs require separate human-source review. The 19 review Y1 duplicate-choice items remain blocked; **none of the published Y1** showed duplicate alternative text in this normalized comparison.

## Acceptance status and release controls

1. Fresh CI: database, backend, quality/Playwright E2E smoke must pass on the final head. The additional test must cover the full seeded legacy published Y2 set, not just one item.
2. Owner/editorial validation of Y2 behavior in a real authenticated learner test (start, 4+4 matching, submit, review, history, mobile) still required. Fresh CI E2E smoke is not that test.
3. Source and distractor correction for 19 review Y1, separate authenticated approval and controlled review revision.
4. **No production write, no migration, no publication, no deploy** from this PR. The relevant compatibility fix already exists in GitHub; production deployment parity must be assessed separately.

Status: DRAFT / NON-MUTATING REGRESSION / EDITORIAL PENDING.
