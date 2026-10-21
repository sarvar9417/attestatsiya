# QA25 — HTML savollar 1.pdf: original 13-page source-code and defect review

**Original** owner-connected Google Drive PDF `HTML savollar 1.pdf`, file ID `1_RygzQDb7cJRUQlCecuMdn0qoQz2tQzv`, **13 physical pages and 13 independent numbered questions**. Original pages, including handwritten width notes and actual literal markup, were visually inspected. Previous discussion erroneously assumed eight PDF pages; the verified original has thirteen, each with one numbered question.

## Completed in private Supabase ingest

- Original HTML snippets for all **13/13** question candidates were isolated from the adjacent prose and fenced as Markdown `html` blocks. Malformed markup was deliberately preserved exactly, not corrected behind the source author's back. All thirteen were reverified at their original physical source page numbers and indexed as `source_text_only` with `content_publish_ready=false`.
- **Seven** original source defect holds with Uzbek evidence, `learner_publish_blocked=true`, `human_approved=false`: source Q1 conflicting 400px table/25% Acer column widths, Q2 missing opening `<` for the supposed 150px Math cell, Q9 markup missing original `<table` and no choices, plus Q10–13 missing all A/B/C/D alternatives despite requesting the correct response.
- Source **Q4** and **Q8** contain the same 350px table, same cell contents and widths, and the same requested arithmetic mean (differing only in printed question number and trailing punctuation). Q8 was explicitly flagged as a source-internal duplicate requiring editorial deduplication rather than treated as another independent question.
- Original source widths yield three **conditional and unapproved** free-response proposals under the problem's simplified ignore-cell-content model: Q3 approximately 7 counted source cells/groups; Q5 `260px` from `a=98+90=188px` and `b=72px`; Q6 longest `Nokia` (two-column 198px) and shortest `Xiaome` (72px). These are mathematical *review proposals*, not verified browser-rendering results or author answer keys. CSS auto table layout and border details remain an editorial gate.

## Original-source preservation

Source HTML syntax errors have **not** been silently repaired. Source-published diagram widths may conflict under browser automatic table layout; do not convert conditional educational column arithmetic into an official answer without specified layout assumptions. Five original “which answer?” questions have no source A–D answer images/text; generating novel A–D choices would create *new editorial derivatives*, not restore the originals.

`scripts/tests/test_informatika_html13_source_qa25.py` contains 11 standard-library tests: 13 pages, geometry constraints, source malformed markup, 7 source table cells, Q4/Q8 duplicate, simplified width calculations, missing choice gate and nonpublication invariants. The script does not connect to databases, run untrusted HTML in browsers, publish PDF images or assign source-author keys.

**Release gates remain:** all original answer keys `NULL`, no human approvals, no learner-ready source questions, source PDF binary not published, no production deployment or schema migration. Resolving source errors and original missing answers needs documented human editorial approval.
