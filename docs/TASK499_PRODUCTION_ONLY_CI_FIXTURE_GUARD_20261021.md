# TASK-499: clean-schema CI and exact production-only content migrations (2026-10-21)

## Evidence-based exception, not a production change
The clean-schema GitHub Actions pipeline attempted `20261021230000_task388_owner_ai_legacy_y2_20_review_release.sql` and failed because the fixture lacks `public.pedagogy_owner_release_waivers`. The file is a previously applied, source-specific release that adjusts a production constraint/publication guard and immutably publishes 20 historic Y2 revisions; it cannot replay against a blank CI fixture. Four directly dependent production-only releases (TASK-389 through TASK-392) also require the production-only source state.

Live production ledger versions and exact MD5 bodies were checked read-only:

| File/task | Production applied version | Exact GitHub + ledger MD5 |
|---|---|---|
| 388 | 20261021151406 | 725ff398e9a438ed19396e933a4835c4 |
| 389 | 20261021151753 | 9432cb232b98418400f313905aed024f |
| 390 | 20261021152000 | 853fab1f996aaa4740e810a94abc87a7 |
| 391 | 20261021152244 | 8eeac72c13d2cb6cba16e58dc2d7151c |
| 392 | 20261021152727 | 9045146c1f448cc8151eef0b47c69f7e |

## Exact modification
Add precisely these five basenames to both existing Office production-only `case` exclusions in `.github/workflows/ci.yml`. This does **not** disable the filename uniqueness validator, schema migrations (TASK-386 is still applied), or other database security/rules tests; the production pipeline/migration ledger remains unchanged.

Regression test `src/tests/task499ProductionOnlyCIFixtureGuard.test.ts` verifies all five exact names appear twice and original production SQL files still hash to the applied bodies. The skip is a known test-fixture coverage limitation, *not proof of general migration portability*. Long-term prefer decoupling production-only data release and reusable schema changes; do not silently claim full schema-chain reproduction of these five releases in CI.

## Scope/release
Task-499: PR and CI only, **no production SQL/app modification**. Unblocks TASK-379 full-bank distractor quality audit PR #498, with review-only publication staging of eight Y1 revisions.
