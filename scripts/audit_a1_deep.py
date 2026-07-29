"""A1 Speaking Days — Deep Content Quality Audit"""
import re

with open('src/data/speakingPath/days.ts', 'r') as f:
    content = f.read()

sections = re.split(r'(?=const day\d+)', content)

a1_days = []
for s in sections:
    m = re.search(r"cefr: 'A1'", s)
    if m:
        a1_days.append(s)

print("=" * 90)
print("A1 DEEP CONTENT QUALITY AUDIT")
print("=" * 90)

for day in a1_days:
    lines = day.strip().split('\n')
    day_num = ''
    title = ''
    
    for line in lines:
        if 'const day' in line:
            day_num = line.replace('const ', '').split(':')[0].strip()
        if 'title:' in line and 'subtitle' not in line:
            title = line.split('title:')[1].strip().strip(',').strip('"').strip("'")
    
    print(f"\n{'─'*90}")
    print(f"📅 DAY {day_num}: {title}")
    print(f"{'─'*90}")
    
    # Check scenario
    in_scenario = False
    scenario = {}
    for line in lines:
        if 'scenario:' in line and '{' in line:
            in_scenario = True
        if in_scenario:
            if 'topic:' in line:
                scenario['topic'] = line.split('topic:')[1].strip().strip(',').strip('"')
            if 'aiRole:' in line:
                scenario['aiRole'] = line.split('aiRole:')[1].strip().strip(',').strip('"')
            if 'userRole:' in line:
                scenario['userRole'] = line.split('userRole:')[1].strip().strip(',').strip('"')
            if 'opening:' in line:
                scenario['opening'] = line.split('opening:')[1].strip().strip(',').strip('"')
            if 'goalUz:' in line:
                scenario['goalUz'] = line.split('goalUz:')[1].strip().strip(',').strip('"')
            if '}' in line and in_scenario:
                break
    
    if scenario:
        print(f"   📝 SCENARIO:")
        print(f"      Topic: {scenario.get('topic', 'N/A')[:70]}")
        print(f"      AI Role: {scenario.get('aiRole', 'N/A')[:50]}")
        print(f"      User Role: {scenario.get('userRole', 'N/A')[:50]}")
        print(f"      Opening: {scenario.get('opening', 'N/A')[:70]}")
        print(f"      GoalUz: {scenario.get('goalUz', 'N/A')[:70]}")
    
    # Check grammar tips detail
    grammar_tip_details = []
    short_tips = 0
    for line in lines:
        if 'grammarTip:' in line:
            tip = line.split('grammarTip:')[1].strip().strip(',').strip('"').strip("'")
            # Count characters
            if len(tip) < 40:
                short_tips += 1
                grammar_tip_details.append(f"SHORT({len(tip)} chars): {tip[:60]}")
            elif len(tip) > 150:
                grammar_tip_details.append(f"LONG({len(tip)} chars): {tip[:60]}...")
    
    if short_tips > 0:
        print(f"   ⚠️  SHORT GRAMMAR TIPS ({short_tips}/6):")
        for t in grammar_tip_details:
            print(f"      - {t}")
    
    # Check common mistake patterns
    has_phonetic_mistakes = 0
    no_phonetic_mistakes = 0
    for line in lines:
        if 'commonMistake:' in line:
            if '/ˈ' in line or '/ˈ/' in line or '/θ/' in line or '/ð/' in line or '/s/' in line:
                has_phonetic_mistakes += 1
            else:
                no_phonetic_mistakes += 1
    
    print(f"   🔤 IPA in mistakes: {has_phonetic_mistakes}/6 | No IPA: {no_phonetic_mistakes}/6")
    
    # Check stressWord
    stress_words = []
    for line in lines:
        if 'stressWord:' in line:
            sw = line.split('stressWord:')[1].strip().strip(',').strip("'")
            stress_words.append(sw)
    
    # Check for duplicate stress words within same day
    if len(stress_words) != 6:
        print(f"   ⚠️  Wrong stress word count: {len(stress_words)} (expected 6)")
    else:
        duplicates = [w for w in stress_words if stress_words.count(w) > 1]
        if duplicates:
            print(f"   ⚠️  DUPLICATE stress words: {set(duplicates)}")
    
    # Check recycled chunk IDs
    recycled = []
    for line in lines:
        if 'recycledChunkIds:' in line:
            ids = re.findall(r"'([^']+)'", line)
            recycled = ids
    
    if recycled:
        # Check all reference lower day numbers
        for rid in recycled:
            m = re.search(r'sp-d(\d+)-', rid)
            if m:
                ref_day = int(m.group(1))
                cur_day = int(re.sub(r'\D', '', day_num))
                if ref_day >= cur_day:
                    print(f"   ⚠️  recyclicChunkId {rid} references same/future day {ref_day} (current: {cur_day})")
        
        # If review day, check recycled count
        if 'Review' in title or 'Final' in title:
            if len(recycled) < 6:
                print(f"   ⚠️  Review day has only {len(recycled)} recycled chunks (expected 12-18)")

print(f"\n{'='*90}")
print("DEEP AUDIT COMPLETE")
print(f"{'='*90}")
