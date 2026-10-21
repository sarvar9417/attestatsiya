# QA23 — Attestatsiya 7-test.pdf: original 21-page / 20-question source audit

Owner Drive file `1GQHwKbe4WUiPf6wUiOwfb6lhaapXBy34`, original `Attestatsiya 7-test.pdf`. All 21 physical pages were rendered and compared against 20 private question candidates. Question text can continue on the next physical page (Q10: p9–10, Q14: p14–15, Q16: p16–17, Q18: p18–19). No original binary source image is redistributed in this PR.

## Original source extraction repair

17 candidates had an extraneous public-teacher-channel promotion footer embedded in question stems and 13 candidates had the footer embedded in their separately stored answer options. A guarded SQL transaction removed the **exact known footer string** without replacing source test content or changing answer keys. All 20 candidate records were rechecked: **zero** footer residue in question text/choices, source answer keys remain null, original option order preserved.

Four original code-heavy questions from source screenshots were independently transcribed with exact operators, indentation and Markdown fences: Q3 prime-check Python p3, Q10 Fibonacci Python p10, Q16 invalid Python p17, Q18 JavaScript p19. Complete required code is now represented as private text and is marked text_only/source_text_only without learner publication. Q1 HTML and Q14 HTML/CSS program text are also reproduced, but their **four original graphical answer options** were not reliably captured; these two remain text_plus_figure, source figure not exported, content_publish_ready=false. Don't invent images or answer keys for Q1 and Q14.

## Mathematically or syntactically defective originals, release blocked

- **Q3** source program reports Y for primes, N for composites. Both original **B (17,35,41)** and **C (23,27,29)** print **Y,N,Y**. It is not a valid single-correct-choice item; marked ambiguous_or_nonunique_answer.
- **Q5** original Excel nested ЕСЛИ formula has missing `*` in `B2-20% B2` and inconsistent locale separator. Source formula cannot be run unchanged; marked invalid_source_formula.
- **Q16** original Python source uses `b1[4,1,3,0]` without assignment, overwrites list parameter `b=False`, then attempts `len(b)`, causing execution errors. Original code is preserved, not silently repaired; marked invalid_source_formula.

All three blocker entries have explicit Uzbek evidence, learner_publish_blocked=true, human_approved=false.

## Four independent proposed answers; no author keys

- Q6: **C**, because four consecutive natural numbers are not universally divisible by three, but six consecutive naturals always are. Note `11₂=10₃=3₁₀`.
- Q10: **D** — program F(1), F(5), F(9) computes `1, 5, 34`.
- Q18: **B** — original JavaScript array becomes `[1,5,7]`, total `−1+5+7=11`.
- Q20: **C** — with 24 first-team members, only total `62` gives second team size `38` satisfying `n<=24 OR n>=28`. The other choices 50, 51, 49 give 26, 27, 25 and fail. This is **different** from a superficially similar question in another original PDF with multiple valid choices.

All four proposals were recorded privately with independent Uzbek explanations and `confirmed_by_human=false`, not promoted as original author answer keys.

## Repeatable guard tests

`scripts/tests/test_informatika_attest7_source_qa23.py` has 12 stdlib offline tests for physical question/page counts, retained figure holds, dual-correct Q3, original syntactic defects, consecutive-number arithmetic, Fibonacci Python, JavaScript, Q20 option uniqueness and no learner release. No production DB connection, migration or deploy.

**Remaining:** original image-choice review Q1/Q14, human editorial approval of proposals and repair or rejection of blocked originals. **Never publish the PDF's original third-party media or unapproved answer keys automatically.**
