# TASK-20261021 — Independent numeric QA of 23 partially sourced S5.WEB review items

## Scope and disclosure safeguards

This report cross-checks the **current `review` edition** of every item marked `partial` in `TASK20261021_REMAINING_59_WEB_REVIEW_EVIDENCE.csv`, without publishing any private correct-answer UUID, complete stem or distractor options to GitHub.

No change to `public.questions`, `question_keys`, archived editions, attempt history or approval records; no deploy.

## Key correctness vs textbook source evidence: separate decisions

The live review bank was inspected as read-only data. Each of the 23 items has a saved answer and four choices, with the saved key UUID occurring in the option set. This is **structural**, not a proof of the answer's factual truth.

**15 arithmetic Y1 items independently recomputed and cross-checked against saved keys:**
- `GV-CS` **7** CSS `content-box` horizontal footprint computations. Each includes content width and two sides of padding, border and margin, as given. Distinguish outer space from content width and `border-box`.
- `GV-GFX` **5** pixel-count products from dimensions. This is `width × height`, not compressed file size.
- `GV-GFX` **2** indexed-palette maximum counts using `2^bits`. The original ICT7 PDF physical **p.31** describes the Hartley `N=2^i` relation, but the precise tested indexed-palette examples are a further derivation.
- `GV-GFX` **1** uncompressed 32-bit RGBA pixel-array byte count using `width × height × 4`, excluding encoding/container headers.
- **Result: 15/15 saved keys match the independently calculated result.** Some numbers are repeated-concept variants; passing a calculation does not eliminate test diversity concerns.

**Eight conceptual items remain partly sourced rather than being reclassified as direct textbook evidence:**
- `GV-ED-020` nondestructive layer-mask hiding: ICT7 p.64 visually demonstrates hiding; full preservation/workflow guarantee is an inference.
- `GV-ED-037` opacity 0%: ICT7 p.64 demonstrates 50% then 100%, not the exact 0% endpoint.
- `GV-ED-040` black mask conceals: ICT7 p.64 screenshot has visual evidence but not an explicit written black/white rule.
- `GV-ED-041` adjustment layer later edit/removal: ICT7 p.61 shows Hue/Saturation adjustment; not a complete textbook statement on nondestructive editing.
- `GV-GFX-008` third Cartesian coordinate `z`: ICT7 p.42 explains three-dimensional graphics but does not label Cartesian axes.
- `GV-HT-014` `img` as void HTML element: ICT7 shows `img` usage, not the formal no-end-tag definition.
- `GV-HT-019` semantic `strong` versus `b`: ICT7 p.115 discusses bold display for **both** tags; the semantic distinction is not stated, requiring a standards-based reference.
- `GV-RV-016` uncompressed image pixel-memory assumption: related ICT7 p.31 worked example and dimensions/bit-depth discussion are relevant; row padding and file headers require extra qualification.

**Outcome:** Of these 23 `partial` items, 15 have independently verified numerical keys; 8 have technically coherent conceptual keys with incomplete literal textbook support. None was promoted to a human-approved publication state.

## Current database safety check

New `supabase/maintenance/task20261021_partial23_review_integrity_READONLY.sql` was executed via **SELECT only** in the linked Supabase project on 2026-10-21:

| Source family | Current review items |
|---|---:|
| `GV-CS` | 7 |
| `GV-ED` | 4 |
| `GV-GFX` | 9 |
| `GV-HT` | 2 |
| `GV-RV` | 1 |
| **Total** | **23** |

The identical source aliases also refer to **23 archived predecessor editions**. A first query mistakenly doubled per-family counts by joining historical rows; the committed version uses `count(DISTINCT e.alias)` and has been retested, giving exactly 23 current review questions, 23 archived historical editions and **0 Y1 option-key structural defects**. This is a critical invariant for all source-alias audit scripts.

## Remaining release gates

1. The **7 original-textbook source gaps** in the combined 59-row matrix remain open; technical primary-source supplements do not magically appear in original textbook pages.
2. These 8 conceptual partial cases still need actual textbook image review and/or appropriately labeled standards/vendor supplements and explicit syllabus admissibility.
3. Semantic-repetition risk remains; avoid placing many near-identical multiplication and CSS-box arithmetic items in the same mock.
4. Authenticated Y2/Y3 server-side E2E in a **non-production** seeded staging environment remains outstanding. Existing protected browser tests intercept API/auth requests and therefore do not prove live RLS, real user login or server scoring.

### Local run

```bash
git checkout main
git pull origin main
psql "$LOCAL_DATABASE_URL" -v ON_ERROR_STOP=1 \
 -f supabase/maintenance/task20261021_partial23_review_integrity_READONLY.sql
```

The local database needs to contain the same review/test fixtures. This SQL does not change anything; no production database writes or deployment were made.
