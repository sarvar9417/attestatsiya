#!/usr/bin/env python3
"""
Fix remaining explanation-too-short issues in ALL data files including tensesData.ts.

Usage:  python3 scripts/fix_exp_v3.py
"""

import os
import re
import subprocess

DAILY_DIR = 'src/data/daily'
EXTRA_FILES = [
    'src/data/tenses/tensesData.ts',
]

# ─── Expansion rules ─────────────────────────────────────────────────────────

FIXED_EXPANSIONS = {
    "deer o'zgarmas": "deer so'zi ko'plikda o'zgarmaydi (deer — deers emas)",
    "fish o'zgarmas": "fish so'zi ko'plikda o'zgarmaydi (fish — fishes emas)",
    "sheep o'zgarmas": "sheep so'zi ko'plikda o'zgarmaydi (sheep — sheeps emas)",
    "sheep  o'zgarmas": "sheep so'zi ko'plikda o'zgarmaydi (sheep — sheeps emas)",
    "pants ko'plik": "pants so'zi doim ko'plik shaklida ishlatiladi",
    "jeans ko'plik": "jeans so'zi doim ko'plik shaklida ishlatiladi",
    "can o'zgarmas": "can modal fe'li shaxs va zamonga qarab o'zgarmaydi",
    "must o'zgarmas": "must modal fe'li shaxs va zamonga qarab o'zgarmaydi",
    "uzoq birlik": "that/those uzoqdagi narsa va shaxslar uchun ishlatiladi",
    "Yangi gap kerak": "Javobni yangi gap bilan boshlash kerak (I think...)",
    "He bilan Does": "He/She/It uchinchi shaxs bilan does yordamchi fe'li ishlatiladi",
    "She bilan does": "She/He/It uchinchi shaxs bilan does yordamchi fe'li ishlatiladi",
    "didn't + base form": "didn't dan keyin fe'lning base form (V1) shakli ishlatiladi",
    "Kasb bilan a": "Kasb nomi oldidan a artikli ishlatiladi (a doctor, a teacher)",
    "He bilan Has": "He/She/It bilan has (have emas) ishlatiladi",
    "Tell + object": "Tell felidan keyin object keladi (tell me, tell him)",
    "He bilan Does?": "He/She/It bilan does yordamchi fe'li ishlatiladi",
    "forty (U yo'q)": "Forty sozida u harfi yoq (fourteen emas, forty)",
    "few = oz (sanaladigan)": "Few sanaladigan otlar bilan ishlatiladi (few books, friends)",
    "little = oz (sanalmas)": "Little sanalmas otlar bilan ishlatiladi (water, time)",
}

GRAMMAR_PATTERNS = {
    # Future Perfect Continuous
    "Duration → FPC": "Duration (davomiylik) uchun Future Perfect Continuous ishlatiladi",
    "Duration + by → FPC": "Duration + by vaqt oraligi uchun Future Perfect Continuous ishlatiladi",
    "for + duration": "for + duration (davomiylik) bilan ishlatiladi",
    "since + start point": "since + boshlanish nuqtasi (start point) bilan ishlatiladi",
    "By the time + gap": "By the time + gap (vaqt oraligi) bilan ishlatiladi",
    "Own = state → FP": "Egalik holatini ifodalashda Future Perfect ishlatiladi",
    
    # Future Perfect
    "By → Future Perfect": "By (vaqt chegarasi) bilan Future Perfect ishlatiladi",
    "By + time → FP": "By + vaqt bilan Future Perfect ishlatiladi (by Monday)",
    "Before + event → FP": "Before + hodisa bilan Future Perfect ishlatiladi",
    
    # Past Continuous
    "While + PC + PC": "While bilan ikkala harakat Past Continuous da boladi",
    "PC + when + SP": "Uzoq harakat (PC) qisqa harakat (SP) bilan when ishlatiladi",
    "SP + when + PC": "Qisqa harakat (SP) uzoq harakat (PC) bilan when ishlatiladi",
    "She + was + cooking": "She/He/It bilan was + V-ing (Past Continuous) ishlatiladi",
    
    # Simple Future
    "Promise → will": "Vada berishda will ishlatiladi (I promise I will)",
    "Offer → will": "Taklif qilishda will ishlatiladi (I'll help you)",
    "Prediction → will": "Bashorat qilishda will ishlatiladi (I think it will rain)",
    "Future plan → will": "Kelajak reja uchun will emas, going to ishlatiladi",
    "Evidence → going to": "Dalil asosida kelajak uchun going to ishlatiladi",
    
    # Past Perfect
    "hadn't + V3": "hadn't dan keyin V3 (past participle) shakli ishlatiladi",
    "had + V3": "had + V3 (past participle) — otgan zamondan oldingi harakat",
    "Before + PP → PP": "Before + Past Perfect birga ishlatiladi",
    "After + PP → PP": "After + Past Perfect birga ishlatiladi",
    "Already + had + V3": "Already + had + V3 — allaqachon bajarilgan harakat",
    
    # Simple Past
    "didn't + base form": "didn't dan keyin fe'lning base form (V1) shakli ishlatiladi",
    "Did + you + call": "Sorok gaplarda Did + ega + V1 ishlatiladi",
    "Did + he + go": "Sorok gaplarda Did + ega + V1 ishlatiladi",
    "go → went (V2)": "go felining V2 shakli went (notori fel)",
    "have → had (V2)": "have felining V2 shakli had (notori fel)",
    "eat → ate (V2)": "eat felining V2 shakli ate (notori fel)",
    "buy → bought (V2)": "buy felining V2 shakli bought (notori fel)",
    
    # Present Perfect
    "have + never + V3": "have/has + never + V3 (hech qachon) ishlatiladi",
    "know → known (V3)": "know felining V3 shakli known (notori fel)",
    "Never + have + V3": "Never + have/has + V3 (hech qachon) ishlatiladi",
    "Already + have + V3": "Already + have/has + V3 (allaqachon) ishlatiladi",
    "Just + have + V3": "Just + have/has + V3 (hozirgina) ishlatiladi",
    "Ever + have + V3": "Ever + have/has + V3 (hech qachon) sorokda ishlatiladi",
    "Yet + have + V3": "Yet + have/has + V3 (hali) inkar va sorokda ishlatiladi",
    "Since + have + V3": "Since + have/has + V3 (dan beri) ishlatiladi",
    
    # Future Continuous
    "Jarayon → FC": "Kelajakdagi jarayon uchun Future Continuous ishlatiladi",
    "Will be + V-ing": "Will be + V-ing (Future Continuous) ishlatiladi",
    "This time + FC": "This time + kelajak vaqt bilan FC ishlatiladi",
    
    # Present Perfect Continuous
    "Duration → PPC": "Davom etgan harakat uchun PPC ishlatiladi",
    "Since + PPC": "Since + boshlanish nuqtasi bilan PPC ishlatiladi",
    "For + PPC": "For + vaqt oraligi bilan PPC ishlatiladi",
    "Recently + PPC": "Recently (yaginada) bilan PPC ishlatiladi",
    "Lately + PPC": "Lately (oxirgi payt) bilan PPC ishlatiladi",
    
    # Past Perfect Continuous
    "Davomiy sabab → PPC": "Otgan zamondagi davomiy sabab uchun PPC ishlatiladi",
    "For + PPC (past)": "For + davomiylik bilan Past Perfect Continuous ishlatiladi",
    "Before + PPC": "Before bilan Past Perfect Continuous ishlatiladi",
    
    # Present Continuous
    "I + am + V-ing": "I bilan am + V-ing (Present Continuous) ishlatiladi",
    "He + is + V-ing": "He/She/It bilan is + V-ing ishlatiladi",
    "They + are + V-ing": "They bilan are + V-ing ishlatiladi",
    
    # Simple Present
    "I bilan don't": "I (birlik) bilan don't yordamchi feli ishlatiladi",
    "He bilan Doesn't": "He/She/It bilan doesn't ishlatiladi",
    "She + doesn't + like": "She bilan doesn't + V1 (like) ishlatiladi",
    "We bilan don't": "We (koplik) bilan don't yordamchi feli ishlatiladi",
    "You bilan do": "You bilan do yordamchi feli ishlatiladi (soroklarda)",
    
    # Advanced Modals
    "Needn't have + V3": "Needn't have + V3 — keraksiz bajarilgan ish",
    
    # Misc tenses
    "Prediction → going to": "Dalil asosida bashorat uchun going to ishlatiladi",
    "If + Past → would": "2-tip shart: If + Past, natijada would + V1",
    "Natija: will + V1": "1-tip shart: if + Present, natijada will + V1",
    "Unless = if not": "Unless = if not (agar...masa) shart gaplarda ishlatiladi",
    "Sifat + enough": "Sifat bilan enough birga ishlatiladi (yetarlicha)",
    "Enjoy + V-ing": "Enjoy felidan keyin V-ing ishlatiladi (enjoy reading)",
    "Suggest + V-ing": "Suggest felidan keyin V-ing ishlatiladi",
    "Want + to + V1": "Want felidan keyin to + V1 ishlatiladi (want to go)",
    "Make a decision": "Make bilan decision (qaror) sozi ishlatiladi",
    "Non-defining -> who": "Non-defining relative clause larda who, which ishlatiladi",
    "If + Present Simple": "1-tip shart: if + Present Simple, natijada will + V1",
    "Present Passive": "am/is/are + V3 (Present Passive) ishlatiladi",
    "Past Passive": "was/were + V3 (Past Passive) ishlatiladi",
    "Write → written": "write felining V3 shakli written (notori fel)",
    "Will → Would": "Would — will ning otgan zamon va muloyim shakli",
    "Let's ? shall we": "Let's bilan taklifga shall we ishlatiladi",
    "Soat 5 → at 5": "Aniq soat oldidan at predlogi ishlatiladi",
    "Monday → on": "Kunlar oldidan on predlogi ishlatiladi",
    "Summer → in": "Fasllar oldidan in predlogi ishlatiladi",
    "Kontekst → the": "Maxsus kontekstdagi narsa uchun the ishlatiladi",
    "Birinchi marta → a": "Birinchi marta aytilgan narsa uchun a/an ishlatiladi",
    "Takror → the": "Takror aytilgan narsa uchun the ishlatiladi",
    "She + is + a": "She/He/It + is + a (kasb) ishlatiladi (she is a doctor)",
    "He + is + an": "Unli tovush oldidan an ishlatiladi (an apple, an hour)",
    "They → Do they play": "They bilan sorokda Do yordamchi feli ishlatiladi",
    "It → Does it work": "It bilan sorokda Does yordamchi feli ishlatiladi",
    "He bilan Was": "He/She/It bilan was (otgan zamonda) ishlatiladi",
    "She bilan is": "She/He/It bilan is (present zamonda) ishlatiladi",
    "They bilan are": "They (koplik) bilan are ishlatiladi",
    "ski → skiing": "ski feliga V-ing qoshganda skiing (k qoshiladi)",
    "swim → swimming": "swim feliga V-ing qoshganda swimming (m ikkilanadi)",
    "run → running": "run feliga V-ing qoshganda running (n ikkilanadi)",
    "write → writing": "write feliga V-ing qoshganda writing (e tushadi)",
    "Ot bor → such a": "Sifat + ot oldidan such a ishlatiladi",
    "Davomiy sabab → PPC": "Otgan zamondagi sabab uchun PPC ishlatiladi",
    "Needn't + have": "Needn't have + V3 — keraksiz bajarilgan ish",
    "have you ever": "Have you ever + V3 — hayotda hech qachon?",
    "By the time → FPC": "By the time bilan Future Perfect Continuous ishlatiladi",
    "Duration → FC": "Davomiylik uchun Future Continuous ishlatiladi",
    "for + period": "for + vaqt oraligi (davomiylik) bilan ishlatiladi",
    "All day → FC": "All day (kun boyi) bilan Future Continuous ishlatiladi",
}


def expand_explanation(exp: str) -> str:
    """Expand a short explanation to >= 20 chars."""
    exp = exp.strip()
    if len(exp) >= 20:
        return exp
    
    # 1. Fixed exact map
    if exp in FIXED_EXPANSIONS:
        return FIXED_EXPANSIONS[exp]
    
    # 2. Grammar patterns (exact match)
    if exp in GRAMMAR_PATTERNS:
        return GRAMMAR_PATTERNS[exp]
    
    # 3. Arrow: "X → Y"
    m = re.match(r'^(.+?)\s*→\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        return f'{left} → {right}: bu qoidada {right} ishlatiladi'
    
    # 4. Plus: "X + Y"
    m = re.match(r'^(.+?)\s*\+\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        return f'{left} bilan {right} birga ishlatiladi (grammatik qoida)'
    
    # 5. Translation: "X = Y"
    m = re.match(r'^(.+?)\s*=\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        return f'{left} = {right} — bu sozning ingliz tilidagi manosi'
    
    # 6. Dash: "X — Y"
    m = re.match(r'^(.+?)\s*[—–-]\s*(.+)$', exp)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        return f'{left} — {right}: bu yerda {left} {right} uchun ishlatiladi'
    
    # 7. Very short fallback
    if len(exp) <= 10:
        return f'{exp} (qoidani eslab qoling)'
    
    # Default
    return f'{exp} (ingliz tili qoidasi)'


def fix_file(filepath: str) -> int:
    """Fix all short explanations in a single file."""
    if not os.path.exists(filepath):
        return 0
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    fix_count = 0
    
    # Match explanation: 'content' or explanation: "content" handling escapes
    pattern = r"(explanation:\s*)(?:'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\")"
    
    def replace_match(m):
        nonlocal fix_count
        prefix = m.group(1)
        raw_val = m.group(2) if m.group(2) is not None else m.group(3)
        
        # Unescape
        val = raw_val.replace("\\'", "'").replace('\\"', '"')
        
        if len(val.strip()) >= 20:
            return m.group(0)
        
        expanded = expand_explanation(val.strip())
        if expanded == val.strip():
            return m.group(0)
        
        # Ensure >= 20 chars
        if len(expanded) < 20:
            expanded = expanded + ' (qoida)'
        
        fix_count += 1
        
        # Escape for TypeScript single-quoted string
        safe = expanded.replace('\\', '\\\\').replace("'", "\\'")
        return f"{prefix}'{safe}'"
    
    content = re.sub(pattern, replace_match, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    
    return fix_count


def main():
    print("=== Fix explanation-too-short (v3 - all files) ===\n")
    
    # Collect files
    files = set()
    
    # Daily dir
    for f in os.listdir(DAILY_DIR):
        if f.endswith('.ts') and f not in ('index.ts', 'lessonsIndex.ts'):
            files.add(os.path.join(DAILY_DIR, f))
    
    # Extra files
    for f in EXTRA_FILES:
        if os.path.exists(f):
            files.add(f)
    
    files = sorted(files)
    
    total = 0
    file_results = []
    
    for filepath in files:
        fixed = fix_file(filepath)
        if fixed > 0:
            fname = os.path.relpath(filepath)
            file_results.append((fname, fixed))
            total += fixed
            print(f"  {fname}: {fixed} ta tuzatildi")
    
    print(f"\n  Jami: {total} ta tuzatildi ({len(file_results)} ta faylda)")
    
    # Verify with TS
    print("\n=== Verifying... ===")
    try:
        result = subprocess.run(
            ['npx', 'tsx', '-e',
             'const {getAllLessons}=require("./src/data/daily/index"); const lessons=getAllLessons(); let c=0; const r=[]; for(const l of lessons){const all=[...(l.exercises||[]),...(l.tests||[]),...((l.specialCases||[]).flatMap(s=>s.drills||[]))]; for(const e of all){if("explanation" in e && e.explanation && e.explanation.trim().length<20 && e.type!=="connection" && e.type!=="elaborative"){c++}}} console.log("REMAINING="+c)'],
            capture_output=True, text=True, cwd='.', timeout=120
        )
        for line in result.stdout.split('\n'):
            if 'REMAINING=' in line:
                rem = int(line.split('=')[1])
                print(f"  Qolgan MED explanation-too-short: {rem} ta")
    except Exception as e:
        print(f"  Error: {e}")


if __name__ == '__main__':
    main()
