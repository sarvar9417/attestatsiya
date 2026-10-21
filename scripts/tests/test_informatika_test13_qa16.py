"""Independent source QA for Attestatsiya test 6.pdf, printed as test no. 13.

These are source math checks, not verified author answer keys.
"""
import unittest


class RestoredPDFQA16(unittest.TestCase):
    def test_original_source_page_partition(self):
        all_pages = set(range(1, 21))
        figure_pages = {2, 3, 7, 10, 11, 12, 13, 15, 17, 18, 19}
        text_pages = {1, 4, 5, 6, 8, 9, 14, 16, 20}
        self.assertEqual(len(all_pages), 20)
        self.assertEqual(len(figure_pages), 11)
        self.assertEqual(all_pages, figure_pages | text_pages)
        self.assertFalse(figure_pages & text_pages)

    def test_js_array_code_q1(self):
        a = [2, 4, 6]
        a.append(a[1])
        a.pop()
        a[0] += 3
        value = sum(v if v % 2 == 0 else -v for v in a)
        self.assertEqual(a, [5, 4, 6])
        self.assertEqual(value, 5)

    def test_css_adjacent_margin_q5(self):
        self.assertEqual(max(25, 25), 25)

    def test_python_while_q8(self):
        s, n, cycles = 190, 0, 0
        while s - n > 0:
            s -= 5
            n += 15
            cycles += 1
        self.assertEqual((s, cycles), (140, 10))

    def test_bitmap_palette_q9(self):
        bit_depth = 40 * 1024 * 8 // (250 * 300)
        self.assertEqual(bit_depth, 4)
        self.assertEqual(2 ** bit_depth, 16)

    def test_only_one_statement_true_q14(self):
        source_choices = [(1, 2, 3), (3, 2, 1), (1, 3, 2), (2, 1, 3)]
        true_counts = [int(k == 3) + int(d == 2) + int(n != 2)
                       for k, d, n in source_choices]
        self.assertEqual(true_counts, [2, 3, 0, 1])
        self.assertEqual([i for i, num in enumerate(true_counts) if num == 1], [3])

    def test_drawing_concepts_q16(self):
        from_source = ["kanvas", "curved line", "edit colors"]
        self.assertEqual(from_source[0], "kanvas")
        self.assertEqual(from_source[1], "curved line")
        self.assertEqual(from_source[2], "edit colors")

    def test_phishing_q4_source_option(self):
        choices = ["Phishing", "Pharming", "Smishing", "Vishing"]
        self.assertEqual(choices.index("Phishing"), 0)


if __name__ == "__main__":
    unittest.main()
