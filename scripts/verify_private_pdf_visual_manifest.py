#!/usr/bin/env python3
"""Verify a local, private source-PDF image-crop manifest before editorial use.

Never uploads or publishes content. Uses only the Python standard library. This
script checks integrity, not copyright rights, editorial accuracy, or approval.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import struct
import zlib

PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
MAX_PNG_BYTES = 25 * 1024 * 1024


def _safe_basename(value: object, suffix: str) -> str:
    if not isinstance(value, str) or not value or value in {".", ".."}:
        raise ValueError("Missing or unsafe source filename")
    if Path(value).name != value or "/" in value or "\\" in value or not value.lower().endswith(suffix):
        raise ValueError(f"Unsafe or wrong-type filename: {value!r}")
    return value


def _hex_sha256(value: object) -> str:
    if not isinstance(value, str) or len(value) != 64 or any(x not in "0123456789abcdef" for x in value):
        raise ValueError("SHA-256 field must contain exactly 64 lowercase hex characters")
    return value


def _sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def _png_dimensions(path: Path) -> tuple[int, int]:
    if path.stat().st_size > MAX_PNG_BYTES:
        raise ValueError(f"PNG exceeds private-review size limit: {path.name}")
    with path.open("rb") as f:
        head = f.read(33)
    if len(head) < 33 or not head.startswith(PNG_MAGIC):
        raise ValueError(f"Invalid PNG signature/IHDR: {path.name}")
    size = struct.unpack(">I", head[8:12])[0]
    if size != 13 or head[12:16] != b"IHDR":
        raise ValueError(f"Invalid PNG IHDR: {path.name}")
    if zlib.crc32(head[12:29]) != struct.unpack(">I", head[29:33])[0]:
        raise ValueError(f"Corrupt PNG IHDR: {path.name}")
    width, height = struct.unpack(">II", head[16:24])
    if not 0 < width <= 20000 or not 0 < height <= 20000:
        raise ValueError(f"Invalid PNG dimensions: {path.name}")
    return width, height


def validate(manifest_file: Path, source_dir: Path) -> dict[str, int]:
    manifest_file = manifest_file.resolve(strict=True)
    directory = manifest_file.parent
    source_dir = source_dir.resolve(strict=True)
    rows = json.loads(manifest_file.read_text(encoding="utf-8"))
    if not isinstance(rows, list) or not rows:
        raise ValueError("Manifest must be a nonempty array")
    seen_images: set[str] = set()
    seen_source_pages: set[tuple[str, int, str]] = set()
    sources_verified: dict[str, str] = {}
    for item in rows:
        if not isinstance(item, dict):
            raise ValueError("Manifest entry must be an object")
        filename = _safe_basename(item.get("file"), ".png")
        pdf_name = _safe_basename(item.get("source_pdf"), ".pdf")
        if filename in seen_images:
            raise ValueError(f"Duplicate image manifest entry: {filename}")
        seen_images.add(filename)
        page = item.get("pdf_page")
        if type(page) is not int or page < 1:
            raise ValueError(f"Invalid PDF page in {filename}")
        coords = item.get("crop_pdf_coordinates")
        if not isinstance(coords, list) or len(coords) != 4 or not all(type(v) in (int, float) for v in coords):
            raise ValueError(f"Missing crop coordinates: {filename}")
        if coords[2] <= coords[0] or coords[3] <= coords[1] or min(coords) < 0:
            raise ValueError(f"Invalid crop coordinates: {filename}")
        key = (pdf_name, page, str(coords))
        if key in seen_source_pages:
            raise ValueError(f"Duplicated source-page crop coordinates: {filename}")
        seen_source_pages.add(key)
        if item.get("source_figure_present") is not True or item.get("learner_asset_published") is not False:
            raise ValueError(f"Not a private unpublished visual-review item: {filename}")
        source_id = item.get("source_drive_id")
        if not isinstance(source_id, str) or len(source_id) < 10 or not all(c.isalnum() or c in "-_" for c in source_id):
            raise ValueError(f"Missing/invalid source locator: {filename}")
        if item.get("source_drive_url") != f"https://drive.google.com/file/d/{source_id}/view":
            raise ValueError(f"Inconsistent Drive provenance: {filename}")
        image_path = directory / filename
        pdf_path = source_dir / pdf_name
        if image_path.is_symlink() or pdf_path.is_symlink():
            raise ValueError("Symlinked review sources are forbidden")
        if not image_path.is_file() or not pdf_path.is_file():
            raise ValueError(f"Missing private PDF/image pair: {filename}")
        expected_pdf_hash = _hex_sha256(item.get("source_pdf_sha256"))
        if pdf_name not in sources_verified:
            sources_verified[pdf_name] = _sha256(pdf_path)
        if sources_verified[pdf_name] != expected_pdf_hash:
            raise ValueError(f"Original PDF SHA-256 mismatch: {pdf_name}")
        if _sha256(image_path) != _hex_sha256(item.get("crop_sha256")):
            raise ValueError(f"Private crop SHA-256 mismatch: {filename}")
        _png_dimensions(image_path)
    return {"verified_crops": len(rows), "verified_source_pdfs": len(sources_verified), "publishable_assets": 0}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--manifest", required=True, type=Path)
    ap.add_argument("--source-dir", required=True, type=Path, help="Local directory containing the original PDF files")
    args = ap.parse_args()
    result = validate(args.manifest, args.source_dir)
    print(json.dumps(result, sort_keys=True))


if __name__ == "__main__":
    main()
