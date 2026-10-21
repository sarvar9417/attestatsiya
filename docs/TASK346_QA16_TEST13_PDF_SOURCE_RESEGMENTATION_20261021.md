# QA16 — Test #13 source resegmentation (private, 2026-10-21)

Source: Drive file `1QNeDPscVBVUDYwQTsme3EgQbE-UJMf3I`, displayed as **Attestatsiya test 6.pdf**; its title page says **Attestatsiya test №13**. Original PDF has **20 physical pages, one question per page**.

## Observed original extraction defect
Only four candidate records existed, and question 1 combined several subsequent questions, question 3 combined later HTML and security material, question 4 combined many other sections. Options in those candidate records were corrupted into 18/16/36 combined entries instead of four independent choices. This was not safe for students.

## Actions completed in private staging
- Compared the source text with all 20 actual PDF pages, and restored **20 independent question entries** under their page-correct original numbers. Four corrupt records corrected and 16 missing records created. The extracted questions are source-derived; the source PDF was not changed.
- **16** source items now have four separate text choices. Four source items (3, 12, 18, 19) have image-only or missing choice descriptions; no choice set was fabricated.
- Added **11** original-figure requirements to the visual index for questions 2, 3, 7, 10, 11, 12, 13, 15, 17, 18 and 19. These remain `content_publish_ready=false` and graphics are not embedded in GitHub.
- Preserved JavaScript, SQL, HTML, CSS and Python source snippets in fenced code blocks. Original figure-backed Python indentation on page 8 and JavaScript indentation on page 1 were restored, without changing the expressions or operators.
- Independently computed **eight** solution proposals: Q1 C (5); Q4 A (phishing); Q5 B (25 px adjacent standard block margins); Q8 C (140); Q9 D (16 colors); Q14 D (exactly one true assertion); Q16 D (canvas/curved line/edit colors); Q20 C (CapsLock). These are NOT official author answer keys and all eight proposals have `confirmed_by_human=false`.

## Reproducible checks
`scripts/tests/test_informatika_test13_qa16.py` tests eight source-grounded invariants, including the original code results and mathematical checks. The script uses only Python's standard library and does not access a database, modify source PDF bytes or publish questions.

## Release gates
Verified private database immediately after insertion: 20 distinct original questions; 20 correctly mapped original physical pages; 16 complete option sets; 11 image dependency records; eight unapproved solution proposals; **zero answer keys assigned** within this source. All media rights, figures, ambiguous texts and editorial review must be resolved before learner release.

This branch changes **tests and documentation only**, with no private binary PDF/image media, no learner table writes, no production deploy and no RLS/schema migration.
