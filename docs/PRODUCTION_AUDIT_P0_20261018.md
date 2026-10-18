# Attestatsiya — production P0 audit (2026-10-18)

## Verified sources and scope

- GitHub `sarvar9417/attestatsiya` **main** and Vercel production commit matched at the first audit read (`6834fcf707f3a81cf323e249c7bdc761f0a2456b`). Concurrent updates continued while the audit was running; the audit branch was explicitly created from `ccb20fc34f94a8b3fbe17ed6f641de0a7e5ac537`. This is a **point-in-time** assessment, not a frozen release.
- The connected production Supabase project `plyqezulrfowyblsfpzy` was examined via **read-only SELECT**. No migrations, question publishing, or mutations were performed during this audit.
- 94 published canonical lessons with test blueprints were counted. Of those, **25 lessons** had fewer published/keyed, construct-matched items than their target 20. (This is a necessary count check, **not** a complete topic-test readiness proof; critical construct coverage may cause additional failures.)
- The affected modules among those 25: M03 (4), M06 (3), M08 (5), M09 (5), M10 (2), M11 (3), M12 (3). Other lessons might still fail stricter objective checks; their passing raw count is not assurance of exam readiness.

## Confirmed P0 issue and repair

`src/components/learning/TopicView.tsx` previously offered **“Mavzuni yakunlash”** if the authoritative readiness preflight was false for many nonprofessional topics and called `handleComplete(0, 0)`. `src/store/progressStore.ts` interpreted a zero-question completion as **100% mastered**, storing it persistently. Thus an unready topic could be marked completed without any test.

Changes:
1. The theory CTA remains visible but is **disabled whenever `hasTest` is not true**. It explains that the official test is not ready. Supplemental appendices are not awarded a score, either.
2. `handleTopicTestAction` starts the real server-scored test only when readiness is affirmative; its old 0/0 fallback is gone.
3. **Defense in depth:** `completeTopic` rejects `total<=0`, non-finite scores, negative correct counts and correct counts above total. Valid 16/20 and 18/20 results still work and deduplicate completed topics.
4. Historical invalid 0/0 localStorage completions are **excluded from visible progress and module completion**, without deleting the persisted original record; real valid attempts remain counted.
5. Automated regressions: `src/tests/ProgressZeroQuestionGuard.test.ts`.

## Remaining action items — not silently fixed

1. **Content P0:** publish only editorially verified new questions and correct construct linkage for the 25 underfilled lessons. Never bypass 20-item requirements or auto-publish source-inaccurate review drafts.
2. **All-module E2E P1:** run authenticated topic start → answer → finish → review/history for all 94 lessons; verify all mandatory constructs and mock quota 35/5/7/3 and professional 5/7/3 separately.
3. **Security P1:** audit practice-bank vs scored mock-bank overlap and immediate-answer endpoint; test authenticated role policies and production storage.
4. **Data P1:** historical 0/0 completions now do not affect displayed/module mastery, but underlying persisted records remain available for evidence-based reconciliation. Do not silently delete real attempts.
5. **Deployment P1:** PR and CI must be green and merged explicitly before any production status claim. Frontend changes in this branch are not automatically deployed.

The audit explicitly distinguishes **code safeguards completed in branch** from **unfinished question-bank work**.
