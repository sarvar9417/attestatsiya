"""TASK-346 QA6: independently derived numeric checks, never execute source code."""
from fractions import Fraction
from math import factorial
import itertools
import unittest


def bool_expression(a: bool, b: bool, c: bool) -> bool:
    return a and (a or b or c)


class SourceReconciliationQA6(unittest.TestCase):
    def test_annotated_boolean_key_cannot_follow_truth_table(self):
        rows = list(itertools.product((False, True), repeat=3))
        outputs = [bool_expression(*args) for args in rows]
        self.assertEqual(sum(outputs), 4)
        self.assertEqual("".join(str(int(x)) for x in outputs), "00001111")
        self.assertEqual(int("".join(str(int(x)) for x in outputs), 2), 15)
        self.assertEqual(sum(i for i, bit in enumerate(outputs) if bit), 22)
        self.assertNotIn(29, (4, 15, 22))

    def test_excel_average_uses_exact_fraction(self):
        self.assertEqual(Fraction(sum((6, 4, 8, 2, 16, 97)), 6), Fraction(133, 6))
        self.assertEqual(Fraction(sum((17, 31, 24, 19, 45, 21)), 6), Fraction(157, 6))
        self.assertEqual(Fraction(124, 10) + Fraction(52, 10) + Fraction(67, 10)
                         + Fraction(73, 10) + Fraction(98, 10), Fraction(414, 10))

    def test_excel_factorials_and_text_functions(self):
        self.assertEqual([factorial(n) for n in (4, 5, 7, 8, 3)],
                         [24, 120, 5040, 40320, 6])
        self.assertEqual(len("O`ZBEKISTON"), 11)
        self.assertEqual(len("ATTESTATSIYA"), 12)
        self.assertEqual("ATTESTATSIYA"[:8], "ATTESTAT")
        self.assertEqual("REGISTRATSIYA"[-7:], "RATSIYA")
        self.assertEqual("MICROSOFT"[5:8], "SOF")
        self.assertEqual("MUHAMMAD"[2:7], "HAMMA")

    def test_countif_range_limits_matter(self):
        data = {"A1": "MAKTAB", "B6": "ONA", "B4": "VATAN",
                "A5": "KITOB", "A4": "ONA"}
        a1_b4 = [data.get(f"{col}{row}") for col in "AB" for row in range(1, 5)]
        a1_b6 = [data.get(f"{col}{row}") for col in "AB" for row in range(1, 7)]
        self.assertEqual(a1_b4.count("KITOB"), 0)
        self.assertEqual(a1_b6.count("ONA"), 2)

    def test_q16_and_q28_and_q35_are_source_defects(self):
        # No named-range definitions for A/B/R; never invent cell values.
        self.assertEqual({"A", "B", "R"} - set(), {"A", "B", "R"})
        # Exact page image contains no opening quote in Q28.
        malformed_left = '=LEFT(O`QITUVCHI” ; 4)'
        self.assertNotIn("“", malformed_left)
        # Q35 must have 4 arguments, but original separates only two semicolons.
        malformed_replace = '=REPLACE(“INFORMATIKA";5;7 “TEACH”)'
        self.assertEqual(malformed_replace.count(";"), 2)


if __name__ == "__main__":
    unittest.main()
