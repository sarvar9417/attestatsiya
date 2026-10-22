# TASK-437 — MS Access PDF visual-source recovery and query-grid QA

Source: [MS Access savollar.pdf](https://drive.google.com/file/d/130SJl3LEn14uvVajDGbhCody_cOuwwbN/view). Source PDF checksum: `4e4aa5d525966840dd7a1ff8f0201bd65fd0881596b8eedc4216948e58be0c6c`.

## Exact graphical source inventory

Eight original source image snapshots were rendered at 2x resolution, **without cropping off tables or Query Design settings**, from source PDF physical pages:

| Original question | Source PDF page |
|---:|---:|
| 2 | 1 |
| 6 | 2 |
| 8 | 3 |
| 10 | 4, upper half |
| 11 | 4, lower half |
| 14 | 5 |
| 15 | 6 |
| 19 | 8 |

Review ZIP: `TASK437_ms_access_eight_visual_review.zip`, **4,592,970 bytes**, SHA-256 `c2b1b70f589fbf1147e379c34a930e9881df549da764d50bb861b254cfdb4529`. Includes 8 PNGs, per-image hash manifest, original checksum, and contact sheet. It is attached privately to the working conversation, **not placed into public GitHub files or Supabase learner Storage**. Original 8 question candidates were flagged `qa20261022_msaccess_8_source_images_review_only_not_public` with source fields unchanged.

## Verified screenshot semantics

The original Q10/11 PDF page 4 tables were visually inspected. The Access Query Design Criteria in the original are:

- **Q10**: `nomi LIKE '*n*'` AND `jami kg >80` on the **same Criteria line**. Results **Anor (90 kg), Banan (120 kg)**, 2 records. The image contains five starting fruit records (Ananas 50, Anor 90, Banan 120, Limon 64, one other without `n`).
- **Q11**: `nomi LIKE '*n*'` on the Criteria row and `1 kg narxi <=20000` on the distinct `Or` row. Results **all five rows**; the row without `n` qualifies because its price is 15000.

These two results had already been computed in private `attest_ingest.telegram_informatika_pdf_free_response_qa`; they were not overwritten. `scripts/task437-msaccess-screenshot-query.test.mjs` independently recomputes the original same-line AND and separate-line OR, with a dedicated CI workflow. **No live Y1 question or user answer was modified.**

## Publication gate

These source visuals are not yet attached to stable version-specific question assets. Learner publishing them without cleanup/mapping and page visual QA is prohibited. The next stage must upload safe assets to permissioned storage, map each source and the exact four question choices (where available) to an immutable new question revision, and check rendering/mobile UI.
