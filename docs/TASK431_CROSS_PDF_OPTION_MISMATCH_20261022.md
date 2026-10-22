# TASK-431 — Cross-file duplicate option mismatch detection

This is a private-staging audit (2026-10-22). Normalize question text with lower-case and stripped whitespace/punctuation, then group by normalized text hash. Of 21 duplicate groups spanning distinct PDF file IDs, **4 groups** have unequal JSON answer-option arrays, affecting **11 source candidate rows**. Because the same question text can have different answer options (including partially captured arrays), it is UNSAFE to assign a shared key or automatically deduplicate their learner content.

All 11 were marked `qa20261022_same_stem_different_original_option_sets`; original text/options/pages preserved. A source PDF vs screenshot comparison and new independently keyed revision are required before release. Examples:
- `Attestatsiya test №2.pdf` #6 / `Axborot kodlash test.pdf` #2 / `sanoq sistema kodlash test.pdf` #2.
- `O\`TGAN MAVZULARDAN TEST (1).pdf` #2 vs `Sanoq sistemalari 1.pdf` #16 vs `Sanoq sistemalari savollar.pdf` #16.
- `O\`TGAN MAVZULARDAN TEST (1).pdf` #9 vs two Sanoq PDF #15 versions.
- `O\`TGAN MAVZULARDAN TEST (1).pdf` #15 vs `Test 20 talik.pdf` #20.

Counts are **overlapping review sets**, do not add 11 to 45 unique duplicate records or 695 total. No source `answer_key` promoted, no learner publish.
