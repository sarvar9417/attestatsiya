# M02 textbook-to-assessment crosswalk — 2026-10-18

**Scope:** Only the official M02 hardware, operating-system, files/folders and system/application software constructs. The 13 whole books include many unrelated units; a requirement to copy every book fact into M02 is inappropriate. **Status: SOURCE CANDIDATE REVIEW, NOT EXPERT CERTIFICATION.**

## Coverage index and methodology

- The locally indexed, uploaded corpus contains 13 ICT/Cambridge+ books, **2,616 PDF pages**, of which **2,604** have extractable text.
- An earlier lexical index produced **518** construct–page candidate rows. The corresponding uploaded private source file is `13_DARSLIK_M02_SAHIFA_NOMZODLARI.csv`.
- A thematic pass classified **39 target knowledge elements**: 17 hardware, 6 OS, 8 file/folder, 8 software. **36/39** have at least one matching excerpt in this *truncated candidate index*.
- IMPORTANT: 36/39 **does not mean** 36/39 verified learning outcomes; duplicates, irrelevant text, and missed excerpts are possible. Only passages separately reviewed in the original textbook have source proof.
- The 3 missing excerpt matches are false negatives for lexical search, not knowledge omissions. Direct PDF checks:
  - **Virtual memory**: Cambridge+ 10–11 PDF **34**, secondary storage used when RAM is insufficient, slower than RAM.
  - **Hard copy output**: Cambridge+ 10–11 PDF **36–37**, inkjet and dot-matrix printers provide physical paper output.
  - **File metadata and attributes**: ICT 5 PDF **43**, file attributes and date/size details.
- The full row-by-row 39-element crosswalk is in the private review CSV `M02_13_DARSLIK_39_KONSEPT_QAMROV_NOMZODLARI.csv`. Page snippets are *source candidates* only.

## Official specification crosswalk

| Construct | Thematic units mapped | Primary lesson | Verified support examples | QA requirement |
| --- | ---: | --- | --- | --- |
| `S2.HW.01` hardware and device tasks | 17 | `M02.01` | Cambridge+ 9 PDF 30–37; Cambridge+ 10–11 PDF 33–43; ICT 10 PDF 9–16 | Each item must have precise source and plausible alternatives |
| `S2.HW.02` operating systems | 6 | `M02.02` | ICT 10 PDF 24–26; Cambridge+ 9 PDF 11–13 | Verify real resource-control and GUI/CLI reasoning |
| `S2.HW.03` files and folders | 8 | `M02.03` | ICT 5 PDF 43–46; ICT 10 PDF 25–27 | Verify file operations, paths, wildcards, attributes |
| `S2.HW.04` software types | 8 | `M02.04` | Cambridge+ 10–11 PDF 45–46, 58–60; ICT 5 PDF 39–42 | Distinguish compiler, interpreter, utilities, apps |

The official 2026 specification places the M02 technical/software allocation under **2 questions**; a separate **5 questions** cover Word/Excel/PowerPoint, belonging outside M02. The official 50-question general cognitive profile must not be confused with arbitrary A–E difficulty stickers used in the working bank.

## Live DB and application readiness

- Four canonical lessons `M02.01`–`M02.04` have source-checked addenda in their published body; static 9-part theory is preserved by the PR's UI adapter.
- At the observed DB check, the four published topic-test pools were **16, 8, 8 and 11**; the required counts also matched **16, 8, 8, 11**.
- 528 KTD and 14 newly authored M02 questions are **REVIEW**, and 387 earlier candidates are **HOLD**. No question is published automatically; the previously published 43 M02 questions are unchanged.
- Exact-question duplication and key/option link checks are automated. They are NOT independent expert scrutiny of all 528 answers, nor proof of unique and fair wrong alternatives.
- Remaining required work before marking Fully Completed: the expert must approve the full concept-to-theory-to-question matrix, review the pending question bank item by item, and perform real authenticated staging/production browser E2E (login → lesson → backend test → grade → results → back/next). A mocked Playwright pass is not this end-to-end signoff.

## Safe merge criteria

This document, the UI addendum fix, test protections, and source review may be **merged to main after CI succeeds**. That merge does not authorize exposing unverified questions. Review statuses must stay unchanged until individual editorial signoff.
