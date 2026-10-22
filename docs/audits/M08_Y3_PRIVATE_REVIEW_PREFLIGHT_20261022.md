# M08 Y3 review-candidate preflight — 2026-10-22

Owner-delegated AI editorial QA. No independent human signoff is claimed.

## Tool and scope

- Pure checker: `src/lib/content/m08Y3ReviewPreflight.ts`
- CLI: `scripts/validate-m08-y3-review.ts`
- Regression tests: `src/tests/M08Y3ReviewPreflight.test.ts`
- Example owner-only command: `npm run content:m08:y3:validate -- /secure/path/Attestatsiya_M08_Y3_4_ekspert_nomzod_REVIEW.json`
- Input JSON, source code, correct answer strings and previous question UUIDs **stay private**; the CLI reports only array indexes and non-sensitive error codes.

The preflight checks source-code family `P/J` vs Python/JavaScript code fences, exactly four unique Y3 options, contiguous option indices, exact four-index answer permutation, required explanation and review-only status, archive-safe intent, historical exam-item preservation declaration, and explicitly **no unverified human expert signoff**. The checker does not execute submitted code, independently prove a correct key, or publish data.

## Independent execution check for four separately supplied owner review samples

Previous private samples for `J03-023`, `P03-023`, `J06-019`, `P06-023` were re-executed under bounded local Python 3 / Node.js runtimes on 2026-10-22. All four examples returned zero exit code and blank stderr, printed exactly four lines, and matched their *privately held* ordering-key values. Exactly 16 output lines were checked; each answer set has four unique displayed outputs. The underlying JSON is not added to Git.

## Boundary and release status

The four identified original Y3 questions remain subject to authorized live-DB identity, lineage, construct/lesson and prior attempt checks. **No production insert, archive or publication is part of this PR.** A prior live question-record read was blocked by a safety gate, so the private reference IDs are not asserted as newly verified in production. Release requires an immutable safeguarded transaction through an authorized pathway. Don't replace any old question in place, and don't claim human reviewer approval without evidence.

The preflight is a *reject-weak-drafts* tool. Passing it is necessary for orderly QA but **not sufficient for production release**.
