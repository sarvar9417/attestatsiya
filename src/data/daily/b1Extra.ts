// AVTO-import: Supabase lessons jadvalidan ko’chirilgan darslar (kurikulum
// bo’shliqlarini to’ldirish uchun). Endi lokal kurikulumning bir qismi.
import type { DailyLesson } from '../dailyLessons'

export const relativeClausesB1: DailyLesson = {
  id: "relative-clauses-b1",
  speaking: {
    prompt: "Describe your family, your favourite place, and an important object using relative clauses. Speak for about one minute. Use 'who', 'which', 'that', 'where', and 'whose'.",
    tips: [
      "'who' — odamlar: 'My friend who lives abroad...'",
      "'which/that' — narsalar: 'the book which I love'.",
      "'where' — joylar / 'when' — vaqt.",
      "'whose' — egalik: 'the man whose car is red'.",
    ],
    sampleAnswer: "Let me tell you about the people and things that matter to me. My best friend, who I have known since childhood, is someone that I trust completely. The place where I feel happiest is my grandmother's house, which is in a quiet village. She has an old carpet that her mother made, and it is something which I hope to keep one day. My father, whose advice I always follow, taught me to work hard. These are the people and places that have made me who I am today.",
  },
  title: "Relative Clauses",
  subtitle: "Defining va Non-defining — who/which/that/where/when",
  level: "B1",
  category: "Gap tuzilishi",
  day: 35,
  listening: {
    transcript: "Guide: This is the museum that attracts thousands of tourists. The man who designed it was famous.\nVisitor: Amazing! Is that the painting which won an award?\nGuide: Yes. The artist who painted it lived here. This is the room where she worked.\nVisitor: Beautiful. And the garden that we saw earlier?\nGuide: That's the garden which inspired her most. The bench where she sat is still there.\nVisitor: Lovely. Who is the woman that works at the desk?\nGuide: She's the curator whose knowledge is incredible.\nVisitor: I'd love to meet her. This is a place that I'll never forget!",
    vocabulary: [
      { word: 'museum', definition: 'muzey' },
      { word: 'design', definition: 'loyihalashtirmoq' },
      { word: 'award', definition: 'mukofot' },
      { word: 'inspire', definition: 'ilhomlantirmoq' },
      { word: 'curator', definition: 'muzey xodimi, kurator' },
    ],
    questions: [
      { id: 90811, type: 'multiple-choice', question: "What does the museum attract?", options: ["Few people", "Thousands of tourists", "Only artists", "Students"], correctIndex: 1, explanation: "'the museum that attracts thousands of tourists' — 'that' for things." },
      { id: 90812, type: 'true-false', question: "The man who designed the museum was famous.", answer: true, explanation: "'The man who designed it was famous' — 'who' for people." },
      { id: 90813, type: 'multiple-choice', question: "Where did the artist work?", options: ["In the garden", "In the room in the museum", "At home", "In a studio abroad"], correctIndex: 1, explanation: "'This is the room where she worked' — 'where' for places." },
      { id: 90814, type: 'multiple-choice', question: "What inspired the artist most?", options: ["The painting", "The garden", "The city", "The award"], correctIndex: 1, explanation: "'the garden which inspired her most.'" },
      { id: 90815, type: 'multiple-choice', question: "Who is the woman at the desk?", options: ["The artist", "The curator", "A tourist", "The designer"], correctIndex: 1, explanation: "'She's the curator whose knowledge is incredible' — 'whose' for possession." },
    ],
    difficulty: 'medium',
    topic: "Nisbiy gaplar — who / which / that / where / whose",
  },
  writing: {
    prompt: "Describe a person, a place, and an object that are important to you. Use defining relative clauses with 'who', 'which', 'that', 'where', and 'when' to give more details about each one. Write at least 7 sentences.",
    modelAnswer: "The person who has influenced me most is my grandfather, who was a teacher. He is the man that taught me to read. My favourite place is the village where I grew up, which is near the mountains. There is an old house where we spent every summer. The object that means the most to me is a watch which my grandfather gave me. I will always remember the day when he handed it to me.",
    wordLimit: 100,
    tips: [
      "Use 'who' for people: 'The person who inspires me most is...'",
      "Use 'which' for things: 'The book which changed my life is...'",
      "Use 'that' for both people and things: 'The friend that I trust...'",
      "Use 'where' for places: 'The city where I was born...'",
      "Use 'when' for time: 'The year when I started university...'",
      "In defining relative clauses, 'that' can replace 'who' and 'which'.",
    ],
  },
  formulas: [
    {
      color: "green",
      label: "Defining (aniqlovchi)",
      structure: "who/which/that/where/when + clause\nThe man who lives next door is a doctor.",
      explanation: "Defining relative clause — otning qaysi odam yoki narsa ekanligini aniqlovchi gap. Virgulsiz yoziladi. Agar bu gap olib tashlansa, ma'no buziladi. 'Who' odamlar, 'which' narsalar, 'that' ikkalasi uchun, 'where' joy, 'when' vaqt uchun.",
      whenToUse: "Ot haqida qo'shimcha ma'lumot berishda, lekin bu ma'lumot gap uchun zarur bo'lganda.",
      example: "The man who lives next door is a doctor. (Yoningdagi yashaydigan odam shifokor)" },
    {
      color: "blue",
      label: "Non-defining (qo'shimcha)",
      structure: ", who/which/where/when + clause,\nMy father, who is 60, works as a teacher.",
      explanation: "Non-defining relative clause — qo'shimcha ma'lumot beruvchi gap. Virguli bilan ajratiladi. Bu gap olib tashlansa, ma'no buzilmaydi. 'That' ishlatilmaydi!",
      whenToUse: "Ot haqida qo'shimcha, lekin zarur bo'lmagan ma'lumot berishda.",
      example: "My father, who is 60, works as a teacher. (Otam 60 yoshda, o'qituvchi)" },
    {
      color: "orange",
      label: "Whose (egalik)",
      structure: "whose + noun + clause\nThe student whose bag was stolen is upset.",
      explanation: "Whose — egalik bildiruvchi nisbiy bog'lovchi. Odamlar va narsalar uchun ishlatiladi. 'Of whom/which' o'rniga ishlatiladi.",
      whenToUse: "Biror kishining yoki narsaning egasi haqida gapirganda.",
      example: "The student whose bag was stolen is upset. (Summasi o'g'irlangan talaba g'azablangan)" },
    {
      color: "purple",
      label: "Whom (obekt)",
      structure: "whom + clause (rasmiy)\nThe man whom I met was very kind.",
      explanation: "Whom — obekt vazifasidagi nisbiy bog'lovchi. Rasmiy uslubda ishlatiladi. Norasmiy nutqda 'who' yoki 'that' bilan almashtiriladi yoki umuman tushib qoladi.",
      whenToUse: "Rasmiy yozuvda, obekt vazifasidagi odam haqida gapirganda.",
      example: "The man whom I met was very kind. (Uchrashgan odam juda mehribon edi)" },
  ],
  rules: [
    "1️⃣ RELATIVE CLAUSES NIMA?\n\nRelative clauses (nisbiy gaplar) — bir ot haqida qo'shimcha ma'lumot beradi.\n\n📌 DEFINING (aniqlovchi) — otning kim yoki nima ekanligini aniqlashtiradi. Busiz gap mantiqsiz. Vergulsiz yoziladi.\n  → The woman who lives next door is a doctor.\n\n📌 NON-DEFINING (qo'shimcha) — qo'shimcha ma'lumot beradi. Olib tashlansa ham gap mantiqli. Vergul bilan ajratiladi.\n  → My mother, who is a doctor, lives in London.\n\n🔴 Defining = gap uchun MUHIM / Non-defining = qo'shimcha ma'lumot",

    "2️⃣ WHO VA WHICH\n\n📌 WHO — odamlar uchun (subject vazifasida)\n  → The man who called you is my brother.\n  → The woman who lives next door is kind.\n\n📌 WHICH — narsalar va hayvonlar uchun\n  → The book which I read was interesting.\n  → The car which is parked outside is mine.\n\n🔴 Who = odamlar / Which = narsalar. Aralashtirmang!\n  ❌ The book who I read was interesting.\n  ✅ The book which/that I read was interesting.",

    "3️⃣ THAT — DEFINING DA IKKALASI UCHUN\n\n'That' odam va narsa uchun ishlatiladi (faqat DEFINING relative clause da).\n  → The man that called you is my brother.\n  → The book that I read was interesting.\n\n🔴 Non-defining da 'that' ishlatilmaydi!\n  ✅ My brother, who lives in London, is a doctor.\n  ❌ My brother, that lives in London, is a doctor.",

    "4️⃣ WHERE VA WHEN\n\n📌 WHERE — joylar uchun\n  → The town where I grew up is small.\n  → The restaurant where we ate was amazing.\n\n📌 WHEN — vaqt uchun\n  → I remember the year when we travelled.\n  → The day when we first met was special.",

    "5️⃣ WHOSE — EGALIK\n\n'Whose' egalik bildiradi (kimningdir narsasi). Odamlar va narsalar uchun ishlatiladi.\n  → The student whose bag was stolen was upset.\n  → The girl whose father is a doctor studies with me.\n  → The company whose CEO resigned is struggling.\n\n🔴 Whose o'rniga 'his/her/its' ishlatish XATO!\n  ❌ The man his car was stolen called police.\n  ✅ The man whose car was stolen called police.",

    "6️⃣ WHOM — OBEKT (RASMIY)\n\n'Whom' obekt vazifasidagi nisbiy olmosh. Rasmiy uslubda ishlatiladi.\n  → The man whom I met yesterday is famous.\n  → The professor whom I respect most is Dr. Karimov.\n\n📌 Kundalik nutqda 'whom' o'rniga 'who' yoki 'that' ishlatiladi:\n  → The man (who) I met yesterday is famous. (kundalik)\n\n🔴 WHOM = rasmiy yozuvda / WHO = kundalik nutqda",

    "7️⃣ OBYEKTNI TUSHIRISH (Omission)\n\nRelative pronounni tushirish faqat obekt vazifasida MUMKIN.\n\n📌 Pronoun + noun (obekt) → tushirish mumkin\n  → The book (that/which) I read was interesting.\n  → The man (who/whom) I met was kind.\n\n📌 Pronoun + verb (subject) → tushirib BO'LMAYDI\n  ✅ The woman who lives next door is a nurse.\n  ❌ The woman lives next door is a nurse.\n\n🔴 Qoida: Obekt = tushir mumkin / Subject = tushirib bo'lmaydi",

    "8️⃣ DEFINING VS NON-DEFINING — FARQLARI\n\n📌 Defining: vergul YO'Q + that MUMKIN + gap uchun MUHIM\n  → The man who lives next door is a doctor.\n  → The book that I bought is interesting.\n\n📌 Non-defining: vergul BOR + that YO'Q + qo'shimcha ma'lumot\n  → My father, who is 60, works as a teacher.\n  → Paris, which is beautiful, attracts many tourists.\n\n🔴 Vergulni unutish (non-defining da) — keng tarqalgan xato!\n  ❌ My brother who lives in London is a doctor.\n  ✅ My brother, who lives in London, is a doctor.",
  ],
  vocabulary: [
    {
      en: "who",
      uz: "kimki (odamlar)",
      rule: "people-subject",
      example: "The man who called you."
    },
    {
      en: "which",
      uz: "qaysiki (narsalar)",
      rule: "things",
      example: "The book which I read."
    },
    {
      en: "that",
      uz: "kimki/qaysiki",
      rule: "defining only",
      example: "The man that called you."
    },
    {
      en: "where",
      uz: "qayerda (joy)",
      rule: "place",
      example: "The city where I was born."
    },
    {
      en: "when",
      uz: "qachon (vaqt)",
      rule: "time",
      example: "The day when we met."
    },
    {
      en: "whose",
      uz: "kimning (egalik)",
      rule: "possession",
      example: "The girl whose father is a doctor."
    },
    {
      en: "whom",
      uz: "kimni (obekt, rasmiy)",
      rule: "object-formal",
      example: "The man whom I met."
    },
    {
      en: "defining",
      uz: "aniqlovchi",
      rule: "essential",
      example: "Defining identifies which person."
    },
    {
      en: "non-defining",
      uz: "qo'shimcha ma'lumot",
      rule: "additional",
      example: "Non-defining adds extra info."
    },
    {
      en: "relative pronoun",
      uz: "nisbiy olmosh",
      rule: "connector",
      example: "Who, which, that."
    },
    {
      en: "antecedent",
      uz: "oldin kelgan so'z",
      rule: "reference",
      example: "Noun before relative clause."
    },
    {
      en: "clause",
      uz: "bo'lak, gap qismi",
      rule: "part of sentence",
      example: "A clause has subject and verb."
    },
    {
      en: "subject",
      uz: "ega",
      rule: "grammar term",
      example: "The subject of the relative clause cannot be omitted."
    },
    {
      en: "object",
      uz: "obekt, to'ldiruvchi",
      rule: "grammar term",
      example: "The object of the relative clause can be omitted."
    },
    {
      en: "omission",
      uz: "tushirib qoldirish",
      rule: "relative clause",
      example: "Omission of the pronoun is possible for objects."
    }
  ],
  examples: [
    {
      en: "The woman who lives next door is a teacher.",
      uz: "Yon qoshnida yashaydigan ayol oqituvchi."
    },
    {
      en: "The book which I borrowed was very interesting.",
      uz: "Men olgan kitob juda qiziqarli edi."
    },
    {
      en: "My sister, who lives in New York, is a designer.",
      uz: "Singlim, u Nyu-Yorkda yashaydi, dizayner."
    },
    {
      en: "The restaurant where we had dinner was amazing.",
      uz: "Kechki ovqat yegan restoran ajoyib edi."
    },
    {
      en: "The student whose phone rang was embarrassed.",
      uz: "Telefoni jiringlagan oquvchi uyaldi."
    },
    {
      en: "The man whom I met yesterday is famous.",
      uz: "Kecha uchrashgan odam mashhur yozuvchi."
    },
    {
      en: "I remember the day when we first met.",
      uz: "Birinchi marta uchrashgan kunimizni eslayman."
    },
    {
      en: "Paris, where we spent our holiday, is beautiful.",
      uz: "Parij, u yerda dam olganmiz, chiroyli."
    }
  ],
  specialCases: [
    {
      id: "defining-vs-non-defining",
      rule: "DEFINING: gap ma'nosi uchun MUHIM, vergul YOQ, THAT mumkin. NON-DEFINING: qo'shimcha, vergul BOR, THAT mumkin EMAS.",
      title: "Defining va Non-defining farqi",
      drills: [
        {
          id: 45000,
          type: "fill-blank",
          blanks: [
            "who"
          ],
          question: "My mother, ___ is kind, helps everyone.",
          explanation: 'Non — defining -> who: Non defining -> who uchun ishlatiladi',
          instruction: "That or who:"
        },
        {
          id: 45001,
          type: "multiple-choice",
          correct: "who (commas)",
          options: [
            "who (commas)",
            "who (no commas)",
            "that (commas)",
            "which (commas)"
          ],
          question: "My father, ___ is 60, still works.",
          explanation: "Non-defining -> commas + who",
          instruction: "Defining/non-defining:"
        },
        {
          id: 45002,
          type: "error-correction",
          correct: "My mother, who is a doctor, works hard.",
          question: "My mother, that is a doctor, works hard.",
          errorPart: "that",
          explanation: "Non-defining: that ishlatilmaydi",
          instruction: "Error correction:"
        }
      ],
      examples: [
        {
          en: "The students who study hard pass.",
          uz: "Faqat qattiq oqigan talabalar otadi."
        },
        {
          en: "The students, who study hard, pass.",
          uz: "Hamma talabalar qattiq oqiydi va otadi."
        }
      ],
      mnemonic: "DEFINING = no commas, THAT allowed. NON-DEFINING = commas, THAT not allowed.",
      commonMistakes: "My mother, that is a doctor (who kerak)"
    },
    {
      id: "relative-pronoun-omission",
      rule: "Obekt vazifasidagini tushirish MUMKIN. Ega vazifasidagini tushirib BOLMAYDI.",
      title: "Relative pronounni tushirish",
      drills: [
        {
          id: 45003,
          type: "fill-blank",
          blanks: [
            "that"
          ],
          question: "The book (___) I read was interesting.",
          explanation: "Obekt -> tushirish mumkin",
          instruction: "Pronounni tushir:"
        },
        {
          id: 45004,
          type: "error-correction",
          correct: "The man who lives next door is a doctor.",
          question: "The man lives next door is a doctor.",
          errorPart: "lives",
          explanation: 'Ega — > who kerak: Ega > who kerak uchun ishlatiladi',
          instruction: "Error correction:"
        },
        {
          id: 45005,
          type: "multiple-choice",
          correct: "which",
          options: [
            "who",
            "which",
            "whose",
            "where"
          ],
          question: "The cake ___ I made was delicious.",
          explanation: "Narsa + obekt -> which",
          instruction: "Tanlang:"
        }
      ],
      examples: [
        {
          en: "The film (that) we watched was boring.",
          uz: "Biz ko'rgan film zerikarli edi."
        },
        {
          en: "The person who called you is waiting.",
          uz: "Sizga qo'ng'iroq qilgan odam kutmoqda."
        }
      ],
      mnemonic: "Pronoun + noun -> tushirish mumkin. Pronoun + verb -> mumkin emas.",
      commonMistakes: "The man lives next door is kind (who lives)"
    },
    {
      id: "whose-whom-usage",
      rule: "WHOSE = egalik (kimning). WHOM = obekt (rasmiy).",
      title: "Whose va Whom",
      drills: [
        {
          id: 45006,
          type: "fill-blank",
          blanks: [
            "whose"
          ],
          question: "The girl ___ bag was stolen cried.",
          explanation: "Whose + bag — kimniki: Whose bag is this? (Bu kimniki?)",
          instruction: "Whose:"
        },
        {
          id: 45007,
          type: "fill-blank",
          blanks: [
            "whom"
          ],
          question: "The actor ___ I admire most is DiCaprio.",
          explanation: "Whom = obekt — tarjima",
          instruction: "Fill in the blank with 'whom':"
        },
        {
          id: 45008,
          type: "error-correction",
          correct: "The man whose phone rang left.",
          question: "The man his phone rang left.",
          errorPart: "his phone",
          explanation: "Whose = egalik — tarjima",
          instruction: "Error correction:"
        }
      ],
      examples: [
        {
          en: "The student whose laptop was stolen reported it.",
          uz: "Noutbuki ogirlangan oquvchi xabar berdi."
        },
        {
          en: "The writer whom I admire most is Hemingway.",
          uz: "Men eng hayrat qiladigan yozuvchi Xeminguey."
        }
      ],
      mnemonic: "Whose = possession. Whom = object (formal).",
      commonMistakes: "The man his car is red (whose car)"
    }
  ],
  exercises: [
    {
      id: 45009,
      type: "fill-blank",
      blanks: [
        "who"
      ],
      question: "The woman ___ lives next door is a nurse.",
      explanation: "Who is used for people — 'the woman' is a person.",
      instruction: "Who/which:"
    },
    {
      id: 45010,
      type: "fill-blank",
      blanks: [
        "which"
      ],
      question: "The car ___ is parked outside is mine.",
      explanation: "Which is used for things — 'the car' is a thing.",
      instruction: "Who/which:"
    },
    {
      id: 45011,
      type: "fill-blank",
      blanks: [
        "that"
      ],
      question: "The book ___ I read was fantastic.",
      explanation: "'That' is used in defining relative clauses for both people and things.",
      instruction: "That:"
    },
    {
      id: 45012,
      type: "fill-blank",
      blanks: [
        "where"
      ],
      question: "The town ___ I grew up is small.",
      explanation: "'Where' is used for places — 'the town' is a place.",
      instruction: "Where:"
    },
    {
      id: 45013,
      type: "fill-blank",
      blanks: [
        "when"
      ],
      question: "I remember the year ___ we travelled.",
      explanation: "'When' is used for time expressions — 'the year' refers to time.",
      instruction: "When:"
    },
    { id: 45014, type: 'fill-blank', instruction: 'Tanlang:', question: 'The man ___ called you is my brother.', blanks: ['who'], explanation: '\'Who\' is used for people — \'the man\' is a person.' },
    { id: 45015, type: 'fill-blank', instruction: 'Tanlang:', question: 'The film ___ we saw was boring.', blanks: ['which'], explanation: '\'Which\' is used for things — \'the film\' is a thing.' },
    { id: 45016, type: 'fill-blank', instruction: 'Tanlang:', question: 'My sister, ___ lives in Paris, is coming.', blanks: ['who'], explanation: 'Non — defining -> who: Non defining -> who uchun ishlatiladi' },
    { id: 45017, type: 'fill-blank', instruction: 'Tanlang:', question: 'The student ___ phone rang was embarrassed.', blanks: ['whose'], explanation: '\'Whose\' shows possession — the phone belongs to the student.' },
    {
      id: 45018,
      type: "multiple-choice",
      correct: "My mother, who is kind",
      options: [
        "My mother, that is kind",
        "My mother, who is kind",
        "My mother which is kind",
        "My mother whose kind"
      ],
      question: "Non-defining uchun CORRECT?",
      explanation: 'Non — defining -> who: Non defining -> who uchun ishlatiladi',
      instruction: "Tanlang:"
    },
    {
      id: 45019,
      type: "error-correction",
      correct: "The book which I read was interesting.",
      question: "The book who I read was interesting.",
      errorPart: "who",
      explanation: 'Narsa — > which: Narsa > which uchun ishlatiladi',
      instruction: "Error correction:"
    },
    {
      id: 45020,
      type: "error-correction",
      correct: "My father, who is 60, still works.",
      question: "My father, that is 60, still works.",
      errorPart: "that",
      explanation: 'Non — defining -> who: Non defining -> who uchun ishlatiladi',
      instruction: "Error correction:"
    },
    {
      id: 45021,
      type: "error-correction",
      correct: "The woman who won the prize is my aunt.",
      question: "The woman won the prize is my aunt.",
      errorPart: "won",
      explanation: 'Ega — > who kerak: Ega > who kerak uchun ishlatiladi',
      instruction: "Error correction:"
    },
    {
      id: 45022,
      type: "error-correction",
      correct: "The woman whose car was stolen called police.",
      question: "The woman her car was stolen called police.",
      errorPart: "her car",
      explanation: "Whose = egalik — tarjima",
      instruction: "Error correction:"
    },
    {
      id: 45023,
      hint: "I know a girl who...",
      type: "transformation",
      correct: "I know a girl who can speak five languages.",
      question: "I know a girl. She can speak five languages.",
      explanation: "Who = birlashtirish — tarjima",
      instruction: "Combine the sentences:"
    },
    {
      id: 45024,
      hint: "The book which...",
      type: "transformation",
      correct: "The book which I bought was expensive.",
      question: "I bought a book. It was expensive.",
      explanation: "Which = narsalar — tarjima",
      instruction: "Relative clause:"
    },
    {
      id: 45025,
      hint: "My brother, who...",
      type: "transformation",
      correct: "My brother, who lives in Tashkent, is a doctor.",
      question: "My brother is a doctor. He lives in Tashkent.",
      explanation: 'Non — defining: Non defining uchun ishlatiladi',
      instruction: "Non-defining:"
    },
    {
      id: 45026,
      type: "fill-blank",
      blanks: [
        "that"
      ],
      question: "The meal (___) we had was delicious.",
      explanation: "Obekt -> tushirish mumkin",
      instruction: "Pronoun tushir:"
    },
    {
      id: 45027,
      type: "fill-blank",
      blanks: [
        "whose"
      ],
      question: "The family ___ house was destroyed got help.",
      explanation: 'Whose bilan house birga ishlatiladi (grammatik qoida)',
      instruction: "Whose:"
    },
    {
      id: 45028,
      type: "multiple-choice",
      correct: "The man who lives next door is kind",
      options: [
        "The man who lives next door is kind",
        "The man lives next door is kind",
        "The man which lives next door is kind",
        "The man whose lives next door is kind"
      ],
      question: "Which is CORRECT?",
      explanation: 'Who = ega — tarjima — "Who" so\'zining tarjimasi',
      instruction: "Tanlang:"
    },
    {
    id: 45029,
    type: "fill-blank",
    blanks: [
        "whose"
    ],
    question: "The girl ___ brother is a pilot studies with me.",
    explanation: "Whose = egalik — tarjima",
    instruction: "Whose:"
},
    {
    id: 45030,
    type: "fill-blank",
    blanks: [
        "whom"
    ],
    question: "The professor ___ I respect most is Dr. Karimov.",
    explanation: "Whom = obekt — tarjima",
    instruction: "Fill in the blank with 'whom':"
},
    {
    id: 45031,
    type: "fill-blank",
    blanks: [
        "that"
    ],
    question: "Everything ___ you said is true.",
    explanation: 'Everything bilan that birga ishlatiladi (grammatik qoida)',
    instruction: "That:"
},
    {
    id: 45032,
    type: "fill-blank",
    blanks: [
        "where"
    ],
    question: "Is this the hotel ___ you stayed last summer?",
    explanation: "Where = joy — tarjima",
    instruction: "Where:"
},
    {
    id: 45033,
    type: "fill-blank",
    blanks: [
        "when"
    ],
    question: "Do you remember the summer ___ we went to the mountains?",
    explanation: "When = vaqt — tarjima",
    instruction: "When:"
},
    { id: 45034, type: 'fill-blank', instruction: 'Tanlang:', question: 'The woman ___ won the prize is my aunt.', blanks: ['who'], explanation: 'Who = odam — tarjima' },
    { id: 45035, type: 'fill-blank', instruction: 'Tanlang:', question: 'I need a job ___ pays well.', blanks: ['which'], explanation: 'Which = narsa — tarjima' },
    {
    id: 45036,
    type: "multiple-choice",
    correct: "The house which I bought",
    options: [
        "The house which I bought",
        "The house who I bought",
        "The house where I bought",
        "The house whom I bought"
    ],
    question: "CORRECT defining clause:",
    explanation: "Which = narsa — tarjima",
    instruction: "Tanlang:"
},
    {
    id: 45037,
    type: "multiple-choice",
    correct: "My uncle, who lives in Samarkand, is a doctor",
    options: [
        "My uncle, who lives in Samarkand, is a doctor",
        "My uncle who lives in Samarkand is a doctor",
        "My uncle, that lives in Samarkand, is a doctor",
        "My uncle which lives in Samarkand is a doctor"
    ],
    question: "Non-defining uchun CORRECT?",
    explanation: "Non-defining -> commas + who",
    instruction: "Tanlang:"
},
    {
    id: 45038,
    type: "error-correction",
    correct: "The person who called you is waiting.",
    question: "The person called you is waiting.",
    errorPart: "called",
    explanation: "Ega -> pronoun kerak",
    instruction: "Error correction:"
},
    {
    id: 45039,
    type: "error-correction",
    correct: "I liked the film which you recommended.",
    question: "I liked the film who you recommended.",
    errorPart: "who",
    explanation: 'Narsa — > which: Narsa > which uchun ishlatiladi',
    instruction: "Error correction:"
},
    {
    id: 45040,
    type: "error-correction",
    correct: "Tashkent, where I was born, is beautiful.",
    question: "Tashkent, that I was born, is beautiful.",
    errorPart: "that",
    explanation: "Non-defining -> where",
    instruction: "Error correction:"
},
    {
    id: 45041,
    type: "transformation",
    hint: "The man who...",
    correct: "The man who fixed my car was very professional.",
    question: "The man fixed my car. He was very professional.",
    explanation: "Who = birlashtirish — tarjima",
    instruction: "Combine the sentences:"
},
    {
    id: 45042,
    type: "transformation",
    hint: "The restaurant where...",
    correct: "The restaurant where we ate had excellent service.",
    question: "We ate at a restaurant. It had excellent service.",
    explanation: "Where = joy — tarjima",
    instruction: "Combine the sentences:"
},
    {
    id: 45043,
    type: "transformation",
    hint: "The children whose...",
    correct: "The children whose parents volunteered got a prize.",
    question: "Some children got a prize. Their parents volunteered.",
    explanation: "Whose = egalik — tarjima",
    instruction: "Combine the sentences:"
},
    { id: 45044, type: 'fill-blank', instruction: 'Tanlang:', question: 'Formal: The candidate ___ we interviewed.', blanks: ['whom'], explanation: 'Whom = obekt — tarjima' },
    {
    id: 45045,
    type: "fill-blank",
    blanks: [
        "which"
    ],
    question: "The gift ___ I received was very thoughtful.",
    explanation: "Which = narsa — tarjima",
    instruction: "Pronoun:"
},

    // ── Interleaved Practice: Relative clauses + Defining/Non-defining ──
    { id: 65255, type: 'fill-blank', instruction: "Relative pronoun + defining/non-defining:", question: "My mother, ___ is a nurse, works at the hospital. The man ___ lives next door ___ a doctor.", blanks: ['who', 'who', 'is'], explanation: "Non-defining (commas) + who. Defining (no commas) + who." },
    { id: 65256, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The students ___ study hard pass. The students, ___, study hard.", blanks: ['who', 'who study hard'], explanation: "First = defining (no commas, essential). Second = non-defining (commas)." },
    { id: 65257, type: 'error-correction', instruction: "Relative clause structure:", question: "The woman lives next door is a doctor. My sister, that is kind, helps me.", errorPart: 'lives / that', correct: "The woman who lives next door is a doctor. My sister, who is kind, helps me.", explanation: "Defining: 'who lives' (subject pronoun can't be omitted). Non-defining: 'who', not 'that'." },
    { id: 65258, type: 'fill-blank', instruction: "Whose + Where + When:", question: "The city ___ I was born is Tashkent. The girl ___ bag was stolen cried. I remember the day ___ we met.", blanks: ['where', 'whose', 'when'], explanation: "Where = place, whose = possession, when = time." },
    { id: 65259, type: 'transformation', instruction: "Join sentences with relative clause:", question: "I have a friend. She can speak five languages.", hint: "I have a friend who...", correct: "I have a friend who can speak five languages.", explanation: "Who = people in defining relative clauses." }
],
  exerciseSections: [
    {
      ids: [
        45009,
        45010,
        45011,
        45012,
        45013
      ],
      desc: "Who/Which/That",
      icon: "F1",
      color: "bg-emerald-500",
      title: "Boshlangich"
    },
    {
      ids: [
        45014,
        45015,
        45016,
        45017,
        45018
      ],
      desc: "MCQ",
      icon: "B8",
      color: "bg-blue-500",
      title: "Ortacha"
    },
    {
      ids: [
        45019,
        45020,
        45021,
        45022,
        45023
      ],
      desc: "Error correction",
      icon: "AA",
      color: "bg-violet-500",
      title: "Qiyin"
    },
    {
      ids: [
        45027,
        45028,
        45029,
        45030,
        45031,
        45032,
        45033,
        45034,
        45035,
        45036,
        45037,
        45038,
        45039,
        45040,
        45041,
        45042,
        45043,
        45044,
        45045,
        65255,
        65256
      ],
      desc: "Transformation + Qo'shimcha",
      icon: "C6",
      color: "bg-rose-500",
      title: "Murakkab"
    },
    { title: "🔀 Aralash", desc: "Relative clauses + Defining/Non-defining farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [65255, 65256, 65257, 65258, 65259] }
  ],
  tests: [
    {
      id: 45046,
      type: "multiple-choice",
      correct: "who",
      options: [
        "which",
        "who",
        "where",
        "when"
      ],
      question: "Odamlar uchun relative pronoun?",
      explanation: "Who = odamlar — tarjima",
      instruction: "Asosiy"
    },
    {
      id: 45047,
      type: "multiple-choice",
      correct: "which",
      options: [
        "who",
        "whose",
        "which",
        "when"
      ],
      question: "Narsalar uchun?",
      explanation: "Which = narsalar — tarjima",
      instruction: "Asosiy"
    },
    {
      id: 45048,
      type: "multiple-choice",
      correct: "defining",
      options: [
        "non-defining",
        "defining",
        "faqat odam",
        "faqat narsa"
      ],
      question: "That qachon ishlatiladi?",
      explanation: "That = defining only",
      instruction: "Asosiy"
    },
    {
      id: 45049,
      type: "multiple-choice",
      correct: "vergul bilan",
      options: [
        "hech narsa",
        "vergul bilan",
        "nuqta bilan",
        "chiziqcha bilan"
      ],
      question: "Non-defining qanday ajratiladi?",
      explanation: "Non-defining = commas",
      instruction: "Asosiy"
    },
    {
      id: 45050,
      type: "multiple-choice",
      correct: "joy",
      options: [
        "vaqt",
        "odam",
        "joy",
        "sabab"
      ],
      question: "Where qachon?",
      explanation: "Where = joy — tarjima",
      instruction: "Asosiy"
    },
    {
      id: 45051,
      type: "multiple-choice",
      correct: "who",
      options: [
        "which",
        "who",
        "whose",
        "where"
      ],
      question: "The woman ___ lives next door is kind.",
      explanation: "Who = odam — tarjima",
      instruction: "Ortacha"
    },
    {
      id: 45052,
      type: "multiple-choice",
      correct: "which",
      options: [
        "who",
        "whose",
        "which",
        "where"
      ],
      question: "The book ___ I read was interesting.",
      explanation: "Which = narsa — tarjima",
      instruction: "Ortacha"
    },
    {
      id: 45053,
      type: "multiple-choice",
      correct: "who",
      options: [
        "that",
        "which",
        "who",
        "whose"
      ],
      question: "My sister, ___ is a doctor, lives in London.",
      explanation: 'Non — defining -> who: Non defining -> who uchun ishlatiladi',
      instruction: "Ortacha"
    },
    {
      id: 45054,
      type: "multiple-choice",
      correct: "whose",
      options: [
        "who",
        "which",
        "whose",
        "that"
      ],
      question: "The student ___ phone rang left.",
      explanation: "Whose = egalik — tarjima",
      instruction: "Ortacha"
    },
    {
      id: 45055,
      type: "multiple-choice",
      correct: "where",
      options: [
        "who",
        "which",
        "where",
        "when"
      ],
      question: "The town ___ I grew up is small.",
      explanation: "Where = joy — tarjima",
      instruction: "Ortacha"
    },
    {
      id: 45056,
      type: "multiple-choice",
      correct: "that",
      options: [
        "who",
        "which",
        "that",
        "where"
      ],
      question: "Non-defining da qaysi pronoun ISHLATILMAYDI?",
      explanation: "Non-defining: that yoq",
      instruction: "Qiyin"
    },
    {
      id: 45057,
      type: "multiple-choice",
      correct: "whom",
      options: [
        "who",
        "whom",
        "whose",
        "which"
      ],
      question: "The man ___ I met is famous (rasmiy).",
      explanation: "Whom = obekt — tarjima",
      instruction: "Qiyin"
    },
    {
      id: 45058,
      type: "multiple-choice",
      correct: "Students who study pass.",
      options: [
        "Students, who study, pass.",
        "Students who study pass.",
        "Students which study pass.",
        "Students whom study pass."
      ],
      question: "Faqat oqigan talabalar otadi?",
      explanation: "Defining (vergulsiz)",
      instruction: "Qiyin"
    },
    {
      id: 45059,
      type: "multiple-choice",
      correct: "My mother, who is kind, helps me",
      options: [
        "The man lives next door is kind",
        "The book who I read was good",
        "My mother, who is kind, helps me",
        "The student which phone rang"
      ],
      question: "Which is CORRECT?",
      explanation: "Non-defining -> commas + who",
      instruction: "Murakkab"
    },
    {
      id: 45060,
      type: "multiple-choice",
      correct: "The book which I bought",
      options: [
        "The man who lives next door",
        "The book which I bought",
        "The car which is parked",
        "The woman who called you"
      ],
      question: "Which pronoun can be OMITTED?",
      explanation: "Obekt -> tushirish mumkin",
      instruction: "Murakkab"
    }
  ],
  testSections: [
    {
      ids: [45046, 45047, 45048, 45049, 45050],
      desc: "Pronounlar",
      icon: "F1",
      color: "bg-emerald-500",
      title: "Oson"
    },
    {
      ids: [45051, 45052, 45053, 45054, 45055],
      desc: "Qollash",
      icon: "B8",
      color: "bg-blue-500",
      title: "Ortacha"
    },
    {
      ids: [45056, 45057, 45058, 45059, 45060],
      desc: "Defining/Non-defining",
      icon: "AA",
      color: "bg-violet-500",
      title: "Qiyin"
    }
  ],
  reading: {
    passage: "My Neighbourhood\n\nI live in a wonderful neighbourhood. The people who live next door are very friendly. There is a park where children play every evening. The cafe which opened last month serves the best coffee.\n\nMy best friend is someone whose family moved here from Japan. We often play football together. The teacher who taught me English lives on the same street.\n\nThere is a library that has many books in different languages. I go there every weekend. The librarian, whose name is Ms. Karimova, is very kind. She always recommends books that I might enjoy.\n\nMy neighbourhood has a market where you can buy fresh fruits and vegetables. The shop that sells the freshest bread is near my house. I know many people who live in this area. It is a place where everyone knows each other.",
    questions: [
      { id: 45061, type: 'multiple-choice' as const, question: "What kind of people live next door?", options: ["Quiet people", "Very friendly people", "Noisy people", "Old people"], correctIndex: 1, explanation: "Who is used for people in relative clauses." },
      { id: 45062, type: 'multiple-choice' as const, question: "What is special about the park?", options: ["It has a cafe", "Children play there every evening", "It is very big", "It has a library"], correctIndex: 1, explanation: "Where is used for places in relative clauses." },
      { id: 45063, type: 'multiple-choice' as const, question: "Which relative pronoun is used for the cafe?", options: ["Who", "Which", "Where", "Whose"], correctIndex: 1, explanation: "Which is used for things in relative clauses." },
      { id: 45064, type: 'multiple-choice' as const, question: "What does the librarian do?", options: ["Sells books", "Recommends books", "Teaches English", "Serves coffee"], correctIndex: 1, explanation: "The relative clause gives extra information about the librarian." },
      { id: 45065, type: 'multiple-choice' as const, question: "What relative pronoun is used for the market?", options: ["Who", "Which", "Where", "Whose"], correctIndex: 2, explanation: "Where is used for places in relative clauses." },
    ]
  }
}

export const phrasalVerbsB1: DailyLesson = {
  id: "phrasal-verbs-b1",
  speaking: {
    prompt: "Tell a short story about your day or a project using phrasal verbs. Speak for about one minute. Use phrasal verbs like 'get up', 'look for', 'give up', 'find out', 'carry on', and 'look forward to'.",
    tips: [
      "Kundalik: 'get up', 'wake up', 'hang out'.",
      "Muammo: 'come up', 'deal with', 'sort out'.",
      "Ba'zi phrasal verblar ajraladi: 'turn it off'.",
      "'look forward to' + V-ing: 'I look forward to seeing you.'",
    ],
    sampleAnswer: "Let me tell you about my week. I usually get up at seven o'clock and look for something quick to eat. A few days ago, I was working on a difficult project and I almost gave up. But I carried on, and eventually I found out the solution. When problems come up, I try to deal with them calmly. In the evening, I like to wind down by listening to music. Sometimes my friends drop by, and we hang out together. I always look forward to the weekend, when I can catch up on my rest.",
  },
  title: "Phrasal Verbs",
  subtitle: "Separable va inseparable phrasal verbs: look after, give up, put off, etc.",
  level: "B1",
  category: "Frasal fe'llar",
  day: 37,
  listening: {
    transcript: "Mum: Please turn off the TV and clean up your room.\nSon: OK. Can I go out after?\nMum: Yes, but be back by six. Don't stay out late.\nSon: Sure. I'll pick up some bread on the way home.\nMum: Good. And don't forget to take out the rubbish.\nSon: I won't. By the way, my friend is coming over tonight.\nMum: That's fine. Just tidy up afterwards.\nSon: Of course. Can you wake me up early tomorrow?\nMum: Yes. Now hurry up — we're running out of time!\nSon: OK, I'm getting ready now.",
    vocabulary: [
      { word: 'turn off', definition: 'o\'chirmoq' },
      { word: 'clean up', definition: 'tozalamoq, yig\'ishtirmoq' },
      { word: 'pick up', definition: 'olib kelmoq, ko\'tarmoq' },
      { word: 'take out', definition: 'tashqariga chiqarmoq' },
      { word: 'hurry up', definition: 'shoshilmoq' },
    ],
    questions: [
      { id: 90821, type: 'multiple-choice', question: "What does Mum ask the son to turn off?", options: ["The light", "The TV", "The radio", "The computer"], correctIndex: 1, explanation: "'turn off the TV' — phrasal verb (separable)." },
      { id: 90822, type: 'multiple-choice', question: "By what time must the son be back?", options: ["Five", "Six", "Seven", "Eight"], correctIndex: 1, explanation: '\'be back by six.\' (ingliz tili qoidasi)' },
      { id: 90823, type: 'multiple-choice', question: "What will the son pick up on the way home?", options: ["Milk", "Bread", "Fruit", "A newspaper"], correctIndex: 1, explanation: "'I'll pick up some bread on the way home.'" },
      { id: 90824, type: 'true-false', question: "A friend is coming over tonight.", answer: true, explanation: "'my friend is coming over tonight' — come over = visit." },
      { id: 90825, type: 'multiple-choice', question: "What does the son ask Mum to do tomorrow?", options: ["Cook breakfast", "Wake him up early", "Drive him", "Buy bread"], correctIndex: 1, explanation: "'Can you wake me up early tomorrow?'" },
    ],
    difficulty: 'medium',
    topic: "Phrasal fe'llar — turn off / clean up / pick up / take out",
  },
  formulas: [
    {
      color: "green",
      label: "Inseparable",
      structure: "Verb + particle (together)\nI look after my sister.",
      explanation: "Ajralmaydigan phrasal verb — zarra fe'ldan keyin, to'ldiruvchi butun birikmadan keyin keladi.",
      whenToUse: "look after, get over, run into kabi ajralmaydigan fe'llarda.",
      example: "I look after my little sister."
    },
    {
      color: "blue",
      label: "Separable (noun)",
      structure: "Verb + noun + particle\nI picked my friend up.",
      explanation: "Ajraladigan phrasal verb — ot to'ldiruvchi zarradan oldin yoki keyin kela oladi.",
      whenToUse: "Ot to'ldiruvchi bilan (ikkala joy ham to'g'ri).",
      example: "I picked my friend up. / I picked up my friend."
    },
    {
      color: "red",
      label: "Separable (pronoun)",
      structure: "Verb + pronoun + particle\nI picked him up.",
      explanation: "Olmosh to'ldiruvchi bo'lsa, DOIM fe'l va zarra orasida keladi.",
      whenToUse: "To'ldiruvchi olmosh (him/it/them) bo'lganda.",
      example: "I picked him up. (not 'picked up him')"
    },
    {
      color: "orange",
      label: "Three-word phrasal verb",
      structure: "Verb + particle1 + particle2\nI look forward to meeting you.",
      explanation: "Uch so'zli phrasal verb — ajralmaydi, to'ldiruvchi oxirida keladi.",
      whenToUse: "look forward to, come up with, put up with kabi.",
      example: "I look forward to meeting you."
    }
  ],
  rules: [
    "1️⃣ PHRASAL VERBS NIMA?\n\nPhrasal verb — bu verb + particle (preposition yoki adverb) birikmasi bo'lib, yangi ma'no hosil qiladi.\n\n📌 MUHIM: Phrasal verb ma'nosi uning tarkibidagi so'zlarning ma'nosidan farq qiladi!\n  → look = qaramoq / look after = qaramoq (birovga g'amxo'rlik qilish)\n  → give = bermoq / give up = tashlamoq, voz kechmoq\n\n📌 IKKI XIL TURI BOR:\n  • Inseparable (ajralmaydigan) — particle obektdan oldin keladi\n  • Separable (ajraladigan) — noun obekt particle dan oldin yoki keyin kela oladi",

    "2️⃣ INSEPARABLE PHRASAL VERBS\n\nInseparable phrasal verb'larda particle obektdan AYRILMAYDI — har doim birga keladi.\n\n📌 MISOLLAR:\n  • look after → I look after my sister. (Singlimga qarayman)\n  • run into → I ran into an old friend. (Eski do'stimga tasodifan duch keldim)\n  • get over → She got over her illness. (U kasalligidan tuzaldi)\n  • care for → He cares for his parents. (U ota-onasiga qaraydi)\n  • depend on → It depends on the weather. (Ob-havoga bog'liq)\n\n🔴 QOIDA: Obekt particle dan keyin keladi. Verb va particle orasiga hech narsa qo'yib bo'lmaydi.\n  ✅ I look after my sister.\n  ❌ I look my sister after.",

    "3️⃣ SEPARABLE PHRASAL VERBS\n\nSeparable phrasal verb'larda obekt (noun) verb va particle orasiga qo'yilishi mumkin.\n\n📌 NOUN BILAN — ikki xil variant:\n  • Verb + particle + noun: Turn off the TV.\n  • Verb + noun + particle: Turn the TV off.\n\n📌 PRONOUN BILAN — DOIM verb + pronoun + particle:\n  ✅ Turn it off.\n  ❌ Turn off it.\n\n📌 MISOLLAR:\n  • pick up / put down / turn on / take off / give up\n  → Pick up the book. / Pick the book up. / Pick it up.\n  → Put on your coat. / Put your coat on. / Put it on.\n\n🔴 Pronoun bilan ALWAYS verb orasida!",

    "4️⃣ COMMON PHRASAL VERBS\n\nEng keng tarqalgan phrasal verb'lar:\n\n📌 INSEPARABLE:\n  • get along with — I get along with my colleagues.\n  • come across — I came across an interesting article.\n  • go through — She went through a difficult time.\n  • take after — He takes after his father.\n  • break down — The car broke down on the highway.\n\n📌 SEPARABLE:\n  • find out — Find out the truth. / Find the truth out.\n  • bring up — She brought up three children. / She brought them up.\n  • carry out — Carry out the plan. / Carry it out.\n  • put away — Put away your toys. / Put them away.\n\n📌 THREE-WORD (doim inseparable):\n  • look forward to — I look forward to meeting you.\n  • put up with — I can't put up with this noise.\n  • run out of — We ran out of milk.\n  • look up to — I look up to my teacher.\n  • come up with — She came up with a great idea.",

    "5️⃣ PHRASAL VERBS IN CONTEXT\n\n📌 KONTEKST MUHIM: Phrasal verb'lar ko'p ma'noli bo'lishi mumkin. Ma'no kontekstga qarab tushuniladi.\n  • give up = tashlamoq: I gave up smoking. (Chekishni tashladim)\n  • give up = topshirmoq: He gave up his seat. (Joyini berdi)\n\n📌 RASMIY VA NORASMIY:\n  • Norasmiy (phrasal verb): investigate → look into\n  • Rasmiy (single verb): reduce → cut down on\n  • IELTS: Rasmiy yozuvda single verb afzal, speaking da phrasal verb tabiiy\n\n📌 ESLATMA: Phrasal verb'ni noto'g'ri ishlatish — keng tarqalgan xato. Har bir phrasal verb ni inseparable yoki separable ekanini alohida o'rganing!",
  ],
  vocabulary: [
    {
      en: "look after",
      uz: "qaramoq",
      rule: "inseparable",
      example: "I look after my brother."
    },
    {
      en: "give up",
      uz: "tashlamoq, voz kechmoq",
      rule: "separable",
      example: "He gave up smoking."
    },
    {
      en: "pick up",
      uz: "olmoq, terib olmoq",
      rule: "separable",
      example: "Pick me up at 5."
    },
    {
      en: "turn off",
      uz: "ochirmoq",
      rule: "separable",
      example: "Turn off the TV."
    },
    {
      en: "put on",
      uz: "kiymoq, qoymoq",
      rule: "separable",
      example: "Put on your jacket."
    },
    {
      en: "take after",
      uz: "o'xshab ketmoq",
      rule: "inseparable",
      example: "She takes after her father."
    },
    {
      en: "run into",
      uz: "uchratib qolmoq (tasodifan)",
      rule: "inseparable",
      example: "I ran into Ali yesterday."
    },
    {
      en: "get over",
      uz: "o'tib ketmoq (tuzalmoq)",
      rule: "inseparable",
      example: "He got over the flu."
    },
    {
      en: "look forward to",
      uz: "intizor bolmoq",
      rule: "three-word",
      example: "I look forward to meeting you."
    },
    {
      en: "put up with",
      uz: "chidamoq",
      rule: "three-word",
      example: "I can't put up with this noise."
    },
    {
      en: "find out",
      uz: "bilib olmoq",
      rule: "separable",
      example: "Find out the truth."
    },
    {
      en: "bring up",
      uz: "tarbiyalamoq, gap ochmoq",
      rule: "separable",
      example: "She brought up three children."
    },
    {
      en: "phrasal verb",
      uz: "fraza fe'l",
      rule: "core concept",
      example: "A phrasal verb is a verb + particle."
    },
    {
      en: "particle",
      uz: "yuklama (preposition/adverb)",
      rule: "phrasal verb",
      example: "The particle can be up, off, on, etc."
    },
    {
      en: "separable",
      uz: "ajratiladigan",
      rule: "separable",
      example: "Pick up is separable — pick my friend up."
    },
    {
      en: "inseparable",
      uz: "ajratilmaydigan",
      rule: "inseparable",
      example: "Look after is inseparable — look after him."
    }
  ],
  examples: [
    {
      en: "Please look after my cat while I'm away.",
      uz: "Men yo'qimda mushugimga qarang."
    },
    {
      en: "He gave up smoking last year.",
      uz: "U o'tgan yili chekishni tashladi."
    },
    {
      en: "Can you pick me up at the airport?",
      uz: "Meni aeroportda olib keta olasizmi?"
    },
    {
      en: "Turn off the lights before leaving.",
      uz: "Ketishdan oldin chiroqni o'chiring."
    },
    {
      en: "She takes after her mother.",
      uz: "U onasiga o'xshab ketgan."
    },
    {
      en: "I ran into an old friend yesterday.",
      uz: "Kecha eski do stirimni uchratib qoldim."
    },
    {
      en: "I'm looking forward to the weekend.",
      uz: "Dam olish kunini intizorlik bilan kutyapman."
    },
    {
      en: "I can't put up with this noise anymore.",
      uz: "Bu shovqinga boshqa chidolmayman."
    }
  ],
  specialCases: [
    {
      id: "separable-vs-inseparable",
      rule: "SEPARABLE: noun ikkala tomonda, pronoun faqat orada. INSEPARABLE: doim birga.",
      title: "Separable va Inseparable farqi",
      drills: [
        {
          id: 45066,
          type: "fill-blank",
          blanks: [
            "him up"
          ],
          question: "I picked ___ (up / him / him up).",
          explanation: 'Pronoun bilan particle birga ishlatiladi (grammatik qoida)',
          instruction: "Pronoun:"
        },
        {
          id: 45067,
          type: "error-correction",
          correct: "Please pick me up at 5.",
          question: "Please pick up me at 5.",
          errorPart: "up me",
          explanation: "Pronoun -> verb orasida",
          instruction: "Error correction:"
        },
        {
          id: 45068,
          type: "multiple-choice",
          correct: "I look after him",
          options: [
            "I look after him",
            "I look him after",
            "I look after he",
            "I look he after"
          ],
          question: "Which is CORRECT?",
          explanation: "Inseparable — ajralmas phrasal verb, o'zgarishsiz",
          instruction: "Tanlang:"
        }
      ],
      examples: [
        {
          en: "I picked up my friend. / I picked my friend up.",
          uz: "Do'stimni oldim."
        },
        {
          en: "I picked him up. (not: I picked up him)",
          uz: "Uni oldim."
        }
      ],
      mnemonic: "Pronoun always between verb and particle for separable",
      commonMistakes: "I look after him (to'g'ri). I look him after (noto'g'ri)"
    },
    {
      id: "three-word-phrasal-verbs",
      rule: "Verb + particle1 + particle2 = doim inseparable. Obekt particle2 dan keyin.",
      title: "Three-word phrasal verbs",
      drills: [
        {
          id: 45069,
          type: "fill-blank",
          blanks: [
            "to"
          ],
          question: "I look forward ___ hearing from you.",
          explanation: 'Look forward TO (ingliz tilida shunday ishlatiladi)',
          instruction: "Three-word:"
        },
        {
          id: 45070,
          type: "error-correction",
          correct: "I look forward to meeting you.",
          question: "I look forward to meet you.",
          errorPart: "to meet",
          explanation: "Look forward to + -ing",
          instruction: "Error correction:"
        },
        {
          id: 45071,
          type: "multiple-choice",
          correct: "with",
          options: [
            "with",
            "with it",
            "it",
            "to"
          ],
          question: "She couldnt put up ___ the noise.",
          explanation: "Put up WITH — chidamoq, dosh bermoq: put up with noise",
          instruction: "Tanlang:"
        }
      ],
      examples: [
        {
          en: "I'm looking forward to meeting you.",
          uz: "Siz bilan uchrashishni intiqlik bilan kutyapman."
        },
        {
          en: "She came up with a great idea.",
          uz: "U ajoyib fikr topdi."
        }
      ],
      mnemonic: "Verb + prep + prep = object at the end always",
      commonMistakes: "I look forward to meet you (meeting kerak)"
    },
    {
      id: "phrasal-verb-vs-single",
      rule: "Phrasal verb informal, single word formal. Contextga qarab tanlanadi.",
      title: "Phrasal verb vs Single word verb",
      drills: [
        {
          id: 45072,
          type: "fill-blank",
          blanks: [
            "investigate"
          ],
          question: "We need to ___ (investigate/look into) the matter formally.",
          explanation: "Rasmiy -> single word",
          instruction: "Formal:"
        },
        {
          id: 45073,
          type: "multiple-choice",
          correct: "looked into",
          options: [
            "investigated",
            "looked into",
            "examined",
            "analyzed"
          ],
          question: "Informal: The company ___ the problem.",
          explanation: "Phrasal = informal — tarjima",
          instruction: "Tanlang:"
        },
        {
          id: 45074,
          type: "error-correction",
          correct: "The CEO examined the report.",
          question: "The CEO looked into the report formally. (too informal)",
          errorPart: "looked into",
          explanation: "Formal -> single word",
          instruction: "Error correction:"
        }
      ],
      examples: [
        {
          en: "The police investigated the crime. (formal)",
          uz: "Politsiya jinoyatni tekshirdi."
        },
        {
          en: "The police looked into the crime. (informal)",
          uz: "Politsiya jinoyatni ko'rib chiqdi."
        }
      ],
      mnemonic: "Phrasal = daily talk, Single = academic/formal",
      commonMistakes: "Rasmiy yozuvda phrasal verb ishlatish"
    }
  ],
  exercises: [
    {
      id: 45075,
      type: "fill-blank",
      blanks: [
        "look"
      ],
      question: "Please ___ after the children.",
      explanation: "Look after = qaramoq",
      instruction: "Phrasal verb:"
    },
    {
      id: 45076,
      type: "fill-blank",
      blanks: [
        "the light"
      ],
      question: "Turn ___ off before leaving.",
      explanation: "Turn off is separable: 'the light' is the noun object and goes between the verb and the particle",
      instruction: "Object:"
    },
    {
      id: 45077,
      type: "fill-blank",
      blanks: [
        "him"
      ],
      question: "I picked ___ up at the station.",
      explanation: 'Pronoun before up (ingliz tilida shunday ishlatiladi)',
      instruction: "Pronoun:"
    },
    {
      id: 45078,
      type: "fill-blank",
      blanks: [
        "after"
      ],
      question: "She takes ___ her grandmother.",
      explanation: "Take after = inseparable",
      instruction: "Inseparable:"
    },
    {
      id: 45079,
      type: "fill-blank",
      blanks: [
        "to"
      ],
      question: "I'm looking forward ___ the party.",
      explanation: 'Look forward TO (ingliz tilida shunday ishlatiladi)',
      instruction: "Three-word:"
    },
    { id: 45080, type: 'fill-blank', instruction: 'Tanlang:', question: 'I ran ___ an old friend yesterday.', blanks: ['into'], explanation: 'Run into = tasodifan uchrashish' },
    { id: 45081, type: 'fill-blank', instruction: 'Tanlang:', question: 'He gave ___ smoking last year.', blanks: ['up'], explanation: 'Give up = tashlamoq — "Give up" so\'zining tarjimasi' },
    { id: 45082, type: 'fill-blank', instruction: 'Tanlang:', question: 'Put ___ your jacket, its cold.', blanks: ['on'], explanation: 'Put on = kiymoq (ingliz tilida "kiymoq" degan ma\'no)' },
    { id: 45083, type: 'fill-blank', instruction: 'Tanlang:', question: 'I can\'t put ___ with this noise.', blanks: ['up'], explanation: 'Put up with = chidamoq' },
    { id: 45084, type: 'fill-blank', instruction: 'Tanlang:', question: 'She takes ___ her mother.', blanks: ['after'], explanation: 'Take after = oxshamoq' },
    {
      id: 45085,
      type: "error-correction",
      correct: "I look after my grandmother on weekends.",
      question: "I look my grandmother after on weekends.",
      errorPart: "my grandmother after",
      explanation: "Look after is inseparable: the object stays after the particle",
      instruction: "Error correction:"
    },
    {
      id: 45086,
      type: "error-correction",
      correct: "Please pick me up at 5.",
      question: "Please pick up me at 5.",
      errorPart: "up me",
      explanation: "Pronoun -> verb + pronoun + particle",
      instruction: "Error correction:"
    },
    {
      id: 45087,
      type: "error-correction",
      correct: "I look forward to meeting you.",
      question: "I look forward to meet you.",
      errorPart: "to meet",
      explanation: "Look forward to + -ing",
      instruction: "Error correction:"
    },
    {
      id: 45088,
      type: "error-correction",
      correct: "Turn it off before leaving.",
      question: "Turn off it before leaving.",
      errorPart: "off it",
      explanation: 'Pronoun — > orada: Pronoun > orada uchun ishlatiladi',
      instruction: "Error correction:"
    },
    {
      id: 45089,
      hint: "Please...",
      type: "transformation",
      correct: "Please care for the children.",
      question: "Please look after the children. (use: care for)",
      explanation: "Synonym — sinonim, bir xil ma'noli so'z",
      instruction: "O'zgartiring:"
    },
    {
      id: 45090,
      hint: "He gave...",
      type: "transformation",
      correct: "He gave up smoking.",
      question: "He stopped smoking. (use: give up)",
      explanation: 'Give up = tashlamoq — "Give up" so\'zining tarjimasi',
      instruction: "O'zgartiring:"
    },
    {
      id: 45091,
      hint: "I ran...",
      type: "transformation",
      correct: "I ran into her yesterday.",
      question: "I met her by chance yesterday. (use: run into)",
      explanation: "Run into = tasodifan uchrashmoq",
      instruction: "O'zgartiring:"
    },
    {
      id: 45092,
      type: "fill-blank",
      blanks: [
        "up"
      ],
      question: "I picked my friend ___ after work.",
      explanation: 'Pick up = separable — "Pick up" so\'zining tarjimasi',
      instruction: "Separable:"
    },
    {
      id: 45093,
      type: "fill-blank",
      blanks: [
        "over"
      ],
      question: "He couldnt get ___ his illness quickly.",
      explanation: 'Get over = tuzalmoq — "Get over" so\'zining tarjimasi',
      instruction: "Phrasal:"
    },
    {
      id: 45094,
      type: "multiple-choice",
      correct: "I look forward to meeting you",
      options: [
        "I look forward to meet you",
        "I look forward to meeting you",
        "I look forward meet you",
        "I look forward meeting you"
      ],
      question: "Which is CORRECT?",
      explanation: "Look forward to + -ing",
      instruction: "Tanlang:"
    },
    {
    id: 45095,
    type: "fill-blank",
    blanks: [
        "into"
    ],
    question: "I ran ___ an old friend at the market.",
    explanation: "Run into — tasodifan uchrashmoq: I ran into my friend",
    instruction: "Inseparable:"
},
    {
    id: 45096,
    type: "fill-blank",
    blanks: [
        "out"
    ],
    question: "We need to find ___ what happened.",
    explanation: "Find out — aniqlamoq, bilib olmoq: I found out the truth",
    instruction: "Separable:"
},
    {
    id: 45097,
    type: "fill-blank",
    blanks: [
        "through"
    ],
    question: "She has been ___ a lot lately.",
    explanation: "Go through — o'tmoq, tekshirmoq: Go through the gate",
    instruction: "Phrasal:"
},
    { id: 45098, type: 'fill-blank', instruction: 'Tanlang:', question: 'Please turn ___ the TV before sleeping.', blanks: ['off'], explanation: 'Turn off — o\'chirmoq: Turn off the light' },
    { id: 45099, type: 'fill-blank', instruction: 'Tanlang:', question: 'We ran ___ of milk.', blanks: ['out'], explanation: 'Run out of — tugamoq, kamaymoq: We ran out of milk' },
    { id: 45100, type: 'fill-blank', instruction: 'Tanlang:', question: 'She had to ___ three children alone.', blanks: ['bring up'], explanation: 'Bring up — tarbiyalamoq, o\'stirmoq' },
    {
    id: 45101,
    type: "error-correction",
    correct: "He takes after his father.",
    question: "He takes his father after.",
    errorPart: "his father after",
    explanation: "Take after = inseparable",
    instruction: "Error correction:"
},
    {
    id: 45102,
    type: "error-correction",
    correct: "Turn off the lights before leaving.",
    question: "Turn the lights before leaving off.",
    errorPart: "before leaving off",
    explanation: "Separable: verb + particle + noun",
    instruction: "Error correction:"
},
    {
    id: 45103,
    type: "transformation",
    hint: "I put on...",
    correct: "I put on my jacket because it was cold.",
    question: "I put my jacket on because it was cold.",
    explanation: "Separable word order",
    instruction: "O'zgartiring:"
},
    {
    id: 45104,
    type: "transformation",
    hint: "She came up with...",
    correct: "She came up with a brilliant idea.",
    question: "She thought of a brilliant idea. (use: come up with)",
    explanation: 'Come up with (ingliz tilida shunday ishlatiladi)',
    instruction: "O'zgartiring:"
},
    {
    id: 45105,
    type: "fill-blank",
    blanks: [
        "along"
    ],
    question: "My sister and I get ___ well.",
    explanation: "Get along — yaxshi munosabatda bo'lmoq",
    instruction: "Phrasal:"
},
    {
    id: 45106,
    type: "fill-blank",
    blanks: [
        "away"
    ],
    question: "Please put ___ your toys.",
    explanation: "Put away — joyiga qo'ymoq: Put away your toys",
    instruction: "Separable:"
},
    {
    id: 45107,
    type: "fill-blank",
    blanks: [
        "down"
    ],
    question: "The car broke ___ on the highway.",
    explanation: "Break down — buzilmoq, yo'qotmoq: The car broke down",
    instruction: "Inseparable:"
},

    // ── Interleaved Practice: Phrasal verbs + Separable/Inseparable ──
    { id: 65260, type: 'fill-blank', instruction: "Separable vs inseparable:", question: "I picked my friend ___ after work. I look ___ my sister on weekends.", blanks: ['up', 'after'], explanation: "Pick up = separable (noun can go between). Look after = inseparable (always together)." },
    { id: 65261, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is CORRECT? Pick ___ up at 5.", options: ["me", "Pick me up", "up me", "me up"], correct: "me", explanation: "Pronoun always goes between verb and particle for separable phrasal verbs." },
    { id: 65262, type: 'error-correction', instruction: "Phrasal verb word order:", question: "Please pick up me at 5. I look forward to meet you.", errorPart: 'up me / to meet', correct: "Please pick me up at 5. I look forward to meeting you.", explanation: "Pronoun = verb + pronoun + particle. Look forward to + V-ing." },
    { id: 65263, type: 'fill-blank', instruction: "Three-word phrasal verbs:", question: "I look forward ___ hearing from you. She came up ___ a great idea. We ran out ___ milk.", blanks: ['to', 'with', 'of'], explanation: "Three-word phrasal verbs: look forward to, come up with, run out of." },
    { id: 65264, type: 'transformation', instruction: "Formal to phrasal:", question: "I cannot tolerate this noise anymore. (use: put up with)", hint: "I cannot...", correct: "I cannot put up with this noise anymore.", explanation: "Tolerate = formal. Put up with = phrasal verb (informal)." }
],
  exerciseSections: [
    {
      ids: [
        2801,
        2802,
        2803,
        2804,
        2805
      ],
      desc: "Basic phrasal verbs",
      icon: "F1",
      color: "bg-emerald-500",
      title: "Boshlangich"
    },
    {
      ids: [
        2806,
        2807,
        2808,
        2809,
        2810
      ],
      desc: "MCQ",
      icon: "B8",
      color: "bg-blue-500",
      title: "Ortacha"
    },
    {
      ids: [
        2811,
        2812,
        2813,
        2814,
        2815
      ],
      desc: "Error correction",
      icon: "AA",
      color: "bg-violet-500",
      title: "Qiyin"
    },
    {
      ids: [
        2816,
        2817,
        2818,
        2819,
        2820,
        2821,
        2822,
        2823,
        2824,
        2825,
        2826,
        2827,
        2828,
        2829,
        2830,
        2831,
        2832,
        2833
      ],
      desc: "Transformation + Qo'shimcha",
      icon: "C6",
      color: "bg-rose-500",
      title: "Murakkab"
    },
    { title: "🔀 Aralash", desc: "Phrasal verbs + Separable/Inseparable farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95611, 95612, 95613, 95614, 95615] }
  ],
  tests: [
    {
      id: 45108,
      type: "multiple-choice",
      correct: "qaramoq",
      options: [
        "qaramoq",
        "qidirmoq",
        "kuzatmoq",
        "topmoq"
      ],
      question: "What does 'look after' mean?",
      explanation: "Look after = to take care of",
      instruction: "Asosiy"
    },
    {
      id: 45109,
      type: "multiple-choice",
      correct: "tashlamoq",
      options: [
        "bermoq",
        "tashlamoq",
        "olmoq",
        "ochmoq"
      ],
      question: "What does 'give up' mean?",
      explanation: "Give up = to stop or quit",
      instruction: "Asosiy"
    },
    {
      id: 45110,
      type: "multiple-choice",
      correct: "uchratib qolmoq",
      options: [
        "yugurmoq",
        "kirib ketmoq",
        "uchratib qolmoq",
        "topmoq"
      ],
      question: "What does 'run into' mean?",
      explanation: "Run into = to meet unexpectedly",
      instruction: "Asosiy"
    },
    {
      id: 45111,
      type: "multiple-choice",
      correct: "ha",
      options: [
        "ha",
        "yoq",
        "ba'zan",
        "three-word"
      ],
      question: "Is 'give up' separable?",
      explanation: 'Give up = separable — "Give up" so\'zining tarjimasi',
      instruction: "Asosiy"
    },
    {
      id: 45112,
      type: "multiple-choice",
      correct: "inseparable",
      options: [
        "separable",
        "inseparable",
        "three-word",
        "none"
      ],
      question: "Is 'look after' separable or inseparable?",
      explanation: "Look after = inseparable",
      instruction: "Asosiy"
    },
    {
      id: 45113,
      type: "multiple-choice",
      correct: "into",
      options: [
        "after",
        "into",
        "over",
        "through"
      ],
      question: "I ran ___ an old friend.",
      explanation: "Run into — tasodifan uchrashmoq: I ran into my friend",
      instruction: "Ortacha"
    },
    {
      id: 45114,
      type: "multiple-choice",
      correct: "up",
      options: [
        "in",
        "up",
        "out",
        "off"
      ],
      question: "He gave ___ smoking.",
      explanation: "Give up — voz kechmoq, tashlamoq: Don't give up",
      instruction: "Ortacha"
    },
    {
      id: 45115,
      type: "multiple-choice",
      correct: "on",
      options: [
        "off",
        "on",
        "down",
        "away"
      ],
      question: "Put ___ your jacket.",
      explanation: "Put on — kiyinmoq: Put on your coat",
      instruction: "Ortacha"
    },
    {
      id: 45116,
      type: "multiple-choice",
      correct: "with",
      options: [
        "for",
        "with",
        "to",
        "at"
      ],
      question: "I put up ___ the noise.",
      explanation: "Put up with — chidamoq, dosh bermoq: I can't put up with noise",
      instruction: "Ortacha"
    },
    {
      id: 45117,
      type: "multiple-choice",
      correct: "after",
      options: [
        "after",
        "over",
        "up",
        "in"
      ],
      question: "She takes ___ her father.",
      explanation: "Take after — o'xshamoq, taqlid qilmoq: She takes after her mother",
      instruction: "Ortacha"
    },
    {
      id: 45118,
      type: "multiple-choice",
      correct: "Yes, pronoun",
      options: [
        "Yes, pronoun",
        "Yes, noun",
        "No",
        "Three-word"
      ],
      question: "Pick me up -> separable?",
      explanation: 'Pronoun — > orada: Pronoun > orada uchun ishlatiladi',
      instruction: "Qiyin"
    },
    {
      id: 45119,
      type: "multiple-choice",
      correct: "look after him",
      options: [
        "pick him up",
        "look after him",
        "turn it on",
        "give it up"
      ],
      question: "Inseparable pronoun?",
      explanation: "Look after = inseparable",
      instruction: "Qiyin"
    },
    {
      id: 45120,
      type: "multiple-choice",
      correct: "look forward to",
      options: [
        "look after",
        "give up",
        "look forward to",
        "pick up"
      ],
      question: "Three-word phrasal verb?",
      explanation: "Three-word — uch so'zli phrasal verb: look forward to",
      instruction: "Qiyin"
    },
    {
      id: 45121,
      type: "multiple-choice",
      correct: "Pick me up",
      options: [
        "Pick up me",
        "Pick me up",
        "Pick up I",
        "Pick I up"
      ],
      question: "Which is CORRECT?",
      explanation: 'Pronoun — > orada: Pronoun > orada uchun ishlatiladi',
      instruction: "Murakkab"
    },
    {
      id: 45122,
      type: "multiple-choice",
      correct: "The CEO investigated the matter",
      options: [
        "The CEO looked into the matter",
        "The CEO investigated the matter",
        "The CEO checked out the matter",
        "The CEO looked at the matter"
      ],
      question: "Which is CORRECT formal?",
      explanation: "Rasmiy -> single word",
      instruction: "Murakkab"
    }
  ],
  testSections: [
    {
      ids: [45111, 45112, 45113, 45114, 45115],
      desc: "Meanings",
      icon: "F1",
      color: "bg-emerald-500",
      title: "Oson"
    },
    {
      ids: [45116, 45117, 45118, 45119, 45120],
      desc: "Qollash",
      icon: "B8",
      color: "bg-blue-500",
      title: "Ortacha"
    },
    {
      ids: [
        291,
        292,
        293
      ],
      desc: "Separable/Inseparable",
      icon: "AA",
      color: "bg-violet-500",
      title: "Qiyin"
    },
    {
      ids: [45121, 45122],
      desc: "Sinov",
      icon: "C6",
      color: "bg-rose-500",
      title: "Murakkab"
    }
  ],
  reading: {
    passage: "Phrasal Verbs in Daily Life\n\nUlug'bek is telling his friend Sarvar about his day.\n\n\"I woke up late this morning. I had to hurry up and get ready quickly. I picked up my bag and ran out of the house.\"\n\nSarvar asks: \"Did you have breakfast?\"\n\"No, I didn't. I stopped at the bakery and picked up a sandwich. I looked after my little brother yesterday, so I was tired.\"\n\n\"What about the meeting?\" asks Sarvar.\n\"Oh, I had to put off the meeting until next week. The manager couldn't come. We need to find out what happened.\"\n\n\"And tonight?\"\n\"I'm looking forward to the concert. I'll pick up my friend at 7. We're going to have a great time!\"\n\n\"Don't stay out late,\" says Sarvar. \"You shouldn't give up sleep.\"\n\"Don't worry, I'll turn in early tomorrow. I can't put up with being tired all the time!\"",
    questions: [
      { id: 45123, type: 'multiple-choice' as const, question: "What does Ulug'bek mean by 'hurry up'?", options: ["Slow down", "Move quickly", "Give up", "Turn off"], correctIndex: 1, explanation: "'Hurry up' = tezlash, shoshilmoq." },
      { id: 45124, type: 'multiple-choice' as const, question: "What did Ulug'bek pick up at the bakery?", options: ["A book", "A sandwich", "A friend", "His brother"], correctIndex: 1, explanation: "'Pick up' = olib kelmoq, sotib olmoq." },
      { id: 45125, type: 'multiple-choice' as const, question: "Why did Ulug'bek put off the meeting?", options: ["He was sick", "The manager couldn't come", "He forgot", "It was cancelled"], correctIndex: 1, explanation: "'Put off' = kechiktirmoq." },
      { id: 45126, type: 'multiple-choice' as const, question: "What is Ulug'bek looking forward to?", options: ["Work", "A concert", "Sleep", "A meeting"], correctIndex: 1, explanation: "'Look forward to' = intizor bolmoq." },
      { id: 45127, type: 'multiple-choice' as const, question: "What does Sarvar mean by 'give up sleep'?", options: ["Sleep more", "Stop sleeping", "Lose sleep", "Wake up early"], correctIndex: 2, explanation: "'Give up' = voz kechmoq, tashlamoq." },
    ]
  }
}
