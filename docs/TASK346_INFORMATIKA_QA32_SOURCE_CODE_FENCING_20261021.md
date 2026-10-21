# TASK-346 QA32 — Preserve executable-source formatting in private PDF candidate bank

**21 October 2026.** Source [13.04.2026 Attetasiya Tushgan savollar.pdf](https://drive.google.com/file/d/1McTsbH1NC5nD0aLO32DZJLWT6EDCqOA2/view), original physical pages 11, 12, 14, 22, and 23.

## Verified private staging changes

- Original **JavaScript** question bodies from physical pages **11** and **12**, and **HTML / HTML+CSS** bodies from physical pages **22** and **23**, were enclosed in balanced Markdown fenced code blocks. Exactly two triple-backtick markers were read back for each of these four candidates. This is display-only: source program operators, variable names, literal content, question choices, and source answers were not rewritten.
- Physical page **14**, original choice A contains nested HTML markup; that option was safely fenced as HTML. It remains **one of fewer than four extracted choices**, not a valid four-choice candidate yet; the original visual/source-completeness release gate persists.
- Physical page **11** has a string literal visually split across PDF lines inside quoted JavaScript text. An actual hard newline inside that JavaScript string would make the code invalid, but the typeset PDF may merely soft-wrap the line. Neither interpretation is established as the official source intent. Added a private `ambiguous_or_nonunique_answer` release blocker; do not remove the source line break or invent a resulting official key until an editor resolves the ambiguity.
- Verified source `answer_key` values remain NULL, no approval and no learner publication.

## Regression and boundaries

`scripts/tests/test_informatika_source_code_blocks_qa32.py` includes **eight offline stdlib tests** for balanced JS/HTML fences, preserving literal HTML and JS operators, not confusing `<h1>A)` with an MCQ option, rejecting double-wrapping, the ambiguous hard newline, incomplete option sets, and zero author-key/learner-ready state.

All artifacts remain private except source-independent QA tests and documentation. **No original PDF screenshots in Git, source key promotion, public learner writes, RLS migration or production deploy.**
