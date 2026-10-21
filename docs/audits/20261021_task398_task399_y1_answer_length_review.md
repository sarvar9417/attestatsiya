# 2026-10-21 — TASK-398 and TASK-399 Y1 answer-length and distractor remediation

## Authorized scope and provenance

The platform owner instructed ChatGPT to continue independently applying substantive editorial improvements without requesting repeated reviewer permission. This is **AI editorial review**, not independent human-expert certification. Every revised question is a newly authored adaptation of the existing database question; `source_reference` is for attribution/traceability, not evidence that its wording was copied verbatim from a textbook or 2026 exam.

## What changed

Twenty formerly published Y1 questions were replaced with new immutable revisions:

| Batch | S1.INFO | S2.OFFICE | S7.SEC | Total |
|---|---:|---:|---:|---:|
| TASK-398 | 3 | 3 | 4 | 10 |
| TASK-399 | 3 | 3 | 4 | 10 |
| **Total** | **6** | **6** | **8** | **20** |

The two batches deal with digital society, digital records, expert knowledge bases, first-hand source reliability, decision-quality evidence, audio sampling; PowerPoint action/hyperlink navigation, Word Heading hierarchy, COUNT/COUNTA, Excel Formula Bar, percentage formats, absolute/mixed addresses; public/private-key encryption, authentication vs authorization, activity audit logs, accidental deletion and backups, phishing, ransomware and security-risk assessment.

For each record:

1. Verified the original `status='published'`, exact `source_reference`, group and `format='Y1'`, current `y1_answer_length_high_risk` finding, and original immutable snapshot fingerprint.
2. Compared the **exact original correct answer text and its option ordinal** with the new authored four options; no answer change was permitted.
3. Ensured four distinct alternatives, a maximum/minimum whitespace word-count ratio no more than **1.6**, and the keyed correct option was **not strictly longer in word count** than every distractor.
4. Created a new `questions` row, four new `question_options`, and remapped `question_keys` to the new correct option ID, preserving the original explanation context with a more specific new explanation.
5. Added a `question_bank_revisions` provenance link identifying the AI adaptation, owner delegation and no human certification.
6. Published the new question and archived its original within a single SQL transaction. No prior `exam_items`, answers, or historical question rows were rewritten.
7. Checked `question_quality_published_revisions.content_fingerprint`, `is_question_official_mock_eligible()`, `group_mock_eligible()`, and absence of open high/critical quality findings on new versions.

Every one of these **20** new revisions passed their corresponding production SQL regression test.

## Latest observed production quality flags

At the end of this task, the live database reported:

- Published `implausible_distractors`: **0** open.
- Published `y1_answer_length_high_risk`: **362** open.
- Published `y1_correct_answer_strictly_longest`: **899** open.
- Published `independent_editorial_review_required`: **69** open.

Counts are overlapping and may change due to concurrent editorial workflows, **so the full delta from previous snapshots must not be attributed to TASK-398/399**. A heuristic flag is not equivalent to a proven wrong answer, and suppressing the flag alone is not an accepted repair. Human review requirements are not silently represented as fulfilled.

## Migrations, tests, and CI

- `supabase/migrations/20261022002000_task398_ten_y1_informatika_office_security_answer_length_repairs.sql`
- `supabase/migrations/20261022003000_task399_ten_y1_info_office_security_second_answer_length_repairs.sql`
- `supabase/tests/task398_y1_balance_release.test.sql`
- `supabase/tests/task399_y1_balance_release.test.sql`
- `.github/workflows/ci.yml` skips these narrowly production-data-dependent migrations during fresh schema bootstrap in two separate CI paths. The associated tests safely skip source assertions when their production records are absent.

**CI caveat:** SQL regression against production returned successfully. GitHub Actions for the latest revision was pending at the time of inspection; no claim of overall CI green or frontend deployment is made.

## Next priority

Continue substantive semantic review of high-risk Y1 answer-length items (362 open) and strictly-longest-correct answer items (899 open); prioritize the most obvious distractor/length bias and maintain provenance, snapshots, and immutable exam history.
