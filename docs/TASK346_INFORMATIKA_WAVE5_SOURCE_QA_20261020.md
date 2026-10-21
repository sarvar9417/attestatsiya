# TASK-346 — Informatika QA wave 5: source-grounded follow-up (2026-10-20)

## Delivery and scope
- Previous private staging and test infrastructure was **merged to main as PR #346**, merge SHA `6613f234f369535b2e6eb910ad566cdd4601d2eb`. No learner question/lesson publication was performed by TASK-346.
- Wave5 inspects new PDF originals, stages original excerpts **only in private Supabase** and adds code/schema/quality evidence on a separate review branch. User source files and screenshots are **not committed into the public repository**.
- Source answer keys remain `NULL`; independent calculations are only proposals with `human_approved=false`. Published `public.questions` and `public.lessons` are not modified here.

## Wave5 new source review
### Attestatsiya test №2.pdf — Google Drive file `1TfX6fDckcXuaqvwuvonzm44elwUgmk8A`
- Original PDF 3 pages visually inspected: **10** MCQ candidates added private with source page numbers; OCR had joined Q4 D answer and Q5 label, as well as Q9 D answer and Q10 label. Segment boundaries repaired after examining original pages.
- **9 independently calculated A/B/C/D proposals** (#1,2,3,5–10), each with a teacher-facing original Uzbek explanation, still draft.
- Q1 Scratch block graphic and Q5 Excel bar chart are required original visuals. Private question image crops exist as an out-of-repo review ZIP; `pdf_visual_index` shows asset is not in learner platform.
- **Q4** asks for an unspecified “sum of truth values” for `A&(A∨B∨C)` with no defined calculation method: release-blocked pending original editorial clarification.
- Source link: https://drive.google.com/file/d/1TfX6fDckcXuaqvwuvonzm44elwUgmk8A/view

### Test 20 talik.pdf — Google Drive file `1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB`
- Original two-page **two-column** PDF checked against page renders. **20** free-response tasks staged (not converted into fake 4-choice tests). Q12/Q13 label was joined by extraction; original boundaries restored.
- **18 independent worked proposals** (arithmetic, Boolean logic, permutations) stored privately, no answer keys or public test creation.
- Q1/Q4/Q5 original Boolean circuit figures and Q11 truth table extracted as **four private image crops**; platform source images remain unlinked and are hard blocked by private visual index.
- Q10 insufficient current child's age makes grandfather's future age non-unique. Q14 “only one claim true” yields real interval `9 < t <= 10` minutes, not a unique exact time. Q20 assumes one byte per character and KiB=1024, not stipulated by original.
- New private `telegram_informatika_pdf_free_response_qa` table and source-defect release blocker table.
- Source link: https://drive.google.com/file/d/1BSYuhT9RRFpgHpDas-OjLmztqrYjuerB/view

### Sanoq sistemalari 1.pdf — Google Drive file `1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP`
- **21-page** PDF: **20** numbered MCQ pages and **1 unnumbered image-only** extra problem on p21. All 21 items recorded as candidates in private staging. Page 21 image text has not been claimed as successfully extracted; needs source image in learner assets.
- **16 independent arithmetic MCQ proposals**, unapproved; Q4/Q6/Q8/Q9 source defects block publication.
- Concrete defects:
  - Q4 `1A40b₉` has digit A (=10), impossible in base 9.
  - Q6 interval `215₈ <= x <= 93₁₆` contains even 142,144,146; their binary forms all contain consecutive zeros and are removed; remaining sum 0 is absent from choices.
  - Q8 `xy₉ = 47₈` implies (x,y)=(4,3), xy product=12=`1100₂`, missing from all four listed binary strings.
  - Q9 `36^10 + 6^15 -18` expressed in base6 has **6 zeros**, missing from choices 15/14/16/17.
- Q11/Q13 superscripts were flattened in extracted text; remaining candidate questions require line-by-line original-page signoff before publishing.
- Source link: https://drive.google.com/file/d/1QQrFePltR2GBNy5lb_Hs4JsKLUcwCWHP/view

## Current live private QA totals (not learner inventory)
| Metric | Count |
| --- | ---: |
| PDF source inventory | 320 |
| PDFs with at least one extracted candidate | **29** |
| Private original-PDF question/exercise fragments | **520** |
| PDF MCQ independent answer proposals | **68** |
| PDF free-response independent answer proposals | **18** |
| Excel free-response numeric proposals | **48**, with four malformed source examples blocked |
| Original source PDF answer keys attached | **0** |
| New public question/lesson publications in TASK-346 | **0** |

The **private review queue** (`attest_ingest.telegram_informatika_pdf_review_queue`) showed 520 mutually exclusive prioritized items: **16** source-defect fix first, **15** missing visual assets, **389** require original page visual verification, **4** independent solution needed, and **96** await human editorial approval. This is a *priority order*, not an estimate of automatically publishable content. The queue view has `security_invoker=true`; `anon` and `authenticated` have no SELECT privilege. The four figure/image items added in the two new sources are private staging only.

## Code, CI and remaining gates
- New private migrations: `20261021003000_task346_free_response_qa.sql`, `20261021003500_task346_pdf_release_blockers.sql`, `20261021004500_task346_sanoq1_source_defects.sql`, `20261021005000_task346_pdf_priority_review_queue.sql`.
- New regression tests: `supabase/tests/telegram_informatika_wave5_release_blockers.test.sql`, `supabase/tests/telegram_informatika_wave5_priority_queue.test.sql`, `scripts/tests/test_telegram_informatika_wave5_review.py`.
- Remaining **291** PDF files have no staged fragment (some theory/curriculum/administrative, not assumed test PDFs). Need file-by-file relevance, license, image/OCR audit. Telegram export missing **484** associated original photos; those source assets cannot be fabricated or inferred from the poll text.
- Editorial approval, original image rights/authorized storage, semantic duplicate review, specification-calibrated question difficulty and proper learner E2E remain separate release gates. **No automatic publish/deploy** as part of this task.
