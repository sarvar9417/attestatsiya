# TASK-240 — Publication, authentication and exam persistence audit

Audit date: 2026-10-18. Baseline: `d83db4029c8af136e3462600b5c823cd65c0cd35`.
Delivery prepared: 2026-10-19. Rebased parent: `40c3d490ac4b23b3cd935a5d5e6fce38c234af97`.
Scope: repository code and synthetic tests; no production writes, content publication, merge or production deployment.

## Confirmed defects and corrections

| Defect reproduced | Correction | Evidence |
|---|---|---|
| Public module listing accepted draft/archive filters; direct lesson/module UUID reads used service-role access without publication filters. | Only published lists/details are served; lesson questions and preflight also verify the lesson and parent module. Failed publication lookups return 503. | `content-publication.test.ts`: published happy paths, draft/review/archive, unpublished parents, DB failure and zero-key-read tests. |
| Unauthenticated `/api/content/questions/check` disclosed correct options and explanations from the general exam bank. | Endpoint is retired with 410 `PRACTICE_SESSION_REQUIRED` and no-store; removed the privileged key lookup. Theory pages no longer preload unused exam questions. Real assessment remains on authenticated start/submit/finish/review. | Same route tests exercise both anonymous and bearer callers without any database lookup. |
| An already-open finish confirmation, or timeout, could race an in-flight answer save. | A synchronous submission guard blocks finalization; timeout waits for the save to settle; confirmation disables while busy. | `ExamPage.test.tsx`: deferred answer response, manual confirmation and automatic expiry. |
| Offline queue was shared by all accounts and finish did not flush it. A retry could submit a different answer, and queue capacity silently dropped item 201. | Queue is scoped by account; flushing checks the owner, finish flushes only its own exam and fails closed if answers remain; first queued answer stays immutable, UI restores/locks it, and overflow is explicit. | `offlineExamGateway.test.ts`, `offlineAnswerQueue.test.ts`, and the UI reconnect regression. |
| Temporary refresh errors erased usable sessions. Supabase transient failures were converted to 401 by the backend. | Backend preserves retryable failures as 429/503; API client and auth bootstrap preserve sessions for transient failures. Invalid refresh credentials still log out. | Backend auth service tests plus `sessionExpired.test.ts` / `useAuth.test.tsx`. |
| A delayed refresh could resurrect a logged-out account, replace a newly logged-in account, or retry an old request under another identity. | Refreshes are coalesced by token and checked against the requesting account before persistence/retry. Changed sessions cancel old requests. | Deferred successful and rejected refreshes with logout/account replacement. |

## Validation

- Baseline: 472 frontend tests and 225 backend tests passed before changes.
- Reproduced failing regressions before fixing: 11 publication/key-access cases; 7 session/manual-finish cases; 5 offline-persistence cases; 4 backend refresh cases.
- Frontend lint, TypeScript and all 516 tests passed after rebase; backend secret scan, TypeScript, API-entry TypeScript and all 238 tests passed again. Total: 754 passing tests.
- Parametric invariant: 270 generated questions, 4 generators; Y1=248, Y2=7, Y3=15.
- Production build and client answer-key marker scan passed. Existing large-chunk warning remains (~1.59 MB uncompressed main JS).
- Local `tsx` CLI IPC socket is unavailable in this executor; the identical generator check passed with `node --import tsx scripts/gen_parametric_seed_sql.ts --check`.
- Local Playwright browser download returned an invalid/truncated archive. Full browser and fresh-database checks have not run for these changes. GitHub access was restored on 2026-10-19; PR CI will exercise browser/fresh-database gates. Those results remain required before release.

## Compatibility and review notes

- No SQL migrations; no published question, answer, source or attempt records changed.
- Public draft/archive module filtering is deliberately rejected. Administrative content continues to use the separate guarded admin routes.
- The retired standalone check endpoint is incompatible with old clients that still call it. The current learner CTA uses ExamRunner; legacy client helper code fails closed against the 410 response.
- Legacy `pending-answers:v1` data lacks an owner. It is preserved but never automatically assigned to the currently signed-in user or replayed. New responses use owner-scoped v2 keys.
- Existing draft PR #165 separately addresses strict topic counts and false lesson completion, and overlaps the retired key endpoint. Draft PR #170 overlaps offline finish and additionally handles AXB catalog/auth-header validation. Neither was merged or modified here. Reconcile overlapping patches before any later merge; do not treat their remaining changes as delivered by TASK-240.
- TASK-237/238 isolated staging, production migration parity, authenticated live acceptance, and source/editorial backlog remain separate. This code audit does not certify every content item or the currently deployed production build.

## Handoff

Task: TASK-240
Result: verified publication, auth and answer-persistence defects corrected on a dedicated branch.
Changed files: content route/schema/service and regressions; auth service/client/hook and regressions; exam runner/gateway/offline queue and regressions; theory preload; task/state/audit documentation.
Migrations: none.
Delivery: local branch `task/TASK-240-platform-audit-fixes`, a Git patch and this report. Initial delivery was blocked by GitHub 403; repository-owner connection restored write access on 2026-10-19 and the remote branch was created. Current delivery is the review PR on that branch; the earlier ZIP remains a snapshot of the older base.
Release: no merge/deploy in this task.
