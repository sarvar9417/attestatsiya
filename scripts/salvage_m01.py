#!/usr/bin/env python3
"""
m01.ts ni butunlay qayta qurish.

Strategy: Top-down parsing of each subtopic section.
For each subtopic, extract the theory blocks and replace questions.
"""
import json, os, re

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(PROJECT_ROOT, 'Axborot_va_axborot_jarayonlari_LaTeX', 'Axborot_va_raqamli_savodxonlik_400_TEST.json')
M01_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'topics', 'm01.ts')

def escape_ts(text: str) -> str:
    text = text.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
    return text

def gen_questions_block(questions: list, ch_num: int, ch_title: str) -> str:
    lines = [f"    // ── Bob {ch_num}: {ch_title} ({len(questions)} savol) ──", "    questions: ["]
    for i, q in enumerate(questions):
        opts = ', '.join(f"'{escape_ts(o)}'" for o in q['options'])
        comma = '' if i == len(questions) - 1 else ','
        lines.append(f"      {{ id: '{q['id']}', text: '{escape_ts(q['stem'])}', options: [{opts}], correctIndex: {q['answer_index']}, explanation: '{escape_ts(q['explanation'])}', type: 'Y1' }}{comma}")
    lines.append("    ],")
    return '\n'.join(lines)

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    chapters = {c['number']: c for c in json.load(f)['chapters']}

with open(M01_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Mapping
subtopic_map = {'M01.02': 1, 'M01.03': 2, 'M01.04': 3, 'M01.05': 4, 'M01.06': 5}

# Split file by subtopic boundaries
# Pattern: "M01.XX": {
subtopic_pattern = re.compile(r'(\s{2}"(M01\.\d{2})"\s*:\s*\{)')

# Find all subtopic positions
positions = []
for m in subtopic_pattern.finditer(content):
    positions.append((m.start(), m.group(2)))

positions.sort()

# Extract each subtopic section
sections = []
for i, (pos, subtopic_id) in enumerate(positions):
    if i + 1 < len(positions):
        next_pos = positions[i + 1][0]
    else:
        next_pos = len(content)
    
    section = content[pos:next_pos]
    sections.append((subtopic_id, section))

print(f"✅ {len(sections)} ta subtopic topildi")

# Rebuild the file
header_end = content.find('export const M01_CONTENT')
if header_end == -1:
    print("❌ M01_CONTENT not found!")
    exit(1)

# Header: everything before M01_CONTENT
header_line = content.rfind('\n', 0, header_end)
header = content[:header_line + 1]

# Footer: closing of M01_CONTENT record
last_section = sections[-1][1]
closing_brace = last_section.rfind('}')
if closing_brace != -1:
    footer = last_section[closing_brace:]  # Includes closing } and export
else:
    footer = '\n}\n'

output = [header]
output.append('export const M01_CONTENT: Record<string, TopicContent> = {\n')

for subtopic_id, section in sections:
    ch_num = subtopic_map.get(subtopic_id, 0)
    
    # Extract the theory part: from `{` after subtopic_id to the `questions:` line
    # Find the opening brace of the subtopic content
    brace_idx = section.find('{')
    if brace_idx == -1:
        print(f"   ❌ {subtopic_id}: no opening brace")
        continue
    
    content_after_brace = section[brace_idx + 1:]
    
    # Find theory section
    theory_start = content_after_brace.find('theory:')
    if theory_start == -1:
        print(f"   ❌ {subtopic_id}: no theory:")
        continue
    
    # Find questions:
    questions_start = content_after_brace.find('questions:', theory_start)
    if questions_start == -1:
        print(f"   ❌ {subtopic_id}: no questions:")
        continue
    
    # theory blocks are between `theory:` and `questions:`
    theory_blocks = content_after_brace[theory_start:questions_start]
    
    # Check if theory_blocks starts properly
    theory_line_end = theory_blocks.find('\n')
    theory_array_start = theory_blocks.find('[')
    
    if theory_array_start == -1:
        print(f"   ❌ {subtopic_id}: theory has no [")
        continue
    
    # Everything from theory: through the closing ], to before questions:
    theory_part = theory_blocks
    
    # Generate the subtopic entry
    if ch_num > 0:
        ch = chapters[ch_num]
        q_block = gen_questions_block(ch['questions'], ch_num, ch['title'])
        print(f"   ✅ {subtopic_id}: {len(ch['questions'])} savol")
    else:
        q_block = "    questions: [],"
        print(f"   ➖ {subtopic_id}: bo'sh (appendix)")
    
    # Build the complete subtopic entry
    entry = f'  "{subtopic_id}": {{\n{theory_part}\n{q_block}\n  }},\n'
    output.append(entry)

output.append(footer)

# Write
with open(M01_PATH, 'w', encoding='utf-8') as f:
    f.writelines(output)

print(f"\n✅ Yangi m01.ts yozildi")

# Verify
with open(M01_PATH, 'r', encoding='utf-8') as f:
    final = f.read()

for subtopic_id, ch_num in subtopic_map.items():
    ch = chapters[ch_num]
    cnt = final.count(f"ARS-{ch_num:02d}")
    print(f"   📊 {subtopic_id}: {cnt}/{len(ch['questions'])} ARS-{ch_num:02d}-XXX")

print(f"\n📏 Hajmi: {len(final)} chars")
print(f"📐 Qator: {final.count(chr(10))} lines")
