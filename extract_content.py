#!/usr/bin/env python3
"""Extract all content from both textbooks organized by content codes (1.1-13.2)."""

import re

BOOK9_PATH = "/Users/sarvar9417/Desktop/attestatsiya/darsliklar/extracted/9-sinf informatika (Cambridge +).txt"
BOOK1011_PATH = "/Users/sarvar9417/Desktop/attestatsiya/darsliklar/extracted/10-11-sinf informatika (Cambridge +).txt"

def read_lines(path):
    with open(path) as f:
        return f.readlines()

def strip_page_marks(lines):
    """Remove SAHIFA markers but keep the content."""
    return [l for l in lines if not l.startswith('===== SAHIFA')]

def get_text(lines, start, end=None):
    """Get text between start and end indices."""
    chunk = lines[start:end] if end else lines[start:]
    return ''.join(chunk)

# ============================================================
# 9-sinf (IGCSE ICT) chapter boundaries (first occurrence)
# ============================================================
BOOK9_CHAPTERS = [
    (1, "Kompyuter tizimlarining turlari va komponentlari", 175, 1293),
    (2, "Kiritish va chiqarish qurilmalari", 1293, 2423),
    (3, "Xotira qurilmalari va ma'lumot almashish vositalari", 2423, 2943),
    (4, "Kompyuter tarmoqlari va ulardan foydalanish", 2943, 3874),
    (5, "Axborot texnologiyalarining ta'siri", 3874, 4390),
    (6, "AKTni tatbiq etish", 4390, 6379),
    (7, "Tizimlarning hayot davri", 6379, 7369),
    (8, "Xavfsizlik texnikasi qoidalari", 7369, 8640),
    (9, "Auditoriya", 8640, 9070),
    (10, "Kommunikatsiya", 9070, 9702),
    (11, "Fayllar boshqaruvi", 9702, 10159),
    (12, "Tasvirlar", 10159, 10679),
    (13, "Loyihalash", 10679, 11517),
    (14, "Uslublar", 11517, 11974),
    (15, "Xatolarni tekshirish", 11974, 12518),
    (16, "Grafik va xaritalar", 12518, 12979),
    (17, "Hujjatlar bilan ishlash", 12979, 13534),
    (18, "Ma'lumotlarni boshqarish", 13534, 14589),
    (19, "Taqdimot", 14589, 15206),
    (20, "Ma'lumotlar tahlili", 15206, 16239),
    (21, "Veb-saytlar yaratish", 16239, 17715),
]

# ============================================================
# 10-11-sinf (AS & A Level IT) chapter boundaries
# These are from TOC; real content starts after "Ta'lim maqsadlari"
# ============================================================
# Actual content boundaries (these contain real chapter content)
# The TOC is at lines 95-131, real content starts around line 200
BOOK1011_CHAPTERS = [
    (1, "Bilimlar bazasi", 301, 1944),
    (2, "Texnik va dasturiy ta'minot", 1944, 4429),
    (3, "Kuzatuv va boshqaruv", 4429, 4814),
    (4, "Elektron xavfsizlik, salomatlik va xavfsizlik", 4814, 5513),
    (5, "Raqamli tengsizlik", 5513, 5967),
    (6, "Tarmoqlardan foydalanish", 5967, 7325),
    (7, "Ekspert tizimlar", 7325, 7845),
    (8, "Elektron jadvallar", 7845, 10717),
    (9, "Ma'lumotlar bazasi va fayl konsepsiyalari", 10717, 14359),
    (10, "Tovush va videoni tahrirlash", 14359, 14861),
    (11, "Yangi texnologiyalar", 14861, 15815),
    (12, "Axborot texnologiyalarining o'rni va jamiyatdagi ta'siri", 15815, 16725),
    (13, "Tarmoqlar", 16725, 18366),
    (14, "Loyiha boshqaruvi", 18366, 19831),
    (15, "Tizimdan foydalanish sikli", 19831, 21403),
    (16, "Grafik yaratish", 21403, 22050),
    (17, "Animatsiya", 22050, 22408),
    (18, "Xatlarni birlashtirish", 22408, 22966),
    (19, "Veb uchun dasturlash", 22966, 24079),
]

# ============================================================
# Content Code Mapping (1.1 - 13.2)
# Based on attestation curriculum and chapter topics
# ============================================================
CONTENT_CODE_MAP = {
    # 1.x - Axborot va raqamli savodxonlik (Information & Digital Literacy)
    "1.1": "Informatika, axborot, ma'lumot va bilim",
    "1.2": "Axborot turlari va manbalari",
    "1.3": "Axborot va raqamli texnologiyalar",
    "1.4": "Axborotni kodlash",
    "1.5": "Axborot o'lchov birliklari",
    "1.6": "Axborot hajmi va uzatish tezligi",
    "1.7": "Matn, grafika, audio va videoni kodlash",
    "1.8": "Raqamli axloq va mualliflik huquqi",
    "1.9": "Axborotni saralash, tekshirish va xulosa chiqarish",
    
    # 2.x - Kompyuter tizimlari va dasturiy muhit (Computer Systems)
    "2.1": "Kompyuter qurilmalari va tizimlari (HW, protsessor, xotira, kiritish/chiqarish)",
    "2.2": "Dasturiy ta'minot (OT, amaliy dasturlar, fayl boshqaruvi)",
    
    # 3.x - Mantiqiy fikrlash va algoritmlash
    "3.1": "Mantiq asoslari va mulohazalar",
    "3.2": "Mantiqiy amallar va rostlik jadvallari",
    "3.3": "Sanoq sistemalari",
    "3.4": "Algoritm tushunchasi va turlari",
    
    # 4.x - Dasturlash
    "4.1": "Scratch muhiti va dasturlash",
    "4.2": "Python dasturlash",
    "4.3": "JavaScript dasturlash",
    
    # 5.x - Sanoq sistemalari
    "5.1": "Sanoq sistemalari asoslari va o'tkazish",
    "5.2": "Sanoq sistemalarida arifmetika",
    
    # 6.x - MS Office (Amaliy dasturlar)
    "6.1": "MS Word - matn muharriri",
    "6.2": "MS Excel - elektron jadvallar",
    "6.3": "MS PowerPoint - taqdimotlar",
    
    # 7.x - Ma'lumotlar bazasi
    "7.1": "Ma'lumotlar bazasi asoslari",
    "7.2": "MS Access va SQL",
    "7.3": "Ekspert tizimlar",
    
    # 8.x - Kompyuter grafikasi va media
    "8.1": "Grafika turlari va muharrirlar",
    "8.2": "Rang modellari va formatlar",
    "8.3": "Animatsiya",
    
    # 9.x - Kompyuter tarmoqlari
    "9.1": "Tarmoq tushunchasi, turlari va qurilmalari",
    "9.2": "Internet va kommunikatsiya",
    
    # 10.x - Veb texnologiyalar
    "10.1": "HTML asoslari",
    "10.2": "CSS va veb-sayt loyihalash",
    
    # 11.x - Axborot xavfsizligi
    "11.1": "Axborot xavfsizligi va himoya",
    "11.2": "Shaxsiy ma'lumotlar va maxfiylik",
    
    # 12.x - AKTning jamiyatdagi ta'siri
    "12.1": "AKT va jamiyat",
    "12.2": "Raqamli tengsizlik",
    
    # 13.x - Multimedia
    "13.1": "Audio va video asoslari",
    "13.2": "Audio va video tahrirlash",
}

# ============================================================
# Chapter to Content Code Mapping
# ============================================================
# 9-sinf chapters -> content codes
BOOK9_TO_CODES = {
    1: ["2.1"],  # Kompyuter tizimlarining turlari va komponentlari
    2: ["2.1"],  # Kiritish va chiqarish qurilmalari
    3: ["2.1"],  # Xotira qurilmalari
    4: ["9.1"],  # Kompyuter tarmoqlari
    5: ["12.1", "12.2"],  # AKT ta'siri
    6: ["2.2"],  # AKTni tatbiq etish
    7: [],  # Tizimlarning hayot davri (system lifecycle)
    8: ["11.1", "11.2"],  # Xavfsizlik
    9: [],  # Auditoriya
    10: ["9.2"],  # Kommunikatsiya
    11: ["2.2"],  # Fayllar boshqaruvi
    12: ["8.1", "8.2"],  # Tasvirlar
    13: ["10.2"],  # Loyihalash
    14: [],  # Uslublar (styles)
    15: [],  # Xatolarni tekshirish (proofing)
    16: ["6.2"],  # Grafik va xaritalar
    17: ["6.1"],  # Hujjatlar bilan ishlash
    18: ["7.1"],  # Ma'lumotlarni boshqarish
    19: ["6.3"],  # Taqdimot
    20: ["6.2"],  # Ma'lumotlar tahlili
    21: ["10.1", "10.2"],  # Veb-saytlar yaratish
}

# 10-11-sinf chapters -> content codes
BOOK1011_TO_CODES = {
    1: ["1.1", "1.2", "1.4", "1.5", "1.9"],  # Bilimlar bazasi
    2: ["2.1", "2.2"],  # Texnik va dasturiy ta'minot
    3: [],  # Kuzatuv va boshqaruv
    4: ["11.1", "11.2"],  # Elektron xavfsizlik
    5: ["12.2"],  # Raqamli tengsizlik
    6: ["9.1"],  # Tarmoqlardan foydalanish
    7: ["7.3"],  # Ekspert tizimlar
    8: ["6.2"],  # Elektron jadvallar
    9: ["7.1", "7.2"],  # Ma'lumotlar bazasi
    10: ["13.1", "13.2"],  # Tovush va videoni tahrirlash
    11: ["1.3"],  # Yangi texnologiyalar
    12: ["12.1"],  # AKTning jamiyatdagi ta'siri
    13: ["9.1"],  # Tarmoqlar
    14: [],  # Loyiha boshqaruvi
    15: [],  # Tizimdan foydalanish sikli
    16: ["8.1", "8.2", "8.3"],  # Grafik yaratish
    17: ["8.3"],  # Animatsiya
    18: [],  # Xatlarni birlashtirish (mail merge)
    19: ["10.1"],  # Veb uchun dasturlash
}

def extract_content(lines, chapters, book_to_codes, book_name):
    """Extract content organized by content codes."""
    code_content = {}
    for ch_num, ch_title, start, end in chapters:
        codes = book_to_codes.get(ch_num, [])
        text = get_text(lines, start, end)
        # Clean up
        text = re.sub(r'^===== SAHIFA \d+ =====\n', '', text, flags=re.MULTILINE)
        
        # Add chapter marker
        header = f" [{book_name}: {ch_num}-bob. {ch_title}]\n"
        
        for code in codes:
            if code not in code_content:
                code_content[code] = []
            code_content[code].append((book_name, header, text))
    
    return code_content


def main():
    lines9 = read_lines(BOOK9_PATH)
    lines1011 = read_lines(BOOK1011_PATH)
    
    # Extract content organized by code
    code_content_9 = extract_content(lines9, BOOK9_CHAPTERS, BOOK9_TO_CODES, "9-sinf")
    code_content_1011 = extract_content(lines1011, BOOK1011_CHAPTERS, BOOK1011_TO_CODES, "10-11-sinf")
    
    # Merge all by code
    all_content = {}
    for code in list(code_content_9.keys()) + list(code_content_1011.keys()):
        if code not in all_content:
            all_content[code] = []
        if code in code_content_9:
            all_content[code].extend(code_content_9[code])
        if code in code_content_1011:
            all_content[code].extend(code_content_1011[code])
    
    # Output sorted by code
    sorted_codes = sorted(all_content.keys(), key=lambda x: [int(n) for n in x.split('.')])
    
    output_lines = []
    for code in sorted_codes:
        display_name = CONTENT_CODE_MAP.get(code, "")
        output_lines.append(f"\n{'='*80}")
        output_lines.append(f"## {code}: {display_name}")
        output_lines.append(f"{'='*80}\n")
        
        for book_name, header, text in all_content[code]:
            output_lines.append(f"[{book_name}]{header}")
            output_lines.append(text)
            output_lines.append("\n" + "-"*40 + "\n")
    
    output = '\n'.join(output_lines)
    
    # Write to file
    output_path = "/Users/sarvar9417/Desktop/attestatsiya/darsliklar/extracted/barcha_kontent_kodlar_boyicha.txt"
    with open(output_path, 'w') as f:
        f.write(output)
    
    print(f"Content extracted and saved to: {output_path}")
    print(f"Total characters: {len(output)}")
    print(f"Content codes covered: {len(sorted_codes)}")

if __name__ == "__main__":
    main()
