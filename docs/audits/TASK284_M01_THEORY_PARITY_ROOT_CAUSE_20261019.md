# TASK-284 — Why other chapters are NOT yet as complete as M01.02

**Date:** 2026-10-19. **Status:** PARTIAL — editorial/source audit open; branch-only, no production deploy.

## Verified cause

The user's reference is **Axborot va raqamli savodxonlik → Informatika, ma'lumot, axborot va bilim** (`M01.02`). Its generated `src/data/topics/m01.ts` contains **112 authored theory blocks in a 45,468-character source-code slice**, with an ordered long-form LaTeX source and defined sections. It comes from `Axborot_va_axborot_jarayonlari_LaTeX/I_qism_Axborot_va_raqamli_savodxonlik_yagona.tex`.

Most other modules initially shipped a `TOPIC_CONTENT` seed of **6–9 blocks** and **roughly 1,500–3,000 source-code characters per chapter**; TASK-273 appended only a handful of tables/examples and sources per topic. This did **not** reconstruct a 30–100-block subject textbook chapter.

`BookReader` was unified by TASK-262, but `splitAdaptiveSections()` merely paginates brief content, **not enlarging it**. In addition, some modules use separately published remote `body_mdx` (M04, M06 V2, M07 Scratch/Logo, M13 AXR, M14, M16). Static-data length alone therefore cannot certify what a logged-in user sees.

**Explicit correction:** The prior description “415 extra blocks across 81 lessons” was about incremental additions, **not M01-depth parity**. The code/UI was not proof of textbook completeness.

## Current genuine long-form upgrades in this PR

- **M03.05 Excel formulalari va funksiyalari:** `src/data/topics/m03ExcelCanonicalBook.ts` contains **51 original, source-traced new blocks** and 9 natural chapter headings. It covers the model/data boundary, formula precedence, relative/absolute/mixed references, arithmetic/statistical/text functions, IF/nested IF, VLOOKUP and INDEX+MATCH, conditional counting/sum/average, data validation, test plan, worked cases and practice solutions. The 10–11-sinf Cambridge+ textbook, **8-bob, printed ~115–127**, was examined from the user's Drive. Legacy M03.05 theory and TASK-273 additions remain as secondary review and existing question bank does not change.
- **M15.01 Pedagogika fan sifatida:** `src/data/topics/m15PedagogyCanonicalBook.ts` contains **42 original new blocks**, 8 natural chapter headings, method tables, teaching/learning/competence distinctions, pedagogy research methods, research cases and exercises. Based on the user's «Mirzayeva Pedagogika nazriyasi qollanma 2-mavzu.pdf». The earlier reviewed static text and separately-authored M15 notes remain in reading order; existing question bank unchanged.
- **M12.05 IP manzil, maska va tarmoq hisobi:** `src/data/topics/m12IPv4CanonicalBook.ts` contains **43 newly authored blocks**, 8 natural headings, source-context networking explanations, bitwise AND, CIDR, /24–/30 tabulation, /31 and /32 boundary cases, six solved subnet cases, tasks and explanations. The Cambridge 10–11 ICT networking material supplies context; the IP calculation examples are **original additions** and do not claim to be direct textbook transcription. Original M12 legacy notes preserved.
- All three chapters explicitly use `content.source`, so BookReader follows original **heading-based M01 book chapters**, not artificial three-block pagination.
- Tests check block retention, exercises, goal, source, natural section order, progression and the distinction between book styling and content quality.

**Caution:** None of the three exemplar chapters reproduces the copyrighted full textbook or asserts independent page-by-page expert approval; the M01.02 reference is longer still. This is genuine added teaching material, but still not a global 100% completion claim.

## Full curriculum audit that was missing

Execute **`npx tsx scripts/audit-theory-depth.ts`** or **`npx tsx scripts/audit-theory-depth.ts --json`** to inspect every static/offline topic through the **actual `getTopicContent()` resolver**. The script measures:

| Field | Meaning |
|---|---|
| `characters` | Learner-visible offline theory text, not source-code bytes |
| `blocks` | Reader blocks in final effective static content |
| `sections` | Authored natural heading sections |
| `examplesAndSolutions` | Examples, solved boxes and cases |
| `goals`, `exercises` | Study objectives and practice tasks |
| `sourceTraces` | Visible source notes; not physical-page evidence |
| `percentOfM0102` | Text quantity relative to M01.02, **not accuracy or quality score** |
| `depthTriage` | `brief` / `partial` / `substantial_candidate` |
| `pageVerification` | Always `unverified` until independent page mapping exists |

The full audit does not fetch production-only UUID lessons or authenticated backend lessons. That is an explicit separate workstream. M01, M02 and M05 are structurally special (LaTeX/canonical book sources), and remote sections may differ from offline fallback. Strong word count is **not** an automatic certification.

## What is still unfinished before the user's requested global result

1. **M01-depth systematic authoring for every remaining topic**, not five-block addenda. For each, follow the approved M01.02 structural and educational benchmark: goals, introduction, 6–12 natural headings, essential definitions, tables, original worked examples, formulas/code if relevant, diagnostic traps, short tasks with worked answers and sources. Author by the original grade 5–11 textbook/standards; do not infer completeness from section count.
2. **Source/page fidelity ledger:** topic ID → official textbook edition/year → book chapter → printed page + physical PDF page → each objective/diagram/formula/table → reader block → `verified/partial/gap/unverified` editorial decision. Visuals need direct source-image QA. License-compatible rewritten teaching text rather than copying entire chapters.
3. **Production learner UI audit:** authenticated actual route, desktop/mobile, server-published vs static priority, dynamic lesson UUID mapping, question readiness and reader navigation for every topic. GitHub merge isn't live deployment verification.
4. **Release gate:** only merge after CI and user's explicit approval; no manual deploy without approval. Do not advertise global textbook equivalence while any module is unverified.

**Sources:** `src/data/topics/m01.ts`; original LaTeX; Drive Cambridge+ 10–11 (https://drive.google.com/file/d/1hEDk0WefYtkU2pGSUQSEN2pWIzGagUMQ/view); Drive Mirzayeva (https://drive.google.com/file/d/1woZMas8dNbzk6yephzNH_XdmT19ess-l/view); `docs/TASK273_THEORY_TEXTBOOK_COMPLETENESS_AUDIT_20261019.md`.
