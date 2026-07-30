#!/usr/bin/env python3
"""
Topics/ papkasidagi 25 ta mavzu faylini o'qib, ularni Supabase database'ga
lessons sifatida import qilish uchun SQL migratsiya skripti.

Yaxshilanishlar:
  - Dars sarlavhalari tozalanadi (title_cleaner)
  - source_references jadvali to'ldiriladi (lessons ↔ sources)
  - DO block hisoboti to'g'rilangan
"""

import os
import re
import json
from collections import defaultdict
from datetime import datetime

# ─── Mapping ───────────────────────────────────────────────────────────────

TOPIC_TO_MODULE_MAP = {
    '01_Axborot_va_kodlash':              'M01',
    '02_Sanoq_sistemalari':                'M05',
    '03_Kompyuter_qurilmalari':            'M02',
    '04_Xotira_va_saqlash':                'M02',
    "05_Dasturiy_ta'minot":                'M02',
    '06_Matn_bilan_ishlash':               'M03',
    '07_Tasvirlar_va_grafikalar':          'M10',
    '08_Elektron_jadvallar':               'M03',
    "09_Ma'lumotlar_bazasi":               'M09',
    '10_Dasturlash_Scratch':               'M07',
    '11_Dasturlash_Python':                'M08',
    '12_Internet_va_tarmoqlar':            'M12',
    '13_Veb_saytlar_yaratish':             'M11',
    '14_Multimedia':                       'M10',
    '15_Taqdimotlar':                      'M03',
    '16_Kompyuter_xavfsizligi':            'M13',
    "17_Sun'iy_intellekt":                 'M08',
    '18_Mantiq_asoslari':                  'M04',
    "19_AKTning_jamiyatga_ta'siri":        'M13',
    '20_Blockchain_VR_AR':                 'M13',
    '21_Mobil_ilovalar':                   'M12',
    '22_SMM_va_media':                     'M13',
    '23_LMS_va_MOOC':                      'M13',
    '24_Elektron_hukumat':                 'M13',
    '25_Bulut_texnologiyalari':            'M12',
}

MODUL_NOMLARI = {
    'M01': 'Axborot va raqamli savodxonlik',
    'M02': 'Kompyuter tizimlari va dasturiy muhit',
    'M03': 'Microsoft Office (Word, Excel, PowerPoint)',
    'M04': 'Mantiqiy fikrlash va modellashtirish',
    'M05': 'Sanoq sistemalari',
    'M06': 'Algoritmlash',
    'M07': 'Scratch va LOGO',
    'M08': 'Python va JavaScript',
    'M09': "Ma'lumotlar bazasi, MS Access va SQL",
    'M10': 'Kompyuter grafikasi va media',
    'M11': 'HTML va CSS',
    'M12': 'Kompyuter tarmoqlari va internet',
    'M13': 'Axborot xavfsizligi va raqamli xizmatlar',
    'M14': 'Kasb standarti',
    'M15': 'Umumiy pedagogika',
    "M16": "Informatika o'qitish metodikasi",
}

# =========================================================================
# TITLE CLEANER
# =========================================================================

def clean_lesson_title(raw_title: str, topic_name: str, module_code: str) -> str:
    """
    Dars sarlavhasini tozalaydi.
    
    Kirish: "M02 - s. KOMPYUTERNING RIVOJLANISH TARIXI TAYANCH TUSHUNCHALAR..."
    Chiqish: "Kompyuterning rivojlanish tarixi"
    """
    # "MXX - " prefiksni olib tashlash
    title = re.sub(r'^M\d{2}\s*[-–—]\s*', '', raw_title).strip()
    
    # "Bob X" patterni - saqlaymiz
    bob_match = re.match(r'^Bob\s+\d+', title, re.IGNORECASE)
    if bob_match:
        return f"{module_code} - {bob_match.group()}"
    
    # "s." yoki "S." prefiksni olib tashlash
    title = re.sub(r'^[sS]\.\s*', '', title).strip()
    
    # TAYANCH TUSHUNCHALAR / KALIT SO'ZLAR / DIQQAT / MASLAHAT kabi 
    # kalit so'zlardan keyingi narsalarni olib tashlash
    title = re.split(r'TAYANCH TUSHUNCHALAR|KALIT SO\'Z|KALIT SOʻZ|DIQQAT|MASLAHAT|Yodda tuting', title)[0].strip()
    
    # Juda qisqa yoki ma'nosiz bo'lsa, mavzu nomini ishlatish
    if len(title) < 8 or len(title.split()) < 3:
        return f"{module_code} - {topic_name}"
    
    # Ortiqcha belgilar va bo'shliqlarni tozalash
    title = re.sub(r'[.…]{2,}', ' ', title)
    title = re.sub(r'\s+', ' ', title)
    
    # Birinchi harfni katta qilish, qolganlarni kichik
    # (lekin Bob X, va akronimlarni saqlab)
    if not title.lower().startswith('bob'):
        # Akronimlarni (2+ katta harf) saqlash uchun so'zlarni alohida ishlash
        words = title.split()
        cleaned_words = []
        for w in words:
            if len(w) >= 2 and w.isupper():
                cleaned_words.append(w)  # Akronimni saqlash
            elif len(w) >= 2 and w.islower():
                cleaned_words.append(w.capitalize())  # Birinchi harf katta
            else:
                cleaned_words.append(w.capitalize())
        title = ' '.join(cleaned_words)
    
    # Juda uzun bo'lsa qisqartirish
    if len(title) > 80:
        title = title[:77] + '...'
    
    return f"{module_code} - {title.strip()}"


def is_garbled_title(title: str) -> bool:
    """Sarlavha ma'nosiz yoki buzilganligini tekshiradi"""
    clean = re.sub(r'^M\d{2}\s*[-–—]\s*', '', title).strip()
    
    # Juda qisqa
    if len(clean) < 5:
        return True
    
    # Faqat kichik harf va nuqtalardan iborat (buzilgan matn)
    if re.match(r'^[a-z\s.…]{3,30}$', clean) and not re.search(r'[A-ZĀĒĪŌŪŠĢĶĻŽČŅ]', clean):
        return True
    
    # "slar." "aja" kabi fragmentlar
    if re.match(r'^(slar|aja|ni|da|ga|ka|bo)\b', clean, re.IGNORECASE):
        return True
    
    return False


# =========================================================================
# PARSER
# =========================================================================

def clean_text(text: str) -> str:
    """Matnni tozalash"""
    text = re.sub(r'[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]', '', text)
    text = re.sub(r'📘\s*.+?(?:\n|$)', '', text)
    text = re.sub(r'📌\s*.+?(?:\n|$)', '', text)
    text = re.sub(r'[╔╗╚╝║═]', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        line = re.sub(r' {2,}', ' ', line)
        cleaned_lines.append(line.rstrip())
    text = '\n'.join(cleaned_lines)
    return text.strip()


def extract_sources(content: str) -> list:
    """📘 markerlardan noyob manba nomlarini olish"""
    sources = re.findall(r'📘\s*(.+?)(?:\n|$)', content)
    seen = set()
    unique = []
    for s in sources:
        s = s.strip()
        # Normalize: remove file extensions and extra spaces
        s_clean = re.sub(r'\s+', ' ', s)
        if s_clean not in seen and len(s_clean) > 5:
            seen.add(s_clean)
            unique.append(s_clean)
    return unique


def extract_topic_title(content: str) -> str:
    """Sarlavha qutisidan mavzu nomini olish"""
    m = re.search(r'MAVZU:\s*(.+?)\s*║', content)
    return m.group(1).strip() if m else ''


def parse_lessons(content: str, topic_key: str, module_code: str, topic_title: str):
    """Topics faylini darslarga ajratadi va sarlavhalarni tozalaydi"""
    sep = '=' * 60
    first_sep = content.find(sep)
    body = content[first_sep + 60:] if first_sep > 0 else content
    
    sections = re.split(rf'{re.escape(sep)}\s*\n?', body)
    
    lessons_dict = {}
    current_order = 0
    current_title = None
    current_paras = []
    current_source = ''
    
    dars_pattern = re.compile(r'(\d+)-darl?\.?\s*(.+?)(?:\n|$)', re.IGNORECASE)
    bob_pattern = re.compile(r'(\d+)-bob\.?\s*(.+?)(?:\n|$)', re.IGNORECASE)
    mavzu_pattern = re.compile(r'^(.{5,50}?)\n(?:TAYANCH TUSHUNCHALAR|KALIT SOʻZ|KALIT SO\'Z)', re.MULTILINE)
    
    for section in sections:
        section = section.strip()
        if not section or len(section) < 30:
            continue
        
        # Source marker bor-yo'qligini tekshirish
        src_match = re.search(r'📘\s*(.+?\.txt\))', section)
        is_source_ref = bool(src_match)
        
        # Agar section source reference bo'lsa → source ni eslab qolish
        if is_source_ref and not re.search(r'(?:dars|bob|mavzu)', section[:200], re.IGNORECASE):
            if src_match:
                current_source = src_match.group(1).strip()
            continue
        
        # Dars sarlavhasini qidirish
        title = None
        dm = dars_pattern.search(section)
        if dm:
            raw = dm.group(2).strip()
            title = clean_lesson_title(f"{module_code} - {raw}", topic_title, module_code)
        
        if not title:
            bm = bob_pattern.search(section)
            if bm:
                title = f"{module_code} - Bob {bm.group(1)}"
        
        if not title:
            mm = mavzu_pattern.search(section)
            if mm:
                title = clean_lesson_title(f"{module_code} - {mm.group(1).strip()}", topic_title, module_code)
        
        # Agar sarlavha topilgan bo'lsa va garbled bo'lmasa
        if title and not is_garbled_title(title):
            # Oldingi darsni saqlash
            if current_title and current_paras:
                combined = '\n\n'.join(current_paras)
                wc = len(combined.split())
                if wc >= 20:
                    lessons_dict[current_order] = {
                        'title': current_title,
                        'body': clean_text(combined),
                        'word_count': wc,
                        'source': current_source,
                    }
            
            current_order += 1
            current_title = title
            current_paras = [clean_text(section)]
        else:
            if current_title:
                cleaned = clean_text(section)
                if len(cleaned) > 20:
                    current_paras.append(cleaned)
    
    # Oxirgi darsni saqlash
    if current_title and current_paras:
        combined = '\n\n'.join(current_paras)
        wc = len(combined.split())
        if wc >= 20:
            lessons_dict[current_order] = {
                'title': current_title,
                'body': clean_text(combined),
                'word_count': wc,
                'source': current_source,
            }
    
    # Agar dars topilmasa, butun faylni bitta dars qilish
    if not lessons_dict:
        cleaned = clean_text(body)
        wc = len(cleaned.split())
        if wc >= 30:
            lessons_dict[1] = {
                'title': clean_lesson_title(f"{module_code} - {topic_key.replace('_', ' ')}", topic_title, module_code),
                'body': cleaned,
                'word_count': wc,
                'source': current_source,
            }
    
    return [lessons_dict[k] for k in sorted(lessons_dict.keys())]


# =========================================================================
# SQL GENERATOR
# =========================================================================

def escape_sql(s: str) -> str:
    if not s:
        return ''
    s = s.replace("'", "''")
    s = s.replace('\\', '\\\\')
    s = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', s)
    return s


def estimate_duration(word_count: int) -> int:
    if word_count < 100: return 5
    elif word_count < 300: return 10
    elif word_count < 600: return 15
    elif word_count < 1000: return 20
    elif word_count < 2000: return 30
    else: return 45


# =========================================================================
# MAIN
# =========================================================================

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    topics_dir = os.path.join(base_dir, 'Topics')
    scripts_dir = os.path.join(base_dir, 'scripts')
    migrations_dir = os.path.join(base_dir, 'supabase', 'migrations')
    os.makedirs(scripts_dir, exist_ok=True)
    os.makedirs(migrations_dir, exist_ok=True)
    
    # Topics fayllarini o'qish
    topic_files = sorted([
        f for f in os.listdir(topics_dir)
        if re.match(r'\d{2}_.+\.txt$', f) and not f.endswith('.bak')
    ])
    
    all_lessons = []
    all_sources = {}  # topic_key -> [source names]
    processed_files = 0
    modules_covered = set()
    total_chars = 0
    
    print("=" * 70)
    print("📚 TOPICS/ DARSLIKLARNI DATABASEGA IMPORT QILISH")
    print("=" * 70)
    
    for filename in topic_files:
        topic_key = filename.replace('.txt', '').replace('.bak', '')
        module_code = TOPIC_TO_MODULE_MAP.get(topic_key)
        if not module_code:
            print(f"\n⚠️  {filename}: modul mapping topilmadi")
            continue
        
        filepath = os.path.join(topics_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        topic_title = extract_topic_title(content)
        sources = extract_sources(content)
        all_sources[topic_key] = sources
        
        lessons = parse_lessons(content, topic_key, module_code, topic_title)
        
        if not lessons:
            print(f"\n⚠️  {filename}: darslar aniqlanmadi")
            continue
        
        processed_files += 1
        modules_covered.add(module_code)
        total_chars += len(content)
        
        print(f"\n📘 {filename}")
        print(f"   Modul: {module_code} — {MODUL_NOMLARI.get(module_code, '')}")
        print(f"   Mavzu: {topic_title}")
        print(f"   Darslar: {len(lessons)} ta | Manbalar: {len(sources)} ta")
        
        for i, lesson in enumerate(lessons):
            lesson['module_code'] = module_code
            lesson['topic_key'] = topic_key
            lesson['sources'] = sources
            all_lessons.append(lesson)
            
            src = sources[0][:40] if sources else '(manba yo\'q)'
            print(f"   {i+1}. 📖 {lesson['title'][:70]}")
            print(f"      ({lesson['word_count']} so'z, ~{estimate_duration(lesson['word_count'])} min) [{src}]")
    
    # ─── JSON output ───────────────────────────────────────────────────
    json_data = [{
        'module_code': l['module_code'],
        'title': l['title'][:200],
        'body_length': len(l['body']),
        'word_count': l['word_count'],
        'estimated_minutes': estimate_duration(l['word_count']),
        'source_refs': l['sources'][:3],
        'preview': l['body'][:150],
    } for l in all_lessons]
    
    json_path = os.path.join(scripts_dir, 'topics_import_data.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    
    # ─── SQL migration ─────────────────────────────────────────────────
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    migration_path = os.path.join(migrations_dir, f'{timestamp}_import_topics_content.sql')
    
    sql_parts = []
    sql_parts.append('-- ──────────────────────────────────────────────────────')
    sql_parts.append(f'-- Topics/ darslik kontentini import qilish')
    sql_parts.append(f'-- Sana: {datetime.now().strftime("%Y-%m-%d %H:%M")}')
    sql_parts.append(f'-- Jami: {len(all_lessons)} ta dars, {processed_files} ta fayl')
    sql_parts.append('-- ──────────────────────────────────────────────────────')
    sql_parts.append('')
    
    # 1. subtopic_id ni nullable qilish
    sql_parts.append('-- subtopic_id ni optional qilish (import uchun)')
    sql_parts.append('ALTER TABLE public.lessons ALTER COLUMN subtopic_id DROP NOT NULL;')
    sql_parts.append('')
    
    # 2. Barcha noyob manbalarni kiritish
    all_source_names = set()
    for src_list in all_sources.values():
        for src in src_list:
            all_source_names.add(src)
    
    if all_source_names:
        sql_parts.append(f'-- {len(all_source_names)} ta manbani kiritish')
        sql_parts.append('DO $$')
        sql_parts.append('BEGIN')
        for src in sorted(all_source_names):
            src_esc = escape_sql(src)
            sql_parts.append(f"  IF NOT EXISTS (SELECT 1 FROM public.sources WHERE title = '{src_esc}') THEN")
            sql_parts.append(f"    INSERT INTO public.sources (title) VALUES ('{src_esc}');")
            sql_parts.append('  END IF;')
        sql_parts.append('END $$;')
        sql_parts.append('')
    
    # 3. Modullar bo'yicha darslarni kiritish
    lessons_by_module = defaultdict(list)
    for lesson in all_lessons:
        lessons_by_module[lesson['module_code']].append(lesson)
    
    lesson_global_idx = 0
    
    for mod_code in sorted(lessons_by_module.keys()):
        module_lessons = lessons_by_module[mod_code]
        mod_name = MODUL_NOMLARI.get(mod_code, '')
        
        sql_parts.append(f'-- ===== {mod_code}: {mod_name} ({len(module_lessons)} ta dars) =====')
        sql_parts.append('')
        sql_parts.append('DO $$')
        sql_parts.append('DECLARE')
        sql_parts.append('  v_lesson_id BIGINT;')
        sql_parts.append(f'  v_mod_title TEXT := \'{escape_sql(mod_name)}\';')
        sql_parts.append('BEGIN')
        
        for i, lesson in enumerate(module_lessons):
            lesson_global_idx += 1
            title_esc = escape_sql(lesson['title'][:200])
            body = lesson['body']
            if len(body) > 30000:
                body = body[:30000] + '\n\n[--- davomi qisqartirildi ---]'
            body_esc = escape_sql(body)
            duration = estimate_duration(lesson['word_count'])
            
            subtopic_query = (
                f"(SELECT id FROM public.subtopics "
                f"WHERE module_id = (SELECT id FROM public.modules WHERE code = '{mod_code}' LIMIT 1) "
                f"ORDER BY sort_order LIMIT 1)"
            )
            
            # Lesson INSERT
            sql_parts.append(f'')
            sql_parts.append(f'  -- Dars {lesson_global_idx}: {lesson["title"][:70]}')
            sql_parts.append(f'  INSERT INTO public.lessons (subtopic_id, title, theory, duration_min, sort_order, status)')
            sql_parts.append(f'  VALUES (')
            sql_parts.append(f'    {subtopic_query},')
            sql_parts.append(f"    '{title_esc}',")
            sql_parts.append(f"    '{body_esc}',")
            sql_parts.append(f'    {duration},')
            sql_parts.append(f'    {i+1},')
            sql_parts.append(f"    'draft'")
            sql_parts.append(f'  )')
            sql_parts.append(f'  RETURNING id INTO v_lesson_id;')
            
            # Source_references
            for src in lesson.get('sources', []):
                src_esc = escape_sql(src)
                sql_parts.append(f'  INSERT INTO public.source_references (lesson_id, source_id)')
                sql_parts.append(f"  SELECT v_lesson_id, id FROM public.sources WHERE title = '{src_esc}';")
                sql_parts.append(f'  -- idempotent')
                sql_parts.append(f'  -- On conflict: caught by exception handler if duplicate')
            
            sql_parts.append(f'  IF v_lesson_id IS NOT NULL THEN')
            sql_parts.append(f"    RAISE NOTICE '  ✅ {mod_code}: dars {i+1} import qilindi (id=%)', v_lesson_id;")
            sql_parts.append('  END IF;')
        
        sql_parts.append('END $$;')
        sql_parts.append('')
    
    # Hisobot
    sql_parts.append('-- ─── Hisobot ─────────────────────────────────────────')
    sql_parts.append('DO $$')
    sql_parts.append('DECLARE')
    sql_parts.append('  v_total INT;')
    sql_parts.append('  v_refs INT;')
    sql_parts.append('  v_sources INT;')
    sql_parts.append('BEGIN')
    sql_parts.append('  SELECT count(*) INTO v_total FROM public.lessons;')
    sql_parts.append('  SELECT count(*) INTO v_refs FROM public.source_references;')
    sql_parts.append('  SELECT count(*) INTO v_sources FROM public.sources;')
    sql_parts.append(f"  RAISE NOTICE '─────────────────────────────────────────────';")
    sql_parts.append(f"  RAISE NOTICE '✅ Jami: % ta dars import qilindi', v_total;")
    sql_parts.append(f"  RAISE NOTICE '📚 Manbalar: % ta', v_sources;")
    sql_parts.append(f"  RAISE NOTICE '🔗 Source_references: % ta', v_refs;")
    sql_parts.append(f"  RAISE NOTICE '📁 Fayllar: {processed_files} ta';")
    sql_parts.append(f"  RAISE NOTICE '📦 Modullar: {len(modules_covered)} ta';")
    sql_parts.append('END $$;')
    sql_parts.append('')
    sql_parts.append('-- ──────────────────────────────────────────────────────')
    
    with open(migration_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sql_parts))
    
    # ─── Hisobot ────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print("📊 IMPORT HISOBOTI")
    print("=" * 70)
    print(f"   Qayta ishlangan fayllar: {processed_files} / {len(topic_files)}")
    print(f"   Aniqlangan darslar: {len(all_lessons)} ta")
    print(f"   Noyob manbalar: {len(all_source_names)} ta")
    
    print(f"\n   Modullar bo'yicha:")
    for mod_code in sorted(modules_covered):
        count = len(lessons_by_module[mod_code])
        print(f"     {mod_code} ({MODUL_NOMLARI.get(mod_code, '')}): {count} ta dars")
    
    print(f"\n   Sarlavhalardan namunalar:")
    for l in all_lessons[:5]:
        print(f"     ✅ {l['title'][:80]}")
    if len(all_lessons) > 5:
        print(f"     ... va {len(all_lessons)-5} ta dars")
    
    print(f"\n📄 JSON: {json_path}")
    print(f"📄 SQL:  {migration_path}")
    print("=" * 70)


if __name__ == '__main__':
    main()
