# TASK-425 — Full-bank wave 2, eight owner-authorized immutable releases

The owner authorized all-bank audit and improved question releases in batches on 2026-10-21. This second wave follows completed TASK-423 first wave (8 replacements published, 8 predecessors archived, 3 old exam links preserved).

## Scope
- Exactly eight TASK-424 REVIEW successors in S1.INFO (7 questions) and S4.BLOCK (1 LOGO question).
- HSV/HSL, Hartley formula, machine word, coding, code table, sensor raw data→information→knowledge, file format, and LOGO square redrawing.
- Correct option **content** is unchanged, all wrong options distinct and conceptually adjacent, and contextualized explanations have been reviewed. Original question UUIDs, option strings, answer keys, and historic attempts remain immutable.
- Each new revision is transparently `is_generated=true`, with ledger provenance `independent_human_editorial_signature=false`; user-delegated AI-assisted review **is not** called human expert certification.

## Exact preflight
- 8 pinned source and successor UUIDs, source+revision content fingerprint, published source, review successor, same subject/group/construct/source lesson/assets.
- Only one `task424_semantic_distractor_review` ledger per source, no other source revision.
- Current correct option text matches pinned source and successor; four distinct keyed options, min/max word ratio <=1.8, correct/max wrong <=1.25.
- Official mock candidate eligibility before publish; snapshot and group eligibility post-publish.
- Original `task424_semantic_distractor_review_pending` source findings only marked resolved after full atomic publish and old archive.

## Safety rehearsal
Production Supabase `BEGIN; ... end-to-end release; ROLLBACK;` on 2026-10-21 returned `batch_count=8, published_new=8, archived_previous=8`. **No durable writes from rehearsal.** Three historical exam-item records on predecessors stay linked to the old IDs.

## Delivery
- SQL: `supabase/maintenance/task425_bankwide_wave2_eight_immutable_release.sql`
- Regression: `src/tests/task425BankwideWave2Release.test.ts`
- Merge only after full GitHub CI; apply one-time SQL via Supabase migration runner (not fresh-schema CI chain); verify eight snapshots, active new versions, eight archived old, eight correctness keys and three prior exams.
- No Vercel deploy (production database content only).
- Remaining full-bank review continues in GitHub issue #469.
