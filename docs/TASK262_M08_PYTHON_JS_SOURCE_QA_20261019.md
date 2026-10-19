# TASK-262 — M08 Python/JavaScript source-segregated review inventory

**2026-10-19. Read-only metadata and source crosswalk complete; semantic/key review and publication BLOCKED.**

## 2026 attestation context and precise source locations

- `Informatika Testlar spesifikatsiyasi.pdf` (2026), questions **19–26** include programming/algorithm/data knowledge. M08 learning-topic **20-question** tests are **not** official 50-question mock quotas.
- **Python**: `ICT 9_sinf-2020(1).pdf`, PDF **52–108**: Python environment, variables/data types, if/elif, loops, strings, functions and lists; `ICT 10_sinf-2021(1).pdf` adds dictionaries, classes, files, error handling and libraries around PDF **118–158**. The latter is additional, not blanket source evidence for JavaScript.
- **JavaScript**: `10-11-sinf informatika (Cambridge +)(1).pdf`, PDF **316–329** (chapter 19, web programming) explicitly covers JS variables, assignment, console.log, functions, arrays, interactions and validation. `9-sinf informatika (Cambridge +)(1).pdf` PDF **286–303** mentions JavaScript as the functional web layer; this is **not sufficient for independent JS expression/key proof**.
- **Source hazard:** some ICT 10-sinf hits for “JavaScript” are incidental references; do not mistake their Python-only programming exercises for verified JavaScript semantics.
- All pointers above are **chapter-level evidence**, not completion of per-question PDF-page, interpreter-version and answer validation.

## Production read-only snapshot

| Canonical M08 lesson | Published eligible / 20 | Missing | Mapped keyed review occurrences | Y1 / Y2 / Y3 | Signed editorial | Same canonical source_lesson |
|---|---:|---:|---:|---|---:|---:|
| M08.01 Python syntax | 7/20 | 13 | 60 | 36 / 12 / 12 | 0 | 0 |
| M08.02 Python variable/condition/loop | 16/20 | 4 | 60 | 36 / 12 / 12 | 0 | 0 |
| M08.03 Python functions/lists | 10/20 | 10 | 90 | 54 / 18 / 18 | 0 | 0 |
| M08.04 JavaScript syntax | 0/20 | 20 | 66 | 40 / 13 / 13 | 0 | 6 |
| M08.05 JavaScript control/functions/arrays | 12/20 | 8 | 150 | 90 / 30 / 30 | 0 | 0 |
| **TOTAL occurrences** | **45/100** | **55** | **426** | **256 / 85 / 85** | **0** | **6** |

Review is *construct-linked*, not necessarily canonically `source_lesson_id` linked. A mismatch is a **provenance review flag**, not an automatic defect. `review` questions are **not usable published pool**. None of the aggregate counts verifies the correctness of Y2/Y3 matching or keys.

### Critical item

M08.04 **JavaScript sintaksisi asoslari = 0/20 published**. Although 66 mapped keyed review candidates exist, **0 independent editorial approvals** are recorded. This is the most urgent M08 topic; never fix by indiscriminately changing `review` to `published`.

The current production `topic_test_preview` is an older adaptive generator and may return a short count without a reason; a strict 20-count code fix is merged into main but its production migration is not authorized.

## Editorial action sequence

1. **M08.04 first:** deduplicate the 66 candidates by immutable question ID and revision; verify exact Cambridge 10–11 PDF 316–329 for each JS stem and code behavior. Distinguish `var` text in older books from modern syntax/runtime assumptions; execute isolated deterministic examples rather than guessing.
2. **M08.05:** 150 construct-mapped candidates; independently run JS conditions/loops/functions/arrays in a supported safe test runtime; source-trace each question and all distractors.
3. **M08.01–03:** source-map Python 9-sinf pp.52–108; run Python 3 reproducibility for code-based questions; isolate print vs return, slicing and loop-boundary errors; prevent contradictory variants.
4. Validate Y1 uniqueness, Y2 one-to-one mappings, Y3 order, explanation fidelity, exact 20 objective quotas and no overlapping revisions. Record signed independent answer/reference/wording/original authorship checks.
5. Build verified new review revisions only for actual errors; any eventual promotion needs explicit independent editorial + owner approval, non-production acceptance and controlled migration. **No live DB writes, no new deployment.**

## Reproducibility and handoff

- Source-only query: `scripts/sql/TASK262_M08_PYTHON_JS_REVIEW_READONLY.sql`.
- QA regression: `src/tests/TASK262_M08AuditContract.test.ts`, enforces 5 topic rows, 55 deficits, 426 review occurrences, 0 approval, split 256/85/85, code-safe nonmutation.
- **Outcome:** source-differentiated metadata inventory DONE; item-by-item key and semantic review OPEN. This task creates **zero published questions** and writes **no** source or answer keys into the public repo.
- **Next:** M03 Office 52-slot quality and source map, then focus expert-approved release of all 25 underfilled lessons after separately authorized staging.
