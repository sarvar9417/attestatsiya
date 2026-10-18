# TASK-205 — M09 MS Access V2: staging evidence (2026-10-18)

## Production DB review-stage audit
Project: Supabase `attestatsiya100%` (ref `plyqezulrfowyblsfpzy`).

| Object | Existing published unchanged | V2 review staged |
|---|---:|---:|
| M09 lessons | 5 | 6 |
| S4.DB questions | 25 | 180 new (plus 21 previous review) |
| New V2 question options | — | 720 |
| New V2 answer keys (server-only) | — | 180 |
| V2 lesson–construct links | — | 6 |

Construct allocation: S4.DB.01=60, S4.DB.02=30, S4.DB.03=30, S4.DB.04=30, S4.DB.05=30.

- All V2 questions and lessons retain `review` state. No published question or lesson edited, no attempts deleted.
- Source trace: `MSACCESS-V2/DB-xx-yyy`, `source_reference`, V2 source lesson ID, explanation, A/B/C/D options, private `question_keys`.
- 22 V2 visual source questions carry Markdown-readable tables/labels but retain the `source_visual_review_required` gate for visual/source confirmation.
- 12 paper Y2/Y3 are staged as four-choice **Y1** with explicit `PAPER_Y2/Y3_NATIVE_CONVERSION_REQUIRED` flag. Do not misrepresent them as interactive Y2/Y3.
- Generated lessons used V2 PDF text extraction, which requires an editorial pass for Unicode, line wrapping, SQL formatting and diagrams. The original LaTeX is the quality reference. This staging is **not** a finished learner-facing book.
- 3 negative publish tests were run using isolated PL/pgSQL exception subtransactions; all correctly refused release and reverted.
- Guard: `trg_m09_v2_question_publish_guard` added (scope `MSACCESS-V2/%`), requires source lesson and signed `question_editorial_checks`, disallows unresolved visual or paper-format flags.
- No answer keys or full private bank checked into the public GitHub repository.
- DB review data were uploaded through authenticated Supabase migration and scoped data operations, NOT through a public GitHub seed.

## Human review + publication blockers
1. Compare every V2 lesson with original `.tex`, especially rendered tables, screenshots, SQL and citation references. Repair any PDF extraction artefacts **as new reviewed revision**, not published in-place mutation.
2. Independently check each of the 180 question answer keys, explanations, distractors, precise source pages, spec fit and duplication vs 46 existing questions. Record real human editorial signoff.
3. Attach original visually accurate material for 22 flagged questions; clear markers only after reviewer verification.
4. Convert 12 flagged paper matching/ordering questions into valid native Y2/Y3 options/keys; preserve original reviewed candidates for traceability. Native version must be newly created and separately reviewed.
5. Recheck preflight for the 6 reviewed lessons and full 50-question specification blueprint; do not claim current 180 review items are already part of official exam.
6. Complete frontend/admin rendering, progress and mobile E2E, and pass full CI checks before approved production release.
7. Integrate upstream changes from main, merge and deploy **only** after release gate and fresh confirmation of publication readiness.

## Reconciliation SQL (read-only)
```sql
select status, count(*) from lessons
where slug like 'm09-v2-%' group by status;

select status, count(*) from questions
where source_reference like 'MSACCESS-V2/%' group by status;

select count(*) from question_keys k
join questions q on q.id=k.question_id
where q.source_reference like 'MSACCESS-V2/%';
```

## Current status
**PARTIALLY COMPLETED — secure production review staging completed; public learner rollout not completed.**
