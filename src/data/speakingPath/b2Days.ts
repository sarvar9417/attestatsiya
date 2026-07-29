import type { SpeakingDay } from './types'

const day99: SpeakingDay = {
  day: 99, cefr: 'B2',
  title: "Unreal Past",
  subtitle: "Wish, if only",
  goalUz: "Wish/if only bilan afsus va orzlarni bildira olasiz.",
  estMinutes: 15,
  linkedLessonId: 'unreal-past-b2',
  grammarPoint: 'wish/if only + V2',
  vocab: [
    { en: 'wish', uz: 'istash', example: 'I wish I were taller.' },
    { en: 'regret', uz: 'afsuslanish', example: 'I regret not studying harder.' },
    { en: 'imagine', uz: 'tasavvur qilish', example: 'Imagine you are on a beach.' },
    { en: 'suppose', uz: 'taxmin qilish', example: 'I suppose you are right.' }
  ],
  pronunciationFocus: {
    sound: '/w/',
    ipaExample: '/w/ — wish, would',
    tipUz: "Lablar bilan yasaladi.",
    tipEn: "Made with the lips.",
  },
  recycledChunkIds: ['sp-d89-c3', 'sp-d89-c6', 'sp-d32-c4', 'sp-d17-c4', 'sp-d89-c1'],
  chunks: [
    { id: 'sp-d99-c1', en: "I wish I had more free time.", uz: "Ko'proq bo'sh vaqtim bo'lganini istardim.", grammarTip: "'Wish + past simple' — hozirgi haqiqatga afsus. 'Had' = Past Simple (ammonga o'xshab).", commonMistake: "'I wish I have more time' xato — 'I HAD' (Past Simple, zamon o'zgaradi).", stressWord: 'WISH' },
    { id: 'sp-d99-c2', en: "If only I knew the answer.", uz: "Javobni bilganimda edi.", grammarTip: "'If only' = 'wish' dan kuchli. Afsus va orzu. 'Knew' = Past Simple (bilardim).", commonMistake: "'If only I know' xato — 'knew' (Past Simple) kerak.", stressWord: 'KNEW' },
    { id: 'sp-d99-c3', en: "She wishes she could speak English fluently.", uz: "U ingliz tilini ravon gapira olganini istardi.", grammarTip: "'Wish + could' — imkonsiz imkoniyat. 'Could speak' = gapira olardim (lekin hozir yo'q).", commonMistake: "'She wishes she can speak' xato — 'could' (Past Simple modal) kerak.", stressWord: 'WISHES' },
    { id: 'sp-d99-c4', en: "I wish I hadn't said that.", uz: "Shuni aytmaganimda edi.", grammarTip: "'Wish + past perfect' — o'tmishga afsus. 'Hadn't said' = aytmagan bo'lsam edi.", commonMistake: "'I wish I didn't say' o'rniga 'hadn't said' — o'tmish uchun Past Perfect kerak.", stressWord: 'HADNT' },
    { id: 'sp-d99-c5', en: "If only we had listened to your advice.", uz: "Sizning maslahatingizni tinglagan bo'lsak edi.", grammarTip: "'If only + past perfect' — o'tmishdagi xatoga afsus. 'Had listened' = tinglagan bo'lsak.", commonMistake: "'If only we listened' xato — o'tmish uchun 'had listened' (Past Perfect) kerak.", stressWord: 'LISTENED' },
    { id: 'sp-d99-c6', en: "I wish it weren't raining right now.", uz: "Hozir yog'maganda edi.", grammarTip: "'Wish + past continuous' — hozirgi davomiy holatga afsus. 'Weren't raining' = yog'mayotgan bo'lsa.", commonMistake: "'I wish it isn't raining' xato — 'weren't raining' (Past Continuous) kerak.", stressWord: 'WERENT' }
  ],
  scenario: {
    topic: "expressing regrets and wishes about life",
    aiRole: "a close friend who also reflects on life choices",
    userRole: "someone sharing personal regrets and wishes",
    opening: "You know, I've been thinking a lot about the past lately. Do you ever wish you had made different choices?",
    goalUz: "Wish/if only bilan o'tmishdagi afsus va orzlaringizni do'stingiz bilan gaplashib chiqing.",
  },
}

const day100: SpeakingDay = {
  day: 100, cefr: 'B2',
  title: "Advanced Conditionals",
  subtitle: "Aralash shartli gaplar",
  goalUz: "Mixed conditionals bilan murakkab shartli gaplarni tuzasiz.",
  estMinutes: 15,
  linkedLessonId: 'advanced-conditionals-b2',
  grammarPoint: 'mixed conditionals',
  vocab: [
    { en: 'if', uz: 'agar', example: 'If I had money, I would travel.' },
    { en: 'would', uz: 'qilgan bo\'lardi', example: 'I would help you.' },
    { en: 'could', uz: 'qila olgan bo\'lardi', example: 'We could go if you wanted.' },
    { en: 'condition', uz: 'shart', example: 'This is a conditional sentence.' }
  ],
  pronunciationFocus: {
    sound: '/k/',
    ipaExample: '/k/ — condition, could',
    tipUz: "Til orqa qismidan chiqadi.",
    tipEn: "Sound from the back of the tongue.",
  },
  recycledChunkIds: ['sp-d64-c1', 'sp-d90-c4', 'sp-d63-c4', 'sp-d25-c4', 'sp-d64-c4'],
  chunks: [
    { id: 'sp-d100-c1', en: "If I had studied harder, I would be a doctor now.", uz: "Ko'proq o'qigan bo'lsam, hozir shifokor bo'lar edim.", grammarTip: "Mixed conditional: o'tmish shart (had studied) + hozirgi natija (would be). Ikkita vaqt aralashadi.", commonMistake: "'If I studied harder, I would be' xato — o'tmish shart uchun 'had studied' kerak.", stressWord: 'WOULD' },
    { id: 'sp-d100-c2', en: "If she hadn't moved abroad, she would still live in Tashkent.", uz: "U chet elga ko'chmaganida, hali ham Toshkentda yashar edi.", grammarTip: "O'tmish shart (hadn't moved) + hozirgi natija (would still live). 'Would still' = hali ham bo'lar edi.", commonMistake: "'She would still lived' xato — 'would' dan keyin fe'lning asosiy shakli: 'would live'.", stressWord: 'WOULD' },
    { id: 'sp-d100-c3', en: "If I were you, I would accept the job offer.", uz: "Men sizning o'rnimda bo'lganimda, ish taklifini qabul qilardim.", grammarTip: "'If I were' — subjunctive (hamma uchun 'were'). 'Would accept' — hozirgi natija.", commonMistake: "'If I was you' grammatik jihatdan noto'g'ri — 'IF I WERE YOU' (formal).", stressWord: 'WERE' },
    { id: 'sp-d100-c4', en: "He wouldn't be so tired if he had gone to bed earlier.", uz: "U ertaroq yotganida, bu zerikkan bo'lmas edi.", grammarTip: "Hozirgi shart (wouldn't be) + o'tmish shart (had gone). 'Earlier' = ertaroq (solishtirma).", commonMistake: "'He wouldn't be so tired if he went to bed' xato — o'tmish uchun 'had gone' kerak.", stressWord: 'HAD' },
    { id: 'sp-d100-c5', en: "If we had left earlier, we wouldn't have missed the train.", uz: "Biz ertaroq chiqqan bo'lsak, poyezdni o'tkazib yubormagan bo'lardik.", grammarTip: "O'tmish shart (had left) + o'tmish natija (wouldn't have missed). Third conditional bilan aralash.", commonMistake: "'We wouldn't missed' xato — 'wouldn't HAVE missed' kerak (perfect).", stressWord: 'WOULDNT' },
    { id: 'sp-d100-c6', en: "If he spoke English, he would get a better job.", uz: "U ingliz tilini bilsa, yaxshiroq ish topardi.", grammarTip: "Hozirgi shart (spoke = Past Simple) + hozirgi natija (would get). Umumiy shart.", commonMistake: "'If he speaks English' xato — hozirgi shart uchun ham 'spoke' (Past Simple) kerak.", stressWord: 'WOULD' }
  ],
  scenario: {
    topic: "discussing hypothetical life scenarios",
    aiRole: "a philosophy professor after a lecture",
    userRole: "a student exploring hypothetical situations",
    opening: "Interesting discussion today. Tell me — if you could change one thing about your past, what would it be?",
    goalUz: "Mixed conditionals bilan hayotdagi o'zgarishlar haqida akademik suhbat olib boring.",
  },
}

const day101: SpeakingDay = {
  day: 101, cefr: 'B2',
  title: "Future Perfect Continuous",
  subtitle: "Kelajakda davomiylik",
  goalUz: "Future perfect continuous bilan kelajakda davom etgan ishlarni tasvirlaysiz.",
  estMinutes: 15,
  linkedLessonId: 'future-perfect-continuous',
  grammarPoint: 'will have been V-ing',
  vocab: [
    { en: 'will', uz: 'bo\'ladi', example: 'By next year I will have been working here for five years.' },
    { en: 'been', uz: 'bo\'lgan', example: 'She will have been studying for hours.' },
    { en: 'working', uz: 'ishlash', example: 'I will have been working all day.' },
    { en: 'expecting', uz: 'kutilayotgan', example: 'They will have been expecting us.' }
  ],
  pronunciationFocus: {
    sound: '/v/',
    ipaExample: '/v/ — have, been',
    tipUz: "Tish va lab orasidan chiqadi.",
    tipEn: "Sound between teeth and lip.",
  },
  recycledChunkIds: ['sp-d73-c3', 'sp-d23-c1', 'sp-d52-c1', 'sp-d82-c1', 'sp-d42-c1'],
  chunks: [
    { id: 'sp-d101-c1', en: "By next year, I will have been working here for ten years.", uz: "Kelgani yilgacha men bu yerda 10 yil ishlagan bo'laman.", grammarTip: "'Will have been V-ing' = kelajakda davom etgan ish. 'By next year' = kelgani yilgacha.", commonMistake: "'I will work here for ten years' xato — davomiylikni ta'kidlash uchun 'will have been working' kerak.", stressWord: 'WILL' },
    { id: 'sp-d101-c2', en: "She will have been studying for three hours by the time you arrive.", uz: "Siz yetib kelguncha u uch soat o'qigan bo'ladi.", grammarTip: "'By the time + Present Simple' = shu vaqtgacha. 'Will have been studying' = uch soat davomida o'qigan.", commonMistake: "'She will have been studying for three hours when you arrive' xato — 'BY the time' kerak.", stressWord: 'BY' },
    { id: 'sp-d101-c3', en: "By December, they will have been living in London for five years.", uz: "Dekabrgacha ular Londonda besh yil yashagan bo'lishadi.", grammarTip: "'By + vaqt' = shu vaqtgacha. 'Will have been living' = shu vaqtdan beri davom etgan.", commonMistake: "'By December they will live in London for five years' xato — davomiylik uchun 'will have been living'.", stressWord: 'LIVING' },
    { id: 'sp-d101-c4', en: "How long will you have been learning English by June?", uz: "Iyungacha siz necha vaqt ingliz tilini o'rgangan bo'lasiz?", grammarTip: "So'roq: 'How long + will + S + have been V-ing + by + vaqt?' — necha vaqt davom etganini so'rash.", commonMistake: "'How long will you learn English by June' xato — 'will have been learning' kerak.", stressWord: 'HOW' },
    { id: 'sp-d101-c5', en: "We will have been waiting for two hours if he doesn't come soon.", uz: "U tez kelmasa, biz ikki soat kutgan bo'lamiz.", grammarTip: "'If + Present Simple, will have been V-ing' — kelajakdagi kutish haqida. 'Waiting for two hours' = ikki soat.", commonMistake: "'We will wait for two hours' o'rniga 'will have been waiting' — davomiylikni ta'kidlash.", stressWord: 'WILL' },
    { id: 'sp-d101-c6', en: "By the end of this month, I will have been reading this book for a long time.", uz: "Oxirigacha men bu kitobni uzoq vaqt o'qigan bo'laman.", grammarTip: "'By the end of + vaqt' = oxirigacha. 'Will have been reading' = uzoq vaqt davomida.", commonMistake: "'By the end I will read this book' xato — davomiylik uchun 'will have been reading' kerak.", stressWord: 'READING' }
  ],
  scenario: {
    topic: "talking about long-term career achievements",
    aiRole: "a senior colleague at a company anniversary event",
    userRole: "an employee reflecting on years of work",
    opening: "Congratulations on your anniversary! Five years already. How long have you been working on the new project?",
    goalUz: "Kelajakda davom etgan ishlaringiz haqida hamkasbingiz bilan gaplashib chiqing.",
  },
}

const day102: SpeakingDay = {
  day: 102, cefr: 'B2',
  title: "Nominalization",
  subtitle: "Otlashtirish",
  goalUz: "Fe'llarni otga aylantirib rasmiy nutq yasaysiz.",
  estMinutes: 15,
  linkedLessonId: 'nominalization-b2',
  grammarPoint: 'verb to noun',
  vocab: [
    { en: 'decision', uz: 'qaror', example: 'We need to make a decision.' },
    { en: 'development', uz: 'rivojlanish', example: 'Technology development is fast.' },
    { en: 'growth', uz: 'o\'sish', example: 'Economic growth is important.' },
    { en: 'achievement', uz: 'yutuq', example: 'Graduation is a great achievement.' }
  ],
  pronunciationFocus: {
    sound: '/ʃ/',
    ipaExample: '/ʃ/ — decision, nation',
    tipUz: "Og'iz bo'shlig'iga yo'naltiriladi.",
    tipEn: "Sound directed to mouth cavity.",
  },
  recycledChunkIds: ['sp-d18-c4', 'sp-d41-c2', 'sp-d85-c1', 'sp-d58-c1', 'sp-d80-c2'],
  chunks: [
    { id: 'sp-d102-c1', en: "The government made an important decision.", uz: "Hukumat muhim qaror qabul qildi.", grammarTip: "'Decide' (fe'l) → 'decision' (ot). Rasmiy nutqda fe'llar otlarga aylantiriladi.", commonMistake: "'The government decided' o'rniga 'made a decision' — rasmiy uslub. 'Decision' = qaror.", stressWord: 'DECISION' },
    { id: 'sp-d102-c2', en: "There has been a significant improvement in the results.", uz: "Natijalarda sezilarli yaxshilanish bo'ldi.", grammarTip: "'Improve' (fe'l) → 'improvement' (ot). 'Significant' = sezilarli (rasmiy sifat).", commonMistake: "'There has been a significant improve' xato — 'improvement' (ot) kerak.", stressWord: 'IMPROVEMENT' },
    { id: 'sp-d102-c3', en: "We need to conduct a thorough investigation.", uz: "Biz chuqur tekshiruv o'tkazishimiz kerak.", grammarTip: "'Investigate' (fe'l) → 'investigation' (ot). 'Conduct' = o'tkazmoq (rasmiy fe'l bilan).", commonMistake: "'We need to investigate thorough' xato — 'conduct a thorough investigation'.", stressWord: 'INVESTIGATION' },
    { id: 'sp-d102-c4', en: "His failure to respond was surprising.", uz: "Uning javob bermaganligi hayratga solar edi.", grammarTip: "'Fail' (fe'l) → 'failure' (ot). 'Failure to + V' = … olmaganlik. Rasmiy uslub.", commonMistake: "'His failing to respond' xato — 'failure' (ot) kerak: 'his failure to respond'.", stressWord: 'FAILURE' },
    { id: 'sp-d102-c5', en: "The discovery of a new species was announced.", uz: "Yangi tur topilgani e'lon qilindi.", grammarTip: "'Discover' (fe'l) → 'discovery' (ot). 'The discovery of' = ning kashfiyoti. Pasiv bilan.", commonMistake: "'The discovery of a new species was announce' xato — 'was ANNOUNCED' (passive).", stressWord: 'DISCOVERY' },
    { id: 'sp-d102-c6', en: "The implementation of the plan requires careful planning.", uz: "Rejaning amalga oshirilishida ehtiyotkor rejalashtirish talab qilinadi.", grammarTip: "'Implement' (fe'l) → 'implementation' (ot). Ikkita 'plan' — biri ot, biri fe'l shakli.", commonMistake: "'The implement of the plan' xato — 'implementation' (ot) kerak.", stressWord: 'IMPLEMENTATION' }
  ],
  scenario: {
    topic: "writing a formal business report",
    aiRole: "a senior manager reviewing your report draft",
    userRole: "an employee presenting a formal report",
    opening: "I've read your draft. It's good, but can you make the language more formal? Try using nominalizations where possible.",
    goalUz: "Rasmiy hisobotda fe'llarni otga aylantirib professional nutq yarating.",
  },
}

const day103: SpeakingDay = {
  day: 103, cefr: 'B2',
  title: "Subjunctive Mood",
  subtitle: "Kerakli gaplar",
  goalUz: "Subjunctive bilan taklif, talab va zaruratlarni bildirasiz.",
  estMinutes: 15,
  linkedLessonId: 'subjunctive-b2',
  grammarPoint: 'if I were / suggest he go',
  vocab: [
    { en: 'suggest', uz: 'taklif qilish', example: 'I suggest he go now.' },
    { en: 'recommend', uz: 'tavsiya etish', example: 'She recommended reading the book.' },
    { en: 'insist', uz: 'taleb qilish', example: 'He insisted on paying.' },
    { en: 'demand', uz: 'talab qilish', example: 'They demanded an apology.' }
  ],
  pronunciationFocus: {
    sound: '/dʒ/',
    ipaExample: '/dʒ/ — judge, suggest',
    tipUz: "Oldingi til bilan yasaladi.",
    tipEn: "Made with the front of tongue.",
  },
  recycledChunkIds: ['sp-d63-c4', 'sp-d33-c3', 'sp-d59-c1', 'sp-d47-c1', 'sp-d20-c4'],
  chunks: [
    { id: 'sp-d103-c1', en: "I suggest that he study harder for the exam.", uz: "Men unga imtihonga ko'proq o'qishni maslahat beraman.", grammarTip: "'Suggest that + S + base form' — taklif. 'Study' (s, emas 'studies'). Subjunctive.", commonMistake: "'I suggest that he studies' xato — subjunctive da fe'lning asosiy shakli: 'he STUDY'.", stressWord: 'STUDY' },
    { id: 'sp-d103-c2', en: "If I were rich, I would travel the world.", uz: "Men boy bo'lganimda, butun dunyoni sayohat qilardim.", grammarTip: "'If I were' — subjunctive (hamma uchun 'were', hatto 'I' bilan). Imkoniyat yoki orzu.", commonMistake: "'If I was rich' xato — subjunctive da 'IF I WERE' (formal) ishlatiladi.", stressWord: 'WERE' },
    { id: 'sp-d103-c3', en: "It is essential that she be present at the meeting.", uz: "Uning yig'ilishda ishtirok etishi zarur.", grammarTip: "'It is essential that + S + base form' — zarurat. 'She be' (emas 'she is').", commonMistake: "'It is essential that she is present' xato — subjunctive: 'she BE present'.", stressWord: 'BE' },
    { id: 'sp-d103-c4', en: "I wish I were taller.", uz: "Bo'yingam balandroq bo'lganida edi.", grammarTip: "'I wish I were' — subjunctive. 'Were' (emas 'was') ishlatiladi, hatto 'I' bilan.", commonMistake: "'I wish I was taller' noto'g'ri emas, lekin 'were' — to'g'ri va rasmiy.", stressWord: 'WERE' },
    { id: 'sp-d103-c5', en: "The doctor recommended that he take a week off.", uz: "Shifokor unga bir hafta dam olishni maslahat berdi.", grammarTip: "'Recommend that + S + base form' — maslahat. 'He take' (emas 'he takes').", commonMistake: "'The doctor recommended that he takes' xato — subjunctive: 'he TAKE'.", stressWord: 'TAKE' },
    { id: 'sp-d103-c6', en: "If she were here, she would know what to do.", uz: "U bu yerda bo'lganida, nima qilishni bilardi.", grammarTip: "'If she were' — subjunctive. Hozirgi imkoniyat. 'Would know' — natija.", commonMistake: "'If she was here' xato — subjunctive: 'IF SHE WERE here'.", stressWord: 'WERE' }
  ],
  scenario: {
    topic: "giving formal recommendations in a meeting",
    aiRole: "a team leader asking for suggestions",
    userRole: "a team member proposing actions",
    opening: "We need to improve our sales numbers. What do you suggest the team do differently this quarter?",
    goalUz: "Subjunctive bilan rasmiy taklif va tavsiyalar bering.",
  },
}

const day104: SpeakingDay = {
  day: 104, cefr: 'B2',
  title: "Advanced Passive",
  subtitle: "Murakkab majhul ovoz",
  goalUz: "Passive voice ni murakkab gaplarda ishlatasiz.",
  estMinutes: 15,
  linkedLessonId: 'advanced-passive-b2',
  grammarPoint: 'passive + modals / perfect',
  vocab: [
    { en: 'been', uz: 'bo\'lgan', example: 'The work has been completed.' },
    { en: 'made', uz: 'yaratilgan', example: 'The decision was made by the team.' },
    { en: 'known', uz: 'ma\'lum', example: 'This fact is widely known.' },
    { en: 'considered', uz: 'hisoblangan', example: 'She is considered an expert.' }
  ],
  pronunciationFocus: {
    sound: '/n/',
    ipaExample: '/n/ — been, known',
    tipUz: "Burun orqasidan chiqadi.",
    tipEn: "Sound from the nose.",
  },
  recycledChunkIds: ['sp-d49-c1', 'sp-d49-c2', 'sp-d71-c3', 'sp-d49-c3', 'sp-d84-c1'],
  chunks: [
    { id: 'sp-d104-c1', en: "The report must be submitted by Friday.", uz: "Hisobot juma kunigacha topshirilishi shart.", grammarTip: "'Must be + past participle' — majburiyat + pasiv. 'Must be submitted' = topshirilishi kerak.", commonMistake: "'The report must submit by Friday' xato — pasiv: 'must be SUBMITTED'.", stressWord: 'SUBMITTED' },
    { id: 'sp-d104-c2', en: "The building has been renovated three times.", uz: "Bino uch marta ta'mirlangan.", grammarTip: "'Has been + V3' — Perfect Passive. 'Renovated' = ta'mirlangan. 'Three times' = uch marta.", commonMistake: "'The building has been renovate' xato — 'renovated' (V3) kerak.", stressWord: 'BEEN' },
    { id: 'sp-d104-c3', en: "The work could have been done more efficiently.", uz: "Ish samaraliroq bajarilishi mumkin edi.", grammarTip: "'Could have been + V3' — o'tmishdagi mumkinlik + pasiv. 'Done' = bajarilgan.", commonMistake: "'The work could have been do' xato — 'done' (V3) kerak.", stressWord: 'DONE' },
    { id: 'sp-d104-c4', en: "New regulations will be introduced next month.", uz: "Yangi qoidalar kelasi oy joriy etiladi.", grammarTip: "'Will be + V3' — Future Passive. 'Introduced' = joriy etiladi. 'Next month' = kelasi oy.", commonMistake: "'New regulations will introduce' xato — pasiv: 'will be INTRODUCED'.", stressWord: 'BE' },
    { id: 'sp-d104-c5', en: "The cake was being prepared when I arrived.", uz: "Men yetib kelganda tort tayyorlanayotgan edi.", grammarTip: "'Was being + V3' — Past Continuous Passive. Davomiy pasiv harakat.", commonMistake: "'The cake was being prepare' xato — 'was being PREPARED' (V3) kerak.", stressWord: 'BEING' },
    { id: 'sp-d104-c6', en: "The decision should have been discussed more carefully.", uz: "Qaror ko'proq ehtiyotkorlik bilan muhokama qilinishi kerak edi.", grammarTip: "'Should have been + V3' — o'tmishdagi tavsiya + pasiv. 'Discussed' = muhokama qilingan.", commonMistake: "'The decision should have been discuss' xato — 'discussed' (V3) kerak.", stressWord: 'SHOULD' }
  ],
  scenario: {
    topic: "discussing completed projects at work",
    aiRole: "a project manager in a review meeting",
    userRole: "a team member reporting on project status",
    opening: "The deadline is Friday. Has the report been submitted yet? What still needs to be done?",
    goalUz: "Passive voice ni murakkab ish muhitida qo'llang.",
  },
}

const day105: SpeakingDay = {
  day: 105, cefr: 'B2',
  title: "Hedging",
  subtitle: "Ehtiyotkorlik",
  goalUz: "It seems, might, perhaps bilan ehtiyotkor gapirasiz.",
  estMinutes: 15,
  linkedLessonId: 'hedging-b2',
  grammarPoint: 'it seems/might/perhaps',
  vocab: [
    { en: 'seem', uz: 'ko\'rinish', example: 'It seems like a good idea.' },
    { en: 'might', uz: 'mumkin', example: 'He might come later.' },
    { en: 'perhaps', uz: 'ekan', example: 'Perhaps we should wait.' },
    { en: 'possibly', uz: 'mumkin', example: 'This is possibly the best option.' }
  ],
  pronunciationFocus: {
    sound: '/z/',
    ipaExample: '/z/ — seems, is',
    tipUz: "Lablar yoyiladi.",
    tipEn: "Lips spread.",
  },
  recycledChunkIds: ['sp-d39-c3', 'sp-d77-c3', 'sp-d88-c5', 'sp-d47-c4', 'sp-d11-c6'],
  chunks: [
    { id: 'sp-d105-c1', en: "It seems that the project will be delayed.", uz: "Loyiha kechiktiriladigan tuyuladi.", grammarTip: "'It seems that' = tuyuladi, ehtimol bor. Ehtiyotkor nutq — aniq emasligini bildiradi.", commonMistake: "'It seems the project will be delayed' — 'that' tushirilishi mumkin, lekin rasmiy yozuvda yaxshiroq.", stressWord: 'SEEMS' },
    { id: 'sp-d105-c2', en: "Perhaps the weather will improve tomorrow.", uz: "Ehtimol ertaga ob-havo yaxshilanadi.", grammarTip: "'Perhaps' = ehtimol (hedging). Jumlanning boshida yoki oxirida ishlatiladi.", commonMistake: "'Perhaps' va 'maybe' bir xil, lekin 'perhaps' ko'proq rasmiy.", stressWord: 'PERHAPS' },
    { id: 'sp-d105-c3', en: "The results might indicate a different conclusion.", uz: "Natijalar boshqa xulosaga ishora qilishi mumkin.", grammarTip: "'Might indicate' = ishora qilishi mumkin. 'Might' — 'may' dan kamroq ishonchli.", commonMistake: "'The results might indicates' xato — modal dan keyin fe'lning asosiy shakli: 'might INDICATE'.", stressWord: 'MIGHT' },
    { id: 'sp-d105-c4', en: "It appears that the experiment was successful.", uz: "Tajriba muvaffaqiyatli bo'lgan tuyuladi.", grammarTip: "'It appears that' = tuyuladi, ko'rinadi. 'It seems' bilan bir xil ma'no.", commonMistake: "'It appears the experiment' — 'that' tushirilishi mumkin, lekin yaxshiroq.", stressWord: 'APPEARS' },
    { id: 'sp-d105-c5', en: "This could potentially affect the overall results.", uz: "Bu umumiy natijalarga ta'sir qilishi mumkin.", grammarTip: "'Could potentially' = potensial ta'sir qilishi mumkin. Ikkita hedging birgalikda.", commonMistake: "'This could potentially affects' xato — 'could' dan keyin 'affect' (asosiy shakl).", stressWord: 'POTENTIALLY' },
    { id: 'sp-d105-c6', en: "It is likely that prices will rise next year.", uz: "Narxlar kelasi oyga ko'tarilishi ehtimoli bor.", grammarTip: "'It is likely that' = ehtimoli bor. 'Likely' = ehtimol (sifat sifatida).", commonMistake: "'It is likely prices will rise' — 'that' tushirilishi mumkin, lekin rasmiy yozuvda yaxshiroq.", stressWord: 'LIKELY' }
  ],
  scenario: {
    topic: "discussing uncertain outcomes in business",
    aiRole: "a business partner discussing market trends",
    userRole: "an analyst presenting findings",
    opening: "The market is changing fast. What do you think will happen to our industry next year?",
    goalUz: "Ehtiyotkorlik bilan kelajak haqida bashorat qiling.",
  },
}

const day106: SpeakingDay = {
  day: 106, cefr: 'B2',
  title: "Complex Prepositions",
  subtitle: "Murakkab predloglar",
  goalUz: "In spite of, on account of bilan murakkab predloglarni ishlatasiz.",
  estMinutes: 15,
  linkedLessonId: 'complex-prepositions-b2',
  grammarPoint: 'in spite of / on account of',
  vocab: [
    { en: 'despite', uz: 'qaramay', example: 'Despite the rain we went out.' },
    { en: 'although', uz: 'garchi', example: 'Although it was late she kept working.' },
    { en: 'however', uz: 'biroq', example: 'It was expensive however it was worth it.' },
    { en: 'moreover', uz: 'shuningdek', example: 'Moreover the results were impressive.' }
  ],
  pronunciationFocus: {
    sound: '/ð/',
    ipaExample: '/ð/ — although, the',
    tipUz: "Tishlar orasida.",
    tipEn: "Between the teeth.",
  },
  recycledChunkIds: ['sp-d25-c4', 'sp-d82-c3', 'sp-d85-c3', 'sp-d54-c1', 'sp-d14-c3'],
  chunks: [
    { id: 'sp-d106-c1', en: "In spite of the rain, we went for a walk.", uz: "Yomg'irga qaramay, biz sayrga chiqdik.", grammarTip: "'In spite of' = garchi, qarama-qarshilik bildiradi. + ot yoki V-ing.", commonMistake: "'In spite of the rain we went' — vergul qo'yish yaxshiroq: 'In spite of the rain, we went'.", stressWord: 'SPITE' },
    { id: 'sp-d106-c2', en: "On account of the traffic, we arrived late.", uz: "Trafik tufayli, kechikib yetib kelib.", grammarTip: "'On account of' = sababli, tufayli. Rasmiy uslub. + ot yoki V-ing.", commonMistake: "'Because of' va 'on account of' bir xil, lekin 'on account of' ko'proq rasmiy.", stressWord: 'ACCOUNT' },
    { id: 'sp-d106-c3', en: "Despite being tired, she finished the project.", uz: "Charchagan bo'lsa-da, loyihani tugatdi.", grammarTip: "'Despite + V-ing' = qarama-qarshilik. 'Despite' + gerund yoki ot. 'In spite of' bilan bir xil.", commonMistake: "'Despite of being tired' xato — 'despite' dan keyin 'of' qo'yilmaydi.", stressWord: 'DESPITE' },
    { id: 'sp-d106-c4', en: "Due to the bad weather, the match was cancelled.", uz: "Yomon ob-havo tufayli, o'yin bekor qilindi.", grammarTip: "'Due to' = sababli, tufayli. 'On account of' bilan bir xil. Rasmiy uslub.", commonMistake: "'Due to' va 'because of' bir xil, lekin 'due to' ko'proq rasmiy.", stressWord: 'DUE' },
    { id: 'sp-d106-c5', en: "In addition to his salary, he receives bonuses.", uz: "Maoshidan tashqari, u bonuslar oladi.", grammarTip: "'In addition to' = qo'shimcha, tashqari. + ot yoki V-ing.", commonMistake: "'In addition to' va 'apart from' bir xil, lekin 'in addition to' ko'proq rasmiy.", stressWord: 'ADDITION' },
    { id: 'sp-d106-c6', en: "Regardless of the cost, we must proceed.", uz: "Xarajatga qaramasdan, davom etishimiz kerak.", grammarTip: "'Regardless of' = qaramasdan, farqi yo'q. 'Irrespective of' bilan bir xil.", commonMistake: "'Regardless of' va 'despite' bir xil, lekin 'regardless of' ko'proq kuchli.", stressWord: 'REGARDLESS' }
  ],
  scenario: {
    topic: "explaining reasons for a decision",
    aiRole: "a colleague asking why you made a choice",
    userRole: "someone explaining a complex decision",
    opening: "I heard you turned down the promotion. Despite the higher salary, why did you decide against it?",
    goalUz: "Murakkab predloglar bilan qaroringizning sabablarini tushuntiring.",
  },
}

const day107: SpeakingDay = {
  day: 107, cefr: 'B2',
  title: "Cohesion",
  subtitle: "Bog'lovchi tizim",
  goalUz: "However, furthermore, moreover bilan paragraflarni bog'lay olasiz.",
  estMinutes: 15,
  linkedLessonId: 'cohesion-b2',
  grammarPoint: 'linking paragraphs',
  vocab: [
    { en: 'therefore', uz: 'shuning uchun', example: 'He was tired therefore he went home.' },
    { en: 'furthermore', uz: 'bundan tashqari', example: 'Furthermore the evidence is strong.' },
    { en: 'consequently', uz: 'natijada', example: 'Consequently sales increased.' },
    { en: 'nonetheless', uz: 'shunday bo\'lsa-da', example: 'It was difficult nonetheless she succeeded.' }
  ],
  pronunciationFocus: {
    sound: '/f/',
    ipaExample: '/f/ — furthermore',
    tipUz: "Tish va lab orasidan chiqadi.",
    tipEn: "Sound between teeth and lip.",
  },
  recycledChunkIds: ['sp-d85-c3', 'sp-d86-c1', 'sp-d80-c4', 'sp-d47-c1', 'sp-d25-c1'],
  chunks: [
    { id: 'sp-d107-c1', en: "The project was successful; however, there were some challenges.", uz: "Loyiha muvaffaqiyatli bo'ldi; biroq, ba'zi qiyinchiliklar bo'ldi.", grammarTip: "'However' = biroq, lekin. Nuqtali vergul (;) dan keyin ishlatiladi. Zidlovchi bog'lovchi.", commonMistake: "'However' o'rniga 'but' — 'however' ko'proq rasmiy. 'However' dan keyin vergul.", stressWord: 'HOWEVER' },
    { id: 'sp-d107-c2', en: "The plan is effective. Furthermore, it is cost-efficient.", uz: "Reja samarali. Bundan tashqari, xarajat jihatidan ham samarali.", grammarTip: "'Furthermore' = bundan tashqari, qo'shimcha. Yangi ma'no qo'shadi. Rasmiy nutq.", commonMistake: "'Furthermore' va 'additionally' bir xil, lekin 'furthermore' ko'proq rasmiy.", stressWord: 'FURTHERMORE' },
    { id: 'sp-d107-c3', en: "The results were positive; moreover, they exceeded expectations.", uz: "Natijalar ijobiy edi; bundan tashqari, ular kutilganidan oshib ketdi.", grammarTip: "'Moreover' = bundan tashqari, ustiga. Kuchliroq qo'shimcha. Nuqtali vergul bilan.", commonMistake: "'Moreover' va 'furthermore' bir xil, lekin 'moreover' kuchliroq qo'shimcha.", stressWord: 'MOREOVER' },
    { id: 'sp-d107-c4', en: "On the one hand, it is expensive. On the other hand, it is worth it.", uz: "Bir tomondan, bu qimmat. Boshqa tomondan, bunga arziydi.", grammarTip: "'On the one hand... on the other hand' = bir tomondan... boshqa tomondan. Qarama-qarshilik.", commonMistake: "'On one hand' xato — 'the' kerak: 'on THE one hand'.", stressWord: 'HAND' },
    { id: 'sp-d107-c5', en: "In conclusion, the benefits outweigh the drawbacks.", uz: "Xulosa qilib aytganda, afzalliklar kamchiliklardan ko'proq.", grammarTip: "'In conclusion' = xulosa qilib. Yozma nutqda oxirida ishlatiladi. 'Outweigh' = ustunlik qilmoq.", commonMistake: "'In conclusion' va 'to conclude' bir xil, lekin 'in conclusion' ko'proq ishlatiladi.", stressWord: 'CONCLUSION' },
    { id: 'sp-d107-c6', en: "Similarly, the second study confirmed these findings.", uz: "Xuddi shunday, ikkinchi tadqiqot shu xulosalarni tasdiqladi.", grammarTip: "'Similarly' = xuddi shunday, o'xshash. Ikkita bir xil faktni bog'laydi.", commonMistake: "'Similarly' va 'likewise' bir xil, lekin 'similarly' ko'proq ishlatiladi.", stressWord: 'SIMILARLY' }
  ],
  scenario: {
    topic: "presenting a research paper",
    aiRole: "a conference moderator introducing you",
    userRole: "a researcher presenting findings",
    opening: "Our next speaker will present their findings on urban development. Please go ahead with your presentation.",
    goalUz: "Akademik taqdimotda bog'lovchi tizimlardan foydalanib paragraflarni bog'lang.",
  },
}

const day108: SpeakingDay = {
  day: 108, cefr: 'B2',
  title: "Register",
  subtitle: "Formal vs informal",
  goalUz: "Formal va informal nutq farqlarini bilasiz.",
  estMinutes: 15,
  linkedLessonId: 'register-b2',
  grammarPoint: 'formal vs informal',
  vocab: [
    { en: 'formal', uz: 'rasmiy', example: 'Please use formal language.' },
    { en: 'informal', uz: 'norasmiy', example: 'This is an informal meeting.' },
    { en: 'register', uz: 'til darajasi', example: 'Choose the right register.' },
    { en: 'tone', uz: 'ohang', example: 'The tone of the letter is polite.' }
  ],
  pronunciationFocus: {
    sound: '/ə/',
    ipaExample: '/ə/ — formal, register',
    tipUz: "Qisqa va yumshoq tovush.",
    tipEn: "Short and soft sound.",
  },
  recycledChunkIds: ['sp-d58-c6', 'sp-d59-c1', 'sp-d35-c1', 'sp-d46-c6', 'sp-d10-c4'],
  chunks: [
    { id: 'sp-d108-c1', en: "Could you kindly provide me with the information?", uz: "Iltimos, menga ma'lumotni taqdim eta olasizmi?", grammarTip: "'Could you kindly' = iltimos (rasmiy). Informal: 'Can you give me...?' Farq — madaniyat.", commonMistake: "'Could you kindly provide me the information' xato — 'provide me WITH the information'.", stressWord: 'KINDLY' },
    { id: 'sp-d108-c2', en: "I would like to inquire about the available positions.", uz: "Bo'sh lavozimlar haqida so'rashni xohlar edim.", grammarTip: "'I would like to inquire' = so'rashni xohlar edim (rasmiy). Informal: 'I wanna ask about jobs'.", commonMistake: "'I want to inquire' o'rniga 'I would like to inquire' — ko'proq rasmiy.", stressWord: 'INQUIRE' },
    { id: 'sp-d108-c3', en: "We regret to inform you that your application has been rejected.", uz: "Afsus bilan sizning arizangiz rad etilganini ma'lum qilamiz.", grammarTip: "'We regret to inform you' = afsus bilan ma'lum qilamiz. Rasmiy xat uslubi.", commonMistake: "'We are sorry to tell you' o'rniga 'we regret to inform you' — ko'proq rasmiy.", stressWord: 'REGRET' },
    { id: 'sp-d108-c4', en: "I appreciate your prompt response to this matter.", uz: "Bu masalaga tezkor javobingiz uchun minnatdorman.", grammarTip: "'I appreciate your prompt response' = tezkor javob uchun minnatdorman. Rasmiy minnatdorlik.", commonMistake: "'Thanks for your quick reply' o'rniga 'I appreciate your prompt response' — rasmiy.", stressWord: 'APPRECIATE' },
    { id: 'sp-d108-c5', en: "Hey, wanna grab a coffee later?", uz: "Ey, keyinroq qahva ichishga boramizmi?", grammarTip: "'Wanna' = 'want to' (informal). 'Grab a coffee' = qahva ichish. Do'stlar orasida.", commonMistake: "'Wanna' faqat norasmiy nutqda ishlatiladi. Rasmiy: 'would you like to'.", stressWord: 'WANNA' },
    { id: 'sp-d108-c6', en: "It was nice chatting with you. Let's catch up soon!", uz: "Suhbatlashish yaxshi edi. Tez orada gaplashaylik!", grammarTip: "'Catch up' = yangiliklarni bilish, gaplashish. Norasmiy xayrlashish.", commonMistake: "'Catch up' va 'meet up' bir xil emas — 'catch up' = yangiliklarni bilish.", stressWord: 'CATCH' }
  ],
  scenario: {
    topic: "navigating formal and informal situations",
    aiRole: "a friend helping you prepare for a job interview",
    userRole: "someone practicing formal vs informal language",
    opening: "Your interview is tomorrow. Remember — use formal language with the interviewer, but be natural. Let's practice both styles.",
    goalUz: "Formal va informal nutq farqlarini bilan suhbat olib boring.",
  },
}

const day109: SpeakingDay = {
  day: 109, cefr: 'B2',
  title: "Complex Sentences",
  subtitle: "Murakkab gaplar",
  goalUz: "Noun, relative, adverbial clauses bilan murakkab gaplar tuzasiz.",
  estMinutes: 15,
  linkedLessonId: 'complex-sentences-b2',
  grammarPoint: 'noun/relative/adverbial clauses',
  vocab: [
    { en: 'although', uz: 'garchi', example: 'Although it was raining we played.' },
    { en: 'because', uz: 'chunki', example: 'I stayed because I was tired.' },
    { en: 'which', uz: 'qaysi', example: 'The book which I read was great.' },
    { en: 'who', uz: 'kim', example: 'The teacher who taught me was kind.' }
  ],
  pronunciationFocus: {
    sound: '/z/',
    ipaExample: '/z/ — which, is',
    tipUz: "Lablar yoyiladi.",
    tipEn: "Lips spread.",
  },
  recycledChunkIds: ['sp-d85-c3', 'sp-d87-c1', 'sp-d50-c1', 'sp-d24-c1', 'sp-d25-c4'],
  chunks: [
    { id: 'sp-d109-c1', en: "What she said surprised everyone at the meeting.", uz: "Uning aytganlari yig'ilishdagi hammalarni hayratga solishi.", grammarTip: "Noun clause: 'What she said' — butun gap ot o'rnida. 'Surprised' asosiy fe'l.", commonMistake: "'What she said surprised everyone' — 'that' tushiriladi: 'That what she said' xato.", stressWord: 'WHAT' },
    { id: 'sp-d109-c2', en: "The woman who lives next door is a doctor.", uz: "Yonimizdagi ayol shifokor.", grammarTip: "Relative clause: 'who lives next door' — otning oxirida keladi. 'Who' = odamlar uchun.", commonMistake: "'The woman who lives next door' — 'who' o'rniga 'which' qo'ymang (which = narsalar).", stressWord: 'WHO' },
    { id: 'sp-d109-c3', en: "I'll call you when I arrive at the airport.", uz: "Aeroportga yetib kelganimda sizga qo'ng'iroq qilaman.", grammarTip: "Adverbial clause: 'when I arrive' — vaqtni bildiradi. 'When' dan keyin Present Simple.", commonMistake: "'When I will arrive' xato — 'when' dan keyin zamon almashmaydi: 'when I ARRIVE'.", stressWord: 'WHEN' },
    { id: 'sp-d109-c4', en: "The book that I bought yesterday was very interesting.", uz: "Kecha sotib olgan kitob juda qiziqarli edi.", grammarTip: "Relative clause: 'that I bought yesterday' — 'that' o'rniga 'which' ham ishlatiladi.", commonMistake: "'The book what I bought' xato — 'that' yoki 'which' kerak (narsalar uchun).", stressWord: 'THAT' },
    { id: 'sp-d109-c5', en: "Although he was tired, he continued working.", uz: "Garchi charchagan bo'lsa-da, ishlashda davom etdi.", grammarTip: "Adverbial clause: 'although he was tired' — qarama-qarshilik. 'Although' = garchi.", commonMistake: "'Although he was tired he continued' — vergul qo'ying: 'Although he was tired, he continued'.", stressWord: 'ALTHOUGH' },
    { id: 'sp-d109-c6', en: "The reason why she left is still unknown.", uz: "Uning ketgan sababi hali ham noma'lum.", grammarTip: "Relative clause: 'why she left' — sababni bildiradi. 'Why' = sababli. 'Is still unknown' = hali noma'lum.", commonMistake: "'The reason why she left is still unknown' — 'the reason why' tushirmang: 'the reason she left'.", stressWord: 'WHY' }
  ],
  scenario: {
    topic: "explaining a complex topic to a colleague",
    aiRole: "a junior colleague who needs clarification",
    userRole: "a senior colleague explaining a complex concept",
    opening: "I'm confused about how the new policy works. Can you explain it to me step by step?",
    goalUz: "Murakkab mavzuni tushuntirish uchun noun, relative va adverbial clause'lardan foydalaning.",
  },
}

const day110: SpeakingDay = {
  day: 110, cefr: 'B2',
  title: "Advanced Modals",
  subtitle: "Murakkab modal fe'llar",
  goalUz: "Must have, could have, should have bilan o'tmish haqida gapirasiz.",
  estMinutes: 15,
  linkedLessonId: 'advanced-modals-b2',
  grammarPoint: 'must have/could have/should have',
  vocab: [
    { en: 'must', uz: 'kerak', example: 'You must follow the rules.' },
    { en: 'could', uz: 'qila oladi', example: 'He could speak three languages.' },
    { en: 'should', uz: 'kerak', example: 'You should exercise daily.' },
    { en: 'might', uz: 'mumkin', example: 'It might rain later.' }
  ],
  pronunciationFocus: {
    sound: '/m/',
    ipaExample: '/m/ — must, might',
    tipUz: "Lablar yopiladi.",
    tipEn: "Lips close together.",
  },
  recycledChunkIds: ['sp-d63-c2', 'sp-d88-c1', 'sp-d89-c1', 'sp-d20-c1', 'sp-d46-c1'],
  chunks: [
    { id: 'sp-d110-c1', en: "She must have forgotten about the meeting.", uz: "U yig'ilishni unutgan bo'lishi kerak.", grammarTip: "'Must have + V3' = ehtimol shunday bo'lgan (ishonch bilan taxmin). 'Forgotten' = unutgan.", commonMistake: "'She must forgotten' xato — 'must HAVE forgotten' kerak (perfect).", stressWord: 'HAVE' },
    { id: 'sp-d110-c2', en: "He could have passed the exam if he had studied.", uz: "U o'qiganida imtihondan o'ta olardi.", grammarTip: "'Could have + V3' = o'tmishda imkoniyat bor edi. 'Passed' = o'tgan.", commonMistake: "'He could passed' xato — 'could HAVE passed' kerak.", stressWord: 'COULD' },
    { id: 'sp-d110-c3', en: "You should have told me earlier.", uz: "Sen ertaroq aytmagan eding.", grammarTip: "'Should have + V3' = o'tmishda qilishi kerak edi (lekin qilmadi). 'Told' = aytdi.", commonMistake: "'You should told me' xato — 'should HAVE told' kerak.", stressWord: 'SHOULD' },
    { id: 'sp-d110-c4', en: "They must have arrived by now.", uz: "Ular hozirgacha yetib kelgan bo'lishlari kerak.", grammarTip: "'Must have + V3' = ehtimol shunday. 'By now' = hozirgacha. Ishonch bilan taxmin.", commonMistake: "'They must arrived' xato — 'must HAVE arrived' kerak.", stressWord: 'MUST' },
    { id: 'sp-d110-c5', en: "She could have helped you, but she didn't want to.", uz: "U sizga yordam berardi, lekin xohlamadi.", grammarTip: "'Could have + V3' = imkoniyat bor edi (lekin amalga oshirmadi). 'But' bilan zid.", commonMistake: "'She could helped' xato — 'could HAVE helped' kerak.", stressWord: 'COULD' },
    { id: 'sp-d110-c6', en: "We should have checked the schedule before leaving.", uz: "Ketishdan oldin jadvalni tekshirib chiqishimiz kerak edi.", grammarTip: "'Should have + V3' = o'tmishda qilishi kerak edi. 'Before leaving' = ketishdan oldin.", commonMistake: "'We should checked' xato — 'should HAVE checked' kerak.", stressWord: 'SHOULD' }
  ],
  scenario: {
    topic: "speculating about past events",
    aiRole: "a detective reconstructing a crime scene",
    userRole: "a witness providing testimony",
    opening: "We need to figure out what happened last night. Based on the evidence, what must have occurred?",
    goalUz: "Must have, could have, should have bilan o'tmish haqida taxmin qiling.",
  },
}

const day111: SpeakingDay = {
  day: 111, cefr: 'B2',
  title: "Contrastive Structures",
  subtitle: "Qarama-qarshilik",
  goalUz: "Whereas, while, although bilan qarama-qarshilik bildirasiz.",
  estMinutes: 15,
  linkedLessonId: 'contrastive-structures-b2',
  grammarPoint: 'whereas/while/although',
  vocab: [
    { en: 'whereas', uz: 'holbuki', example: 'He likes tea whereas I prefer coffee.' },
    { en: 'while', uz: 'vaqtida', example: 'While I was sleeping the phone rang.' },
    { en: 'although', uz: 'garchi', example: 'Although it was hard she finished.' },
    { en: 'despite', uz: 'qaramay', example: 'Despite the cost we bought it.' }
  ],
  pronunciationFocus: {
    sound: '/w/',
    ipaExample: '/w/ — whereas, while',
    tipUz: "Lablar bilan yasaladi.",
    tipEn: "Made with the lips.",
  },
  recycledChunkIds: ['sp-d14-c3', 'sp-d25-c2', 'sp-d82-c3', 'sp-d56-c5', 'sp-d47-c2'],
  chunks: [
    { id: 'sp-d111-c1', en: "She likes coffee, whereas he prefers tea.", uz: "U qahvani yoqtiradi, garchi u choyni afzal ko'radi.", grammarTip: "'Whereas' = garchi, aksincha. Ikkita qarama-qarshilikni bog'laydi. Rasmiy uslub.", commonMistake: "'Whereas' va 'while' bir xil, lekin 'whereas' ko'proq rasmiy.", stressWord: 'WHEREAS' },
    { id: 'sp-d111-c2', en: "While I was cooking, my brother was watching TV.", uz: "Men ovqat tayyorlayotganimda, aka televizor ko'rayotgan edi.", grammarTip: "'While' = vaqt davomida. Ikkita bir vaqtda bo'lgan harakat. 'While' + Past Continuous.", commonMistake: "'While I cooked' o'rniga 'while I was cooking' — davomiylik uchun Continuous kerak.", stressWord: 'WHILE' },
    { id: 'sp-d111-c3', en: "Although it was raining, we decided to go out.", uz: "Garchi yog'moqda bo'lsa-da, biz tashqariga chiqishga qaror qildik.", grammarTip: "'Although' = garchi, qarama-qarshilik. 'Although' dan keyin to'liq gap keladi.", commonMistake: "'Although it was raining we decided' — vergul qo'ying: 'Although it was raining, we decided'.", stressWord: 'ALTHOUGH' },
    { id: 'sp-d111-c4', en: "He is smart but he doesn't work hard.", uz: "U aqlli, lekin qattiq ishlamaydi.", grammarTip: "'But' = lekin (eng oddiy qarama-qarshilik). 'But' dan keyin zid fikr keladi.", commonMistake: "'But' va 'however' bir xil, lekin 'however' ko'proq rasmiy.", stressWord: 'BUT' },
    { id: 'sp-d111-c5', en: "Whereas the north is cold, the south is warm.", uz: "Shimoli sovuq bo'lsa, janub iliqlik.", grammarTip: "'Whereas' = aksincha (ikkita taqqoslash). 'North' va 'south' qarama-qarshilik.", commonMistake: "'Whereas the north is cold the south is warm' — vergul qo'ying: '..., whereas...'.", stressWord: 'WHEREAS' },
    { id: 'sp-d111-c6', en: "Even though he studied hard, he failed the exam.", uz: "Qattiq o'qigan bo'lsa-da, imtihondan o'ta olmadi.", grammarTip: "'Even though' = garchi ('although' dan kuchliroq). 'Even though' + Past Simple.", commonMistake: "'Even though' va 'despite' bir xil, lekin 'even though' dan keyin gap, 'despite' dan keyin ot/V-ing.", stressWord: 'EVEN' }
  ],
  scenario: {
    topic: "comparing two different approaches",
    aiRole: "a debate moderator",
    userRole: "a participant comparing viewpoints",
    opening: "Today's topic is remote work vs office work. What are the key differences you've noticed?",
    goalUz: "Whereas, while, although bilan ikki yondashuvni taqqoslang.",
  },
}

const day112: SpeakingDay = {
  day: 112, cefr: 'B2',
  title: "Inversion",
  subtitle: "Teskari tartib",
  goalUz: "Never have I seen... bilan kuchli ta'sir yasaysiz.",
  estMinutes: 15,
  linkedLessonId: 'inversion-b2',
  grammarPoint: 'Never have I seen...',
  vocab: [
    { en: 'never', uz: 'hech qachon', example: 'Never have I seen such beauty.' },
    { en: 'hardly', uz: 'deyarli', example: 'Hardly had I arrived when it started.' },
    { en: 'seldom', uz: 'kamdan-kam', example: 'Seldom does he complain.' },
    { en: 'rarely', uz: 'kamdan-kam', example: 'Rarely do we meet.' }
  ],
  pronunciationFocus: {
    sound: '/n/',
    ipaExample: '/n/ — never, never',
    tipUz: "Burun orqasidan chiqadi.",
    tipEn: "Sound from the nose.",
  },
  recycledChunkIds: ['sp-d87-c3', 'sp-d89-c3', 'sp-d49-c3', 'sp-d22-c6', 'sp-d52-c5'],
  chunks: [
    { id: 'sp-d112-c1', en: "Never have I seen such a beautiful sunset.", uz: "Hech qachon buncha chiroyli botishni ko'rmagan edim.", grammarTip: "'Never have I + V3' — teskari tartib (inversion). Kuchli ta'kid. 'Seen' = V3.", commonMistake: "'I have never seen' o'rniga 'Never have I seen' — inversion kuchli ta'kid uchun.", stressWord: 'NEVER' },
    { id: 'sp-d112-c2', en: "Rarely does he arrive on time.", uz: "Kamdan-kam o'z vaqtida keladi.", grammarTip: "'Rarely does he + V' — teskari tartib. 'Rarely' = kamdan-kam. 'Does he arrive' (teskari).", commonMistake: "'He rarely arrives' o'rniga 'Rarely does he arrive' — inversion kuchli ta'kid uchun.", stressWord: 'RARELY' },
    { id: 'sp-d112-c3', en: "Seldom have we experienced such hospitality.", uz: "Kamdan-kam buncha mehmondo'stlikni his qilganmiz.", grammarTip: "'Seldom have we + V3' — teskari tartib. 'Seldom' = kamdan-kam ('rarely' bilan bir xil).", commonMistake: "'We have seldom experienced' o'rniga 'Seldom have we experienced' — inversion.", stressWord: 'SELDOM' },
    { id: 'sp-d112-c4', en: "Not only did she win the race, but she also broke the record.", uz: "U nafaqat poyevni yutdi, balki rekordni ham buzdi.", grammarTip: "'Not only did she + V, but also...' — teskari tartib. 'Not only... but also' = nafaqat... balki.", commonMistake: "'Not only she won' xato — 'Not only DID she win' (teskari tartib).", stressWord: 'NOT' },
    { id: 'sp-d112-c5', en: "Hardly had I sat down when the phone rang.", uz: "O'tirmasimdan telefon jiringladi.", grammarTip: "'Hardly had I + V3 when...' — zudlik bildiradi. 'Hardly... when' = darhol.", commonMistake: "'I had hardly sat down' o'rniga 'Hardly had I sat down' — inversion.", stressWord: 'HARDLY' },
    { id: 'sp-d112-c6', en: "Under no circumstances should you reveal this information.", uz: "Hech qanday holatda bu ma'lumotni oshkor qilmaslik kerak.", grammarTip: "'Under no circumstances should you + V' — taqiqlash. 'Should you' = teskari tartib.", commonMistake: "'You should not reveal' o'rniga 'Under no circumstances should you reveal' — kuchli taqiqlash.", stressWord: 'SHOULD' }
  ],
  scenario: {
    topic: "expressing strong opinions in a debate",
    aiRole: "a debate opponent challenging your views",
    userRole: "a debater making strong arguments",
    opening: "I disagree with your position. Can you defend your argument with stronger emphasis?",
    goalUz: "Inversion orqali kuchli ta'sirli argumentlar yarating.",
  },
}

const day113: SpeakingDay = {
  day: 113, cefr: 'B2',
  title: "Cleft Sentences",
  subtitle: "Kuchaytirgan gaplar",
  goalUz: "It is... that... bilan ma'noni kuchaytirasiz.",
  estMinutes: 15,
  linkedLessonId: 'cleft-sentences-b2',
  grammarPoint: 'It is... that...',
  vocab: [
    { en: 'it', uz: 'bu', example: 'It is the weather that I love.' },
    { en: 'that', uz: 'ki', example: 'It was John that called.' },
    { en: 'what', uz: 'nima', example: 'What I need is sleep.' },
    { en: 'reason', uz: 'sabab', example: 'The reason is that he was late.' }
  ],
  pronunciationFocus: {
    sound: '/t/',
    ipaExample: '/t/ — it, that',
    tipUz: "Til tishlarga tegadi.",
    tipEn: "Tongue touches the teeth.",
  },
  recycledChunkIds: ['sp-d113-c3', 'sp-d85-c1', 'sp-d6-c1', 'sp-d48-c3', 'sp-d24-c4'],
  chunks: [
    { id: 'sp-d113-c1', en: "It was John who broke the window.", uz: "Derazani sindirgan Jon edi.", grammarTip: "'It is/was + S + who/that' — cleft sentence. Kuchli ta'kid. 'Who' = odamlar uchun.", commonMistake: "'John broke the window' o'rniga 'It was John who broke' — kuchli ta'kid.", stressWord: 'WAS' },
    { id: 'sp-d113-c2', en: "It is the price that concerns me the most.", uz: "Meni eng ko'p qiziqtirgan narx.", grammarTip: "'It is + ot + that' — cleft sentence. Narx haqida ta'kid. 'Concerns me' = qiziqtiradi.", commonMistake: "'The price concerns me most' o'rniga 'It is the price that concerns me most'.", stressWord: 'PRICE' },
    { id: 'sp-d113-c3', en: "What I need is a good night's sleep.", uz: "Menga kerak narsa — yaxshi uxlash.", grammarTip: "'What I need is...' — cleft sentence. 'What' = o'sha narsa. Kuchli ta'kid.", commonMistake: "'I need a good night's sleep' o'rniga 'What I need is...' — kuchli ta'kid.", stressWord: 'WHAT' },
    { id: 'sp-d113-c4', en: "It was in London that they first met.", uz: "Ular birinchi marta Londonda uchrashdi.", grammarTip: "'It was in London that...' — joy haqida ta'kid. Cleft sentence.", commonMistake: "'They first met in London' o'rniga 'It was in London that they first met' — joy ta'kidi.", stressWord: 'LONDON' },
    { id: 'sp-d113-c5', en: "It is not what you say but how you say it that matters.", uz: "Muhimi nimani aytishingiz emas, qanday aytishingiz.", grammarTip: "'It is not... but...' — taqqoslash. 'That matters' = muhim bo'lgan narsa.", commonMistake: "'What you say matters' o'rniga 'It is not what you say but how you say it that matters'.", stressWord: 'MATTERS' },
    { id: 'sp-d113-c6', en: "It was the manager who made the final decision.", uz: "Yakuniy qarorni qabul qilgan menejer edi.", grammarTip: "'It was + S + who + V' — kim qilganini ta'kidlash. 'Final decision' = yakuniy qaror.", commonMistake: "'The manager made the final decision' o'rniga 'It was the manager who made' — ta'kid.", stressWord: 'WHO' }
  ],
  scenario: {
    topic: "emphasizing specific information in a presentation",
    aiRole: "a conference attendee asking questions",
    userRole: "a presenter emphasizing key points",
    opening: "Your presentation was interesting. But who specifically made the final decision on the budget?",
    goalUz: "Cleft sentences bilan muhim ma'lumotlarni ta'kidlang.",
  },
}

const day114: SpeakingDay = {
  day: 114, cefr: 'B2',
  title: "Punctuation",
  subtitle: "Belgilar",
  goalUz: "Semicolons, colons, dashes bilan yozuv sifatini oshirasiz.",
  estMinutes: 15,
  linkedLessonId: 'punctuation-b2',
  grammarPoint: 'semicolons, colons, dashes',
  vocab: [
    { en: 'semicolon', uz: 'nuqta-vergul', example: 'Use a semicolon to join clauses.' },
    { en: 'colon', uz: 'ikki nuqta', example: 'A colon introduces a list.' },
    { en: 'dash', uz: 'chiziq', example: 'A dash adds emphasis.' },
    { en: 'comma', uz: 'vergul', example: 'A comma separates items.' }
  ],
  pronunciationFocus: {
    sound: '/s/',
    ipaExample: '/s/ — semicolon',
    tipUz: "Tishlar orasidan chiqadi.",
    tipEn: "Sound between the teeth.",
  },
  recycledChunkIds: ['sp-d85-c2', 'sp-d25-c1', 'sp-d48-c1', 'sp-d18-c4', 'sp-d44-c1'],
  chunks: [
    { id: 'sp-d114-c1', en: "She loves reading; he prefers watching films.", uz: "U kitob o'qishni yoqtiradi; u film ko'rishni afzal ko'radi.", grammarTip: "Semicolon (;) — bog'lovchi so'z o'rnida ikki mustaqil gapni bog'laydi.", commonMistake: "'She loves reading, he prefers' xato — semicolon (;) kerak, vergul emas.", stressWord: 'SEMICOLON' },
    { id: 'sp-d114-c2', en: "There is one thing I need: a cup of coffee.", uz: "Menga kerak narsa bitta: bir piyola qahva.", grammarTip: "Colon (:) — tushuntirish yoki ro'yxatdan oldin ishlatiladi. 'One thing I need:' dan keyin javob.", commonMistake: "'There is one thing I need, a cup of coffee' — colon (:) kerak, vergul emas.", stressWord: 'COLON' },
    { id: 'sp-d114-c3', en: "The results — as we expected — were positive.", uz: "Natijalar — kutganimizdek — ijobiy edi.", grammarTip: "Dash (—) — qo'shimcha ma'loni ajratadi. Ikkita dash bilan orasidagi gap qo'shimcha.", commonMistake: "'The results, as we expected, were positive' — dash (—) ko'proq ta'kid beradi.", stressWord: 'DASH' },
    { id: 'sp-d114-c4', en: "I need to buy milk, eggs, and bread.", uz: "Men sut, tuxum va non sotib olishim kerak.", grammarTip: "Vergul (,) — ro'yxatda elementlarni ajratadi. Oxirgi 'and' dan oldin vergul (oxirgi ixtiyoriy).", commonMistake: "'I need to buy milk eggs and bread' xato — vergullar kerak: 'milk, eggs, and bread'.", stressWord: 'COMMA' },
    { id: 'sp-d114-c5', en: "The company's profits increased by 20% last year.", uz: "Kompaniya foydasi kechagi yil 20% ga oshdi.", grammarTip: "Apostrof (') — egalik. 'Company's' = kompaniyaning. 'Profits' = foyda.", commonMistake: "'The companys profits' xato — 'company's' (apostrof kerak).", stressWord: 'APOSTROPHE' },
    { id: 'sp-d114-c6', en: "The meeting is at 3 p.m. — please be on time.", uz: "Yig'ilish soat 15:00 da — iltimos, o'z vaqtida bo'ling.", grammarTip: "Dash (—) — ogohlantirish yoki qo'shimcha ma'no. 'Please be on time' = o'z vaqtida bo'ling.", commonMistake: "'The meeting is at 3pm please be on time' — dash (—) yoki nuqta kerak.", stressWord: 'DASH' }
  ],
  scenario: {
    topic: "editing a formal document",
    aiRole: "a senior editor reviewing your article",
    userRole: "a writer learning proper punctuation",
    opening: "Your article needs some punctuation fixes. Let me show you where semicolons, colons, and dashes should go.",
    goalUz: "Rasmiy hujjatda vergul, nuqta-vergul va chiziqlarni to'g'ri ishlating.",
  },
}

const day115: SpeakingDay = {
  day: 115, cefr: 'B2',
  title: "Academic Collocations",
  subtitle: "Akademik collocations",
  goalUz: "Conduct research, draw conclusions bilan akademik so'zlashuvni o'rganasiz.",
  estMinutes: 15,
  linkedLessonId: 'academic-collocations-b2',
  grammarPoint: 'conduct research, draw conclusions',
  vocab: [
    { en: 'research', uz: 'tadqiqot', example: 'We conducted research on the topic.' },
    { en: 'conclusion', uz: 'xulosa', example: 'The conclusion was surprising.' },
    { en: 'evidence', uz: 'dalil', example: 'The evidence supports the theory.' },
    { en: 'analysis', uz: 'tahlil', example: 'The analysis revealed new data.' }
  ],
  pronunciationFocus: {
    sound: '/k/',
    ipaExample: '/k/ — conduct',
    tipUz: "Til orqa qismidan chiqadi.",
    tipEn: "Sound from the back of the tongue.",
  },
  recycledChunkIds: ['sp-d18-c1', 'sp-d80-c2', 'sp-d41-c3', 'sp-d45-c2', 'sp-d85-c1'],
  chunks: [
    { id: 'sp-d115-c1', en: "We conducted extensive research on the topic.", uz: "Biz bu mavzu bo'yicha keng qamrovli tadqiqot o'tkazdik.", grammarTip: "'Conduct research' = tadqiqot o'tkazmoq. 'Conduct' + research/study/survey — akademik collocation.", commonMistake: "'We made research' xato — 'conducted research' kerak. 'Conduct' tadqiqot bilan.", stressWord: 'CONDUCTED' },
    { id: 'sp-d115-c2', en: "The study drew important conclusions from the data.", uz: "Tadqiqot ma'lumotlardan muhim xulosalar chiqardi.", grammarTip: "'Draw conclusions' = xulosalar chiqarmoq. 'Drew' = 'draw' ning o'tgan zamon.", commonMistake: "'The study made conclusions' xato — 'drew conclusions' kerak.", stressWord: 'DREW' },
    { id: 'sp-d115-c3', en: "She presented her findings at the conference.", uz: "U konferensiyada o'z kashfiyotlarini taqdim etdi.", grammarTip: "'Present findings' = kashfiyotlarni taqdim etmoq. 'Presented' = taqdim etdi.", commonMistake: "'She showed her findings' o'rniga 'presented' — ko'proq akademik.", stressWord: 'PRESENTED' },
    { id: 'sp-d115-c4', en: "The researchers gathered data from 500 participants.", uz: "Olimlar 500 ishtirokchidan ma'lumot to'pladilar.", grammarTip: "'Gather data' = ma'lumot to'plamoq. 'Gathered' = to'pladi. 'Participants' = ishtirokchilar.", commonMistake: "'The researchers collected data' ham to'g'ri, lekin 'gathered' ko'proq akademik.", stressWord: 'GATHERED' },
    { id: 'sp-d115-c5', en: "This approach yields more accurate results.", uz: "Bu yondashuv aniqroq natijalar beradi.", grammarTip: "'Yield results' = natijalar beradi. 'Yields' = beradi (3-osh). Akademik uslub.", commonMistake: "'This approach gives more accurate results' o'rniga 'yields' — ko'proq akademik.", stressWord: 'YIELDS' },
    { id: 'sp-d115-c6', en: "We must take into account all the variables.", uz: "Biz barcha o'zgaruvchilarni hisobga olishimiz kerak.", grammarTip: "'Take into account' = hisobga omoq. Boshqa variant: 'consider'. 'Variables' = o'zgaruvchilar.", commonMistake: "'We must take in account' xato — 'take INTO account' (with 'into').", stressWord: 'ACCOUNT' }
  ],
  scenario: {
    topic: "presenting research findings at a seminar",
    aiRole: "a professor guiding a student's research presentation",
    userRole: "a graduate student presenting thesis findings",
    opening: "Good morning. Today we'll discuss your thesis. Walk us through your methodology and findings.",
    goalUz: "Akademik collocation'lardan foydalanib tadqiqot natijalaringizni taqdim eting.",
  },
}

const day116: SpeakingDay = {
  day: 116, cefr: 'B2',
  title: "Academic Vocabulary",
  subtitle: "Akademik lug'at",
  goalUz: "Academic word list so'zlarini ishlatasiz.",
  estMinutes: 15,
  linkedLessonId: 'academic-vocabulary-b2',
  grammarPoint: 'academic word list',
  vocab: [
    { en: 'significant', uz: 'muhim', example: 'This is a significant finding.' },
    { en: 'crucial', uz: 'hal qiluvchi', example: 'Timing is crucial.' },
    { en: 'fundamental', uz: 'asosiy', example: 'This is a fundamental principle.' },
    { en: 'relevant', uz: 'tegishli', example: 'Please provide relevant examples.' }
  ],
  pronunciationFocus: {
    sound: '/θ/',
    ipaExample: '/θ/ — think, theory',
    tipUz: "Tishlar orasida.",
    tipEn: "Between the teeth.",
  },
  recycledChunkIds: ['sp-d80-c4', 'sp-d18-c4', 'sp-d47-c6', 'sp-d41-c1', 'sp-d85-c3'],
  chunks: [
    { id: 'sp-d116-c1', en: "The findings suggest a correlation between diet and health.", uz: "Kashfiyotlar diet va sog'liq o'rtasida bog'liqlik borligini ko'rsatadi.", grammarTip: "'Suggest' = ko'rsatmoq, taxmin qilmoq. 'Correlation' = bog'liqlik. Akademik so'z.", commonMistake: "'The findings suggest a correlation' — 'suggest' da 's' qo'shiladi (3-osh).", stressWord: 'CORRELATION' },
    { id: 'sp-d116-c2', en: "We need to analyze the data more thoroughly.", uz: "Biz ma'lumotlarni ko'proq chuqur tahlil qilishimiz kerak.", grammarTip: "'Analyze' = tahlil qilmoq. 'Thoroughly' = chuqur, to'liq. Akademik ravish.", commonMistake: "'We need to analysis the data' xato — 'analyze' (fe'l) kerak, 'analysis' (ot) emas.", stressWord: 'ANALYZE' },
    { id: 'sp-d116-c3', en: "This theory has been widely accepted by scholars.", uz: "Bu nazariya olimlar tomonidan keng qabul qilingan.", grammarTip: "'Widely accepted' = keng qabul qilingan. 'Scholars' = olimlar. Akademik uslub.", commonMistake: "'This theory has been widely accept' xato — 'accepted' (V3) kerak.", stressWord: 'ACCEPTED' },
    { id: 'sp-d116-c4', en: "The methodology of this study is quite innovative.", uz: "Bu tadqiqot metedologiyasi juda innovatsion.", grammarTip: "'Methodology' = metodologiya. 'Innovative' = innovatsion. Akademik sifatlar.", commonMistake: "'The method of this study' o'rniga 'methodology' — ko'proq akademik.", stressWord: 'METHODOLOGY' },
    { id: 'sp-d116-c5', en: "Further research is needed to confirm these results.", uz: "Natijalarni tasdiqlash uchun ko'proq tadqiqot kerak.", grammarTip: "'Further research' = ko'proq tadqiqot. 'Is needed' = kerak (passive). Akademik xulosa.", commonMistake: "'More research is needed' o'rniga 'further research' — ko'proq akademik.", stressWord: 'FURTHER' },
    { id: 'sp-d116-c6', en: "The evidence supports the hypothesis significantly.", uz: "Dalillar taxminni sezilarli darajada tasdiqlaydi.", grammarTip: "'Evidence' = dalil. 'Supports' = tasdiqlaydi. 'Significantly' = sezilarli darajada.", commonMistake: "'The evidence support' xato — 'evidence' (ot, 3-osh) bilan 'supports' (s) kerak.", stressWord: 'SUPPORTS' }
  ],
  scenario: {
    topic: "discussing academic research in a journal club",
    aiRole: "a fellow researcher critiquing a paper",
    userRole: "a researcher defending methodology",
    opening: "I read the paper you shared. The sample size seems small. What's your take on the methodology?",
    goalUz: "Akademik so'zlar bilan tadqiqot sifatini baholang.",
  },
}

const day117: SpeakingDay = {
  day: 117, cefr: 'B2',
  title: "Critical Thinking",
  subtitle: "Tanqidiy fikrlash",
  goalUz: "Argumentlarni baholashni o'rganasiz.",
  estMinutes: 15,
  linkedLessonId: 'critical-thinking-b2',
  grammarPoint: 'evaluating arguments',
  vocab: [
    { en: 'evaluate', uz: 'baholash', example: 'We need to evaluate the results.' },
    { en: 'argue', uz: 'dalillash', example: 'She argued her point well.' },
    { en: 'perspective', uz: 'nuqtai nazar', example: 'From my perspective it was correct.' },
    { en: 'bias', uz: 'tarafgarlik', example: 'The report shows bias.' }
  ],
  pronunciationFocus: {
    sound: '/k/',
    ipaExample: '/k/ — critical',
    tipUz: "Til orqa qismidan chiqadi.",
    tipEn: "Sound from the back of the tongue.",
  },
  recycledChunkIds: ['sp-d77-c2', 'sp-d47-c1', 'sp-d59-c1', 'sp-d86-c1', 'sp-d59-c6'],
  chunks: [
    { id: 'sp-d117-c1', en: "This argument lacks sufficient evidence to support it.", uz: "Bu argumentni qo'llab-quvvatlash uchun yetarli dalil yo'q.", grammarTip: "'Lacks sufficient evidence' = yetarli dalil yo'q. 'Lack' = kamchilik. Tanqidiy fikrlash.", commonMistake: "'This argument doesn't have enough evidence' o'rniga 'lacks sufficient evidence' — rasmiy.", stressWord: 'LACKS' },
    { id: 'sp-d117-c2', en: "We should consider both sides of the argument.", uz: "Biz argumentning ikki tomonini ham ko'rib chiqishimiz kerak.", grammarTip: "'Consider both sides' = ikki tomonni ko'rib chiqmoq. Tanqidiy fikrlashning asosi.", commonMistake: "'We should look at both sides' o'rniga 'consider' — ko'proq akademik.", stressWord: 'CONSIDER' },
    { id: 'sp-d117-c3', en: "The conclusion doesn't necessarily follow from the premises.", uz: "Xulosa tamoyillardan zarur emas.", grammarTip: "'Doesn't necessarily follow' = zarur emas. 'Premises' = tamoyillar. Mantiqiy tahlil.", commonMistake: "'The conclusion isn't right' o'rniga 'doesn't necessarily follow' — ko'proq aniqlik.", stressWord: 'FOLLOW' },
    { id: 'sp-d117-c4', en: "This study is biased towards urban populations.", uz: "Bu tadqiqot shahar aholisiga nisbatan tarafkash.", grammarTip: "'Biased towards' = tarafkash. 'Urban populations' = shahar aholisi. Tanqidiy tahlil.", commonMistake: "'This study is bias' xato — 'is biased' (passive) kerak.", stressWord: 'BIASED' },
    { id: 'sp-d117-c5', en: "We need to distinguish between correlation and causation.", uz: "Biz bog'liqlik va sababiyat o'rtasidagi farqni ajratishimiz kerak.", grammarTip: "'Distinguish between' = farqni ajratmoq. 'Correlation' = bog'liqlik, 'causation' = sababiyat.", commonMistake: "'We need to distinguish correlation and causation' xato — 'distinguish BETWEEN'.", stressWord: 'DISTINGUISH' },
    { id: 'sp-d117-c6', en: "The data can be interpreted in different ways.", uz: "Ma'lumotlarni turlicha talqin qilish mumkin.", grammarTip: "'Can be interpreted' = talqin qilish mumkin (passive). 'Interpret' = talqin qilmoq.", commonMistake: "'The data can interpret different ways' xato — 'can be INTERPRETED'.", stressWord: 'INTERPRETED' }
  ],
  scenario: {
    topic: "evaluating a controversial topic",
    aiRole: "a debate opponent presenting a counterargument",
    userRole: "a critical thinker analyzing arguments",
    opening: "Some people argue that social media does more harm than good. What's your analysis of this claim?",
    goalUz: "Argumentlarni tanqidiy fikrlash bilan baholang.",
  },
}

const day118: SpeakingDay = {
  day: 118, cefr: 'B2',
  title: "Argument Structure",
  subtitle: "Argument tuzilishi",
  goalUz: "Thesis, evidence, counterargument bilan argument yasaysiz.",
  estMinutes: 15,
  linkedLessonId: 'argument-structure-b2',
  grammarPoint: 'thesis, evidence, counterargument',
  vocab: [
    { en: 'thesis', uz: 'ilmiy ish', example: 'Her thesis was well-researched.' },
    { en: 'evidence', uz: 'dalil', example: 'The evidence supports the claim.' },
    { en: 'claim', uz: 'da\'vo', example: 'He made a strong claim.' },
    { en: 'counter', uz: 'qarshi', example: 'She offered a counter argument.' }
  ],
  pronunciationFocus: {
    sound: '/ð/',
    ipaExample: '/ð/ — the, therefore',
    tipUz: "Tishlar orasida.",
    tipEn: "Between the teeth.",
  },
  recycledChunkIds: ['sp-d77-c2', 'sp-d47-c1', 'sp-d86-c3', 'sp-d24-c1', 'sp-d25-c2'],
  chunks: [
    { id: 'sp-d118-c1', en: "My thesis is that education should be free for everyone.", uz: "Mening tezam shundaki, ta'lim hamma uchun bepul bo'lishi kerak.", grammarTip: "'My thesis is that...' = mening tezam. 'Thesis' = asosiy fikr, argument.", commonMistake: "'My thesis is' dan keyin 'that' qo'yiladi: 'My thesis is THAT education...'.", stressWord: 'THESIS' },
    { id: 'sp-d118-c2', en: "The evidence clearly supports my argument.", uz: "Dalillar aniq menim argumentimni qo'llab-quvvatlaydi.", grammarTip: "'Evidence supports' = dalillar qo'llab-quvvatlaydi. 'Clearly' = aniq. Kuchli argument.", commonMistake: "'The evidence support' xato — 'evidence' (ot, 3-osh) bilan 'supports' (s) kerak.", stressWord: 'SUPPORTS' },
    { id: 'sp-d118-c3', en: "However, some people argue that the opposite is true.", uz: "Biroq, ba'zi odamlar aksincha to'g'ri deb argument qiladi.", grammarTip: "'However' = biroq. 'Argue that' = argument qilmoq. 'Opposite' = aks.", commonMistake: "'Some people argue that' — 'argue' da 's' qo'shilmasin: 'they ARGUE'.", stressWord: 'HOWEVER' },
    { id: 'sp-d118-c4', en: "To sum up, the benefits of technology outweigh the risks.", uz: "Xulosa qilib, texnologiya afzalliklari xavflardan ustun.", grammarTip: "'To sum up' = xulosa qilib. 'Outweigh' = ustunlik qilmoq. Xulosa gap.", commonMistake: "'To sum up' va 'in conclusion' bir xil, lekin 'to sum up' ko'proq norasmiy.", stressWord: 'SUM' },
    { id: 'sp-d118-c5', en: "A strong argument requires credible sources.", uz: "Kuchli argument ishonchli manbalar talab qiladi.", grammarTip: "'Requires' = talab qiladi. 'Credible sources' = ishonchli manbalar. Argument tuzilishi.", commonMistake: "'A strong argument need' xato — 'requires' (3-osh) kerak.", stressWord: 'REQUIRES' },
    { id: 'sp-d118-c6', en: "We must address the counterargument to strengthen our position.", uz: "Biz pozitsiyamizni kuchaytirish uchun qarama-qarshi argumentga javob berishimiz kerak.", grammarTip: "'Counterargument' = qarama-qarshi argument. 'Address' = muammoni hal qilmoq.", commonMistake: "'We must answer the counterargument' o'rniga 'address' — ko'proq rasmiy.", stressWord: 'COUNTERARGUMENT' }
  ],
  scenario: {
    topic: "building a persuasive argument",
    aiRole: "a judge in a mock trial",
    userRole: "a lawyer presenting a case",
    opening: "You have five minutes to present your argument. What is your thesis, and what evidence supports it?",
    goalUz: "Thesis, evidence va counterargument bilan kuchli argument yarating.",
  },
}

const day119: SpeakingDay = {
  day: 119, cefr: 'B2',
  title: "Stance Markers",
  subtitle: "Pozitsiya belgilari",
  goalUz: "I believe, It is clear that bilan pozitsiyangizni bildirasiz.",
  estMinutes: 15,
  linkedLessonId: 'stance-markers-b2',
  grammarPoint: 'I believe/It is clear that',
  vocab: [
    { en: 'believe', uz: 'ishonish', example: 'I believe in education.' },
    { en: 'clearly', uz: 'aniq', example: 'It is clearly important.' },
    { en: 'obviously', uz: 'albatta', example: 'Obviously we need to try harder.' },
    { en: 'undoubtedly', uz: 'shubhasiz', example: 'Undoubtedly this is the best way.' }
  ],
  pronunciationFocus: {
    sound: '/b/',
    ipaExample: '/b/ — believe, but',
    tipUz: "Lablar bilan yasaladi.",
    tipEn: "Made with the lips.",
  },
  recycledChunkIds: ['sp-d77-c2', 'sp-d88-c5', 'sp-d47-c1', 'sp-d47-c2', 'sp-d17-c1'],
  chunks: [
    { id: 'sp-d119-c1', en: "I believe that education is the key to success.", uz: "Men ishonaman-ki, ta'lim muvaffaqiyat kalitidir.", grammarTip: "'I believe that' = men ishonaman-ki. Stance marker — pozitsiya bildirish.", commonMistake: "'I believe that' da 'that' tushirilishi mumkin, lekin rasmiy yozuvda yaxshiroq.", stressWord: 'BELIEVE' },
    { id: 'sp-d119-c2', en: "It is clear that climate change is a serious issue.", uz: "Aniq-ki, iqlim o'zgarishi jiddiy muammo.", grammarTip: "'It is clear that' = aniq-ki. Stance marker — o'z fikrini aniq bildirish.", commonMistake: "'Climate change is clear a serious issue' xato — 'It is clear THAT climate change...'.", stressWord: 'CLEAR' },
    { id: 'sp-d119-c3', en: "In my opinion, the government should invest more in education.", uz: "Mening fikrimcha, hukumat ta'limga ko'proq sarmoya kiritishi kerak.", grammarTip: "'In my opinion' = mening fikrimcha. Stance marker — shaxsiy fikr.", commonMistake: "'In my opinion' va 'I think' bir xil, lekin 'in my opinion' ko'proq rasmiy.", stressWord: 'OPINION' },
    { id: 'sp-d119-c4', en: "It seems to me that we need a different approach.", uz: "Menga ko'rinadiki, bizga boshqa yondashuv kerak.", grammarTip: "'It seems to me that' = menga ko'rinadiki. Ehtiyotkor stance marker.", commonMistake: "'It seems me that' xato — 'it seems TO me that' kerak.", stressWord: 'SEEMS' },
    { id: 'sp-d119-c5', en: "I would argue that technology has both advantages and disadvantages.", uz: "Men argument qilardim-ki, texnologiya afzallik va kamchiliklarga ega.", grammarTip: "'I would argue that' = men argument qilardim-ki. Yumshoqroq (would).", commonMistake: "'I argue that' o'rniga 'I would argue that' — ko'proq ehtiyotkor.", stressWord: 'WOULD' },
    { id: 'sp-d119-c6', en: "There is no doubt that practice makes perfect.", uz: "Shubha yo'q-ki, mashq qilish mukammallikka olib keladi.", grammarTip: "'There is no doubt that' = shubha yo'q-ki. Kuchli ta'kid.", commonMistake: "'There is no doubt that' — 'that' tushirilishi mumkin, lekin yaxshiroq.", stressWord: 'DOUBT' }
  ],
  scenario: {
    topic: "expressing your stance on education reform",
    aiRole: "a journalist interviewing you about education",
    userRole: "an education expert sharing your viewpoint",
    opening: "Many people say the education system needs reform. What's your position on this issue?",
    goalUz: "Stance marker'lardan foydalanib o'z pozitsiyangizni aniq bildiring.",
  },
}

const day120: SpeakingDay = {
  day: 120, cefr: 'B2',
  title: "Paraphrasing",
  subtitle: "Qayta ifodalash",
  goalUz: "Ma'noni o'zgartirmasdan qayta yozasiz.",
  estMinutes: 15,
  linkedLessonId: 'paraphrasing-b2',
  grammarPoint: 'rewriting without changing meaning',
  vocab: [
    { en: 'rephrase', uz: 'qayta ifodalash', example: 'Can you rephrase that?' },
    { en: 'synonym', uz: 'sinonim', example: 'Happy and joyful are synonyms.' },
    { en: 'equivalent', uz: 'teng', example: 'These words are equivalent.' },
    { en: 'convey', uz: 'yetkazish', example: 'I want to convey my feelings.' }
  ],
  pronunciationFocus: {
    sound: '/r/',
    ipaExample: '/r/ — rewrite, rephrase',
    tipUz: "Til osganda yasaladi.",
    tipEn: "Tongue curls up.",
  },
  recycledChunkIds: ['sp-d80-c2', 'sp-d48-c4', 'sp-d85-c4', 'sp-d47-c6', 'sp-d11-c6'],
  chunks: [
    { id: 'sp-d120-c1', en: "The study found that exercise improves mental health.", uz: "Tadqiqot shuni ko'rsatdiki, exercise ruhiy salomatlikni yaxshilaydi.", grammarTip: "Original: 'exercise improves mental health'. Paraphrase: 'physical activity enhances psychological wellbeing'.", commonMistake: "'Paraphrase' = boshqa so'zlar bilan qayta aytish, lekin ma'no o'zgarmaydi.", stressWord: 'FOUND' },
    { id: 'sp-d120-c2', en: "According to the research, sleep is essential for memory.", uz: "Tadqiqotga ko'ra, uyqu xotira uchun zarur.", grammarTip: "Original: 'sleep is essential for memory'. Paraphrase: 'adequate rest is crucial for cognitive function'.", commonMistake: "'Paraphrasing' da asl ma'no saqlanadi, faqat so'zlar o'zgaradi.", stressWord: 'ACCORDING' },
    { id: 'sp-d120-c3', en: "Many experts agree that pollution is a growing concern.", uz: "Ko'plab mutaxassislar ittifoq qilishadiki, ifloslanish o'sayotgan muammo.", grammarTip: "Original: 'pollution is a growing concern'. Paraphrase: 'environmental contamination is an increasing issue'.", commonMistake: "'Many experts agree that' — 'agree' da 's' qo'shilmasin: 'they AGREE'.", stressWord: 'EXPERTS' },
    { id: 'sp-d120-c4', en: "The results indicate a significant improvement in student performance.", uz: "Natijalar talabalarning natijalarida sezilarli yaxshilanishni ko'rsatadi.", grammarTip: "Original: 'significant improvement'. Paraphrase: 'substantial progress'. Sinonimlarni ishlatish.", commonMistake: "'The results indicate' — 'indicate' da 's' qo'shiladi: 'the results INDICATE'.", stressWord: 'INDICATE' },
    { id: 'sp-d120-c5', en: "It is widely believed that regular exercise benefits overall health.", uz: "Keng ishoniladiki, muntazam exercise umumiy sog'liqqa foyda keltiradi.", grammarTip: "Original: 'regular exercise benefits overall health'. Paraphrase: 'consistent physical activity contributes to general wellbeing'.", commonMistake: "'It is widely believed that' — passiv paraphrase. 'That' tushirilishi mumkin.", stressWord: 'WIDELY' },
    { id: 'sp-d120-c6', en: "In other words, technology has transformed modern communication.", uz: "Boshqa so'zlar bilan aytganda, texnologiya zamonaviy kommunikatsiyani o'zgartirdi.", grammarTip: "'In other words' = boshqa so'zlar bilan aytganda. Paraphrase uchun ibora.", commonMistake: "'In other words' — paraphrase boshlanishini ko'rsatadi. Ko'p ishlatiladi.", stressWord: 'WORDS' }
  ],
  scenario: {
    topic: "rewriting a text for different audience",
    aiRole: "a publishing editor asking for revisions",
    userRole: "a writer adapting content for different readers",
    opening: "Your article is for a general audience, but it reads like an academic paper. Can you simplify the language without losing meaning?",
    goalUz: "Matnni turli auditoriya uchun qayta yozing, ma'noni saqlab.",
  },
}

const day121: SpeakingDay = {
  day: 121, cefr: 'B2',
  title: "Advanced Verb Patterns",
  subtitle: "Murakkab fe'l naqshlari",
  goalUz: "Murakkab fe'l + to'ldiruvchilarni ishlatasiz.",
  estMinutes: 15,
  linkedLessonId: 'advanced-verb-patterns-b2',
  grammarPoint: 'complex verb + complement',
  vocab: [
    { en: 'consider', uz: 'o\'ylash', example: 'I consider him a friend.' },
    { en: 'avoid', uz: 'qochish', example: 'Avoid eating too much sugar.' },
    { en: 'suggest', uz: 'taklif qilish', example: 'She suggested going for a walk.' },
    { en: 'deny', uz: 'rad etish', example: 'He denied the accusation.' }
  ],
  pronunciationFocus: {
    sound: '/d/',
    ipaExample: '/d/ — consider, avoid',
    tipUz: "Til tishlarga tegadi.",
    tipEn: "Tongue touches the teeth.",
  },
  recycledChunkIds: ['sp-d75-c3', 'sp-d11-c1', 'sp-d80-c5', 'sp-d18-c4', 'sp-d42-c3'],
  chunks: [
    { id: 'sp-d121-c1', en: "I can't help thinking about the problem.", uz: "Men muammo haqida o'ylamasdan turolmayman.", grammarTip: "'Can't help + V-ing' = qila olmaslik. 'Thinking' = o'ylash. Fe'l + gerund naqshi.", commonMistake: "'I can't help to think' xato — 'can't help THINKING' (gerund) kerak.", stressWord: 'HELP' },
    { id: 'sp-d121-c2', en: "She admitted having made a mistake.", uz: "U xato qilganini tan oldi.", grammarTip: "'Admit + V-ing' = tan olmoq. 'Having made' = perfect gerund (oldin qilgan).", commonMistake: "'She admitted to make a mistake' xato — 'admitted MAKING a mistake' (gerund).", stressWord: 'ADMITTED' },
    { id: 'sp-d121-c3', en: "They suggested going to the cinema instead.", uz: "Ular o'rniga kinoga borishni taklif qilishdi.", grammarTip: "'Suggest + V-ing' = taklif qilmoq. 'Going' = borish. Fe'l + gerund naqshi.", commonMistake: "'They suggested to go' xato — 'suggested GOING' (gerund) kerak.", stressWord: 'SUGGESTED' },
    { id: 'sp-d121-c4', en: "I look forward to hearing from you soon.", uz: "Sizdan tez orada xabar olishni kutaman.", grammarTip: "'Look forward to + V-ing' = kutmoq. 'To' prepozitsiya, shuning uchun gerund.", commonMistake: "'I look forward to hear' xato — 'look forward to HEARING' (gerund, chunki 'to' prepozitsiya).", stressWord: 'LOOKING' },
    { id: 'sp-d121-c5', en: "She denied knowing anything about the plan.", uz: "U reja haqida hech narsa bilmasligini rad etdi.", grammarTip: "'Deny + V-ing' = rad etmoq. 'Knowing' = bilish. Fe'l + gerund naqshi.", commonMistake: "'She denied to know' xato — 'denied KNOWING' (gerund) kerak.", stressWord: 'DENIED' },
    { id: 'sp-d121-c6', en: "He avoided making eye contact during the interview.", uz: "U suhbat davomida ko'z tegishmaslikdan qochdi.", grammarTip: "'Avoid + V-ing' = qochmoq. 'Making eye contact' = ko'z tegishmaslik. Fe'l + gerund.", commonMistake: "'He avoided to make' xato — 'avoided MAKING' (gerund) kerak.", stressWord: 'AVOIDED' }
  ],
  scenario: {
    topic: "discussing language learning strategies",
    aiRole: "a language tutor advising a student",
    userRole: "a learner asking about advanced grammar",
    opening: "You're making good progress. Today let's work on those tricky verb patterns that keep tripping you up.",
    goalUz: "Murakkab fe'l naqshlarini til o'rganish kontekstida qo'llang.",
  },
}

const day122: SpeakingDay = {
  day: 122, cefr: 'B2', isReviewDay: true,
  title: "B2 Review 1",
  subtitle: "B2 grammar aralash",
  goalUz: "B2 darajasidagi grammar va lug'atni takrorlang.",
  estMinutes: 15,
  vocab: [
    { en: 'critical', uz: 'tanqidiy', example: 'Critical thinking is essential.' },
    { en: 'argument', uz: 'dalil', example: 'His argument was convincing.' },
    { en: 'stance', uz: 'pozitsiya', example: 'She took a firm stance.' },
    { en: 'paraphrase', uz: 'qayta ifoda', example: 'Please paraphrase the text.' }
  ],
  pronunciationFocus: {
    sound: '/\u03b8/',
    ipaExample: '/\u03b8/ \u2014 think, three, thank',
    tipUz: "Tilingizni tishlaringiz orasiga qo'ying.",
    tipEn: "Place your tongue between your teeth.",
  },
  recycledChunkIds: ['sp-d117-c1', 'sp-d118-c1', 'sp-d119-c1', 'sp-d120-c1', 'sp-d121-c1'],
  chunks: [
    { id: 'sp-d122-c1', en: "It could be argued that the benefits of technology outweigh the drawbacks, provided that we use it responsibly.", uz: "Texnologiya afzalliklari kamchiliklardan ko'ra ko'proq ekanini da'vo qilish mumkin, agar mas'uliyat bilan foydalansak.", grammarTip: "'It could be argued that…' is a hedging phrase for critical thinking. 'Provided that' = agar (formal condition).", commonMistake: "Don't say 'It could argue that' — use passive: 'It could be argued that…' for impersonal academic style.", stressWord: 'OUTWEIGH' },
    { id: 'sp-d122-c2', en: "The reason why poverty persists is that governments have failed to allocate sufficient resources to education.", uz: "Kamchilikning davom etishining sababi shundaki, hukumatlar ta'lim uchun yetarli resurslarni ajratmagan.", grammarTip: "'The reason why… is that…' is a complex sentence linking cause and effect. 'Allocate resources to' = resurslarni ajratmoq.", commonMistake: "Don't say 'The reason why poverty persists is because' — use 'is that', not 'is because'.", stressWord: 'ALLOCATE' },
    { id: 'sp-d122-c3', en: "In my view, the evidence overwhelmingly suggests that climate change is the defining challenge of our generation.", uz: "Mening fikrimcha, dalillar iqlim o'zgarishining avlodimizning eng muhim qiyinchiligi ekanini keskin ko'rsatmoqda.", grammarTip: "'Overwhelmingly suggests' = dominant position with strong evidence. 'Defining challenge' = the most important one that defines an era.", commonMistake: "Don't say 'the evidence suggest' — 'evidence' is uncountable, so verb is singular: 'evidence suggests'.", stressWord: 'OVERWHELMINGLY' },
    { id: 'sp-d122-c4', en: "Rather than simply criticising the policy, we should propose constructive alternatives that address the root causes.", uz: "Siosatni faqat tanqid qilish o'rniga, ildiz sabablarini hal qiladigan qurilgan yechimlarni taklif qilishimiz kerak.", grammarTip: "'Rather than + gerund' contrasts two actions. 'Root causes' = asosiy sabablar. Use 'propose + noun' for suggestions.", commonMistake: "Don't say 'Rather than criticise' when using formal English — 'rather than + gerund' is more standard in writing.", stressWord: 'CONSTRUCTIVE' },
    { id: 'sp-d122-c5', en: "Having considered all the arguments, I am inclined to believe that universal healthcare would benefit society as a whole.", uz: "Barcha dalillarni ko'rib chiqqandan keyin, umumiy tibbiy yordam jamiyat uchun foydali bo'lishiga ishonishga moyilman.", grammarTip: "'Having + past participle' = perfect participle showing completed action before the main clause. 'Inclined to believe' = hedged opinion.", commonMistake: "Don't say 'Having consider' — past participle needed: 'Having considered'.", stressWord: 'INCLINED' },
    { id: 'sp-d122-c6', en: "The significance of this issue cannot be overstated, as it affects not only individuals but entire communities.", uz: "Bu masalaning ahamiyatini ortiqcha baholash mumkin emas, chunki u nafaqat shaxslarni, balki butun hamjamiyatlarni ta'sir qiladi.", grammarTip: "'Cannot be overstated' = very important (strong emphasis). 'Not only…but also' connects two parallel elements.", commonMistake: "Don't say 'cannot overstate' — use passive: 'cannot be overstated' to emphasize importance.", stressWord: 'SIGNIFICANCE' }
  ],
  scenario: {
    topic: "B2 grammar review through real-world discussion",
    aiRole: "a conversation partner for comprehensive review",
    userRole: "a student consolidating B2 grammar",
    opening: "Let's review everything we've learned so far. Tell me about a time when you had to make a difficult decision.",
    goalUz: "B2 darajasidagi barcha grammar va lug'atni haqiqiy suhbat orqali takrorlang.",
  },
}

const day123: SpeakingDay = {
  day: 123, cefr: 'B2', isReviewDay: true,
  title: "B2 Review 2",
  subtitle: "B2 grammar aralash 2",
  goalUz: "B2 ning ikkinchi qismidagi grammar ni takrorlang.",
  estMinutes: 15,
  vocab: [
    { en: 'inversion', uz: 'teskari tartib', example: 'Inversion is used for emphasis.' },
    { en: 'cleft', uz: 'ajratilgan', example: 'Cleft sentences add focus.' },
    { en: 'hedging', uz: 'ehtiyotkorlik', example: 'Hedging softens your claim.' },
    { en: 'register', uz: 'til darajasi', example: 'Formal register is important.' }
  ],
  pronunciationFocus: {
    sound: '/\u03b8/',
    ipaExample: '/\u03b8/ \u2014 think, three, thank',
    tipUz: "Tilingizni tishlaringiz orasiga qo'ying.",
    tipEn: "Place your tongue between your teeth.",
  },
  recycledChunkIds: ['sp-d117-c2', 'sp-d118-c2', 'sp-d119-c2', 'sp-d120-c2', 'sp-d121-c2'],
  chunks: [
    { id: 'sp-d123-c1', en: "Had the government invested more in renewable energy a decade ago, we would not be facing this environmental crisis today.", uz: "Agar hukumat o'n yil oldin qayta tiklanadigan energiyaga ko'proq sarmoya kiritganida, biz bugun bu ekologik inqirozni yuz ko'rmagan bo'lardik.", grammarTip: "'Had + subject + past participle' = inverted third conditional (formal/literary). No 'if' needed. 'Would not be facing' = continuous in conditional.", commonMistake: "Don't say 'Had the government invested… we would not be facing' as two separate sentences — it's one complex sentence.", stressWord: 'INVESTED' },
    { id: 'sp-d123-c2', en: "This viewpoint merits careful consideration, particularly in light of the recent findings published in The Lancet.", uz: "Bu nuqtai nazar ehtiyotkorlik bilan ko'rib chiqilishga loyiq, ayniqsa The Lancet nashr etilgan so'nggi kashfiyotlar nuqtai nazaridan.", grammarTip: "'Merits + noun' = is worth. 'In light of' = considering (formal). Use 'particularly' for emphasis on a specific point.", commonMistake: "Don't say 'merits to consider' — 'merit' takes a noun, not an infinitive: 'merits consideration'.", stressWord: 'MERTIS' },
    { id: 'sp-d123-c3', en: "To put it differently, the current education system fails to equip students with the critical thinking skills they need.", uz: "Boshqacha aytganda, hozirgi ta'lim tizimi talabalarga kerak bo'lgan tanqidiy fikrlash ko'nikmalarini bermaydi.", grammarTip: "'To put it differently' = paraphrase marker. 'Equip someone with' = jihozlash. 'Fails to + V' = does not succeed in doing.", commonMistake: "Don't say 'fails to equip students with the skills what they need' — use 'they need', not 'what they need' for relative clauses.", stressWord: 'EQUIP' },
    { id: 'sp-d123-c4', en: "What has been repeatedly demonstrated is that early intervention programs significantly reduce dropout rates in secondary schools.", uz: "Qayta-qayta isbotlangan narsa shundaki, erta muvofiqlashtirish dasturlari o'rta maktablarda o'quvchilarning tashlab ketish darajasini sezilarli darajada kamaytiradi.", grammarTip: "'What has been demonstrated is that…' = cleft sentence for emphasis. 'Repeatedly' = qayta-qayta. 'Significantly reduce' = sezilarli darajada kamaytiradi.", commonMistake: "Don't say 'What has been demonstrated are that' — 'what' refers to one thing, so use 'is': 'What… is that…'.", stressWord: 'INTERVENTION' },
    { id: 'sp-d123-c5', en: "It is worth noting that countries which prioritise mental health services tend to report higher levels of citizen wellbeing.", uz: "E'tiborga olish kerakki, ruhiy salomatlik xizmatlarini ustun qo'ygan mamlakatlar fuqarolarning farovonlik darajasini yuqori deb hisobot berishga moyildir.", grammarTip: "'It is worth noting that…' = hedging to introduce important information. 'Tend to + verb' = moyil bo'lmoq. 'Prioritise' = ustun qo'ymoq.", commonMistake: "Don't say 'countries which prioritise mental health tend report' — after 'tend to' use base verb: 'tend to report'.", stressWord: 'WORTH' },
    { id: 'sp-d123-c6', en: "Never before have we witnessed such a rapid transformation in the way people communicate across borders.", uz: "Hech qachon biz chegaralar o'tib odamlar muloqot qilish usulida bunday tez o'zgarishni ko'rmagan edik.", grammarTip: "'Never before + auxiliary + subject + past participle' = formal inversion for emphasis. 'Across borders' = chegaralar o'tib.", commonMistake: "Don't say 'Never before we have witnessed' — with negative adverbs at the start, invert subject and auxiliary: 'have we witnessed'.", stressWord: 'WITNESSED' }
  ],
  scenario: {
    topic: "B2 grammar review through current events",
    aiRole: "a news anchor discussing global issues",
    userRole: "a commentator providing analysis",
    opening: "Welcome to our discussion. Today we're talking about climate change. What's your take on the government's response?",
    goalUz: "B2 ning ikkinchi qismidagi grammar ni joriy voqealar haqida gaplashib takrorlang.",
  },
}

const day124: SpeakingDay = {
  day: 124, cefr: 'B2', isReviewDay: true,
  title: "B2 Review 3",
  subtitle: "B2 grammar aralash 3",
  goalUz: "B2 ning uchinchi qismidagi grammar ni takrorlang.",
  estMinutes: 15,
  vocab: [
    { en: 'conditional', uz: 'shartli', example: 'This is a third conditional.' },
    { en: 'passive', uz: 'majhul', example: 'The passive voice is common.' },
    { en: 'subjunctive', uz: 'fe\'l holati', example: 'The subjunctive mood is formal.' },
    { en: 'modal', uz: 'modal fe\'l', example: 'Modals express possibility.' }
  ],
  pronunciationFocus: {
    sound: '/\u03b8/',
    ipaExample: '/\u03b8/ \u2014 think, three, thank',
    tipUz: "Tilingizni tishlaringiz orasiga qo'ying.",
    tipEn: "Place your tongue between your teeth.",
  },
  recycledChunkIds: ['sp-d117-c3', 'sp-d118-c3', 'sp-d119-c3', 'sp-d120-c3', 'sp-d121-c3'],
  chunks: [
    { id: 'sp-d124-c1', en: "If I had studied harder at university, I would have pursued a career in medicine instead of business.", uz: "Agar men universitetda qattiqroq o'qigan bo'lsam, tibbiyot o'rniga biznes kasbini tanlagan bo'lardim.", grammarTip: "Third conditional: 'If + past perfect, would have + past participle'. Used for regrets about past. 'Pursue a career' = kasb qilmoq.", commonMistake: "Don't say 'If I had studied harder I would pursue' — third conditional needs 'would have + past participle'.", stressWord: 'PURSUED' },
    { id: 'sp-d124-c2', en: "The negotiations have been going on for six months, and still no resolution has been reached regarding the trade agreement.", uz: "Muzokaralar olti oydan beri davom etmoqda va hali ham savdo bitimi bo'yicha hech qanday yechim topilmagan.", grammarTip: "'Have been going on' = present perfect continuous (action started in past, still continuing). 'Regarding' = haqida (formal preposition).", commonMistake: "Don't say 'have been going on for six months and still no resolution reached' — add 'has been reached' for full passive.", stressWord: 'RESOLUTION' },
    { id: 'sp-d124-c3', en: "It is the government's responsibility to ensure that every citizen has access to affordable healthcare.", uz: "Hukumatning mas'uliyati har bir fuqaroning arzon tibbiy xizmatlardan foydalanishini ta'minlashdir.", grammarTip: "'It is + noun + to + V' = cleft structure for emphasis. 'Access to' = foydalanish imkoniyati. 'Affordable' = arzon.", commonMistake: "Don't say 'responsibility to ensure every citizen has access' — add 'that' after 'ensure' for clarity.", stressWord: 'RESPONSIBILITY' },
    { id: 'sp-d124-c4', en: "The phenomenon whereby young people prefer virtual communication over face-to-face interaction has raised concerns among psychologists.", uz: "Yoshlarning yuzma-yuz muloqot o'rniga virtual muloqotni afzal ko'rish hodisasi psixologlar orasida tashvishlarga sabab bo'ldi.", grammarTip: "'Whereby' = orqali, ushbu (formal relative adverb). 'Raised concerns' = tashvishlarga sabab bo'ldi. 'Preference for' = afzal ko'rish.", commonMistake: "Don't say 'whereby young people prefer virtual communication over face-to-face interaction has raised' — 'whereby' introduces a defining clause correctly.", stressWord: 'PHENOMENON' },
    { id: 'sp-d124-c5', en: "Not only does regular exercise improve physical health, but it also enhances cognitive function and reduces stress significantly.", uz: "Muntazam jismoniy mashqlar nafaqat jismoniy salomatlikni yaxshilaydi, balki kognitiv funksiyani ham oshiradi va stressni sezilarli darajada kamaytiradi.", grammarTip: "'Not only + auxiliary + subject + verb' = inversion after negative adverb. 'Enhance' = yaxshilamoq (formal). 'Cognitive function' = aqliy faoliyat.", commonMistake: "Don't say 'Not only regular exercise improves' — after 'Not only' at the start, invert subject and auxiliary: 'does… improve'.", stressWord: 'ENHANCES' },
    { id: 'sp-d124-c6', en: "Were artificial intelligence to surpass human intelligence in the future, the ethical implications would be profound and far-reaching.", uz: "Agar sun'iy intellekt kelajakda inson intellektidan oshib ketsa, axloqiy oqibatlari chuqur va keng qamrovli bo'lardi.", grammarTip: "'Were + subject + to + V' = formal inverted second conditional (no 'if'). 'Far-reaching' = keng qamrovli. 'Profound' = chuqur.", commonMistake: "Don't say 'Were AI to surpass human intelligence the implications would be' — add 'if' or keep inversion without 'if' for formal register.", stressWord: 'PROFOUND' }
  ],
  scenario: {
    topic: "B2 grammar review through academic discussion",
    aiRole: "a thesis advisor reviewing a student's work",
    userRole: "a graduate student discussing research",
    opening: "Your thesis draft shows improvement. Let's discuss your argument structure and see where we can strengthen it.",
    goalUz: "B2 ning uchinchi qismidagi grammar ni akademik muhokama orqali takrorlang.",
  },
}

const day125: SpeakingDay = {
  day: 125, cefr: 'B2', isReviewDay: true,
  title: "B2 Final Review",
  subtitle: "B1+B2 aralash",
  goalUz: "B1 va B2 darajasidagi barcha grammar va lug'atni mustahkamlang.",
  estMinutes: 15,
  vocab: [
    { en: 'academic', uz: 'akademik', example: 'Academic writing is formal.' },
    { en: 'complex', uz: 'murakkab', example: 'Complex sentences are challenging.' },
    { en: 'advanced', uz: 'yuqori', example: 'Advanced grammar requires practice.' },
    { en: 'sophisticated', uz: 'murasos', example: 'Her writing style is sophisticated.' }
  ],
  pronunciationFocus: {
    sound: '/\u03b8/',
    ipaExample: '/\u03b8/ \u2014 think, three, thank',
    tipUz: "Tilingizni tishlaringiz orasiga qo'ying.",
    tipEn: "Place your tongue between your teeth.",
  },
  recycledChunkIds: ['sp-d117-c4', 'sp-d118-c4', 'sp-d119-c4', 'sp-d120-c4', 'sp-d121-c4'],
  chunks: [
    { id: 'sp-d125-c1', en: "Had the company invested in digital transformation earlier, it would not have lost so many customers to its competitors.", uz: "Agar kompaniya raqamli transformatsiyaga erta sarmoya kiritganida, raqobatchilariga buncha mijozlarni yo'qotmagan bo'lardi.", grammarTip: "Inverted third conditional: 'Had + subject + past participle' = 'If + subject + had + past participle'. Very formal. 'Competitors' = raqobatchilar.", commonMistake: "Don't say 'Had the company invested… it would not have lost' as two separate clauses without proper linking.", stressWord: 'TRANSFORMATION' },
    { id: 'sp-d125-c2', en: "The extent to which social media influences young people's self-image cannot be underestimated, as research has consistently demonstrated.", uz: "Ijtimoiy tarmoqlarning yoshlarning o'z-o'zini qadrlashiga qanchalik ta'sir qilishi past baholanishi mumkin emas, chunki tadqiqotlar doimiy ravishda isbotlab kelmoqda.", grammarTip: "'The extent to which…' = … darajasi (formal relative clause). 'Cannot be underestimated' = very important. 'Consistently' = doimiy ravishda.", commonMistake: "Don't say 'the extent which' — always include 'to': 'the extent to which'.", stressWord: 'UNDERESTIMATED' },
    { id: 'sp-d125-c3', en: "It is imperative that governments around the world adopt more aggressive policies to combat climate change before it is too late.", uz: "Dunyodagi hukumatlar juda kech bo'lishidan oldin iqlim o'zgarishi bilan kurashish uchun ko'proq tajovuzkor siyosatni qo'llab-quvvatlashlari juda muhim.", grammarTip: "'It is imperative that + subject + base verb' = subjunctive mood (formal suggestion). 'Aggressive policies' = tajovuzkor siyosat.", commonMistake: "Don't say 'It is imperative that governments adopts' — subjunctive uses base verb without -s: 'adopt'.", stressWord: 'IMPERATIVE' },
    { id: 'sp-d125-c4', en: "What strikes me most about this research is that the participants who practised mindfulness for just ten minutes a day showed remarkable improvements in their mental health.", uz: "Bu tadqiqotda menga eng ta'sir qilgan narsa shundaki, atigi kuniga o'n daqiqa mindfulness bilan shug'ullanuvchi ishtirokchilar ruhiy salomatligida ajoyib yaxshilanishlar ko'rsatdi.", grammarTip: "'What strikes me most is that…' = cleft sentence for emphasis. 'Mindfulness' = ongli hushyorlik. 'Remarkable improvements' = ajoyib yaxshilanishlar.", commonMistake: "Don't say 'What strikes me most about this research are that' — 'what' is singular: 'What strikes me most… is that…'.", stressWord: 'REMARKABLE' },
    { id: 'sp-d125-c5', en: "Notwithstanding the economic challenges posed by the pandemic, several businesses have managed to thrive by embracing innovation and adapting to new market conditions.", uz: "Pandemiya tomonidan keltirib chiqarilgan iqtisodiy qiyinchiliklarga qaramay, bir qancha biznes yangilikni qo'llab-quvvatlash va yangi bozor sharoitlariga moslash orqali rivojlanishga muvaffaq bo'ldi.", grammarTip: "'Notwithstanding' = despite (very formal). 'Thrive' = gullab-yashnamoq. 'By embracing + gerund' = ushbu usul orqali. Complex sentence with concession.", commonMistake: "Don't say 'Notwithstanding the challenges, several businesses has managed' — 'businesses' is plural: 'have managed'.", stressWord: 'NOTWITHSTANDING' },
    { id: 'sp-d125-c6', en: "So pervasive has technology become in our daily lives that many people now struggle to imagine a world without smartphones and the internet.", uz: "Texnologiya hayotimizda shunchalik keng tarqalganki, ko'p odamlar smartfonlar va internet dunyosiz hayotni tasavvur qilishda qiynalishadi.", grammarTip: "'So + adjective + auxiliary + subject + verb' = inversion for emphasis (formal). 'Pervasive' = keng tarqalgan. 'Struggle to + V' = qiynalmoq.", commonMistake: "Don't say 'So pervasive technology has become' — with inversion after 'so', put auxiliary before subject: 'has technology become'.", stressWord: 'PERVASIVE' }
  ],
  scenario: {
    topic: "comprehensive B1+B2 final review",
    aiRole: "a conversation partner for final assessment",
    userRole: "a student demonstrating B2 mastery",
    opening: "This is our final review session. Show me everything you've learned — use complex grammar, formal register, and academic vocabulary.",
    goalUz: "B1 va B2 darajasidagi barcha grammar va lug'atni yakuniy baholashda ko'rsating.",
  },
}

export const B2_DAYS: SpeakingDay[] = [day99, day100, day101, day102, day103, day104, day105, day106, day107, day108, day109, day110, day111, day112, day113, day114, day115, day116, day117, day118, day119, day120, day121, day122, day123, day124, day125]
