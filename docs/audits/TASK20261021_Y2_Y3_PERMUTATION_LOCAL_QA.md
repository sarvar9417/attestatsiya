# 2026-10-21 — Local Y2/Y3 learner response integrity (no deploy)

## Defect fixed

The standalone `TopicView` practice renderer previously treated a Y3 submission as "complete" merely when its array length matched the number of displayed items. Same-length responses containing duplicate or stale/foreign IDs were not rejected by that submit guard. The local `isQuestionCorrect` fallback checked equality position-by-position but did not first validate that the submitted sequence and stored correct order were complete distinct-ID permutations.

## Change

- Add `src/lib/exam/ordering.ts`: pure `isCompleteOrdering(items,answer)` that checks nonempty source items, unique valid IDs, exact set membership, correct cardinality and uniqueness of the answer sequence.
- Use this predicate for both the Y3 submit-button disabled state and fallback comparison; also validate the expected stored order shape.
- Test 3-item and 4-item valid permutations; same-length duplicates, unknown IDs, wrong lengths and invalid data.
- Extend existing Y2 matcher tests to cover 4×4 selection and repeated-right-choice rejection; Y2 existing 3×3 tests preserved.
- This is **frontend-local practice quality** only. Official secure exam attempt grading remains on the backend and is not touched.

## Scope and local validation

After CI PASS and merge, locally run:

```bash
git checkout main
git pull origin main
npm ci
npx vitest run src/tests/Y2MatchingQuality.test.ts src/tests/Y3OrderingQuality.test.ts
npm run check
npm run dev
```

The e2e workflow verifies a standard smoke route. **Authenticated backend grading for native Y2/Y3 against a fully populated staging database still needs separate browser verification**. Do not claim it is covered by a pure unit test or a general Playwright smoke test.

No question keys, private bank fixtures, source migrations, publication status, human-review records or production deployments are changed.
