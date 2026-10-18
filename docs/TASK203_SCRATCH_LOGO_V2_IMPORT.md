# TASK-203 Scratch/LOGO 2.0 — platforma integratsiyasi

- Maqsad: M07 ga 6 ta draft nazariya bobini va 180 ta draft savolni qo‘shish.
- Oldingi 5 ta published dars yoki mavjud savollar tahrirlanmaydi.
- Foydalanuvchi natijalari, imtihonlar, attempt tarixiga tegilmaydi.
- 2026 spetsifikatsiyasining S4.BLOCK.01–05 konstruktlariga bog‘langan.
- 168 Y1, 6 native Y2, 6 native Y3.
- Chizmalari (SVG): 7 tur. Public URL: /scratch-logo-v2/*.svg.
- Migration: 20261018135500_task203_scratch_logo_v2_draft_bank.sql; status: draft; human review required.
- Migratsiyani productionga qo‘llash / merge / deploy: foydalanuvchining alohida ruxsatisiz bajarilmaydi (PEDAGOGY_RELEASE_FREEZE.md).
- Markdown nazariya Pandoc orqali 2.0 LaTeX qo‘llanmasidan chiqarildi, sarlavhalar manbalarga mos.
- Y2 / Y3 asl ko‘rsatilgan variant-kombinatsiyalar o‘rniga platformaning native UUID key shaklida o‘tkazildi.
- Rasmli savollar uchun diagrammalar GitHub public asset sifatida qo‘shilishi kerak.

**Bajarish:** clean Supabase migration chain -> SQL -> SQL regression -> frontend smoke -> human editorial review -> alohida ruxsat bilan release.
## M07 canonical mapping (CI)
The canonical lesson drift test requires all questions, including drafts, to reference the published canonical M07 lesson for their construct. All 180 draft questions therefore point at the five existing published canonical lessons by S4.BLOCK.01–05. The six new in-depth chapters are **separate draft lesson editions**, not automatically replacing published content. Their chapter grouping is retained through `SL2-xx-yyy` source references. A later editorial release must coordinate theory promotion and question source-link reconciliation. No learner-facing publication occurs in this PR.


## Production reconciliation and CI status (2026-10-18)

The six 2.0 Scratch/LOGO chapters and 180 four-option questions were
previously imported into the production Supabase M07 module and published.
That existing, validated database state must **not** be duplicated by
this historical draft import migration. The migration detects all 180
published SL2 source IDs, validates their keys and six theory chapters,
and exits without inserting duplicate drafts. It fails closed for
partial imports or invalid answer references.

On a **clean database**, the same migration seeds a separate **draft**
review bank (168 Y1, six native Y2, six native Y3) pending editorial
approval. This difference is intentional. Existing learner attempts
and their question identifiers must remain unchanged.

CI uses `.github/workflows/ci.yml` job `quality` (alongside
`database` and `backend`). A successful workflow job is necessary,
but merge can still be blocked when a repository ruleset has a stale or
incorrectly attributed required status check. Re-run checks on a new
pull request head before considering an administrative ruleset fix.
