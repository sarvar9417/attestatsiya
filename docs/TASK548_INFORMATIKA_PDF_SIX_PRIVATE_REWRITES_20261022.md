# TASK-548 — Informatika PDF: first six source-corrected private review items

**Date:** 2026-10-22. **Scope:** only Informatika PDF material. No Pedagogika changes.

## Why

After a live database audit, six original PDF question candidates were found to be pedagogically unusable as-is:
- `Excelda ba'zi misollar tahlili.pdf` physical PDF pages 1–2, source Q4/Q8/Q9: impossible requested outcomes despite defined Excel functions.
- `Python dasturlash tilida Operatorlar.pdf` physical PDF pages 2–3, source Q17/Q30: missing operand or missing method-access dot (Python syntax defects).
- `sanoq sistema kodlash test.pdf` physical PDF page 1, source Q4: no correct original multiple-choice option.

The three original Google Drive PDFs were fetched under the authenticated source account and cross-checked against their private Supabase source-candidate records. Existing source-candidate visual-review flags were retained; no claim that simple text extraction independently proves formatting of mathematical superscripts.

## Execution

1. Independently verified three Excel source contradictions with branching proofs and sweeps over 2,001 integer values each.
2. Executed two corrected Python 3 programs with successful exit code and exact stdout; confirmed original code syntax defects.
3. Recomputed the base-five large-integer answer by exact integer arithmetic and digit extraction.
4. Created only the private `attest_ingest.telegram_informatika_pdf_editorial_derivatives` table by a schema migration with RLS and revoked `anon`/`authenticated` grants. This separate table is **not** a learner test pool.
5. Inserted six AI-assisted self-contained derivatives, each with four distinct options, one keyed answer, reason, explanation, source page, source text MD5 and computation evidence **only in Supabase private DB**. This public repository intentionally does not contain their answer keys/stems/options.
6. Ran independent postflight SQL: **6/6** private rows, **6/6** original MD5 matches, **6/6** original-source blockers still present (no premature source release), **6/6** four-choice/key checks, **6/6** enforced private-only state, RLS true, anon SELECT false, authenticated SELECT false.

## Release boundary

Original PDF candidates are unchanged; none of the six private edits was inserted into `public.questions`, `question_options`, `question_keys`, `exam_items` or student attempts. Original release blockers continue to block the original questions. These are **AI-assisted, owner-delegated** expert proposals; do not label them independently human-approved. A future distinct publication must complete duplicate/construct/lesson/source, semantic, immutable-history and official-mock gates before any learner release. No frontend/Vercel deployment was performed.

## Next work

Continue resolving the remaining source-defect queue, prioritizing missing premises, inconsistent SQL syntax, contradictory option sets and required graphic assets; keep authored derivatives and original source snapshots separate. Re-run source-fingerprint and access-control postflight for each new batch. This task does **not** claim that the 182 release-blocker records have been cleared: six new private alternatives and original-blocker resolution are different outcomes.
