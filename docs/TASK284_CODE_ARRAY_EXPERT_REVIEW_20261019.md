# TASK-284 — Python/JavaScript array distractor expert review (2026-10-19)

## Source, scope and verified finding
- 2026 official Informatika specification: 50 questions, 120 min, 15 group quotas and 8/35/7 cognitive quotas. No fabricated format quotas.
- Production Supabase read-only audit of **289 published S4.CODE Y1** questions detected **13** with **25 malformed distractor options**, including `],3,2,7,1,[`, `[,1,7,2,3` and `[1,2,0],0`.
- These 13 are **generated**, categorized as `mulohaza`, and **none had any prior exam_items references** at the time of audit. Their keyed answers were correct, but wrong-answer options were malformed or trivially eliminable.
- Production S4.CODE/mulohaza had **199 published items** with an **official slot quota of 1** at the time of audit, so removing the broken 13 after safe publication of replacements will not exhaust the pool.
- Control analysis found a seemingly similar bracket-containing item in S2.HW, but its options were **valid Windows filename-character sets**, not corrupted array outputs. **Do not auto-quarantine** by simplistic bracket regex across the whole bank.

## Remediation performed
- Created **13 new question revisions in production, status REVIEW ONLY**, with four valid and distinct plausible array-list alternatives, one correct key, explanatory solution, and matching original lesson/construct/cognitive/category. The original program snippet was preserved and a note added that whitespace in array rendering is non-semantic.
- Review question `source_reference` prefix is `expert-audit:20261019:code-array-review:<original UUID>|<official reference URL>`.
- **Verified 13/13:** `status=review`, four distinct alternatives, exactly one answer key, no malformed distractors, matching lesson/construct and `mulohaza`. These questions are **NOT eligible for production mock selection yet**.
- Previously created 8 other source-backed SQL/HTML/Photoshop questions remain in review. Together: **21 review candidates** from the expert QA effort.
- No published question, historic exam or live mock RPC was changed during this review.

## Safe quarantine path (intentionally NOT executed)
The file `supabase/maintenance/task284_archive_flawed_code_array_questions_AFTER_APPROVAL.sql` is a guarded, **manual-only** retirement operation. It will refuse to retire any original item unless:
1. The matching new revision is separately approved and **PUBLISHED**.
2. The original question is still the expected `S4.CODE`/`Y1`/`mulohaza` generated question.
3. The original is still unused by historical exam items.
4. The approved replacement has exactly four unique meaningful options, one matching answer key, a valid construct/lesson mapping, and no malformed bracket alternatives.
5. The post-retirement eligible `S4.CODE`/`mulohaza` pool contains at least 20 questions and the official group/cognitive slot is still 1.

The script does **NOT** auto-publish replacement questions. Do not run it prematurely, and do not interpret a GitHub merge as a database deploy.

## Independent runtime result
- All 13 affected original program snippets were independently re-executed in isolated **Python 3.13.5 (7 cases)** and **Node.js 22.16.0 (6 cases)** processes.
- The actual computed list/array elements were compared semantically, ignoring console-specific formatting: **13/13 PASS, 0 answer-key computation mismatches**.
- The defect is therefore **malformed distractors**, not the keyed program outputs. The 13 review revisions contain plausible alternatives and preserve the verified result.
- Runtime verification covers these 13 reviewed questions only; it is not a blanket certification of the full code bank.

## Official reference sources
- [Python sequence operations](https://docs.python.org/3/library/stdtypes.html)
- [JavaScript Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JS splice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- [JS filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [JS Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)

## Outstanding review work
- Independent answer/construct/cognition approval before publishing new revisions.
- Scope coverage across all generated S4.CODE, S3.ALGO, S3.LOGIC, S3.NUM and remaining professional/pedagogy groups.
- Extend independently executed Python/JS runtime checks to the remaining question bank; the present 13-case runtime verification is not exhaustive.
- Audit known recall-level questions mapped to `qollash` without breaking exact official quotas.
