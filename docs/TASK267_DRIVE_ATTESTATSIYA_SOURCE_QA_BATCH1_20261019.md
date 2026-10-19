# TASK-267 — Drive Attestatsiya test corpus: source-aware import, batch 1

**Date:** 2026-10-19  
**Result:** 9 private, keyed `review` Y1 candidates imported into Supabase project `plyqezulrfowyblsfpzy`; **0 published**.  
**Release:** BLOCKED pending actual independent human editorial checks. **NO Vercel deployment**.

## Source-of-truth files and boundaries

- [Attestatsiya Google Drive folder](https://drive.google.com/drive/folders/139UU38VTM85dcWJ8FFtgFK7KTCzsfJ7A), especially the `darsliklar` subfolder.
- [`Test.pdf`, 2019](https://drive.google.com/file/d/1tQ1L3-eQ-N3WlWElT83J9iX6RYtuMZeF/view), `§7 Elektron jadvallar`, original PDF pp.49–50, and `§10 Internet/HTML`, PDF p.68; its **answer-table** PDF pp.79–80 was read only as one assertion. Source explicitly warns that some historical questions or keys may contain errors.
- [`20000 LIK informatika.pdf`](https://drive.google.com/file/d/1RU8mzZNhjn3xN7YYTmHh8JNnmWCBf_Td/view), screenshot-based 50-question demo. Visual references: PDF p.7 Q16 (JavaScript), PDF p.10 Q23 (Excel).
- [2026 official content specification](https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view): Word/Excel/PowerPoint, Python/JavaScript and HTML constructs. Specification relevance does not confer answer correctness.

## Live inserted `review` inventory (no public answer keys)

| Source | Source questions | Mapped canonical lesson | Format | Inserted |
|---|---|---|---|---:|
| `Test.pdf` §7 | Q35, Q40, Q60, Q62 | M03.02 Excel functions/formulas | Y1 | 4 |
| `Test.pdf` §10 | Q59, Q61, Q62 | M11.01 HTML text/images/lists | Y1 | 3 |
| `20000 LIK informatika.pdf` | PDF p.10 Q23 | M03.02 Excel functions/formulas | Y1 | 1 |
| `20000 LIK informatika.pdf` | PDF p.7 Q16 | M08.05 JavaScript conditional/loop | Y1 | 1 |
| **TOTAL** | **9 source question instances** | **3 canonical lesson targets** | **Y1** | **9** |

**Post-import live DB verification:** M03 `S2.OFFICE` 5; M08 `S4.CODE` 1; M11 `S5.WEB` 3. All **9/9 `review`**, **9/9 have 4 distinct option records**, **9/9 have a private answer key referring to a real option**, **0/9 have an independent `question_editorial_checks` reviewer row**. The key payload and original private question bodies have **not** been committed to this public repository.

### Independent mechanical/factual QA (not human sign-off)

- Excel absolute-value function: function semantics checked against the distractors.
- Excel referenced cells: inclusive source range plus single-cell arguments counted.
- Excel mixed/absolute cell references: column and row locking traced during copy.
- HTML strong vs visual typography and description-list element semantics distinguished; preserve vintage document language with caveats about modern semantic markup.
- JavaScript loop: original code and input reproduced in Node.js with `prompt` stub, including `break`, result rechecked.
- Excel screenshot: the original table was visually read, the copy-relative expression was evaluated for both rows and the conditional colour rules independently applied.

The absence of a signed human reviewer means **none** of this is a publication approval. There is no automatic or fabricated reviewer ID, and no claim of expert certification.

## Source candidates intentionally excluded or held

1. `Test.pdf` §7 Q31 (classification of Excel cell-reference kinds): historical two-vs-three-type description is ambiguous under the modern relative/absolute/mixed distinction; not imported.
2. `13.04.2026 Attetasiya Tushgan savollar.pdf` Excel Q7 and nested-list HTML Q26: source text has incomplete multiple-choice alternatives; unverified reconstruction is not releaseable.
3. `13.04.2026...` CSS text-colour Q26: only three answer choices were visible in extract; do not silently invent a fourth.
4. `20000 LIK...` visual/diagram or multi-step questions not fully transcribed or independently validated remain unimported; no confidence extrapolation to the entire 50-question demo.
5. Potential browser/search definition items from legacy `Test.pdf` have published or review semantic equivalents already in S6.NET.05, so they were not imported as new volume merely to raise counts.

## Remaining assessment-readiness deficit

`topic_test_preview` in **live production** still shows **25 canonical assessed lessons lacking 339 published/keyed pool slots**:

| Module | Missing slots |
|---|---:|
| M03 | 52 |
| M06 | 38 |
| M08 | 55 |
| M09 | 75 |
| M10 | 26 |
| M11 | 43 |
| M12 | 50 |
| **Total** | **339** |

This **does not become 330** simply because 9 additional `review` items exist. Those are not eligible for learner assessment yet. Existing reviewer-approved question revision evidence must be checked individually before any status transition.

## Safe release sequence

1. In protected admin/editor workflow, compare each imported record against exact textbook/source page, options, correct response, explanation, recent version applicability, semantic near-duplicates, and source licence.
2. Record real reviewer identity, the four explicit editorial decisions and immutable content fingerprint in `question_editorial_checks`. Do not impersonate reviewers or mark AI verification as independent human assessment.
3. Release only approved `review` revisions via the existing guarded workflow with full key/option checks; do not overwrite existing `published` revisions.
4. Run strict 20/20 lesson preflight, 15/50 quotas, browser interaction, mobile and owner isolation in an isolated authorised environment before claiming test completion.
5. Remaining image-only PDFs and fall-demo DOCX should be independently visually transcribed page by page; do not use OCR output or a guessed answer as definitive proof.

**Change boundary:** database insertions were explicitly user-requested, review-only, and additive. Neither Vercel production nor existing published status/answers was changed. This document is an audit trace, not a credential, publishing script, or private answer-key export.
