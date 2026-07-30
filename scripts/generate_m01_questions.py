#!/usr/bin/env python3
"""
JSON test bank → TypeScript TestQuestion[] konvertatori.

400 savollik test bankini (Axborot_va_raqamli_savodxonlik_400_TEST.json)
o'qib, har bir bob uchun TypeScript TestQuestion[] kodini generatsiya qiladi.

Ishlatish:
  python3 scripts/generate_m01_questions.py
  
Natija:
  scripts/generated_questions.ts — m01.ts ga qo'shish uchun tayyor TypeScript kod
"""

import json
import os
import sys

JSON_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'Axborot_va_axborot_jarayonlari_LaTeX',
    'Axborot_va_raqamli_savodxonlik_400_TEST.json'
)

OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'generated_questions.ts'
)

# Map JSON chapter numbers to M01 subtopic IDs
CHAPTER_TO_SUBTOPIC = {
    1: 'M01.02',
    2: 'M01.03',
    3: 'M01.04',
    4: 'M01.05',
    5: 'M01.06',
}


def escape_ts_string(text: str) -> str:
    """TypeScript string literal uchun escape qilish."""
    text = text.replace('\\', '\\\\')
    text = text.replace("'", "\\'")
    text = text.replace('\n', '\\n')
    return text


def generate_question_code(q: dict) -> str:
    """Bitta JSON question dan TypeScript TestQuestion kodi."""
    # Escape strings
    text = escape_ts_string(q['stem'])
    explanation = escape_ts_string(q['explanation'])
    
    # Options array
    options = [escape_ts_string(o) for o in q['options']]
    options_str = ', '.join(f"'{o}'" for o in options)
    
    return (
        f"      {{\n"
        f"        id: '{q['id']}',\n"
        f"        text: '{text}',\n"
        f"        options: [{options_str}],\n"
        f"        correctIndex: {q['answer_index']},\n"
        f"        explanation: '{explanation}',\n"
        f"        type: 'Y1',\n"
        f"      }}"
    )


def generate_chapter_code(chapter: dict) -> str:
    """Bir bob uchun to'liq TestQuestion[] kodi."""
    lines = []
    lines.append(f"    // ======== Bob {chapter['number']}: {chapter['title']} ({len(chapter['questions'])} savol) ========")
    lines.append(f"    questions: [")
    
    for i, q in enumerate(chapter['questions']):
        lines.append(generate_question_code(q))
        if i < len(chapter['questions']) - 1:
            lines[-1] += ','
    
    lines.append(f"    ],")
    return '\n'.join(lines)


def main():
    # Read JSON
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"✅ O'qildi: {data['title']}")
    print(f"   Jami savol: {data['question_count']}")
    print(f"   Boblar: {len(data['chapters'])}")
    
    # Generate for each chapter
    output_lines = []
    output_lines.append("// =========================================================")
    output_lines.append("// AVTOMATIK GENERATSIYA QILINGAN — qo'lda tahrirlamang.")
    output_lines.append("// Manba: Axborot_va_axborot_jarayonlari_LaTeX/")
    output_lines.append(f"//         {os.path.basename(JSON_PATH)}")
    output_lines.append("// Generator: scripts/generate_m01_questions.py")
    output_lines.append("// =========================================================")
    output_lines.append("")
    output_lines.append("import type { TestQuestion } from '../data/topicContent'")
    output_lines.append("")
    
    for chapter in data['chapters']:
        ch_num = chapter['number']
        subtopic = CHAPTER_TO_SUBTOPIC.get(ch_num)
        q_count = len(chapter['questions'])
        
        print(f"\n📘 Bob {ch_num}: {chapter['title']} ({q_count} savol) → {subtopic}")
        
        output_lines.append(f"// ── {subtopic}: {chapter['title']} ──")
        output_lines.append(f"export const {subtopic.replace('.', '_')}_QUESTIONS: TestQuestion[] = [")
        
        for i, q in enumerate(chapter['questions']):
            output_lines.append(generate_question_code(q))
            if i < q_count - 1:
                output_lines[-1] += ','
        
        output_lines.append("]")
        output_lines.append("")
    
    # Write output
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output_lines))
    
    print(f"\n✅ Generatsiya yakunlandi: {OUTPUT_PATH}")
    print(f"   {sum(len(c['questions']) for c in data['chapters'])} ta savol generatsiya qilindi")


if __name__ == '__main__':
    main()
