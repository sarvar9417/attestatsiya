# Attestatsiya mock 500 / custom-tests 503 incident, 2026-10-21

## Verified root causes (remote project plyqezulrfowyblsfpzy)

1. \`group_mock_create('spec',...)\`: PostgREST HTTP 500,
   PostgreSQL SQLSTATE 57014 / statement_timeout (04:05–04:12Z).
   Authentication was already fixed in PR #390. PR #394 (merged) adds
   \`20261021120500_task350_group_mock_bounded_selection.sql\` but it was
   **not yet applied to the remote database** during this read-only audit.
2. \`generate_official_mock()\`: PostgREST HTTP 500 / SQLSTATE 57014
   at 04:15Z. The active v4 selector invokes the full expensive
   \`is_question_official_mock_eligible\` quality gate in four different
   scan sites, including once per selected slot. TASK-351 caches the
   complete eligible question-ID set once per invocation and applies
   the same per-cell constraints, minimizing repeated validation.
3. \`GET /api/custom-tests/presets\`: PostgREST HTTP 404; catalog
   \`public.custom_exam_presets\` is absent in the connected database.
   Existing but unapplied migration:
   \`20261019020000_task210_custom_presets.sql\`.
4. \`GET /api/custom-tests/active\`: PostgREST HTTP 404; the
   \`get_active_custom_exam\` RPC is absent in the connected database.
   Existing but unapplied migration:
   \`20261019025000_task232_custom_exam_resume.sql\`.

No question answers, service keys, sessions or user data are copied into
this report. No production database DDL, deployment or new exam session
was executed as part of this fix.

## Source changes

- \`20261021121500_task351_official_mock_quality_cache.sql\`:
  fail-closed, guarded SQL-source replacement. The same published,
  active-taxonomy, answer-key and quality conditions are preserved
  and the selector still enforces exact 2026 blueprint allocations.
  The function's result stays server-authoritative.
- Backend \`exam.service\`: map SQLSTATE 57014 to explicit
  HTTP 503 \`EXAM_DB_TIMEOUT\`. No raw SQL or answer keys to learners.
- Backend \`official-mock-timeout.test.ts\`: timeout, shortage and
  safe success-path regressions.

## Database release gate (separate from GitHub merge)

**Do not execute a blanket \`supabase db push\`.** There are independent
unreconciled migration-history differences in this project. Apply
only after an approved, separately reviewed database change window:

1. Compare DB migration history with the existing source definitions;
   stage on a disposable or nonproduction database first.
2. Restore missing \`20261019020000_task210_custom_presets.sql\` and
   \`20261019025000_task232_custom_exam_resume.sql\` in dependency order.
   Both need matching migration-history reconciliation.
3. Apply the merged \`20261021120500_task350_group_mock_bounded_selection.sql\`
   to replace the remote slow group-room constructor.
4. Apply \`20261021121500_task351_official_mock_quality_cache.sql\`
   only once source compatibility and security checks pass.
5. Ensure the PostgREST schema cache reflects newly created
   \`custom_exam_presets\` and \`get_active_custom_exam\`.
6. Run \`supabase/tests/official_mock_50.test.sql\`,
   \`supabase/tests/group_mock.test.sql\`,
   \`supabase/tests/group_mock_modes.test.sql\`,
   \`supabase/tests/custom_exam_presets.test.sql\` plus authenticated
   local browser start / submit / finish / reopen acceptance.

## Read-only preflight

\`\`\`sql
select
  to_regclass('public.custom_exam_presets') as presets,
  to_regprocedure('public.get_active_custom_exam(jsonb)') as resume_rpc,
  md5(pg_get_functiondef('public.group_mock_create(text,jsonb)'::regprocedure))
    as group_create_body_md5,
  md5(pg_get_functiondef('public.generate_official_mock()'::regprocedure))
    as official_mock_body_md5;
\`\`\`

The target must still require authenticated users. No answer keys should
appear in the \`/api/exam/start\`, group question, or custom-test
resume payload. Check that each official mock has 50 distinct items,
7200 seconds, 2 points/item and the 8/35/7 cognitive distribution.

## Current limitation

A GitHub merge does not change the user's localhost backend, nor the
remote Supabase schema contacted from localhost. The reported 500/503
responses cannot be considered resolved on the running system until
the approved DB change and local code refresh happen.
