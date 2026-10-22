# Informatika PDF — source-missing-premise remediation, wave 2

Date: 2026-10-22. **Scope: only Informatika; private AI-assisted QA, not a learner release.**

## Sources and grounded decisions

Authenticated Google Drive PDF text was fetched and compared with existing visually indexed original private candidates. Source pages were taken from the existing source QA index, not invented:

- `Excelda Matematik va Mantiqiy funksiyalarga oid savollar.pdf`, printed question 16 (PDF page 1): COUNT formula lacks defined values for A/B/R identifiers. Corrected derivative explicitly declares valid defined-cell names and types.
- `kodlash takrorlash savollari.pdf`, questions 2 and 7 (PDF page 1): source does not specify character serialization nor substitution/permutation key. Corrections explicitly define the per-character byte budget and one deterministic adjacent-pair permutation.
- `JavaScript 1-fayl tahlili.pdf`, else-section local question 1 (PDF page 3): initial variable undeclared, so the numeric console output is not fixed. Correction provides explicit initialization and an executable code fence.
- `IP_manzil_attestatsiya_savollar.pdf`, questions 2, 5, and 8 (PDF pages 2, 5, 8): original questions confuse network/broadcast addresses with host addresses, or omit an assessable final prompt. The new versions explicitly identify valid host addresses, prefix assumptions, requested network properties and four distinct options.

**Zero private question stems, keyed choices, or keyed explanations appear in public Git.** They exist only in RLS-protected, unreleased Supabase `attest_ingest.telegram_informatika_pdf_editorial_derivatives` records. Source PDF and any learner historical attempts remain unchanged.

## Calculation and source checks

- JavaScript runtime: a declared odd initial value, correct else branch and stdout.
- IP /27 /24 bitmask test: true network IDs, network/broadcast exclusions, 30 and 254 usable ordinary hosts.
- Encoding: explicitly fixed 8-bit per stored character; avoid comparing this with unmentioned packed encodings.
- Cipher: odd-length adjacent-pair swap is involutive; final unmatched character remains in place.
- Spreadsheet count: named numeric zero counts; named text value does not.
- Seven unique provenance source question keys; seven keyed four-option derivatives; seven original source blockers remain active.
- Original source fingerprints 7/7, original answer key NULL 7/7, new options 4 distinct 7/7, private-only status 7/7. Total private derivatives after this wave: **13**.
- Client access: anon SELECT false, authenticated SELECT false. No human editorial signature implied.

## Publication boundary and continuation

Nothing in this wave modifies published questions, options, exam items, attempts or original PDF question stem/key. The source blocker count is still **182 records** (some source questions have more than one blocker). **13 separate private corrections** do not mean that 13 original source blockers have been removed. Distinct original source variants must remain held until separate evidence-gated release. No frontend or Vercel deploy.

Next investigate graphical/tablular missing premises with authenticated original page evidence and avoid publishing incomplete source image tasks. Later production release must use explicit source proof, blueprint construct/lesson mapping, provenance of AI content, no near duplicates, immutable revisions and CI.
