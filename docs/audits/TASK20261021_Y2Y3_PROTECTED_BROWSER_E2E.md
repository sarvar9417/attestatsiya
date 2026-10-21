# TASK-20261021 — Native Y2/Y3 browser flow: protected mock API vs real authentication

## New browser regression

`src/tests/e2e/native-y2-y3-protected.spec.ts` uses real Chromium/Playwright, the actual protected `/exam/mock` screen, `ExamRunner`, `Y2Match`, `Y3Order` and client autosave logic, backed by **synthetic fixtures** and intercepted network responses.

The test explicitly covers:
1. **Y2 3×3:** select three distinct right-side choices, verify already-used choice becomes disabled, and wait until server mock records the exact UUID mapping.
2. **Y2 4×4:** select four unique right-side choices and verify the full mapping reaches `/api/exam/submit`.
3. **Y3 4-item:** navigate to ordering, move a row in the browser and verify a complete unique UUID permutation is autosaved.
4. All submitted answers omit any `correctOrder` field or hidden answer keys.

**Critical boundary:** Playwright's locally stored session is synthetic; `/api/auth/onboarding` and `/api/exam/**` are mocked. This verifies frontend routing/rendering/submission protocol, **NOT** successful real Supabase sign-in, ownership checks, server-side scoring or production permission/RLS policy. Do not mislabel this as completed authenticated live E2E.

## Run locally

```bash
git checkout main
git pull origin main
npm ci
npx playwright test src/tests/e2e/native-y2-y3-protected.spec.ts
```

This uses a dev frontend on port 3000 and request interception for API at localhost:3001. Do not enter live secrets in fixture source code.

## Remaining real staging gate

An isolated **non-production** Supabase staging instance and a dedicated authorized test user are required for a complete authenticated Y2/Y3 scoring test. Test both native formats and independently verify server records/attempt ownership, resuming after reload, a wrong ordering vs right ordering, answer-key non-disclosure and RLS. The current project CI intentionally uses placeholder Supabase values. Do not reuse production credentials or write production attempts to satisfy staging test coverage.

No production deploy or DB mutation in this PR.
