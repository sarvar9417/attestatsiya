# TASK-290 — Expert QA: algorithm Y3 cognitive depth and complete control flow

**Audit date:** 2026-10-19. Subject area: 2026 Informatika attestatsiya, S3.ALGO.

## Source grounding

- [Official 2026 certification specification](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view): 50-question exam; cognitive types must be meaningful, not merely mechanically counted.
- [Python control flow: conditional and loops](https://docs.python.org/3/tutorial/controlflow.html).
- [Python language reference: while statement](https://docs.python.org/3/reference/compound_stmts.html).

## Live bank inspection

Reviewed **all eleven published S3.ALGO Y3 questions** and their keyed order, original construct, source lesson and historical exam usage. Three items were identified as requiring explicit editorial replacement:

| Old question ID | Construct | Classification | Observed instructional flaw | Prior exam uses |
|---|---|---|---|---:|
| `fbf809c1-37eb-4663-95e5-a454f181ff95` | S3.ALGO.02 | mulohaza | Generic prompt asks to arrange start/input/calculate/output; cognitive depth closer to basic recall, no decision situation | 0 |
| `a23723a9-8e1a-4080-82ab-a259c4722d26` | S3.ALGO.03 | mulohaza | Squaring algorithm only specifies positive path; behavior for nonpositive input is underspecified | 0 |
| `b8b64caa-5fb8-4326-9dea-8107365c79c7` | S3.ALGO.03 | mulohaza | WHILE prompt is vague and keyed steps omit an explicit back edge to the test after body execution | 0 |

All three are **published**, original is **Y3** and classified **mulohaza**. No answer-key error was claimed for the old items: issues concern question clarity, construct/cognitive depth and pedagogical signal.

## New verified review candidates

Three new source-backed Y3 questions were inserted into production **REVIEW ONLY**, preserving each original subject, lesson, construct, format and cognitive class, with prefix:

`expert-audit:20261019:algo-flow-review:<old-question-UUID>|https://docs.python.org/3/tutorial/controlflow.html`

1. Conditional branch: safely handle zero denominator and preserve a single display step.
2. Conditional branch: define both positive and nonpositive cases before displaying a computed result.
3. WHILE: make condition recheck/back edge and stop condition unambiguous.

Simulation tests of the proposed semantics:
- Safe division: (12,0) yields controlled error; (12,3) yields 4; (-9,3) yields -3.
- Conditional square: inputs -2, 0, 5 yield 0, 0, 25.
- Loop: x begins at 3, doubles on x<20, ends at 24 after 3 iterations.

**Database readback: 3/3 PASS.** Each candidate:
- is REVIEW, not PUBLISHED;
- contains four distinct options, deliberately presented out of logical order;
- has exactly four valid, distinct ordered answer references, linked to its own question;
- uses a valid existing lesson↔construct mapping;
- includes explanation and exact reference URL.

As of this audit, the previous expert QA backlog had 24 review candidates, so this adds **three**: **27 source-backed review candidates in total**, none newly eligible for live mock selection.

## Strict separation of review and release

The file `supabase/maintenance/task290_archive_vague_algo_y3_AFTER_APPROVAL.sql` is OPTIONAL MANUAL-ONLY. It does NOT publish the review replacements, and must not be put into the normal migration chain.

Only run that retirement plan **after** normal editorial publication and verification. It performs exact-ID checks, disallows historical exam use, refuses an unapproved replacement, validates the four-step Y3 key and construct, and checks the active S3.ALGO/mulohaza quota and reserve before archival. All actions are transactional.

Do not auto-publish, change previous exams, replace answer keys in place or deploy frontend.
