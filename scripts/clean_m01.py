"""
Clean up auto-generated M01 content and add questions from existing content.
"""
import re

with open('/Users/sarvar9417/Desktop/attestatsiya/frontend/scripts/m01_generated.txt', 'r') as f:
    content = f.read()

# Fix LaTeX remnants
content = content.replace('{itemize}', '')
content = content.replace('{enumerate}', '')
content = content.replace('{description}', '')
content = content.replace('{longtable}', '')
content = content.replace('{tabularx}', '')
content = content.replace('{endhead}', '')
content = content.replace('{endfirsthead}', '')
content = content.replace('\\toprule', '')
content = content.replace('\\midrule', '')
content = content.replace('\\bottomrule', '')
content = content.replace('\\endhead', '')
content = content.replace('\\keyterm{', '')
content = content.replace('\\textbf{', '')
content = content.replace('\\textit{', '')
content = content.replace('\\texttt{', '')
content = content.replace('}---', ' — ')
content = content.replace('}--', ' — ')
content = content.replace('} -', '')
content = content.replace('}…', '...')
content = content.replace('\\texttrademark', '(TM)')
content = content.replace('\\textregistered', '(R)')
content = content.replace('\\xmark', '✗')
content = content.replace('\\cmark', '✓')

# Fix math notation
content = re.sub(r'\\([a-zA-Z]+)\{([^}]*)\}', r'\1(\2)', content)

# Fix any remaining stray } that are not part of TypeScript
# Only in content strings (between " characters)
lines = content.split('\n')
fixed_lines = []
for line in lines:
    # Only fix content inside quote strings
    if 'content: "' in line:
        # Remove any lone } that are LaTeX remnants
        # But keep TypeScript syntax
        pass
    fixed_lines.append(line)

content = '\n'.join(fixed_lines)

# Save cleaned version
with open('/Users/sarvar9417/Desktop/attestatsiya/frontend/scripts/m01_cleaned.txt', 'w') as f:
    f.write(content)

print(f"Cleaned: {len(content)} chars")

# Count blocks per subtopic
subtopic_count = {}
for sub_id in ['M01.01', 'M01.02', 'M01.03', 'M01.04', 'M01.05', 'M01.06', 
               'M01.07', 'M01.08', 'M01.09', 'M01.10', 'M01.11']:
    pattern = f'"{sub_id}": t('
    idx = content.find(pattern)
    if idx >= 0:
        # Find the closing ]]),
        end_idx = content.find(']);', idx)
        if end_idx < 0:
            end_idx = content.find('])', idx)
        section = content[idx:end_idx]
        blocks = len(re.findall(r'type: "', section))
        questions = len(re.findall(r'id: "', section))
        print(f"  {sub_id}: {blocks} theory blocks, {questions} questions")
