# Barnoyevak Pedagogika — 2 PDF test batches and sensitive source triage (2026-10-21)

Source: `barnoyevak@gmail.com`, Drive `pedagogika/files`. Supabase: `plyqezulrfowyblsfpzy`, private `public.pedagogy_pdf_source_candidates`.

## Additional 30 source questions actually staged

| Original Drive file | Drive ID | PDF pages | Question start pages | Staged | Missing keys | Manual layout checks |
|---|---|---:|---|---:|---:|---:|
| `pedagogika6.pdf` | `142pFCSv1QjctzOE8q4H34LcudWUaREOu` | 6 | Q1–2 p1; Q3–4 p2; Q5–7 p3; Q8–10 p4; Q11–13 p5; Q14–15 p6 | 15 | 15 | 3 |
| `Pedmahorat 4.pdf` | `1QbLRv4bivc0nOTCjCPXKXTi0Lhp-088P` | 7 (page 7 blank) | Q1–2 p1; Q3–4 p2; Q5–7 p3; Q8–9 p4; Q10–12 p5; Q13–15 p6 | 15 | 15 | 5 |

Original PDFs were fetched and page layout inspected. For each, the 15 source stems/options were segmented by printed question boundaries and inserted in guarded groups of five. **Post-write readback confirmed all 30** with 15 distinct numbers and 15 distinct text hashes per PDF, all `editorial_status='needs_review'`, `answer_key_status='missing'`, **zero public `linked_question_id`**. Contents and answer keys are private; GitHub documents only audit metadata.

Notable quality blockers:
- `pedagogika6.pdf` Q2 has confirmed exactly identical C and D options (source defect; prohibit scored use until rewritten); Q5 and Q14 include matching tables; some multi-statement alternatives need unambiguous instructions. Source text has encoding anomalies.
- `Pedmahorat 4.pdf` Q2 and Q3 were correctly separated on reinspection (false-positive boundary flag removed); Q6 contains an unconventional D answer label; Q3, Q8, Q15 matching formats require manual reconstruction. Further distractor and pedagogical correctness review required before any testing.
- No answer key was independently verified or guessed. No claim of official exam provenance is made.

### Cumulative counters

Immediately before these two PDFs, the PDF candidate inbox contained **1,058** rows, of which **403** were `needs_review`. It now contains **1,088** rows, **433** pending. During this response overall, **four** 15-question PDFs were staged, giving **60 new private source records**. Across ongoing Drive test batching, 9 newly staged PDFs now account for 135 source occurrences, including 8 previously linked high-confidence duplicates. Neither the other 127 nor this latest batch can be described as fully unique, keyed or published.

## Confidential source and teaching reference decisions

- `pdf_6aa7467ea6c64_2026-09-14_00-57-34.pdf` (Drive `1Qv8JKG9yYvP2BT--BVyl52yPdQ2_eoBJ`) is a **test participant results/score roster** with names, results and times, *not a question bank*. This file is **not imported**, and no participant details are reproduced or copied into GitHub.
- `03ff4260-7061-49e2-a5d4-9f6ee74eebe7.pdf` (Drive `1Z-P49dnR2GIWYXuJLprYLP9ZCrQ6UODU`) is Tolipov & Ro'ziyeva, *Pedagogik texnologiyalar va pedagogik mahorat* (2019, 276 pages). It is a substantial theory **reference requiring chapter-by-chapter topic-gap mapping**, not automatically a missing 276-page lesson to copy.
- Both were initially unclassified solely because of opaque filenames. Their verified source type is now represented in the 64-file manifest.
- The 64-source CSV now has **38 dispositioned rows** and **26 awaiting basic source reconciliation**. This is categorization progress, **not** completion or expert approval of 38 files.

## Reproducibility and editorial gates

Run `scripts/audits/barnoyevak_pedagogika_nine_source_batched_import_readonly.sql` for source counts, duplicate links, technical parse flags and public-link check. Independently review all newly staged source texts for errors and near duplicates against published material; validate answers and plausible distractors, then approve individual test entries.

**No answer keys, published test questions, historical attempts or manual production deployment were altered.**
