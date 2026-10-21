"""TASK-346 QA12: original Internet-test source/page and content review gates.

These mappings are *independent expert proposals* from a 3-page owner-supplied PDF.
Never treat them as original author keys or automatic publishing authorization.
"""
import unittest

SOURCE_PAGES = {**dict.fromkeys(range(1, 15), 1),
                **dict.fromkeys(range(15, 29), 2),
                **dict.fromkeys(range(29, 41), 3)}

# Zero-based answer choices in source PDF original A/B/C/D order.
PROPOSED = {
    1:2, 2:1, 3:1, 4:2, 5:2, 6:2, 7:2, 8:1,
    10:2, 12:2, 13:2, 14:2, 15:2, 16:1, 17:1, 18:1,
    19:1, 22:1, 23:1, 24:1, 25:2, 26:1, 27:2, 28:2,
    29:1, 30:3, 31:1, 32:2, 33:1, 34:2, 35:1, 36:1,
    37:1, 38:1, 40:2,
}
BLOCKED = {
    9: "URL component count lacks a defined scheme for component boundaries",
    11: "Complete URL and distinction between host, domain and TLD missing",
    20: "Web 3.0/semantic Web/decentralized Web definition underspecified",
    21: "Web 3.0 personalization not a distinct discriminating property",
    39: "AI-driven recommendation is not exclusive to Web 3.0",
}


class InternetPdfQA12(unittest.TestCase):
    def test_all_original_pages_accounted(self):
        self.assertEqual(set(SOURCE_PAGES), set(range(1, 41)))
        self.assertEqual((sum(v == 1 for v in SOURCE_PAGES.values()),
                          sum(v == 2 for v in SOURCE_PAGES.values()),
                          sum(v == 3 for v in SOURCE_PAGES.values())), (14, 14, 12))

    def test_no_assumed_key_for_source_ambiguities(self):
        self.assertEqual(set(PROPOSED) & set(BLOCKED), set())
        self.assertEqual(set(PROPOSED) | set(BLOCKED), set(range(1, 41)))
        self.assertEqual(len(PROPOSED), 35)
        self.assertEqual(len(BLOCKED), 5)

    def test_every_proposed_index_in_original_four_option_range(self):
        for n, ix in PROPOSED.items():
            with self.subTest(question=n):
                self.assertIn(ix, range(4))

    def test_ocr_q14_original_choice_row(self):
        choices = ("FTP", "SMTP", "HTTP va HTTPS", "TCP")
        self.assertEqual(len(choices), 4)
        self.assertEqual(choices[PROPOSED[14]], "HTTP va HTTPS")
        self.assertEqual(SOURCE_PAGES[14], 1)
        self.assertEqual(SOURCE_PAGES[15], 2)

    def test_ocr_q28_original_choice_row(self):
        choices = ("Brauzer turi", "Internetga ulanish dasturi",
                   "Axborot qidirish dasturi", "Antivirus")
        self.assertEqual(len(choices), 4)
        self.assertEqual(choices[PROPOSED[28]], "Axborot qidirish dasturi")
        self.assertEqual(SOURCE_PAGES[28], 2)
        self.assertEqual(SOURCE_PAGES[29], 3)

    def test_website_publication_year_distinct_from_web_invention_year(self):
        self.assertEqual(PROPOSED[5], 2)
        self.assertEqual(PROPOSED[6], 2)  # Tim Berners-Lee

    def test_web3_ambiguous_not_promoted_to_key(self):
        self.assertTrue({20, 21, 39}.issubset(BLOCKED))
        self.assertNotIn(9, PROPOSED)
        self.assertNotIn(11, PROPOSED)

    def test_answer_proposal_does_not_mean_publish(self):
        for proposed in PROPOSED.values():
            # A suggestion, not an official key.
            self.assertIsInstance(proposed, int)
        source_author_key, human_approved, publish_ready = None, False, False
        self.assertIsNone(source_author_key)
        self.assertFalse(human_approved or publish_ready)


if __name__ == "__main__":
    unittest.main()
