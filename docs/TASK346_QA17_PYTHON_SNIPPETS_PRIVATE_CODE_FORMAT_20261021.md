# QA17 — Python operator questions: standalone code formatting

Source: owner-connected `Python dasturlash tilida Operatorlar.pdf` (Drive ID `1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z`), four physical PDF pages, 35 original numbered questions.

## Actual private staging repair
All **35** source-matched question stems were reformatted into Markdown fenced `python` blocks, retaining their original statement text, original code operators, four independently captured answer choices, original physical page number and publication state. The candidate's redundant inline `A) ... D)` tail was removed from the code-bearing stem, but the separate four options were preserved. All 35 changes were guarded on their previous text and original visual-review evidence.

Read-back verified **35/35 fenced**, **0 code stems still containing inline answer-choice lines**, **0 source-author answer keys assigned**.

The previously identified original defects were **not** silently corrected:
- Q17: incomplete `in` syntax remains in original code and retains its source error blocker.
- Q30: missing dot before `bit_length()` remains in original code and retains its blocker.
- Q21–22: `is` identity results depend on runtime/compiler details; original ambiguity blockers remain.

The offline helper `scripts/format_private_python_candidates.py` runs no user code and modifies no DB itself. It requires exactly four independently stored options, preserves invalid and ambiguous original source code, adds syntax highlighting safely, and is idempotent. Seven tests in `scripts/tests/test_informatika_python_source_fencing_qa17.py` passed in independent local QA.

No private PDF binaries or figure media committed. Learner questions, original answer keys, storage, database schema and production deployment were not changed by this PR.
