# Barnoyevak Pedagogika — Test Mirzayeva source reconciliation (2026-10-21)

Source: `Test Mirzayeva.pdf` (Google Drive `1UJCEnK9ZZcXHQnnPoF5B6ctWeeeRU0_I`), original 4-page PDF with 15 numbered questions on pages 1–3. Fetched from owner `barnoyevak@gmail.com` Pedagogika/files.

## Actual import

All 15 private source slots (Q1–Q15) were staged in `public.pedagogy_pdf_source_candidates`, 5 rows at a time. Readback: **15 rows**, **15 distinct source slots and hashes**, **15 missing independently verified keys**, **15 `needs_review`**, **0 public question links**, pages 1–3. The 4th PDF page has no further numbered questions.

## Confirmed cross-file duplicates

Two source questions closely match the earlier `Mirayeva test 1.pdf` (Drive `1vOW2lKakMehLp44h_4CoWakml9oCwkY0`). Comparison of normalized word sets gave Jaccard 1.000, alongside direct matching topic and wording:

| Current source slot | Corresponding earlier slot | Meaning |
|---|---|---|
| `Test Mirzayeva.pdf` Q1 | `Mirayeva test 1.pdf` Q11 | Question about pedagogical experiment / research method |
| `Test Mirzayeva.pdf` Q13 | `Mirayeva test 1.pdf` Q13 | Matching pedagogical anthropology and acmeology |

Both were recorded with private `duplicate_of_candidate_id` links and `cross_source_high_confidence_duplicate` source-quality flags. This preserves per-file provenance **without making either a second public scored question**. The remaining 13 source slots are unverified for *semantic* duplicates with older published items; do not describe them as definitively unique.

Unusual printed numbering/punctuation (Q1, Q5, Q6), matching format (Q13–15), and unconventional option formatting are editorial risks. Their answer keys and distractors remain **unapproved**.

## Cumulative source staging snapshot

- **Five** newly processed test PDFs, **75** new private source records, **2** specifically linked as cross-source duplicates; **none** published.
- Candidate inbox: previous 953, now **1,028** total. Pending review increased from 298 to **373**.
- The count of recorded source occurrences is distinct from the count of publishable **unique, verified** questions.
- Repeat the read-only SQL checks in `scripts/audits/barnoyevak_pedagogika_five_test_sources_readonly.sql`.

## Next quality gate

Check the 13 remaining unkeyed source slots against other imported or published questions, normalize matching stems from their original PDF pages, verify each answer and rewrite weak/implausible distractors before any promotion. Other files in the 64-source Drive inventory remain to be ingested or reconciled.

**No guessed answer keys, no production publication, no change to scored attempts, no manual deploy.**
