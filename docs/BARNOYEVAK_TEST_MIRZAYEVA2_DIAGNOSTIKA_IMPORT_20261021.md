# Barnoyevak Pedagogika — two additional PDF test sources (2026-10-21)

Owner: `barnoyevak@gmail.com` → `pedagogika/files`. Database: `plyqezulrfowyblsfpzy`, private table `public.pedagogy_pdf_source_candidates`. **These records are private source candidates, not approved scored exam questions.**

## Ingested 30 new source occurrences

| Source (Google Drive ID) | PDF pages | Question starts | Private entries | High-confidence cross-file duplicate links | Technical parse flags |
|---|---:|---|---:|---:|---:|
| `Test Mirzayeva 2.pdf` (`1hift44Lh8ThLanRvunTwyxma9MH4bojb`) | 4 | Q1–6 p1, Q7–12 p2, Q13–15 p3 | 15 | 6 | 5 |
| `diagnostika.pdf` (`1o7Vw5Ohu_GkzF64NeOXROpRUb3o3Sgrt`) | 6 | Q1–3 p1, Q4–7 p2, Q8–9 p3, Q10–12 p4, Q13–14 p5, Q15 p6 | 15 | none confirmed yet | 4 |

Both original PDFs were read page-by-page. Every import retained the original private wording, source index, actual starting page, SHA-256 of source text, quality flags and Drive provenance. Inserts used guarded batches of five with `ON CONFLICT ... DO NOTHING`. A post-write database read confirmed 15 distinct numbered records and 15 hashes per source, **all 30** with `editorial_status='needs_review'`, `answer_key_status='missing'`, **no** `linked_question_id`.

### Six source duplicates, preserving an earliest canonical source

| `Test Mirzayeva 2.pdf` | Canonical staged source |
|---|---|
| Q1 | `Mirayeva test 1.pdf` Q11 (pedagogical experiment definition) |
| Q6 | `Test Mirzayeva.pdf` Q6 (ta'lim mazmuni definition) |
| Q8 | `Test Mirzayeva.pdf` Q8 (pedagogika fanining vazifalari) |
| Q13 | `Mirayeva test 1.pdf` Q13 (antropologiya / akmeologiya matching) |
| Q14 | `Test Mirzayeva.pdf` Q14 (o'qitish and ta'lim matching) |
| Q15 | `Test Mirzayeva.pdf` Q15 (maqsad / mazmun matching) |

Manuscript normalization and token-set checks found near-identical content (six 1.00 token-set Jaccard matches against the previous Mirzayeva source). The private `duplicate_of_candidate_id` field was set to existing canonical source IDs; for Q1 and Q13 canonical references avoid duplicate-of-duplicate chains. **The other nine rows are not yet established as genuinely unique** against every existing question.

### Extra editorial blockers

- `Test Mirzayeva 2.pdf` Q7 and Q9: original printed answer option labels use A/B/D/E instead of the expected A/B/C/D; reconstruct options with source verification, do not silently reassign keys.
- Q13–15 are matching-layout questions; preserve left and right columns and their ordering/selection instruction before any interactive rendering.
- `diagnostika.pdf` Q1, Q7 and Q12 matching tables require structured parsing; Q7, Q12 and Q14 include concatenated enumeration markers; Q14's multiple-statement answer variants may be ambiguous.
- `diagnostika.pdf` Q13 tests suitability of branded AI tools for differentiation; independently verify the time-sensitive product capabilities rather than treating the source as timeless truth.
- None of the 30 supplies a reliable independent answer key. No automatic approval or publication.

## Seven source PDFs imported across ongoing work

Earlier baseline PDF candidates: 953 total / 298 pending. After five previously staged PDFs: 1,028 total / 373 pending. **Current verified total: 1,058 / 403 pending.** Seven 15-question test PDF sources now account for **105** new private records, including at least **8 linked cross-source duplicates** (2 previous, 6 new). This does not establish that the other 97 are unique or ready to publish.

## 64-file scope reconciliation

The source manifest `docs/manifests/barnoyevak_pedagogika_drive_64_sources_20261021.csv` was updated for these two PDFs plus fifteen earlier read/staged sources: Word lessons, theory PDFs, standards and image-only demo PDFs. `12 ta ibora.pdf` was inspected as a short engagement-prompt reference sheet; it is not an independently verified exam blueprint or a new scored test source. Keep it as a teaching reference, without reproducing all of its creator-authored phrases in published content.

Other long theory textbooks and the remaining attestatsiya test collections are **not** marked complete. The CSV dispositions distinguish staged, partial coverage, reference-only and image-only blocked material.

## Acceptance and reproducibility

Run `scripts/audits/barnoyevak_pedagogika_seven_test_sources_readonly.sql` to check source counts and duplicate references without leaking raw private question text. Expert-review each candidate for pedagogy correctness, close distractors, matching clarity, near duplicates, credible answer-key evidence and exam construct mapping. Publish only independently verified questions.

**No scored test rows, answer keys, historical attempts or manual production deployments were modified.**
