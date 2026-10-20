"""Excel literal QA safe interpretation, valid/invalid/boundary/regression."""
import unittest

from scripts.telegram_excel_formula_review import SourceNeedsReview, review_formula


class ExcelFormulaQA(unittest.TestCase):
    def test_negative_mod_follows_divisor(self):
        self.assertEqual(review_formula("=MOD(-148;50)")[0], "2")
        self.assertEqual(review_formula("=MOD(-49;-14)")[0], "-7")
        self.assertEqual(review_formula("=MOD(-97;-28)")[0], "-13")

    def test_negative_precision_round(self):
        self.assertEqual(review_formula("=ROUND(854;-2)")[0], "900")
        self.assertEqual(review_formula("=ROUND(9872;-3)")[0], "10000")
        self.assertEqual(review_formula("=ROUND(-52.461;2)")[0], "-52.46")

    def test_fractional_power_and_product(self):
        self.assertEqual(review_formula("=POWER(81;1/4)")[0], "3")
        self.assertEqual(review_formula("=POWER(225;1/2)")[0], "15")
        self.assertEqual(review_formula("=PRODUCT(9;21;0)")[0], "0")

    def test_invalid_source_floor_blocks(self):
        for x in ("=FLOOR(6.34)", "=FLOOR(-27.48)", "-FLOOR(-93.62)"):
            self.assertEqual(review_formula(x)[2], "invalid_source_formula")
            self.assertIsNone(review_formula(x)[0])

    def test_reject_arbitrary_or_missing_arguments(self):
        for x in ("=SUM(A1:B2)", '=ABS(__import__("os"))', "=MOD(5;0)",
                  "=SQRT(-1)", "=POWER(8;123456)", "=PRODUCT(1;open())",
                  "=ROUND(1;100000)", "=ABS(999999999999999999999)"):
            with self.subTest(x=x), self.assertRaises(SourceNeedsReview):
                review_formula(x)


if __name__ == "__main__":
    unittest.main()
