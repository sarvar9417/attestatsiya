# TASK-264 — M15.07 “avtoritar qobiliyat” manba va etika auditi

**Date:** 2026-10-19. **Scope:** static fallback theory only; no bank key / published lesson / migration change.

## Freshly verified source
- [Pedagogik qobilyatlar umumiy.pdf](https://drive.google.com/file/d/1vx6tDQ62fQ8AomiVexBsplHHhpCpJuqZ/view), a secondary teaching handout citing Xoliqov, contains “Avtoritar qobiliyat” with a definition involving emotional-volitional influence and gaining respect among learners.
- Main’s `M15.07` displayed only “Avtoritar — O‘quvchilarga ta’sir o‘tkazish”, omitting that definition’s context. The abbreviated phrase can be misread as endorsement of forceful teacher control.
- The revised lesson labels this a **historical classification**, describes reputation and pedagogical leadership, and states clearly that it does not justify intimidation, coercion or humiliation. This safety framing is editorial guidance, not a quotation of the historical author.
- Other classifications (didactic, academic, perceptive, language, organizational, communicative, imagination, split attention) are retained.

## Verification and limits
- `src/data/topicContent.ts`: revised table row, interpretive note, source trace.
- `src/tests/PedagogyAbilityTerminology2026.test.ts`: three regression checks.
- The handout’s physical page index is **not** certified. A complete original Xoliqov textbook concordance remains outstanding.
- No production DB write, user attempt mutation, answer-key disclosure, publication or deployment. GitHub CI must pass before merge readiness.
