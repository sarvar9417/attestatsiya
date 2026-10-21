# Barnoyevak Google Drive Pedagogika — ingestion scope and acceptance checklist

Owner: `barnoyevak@gmail.com`. Source folder: https://drive.google.com/drive/folders/1XryoV_toq5QDVfLBxhKnsa-jwbcmk-KS ; its nested `files` folder: https://drive.google.com/drive/folders/1ERclL2nngkrPpSAtuHBBwemdw9zhFgw6 .

**2026-10-21 authenticated inventory:** 64 files in nested `files` folder: **59 PDFs + 5 DOCX**. This folder, *not solely a few PedGuli PDFs*, is the user's source of truth for the requested pedagogika bank.

## Import scope

1. **Normative/blueprint**: Pedagogik mahorat spetsifikatsiyasi-2025; Maktab pedagoglari — kasb standarti; Kasb standarti 1/2/3-soha; methodological manual for teacher standards. Map curriculum topics and cognitive level to specification.
2. **Theory/lessons**: Mirzayeva pedagogy theory/history; Xoliqov pedagogical mastery; Muslimov pedagogical competence/creativity; Mahmudov teacher speech culture; Aliqulova innovative pedagogy; Inoyatov, Munavvarov, Toxtaxodjayeva, Tolipova; inclusion and correctional pedagogy; evaluation-theory DOCX notes; pedagogical capabilities, lesson types and analysis. Extract original concepts; create lesson modules with citations and review, rather than copying copyrighted chapters wholesale.
3. **Tests/reference**: Demo PDFs (PedMahorat/Kasbiy), Mirzayeva test PDFs, Pedagogika testi 3, 2025 rehearsal/collections, autumn and spring PedMahoratGuli sources, 2026 material and remaining source PDFs. Extract and independently verify unique questions/options/keys; mark unkeyed or uncertain items as needs_review.
4. **Other documents**: Categorize all remaining names, check relevancy, duplication and rights; do not blindly import unrelated decrees or exact duplicates.

## Ingestion ledger requirement

For **each of the 64 source files**, capture source Drive id, path, MIME type, checksum if available, document type, relevance decision, extracted pages/questions or theory sections, corresponding DB lesson/question IDs, duplicate count, reviewed/published count and remaining reasons. Every source must have a **completed disposition**: imported, verified duplicate, reference-only, out-of-scope, or blocked with reason. The existing `pedagogy_pdf_source_candidates` table contains 953 PDF source candidates across prior work; this is **not evidence that all 64 files have been processed**.

## Quality gate

- Source/printed page grounding and original vs adapted material separation.
- Pedagogical subject expert review, correct response and distractor consistency, duplicate similarity, classification by exam specification.
- No fabricated official-exam provenance, guessed keys, unaudited mass publishing or retrospective changes to scored attempts.
- Existing lessons/questions must be reconciled before creating duplicates; the live database already contains 239 lesson records and 8,366 questions **across all subjects**, not exclusively pedagogy (2026-10-21 aggregate snapshot).
- Staged writes need reproducible, transactional upserts and review tests, then PR/CI/merge. Never conflate GitHub merge with a production database import, and avoid manual production deploy unless requested.

## Immediate next work

Build the actual per-file ledger and source-to-lesson/question gap report for all 64 files; then process normative and theory texts followed by complete, verified test imports. Previous extraction audits are supporting sub-tasks, not the overall completion criterion.

**This document resets project scope only. It is not an assertion that the files have already been ingested.**
