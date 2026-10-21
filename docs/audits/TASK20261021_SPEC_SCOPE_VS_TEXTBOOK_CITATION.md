# 2026 Informatika attestatsiya spetsifikatsiyasi — original PDF p.5 scope check

**Reference actually read:** user-supplied `Informatika Testlar spesifikatsiyasi.pdf`, **physical PDF page 5**, including the numbered distribution table. This document only establishes **exam-domain scope**; it does not replace a question-by-question textbook citation, specialist verification, or authorized release approval.

## Exam blueprint verified from the original PDF

- **Graphics and web technologies: items 27–31 (5 items)**. Assessed competencies include raster/vector image operations, **MS Paint and Adobe Photoshop** image creation/editing, **HTML text/image/list/table/form tags and their basic attributes**, and **CSS** styling.
- **Database and MS Access basics** (in the larger programming/data section): **2 items**, including SQL foundations and queries on one or more linked tables. Hence SQL-query candidates can be *on-topic* despite the old ICT11 cited pages not explicitly supporting each SELECT/WHERE/HAVING operator.

## Seven original-textbook evidence gaps — syllabus scope vs exact-page citation

The seven remaining `gap` aliases in `TASK20261021_REMAINING_59_WEB_REVIEW_EVIDENCE.csv` are:

| Aliases | Scope in p.5 | Still missing from the specific cited textbook pages |
|---|---|---|
| `GV-ED-039` | Photoshop editing tools | Layer mask's **white region reveals** convention |
| `GV-ED-046` | Photoshop image editing | Exact named **Gaussian Blur filter** (not generic Blur Tool) |
| `GV-HT-024` | HTML form tags and basic attributes | Exact `required` and `disabled` semantics |
| `GV-RV-006` | Raster-image processing | Exact 32-bit `RGBA` four-channel byte layout |
| `GV-RV-019`, `GV-RV-020` | Vector-image operations | Specific Union and Intersection Boolean-path terminology |
| `GV-RV-021` | Vector-image operations | Specific stacking / Bring-to-Front operation |

**Findings:** All seven belong to a **broad competency family** identified in the provided specification; however, **the specified exact feature is not individually enumerated** by p.5, and none of these seven original-book text-layer evidence gaps is resolved merely by quoting the exam blueprint. The already recorded Adobe/MDN/Microsoft/Inkscape guides are independent supplementary technical sources, not retroactive textbook quotations.

## Editorial and selection implications

The distribution **5 graphics/web items** makes balancing the covered concepts material. The 29 same-concept repetition-risk flags in the current bank should be considered when selecting a realistic 50-question mock, rather than choosing several nearly identical pixel-count/CSS box computations. **The specification does not prescribe a numerical deduplication rule**, so no new hard-coded quota is imposed by this report.

MS Access tests are in scope for **SQL basics** under the same original spec p.5, but their textbook page citations still need exact phrase/diagram matching.

The current 23 partial-source items and seven gap items all remain in `review`; the count and mathematical-key QA evidence in `TASK20261021_PARTIAL23_INDEPENDENT_MATH_AND_SOURCE_AUDIT.md` is separate from source admissibility and human signoff.

**No production database write, no migrations, no deployment, and no auto-publication.**
