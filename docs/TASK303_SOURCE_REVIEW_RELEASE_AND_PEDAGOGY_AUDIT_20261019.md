# TASK-303 — Source-backed editorial release and professional-pedagogy triage

Date: **2026-10-19**. This file is an **audit trail**, not a database migration or a publish instruction.

## Release actually executed and independently read back in production

Scope: the **27 specifically identified** `expert-audit:20261019:%` candidates created in previous expert QA tasks (#284, #286, #289, #292).

- **27/27** transitioned from `review` to `published`: **22 Y1, 2 Y2, 3 Y3**.
- Of these, **19** were verified replacements for **19** defective source items; their originals transitioned from `published` to `archived`.
- **8** were new questions in undercovered constructs (SQL, Photoshop, HTML).
- All 19 replaced originals were verified as having **zero `exam_items` historical references**. None of the existing historic exam items, user answers, scores or exam sessions were modified.
- Before release: 13 JavaScript/Python Y1 correct answers all appeared first in the raw authored question option order, and 2 Y2 items had answer-side options aligned with the source-side order. Fixed option presentation order in `review` while retaining UUID-key integrity; Y1 correct-position balance across all 22 newly released Y1 was 5 / 6 / 7 / 4.
- Release was a **single, guarded, atomic transaction** with status, source-URL, explanation, uniqueness, Y1/Y2/Y3 key, active construct/lesson, original scope, zero historic use, and active 2026 group×cognitive quota checks. On any assertion failure all changes would have rolled back.
- Verified **after** transaction: 27 published, 0 leftover review in this cohort, 19 originals archived, no original historically used, production `generate_official_mock` still **v2**. No frontend deployment.
- This write was performed directly in the production Supabase project. **A GitHub PR merge is not a substitute for this actual DB release.** The SQL changes must not be re-run without a fresh audit.

## Remaining editorial queue, NOT blanket-approved

After release the remaining `review` backlog was **1,393** question records:
- **32** in KS/PM.GEN/PM.MET: 13 KS, 17 general pedagogy, 2 methodology. **All 32** have 4 distinct Y1 options, one valid stored key, explanation and a valid lesson mapping, but that is a **structural** rather than independent evidence of correctness.
- **1,361** Informatics candidates. In particular **528** `ktd-540-2026` hardware questions are protected by `ktd_quality.guard_ktd_publication`: require real reviewer ID, PDF page, source excerpt, answer and distractor rationales plus up-to-date item fingerprint. A model's assessment must never be misrepresented as human review.
- **300** `GV2` graphics/HTML/Photoshop review candidates have their own source-specific gate and require individual image/source/option and explanation checks. Do not mass-publish.

### Professional pedagogy provenance

Of the **32** KS/PM/PM.MET review Y1 questions:
- **12** are derived from a public/community `2026 tushgan test 1.pdf` compilation in Drive. The PDF **does not supply an official keyed answer**; any current stored key is a reasoned working answer only.
- **15** refer to a demo Word import; current Drive readable-text fetch yielded no body for that document, so original-wording authenticity is NOT independently certified.
- **3** refer to a 2025 spring community test compilation and **2** to a 2025 autumn compilation; these are not statutory standards.
- All remain `review`. In production `question_editorial_checks` requires a real `auth.users` reviewer foreign key and explicit answer/reference/wording/authorship verification. There are **zero such checks for these 32**. Do not fabricate reviewer identity or owner signoff.

### Specific methodological fixes actually made in `review` (no publish)

1. `PM.MET`, ID `3d2b43bd-c0c2-4ced-b1f5-dc47aafb2a35`: the previous unbounded question described comparison and generalisation without specifying source material, allowing competing methodological labels. Rewrote it as a **source-text analysis and main-idea synthesis task** and clarified rationale. Retained all four existing options, correct-option UUID, source provenance and review state.
2. `PM.GEN`, ID `62631fd6-d432-488c-aa3c-166d5364c28b`: the former word **“first”** could clash with the teacher's need to immediately stabilise a disruptive situation. New wording first establishes that safety and teaching continuity have been restored, then asks about a subsequent private individual behaviour intervention. Aligned rationale with [EEF Improving Behaviour in Schools](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/behaviour/). The question is still `review`.

Both edits were atomic, limited to review-only, zero historical-exam items and no editorial check, confirmed by independent readback. **No claim of human approval**.

### Published professional bank sampling (not a blanket defect)

- 450 published KS+PM.GEN+PM.MET items (of which **426** are Y1), have source references and meaningful explanations. Exact duplicate visible option text **0** in 426 published Y1.
- Raw authoring key positions have a strong positional bias: **299 / 426** first-position answers. However the **exam flow randomises `exam_items.option_order` per session**, so **do not claim this proportion means live exam answers are exposed**. Historical 809 KS/PM Y1 exam items: 803 had complete per-item ordering; 6 missing orders were all in **one unfinished legacy diagnostic exam** from October 13. Treat as one narrow technical follow-up, not retroactive tampering.
- Substantive pedagogical depth and kognitiv classification must still be reviewed against primary curriculum texts and professional standards; structural schema checks alone do not establish that the right answer is uniquely supported.

## Standards and reference hierarchy

1. [The status of a pedagogue, Law O‘RQ-901](https://lex.uz/uz/docs/-6786401), for educator legal status and professional conduct.
2. [Cabinet Resolution 867/2024 on continuous professional development](https://lex.uz/uz/acts/-7271575) for relevant school educators' professional development framework.
3. [OECD (2025), formative assessment and feedback](https://www.oecd.org/en/publications/unlocking-high-quality-teaching_f5b82176-en/full-report/using-formative-assessment-and-feedback_189fb6dc.html).
4. [EEF: Improving Behaviour in Schools](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/behaviour/).
5. [UNESCO: Assessment for improved learning outcomes](https://www.unesco.org/en/learning-assessments).
6. User-provided official 2026 Informatika exam specification: https://drive.google.com/file/d/1jJstcqgFXwTJKuH9bkRIpvATEsjM2UnQ/view .
7. Community test PDFs and privately maintained editorial banks are **secondary learning references**; never describe them as authenticated government-issued answers. In particular the 2025/2026 *preschool-specific* occupational standard is **not** interchangeable with the general-education Informatics teacher standard.

## Release controls and next acceptance criteria

- Evaluate the remaining 32 pedagogical items individually for verifiable citation, sole justified keyed answer, option quality and cognitive level; retain `review` without real editorial review record.
- For `ktd-540-2026`, do not bypass exact page/source/quote/independent reviewer requirements.
- Investigate the six missing legacy diagnostic `option_order` only for a future safe repair; do not rewrite completed exam history.
- Apply the GitHub-only official-mock-v3 SQL migration only as an **explicitly scheduled DB release**, not implicitly as frontend deployment.
- Do not put secret keys or full private question bodies into public GitHub.
