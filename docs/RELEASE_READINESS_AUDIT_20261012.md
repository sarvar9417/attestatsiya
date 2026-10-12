# Release readiness audit — 2026-10-12

Status: **DRAFT / NO PRODUCTION WRITE**

This document records the read-only production audit performed against the
Supabase project currently serving the Attestatsiya application and the
integration state of draft PR #106.

## 1. Production question/source baseline

Read-only production snapshot:

| Metric | Count |
|---|---:|
| Published questions | 1650 |
| Review questions | 30 |
| Published Y1 | 1580 |
| Published Y2 | 31 |
| Published Y3 | 39 |
| Published without answer key | 0 |
| Published without source reference | 5 |
| Published without source lesson | 185 |
| Published source-lesson/construct mismatch | 0 |

The 185 missing direct lesson links are still split exactly as previously
audited:

- 5 historical source-less demo questions;
- 180 `generated:%` questions with source fingerprints;
- 120/180 have exactly one published lesson candidate and are safely
  rebindable by the staged maintenance script;
- 60/180 have more than one published lesson candidate and must not be guessed.

The five source-less demo records remain release-gated for archive only after
the learner-reference guard passes. Nothing is deleted.

## 2. Six official constructs still have zero production questions

Current production still has zero questions (published or review) for:

- `S3.LOGIC.01`
- `S3.LOGIC.03`
- `S3.ALGO.03`
- `S4.CODE.04`
- `S6.NET.02`
- `S6.NET.04`

PR #106 stages 36 new items for these constructs: 24 Y1 + 6 Y2 + 6 Y3.
Every new item remains `review`; no auto-publish occurs.

## 3. Source/semantic review of the 36 staged items

The staged questions were checked construct-by-construct against the official
2026 specification and the source-backed lesson/textbook material used by the
project.

Evidence lanes:

- logic and algorithm items: ICT 9-sinf (2020), logic and
  “Masalalarni kompyuterda yechish bosqichlari” material;
- JavaScript items: Cambridge+ 10–11-sinf, chapter 19;
- network architecture/topology: ICT 11-sinf (2021) and Cambridge+ 10–11;
- safe/purposeful internet use: ICT 11-sinf (2021) internet/e-mail safety and
  source reliability material.

A source-alignment issue was found and corrected before release: the first
JavaScript draft used `let/const`, while the selected project source shows
`var`, `console.log()`, `==` and `===`. The staged questions now stay
inside the verified source vocabulary/examples.

This review is a **source/semantic staging review**, not final publication
approval. A second editorial/human approval is still required before changing
the 36 records from `review` to `published`.

## 4. Canonical source lesson binding

The initial gap-bank migration selected an arbitrary published lesson mapped to
the construct. That was too weak because production currently has multiple
legacy lesson candidates for some constructs.

PR #106 now uses an explicit construct → canonical lesson slug contract:

| Construct | Canonical source lesson slug |
|---|---|
| S3.LOGIC.01 | `mantiqiy-mulohazalar` |
| S3.LOGIC.03 | `mantiqiy-xulosa-va-masala` |
| S3.ALGO.03 | `masala-algoritmini-tuzish` |
| S4.CODE.04 | `javascript-sintaksis-asoslari` |
| S6.NET.02 | `arxitektura-va-topologiyalar` |
| S6.NET.04 | `internetdan-xavfsiz-va-maqsadli-foydalanish` |

The migration fails closed if the canonical lesson is absent; the regression
test asserts the exact source slug for every staged item.

## 5. Production migration-history drift — release blocker

Repository migration history and production migration history are not aligned.
A read-only comparison found 11 repository migrations not represented in the
current production history.

Eight pre-existing content migrations are missing from production history:

1. `20261009073000_m02_source_backed_lessons.sql`
2. `20261009074500_m03_office_source_backed_lessons.sql`
3. `20261009080000_a3_logic_num_algo_lessons.sql`
4. `20261009083000_a4_programming_lessons.sql`
5. `20261011123000_m10_m11_graphics_web_lessons.sql`
6. `20261011124500_m12_m13_network_security_lessons.sql`
7. `20261011133000_m01_transfer_rate_lesson.sql`
8. `20261011150000_practical_lesson_depth.sql`

Three additional migrations belong to the current draft PR:

- `20261012115500_task063_fresh_source_lesson_forward_fix.sql`
- `20261012120000_spec_zero_construct_review_bank.sql`
- `20261012122500_anon_rpc_execute_hardening.sql`

**Do not run a blind production `db push` from this branch.** The production
history must be reconciled deliberately first.

A direct read-only slug check shows that current production does not yet contain
**any of the six canonical source-lesson slugs** used by the review-bank contract:
`mantiqiy-mulohazalar`, `mantiqiy-xulosa-va-masala`,
`masala-algoritmini-tuzish`, `javascript-sintaksis-asoslari`,
`arxitektura-va-topologiyalar`, and
`internetdan-xavfsiz-va-maqsadli-foydalanish`.

Therefore the 36-item gap-bank migration is intentionally not
production-applicable until the prerequisite source-backed lesson migrations
have been reconciled and those six canonical mappings exist.

## 6. Supabase security-advisor findings

Read-only security advisor currently reports:

- 12 anonymous-executable `SECURITY DEFINER` functions;
- leaked-password protection disabled;
- 8 RLS-enabled tables with no policy (INFO/default-deny candidates).

PR #106 adds a forward migration that:

- removes historical anonymous execute permission from authenticated-only
  exam/progress RPCs;
- removes direct anon/authenticated execution from trigger-only
  `handle_new_user()` and `capture_mastery_evidence()`;
- preserves authenticated execution for intended learner RPCs;
- intentionally leaves `auth_role()` executable by anon because current
  public-content RLS policies call it.

The leaked-password-protection setting is an external Auth configuration item
and is **not** claimed fixed by this code branch.

Performance-advisor items (unindexed foreign keys, duplicate index, multiple
permissive policies) are recorded as follow-up work; they are not silently
changed in the P0 release lane.

## 7. Vercel / preview status

A prior preview deployment for this branch reached READY on an earlier commit.
The latest PR head has not received a Vercel deployment while the project/account
build-rate gate is active. GitHub Actions remains the authoritative branch CI
for code/database regressions until a current-head preview is available.

## 8. Release gates still required

Before production write or merge:

1. latest PR head GitHub Actions must be green;
2. reconcile production migration history deliberately — no blind db push;
3. ensure the three canonical lesson migrations required by the six gap
   constructs are present before applying the review-bank migration;
4. run the read-only production integrity query again immediately before write;
5. real SMTP recovery E2E must pass with a disposable test account;
6. enable/review Supabase leaked-password protection;
7. obtain explicit final user authorization for production migration/merge;
8. after any write, rerun source/key/construct integrity, exact blueprint
   feasibility and Supabase security advisors.

Production remains untouched by this draft.
