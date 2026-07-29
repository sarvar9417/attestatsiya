#!/usr/bin/env python3
"""
Fix all 49 blank-count errors.

Pattern 1 (39 exercises): ___ count > blanks.length
  - Split single blanks entry by ' / ' or '...' or ',' separator into multiple entries

Pattern 2 (10 exercises): ___ count < blanks.length (hedging exercises)
  - Keep only first entry in blanks, add acceptedAnswers for remaining

Special cases that need manual mapping:
  - #40325: "all are possible with different meanings" → ["Both", "and"]
  - #95444: "7:30" → ["7", "30"]
  - #95522: "many" → ["many", "is"]
  - #960023: "the" → ["the", "the"]
  - #95384: "would resolve" → ["would", "resolve"]
  - #5045: passage with "are...doing" as first entry, split to ["are", "doing"]
"""

import re
import os
from pathlib import Path

BASE = Path("src/data/daily")

# ── FIX DEFINITIONS ──────────────────────────────────────────────
# Each entry: exercise_id -> new_blanks_array (and optionally acceptedAnswers)

FIXES = {
    # ── Pattern 1: Split by " / " ─────────────────────────────────
    # Alphabet & Greetings (3 ___, 1 blank "is / are / afternoon")
    95392: {"blanks": ["is", "are", "afternoon"]},
    # Days, Months & Seasons (3 ___, 1 blank "on / at / in")
    95432: {"blanks": ["on", "at", "in"]},
    # Prepositions of Time & Place (3 ___, 1 blank "on / at / in")
    95131: {"blanks": ["on", "at", "in"]},
    # Can / Can't (2 ___, 1 blank "can't / speaks")
    95532: {"blanks": ["can't", "speaks"]},
    # Modal Verbs (2 ___, 1 blank "might / must")
    95114: {"blanks": ["might", "must"]},
    # Reported Speech (2 ___, 1 blank "was / would")
    95191: {"blanks": ["was", "would"]},
    # Too and Enough (2 ___, 1 blank "too / enough")
    95281: {"blanks": ["too", "enough"]},
    # Future Forms Review (2 ___, 1 blank "is going to / will")
    95051: {"blanks": ["is going to", "will"]},
    # Future Forms Review (2 ___, 1 blank "are running / will go")
    40050: {"blanks": ["are running", "will go"]},
    # Modals of Obligation (2 ___, 1 blank "must / must")
    95061: {"blanks": ["must", "must"]},
    # Modals of Speculation (2 ___, 1 blank "must / have to")
    95031: {"blanks": ["must", "have to"]},
    # Causatives (2 ___, 1 blank "have it cut / cuts")
    95011: {"blanks": ["have it cut", "cuts"]},
    # Causatives (2 ___, 1 blank "had / cleaned")
    40234: {"blanks": ["had", "cleaned"]},
    # Question Tags (2 ___, 1 blank "aren't you / Do")
    95021: {"blanks": ["aren't you", "Do"]},
    # Question Tags (2 ___, 1 blank "didn't they / does he")
    95024: {"blanks": ["didn't they", "does he"]},
    # Indirect Questions (2 ___, 1 blank "lives / Does")
    95091: {"blanks": ["lives", "Does"]},
    # Indirect Questions (2 ___, 1 blank "wrote / do you")
    95094: {"blanks": ["wrote", "do you"]},
    # So / Neither + Auxiliaries (2 ___, 1 blank "So do / Neither can")
    95101: {"blanks": ["So do", "Neither can"]},
    # So / Neither + Auxiliaries (2 ___, 1 blank "Neither have / Neither will")
    95104: {"blanks": ["Neither have", "Neither will"]},
    # Ellipsis & Substitution (2 ___, 1 blank "So / Neither")
    95661: {"blanks": ["So", "Neither"]},
    # Prepositional Phrases (2 ___, 1 blank "In / With")
    95721: {"blanks": ["In", "With"]},
    # Hedging (2 ___, 1 blank "seems / may")
    95351: {"blanks": ["seems", "may"]},
    # Register (2 ___, 1 blank "to / children")
    95381: {"blanks": ["to", "children"]},
    # Advanced Modals (2 ___, 1 blank "needn't have / didn't need to")
    100374: {"blanks": ["needn't have", "didn't need to"]},
    # Advanced Modals (2 ___, 1 blank "should have / might have")
    100377: {"blanks": ["should have", "might have"]},
    # Paraphrasing & Summarising (2 ___, 1 blank "fell sharply / many")
    100414: {"blanks": ["fell sharply", "many"]},
    # Paraphrasing & Summarising (2 ___, 1 blank "demonstrate / major")
    100417: {"blanks": ["demonstrate", "major"]},
    # Advanced Verb Patterns (2 ___, 1 blank "to apply / leaving")
    100419: {"blanks": ["to apply", "leaving"]},
    # Articles: a/an/the (2 ___, 1 blank "the / the")
    900047: {"blanks": ["the", "the"]},
    # British vs American English (2 ___, 1 blank "cell / mobile")
    960046: {"blanks": ["cell", "mobile"]},

    # ── Pattern 1: Split by "..." ─────────────────────────────────
    # Time Prepositions (2 ___, 1 blank "from...to")
    24075: {"blanks": ["from", "to"]},
    # So and Such (2 ___, 1 blank "such a...that")
    29160: {"blanks": ["such a", "that"]},

    # ── Pattern 1: Split by ", " ──────────────────────────────────
    # Articles: a/an/the (2 ___, 1 blank "a, The")
    900013: {"blanks": ["a", "The"]},

    # ── Pattern 1: Special cases ──────────────────────────────────
    # Time & Daily Routines (2 ___, 1 blank "7:30")
    95444: {"blanks": ["7", "30"]},
    # There is / There are (2 ___, 1 blank "many")
    95522: {"blanks": ["many", "is"]},
    # British vs American English (2 ___, 1 blank "the")
    960023: {"blanks": ["the", "the"]},
    # Register (2 ___, 1 blank "would resolve")
    95384: {"blanks": ["would", "resolve"]},
    # Both / Either / Neither (2 ___, 1 blank "all are possible with different meanings")
    40325: {"blanks": ["Both", "and"]},

    # ── Pattern 1: Passage with "..." in first entry (14 ___, 13 blanks) ──
    # 6 Zamon Aralash Takrorlash: first blank is "are...doing" → split to ["are", "doing"]
    5045: {"blanks": [
        "are", "doing", "am preparing", "am reading", "started",
        "have already read", "is", "is", "travels", "sounds",
        "will read", "finish", "think", "will enjoy"
    ]},

    # ── Pattern 2: Hedging exercises (1 ___, 3 blanks) ────────────
    # These already have acceptedAnswers. Fix: keep only first blank, update acceptedAnswers.
    970002: {"blanks": ["might"], "acceptedAnswers": [["could", "may"]]},
    970011: {"blanks": ["It seems"], "acceptedAnswers": [["Apparently", "It appears"]]},
    970014: {"blanks": ["I would suggest"], "acceptedAnswers": [["Perhaps we could", "We might consider"]]},
    970016: {"blanks": ["might"], "acceptedAnswers": [["could", "may"]]},
    970019: {"blanks": ["Perhaps"], "acceptedAnswers": [["It seems", "Apparently"]]},
    970024: {"blanks": ["I would suggest"], "acceptedAnswers": [["Perhaps", "It seems"]]},
    970027: {"blanks": ["I think"], "acceptedAnswers": [["It seems", "Apparently"]]},
    970036: {"blanks": ["I think"], "acceptedAnswers": [["It seems", "Apparently"]]},
    970037: {"blanks": ["Perhaps"], "acceptedAnswers": [["I would suggest", "We might consider"]]},
    970039: {"blanks": ["Perhaps"], "acceptedAnswers": [["I think", "It seems"]]},
}


def escape_ts_string(s: str) -> str:
    """Escape a string for use in TypeScript single-quoted string."""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')


def make_blanks_array(blanks: list) -> str:
    """Create a TypeScript blanks array string."""
    parts = []
    for b in blanks:
        parts.append(f"'{escape_ts_string(b)}'")
    return "[" + ", ".join(parts) + "]"


def make_accepted_answers_array(aa: list[list[str]]) -> str:
    """Create a TypeScript acceptedAnswers array string (string[][])."""
    inner_parts = []
    for group in aa:
        items = ", ".join(f"'{escape_ts_string(s)}'" for s in group)
        inner_parts.append(f"[{items}]")
    return "[" + ", ".join(inner_parts) + "]"


def find_file_for_id(eid: int) -> Path | None:
    """Find which file contains the exercise ID."""
    for f in sorted(BASE.glob("*.ts")):
        content = f.read_text()
        if f"id: {eid}" in content:
            return f
    return None


def apply_fix(filepath: Path, eid: int, fix: dict) -> bool:
    """Apply fix for a single exercise ID in the given file."""
    content = filepath.read_text()
    
    new_blanks = make_blanks_array(fix["blanks"])
    has_accepted = "acceptedAnswers" in fix
    
    # Strategy: Find the exercise object containing this ID
    # We'll use regex to find the blanks array that belongs to this exercise
    
    # First, find the position of "id: EID"
    id_pattern = f"id: {eid}"
    idx = content.find(id_pattern)
    if idx < 0:
        print(f"  [SKIP] #{eid}: not found in {filepath.name}")
        return False
    
    # Get a slice of the exercise object (from id: to next closing brace or next id:)
    exercise_slice = content[idx:idx + 800]
    
    # Find the blanks array in this slice
    blanks_match = re.search(r'blanks:\s*(\[[^\]]*\])', exercise_slice)
    if not blanks_match:
        print(f"  [WARN] #{eid}: found id but no blanks array nearby")
        return False
    
    old_blanks_str = blanks_match.group(0)
    new_blanks_str = f"blanks: {new_blanks}"
    
    # Also handle acceptedAnswers
    old_accepted_str = None
    if has_accepted:
        accepted_match = re.search(r'acceptedAnswers:\s*(\[.*?\])\s*[,}]', exercise_slice, re.DOTALL)
        if accepted_match:
            old_accepted_str = accepted_match.group(0)
    
    # Now apply the replacement in the FULL content
    # We need to find the exact match in the full file content
    actual_idx = content.find(old_blanks_str, idx)
    if actual_idx < 0 or actual_idx > idx + 800:
        print(f"  [WARN] #{eid}: blanks match found in slice but not in full file (offset issue)")
        print(f"    Searching for: {old_blanks_str[:60]}...")
        return False
    
    # Replace blanks
    content = content[:actual_idx] + new_blanks_str + content[actual_idx + len(old_blanks_str):]
    
    # Handle acceptedAnswers for hedging exercises
    if has_accepted and old_accepted_str:
        new_accepted_str = f"acceptedAnswers: {make_accepted_answers_array(fix['acceptedAnswers'])}"
        content = content.replace(old_accepted_str, new_accepted_str, 1)
        print(f"  [FIXED+AA] #{eid}: updated blanks and acceptedAnswers in {filepath.name}")
    elif has_accepted and not old_accepted_str:
        # Need to add acceptedAnswers after blanks
        # Find where blanks now is and add acceptedAnswers after it
        new_blanks_idx = content.find(new_blanks_str, idx)
        if new_blanks_idx >= 0:
            aa_str = make_accepted_answers_array(fix["acceptedAnswers"])
            insert_pos = new_blanks_idx + len(new_blanks_str)
            content = content[:insert_pos] + f", acceptedAnswers: {aa_str}" + content[insert_pos:]
            print(f"  [FIXED+NEWAA] #{eid}: added acceptedAnswers in {filepath.name}")
        else:
            print(f"  [WARN] #{eid}: couldn't find new blanks to add acceptedAnswers")
            return False
    else:
        print(f"  [FIXED] #{eid}: blanks updated in {filepath.name}")
    
    filepath.write_text(content)
    return True


def main():
    # Group fixes by file
    file_fixes: dict[Path, list[int]] = {}
    for eid in sorted(FIXES.keys()):
        fp = find_file_for_id(eid)
        if fp:
            if fp not in file_fixes:
                file_fixes[fp] = []
            file_fixes[fp].append(eid)
        else:
            print(f"[ERROR] #{eid}: file not found!")
    
    total = 0
    for fp, eids in sorted(file_fixes.items()):
        print(f"\n=== {fp.name} ===")
        file_total = 0
        for eid in eids:
            success = apply_fix(fp, eid, FIXES[eid])
            if success:
                file_total += 1
                total += 1
        print(f"  Fixed: {file_total}/{len(eids)}")
    
    print(f"\n{'='*40}")
    print(f"Total fixed: {total}/{len(FIXES)}")


if __name__ == "__main__":
    main()
