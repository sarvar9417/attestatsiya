# TASK-532 — Source-pinned TASK-428 production data migrations are not clean-schema fixture migrations

## Observed CI blocker
Security question QA PR #530 (merged-tree candidate `5f25b2c...`) failed the otherwise unrelated database job on 2026-10-22. Exact log:
`psql:supabase/migrations/20261022031000_task428_pedguli_verified_batch02.sql:119: ERROR: TASK428_PINNED_REVIEW_CHANGED`

This SQL is **one-time production content release**, not a reproducible seed for an empty, clean CI database. It checks two already-staged REVIEW question fingerprints, whose production UUID/content does not exist in fresh CI. It also adds a batch of source-pinned pedagogy questions and expects existing owner provenance/waivers.

Supabase production migration ledger independently confirms application:
- `20261022030613 task428_pedguli_verified_batch02`
- `20261022030930 task428_pedguli_verified_batch03`
- `20261022031242 task428_pedguli_verified_batch04`
- `20261022031451 task428_pedguli_verified_batch05`

## Safe CI remedy
Both existing fresh-schema migration loops already skip precisely scoped, applied production-only data revisions. Extend that **exact allowlist** to the four TASK-428 batch SQL files above. Never weaken or change their real production source guards, fingerprints, answer keys, authorship metadata, or applied SQL. Other migrations/seed/tests, original 381–401 skip entries, pgTAP/security checks remain active.

The test `src/tests/task532CiTask428Guard.test.ts` asserts all four filenames are skipped in each of the two CI fixture loops and their immutable original SQL remains on disk.

No production Supabase writes, no Vercel deploy, no learner-facing changes. This unblocks independent QA of TASK-531 and other unrelated PRs. Watch for fresh CI red due any other recently applied production-only source-pinned release; do not add skip without independently checking current production ledger and that file's nature.
