import type { DailyLesson } from '../dailyLessons'

// ─── B2: Advanced Relative Clauses ───────────────────────────────────────────
// Cover: reduced relative clauses (present/past participle),
//        preposition + relative pronouns (formal),
//        compound relative pronouns (whoever, whatever, whichever),
//        relative clauses with quantifiers (many of whom, some of which),
//        which referring to whole clause

export const advancedRelativeClausesB2: DailyLesson = {
  id: 'advanced-relative-clauses-b2',
  speaking: {
    prompt: "Describe a place, an institution, or a group of people using advanced relative clauses. Speak for about one minute. Use reduced relatives, preposition + which/whom, quantifier + of whom/which, and 'whereby'.",
    tips: [
      "Reduced: 'the man sitting there' (= who is sitting).",
      "'many of whom', 'most of which'.",
      "'the person to whom I spoke' (rasmiy).",
      "'the system whereby...' — usul/mexanizm.",
    ],
    sampleAnswer: "Let me describe my university, which I am very proud of. It has thousands of students, many of whom come from other countries. The professors, most of whom have studied abroad, are highly experienced. There is a special system whereby students can choose their own subjects. The building standing at the entrance, which was built a century ago, is beautiful. The people with whom I study have become close friends. The library, in which I spend most of my time, is enormous. It is a place that has shaped my future, and for which I will always be grateful.",
  },
  title: 'Advanced Relative Clauses (B2)',
  subtitle: "Reduced clauses, preposition+relative, compounds — murakkab nisbiy gaplar",
  level: 'B2',
  day: 1,
  category: 'Complex Structures',
  listening: {
    transcript: "Professor: Today we'll discuss advanced relative clauses. First, reduced relatives. The man sitting at the desk is our director. That's shorter than saying 'the man who is sitting at the desk'.\nStudent: So we drop the pronoun and 'be' verb?\nProfessor: Exactly. For passive: 'The research conducted last year showed great results' instead of 'which was conducted'.\nStudent: What about formal writing? I've seen 'the person to whom I spoke'.\nProfessor: Yes! Preposition + whom/which is formal. In speech we say 'the person who I spoke to'.\nStudent: And 'whoever' vs 'who'?\nProfessor: 'Whoever' means 'anyone who'. 'Whoever arrives first can start.'\nStudent: What about 'many of whom'?\nProfessor: That's a quantifier + relative pronoun. 'The students, many of whom passed, were happy.'\nStudent: One more — can 'which' refer to a whole sentence?\nProfessor: Yes! 'He was late, which surprised everyone.'",
    vocabulary: [
      { word: 'reduced relative', definition: "qisqartirilgan nisbiy gap" },
      { word: 'compound relative', definition: "qo'shma nisbiy olmosh (whoever, whatever)" },
      { word: 'quantifier', definition: "miqdor so'zi (many, some, all)" },
      { word: 'formal register', definition: "rasmiy uslub" },
      { word: 'refer to', definition: "ishora qilmoq" },
    ],
    questions: [
      { id: 880001, type: 'multiple-choice', question: "What is 'The man sitting at the desk' an example of?", options: ["Full relative clause", "Reduced relative clause", "Compound relative", "Preposition + relative"], correctIndex: 1, explanation: "'Sitting' = reduced form of 'who is sitting'." },
      { id: 880002, type: 'multiple-choice', question: "How do we form passive reduced relatives?", options: ["Use V+ing", "Use V³ (past participle)", "Use 'being'", "Use 'having'"], correctIndex: 1, explanation: "Passive: 'conducted' = 'which was conducted' (V³)." },
      { id: 880003, type: 'true-false', question: "'The person to whom I spoke' is informal.", answer: false, explanation: "Preposition + whom is FORMAL. Informal: 'the person who I spoke to'." },
      { id: 880004, type: 'multiple-choice', question: "What does 'whoever' mean?", options: ["Only one person", "Anyone who", "No one", "Someone specific"], correctIndex: 1, explanation: "'Whoever' = 'anyone who' — a compound relative pronoun." },
      { id: 880005, type: 'multiple-choice', question: "In 'He was late, which surprised everyone', what does 'which' refer to?", options: ["The person", "The whole clause 'He was late'", "The time", "Everyone"], correctIndex: 1, explanation: "'Which' can refer to the entire preceding clause." },
    ],
    difficulty: 'hard',
    topic: "Murakkab nisbiy gaplar — reduced, preposition+relative, compounds",
  },
  writing: {
    prompt: "Write a formal paragraph (100-120 words) about a person who has influenced your life. Use at least two reduced relative clauses (e.g., 'The person inspiring me...'), one preposition + relative pronoun structure (e.g., 'the person to whom I look up'), and one sentence with 'which' referring to a whole clause.",
    modelAnswer: "The person who has shaped my character most is my grandmother, a woman admired by everyone in our village. Raised in difficult times, she learned the value of patience. She was someone to whom I could always turn for advice. The lessons taught by her, which I still remember today, have guided every important decision in my life. She encouraged me to study hard, which completely changed my future. She remains the person on whom my values are built.",
    wordLimit: 120,
    tips: [
      "Use reduced relatives: 'The person inspiring me most is...'",
      "Use passive reduced: 'The lessons learned from her are...'",
      "Use preposition + whom/which for formal tone",
      "End with a 'which' clause referring to your whole sentence",
    ],
  },
  formulas: [
    {
      color: "green",
      label: "Reduced Relative (Active)",
      structure: "Noun + V+ing (replaces who/which + be + V+ing)\n  The man sitting there = The man who is sitting there",
      explanation: "Active reduced relative — 'who/which + be' ni olib tashlab, V+ing qoldiriladi. Faqat defining relative clauses da mumkin.",
      whenToUse: "Gapni qisqartirish va zamonaviy uslubda yozish uchun. Faqat 'be' fe'li bo'lgan relative clauselarda.",
      example: "The students waiting outside are cold. (Kutayotgan talabalar sovuq qotib turibdi)"
    },
    {
      color: "orange",
      label: "Reduced Relative (Passive)",
      structure: "Noun + V³ (replaces who/which + be + V³)\n  The book published in 2020 was a bestseller.",
      explanation: "Passive reduced relative — 'who/which + be' ni olib tashlab, V³ (past participle) qoldiriladi.",
      whenToUse: "Passiv relative clauselarni qisqartirish uchun. 'Which was written' → 'written'.",
      example: "The research conducted last year is groundbreaking. (O'tgan yili o'tkazilgan tadqiqot)"
    },
    {
      color: "blue",
      label: "Preposition + Relative Pronoun",
      structure: "Preposition + whom (people) / which (things)\n  The person to whom I spoke was helpful.",
      explanation: "Rasmiy (formal) ingliz tilida prepozitsiya relative pronoundan oldin keladi. Norasmiyda prepozitsiya gap oxirida qoladi.",
      whenToUse: "Rasmiy yozma ishlarda, akademik matnlarda, IELTS/CEFR yuqori ball uchun.",
      example: "The company for which I work is global. (Men ishlaydigan kompaniya global)"
    },
    {
      color: "purple",
      label: "Compound Relative Pronouns",
      structure: "whoever / whatever / whichever / whenever / wherever\n  Whoever arrives first can start.",
      explanation: "Qo'shma nisbiy olmoshlar: whoever = anyone who, whatever = anything that, whichever = any that, whenever = any time when, wherever = any place where.",
      whenToUse: "Noaniq yoki umumiy shaxs/narsa/vaqt/joy haqida gapirganda.",
      example: "You can choose whatever you like. (Xohlagan narsangizni tanlashingiz mumkin)"
    },
    {
      color: "red",
      label: "Quantifier + Relative Pronoun",
      structure: "many / some / all / most / none + of + whom / which\n  The students, many of whom passed, were relieved.",
      explanation: "Miqdor so'zlaridan keyin 'of whom' (odamlar) yoki 'of which' (narsalar) ishlatiladi. Bu B2 darajasidagi murakkab tuzilma.",
      whenToUse: "Bir guruhning qanchasi haqida ma'lumot berishda. Non-defining relative clause bilan ishlatiladi.",
      example: "The books, most of which were old, were donated. (Ko'pchiligi eski bo'lgan kitoblar)"
    },
  ],
  rules: [
    "1️⃣ REDUCED RELATIVE CLAUSES (ACTIVE)\n\nDefining relative clauseni qisqartirish: 'who/which + be' ni olib tashlab, V+ing qoldiriladi.\n\n📌 To'liq: The man who is sitting there is my brother.\n📌 Qisqa: The man sitting there is my brother.\n\n📌 Faqat 'be' fe'li bo'lganda ishlaydi: 'who is', 'which are', 'who was'\n📌 Active → V+ing ishlatiladi: 'the woman wearing a hat'\n\n❌ The man sits there is my brother. (V+ing emas → XATO)\n✅ The man sitting there is my brother.",

    "2️⃣ REDUCED RELATIVE CLAUSES (PASSIVE)\n\nPassive relative clauseni qisqartirish: 'which was / who were' ni tashlab, V³ (past participle) qoldiriladi.\n\n📌 To'liq: The book which was written by her became famous.\n📌 Qisqa: The book written by her became famous.\n\n📌 Passive → V³ (past participle) ishlatiladi\n\n🔴 Active va Passive reduced farqiga e'tibor bering!\n  → The man driving the car (active: u haydayapti)\n  → The car driven by him (passive: u boshqaradi)\n\n❌ The book writing by her... (active → XATO, passive kerak)\n✅ The book written by her...",

    "3️⃣ PREPOSITION + RELATIVE PRONOUN (FORMAL)\n\nRasmiy uslubda prepozitsiya relative pronoundan oldin keladi:\n\n📌 The person to whom I spoke → Men gaplashgan odam\n📌 The company for which I work → Men ishlaydigan kompaniya\n📌 The reason for which she left → Uning ketish sababi\n\n📌 Norasmiy uslubda prepozitsiya gap oxirida:\n  → The person who I spoke to...\n  → The company which I work for...\n\n🔴 Qoida: odam → whom, narsa → which\n🔴 'Whom' rasmiy, 'who' norasmiy\n\n❌ The person to who I spoke... (to who → XATO, to whom kerak)\n✅ The person to whom I spoke...",

    "4️⃣ COMPOUND RELATIVE PRONOUNS\n\nQo'shma nisbiy olmoshlar — 'ever' qo'shimchasi orqali umumiy ma'no beradi:\n\n📌 Whoever = anyone who: Whoever wins gets a prize.\n📌 Whatever = anything that: Eat whatever you want.\n📌 Whichever = any one that: Choose whichever you like.\n📌 Whenever = any time when: Come whenever you can.\n📌 Wherever = any place where: Sit wherever you like.\n\n📌 Bu so'zlar gapda subject yoki object bo'lishi mumkin.\n📌 IELTS TIP: Compound relative pronouns — Band 7+ uchun muhim grammatik vosita.",

    "5️⃣ WHICH REFERRING TO A WHOLE CLAUSE\n\n'Which' butun bir oldingi gapga ishora qilishi mumkin (non-defining).\n\n📌 He passed the exam, which surprised everyone.\n📌 She was late, which made the boss angry.\n📌 They got married, which delighted their families.\n\n🔴 Bu non-defining relative clause — vergul bilan ajratiladi.\n🔴 'That' bu yerda ishlatilmaydi!\n\n📌 'Which' butun gapga ishora qiladi, birgina otga EMAS.",

    "6️⃣ QUANTIFIER + RELATIVE PRONOUN\n\nSome/many/all/most/several/none + of + whom/which\n\n📌 The students, most of whom passed, celebrated.\n📌 The projects, several of which failed, were reviewed.\n📌 The teachers, all of whom are qualified, work hard.\n\n🔴 Bu non-defining relative clause — vergul bilan ajratiladi.\n🔴 Odamlar → of whom, narsalar → of which.\n\n📌 IELTS TIP: Quantifier + relative pronoun — akademik yozuvda juda foydali, Band 7+ uchun muhim.",

    "7️⃣ O'ZBEKCHA XATOLAR\n\n📌 Reduced relative da V+ing va V³ farqini aralashtirish:\n  ❌ The book writing by him... (write = active, book = passive)\n  ✅ The book written by him...\n\n📌 Preposition + whom o'rniga 'to who' ishlatish:\n  ❌ The person to who I spoke...\n  ✅ The person to whom I spoke...\n\n📌 'Which' butun gapga ishora qilganda 'that' ishlatish:\n  ❌ He passed, that surprised everyone.\n  ✅ He passed, which surprised everyone.\n\n📌 Reduced relative ni noto'g'ri qo'llash:\n  ❌ The man sits there is my brother. (full verb not V+ing)\n  ✅ The man sitting there is my brother.",
  ],
  vocabulary: [
    { en: 'reduced relative clause', uz: "qisqartirilgan nisbiy gap", example: "The man sitting there is my uncle.", rule: "V+ing / V³ replaces full clause" },
    { en: 'compound relative pronoun', uz: "qo'shma nisbiy olmosh", example: "Whoever arrives first can start.", rule: "whoever/whatever/whichever" },
    { en: 'preposition + relative', uz: "predlog + nisbiy olmosh", example: "The person to whom I spoke.", rule: "formal: to whom, for which" },
    { en: 'quantifier + relative', uz: "miqdor + nisbiy olmosh", example: "The students, many of whom passed.", rule: "some/most/all of whom/which" },
    { en: 'sentential relative', uz: "gapga ishora qiluvchi nisbiy", example: "He was late, which surprised me.", rule: "which → whole clause" },
    { en: 'whoever', uz: "kimki bo'lsa", example: "Whoever wants to join can come.", rule: "compound = anyone who" },
    { en: 'whatever', uz: "nima bo'lsa ham", example: "Eat whatever you like.", rule: "compound = anything that" },
    { en: 'whichever', uz: "qaysi biri bo'lsa", example: "Choose whichever you prefer.", rule: "compound = any that" },
    { en: 'whenever', uz: "qachon bo'lsa ham", example: "Visit whenever you have time.", rule: "compound = any time when" },
    { en: 'wherever', uz: "qayerda bo'lsa ham", example: "Sit wherever you find a seat.", rule: "compound = any place where" },
    { en: 'formal register', uz: "rasmiy uslub", example: "The company for which I work.", rule: "preposition + whom/which" },
    { en: 'informal register', uz: "norasmiy uslub", example: "The company which I work for.", rule: "preposition at end" },
    { en: 'past participle', uz: "o'tgan zamon sifatdoshi", example: "The book written by her.", rule: "V³ for passive reduced" },
    { en: 'present participle', uz: "hozirgi zamon sifatdoshi", example: "The girl singing on stage.", rule: "V+ing for active reduced" },
    { en: 'omission', uz: "tushirib qoldirish", example: "Reduced = omission of who/which + be.", rule: "drop pronoun + be" },
  ],
  examples: [
    { en: "The man sitting next to me is a famous writer.", uz: "Yonimda o'tirgan odam mashhur yozuvchi." },
    { en: "The research conducted last year was groundbreaking.", uz: "O'tgan yili o'tkazilgan tadqiqot kashfiyot edi." },
    { en: "The person to whom I spoke was very helpful.", uz: "Men gaplashgan odam juda yordamchi edi." },
    { en: "Whoever arrives first can start the meeting.", uz: "Kim birinchi bo'lib kelsa, majlisni boshlashi mumkin." },
    { en: "He was late, which annoyed the manager.", uz: "U kechikdi, bu menejerning jahlini chiqardi." },
    { en: "The students, most of whom passed, were relieved.", uz: "Talabalar, ko'pchiligi o'tgan, yengil nafas oldi." },
    { en: "Choose whichever option you prefer.", uz: "Qaysi variantni xohlasangiz, shuni tanlang." },
    { en: "The company for which she works is global.", uz: "U ishlaydigan kompaniya global." },
  ],
  specialCases: [
    {
      id: 'active-vs-passive-reduced',
      title: "Active va Passive Reduced farqi",
      rule: "ACTIVE: noun + V+ing (the man sitting = who is sitting). PASSIVE: noun + V³ (the book written = which was written). Agar fe'l active bo'lsa → V+ing, agar passive bo'lsa → V³.",
      mnemonic: "Active = -ing (doing), Passive = -ed/-en (done). The man DRIVING (active: u haydayapti). The car DRIVEN (passive: uni haydaydilar).",
      commonMistakes: "The book writing by the author (writing → written). The man driven the car (driven → driving).",
      examples: [
        { en: "The girl singing on stage is my cousin. (active)", uz: "Sahnada kuylayotgan qiz mening amakivachcham." },
        { en: "The song sung by her was beautiful. (passive)", uz: "U tomonidan aytilgan qo'shiq go'zal edi." },
      ],
      drills: [
        { id: 880010, type: 'fill-blank', instruction: "Reduced relative (active V+ing):", question: "The man ___ (sit) next to me is a doctor.", blanks: ['sitting'], explanation: "Active → V+ing: 'who is sitting' → 'sitting'." },
        { id: 880011, type: 'fill-blank', instruction: "Reduced relative (passive V³):", question: "The book ___ (write) by her became a bestseller.", blanks: ['written'], explanation: "Passive → V³: 'which was written' → 'written'." },
        { id: 880012, type: 'error-correction', instruction: "Xatoni toping:", question: "The man driven the car is my father.", errorPart: 'driven', correct: "The man driving the car is my father.", explanation: "Active → 'driving' (V+ing), not 'driven' (V³ passive)." },
        { id: 880013, type: 'error-correction', instruction: "Xatoni toping:", question: "The cake making by my mother was delicious.", errorPart: 'making', correct: "The cake made by my mother was delicious.", explanation: "Passive → 'made' (V³), not 'making' (V+ing active)." },
      ],
    },
    {
      id: 'preposition-relative-formal',
      title: "Preposition + Relative — Rasmiy uslub",
      rule: "Rasmiy: preposition + whom (people) / which (things). Norasmiy: preposition oxirida. 'To whom' = kimga, 'for which' = qaysi uchun, 'in which' = qaysida, 'about whom' = kim haqida.",
      mnemonic: "Rasmiy = preposition BEFORE. Norasmiy = preposition AFTER. 'The person TO WHOM' = formal. 'The person WHO... TO' = informal.",
      commonMistakes: "'To who' xato → 'to whom' kerak. 'With which' narsa uchun, 'with whom' odam uchun.",
      examples: [
        { en: "The person about whom we were talking is here. (formal)", uz: "Biz gapirgan odam shu yerda." },
        { en: "The person who we were talking about is here. (informal)", uz: "Biz gapirgan odam shu yerda." },
      ],
      drills: [
        { id: 880020, type: 'fill-blank', instruction: "Preposition + whom bilan:", question: "The person ___ whom I spoke was kind.", blanks: ['to'], explanation: "'To whom' = kimga. Formal: to + whom." },
        { id: 880021, type: 'fill-blank', instruction: "Preposition + which bilan:", question: "The company ___ which I work is large.", blanks: ['for'], explanation: "'For which' = qaysi kompaniyada. Formal: for + which." },
        { id: 880022, type: 'error-correction', instruction: "Xatoni toping:", question: "The person to who I spoke was the manager.", errorPart: 'to who', correct: "The person to whom I spoke was the manager.", explanation: "Prepositiondan keyin 'whom', 'who' emas." },
        { id: 880023, type: 'transformation', instruction: "Rasmiy shaklga o'tkazing:", question: "The person who I work with is helpful.", hint: "The person with whom...", correct: "The person with whom I work is helpful.", explanation: "Informal 'who...with' → formal 'with whom'." },
      ],
    },
    {
      id: 'compound-relatives',
      title: "Compound Relative Pronouns",
      rule: "Whoever = anyone who. Whatever = anything that. Whichever = any one that. Whenever = any time when. Wherever = any place where.",
      mnemonic: "Whoever = Who + ever (anyone who). Whatever = What + ever (anything that). Ever = 'any' ma'nosini qo'shadi.",
      commonMistakes: "'Whatever' ni 'no matter what' ma'nosida ishlatish mumkin. 'What ever' (two words) = 'what' so'roq so'zi + 'ever' urg'u (= what on earth).",
      examples: [
        { en: "Whoever finishes first wins a prize.", uz: "Kim birinchi bo'lib tugatsa, sovrin oladi." },
        { en: "You can invite whomever you like. (formal)", uz: "Kimni xohlasangiz, taklif qilishingiz mumkin." },
      ],
      drills: [
        { id: 880030, type: 'fill-blank', instruction: "Compound relative:", question: "___ finishes first will get a prize.", blanks: ['Whoever'], explanation: "'Whoever' = anyone who." },
        { id: 880031, type: 'fill-blank', instruction: "Compound relative:", question: "You can eat ___ you want.", blanks: ['whatever'], explanation: "'Whatever' = anything that." },
        { id: 880032, type: 'fill-blank', instruction: "Compound relative:", question: "Choose ___ colour you prefer.", blanks: ['whichever'], explanation: "'Whichever' = any one that." },
        { id: 880033, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "___ wants to join is welcome.", options: ['Whoever', 'Whatever', 'Whichever', 'Whenever'], correct: 'Whoever', explanation: "'Whoever' = anyone who + verb." },
      ],
    },
  ],
  exercises: [
    { id: 880040, type: 'fill-blank', instruction: "Reduced relative — active V+ing:", question: "The woman ___ (stand) at the door is my teacher.", blanks: ['standing'], explanation: "'Who is standing' → 'standing'. Active reduced." },
    { id: 880041, type: 'fill-blank', instruction: "Reduced relative — passive V³:", question: "The article ___ (publish) last month was controversial.", blanks: ['published'], explanation: "'Which was published' → 'published'. Passive reduced." },
    { id: 880042, type: 'fill-blank', instruction: "Preposition + whom:", question: "The colleagues ___ whom I work are very supportive.", blanks: ['with'], explanation: "'With whom' = kim bilan. Formal preposition structure." },
    { id: 880043, type: 'fill-blank', instruction: "Preposition + which:", question: "The project ___ which I'm responsible is almost done.", blanks: ['for'], explanation: "'For which' = nima uchun mas'ul." },
    { id: 880044, type: 'fill-blank', instruction: "Compound relative:", question: "___ you decide, I'll support you.", blanks: ['Whatever'], explanation: "'Whatever' = no matter what." },
    { id: 880045, type: 'fill-blank', instruction: "Quantifier + relative:", question: "The applicants, several ___ whom were overqualified, were rejected.", blanks: ['of'], explanation: "'Several of whom' = ulardan bir nechtasi." },
    { id: 880046, type: 'fill-blank', instruction: "Sentential which:", question: "She passed the exam, ___ delighted her parents.", blanks: ['which'], explanation: "'Which' refers to the whole clause 'she passed the exam'." },
    { id: 880047, type: 'fill-blank', instruction: "Reduced relative — active:", question: "The children ___ (play) in the garden are my neighbours.", blanks: ['playing'], explanation: "'Who are playing' → 'playing'. Active reduced." },
    { id: 880048, type: 'fill-blank', instruction: "Reduced relative — passive:", question: "The documents ___ (sign) yesterday are important.", blanks: ['signed'], explanation: "'Which were signed' → 'signed'. Passive reduced." },
    { id: 880049, type: 'fill-blank', instruction: "Compound relative — place:", question: "Sit ___ you like.", blanks: ['wherever'], explanation: "'Wherever' = any place where." },
    { id: 880050, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "The man ___ next to me is a professor.", options: ['sitting', 'sat', 'was sitting', 'who sitting'], correct: 'sitting', explanation: "Reduced: 'who is sitting' → 'sitting'." },
    { id: 880051, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "The research ___ in 2023 was groundbreaking.", options: ['conducting', 'conducted', 'was conducted', 'which conducting'], correct: 'conducted', explanation: "Reduced passive: 'which was conducted' → 'conducted'." },
    { id: 880052, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "The person ___ I spoke yesterday is the CEO.", options: ['to whom', 'to who', 'whom to', 'which to'], correct: 'to whom', explanation: "Formal: preposition + whom. 'To whom'." },
    { id: 880053, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "___ comes first can start the game.", options: ['Whoever', 'Whatever', 'Whichever', 'However'], correct: 'Whoever', explanation: "'Whoever' = anyone who. Odamlar uchun." },
    { id: 880054, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "He forgot the meeting, ___ was unusual.", options: ['which', 'that', 'what', 'who'], correct: 'which', explanation: "'Which' butun gapga ishora qiladi. 'That' bu yerda ishlatilmaydi." },
    { id: 880055, type: 'error-correction', instruction: "Xatoni toping:", question: "The girl wearing dress is my sister. The cake making by her is delicious.", errorPart: 'making', correct: "The girl wearing a dress is my sister. The cake made by her is delicious.", explanation: "First: active ✅. Second: passive → 'made' (V³), not 'making'." },
    { id: 880056, type: 'error-correction', instruction: "Xatoni toping:", question: "The person to who I spoke was the director.", errorPart: 'to who', correct: "The person to whom I spoke was the director.", explanation: "Preposition + whom (not who). Formal structure." },
    { id: 880057, type: 'error-correction', instruction: "Xatoni toping:", question: "He was late, that surprised everyone.", errorPart: 'that', correct: "He was late, which surprised everyone.", explanation: "Sentential relative → 'which', not 'that'." },
    { id: 880058, type: 'error-correction', instruction: "Xatoni toping:", question: "The book writing by the author is famous.", errorPart: 'writing', correct: "The book written by the author is famous.", explanation: "Passive reduced → V³ 'written', not V+ing 'writing'." },
    { id: 880059, type: 'transformation', instruction: "Reduced relative ga o'tkazing:", question: "The woman who is standing there is my aunt.", hint: "The woman standing...", correct: "The woman standing there is my aunt.", explanation: "'Who is standing' → 'standing'. Active reduced." },
    { id: 880060, type: 'transformation', instruction: "Reduced relative ga o'tkazing:", question: "The house which was built in 1990 is for sale.", hint: "The house built...", correct: "The house built in 1990 is for sale.", explanation: "'Which was built' → 'built'. Passive reduced." },
    { id: 880061, type: 'transformation', instruction: "Formal shaklga o'tkazing:", question: "The person who I work for is very kind.", hint: "The person for whom...", correct: "The person for whom I work is very kind.", explanation: "Informal → formal: 'who...for' → 'for whom'." },
    { id: 880062, type: 'transformation', instruction: "Compound relative bilan yozing:", question: "Any person who finishes first gets a prize.", hint: "Whoever finishes...", correct: "Whoever finishes first gets a prize.", explanation: "'Any person who' → 'whoever'. Compound relative." },
    { id: 880063, type: 'transformation', instruction: "Quantifier + relative bilan yozing:", question: "The students passed. Most of them studied hard.", hint: "The students, most of whom...", correct: "The students, most of whom studied hard, passed.", explanation: "'Most of them' → 'most of whom'. Non-defining clause." },

    // ── Interleaved ──
    { id: 880064, type: 'fill-blank', instruction: "Aralash — reduced/preposition/compound:", question: "The man ___ at the desk is my boss. The person ___ whom I spoke was his assistant. ___ wants to join, let me know.", blanks: ['sitting', 'to', 'Whoever'], explanation: "Reduced (sitting), preposition+whom (to whom), compound (whoever)." },
    { id: 880065, type: 'fill-blank', instruction: "Aralash — reduced/preposition/which:", question: "The research ___ in 2022 was published. The company ___ which we work is IBM. He won, ___ was expected.", blanks: ['conducted', 'for', 'which'], explanation: "Passive reduced (conducted), preposition+which (for which), sentential which." },
  ],
  exerciseSections: [
    { ids: [880040, 880041, 880042, 880043, 880044, 880045, 880046, 880047, 880048, 880049], desc: "Reduced, Preposition, Compound", icon: "🌱", color: "bg-emerald-500", title: "Boshlang'ich" },
    { ids: [880050, 880051, 880052, 880053, 880054], desc: "MCQ tanlash", icon: "📘", color: "bg-blue-500", title: "O'rtacha" },
    { ids: [880055, 880056, 880057, 880058], desc: "Xato tuzatish", icon: "🎯", color: "bg-violet-500", title: "Qiyin" },
    { ids: [880059, 880060, 880061, 880062, 880063], desc: "Transformatsiya", icon: "🔄", color: "bg-rose-500", title: "Murakkab" },
    { title: "🔀 Aralash", desc: "Reduced + Preposition + Which + Compounds", color: 'bg-fuchsia-500', icon: '🔄', ids: [880064, 880065] },
  ],
  tests: [
    { id: 880070, type: 'multiple-choice', instruction: "Asosiy:", question: "Active reduced relative qanday yasaladi?", options: ['Noun + V³', 'Noun + V+ing', 'Noun + to V¹', 'Noun + being + V³'], correct: 'Noun + V+ing', explanation: "Active: noun + V+ing (the man sitting)." },
    { id: 880071, type: 'multiple-choice', instruction: "Asosiy:", question: "Passive reduced relative qanday yasaladi?", options: ['Noun + V+ing', 'Noun + V³', 'Noun + being', 'Noun + having + V³'], correct: 'Noun + V³', explanation: "Passive: noun + V³ (the book written)." },
    { id: 880072, type: 'multiple-choice', instruction: "Asosiy:", question: "Rasmiy uslubda preposition qayerda turadi?", options: ['Gap oxirida', 'Relative pronoun dan oldin', 'Relative pronoun dan keyin', 'Hech qayerda'], correct: 'Relative pronoun dan oldin', explanation: "Formal: preposition + whom/which (to whom, for which)." },
    { id: 880073, type: 'multiple-choice', instruction: "Asosiy:", question: "'Whoever' nimani anglatadi?", options: ["Kim bo'lsa", "Nima bo'lsa", "Qaysi biri", "Qachon bo'lsa"], correct: "Kim bo'lsa", explanation: "'Whoever' = anyone who = kim bo'lsa." },
    { id: 880074, type: 'multiple-choice', instruction: "Asosiy:", question: "Sentential 'which' nimaga ishora qiladi?", options: ["Bir otga", "Butun gapga", "Bir fe'lga", "Bir sifatga"], correct: "Butun gapga", explanation: "'Which' butun oldingi gapga ishora qiladi." },
    { id: 880075, type: 'multiple-choice', instruction: "O'rtacha:", question: "The research ___ in 2023 showed interesting results.", options: ['conducting', 'conducted', 'was conducted', 'which conducting'], correct: 'conducted', explanation: "Passive reduced: 'which was conducted' → 'conducted'." },
    { id: 880076, type: 'multiple-choice', instruction: "O'rtacha:", question: "The person ___ I had dinner is my colleague.", options: ['with whom', 'with who', 'which with', 'whom with'], correct: 'with whom', explanation: "Formal: 'with whom'. Preposition + whom." },
    { id: 880077, type: 'multiple-choice', instruction: "O'rtacha:", question: "___ wants to participate must register.", options: ['Whoever', 'Whatever', 'Whichever', 'However'], correct: 'Whoever', explanation: "'Whoever' = anyone who + verb (wants)." },
    { id: 880078, type: 'multiple-choice', instruction: "O'rtacha:", question: "The students, most ___ whom passed, were happy.", options: ['of', 'in', 'to', 'with'], correct: 'of', explanation: "'Most of whom' — quantifier + of + whom." },
    { id: 880079, type: 'multiple-choice', instruction: "O'rtacha:", question: "He was late, ___ was unusual for him.", options: ['which', 'that', 'what', 'this'], correct: 'which', explanation: "Sentential relative → 'which'." },
    { id: 880080, type: 'multiple-choice', instruction: "Qiyin:", question: "Qaysi gapda reduced relative TO'G'RI ishlatilgan?", options: ["The man driving the car is my friend", "The man driven the car is my friend", "The man was driving the car is my friend", "The man who driving the car is my friend"], correct: "The man driving the car is my friend", explanation: "'Driving' = active reduced V+ing. To'g'ri variant." },
    { id: 880081, type: 'multiple-choice', instruction: "Qiyin:", question: "Qaysi gapda preposition + relative TO'G'RI?", options: ["The person to who I spoke", "The person whom to I spoke", "The person to whom I spoke", "The person who to I spoke"], correct: "The person to whom I spoke", explanation: "Preposition + whom: 'to whom'." },
    { id: 880082, type: 'multiple-choice', instruction: "Qiyin:", question: "'The cake making by her' nima uchun xato?", options: ["'Making' active, passive kerak", "'Cake' noto'g'ri", "'Her' noto'g'ri", "Xato emas"], correct: "'Making' active, passive kerak", explanation: "Passive → 'made' (V³). 'Making' = active V+ing." },
    { id: 880083, type: 'multiple-choice', instruction: "Murakkab:", question: "Qaysi gap BARCHA elementlarni o'z ichiga oladi?", options: ["The research conducted last year, which was groundbreaking, surprised everyone.", "The man sitting there is my uncle.", "Whoever comes is welcome.", "I like the book."], correct: "The research conducted last year, which was groundbreaking, surprised everyone.", explanation: "Passive reduced (conducted) + non-defining which. B2 level." },
  ],
  testSections: [
    { ids: [880070, 880071, 880072, 880073, 880074], desc: "Asosiy tushunchalar", icon: "🌱", color: "bg-emerald-500", title: "Oson" },
    { ids: [880075, 880076, 880077, 880078, 880079], desc: "Qo'llash", icon: "📘", color: "bg-blue-500", title: "O'rtacha" },
    { ids: [880080, 880081, 880082], desc: "Tahlil", icon: "🎯", color: "bg-violet-500", title: "Qiyin" },
    { ids: [880083], desc: "Murakkab tahlil", icon: "🏆", color: "bg-rose-500", title: "Murakkab" },
  ],
  reading: {
    passage: "An Innovative Company\n\nInnovateCorp, founded in 2018, has become a leader in the tech industry. The company, for which many top engineers work, specializes in artificial intelligence. The CEO, respected by everyone in the field, started the company in her garage.\n\nThe team working on the new AI project has made remarkable progress. The research conducted last year led to a breakthrough. The product, several features of which were revolutionary, won several awards.\n\nWhoever joins InnovateCorp can expect a challenging but rewarding experience. The company, the culture of which is collaborative, encourages innovation. Employees, many of whom come from top universities, contribute to cutting-edge projects.\n\nThe company expanded rapidly in 2023, which surprised many analysts. The strategies implemented by the leadership team proved highly effective. Whatever challenges arise, the team always finds creative solutions. This is a workplace where innovation thrives, which is exactly what makes it special.",
    questions: [
      { id: 880090, type: 'multiple-choice' as const, question: "What is 'founded in 2018' an example of?", options: ["Active reduced relative", "Passive reduced relative", "Preposition + relative", "Compound relative"], correctIndex: 1, explanation: "'Founded' = 'which was founded'. Passive reduced relative clause." },
      { id: 880091, type: 'multiple-choice' as const, question: "What relative structure is in 'the company for which many top engineers work'?", options: ["Reduced relative", "Preposition + relative", "Compound relative", "Quantifier + relative"], correctIndex: 1, explanation: "'For which' = preposition + relative pronoun (formal)." },
      { id: 880092, type: 'multiple-choice' as const, question: "What does 'whoever' introduce in the passage?", options: ["A specific person", "Any person who joins", "No one", "The CEO"], correctIndex: 1, explanation: "'Whoever joins InnovateCorp' = 'anyone who joins'." },
      { id: 880093, type: 'multiple-choice' as const, question: "What is 'many of whom' an example of?", options: ["Reduced relative", "Preposition + relative", "Quantifier + relative pronoun", "Sentential which"], correctIndex: 2, explanation: "'Many of whom' = quantifier (many) + of + relative pronoun (whom)." },
      { id: 880094, type: 'multiple-choice' as const, question: "What does 'which' refer to in '...expanded rapidly, which surprised many analysts'?", options: ["The company", "The rapid expansion", "The leadership team", "The products"], correctIndex: 1, explanation: "'Which' refers to the whole clause 'the company expanded rapidly'." },
    ],
  },
  dialogues: [
    {
      id: 'advanced-relative-practice',
      title: "Advanced Relative Clauses amaliyot",
      context: "Ikki kollega murakkab nisbiy gaplarni ishlatib loyiha haqida gaplashishmoqda.",
      lines: [
        { speaker: "Alisher", text: "Have you met the person leading the new project?", translation: "Yangi loyihani boshqarayotgan odam bilan tanishdingizmi?" },
        { speaker: "Madina", text: "Yes! The person to whom I spoke yesterday was very knowledgeable.", translation: "Ha! Kecha men gaplashgan odam juda bilimdon edi." },
        { speaker: "Alisher", text: "The research conducted by his team is impressive.", translation: "Uning jamoasi tomonidan o'tkazilgan tadqiqot ta'sirli." },
        { speaker: "Madina", text: "They hired several new engineers, most of whom have PhDs.", translation: "Ular bir nechta yangi muhandislarni yollashdi, ko'pchiligi PhD darajasiga ega." },
        { speaker: "Alisher", text: "Whoever works on this project will learn a lot.", translation: "Bu loyihada kim ishlasa, ko'p narsa o'rganadi." },
        { speaker: "Madina", text: "They secured funding, which was crucial for the project.", translation: "Ular moliyalashtirishni ta'minlashdi, bu loyiha uchun juda muhim edi." },
      ],
    },
  ],
  culturalNotes: [
    {
      id: 'academic-formal-style',
      title: "Akademik va rasmiy uslubda relative clauses",
      description: "Akademik yozuvda preposition + whom/which tuzilmalari keng qo'llaniladi. Bu uslub IELTS/CEFR B2 va yuqori darajalarida talab qilinadi. Norasmiy suhbatda 'the person who I spoke to' ishlatilsa, rasmiy esseda 'the person to whom I spoke' yoziladi. O'zbek talabalari ko'pincha rasmiy uslubni o'rganishda qiynalishadi, chunki o'zbek tilida bu farq yo'q.",
      icon: "📝",
      category: "academic",
    },
    {
      id: 'compounds-in-english',
      title: "Ingliz tilidagi 'ever' qo'shimchasi",
      description: "Ingliz tilida '-ever' qo'shimchasi 'any' ma'nosini beradi: whoever = anyone who, whatever = anything that, wherever = any place where. Bu so'zlar o'zbek tilida 'kim bo'lsa', 'nima bo'lsa' kabi tarjima qilinadi va juda keng qo'llaniladi. Norwegian, Swedish kabi tillarda ham shunday tuzilmalar bor.",
      icon: "🌍",
      category: "language",
    },
  ],
}
