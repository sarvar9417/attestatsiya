#!/usr/bin/env python3
"""
Fix remaining 49 blank-count issues across lesson files.

Patterns:
  1) Single blank with slash-separated values that split to match ___ count
     e.g. blanks: ["is / are / afternoon"] -> blanks: ["is", "are", "afternoon"]
  2) Single blank for multiple ___ (time formats, etc.)
     e.g. blanks: ['7:30'] for ___:___ -> needs 2 blanks or 1 ___
  3) Multiple blanks for single ___ (accept-any exercises)
     e.g. blanks: ['It seems', 'Apparently', 'It appears'] for 1 ___ -> keep 1 blank
  4) Passage with wrong blank count
"""
import os, re, json

DAILY = 'src/data/daily'

def count_underscores(text: str) -> int:
    return len(re.findall(r'_{2,}', text))

def parse_blanks(blanks_content: str) -> list[str]:
    """Extract individual blank values from a TS blanks array string."""
    values = re.findall(r'[\'"]([^\'"]*?)[\'"]', blanks_content)
    return values

def fix_file(relpath: str) -> int:
    filepath = os.path.join(DAILY, relpath)
    if not os.path.exists(filepath):
        return 0
    with open(filepath, 'r') as f:
        content = f.read()
    
    fixes = 0
    
    # Find all fill-blank and passage exercises
    # Use a more robust approach - find each exercise by looking for id: followed by the exercise body
    for ex_type in ['fill-blank', 'passage']:
        pattern = re.compile(
            r'(\{\s*id:\s*\d+[^}]*?type:\s*[\'"]' + ex_type + r'[\'"][^}]*?blanks:\s*\[([^\]]+)\][^}]*?\})',
            re.DOTALL
        )
        
        for match in pattern.finditer(content):
            full_obj = match.group(1)
            blanks_content = match.group(2)
            
            id_match = re.search(r'id:\s*(\d+)', full_obj)
            if not id_match:
                continue
            ex_id = int(id_match.group(1))
            
            # Get text to count ___
            q_match = re.search(r'question:\s*[\'"]([^\'"]*)[\'"]', full_obj)
            p_match = re.search(r'passage:\s*[\'"]([^\'"]*)[\'"]', full_obj)
            text = q_match.group(1) if q_match else (p_match.group(1) if p_match else '')
            
            uc = count_underscores(text)
            blank_values = parse_blanks(blanks_content)
            bl = len(blank_values)
            
            if uc == bl:
                continue  # Already fine
            
            old_blanks_match = re.search(r'blanks:\s*\[[^\]]+\]', full_obj)
            if not old_blanks_match:
                continue
            
            old_blanks_str = old_blanks_match.group(0)
            
            # Pattern 1: Single blank with slash-separated values
            if bl == 1 and uc > 1:
                bv = blank_values[0]
                # Try splitting by /
                if '/' in bv:
                    parts = [p.strip() for p in bv.split('/')]
                    if len(parts) == uc:
                        new_blanks = json.dumps(parts, ensure_ascii=False).replace('"', "'")
                        new_blanks_str = f'blanks: {new_blanks}'
                        content = content.replace(old_blanks_str, new_blanks_str, 1)
                        fixes += 1
                        print(f'  ✅ #{ex_id}: Split "/" → {parts}')
                        continue
                
                # Try splitting by , (comma)
                if ',' in bv:
                    parts = [p.strip() for p in bv.split(',')]
                    if len(parts) == uc:
                        new_blanks = json.dumps(parts, ensure_ascii=False).replace('"', "'")
                        new_blanks_str = f'blanks: {new_blanks}'
                        content = content.replace(old_blanks_str, new_blanks_str, 1)
                        fixes += 1
                        print(f'  ✅ #{ex_id}: Split "," → {parts}')
                        continue
                
                # Check if blank value contains || (double pipe)
                if '||' in bv:
                    parts = [p.strip() for p in bv.split('||')]
                    if len(parts) == uc:
                        new_blanks = json.dumps(parts, ensure_ascii=False).replace('"', "'")
                        new_blanks_str = f'blanks: {new_blanks}'
                        content = content.replace(old_blanks_str, new_blanks_str, 1)
                        fixes += 1
                        print(f'  ✅ #{ex_id}: Split "||" → {parts}')
                        continue
                
                # Blank value doesn't split nicely. 
                # If blank is a single value for multiple ___, keep 1 ___ in question
                # This means reducing ___ in question to 1
                print(f'  ⚠️  #{ex_id}: Can/t split blank "{bv}" for {uc} ___')
            
            # Pattern 2: More blanks than ___ (accept-any style)
            elif bl > 1 and uc == 1:
                # These exercises accept any of the options as the answer
                # Keep only 1 blank in the array, or merge them with / separator
                if len(set(blank_values)) > 1:
                    # Different values - they're alternatives. Keep first as primary.
                    new_blanks = json.dumps([blank_values[0]], ensure_ascii=False).replace('"', "'")
                    new_blanks_str = f'blanks: {new_blanks}'
                    content = content.replace(old_blanks_str, new_blanks_str, 1)
                    fixes += 1
                    print(f'  ✅ #{ex_id}: Multiple blanks→1 (accept-any): "{blank_values[0]}"')
                else:
                    # Same values - just keep one
                    new_blanks = json.dumps([blank_values[0]], ensure_ascii=False).replace('"', "'")
                    new_blanks_str = f'blanks: {new_blanks}'
                    content = content.replace(old_blanks_str, new_blanks_str, 1)
                    fixes += 1
                    print(f'  ✅ #{ex_id}: Multiple blanks→1 (duplicates): "{blank_values[0]}"')
            
            elif bl > uc and uc > 1 and bl > 1:
                # More blanks than ___. Trim extra blanks.
                new_blanks = json.dumps(blank_values[:uc], ensure_ascii=False).replace('"', "'")
                new_blanks_str = f'blanks: {new_blanks}'
                content = content.replace(old_blanks_str, new_blanks_str, 1)
                fixes += 1
                print(f'  ✅ #{ex_id}: Trimmed to {uc} blanks: {blank_values[:uc]}')
            
            elif uc > bl and bl > 1 and '/' not in blank_values[0] and ',' not in blank_values[0]:
                # More ___ than blanks, but blanks are already split. Need to add blanks.
                # This is hard to auto-fix. Log it.
                print(f'  ⚠️  #{ex_id}: {uc} ___ ≠ {bl} blanks. Values: {blank_values}')
    
    if fixes:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f'  💾 Saved {relpath} ({fixes} fixes)')
    return fixes

def main():
    print('=== QOLGAN BLANK-COUNT XATOLARINI TUZATISH ===\n')
    
    # Get all lesson files
    ts_files = sorted([f for f in os.listdir(DAILY) if f.endswith('.ts') and not f.endswith('index.ts') and not f.endswith('.safe')])
    
    total_fixes = 0
    for ts_file in ts_files:
        fixes = fix_file(ts_file)
        total_fixes += fixes
    
    print(f'\n=== YAKUN ===')
    print(f'Jami tuzatishlar: {total_fixes}')
    print(f'\nTekshirish: npx tsc --noEmit && npx tsx scripts/audit-exercises.ts')

if __name__ == '__main__':
    main()
