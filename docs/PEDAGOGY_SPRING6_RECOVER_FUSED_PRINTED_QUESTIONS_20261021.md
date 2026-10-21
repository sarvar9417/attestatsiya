# Pedagogika bahorgi 2025 (6): to‘rtta birlashtirilgan savolni asl manbadan tiklash

**Sana:** 2026-10-21. Authenticated Google Drive original: `Pedagogik mahorat to'plam 2025 (6).pdf`, file `1-FZJINTG7krHsG227tJ16MBAyEqq8cvP` (88,088 extracted readable characters). Target: private `public.pedagogy_pdf_source_candidates` (Supabase project `plyqezulrfowyblsfpzy`).

## Source recovery with no invented answers

Three previously ingested extraction slots actually contained **seven printed source questions** because page layout had swallowed following question numbers and answer-marker lines:

| Old internal slot | Printed items previously conflated | Correction |
|---:|---|---|
| 19, page 5 | #19 (incomplete conflict-resolution list), #20 (teacher proficiency three-statement list), #21 (definition of reflection) | Original slot 19 now holds only printed #19, **missing** source key. Separate private source slots **199** (printed #20; no printed answer, `missing`) and **200** (printed #21; source `reflexio` marker preserved as `source_marker_unverified`) inserted |
| 120, page 23 | #122 (innovative-educator responsibility) and #123 (subject-integration responsibility) | Slot 120 now contains only #122 and its complete printed source answer. Private slot **201** recovered #123 with its independently source-PDF-matched full printed answer |
| 121, page 23 | #124 (avoiding fixed negative expectations of pupils) and #125 (encouraging respectful conduct) | Slot 121 now contains only #124 and its printed source answer. Private slot **202** recovered #125 with its source-PDF-matched answer, excluding trailing Telegram channel attribution |

**Four new private source occurrences were created**, not four scored questions. All four retain `editorial_status='needs_review'`; source-only answer markers are not independently verified. Printed #19 and #20 do not contain enough reliable source text/answer for scoring and remain `missing`. Source #125 has `pedagogical_semantic_wording_review_required`, because the booklet's proposed wording must not be accepted without independent pedagogical adjudication.

Every original concatenated extraction was archived in the respective parent candidate's **private `review_notes`** (inside the database 4,000-character limit). The two obsolete parent `near_duplicate_of_candidate_id` links were cleared because their source-stem identity changed when printed #123/#125 were removed. The original former target UUIDs remain recorded privately in the parents' editorial notes. The source text hash was recomputed on all six new/revised stems, and the four recovered stems were confirmed as exact substrings of the authenticated original PDF after Unicode/punctuation/whitespace normalization.

## Separately linked published source, printed #22

The original source PDF's **printed #22** has a long multi-line explanation of pedagogik takt. Private extraction slot **20** captured only its first line but is already linked to a published Y1 question, whose pedagogik-takt option content was independently checked for topic consistency. **No linked source answer or public test was changed**. An editorial source-only flag `linked_printed_question_22_answer_line_truncated_source_only` was added for future forensic follow-up.

## Published Y3 clarity work (concurrent revision safeguard)

Current published Y3 questions were inspected for vague ordering directions. **Thirteen of the original generic prompts had already been replaced by more explicit published revision IDs in another concurrent workstream**. Attempting to rewrite stale originals would have conflicted with user attempt history and another publisher's work. The still-published original source question `527051c4-4a1d-40af-b05a-7e31db939441` alone received a **specific, complete proposed revised stem** in `public.pedagogy_revision_queue` with `revision_question_id=NULL`, awaiting independent answer-order validation. No actual Y3 public question or key was overwritten.

## Verification and counts

- **1,095** private PDF source occurrences (up from 1,091); **419** private editorial `needs_review` (up from 415 precisely because four authentic printed source items were recovered).
- Spring-(6) source now has **202** source occurrences, **154** review pending.
- All 7 materialized/revised parent-child source texts (`19,120,121,199,200,201,202`) were compared to the original PDF (in addition to linked source slot 20), and 6 modified/inserted source hashes match. Source slot 20's older baseline hash still differs due to historical extraction layout; no unrelated blanket hash rewriting.
- **Zero** public question, scored answer key, past attempt, or frontend deploy changes.
- Source PDF answers are unofficial; retaining them in private review does not establish historical exam authenticity.

Repeat with `scripts/audits/pedagogy_spring6_recovered_printed_questions_readonly_20261021.sql`.
