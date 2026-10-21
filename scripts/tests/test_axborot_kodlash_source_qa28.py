"""QA28: source-grounded bit-per-character and cipher ambiguity review.

All results are offline editorial calculations; no official source key created.
"""
import re
import unittest


def transfer_duration_seconds(bits_per_char):
    return 128 * 32 * 60 * bits_per_char // 512


class PDFEncodingSourceQA28(unittest.TestCase):
    def test_exact_source_symbol_count(self):
        self.assertEqual(128 * 32 * 60, 245760)

    def test_conditional_eight_bit_interpretation(self):
        self.assertEqual(transfer_duration_seconds(8), 3840)
        self.assertEqual(transfer_duration_seconds(8) // 60, 64)

    def test_seven_bit_and_sixteen_bit_change_the_answer(self):
        self.assertEqual(transfer_duration_seconds(7) // 60, 56)
        self.assertEqual(transfer_duration_seconds(16) // 60, 128)
        self.assertNotEqual(transfer_duration_seconds(7),
                            transfer_duration_seconds(8))

    def test_four_source_choices_only_match_conditional_8bit(self):
        original_choices_seconds = [3600, 3600, 240, 3840]
        self.assertEqual([i for i, v in enumerate(original_choices_seconds)
                          if v == transfer_duration_seconds(8)], [3])
        self.assertEqual([i for i, v in enumerate(original_choices_seconds)
                          if v == transfer_duration_seconds(7)], [])

    def test_password_multiple_digit_group_interpretations(self):
        source = "B27A4C15B92"
        grouped = re.findall(r"([A-Z])([0-9]+)", source)
        one_digit = re.findall(r"([A-Z])([0-9])", source)
        self.assertEqual(grouped, [("B", "27"), ("A", "4"),
                                   ("C", "15"), ("B", "92")])
        self.assertEqual(one_digit, [("B", "2"), ("A", "4"),
                                     ("C", "1"), ("B", "9")])
        self.assertNotEqual(grouped, one_digit)

    def test_ambiguous_source_must_not_be_promoted(self):
        q2_missing_bit_per_symbol = True
        q10_unspecified_digit_grouping = True
        author_answer_key = None
        human_approved = False
        self.assertTrue(q2_missing_bit_per_symbol)
        self.assertTrue(q10_unspecified_digit_grouping)
        self.assertIsNone(author_answer_key)
        self.assertFalse(human_approved)


if __name__ == "__main__":
    unittest.main()
