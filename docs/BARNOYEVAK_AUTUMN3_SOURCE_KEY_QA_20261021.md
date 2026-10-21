# Pedagogika kuzgi (3) — 2026-10-21 source-marker review

Source: Barnoyevak Drive `Pedmahorat to'plam 2025 kuzgi (3).pdf`, authenticated file ID `1xWf80PkokZJ_fwo6L7ICbFBHpPNt5xnM`. Source-text check confirmed the **complete** stored wording (not just a prefix) of the five discussed private candidates in the original PDF text.

**Important:** this is a source-specific answer-marker contradiction review; the booklet's printed answers do not establish official attestatsiya keys.

## Four confirmed conflicts (private `answer_key_status='conflict'`)

| Internal source slot | PDF page | Evidence of error in booklet | Publication action |
|---|---:|---|---|
| 24 | 8 | Source key includes statement 2, which explicitly describes the rude gesture / inappropriate conduct that the stem says must be avoided; it excludes another aligned statement | Do not score; review the entire statement set |
| 28 | 9 | Source key pairs the concept of *ta'lim* with a definition of *bilim* in a two-column matching item | Independently reconstruct/verify matching pairs |
| 31 | 10 | Source key omits statement 3, despite the stem asking to avoid harmful speech and statement 3 explicitly saying to avoid rude speech | Re-evaluate stem and close statement options |
| 36 | 11 | Source pairs *ta'lim vazifalari* with a definition about factors in instructional effectiveness, not instructional tasks | No reliable complete matching key; rewrite |

For each, the stored **original** `raw_answer_private` was retained for audit, while `answer_key_status` changed only from `source_marker_unverified` to `conflict`. All 4 retained `editorial_status='needs_review'` and no `linked_question_id`.

## One separately blocked malformed item

Source slot **35**, page 11, contains an answer statement 4 represented as an unfinished ellipsis in the printed booklet. Its printed answer includes statement 4. The candidate remains `source_marker_unverified` with a new `source_option_4_truncated_in_pdf` technical flag. Neither guessing the omitted text nor assigning a replacement key is appropriate.

## Original question numbering

Thirteen **unlinked review** candidates contain genuine printed question numbers that differ from their extraction slot numbers: 4, 7, 8, 14, 16, 41, 44, 46, 48, 51, 67, 68 and 71. Each now carries `candidate_index_differs_from_pdf_printed_number` plus a private provenance note. Matching list items that *start* with `1.` (for example a “Masofaviy ta'lim” list) were **not falsely treated as new question 1**. Published-linked candidates were left untouched.

## Counters and remaining gate

This PDF has **78** previously ingested private source rows, **56** still `needs_review`, and **22** earlier `verified` editorial rows. The four corrected key conflicts remain pending; this task **does not lower the review count by pretending to approve them**. The larger cumulative private PDF inbox remains 1,090 with 429 `needs_review` as of this audit.

Source-only changes; **no public scored question, answer key, historical attempt, or manual deployment affected**. The original PDF source itself may be unofficial and its exam provenance remains unconfirmed.

Repeat using `scripts/audits/pedagogy_autumn3_source_key_conflicts_readonly.sql`.
