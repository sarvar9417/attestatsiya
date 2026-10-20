# TASK — Supabase migration history alignment (2026-10-20)

## Evidence and safety model
- Production: Supabase `attestatsiya100%` (`plyqezulrfowyblsfpzy`).
- Source: GitHub `sarvar9417/attestatsiya`, originally `main` commit `afa79624f71670b8a2252b680b9a5f44b6708ecc`.
- Exact applied SQL proof: compute Git Blob SHA-1 from the `supabase_migrations.schema_migrations.statements[1]` recorded SQL (including the no-trailing-newline case) and compare to GitHub SQL file blob SHA. Never use filename matching alone to declare an unapplied migration applied.

## Changes in PR #360
- **25 GitHub migration filenames normalized**. No SQL text changed (Git blob SHA and relative lexicographic execution order of all 214 files are exactly the same as before).
- All duplicated 14-digit versions (12 previously) and invalid HHMMSS timestamps (12 previously) eliminated.
- `scripts/check_migration_filenames.py` added to database CI to reject invalid and duplicated migration IDs going forward.
- Private audit inventory `docs/MIGRATION_HISTORY_PENDING_20261020.json` (filenames and migration versions only, no sensitive SQL).
- **26 already-applied production migration records require a single transaction to update just their history version IDs to this dependency-preserving filename order**. Exact SQL SHA was confirmed in production for all 26; none of the 26 target versions currently conflicts with a production history row. Do not replay application SQL.
- Caution: initially renaming files directly to older production versions broke a fresh DB build (TASK-202 drafts 07–12 required drafts 01–06; TASK-204 balance required questions imported first). Current filenames instead **preserve the original known-working ordering** and use unique, valid timestamps.

## Remaining independently evaluated blockers
| Category | Expected after 26-row history repair |
|---|---:|
| GitHub SQL files | 214 |
| Production migration records | 272 |
| File versions matching production history | 176 |
| Local versions not recorded on production | 38 |
| Local name present on production but SQL materially differs | 9 |
| Local neither name nor version recorded | 29 |
| Remote version without GitHub migration file | 96 |
| Local duplicate or invalid timestamp | 0 |

The 38 unmatched local entries are itemized in `docs/MIGRATION_HISTORY_PENDING_20261020.json`. No unverified migration is marked applied or executed.

### Nine same-name changed-SQL migrations — NOT presumed applied
- `restore_m02_m05_source_lessons`
- `task200_balanced_pedagogy_review_batch`
- `task204_m06_algo_v2_rfc_uuid_rekey`
- `task240_graphics_web_v2_quarantine`
- `task207_algorithm_style_audit_snapshot`
- `task207_original_attest_style_examples`
- `task346_numeric_qa_staging`
- `task332_algo_v4_six_owner_waiver_publish`
- `task346_access_source_defects`

## Block on arbitrary production pushes
**Do not run unrestricted `supabase db push` yet.** 38 non-matching local and 96 remote-only versions must receive separate SQL-semantic and release-order review; a dry-run should be performed using a linked Supabase CLI. Missing local versions must never be marked `applied` merely because they have similar names; remote-only migrations must never be deleted simply for cosmetic alignment. This PR changes only SQL filenames, a static CI validator, and audit documentation, not application SQL.
