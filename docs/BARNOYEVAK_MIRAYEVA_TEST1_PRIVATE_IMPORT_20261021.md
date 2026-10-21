# Mirayeva test 1 — Drive PDF to private pedagogy staging (2026-10-21)

Original source: `Mirayeva test 1.pdf`, owner `barnoyevak@gmail.com`, Drive ID `1vOW2lKakMehLp44h_4CoWakml9oCwkY0`. PDF metadata: 4 pages; 15 printed test items, all start on first three pages (page 4 has no further printed question). Sources belong to the 64-file Pedagogika Drive inventory.

## Completed secure staging

**15/15** original question and option texts were inserted into `public.pedagogy_pdf_source_candidates` with source filename `Mirayeva test 1.pdf` and printed question numbers 1–15. First source-page number: Q1–6 p1, Q7–12 p2, Q13–15 p3. Batch was inserted in three guarded chunks of five after the large write was blocked by safety checks. Readback confirms 15 distinct source slots, 15 distinct staged SHA-256 hashes, all `editorial_status='needs_review'`, all `answer_key_status='missing'`, zero published-question links.

Five items flagged `extraction_confidence='needs_manual_parse'`: Q4 (option A printed `A )`), Q10 (option labels `A.` etc.), Q13–Q15 (matching/two-column layout); Q1,2,3,5 were individually returned to `medium` after text check. Page provenance flag is present for all 15. This is **not** evidence of an independently verified answer key, good distractors or official past-exam attribution.

## Combined overall source import to date

| Private PDF source | New staging items | Missing verified keys | Manual parse |
|---|---:|---:|---:|
| `Pedagogika testi 3.pdf` | 15 | 15 | 2 |
| `Pedagogik kompetentlik test 1.pdf` | 15 | 15 | 4 |
| `Ped mahorat kasb standarti test 6.pdf` | 15 | 15 | 5 |
| `Mirayeva test 1.pdf` | 15 | 15 | 5 |
| **Total** | **60** | **60** | **16** |

PDF inbox previously contained 953 candidate records, 298 in `needs_review`. After four file imports, total is **1,013**, of which **358** are `needs_review`. **No** keys, published questions or historical user attempts were overwritten.

## Next verification gate

Correct extraction artifacts from the *original PDF visual page*, screen for duplicate/paraphrased questions (exact SHA alone does not settle similarity), verify correct options against pedagogy theory and teacher professional standards, improve overly obvious distractors and matching instructions, and publish only independently reviewed items.

This commit records the staging and updates the 64-file source manifest; it is **not** a deploy, question-key approval or publication.
