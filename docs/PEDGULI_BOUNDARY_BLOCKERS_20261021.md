# PedGuli 2025 spring source boundary QA — 21 October 2026

Source: `Pedagogik mahorat to'plam 2025 (6).pdf`, Drive original 43 pages, source SHA-256 recorded in `docs/PEDGULI_PRINTED_PDF_INDEX_RECONCILIATION_20261021.md`. Original source text checked directly against production private candidate slots. **No public question text or correct answer keys committed.**

## Two confirmed extraction faults marked in the private candidate inbox

1. Printed **#7/#8** collision: private source candidate `8e708abf-6b3e-4076-89fd-77bf9191dd99`, import slot #8 on PDF p3. The stem actually contains printed #7's assessment matching question and its key, while `raw_answer_private` belongs to printed #8's pedagogical technology level ordering. This is **not a valid (stem, answer) pair**. On 2026-10-21, flags `answer_belongs_to_next_printed_question` and `source_question_answer_misaligned` were added to private staging with an explicit source note. Original raw fields, status `needs_review`, and source-marker-unverified key status remain intact.
2. Printed **#23** begins inside import slot #21: private candidate `6c71425c-e258-466a-8325-8492240baa8c` on PDF p5. Its raw stem starts with printed #22's previous answer tail, then printed #23. On 2026-10-21, `previous_answer_tail_in_stem` and `printed_question_23_boundary_pending` flags and note were added to private staging. Raw fields and `needs_review` remain intact.

The private source inbox was read back after both updates and flags confirmed present. These source-specific blockers are *not* automatic answer-key verification or permission to publish. Do not infer a canonical number from source_question_no, rewrite historical published questions, fabricate reviewer signoffs, or push production migrations.

## Next editorial actions

- Create clean **separate private source segments** for #7 and #8 from the physical PDF page; retain historical import candidates and all audit history.
- Reconstruct printed #23's stem excluding the trailing printed #22 definition; compare to source PDF and any linked published adaptations before permitting editorial verification.
- Continue the other distinct boundary-risk candidates via `scripts/audits/pedagogy_pdf_boundary_risks_readonly.sql`.
- Mark individual answers independently verified only after source and concept checks; no bulk `review -> published`.

Scope is metadata-only private staging triage and an audit document. **No manual Vercel deployment.**
