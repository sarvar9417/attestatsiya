# TASK-346 QA9 — Informatika MS Access: original-source SQL and visual review

**Date:** 2026-10-21. **No production deploy or learner release.** This review documents existing private DB changes and independent calculations; it does not embed source PDF pages/images or official answer keys.

## Source / verified scope

Original source is the Drive document `MS Access savollar.pdf`, ID `130SJl3LEn14uvVajDGbhCody_cOuwwbN` (9 PDF pages). Pages **1, 2, 3, 4, 5 and 8** were inspected as rendered images. These were *not* inferred from a stripped PDF-text extractor. The images show tables and Access query-design criteria that were missing from previous extraction.

### Independently calculated answers (private, awaiting editorial review)

| Original question | Page | Calculation from visible source rows | Proposed answer |
| --- | ---: | --- | --- |
| 2 | 1 | `toifasi IN ('ikkinchi','oliy') AND oyligi < 5000000` | **1** — Qahhorov Arslon |
| 6 | 2 | `category='first category' AND salary>4300000` | **1** — Usmonova Xadicha |
| 8 | 3 | category != assistant, experience >= 13, salary > 6000000 | **4** — Ashurov, Usmonova, Qurbonova, Akramova |
| 10 | 4 | Name LIKE `*n*` **AND** quantity > 80, same Access Criteria row | **2** — Anor, Banan |
| 11 | 4 | Name LIKE `*n*` **OR** price <= 20000, different Criteria/Or rows | **5** — all fruits |
| 14 | 5 | assistant with experience >= 13; only assistant has 3 | **0** |
| 19 | 8 | Book type ends in `n`, >220 pages, ascending publication year | **A** — Oltin zanglamas, 1984 |

For tests only, the Access wildcard `*` is replaced by SQLite's `%`. Query-grid interpretation (AND vs OR) follows the **original page graphic**, not a conjecture from generic SQL. These values are *independent review proposals*, never source-author answer keys.

Private Supabase writes: inserted 7 `telegram_informatika_pdf_free_response_qa` proposals with Uzbek explanations; `human_approved=false` and `publish_ready=false`.

### Release-blocking source defects

| Original question | Page | Evidence-based reason |
| --- | ---: | --- |
| 1 | 1 | Query calls `toliq_ism`, whereas screenshot table column is `FISH`. |
| 3 | 1 | `OR toifasi 'ikkinchi'` is missing an equality operator. |
| 7 | 3 | Query references `category`, absent from `ustozlar` table (column is `toifasi`). |
| 9 | 3 | Question screenshot shows rows 1–5; the separate page-3 screenshot for Q8 shows rows 1–8. A complete ordered result cannot be inferred without confirming datasets are identical. |
| 13 | 5 | Query uses source-mismatched column names (`kg`, `yetishtirilgan_davlat`, unescaped `1 kg narxi`); screenshot table exposes other names. |

Five `telegram_informatika_pdf_release_blockers` records were created with explicit evidence, `learner_publish_blocked=true`. Incorrect source queries were not silently repaired or promoted to learner questions.

### Extraction and visual dependency cleanup

Twelve question candidates (1,2,3,6,7,8,9,10,11,13,14,19) were reconciled with actual source pages. Adjacent-question text from PDF extraction was removed: Q3 included Q4, Q6 included Q7, Q9 included Q10, Q11 included Q12–Q13 (including wrongly attached multiple-choice options), Q14 included Q15–Q18, Q19 included Q20. Q11's irrelevant options were cleared. All twelve have a source page locator and `source_visually_checked=true`; no source key was set.

A separate `Test 20 talik.pdf` question **11** already contained every truth-table value in its extracted text: 1/1/1, 1/0/0, 0/1/1, 0/0/1. The table has now been formatted as separate textual rows, and `pdf_visual_index` was changed from `text_plus_figure` to `text_only` / `source_text_only`. No graphic is required to understand this particular question; content remains private with `content_publish_ready=false`.

### Private figure integrity review

The prior QA8 private 21-PNG manifest was verified against the six original PDF SHA-256 hashes and all crop SHA-256 hashes. All **21/21** private binary files match the manifest. Re-rendering from the recorded, *rounded* crop coordinates was pixel-identical for **18/21**; the other three have a **one-pixel height discrepancy**, consistent with the manifest's coordinate precision. This is an integrity review, **not** upload to learner Storage or a claim of redistributed-media rights.

### Tested invariants

`python3 -m unittest scripts/tests/test_telegram_informatika_access_sql_qa9.py` has **13 independent tests** covering seven answers, five source blockers, and one complete text-only truth table.

Live private queue after the changes: **577** source candidates, **97** independently proposed multiple-choice solutions, **47** free-response proposals, **35** blocker records, and priority queue of **41** source-defect actions / **18** original-asset actions / **378** page-verification actions / **140** human editorial approvals. These priority buckets partition all 577 candidates.

**0 source answer keys; 0 learner-ready items; 0 learner question releases in this batch.** Original PDF media stays outside public Git. Existing Supabase advisory on RLS for two older private schema tables remains open pending a reviewed, deploy-safe policy migration. GitHub merge is documentation/test code only.
