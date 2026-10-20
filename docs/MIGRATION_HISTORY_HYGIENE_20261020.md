# Migration history hygiene — 2026-10-20

## Scope and source of evidence
- Production: Supabase `attestatsiya100%` (`plyqezulrfowyblsfpzy`).
- Repository: `sarvar9417/attestatsiya`, snapshot `main` `afa79624f71670b8a2252b680b9a5f44b6708ecc`.
- Source comparison: GitHub **Git blob SHA-1** of each SQL file against Git object SHA-1 computed directly from **stored executed SQL** (`supabase_migrations.schema_migrations.statements[1]`), including exact/no-final-newline cases. SHA matching is stronger than matching migration names, timestamps, or sizes.
- No production SQL migration was rerun and no user-facing tables or content were modified.

## Completed in GitHub
- **29 migration files initially renamed, SQL blobs untouched.** All **26** have exact production SQL matches. **20** retain production version IDs. The remaining **six** (TASK-202 distractor drafts 07–12) were moved again to valid **dependency-safe** timestamps after drafts 01–06; production migration-history version IDs for those six must be updated atomically to match the new GitHub filenames after CI green and merge. Some filenames use historical alias names; those aliases were verified by SQL byte hash.
- The other **3** filenames had invalid or conflicting version prefixes without a verified production equivalent, so only local names changed:
  - `20261012106000_professional_120_canonical_lesson_links.sql` → `20261012105900_professional_120_canonical_lesson_links.sql`
  - `20261012107000_pedguli_editorial_review_gate.sql` → `20261012105901_pedguli_editorial_review_gate.sql`
  - `20261018131000_topic_test_preflight.sql` → `20261018131001_topic_test_preflight.sql`
- Added `scripts/check_migration_filenames.py`; database CI now rejects duplicate 14-digit versions and malformed timestamps.

## Dependency-order correction
A fresh-database CI run found that `pedagogy_rewrite_proposals` is created in TASK-202 draft 01, but drafts 07–12 had been renamed to versions sorting before draft 01. Renamed them to `20261018115100`–`20261018115600` so draft 01–06 run first. Do not merge before fresh DB CI passes. Do not mark the six new versions applied in production until their existing previous applied versions (`20261018044955`, `20261018045000`, `20261018045012`, `20261018045017`, `20261018045022`, `20261018045027`) are atomically updated, with exact content verified and zero target-version collisions.

## Post-rename read-only inventory
| Metric | Value |
|---|---:|
| GitHub migration SQL files | 214 |
| Production migration history rows | 272 |
| GitHub files with a matching production version | 176 |
| GitHub files with **no matching production version** | 38 |
| Of these, same migration name but changed SQL content | 9 |
| Of these, neither matching version nor matching name | 29 |
| Production versions not represented by a GitHub filename | 96 |
| Duplicate GitHub version prefixes | 0 |
| Malformed GitHub timestamps | 0 |

Note: 5 GitHub files now match an existing production version **by identical SQL blob** despite legacy production history using a different migration *name*. This is safe for version-based replay skipping but should be retained as an explicit alias in any future human audit.

### The nine same-name, different-SQL files (not marked applied)
1. `20261016105000_restore_m02_m05_source_lessons.sql`
2. `20261016210000_task200_balanced_pedagogy_review_batch.sql`
3. `20261018195000_task204_m06_algo_v2_rfc_uuid_rekey.sql`
4. `20261019032000_task240_graphics_web_v2_quarantine.sql`
5. `20261020100500_task207_algorithm_style_audit_snapshot.sql`
6. `20261020101500_task207_original_attest_style_examples.sql`
7. `20261020200000_task346_numeric_qa_staging.sql`
8. `20261020203000_task332_algo_v4_six_owner_waiver_publish.sql`
9. `20261020220000_task346_access_source_defects.sql`

## Release / `db push` safety
**Do not run unrestricted `supabase db push`**. Filename uniqueness is restored, but 38 locally missing versions and 96 remote-only versions remain. Some missing local migrations are genuinely unapplied or modified. Never mark these as applied solely because a similarly named migration exists; never blindly replay them. They require an owner-reviewed migration-by-migration SQL semantic comparison, production preflight, and targeted fix-forward release where necessary. Also run an actual linked CLI `supabase db push --dry-run` before any future push, without applying its proposals automatically.

This task is additive documentation and filename hygiene; it is **not** a production release of unmatched migrations.
