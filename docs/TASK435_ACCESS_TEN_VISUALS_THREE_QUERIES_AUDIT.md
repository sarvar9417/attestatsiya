# TASK-435 — MS Access 10 screenshot source restore and query results QA

Original Google Drive: [Access takrorlash savollari.pdf](https://drive.google.com/file/d/1sH3-BRvavsci_OfwB2Eu5Y3DIYeSpWJP/view), **10 physical PDF pages**, source SHA-256 `ebc196d70da487e603d4d1b5706d15d2cbd6133a546fc77e7888854ddd653f63`.

## Graphical review source assets

Questions **1,2,3,7,8,10,11,12,13,14** require source table and/or query screenshot. All 10 matching question/page PNGs were rendered at 2.1× resolution and packaged in a **private review-only archive**, `TASK435_access_10_visual_source_review.zip` (2,746,991 bytes, SHA-256 `7997df4d374c706fe063138ebe7975c8d66c930d86d929b1729b4d99e440b1a3`). It includes PNG per question, contact sheet, original SHA256 and per-image checksums. The archive is attached to the working conversation, **not** a public GitHub/Supabase Storage object. DB source candidates have the idempotent private flag `qa20261022_access_visual_review_archive_10_pages_not_public`; original source answer keys remain null.

Page mapping: Q1→PDF1, Q2→PDF2, Q3→PDF3, Q7→PDF5, Q8→PDF6, Q10/Q11/Q12→PDF8 (individually cropped), Q13→PDF9, Q14→PDF10.

## Independent evidence for three previously unsolved image exercises

| Original question | Original screenshot query | Exact result | Matching original image by order |
|---|---|---|---|
| 7 | `mevalar.jami_kg>=18` AND `mamlakati Like "*a*"`, all five columns shown | ID1 Shaftoli (25 kg, Uzbekistan), ID5 Mango (22 kg, Braziliya) | third |
| 8 | `meva_nomi Not Like "*a*o*"` AND `narxi>15000`; Show checked only for ID/name/price | ID2 Banan 22000, ID3 Kivi 28000, ID4 Mandarin 24000 | fourth |
| 13 | SQL `SELECT product_name,price,region FROM market WHERE price<18000 AND product_name Like "*l*e*" ORDER BY unit` | Apple, 14000, Uzbekistan (unit does NOT become selected column) | second |

Original PDF source page images were visually inspected and query results independently recomputed. Three new private `attest_ingest.telegram_informatika_pdf_free_response_qa` explanations for Q7, Q8, Q13 now exist (`human_approved=false`, `publish_ready=false`, `requires_source_visual=true`). Original answer-option screenshot files have **not** been uploaded/mapped as learner assets. Do not mark original candidates as published.

Repeatable Node checks: `scripts/task435-access-pdf-query-grid.test.mjs` plus dedicated GitHub Action.
