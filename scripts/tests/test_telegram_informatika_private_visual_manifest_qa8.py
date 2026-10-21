"""Independent source-asset integrity tests; do not copy third-party images to Git."""
import hashlib
import json
import struct
import sys
import tempfile
import unittest
from pathlib import Path
import zlib

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from verify_private_pdf_visual_manifest import validate


def png_chunk(name: bytes, payload: bytes) -> bytes:
    return struct.pack(">I", len(payload)) + name + payload + struct.pack(">I", zlib.crc32(name + payload))


def small_png() -> bytes:
    hdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    data = zlib.compress(b"\x00\xff\x00\x00")
    return b"\x89PNG\r\n\x1a\n" + png_chunk(b"IHDR", hdr) + png_chunk(b"IDAT", data) + png_chunk(b"IEND", b"")


class PrivateManifestQA(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.pdf_dir = self.root / "sources"
        self.asset_dir = self.root / "review"
        self.pdf_dir.mkdir()
        self.asset_dir.mkdir()
        self.original = self.pdf_dir / "original.pdf"
        self.original.write_bytes(b"%PDF-1.7\nprivate-test-fixture\n")
        self.image = self.asset_dir / "figure.png"
        self.image.write_bytes(small_png())
        self.manifest = self.asset_dir / "manifest.json"
        self.entry = {
            "file": "figure.png", "source_pdf": "original.pdf", "pdf_page": 2,
            "source_pdf_sha256": hashlib.sha256(self.original.read_bytes()).hexdigest(),
            "crop_sha256": hashlib.sha256(self.image.read_bytes()).hexdigest(),
            "crop_pdf_coordinates": [10, 20, 100, 110],
            "source_figure_present": True, "learner_asset_published": False,
            "source_drive_id": "some_valid-id_123", "source_drive_url": "https://drive.google.com/file/d/some_valid-id_123/view",
        }
        self.save()

    def save(self):
        self.manifest.write_text(json.dumps([self.entry]), encoding="utf-8")

    def test_private_manifest_passes_with_no_publication_claim(self):
        self.assertEqual(validate(self.manifest, self.pdf_dir),
                         {"verified_crops": 1, "verified_source_pdfs": 1, "publishable_assets": 0})

    def test_modified_original_rejected(self):
        self.original.write_bytes(b"%PDF-1.7\nchanged\n")
        with self.assertRaisesRegex(ValueError, "Original PDF SHA-256 mismatch"):
            validate(self.manifest, self.pdf_dir)

    def test_modified_image_rejected(self):
        self.image.write_bytes(b"incorrect bytes")
        with self.assertRaisesRegex(ValueError, "Private crop SHA-256 mismatch"):
            validate(self.manifest, self.pdf_dir)

    def test_wrong_drive_link_rejected(self):
        self.entry["source_drive_url"] = "https://example.com/unverified"
        self.save()
        with self.assertRaisesRegex(ValueError, "Inconsistent Drive provenance"):
            validate(self.manifest, self.pdf_dir)

    def test_published_flag_rejected(self):
        self.entry["learner_asset_published"] = True
        self.save()
        with self.assertRaisesRegex(ValueError, "private unpublished"):
            validate(self.manifest, self.pdf_dir)

    def test_path_traversal_rejected(self):
        self.entry["file"] = "../figure.png"
        self.save()
        with self.assertRaisesRegex(ValueError, "Unsafe"):
            validate(self.manifest, self.pdf_dir)

    def test_duplicate_image_rejected(self):
        self.manifest.write_text(json.dumps([self.entry, self.entry]))
        with self.assertRaisesRegex(ValueError, "Duplicate image"):
            validate(self.manifest, self.pdf_dir)

    def test_bad_crop_rejected(self):
        self.entry["crop_pdf_coordinates"] = [100, 20, 10, 110]
        self.save()
        with self.assertRaisesRegex(ValueError, "Invalid crop"):
            validate(self.manifest, self.pdf_dir)

    def test_missing_source_rejected(self):
        self.original.unlink()
        with self.assertRaisesRegex(ValueError, "Missing private PDF"):
            validate(self.manifest, self.pdf_dir)


if __name__ == "__main__":
    unittest.main()
