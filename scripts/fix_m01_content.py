#!/usr/bin/env python3
"""
M01 content & question fixer — v2 (targeted replacements)
"""
import re

with open('src/data/topicContent.ts', 'r') as f:
    ts = f.read()

subtopics = ['M01.01','M01.02','M01.03','M01.04','M01.05','M01.06','M01.07','M01.08','M01.09','M01.10','M01.11']

def get_subtopic_range(text, sid, all_sids):
    """Get (start, end) positions of a subtopic block"""
    pat = f'"{sid}": t('
    idx = text.find(pat)
    if idx < 0:
        return None
    # Find next subtopic or end
    next_idx = len(text)
    for nsid in all_sids:
        if nsid <= sid: continue
        ni = text.find(f'"{nsid}": t(', idx + 10)
        if 0 < ni < next_idx:
            next_idx = ni
    return (idx, next_idx)

def get_subtopic_block(text, sid, all_sids):
    r = get_subtopic_range(text, sid, all_sids)
    if r: return text[r[0]:r[1]]
    return None

# =====================================================================
# 1. ADD MISSING CONTENT
# =====================================================================

# --- M01.01: Add "uch tarkibi" content ---
# Find M01.01 questions start and insert before it
m01_01_block = get_subtopic_block(ts, 'M01.01', subtopics)
m01_01_q_start = ts.find('{ id: "M01.01-q1"', ts.find('"M01.01": t('))
# Insert before questions
insert_point = ts.rfind('  ],', 0, m01_01_q_start)

m01_01_insert = '''    { type: "definition", content: "Informatika tizimining uch tarkibi: texnik ta'minot\\n(hardware — kompyuter va qurilmalar), dasturiy ta'minot\\n(software — operatsion tizim, ilovalar) va ijtimoiy ta'minot\\n(brainware — foydalanuvchi va mutaxassislar)." },
    { type: "example", content: "\\\"Kompyuter sotib olindi, endi hamma masala yechiladi\\\" degan fikr\\nnimani e'tiborsiz qoldiradi? Dasturiy ta'minot o'rnatilmagan bo'lsa,\\nkompyuter ishlamaydi. Dastur bo'lsa ham, foydalanuvchi undan\\nfoydalana olmasa, tizim maqsadiga yetmaydi." },
'''
ts = ts[:insert_point] + '  ],' + ts[insert_point+5:]
ts = ts[:insert_point] + m01_01_insert + ts[insert_point:]

# --- M01.02: Add axborot sifati ---
# Find where M01.02 questions start
m01_02_q_start = ts.find('{ id: "M01.02-q1"', ts.find('"M01.02": t('))
insert_point = ts.rfind('  ],', 0, m01_02_q_start)

m01_02_insert = '''    { type: "definition", content: "Axborot sifati — axborotning foydalanish vazifasiga moslik\\ndarajasini belgilovchi xossalar majmui. Asosiy xossalar: aniqlik/to'g'rilik,\\nishonchlilik, dolzarblik, o'z vaqtidalik, to'liqlik, tafsilot darajasi,\\ntushunarlilik, foydalilik/qimmatlilik, obyektivlik va mavjudlik." },
    { type: "table", content: "| Aniqlik / to'g'rilik | Fakt va qiymatlar xatosizmi? |\\n| Ishonchlilik | Manba va dalilga ishonish mumkinmi? |\\n| Dolzarblik | Maqsadga aynan shu ma'lumot kerakmi? |\\n| O'z vaqtidalik | Axborot eskirmaganmi? |\\n| To'liqlik | Qaror uchun zarur qismlar bormi? |\\n| Tafsilot darajasi | Tafsilot kam ham, ortiqcha ham emasmi? |\\n| Tushunarlilik | Qabul qiluvchi til va belgilarni tushunadimi? |\\n| Foydalilik / qimmatlilik | Axborot qaror yoki ishga xizmat qiladimi? |\\n| Obyektivlik | Fakt fikr va manfaatdan ajratilganmi? |\\n| Mavjudlik | Ruxsatli foydalanuvchi vaqtida oladimi? |" },
    { type: "note", content: "Axborot sifati bitta xossa bilan emas, foydalanish vazifasiga mos\\nxossalar majmui bilan baholanadi. Ishonchli manba eski ma'lumotni berishi\\nmumkin. Dolzarb axborot ishonchsiz manbadan kelishi mumkin. To'liq\\naxborot noto'g'ri bo'lishi mumkin." },
'''
ts = ts[:insert_point] + '  ],' + ts[insert_point+5:]
ts = ts[:insert_point] + m01_02_insert + ts[insert_point:]

# --- M01.04: Add raqamli savodxonlik ---
old_m01_04_q = '''  ], [
    // Questions TBD'''
new_m01_04_q = '''  ], [
    { type: "definition", content: "Raqamli savodxonlik — axborot ehtiyojini aniqlash, uni samarali\\nqidirish, tanqidiy baholash, qayta ishlash, qonuniy va axloqiy qo'llash\\nhamda xavfsiz ulashish qobiliyatlari majmui." },
    { type: "text", content: "Raqamli savodxonlik — faqat dastur tugmalarini bilish emas. Axborot\\nehtiyojini aniqlash, manbani tekshirish, xulosa qilish, mualliflikka rioya\\netish va maxfiylikni saqlash uning ajralmas qismlaridir." },
    { type: "example", content: "Niyatni dalilsiz aniqlash qiyin. Test vaziyatida \\\"ataylab\\\" so'zi\\ndezinformatsiyani, \\\"xato tarqaldi\\\" esa misinformatsiyani ajratadi." },
    // Questions TBD'''
ts = ts.replace(old_m01_04_q, new_m01_04_q)

# --- M01.09: Add URL/protokol ---
m01_09_q_start = ts.find('{ id: "M01.09-q1"', ts.find('"M01.09": t('))
insert_point = ts.rfind('  ],', 0, m01_09_q_start)
m01_09_insert = '''    { type: "definition", content: "URL (Uniform Resource Locator) — resursning global manzili bo'lib,\\nprotokol, domen nomi va yo'ldan iborat.\\nMasalan: https://example.uz/kurs/axborot (https — protokol,\\nexample.uz — domen, /kurs/axborot — yo'l)." },
    { type: "definition", content: "Internet — o'zaro bog'langan tarmoqlar global tizimi. WWW — Internet\\norgali olinadigan veb-sahifalar xizmati. Brauzer — veb-resursni ko'rsatuvchi\\ndastur. Qidiruv tizimi — sahifalarni indekslab natijalarni tartibli ko'rsatadi." },
    { type: "note", content: "Google qidiruv tizimi; Chrome brauzer. Internet bilan WWW aynan bir\\nnarsa emas. HTTPS transportni va sertifikatlangan domen bilan aloqani\\nhimoyalaydi, mazmun haqiqatini emas." },
    { type: "example", content: "Natijaning birinchi bo'lishi \\\"eng to'g'ri\\\" degani emas. Reyting so'rovga\\nmoslik va ko'plab texnik/tijoriy signallarni hisoblaydi." },
'''
ts = ts[:insert_point] + '  ],' + ts[insert_point+5:]
ts = ts[:insert_point] + m01_09_insert + ts[insert_point:]

# --- M01.11: Add diagnostika/Ch19 content ---
old_m01_11 = '''  ], [
    // Questions TBD
  ]),\n\n  "M02.01"'''
new_m01_11 = '''  ], [
    { type: "definition", content: "Diagnostika (chalg'ituvchi gaplarni aniqlash) — attestatsiyada tez-tez\\nuchraydigan nozik farqlarni bir jumlada ajratish qobiliyati." },
    { type: "table", content: "| Ma'lumot — axborot | Kontekst va mazmun olgan ma'lumot = axborot |\\n| Kodlash — shifrlash | Kodlash formatlaydi, shifrlash maxfiylashtiradi |\\n| Kodlash — siqish | Siqish maqsadi hajmni kamaytirish |\\n| Bit — bayt | 1 bayt = 8 bit |\\n| ASCII — Unicode | ASCII kichik repertuar, Unicode global |\\n| Unicode — UTF-8 | Unicode kod nuqtasi, UTF-8 baytlarga kodlaydi |\\n| Rastr — vektor | Rastr piksellar, vektor geometriya |\\n| Validatsiya — verifikatsiya | Qoidaga moslik va manbaga moslik |\\n| Autentifikatsiya — avtorizatsiya | Kimligini tekshirish va ruxsatini belgilash |" },
    { type: "note", content: "50/50 natija ko'p faktni yodlashdan ko'ra, bir-biriga yaqin tushunchani\\nbitta farqlovchi mezon bilan ajratishga tayanadi. Savolni formula yoki\\natamaga emas, avval vaziyat modeliga bog'lang." },
    { type: "example", content: "Chalg'ituvchi gaplar: \\\"Har bir Unicode belgisi 2 bayt\\\" — noto'g'ri;\\nko'p kod nuqtasi UTF-16da 2 bayt, UTF-8da 1-4 bayt.\\n\\\"1 KB har doim 1024 bayt\\\" — noto'g'ri; 1 kB = 1000 B, 1 KiB = 1024 B." },
    // Questions TBD
  ]),\n\n  "M02.01"'''
ts = ts.replace(old_m01_11, new_m01_11)

# --- Fix M01.04 title ---
ts = ts.replace(
    '"M01.04": t("M01.04", "AT, raqamli muhit va madaniyat",',
    '"M01.04": t("M01.04", "AT, raqamli muhit va raqamli savodxonlik",'
)

# =====================================================================
# 2. FIX QUESTION IDs (targeted by subtopic)
# =====================================================================

# Only fix IDs where the old ID prefix doesn't match the subtopic they're IN
# Old M01.04 questions → now in M01.05 subtopic, change to M01.05-qN
r = get_subtopic_range(ts, 'M01.05', subtopics)
if r:
    m01_05_start, m01_05_end = r
    # This subtopic has old M01.04-qN → change to M01.05-qN
    ts = ts[:m01_05_start] + re.sub(r'id: "M01\.04-(q\d+)"', r'id: "M01.05-\1"', ts[m01_05_start:m01_05_end]) + ts[m01_05_end:]

# Old M01.05 questions → now in M01.06 subtopic, change to M01.06-qN
r = get_subtopic_range(ts, 'M01.06', subtopics)
if r:
    s, e = r
    ts = ts[:s] + re.sub(r'id: "M01\.05-(q\d+)"', r'id: "M01.06-\1"', ts[s:e]) + ts[e:]

# Old M01.06 questions → now in M01.08 subtopic, change to M01.08-qN
r = get_subtopic_range(ts, 'M01.08', subtopics)
if r:
    s, e = r
    ts = ts[:s] + re.sub(r'id: "M01\.06-(q\d+)"', r'id: "M01.08-\1"', ts[s:e]) + ts[e:]

# Old M01.08 questions → now in M01.10 subtopic, change to M01.10-qN
r = get_subtopic_range(ts, 'M01.10', subtopics)
if r:
    s, e = r
    ts = ts[:s] + re.sub(r'id: "M01\.08-(q\d+)"', r'id: "M01.10-\1"', ts[s:e]) + ts[e:]

# =====================================================================
# 3. ADD NEW QUESTIONS
# =====================================================================

# M01.04 questions
m01_04_questions = '''    { id: "M01.04-q1", text: "Raqamli izning faol turiga qaysi misol kiradi?", options: ["IP manzil", "Cookie fayllari", "Ijtimoiy tarmoqdagi post", "Kirish jurnali"], correctIndex: 2, explanation: "Faol iz — foydalanuvchi ataylab joylashtirgan (post), passiv iz — tizim qayd etgan (IP, cookie)", type: "Y2" },
    { id: "M01.04-q2", text: "Axborot texnologiyasi (AT) va kompyuter o'rtasidagi farq nima?", options: ["Sinonim", "Kompyuter — vosita, AT — usullar va vositalar tizimi", "AT — kompyuter qismi", "Farqi yo'q"], correctIndex: 1, explanation: "AT = kompyuter degan tenglik notog'ri. Kompyuter — vosita; AT — usul, dastur, qurilma va inson faoliyatining tizimi", type: "Y2" },
    { id: "M01.04-q3", text: "Axborot madaniyatining birinchi bosqichi nima?", options: ["Qidirish", "Baholash", "Ehtiyojni aniq qo'yish", "Xulosa chiqarish"], correctIndex: 2, explanation: "Axborot madaniyati: 1) ehtiyoj 2) qidirish 3) baholash 4) saralash 5) ulashish", type: "Y1" },
    { id: "M01.04-q4", text: "Fakt va fikrni farqlang.", options: ["Sinonim", "Fakt — dalil bilan tekshirish mumkin, fikr — shaxsiy baho", "Fikr — tekshiriladi, fakt — baho", "Farqi yo'q"], correctIndex: 1, explanation: "Fakt: 'fayl 8 MiB'; fikr: 'bu format eng qulay'", type: "Y2" },
    { id: "M01.04-q5", text: "Raqamli axborotning afzalligi emas?", options: ["Aniq nusxalash", "Tez uzatish", "Hech qachon eskimaydi", "Avtomatik qayta ishlash"], correctIndex: 2, explanation: "Raqamli axborot eskirgan tashuvchi sabab ochilmasligi mumkin", type: "Y2" },
    { id: "M01.04-q6", text: "Axborotlashgan jamiyatning belgisi?", options: ["Yozma hujjatlar", "Raqamli xizmatlar va elektron hujjatlar", "Faqat telefon aloqasi", "Qo'lda hisob-kitob"], correctIndex: 1, explanation: "Raqamli xizmatlar, elektron hujjatlar, tarmoqli aloqa — axborotlashgan jamiyat belgilari", type: "Y1" },
'''

# Insert in M01.04 subtopic after // Questions TBD
r = get_subtopic_range(ts, 'M01.04', subtopics)
if r:
    s, e = r
    block = ts[s:e]
    block = block.replace('// Questions TBD', m01_04_questions + '    // Questions TBD', 1)
    ts = ts[:s] + block + ts[e:]

# M01.11 questions
m01_11_questions = '''    { id: "M01.11-q1", text: "Validatsiya va verifikatsiya o'rtasidagi farq nima?", options: ["Sinonim", "Validatsiya — qoidaga moslik, verifikatsiya — manbaga moslik", "Verifikatsiya — qoidaga moslik, validatsiya — manbaga moslik", "Farqi yo'q"], correctIndex: 1, explanation: "Validatsiya: 'ma'lumot formatga mosmi?'; verifikatsiya: 'ma'lumot asl manbaga muvofiqmi?'", type: "Y2" },
    { id: "M01.11-q2", text: "Paritet biti nima maqsadda ishlatiladi?", options: ["Ma'lumotni siqish", "Uzatish xatosini aniqlash", "Ma'lumotni shifrlash", "Rang chuqurligini oshirish"], correctIndex: 1, explanation: "Paritet biti — uzatishdagi yagona bit xatosini aniqlash uchun qo'shiladigan tekshiruv biti", type: "Y1" },
    { id: "M01.11-q3", text: "Diapazon tekshiruvi va cheklov tekshiruvi o'rtasidagi farq?", options: ["Sinonim", "Diapazon — qiymat oralig'ini, cheklov — ma'lum qoidani tekshiradi", "Cheklov — oraligni, diapazon — qoidani tekshiradi", "Farqi yo'q"], correctIndex: 1, explanation: "Diapazon: 'yosh 0..150 orasidami?'; cheklov: 'tug'ilgan sana kelajakdami?'", type: "Y2" },
    { id: "M01.11-q4", text: "Kodlash va shifrlashni farqlovchi asosiy mezon nima?", options: ["Ikkalasi bir xil", "Kodlash formatlaydi, shifrlash maxfiylashtiradi", "Shifrlash formatlaydi, kodlash maxfiylashtiradi", "Kodlash faqat audio uchun"], correctIndex: 1, explanation: "Kodlash formatni o'zgartiradi (ASCII, UTF-8), shifrlash kalit bilan himoyalaydi (AES, RSA)", type: "Y2" },
    { id: "M01.11-q5", text: "Autentifikatsiya va avtorizatsiya farqini belgilang.", options: ["Sinonim", "Autentifikatsiya — kimligini tekshirish, avtorizatsiya — ruxsatini belgilash", "Avtorizatsiya — kimligini tekshirish, autentifikatsiya — ruxsatini belgilash", "Ikkalasi ham parolni tekshiradi"], correctIndex: 1, explanation: "Autentifikatsiya: 'parol to'g'rimi?'; avtorizatsiya: 'foydalanuvchi bu faylni o'qiy oladimi?'", type: "Y2" },
'''

# Insert in M01.11 subtopic after // Questions TBD
r = get_subtopic_range(ts, 'M01.11', subtopics)
if r:
    s, e = r
    block = ts[s:e]
    block = block.replace('// Questions TBD', m01_11_questions + '    // Questions TBD', 1)
    ts = ts[:s] + block + ts[e:]

# =====================================================================
# 4. WRITE & VERIFY
# =====================================================================
with open('src/data/topicContent.ts', 'w') as f:
    f.write(ts)

# Verify
m01_start = ts.find('"M01.01"')
m02_start = ts.find('"M02.01"', m01_start)
m01 = ts[m01_start:m02_start]

total_questions = len(re.findall(r'id: "(M01\.[0-9]+-q[0-9]+)"', m01))
total_blocks = len(re.findall(r'type: "(\w+)"', m01))

print(f"✅ Fiks qilingan!")
print(f"   Jami bloklar: {total_blocks}")
print(f"   Jami savollar: {total_questions}")

print(f"\n📊 Savollar tarqalishi:")
all_ok = True
for sid in subtopics:
    r = get_subtopic_range(ts, sid, subtopics)
    if not r: continue
    block = ts[r[0]:r[1]]
    qs = re.findall(r'id: "(M01\.[0-9]+-q[0-9]+)"', block)
    mismatches = [q for q in qs if '.'.join(q.split('.')[:2]) != sid]
    if mismatches:
        all_ok = False
        print(f"   ❌ {sid}: {len(qs)} savol - noto'g'ri ID: {', '.join(mismatches[:3])}")
    else:
        print(f"   ✅ {sid}: {len(qs)} savol")

# Check key content
content_checks = [
    ('M01.01', ['texnik', 'dasturiy', 'mantiqiy']),
    ('M01.02', ['ishonchlilik', 'dolzarblik', "to'liqlik"]),
    ('M01.04', ['raqamli', 'savodxonlik']),
    ('M01.09', ['URL', 'protokol']),
    ('M01.11', ['diagnostika', "chalg'ituvchi"]),
]
print(f"\n📊 Kontent qamrovi:")
for sid, keywords in content_checks:
    r = get_subtopic_range(ts, sid, subtopics)
    if not r:
        print(f"   ❌ {sid}: subtopic topilmadi!")
        continue
    block = ts[r[0]:r[1]]
    missing = [kw for kw in keywords if kw.lower() not in block.lower()]
    if missing:
        print(f"   ⚠️ {sid}: {missing}")
    else:
        print(f"   ✅ {sid}: barcha {len(keywords)} kalit so'z mavjud")

if all_ok:
    print(f"\n🎉 Barcha savol ID'lari to'g'ri!")
