"""TASK-346 QA8: source-independent arithmetic and defective-option regressions.

These are computations from privately inspected PDFs, not official source answer keys.
"""
import math
import unittest


class SourceMathReviewQA8(unittest.TestCase):
    def test_book_reading_unit_assumption(self):
        characters = 160 * 48 * 64
        seconds = 21 * 3600 + 20 * 60
        self.assertEqual(characters / seconds, 6.4)
        # 6.4 *bytes*/s is conditional on one byte per character.

    def test_31st_question_first_r_password(self):
        self.assertEqual(3 * 6 ** 4 + 1, 3889)

    def test_picture_color_depth(self):
        pixel_count = 315 * 3072
        max_bits_per_pixel = (735 * 1024 * 8) // pixel_count
        self.assertEqual(max_bits_per_pixel, 6)
        self.assertEqual(2 ** max_bits_per_pixel, 64)

    def test_17th_question_has_only_one_possible_choice(self):
        def machine(a: int, b: int) -> str:
            a_digits = [a // 100, a // 10 % 10, a % 10]
            b_digits = [b // 100, b // 10 % 10, b % 10]
            h, t, o = [x + y for x, y in zip(a_digits, b_digits)]
            return (f"{t}{h}" if t < h else f"{h}{t}") + str(o)

        # Under the source's no-padding concatenation rule, 02 is not a
        # possible rendering for the integer sum 2. Earlier QA claiming
        # 141802 (A) was also valid was wrong.
        self.assertEqual(machine(791, 791), "14182")
        self.assertEqual(machine(897, 997), "171814")
        answers = {"141802", "141819", "171814", "171418"}
        observed = set()
        for x in range(100, 1000):
            for y in range(100, 1000):
                out = machine(x, y)
                if out in answers:
                    observed.add(out)
        self.assertEqual(observed, {"171814"})

    def test_30th_question_three_valid_answers(self):
        options = (50, 44, 62, 48)
        def valid_total(total: int) -> bool:
            members = total - 24
            return members <= 24 or members >= 28
        self.assertEqual([n for n in options if valid_total(n)], [44, 62, 48])

    def test_base9_digit_A_is_not_valid(self):
        self.assertNotIn("A", "012345678")

    def test_code_27_audio_raw_bytes(self):
        self.assertEqual(48000 * 32 * 4 * 60 // 8, 46080000)

    def test_ninth_pdf_question_requires_explicit_data_units(self):
        # Decimal vs binary units produce different times for the same numeral.
        binary_seconds = 1.875 * 1024 * 8 / 16
        decimal_seconds = 1.875 * 1000 * 8 / 16
        self.assertEqual(binary_seconds, 960)
        self.assertEqual(decimal_seconds, 937.5)
        self.assertNotEqual(binary_seconds, decimal_seconds)

    def test_mean_source_answers_remain_proposals(self):
        self.assertEqual((330 + 270 - 520), 80)
        self.assertTrue(math.ceil(math.log2(200)) == 8)


if __name__ == "__main__":
    unittest.main()
