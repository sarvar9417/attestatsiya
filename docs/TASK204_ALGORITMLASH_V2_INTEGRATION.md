# TASK-204 — Algoritmlash V2 source-based content staging
Date: 2026-10-18. Repository: `sarvar9417/attestatsiya`. Module: `M06`, official group: `S3.ALGO`.

## Imported content
- 8 structured theory chapters, imported as **new** `review` lessons, with source-based Markdown and 2 block elements per chapter.
- 3 supplementary `review` lessons: Appendix A (14 solved examples), Appendix B (error-review sheet), source and curriculum coverage register.
- 240 new original practice questions: **222 Y1, 9 Y2 and 9 Y3**.
- 228 questions in `review`, 12 diagram-dependent Y1 questions held in `draft`, with missing-illustration warning. All are `is_generated=true`.
- Every question linked to one of the new eight chapter lessons and one of `S3.ALGO.01-04` constructs. Stable `source_reference='algoritmlash-v2:ALG-XX-YYY'` and deterministic UUIDs, replays avoid duplicates.
- Original V2 LaTeX/PDF/JSON remain authoring source outside this repo; no large copyrighted textbook uploads.

## Safe staging / release gates
**Production rows have been inserted through database migrations, but NOT published.** Existing 4 published M06 lessons, older S3.ALGO questions, published revision history and learner attempts were not overwritten.

AI-authored content cannot be `published` without an actual authorized expert's approval. Do not bypass this guard by changing status directly. Reviewed questions should be published via the canonical author/revision workflow and with source/answer-key verification. This branch must remain **draft** until owner approval and release QA.

For 12 graphical questions, create readable SVG assets and insert valid `questions.assets` references before review/publishing. The seed includes explicit draft warnings, not misleading empty images. For 8 theory chapters, check Math renderer and flowchart representation in mobile learner UI. Theory text includes LaTeX math, source locators and PDF references; diagrams removed from the editable text are described and need corresponding digital figures.

## QA executed on Supabase `attestatsiya100%`
- 11 `review` theory lessons, 39,126 characters of lesson Markdown, appendix A contains A14.
- 240 question records; 240 answer keys; 0 missing lesson links.
- 222/222 Y1 correct answer keys refer to a real option; every Y1 has 4 options.
- 9/9 Y2 pair maps validated against 3 left/3 right options.
- 9/9 Y3 ordered sets validated against existing 3-5 options.
- 228 `review`, 12 `draft`. 0 new content published.
- Further verification: `supabase/tests/task204_algoritmlash_v2_review_contract.sql`.

## Unfinished acceptance
- Expert signoff on all content; inspect original source references and test errors.
- SVG diagrams for 12 graphical questions, and theory flowcharts for full learner experience.
- Preview E2E: theory reading, Y1/Y2/Y3 submission, topic test scoring, responsive mobile output, no key disclosure.
- Controlled approved publishing flow, merge and deployment *only with explicit release authorization*.

### Task handoff
Task: TASK-204 V2 Algoritmlash DB staging.
Result: inserted safely into existing module as review/draft.
Changed files: three SQL migrations, one QA SQL, this report.
Migrations: `20261018191000_task204_m06_algo_v2_theory_review.sql`, `20261018192000_task204_m06_algo_v2_questions_review.sql`, `20261018193000_task204_m06_algo_v2_appendices_review.sql`.
Known risks: visual diagram assets missing; source content requires expert check and UX preview.
Next action: editorial signoff, graphical asset work, staged preview tests and approved release.
