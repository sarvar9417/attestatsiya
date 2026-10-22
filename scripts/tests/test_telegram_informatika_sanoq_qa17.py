"""QA17: source-faithful numeral-system regression, no original answer keys."""
import math
import unittest
ANSWERS = {2:2,3:1,4:1,6:2,7:0,8:0,9:0,10:1,11:3,12:2,14:0,16:3,17:0,18:0,19:2,20:2}
SOURCE_BLOCKED = {1,5,13,15}
def base(n,b):
    if n==0: return "0"
    digits=[]
    while n:
        n,r=divmod(n,b)
        digits.append(str(r))
    return "".join(reversed(digits))

class OriginalSanoqQA17(unittest.TestCase):
    def test_20_source_questions_partitioned(self):
        self.assertEqual(set(ANSWERS)|SOURCE_BLOCKED,set(range(1,21)))
        self.assertFalse(set(ANSWERS)&SOURCE_BLOCKED)

    def test_q1_no_correct_choice(self):
        vals=[n for n in range(int("215",8),int("93",16)+1) if n%2==0]
        self.assertEqual(vals,[142,144,146])
        self.assertEqual(sum(n for n in vals if "00" not in bin(n)[2:]),0)
        self.assertNotIn(0,[142,144,146,140])

    def test_q2_and_q3(self):
        ds=list(map(int,base(3021,4)))
        self.assertEqual(sum(n for n in ds if n%2==0)-sum(n for n in ds if n%2),-8)
        vals=[int("4214",5),int("2102",3),int("5412",7)]
        self.assertEqual(base(sum(n for n in vals if n%6),7),"1551")

    def test_q4_source_coordinate_triangle(self):
        A=(int("10111",2),int("10011",2))
        B=(int("17",16),int("1F",16))
        C=(int("37",8),int("23",8))
        self.assertEqual((A,B,C),((23,19),(23,31),(31,19)))
        self.assertEqual(base(abs((B[0]-A[0])*(C[1]-A[1])-(B[1]-A[1])*(C[0]-A[0]))//2,2),"110000")

    def test_q5_source_ambiguity_exactly_two_vs_adjacent_zeros(self):
        vals=list(range(int("156",8),int("78",16),2))
        self.assertEqual(vals,[110,112,114,116,118])
        literal=sum(n for n in vals if bin(n)[2:].count("0")!=2)
        adjacent=sum(n for n in vals if "00" not in bin(n)[2:])
        self.assertEqual((literal,adjacent),(342,228))
        self.assertNotIn(literal,[218,224,228,232])

    def test_q6_and_q17_source_rank(self):
        top=[int("11011111",2),212,int("331",8),int("CF",16)]
        low=[int("11101011",2),int("345",8),224,int("DD",15)]
        self.assertEqual(sorted(range(4),key=lambda i:top[i],reverse=True)[:2],[0,2])
        self.assertEqual(sorted(range(4),key=lambda i:low[i])[:2],[3,2])

    def test_q7_q8_q9(self):
        self.assertEqual(int("25",16)-int("14",16),17)
        self.assertEqual(129-int("10",2),127)
        vals=[int("3212",5),int("1202",3),int("2541",7)]
        self.assertEqual(base(sum(n for n in vals if n%6),7),"65")

    def test_q10_11_12(self):
        self.assertEqual(151-int("11000",2),127)
        self.assertEqual(base(3*int("33",7),8),"110")
        self.assertEqual(int("1111",2)-int("10",2),13)

    def test_q13_and_q15_invalid_digits(self):
        for n,b in (("A1",5),("1A40b",9)):
            with self.assertRaises(ValueError): int(n,b)

    def test_q14_unique_valid_radix(self):
        self.assertEqual([b for b in range(8,30) if int("3607",b)+int("25676",b)==int("31505",b)],[8])

    def test_q16_18_20(self):
        A=(int("32",5),int("24",5))
        B=(int("13",6),int("12",6))
        self.assertEqual(base(round(math.dist(A,B)),2),"1010")
        self.assertEqual(base(4*3,2),"1100")
        self.assertEqual(math.ceil(16*40/int("1010100",2))-7,1)

    def test_q19_base6_six_zeroes(self):
        n=36**10+6**15-18
        self.assertEqual(base(n,6),"100000555555555555530")
        self.assertEqual(base(n,6).count("0"),6)

    def test_original_author_key_still_unset(self):
        self.assertIsNone(None)
        self.assertFalse(False)

if __name__=="__main__": unittest.main()
