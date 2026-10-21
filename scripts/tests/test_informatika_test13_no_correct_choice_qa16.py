"""Attestatsiya Test 13 original question 6: source choice missing base eight."""
import unittest

DIGITS = "0123456789ABCDEF"


def base_digits(n, base):
    if n == 0:
        return "0"
    result = ""
    while n:
        result = DIGITS[n % base] + result
        n //= base
    return result


def source_display(first, second, base):
    if any(int(c) >= base for c in first + second):
        return None
    digits = sorted([int(first[0]) + int(second[0]),
                     int(first[1]) + int(second[1])])
    return "".join(base_digits(v, base) for v in digits)


class SourceNoCorrectChoiceQA16(unittest.TestCase):
    def test_required_bases_all_four_pairs(self):
        pairs = [("28", "64", "812", 10), ("49", "93", "1011", 12),
                 ("55", "86", "1012", 11), ("57", "43", "1112", 8)]
        for a, b, screen, base in pairs:
            with self.subTest(a=a, b=b):
                self.assertEqual(source_display(a, b, base), screen)

    def test_question_six_no_original_valid_answer_choice(self):
        original_bases = {11, 9, 12, 10}
        self.assertNotIn(8, original_bases)
        self.assertEqual(source_display("57", "43", 9), "1011")
        self.assertFalse(any(source_display("57", "43", base) == "1112"
                             for base in original_bases))


if __name__ == "__main__":
    unittest.main()
