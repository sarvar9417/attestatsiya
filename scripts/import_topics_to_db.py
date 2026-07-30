#!/usr/bin/env python3
"""
Topics/ papkasidagi mavzu fayllarini o'qib, ularni Supabase database'ga
lessons sifatida import qilish uchun SQL migratsiya skripti.

Yaxshilanishlar:
  - clean_lesson_title: Bob X o'rniga mazmunli sarlavha, akronim saqlash
  - 📌 subtopic marker: darslar to'g'ri subtopic ga bog'lanadi
  - Subtopic keywords: contentTree asosida avtomatik keyword matching
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
    '26_Algoritmlash':                     'M06',
    '27_Kasb_standarti':                   'M14',
    '28_Umumiy_pedagogika':                'M15',
    '29_Informatika_metodikasi':           'M16',
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

# ─── Subtopic keywords (contentTree asosida) ──────────────────────────────
# Har bir modul subtopic: kalit so'zlar ro'yxati
# Parser lesson body/header da ushbu so'zlarni qidirib topadi

SUBTOPIC_KEYWORDS: dict[str, list[tuple[str, list[str]]]] = {
    'M01': [
        ('M01.01', ['informatika', 'axborot', "ma'lumot", 'bilim']),
        ('M01.02', ['axborot turlari', 'axborot manbala']),
        ('M01.03', ['raqamli texnologiya', 'axborot texnologiya']),
        ('M01.04', ['axborotni kodlash', 'kodlash']),
        ('M01.05', ["axborot o'lchov", "o'lchov birlik"]),
        ('M01.06', ["axborot hajmi", 'uzatish tezligi']),
        ('M01.07', ['matn kodlash', 'grafika kodlash', 'audio kodlash', 'video kodlash']),
        ('M01.08', ["raqamli axloq", "mualliflik huquqi"]),
        ('M01.09', ['axborotni saralash', 'tekshirish', 'xulosa chiqarish']),
    ],
    'M02': [
        ('M02.01', ['rivojlanish tarixi', 'kompyuterlar rivojlanish']),
        ('M02.02', ['kompyuter tuzilishi', 'ichki qurilma', 'protsessor', 'sistema blok']),
        ('M02.03', ['tashqi qurilma', "qo'shimcha qurilma", 'printer', 'monitor', 'klaviatura', 'sichqon']),
        ('M02.04', ['xotira', 'saqlash qurilma', 'qattiq disk', 'ssd', 'ram', 'operativ xotira']),
        ('M02.05', ['mobil qurilma', 'smartfon', 'planshet']),
        ('M02.06', ['dasturiy ta\'minot', "dasturiy ta'minot turlari", 'amaliy dastur']),
        ('M02.07', ['operatsion tizim', 'windows', 'linux', 'macos']),
        ('M02.08', ["xizmat ko'rsatuvchi dastur", 'utility', 'arxivator', 'antivirus']),
        ('M02.09', ['fayl', 'papka', 'katalog', 'fayl tizimi']),
    ],
    'M03': [
        ('M03.01', ['word interfeys', 'word yaratish', 'hujjat yaratish']),
        ('M03.02', ['word formatlash', 'shrft', 'abzas', 'uslub']),
        ('M03.03', ['word obyekt', 'rasm', 'jadval', 'smartart']),
        ('M03.04', ['excel vazifa', 'excel element', 'elektron jadval']),
        ('M03.05', ['excel formula', 'excel funksiya', 'sum', 'average', 'if']),
        ('M03.06', ['excel filtr', 'excel saralash', 'sort', 'filter']),
        ('M03.07', ['excel diagramma', 'excel grafik', 'chart']),
        ('M03.08', ['powerpoint interfeys', 'powerpoint dizayn', 'taqdimot']),
        ('M03.09', ['powerpoint obyekt', 'multimedia', 'slayd']),
        ('M03.10', ['animatsiya', "o'tish effekti", 'transition']),
    ],
    'M04': [
        ('M04.01', ['mantiq asosi', 'mulohaza', 'mantiqiy mulohaza']),
        ('M04.02', ['mantiqiy amal', 'mantiqiy ifoda', 'va', 'yoki', 'emas']),
        ('M04.03', ['rostlik jadvali', 'haqiqat jadvali']),
        ('M04.04', ['mantiqiy sxema', 'mantiqiy element']),
        ('M04.05', ['masalani kompyuterda yechish', 'yechish bosqichlari']),
        ('M04.06', ['model', 'modellashtirish', 'model turlari']),
    ],
    'M05': [
        ('M05.01', ['sanoq sistema asosi', 'sanoq sistemasi']),
        ('M05.02', ["o'tkazish", 'bir sanoq', 'boshqa sanoq']),
        ('M05.03', ['arifmetik amal', "qo'shish", 'ayirish', "ko'paytirish"]),
    ],
    'M06': [
        ('M06.01', ['algoritm tushunchasi', 'algoritm xossasi', 'algoritmning xos', 'al-xorazmiy']),
        ('M06.02', ['algoritm turi', 'chiziqli algoritm', 'tarmoqlanuvchi algoritm', 'takrorlanuvchi algoritm', 'siklik']),
        ('M06.03', ['blok-sxema', 'psevdokod', 'blok sxema', 'oval', 'romb', 'paralellogramm']),
        ('M06.04', ['algoritmni tekshirish', 'algoritmni tahlil', 'murakkablik', 'maqbul algoritm']),
    ],
    'M07': [
        ('M07.01', ['scratch muhit', 'scratch interfeys', 'sprayt', 'koordinata']),
        ('M07.02', ['scratch blok', 'hodisa', 'skript']),
        ('M07.03', ["scratch o'zgaruvchi", "scratch ro'yxat", 'scratch list']),
        ('M07.04', ['scratch shart', 'scratch sikl', 'agar', 'takrorla']),
        ('M07.05', ['scratch pen', 'scratch shakl', 'scratch animatsiya']),
        ('M07.06', ['logo', 'toshbaqa grafikasi', 'logo dasturlash']),
    ],
    'M08': [
        ('M08.01', ['dastur', 'dasturlash tili', 'dasturlash haqida']),
        ('M08.02', ['python sintaksis', 'python muhit', 'idle', "python dasturlash"]),
        ('M08.03', ["python o'zgaruvchi", "python ma'lumot turi", 'int', 'str', 'float', 'bool']),
        ('M08.04', ['python xato', 'python operator', 'python satr', 'string']),
        ('M08.05', ['python shart', 'if', 'else', 'elif']),
        ('M08.06', ['python sikl', 'for', 'while', 'range']),
        ('M08.07', ['python funksiya', 'def', "o'zgaruvchi sohasi", 'return']),
        ('M08.08', ["python ro'yxat", 'python list', 'python massiv', 'append']),
        ('M08.09', ['python kutubxona', 'python fayl', 'python gui', 'python oop', 'sinf', 'obyekt']),
        ('M08.10', ["sun'iy intellekt", 'python ai', "python si", 'nlp', 'text-to-speech', 'speech-to-text']),
        ('M08.11', ['javascript sintaksis', "javascript ma'lumot"]),
        ('M08.12', ['javascript shart', 'javascript sikl', 'javascript funksiya', 'javascript massiv']),
    ],
    'M09': [
        ('M09.01', ["ma'lumotlar bazasi", 'mbbt', 'dbms']),
        ('M09.02', ['baza turi', 'jadval', "ma'lumot turi", 'field']),
        ('M09.03', ['kalit', "bog'lash", 'foreign key', 'primary key']),
        ('M09.04', ['ms access forma', "ms access so'rov", 'ms access hisobot']),
        ('M09.05', ['import', 'eksport', "ma'lumot almash"]),
        ('M09.06', ['sql', 'select', 'insert', 'update', 'delete']),
    ],
    'M10': [
        ('M10.01', ['grafika turi', 'rang modeli', 'grafika format', 'rastr', 'vektor']),
        ('M10.02', ['paint', 'photoshop', "photoshop interfeys"]),
        ('M10.03', ['belgilash', 'kesish', 'rang', 'qatlam', 'layer']),
        ('M10.04', ['matn tahrirlash', 'foto tahrirlash', 'rasm tahrirlash']),
        ('M10.05', ['3d', "3d modellashtirish", 'uch o\'lcham']),
        ('M10.06', ['animatsiya', 'adobe animate', 'flash']),
        ('M10.07', ['audio tahrirlash', 'video tahrirlash', 'ovoz', 'video muharrir']),
    ],
    'M11': [
        ('M11.01', ['veb', 'html asos', 'html tegi', 'html tuzilma']),
        ('M11.02', ['html matn', 'html fon', "html ro'yxat", 'html rasm', 'img']),
        ('M11.03', ['html jadval', 'html forma', 'table', 'form', 'input']),
        ('M11.04', ['html havola', 'html iframe', 'html audio', 'html video']),
        ('M11.05', ['css asos', 'css rang', 'css tanlovchi', 'selector']),
        ('M11.06', ['css matn', "css ro'yxat", 'css blok', 'css jadval', 'css forma']),
        ('M11.07', ["veb-sayt loyihalash", 'veb sayt yaratish', 'tekshirish']),
    ],
    'M12': [
        ('M12.01', ['tarmoq tushunchasi', 'tarmoq turi', 'lan', 'wan', 'internet']),
        ('M12.02', ['tarmoq komponent', 'tarmoq qurilma', 'router', 'switch', 'hub', 'aloqa vositasi']),
        ('M12.03', ['arxitektura', 'topologiya', 'yulduz', 'halqa', 'avtobus', 'client-server']),
        ('M12.04', ['tarmoq ishlash prinsipi', 'protokol', 'tcp/ip', 'http']),
        ('M12.05', ['ip manzil', 'maska', 'tarmoq hisobi', 'ip address', 'subnet']),
        ('M12.06', ['internet', 'brauzer', 'qidiruv', 'google', 'yandex']),
        ('M12.07', ['elektron pochta', 'email', 'e-mail', 'gmail', 'pochta xizmati']),
        ('M12.08', ['bulut', 'cloud', 'bulutli texnologiya', 'saas', 'paas', 'iaas']),
        ('M12.09', ['iot', 'vr', 'ar', 'mobil texnologiya', 'mobil ilova']),
    ],
    'M13': [
        ('M13.01', ["axborot xavfsizligi", 'xavfsizlik tahdid', 'xavfsizlikka tahdid']),
        ('M13.02', ['zararli dastur', 'phishing', 'virus', 'trojan', 'worm']),
        ('M13.03', ['antivirus', 'himoya vositasi', 'firewall']),
        ('M13.04', ['zaxiralash', 'backup', 'shifrlash', 'kriptografiya']),
        ('M13.05', ['elektron imzo', 'elektron hujjat', 'elektron hukumat', 'e-government']),
        ('M13.06', ['elektron tijorat', "elektron to'lov", 'e-commerce', 'blockchain']),
        ('M13.07', ['smm', 'social media', 'ijtimoiy media', 'auditoriya', 'marketing']),
        ('M13.08', ['cms', 'content management', 'wordpress', 'joomla']),
        ('M13.09', ['lms', 'learning management', 'moodle']),
        ('M13.10', ['mooc', 'massive open', 'coursera', 'edx']),
        ('M13.11', ['freelance', 'freelancer', 'web-freelance']),
    ],
    'M14': [
        ('M14.01', ["o'quv jarayonini rejalashtirish", 'rejalashtirish', 'dars ishlanmasi', 'yillik reja']),
        ('M14.02', ["ta'lim samaradorligi", 'samaradorlik', "ta'lim sifat"]),
        ('M14.03', ['baholash', "o'zlashtirishni baholash", 'qayta aloqa', 'feedback', 'formativ', 'summativ']),
        ('M14.04', ['tarbiyaviy faoliyat', 'tarbiyaviy ish', 'sinf soati']),
        ('M14.05', ['xavfsiz muhit', "rivojlantiruvchi muhit", "ta'lim muhiti", 'psixologik iqlim']),
        ('M14.06', ['kasbiy o\'sish', "o'z-o'zini rivojlantirish", "malaka oshirish", 'refleksiya', 'portfel']),
        ('M14.07', ['hamkorlik', 'ota-ona', "hamkasb", "metodik birlashma", "murabbiylik", 'mentor']),
    ],
    'M15': [
        ('M15.01', ['pedagogika', 'didaktika', 'yosh psixologiyasi', 'ta\'lim-tarbiya']),
        ('M15.02', ["ta'lim tamoyili", "onglilik", "ko'rgazmalilik", "tizimlilik", "ilmiylik"]),
        ('M15.03', ['tarbiya', 'tarbiya turi', "axloqiy tarbiya", "estetik tarbiya", "mehnat tarbiyasi"]),
        ('M15.04', ['dars turi', "darsni rejalashtirish", 'sinfni boshqarish', 'dars tuzilishi', 'classroom management']),
        ('M15.05', ['sinf rahbari', 'sinf hujjati', 'sinf jurnali', "shaxsiy ish varaqasi"]),
        ('M15.06', ['pedagogik etika', 'pedagogik nutq', 'pedagogik texnika', 'refleksiya', 'takt', 'odob']),
        ('M15.07', ['pedagogik qobiliyat', 'didaktik qobiliyat', 'akademik qobiliyat', 'kommunikativ qobiliyat', 'kreativ']),
        ('M15.08', ["ta'lim texnologiyasi", 'muammoli ta\'lim', 'loyiha', 'interfaol', 'inklyuziv', "differensial ta'lim"]),
    ],
    'M16': [
        ('M16.01', ["fan mazmuni", "o'qitish yondashuvi", "kompetensiyaviy yondashuv", "tizimli yondashuv"]),
        ('M16.02', ["o'qitish usuli", "o'qitish metodi", 'verbal', "ko'rgazmali", 'amaliy', 'reproduktiv', 'muammoli']),
        ('M16.03', ["ta'limiy vaziyat", 'pedagogik qaror', 'vaziyatni tahlil', 'qaror qabul qilish']),
    ],
}


# =========================================================================
# TITLE CLEANER
# =========================================================================

def _extract_meaningful_title(body: str, max_words: int = 8) -> str:
    """Lesson body dan birinchi mazmunli gapni sarlavha sifatida olish"""
    # Bo'sh qatorlardan keyingi birinchi gapni olish
    lines = body.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Raqamli ro'yxat yoki birikma bo'lmasin
        if re.match(r'^\d+[\.\)]', line):
            continue
        # Qisqa bo'lmasin
        words = line.split()
        if len(words) < 4:
            continue
        # Gap belgisi bilan tugasin
        line = re.sub(r'[.…!?:;،,].*$', '', line)
        words = line.split()[:max_words]
        if len(words) >= 3:
            result = ' '.join(words)
            if len(result) > 150:
                result = result[:147] + '...'
            return result.lower().capitalize()
    return ''


def clean_lesson_title(raw_title: str, topic_name: str, module_code: str, body: str = '') -> str:
    """
    Dars sarlavhasini tozalaydi.
    
    Kirish: "M02 - s. KOMPYUTERNING RIVOJLANISH TARIXI TAYANCH TUSHUNCHALAR..."
    Chiqish: "M02 - Kompyuterning rivojlanish tarixi"
    """
    # "MXX - " prefiksni olib tashlash
    title = re.sub(r'^M\d{2}\s*[-–—]\s*', '', raw_title).strip()
    
    # "Bob X" patterni - mazmunli sarlavha yaratish
    bob_match = re.match(r'^Bob\s+(\d+)', title, re.IGNORECASE)
    if bob_match:
        bob_num = bob_match.group(1)
        # Body dan mazmunli sarlavha olishga harakat qilish
        meaningful = _extract_meaningful_title(body) if body else ''
        if meaningful:
            return f"{module_code} - Bob {bob_num}: {meaningful}"
        # Fallback: Bob {modul_nomi}
        mod_name = MODUL_NOMLARI.get(module_code, '')
        return f"{module_code} - Bob {bob_num} ({mod_name})"
    
    # "s." yoki "S." prefiksni olib tashlash
    title = re.sub(r'^[sS]\.\s*', '', title).strip()
    
    # "S " prefiksini olib tashlash (ba'zi fayllarda)
    title = re.sub(r'^S\s+', '', title).strip()
    
    # TAYANCH TUSHUNCHALAR / KALIT SO'ZLAR / DIQQAT / MASLAHAT kabi 
    # kalit so'zlardan keyingi narsalarni olib tashlash
    title = re.split(r'TAYANCH TUSHUNCHALAR|KALIT SO\'Z|KALIT SOʻZ|DIQQAT|MASLAHAT|Yodda tuting', title)[0].strip()
    
    # Juda qisqa yoki ma'nosiz bo'lsa, mavzu nomini yoki bodyni ishlatish
    if len(title) <= 5 or len(title.split()) < 2:
        meaningful = _extract_meaningful_title(body) if body else ''
        if meaningful:
            return f"{module_code} - {meaningful}"
        return f"{module_code} - {topic_name}"
    
    # Ortiqcha belgilar va bo'shliqlarni tozalash
    title = re.sub(r'[.…]{2,}', ' ', title)
    title = re.sub(r'\s+', ' ', title)
    
    # Birinchi harfni katta qilish, qolganlarni kichik
    # (akronimlarni saqlab qolish: ASCII, CPU, HDD)
    if not title.lower().startswith('bob'):
        words = title.split()
        cleaned_words = []
        for w in words:
            if len(w) >= 2 and w.isupper():
                cleaned_words.append(w)  # Akronimni saqlash
            elif len(w) >= 2 and w.islower():
                cleaned_words.append(w.capitalize())
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
    
    # "slar.", "aja", "ni", "da", "ga" kabi fragmentlar
    if re.match(r'^(slar|aja|ni|da|ga|ka|bo)\b', clean, re.IGNORECASE):
        return True
    
    # 80% dan ko'pi kichik harf bo'lsa va sarlavha uzun bo'lsa (buzilgan matn)
    uppercase_count = sum(1 for c in clean if c.isupper())
    total_letters = sum(1 for c in clean if c.isalpha())
    if total_letters > 10 and uppercase_count / total_letters < 0.1:
        return True
    
    return False


# =========================================================================
# SUBTOPIC MATCHING
# =========================================================================

def find_subtopic_code(module_code: str, section_text: str, topic_key: str) -> str | None:
    """
    Lesson content/header dan subtopic_code ni topish.
    
    Qidirish tartibi:
    1. 📌 M06.01 kabi marker
    2. SUPTOPIC_KEYWORDS bo'yicha keyword matching
    """
    # 1. 📌 marker tekshirish
    marker_match = re.search(r'📌\s*(M\d{2}\.\d{2})', section_text)
    if marker_match:
        code = marker_match.group(1)
        mod = code.split('.')[0]
        if mod == module_code:
            return code
    
    # 2. Keyword matching (section header da qidiramiz)
    header = section_text[:1000].lower()  # Faqat boshlang'ich qism
    keywords = SUBTOPIC_KEYWORDS.get(module_code, [])
    
    best_match = None
    best_score = 0
    
    for sub_code, kw_list in keywords:
        score = 0
        for kw in kw_list:
            kw_lower = kw.lower()
            count = header.count(kw_lower)
            score += count * 2
            # Sarlavha yaqinida bo'lsa bonus
            if count > 0:
                pos = header.find(kw_lower)
                if pos < 200:
                    score += 1
        if score > best_score:
            best_score = score
            best_match = sub_code
    
    if best_score >= 2:
        return best_match
    
    return None


# =========================================================================
# PARSER
# =========================================================================

def clean_text(text: str) -> str:
    """Matnni tozalash"""
    text = re.sub(r'[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]', '', text)
    text = re.sub(r'📘\s*.+?(?:\n|$)', '', text)
    # 📌 markerlarni subtopic uchun saqlaymiz, lekin matndan olib tashlaymiz
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
        src_match = re.search(r'📘\s*(.+?\.[a-z]+\))', section)
        is_source_ref = bool(src_match)
        
        if is_source_ref and not re.search(r'(?:dars|bob|mavzu)', section[:200], re.IGNORECASE):
            if src_match:
                current_source = src_match.group(1).strip()
            continue
        
        # Subtopic code ni topish (📌 marker yoki keyword)
        subtopic_code = find_subtopic_code(module_code, section, topic_key)
        
        # Dars sarlavhasini qidirish
        title = None
        dm = dars_pattern.search(section)
        if dm:
            raw = dm.group(2).strip()
            # Body ni ham olib, clean_title ga yuboramiz
            body_text = clean_text(section)
            title = clean_lesson_title(f"{module_code} - {raw}", topic_title, module_code, body=body_text)
        
        if not title:
            bm = bob_pattern.search(section)
            if bm:
                body_text = clean_text(section)
                title = clean_lesson_title(f"{module_code} - Bob {bm.group(1)}", topic_title, module_code, body=body_text)
        
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
                        'subtopic_code': subtopic_code,
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
                'subtopic_code': subtopic_code,
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
                'subtopic_code': None,
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
    all_sources = {}
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
            sc = f" [{lesson.get('subtopic_code')}]" if lesson.get('subtopic_code') else ''
            print(f"   {i+1}. 📖 {lesson['title'][:70]}{sc}")
            print(f"      ({lesson['word_count']} so'z, ~{estimate_duration(lesson['word_count'])} min) [{src}]")
    
    # ─── JSON output ───────────────────────────────────────────────────
    json_data = [{
        'module_code': l['module_code'],
        'title': l['title'][:200],
        'body_length': len(l['body']),
        'word_count': l['word_count'],
        'estimated_minutes': estimate_duration(l['word_count']),
        'subtopic_code': l.get('subtopic_code'),
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
            
            subtopic_code = lesson.get('subtopic_code')
            if subtopic_code:
                # Specific subtopic_id ni topish
                subtopic_query = (
                    f"(SELECT id FROM public.subtopics "
                    f"WHERE module_id = (SELECT id FROM public.modules WHERE code = '{mod_code}' LIMIT 1) "
                    f"AND title LIKE '%' || (SELECT title FROM public.subtopics "
                    f"  WHERE module_id = (SELECT id FROM public.modules WHERE code = '{mod_code}' LIMIT 1) "
                    f"  ORDER BY ABS(sort_order - (SELECT sort_order FROM public.subtopics "
                    f"    WHERE id = (SELECT id FROM public.subtopics "
                    f"      WHERE module_id = (SELECT id FROM public.modules WHERE code = '{mod_code}' LIMIT 1) "
                    f"      ORDER BY sort_order LIMIT 1)) ) LIMIT 1) || '%' )"
                )
                # Simpler approach: match by subtopic code prefix in title
                subtopic_code_clean = subtopic_code.replace('.', '_')
                subtopic_query = (
                    f"(SELECT id FROM public.subtopics "
                    f"WHERE module_id = (SELECT id FROM public.modules WHERE code = '{mod_code}' LIMIT 1) "
                    f"ORDER BY sort_order LIMIT 1 OFFSET "
                    f"(SELECT CAST(SPLIT_PART('{subtopic_code}', '.', 2) AS INTEGER) - 1) )"
                )
                
                # Actually, the simplest approach: use subtopic's sort_order 
                # sort_order in the DB starts from 0 or 1
                # subtopic_code like "M06.03" → sort_order = 2 (0-indexed) or 3 (1-indexed)
                # Let's use a cleaner approach with COALESCE
                subtopic_query = (
                    f"COALESCE((SELECT id FROM public.subtopics "
                    f"WHERE module_id = (SELECT id FROM public.modules WHERE code = '{mod_code}' LIMIT 1) "
                    f"ORDER BY sort_order LIMIT 1 OFFSET {int(subtopic_code.split('.')[1]) - 1}), "
                    f"(SELECT id FROM public.subtopics "
                    f"WHERE module_id = (SELECT id FROM public.modules WHERE code = '{mod_code}' LIMIT 1) "
                    f"ORDER BY sort_order LIMIT 1))"
                )
            else:
                subtopic_query = 'NULL'
            
            # Lesson INSERT
            sql_parts.append(f'')
            sql_parts.append(f'  -- Dars {lesson_global_idx}: {lesson["title"][:70]}')
            if subtopic_code:
                sql_parts.append(f'  -- Subtopic: {subtopic_code}')
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
    sql_parts.append('  v_subtopic_filled INT;')
    sql_parts.append('BEGIN')
    sql_parts.append('  SELECT count(*) INTO v_total FROM public.lessons;')
    sql_parts.append('  SELECT count(*) INTO v_refs FROM public.source_references;')
    sql_parts.append('  SELECT count(*) INTO v_sources FROM public.sources;')
    sql_parts.append("  SELECT count(*) INTO v_subtopic_filled FROM public.lessons WHERE subtopic_id IS NOT NULL;")
    sql_parts.append(f"  RAISE NOTICE '─────────────────────────────────────────────';")
    sql_parts.append(f"  RAISE NOTICE '✅ Jami: % ta dars import qilindi', v_total;")
    sql_parts.append(f"  RAISE NOTICE '📚 Subtopic ga bog'langan: % ta', v_subtopic_filled;")
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
    subtopic_filled = sum(1 for l in all_lessons if l.get('subtopic_code'))
    
    print("\n" + "=" * 70)
    print("📊 IMPORT HISOBOTI")
    print("=" * 70)
    print(f"   Qayta ishlangan fayllar: {processed_files} / {len(topic_files)}")
    print(f"   Aniqlangan darslar: {len(all_lessons)} ta")
    print(f"   Subtopic ga bog'langan: {subtopic_filled} ta")
    print(f"   Noyob manbalar: {len(all_source_names)} ta")
    
    print(f"\n   Modullar bo'yicha:")
    for mod_code in sorted(modules_covered):
        count = len(lessons_by_module[mod_code])
        filled = sum(1 for l in lessons_by_module[mod_code] if l.get('subtopic_code'))
        print(f"     {mod_code} ({MODUL_NOMLARI.get(mod_code, '')}): {count} ta dars ({filled} ta bog'langan)")
    
    print(f"\n   Sarlavhalardan namunalar:")
    for l in all_lessons[:5]:
        sc = f" [{l.get('subtopic_code')}]" if l.get('subtopic_code') else ''
        print(f"     ✅ {l['title'][:80]}{sc}")
    if len(all_lessons) > 5:
        print(f"     ... va {len(all_lessons)-5} ta dars")
    
    print(f"\n📄 JSON: {json_path}")
    print(f"📄 SQL:  {migration_path}")
    print("=" * 70)


if __name__ == '__main__':
    main()
