"""QA21: independent source-grounded Excel 35-question review regressions.

Private editorial/math checks only. Never treats expert answers as original keys,
loads source PDF images into public Git or modifies database tables.
"""
import math
import re
import unittest

DEFECTS={1,4,5,6,8,9}
PROPOSALS=set(range(1,36))-DEFECTS
SOURCE_PAGES={**dict.fromkeys(range(1,5),1),
              **dict.fromkeys(range(5,10),2),
              **dict.fromkeys(range(10,15),3),
              **dict.fromkeys(range(15,20),4),
              **dict.fromkeys(range(20,25),5),
              **dict.fromkeys(range(25,29),6),
              **dict.fromkeys(range(29,32),7),
              **dict.fromkeys(range(32,34),8),
              **dict.fromkeys(range(34,36),9)}


def excel_cell_shift(address, dc, dr):
    """Shift one mixed Excel A1 reference without changing its absolutes."""
    match=re.fullmatch(r"(\$?)([A-Z]+)(\$?)([1-9][0-9]*)",address)
    if not match:
        raise ValueError("Only original A1 notation supported")
    fixed_col,col,fixed_row,row=match.groups()
    column_number=0
    for letter in col:
        column_number=column_number*26+ord(letter)-64
    column_number+=0 if fixed_col else dc
    row_number=int(row)+(0 if fixed_row else dr)
    if column_number<1 or row_number<1:
        raise ValueError("Copy would be outside worksheet")
    letters=""
    while column_number:
        column_number,remainder=divmod(column_number-1,26)
        letters=chr(65+remainder)+letters
    return fixed_col+letters+fixed_row+str(row_number)


def shift_formula(formula,dc,dr):
    return re.sub(r"\$?[A-Z]+\$?[1-9][0-9]*",
                  lambda m:excel_cell_shift(m.group(0),dc,dr),
                  formula)


class SourceExcelQA21(unittest.TestCase):
    def test_all_35_source_physical_page_locators(self):
        self.assertEqual(set(SOURCE_PAGES),set(range(1,36)))
        self.assertEqual([sum(p==page for p in SOURCE_PAGES.values())
                          for page in range(1,10)],[4,5,5,5,5,4,3,2,2])

    def test_complete_partition_keeps_original_source_defects_blocked(self):
        self.assertEqual(len(PROPOSALS),29)
        self.assertEqual(PROPOSALS & DEFECTS,set())
        self.assertEqual(PROPOSALS | DEFECTS,set(range(1,36)))

    def test_q1_non_unique(self):
        eligible=[x for x in range(-30,31)
                  if (x/2 if abs(x+6)==4 else -4)==-4]
        self.assertIn(0,eligible)
        self.assertIn(1,eligible)
        self.assertGreater(len(eligible),2)

    def test_q4_no_correct_source_value(self):
        self.assertTrue(all((x/2 if math.floor(x/2)==4.5 else 7)!=4
                            for x in range(-50,51)))

    def test_q5_and_q6_not_unique(self):
        self.assertTrue(all(min(x,2)+1==3 for x in (2,3,4)))
        self.assertTrue(all(max(x,7)-2==5 for x in (0,5,7)))

    def test_q8_q9_no_correct_source_value(self):
        for x in range(-50,51):
            result8=4+x if x>=0 else -1
            result9=(x-2 if x%2==0 and x<8 else 8)
            self.assertNotEqual(result8,3)
            self.assertNotEqual(result9,6)

    def test_q2_q3_q7_q10_solutions(self):
        self.assertEqual(2-3,-1)
        self.assertEqual(4%3,1)
        self.assertEqual(4-3,1)
        self.assertEqual(3**2+7,16)
        self.assertEqual(max(5,12)-min(9,5),7)

    def test_original_formula_cell_references(self):
        source=[
            ("=A$1+$C3*D4",4,4,"=E$1+$C7*H8"),
            ("=$B6-C$2+E5",4,4,"=$B10-G$2+I9"),
            ("=SUM(A$1:B3)+C4",4,4,"=SUM(E$1:F7)+G8"),
            ("=IF($A6>10, C$2, D6)",4,4,"=IF($A10>10, G$2, H10)"),
            ("=AVERAGE(B$1:B4)+$C2",5,4,"=AVERAGE(G$1:G8)+$C6"),
            ("=MAX($A$1, B5, D$3)",4,4,"=MAX($A$1, F9, H$3)"),
            ('=COUNTIF(B$1:B10, ">5")+C3',5,4,'=COUNTIF(G$1:G14, ">5")+H7')
        ]
        for formula,dc,dr,expected in source:
            with self.subTest(formula=formula):
                self.assertEqual(shift_formula(formula,dc,dr),expected)

    def test_source_short_math_q18_to_25(self):
        sign=lambda x:(x>0)-(x<0)
        actual=[
            sign(math.floor(3.75)-5)+abs(-4),
            math.floor(12.8)%5+sign(-10),
            abs(math.floor(-6.9))+sign(0),
            sign(5-math.floor(8.2))+(14%4),
            math.floor(abs(-9.7)/3)+sign(-2),
            abs(sign(-15))+math.floor(4.99),
            20%6+sign(math.floor(-1.2)),
            sign(abs(-3)-5)+math.floor(7.8),
        ]
        self.assertEqual(actual,[3,1,7,1,2,5,1,6])

    def test_original_source_table_copy_q26_to_31(self):
        self.assertEqual(10+3000,3010)
        self.assertEqual(4*2,8)
        self.assertEqual(2+300,302)
        self.assertEqual(5+(6+7),18)
        self.assertEqual(1*5+9,14)
        self.assertEqual(3*60,180)

    def test_original_pie_ratios_q32(self):
        x=5
        a1,c1,d1=7,4,5
        b2=c2=(a1-d1)*(x-3)
        d2=(a1-d1)*c1
        a2=b2+c2+d2
        self.assertEqual((a2,b2,c2,d2),(16,4,4,8))

    def test_original_pie_ratios_q33(self):
        x=9
        a2=(x-3)/6
        b2=(x-2)/7
        c2=10/(x-4)
        self.assertEqual((a2,b2,c2),(1,1,2))

    def test_original_pie_ratios_q34(self):
        x=2
        self.assertEqual((1+6/2,(1+1+6)/4,(x-1)*2),(4,2,2))

    def test_original_pie_ratios_q35(self):
        x=5
        self.assertEqual((15-2*x,x,5*(x-4)),(5,5,5))

    def test_learner_release_requires_human_review(self):
        model={"original_key":None,"human_approved":False,
               "publish_ready":False,"source_figures_public":False}
        self.assertFalse(model["human_approved"] or model["publish_ready"])
        self.assertIsNone(model["original_key"])


if __name__=="__main__":
    unittest.main()
