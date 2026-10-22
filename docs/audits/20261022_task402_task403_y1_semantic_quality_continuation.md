# Attestatsiya — TASK-402 / TASK-403 AI question quality audit (2026-10-22)

## Scope, authority and provenance

In continuation of the owner's standing instruction to proceed with quality improvements without asking for a separate permission every batch, 20 live Y1 question versions were replaced with AI-authored scenario stems, four semantically reviewed alternatives, and updated explanations. **The owner delegated AI editorial decisions; no independent human reviewer signed off these questions.** Labels referencing textbook and demo resources on the original question record were preserved for traceability, but the new wording must not be presented as a verbatim 2026 official exam item or verbatim textbook extraction. The review basis was the actual source question and correct answer recorded in Supabase.

| Batch | S1.INFO | S2.OFFICE | S7.SEC | Revisions |
|---|---:|---:|---:|---:|
| TASK-402 | 2 | 4 | 4 | 10 |
| TASK-403 | 4 | 3 | 3 | 10 |
| **Total** | **6** | **7** | **7** | **20** |

TASK-402 includes information processing/analysis and transmission/receipt; Excel Filter/Sort, Column/Line, Pie/Scatter; authorization, sync vs backup, email attachment infection evidence, antivirus quarantine.

TASK-403 includes sign/alphabet/code/decoding; Excel AVERAGE and IF, PowerPoint Slide Master; lookalike phishing domains, safely ending sessions on shared computers, ransomware isolation and recovery.

## Transaction, history and semantic checks

For each of the 20 records, a single atomic migration verified the old published state, active `y1_answer_length_high_risk` finding, exact source reference/group, eligible immutable fingerprint, no prior source revision link, exactly four options, and exact original keyed answer text at its ordinal index.

The release inserted a fresh `questions` row with source linkage, four new option IDs, a remapped keyed option ID and new authored explanation. The original question was archived, not deleted or altered, and its historical attempt records were not rewritten. `question_bank_revisions` records link IDs and provenance with `human_independent_editor=false`. The two batches are tagged `evidence.task='TASK-402'` and `'TASK-403'`.

Each new set has four distinct options; keyed correct term is not strictly longest by word count, and longest/shortest answer length ratio is at most 1.6. Crucially, distractors were not simply padded; scenarios distinguish related technical concepts.

Production postflight confirmed:

| Test | TASK-402 | TASK-403 |
|---|---:|---:|
| Published new and archived old | 10/10 | 10/10 |
| Immutable fingerprint valid | 10/10 | 10/10 |
| Both official/group mock predicates true | 10/10 | 10/10 |
| Newly published high/critical quality findings | 0 | 0 |
| Original exact correct answer changed | 0 | 0 |

The corresponding SQL regression tests also executed successfully in production. These assertions test structural/key fidelity and answer-length balance; they are not a substitute for independent human subject-matter review.

## Repository artifacts

- `supabase/migrations/20261022006000_task402_ten_y1_info_office_security_answer_quality_repairs.sql`
- `supabase/migrations/20261022007000_task403_ten_y1_info_office_security_semantic_balance_repairs.sql`
- `supabase/tests/task402_info_office_security_y1_length_release.test.sql`
- `supabase/tests/task403_info_office_security_y1_semantic_release.test.sql`
- `.github/workflows/ci.yml` includes both production-dependent migrations in two clean-bootstrap exception lists. This skip is required by live source-row dependencies; fixture-backed reproducible clean-schema tests remain future technical debt.

## Published unanswered quality flags after release

- `implausible_distractors`: **0**
- `y1_answer_length_high_risk`: **314**
- `y1_correct_answer_strictly_longest`: **851**
- `independent_editorial_review_required`: **71**

These are overlapping categories. The 20 targeted high-risk source questions were repaired atomically, but total live flag variation may also reflect other concurrent agents. Do not ascribe unrelated variation to these two migrations.

## GitHub Actions and next steps

Before these changes, three workflows on commit `9f8411d572ef` were successful. Following the new migration/test commits, the most recent workflow was **pending**, and another **in_progress**, so **do not claim the current HEAD has passed CI** without a later verified result. No frontend deployment or additional merge action beyond direct GitHub `main` file commits is claimed.

Next: continue genuine semantic distractor and answer-length audit for the remaining 314 high-risk Y1 items and 851 strictly-longest items, with explicit immutable revisions and provenance. Do not mechanically rewrite numeric/code-output answers that are structurally correct.
