# TASK-20261021 — Y3 answer feedback and permutation integrity

**Scope:** Standalone `Y3Question` learner component; an extension to merged PR #404's pure `isCompleteOrdering` validator. No production deploy, no database changes.

## Defects

1. `order.every(...)` evaluates to true for an empty list. The old `Y3Question` result banner could therefore show "To'g'ri tartib ✅" for an empty response whenever `correctOrder` was non-empty.
2. The component applied a green correct-row border from `correctOrder` **even before** `showResult`, leaking local answer feedback.
3. Duplicate/stale order IDs could hide items or duplicate rows, because list rendering assumed incoming `order` was already a complete permutation.

## Fix

The renderer now uses `isCompleteOrdering(items, order)` and validates `correctOrder` against the same displayed item IDs. Invalid incoming sequences render the canonical item list rather than displaying missing/duplicate items, but they never count as correct. Green feedback is applied **only after** result revelation. Keyboard/click move handlers use the safe displayed sequence and keep the returned order valid.

New component-level tests cover empty, duplicate, foreign-ID, invalid expected order, pre-submission green-border suppression and valid four-item response interactions.

The authorized official-exam scoring and real authenticated learner browser path remain independent release checks. All changes are frontend-only; no question answer keys or exam attempts are modified.

## Local commands after merging

```bash
git checkout main
git pull origin main
npm ci
npx vitest run src/tests/Y3Question.test.tsx src/tests/Y3OrderingQuality.test.ts
npm run check
npm run dev
```

**No production deploy.**
