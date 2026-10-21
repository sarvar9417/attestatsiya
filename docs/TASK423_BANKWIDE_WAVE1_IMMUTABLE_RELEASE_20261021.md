# TASK-423 — Full-bank Y1 wave 1: eight substantive option upgrades

## User authorization and scope
- Owner confirmed full 8,603+ item question-bank QA including **verified releases in batches**, 2026-10-21; continuation explicitly requested.
- Inherited exact eight TASK-379 `review` successor rows; source topics: bit, pixel, color depth, multimedia, media container, Unicode, Excel workbook, network gateway.
- **No claim of independent human expert signoff.** The owner delegated AI-assisted review and release; the revision is explicitly marked `is_generated=true`, ledger evidence stores review method and `independent_human_editorial_signature=false`.
- No release of new unreviewed questions outside this eight-item manifest.

## Release safety
- Source/review UUID, group, exact original+review fingerprint pinned in SQL. Source must be `published`, successor `review`, equal construct/subject/source lesson/assets and exact original correct answer text.
- Four case-sensitive unique options, exactly one correct key, correct word length <=1.25× longest distractor, total max/min word counts <=1.8×.
- No new human sign-off rows created.
- Old stems, option IDs/text, key payloads and exam attempts are never edited. Prior published version is only archived; new revision published, with immutable published-revision snapshot.
- Existing task379 review ledger updated with transparent provenance; original `task379_semantic_distractor_review_pending` finding resolved only after successful publish.
- Full transaction fails closed on count drift, unknown actor, content mutations, missing audit entries and unqualified new learner question.

## Preflight
- Eight originals published; eight successors in review; old/new correct answer text identical in all eight; eight prior review ledgers; new options valid and no high-severity open findings on successors.
- Previously observed historical exam-item references on the eight immutable old questions: **3**.
- Supabase production **BEGIN -> complete release -> ROLLBACK** rehearsal PASS on 2026-10-21: `batch_count=8, published_new=8, archived_previous=8`; no durable changes.
- Path: `supabase/maintenance/task423_bankwide_wave1_eight_immutable_release.sql`; regression: `src/tests/task423BankwideWave1Release.test.ts`. Release is one-time via Supabase migration runner only, not fresh CI migration chain.

## Handoff and next work
- GitHub CI and merge precede durable production apply; rerun immediate postflight on live database to prove 8 published, 8 archived, 3 historic references, answer/key fingerprint and release provenance.
- Continue remaining QA candidates as semantic adjudication batches (257 Y1 length, 283 lexical cues, 1,942 short rationales at last live snapshot; snapshot changes with concurrent work). Do not treat all signals as errors.
- Before next release check current `main` and Supabase state, as other tasks are concurrently active.
