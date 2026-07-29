import type { GrammarTopic } from "./types"
// ─── Topic 17: Inversion (B2) ────────────────────────────────────────────────────

export const inversion: GrammarTopic = {
  id: 'inversion',
  title: 'Inversion',
  subtitle: "Not only, hardly, no sooner, only after — teskari so'z tartibi",
  level: 'B2',
  week: 8,
  tag: 'Grammar',
  formula: 'Not only + inversion · Hardly + had + subject + V³ ... when · No sooner + had + subject + V³ ... than · Only after / only when / not until + clause + inversion',
  formulaRows: [
    { label: "Not only (nafaqat ... balki)",  structure: "Not only + auxiliary + subject + V¹ · but also + clause", color: 'blue'   },
    { label: "Rarely / Seldom / Never",        structure: "Rarely / Seldom / Never + auxiliary + subject + V¹",      color: 'purple' },
    { label: "Hardly ... when / No sooner ... than", structure: "Hardly + had + subject + V³ ... when · No sooner + had + subject + V³ ... than", color: 'green'  },
    { label: "Only after / only when / not until",  structure: "Only after / only when / not until + clause + auxiliary + subject + V¹", color: 'orange' },
  ],
  usedFor: [
    "Inversion bilan urg'u berish va gapni ta'kidlash",
    "'Not only' bilan ikkala ma'lumotni ham ta'kidlash",
    "'Hardly/No sooner' bilan ikki harakatning birin-ketinligini ta'kidlash",
    "'Only after/when/not until' bilan vaqt shartini ta'kidlash",
  ],
  examples: [
    { en: "Not only does she speak English, but she also speaks French.",            uz: "U nafaqat ingliz tilida, balki fransuz tilida ham gapiradi." },
    { en: "Rarely have I seen such a beautiful sunset in my entire life.",            uz: "Kamdan-kam hollarda bunday go'zal quyosh botishini ko'rganman." },
    { en: "Hardly had we sat down when the phone rang loudly.",                       uz: "Zo'rg'a o'tirgan edikki, telefon jiringladi." },
    { en: "No sooner had she finished the exam than the teacher collected the papers.", uz: "U imtihonni tugatishi bilan o'qituvchi qog'ozlarni yig'di." },
    { en: "Only after you apologise will I forgive you completely.",                  uz: "Agar kechirim so'rasang, shundan keyin men seni kechiraman." },
  ],
  exercises: [
    {
      id: 204, type: 'fill-blank',
      instruction: "Inversion bilan to'ldiring (Not only):",
      question: "Not only _____ she speak English, but she also speaks French.",
      blanks: ['does'],
      explanation: "'Not only' + auxiliary (does) + subject + V¹. 'Does' — Present Simple yordamchi fe'li.",
    },
    {
      id: 205, type: 'fill-blank',
      instruction: "Inversion bilan to'ldiring (Rarely):",
      question: "Rarely _____ we seen such a talented young musician perform live.",
      blanks: ['have'],
      explanation: "'Rarely' + have + subject + V³. 'Rarely have we seen' — kamdan-kam ko'ramiz.",
    },
    {
      id: 206, type: 'fill-blank',
      instruction: "Inversion bilan to'ldiring (Hardly):",
      question: "Hardly had the concert started _____ the lights went out completely.",
      blanks: ['when'],
      explanation: "'Hardly had + subject + V³ ... when + clause'. 'When' bilan bog'lanadi.",
    },
    {
      id: 207, type: 'fill-blank',
      instruction: "Inversion bilan to'ldiring (No sooner):",
      question: "No sooner had I closed my eyes _____ I heard a strange noise outside.",
      blanks: ['than'],
      explanation: "'No sooner had + subject + V³ ... than + clause'. 'Than' bilan bog'lanadi.",
    },
    {
      id: 208, type: 'fill-blank',
      instruction: "Inversion bilan to'ldiring (Only after):",
      question: "Only after you _____ the form will we process your application.",
      blanks: ['submit'],
      explanation: "'Only after + clause (Present Simple) + inversion (will + subject + V¹)'. 'Submit' — Present Simple.",
    },
    {
      id: 209, type: 'fill-blank',
      instruction: "Inversion bilan to'ldiring (Seldom):",
      question: "Seldom _____ we encounter such dedication and hard work in our team.",
      blanks: ['do'],
      explanation: "'Seldom' + do + subject + V¹. 'Seldom do we encounter' — juda kam uchratamiz.",
    },
    {
      id: 210, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Not only ___ she a great singer, but she also plays the piano beautifully.",
      options: ['is', 'does', 'has', 'was'],
      correct: 'is',
      explanation: "'Not only' + be (is) + subject. She is a singer → 'Not only is she a singer'.",
    },
    {
      id: 211, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Hardly had we arrived at the station ___ the train left.",
      options: ['when', 'than', 'then', 'that'],
      correct: 'when',
      explanation: "'Hardly had + subject + V³ ... when + clause'. 'When' — to'g'ri bog'lovchi.",
    },
    {
      id: 212, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Never ___ I experienced such terrible customer service before.",
      options: ['have', 'did', 'was', 'had'],
      correct: 'have',
      explanation: "'Never' + have + subject + V³ (present perfect). 'Never have I experienced'.",
    },
    {
      id: 213, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "No sooner had the game started ___ it began to rain heavily.",
      options: ['than', 'when', 'then', 'that'],
      correct: 'than',
      explanation: "'No sooner ... than' — 'than' to'g'ri bog'lovchi. 'When' — Hardly bilan ishlatiladi.",
    },
    {
      id: 214, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Only after I read the instructions carefully ___ I understand the task fully.",
      options: ['did', 'was', 'have', 'had'],
      correct: 'did',
      explanation: "'Only after + clause + did + subject + V¹'. 'Did' — Past Simple yordamchi fe'li.",
    },
    {
      id: 215, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "Not only she speaks English, but she also speaks French fluently.",
      errorPart: 'she speaks',
      correct: "Not only does she speak English, but she also speaks French fluently.",
      explanation: "'Not only' dan keyin inversion kerak: 'Not only does she speak'. Oddiy so'z tartibi xato.",
    },
    {
      id: 216, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "Hardly had we left the house than it started to rain.",
      errorPart: 'than',
      correct: "Hardly had we left the house when it started to rain.",
      explanation: "'Hardly ... when' ishlatiladi, 'than' EMAS. 'No sooner ... than' dan farqli.",
    },
    {
      id: 217, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "Rarely we see such a wonderful performance in our local theatre.",
      errorPart: 'we see',
      correct: "Rarely do we see such a wonderful performance in our local theatre.",
      explanation: "'Rarely' + inversion: 'Rarely do we see'. 'Do' yordamchi fe'l kerak.",
    },
    {
      id: 218, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "Only after you will finish your homework can you watch TV.",
      errorPart: 'will finish',
      correct: "Only after you finish your homework can you watch TV.",
      explanation: "'Only after' dan keyin Present Simple (not 'will'): 'Only after you finish'. Inversion natija qismida.",
    },
    {
      id: 219, type: 'transformation',
      instruction: "Gapni 'Not only' bilan inversion shaklida yozing:",
      question: "She is talented and she is also very hardworking.",
      hint: "Not only is ...",
      correct: "Not only is she talented, but she is also very hardworking.",
      explanation: "'She is' → 'Not only is she'. Inversion: 'be' fe'li subjectdan oldin keladi.",
    },
    {
      id: 220, type: 'transformation',
      instruction: "Gapni 'No sooner' bilan inversion shaklida yozing:",
      question: "The moment I left the house, my phone rang.",
      hint: "No sooner had ...",
      correct: "No sooner had I left the house than my phone rang.",
      explanation: "'The moment' → 'No sooner had + subject + V³ ... than'. 'No sooner had I left ... than'.",
    },
  ],
}

// ─── Topic 18: Mixed Conditionals (B2) ──────────────────────────────────────────

export const mixedConditionals: GrammarTopic = {
  id: 'mixed-conditionals',
  title: 'Mixed Conditionals',
  subtitle: "O'tmishdagi shart — hozirgi natija va hozirgi shart — o'tmishdagi natija",
  level: 'B2',
  week: 8,
  tag: 'Conditionals',
  formula: 'Type 1: If + Past Perfect , would + V¹ · Type 2: If + Past Simple , would have + V³',
  formulaRows: [
    { label: "Type 1 (past shart → present natija)", structure: "If + Subject + had + V³ , Subject + would + V¹",          color: 'blue'   },
    { label: "Type 2 (present shart → past natija)",  structure: "If + Subject + V₂ , Subject + would have + V³",          color: 'purple' },
    { label: "Type 1 misol",                            structure: "If I had studied medicine, I would be a doctor now.",   color: 'green'  },
    { label: "Type 2 misol",                            structure: "If I were rich, I would have bought that house.",       color: 'orange' },
  ],
  usedFor: [
    "O'tmishdagi harakatning hozirgi natijasini ko'rsatish (Type 1)",
    "Hozirgi holatning o'tmishdagi natijasini ko'rsatish (Type 2)",
    "Haqiqatga zid vaziyatlarni murakkab vaqt kesimida ifodalash",
    "Afsus va pushaymonlikni hozirgi natija bilan bog'lab aytish",
  ],
  examples: [
    { en: "If I had studied medicine, I would be a doctor now.",                            uz: "Agar tibbiyotni o'qiganimda, hozir shifokor bo'lgan bo'lardim." },
    { en: "If she weren't afraid of flying, she would have visited Japan last year.",        uz: "Agar u uchishdan qo'rqmaganida, o'tgan yili Yaponiyaga borgan bo'lardi." },
    { en: "If he had taken the job offer, he would be living in London now.",               uz: "Agar u ish taklifini qabul qilganida, hozir Londonda yashagan bo'lardi." },
    { en: "If I were better at maths, I would have passed the exam yesterday.",             uz: "Agar matematikani yaxshiroq bilsam, kechagi imtihondan o'tgan bo'lardim." },
    { en: "If they hadn't missed the flight, they would be relaxing on a beach right now.", uz: "Agar ular reysni o'tkazib yubormaganlarida, hozir plyajda dam olishayotgan bo'lardi." },
  ],
  exercises: [
    {
      id: 221, type: 'fill-blank',
      instruction: "Mixed Conditional (Type 1) bilan to'ldiring:",
      question: "If I _____ (study) medicine, I _____ (be) a doctor now.",
      blanks: ['had studied', 'would be'],
      explanation: "Type 1: o'tmishdagi shart (had studied) + hozirgi natija (would be).",
    },
    {
      id: 222, type: 'fill-blank',
      instruction: "Mixed Conditional (Type 2) bilan to'ldiring:",
      question: "If I _____ (be) richer, I _____ (buy) that house last year.",
      blanks: ['were', 'would have bought'],
      explanation: "Type 2: hozirgi shart (were) + o'tmishdagi natija (would have bought).",
    },
    {
      id: 223, type: 'fill-blank',
      instruction: "Mixed Conditional bilan to'ldiring (Type 1):",
      question: "If she _____ (not / break) her leg, she _____ (play) in the match tomorrow.",
      blanks: ["hadn't broken", 'would play'],
      explanation: "O'tmishdagi shart (hadn't broken) + kelajak natija (would play). Type 1 mixed.",
    },
    {
      id: 224, type: 'fill-blank',
      instruction: "Mixed Conditional bilan to'ldiring (Type 2):",
      question: "If he _____ (speak) French, he _____ (get) the job in Paris last month.",
      blanks: ['spoke', 'would have got'],
      explanation: "Hozirgi shart (spoke) + o'tmishdagi natija (would have got). Type 2 mixed.",
    },
    {
      id: 225, type: 'fill-blank',
      instruction: "Mixed Conditional bilan to'ldiring:",
      question: "If they _____ (save) more money, they _____ (not / live) with their parents now.",
      blanks: ['had saved', "wouldn't be living"],
      explanation: "O'tmishda saqlagan bo'lsa → hozir ota-onasi bilan yashamas edi: had saved + wouldn't be living.",
    },
    {
      id: 226, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "If I ___ the truth earlier, I wouldn't be in this mess now.",
      options: ['had known', 'knew', 'have known', 'would know'],
      correct: 'had known',
      explanation: "Type 1: o'tmishdagi shart → 'had known'. Natija hozirga ta'sir qiladi (wouldn't be now).",
    },
    {
      id: 227, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "She would have come to the party if she ___ so shy.",
      options: ["weren't", "hadn't been", "isn't", "wouldn't be"],
      correct: "weren't",
      explanation: "Type 2: hozirgi shart (weren't shy) → o'tmishdagi natija (would have come).",
    },
    {
      id: 228, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "If he had trained harder, he ___ for the national team now.",
      options: ['would play', 'would have played', 'played', 'will play'],
      correct: 'would play',
      explanation: "Type 1: o'tmishda trenirovka qilgan bo'lsa → hozir terma jamoada o'ynagan bo'lardi.",
    },
    {
      id: 229, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "If I were more organized, I ___ my passport two days ago.",
      options: ["wouldn't have lost", "wouldn't lose", "didn't lose", "won't lose"],
      correct: "wouldn't have lost",
      explanation: "Type 2: hozirgi shart (were organized) → o'tmishdagi natija (wouldn't have lost).",
    },
    {
      id: 230, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Which is a Type 2 Mixed Conditional?",
      options: [
        "If I had studied, I would be a doctor now.",
        "If I studied, I would be a doctor.",
        "If I were you, I would have accepted the offer.",
        "If I had known, I would have called.",
      ],
      correct: "If I were you, I would have accepted the offer.",
      explanation: "Type 2: present shart (were) + past natija (would have accepted). Boshqa variantlar boshqa conditional turlari.",
    },
    {
      id: 231, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang (Type 1):",
      question: "If I would have studied harder, I would be a university student now.",
      errorPart: 'would have studied',
      correct: "If I had studied harder, I would be a university student now.",
      explanation: "Type 1 if qismida 'had + V³' kerak: 'had studied'. 'Would have' if qismida ishlatilmaydi.",
    },
    {
      id: 232, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang (Type 2):",
      question: "If I am taller, I would have become a basketball player.",
      errorPart: 'am',
      correct: "If I were taller, I would have become a basketball player.",
      explanation: "Type 2 if qismida Past Simple (were) kerak: 'If I were taller'. 'Am' — real present, bu yerda xato.",
    },
    {
      id: 233, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "If she hadn't missed the bus, she will be here now.",
      errorPart: 'will be',
      correct: "If she hadn't missed the bus, she would be here now.",
      explanation: "Type 1 natija qismida 'would + V¹' kerak: 'would be'. 'Will' — real kelajak, bu yerda xato.",
    },
    {
      id: 234, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "If I knew how to cook, I would have cooked dinner last night.",
      errorPart: 'knew',
      correct: "If I had known how to cook, I would have cooked dinner last night.",
      explanation: "Bu Type 1 emas — o'tmishdagi natija bilan to'liq o'tmish. 'If + had known' kerak edi. Agar 'knew' (present shart) bo'lsa, Type 2 bo'ladi va natija 'would have cooked' bilan to'g'ri. Kechirasiz — bu gap Type 2 bo'lishi mumkin: hozir bilmayman (knew) → kecha pishirgan bo'lardim. Gap to'g'ri, faqat izoh: 'knew' Type 2 if qismi uchun to'g'ri.",
    },
    {
      id: 235, type: 'transformation',
      instruction: "Type 1 Mixed Conditional bilan yozing:",
      question: "I didn't learn to drive, so I can't drive now.",
      hint: "If I had ...",
      correct: "If I had learned to drive, I would be able to drive now.",
      explanation: "O'tmishdagi shart (didn't learn → had learned) + hozirgi natija (can't → would be able).",
    },
    {
      id: 236, type: 'transformation',
      instruction: "Type 2 Mixed Conditional bilan yozing:",
      question: "I don't know her phone number, so I didn't call her yesterday.",
      hint: "If I knew ...",
      correct: "If I knew her phone number, I would have called her yesterday.",
      explanation: "Hozirgi shart (don't know → knew) + o'tmishdagi natija (didn't call → would have called).",
    },
  ],
}

// ─── Topic 19: Advanced Passive (B2) ────────────────────────────────────────────

export const advancedPassive: GrammarTopic = {
  id: 'advanced-passive',
  title: 'Advanced Passive',
  subtitle: "Passive infinitive, passive gerund, causative va reporting verbs",
  level: 'B2',
  week: 9,
  tag: 'Grammar',
  formula: 'be believed/thought/said to + V¹ · being + V³ · have/get + object + V³ · be said to + V¹',
  formulaRows: [
    { label: 'Passive infinitive',     structure: 'Subject + be + believed / thought / said + to + V¹ / to have + V³', color: 'blue'   },
    { label: 'Passive gerund',         structure: 'Subject + (dis)like / enjoy / avoid + being + V³',                   color: 'purple' },
    { label: "Causative (have / get)", structure: "Subject + have / get + object + V³ (by + agent?)",                 color: 'green'  },
    { label: "Reporting verbs",        structure: "It + be + said / believed / thought + that + clause · Subject + be + said / believed + to + V¹", color: 'orange' },
  ],
  usedFor: [
    "Passive infinitive: ishonch va fikrlarni noaniq shaklda ifodalash",
    "Passive gerund: passiv harakatlardan zavqlanish yoki ularni oldini olish",
    "Causative: birovga biror ishni qildirish (have/get something done)",
    "Reporting verbs: xabar va ishonchlarni egasiz shaklda yetkazish",
  ],
  examples: [
    { en: "He is believed to be one of the best doctors in the country.",              uz: "U mamlakatdagi eng yaxshi shifokorlardan biri deb ishoniladi." },
    { en: "She dislikes being told what to do by her colleagues.",                     uz: "U hamkasblari tomonidan nima qilish kerakligini aytilishini yoqtirmaydi." },
    { en: "I need to have my hair cut before the wedding ceremony.",                   uz: "To'y marosimidan oldin sochimni oldirishim kerak." },
    { en: "She got her phone repaired at the local shop yesterday.",                   uz: "U kecha mahalliy do'konda telefonini ta'mirlatdi." },
    { en: "It is said that the president will visit our city next month.",             uz: "Prezident keyingi oy shahrimizga tashrif buyurishi aytilmoqda." },
  ],
  exercises: [
    {
      id: 237, type: 'fill-blank',
      instruction: "Passive infinitive bilan to'ldiring (be believed to):",
      question: "He _____ (believe) to be one of the wealthiest businessmen in the region.",
      blanks: ['is believed'],
      explanation: "'Be believed to' — passive infinitive: 'He is believed to be one of...'",
    },
    {
      id: 238, type: 'fill-blank',
      instruction: "Passive infinitive bilan to'ldiring (be said to have):",
      question: "The ancient city _____ (say) to have been built over 2000 years ago.",
      blanks: ['is said'],
      explanation: "'Be said to have been built' — 'It is said that' → passive infinitive shakli.",
    },
    {
      id: 239, type: 'fill-blank',
      instruction: "Passive gerund bilan to'ldiring:",
      question: "I really dislike _____ (tell) what to do by other people.",
      blanks: ['being told'],
      explanation: "'Dislike + being + V³'. 'Being told' — passiv gerund: aytilishini yoqtirmayman.",
    },
    {
      id: 240, type: 'fill-blank',
      instruction: "Causative (have something done) bilan to'ldiring:",
      question: "I need _____ (have / my car / service) before the long trip.",
      blanks: ['to have my car serviced'],
      explanation: "'Have + object + V³' — 'have my car serviced'. Servis qildirmoq.",
    },
    {
      id: 241, type: 'fill-blank',
      instruction: "Causative (get something done) bilan to'ldiring:",
      question: "She _____ (get / her portrait / paint) by a famous artist next month.",
      blanks: ['is getting her portrait painted'],
      explanation: "'Get + object + V³' — 'is getting her portrait painted'. Paint qildirmoq.",
    },
    {
      id: 242, type: 'fill-blank',
      instruction: "Reporting verb bilan to'ldiring (be thought to):",
      question: "The missing painting _____ (think) to have been stolen by an insider.",
      blanks: ['is thought'],
      explanation: "'Be thought to have been stolen' — 'is thought' + passive infinitive.",
    },
    {
      id: 243, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "The new bridge ___ to be completed by the end of the year.",
      options: ['is said', 'said', 'is saying', 'has said'],
      correct: 'is said',
      explanation: "'Be said to' — 'is said to be completed'. Reporting verb passive shaklida.",
    },
    {
      id: 244, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "She enjoys ___ compliments from her students after each lesson.",
      options: ['being paid', 'paying', 'to pay', 'having paid'],
      correct: 'being paid',
      explanation: "'Enjoy + being + V³' — 'enjoys being paid'. Passiv gerund: maqtovlar aytilishi.",
    },
    {
      id: 245, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "I need to have my laptop ___ as soon as possible.",
      options: ['repaired', 'repair', 'repairing', 'to repair'],
      correct: 'repaired',
      explanation: "'Have + object + V³' — 'have my laptop repaired'. Ta'mirlatish uchun V³ kerak.",
    },
    {
      id: 246, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "She got her nails ___ at the beauty salon downtown.",
      options: ['done', 'do', 'doing', 'to do'],
      correct: 'done',
      explanation: "'Get + object + V³' — 'got her nails done'. Tirnoqlarini oldirdi / yasatdi.",
    },
    {
      id: 247, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "It ___ that the company is planning to expand abroad.",
      options: ['is believed', 'believes', 'is believing', 'believed'],
      correct: 'is believed',
      explanation: "'It is believed that' — reporting verb passive impersonal construction.",
    },
    {
      id: 248, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang (passive infinitive):",
      question: "She is believed be the best candidate for the position.",
      errorPart: 'believed be',
      correct: "She is believed to be the best candidate for the position.",
      explanation: "Passive infinitive: 'be believed to + V¹'. 'To' infinitive qismi kerak: 'believed to be'.",
    },
    {
      id: 249, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang (passive gerund):",
      question: "He can't stand tell what to do by his manager all the time.",
      errorPart: 'tell',
      correct: "He can't stand being told what to do by his manager all the time.",
      explanation: "'Can't stand + being + V³'. 'Being told' — passiv gerund: aytilishiga chiday olmaydi.",
    },
    {
      id: 250, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang (causative):",
      question: "I need to have my hair cutted before the party tonight.",
      errorPart: 'cutted',
      correct: "I need to have my hair cut before the party tonight.",
      explanation: "'Cut' V³ shakli 'cut' (not 'cutted'). 'Have + object + V³' — 'have my hair cut'.",
    },
    {
      id: 251, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang (reporting verb):",
      question: "The suspect is believed to escaped from the country last night.",
      errorPart: 'escaped',
      correct: "The suspect is believed to have escaped from the country last night.",
      explanation: "O'tmishdagi harakat uchun 'to have + V³': 'to have escaped'. 'Escaped' xato — to infinitive kerak.",
    },
    {
      id: 252, type: 'transformation',
      instruction: "Passive infinitive bilan qayta yozing:",
      question: "People believe that the man is a talented musician.",
      hint: "The man is ...",
      correct: "The man is believed to be a talented musician.",
      explanation: "Active: 'People believe that...' → Passive: 'The man is believed to be...'",
    },
  ],
}

// ─── Topic 20: Cleft Sentences (B2) ─────────────────────────────────────────────

export const cleftSentences: GrammarTopic = {
  id: 'cleft-sentences',
  title: 'Cleft Sentences',
  subtitle: "It is/was ... who/that, What ... is/was — gap bo'laklarini ta'kidlash",
  level: 'B2',
  week: 9,
  tag: 'Grammar',
  formula: 'It + be + noun/pronoun + who/that + clause · What + clause + be + noun · All + be + noun',
  formulaRows: [
    { label: "It-cleft (odamni ta'kidlash)",  structure: "It + is/was + noun/pronoun + who/that + clause",        color: 'blue'   },
    { label: "It-cleft (narsani ta'kidlash)", structure: "It + is/was + noun + that + clause",                    color: 'purple' },
    { label: "What-cleft (harakatni ta'kidlash)", structure: "What + subject + verb + is/was + (to) + V¹ / noun",  color: 'green'  },
    { label: "All / The thing / The reason",     structure: "All + (that) + clause + is/was + noun · The reason why + clause + is/was + noun", color: 'orange' },
  ],
  usedFor: [
    "Gapning biror bo'lagiga urg'u berish — aynan kim, nima, qachon",
    "It-cleft: odam yoki narsani ajratib ko'rsatish",
    "What-cleft: biror harakatni ta'kidlash",
    "All / The thing / The reason: umumiy fikrni soddaroq ifodalash",
  ],
  examples: [
    { en: "It was John who fixed my car yesterday.",                               uz: "Aynan Jon kecha mashinamni tuzatdi." },
    { en: "It is English that I want to learn fluently.",                          uz: "Aynan ingliz tilini men ravon o'rganmoqchiman." },
    { en: "What I need right now is a good cup of coffee.",                         uz: "Menga hozir kerak bo'lgan narsa — yaxshi bir chashka qahva." },
    { en: "The reason why I called you is to invite you to my birthday party.",    uz: "Sizga qo'ng'iroq qilishimning sababi — tug'ilgan kunimga taklif qilish." },
    { en: "All I want for my birthday is to spend time with my closest friends.",  uz: "Tug'ilgan kunimda istagan narsam — eng yaqin do'stlarim bilan vaqt o'tkazish." },
  ],
  exercises: [
    {
      id: 253, type: 'fill-blank',
      instruction: "It-cleft (odam) bilan to'ldiring:",
      question: "It _____ my brother who helped me move to the new apartment.",
      blanks: ['was'],
      explanation: "'It was + noun + who' — 'It was my brother who helped'. O'tmish → 'was'.",
    },
    {
      id: 254, type: 'fill-blank',
      instruction: "It-cleft (narsa) bilan to'ldiring:",
      question: "It is mathematics _____ I find the most difficult subject at school.",
      blanks: ['that'],
      explanation: "'It is + noun + that' — narsalar uchun 'that' ishlatiladi: 'mathematics that'.",
    },
    {
      id: 255, type: 'fill-blank',
      instruction: "What-cleft bilan to'ldiring:",
      question: "What I _____ (want) right now is a long and relaxing vacation.",
      blanks: ['want'],
      explanation: "'What + subject + V¹ + is' — 'What I want is...'. Hozirgi zamon → 'want'.",
    },
    {
      id: 256, type: 'fill-blank',
      instruction: "All-cleft bilan to'ldiring:",
      question: "All I _____ (ask) for is a little bit of understanding from your side.",
      blanks: ['ask'],
      explanation: "'All + subject + V¹ + is' — 'All I ask is...'. 'Ask' — Present Simple.",
    },
    {
      id: 257, type: 'fill-blank',
      instruction: "The reason-cleft bilan to'ldiring:",
      question: "The reason _____ I am late is that there was a huge traffic jam on the way.",
      blanks: ['why'],
      explanation: "'The reason why + clause + is' — sababni ta'kidlash uchun 'why' ishlatiladi.",
    },
    {
      id: 258, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "It ___ my mother who taught me how to cook traditional dishes.",
      options: ['was', 'is', 'were', 'has been'],
      correct: 'was',
      explanation: "O'tmishdagi harakat → 'It was my mother who taught'. 'Was' to'g'ri.",
    },
    {
      id: 259, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "What I really enjoy ___ reading books in my free time.",
      options: ['is', 'are', 'was', 'were'],
      correct: 'is',
      explanation: "'What + clause + is' — 'What I enjoy is reading'. 'Is' doim yakka shaklda.",
    },
    {
      id: 260, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "It was in 2021 ___ I first started learning English seriously.",
      options: ['that', 'when', 'which', 'where'],
      correct: 'that',
      explanation: "It-cleftda vaqt bo'lsa ham 'that' ishlatiladi: 'It was in 2021 that I started'.",
    },
    {
      id: 261, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "All I want for the holidays ___ to relax and spend time with my family.",
      options: ['is', 'are', 'was', 'were'],
      correct: 'is',
      explanation: "'All + clause + is' — 'All I want is to relax'. 'All' bilan 'is' ishlatiladi.",
    },
    {
      id: 262, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Which sentence is a correct cleft sentence?",
      options: [
        "It was yesterday that I met her.",
        "It was yesterday when I met her.",
        "It was yesterday which I met her.",
        "It was yesterday where I met her.",
      ],
      correct: "It was yesterday that I met her.",
      explanation: "It-cleftda vaqt, joy, odam, narsa → hammasi 'that' bilan bog'lanadi.",
    },
    {
      id: 263, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "It was my sister who she helped me with my homework last night.",
      errorPart: 'she helped',
      correct: "It was my sister who helped me with my homework last night.",
      explanation: "Cleft sentences da 'who' + V¹: subject takrorlanmaydi. 'Who she helped' xato — 'who helped' to'g'ri.",
    },
    {
      id: 264, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "What I need are a reliable car for my daily commute.",
      errorPart: 'are',
      correct: "What I need is a reliable car for my daily commute.",
      explanation: "'What + clause + is' — doim 'is' ishlatiladi, keyingi ot ko'plik bo'lsa ham.",
    },
    {
      id: 265, type: 'transformation',
      instruction: "Cleft sentence (It-cleft) bilan qayta yozing:",
      question: "My father built this house in 1995.",
      hint: "It was my father ...",
      correct: "It was my father who built this house in 1995.",
      explanation: "Aynan otam → 'It was my father who built'. Odamni ta'kidlash: 'who'.",
    },
    {
      id: 266, type: 'transformation',
      instruction: "What-cleft bilan qayta yozing:",
      question: "I want to learn English more than anything else.",
      hint: "What I want ...",
      correct: "What I want is to learn English more than anything else.",
      explanation: "'What I want is to learn' — harakatni ta'kidlash: 'What + clause + is + to V¹'.",
    },
  ],
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const advancedRelativeClauses: GrammarTopic = {
  "id": "relative-clauses-b2",
  "title": "Advanced Relative Clauses",
  "subtitle": "Non-defining, preposition + relative, reduced relative clauses, compounds",
  "level": "B2",
  "week": 8,
  "tag": "Grammar",
  "formula": "Non-defining: , + who/which/whose + , · Reduced: V+ing / V³ replacing clause · Preposition + whom/which",
  "formulaRows": [
    {
      "label": "Non-defining (extra info)",
      "structure": "Noun , + who/which/whose + clause , + verb",
      "color": "blue"
    },
    {
      "label": "Preposition + relative",
      "structure": "preposition + whom (people) / which (things)",
      "color": "purple"
    },
    {
      "label": "Reduced relative (active)",
      "structure": "Noun + V+ing (The man sitting there = who is sitting)",
      "color": "green"
    },
    {
      "label": "Reduced relative (passive)",
      "structure": "Noun + V³ (The book written by him = which was written)",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Non-defining: qo'shimcha (keraksiz) ma'lumot — vergul bilan ajratiladi",
    "Preposition + relative: rasmiy uslubda (to whom, with which, in which)",
    "Reduced relative: qisqa va zamonaviy uslub",
    "'Which' bilan butun gapga ishora qilish"
  ],
  "examples": [
    {
      "en": "My mother, who is a doctor, works at the central hospital.",
      "uz": "Mening onam, u shifokor, markaziy shifoxonada ishlaydi."
    },
    {
      "en": "The man to whom I spoke was very helpful.",
      "uz": "Men gaplashgan odam juda yordamchi edi."
    },
    {
      "en": "The woman sitting next to me was reading a book.",
      "uz": "Yonimda o'tirgan ayol kitob o'qiyotgan edi."
    },
    {
      "en": "The book written by the famous author became a bestseller.",
      "uz": "Mashhur muallif tomonidan yozilgan kitob bestsellerga aylandi."
    },
    {
      "en": "He passed the exam, which surprised everyone.",
      "uz": "U imtihondan o'tdi, bu hammasini hayron qoldirdi."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Non-defining relative clause bilan to'ldiring:",
      "question": "My brother, _____ lives in London, is a software engineer.",
      "blanks": [
        "who"
      ],
      "explanation": "Non-defining: odam → 'who'. Vergul bilan ajratilgan → qo'shimcha ma'lumot.",
      "id": 357
    },
    {
      "type": "fill-blank",
      "instruction": "Non-defining bilan to'ldiring:",
      "question": "The Eiffel Tower, _____ was built in 1889, is a famous landmark.",
      "blanks": [
        "which"
      ],
      "explanation": "Narsa → 'which'. Non-defining: vergul bilan ajratilgan.",
      "id": 358
    },
    {
      "type": "fill-blank",
      "instruction": "Preposition + relative bilan to'ldiring:",
      "question": "The person _____ whom I spoke was very polite.",
      "blanks": [
        "to"
      ],
      "explanation": "Rasmiy: 'to whom'. 'The person to whom I spoke'.",
      "id": 359
    },
    {
      "type": "fill-blank",
      "instruction": "Reduced relative (active) bilan to'ldiring:",
      "question": "The man _____ (sit) next to me was reading a newspaper.",
      "blanks": [
        "sitting"
      ],
      "explanation": "Reduced: 'who was sitting' → 'sitting'. Active → V+ing.",
      "id": 360
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The documents, ___ were on the table, have disappeared.",
      "options": [
        "which",
        "that",
        "what",
        "who"
      ],
      "correct": "which",
      "explanation": "Non-defining → 'which' (vergul bilan). 'That' non-defining da ishlatilmaydi.",
      "id": 361
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The professor ___ I was talking to is very well-known.",
      "options": [
        "whom",
        "who",
        "which",
        "whose"
      ],
      "correct": "whom",
      "explanation": "Object relative → 'whom' (rasmiy) yoki 'who' (norasmiy). 'To whom' — rasmiy.",
      "id": 362
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The house ___ at the end of the street belongs to my uncle.",
      "options": [
        "located",
        "which located",
        "that located",
        "locating"
      ],
      "correct": "located",
      "explanation": "Reduced relative (passive): 'which is located' → 'located'.",
      "id": 363
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "He refused to help, ___ was very disappointing.",
      "options": [
        "which",
        "that",
        "what",
        "who"
      ],
      "correct": "which",
      "explanation": "'Which' butun oldingi gapga ishora qiladi: 'He refused, which was disappointing'.",
      "id": 364
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "My mother, that is a doctor, works hard.",
      "errorPart": "that",
      "correct": "My mother, who is a doctor, works hard.",
      "explanation": "Non-defining da odamlar uchun 'who', 'that' emas. 'That' faqat defining uchun.",
      "id": 365
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "The man to who I spoke was the manager.",
      "errorPart": "to who",
      "correct": "The man to whom I spoke was the manager.",
      "explanation": "Prepositiondan keyin 'whom' ishlatiladi: 'to whom'. 'To who' xato.",
      "id": 366
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "The book writing by the author became famous.",
      "errorPart": "writing",
      "correct": "The book written by the author became famous.",
      "explanation": "Passive reduced → V³: 'written by'. 'Writing' — active, bu yerda noto'g'ri.",
      "id": 367
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "The students waiting for the bus started to rain.",
      "errorPart": "waiting for the bus started",
      "correct": "The students who were waiting for the bus started to run when it rained.",
      "explanation": "Noaniqlik: 'waiting' nimaga tegishli ekani aniq emas. To'liq relative clause kerak.",
      "id": 368
    },
    {
      "type": "transformation",
      "instruction": "Non-defining relative clause bilan qayta yozing:",
      "question": "My father is a teacher. He works at a local school.",
      "hint": "My father, who ...",
      "correct": "My father, who is a teacher, works at a local school.",
      "explanation": "Ikki gapni birlashtirish: 'My father, who is a teacher, works...'.",
      "id": 369
    },
    {
      "type": "transformation",
      "instruction": "Reduced relative (passive) bilan qayta yozing:",
      "question": "The painting which was stolen from the museum was recovered.",
      "hint": "The painting stolen ...",
      "correct": "The painting stolen from the museum was recovered.",
      "explanation": "'Which was stolen' → 'stolen'. Passive reduced: V³.",
      "id": 370
    },
    {
      "type": "transformation",
      "instruction": "Preposition + whom bilan qayta yozing:",
      "question": "The person who I was talking about is here.",
      "hint": "The person about whom ...",
      "correct": "The person about whom I was talking is here.",
      "explanation": "Rasmiy: preposition + whom. 'About whom I was talking'.",
      "id": 371
    }
  ]
}

export const advancedReportedSpeech: GrammarTopic = {
  "id": "reported-speech-b2",
  "title": "Advanced Reported Speech",
  "subtitle": "Reporting verbs, tense variation, modal changes, time/place changes",
  "level": "B2",
  "week": 9,
  "tag": "Grammar",
  "formula": "Reporting verb + that-clause · Verb + to-infinitive · Verb + object + to-infinitive · Verb + V+ing",
  "formulaRows": [
    {
      "label": "Say / Tell + that",
      "structure": "say (that) · tell + object + (that)  (He told me that he was tired)",
      "color": "blue"
    },
    {
      "label": "Verb + to-infinitive",
      "structure": "agree / promise / refuse / offer + to + V¹",
      "color": "purple"
    },
    {
      "label": "Verb + object + to-infinitive",
      "structure": "advise / ask / tell / warn + object + to + V¹",
      "color": "green"
    },
    {
      "label": "Verb + V+ing",
      "structure": "suggest / admit / deny + V+ing",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Reporting verbs bilan turli ma'nolarni ifodalash (suggest, advise, promise, deny)",
    "No tense change: hali ham to'g'ri bo'lgan ma'lumotlar (The Earth is round)",
    "Modal fe'llarni reported speech da o'zgartirish: will→would, can→could, may→might",
    "Vaqt va joy o'zgarishlari: now→then, here→there, today→that day"
  ],
  "examples": [
    {
      "en": "He advised me to apply for the scholarship.",
      "uz": "U menga stipendiyaga ariza berishni maslahat berdi."
    },
    {
      "en": "She suggested going to the new restaurant.",
      "uz": "U yangi restoranga borishni taklif qildi."
    },
    {
      "en": "They promised to help us with the project.",
      "uz": "Ular loyihada yordam berishga va'da berishdi."
    },
    {
      "en": "The teacher said that practice makes perfect. (general truth)",
      "uz": "O'qituvchi mashq qilish mukammal qilishini aytdi."
    },
    {
      "en": "He denied stealing the money from the safe.",
      "uz": "U seyfdan pulni o'g'irlaganini inkor qildi."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Reporting verb bilan to'ldiring:",
      "question": "She _____ (advise) me to take the job offer.",
      "blanks": [
        "advised"
      ],
      "explanation": "'Advise + object + to + V¹'. 'Advised me to take'.",
      "id": 372
    },
    {
      "type": "fill-blank",
      "instruction": "Reporting verb + V+ing bilan to'ldiring:",
      "question": "He _____ (suggest) going to the cinema tonight.",
      "blanks": [
        "suggested"
      ],
      "explanation": "'Suggest + V+ing'. 'Suggested going'.",
      "id": 373
    },
    {
      "type": "fill-blank",
      "instruction": "Reporting verb + to-infinitive bilan to'ldiring:",
      "question": "They _____ (promise) to help us with the move.",
      "blanks": [
        "promised"
      ],
      "explanation": "'Promise + to + V¹'. 'Promised to help'.",
      "id": 374
    },
    {
      "type": "fill-blank",
      "instruction": "No tense change (general truth) bilan to'ldiring:",
      "question": "The teacher said that Water _____ (boil) at 100°C.",
      "blanks": [
        "boils"
      ],
      "explanation": "Umumiy haqiqat → tense o'zgarmaydi. 'Boils' (Present Simple qoladi).",
      "id": 375
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "She ___ to call me as soon as she arrived.",
      "options": [
        "promised",
        "suggested",
        "denied",
        "advised"
      ],
      "correct": "promised",
      "explanation": "'Promise + to + V¹'. 'Promised to call'. 'Suggested' — V+ing oladi.",
      "id": 376
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "He ___ taking the money from the drawer.",
      "options": [
        "denied",
        "promised",
        "advised",
        "offered"
      ],
      "correct": "denied",
      "explanation": "'Deny + V+ing'. 'Denied taking' = olishni inkor qildi.",
      "id": 377
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "She ___ me not to go out alone at night.",
      "options": [
        "warned",
        "suggested",
        "promised",
        "offered"
      ],
      "correct": "warned",
      "explanation": "'Warn + object + not to + V¹'. 'Warned me not to go'.",
      "id": 378
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "They ___ that they would finish the project on time.",
      "options": [
        "said",
        "told",
        "advised",
        "suggested"
      ],
      "correct": "said",
      "explanation": "'Say (that)' — objectsiz. 'Tell' object talab qiladi: 'told me/us/them'.",
      "id": 379
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He suggested me to go to the doctor.",
      "errorPart": "suggested me to go",
      "correct": "He suggested going to the doctor. / He suggested that I go to the doctor.",
      "explanation": "'Suggest' object + to-infinitive olmaydi. 'Suggest + V+ing' yoki 'suggest that + clause'.",
      "id": 380
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She said me that she would be late.",
      "errorPart": "said me",
      "correct": "She told me that she would be late.",
      "explanation": "'Say' object talab qilmaydi: 'She said (that)...' 'Tell' object talab qiladi: 'She told me'.",
      "id": 381
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He promised helping us with the project.",
      "errorPart": "promised helping",
      "correct": "He promised to help us with the project.",
      "explanation": "'Promise + to + V¹': 'promised to help'. 'Promise + V+ing' xato.",
      "id": 382
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She said that she will come to the party.",
      "errorPart": "will come",
      "correct": "She said that she would come to the party.",
      "explanation": "Tense backshift: 'will' → 'would'. 'Will come' → 'would come'.",
      "id": 383
    },
    {
      "type": "transformation",
      "instruction": "Direct gapni reported speech ga o'tkazing:",
      "question": "\"I will help you,\" he said.",
      "hint": "He said that ...",
      "correct": "He said that he would help me.",
      "explanation": "'I will help you' → 'he would help me'. 'Will' → 'would', 'you' → 'me'.",
      "id": 384
    },
    {
      "type": "transformation",
      "instruction": "'Suggest' bilan qayta yozing:",
      "question": "\"Why don't we go to the park?\" she said.",
      "hint": "She suggested ...",
      "correct": "She suggested going to the park.",
      "explanation": "'Why don't we' → 'suggested + V+ing'. 'Suggested going to the park'.",
      "id": 385
    },
    {
      "type": "transformation",
      "instruction": "'Advise' bilan qayta yozing:",
      "question": "\"You should see a doctor,\" she told me.",
      "hint": "She advised me ...",
      "correct": "She advised me to see a doctor.",
      "explanation": "'You should' → 'advised me to + V¹'. 'Advised me to see'.",
      "id": 386
    }
  ]
}

export const advancedWishIfOnly: GrammarTopic = {
  "id": "wish-if-only-b2",
  "title": "Advanced Wish & If Only",
  "subtitle": "Would rather, It's time, As if/as though — xayoliy vaziyatlar",
  "level": "B2",
  "week": 9,
  "tag": "Grammar",
  "formula": "would rather + V¹ / had + V³ · It's (high) time + V₂ · as if / as though + V₂ / had + V³",
  "formulaRows": [
    {
      "label": "Would rather (present)",
      "structure": "Subject + would rather + V¹  (I'd rather stay home)",
      "color": "blue"
    },
    {
      "label": "Would rather (past)",
      "structure": "Subject + would rather + have + V³  (I'd rather have gone)",
      "color": "purple"
    },
    {
      "label": "It's (high) time",
      "structure": "It's (high) time + subject + V₂  (It's time you started)",
      "color": "green"
    },
    {
      "label": "As if / as though",
      "structure": "Subject + verb + as if/though + V₂ / had + V³  (He acts as if he were the boss)",
      "color": "orange"
    }
  ],
  "usedFor": [
    "'Would rather': afzal ko'rish (I'd rather study than go out)",
    "'Would rather + have + V³': o'tmishdagi afsus (I'd rather have taken the job)",
    "'It's (high) time': biror ishni qilish vaqti keldi (It's time you went to bed)",
    "'As if / as though': xayoliy taqqoslash (He looks as if he had seen a ghost)"
  ],
  "examples": [
    {
      "en": "I would rather stay at home than go to the party.",
      "uz": "Men ziyofatga borishdan ko'ra uyda qolishni afzal ko'raman."
    },
    {
      "en": "She would rather have studied medicine.",
      "uz": "U tibbiyotni o'qigan bo'lishini afzal ko'rar edi."
    },
    {
      "en": "It's high time you started studying for the exam.",
      "uz": "Imtihonga tayyorlanishni boshlashingiz vaqti keldi."
    },
    {
      "en": "He looks as if he had seen a ghost!",
      "uz": "U xuddi arvoh ko'rgandek ko'rinadi!"
    },
    {
      "en": "I'd rather you didn't smoke in here.",
      "uz": "Bu yerda chekmasligingizni afzal ko'raman."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "'Would rather' bilan to'ldiring:",
      "question": "I _____ (rather / stay) at home than go out tonight.",
      "blanks": [
        "'d rather stay"
      ],
      "explanation": "'Would rather + V¹': 'I'd rather stay'.",
      "id": 387
    },
    {
      "type": "fill-blank",
      "instruction": "'Would rather + have' bilan to'ldiring:",
      "question": "She _____ (rather / study) medicine instead of law.",
      "blanks": [
        "'d rather have studied"
      ],
      "explanation": "O'tmishdagi afsus: 'would rather have + V³'. 'Would rather have studied'.",
      "id": 388
    },
    {
      "type": "fill-blank",
      "instruction": "'It's time' bilan to'ldiring:",
      "question": "It's high time you _____ (start) preparing for the exam.",
      "blanks": [
        "started"
      ],
      "explanation": "'It's (high) time + V₂': 'It's time you started'. Past Simple ishlatiladi.",
      "id": 389
    },
    {
      "type": "fill-blank",
      "instruction": "'As if' bilan to'ldiring:",
      "question": "He looks as if he _____ (see) a ghost!",
      "blanks": [
        "had seen"
      ],
      "explanation": "O'tmishdagi xayoliy vaziyat: 'as if + had + V³'. 'As if he had seen'.",
      "id": 390
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "I would rather ___ at home today. I am tired.",
      "options": [
        "stay",
        "to stay",
        "staying",
        "stayed"
      ],
      "correct": "stay",
      "explanation": "'Would rather + V¹': 'would rather stay'. 'To stay' xato.",
      "id": 391
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "She would rather not ___ out last night.",
      "options": [
        "have gone",
        "go",
        "went",
        "going"
      ],
      "correct": "have gone",
      "explanation": "O'tmish: 'would rather + have + V³'. 'Would rather have gone'.",
      "id": 392
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "It's high time you ___ a decision about your future.",
      "options": [
        "made",
        "make",
        "will make",
        "would make"
      ],
      "correct": "made",
      "explanation": "'It's high time + V₂': 'made'. Present emas, Past Simple.",
      "id": 393
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "He talks as if he ___ everything about the subject.",
      "options": [
        "knew",
        "knows",
        "will know",
        "has known"
      ],
      "correct": "knew",
      "explanation": "'As if + V₂': 'as if he knew'. Hozirgi xayoliy vaziyat.",
      "id": 394
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I'd rather to stay home than go to the cinema.",
      "errorPart": "to stay",
      "correct": "I'd rather stay home than go to the cinema.",
      "explanation": "'Would rather + V¹': 'stay'. 'To stay' xato.",
      "id": 395
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "It's time we go home. It's getting late.",
      "errorPart": "go",
      "correct": "It's time we went home. It's getting late.",
      "explanation": "'It's time + V₂': 'went'. 'Go' — Present Simple, xato.",
      "id": 396
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He treats me as if I am his personal assistant.",
      "errorPart": "am",
      "correct": "He treats me as if I were his personal assistant.",
      "explanation": "'As if' dan keyin 'were' (barcha shaxslar uchun): 'as if I were'. 'Am' — real, xato.",
      "id": 397
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I would rather you don't smoke in the house.",
      "errorPart": "don't smoke",
      "correct": "I would rather you didn't smoke in the house.",
      "explanation": "'Would rather + object + V₂': 'you didn't smoke'. 'Don't' — Present, xato.",
      "id": 398
    },
    {
      "type": "transformation",
      "instruction": "'Would rather' bilan qayta yozing:",
      "question": "I prefer studying at home to studying at the library.",
      "hint": "I'd rather ...",
      "correct": "I'd rather study at home than at the library.",
      "explanation": "'Prefer X to Y' → 'would rather V¹ than V¹'. 'Study'.",
      "id": 399
    },
    {
      "type": "transformation",
      "instruction": "'It's time' bilan qayta yozing:",
      "question": "You should start looking for a job soon.",
      "hint": "It's time you ...",
      "correct": "It's time you started looking for a job.",
      "explanation": "'Should start' → 'It's time + V₂': 'started looking'.",
      "id": 400
    },
    {
      "type": "transformation",
      "instruction": "'As if' bilan qayta yozing:",
      "question": "She is very confident. She seems like she is the manager.",
      "hint": "She acts as if ...",
      "correct": "She acts as if she were the manager.",
      "explanation": "'Seems like she is' → 'acts as if she were'. 'Were' — barcha shaxslar uchun.",
      "id": 401
    }
  ]
}

export const phrasalVerbs: GrammarTopic = {
  "id": "phrasal-verbs-b2",
  "title": "Phrasal Verbs",
  "subtitle": "Separable vs inseparable — zarrachali fe'llar",
  "level": "B2",
  "week": 10,
  "tag": "Vocabulary",
  "formula": "Verb + particle (separ: object between) · Verb + particle (insep: object after) · Three-word phrasal verbs",
  "formulaRows": [
    {
      "label": "Separable (ajraladigan)",
      "structure": "Verb + object + particle / Verb + particle + noun  (turn the light off / turn off the light)",
      "color": "blue"
    },
    {
      "label": "Separable (pronoun)",
      "structure": "Verb + pronoun + particle ONLY  (turn it off, NOT turn off it)",
      "color": "purple"
    },
    {
      "label": "Inseparable (ajralmaydigan)",
      "structure": "Verb + particle + object  (look after the children, NOT look the children after)",
      "color": "green"
    },
    {
      "label": "Three-word (3 so'zli)",
      "structure": "Verb + particle + particle  (put up with, look forward to, run out of)",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Separable: turn on/off, pick up, put away, take off, give back",
    "Separable pronoun: pick it up, turn it off, put them away",
    "Inseparable: look after, run into, get over, care for, look for",
    "Three-word: put up with (chidamoq), look forward to (intizor bo'lmoq), run out of (tugamoq)"
  ],
  "examples": [
    {
      "en": "Please turn off the lights when you leave. / Turn them off.",
      "uz": "Iltimos, ketayotganda chiroqlarni o'chiring. / Ularni o'chiring."
    },
    {
      "en": "She takes after her mother. (inseparable)",
      "uz": "U onasiga o'xshaydi. (ajralmaydi)"
    },
    {
      "en": "I am looking forward to meeting you.",
      "uz": "Men siz bilan uchrashishni intiqlik bilan kutaman."
    },
    {
      "en": "He put up with his noisy neighbours for years.",
      "uz": "U shovqinli qo'shnilariga yillar davomida chidadi."
    },
    {
      "en": "We have run out of milk. Can you buy some?",
      "uz": "Sutimiz tugadi. Sotib ola olasizmi?"
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Separable phrasal verb bilan to'ldiring:",
      "question": "Can you _____ the light? It's too dark. (turn / on)",
      "blanks": [
        "turn on"
      ],
      "explanation": "'Turn on' = yoqish. 'Turn on the light' yoki 'turn the light on'.",
      "id": 402
    },
    {
      "type": "fill-blank",
      "instruction": "Pronoun bilan to'ldiring:",
      "question": "Please pick up your toys. → Please pick _____. (them)",
      "blanks": [
        "them up"
      ],
      "explanation": "Pronoun → verb + pronoun + particle: 'pick them up'. 'Pick up them' xato.",
      "id": 403
    },
    {
      "type": "fill-blank",
      "instruction": "Inseparable phrasal verb bilan to'ldiring:",
      "question": "She is looking _____ her little brother while her parents are away. (after)",
      "blanks": [
        "after"
      ],
      "explanation": "'Look after' = qaramoq. Inseparable: 'look after her brother'.",
      "id": 404
    },
    {
      "type": "fill-blank",
      "instruction": "Three-word phrasal verb bilan to'ldiring:",
      "question": "I can't _____ _____ _____ his rude behaviour anymore. (put / up / with)",
      "blanks": [
        "put up with"
      ],
      "explanation": "'Put up with' = chidamoq. Three-word: 'put up with his behaviour'.",
      "id": 405
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "Please ___ the music. It's too loud.",
      "options": [
        "turn down",
        "turn off",
        "turn on",
        "turn up"
      ],
      "correct": "turn down",
      "explanation": "'Turn down' = pasaytirish. 'Turn off' = o'chirish, 'turn up' = baland qilish.",
      "id": 406
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "She ___ her grandmother. They have the same smile.",
      "options": [
        "takes after",
        "looks after",
        "runs after",
        "goes after"
      ],
      "correct": "takes after",
      "explanation": "'Take after' = o'xshamoq. 'Look after' = qaramoq. Inseparable.",
      "id": 407
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "I need to ___ this form before the deadline.",
      "options": [
        "fill in",
        "fill up",
        "fill out",
        "fill with"
      ],
      "correct": "fill in",
      "explanation": "'Fill in' = to'ldirmoq (formani). 'Fill out' ham mumkin.",
      "id": 408
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "We have ___ sugar. Can you buy some?",
      "options": [
        "run out of",
        "run into",
        "run after",
        "run over"
      ],
      "correct": "run out of",
      "explanation": "'Run out of' = tugamoq. 'Run into' = tasodifan uchrashmoq.",
      "id": 409
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "Please pick up it from the floor.",
      "errorPart": "pick up it",
      "correct": "Please pick it up from the floor.",
      "explanation": "Pronoun bilan separable phrasal verb: pronoun particle ORASIDA keladi: 'pick it up'.",
      "id": 410
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She looks after her little brother. → She looks him after.",
      "errorPart": "looks him after",
      "correct": "She looks after him.",
      "explanation": "'Look after' INSEPARABLE — zarrachadan keyin ob'ekt keladi: 'looks after him'.",
      "id": 411
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "I am looking forward to meet you next week.",
      "errorPart": "forward to meet",
      "correct": "I am looking forward to meeting you next week.",
      "explanation": "'Look forward to' — 'to' bu yerda preposition, infinitive emas. Keyin V+ing: 'to meeting'.",
      "id": 412
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He put up with it → He put it up with.",
      "errorPart": "put it up with",
      "correct": "He put up with it.",
      "explanation": "Three-word phrasal verbs INSEPARABLE: 'put up with it'. 'Put it up with' xato.",
      "id": 413
    },
    {
      "type": "transformation",
      "instruction": "Pronoun bilan qayta yozing:",
      "question": "Turn off the TV, please. → Use pronoun",
      "hint": "Turn it ...",
      "correct": "Turn it off, please.",
      "explanation": "Pronoun: 'turn it off'. 'TV' → 'it', 'off' keyin emas, orada.",
      "id": 414
    },
    {
      "type": "transformation",
      "instruction": "Three-word phrasal verb bilan qayta yozing:",
      "question": "I can no longer tolerate his bad attitude.",
      "hint": "I can't put up ...",
      "correct": "I can't put up with his bad attitude anymore.",
      "explanation": "'Tolerate' → 'put up with'. 'Put up with his bad attitude'.",
      "id": 415
    },
    {
      "type": "transformation",
      "instruction": "Inseparable phrasal verb bilan qayta yozing:",
      "question": "I accidentally met my old friend at the market.",
      "hint": "I ran ...",
      "correct": "I ran into my old friend at the market.",
      "explanation": "'Accidentally met' → 'ran into'. Inseparable: 'ran into my old friend'.",
      "id": 416
    }
  ]
}

export const linkingDevices: GrammarTopic = {
  "id": "linking-devices-b2",
  "title": "Linking Devices",
  "subtitle": "Addition, contrast, cause/effect, concession, sequencing — bog'lovchilar",
  "level": "B2",
  "week": 10,
  "tag": "Grammar",
  "formula": "Addition: moreover, furthermore · Contrast: however, whereas · Cause: therefore, consequently · Concession: despite, although",
  "formulaRows": [
    {
      "label": "Addition (qo'shish)",
      "structure": "Moreover / Furthermore / In addition / Besides",
      "color": "blue"
    },
    {
      "label": "Contrast (zidlik)",
      "structure": "However / Nevertheless / On the other hand / Whereas",
      "color": "purple"
    },
    {
      "label": "Cause & effect (sabab-natija)",
      "structure": "Therefore / Consequently / As a result / Thus",
      "color": "green"
    },
    {
      "label": "Concession (qaramasdan)",
      "structure": "Although / Even though / Despite / In spite of",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Qo'shimcha fikr bildirish: moreover, furthermore, in addition",
    "Zid fikr bildirish: however, nevertheless, on the other hand, whereas",
    "Sabab va natija ko'rsatish: therefore, consequently, as a result, thus",
    "Qaramasdan ma'nosida: although, even though, despite, in spite of"
  ],
  "examples": [
    {
      "en": "The weather was terrible. However, we still enjoyed our trip.",
      "uz": "Ob-havo dahshatli edi. Biroq, biz safardan zavqlanishda davom etdik."
    },
    {
      "en": "He studied hard; therefore, he passed the exam with flying colours.",
      "uz": "U qattiq o'qidi; shuning uchun imtihondan a'lo baho bilan o'tdi."
    },
    {
      "en": "Although it was raining, we decided to go for a walk.",
      "uz": "Yomg'ir yog'ayotgan bo'lsa-da, biz sayr qilishga qaror qildik."
    },
    {
      "en": "She enjoys classical music, whereas her brother prefers rock.",
      "uz": "U mumtoz musiqani yoqtiradi, akasi esa rokni afzal ko'radi."
    },
    {
      "en": "Despite feeling tired, she finished all her work on time.",
      "uz": "Charchaganiga qaramasdan, u barcha ishini o'z vaqtida tugatdi."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Addition linking device bilan to'ldiring:",
      "question": "The hotel was expensive. _____, the service was excellent. (Moreover / However)",
      "blanks": [
        "Moreover"
      ],
      "explanation": "'Moreover' = qo'shimcha qilish. Qimmat edi, qo'shimcha ravishda xizmat ajoyib edi.",
      "id": 417
    },
    {
      "type": "fill-blank",
      "instruction": "Contrast bilan to'ldiring:",
      "question": "He wanted to go out. _____, his mother told him to stay home. (However / Therefore)",
      "blanks": [
        "However"
      ],
      "explanation": "'However' = zidlik. U chiqmoqchi edi, biroq onasi uyda qolishni aytdi.",
      "id": 418
    },
    {
      "type": "fill-blank",
      "instruction": "Cause/effect bilan to'ldiring:",
      "question": "She didn't study. _____, she failed the exam. (Therefore / However)",
      "blanks": [
        "Therefore"
      ],
      "explanation": "'Therefore' = shuning uchun. O'qimadi → shuning uchun imtihondan yiqildi.",
      "id": 419
    },
    {
      "type": "fill-blank",
      "instruction": "Concession bilan to'ldiring:",
      "question": "_____ the rain, we went for a walk in the park. (Despite / Although)",
      "blanks": [
        "Despite"
      ],
      "explanation": "'Despite + noun': 'Despite the rain'. 'Although + clause' — bu yerda noun.",
      "id": 420
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The service was slow. ___, the food was delicious.",
      "options": [
        "However",
        "Moreover",
        "Therefore",
        "Thus"
      ],
      "correct": "However",
      "explanation": "'However' — zidlik. Xizmat sekin edi, ammo taom mazali edi.",
      "id": 421
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "He forgot his umbrella. ___, he got soaked in the rain.",
      "options": [
        "Consequently",
        "Nevertheless",
        "Moreover",
        "However"
      ],
      "correct": "Consequently",
      "explanation": "'Consequently' = natijada. Soyabonni unutdi → natijada ho'l bo'ldi.",
      "id": 422
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "___ he was tired, he continued working on the project.",
      "options": [
        "Although",
        "Despite",
        "In spite of",
        "However"
      ],
      "correct": "Although",
      "explanation": "'Although + clause': 'although he was tired'. 'Despite + noun/V+ing'.",
      "id": 423
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The north of the country is cold, ___ the south is warm.",
      "options": [
        "whereas",
        "therefore",
        "moreover",
        "furthermore"
      ],
      "correct": "whereas",
      "explanation": "'Whereas' = ikki narsani solishtirish. Shimol sovuq, janub esa issiq.",
      "id": 424
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "Despite of the rain, we went for a walk.",
      "errorPart": "Despite of",
      "correct": "Despite the rain, we went for a walk.",
      "explanation": "'Despite' dan keyin 'of' ishlatilmaydi: 'Despite the rain'. 'In spite of' — 'of' bilan.",
      "id": 425
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "Although the rain, we went for a walk.",
      "errorPart": "Although the rain",
      "correct": "Despite the rain, we went for a walk. / Although it was raining, we went for a walk.",
      "explanation": "'Although + clause' (subject+verb): 'although it was raining'. 'Despite + noun': 'despite the rain'.",
      "id": 426
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "He was late. However he still got the job.",
      "errorPart": "However he",
      "correct": "He was late. However, he still got the job.",
      "explanation": "'However' dan keyin vergul qo'yiladi: 'However, he still got the job'.",
      "id": 427
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She is intelligent, moreover she is hardworking.",
      "errorPart": "moreover she",
      "correct": "She is intelligent. Moreover, she is hardworking.",
      "explanation": "'Moreover' yangi gap boshida vergul bilan: 'Moreover, she is hardworking'.",
      "id": 428
    },
    {
      "type": "transformation",
      "instruction": "'However' bilan qayta yozing:",
      "question": "The film was long. But it was very interesting.",
      "hint": "The film was long. However, ...",
      "correct": "The film was long. However, it was very interesting.",
      "explanation": "'But' → 'However'. Yangi gap boshida: 'However, it was very interesting'.",
      "id": 429
    },
    {
      "type": "transformation",
      "instruction": "'Despite' bilan qayta yozing:",
      "question": "Although she was tired, she continued working.",
      "hint": "Despite being ...",
      "correct": "Despite being tired, she continued working.",
      "explanation": "'Although + clause' → 'Despite + V+ing'. 'Despite being tired'.",
      "id": 430
    },
    {
      "type": "transformation",
      "instruction": "'Therefore' bilan qayta yozing:",
      "question": "She saved money for years. As a result, she bought a house.",
      "hint": "She saved money for years; therefore, ...",
      "correct": "She saved money for years; therefore, she bought a house.",
      "explanation": "'As a result' → 'therefore'. 'She saved money; therefore, she bought a house'.",
      "id": 431
    }
  ]
}

export const hedgingStance: GrammarTopic = {
  "id": "hedging-stance-b2",
  "title": "Hedging & Stance",
  "subtitle": "Noaniqlik va ishonchni ifodalash — it seems, arguably, tends to, presumably",
  "level": "B2",
  "week": 10,
  "tag": "Grammar",
  "formula": "Hedging: it seems/appears · arguably · tends to · presumably · somewhat · to some extent",
  "formulaRows": [
    {
      "label": "Hedging verbs",
      "structure": "It seems / appears / tends to / is likely to",
      "color": "blue"
    },
    {
      "label": "Hedging adverbs",
      "structure": "arguably / presumably / apparently / relatively / somewhat",
      "color": "purple"
    },
    {
      "label": "Stance (ishonch)",
      "structure": "clearly / undoubtedly / certainly / definitely / obviously",
      "color": "green"
    },
    {
      "label": "Limiting expressions",
      "structure": "to some extent / in a sense / up to a point / for the most part",
      "color": "orange"
    }
  ],
  "usedFor": [
    "Hedging: fikrni yumshoq va ehtiyotkorona ifodalash",
    "Stance: kuchli ishonch va qat'iy fikr bildirish",
    "Akademik yozuv: haddan tashqari qat'iy bo'lmaslik",
    "Ilmiy maqolalar va rasmiy hujjatlarda hedging keng qo'llaniladi"
  ],
  "examples": [
    {
      "en": "It seems that the economy is improving gradually.",
      "uz": "Iqtisodiyot asta-sekin yaxshilanayotganga o'xshaydi."
    },
    {
      "en": "This is arguably the best film of the decade.",
      "uz": "Bu o'n yillikning eng yaxshi filmi desa bo'ladi."
    },
    {
      "en": "The results are clearly significant for further research.",
      "uz": "Natijalar keyingi tadqiqotlar uchun shubhasiz muhim."
    },
    {
      "en": "To some extent, the new policy has improved the situation.",
      "uz": "Ma'lum darajada, yangi siyosat vaziyatni yaxshiladi."
    },
    {
      "en": "The patient is likely to make a full recovery.",
      "uz": "Bemor to'liq tuzalishi mumkin."
    }
  ],
  "exercises": [
    {
      "type": "fill-blank",
      "instruction": "Hedging verb bilan to'ldiring:",
      "question": "It _____ (seem) that the situation is improving gradually.",
      "blanks": [
        "seems"
      ],
      "explanation": "'It seems that' = ...ga o'xshaydi. Noaniqlikni ifodalaydi.",
      "id": 432
    },
    {
      "type": "fill-blank",
      "instruction": "Hedging adverb bilan to'ldiring:",
      "question": "This is _____ (arguable) the best book I have ever read.",
      "blanks": [
        "arguably"
      ],
      "explanation": "'Arguably' = aytish mumkinki. Shaxsiy fikrni yumshoq ifodalash.",
      "id": 433
    },
    {
      "type": "fill-blank",
      "instruction": "Stance adverb bilan to'ldiring:",
      "question": "She is _____ (clear) the most qualified candidate for the job.",
      "blanks": [
        "clearly"
      ],
      "explanation": "'Clearly' = aniq. Kuchli ishonch bilan aytish.",
      "id": 434
    },
    {
      "type": "fill-blank",
      "instruction": "Limiting expression bilan to'ldiring:",
      "question": "_____, I agree with your proposal, but I have some concerns. (to some extent)",
      "blanks": [
        "To some extent"
      ],
      "explanation": "'To some extent' = ma'lum darajada. Cheklangan rozi.",
      "id": 435
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "___ that the company will announce new changes soon.",
      "options": [
        "It seems",
        "Arguably",
        "Clearly",
        "To some extent"
      ],
      "correct": "It seems",
      "explanation": "'It seems that + clause'. 'Arguably' — adverb, verb emas.",
      "id": 436
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The government will ___ introduce new regulations next year.",
      "options": [
        "presumably",
        "arguably",
        "undoubtedly",
        "clearly"
      ],
      "correct": "presumably",
      "explanation": "'Presumably' = taxminan. Noaniqlik bilan aytish. 'Undoubtedly' — kuchli ishonch.",
      "id": 437
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "This is ___ the worst decision the committee has ever made.",
      "options": [
        "undoubtedly",
        "presumably",
        "arguably",
        "relatively"
      ],
      "correct": "undoubtedly",
      "explanation": "'Undoubtedly' = shubhasiz. Kuchli ishonch. 'Arguably' — yumshoqroq.",
      "id": 438
    },
    {
      "type": "multiple-choice",
      "instruction": "To'g'ri variantni tanlang:",
      "question": "The new method is ___ more effective than the old one.",
      "options": [
        "arguably",
        "presumably",
        "undoubtedly",
        "relatively"
      ],
      "correct": "relatively",
      "explanation": "'Relatively' = nisbatan. Solishtirishni yumshatish uchun ishlatiladi.",
      "id": 439
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "It seems that clearly the situation is improving.",
      "errorPart": "seems that clearly",
      "correct": "It seems that the situation is clearly improving.",
      "explanation": "'Clearly' fe'l oldida kelishi kerak: 'is clearly improving'. 'Seems that clearly' — so'z tartibi xato.",
      "id": 440
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "She is arguably the most definitely talented singer.",
      "errorPart": "arguably ... definitely",
      "correct": "She is arguably the most talented singer.",
      "explanation": "'Arguably' va 'definitely' birga ishlatilmaydi — ikkalasi turli ma'noda. Birini tanlash kerak.",
      "id": 441
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "To some extent I don't agree with you.",
      "errorPart": "To some extent I",
      "correct": "To some extent, I don't agree with you.",
      "explanation": "Limiting expression dan keyin vergul: 'To some extent, I don't agree'.",
      "id": 442
    },
    {
      "type": "error-correction",
      "instruction": "Grammatik xatoni toping va to'g'irlang:",
      "question": "It tends to be rains a lot in this region.",
      "errorPart": "tends to be rains",
      "correct": "It tends to rain a lot in this region.",
      "explanation": "'Tends to + V¹' (infinitive): 'tends to rain'. 'Tends to be rains' xato.",
      "id": 443
    },
    {
      "type": "transformation",
      "instruction": "'It seems' bilan qayta yozing:",
      "question": "Perhaps the meeting has been cancelled.",
      "hint": "It seems that ...",
      "correct": "It seems that the meeting has been cancelled.",
      "explanation": "'Perhaps' → 'It seems that'. Noaniqlikni ifodalash.",
      "id": 444
    },
    {
      "type": "transformation",
      "instruction": "'Arguably' bilan qayta yozing:",
      "question": "I think this is the best solution to the problem.",
      "hint": "This is arguably ...",
      "correct": "This is arguably the best solution to the problem.",
      "explanation": "'I think' → 'arguably'. Yumshoq va akademik uslub.",
      "id": 445
    },
    {
      "type": "transformation",
      "instruction": "'Undoubtedly' bilan qayta yozing (kuchli ishonch):",
      "question": "I am completely sure that she will win the competition.",
      "hint": "She will undoubtedly ...",
      "correct": "She will undoubtedly win the competition.",
      "explanation": "'I am completely sure' → 'undoubtedly'. Kuchli ishonch.",
      "id": 446
    }
  ]
}


