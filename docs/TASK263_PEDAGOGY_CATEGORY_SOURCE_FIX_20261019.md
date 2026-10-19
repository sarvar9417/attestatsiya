# TASK-263 — High rejimidagi M15.01/M15.03 manbaviy tahrir (2026-10-19)

**Status: review-only branch; no production DB write, publication, merge or deployment.**

## Independently re-opened source

- Source: [Mirzayeva, “Pedagogika nazriyasi qollanma 2-mavzu.pdf”](https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view), barnoyevak/pedagogika/files; readable text fetched afresh on 2026-10-19.
- Source section “Pedagogika fanining asosiy kategoriyalari” explicitly enumerates **shaxs, tarbiya, ta’lim, bilim, ko‘nikma, malaka, kompetensiya, ma’lumot, shakllantirish, rivojlanish**. The old static lesson had only four concepts and called “bilim olish” a core category.
- Its “Tarbiya nazariyasi” section enumerates **fuqarolik, aqliy, axloqiy, jismoniy, mehnat, estetik, huquqiy, iqtisodiy, ekologik** education. The old M15.03 static table omitted **fuqarolik**.
- The accessed source text does **not** evidence the old unqualified “majburlash” example under methods. That example was replaced with more defensible noncoercive examples. This does not claim that the term is absent from all pedagogy literature.

## Changes

1. `src/data/topicContent.ts`: expand M15.01 category definitions and contrast knowledge / ability / automatized skill / competence with a classroom informatics example.
2. Expand M15.03 directions from eight to nine; distinguish an educational *direction* from a pedagogical *method*.
3. Add source/provenance notes to both static fallback lessons and retain `questions: []` (server-authoritative keys).
4. `src/tests/PedagogyCategoriesSource2026.test.ts`: five targeted regression tests to prevent recurrence.

## Audit limits and next gate

- **Source content confirmed from extracted text, not a physical PDF page citation.** Do not invent the PDF page locator, official normative status, or third-party reviewer signature.
- These fixes affect local static fallback theory only. Published server lessons, production question bank, score routes and historical attempts were not modified. Existing `PedagogyStudyNotes` optional educational notes remain additive.
- Outstanding: verify original pages for M14–M16, review 450 previously reported published items *against current read-only DB* (historical count is not current evidence), inspect 75 historically longest-correct Y1 cases, per-question keys/distractors, mobile E2E, final SHA CI.
- PR #207 (M16 methodology) and PR #125 (M15 review bank) remain independently open: do not bulk-merge either into this branch.

## Release

Merge only after GitHub CI `quality/backend/database`, source-edit review and conflict comparison against latest `main`; do not perform production DB writes or manually trigger deploy from this change.
