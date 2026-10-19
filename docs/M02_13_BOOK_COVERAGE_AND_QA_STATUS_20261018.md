# M02 — 13 textbook coverage and guarded editorial QA, 2026-10-18

**Status: INCOMPLETE / source-audit in progress; not a release approval.**

## Bibliography examined

A *sampled-page* full-text index was run over all 13 provided ICT and Cambridge+ PDF textbooks; the sample comprises the first 36 PDF pages of each book and subsequent samples at 14-page intervals. **This is NOT a page-by-page exhaustive audit**, and presence of a keyword does not prove that the subject is taught correctly or assessed by any existing item.

| Source | PDF pages | Sample pages reviewed | M02-topic keyword hits |
|---|---:|---:|---|
| Cambridge+ 5 | 139 | 44 | Files 1; software 5 |
| Cambridge+ 6 | 244 | 51 | Files 3; software 3 |
| Cambridge+ 7 | 147 | 44 | No keyword hits in sampled pages |
| Cambridge+ 8 | 153 | 45 | Hardware 1; files 2; software 3 |
| Cambridge+ 9 | 316 | 56 | Hardware 25; OT 8; files 2; software 14 |
| Cambridge+ 10–11 | 360 | 60 | Hardware 8; OT 2; software 14 |
| ICT 5 | 113 | 42 | Hardware 12; OT 1; files 4; software 2 |
| ICT 6 | 160 | 45 | Hardware 2; OT 2; files 3 |
| ICT 7 | 160 | 45 | Hardware 5; OT 1; files 2 |
| ICT 8 | 113 | 42 | Hardware 2; files 3; software 3 |
| ICT 9 | 114 | 42 | Hardware 3 |
| ICT 10 | 257 | 52 | Hardware 22; OT 7; files 10; software 9 |
| ICT 11 | 340 | 58 | Hardware 4; software 2 |

**Counting method:** a single sampled PDF page may register multiple constructs, and keyword matching can contain false positives. The corresponding private dated CSV has 190 page/topic matches; page index in that CSV is 1-based PDF page, not printed page. This repository document deliberately does not assert full textbook coverage.

## Evidence-backed question edits

- On 2026-10-18, `KTD-02-010` was rewritten as an applied motherboard/bus/expansion-slot selection question, with a supporting **Cambridge+ 10–11 PDF pp. 33–34** reference.
- `KTD-03-010` was rewritten as an applied ALU/CU processing question, with **Cambridge+ 10–11 PDF p. 33** reference.
- Both were updated in private Supabase, **kept in review**, with original keyed option IDs preserved. They are not editorially approved for publication merely because they have source links.
- KTD bank still contains many near-definition and template-based items; 387 older KT candidates remain held separately.

## Required gates before declaring fully complete

1. A complete source-topic concordance for *every materially relevant M02 passage* across all 13 books, including actual page evidence, gaps, contradictory versions, and lesson content.
2. Every intended public question independently reviewed for source fidelity, answer and wrong-option rationales, duplication, difficulty/cognitive level, and fairness of answer lengths.
3. Topic test and section mock test quotas shown by UI must not exceed *published*, keyed, construct-mapped question supply.
4. Authenticated learner E2E on an isolated safe environment (read theory, open topic test, answer, submit, results, back/next).
5. Written human release decision before moving review candidates to published.

## Merge semantics

This change is **documentation and a read-only release verification script only**. Merging it to `main` does not make question content public, apply a Supabase migration or certify the source audit complete. The independently edited two review items were written directly to the connected database.

**Release state:** `Partially Completed`; never label `Fully Completed` based only on a passing CI check.
