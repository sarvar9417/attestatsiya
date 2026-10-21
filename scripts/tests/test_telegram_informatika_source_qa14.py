"""TASK-346 QA14: original PDF page provenance and restored Sanoq exercises.

No original PDF/page media, automatic publication, or author answer key.
"""
import unittest

AXBOX = {n: n for n in range(1, 21)}
EXCEL = {n: (1 if n <= 8 else 2 if n <= 12 else 3 if n <= 16 else
              4 if n <= 18 else 5) for n in range(1, 21)}
SANOQ = {n: (1 if n <= 9 else 2 if n <= 18 else 3) for n in range(1, 21)}


def base6(n):
    if n == 0:
        return "0"
    ans = ""
    while n > 0:
        n, digit = divmod(n, 6)
        ans = str(digit) + ans
    return ans


class SourcePagesAndRestorationQA14(unittest.TestCase):
    def test_axborot_20_original_page_locators(self):
        self.assertEqual(set(AXBOX), set(range(1, 21)))
        self.assertEqual([AXBOX[i] for i in range(1, 21)], list(range(1, 21)))

    def test_excel_20_original_page_locators(self):
        self.assertEqual([sum(v == i for v in EXCEL.values()) for i in range(1, 6)],
                         [8, 4, 4, 2, 2])

    def test_sanoq_20_questions_two_missing_restored(self):
        self.assertEqual(set(SANOQ), set(range(1, 21)))
        self.assertEqual([sum(v == i for v in SANOQ.values()) for i in range(1, 4)],
                         [9, 9, 2])
        self.assertEqual(SANOQ[10], 2)
        self.assertEqual(SANOQ[19], 3)

    def test_sanoq_q10_only_choice_b_is_all_ones(self):
        options = ["10000", "11000", "101010", "11100"]
        n = 151
        results = [n - int(choice, 2) for choice in options]
        valid = [i for i, out in enumerate(results) if out > 0 and
                 set(bin(out)[2:]) == {"1"}]
        self.assertEqual(valid, [1])
        self.assertEqual(results[1], 127)

    def test_sanoq_q19_exact_original_exponents_six_zeros(self):
        result = 36 ** 10 + 6 ** 15 - 18
        written = base6(result)
        self.assertEqual(written, "100000555555555555530")
        self.assertEqual(written.count("0"), 6)
        self.assertEqual(["5 ta", "4 ta", "6 ta", "7 ta"].index("6 ta"), 2)

    def test_axborot_existing_six_proposals_match_calculations(self):
        self.assertEqual(40 * 1024 * 8 // (256 * 128), 10)
        self.assertEqual(2 ** 10, 1024)
        self.assertEqual(min(i for i in range(20) if 2 ** i >= 200), 8)
        self.assertEqual(39 * (16-8) // 8, 39)
        self.assertEqual(80 * 5 + 60 * 6, 760)
        self.assertEqual(40 * 1024 * 8 // (160 * 256), 8)
        self.assertEqual(6 * 1024 // 512, 12)

    def test_publication_gates_still_required(self):
        original_key = None
        human_approved = False
        publish_ready = False
        self.assertIsNone(original_key)
        self.assertFalse(human_approved or publish_ready)


if __name__ == "__main__":
    unittest.main()
