# Barnoyevak pedagogika — 2025 spring PDF source-boundary QA (2026-10-21)

Original: `Pedagogik mahorat to'plam 2025 (6).pdf` from Barnoyevak Drive file `1-FZJINTG7krHsG227tJ16MBAyEqq8cvP`. Supabase production staging: `public.pedagogy_pdf_source_candidates`. Original paper is an unofficial source with printed answers that **do not constitute independently verified keys**.

## Completed changes in the private source database

- **49 previously stored source stems** had leading publisher headers or the preceding answer tail trimmed. For 39 of them, the **entire resulting candidate stem** (not just opening words) was matched against the authenticated original PDF's normalized extracted text prior to applying any change; ten additional page-based source checks were done manually. The original pre-cleanup private source wording was archived in private `review_notes`; each cleaned candidate's `text_sha256` was recalculated.
- **41** corrected stems whose internal extraction slot differs from the printed PDF question number now carry `candidate_index_differs_from_pdf_printed_number`. The original numbered PDF position, not the internal extraction slot, must be used for source citation.
- **Two** other starts were already correct because the printed PDF uses a comma after the number (stored slots 159 and 173). Those misleading missing-start parse flags were corrected without changing their original stems.
- **One** unnumbered `Induksiya–Deduksiya–Analogiya` matching block (source slot 2) is faithfully unnumbered in the PDF. It now carries `source_unnumbered_matching_item_requires_layout_review`, not a false extraction-start alert. Its UI directions and scoring key are not approved.
- Original extraction slot **8**, page 3, had concatenated *printed source questions #7 and #8*. It was retired as a non-scoring **rejected malformed extraction**, preserving all original evidence. Two **new private source occurrences** were recovered as internal slots **197 (printed #7: assessment-type matching)** and **198 (printed #8: macro–mezo–micro ordering)**. Source answers were retained as `source_marker_unverified` only, and no public question/key was created.
- After readback, **0 current spring-(6) `needs_review` candidates remain labeled `extraction_stem_missing_printed_question_start`**, down from 52 before this correction pass.

## Live readback counters

| Measure | Verified count |
|---|---:|
| All private PDF source occurrences | 1,090 |
| Across all PDF sources, editorial `needs_review` | 429 |
| Spring-(6) pending source entries | 161 |
| Spring-(6) exact-PDF-text trimmed stems | 39 |
| Spring-(6) initial manually checked cleaned stems | 10 |
| Spring-(6) recognized comma-numbered starts | 2 |
| Spring-(6) recognized source-unnumbered matching block | 1 |
| Spring-(6) recovered source occurrences | 2 |
| Spring-(6) unresolved missing-stem-start flags | 0 |

**Why pending is 429 rather than 428:** the malformed old extraction was retired (-1 pending) while two previously conflated real printed questions were recovered (+2 pending). The count rose by one because the original file contains two actual items, **not because an unverified question was approved or published**.

## Editorial restrictions / remaining work

- These were **source-text structure** fixes only. `answer_key_status` for the 49 cleaned candidates remained `source_marker_unverified`; they were not promoted to `verified` or made public.
- `technical_parse_pending`, questionable answer associations, matching-table layouts, source watermarks and incomplete question stems need further human/editorial verification even after a correct opening boundary is found. Particular risk: source slot 21, printed #23, retains an unresolved source-question boundary interpretation flag after removing the prior answer tail.
- Review source-only printed answers against independent pedagogical theory and build **plausible alternative options** (where justified) before admitting a question into any scored tests. Keep all historical user attempts and public keys unchanged.
- The 2025 spring PDF (5) and one unnumbered Drive copy yield the same readable text as (6), but text equivalence is not a claim of binary PDF identity; do not import them as separate independent test banks.

Read-only validation SQL: `scripts/audits/pedagogy_spring6_boundary_repair_readonly.sql`.

**No production deployment, scored question edits, public question publication, or manual data exposure.**
