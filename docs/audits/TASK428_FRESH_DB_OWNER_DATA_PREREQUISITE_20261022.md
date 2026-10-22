# TASK-428 — Fresh-DB CI vs. production-only pre-staged data (2026-10-22)

## Trigger and confirmed cause

PR #532 ran frontend, backend, and database CI on 2026-10-22. Frontend (including all 10 new `M08Y3ReviewPreflight` tests) and backend passed, but the complete fresh database replay failed in `supabase/migrations/20261022031000_task428_pedguli_verified_batch02.sql` at its **unaltered** `TASK428_PINNED_REVIEW_CHANGED` guard.

The migration is **not** a self-contained fresh-database migration. Besides its batch of 22 source-derived questions, it explicitly depends on two previously manually staged `review` questions (`telegram:@PedMahoratGuli:2447` and `telegram:@PedMahoratGuli:11756`), with exact content fingerprints. A clean CI database has no corresponding private, owner-reviewed source rows. The code itself describes this precondition; passing fresh CI by weakening/removing the fingerprint guard would mask a real editorial provenance gap.

### Production source-record read-only verification

An independent read-only linked production query confirmed:

- Both original pinned source references are present and **published** (their expected original prepublication `review` status is no longer valid).
- The migration's exact 22 message-ID/source-reference pairs exist with **22/22** source questions and **22/22** question keys.
- **22/22** have matching owner-release waiver records.
- Of those 22 originals, **18 are currently published** and **4 are now archived** after later immutable revisions. This is not a count deficit.
- Zero question-bank content, answer keys, release waivers, or exam attempts were modified during this verification.
- The currently published fingerprints are not interchangeable with the migration's *pre-edit*, *pre-release* fingerprints. Their difference is expected where the migration deliberately length-balances an option and later publishes the question.

**Limit:** production-state verification is distinct from a replay in a fresh DB. It does not prove that the private source items can be reconstructed or independently re-authored from public Git; it proves that the batch was materialized and independently preserves the source objects/key/waiver structure now.

## CI change

The current workflow already intentionally exempts production-only editorial release migrations from its fresh-schema replay; those require live private records, owner identities and exact source fingerprints. Add only the exact known `TASK428` migration path to that explicit exemption list. The workflow additionally checks for both strict source-fingerprint and 24-question-release guard markers **before** allowing the skip. Any change to those markers fails CI rather than silently relaxing the check.

- The production migration file, its `TASK428_PINNED_REVIEW_CHANGED` preflight, answer-key/quality gates and historical data **are not changed**.
- No new data, test questions, source keys or private content are put into the public repository.
- Fresh CI still runs all other active non-exempt migrations and tests. It **does not** pretend to have replayed the exempt production-only releases.
- Keep production-specific editorial publication verification separate from schema replay: it must be performed against an authorized target environment where the actual source records are available.

## Traceability

- User-requested M08 Y3 review preflight: PR #532.
- Deterministic fresh database blocker: issue #535, GitHub Actions run `39716531908`.
- Production-only editorial release: `20261022031000_task428_pedguli_verified_batch02.sql`.

**No human expert endorsement is implied.** The owner delegated AI review; the private source content remains subject to the previously established editorial and authorisation policies.
