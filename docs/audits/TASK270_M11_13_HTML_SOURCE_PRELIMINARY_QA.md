# TASK-270 — M11 HTML 13 candidate preliminary technical answer review

**Scope:** Existing `docs/audits/TASK260_M11_HTML_Y1_CANDIDATES.json` on main (merged PR #213) contains 13 new **draft candidates with no keys**. Live production at 2026-10-19 still had 7/20 published keyed questions in canonical lesson `html-matn-rasm-royxat`. 13 drafts in GitHub are not selectable test items; no production import/publish occurred.

## Source evidence

Owner-supplied `ICT 7_sinf-2021(1).pdf` physical PDF pp. 119–126 was checked directly. It documents:
- `<h1>`, `<p>` on p.119;
- `<ol>`, `<ul>`, `<li>`, list `type`, `start` and `reversed` on pp.121–122;
- `<img src>`, `alt`, `title` and image dimensions on pp.122–124;
- `<figure>` and `<figcaption>` on p.126.

13 corresponding draft identifiers were technically reviewed for basic HTML semantics and proposed best-answer choice. **Their draft key proposals are not in GitHub**: they were delivered privately to owner for true browser/source/editorial review and must not be interpreted as published keys.

## Editorial triage

| IDs | Concept | Preliminary result | Owner gate |
|---|---|---|---|
| M11H-001..005 | List semantics, numbering, nesting and reversed order | Source concept located; technical interpretation plausible | HTML5 parser/browser result and independent signoff |
| M11H-006..009 | Image paths, `alt`/`title`, width/height | Source concept located; basic interpretation plausible | Validate filename path and accessible alternative text |
| M11H-010 | `figure`/`figcaption` nested semantics | Source concept located on PDF p.126 | Exact HTML DOM + correct markup in real browser |
| M11H-011..013 | Heading vs paragraph, list item count, `type/start` | Source concept located; basic interpretation plausible | Cross-browser result and meaningful distractors |

**No editorial records or signoffs were inserted**. For live availability the user still needs 13 distinct, truly approved Y1/Y2/Y3 questions with real source, answer and originality validation (or approved equivalent candidates). The eight existing GV2 review Y2/Y3 sharing construct `S5.WEB.04` originate from another lesson, so should not be silently treated as source-correct M11.01 questions.

## Release plan

1. Human editor verifies each original draft question, exact source relevance and correct/incorrect choices, avoiding vague source page approximation.
2. Browser-test HTML code examples, using accessible semantics and matching interpretation of the supplied 2021 textbook, before creating protected question key IDs.
3. If editorial-approved, stage private items via existing authorization workflow; publish only after separately authorized approval and immutable revision/version checks.
4. Run real 20/20 preflight, mock 15/50 and UI E2E. No production DB changes, deploy or fake signoff in this PR.

**Status:** 13 assistant-pre-reviewed, 0 independently signed off, 0 staged into production from this work.
