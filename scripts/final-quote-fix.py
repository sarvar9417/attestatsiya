# -*- coding: utf-8 -*-
"""Final fix: replace ALL remaining unescaped double quotes in interleaved sections."""

files = [
    'src/data/daily/a2Part1.ts',
    'src/data/daily/a2Part2.ts',
    'src/data/daily/a2Part3.ts',
    'src/data/daily/a2Part4.ts',
    'src/data/daily/b2Part1.ts',
    'src/data/daily/b2Part2.ts',
    'src/data/daily/b2Part3.ts',
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    in_interleaved = False
    
    for line in lines:
        # Track interleaved sections
        if 'Interleaved Practice:' in line:
            in_interleaved = True
        elif line.strip().startswith('export const ') and ': DailyLesson' in line:
            in_interleaved = False
        
        if in_interleaved:
            # Fix fields that contain double-quoted strings
            # Only process lines that have these patterns
            for field in ['explanation: "', 'question: "', 'instruction: "', 'correct: "', 'desc: "']:
                if field in line:
                    # Find the string content between first and last "
                    idx_start = line.index('"') + 1  # first "
                    idx_end = line.rindex('"')       # last "
                    
                    if idx_start < idx_end:
                        prefix = line[:idx_start]
                        content = line[idx_start:idx_end]
                        suffix = line[idx_end:]
                        
                        # Replace ALL " in content with curly quotes
                        new_content = ''
                        open_quote = True
                        for ch in content:
                            if ch == '"':
                                new_content += '\u201c' if open_quote else '\u201d'
                                open_quote = not open_quote
                            else:
                                new_content += ch
                        
                        new_line = prefix + new_content + suffix
                        if new_line != line:
                            line = new_line
                            modified = True
                            break  # only fix one field per line
        
        new_lines.append(line)
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f'Fixed: {filepath}')
    else:
        print(f'No changes: {filepath}')
