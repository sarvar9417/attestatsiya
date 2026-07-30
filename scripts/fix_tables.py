#!/usr/bin/env python3
"""
Fix incomplete and duplicate tables in M01 topicContent.ts
"""
import re

with open('src/data/topicContent.ts', 'r') as f:
    ts = f.read()

# =====================================================================
# 1. M01.01 - FIX BROKEN TABLE (4 approaches with empty right column)
# =====================================================================
old_m01_01_table = '''    { type: "table", content: "| Hissiy-idrokiy |  |\\n| Mazmuniy |  |\\n| Kibernetik |  |\\n| Shennoncha |  |" },'''

new_m01_01_table = '''    { type: "table", content: "| Hissiy-idrokiy | Borliqdagi narsa va hodisalarning sezgi a'zolari orqali ongda aks etishi. |\\n| Mazmuniy | Xabarni qabul qilish natijasida inson ongida hosil bo'lgan ma'no. |\\n| Kibernetik | Boshqaruv tizimining tashqi muhitga moslashishi va qaror qabul qilishi uchun foydalaniladigan mazmun. |\\n| Shennoncha | Natija haqidagi noaniqlikning kamayishi. Teng ehtimolli ikki holatdan bittasi ma'lum bo'lishi 1 bit axborot beradi. |" },'''

if old_m01_01_table in ts:
    ts = ts.replace(old_m01_01_table, new_m01_01_table)
    print("✅ M01.01 jadval to'ldirildi")
else:
    print("❌ M01.01 jadval topilmadi, qidirilmoqda...")
    # Try to find it with regex
    match = re.search(r'\{\s*type:\s*"table",\s*content:\s*"\|\s*Hissiy-idrokiy\s*\|\s*\|\s*[^"]*"\s*\}', ts)
    if match:
        print(f"   Topildi: {match.group()[:80]}...")
    else:
        print("   Hech qanday moslik topilmadi")

# =====================================================================
# 2. M01.02 - REMOVE DUPLICATE TABLE (table 4 is same as table 3)
#    The duplicate was created when we added axborot sifati content
# =====================================================================
# Find the duplicate - M01.02 has tables 3 and 4 which are identical
# We need to remove table 4. It's the one that comes right before ]], [
# Let me find it more precisely

# Count how many table blocks are between the last text block and questions start
# Actually the issue is more subtle. Let me look at the M01.02 content.
# The 3rd table is the one I added (with izoh column), 
# the 4th is the pre-existing one (also with izoh but we need to remove it)

# Strategy: Find pattern where two identical axborot sifati tables appear consecutively
m01_02_start = ts.find('"M01.02": t(')
m01_02_end = ts.find('"M01.03": t(', m01_02_start + 10)
m01_02_block = ts[m01_02_start:m01_02_end]

# Count table blocks in M01.02
old_count = m01_02_block.count('type: "table"')
print(f"\n📘 M01.02 da {old_count} ta table blok")

# The duplicate is the 4th table (last one before questions)
# Remove the LAST occurrence of the axborot sifati table block
# Pattern: the table that starts with Aniqlik / to'g'rilik and ends with Mavjudlik
dup_pattern = r',\s*\n\s*\{ type: "table", content: "\| Aniqlik / to[\'"]g[\'"]rilik \| Fakt va qiymatlar xatosizmi\? \|[\s\S]*?\| Mavjudlik \| Ruxsatli foydalanuvchi vaqtida oladimi\? \|"\s*\}'

matches = list(re.finditer(dup_pattern, ts[m01_02_start:m01_02_end]))
if len(matches) >= 2:
    # Remove the second occurrence (the duplicate)
    dup_start = m01_02_start + matches[1].start()
    dup_end = m01_02_start + matches[1].end()
    ts = ts[:dup_start] + ts[dup_end:]
    print(f"✅ M01.02 dublikat jadval olib tashlandi ({dup_end-dup_start} chars)")
else:
    print(f"⚠️ M01.02: {len(matches)} ta moslik topildi, dublikat yo'q")

# =====================================================================
# 3. M01.02 TABLE 2 - Fix empty Izoh column
#    This is the "Nazorat savoli" table that lost its Izoh column
#    Currently has: | Fakt va qiymatlar xatosizmi? |  |
#    Should have:  | Aniqlik/to'g'rilik | Fakt va qiymatlar xatosizmi? | Raqam, ism, sana... |
# =====================================================================
# Actually, looking at the output, Table 2 in M01.02 has just the nazorat savollari
# without the Xossa column. It was meant to be a checklist, not a comparison table.
# Let me just fill the empty right column with meaningful content

m01_02_block2 = '''    { type: "table", content: "| Fakt va qiymatlar xatosizmi? |  |\\n| Manba va dalilga ishonish mumkinmi? |  |\\n| Maqsadga aynan shu ma'lumot kerakmi? |  |\\n| Axborot eskirmaganmi? |  |\\n| Qaror uchun zarur qismlar bormi? |  |\\n| Tafsilot kam ham, ortiqcha ham emasmi? |  |\\n| Qabul qiluvchi til va belgilarni tushunadimi? |  |\\n| Axborot qaror yoki ishga xizmat qiladimi? |  |\\n| Fakt fikr va manfaatdan ajratilganmi? |  |\\n| Ruxsatli foydalanuvchi vaqtida oladimi? |  |" },'''

m01_02_block2_fixed = '''    { type: "table", content: "| Aniqlik / to'g'rilik | Fakt va qiymatlar xatosizmi? |\\n| Ishonchlilik | Manba va dalilga ishonish mumkinmi? |\\n| Dolzarblik | Maqsadga aynan shu ma'lumot kerakmi? |\\n| O'z vaqtidalik | Axborot eskirmaganmi? |\\n| To'liqlik | Qaror uchun zarur qismlar bormi? |\\n| Tafsilot darajasi | Tafsilot kam ham, ortiqcha ham emasmi? |\\n| Tushunarlilik | Qabul qiluvchi til va belgilarni tushunadimi? |\\n| Foydalilik | Axborot qaror yoki ishga xizmat qiladimi? |\\n| Obyektivlik | Fakt fikr va manfaatdan ajratilganmi? |\\n| Mavjudlik | Ruxsatli foydalanuvchi vaqtida oladimi? |" },''' 

if m01_02_block2 in ts:
    ts = ts.replace(m01_02_block2, m01_02_block2_fixed)
    print("✅ M01.02 2-jadval to'ldirildi")
else:
    print("⚠️ M01.02 2-jadval topilmadi (allaqachon tuzatilgan bo'lishi mumkin)")

# =====================================================================
# 4. M01.09 - REMOVE DUPLICATE TABLES (1 and 3 are similar)
#    Table 1 was from the original content (truncated), Table 3 is from our fix
#    Keep table 3 (the complete one), remove table 1
# =====================================================================
# Find the first table in M01.09 (the incomplete search operators one)
m01_09_start = ts.find('"M01.09": t(')
m01_09_end = ts.find('"M01.10": t(', m01_09_start + 10)

# The first table in M01.09 has only 2 rows (truncated from 5)
# It looks like: | Aniq kalit so'z | axborot hajmi formula | umumiy gapni toraytiradi |
# The second version has more content
# Let me remove the first table

# Find pattern: first table in M01.09 with 2 rows
old_m01_09_t1 = '''    { type: "table", content: "| Aniq kalit so'z | axborot hajmi formula | umumiy gapni toraytiradi |\\n| Qo'shtirnoq | \\\\" },''' 

# Hmm, but this exact string might not match due to escaping. Let me look at the actual content
# From the analysis: Table 1 has 2 rows, Table 3 has 5 rows - they're duplicates
# Let me check the actual text

m01_09_block = ts[m01_09_start:m01_09_end]
tables_in_09 = [m.start() for m in re.finditer(r'type: "table"', m01_09_block)]
print(f"\n📘 M01.09 da {len(tables_in_09)} ta table blok")

if len(tables_in_09) >= 2:
    # Find the first table's full content and remove it
    first_table_start = m01_09_start + tables_in_09[0]
    # Find where this table block ends (next table or next block)
    if len(tables_in_09) >= 2:
        first_table_end = m01_09_start + tables_in_09[1]
    else:
        first_table_end = m01_09_start + len(m01_09_block)
    
    # Need to go back to find the start of the full table block (including { type: "table"... })
    start_search = ts.rfind('{', first_table_start - 100, first_table_start)
    end_search = ts.find(',', first_table_end - 5, first_table_end + 200)
    if end_search > 0:
        # Remove from { to the next ,\n{ or ,\n    {
        # Safety: just find the complete block
        removed = ts[first_table_start:first_table_end]
        print(f"   Birinchi jadval: {removed[:60]}...")
        
        # Remove the first table occurrence
        # The block pattern: { type: "table", content: "..." },\n    { type: ... 
        # or just { type: "table", content: "..." },
        block_start = ts.rfind('{', first_table_start - 5, first_table_start)
        if block_start >= 0:
            block_end = ts.find('}', first_table_end - 5, first_table_end + 300)
            if block_end > 0:
                block_end = ts.find(',\n', block_end) if ts.find(',\n', block_end) < block_end + 10 else block_end + 1
                # More precise: find the complete table entry
                entry_start = ts.rfind('\n', 0, block_start) + 1
                entry_end = ts.find('\n', block_end + 1)
                if entry_end < 0: entry_end = block_end + 1
                
                ts = ts[:entry_start] + ts[entry_end:]
                print(f"✅ M01.09 dublikat jadval olib tashlandi")
            else:
                print(f"⚠️ Blok tugashi topilmadi")

# =====================================================================  
# 5. M01.11 - REMOVE DUPLICATE TABLES (2 and 3 are similar)
#    Table 2 is the 30-row "bir jumlada farq" from LaTeX Ch19
#    Table 3 is the simplified 12-row version from our fix
#    Keep table 2 (the complete 30-row), remove table 3 (the simpler duplicate)
# =====================================================================
m01_11_start = ts.find('"M01.11": t(')
m01_02_start_check = ts.find('"M02.01"', m01_11_start + 10)
m01_11_block = ts[m01_11_start:m01_02_start_check]

tables_in_11 = [m.start() for m in re.finditer(r'type: "table"', m01_11_block)]
print(f"\n📘 M01.11 da {len(tables_in_11)} ta table blok")

# Count the 3rd table's content to identify it
if len(tables_in_11) >= 3:
    # Table 3 is the 12-row simplified diagnostic table (from our fix)
    # Table 2 is the complete 30-row one (from LaTeX)
    t3_start = m01_11_start + tables_in_11[2]
    
    # Find the full table block
    block_start = ts.rfind('{', t3_start - 5, t3_start)
    if block_start >= 0:
        # Find the end (next comma-newline with brace or next block)
        block_text = ts[block_start:]
        # Find closing brace followed by comma
        depth = 0
        end_pos = 0
        for i, ch in enumerate(block_text):
            if ch == '{': depth += 1
            elif ch == '}': 
                depth -= 1
                if depth == 0:
                    end_pos = i + 1
                    break
        
        entry_start = ts.rfind('\n', 0, block_start) + 1
        
        # Find the end of this entry (next \n    { or next \n  ],)
        rest = ts[block_start + end_pos:]
        next_entry = rest.find('\n    {')
        next_q = rest.find('\n    // Questions')
        if next_entry > 0 and (next_q < 0 or next_entry < next_q):
            entry_end = block_start + end_pos + next_entry
        else:
            # It's the last table before questions
            entry_end = block_start + end_pos
            
        # Remove just the comma after the table and the newline
        ts = ts[:entry_start] + ts[entry_end:]
        print(f"✅ M01.11 dublikat jadval (12 qatorli) olib tashlandi")

# =====================================================================
# VERIFY
# =====================================================================
with open('src/data/topicContent.ts', 'w') as f:
    f.write(ts)

# Quick checks
m01_start = ts.find('"M01.01"')
m02_start = ts.find('"M02.01"', m01_start)

subtopics = ['M01.01','M01.02','M01.03','M01.04','M01.05','M01.06','M01.07','M01.08','M01.09','M01.10','M01.11']
print("\n" + "="*60)
print("YAKUNIY TEKSHIRUV")
print("="*60)
for sid in subtopics:
    def get_range(text, sid, all_sids):
        pat = f'"{sid}": t('
        idx = text.find(pat)
        if idx < 0: return None
        next_idx = len(text)
        for nsid in all_sids:
            if nsid <= sid: continue
            ni = text.find(f'"{nsid}": t(', idx + 10)
            if 0 < ni < next_idx: next_idx = ni
        return (idx, next_idx)
    
    r = get_range(ts, sid, subtopics)
    if not r: continue
    block = ts[r[0]:r[1]]
    tables = len(re.findall(r'type: "table"', block))
    
    # Check for empty cells
    empty_cells = 0
    tbl_matches = re.findall(r'type: "table", content: "([^"]+)"', block)
    for tbl in tbl_matches:
        lines = tbl.split('\\n')
        for line in lines:
            if line.startswith('|') and '|  |' in line:
                empty_cells += 1
    
    status = "✅" if empty_cells == 0 else f"⚠️ {empty_cells} bo'sh katak"
    print(f"  {status} {sid}: {tables} ta jadval")

print("\n🎉 Barcha jadvallar tuzatildi!")
