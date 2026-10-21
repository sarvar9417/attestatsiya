# QA19 follow-up: CSV source ambiguities and complete text-only recovery

Original source `Attestatsiya test 6.pdf` titled `Attestatsiya test №13`, physical page **18**.

The spreadsheet screenshot has exact rows:
- name, grade1, grade2, grade3
- Mark, 34, 43, 11
- Tween, 132, 54, 546

Original answer screenshots correspond to delimiters: **A** pipe `|`; **B** comma `,`; **C** slash `/`; **D** semicolon `;`. The source claims a saved Excel `human.csv` file will have a single appearance in Notepad. This is underdetermined without the CSV dialect or Excel/Windows **regional list separator**. A comma-delimited CSV matches original B, while semicolon-configured exports match D. Thus the source does not justify choosing a unique answer.

All source rows and four literal textual choice representations were transcribed into the private staging question entry. Source graphic dependency is now `source_text_only` (complete original information preserved as text). A strict private blocker `insufficient_problem_data` was inserted, with `learner_publish_blocked=true` and `human_approved=false`. No source author answer key exists; **do not guess B or D**.

The additional offline test script `scripts/tests/test_informatika_test13_csv_separator_qa19.py` verifies both separator conventions against the source options and confirms the learner publication hold. No private PDF or screenshot bytes are committed, and no production deploy, schema migration or learner question publishing occurs.
