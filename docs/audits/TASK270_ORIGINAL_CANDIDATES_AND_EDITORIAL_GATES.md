# TASK-270 — 56 original review proposals for four 0/20 assessed topics

**Status:** DRAFT candidate research, not a publishable test bank. Work based on owner-supplied textbooks and 2026 Informatika Testlar spetsifikatsiyasi. No production data or learner attempts have been modified.

## Baseline already in main

- PR #240 contains exactly the five files from former PR #233 (SHA-matched): four-topic strict preflight CI regression, source triage SQL, 24-existing-review queue and thematic source audit. Closing PR #233 as superseded was justified; no duplicate commit is required.
- Four live production topic lessons start at **0/20 published**. Their **24** direct `specgap-2026` review candidates are **4 Y1, 1 Y2, 1 Y3 per lesson**, with no independent expert signoff or item-specific textbook-page source link. Other-lesson shared-construct items are not automatically eligible.
- To numerically fill all four 20-question exercises, 14 new independent approved candidates per topic would be required **if** the six existing ones are approved. Real approval is **still zero**.

## Proposed additional original questions

| Module/topic | Original new Y1 | Y2 | Y3 | Total |
|---|---:|---:|---:|---:|
| M06 — Masalaning algoritmini tuzish | 10 | 2 | 2 | 14 |
| M08 — JavaScript sintaksisi asoslari | 10 | 2 | 2 | 14 |
| M12 — Tarmoq arxitekturasi va topologiyalari | 10 | 2 | 2 | 14 |
| M12 — Internetdan xavfsiz va maqsadli foydalanish | 10 | 2 | 2 | 14 |
| **Total** | **40** | **8** | **8** | **56** |

The owner-facing **PRIVATE JSON** contains full authored stems, four-option Y1 answer proposals, bijective Y2 correspondence, Y3 ordering proposals, explanations and textbook physical-PDF page topical references; it is **not committed to this repository** to avoid inadvertently making a pending answer bank public. It was provided directly as a downloadable deliverable in the work conversation.

The **public metadata-only TSV** `docs/audits/TASK270_56_PRIVATE_CANDIDATE_METADATA_ONLY.tsv` contains IDs, formats, topic and source-page hints, plus `NO` flags for independent editorial/source approvals and publication eligibility. It cannot import questions and exposes no answer payloads. CI validates it with `scripts/tests/task270_candidate_metadata.test.mjs`.

### Grounding — exact source books studied

- M06: `ICT 9_sinf-2020(1).pdf` physical PDF pp. 28–36: algorithm definitions, properties, formulas, sequence/branching/iteration, diagrammatic and verbal presentation.
- M08: `10-11-sinf informatika (Cambridge +)(1).pdf` physical PDF pp. 316–321: chapter 19 JavaScript variables (`var`), arithmetic/comparison, comments and console usage.
- M12 architecture: `ICT 11_sinf-2021(1).pdf` physical PDF pp. 140–142 and 167–170: client/server, P2P and bus/star/ring/mesh/hybrid/point-to-point.
- M12 safe Internet: `ICT 6_sinf-2021(1).pdf` physical PDF pp. 79–83 and 94–96: web browsers, search, electronic mail and safe account/password practices.
- `Informatika Testlar spesifikatsiyasi.pdf` physical PDF pp. 4–5: related exam groups/objectives.

**Critical distinction:** each proposal is independently authored from covered concepts and is **not presented as a literal textbook question** or exact old exam paper question. Its PDF-page indication is *concept evidence*, not item-by-item source reproduction. Domain editorial review is still required even when answers look arithmetically correct.

## Automated and human gates

1. Private file generator's structural self-check: 56 IDs, 14 per lesson, format distribution 10/2/2 each; distinct Y1 option strings; correct-option reference; bijective 4×4 Y2; 4-step Y3 ordering; source pages in reviewed ranges; all `published_eligible=false`.
2. CI repository metadata check: source file/page bounds, 56 exact IDs/formats, no columns for answer options or keys, no false source-copying claims or fabricated reviewer approvals.
3. **Still missing:** independent code execution/manual mathematical answer review (Y1), single-valued matching/order semantics (Y2/Y3), genuinely discriminating distractors, any graph/diagram asset rights and source-page proof of original topic versus recycled older questions, near-duplicate scan with full database, official cognitive-level differentiation and expert/editorial signature.
4. Only after reviewer and owner approval, import to *review* on controlled staging through existing authorization gates, never directly to `published`; run real 20/20 preflight and authenticated Y1/Y2/Y3 UI/review/offline/history/mobile tests. No production SQL, no public answer keys, no deployment from this PR.

## Parallel M11 gap

The HTML text/graphics/lists lesson still has 7/20 published; eight mapped review Y2/Y3 originate from another lesson. TASK-260 already prepared 13 *draft source-cited Y1* candidates in another merged PR. These are a **separate editorial queue**, not proof of 13 newly published eligible questions. Prioritize actual source/answer scrutiny rather than generating duplicates.

**Release:** This report and metadata are QA aids; do not merge it expecting production content to change. No content statuses, source-to-lesson mappings, stored keys or learner attempts are changed.
