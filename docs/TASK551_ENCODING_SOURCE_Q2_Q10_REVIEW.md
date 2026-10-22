# TASK-551: Axborot kodlash source review (2026-10-22)

Original PDF: `Axborot kodlash test.pdf` (Drive ID `1cZxFUwE-PKCOIk5Pj1xQcljPIfWZIVD5`). Canonical source staging has 20 separate questions. Duplicate `Axborot kodlash test (1).pdf` is an isolated aggregate with 80 option fragments and remains blocked.

**Original question 2:** A=3600 seconds and B=60 minutes are the same value. The source does not explicitly specify bits per character. With an *added assumption* of 8 bits/character, 128×32×60×8/512=3840 seconds = 64 minutes, i.e. original D. Do NOT mark this assumption as a source-supplied key. Existing blocker `unspecified_unit_or_encoding` was strengthened with exact duplicate-option evidence; private flag `qa20261022_duplicate_semantic_answer_choices` remains for Q2.

**Original question 10:** Options are A=C4A9, B=B4A, C=C4B, D=C4A, four **different** strings. They are **NOT** duplicate options (an earlier superficial reading was corrected). Source algorithm is ambiguous about transformations based on odd multi-digit *numbers* vs individual digits and when duplicate characters are removed. Original blocker `ambiguous_or_nonunique_answer` remains. A mistakenly added duplicate-choice flag was removed after verification.

`scripts/task551-encoding-options.test.mjs` exercises the above invariants. It does not create original answer keys, source text edits, or learner publication. Baseline staging currently has **719 source candidates** (additional source restores beyond historical 698), `learner_publish_ready=0`, `missing_required_visual_asset=75`; source editorial queue snapshot: 175 source repairs / 53 visual restores / 491 editorial.
