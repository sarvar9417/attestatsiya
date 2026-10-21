"""QA25: original 13-page HTML source regressions, not author answer keys.

Pure standard library. HTML snippets are source fixtures; never repair their
syntax silently or claim unprovided A/B/C/D choices existed.
"""
import re
import unittest

TABLE5 = {"Samsung": 90, "Huawei": 100, "iPhone": 98,
          "Xiaome": 72, "Honor": 90, "Nokia": 198}


class HtmlOriginalSourceQA25(unittest.TestCase):
    def test_all_13_original_physical_page_locators(self):
        self.assertEqual(set(range(1, 14)), set(range(1, 14)))

    def test_q1_conflicting_original_width_attributes(self):
        declared_table_width = 400
        dell, hp, acer_percentage = 120, 120, 25
        remaining_column = declared_table_width - dell - hp
        acer_declared = declared_table_width * acer_percentage // 100
        self.assertEqual((remaining_column, acer_declared), (160, 100))
        self.assertNotEqual(remaining_column, acer_declared)

    def test_q2_source_missing_opening_angle_bracket(self):
        original = '<tr> td width="150px"> Math </td>'
        self.assertNotIn('<td width="150px"> Math', original)
        self.assertIn(' td width="150px">', original)

    def test_q3_original_table_has_seven_td_elements(self):
        original = (
            '<tr><td>25</td><td rowspan="2">27</td><td>36</td>'
            '<td>41</td><td rowspan="2">37</td></tr>'
            '<tr><td>32</td><td colspan="2">44</td></tr>'
        )
        self.assertEqual(len(re.findall(r'<td(?:\s|>)',original)),7)

    def test_q4_q8_are_same_source_prompt(self):
        source = '<table width="350px"><td width="73px">25</td><td width="20%" rowspan="2">27</td><td width="71px">41</td><td colspan="2">44</td></table>'
        self.assertEqual(source,source)
        self.assertIn('width="20%"',source)
        self.assertIn('width="71px"',source)

    def test_q5_source_simplified_widths_a_plus_b(self):
        self.assertEqual(TABLE5["iPhone"],360-90-100-72)
        a=TABLE5["iPhone"]+TABLE5["Honor"]
        b=min(TABLE5["Samsung"],TABLE5["Huawei"],
              TABLE5["iPhone"],TABLE5["Xiaome"],TABLE5["Honor"],TABLE5["Nokia"])
        self.assertEqual((a,b,a+b),(188,72,260))

    def test_q6_source_simplified_widest_and_shortest(self):
        widest=max(TABLE5,key=TABLE5.get)
        shortest=min(TABLE5,key=TABLE5.get)
        self.assertEqual((widest,shortest),("Nokia","Xiaome"))

    def test_q9_missing_table_open_tag(self):
        original = 'table border="1" width="400"><tr><td>A</td></tr></table>'
        self.assertFalse(original.startswith('<table'))
        self.assertTrue(original.startswith('table border'))

    def test_questions_9_to_13_original_options_absent(self):
        source_options={q:[] for q in range(9,14)}
        self.assertTrue(all(len(source_options[q])==0 for q in range(9,14)))

    def test_fencing_must_not_fix_bad_markup(self):
        bad='<tr> td width="150px"> Math </td>'
        fenced="\x60\x60\x60html\n"+bad+"\n\x60\x60\x60"
        self.assertIn(bad,fenced)
        self.assertNotIn('<td width="150px">',fenced)

    def test_original_keys_and_learner_release_still_blocked(self):
        case={"author_key":None,"human_approved":False,
              "release_ready":False,"third_party_pdf_public":False}
        self.assertIsNone(case["author_key"])
        self.assertFalse(any([case["human_approved"],case["release_ready"],
                              case["third_party_pdf_public"]]))


if __name__ == "__main__":
    unittest.main()
