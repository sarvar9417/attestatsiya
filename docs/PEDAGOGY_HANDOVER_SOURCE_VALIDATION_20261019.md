# Pedagogika — handover and source-validation gate (2026-10-19)

This is an audit/handover record only. No publication, DB mutation, or deployment is authorized by this document.

## Verified GitHub baseline

- PR #204 (TASK-247) was merged on 2026-10-19. It reports M14.01–M14.07 fallback alignment; M15.01–M15.08 source notes; a **59 PDF + 5 DOCX** extracted-corpus inventory; PII quarantine and **24 Vitest regression cases**. It explicitly says page-level source mapping and full answer-key audit remain.
- PR #149 (TASK-212) was merged on 2026-10-18. Its release record reports **450 published** KS/PM.GEN/PM.MET questions, **118** legacy Y1 replacements, and **75** published Y1 correct options still uniquely longest by a small margin. These are recorded historical release counts, **not independently re-audited live totals**.
- PR #127 (P0) was merged on 2026-10-18; its contemporaneous read-only production snapshot reported 424 published, before the later TASK-212 release. Do not treat its old count as the current total.
- PR #125 remains OPEN/unmerged as checked on 2026-10-19. Its 94 M15 Y1 questions are marked REVIEW, and its description requires legitimate review approvals before publication. TASK-203 parity documentation indicates some M15 material was incorporated separately through PR #121. **Do not bulk-merge PR #125 or replay its staging scripts without a fresh comparison to current main and production.**

## Blocking work, ordered

1. **Source-of-truth matrix**: enumerate each current M14–M16 canonical objective/lesson; map to the correct edition, book, chapter, exact page(s), evidence passage and provenance status. Mark any unsupported or conflicting statement for revision; no fabricated page references.
2. **Current production read-only baseline**: count published/review/archived by module, topic and Y1/Y2/Y3; check immutable revisions, source evidence and UI availability. Separate a live observed fact from an older PR claim.
3. **Answer-key audit**: verify question semantics, correct key, rationale and all distractors against first-party specification and cited books. Quarantine ambiguous or contradicted items; no silent changes to published revisions.
4. **M15 topic-test gaps**: recompute each topic's 20-keyed-item requirement against *current* production. Deduplicate PR #125's 94 REVIEW candidates against published content; preserve editorial gates.
5. **Quality and security**: examine length cues (including historical 75), Y2/Y3 validity, duplicate stems, accessibility, mobile overflow and answer leakage. Run lint/typecheck/unit/build and targeted E2E on exact commit.
6. **Integration gate**: compare branch against latest main; record CI SHA and rollback strategy. Do not perform production writes or deploy from an audit-only handover.

## Review evidence template

| Module/topic | Canonical objective | Book/edition/page | Existing theory claim or question ID | Finding | Proposed fix | Review status |
|---|---|---|---|---|---|---|
| Pending source-by-source inspection | | | | Not yet verified | | HOLD |

**Non-goals:** this document does not certify textbook accuracy, does not claim that every PDF has been inspected, and does not approve answer keys or activate staging questions.

## Evidence links

- https://github.com/sarvar9417/attestatsiya/pull/204
- https://github.com/sarvar9417/attestatsiya/pull/149
- https://github.com/sarvar9417/attestatsiya/pull/127
- https://github.com/sarvar9417/attestatsiya/pull/125
- `docs/TASK203_PEDAGOGY_OWNER_APPROVAL_PARITY.md`
