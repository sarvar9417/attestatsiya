# KT-HW 387 candidate bank — release hold and review gate

**Status: HOLD. Do not merge or deploy without the owner's explicit approval.**

## Evidence (2026-10-18)
- Input: 387 questions, 19 chapters, 1,548 options, 387 keys; source files stay PRIVATE, off GitHub.
- All 387 are **candidates only**. No question has been adjudicated through the complete source, expert, and owner approval process.
- Machine-generated triage: 53 correct options uniquely longest by character count; 145 items have option word-length ratio above 2, 53 above 3; 167 contain two or more distractors with absolute-language indicators; 12 have named terms absent **literally** from cited excerpts. These are REVIEW FLAGS, not categorical factual errors.
- 220 of 387 prioritized for revision by mechanical screen; 167 additional candidates still need source and expert review.
- All current source references point only to ICT grades 5 and 10 and Cambridge+ grades 9 and 10–11. Nine of the 13 available textbooks are not cited by any item: exhaustive all-grades coverage remains unproven.
- Several references give entire textbook chapters instead of precise pages. Source spans are not proof of every question's key.
- Examples: `KT-07-020` cites Cambridge+ 10–11 p.34 which asks readers to research PROM/EPROM but does not fully teach the distinction; `KT-09-005` Bluetooth can be anchored more precisely at Cambridge+ 10–11 PDF p.36; `KT-08-010` 4 GB per-file premise is not explicitly established on the cited storage-device pages.

## Data handling and promotion policy
1. Answer bank CSV and answer keys remain outside the PUBLIC repository. Never commit them to this PR.
2. Development database branch requires a separately confirmed hourly cost. Do not charge automatically.
3. When approved, upload candidates privately to `kt_bank_review.candidates` with `review_state='held'` and verification flags false.
4. Reconcile source by exact book, PDF page and proposition; repair distractors without length or grammar giveaway; run independent key / uniqueness checks and test difficulty rubric.
5. Move to `approved_for_import` only after `source_verified`, `expert_verified`, `editor_approved` and `approved_at` are all set. Even this state DOES NOT publish.
6. Only after the owner signs off on the new PDF and release request may a separate, reviewed importer target the public questions bank. No implicit publish workflow exists in this PR.

## Checks required
- Database fresh-install migration test (new SQL test registered in CI).
- Private staging insertion, no key disclosure to anon/authenticated.
- 387-by-4 option and key invariant; referential and duplicate checks.
- Item-by-item source evidence and 2026 construct mapping.
- Full practice session and mock independence; no unverified/held questions selected.
- Explicit owner consent for merge and production deployment.
