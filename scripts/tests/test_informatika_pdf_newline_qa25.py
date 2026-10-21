"""Offline regression for PDF source newline cleanup: content preserved, keys untouched."""
import unittest


def normalize_pdf_newlines(text):
    return text.replace("\r\n", "\n").replace("\r", "\n")


class SourceNewlineQA25(unittest.TestCase):
    def test_crlf(self):
        self.assertEqual(normalize_pdf_newlines("A\r\nB"), "A\nB")

    def test_lone_cr(self):
        self.assertEqual(normalize_pdf_newlines("Question\rA) One\rB) Two"), "Question\nA) One\nB) Two")

    def test_mixed_and_idempotent(self):
        src = "Q\r\nA\rB\nC"
        cleaned = normalize_pdf_newlines(src)
        self.assertEqual(cleaned, "Q\nA\nB\nC")
        self.assertEqual(normalize_pdf_newlines(cleaned), cleaned)

    def test_code_whitespace_preserved(self):
        src = "for i in range(3):\r\n    print(i)\r\n"
        self.assertEqual(normalize_pdf_newlines(src), "for i in range(3):\n    print(i)\n")

    def test_source_text_payload_not_modified(self):
        src = "SELECT * FROM book\rWHERE price > 56000;"
        self.assertEqual(normalize_pdf_newlines(src).replace("\n", ""),
                         src.replace("\r", ""))


if __name__ == "__main__":
    unittest.main()
