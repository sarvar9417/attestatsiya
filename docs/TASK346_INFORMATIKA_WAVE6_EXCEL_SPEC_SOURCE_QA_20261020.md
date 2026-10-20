# TASK-346 — QA6: official-2026 specification reconciliation, independent Excel and source-annotation conflict

Date: 2026-10-20. **Status:** review-only, no learner publication, no deploy.

## 1. Official specification comparison

Google Drive sources:
- `+INFORMATIKA_SPETSIFIKATSIYA_AUTUMN.pdf` — file `1-8uUjjsjDmRq8phUzPNgacol_5aPq-hy`, Toshkent 2026, the **complete 50-item assessment specification**.
- `INFORMATIKA_VA_AXBOROT_TEXNOLOGIYALARI_FANIDAN_MALAKA_SINOVI_TOPSHIRIQLARI.pdf` — file `1i4Rc8QcF4Gu-j7daz_B8ou6bly80urKp`, the **35-item specialty subset** (70 raw points). It should not be used as a 35-item total exam blueprint.

The autumn source specifies **35 specialty + 5 professional standards + 10 pedagogy/methodology = 50 items**, **120 min**, **2 points per correct item, 100 total**, Y1/Y2/Y3 accepted, **8 knowing + 35 applying + 7 reasoning** cognitive question distribution. Within pedagogy: **7 general + 3 informatics teaching methodology**. Its subject ranges match the existing `src/data/blueprint2026.ts` (S1..S7 and KS/PM); `backend/src/services/exam.service.ts` uses the server `generate_official_mock` RPC. **No change to the published exam quota** was warranted. A Vitest invariant `src/tests/Official2026SourceQuotaQA6.test.ts` guards the distinction.

**Important limitation:** this compares the declared blueprint to the official text. It does not certify that every selected question in the live pool matches the official format, cognitive level, and construct; that requires separate post-publish feasibility + source-backed audit.

## 2. Conflicting annotated solution: Attestatsiya test №2, question 4

Primary: `Attestatsiya test №2.pdf` (Drive ID `1TfX6fDckcXuaqvwuvonzm44elwUgmk8A`), page 2 of original. Annotated explanation document: `Attestatsiya test №2 tahlil.pdf` (Drive ID `158cWGiTBv6_dvSjeuiGDY4zs4VD7y3AN`), **page 4**, circle around B/`29`.

The source expression is `A & (A v B v C)`. The Boolean absorption law yields `A` for all A/B/C valuations; ordered rows 000…111 give output vector `00001111`. Its true-row count is **4**, binary-vector numerical value is **15**, and true-row index sum is **22**; none is **29**. The annotated choice B=`29` is therefore **not supported by the stated expression**. The original wording “rost qiymatlari yig‘indisi” also omits a precise aggregation rule. The answer annotation is **not** a trusted verified key: source conflict and original ambiguous question remain blocked.

Database migration `20261021010000_task346_source_answer_conflict.sql` stages this exact conflict in private `attest_ingest.telegram_informatika_source_answer_conflicts` (anon/authenticated denied; no answer-key publication).

## 3. 40 Excel worksheets from original one-page PDF

`Excelda Matematik va Mantiqiy funksiyalarga oid savollar.pdf` (Drive ID `1PEx1IJ4cpMyfhBcUiwP5D_iVadACjUYU`) is **one page**. All 40 exercises and diagrams/actual quotes were visually inspected. The source candidates had already been staged as 40 private rows but their `source_page_number` was NULL and `source_visually_checked` false. The new review reconciles exactly the 40 original rows, **without adding 40 duplicates**.

- **37** independently evaluated `AVERAGE`, `FACT`, `MAX`, `MIN`, `COUNT`, `COUNTIF`, `LEN`, `LEFT`, `RIGHT`, `REPLACE`, `MID` exercises. Their written explanations are **review proposals**, not source-provided answers or human-approved keys.
- **3** source defects remain blocked: #16 `COUNT(47;A;B;R;6)` references A/B/R names with no provided named-range values, #28 `LEFT(O\`QITUVCHI”;4)` has no opening text quote, and #35 `REPLACE(...;5;7 “TEACH”)` misses the delimiter before its fourth argument.
- Two `AVERAGE` tasks yield exact rational values `133/6`, `157/6`. Do not label rounded decimal as exact.
- #19 tests a `COUNTIF` range excluding the sole KITOB at A5, so `A1:B4` result is **0**, not 1.
- #30 `LEFT(-54789;1)` results in the **minus symbol**, not the first digit.
- Excel calculations are independently reasoned, not executed in a local Excel application.

The database remains `answer_key=NULL`, no new `public.questions` or `public.lessons`. The forward-fix source reconciliation migration updates just rows matching their exact original question text + private formula QA; it sets **page 1 / visually checked** for all 40. The release queue now also treats `invalid_source_formula` as `01_fix_source_defect`, preventing mistaken `05_human_editorial_approval` classification. Regession: `supabase/tests/telegram_informatika_wave6_excel_source_gate.test.sql`.

## 4. PDF availability inventory

The new 3 source-metadata-only batches each scanned 12 distinct Google Drive PDF files (36 combined), covering annotated explanation files, the official 2026 PDF, Excel practice, coding and logic tasks. `attest_ingest.telegram_informatika_pdf_scan_audit` now contains **56** entries of 320 inventoried PDFs (previously 20), all **metadata only**: `source_contents_reviewed=false`, `answer_keys_verified=false`.

Original PDFs for the remaining files still require visual review. A text-available flag **does not prove complete text extraction** and flattened superscripts, images and handmade marks can be critical. Other 284 inventoried PDFs do not yet have this scan metadata. Of 320 PDFs, **29** have at least one private candidate; **291** have not yet yielded a staged question fragment, which does not mean they all contain eligible exam questions.

## 5. Verified private stage and follow-up

At this wave's end the private staging records **520** candidate question/exercise fragments from **29** PDFs, **68** independently reasoned 4-choice PDF proposals and **18** free-response proposals. Excel formula review contains **92** worked examples across two PDFs (**85** computed reviews, **7** source defects). There are **no source-confirmed PDF keys** and no new user-visible published questions for TASK-346.

Current mutually exclusive first-action queue after Excel reconciliation: **23** source issues, **15** required visual attachments missing, **349** original-page visual reviews, **4** require an independent solution, **129** require human editorial review. These are next-step buckets, not automatic release approval.

Still required: source-by-source images/rights for 484 missing Telegram photos, more PDF relevance scanning and original-page audits, near-duplicate/copyright checks, construct/cognitive/format assignment for 2026 mock, full original pedagogic rationale, human editorial sign-off, and only then versioned publication after release checks.

**Merge scope:** schema/metadata/doc/tests and private example QA only. No deployment requested.
