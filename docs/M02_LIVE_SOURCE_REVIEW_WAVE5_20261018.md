# M02 2026-10-18: first source-based live database update

**Status:** PARTIAL / PRIVATE REVIEW. This document is an implementation record, not final content release approval.

## Direct Supabase changes (already executed)

- All four canonical published M02 lesson `body_mdx` fields were extended in-place, preserving their former content. New character lengths: 3596 (devices), 3265 (operating systems), 3277 (files and folders), 3371 (system and application software).
- The extension starts with the exact heading prefix `## Tekshirilgan qo‘shimcha:` so the learner UI can extract it without replacing the full previous nine-part static theory.
- Twelve new Y1 source-authored questions were inserted **only as `review`** under `authored:m02-source-20261018:NEW-M02-001` through `-012`:
  - HW.01: 3; HW.02: 2; HW.03: 3; HW.04: 4.
  - 48 distinct option records and 12 keyed answers, all matched to their own questions.
- Three existing D/E question drafts (KTD-02-020, KTD-05-020, KTD-08-020) were rewritten into realistic motherboard/ports, magnetic-tape/HDD, and software-classification scenarios and kept `review`. Original keyed option IDs were preserved.
- The previous 528 KTD questions remain `review`; 387 older private KT candidates remain `held`. The 43 pre-existing published M02 questions were not edited.
- Source pages checked directly in uploaded ICT 5 / ICT 10 / Cambridge+ 9 / Cambridge+ 10–11 PDFs. Exact pages for each item are stored in private answer explanations. No answer key content was added to public GitHub.

## This branch (code only, not live yet)

- Fetch the four M02 canonical published lessons when the student opens them.
- Keep original complete static curriculum as primary content.
- Append only DB theory blocks starting with `Tekshirilgan qo‘shimcha:`; ignore draft or unmarked DB theory.
- Add regression tests for unmarked/draft protection and append behavior.

## Important limitations

- This wave verified targeted passages in four books, NOT complete M02 coverage across all thirteen textbooks.
- 528 KTD items and 387 old KT items have not passed complete independent expert review.
- Newly authored questions are working **review** candidates even though structural checks passed; source and three distractors need independent signoff.
- No new merge/deploy or question publication without separate instruction.

## Verified QA after this wave

- Existing KTD bank: 528 review questions, **136** unique-longest-character and **76** unique-longest-word correct options still flagged.
- New authored M02 bank: 12 review questions, 48 options, 12 linked keys; **zero** unique-longest correct option by characters or words.
- 43 previously published M02 questions unchanged. No automatic publication.
- The thirteen-book audit is not complete; source-page checks were performed in ICT 5, ICT 10, Cambridge+ 9 and Cambridge+ 10–11. The other books are queued.
