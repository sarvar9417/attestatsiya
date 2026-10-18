# M02 release wave 7 — source coverage, editorial QA and DB safeguards

Date: 2026-10-18. **Status: QA INCOMPLETE / UNPUBLISHED QUESTION BANK.**

## Verified textbook coverage work
- All 13 attached ICT/Cambridge+ textbooks scanned page by page: **2,616 PDF pages**, **2,604 text-bearing pages**.
- A total of **1,772 lexical construct–page candidates** were exported to the user's private QA archive `M02_QAMROV_VA_RELEASE_AUDIT_PAKET.zip`; term matching is a candidate index **not** proof of individual conceptual coverage.
- Verified exact, core pages: Cambridge+ 9 PDF 12–14, 30, 42–43; Cambridge+ 10–11 PDF 33–37, 45–46, 58–59; ICT 5 PDF 43–45; ICT 10 PDF 24–29; Cambridge+ 8 PDF 106.
- Many candidate hits in other books refer to unrelated modules (e.g., Cambridge+ 5 PDF 46 Excel and ICT 7 PDF 150 HTML). Do not pretend all 2,616 pages relate to M02.

## Assessment source-style gap resolved (review only)
- 2026 demo screenshot PDF 4 contains a Windows wildcard/file-mask task with `*` and `?`; existing M02 file-folder theory lacked this explanation.
- Added a source-labelled wildcard theory addendum to live M02 lesson 3, together with two original scenario questions `NEW-M02-013` and `NEW-M02-014`. Do **not** copy the original demo question/answer.
- Nine existing KTD questions were substantially rewritten in Supabase `review` status against cited textbook pages, with existing answer-option IDs and correct key preserved, only if expected old content and status matched.
- Existing KTD questions: 528 in `review`; newly authored source questions: 14 in `review`; previously published HW questions: 43 unchanged; previous 387 KT candidates remain `held`.
- Database structural verification: 542/542 unapproved questions have four distinct options and matching answer key IDs. Most recent KTD mechanical warnings: 122 unique-longest-character and 67 unique-longest-word correct answers; new authored questions 0 of both.
- These aggregate signals are automated QA indicators, not an independent expert certification.

## API/CI and publication safety
- This PR makes the verified `Tekshirilgan qo‘shimcha:` live DB passages visible **after** the complete existing nine-source static theory, never instead of it.
- Adds regression check covering **both** source prefixes, `ktd-540-2026:` and `authored:m02-source-20261018:`, using the existing rigorous item-level editorial publication gate. It does not publish any question.
- Database migration files in Git are not evidence that those migrations have been run against live Supabase; confirm this separately.
- A mocked-session Playwright/CI passing is **not** proof of a real production user login → theory → answer → result E2E flow.

## Scope and acceptance
- 2026 official specification PDF 3: 2 questions address technical/system software, while 5 Word/Excel/PowerPoint questions sit in the separate office subsection.
- Full item-by-item expert review for 528 KTD and 387 older KT questions is **not complete**. Their release stays held.
- Full textbook concept→theory→question coverage crosswalk is still required. No `Fully Completed` status until that and real account E2E pass.

**GitHub merge is authorized for reviewed code, not blanket publication of unapproved questions.**
