# TASK-207 — M09 MS Access V2 production release readiness (2026-10-18)

## User request
Owner explicitly requested final review and production publication of the V2 MS Access + SQL question bank. The explicit release request authorizes technical deployment **after** required content QA; it is NOT evidence that 288 answer keys have been independently checked by a human expert.

## Verified production Supabase state
Project `plyqezulrfowyblsfpzy` (attestatsiya100%).
- 6 newly staged M09 V2 lessons, status **review**; existing 5 published lessons unchanged.
- 168 Y1, 60 native Y2, 60 native Y3 candidate questions, all **review**; 12 replaced paper-form combination questions archived.
- All 288 have server-side keys, source-lesson links and answers/explanations; no duplicated question IDs/stems detected.
- 120 native Y2/Y3: zero malformed option-side/pair/order ID references (60 Y2 with 4+4, 60 Y3 with 4).
- 22 Y1 visuals require validation against original table/diagram sources.
- 9 additional textbook-only questions in native bank are explicitly marked `supplemental_textbook_only`, not auto-eligible for the formal S4.DB exam pool.
- 66 V2 explanations are shorter than 60 characters: a quality-review signal, not by itself proof of error.
- **0 `question_editorial_checks`** records for this candidate bank.
- The 6 V2 theory lessons contain 303 source-derived text blocks, 35,569 characters; PDF extraction-to-LaTeX fidelity and sentence/diagram correctness have NOT been independently source-audited page-by-page.
- 25 previously published S4.DB questions and prior student attempt snapshots remain untouched.

## Release controls
- `TASK-205` / `TASK-206` DB triggers reject publishing V2 candidates without actual reviewer checklists.
- Native Y2/Y3 publish additionally verifies the server-side pairs/order shape.
- Any `supplemental_textbook_only` item cannot be published before its official specification categorization is resolved.
- 22 visually flagged items cannot be published until verified assets replace the review flags.
- Never fabricate `reviewer_id` or reviewer confirmation, never auto-set true booleans and never bypass the triggers to satisfy a deployment deadline.

## Frontend deployment readiness
Draft PR #154 now contains the M09 learner catalog integration and fail-closed all-six-chapter release gate:
- Until all 6 V2 lessons are `published`, keep existing M09 catalog visible.
- Once all 6 are `published`, replace M09 topic navigation with source-backed V2 UUID lessons.
- Do not route native Y2/Y3 into immediate-feedback Y1 gateway; use authoritative `/exam/mavzu/M09?lessonId=...` exam.
- Added five atomic-edition unit cases and verified green CI (database, backend, quality) at commit `ea089ce30c68348e3f2b6c1f482dc55170bf5abd`.
- Branch/main merged to avoid silently replacing concurrent project changes.
- The PR remains Draft. No new Vercel production deployment was initiated for this request.

## Publication blocking items
1. A real accredited/qualified human informatika subject reviewer must inspect answer correctness, source, wording, and authorship for all 288 V2 items; sign via actual user-authenticated reviewer flows rather than an automation.
2. Human source comparison for each of the 6 lessons; fix scanned/converted formatting, tables and citations as a versioned revision.
3. Validate 22 visual source tables, 9 supplemental classification issues, and explanation precision.
4. Admin/editor UX currently primarily supports pedagogika checks and Y1-style option reviews; M09 Y2/Y3 human review presentation needs safe private rendering of pair/order solutions with role-based access.
5. E2E authenticated production learner test after content approval, including native Y2/Y3 UI, scoring, progress and return navigation.
6. Merge/release PR with current clean main and confirm Vercel READY and production endpoint smoke only after preceding gates.

## Outcome
**Technically staged, source-based rollout guarded, automated checks green. Publication is BLOCKED by missing independent human signoff.** Production DB contains review content only; avoid saying that V2 is live for students.
