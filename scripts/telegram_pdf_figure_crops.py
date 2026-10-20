#!/usr/bin/env python3
"""Private PDF question figure crops. Never a published learner asset.

Requires: pip install PyMuPDF
Example:
    python scripts/telegram_pdf_figure_crops.py source.pdf output_dir --expected 20
"""
from __future__ import annotations

import argparse
import csv
import re
import zipfile
from pathlib import Path

import fitz

HEADING = re.compile(r"^(\d{1,3})\.")


def extract(pdf_path: Path, output_dir: Path, expected: int = 0, zoom: float = 1.8) -> list[dict]:
    if not 1 <= zoom <= 4:
        raise ValueError("unsafe rendering scale")
    pdf = fitz.open(pdf_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []
    next_no = 1

    for index, page in enumerate(pdf):
        markers: list[tuple[int, float]] = []
        for block in page.get_text("dict")["blocks"]:
            if block.get("type") != 0:
                continue
            for line in block["lines"]:
                line_text = "".join(span["text"] for span in line["spans"]).strip()
                found = HEADING.match(line_text)
                if found and int(found.group(1)) == next_no:
                    markers.append((next_no, float(line["bbox"][1])))
                    next_no += 1

        for i, (question_no, y) in enumerate(markers):
            bottom = markers[i + 1][1] - 8 if i + 1 < len(markers) else page.rect.height
            rect = fitz.Rect(0, max(0, y - 9), page.rect.width, min(page.rect.height, bottom))
            if rect.height < 18:
                raise ValueError(f"Invalid source crop Q{question_no}, PDF page {index+1}")
            img = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=rect, alpha=False)
            name = f"question_{question_no:02d}_page_{index + 1:02d}.png"
            img.save(str(output_dir / name))
            rows.append({"question_no": question_no, "pdf_page": index + 1,
                         "image_filename": name, "human_verified": False,
                         "publish_ready": False})

    if expected and len(rows) != expected:
        raise ValueError(f"Expected {expected} questions, got {len(rows)}; inspect the PDF")
    if not rows:
        raise ValueError("No numbered question headings found; needs manual extraction")
    with (output_dir / "question_figure_manifest.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    (output_dir / "README.txt").write_text(
        "PRIVATE, UNAPPROVED SOURCE CROPS. No answer keys. Check every image manually. "
        "Do not commit source images or publish as learner assets.\n", encoding="utf-8"
    )
    return rows


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--expected", type=int, default=0)
    parser.add_argument("--zip", type=Path)
    args = parser.parse_args()
    extracted = extract(args.pdf, args.output_dir, args.expected)
    if args.zip is not None:
        with zipfile.ZipFile(args.zip, "w", zipfile.ZIP_DEFLATED) as archive:
            for path in args.output_dir.iterdir():
                if path.is_file():
                    archive.write(path, arcname=path.name)
    print(f"Private, unapproved source crops: {len(extracted)}")
