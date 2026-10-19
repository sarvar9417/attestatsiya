# TASK-260 — M11.01 HTML text/image/list: source and key triage

**2026-10-19. Status: DRAFT CANDIDATES READY FOR HUMAN REVIEW; NOT PUBLISHED, NOT DB-IMPORTED.**

## Scope and authoritative sources

- Official 2026 Informatics attestation specification, `Informatika Testlar spesifikatsiyasi.pdf`, **PDF p.5**: questions **27–31** assess graphics and web (five total), including HTML text, image, list, table/form tags and attributes and CSS.
- `ICT 7_sinf-2021(1).pdf`, **PDF pp.119–126**. Particularly pp.120–122 HTML ordered/unordered/nested list purposes, <ol>/<ul>/<li>, start/reversed/type; pp.123–125 img src/alt/title/width/height; p.126 figure/figcaption.
- `8-sinf informatika (Cambridge +)(1).pdf`, **PDF pp.85–86** (printed 82–83), corroborates ordered/unordered lists, <ol>, <ul>, <li>, and page design.
- Primary existing lesson: `b1100000-0000-4000-8000-000000000001`, construct `S5.WEB.04`, M11.01 HTML: matn, rasm va ro‘yxatlar.
- Source PDFs are used as **topic evidence**, not proof that any answer, distractor, Y2 mapping or Y3 order was independently approved. Wording is newly authored; no long excerpts reproduced.

## Live read-only audit (no DB writes)

`topic_test_preview` observed **7 eligible published items** for the configured **20**; numeric shortfall **13**. The historic production preview can return `reason=null` for underfilled topics: this is **not readiness**.

Eight mapped, keyed, **review-only** candidates were inspected individually (without modifying keys):

| DB candidate id prefix | Format | Focus | Initial mechanical/semantic inspection | Human sign-off |
|---|---|---|---|---|
| `1e07940d` | Y2 | img src/alt and a href/target | Four unique plausible pairings | none |
| `2531ff1d` | Y2 | head/title/body/meta charset | Four unique plausible pairings | none |
| `39e9f9dd` | Y3 | doctype, head, body, close tags | Four steps in a plausible order | none |
| `67cb38bf` | Y3 | nested ordered and unordered list | Four steps in a plausible order | none |
| `6d01337a` | Y2 | heading, paragraph, strong, sub | Four unique plausible pairings | none |
| `82c57795` | Y3 | ordered list with start=3 | Four steps; expected 3,4 numbering | none |
| `8e6c8b4e` | Y2 | ol, ul, li, start | Four unique plausible pairings | none |
| `ab41f271` | Y3 | linked image markup | Four steps in a plausible order | none |

**Provenance limitation:** all eight are **construct-linked** to the published M11 lesson, but their `questions.source_lesson_id` points to `e2150000-0000-4000-8000-000000000004` (a separate V2 lesson), **not** the published M11.01 lesson. The generator may count them by construct; that does not prove M11.01 source-lesson ownership or reviewer acceptance. Each needs mapped-lesson and original-vs-revision validation.

**Preliminary, not certified:** mechanically all 8 show pair/order keys matching presented options. This is a model-assisted source/logic inspection, **not** an independent editor verdict or evidence that the answers were executed in an authenticated exam.

## Additional 13 original Y1 candidates

The file [`docs/audits/TASK260_M11_HTML_Y1_CANDIDATES.json`](audits/TASK260_M11_HTML_Y1_CANDIDATES.json) contains exactly **13 distinct, source-page-linked Y1 candidates**, each with four possible responses and a difficulty band.

- Lists: semantics, numbering start/type, reversed, nesting, number of list items
- Images: relative src, alt, title, dimensions, figure/figcaption
- Text: heading vs paragraph

No `question_keys`, approval identity, production SQL, `published` status, or learner-facing import is committed. The option order is deliberately varied to avoid an obvious all-first-answer artifact; answer accuracy and distractors remain **unverified** until independent checking. These candidates **do not increase the existing 7/20 published pool**. They constitute the minimum numeric **13 candidate** remediation lane, not 13 approved tests.

## Work gates, in order

1. Editorially check **all eight existing review** items individually against the exact cited source, content revision, lesson/construct mapping, correct Y2/Y3 key structure, distractor uniqueness and accessible code samples. Record independent reviewer and evidence in the protected approval system; none is signed off here.
2. Check all **13 new Y1 candidates**: resolve one correct key per item, falsify all three distractors, disambiguate HTML5 vs historical/deprecated markup (`ul type` etc), and check duplicates in full published/review bank. Reject/rewrite any collision. Keep answer keys in protected server-side bank only.
3. Confirm required/critical construct quotas, no repeated UUID/revision in session, and 20 exact **published+keyed** accessible items; `review` and `draft_candidate` do not count.
4. Run fresh local database migrations and guarded test generation with fixtures; authenticated learner session, timer, 15/50 official blueprint and mobile/keyboard checks require a separate safe test environment.
5. Only with independent approval and owner release authority, create additive revisioned import migration. Do not update published question/key in place; **no production DB writes or Vercel deployment**.

## QA and next queue

- Automated registry test: `src/tests/TASK260_M11ReviewCandidateBank.test.ts` checks 13 stable IDs, four distinct options, proper source pages, content breadth and **no answer keys or false approval flags**.
- No claim is made that 13 draft candidates plus 8 review items automatically repair the live pool.
- After M11 editorial lane: **M09 75 slots**, then **M08 55**, **M03 52**, all individually source/key checked and release-gated. See TASK-251 inventory for per-lesson list.

## Handoff

- **Task:** TASK-260 — M11.01 source evidence, 8 review-key triage, 13 new draft Y1 candidates.
- **Files:** `docs/audits/TASK260_M11_HTML_Y1_CANDIDATES.json`, this report, `src/tests/TASK260_M11ReviewCandidateBank.test.ts`.
- **Migrations:** none.
- **Evidence:** published pool 7/20; 8 mapped review candidates, no editorial approvals; 13 new draft candidates, no keys.
- **Blocked:** expert sign-off, private answer-key review, full-bank duplicate search, local/staging publishing simulation, live acceptance; production release separately forbidden.
