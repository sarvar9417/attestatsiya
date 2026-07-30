#!/usr/bin/env python3
"""
M01 modulini LaTeX asosida qayta qurish.
"""
import os, re, json

CHAPTER_MAP = {
    '01_fundamentals': 'M01.01', '02_properties_forms': 'M01.02',
    '03_sources_processes': 'M01.02', '04_digital_culture': 'M01.03',
    '05_signs_codes': 'M01.04', '07_units_hartley': 'M01.05',
    '08_text_encoding': 'M01.07', '09_graphics': 'M01.07',
    '10_audio': 'M01.07', '11_video': 'M01.07',
    '12_formats_compression': 'M01.07', '13_volume_calculations': 'M01.06',
    '14_transmission': 'M01.06', '15_search_reliability': 'M01.09',
    '16_validation': 'M01.09', '17_copyright': 'M01.08',
}

SUBTOPIC_TITLES = {
    'M01.01': "Informatika, ma'lumot, axborot va bilim",
    'M01.02': "Axborot turlari, xossalari, manbalari va jarayonlari",
    'M01.03': "Axborot texnologiyalari va raqamli muhit",
    'M01.04': "Belgi, kod, kodlash va shifrlash",
    'M01.05': "Bit, bayt, axborot birliklari va Xartli formulasi",
    'M01.06': "Axborot hajmi, uzatish tezligi va aloqa kanali",
    'M01.07': "Matn, grafika, audio, videoni kodlash va siqish",
    'M01.08': "Mualliflik huquqi, litsenziya va raqamli etika",
    'M01.09': "Axborotni izlash, tekshirish va validatsiya",
}

CHAPTER_COMMENTS = {
    'M01.01': "1-Bob: Informatika, ma'lumot, axborot va bilim",
    'M01.02': "2-Bob + 3-Bob: Xossalar, turlar, manbalar, jarayonlar",
    'M01.03': "4-Bob: AT, raqamli muhit, axborot madaniyati",
    'M01.04': "5-Bob: Belgi, kod, kodlash, shifrlash",
    'M01.05': "7-Bob: Bit, bayt, Xartli, prefikslar",
    'M01.06': "13-Bob + 14-Bob: Hajm, tezlik, aloqa kanallari",
    'M01.07': "8,9,10,11,12-Boblar: Matn, grafika, audio, video, siqish",
    'M01.08': "17-Bob: Mualliflik huquqi, litsenziyalar, etika",
    'M01.09': "15-Bob + 16-Bob: Izlash, tekshirish, validatsiya",
}


def clean_text(text):
    """Remove LaTeX commands, keep plain text."""
    text = re.sub(r'\\(?:keyterm|textbf|textit|eng|texttt)\{([^}]*)\}', r'\1', text)
    text = re.sub(r'\\(?:src|cite)\{[^}]*\}\{[^}]*\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{definition\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{trap\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{exam(?:plebox)?\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{extra\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{summarybox\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{sourcebox\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{description\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{itemize\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{enumerate\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{center\}', '', text)
    text = re.sub(r'\\(?:begin|end)\{tabularx\*\?\}|\\(?:begin|end)\{longtable\*\?\}|\\(?:begin|end)\{tabular\*\?}', '', text)
    text = re.sub(r'\\(?:begin|end)\{tikzpicture\}.*?\\(?:begin|end)\{tikzpicture\}', '', text, flags=re.DOTALL)
    text = re.sub(r'\\(?:item|item\[.*?\])', '\\n  \\n', text)
    text = re.sub(r'\\\\(\[-?\d*mm\])?', '\\n', text)
    text = re.sub(r'\\\$', '$', text)
    text = re.sub(r'\$[^$]*\$', '', text)
    text = re.sub(r'\\\[.*?\\\]', '', text, flags=re.DOTALL)
    text = re.sub(r'\\toprule|\\midrule|\\bottomrule|\\endhead', '', text)
    text = re.sub(r'\\chapter\{.*?\}|\\chapterintro\{.*?\}|\\section\{.*?\}|\\subsection\{.*?\}', '', text)
    text = re.sub(r'\\(?:text)?(?:mdash|ldots)', '...', text)
    text = re.sub(r'\\(?:%|\~|,|;|:)', '', text)
    text = re.sub(r'\{|\}', '', text)
    text = re.sub(r'\n\\[a-zA-Z]+\{', '\\n', text)
    text = re.sub(r'\\[a-zA-Z]+\{', '', text)
    text = re.sub(r'\}', '', text)
    text = re.sub(r'\n{4,}', '\\n\\n', text)
    text = re.sub(r'  +', ' ', text)
    text = re.sub(r'\\n\\n\\n+', '\\n\\n', text)
    text = re.sub(r'^\s*\\n', '', text, flags=re.MULTILINE)
    return text.strip()


def extract_table_lines(text):
    """Extract lines that look like table rows (containing &)."""
    tables = []
    lines = text.split('\n')
    current_table = []
    in_table = False
    for line in lines:
        if '&' in line and not line.startswith('\\'):
            current_table.append(line)
            in_table = True
        elif in_table and not line.strip():
            if current_table:
                tables.append(current_table)
                current_table = []
            in_table = False
    if current_table:
        tables.append(current_table)
    return tables


def main():
    base = 'Axborot_va_axborot_jarayonlari_LaTeX'
    ch_dir = os.path.join(base, 'chapters')
    subtopics = {k: {'theory': [], 'questions': []} for k in SUBTOPIC_TITLES}
    
    for fname in sorted(os.listdir(ch_dir)):
        if not fname.endswith('.tex'):
            continue
        base_name = fname.replace('.tex', '')
        if base_name not in CHAPTER_MAP:
            continue
        sub = CHAPTER_MAP[base_name]
        
        with open(os.path.join(ch_dir, fname), 'r', encoding='utf-8') as f:
            raw = f.read()
        
        plain = clean_text(raw)
        if not plain or len(plain) < 100:
            continue
        
        # Split into paragraphs
        paras = [p.strip() for p in re.split(r'\n\s*\n', plain) if p.strip()]
        
        for p in paras:
            if len(p) < 40 or len(p.split()) < 5:
                continue
            p_clean = p[:800]  # Limit length
            
            # Classify paragraph type
            lower = p.lower()
            if any(w in lower for w in ['deganda', 'tushuncha', 'jarayon', 'hodisa']):
                t = 'definition'
            elif any(w in lower for w in ['diqqat', 'notogri', 'aralash', 'muhim', 'esda', 'kafolat']) or lower.count(':') > 3:
                t = 'note'
            elif any(w in lower for w in ['masalan', 'misol', 'holat', 'vaziyat']):
                t = 'example'
            elif any(w in lower for w in ['formula', 'tenglama', 'hisoblash']):
                chars = ['=', '+', '-', '*', '/', '×', '÷']
                if any(c in p for c in chars):
                    t = 'formula'
                else:
                    t = 'text'
            else:
                t = 'text'
            
            subtopics[sub]['theory'].append({
                'type': t,
                'content': p_clean.replace('"', "'").replace('\\n', '\\n')
            })
        
        # Extract table-like content
        tbls = extract_table_lines(raw)
        for tbl_rows in tbls:
            cells_list = [r.split('&') for r in tbl_rows if '&' in r]
            if len(cells_list) < 2:
                continue
            header = [c.strip() for c in cells_list[0]]
            if not header:
                continue
            # Build markdown table
            rows = ['| ' + ' | '.join(header) + ' |']
            rows.append('|' + '|'.join(['---'] * len(header)) + '|')
            for row in cells_list[1:]:
                cells = [c.strip() for c in row]
                cells = cells[:len(header)]
                cells += [''] * (len(header) - len(cells))
                rows.append('| ' + ' | '.join(cells) + ' |')
            
            table_str = '\\n'.join(rows)
            if len(table_str) > 30:
                subtopics[sub]['theory'].append({
                    'type': 'table',
                    'content': table_str.replace('"', "'")
                })
    
    # Output stats
    for code in SUBTOPIC_TITLES:
        d = subtopics[code]
        print(f"{code}: {len(d['theory'])} blocks")
    
    total = sum(len(d['theory']) for d in subtopics.values())
    print(f"\nTotal: {total} theory blocks")
    
    # Generate JSON for inspection
    with open('scripts/m01_content.json', 'w', encoding='utf-8') as f:
        json.dump(subtopics, f, ensure_ascii=False, indent=2)
    print("Saved to scripts/m01_content.json")


if __name__ == '__main__':
    main()
