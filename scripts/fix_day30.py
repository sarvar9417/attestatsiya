#!/usr/bin/env python3
"""Fix days-months day: change const day31 back to day30."""
import re

with open('src/data/speakingPath/days.ts', 'r') as f:
    content = f.read()

# Find the days-months content by title
idx = content.find("Kunlar, oylar va fasllar")
if idx < 0:
    print("ERROR: Title not found!")
    exit(1)

# Find the beginning of this day's const declaration
# Search backwards from title for 'const day'
start = content.rfind("const day", 0, idx)
if start < 0:
    print("ERROR: const day not found before title!")
    exit(1)

# Find the end of this day (next 'const day' or 'export const')
end_marker1 = content.find("\nconst day", start + 20)
end_marker2 = content.find("\nexport const", start + 20)
end = end_marker1 if end_marker1 > 0 else end_marker2
if end < 0:
    end = len(content)

day_block = content[start:end]
print(f"Found day block at position {start}-{end}")

# Replace const day31 with const day30
new_block = day_block.replace('const day31: SpeakingDay = {', 'const day30: SpeakingDay = {')
# Replace day: 31, with day: 30,
new_block = new_block.replace('\n  day: 31, cefr:', '\n  day: 30, cefr:')
# Replace sp-d31-c with sp-d30-c in chunks
new_block = new_block.replace('sp-d31-c', 'sp-d30-c')

content = content[:start] + new_block + content[end:]

with open('src/data/speakingPath/days.ts', 'w') as f:
    f.write(content)

print("✅ Fixed: days-months day changed from day31 → day30")
print(f"Verification: 'const day30:' count = {content.count('const day30:')}")
