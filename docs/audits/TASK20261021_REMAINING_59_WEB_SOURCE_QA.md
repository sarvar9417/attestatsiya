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

- **29 direct:** relevant textbook wording/tool/attribute occurs on the cited original pages. This does not prove the exact question or distractor design is endorsed by the textbook.
- **23 partial:** answer is independently derived from supported subject knowledge/arithmetic, but the exact wording, image-only explanation or all subclaims are not directly in the cited text.
- **7 original-book text gaps:** relevant precise term/convention was **not found in the cited page range's text layer**. An embedded image might still provide support; this is **not evidence that the key is wrong**.
- **29** entries share semantic clusters worth checking for test diversity, including CSS box width, PSD/Photoshop mask terminology, image pixel-count multiplication and vector operations. This is a deduplication **risk flag**, not proof that questions are exact duplicates.

> **Correction after a visual/original-text check:** `GV2:GV-ED-027` has textbook support in ICT 5-sinf (2020), physical PDF p.77 (rectangle selection followed by crop/«обрезка»). The old `gap` flag was a false negative; the question should say *Paint.NET* rather than generic *Paint*. Remaining 8 entries have independent vendor/web-standard references documented separately in `TASK20261021_NINE_SOURCE_GAPS_PRIMARY_EVIDENCE.csv`. These do not retroactively make the cited textbook pages contain that material.

### Eight original-book text evidence gaps for follow-up

| Source alias | Evidence gap |
|---|---|
| `GV2:GV-ED-039` | Layer-mask white/black reveal/hide convention not located in extracted prose |
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


### 2026-10-21: direct textbook page audit — three corrected classifications

Three previously marked `partial` entries have direct explanation in the **user-supplied `ICT 7_sinf-2021(1).pdf`** (physical PDF pages):

- `GV2:GV-ED-008`: physical **p.64** describes selecting *Add layer mask* and hiding the flower layer (`gul qatlami yashirinadi`). This directly supports a layer mask controlling visibility. It does not establish the **black/white mask convention**, which is a different question.
- `GV2:GV-HT-017`: **p.138** defines the `name` field identifier sent with form data; **p.142** explicitly describes the `<label for>` reference to the HTML element's `id`.
- `GV2:GV-HT-018`: **p.139** describes one-choice `radio`, **p.140** multiple-choice `checkbox`, and **p.144** shows three radio buttons sharing `name="who"`.

The verified tally for the 59-row evidence matrix is now **29 direct, 23 partial, 7 original-book gaps**. This upgrades *source-text support* for these concepts; it is not exam publication approval or evidence of exhaustive visual inspection of every page. Original answer keys, review statuses and archived editions are unchanged.

### 2026-10-21 follow-up: actual PDF image and text inspection (not web inference)

Three evidence levels changed after inspecting **user-supplied ICT 7_sinf-2021(1).pdf physical PDF pages 31 and 64** as rendered images, and checking actual `review` stems and stored answer variants against those pages.

1. **`GV2:GV-GFX-023` — direct.** The original textbook's p.31 RGB truth table explicitly shows **R=0, G=0, B=0 → Qora**. The old inference-only classification was too cautious.
2. **`GV2:GV-RV-005` — direct.** The same p.31 states modern RGB uses **24 bits per pixel**, with **8 bits each** for red, green and blue. `24/8=3` raw bytes is an immediate unit conversion. This does not claim a compressed PNG or JPEG file occupies 3 bytes per pixel on disk.
3. **`GV2:GV-ED-040` — partial, visual support.** On p.64, Photoshop step 5 shows **black foreground color**, a black mask thumbnail and diminished flower visibility after the layer-mask action. This visually supports *black conceal*, but the surrounding prose does **not** state the general white/black mask rule. Keep `ED-039` (white reveals) as an unsupported **original-book page** claim; vendor guidance already documented in the separate supplement.
4. **`GV2:GV-HT-019` remains partial.** ICT7 physical p.115 explicitly shows both `<b>` and `<strong>` with bold typography but does **not** explain the HTML semantic importance distinction claimed in the keyed answer. Do not cite that page as direct evidence for `strong` semantics; standards-based supplemental documentation is needed.
5. **`GV2:GV-GFX-008` remains partial.** ICT7 physical p.42 explains three spatial dimensions (height, width, depth), but does not name the third Cartesian axis `z`; 3D concept and axis-label proof are distinct.

The new **59-item matrix totals 29 direct, 23 partial, 7 original-book gaps**. The 7 gap count measures *original book citation* support, not factual wrongness. Source checks were scoped to the affected PDF pages; an exhaustive cross-book proof is still pending.

The same original p.31 includes a worked *24-color/640x480* example using 5 bits to encode 24 possible colors; this must **not** be silently read as a 24-bits-per-pixel example. Verify palette-bit-depth vs true-color bit-depth when reviewing future numeric explanations.

**No question texts or answer keys were published to GitHub, no database mutations, no human signoff or deployment occurred.**
