"""QA19: CSV export source question depends on configured list separator."""
import csv
from io import StringIO
import unittest

SOURCE_ROWS=[
    ["name","grade1","grade2","grade3"],
    ["Mark","34","43","11"],
    ["Tween","132","54","546"],
]


def export_csv(delimiter):
    s=StringIO()
    writer=csv.writer(s,delimiter=delimiter,lineterminator="\n")
    writer.writerows(SOURCE_ROWS)
    return s.getvalue().strip()


class SourceCSVReviewQA19(unittest.TestCase):
    def test_comma_mode_matches_original_B(self):
        self.assertEqual(export_csv(","),
                         "name,grade1,grade2,grade3\nMark,34,43,11\nTween,132,54,546")

    def test_semicolon_mode_matches_original_D(self):
        self.assertEqual(export_csv(";"),
                         "name;grade1;grade2;grade3\nMark;34;43;11\nTween;132;54;546")

    def test_unspecified_csv_dialect_is_ambiguous(self):
        self.assertNotEqual(export_csv(","),export_csv(";"))

    def test_source_release_gate(self):
        record={"source_visually_reviewed":True,"source_text_only":True,
                "answer_key":None,"publish_ready":False}
        self.assertIsNone(record["answer_key"])
        self.assertFalse(record["publish_ready"])


if __name__=="__main__": unittest.main()
