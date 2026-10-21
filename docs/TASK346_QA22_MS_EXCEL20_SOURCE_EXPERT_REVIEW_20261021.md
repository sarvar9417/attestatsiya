# QA22 — MS EXCEL savollar.pdf: 20 source-checked tasks, independent proposals

**Source:** owner-connected [MS EXCEL savollar.pdf](https://drive.google.com/file/d/1DFw9gV7IdLty88fAbQcboHeJZERlrELC/view) (5 physical PDF pages). Reviewed rendered original figures for each page and compared all 20 source question rows. The PDF itself has no original answer key. No learner release or production deploy is authorized by this review.

## Private source normalization

Preserved all 20 existing original candidates. Transcribed source figure/jadval cells and math semantics into nine text-only private questions Q5, Q11, Q12, Q14–19. Source index for each is `text_only` and `source_text_only`, but `content_publish_ready=false`. Examples include mixed-address table Q5, Excel student grades and original formula choices Q12, Q14 and Q15 worksheets, four-sector pie Q16, Q17 signed MOD matrix, Q18 payment amounts, Q19 bar chart. Removed the source extractor's Q13 text contamination from option D of Q12 without modifying Q13. The four source A/B/C/D formula variants remain separately recorded.

## Proposed expert-only results (not original keys)

| Question | Independent solution |
| ---: | --- |
| 1 | H2, under the stated numerical-series AutoFill convention |
| 2 | 40 |
| 5 | 3010 |
| 6 | 33 |
| 7 | −1 |
| 8 | site |
| 9 | 15 (possible B1 values −5, 5, 15) |
| 10 | −20 |
| 12 | **C** — the only nested IF correctly mapping all six grades |
| 13 | FALSE |
| 14 | 18 |
| 15 | −8 |
| 16 | 600/11 percent ≈54.55 percent |
| 17 | FALSE; Excel MOD(11,−5)=−4 |
| 20 | saodat |

There are **14 private free-response proposals** and **one MC option C proposal**; all have Uzbek justifications, `needs_editorial_review`, false human approval and zero learner publish readiness. Excel integer-floor semantics in Q15 and negative MOD semantics in Q17 were checked explicitly. Q1's proposed series result depends on Excel AutoFill behavior and must be editor-confirmed, never claimed as the source author key.

## Five original source defects: strict learner holds

| Question | Evidence |
| ---: | --- |
| 3 | Source equates one-argument `FLOOR(A1/C1)` to Russian `ЦЕЛОЕ` (INT), but Excel FLOOR requires its significance argument; original syntax is invalid. |
| 4 | Chart ratio constrains B1 in the nonzero case but never supplies actual A1 or C1, required for the requested numeric expression. |
| 11 | Bar chart implies A2=4, but infinitely many formulas produce 4; no formula constraints or answer choices. |
| 18 | Original inner `ЕСЛИ(...;B2-30%*B2;)` has a trailing fourth argument delimiter; the source must be editorially corrected before scoring. |
| 19 | The diagram implies D2=4; multiple formulas (`=A1+C1`, `=B1-2`, `=2*C1`) work, so no unique formula key exists. |

All five original defects have source-grounded Uzbek evidence in the private `telegram_informatika_pdf_release_blockers` table, with `learner_publish_blocked=true`, `human_approved=false`. Original problems were not silently fixed.

## Repeatable code checks

`scripts/tests/test_informatika_ms_excel20_source_qa22.py` uses standard-library Python to test source calculations, signed remainder, Excel relative/absolute references, nested IF grade semantics, chart percentages, open-ended formula defects and learner release gates. It does not evaluate source strings or connect to production.

**Publication gates:** source original answer keys null, no human approvals, visual index content not publish ready, no original third-party PDF page images committed and no production release/migration.
