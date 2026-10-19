# TASK-254 — Legacy Y2 matching option-side integrity

Date: 2026-10-19. Production source: read-only Supabase aggregate checks in project `plyqezulrfowyblsfpzy`.

## Verified fault (not inferred from frontend)

- **26 Y2 records** currently have eight stored options flagged entirely as `side='a'`: **22 published** across 13 quota groups and **4 review** (S3.ALGO 1, S4.CODE 1, S6.NET 2).
- All **26** are `is_generated=false` with contiguous `order_idx=1..8`, and private `question_keys.payload.pairs` has exactly four one-to-one pairs.
- Privacy-preserving validation confirms **4/4 key IDs reference the first four options** and **4/4 corresponding value IDs reference the last four options**. No keys, stems or answer IDs were copied to this public repository or output in the report.
- This is inconsistent with the frontend/backend `Y2` option contract requiring **both** sides. Historical Y2 exams may be affected until a separately authorized production rollout.

## Proposed repair — code staged, not deployed

`supabase/migrations/20261019210000_task254_y2_option_side_repair.sql`:

1. Select only `published/review` nonparametric Y2 with *exactly 8 options*, all `a`, and unique order indexes 1–8.
2. Validate the existing protected key map proves each left member belongs to orders 1–4 and its right member to 5–8, bijectively. Fail and roll back on any ambiguity.
3. Set **only** `question_options.side='b'` for orders 5–8. Leave option IDs, positions, texts, `question_keys`, question status, source references and user exam history unchanged.
4. Assert four left and four right options post-update. Rerunning is a no-op.

Regression: `supabase/tests/task254_y2_side_integrity.test.sql`, wired into fresh-database GitHub CI. Tests require **zero** published/review Y2 with an absent left or right side and **zero** published Y1 with duplicate alternative text. This is structural quality evidence, *not* proof of semantic correctness or historical answer rescoring.

## Separate editorial blocker — 19 review Y1 items

Among **2,603 review** questions: 1,973 Y1, 315 Y2 and 315 Y3. All had a stored key, nonempty stem, source-reference, source-lesson link, active construct, consistent group and difficulty range 1–5. **19 Y1** questions in group **S4.CODE** have duplicate answer-option text under normalized whitespace/case. These remain `review`, are not automatically rewritten or published, and require human analysis of stem, answer and distractor semantics.

No `review` question in the inspected production snapshot had a `question_editorial_checks` record. Do not fabricate reviewer attestations or bypass publication gates.

## Release criteria (NOT MET)

- Full GitHub CI (fresh schema, backend, frontend, Playwright smoke) green on the exact final head.
- Independent source/answer inspection of all 26 repaired Y2, with user evidence of matching behavior in authenticated Y2 practice, mock and history views; mobile accessibility and session restoration.
- SQL dry run against a production-like **isolated and permitted** database and preservation of existing user history.
- Explicit separate approval before applying the migration to production. No Vercel deployment, no publication or user-exam mutation from this PR.

Status: **DRAFT / NO PRODUCTION WRITE / NO DEPLOY**.
