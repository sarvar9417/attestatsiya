# Production release runbook — 2026-10-12

Status: **PREPARED ONLY — DO NOT EXECUTE WITHOUT EXPLICIT FINAL APPROVAL**

This runbook converts the current production drift into an ordered, auditable
release sequence. It is intentionally separate from normal `db push` because
production migration history is not aligned with the repository history.

## Current read-only evidence

The source-backed lesson migrations considered here define **47 deterministic
lesson ID/slug pairs**.

Production collision preflight:

- 7/47 exact ID+slug pairs already exist;
- 40/47 are absent;
- ID collision with a different slug: **0**;
- slug collision with a different ID: **0**.

The seven exact records already present are the M02 hardware/software lessons
and the three M05 numeral-system lessons. The six canonical source lesson
slugs required by the new review bank are all still absent in production.

A second production read-only audit found **62 additional published legacy
lessons** across the canonicalized modules. All 62 have empty `body_mdx`, and
none currently has user progress, exam, or topic-test-attempt references.
Because the learner API lists every published lesson, source-backed lesson
insertion without canonical reconciliation would expose duplicate/empty lessons
to learners.

This makes an ordered reconciliation feasible, but it does **not** authorize a
production write.

## Why a blind db push is forbidden

Repository history contains content migrations that production history does not
record. Some content is nevertheless already present because earlier work was
applied through separate/manual reconciliation paths.

A blind migration-chain push can therefore:

- replay content whose data already exists;
- make migration history harder to audit;
- apply dependent migrations before their intended source lessons are present;
- blur the difference between idempotent reconciliation and a genuinely new
  production change.

Release is therefore performed as deliberate, named steps with a read-only
preflight before and after each phase.

## Ordered release phases

### Phase A — snapshot and preflight

Run only read-only checks first:

1. `supabase/maintenance/20261012_release_preflight_readonly.sql`;
2. record question/source counts and the six target construct counts;
3. verify the five historical demo UUIDs still have no learner/exam/report/stat
   references;
4. verify the 120 unambiguous / 60 ambiguous generated source-link split has not
   changed materially;
5. verify none of the six canonical source lesson slugs already appeared since
   the last audit;
6. verify the 62 non-canonical published lesson baseline: all are still empty
   and none has learner progress/exam/topic-test references;
7. export/retain the platform backup/snapshot available through the normal
   Supabase operational process.

Any unexpected difference stops the release.

### Phase B — free canonical order slots, then reconcile source-backed lessons

Production currently has a unique `(module_id, order_idx)` constraint and legacy
published lessons occupy the low order slots needed by canonical lessons.
Therefore **before replaying any missing source-backed lesson migration**, apply:

`20261012122600_prepare_legacy_lesson_orders.sql`

This guarded migration changes only `order_idx` for non-canonical published
lessons that occupy reserved canonical slots. It does not archive, rename, or
change lesson content, and aborts if learner/exam/topic-test references are
found. Its purpose is only to prevent a unique-key failure during canonical
lesson insertion.

Then apply these content migrations in dependency order, one at a time:

1. `20261009073000_m02_source_backed_lessons.sql`
2. `20261009074500_m03_office_source_backed_lessons.sql`
3. `20261009080000_a3_logic_num_algo_lessons.sql`
4. `20261009083000_a4_programming_lessons.sql`
5. `20261011123000_m10_m11_graphics_web_lessons.sql`
6. `20261011124500_m12_m13_network_security_lessons.sql`
7. `20261011133000_m01_transfer_rate_lesson.sql`
8. `20261011150000_practical_lesson_depth.sql`

Important dependency: practical lesson depth is applied **after** the base
source-backed lessons because it enriches those lesson bodies.

After Phase B, require:

- all six canonical source lesson slugs exist;
- all six are `published`;
- each is mapped to its expected active construct;
- no pre-existing ID/slug was silently rebound to a different lesson.

### Phase C — canonical lesson drift reconciliation

Immediately after the prerequisite source-backed lesson rows exist, apply:

`20261012123000_canonical_lesson_drift_reconcile.sql`

This phase is mandatory before the content release is considered usable. It:

- verifies every canonical lesson is published, non-empty and mapped to the
  expected active construct;
- aborts if a non-canonical published lesson gained user progress, exam or
  topic-test-attempt references after the preflight;
- rebinds questions to the exact canonical lesson for their construct;
- archives the old empty published lesson rows and removes their construct
  mappings;
- never deletes lesson history.

Because learner APIs expose all published module lessons, the Phase B order-slot
preparation + source-backed inserts and Phase C archive/rebind must be executed
in one controlled maintenance window with no long pause between them. If the reference counts differ from the preflight, stop rather
than forcing the archive.

After Phase C, require:

- each affected module exposes only its canonical non-empty published lessons;
- archived legacy rows have no active construct mapping;
- question source lessons match question constructs.

### Phase D — deterministic source-link reconciliation

Only after canonical lessons are reconciled:

1. apply `20261012115500_task063_fresh_source_lesson_forward_fix.sql`;
2. run the safe generated source-link maintenance script only under the release
   guard:
   `supabase/maintenance/20261012_generated_source_lesson_safe_rebind.sql`.

Expected principle:

- bind only exact/unambiguous source lesson matches;
- do not touch the 60 ambiguous generated links;
- do not rewrite answer keys, learner attempts, author, status or source
  claims.

### Phase E — historical source-less demo quarantine

Apply
`supabase/maintenance/20261012_legacy_source_missing_quarantine.sql`
only if the preflight still proves all five known demo records have **zero**
linked learner/exam/report/stat data.

This is archive-only. No delete is allowed.

### Phase F — stage the six-construct review bank

Apply
`20261012120000_spec_zero_construct_review_bank.sql`.

Expected result:

- +36 questions;
- 24 Y1 + 6 Y2 + 6 Y3;
- exactly six items per target construct;
- every item status remains `review`;
- every item has key, explanation, construct, source reference and exact
  canonical source lesson;
- published pool count does not increase from these 36 items.

Publication of these items is a later editorial decision, not part of the data
reconciliation step.

### Phase G — RPC permission hardening

Apply
`20261012122500_anon_rpc_execute_hardening.sql`.

Verify:

- anonymous role cannot execute learner exam/progress SECURITY DEFINER RPCs;
- authenticated role retains intended execution;
- trigger-only functions are not directly executable by clients;
- `auth_role()` remains the documented exception required by the current
  public-content RLS design.

### Phase H — post-write validation

Immediately rerun:

1. read-only release preflight;
2. exact source/key/construct integrity;
3. official mock feasibility and group × cognitive quota audit;
4. repeated mock assembly/invariant tests;
5. Supabase security advisor;
6. application login/session/password recovery smoke tests against the released
   environment.

Stop and investigate if any count or privilege deviates from the expected
contract. In particular, no legacy empty lesson may remain published in the
TASK-064 modules after the canonicalization phase.

## External release gates not solved by SQL

Before calling the release complete:

- real SMTP forgot-password flow must pass end-to-end with a disposable test
  account;
- leaked-password protection in Supabase Auth must be reviewed/enabled;
- the latest application commit must have a current deployable preview or an
  explicitly accepted deployment plan;
- final user authorization is required before any production write or merge.

## Rollback principle

Do not use a broad destructive rollback.

If a phase fails:

- stop at that phase;
- preserve audit evidence;
- revert only the specific newly introduced status/content/permission change
  using an explicitly reviewed compensating migration;
- never delete learner attempts or overwrite source provenance to make metrics
  look clean.

Production is not modified by merely storing this runbook.
