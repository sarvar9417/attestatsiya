import type { DailyLesson } from '../dailyLessons'

export const tensesMixedReview: DailyLesson = {
  id: 'tenses-mixed-review',
  speaking: {
    prompt: "Talk about your life — your past, your present, and your future. Speak for about one minute. Mix the tenses: Past Simple for yesterday, Present Simple for routines, and 'going to' or 'will' for plans.",
    tips: [
      "O'tmish: 'Yesterday I studied.'",
      "Hozir (odat): 'I usually wake up at seven.'",
      "Kelajak: 'I am going to travel.' / 'I will pass.'",
      "Zamonlarni to'g'ri aralashtiring.",
    ],
    sampleAnswer: "Let me tell you about my life. These days, I usually wake up at seven o'clock and study English every morning. Yesterday was a busy day — I went to class and then worked in the afternoon. Last year, I started learning English, and I have improved a lot since then. Right now, I am preparing for an exam. Next month, I am going to take the test, and I think I will pass it. In the future, I want to work in an international company. I believe that if I keep studying, I will reach my goals.",
  },
  title: '6 Zamon Aralash Takrorlash',
  subtitle: 'Present Simple, Present Continuous, Present Perfect, Past Simple, Past Continuous, Future Simple — barchasini birga mustahkamlang',
  level: 'A2',
  day: 30,
  listening: {
    transcript: `Nodir: Sardor, let me test you on English tenses. Ready?
Sardor: Sure, go ahead. I've been reviewing them all week.
Nodir: OK. What do you do every morning?
Sardor: I wake up at 6:30, take a shower, and have breakfast with my family.
Nodir: Good — that's Simple Present for routines. Now, what are you doing right now?
Sardor: Right now? I'm sitting here talking to you about grammar!
Nodir: Ha! Present Continuous. What about Past Simple — what did you do yesterday?
Sardor: Yesterday I went to the library and studied for four hours.
Nodir: And Past Continuous? What were you doing at 9 PM last night?
Sardor: I was watching a documentary when my sister called me.
Nodir: Perfect. Present Perfect?
Sardor: I have visited three countries so far — Turkey, Kazakhstan, and Georgia.
Nodir: Nice. And Future Simple?
Sardor: Next month I will travel to Russia for the first time.`,
    vocabulary: [
      { word: 'review', definition: 'takrorlash, ko\'rib chiqish' },
      { word: 'routine', definition: 'kundalik odat, tartib' },
      { word: 'documentary', definition: 'hujjatli film' },
      { word: 'so far', definition: 'shu paytgacha' },
      { word: 'grammar', definition: 'grammatika, til qoidalari' },
    ],
    questions: [
      { id: 99001, type: 'multiple-choice', question: "What does Sardor do every morning?", options: ["He goes for a run", "He wakes up at 6:30, showers, and has breakfast", "He reads the newspaper", "He exercises at the gym"], correctIndex: 1, explanation: "'I wake up at 6:30, take a shower, and have breakfast' — Simple Present, used for daily routines." },
      { id: 99002, type: 'multiple-choice', question: "What is Sardor doing right now?", options: ["Studying at the library", "Watching a movie", "Sitting and talking about grammar", "Cooking dinner"], correctIndex: 2, explanation: "'I'm sitting here talking to you about grammar' — Present Continuous, action happening at this moment." },
      { id: 99003, type: 'multiple-choice', question: "What did Sardor do yesterday?", options: ["He visited three countries", "He went to the library and studied", "He watched a documentary", "He traveled to Russia"], correctIndex: 1, explanation: "'Yesterday I went to the library and studied' — Past Simple, completed action in the past." },
      { id: 99004, type: 'multiple-choice', question: "What was Sardor doing at 9 PM last night?", options: ["Studying at the library", "Watching a documentary", "Having dinner", "Reading a book"], correctIndex: 1, explanation: "'I was watching a documentary when my sister called' — Past Continuous, action in progress at a specific time." },
      { id: 99005, type: 'multiple-choice', question: "Which countries has Sardor visited?", options: ["Russia, Turkey, Georgia", "Turkey, Kazakhstan, Georgia", "Uzbekistan, Russia, Turkey", "Georgia, Russia, Kazakhstan"], correctIndex: 1, explanation: "'I have visited three countries so far — Turkey, Kazakhstan, and Georgia' — Present Perfect, life experience." },
      { id: 99006, type: 'true-false', question: "Sardor has already traveled to Russia.", answer: false, explanation: "'Next month I will travel to Russia' — he hasn't been there yet, it's a future plan." },
    ],
    difficulty: 'medium',
    topic: '6 zamon aralash — real suhbatda qo\'llanishi',
  },
  formulas: [
    { label: 'Present Simple', structure: 'I/You/We/They + V1\nHe/She/It + V1+s/-es', color: 'green',
      explanation: "Odatiy harakatlar (I drink tea every morning), abadiy haqiqatlar (The sun rises in the east), jadvallar (The bus leaves at 8 AM). Uchta asosiy ma'no: habit, truth, schedule.",
      whenToUse: "1) Odatlar: always, usually, often, sometimes, rarely, never + har kuni/haftada/oyda...\n2) Haqiqatlar: Water boils at 100°C, Cats hate dogs.\n3) Jadvallar: The flight departs at 6 AM, The shop opens at 9.",
      example: "My father drives to work every day. (Odat)\nWater freezes at 0 degrees. (Haqiqat)\nThe train to Samarkand leaves at 7:15 PM. (Jadval)" },
    { label: 'Present Continuous', structure: 'I + am + V-ing\nHe/She/It + is + V-ing\nYou/We/They + are + V-ing', color: 'blue',
      explanation: "Hozir aynan sodir bo'layotgan harakatlar (I am eating now), vaqtinchalik holatlar (She is living in London this month), rejalashgan kelajak (I am meeting him tomorrow at 3).",
      whenToUse: "1) Hozirgi harakat: now, right now, at the moment, Look!, Listen!\n2) Vaqtinchalik holat: this week, this month, at the moment.\n3) Rejalashgan kelajak: tomorrow, this evening, next week + aniq vaqt.",
      example: "Be quiet! The baby is sleeping. (Hozir)\nShe is studying in London this year. (Vaqtinchalik)\nI am flying to Istanbul tomorrow at 10 AM. (Reja)" },
    { label: 'Present Perfect', structure: 'I/You/We/They + have + V3\nHe/She/It + has + V3', color: 'purple',
      explanation: "O'tmishda sodir bo'lgan, lekin hozirgi hayotga bog'langan harakatlar. Uchta asosiy ma'no: tajriba (experience), natija (result), davom etish (duration).",
      whenToUse: "1) Tajriba: ever, never, many times, before.\n2) Natija: just, already, yet — hozirgi holat muhim.\n3) Davom etish: since (2015-dan beri), for (5 yil), so far, up to now.",
      example: "I have been to Japan three times. (Tajriba)\nShe has just lost her key. (Natija — hozir kalit yo'q)\nWe have lived here since 2018. (Davom etish)" },
    { label: 'Past Simple', structure: 'I/You/We/They + V2\nHe/She/It + V2', color: 'amber',
      explanation: "O'tmishda tugallangan harakatlar. Aniq vaqt ko'rsatiladi yoki tushunarli. Ketma-ketlikda ham ishlatiladi.",
      whenToUse: "1) Tugallangan harakat: yesterday, last week/month/year, in 2020, ago, when I was young.\n2) Ketma-ketlik: He woke up, brushed his teeth, and left.\n3) O'tmishdagi odatlar: When I was a child, I played football every Sunday.",
      example: "I graduated from university in 2021. (Tugallangan)\nShe opened the door and smiled. (Ketma-ketlik)\nWe visited Tashkent last summer. (O'tmish)" },
    { label: 'Past Continuous', structure: 'I/He/She/It + was + V-ing\nYou/We/They + were + V-ing', color: 'cyan',
      explanation: "O'tmishdagi davom etayotgan harakatlar. Ko'pincha Past Simple bilan keladi: bitta harakat boshqasini uzgan.",
      whenToUse: "1) Davom etgan harakat: at 8 PM yesterday, all day yesterday, at that moment.\n2) Uzilgan harakat: I was reading when he called.\n3) Parallel harakatlar: She was cooking while I was cleaning.\n4) Muhit: It was a dark night. The wind was blowing.",
      example: "I was sleeping when the alarm went off. (Uzilgan)\nThey were playing football all afternoon. (Davom etgan)\nWhile she was cooking, I was setting the table. (Parallel)" },
    { label: 'Future Simple', structure: 'I/You/We/They + will + V1\nHe/She/It + will + V1', color: 'rose',
      explanation: "Kelajakdagi harakatlar, taxminlar, va'dalar, spontan qarorlar. 'Will' bilan yasaladi.",
      whenToUse: "1) Taxmin: I think it will rain tomorrow.\n2) Va'da: I will help you with your homework.\n3) Spontan qaror: The phone is ringing — I'll get it!\n4) Bashorat: Scientists say the Earth will get warmer.",
      example: "I will call you when I arrive. (Kelajak)\nIt will probably snow tonight. (Taxmin)\nDon't worry, I will never tell anyone. (Va'da)" },
  ],
  rules: [
    "1️⃣ ODDIYDAN MURAKKABGA: 6 ZAMON BIRGA\n\nBu 6 ta zamonni o'rganish uchun AVVAL har birini ALOHIDA tushunish kerak, KEYIN birgalikda taqqoslash. Quyida har bir zamonning asosiy farqi ko'rsatilgan:\n\n📌 Simple Present = ODAT / HAQIQAT\n  I drink tea every day. (odat)\n  Water boils at 100°C. (haqiqat)\n  Signal: always, usually, every day, on Mondays\n\n📌 Present Continuous = HOZIR / VAQTINCHALIK\n  I am drinking tea right now. (hozir)\n  She is living in London this year. (vaqtinchalik)\n  Signal: now, at the moment, Look!, Listen!\n\n📌 Present Perfect = TAJRIBA / NATIJA / DAVOM\n  I have drunk three cups today. (tajriba — necha marta)\n  She has lost her key. (natija — hozir yo'q)\n  We have lived here for 10 years. (davom)\n  Signal: ever, never, just, already, yet, since, for\n\n📌 Past Simple = O'TMISH (TUGALLANGAN)\n  I drank tea yesterday morning. (tugallangan)\n  Signal: yesterday, last, ago, in 2020, when I was young\n\n📌 Past Continuous = O'TMISHDA DAVOM ETGAN\n  I was drinking tea when he called. (davom etgan, uzildi)\n  Signal: while, when, at 8 PM yesterday, all day\n\n📌 Future Simple = KELAJAK\n  I will drink tea tomorrow. (kelajak)\n  Signal: tomorrow, next, will, I think, probably",
    "2️⃣ ENG MUHIM FARQ: Present Perfect vs Past Simple\n\nBu ikki zamon ko'pincha chalkashtiriladi. Asosiy farq:\n\n🟣 Present Perfect → HOZIRGI NATIJA MUHIM\n  I have lost my key. = Kalitimni yo'qotdim. (HOZIR kalitim yo'q!)\n  She has gone to London. = U Londonga ketdi. (HOZIR yo'q bu yerda!)\n  We have known each other for 10 years. = (HOZIR ham bilamiz)\n\n🟠 Past Simple → O'TMISH VOQEASI MUHIM\n  I lost my key yesterday. = Kecha kalitimni yo'qotdim. (VAQT aytilgan)\n  She went to London last week. = O'tgan hafta Londonga ketdi.\n  We knew each other in 2015. = 2015-da bir-birimizni bilardik.\n\n❌ I have visited Paris yesterday. (yesterday = Past Simple kerak)\n✅ I visited Paris yesterday.\n✅ I have visited Paris three times. (necha marta — tajriba)\n\n❌ I went to Paris three times. (uchun noto'g'ri emas, lekin Perfect yaxshiroq)\n✅ I have been to Paris three times.",
    "3️⃣ Present Simple vs Present Continuous — QACHON QAYSISI?\n\n🟢 Simple Present = ODAT (vaqt cheklanmagan, doim takrorlanadi)\n  I drink tea every morning. (har kuni)\n  She works at a bank. (doimiy ish)\n  The sun rises in the east. (abadiy)\n\n🔵 Present Continuous = HOZIR (hozirgi lahzada, vaqtinchalik)\n  I am drinking tea right now. (shu lahzada)\n  She is working from home today. (bugun, vaqtinchalik)\n  It is raining outside. (hozir)\n\n⚠️ STATE VERBS Present Continuous OLMAYDI:\n  ✅ I know the answer. ❌ I am knowing the answer.\n  ✅ She wants coffee. ❌ She is wanting coffee.\n  ✅ He has a car. ❌ He is having a car. (egalik)\n\nLEKIN: I am having dinner. (harakat = Continuous OK)\n         I am thinking about you. (jarayon = Continuous OK)",
    "4️⃣ Past Simple vs Past Continuous — QANDAY FARQ?\n\n🟠 Past Simple = TUGALLANGAN (boshlandi → tugadi)\n  I read the book. (kitobni o'qidim — tugadi)\n  She cooked dinner. (ovqat pishirdi — tugadi)\n\n🔵 Past Continuous = DAVOM ETGAN (davom etayotgan edi)\n  I was reading the book. (kitobni o'qiyotgan edim — davom etayotgan)\n  She was cooking dinner. (ovqat pishirayotgan edi)\n\n🔗 IKKALASI BIRGADA (eng ko'p ishlatiladigan konstruksiya):\n  I was reading when he called.\n  (Men o'qiyotgan edim → U qo'ng'iroq qildi → O'qish UZILDI)\n\n  She was cooking while I was setting the table.\n  (Ikkala harakat PARALLEL davom etdi)\n\n⏰ ANIQ VAQT SO'ZLARI:\n  Past Simple: yesterday, last week, in 2020, ago, when I was 10\n  Past Continuous: at 8 PM yesterday, all day yesterday, when he came",
    "5️⃣ O'zbek tilidagi asosiy qiyinchiliklar\n\nO'zbek tilida zamon ko'pincha fe'l shaklidan ANIQ KO'RINMAYDI. Shuning uchun xatolar ko'p:\n\n❌ I have visited Paris yesterday. → I visited Paris yesterday.\n  (Yesterday = Past Simple, Present Perfect emas!)\n\n❌ She is knowing the answer. → She knows the answer.\n  (Know = state verb, Continuous olmaydi!)\n\n❌ I was reading when he has called. → I was reading when he called.\n  (When dan keyin Past Simple!)\n\n❌ He will can help you. → He will help you.\n  (Will dan keyin modal olmaydi!)\n\n❌ I have been to Paris since three years. → ...for three years.\n  (Since = aniq nuqta, for = davomiylik!)\n\n❌ She has went to school. → She has gone to school.\n  (V3 kerak: go → went emas, gone!)\n\n❌ While I was sleeping, the phone rings. → ...rang.\n  (While dan keyin ham o'tmish!)",
    "6️⃣ SIGNAL SO'ZLAR — XOTIRADA SAQLASH\n\n┌─────────────────┬──────────────────────────────────────┐\n│ ZAMON           │ SIGNAL SO'ZLAR                        │\n├─────────────────┼──────────────────────────────────────┤\n│ Present Simple  │ always, usually, often, sometimes,   │\n│                 │ never, every day/week/month,         │\n│                 │ on Mondays, once a week              │\n├─────────────────┼──────────────────────────────────────┤\n│ Present Cont.   │ now, right now, at the moment,       │\n│                 │ Look!, Listen!, currently,           │\n│                 │ this week/month, today               │\n├─────────────────┼──────────────────────────────────────┤\n│ Present Perfect │ ever, never, already, yet, just,     │\n│                 │ so far, since, for, recently,        │\n│                 │ many/twice/three times, up to now    │\n├─────────────────┼──────────────────────────────────────┤\n│ Past Simple     │ yesterday, last week/month/year,     │\n│                 │ ago, in 2020, when I was young,      │\n│                 │ the other day, at that time           │\n├─────────────────┼──────────────────────────────────────┤\n│ Past Cont.      │ while, when, at 8 PM yesterday,     │\n│                 │ all day yesterday, at that moment,   │\n│                 │ the whole morning                     │\n├─────────────────┼──────────────────────────────────────┤\n│ Future Simple   │ tomorrow, next week/month/year,      │\n│                 │ in the future, soon, later,           │\n│                 │ I think, probably, I promise          │\n└─────────────────┴──────────────────────────────────────┘\n\n⚠️ DIQQAT: Agar signal so'zi ikkita zamonqa mos kelsa, MATNNING MA'NOSIGA qarang!\n  'I have been to Paris three times.' = Tajriba → Present Perfect\n  'I went to Paris in 2019.' = Aniq vaqt → Past Simple",
    "7️⃣ BIRGA ISHLATISH — REAL GAPLAR\n\nHaqiqiy hayotda ko'pincha bitta gapda 2-3 ta zamon ishlatiladi:\n\n📌 Past Continuous + Past Simple (uzilgan harakat):\n  I was sleeping when the phone rang. (Uxlayotgan edim — telefon jiringladi)\n  While she was cooking, the fire alarm went off.\n  He was driving to work when it started to snow.\n\n📌 Present Perfect + Present Simple (tajriba + odat):\n  I have visited many countries. I usually go to Europe in summer.\n  She has worked here for years. She knows every client.\n  We have lived in Tashkent since 2015. We love this city.\n\n📌 Present Continuous + Future Simple (reja + kelajak):\n  I am meeting the doctor tomorrow. He will examine me at 3 PM.\n  We are flying to Dubai next week. The flight leaves at 6 AM.\n\n📌 Past Simple + Future Simple (sabab + natija):\n  I studied hard, so I will pass the exam.\n  She was tired because she had worked all day.",
    "8️⃣ TAQQOSLASH MASALALARI — O'ZINGIZ SINAB KO'RING\n\nQuyidagi gaplarda qaysi zamon to'g'ri ekanini aniqlang:\n\n1. She ___ (work) here since 2020. → Present Perfect (since)\n2. She ___ (work) here yesterday. → Past Simple (yesterday)\n3. What ___ you ___ (do) right now? → Present Continuous (right now)\n4. What ___ you ___ (do) last night? → Past Simple (last night)\n5. I ___ (read) when he called. → Past Continuous (uzildi)\n6. I ___ (read) three books this month. → Present Perfect (tajriba)\n7. It ___ (rain) tomorrow. → Future Simple (tomorrow)\n8. It ___ (rain) at the moment. → Present Continuous (at the moment)\n9. She ___ (live) in London for 10 years. → Present Perfect (for)\n10. She ___ (live) in London in 2015. → Past Simple (in 2015)\n11. They ___ (play) football when it started to rain. → Past Continuous\n12. I ___ (never/see) snow. → Present Perfect (never)",
  ],
  vocabulary: [
    { en: 'tense', uz: 'fe\'l zamon', example: 'English has 12 tenses, but we use 6 most often.', rule: 'grammar' },
    { en: 'habit', uz: 'odat', example: 'I brush my teeth twice a day. (Simple Present)', rule: 'usage' },
    { en: 'experience', uz: 'tajriba', example: 'I have met many interesting people in my life. (Present Perfect)', rule: 'usage' },
    { en: 'interrupt', uz: 'uzish, aralashish', example: 'I was sleeping when the alarm interrupted me. (Past Continuous)', rule: 'usage' },
    { en: 'routine', uz: 'kundalik tartib', example: 'My morning routine: wake up, shower, breakfast. (Simple Present)', rule: 'usage' },
    { en: 'signal word', uz: 'signal so\'z', example: '"Yesterday" is a signal word for Past Simple.', rule: 'grammar' },
    { en: 'frequency adverb', uz: 'chastota ravishi', example: 'She always arrives on time. (always = 100%)', rule: 'grammar' },
    { en: 'since', uz: 'shundan beri (boshlanish nuqtasi)', example: 'I have lived here since 2018.', rule: 'signal' },
    { en: 'for', uz: '...davomida (vaqt oralig\'i)', example: 'I have lived here for five years.', rule: 'signal' },
    { en: 'ago', uz: '...oldin', example: 'I moved here two years ago.', rule: 'signal' },
    { en: 'while', uz: '...paytida, ... davomida', example: 'While I was cooking, the phone rang.', rule: 'signal' },
    { en: 'already', uz: 'allaqachon', example: 'I have already finished my homework.', rule: 'signal' },
    { en: 'yet', uz: 'hali (emash)', example: 'I haven\'t finished yet.', rule: 'signal' },
    { en: 'just', uz: 'hozirgina, endigina', example: 'She has just arrived at the airport.', rule: 'signal' },
    { en: 'used to', uz: '...qilardi (o\'tmish odat)', example: 'I used to play football when I was young. (lekin endi yo\'q)', rule: 'grammar' },
  ],
  examples: [
    {
      en: "A: What do you do every day?\nB: I wake up at 7, have breakfast, and go to work by bus.\nA: Does your wife work too?\nB: Yes, she works at a hospital. She's a nurse.",
      uz: "A: Har kuni nima qilasiz?\nB: Soat 7 da uyg'onaman, nonushta qilaman va avtobus bilan ishga ketaman.\nA: Xotiningiz ham ishlaydimi?\nB: Ha, u kasalxona-da ishlaydi. U hamshira."
    },
    {
      en: "A: What are you doing right now?\nB: I'm studying for my exam. It's on Friday.\nA: Are you nervous?\nB: Yes, I'm feeling a bit anxious. I've been studying all day.",
      uz: "A: Hozir nima qilyapsan?\nB: Imtihonga tayyorlanayotgandayman. Juma kuni.\nA: Asabiylashyapsanmi?\nB: Ha, biroz xavotirdaman. Kun bo'yi o'qiyapman."
    },
    {
      en: "A: Have you ever been to Turkey?\nB: Yes, I've been there twice. I went to Istanbul in 2019 and Antalya in 2022.\nA: Which city did you like more?\nB: Istanbul was amazing. I've never seen such beautiful architecture.",
      uz: "A: Hech qachon Turkiyada bo'lganmisiz?\nB: Ha, ikki marta. 2019-yilda Istanbulda va 2022-yilda Antalyada bordim.\nA: Qaysi shahar ko'proq yoqdi?\nIstanbul ajoyib edi. Bunday go'zal arxitekturani hech ko'rmagan edim."
    },
    {
      en: "A: What did you do last weekend?\nB: I went to the countryside with my family. We had a picnic by the river.\nA: That sounds nice. Was the weather good?\nB: It was perfect. The sun was shining and birds were singing.",
      uz: "A: O'tgan hafta oxiri nima qildingiz?\nB: Oila bilan qishloqqa bordik. Daryo bo'yida piknik qildik.\nA: Chiroyli ekan. Ob-havo yaxshi edimi?\nB: Mukammal edi. Quyosh porlayotgan, qushlar kuylayotgan edi."
    },
    {
      en: "A: What will you do this summer?\nB: I will travel to Russia for the first time.\nA: Where exactly?\nB: I'll visit Moscow and St. Petersburg. I think I will love it.",
      uz: "A: Shu yoz nima qilasiz?\nB: Birinchi marta Rossiyaga sayohat qilaman.\nA: Aniq qayerga?\nB: Moskva va Sankt-Peterburgni ko'raman. Menga yoqadi deb o'ylayman."
    },
    {
      en: "I was walking home last night when it started to rain heavily. I didn't have an umbrella, so I got completely wet. When I finally arrived home, my mother was cooking dinner and my father was watching the news on TV.",
      uz: "Kecha kechasi uyga ketayotganimda, kuchli yog'inch boshlandi. Soyabonim yo'q edi, shuning uchun to'liq ho'l bo'ldim. Nihoyat uyga yetib kelganimda, onam ovqat pishirayotgan edi va otam televizorda yangiliklarni ko'rayotgan edi."
    },
  ],
  specialCases: [
    {
      id: 'been-vs-gone',
      title: 'Been vs Gone — ular qanday farqlanadi?',
      rule: "Bu ikki so'z ko'pincha chalkashtiriladi. Ularning farqi JUDA MUHIM:\n\n🔵 BEEN = Borgan VA QAYTGAN (tajriba tariqasida)\n  He has been to London. = U Londonda bo'lgan (va hozir bu yerda).\n  I have been to that restaurant. It was great. (borib qaytganman)\n\n🔴 GONE = Ketgan, Hali QAYTMAGAN\n  He has gone to London. = U Londonga ketdi (hozir yo'q bu yerda).\n  She has gone to the shop. She'll be back in 10 minutes.\n\n❌ He has gone to Paris three times. (NOTO'G'RI — tajriba = been)\n✅ He has been to Paris three times.\n\n❌ Where has been Tom? (NOTO'G'RI — sorov belgisi oldida)\n✅ Where has Tom gone? (Qayerga ketdi?)\n✅ Where has Tom been? (Qayerda bo'lgan?)",
      mnemonic: "🎯 BEEN = B = BORGA (borib, ko'rib, qaytgan)\nGONE = G = GONE/KETGAN (ketdi, hali yo'q)",
      commonMistakes: "1. He has gone to Paris three times. ❌\n   → He has been to Paris three times. ✓\n\n2. She has been to the shop. She'll be back soon. ❌\n   → She has gone to the shop. She'll be back soon. ✓\n\n3. Where has been my phone? ❌\n   → Where has my phone been? ✓\n   → Where has my phone gone? ✓",
      examples: [
        { en: 'I have been to Japan. It was an incredible experience.', uz: 'Men Yaponiyada bo\'lganman. Ajoyib tajriba edi.' },
        { en: 'My father has gone to work. He won\'t be back until 6 PM.', uz: 'Otam ishga ketdi. Soat 6 gacha qaytmaydi.' },
        { en: 'Have you ever been to Samarkand? — Yes, I have been there twice.', uz: 'Hech qachon Samarqandda bo\'lganmisiz? — Ha, ikki marta bordim.' },
      ],
      drills: [
        { id: 80001, type: 'multiple-choice', instruction: 'Been yoki Gone? To\'g\'rini tanlang:', question: 'She ___ to the supermarket. She\'ll be back in 10 minutes.', options: ['has been', 'has gone', 'went', 'goes'], correct: 'has gone', explanation: 'She still hasn\'t returned (will be back in 10 min) → has gone. She went and will return = GONE.' },
        { id: 80002, type: 'multiple-choice', instruction: 'Been yoki Gone? To\'g\'rini tanlang:', question: 'I ___ to Paris twice. It\'s a beautiful city.', options: ['have been', 'have gone', 'went', 'go'], correct: 'have been', explanation: 'Life experience (twice) + the speaker is here now → have been. I went and came back = BEEN.' },
        { id: 80003, type: 'fill-blank', instruction: 'Been yoki Gone? Bo\'sh joyni to\'ldiring:', question: 'Where ___ Tom? I can\'t find him anywhere.', blanks: ['has gone'], explanation: 'He\'s not here → he went somewhere → has gone.' },
        { id: 80004, type: 'fill-blank', instruction: 'Been yoki Gone? Bo\'sh joyni to\'ldiring:', question: 'We ___ to that restaurant many times. The food is excellent.', blanks: ['have been'], explanation: 'Many times = experience → have been.' },
      ],
    },
    {
      id: 'for-vs-since',
      title: 'For vs Since — qaysi biri qachon ishlatiladi?',
      rule: "Bu ikki so'z Present Perfect bilan birga ishlatiladi, lekin farqlari bor:\n\n🔵 FOR = DAVOMIYLIK (vaqt oralig'i — necha soat, kun, yil)\n  for 5 minutes, for 2 hours, for 3 days\n  for two years, for a long time, for ages\n  for a week, for months, for centuries\n\n🔴 SINCE = BOSHLANISH NUQTASI (qachondan beri — aniq sana)\n  since Monday, since January, since 2020\n  since last week, since I was a child\n  since three o'clock, since the war started\n\n📐 QOIDA: FOR + VAQT ORALIG'I | SINCE + ANIQ NUQTA\n  I have lived here FOR 5 years. (5 yil davomida)\n  I have lived here SINCE 2019. (2019-dan beri)\n\n❌ I have lived here since 5 years. (NOTO'G'RI — 5 years = oraliq)\n✅ I have lived here for 5 years.\n\n❌ She has worked here for 2020. (NOTO'G'RI — 2020 = nuqta)\n✅ She has worked here since 2020.",
      mnemonic: "🎯 FOR = For how long? (NECHA VAQT)\nSINCE = Since when? (QACHONDAN BERI)\n\nFOR + 2 years / a long time / 3 months\nSINCE + 2020 / Monday / I was 10",
      commonMistakes: "1. I have been here since 3 hours. ❌\n   → for 3 hours ✓ (3 hours = oraliq)\n\n2. She has worked here for 2020. ❌\n   → since 2020 ✓ (2020 = boshlanish nuqtasi)\n\n3. We have known each other since a long time. ❌\n   → for a long time ✓ (a long time = oraliq)\n\n4. I have been waiting since two hours. ❌\n   → for two hours ✓",
      examples: [
        { en: 'I have been waiting for two hours. When will the bus come?', uz: 'Men ikki soatdan beri kutaman. Avtobus qachon keladi?' },
        { en: 'She has worked at this company since January 2018.', uz: 'U 2018-yil yanvardan beri bu kompaniyada ishlaydi.' },
        { en: 'We have known each other since we were children.', uz: 'Biz bolaligidan beri bir-birimizni bilamiz.' },
        { en: 'He has been studying English for three years.', uz: 'U uch yildan beri ingliz tilini o\'rganmoqda.' },
      ],
      drills: [
        { id: 80005, type: 'multiple-choice', instruction: 'For yoki Since? To\'g\'rini tanlang:', question: 'I have been studying English ___ 2018.', options: ['for', 'since', 'from', 'ago'], correct: 'since', explanation: '2018 = aniq yil, boshlanish nuqtasi → since 2018.' },
        { id: 80006, type: 'multiple-choice', instruction: 'For yoki Since? To\'g\'rini tanlang:', question: 'She has lived here ___ three years.', options: ['for', 'since', 'from', 'ago'], correct: 'for', explanation: 'Three years = vaqt oralig\'i → for three years.' },
        { id: 80007, type: 'fill-blank', instruction: 'For yoki Since? Bo\'sh joyni to\'ldiring:', question: 'We have known each other ___ we were children.', blanks: ['since'], explanation: 'We were children = boshlanish nuqtasi → since.' },
        { id: 80008, type: 'fill-blank', instruction: 'For yoki Since? Bo\'sh joyni to\'ldiring:', question: 'He has been waiting ___ 30 minutes. The bus is late.', blanks: ['for'], explanation: '30 minutes = vaqt oralig\'i → for.' },
      ],
    },
    {
      id: 'when-vs-while',
      title: 'When vs While — ular qachon ishlatiladi?',
      rule: "Bu ikki so'z Past Continuous bilan birga ishlatiladi, lekin farqlari bor:\n\n🔵 WHEN = BIR LAHZADA sodir bo'lgan (punctual — kutilmagan, bir zumda)\n  I was sleeping WHEN the alarm went off.\n  (Past Continuous + when + Past Simple)\n\n  When I arrived, they were eating. (kelgan lahzada)\n  When it started to rain, we were playing football.\n  When the phone rang, I was in the shower.\n\n🔴 WHILE = DAVOMIYLIK (duration — uzoq, bir vaqtda)\n  I was reading WHILE she was cooking.\n  (Past Continuous + while + Past Continuous)\n\n  While I was cooking, the smoke alarm went off.\n  While we were playing, it started to rain.\n  While she was studying, her brother was playing games.\n\n⚠️ DIQQAT: 'When' ba'zan 'while' o'rnida ham ishlatiladi:\n  When I was young, I played football. (= While I was young)\n  LEKIN: 'While' hech qachon 'punctual' ma'noda ishlatilmaydi!\n  ❌ While he arrived, I was cooking. ✅ When he arrived...",
      mnemonic: "🎯 WHEN = W = ONE MOMENT (burchak, bir lahzada)\nWHILE = WH = WHILE A LONG TIME (uzoq, davomiylik)\n\nWHEN + Past Simple (punctual)\nWHILE + Past Continuous (duration)",
      commonMistakes: "1. While I was sleeping, the phone rings. ❌\n   → rang ✓ (o'tmish kerak!)\n\n2. When I was cooking, she was cleaning. ❌\n   → While ✓ (ikkala harakat ham davomiy)\n\n3. I was reading while he arrived. ❌\n   → when ✓ (arrived = punctual)\n\n4. While it started to rain... ❌\n   → When it started to rain... ✓ (started = punctual)",
      examples: [
        { en: 'When the teacher came in, the students stopped talking.', uz: 'O\'qituvchi kirganda, o\'quvchilar gaplashishni to\'xtatishdi.' },
        { en: 'While we were having dinner, the lights went out.', uz: 'Biz ovqat yeyotganda, chiroq o\'chdi.' },
        { en: 'When I was walking to school, I found a wallet on the ground.', uz: 'Maktabga yurganimda, yerdan hamyon topdim.' },
        { en: 'While she was studying for the exam, her friends were at the cinema.', uz: 'U imtihonga tayyorlanayotganda, do\'stlari kinoteatrda edilar.' },
      ],
      drills: [
        { id: 80009, type: 'multiple-choice', instruction: 'When yoki While? To\'g\'rini tanlang:', question: '___ I was walking home, it started to snow.', options: ['When', 'While', 'If', 'Because'], correct: 'While', explanation: 'I was walking = davomiylik → While.' },
        { id: 80010, type: 'multiple-choice', instruction: 'When yoki While? To\'g\'rini tanlang:', question: 'She was reading ___ I was cooking.', options: ['When', 'While', 'If', 'Because'], correct: 'While', explanation: 'Ikkala harakat ham davomiy → While.' },
        { id: 80011, type: 'fill-blank', instruction: 'When yoki While? Bo\'sh joyni to\'ldiring:', question: '___ he arrived, we were watching TV.', blanks: ['When'], explanation: 'Arrived = punctual, bir lahzada → When.' },
        { id: 80012, type: 'fill-blank', instruction: 'When yoki While? Bo\'sh joyni to\'ldiring:', question: '___ she was studying, her brother was playing games.', blanks: ['While'], explanation: 'Ikkala harakat ham davomiy → While.' },
      ],
    },
  ],
  exercises: [
    // ── ODDIY (1-8): Har bir zamonga bitta oddiy mashq ──
    { id: 5001, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Simple Present — odat):', question: 'I ___ (drink) tea every morning before work.', blanks: ['drink'], explanation: 'Simple Present: I + V1. "Every morning" = odat signal so\'zi.' },
    { id: 5002, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Simple Present — 3-shaxs):', question: 'My sister ___ (work) at a bank in the city center.', blanks: ['works'], explanation: 'Simple Present: She/He/It + V+s. "My sister" = she.' },
    { id: 5003, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Present Continuous — hozir):', question: 'Be quiet! The baby ___ (sleep) in the next room.', blanks: ['is sleeping'], explanation: 'Present Continuous: is + V-ing. "Be quiet" = hozirgi harakat.' },
    { id: 5004, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Past Simple — o\'tmish):', question: 'We ___ (visit) our grandparents last Sunday.', blanks: ['visited'], explanation: 'Past Simple: V2. "Last Sunday" = aniq o\'tmish vaqt.' },
    { id: 5005, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Past Continuous — davom etgan):', question: 'At 9 PM yesterday, I ___ (watch) a documentary about space.', blanks: ['was watching'], explanation: 'Past Continuous: was + V-ing. "At 9 PM yesterday" = o\'tmishdagi aniq vaqt.' },
    { id: 5006, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Present Perfect — tajriba):', question: 'I ___ (never/try) sushi before. Is it good?', blanks: ['have never tried'], explanation: 'Present Perfect: have + V3 + never. "Never" = tajriba.' },
    { id: 5007, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Future Simple — reja):', question: 'I ___ (call) you when I arrive at the airport.', blanks: ['will call'], explanation: 'Future Simple: will + V1. "When I arrive" = kelajak voqeasi.' },
    { id: 5008, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing (Present Perfect — davom etish):', question: 'She ___ (live) in London since she was 18.', blanks: ['has lived'], explanation: 'Present Perfect: has + V3. "Since" = boshlanish nuqtasi.' },

    // ── O'RTACHA (9-20): Kontekstga qarab zamon tanlash ──
    { id: 5009, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'She ___ (work) here since 2020, so she knows all the procedures.', options: ['works', 'is working', 'has worked', 'worked'], correct: 'has worked', explanation: '"Since 2020" + "knows all procedures" = davom etgan + hozirgi natija → Present Perfect.' },
    { id: 5010, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'What ___ you ___ (do) last night? I called you three times.', options: ['are...doing', 'do...do', 'did...do', 'were...doing'], correct: 'did...do', explanation: '"Last night" + "called you three times" = o\'tmish voqeasi → Past Simple.' },
    { id: 5011, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'I ___ (read) an interesting article when you called me.', options: ['read', 'was reading', 'am reading', 'have read'], correct: 'was reading', explanation: '"When you called" = uzilgan harakat → Past Continuous.' },
    { id: 5012, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'It ___ (rain) tomorrow, so take an umbrella with you.', options: ['rains', 'is raining', 'will rain', 'has rained'], correct: 'will rain', explanation: '"Tomorrow" + bashorat → Future Simple.' },
    { id: 5013, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'Be careful! You ___ (drive) too fast right now.', options: ['drive', 'are driving', 'have driven', 'were driving'], correct: 'are driving', explanation: '"Right now" + ogohlantirish → Present Continuous (hozirgi xavfli holat).' },
    { id: 5014, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'I ___ (visit) Paris three times. I want to go again next year.', options: ['visited', 'visit', 'have visited', 'was visiting'], correct: 'have visited', explanation: '"Three times" + tajriba → Present Perfect.' },
    { id: 5015, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'He ___ (not/finish) his homework yet. The teacher will be angry.', options: ["didn't finish", "doesn't finish", "hasn't finished", "wasn't finishing"], correct: "hasn't finished", explanation: '"Yet" + hozirgi natija → Present Perfect.' },
    { id: 5016, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'While I ___ (cook), the smoke alarm went off. I burned the food.', options: ['cooked', 'was cooking', 'cook', 'have cooked'], correct: 'was cooking', explanation: '"While" + davomiylik → Past Continuous.' },
    { id: 5017, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'We ___ (go) to the cinema last Friday. The movie was great.', options: ['go', 'have gone', 'went', 'were going'], correct: 'went', explanation: '"Last Friday" + tugallangan → Past Simple.' },
    { id: 5018, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'Please don\'t make noise. She ___ (have) an important meeting right now.', options: ['has', 'is having', 'had', 'will have'], correct: 'is having', explanation: '"Right now" + vaqtinchalik holat → Present Continuous.' },
    { id: 5019, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'I ___ (study) English for five years, but I still can\'t speak fluently.', options: ['studied', 'am studying', 'have been studying', 'study'], correct: 'have been studying', explanation: '"For five years" + davom etayotgan → Present Perfect Continuous.' },
    { id: 5020, type: 'multiple-choice', instruction: 'Kontekstga qarab to\'g\'ri zamoni tanlang:', question: 'When I ___ (arrive) at the party, everyone ___ (dance) and ___ (have) fun.', options: ['arrived...were dancing...were having', 'arrive...are dancing...are having', 'had arrived...were dancing...had', 'was arriving...danced...had'], correct: 'arrived...were dancing...were having', explanation: 'Past Simple (arrived) + Past Continuous (were dancing, were having) = kelgan paytda boshqalar davom ettirgan.' },

    // ── O'RTACHA (21-28): Xato tuzatish ──
    { id: 5021, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'I have visited Paris yesterday.', errorPart: 'have visited', correct: 'I visited Paris yesterday.', explanation: '"Yesterday" = Past Simple kerak. Present Perfect + aniq o\'tmish vaqt BO\'LMAYDI!' },
    { id: 5022, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'She is knowing the answer to this question.', errorPart: 'is knowing', correct: 'She knows the answer to this question.', explanation: '"Know" = state verb, Present Continuous olmaydi. Faqat Simple Present.' },
    { id: 5023, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'I was reading when he has called me.', errorPart: 'has called', correct: 'I was reading when he called me.', explanation: '"When" dan keyin Past Simple kerak (punctual). Has called = Present Perfect, noto\'g\'ri.' },
    { id: 5024, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'He will can help you with your homework.', errorPart: 'will can', correct: 'He will help you with your homework.', explanation: '"Will" dan keyin faqat V1 keladi. Modal fe\'llar (can, could, would) birga ishlatilmaydi.' },
    { id: 5025, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'She has went to school early today.', errorPart: 'has went', correct: 'She has gone to school early today.', explanation: 'Present Perfect: have/has + V3. "Go" ning V3 si "gone" (went emas!).' },
    { id: 5026, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'I have been here since three hours.', errorPart: 'since three hours', correct: 'I have been here for three hours.', explanation: '"Three hours" = vaqt oralig\'i → "for" kerak. "Since" faqat aniq nuqta bilan.' },
    { id: 5027, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'While I was sleeping, the phone rings.', errorPart: 'rings', correct: 'While I was sleeping, the phone rang.', explanation: '"While" dan keyin ham o\'tmish (Past Simple) kerak.' },
    { id: 5028, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'rini yozing:', question: 'She has been to Paris since three times.', errorPart: 'since three times', correct: 'She has been to Paris three times.', explanation: '"Three times" = tajriba. "Since" kerak emas, "for" ham kerak emas.' },

    // ── O'RTACHA (29-34): Qayta yozish ──
    { id: 5029, type: 'transformation', instruction: 'Inkoriy gapga o\'zgartiring:', question: 'She works every day at the same time.', hint: 'Negative:', correct: "She doesn't work every day at the same time.", explanation: 'Simple Present inkor: doesn\'t + V1 (works → doesn\'t work).' },
    { id: 5030, type: 'transformation', instruction: 'Savol gapga o\'zgartiring:', question: 'He has finished his homework.', hint: 'Question:', correct: 'Has he finished his homework?', explanation: 'Present Perfect savol: Has + Subject + V3?' },
    { id: 5031, type: 'transformation', instruction: 'Past Continuous ga o\'zgartiring:', question: 'I read a book at 8 PM yesterday.', hint: 'Past Continuous:', correct: 'I was reading a book at 8 PM yesterday.', explanation: 'Past Simple (read) → Past Continuous (was reading) + "at 8 PM yesterday".' },
    { id: 5032, type: 'transformation', instruction: 'Present Perfect ga o\'zgartiring:', question: 'I went to London three times.', hint: 'Present Perfect:', correct: 'I have been to London three times.', explanation: 'Past Simple → Present Perfect: went → have been (tajriba).' },
    { id: 5033, type: 'transformation', instruction: 'Future Simple ga o\'zgartiring:', question: 'I go to school every day.', hint: 'Future (tomorrow):', correct: 'I will go to school tomorrow.', explanation: 'Simple Present → Future Simple: go → will go + "tomorrow".' },
    { id: 5034, type: 'transformation', instruction: 'When + Past Simple ga o\'zgartiring:', question: 'I was reading. The phone rang.', hint: 'Combine with "when":', correct: 'I was reading when the phone rang.', explanation: 'Past Continuous + when + Past Simple = uzilgan harakat.' },

    // ── QIYIN (35-42): 2 ta zamon bir gapda ──
    { id: 5035, type: 'fill-blank', instruction: '2 ta zamon — Past Continuous + Past Simple:', question: 'I ___ (study) when my mother ___ (call) me for dinner.', blanks: ['was studying', 'called'], explanation: 'Past Continuous (was studying) + when + Past Simple (called).' },
    { id: 5036, type: 'fill-blank', instruction: '2 ta zamon — Present Perfect + Present Simple:', question: 'She ___ (live) in London for 10 years, so she ___ (know) every street.', blanks: ['has lived', 'knows'], explanation: 'Present Perfect (has lived) = davom etish + Present Simple (knows) = hozirgi natija.' },
    { id: 5037, type: 'fill-blank', instruction: '2 ta zamon — Past Continuous + while + Past Continuous:', question: 'While she ___ (cook), I ___ (set) the table.', blanks: ['was cooking', 'was setting'], explanation: 'Ikkala harakat ham parallel davom etgan → Past Continuous + while + Past Continuous.' },
    { id: 5038, type: 'fill-blank', instruction: '2 ta zamon — Present Perfect + Future Simple:', question: 'I ___ (never/go) to Russia, but I ___ (travel) there next month.', blanks: ["have never gone", "will travel"], explanation: 'Present Perfect (tajriba — never) + Future Simple (reja — next month).' },
    { id: 5039, type: 'fill-blank', instruction: '2 ta zamon — Past Simple + because + Past Continuous:', question: 'She was late because she ___ (miss) the bus while she ___ (get) dressed.', blanks: ['missed', 'was getting'], explanation: 'Past Simple (missed) + because + Past Simple + while + Past Continuous (was getting).' },
    { id: 5040, type: 'fill-blank', instruction: '2 ta zamon — Future Simple + when + Present Simple:', question: 'I ___ (call) you when I ___ (arrive) at the airport.', blanks: ['will call', 'arrive'], explanation: 'Future Simple (will call) + when + Present Simple (arrive) — kelajak shartida!' },

    // ── QIYIN (41-44): To\'g\'ri gapni tanlash ──
    { id: 5041, type: 'multiple-choice', instruction: 'Qaysi gap GRAMMATIK JIHATDAN TO\'G\'RI?', question: 'Which sentence is grammatically correct?', options: ['I have seen him yesterday', 'I saw him yesterday', 'I see him yesterday', 'I was seeing him yesterday'], correct: 'I saw him yesterday', explanation: '"Yesterday" = Past Simple. Present Perfect + aniq o\'tmish vaqt = xato.' },
    { id: 5042, type: 'multiple-choice', instruction: 'Qaysi gap GRAMMATIK JIHATDAN TO\'G\'RI?', question: 'Which sentence is grammatically correct?', options: ['She has been to Paris twice', 'She has gone to Paris twice', 'She went Paris twice', 'She is going Paris twice'], correct: 'She has been to Paris twice', explanation: 'Tajriba (twice) + speaker is here → have been. "Went Paris" = preposition yo\'q (to kerak).' },
    { id: 5043, type: 'multiple-choice', instruction: 'Qaysi gap GRAMMATIK JIHATDAN TO\'G\'RI?', question: 'Which sentence is grammatically correct?', options: ['I was sleeping when he arrived', 'I was sleeping when he has arrived', 'I slept when he arrived', 'I have slept when he arrived'], correct: 'I was sleeping when he arrived', explanation: 'Past Continuous + when + Past Simple — to\'g\'ri konstruksiya.' },

    // ── QIYIN (44-46): Matn ichida bo\'sh joyni to\'ldirish ──
    { id: 5044, type: 'passage', instruction: 'Matndagi bo\'sh joylarni to\'ldiring — hikoya:', passage: 'Last summer, my family and I ___ (travel) to Istanbul. We ___ (stay) there for ten days. On the first day, we ___ (visit) the famous Blue Mosque. While we ___ (walk) through the old bazaar, I ___ (see) a beautiful Turkish carpet. I ___ (never/see) such a beautiful carpet before, so I ___ (buy) it immediately. My mother ___ (think) it was too expensive, but my father ___ (say) it was worth every penny. We ___ (have) an amazing time in Turkey. I ___ (want) to go back next summer, and I ___ (promise) my father I will save enough money.',
      blanks: ['traveled', 'stayed', 'visited', 'was walking', 'saw', 'had never seen', 'bought', 'thought', 'said', 'had', 'want', 'promise'],
      explanation: 'Past Simple: traveled, stayed, visited, saw, bought, thought, said, had. Past Continuous: was walking. Present Perfect: had never seen. Present Simple: want, promise (kelajak reja).'
    },
    { id: 5045, type: 'passage', instruction: 'Matndagi bo\'sh joylarni to\'ldiring — suhbat:', passage: 'Ali: What ___ (you/do) right now?\nBek: I ___ (prepare) dinner. What about you?\nAli: I ___ (read) an interesting book. I ___ (start) it last week and I ___ (already/read) 200 pages.\nBek: What ___ it ___ (be) about?\nAli: It ___ (be) about a man who ___ (travel) around the world.\nBek: That ___ (sound) interesting. I ___ (read) it when I ___ (finish) my current book.\nAli: You should! I ___ (think) you ___ (enjoy) it.',
      blanks: ['are', 'doing', 'am preparing', 'am reading', 'started', 'have already read', 'is', 'is', 'travels', 'sounds', 'will read', 'finish', 'think', 'will enjoy'],
      explanation: 'Present Continuous: are doing, am preparing, am reading. Past Simple: started. Present Perfect: have already read. Simple Present: is, travels, sounds, think. Future Simple: will read, will enjoy. Present Simple (shart): finish.'
    },
  ],
  exerciseSections: [
    { title: '🌱 Oddiy — Har bir zamon', desc: '6 ta zamonning har biriga bitta oddiy mashq', color: 'bg-emerald-500', icon: '🌱', ids: [5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008] },
    { title: '📘 Kontekst — Qaysi zamon?', desc: 'Matn ma\'nosiga qarab to\'g\'ri zamonni tanlang', color: 'bg-blue-500', icon: '📘', ids: [5009, 5010, 5011, 5012, 5013, 5014, 5015, 5016, 5017, 5018, 5019, 5020] },
    { title: '🔧 Xato tuzatish', desc: 'Noto\'g\'ri gaplarni toping va to\'g\'rilang', color: 'bg-purple-500', icon: '🔧', ids: [5021, 5022, 5023, 5024, 5025, 5026, 5027, 5028] },
    { title: '✍️ Qayta yozish', desc: 'Gaplarni boshqa zamonga o\'zgartiring', color: 'bg-amber-500', icon: '✍️', ids: [5029, 5030, 5031, 5032, 5033, 5034] },
    { title: '💪 Murakkab — 2 ta zamon', desc: 'Bitta gapda 2 ta zamon ishlating', color: 'bg-violet-500', icon: '💪', ids: [5035, 5036, 5037, 5038, 5039, 5040, 5041, 5042, 5043] },
    { title: '🏆 Matn — yakuniy sinov', desc: 'Hikoya va suhbat ichida zamonlarni qo\'llang', color: 'bg-rose-500', icon: '🏆', ids: [5044, 5045] },
  ],
  tests: [
    // ── OSON (1-8): Asosiy qoidalar ──
    { id: 5101, type: 'multiple-choice', instruction: 'Asosiy qoida — Simple Present', question: 'Simple Present qanday yasaladi?', options: ['I + V1, He + V1+s/-es', 'I + am + V-ing', 'I + have/has + V3', 'I + will + V1'], correct: 'I + V1, He + V1+s/-es', explanation: 'Simple Present: I/You/We/They + V1; He/She/It + V1+s/-es.' },
    { id: 5102, type: 'multiple-choice', instruction: 'Asosiy qoida — Present Continuous', question: 'Present Continuous qanday yasaladi?', options: ['I + V1', 'I + am + V-ing', 'I + have + V3', 'I + was + V-ing'], correct: 'I + am + V-ing', explanation: 'Present Continuous: am/is/are + V-ing.' },
    { id: 5103, type: 'multiple-choice', instruction: 'Asosiy qoida — Past Simple', question: 'Past Simple qanday yasaladi?', options: ['I + was + V-ing', 'I + have + V3', 'I + V2 (went, saw, ate)', 'I + will + V1'], correct: 'I + V2 (went, saw, ate)', explanation: 'Past Simple: fe\'lning o\'tmish shakli (V2).' },
    { id: 5104, type: 'multiple-choice', instruction: 'Asosiy qoida — Future Simple', question: 'Future Simple qanday yasaladi?', options: ['I + V1', 'I + am + V-ing', 'I + have + V3', 'I + will + V1'], correct: 'I + will + V1', explanation: 'Future Simple: will + V1 (asl shakl).' },
    { id: 5105, type: 'multiple-choice', instruction: 'Asosiy qoida — Present Perfect', question: 'Present Perfect qanday yasaladi?', options: ['I + V1', 'I + am + V-ing', 'I + have/has + V3', 'I + was + V-ing'], correct: 'I + have/has + V3', explanation: 'Present Perfect: have/has + V3 (uchinchi shakl).' },
    { id: 5106, type: 'multiple-choice', instruction: 'Asosiy qoida — Past Continuous', question: 'Past Continuous qanday yasaladi?', options: ['I + V2', 'I + was/were + V-ing', 'I + have + V3', 'I + will + V1'], correct: 'I + was/were + V-ing', explanation: 'Past Continuous: was/were + V-ing.' },
    { id: 5107, type: 'multiple-choice', instruction: 'Asosiy qoida — 3-shaxs', question: 'He/She/It bilan Present Simple da fe\'lga nima qo\'shiladi?', options: ['-ing', '-ed', '-s/-es', '-en'], correct: '-s/-es', explanation: 'He/She/It + V1+s/-es: works, plays, watches.' },
    { id: 5108, type: 'multiple-choice', instruction: 'Asosiy qoida — V3', question: '"Go" fe\'lning V3 si nima?', options: ['went', 'gone', 'going', 'goes'], correct: 'gone', explanation: 'Go (V1) → went (V2) → gone (V3).' },

    // ── O'RTACHA (9-14): Signal so'zlar ──
    { id: 5109, type: 'multiple-choice', instruction: 'Signal so\'zlari — odat', question: '"Every day" qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple'], correct: 'Present Simple', explanation: '"Every day" = har kuni = odat = Simple Present.' },
    { id: 5110, type: 'multiple-choice', instruction: 'Signal so\'zlari — hozirgi', question: '"Right now" qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Present Perfect'], correct: 'Present Continuous', explanation: '"Right now" = hozirgi lahzada = Present Continuous.' },
    { id: 5111, type: 'multiple-choice', instruction: 'Signal so\'zlari — o\'tmish', question: '"Yesterday" qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Perfect', 'Past Simple', 'Future Simple'], correct: 'Past Simple', explanation: '"Yesterday" = kecha = Past Simple.' },
    { id: 5112, type: 'multiple-choice', instruction: 'Signal so\'zlari — tajriba', question: '"Since 2020" qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Perfect', 'Past Simple', 'Past Continuous'], correct: 'Present Perfect', explanation: '"Since 2020" = 2020-dan beri = Present Perfect.' },
    { id: 5113, type: 'multiple-choice', instruction: 'Signal so\'zlari — kelajak', question: '"Tomorrow" qaysi zamon signal so\'zi?', options: ['Present Simple', 'Past Simple', 'Future Simple', 'Present Perfect'], correct: 'Future Simple', explanation: '"Tomorrow" = ertaga = Future Simple.' },
    { id: 5114, type: 'multiple-choice', instruction: 'Signal so\'zlari — tajriba', question: '"Never" qaysi zamon bilan keladi?', options: ['Past Simple', 'Present Perfect', 'Future Simple', 'Present Continuous'], correct: 'Present Perfect', explanation: '"Never" (hech qachon) = tajriba = Present Perfect: I have never seen.' },

    // ── O'RTACHA (15-18): Taqqoslash ──
    { id: 5115, type: 'multiple-choice', instruction: 'Taqqoslash — odat vs hozir', question: '"I drink tea every day" vs "I am drinking tea now" — farq nima?', options: ['Ikkalasi ham bir xil', 'Birinchi = hozir, ikkinchi = odat', 'Birinchi = odat, ikkinchi = hozir', 'Birinchi = o\'tmish, ikkinchi = hozir'], correct: 'Birinchi = odat, ikkinchi = hozir', explanation: 'Simple Present = odat (every day). Present Continuous = hozir (now).' },
    { id: 5116, type: 'multiple-choice', instruction: 'Taqqoslash — tugallangan vs natija', question: '"I visited Paris" vs "I have visited Paris" — farq nima?', options: ['Ikkalasi ham bir xil', 'Birinchi = o\'tmish tugallangan, ikkinchi = hozirgi tajriba', 'Birinchi = hozir, ikkinchi = o\'tmish', 'Ikkalasi ham hozir'], correct: 'Birinchi = o\'tmish tugallangan, ikkinchi = hozirgi tajriba', explanation: 'Past Simple = o\'tmish voqeasi. Present Perfect = tajriba (hozir ham amal qiladi).' },
    { id: 5117, type: 'multiple-choice', instruction: 'Taqqoslash — davom vs tugallangan', question: '"I was reading" vs "I read" — farq nima?', options: ['Ikkalasi ham bir xil', 'Birinchi = davom etgan, ikkinchi = tugallangan', 'Birinchi = hozir, ikkinchi = o\'tmish', 'Birinchi = kelajak, ikkinchi = o\'tmish'], correct: 'Birinchi = davom etgan, ikkinchi = tugallangan', explanation: 'Past Continuous = davom etgan (was reading). Past Simple = tugallangan (read).' },
    { id: 5118, type: 'multiple-choice', instruction: 'Taqqoslash — for vs since', question: '"for 5 years" vs "since 2019" — farq nima?', options: ['Ikkalasi ham bir xil', 'Birinchi = davomiylik, ikkinchi = boshlanish', 'Birinchi = boshlanish, ikkinchi = davomiylik', 'Birinchi = o\'tmish, ikkinchi = kelajak'], correct: 'Birinchi = davomiylik, ikkinchi = boshlanish', explanation: 'For = vaqt oralig\'i (davomiylik). Since = boshlanish nuqtasi.' },

    // ── QIYIN (19-26): Murakkab tanlov ──
    { id: 5119, type: 'multiple-choice', instruction: 'Murakkab — kontekst', question: 'Which is correct? "She ___ to Paris yesterday."', options: ['has been', 'has gone', 'went', 'goes'], correct: 'went', explanation: '"Yesterday" = Past Simple (aniq o\'tmish vaqt). Present Perfect emas!' },
    { id: 5120, type: 'multiple-choice', instruction: 'Murakkab — state verb', question: 'Which is correct? "I ___ the answer right now."', options: ['am knowing', 'know', 'knew', 'was knowing'], correct: 'know', explanation: '"Know" = state verb, Present Continuous olmaydi. Simple Present.' },
    { id: 5121, type: 'multiple-choice', instruction: 'Murakkab — when/while', question: 'Which is correct? "___ I was cooking, the phone rang."', options: ['When', 'While', 'If', 'Because'], correct: 'While', explanation: '"While" + davomiylik (was cooking) + Past Simple (rang).' },
    { id: 5122, type: 'multiple-choice', instruction: 'Murakkab — tajriba', question: '"I ___ this book three times."', options: ['read', 'am reading', 'have read', 'was reading'], correct: 'have read', explanation: '"Three times" = tajriba = Present Perfect.' },
    { id: 5123, type: 'multiple-choice', instruction: 'Murakkab — when + Past Simple', question: '"She ___ dinner when I ___ home."', options: ['cooked...came', 'was cooking...came', 'was cooking...was coming', 'cooked...was coming'], correct: 'was cooking...came', explanation: 'Past Continuous (was cooking) + when + Past Simple (came).' },
    { id: 5124, type: 'multiple-choice', instruction: 'Murakkab — V3', question: 'Which is correct? "He has ___ to school."', options: ['went', 'gone', 'go', 'going'], correct: 'gone', explanation: 'Present Perfect: has + V3. Go → went (V2) → gone (V3).' },
    { id: 5125, type: 'multiple-choice', instruction: 'Murakkab — since', question: '"I ___ in Tashkent ___ 2015."', options: ['live...since', 'have lived...since', 'have lived...for', 'am living...since'], correct: 'have lived...since', explanation: 'Since = boshlanish nuqtasi (2015) → Present Perfect.' },
    { id: 5126, type: 'multiple-choice', instruction: 'Murakkab — doesn\'t', question: 'Which is correct? "She ___ like coffee."', options: ["doesn't likes", "doesn't like", "not like", "isn't like"], correct: "doesn't like", explanation: 'doesn\'t + V1 (like, likes emas!).' },

    // ── YUQORI DARAJA (27-30): Darajali taqqoslash ──
    { id: 5127, type: 'multiple-choice', instruction: 'Yuqori daraja — sabab-natija', question: '"I ___ English for five years, but I still can\'t speak fluently."', options: ['study', 'am studying', 'have studied', 'studied'], correct: 'have studied', explanation: '"For five years" + "still can\'t" = davom etgan + hozirgi natija → Present Perfect.' },
    { id: 5128, type: 'multiple-choice', instruction: 'Yuqori daraja — shart', question: '"If it ___ tomorrow, we will cancel the picnic."', options: ['rains', 'will rain', 'rained', 'is raining'], correct: 'rains', explanation: 'First conditional: if + Present Simple, ... will + V1.' },
    { id: 5129, type: 'multiple-choice', instruction: 'Yuqori daraja — birlashtirilgan', question: '"She ___ all her life in this city, so she ___ every street."', options: ['lived...knows', 'has lived...knows', 'lives...has known', 'has lived...has known'], correct: 'has lived...knows', explanation: 'Present Perfect (davom etish) + Present Simple (hozirgi bilim).' },
    { id: 5130, type: 'multiple-choice', instruction: 'Yuqori daraja — parallel', question: '"While she ___ dinner, he ___ the table."', options: ['cooked...set', 'was cooking...was setting', 'was cooking...set', 'cooking...setting'], correct: 'was cooking...was setting', explanation: 'Ikkala harakat ham parallel → Past Continuous + while + Past Continuous.' },
  ],
  testSections: [
    { title: '🌱 Oson', desc: 'Asosiy qoidalar va V3', color: 'bg-emerald-500', icon: '🌱', ids: [5101, 5102, 5103, 5104, 5105, 5106, 5107, 5108] },
    { title: '📘 O\'rtacha', desc: 'Signal so\'zlar va taqqoslash', color: 'bg-blue-500', icon: '📘', ids: [5109, 5110, 5111, 5112, 5113, 5114, 5115, 5116, 5117, 5118] },
    { title: '💪 Qiyin', desc: 'Murakkab tanlov va xatolar', color: 'bg-violet-500', icon: '💪', ids: [5119, 5120, 5121, 5122, 5123, 5124, 5125, 5126] },
    { title: '🏆 Yuqori daraja', desc: 'Darajali taqqoslash', color: 'bg-rose-500', icon: '🏆', ids: [5127, 5128, 5129, 5130] },
  ],
}
