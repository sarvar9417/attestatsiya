#!/usr/bin/env python3
"""
M01 (Axborot va raqamli savodxonlik) seksiyasini «Axborot va axborot 
jarayonlari» LaTeX darsligi asosida to'liq qayta qurish.
"""

import re, sys

def main():
    filepath = "src/data/topicContent.ts"
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    m01_start = "  // ========= M01: AXBOROT VA RAQAMLI SAVODXONLIK ========="
    m02_start = "  // ========= M02: KOMPYUTER TIZIMLARI VA DASTURIY MUHIT ========="

    pos_m01 = content.find(m01_start)
    pos_m02 = content.find(m02_start)

    if pos_m01 == -1 or pos_m02 == -1:
        print("ERROR: Markers not found")
        sys.exit(1)

    old_m01 = content[pos_m01:pos_m02]
    new_content = content[:pos_m01] + ENRICHED_M01 + content[pos_m02:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ M01 rebuild complete ({len(ENRICHED_M01)} chars)")


ENRICHED_M01 = r"""  // ========= M01: AXBOROT VA RAQAMLI SAVODXONLIK =========

  // ╔══════════════════════════════════════════════════════════════════╗
  // ║  M01 «Axborot va axborot jarayonlari» LaTeX darsligi asosida  ║
  // ║  to'liq qayta qurildi (19 bob, 58 konsept, 2842 PDF sahifa)    ║
  // ╚══════════════════════════════════════════════════════════════════╝

  // ═══════════════════════════════════════════════════════════════════
  // M01.01 — 1-Bob: Informatika, ma'lumot, axborot va bilim
  // Manba: ICT5 10-24; ICT7 4-8; CAM1011 10-13; MAR 22-23
  // ═══════════════════════════════════════════════════════════════════

  "M01.01": t("M01.01", "Informatika, axborot, ma'lumot va bilim", [
    { type: "definition", content: "«Informatika» — axborotni izlash, yig'ish, saqlash, qayta ishlash, uzatish, himoyalash va undan foydalanish usullari hamda bu jarayonlarni amalga oshiruvchi kompyuter va kommunikatsiya vositalarini o'rganuvchi fan. Atama fransuzcha «informatique» (information + automatique) so'zidan olingan; AQSHda «computer science», Yevropada «informatics» deb yuritiladi." },
    { type: "definition", content: "«Ma'lumot» (data) — hali talqin qilinmagan yoki muayyan vaziyatga bog'lanmagan raqam, belgi, tovush, tasvir va kuzatuvlar. «Axborot» (information) — kontekst va mazmun berilib, qabul qiluvchi uchun ma'no kasb etgan ma'lumot. «Bilim» (knowledge) — axborotning tajriba, qoida va avvalgi tushunchalar bilan bog'lanib, xulosa chiqarish yoki harakat qilishga xizmat qiladigan o'zlashtirilgan shakli." },
    { type: "table", content: "| Tushuncha | Ta'rifi | Misol |\n|----------|--------|------|\n| Ma'lumot (Data) | Xom faktlar, raqamlar, belgilar | 38, @bbcclick, P952BR |\n| Axborot (Information) | Kontekst va mazmunga ega ma'lumot | \"Harorat 38°C — isitma bor\" |\n| Bilim (Knowledge) | Tajriba asosidagi tushuncha | Virus tufayli harorat ko'tarilgan |\n| Axborotli jarayon | Axborot bilan bajariladigan amallar | Izlash, saqlash, uzatish, qayta ishlash |" },
    { type: "definition", content: "Informatika tizimining uch tarkibi: «Texnik ta'minot» (hardware) — kompyuter, aloqa va tashqi qurilmalar; «Dasturiy ta'minot» (software) — operatsion tizim, dastur va algoritmik vositalar; «Insoniy ta'minot» (brainware) — tizimni loyihalovchi, boshqaruvchi va undan foydalanuvchi insonlar, ularning bilim hamda qoidalari. Brainware kompyuterning protsessori emas, balki axborot tizimida ishtirok etuvchi insonlar va ularning kompetensiyasidir." },
    { type: "text", content: "«Bilimlar bazasi»ning ikki ma'nosi: 1) Inson nuqtayi nazaridan — tajriba va o'rganish orqali shakllangan faktlar hamda qoidalar majmui. 2) Axborot tizimida — ekspert tizimi xulosa chiqarishi uchun saqlangan faktlar, tushunchalar va «agar — u holda» qoidalari majmui. Ma'lumotlar bazasi ko'proq yozuv va maydonlarni tartibli saqlaydi; bilimlar bazasi esa faktlar orasidagi mantiqiy munosabat va qoidalarni ham ifodalaydi." },
    { type: "text", content: "Axborotning mohiyatiga to'rt yondashuv: 1) «Hissiy-idrokiy» — borliqdagi narsa va hodisalarning sezgi a'zolari orqali ongda aks etishi. 2) «Mazmuniy» — xabarni qabul qilish natijasida inson ongida hosil bo'lgan ma'no. 3) «Kibernetik» — boshqaruv tizimining tashqi muhitga moslashishi va qaror qabul qilishi uchun foydalaniladigan mazmun. 4) «Shennoncha» — natija haqidagi noaniqlikning kamayishi. Teng ehtimolli ikki holatdan bittasi ma'lum bo'lishi 1 bit axborot beradi." },
    { type: "definition", content: "«Obyekt» — biz o'rganayotgan narsa, hodisa, jarayon yoki shaxs. «Axborot obyekti» — axborotni ifodalovchi matn, rasm, jadval, tovush yozuvi, model va shu kabilar. «Xabar» — axborotni jo'natuvchidan qabul qiluvchiga yetkazish uchun tuzilgan belgilar, tovushlar, tasvirlar yoki signallar ketma-ketligi. «Signal» — axborotni kanal bo'ylab tashuvchi fizik jarayon (elektr kuchlanishi, yorug'lik impulsi, radioto'lqin). «Axborot tashuvchi» — axborot saqlanadigan moddiy muhit (qog'oz, disk, flesh-xotira)." },
    { type: "example", content: "Ma'lumot → Axborot → Bilim zanjiri:\n• P952BR (ma'lumot) → mahsulot kodi (kontekst) → «Ugra konservasining mahsulot kodi» (axborot)\n• 42 (ma'lumot) → harorat, o'lcham yoki test natijasi bo'lishi mumkin → kontekstga bog'liq\n• «Shahzoda Salmon 2012-yil 18-iyunda valiahd shahzoda etib tayinlandi» (axborot)\n• «Uning 2 yildan beri valiahd shahzoda ekanini bilish» (bilim)" },
    { type: "note", content: "Informatika faqat kompyuter yoki dasturlash emas — axborot jarayonlarining butun tizimidir. Inson axborotni ko'rish, eshitish, hid bilish, ta'm bilish va teri orqali qabul qiladi. Kompyuter esa sensor va kiritish qurilmalari orqali fizik signalni o'lchab, raqamli kodga aylantiradi. O'zbekistonda informatika fani 1970-yillarda V.Q.Qobulov tashabbusi bilan rivojlana boshlagan." },
  ], [
    { id: "M01.01-q1", text: "Informatika atamasi qaysi tildan olingan?", options: ["Ingliz", "Fransuz", "Nemis", "Rus"], correctIndex: 1, explanation: "Informatika fransuzcha \"informatique\" (information + automatique) so'zidan olingan", type: "Y1" },
    { id: "M01.01-q2", text: "Ma'lumot va axborot o'rtasidagi farqni belgilang.", options: ["Ma'lumot = axborot", "Ma'lumot — xom faktlar, axborot — kontekstli ma'lumot", "Axborot — xom faktlar, ma'lumot — qayta ishlangan", "Hech qanday farq yo'q"], correctIndex: 1, explanation: "Ma'lumot (data) — xom faktlar, axborot (information) — kontekst va mazmunga ega ma'lumot", type: "Y2" },
    { id: "M01.01-q3", text: "Informatika tizimining uch tarkibiga nimalar kiradi?", options: ["Monitor, klaviatura, sichqon", "Texnik, dasturiy, insoniy ta'minot", "Word, Excel, PowerPoint", "Internet, brauzer, server"], correctIndex: 1, explanation: "Informatika tizimi: texnik (hardware), dasturiy (software) va insoniy (brainware) ta'minot", type: "Y2" },
    { id: "M01.01-q4", text: "Bilimlar bazasi deganda nima tushuniladi?", options: ["Xom faktlar to'plami", "Inson tajribasi qo'llangan axborot", "Internetdagi barcha ma'lumotlar", "Kompyuter xotirasi"], correctIndex: 1, explanation: "Bilimlar bazasi — inson tajribasi qo'llangan, tahlil qilingan axborot", type: "Y1" },
    { id: "M01.01-q5", text: "Klod Shennon nazariyasida axborot nima sifatida o'lchanadi?", options: ["Xabarning foydaliligi", "Noaniqlikning kamayishi", "Xabarning uzunligi", "Xabarning haqiqatligi"], correctIndex: 1, explanation: "Shennon nazariyasida axborot — natija haqidagi noaniqlikning kamayishi", type: "Y2" },
    { id: "M01.01-q6", text: "Axborot va uni tashuvchi o'rtasidagi farqni izohlang.", options: ["Ular aynan bir narsa", "Axborot mazmun, tashuvchi esa uni saqlovchi moddiy muhit", "Tashuvchi mazmun, axborot esa shakl", "Farqi yo'q"], correctIndex: 1, explanation: "Axborot va uni tashuvchi aynan bir narsa emas. Bir matn qog'ozda ham, SSDda ham saqlanishi mumkin", type: "Y2" },
    { id: "M01.01-q7", text: "Axborotga shennoncha yondashuvda 1 bit axborot nima?", options: ["8 xil belgi", "Ikki teng ehtimolli holatdan birini bilish", "1 bayt ma'lumot", "Bitta harf"], correctIndex: 1, explanation: "Shennoncha yondashuvda ikki teng ehtimolli holatdan biri ma'lum bo'lishi 1 bit axborot beradi", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.02 — 2-Bob + 3-Bob: Axborotning xossalari, turlari, manbalari
  // Manba: ICT5 13-16; ICT7 4-8; CAM1011 12-17; MAR 22-27
  // ═══════════════════════════════════════════════════════════════════

  "M01.02": t("M01.02", "Axborot turlari, xossalari, manbalari va jarayonlari", [
    { type: "definition", content: "«Axborot turlari» — axborotning ifodalanish shakliga ko'ra turlanishi: «matnli» (harf, raqam, tinish belgilar), «sonli» (miqdor va o'lchov birligi), «grafik» (rasm, chizma, sxema, diagramma), «audio» (ovoz to'lqini), «video» (kadrlar ketma-ketligi), «multimedia» (bir nechta media turi birgalikda). «Qabul qilish usuliga ko'ra»: vizual (ko'rish), audial (eshitish), taktil (teri orqali), hid va ta'm bilish." },
    { type: "table", content: "| Axborot turi | Tavsifi | Misol |\n|-------------|---------|------|\n| Matnli | Yozma belgilar | Kitob, maqola, xat, hujjat |\n| Sonli | Raqamlar, statistik ma'lumotlar | Narx, sana, foiz, hisobot |\n| Grafik | Rasm, chizma, diagramma | Foto, xarita, logo, grafik |\n| Audio | Ovoz, musiqa, nutq | Qo'shiq, radio, podkast |\n| Video | Harakatli tasvir | Film, animatsiya, vebinar |\n| Multimedia | Bir nechta media turi | Interaktiv dars, veb-sayt |" },
    { type: "definition", content: "«Analog (uzluksiz) signal» — vaqt yoki makonda qiymati uzluksiz o'zgarishi mumkin bo'lgan signal (tabiatdagi tovush, yorug'lik). «Diskret (uzlukli) signal» — faqat ajratilgan paytlar yoki belgilangan qiymatlar to'plamida ifodalanadigan signal (kompyuterdagi matn, piksel, raqamli audio). Tabiiy tovush analog; MP3 ichidagi ma'lumot raqamli." },
    { type: "text", content: "«Axborot sifati» 10 xossa bilan baholanadi: «aniqlik/to'g'rilik» (fakt xatosiz), «ishonchlilik» (manba obro'si), «dolzarblik» (maqsadga moslik), «o'z vaqtidalik» (eskirmagan), «to'liqlik» (zarur qismlar bor), «tafsilot darajasi» (optimal chuqurlik), «tushunarlilik» (qabul qiluvchi tushunadi), «foydalilik/qimmatlilik» (qarorga xizmat), «obyektivlik» (fakt fikrdan ajratilgan), «mavjudlik» (ruxsatli foydalanuvchi oladi). Xossalar bir-birini kafolatlamaydi." },
    { type: "definition", content: "«Axborot manbai» — xabarni hosil qiluvchi yoki yuboruvchi shaxs, qurilma, obyekt yoki jarayon. «Axborot kanali» — signal manbadan qabul qiluvchiga o'tadigan muhit. «Axborot qabul qiluvchi» — xabar yetib boradigan va uni talqin qiladigan shaxs yoki tizim. Telefon vaziyatga qarab manba, kanal yoki qabul qiluvchi bo'lishi mumkin." },
    { type: "table", content: "| Manba turi | Afzalligi | Kamchiligi |\n|-----------|----------|----------|\n| Bevosita (birlamchi) | Aniq, ishonchli, faqat kerakli ma'lumot | Ko'p vaqt talab qiladi, qimmat |\n| Bilvosita (ikkilamchi) | Tez, arzon, katta hajmdagi namunalar | Eski bo'lishi mumkin, noxolislik ehtimoli bor |" },
    { type: "text", content: "«Statik ma'lumot» — o'zgarmas yoki qo'lda tahrirlanadigan (veb-sahifa nomi, PDF qo'llanma). «Dinamik ma'lumot» — foydalanuvchi aralashuvisiz avtomatik yangilanadigan (ob-havo, chiptalar, jonli sport). Muhim: «Internetdan olindi» degani avtomatik ravishda ikkilamchi degani emas — tasnif foydalanish maqsadiga bog'liq." },
    { type: "text", content: "«Axborotli jarayonlar» (12 tur): yaratish/hosil qilish, qabul qilish, yig'ish/to'plash, izlash, saqlash, qayta ishlash, uzatish, nusxalash, taqdim etish/chiqarish, foydalanish, himoyalash, yo'q qilish. Kompyuter tizimida: kiritish qurilmalari — qabul qilish va raqamlashtirish; protsessor — qayta ishlash; xotira — saqlash; chiqarish — taqdim etish; tarmoq — uzatish." },
    { type: "example", content: "Axborot sifati misoli:\n• Maktab sayti \"ertaga dars 8:00 da\" deb yozdi, ammo xabar o'tgan yildan qolgan.\n  — Jumla grammatik jihatdan tushunarli.\n  — Bir paytlar to'g'ri bo'lgan bo'lishi mumkin.\n  — Hozir o'z vaqtidalik xossasini yo'qotgan.\n  — Shu sababli amaldagi qaror uchun ishonchli emas." },
    { type: "note", content: "Bir axborotni turli mezonlarda tasniflash mumkin: jonli efirdagi ob-havo xaritasi — grafik va matnli (ifoda shakli), dinamik (yangilanishi), raqamli (signal tabiati), vizual (qabul qilish), dolzarb (vaqt). Braille yozuvi shaklan belgili matn, qabul qilish usuliga ko'ra taktil axborotdir." },
  ], [
    { id: "M01.02-q1", text: "Inson axborotning necha foizini ko'rish orqali qabul qiladi?", options: ["50%", "75%", "90%", "99%"], correctIndex: 2, explanation: "Inson axborotning 90% ini ko'rish orqali qabul qiladi", type: "Y1" },
    { id: "M01.02-q2", text: "Quyidagilardan qaysi biri axborot turi emas?", options: ["Matnli", "Grafik", "Jismoniy", "Video"], correctIndex: 2, explanation: "Jismoniy axborot turi mavjud emas. Asosiy turlar: matnli, sonli, grafik, tovushli, video, multimedia", type: "Y1" },
    { id: "M01.02-q3", text: "Har bir ma'lumot turiga mos misolni tanlang:", options: [], correctIndex: 0, explanation: "Dinamik ma'lumot avtomatik yangilanadi (ob-havo, sport), statik ma'lumot o'zgarmas (jurnal, veb-sahifa nomi)", type: "Y2", pairs: [{ leftId: "p1", leftContent: "Veb-sahifa sarlavhasi", rightContent: "Statik ma'lumot" }, { leftId: "p2", leftContent: "Jonli sport natijalari", rightContent: "Dinamik ma'lumot" }, { leftId: "p3", leftContent: "Jurnaldagi maqola", rightContent: "Statik ma'lumot" }, { leftId: "p4", leftContent: "Ob-havo yangilanishi", rightContent: "Dinamik ma'lumot" }] },
    { id: "M01.02-q4", text: "Bilvosita ma'lumot manbai qanday ma'lumot?", options: ["To'planish maqsadiga ko'ra yig'ilgan", "Boshqa maqsadda yig'ilgan ikkilamchi ma'lumot", "Faqat rasmlardan iborat", "Jonli efir ma'lumoti"], correctIndex: 1, explanation: "Bilvosita (ikkilamchi) manba — boshqa maqsadda yig'ilgan ma'lumot", type: "Y1" },
    { id: "M01.02-q5", text: "Axborot sifatining asosiy xususiyatlaridan biri emas?", options: ["To'g'rilik", "Dolzarblik", "Rangli bo'lishi", "To'liqlik"], correctIndex: 2, explanation: "Rangli bo'lishi axborot sifat xususiyati emas. Sifat: aniqlik, ishonchlilik, dolzarblik, o'z vaqtidalik, to'liqlik, tushunarlilik va boshqalar", type: "Y1" },
    { id: "M01.02-q6", text: "Analog va diskret signalni farqlang.", options: ["Sinonim", "Analog — uzluksiz, diskret — uzlukli", "Analog — raqamli, diskret — uzluksiz", "Farqi yo'q"], correctIndex: 1, explanation: "Analog (uzluksiz) — tabiatdagi tovush va yorug'lik; diskret (uzlukli) — kompyuterdagi ma'lumot", type: "Y2" },
    { id: "M01.02-q7", text: "«Internetdan olindi» degani avtomatik ravishda bilvosita manba degani emas. Nima uchun?", options: ["Internetdagi hamma narsa birlamchi", "Tasnif foydalanish maqsadiga bog'liq", "Internetda ikkilamchi manba yo'q", "Chunki Internet birlamchi manba"], correctIndex: 1, explanation: "Tasnif foydalanish maqsadiga bog'liq — meteorologik stansiya o'z sensori natijasi uchun birlamchi, boshqa tadqiqotchi uchun ikkilamchi", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.03 — 4-Bob: Axborot texnologiyalari, raqamli muhit va madaniyat
  // Manba: ICT5 13-16; ICT6 82-104; ICT8 8-11; MAR 22-29
  // ═══════════════════════════════════════════════════════════════════

  "M01.03": t("M01.03", "Axborot texnologiyalari va raqamli muhit", [
    { type: "definition", content: "«Axborot texnologiyasi» (AT) — axborotni izlash, yig'ish, saqlash, qayta ishlash, uzatish, himoyalash va foydalanuvchiga taqdim etish uchun qo'llanadigan usullar, jarayonlar, dasturiy hamda texnik vositalar majmui. ATning natijasi shunchaki qurilma emas, maqsadga mos axborot mahsuloti yoki xizmatdir. AT = kompyuter degan tenglik noto'g'ri." },
    { type: "table", content: "| Texnologiya | Vazifasi | Misol |\n|------------|---------|------|\n| 3D printer | Uch o'lchovli obyekt yaratish | Protez, uy qismlari, ehtiyot qism |\n| 4G/5G aloqa | Yuqori tezlikdagi mobil internet | 4G: 100 Mbps, 5G: 10 Gbps |\n| Bulutli saqlash | Masofaviy ma'lumot saqlash | Google Drive, iCloud, OneDrive |\n| Sun'iy intellekt | Aqlli tahlil va qaror qabul qilish | Chatbot, tibbiy diagnostika |\n| Biometriya | Shaxsni aniqlash | Face ID, barmoq izi skaneri |\n| IoT | Qurilmalarni tarmoqqa ulash | Aqlli uy, aqlli shahar |" },
    { type: "definition", content: "«Axborotlashgan jamiyat» — axborot va bilim yaratish, qayta ishlash, almashish hamda ulardan foydalanish iqtisodiyot, boshqaruv va ta'limning asosiy omiliga aylangan jamiyat. Belgilari: raqamli xizmatlar, elektron hujjatlar, masofaviy ta'lim, katta ma'lumotlar." },
    { type: "text", content: "«Axborot madaniyati» — axborotga ehtiyojni aniqlash, uni samarali izlash, ishonchliligini baholash, qayta ishlash, tartiblash, qonuniy va axloqiy qo'llash hamda xavfsiz ulashish qobiliyatlari majmui. Bosqichlari: 1) ehtiyojni aniq qo'yish; 2) qidirish va manbani tanlash; 3) dalil, sana va muallifni baholash; 4) saralash, qayta ishlash, xulosa; 5) manba ko'rsatib, xavfsiz ulashish." },
    { type: "definition", content: "«Raqamli axborot» — qiymatlari diskret kodlar, amalda ikkilik bitlar bilan ifodalangan axborot. Afzalliklari: aniq nusxalash, tez uzatish, avtomatik qayta ishlash, katta hajmda saqlash, shifrlash imkoniyati. Cheklovlari: qurilma va formatga bog'liqlik, noto'g'ri axborotning tez tarqalishi, maxfiylik buzilishi." },
    { type: "definition", content: "«Raqamli iz» — foydalanuvchining onlayn harakati natijasida qoladigan yozuvlar. «Faol iz» — foydalanuvchi ataylab joylashtirgan (post, forma, xabar). «Passiv iz» — tizim qayd etgan (IP manzil, cookie, kirish vaqti). O'chirilgan kontent nusxa, arxiv yoki skrinshotda qolishi mumkin." },
    { type: "text", content: "«Fakt, fikr va xulosa»: «Fakt» — dalil bilan tekshirish mumkin bo'lgan da'vo («fayl 8 MiB»). «Fikr» — shaxsiy baho («bu format eng qulay»). «Xulosa» — fakt va qoida asosida chiqarilgan natija («8 MiB fayl 4 MiB bo'sh joyga sig'maydi»). Ko'p takrorlangan gap fakt bo'lib qolmaydi. Qidiruv natijasining yuqori o'rni ishonchlilik kafolati emas." },
    { type: "note", content: "Raqamli texnologiyalar jamiyatning barcha sohalariga kirib bormoqda: ta'lim (LMS, e-learning, Moodle), tibbiyot (telemeditsina), biznes (e-commerce, raqamli marketing), davlat boshqaruvi (e-government). O'zbekistonda «Raqamli O'zbekiston — 2030» dasturi qabul qilingan." },
  ], [
    { id: "M01.03-q1", text: "Axborot texnologiyasi va kompyuter o'rtasidagi farq nima?", options: ["Ular sinonim", "Kompyuter — vosita, AT — usul va vositalar tizimi", "AT — kompyuterning bir qismi", "Farqi yo'q"], correctIndex: 1, explanation: "Axborot texnologiyasi = kompyuter degan tenglik noto'g'ri. Kompyuter — vosita; AT — maqsad, usul, dastur va inson faoliyatining tizimi", type: "Y2" },
    { id: "M01.03-q2", text: "Raqamli izning faol turiga misol keltiring.", options: ["IP manzil", "Cookie fayllari", "Ijtimoiy tarmoqdagi post", "Serverdagi kirish jurnali"], correctIndex: 2, explanation: "Faol iz — foydalanuvchi ataylab joylashtirgan (post, forma, xabar). Passiv iz — tizim qayd etgan (IP, cookie)", type: "Y2" },
    { id: "M01.03-q3", text: "Axborot madaniyatining birinchi bosqichi nima?", options: ["Qidirish", "Baholash", "Ehtiyojni aniq qo'yish", "Xulosa chiqarish"], correctIndex: 2, explanation: "Axborot madaniyati: 1) ehtiyojni aniq qo'yish; 2) qidirish; 3) baholash; 4) saralash; 5) ulashish", type: "Y1" },
    { id: "M01.03-q4", text: "Fakt va fikr o'rtasidagi farqni belgilang.", options: ["Sinonim", "Fakt — dalil bilan tekshirish mumkin, fikr — shaxsiy baho", "Fikr — dalil bilan tekshiriladi, fakt — baho", "Farqi yo'q"], correctIndex: 1, explanation: "Fakt: «fayl 8 MiB» (tekshirish mumkin). Fikr: «bu format eng qulay» (shaxsiy baho)", type: "Y2" },
    { id: "M01.03-q5", text: "Raqamli axborotning afzalligi emas?", options: ["Aniq nusxalash", "Tez uzatish", "Avtomatik qayta ishlash", "Hech qachon eskirib qolmasligi"], correctIndex: 3, explanation: "Raqamli axborot eskirgan tashuvchi sabab faylni ocha olmaslik kabi cheklovga ega", type: "Y2" },
    { id: "M01.03-q6", text: "5G avlodining 4G dan asosiy farqi nima?", options: ["Rangi", "Tezligi — 5G 100 barobar tez", "Hajmi kichikroq", "Narxi arzonroq"], correctIndex: 1, explanation: "5G tezligi 10 Gbit/s gacha, bu 4G dan (100 Mbps) ancha tez", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.04 — 5-Bob + 6-Bob: Belgi, kod, kodlash, shifrlash va sanoq sistemalari
  // Manba: ICT5 17-24; ICT7 9-29; CAM1011 17-25; MAR 24-27
  // ═══════════════════════════════════════════════════════════════════

  "M01.04": t("M01.04", "Belgi, kod, kodlash va shifrlash", [
    { type: "definition", content: "«Belgi» — ma'lum obyekt, harakat, xossa yoki tushunchani ifodalash uchun qabul qilingan ishora. «Alifbo» — kodlashda ishlatiladigan ruxsat etilgan belgilar to'plami; elementlari soni «alifbo quvvati» deyiladi. «Kod» — axborot elementlarini boshqa belgilar ketma-ketligi bilan moslashtiruvchi qoidalar tizimi. «Kodlash» — axborotni belgilangan qoida bo'yicha kodga o'tkazish; «dekodlash» — kodlangan ifodadan dastlabki mazmunni qayta tiklash." },
    { type: "text", content: "Kodlashning 7 maqsadi: 1) ifodalash (kompyuter formatiga o'tkazish); 2) ixchamlashtirish; 3) tasniflash; 4) tez kiritish; 5) aniq uzatish; 6) xatoni aniqlash (tekshiruv biti); 7) siqish. Kodlash usullari: raqamli (telefon kodi, Unicode), belgili (Morze, Braille), grafik (QR kod, piktogramma), tovushli (signal ohangi), ikkilik (0 va 1)." },
    { type: "table", content: "| Kodlash usuli | Asos | Misol | Qo'llanilishi |\n|-------------|------|------|-------------|\n| Ikkilik (binary) | 2 | 5 = 101₂ | Kompyuter xotirasi |\n| O'nlik (decimal) | 10 | 5 = 5₁₀ | Kundalik hayot |\n| Sakkizlik (octal) | 8 | 5 = 5₈ | Unix ruxsatlar |\n| O'n oltilik (hex) | 16 | 255 = FF₁₆ | Ranglar, manzillar |\n| Morze alifbosi | . va - | A = .- | Telegraf aloqasi |\n| ASCII | 7 bit | A = 65 | Matn kodlash |\n| Unicode | 16/32 bit | O' = 1206 | Ko'p tilli matn |" },
    { type: "definition", content: "«Doimiy uzunlikdagi kod» — har bir element bir xil i ta belgi bilan ifodalanadi (ASCII, 8 bit). «O'zgaruvchan uzunlikdagi kod» — elementlar turli uzunlikdagi kod so'zlari bilan ifodalanadi (Morze alifbosi). «Prefiks kod» — hech bir kod so'zi boshqa kod so'zining bosh qismi bo'lmaydi (masalan: 0, 10, 110, 111)." },
    { type: "text", content: "«Kodlash, siqish va shifrlash farqi»: kodlash — taqdim etish (ochish uchun standart jadval yetarli); siqish — fayl hajmini kamaytirish (algoritm/kodek kerak); shifrlash — maxfiylikni ta'minlash (maxfiy kalit kerak). «Simmetrik shifrlash» — bir kalit bilan shifrlash va ochish. «Asimmetrik shifrlash» — ochiq va yopiq kalit jufti. HTTPS ikkala usulni birlashtiradi: server sertifikati orqali seans kaliti o'rnatiladi, keyin tez simmetrik shifrlash bilan himoyalanadi." },
    { type: "table", content: "| Tarixiy tizim | Asos | Xususiyati |\n|-------------|------|----------|\n| Morze | . va - | O'zgaruvchan uzunlik, 1836 |\n| Braille | 2×3 nuqta | Taktil, ko'rishida nuqsoni borlar uchun |\n| Semafor | Bayroq holati | Vizual, masofaviy aloqa |\n| Sezar shifri | Harf siljitish | +3 siljish, tarixiy o'quv shifri |\n| Skitala | Tayoq o'rash | O'rin almashtirish usuli |" },
    { type: "note", content: "Qisqa kod maxfiylikni kafolatlamaydi. Kod jadvali topilsa, ma'no ochiladi. Kriptografik shifrlashda kalit va algoritm mavjud. Kriptologiya — maxfiy aloqa haqidagi soha; kriptografiya himoya usullarini yaratadi, kriptoanaliz esa shifr zaifligini tahlil qiladi." },
  ], [
    { id: "M01.04-q1", text: "Kodlash nima?", options: ["Axborotni o'chirish", "Axborotni bir ko'rinishdan boshqasiga o'tkazish", "Axborotni nusxalash", "Axborotni uzatish"], correctIndex: 1, explanation: "Kodlash — axborotni bir ko'rinishdan boshqa qulayroq ko'rinishga o'tkazish jarayoni", type: "Y1" },
    { id: "M01.04-q2", text: "Kodlash, siqish va shifrlashni farqlang.", options: ["Uchchalasi bir xil", "Kodlash — format, siqish — hajm kamaytirish, shifrlash — maxfiylik", "Siqish va shifrlash bir xil", "Kodlash — maxfiylik, shifrlash — format"], correctIndex: 1, explanation: "Kodlash — taqdim etish, siqish — hajmni kamaytirish, shifrlash — maxfiylikni ta'minlash", type: "Y2" },
    { id: "M01.04-q3", text: "Prefiks kodga misol qaysi?", options: ["0, 01, 10", "0, 10, 110, 111", "1, 11, 111", "00, 001, 10"], correctIndex: 1, explanation: "0, 10, 110, 111 to'plami prefiks kod — hech bir kod so'zi boshqasining bosh qismi emas", type: "Y2" },
    { id: "M01.04-q4", text: "Sezar shifrida kalit nima?", options: ["Alifbo", "Siljish miqdori", "Xabar uzunligi", "Maxfiy kalit so'z"], correctIndex: 1, explanation: "Sezar shifrida har bir harf bir xil miqdorga siljitiladi — bu siljish miqdori kalit hisoblanadi", type: "Y2" },
    { id: "M01.04-q5", text: "Simmetrik va asimmetrik shifrlashni farqlang.", options: ["Sinonim", "Simmetrik — bir kalit, asimmetrik — kalit jufti", "Asimmetrik — bir kalit, simmetrik — kalit jufti", "Ikkalasi bir xil kalitdan foydalanadi"], correctIndex: 1, explanation: "Simmetrikda bir maxfiy kalit, asimmetrikda ochiq va yopiq kalit jufti ishlatiladi", type: "Y2" },
    { id: "M01.04-q6", text: "HTTPS qanday shifrlash usulidan foydalanadi?", options: ["Faqat simmetrik", "Faqat asimmetrik", "Ikkalasini birlashtiradi", "Hech qanday"], correctIndex: 2, explanation: "HTTPS asimmetrik bilan kalit almashadi, keyin simmetrik bilan ma'lumotni shifrlaydi", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.05 — 7-Bob: Bit, bayt, axborot birliklari va Xartli formulasi
  // Manba: ICT5 20-24; ICT7 21-25; MAR 27-29
  // ═══════════════════════════════════════════════════════════════════

  "M01.05": t("M01.05", "Bit, bayt, axborot birliklari va Xartli formulasi", [
    { type: "definition", content: "«Bit» (binary digit) — 0 yoki 1 qiymatini qabul qiluvchi eng kichik ikkilik birlik. Axborot nazariyasida u ikki teng ehtimolli holatdan qaysi biri yuz berganini bilish bilan olinadigan miqdor. «Bayt» — 8 bitdan iborat birlik: 1 B = 8 bit. Belgilanish: b = bit, B = bayt." },
    { type: "formula", content: "Xartli formulasi:\nN = 2^i  (N — mumkin bo'lgan holatlar soni, i — bitlar soni)\nAgar N ikkining darajasi bo'lmasa: i = ceil(log2 N)\n\n1 Bayt (B) = 8 Bit\n1 KiB = 1024 B = 2^10 B\n1 MiB = 1024 KiB = 2^20 B\n1 GiB = 1024 MiB = 2^30 B\n1 TiB = 1024 GiB = 2^40 B\n\nXotira sig'imi: to'liq fayllar soni = floor(xotira / fayl hajmi)" },
    { type: "table", content: "| Birlik | Belgisi | Qiymati | Taxminiy hajm |\n|--------|--------|--------|-------------|\n| Bit | bit | 0 yoki 1 | Bitta ikkilik raqam |\n| Bayt | B | 8 bit | Bitta belgi |\n| KiB (ikkilik) | KiB | 1024 B | 1 sahifa matn |\n| MiB (ikkilik) | MiB | 1024 KiB | 1 ta rasm (2-5 MB) |\n| GiB (ikkilik) | GiB | 1024 MiB | 1 ta film |\n| TiB (ikkilik) | TiB | 1024 GiB | ~500 soat video |\n| kB (o'nlik) | kB | 1000 B | Disk ishlab chiqarish |" },
    { type: "text", content: "«SI va IEC prefikslar farqi»: SI (o'nlik) — kB=10^3, MB=10^6, GB=10^9. IEC (ikkilik) — KiB=2^10, MiB=2^20, GiB=2^30. Darsliklarda an'anaviy ravishda KB, MB, GB yozuvlari 1024 ko'paytuvchisi bilan beriladi. Attestatsiya masalasida berilgan modelga qarab ish tuting. NIST rasmiy birlik izohida 1 KiB=2^10 B va 1 kB=10^3 B alohida ko'rsatilgan." },
    { type: "example", content: "Xartli formulasi misollari:\n• 200 xil belgi: 2^7=128<200≤256=2^8 → i=8 bit\n• 30 xil signal: 2^4=16<30≤32=2^5 → kamida 5 bit\n• 64 MiB xotira, 150 KiB fayl: 64×1024=65536, 65536/150≈436 ta\n• 5 MiB = 5×1024×1024×8 = 41,943,040 bit\n• 12582912 bit ÷8=1572864 B ÷1024=1536 KiB ÷1024=1.5 MiB" },
    { type: "note", content: "Diqqat: registrfarqi — «b»=bit, «B»=bayt. 8 Mb ≠ 1 MB. «KB» (kilobayt) va «Kb» (kilobit) farqlanadi. Internet tezligi Kb/s yoki Mb/s da, fayl hajmi KB, MB, GB da o'lchanadi. Haqiqiy diskda bo'sh joy katalog va fayl tizimi xarajatlari sabab nazariy sig'imdan kichik." },
  ], [
    { id: "M01.05-q1", text: "Axborotning eng kichik o'lchov birligi nima?", options: ["Bayt", "Bit", "Kilobayt", "Megabayt"], correctIndex: 1, explanation: "Bit (binary digit) — axborotning eng kichik o'lchov birligi", type: "Y1" },
    { id: "M01.05-q2", text: "Xartli formulasida N nima?", options: ["Xabar uzunligi", "Mumkin bo'lgan holatlar soni", "Vaqt", "Tezlik"], correctIndex: 1, explanation: "N=2^i da N — mumkin bo'lgan holat yoki alifbo belgilarining soni, i — bitta holat kodi uzunligi", type: "Y2" },
    { id: "M01.05-q3", text: "65 xil holatni kodlash uchun kamida necha bit kerak?", options: ["5", "6", "7", "8"], correctIndex: 2, explanation: "2^6=64<65≤2^7=128, demak kamida 7 bit", type: "Y2" },
    { id: "M01.05-q4", text: "1 MiB bilan 1 MB o'rtasidagi farq nima?", options: ["Farqi yo'q", "1 MiB = 1,048,576 B, 1 MB = 1,000,000 B", "1 MB katta", "MiB — video, MB — audio"], correctIndex: 1, explanation: "1 MiB = 2^20 = 1,048,576 B; 1 MB = 10^6 = 1,000,000 B. MiB katta", type: "Y2" },
    { id: "M01.05-q5", text: "8 MiB xotirada har biri 500 KiB bo'lgan nechta to'liq fayl sig'adi?", options: ["16", "17", "8", "32"], correctIndex: 0, explanation: "8 MiB = 8192 KiB. 8192/500 = 16.384 → 16 ta to'liq fayl", type: "Y2" },
    { id: "M01.05-q6", text: "12582912 bit necha MiB ga teng?", options: ["1 MiB", "1.5 MiB", "2 MiB", "12 MiB"], correctIndex: 1, explanation: "12582912÷8=1572864 B÷1024=1536 KiB÷1024=1.5 MiB", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.06 — 13-Bob + 14-Bob: Axborot hajmini hisoblash va uzatish tezligi
  // Manba: ICT7 21-39; ICT9 14-20; ICT11 146-150; MAR 27-28
  // ═══════════════════════════════════════════════════════════════════

  "M01.06": t("M01.06", "Axborot hajmi, uzatish tezligi va aloqa kanali", [
    { type: "definition", content: "«Axborot uzatish tezligi» (v) — vaqt birligida uzatilgan axborot hajmi: v = I / t. «Bandwidth/o'tkazish qobiliyati» — kanalning nazariy maksimal tezligi. «Throughput» — amalda vaqt birligida yetkazilgan bitlar. «Goodput» — protokol sarlavhasisiz foydali ma'lumot tezligi. «Latency/kechikish» — signalning manbadan qabul qiluvchiga yetib borish vaqti." },
    { type: "formula", content: "Asosiy formulalar:\nv = I / t,  I = v × t,  t = I / v\n\nMuhim: 1 MB = 8 Mbit (bayt→bit: ×8), 1 Mbit = 0.125 MB (bit→bayt: ÷8)\n\nBit tezligi va baud: R(bit/s) = R(Bd) × log2(M)\n(M — signal holatlari soni)" },
    { type: "table", content: "| Tezlik birligi | Qiymati (bit/s) | Qo'llanilishi |\n|--------------|----------------|-------------|\n| bps (bit/s) | 1 | Eski modemlar (56 Kbps) |\n| Kbps | 1 000 | Dial-up, past sifatli audio |\n| Mbps | 1 000 000 | ADSL (24 Mbps), 4G (100 Mbps) |\n| Gbps | 1 000 000 000 | Fiber optik (1-10 Gbps), 5G |\n| Tbps | 1 000 000 000 000 | Magistral tarmoqlar |" },
    { type: "text", content: "«Aloqa yo'nalishi»: «Simplex» — faqat bir tomonga (teleefir); «Yarim dupleks» — ikki tomonga navbat bilan (ratsiya); «To'liq dupleks» — ikki tomonga bir vaqtda (telefon). «Ketma-ket uzatish» — bitlar bitta yo'lda navbat bilan; «Parallel uzatish» — bir necha bit alohida yo'llarda bir vaqtda. «Simli kanallar»: o'ralgan juft, koaksial, optik tola. «Simsiz kanallar»: radio/Wi-Fi, infraqizil, sun'iy yo'ldosh. Katta bandwidth kichik latency degani emas." },
    { type: "text", content: "«Axborot hajmini hisoblash strategiyasi» (6 bosqich): 1) Axborot turini toping (matn, rastr, audio, video); 2) Modelni aniqlang (teng kod, xom PCM, tayyor bit rate); 3) Birliklarni birxillashtiring; 4) Oraliq kattalikni toping; 5) Formulaga qo'ying; 6) Natijani tekshiring (bit/bayt, 1024/1000, yaxlitlash). Xatolar ko'pincha model tanlashdan keladi." },
    { type: "table", content: "| Tur | Formula | Shart |\n|-----|---------|------|\n| Kod uzunligi | i = ceil(log2 N) | N xil holat |\n| Matn | I = m × i | m belgi, i bit/belgi |\n| Rastr | I = W × H × d | d bit/piksel |\n| PCM audio | I = f_s × d × c × t | namuna, chuqurlik, kanal |\n| Bit rate berilgan | I = R × t | tayyor oqim |\n| Fayl soni | n = floor(S / I_f) | to'liq fayllar |" },
    { type: "example", content: "Hisoblash misollari:\n1) 100 MB fayl, 10 Mbps: vaqt = (100×8)/10 = 80 sek.\n2) 2400 Bd, 16 holat: 2400×log2(16) = 2400×4 = 9600 bit/s\n3) 42 MiB fayl, 10 Mbit/s: t = (42×2^20×8)/10^7 ≈ 35.23 s\n4) 8 GiB xotira, 75 MiB fayllar: 8192/75 ≈ 109 ta" },
    { type: "note", content: "Amaliyotda internet tezligi e'lon qilingan tezlikdan past bo'ladi (tarmoq yuklamasi, masofa, qurilma cheklovlari). «Yuklash vaqti» = (fayl hajmi × 8) / internet tezligi. Formuladagi ×8 — baytni bitga o'tkazish. 100 Mbps da 1 sekundda 12.5 MB yuklab olish mumkin." },
  ], [
    { id: "M01.06-q1", text: "Axborot uzatish tezligi qanday birlikda o'lchanadi?", options: ["Bayt/s", "Bit/s", "Metr/s", "Gramm/s"], correctIndex: 1, explanation: "Axborot uzatish tezligi bit/s (bps) yoki hosilalarida o'lchanadi", type: "Y1" },
    { id: "M01.06-q2", text: "1 MB necha Mbit ga teng?", options: ["1", "8", "10", "1024"], correctIndex: 1, explanation: "1 Bayt = 8 bit, shuning uchun 1 MB = 8 Mbit", type: "Y2" },
    { id: "M01.06-q3", text: "Bandwidth va throughput o'rtasidagi farq nima?", options: ["Sinonim", "Bandwidth — nazariy maksimal, throughput — amaliy tezlik", "Throughput — nazariy, bandwidth — amaliy", "Farqi yo'q"], correctIndex: 1, explanation: "Bandwidth — kanalning nazariy maksimal tezligi; throughput — amalda yetkazilgan bitlar", type: "Y2" },
    { id: "M01.06-q4", text: "2400 baud, 16 holatli simvol ideal holda necha bit/s?", options: ["2400", "4800", "9600", "19200"], correctIndex: 2, explanation: "log2(16)=4. 2400×4=9600 bit/s", type: "Y2" },
    { id: "M01.06-q5", text: "To'liq dupleks rejimida ma'lumot uzatish qanday amalga oshadi?", options: ["Faqat bir tomonga", "Ikki tomonga navbat bilan", "Ikki tomonga bir vaqtda", "Hech qanday"], correctIndex: 2, explanation: "To'liq dupleks — ikki tomonga bir vaqtda (telefon suhbati). Simplex — bir tomonga, yarim dupleks — navbat bilan", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.07 — 8,9,10,11,12-Boblar: Matn, grafika, audio, video kodlash va siqish
  // Manba: ICT5 20-24; ICT6 115-127; ICT7 26-39; CAM1011 19-23
  // ═══════════════════════════════════════════════════════════════════

  "M01.07": t("M01.07", "Matn, grafika, audio va videoni kodlash", [
    { type: "definition", content: "«Matnni kodlash» — har bir belgiga raqamli kod mos qo'yish. «Grafik kodlash» — tasvirni piksellarga ajratib, rangini kodlash (rastr) yoki geometrik obyektlar bilan ifodalash (vektor). «Audio kodlash» — tovush to'lqinini ADC orqali namunalarga ajratish. «Video kodlash» — ketma-ket kadrlarni kodlash. «Siqish» — axborotni kam bit bilan ifodalash." },
    { type: "table", content: "| Tur | Kodlash | Hajm formulasi | Formatlar |\n|-----|--------|--------------|---------|\n| Matn | ASCII (7 bit), Unicode | m × i | .txt, .docx, .pdf |\n| Grafik | RGB (24 bit), CMYK | W × H × d | .jpg, .png, .bmp, .svg |\n| Audio | PCM (ADC) | f_s × d × c × t | .wav, .mp3, .aac, .flac |\n| Video | Kadrlar + audio | W×H×d×fps×t + audio | .mp4, .avi, .mov, .mkv |" },
    { type: "text", content: "«ASCII» — 7 bitli, 128 kod (0..127). Amaliy darsliklarda 8 bitli «kengaytirilgan ASCII» 0..255 belgi sifatida soddalashtirib beriladi. «Unicode» — dunyo yozuv tizimlaridagi belgilarga yagona kod nuqtasi beruvchi standart. Kodlash shakllari: «UTF-8» (1-4 bayt, ASCII bilan mos), «UTF-16» (2 yoki 4 bayt), «UTF-32» (4 bayt). Unicode — belgilar repertuari; UTF esa kod nuqtasini baytlarga kodlaydi." },
    { type: "text", content: "«Grafika turlari»: «Rastr» — piksel asosida (BMP, PNG, JPEG) — foto va murakkab rang o'tishlari uchun. «Vektor» — geometrik obyektlar (SVG, EPS, AI) — logotip, sxema, chizma uchun. «Rang modellari»: «RGB» (qo'shiluvchi — ekran, 24 bit=16.7 mln rang), «CMYK» (ayriluvchi — bosma). «PPI» — piksel zichligi (ekran), «DPI» — nuqta zichligi (printer). 1 dyuym = 2.54 cm." },
    { type: "formula", content: "Grafik: I = W × H × d (bit)\nAudio: I = f_s × d × c × t (bit)\nVideo: I = W × H × d × fps × t + audio (bit)\n\nNamuna: 1024×768×24 = 18,874,368 bit ≈ 2.25 MB\n\nSiqish: k = I_asl / I_siqilgan\ntejash % = (1 - I_siqilgan/I_asl) × 100%" },
    { type: "text", content: "«Yo'qotishsiz siqish» — asl bitlar aynan tiklanadi (ZIP, PNG, FLAC, RLE). «Yo'qotishli siqish» — ayrim ma'lumot qaytarilmaydi (JPEG, MP3, MPEG). «RLE» — bir xil qiymat ketma-ketligini «qiymat+takror» bilan almashtiradi (8A2B3C). «Huffman kodlash» — tez-tez uchraydigan elementga qisqa kod beradi. «Konteyner» — oqimlarni birlashtiruvchi fayl tuzilmasi (MP4, MKV). «Kodek» — kodlash algoritmi (H.264, AAC)." },
    { type: "text", content: "«Audio formatlar»: WAV (siqilmagan PCM), FLAC (yo'qotishsiz), MP3/AAC (yo'qotishli). «Video formatlar»: MP4 (H.264/AAC), WebM (VP9/Opus). Fayl kengaytmasini o'zgartirish formatni konvertatsiya qilmaydi. Transkodlash — oqimni qayta kodlash (sifat pasayishi mumkin). Remux — faqat konteynerni almashtirish (sifat o'zgarmaydi)." },
    { type: "note", content: "Matn fayllari eng kichik, video fayllar eng katta hajmga ega. Format tanlovi maqsadga bog'liq: foto uchun JPEG, shaffof logotip uchun PNG, masshtablanadigan ikonka uchun SVG, audio arxiv uchun FLAC, musiqa uchun MP3/AAC." },
  ], [
    { id: "M01.07-q1", text: "ASCII standarti necha bitli?", options: ["5 bit", "6 bit", "7 bit", "8 bit"], correctIndex: 2, explanation: "Asl standart ASCII 7 bitli bo'lib, 2^7=128 kodni qamraydi", type: "Y1" },
    { id: "M01.07-q2", text: "Rastr va vektor grafikani farqlang.", options: ["Rastr — obyekt, vektor — piksel", "Rastr — piksel, vektor — geometrik obyekt", "Ikkalasi bir xil", "Vektor — foto, rastr — chizma"], correctIndex: 1, explanation: "Rastr tasvir piksellardan, vektor tasvir geometrik obyektlardan tuziladi", type: "Y2" },
    { id: "M01.07-q3", text: "Audiofayl hajmi qanday formula bilan hisoblanadi?", options: ["I = eni × bo'yi", "I = f_s × d × c × t", "I = m × v^2", "I = a × b × c"], correctIndex: 1, explanation: "Audiofayl hajmi = namuna chastotasi × bit chuqurligi × kanallar × vaqt", type: "Y2" },
    { id: "M01.07-q4", text: "Konteyner va kodek o'rtasidagi farq nima?", options: ["Sinonim", "Konteyner — fayl tuzilmasi, kodek — kodlash algoritmi", "Kodek — konteyner turi", "Konteyner — kodekning bir qismi"], correctIndex: 1, explanation: "Konteyner (MP4, MKV) — oqimlarni birlashtiruvchi tuzilma; kodek (H.264, AAC) — kodlash algoritmi", type: "Y2" },
    { id: "M01.07-q5", text: "3 daqiqa stereo audio (44100 Hz, 16 bit) hajmi qancha?", options: ["~10 MB", "~30 MB", "~60 MB", "~90 MB"], correctIndex: 1, explanation: "3×60×44100×16×2 = 254,016,000 bit ≈ 30.28 MB", type: "Y2" },
    { id: "M01.07-q6", text: "40 MiB fayl 10 MiB gacha siqildi. Koeffitsiyent va tejash foizi?", options: ["2:1, 50%", "4:1, 75%", "5:1, 80%", "10:1, 90%"], correctIndex: 1, explanation: "k=40/10=4:1. Tejash=(1-10/40)×100%=75%", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.08 — 17-Bob: Mualliflik huquqi, litsenziya va raqamli etika
  // Manba: ICT6 102-104; CAM5 99-107; CAM9 137-152
  // ═══════════════════════════════════════════════════════════════════

  "M01.08": t("M01.08", "Mualliflik huquqi, litsenziya va raqamli etika", [
    { type: "definition", content: "«Mualliflik huquqi» (copyright) — ijodkorning adabiy, ilmiy va badiiy asariga nisbatan qonunda belgilangan shaxsiy hamda mulkiy huquqlari. WIPO ta'rifiga ko'ra, mualliflik huquqi ijodkorlarning asarlariga bo'lgan huquqlarini anglatadi. Mualliflik huquqi g'oyaning o'zini emas, uning ijodiy ifodalanish shaklini himoya qiladi." },
    { type: "text", content: "O'zbekistonda asosiy rasmiy manba «Mualliflik huquqi va turdosh huquqlar to'g'risida»gi O'RQ-42-son Qonun (2006) va Fuqarolik Kodeksi (1041-1073-moddalar). Asosiy huquqlar: muallif sifatida tan olinish; asarni nusxalash, tarqatishni nazorat qilish; tarjima va hosila asarga ruxsat berish; asarning daxlsizligi." },
    { type: "table", content: "| Tushuncha | Ta'rifi |\n|----------|--------|\n| Plagiat | Boshqa shaxs asarini o'ziniki qilib ko'rsatish |\n| Mualliflik huquqini buzish | Huquq egasi ruxsatisiz foydalanish |\n| Litsenziya | Asardan foydalanish shartlari |\n| Ommaviy mulk (public domain) | Mualliflik huquqi muddati tugagan |\n| Creative Commons | Bepul litsenziyalar tizimi (6 tur + CC0) |" },
    { type: "text", content: "«Creative Commons» (CC) — 2001-yilda Lessig, Abelson va Eldred tomonidan tashkil etilgan. To'rtta asosiy shart: «BY» (muallif ko'rsatiladi), «SA» (hosila ayni litsenziyada), «NC» (notijorat), «ND» (o'zgartirilgan nusxani tarqatish yo'q). Olti litsenziya: CC BY (eng erkin), CC BY-SA, CC BY-ND, CC BY-NC, CC BY-NC-SA, CC BY-NC-ND (eng cheklovchi). «CC0» — huquq egasi imkon qadar huquqlardan voz kechadi (olti CC litsenziyasidan biri emas)." },
    { type: "text", content: "«Misinformatsiya» — noto'g'ri, lekin ataylab tarqatilmagan. «Dezinformatsiya» — aldash niyatida ataylab tarqatilgan. «Manipulyativ axborot» — to'g'ri faktni kontekstdan uzib, noto'g'ri taassurot berish. Minimal atributsiya «TASL» tamoyili: Title (asar nomi), Author (muallif), Source (asl manbaga havola), License (litsenziya)." },
    { type: "example", content: "Mualliflik huquqi amaliyoti:\n• Rasmni veb-saytdan olishda — muallif va manba ko'rsatish\n• YouTube videosi CC BY — muallifni ko'rsatib foydalanish\n• CC BY-NC-ND asarni tahrirlab tijoratda ishlatish mumkin emas\n• Bir necha so'zni sinonimga almashtirish parafraz emas\n• Iqtibosda qo'shtirnoq va manba ko'rsatiladi" },
    { type: "note", content: "Onlayn mavjudlik — ruxsat emas. Raqamli etika: xabar mavzusini aniq yozish; salomlashish; katta harflarda baqirmaslik; shaxsiy ma'lumotni roziliksiz tarqatmaslik; noto'g'ri xabarni tekshirmasdan ulashmaslik; muallif va litsenziyani hurmat qilish." },
  ], [
    { id: "M01.08-q1", text: "Netiket nima?", options: ["Internet tezligi", "Internetda muloqot qoidalari", "Kompyuter xavfsizligi", "Dasturlash tili"], correctIndex: 1, explanation: "Netiket — internetda muloqot qilishda rioya qilinadigan axloqiy me'yorlar", type: "Y1" },
    { id: "M01.08-q2", text: "Plagiat va mualliflik huquqini buzish o'rtasidagi farq nima?", options: ["Sinonim", "Plagiat — o'ziniki qilib ko'rsatish, huquqbuzarlik — ruxsatsiz foydalanish", "Plagiat — qonuniy, huquqbuzarlik — noqonuniy", "Farqi yo'q"], correctIndex: 1, explanation: "Plagiat — manbani yashirib o'ziniki qilish; mualliflik huquqini buzish — ruxsatsiz foydalanish", type: "Y2" },
    { id: "M01.08-q3", text: "Creative Commons nima?", options: ["Dasturlash tili", "Mualliflik huquqi litsenziyalari tizimi", "Operatsion tizim", "Internet brauzer"], correctIndex: 1, explanation: "Creative Commons — mualliflik huquqlarini himoya qiluvchi bepul litsenziyalar tizimi (6 tur + CC0)", type: "Y1" },
    { id: "M01.08-q4", text: "O'zbekistonda mualliflik huquqi qaysi hujjat bilan tartibga solinadi?", options: ["Konstitutsiya", "Fuqarolik Kodeksi va \"Mualliflik huquqi to'g'risida\"gi qonun", "Mehnat Kodeksi", "Jinoyat Kodeksi"], correctIndex: 1, explanation: "O'zbekistonda mualliflik huquqi Fuqarolik Kodeksi (1041-1073-moddalar) va 2006-yilgi qonun bilan tartibga solinadi", type: "Y2" },
    { id: "M01.08-q5", text: "Creative Commons litsenziyasining eng cheklovchi turi qaysi?", options: ["CC-BY", "CC-BY-SA", "CC-BY-NC-ND", "CC-BY-NC"], correctIndex: 2, explanation: "CC-BY-NC-ND — faqat ko'chirib olish, o'zgartirish va tijorat maqsadida foydalanish taqiqlanadi", type: "Y2" },
    { id: "M01.08-q6", text: "TASL tamoyili nimani anglatadi?", options: ["Tez, Aniq, Samarali, Lo'nda", "Title, Author, Source, License", "Tur, Aspekt, Sinf, Loyiha", "Tartib, Asos, Sana, Litsenziya"], correctIndex: 1, explanation: "TASL — Title (nom), Author (muallif), Source (manba), License (litsenziya)", type: "Y2" },
    { id: "M01.08-q7", text: "Misinformatsiya va dezinformatsiya o'rtasidagi farq nima?", options: ["Sinonim", "Misinformatsiya — ataylab emas, dezinformatsiya — ataylab yolg'on", "Dezinformatsiya — xato, misinformatsiya — yolg'on", "Farqi yo'q"], correctIndex: 1, explanation: "Misinformatsiya — noto'g'ri, lekin ataylab tarqatilmagan; dezinformatsiya — aldash niyatida", type: "Y2" },
  ]),

  // ═══════════════════════════════════════════════════════════════════
  // M01.09 — 15-Bob + 16-Bob: Axborotni izlash, tekshirish, validatsiya
  // Manba: ICT6 82-104; CAM5 90-107; CAM6 159-170; CAM1011 25-31
  // ═══════════════════════════════════════════════════════════════════

  "M01.09": t("M01.09", "Axborotni izlash, tekshirish va validatsiya", [
    { type: "definition", content: "«Internet» — o'zaro bog'langan tarmoqlar global tizimi. «WWW» (World Wide Web) — internet orqali olinadigan veb-sahifalar xizmati. «Veb-brauzer» — veb-resursni ko'rsatadigan dastur (Chrome, Firefox). «Qidiruv tizimi» — sahifalarni topish, indekslash va tartiblash xizmati (Google, Yandex). Google — qidiruv tizimi, Chrome — brauzer." },
    { type: "text", content: "Qidiruv tizimi ishlashi: 1) Crawler havolalar orqali sahifalarni topadi; 2) Indeks mazmunni bazaga yozadi; 3) Reyting algoritmi so'rovga moslik, sifat, yangilik bo'yicha tartiblaydi. Natijaning birinchi bo'lishi «eng to'g'ri» degani emas. Samarali so'rov: qo'shtirnoq (aniq ibora), minus (istisno), site: (domen), filetype: (format)." },
    { type: "table", content: "| CRAAP mezoni | Savol | Qizil bayroq |\n|-------------|------|----------|\n| Currency (dolzarblik) | Yangimi? Qachon chop etilgan? | Sana yo'q yoki eski |\n| Relevance (moslik) | Savolimga javob beradimi? | Mavzuga aloqasi yo'q |\n| Authority (mualliflik) | Kim yozgan? Ekspertmi? | Muallif noma'lum |\n| Accuracy (aniqlik) | Boshqa manbalar tasdiqlaydimi? | Faqat bitta manba |\n| Purpose (maqsad) | Nima uchun yozilgan? | Reklama yashirilgan |" },
    { type: "definition", content: "«Validatsiya» — kiritilgan ma'lumot oldindan belgilangan qoida va chegaralarga mosligini avtomatik tekshirish. «Verifikatsiya» — ma'lumotning asl manba bilan bir xilligini tekshirish. Validatsiya turlari: mavjudlik, tur, diapazon, cheklov, uzunlik, format, ro'yxat, muvofiqlik, noyoblik, nazorat raqami." },
    { type: "text", content: "«Validatsiya ≠ autentifikatsiya ≠ avtorizatsiya»: validatsiya — qiymat qoidaga mosmi? (parol 12 belgimi?); identifikatsiya — kim ekanini da'vo qiladi? (login); autentifikatsiya — shaxsni isbotlash (parol/biometriya); avtorizatsiya — ruxsat (admin paneliga kirish). «Nazorat raqami» (check digit) — identifikator raqamlaridan hisoblanib, kiritish xatolarini aniqlash uchun qo'shilgan belgi." },
    { type: "text", content: "«Paritet biti» — jami 1 lar soni juft/toq bo'lishi uchun qo'shiladi. Bir bit xatosini aniqlaydi, tuzatmaydi. «Checksum» — blok qiymatlaridan hisoblangan yig'indi. «CRC» — polinom bo'yicha bo'lishga asoslangan kuchli xato aniqlash. «Xatoni tuzatuvchi kod» (Hamming) — ortiqcha bitlar yordamida xato joyini aniqlab tuzatadi." },
    { type: "example", content: "Validatsiya misollari:\n• Yosh maydoni 18-80: 45 qiymati valid, ammo asl hujjatda 54 bo'lsa, verifikatsiya xatoni topadi\n• \"a@b\" — mavjudlikdan o'tadi, lekin email formatiga mos kelmasligi mumkin\n• 352? nazorat raqami: 3+5+2=10, ?=0 (sodda o'quv modeli)\n• Juft paritet: 1011001 → 4 ta 1 (juft) → paritet biti 0" },
    { type: "note", content: "«Uchta saytda bir xil yozilgan» — uchta mustaqil dalil emas, bir manbadan nusxa olingan bo'lishi mumkin. Axborotni tahlil qilish: 1) ma'lumot to'plash; 2) saralash; 3) tekshirish (CRAAP); 4) taqqoslash; 5) xulosa chiqarish. «Tanqidiy fikrlash» — raqamli savodxonlikning asosiy komponenti." },
  ], [
    { id: "M01.09-q1", text: "CRAAP testi nechta mezondan iborat?", options: ["3", "4", "5", "6"], correctIndex: 2, explanation: "CRAAP — Currency, Relevance, Authority, Accuracy, Purpose (5 mezon)", type: "Y1" },
    { id: "M01.09-q2", text: "Internetdan olingan ma'lumotni nechta manba bilan solishtirish tavsiya qilinadi?", options: ["1", "2", "3", "5"], correctIndex: 2, explanation: "Internetdan olingan ma'lumotlarni kamida 3 ta manba bilan solishtirish tavsiya etiladi", type: "Y1" },
    { id: "M01.09-q3", text: "Validatsiya va verifikatsiya o'rtasidagi farq nima?", options: ["Sinonim", "Validatsiya — qoidaga moslik, verifikatsiya — manbaga moslik", "Verifikatsiya — qoidaga moslik, validatsiya — manbaga moslik", "Farqi yo'q"], correctIndex: 1, explanation: "Validatsiya — qiymat qoidaga mosmi (yosh 18-80). Verifikatsiya — nusxa manbaga mosmi", type: "Y2" },
    { id: "M01.09-q4", text: "Paritet biti nechta bit xatosini tuzata oladi?", options: ["Hech qanday", "1 ta", "2 ta", "Hammasini"], correctIndex: 0, explanation: "Paritet biti xatoni aniqlaydi, lekin qaysi bit xato ekanini tuzatmaydi — u hatto ikki bit bir vaqtda o'zgarsa xatoni ham aniqlay olmasligi mumkin", type: "Y2" },
    { id: "M01.09-q5", text: "Validatsiya turi bo'lmagan tekshiruvni toping.", options: ["Mavjudlik", "Diapazon", "Rang", "Format"], correctIndex: 2, explanation: "Rang validatsiya turi emas. Validatsiya turlari: mavjudlik, tur, diapazon, cheklov, uzunlik, format, ro'yxat, muvofiqlik, noyoblik, nazorat raqami", type: "Y1" },
    { id: "M01.09-q6", text: "Autentifikatsiya nima?", options: ["Qiymatni tekshirish", "Shaxsni isbotlash", "Ruxsat berish", "Ma'lumotni saralash"], correctIndex: 1, explanation: "Autentifikatsiya — foydalanuvchining o'zini da'vo qilgan shaxs ekanligini isbotlash (parol, biometriya)", type: "Y2" },
  ]),

"""

if __name__ == "__main__":
    main()
