"""QA31: four-choice private PDF option schema normalization, without keying."""

import copy
import unittest

LABELS = "ABCD"


def normalize_options(values):
    if len(values) != 4:
        raise ValueError("Only exactly four options can be normalized")
    if all(isinstance(v, str) for v in values):
        if any(not v.strip() for v in values):
            raise ValueError("Empty options require editorial review")
        return [{"label": LABELS[i], "text": v} for i, v in enumerate(values)]
    if all(isinstance(v, dict) for v in values):
        if [v.get("label") for v in values] != list(LABELS):
            raise ValueError("Existing option labels are inconsistent")
        if any(not isinstance(v.get("text"), str) or not v["text"].strip()
               for v in values):
            raise ValueError("Existing option content missing")
        return copy.deepcopy(values)
    raise ValueError("Mixed string/object options require human inspection")


class SourceOptionSchemaQA31(unittest.TestCase):
    def test_plain_four_strings_map_to_abcd(self):
        result = normalize_options(["first", "second", "third", "fourth"])
        self.assertEqual([x["label"] for x in result], list("ABCD"))

    def test_unicode_preserved(self):
        texts = ["Matematika — 17", "Fizika №2", "O‘zbekiston", "Satr\nboshi"]
        self.assertEqual([x["text"] for x in normalize_options(texts)], texts)

    def test_original_whitespace_untouched(self):
        texts = ["A ", "  B", "x\ny", "C;"]
        self.assertEqual([x["text"] for x in normalize_options(texts)], texts)

    def test_existing_object_schema_is_idempotent(self):
        data = [{"label": c, "text": c.lower()} for c in "ABCD"]
        self.assertEqual(normalize_options(normalize_options(data)), data)

    def test_incomplete_and_aggregate_cannot_be_normalized(self):
        for n in (0, 1, 3, 75, 80):
            with self.assertRaises(ValueError):
                normalize_options(["x"] * n)

    def test_mixed_object_and_string_requires_editor(self):
        with self.assertRaises(ValueError):
            normalize_options(["a", {"label": "B", "text": "b"}, "c", "d"])

    def test_wrong_order_or_blank_options_blocked(self):
        with self.assertRaises(ValueError):
            normalize_options([{"label": x, "text": x} for x in "AABD"])
        with self.assertRaises(ValueError):
            normalize_options(["one", " ", "three", "four"])

    def test_answer_keys_not_generated(self):
        self.assertEqual(set(normalize_options(["a", "b", "c", "d"])[0]),
                         {"label", "text"})
        author_key = None
        approved = False
        self.assertIsNone(author_key)
        self.assertFalse(approved)


if __name__ == "__main__":
    unittest.main()
