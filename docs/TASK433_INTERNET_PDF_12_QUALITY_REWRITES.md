# TASK-433 — Internet test.pdf editorial quality batch

**Date:** 2026-10-22. Source Drive file ID `1PGTYxUSxB4rCHkjnNlIfmyjlTLd2-BzX`, Q1/3/4/7/8/10/12/13/14/17/18/22.

All 12 original questions were verified in private source `attest_ingest.telegram_informatika_pdf_question_candidates` with exactly 4 options each. Their wrong answers are typically semantically distant or the stem only tests simple fact recognition. `qa20261022_trivial_distractors_or_fact_recall_rewrite_needed` was added to exactly 12 source rows (not edits of their options). This is a quality concern, **not** a statement that the existing option index is technically wrong.

Q14 had an additional logical ambiguity: it asks for protocols used in WWW; option C says HTTP/HTTPS (application layer) while D says TCP (transport). Both may be involved in conventional WWW use. The source fails to specify which layer is being assessed. An `ambiguous_or_nonunique_answer` blocker was inserted for Q14 so the original wording is not released unreviewed. Proposed rewrite explicitly asks for the application layer.

The twelve new **independent editor-authored** stems, four distinct choices each, answer indices and explanatory rationales are stored in `docs/qa/task433-internet-twelve-rewrites.json`. These are **proposals only**, `editorial_state=review_only_not_published`, `human_approved=false`. The live source PDF text, extracted options, old learner exams and all 719 staging candidates were left unchanged except quality flags/blocker. `scripts/task433-internet-editorial.test.mjs` validates all 12 proposals; GitHub workflow executes it.

Next step: validate distractor plausibility and align to Informatika specs / active construct + lesson, check published-bank near-duplicates, then release new immutable Y1 revisions one at a time. Do not automatically promote the original source PDFs from draft to learner-ready status.

## Repeated-source release guard (latest production verification)

Live `public.questions` now has **12/12 already-published corrected successors** for original Internet PDF Q1/3/4/7/8/10/12/13/14/17/18/22 with `source_reference='task431:pdf-editorial:20261022:<source_file_id>:q<source_no>'`. Consequently, the twelve TASK-433 questions are **alternative editorial comparisons only**. Do not insert them as another set of 12 learner questions: that would duplicate the same source topic. Tests require `source_already_has_published_successor=true`. Any improvement should be considered as a versioned revision, preserving student attempts, not a second independent release. Original Internet PDF Q14 remains blocked for its ambiguous original formulation; separately published corrected successor is not blocked.

## TASK-433 new 8-question production release

Another eight source PDF questions had **no** earlier published source-linked successor: **Q2,9,11,16,20,21,33,39**. Source stems had underspecified concepts such as "URL nechta qismdan iborat?", broad "Web 3.0" definitions, domain parsing or user-generated content assumptions. They were independently rewritten into scenario-based Y1 questions with four closely related answer alternatives, one keyed explanation, source construct and active lesson linkage, stored at `docs/qa/task433-internet-eight-unreleased-remediations.json`.

`supabase/maintenance/task433_publish_eight_internet_editorial_y1.sql`: guarded BEGIN/ROLLBACK preflight passed; durable production execution passed; 8/8 production `published`, 8/8 official mock eligible, 8/8 immutable release fingerprint matches, **zero fabricated human editorial checks**. Original candidate PDF row unchanged except `separate_corrected_successor_published_20261022_original_remains_blocked` provenance flag. The historical learner attempts were untouched. This release is **owner-authorized, AI-assisted**, not independently signed by a human expert. No frontend deploy performed.
