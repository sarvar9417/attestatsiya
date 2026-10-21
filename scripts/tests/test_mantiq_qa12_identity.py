import itertools
import unittest


def equiv(a,b): return a==b


class LogicQA12(unittest.TestCase):
    def test_source_page_16_identity(self):
        for a in (False,True):
            self.assertEqual(a and True,a)

    def test_source_question_59_two_valid_choices(self):
        for a,b in itertools.product((False,True),repeat=2):
            original=equiv(not a,b)
            option_a=(not a and b) or (a and not b)
            option_c=not equiv(a,b)
            self.assertEqual(original,option_a)
            self.assertEqual(original,option_c)

    def test_question_60_source_A_all_sixteen_rows(self):
        for a,b,c,d in itertools.product((False,True),repeat=4):
            original=not (a and b) or c or not d
            option_a=not (a and b) or (c or not d)
            self.assertEqual(original,option_a)

if __name__=='__main__': unittest.main()
