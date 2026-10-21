# Barnoyevak pedagogika — remaining 26 Drive sources triaged (2026-10-21)

## Scope and verified result

The existing `docs/manifests/barnoyevak_pedagogika_drive_64_sources_20261021.csv` covered **64** Drive files. Before this task, **38** had evidence-based `ingestion_disposition` values and **26** remained the generic `requires-source-reconciliation`. All **26** were examined via the authenticated Barnoyevak Google Drive connector for readable source text and assigned explicit, intentionally **non-final** statuses. After this commit, **64/64 files have a triage disposition**, but that is **NOT 64/64 materials fully imported or editorially accepted**. Source-to-lesson mapping, delta-test ingestion and answer-key verification remain substantially open.

### High-volume versioned test booklets — not 7 separate independent banks

- Spring 2025 `Pedagogik mahorat to'plam 2025 (5).pdf` is the largest inspected text of the five numbered spring variants (about 88,000 connector-extracted characters); the prior unnumbered `Pedagogik mahorat to'plam 2025.pdf` already has **150** private candidates. **Do not count those 150 again.** Remaining expanded-content differences must be mapped before importing anything new.
- Word-normalized five-token shingle coverage, **source variant → spring (5)**: spring (4) **99.9%**, spring (3) **99.9%**, spring (2) **96.7%**, spring (1) **99.8%**. Unnumbered spring base: **100%**. This is evidence of substantial textual overlap, **not exact PDF identity or complete source-candidate coverage**. It does not justify declaring all enlarged booklets fully imported. Rounding in coverage percentages can conceal a small amount of unique text.
- Autumn 2025 `Pedmahorat to'plam 2025 kuzgi (2).pdf` vs `(1).pdf`: only **77.5%** of (2)'s five-token shingles are in (1), and **80.6%** of (1)'s are in (2). **Both have material not found in the other**, so treating one as a complete duplicate would be wrong. The already staged unnumbered autumn base has **36** private candidates, and its text is **98.9%** covered by autumn (2). Two previously linked near-duplicate reflection questions remain quarantined.
- These values come from token-normalized, punctuation-stripped connector extracts. They are not page-image-based diffing and do not establish answer-key accuracy or copyright licensing.

### Theory, standards, and diagnostic source references

- `Xoliqov Pedagogik mahorat.pdf`: readable and expands upon the Chapter I material already used for a **review** lesson; remaining chapters need concept-by-concept mapping.
- `Pedagogning kasbiy standarti - qollanma.pdf`, `kasb standarti (2).pdf`, and `Kasb-standarti.pdf`: readable accounts of **seven professional competency domains** and associated labor tasks. They are references for the standard rather than sets of 15 scored questions. Official current-version verification is separate work.
- `Мaktab pedagoglari - Kasb standarti (Oʻzbek tili).pdf`, `O._Tolipova_Pedagogik_texnologiyalar_va_pedagogik_mahorat.pdf`, and `ВМ_322_24_06_2026_Олий_тоифалилар_магистратурага_қабули.pdf`: no readable text returned in connector fetch. Marked *visual/content verification pending*, not falsely called empty or safely imported. The last appears from its name to concern higher-category masters admission; current official legal relevance has **not** been established.
- `1723545826.pdf`: a full, readable Komil Jalilov *Baholash nazariyasi asoslari* (2020, 256-page metadata). Two new **review-only** lessons below were grounded in the text of its sections 4.2.1, 4.2.3, 4.2.4. Other theory chapters still need mapping.
- `xrpt_uz6b84v91iitco6thk37r6vh4uya9xfskauh4fgtnocp69adi402yv9rfv.pdf`: short **preview excerpt** of that 2020 assessment text, not a second independent textbook.
- `xrpt_lirt9ie9nr6t8akemjblcs2z5vu2yvha5zt48z2lfv6dxghapjlt3chxz3.pdf`: **preview excerpt**, not complete Madatov (2024) inclusive education textbook.
- Ten-year-plus reference textbooks were identified as readable theory (some in Cyrillic), not imported verbatim: Mirzayeva pedagogy theory, Mahmudov speech culture, Muslimov and coauthors' pedagogic competence and creativity, Aliqulova innovative pedagogy, Inoyatov and coauthors' general pedagogy, Munavvarov historical pedagogy, Toxtaxodjayeva pedagogical mastery, and the 2022 teacher-standards methodology manual. Each still needs topic-by-topic extraction with edition/context checks, rather than indiscriminate copyright copying.

### Sensitive-data exclusion

`pdf_69b393b18c2a9_2026-03-13_04-33-53.pdf` is a **participant names / test-result scores / timestamps roster**, not a test question source. It was not inserted into exam/question content tables; no participant entries are included in this commit. Another similar sensitive roster, `pdf_6aa7467ea6c64_2026-09-14_00-57-34.pdf`, was excluded during previous work.

## Actual theory database insertions

Two newly paraphrased theory chapters, using Komil Jalilov's printed book (2020) as a documented source, were added to `public.lessons` with `status='review'`:

1. `baholash-nazariyasi-distraktor-va-test-sifati` — **2,779 characters**; question stem, keyed response, plausible same-domain distractors, avoid lexical/length clue and repeated distractors (source sections 4.2.1; printed pp. 130–135).
2. `moslashtirish-va-ketma-ketlik-topshiriqlari-aniqligi` — **2,423 characters**; labeled matching lists, explicit match relation and reuse/extra-answer rules; ordering by a specified chronological/process/algorithm criterion (sections 4.2.3–4.2.4; printed pp. 140–144).

Both read back successfully with `order_idx=114/115` in the existing pedagogy module, `topic_test_question_count=20` is a **desired content target** due to existing database constraint, **not** 20 newly created tests per lesson. No draft became published. Their examples are newly authored exercises rather than copying multiple-choice questions from the book.

## Further answer-quality audit (separate from pedagogy PDFs)

A read-only live DB check for **identical normalized answer options** in `question_options` with `side='a'` found **51 published questions**: **42 Y1**, **9 Y2**. Another check confirmed these belong to the **Informatika subject**, not to an independently measured count of pedagogy questions. **No production keys/options were edited**: edit/version control and historical attempts require careful handling. The source-based rubric is available in the two new `review` lessons; a reusable read-only diagnostic is in `scripts/audits/question_option_duplicates_readonly_20261021.sql`.

## Exit criteria

This work completes **first-pass Drive file identification**, not full material import. Remaining tasks: parse only incremental unseen test content from expanded source editions; independent answer-key verification; tag topic constructs and near duplicates; inspect unextractable PDF page images; and release only reviewed theory and tests through the platform's appropriate gates.

No manual production deployment, user test-attempt mutation, mass key rewrite or publishing occurred.
