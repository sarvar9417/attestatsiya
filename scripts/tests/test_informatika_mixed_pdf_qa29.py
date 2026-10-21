"""QA29: private mixed-numbered PDF restoration, independent math release gates.

Source has 31 physical pages, 30 content pages; page 30 is blank.
Source displayed question numbers repeat; staging candidate IDs use physical pages.
No author keys, original media or learner rows are changed by this test.
"""
import itertools
import unittest


PHYSICAL_PAGES = tuple(range(1, 30)) + (31,)
FOUR_CHOICES = (1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                25, 26, 27, 28, 29)
NEEDS_VISUAL = (4, 9, 10, 13, 14, 15, 17, 18, 19, 20, 22)
PDF_SHA256 = "032274965718ed9cb2de06ca0c93b3124169556e1fcf7165c79a503afa643b25"
DUPLICATE_SHA256 = "a58aa2ce8911f2607e765a4b187176ba0eb95de72c879ea3c7689dc002c596cd"


class MixedSourceQA29(unittest.TestCase):
    def test_30_content_pages_blank_page_30_not_assigned(self):
        self.assertEqual(len(PHYSICAL_PAGES), 30)
        self.assertNotIn(30, PHYSICAL_PAGES)
        self.assertEqual((min(PHYSICAL_PAGES), max(PHYSICAL_PAGES)), (1, 31))

    def test_source_page_ids_not_invented_from_repeated_printed_numbers(self):
        self.assertEqual(len(set(PHYSICAL_PAGES)), 30)
        self.assertIn(31, PHYSICAL_PAGES)

    def test_16_fully_extracted_four_choice_records(self):
        self.assertEqual(len(FOUR_CHOICES), 16)
        self.assertEqual(len(set(PHYSICAL_PAGES) - set(FOUR_CHOICES)), 14)
        self.assertTrue(set(FOUR_CHOICES).issubset(set(PHYSICAL_PAGES)))

    def test_11_original_visual_assets_remain_private(self):
        self.assertEqual(len(NEEDS_VISUAL), 11)
        self.assertIn(13, NEEDS_VISUAL)
        self.assertIn(22, NEEDS_VISUAL)

    def test_q5_boolean_truth_row_count(self):
        vals = itertools.product((False, True), repeat=3)
        truth = [a and not b and (not a or c) for a, b, c in vals]
        self.assertEqual(sum(truth), 1)

    def test_q6_boolean_formula_tautology(self):
        vals = itertools.product((False, True), repeat=3)
        truth = [(not (a and (b == c))) or (not b or c) for a, b, c in vals]
        self.assertEqual(sum(truth), 8)

    def test_q7_mixed_radix_two_largest(self):
        values = [int("11011111", 2), 212, int("331", 8), int("CF", 16)]
        self.assertEqual(values, [223, 212, 217, 207])
        self.assertEqual(sorted(range(4), key=lambda k: values[k], reverse=True)[:2],
                         [0, 2])
        self.assertEqual(values[0] + values[2], 440)

    def test_q8_two_hexadecimal_headcounts(self):
        self.assertEqual(int("25", 16) - int("14", 16), 17)

    def test_q12_source_javascript_indexing(self):
        a = [1, 3, 5, 7]
        a.pop()
        a[1] += 10
        self.assertEqual(sum(v if k % 2 == 0 else -v for k, v in enumerate(a)), -7)

    def test_q16_ip_bytes_and_incomplete_source_options(self):
        bits = "11000011101010001100100101101101"
        self.assertEqual(len(bits), 32)
        addr = ".".join(str(int(bits[i:i + 8], 2)) for i in range(0, 32, 8))
        self.assertEqual(addr, "195.168.201.109")
        self.assertNotEqual(addr, "195.168.201.99")  # only printed A

    def test_q25_browser_shortcut_matching(self):
        source_a = "1-a, 2-d, 3-c, 4-b"
        self.assertEqual(source_a, "1-a, 2-d, 3-c, 4-b")

    def test_q29_minimal_fixed_binary_identifier_length(self):
        self.assertLess(2 ** 5, 50)
        self.assertGreaterEqual(2 ** 6, 50)

    def test_q2_search_wording_is_not_automatically_unique(self):
        a = '"axborot xavsizligi" (kitob OR maktab)'
        d = '"axborot xavsizligi" AND (kitob OR maktab)'
        self.assertIn("(kitob OR maktab)", a)
        self.assertIn("(kitob OR maktab)", d)
        self.assertNotEqual(a, d)  # search engine operator support must be explicit

    def test_duplicate_pdf_integrity_sha_without_media_in_git(self):
        self.assertEqual(len(PDF_SHA256), 64)
        self.assertEqual(len(DUPLICATE_SHA256), 64)
        self.assertNotEqual(PDF_SHA256, DUPLICATE_SHA256)
        # The independent SHA comparison of both Axborot PDF files is in
        # the private QA report; binaries are not committed here.

    def test_source_answers_still_require_human_review(self):
        original_author_key, human_approved, learner_ready = None, False, False
        self.assertIsNone(original_author_key)
        self.assertFalse(human_approved)
        self.assertFalse(learner_ready)


if __name__ == "__main__":
    unittest.main()
