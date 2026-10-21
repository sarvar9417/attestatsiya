# TASK-20261021 — Local review-bank Y1/Y2/Y3 QA (READ ONLY)

**Do not deploy. Do not run migrations on production.** This QA file only contains SELECT statements; it neither changes question status nor writes editorial signatures.

## GitHub changes in this PR

- `supabase/maintenance/task20261021_local_review_y1_y2_y3_integrity_READONLY.sql` — six diagnostic SELECT statements, with only question UUIDs, source references, counts and defects in output. No answer text or answer-key payload is emitted.
- This document — local usage and actual database verification.

## How to test locally (after merging and pulling main)

```bash
git checkout main
git pull origin main
npm ci
npm --prefix backend ci
npm run check
npm run check:backend
npm run dev
```

In a **local, non-production** PostgreSQL database holding the locally staged test bank, run:

```bash
psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f supabase/maintenance/task20261021_local_review_y1_y2_y3_integrity_READONLY.sql
```

Use the **LOCAL** database connection string; do not substitute production credentials. If local Supabase or question fixtures are not initialized, migrate/seed the local database first via the project's established workflow. The read-only script alone does not seed any data.

## Verification against a snapshot of live Supabase (SELECT only)

On 2026-10-21, all **six queries successfully executed** against project `plyqezulrfowyblsfpzy` without modifications.

| Category | Count / result |
|---|---:|
| `review` Y1 | 1,059 |
| `review` Y2 | 126 |
| `review` Y3 | 106 |
| Y1 option/key/duplicate-option structural defects | 0 |
| Y2 4×4, valid one-to-one saved UUID pair mappings | 116 |
| Y2 3×3, valid one-to-one saved UUID pair mappings | 10 |
| Y2 structural defects (matching option IDs/pair counts) | 0 |
| Y3 mismatched or duplicate option-order UUIDs | 0 |
| Review questions with explanations shorter than 30 characters | 83 |
| Of those, S5.WEB Y1 | 75 |
| Of those, S4.DB Y1 | 6 |
| Of those, S3.LOGIC Y1 and S3.NUM Y1 | 1 each |

There are 96 four-item and 10 three-item Y3 review questions; both groups passed UUID and permutation checks.

## Important interpretation

**A valid 3×3 native Y2/Y3 key is not proof the format is permitted in the official 2026 examination.** The source specification, browser rendering, exam creation and scoring still require QA. The earlier simplistic “Y2 must always have 4+4 items” check produced ten false structural flags.

**An intact key UUID and 4 distinct Y1 options do not prove factual correctness or source credibility.** The 83 short explanations are triage signals rather than automatic grounds for rejecting a question. No `review` question is auto-published and no artificial human signoff is inserted.

## Follow-up checkpoints

1. Source-backed item-by-item review of the 83 short explanations, starting with 75 S5.WEB entries.
2. Local authenticated learner UI test for native 3×3 and 4×4 Y2, as well as Y3, including scoring and answer rendering.
3. Resolve documented source-location and near-duplicate review issues; keep private answer keys out of public GitHub.
4. Assess conflict-heavy older PRs such as #146 in isolation instead of force-merging obsolete migration chains.

**Production deploy: excluded by project owner's explicit instruction.**
