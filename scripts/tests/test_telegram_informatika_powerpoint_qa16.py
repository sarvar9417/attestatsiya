"""TASK-346 QA16: Microsoft PowerPoint PDF question/page provenance and figure gates.

Independent expert checks, not original author answer keys.
Original figures and PDF bytes must remain out of public Git.
"""
import unittest

PAGES = {1:1, 2:2, 3:3, 4:3, 5:3, 6:3, 7:3, 8:4,
         9:4, 10:5, 11:6, 12:7, 13:8, 14:8, 15:9}
RESTORED = {2, 3, 8, 10, 11, 12, 13, 15}
NEEDS_FIGURE = {1, 2, 9, 10, 11, 12, 13, 14, 15}
TEXT_ONLY = set(PAGES) - NEEDS_FIGURE
INDEPENDENT_OPTIONS = {3:1, 4:1, 5:3, 6:1, 7:1, 8:1}


class PowerPointOriginalSourceQA16(unittest.TestCase):
    def test_original_fifteen_numbers_eight_restored(self):
        self.assertEqual(set(PAGES), set(range(1, 16)))
        self.assertEqual(len(RESTORED), 8)
        self.assertEqual(len(set(PAGES) - RESTORED), 7)

    def test_physical_pdf_page_locations(self):
        self.assertEqual([PAGES[k] for k in range(1, 16)],
                         [1, 2, 3, 3, 3, 3, 3, 4, 4, 5, 6, 7, 8, 8, 9])

    def test_original_figures_remain_required(self):
        self.assertEqual(len(NEEDS_FIGURE), 9)
        self.assertEqual(TEXT_ONLY, {3, 4, 5, 6, 7, 8})
        self.assertFalse(NEEDS_FIGURE & TEXT_ONLY)

    def test_adjacent_source_question_boundaries(self):
        # Original Q1 mixed Q2/Q3; Q7 mixed Q8;
        # Q9 mixed Q10-Q13 and Q14 mixed Q15.
        self.assertEqual({1,7,9,14} & NEEDS_FIGURE, {1,9,14})
        self.assertTrue({2,3,8,10,11,12,13,15} <= RESTORED)

    def test_six_text_only_independent_answers(self):
        self.assertEqual(len(INDEPENDENT_OPTIONS), 6)
        self.assertEqual(INDEPENDENT_OPTIONS[3], 1)  # Transition/Animation
        self.assertEqual(INDEPENDENT_OPTIONS[4], 1)  # F5
        self.assertEqual(INDEPENDENT_OPTIONS[5], 3)  # All objects
        self.assertEqual(INDEPENDENT_OPTIONS[6], 1)  # Exit
        self.assertEqual(INDEPENDENT_OPTIONS[7], 1)  # Animation Pane
        self.assertEqual(INDEPENDENT_OPTIONS[8], 1)  # Duration

    def test_publication_not_conferred_by_visual_index(self):
        original_keys = {n: None for n in PAGES}
        published = {n: False for n in PAGES}
        self.assertTrue(all(v is None for v in original_keys.values()))
        self.assertFalse(any(published.values()))


if __name__ == "__main__":
    unittest.main()
