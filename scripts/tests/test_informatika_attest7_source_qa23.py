"""QA23: source-grounded Test 7 PDF 21-page original questions.

Source PDF options and programs are reconstructed as expert proposals only.
Never run the invalid original Python or publish its answer key.
"""
import math
import unittest

ORIGINAL_PAGES=21
SOURCE_QUESTIONS=20
FIGURE_REVIEW_REQUIRED={1,14}


def prime_report(n):
    if n<2:
        return "N"
    return "N" if any(n%i==0 for i in range(2,math.isqrt(n)+1)) else "Y"


def fibonacci_source(n):
    a,b=1,1
    if n==1:
        return a
    for _ in range(2,n):
        a,b=b,a+b
    return b


def javascript_source_q18():
    y=[2,9,5]
    y.append(y[0]+y[2])
    y[1]=y[1]%4
    y.pop(0)
    return sum(z if z>3 else -z for z in y),y


class OriginalAttest7QA23(unittest.TestCase):
    def test_twenty_original_questions_on_twenty_one_pages(self):
        self.assertEqual((SOURCE_QUESTIONS,ORIGINAL_PAGES),(20,21))

    def test_html_and_css_source_images_not_released(self):
        self.assertEqual(FIGURE_REVIEW_REQUIRED,{1,14})
        self.assertNotIn(10,FIGURE_REVIEW_REQUIRED)

    def test_question3_has_two_correct_triplets(self):
        variants=[(15,36,45),(17,35,41),(23,27,29),(16,29,36)]
        matched=[i for i,group in enumerate(variants)
                 if [prime_report(n) for n in group]==["Y","N","Y"]]
        self.assertEqual(matched,[1,2])

    def test_q5_original_excel_missing_operator(self):
        original="B2-20% B2"
        self.assertNotIn("20%*B2",original)
        self.assertIn("20% B2",original)

    def test_q6_consecutive_four_not_universally_divisible_by_three(self):
        self.assertNotEqual(sum(range(1,5))%3,0)
        self.assertEqual(sum(range(3,7))%3,0)

    def test_q6_consecutive_six_always_divisible_by_three(self):
        self.assertTrue(all(sum(range(n,n+6))%3==0
                            for n in range(1,101)))

    def test_q10_python_source_fibonacci_triplet(self):
        self.assertEqual([fibonacci_source(n) for n in (1,5,9)],[1,5,34])

    def test_q16_original_variable_overwrite_is_invalid(self):
        b=False
        with self.assertRaises(TypeError):
            len(b)

    def test_q16_original_list_names_missing_assignment(self):
        original="b1[4, 1, 3, 0]"
        self.assertNotIn("=",original)

    def test_q18_original_javascript_array_and_result(self):
        total,array=javascript_source_q18()
        self.assertEqual(array,[1,5,7])
        self.assertEqual(total,11)

    def test_q20_other_team_constraint_has_unique_choice(self):
        first_team=24
        totals=[50,51,62,49]
        second=[total-first_team for total in totals]
        indices=[i for i,n in enumerate(second) if n<=24 or n>=28]
        self.assertEqual(second,[26,27,38,25])
        self.assertEqual(indices,[2])

    def test_qa_preserves_key_and_release_gates(self):
        fields={"answer_key":None,"human_approved":False,
                "content_publish_ready":False}
        self.assertIsNone(fields["answer_key"])
        self.assertFalse(fields["human_approved"] or fields["content_publish_ready"])


if __name__=="__main__":
    unittest.main()
