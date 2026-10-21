# Barnoyevak pedagogika: 5 Word file disposition ledger (2026-10-21)

Source parent folder: `pedagogika/files`, owner `barnoyevak@gmail.com`. Five DOCX documents were fetched and their readable text checked. This is a *disposition* ledger; “covered” does not mean every source claim has passed expert scrutiny.

| Source title / Drive ID | Observed content | Database reconciliation | Current disposition |
|---|---|---|---|
| `Inklyuziv_talim_va_korreksion_pedagogika_qollanma.docx` / `1-mz2ykvhEuG4dudIDq-k0zYofeLvbz2g` | Inclusive and correctional pedagogy overview | `korreksion-pedagogika-mutaxassislik-yonalishlari` in `lessons`, `review`, UUID `2d55befe-1c48-43a8-8733-6c0492266a40`; separate inclusive PDF lesson also staged | Source ingested as **review** theory, not published |
| `Baholash_nazariyasi_40_nazariy_savol_javob.docx` / `1bjH9abYD8BE-vu-cDAepeiCFwAsdPM2G` | File headline claims 40, **text has only 38 numbered questions** | `baholash-nazariyasi-38-savol-takrorlash`, `review`, UUID `4e01a56b-4432-4974-ae45-3b18a078cccd` | 38 paraphrased **study cards** staged; NOT 38 scored MCQs; source questions 39–40 unavailable |
| `Baholash_nazariyasi_1_betlik_yodlash_konspekti.docx` / `1ZychUj6tljU-wUPTI8CdAjJG-L_5gWZ_` | Domain, construct, norm/criterion/ipsative and item types | Published `ozlashtirishni-baholash-va-qayta-aloqa` contains `ipsativ`, `gomogen`, `konstrukt`, `norma` terms | Covered by existing lesson; don't make duplicate |
| `Bugungi_mavzu_test_baholash_konspekt.docx` / `13SLXrytx51bBoHBeFLxsxS2kIpTJbIrk` | Test design steps and Bloom taxonomy | Existing published assessment/theory lessons; a *detailed semantic comparison* remains necessary before marking complete | Reference-only pending conceptual gap review, no blind import |
| `Pedmahoratguli_Bugungi_mavzu_konspekt.docx` / `1r11lwtqbe2Uj9RpT8a6adLJMDm70i8U8` | Validation, validity, test specification, parallel forms | Published `ozlashtirishni-baholash-va-qayta-aloqa` contains `validatsiya`, `parallel test`, `spetsifikatsiya` | Existing lesson covers main terminology; avoid duplicate pending detailed review |

## Integrity and quality

- Source title counts are not evidence of actual extracted question count: 38 observable ≠ 40 claimed.
- `topic_test_question_count=20` on review lessons is the platform's configuration target, not imported test quantity.
- Existing live `questions` table currently had no literal `ipsativ`, `validlig`, or `monomorf` stem matches, but this is *not* a full semantic duplicate search.
- Never publish unverified scored items from question–answer notes without distractors and independent key validation.
- Review lessons are available only in editorial staging, do not rewrite published lessons or user attempts.

## Next source coverage

The user's goal concerns **all 64 files** (59 PDFs + 5 Word), including pedagogical theory, teacher standards, specifications, demos and historical tests. This ledger covers the five Word documents at the inventory/read level; it does not close the PDF backlog. Record PDF-by-PDF ingestion and semantic/rights checks separately.

No manual production deployment.
