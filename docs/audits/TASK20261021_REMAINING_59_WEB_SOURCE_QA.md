# TASK-20261021 — Remaining 59 S5.WEB short-explanation review items

**Scope:** item-by-item first-pass technical answer consistency and user-supplied textbook source evidence; **not publication approval.**

## Baseline and actual completed work

In earlier PR #386, 24 of 83 short-explanation review questions received initial substantive checks (16 CSS, 6 MS Access, 2 independently recomputed logic/radix). This follow-up inspects the **59 remaining** S5.WEB questions by source alias without publishing stems, answer choices or confidential answer keys to GitHub.

`TASK20261021_REMAINING_59_WEB_REVIEW_EVIDENCE.csv` gives **one row per source alias** (59 rows) and records technical answer consistency, cited original textbook physical PDF ranges, evidence level, near-duplicate concept clusters, and absent human signoff.

| Topic family | Reviewed | Notes |
|---|---:|---|
| CSS box model (`GV-CS`) | 7 | All seven numeric totals independently recomputed |
| Graphics editor / Photoshop (`GV-ED`) | 18 | Tool purposes, PSD/layers and masks; some exact cited-page gaps |
| Graphics theory (`GV-GFX`) | 12 | RGB/HSV, indexed colors, image dimensions and RGBA bytes |
| HTML (`GV-HT`) | 16 | Elements, links, tables and forms; unsupported advanced attributes flagged |
| Raster/vector (`GV-RV`) | 6 | Bit depth and vector operations; several source gaps |
| **Total** | **59** | All keys conceptually consistent in first-pass reasoning; **not final certification** |

### Evidence classification (based on user-provided physical PDF page text extraction)

- **23 direct:** relevant textbook wording/tool/attribute occurs on the cited original pages. This does not prove the exact question or distractor design is endorsed by the textbook.
- **27 partial:** answer is independently derived from supported subject knowledge/arithmetic, but the exact wording, image-only explanation or all subclaims are not directly in the cited text.
- **9 gaps:** relevant precise term/convention was **not found in the cited page range's text layer**. An embedded image might still provide support; this is **not evidence that the key is wrong**.
- **29** entries share semantic clusters worth checking for test diversity, including CSS box width, PSD/Photoshop mask terminology, image pixel-count multiplication and vector operations. This is a deduplication **risk flag**, not proof that questions are exact duplicates.

### Nine source-evidence gaps for follow-up

| Source alias | Evidence gap |
|---|---|
| `GV2:GV-ED-027` | Paint Select is present; Crop instruction not located in cited ICT5 pages |
| `GV2:GV-ED-039`, `GV2:GV-ED-040` | Layer-mask white/black reveal/hide convention not located in extracted prose |
| `GV2:GV-ED-046` | Gaussian Blur term not located in cited ICT7/ICT5 page ranges |
| `GV2:GV-HT-024` | `required` / `disabled` form attributes absent from cited ICT7 text layer |
| `GV2:GV-RV-006` | RGBA token absent; arithmetic `32/8 = 4` is nevertheless correct |
| `GV2:GV-RV-019`, `GV2:GV-RV-020` | Vector union/intersection terms absent from cited range |
| `GV2:GV-RV-021` | Bring to front UI operation not located in cited range |

**Source corpora inspected:** user-supplied `ICT 7_sinf-2021(1).pdf` physical PDF pp.29–34, 40–47, 47–67 and 106–149; `ICT 5_sinf-2020(1).pdf` pp.67–85/71–83; Cambridge+8 pp.57–85; Cambridge+9 pp.285–303. These are physical/PDF page numbers, not necessarily printed book page numbers. We inspected text-layer evidence and selected technical derivations; we have **not** performed exhaustive visual inspection of every illustration or independently authenticated every archived source.

### Critical discovery: `review` and `archived` use identical source aliases

For each of these **59 aliases**, live data currently has **one `review` edition and one `archived` previous edition**. A naive `JOIN` on `split_part(source_reference, ';', 1)` doubles the count and may falsely flag all 59 as not in review. The companion local SQL was corrected to join the **current `review` edition only**, and reports archived history separately.

Read-only SQL was actually run against the current project:
- 59 expected aliases -> **59 current review matches**, 0 missing
- Current Y1 `format` / option-key structural failures -> **0**
- Archived historical rows -> **59**, **not modified**
- SQL generated only SELECT statements; the file is under `supabase/maintenance` and is not a migration.

## Local checks (NO production writes)

```bash
git checkout main
git pull origin main
psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/maintenance/task20261021_rest59_review_source_matrix_READONLY.sql
```

Read the matrix at `docs/audits/TASK20261021_REMAINING_59_WEB_REVIEW_EVIDENCE.csv`. Local data may be empty or differ from this audited live snapshot until corresponding review and archived fixtures are loaded.

## Next genuine completion gates

1. For the nine source gaps and 27 partial-evidence candidates, visually inspect the exact textbook diagrams/screenshots or locate a more appropriate authorized citation; record specific physical/printed pages. If not supported, preserve their review status and propose narrowly scoped corrections.
2. Address semantic duplication clusters (especially repetitive numeric box-model/pixel-count items) without modifying historical attempts or archived editions.
3. Separately run local authenticated browser tests for 3×3/4×4 Y2 and Y3 matching/scoring; key UUID structural validity is **not** browser correctness.
4. Only stage content corrections with exact source evidence and independent editorial release controls. Never fabricate human signoff. No automatic `review` -> `published`.

**No production SQL mutation, no Vercel deployment, no release-gate override.**
