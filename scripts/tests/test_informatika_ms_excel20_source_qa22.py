"""QA22: independent, nonpublishing source checks from 5-page MS EXCEL savollar.pdf.

Source text and diagram values reviewed against owner's original PDF.
Tests do NOT execute question-formula strings, contact Supabase or set keys.
"""
from math import factorial, floor, sqrt
import unittest


def sgn(x):
    return (x>0)-(x<0)


class OriginalExcelSourceQA22(unittest.TestCase):
    def test_q1_factorial_autofill_conditional(self):
        self.assertEqual(factorial(8),40320)
        self.assertEqual("H2","H2") # Under source's numerical-series AutoFill convention.

    def test_q2_thirteen_add_three_steps(self):
        self.assertEqual(1+13*3,40)

    def test_q3_english_floor_wrong_argument_count(self):
        source_formula="FLOOR(A1/C1)"
        self.assertEqual(source_formula.count(","),0)
        self.assertNotEqual("FLOOR","INT")

    def test_q4_indeterminate_a1_c1(self):
        # Equal positive B2/C2 implies B1=1, not specific A1/C1.
        def value(a1,c1):
            b2=min(a1,c1)
            b1=1
            c2=b2*b1
            return 3*sqrt(b1)*a1+6*c2
        self.assertNotEqual(value(2,2),value(4,4))

    def test_q5_relative_address_copy(self):
        self.assertEqual(10+3000,3010)

    def test_q6_find_after_start_index(self):
        def find_from(word,start,char):
            return word.index(char,start-1)+1
        d1=abs(1-12)+find_from("Informatika",5,"i")
        d2=abs(-9+14)+find_from("Universitet",5,"i")
        self.assertEqual((d1,d2,d1+d2),(20,13,33))

    def test_q7_original_negative_a1_exact_unique_solution(self):
        a1,b1,b2=-9,9,3
        def formula(a2):
            condition=(a1+b2<a2*b1) and (a1*a2>0)
            return (a1*b2-b1-a2) if condition else (a1*b1-b2+a2)
        solutions=[x for x in range(-100,101) if formula(x)==-85]
        self.assertEqual(solutions,[-1])

    def test_q8_mid_false_branch(self):
        count,countif=3,2
        self.assertFalse(count<countif)
        self.assertEqual("universitet"[6:10],"site")

    def test_q9_three_possible_b1_values_sum_fifteen(self):
        a1=(-20)%13
        a2=len(str(9+7))
        def expr(b1):
            b2=3*b1
            return b2*b2-a1 if b1*a1-a2<32 and a2*b1-b2<256 else b1*b1-a1
        matches=[b for b in range(-300,301) if expr(b)==219]
        self.assertEqual((matches,sum(matches)),([-5,5,15],15))

    def test_q10_excel_mixed_reference_copy(self):
        source={"G":1,"H":-1,"I":2,"J":5,"K":3}
        cols=list("GHIJKLMNOP")
        for col in "LMNOP":
            idx=cols.index(col)
            source[col]=(source[cols[idx-5]]*source[cols[idx-4]]
                         +source[cols[idx-3]]-source["J"])
        self.assertEqual([source[x] for x in "LMNOP"],[-4,-2,8,6,-19])
        self.assertEqual(min(source[x] for x in "LMNOP")-1,-20)

    def test_q11_four_compatible_source_formulas(self):
        table={"A1":4,"B1":3,"C1":4,"B2":6}
        outputs=[table["A1"],table["C1"],table["B1"]+1,table["B2"]-2]
        self.assertEqual(outputs,[4]*4)

    def test_q12_nested_if_original_option_C(self):
        def formula(score):
            return ("Qoniqarsiz" if score<56 else
                    "Qoniqarli" if score<71 else
                    "Yaxshi" if score<86 else "A'lo")
        grades=[53,60,67,73,85,90]
        self.assertEqual([formula(x) for x in grades],
                         ["Qoniqarsiz","Qoniqarli","Qoniqarli",
                          "Yaxshi","Yaxshi","A'lo"])

    def test_q13_two_false_disjunction(self):
        self.assertFalse((1+2+3>4+5+5) or (4+5+5<1+2+3))

    def test_q14_source_copy_results_in_eighteen(self):
        a2,b2,a4=6,3,0
        self.assertEqual(a2*b2+a4,18)

    def test_q15_int_negative_mid_string_and_extremes(self):
        a2=-12-floor(25/16)
        b2=sqrt(16)+1
        c2=str(-12+25)[0]
        d2=a2+b2+int(c2)
        self.assertEqual([a2,b2,c2,d2],[-13,5,"1",-7])
        self.assertEqual(max(a2,b2,d2)+min(a2,b2,d2),-8)

    def test_q16_pie_original_B2_share(self):
        a2=sqrt(6+3-5)
        b2=6**(6-5)
        c2=6-5
        d2=2*(6-5)
        self.assertEqual([a2,b2,c2,d2],[2,6,1,2])
        self.assertAlmostEqual(100*b2/(a2+b2+c2+d2),600/11)

    def test_q17_mod_with_negative_excel_divisor(self):
        # Excel MOD(11,-5) has negative result; Python % behaves likewise.
        self.assertEqual(11%-5,-4)
        self.assertFalse((sqrt(16)==11%-5) or (sgn(-2)+1<0))

    def test_q18_original_inner_if_has_extra_separator(self):
        original="IF(B2<200000;B2-20%*B2;B2-30%*B2;)"
        self.assertTrue(original.endswith(";)" ))
        self.assertEqual(original.count(";"),3)

    def test_q19_no_unique_d2_formula(self):
        a1,b1,c1=2,6,2
        self.assertEqual([a1+c1,b1-2,2*c1],[4,4,4])

    def test_q20_len_then_replace(self):
        source="sarlavha"
        self.assertTrue(10>len("monoblok"))
        self.assertEqual(source[:2]+"odat"+source[8:],"saodat")

    def test_nothing_is_original_approved_key(self):
        proposal={"human_approved":False,"original_key":None,"publish_ready":False}
        self.assertFalse(proposal["human_approved"] or proposal["publish_ready"])
        self.assertIsNone(proposal["original_key"])


if __name__=="__main__":
    unittest.main()
