# 2026-10-21 production migration + editorial release reconciliation

Status: **PARTIALLY COMPLETE / SAFE-HOLD for irreversible changes**.
Source of truth: production Supabase `plyqezulrfowyblsfpzy`, GitHub `sarvar9417/attestatsiya` main and the user-supplied ICT/Cambridge textbooks.

## Production migration inventory — freshly verified 2026-10-21
The live comparison was read-only and joined Supabase `supabase_migrations.schema_migrations` to GitHub `supabase/migrations` by filename version. For one-statement migrations we additionally computed Git blob SHA-1 from the original SQL bytes (trailing newline variant tested) and matched it to the GitHub blob SHA.

| Check | Count |
|---|---:|
| GitHub migration files | 214 |
| Live migration history rows | 277 |
| GitHub versions present live | 181 |
| SQL text byte-exact confirmed for corresponding version and name | 149 |
| Local files with no equal live version | 33 |
| Live history rows without equal local version | 96 |
| Local same-version but different-name rows | 5 |
| Local same-version and same-name but text hash not provably equal | 27 |

**Important:** a nonmatching content hash is not automatically evidence of missing schema or failed migration. The oldest history includes empty/multiple `statements` and SQL stored in multiple chunks; never silently label these as unapplied. The formerly pending 26 exact-SQL history version repairs are already reflected in the current live version inventory. Do not replay that transaction.

### Nine same-name, different-version and different-SQL local scripts
`restore_m02_m05_source_lessons`, `task200_balanced_pedagogy_review_batch`,
`task204_m06_algo_v2_rfc_uuid_rekey`, `task240_graphics_web_v2_quarantine`,
`task207_algorithm_style_audit_snapshot`, `task207_original_attest_style_examples`,
`task346_numeric_qa_staging`, `task332_algo_v4_six_owner_waiver_publish`,
`task346_access_source_defects`.

These nine cannot be signed off through filename/version matching. Compare the local SQL and recorded live SQL statement semantically, including effects on existing rows, RLS, triggers, and dependent objects. If a material change is required, write a new guarded forward-fix migration. Do not overwrite old history based on name alone.

### Five same-version but different-name rows
- `20261018131001` local `ktd_independent_publication_gate`, live `ktd_independent_publication_gate_20261018`
- `20261019020001` local `task212_m13_axr_owner_publication`, live `task212_m13_axr_owner_publication_20261019`
- `20261019030000` local `task213_m13_native_y2_y3_140`, live `task213_m13_native_y2_y3_140_20261019`
- `20261019220000` local `official_mock_v3_diversity`, live `official_mock_v3_diversity_task306_prereq`
- `20261020093000` local `task306_m13_native_y2_4x5_review`, live `task306_m13_seven_native_y2_4x5_review_20261020`

Check recorded statement and code effect before any metadata correction. An equal version with different name is not itself proof of SQL equivalence.

### 33 local-no-version and 96 remote-only entries
The missing-version groups include old staged content and publication gates, and the remote-only group includes independent production fixes that are not represented as the same-version local file. **Do not run unrestricted `supabase db push`** or auto-replay the 33. Remote SQL may include protected exam answer material and must not be copied into the public repo without private-bank review. Preserve production history and classify migration intent, schema effects, and dependency order individually.

## Production question inventory — read-only
- `published`: 5,415
- `review`: 1,291
- `archived`: 1,624
- `draft`: 33
- `question_editorial_checks`: 249 records (176 refer to published, 73 to archived). These row counts alone do **not** authenticate a human signature.
- `attest_ingest.ai_question_reviews`: the AI audit ledger exists separately. It must never be presented as a human editorial signature.

### Initial independent source spot-check
Five S2.HW Y1 review questions independently solved against the existing keys and user-provided textbooks. Four **new** source-specific AI reviews were successfully inserted into `attest_ingest.ai_question_reviews` with `review_actor='chatgpt_ai_content_audit'`; one sampled question already had a record and was left unchanged. No question state, key, published revision, exam history, or real-human signoff was altered.
- Two questions: selected key is plausible, **cited pages do not directly support the claimed target term** (Cambridge+ 9-sinf PDF pp. 147–149: no textual explanation of file filter; ICT5 PDF pp. 38–41: no direct utility definition). Classified `ai_needs_repair`.
- One file-definition item: independent key match and textbook terminology support; stays `review` pending independent editorial signoff.
- Two extension-rename items: technical keys match, textbook source supports concepts, but items are near-duplicates; do not publish both without deduplication. One new AI record added, one existing AI record preserved.

Source evidence is the provided PDFs, not independently verified official attestatsiya originals. No private stems/answers should be placed in public GitHub documentation.

## Pull request reconciliation
- PR #367: its two changed file blob SHAs exactly matched `main` (`bfacf359641e06623cb80ce9cfe771a003b6f684` and `da9e5cf6a649cc40900a033537760c87a17f2f27`). Closed as already incorporated/superseded without attempting a duplicate merge; commented with SHA evidence. Earlier direct merge attempt was blocked by required `quality` context on an outdated merge-base, not bypassed.
- PR #306: source-audit docs/SQL only, currently not mergeable against main. Rebase and CI needed before an ordinary doc-only merge.
- PR #319, #321 and multiple historical security/learner PRs are drafts or release-blocked. No bypass of native Y2/Y3, historic-key immutability, publication gating, or missing source/human review.

## Required acceptance gates for full completion
1. Privately back up authoritative production migration history, including every recorded statement; preserve restricted question keys.
2. For the 33 local-no-version files and 96 live-only version entries, produce a per-migration metadata + effect ledger and run an isolated dry-run with history-consistent order; identify which are old superseded artifacts and which require *new* forward fixes.
3. Repair the nine SQL-semantic mismatches and five name mismatches **only** after byte/semantics/source checks; prove current live DDL and row invariants, never replay writes to published exams.
4. Confirm all required GitHub CI checks and authenticated staging E2E, including Y1/Y2/Y3, enrollment, quiz submit and historical review.
5. Assess each question's independent solution, source citation, distractors, diagrams, deduplication, and construct coverage; record AI-only checks explicitly, reserve human signoff for actual humans.
6. Apply approved forward-fixes, perform postflight SQL invariants, then explicitly deploy verified production SHA and test live site/API. Mark DONE only after all these gates pass.

Snapshot detail: `docs/audits/ATTESTATSIYA_MIGRATION_VERSION_SHA_LEDGER_20261021.tsv` contains every local file and every remote-only version with byte fingerprints and no SQL content or answer keys. Latest live inventory: 277 rows, 214 local files; 149 byte-exact, 14 same-version/same-name with unequal single-statement bytes, 13 with legacy multi/missing statement history, 5 same-version name differences, 9 same-name other-version, and 24 local versions/names unmatched.\n\nAs of this snapshot, **no new bulk migration replay or unreviewed review→published transition is authorized by the evidence**.
