# Barnoyevak pedagogika — two PDF test sets staged safely (2026-10-21)

Source folder: barnoyevak Google Drive `pedagogika/files` (64 source files). Target: Supabase project `plyqezulrfowyblsfpzy`, table `public.pedagogy_pdf_source_candidates`.

## Completed live staging (not production publication)

| Drive source | Drive ID | Original PDF length | Printed questions | Private staged | Original page beginnings |
|---|---|---:|---:|---:|---|
| `Pedagogika testi 3.pdf` | `1z8igVEuhW_OZPiCCMGGJxNePAzu79yfF` | 5 pages | 1–15 | 15 | Q1–3 p1; Q4–6 p2; Q7–9 p3; Q10–12 p4; Q13–15 p5 |
| `Pedagogik kompetentlik test 1.pdf` | `1LEx-padAsuF4Fa3V9mAGdUL-je6sHjiW` | 4 pages | 1–15 | 15 | Q1–5 p1; Q6–10 p2; Q11–13 p3; Q14–15 p4 |

Each private candidate stores extracted original stem/options, source printed question number, original start page, SHA-256 of staged text, source-quality flags, and a Drive identifier in private review notes. All **30** have `editorial_status='needs_review'`, `answer_key_status='missing'`, `historical_exam_claim_status='not_claimed'`, no published `linked_question_id`. These source PDFs do not supply an independently validated answer key. We did **not** infer any key from the most plausible option or set an official historical-exam claim.

### Source defects correctly quarantined for manual parse

- `Pedagogika testi 3.pdf` **Q9 (p3), Q12 (p4)**: option letters run into previous answer text in extracted text (e.g. A/B and C/D adjacency). They require verification against original page before creating interactive answer options.
- `Pedagogik kompetentlik test 1.pdf` **Q7 (p2)**: four-option answer set missing from original extracted question; this is not a validated multiple-choice item. **Q13 (p3)** and **Q15 (p4)**: matching layout must be reconstructed. **Q14 (p4)**: two left-column item labels are not explicitly numbered in extraction; do not infer a key until source-side visual check.
- `Pedagogika testi 3.pdf` Q1 and Q4 have similar professional-development setups and require near-duplicate review.

### Post-write database verification

15/15 and 15/15 private candidates read back; 15 distinct source question numbers and 15 distinct staged SHA-256 values for each PDF, all missing keys and no live-public links. **6** flagged for manual parsing. Private PDF inbox increased from the previous **953** records to **983**, of which **328** are `needs_review` (previously 298); **0 exact cross-source hash collisions** with these 30 new rows. Exact hashing alone does not rule out near duplicates.

## Theory-source reconciliation also performed

Compared `Pedagogik qobilyatlar umumiy.pdf` (Drive `1vx6tDQ62fQ8AomiVexBsplHHhpCpJuqZ`), `dars tahlili turlari.pdf` (`1TPEO3luBu23qqtvpIAQTWX3_7DcXjaRG`) and `Dars turlari.pdf` (`1L4PXxcviDgk5_iaOW5zLCG7536I6z0Ya`) to existing published pedagogy lessons. Existing `pedagogik-qobiliyat-va-uning-turlari` already discusses perceptive, empathic and kinesthetic abilities; `dars-turlari-rejalashtirish-va-sinfni-boshqarish` explicitly covers six lesson types and all five approaches to lesson analysis, citing both original PDFs. No duplicate theory lessons were generated. A source-by-source conceptual/rights check is still needed to mark full closure.

## Next editorial gate

Verify these 30 original texts against layout, check near duplicates in the public question bank, reconcile their topics with the current exam specification, independently establish correct answers and **plausible distractors**, then accept only individually approved items to live tests. The staged items are not public and cannot change already graded exam results.

Reproduce the checks with `scripts/audits/barnoyevak_pedagogika_two_test_sources_readonly.sql`. The full 64-file inventory is `docs/manifests/barnoyevak_pedagogika_drive_64_sources_20261021.csv`, where dispositions for these 5 documents were updated in the same PR.

**No manual production deploy or auto-publication.**
