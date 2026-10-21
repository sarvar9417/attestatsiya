# TASK-346 QA31 — Normalize legacy PDF answer option objects

**2026-10-21. Private review schema hygiene only; no author key assignment or learner publication.**

## Actual Supabase staging actions

A query of `attest_ingest.telegram_informatika_pdf_question_candidates.extracted_answer_options` found **152** rows in **15 distinct PDF source files** using legacy four-string JSON arrays such as `["choice A", "choice B", "choice C", "choice D"]`. Other candidates already stored four objects `[{"label":"A","text":"choice A"}, ...]`. All 152 legacy records had exactly four nonempty strings. There were **0** mixed object/string arrays and **0** assigned source keys among these 152 rows.

A transaction with count and blank-content guards converted **152/152** legacy arrays to labeled JSON objects `[{"label":"A","text": original[0]},...,{"label":"D","text":original[3]}]`. Conversion preserves every string byte (including Unicode text, embedded newlines, spaces and punctuation), source option order, candidate question text, answer key state, and all private publish gates. Every changed record has an explicit QA31 audit flag.

Post-write live readback confirmed:

- **152** records flagged and verified with ordered, exactly `ABCD` labels and nonempty text.
- **0** remaining all-string four-choice arrays.
- Example source *Axborot kodlash test.pdf*, question 2: all four original alternatives are present with labels A–D; the original underconstrained bit-encoding problem remains blocked by its independent release gate.
- **657** total private candidate records, **0** author answer keys assigned, **0** learner-publish-ready.

This is a **structural serialization fix** only. It does not correct poor distractors, fill incomplete answer options, resolve 75/80-option aggregated source defects, or authorize official responses.

## Regression and release isolation

`scripts/tests/test_informatika_options_qa31.py` has **eight pure stdlib unit tests** for four-choice conversion; Unicode and source whitespace preservation; idempotence of existing objects; rejection of empty/incomplete/aggregated or mixed-format options; label-order validation; and no answer key creation. Eight tests passed independently in a local offline version.

No private original PDF/image bytes in Git, learner schema changes, RLS migration, official key promotion or manual production deploy. CI must pass required `quality` before merge.
