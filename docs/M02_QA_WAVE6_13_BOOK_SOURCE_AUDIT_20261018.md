# M02 QA Wave 6 — thirteen-schoolbook review-only updates

**Status:** PARTIAL REVIEW; no publication, merge, or production deploy.

## Source coverage
- 13 PDFs: Cambridge+ 5,6,7,8,9,10–11 and ICT 5,6,7,8,9,10,11.
- 2,616 pages; 2,604 text-extractable pages; 518 keyword-match (construct,page) records. These are candidates, NOT certified complete coverage.
- 19 targeted source/concept comparisons with exact passages, including ALU/CU (C10 p33), virtual memory (C10 p34), OCR/OMR (C9 p30–32), magnetic tape vs HDD (C9 p42–43), CLI/GUI (I10 p24), NTFS (I10 p25–26), file attributes (I5 p43), Java bytecode (C10 p45–46).

## Real database changes completed
- Rewrote 12 existing REVIEW questions: KTD-01-009, KTD-01-019, KTD-03-009, KTD-03-019, KTD-04-019, KTD-05-019, KTD-06-009, KTD-06-019, KTD-07-020, KTD-08-009, KTD-09-019 and KTD-09-020. All four options, stem and explanation changed; each original correct option ID retained. Each remains REVIEW.
- Added verified reading to published M02.01 (embedded microprocessor; magnetic tape vs HDD) and M02.03 (file attributes and time parameters), preserving previous theory.
- DB totals checked: 528 older KTD REVIEW, 12 newly authored REVIEW, 43 older PUBLISHED, 387 separate old KT HELD.
- All 528 KTD and all 12 new items have four distinct options and one matching key. Warning reduction for 528: uniquely longest correct by characters 136 → 125, by words 76 → 69.

## Sampled stylistic references
- 13.04.2026 Attetasiya Tushgan savollar.pdf: question stems with concrete operations and A–D options in text-bearing pages.
- Test.pdf (2019): factual/ordering hardware questions in early chapters.
- Tushgan testlar 07.04.2026.pdf: mainly pedagogical scenarios in sampled pages; style not copied as M02 subject facts.
- Other scanned demos had insufficient extracted text on sampled pages; no exhaustive style comparison has been claimed.

## Unresolved
- The 13-book index is not a manual concept-by-concept coverage certificate. Test keys and distractors for the older 528+387 banks still need independent expert review.
- Four canonical M02 live lesson targets still request 20 questions while earlier published pools are only 16/8/8/11. Controlled migration and actual authenticated E2E verification remain release blockers.
- PR #148 is a DRAFT containing display-only code for marked DB theory addenda. User approval is required for any main merge or deploy.