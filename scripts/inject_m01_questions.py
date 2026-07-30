#!/usr/bin/env python3
"""
JSON test bank → m01.ts ga to'g'ridan-to'g'ri inject qilish skripti.

Har bir bob savollarini mos M01 subtopic'ining questions[] array'iga qo'shadi.

Ishlatish:
  python3 scripts/inject_m01_questions.py
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

# subtopic_id → (questions array indentation, chapter title suffix)
SUBTOPIC_QUESTIONS = {
    'M01.02': 60,  # chapter 1
    'M01.03': 60,  # chapter 2
    'M01.04': 70,  # chapter 3
    'M01.05': 100, # chapter 4
    'M01.06': 110, # chapter 5
}


def escape_ts(text: str) -> str:
    """TypeScript string literal uchun escape."""
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "\\'")
    text = text.replace('\n', '\\n')
    return text


def generate_questions_ts(questions: list) -> str:
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
    # Read JSON
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✅ O'qildi: {data['title']}")
    print(f"   Jami savol: {data['question_count']}")
    
    # Read m01.ts
    with open(M01_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Chapter to subtopic mapping
    chapter_map = {
        1: ('M01.02', 'Chapter 1: '),
        2: ('M01.03', 'Chapter 2: '),
        3: ('M01.04', 'Chapter 3: '),
        4: ('M01.05', 'Chapter 4: '),
        5: ('M01.06', 'Chapter 5: '),
    }
    
    for chapter in data['chapters']:
        ch_num = chapter['number']
        subtopic, prefix = chapter_map[ch_num]
        questions = chapter['questions']
        q_count = len(questions)
        
        print(f"\n📘 Bob {ch_num}: {chapter['title']} ({q_count} savol) → {subtopic}")
        
        # Generate questions TypeScript code
        ts_code = generate_questions_ts(questions)
        
        # Pattern to match: `questions: [],` followed by newline and `  },` and newline and `  "M01.0X":
        # We need to replace `questions: [],` with the generated code
        # The exact pattern in the file is `    questions: [],`
        old = f"    questions: [],"
        new = f"    // ── {chapter['title']} ({q_count} savol) ──\n{ts_code}\n    ],"
        
        # Replace (only first occurrence)
        count = content.replace(old, new, 1)
        if count == content:
            print(f"   ⚠️  '{old}' topilmadi! Tekshirib ko'ring.")
        else:
            content = count
            print(f"   ✅ {q_count} ta savol qo'shildi")
    
    # Write modified m01.ts
    with open(M01_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Barcha o'zgarishlar m01.ts ga yozildi")
    
    # Verify
    with open(M01_PATH, 'r', encoding='utf-8') as f:
        final = f.read()
    
    for chapter in data['chapters']:
        ch_num = chapter['number']
        subtopic, _ = chapter_map[ch_num]
        q_count = len(chapter['questions'])
        
        # Count occurrences of question IDs in the file
        id_count = final.count(f"ARS-{ch_num:02d}")
        print(f"   {subtopic}: {id_count} ta ARS-{ch_num:02d}-XXX ID si topildi")


if __name__ == '__main__':
    main()
