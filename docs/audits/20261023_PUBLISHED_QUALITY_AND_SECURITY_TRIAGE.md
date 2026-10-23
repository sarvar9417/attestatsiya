# 2026-10-23: published question editorial triage — read-only snapshot

**Scope:** Supabase project `plyqezulrfowyblsfpzy`. No question, key, RLS, schema, or user-attempt writes. This is a reviewer work queue and evidence classification, **not** an autonomous correctness verdict.

## Distinct questions versus finding rows
A live read-only query on 2026-10-23 found the following open findings on *published* questions:
- `editorial_evidence_missing` (medium): **4,604 question IDs**.
- `y1_correct_answer_strictly_longest` (medium): **831 question IDs**.
- `y1_answer_length_high_risk` (high): **294 question IDs**.
- `independent_editorial_review_required` (high): **63 question IDs**.
- Other source / format flags exist.

Finding groups can overlap. A length heuristic does **not** establish that the key or content is wrong; source review is required.

### Live scoreable evidence gate behavior
`public.question_source_evidence_eligible(q.id)` already **excludes** published questions with open source-evidence flags for `KS`, `PM.GEN`, `PM.MET`. On this snapshot, **200 such published IDs** were evidence-ineligible (KS 60, PM.GEN 92, PM.MET 48), while **4,404 flagged specialty IDs** in `S1.*–S7.*` still passed **this specific helper**. Passing the helper does *not* prove any particular exam generator will serve them: other selection predicates also apply.

**Do NOT extend the broad evidence-missing block to all specialty groups without verified replacement pools**: it could disable thousands of genuine topic tests. Do not auto-change answers, archive the 294 length outliers, or let an unreviewed AI judgement stand in for an independent expert.

### Prioritization
Select groups with the most open high-risk *distinct* IDs: S1.INFO 62; S7.SEC 62; S2.OFFICE 55; S6.NET 35; S4.CODE 25; KS 24; S3.ALGO 20; S4.EXT 17; PM.GEN 16. These are risk signals, not proven exposure metrics. Build source-backed review waves per group, starting with independent human-review holds and the highest-impact test modes.

### Reviewer/owner acceptance
For every candidate, record: original source page, full stem, all options, correct key, exact intended construct and format, plausible alternatives, potential test-taking clues, source rights, reviewer evidence and decision. Use immutable REVIEW successors, never change historical question keys in-place. Propose publication only when independent source validation and preflight/test regressions pass.

### Reproduction
Run `supabase/maintenance/20261023_published_question_quality_triage_READONLY.sql` using a **read-only** client. It returns (1) risk counts grouped by exam group using question IDs not finding-row counts, (2) first 100 anonymized identifiers + source slugs for triage without leaking stems/options/keys, (3) published evidence-flagged question counts split by the exact existing eligibility helper. The SQL contains no DML, DDL, grants or RPC mutations.

### Security notices held pending independent verification
Read-only inspection found all 37 currently authenticated-executable public SECURITY DEFINER functions mention `auth.uid()`, and the list checked had configured `search_path`; this is a **syntax signal** only, not proof that every function has correct ownership enforcement. The sole anon-executable `public.auth_role()` is a documented, intentional RLS dependency. 54 RLS/no-policy INFO (mostly restricted review/ingest tables) and 39 unused-index INFO cannot safely be blanket-fixed. Supabase Auth's leaked-password-protection setting is not editable with the connected app; a project administrator must enable it in Dashboard after assessing plan availability and test sign-up/reset. No change has been performed.

Related tracked issues: #587 editorial/security, #586 M15 objectives and source pools, #589 npm dependency audit.
