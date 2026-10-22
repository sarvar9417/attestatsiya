# TASK-431: Excel Matematik va Mantiqiy 40 ta source formula QA

Original: [Excelda Matematik va Mantiqiy funksiyalarga oid savollar.pdf](https://drive.google.com/file/d/1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU/view), private source ID `1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU`.

**2026-10-22 live postflight:** 40 source rows, 37 independently solved and explained in `telegram_informatika_pdf_free_response_qa`, all `human_approved=false`, `publish_ready=false`. 3 defects: Q16 COUNT(47;A;B;R;6) undefined named-range context; Q28 unpaired string literal in LEFT; Q35 malformed REPLACE argument separator. Their `invalid_source_formula` or `insufficient_problem_data` release blockers remain active. Source answers cannot be assumed published Y1 keys because this PDF presents formulas, not four choices.

## Formula results
| № | Independent result |
|---:|---|
| 1 | 5.4 |
| 2 | 133/6 |
| 3 | 157/6 |
| 4 | 26 |
| 5 | 8.28 |
| 6 | 24 |
| 7 | 120 |
| 8 | 5040 |
| 9 | 40320 |
| 10 | 6 |
| 11 | 87 |
| 12 | 64 |
| 13 | -98 |
| 14 | -1000 |
| 15 | 4 |
| 17 | 3 |
| 18 | 2 |
| 19 | 0 |
| 20 | 0 |
| 21 | 11 |
| 22 | 4 |
| 23 | 6 |
| 24 | 12 |
| 25 | 5 |
| 26 | ATTESTAT |
| 27 | KINO |
| 29 | GUL |
| 30 | - |
| 31 | DARYO |
| 32 | KENT |
| 33 | RATSIYA |
| 34 | OMAD |
| 36 | GULTOJIXO`ROZ |
| 37 | AKA |
| 38 | NOL |
| 39 | SOF |
| 40 | HAMMA |

**Borderline distinctions:** COUNTIF Q17=3, Q18=2, Q19=0 because KITOB lies outside selected A1:B4, Q20=0. LEFT(number -54789;1) begins with ASCII '-' (minus sign), not digit 5. POWER and REPLACE indices use Excel's 1-based positions. LEN(3.2478)=6 under the original dot-decimal interpretation; other locale settings may change textual conversion and need explicit localization in any published rewrite. Q16 named ranges A/B/R are unspecified; it is not defensible to assign a numeric answer.

## Next action
For a learner Y1, craft four semantically distinct options, decide localized Excel syntax, independently test formula with actual Excel/compatible evaluator, pin a new revision and key. Do not mutate source formulas or claim independent human approval.
