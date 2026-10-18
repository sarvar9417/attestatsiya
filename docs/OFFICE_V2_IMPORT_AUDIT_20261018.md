# M03 Office 2.0 — production database staging audit (2026-10-18)

**Source:** Office Attestatsiya 2026 v2.0 (Word, Excel, PowerPoint; user-supplied LaTeX/PDF and JSON).  
**Project:** Supabase `attestatsiya100%` (`plyqezulrfowyblsfpzy`).  
**Module:** `M03`, `microsoft-office`.  
**Release status:** staged in production DB, **not learner-published**.

## Inserted content

- 9 new review lessons `office-v2-w01` through `office-v2-p02` (orders 21–29); 30 questions linked to each lesson.
- 270 imported questions with answer keys, explanation, provenance (`source_reference`) and `source_lesson_id`.
- 162 Y1, 54 Y2, 54 Y3.
- 263 questions in `review`, **7 visual-asset-dependent Y1 questions in `draft`** until diagrams are attached.
- Canonical construct mappings: `S2.OFFICE.01` Word, `.02` Excel formula/functions, `.03` Excel sorting/filter/chart, `.04` PowerPoint.
- Kept the previous **4 published Office lessons, 28 published Office questions** unchanged; no users/attempts/progress were modified.

## SQL audit (read-only, post-import)

| Structural check | Result |
|---|---:|
| New lessons | 9 |
| V2 questions with keys | 270 / 270 |
| Missing source lesson | 0 |
| Missing lesson/construct links | 0 |
| Invalid Y1 correct-option UUID | 0 |
| Invalid Y2 pair-option UUID | 0 |
| Invalid Y3 order-option UUID | 0 |
| Duplicate normalized question stem | 0 |
| Existing published Office questions | 28 |

**Important:** This checks data structure, *not* independent semantic accuracy, full curricular coverage, image display or mock feasibility.

## Blockers before publication

1. Attach seven diagram assets and verify the real question renderer can display them; placeholders are intentionally held in draft.
2. Independent editor review of 270 question items and 9 theory chapters against textbooks and 2026 specifications, including explanation and difficulty.
3. Visually review TeX-to-Markdown table, formula and structure fidelity.
4. Publish only approved items through normal editorial workflow.
5. Validate topic preflight, mock generation quotas, Y1/Y2/Y3 learner interactions and release readiness; if necessary deploy frontend support for diagrams.

Policy: `docs/QUESTION_BANK_SPEC_POLICY.md` (source → construct → review → published). Public Git history must not contain private question bodies or answer keys.

No production learner-facing publication or frontend deploy is claimed by this report.
