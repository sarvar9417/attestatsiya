"""QA24: owner-PDF source arithmetic and unit ambiguity regressions.

Original three-page test remains private, with no promoted author answer keys.
"""
from fractions import Fraction
from math import ceil, hypot, lcm, log2
import unittest


class OtganSourceQA24(unittest.TestCase):
    def test_q1_unique_letters_and_R_code(self):
        alphabet=sorted(set("CHEVROLET"))
        self.assertEqual(alphabet,list("CEHLORTV"))
        self.assertEqual(format(alphabet.index("R"),"03b"),"101")

    def test_q2_mixed_base_pythagorean_distance(self):
        a=(int("46",8),int("44",8))
        b=(int("22",12),int("27",12))
        self.assertEqual((a,b),((38,36),(26,31)))
        self.assertEqual(hypot(a[0]-b[0],a[1]-b[1]),13)
        self.assertEqual(2*5+3,13)

    def test_q4_triple_in_octal(self):
        self.assertEqual(int("33",7)*3,72)
        self.assertEqual(oct(72),"0o110")

    def test_q5_binary_unused_codes(self):
        self.assertEqual(2**10-999,25)
        self.assertLess(2**9,999)

    def test_q6_least_common_multiple_of_base_radices(self):
        self.assertEqual(lcm(8,9,13),936)

    def test_q7_raw_image_bit_ratio(self):
        self.assertEqual(2**20,1048576)
        self.assertEqual(2**15,32768)
        self.assertEqual(20/(20-15),4)

    def test_q8_three_state_lights(self):
        self.assertLess(3**5,575)
        self.assertGreaterEqual(3**6,575)

    def test_q9_unknown_base(self):
        self.assertEqual(16+8,24)

    def test_q10_binary_age_difference(self):
        self.assertEqual(int("1111",2)-int("10",2),13)

    def test_q11_human_software_hardware_triad(self):
        self.assertEqual(set(("Software","Hardware","Brainware")),
                         {"Brainware","Hardware","Software"})

    def test_q12_mixed_base_fraction(self):
        whole=4*25+2*5+1
        fraction=Fraction(2,5)+Fraction(3,25)+Fraction(2,125)
        self.assertEqual(whole,111)
        self.assertEqual(fraction,Fraction(67,125))
        self.assertAlmostEqual(whole+float(fraction),111.536)

    def test_q13_missing_base5_sequence(self):
        missing=list(range(int("21",5),int("43",5)+1))
        self.assertEqual(len(missing),13)

    def test_q14_minimal_bits_for_101_humidity_values(self):
        self.assertEqual(ceil(log2(101)),7)
        self.assertEqual(7*80,560)

    def test_q3_encoding_not_given_by_source(self):
        # Same source letters may use different byte lengths by encoding.
        self.assertNotEqual(len("o‘".encode("utf-8")),len("o‘".encode("utf-16-le")))

    def test_q15_one_character_byte_is_only_an_assumption(self):
        count=160*6*240
        self.assertEqual(count,230400)
        self.assertEqual(count/1024,225)
        self.assertNotEqual(count/1000,count/1024)

    def test_duplicate_source_review_flag_is_not_author_approval(self):
        source={"original_key":None,"duplicate_review_required":True,
                "human_approved":False,"learner_ready":False}
        self.assertTrue(source["duplicate_review_required"])
        self.assertFalse(source["human_approved"] or source["learner_ready"])


if __name__=="__main__":
    unittest.main()
