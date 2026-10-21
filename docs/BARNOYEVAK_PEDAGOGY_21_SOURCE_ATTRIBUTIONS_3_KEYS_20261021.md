# Barnoyevak pedagogika: full-document provenance correction and source-key triage (2026-10-21)

**Scope:** Supabase `public.pedagogy_pdf_source_candidates`, private source-only editorial inbox. No public question IDs, option answers, learning-attempt data or credentials appear in this report.

## Previously unverified source file provenance — 21 records corrected

Two distinct authenticated Google Drive PDF documents were fetched separately:
- `Pedagogik mahorat to'plam 2025.pdf`, file ID `1O6gJHnMebzKl6T_7WFtecHYvn2HGfkjU`.
- `Pedagogik mahorat to'plam 2025 (6).pdf`, file ID `1-FZJINTG7krHsG227tJ16MBAyEqq8cvP`.

Their **complete readable text extracts** were character-for-character identical (88,088 characters). This is source **text identity only**, not binary file/PDF-page identity.

Within the 50 private `needs_review` candidates flagged `independently_verified`, 21 rows named the first PDF but had been erroneously flagged `pdf_file_identity_unverified` based on an earlier assumption it was only 9 pages. Each original source stem was compared with the complete authenticated readable document:
- **20/21** entire stems match the PDF after Unicode, punctuation and whitespace normalization.
- One source stem (internal slot **192**) matches **completely after excluding only the two Telegram attribution watermarks embedded midway through the actual PDF text**; its separate `negative_wording_review` flag remains.

All **21** retain their original correct filename and are now marked with truthful original-source text confirmation, replacing the superseded `pdf_file_identity_unverified` flag. Their original private text, editorial status `needs_review` and public linkage (none) were untouched.

## Answer-field safety follow-up — 3 private source rows

While independently checking the underlying source, three distinct answer-extraction defects were confirmed:

| Internal source slot | Original PDF evidence | Safe action |
|---|---|---|
| **128** | Printed source answer visibly cuts off in mid-phrase at the next question boundary | Key marked `missing`, old fragment preserved, previous independent-key claim withdrawn |
| **131** | Stored raw answer wrongly repeated the preceding question's answer; the original PDF has a separate combination response | Printed marker corrected in private `raw_answer_private`, previous marker archived in private `review_notes`, `source_marker_unverified` until independently checked |
| **200** | Printed answer is a single methodological category; source-extraction field also included a following research-methods table, making the field 3,666 characters | Original contaminated raw answer **preserved unchanged** for forensics; key marked `missing`; the short printed answer is described in private editorial notes for controlled later reconstruction |

The initial guarded three-row transaction was **rejected and rolled back** due to the database `review_notes` CHECK (`length <= 4000`); therefore no partial state resulted. The next transaction respected that limit and succeeded, preserving the extended original source text for slot 200 rather than truncating evidence.

These flags and corrected statuses were read back from live Supabase. The 21 source-attribution corrections **do not** constitute independent verification of every answer. After three source-key safety corrections, the global count of `needs_review` remains unchanged, while the separate `independently_verified` key-status subset decreases by 3 from the key corrections and by 1 further reviewed duplicate elimination.

## Additional within-source duplicate adjudication

Eight same-source *near duplicate* pairs were compared by **complete normalized stem and normalized printed answer marker**. Some matched only in wording, some carried different answer markers, and some alternative source records were already rejected. These were **not blindly reclassified as exact duplicates**.

`Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf` internal slot **98** matched **both complete stem and source answer** of slot **56** in the same PDF. Slot 56 is already `verified` with `independently_verified` answer status and has an active published question link. Slot 98 (itself not linked to public scoring) was marked `rejected` and `duplicate_of_candidate_id` now points to the canonical source record. Its original text, key and source page remain archived as provenance. Other seven pairs retained their previous review states.

**New postflight:** **415** `needs_review` source records, of which **46** carry `independently_verified` source-key status. This is a source-record quality correction, not learner-question publication.

## CI observation / concurrent work

Historical run for pedagogy publication PR #499 failed fresh DB validation because production-only `TASK-388` migration referenced `pedagogy_owner_release_waivers`, a private owner release record/table not in empty CI. On reinspection, contemporary repository changes in `.github/workflows/ci.yml` already added an explicit skip list for multiple **production-only, data-dependent** migration releases, including TASK-388, while keeping schema/security migrations active. We intentionally **did not** edit the same CI file in parallel. A green re-run after that independent change remains the release CI acceptance criterion.

**No manual frontend deployment, no scored question publication, no changes to learner attempts or existing published keys.**

Read-only verification: `scripts/audits/pedagogy_drive_21_source_attribution_and_key_safety_20261021.sql`.


## Additional original-PDF answer boundary correction: source #57

Authenticated Google Drive `Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf` (file ID `1BL4lXlgWoaP36f1bF30d85J12EjVWZtT`, readable text 133,883 characters) contains **two occurrences of the same source question**. The first original (staged slot **57**, PDF page 13) has its complete printed answer followed by Telegram attribution and an unrelated following `Javob` line. The second occurrence (staged slot **221**, rejected as redundant source provenance) has the same complete stem and the uncontaminated answer.

Guarded live Supabase update for **slot 57 only**:
- Compared the complete original candidate answer against the clean second occurrence plus the specific following-answer contamination.
- Replaced only the private `raw_answer_private` extraction with the independently PDF-confirmed clean complete printed answer.
- Preserved the original raw extraction (including the extraneous next-answer fragment) in `review_notes`, within its `<=4000` length gate.
- Added `raw_answer_overflow_trimmed_primary_pdf_verified`.
- **Retained** `editorial_status='needs_review'` and prior `answer_key_status='independently_verified'`, because answer **meaning** did not change and the key's earlier independent theoretical check was not replaced by a guess.
- Kept public questions, scored keys, and historical learner attempts untouched.

A clean source answer is **not** by itself permission to republish this question. The wording and possible confusion with other methods still need editorial review.

Read-only follow-up check is appended to the SQL audit below.
