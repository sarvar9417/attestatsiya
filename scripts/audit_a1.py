"""A1 Speaking Days — Full Quality Audit"""
import re

with open('src/data/speakingPath/days.ts', 'r') as f:
    content = f.read()

# Split by 'const day' declarations
sections = re.split(r'(?=const day\d+)', content)

print("=" * 80)
print("A1 SPEAKING DAYS — FULL QUALITY AUDIT")
print("=" * 80)

a1_days = []
for s in sections:
    m = re.search(r"cefr: 'A1'", s)
    if m:
        a1_days.append(s)

print(f"Total A1 days found: {len(a1_days)}\n")

for day in a1_days:
    lines = day.strip().split('\n')
    
    # Extract basic info
    day_num = ''
    title = ''
    subtitle = ''
    goal = ''
    linked = ''
    grammar = ''
    est = ''
    vocab_count = 0
    chunk_count = 0
    has_pron = False
    has_scenario = False
    has_recycled = False
    has_grammar_point = False
    has_example_field = False
    
    pron_data = {}
    recycled_ids = []
    chunk_ids = []
    vocab_words = []
    scenario_data = {}
    
    for line in lines:
        if 'const day' in line:
            day_num = line.replace('const ', '').split(':')[0].strip()
        if 'title:' in line and not 'subtitle' in line:
            title = line.split('title:')[1].strip().strip(',').strip('"').strip("'")
        if 'subtitle:' in line:
            subtitle = line.split('subtitle:')[1].strip().strip(',').strip('"').strip("'")
        if "'goalUz':" in line or 'goalUz:' in line:
            goal = line.split('goalUz:')[1].strip().strip(',').strip('"').strip("'")
        if 'linkedLessonId:' in line:
            linked = line.split('linkedLessonId:')[1].strip().strip(',').strip("'")
        if 'grammarPoint:' in line:
            has_grammar_point = True
            grammar = line.split('grammarPoint:')[1].strip().strip(',').strip("'")
        if 'estMinutes:' in line:
            est = line.split('estMinutes:')[1].strip().strip(',')
        if 'pronunciationFocus:' in line:
            has_pron = True
        if 'scenario:' in line:
            has_scenario = True
        if 'recycledChunkIds:' in line:
            has_recycled = True
            ids_match = re.findall(r"'([^']+)'", line)
            recycled_ids = ids_match
        if "id: 'sp-d" in line:
            chunk_count += 1
            cid = line.split("'")[1]
            chunk_ids.append(cid)
        # Count vocab items (not chunk objects)
        if line.strip().startswith('{ en:') or line.strip().startswith("{ en:"):
            if 'grammarTip' not in line and 'commonMistake' not in line:
                vocab_count += 1
                en_match = re.search(r"en:\s*'([^']*)'", line)
                uz_match = re.search(r"uz:\s*'([^']*)'", line)
                if en_match and uz_match:
                    vocab_words.append((en_match.group(1), uz_match.group(1)))
    
    # Check chunk quality
    chunk_issues = []
    if chunk_count != 6:
        chunk_issues.append(f"Expected 6 chunks, got {chunk_count}")
    
    # Check chunk IDs format
    expected_prefix = f"sp-d{day_num}-c"
    for cid in chunk_ids:
        if not cid.startswith(expected_prefix):
            chunk_issues.append(f"Chunk {cid} doesn't match expected prefix {expected_prefix}")
    
    # Print report
    print(f"\n{'─'*60}")
    print(f"📅 DAY {day_num}: {title}")
    print(f"{'─'*60}")
    print(f"   Subtitle: {subtitle[:60] if subtitle else 'MISSING!'}")
    print(f"   Goal: {goal[:60] if goal else 'MISSING!'}...")
    print(f"   Est: {est} min | LinkedLesson: {linked or 'NONE'}")
    print(f"   Grammar: {grammar or 'NONE'}")
    print(f"   Vocab: {vocab_count} words | Chunks: {chunk_count}")
    print(f"   PronFocus: {'✅' if has_pron else '❌'} | Scenario: {'✅' if has_scenario else '❌'} | Recycled: {'✅' if has_recycled else '❌'}")
    
    if chunk_issues:
        for issue in chunk_issues:
            print(f"   ⚠️  {issue}")
    
    if vocab_count < 4:
        print(f"   ⚠️  Low vocab count: {vocab_count} (expected 4+)")

print(f"\n{'='*80}")
print("AUDIT COMPLETE")
print(f"{'='*80}")
