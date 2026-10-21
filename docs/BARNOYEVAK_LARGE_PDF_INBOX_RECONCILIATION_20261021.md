# Barnoyevak Pedagogika — existing large PDF inbox crosscheck

2026-10-21: A read-only grouping of the live `public.pedagogy_pdf_source_candidates` table by `source_file_name` was reconciled with five source-file IDs in the existing 64-source Drive manifest. These were **already present in the database before the current two-file import**; never count them as new questions added in this PR.

| Drive PDF | Source candidates already present | Verified editorial candidates | Still `needs_review` | Linked to public `questions` |
|---|---:|---:|---:|---:|
| `Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf` | 273 | 49 | 12 | 49 |
| `PedKasb tushgan testlar PedMahoratGuli (1) (1) (1).pdf` | 190 | 66 | 11 | 66 |
| `Pedagogik mahorat to'plam 2025.pdf` | 150 | 24 | 27 | 24 |
| `Pedmahorat to'plam 2025 kuzgi (3).pdf` | 78 | 22 | 56 | 42 |
| `Attestatsiya-2026. Robiya Xatamova 1.pdf` | 15 | 0 | 15 | 0 |

Counts for `verified` and `linked` are intentionally separate: in the 2025 autumn (3) set, linked source records may still have `needs_review` and technical-parsing flags. A published-link count by itself does **not** certify every current source candidate. Similar items, material duplicated in other files, and source boundary errors require manual editorial checks.

The Robiya original PDF did not yield usable readable text through authenticated extraction, so its 15 pre-existing unkeyed candidates remain visually unverified. Do not add guessed keys or new near-duplicate rows.

This reconciliation updates **five previously unclassified Drive manifest dispositions**. Together with the prior 21 modifications in this branch, **26 previously pending manifest rows** now show evidence-grounded status. It is not a claim that all files were processed or reviewed to completion.

No new scored questions or production deploy were made in this crosscheck.
