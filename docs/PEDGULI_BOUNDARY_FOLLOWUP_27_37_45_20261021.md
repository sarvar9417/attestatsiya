# Pedagogika PDF boundary review — printed questions 27, 37, 45 (2026-10-21)

Source: `Pedagogik mahorat to'plam 2025 (6).pdf`, 43-page spring collection. This follows `docs/PEDGULI_BOUNDARY_BLOCKERS_20261021.md` for printed #7/#8 and #23.

Three additional private staging candidates were independently matched against the original source text and found to contain the tail of the **preceding answer** before a new printed question. These are source-extraction defects, not evidence that a published test or key is incorrect.

| Printed source question | PDF page | Original import slot | Private candidate UUID | Boundary problem |
|---:|---:|---:|---|---|
| 27 | 6 | 25 | `e8a32733-1bde-455a-9fe2-1702532f64ed` | The previous response ends with “foydalanish uchun”, immediately followed by printed #27 matching exercise |
| 37 | 8 | 35 | `e07692ce-f7a3-4171-81d1-122a1c52d77b` | Tail of the previous didactic-game definition precedes the 4K ordering question |
| 45 | 9 | 43 | `3892539f-b75f-44e8-95f5-89b09c353e6b` | Previous answer ends with “yordam berish”, then printed #45 classroom scenario begins |

**Decision:** retain `needs_review`; do not infer a key, assign a fake reviewer, publish, or overwrite historical raw fields. A publication-safe fix must create independently source-checked private segments while preserving original candidate evidence.

Live SQL metadata modification was **not** completed in this task; a guarded write attempt was rejected by safety controls. This document records review findings only, not a completed DB remediation. The existing technical flags `extraction_stem_missing_printed_question_start` and, where present, `source_question_starts_with_previous_answer_tail` remain in the private table.

For the next review pass, use `scripts/audits/pedagogy_pdf_boundary_risks_readonly.sql`; verify each candidate against the original page before staging a separate canonical segment. Do not use import slot numbers as printed question numbers.

No raw question or answer bodies, new migrations, public keys, or manual production deployment in this change.
