# TASK402 / TASK403 — Align Git migration filenames with actual applied Supabase versions

**Date:** 2026-10-22. **Scope:** repository migration-path metadata and GitHub CI only. No production SQL executed and no question/answer keys modified.

## Reproduced clean CI failure

PR #551 ([workflow 39727154197](https://github.com/sarvar9417/attestatsiya/actions/runs/39727154197)) failed the **database** job during `scripts/check_migration_filenames.py` due to two invalid timestamp labels:

- `20261022006000_task402_ten_y1_info_office_security_answer_quality_repairs.sql` — minute `60` is invalid.
- `20261022007000_task403_ten_y1_info_office_security_semantic_balance_repairs.sql` — minute `70` is invalid.

Direct `Supabase.list_migrations` read-only verification on the *intended production project* showed the actual already-recorded migration versions:

| Migration name (unchanged) | Actual Supabase applied version | New Git filename prefix |
| --- | --- | --- |
| `task402_ten_y1_info_office_security_answer_quality_repairs` | `20261022051049` | `20261022051049_` |
| `task403_ten_y1_info_office_security_semantic_balance_repairs` | `20261022051517` | `20261022051517_` |

## Correction

The two existing migration SQL files were copied to the names matching **their actual applied migration-history identifiers** and the invalid-name counterparts were deleted on the same Git branch. Each replacement file's content was verified **byte-for-byte identical** to its source before the change. No SQL statements, source text, options, explanation or answer keys were edited.

Both production-only migration exceptions in `.github/workflows/ci.yml` were updated to the new exact paths; the existing fresh-schema CI distinction remains explicit.

## Guarantees and limitation

- No production schema/data/answer-key change, no migration history rewriting, no archived question deletion, and no resubmission of the two already-applied data migrations.
- Production migration IDs remain unchanged. The corrected Git filenames now match rather than conflict with those IDs.
- The two original migrations are owner-authorized content/data revisions that need live source rows and thus remain explicitly exempted from clean-schema replay. The required editorial logic and fingerprint guards **remain unmodified** in SQL.
- A successful CI run proves the active non-exempt schema/tests replay correctly; it does **not** mean all owner-data-dependent releases replayed on empty CI databases.

This fixes the timestamp validation blocker without inventing migration version numbers or disabling migration filename validation.
