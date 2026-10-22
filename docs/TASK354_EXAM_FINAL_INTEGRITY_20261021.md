# TASK-354 — exam integrity: final-only evidence, strict topic count, restricted batch

- Production audit 2026-10-21 found mutable Y1/Y2/Y3 sessions saving provisional mastery evidence on first answer.
- New revisioned non-mock attempts use `selection_meta.mastery_policy=final-only-v2`, established only on first answered item. Both SM-2 and evidence counters are applied once from the final answer in the exam-row locked `finish_exam` call. Legacy in-progress/no-revision sessions keep old first-write behavior to avoid a double count. Mutable mock uses existing finalized SM-2 and now defers evidence too.
- `finish_exam_batch` is legacy-only and unsafe for learner access: it writes late answers without a deadline check. Revoke its direct RPC execution from PUBLIC/anon/authenticated. Authorized backend continues to use `finish_exam` after queued answers flush.
- `generate_topic_test` refuses underfilled configured exams; existing preflight semantics already refuse shortage.
- New rollback-only SQL integration regression covers two revisions, a stale edit, first/final evidence, idempotent finish, and legacy behavior; existing `adaptive_topic_test_pool.test.sql` covers shortage.

## Release order and rollback
Apply this migration only after fresh DB CI passes, test on an authenticated staging account, then verify production SQL signature. Avoid migrating old history or rewriting scores. Rollback via a forward-fix migration restoring the previous four function definitions and previous batch grants, after assessing affected open attempts. The SQL contains no destructive data migration.

## Compatibility exception / verification
An exam that already recorded first-answer evidence before this rollout deliberately retains legacy mastery counts. Editing an old open attempt can therefore leave historical first-answer learning statistics intact even if its final test score changes. A backfill/rebuild of mastery history requires a separately reviewed design; no destructive historic recalculation is attempted here. Newly created revisioned attempts use final-only policy, preventing further divergence.
