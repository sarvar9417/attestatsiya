#!/usr/bin/env python3
"""M01 kontentini LaTeX bilan solishtirish auditi"""
import re

with open('src/data/topicContent.ts', 'r') as f:
    content = f.read()

# Get M01 section
start = content.index('M01: AXBOROT')
m02 = content.find('M02: KOMPYUTER', start)
m01 = content[start:m02]

print("=" * 60)
print("M01 KONTENT AUDITI")
print("=" * 60)

for subtopic in ['M01.01', 'M01.02', 'M01.03', 'M01.04', 'M01.05', 'M01.06', 'M01.07', 'M01.08', 'M01.09']:
    idx = m01.find(subtopic)
    if idx < 0:
        print(f"\n{subtopic}: NOT FOUND!")
        continue
    
    # Find section boundaries
    next_idx = len(m01)
    for s2 in ['M01.01', 'M01.02', 'M01.03', 'M01.04', 'M01.05', 'M01.06', 'M01.07', 'M01.08', 'M01.09']:
        nxt = m01.find(s2, idx + 7) if idx >= 0 else -1
        if nxt > 0 and nxt < next_idx:
            next_idx = nxt
    
    section = m01[idx:next_idx]
    
    # Count theory blocks - look for type: "text", etc.
    theory_types = re.findall(r'type:\s*"(\w+)"', section)
    questions = re.findall(r'id:\s*"' + subtopic + r'-q(\d+)"', section)
    
    from collections import Counter
    type_counts = Counter(theory_types)
    
    q_types = re.findall(r'type:\s*"(Y[123])"', section)
    q_type_counts = Counter(q_types)
    
    total_theory = sum(type_counts.values())
    theory_detail = ', '.join(f'{k}={v}' for k, v in sorted(type_counts.items()))
    q_detail = ', '.join(f'{k}={v}' for k, v in sorted(q_type_counts.items()))
    
    print(f"\n{subtopic}:")
    print(f"  Nazariy bloklar: {total_theory} ({theory_detail})")
    print(f"  Test savollari: {len(questions)} ({q_detail})")

print("\n" + "=" * 60)
# Check for Ch19 confusion pairs
print("Ch19 NOZIK FARQLAR KONTENTI:")
latex_confusion_pairs = [
    "Ma'lumot — axborot", "Axborot — bilim", "Xabar — signal",
    "Analog — raqamli", "Statik — dinamik", "Birlamchi — ikkilamchi",
    "Kodlash — shifrlash", "Kodlash — siqish", "Bit — bayt",
    "kB — KiB", "Raqam — son", "ASCII — Unicode",
    "Unicode — UTF-8", "PPI — DPI", "Rastr — vektor",
    "Rang chuqurligi — aniqlik", "FPS — Hz audio",
    "Format — kengaytma", "Kodek — konteyner",
    "Yo'qotishsiz — yo'qotishli", "Bandwidth — throughput",
    "Bit/s — baud", "Validatsiya — verifikatsiya",
    "Identifikatsiya — autentifikatsiya",
    "Autentifikatsiya — avtorizatsiya", "Mualliflik — plagiat"
]
found = 0
for pair in latex_confusion_pairs:
    part1, part2 = pair.split(' — ')
    if part1.lower() in m01.lower() and part2.lower() in m01.lower():
        found += 1
    else:
        print(f"  ❌ {pair}")

print(f"\nCh19 dan {found}/{len(latex_confusion_pairs)} juftlik platformada mavjud")
