# Pedagogika spring 2025 (6): 16 source-answer attribution watermarks removed

**Date:** 2026-10-21. Live source staging table: `public.pedagogy_pdf_source_candidates`.

Authenticated original Google Drive source: `Pedagogik mahorat to'plam 2025 (6).pdf`, file ID `1-FZJINTG7krHsG227tJ16MBAyEqq8cvP`, 88,088 readable characters.

## Primary document verification

Sixteen `needs_review` candidates had pre-existing flags indicating their `raw_answer_private` contained two appended Telegram channel handles. Each whole original answer **including the appended handles** was checked against the authenticated PDF's normalized readable text. Result: **16/16 exact source-string matches** after case/punctuation/whitespace normalization, not guesses from a matching keyword.

Private source slots: **11, 31, 51, 57, 63, 67, 77, 112, 118, 132, 156, 172, 177, 183, 190, 195**.

## Applied fix

- Removed only the trailing `@PedMahoratGuli @Guli_Eshnazarova` source-attribution text from the 16 **unlinked private source-answer fields**, leaving the pedagogical answer text intact.
- Stored every original pre-cleaning private answer marker in its `review_notes`. Guarded each note against the existing **4,000-character CHECK** before updating.
- Replaced stale `raw_answer_contains_telegram_watermark`, `raw_answer_contains_source_watermark` and `source_answer_watermark_must_be_removed_before_key_review` flags with the truthful `source_answer_watermark_removed_original_pdf_verified_20261021`.
- Preserved `answer_key_status='source_marker_unverified'` and `editorial_status='needs_review'` for all 16. Cleaning a source citation does **not** verify its answer semantics.

Postflight counters: **16** cleaned source markers; **0** remaining `needs_review` entries containing `@PedMahoratGuli` in this spring-(6) source; **0** modified records linked to any public question; **0** incorrectly promoted answer-key statuses.

This update changes **no** `public.questions`, `public.question_options`, `public.question_keys`, learner attempt/history or site deployment. The source PDF is a learning/collection source, not independently authenticated as an official historical exam key.

Use the read-only verification query `scripts/audits/pedagogy_spring6_original_watermark_removal_readonly.sql` for postflight.
