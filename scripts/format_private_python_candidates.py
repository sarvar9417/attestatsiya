"""Pure offline Markdown formatter for a private Python source question.

Never runs the source, fixes original syntax, writes DB data or releases keys.
"""
import re


def format_python_question(question: str, options: list) -> str:
    if len(options) != 4:
        raise ValueError("Require four independent source choices")
    text = question.replace("\r\n", "\n").replace("\r", "\n").strip()
    if "```python\n" in text:
        if text.count("```") != 2:
            raise ValueError("Unbalanced existing code fence")
        return text
    if "\n" not in text:
        raise ValueError("Original heading/code boundary absent")
    heading, source = text.split("\n", 1)
    if not re.match(r"^\d+[.]\s+", heading):
        raise ValueError("Unnumbered or merged source heading")
    source = re.split(r"\nA\)\s*", source, maxsplit=1)[0].strip()
    if "print(" not in source:
        raise ValueError("Source's output statement missing")
    if "\nA)" in source or "```" in source:
        raise ValueError("Choice or Markdown marker inside raw source")
    return f"{heading.strip()}\n\n```python\n{source}\n```"
