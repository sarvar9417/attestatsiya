# 2026-10-23 — Legacy topic test repair and residual production QA gates

## Verified code repair
The frontend has 16 static modules. In M03/M09/M10/M12 the learner-facing topic codes do not share slugs with the published question bank. The backend's UUID resolver previously returned HTTP 404 for these codes. The exact legacy-to-published pairs introduced in this PR have been checked against production **published lesson slugs and titles**, and the target lessons' live preflight endpoints returned `200 ready=true`. Matching is `slug = exact_value AND status = published`.

Mappings: `M03.01→office-v2-w01`, `M03.02→office-v2-w02`, `M03.03→office-v2-w03`, `M03.04→office-v2-e01`, `M03.05→excel-formulalar-va-funksiyalar`, `M03.06→excel-filtr-saralash-diagramma`, `M03.08→office-v2-p01`, `M03.10→office-v2-p02`, `M09.01→malumotlar-bazasi-va-mbbt-asoslari`, `M09.03→kalitlar-va-jadvallarni-boglash`, `M10.01→kompyuter-grafikasi-turlari`, `M10.02→paint-va-photoshop-asoslari`, `M12.03→arxitektura-va-topologiyalar`, `M12.05→ip-manzil-va-tarmoq-maskasi`.

**Do not** assign a published lesson to other static chapters by ordinal, fuzzy title, or partial overlap. M12 V2 remains behind the separate expert release flag. Tests are server-scored; this change does not create or reassign question keys.

## Appendix versus genuinely missing blueprint
Read-only SQL and production preflight both initially reported 14 rows without construct links. **Four M01 rows** (`m01-01`, `m01-10`, `m01-11`, `m01-12`) have `blocks_kind='appendix'` in production, and their source-authored local content also has `kind:'appendix'`. Their generic database test count of 20 is legacy metadata, **not a required exam**. The backend now reports `ready=false, required=0, reason='not_required'` for published appendices without changing the database constraint or manufacturing test questions. The remaining **10 genuinely missing test blueprints** belong to M15:
- M15 `pedagogika-fan-sifatida-tadqiqot-metodlari`, `inklyuziv-talim-asoslari-va-moslashtirish`, `korreksion-pedagogika-mutaxassislik-yonalishlari`, `baholash-nazariyasi-38-savol-takrorlash`, `pedagogik-refleksiya-va-kasbiy-tashxis`, `pedagogik-mahorat-tort-komponent-va-kasbiy-rivojlanish`, `baholash-nazariyasi-distraktor-va-test-sifati`, `moslashtirish-va-ketma-ketlik-topshiriqlari-aniqligi`, `pedagogik-kreativlik-sifatlari-va-kompetentlik`, `oqituvchi-nutqining-yetti-kommunikativ-sifati`.

The 10 M15 lessons still return `reason=blueprint_missing` and 20 configured questions. Existing M15 constructs cover **other, distinct topics** (PM.GEN.01–08 and PM.MET.01–03), so bulk-linking these would create misleading exams. Editorial action: determine which M01 are true appendix/guide materials vs diagnostics; for every M15 lesson, define scope, source-backed objectives and topic-specific constructs; author independently reviewed, keyed questions; only then publish the required blueprint, run topic_test_preflight and generate_topic_test end-to-end. Until then display test-not-ready, not a false 20-question CTA.

## Security/performance notices — triage, not blanket changes
Supabase advisor: 54 `rls_enabled_no_policy` INFO (many private/staging deny-all tables), 37 authenticated `SECURITY DEFINER` WARN (public learner RPCs), one anon `auth_role()` WARN, one leaked-password-protection Auth setting WARN, and 39 unused-index INFO. `auth_role()` anonymous privilege is **deliberately required** by production public-content RLS and enforced by `supabase/tests/anon_rpc_hardening.test.sql`; revoking it blindly breaks public reads. The 37 authenticated functions require per-function authorization checks before altering permissions. Unused indexes are statistical signals, not proof an index is safe to drop; capture index scans during representative production load and assess uniqueness/FK constraints first.

Compromised-password protection is an Auth configuration toggle; the connected tool surface does not expose a safe setter. A dashboard admin must enable it and subsequently verify sign-up/password reset. [Supabase Auth guidance](https://supabase.com/docs/guides/auth/password-security).

## Editorial warning signals
Production quality registry includes thousands of **open findings**, some on published questions: missing editorial evidence, suspicious correct-choice length, and pending independent semantic review. Findings are NOT a count of incorrect answers, and a question may carry multiple signals. Changing answer choices/keys or archiving published questions without source-based review risks damaging historical exam integrity. Stage immutable review candidates and sign off in small approved batches. See `docs/TASK379_BANKWIDE_OPTION_QUALITY_AUDIT_20261021.md`.

## Acceptance checklist
1. Every newly mapped legacy code returns HTTP 200 and appropriate server-verified preflight on production.
2. Previously approved M11 topics and M02/M04/M05/M06/M07/M08/M13–M16 regression tests stay green.
3. Catalog never labels an unverified topic's test as already available.
4. Only merge when backend, frontend (typecheck/lint/unit/E2E), DB, and aggregate CI pass.
5. Missing 10 M15 blueprints, other unmapped chapters and quality/security warnings remain tracked; **do not claim them completed** without independent evidence.
