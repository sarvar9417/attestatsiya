# Production QA and migration drift — 2026-10-21

## Evidence base
- GitHub: `sarvar9417/attestatsiya` `main`; Supabase production: `plyqezulrfowyblsfpzy`.
- **214** local SQL files; **277** Supabase migration history entries at audit; **181** matching local history versions, **33** local versions absent (**9 same-name but materially different SQL**, **24 name-unmatched**), **96** remote-only versions. Migration name or SQL similarity **never** means automatically applied.
- SHA-exact, read-only owner analytics migration `20261019024000_task231_custom_exam_analysis.sql` was newly installed after a transaction-only dry run; test of unauthenticated access and a foreign/random exam ID passed. Its stored executed SQL Git blob hash matched the source and the history version was reconciled. No data-changing migration was applied during this QA wave.
- Four safe production SQL changes were applied during the preceding release: `topic_test_preflight`, `private_pedagogy_quality_flags`, `task234_admin_custom_coverage`, `task346_missing_visual_gate`.
- `supabase db push` is **NOT** safe as an unrestricted action while these drift rows remain. The production schema is ahead in 96 history entries and behind/different on 33 local versions.

## Risk-classified inventory (all 33 currently unmatched files)
| Category | Files | Release gate |
|---|---:|---|
| `STAGED_CONTENT` | 6 | Candidate publication, lesson updates, or editorial quarantine; check existing source records, editorial state and active learners |
| `APPLIED_VARIANT` | 9 | Production history contains same migration name, but differing Git SQL (CI adaptation, constraint change or guards); **do not rerun or mark the Git version applied** without semantic equivalence |
| `NEW_PRIVATE_SCHEMA` | 2 | New private review/objective tables with DML and grants; requires targeted schema preflight and rollback test |
| `REVIEW_ONLY_SEED` | 4 | Question-bank draft/review staging; deduplicate source references and verify source/keys before any import |
| `NEW_FEATURE_SCHEMA` | 1 | Custom presets table + RLS trigger; requires authenticated owner-isolation and UI contract testing |
| `REPLACES_RPC` | 5 | Overwrites a live scoring/selection/feedback RPC; needs diff against current `pg_get_functiondef`, role regression and exam privacy tests |
| `REVIEW_ASSET_UPDATE` | 1 | Changes review-only question assets; source image bytes and immutable boundaries need explicit check |
| `EXISTING_CONTENT_UPDATE` | 5 | Updates existing M07 question stems/difficulty (some published); protect immutable revisions and historical attempts |

| Exact GitHub migration file | Classification |
|---|---|
| `20261012100000_pedguli_original_topic_bank_30.sql` | `STAGED_CONTENT` |
| `20261012103000_pedguli_html_themes_original_24.sql` | `STAGED_CONTENT` |
| `20261012104000_pedguli_m16_scenarios_original_30.sql` | `STAGED_CONTENT` |
| `20261012105000_pedguli_scenario_based_lessons_6.sql` | `STAGED_CONTENT` |
| `20261012105900_professional_120_canonical_lesson_links.sql` | `STAGED_CONTENT` |
| `20261012105901_pedguli_editorial_review_gate.sql` | `STAGED_CONTENT` |
| `20261016105000_restore_m02_m05_source_lessons.sql` | `APPLIED_VARIANT` |
| `20261016210000_task200_balanced_pedagogy_review_batch.sql` | `APPLIED_VARIANT` |
| `20261018132000_pedagogy_draft_learning_objectives.sql` | `NEW_PRIVATE_SCHEMA` |
| `20261018133000_pedagogy_review_provenance.sql` | `NEW_PRIVATE_SCHEMA` |
| `20261018135500_task203_scratch_logo_v2_draft_bank.sql` | `REVIEW_ONLY_SEED` |
| `20261018195000_task204_m06_algo_v2_rfc_uuid_rekey.sql` | `APPLIED_VARIANT` |
| `20261019020000_task210_custom_presets.sql` | `NEW_FEATURE_SCHEMA` |
| `20261019023000_task230_custom_construct_filter.sql` | `REPLACES_RPC` |
| `20261019025000_task232_custom_exam_resume.sql` | `REPLACES_RPC` |
| `20261019030001_task233_custom_learning_feedback.sql` | `REPLACES_RPC` |
| `20261019032000_task240_graphics_web_v2_quarantine.sql` | `APPLIED_VARIANT` |
| `20261019040000_task239_office_v2_visual_review.sql` | `REVIEW_ASSET_UPDATE` |
| `20261019190000_exact_topic_test_count.sql` | `REPLACES_RPC` |
| `20261019210000_official_mock_random_selector.sql` | `REPLACES_RPC` |
| `20261020083000_pedagogy_examstyle_review_12.sql` | `REVIEW_ONLY_SEED` |
| `20261020084000_pedagogy_examstyle_review_7.sql` | `REVIEW_ONLY_SEED` |
| `20261020100500_task207_algorithm_style_audit_snapshot.sql` | `APPLIED_VARIANT` |
| `20261020101500_task207_original_attest_style_examples.sql` | `APPLIED_VARIANT` |
| `20261020110000_m07_scratch_logo_exam_style_review.sql` | `REVIEW_ONLY_SEED` |
| `20261020110500_m07_scratch_logo_difficulty_calibration.sql` | `EXISTING_CONTENT_UPDATE` |
| `20261020150000_m07_final_semantic_clarity.sql` | `EXISTING_CONTENT_UPDATE` |
| `20261020151000_m07_prevent_shape_answer_leak.sql` | `EXISTING_CONTENT_UPDATE` |
| `20261020160000_m07_expert_semantic_pass2.sql` | `EXISTING_CONTENT_UPDATE` |
| `20261020160500_m07_logo_retrace_correction.sql` | `EXISTING_CONTENT_UPDATE` |
| `20261020200000_task346_numeric_qa_staging.sql` | `APPLIED_VARIANT` |
| `20261020203000_task332_algo_v4_six_owner_waiver_publish.sql` | `APPLIED_VARIANT` |
| `20261020220000_task346_access_source_defects.sql` | `APPLIED_VARIANT` |

### Nine same-name, different-SQL files — replay prohibited
These were located in real `supabase_migrations.schema_migrations` and compared to GitHub source text:
- `restore_m02_m05_source_lessons`: production uses a different body/layout, GitHub includes additional bootstrap wrapper.
- `task200_balanced_pedagogy_review_batch`: GitHub includes guards for clean CI without private PDF intake.
- `task204_m06_algo_v2_rfc_uuid_rekey`: production checks `topic_test_attempts`, while GitHub comments it out for deployment portability.
- `task240_graphics_web_v2_quarantine`: historical publish-quarantine safeguards differ and are highly state-dependent.
- `task207_algorithm_style_audit_snapshot`: production asserts a fixed 288 V2/V3 rows; GitHub checks current dynamic corpus count.
- `task207_original_attest_style_examples`: GitHub adds a missing V3 lesson fallback for clean CI.
- `task346_numeric_qa_staging`: protected private table, comment/DDL variants.
- `task332_algo_v4_six_owner_waiver_publish`: GitHub tolerates incomplete fresh CI fixtures; production used strict six-item preconditions.
- `task346_access_source_defects`: GitHub joins imported source evidence to avoid CI without private corpus; production inserted source audit directly.

These are **historical applied variants**, not permission to overwrite schema or mark new local Git versions applied.

## Live production rollback-only SQL functional QA
All tests ran against production PostgreSQL in a `BEGIN ... ROLLBACK` wrapper; no persistent fixture users, rooms, answer rows or modules remained:
1. `supabase/tests/group_mock.test.sql`: host/peer/outsider, tokenless answer privacy, keyed reveal only after everyone answers, 2/0 scoring, foreign answer rejection, retry immutability.
2. `supabase/tests/group_mock_modes.test.sql`: official 50-question group selector quotas and topic/difficulty mode; fail-closed where eligible blueprint pool insufficient.
3. `supabase/tests/group_mock_resilience.test.sql`: room recovery, member leave, host cancel, cancelled invite, hidden member data.
4. `supabase/tests/official_mock_50.test.sql`: random selection, official blueprint quota guards, protected answer payload and authenticated-only RPC.
5. `supabase/tests/section_mock_50.test.sql`: 50×2 points, critical-floor pass/fail; 45/50 with critical floor unmet correctly `passed=false`.
6. Updated `supabase/tests/pedagogy_private_quality_flags.test.sql`: production regression passed without fixture-only heuristic-count assumptions; structural Y1 format, private view, editorial approval and substantive pedagogik takt rationale validated.

This is **transaction-based simulated 2/3-user role testing**, not browser testing with two genuinely authenticated sessions; do not claim real end-to-end client acceptance on this basis.

## Published pedagogy content quality findings
- Production private Y1 diagnostic view: 1,195 KS/PM.GEN/PM.MET Y1 questions (786 published, 375 archived, 34 review at prior baseline), **124** published `absolute_word_cue` and **33** published word-balance heuristics. These signals identify *potential overly-obvious distractors*, not necessarily incorrect questions. Sampling showed many `faqat` distractors were pedagogically wrong but too conspicuous.
- A later production snapshot (concurrent editorial publishes) showed **1,200** items in the Y1 view (**791 published**, **375 archived**, **34 review**). **127 published** had the absolute-word cue; of these **36** had at least two `faqat` wrong-option cues and **25** had three. By group: KS 38, PM.GEN 64, PM.MET 25 flagged published. **33** published had word-balance signal. This later count supersedes earlier point-in-time 124, and proves a live source audit must be time-scoped.
- In a broader published KS/PM.GEN/PM.MET set (all formats), **821** items were screened for explanation specificity: **3** had under-40-character explanations, **71** had fewer than 60 characters of rationale before the `Manba` footer, **23** began with a source/expert citation phrase; expert badge mention count 35. Threshold counts are inspection priorities, **not** automatic scoring failures.
- Verified user-reported `pedagogik takt`: **published** revision `78c6d67d-d654-440f-b39e-d8c61b17442f` explains why respectful error correction is pedagogical tact and how other options differ. The former source-only response remains **archived** under historical ID `55e95e8e-57d2-4f9d-afd4-b4ebd3bf904c`; do not edit archived attempts.

### Concrete editorial improvements (draft language, no immutable rewrite)
- `7093885b-0a74-437c-827a-d7bfde27686c` — `Refleksiya nimaga tayanishi kerak?`: *Kasbiy refleksiya darsdagi kuzatuv, o‘quvchi natijalari va konkret xatolar kabi tekshiriladigan dalillarga tayanadi. Faqat umumiy taassurot yoki hisobot soniga suyanish metod ta’sirini aniqlash uchun yetarli emas.*
- `5fc6bd1a-f526-4392-862f-e813a56c01b2` — hurmatli pedagogik muloqot: *O‘quvchini tinglash, fikrini bo‘lmaslik va muloyim javob qaytarish pedagogik etikaning hurmat hamda qadr-qimmat tamoyillarini namoyon etadi. Dars rejasi va baholash mezoni boshqa vazifalarga tegishli.*
- `53b961f3-3158-c176-5463-a49688645e35` — guruhlash metodining mosligi: *Uslubiy tahlil tanlangan o‘qitish metodining dars maqsadiga va o‘quvchilar faoliyatiga qay darajada mosligini tekshiradi. Psixologik tahlil ruhiy jarayonlarga, tashkiliy tahlil vaqt va tartibga, didaktik tahlil esa o‘quv mazmuni va maqsadiga kengroq yo‘naltiriladi.*
- **Do not** patch the published answer key or explanation in place: source question IDs may be linked to prior attempts. Prepare immutable new revisions with evidence and valid publication authority.

## Actionable release gates
- [x] Classified every unmatched migration and compared nine production same-name SQL text variants.
- [x] Applied one read-only owner-only custom exam analytics RPC with security regression and exact history match.
- [x] Verified five production mock/group SQL suites with rollback; no fixture remnants.
- [x] Corrected invalid heuristic-count regression test and checked it on production.
- [ ] Reconcile 24 name-unmatched migration effects with current schema/content source by source; select feature releases individually and use a linked CLI dry run before push.
- [ ] Perform authenticated two-browser QA using real owner-authorized test accounts (not available in this session).
- [ ] Curate the 124 published distractor signals and review 71 short-rationale explanations through immutable revisions.
- [ ] Re-run full GitHub CI after this QA PR merges; deploy only if explicitly approved as a subsequent release.

Production one-time Vercel release `dpl_Dj6RXTRCxHtYJUfFgsf6gD2XJKJr` previously reached READY on commit `c34b70d1029de32078f675049f5f54486830940e`; later QA merges are not assumed live.
