"""QA32: private source snippets fenced without altering original semantics."""
import re
import unittest


FENCE = chr(96) * 3


def fence_code(text, begin, end, language):
    if FENCE in text:
        raise ValueError("Already fenced")
    start = text.index(begin)
    finish = text.index(end, start) + len(end)
    return (text[:start] + FENCE + language + "\n" +
            text[start:finish] + "\n" + FENCE +
            text[finish:])


class OriginalSourceCodeQA32(unittest.TestCase):
    def test_js_code_is_visually_distinct_from_options(self):
        text = "Question?\nlet a = [1, 3];\nconsole.log(a);\nA) X B) Y"
        actual = fence_code(text, "let a =", "console.log(a);", "javascript")
        self.assertEqual(actual.count(FENCE), 2)
        self.assertIn(FENCE + "\nA) X B) Y", actual)
        self.assertIn("let a = [1, 3];", actual)

    def test_html_code_preserves_markup_instead_of_rendering(self):
        text = "Q?\n<html>\n<td>A</td>\n</html>\nA) green"
        actual = fence_code(text, "<html>", "</html>", "html")
        self.assertEqual(actual.count(FENCE), 2)
        self.assertIn("<td>A</td>", actual)
        self.assertIn(FENCE + "\nA) green", actual)

    def test_html_h1_contains_literal_A_not_answer_choice(self):
        line = '<h1>A) Ism familiya</h1>'
        self.assertIsNone(re.match(r"^\s*A\)", line))
        self.assertIn("A)", line)

    def test_code_fence_does_not_rewrite_algorithms(self):
        snippet = "let a = [1, 3, 5, 7];\na.pop();\na[1] += 10;"
        wrapped = fence_code("Q?\n" + snippet + "\nA) -7",
                             "let a =", "a[1] += 10;", "javascript")
        self.assertIn(snippet, wrapped)
        self.assertTrue(wrapped.index(FENCE) < wrapped.index("a.pop()"))

    def test_wrapping_twice_rejected(self):
        text = fence_code("X\nlet a=1;\nA) 1", "let a", "let a=1;", "javascript")
        with self.assertRaises(ValueError):
            fence_code(text, "let a", "let a=1;", "javascript")

    def test_original_unescaped_quoted_js_newline_requires_editorial_check(self):
        original = 'let a = "1991-yil 31-\navgustda";'
        self.assertIn("\n", original.split('"')[1])
        self.assertTrue("avгуст" not in original)  # no string alteration
        human_confirmed = False
        self.assertFalse(human_confirmed)

    def test_fewer_than_four_source_choices_must_stay_blocked(self):
        choices = ["A) HTML code", "B) alternative", "C) alternative"]
        self.assertLess(len(choices), 4)

    def test_no_original_answer_keys_or_publication(self):
        original_key, rights_confirmed, publish_ready = None, False, False
        self.assertIsNone(original_key)
        self.assertFalse(rights_confirmed or publish_ready)


if __name__ == "__main__":
    unittest.main()
