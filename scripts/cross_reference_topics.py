#!/usr/bin/env python3
"""
M01-M03 Cross-Reference Skripti
================================
topicContent.ts dagi M01-M03 kontentini Topics/ (S1.INFO, S2.HW, S2.OFFICE)
darslik ma'lumotlari bilan solishtirish va qamrov farqlarini aniqlash.

Ishlatish:
    python3 scripts/cross_reference_topics.py

Natija:
    scripts/cross_reference_report.md fayliga yoziladi
"""

import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

# ============================================================================
# 1. KONFIGURATSIYA
# ============================================================================

PROJECT_ROOT = Path(__file__).parent.parent
TOPIC_CONTENT_FILE = PROJECT_ROOT / "src" / "data" / "topicContent.ts"
TOPICS_DIR = PROJECT_ROOT / "Topics"
REPORT_FILE = PROJECT_ROOT / "scripts" / "cross_reference_report.md"

# Topics/ → M-modul mapping
TOPICS_TO_MODULE_MAP = {
    # S1.INFO → M01 (Axborot va raqamli savodxonlik)
    "S1.INFO": {
        "module": "M01",
        "module_title": "Axborot va raqamli savodxonlik",
        "files_to_subtopics": {
            "S1.INFO.01": ["M01.01"],  # Informatika, axborot, ma'lumot va bilim
            "S1.INFO.02": ["M01.02"],  # Axborot turlari va manbalari
            "S1.INFO.03": ["M01.03", "M01.04", "M01.07"],  # Kodlash
            "S1.INFO.04": ["M01.05"],  # Axborot o'lchov birliklari
            "S1.INFO.05": ["M01.06"],  # Axborot hajmini hisoblash
            "S1.INFO.06": ["M01.06"],  # Uzatish tezligi
            "S1.INFO.07": ["M01.08", "M01.09"],  # Axloq va mualliflik
        }
    },
    # S2.HW → M02 (Kompyuter tizimlari)
    "S2.HW": {
        "module": "M02",
        "module_title": "Kompyuter tizimlari va dasturiy muhit",
        "files_to_subtopics": {
            "S2.HW.01": ["M02.01", "M02.02", "M02.03", "M02.04", "M02.05"],  # Qurilmalar
            "S2.HW.02": ["M02.07"],  # Operatsion tizimlar
            "S2.HW.03": ["M02.09"],  # Fayl va papkalar
            "S2.HW.04": ["M02.06", "M02.08"],  # Dasturiy ta'minot
        }
    },
    # S2.OFFICE → M03 (Microsoft Office)
    "S2.OFFICE": {
        "module": "M03",
        "module_title": "Microsoft Office",
        "files_to_subtopics": {
            "S2.OFFICE.01": ["M03.01", "M03.02", "M03.03"],  # MS Word
            "S2.OFFICE.02": ["M03.04", "M03.05"],  # Excel formulalar
            "S2.OFFICE.03": ["M03.06", "M03.07"],  # Excel filtr, diagramma
            "S2.OFFICE.04": ["M03.08", "M03.09", "M03.10"],  # PowerPoint
        }
    }
}

# contentTree subtopic titles for reference
SUBTOPIC_TITLES = {
    "M01.01": "Informatika, axborot, ma'lumot va bilim",
    "M01.02": "Axborot turlari va manbalari",
    "M01.03": "Axborot va raqamli texnologiyalar",
    "M01.04": "Axborotni kodlash",
    "M01.05": "Axborot o'lchov birliklari",
    "M01.06": "Axborot hajmi va uzatish tezligi",
    "M01.07": "Matn, grafika, audio va videoni kodlash",
    "M01.08": "Raqamli axloq va mualliflik huquqi",
    "M01.09": "Axborotni saralash, tekshirish va xulosa chiqarish",
    "M02.01": "Kompyuterlarning rivojlanish tarixi",
    "M02.02": "Kompyuter tuzilishi va ichki qurilmalar",
    "M02.03": "Tashqi va qo'shimcha qurilmalar",
    "M02.04": "Xotira va saqlash qurilmalari",
    "M02.05": "Mobil qurilmalar",
    "M02.06": "Dasturiy ta'minot turlari",
    "M02.07": "Operatsion tizimlar",
    "M02.08": "Xizmat ko'rsatuvchi dasturlar",
    "M02.09": "Fayl va papkalar",
    "M03.01": "Word interfeysi, yaratish va tahrirlash",
    "M03.02": "Word formatlash vositalari",
    "M03.03": "Word obyektlari",
    "M03.04": "Excel vazifalari va elementlari",
    "M03.05": "Excel formulalari va funksiyalari",
    "M03.06": "Excel filtrlash va saralash",
    "M03.07": "Excel diagramma va grafiklari",
    "M03.08": "PowerPoint interfeysi va dizayni",
    "M03.09": "PowerPoint obyektlari va multimedia",
    "M03.10": "Animatsiya va o'tish effektlari",
}


# ============================================================================
# 2. PARSER FUNCTIONS
# ============================================================================

def parse_topic_content_m01_m03():
    """M01-M03 subtopics larini topicContent.ts dan ekstraksiya qilish."""
    content = TOPIC_CONTENT_FILE.read_text(encoding="utf-8")
    results = {}

    for module_code in ["M01", "M02", "M03"]:
        # Find all subtopics for this module
        pattern = rf'"{module_code}\.(\d\d)"\s*:\s*t\s*\("'
        for match in re.finditer(pattern, content):
            subtopic_num = match.group(1)
            subtopic_id = f"{module_code}.{subtopic_num}"
            
            # Find the subtopic block
            start = match.start()
            # Find end — next entry or closing of TOPIC_CONTENT
            end_search = content.find(']\n\n  "', start + 50)
            if end_search == -1:
                end_search = content.find(']\n\n  "', start + 50)
            if end_search == -1:
                end_search = content.find("]\n\n  '", start + 50)
            if end_search == -1:
                end_search = content.find("]\n)\n\n}", start + 50)
                if end_search != -1:
                    end_search += 3
            else:
                end_search += 2
            
            if end_search == -1 or end_search <= start:
                # Try different end markers
                for marker in [']\n\n  "', "]\n\n  '", ']\n)\n\nexport']:
                    end_search = content.find(marker, start + 100)
                    if end_search != -1:
                        break
            
            block = content[start:end_search + 2] if end_search > start else content[start:start + 5000]
            
            # Extract theory blocks
            theory_texts = []
            for theory_match in re.finditer(r'\{ type:\s*"([^"]+)",\s*content:\s*"((?:[^"\\]|\\.)*)"', block):
                theory_type = theory_match.group(1)
                theory_content = theory_match.group(2)
                # Unescape
                theory_content = theory_content.replace('\\"', '"').replace("\\n", "\n")
                theory_texts.append({"type": theory_type, "content": theory_content})
            
            # Also match single-quoted theory blocks (for mixed format)
            for theory_match in re.finditer(r"\{ type:\s*'([^']+)',\s*content:\s*'((?:[^'\\]|\\.)*)'", block):
                theory_type = theory_match.group(1)
                theory_content = theory_match.group(2)
                theory_content = theory_content.replace("\\'", "'").replace("\\n", "\n")
                theory_texts.append({"type": theory_type, "content": theory_content})
            
            # Extract questions
            questions = []
            for q_match in re.finditer(r'\{ id:\s*"([^"]+)",\s*text:\s*"((?:[^"\\]|\\.)*)"', block):
                q_id = q_match.group(1)
                q_text = q_match.group(2).replace('\\"', '"')
                questions.append({"id": q_id, "text": q_text})
            
            results[subtopic_id] = {
                "title": SUBTOPIC_TITLES.get(subtopic_id, "Noma'lum"),
                "theory_count": len(theory_texts),
                "theory_types": [t["type"] for t in theory_texts],
                "theory_text": " ".join(t["content"] for t in theory_texts),
                "question_count": len(questions),
                "question_texts": [q["text"] for q in questions],
            }
    
    return results


def extract_clean_text_from_code_blocks(text):
    """```text ... ``` bloklaridan toza matn ajratish."""
    blocks = re.findall(r'```text\n(.*?)```', text, re.DOTALL)
    return "\n\n".join(blocks)


def parse_topics_file(filepath):
    """Topics/ papkasidagi .md faylni tahlil qilish."""
    content = filepath.read_text(encoding="utf-8")
    filename = filepath.stem
    
    # Extract header info
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else filename
    
    # Extract keywords
    kw_match = re.search(r'> \*\*Kalit soʻzlar:\*\* (.+)$', content, re.MULTILINE)
    keywords = []
    if kw_match:
        keywords = [k.strip().strip('`') for k in kw_match.group(1).split(',')]
    
    # Extract blueprint group
    group_match = re.search(r'> \*\*Blueprint guruhi:\*\* `([^`]+)`', content)
    blueprint_group = group_match.group(1) if group_match else ""
    
    # Extract exam info
    exam_match = re.search(r'> \*\*Imtihonda:\*\* (.+)$', content, re.MULTILINE)
    exam_info = exam_match.group(1).strip() if exam_match else ""
    
    # Extract textbook excerpts from code blocks
    textbook_text = extract_clean_text_from_code_blocks(content)
    
    # Extract source table rows
    source_rows = re.findall(r'^\|\s*\d+\s*\|', content, re.MULTILINE)
    num_sources = len(source_rows)
    
    # Count total lines
    total_lines = len(content.splitlines())
    
    return {
        "filename": filename,
        "title": title,
        "keywords": keywords,
        "blueprint_group": blueprint_group,
        "exam_info": exam_info,
        "textbook_text": textbook_text,
        "num_sources": num_sources,
        "total_lines": total_lines,
        "textbook_word_count": len(textbook_text.split()),
    }


def extract_topics_files(group_prefix):
    """Berilgan guruhdagi barcha Topics/ fayllarini o'qish."""
    group_dir = TOPICS_DIR / group_prefix
    if not group_dir.exists():
        print(f"  ⚠️ {group_dir} topilmadi")
        return {}
    
    files = {}
    for f in sorted(group_dir.glob("*.md")):
        info = parse_topics_file(f)
        files[info["filename"]] = info
    
    return files


# ============================================================================
# 3. KEYWORD EXTRACTION & MATCHING
# ============================================================================

# Muhim kalit so'zlar — har bir modul va subtopic uchun
SUBTOPIC_KEYWORDS = {
    "M01.01": ["informatika", "axborot", "ma'lumot", "bilim", "bilimlar bazasi", "ma'lumot turlari"],
    "M01.02": ["axborot turlari", "axborot manbalari", "statik", "dinamik", "bevosita", "bilvosita", "axborot sifati"],
    "M01.03": ["raqamli texnologiyalar", "bulutli hisoblash", "biometriya", "3D printer", "5G", "IoT", "sun'iy intellekt"],
    "M01.04": ["kodlash", "ikkilik kod", "ASCII", "Unicode", "Morze", "sanoq sistemasi", "dekodlash"],
    "M01.05": ["bit", "bayt", "kilobayt", "megabayt", "gigabayt", "terabayt", "axborot o'lchov birligi"],
    "M01.06": ["uzatish tezligi", "bit/s", "Mbps", "Gbps", "yuklash vaqti", "fayl hajmi", "internet tezligi"],
    "M01.07": ["matn kodlash", "grafik kodlash", "audio kodlash", "video kodlash", "RGB", "PCM", "MP3", "JPEG", "PNG"],
    "M01.08": ["raqamli axloq", "netiket", "mualliflik huquqi", "copyright", "Creative Commons", "plagiat"],
    "M01.09": ["saralash", "tekshirish", "xulosa chiqarish", "CRAAP", "tanqidiy fikrlash", "axborot madaniyati"],
    "M02.01": ["kompyuter tarixi", "ENIAC", "elektron lampa", "tranzistor", "mikroprotsessor", "Ada Lavleys", "Bebbaj"],
    "M02.02": ["protsessor", "ALU", "Fon-Neyman", "asosiy plata", "chipset", "yadro", "chastota", "sovutish"],
    "M02.03": ["kiritish qurilma", "chiqarish qurilma", "printer", "skaner", "monitor", "klaviatura", "sichqon", "USB"],
    "M02.04": ["RAM", "ROM", "HDD", "SSD", "tezkor xotira", "doimiy xotira", "virtual xotira", "kesh xotira"],
    "M02.05": ["mobil qurilma", "smartfon", "planshet", "Android", "iOS", "NFC", "sensorli ekran", "E-ink"],
    "M02.06": ["dasturiy ta'minot", "tizimli dastur", "amaliy dastur", "programma", "dasturiy vosita"],
    "M02.07": ["operatsion tizim", "Windows", "Linux", "macOS", "fayl tizimi", "protsess", "resurs boshqaruvi"],
    "M02.08": ["xizmat ko'rsatuvchi dastur", "utilita", "arxivator", "defragmentator", "antivirus", "disk boshqaruvi"],
    "M02.09": ["fayl", "papka", "katalog", "kengaytma", "fayl nomi", "yo'l", "fayl tizimi", "NTFS", "FAT32"],
    "M03.01": ["Word", "hujjat", "yaratish", "saqlash", "ochish", "tahrirlash", "Ctrl+N", "F12"],
    "M03.02": ["formatlash", "shrift", "abzas", "uslub", "Style", "Format Painter", "tekislash", "oraliq"],
    "M03.03": ["Word obyekt", "SmartArt", "WordArt", "rasm", "jadval", "Merge Cells", "Text Wrapping"],
    "M03.04": ["Excel", "Workbook", "katak", "ustun", "qator", "manzil", "$A$1", "Sheet"],
    "M03.05": ["Excel formula", "SUM", "IF", "AVERAGE", "COUNT", "MAX", "MIN", "= formula"],
    "M03.06": ["filtrlash", "AutoFilter", "saralash", "Sort", "Custom Sort", "Ctrl+Shift+L"],
    "M03.07": ["Excel diagramma", "grafik", "Chart", "ustunli", "doiraviy", "chiziqli", "diagramma turlari"],
    "M03.08": ["PowerPoint", "taqdimot", "slayd", "dizayn", "mavzu", "Theme", "Template"],
    "M03.09": ["PowerPoint obyekt", "multimedia", "rasm", "video", "audio", "SmartArt", "jadval"],
    "M03.10": ["animatsiya", "o'tish effekti", "Transition", "Animation", "slayd almashish", "vaqt"],
}


def calculate_coverage(text: str, keywords: list) -> dict:
    """Berilgan matndagi kalit so'zlar qamrovini hisoblash."""
    text_lower = text.lower()
    results = {}
    for kw in keywords:
        count = text_lower.count(kw.lower())
        results[kw] = {
            "found": count > 0,
            "count": count,
        }
    return results


def analyze_subtopic_coverage(subtopic_id, module_content, topics_content):
    """Subtopic qamrovini tahlil qilish — topicContent vs Topics/ textbook data."""
    keywords = SUBTOPIC_KEYWORDS.get(subtopic_id, [])
    if not keywords:
        return {"coverage_pct": 0, "covered": [], "uncovered": []}
    
    # topicContent ts dan matn
    platform_text = (
        module_content.get(subtopic_id, {}).get("theory_text", "")
    )
    
    # Topics darslik matni (barcha tegishli fayllardan)
    textbook_text = ""
    for tf_name, tf_data in topics_content.items():
        textbook_text += " " + tf_data["textbook_text"]
    
    # Platform coverage
    platform_result = calculate_coverage(platform_text, keywords)
    
    # Textbook coverage
    textbook_result = calculate_coverage(textbook_text, keywords)
    
    covered = []
    uncovered = []
    for kw in keywords:
        p_found = platform_result[kw]["found"]
        t_found = textbook_result.get(kw, {}).get("found", False)
        
        if p_found:
            covered.append(kw)
        else:
            uncovered.append({"keyword": kw, "in_textbook": t_found})
    
    coverage_pct = round(len(covered) / len(keywords) * 100) if keywords else 0
    textbook_coverage_pct = round(sum(1 for kw in keywords if textbook_result.get(kw, {}).get("found", False)) / len(keywords) * 100) if keywords else 0
    
    return {
        "subtopic_id": subtopic_id,
        "keywords_total": len(keywords),
        "keywords_covered": len(covered),
        "coverage_pct": coverage_pct,
        "textbook_coverage_pct": textbook_coverage_pct,
        "covered_keywords": covered,
        "uncovered_keywords": uncovered,
        "platform_question_count": module_content.get(subtopic_id, {}).get("question_count", 0),
        "platform_theory_count": module_content.get(subtopic_id, {}).get("theory_count", 0),
    }


# ============================================================================
# 4. REPORT GENERATION
# ============================================================================

def generate_report(all_platform_content, groups_data, all_coverage):
    """Markdown report yaratish."""
    lines = []
    lines.append("# M01-M03 Cross-Reference Report")
    lines.append("=" * 60)
    lines.append(f"\n**Sana:** {__import__('datetime').datetime.now().strftime('%d %B %Y')}")
    lines.append(f"\n**Maqsad:** topicContent.ts dagi M01-M03 kontentini Topics/ darslik ma'lumotlari bilan solishtirish")
    lines.append(f"\n---\n")
    
    # === OVERALL SUMMARY ===
    lines.append("## 📊 Umumiy Xulosa\n")
    
    total_platform_content = sum(len(v.get("theory_text", "").split()) for v in all_platform_content.values())
    total_platform_questions = sum(v.get("question_count", 0) for v in all_platform_content.values())
    total_platform_theory = sum(v.get("theory_count", 0) for v in all_platform_content.values())
    
    total_textbook_words = 0
    total_textbook_sources = 0
    for group_name, group_data in groups_data.items():
        for fname, fdata in group_data.items():
            total_textbook_words += fdata["textbook_word_count"]
            total_textbook_sources += fdata["num_sources"]
    
    lines.append(f"| Ko'rsatkich | Qiymat |")
    lines.append(f"|---|:---:|")
    lines.append(f"| M01-M03 subtopics (contentTree) | 28 |")
    lines.append(f"| Platformada mavjud subtopics | {len(all_platform_content)} |")
    lines.append(f"| Platforma nazariy bloklari | {total_platform_theory} |")
    lines.append(f"| Platforma savollari | {total_platform_questions} |")
    lines.append(f"| Topics/ darslik fayllari | {sum(len(v) for v in groups_data.values())} |")
    lines.append(f"| Topics/ darslik so'zlari | ~{total_textbook_words} |")
    lines.append(f"| Topics/ manba havolalari | {total_textbook_sources} |")
    
    avg_coverage = sum(c["coverage_pct"] for c in all_coverage.values() if c["coverage_pct"] > 0) / max(len([c for c in all_coverage.values() if c["coverage_pct"] > 0]), 1)
    lines.append(f"\n**O'rtacha kalit so'z qamrovi:** {avg_coverage:.0f}%")
    
    if avg_coverage >= 80:
        lines.append("\n🟢 **Umumiy holat:** Yaxshi — platforma kontenti darslik ma'lumotlarini yetarli qamrab olgan.")
    elif avg_coverage >= 60:
        lines.append("\n🟡 **Umumiy holat:** O'rtacha — ba'zi mavzular qo'shimcha boyitilishi mumkin.")
    else:
        lines.append("\n🔴 **Umumiy holat:** Zaif — platforma kontenti darslik ma'lumotlarini to'liq qamrab olmagan.")
    
    # === MODULE-BY-MODULE ===
    for module_code in ["M01", "M02", "M03"]:
        module_coverage = {k: v for k, v in all_coverage.items() if k.startswith(module_code)}
        if not module_coverage:
            continue
        
        module_title = SUBTOPIC_TITLES.get(f"{module_code}.01", "").replace("Informatika", "").replace("Kompyuter", "").replace("Microsoft", "").strip() or module_code
        
        # Find group name
        group_name = ""
        for gname, gdata in TOPICS_TO_MODULE_MAP.items():
            if gdata["module"] == module_code:
                group_name = gname
                break
        
        lines.append(f"\n---\n")
        lines.append(f"## {module_code}: {SUBTOPIC_TITLES.get(f'{module_code}.01', module_code).split(',')[0]}")
        lines.append(f"**Blueprint guruhi:** `{group_name}`")
        lines.append(f"**Topics/ fayllar:** {len(groups_data.get(group_name, {}))} ta")
        
        lines.append(f"\n### Modul statistikasi\n")
        mod_theory = sum(c["platform_theory_count"] for c in module_coverage.values())
        mod_questions = sum(c["platform_question_count"] for c in module_coverage.values())
        mod_avg_cov = sum(c["coverage_pct"] for c in module_coverage.values()) / len(module_coverage) if module_coverage else 0
        
        lines.append(f"| Ko'rsatkich | Qiymat |")
        lines.append(f"|---|:---:|")
        lines.append(f"| Subtopics | {len(module_coverage)} |")
        lines.append(f"| Nazariy bloklar | {mod_theory} |")
        lines.append(f"| Savollar | {mod_questions} |")
        lines.append(f"| O'rtacha kalit so'z qamrovi | {mod_avg_cov:.0f}% |")
        
        lines.append(f"\n### Subtopic tahlili\n")
        lines.append("| Subtopic | Title | Qamrov | Savol | Nazariya | Yo'qotilgan kalit so'zlar |")
        lines.append("|:--------:|:------|:-----:|:-----:|:--------:|:------------------------|")
        
        for st_id in sorted(module_coverage.keys(), key=lambda x: x):
            cov = module_coverage[st_id]
            title = SUBTOPIC_TITLES.get(st_id, "")
            
            # Coverage indicator
            if cov["coverage_pct"] >= 80:
                indicator = f"🟢 {cov['coverage_pct']}%"
            elif cov["coverage_pct"] >= 50:
                indicator = f"🟡 {cov['coverage_pct']}%"
            else:
                indicator = f"🔴 {cov['coverage_pct']}%"
            
            uncovered_kw = [u["keyword"] for u in cov["uncovered_keywords"] if u["in_textbook"]]
            missing_kw_str = ", ".join(uncovered_kw[:3])
            if len(uncovered_kw) > 3:
                missing_kw_str += f" ... (+{len(uncovered_kw)-3})"
            if not missing_kw_str:
                missing_kw_str = "—"
            
            lines.append(f"| {st_id} | {title[:40]} | {indicator} | {cov['platform_question_count']} | {cov['platform_theory_count']} | {missing_kw_str} |")
        
        # === FILES IN THIS GROUP ===
        group_name_found = ""
        for gname, gdata in TOPICS_TO_MODULE_MAP.items():
            if gdata["module"] == module_code:
                group_name_found = gname
                break
        
        if group_name_found and group_name_found in groups_data:
            group_files = groups_data[group_name_found]
            lines.append(f"\n### Topics/ fayllari ({group_name_found})\n")
            lines.append("| Fayl | Title | Manbalar | Kalit so'zlar | So'zlar |")
            lines.append("|:----:|:------|:--------:|:------------:|:------:|")
            
            for fname, fdata in sorted(group_files.items()):
                title_short = fdata["title"][:50]
                kw_str = ", ".join(fdata["keywords"][:3])
                if len(fdata["keywords"]) > 3:
                    kw_str += "..."
                lines.append(f"| {fname} | {title_short} | {fdata['num_sources']} | {kw_str} | ~{fdata['textbook_word_count']} |")
    
    # === GAP ANALYSIS ===
    lines.append(f"\n---\n")
    lines.append("## 🔍 Topilgan Kamchiliklar\n")
    
    gap_found = False
    for st_id, cov in sorted(all_coverage.items()):
        uncovered_textbook = [u for u in cov["uncovered_keywords"] if u.get("in_textbook", False)]
        if uncovered_textbook:
            gap_found = True
            lines.append(f"\n### {st_id}: {SUBTOPIC_TITLES.get(st_id, '')}")
            lines.append(f"**Platformada yo'q, lekin darslikda bor:**")
            for u in uncovered_textbook:
                lines.append(f"- `{u['keyword']}`")
    
    if not gap_found:
        lines.append("\n🟢 Barcha asosiy kalit so'zlar platformada mavjud.")
    
    # === DETAILED PER-FILE MAPPING ===
    lines.append(f"\n---\n")
    lines.append("## 📋 Topics/ → M-Modul Mapping Tahlili\n")
    
    for group_name, group_config in TOPICS_TO_MODULE_MAP.items():
        lines.append(f"\n### {group_name} → {group_config['module']} ({group_config['module_title']})\n")
        
        if group_name not in groups_data:
            lines.append(f"⚠️ {group_name} guruhi topilmadi\n")
            continue
        
        for fname, mapped_subtopics in sorted(group_config["files_to_subtopics"].items()):
            if fname not in groups_data[group_name]:
                lines.append(f"⚠️ {fname} topilmadi\n")
                continue
            
            fdata = groups_data[group_name][fname]
            lines.append(f"**{fname}:** {fdata['title']}")
            lines.append(f"- Darslik manbalari: {fdata['num_sources']} ta")
            lines.append(f"- Darslik so'zlari: ~{fdata['textbook_word_count']}")
            lines.append(f"- Kalit so'zlar: {', '.join(fdata['keywords'])}")
            
            # Check mapped subtopics
            lines.append(f"- Mapping qilingan subtopiclar:")
            for st_id in mapped_subtopics:
                cov = all_coverage.get(st_id, {})
                cov_pct = cov.get("coverage_pct", 0)
                q_count = cov.get("platform_question_count", 0)
                
                # Coverage status
                if cov_pct >= 80:
                    status = "✅ Yaxshi"
                elif cov_pct >= 50:
                    status = "🟡 O'rtacha"
                else:
                    status = "🔴 Zaif"
                
                lines.append(f"  - {st_id} ({SUBTOPIC_TITLES.get(st_id, '')}): qamrov {cov_pct}%, savol {q_count} — {status}")
            
            lines.append("")
    
    # === RECOMMENDATIONS ===
    lines.append(f"\n---\n")
    lines.append("## 💡 Tavsiyalar\n")
    
    recommendations = []
    for st_id, cov in sorted(all_coverage.items()):
        if cov["coverage_pct"] < 60:
            uncovered = [u["keyword"] for u in cov["uncovered_keywords"]]
            recommendations.append(f"- **{st_id}** ({SUBTOPIC_TITLES.get(st_id, '')}): Qamrov {cov['coverage_pct']}%. Qo'shimcha: {', '.join(uncovered[:5])}")
    
    if recommendations:
        lines.append("\n### 🔧 Qo'shimcha ishlov talab qiladigan subtopiclar:\n")
        for rec in recommendations:
            lines.append(rec)
    else:
        lines.append("\n🟢 Barcha subtopiclar yetarli darajada qoplangan.\n")
    
    # General recommendations
    lines.append("\n### Umumiy tavsiyalar:\n")
    lines.append("1. Topics/ darslik ma'lumotlariga asoslangan holda savollar boyitilishi mumkin")
    lines.append("2. Darslikda keltirilgan misol va topshiriqlardan foydalanish")
    lines.append("3. Yangi texnologiyalar haqida dolzarb ma'lumotlar qo'shish")
    lines.append("4. Har bir subtopic uchun kamida 1 ta murakkab (Y3) savol qo'shish")
    
    lines.append(f"\n---\n")
    lines.append(f"*Hisobot avtomatik tarzda `scripts/cross_reference_topics.py` skripti tomonidan yaratildi.*\n")
    
    return "\n".join(lines)


# ============================================================================
# 5. MAIN
# ============================================================================

def main():
    print("=" * 60)
    print("M01-M03 Cross-Reference Analysis")
    print("=" * 60)
    
    # 1. Parse topicContent.ts
    print("\n📖 topicContent.ts dan M01-M03 o'qilmoqda...")
    platform_content = parse_topic_content_m01_m03()
    print(f"   ✅ {len(platform_content)} subtopic topildi")
    for st_id in sorted(platform_content.keys()):
        data = platform_content[st_id]
        print(f"      {st_id}: {data['title']} — {data['theory_count']} theory, {data['question_count']} questions")
    
    # 2. Parse Topics/ files
    all_groups = {}
    for group_name in TOPICS_TO_MODULE_MAP:
        print(f"\n📁 Topics/{group_name} o'qilmoqda...")
        group_files = extract_topics_files(group_name)
        if group_files:
            all_groups[group_name] = group_files
            print(f"   ✅ {len(group_files)} fayl topildi")
            for fname in sorted(group_files.keys()):
                fdata = group_files[fname]
                print(f"      {fname}: {fdata['num_sources']} manba, ~{fdata['textbook_word_count']} so'z")
    
    # 3. Coverage analysis
    print("\n📊 Qamrov tahlili...")
    all_coverage = {}
    total_pct = 0
    count_with_content = 0
    
    for subtopic_id in sorted(platform_content.keys()):
        # Find matching Topics group
        module_code = subtopic_id.split(".")[0]
        topics_content = {}
        for gname, gdata in TOPICS_TO_MODULE_MAP.items():
            if gdata["module"] == module_code:
                if gname in all_groups:
                    topics_content = all_groups[gname]
                break
        
        coverage = analyze_subtopic_coverage(subtopic_id, platform_content, topics_content)
        all_coverage[subtopic_id] = coverage
        
        if coverage["coverage_pct"] > 0:
            total_pct += coverage["coverage_pct"]
            count_with_content += 1
        
        status = "🟢" if coverage["coverage_pct"] >= 80 else ("🟡" if coverage["coverage_pct"] >= 50 else "🔴")
        uncovered = [u["keyword"] for u in coverage["uncovered_keywords"]]
        print(f"   {status} {subtopic_id}: {coverage['coverage_pct']}% ({coverage['keywords_covered']}/{coverage['keywords_total']}) — uncovered: {', '.join(uncovered[:3]) if uncovered else '—'}")
    
    avg = total_pct / count_with_content if count_with_content else 0
    print(f"\n📈 O'rtacha qamrov: {avg:.0f}%")
    
    # 4. Generate report
    print(f"\n📝 Hisobot yozilmoqda...")
    report = generate_report(platform_content, all_groups, all_coverage)
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    REPORT_FILE.write_text(report, encoding="utf-8")
    print(f"   ✅ {REPORT_FILE} fayliga yozildi")
    
    print("\n✅ Tahlil yakunlandi!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
