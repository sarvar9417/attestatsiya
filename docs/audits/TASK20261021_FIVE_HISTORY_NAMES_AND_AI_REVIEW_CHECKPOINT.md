# 2026-10-21 — Five exact-SQL history name corrections and review-bank checkpoint

## Delivery boundaries
**GitHub merge only; no Vercel deploy and no production SQL execution.**

### Current production verification
Five rows in `supabase_migrations.schema_migrations` have the **same migration version and byte-identical stored SQL** as the corresponding GitHub migration, but an outdated `name` field. A fresh read-only Supabase SHA-1 preflight, using the Git blob header + SQL bytes, returned **5/5 exact hash matches and zero canonical-name collisions**.

The guarded candidate fix is in `supabase/maintenance/task20261021_five_name_only_metadata_repair_NOT_APPLIED.sql`. It changes only `supabase_migrations.schema_migrations.name`, inside a transaction, with original version, old name, exact SQL byte hash, uniqueness and row-count checks; on any mismatch it raises an exception. It **has not been executed**. It must not be copied into `supabase/migrations` or applied as an unrestricted DB push. A backup and fresh preflight are mandatory at execution time.

### Nine same-name but other-version items
Review of the SQL saved in production against local GitHub file text shows:
- `restore_m02_m05_source_lessons` and `task346_numeric_qa_staging`: SQL normalized after stripping comments/formatting/transaction wrapper is identical, but their version metadata differs. Do NOT unilaterally renumber applied production history. Requires order-and-dependency proof.
- **Seven other items** (`task200_balanced_pedagogy_review_batch`, `task204_m06_algo_v2_rfc_uuid_rekey`, `task240_graphics_web_v2_quarantine`, `task207_algorithm_style_audit_snapshot`, `task207_original_attest_style_examples`, `task332_algo_v4_six_owner_waiver_publish`, `task346_access_source_defects`) have material SQL differences even after removing comments and whitespace. They require per-object/per-row semantic drift analysis, not history metadata rewriting or replay.

### Review question QA baseline (read only plus AI audit ledger)
Live cohort at audit time: **1,291 `review` questions**. For all reviewed Y1 items, stored UUID keys point to one of exactly four options; no missing key or source reference in the cohort. **83 review explanations are shorter than 30 characters** (75 are in `S5.WEB` Y1). Ten `S5.WEB` matching questions have 3 left + 3 right options. This 3×3 structure is **not itself proof of a defect**; test the actual native Y2 renderer, scoring and official exam-format policy before treating them as publishable.

The AI evidence ledger at this checkpoint includes **57 records**, of which 46 are `ai_checked_needs_independent_review`, 11 are `ai_needs_repair`. New detailed checks conducted in this work were 12 ICT5 file/folder review Y1 and 10 graphics/web Y2 matching records (all 30 pairs were independently mapped and agreed with their keys). Earlier four Y1 AI evidence writes plus one already-reviewed case had been recorded on 2026-10-21.

Actual original user-supplied textbooks examined include ICT5 (2020) physical PDF pp.43–45, ICT7 (2021) chapter ranges and Cambridge+5/9 candidate ranges. File and folder definitions have direct ICT5 support. The three repeated 'konvertatsiya' questions cite pages without that term in the original text layer; exact supporting source and duplication remediation are pending. Ten 3×3 Y2 items have semantically coherent keys, but six have incomplete literal-term evidence on the cited pages and/or need visual inspection. Missing extracted tokens alone do not prove absence in images or a faulty answer. No fabricated human review was created.

**No review→published transitions, question key changes, exam history edits, or production migration writes were made by this task.**

### Completion gates
1. Only after a separate operational approval to modify production migration metadata, execute the guarded script in an authorized maintenance window with rollback plan. Until then, no execution.
2. Resolve remaining 7 SQL semantic differences, 24 local-only/unmatched migrations and 96 live-only version entries without replaying historical writes.
3. Process 83 short explanations, source-page gaps and semantic duplicate clusters; record per-question evidence, not blanket approval.
4. Validate native 3×3 Y2 UI/render/submit/scoring in authenticated staging; inspect imagery and source page context as needed.
5. Maintain explicit AI-only review provenance; obey human-authentication requirements where enforced.
