# TASK-261 — M09 Access/SQL review pool: source-aware metadata QA

**2026-10-19. State: read-only inventory completed; source/answer/editorial verification NOT completed. No migrations or production writes.**

## Sources examined and assessment alignment

- Official `Informatika Testlar spesifikatsiyasi.pdf` (2026), DB/Access section of questions 19–26, 2 M09 target questions within the broader programming/data domain. This official mock quota is **not** the same as **20 items per learning lesson**.
- `ICT 11_sinf-2021(1).pdf` — manually located M09 chapter pages: **4–12** database/DBMS concepts and types; **15–29** Access table field/data types and input; **30–35** linked tables; **44–50** Access query definition/execution/criteria; **51–52** additional query criteria such as `Like`/`Not Like`.
- `9-sinf informatika (Cambridge +)(1).pdf` includes database/web chapters, but a **complete exact-page concordance for M09 has not been finished**. It cannot be treated as a checked source for individual answer keys.
- Textbook pages support *concepts*, not the correctness of every existing AI- or privately-authored `review` question. No question has received independent sign-off in this task.

## Live production SELECT-only counts

Five currently published canonical M09 lessons were compared with `topic_test_preview` and construct-mapped keyed `review` items. Counts below are occurrences in each lesson's construct pool; a revision can be included in more than one lesson's pool.

| Canonical lesson (short name) | Published usable / 20 | Deficit | Mapped keyed review | Y1 / Y2 / Y3 | Four-field editorial approval | Same canonical source_lesson_id |
|---|---:|---:|---:|---|---:|---:|
| M09.01 DB/MBBT | 3/20 | 17 | 96 | 56 / 20 / 20 | 0 | 0 |
| M09.02 Access tables | 5/20 | 15 | 69 | 49 / 10 / 10 | 0 | 21 |
| M09.03 PK/FK and links | 6/20 | 14 | 48 | 28 / 10 / 10 | 0 | 0 |
| M09.04 Queries and criteria | 7/20 | 13 | 48 | 28 / 10 / 10 | 0 | 0 |
| M09.05 Complex queries | 4/20 | 16 | 48 | 28 / 10 / 10 | 0 | 0 |
| **Total occurrences** | **25/100** | **75** | **309** | **189 / 60 / 60** | **0** | **21** |

The totals do **not** imply 309 distinct questions. The direct `source_lesson_id` mismatch indicates the other 288 **lesson–question occurrences** need individual source provenance/mapping checks. `same_source_lesson_id=21` is not a verification pass, and mismatched source lessons are not necessarily invalid if the construct mapping is legitimately shared.

The production preflight is an older adaptive version and may report `reason=null` despite having fewer than 20 items. Strict fail-closed SQL exists in main but **has not been rolled out to production**.

## Source-to-lesson editorial plan

| Lesson | Candidate reference pages | Verification boundary |
|---|---|---|
| M09.01 — DB/MBBT basics | ICT 11, PDF 4–12 | File/database vs DBMS, hierarchy/network/relational definitions, no obsolete product facts as universal statements |
| M09.02 — Access table/data | ICT 11, PDF 15–29 | Table/field/record data type and actual Access interface step/version, sample result independently reproduced |
| M09.03 — relational keys | ICT 11, PDF 30–35 | PK vs FK and cardinality, joins inferred only if explicit or independently grounded; sample multi-table records checked |
| M09.04 — simple queries | ICT 11, PDF 44–50 | Distinguish criteria from display/sort, verify SQL/Access grid equivalence with a sample dataset |
| M09.05 — complex queries | ICT 11, PDF 44–52 **partial** | Like/Not Like and multi-table queries need source-specific validation; SQL JOIN/GROUP BY claims require additional exact pages/verified documentation |

## Next actions without premature publication

1. Inspect each of the **309 candidate occurrences** against unique UUID/revision and establish deduplicated question counts. Retrieve keys *only within protected reviewer processes*, never ship in public docs or learner endpoints.
2. Match item `source_reference` and `source_lesson_id` to original PDF/construct; record **supported / partial / unsupported** per question and exact source page.
3. Independently run code/SQL examples with synthetic tables and check correct Y1 option or Y2/Y3 mapping/order, distractor ambiguity, duplicate stems, learning-objective quotas, and explanation fidelity.
4. Record human reviewer and content fingerprint before any status transition; unapproved `review` stays unselectable. Do not silently "fix" 75 deficits by status flipping.
5. Verify exact 20-item local preflight and separate official 50/120 blueprint, answer-key secrecy, resume, pagination/mobile and owner isolation using an isolated non-paid or separately cost-approved test environment. **No production migration or deployment**.

## Handoff

- **Task:** TASK-261 — M09 metadata + textbook topic crosswalk.
- **Read-only reproducibility:** `scripts/sql/TASK261_M09_REVIEW_QA_READONLY.sql`.
- **Code / schema changes:** none. **Migrations:** none. **Production writes:** none.
- **Provisional result:** 75 shortages; 309 mapped review occurrences, 0 four-field editorial approvals.
- **Status:** metadata inventory DONE; individual answers/source checks and actual review/import NOT DONE.
- **Next prioritization after M09:** M08 Python/JS (55 deficits), M03 Office (52 deficits), maintaining the TASK-251 per-lesson sequence.
