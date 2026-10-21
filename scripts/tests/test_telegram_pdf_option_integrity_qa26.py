"""Private PDF source QA26: option newline and parser-boundary guards.

Offline only: source answer keys and learner tables must not be modified.
"""
import copy
import unittest


def normalize_option_newlines(options):
    result = copy.deepcopy(options)
    for option in result:
        if isinstance(option.get("text"), str):
            text = option["text"]
            option["text"] = text.replace("\r\n", "\n").replace("\r", "\n")
    return result


def publish_blocked_by_broken_options(options):
    return len(options) != 4 or [opt.get("label") for opt in options] != [
        "A", "B", "C", "D"
    ] or any(not isinstance(opt.get("text"), str) or not opt["text"].strip()
             for opt in options)


class QA26PDFOptionIntegrity(unittest.TestCase):
    def test_crlf_and_cr_normalized_inside_answer_options(self):
        original = [{"label": "A", "text": "one\r\ntwo", "hint": 1},
                    {"label": "B", "text": "three\rfour"}]
        actual = normalize_option_newlines(original)
        self.assertEqual(actual, [{"label": "A", "text": "one\ntwo", "hint": 1},
                                  {"label": "B", "text": "three\nfour"}])
        self.assertEqual(original[0]["text"], "one\r\ntwo")

    def test_idempotent_and_order_preserved(self):
        source = [{"label": str(i), "text": "one\rtwo"} for i in range(5)]
        once = normalize_option_newlines(source)
        self.assertEqual(normalize_option_newlines(once), once)
        self.assertEqual([x["label"] for x in once], [str(i) for i in range(5)])

    def test_compound_75_and_80_option_fragments_are_blocked(self):
        for n in (75, 80):
            self.assertTrue(publish_blocked_by_broken_options([
                {"label": "A", "text": "source fragment"} for _ in range(n)
            ]))

    def test_one_option_cannot_be_published(self):
        self.assertTrue(publish_blocked_by_broken_options([
            {"label": "A", "text": "fragment"}]))

    def test_valid_four_options_not_blocked_on_count_alone(self):
        self.assertFalse(publish_blocked_by_broken_options([
            {"label": letter, "text": "choice"} for letter in "ABCD"
        ]))

    def test_footnote_not_part_of_option_d(self):
        source_question = "17. Formula answer?\nIzoh:\nABS=ZNAK"
        option_d = "7.\nIzoh:\nABS=ZNAK"
        cleaned_option_d = option_d.split("\nIzoh:", 1)[0]
        self.assertEqual(cleaned_option_d, "7.")
        self.assertIn("Izoh:", source_question)

    def test_missing_labels_or_empty_text_blocked(self):
        self.assertTrue(publish_blocked_by_broken_options([
            {"label": letter, "text": " "} for letter in "ABCD"
        ]))
        self.assertTrue(publish_blocked_by_broken_options([
            {"label": letter, "text": letter} for letter in "AABD"
        ]))


if __name__ == "__main__":
    unittest.main()
