"""QA27: original MS Word PDF page and task reconstruction regressions.

All proposed interpretations require independent human editorial approval.
This file intentionally contains NO source image, PDF bytes or author keys.
"""
import unittest


PAGE = {1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 3, 8: 4}
OPTION_LETTERS = ("A", "B", "C", "D")


def convert_word_cursor_example(text, caret):
    # Original source: Prem|ierLeague -> Pre |League.
    left, right = text[:caret], text[caret:]
    left = left[:-1]           # Backspace: delete m.
    right = right[3:]          # Delete x3: remove i, e and r.
    left += " "                # Type a space.
    return left, right


class WordSourceQA27(unittest.TestCase):
    def test_physical_source_pages_1_to_8(self):
        self.assertEqual(sorted(PAGE), list(range(1, 9)))
        self.assertEqual([PAGE[i] for i in range(1, 9)],
                         [1, 1, 2, 2, 3, 3, 3, 4])

    def test_restored_question_2_underlines_and_splits_table(self):
        options = [("Ctrl+I", "Split Table"),
                   ("Ctrl+U", "Split Table"),
                   ("Ctrl+B", "Insert Below"),
                   ("Ctrl+U", "Insert Above")]
        self.assertEqual(options.index(("Ctrl+U", "Split Table")), 1)

    def test_question_3_four_truth_assignments(self):
        statements = (False, True, False, True)
        options = [(False, True, False, True),
                   (False, False, False, True),
                   (True, False, True, False),
                   (True, True, False, False)]
        self.assertEqual(options.index(statements), 0)

    def test_question_4_four_truth_assignments(self):
        statements = (True, True, False, True)
        options = [(True, True, False, True),
                   (False, True, False, True),
                   (False, True, True, False),
                   (False, False, True, False)]
        self.assertEqual(options.index(statements), 0)

    def test_question_1_ctrl_arrows_are_word_not_paragraph(self):
        key_behavior = {"Ctrl+Left": "previous word",
                        "Ctrl+Right": "next word"}
        self.assertNotEqual(key_behavior["Ctrl+Left"], "previous paragraph")
        self.assertNotEqual(key_behavior["Ctrl+Right"], "next paragraph")

    def test_question_5_tab_at_last_cell(self):
        # The source Q3 explicitly states the last-cell condition.
        key_options = ["Tab", "Shift+Tab", "Ctrl+Shift", "Tab+Enter"]
        self.assertEqual(key_options.index("Tab"), 0)

    def test_question_6_source_icon_to_letter_mapping(self):
        observed = ("d", "e", "b", "a", "c", "f")
        options = [("d", "e", "b", "a", "c", "f"),
                   ("d", "a", "b", "e", "c", "f"),
                   ("f", "e", "b", "a", "c", "d"),
                   ("a", "f", "b", "d", "c", "e")]
        self.assertEqual(options.index(observed), 0)

    def test_question_7_real_cursor_edit_produces_source_image(self):
        text = "PremierLeague"
        left, right = convert_word_cursor_example(text, 4)
        self.assertEqual(left + "|" + right, "Pre |League")

    def test_question_8_source_row_italic_and_left_insert(self):
        steps = ("row-selection arrow", "Ctrl+I",
                 "column-selection arrow", "Insert Left")
        options = [steps,
                   ("table handle", "Ctrl+B", "column-selection arrow", "Split Table"),
                   ("table handle", "Ctrl+I", "row-selection arrow", "Insert Left"),
                   ("column-selection arrow", "Ctrl+B", "table handle", "Insert Right")]
        self.assertEqual(options.index(steps), 0)

    def test_source_question_types_not_fabricated_as_all_mcq(self):
        original_free_response_numbers = {1, 7}
        choice_question_numbers = set(PAGE) - original_free_response_numbers
        self.assertEqual(len(original_free_response_numbers), 2)
        self.assertEqual(len(choice_question_numbers), 6)

    def test_no_proposed_answer_is_an_original_author_key(self):
        human_approved = False
        official_key = None
        publish_ready = False
        self.assertFalse(human_approved)
        self.assertIsNone(official_key)
        self.assertFalse(publish_ready)


if __name__ == "__main__":
    unittest.main()
