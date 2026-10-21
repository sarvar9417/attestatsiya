# Pedagogika — source QA, exact versus near duplicates, 2026-10-21

Source set: `barnoyevak@gmail.com` Google Drive `pedagogika/files`; destination is private Supabase `public.pedagogy_pdf_source_candidates` in project `plyqezulrfowyblsfpzy`.

## Database corrections actually executed and rechecked

### 1. Correctly classify 15 non-identical 2026 source records

All printed positions 1–15 under `2026 tushgan test 1.pdf` were previously linked via `duplicate_of_candidate_id` to same-stem items in `PedKasb tushgan testlar PedMahoratGuli (1) (1) (1).pdf`. Whole stored source-text comparison shows **all 15 differ** from their reference (the 2026 file includes additional alternatives/table material in many cases). Using the previous link as *exact copy* is therefore inaccurate.

**Done:** migrated each pointer to `near_duplicate_of_candidate_id` and cleared `duplicate_of_candidate_id`. Readback: 15/15 now near-duplicate-only pointers, none linked to a learner question, all remaining `needs_review` with `missing` keys. The source text and previous exact-reference link target ID were preserved.

### 2. Two actual full-stem duplicate records retired

A *different*, stricter verification removed the source question number, case, whitespace and punctuation from both **complete** stems. `Test Mirzayeva.pdf` Q1 and `Test Mirzayeva 2.pdf` Q1 matched canonical `Mirayeva test 1.pdf` Q11 under that transform (normalized text length more than 80 characters). They were marked `editorial_status='rejected'`, with the original source records and duplicate links retained for provenance; **no deletion**. Neither source candidate was linked to a public scored question, both keys were `missing`.

**Important:** same stem is not always same test when multiple-choice alternatives differ. Full exact matching here applies to the stored source stem only; no answer-key transfer, source test approval or public publication was performed.

### 3. 95 spring-source complete-stem equivalence links

`Pedagogik mahorat to'plam 2025 (6).pdf` was compared to the pre-existing `Pedagogik mahorat to'plam 2025.pdf` source candidates using complete-question normalization (remove leading printed question number, punctuation, whitespace and case). **95 distinct pending source records** were matched to **92 distinct older source records**. Their `near_duplicate_of_candidate_id` references were populated without overwriting any existing linkage. Parent selection prioritizes already published / verified representative records. **16** matched representatives were `verified` and already linked to public questions.

All 95 remain `needs_review`; the source answer field, editorial review and learner question keys remain untouched. A matching source stem does NOT justify reusing a printed answer marker without confirming each option set. Readback confirmed **zero broken references, zero self-references, and all 95 remain in review**.

### 3a. Eleven independently confirmed copies of already published questions

A further pairwise editorial check showed **11 of the 95 full-stem-linked** spring (6) candidates also have exactly the same *complete normalized source answer marker* as an older `verified` / `independently_verified` and publicly linked counterpart (after stripping only Telegram attribution, case and punctuation).

Private source slots **43, 107, 116, 117, 126, 144, 153, 171, 185, 187, 194** were therefore moved from `needs_review` to `rejected` as **redundant source occurrences of already published items**, retaining the raw source and canonical relationship for audit. The 11 candidates themselves have **no public links**. The five other candidates with **incomplete extracted source answer fragments** were not rejected on this rule and remain `needs_review` and `missing` as documented below.

### 4. Five extracted source answers confirmed incomplete

Of 16 links to a verified/published counterpart, **11** spring source answer markers agreed with their verified counterpart under normalized watermark-stripped answer text. **Five** were shorter because the spring source extraction stopped at a line wrap:

| Spring source slot | Earlier source slot | Source defect |
|---|---:|---|
| 48 | 50 | Answer ends before the following word / final verb |
| 104 | 106 | Missing final phrase about identifying tasks |
| 105 | 107 | Missing final action verb |
| 106 | 108 | Missing phrase about timely differentiated support |
| 152 | 156 | Missing continuation specifying time horizon and plan formulation |

All five original answer values were crosschecked against original authenticated spring PDF text, whose **following line is present**. Original `raw_answer_private` was left unchanged. Private `answer_key_status` moved from `source_marker_unverified` to `missing`, with `printed_answer_fragment_truncated_source_line` editorial flag. These five are **not new scoring keys**, and the independently reviewed counterpart keys were not copied.

### 5. Counts and boundaries

Readback shortly after this batch: **1,091** total private PDF source records and **417** `needs_review`. Counts are live snapshots (other work may also change the inbox); two source-exact copies and eleven duplicate copies of already published items were retired (13 pending slots total); 95 stem linkages and five truncated-source-answer flags do not independently approve other items.

This batch did not touch `questions`, `question_options`, `question_keys` or user attempts. No manual production deploy was performed.

## Next substantive gates

- Review remaining spring (6) candidates without matched full stems individually against the original PDF and compare full alternatives before promoting.
- Scrutinize the 50 pending records with independently verified *key claims*; many are blocked by weak stems, near duplicates, or incorrect source-type labels. Independently verified key alone does not mean publishable item.
- Check 2026 full option sets for semantic as well as stem equivalence; do not restore `duplicate_of_candidate_id` unless exact source equivalence is proven.
- Repair five truncated answer extractions from **full source PDF** through a controlled review workflow; do not silently borrow answers from a different candidate.

Use `scripts/audits/pedagogy_20261021_cross_source_integrity_readonly.sql` to re-check the relevant relationships without revealing protected stems or keys.
