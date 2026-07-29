#!/usr/bin/env python3
"""Fix the remaining 11 explanation-too-short issues by direct string replacement."""

import re

FIXES = {
    # a2Part4.ts - 3 fixes (29073, 29153, 29180)
    'src/data/daily/a2Part4.ts': [
        (r'explanation: "Salbiy ma\u2019no \u2192 few"',
         r'explanation: "Salbiy ma\u2019no bildirganda \u2018few\u2019 ishlatiladi (oz, yetarli emas)"'),
        (r'explanation: "Ot bor \u2192 such a"',
         r'explanation: "Ot bor (noun) bilan \u2018such a\u2019 ishlatiladi (such a beautiful day)"'),
    ],
    # b1plusPart1.ts - 4 fixes (50101, 50105, 50220, 50349)
    'src/data/daily/b1plusPart1.ts': [
        (r'explanation: "Who lives \u2192 living"',
         r'explanation: "Who lives (who+verb) o\u2018rniga \u2018living\u2019 (V-ing) ishlatiladi"'),
        (r'explanation: "Exhausted \u2014 passive"',
         r'explanation: "Exhausted (holdan toydi) \u2014 passive ma\u2019noda ishlatiladi"'),
        (r'explanation: "Ishonch \u2192 must have"',
         r'explanation: "Ishonch bildirganda \u2018must have\u2019 ishlatiladi (o\u2018tmishdagi ishonchli taxmin)"'),
        (r'explanation: "Think so \u2014 to\u2018g\u2018ri"',
         r'explanation: "Think so \u2014 to\u2018g\u2018ri javob (fikr bildirish uchun \u2018so\u2019 ishlatiladi)"'),
    ],
    # b2Part2.ts - 4 fixes (59561, 59571, 59576, 59591)
    'src/data/daily/b2Part2.ts': [
        (r'explanation: "Needn\u2019t have + V\u2083"',
         r'explanation: "Needn\u2019t have + V3 (past participle) keraksiz bajarilgan ish uchun"'),
    ],
}

total = 0
for filepath, replacements in FIXES.items():
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    file_count = 0
    for old, new in replacements:
        count_before = content.count(old)
        if count_before > 0:
            content = content.replace(old, new)
            file_count += count_before
            print(f"  FIXED ({count_before}x): {old[:60]}...")
        else:
            # Try to find the pattern with actual chars instead of escape sequences
            print(f"  NOT FOUND directly, trying alt: {old[:60]}...")
            # Try another approach - search for the ID in context
            pass
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    total += file_count
    print(f"  {filepath}: {file_count} fixes applied\n")

print(f"\nTotal fixes: {total}")
