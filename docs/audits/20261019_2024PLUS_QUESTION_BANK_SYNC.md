# 2024+ attestation source policy and live-bank audit — 2026-10-19

## Scope and provenance

The owner requires **attestation tests from 2024 onwards only**. A textbook published in 2020 or 2021 can be used to verify a new 2026-authored question, but it does not establish that an old exam question is a 2024+ item. A filename containing a year is provisional until supported by a primary source, a publisher date, or explicit attestation session metadata.

This file documents changes **already applied directly to Supabase** during the content import and QA conversation. Git merge **must not replay** live data updates, mark draft questions as published, manufacture expert signatures, or deploy anything.

## Observed live database, final verified snapshot

- `public.questions`: 4,670 published; 1,420 review; 1,355 archived; 19 draft.
- **616 items from the 2019 `Test.pdf`** remain archived: 602 `drive:1tQ1L3-eQ-N3WlWElT83J9iX6RYtuMZeF:...` records, plus 14 older alternate-source-reference imports (`Drive:Attestatsiya/darsliklar/Test.pdf|2019|...`). The number of *published* questions explicitly citing 2019 is zero.
- Two live database `CHECK` constraints prevent these two known 2019-source reference variants from moving back into `published`: `no_2019_source_publication` and `no_2019_legacy_source_publication`. They **do not** establish that every other published question is post-2023.
- A private `attest_ingest.ai_question_reviews` table stores **31 AI-only audit records** (all in `review`): 12 reconstructed 2026 pedagogy questions, 14 2026-authored M02 questions, and five adapted 2025 pedagogy questions. Each has four distinct options, valid UUID answer key, and an active lesson/construct association.
- Some 2026 source references were normalized to Drive file `1O9wk2V0S6vKWa-EtcVhtOb-4v7wx3JiE`. This is source linkage, not proof of official exam occurrence.
- One 2026 pedagogy batch had 20 choices rebalanced across five questions so the correct option is not singled out by length. A Windows wildcard question was clarified after an ambiguity in how `?` behaves.

## Hard publication boundary

The AI review is **not** a human expert attestation.

- `public.guard_pedguli_question_publish` requires a complete fingerprint-matched `public.question_editorial_checks` record or an explicitly authorized owner release waiver, plus four plausible answer choices.
- `ktd_quality.guard_ktd_publication` requires an actual independent reviewer, source PDF page and excerpt, rationale for correct and wrong options, matching fingerprint, and balanced distractors.
- The AI findings are in a *separate* private schema. They are **not** inserted into those signed editorial tables, and all 31 reviewed items remain unpublished.

## QA and next work (priority order)

1. **P0** Audit remaining published tests for exam-session year from actual source material. Quarantine anything verified to be an attestation item before 2024; do not treat textbook citation year as item year. Prevent future pre-2024 imports generically with structured source-year provenance, rather than string-matching alone.
2. **P0** Complete 2025/2026 source extraction, image crops, exact answers, evidence and duplicate detection. Separate official exam items from model-generated practices and from vendor/user compilations.
3. **P0** Confirm 2026 official specification quotas, cognition, formats, difficulty, random selection, and topic/construct mapping end-to-end.
4. **P1** Obtain genuine editorial sign-off and page-specific original source checks for pedagogy and M02 before `review` → `published`. Do not bypass DB guards.
5. **P1** Fix `frontend-quality` CI failures on PR #293 and run full checks on PR #292. Merge only green non-draft PRs; do not merge production DB changes from a draft/review-only branch.
6. **P1** Finish 1:1 textbook/PDF source checks and chapter completeness for M03, M14–M16 and other short lessons. Verify real authenticated desktop/mobile opening and exam answer saving.
7. **P2** Report exact per-source, per-year, per-construct release coverage and use the read-only SQL file `supabase/qa/20261019_2024plus_bank_release_audit.sql` in reviews.

## Deployment policy

GitHub merge is not a request to trigger a manual deployment. An external GitHub-connected CI/CD service may auto-deploy `main`; check the hosting integration before production releases. This audit adds no automated mutation or deployment action.
