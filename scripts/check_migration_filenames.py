#!/usr/bin/env python3
"""Fail fast on ambiguous Supabase migration versions (without a DB connection)."""
from __future__ import annotations

from datetime import datetime
from pathlib import Path
import argparse
import re
import sys

NAME = re.compile(r"^(\d{14})_([a-z0-9_]+)\.sql$")


# Two historical production-tracked migrations have invalid clock fields
# (minute 80/90). Renaming changes their deployed migration identities.
# Allow ONLY these known legacy filenames; reject all new invalid timestamps.
LEGACY_APPLIED_INVALID_TIMESTAMPS = frozenset({
    "20261022008000_task404_ten_y1_info_office_security_distractor_balance.sql",
    "20261022009000_task405_ten_y1_algorithms_python_js_security_semantic_repair.sql",
})

def check_migrations(folder: Path) -> list[str]:
    if not folder.is_dir():
        return [f"Migration directory is missing: {folder}"]
    seen: dict[str, str] = {}
    errors: list[str] = []
    for file in sorted(folder.iterdir()):
        if not file.is_file() or file.suffix != ".sql":
            continue
        match = NAME.fullmatch(file.name)
        if not match:
            errors.append(f"Invalid migration filename: {file.name}")
            continue
        version = match.group(1)
        try:
            datetime.strptime(version, "%Y%m%d%H%M%S")
        except ValueError:
            if file.name not in LEGACY_APPLIED_INVALID_TIMESTAMPS:
                errors.append(f"Invalid migration timestamp: {file.name}")
        if version in seen:
            errors.append(f"Duplicate migration version {version}: {seen[version]}, {file.name}")
        else:
            seen[version] = file.name
    if not seen:
        errors.append(f"No migration SQL files found in {folder}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dir", type=Path, default=Path("supabase/migrations"))
    args = parser.parse_args()
    errors = check_migrations(args.dir)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    print(f"Migration filenames validated: {args.dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
