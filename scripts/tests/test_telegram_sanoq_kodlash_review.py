"""TASK-346: original numeral-system PDF independent arithmetic QA.

No original source text or copyrighted PDF is committed, no answers published.
"""
import unittest


def to_base(value: int, base: int) -> str:
    if value < 0 or not 2 <= base <= 36:
        raise ValueError("integer base out of range")
    digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if value == 0:
        return "0"
    result = ""
    while value:
        value, remainder = divmod(value, base)
        result = digits[remainder] + result
    return result


class SanoqKodlashReviewTests(unittest.TestCase):
    def test_radix_subtraction(self):
        self.assertEqual(int("232", 8) - int("173", 8), int("37", 8))

    def test_transfer_time(self):
        size_bits = 128 * 32 * 60 * 8
        self.assertEqual(size_bits / 512 / 60, 64)

    def test_binary_subtraction_and_area(self):
        self.assertEqual(151 - int("11000", 2), 127)
        width = int("1101", 2)
        length = int("1021", 3)
        square_side = int("31", 4)
        self.assertEqual(to_base(width * length - square_side ** 2, 2), "100010001")

    def test_invalid_original_option_set(self):
        number = 4 * 625**3 - 25**5 + 2 * 5**11 - 7
        self.assertEqual(to_base(number, 5).count("4"), 9)
        self.assertNotIn(9, (8, 20, 10, 15))

    def test_preserve_source_word_spelling(self):
        self.assertEqual(len("ATTESTATIYA"), 11)
        self.assertEqual(len("ATTESTATSIYA"), 12)
        result = 824 * len("ATTESTATIYA") / 1024
        self.assertEqual(round(result), 9)

    def test_missing_transmission_speed_unit(self):
        bytes_per_second = 400 * 1024 / (20 * 60)
        bits_per_second = bytes_per_second * 8
        self.assertNotEqual(round(bytes_per_second), round(bits_per_second))
        self.assertEqual(round(bits_per_second), 2731)


if __name__ == "__main__":
    unittest.main()
