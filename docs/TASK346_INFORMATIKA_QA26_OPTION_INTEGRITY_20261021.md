# QA26 — PDF option hygiene and unsafe parser fragments (2026-10-21)

**Scope:** private `attest_ingest` PDF review staging only. No original PDF imagery, official answer keys, learner database publication or deployment.

## Verified Supabase fixes

- Previous QA25 cleaned 147 source candidate question-stem CR/CRLF breaks; an independent QA26 scan discovered carriage-return characters still embedded in the JSON **answer option text** of 7 candidate rows across 4 source PDFs. These were normalized transactionally (CRLF/CR to LF), maintaining JSON array order, option labels, original text and all unrelated keys.
- A repeat scan returned **0 remaining CR-affected answer options**.
- In `Attestatsiya 7-test.pdf`, physical source question 17, the option D field accidentally contained `7.` followed by the exercise explanatory `Izoh` block. The separate explanation already existed in question text. Option D was corrected to just `7.` and the question explanation preserved. An audit flag records the narrow extraction boundary correction; original source media is not changed.
- Three compound/incomplete candidate records were explicitly blocked as `insufficient_problem_data`: `13.04.2026 Attetasiya Tushgan savollar.pdf` candidate #1 contained **75 choices** aggregated from multiple questions; candidate #2 contained only **1** incomplete choice; `Axborot kodlash test (1).pdf` candidate #1 contained **80 choices** aggregated from multiple questions. These are *ingestion/parsing defects*, not assertions that the original PDFs had faulty questions. Do not hallucinate source answer keys or let any of these become four-choice learner tests before original-page question-boundary restoration.

## Private database verification

- Option text CR rows remaining: **0**.
- Compound/incomplete records newly protected by a blocking defect: **3**.
- Source question 17 option D: `7.`; independent source-note text remains in the question.
- Queue after these changes: **100** source/boundary defects, **33** visual source asset dependencies, **47** independent answer checks, **436** human editorial approvals. Queue total **616**, all private.
- Original candidate answer keys and learner-release-ready candidates remain unset.

## Code regression

`scripts/tests/test_telegram_pdf_option_integrity_qa26.py` adds 7 Python unittest checks for lossless newline conversion, array-order and label preservation, 75/80-choice corrupted fragments, one-choice corruption, nonempty well-ordered four-choice validation, question-17 explanatory footer splitting and idempotence.

**Review gate:** Passing unit tests does not approve any questions for publication; human editorial review and original PDF rights/assets remain outstanding.
