"""TASK-346 QA9 — offline MS Access visual-source review regressions.

Data is independently transcribed from the owner's source PDF's private screenshots.
Assertions are expert calculations, NOT author-verified answer keys.
Only fixed SQL fixtures are executed, never arbitrary question-source SQL.
"""
import sqlite3
import unittest


def source_tables():
    db = sqlite3.connect(":memory:")
    db.execute("create table ustozlar (id integer,FISH text,toifasi text,oyligi integer,staji integer)")
    db.executemany("insert into ustozlar values (?,?,?,?,?)", [
        (1,"Usmonov Ahmad","oliy",5687400,18),
        (2,"Axmedova Luiza","birinchi",4520000,12),
        (3,"Qahhorov Arslon","ikkinchi",3850000,10),
        (4,"Beshimov Jonibek","oliy",6500000,24),
        (5,"Xazratov Orif","mutaxassis",3000000,21)])
    db.execute("create table hodimlar (id integer,full_name text,category text,salary integer)")
    db.executemany("insert into hodimlar values (?,?,?,?)", [
        (1,"Akbarov Botir","first category",4200000),
        (2,"Ashurov Umid","professor",4800000),
        (3,"Usmonova Xadicha","first category",5200000),
        (4,"Rahimov Farhod","assistant",3200000),
        (5,"Qurbonova Kamola","second category",4600000),
        (6,"Rasulov Begzod","professor",5100260),
        (7,"Akramova Malika","professor",4928300)])
    db.execute("create table teachers (id integer,full_name text,category text,experience integer,salary integer)")
    db.executemany("insert into teachers values (?,?,?,?,?)", [
        (1,"Akbarov Botir","first category",12,6200000),
        (2,"Ashurov Umid","professor",19,6800000),
        (3,"Usmonova Xadicha","first category",22,7200000),
        (4,"Rahimov Farhod","assistant",3,5200000),
        (5,"Qurbonova Kamola","second category",14,6600000),
        (6,"Rasulov Bekzod","professor",12,7100000),
        (7,"Akramova Malika","professor",13,6900000),
        (8,"Jamilov Valijon","second category",3,5700000)])
    db.execute("create table mevalar (nomi text,narx integer,kg integer)")
    db.executemany("insert into mevalar values (?,?,?)", [
        ("Olma",15000,80),("Ananas",25000,50),("Anor",20000,90),
        ("Banan",18000,120),("Limon",35000,64)])
    db.execute("create table kitoblar (nomi text,turi text,sahifalar integer,nashr integer)")
    db.executemany("insert into kitoblar values (?,?,?,?)", [
        ("O'tkan kunlar","Roman",220,2020),("Informatika","Darslik",368,2021),
        ("Shum bola","Qissa",192,2005),("Oltin zanglamas","Roman",540,2013),
        ("Molxona","Qissa",102,2024),("Talaba","Biografik asar",324,2018),
        ("1984","Roman",254,2022)])
    return db


class AccessVisualSourceQA9(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = source_tables()

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_q2_source_page1(self):
        rows = self.db.execute("select FISH from ustozlar where toifasi in ('ikkinchi','oliy') and oyligi<5000000").fetchall()
        self.assertEqual(rows,[("Qahhorov Arslon",)])

    def test_q6_source_page2(self):
        rows = self.db.execute("select full_name from hodimlar where category='first category' and salary>4300000").fetchall()
        self.assertEqual(rows,[("Usmonova Xadicha",)])

    def test_q8_source_page3(self):
        rows = self.db.execute("select full_name from teachers where category<>'assistant' and experience>=13 and salary>6000000").fetchall()
        self.assertEqual([r[0] for r in rows],["Ashurov Umid","Usmonova Xadicha","Qurbonova Kamola","Akramova Malika"])

    def test_q10_same_criteria_row_is_and(self):
        # Access's * wildcard is % only for this independent SQLite test.
        rows = self.db.execute("select nomi from mevalar where nomi like '%n%' and kg>80").fetchall()
        self.assertEqual(rows,[("Anor",),("Banan",)])

    def test_q11_separate_or_row_is_or(self):
        rows = self.db.execute("select nomi from mevalar where nomi like '%n%' or narx<=20000").fetchall()
        self.assertEqual(len(rows),5)

    def test_q14_no_assistant_with_experience_13(self):
        rows = self.db.execute("select full_name from teachers where category='assistant' and experience>=13").fetchall()
        self.assertEqual(rows,[])

    def test_q19_original_choice_A(self):
        rows = self.db.execute("select nomi,sahifalar from kitoblar where turi like '%n' and sahifalar>220 order by nashr asc").fetchall()
        self.assertEqual(rows,[("Oltin zanglamas",540),("1984",254)])

    def test_q1_source_column_toliq_ism_missing(self):
        names={row[1] for row in self.db.execute("pragma table_info(ustozlar)")}
        self.assertIn("FISH",names)
        self.assertNotIn("toliq_ism",names)

    def test_q3_source_operator_missing(self):
        with self.assertRaises(sqlite3.OperationalError):
            self.db.execute("select * from ustozlar where FISH like '%m%d%' or toifasi 'ikkinchi'").fetchall()

    def test_q7_source_column_category_missing(self):
        names={row[1] for row in self.db.execute("pragma table_info(ustozlar)")}
        self.assertIn("toifasi",names)
        self.assertNotIn("category",names)

    def test_q9_original_screenshot_incomplete(self):
        q9_ids={1,2,3,4,5}
        q8_ids={r[0] for r in self.db.execute("select id from teachers")}
        self.assertNotEqual(q8_ids,q9_ids)
        self.assertEqual(q8_ids-q9_ids,{6,7,8})

    def test_q13_source_schema_does_not_match_query(self):
        names={row[1] for row in self.db.execute("pragma table_info(mevalar)")}
        self.assertNotIn("yetishtirilgan_davlat",names)
        self.assertNotIn("1 kg narxi",names)

    def test_test20_q11_complete_truth_table_can_be_text_only(self):
        original={(1,1):1,(1,0):0,(0,1):1,(0,0):1}
        self.assertEqual({(a,b):int((not a) or b) for a,b in original},original)


if __name__=="__main__":
    unittest.main()
