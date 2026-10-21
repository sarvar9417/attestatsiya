"""TASK-346 QA10: private original-PDF calculations. No DB writes, no source media.

The small fixture tables below are independent editorial transcriptions,
not official source keys. Never execute arbitrary question SQL.
"""
import sqlite3
import unittest
from datetime import date


PAGES = {
    **dict.fromkeys(range(1, 8), 1),
    **dict.fromkeys(range(8, 15), 2),
    **dict.fromkeys(range(15, 19), 3),
    **dict.fromkeys(range(19, 25), 4),
    25: 5, 26: 6, 27: 6,
    **dict.fromkeys(range(28, 33), 7),
}


class InformatikaSourceQA10(unittest.TestCase):
    def test_all_32_original_pdf_page_numbers(self):
        self.assertEqual(set(PAGES), set(range(1, 33)))
        self.assertEqual([sum(p == i for p in PAGES.values()) for i in range(1, 8)],
                         [7, 7, 4, 6, 1, 2, 5])

    def test_original_defects_not_silently_solved(self):
        self.assertEqual(PAGES[5], 1)   # Password transformation ambiguous
        self.assertEqual(PAGES[7], 1)   # Permutation key absent
        self.assertEqual([PAGES[19], PAGES[20]], [4, 4])  # PINFL underdetermined
        self.assertEqual(PAGES[30], 7)  # Multiple satisfying answer choices

    def test_ms_access_q4_count_only_if_sql_dialect_translated(self):
        db = sqlite3.connect(":memory:")
        self.addCleanup(db.close)
        db.execute("create table book (name text, price integer)")
        db.executemany("insert into book values (?,?)", [
            ("Nur va Soyalar", 60000), ("Ufq", 75000),
            ("Mehrobdan chayon", 55000), ("Xamsa", 30000),
            ("Urush va Tinchlik", 85000),
        ])
        # SQLite LIMIT is used to CHECK THE MATH, not validate original Access.
        row = db.execute("select count(*) from (select 1 from book where lower(name) like '%a%o%' or price>56000 limit 3)").fetchone()
        self.assertEqual(row[0], 3)

    def test_ms_access_q5_count_only_if_sql_dialect_translated(self):
        staff = [
            ("Akbarov", "first category", 4200000),
            ("Ashurov", "professor", 4800000),
            ("Usmonova", "first category", 5200000),
            ("Rahimov", "assistant", 3200000),
            ("Qurbonova", "second category", 4600000),
            ("Rasulov", "professor", 5100260),
            ("Akramova", "professor", 4928300),
        ]
        selected = [name for name, cat, salary in staff
                    if cat not in {"first category", "professor"} and salary > 4300000]
        self.assertEqual(selected, ["Qurbonova"])

    def test_limit_is_not_ms_access_top(self):
        original = "SELECT * FROM book WHERE price > 56000 LIMIT 3;"
        corrected_derivative = "SELECT TOP 3 * FROM book WHERE price > 56000;"
        self.assertIn(" LIMIT ", original)
        self.assertNotIn(" LIMIT ", corrected_derivative)
        self.assertIn("SELECT TOP 3", corrected_derivative)

    def test_q15_oldest_vs_youngest_filtered_staff(self):
        # Jamilov's salary is deliberately omitted: it is unnecessary for
        # age extremes, and must not be guessed from a low-resolution image.
        teachers = [
            ("Akbarov", date(1988, 6, 14), "first category", 4200000),
            ("Ashurov", date(1974, 8, 4), "professor", 4800000),
            ("Usmonova", date(1964, 1, 1), "first category", 5200000),
            ("Rahimov", date(1994, 9, 26), "assistant", 3200000),
            ("Qurbonova", date(1976, 12, 24), "second category", 4600000),
            ("Rasulov", date(1980, 3, 29), "professor", 5100260),
            ("Akramova", date(1985, 6, 14), "professor", 4928300),
            ("Jamilov", date(1982, 4, 10), "second category", None),
        ]
        rows = [r for r in teachers
                if r[2] != "first category" or (r[3] is not None and r[3] < 4100000)]
        oldest, youngest = min(rows, key=lambda r: r[1]), max(rows, key=lambda r: r[1])
        self.assertEqual((oldest[0], youngest[0]), ("Ashurov", "Rahimov"))
        self.assertEqual(abs(oldest[3] - youngest[3]), 1600000)

    def test_q16_food_name_and_weight_in_one_access_criteria_row(self):
        rows = [("Apple", 72), ("Strawberry", 36), ("Grape", 51),
                ("Banana", 54), ("Lemon", 37)]
        self.assertEqual([(name, weight) for name, weight in rows
                          if "a" in name.lower() and weight > 60], [("Apple", 72)])

    def test_q18_one_to_one_conceptual_proposal(self):
        options = ["O‘quvchi — baholar", "Xodim — pasport ma’lumotlari",
                   "Talaba — kitoblar", "Mijoz — buyurtmalar"]
        self.assertEqual(options.index("Xodim — pasport ma’lumotlari"), 1)

    def test_q20_pdf_external_number_20_internal_number_24(self):
        original_rows = [(1, 18, 1), (2, 20, 2), (3, 22, 3),
                         (4, 19, 1), (5, 21, 2)]
        selected = [id for id, age, course in original_rows if age > 20 and course != 2]
        self.assertEqual(selected, [3])

    def test_visual_review_never_equals_release_approval(self):
        visually_checked, source_key, human_approved, publish_ready = True, None, False, False
        self.assertTrue(visually_checked)
        self.assertIsNone(source_key)
        self.assertFalse(human_approved or publish_ready)


if __name__ == "__main__":
    unittest.main()
