# TASK-346 QA29 — exact duplicate PDF and 30 original assessment pages

**Date:** 2026-10-21. **Scope:** private Informatika ingestion staging; no public student questions, source-answer keys, media license authorization, or production deploy.

## Source inspection and identity

- [13.04.2026 Attetasiya Tushgan savollar.pdf](https://drive.google.com/file/d/1McTsbH1NC5nD0aLO32DZJLWT6EDCqOA2/view): 31 physical pages, original PDF SHA-256 `032274965718ed9cb2de06ca0c93b3124169556e1fcf7165c79a503afa643b25`. **30 nonblank assessment pages:** 1–29 and 31; physical page 30 is blank. Page image contact sheets and page-native extracted text were reviewed privately.
- [Axborot kodlash test.pdf](https://drive.google.com/file/d/1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5/view) and [Axborot kodlash test (1).pdf](https://drive.google.com/file/d/1B6d2GEdx6EK74WG72xyzhhAOK920B0wW/view) are **byte-for-byte identical**, SHA-256 `a58aa2ce8911f2607e765a4b187176ba0eb95de72c879ea3c7689dc002c596cd`, each 216,037 bytes/20 physical pages. The (1) copy was malformed into a single 80-choice staged candidate; canonical source already has 20 separately extracted source candidates. Do not double-import 20 repeated questions. Existing blocked alias record is tagged with exact-duplicate provenance, not published or guessed into distinct new questions.

## Private 13.04.2026 source-boundary repair

The previous ingestion held **two candidates only**:
- Candidate #1 contained an aggregate of **75** answer choices from many pages.
- Candidate #2 had one incomplete answer fragment from physical page **31**, despite its staging locator incorrectly pointing at page **2**.

The full original PDF's **30 nonblank pages** were reconstituted into **30 distinct, unkeyed private candidate rows**: 1–29 and 31. Specifically **28 new rows** were inserted, and records #1/#2 were replaced with their respective **physical page 1/2** source text and independently split A–D options. Page **31** preserves the original partial Android/Windows matching question rather than losing it.

The PDF repeats original printed question numbers (such as 8, 10, 14, 15, 26). For this **single source**, `source_question_no` is deliberately a **physical-page surrogate ID**, while the original printed question number remains in `extracted_question_text`. This avoids collisions; it does NOT rebrand printed test questions.

- **16** pages yield four nonempty, ordered A–D options.
- **14** pages have fewer complete extracted choices; each received an `insufficient_problem_data` private blocker, which records an *ingest/source visual completeness defect*, not proof the original author was incorrect.
- **11** pages with essential original visuals/diagrams/tables are indexed as `pdf_figure_not_exported_to_platform`, `content_publish_ready=false`. Original media remains private.
- Old two malformed-ingest blockers were retired only after verifying #1/#2 have four choices. **New page-2 ambiguity blocker** protects a search-syntax question: both a quoted exact phrase plus `(kitob OR maktab)` with implicit AND, and a variant using explicit `AND`, can serve the same intent depending on supported search syntax. No uniqueness claim without a specified provider/operator grammar.
- **0** original author answer keys were assigned and **0** candidates approved for learner publication.

## Seven independent, unapproved MCQ solution proposals

| Physical page ID | Topic | Independent result (zero-based option index) |
| ---: | --- | --- |
| 5 | Boolean `(A∧¬B)∧(¬A∨C)` true rows | **A (0)**; 1 of 8 |
| 6 | Implication `A∧(B↔C)→(¬B∨C)` | **C (2)**; tautology, 8 of 8 |
| 7 | Base-2/base-10/base-8/base-16 ranking | **C (2)**; 223+217=440 |
| 8 | `25₁₆ - 14₁₆` students | **A (0)**; 17 |
| 12 | JavaScript `pop()`, index update and alternating sum | **A (0)**; −7 |
| 25 | Chrome shortcuts `End`, `Ctrl++`, DevTools, F1 | **A (0)** |
| 29 | Minimum fixed binary code for 50 employees | **A (0)**; 6 bits |

One additional independent, *unapproved* free response for physical page **16**: 32-bit address `11000011101010001100100101101101` = **195.168.201.109**. Only source choice A is printed (`195.168.201.99`), so no MCQ key or release: the incomplete-choice blocker is retained.

## Checked staging totals after QA29

| Metric | Read-back |
| --- | ---: |
| Private candidate rows | **648** |
| Independent MC proposed answers | **245** |
| Independent free-response proposed answers | **156** |
| Source/boundary defect blocker records | **111** |
| Queue: fix source defect | **115** |
| Queue: restore visual asset | **36** |
| Queue: independent answer analysis | **46** |
| Queue: human editorial approval | **451** |
| Source author keys populated | **0** |
| Learner publish-ready | **0** |

The mutually exclusive queue priorities sum to 648. These changes include no public learner data, no PDF screenshots or binaries in Git, no database migration, and no production deploy.

**Regression:** `scripts/tests/test_informatika_mixed_pdf_qa29.py` contains 15 pure standard-library tests for page mapping, visual release holds, Boolean/radix/JavaScript/IP/bit arithmetic, source text ambiguity, and no author-key promotion. Actual private source hashes are included for future comparison; binaries are deliberately not committed.
