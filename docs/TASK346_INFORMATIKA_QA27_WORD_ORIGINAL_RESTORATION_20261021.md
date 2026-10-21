# QA27 — MS Word 8-question physical-source restoration (2026-10-21)

Source: [MS Word dasturida testlar.pdf](https://drive.google.com/file/d/1FOKKk9DzYcmNcIHJSglX80C6unHks2w5/view), **5 original PDF pages**, with assessment material on physical pages 1–4 (page 5 blank). Original page 1–4 images reviewed privately. Do not publish the original PDF/media to public Git or learners until redistribution rights are independently established.

## Restored task boundaries

Original candidate staging had only 4 rows (#1, #4, #6, #7), with question #1 swallowing parts of original #2/#3, question #4 swallowing the independent #5 and its four variants, and #7 trailing the next question number #8. The source also held #4's four statements and all four choices as a **picture only**.

Now candidate source numbers **1–8** exist with physical pages `1,1,2,2,3,3,3,4`. All original pages/figures were visually inspected. Parsed rows #2, #3 and #8 were created as independent, unkeyed source candidates; #5 was separated from #4 and its initially copied physical page corrected **from page 2 to page 3**; #4's screenshot truth table and its original four A–D choices were restored in independently worded, inspectable text; #1 no longer contains #2/#3; #6 icon meanings are described textually; #7 no longer includes the source next-question number and its before/after images are represented textually.

The old `insufficient_problem_data` blocker for #4 referred **only to the missing figure in the extracted candidate**. After visually restoring the original complete four-statement table and choices, this specific obsolete ingestion blocker was removed. No original author key was introduced and human/editorial release gates remain closed.

## Independent expert propositions, *not* source answer keys

| Source # | Physical PDF page | Independent proposed response |
|---|---:|---|
| 1 | 1 | True, false, false, true (four Word statements) |
| 2 | 1 | **B**, Ctrl+U then Split Table |
| 3 | 2 | **A**, false/true/false/true |
| 4 | 2 | **A**, true/true/false/true; Word-version-sensitive fourth statement |
| 5 | 3 | **A**, Tab; this adds a new Word table row **when the caret is in the last cell**, an important condition stated separately in original Q3 |
| 6 | 3 | **A**, original icons map 1-d, 2-e, 3-b, 4-a, 5-c, 6-f |
| 7 | 3 | Starting `Prem|ierLeague`, press Backspace once, Delete three times, then Space → `Pre |League` |
| 8 | 4 | **A**, select row, Ctrl+I, select column from header, Insert Left |

All six multiple-choice suggestions have `confirmed_by_human=false`; both free-response suggestions have `human_approved=false` and `publish_ready=false`. Source candidate `answer_key` remains NULL across all eight. The options are mathematical/functional expert interpretations, **not** a verified official answer key.

### Quality gates

- Original figure → accessible descriptive text, physical page checked; no guess from textual OCR only.
- Numeric question IDs and bound option sets restored; question #8 has 4 choices from the original graphical page.
- Offline 11-test source regression under `scripts/tests/test_word_source_pdf_qa27.py`; does not read production credentials or PDF bytes.
- At review time global private candidate inventory **620**, original source answer keys **0**. Other source/editorial approval backlogs are unchanged by this limited restoration.
- No public learner table writes, original PDF images in Git, release approvals, database migration or production deployment.

### Outstanding

Only editorial/human confirmation and source/media rights can authorize publication. For #3 and #4, validate Microsoft Word version dependent behavior before converting independently calculated responses to official teaching content.
