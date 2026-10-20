"""Unit regressions: Python code in question text must NEVER execute."""
import unittest

from scripts.telegram_numeric_review import NeedsReview, print_result, suggest


class TelegramNumericReviewTests(unittest.TestCase):
    def test_negative_bitwise(self):
        expression, value = print_result('Natijasini toping. print(-90 & -18)')
        self.assertEqual(expression, '-90 & -18')
        self.assertEqual(value, -90)

    def test_python_boolean_operand_semantics(self):
        self.assertIs(print_result('print(not(33 or 57))')[1], False)
        self.assertEqual(print_result('print(15 and 27)')[1], 27)

    def test_shift(self):
        self.assertEqual(print_result('print(2 << 4)')[1], 32)

    def test_exact_one_option_is_required(self):
        row = {
            'candidate_id': 'test-only',
            'source_message_id': 123,
            'question': 'print(2 << 4)',
            'answer_choices': ['16', '32', '64', '0'],
        }
        proposal = suggest(row)
        self.assertEqual(proposal['suggested_answer_index'], 1)
        self.assertEqual(proposal['computed_output'], '32')
        self.assertFalse(proposal['human_approved'])
        self.assertFalse(proposal['published'])
        row['answer_choices'] = ['32', '32', '64', '0']
        self.assertIsNone(suggest(row))

    def test_rejects_untrusted_code_without_running_it(self):
        for text in (
            'print(__import__("os").system("id"))',
            'print(open("/etc/passwd").read())',
            'print(2 ** 1000000)',
            'print(1 / 0)',
            'print(1 << 100000)',
            'print(1)\\nprint(2)',
        ):
            with self.subTest(text=text):
                with self.assertRaises(NeedsReview):
                    print_result(text)

    def test_no_image_guessing(self):
        with self.assertRaises(NeedsReview):
            print_result('Ushbu rasmda qanday amal?')


if __name__ == '__main__':
    unittest.main()
