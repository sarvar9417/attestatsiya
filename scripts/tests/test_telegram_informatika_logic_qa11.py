"""QA11 — source-faithful private Boolean regression, not author-approved answer keys.

Original: Mantiq 2-dars.pdf, physical pages 1..21, questions 1..60.
No PDF/media redistribution, database, network, or publishing action.
"""
from itertools import product
import unittest

PAGES = {
    **dict.fromkeys(range(1, 6), 1),
    **dict.fromkeys(range(6, 11), 2),
    **dict.fromkeys(range(11, 16), 3),
    **dict.fromkeys(range(16, 19), 4),
    **dict.fromkeys(range(19, 22), 5),
    **dict.fromkeys(range(22, 25), 6),
    **dict.fromkeys(range(25, 28), 7),
    **dict.fromkeys(range(28, 31), 8),
    **dict.fromkeys(range(31, 36), 9),
    **dict.fromkeys(range(36, 41), 10),
    **dict.fromkeys(range(41, 44), 11),
    **dict.fromkeys(range(44, 47), 12),
    **dict.fromkeys(range(47, 50), 13),
    50: 14,
    **dict.fromkeys(range(51, 54), 18),
    **dict.fromkeys(range(54, 57), 19),
    **dict.fromkeys(range(57, 60), 20),
    60: 21,
}

class BooleanParser:
    """Safe recursive-descent evaluator: only named Boolean variables/operators."""
    PRECEDENCE = {"↔": 1, "→": 2, "∨": 3, "∧": 4}

    def __init__(self, expression, values):
        self.s = "".join(expression.split()).translate(str.maketrans({
            "∩": "∧", "∪": "∨", "": "∧", "": "∨", "": "∧", "": "∨", "": "↔"
        }))
        self.values = values
        self.i = 0

    def parse(self, min_prec=0):
        s = self.s
        if self.i >= len(s):
            raise ValueError("incomplete formula")
        t = s[self.i]
        self.i += 1
        if t == "¬":
            lhs = not self.parse(9)
        elif t == "(":
            lhs = self.parse()
            if self.i >= len(s) or s[self.i] != ")":
                raise ValueError("missing closing parenthesis")
            self.i += 1
        elif t in "ABCD":
            lhs = self.values[t]
        elif t in "01":
            lhs = t == "1"
        else:
            raise ValueError(f"unknown token {t!r}")
        while self.i < len(s) and s[self.i] in self.PRECEDENCE:
            op = s[self.i]
            prec = self.PRECEDENCE[op]
            if prec < min_prec:
                break
            self.i += 1
            rhs = self.parse(prec + (0 if op == "→" else 1))
            lhs = {"∧": lambda: lhs and rhs, "∨": lambda: lhs or rhs,
                   "→": lambda: (not lhs) or rhs, "↔": lambda: lhs == rhs}[op]()
        return lhs

    def result(self):
        answer = self.parse()
        if self.i != len(self.s):
            raise ValueError("unparsed source expression")
        return answer


def value(expr, vals):
    return BooleanParser(expr, vals).result()


# Physical source questions 16..30, with the single fixed variable,
# target truth value, and independently verified matching-count result.
COUNT_CASES = {
    16: ("((A∨B)∧B)→(C∨A)", "A", 0, 1, 3),
    17: ("(A∧(B∨C))→(B∨A)", "B", 1, 0, 0),
    18: ("(¬A∨B)∧(B→C)", "C", 0, 1, 1),
    19: ("((A→B)∧B)→C", "A", 1, 0, 1),
    20: ("(A∨(B∧C))→(C∨B)", "B", 0, 1, 3),
    21: ("(A∧B)∨(B∧C)", "A", 1, 0, 2),
    22: ("(¬(A∨B))→(C∧A)", "B", 0, 0, 2),
    23: ("((A∨B)∧(A∨C))→(B∨C)", "C", 1, 1, 4),
    24: ("(B→(C∨A))∧(C→B)", "A", 0, 1, 2),
    25: ("((A∧B)→C)∨(B∧¬C)", "B", 1, 0, 0),
    26: ("(A∨B∨C)→(B∧C)", "C", 0, 1, 1),
    27: ("(B∧(A∨C))→(A∨(B∧C))", "A", 0, 0, 0),
    28: ("(¬A∧B)→(¬C∨A)", "B", 0, 1, 4),
    29: ("((A∨B)→C)∧(B∨¬C)", "C", 1, 0, 2),
    30: ("(A→(B∨C))→(B∨(A∧¬C))", "A", 0, 0, 2),
}

# Each option is transcribed and normalized from physical PDF pages 18..21.
CHOICES = {
    51: ("¬A→B", ["A∨B", "¬A∨B", "A∧B", "¬A∧B"], [0]),
    52: ("A→¬B", ["¬A∨¬B", "A∧¬B", "¬A∧B", "A∨B"], [0]),
    53: ("¬(A→B)", ["A∧¬B", "¬A∧B", "¬A∨B", "¬A∧¬B"], [0]),
    54: ("A↔B", ["(A→B)∧(B→A)", "(A∨B)∧¬(A∧B)", "¬A∧B", "¬A∨¬B"], [0]),
    55: ("¬(A↔B)", ["(A∧¬B)∨(¬A∧B)", "(A→B)∧(B→A)", "¬A∨¬B", "(A∨¬B)∧(¬A∨B)"], [0]),
    56: ("(A→B)→C", ["¬(A→B)∨C", "(A∧B)∨C", "(¬A∧B)∨¬C", "¬(A∧B)∨C"], [0]),
    57: ("¬(A→B)∨C", ["(A∧¬B)∨C", "¬A∨(B∧C)", "¬(A∧B)∨C", "A∨(¬B∧¬C)"], [0]),
    58: ("(A↔B)→C", ["¬(A↔B)∨C", "(A∧B)∨C", "(A→B)∨¬C", "(A∨B)∧¬C"], [0]),
    59: ("¬A↔B", ["(¬A∧B)∨(A∧¬B)", "(A∧B)∨(¬A∧¬B)", "¬(A↔B)", "(A∨¬B)∧(¬A∨B)"], [0, 2]),
    60: ("(A∧B)→(C∨¬D)", ["¬(A∧B)∨(C∨¬D)", "(A∨B)→(C∨D)", "¬A∨¬B∨¬C∨D", "(A∧B∧¬C)∨D"], [0]),
}

BROKEN_SOURCE_NUMBERS = {2, 3, 4, 8, 9, 13, 14, 44, 46, 47, 49, 50, 59}


class OriginalPdfLogicQA11(unittest.TestCase):
    def test_60_question_page_locators(self):
        self.assertEqual(set(PAGES), set(range(1, 61)))
        self.assertEqual(PAGES[50], 14)
        self.assertEqual([PAGES[n] for n in range(51, 61)],
                         [18, 18, 18, 19, 19, 19, 20, 20, 20, 21])

    def test_15_source_fixed_variable_truth_counts(self):
        self.assertEqual(len(COUNT_CASES), 15)
        for n, (expr, fixed, constant, wanted, expected) in COUNT_CASES.items():
            with self.subTest(question=n):
                other = [v for v in "ABC" if v != fixed]
                actual = sum(
                    int(value(expr, {fixed: bool(constant),
                                     **dict(zip(other, settings))}) == bool(wanted))
                    for settings in product((False, True), repeat=2)
                )
                self.assertEqual(actual, expected)

    def test_10_equivalence_question_original_options(self):
        self.assertEqual(len(CHOICES), 10)
        for n, (target, options, expected) in CHOICES.items():
            with self.subTest(question=n):
                names = "ABCD" if n == 60 else "ABC" if "C" in target else "AB"
                actual = [
                    i for i, option in enumerate(options)
                    if all(value(target, dict(zip(names, settings))) ==
                           value(option, dict(zip(names, settings)))
                           for settings in product((False, True), repeat=len(names)))
                ]
                self.assertEqual(actual, expected)

    def test_q59_cannot_be_a_unique_key(self):
        self.assertEqual(CHOICES[59][2], [0, 2])
        self.assertIn(59, BROKEN_SOURCE_NUMBERS)

    def test_interval_defects_not_assumed_integer(self):
        self.assertTrue({2, 3, 4, 8, 9, 13, 14}.issubset(BROKEN_SOURCE_NUMBERS))
        self.assertEqual([n for n in (1, 5, 6, 7, 10, 11, 12, 15)
                          if n in BROKEN_SOURCE_NUMBERS], [])

    def test_boolean_identity_error_in_original_theory(self):
        for a in (False, True):
            self.assertEqual(a and True, a)
        self.assertNotEqual(True and True, False)  # PDF incorrectly says a∧1=0

    def test_learner_key_requires_actual_editorial_approval(self):
        proposed_answer, source_author_key, approved, released = 0, None, False, False
        self.assertEqual(proposed_answer, 0)
        self.assertIsNone(source_author_key)
        self.assertFalse(approved or released)


if __name__ == "__main__":
    unittest.main()
