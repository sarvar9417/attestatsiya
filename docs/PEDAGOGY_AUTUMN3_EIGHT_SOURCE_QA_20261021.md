# Kuzgi pedagogik mahorat (3): original PDF bilan 8 ta manba yozuvini tekshirish

**Sana:** 2026-10-21. Authenticated Barnoyevak Drive: `Pedmahorat to'plam 2025 kuzgi (3).pdf` (file ID `1xWf80PkokZJ_fwo6L7ICbFBHpPNt5xnM`, 41,070-readable-character extract).

## Ishonchli manba tarkibiga asoslangan tuzatishlar

Source QA work was applied to **eight distinct private source candidates** in `public.pedagogy_pdf_source_candidates` and read back from production Supabase. This is **source extraction remediation**, not learner-question publication. Each case was checked against the original readable PDF and kept its original editorial `needs_review` state.

| Internal source slot | Evidence from original booklet | Action executed |
|---:|---|---|
| 19 | Extract wrongly prepended preceding discrimination/bullying/shaming comparison text ahead of printed item #19; printed answer had a one-word line continuation | Removed the preceding comparison from the private stem, recalculated `text_sha256`, and restored only the printed source answer continuation |
| 46 | Printed question #7 source answer continues on the next line | Restored its final source-answer word; status remains `source_marker_unverified` |
| 47 | The extract for printed #8 starts with the final word of prior answer #7; the printed #8 answer itself stops midway | Trimmed preceding answer tail from the question stem and recalculated `text_sha256`; changed key status to `missing` without guessing missing words |
| 51 | Printed question #12 has a semantically unfinished source answer, immediately followed by a separate unnumbered question | Preserved raw source answer as evidence; changed key status to `missing` |
| 52 | Curriculum-adjustment item blends with a subsequent prompt on pupils' inner emotions; the source answer field itself contains a portion of question instructions | Flagged fused source layout; changed key status to `missing`, without fabricating a matching key or splitting the two prompts prematurely |
| 56 | Printed matching-answer marker has two trailing Telegram channel attributions, unrelated to the academic answer | Removed attribution handles from **unlinked** private source answer and kept original in private review notes; status remains `source_marker_unverified` |
| 33, 38 | Two private review candidates have source-answer markers ending with channel watermarks **but are linked to currently published Y1 questions** | Left their private answer text and published questions untouched; added source review-risk flags; tested published stems, 4 options each, answer payload and explanation for those channel handles — **none found** |

A guarded multi-row update tested the exact original question boundaries and marker suffixes for 19/46/47/51/52 before making any change. The database initially blocked an overbroad three-row watermark cleanup because 33/38 are linked; this was safely handled as a separate flag-only operation, while 56 alone received a clean-source-answer update.

Original private raw extracts before stem/answer cleanup were preserved in the `review_notes` of affected records (bound by the database's 4000-character CHECK). No private answers, student data or access credentials were copied to GitHub.

## Postflight

- Current autumn-(3) source: **78** total stored occurrences; **55 `needs_review`**.
- Of the 55 review candidates, **3** now explicitly have `missing` source key status and **4** previously observed original-booklet answer conflicts remain `conflict`. Others remain unverified printed markers.
- Source-stem hashes were recalculated for the two actually rewritten source stems (19 and 47) and read back **correct**. **Do not** infer that every other historical source hash matches a newly normalized stem: historical hashes predate some extraction layouts.
- Confirmed 33/38 public Y1 questions remain **published** with four options each; no `@PedMahoratGuli` markers in visible stem, options, protected key payload or explanations.
- Neither published learner keys nor historical attempts changed. No manual frontend deploy.

The PDF is a *booklet source*, not independently authenticated official exam provenance. Printed `Javob` markers are not deemed correct merely because extracted accurately.

Repeat checks in `scripts/audits/pedagogy_autumn3_eight_source_qa_20261021.sql`.
