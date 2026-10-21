# TASK-377 — Pedagogika 16 distractor tahririni productionga chiqarish (2026-10-21)

## Scope va ruxsat
- Userning 2026-10-21 dagi «productionga chiqar» ko‘rsatmasi: **faqat TASK-376** doirasidagi 16 ta savolning oldin mavjud REVIEW successorlarini productionga chiqarish.
- Ota-ona bilan suhbat savoli `2e951830-a7b7-4788-ac68-1cb3ebf21b31` bu 16 talik tarkibida emas; u alohida reviewda qoladi.
- 105 flagged published va boshqa 793 Y1 bo‘yicha to‘liq semantik audit tugamagan; 16 tadan tashqaridagi savollar chiqarilmaydi.
- 2026-10-18 egasining tashqi ekspert kerak emas degan ruxsati asosida `pedagogy_owner_release_waivers` protokoli; inson ekspert mustaqil attestatsiyasi da’vo qilinmaydi. Shu uchundirki `question_editorial_checks`dagi mustaqil sign-off booleans yolg‘on to‘ldirilmaydi.

## Production preflight (2026-10-21)
- 16/16 original `published`, 16/16 successor `review`.
- All source/revision source lessons, constructs, subject IDs, question format and group mapping check out.
- Original 16 records have **41 historical exam item references**, and these references will not be edited.
- 15/16 successor correct-answer text strings are rephrased compared to source; the wording and stems were reviewed against original semantic meaning and explanations. Correct-option UUID identity is preserved within each revision, no key table edit.
- Existing waiver/revision ledger for the 16 successors = zero; this release is fail-closed, cannot re-run.
- `TASK-377` migration contains the exact 16 option edits from TASK-376, checks original wrong text, matches current review ID + actual wrong key, and enforces four unique options, one correct key and 1.8/1.25 word length balance.
- Owner authorization is recorded with provenance; `publish_pedagogy_revision` alone atomically publishes new revisions and archives the old questions.
- Frozen fingerprint snapshot for old questions verified before/after; `question_bank_revisions` logs 16 source→successor swaps.
- Dry-run on live Supabase using `BEGIN; migration SQL; ROLLBACK;` passed, including 16 waiver/provenance entries and 16 ledger rows **inside the rolled back test transaction**. No durable modifications from rehearsal.

## Release operation
- GitHub PR and CI required, then apply using Supabase migration runner. Source file: `supabase/migrations/20261021114500_task377_pedagogy_16_distractor_release.sql`.
- Postflight SQL check 16 active new / 16 old archived, original 41 historical references still intact, new key fingerprints valid, no duplicate new questions.
- This release requires **no Vercel application deployment**: all changed content is stored in the production Supabase database; existing deployed API reads current question revisions.

## Handoff
- Task: TASK-377.
- QA: Supabase full rollback rehearsal passed; GitHub CI and production release status tracked separately.
- Risk: no independent expert sign-off; changes are explicitly owner-waived. Other weak distractors remain uncorrected.
- Next: complete issue #461 (full semantic audit, false negative triage, release separately).
