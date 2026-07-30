#!/usr/bin/env python3
"""
m01.ts ni regex yordamida qayta qurish — theory bloklari saqlanadi, questions to'g'ri joylashtiriladi.
"""
import json, os, re

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(PROJECT_ROOT, 'Axborot_va_axborot_jarayonlari_LaTeX', 'Axborot_va_raqamli_savodxonlik_400_TEST.json')
M01_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'topics', 'm01.ts')

def escape_ts(text: str) -> str:
    text = text.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
    return text

def gen_questions(questions: list) -> str:
    lines = []
    for i, q in enumerate(questions):
        opts = ', '.join(f"'{escape_ts(o)}'" for o in q['options'])
        lines.append(f"      {{ id: '{q['id']}', text: '{escape_ts(q['stem'])}', options: [{opts}], correctIndex: {q['answer_index']}, explanation: '{escape_ts(q['explanation'])}', type: 'Y1' }}{'' if i == len(questions)-1 else ','}")
    return '\n'.join(lines)

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

chapters = {c['number']: c for c in data['chapters']}

with open(M01_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"✅ O'qildi: {len(content)} chars")

# Mapping: subtopic_id -> chapter_number (0 = no tests)
mapping = {'M01.02': 1, 'M01.03': 2, 'M01.04': 3, 'M01.05': 4, 'M01.06': 5}

# For each subtopic with tests, find and replace the questions section
for subtopic_id, ch_num in mapping.items():
    ch = chapters[ch_num]
    q_code = gen_questions(ch['questions'])
    
    # Find the subtopic section
    subtopic_pattern = f'"{subtopic_id}": {{'
    idx = content.find(subtopic_pattern)
    if idx == -1:
        print(f"   ❌ {subtopic_id} not found!")
        continue
    
    # Find questions: within this subtopic
    search_from = idx
    questions_start = content.find('questions:', search_from)
    if questions_start == -1:
        print(f"   ❌ {subtopic_id}: questions: not found!")
        continue
    
    # Find the bracket after questions:
    bracket_start = content.find('[', questions_start)
    if bracket_start == -1:
        print(f"   ❌ {subtopic_id}: [ not found!")
        continue
    
    # Find the matching closing bracket
    depth = 1
    bracket_end = bracket_start + 1
    while bracket_end < len(content) and depth > 0:
        c = content[bracket_end]
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
        bracket_end += 1
    
    # Find where the line/array ends (after ],\n)
    array_end = content.find('\n', bracket_end - 1)
    if array_end == -1:
        array_end = bracket_end
    
    # Build replacement: from `questions:` to end of array line
    old = content[questions_start:array_end + 1]
    
    chapter_title_escaped = ch['title'].replace("'", "\\'")
    new = f"    // ── Bob {ch_num}: {ch['title']} ({len(ch['questions'])} savol) ──\n    questions: [\n{q_code}\n    ],\n"
    
    # Replace by concatenation (not replace()) to avoid matching wrong location
    content = content[:questions_start] + new + content[array_end + 1:]
    print(f"   ✅ {subtopic_id}: {len(ch['questions'])} savol (Bob {ch_num})")

# Also clean M01.01 if it got polluted
m0101_idx = content.find('"M01.01": {')
if m0101_idx != -1:
    qs = content.find('questions:', m0101_idx)
    if qs != -1:
        bs = content.find('[', qs)
        if bs != -1:
            depth = 1
            be = bs + 1
            while be < len(content) and depth > 0:
                if content[be] == '[': depth += 1
                elif content[be] == ']': depth -= 1
                be += 1
            ae = content.find('\n', be - 1)
            if ae == -1: ae = be
            # Check if the questions array is non-empty (has IDs)
            if 'ARS' in content[qs:ae + 1]:
                print(f"   🧹 M01.01: cleaning ({content[qs:ae+1].count('id:')} savol bor edi)")
                # Replace by concatenation
                content = content[:qs] + '    questions: [],\n' + content[ae + 1:]
            else:
                print(f"   ➖ M01.01: already empty")

with open(M01_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
total = 0
for subtopic_id, ch_num in mapping.items():
    ch = chapters[ch_num]
    cnt = content.count(f"ARS-{ch_num:02d}")
    print(f"   📊 {subtopic_id}: {cnt}/{len(ch['questions'])} ARS-{ch_num:02d}-XXX")
    total += cnt
print(f"\n✅ Jami: {total}/{sum(len(c['questions']) for c in chapters.values())} savol")
