"""
Generate complete M01 TypeScript content from LaTeX chapter files.
Maps 17 chapters into 11 subtopics (Variant A grouping).
"""

import re
import os
import json

BASE = '/Users/sarvar9417/Desktop/attestatsiya/Axborot_va_axborot_jarayonlari_LaTeX'

# Chapter to subtopic mapping (Variant A)
CHAPTER_MAP = {
    '01_fundamentals.tex': ('M01.01', 'Informatika, malumot, axborot va bilim'),
    '02_properties_forms.tex': ('M01.02', 'Axborot xossalari, shakllari va turlari'),
    '03_sources_processes.tex': ('M01.03', 'Manbalar, kanallar va axborot jarayonlari'),
    '04_digital_culture.tex': ('M01.04', 'AT, raqamli muhit va madaniyat'),
    '05_signs_codes.tex': ('M01.05', 'Belgi, kod, kodlash va shifrlash'),
    '07_units_hartley.tex': ('M01.06', 'Bit, bayt va Xartli formulasi'),
    '08_text_encoding.tex': ('M01.07', 'Matn kodlash'),
    '09_graphics.tex': ('M01.07', 'Grafik kodlash'),
    '10_audio.tex': ('M01.07', 'Audio kodlash'),
    '11_video.tex': ('M01.07', 'Video kodlash'),
    '12_formats_compression.tex': ('M01.07', 'Format va siqish'),
    '13_volume_calculations.tex': ('M01.08', 'Hajm hisoblash'),
    '14_transmission.tex': ('M01.08', 'Uzatish tezligi'),
    '15_search_reliability.tex': ('M01.09', 'Izlash, saralash, baholash'),
    '16_validation.tex': ('M01.11', 'Validatsiya va verifikatsiya'),
    '17_copyright.tex': ('M01.10', 'Mualliflik huquqi va netiket'),
    '19_exam_traps.tex': ('M01.11', 'Nozik farqlar va diagnostika'),
}

def clean_text(text):
    """Convert LaTeX text to clean plaintext."""
    text = re.sub(r'\\keyterm\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\eng\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\src\{[^}]+\}\{[^}]*\}', '', text)
    text = re.sub(r'\\textbf\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\textit\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\emph\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\texttt\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\textbackslash\{\}', '\\\\', text)
    text = re.sub(r'\\textasciitilde\{\}', '~', text)
    text = re.sub(r'\\textasciicircum\{\}', '^', text)
    # Remove TikZ pictures and complex LaTeX environments
    text = re.sub(r'\\begin\{tikzpicture\}.*?\\end\{tikzpicture\}', '', text, flags=re.DOTALL)
    text = re.sub(r'\\begin\{center\}.*?\\end\{center\}', '', text, flags=re.DOTALL)
    text = re.sub(r'\\section\{[^}]*\}', '', text)
    text = re.sub(r'\\subsection\{[^}]*\}', '', text)
    text = re.sub(r'\\chapter\{[^}]*\}', '', text)
    text = re.sub(r'\\chapterintro\{[^}]*\}', '', text)
    text = re.sub(r'\\begin\{multicols\}.*?\\end\{multicols\}', '', text, flags=re.DOTALL)
    # Convert math
    text = re.sub(r'\\\[(.*?)\\\]', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\$(.*?)\$', r'\1', text)
    text = re.sub(r'\$\$(.*?)\$\$', r'\1', text, flags=re.DOTALL)
    text = re.sub(r'\\\(', '', text)
    text = re.sub(r'\\\)', '', text)
    text = re.sub(r'\\boxed\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\underbrace\{([^}]+)\}_\{[^}]*\}', r'\1', text)
    # Convert LaTeX math commands
    text = re.sub(r'\\cdot', '*', text)
    text = re.sub(r'\\times', '*', text)
    text = re.sub(r'\\div', '/', text)
    text = re.sub(r'\\leq', '<=', text)
    text = re.sub(r'\\geq', '>=', text)
    text = re.sub(r'\\rightarrow', '→', text)
    text = re.sub(r'\\to', '→', text)
    text = re.sub(r'\\leftarrow', '←', text)
    text = re.sub(r'\\Rightarrow', '=>', text)
    text = re.sub(r'\\approx', '≈', text)
    text = re.sub(r'\\sim', '~', text)
    text = re.sub(r'\\log', 'log', text)
    text = re.sub(r'\\lceil', 'ceil(', text)
    text = re.sub(r'\\rceil', ')', text)
    text = re.sub(r'\\lfloor', 'floor(', text)
    text = re.sub(r'\\rfloor', ')', text)
    text = re.sub(r'\\circ', '°', text)
    text = re.sub(r'\\ldots', '...', text)
    text = re.sub(r'\\dots', '...', text)
    text = re.sub(r'\\%', '%', text)
    text = re.sub(r'\\#', '#', text)
    text = re.sub(r'\\\_', '_', text)
    # Clean up whitespace
    text = re.sub(r'\\n\s*\\n', '\n\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'\\[a-zA-Z]+', '', text)  # Remove remaining LaTeX commands
    text = text.strip()
    return text

def extract_sections(text):
    """Extract structured content from LaTeX chapter."""
    sections = []
    
    # Extract definitions
    defs = re.findall(r'\\begin\{definition\}(.*?)\\end\{definition\}', text, re.DOTALL)
    for d in defs:
        cleaned = clean_text(d)
        # Remove the "«...»" style markers if present
        cleaned = re.sub(r'^«([^»]+)»\s*[-–—]+\s*', '', cleaned)
        sections.append(('definition', cleaned))
    
    # Extract trap/note blocks
    traps = re.findall(r'\\begin\{(trap|extra)\}(.*?)\\end\{\1\}', text, re.DOTALL)
    for _, content in traps:
        cleaned = clean_text(content)
        sections.append(('note', cleaned))
    
    # Extract example/exam blocks
    examples = re.findall(r'\\begin\{(examplebox|exam)\}(.*?)\\end\{\1\}', text, re.DOTALL)
    for _, content in examples:
        cleaned = clean_text(content)
        sections.append(('example', cleaned))
    
    # Extract tables
    tables = re.findall(r'\\begin\{(longtable|tabularx)\}.*?\{(.*?)\}(.*?)\\end\{\1\}', text, re.DOTALL)
    for _, spec, content in tables:
        cleaned = clean_table(content)
        if cleaned:
            sections.append(('table', cleaned))
    
    # Extract itemize/enumerate as text
    items = re.findall(r'\\begin\{(itemize|enumerate)\}(.*?)\\end\{\1\}', text, re.DOTALL)
    for _, content in items:
        cleaned = clean_itemize(content)
        sections.append(('text', cleaned))
    
    # Extract regular paragraphs
    paragraphs = re.findall(r'(?<=\n\n)([^\n].*?)(?=\n\n|\Z)', text, re.DOTALL)
    for p in paragraphs:
        p = p.strip()
        if not p or p.startswith('\\') or len(p) < 30:
            continue
        p = clean_text(p)
        if len(p) > 30:
            sections.append(('text', p))
    
    # Extract description environments
    descs = re.findall(r'\\begin\{description\}(.*?)\\end\{description\}', text, re.DOTALL)
    for d in descs:
        cleaned = clean_description(d)
        sections.append(('text', cleaned))
    
    return sections

def clean_table(text):
    """Extract table content from LaTeX tabular."""
    rows = []
    for line in text.split('\n'):
        line = line.strip()
        if not line or line.startswith('\\') or line.startswith('%'):
            continue
        if '&' in line:
            cells = [clean_text(c.strip()) for c in line.split('&')]
            # Remove LaTeX commands from cells
            cells = [re.sub(r'\\(?:keyterm|textbf|texttt)\{([^}]*)\}', r'\1', c) for c in cells]
            cells = [re.sub(r'\\[a-z]+\{[^}]*\}', '', c) for c in cells]
            cells = [re.sub(r'\\[a-z]+', '', c) for c in cells]
            cells = [c.replace('\\\\', '').strip() for c in cells]
            if cells and any(c for c in cells):
                rows.append('| ' + ' | '.join(cells) + ' |')
        elif '\\\\' in line and '&' not in line:
            # End of row marker
            pass
    return '\n'.join(rows) if rows else ''

def clean_itemize(text):
    """Extract itemize/enumerate content."""
    items = re.findall(r'\\item\s+(.*?)(?=\\item|\Z)', text, re.DOTALL)
    result = []
    for item in items:
        cleaned = clean_text(item.strip())
        if cleaned:
            result.append('• ' + cleaned)
    return '\n'.join(result)

def clean_description(text):
    """Extract description environment content."""
    items = re.findall(r'\\item\[(.*?)\]\s*(.*?)(?=\\item|\Z)', text, re.DOTALL)
    result = []
    for term, desc in items:
        t = clean_text(term)
        d = clean_text(desc.strip())
        if t:
            result.append(f'«{t}» — {d}')
    return '\n'.join(result)

def escape_ts_string(s):
    """Escape string for TypeScript double-quoted string."""
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    s = s.replace('\n', '\\n')
    return s

def generate_subtopic(chapters_data):
    """Generate TypeScript for a single subtopic."""
    result = []
    
    for chap_file, chap_content, chap_title in chapters_data:
        sections = extract_sections(chap_content)
        
        # Add source comment
        result.append(f'    // Manba: {chap_file}')
        
        for block_type, content in sections:
            if not content.strip():
                continue
            escaped = escape_ts_string(content.strip())
            result.append(f'    {{ type: "{block_type}", content: "{escaped}" }},')
    
    return '\n'.join(result)

def main():
    # Read all chapter files
    chapters = {}
    chap_dir = os.path.join(BASE, 'chapters')
    
    for fname in sorted(os.listdir(chap_dir)):
        if not fname.endswith('.tex'):
            continue
        fpath = os.path.join(chap_dir, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        chapters[fname] = content
    
    # Group chapters by subtopic
    subtopic_content = {}
    subtopic_titles = {}
    
    for chap_file, (sub_id, title) in CHAPTER_MAP.items():
        if chap_file not in chapters:
            print(f"Warning: {chap_file} not found")
            continue
        if sub_id not in subtopic_content:
            subtopic_content[sub_id] = []
            subtopic_titles[sub_id] = title
        # Add a comment for each chapter
        chapter_title = chap_file.replace('.tex', '').replace('_', ' ').title()
        subtopic_content[sub_id].append(chapter_title)
        subtopic_content[sub_id].append(chapters[chap_file])
    
    # Generate TypeScript for each subtopic
    output_parts = []
    
    # Sort subtopics by ID
    for sub_id in sorted(subtopic_content.keys()):
        data = subtopic_content[sub_id]
        title = subtopic_titles[sub_id]
        # data[0] is chapter title, data[1] is the file content, etc.
        
        # Extract the actual content
        chap_files = []
        chap_contents = []
        for i in range(1, len(data), 2):
            chap_title = data[i-1]
            chap_content = data[i]
            chap_files.append(chap_title)
            chap_contents.append(chap_content)
        
        # Generate blocks
        all_blocks = []
        for chap_title, chap_content in zip(chap_files, chap_contents):
            sections = extract_sections(chap_content)
            for block_type, content in sections:
                if content.strip():
                    escaped = escape_ts_string(content.strip())
                    all_blocks.append(f'    {{ type: "{block_type}", content: "{escaped}" }},')
        
        blocks_str = '\n'.join(all_blocks)
        
        sub_code = f'  "{sub_id}": t("{sub_id}", "{escape_ts_string(title)}", [\n{blocks_str}\n  ], [\n    // Questions TBD\n  ]),'
        
        output_parts.append(sub_code)
    
    # Output to file
    output_text = '// ╔══════════════════════════════════════════════════════════════════╗\n'
    output_text += '// ║  M01 «Axborot va axborot jarayonlari» — 17 bob, 11 subtopic  ║\n'
    output_text += '// ╚══════════════════════════════════════════════════════════════════╝\n\n'
    output_text += '\n\n'.join(output_parts)
    
    out_path = '/Users/sarvar9417/Desktop/attestatsiya/scripts/m01_generated.txt'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(output_text)
    
    total_blocks = sum(len(extract_sections(content)) for sub_content in subtopic_content.values() 
                       for i, content in enumerate(sub_content) if i % 2 == 1)
    print(f"Generated M01 content: {len(subtopic_content)} subtopics")
    print(f"Total theory blocks: ~{total_blocks}")
    print(f"Output: {out_path}")
    print(f"Size: {len(output_text)} chars")

if __name__ == '__main__':
    main()
