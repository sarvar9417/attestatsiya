"""TASK-346 Telegram media re-export reconciliation (offline; no publishing).

Reads a private, known photo->poll ID manifest and a *new* Telegram JSON+media
export. Only exact photo message IDs with real, local, image-magic-verified
bytes can be listed as recovered. It never assigns answer keys, copies media
to public storage, or links images to learner-facing questions.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
from datetime import datetime
from pathlib import Path, PurePosixPath

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_BYTES = 50 * 1024 * 1024
STATUS_FIELDS = [
    "candidate_id", "poll_message_id", "photo_message_id", "module_hint",
    "status", "file_relative_path", "sha256", "file_size_bytes",
    "learner_publish_ready",
]


def is_image_file(path: Path) -> bool:
    """Require extension AND real file signature; extension alone is unsafe."""
    if path.suffix.lower() not in ALLOWED_EXTENSIONS:
        return False
    with path.open("rb") as handle:
        header = handle.read(12)
    if path.suffix.lower() in {".jpg", ".jpeg"}:
        return header.startswith(b"\xff\xd8\xff")
    if path.suffix.lower() == ".png":
        return header.startswith(b"\x89PNG\r\n\x1a\n")
    return header[:4] == b"RIFF" and header[8:12] == b"WEBP"


def safe_export_image_path(root: Path, raw_path: str) -> Path | None:
    """Never accept absolute paths, traversal, symlinks escaping export root."""
    if not isinstance(raw_path, str) or not raw_path or "\\" in raw_path:
        return None
    if raw_path.startswith("(") or "\x00" in raw_path or ":" in raw_path:
        return None
    p = PurePosixPath(raw_path)
    if p.is_absolute() or any(component in ("..", ".") for component in p.parts):
        return None
    root = root.resolve()
    file_path = (root / Path(*p.parts)).resolve()
    try:
        file_path.relative_to(root)
    except ValueError:
        return None
    if not file_path.is_file():
        return None
    if not 0 < file_path.stat().st_size <= MAX_FILE_BYTES:
        return None
    if not is_image_file(file_path):
        return None
    return file_path


def _timestamp(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def reconcile(manifest_csv: Path, new_export_json: Path, export_root: Path) -> list[dict[str, str]]:
    with manifest_csv.open("r", encoding="utf-8-sig", newline="") as handle:
        candidates = list(csv.DictReader(handle))
    if not candidates:
        raise ValueError("Original recovery manifest empty")

    with new_export_json.open("r", encoding="utf-8") as handle:
        export = json.load(handle)
    if export.get("name", "").strip() != "Informatika Attestatsiya 86+":
        raise ValueError("Group identity differs; refuse to re-link photos")
    records = export.get("messages")
    if not isinstance(records, list):
        raise ValueError("Telegram export has no message array")
    messages = {m.get("id"): m for m in records if isinstance(m, dict)}
    if len(messages) != len(records):
        raise ValueError("Duplicate or malformed Telegram message ID")

    seen_photos: set[int] = set()
    seen_polls: set[int] = set()
    result: list[dict[str, str]] = []
    root = export_root.resolve()
    for row in candidates:
        photo_id, poll_id = int(row["photo_message_id"]), int(row["poll_message_id"])
        if photo_id in seen_photos or poll_id in seen_polls or photo_id >= poll_id:
            raise ValueError("Manifest contains duplicate or invalid photo->poll links")
        seen_photos.add(photo_id)
        seen_polls.add(poll_id)
        item = {
            "candidate_id": row["candidate_id"],
            "poll_message_id": str(poll_id),
            "photo_message_id": str(photo_id),
            "module_hint": row.get("module_hint", "REVIEW"),
            "status": "",
            "file_relative_path": "",
            "sha256": "",
            "file_size_bytes": "",
            "learner_publish_ready": "NO",
        }
        photo, poll = messages.get(photo_id), messages.get(poll_id)
        if photo is None or poll is None:
            item["status"] = "message_ids_missing"
        elif not isinstance(poll.get("poll"), dict):
            item["status"] = "poll_not_in_export"
        elif photo.get("from_id") and poll.get("from_id") and photo["from_id"] != poll["from_id"]:
            item["status"] = "sender_mismatch"
        else:
            try:
                gap = (_timestamp(poll["date"]) - _timestamp(photo["date"])).total_seconds()
                valid_gap = 0 <= gap <= max(2, int(row.get("seconds_before_poll", "0")) + 2)
            except (ValueError, KeyError, TypeError):
                valid_gap = False
            if not valid_gap:
                item["status"] = "photo_poll_time_mismatch"
            elif not isinstance(photo.get("photo"), str) or photo["photo"].startswith("("):
                item["status"] = "photo_bytes_not_exported"
            else:
                local = safe_export_image_path(root, photo["photo"])
                if local is None:
                    item["status"] = "unsafe_or_missing_photo_file"
                else:
                    digest = hashlib.sha256()
                    with local.open("rb") as file:
                        for chunk in iter(lambda: file.read(1024 * 1024), b""):
                            digest.update(chunk)
                    item["status"] = "recovered_private_review_only"
                    item["file_relative_path"] = local.relative_to(root).as_posix()
                    item["sha256"] = digest.hexdigest()
                    item["file_size_bytes"] = str(local.stat().st_size)
        result.append(item)
    return result


def run() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, required=True, help="Original 484-photo CSV")
    parser.add_argument("--export-json", type=Path, required=True, help="New Telegram result.json")
    parser.add_argument("--export-root", type=Path, required=True, help="Root containing photo files")
    parser.add_argument("--out-dir", type=Path, required=True, help="Private local output directory")
    args = parser.parse_args()
    records = reconcile(args.manifest, args.export_json, args.export_root)
    args.out_dir.mkdir(parents=True, exist_ok=True)
    report_path = args.out_dir / "telegram_photo_recovery_review_only.csv"
    with report_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=STATUS_FIELDS)
        writer.writeheader()
        writer.writerows(records)
    count = sum(r["status"] == "recovered_private_review_only" for r in records)
    summary = {
        "manifest_total": len(records), "recovered_private_review_only": count,
        "unavailable_or_invalid": len(records) - count,
        "published": 0, "answer_keys_assigned": 0,
        "requires_media_license_review": True,
    }
    (args.out_dir / "telegram_photo_recovery_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    run()
