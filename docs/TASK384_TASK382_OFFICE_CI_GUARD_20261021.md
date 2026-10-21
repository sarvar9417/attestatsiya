# TASK-384 — CI fixture does not contain production-specific TASK-382 Office Y3 questions

The TASK-379 bankwide audit CI became blocked on 2026-10-21 by unrelated `20261021221000_task382_office_38_explicit_y3_goals_immutable_revisions.sql`: `TASK-382 source drift for OFF-E01-005`.

TASK-382 is an owner-authorized one-time production content migration requiring 38 precise published Office Y3 question refs. Fresh CI fixture does not seed them. This is independent of TASK-379 quality audit and its 8 Y1 review-only staging SQL.

Do not modify committed migrations. The CI shell migration iteration explicitly skips this one data-specific file in both clean database loops. The actual migration remains unchanged and is applied independently on the real production target. Existing previously merged TASK-381 clean-fixture guard stays in place.

The regression test asserts skip in both loops and verifies the prod source/quality checks remain on disk. All other migrations, seed and database/frontend tests still execute.
