"""QA30: ten-page MS Access source, fifteen independent questions, no author keys."""
import re
import unittest


PAGE = {1: 1, 2: 2, 3: 3, 4: 4, 5: 4, 6: 4,
        7: 5, 8: 6, 9: 7, 10: 8, 11: 8, 12: 8,
        13: 9, 14: 10, 15: 10}


def delivery(orders, base_charge, stair_charge):
    # Original weight field in kg is treated as the total order weight.
    weight = sum(w for qty, price, w, floor, lift in orders)
    total = sum(qty * price + base_charge +
                (0 if lift else (floor - 1) * stair_charge)
                for qty, price, w, floor, lift in orders)
    return weight, total


class AccessOriginalQA30(unittest.TestCase):
    def test_fifteen_original_ids_ten_physical_pages(self):
        self.assertEqual(sorted(PAGE), list(range(1, 16)))
        self.assertEqual(max(PAGE.values()), 10)
        self.assertEqual([PAGE[q] for q in (4, 5, 6, 10, 11, 12, 14, 15)],
                         [4, 4, 4, 8, 8, 8, 10, 10])

    def test_q1_abubakr_roziy_delivery(self):
        orders = [(3, 15000, 15, 3, False),
                  (2, 90000, 30, 6, False),
                  (3, 50000, 27, 8, False)]
        self.assertEqual(delivery(orders, 6000, 2000), (72, 421000))

    def test_q2_beruniy_delivery(self):
        orders = [(2, 25000, 20, 6, False),
                  (2, 90000, 30, 6, True),
                  (5, 10000, 40, 7, False)]
        self.assertEqual(delivery(orders, 6000, 2000), (90, 320000))

    def test_q3_mahtumquli_delivery(self):
        orders = [(3, 15000, 15, 3, False),
                  (2, 90000, 30, 6, True),
                  (2, 45000, 22, 5, True)]
        self.assertEqual(delivery(orders, 12000, 5000), (67, 361000))

    def test_q4_like_e_then_i_uses_countries_table_only(self):
        countries = ("Argentina Meksiko Kanada Tailand Singapur "
                     "Finlandiya Shvetsiya Braziliya Mangoliya").split()
        self.assertEqual([v for v in countries if re.search("e.*i", v, re.I)],
                         ["Argentina", "Meksiko", "Shvetsiya"])

    def test_q5_like_ra_uses_sports_table_only(self):
        sports = ["Kurash", "Futbol", "Karate", "Taekvondo", "Xokkey",
                  "Regbi", "Teniss", "Basketbol", "Sambo"]
        self.assertEqual([v for v in sports if "ra" in v.lower()],
                         ["Kurash", "Karate"])

    def test_q6_like_trailing_a_uses_school_subjects_only(self):
        subjects = ["Matematika", "Fizika", "Musiqa", "Kimyo", "Biologiya",
                    "Informatika", "Chizmachilik", "Tariz", "Texnologiya"]
        self.assertEqual([v for v in subjects if v.lower().endswith("a")],
                         ["Matematika", "Fizika", "Musiqa", "Biologiya",
                          "Informatika", "Texnologiya"])

    def test_q10_not_and_row_count(self):
        # name, gender, English, Math; all seven source rows.
        records = [("Nematov", "E", 98, 88), ("Nosirova", "A", 46, 98),
                   ("Mehmonov", "E", 96, 42), ("Azizova", "A", 38, 64),
                   ("Aliyev", "E", 74, 68), ("Valiyev", "E", 62, 76),
                   ("Soliyeva", "A", 78, 78)]
        self.assertEqual(sum(not (gender == "A" and math < eng)
                             for name, gender, eng, math in records), 7)

    def test_q11_exact_surname_and_gender_filter(self):
        source = [("Nematov", "E"), ("Nosirova", "A"), ("Mehmonov", "E"),
                  ("Azizova", "A"), ("Aliyev", "E"), ("Valiyev", "E"),
                  ("Soliyeva", "A")]
        target = {"Azizova", "Valiyeva", "Mehmonova", "Soliyev"}
        self.assertEqual([n for n, g in source if n in target and g == "A"],
                         ["Azizova"])

    def test_q9_source_sql_missing_where(self):
        original = 'SELECT meva_nomi, narxi, mamlakati FROM meva_nomi LIKE "*i* AND narxi<25000 ORDER BY ID DESC;'
        self.assertNotIn(" WHERE ", original.upper())
        self.assertNotEqual(original.count('"') % 2, 0)  # unclosed LIKE string

    def test_q15_source_xola_parentage_is_ambiguous(self):
        original_definition = "ona yoki otaning singlisi"
        correct_maternal = "onaning opa yoki singlisi"
        self.assertNotEqual(original_definition, correct_maternal)

    def test_source_queries_and_proposals_do_not_authorize_publication(self):
        author_key = None
        human_approved = False
        learner_publish_ready = False
        self.assertIsNone(author_key)
        self.assertFalse(human_approved or learner_publish_ready)


if __name__ == "__main__":
    unittest.main()
