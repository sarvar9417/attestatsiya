"""QA18 source-grounded checks for visual questions, Test 13 source PDF.

These verify independent observations, not official author keys.
"""
import unittest

BOOKS = [
    ("O'tkan kunlar", 2020, 220, "Roman"),
    ("Informatika", 2021, 368, "Darslik"),
    ("Shum bola", 2005, 192, "Qissa"),
    ("Oltin zanglamas", 2013, 540, "Roman"),
    ("Molxona", 2024, 102, "Qissa"),
]


class VisualSourceQA18(unittest.TestCase):
    def test_q2_source_or_condition_matches_all_five(self):
        included=[book for book in BOOKS if "i" in book[3].lower() or book[2]>150]
        self.assertEqual(len(included),5)

    def test_q2_publication_year_sort(self):
        result=sorted(BOOKS,key=lambda book:book[1])
        self.assertEqual([b[0] for b in result],
                         ["Shum bola","Oltin zanglamas","O'tkan kunlar",
                          "Informatika","Molxona"])

    def test_q3_header_and_cell_spacing(self):
        source='<table border="1" cellpadding="5" cellspacing="2"><tr><th>Name</th><th>City</th><th>Score</th></tr></table>'
        self.assertEqual(source.count("<th>"),3)
        self.assertIn('cellspacing="2"',source)
        self.assertIn('cellpadding="5"',source)

    def test_q3_source_cell_merges(self):
        source='<td rowspan="2">Tashkent</td><td colspan="2">Total</td>'
        self.assertIn('rowspan="2"',source)
        self.assertIn('colspan="2"',source)

    def test_q19_id_selector_wins_over_class(self):
        self.assertGreater((1,0,0),(0,1,0))
        self.assertGreater((0,1,0),(0,0,1))
        self.assertEqual({"#b":"green",".a":"blue","p":"gray"}["#b"],"green")
        self.assertEqual({"#b":"pink"}["#b"],"pink")

    def test_q19_image_centre_assumption(self):
        self.assertIn("margin: 0 auto","img {display: block; margin: 0 auto;}")
        self.assertIn("display: block","img {display: block; margin: 0 auto;}")

    def test_q17_original_after_each_is_not_between_each(self):
        strokes=4+6+5 # original segmented symbols C,0,2
        between=(strokes+2*2)/12
        after_each=(strokes+2*3)/12
        self.assertNotEqual(between,after_each)
        self.assertEqual(after_each,1.75)
        self.assertLess(between,1.6)

    def test_original_figure_release_gates_not_removed(self):
        metadata={2:("text_only",False),3:("text_plus_figure",False),
                  17:("text_plus_figure",False),19:("text_plus_figure",False)}
        self.assertEqual(metadata[2][0],"text_only")
        self.assertTrue(all(not publish for _,publish in metadata.values()))
        self.assertEqual(metadata[3][0],metadata[19][0])


if __name__=="__main__":
    unittest.main()
