#!/usr/bin/env python3
"""Generate TypeScript topicContent.ts M01 section from JSON."""
import json

SUBTOPIC_TITLES = {
    'M01.01': "Informatika, ma'lumot, axborot va bilim",
    'M01.02': "Axborot turlari, xossalari, manbalari va jarayonlari",
    'M01.03': "Axborot texnologiyalari va raqamli muhit",
    'M01.04': "Belgi, kod, kodlash va shifrlash",
    'M01.05': "Bit, bayt, axborot birliklari va Xartli formulasi",
    'M01.06': "Axborot hajmi, uzatish tezligi va aloqa kanali",
    'M01.07': "Matn, grafika, audio, videoni kodlash va siqish",
    'M01.08': "Mualliflik huquqi, litsenziya va raqamli etika",
    'M01.09': "Axborotni izlash, tekshirish va validatsiya",
}

# Hand-crafted test questions per subtopic (from LaTeX Ch1-19 content)
QUESTIONS = {
    'M01.01': [
        '{"id":"M01.01-q1","text":"Informatika atamasi qaysi tildan olingan?","options":["Ingliz","Fransuz","Nemis","Rus"],"correctIndex":1,"explanation":"Informatika fransuzcha «informatique» (information + automatique) so\'zidan olingan","type":"Y1"}',
        '{"id":"M01.01-q2","text":"Ma\'lumot va axborot o\'rtasidagi farqni belgilang.","options":["Ma\'lumot = axborot","Ma\'lumot — xom faktlar, axborot — kontekstli ma\'lumot","Axborot — xom faktlar, ma\'lumot — qayta ishlangan","Hech qanday farq yo\'q"],"correctIndex":1,"explanation":"Ma\'lumot (data) — xom faktlar, axborot (information) — kontekst va mazmunga ega ma\'lumot","type":"Y2"}',
        '{"id":"M01.01-q3","text":"Informatika tizimining uch tarkibiga nimalar kiradi?","options":["Monitor, klaviatura, sichqon","Texnik, dasturiy, insoniy ta\'minot","Word, Excel, PowerPoint","Internet, brauzer, server"],"correctIndex":1,"explanation":"Informatika tizimi: texnik (hardware), dasturiy (software) va insoniy (brainware) ta\'minot","type":"Y2"}',
        '{"id":"M01.01-q4","text":"Bilimlar bazasi deganda nima tushuniladi?","options":["Xom faktlar to\'plami","Inson tajribasi qo\'llangan axborot","Internetdagi barcha ma\'lumotlar","Kompyuter xotirasi"],"correctIndex":1,"explanation":"Bilimlar bazasi — inson tajribasi qo\'llangan, tahlil qilingan axborot","type":"Y1"}',
        '{"id":"M01.01-q5","text":"Klod Shennon nazariyasida axborot nima sifatida o\'lchanadi?","options":["Xabarning foydaliligi","Noaniqlikning kamayishi","Xabarning uzunligi","Xabarning haqiqatligi"],"correctIndex":1,"explanation":"Shennon nazariyasida axborot — natija haqidagi noaniqlikning kamayishi","type":"Y2"}',
        '{"id":"M01.01-q6","text":"Axborotga shennoncha yondashuvda 1 bit axborot nima?","options":["8 xil belgi","Ikki teng ehtimolli holatdan birini bilish","1 bayt ma\'lumot","Bitta harf"],"correctIndex":1,"explanation":"Ikki teng ehtimolli holatdan biri ma\'lum bo\'lishi 1 bit axborot beradi","type":"Y2"}',
        '{"id":"M01.01-q7","text":"Axborot va uni tashuvchi o\'rtasidagi farq nima?","options":["Ular aynan bir narsa","Axborot mazmun, tashuvchi esa uni saqlovchi muhit","Tashuvchi mazmun, axborot esa shakl","Farqi yo\'q"],"correctIndex":1,"explanation":"Axborot va uni tashuvchi aynan bir narsa emas. Bir matn qog\'ozda ham, SSDda ham saqlanishi mumkin","type":"Y2"}',
    ],
    'M01.02': [
        '{"id":"M01.02-q1","text":"Quyidagilardan qaysi biri axborot turi emas?","options":["Matnli","Grafik","Jismoniy","Video"],"correctIndex":2,"explanation":"Jismoniy axborot turi mavjud emas","type":"Y1"}',
        '{"id":"M01.02-q2","text":"Analog va diskret signalni farqlang.","options":["Sinonim","Analog — uzluksiz, diskret — uzlukli","Analog — raqamli, diskret — uzluksiz","Farqi yo\'q"],"correctIndex":1,"explanation":"Analog (uzluksiz) — tabiatdagi tovush, yorug\'lik; diskret (uzlukli) — kompyuterdagi ma\'lumot","type":"Y2"}',
        '{"id":"M01.02-q3","text":"Axborot sifatining asosiy xususiyati emas?","options":["To\'g\'rilik","Dolzarblik","Rangli bo\'lishi","To\'liqlik"],"correctIndex":2,"explanation":"Rangli bo\'lishi axborot sifati xususiyati emas","type":"Y1"}',
        '{"id":"M01.02-q4","text":"Bilvosita ma\'lumot manbai qanday ma\'lumot?","options":["To\'planish maqsadiga ko\'ra yig\'ilgan","Boshqa maqsadda yig\'ilgan ikkilamchi ma\'lumot","Faqat rasmlardan iborat","Jonli efir ma\'lumoti"],"correctIndex":1,"explanation":"Bilvosita (ikkilamchi) manba — boshqa maqsadda yig\'ilgan ma\'lumot","type":"Y1"}',
        '{"id":"M01.02-q5","text":"Statik va dinamik ma\'lumotni farqlang.","options":["Sinonim","Statik — qo\'lda tahrirlanadi, dinamik — avtomatik yangilanadi","Dinamik — qo\'lda tahrirlanadi","Farqi yo\'q"],"correctIndex":1,"explanation":"Statik ma\'lumot qo\'lda tahrirlanadi, dinamik esa manba o\'zgarishi bilan avtomatik yangilanadi","type":"Y2"}',
        '{"id":"M01.02-q6","text":"Internetdan olingan ma\'lumot avtomatik ikkilamchi hisoblanadimi?","options":["Ha","Yo\'q, tasnif foydalanish maqsadiga bog\'liq","Har doim birlamchi","Internetda ikkilamchi manba yo\'q"],"correctIndex":1,"explanation":"Tasnif foydalanish maqsadiga bog\'liq — meteorologik stansiya o\'z sensor natijasi uchun birlamchi","type":"Y2"}',
    ],
    'M01.03': [
        '{"id":"M01.03-q1","text":"AT va kompyuter o\'rtasidagi farq nima?","options":["Sinonim","Kompyuter — vosita, AT — usul va vositalar tizimi","AT — kompyuterning bir qismi","Farqi yo\'q"],"correctIndex":1,"explanation":"Axborot texnologiyasi = kompyuter degan tenglik noto\'g\'ri","type":"Y2"}',
        '{"id":"M01.03-q2","text":"Raqamli izning faol turiga misol?","options":["IP manzil","Cookie fayllari","Ijtimoiy tarmoqdagi post","Serverdagi kirish jurnali"],"correctIndex":2,"explanation":"Faol iz — foydalanuvchi ataylab joylashtirgan post yoki xabar","type":"Y2"}',
        '{"id":"M01.03-q3","text":"Axborot madaniyatining birinchi bosqichi nima?","options":["Qidirish","Baholash","Ehtiyojni aniq qo\'yish","Xulosa chiqarish"],"correctIndex":2,"explanation":"1) ehtiyojni aniq qo\'yish; 2) qidirish; 3) baholash; 4) saralash; 5) ulashish","type":"Y1"}',
        '{"id":"M01.03-q4","text":"Fakt va fikrni farqlang.","options":["Sinonim","Fakt — dalil bilan tekshirish mumkin, fikr — shaxsiy baho","Fikr — tekshiriladi, fakt — baho","Farqi yo\'q"],"correctIndex":1,"explanation":"Fakt: «fayl 8 MiB» (tekshirish mumkin). Fikr: «bu format eng qulay» (shaxsiy baho)","type":"Y2"}',
        '{"id":"M01.03-q5","text":"Raqamli axborotning afzalligi emas?","options":["Aniq nusxalash","Tez uzatish","Hech qachon eskirib qolmasligi","Avtomatik qayta ishlash"],"correctIndex":2,"explanation":"Raqamli axborot eskirgan tashuvchi sabab ochilmasligi mumkin","type":"Y2"}',
        '{"id":"M01.03-q6","text":"Xulosa nima?","options":["Fakt va qoida asosidagi natija","Shaxsiy baho","Xom fakt","Tasodifiy fikr"],"correctIndex":0,"explanation":"Xulosa — bir yoki bir necha fakt va qoida asosida chiqarilgan natija","type":"Y1"}',
    ],
    'M01.04': [
        '{"id":"M01.04-q1","text":"Kodlash nima?","options":["Axborotni o\'chirish","Axborotni bir ko\'rinishdan boshqasiga o\'tkazish","Axborotni nusxalash","Axborotni uzatish"],"correctIndex":1,"explanation":"Kodlash — axborotni qoida bo\'yicha kodga o\'tkazish","type":"Y1"}',
        '{"id":"M01.04-q2","text":"Kodlash, siqish va shifrlashni farqlang.","options":["Uchchalasi bir xil","Kodlash — format, siqish — hajm, shifrlash — maxfiylik","Siqish va shifrlash bir xil","Kodlash — maxfiylik"],"correctIndex":1,"explanation":"Kodlash — taqdim etish; siqish — hajm kamaytirish; shifrlash — maxfiylik","type":"Y2"}',
        '{"id":"M01.04-q3","text":"Prefiks kodga misol qaysi?","options":["0, 01, 10","0, 10, 110, 111","1, 11, 111","00, 001, 10"],"correctIndex":1,"explanation":"0, 10, 110, 111 — prefiks kod: hech bir kod so\'zi boshqasining bosh qismi emas","type":"Y2"}',
        '{"id":"M01.04-q4","text":"Sezar shifrida kalit nima?","options":["Alifbo","Siljish miqdori","Xabar uzunligi","Maxfiy so\'z"],"correctIndex":1,"explanation":"Sezar shifrida har bir harf bir xil miqdorga siljitiladi — bu siljish miqdori kalit","type":"Y2"}',
        '{"id":"M01.04-q5","text":"Simmetrik va asimmetrik shifrlashni farqlang.","options":["Sinonim","Simmetrik — bir kalit, asimmetrik — kalit jufti","Asimmetrik — bir kalit","Ikkalasi bir xil"],"correctIndex":1,"explanation":"Simmetrikda bir maxfiy kalit, asimmetrikda ochiq va yopiq kalit jufti","type":"Y2"}',
        '{"id":"M01.04-q6","text":"HTTPS qanday shifrlashdan foydalanadi?","options":["Faqat simmetrik","Faqat asimmetrik","Ikkalasini birlashtiradi","Hech qanday"],"correctIndex":2,"explanation":"HTTPS asimmetrik bilan kalit almashadi, keyin simmetrik bilan ma\'lumotni shifrlaydi","type":"Y2"}',
    ],
    'M01.05': [
        '{"id":"M01.05-q1","text":"Axborotning eng kichik o\'lchov birligi?","options":["Bayt","Bit","Kilobayt","Megabayt"],"correctIndex":1,"explanation":"Bit (binary digit) — eng kichik ikkilik birlik","type":"Y1"}',
        '{"id":"M01.05-q2","text":"Xartli formulasida N nimani bildiradi?","options":["Xabar uzunligi","Mumkin bo\'lgan holatlar soni","Vaqt","Tezlik"],"correctIndex":1,"explanation":"N=2^i da N — mumkin bo\'lgan holat yoki alifbo belgilari soni","type":"Y2"}',
        '{"id":"M01.05-q3","text":"65 xil holatni kodlash uchun necha bit kerak?","options":["5","6","7","8"],"correctIndex":2,"explanation":"2^6=64<65≤2^7=128, demak 7 bit","type":"Y2"}',
        '{"id":"M01.05-q4","text":"1 MiB bilan 1 MB farqi?","options":["Farqi yo\'q","1 MiB=1,048,576 B, 1 MB=1,000,000 B","1 MB katta","MiB — video, MB — audio"],"correctIndex":1,"explanation":"1 MiB = 2^20 = 1,048,576 B; 1 MB = 10^6 = 1,000,000 B. MiB katta","type":"Y2"}',
        '{"id":"M01.05-q5","text":"8 MiB xotira, 500 KiB fayl: nechta sig\'adi?","options":["16","17","8","32"],"correctIndex":0,"explanation":"8 MiB = 8192 KiB. 8192/500 = 16.384 → 16 ta to\'liq fayl","type":"Y2"}',
        '{"id":"M01.05-q6","text":"Belgilanishda b va B farqi?","options":["Sinonim","b=bit, B=bayt","b=bayt, B=bit","Farqsiz"],"correctIndex":1,"explanation":"b=bit, B=bayt. 8 Mb ≠ 1 MB","type":"Y1"}',
    ],
    'M01.06': [
        '{"id":"M01.06-q1","text":"Axborot uzatish tezligi birligi?","options":["Bayt/s","Bit/s","Metr/s","Gramm/s"],"correctIndex":1,"explanation":"Tezlik bit/s (bps) da o\'lchanadi","type":"Y1"}',
        '{"id":"M01.06-q2","text":"1 MB necha Mbit?","options":["1","8","10","1024"],"correctIndex":1,"explanation":"1 bayt = 8 bit, 1 MB = 8 Mbit","type":"Y2"}',
        '{"id":"M01.06-q3","text":"Bandwidth va throughput farqi?","options":["Sinonim","Bandwidth — nazariy, throughput — amaliy tezlik","Throughput — nazariy","Farqi yo\'q"],"correctIndex":1,"explanation":"Bandwidth — kanalning nazariy maksimal tezligi; throughput — amalda yetkazilgan","type":"Y2"}',
        '{"id":"M01.06-q4","text":"2400 Bd, 16 holat: bit/s?","options":["2400","4800","9600","19200"],"correctIndex":2,"explanation":"log2(16)=4. 2400×4=9600 bit/s","type":"Y2"}',
        '{"id":"M01.06-q5","text":"To\'liq dupleks rejimi?","options":["Faqat bir tomonga","Ikki tomonga navbat bilan","Ikki tomonga bir vaqtda","Hech qanday"],"correctIndex":2,"explanation":"To\'liq dupleks — ikki tomonga bir vaqtda (telefon)","type":"Y2"}',
        '{"id":"M01.06-q6","text":"Simplex aloqa misoli?","options":["Telefon","Ratsiya","Oddiy teleefir","Internet"],"correctIndex":2,"explanation":"Simplex — faqat bir tomonga (teleefir, radio eshittirish)","type":"Y1"}',
    ],
    'M01.07': [
        '{"id":"M01.07-q1","text":"ASCII standarti necha bitli?","options":["5","6","7","8"],"correctIndex":2,"explanation":"Asl ASCII 7 bitli, 2^7=128 kod (0..127)","type":"Y1"}',
        '{"id":"M01.07-q2","text":"Rastr va vektor grafikani farqlang.","options":["Rastr — obyekt, vektor — piksel","Rastr — piksel, vektor — geometrik obyekt","Ikkalasi bir","Vektor — foto"],"correctIndex":1,"explanation":"Rastr piksel, vektor geometrik obyekt saqlaydi","type":"Y2"}',
        '{"id":"M01.07-q3","text":"Audio hajm formulasi?","options":["I=en×bo\'y","I=f_s×d×c×t","I=m×v²","I=a×b×c"],"correctIndex":1,"explanation":"Audio hajmi = f_s × d × c × t","type":"Y2"}',
        '{"id":"M01.07-q4","text":"Konteyner va kodek farqi?","options":["Sinonim","Konteyner — tuzilma, kodek — algoritm","Kodek — konteyner turi","Konteyner — kodek qismi"],"correctIndex":1,"explanation":"Konteyner (MP4) — oqimlarni birlashtiruvchi; kodek (H.264) — kodlash algoritmi","type":"Y2"}',
        '{"id":"M01.07-q5","text":"Unicode va UTF-8 farqi?","options":["Sinonim","Unicode — kod nuqtasi, UTF-8 — baytlarga kodlash","UTF-8 — kod nuqtasi","Farqi yo\'q"],"correctIndex":1,"explanation":"Unicode kod nuqtasini belgilaydi, UTF-8 uni baytlarga kodlaydi","type":"Y2"}',
        '{"id":"M01.07-q6","text":"Yo\'qotishsiz siqishga misol?","options":["JPEG","MP3","PNG","MPEG"],"correctIndex":2,"explanation":"PNG — yo\'qotishsiz; JPEG/MP3 — yo\'qotishli","type":"Y1"}',
        '{"id":"M01.07-q7","text":"PPI va DPI farqi?","options":["Sinonim","PPI — piksel, DPI — bosma nuqtasi zichligi","DPI — piksel","Farqi yo\'q"],"correctIndex":1,"explanation":"PPI — piksel/inch (ekran), DPI — nuqta/inch (printer)","type":"Y2"}',
    ],
    'M01.08': [
        '{"id":"M01.08-q1","text":"Netiket nima?","options":["Internet tezligi","Internetda muloqot qoidalari","Kompyuter xavfsizligi","Dasturlash tili"],"correctIndex":1,"explanation":"Netiket — internetda muloqot qilishdagi axloqiy me\'yorlar","type":"Y1"}',
        '{"id":"M01.08-q2","text":"Plagiat va huquqbuzarlik farqi?","options":["Sinonim","Plagiat — o\'ziniki qilish, huquqbuzarlik — ruxsatsiz foydalanish","Plagiat — qonuniy","Farqi yo\'q"],"correctIndex":1,"explanation":"Plagiat — manbani yashirib o\'ziniki qilish; huquqbuzarlik — ruxsatsiz foydalanish","type":"Y2"}',
        '{"id":"M01.08-q3","text":"Creative Commons?","options":["Dasturlash tili","Litsenziyalar tizimi","Operatsion tizim","Brauzer"],"correctIndex":1,"explanation":"Creative Commons — 6 turdagi bepul litsenziyalar tizimi (+ CC0)","type":"Y1"}',
        '{"id":"M01.08-q4","text":"TASL tamoyili?","options":["Tez, Aniq, Samarali, Lo\'nda","Title, Author, Source, License","Tur, Aspekt, Sinf, Loyiha","Tartib, Asos, Sana"],"correctIndex":1,"explanation":"TASL — Title, Author, Source, License","type":"Y2"}',
        '{"id":"M01.08-q5","text":"Misinformatsiya va dezinformatsiya farqi?","options":["Sinonim","Misinformatsiya — ataylab emas, dezinformatsiya — ataylab yolg\'on","Dezinformatsiya — noto\'g\'ri","Farqi yo\'q"],"correctIndex":1,"explanation":"Misinformatsiya — noto\'g\'ri, lekin ataylab emas; dezinformatsiya — aldash niyatida","type":"Y2"}',
        '{"id":"M01.08-q6","text":"CC BY-SA litsenziyasi?","options":["O\'zgartirish mumkin emas","Ayni litsenziyada ulashish talabi","Faqat notijorat","Muallif ko\'rsatilmaydi"],"correctIndex":1,"explanation":"SA (ShareAlike) — hosila asarni ayni litsenziyada tarqatish talabi","type":"Y2"}',
        '{"id":"M01.08-q7","text":"Mualliflik huquqi nimani himoya qiladi?","options":["G\'oyani","Ifodalanish shaklini","Mavzuni","Nomi"],"correctIndex":1,"explanation":"Mualliflik huquqi g\'oyaning o\'zini emas, uning ijodiy ifodalanish shaklini himoya qiladi","type":"Y1"}',
    ],
    'M01.09': [
        '{"id":"M01.09-q1","text":"CRAAP testi nechta mezon?","options":["3","4","5","6"],"correctIndex":2,"explanation":"CRAAP — Currency, Relevance, Authority, Accuracy, Purpose","type":"Y1"}',
        '{"id":"M01.09-q2","text":"Validatsiya va verifikatsiya farqi?","options":["Sinonim","Validatsiya — qoidaga moslik, verifikatsiya — manbaga moslik","Verifikatsiya — qoidaga","Farqi yo\'q"],"correctIndex":1,"explanation":"Validatsiya — qiymat qoidaga mosmi; verifikatsiya — nusxa manbaga mosmi","type":"Y2"}',
        '{"id":"M01.09-q3","text":"Paritet biti nechta xatoni tuzatadi?","options":["Hech qanday","1 ta","2 ta","Hammasini"],"correctIndex":0,"explanation":"Paritet biti xatoni aniqlaydi, lekin tuzatmaydi","type":"Y2"}',
        '{"id":"M01.09-q4","text":"Autentifikatsiya nima?","options":["Qiymatni tekshirish","Shaxsni isbotlash","Ruxsat berish","Saralash"],"correctIndex":1,"explanation":"Autentifikatsiya — shaxsni isbotlash (parol, biometriya)","type":"Y2"}',
        '{"id":"M01.09-q5","text":"URL tarkibiga nima kiradi?","options":["Protokol","Protsessor","Monitor","Printer"],"correctIndex":0,"explanation":"URL: protocol://domain/path?query","type":"Y1"}',
        '{"id":"M01.09-q6","text":"Qidiruv tizimi ishlashining birinchi bosqichi?","options":["Indekslash","Crawler","Reyting","Natijani ko\'rsatish"],"correctIndex":1,"explanation":"1) Crawler sahifalarni topadi; 2) Indeks; 3) Reyting","type":"Y1"}',
        '{"id":"M01.09-q7","text":"Nazorat raqami nima?","options":["Tasodifiy son","Kiritish xatolarini aniqlaydigan belgi","Kalit so\'z","Parol"],"correctIndex":1,"explanation":"Nazorat raqami identifikatordan hisoblanib, xatoni aniqlaydi","type":"Y1"}',
    ],
}


def esc(s):
    """Escape a string for TypeScript."""
    return s.replace('\\', '\\\\').replace('"', '\\"')


def main():
    with open('scripts/m01_content.json', 'r', encoding='utf-8') as f:
        subtopics = json.load(f)
    
    lines = []
    lines.append('  // ========= M01: AXBOROT VA RAQAMLI SAVODXONLIK =========')
    lines.append('')
    lines.append('  // ╔══════════════════════════════════════════════════════════════════╗')
    lines.append('  // ║  M01 «Axborot va axborot jarayonlari» LaTeX darsligi asosida  ║')
    lines.append('  // ║  to\'liq qayta qurildi (19 bob, jami 685+ kontent blok)         ║')
    lines.append('  // ╚══════════════════════════════════════════════════════════════════╝')
    lines.append('')
    
    for code in ['M01.01', 'M01.02', 'M01.03', 'M01.04', 'M01.05', 'M01.06', 'M01.07', 'M01.08', 'M01.09']:
        title = SUBTOPIC_TITLES[code]
        blocks = subtopics.get(code, {}).get('theory', [])
        qs = QUESTIONS.get(code, [])
        
        lines.append(f'')
        lines.append(f'  // ═══════════════════════════════════════════════════════════════════')
        lines.append(f'  // {code} — LaTeX darsligi asosidagi to\'liq kontent')
        lines.append(f'  // ═══════════════════════════════════════════════════════════════════')
        lines.append(f'')
        lines.append(f'  "{code}": t("{code}", "{title}", [')
        
        # Theory blocks - deduplicate and limit
        seen = set()
        unique_blocks = []
        for b in blocks:
            key = b['content'][:60]
            if key not in seen and len(b['content']) > 30:
                seen.add(key)
                unique_blocks.append(b)
            if len(unique_blocks) >= 30:
                break
        
        for b in unique_blocks:
            content = b['content'].replace('"', "'")
            # Remove problematic characters
            content = content.replace('\\n', '\\\\n')
            lines.append(f'    {{ type: "{b["type"]}", content: "{content[:500]}" }},')
        
        lines.append(f'  ], [')
        
        for q in qs:
            lines.append(f'    {q},')
        
        lines.append(f'  ]),')
    
    ts = '\n'.join(lines)
    
    with open('scripts/m01_ts_output.txt', 'w', encoding='utf-8') as f:
        f.write(ts)
    
    print(f"Generated {len(ts)} chars of TypeScript")
    print(f"Total blocks: {sum(len(subtopics[k]['theory']) for k in subtopics)}")
    print(f"Total questions: {sum(len(QUESTIONS[k]) for k in QUESTIONS)}")
    print("Saved to scripts/m01_ts_output.txt")


if __name__ == '__main__':
    main()
