import type { DailyLesson } from '../dailyLessons'

// ─── B1: Second Conditional ───────────────────────────────────────────────────
// If + Past Simple, would + V¹ — unreal/hypothetical situations
// Covers: standard second conditional, were-subjunctive,
//         inverted conditionals (were I you), mixed with advice

export const secondConditionalB1: DailyLesson = {
  id: 'second-conditional-b1',
  speaking: {
    prompt: "Talk about imaginary situations — what you would do if your life were different. Speak for about one minute. Use the Second Conditional (If + Past Simple, would + verb).",
    tips: [
      "If + Past Simple, would + V1: 'If I had money, I would travel.'",
      "'If I were you, I would...' — maslahat.",
      "'were' barcha shaxslar uchun: 'If I were rich...'",
      "Xayoliy, real bo'lmagan hozirgi/kelajak vaziyatlar.",
    ],
    sampleAnswer: "Let me imagine a different life. If I had a lot of money, I would travel around the world and help my family. If I could live anywhere, I would choose a city by the sea. If I were the president, I would make education free for everyone. Honestly, if I had more free time, I would learn to play the guitar. If I were you, I would always follow my dreams. Of course, these are just dreams, but if we didn't dream, life would be boring. If I could change one thing, I would be more confident.",
  },
  title: 'Second Conditional',
  subtitle: "If + Past Simple, would + V¹ — xayoliy va gipotetik vaziyatlar",
  level: 'B1',
  day: 1,
  category: 'Conditionals',
  listening: {
    transcript: "Dilshod: If I had more free time, I would learn to play the guitar. But I'm so busy with work!\nMadina: Same here. If I didn't work so much, I would travel more. What would you do if you won the lottery?\nDilshod: If I won the lottery, I would buy a house for my parents and travel around the world.\nMadina: That sounds amazing. If I were rich, I would start my own business.\nDilshod: What kind of business would you start if you had the money?\nMadina: If I knew how to cook well, I would open a restaurant. But I don't!\nDilshod: If I were you, I would take cooking classes.\nMadina: Good idea! If I had more time, I would definitely do that.\nDilshod: If we stopped making excuses, we would achieve so much more!\nMadina: You're right. If we started today, we would see results in a few months.",
    vocabulary: [
      { word: 'lottery', definition: 'lotereya' },
      { word: 'guitar', definition: 'gitara' },
      { word: 'business', definition: 'biznes, korxona' },
      { word: 'excuse', definition: 'bahona, uzr' },
      { word: 'achieve', definition: "erishmoq, qo'lga kiritmoq" },
    ],
    questions: [
      { id: 46001, type: 'multiple-choice', question: "What would Dilshod do if he had more free time?", options: ["Travel", "Learn guitar", "Start a business", "Cook"], correctIndex: 1, explanation: "'If I had more free time, I would learn to play the guitar.'" },
      { id: 46002, type: 'multiple-choice', question: "What would Madina do if she were rich?", options: ["Buy a house", "Travel", "Start her own business", "Learn guitar"], correctIndex: 2, explanation: "'If I were rich, I would start my own business.'" },
      { id: 46003, type: 'true-false', question: "If Madina won the lottery, she would buy a house for her parents.", answer: false, explanation: "It was Dilshod who said that: 'If I won the lottery, I would buy a house for my parents.'" },
      { id: 46004, type: 'multiple-choice', question: "What advice does Dilshod give to Madina?", options: ["Work harder", "If I were you, I would take cooking classes", "Travel more", "Save money"], correctIndex: 1, explanation: "'If I were you, I would take cooking classes.'" },
      { id: 46005, type: 'multiple-choice', question: "What would happen if they stopped making excuses?", options: ["Nothing", "They would achieve more", "They would lose their jobs", "They would be bored"], correctIndex: 1, explanation: "'If we stopped making excuses, we would achieve so much more!'" },
    ],
    difficulty: 'medium',
    topic: "Second Conditional — xayoliy vaziyatlar",
  },
  writing: {
    prompt: "Write about what you would do in these three hypothetical situations: (1) If you won a million dollars, (2) If you could live anywhere in the world, and (3) If you could meet any famous person. Use the Second Conditional structure (If + Past Simple, would + V¹) in each sentence. Write 6-8 sentences.",
    modelAnswer: "If I won a million dollars, I would buy a house for my parents and travel the world. I would also give some money to help poor children. If I could live anywhere in the world, I would choose a quiet city near the sea, because I love calm places. If I could meet any famous person, I would meet a great scientist and ask him about the future. If we didn't dream, life would be boring.",
    wordLimit: 100,
    tips: [
      "Use 'If + Past Simple' for the condition: 'If I won...'",
      "Use 'would + V¹' for the result: 'I would buy...'",
      "Use 'were' instead of 'was' for 'If I were...' (subjunctive)",
      "Give a reason for each choice to extend your answer",
    ],
  },
  formulas: [
    {
      color: "green",
      label: "Second Conditional — Standard",
      structure: "If + Subject + V₂ , Subject + would + V¹\n  If I had more money, I would buy a car.",
      explanation: "Second Conditional xayoliy vaziyatlar uchun. 'If' qismida Past Simple, natija qismida 'would + V¹' ishlatiladi.",
      whenToUse: "Hozir yoki kelajakdagi real bo'lmagan, xayoliy vaziyatlar haqida gapirganda.",
      example: "If I lived near the sea, I would swim every day. (Agar dengiz yaqinida yashasam, har kuni suzardim)"
    },
    {
      color: "blue",
      label: "If I were you... — Maslahat",
      structure: "If I were you, I would + V¹\n  If I were you, I would see a doctor.",
      explanation: "'If I were you' — eng keng tarqalgan Second Conditional iborasi. Maslahat berish uchun ishlatiladi. 'I was' EMAS, 'I were'!",
      whenToUse: "Kimgadir maslahat berishda: 'If I were you, I would...' (Agar men sizning o'rningizda bo'lsam...)",
      example: "If I were you, I would take that job. (Men sizning o'rningizda bo'lsam, o'sha ishni qabul qilardim)"
    },
    {
      color: "orange",
      label: "Inverted Second Conditional",
      structure: "Were + Subject + ... , Subject + would + V¹\n  Were I rich, I would travel the world.",
      explanation: "Rasmiy uslubda 'if' tushib qoladi va were subjectdan oldin keladi. Bu inversion deyiladi.",
      whenToUse: "Rasmiy yozuvda, akademik matnlarda, 'if' so'zini ishlatmasdan xayoliy shartni ifodalashda.",
      example: "Were it possible, we would help everyone. (Agar imkoni bo'lsa, hammaga yordam berardik)"
    },
    {
      color: "purple",
      label: "Second Conditional with 'could'",
      structure: "If + Subject + V₂ , Subject + could + V¹\n  If I had wings, I could fly.",
      explanation: "'Would' o'rniga 'could' (would be able to) ishlatilsa, qobiliyat yoki imkoniyat ma'nosini beradi.",
      whenToUse: "Xayoliy vaziyatda qobiliyat yoki imkoniyat haqida gapirganda.",
      example: "If I spoke English fluently, I could work abroad. (Agar ingliz tilida ravon gapirsam, chet elda ishlay olardim)"
    },
  ],
  rules: [
    "1️⃣ SECOND CONDITIONAL NIMA?\n\nSecond Conditional — hozir yoki kelajakdagi REAL BO'LMAGAN vaziyatlar uchun.\n\n📌 TUZILISHI:\n  If + Past Simple, would + V¹\n  → If I had a car, I would drive to work. (Mashinam bo'lsa, ishga haydab borardim)\n  → Haqiqat: Mening mashinam yo'q.\n  → Second Conditional bilan xayoliy vaziyatni ifodalaymiz.\n\n🔴 Bu REAL vaziyatlar uchun EMAS. Agar haqiqiy bo'lishi mumkin bo'lsa, First Conditional ishlating.",

    "2️⃣ IF BO'LIMI — PAST SIMPLE\n\n'If' qismida Past Simple ishlatiladi:\n  If I HAD more money...\n  If she LIVED near here...\n  If they DIDN'T work so hard...\n\n📌 SUBJUNCTIVE MOOD: 'If I was' emas, 'If I WERE'\n  If I were you... (not: If I was you)\n  If she were here... (not: If she was here)\n\n🔴 'Were' barcha shaxslar uchun bir xil: I were, he were, they were",

    "3️⃣ NATIJA BO'LIMI — WOULD + V¹\n\nNatija qismida 'would + V¹' ishlatiladi:\n  ...I would travel the world.\n  ...she would be happier.\n  ...they would buy a house.\n\n🔴 Shart qismida 'would' ISHLATILMAYDI!\n  ❌ If I WOULD HAVE more money...\n  ✅ If I HAD more money...\n\n📌 'Would' faqat natija bo'limida ishlatiladi, 'if' bo'limida EMAS.",

    "4️⃣ MASLAHAT: IF I WERE YOU...\n\nEng keng tarqalgan Second Conditional iborasi:\n  If I were you, I would see a doctor.\n  If I were you, I would study more.\n  If I were you, I wouldn't go there.\n\nBu ibora o'zbekchada 'Men sizning o'rningizda bo'lsam...' degan ma'noni bildiradi.\n\n📌 IELTS TIP: 'If I were you' — Speaking da maslahat berishda juda tabiiy va keng tarqalgan ibora.",

    "5️⃣ SECOND VS FIRST CONDITIONAL\n\n📌 First Conditional (real): If it rains, I will take an umbrella.\n  → Haqiqatan ham yomg'ir yog'ishi mumkin (50% ehtimol).\n\n📌 Second Conditional (unreal): If it rained, I would take an umbrella.\n  → Yomg'ir yog'ishi kutilmayapti, lekin agar yog'sa... (0-10% ehtimol).\n\n🔴 Asosiy farq: First = real (will), Second = unreal (would).\n🔴 Zamonda farq: First = If + Present, will + V¹ / Second = If + Past, would + V¹",

    "6️⃣ COULD VA MIGHT BILAN\n\n'Would' o'rniga 'could' (qobiliyat) yoki 'might' (ehtimol) ishlatish mumkin:\n  If I had more time, I could learn piano. (o'rgana olardim)\n  If she asked me, I might help. (yordam berishim mumkin edi)\n\n📌 FARQLAR:\n  • Would = aniq natija: I would go. (albatta borardim)\n  • Could = qobiliyat: I could go. (bora olardim)\n  • Might = ehtimol: I might go. (balki borardim)\n\n📌 'Might' would dan kamroq ishonch bildiradi.",

    "7️⃣ O'ZBEKCHA XATOLAR\n\n📌 'If' qismida 'would' ishlatish:\n  ❌ If I would have money...\n  ✅ If I had money...\n\n📌 'Was' o'rniga 'were' ishlatmaslik:\n  ❌ If I was you...\n  ✅ If I were you...\n\n📌 'Will' ni natija qismida ishlatish:\n  ❌ I will buy a house.\n  ✅ I would buy a house.\n\n📌 First va Second ni aralashtirish:\n  ❌ If it rains, I would stay.\n  ✅ If it rained, I would stay. (Second = unreal)\n  ✅ If it rains, I will stay. (First = real)",
  ],
  vocabulary: [
    { en: 'hypothetical', uz: "xayoliy, faraziy", example: "A hypothetical situation is not real.", rule: "Second Conditional = hypothetical" },
    { en: 'unreal', uz: "real bo'lmagan", example: "Second Conditional describes unreal situations.", rule: "not real / imaginary" },
    { en: 'wishful thinking', uz: "xayol, orzu", example: "If I were rich is wishful thinking.", rule: "imagining a different reality" },
    { en: 'subjunctive', uz: "subjunktiv mayl", example: "If I were (not was) = subjunctive.", rule: "were for all persons" },
    { en: 'condition', uz: "shart", example: "The 'if' part is the condition.", rule: "if + Past Simple" },
    { en: 'result', uz: "natija", example: "The 'would' part is the result.", rule: "would + V¹" },
    { en: 'impossible', uz: "imkonsiz", example: "If I were a bird would be impossible.", rule: "can't happen" },
    { en: 'advice', uz: "maslahat", example: "If I were you = common advice phrase.", rule: "giving suggestions" },
    { en: 'imaginary', uz: "xayoliy", example: "We use Second Conditional for imaginary scenarios.", rule: "not real" },
    { en: 'inversion', uz: "teskari so'z tartibi", example: "Were I rich = inverted If I were rich.", rule: "formal: drop 'if', invert" },
    { en: 'were to', uz: "agar ...sa edi", example: "If I were to lose my job...", rule: "more formal if clause" },
    { en: 'otherwise', uz: "aks holda", example: "I would help; otherwise I wouldn't offer.", rule: "contrasting real vs unreal" },
    { en: 'luck', uz: "omad", example: "If I had luck, I would win.", rule: "unreal condition" },
    { en: 'opportunity', uz: "imkoniyat", example: "If I had the opportunity, I would travel.", rule: "unreal opportunity" },
    { en: 'alternative', uz: "muqobil", example: "Would could be replaced by might or could.", rule: "could/might + V¹" },
  ],
  examples: [
    { en: "If I had more money, I would buy a house.", uz: "Agar ko'proq pulim bo'lsa, uy sotib olardim." },
    { en: "If she lived in Tashkent, we would meet every day.", uz: "Agar u Toshkentda yashasa, har kuni uchrashardik." },
    { en: "If I were you, I would study more.", uz: "Men sizning o'rningizda bo'lsam, ko'proq o'qirdim." },
    { en: "If we didn't have exams, we would travel.", uz: "Agar imtihonlarimiz bo'lmasa, sayohat qilardik." },
    { en: "If I knew the answer, I would tell you.", uz: "Agar javobni bilsam, sizga aytardim." },
    { en: "Were I rich, I would help the poor.", uz: "Agar boy bo'lsam, kambag'allarga yordam berardim." },
    { en: "If she spoke English, she could work abroad.", uz: "Agar u ingliz tilida gapirsa, chet elda ishlay olardi." },
    { en: "What would you do if you won the lottery?", uz: "Agar lotereyada yutsangiz, nima qilgan bo'lardingiz?" },
  ],
  specialCases: [
    {
      id: 'were-subjunctive',
      title: "\"If I were\" — Subjunctive mayli",
      rule: "Second Conditional da 'I/he/she/it' bilan 'was' emas, 'WERE' ishlatiladi. Bu subjunctive mayli deb ataladi.",
      mnemonic: "IF I WERE = har doim WERE (was emas!). 'If I were you' — eng muhim iborani yod oling!",
      commonMistakes: "If I WAS you → If I WERE you. If she WAS here → If she WERE here.",
      examples: [
        { en: "If I were you, I would accept the offer.", uz: "Men sizning o'rningizda bo'lsam, taklifni qabul qilardim." },
        { en: "If she were here, she would help us.", uz: "Agar u shu yerda bo'lsa, yordam berardi." },
      ],
      drills: [
        { id: 46010, type: 'fill-blank', instruction: "Were bilan to'ldiring:", question: "If I ___ you, I would take that job.", blanks: ['were'], explanation: "'If I were you' — subjunctive, always 'were'." },
        { id: 46011, type: 'fill-blank', instruction: "Were bilan to'ldiring:", question: "If she ___ here, she would know what to do.", blanks: ['were'], explanation: "'Were' for all persons in unreal conditionals." },
        { id: 46012, type: 'error-correction', instruction: "Xatoni toping:", question: "If I was you, I would study harder.", errorPart: 'was', correct: "If I were you, I would study harder.", explanation: "'If I were you' — 'was' emas, 'were'." },
      ],
    },
    {
      id: 'first-vs-second',
      title: "First va Second Conditional farqi",
      rule: "FIRST = real, mumkin (if + Present, will + V¹). SECOND = unreal, xayoliy (if + Past, would + V¹).",
      mnemonic: "FIRST = REAL (will). SECOND = UNREAL (would). First bilan 'if it rains' = haqiqiy ehtimol. Second bilan 'if it rained' = kutilmagan.",
      commonMistakes: "Real vaziyatda Second ishlatish: 'If it would rain' XATO. Yoki xayoliy vaziyatda First: 'If I will have wings' XATO.",
      examples: [
        { en: "First: If it rains, I will stay home. (real possibility)", uz: "Agar yomg'ir yog'sa, uyda qolaman." },
        { en: "Second: If it rained, I would stay home. (unlikely)", uz: "Agar yomg'ir yog'sa (kutilmaganda), uyda qolardim." },
      ],
      drills: [
        { id: 46013, type: 'fill-blank', instruction: "First yoki Second:", question: "If it rains, I ___ (stay) home. (real)", blanks: ['will stay'], explanation: "Real possibility → First Conditional: 'will stay'." },
        { id: 46014, type: 'fill-blank', instruction: "First yoki Second:", question: "If I ___ (have) wings, I would fly. (unreal)", blanks: ['had'], explanation: "Impossible → Second Conditional: 'If I had'." },
        { id: 46015, type: 'multiple-choice', instruction: "First yoki Second:", question: "If I ___ the president, I would change the law.", options: ['am', 'was', 'were', 'will be'], correct: 'were', explanation: "Unreal (I'm not president) → Second: 'If I were'." },
      ],
    },
  ],
  exercises: [
    { id: 46020, type: 'fill-blank', instruction: "Second Conditional bilan to'ldiring:", question: "If I ___ (have) more money, I would buy a car.", blanks: ['had'], explanation: "'If I had' — Past Simple in the if-clause." },
    { id: 46021, type: 'fill-blank', instruction: "Second Conditional bilan to'ldiring:", question: "If she ___ (live) near here, we would meet every day.", blanks: ['lived'], explanation: "'If she lived' — unreal situation." },
    { id: 46022, type: 'fill-blank', instruction: "Second Conditional bilan to'ldiring:", question: "I ___ (travel) more if I had more vacation time.", blanks: ['would travel'], explanation: "Result: 'would travel' — would + V¹." },
    { id: 46023, type: 'fill-blank', instruction: "Second Conditional bilan to'ldiring:", question: "If they ___ (not/work) so hard, they would relax more.", blanks: ["didn't work"], explanation: "Negative if-clause: 'didn't work'." },
    { id: 46024, type: 'fill-blank', instruction: "Second Conditional bilan to'ldiring:", question: "She ___ (be) happier if she lived near the sea.", blanks: ['would be'], explanation: "Result: 'would be' — would + be." },
    { id: 46025, type: 'fill-blank', instruction: "If I were you:", question: "If I ___ (be) you, I would take that opportunity.", blanks: ['were'], explanation: "'If I were you' — subjunctive 'were'." },
    { id: 46026, type: 'fill-blank', instruction: "Could bilan:", question: "If I spoke English fluently, I ___ (could) work abroad.", blanks: ['could'], explanation: "'Could' = would be able to. Ability in unreal situations." },
    { id: 46027, type: 'fill-blank', instruction: "Second Conditional:", question: "What ___ you do if you won the lottery?", blanks: ['would'], explanation: "Question form: 'What would you do if...?'" },
    { id: 46028, type: 'fill-blank', instruction: "Inversion bilan:", question: "___ I rich, I would help the poor.", blanks: ['Were'], explanation: "Inversion: 'Were I rich' = 'If I were rich'." },
    { id: 46029, type: 'fill-blank', instruction: "Second Conditional:", question: "If we ___ (know) the truth, we would tell you.", blanks: ['knew'], explanation: "'If we knew' — unreal, we don't know." },
    { id: 46030, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "If I ___ you, I would apologize.", options: ['am', 'was', 'were', 'will be'], correct: 'were', explanation: "'If I were you' — fixed expression with subjunctive 'were'." },
    { id: 46031, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "If she ___ more time, she would learn a new language.", options: ['has', 'had', 'would have', 'will have'], correct: 'had', explanation: "Second conditional: if + Past Simple = 'had'." },
    { id: 46032, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Where would you live if you ___ choose any city?", options: ['can', 'could', 'will', 'would'], correct: 'could', explanation: "'Could' in if-clause: 'if you could choose' (ability)." },
    { id: 46033, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "If I ___ a bird, I would fly to you.", options: ['am', 'was', 'were', 'will be'], correct: 'were', explanation: "Unreal (I'm not a bird) → 'If I were'." },
    { id: 46034, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is SECOND Conditional?", options: ["If it rains, I will stay", "If it rained, I would stay", "If it rains, I stay", "If it rained, I stayed"], correct: "If it rained, I would stay", explanation: "Second = if + Past Simple + would + V¹." },
    { id: 46035, type: 'error-correction', instruction: "Xatoni toping:", question: "If I would have more time, I would travel.", errorPart: 'would have', correct: "If I had more time, I would travel.", explanation: "'If' qismida 'would' ishlatilmaydi → 'had'." },
    { id: 46036, type: 'error-correction', instruction: "Xatoni toping:", question: "If I was you, I would study more.", errorPart: 'was', correct: "If I were you, I would study more.", explanation: "'If I were you' — subjunctive 'were'." },
    { id: 46037, type: 'error-correction', instruction: "Xatoni toping:", question: "If she knew the answer, she will tell us.", errorPart: 'will tell', correct: "If she knew the answer, she would tell us.", explanation: "Second Conditional → 'would tell', not 'will tell'." },
    { id: 46038, type: 'error-correction', instruction: "Xatoni toping:", question: "If they will invite me, I would go.", errorPart: 'will invite', correct: "If they invited me, I would go.", explanation: "If-clause → Past Simple 'invited', not 'will invite'." },
    { id: 46039, type: 'transformation', instruction: "Second Conditional ga o'tkazing:", question: "I don't have a car, so I can't drive to work.", hint: "If I had a car...", correct: "If I had a car, I would drive to work.", explanation: "Real → unreal: 'don't have' → 'had', 'can't drive' → 'would drive'." },
    { id: 46040, type: 'transformation', instruction: "Second Conditional ga o'tkazing:", question: "She doesn't live near me, so we don't meet often.", hint: "If she lived...", correct: "If she lived near me, we would meet often.", explanation: "'Doesn't live' → 'lived', 'don't meet' → 'would meet'." },
    { id: 46041, type: 'transformation', instruction: "If I were you bilan yozing:", question: "Advice: You should apply for that job.", hint: "If I were you...", correct: "If I were you, I would apply for that job.", explanation: "'You should' → 'If I were you, I would'." },
    { id: 46042, type: 'transformation', instruction: "Inversion bilan yozing:", question: "If I were rich, I would help everyone.", hint: "Were I...", correct: "Were I rich, I would help everyone.", explanation: "Inversion: drop 'if', put 'were' first." },
    { id: 46043, type: 'transformation', instruction: "Second Conditional savol:", question: "Imagine: you find a wallet. What do you do?", hint: "What would you do if...", correct: "What would you do if you found a wallet?", explanation: "Question: 'What would you do if + Past Simple?'" },

    // ── Interleaved Practice ──
    { id: 46044, type: 'fill-blank', instruction: "First vs Second aralash:", question: "If it ___ (rain) tomorrow, I will stay home. If I ___ (be) you, I would take an umbrella.", blanks: ['rains', 'were'], explanation: "First: real possibility (rains). Second: advice (were)." },
    { id: 46045, type: 'fill-blank', instruction: "Second bilan aralash:", question: "If I ___ (have) wings, I ___ (fly). If she ___ (be) here, she would help.", blanks: ['had', 'would fly', 'were'], explanation: "Unreal: had + would fly, were (subjunctive)." },
  ],
  exerciseSections: [
    { ids: [46020, 46021, 46022, 46023, 46024, 46025, 46026, 46027, 46028, 46029], desc: "Fill-blank asosiy", icon: "🌱", color: "bg-emerald-500", title: "Boshlang'ich" },
    { ids: [46030, 46031, 46032, 46033, 46034], desc: "MCQ tanlash", icon: "📘", color: "bg-blue-500", title: "O'rtacha" },
    { ids: [46035, 46036, 46037, 46038], desc: "Xato tuzatish", icon: "🎯", color: "bg-violet-500", title: "Qiyin" },
    { ids: [46039, 46040, 46041, 46042, 46043], desc: "Transformatsiya", icon: "🔄", color: "bg-rose-500", title: "Transformatsiya" },
    { title: "🔀 Aralash", desc: "First + Second + Inversion", color: 'bg-fuchsia-500', icon: '🔄', ids: [46044, 46045] },
  ],
  tests: [
    { id: 46050, type: 'multiple-choice', instruction: "Asosiy:", question: "Second Conditional qanday tuziladi?", options: ["If + Present, will + V¹", "If + Past, would + V¹", "If + Past Perfect, would have + V³", "If + Present, would + V¹"], correct: "If + Past, would + V¹", explanation: "Second = If + Past Simple + would + V¹." },
    { id: 46051, type: 'multiple-choice', instruction: "Asosiy:", question: "'If I were you' qanday ma'noda ishlatiladi?", options: ["Taxmin", "Maslahat", "Buyruq", "So'roq"], correct: "Maslahat", explanation: "'If I were you' = maslahat berish uchun." },
    { id: 46052, type: 'multiple-choice', instruction: "Asosiy:", question: "Second Conditional da 'I' bilan qaysi shakl ishlatiladi?", options: ['was', 'were', 'am', 'is'], correct: 'were', explanation: "Subjunctive: 'were' for all persons." },
    { id: 46053, type: 'multiple-choice', instruction: "Asosiy:", question: "Second Conditional qachon ishlatiladi?", options: ["Real vaziyatlar", "Xayoliy vaziyatlar", "O'tmishdagi vaziyatlar", "Kelajakdagi aniq rejalar"], correct: "Xayoliy vaziyatlar", explanation: "Second = unreal/hypothetical situations." },
    { id: 46054, type: 'multiple-choice', instruction: "Asosiy:", question: "Natija qismida qaysi modal fe'l ishlatiladi?", options: ['will', 'would', 'can', 'must'], correct: 'would', explanation: "Result clause: 'would + V¹'." },
    { id: 46055, type: 'multiple-choice', instruction: "O'rtacha:", question: "If I ___ more free time, I would learn to paint.", options: ['have', 'had', 'would have', 'will have'], correct: 'had', explanation: "If-clause → Past Simple 'had'." },
    { id: 46056, type: 'multiple-choice', instruction: "O'rtacha:", question: "She ___ happier if she lived near her family.", options: ['will be', 'would be', 'is', 'was'], correct: 'would be', explanation: "Second Conditional natija qismi: would + V1. 'If' qismida Past Simple (lived) bo'lgani uchun natija 'would be' — xayoliy vaziyat." },
    { id: 46057, type: 'multiple-choice', instruction: "O'rtacha:", question: "What would you do if you ___ a million dollars?", options: ['win', 'won', 'would win', 'will win'], correct: 'won', explanation: "If-clause → 'won' (Past Simple)." },
    { id: 46058, type: 'multiple-choice', instruction: "O'rtacha:", question: "If I ___ you, I wouldn't go there.", options: ['am', 'was', 'were', 'will be'], correct: 'were', explanation: "'If I were you' — fixed expression." },
    { id: 46059, type: 'multiple-choice', instruction: "O'rtacha:", question: "First vs Second: Which is correct for an unreal situation?", options: ["If it rains, I will stay", "If it rained, I would stay", "If it rained, I will stay", "If it rains, I would stay"], correct: "If it rained, I would stay", explanation: "Second = if + Past + would + V¹ (unreal)." },
    { id: 46060, type: 'multiple-choice', instruction: "Qiyin:", question: "Qaysi gapda xato bor?", options: ["If I had time, I would help", "If I were you, I would go", "If I would have money, I would buy", "If she knew, she would tell"], correct: "If I would have money, I would buy", explanation: "'If' qismida 'would' ishlatilmaydi → 'If I had money'." },
    { id: 46061, type: 'multiple-choice', instruction: "Qiyin:", question: "Qaysi gap Inversion bilan TO'G'RI tuzilgan?", options: ["Were I rich, I would travel", "Were I would be rich, I travel", "I were rich, I would travel", "Were rich I, would travel"], correct: "Were I rich, I would travel", explanation: "Inversion: 'Were I rich' = 'If I were rich'." },
    { id: 46062, type: 'multiple-choice', instruction: "Qiyin:", question: "'If I could fly' qanday ma'noni bildiradi?", options: ["Ucha olaman", "Ucha olmayman (xayol)", "Uchganman", "Uchamiz"], correct: "Ucha olmayman (xayol)", explanation: "Second Conditional → hozir ucha olmayman degani." },
    { id: 46063, type: 'multiple-choice', instruction: "Murakkab:", question: "Qaysi gap Second Conditional qoidasiga TO'LIQ mos keladi?", options: ["If I will be rich I help poor", "If I was you I will study", "If I had more time I would travel the world", "If I have money I travel"], correct: "If I had more time I would travel the world", explanation: "If + Past (had) + would + V¹ (would travel). Perfect Second Conditional." },
  ],
  testSections: [
    { ids: [46050, 46051, 46052, 46053, 46054], desc: "Asosiy qoidalar", icon: "🌱", color: "bg-emerald-500", title: "Oson" },
    { ids: [46055, 46056, 46057, 46058, 46059], desc: "Qo'llash", icon: "📘", color: "bg-blue-500", title: "O'rtacha" },
    { ids: [46060, 46061, 46062], desc: "Tahlil", icon: "🎯", color: "bg-violet-500", title: "Qiyin" },
    { ids: [46063], desc: "Yakuniy test", icon: "🏆", color: "bg-rose-500", title: "Murakkab" },
  ],
  reading: {
    passage: "What If...?\n\nImagine a world where things were different. If people had more compassion, there would be less conflict. If everyone shared what they had, nobody would go hungry. If children everywhere had access to education, the world would be a better place.\n\nOn a personal level, think about your own 'what if' moments. If I had more confidence, I would speak English more often. If I practiced every day, I would improve quickly. If I weren't afraid of making mistakes, I would talk to foreigners.\n\nWhat would you do if you could change one thing about your life? If I could live anywhere in the world, I would choose a city by the sea. If I spoke three languages, I could work in any country. If I were a billionaire, I would build schools in every village.\n\nThe beauty of the Second Conditional is that it lets us dream. It allows us to imagine different realities. And sometimes, imagining a different reality helps us take the first step toward making it real. If you started today, what would you achieve?",
    questions: [
      { id: 46070, type: 'multiple-choice' as const, question: "What would happen if people had more compassion?", options: ["There would be more conflict", "There would be less conflict", "Nothing would change", "People would be richer"], correctIndex: 1, explanation: "'If people had more compassion, there would be less conflict.'" },
      { id: 46071, type: 'multiple-choice' as const, question: "What would help the speaker improve English?", options: ["Reading books", "Practicing every day", "Watching films", "Writing essays"], correctIndex: 1, explanation: "'If I practiced every day, I would improve quickly.'" },
      { id: 46072, type: 'multiple-choice' as const, question: "Where would the speaker live if they could choose?", options: ["In the mountains", "In a city by the sea", "In the countryside", "In a big city"], correctIndex: 1, explanation: "'If I could live anywhere, I would choose a city by the sea.'" },
      { id: 46073, type: 'multiple-choice' as const, question: "What would the speaker build if they were a billionaire?", options: ["Hospitals", "Schools", "Roads", "Parks"], correctIndex: 1, explanation: "'If I were a billionaire, I would build schools in every village.'" },
      { id: 46074, type: 'multiple-choice' as const, question: "What does the passage say about the Second Conditional?", options: ["It's useless", "It lets us dream", "It's only for exams", "It's too difficult"], correctIndex: 1, explanation: "'The beauty of the Second Conditional is that it lets us dream.'" },
    ],
  },
  dialogues: [
    {
      id: 'what-if-dialogue',
      title: "Agar... bo'lsa nima qilarding?",
      context: "Ikki do'st xayoliy vaziyatlar haqida suhbatlashmoqda.",
      lines: [
        { speaker: "Aziz", text: "If you could meet any historical figure, who would you meet?", translation: "Agar tarixiy shaxs bilan uchrasha olsang, kim bilan uchrashgan bo'larding?" },
        { speaker: "Lola", text: "If I could meet anyone, I would meet Alisher Navoiy. He was a great poet!", translation: "Agar uchra olsam, Alisher Navoiy bilan uchrashardim. U buyuk shoir edi!" },
        { speaker: "Aziz", text: "Interesting choice! If I had a time machine, I would travel to ancient Khiva.", translation: "Qiziqarli tanlov! Agar vaqt mashinam bo'lsa, qadimgi Xivaga sayohat qilgan bo'lardim." },
        { speaker: "Lola", text: "What would you do there? I'd explore the old city if I went there.", translation: "U yerda nima qilgan bo'larding? Men borsam, eski shaharni kashf qilardim." },
        { speaker: "Aziz", text: "If I were more adventurous, I'd go there right now!", translation: "Agar jasurroq bo'lsam, hozir u yerga borardim!" },
      ],
    },
  ],
  culturalNotes: [
    {
      id: 'uzbek-dreams',
      title: "O'zbekistonda 'Agar... bo'lsa' orzulari",
      description: "Second Conditional o'zbek tilida 'agar...sa edi' bilan ifodalanadi. O'zbeklar orasida keng tarqalgan xayoliy vaziyatlar: 'Agar lotereyada yutsam, uy olardim', 'Agar chet elga borsam, ko'p narsa o'rganardim'. Bu iboralar ingliz tilida Second Conditional bilan bir xil ishlatiladi.",
      icon: "💭",
      category: "culture",
    },
    {
      id: 'were-subjunctive-world',
      title: "Subjunctive 'were' — dunyo tillarida",
      description: "Ingliz tilidagi 'If I were' subjunctive shakli boshqa tillarda ham mavjud. Fransuz tilida 'si j'étais' (If I were), nemis tilida 'wenn ich wäre'. O'zbek tilida bu farq yo'q — 'Agar men bo'lsam' hamma shaxslar uchun bir xil. Shuning uchun o'zbek talabalari ko'pincha 'If I was' deb xato qilishadi.",
      icon: "🌍",
      category: "language",
    },
  ],
}
