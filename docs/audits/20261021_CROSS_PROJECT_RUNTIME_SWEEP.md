# Runtime and safety audit — 2026-10-21

## Scope and limits

Reviewed core paths of the Attestatsiya application: authentication/session persistence,
API transport and token refresh, offline exam answer queue, exam runner, group mock
lifecycle/report, learning theory links, theme management, connectivity indicator,
HTML initialization, and read-only Supabase security/performance advisors.

This is **not** a claim that every repository file or every feature has been
manually tested. CI covers additional backend, frontend, Playwright and DB paths.

## Reproduced code defects addressed

| Severity | Location | Defect | Fix / regression |
|---|---|---|---|
| Medium | `src/features/auth/sessionStore.ts` | Browser `localStorage` SecurityError/QuotaExceededError during initialization, login/logout or profile updates can interrupt React flows. | Guard browser persistence but keep in-memory state/listeners functional; sessionStore tests cover read, write and remove failures. |
| High (data integrity) | `src/features/exam/offlineAnswerQueue.ts` | Offline write failure could leave the learner believing an answer was saved; storage getter/read could throw before parser catch. | Throw an explicit "not saved" error for failed nonempty writes; allow online reads when storage is blocked; add tests. |
| Medium (content safety) | `src/components/learning/theory/InlineText.tsx` | Text content rendered Markdown links without URL protocol validation. | Permit ordinary HTTP(S)/relative URLs, render dangerous schemes/protocol-relative URLs as plain text; tests. |
| Low (UX) | `src/components/exam/TestHeader.tsx` | `navigator.onLine` was read once per React render; offline indicator did not update on network changes. | React external-store subscription to online/offline; regression test. |
| Low (UX) | `src/components/exam/ThemeToggle.tsx`, `src/utils/theme.ts` | Separate legacy theme toggle overwrote the saved `system` setting with `light` on mount; OS and other-tab updates not reflected in React listeners. | Use centralized theme preferences, notify subscribers on effective changes and synchronize cross-tab; tests. |
| Low (UX) | `src/pages/GroupMockPage.tsx` | Finished rooms still attempted to render an active question card above the final report. | Exclude finished state from question renderer. |
| Low (resilience) | `index.html` | Early theme bootstrap could throw on blocked localStorage; `system` forced dark irrespective of actual OS setting. | Guard access, respect OS dark preference. |

## Remote Supabase health and deferred follow-ups (READ ONLY)

Queried `plyqezulrfowyblsfpzy` on 2026-10-21. No migration or production
deployment was performed for this audit. The database advisor currently reports:

- Security: 5 `anon_security_definer_function_executable` findings,
  41 `authenticated_security_definer_function_executable` findings, and
  1 `auth_leaked_password_protection` warning; 53 RLS/no-policy information
  findings. A SECURITY DEFINER warning is **not automatically a vulnerability**:
  every function needs intent and authorization review before changing privileges.
- Performance: 8 `auth_rls_initplan`, 58 `multiple_permissive_policies`,
  37 `unindexed_foreign_keys`, 13 `unused_index`, 1 `duplicate_index`
  warnings/information findings.
- These need **separate, migration-reviewed changes** and manual security
  decisions. Blindly revoking authenticated RPCs would break existing exams.
  DB changes require explicit approval; this PR does not attempt them.

Advisor references:
- <https://supabase.com/docs/guides/observability/advisors?queryGroups=lint&lint=0028_anon_security_definer_function_executable>
- <https://supabase.com/docs/guides/observability/advisors?queryGroups=lint&lint=0029_authenticated_security_definer_function_executable>
- <https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select>

## Release verification

- Run GitHub frontend lint/typecheck/unit tests/build/Playwright E2E, backend
  typecheck/tests, database migration chain and checks, and aggregate quality.
- No live DB writes, user-record changes or production frontend deployment.
- Existing saved group mock answers/reports remain unchanged.
