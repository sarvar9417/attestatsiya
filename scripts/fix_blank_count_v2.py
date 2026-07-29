#!/usr/bin/env python3
"""
Fix hedging exercises acceptedAnswers (1 ___, 3 blanks → 1 blank + acceptedAnswers[0] with alternatives).
Also re-applies blank fixes for the 39 pattern-1 exercises if needed.
"""
import re
from pathlib import Path

BASE = Path("src/data/daily")

# Fixes for hedging exercises: new blanks and new acceptedAnswers
# original: blanks=["might","could","may"], acceptedAnswers=[['might'],['could'],['may']]
# target:   blanks=["might"],               acceptedAnswers=[['could','may']]

HEDGING_FIXES = [
    (970002, ["might"], [["could", "may"]]),
    (970011, ["It seems"], [["Apparently", "It appears"]]),
    (970014, ["I would suggest"], [["Perhaps we could", "We might consider"]]),
    (970016, ["might"], [["could", "may"]]),
    (970019, ["Perhaps"], [["It seems", "Apparently"]]),
    (970024, ["I would suggest"], [["Perhaps", "It seems"]]),
    (970027, ["I think"], [["It seems", "Apparently"]]),
    (970036, ["I think"], [["It seems", "Apparently"]]),
    (970037, ["Perhaps"], [["I would suggest", "We might consider"]]),
    (970039, ["Perhaps"], [["I think", "It seems"]]),
]


def esc(s):
    """Escape string for TypeScript single-quoted string."""
    return s.replace("\\", "\\\\").replace("'", "\\'")


def find_by_id(content: str, eid: int) -> int:
    """Find the index of id: EID in the content."""
    return content.find(f"id: {eid}")


def fix_hedging_exercise(filepath: Path, eid: int, new_blanks: list, new_aa: list[list[str]]) -> bool:
    """Fix a single hedging exercise by replacing both blanks and acceptedAnswers."""
    content = filepath.read_text()
    idx = find_by_id(content, eid)
    if idx < 0:
        print(f"  [SKIP] #{eid}: not found")
        return False

    # Get the exercise block (id: EID to next id: or closing brace at the right level)
    # We'll search within 600 chars
    block = content[idx:idx + 600]

    # ── Replace blanks: find `blanks: [...]` ──
    blanks_match = re.search(r'blacks:\s*(\[[^\]]*\])', block)
    if not blanks_match:
        blanks_match = re.search(r'blanks:\s*(\[[^\]]*\])', block)
    if not blanks_match:
        print(f"  [WARN] #{eid}: no blanks found in block")
        return False

    old_blanks = blanks_match.group(1)
    new_blanks_str = "[" + ", ".join(f"'{esc(b)}'" for b in new_blanks) + "]"
    # Replace in full content
    actual_idx = content.find(old_blanks, idx)
    if actual_idx < 0 or actual_idx > idx + 600:
        print(f"  [WARN] #{eid}: blanks offset mismatch")
        return False
    content = content[:actual_idx] + new_blanks_str + content[actual_idx + len(old_blanks):]
    # Adjust idx for any length change
    len_diff = len(new_blanks_str) - len(old_blanks)
    if len_diff > 0:
        idx += len_diff

    # ── Replace acceptedAnswers: find the FULL outer array ──
    # The original format is: acceptedAnswers: [['...'], ['...'], ['...']]
    # We need to find the array that STARTS with [[ and ends with ]]
    # Strategy: find `acceptedAnswers:` then find the matching brackets

    # Find acceptedAnswers in the block (search from updated idx)
    aa_start = content.find("acceptedAnswers:", idx)
    if aa_start < 0 or aa_start > idx + 600:
        print(f"  [WARN] #{eid}: acceptedAnswers not found")
        return False

    # Find the opening `[` of the outer array (right after `:`)
    outer_bracket = content.find("[", aa_start)
    if outer_bracket < 0:
        print(f"  [WARN] #{eid}: no opening bracket for acceptedAnswers")
        return False

    # Count brackets to find the matching closing `]`
    depth = 0
    end_idx = -1
    for i in range(outer_bracket, min(outer_bracket + 500, len(content))):
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
            if depth == 0:
                end_idx = i + 1  # Include the closing bracket
                break

    if end_idx < 0:
        print(f"  [WARN] #{eid}: could not find matching closing bracket for acceptedAnswers")
        return False

    old_aa = content[aa_start:end_idx]  # e.g., "acceptedAnswers: [['might'], ['could'], ['may']]"
    
    # Build new acceptedAnswers
    inner_parts = []
    for group in new_aa:
        items = ", ".join(f"'{esc(s)}'" for s in group)
        inner_parts.append(f"[{items}]")
    new_aa_str = f"acceptedAnswers: [{', '.join(inner_parts)}]"

    content = content[:aa_start] + new_aa_str + content[end_idx:]

    filepath.write_text(content)
    print(f"  [FIXED] #{eid}: blanks={new_blanks_str}, aa={new_aa_str[:60]}...")
    return True


def main():
    filepath = BASE / "b2ModalsPragmatics.ts"
    if not filepath.exists():
        print(f"[ERROR] {filepath} not found!")
        return

    print(f"=== {filepath.name} ===")
    total = 0
    for eid, blanks, aa in HEDGING_FIXES:
        if fix_hedging_exercise(filepath, eid, blanks, aa):
            total += 1

    print(f"\nTotal: {total}/{len(HEDGING_FIXES)}")


if __name__ == "__main__":
    main()
