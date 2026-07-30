#!/usr/bin/env python3
"""
LaTeX → TypeScript converter for M01 — V4 (with tables, fixed everything).
"""
import re, os

BASE = '/Users/sarvar9417/Desktop/attestatsiya/Axborot_va_axborot_jarayonlari_LaTeX/chapters'

CHAPTER_MAP = {
    '01_fundamentals':         ('M01.01', "Informatika, ma'lumot, axborot va bilim"),
    '02_properties_forms':     ('M01.02', "Axborotning xossalari, shakllari va turlari"),
    '03_sources_processes':    ('M01.03', "Axborot manbalari va axborot jarayonlari"),
    '04_digital_culture':      ('M01.04', "AT, raqamli muhit va axborot madaniyati"),
    '05_signs_codes':          ('M01.05', "Belgi, kod, kodlash va shifrlash"),
    '06_number_systems':       ('M01.06', "Sanoq sistemalari"),
    '07_units_hartley':        ('M01.07', "Bit, bayt va Xartli formulasi"),
    '08_text_encoding':        ('M01.08', "Matnli axborotni kodlash"),
    '09_graphics':             ('M01.09', "Grafik axborotni kodlash"),
    '10_audio':                ('M01.10', "Audio axborotni raqamlashtirish"),
    '11_video':                ('M01.11', "Videoaxborot va multimedia"),
    '12_formats_compression':  ('M01.12', "Fayl formatlari, kodeklar va siqish"),
    '13_volume_calculations':  ('M01.13', "Axborot hajmini hisoblash"),
    '14_transmission':         ('M01.14', "Axborotni uzatish tezligi"),
    '15_search_reliability':   ('M01.15', "Axborotni izlash va manba baholash"),
    '16_validation':           ('M01.16', "Validatsiya, verifikatsiya va xatolarni aniqlash"),
    '17_copyright':            ('M01.17', "Mualliflik huquqi va raqamli etika"),
    '18_security':             ('M01.18', "Axborot xavfsizligi va himoya"),
    '19_exam_traps':           ('M01.19', "Nozik farqlar va diagnostika"),
}

COMBINED_TITLES = {}

# ─── LATEX CLEANING ─────────────────────────────────────────────
def clean_latex(text):
    """Clean LaTeX to plaintext — keeps { } for real content"""
    text = re.sub(r'\\chapter\{[^}]*\}', '', text)
    text = re.sub(r'\\chapterintro\{[^}]*\}', '', text)
    text = re.sub(r'\\section\*?\{[^}]*\}', '', text)
    text = re.sub(r'\\subsection\*?\{[^}]*\}', '', text)
    
    # Remove specific environments
    for e in ['tikzpicture', 'center', 'multicols', 'verbatim', 'description']:
        text = re.sub(r'\\begin\{' + e + r'\}[\s\S]*?\\end\{' + e + r'\}', '', text)
    
    # Remove LaTeX commands
    for pat, repl in [
        (r'\\keyterm\{([^}]*)\}', r'\1'), (r'\\textbf\{([^}]*)\}', r'\1'),
        (r'\\textit\{([^}]*)\}', r'\1'), (r'\\eng\{([^}]*)\}', r'\1'),
        (r'\\src\{[^}]*\}\{[^}]*\}', ''), (r'\\xmark', '✗'), (r'\\cmark', '✓'),
        (r'\\%', '%'), (r'\\textendash', '—'),
        (r'\\B\b', 'B'), (r'\\bit\b', 'bit'),
        (r'\\\~', ' '),
        (r'\\textquoteleft', "'"), (r'\\textquoteright', "'"),
        (r'\\textasciitilde', '~'),
        (r'\\\\', '\n'), (r'\\\[', ''), (r'\\\]', ''),
        (r'\$([^$]+)\$', r'\1'),
        (r'\\null', ''), (r'\\hfill', ''), (r'\\newline', '\n'),
        (r'\\label\{[^}]*\}', ''), (r'\\ref\{[^}]*\}', ''),
        (r'\\mathrm\{([^}]*)\}', r'\1'), (r'\\texttt\{([^}]*)\}', r'\1'),
        (r'\\text\{([^}]*)\}', r'\1'),
        (r'\\cdot', '·'), (r'\\sim', '~'),
        (r'\\to', '→'), (r'\\leftarrow', '←'), (r'\\rightarrow', '→'),
        (r'\\,', ''), (r'~\{', ''),
        (r'\\usepackage[^}]*', ''),
        (r'\\toprule', ''), (r'\\midrule', ''), (r'\\bottomrule', ''),
        (r'\\endhead', ''),
    ]:
        text = re.sub(pat, repl, text)
    
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' +', ' ', text)
    return text.strip()

# ─── EXTRACT BLOCKS (including tables) ─────────────────────────
def extract_blocks(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    blocks = []
    
    # 1. Extract definitions
    for m in re.finditer(r'\\begin\{definition\}(.*?)\\end\{definition\}', content, re.DOTALL):
        t = clean_latex(m.group(1)).strip()
        if len(t) > 15: blocks.append(('definition', t))
    
    # 2. Extract examples/exams
    for m in re.finditer(r'\\begin\{(?:exam|example|examplebox)\}(.*?)\\end\{(?:exam|example|examplebox)\}', content, re.DOTALL):
        t = clean_latex(m.group(1)).strip()
        if len(t) > 15: blocks.append(('example', t))
    
    # 3. Extract traps/notes
    for m in re.finditer(r'\\begin\{(?:trap|extra)\}(.*?)\\end\{(?:trap|extra)\}', content, re.DOTALL):
        t = clean_latex(m.group(1)).strip()
        if len(t) > 15: blocks.append(('note', t))
    
    # 3b. Extract summarybox (chapter summaries) → note
    for m in re.finditer(r'\\begin\{summarybox\}(.*?)\\end\{summarybox\}', content, re.DOTALL):
        t = clean_latex(m.group(1)).strip()
        if len(t) > 15: blocks.append(('note', t))
    
    # 3c. Extract quickcheck (review questions) → text
    for m in re.finditer(r'\\begin\{quickcheck\}(.*?)\\end\{quickcheck\}', content, re.DOTALL):
        t = clean_latex(m.group(1)).strip()
        if len(t) > 15: blocks.append(('text', t))
    
    # 3d. Extract answers → text
    for m in re.finditer(r'\\begin\{answers\}(.*?)\\end\{answers\}', content, re.DOTALL):
        t = clean_latex(m.group(1)).strip()
        if len(t) > 15: blocks.append(('text', t))
    
    # 3e. Extract sourcebox (source references) → note
    for m in re.finditer(r'\\begin\{sourcebox\}(.*?)\\end\{sourcebox\}', content, re.DOTALL):
        t = clean_latex(m.group(1)).strip()
        if len(t) > 15: blocks.append(('note', t))
    
    # 4. Extract itemize → text
    for m in re.finditer(r'\\begin\{itemize\}(.*?)\\end\{itemize\}', content, re.DOTALL):
        items = re.findall(r'\\item\s+(.*?)(?=\\item|$)', m.group(1), re.DOTALL)
        ci = [clean_latex(i).strip() for i in items if clean_latex(i).strip()]
        if ci: blocks.append(('text', '\n'.join('• '+i for i in ci)))
    
    # 5. Extract enumerate → text
    for m in re.finditer(r'\\begin\{enumerate\}(.*?)\\end\{enumerate\}', content, re.DOTALL):
        items = re.findall(r'\\item\s+(.*?)(?=\\item|$)', m.group(1), re.DOTALL)
        ci = [clean_latex(i).strip() for i in items if clean_latex(i).strip()]
        if ci: blocks.append(('text', '\n'.join(f'{j+1}. {i}' for j,i in enumerate(ci))))
    
    # 6. Extract tables from tabularx
    for m in re.finditer(r'\\begin\{tabularx\}.*?\\end\{tabularx\}', content, re.DOTALL):
        tbl = m.group(0)
        rows = []
        # Find all data rows: keyterm{...} & ... & ... \\
        for row_match in re.finditer(r'(?:\\keyterm\{([^}]*)\}|([^&\\\\]+))\s*&\s*([^&]+?)(?:\s*&\s*([^&]+?))?(?:\s*&\s*([^&]+?))?\\\\(?:\s*\\\[\s*\d+(?:mm|cm|pt)\])?', tbl):
            cells = [clean_latex(c).strip() for c in row_match.groups() if c and c.strip()]
            if cells:
                rows.append('| ' + ' | '.join(cells) + ' |')
        # Also catch simpler: \\textbf{...} & ... \\
        if not rows:
            for row_match in re.finditer(r'([^&\\\\]+)\s*&\s*([^&\\\\]+?)(?:\s*&\s*([^&\\\\]+?))?\\\\(?:\s*\\\[\s*\d+(?:mm|cm|pt)\])?', tbl):
                cells = [clean_latex(c).strip() for c in row_match.groups() if c and c.strip()]
                if cells:
                    rows.append('| ' + ' | '.join(cells) + ' |')
        if rows:
            blocks.append(('table', '\n'.join(rows)))
    
    # 7. Extract tables from longtable
    for m in re.finditer(r'\\begin\{longtable\}.*?\\end\{longtable\}', content, re.DOTALL):
        tbl = m.group(0)
        rows = []
        for row_match in re.finditer(r'(?:\\keyterm\{([^}]*)\}|([^&\\\\]+))\s*&\s*([^&]+?)(?:\s*&\s*([^&]+?))?(?:\s*&\s*([^&]+?))?\\\\(?:\s*\\\[\s*\d+(?:mm|cm|pt)\])?', tbl):
            cells = [clean_latex(c).strip() for c in row_match.groups() if c and c.strip()]
            if cells:
                rows.append('| ' + ' | '.join(cells) + ' |')
        if rows:
            blocks.append(('table', '\n'.join(rows)))
    
    # 8. Extract remaining paragraphs as text blocks
    text_only = content
    for env in ['definition','exam','example','examplebox','trap','extra',
                'itemize','enumerate','description','quickcheck','answers',
                'summarybox','sourcebox','tabularx','longtable','tabular',
                'tikzpicture','center','multicols']:
        text_only = re.sub(r'\\begin\{'+env+r'\}[\s\S]*?\\end\{'+env+r'\}','',text_only,flags=re.DOTALL)
    text_only = clean_latex(text_only)
    for p in text_only.split('\n\n'):
        p = p.strip()
        if len(p) > 30 and not p.startswith('\\') and not p.startswith('%') and not p.startswith('['):
            blocks.append(('text', p))
    
    return blocks

def ts_escape(text):
    return text.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

chapter_order = [
    '01_fundamentals','02_properties_forms',
    '03_sources_processes','04_digital_culture',
    '05_signs_codes','06_number_systems',
    '07_units_hartley','08_text_encoding',
    '09_graphics','10_audio','11_video',
    '12_formats_compression','13_volume_calculations',
    '14_transmission','15_search_reliability',
    '16_validation','17_copyright',
    '18_security','19_exam_traps',
]

# Extract blocks from each chapter
chapter_blocks = {}
for ch in chapter_order:
    fpath = os.path.join(BASE, f'{ch}.tex')
    if os.path.exists(fpath):
        chapter_blocks[ch] = extract_blocks(fpath)
        # Count types
        types = {}
        for bt, _ in chapter_blocks[ch]:
            types[bt] = types.get(bt, 0) + 1
        print(f"  {ch}: {len(chapter_blocks[ch])} blok ({', '.join(f'{k}:{v}' for k,v in types.items())})")

# Group into subtopics preserving chapter order
subtopics = ['M01.01','M01.02','M01.03','M01.04','M01.05','M01.06','M01.07','M01.08','M01.09','M01.10','M01.11','M01.12','M01.13','M01.14','M01.15','M01.16','M01.17','M01.18','M01.19']
subtopic_blocks = {sid: [] for sid in subtopics}

for ch in chapter_order:
    sid, title = CHAPTER_MAP[ch]
    if ch in chapter_blocks:
        seen = set()
        for bt, txt in chapter_blocks[ch]:
            key = txt[:80]
            if key not in seen and len(txt) >= 15:
                seen.add(key)
                subtopic_blocks[sid].append((bt, txt))

# Read questions from existing file
with open('src/data/topicContent.ts', 'r') as f:
    ts = f.read()

m02_start = ts.find('"M02.01"')

# Extract questions per subtopic (use m02_start as boundary for last subtopic)
subtopic_questions = {}
for sid in subtopics:
    pat = f'"{sid}": t('
    idx = ts.find(pat)
    if idx < 0: continue
    
    # Find questions array start (after theory array's closing ],)
    q_start_match = re.search(r'\],\s*\[', ts[idx:idx+50000])
    if not q_start_match: continue
    q_start = idx + q_start_match.end()
    
    # Find end boundary
    next_idx = m02_start
    for nsid in subtopics:
        if nsid <= sid: continue
        ni = ts.find(f'"{nsid}": t(', idx + 10)
        if 0 < ni < next_idx: next_idx = ni
    
    q_section = ts[q_start:next_idx]
    end_pos = q_section.rfind('])')
    if end_pos < 0: continue
    
    # Extract questions: strip ALL trailing ]) patterns (file may have accumulated duplicates)
    q_text = q_section[:end_pos].strip()
    while q_text.endswith('])'):
        q_text = q_text[:-2].rstrip()
    q_text = q_text.rstrip(',').strip()
    
    if q_text and ('id: "' in q_text or '// Questions' in q_text):
        subtopic_questions[sid] = q_text
        count = q_text.count('id: "') if 'id: "' in q_text else 0
    else:
        subtopic_questions[sid] = ''

# Generate output
output_parts = []
for sid in subtopics:
    title = COMBINED_TITLES.get(sid, '')
    if not title:
        # Use first chapter's title
        for ch in chapter_order:
            s, t = CHAPTER_MAP[ch]
            if s == sid: title = t; break
    
    blocks = subtopic_blocks.get(sid, [])
    questions = subtopic_questions.get(sid, '')
    
    theory_lines = [f'    {{ type: "{bt}", content: "{ts_escape(txt)}" }}' for bt, txt in blocks]
    theory_str = ',\n'.join(theory_lines)
    
    entry = f'''  "{sid}": t("{sid}", "{title}", [
{theory_str}
  ], [
{questions}
  ])'''
    output_parts.append(entry)
    
    # Stats
    type_counts = {}
    for bt, _ in blocks: type_counts[bt] = type_counts.get(bt, 0) + 1
    q_count = questions.count('id: "') if 'id: "' in questions else 0
    types_str = ', '.join(f'{k}:{v}' for k,v in sorted(type_counts.items()))
    print(f"  📘 {sid} ({title[:30]}...): {len(blocks)} blok ({types_str}), {q_count} savol")

# Write
new_m01 = ',\n\n'.join(output_parts)
m01_start = ts.find('"M01.01"')
if m01_start < 0: m01_start = ts.find('"M01.01"')
new_ts = ts[:m01_start] + new_m01 + ',\n\n' + ts[m02_start:]

with open('src/data/topicContent.ts', 'w') as f:
    f.write(new_ts)

total_blocks = sum(len(v) for v in subtopic_blocks.values())
print(f"\n✅ Yangi M01 yozildi! Jami: {total_blocks} blok")
