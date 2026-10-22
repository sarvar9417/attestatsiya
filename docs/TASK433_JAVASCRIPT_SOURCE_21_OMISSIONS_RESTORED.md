# TASK-433 — JavaScript PDF exercise recovery (2026-10-22)

Original: [JavaScript 1-fayl tahlili.pdf](https://drive.google.com/file/d/1lucZUL4Z4npGWVNt3iAF6Q93YLxqGxNA/view), PDF pages 1–9.

The original material contains 35 numbered exercises across three sections: If (10), Else (10, local numbers 1,2,4..11), and Else if (15). The existing staging database had 14 exercises with local numbers from different sections mixed.

**21 omitted source exercises recovered into private staging without changing the existing 14:**
- If: source-page identifiers 1001–1010, PDF pages 1–3 (10).
- Else: 2002,2004,2005,2007,2008,2009,2011, PDF pages 3–5 (7).
- Else if: 3001,3006,3010,3014, PDF pages 6–9 (4).

Source-page transcription visually verified: If #1 closing brace is printed on page 1 though dropped in flat extraction. Every new source candidate retains a question/section locator, PDF page number, original snippet, original URL, `answer_key=NULL`, `extracted_answer_options=[]`.

**Proof:** 21 private independent output explanations added to `attest_ingest.telegram_informatika_pdf_free_response_qa` with `human_approved=false`, `publish_ready=false`. Node regression `scripts/task433-javascript-pdf-21-snippets.test.mjs` runs all 21 vetted snippets in a 100ms JavaScript VM and verifies their console output, including the two snippets that intentionally log nothing. Dedicated GitHub Action `task433-js-examples.yml` runs the tests.

After restoring these 21 missing source candidates, staging totals **719** (698+21). These are private unkeyed examples, NOT new learner Y1 questions. A new editorial four-choice version and independent content QA is required before any publication. No existing source candidates, published questions, or learner attempts were overwritten.
