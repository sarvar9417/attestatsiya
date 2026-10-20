# TASK-356 — Supabase migration history reconciliation (2026-10-20)

## Goal and safety constraints
Reconcile `sarvar9417/attestatsiya` migration versions with production Supabase
`attestatsiya100%` (`plyqezulrfowyblsfpzy`) without rerunning already-applied SQL,
modifying public tables, deleting migration history, or marking unproven work as applied.

**Do not run unrestricted `supabase db push` while the outstanding audit blockers below remain.**

## Evidence and completed live reconciliation
- Baseline: 207 GitHub SQL migration files, 265 production migration history records;
  only 29 GitHub filenames had matching remote versions before TASK-356.
- Remote history stores `statements[1]` for most modern migrations. For each changed
  history record we computed the exact Git blob SHA-1 from those UTF-8 SQL bytes:
  `sha1("blob " + byteLength + "\\0" + SQL bytes)`, and compared that to the
  GitHub file blob SHA before touching the version.
- A guarded transaction changed **65** uniquely named, valid-time, byte-identical
  history versions with their original migration names preserved.
- A second guarded transaction changed **26** records where the SQL bytes were
  identical but the connector had stored a different migration name and version.
- Earlier guarded 12-record reconciliation and a partial connector attempt also
  updated other exact matches; the final remote/local comparison after these actions
  showed **147/207 local file versions matched** (118 more than the 29 baseline).
- TASK-347 and TASK-348 were separately corrected earlier to
  `20261021001500` and `20261021002500`.
- All changes above are **migration-history metadata only**, not migration SQL
  execution, data updates, or DDL. Guard conditions abort the entire transaction on
  SHA mismatch, ambiguous match, or version collisions.

## Repository preflight repair (this PR)
- Preserve every existing SQL file body exactly; rename 12 duplicate migration
  timestamp filenames by adding one second to the later lexicographic filename.
- Normalize 12 filenames containing invalid UTC minute fields into unique valid
  timestamps strictly between their adjacent migration versions; preserve their
  original lexicographic replay ordering.
- `scripts/check_migration_versions.mjs` rejects duplicate versions, malformed
  filenames, nonexistent calendar dates, hours/minutes/seconds. Node unit tests
  cover happy path, duplicate, invalid time and malformed names.
- Integrate preflight into the database GitHub Actions job **before** fresh
  migration replay.

## Remaining blockers (must be verified, not guessed)
As of the 2026-10-20 read-only audit **before these renamed files are merged**:
- 60 GitHub filenames still lacked matching remote versions.
- 22 of them had byte-identical SQL in some remote migration history entry, but
  their source filenames had duplicate/invalid versions (this PR repairs filenames).
  Their new versions can be reconciled **after merge** with the same SHA-guarded
  process, rechecking current production state first.
- 38 GitHub files could not be proved applied by exact SQL blob content; they
  include files with no matching name and some same-name but changed contents.
  For each, determine whether it is legitimately unapplied, modified since a
  previous production execution, or equivalent under a reviewed semantic diff.
- 122 remote migration versions were not represented among the 207 GitHub file
  versions. Preserve their historical records until the original SQL or valid
  provenance has been recovered and the replay order verified.
- An arbitrary migration-repair insertion or deletion would fabricate release
  history; do not do it. No `db push` is authorized by this report alone.

## Acceptance and next gates
1. GitHub CI `quality` success after these file renames; fresh SQL replay and
   all SQL regression tests remain green.
2. Merge the validated preflight changes.
3. SHA-verify and reconcile still-mismatched exact-content records against the
   merged filenames, without rerunning migration SQL.
4. Audit the 38 unproven migrations and orphaned remote history records; resolve
   conflicts using a reproducible staging migration chain and checked source.
5. Run a non-destructive linked CLI migration listing / dry run; only then plan
   `db push` with controlled execution of actually pending changes.

## Rollback
The branch changes only historical filenames and CI scripts. Production history
renames must be reversed *only* to their prior versions in a guarded transaction
using recorded mapping; they never reverse previously executed SQL.
