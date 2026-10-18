# M02 QA4: 2026-10-18 review-bank reconciliation

## Release status: HOLD (not fully complete)

This note documents the **review-only** updates of the M02 question bank and is **not** approval to publish or deploy. No answer texts or answer keys are committed to Git.

| Database invariant | Verified state |
| --- | ---: |
| KTD source PDF entries | 540 |
| Semantically overlapping entries excluded earlier | 12 |
| Imported KTD review questions | 528 |
| Distinct Y1 answer options | 2,112 |
| Linked answer keys | 528 |
| KTD published | 0 |
| Separate previous KT/HW held candidates | 387 |

## Editorial wave 4

10 `review` questions were revised against the relevant PDF-page passages in the user-provided ICT/Cambridge+ books. Each revision retained its original answer-option ID and selected answer letter and updated the stem, four options, source reference, and explanation. Changes were made **in Supabase review rows** in two atomic batches of six and four; no public learner rows or deploy were changed. Precise traces and question text are in a user-private QA archive, **not** this repository.

Verified current mechanical warnings across 528 questions:
- Correct option uniquely longest by **characters**: 139 (down from 149).
- Correct option uniquely longest by **words**: 79 (down from 87).
- Word-length ratio above 2: 119.
- D/E two-assertion true/false template: 84 candidates for re-authoring.
- Source-citation extractions with stray PDF headers in the local source-parsing corpus: 216.
- Current 10 model-assisted page comparisons **do not constitute independent expert signoff**. All 528 items still need publication review.
- `KTD-03-030` and `KTD-15-030`: provided source pages do not directly prove the claimed specifics; require new source evidence or substitution.

## Acceptance gate

The section cannot be marked fully completed unless:
1. Source evidence and conceptual independence are documented at item level for every intended published item.
2. Correct answer and each distractor can be explained; longest-answer and naive lexical giveaways are removed; genuine D/E challenges replace shallow templates.
3. Four canonical learner topics preserve source-based theory and navigate to working published question pools without `topic_pool_insufficient`.
4. The real authenticated end-to-end learner journey (theory → question → answer → result → back/next lesson) passes on a controlled environment, not merely a mocked CI smoke test.
5. Owner explicitly authorizes `main` merge and production deploy. Do not confuse the separate review database updates with application release.

At present, **Draft PR #135 remains unmerged**. No new production deployment or KTD publication is authorized by this document.
