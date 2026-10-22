"""TASK-346 QA33: independent calculations from six Access PDF source figures.

No original screenshot, author answer keys, media or learner data.
"""
import unittest

FRUITS = [
    (1, "Shaftoli", 25, 12000, "Uzbekistan"),
    (2, "Banan", 20, 22000, "Hindiston"),
    (3, "Kivi", 15, 28000, "Eron"),
    (4, "Mandarin", 18, 24000, "Tojikiston"),
    (5, "Mango", 22, 30000, "Braziliya"),
]

MARKET = [
    ("Apple", 47, 14000, 724000, "Uzbekistan"),
    ("Carrot", 28, 12000, 246000, "Russia"),
    ("Lemon", 49, 27000, 1245000, "Turkiye"),
    ("Pineapple", 36, 87000, 982000, "Columbia"),
    ("Orange", 21, 33000, 504000, "China"),
    ("Tomato", 57, 15000, 648000, "Uzbekistan"),
]


class AccessOriginalVisualQA33(unittest.TestCase):
    def test_question_7_and_criteria_same_row(self):
        ids = [id for id, name, kg, price, country in FRUITS
               if kg >= 18 and "a" in country.lower()]
        self.assertEqual(ids, [1, 5])

    def test_question_7_matching_rows_not_corrupted_screenshot(self):
        selected = [r for r in FRUITS if r[2] >= 18 and "a" in r[4].lower()]
        self.assertEqual([r[2] for r in selected], [25, 22])

    def test_question_8_not_like_a_then_o_pattern(self):
        chosen = [r for r in FRUITS if r[3] > 15000 and not (
            "a" in r[1].lower() and "o" in r[1].lower().split("a", 1)[1])]
        self.assertEqual([r[1] for r in chosen], ["Banan", "Kivi", "Mandarin"])

    def test_question_8_show_only_id_name_price(self):
        chosen = [(r[0], r[1], r[3]) for r in FRUITS if r[3] > 15000 and not (
            "a" in r[1].lower() and "o" in r[1].lower().split("a", 1)[1])]
        self.assertEqual(chosen, [(2, "Banan", 22000), (3, "Kivi", 28000),
                                  (4, "Mandarin", 24000)])

    def test_question_12_cost_and_region_like_u(self):
        chosen = [r[0] for r in MARKET if r[3] < 1000000 and "u" in r[4].lower()]
        self.assertEqual(chosen, ["Apple", "Carrot", "Pineapple", "Tomato"])

    def test_question_13_exact_three_column_projection(self):
        chosen = [(name, price, region) for name, unit, price, cost, region in MARKET
                  if price < 18000 and "l" in name.lower() and
                  "e" in name.lower().split("l", 1)[1]]
        self.assertEqual(chosen, [("Apple", 14000, "Uzbekistan")])

    def test_question_14_male_grandfather_id(self):
        parents = {53: [14, 71], 14: [34, 78]}
        gender = {14: "A", 71: "E", 34: "E", 78: "A"}
        grandfathers = [g for p in parents[53] for g in parents.get(p, [])
                        if gender[g] == "E"]
        self.assertEqual(grandfathers, [34])

    def test_question_15_conditional_maternal_aunt_not_author_key(self):
        parents = {1974: [1588], 1588: [1616, 2349],
                   2911: [1616, 2349], 2593: [1616, 2349]}
        gender = {1588: "A", 2911: "A", 2593: "E"}
        mother = next(x for x in parents[1974] if gender[x] == "A")
        aunt = [person for person in (2911, 2593) if gender[person] == "A"
                and set(parents[person]) == set(parents[mother])]
        self.assertEqual(aunt, [2911])
        self.assertFalse(False)  # independent proposal is not editorial approval


if __name__ == "__main__":
    unittest.main()
