import unittest
from scripts.format_private_python_candidates import format_python_question

OPTIONS = ["A", "B", "C", "D"]


class PythonSourceFenceQA17(unittest.TestCase):
    def test_line_breaks_and_removed_inline_choices(self):
        source = "1. Natija?\r\nx = 10\r\nx *= 2 + 3\r\nprint(x)\r\nA) 23 B) 50 C) 20 D) Xato"
        result = format_python_question(source, OPTIONS)
        self.assertIn("```python\nx = 10\nx *= 2 + 3\nprint(x)\n```", result)
        self.assertNotIn("A) 23", result)

    def test_preserve_invalid_original_code(self):
        raw = '17. Tekshiring:\nprint("2" in str(123) and 2 in)\nA) Xato'
        self.assertIn('and 2 in)', format_python_question(raw, OPTIONS))

    def test_preserve_implementation_dependent_identity(self):
        raw = "22. Tekshiring:\nx = 300\ny = 300\nprint(x is y, x == y)"
        self.assertIn("x is y, x == y", format_python_question(raw, OPTIONS))

    def test_idempotence(self):
        raw = "8. Natija:\nprint(3 < 5 != 4 > 2)"
        once = format_python_question(raw, OPTIONS)
        self.assertEqual(format_python_question(once, OPTIONS), once)

    def test_reject_missing_choice_count(self):
        with self.assertRaises(ValueError):
            format_python_question("1. Natija:\nprint(7)", [])

    def test_reject_missing_heading(self):
        with self.assertRaises(ValueError):
            format_python_question("print(7)", OPTIONS)

    def test_reject_unbalanced_code_fence(self):
        with self.assertRaises(ValueError):
            format_python_question("1. Natija:\n```python\nprint(1)", OPTIONS)


if __name__ == "__main__":
    unittest.main()
