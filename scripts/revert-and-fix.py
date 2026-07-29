# -*- coding: utf-8 -*-
"""Fix: revert curly quotes, then use single-quote delimiters for fields containing double quotes."""

files = [
    'src/data/daily/a2Part1.ts', 'src/data/daily/a2Part2.ts',
    'src/data/daily/a2Part3.ts', 'src/data/daily/a2Part4.ts',
    'src/data/daily/b2Part1.ts', 'src/data/daily/b2Part2.ts',
    'src/data/daily/b2Part3.ts',
]

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content

    # Step 1: Revert ALL curly quotes back to straight "
    content = content.replace('\u201c', '"').replace('\u201d', '"')
    # Also handle any other Unicode quote chars
    content = content.replace('\u2018', "'").replace('\u2019', "'")

    # Step 2: In interleaved sections, fix fields that contain " inside
    # For lines matching: fieldName: "value" (where value contains ")
    # Change to: fieldName: 'value'
    
    lines = content.split('\n')
    new_lines = []
    in_interleaved = False
    
    for line in lines:
        if 'Interleaved Practice:' in line:
            in_interleaved = True
        elif line.strip().startswith('export const ') and ': DailyLesson' in line:
            in_interleaved = False
        
        if in_interleaved:
            for field in ['explanation: "', 'question: "', 'instruction: "', 'correct: "']:
                if field in line:
                    # Find the value between field: " and the closing "
                    prefix = line[:line.index(field) + len(field) - 1]  # up to field: 
                    rest = line[line.index(field) + len(field) - 1:]     # from field: " onwards
                    
                    # rest starts with " and ends with some closing "
                    # We need to find the actual closing quote
                    # Strategy: look from the right, find the first " that's followed by 
                    # a valid terminator (comma, }, ], or end of line)
                    value_start = 1  # skip the opening "
                    # Find the last " in the line
                    last_dq = rest.rfind('"')
                    if last_dq <= 0:
                        continue
                    
                    # Extract the value between first and last "
                    value = rest[value_start:last_dq]
                    
                    # Check if value contains "
                    if '"' in value:
                        # Replace " inside value with \u201c/\u201d (they're safe in TypeScript)
                        new_val = ''
                        open_q = True
                        for ch in value:
                            if ch == '"':
                                new_val += '\u201c' if open_q else '\u201d'
                                open_q = not open_q
                            else:
                                new_val += ch
                        # Reconstruct: field: "new_val"
                        new_line = prefix + ' "' + new_val + '"' + rest[last_dq+1:]
                        line = new_line
                    break  # Only fix one field per line
            
        new_lines.append(line)
    
    content = '\n'.join(new_lines)
    
    if content != orig:
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed: {fp}')
    else:
        print(f'No changes: {fp}')
