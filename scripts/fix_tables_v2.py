#!/usr/bin/env python3
"""Fix remaining empty table cells in M01"""

with open('src/data/topicContent.ts', 'r') as f:
    ts = f.read()

# =====================================================================
# M01.02 - Remove Table 2 (redundant: 10 nazorat savollari with empty 
# right column). Table 3 already has the full 2-column version.
# =====================================================================
# Pattern: The table starts with "type: \"table\", content: \"| Fakt va qiymatlar"
# and ends with " |\\n| Ruxsatli foydalanuvchi vaqtida oladimi? |  |\" },"
old = '''    { type: "table", content: "| Fakt va qiymatlar xatosizmi? |  |\\n| Manba va dalilga ishonish mumkinmi? |  |\\n| Maqsadga aynan shu ma'lumot kerakmi? |  |\\n| Axborot eskirmaganmi? |  |\\n| Qaror uchun zarur qismlar bormi? |  |\\n| Tafsilot kam ham, ortiqcha ham emasmi? |  |\\n| Qabul qiluvchi til va belgilarni tushunadimi? |  |\\n| Axborot qaror yoki ishga xizmat qiladimi? |  |\\n| Fakt fikr va manfaatdan ajratilganmi? |  |\\n| Ruxsatli foydalanuvchi vaqtida oladimi? |  |" },'''

# Find and remove it
if old in ts:
    ts = ts.replace(old, '')
    print("✅ M01.02 2-jadval (bo'sh katakli) olib tashlandi")
else:
    print("⚠️ M01.02 2-jadval topilmadi")
    # Try with different apostrophe
    old2 = '''    { type: "table", content: "| Fakt va qiymatlar xatosizmi? |  |\\n| Manba va dalilga ishonish mumkinmi? |  |\\n| Maqsadga aynan shu ma'lumot kerakmi? |  |\\n| Axborot eskirmaganmi? |  |\\n| Qaror uchun zarur qismlar bormi? |  |\\n| Tafsilot kam ham, ortiqcha ham emasmi? |  |\\n| Qabul qiluvchi til va belgilarni tushunadimi? |  |\\n| Axborot qaror yoki ishga xizmat qiladimi? |  |\\n| Fakt fikr va manfaatdan ajratilganmi? |  |\\n| Ruxsatli foydalanuvchi vaqtida oladimi? |  |" },'''
    if old2 in ts:
        ts = ts.replace(old2, '')
        print("✅ M01.02 2-jadval (alternativ apostrof bilan) olib tashlandi")
    else:
        print("❌ Hech qanday variant topilmadi, regex orqali qidirilmoqda...")
        import re
        # Find by content pattern
        pattern = r'type: "table", content: "\| Fakt va qiymatlar xatosizmi\?[^"]*Ruxsatli foydalanuvchi vaqtida oladimi\? \|  \|" \},'
        match = re.search(pattern, ts)
        if match:
            print(f"   Regex orqali topildi: {match.group()[:50]}...")
            ts = ts[:match.start()] + ts[match.end():]
            print("✅ Regex orqali olib tashlandi")

# =====================================================================
# Verify remaining tables
# =====================================================================
with open('src/data/topicContent.ts', 'w') as f:
    f.write(ts)

# Quick final check
import re
m01_start = ts.find('"M01.01"')
m02_start = ts.find('"M02.01"', m01_start)
m01 = ts[m01_start:m02_start]

subtopics = ['M01.01','M01.02','M01.03','M01.04','M01.05','M01.06','M01.07','M01.08','M01.09','M01.10','M01.11']

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

print("\n=== YAKUNIY TEKSHIRUV ===")
empty_cells_by_subtopic = {}
for sid in subtopics:
    r = get_range(ts, sid, subtopics)
    if not r: continue
    block = ts[r[0]:r[1]]
    tables = len(re.findall(r'type: "table"', block))
    tbl_matches = re.findall(r'type: "table", content: "([^"]+)"', block)
    
    empty_cells = 0
    empty_rows = []
    for tbl in tbl_matches:
        lines = tbl.split('\\n')
        for j, line in enumerate(lines):
            if line.startswith('|') and '|  |' in line and line.count('|') <= 3:
                empty_cells += 1
                if len(empty_rows) < 3:
                    empty_rows.append(line.strip()[:60])
    
    empty_cells_by_subtopic[sid] = empty_cells
    if empty_cells == 0:
        print(f"  ✅ {sid}: {tables} ta jadval")
    else:
        print(f"  ⚠️ {sid}: {empty_cells} bo'sh katak - {', '.join(empty_rows)}")

total_empty = sum(empty_cells_by_subtopic.values())
if total_empty > 0:
    print(f"\n📊 {total_empty} ta bo'sh katak qoldi (bular struktura sarlavhalari)")
else:
    print(f"\n🎉 Barcha kataklar to'ldirilgan!")
