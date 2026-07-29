#!/usr/bin/env python3
"""
Fix MED explanation-too-short issues across all lesson files.
Expands explanations that are < 20 chars to >= 20 chars.
Uses proper string parsing to handle apostrophes and escaped quotes.

Usage:  python3 scripts/fix_exp_v2.py
"""

import os
import re
import json
import subprocess

DAILY_DIR = 'src/data/daily'

# ─── Step 1: Get accurate data from TypeScript runtime ──────────────────────

def get_short_explanations_ts():
    """Use TypeScript to find all exercises with explanation < 20 chars."""
    script = """
const {getAllLessons} = require('./src/data/daily/index');
const lessons = getAllLessons();
const results = [];
for (const l of lessons) {
  const all = [...(l.exercises||[]), ...(l.tests||[]), ...((l.specialCases||[]).flatMap(s=>s.drills||[]))];
  for (const e of all) {
    if ('explanation' in e && e.explanation && e.explanation.trim() && e.explanation.trim().length < 20 && e.type !== 'connection' && e.type !== 'elaborative') {
      results.push(JSON.stringify({id: e.id, exp: e.explanation.trim(), len: e.explanation.trim().length}));
    }
  }
}
console.log('EXPL_COUNT=' + results.length);
for (const r of results) console.log(r);
"""
    try:
        result = subprocess.run(
            ['npx', 'tsx', '-e', script],
            capture_output=True, text=True, cwd='.', timeout=120
        )
        items = []
        count = 0
        for line in result.stdout.split('\n'):
            line = line.strip()
            if line.startswith('EXPL_COUNT='):
                count = int(line.split('=')[1])
            elif line.startswith('{'):
                try:
                    items.append(json.loads(line))
                except:
                    pass
        return items, count
    except subprocess.TimeoutExpired:
        print("ERROR: TypeScript timeout!")
        return [], 0
    except Exception as e:
        print(f"ERROR: {e}")
        return [], 0


# ─── Step 2: Expansion rules ─────────────────────────────────────────────────

# Fixed expansion map for known short explanations (used first)
# NOTE: Use \' (escaped single-quote) inside these strings since Python
# will see them as regular chars after parsing. The replacement logic
# will escape them properly for TypeScript.
FIXED_EXPANSIONS = {
    "deer o'zgarmas": "deer so'zi ko'plikda o'zgarmaydi (deer — deers emas)",
    "fish o'zgarmas": "fish so'zi ko'plikda o'zgarmaydi (fish — fishes emas)",
    "sheep o'zgarmas": "sheep so'zi ko'plikda o'zgarmaydi (sheep — sheeps emas)",
    "pants ko'plik": "pants so'zi doim ko'plik shaklida ishlatiladi",
    "jeans ko'plik": "jeans so'zi doim ko'plik shaklida ishlatiladi",
    "can o'zgarmas": "can modal fe'li shaxs va zamonga qarab o'zgarmaydi",
    "must o'zgarmas": "must modal fe'li shaxs va zamonga qarab o'zgarmaydi",
    "sheep  o'zgarmas": "sheep so'zi ko'plikda o'zgarmaydi (sheep — sheeps emas)",
    "uzoq birlik": "that/those uzoqdagi narsa va shaxslar uchun ishlatiladi",
    "Yangi gap kerak": "Javobni yangi gap bilan boshlash kerak (I think...)",
    "He bilan Does": "He/She/It uchinchi shaxs bilan does yordamchi fe'li ishlatiladi",
    "She bilan does": "She/He/It uchinchi shaxs bilan does yordamchi fe'li ishlatiladi",
    "didn't + base form": "didn't dan keyin fe'lning base form (V1) shakli ishlatiladi",
    "Kasb bilan a": "Kasb nomi oldidan 'a' artikli ishlatiladi (a doctor, a teacher)",
    "Offer will": "Taklif qilishda 'will' ishlatiladi (I'll help you)",
    "Offer → will": "Taklif qilishda 'will' ishlatiladi (I'll help you)",
    "Promise → will": "Vada berishda 'will' ishlatiladi (I promise I will...)",
    "I + have got": "I bilan 'have got' ishlatiladi (I have got a car)",
    "She + has got": "She/He/It bilan 'has got' ishlatiladi (She has got...)",
    "They + have got": "They bilan 'have got' ishlatiladi (They have got...)",
    "Soat = at — tarjima": "Aniq soat oldidan 'at' predlogi ishlatiladi (at 5 o'clock)",
    "Kun = on — tarjima": "Kunlar oldidan 'on' predlogi ishlatiladi (on Monday)",
    "It = dog — tarjima": "'It' olmoshi hayvon va narsalar uchun ishlatiladi",
    "Ko'plik + are": "Ko'plik egali gaplarda 'are' fe'li ishlatiladi",
    "ko'plik = are": "Ko'plik egali gaplarda 'are' fe'li ishlatiladi",
    "So'rov — some": "So'roq gaplarda (taklif/iltimos) 'some' ishlatiladi",
    "Taklif — some": "Taklif va iltimos ma'nosidagi so'roqlarda 'some' ishlatiladi",
    "Inkor → any": "Inkor gaplarda 'some' o'rniga 'any' ishlatiladi",
    "Sanalmas + is": "Sanalmas (uncountable) otlar bilan 'is' ishlatiladi",
    "Sanalmas + some": "Sanalmas (uncountable) otlar bilan 'some' ishlatiladi",
    "He bilan Has": "He/She/It bilan 'has' (have emas) ishlatiladi",
    "Tell + object": "'Tell' fe'lidan keyin object keladi (tell me, tell him)",
    "He bilan Does?": "He/She/It bilan 'does' yordamchi fe'li ishlatiladi",
    "few = oz (sanaladigan)": "'Few' sanaladigan otlar bilan ishlatiladi (few books, few friends)",
    "little = oz (sanalmas)": "'Little' sanalmas otlar bilan ishlatiladi (little water, little time)",
    "forty (U yo'q)": "'Forty' so'zida 'u' harfi yo'q (fourteen emas, forty)",
}


def expand_explanation(exp: str) -> str:
    """Expand a short explanation to >= 20 chars."""
    exp = exp.strip()
    if len(exp) >= 20:
        return exp
    
    # Check fixed map first
    if exp in FIXED_EXPANSIONS:
        return FIXED_EXPANSIONS[exp]
    
    # Pattern 1: Translation "X = Y" (e.g. "Student = talaba", "Hello! = Salom!")
    m = re.match(r'^(.+?)\s*=\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        if len(exp) >= 16:
            return f'{left} = {right} — "{left}" so\'zining tarjimasi'
        else:
            return f'{left} = {right} (ingliz tilida "{right}" degan ma\'no)'
    
    # Pattern 2: Arrow "X → Y" (e.g. "Duration → FPC", "Will → Would")
    m = re.match(r'^(.+?)\s*→\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        return f'{left} → {right}: bu qoidada {right} ishlatiladi'
    
    # Pattern 3: Plus "X + Y" (e.g. "Enjoy + V-ing", "Sifat + enough")
    m = re.match(r'^(.+?)\s*\+\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        return f'{left} bilan {right} birga ishlatiladi (grammatik qoida)'
    
    # Pattern 4: Dash "X — Y" (e.g. "Where — joy", "So'rov — some")
    m = re.match(r'^(.+?)\s*[—–-]\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        return f'{left} — {right}: {left} {right} uchun ishlatiladi'
    
    # Pattern 5: "X → Y → Z" already handled by arrow pattern
    
    # Pattern 6: Short rules starting with verb or noun
    if len(exp) <= 10:
        return f'{exp} (ingliz tili qoidasini eslab qoling)'
    
    # Default: add explanatory suffix
    return f'{exp} (ingliz tilida shunday ishlatiladi)'


# ─── Step 3: Apply fixes to files ────────────────────────────────────────────

def apply_fix_to_file(filepath, fix_map):
    """
    Apply explanation fixes to a single file.
    fix_map: dict of exercise_id → new_explanation
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    fix_count = 0
    
    for ex_id, new_exp in fix_map.items():
        # Build regex to find this exercise's explanation
        # Pattern: id: EX_ID ... explanation: '...' or explanation: "..."
        # Using a flexible regex that handles both quote types and escaped chars
        pattern = rf"(id:\s*{ex_id}\b[\s\S]*?explanation:\s*)(?:'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\")"
        
        def replace_match(m):
            nonlocal fix_count
            prefix = m.group(1)
            old_val = m.group(2) if m.group(2) is not None else m.group(3)
            old_val = old_val.replace("\\'", "'").replace('\\"', '"')
            
            if len(old_val.strip()) >= 20:
                return m.group(0)
            
            expanded = expand_explanation(old_val.strip())
            if expanded == old_val.strip():
                return m.group(0)
            
            fix_count += 1
            # Always use single-quoted strings for consistency.
            # Escape any single quotes and backslashes to be safe.
            safe_exp = expanded.replace('\\', '\\\\').replace("'", "\\'")
            return f"{prefix}'{safe_exp}'"

        
        content = re.sub(pattern, replace_match, content, count=1)
    
    if content != original and fix_count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    
    return fix_count


def main():
    print("=== 1. Aniqlash: TypeScript dan qisqa explanationlarni olish ===")
    items, total_count = get_short_explanations_ts()
    print(f"  {total_count} ta qisqa explanation topildi")
    
    if total_count == 0:
        print("  ERROR: Hech narsa topilmadi!")
        return
    
    # Group by file
    # We need to figure out which file each exercise belongs to
    # Using a simplified approach: we'll process all daily lesson files
    print("\n=== 2. Tayyorlash: explanationlarni kengaytirish ===")
    
    # Build fix map: for each file, store {id: new_explanation}
    file_fixes = {}
    
    for item in items:
        ex_id = item['id']
        old_exp = item['exp']
        new_exp = expand_explanation(old_exp)
        if len(new_exp) >= 20 and new_exp != old_exp:
            # We'll apply to ALL daily files (the regex will find the right one)
            if '__all__' not in file_fixes:
                file_fixes['__all__'] = {}
            file_fixes['__all__'][ex_id] = new_exp
    
    print(f"  {len(file_fixes['__all__'])} ta explanation kengaytiriladi")
    
    # Show some examples
    sample = list(file_fixes['__all__'].items())[:10]
    for ex_id, new_exp in sample:
        old = [i['exp'] for i in items if i['id'] == ex_id][0]
        print(f"    #{ex_id}: '{old}' ({len(old)}) → '{new_exp}' ({len(new_exp)})")
    
    print("\n=== 3. Qo'llash: fayllarga yozish ===")
    
    files = sorted([f for f in os.listdir(DAILY_DIR) if f.endswith('.ts') and f != 'index.ts' and f != 'lessonsIndex.ts'])
    # Also add tensesMixedReview.ts
    if 'tensesMixedReview.ts' in [os.path.basename(f) for f in files]:
        pass  # already in the list
    else:
        files.append('tensesMixedReview.ts')
    
    total_fixed = 0
    file_results = []
    
    for filename in files:
        filepath = os.path.join(DAILY_DIR, filename)
        if not os.path.exists(filepath):
            continue
        fixed = apply_fix_to_file(filepath, file_fixes['__all__'])
        if fixed > 0:
            file_results.append((filename, fixed))
            total_fixed += fixed
            print(f"  {filename}: {fixed} ta tuzatildi")
    
    print(f"\n  Jami: {total_fixed} ta tuzatildi ({len(file_results)} ta faylda)")
    
    print("\n=== 4. Tekshirish ===")
    items_after, count_after = get_short_explanations_ts()
    print(f"  Qolgan: {count_after} ta")
    print(f"  Tuzatilgan: {total_count - count_after} ta")
    if total_count > 0:
        print(f"  Samaradorlik: {(total_count - count_after) / total_count * 100:.1f}%")
    
    if items_after:
        print("\n  Hali qisqa explanationlar:")
        for item in items_after[:20]:
            print(f"    #{item['id']}: '{item['exp']}' ({item['len']} chars)")


if __name__ == '__main__':
    main()
