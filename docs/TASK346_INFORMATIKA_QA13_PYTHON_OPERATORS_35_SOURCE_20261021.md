# TASK-346 QA13 — 35 Python operator questions, original PDF audit

**2026-10-21; private editorial staging only, no learner release and no production deploy.**

## Source and physical-page verification

Original [Python dasturlash tilida Operatorlar.pdf](https://drive.google.com/file/d/1VViLB_EZHq_ayXRH5fsnrF91vw9sUl0Z/view) has four physical PDF pages with 35 numbered exercises. Page 1: questions 1–10. Page 2: questions 11–22. Page 3: questions 23–33. Page 4: questions 34–35. **Question 22 begins on p2 but its code/choices continue on p3; question 33 begins on p3 but its code/choices continue on p4.** These provenance differences were flagged rather than pretending the question lives entirely on one page.

All 35 existing private candidates are marked source-page inspected after original renders were reviewed. Code was read and evaluated by independent safe calculations; **no downloaded source snippets were blindly executed**.

## Original source errors — explicit release blockers

| Source question | Finding |
| --- | --- |
| 17 | Original code `print("2" in str(123) and 2 in)` is a **SyntaxError**: the right-hand membership operand is missing. This is not a valid Boolean membership exercise without editorial correction. |
| 21 | `"py"+"thon" is "python"` involves compiler/interpreter string constant folding/interning; the result of `is` is not a reliable Python-language value guarantee. |
| 22 | `x=300; y=300; x is y` relies on integer constant caching/optimization and execution context; `x == y` is guaranteed True, while `x is y` cannot be uniquely keyed across Python implementations. |
| 30 | Original `print((16 >> 2) bit_length())` is missing the attribute-access dot. `(16 >> 2).bit_length()` would evaluate to 3, but the uncorrected original raises **SyntaxError** and the offered answer choices do not represent that result. |

Each receives a private `learner_publish_blocked=true` source defect record. None is silently amended or keyed.

## Independent computed results

**31** multiple-choice answer proposals were saved with explanations in Uzbek. Selected source-specific pitfalls:

- Question 1: `x *= 2 + 3` uses grouping of the right hand: 50.
- Question 12: `0 or 5 and 12` returns **integer 12**, not Boolean True.
- Question 19: chained `"a" not in "olma" == False` is evaluated as two linked comparisons, returning **False**, not a comparison of a Boolean with False.
- Question 23: `True is 1` is False but `True == 1` is True. Object identity and numeric equality differ.
- Question 26: `6 & 3+1` groups as `6 & (3+1)`, giving **4**.
- Question 31: `2 ** 3 ** 2 * 2` is `2 ** (3 ** 2) * 2 = 1024`.
- Question 32: `19.0 // 4 + 2` returns **float 6.0**, not int 6.
- Question 33: `-13 % 4 = 3` because Python's modulo result follows the positive divisor.
- Question 35: `-11 // 3 = -4` because floor division rounds toward negative infinity.

Q10, Q22 and Q33 also had adjacent-page channel/admin banners fused into extracted question text. Removed those unrelated banners, preserving source code, page mappings, and original options. Q22 and Q33 retain cross-page continuation flags.

## Next release gates

35/35 physically inspected; 31 privately proposed answer choices (not the original PDF author key); four blocked questions. 0 source-author keys and 0 learner-ready status in this source. The full 35-question source index, 31 choices and all four blocks are checked in `scripts/tests/test_telegram_informatika_python_operators_qa13.py`. Its standard-library checks never execute untrusted PDF code.

This pull request contains independent test code and report only. No PDF bytes, copyrighted screenshots, private answers as official keys, migrations, or production deployments.
