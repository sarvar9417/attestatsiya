"""QA19: source-grounded spreadsheet and Photoshop original figure tests.

Expert proposals only, not original author keys or learner publication.
"""
import unittest


class InformatikaSourceQA19(unittest.TestCase):
    def test_excel_pie_chart_c1_q7(self):
        a1,b1=2,4
        a2=(b1-a1)/2
        b2=2-a1/2
        expected_c2=2*a2  # 50 percent pie versus 25 percent A2
        matches=[c1 for c1 in range(-100,101)
                 if (c1-a1)*2-4==expected_c2]
        self.assertEqual((a2,b2,expected_c2), (1,1,2))
        self.assertEqual(matches,[5])

    def test_excel_original_four_choices(self):
        choices=[7,5,6,9]
        self.assertEqual([i for i,x in enumerate(choices) if x==5],[1])

    def test_photoshop_original_assertions_q15(self):
        # Source: F7 layers visible; Shift+N NOT the usual new-layer
        # shortcut; eye toggles visibility; Opacity adjusts transparency.
        original_values=(True,False,True,True)
        original_options=[
            (True,False,True,True),
            (False,False,True,True),
            (True,False,False,True),
            (True,False,True,False),
        ]
        self.assertEqual([i for i,x in enumerate(original_options)
                          if x==original_values],[0])

    def test_original_source_must_remain_unpublished(self):
        cases={7:{"format":"text_only","key":None,"approved":False},
               15:{"format":"text_only","key":None,"approved":False}}
        self.assertTrue(all(x["format"]=="text_only" for x in cases.values()))
        self.assertTrue(all(x["key"] is None and not x["approved"]
                            for x in cases.values()))


if __name__=="__main__": unittest.main()
