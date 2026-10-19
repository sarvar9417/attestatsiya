# TASK-264 — M03 Office source/provenance and review-pool readiness

**19 October 2026 · READ-ONLY INVENTORY COMPLETE · EDITORIAL REVIEW OPEN · NO RELEASE**

## Scope and source precedence
Production Supabase `attestatsiya100%` project `plyqezulrfowyblsfpzy` was queried by **SELECT only**. This is a metadata inventory, not semantic validation, source approval or correctness certification. Official 2026 specification defines the Microsoft Office Word/Excel/PowerPoint assessment area; it does **not** mandate 20 items for each learner topic test. The 20-item requirement is the app's own canonical topic-test configuration.

Existing canonical source traces in `supabase/migrations/20261009074500_m03_office_source_backed_lessons.sql`: ICT 5-sinf (2020) Word section PDF pp.48–66 (formatting pp.51–54), Cambridge+ 10–11 spreadsheet chapter 8, and ICT 6-sinf (2021) PowerPoint lessons. These pointers were inherited from the source-backed migration; **no fresh independent page-by-page verification is claimed in this task**. The existing `docs/OFFICE_V2_IMPORT_AUDIT_20261018.md` documents 9 Office V2 review lessons and 270 key-bearing candidates (162 Y1, 54 Y2, 54 Y3) with 7 visual questions originally held as draft; these are not automatically eligible for publication.

## Live canonical assessment pool (2026-10-19 SELECT)

| Canonical topic | Published eligible | Deficit to 20 | Mapped keyed review | Y1 / Y2 / Y3 | Review with same canonical source_lesson_id |
|---|---:|---:|---:|---|---:|
| Word formatting/document structure | 5/20 | 15 | 89 | 53 / 18 / 18 | 0 |
| Excel formulas/functions | 11/20 | 9 | 90 | 54 / 18 / 18 | 0 |
| Excel filters/sorting/charts | 5/20 | 15 | 26 | 14 / 6 / 6 | 0 |
| PowerPoint presentation/animations/transitions | 7/20 | 13 | 58 | 34 / 12 / 12 | 0 |
| **Four lesson totals (occurrences)** | **28/80** | **52** | **263** | **155 / 54 / 54** | **0** |

All four had `source_reference IS NOT NULL` in the mapped review pool. A non-null reference is **not** proof of a verified textbook source or correct answer. Review pool values are per-canonical-construct *occurrences*, not verified distinct revision counts. `source_lesson_id` for the existing review candidates points to V2 lessons, not the four canonical topics, so **zero same-source canonical links are expected and should be reconciled editorially**, not mechanically rewritten. Never use broad construct membership alone to publish a question.

## Editorial decision queue

1. **Word:** verify formatting vs editing, styles, page breaks, tabular/document layout against ICT 5 page-level excerpts; identify office-version-specific shortcuts before accepting any key.
2. **Excel formula/function:** independently compute each relative/absolute/mixed-reference copy operation and function answer on a sample spreadsheet; watch argument separators and localized function names.
3. **Excel sorting/filter/charts:** distinguish a filtered view from physical sort order; verify visual charts/diagrams, axis labels and numerical inference, and source or screenshot reproduction rights. This topic's 26 review mapped candidates include only 14 Y1; its 15-slot deficit cannot be considered solved without format/objective distribution.
4. **PowerPoint:** distinguish object animation from slide transition and presentation-wide settings; version-dependent terminology requires exact textbook citation.
5. For each candidate document the immutable revision UUID, `source_lesson_id`, construct, format (Y1/Y2/Y3), source path/PDF page, independently checked answer/rubric, distractors, originality, duplicate stem fingerprint, approved reviewer and conclusion. Public Git must never include `question_keys` or learner-private data.
6. After independent review, only the separately authorized editorial publication flow may create new immutable published revisions, followed by 20/20 strict preflight in isolated staging, official mock 50/120 regression and authenticated learner mobile/desktop E2E. No blanket status promotion.

## Reproducibility, acceptance and restrictions

Read-only query: `scripts/sql/TASK264_M03_OFFICE_REVIEW_READONLY.sql`. It returns metadata aggregates only and never selects correct option IDs, stems or explanations.

**DONE in TASK-264:** verified 4 canonical topics / 52 missing slots / 263 keyed mapped review occurrences (155 Y1, 54 Y2, 54 Y3), zero canonical source-labeled review candidates, exact SQL and editorial gating checklist.

**NOT DONE:** individual answer/source review; question acceptance; strict 20/20 readiness; isolated authenticated acceptance; production migration/publish/deploy. GitHub merge of this audit is safe only after CI green and checking `vercel.json` `git.deploymentEnabled=false`. Production remains unchanged.
