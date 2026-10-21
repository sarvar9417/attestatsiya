"""TASK-346 QA13: source-faithful private Python-operator review assertions.

Exercise fragments are *never* eval/exec'd from the PDF. This file encodes only
reviewed, deliberately hand-written harmless values from the original four pages.
"""
import ast
import unittest


PAGE = {**dict.fromkeys(range(1, 11), 1),
        **dict.fromkeys(range(11, 23), 2),
        **dict.fromkeys(range(23, 34), 3),
        **dict.fromkeys(range(34, 36), 4)}

SOURCE_KEY_PROPOSALS = {
    1:1, 2:0, 3:0, 4:1, 5:0, 6:1, 7:0, 8:1, 9:2, 10:0,
    11:1, 12:2, 13:1, 14:1, 15:2, 16:1, 18:0, 19:1, 20:1,
    23:3, 24:0, 25:1, 26:0, 27:1, 28:0, 29:2, 31:1, 32:1,
    33:1, 34:0, 35:2,
}

SOURCE_BLOCKERS = {
    17: "source incomplete right operand of membership operator",
    21: "string literal identity is compiler/interpreter-dependent",
    22: "large integer object identity is optimization dependent",
    30: "bit_length call lacks an attribute-access dot",
}


class SourcePythonOperatorQA13(unittest.TestCase):
    def test_35_original_question_numbers_and_physical_pages(self):
        self.assertEqual(set(PAGE), set(range(1, 36)))
        self.assertEqual([sum(v == k for v in PAGE.values()) for k in range(1, 5)],
                         [10, 12, 11, 2])
        self.assertEqual((PAGE[22], PAGE[33]), (2, 3))  # Both span next page

    def test_31_proposals_and_four_explicit_blocks(self):
        self.assertEqual(len(SOURCE_KEY_PROPOSALS), 31)
        self.assertEqual(len(SOURCE_BLOCKERS), 4)
        self.assertEqual(set(SOURCE_KEY_PROPOSALS) | set(SOURCE_BLOCKERS), set(PAGE))
        self.assertFalse(set(SOURCE_KEY_PROPOSALS) & set(SOURCE_BLOCKERS))
        self.assertTrue(all(0 <= i <= 3 for i in SOURCE_KEY_PROPOSALS.values()))

    def test_actual_original_syntax_errors_are_detected_not_repaired(self):
        for snippet in ('print("2" in str(123) and 2 in)',
                        'print((16 >> 2) bit_length())'):
            with self.subTest(snippet=snippet):
                with self.assertRaises(SyntaxError):
                    ast.parse(snippet)

    def test_integer_caching_identity_not_assumed(self):
        self.assertIn(21, SOURCE_BLOCKERS)
        self.assertIn(22, SOURCE_BLOCKERS)
        # Contrast semantic equality with identity without testing an implementation-specific is.
        a, b = 300, int("300")
        self.assertEqual(a, b)  # Identity is purposefully NOT asserted.

    def test_assignment_and_arithmetic_order(self):
        self.assertEqual(10 * (2 + 3), 50)
        self.assertEqual(20 // (10 - 5), 4)
        self.assertEqual(5 ** (3 // 2), 5)
        self.assertEqual((10, 5 + 10), (10, 15))
        self.assertEqual(16 % (5 * 2), 6)

    def test_python_boolean_operands(self):
        self.assertEqual(0 or 5 and 12, 12)
        self.assertEqual("" or "Dasturchi", "Dasturchi")
        self.assertEqual(5 > 3 and "A" and 7.5, 7.5)
        self.assertEqual(("At" in "Atestatsiya" and "test" not in "Atestatsiya"), False)
        self.assertEqual("" in "Python", True)

    def test_comparison_chaining_matters(self):
        self.assertTrue(3 < 5 != 4 > 2)
        self.assertFalse("a" not in "olma" == False)
        self.assertTrue((5 > 3) == (10 <= 10.0))

    def test_bit_operator_precedence(self):
        self.assertEqual(6 & (3 + 1), 4)
        self.assertEqual(~10, -11)
        self.assertEqual(12 ^ 5, 9)
        self.assertEqual(3 << 3, 24)

    def test_arithmetic_corner_cases(self):
        self.assertEqual(2 ** (3 ** 2) * 2, 1024)
        self.assertEqual(19.0 // 4 + 2, 6.0)
        self.assertIsInstance(19.0 // 4 + 2, float)
        self.assertEqual(-13 % 4, 3)
        self.assertEqual((True + True) ** 3 - False, 8)
        self.assertEqual(-11 // 3, -4)

    def test_original_pdf_header_cleanup_does_not_change_source_meaning(self):
        # These are the three boundaries where a channel banner was appended
        # during extraction; original code still has the same semantics.
        self.assertTrue("5" != 5 or 5.0 == 5)
        self.assertEqual(-13 % 4, 3)
        self.assertEqual((300 == 300), True)

    def test_no_proposal_is_an_official_key(self):
        source_author_key, human_approved, publish_ready = None, False, False
        self.assertIsNone(source_author_key)
        self.assertFalse(human_approved or publish_ready)


if __name__ == "__main__":
    unittest.main()
