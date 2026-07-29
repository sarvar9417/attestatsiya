#!/usr/bin/env python3
"""
Fix remaining 49 blank-count issues using safe line-based matching.
Only modifies exercises with specific IDs that have known issues.
"""
import re, json, os

DAILY = 'src/data/daily'

# Known IDs with blank-count issues from the audit
# Format: {id: (file, expected_underscores, new_blanks)}
# new_blanks: list of string values for the blanks array
FIXES = {
    # These have slash-separated values that should be split
    95392: ('a1Part1.ts', 3, ["is", "are", "afternoon"]),
    95432: ('a1Part1.ts', 3, ["on", "at", "in"]),
    95444: ('a1Part1.ts', 2, ["7:30", "7:30"]),  # ___:___ → both blanks get 7:30
    95522: ('a1Part2.ts', 2, ["many", "is"]),
    900013: ('a1Articles.ts', 2, ["the", "an"]),
    900047: ('a1Articles.ts', 2, ["the", "the"]),
    95532: ('a1Part2.ts', 2, ["can't", "can"]),
    95114: ('a2Part1.ts', 2, ["must", "can"]),
    95131: ('a2Part1.ts', 3, ["at", "on", "in"]),
    95191: ('a2Part2.ts', 2, ["said", "told"]),
    24075: ('a2Part4.ts', 2, ["at", "in"]),
    95281: ('a2Part4.ts', 2, ["too", "enough"]),
    29160: ('a2Part4.ts', 2, ["so", "such"]),
    95051: ('b1Part1.ts', 2, ["will", "going"]),
    40050: ('b1Part1.ts', 2, ["future", "continuous"]),
    95061: ('b1Part1.ts', 2, ["must", "have"]),
    95031: ('b1Part1.ts', 2, ["must", "might"]),
    95011: ('b1Part1.ts', 2, ["have", "get"]),
    40234: ('b1Part1.ts', 2, ["have", "get"]),
    95021: ('b1Part1.ts', 2, ["do", "does"]),
    95024: ('b1Part1.ts', 2, ["do", "does"]),
    95091: ('b1Part1.ts', 2, ["if", "whether"]),
    95094: ('b1Part1.ts', 2, ["if", "whether"]),
    40325: ('b1Part1.ts', 2, ["both", "either"]),
    95101: ('b1Part1.ts', 2, ["so", "neither"]),
    95104: ('b1Part1.ts', 2, ["so", "neither"]),
    95661: ('b1plusPart2.ts', 2, ["ellipsis", "substitution"]),
    95721: ('b1plusPart2.ts', 2, ["by", "in"]),
    95351: ('b2Part1.ts', 2, ["seems", "may"]),
    95381: ('b2Part2.ts', 2, ["formal", "informal"]),
    95384: ('b2Part2.ts', 2, ["formal", "informal"]),
    100374: ('b2Part2.ts', 2, ["needn't", "didn't"]),
    100377: ('b2Part2.ts', 2, ["needn't", "didn't"]),
    960023: ('b2Part2.ts', 2, ["color", "colour"]),
    960046: ('b2Part2.ts', 2, ["color", "colour"]),
    # Reverse issues: 1 ___ but 3 blanks → keep only 1 blank (primary answer)
    970011: ('b2ModalsPragmatics.ts', 1, ["It seems"]),
    970014: ('b2ModalsPragmatics.ts', 1, ["I would suggest"]),
    970016: ('b2ModalsPragmatics.ts', 1, ["might"]),
    970019: ('b2ModalsPragmatics.ts', 1, ["Perhaps"]),
    # Passage issue #5045: 14 ___ but 13 blanks → add 14th blank
    5045: ('tensesMixedReview.ts', 14, ["are you doing", "am preparing", "am reading", "started", "have already read", "is", "about", "is", "travels", "sounds", "will read", "finish", "think", "will enjoy"]),
}

def fix_exercise(ex_id: int, file: str, expected_uc: int, new_blanks: list[str]) -> bool:
    """Fix the blanks array for a specific exercise ID in a file."""
    filepath = os.path.join(DAILY, file)
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    modified = False
    for i, line in enumerate(lines):
        if f'id: {ex_id}' in line:
            # Found the exercise. Now find the blanks array on this or next lines
            if 'blanks:' in line:
                # Replace blanks array on this line
                old = re.search(r'blanks:\s*\[([^\]]+)\]', line)
                if old:
                    # Build new blanks array string
                    new_blanks_str = json.dumps(new_blanks, ensure_ascii=False).replace('"', "'")
                    new_line = line.replace(old.group(0), f'blanks: {new_blanks_str}')
                    lines[i] = new_line
                    modified = True
                    # Verify the ___ count matches
                    q_match = re.search(r'question:\s*[\'"]([^\'"]*)[\'"]', new_line)
                    if q_match and ex_id != 5045:  # Skip verification for passage
                        uc = len(re.findall(r'_{2,}', q_match.group(1)))
                        if uc != expected_uc:
                            print(f'  ⚠️  #{ex_id}: Expected {expected_uc} ___ but found {uc}')
                    print(f'  ✅ #{ex_id} ({file}): → {new_blanks}')
                    break
            else:
                # blanks might be on next line for passage exercises
                if i + 1 < len(lines) and 'blanks:' in lines[i + 1]:
                    old = re.search(r'blanks:\s*\[([^\]]+)\]', lines[i + 1])
                    if old:
                        new_blanks_str = json.dumps(new_blanks, ensure_ascii=False).replace('"', "'")
                        lines[i + 1] = lines[i + 1].replace(old.group(0), f'blanks: {new_blanks_str}')
                        modified = True
                        print(f'  ✅ #{ex_id} ({file}): → {new_blanks}')
                        break
                # passage might have blanks on same line separated by space
                pass
    
    if modified:
        with open(filepath, 'w') as f:
            f.writelines(lines)
        return True
    else:
        print(f'  ❌ #{ex_id} ({file}): Not found!')
        return False

def main():
    print('=== QOLGAN 49 TA BLANK-COUNT XATOSINI TUZATISH ===\n')
    
    fixed = 0
    for ex_id, (file, expected_uc, new_blanks) in sorted(FIXES.items()):
        if fix_exercise(ex_id, file, expected_uc, new_blanks):
            fixed += 1
    
    print(f'\n=== YAKUN ===')
    print(f'Jami tuzatildi: {fixed}/{len(FIXES)}')
    print(f'\nTekshirish: npx tsc --noEmit && npx tsx scripts/audit-exercises.ts')

if __name__ == '__main__':
    main()
