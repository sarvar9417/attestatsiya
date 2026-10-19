# TASK-268 — Drive source reconciliation and editorial queue (2026-10-19)

**Status:** second source-import batch and automated preflight complete; editorial approval and official publication **NOT COMPLETE**.

## User goal and immutable safeguards

Fill the previously observed 339 missing published/keyed 20-question topic-test slots with traceable questions from `Google Drive / Attestatsiya / darsliklar`, official specification, textbooks, historical genuine tests/demos and existing question bank. Never fabricate correct answers, source pages, a reviewer signature or completion claims. Production Vercel deployment is explicitly forbidden; `vercel.json` retains `git.deploymentEnabled=false`.

**Drive review tracker:** [TASK-268 · Attestatsiya — 24 mavzu, 275 ta savol](https://docs.google.com/spreadsheets/d/1GwvKFw8MGyD12kKWjH5QO1JNLSjaFnPs9H5IZmcKQC0/edit). Located **inside** [Attestatsiya Drive folder](https://drive.google.com/drive/folders/139UU38VTM85dcWJ8FFtgFK7KTCzsfJ7A).

This contains 275 candidate UUIDs across 24 lessons with format, difficulty, truncated answer-free stem, original DB source metadata and separate **pending** source/answer/duplicate/reviewer decisions. The technical AUTO-PASS means *referential/structural* fitness, not verified textbook page, scientific correctness or human editorial acceptance. The sheet does **not** contain answer keys and is **not** wired to publish.

## New material verified and inserted as review

1. **Earlier TASK-267 first batch:** 9 questions (M03 Excel 5, M08 JavaScript 1, M11 HTML 3), from Drive `Test.pdf` (2019, PDF pp.49–50, 68) and `20000 LIK informatika.pdf` (illustrated PDF pp.7, 10). Source calculations/HTML syntax reviewed independently; 9 option references and 9 private keys valid; zero editorial checks.
2. **New TASK-268 second batch:** **7 further HTML** Y1 items from `Test.pdf` (2019), PDF p.70 Q91 (preformatted text), PDF p.71 Q112 (six headings), PDF p.74 Q149 (head), Q151 (superscript), PDF p.73 Q134 (form action), Q136 (textarea), Q139 (input value). Four map to `S5.WEB.04`, three to `S5.WEB.05`; all seven records inserted idempotently in Supabase `review` only with original PDF page, four distinct options, correct option pointer and independent explanation. Dry-run transaction was rolled back successfully before committing.
3. **Total new source-backed candidate records from these two batches: 16**, all still `review`. **Zero signed expert checks**; zero publication by TASK-267 or TASK-268. Do not equate raw candidate count with completed published slots.

## Concurrent live database movement (avoid false attribution)

Initial baseline in this work stream: **25 unfinished assessed lessons / 339 missing published slots**. While the audit/queue was being compiled, concurrent work changed the shared database to **24 lessons / 275 missing published slots**. **64 published-slot gaps were closed by concurrent changes, not by these 16 review imports.** The exact current counts are snapshot-specific and should be recomputed using `scripts/sql/TASK268_TOPIC_REVIEW_READONLY.sql` immediately before any release decision.

Snapshot on 2026-10-19 after the concurrent updates:

| Module | Still missing published slots |
|---|---:|
| M03 Office | 47 |
| M06 Algorithms | 32 |
| M08 Python / JavaScript | 48 |
| M09 Database / Access | 60 |
| M10 Graphics | 26 |
| M11 HTML / CSS | 33 |
| M12 Networks | 29 |
| **TOTAL** | **275** |

## Structural quality scan

- Filtered review candidates across **all 24 underfilled lessons** by active construct, source-reference presence, private key existence, missing-media placeholders, Y1 option count + **case-sensitive** unique text + correct option pointer, Y2 matching pair UUIDs to side A/B option records and Y3 ordering UUIDs to option records.
- At scan time, ~1,700 structurally eligible lesson-mapped candidate occurrences were available, exceeding each lesson's remaining numeric target. This is **NOT 1,700 certified questions**, and can include reused mappings.
- Four old Y2 candidates with legacy all-A-side option layouts were detected in an earlier snapshot; later strict scans removed them from the queued set. Do not treat pair-count alone as Y2 correctness.
- A false positive was discovered in a naive code-question duplicate detector: `True`, `TRUE`, `true` (and similarly `xyz`/`XYZ`) are **different programming outputs**. The final structural pass uses **case-sensitive** comparison, so case-only distractors are not automatically overwritten or invalidated.
- The ranked tracker intentionally balances Y1/Y2/Y3 *against the already-published format mix*: **128 Y1 / 74 Y2 / 73 Y3 = 275 total**. No key was exported to Drive or GitHub.
- This automated QA cannot certify semantic distractor plausibility, source licensing, original page correctness, Python/JavaScript runtime behavior for arbitrary snippets or hidden visual dependencies. Each needs source/editorial judgement.

## Publication blockers

**User authorisation to publish is not a substitute for an actual independent human sign-off in the database.** For relevant M09 and GV2/M11 source revisions, guarded functions require `question_editorial_checks`, real `reviewer_id`, four explicit checks, detailed reviewer notes and current fingerprint. These must not be forged. Additional modules should follow the same editorial standard even if a legacy trigger would permit status changes.

Completion gate, by exact question revision:
1. Verify against Drive original PDF/file and **correct page**, textbook/specification scope and version.
2. Verify that all four choices or native Y2/Y3 maps are present, correct, unambiguous, with no semantically equivalent duplicates; verify visual assets/licence.
3. Independently recompute formula/code/SQL examples; resolve source answer-key mistakes with documented reasoning, not guessing.
4. Record real independent editorial sign-off and immutable content fingerprint with reviewer notes.
5. Publish only individually approved revisions via guarded release path; avoid mutating previously published immutable items.
6. Re-run strict lesson preview for each of the originally 25 topics, require exactly 20 available and 20 shown, test 15/50 blueprints, authenticated learner/editor session, local smoke and CI.
7. Reconcile concurrent PRs and fresh DB state before any import/merge. No Vercel production release.

**Done in TASK-268:** 7 new source-backed private-keyed review questions inserted, 275-record private Drive review tracker created and moved into Attestatsiya folder, code-output case-sensitivity corrected in audit methodology, read-only repeated SQL and source-level audit.  
**Not done:** independent human approval of the 275 rows, their production publication, 20/20 test completion for all lessons, or complete review of every scanned/graphic Drive file. No production deployment requested or performed.
