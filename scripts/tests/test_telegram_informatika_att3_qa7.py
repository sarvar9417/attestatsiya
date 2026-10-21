"""TASK-346 QA7: independently validate ten-source-question derivations without executing question code."""
import ipaddress
import unittest


def decode_prefix(bits: str, mapping: dict[str, str]) -> str:
    if not bits or any(c not in "01" for c in bits):
        raise ValueError("Only bounded binary literal input permitted")
    if len(bits)>512 or any(not code or any(t not in "01" for t in code) for code in mapping):
        raise ValueError("Invalid code alphabet")
    if any(other.startswith(code) for code in mapping for other in mapping if other != code):
        raise ValueError("Codes must be prefix-free")
    position=0
    chars=[]
    while position<len(bits):
        options=[code for code in mapping if bits.startswith(code,position)]
        if len(options)!=1:
            raise ValueError("Decoding is not unique")
        chars.append(mapping[options[0]])
        position+=len(options[0])
    return "".join(chars)


class AttestatsiyaTest3QA7(unittest.TestCase):
    def test_ipv4_mask(self):
        self.assertEqual(str(ipaddress.ip_network("192.168.25.6/22", strict=False).netmask),
                         "255.255.252.0")

    def test_search_sets(self):
        self.assertEqual(330 + 270 - 520, 80)

    def test_machine_all_satisfy_but_minimum_is_unique(self):
        options=(429,247,338,156)
        def machine(x: int) -> str:
            d=[x//100,x//10%10,x%10]
            sums=sorted((d[0]+d[1],d[1]+d[2]),reverse=True)
            return "".join(map(str,sums))
        self.assertEqual([machine(x) for x in options],["116"]*4)
        self.assertEqual(min(options),156)

    def test_unmerged_html_cells(self):
        self.assertEqual((160 + 80 - 160 + 85) * 4, 660)

    def test_pixels_and_average(self):
        self.assertEqual(16000*8//(320*400),1)
        self.assertEqual(2**1,2)
        self.assertEqual(400//8-2,48)

    def test_scratch_age_and_js_operations(self):
        age=11
        self.assertTrue(age>8 and age<17)
        a,b=25,15
        a-=1
        a+=b
        a-=1
        self.assertEqual(a,38)

    def test_prefix_code_is_unambiguous(self):
        mapping={"00":"A","01":"B","1011":"C","1100":"D","1101":"E","1110":"F","1111":"G"}
        bits="10111111110011111110001101"
        self.assertEqual(decode_prefix(bits,mapping),"CGDGFAE")
        with self.assertRaises(ValueError):
            decode_prefix("101111112",mapping)
        with self.assertRaises(ValueError):
            decode_prefix("1011",{"1":"X","10":"Y"})

    def test_labyrinth_needs_a_start_cell_and_original_figure(self):
        # No single numeric answer: source doesn't identify robot's initial square.
        # This is a release gate, not a guessed answer.
        source_start_square=None
        self.assertIsNone(source_start_square)


if __name__ == "__main__":
    unittest.main()
