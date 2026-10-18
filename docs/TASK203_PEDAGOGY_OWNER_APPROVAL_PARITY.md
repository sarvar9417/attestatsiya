# TASK-203 — 249 owner-approved pedagogika questions, production-to-Git parity

**Checked:** 2026-10-18. **Scope:** `KS`, `PM.GEN`, `PM.MET`. **Release:** GitHub merge only; no manual Vercel deploy and no additional production writes requested.

## Production source of truth (verified with read-only Supabase audit)

| Metric | Verified |
|---|---:|
| All pedagogical bank rows | 424 |
| Published | **424** |
| Review | **0** |
| New owner-batch signed & published | **249** |
| Previously published (immutable) | 175 |
| New owner-approved Y1 | 231 |
| New owner-approved Y2 | 9 |
| New owner-approved Y3 | 9 |
| New Y1 wrong-option sets rewritten by AI for balance | **82** |
| Total immutable revisions | **424** |
| Mismatching immutable fingerprints | **0** |
| Rejected PDF candidates linked to published items | **0** |

**Approval truth:** The project owner explicitly approved the pending questions through the chat on 2026-10-18. The signer notes state **OWNER BATCH APPROVAL**, not an independent third-party human expert verification. This is an approval provenance distinction, not a claim that all pedagogy content is infallible. The 82 Y1 sets were AI rewritten for shorter/longer option-bias mitigation *after* the owner approved the earlier bank; the notes explicitly disclose this. Existing answer-key IDs, correct answers and attempt history were not changed.

## Repository synchronization (do not auto-run these maintenance scripts)

Production changed through a controlled SQL owner approval workflow in the conversation, **not through a Git migration**. To bring GitHub into auditable parity, six fail-closed `supabase/maintenance/` replay files preserve the exact approved IDs and 82 finalized distractor texts:
1. `task203_redrafted_options_01.sql` — 21 Y1 items
2. `task203_redrafted_options_02.sql` — 21 Y1 items
3. `task203_redrafted_options_03.sql` — 21 Y1 items
4. `task203_redrafted_options_04.sql` — 19 Y1 items
5. `task203_review_y2_side_repair.sql` — nine Y2 review-only side/index fixes
6. `task203_owner_batch_249_replay.sql` — exact 249 owner-approved IDs/source locators with DB guard checks

**Order when replaying on a separately authorized installation:** four option-repair files → Y2 side correction → owner approval release, only if the project owner’s exact same authorized admin profile exists. These are **manual replay scripts**, not automatic migrations. If the owner profile is absent they do not publish anything; on this production database every item is already published, and scripts do not modify published revisions. No redeploy or extra approval is implied by this Git merge.

## Verified tests

- Each of the six SQL files was individually run with its terminating `COMMIT` substituted by `ROLLBACK` against the connected production database: **six dry-run passes**; no data write.
- `supabase/tests/task203_pedagogy_owner_bank_parity.test.sql` ran against production: **PASS**, checking 249 owner signatures, 82 disclosed AI redrafts, option-length and key contract, canonical lesson/construct mapping, immutable fingerprints, and learner-read privileges.
- The same SQL test is safe for clean CI: if account-scoped approvals are absent, no fabricated signatures are seeded or asserted; fresh CI testing of exact production data is not falsely claimed.

## Remaining content/security risks (NOT silently fixed by this merge)

- Previously published legacy Y1 items still have length/wording defects; 118 draft replacement proposals are private and **not published**. The final production audit flagged **144 of all 400 published Y1** on mechanical length thresholds, mostly historical legacy items. Published revisions must not be edited in place.
- Some historically published Y2 items are still improperly represented and need new approved replacement revisions. The 9 *new* Y2 items were repaired before they were published.
- Original third-party PDF answer assertions are not necessarily official. Two historically contradicted answers were quarantined; never resurrect their original wrong keys.
- **PR #127** remains DRAFT: a separate large pedagogy audit/preflight feature with a documented public `POST /api/content/questions/check` answer-leak risk and incomplete coverage checks. Its draft is **NOT** merged as part of this owner-approved bank parity change. **PR #125** similarly remains draft and its M15 material had already been incorporated through PR #121.
- A GitHub merge is not proof of Vercel production readiness. No Vercel deploy is requested by the user in this turn. The previously queued automatic retry of the old SHA was disabled.

## Release verification guard

1. GitHub CI must show database/backend/quality green on the specific PR head SHA.
2. Compare PR with current `main`; abort merge if base drift or conflicts.
3. Merge **once**, only this data-parity PR; do not merge unrelated draft PRs.
4. Read merged PR SHA; do **not** start a Vercel production deployment.
