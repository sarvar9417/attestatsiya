# TASK-346 QA17 — Full expert arithmetic check of 20 authentic Sanoq questions

**2026-10-21 — original PDF reviewed privately; no publication, no author-key promotion and no production deploy.**

Original [Sanoq sistema savollari.pdf](https://drive.google.com/file/d/1zSvEeqXYeQb7AnjgYlN0oAx8UrUWmThv/view) has 3 physical PDF pages. Earlier QA14 reconstructed missing actual Q10 and Q19. This wave reviewed all 20 original numbered questions on full-page renders, restored Q9/Q18 OCR option boundaries that had joined Q10/Q19, and performed independent arithmetic verification.

## 16 independently derived, unpublished option proposals

| Original no. | Proposed choice | Source-derived calculation |
| ---: | :---: | --- |
| 2 | C | 3021₁₀ = 233031₄; even–odd digit sums = 2−10 = −8 |
| 3 | B | 4214₅=559, 2102₃=65, 5412₇=1920 (multiple of 6); (559+65)₁₀ = 1551₇ |
| 4 | B | Coordinates A=(23,19), B=(23,31), C=(31,19): right triangle, area 48₁₀ = 110000₂ |
| 6 | C | 11011111₂=223, 212₁₀=212, 331₈=217, CF₁₆=207; greatest pair #1,#3 |
| 7 | A | 25₁₆−14₁₆ = 37−20 = 17 |
| 8 | A | 129−10₂ = 127 = 1111111₂ |
| 9 | A | 3212₅=432 and 2541₇=960 divisible by six; remaining 1202₃=47=65₇ |
| 10 | B | 151−11000₂=127=1111111₂ (recovered in QA14) |
| 11 | D | 33₇×3 =72₁₀=110₈ |
| 12 | C | 1111₂−10₂ =15−2 =13 years |
| 14 | A | 3607ₓ+25676ₓ=31505ₓ uniquely at valid radix x=8 |
| 16 | D | Coordinates (17,14),(9,8): distance sqrt(8²+6²)=10₁₀=1010₂ |
| 17 | A | 11101011₂=235,345₈=229,224₁₀=224,DD₁₅=208; least pair #3,#4 |
| 18 | A | xy₉ =47₈=39₁₀=43₉; x×y=4×3=12₁₀=1100₂ |
| 19 | C | 36¹⁰+6¹⁵−18 has six 0 digits in base six (recovered in QA14) |
| 20 | C | 16×40=640 m², 1010100₂=84 m²/can; seven cans cover 588, one more needed |

Each proposed option and Uzbek explanation was written in private `telegram_informatika_pdf_independent_qa` with `confirmed_by_human=false`; original author `answer_key` remains NULL. This is mathematical audit, not a claim of teacher/editor approval.

## Four source defects requiring correction

**Q1:** 215₈..93₁₆ is 141..147 decimal; 142,144,146 all contain adjacent 00 in binary. Removing all yields **zero**; original options 142/144/146/140 lack zero — no correct choice.

**Q5:** Source explicitly says discard numbers containing “2 ta nol” but does **not** specify consecutive zero digits, unlike Q1. In range 110..118 even, discarding numbers with exactly two zero digits leaves **342**, not in original 218/224/228/232. Discarding numbers containing adjacent `00` leaves **228 (C)**. Because these interpretations disagree, an official single-choice key requires source clarification.

**Q13:** Original base length `A1₅` has digit A, invalid in base five (0–4 only). If A is a variable, its value is undefined. Do not assign a fabricated triangle area.

**Q15:** Source equality ends `1A40b₉` with digit A (10) in base nine (allowed 0..8). Its representation cannot be a valid base-nine number as written.

All four now have evidence-based `learner_publish_blocked=true` private source defect rows. No PDF text silently corrected, no distorted author answer key promoted.

## Regression gate

`scripts/tests/test_telegram_informatika_sanoq_qa17.py`: 13 pure-Python original-source arithmetic checks passed locally. Source #9 and #18 original A–D option arrays were cleaned of accidentally appended #10 and #19 material; corrected originals each now have four choices.

**Verified per-source private totals:** 20 authentic PDF questions, 16 independent suggestions, 4 blocked defects, 0 assigned official author keys and 0 learner-release approvals. Media stays private; this PR contains tests and audit notes only.
