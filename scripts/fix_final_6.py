#!/usr/bin/env python3
"""Fix remaining 6 explanation-too-short issues by targeting exercise IDs directly."""

import re
from pathlib import Path

BASE = Path("src/data/daily")

FIXES = {
    # b2Part2.ts - Needn't have + V₃ (17 chars → should be >= 20)
    59561: "Needn\\'t have + V₃ (past participle) keraksiz bajarilgan ish uchun",
    59571: "Needn\\'t have + V₃ (past participle) keraksiz bajarilgan ish uchun",
    59576: "Needn\\'t have + V₃ (past participle) keraksiz bajarilgan ish uchun",
    59591: "Needn\\'t have + V₃ (past participle) keraksiz bajarilgan ish uchun",
    # a2Part4.ts - Salbiy ma'no → few (18 chars)
    29073: "Salbiy ma\\'no bildirganda \\'few\\' ishlatiladi (oz, yetarli emas)",
    # b1plusPart1.ts - Think so — to'g'ri (18 chars)
    50349: "Think so (shunday deb o\\'ylayman) — to\\'g\\'ri javob",
}


def fix_file(filepath: Path, ids: list[int]) -> int:
    with open(filepath, "r") as f:
        content = f.read()

    count = 0
    for eid in ids:
        new_exp = FIXES[eid]
        # Match: explanation: "..." after id: EID
        # The pattern looks for: id: EID, ... explanation: "EXISTING_TEXT"
        # We need to find the explanation field that belongs to this exercise
        # Find the exercise block containing this ID
        id_pattern = f"id: {eid}"
        idx = content.find(id_pattern)
        if idx < 0:
            print(f"  [SKIP] #{eid}: not found in {filepath.name}")
            continue

        # Find the explanation field after this ID (but before next id: or closing })
        rest = content[idx:]
        # Limit search to next exercise or end of block
        next_id = re.search(r'\n\s*\{?\s*id:', rest[50:])  # skip ahead past this exercise's id
        search_end = rest[50:next_id.start() + 50] if next_id else rest[50:500]

        # Find explanation: "..." in this range
        exp_match = re.search(r'explanation:\s*"((?:[^"\\]|\\.)*)"', search_end)
        if exp_match:
            old_exp = f'explanation: "{exp_match.group(1)}"'
            new_str = f'explanation: "{new_exp}"'
            # Find this exact string in the original content (not just the slice)
            # Use the offset
            actual_idx = content.find(old_exp, idx)
            if actual_idx >= 0 and actual_idx < idx + 500:
                content = content[:actual_idx] + new_str + content[actual_idx + len(old_exp):]
                print(f"  [FIXED] #{eid}: \"{exp_match.group(1)}\" → \"{new_exp[:50]}...\" in {filepath.name}")
                count += 1
            else:
                print(f"  [WARN] #{eid}: found id but couldn't match explanation text in {filepath.name}")
                print(f"    search_end={search_end[:200]}")
        else:
            print(f"  [WARN] #{eid}: found id but no explanation field in nearby text")
            print(f"    search_end={search_end[:200]}")
            # Try a more aggressive search
            exp_match2 = re.search(r'explanation:\s*"([^"]*)"', rest[:500])
            if exp_match2:
                print(f"    found explanation: \"{exp_match2.group(1)}\" (len={len(exp_match2.group(1))})")

    if count > 0:
        with open(filepath, "w") as f:
            f.write(content)

    return count


def main():
    files_to_fix = {
        BASE / "b2Part2.ts": [59561, 59571, 59576, 59591],
        BASE / "a2Part4.ts": [29073],
        BASE / "b1plusPart1.ts": [50349],
    }

    total = 0
    for filepath, ids in files_to_fix.items():
        if not filepath.exists():
            print(f"[ERROR] {filepath} not found!")
            continue
        print(f"\n=== {filepath.name} ===")
        fixed = fix_file(filepath, ids)
        print(f"  Fixed: {fixed}/{len(ids)}")
        total += fixed

    print(f"\n{'='*40}")
    print(f"Total fixed: {total}/{sum(len(v) for v in files_to_fix.values())}")


if __name__ == "__main__":
    main()
