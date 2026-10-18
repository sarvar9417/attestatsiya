# KTD-540: reviewed-but-not-published import reconciliation

**Scope:** Informatika / Kompyuter tizimlari va dasturiy muhit, 18 chapters, 540 question IDs
**Source:** `Kompyuter_tizimlari_testlar_oqituvchi(1).pdf`
**Recorded:** 2026-10-18
**Release status:** **HOLD / review only**. This document does not authorize publishing or deployment.

## Completed DB import (the database already contains these rows)
- 540 source questions extracted with four options, key, explanation, and source hints.
- 12 semantically overlapping questions identified and **excluded from the new import**:
  `KTD-01-007`, `KTD-03-007`, `KTD-03-012`, `KTD-04-007`,
  `KTD-05-002`, `KTD-05-007`, `KTD-06-002`, `KTD-06-012`,
  `KTD-06-017`, `KTD-06-029`, `KTD-12-002`, `KTD-12-007`.
- **528 records** are in `public.questions` with `status='review'`, `group_code='S2.HW'` and source IDs `ktd-540-2026:KTD-XX-YYY`.
- **2,112** distinct per-question answer options are in `public.question_options`; **528** keyed answers in `public.question_keys`. All key IDs resolve to an actual answer option.
- Exactly matching *question stems* have no duplicates within the new imported 528, or with other published/review questions and the 387 old private candidates. **Conceptual and paraphrase duplicates may still exist**; the 12-item filter is not an exhaustive semantic audit.
- Older **387** `KT-HW-2026` candidates remain in the isolated `kt_bank_review.candidates` table, all `held`, and are **not merged into the public exam bank**.

## Categorization
- `S2.HW.01`: 270 questions, hardware, device selection and diagnostics (PDF chapters 1–7, 17–18).
- `S2.HW.02`: 60 questions, operating systems (chapters 9–10).
- `S2.HW.03`: 90 questions, files/folders (chapters 13–15).
- `S2.HW.04`: 120 questions, software (chapters 8, 11–12, 16).

## Outstanding blocking quality issues
- The imported bank still has apparent longest-answer signals: 87 questions by word count and 149 by character count (audit estimates after 12 duplicate exclusions).
- Some wrong options are implausibly easy or repeated generic wordings. Individual key correctness, source-page proof, and distractor uniqueness **have not passed independent item-by-item expert certification**.
- No question in this bank should transition to `published` until a versioned, individually verified remediation process succeeds.

## Integration, not production release
- Prior KT review-gate work landed in non-production `integration/kt-bank-qa-review-20261018` through PR #122.
- This PR adds only this record and the read-only verification SQL. **It does not import, modify, or publish DB rows, and does not update the app.**
- The live imported records were inserted separately with the Supabase SQL connector. Merging Git does not replay their import.
- For manual DB verification, run `supabase/qa/ktd_540_review_import_verify.sql`. It raises on any unexpected count, missing answer key, lost old holds, or accidental publish.
- Do not merge this PR into `main` or deploy to Vercel without separate release authorization. Vercel tracks `main` for production.
