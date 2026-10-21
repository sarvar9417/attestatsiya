"""Original physical PDF page 10: reconstructed even-sum flowchart."""
import unittest


class SourceFlowchartQA18(unittest.TestCase):
    def test_q10_iterative_source_algorithm(self):
        n = 15
        i, s = 2, 0
        values = []
        while i <= n:
            values.append(i)
            s += i
            i += 2
        self.assertEqual(values,[2,4,6,8,10,12,14])
        self.assertEqual(s,56)

    def test_q10_original_choice_C(self):
        source_options=[0,42,56,72]
        self.assertEqual([i for i,value in enumerate(source_options) if value==sum(range(2,16,2))],[2])

    def test_q10_figure_transcribed_but_not_publishable(self):
        reviewed={"figure_required":False,"human_approved":False,"publish_ready":False}
        self.assertFalse(any(reviewed.values()))


if __name__=="__main__":
    unittest.main()
