#!/usr/bin/env python3
"""
m01.ts ni to'liq qayta qurish skripti.

Hozirgi holatda:
- M01.01 ga Ch 1 savollari noto'g'ri tushgan (tozalanadi)
- M01.02-M01.06 ga savollar bir bobga siljib tushgan (to'g'rilanadi)

Bu skript:
1. JSON dan to'g'ri savollarni o'qiydi
2. Har bir subtopic uchun theory bloklarini saqlab qoladi
3. To'g'ri questions array'larini qo'yadi
4. M01.01, M01.07-M01.12 ga bo'sh questions qoldiradi

Ishlatish:
  python3 scripts/fix_m01_questions.py
"""

import json
import os
import re

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(
    PROJECT_ROOT,
    'Axborot_va_axborot_jarayonlari_LaTeX',
    'Axborot_va_raqamli_savodxonlik_400_TEST.json'
)
M01_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'topics', 'm01.ts')


def escape_ts(text: str) -> str:
    """TypeScript string literal uchun escape."""
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "\\'")
    text = text.replace('\n', '\\n')
    return text


def generate_questions_ts(subtopic_id: str, questions: list) -> str:
    """TestQuestion[] array'ining TypeScript kodini generatsiya qiladi."""
    lines = []
    for i, q in enumerate(questions):
        text = escape_ts(q['stem'])
        explanation = escape_ts(q['explanation'])
        options = [escape_ts(o) for o in q['options']]
        options_str = ', '.join(f"'{o}'" for o in options)
        
        lines.append(f"      {{")
        lines.append(f"        id: '{q['id']}',")
        lines.append(f"        text: '{text}',")
        lines.append(f"        options: [{options_str}],")
        lines.append(f"        correctIndex: {q['answer_index']},")
        lines.append(f"        explanation: '{explanation}',")
        lines.append(f"        type: 'Y1',")
        if i < len(questions) - 1:
            lines.append(f"      }},")
        else:
            lines.append(f"      }}")
    
    return '\n'.join(lines)


def main():
    # Read JSON test bank
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Chapter → subtopic mapping
    chapter_to_subtopic = [
        (1, 'M01.02', 'Informatika, ma\'lumot, axborot va bilim'),
        (2, 'M01.03', 'Axborotning turlari, shakllari, xossalari va manbalari'),
        (3, 'M01.04', 'Axborot jarayonlari, izlash va raqamli madaniyat'),
        (4, 'M01.05', 'Belgi, kod, kodlash va axborot hajmi'),
        (5, 'M01.06', 'Matn, grafika, audio va videoning raqamli tasvirlanishi'),
    ]
    
    # Build chapter questions lookup
    chapter_questions = {}
    for ch in data['chapters']:
        chapter_questions[ch['number']] = ch['questions']
    
    # Read current m01.ts
    with open(M01_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Process each chapter/subtopic
    for ch_num, subtopic_id, subtopic_title in chapter_to_subtopic:
        questions = chapter_questions[ch_num]
        q_count = len(questions)
        
        print(f"\n📘 Bob {ch_num}: {subtopic_title} ({q_count} savol) → {subtopic_id}")
        
        # Generate questions TS code
        ts_code = generate_questions_ts(subtopic_id, questions)
        
        # Pattern: find `"SUDTOPIC_ID": {` then the `questions:` line after it
        # We'll use a more specific approach: find the subtopic entry and its questions
        subtopic_pattern = f'  "{subtopic_id}": {{'
        idx = content.find(subtopic_pattern)
        
        if idx == -1:
            print(f"   ❌ '{subtopic_pattern}' topilmadi!")
            continue
        
        # Find the `questions: ` within this subtopic (after subtopic_pattern)
        search_start = idx
        questions_marker = 'questions: '
        q_marker_idx = content.find(questions_marker, search_start)
        
        if q_marker_idx == -1:
            print(f"   ❌ '{questions_marker}' '{subtopic_id}' ichida topilmadi!")
            continue
        
        # Find the end of the questions array (the `],` or `],\n`)
        # We look for the line containing `questions: []` or `questions: [...]`
        line_start = content.rfind('\n', 0, q_marker_idx) + 1
        line_end = content.find('\n', q_marker_idx)
        
        questions_line = content[line_start:line_end].strip()
        
        if questions_line == 'questions: [],':
            # Empty array - inject questions
            old = '    questions: [],'
            new = f"    // ── Bob {ch_num}: {subtopic_title} ({q_count} savol) ──\n{ts_code}\n    ],"
            content = content.replace(old, new, 1)
            print(f"   ✅ {q_count} ta savol qo'shildi (bo'sh edi)")
        else:
            # Has questions (from previous broken injection) - replace them
            # Find the full questions section: from `questions: [` to the matching `],`
            q_start = content.find('questions: [', search_start)
            if q_start == -1:
                print(f"   ❌ 'questions: [' '{subtopic_id}' ichida topilmadi!")
                continue
            
            # Find the matching `],` that closes the array
            bracket_count = 0
            q_end = q_start + len('questions: [')
            # We need to find the matching close bracket
            for i in range(q_start, len(content)):
                if content[i] == '[':
                    bracket_count += 1
                elif content[i] == ']':
                    bracket_count -= 1
                    if bracket_count == 0:
                        q_end = i + 1  # Include the `]`
                        break
            
            # Find the end of the line containing `],` or `]`
            after_bracket = content.find(',\n', q_end)
            if after_bracket == -1:
                after_bracket = content.find('\n', q_end)
            
            if after_bracket != -1:
                q_end_line = after_bracket + 1  # Include newline
            
            old_section = content[q_start:q_end_line]
            new_section = f"    questions: [\n{ts_code}\n    ],\n"
            content = content.replace(old_section, new_section, 1)
            print(f"   ✅ {q_count} ta savol bilan almashtirildi (avval noto'g'ri edi)")
    
    # Also clean M01.01 (appendix - should have empty questions)
    print(f"\n🧹 M01.01 tozalanmoqda (appendix, test kerak emas)...")
    m0101_pattern = '  "M01.01": {'
    idx_0101 = content.find(m0101_pattern)
    if idx_0101 != -1:
        q_start_0101 = content.find('questions: ', idx_0101)
        if q_start_0101 != -1:
            # Find current questions section
            bracket_start = content.find('[', q_start_0101)
            if bracket_start != -1:
                bracket_count = 0
                bracket_end = bracket_start
                for i in range(bracket_start, len(content)):
                    if content[i] == '[':
                        bracket_count += 1
                    elif content[i] == ']':
                        bracket_count -= 1
                        if bracket_count == 0:
                            bracket_end = i + 1
                            break
                
                after_bracket = content.find(',\n', bracket_end)
                if after_bracket == -1:
                    after_bracket = content.find('\n', bracket_end)
                
                if after_bracket != -1:
                    old = content[q_start_0101:after_bracket + 1]
                    new = '    questions: [],\n'
                    content = content.replace(old, new, 1)
                    print(f"   ✅ M01.01 tozalandi ({old.count('id:')} ta savol olib tashlandi)")
    
    # Write fixed m01.ts
    with open(M01_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Barcha tuzatishlar m01.ts ga yozildi")
    
    # Verify
    with open(M01_PATH, 'r', encoding='utf-8') as f:
        final = f.read()
    
    print(f"\n📊 Tekshiruv:")
    for ch_num, subtopic_id, _ in chapter_to_subtopic:
        id_count = final.count(f"ARS-{ch_num:02d}")
        print(f"   {subtopic_id}: {id_count} ta ARS-{ch_num:02d}-XXX ID si")
    
    m0101_count = final.count('id:', 0, final.find('"M01.02"'))
    print(f"   M01.01: {m0101_count} ta savol (0 bo'lishi kerak)")


if __name__ == '__main__':
    main()
