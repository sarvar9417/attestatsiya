# TASK-346 QA11 — Mantiq 2-dars: original-PDF comprehensive logic review

**Date 2026-10-21. Private QA only; no learner publication or manual production deploy.**

## Source fidelity

Original source: [Mantiq 2-dars.pdf](https://drive.google.com/file/d/1yuU9acP2-wHX68H1q5yH0f_O1_GDaWoa/view), 24 physical PDF pages (the final three are blank). Pages 1–14 hold questions 1–50, pages 15–17 contain a separate “Mantiq Qonunlari” reference section, and pages 18–21 hold questions 51–60. All **60/60 original questions** were visually located and each private candidate's physical page and inspected status were set. No author-supplied answer key is present.

All answer suggestions below are independently computed; never confuse them with the author's original answer key or editorial approval.

## Source defects, kept blocked

Seven inequality questions (2,3,4,8,9,13,14) omit a domain or have no requested extremum. For instance, Q2 has −4<x<10: in the integers the minimum is −3, but in the real numbers there is no minimum. Q3,9,13,14 require extrema in unbounded sets; treating them as integers would not fix the request. Each was recorded as an explicit source problem with preserved original question text.

Questions 44,46,47,49,50 rely on an ambiguous natural-language premise about logic-operator precedence or logical dependence. Do not assign a truth value by fiat. Their requested counts vary under plausible interpretations; editorial reformulation is required.

**Question 59 has TWO correct options**. On original physical page 20, ¬A↔B is XOR: both **A** `(¬A∧B)∨(A∧¬B)` and **C** `¬(A↔B)` agree with the source in all four truth-table states. It must not receive a single-choice key without an explicit amendment.

Separately, on original physical page **16**, the source's logical identity `a ∧ 1 = 0` is mathematically false; the correct identity is `a ∧ 1 = a`. This is a **reference-theory source defect, not a numbered question defect**, so it is documented here instead of inventing a new source question or silently rewriting the original theory. Any derived lesson must use the corrected identity with editorial attribution.

## Independently worked solutions

- Questions 1–15: **8** unambiguous numeric responses proposed (1→12, 5→9, 6→−1, 7→20, 10→0, 11→14, 12→25, 15→−2).
- Questions 16–30: **15** complete fixed-variable truth-table counts proposed, including the legitimate zero-count questions 17,25,27. See executable formula-by-formula verification in the regression test.
- Questions 31–40: **10** evaluations of the three a/b/c statements at the given A/B values. Every case has a=b=c=1 except question 32, where a=1 and b=c=0. This is evaluation at the supplied values, not proof of general formula equivalence.
- Questions 41–50: **5** well-defined premise-dependent truth-table counts (41→3,42→3,43→3,45→3,48→1); the other five were blocked as ambiguous.
- Questions 51–60: the four original answer choices were properly split from the embedded question string and Unicode glyphs normalized. **9** independent A-option solutions were computed from full truth tables. Question 59 remains explicitly blocked as A and C both match.

**38 new free-response explanation proposals + 9 new MCQ option proposals + 13 source issue blockers.** All remain `needs_editorial_review`, no human approval and no publication.

The OCR/text-extraction error that concatenated the complete “Mantiq Qonunlari” appendix into question 50 was fixed: Q50 now contains its original question only. The source theory remains in the owner's PDF, not public application content.

## Verified private counts

| Metric | Current |
| --- | ---: |
| Original PDF candidates across all inventoried sources | 582 |
| Visually checked PDF candidates | 278 |
| Independent free-response proposals | 89 |
| Independent multiple-choice proposals | 108 |
| Active source defect blocker records | 50 |
| Priority 01: fix source defect | 54 |
| Priority 02: bind original required figures | 20 |
| Priority 03: check PDF physical page | 302 |
| Priority 05: editorial review | 206 |
| Original keys published to candidates | **0** |
| Learner-ready candidates | **0** |

The 54+20+302+206 priority categories total 582 distinct private candidates. The increase in the defect category reflects defects **found**, not regressions introduced.

## Executable gate

`scripts/tests/test_telegram_informatika_logic_qa11.py` checks the 60-question source page map, 15 independently computed Boolean truth-count tasks, 10 complete four-choice equivalence tasks with a safe recursive-descent evaluator, the Q59 duplicate correct choices, source inequality ambiguity, and corrected theory identity. Standard library only, with no database/network calls.

The next work queue still contains original diagrams with reuse/authorization questions, 302 unchecked PDF pages, and 206 editorial items. Existing RLS warnings on two private legacy ingest tables are separate from this content-only QA batch. Do not grant anonymous source access, migrate or deploy production as a side effect.

**This PR includes code and audit notes only. It contains no original PDF bytes, screenshot crops, Telegram transcripts or unpublished private source answer keys.**
