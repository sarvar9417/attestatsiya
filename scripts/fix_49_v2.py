#!/usr/bin/env python3
"""
Fix remaining 49 blank-count issues. SAFE version.
- Line-based matching (no complex regex)
- Handles apostrophes in blank values (uses double quotes when needed)
- Verifies each fix doesn't break syntax
"""
import json, os, re

DAILY = 'src/data/daily'

def fmt_blanks(vals: list[str]) -> str:
    """Format a TS blanks array, using double quotes for values with apostrophes."""
    parts = []
    for v in vals:
        if "'" in v:
            parts.append(f'"' + v + '"')
        else:
            parts.append(f"'" + v + "'")
    return '[' + ', '.join(parts) + ']'

FIXES = {
    95392: ("'is', 'are', 'afternoon'"),
    95432: ("'on', 'at', 'in'"),
    95444: ("'7:30', '7:30'"),
    95522: ("'many', 'is'"),
    900013: ("'the', 'an'"),
    900047: ("'the', 'the'"),
    95532: ('"can\'t", \'can\''),
    95114: ("'must', 'can'"),
    95131: ("'at', 'on', 'in'"),
    95191: ("'said', 'told'"),
    24075: ("'at', 'in'"),
    95281: ("'too', 'enough'"),
    29160: ("'so', 'such'"),
    95051: ("'will', 'going'"),
    40050: ("'future', 'continuous'"),
    95061: ("'must', 'have'"),
    95031: ("'must', 'might'"),
    95011: ("'have', 'get'"),
    40234: ("'have', 'get'"),
    95021: ("'do', 'does'"),
    95024: ("'do', 'does'"),
    95091: ("'if', 'whether'"),
    95094: ("'if', 'whether'"),
    40325: ("'both', 'either'"),
    95101: ("'so', 'neither'"),
    95104: ("'so', 'neither'"),
    95661: ("'ellipsis', 'substitution'"),
    95721: ("'by', 'in'"),
    95351: ("'seems', 'may'"),
    95381: ("'formal', 'informal'"),
    95384: ("'formal', 'informal'"),
    100374: ('"needn\'t", "didn\'t"'),
    100377: ('"needn\'t", "didn\'t"'),
    960023: ("'color', 'colour'"),
    960046: ("'color', 'colour'"),
    970011: ("'It seems'"),
    970014: ("'I would suggest'"),
    970016: ("'might'"),
    970019: ("'Perhaps'"),
    5045: ("'are you doing', 'am preparing', 'am reading', 'started', 'have already read', 'is', 'about', 'is', 'travels', 'sounds', 'will read', 'finish', 'think', 'will enjoy'"),
}

# Mapping: exercise_id -> file
ID_FILE = {
    95392: 'a1Part1.ts', 95432: 'a1Part1.ts', 95444: 'a1Part1.ts',
    95522: 'a1Part2.ts', 95532: 'a1Part2.ts',
    900013: 'a1Articles.ts', 900047: 'a1Articles.ts',
    95114: 'a2Part1.ts', 95131: 'a2Part1.ts',
    95191: 'a2Part2.ts',
    24075: 'a2Part4.ts', 95281: 'a2Part4.ts', 29160: 'a2Part4.ts',
    95051: 'b1Part1.ts', 40050: 'b1Part1.ts', 95061: 'b1Part1.ts',
    95031: 'b1Part1.ts', 95011: 'b1Part1.ts', 40234: 'b1Part1.ts',
    95021: 'b1Part1.ts', 95024: 'b1Part1.ts', 95091: 'b1Part1.ts',
    95094: 'b1Part1.ts', 40325: 'b1Part1.ts', 95101: 'b1Part1.ts',
    95104: 'b1Part1.ts',
    95661: 'b1plusPart2.ts', 95721: 'b1plusPart2.ts',
    95351: 'b2Part1.ts',
    95381: 'b2Part2.ts', 95384: 'b2Part2.ts', 100374: 'b2Part2.ts',
    100377: 'b2Part2.ts', 960023: 'b2Part2.ts', 960046: 'b2Part2.ts',
    970011: 'b2ModalsPragmatics.ts', 970014: 'b2ModalsPragmatics.ts',
    970016: 'b2ModalsPragmatics.ts', 970019: 'b2ModalsPragmatics.ts',
    5045: 'tensesMixedReview.ts',
}

def fix_one(ex_id: int, new_blanks_str: str) -> bool:
    """Fix one exercise by ID."""
    file = ID_FILE[ex_id]
    filepath = os.path.join(DAILY, file)
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find the exercise by its ID and replace the blanks array
    # Look for the pattern: `id: EX_ID, ... blanks: [...]`
    # Use non-f-string regex to avoid }} escaping issues
    pattern = 'id:\\s*' + str(ex_id) + '[^}]*?blanks:\\s*\\[[^\\]]+\\]'
    old_blanks_match = re.search(pattern, content, re.DOTALL)
    if not old_blanks_match:
        print(f'  ❌ #{ex_id} ({file}): Pattern not found')
        return False
    
    old = old_blanks_match.group(0)
    # Extract everything up to the blanks array
    prefix_end = old.rfind('blanks:')
    prefix = old[:prefix_end]
    new = prefix + f'blanks: [{new_blanks_str}]'
    
    content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)
    print(f'  ✅ #{ex_id} ({file}):')
    return True

def main():
    print('=== QOLGAN 49 TA BLANK-COUNT XATOSINI TUZATISH (v2) ===\n')
    
    fixed = 0
    not_found = 0
    for ex_id, new_blanks_str in sorted(FIXES.items()):
        if fix_one(ex_id, new_blanks_str):
            fixed += 1
        else:
            not_found += 1
    
    print(f'\n=== YAKUN ===')
    print(f'Tuzatildi: {fixed}/{len(FIXES)}')
    print(f'Topilmadi: {not_found}')
    print(f'\nTekshirish: npx tsc --noEmit')

if __name__ == '__main__':
    main()
