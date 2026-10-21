# TASK-427 — CI: production-only Office Y3 release migrations (2026-10-21)

## Root cause
Fresh PostgreSQL CI fixtures do not contain production-specific Office question IDs. Existing immutable data releases TASK-381, TASK-382, TASK-383, TASK-385 expect these records and intentionally fail closed (e.g. `TASK-385 source drift OFF-E01-030`). These are not portable seed or schema migrations.

## Evidence and boundary
Read-only production Supabase `supabase_migrations.schema_migrations` audit confirmed that TASK-381 (`20261021144225`), TASK-382 (`20261021144805`), TASK-383 (`20261021145104`), and TASK-385 (`20261021145544`) were applied. Repository filenames differ from original applied ledger versions; that separate history reconciliation is outside this CI task. No production SQL, schema, state, migrations or published content were modified.

## Fix
`.github/workflows/ci.yml`: both fresh database loops explicitly exclude ONLY these four one-time applied data releases. The remainder of migrations, including TASK-386 (Y3 publication schema guard), run normally. Strict filename uniqueness check is intact. `src/tests/CIProductionDataRevisions.test.ts` asserts both guards and preserves the uniqueness checker.

## Release
GitHub main merge only, no Vercel deploy, no Supabase production writes. Downstream TASK-420 (M13 learner navigation) must independently pass required CI before merging.
