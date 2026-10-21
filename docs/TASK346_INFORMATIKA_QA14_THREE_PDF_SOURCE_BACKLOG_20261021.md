# TASK-346 QA14 — three additional source PDFs, physical-page review and recovered Sanoq exercises

**2026-10-21. Private expert QA only; no automatic question release, no original author-key promotion, no production deploy.**

## Original source verification

| Original owner's Drive PDF | Actual physical pages | Existing source candidate questions checked |
| --- | ---: | ---: |
| [Axborot kodlash test.pdf](https://drive.google.com/file/d/1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5/view) | 20 | 20 |
| [MS EXCEL savollar.pdf](https://drive.google.com/file/d/1DFw9gV7IdLty88fAbQcboHeJZERlrELC/view) | 5 | 20 |
| [Sanoq sistema savollari.pdf](https://drive.google.com/file/d/1zSvEeqXYeQb7AnjgYlN0oAx8UrUWmThv/view) | 3 | 18 existing + 2 recovered |

All originals were downloaded privately and reviewed as rendered page contact sheets. Source page assignments: Axborot: Qn→physical page n (1..20); Excel: Q1–8/p1, 9–12/p2, 13–16/p3, 17–18/p4, 19–20/p5; Sanoq: Q1–9/p1, Q10–18/p2, Q19–20/p3.

**Two authentic source questions were missing** from the previously staged `Sanoq sistema savollari.pdf` candidate table: Q10 and Q19. Both were restored as original-data-based, editorial-reviewed, *unkeyed* private candidates with correctly separated original four-choice options. Their source mathematics was verified against enlarged original page images:

- **Q10, physical p2:** 151 decimal minus the binary option N must become an all-ones binary number. Only **B: N=11000₂ =24** works: 151−24=127=1111111₂. A,C,D give binary values containing zeroes.
- **Q19, physical p3:** original `36¹⁰+6¹⁵−18` yields `100000555555555555530₆`, containing **six zeros**, matching original **C** out of A=5, B=4, C=6, D=7.

Both solutions were saved as *independent explanation proposals* in the private table with `confirmed_by_human=false`. Their original source author keys stay NULL. No fabricated questions were added; authentic missing PDF questions only.

For Axborot kodlash Q8, Q9, Q12, Q16, Q18, Q20, independently computed correct-option proposals were already present; the six existing explanations were expanded to include source assumptions, bit-depth math, binary signals, and GB/GiB unit caveats. No duplicate answers were inserted and no human approval was inferred.

## Technical safeguards

The existing staging visual/page flags were updated only for verified source pages; stale `source_page_unverified` flags from Axborot were removed after inspecting the originals. Spreadsheet screenshots, formula images and any other actual original figure dependencies remain private and not automatically considered text-only. **Original PDFs, figure crops, and source answer keys are not committed in this repository.**

The repeatable `scripts/tests/test_telegram_informatika_source_qa14.py` verifies all 60 physical page/source-number mappings, missing question restores, unique Q10 choice, original Q19 exponent math, the six Axborot independent numeric checks, and explicit nonpublication.

## Live private database status after QA11–14

| Metric | Value |
| --- | ---: |
| Candidate PDF questions | **584** |
| Original-page visually checked | **413** |
| Independent MCQ solution proposals | **176** |
| Independent free response proposals | **89** |
| Source defect blocker rows | **59** |
| Next action: fix source defect | **63** |
| Next action: bind original figures | **20** |
| Next action: check physical page | **169** |
| Next action: independent solution | **40** |
| Next action: editorial review | **292** |
| Original source answer keys assigned | **0** |
| Learner-publish-ready candidates | **0** |

Distinct priority buckets partition the 584 private candidates. A source defect remains a source defect even if an AI independently computes a conditional answer. Work still pending: 169 original pages, 63 source-defect cases, 20 priority figure bindings, 40 unsolved independently, and 292 editorial approvals; these cannot be claimed complete without authentic evidence and suitable editorial permission. Neither public question/lesson tables nor deployment infrastructure changed in QA11–14.
