# 2026-10-23 — 23 local theory chapters: recovery and editorial blockers

## What exists and what does NOT
The learner-facing static source corpus provides local theory for 23 legacy lesson codes. An automated GitHub Actions inventory against source `src/data/topicContent.ts` and the canonical theory modules (run 39956773407) confirmed:

| Verified, keyless metric | Total |
| --- | ---: |
| Local theory chapters without an independently approved server-scored test | 23 |
| Locally authored practice questions | **65** |
| Structurally valid four-choice practice questions | **65** |
| Duplicate question stems within the same chapter | **0** |
| Invalid four-choice structures | **0** |
| Questions with option-length max/min ratio >1.35 | **47** |
| Questions where the originally marked correct option is uniquely longest | **32** |

**Interpretation:** These counts are heuristics about the existing offline study quiz, NOT reliable independent answer-key verification. A question may be in more than one risk set. Even a valid local `correctIndex` is a client-side practice key, not evidence for secure production server scoring. The 47/65 length imbalance and 32/65 correct-option length clues indicate that blindly migrating the existing mini-quiz pool into a scored backend exam would produce a predictable, low-quality assessment.

The script `scripts/audits/legacyTheoryQuestionInventory.ts` and branch-only, read-only GitHub inventory workflow report **only chapter metadata and counts**. The report never exposes stems/options/explanations or answer keys; no DB inserts or publishes occur.

## Remediation design for issue #588
- Retain source-backed theory and do not tell the user the theory lesson itself is missing just because no test is ready. The PR provides correct preflight semantics `ready=false, required=0, reason=blueprint_missing` for known theory-only chapters and keeps true 404 for unknown IDs.
- Use the risk-ranked chapter report to review existing local content **against actual textbooks and topic objectives**. Check if a local practice question is historically accurate, uses one defendable key, and has three plausible distractors.
- Rewrite option-length outliers, remove clues, and record verified source-page references. Distinguish genuine Y2/Y3 interaction from a four-choice Y1 UI carrying an old cognitive badge.
- Export reviewed **REVIEW candidates only**, independently adjudicate keys and source rights, deduplicate against the published backend bank, create exact chapter-specific constructs and only then approve a new scored pool.
- Before any test release, verify a representative authenticated exam end-to-end, actual question count, server-side scoring, progressive status and historical exam attempts. Never invent missing questions or alias partial topics to unrelated banks.

## Reproduce without writing production
Run `npx tsx scripts/audits/legacyTheoryQuestionInventory.ts` in a local repo checkout with installed dependencies. GitHub workflow `.github/workflows/legacy-learning-inventory.yml` uploads a keyless JSON report with 14-day retention and publishes a per-topic risk table.

**Release:** user has forbidden all `main` merges, production deploys and live database changes without new explicit consent. This document and the review tooling are only on PR #591.
