import type { DailyLesson } from '../dailyLessons'

export const narrativeTensesB1plus: DailyLesson = {
  id: 'narrative-tenses-b1plus',
  speaking: {
    prompt: "Tell a story about a dramatic or important event in your life. Speak for about one minute. Set the scene with the Past Continuous, tell the main events with the Past Simple, and give background with the Past Perfect.",
    tips: [
      "Past Continuous — fon: 'It was raining and I was walking...'",
      "Past Simple — asosiy voqealar: 'Suddenly, I saw...'",
      "Past Perfect — avvalroq bo'lgan: 'I had forgotten my keys.'",
      "Vaqt so'zlari: when, while, suddenly, by the time.",
    ],
    sampleAnswer: "I will never forget the day I got lost in a big city. I was travelling alone, and I was feeling excited. I had planned everything carefully, but I had forgotten to charge my phone. While I was walking through the old town, I suddenly realised that I didn't know the way back. It was getting dark, and I started to panic. Luckily, a kind old man who was selling books noticed me. He showed me the way, and I finally found my hotel. That night, I learned never to travel without a map again.",
  },
  title: 'Narrative Tenses',
  subtitle: "Past Simple, Past Continuous, Past Perfect, Past Perfect Continuous — hikoya qilish san'ati",
  level: 'B1+',
  day: 64,
  listening: {
    transcript: "Narrator: It was a cold winter evening, and I was walking home from work when something strange happened. I had been thinking about dinner all day, so I wasn't paying attention to the road. Suddenly, I heard a loud noise behind me. When I turned around, I saw that a car had stopped in the middle of the street. The driver, who had been driving too fast, looked frightened. A cat had run in front of his car, and he had braked just in time. People were gathering around, and everyone was talking at once. By the time the police arrived, the driver had already calmed down. Luckily, nobody had been hurt. While the officer was writing his report, the little cat sat quietly on the pavement, as if nothing had happened. I had never seen anything like it before.",
    vocabulary: [
      { word: 'frightened', definition: 'qo\'rqib ketgan' },
      { word: 'brake', definition: 'tormoz bosmoq' },
      { word: 'gather', definition: 'to\'planmoq' },
      { word: 'pavement', definition: 'piyodalar yo\'lakchasi' },
      { word: 'calm down', definition: 'tinchlanmoq' }
    ],
    questions: [
      { id: 90051, type: 'multiple-choice', question: "What was the narrator doing when something strange happened?", options: ["Driving a car", "Walking home from work", "Cooking dinner", "Reading a report"], correctIndex: 1, explanation: "'I was walking home from work when something strange happened' — Past Continuous interrupted by Past Simple." },
      { id: 90052, type: 'true-false', question: "The narrator had been thinking about dinner all day.", answer: true, explanation: "'I had been thinking about dinner all day' — Past Perfect Continuous." },
      { id: 90053, type: 'multiple-choice', question: "Why had the car stopped in the street?", options: ["It ran out of fuel", "A cat had run in front of it", "The engine broke", "The police stopped it"], correctIndex: 1, explanation: "'A cat had run in front of his car, and he had braked just in time.'" },
      { id: 90054, type: 'multiple-choice', question: "What had the driver been doing wrong?", options: ["Driving too fast", "Using his phone", "Driving without lights", "Ignoring a sign"], correctIndex: 0, explanation: "'The driver, who had been driving too fast, looked frightened.'" },
      { id: 90055, type: 'true-false', question: "Someone was seriously hurt in the incident.", answer: false, explanation: "'Luckily, nobody had been hurt.'" }
    ],
    difficulty: 'hard',
    topic: "Hikoya zamonlari — voqea bayoni",
  },
  reading: {
    passage: "A Night to Remember\n\nIt was almost midnight when Aziz finally reached the village. He had been driving for six hours, and the rain had not stopped once. While he was looking for his grandmother's house, the car suddenly stopped. He realised that he had forgotten to check the fuel before leaving the city.\n\nAziz remembered that his grandmother lived near the old bridge, so he started walking. The wind was blowing hard, and the streets were empty. After he had walked for twenty minutes, he saw a warm light in a window. His grandmother had been waiting for him all evening. When she opened the door, she smiled and said she had already prepared his favourite soup.",
    questions: [
      { id: 50001, type: 'multiple-choice' as const, question: "What had Aziz forgotten to do before leaving?", options: ["Call his grandmother","Check the fuel","Take an umbrella","Fix the car"], correctIndex: 1, explanation: "Past Perfect 'had forgotten' — oldin sodir bo'lgan ish." },
      { id: 50002, type: 'multiple-choice' as const, question: "Which tense describes the background ('The wind was blowing')?", options: ["Past Simple","Past Continuous","Past Perfect","Present Perfect"], correctIndex: 1, explanation: "Past Continuous — fon harakati." },
      { id: 50003, type: 'multiple-choice' as const, question: "What does 'had been waiting' tell us?", options: ["A short action","A finished single action","A continuous action up to a past point","A future plan"], correctIndex: 2, explanation: "Past Perfect Continuous — o'tmishdagi nuqtagacha davom etgan." },
      { id: 50004, type: 'multiple-choice' as const, question: "Put the events in order: she prepared the soup / he arrived.", options: ["He arrived, then she prepared it","She prepared it before he arrived","At the same time","Cannot tell"], correctIndex: 1, explanation: "'had already prepared' — kelishidan oldin tayyorlagan." }
    ]
  },
  writing: {
    prompt: "Tell a short story about a memorable day or an unexpected event. Set the scene, describe what was happening, and explain what had happened before. Use Past Simple, Past Continuous, and Past Perfect.",
    modelAnswer: "It was a cold winter evening, and I was walking home from work when something unexpected happened. The streets were quiet, and it had been snowing all day. As I turned the corner, I saw that a small crowd had gathered outside my building. My heart started beating fast because I had left my grandmother alone at home, and I feared the worst. When I finally pushed through the crowd, I realised what had happened: my neighbours had organised a surprise party. I had completely forgotten it was my own birthday! I will never forget that day.",
    wordLimit: 100,
    tips: [
      "Past Continuous for background: 'The sun was shining...'",
      "Past Simple for the main events: 'Suddenly, the phone rang.'",
      "Past Perfect for earlier events: 'I had already left when...'",
      "Use time linkers: 'while', 'when', 'by the time'"
    ],
  },
  category: 'Storytelling',
  formulas: [
    { label: 'Past Simple', structure: 'Subject + V2 (V+ed / irregular)\nI walked to the store.\nShe saw a strange man.', explanation: "Hikoyadagi asosiy, ketma-ket voqealar uchun (V2).", whenToUse: "O'tmishda tugagan asosiy voqealarni aytganda.", example: "He opened the door and walked in.", color: 'green' },
    { label: 'Past Continuous', structure: 'Subject + was/were + V-ing\nI was walking home when...\nThe sun was shining.', explanation: "Voqea paytidagi davom etayotgan fon harakati (was/were + V-ing).", whenToUse: "Asosiy voqea foni yoki uzilgan harakatni ko'rsatganda.", example: "The sun was shining when I left.", color: 'blue' },
    { label: 'Past Perfect', structure: 'Subject + had + V3\nShe had already left when I arrived.\nI had never seen such a thing.', explanation: "Boshqa o'tmish voqeasidan OLDIN bo'lgan harakat (had + V3).", whenToUse: "Ikki o'tmish voqeasi tartibini ko'rsatganda.", example: "She had already left when I arrived.", color: 'purple' },
    { label: 'Past Perfect Continuous', structure: 'Subject + had been + V-ing\nWe had been waiting for hours.\nShe had been working all day.', explanation: "O'tmishdagi nuqtagacha davom etgan harakat (had been + V-ing).", whenToUse: "Davomiylikni urg'ulaganda.", example: "We had been waiting for hours.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 NARRATIVE TENSES NIMA?\n\nNarrative tenses � hikoya va voqealarni aytib berish uchun ishlatiladigan o'tgan zamon shakllari. Ingliz tilida to'rtta narrative tense bor:\n\n\uD83D\uDCCC Past Simple � asosiy voqealar (main events):\n  He opened the door and walked in.\n\n\uD83D\uDCCC Past Continuous � orqa fon (background):\n  The sun was shining and birds were singing.\n\n\uD83D\uDCCC Past Perfect � oldingi voqealar (earlier actions):\n  She had already eaten when I arrived.\n\n\uD83D\uDCCC Past Perfect Continuous � davomiylik (duration before something):\n  They had been travelling for six hours before they stopped.",
    "2\uFE0F\u20E3 PAST SIMPLE � ASOSIY VOQEALAR\n\nPast Simple hikoyadagi asosiy voqealarni ifodalaydi. Voqealar birin-ketin sodir bo'ladi:\n\n  He woke up, brushed his teeth, and had breakfast.\n  (U uyg'ondi, tishlarini yuvdi va nonushta qildi.)\n\n\uD83D\uDCCC To'g'ri fe'llar: V+ed (walked, played, started)\n\uD83D\uDCCC Noto'g'ri fe'llar: V2 (went, saw, bought, took)\n\uD83D\uDCCC Kengaytirish: didn't + V1\n\uD83D\uDCCC Savol: Did + S + V1?\n\nHikoya qilishda ko'pincha Past Simple ishlatiladi. Bu eng muhim tense!",
    "3\uFE0F\u20E3 PAST CONTINUOUS � ORQA FON\n\nPast Continuous hikoyadagi orqa fonni, ya'ni voqea sodir bo'layotgan paytdagi vaziyatni tasvirlaydi:\n\n  It was raining heavily. The wind was blowing.\n  (Kuchli yomg'ir yog'ayotgan edi. Shamol esayotgan edi.)\n\nPast Simple bilan birga:\n  I was walking home when I saw an accident.\n  (Men uyga ketayotgan edim, qachonki baxtsiz hodisani ko'rdim.)\n  \u2192 was walking = fon (davom etayotgan harakat)\n  \u2192 saw = asosiy voqea (birdan sodir bo'ldi)",
    "4\uFE0F\u20E3 PAST PERFECT � OLDINGI VOQEALAR\n\nPast Perfect bir o'tgan zamon voqeasidan oldin sodir bo'lgan boshqa voqeani ifodalaydi:\n\n  When I arrived, the train had already left.\n  (Men yetib kelganimda, poyezd allaqachon ketgan edi.)\n  \u2192 avval: poyezd ketdi\n  \u2192 keyin: men yetib keldim\n\n\uD83D\uDCCC Formula: had + V3\n\uD83D\uDCCC Kengaytirish: hadn't + V3\n\uD83D\uDCCC Savol: Had + S + V3?\n\nPast Perfect vaqtda 'oldingi'likni ko'rsatadi. O'zbek tilida '-gan edi' qo'shimchasi bilan ifodalanadi.",
    "5\uFE0F\u20E3 PAST PERFECT CONTINUOUS � DAVOMIYLIK\n\nPast Perfect Continuous bir o'tgan zamon voqeasidan oldin ma'lum vaqt davom etgan harakatni ifodalaydi:\n\n  They had been driving for three hours when the car broke down.\n  (Ular uch soat davomida mashina haydab kelayotgan edi, qachonki mashina buzildi.)\n\n\uD83D\uDCCC Formula: had been + V-ing\n\uD83D\uDCCC Kengaytirish: hadn't been + V-ing\n\n\uD83D\uDD34 Past Perfect vs Past Perfect Continuous:\n  By 6 PM, she had finished her work. (tugallangan harakat)\n  She had been working since 8 AM. (davom etgan harakat)",
    "6\uFE0F\u20E3 VAQT BELGILARI\n\nPast Simple: yesterday, last week, in 2010, ago, first, then, next, finally, when\n  He arrived yesterday. First we ate, then we left.\n\nPast Continuous: while, as, at that moment, at 5 PM yesterday, all day\n  While I was cooking, he was watching TV.\n\nPast Perfect: already, just, never, ever, before, by the time, after\n  She had already left when I called.\n\nPast Perfect Continuous: for, since, all day/week, before, by the time\n  We had been waiting for hours when the news came.",
    "7\uFE0F\u20E3 O'ZBEKCHA XATOLAR\n\n\u2022 Past Perfect ni ishlatmaslik: When I arrived, he already left \u2192 When I arrived, he had already left.\n\u2022 Past Continuous ni ishlatmaslik: It rained when I went out \u2192 It was raining when I went out.\n\u2022 Past Perfect Continuous ni ishlatmaslik: She waited for two hours before he came \u2192 She had been waiting for two hours before he came.\n\u2022 O'zbek tilida: 'Men kelganimda u ketgan edi' = Past Perfect\n\u2022 O'zbek tilida: 'Yomg'ir yog'ayotgan edi' = Past Continuous"
    ],
  vocabulary: [
    { en: 'narrate', uz: 'hikoya qilmoq', example: 'She narrated her travel adventures.', rule: 'Storytelling' },
    { en: 'flashback', uz: 'o\'tmishga qaytish', example: 'The movie used a flashback to show his childhood.', rule: 'Narrative technique' },
    { en: 'sequence', uz: 'ketma-ketlik', example: 'Describe the sequence of events in order.', rule: 'Time order' },
    { en: 'background', uz: 'orqa fon', example: 'The background details set the scene.', rule: 'Past Continuous' },
    { en: 'meanwhile', uz: 'shu vaqtda, ayni paytda', example: 'Meanwhile, the police were investigating the crime.', rule: 'Simultaneous actions' },
    { en: 'eventually', uz: 'oxir-oqibat, nihoyat', example: 'Eventually, they found the missing child.', rule: 'Story progression' },
    { en: 'suddenly', uz: 'to\'satdan, birdan', example: 'Suddenly, the lights went out.', rule: 'Unexpected event' },
    { en: 'previously', uz: 'avvalroq, oldin', example: 'Previously, they had never met.', rule: 'Earlier time' },
    { en: 'by the time', uz: '-gan vaqtga kelib', example: 'By the time we arrived, the show had started.', rule: 'Past Perfect' },
    { en: 'plot twist', uz: 'syurjet burilishi', example: 'The plot twist surprised everyone.', rule: 'Story element' }
    ],
  examples: [
    { en: 'I was walking through the park when I met an old friend from school.', uz: 'Men parkda sayr qilayotgan edim, qachonki maktabdagi eski do\'stimni uchratdim.' },
    { en: 'She had already finished her homework before her mother came home from work.', uz: 'Onasi ishdan kelishidan oldin u allaqachon uy vazifasini tugatgan edi.' },
    { en: 'They had been travelling for over twelve hours when they finally reached the hotel.', uz: 'Ular o\'n ikki soatdan ko\'proq sayohat qilgan edi, qachonki nihoyat mehmonxonaga yetib kelishdi.' },
    { en: 'The sun was setting and the birds were singing as we sat on the balcony.', uz: 'Quyosh botayotgan edi va qushlar sayrayotgan edi, biz balkonda o\'tirganimizda.' },
    { en: 'He opened the door, walked into the room, and saw a strange package on the table.', uz: 'U eshikni ochdi, xonaga kirdi va stolda g\'alati paketni ko\'rdi.' },
    { en: 'While I was driving to work, I remembered that I had left my phone at home.', uz: 'Ishga ketayotganimda, telefonimni uyda qoldirganimni esladim.' },
    { en: 'The detectives had been investigating the case for months before they found the clue.', uz: 'Detektivlar ishni oylar davomida tergov qilgan edi, qachonki dalilni topishdi.' },
    { en: 'First we checked into the hotel, then we went for a walk, and finally we had dinner.', uz: 'Avval mehmonxonaga joylashdik, keyin sayrga chiqdik va nihoyat kechki ovqatlandik.' }
    ],
  specialCases: [
    {
      id: 'past-simple-vs-continuous',
      title: 'Past Simple vs Past Continuous',
      rule: 'Past Simple = tugallangan harakat (complete action):\n  I called her yesterday. (Qo\'ng\'iroq qildim va tugadi.)\n\nPast Continuous = jarayon (action in progress):\n  I was calling her when she walked in. (Qo\'ng\'iroq qilayotgan edim.)\n\n\uD83D\uDD34 Asosiy farq:\n  Past Simple: I watched TV last night. (butun kech, tugallangan)\n  Past Continuous: I was watching TV at 9 PM. (ayni vaqtda jarayon)\n\nBirga ishlatilganda:\n  I was watching TV when the phone rang.\n  \u2192 was watching = jarayon (Past Continuous)\n  \u2192 rang = to\'satdan sodir bo\'lgan (Past Simple)',
      mnemonic: 'Past Simple = tugallangan voqea (photo). Past Continuous = jarayon (video). Photo va video birga kelganda, video fonda, photo asosiy.',
      commonMistakes: "I watched TV when the phone was ringing \u2192 I was watching TV when the phone rang.\nShe was getting up, was having a shower, and was leaving \u2192 She got up, had a shower, and left.",
      examples: [
        { en: 'I was reading a book when my friend called.', uz: 'Men kitob o\'qiyotgan edim, do\'stim qo\'ng\'iroq qilganida.' },
        { en: 'I read a book last night before sleeping.', uz: 'Kecha uxlashdan oldin kitob o\'qidim.' }
    ],
      drills: [
        { id: 50005, type: 'fill-blank', instruction: "Past Simple yoki Past Continuous?", question: 'I ___ (walk) home when it started to rain.', blanks: ['was walking'], explanation: 'Jarayon: was walking = davom etayotgan jarayon. Qoida: \'Was walking\' = yurib ketayotgan edi (davomiy). \'Walked\' = yurdi (tugallangan). Farq: was walking (davom etgan), walked (tugagan).' },
        { id: 50006, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'She ___ TV when the lights went out.', options: ['watched', 'was watching', 'had watched', 'had been watching'], correct: 'was watching', explanation: 'Jarayon: was watching = tomosha qilayotgan edi. Qoida: Past Continuous jarayonni bildiradi: I was watching TV when the power went out. (TV ko\'rayotgan edim, elektr o\'chdi.)' },
        { id: 50007, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I walked home when I saw a friend.', errorPart: 'walked', correct: 'I was walking home when I saw a friend.', explanation: 'Fon harakati: was walking = orqa fonda davom etgan harakat. Qoida: Past Continuous fon: I was walking through the park when I found a wallet. (Bog\'da ketayotgan edim, hamyon topdim.)' }
    ],
    },
    {
      id: 'past-perfect-order',
      title: 'Past Perfect va Past Simple tartibi',
      rule: 'Past Perfect har doim Past Simpledan oldingi harakatni ko\'rsatadi:\n\n  When I arrived (Past Simple), the train had left (Past Perfect).\n  \u2192 avval: poyezd ketdi\n  \u2192 keyin: men yetib keldim\n\n\uD83D\uDD34 Agar voqealar ketma-ket sodir bo\'lsa, Past Perfect shart emas:\n  I woke up, had breakfast, and left. (ketma-ket)\n  \u2192 Past Simple bilan ifoda qilinsa bo\'ladi, chunki tartib aniq.\n\n\uD83D\uDD34 Agar vaqt tartibi muhim bo\'lsa yoki o\'quvchi adashishi mumkin bo\'lsa, Past Perfect ishlatiladi.\n\nAfter va before bilan Past Perfect ko\'pincha kerak emas, chunki bu so\'zlarning o\'zi tartibni ko\'rsatadi:\n  After I ate, I went to bed. \u2714 (After dan keyin Past Perfect shart emas)\n  Before I left, I called her. \u2714',
      mnemonic: 'Past Perfect = time machine (bir o\'tgan zamondan oldingi o\'tgan zamon). Agar vaqt tartibi tushunarli bo\'lsa, Past Perfect shart emas.',
      commonMistakes: "I had woken up, had breakfast, and had left \u2192 I woke up, had breakfast, and left. (keraksiz Past Perfect)\nWhen I arrived, he already left \u2192 When I arrived, he had already left. (Past Perfect kerak)",
      examples: [
        { en: 'After I finished work, I went to the gym.', uz: 'Ishni tugatgandan keyin sport zaliga bordim.' },
        { en: 'She had never flown before she went to London.', uz: 'U Londonga borishdan oldin hech qachon uchmagan edi.' }
    ],
      drills: [
        { id: 50008, type: 'fill-blank', instruction: "Past Perfect yoki Past Simple?", question: 'When I got there, they ___ (already/leave).', blanks: ['had already left'], explanation: 'Oldingi harakat: had left = oldin ketgan edi. Qoida: Past Perfect \'oldin sodir bo\'lgan\' ma\'nosida: They had left before I called. (Ular ketib bo\'lgan edi, men qo\'ng\'iroq qilishimdan oldin.)' },
        { id: 50009, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'I ___ the keys before I left the house.', options: ['grabbed', 'had grabbed', 'was grabbing', 'had been grabbing'], correct: 'had grabbed', explanation: 'Before dan oldin Past Perfect = \'before\' + Past Perfect. Qoida: \'Before\' dan keyin ham Past Perfect: She had finished before he arrived. (U tugatgan edi, u kelishidan oldin.)' },
        { id: 50010, type: 'transformation', instruction: 'Past Perfect bilan ifodalang:', question: 'First she ate. Then I arrived.', hint: 'When I arrived, she ___.', correct: 'When I arrived, she had already eaten.', explanation: 'Eat -> Past Perfect: had eaten' }
    ],
    }
    ],
  exercises: [
    { id: 50011, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: 'Yesterday I ___ (go) to the supermarket.', blanks: ['went'], explanation: 'Go -> went (noto\'g\'ri fe\'l)' },
    { id: 50012, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: 'At 8 PM, I ___ (watch) a movie.', blanks: ['was watching'], explanation: 'Past Continuous: was watching = orqa fon. Qoida: Was/were + V-ing. Fon + asosiy hodisa: She was watching TV when I called. (U TV ko\'rayotgan edi, men qo\'ng\'iroq qilganimda.)' },
    { id: 50013, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: 'She ___ (finish) her work before I arrived.', blanks: ['had finished'], explanation: 'Past Perfect = had + V3 (oldingi o\'tmish). Qoida: She had finished her work before the deadline. (U ishni muddatdan oldin tugatgan edi.) Ikkala harakat o\'tmishda, biri ikkinchisidan oldin.' },
    { id: 50014, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: 'They ___ (travel) for six hours before they stopped.', blanks: ['had been travelling'], explanation: 'Past Perfect Continuous: had been travelling' },
    { id: 50015, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: 'He ___ (buy) a new car last week.', blanks: ['bought'], explanation: 'Buy -> bought = noto\'g\'ri fe\'l (V2). Qoida: buy (V1, sotib olmoq) -> bought (V2, sotib oldi). I bought a new car yesterday. (Kecha yangi mashina sotib oldim.)' },
    { id: 50016, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'While I ___ to work, I saw an accident.', blanks: ['was driving'], explanation: 'Fon: was driving = orqa fon harakati (Past Continuous). Qoida: Past Continuous orqa fonda davom etayotgan harakat: I was driving when the phone rang. (Mashina haydayotgan edim, telefon jiringladi.)' },
    { id: 50017, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'When we arrived, the film ___.', blanks: ['had already started'], explanation: 'Oldingi harakat: had started = oldin boshlangan edi. Qoida: By the time + Past Simple, Past Perfect: By the time we arrived, the concert had started. (Biz kelgunimizcha, konsert boshlangan edi.)' },
    { id: 50018, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'She ___ in London for five years before she moved to Paris.', blanks: ['had been living'], explanation: 'Davomiylik: had been living = oldin yashab kelgan edi (davomiy). Qoida: Past Perfect Continuous (had been + V-ing) bir o\'tmish harakat ikkinchisidan oldin davom etganini bildiradi: They had been living there for 10 years before they moved.' },
    { id: 50019, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'First, he ___ the door and ___ inside.', blanks: ['opened', 'went'], explanation: 'Ketma-ket harakatlar: Past Simple' },
    { id: 50020, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'The sun ___ and the birds ___ when we left.', blanks: ['was shining', 'were singing'], explanation: 'Fon: Past Continuous = orqa fon. Qoida: Past Continuous davom etgan vaziyat: The sun was shining, birds were singing. (Quyosh charaqlab, qushlar sayrayotgan edi.) Hikoya qilishda fon yaratadi.' },
    { id: 50021, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'When I arrived, he already left.', errorPart: 'left', correct: 'When I arrived, he had already left.', explanation: 'Oldingi harakat: had left = oldin ketgan edi. Qoida: Past Perfect \'oldin sodir bo\'lgan\' ma\'nosida: They had left before I called. (Ular ketib bo\'lgan edi, men qo\'ng\'iroq qilishimdan oldin.)' },
    { id: 50022, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'It rained when I went out.', errorPart: 'rained', correct: 'It was raining when I went out.', explanation: 'Fon: was raining = orqa fon (yomg\'ir yog\'ayotgan edi). Qoida: Was/were + V-ing orqa fon: It was raining when we left. (Yomg\'ir yog\'ayotgan edi, biz ketganimizda.) Past Continuous = fon, Past Simple = asosiy hodisa.' },
    { id: 50023, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'She had woken up, had breakfast, and had left.', errorPart: 'had woken up, had breakfast, and had left', correct: 'She woke up, had breakfast, and left.', explanation: 'Ketma-ket: Past Simple kifoya (ketma-ket harakatlar). Qoida: Ketma-ket harakatlar Past Simple bilan: He entered the room, sat down, and started working. (U xonaga kirdi, o\'tirdi va ish boshladi.)' },
    { id: 50024, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'They travelled for hours before they stopped.', errorPart: 'travelled', correct: 'They had been travelling for hours before they stopped.', explanation: 'Davomiylik: had been travelling' },
    { id: 50025, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I was going to the cinema yesterday evening.', errorPart: 'was going', correct: 'I went to the cinema yesterday evening.', explanation: 'Tugallangan: Past Simple = tugagan ish-harakat. Qoida: Past Simple o\'tmishda tugagan ishlar: I finished my homework. (Men vazifamni tugatdim.) Aniq vaqt bilan: yesterday, last week, in 2020.' },
    { id: 50026, type: 'transformation', instruction: "Past Perfect ga o'zgartiring:", question: 'First she ate. Then I came.', hint: 'When I came, she ___.', correct: 'When I came, she had already eaten.', explanation: 'Eat -> had eaten = Past Perfect. Qoida: eat (V1) -> had eaten (V3 bilan Past Perfect). I had eaten before he arrived. (Men yegani edim, u kelishidan oldin.)' },
    { id: 50027, type: 'transformation', instruction: "Past Continuous ga o'zgartiring:", question: 'He walked home when it started to rain.', hint: 'He ___ home when it started to rain.', correct: 'He was walking home when it started to rain.', explanation: 'Fon: was walking = orqa fon (yurib ketayotgan edi). Qoida: \'Was walking\' = davom etgan harakat. To\'satdan sodir bo\'lgan ish Past Simple: I was walking home when I saw her. (Uyga ketayotgan edim, uni ko\'rdim.)' },
    { id: 50028, type: 'transformation', instruction: "Past Perfect Continuous ga o'zgartiring:", question: 'She worked for three hours before the break.', hint: 'She ___ for three hours before the break.', correct: 'She had been working for three hours before the break.', explanation: 'Davomiylik: had been working = oldin ishlab kelgan edi. Qoida: Past Perfect Continuous davomiylikni ta\'kidlaydi: He had been working there for 5 years before he got promoted.' },
    { id: 50029, type: 'transformation', instruction: "Hikoya qiling:", question: '(wake up / have shower / eat breakfast / leave)', hint: 'He ___, ___, ___, and ___.', correct: 'He woke up, had a shower, ate breakfast, and left.', explanation: 'Ketma-ket: Past Simple = ketma-ket harakatlar. Qoida: Past Simple ketma-ket sodir bo\'lgan ishlar: She woke up, brushed her teeth, and had breakfast. (U uyg\'ondi, tishlarini yuvdi va nonushta qildi.)' },
    { id: 50030, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence best describes a background scene?", options: ["It was raining heavily.", "It is raining heavily.", "It was not raining heavily.", "It wasn't raining heavily."], correct: "It was raining heavily.", explanation: "Fon: Past Continuous = orqa fon. Qoida: Past Continuous davom etgan vaziyat: The sun was shining, birds were singing. (Quyosh charaqlab, qushlar sayrayotgan edi.) Hikoya qilishda fon yaratadi." },
 
    { id: 55008, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: 'Last weekend I had an amazing experience. I ___(1) (walk) through the park when I ___(2) (see) a beautiful rainbow. It ___(3) (rain) for an hour before the sun came out. I ___(4) (never/see) such a bright rainbow before!',
      blanks: ['was walking', 'saw', 'had been raining', 'had never seen'],
      acceptedAnswers: [['was walking'], ['saw'], ['had been raining'], ['had never seen', 'never saw']],
      explanation: 'Past Continuous (was walking) — fon harakati. Past Simple (saw) — asosiy voqea. Past Perfect Continuous (had been raining) — oldin davom etgan. Past Perfect (had never seen) — oldingi harakat.' },

    { id: 55017, type: 'connection',
      instruction: 'Unutilmas kun',
      prompt: 'O\'tgan hafta sodir bo\'lgan qiziqarli voqeani hikoya qiling. Narrative tenses (Past Simple, Past Continuous, Past Perfect) ishlating.',
      hints: ['\'I was walking when...\'', '\'I had never...\'', '\'While I was...\''],
      exampleAnswer: 'Last Saturday I was walking in the park when I saw an old friend. I hadn\'t seen him for five years! We had been classmates in school. We decided to have coffee together.' }
    ,
    {"id":100601,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"while","options":["bir vaqtda, ...gan paytda","keyin, undan so'ng","oldin, ...dan oldin","lekin, biroq"],"correct":"bir vaqtda, ...gan paytda","explanation":"While — bir vaqtda sodir bo'lgan harakatlar uchun ishlatiladi."},
    {"id":100602,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"past perfect","options":["o'tmishdagi o'tmish (had + V3)","hozirgi zamon","kelajak zamon","oddiy o'tmish"],"correct":"o'tmishdagi o'tmish (had + V3)","explanation":"Past Perfect — bir o'tmish voqeadan oldin sodir bo'lganini bildiradi."},
    { id: 100540, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses the first conditional correctly?", options: ["If it rains, I will stay home", "If it will rain, I will stay home", "If it rains, I stay home", "If it rained, I will stay home"], correct: "If it rains, I will stay home", explanation: "First conditional: If + present simple, will + V1 (B1 dan takrorlash)" },
    { id: 100543, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses a modal verb correctly?", options: ["They might go to the cinema", "They might to go to the cinema", "They might goes to the cinema", "They might going to the cinema"], correct: "They might go to the cinema", explanation: "Modal + V1 (base form) — to, -s qo'shilmaydi (B1 dan takrorlash)" },


    // ── Interleaved Practice: Narrative Tenses + Participle Clauses ──
    { id: 95591, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "When I arrived, she ___ (already / leave). ___ (exhaust) by the trip, she slept.", blanks: ['had already left', 'Exhausted'], explanation: "Past Perfect (had left). Past Participle (Exhausted = passive)." },
    { id: 95592, type: 'fill-blank', instruction: "Past Continuous (fon) va Past Simple:", question: "While I ___ (walk) home, I ___ (see) an accident. ___ (hear) the noise, I turned around.", blanks: ['was walking', 'saw', 'Hearing'], explanation: "Past Continuous (was walking) + Past Simple (saw). Present Participle (Hearing)." },
    { id: 95593, type: 'error-correction', instruction: "Narrative tenses xatosi:", question: "When I arrived, the train already left. Writed in 1990, the book is old.", errorPart: 'left / Writed', correct: 'When I arrived, the train had already left. Written in 1990, the book is old.', explanation: "Past Perfect (had left). Past Participle (Written)." },
    { id: 95594, type: 'fill-blank', instruction: "Perfect Participle + Past Perfect:", question: "___ (finish) dinner, she went out. She ___ (already / eat) before I arrived.", blanks: ['Having finished', 'had already eaten'], explanation: "Perfect Participle (Having finished). Past Perfect (had eaten)." },
    { id: 95595, type: 'transformation', instruction: "Relative clause → Participle:", question: "The man who lives next door is a doctor. → The man ___ next door is a doctor.", hint: "...", correct: 'living', explanation: "Who lives → living (present participle)." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Har bir tense alohida', color: 'bg-emerald-500', icon: '🌱', ids: [50011, 50012, 50013, 50014, 50015] },
    { title: "O'rtacha", desc: 'Tense tanlash', color: 'bg-blue-500', icon: '📘', ids: [50016, 50017, 50018, 50019, 50020] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50021, 50022, 50023, 50024, 50025] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50026, 50027, 50028, 50029, 50030, 55008, 55017, 100601, 100602, 100540, 100543] },
    { title: "🔀 Aralash", desc: "Narrative tenses + Participle clauses farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95591, 95592, 95593, 95594, 95595] },
  ],
  tests: [
    { id: 50031, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Narrative tenses nechta?", blanks: ["4 ta"], explanation: "Qoida: Narrative Tenses 4 ta: 1) Past Simple (tugagan harakat), 2) Past Continuous (fon), 3) Past Perfect (oldingi), 4) Past Perfect Continuous (davomiy oldingi). Hikoya qilishda ishlatiladi." },
    { id: 50032, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Asosiy voqealar uchun qaysi tense ishlatiladi?", blanks: ["Past Simple"], explanation: "Past Simple = asosiy voqealar (hikoyada). Qoida: Past Simple asosiy voqealarni bildiradi: He opened the door and saw a surprise. (U eshikni ochdi va ajablanib qoldi.)" },
    { id: 50033, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Orqa fon uchun qaysi tense?", blanks: ["Past Continuous"], explanation: "Past Continuous = orqa fon (hikoyada). Qoida: Past Continuous uzoq davom etgan fon: We were having dinner when the guests arrived. (Kechki ovqatlanayotgan edik, mehmonlar keldi.)" },
    { id: 50034, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Past Perfect qanday yasaladi?", blanks: ["had + V3"], explanation: "Past Perfect = had + V3 (oldingi o'tmish). Qoida: Past Perfect ikki o'tmish harakatning qaysi biri oldin sodir bo'lganini ko'rsatadi: By the time we arrived, she had already eaten." },
    { id: 50035, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Past Perfect Continuous qanday yasaladi?", blanks: ["had been + V-ing"], explanation: "Past Perfect Continuous = had been + V-ing" },
    { id: 50036, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "While I ___ home, I met an old friend.", blanks: ["was walking"], explanation: "Fon: was walking = orqa fon (yurib ketayotgan edi). Qoida: 'Was walking' = davom etgan harakat. To'satdan sodir bo'lgan ish Past Simple: I was walking home when I saw her. (Uyga ketayotgan edim, uni ko'rdim.)" },
    { id: 50037, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "When I arrived, the meeting ___.", blanks: ["had already started"], explanation: "Oldingi: had started = oldin boshlagan edi. Qoida: 'Had started' = boshlangan edi (boshqa o'tmish harakatdan oldin): The film had started when we arrived. (Film boshlangan edi, biz kelganimizda.)" },
    { id: 50038, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "They ___ for hours when the bus finally came.", blanks: ["had been waiting"], explanation: "Davomiylik: had been waiting = oldin kutib turgan edi. Qoida: 'Had been waiting' = kutayotgan edi (davomiy). She had been waiting for an hour when he finally arrived. (U bir soat kutgan edi, u nihoyat kelganida.)" },
    { id: 50039, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "First, she ___ the letter, then she ___ it.", blanks: ['wrote', 'posted'], explanation: "Ketma-ket: Past Simple = ketma-ket harakatlar. Qoida: Past Simple ketma-ket sodir bo'lgan ishlar: She woke up, brushed her teeth, and had breakfast. (U uyg'ondi, tishlarini yuvdi va nonushta qildi.)" },
    { id: 50040, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The sun ___ and the birds ___ when we left.", blanks: ['was shining', 'were singing'], explanation: "Fon: Past Continuous = orqa fon. Qoida: Past Continuous davom etgan vaziyat: The sun was shining, birds were singing. (Quyosh charaqlab, qushlar sayrayotgan edi.) Hikoya qilishda fon yaratadi." },
    { id: 50041, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is CORRECT about narrative tenses?", options: ["Past Perfect for earlier actions", "Past Perfect for later actions", "Past Perfect for simultaneous actions", "Past Perfect for future actions"], correct: "Past Perfect for earlier actions", explanation: "Past Perfect = oldingi harakatlar" },
    { id: 50042, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "When I got home, I realised I ___ my keys at work.", blanks: ["had left"], explanation: "Oldingi: had left = oldin ketgan edi. Qoida: Past Perfect (had + V3) bir o'tmish harakat ikkinchisidan oldin sodir bo'lganini bildiradi: When I arrived, she had left. (Men kelganimda, u ketib bo'lgan edi.)" },
    { id: 50043, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "She ___ in New York for 10 years before she moved to London.", blanks: ["had been living"], explanation: "Davomiylik: had been living = oldin yashab kelgan edi (davomiy). Qoida: Past Perfect Continuous (had been + V-ing) bir o'tmish harakat ikkinchisidan oldin davom etganini bildiradi: They had been living there for 10 years before they moved." },
    { id: 50044, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is grammatically CORRECT?", options: ["I woke up, had breakfast, and left.", "I wake up, have breakfast, and left.", "I woke up, have breakfast, and leave.", "I was waking up, having breakfast, and leaving."], correct: "I woke up, had breakfast, and left.", explanation: "Ketma-ket: Past Simple = ketma-ket harakatlar. Qoida: Past Simple ketma-ket sodir bo'lgan ishlar: She woke up, brushed her teeth, and had breakfast. (U uyg'ondi, tishlarini yuvdi va nonushta qildi.)" },
    { id: 50045, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence shows the CORRECT use of narrative tenses?", options: ["While I was walking home, I saw an accident.", "While I walked home, I saw an accident.", "While I was walking home, I was seeing an accident.", "While I walk home, I saw an accident."], correct: "While I was walking home, I saw an accident.", explanation: "While + Past Continuous (fon) + Past Simple (asosiy)" },
    ],
  testSections: [
    { title: 'Oson', desc: 'Narrative tenses asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50031, 50032, 50033, 50034, 50035] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '📘', ids: [50036, 50037, 50038, 50039, 50040] },
    { title: 'Qiyin', desc: 'Tense tanlash', color: 'bg-violet-500', icon: '🎯', ids: [50041, 50042, 50043] },
    { title: 'Murakkab', desc: 'Narrative tenses master', color: 'bg-rose-500', icon: '🏆', ids: [50044, 50045] }
  ],
}

export const advancedRelativeClausesB1plus: DailyLesson = {
  id: 'advanced-relative-clauses-b1plus',
  speaking: {
    prompt: "Describe three important people in your life, adding extra details about each. Speak for about one minute. Use defining and non-defining relative clauses, including 'whom', 'whose', and preposition + which/whom.",
    tips: [
      "Non-defining (vergul bilan) — qo'shimcha ma'lumot: 'My mother, who...'",
      "'whom' — rasmiy, to'ldiruvchi: 'the person whom I met'.",
      "Preposition + whom/which: 'the man to whom I spoke'.",
      "'whose' — egalik: 'the writer whose books I love'.",
    ],
    sampleAnswer: "Let me describe three people I admire. The first is my mother, who has always supported me, and whose kindness I will never forget. The second is my old teacher, from whom I learned the value of hard work. He was a man to whom I owe much of my success. The third is my closest friend, with whom I share all my secrets. She is someone whose advice I always trust. These are the people who have shaped my character and to whom I feel deeply grateful.",
  },
  title: 'Advanced Relative Clauses',
  subtitle: 'Defining, Non-defining, Whom, Whose, Where, When \u2014 murakkab gap qurilishi',
  level: 'B1+',
  day: 65,
  listening: {
    transcript: "Speaker: Let me tell you about my friend Bobur, who I've known since childhood. Bobur, whose father is a famous doctor, grew up in Samarkand — the city where I was born too. We first met in 2005, the year when our families became neighbours. Bobur is the kind of person who always helps others. The school that we attended together was very strict, which is why we studied so hard. There's a small café where we used to meet every Friday. The owner, whom everyone respected, knew our names by heart. Bobur, who now works in Tashkent, still calls me every week. The friendship that we built as children is something I truly value.",
    vocabulary: [
      { word: 'childhood', definition: 'bolalik' },
      { word: 'strict', definition: 'qattiqqo\'l, qattiq tartibli' },
      { word: 'respect', definition: 'hurmat qilmoq' },
      { word: 'neighbour', definition: 'qo\'shni' },
      { word: 'value', definition: 'qadrlamoq' }
    ],
    questions: [
      { id: 90061, type: 'multiple-choice', question: "Where was the speaker born?", options: ["Tashkent", "Samarkand", "Bukhara", "Andijan"], correctIndex: 1, explanation: "'Samarkand — the city where I was born too' — relative adverb 'where'." },
      { id: 90062, type: 'true-false', question: "Bobur's father is a famous doctor.", answer: true, explanation: "'Bobur, whose father is a famous doctor' — non-defining clause with 'whose'." },
      { id: 90063, type: 'multiple-choice', question: "When did the two families become neighbours?", options: ["In 2000", "In 2005", "In 2010", "In 2015"], correctIndex: 1, explanation: "'We first met in 2005, the year when our families became neighbours.'" },
      { id: 90064, type: 'multiple-choice', question: "Where did they used to meet every Friday?", options: ["At school", "At a small café", "At Bobur's house", "At the park"], correctIndex: 1, explanation: "'There's a small café where we used to meet every Friday.'" },
      { id: 90065, type: 'multiple-choice', question: "Where does Bobur work now?", options: ["Samarkand", "Tashkent", "Abroad", "At the café"], correctIndex: 1, explanation: "'Bobur, who now works in Tashkent, still calls me every week.'" }
    ],
    difficulty: 'hard',
    topic: "Murakkab nisbiy gaplar — who/whom/whose/where/when",
  },
  reading: {
    passage: "The Teacher Who Changed Everything\n\nMr. Karimov, who taught English for thirty years, was the kind of person whom students never forgot. The school where he worked was small, but the lessons that he gave were unforgettable. He believed that every student, whether talented or not, deserved attention.\n\nThere was one student, whose name was Dilshod, who almost left school. The day when Mr. Karimov noticed him was an ordinary Monday. The book that he lent Dilshod, which was old and full of notes, became the boy's treasure. Years later, Dilshod, who is now a teacher himself, often talks about the man whose patience changed his life.",
    questions: [
      { id: 50046, type: 'multiple-choice' as const, question: "In 'the students whom he never forgot', why is 'whom' used?", options: ["Subject of the verb","Object of the verb","Possession","Place"], correctIndex: 1, explanation: "'whom' — to'ldiruvchi (object) uchun." },
      { id: 50047, type: 'multiple-choice' as const, question: "'Dilshod, who is now a teacher, ...' — what kind of clause is this?", options: ["Defining","Non-defining","Reduced","Time clause"], correctIndex: 1, explanation: "Vergul bilan — non-defining (qo'shimcha ma'lumot)." },
      { id: 50048, type: 'multiple-choice' as const, question: "Which word shows possession?", options: ["who","which","whose","where"], correctIndex: 2, explanation: "'whose' — egalik bildiradi." },
      { id: 50049, type: 'multiple-choice' as const, question: "'The school where he worked' — 'where' refers to a...", options: ["person","time","place","reason"], correctIndex: 2, explanation: "'where' — joy uchun." }
    ]
  },
  writing: {
    prompt: "Describe a person, a place, and an object that are important to you. Add extra information using defining and non-defining relative clauses with 'who', 'whom', 'whose', 'where', and 'when'.",
    modelAnswer: "The person who has influenced me most is my grandfather, whose calm wisdom I still remember. He was a teacher, and the students whom he taught still visit our family. The place where I feel happiest is our old garden, which he planted many years ago. There is one object that means everything to me: an old watch, which he gave me on the day when I finished school. These are the people, places, and things that have shaped who I am today.",
    wordLimit: 90,
    tips: [
      "Defining (no commas): 'the teacher who helped me'",
      "Non-defining (commas): 'My mother, who lives in Bukhara, ...'",
      "'whose' for possession: 'the man whose car...'",
      "'where/when' for places and times"
    ],
  },
  category: 'Complex Structures',
  formulas: [
    { label: 'Defining', structure: 'Subject + who/which/that + V\nThe woman who lives next door is a doctor.', explanation: "Otni aniqlaydigan, ma'no uchun zarur nisbiy gap (vergulsiz).", whenToUse: "Qaysi shaxs/narsa ekanini aniqlash zarur bo'lganda.", example: "The woman who lives next door is a doctor.", color: 'green' },
    { label: 'Non-defining', structure: 'Noun, + who/which + V, ...\nMy sister, who lives in Paris, is a designer.', explanation: "Qo'shimcha ma'lumot beruvchi nisbiy gap (vergul bilan, 'that' yo'q).", whenToUse: "Ot allaqachon aniq bo'lsa, qo'shimcha ma'lumot berganda.", example: "My sister, who lives in Paris, is a designer.", color: 'blue' },
    { label: 'Whom / Whose', structure: '... whom + S + V (object)\n... whose + N + V\nThe man whom I met is a professor.', explanation: "'whom' — to'ldiruvchi (rasmiy); 'whose' — egalik.", whenToUse: "Rasmiy uslubda to'ldiruvchi yoki egalikni ko'rsatganda.", example: "The man whom I met is a professor.", color: 'purple' },
    { label: 'Where / When / Why', structure: 'place + where + S + V\ntime + when + S + V\nreason + why + S + V', explanation: "Joy (where), vaqt (when), sabab (why) uchun nisbiy so'zlar.", whenToUse: "Joy, vaqt yoki sababga oid ma'lumot berganda.", example: "This is the house where I was born.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 NISBIY GAPLAR NIMA?\n\nRelative clauses (nisbiy gaplar) bir ot yoki olmoshni aniqlashtirish yoki qo\u2019shimcha ma\u2019lumot berish uchun ishlatiladi. Ikki turi bor:\n\n\uD83D\uDCCC Defining (aniqlovchi) \u2014 gapning ma\u2019nosi uchun zarur:\n  The woman who lives next door is a doctor.\n\n\uD83D\uDCCC Non-defining (qo\u2019shimcha) \u2014 vergul bilan ajratiladi:\n  My sister, who lives in London, is a doctor.\n\nAsosiy farq: definingda vergul YO\u2018Q, non-definingda vergul BOR.",
    "2\uFE0F\u20E3 DEFINING RELATIVE CLAUSES\n\nDefining relative clauses gapning ma\u2019nosini aniqlashtiradi. Agar olib tashlansa, gap tushunarsiz bo\u2019lib qoladi:\n\n  The man who called you is my brother.\n  \u2192 \u201cwho called you\u201d \u2014 qaysi odam ekanini aniqlashtiradi\n\n\uD83D\uDCCC Who \u2014 odamlar (subject): The woman who lives here...\n\uD83D\uDCCC Which \u2014 narsalar: The book which I bought...\n\uD83D\uDCCC That \u2014 odam va narsalar (definingda): The man that called...\n\uD83D\uDCCC Object pronoun tushib qolishi mumkin: The man (who) I met... \u2714",
    "3\uFE0F\u20E3 NON-DEFINING RELATIVE CLAUSES\n\nNon-defining relative clauses qo\u2019shimcha ma\u2019lumot beradi. Vergul bilan ajratiladi va olib tashlansa ham gap tushunarli bo\u2019ladi:\n\n  My mother, who is 65, still works full-time.\n  \u2192 \u201cwho is 65\u201d \u2014 qo\u2019shimcha ma\u2019lumot\n\n\uD83D\uDCCC THAT ishlatilmaydi! Faqat who/which/whom/whose\n\uD83D\uDCCC Vergul har doim ishlatiladi\n\uD83D\uDCCC Object pronoun tushib qolishi mumkin EMAS\n\n  My boss, that I respect, ... \u274C (that ishlatilmaydi)",
    "4\uFE0F\u20E3 WHO vs WHOM\n\nWho \u2014 gapning egasi (subject):\n  The woman who called you is my sister.\n  \u2192 who = \u201ccalled\u201d fe\u2019lining egasi\n\nWhom \u2014 gapning to\u2019ldiruvchisi (object):\n  The woman whom you called is my sister.\n  \u2192 you called whom = fe\u2019lning obyekti\n\n\uD83D\uDD34 O\u2018zbek tilida farq yo\u2018q. So\u2018zlashuvda whom o\u2018rniga who:\n  The woman who you called... \u2714 (so\u2018zlashuv)\n  The woman whom you called... \u2714 (rasmiy)",
    "5\uFE0F\u20E3 WHOSE \u2014 EGALIK\n\nWhose egalikni (possession) ifodalaydi. Odamlar, hayvonlar va narsalar uchun:\n\n  The girl whose phone was stolen called the police.\n  \u2192 whose phone = qizning telefoni\n\n  The company whose CEO resigned is in trouble.\n\n\uD83D\uDD34 Of which \u2014 narsalar uchun rasmiy variant:\n  The house the roof of which was damaged...\n\uD83D\uDD34 Whose odam va narsalar uchun: a car whose engine is powerful...",
    "6\uFE0F\u20E3 WHERE, WHEN, WHY\n\nWhere \u2014 joy uchun:\n  The hotel where we stayed was amazing.\n  \u2192 at the hotel = where\n\nWhen \u2014 vaqt uchun:\n  I remember the day when we first met.\n  \u2192 on that day = when\n\nWhy \u2014 sabab uchun:\n  Tell me the reason why you are late.\n  \u2192 for that reason = why\n\n\uD83D\uDD34 The reason why... The place where... The day when... \u2014 keng tarqalgan birikmalar",
    "7\uFE0F\u20E3 PREPOSITIONS + WHICH/WHOM\n\nRasmiy (formal) ingliz tilida prepozitsiyalar relative pronoun bilan birga keladi:\n\n  The person to whom you spoke is the manager.\n  \u2192 to whom = kimga\n\n  The company for which I work is global.\n  \u2192 for which = qaysi kompaniyada\n\n\uD83D\uDD34 So\u2018zlashuv tilida prepozitsiya oxirga qo\u2018yiladi:\n  The person who you spoke to... \u2714\n  The company which I work for... \u2714\n\n\uD83D\uDD34 Qisqa prepozitsiyalar (to, for, with, in, at, about) oxirda yaxshi eshitiladi.",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 That ni non-defining da ishlatish: My sister, that lives in London, ... \u2192 My sister, who lives in London, ...\n\u2022 Whom ni ishlatmaslik: The woman who I saw... (so\u2018zlashuvda mumkin) \u2192 The woman whom I saw... (rasmiy)\n\u2022 Vergulni definingda ishlatish: The man, who called you, is my brother \u2192 The man who called you is my brother.\n\u2022 Whose ni faqat odamlar uchun ishlatish: A car whose engine is broken... \u2714 (narsalar uchun ham)\n\u2022 Where/When/Why ni tushirib qoldirish: The hotel we stayed... \u2192 The hotel where we stayed..."
    ],
  vocabulary: [
    { en: 'relative clause', uz: 'nisbiy gap', example: 'A relative clause gives more information about a noun.', rule: 'Grammar' },
    { en: 'defining', uz: 'aniqlovchi', example: 'A defining clause is essential to the meaning.', rule: 'Clause type' },
    { en: 'non-defining', uz: "qo'shimcha", example: 'A non-defining clause is separated by commas.', rule: 'Clause type' },
    { en: 'antecedent', uz: "aniqlanayotgan so'z", example: 'The noun before the relative pronoun is the antecedent.', rule: 'Structure' },
    { en: 'relative pronoun', uz: 'nisbiy olmosh', example: 'Who, which, that, whom, whose are relative pronouns.', rule: 'Pronoun' },
    { en: 'subject', uz: 'ega', example: 'Who replaces the subject: The man who called...', rule: 'Function' },
    { en: 'object', uz: "to'ldiruvchi", example: 'Whom replaces the object: The man whom I saw...', rule: 'Function' },
    { en: 'possession', uz: 'egalik', example: 'Whose shows possession: The girl whose bag was stolen.', rule: 'Possession' },
    { en: 'preposition', uz: "predlog, ko'makchi", example: 'The person to whom you spoke...', rule: 'Usage' },
    { en: 'omission', uz: "tushirib qoldirish", example: 'Object pronouns can be omitted in defining clauses.', rule: 'Rule' },
    { en: 'who', uz: "kim (ega, odam)", example: 'The woman who called is my teacher.', rule: 'Subject: people' },
    { en: 'which', uz: "qaysi, nima (narsa/hayvon)", example: 'The book which I read was amazing.', rule: 'Objects/animals' },
    { en: 'whom', uz: "kimni, kimga (to'ldiruvchi, rasmiy)", example: 'The man whom I met was very kind.', rule: 'Object: people (formal)' },
    { en: 'whose', uz: "kiming, kimning (egalik)", example: 'The girl whose bag was stolen cried.', rule: 'Possession' },
    { en: 'where', uz: "qaerda (joy uchun)", example: 'The city where I was born is beautiful.', rule: 'Place' },
    { en: 'when', uz: "qachon (vaqt uchun)", example: "I'll never forget the day when we met.", rule: 'Time' },
    { en: 'why', uz: "nima uchun (sabab uchun)", example: 'The reason why she left is unclear.', rule: 'Reason' }
    ],
  examples: [
    { en: 'The woman who lives next door is a famous writer.', uz: "Yon qo'shnida yashaydigan ayol \u2014 mashhur yozuvchi." },
    { en: 'My brother, who works in Dubai, comes home twice a year.', uz: "Dubayda ishlaydigan ukam yiliga ikki marta uyga keladi." },
    { en: 'The man whom you met at the party is my cousin.', uz: "Ziyofatda tanishgan odam \u2014 mening amakivachcham." },
    { en: 'The girl whose phone was stolen was very upset.', uz: "Telefoni o'g'irlangan qiz juda xafa edi." },
    { en: 'The hotel where we stayed had a beautiful garden.', uz: "Biz qolgan mehmonxonada chiroyli bog' bor edi." },
    { en: "I'll never forget the day when we first met.", uz: "Birinchi marta uchrashgan kunimizni hech qachon unutmayman." },
    { en: 'The reason why I was late is that I missed the bus.', uz: "Kechikishimning sababi \u2014 avtobusni qo'ldan boy berganim." },
    { en: 'The company for which I work is based in Tashkent.', uz: "Men ishlaydigan kompaniyaning ofisi Toshkentda." }
    ],
  specialCases: [
    {
      id: 'defining-vs-nondefining',
      title: 'Defining vs Non-defining farqi (Vergul qoidasi)',
      rule: 'Vergul \u2014 asosiy farq:\n\nDefining (vergulsiz):\n  The students who study hard pass the exam.\n  \u2192 Faqat qattiq o\u2018qiydigan talabalar imtihondan o\u2018tadi (boshqalari o\u2018tmaydi).\n  \u2192 Vergul YO\u2018Q \u2014 ma\u2019no torayadi.\n\nNon-defining (vergul bilan):\n  The students, who study hard, pass the exam.\n  \u2192 Hamma talabalar qattiq o\u2018qiydi va hammasi o\u2018tadi.\n  \u2192 Vergul BOR \u2014 qo\u2019shimcha ma\u2019lumot.\n\n\uD83D\uDD34 Asosiy qoida: defining = vergulsiz (ma\u2019no uchun zarur), non-defining = vergul bilan (qo\u2019shimcha ma\u2019lumot).\n\nThat faqat definingda ishlatiladi! Non-definingda NEVER that.',
      mnemonic: 'Defining = no commas = necessary. Non-defining = commas = extra info. Vergul bo\u2018lsa = non-defining, that ni ishlatma.',
      commonMistakes: "My brother, that is a doctor... \u2192 My brother, who is a doctor... (That non-definingda XATO)\nThe students who study hard... \u2192 ma'no o'zgaradi, vergul muhim!\nThat ni definingda ishlatish: The car that I bought... \u2714 (to'g'ri)",
      examples: [
        { en: 'The doctors who work in this hospital are highly qualified.', uz: "Bu shifoxonada ishlaydigan shifokorlar yuqori malakali. (faqat shu shifokorlar)" },
        { en: 'The doctors, who work in this hospital, are highly qualified.', uz: "Shifokorlarning hammasi yuqori malakali \u2014 ular bu shifoxonada ishlaydi. (hamma shifokorlar)" }
    ],
      drills: [
        { id: 50050, type: 'fill-blank', instruction: "Defining yoki non-defining?", question: 'The man ___ lives next door is a doctor. (defining)', blanks: ['who'], explanation: 'Defining \u2014 vergul yo\'q, that ham mumkin' },
        { id: 50051, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'My mother, ___ is 65, still works.', options: ['that', 'who', 'which', 'whom'], correct: 'who', explanation: 'Non-defining \u2014 that ishlatilmaydi' },
        { id: 50052, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'My sister, that lives in London, is a nurse.', errorPart: 'that', correct: 'My sister, who lives in London, is a nurse.', explanation: 'Non-definingda that ishlatilmaydi \u2014 who kerak' },
        { id: 50053, type: 'multiple-choice', instruction: "Bu gap qanday relative clause?", question: 'The students who are late will miss the test.', options: ["Defining (vergul yo'q, ma'no torayadi)", "Non-defining (vergul kerak)", "Ikkalasi ham to'g'ri", "Bu gap xato"], correct: "Defining (vergul yo'q, ma'no torayadi)", explanation: "Defining: 'who are late' aniqlovchi \u2014 kimlar? Vergul qo'shilmaydi." },
        { id: 50054, type: 'transformation', instruction: "Defining \u2192 Non-defigning:", question: "The students who study hard pass. (All students study hard)", hint: 'The students, ...', correct: 'The students, who study hard, pass.', explanation: "Hamma o'qiydi \u2192 vergul bilan non-defining" }
    ],
    },
    {
      id: 'prepositions-relative',
      title: 'Prepozitsiyalar + which/whom',
      rule: 'Rasmiy ingliz tilida prepozitsiyalar relative pronoun dan oldin keladi:\n\n  The person to whom you spoke is the director.\n  (Siz gaplashgan odam \u2014 direktor.)\n\n  The subject about which we talked is important.\n  (Biz gaplashgan mavzu \u2014 muhim.)\n\nSo\u2018zlashuv tilida prepozitsiya oxirda:\n  The person who you spoke to... \u2714 (kundalik)\n  The person to whom you spoke... \u2714 (rasmiy)\n\n\uD83D\uDD34 Qoida: rasmiy = preposition + which/whom, norasmiy = who/which/that + preposition at end',
      mnemonic: 'Rasmiy \u2014 preposition before which/whom (like math: preposition + pronoun). Norasmiy \u2014 preposition at end (normal speech).',
      commonMistakes: "The person to who I spoke... \u2192 The person to whom I spoke... (prepozitsiyadan keyin whom)\nThe person who I spoke to... \u2714 (norasmiy, to'g'ri)\nThe company for that I work... \u2192 The company for which I work... (prepozitsiyadan keyin that emas, which)",
      examples: [
        { en: 'The friend with whom I travelled is from Canada.', uz: "Men bilan sayohat qilgan do'stim Kanadadan." },
        { en: 'The company in which she works is very successful.', uz: "U ishlaydigan kompaniya juda muvaffaqiyatli." }
    ],
      drills: [
        { id: 50055, type: 'fill-blank', instruction: "Prepozitsiya + whom bilan to'ldiring:", question: 'The person ___ I spoke is the CEO.', blanks: ['to whom'], explanation: 'Rasmiy: to whom = rasmiy uslubda \'whom\'. Qoida: Prepozitsiyadan keyin \'whom\' ishlatiladi: The person to whom I spoke... (Men gaplashgan odam...) Norasmiyda: The person I spoke to...' },
        { id: 50056, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'The company ___ I work is global.', options: ['for which', 'which for', 'for that', 'that for'], correct: 'for which', explanation: 'Prepozitsiya + which = rasmiy uslub. Qoida: Rasmiy uslubda prepozitsiya + which: The topic about which we spoke... (Biz gaplashgan mavzu...) Norasmiyda: The topic we spoke about...' },
        { id: 50057, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'The person to who I spoke is the manager.', errorPart: 'to who', correct: 'The person to whom I spoke is the manager.', explanation: 'Prepozitsiyadan keyin whom, who emas' },
        { id: 50058, type: 'transformation', instruction: 'Norasmiydan rasmiyga:', question: 'The person who I work with is friendly.', hint: 'The person with ...', correct: 'The person with whom I work is friendly.', explanation: 'Rasmiy: with whom = \'with\' + whom (rasmiy). Qoida: \'With whom\' = kim bilan (rasmiy): The colleague with whom I work... (Men ishlaydigan hamkasb...) Norasmiyda: The colleague I work with...' }
    ],
    }
    ],
  exercises: [
    { id: 50059, type: 'fill-blank', instruction: "Relative pronoun qo'ying:", question: 'The woman ___ lives next door is a doctor.', blanks: ['who'], explanation: 'Who = odam, ega. Qoida: \'Who\' odamlar uchun, ega: The woman WHO lives next door is a doctor. Who + V1.' },
    { id: 50060, type: 'fill-blank', instruction: "Relative pronoun qo'ying:", question: 'The book ___ I bought is very interesting.', blanks: ['which/that'], explanation: 'Which/that \u2014 narsa, object' },
    { id: 50061, type: 'fill-blank', instruction: "Relative pronoun qo'ying:", question: 'The man ___ called you is my uncle.', blanks: ['who'], explanation: 'Who = odam, ega. Qoida: \'Who\' odamlar uchun, ega: The woman WHO lives next door is a doctor. Who + V1.' },
    { id: 50062, type: 'fill-blank', instruction: "Relative pronoun qo'ying:", question: 'The girl ___ bag was stolen started crying.', blanks: ['whose'], explanation: "Whose \u2014 egalik: whose bag" },
    { id: 50063, type: 'fill-blank', instruction: "Relative pronoun qo'ying:", question: 'The hotel ___ we stayed was very cheap.', blanks: ['where'], explanation: 'Where \u2014 joy: at the hotel' },
    { id: 50064, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'My sister, ___ lives in Paris, is a designer.', blanks: ['who'], explanation: 'Non-defining \\u2014 who kerak, that emas' },
    { id: 50065, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'The woman ___ you met is my boss.', blanks: ['whom'], explanation: 'Object = whom (rasmiy). Qoida: \'Whom\' to\'ldiruvchi: The student whom I taught passed. Norasmiyda \'who\'.' },
    { id: 50066, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'The reason ___ I left is personal.', blanks: ['why'], explanation: 'Reason + why = sabab (nega). Qoida: \'Reason why\' birgalikda ishlatiladi: The reason why he left is unknown. (Uning ketish sababi noma\'lum.) \'Why\' tushirilishi mumkin: the reason he left.' },
    { id: 50067, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'The car ___ engine is broken is mine.', blanks: ['whose'], explanation: 'Whose \\u2014 car\'s engine = whose engine' },
    { id: 50068, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'The day ___ we arrived was rainy.', blanks: ['when'], explanation: 'Day + when — kun: The day when I was born' },
    { id: 50069, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'My sister, that lives in London, is a doctor.', errorPart: 'that', correct: 'My sister, who lives in London, is a doctor.', explanation: "Non-defining relative clause: 'that' ishlatilmaydi — 'who' kerak (vergullar allaqachon bor)" },
    { id: 50070, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'The man who I saw him was tall.', errorPart: 'him', correct: 'The man who I saw was tall.', explanation: "Object pronoun (him) ortiqcha \u2014 who allaqachon object" },
    { id: 50071, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'The hotel where we stayed there was nice.', errorPart: 'there', correct: 'The hotel where we stayed was nice.', explanation: "Where = there, ikkalasi birga kerak emas" },
    { id: 50072, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'The woman whom called you is my aunt.', errorPart: 'whom', correct: 'The woman who called you is my aunt.', explanation: "Whom subject bo'lmaydi \u2014 who kerak (subject)" },
    { id: 50073, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'The person to who I spoke is the director.', errorPart: 'to who', correct: 'The person to whom I spoke is the director.', explanation: "Prepozitsiyadan keyin whom" },
    { id: 50074, type: 'transformation', instruction: 'Birlashtiring:', question: 'I met a man. He is a famous actor.', hint: 'The man whom ...', correct: 'The man whom I met is a famous actor.', explanation: 'Whom \\u2014 object (ingliz tilida shunday ishlatiladi)' },
    { id: 50075, type: 'transformation', instruction: 'Birlashtiring:', question: 'We stayed at a hotel. It was expensive.', hint: 'The hotel where ...', correct: 'The hotel where we stayed was expensive.', explanation: 'Where \\u2014 joy (ingliz tilida shunday ishlatiladi)' },
    { id: 50076, type: 'transformation', instruction: "Whose bilan birlashtiring:", question: 'A girl called you. Her father is a doctor.', hint: 'The girl whose ...', correct: 'The girl whose father is a doctor called you.', explanation: "Whose \u2014 her father = whose father" },
    { id: 50077, type: 'transformation', instruction: 'Birlashtiring:', question: 'I read a book. It was written by an Uzbek author.', hint: 'The book which ...', correct: 'The book which I read was written by an Uzbek author.', explanation: 'Which \\u2014 narsa (ingliz tilida shunday ishlatiladi)' },
    { id: 50078, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["The man who called you is my brother.", "The man whom called you is my brother.", "The man which called you is my brother.", "The man whose called you is my brother."], correct: "The man who called you is my brother.", explanation: 'Subject \\u2014 who (ingliz tilida shunday ishlatiladi)' },
 
    { id: 55007, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: 'The teacher ___(1) (who/which) taught me English was from England. She was the person ___(2) (who/whom) I respected the most. The school ___(3) (where/when) we studied was very old. I\'ll never forget the day ___(4) (when/where) she gave us our diplomas.',
      blanks: ['who', 'whom', 'where', 'when'],
      acceptedAnswers: [['who', 'that'], ['whom', 'who', 'that'], ['where'], ['when']],
      explanation: 'Who — odam, ega. Whom — odam, to\'ldiruvchi (rasmiy). Where — joy. When — vaqt.' },

    { id: 55016, type: 'connection',
      instruction: 'Muhim odamlar',
      prompt: 'Hayotingizdagi muhim odamlar haqida relative clauses ishlatib yozing.',
      hints: ['\'My mother, who...\'', '\'The teacher whose...\'', '\'The city where...\''],
      exampleAnswer: 'My mother, who is a nurse, works very hard. The teacher whose class I loved the most was Mr. Karimov. Tashkent, where I was born, is a beautiful city.' }
    ,
    {"id":100603,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"whom","options":["kimni, kimga (rasmiy, object)","kim (ega, subject)","kimning (egalik)","qaerda (joy)"],"correct":"kimni, kimga (rasmiy, object)","explanation":"Whom — rasmiy uslubda object o'rnida ishlatiladi."},
    {"id":100604,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"whose","options":["kimning (egalik)","kim (ega)","kimni (object)","qachon (vaqt)"],"correct":"kimning (egalik)","explanation":"Whose — egalik ma'nosini bildiradi: whose book = kimning kitobi."},
    { id: 100545, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses Past Perfect correctly?", options: ["When I arrived, the train had already left", "When I arrived, the train already left", "When I arrived, the train has already left", "When I arrived, the train had already leave"], correct: "When I arrived, the train had already left", explanation: "Past Perfect: had + V3 — bir voqea ikkinchisidan oldin sodir bo'lgan (B1 dan takrorlash)" },
    { id: 100547, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses the third conditional correctly?", options: ["If I had studied, I would have passed the exam", "If I had studied, I would pass the exam", "If I studied, I would have passed the exam", "If I have studied, I would have passed the exam"], correct: "If I had studied, I would have passed the exam", explanation: "Third conditional: If + past perfect, would have + V3 (B1 dan takrorlash)" },


    // ── Interleaved Practice: Relative Clauses + Participles ──
    { id: 95601, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The woman who ___ next door is a doctor. The woman ___ next door is a doctor.", blanks: ['lives', 'living'], explanation: "Relative: who lives. Participle: living." },
    { id: 95602, type: 'fill-blank', instruction: "Whose (egalik) va whose:", question: "The girl ___ bag was stolen cried. The car ___ engine is broken is mine.", blanks: ['whose', 'whose'], explanation: "Whose = egalik (odam va narsa)." },
    { id: 95603, type: 'error-correction', instruction: "That vs which:", question: "My car, that is old, still runs well. The book which I read it was good.", errorPart: 'that / which I read it', correct: 'My car, which is old, still runs well. The book which I read was good.', explanation: "Non-defining → that emas. Object pronoun (it) ortiqcha." },
    { id: 95604, type: 'fill-blank', instruction: "Where/when relative:", question: "The hotel ___ we stayed was amazing. I remember the day ___ we met.", blanks: ['where', 'when'], explanation: "Where = joy. When = vaqt." },
    { id: 95605, type: 'transformation', instruction: "Ikkala gapni birlashtiring:", question: "I met a man. He is a famous actor. → The man ___ I met is a famous actor.", hint: "The man ___ I met...", correct: 'whom', explanation: "Whom = object (rasmiy)." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Relative pronouns asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50059, 50060, 50061, 50062, 50063] },
    { title: "O'rtacha", desc: 'Tanlash mashqlari', color: 'bg-blue-500', icon: '📘', ids: [50064, 50065, 50066, 50067, 50068] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50069, 50070, 50071, 50072, 50073] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50074, 50075, 50076, 50077, 50078, 55007, 55016, 100603, 100604, 100545, 100547] },
    { title: "🔀 Aralash", desc: "Relative clauses + Participle clauses farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95601, 95602, 95603, 95604, 95605] },
  ],
  tests: [
    { id: 50079, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Relative clauses necha turga bolinadi?", blanks: ["2 ta"], explanation: "2 tur: defining va non-defining" },
    { id: 50080, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Defining relative clausesda qaysi relative pronoun ishlatilmaydi?", blanks: ["whom"], explanation: "Whom definingda ham ishlatiladi, lekin kam. That eng keng tarqalgan" },
    { id: 50081, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Non-defining relative clausesda qaysi pronoun ishlatilmaydi?", blanks: ["that"], explanation: "Non-definingda that ishlatilmaydi" },
    { id: 50082, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Whom qachon ishlatiladi?", blanks: ["to'ldiruvchi (object) sifatida"], explanation: "Whom = to'ldiruvchi (rasmiy). Qoida: 'Whom' gapda to'ldiruvchi: The person whom I met was kind. (Men uchrashgan odam mehribon edi.) Rasmiy; norasmiyda 'who'." },
    { id: 50083, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Whose qanday ma'noni ifodalaydi?", blanks: ["egalik"], explanation: "Whose — egalik bildiruvchi relative pronoun. Qoida: Whose + noun: The girl whose phone rang was my friend." },
    { id: 50084, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "My brother, ___ lives in Paris, is a chef.", blanks: ["who"], explanation: "Non-defining = aniqlovsiz (who bilan). Qoida: Vergul bilan ajratiladi: My brother, who lives in London, is a doctor." },
    { id: 50085, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The hotel ___ we stayed was five-star.", blanks: ["where"], explanation: "Where = joy (qayerda). Qoida: 'Where' joy haqida gapirganda: The city where I was born is beautiful. (Men tug'ilgan shahar go'zal.) Where = in which, at which." },
    { id: 50086, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The woman ___ car was stolen called the police.", blanks: ["whose"], explanation: "Whose \u2014 her car = whose car" },
    { id: 50087, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The reason ___ he left is unknown.", blanks: ["why"], explanation: "Reason + why = sabab (nega). Qoida: 'Reason why' birgalikda ishlatiladi: The reason why he left is unknown. (Uning ketish sababi noma'lum.) 'Why' tushirilishi mumkin: the reason he left." },
    { id: 50088, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The man ___ I spoke to is my neighbour.", blanks: ["who"], explanation: "So'zlashuvda who + preposition at end" },
    { id: 50089, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The person to ___ you spoke is the director.", blanks: ["whom"], explanation: "Prepozitsiyadan keyin 'whom' ishlatiladi. Qoida: to whom, with whom, for whom: The person for whom I bought the gift... (Men sovg'a sotib olgan odam...) Norasmiyda: The person I bought the gift for..." },
    { id: 50090, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The company ___ I work for is based in London.", blanks: ["which"], explanation: "Which = kompaniya/narsa. Qoida: 'Which' jonsiz narsalar va hayvonlar uchun: The company which I work for is big." },
    { id: 50091, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses a NON-DEFINING clause?", options: ["My brother, who lives in Paris, is a designer.", "My brother, who lives in Paris, was a designer.", "My brother, who lives in Paris, is not a designer.", "My brother, who lives on Paris, is a designer."], correct: "My brother, who lives in Paris, is a designer.", explanation: "Vergul bor \u2014 non-defining" },
    { id: 50092, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is CORRECT with a preposition?", options: ["Both B and C", "Only A", "Only B", "Only C"], correct: "Both B and C", explanation: "B (norasmiy) va C (rasmiy) ikkalasi to'g'ri" },
    { id: 50093, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is grammatically CORRECT?", options: ["The hotel where we stayed was expensive.", "The hotel which we stayed was expensive.", "The hotel that we stayed was expensive.", "The hotel when we stayed was expensive."], correct: "The hotel where we stayed was expensive.", explanation: "Where \u2014 joy, to'g'ri ishlatilgan" },
    ],
  testSections: [
    { title: 'Oson', desc: 'Relative pronouns asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50079, 50080, 50081, 50082, 50083] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '📘', ids: [50084, 50085, 50086, 50087, 50088] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '🎯', ids: [50089, 50090, 50091] },
    { title: 'Murakkab', desc: 'Relative clauses master', color: 'bg-rose-500', icon: '🏆', ids: [50092, 50093] }
  ],
}

export const participleClausesB1plus: DailyLesson = {
  id: 'participle-clauses-b1plus',
  speaking: {
    prompt: "Describe a busy or memorable scene — a market, a festival, or a celebration. Speak for about one minute. Make your description elegant using participle clauses (-ing, -ed, having + past participle).",
    tips: [
      "-ing (aktiv): 'Walking home, I saw...'",
      "-ed (passiv): 'Tired, she sat down.'",
      "'Having + V3': 'Having finished, we left.'",
      "Ikki gapni bittaga birlashtiring.",
    ],
    sampleAnswer: "Arriving at the wedding, I was amazed by the celebration. Hundreds of guests, dressed in colourful clothes, were dancing in the garden. Music, played by a live band, filled the air. Having greeted the hosts, I joined my friends at the table. The food, prepared by the best cooks in the village, was delicious. Children, laughing and running everywhere, added to the joy. Exhausted but happy, I left late at night. Looking back, I realise it was one of the most beautiful celebrations I have ever attended.",
  },
  title: 'Participle Clauses',
  subtitle: 'Present Participle, Past Participle, Perfect Participle \u2014 qisqa va samarali gap tuzish',
  level: 'B1+',
  day: 66,
  listening: {
    transcript: "Narrator: Walking through the old market, I noticed a small shop selling handmade carpets. Attracted by the bright colours, I stepped inside. An old man, sitting quietly in the corner, smiled at me. Having worked as a weaver for fifty years, he knew everything about carpets. Surprised by his knowledge, I asked many questions. Showing me a beautiful red carpet, he explained how it was made. Made from pure silk, it had taken six months to finish. Impressed by his skill, I decided to buy a small one. Wrapping it carefully, the old man thanked me warmly. Leaving the shop, I felt I had learned something special that day.",
    vocabulary: [
      { word: 'handmade', definition: 'qo\'lda yasalgan' },
      { word: 'weaver', definition: 'to\'quvchi' },
      { word: 'silk', definition: 'ipak' },
      { word: 'impressed', definition: 'taassurot ostida qolgan' },
      { word: 'skill', definition: 'mahorat' }
    ],
    questions: [
      { id: 90081, type: 'multiple-choice', question: "What was the small shop selling?", options: ["Spices", "Handmade carpets", "Books", "Jewellery"], correctIndex: 1, explanation: "'a small shop selling handmade carpets' — present participle clause." },
      { id: 90082, type: 'true-false', question: "The old man had worked as a weaver for fifty years.", answer: true, explanation: "'Having worked as a weaver for fifty years, he knew everything about carpets' — perfect participle." },
      { id: 90083, type: 'multiple-choice', question: "What was the red carpet made from?", options: ["Cotton", "Wool", "Pure silk", "Polyester"], correctIndex: 2, explanation: "'Made from pure silk, it had taken six months to finish' — past participle clause." },
      { id: 90084, type: 'multiple-choice', question: "How long had the silk carpet taken to finish?", options: ["One month", "Three months", "Six months", "One year"], correctIndex: 2, explanation: "'it had taken six months to finish.'" },
      { id: 90085, type: 'multiple-choice', question: "How did the narrator feel when leaving the shop?", options: ["Disappointed", "That he had learned something special", "Tired", "Confused"], correctIndex: 1, explanation: "'Leaving the shop, I felt I had learned something special that day.'" }
    ],
    difficulty: 'hard',
    topic: "Sifatdosh gaplar (participle clauses)",
  },
  reading: {
    passage: "Lost in the Mountains\n\nWalking along the narrow path, the two hikers did not notice the dark clouds above them. Surrounded by tall trees, they felt safe at first. The storm, having started suddenly, soon covered everything in fog.\n\nNot knowing which way to go, they decided to wait. Exhausted and cold, they sat under a large rock. A man living nearby, hearing their voices, came to help. Having spent many years in those mountains, he guided them down easily. Rescued at last, the hikers thanked him again and again. Looking back, they understood how dangerous their mistake had been.",
    questions: [
      { id: 50094, type: 'multiple-choice' as const, question: "'Walking along the path' replaces which clause?", options: ["Because they walked","While they were walking","After they walked","If they walked"], correctIndex: 1, explanation: "Present participle — bir vaqtda sodir bo'layotgan harakat." },
      { id: 50095, type: 'multiple-choice' as const, question: "'Surrounded by trees' is a...", options: ["present participle","past participle clause","gerund","infinitive"], correctIndex: 1, explanation: "Past participle — passiv ma'no (ular o'ralgan edi)." },
      { id: 50096, type: 'multiple-choice' as const, question: "'Having spent many years there' shows the action was...", options: ["at the same time","earlier than the main verb","in the future","impossible"], correctIndex: 1, explanation: "Perfect participle — oldinroq sodir bo'lgan." },
      { id: 50097, type: 'multiple-choice' as const, question: "Why use participle clauses here?", options: ["To make text longer","To make writing shorter and more elegant","To ask questions","To show the future"], correctIndex: 1, explanation: "Participle clause — gaplarni qisqartiradi." }
    ]
  },
  writing: {
    prompt: "Describe a busy scene or a process. Make your writing shorter and more elegant by joining ideas with participle clauses (-ing, -ed, having + past participle).",
    modelAnswer: "Walking through the market on a Saturday morning, I always feel alive. Surrounded by colourful stalls, the visitors move slowly, stopping to taste fresh fruit. Vendors, shouting their prices, compete for attention. Having arrived early, I usually find the best vegetables. The bread, baked that morning, smells wonderful. Tired but satisfied, I return home with heavy bags. Made fresh every week, these markets are the heart of our neighbourhood. Joining the crowd, I feel part of something old and beautiful.",
    wordLimit: 90,
    tips: [
      "Present participle for active actions: 'Walking home, I saw...'",
      "Past participle for passive: 'Built in 1990, the bridge...'",
      "Perfect participle for an earlier action: 'Having finished, she left.'",
      "Make sure the subject matches"
    ],
  },
  category: 'Complex Structures',
  formulas: [
    { label: 'Present Participle', structure: 'V-ing + ... (active)\nWalking home, I saw an accident.\nBeing tired, he went to bed early.', explanation: "-ing shakli aktiv ma'noda ikki gapni qisqartiradi.", whenToUse: "Bir vaqtdagi yoki sabab bo'lgan aktiv harakatni ixchamlaganda.", example: "Walking home, I saw an accident.", color: 'green' },
    { label: 'Past Participle', structure: 'V3 + ... (passive)\nExhausted by the trip, she fell asleep.\nWritten in simple English, the book is easy to read.', explanation: "V3 shakli passiv ma'noda gapni qisqartiradi.", whenToUse: "Passiv/holat ma'nosini ixcham berganda.", example: "Exhausted by the trip, she fell asleep.", color: 'blue' },
    { label: 'Perfect Participle', structure: 'Having + V3 + ... (before main action)\nHaving finished work, she went home.\nHaving been warned, they stayed inside.', explanation: "'Having + V3' — asosiy harakatdan oldin tugagan ish.", whenToUse: "Bir harakat boshqasidan oldin tugaganini ko'rsatganda.", example: "Having finished work, she went home.", color: 'purple' },
    { label: 'Negative Participle', structure: 'Not + V-ing / Not having + V3 + ...\nNot knowing the answer, he kept silent.\nNot having seen her before, I introduced myself.', explanation: "'Not + V-ing' yoki 'Not having + V3' — inkor participle.", whenToUse: "Participle gapni inkor qilganda.", example: "Not knowing the answer, he kept silent.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 PARTICIPLE CLAUSES NIMA?\n\nParticiple clauses \u2014 ikki gapni birlashtirishning qisqa va samarali usuli. Ular zamon, sabab, shart yoki natijani ifodalaydi:\n\n  Because she was tired, she went to bed. (full clause)\n  Being tired, she went to bed. (participle clause)\n  (Charchaganligi sababli, u uxlashga ketdi.)\n\n\uD83D\uDCCC Present Participle (V-ing) \u2014 active ma\u2019no: Walking home...\n\uD83D\uDCCC Past Participle (V3) \u2014 passive ma\u2019no: Written in 1990...\n\uD83D\uDCCC Perfect Participle (Having + V3) \u2014 oldingi harakat: Having eaten...",
    "2\uFE0F\u20E3 PRESENT PARTICIPLE (V-ing)\n\nPresent Participle active ma\u2019noda ishlatiladi \u2014 subject harakatni o\u2018zi bajaradi:\n\n  Walking down the street, I met an old friend.\n  (Ko\u2018chada ketayotib, eski do\u2018stimni uchratdim.)\n  \u2192 I was walking + I met = Walking, I met\n\nIshlatilishi:\n\u2022 Sabab: Being late, I took a taxi. (Kech qolganim sababli, taksiga o\u2018tirdim.)\n\u2022 Vaqt: Arriving at the station, she bought a ticket. (Vokzalga kelib, u chipta sotib oldi.)\n\u2022 Natija: The train arrived, causing great excitement. (Poyezd keldi, bu katta hayajonga sabab bo\u2018ldi.)",
    "3\uFE0F\u20E3 PAST PARTICIPLE (V3)\n\nPast Participle passive ma\u2019noda ishlatiladi \u2014 subject harakatni qabul qiladi:\n\n  Exhausted by the long journey, she went straight to bed.\n  (Uzoq safardan charchagan holda, u to\u2018g\u2018ri uxlashga ketdi.)\n  \u2192 She was exhausted + She went = Exhausted, she went\n\n  Written in simple language, the book is easy to understand.\n  (Oddiy tilda yozilgan kitobni tushunish oson.)\n  \u2192 The book was written + It is easy = Written..., the book is...\n\n\uD83D\uDD34 Past Participle ko\u2018pincha passive voice dan keladi: surprised, interested, worried, etc.",
    "4\uFE0F\u20E3 PERFECT PARTICIPLE (Having + V3)\n\nPerfect Participle bir harakat boshqa harakatdan oldin sodir bo\u2018lganini ko\u2018rsatadi:\n\n  Having finished her homework, she watched TV.\n  (Uy vazifasini tugatgach, u televizor ko\u2018rdi.)\n  \u2192 First: finished homework, then: watched TV\n\n  Having been warned about the storm, they stayed home.\n  (Bo\u2018ron haqida ogohlantirilgan holda, ular uyda qolishdi.)\n  \u2192 Passive perfect: Having been + V3\n\n\uD83D\uDD34 Perfect Participle = Past Perfect (had + V3) ning qisqa shakli:\n  After she had finished, she left. \u2192 Having finished, she left.",
    "5\uFE0F\u20E3 NEGATIVE PARTICIPLE CLAUSES\n\nNot participledan oldin keladi:\n\n  Not knowing what to say, I kept silent.\n  (Nima deyishni bilmay, men jim qoldim.)\n\n  Not having received a reply, she called again.\n  (Javob olmaganligi sababli, u yana qo\u2018ng\u2018iroq qildi.)\n\n  Not invited to the party, she felt sad.\n  (Ziyofatga taklif qilinmaganligi sababli, u xafa edi.)\n\n\uD83D\uDD34 Not har doim participle dan oldin keladi, hech qachon orqasida emas.",
    "6\uFE0F\u20E3 PARTICIPLE CLAUSES \u2014 QOIDALAR\n\n1) Subject bir xil bo\u2018lishi kerak:\n  Walking home, I saw an accident. (I = I) \u2714\n  Walking home, the sun was shining. \u274C (sun != I)\n\n2) Participle clause ikkinchi gapni boshlaydi, lekin o\u2018rtada ham kelishi mumkin:\n  The man, feeling guilty, confessed. (o\u2018rtada)\n\n3) Participle clause + as (sabab), when/while (vaqt), because (sabab):\n  While walking home, I saw an accident.\n  Because exhausted, she went to bed.",
    "7\uFE0F\u20E3 PARTICIPLE vs RELATIVE CLAUSE\n\nParticiple clauses ko\u2018pincha relative clauses ni qisqartiradi:\n\n  The woman who lives next door... \u2192 The woman living next door...\n  (Yon qo\u2018shnida yashaydigan ayol...)\n\n  The book which was written in 1990... \u2192 The book written in 1990...\n  (1990 yilda yozilgan kitob...)\n\n  The students who were waiting for the bus... \u2192 The students waiting for the bus...\n  (Avtobus kutayotgan talabalar...)\n\n\uD83D\uDD34 Active relative clause \u2192 V-ing\n\uD83D\uDD34 Passive relative clause \u2192 V3\n\uD83D\uDD34 Bu faqat defining relative clauses uchun!",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 Subject bir xil emas: Walking home, the rain started. \u2192 While I was walking home, the rain started.\n\u2022 Participle clause ni noto\u2018g\u2018ri ishlatish: Eaten dinner, I watched TV \u2192 Having eaten dinner, I watched TV.\n\u2022 Passive/Active adash: Writing by hand, the letter was beautiful \u2192 Written by hand, the letter was beautiful.\n\u2022 Not ni noto\u2018g\u2018ri joylashtirish: Knowing not the answer... \u2192 Not knowing the answer...\n\u2022 Participle vs gerund adash: I like swimming (gerund) vs Swimming daily, I feel fit (participle)"
    ],
  vocabulary: [
    { en: 'participle', uz: 'sifatdosh', example: 'A participle is a verb form used as an adjective.', rule: 'Grammar' },
    { en: 'present participle', uz: "hozirgi zamon sifatdoshi (V-ing)", example: 'Walking home, I met a friend.', rule: 'Active' },
    { en: 'past participle', uz: "o'tgan zamon sifatdoshi (V3)", example: 'Written in 1990, the book is old.', rule: 'Passive' },
    { en: 'perfect participle', uz: "o'tgan zamon sifatdoshi (Having + V3)", example: 'Having finished, she left.', rule: 'Perfect' },
    { en: 'simultaneous', uz: "bir vaqtda sodir bo'lish", example: 'Walking and talking, they reached home.', rule: 'Time' },
    { en: 'sequence', uz: 'ketma-ketlik', example: 'Having eaten, we went for a walk.', rule: 'Order' },
    { en: 'reason', uz: 'sabab', example: 'Being tired, I went to bed early.', rule: 'Cause' },
    { en: 'result', uz: 'natija', example: 'The storm hit, causing widespread damage.', rule: 'Effect' },
    { en: 'dangling participle', uz: "noto'g'ri bog'langan sifatdosh", example: 'Walking home, the rain started. (dangling)', rule: 'Mistake' },
    { en: 'reduce', uz: 'qisqartirmoq', example: 'Relative clauses can be reduced to participle clauses.', rule: 'Transformation' }
    ],
  examples: [
    { en: 'Walking through the park, I noticed the beautiful flowers.', uz: "Parkda sayr qilayotib, chiroyli gullarni payqadim." },
    { en: 'Exhausted after the marathon, he collapsed on the sofa.', uz: "Marafondan charchagan holda, u divanga yiqildi." },
    { en: 'Having finished all her work, she decided to take a break.', uz: "Hamma ishini tugatgach, u tanaffus qilishga qaror qildi." },
    { en: 'Not knowing the way, I asked a policeman for help.', uz: "Yo'lni bilmay, politsiyachidan yordam so'radim." },
    { en: 'Born in a small village, he moved to the capital at 18.', uz: "Kichik qishloqda tug'ilgan, u 18 yoshida poytaxtga ko'chdi." },
    { en: 'The girl sitting by the window is my cousin.', uz: "Deraza yonida o'tirgan qiz \u2014 mening amakivachcham." },
    { en: 'Having been told the news, she burst into tears.', uz: "Yangilikni eshitgach, u yig'lab yubordi." },
    { en: 'The window broken in the storm needs to be replaced.', uz: "Bo'ronda singan derazani almashtirish kerak." }
    ],
  specialCases: [
    {
      id: 'dangling-participles',
      title: 'Dangling Participle (Noto\u2018g\u2018ri bog\u2018langan sifatdosh)',
      rule: 'Dangling participle \u2014 participle clause ning subject i asosiy gapning subject i bilan mos kelmasligi:\n\n  Walking home, the rain started. \u274C\n  \u2192 Rain walking home? Mantiqsiz!\n  \u2192 While I was walking home, the rain started. \u2714\n\n  Having eaten dinner, the TV was turned on. \u274C\n  \u2192 TV eating dinner?!\n  \u2192 Having eaten dinner, he turned on the TV. \u2714\n\n\uD83D\uDD34 Qoida: Participle clause ning subject i har doim asosiy gapning subject i bilan bir xil bo\u2018lishi kerak.\n\nAgar bir xil bo\u2018lmasa, to\u2018liq clause ishlatiladi.',
      mnemonic: 'Participle + main clause = same subject. Agar subject farqli bo\u2018lsa, to\u2018liq gap yoz. \u201cWalking home, I...\u201d (I = I). \u201cWalking home, the rain...\u201d (rain != I) \u2014 XATO!',
      commonMistakes: "Walking home, the rain started \u2192 While I was walking home, the rain started.\nHaving eaten dinner, the phone rang \u2192 While I was eating dinner, the phone rang.\nDriving to work, the accident happened \u2192 While I was driving to work, the accident happened.",
      examples: [
        { en: 'Driving to work, I saw an accident.', uz: "Ishga ketayotib, baxtsiz hodisani ko'rdim." },
        { en: 'Driving to work, the accident was seen. (dangling)', uz: "Xato \u2014 accident driving?!" }
    ],
      drills: [
        { id: 50098, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: '___ (walk) home, I saw a beautiful sunset.', blanks: ['Walking'], explanation: 'Present Participle \u2014 active' },
        { id: 50099, type: 'multiple-choice', instruction: 'Dangling participle ni toping:', question: 'Which sentence has a dangling participle?', options: ['Walking home, I saw an accident.', 'Having eaten, she left the room.', 'Walking home, the rain started.', 'Exhausted, he went to bed.'], correct: 'Walking home, the rain started.', explanation: 'Rain walking? Mantiqsiz! = Yomg\'ir yurmaydi! (Participle mantiqqa mos kelishi kerak.) Qoida: \'Walking\' subjektga mos kelishi shart: Walking home, I saw the rain. (Uyga ketayotib, yomg\'irni ko\'rdim.) \'Rain walking\' mantiqsiz!' },
        { id: 50100, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Having eaten dinner, the TV was turned on.', errorPart: 'Having eaten dinner', correct: 'Having eaten dinner, he turned on the TV.', explanation: 'Subject bir xil bolishi kerak: he = he' }
    ],
    },
    {
      id: 'participle-relative',
      title: 'Participle vs Relative Clause',
      rule: 'Relative clauses participle clauses ga qisqarishi mumkin:\n\nActive (who/which + V) \u2192 V-ing:\n  The woman who lives next door \u2192 The woman living next door\n\nPassive (who/which + is/are + V3) \u2192 V3:\n  The book which was written in 1990 \u2192 The book written in 1990\n\nContinuous (who/which + be + V-ing) \u2192 V-ing:\n  The students who are waiting \u2192 The students waiting\n\n\uD83D\uDD34 Faqat defining relative clauses qisqaradi. Non-defining qisqarmaydi.\n\uD83D\uDD34 Perfect tense (had + V3) qisqarmaydi \u2014 alohida gap bo\u2018lib qoladi.',
      mnemonic: "Who/which + V \u2192 V-ing. Who/which + be + V3 \u2192 V3. Who/which + be + V-ing \u2192 V-ing. Quvvatli, qisqa va samarali!",
      commonMistakes: "Non-defining ni qisqartirish: My brother, living in Paris, ... \u2192 My brother, who lives in Paris, ... (non-defining qisqarmaydi)\nPerfect ni qisqartirish: The woman who had left... \u2192 qisqarmaydi, alohida gap",
      examples: [
        { en: 'The students waiting for the bus were getting cold.', uz: "Avtobus kutayotgan talabalar sovuq qotayotgan edi." },
        { en: 'The money found by the police was returned.', uz: "Politsiya tomonidan topilgan pul qaytarildi." }
    ],
      drills: [
        { id: 50101, type: 'transformation', instruction: 'Relative \u2192 Participle:', question: 'The woman who lives next door is a doctor.', hint: 'The woman living ...', correct: 'The woman living next door is a doctor.', explanation: "Who lives (who+verb) o\u2018rniga \u2018living\u2019 (V-ing) ishlatiladi" },
        { id: 50102, type: 'transformation', instruction: 'Relative \u2192 Participle:', question: 'The book which was written in 1990 is famous.', hint: 'The book written ...', correct: 'The book written in 1990 is famous.', explanation: "Which was written \u2192 written" },
        { id: 50103, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Can non-defining relative clauses be reduced?', options: ['Yes, always', 'No, never', 'Only with who', 'Only in informal speech'], correct: 'No, never', explanation: 'Non-defining qisqarmaydi (vergul bilan ajratilgan nisbiy gaplar). Qoida: My father, who is a teacher, works hard. (Otam, o\'qituvchi, qattiq ishlaydi.) Bu gapni qisqartirib bo\'lmaydi: \'My father, being a teacher\' XATO.' }
    ],
    }
    ],
  exercises: [
    { id: 50104, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: '___ (walk) home, I met an old friend.', blanks: ['Walking'], explanation: 'Walking \u2014 active, bir vaqtda' },
    { id: 50105, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: '___ (exhaust) by the trip, she went to bed.', blanks: ['Exhausted'], explanation: "Exhausted (holdan toydi) \u2014 passive ma\u2019noda ishlatiladi" },
    { id: 50106, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: '___ (finish) her work, she left the office.', blanks: ['Having finished'], explanation: 'Having finished \u2014 oldingi harakat' },
    { id: 50107, type: 'fill-blank', instruction: "To'g'ri shaklni qo'ying:", question: '___ (not/know) the answer, he kept silent.', blanks: ['Not knowing'], explanation: 'Not knowing \u2014 negative participle' },
    { id: 50108, type: 'fill-blank', instruction: "Participle qo'ying:", question: 'The girl ___ (sit) by the window is my sister.', blanks: ['sitting'], explanation: 'Sitting \u2014 relative clause qisqarmasi' },
    { id: 50109, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ tired, I went to bed early.', blanks: ['Being'], explanation: 'Being tired = charchagani sabab. Qoida: Being tired, he went to bed. (Charchagani uchun yotdi.) V-ing sabab bildiradi.' },
    { id: 50110, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ in 1990, the film is still popular.', blanks: ['Made'], explanation: 'Made = passive: was/were + made. Qoida: The cake was made by my mother. Passive: subject + be + V3.' },
    { id: 50111, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ dinner, we went for a walk.', blanks: ['Having eaten'], explanation: 'Having eaten \\u2014 oldin: first ate, then walked' },
    { id: 50112, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ the answer, she raised her hand.', blanks: ['Knowing'], explanation: 'Knowing = active reason. Qoida: Knowing the answer, she raised her hand. (Javobni bilgani uchun.) V-ing sabab.' },
    { id: 50113, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'The children ___ outside are my neighbours.', blanks: ['playing'], explanation: 'Playing \\u2014 who are playing = playing' },
    { id: 50114, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Walked home, I saw an accident.', errorPart: 'Walked', correct: 'Walking home, I saw an accident.', explanation: 'Active ma\'noda Walking (V-ing) kerak' },
    { id: 50115, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Eaten dinner, she watched TV.', errorPart: 'Eaten dinner', correct: 'Having eaten dinner, she watched TV.', explanation: 'Avval eaten, keyin watched \u2192 Having eaten' },
    { id: 50116, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Not having not seen him before, I introduced myself.', errorPart: 'Not having not seen', correct: 'Not having seen him before, I introduced myself.', explanation: 'Bitta not yetarli = ikki karra inkor? Qoida: Ingliz tilida bir gapda faqat BITTA inkor bo\'ladi: I don\'t have ANY money. (I don\'t have NO money XATO!) O\'zbek tilidan farqli: ikki karra inkor yo\'q.' },
    { id: 50117, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Writing by hand, the letter was beautiful.', errorPart: 'Writing', correct: 'Written by hand, the letter was beautiful.', explanation: 'The letter was written \u2014 passive, V3 kerak' },
    { id: 50118, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Having been warned about the storm, but they still went out.', errorPart: 'Having been warned', correct: 'Having been warned about the storm, they still went out.', explanation: "But qo'shimcha kerak emas" },
    { id: 50119, type: 'transformation', instruction: 'Relative \u2192 Participle:', question: 'The man who is standing there is my boss.', hint: 'The man standing ...', correct: 'The man standing there is my boss.', explanation: 'Who is standing \u2192 standing' },
    { id: 50120, type: 'transformation', instruction: 'Relative \u2192 Participle:', question: 'The car which was stolen has been found.', hint: 'The car stolen ...', correct: 'The car stolen has been found.', explanation: 'Which was stolen \u2192 stolen' },
    { id: 50121, type: 'transformation', instruction: 'Full clause \u2192 Participle:', question: 'Because she was tired, she went to bed.', hint: 'Being tired, ...', correct: 'Being tired, she went to bed.', explanation: 'Because she was \u2192 Being = sababni qisqartirish. Qoida: Because tired \u2192 Being tired. V-ing sabab.' },
    { id: 50122, type: 'transformation', instruction: 'Full clause \u2192 Participle:', question: 'After he had finished work, he went home.', hint: 'Having finished ...', correct: 'Having finished work, he went home.', explanation: 'After he had finished \u2192 Having finished' },
    { id: 50123, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["Not knowing the answer, he kept silent.", "Not known the answer, he kept silent.", "Not know the answer, he kept silent.", "Not to know the answer, he kept silent."], correct: "Not knowing the answer, he kept silent.", explanation: "Not knowing \u2014 to'g'ri negative participle" },
 
    { id: 55006, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: '___ (1) (Walk/Walking) through the bazaar, I saw many interesting things. ___ (2) (Attract/Attracted) by the colours, I stopped at a carpet shop. ___ (3) (Finish/Having finished) shopping, I went home happily.',
      blanks: ['Walking', 'Attracted', 'Having finished'],
      acceptedAnswers: [['Walking'], ['Attracted'], ['Having finished']],
      explanation: 'Walking — Present Participle (active, bir vaqtda). Attracted — Past Participle (passive). Having finished — Perfect Participle (oldingi harakat).' },

    { id: 55015, type: 'connection',
      instruction: 'Bir kunlik sayohat',
      prompt: 'Bir kunlik sayohatingizni participle clauses ishlatib qisqa va samarali qilib yozing.',
      hints: ['\'Walking through...\'', '\'Exhausted by...\'', '\'Having arrived...\''],
      exampleAnswer: 'Walking through the old city, I saw amazing architecture. Exhausted by the long walk, I sat down at a cafe. Having rested for an hour, I continued my journey.' }
    ,
    {"id":100605,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"present participle","options":["V-ing (faol ma'no)","V3 (passiv ma'no)","Having + V3 (oldingi)","to + V (masdar)"],"correct":"V-ing (faol ma'no)","explanation":"Present Participle — faol harakat: walking, running, singing."},
    {"id":101738,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"past participle","options":["V3 (passiv ma'no)","V-ing (faol ma'no)","Having + V3","to + V"],"correct":"V3 (passiv ma'no)","explanation":"Past Participle — passiv ma'no: broken, written, seen."},
    { id: 100549, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses a relative clause correctly?", options: ["The man whom I met yesterday is a doctor.", "The man who I met yesterday is a doctor.", "The man which I met yesterday is a doctor.", "The man whom I meet yesterday is a doctor."], correct: "The man whom I met yesterday is a doctor.", explanation: "Whom — object (rasmiy uslub). Who — subject. Which — narsalar (B1 dan takrorlash)" },
    { id: 100551, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses Past Continuous correctly?", options: ["I was walking when I saw an accident.", "I walked when I saw an accident.", "I was walking when I was seeing an accident.", "I was walk when I saw an accident."], correct: "I was walking when I saw an accident.", explanation: "Past Continuous (was/were + V-ing) + Past Simple — fon harakati (B1 dan takrorlash)" },


    // ── Interleaved Practice: Participles + Stance ──
    { id: 95611, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ home, I met an old friend. ___ by the news, she cried.", blanks: ['Walking', 'Shocked'], explanation: "Present (active) → Walking. Past (passive) → Shocked." },
    { id: 95612, type: 'fill-blank', instruction: "Perfect Participle (oldingi):", question: "___ (finish) work, she went home. ___ (warn) about the storm, they stayed inside.", blanks: ['Having finished', 'Having been warned'], explanation: "Having + V3 (active). Having been + V3 (passive)." },
    { id: 95613, type: 'error-correction', instruction: "Dangling participle:", question: "Walking home, the rain started. Eaten dinner, the TV was on.", errorPart: 'Walking home, the rain / Eaten dinner, the TV', correct: 'While I was walking home, the rain started. Having eaten dinner, I turned on the TV.', explanation: "Subject mos kelishi kerak." },
    { id: 95614, type: 'fill-blank', instruction: "Negative participle:", question: "___ (not/know) the answer, he kept silent. ___ (not/invite), she felt sad.", blanks: ['Not knowing', 'Not having been invited'], explanation: "Not + participle. Not having been + V3 (passive perfect)." },
    { id: 95615, type: 'transformation', instruction: "Because → Participle:", question: "Because she was tired, she went to bed. → ___ tired, she went to bed.", hint: "...", correct: 'Being', explanation: "Because + clause → Being + adjective (sabab)." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Participle turlari', color: 'bg-emerald-500', icon: '🌱', ids: [50104, 50105, 50106, 50107, 50108] },
    { title: "O'rtacha", desc: 'Tanlash mashqlari', color: 'bg-blue-500', icon: '📘', ids: [50109, 50110, 50111, 50112, 50113] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50114, 50115, 50116, 50117, 50118] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50119, 50120, 50121, 50122, 50123, 55006, 55015, 100605, 101738, 100549, 100551] },
    { title: "🔀 Aralash", desc: "Participle clauses + Relative clauses farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95611, 95612, 95613, 95614, 95615] },
  ],
  tests: [
    { id: 50124, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Present Participle qanday yasaladi?", blanks: ["V-ing"], explanation: "Present Participle = V-ing" },
    { id: 50125, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Past Participle qanday yasaladi?", blanks: ["V3"], explanation: "Past Participle = V3" },
    { id: 50126, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Perfect Participle qanday ma'noni ifodalaydi?", blanks: ["oldingi harakat"], explanation: "Perfect Participle = oldingi harakat" },
    { id: 50127, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Participle clause ning subject i bilan asosiy gapning subject i ...", blanks: ["bir xil bo'lishi kerak"], explanation: "Subject bir xil bo'lmasa, dangling participle" },
    { id: 50128, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Negative participle da not qayerda turadi?", blanks: ["participle dan oldin"], explanation: 'Not bilan participle birga ishlatiladi (grammatik qoida)' },
    { id: 50129, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ late, I took a taxi.", blanks: ["Being"], explanation: "Being late = kechikkani sabab. Qoida: Being late, she missed the bus. (Kechikkani uchun avtobusni boy berdi.) = Because she was late." },
    { id: 50130, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The window ___ in the storm needs replacing.", blanks: ["broken"], explanation: "The window was broken \u2014 passive, V3" },
    { id: 50131, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ breakfast, she went to work.", blanks: ["Having eaten"], explanation: "Avval breakfast, keyin work \u2192 Having eaten" },
    { id: 50132, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ the answer, I asked the teacher.", blanks: ["Not knowing"], explanation: "Qoida: Not + V-ing = inkor davomli zamon. Present Continuous inkor: am/is/are + not + V-ing. 'I am not sleeping' = Men uxlamayapman. 'Not' 'am/is/are' dan keyin keladi." },
    { id: 50133, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The man ___ next door is a doctor.", blanks: ["living"], explanation: "Relative clause qisqarmasi: who lives \u2192 living" },
    { id: 50134, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence has a DANGLING participle?", options: ["Driving to work, the accident happened.", "Driving for work, the accident happened.", "Driving work, the accident happened.", "Driving to work, a accident happened."], correct: "Driving to work, the accident happened.", explanation: "Accident driving? Subject farqli!" },
    { id: 50135, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which relative clause CAN be reduced?", options: ["The man who called you left.", "who man The called you left.", "called man who The you left.", "The called who man you left."], correct: "The man who called you left.", explanation: "Faqat defining reducable = faqat aniqlovchi nisbiy gaplar qisqartirilishi mumkin. Qoida: Defining relative clauses: The man standing there is my brother. (U erda turgan odam mening akam.) Non-defining qisqartirilmaydi." },
    { id: 50136, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ warned, they stayed inside.", blanks: ["Having been"], explanation: "Having been warned \u2014 passive perfect" },
    { id: 50137, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is the BEST reduction?", options: ["Feeling ill, he stayed in bed.", "Feeling ill, he stayed on bed.", "he ill, Feeling stayed in bed.", "stayed ill, he Feeling in bed."], correct: "Feeling ill, he stayed in bed.", explanation: "Present Participle \u2014 active, sabab" },
    { id: 50138, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is grammatically CORRECT?", options: ["Not invited to the party, she felt sad.", "Not inviting to the party, she felt sad.", "Not invite to the party, she felt sad.", "Not to invite to the party, she felt sad."], correct: "Not invited to the party, she felt sad.", explanation: "Not + V3 \u2014 to'g'ri negative passive" },
    ],
  testSections: [
    { title: 'Oson', desc: 'Participle asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50124, 50125, 50126, 50127, 50128] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '📘', ids: [50129, 50130, 50131, 50132, 50133] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '🎯', ids: [50134, 50135, 50136] },
    { title: 'Murakkab', desc: 'Participle master', color: 'bg-rose-500', icon: '🏆', ids: [50137, 50138] }
  ],
}

export const infinitiveGerundAdvancedB1plus: DailyLesson = {
  id: 'infinitive-gerund-advanced-b1plus',
  speaking: {
    prompt: "Talk about important choices and changes in your life. Speak for about one minute. Use verbs that change meaning with -ing or 'to' — 'remember', 'forget', 'stop', 'try', and 'regret'.",
    tips: [
      "'remember doing' (o'tmish) vs 'remember to do' (kelajak).",
      "'stop doing' (to'xtatmoq) vs 'stop to do' (buning uchun to'xtamoq).",
      "'try doing' (sinab ko'rmoq) vs 'try to do' (harakat qilmoq).",
      "'regret doing' (afsus) vs 'regret to say' (rasmiy xabar).",
    ],
    sampleAnswer: "I have made many choices in my life. I still remember starting my first job, feeling nervous and excited. Last year I stopped working at a shop to focus on my studies. Sometimes I regret to say that I wasted time in the past, but I don't regret changing my path. I always try to study every day, and recently I tried using flashcards, which really helped. I must remember to thank my teacher, who never let me forget how important education is. I will never forget learning these valuable lessons.",
  },
  title: 'Infinitive vs Gerund Advanced',
  subtitle: 'To + V, V-ing \u2014 murakkab verb patternlar va ma\u2019no farqlari',
  level: 'B1+',
  day: 67,
  listening: {
    transcript: "Sardor: Did you remember to lock the door?\nGulnoza: Oh no! I forgot to do it. I remember locking it yesterday, though.\nSardor: Let's not worry. We can stop to check on the way back.\nGulnoza: Good idea. By the way, I've stopped drinking coffee — it kept me awake at night.\nSardor: Really? I tried to quit too, but I couldn't. I tried drinking tea instead, but it's not the same.\nGulnoza: I know the feeling. I'll never forget meeting my first English teacher; she changed my life.\nSardor: That's lovely. Remember to thank her someday.\nGulnoza: I will. Anyway, we need to buy some bread.\nSardor: And don't forget to call your mother — she's waiting.\nGulnoza: You're right. I always regret forgetting these little things!",
    vocabulary: [
      { word: 'lock', definition: 'qulflamoq' },
      { word: 'quit', definition: 'tashlamoq, voz kechmoq' },
      { word: 'awake', definition: 'uyg\'oq' },
      { word: 'regret', definition: 'afsuslanmoq' },
      { word: 'instead', definition: 'o\'rniga' }
    ],
    questions: [
      { id: 90091, type: 'true-false', question: "Gulnoza remembered to lock the door.", answer: false, explanation: "'I forgot to do it' — forget + to V (a duty not done). She only remembers locking it YESTERDAY." },
      { id: 90092, type: 'true-false', question: "Gulnoza has stopped drinking coffee.", answer: true, explanation: "'I've stopped drinking coffee' — stop + V-ing (quitting a habit)." },
      { id: 90093, type: 'multiple-choice', question: "Why did Sardor try drinking tea?", options: ["He likes tea more", "He tried to quit coffee", "The coffee was finished", "Gulnoza asked him to"], correctIndex: 1, explanation: "'I tried to quit too... I tried drinking tea instead' — try to V (attempt) vs try V-ing (experiment)." },
      { id: 90094, type: 'multiple-choice', question: "What will Gulnoza never forget?", options: ["Buying bread", "Locking the door", "Meeting her first English teacher", "Drinking coffee"], correctIndex: 2, explanation: "'I'll never forget meeting my first English teacher' — forget + V-ing (a memory)." },
      { id: 90095, type: 'multiple-choice', question: "What does Sardor remind Gulnoza to do?", options: ["Call her mother", "Lock the door", "Buy tea", "Thank the teacher"], correctIndex: 0, explanation: "'don't forget to call your mother.'" }
    ],
    difficulty: 'hard',
    topic: "Infinitiv va gerund — remember / forget / stop / try",
  },
  reading: {
    passage: "Two Roads\n\nWhen Nodira finished university, she had to make a difficult choice. She remembered promising her father to find a stable job, but she also wanted to try acting. She stopped to think about both options carefully.\n\nHer friend suggested applying for a teaching post. \"You should try teaching,\" she said. But Nodira could not imagine spending her whole life in one classroom. She regretted not telling her family the truth earlier. Finally, she decided to follow her dream. She will never forget standing on a stage for the first time, and she does not regret making that choice.",
    questions: [
      { id: 50139, type: 'multiple-choice' as const, question: "'remembered promising' means she...", options: ["will promise later","recalls a past promise","forgot the promise","broke the promise"], correctIndex: 1, explanation: "'remember + -ing' — o'tgan xotira." },
      { id: 50140, type: 'multiple-choice' as const, question: "'stopped to think' means she...", options: ["stopped thinking","paused in order to think","never thought","thought too much"], correctIndex: 1, explanation: "'stop + to V' — maqsad." },
      { id: 50141, type: 'multiple-choice' as const, question: "'regretted not telling' refers to...", options: ["a future regret","regret about the past","a plan","a promise"], correctIndex: 1, explanation: "'regret + -ing' — o'tmish uchun afsus." },
      { id: 50142, type: 'multiple-choice' as const, question: "'decided to follow' uses which form?", options: ["gerund","infinitive","past participle","base verb"], correctIndex: 1, explanation: '\'decide bilan to V1\'. birga ishlatiladi (grammatik qoida)' }
    ]
  },
  writing: {
    prompt: "Write about choices and changes in your life. Use verbs whose meaning changes with -ing or 'to' — for example 'remember', 'stop', 'try', 'regret', and 'forget'.",
    modelAnswer: "Last year I decided to change my life. I remember starting my first English course, nervous but excited. At first I tried studying late at night, but I was always tired, so I stopped doing that. Now I try to study early instead. I will never forget meeting my classmates, who became good friends. Sometimes I regret not starting sooner, but I don't regret to say that learning English was the best decision I ever made. I always remember to practise every day.",
    wordLimit: 85,
    tips: [
      "'remember to do' (duty) vs 'remember doing' (memory)",
      "'stop to do' (purpose) vs 'stop doing' (end)",
      "'try to do' (attempt) vs 'try doing' (experiment)",
      "'regret to say' vs 'regret doing'"
    ],
  },
  category: 'Verb Patterns',
  formulas: [
    { label: 'Gerund (V-ing)', structure: 'Verb + V-ing (general/liking)\nI enjoy reading.\nShe avoids going there.\nHe suggested taking a break.', explanation: "Fe'lning -ing shakli ot vazifasida; ba'zi fe'llardan keyin.", whenToUse: "enjoy, avoid, suggest, mind fe'llaridan keyin.", example: "She suggested taking a break.", color: 'green' },
    { label: 'Infinitive (to + V)', structure: 'Verb + to + V (goal/desire)\nI want to learn.\nShe decided to leave.\nHe promised to help.', explanation: "'to + fe'l' maqsad/xohishni bildiradi.", whenToUse: "want, decide, promise, hope fe'llaridan keyin.", example: "She decided to leave.", color: 'blue' },
    { label: 'Verb + Object + Infinitive', structure: 'Verb + noun/pronoun + to + V\nShe told me to wait.\nThey advised him to study.\nI want you to help.', explanation: "Fe'l + shaxs + 'to + V' tuzilishi.", whenToUse: "tell, advise, want, ask fe'llaridan keyin shaxs kelganda.", example: "She told me to wait.", color: 'purple' },
    { label: 'Meaning Change', structure: 'Same verb, different meaning:\nRemember + V-ing = eslash (past)\nRemember + to V = unutmaslik (future)\nStop + V-ing = to\u2018xtatish\nStop + to V = to\u2018xtab qilish', explanation: "Ba'zi fe'llar -ing va 'to' bilan ma'nosini o'zgartiradi.", whenToUse: "remember, stop, try, regret, forget fe'llarida.", example: "Remember to call (kelajak) / Remember calling (o'tmish).", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 GERUND VA INFINITIVE \u2014 UMUMIY\n\nBa\u2019zi fe\u2019llardan keyin faqat GERUND (V-ing), ba\u2019zilaridan keyin faqat INFINITIVE (to + V) keladi. Ba\u2019zi fe\u2019llar ikkalasini ham oladi, lekin ma\u2019no o\u2018zgaradi.\n\nGerund: I enjoy reading books. (Kitob o\u2018qishdan zavqlanaman.)\nInfinitive: I want to read this book. (Bu kitobni o\u2018qimoqchiman.)\n\n\uD83D\uDCCC Gerund = faoliyat, umumiy ma\u2019no\n\uD83D\uDCCC Infinitive = maqsad, istak, kelajak",
    "2\uFE0F\u20E3 FAQAT GERUND OLADIGAN FE\u2018LLAR\n\nBu fe\u2019llardan keyin DOIM V-ing keladi:\n\n  enjoy: I enjoy swimming. (Suzishdan zavqlanaman.)\n  avoid: She avoided looking at me. (U menga qarashdan qochdi.)\n  suggest: He suggested going home. (U uyga ketishni taklif qildi.)\n  consider: I\u2019m considering changing jobs. (Ishni o\u2018zgartirishni o\u2018ylayapman.)\n  admit: He admitted stealing the money. (Pulni o\u2018g\u2018irlaganini tan oldi.)\n  deny: She denied breaking the vase. (Vazani sindirganini inkor etdi.)\n  mind: Do you mind waiting? (Kutishga qarshimisiz?)\n  finish: I finished reading the book. (Kitobni o\u2018qib tugatdim.)\n  practice: You should practice speaking. (Gapirishni mashq qilishing kerak.)\n\n\uD83D\uDD34 Bu fe\u2018llarni YODDA SAQLANG! Ular INFINITIVE qabul qilmaydi.",
    "3\uFE0F\u20E3 FAQAT INFINITIVE OLADIGAN FE\u2018LLAR\n\nBu fe\u2019llardan keyin DOIM to + V keladi:\n\n  want: I want to go home. (Uyga ketmoqchiman.)\n  decide: She decided to stay. (U qolishga qaror qildi.)\n  promise: He promised to help. (Yordam berishga va\u2018da berdi.)\n  hope: I hope to see you soon. (Tez orada ko\u2018rishishga umid qilaman.)\n  plan: We plan to travel. (Sayohat qilishni rejalashtiryapmiz.)\n  learn: She learned to drive. (U haydashni o\u2018rgandi.)\n  offer: He offered to carry my bag. (U sumkamni ko\u2018tarishni taklif qildi.)\n  refuse: They refused to pay. (Ular to\u2018lashdan bosh tortdilar.)\n  seem: You seem to be tired. (Siz charchaganga o\u2018xshaysiz.)\n\n\uD83D\uDD34 Bu fe\u2018llar GERUND qabul qilmaydi.",
    "4\uFE0F\u20E3 VERB + OBJECT + INFINITIVE\n\nBa\u2019zi fe\u2019llar object olib, keyin infinitive keladi:\n\n  tell + object + to V: She told me to wait. (U menga kutishni aytdi.)\n  advise + object + to V: I advised him to study. (Men unga o\u2018qishni maslahat berdim.)\n  allow + object + to V: They allowed us to enter. (Ular bizga kirishga ruxsat berishdi.)\n  ask + object + to V: She asked me to help. (U mendan yordam so\u2018radi.)\n  expect + object + to V: I expect you to arrive on time. (Vaqtida kelishingni kutaman.)\n  remind + object + to V: Please remind me to call. (Iltimos, qo\u2018ng\u2018iroq qilishni eslat.)\n  want + object + to V: I want you to be happy. (Baxtli bo\u2018lishingni xohlayman.)\n\n\uD83D\uDD34 Make, let, help \u2014 object dan keyin TO siz infinitive: She made me cry. Let me go. Help me do it.",
    "5\uFE0F\u20E3 MA\u2018NO O\u2018ZGARADIGAN FE\u2018LLAR (1)\n\nRemember + V-ing = o\u2018tmishni eslash:\n  I remember locking the door. (Eshikni berkitganimni eslayman.)\n  \u2192 Avval berkitdim, keyin eslayman.\n\nRemember + to V = unutmaslik (kelajak):\n  I remembered to lock the door. (Eshikni berkitishni esladim \u2192 berkitdim.)\n  \u2192 Avval esladim, keyin berkitdim.\n\nForget + V-ing = o\u2018tmishni unutish:\n  I\u2019ll never forget meeting her. (U bilan uchrashganimni hech qachon unutmayman.)\n\nForget + to V = qilishni unutish:\n  He forgot to call me. (U menga qo\u2018ng\u2018iroq qilishni unutdi.)",
    "6\uFE0F\u20E3 MA\u2018NO O\u2018ZGARADIGAN FE\u2018LLAR (2)\n\nStop + V-ing = biror harakatni to\u2018xtatish:\n  She stopped smoking. (U chekishni tashladi.)\n  \u2192 Chekishni to\u2018xtatdi (boshqa chekmaydi).\n\nStop + to V = biror narsa qilish uchun to\u2018xtash:\n  She stopped to smoke. (U chekish uchun to\u2018xtadi.)\n  \u2192 Biror ishni qilayotgan edi, chekish uchun to\u2018xtadi.\n\nTry + V-ing = sinab ko\u2018rish:\n  Try pressing that button. (U tugmani bosib ko\u2018r.)\n  \u2192 Nima bo\u2018lishini ko\u2018rish uchun sinash.\n\nTry + to V = harakat qilish, urinish:\n  I tried to open the door. (Eshikni ochishga urindim.)\n  \u2192 Harakat qildim, lekin muvaffaqiyatli bo\u2018ldimmi noma\u2019lum.",
    "7\uFE0F\u20E3 GO ON, REGRET, NEED\n\nGo on + V-ing = davom ettirish:\n  He went on talking. (U gapirishda davom etdi.)\n  \u2192 Xuddi shu harakatni davom ettirdi.\n\nGo on + to V = keyingi narsaga o\u2018tish:\n  He went on to talk about politics. (U siyosat haqida gapirishga o\u2018tdi.)\n  \u2192 Yangi mavzuga o\u2018tdi.\n\nRegret + V-ing = qilgan ishga pushaymon:\n  I regret leaving my job. (Ishimni tashlaganimga pushaymonman.)\n\nRegret + to V = xabar berish (rasmiy):\n  I regret to inform you... (Sizga xabar berishdan afsusdaman...)\n\nNeed + V-ing = passive ma\u2019no:\n  The car needs washing. (Mashinani yuvish kerak.)\n  \u2192 = needs to be washed\n\nNeed + to V = active: I need to wash the car.",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 Enjoy dan keyin to V: I enjoy to swim \u2192 I enjoy swimming.\n\u2022 Suggest dan keyin to V: He suggested to go \u2192 He suggested going.\n\u2022 Want dan keyin V-ing: I want going \u2192 I want to go.\n\u2022 Remember + V-ing vs to V adash: I remember to lock the door (esladim va berkitdim) vs I remember locking the door (berkitganimni eslayman).\n\u2022 Stop + V-ing vs to V adash: I stopped to smoke (chekdim) vs I stopped smoking (tashladim).\n\u2022 Make dan keyin to V: She made me to cry \u2192 She made me cry."
    ],
  vocabulary: [
    { en: 'gerund', uz: 'harakat nomi (V-ing)', example: 'Swimming is fun.', rule: 'Grammar' },
    { en: 'infinitive', uz: 'masdar (to + V)', example: 'I want to swim.', rule: 'Grammar' },
    { en: 'verb pattern', uz: "fe'l namunasi", example: 'Some verbs require a specific pattern.', rule: 'Syntax' },
    { en: 'object', uz: "to'ldiruvchi", example: 'She told me to wait. (me = object)', rule: 'Structure' },
    { en: 'regret', uz: 'pushaymon bo\'lmoq', example: 'I regret leaving my job.', rule: 'Meaning change' },
    { en: 'remember', uz: 'eslamoq', example: 'I remember locking the door.', rule: 'Memory' },
    { en: 'forget', uz: 'unutmok', example: 'I forgot to call you.', rule: 'Memory' },
    { en: 'try', uz: 'urinmoq, sinab ko\'rmoq', example: 'Try pressing this button.', rule: 'Effort' },
    { en: 'stop', uz: "to'xtatmoq, to'xtab ... qilmoq", example: 'She stopped smoking.', rule: 'Cessation' },
    { en: 'go on', uz: 'davom etmoq', example: 'He went on talking for hours.', rule: 'Continuation' }
    ],
  examples: [
    { en: 'I enjoy reading books in my free time.', uz: "Bo'sh vaqtimda kitob o'qishdan zavqlanaman." },
    { en: 'She decided to study medicine at university.', uz: "U universitetda tibbiyot o'qishga qaror qildi." },
    { en: 'He suggested going to the cinema tonight.', uz: "U bugun kinoga borishni taklif qildi." },
    { en: 'I remember locking the door before I left.', uz: "Ketishdan oldin eshikni berkitganimni eslayman." },
    { en: 'Please remember to lock the door when you leave.', uz: "Iltimos, ketayotganda eshikni berkitishni unutmang." },
    { en: 'She stopped smoking last year for her health.', uz: "U sog'ligi uchun o'tgan yili chekishni tashladi." },
    { en: 'He stopped to buy some flowers on the way home.', uz: "U uyga ketayotib gul sotib olish uchun to'xtadi." },
    { en: 'The car needs washing \u2014 it\'s very dirty.', uz: "Mashinani yuvish kerak \u2014 juda iflos." }
    ],
  specialCases: [
    {
      id: 'remember-forget-regret',
      title: 'Remember / Forget / Regret + V-ing vs to V',
      rule: "Bu fe\u2018llar bilan V-ing va to V farqlari:\n\nRemember + V-ing = o\u2018tmishdagi harakatni eslash:\n  I remember meeting her in 2010. (2010 da uchrashganimni eslayman.)\n\nRemember + to V = kelajakdagi harakatni eslash:\n  I remembered to buy milk. (Sut sotib olishni esladim \u2192 sotib oldim.)\n\nForget + V-ing = o\u2018tmishni unutish:\n  I\u2019ll never forget visiting Paris. (Parijga borganimni unutmayman.)\n\nForget + to V = qilishni unutish:\n  I forgot to send the email. (Email jo\u2018natishni unutdim.)\n\nRegret + V-ing = qilgan ishga pushaymon:\n  I regret saying that to her. (Unga shunday deganimga pushaymonman.)\n\nRegret + to V = afsus bilan xabar berish:\n  I regret to inform you that you failed. (Afsus bilan xabar beramanki, siz o\u2018ta olmadingiz.)",
      mnemonic: "V-ing = past (eslash/unutish/pushaymon). To V = future (eslatma/unutish/afsus). \u201cI remember DOING\u201d = o\u2018tmish. \u201cI remember TO DO\u201d = kelajak.",
      commonMistakes: "I remember to lock the door yesterday \u2192 I remember locking the door yesterday. (yesterday = o'tmish \u2192 V-ing)\nI forgot posting the letter \u2192 I forgot to post the letter. (post qilishni unutdim, post qilganimni emas)",
      examples: [
        { en: "I'll never forget visiting the Registan Square.", uz: "Registon maydoniga borganimni hech qachon unutmayman." },
        { en: "Don't forget to visit the Registan Square!", uz: "Registon maydoniga borishni unutmang!" }
    ],
      drills: [
        { id: 50143, type: 'fill-blank', instruction: "V-ing yoki to V?", question: 'I remember ___ (lock) the door. I did it at 8 PM.', blanks: ['locking'], explanation: 'O\'tmishdagi harakatni eslash → remember + V-ing. I remember locking = eslayman, qulflaganman.' },
        { id: 50144, type: 'fill-blank', instruction: "V-ing yoki to V?", question: 'Please remember ___ (buy) bread on your way home.', blanks: ['to buy'], explanation: 'Kelajakdagi \u2014 unutma \u2192 to V' },
        { id: 50145, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'I regret ___ you that your application was rejected.', options: ['telling', 'to tell', 'tell', 'told'], correct: 'to tell', explanation: 'Rasmiy xabar \u2192 regret + to V' }
    ],
    },
    {
      id: 'stop-try-need',
      title: 'Stop / Try / Need + V-ing vs to V',
      rule: "Stop + V-ing = harakatni to\u2018xtatish:\n  I stopped eating meat. (Go\u2018sht yeyishni to\u2018xtatdim.)\n\nStop + to V = boshqa harakat uchun to\u2018xtash:\n  I stopped to eat lunch. (Tushlik qilish uchun to\u2018xtadim.)\n\nTry + V-ing = sinab ko\u2018rish (experiment):\n  Try adding more salt. (Ko\u2018proq tuz qo\u2018shib ko\u2018r.)\n\nTry + to V = harakat qilish (attempt):\n  I tried to open the jar but couldn\u2018t. (Bankani ochishga urindim, ammo ocholmadim.)\n\nNeed + V-ing = passive (needs to be V3):\n  The grass needs cutting. = The grass needs to be cut.\n\nNeed + to V = active:\n  I need to cut the grass.",
      mnemonic: "Stop V-ing = \u201cquit\u201d. Stop to V = \u201cpause in order to\u201d. Try V-ing = \u201cexperiment\u201d. Try to V = \u201cattempt\u201d. Need V-ing = \u201cneeds to be (done)\u201d \u2014 passive!",
      commonMistakes: "I stopped to smoke = I quit? No, I paused to smoke! I stopped smoking = I quit.\nTry to press this button = urinish? No, try pressing = sinab ko'r!",
      examples: [
        { en: 'She stopped eating sugar for a month.', uz: "U bir oy davomida shakar iste'mol qilishni to'xtatdi." },
        { en: 'She stopped to buy some sugar.', uz: "U shakar sotib olish uchun to'xtadi." }
    ],
      drills: [
        { id: 50146, type: 'fill-blank', instruction: "V-ing yoki to V?", question: 'She stopped ___ (smoke) because it is bad for health.', blanks: ['smoking'], explanation: 'Tashladi = stop + V-ing. Qoida: He stopped smoking. (Tashladi.) Stop + to V = maqsad: stopped to smoke.' },
        { id: 50147, type: 'fill-blank', instruction: "V-ing yoki to V?", question: 'He stopped ___ (buy) some water.', blanks: ['to buy'], explanation: 'Suv olish uchun toxtadi \u2192 stop + to V' },
        { id: 50148, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Try ___ this button if nothing works.', options: ['pressing', 'to press', 'press', 'pressed'], correct: 'pressing', explanation: "Sinab ko'r \u2192 try + V-ing" },
        { id: 50149, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'The room needs to clean.', errorPart: 'to clean', correct: 'The room needs cleaning.', explanation: "Passive ma'no \u2192 needs + V-ing" }
    ],
    }
    ],
  exercises: [
    { id: 50150, type: 'fill-blank', instruction: "Gerund yoki Infinitive?", question: 'I enjoy ___ (read) books.', blanks: ['reading'], explanation: 'Enjoy + V-ing — zavq olish. \'I enjoy reading books.\' (kitob o\'qishni yaxshi ko\'raman)' },
    { id: 50151, type: 'fill-blank', instruction: "Gerund yoki Infinitive?", question: 'She decided ___ (study) abroad.', blanks: ['to study'], explanation: 'Decide + to V = qaror qilmoq (+ infinitiv). Qoida: \'Decide\' dan keyin \'to + V1\': decide to go (ketishga qaror qilish). Qaror qabul qilishda ishlatiladi: We decided to buy a house.' },
    { id: 50152, type: 'fill-blank', instruction: "Gerund yoki Infinitive?", question: 'He suggested ___ (go) to the park.', blanks: ['going'], explanation: 'Suggest + V-ing — taklif qilmoq. \'I suggest studying every day.\'' },
    { id: 50153, type: 'fill-blank', instruction: "Gerund yoki Infinitive?", question: 'I want ___ (learn) English.', blanks: ['to learn'], explanation: 'Want + to V — xohlamoq. \'I want to learn English.\' (ingliz tilini o\'rganishni xohlayman)' },
    { id: 50154, type: 'fill-blank', instruction: "Gerund yoki Infinitive?", question: 'She avoids ___ (eat) junk food.', blanks: ['eating'], explanation: 'Avoid + V-ing = qochmoq, oldini olmoq. Qoida: \'Avoid\' dan keyin doim V-ing (-ing shakl) ishlatiladi: avoid making mistakes (xato qilishdan qochish). Avoid + to V XATO!' },
    { id: 50155, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'I remember ___ the door before leaving.', blanks: ['locking'], explanation: 'Eslayman (o\'tmish) → remember + V-ing. O\'tgan harakatni eslashda V-ing ishlatiladi.' },
    { id: 50156, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'Please remember ___ the door when you leave.', blanks: ['to lock'], explanation: 'Unutma (kelajak) → remember + to V. Kelajakdagi harakatni eslatishda to V ishlatiladi.' },
    { id: 50157, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'She stopped ___ because it was unhealthy.', blanks: ['smoking'], explanation: 'Tashladi = stop + V-ing. Qoida: He stopped smoking. (Tashladi.) Stop + to V = maqsad: stopped to smoke.' },
    { id: 50158, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'He stopped ___ some flowers for his wife.', blanks: ['to buy'], explanation: 'To\'xtab sotib oldi \\u2192 stop + to V' },
    { id: 50159, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'Try ___ salt if it\'s not tasty enough.', blanks: ['adding'], explanation: 'Sinab ko\'r \\u2192 try + V-ing' },
    { id: 50160, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I enjoy to swim in the pool.', errorPart: 'to swim', correct: 'I enjoy swimming in the pool.', explanation: 'Enjoy + V-ing = yoqtirmoq (V-ing bilan). Qoida: \'Enjoy\' dan keyin doim V-ing: I enjoy reading. (Men o\'qishni yoqtiraman.) \'Enjoy to read\' XATO! \'Enjoy\' + to V ishlatilmaydi!' },
    { id: 50161, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'She suggested to go to the cinema.', errorPart: 'to go', correct: 'She suggested going to the cinema.', explanation: 'Suggest + V-ing — taklif qilmoq. \'I suggest studying every day.\'' },
    { id: 50162, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I want going home now.', errorPart: 'going', correct: 'I want to go home now.', explanation: 'Want + to V — xohlamoq. \'I want to learn English.\' (ingliz tilini o\'rganishni xohlayman)' },
    { id: 50163, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'She made me to cry with her words.', errorPart: 'to cry', correct: 'She made me cry with her words.', explanation: 'Make + object + bare infinitive (to siz)' },
    { id: 50164, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I regret to tell him the truth yesterday.', errorPart: 'to tell', correct: 'I regret telling him the truth yesterday.', explanation: 'O\'tmish pushaymon \u2192 regret + V-ing. O\'tgan harakatga pushaymonlikda V-ing ishlatiladi.' },
    { id: 50165, type: 'transformation', instruction: "Gerund bilan qayta yozing:", question: 'I enjoy reading. (Use: I like ...)', hint: "I like ...", correct: 'I like reading.', explanation: 'Like + V-ing (like + to V ham mumkin)' },
    { id: 50166, type: 'transformation', instruction: "To'g'ri shaklni qo'llang:", question: 'It is important that you arrive on time. (Use: You must remember ...)', hint: 'You must remember ...', correct: 'You must remember to arrive on time.', explanation: 'Remember + to V = unutma (biror narsani qilishni eslab qol). Qoida: \'Remember + to V\' = biror ishni qilishni unutmaslik: Remember to lock the door. (Eshikni qulflashni unutma.) \'Remember + V-ing\' = qilgan ishni eslash.' },
    { id: 50167, type: 'transformation', instruction: "Stop bilan qayta yozing:", question: 'He was walking. He stopped because he wanted to smoke.', hint: 'He stopped ...', correct: 'He stopped to smoke.', explanation: "To'xtab chekdi \u2192 stop + to V" },
    { id: 50168, type: 'transformation', instruction: 'Need bilan qayta yozing:', question: 'The windows need to be cleaned.', hint: 'The windows need ...', correct: 'The windows need cleaning.', explanation: 'Need + V-ing = passive meaning' },
    { id: 50169, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["I want to learn English.", "I want learn English.", "I want learning English.", "I want to learning English."], correct: "I want to learn English.", explanation: "Want + to V \u2014 to'g'ri" },
 
    { id: 55005, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: 'I enjoy ___(1) (read/reading) books in my free time. My brother decided ___(2) (become/to become) a writer. He suggested ___(3) (join/joining) a writing club. I promised ___(4) (help/to help) him with his first story.',
      blanks: ['reading', 'to become', 'joining', 'to help'],
      acceptedAnswers: [['reading'], ['to become'], ['joining', 'to join'], ['to help']],
      explanation: 'Enjoy + V-ing (reading). Decide + to V (to become). Suggest + V-ing (joining). Promise + to V (to help).' },

    { id: 55014, type: 'connection',
      instruction: 'Rejalar va yoqtirishlar',
      prompt: 'O\'zingizning rejalaringiz va yoqtirgan ishlaringiz haqida gerund va infinitive ishlatib yozing.',
      hints: ['\'I enjoy...\'', '\'I want to...\'', '\'I decided to...\''],
      exampleAnswer: 'I enjoy reading books in my free time. I want to learn how to play the guitar. I decided to start an online course. I avoid eating too much sugar.' }
    ,
    {"id":100607,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"enjoy","options":["zavqlanmoq (+ V-ing)","qaror qilmoq (+ to V)","taklif qilmoq (+ V-ing)","xohlamoq (+ to V)"],"correct":"zavqlanmoq (+ V-ing)","explanation":"Enjoy — faqat V-ing qabul qiladi: enjoy reading, enjoy swimming."},
    {"id":100608,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"decide","options":["qaror qilmoq (+ to V)","zavqlanmoq (+ V-ing)","taklif qilmoq (+ V-ing)","qochmoq (+ V-ing)"],"correct":"qaror qilmoq (+ to V)","explanation":"Decide — faqat to + V qabul qiladi: decide to go, decide to study."},
    { id: 100553, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses a participle clause correctly?", options: ["Walking home, I saw an accident.", "Walking home, an accident was seen.", "I saw walking home an accident.", "Walked home, I saw an accident."], correct: "Walking home, I saw an accident.", explanation: "Participle clause: subject bir xil bo'lishi kerak. I = I (B1+ dan takrorlash)" },
    { id: 100555, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses a non-defining relative clause correctly?", options: ["My brother, who lives in Paris, is a designer.", "My brother who lives in Paris is a designer.", "My brother which lives in Paris is a designer.", "My brother, that lives in Paris, is a designer."], correct: "My brother, who lives in Paris, is a designer.", explanation: "Non-defining: vergul bilan, who/which (that emas) (B1+ dan takrorlash)" },


    // ── Interleaved Practice: Gerund/Infinitive + Verb Patterns ──
    { id: 95621, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "She enjoys ___ (read). He decided ___ (study) medicine.", blanks: ['reading', 'to study'], explanation: "Enjoy + V-ing. Decide + to V." },
    { id: 95622, type: 'fill-blank', instruction: "Verb + object + to V:", question: "I want you ___ (come) early. She told me ___ (be) quiet.", blanks: ['to come', 'to be'], explanation: "Want/tell + object + to V." },
    { id: 95623, type: 'error-correction', instruction: "Make + V1 (to'siz):", question: "The film made me to cry. Let me to help you.", errorPart: 'to cry / to help', correct: 'The film made me cry. Let me help you.', explanation: "Make/let + object + V1 (to'siz)." },
    { id: 95624, type: 'fill-blank', instruction: "Suggest/recommend + V-ing:", question: "I suggest ___ (start) early. She recommended ___ (try) again.", blanks: ['starting', 'trying'], explanation: "Suggest/recommend + V-ing." },
    { id: 95625, type: 'transformation', instruction: "That clause → V-ing:", question: "She suggested that we should start now. → She suggested ___ now.", hint: "She suggested ___ now.", correct: 'starting', explanation: "Suggest + that + clause → suggest + V-ing." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Gerund yoki Infinitive', color: 'bg-emerald-500', icon: '🌱', ids: [50150, 50151, 50152, 50153, 50154] },
    { title: "O'rtacha", desc: 'Ma\'no farqlari', color: 'bg-blue-500', icon: '📘', ids: [50155, 50156, 50157, 50158, 50159] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50160, 50161, 50162, 50163, 50164] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50165, 50166, 50167, 50168, 50169, 55005, 55014, 100607, 100608, 100553, 100555] },
    { title: "🔀 Aralash", desc: "Gerund/infinitiv + Verb patterns farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95621, 95622, 95623, 95624, 95625] },
  ],
  tests: [
    { id: 50170, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Enjoy dan keyin nima keladi?", blanks: ["V-ing"], explanation: "Enjoy + V-ing — zavq olish. 'I enjoy reading books.' (kitob o'qishni yaxshi ko'raman)" },
    { id: 50171, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Want dan keyin nima keladi?", blanks: ["to V"], explanation: "Want + to V — xohlamoq. 'I want to learn English.' (ingliz tilini o'rganishni xohlayman)" },
    { id: 50172, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Suggest dan keyin nima keladi?", blanks: ["V-ing"], explanation: "Suggest + V-ing — taklif qilmoq. 'I suggest studying every day.'" },
    { id: 50173, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Make dan keyin object + ...", blanks: ["V (bare)"], explanation: "Make + object + V (to'siz)" },
    { id: 50174, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Remember + V-ing va Remember + to V orasidagi farq?", blanks: ["V-ing = o'tmish, to V = kelajak"], explanation: "Remember + V-ing = eslash, Remember + to V = unutmaslik" },
    { id: 50175, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I enjoy ___ in the sea.", blanks: ["swimming"], explanation: "Enjoy + V-ing — zavq olish. 'I enjoy reading books.' (kitob o'qishni yaxshi ko'raman)" },
    { id: 50176, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "She decided ___ a new job.", blanks: ["to find"], explanation: "Decide + to V = qaror qilmoq (+ infinitiv). Qoida: 'Decide' dan keyin 'to + V1': decide to go (ketishga qaror qilish). Qaror qabul qilishda ishlatiladi: We decided to buy a house." },
    { id: 50177, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I remember ___ the letter yesterday.", blanks: ["posting"], explanation: "O'tmishni eslash \u2192 remember + V-ing" },
    { id: 50178, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Please remember ___ the letter.", blanks: ["to post"], explanation: "Unutma = remember + to V. Qoida: Remember to lock the door. (Unutma.) Remember + V-ing = o'tmishni eslash." },
    { id: 50179, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "He stopped ___ because he felt dizzy.", blanks: ["walking"], explanation: "Yurishni to'xtatdi → stop + V-ing. Faoliyatni to'xtatishda stop + V-ing ishlatiladi." },
    { id: 50180, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Try ___ this medicine \u2014 it might help.", blanks: ["taking"], explanation: "Sinab ko'r \u2192 try + V-ing" },
    { id: 50181, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "The garden needs ___ .", blanks: ["watering"], explanation: "Need + V-ing = passive meaning" },
    { id: 50182, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "She went on ___ about her trip for hours.", blanks: ["talking"], explanation: "Davom etdi → go on + V-ing. Bir xil ishni davom ettirishda go on + V-ing ishlatiladi." },
    { id: 50183, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Which is grammatically CORRECT?', options: ['I regret to say that to her.', 'I regret saying that to her. (I said it and now regret it)', 'I regret say that.', 'I regret to having said that.'], correct: 'I regret saying that to her. (I said it and now regret it)', explanation: 'O\'tmish pushaymon → regret + V-ing. O\'tgan harakatga pushaymonlikda V-ing ishlatiladi.' },
    { id: 50184, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Which sentence means \"She quit her job\"?", blanks: ["She stopped working."], explanation: "Stop + V-ing = tashlamoq (biror ishni to'xtatish). Qoida: 'Stop + V-ing' = biror narsani qilishni to'xtatish: I stopped smoking. (Men chekishni tashladim.) 'Stop + to V' = biror narsa QILISH UCHUN to'xtash." },
    ],
  testSections: [
    { title: 'Oson', desc: 'Verb patterns asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50170, 50171, 50172, 50173, 50174] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '📘', ids: [50175, 50176, 50177, 50178, 50179] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '🎯', ids: [50180, 50181, 50182] },
    { title: 'Murakkab', desc: 'Gerund/Infinitive master', color: 'bg-rose-500', icon: '🏆', ids: [50183, 50184] }
  ],
}

export const modalPerfectsB1plus: DailyLesson = {
  id: 'modal-perfects-b1plus',
  speaking: {
    prompt: "Think about a past situation that went wrong and speculate about it. Speak for about one minute. Use modal perfects — 'must have', 'might have', 'could have', 'should have', and 'would have'.",
    tips: [
      "'must have + V3' — deyarli aniq deduksiya.",
      "'might/could have + V3' — ehtimol.",
      "'should have + V3' — afsus / to'g'ri qilinmagan.",
      "'would have + V3' — shartli natija.",
    ],
    sampleAnswer: "Last month my friend didn't come to my birthday party, and I still wonder why. He might have forgotten the date, or he could have been busy with work. He must have had a good reason, because he is usually reliable. I should have called him to remind him, but I didn't. If I had invited him earlier, he would have come for sure. Maybe he didn't get my message — his phone might have been broken. I shouldn't have worried so much; I could have simply asked him the next day.",
  },
  title: 'Modal Perfects',
  subtitle: 'Must have, Might have, Should have, Could have, Would have \u2014 o\u2018tmish haqida taxmin va afsus',
  level: 'B1+',
  day: 68,
  listening: {
    transcript: "Detective: The window is broken. Someone must have entered through it.\nOfficer: Yes. They could have used a ladder.\nDetective: True. The thief might have known the family was away.\nOfficer: I think so. The owner should have locked the back door.\nDetective: He should have, but he forgot. Look — the dog didn't bark.\nOfficer: The thief must have been someone the dog knew.\nDetective: Good point. They couldn't have carried the TV alone.\nOfficer: So there must have been two people.\nDetective: Exactly. We should have checked the cameras earlier.\nOfficer: Let's do it now. They can't have gone far.",
    vocabulary: [
      { word: 'detective', definition: 'tergovchi' },
      { word: 'ladder', definition: 'narvon' },
      { word: 'thief', definition: 'o\'g\'ri' },
      { word: 'bark', definition: 'vovullamoq (it)' },
      { word: 'camera', definition: 'kamera' }
    ],
    questions: [
      { id: 90351, type: 'multiple-choice', question: "How did someone enter, according to the detective?", options: ["Through the door", "Through the broken window", "Through the roof", "Through the garage"], correctIndex: 1, explanation: "'Someone must have entered through it' — must have + V3 = strong deduction about the past." },
      { id: 90352, type: 'multiple-choice', question: "What should the owner have done?", options: ["Called the police", "Locked the back door", "Bought a dog", "Closed the window"], correctIndex: 1, explanation: "'The owner should have locked the back door' — should have = past criticism/regret." },
      { id: 90353, type: 'true-false', question: "The dog barked at the thief.", answer: false, explanation: "'the dog didn't bark... The thief must have been someone the dog knew.'" },
      { id: 90354, type: 'multiple-choice', question: "Why must there have been two people?", options: ["The dog barked twice", "They couldn't have carried the TV alone", "Two doors were open", "Neighbours saw them"], correctIndex: 1, explanation: "'They couldn't have carried the TV alone. So there must have been two people.'" },
      { id: 90355, type: 'multiple-choice', question: "What should they have done earlier?", options: ["Locked the door", "Checked the cameras", "Called the owner", "Searched the garden"], correctIndex: 1, explanation: "'We should have checked the cameras earlier.'" }
    ],
    difficulty: 'hard',
    topic: "Modal perfect — must / should / could / might + have + V3",
  },
  reading: {
    passage: "The Missing Keys\n\nWhen Sardor came home, the door was open. \"Someone must have entered the house,\" he thought, his heart beating fast. But nothing was missing. \"I might have left the door open myself,\" he said quietly. He could have lost his keys at work, or he may have dropped them on the bus.\n\nHe should have been more careful that morning. If he had checked his pockets, this would not have happened. Later, his sister called. \"You must have left your keys here,\" she laughed. Sardor felt relieved. He needn't have worried at all.",
    questions: [
      { id: 50185, type: 'multiple-choice' as const, question: "'must have entered' shows the speaker is...", options: ["almost certain","not sure","asking","guessing wildly"], correctIndex: 0, explanation: "'must have' — o'tmish haqida ishonchli xulosa." },
      { id: 50186, type: 'multiple-choice' as const, question: "'might have left' expresses...", options: ["certainty","possibility","obligation","ability"], correctIndex: 1, explanation: "'might/may have' — ehtimollik." },
      { id: 50187, type: 'multiple-choice' as const, question: "'should have been more careful' shows...", options: ["a future plan","regret/criticism about the past","ability","permission"], correctIndex: 1, explanation: "'should have' — o'tmish uchun afsus/tanqid." },
      { id: 50188, type: 'multiple-choice' as const, question: "'needn't have worried' means...", options: ["he had to worry","worrying was unnecessary","he never worried","he will worry"], correctIndex: 1, explanation: "'needn't have' — keraksiz qilingan ish." }
    ]
  },
  writing: {
    prompt: "Think about a past situation that did not go as planned. Speculate about what happened and express regret using 'must have', 'might have', 'should have', 'could have', and 'would have'.",
    modelAnswer: "Last week I missed an important job interview, and I still think about what went wrong. I must have set my alarm incorrectly, because I woke up an hour late. I should have prepared my documents the night before, but I didn't. I could have taken a taxi, yet I decided to walk and got lost. The manager might have chosen me if I had arrived on time. If I had been more careful, everything would have been different. I have certainly learned my lesson.",
    wordLimit: 90,
    tips: [
      "'must have' = you are sure: 'He must have forgotten.'",
      "'might/could have' = possibility",
      "'should have' = regret or criticism: 'I should have called.'",
      "'would have' for unreal past results"
    ],
  },
  category: 'Modals',
  formulas: [
    { label: 'Must have + V3', structure: 'Must have + V3 \u2014 strong certainty about past\nSubject + must have + past participle\nShe must have left early.\nIt must have rained last night.', explanation: "O'tmish haqida kuchli ishonch/deduksiya.", whenToUse: "O'tmishdagi narsaga deyarli aminlik bildirganda.", example: "She must have left early.", color: 'green' },
    { label: 'Might/May/Could have + V3', structure: 'Might/May/Could + have + V3 \u2014 possibility about past\nSubject + might/may/could + have + V3\nHe might have missed the bus.\nShe may have forgotten.', explanation: "O'tmish haqida ehtimol.", whenToUse: "O'tmishda nima bo'lgan bo'lishi mumkinligini taxmin qilganda.", example: "He might have missed the bus.", color: 'blue' },
    { label: 'Should have + V3', structure: 'Should/ought to + have + V3 \u2014 regret/criticism about past\nSubject + should/ought to + have + V3\nI should have studied harder.\nYou should have told me.', explanation: "O'tmishdagi afsus yoki tanqid.", whenToUse: "Qilinishi kerak bo'lgan, lekin qilinmagan ish haqida.", example: "I should have studied harder.", color: 'purple' },
    { label: 'Could have / Would have', structure: 'Could have + V3 \u2014 past ability/possibility\nWould have + V3 \u2014 hypothetical past\nI could have helped you.\nShe would have come if invited.', explanation: "'could have' — o'tmish imkoniyati; 'would have' — shartli o'tmish natijasi.", whenToUse: "O'tmishdagi imkoniyat yoki xayoliy natijani bildirganda.", example: "She would have come if invited.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 MODAL PERFECTS NIMA?\n\nModal Perfects \u2014 modal fe\u2018llar + have + V3 (past participle) birikmasi. O\u2018tmishdagi harakatlarga nisbatan taxmin, afsus, tanqid yoki imkoniyatni ifodalaydi:\n\n  She must have forgotten about the meeting.\n  (U uchrashuvni unutgan bo\u2018lishi kerak.)\n\n\uD83D\uDCCC Must have = ishonch (90-100%)\n\uD83D\uDCCC Might/May/Could have = taxmin (30-70%)\n\uD83D\uDCCC Should have = afsus, tanqid\n\uD83D\uDCCC Could have = imkoniyat (lekin qilmadi)\n\uD83D\uDCCC Would have = faraziy (if ...)",
    "2\uFE0F\u20E3 MUST HAVE + V3 \u2014 ISHONCH\n\nMust have \u2014 o\u2018tmishdagi biror narsaga ishonchimiz komil bo\u2018lganda:\n\n  The ground is wet. It must have rained last night.\n  (Yer ho\u2018l. Kecha yomg\u2018ir yog\u2018gan bo\u2018lishi kerak.)\n  \u2192 Yer ho\u2018l \u2192 yomg\u2018ir yog\u2018ganiga 100% ishonamiz.\n\n  She isn\u2018t answering her phone. She must have left already.\n  (U telefonga javob bermayapti. U allaqachon ketgan bo\u2018lishi kerak.)\n\n\uD83D\uDD34 Must have + V3 = had to (majburiyat) EMAS!\n  Must have left = ketgan bo\u2018lishi kerak (taxmin)\n  Had to leave = ketishga majbur edi (majburiyat)",
    "3\uFE0F\u20E3 MIGHT/MAY/COULD HAVE + V3 \u2014 TAXMIN\n\nMight/May/Could have \u2014 o\u2018tmishda biror narsa sodir bo\u2018lgan bo\u2018lishi mumkin, lekin aniq emas:\n\n  He might have missed the train. That\u2019s why he\u2019s late.\n  (U poyezdni boy bergan bo\u2018lishi mumkin. Shuning uchun kechikyapti.)\n  \u2192 50% taxmin.\n\n  She may have forgotten about our appointment.\n  (U uchrashuvimizni unutgan bo\u2018lishi mumkin.)\n\n  They could have taken the wrong road.\n  (Ular noto\u2018g\u2018ri yo\u2018lga kirgan bo\u2018lishlari mumkin.)\n\n\uD83D\uDD34 Might = kamroq ehtimol, May = o\u2018rta, Could = o\u2018rta. Farq juda kichik.",
    "4\uFE0F\u20E3 SHOULD HAVE + V3 \u2014 AFSUS VA TANQID\n\nShould have \u2014 o\u2018tmishda biror narsa qilish kerak edi, lekin qilinmadi (afsus/tanqid):\n\n  I should have studied harder for the exam.\n  (Imtihonga ko\u2018proq tayyorlanishim kerak edi.)\n  \u2192 Tayyorlanmadim, afsus.\n\n  You should have told me earlier.\n  (Menga avvalroq aytishing kerak edi.)\n  \u2192 Aytmading, tanqid.\n\n  She shouldn\u2018t have said that. It was rude.\n  (U buni aytmasligi kerak edi. Bu qo\u2018pollik edi.)\n  \u2192 Aytdi, noto\u2018g\u2018ri qildi.\n\n\uD83D\uDD34 Shouldn\u2018t have + V3 = qilmasligi kerak edi, lekin qildi.",
    "5\uFE0F\u20E3 COULD HAVE + V3 \u2014 IMTIYOR\n\nCould have \u2014 o\u2018tmishda biror narsani qilish imkoniyati bor edi, lekin qilinmadi:\n\n  I could have helped you, but you didn\u2018t ask.\n  (Sizga yordam berishim mumkin edi, lekin so\u2018ramadingiz.)\n  \u2192 Imkoniyat bor edi, lekin foydalanilmadi.\n\n  We could have won the match if we had tried harder.\n  (Ko\u2018proq harakat qilganimizda, o\u2018yinda g\u2018alaba qozonishimiz mumkin edi.)\n\n\uD83D\uDD34 Could have \u2014 imkoniyat bor edi, ammo amalga oshmadi.\n\uD83D\uDD34 Could have + V3 \u2014 o\u2018tmish qobiliyati (was able to but didn\u2018t).",
    "6\uFE0F\u20E3 WOULD HAVE + V3 \u2014 FARAZ\n\nWould have \u2014 o\u2018tmishdagi faraziy vaziyat. Uchinchi shart (Third Conditional) bilan ishlatiladi:\n\n  If I had known, I would have come earlier.\n  (Agar bilganimda, avvalroq kelgan bo\u2018lardim.)\n  \u2192 Bilmasdim, kelmadim.\n\n  She would have passed the exam if she had studied.\n  (O\u2018qiganida, imtihondan o\u2018tgan bo\u2018lardi.)\n  \u2192 O\u2018qimadi, o\u2018tmadi.\n\n  They wouldn\u2018t have got lost if they had taken a map.\n  (Xarita olganlarida, adashmagan bo\u2018lishardi.)\n  \u2192 Olmadilar, adashdilar.",
    "7\uFE0F\u20E3 CAN\u2018T HAVE + V3 \u2014 ISHONMASLIK\n\nCan\u2018t have + V3 \u2014 o\u2018tmishda biror narsa sodir bo\u2018lganiga ishonmaslik:\n\n  He can\u2018t have finished the project already. It\u2019s too big!\n  (U loyihani allaqachon tugatgan bo\u2018lishi mumkin EMAS. Bu juda katta!)\n  \u2192 0% imkoniyat.\n\n  She can\u2018t have left without saying goodbye.\n  (U xayrlashmay ketgan bo\u2018lishi mumkin EMAS.)\n\n\uD83D\uDD34 Must have = ishonch (+), Can\u2018t have = ishonmaslik (-).\nQiyoslang:\n  He must have arrived. (Kelgan bo\u2018lishi kerak.)\n  He can\u2018t have arrived. (Kelgan bo\u2018lishi mumkin emas.)",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 Should have da have ni tushirish: I should studied \u2192 I should have studied.\n\u2022 Must have ni had to bilan adash: I must have left (taxmin) vs I had to leave (majburiyat).\n\u2022 Can\u2018t have ni mustn\u2018t have bilan adash: He mustn\u2018t have done it (taqiq) vs He can\u2018t have done it (ishonmaslik).\n\u2022 Would have ni will have bilan adash: I would have come (faraz) vs I will have come (future perfect).\n\u2022 Not ni noto\u2018g\u2018ri joylashtirish: I shouldn\u2018t to have gone \u2192 I shouldn\u2018t have gone.\n\u2022 Have dan keyin V1 ishlatish: He must have go \u2192 He must have gone."
    ],
  vocabulary: [
    { en: 'modal perfect', uz: "modal fe'l + have + V3", example: 'She must have left already.', rule: 'Grammar' },
    { en: 'certainty', uz: 'ishonch, aniqik', example: 'Must have shows strong certainty.', rule: 'Degree' },
    { en: 'possibility', uz: 'ehtimol, mumkinlik', example: 'Might have shows possibility.', rule: 'Degree' },
    { en: 'regret', uz: 'pushaymon, afsus', example: 'Should have shows regret.', rule: 'Feeling' },
    { en: 'criticism', uz: 'tanqid', example: 'Should have is used for criticism.', rule: 'Feeling' },
    { en: 'ability', uz: 'qobiliyat, imkoniyat', example: 'Could have shows past ability.', rule: 'Modality' },
    { en: 'hypothetical', uz: 'faraziy', example: 'Would have is used in hypothetical situations.', rule: 'Condition' },
    { en: 'deduction', uz: 'xulosa', example: "Must have and can't have are used for deduction.", rule: 'Logic' },
    { en: 'assumption', uz: "taxmin, faraz", example: 'May have shows assumption about the past.', rule: 'Guess' },
    { en: 'past participle', uz: "o'tgan zamon sifatdoshi (V3)", example: 'Have + V3 is the perfect infinitive.', rule: 'Form' },
    { en: 'must have', uz: "...bo'lishi kerak edi (ishonch)", example: 'She must have left already.', rule: '~99% ishonch (xulosa)' },
    { en: 'might have', uz: "...bo'lishi mumkin edi (ehtimol)", example: 'He might have missed the bus.', rule: '~30-40% ehtimollik' },
    { en: 'should have', uz: "...qilish kerak edi (afsus/tanqid)", example: 'You should have told me earlier.', rule: 'Afsus / tanqid' },
    { en: 'could have', uz: "...qilishi mumkin edi (lekin qilmadi)", example: 'We could have won if we tried harder.', rule: 'Amalga oshmagan imkoniyat' },
    { en: "can't have", uz: "...bo'lishi mumkin emas edi (inkor)", example: "He can't have finished already — it's too fast.", rule: 'Kuchli inkor xulosa' },
    { en: "needn't have", uz: "...qilish shart emas edi (bajarildi)", example: "You needn't have bought food — we have plenty.", rule: "Keraksiz o'tgan harakat" }
    ],
  examples: [
    { en: "She must have forgotten about the meeting \u2014 she's not here.", uz: "U uchrashuvni unutgan bo'lishi kerak \u2014 u bu yerda emas." },
    { en: 'He might have missed the bus \u2014 that explains his delay.', uz: "U avtobusni boy bergan bo'lishi mumkin \u2014 bu uning kechikishini tushuntiradi." },
    { en: "I should have studied more for the final exam.", uz: "Yakuniy imtihonga ko'proq tayyorlanishim kerak edi." },
    { en: 'We could have won the match if we had played better.', uz: "Yaxshiroq o'ynaganimizda, o'yinda g'alaba qozonishimiz mumkin edi." },
    { en: "If I had known, I would have come to the party.", uz: "Bilganimda, ziyofatga kelgan bo'lardim." },
    { en: "He can't have finished all the work in one hour.", uz: "U bir soatda hamma ishni tugatgan bo'lishi mumkin emas." },
    { en: "You shouldn't have told her the secret.", uz: "Siz unga sirni aytmasligingiz kerak edi." },
    { en: "They could have taken a different road.", uz: "Ular boshqa yo'lga kirgan bo'lishlari mumkin." }
    ],
  specialCases: [
    {
      id: 'must-have-vs-had-to',
      title: 'Must have vs Had to farqi',
      rule: "Must have + V3 = o\u2018tmish haqida ishonch (deduction):\n  The lights are off. She must have gone to bed.\n  (Chiroqlar o\u2018chiq. U uxlagan bo\u2018lishi kerak.)\n\nHad to + V1 = o\u2018tmishdagi majburiyat (obligation):\n  I had to work late yesterday. (Kecha kechgacha ishlashga majbur edim.)\n\n\uD83D\uDD34 Must have + V3 = taxmin (deduction).\n\uD83D\uDD34 Had to + V1 = majburiyat (obligation).\n\n\uD83D\uDD34 Must (present) \u2192 Had to (past) for obligation:\n  I must go now. (present)\n  I had to go yesterday. (past)\n\n\uD83D\uDD34 Must have + V3 for deduction (past):\n  He must have been tired. (taxmin)",
      mnemonic: "Must have = \u201cprobably did\u201d (taxmin). Had to = \u201cwas forced to\u201d (majburiyat). Must have va had to \u2014 ikki xil narsa!",
      commonMistakes: "I must have go to the meeting yesterday (taxmin?) \u2192 I had to go to the meeting yesterday (majburiyat).\nShe must have left (taxmin: ketgan bolishi kerak) vs She had to leave (majbur: ketishga majbur edi).",
      examples: [
        { en: 'She must have left early. Her coat is gone.', uz: "U erta ketgan bo'lishi kerak. Paltosi yo'q." },
        { en: 'She had to leave early because of the emergency.', uz: "U favqulodda vaziyat sababli erta ketishga majbur edi." }
    ],
      drills: [
        { id: 50189, type: 'fill-blank', instruction: "Must have yoki Had to?", question: 'The ground is wet. It ___ rained last night.', blanks: ['must have'], explanation: 'Taxmin = must have (qattiq). Qoida: Must have + V3: He must have been tired. (Charchagan bo\'lsa kerak.) Ishonch: must > may > might.' },
        { id: 50190, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'I ___ finish the report yesterday.', options: ['must have', 'had to', 'must', 'have to'], correct: 'had to', explanation: 'O\'tmish majburiyat — had to. O\'tgan zamonda majburiyat had to bilan ifodalanadi.' },
        { id: 50191, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'She must have went home early.', errorPart: 'went', correct: 'She must have gone home early.', explanation: "Have + V3 \u2014 went emas, gone" }
    ],
    },
    {
      id: 'cant-have-vs-must-not-have',
      title: "Can\u2018t have vs Mustn\u2018t have",
      rule: "Can\u2018t have + V3 = ishonmaslik (negative deduction):\n  He can\u2018t have stolen the money. He\u2018s honest.\n  (U pulni o\u2018g\u2018irlagan bo\u2018lishi mumkin EMAS. U halol odam.)\n  \u2192 0% imkoniyat\n\nMustn\u2018t have + V3 \u2014 bu juda kam ishlatiladi. Odatda didn\u2018t need to / didn\u2018t have to ishlatiladi.\n\n  You needn\u2018t have come so early. (Barvaqt kelishingiz shart emas edi.)\n  \u2192 Keldingiz, lekin kerak emas edi.\n\n  You didn\u2018t have to come. (Kelishingiz shart emas edi.)\n  \u2192 Keldingizmi yoki yo\u2018qmi \u2014 noma\u2019lum.\n\n\uD83D\uDD34 Can\u2018t have = negative deduction (asosiy)\n\uD83D\uDD34 Needn\u2018t have = unnecessary past action (qilindi, lekin kerak emas edi)",
      mnemonic: "Can\u2018t have = \u201cimpossible\u201d (0%). Needn\u2018t have = \u201cwasn\u2018t necessary but you did\u201d (keraksiz qilindi).",
      commonMistakes: "He mustn\u2018t have left yet ( mustn\u2018t have = taqiq?) \u2192 He can\u2018t have left yet (can\u2018t have = ishonmaslik).\nYou needn\u2018t have bought it \u2014 unnecessary vs You didn\u2018t have to buy it \u2014 wasn\u2018t necessary (may or may not have bought).",
      examples: [
        { en: "She can't have arrived already \u2014 we left at the same time!", uz: "U allaqachon kelgan bo'lishi mumkin emas \u2014 biz bir vaqtda ketdik!" },
        { en: "You needn't have brought anything \u2014 we have everything.", uz: "Hech narsa olib kelishingiz shart emas edi \u2014 hammamizda bor." }
    ],
      drills: [
        { id: 50192, type: 'fill-blank', instruction: "Can't have yoki Needn't have?", question: 'He ___ left already \u2014 I saw him five minutes ago!', blanks: ["can't have"], explanation: '0% imkoniyat \u2014 can\'t have' },
        { id: 50193, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "You ___ bought so much food \u2014 there's only two of us!", options: ["can't have", "needn't have", "mustn't have", "shouldn't have"], correct: "needn't have", explanation: 'Keraksiz qilindi \u2014 needn\'t have' },
        { id: 50194, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'He mustn\'t have stolen it \u2014 he is honest.', errorPart: "mustn't have", correct: "He can't have stolen it \u2014 he is honest.", explanation: "Ishonmaslik \u2014 can't have" }
    ],
    }
    ],
  exercises: [
    { id: 50195, type: 'fill-blank', instruction: "Modal perfect qo'ying:", question: "She looks tired. She ___ (work) hard all day.", blanks: ['must have worked'], explanation: 'Taxmin \u2014 must have worked' },
    { id: 50196, type: 'fill-blank', instruction: "Modal perfect qo'ying:", question: "He isn't here. He ___ (leave) early.", blanks: ['might have left'], explanation: 'Ehtimol \u2014 might have left' },
    { id: 50197, type: 'fill-blank', instruction: "Modal perfect qo'ying:", question: "I ___ (study) more for the test. I failed.", blanks: ['should have studied'], explanation: 'Afsus \u2014 should have studied' },
    { id: 50198, type: 'fill-blank', instruction: "Modal perfect qo'ying:", question: "We ___ (win) if we had tried harder.", blanks: ['could have won'], explanation: 'Imkoniyat \u2014 could have won' },
    { id: 50199, type: 'fill-blank', instruction: "Modal perfect qo'ying:", question: 'If I had known, I ___ (come) earlier.', blanks: ['would have come'], explanation: 'Faraz = would have come (3-tip shart). Qoida: If I had known, I would have come. (Bilsam edi, kelgan bo\'lardim.) O\'tmish farazi.' },
    { id: 50200, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'The ground is wet. It ___ rained.', blanks: ['must have'], explanation: 'Yer ho\'l \\u2192 ishonch \\u2192 must have' },
    { id: 50201, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'He ___ the wrong train \\u2014 I\'m not sure.', blanks: ['might have taken'], explanation: 'Aniq emas = might have (noaniq). Qoida: Might have + V3: She might have forgotten. (Unutgan bo\'lishi mumkin.)' },
    { id: 50202, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'You ___ told me earlier. Why didn\'t you?', blanks: ['should have'], explanation: 'Tanqid = should have. Qoida: You should have told me. (Aytishing kerak edi.) Inkor: shouldn\'t have. O\'tmish afsusi.' },
    { id: 50203, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'I ___ helped you if you had asked.', blanks: ['could have'], explanation: 'Imkoniyat bor edi \\u2192 could have' },
    { id: 50204, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'She ___ left already \\u2014 I saw her car!', blanks: ['can\'t have'], explanation: 'Mashinasi bor \\u2192 can\'t have left' },
    { id: 50205, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: "I should studied harder for the exam.", errorPart: 'should studied', correct: 'I should have studied harder for the exam.', explanation: 'Should have + V3 = qilishi kerak edi (lekin qilmadi). Qoida: Should have + V3 o\'tmishdagi afsus/tavsiya: I should have studied harder. (Ko\'proq o\'qishim kerak edi.) Tanqid yoki afsus bildiradi.' },
    { id: 50206, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: "He must have go home early.", errorPart: 'go', correct: 'He must have gone home early.', explanation: 'Have + V3 \u2014 gone, go emas' },
    { id: 50207, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: "You shouldn't to have said that.", errorPart: 'to have', correct: "You shouldn't have said that.", explanation: "Shouldn't have + V3 \u2014 to kerak emas" },
    { id: 50208, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: "I must had left my keys at home.", errorPart: 'must had', correct: 'I must have left my keys at home.', explanation: 'Must have + V3 \u2014 had emas, have' },
    { id: 50209, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: "She can't has finished already!", errorPart: 'has', correct: "She can't have finished already!", explanation: "Can't have + V3 \u2014 has emas, have" },
    { id: 50210, type: 'transformation', instruction: "Modal perfect bilan qayta yozing:", question: "I'm sure she forgot about the meeting.", hint: 'She must ...', correct: 'She must have forgotten about the meeting.', explanation: 'Ishonch \u2192 must have forgotten' },
    { id: 50211, type: 'transformation', instruction: "Modal perfect bilan qayta yozing:", question: "Perhaps he missed the bus.", hint: 'He might ...', correct: 'He might have missed the bus.', explanation: 'Ehtimol \u2192 might have missed' },
    { id: 50212, type: 'transformation', instruction: "Modal perfect bilan qayta yozing:", question: "It was wrong of you to lie to her.", hint: 'You should ...', correct: "You shouldn't have lied to her.", explanation: 'Tanqid \u2192 shouldn\'t have lied' },
    { id: 50213, type: 'transformation', instruction: "Modal perfect bilan qayta yozing:", question: "I had the ability to help but I didn't.", hint: 'I could ...', correct: 'I could have helped.', explanation: 'Imkoniyat \u2192 could have helped' },
    { id: 50214, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["He must have gone home.", "He must have go home.", "He must have went home.", "He must has gone home."], correct: "He must have gone home.", explanation: "Must have + V3 \u2014 to'g'ri" },
 
    { id: 55004, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: 'She looks tired. She ___(1) (must have worked / must work) all night. She ___(2) (might have forgotten / might forget) about our meeting. She ___(3) (can\'t have slept / can\'t sleep) well with all that noise.',
      blanks: ['must have worked', 'might have forgotten', 'can\'t have slept'],
      acceptedAnswers: [['must have worked'], ['might have forgotten'], ['can\'t have slept']],
      explanation: 'Must have + V3 — ishonchli taxmin (o\'tgan). Might have + V3 — ehtimol. Can\'t have + V3 — mumkin emas (o\'tgan).' },

    { id: 55013, type: 'connection',
      instruction: 'Taxminlar',
      prompt: 'Kecha bir do\'stingiz uchrashuvga kelmadi. Nima bo\'lgan bo\'lishi mumkin? Modal perfects ishlating.',
      hints: ['\'He must have...\'', '\'He might have...\'', '\'He can\'t have...\''],
      exampleAnswer: 'He must have forgotten about our meeting. He might have been stuck in traffic. He can\'t have lost my number because I sent him a message.' }
    ,
    {"id":100609,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"must have","options":["...gan bo'lishi kerak (kuchli ishonch)","...qilish kerak edi (afsus)","...qilishi mumkin edi","...bo'lishi mumkin emas"],"correct":"...gan bo'lishi kerak (kuchli ishonch)","explanation":"Must have — o'tmish haqida kuchli ishonch (90-100%)."},
    {"id":100610,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"should have","options":["...qilish kerak edi (afsus/tanqid)","...gan bo'lishi kerak (ishonch)","...qilishi mumkin edi","...kerak emas edi"],"correct":"...qilish kerak edi (afsus/tanqid)","explanation":"Should have — o'tmish uchun afsus yoki tanqid bildiradi."},
    { id: 100557, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses 'remember + V-ing' correctly?", options: ["I remember locking the door yesterday.", "I remember to lock the door yesterday.", "I remember lock the door yesterday.", "I remember locked the door yesterday."], correct: "I remember locking the door yesterday.", explanation: "Remember + V-ing = o'tmishdagi harakatni eslash (B1+ dan takrorlash)" },
    { id: 100559, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses a modal verb in the past correctly?", options: ["They should have told me.", "They should has told me.", "They should have tell me.", "They should had told me."], correct: "They should have told me.", explanation: "Modal + have + V3 = o'tmishdagi modal (B1+ dan takrorlash)" },


    // ── Interleaved Practice: Modal Perfects + Conditionals ──
    { id: 95631, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I ___ studied more (regret). The ground is wet; it ___ rained (certain).", blanks: ['should have', 'must have'], explanation: "Regret → should have. Certain past → must have." },
    { id: 95632, type: 'fill-blank', instruction: "Needn't have vs didn't need to:", question: "You ___ worried — it was fine. I ___ go, so I stayed.", blanks: ['needn\'t have', 'didn\'t need to'], explanation: "Did unnecessarily → needn't have. Didn't go → didn't need to." },
    { id: 95633, type: 'error-correction', instruction: "Can't have vs must have:", question: "She passed easily; it must have been hard. He's honest; he must have lied.", errorPart: 'must have been hard / must have lied', correct: "She passed easily; it can't have been hard. He's honest; he can't have lied.", explanation: "If it was easy in reality → can't have been. If he's honest → can't have lied." },
    { id: 95634, type: 'fill-blank', instruction: "Might have vs should have:", question: "He's late; he ___ missed the bus. You ___ told me earlier (regret).", blanks: ['might have', 'should have'], explanation: "Possibility → might have. Regret → should have." },
    { id: 95635, type: 'transformation', instruction: "Past certain → must have:", question: "I'm sure she finished it. → She ___ finished it.", hint: "She ___ finished it.", correct: 'must have', explanation: "I'm sure → must have (past deduction)." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Modal perfect turlari', color: 'bg-emerald-500', icon: '🌱', ids: [50195, 50196, 50197, 50198, 50199] },
    { title: "O'rtacha", desc: 'Tanlash mashqlari', color: 'bg-blue-500', icon: '📘', ids: [50200, 50201, 50202, 50203, 50204] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50205, 50206, 50207, 50208, 50209] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50210, 50211, 50212, 50213, 50214, 55004, 55013, 100609, 100610, 100557, 100559] },
    { title: "🔀 Aralash", desc: "Modal perfects + Conditionals farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95631, 95632, 95633, 95634, 95635] },
  ],
  tests: [
    { id: 50215, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Must have + V3 qanday ma'noni ifodalaydi?", blanks: ["ishonch (deduction)"], explanation: 'Must have = ishonch — "Must have" so\'zining tarjimasi' },
    { id: 50216, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Might have + V3 qanday ma'no?", blanks: ["taxmin (possibility)"], explanation: 'Might have = taxmin — "Might have" so\'zining tarjimasi' },
    { id: 50217, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Should have + V3 qanday ma'no?", blanks: ["afsus/tanqid"], explanation: 'Should have = afsus — "Should have" so\'zining tarjimasi' },
    { id: 50218, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Could have + V3 qanday ma'no?", blanks: ["imkoniyat (lekin qilinmadi)"], explanation: "Could have = imkoniyat" },
    { id: 50219, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Would have + V3 qayerda ishlatiladi?", blanks: ["third conditional"], explanation: "Would have = third conditional" },
    { id: 50220, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "She looks pale. She ___ been ill.", blanks: ["must have"], explanation: "Ishonch bildirganda \u2018must have\u2019 ishlatiladi (o\u2018tmishdagi ishonchli taxmin)" },
    { id: 50221, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I'm not sure why he's late. He ___ missed the bus.", blanks: ["might have"], explanation: "Aniq emas \u2192 might have" },
    { id: 50222, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "You ___ told me the truth from the start.", blanks: ["should have"], explanation: "Tanqid \u2192 should have" },
    { id: 50223, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "If we had left earlier, we ___ caught the train.", blanks: ["would have"], explanation: "Third conditional \u2192 would have" },
    { id: 50224, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "He ___ finished already \u2014 it's only 9 AM!", blanks: ["can't have"], explanation: "Ishonmaslik \u2192 can't have" },
    { id: 50225, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "You ___ bought so much food. There's plenty at home.", blanks: ["needn't have"], explanation: "Keraksiz qilindi \u2192 needn't have" },
    { id: 50226, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence shows DEDUCTION?", options: ["I must have left my keys.", "I must had left my keys.", "I must have not left my keys.", "I must haven't left my keys."], correct: "I must have left my keys.", explanation: "Must have = deduction = ...gan bo'lsa kerak (taxmin). Qoida: Must have + V3 o'tmishdagi ishonchli taxmin: He must have left early. (U erta ketgan bo'lsa kerak.) Ishonch darajasi: must have > may have > might have." },
    { id: 50227, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I ___ to the meeting yesterday because I was ill.", blanks: ["couldn't go"], explanation: "Kasal edim \u2192 couldn't go (imkonsiz)" },
    { id: 50228, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Which sentence means 'You did it, but it wasn't necessary'?", blanks: ["You needn't have done it."], explanation: "Needn't have = keraksiz qilindi" },
    { id: 50229, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is CORRECT?", options: ["She might have forgotten.", "She might have forget.", "She might have forgot.", "She might has forgotten."], correct: "She might have forgotten.", explanation: "Might have + V3 \u2014 to'g'ri" },
    ],
  testSections: [
    { title: 'Oson', desc: 'Modal perfect asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50215, 50216, 50217, 50218, 50219] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '📘', ids: [50220, 50221, 50222, 50223, 50224] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '🎯', ids: [50225, 50226, 50227] },
    { title: 'Murakkab', desc: 'Modal perfect master', color: 'bg-rose-500', icon: '🏆', ids: [50228, 50229] }
  ],
}

export const emphasisDoesB1plus: DailyLesson = {
  id: 'emphasis-does-b1plus',
  speaking: {
    prompt: "Defend an opinion that people often disagree with, or correct a misunderstanding about yourself. Speak for about one minute. Use emphatic 'do', 'does', and 'did' to make your points stronger.",
    tips: [
      "'I DO believe...' — ishonchni kuchaytiradi.",
      "'She DOES work hard' — shubhani rad etadi.",
      "'I DID tell you' — o'tmish tasdig'i.",
      "Odatda gapga urg'u/ehtiros qo'shish uchun.",
    ],
    sampleAnswer: "People often say that young people don't read books, but I do disagree. I do read every day, and my friends do too. Some think that learning grammar is boring, yet I do find it fascinating. My teacher once doubted me, but I did prove her wrong by passing the exam. It is true that I failed once; however, I did learn from that failure. I do believe that anyone can succeed with effort. So when people say English is too difficult, I always reply: 'It does take time, but it does get easier.'",
  },
  title: 'Emphasis: do/does/did',
  subtitle: 'Do, Does, Did \u2014 gapga kuch va urg\u2018u berish san\u2018ati',
  level: 'B1+',
  day: 69,
  listening: {
    transcript: "Teacher: You didn't finish your essay.\nStudent: I did finish it! I do work hard, I promise.\nTeacher: Really? I didn't receive it.\nStudent: I did send it, by email. It does say 'sent' on my screen.\nTeacher: Strange. I do believe you, but let me check.\nStudent: Please do. I really did spend hours on it.\nTeacher: Ah, here it is! It did arrive — in my spam folder.\nStudent: See? I told you I did submit it!\nTeacher: You did. I'm sorry. You do deserve a good grade.\nStudent: Thank you! I do appreciate that.",
    vocabulary: [
      { word: 'essay', definition: 'insho' },
      { word: 'receive', definition: 'olmoq, qabul qilmoq' },
      { word: 'submit', definition: 'topshirmoq' },
      { word: 'deserve', definition: 'loyiq bo\'lmoq' },
      { word: 'appreciate', definition: 'qadrlamoq, minnatdor bo\'lmoq' }
    ],
    questions: [
      { id: 90361, type: 'multiple-choice', question: "What does the student emphasise about the essay?", options: ["That it was short", "That he did finish and send it", "That it was difficult", "That he was late"], correctIndex: 1, explanation: "'I did finish it!' and 'I did send it' — do/did for emphasis." },
      { id: 90362, type: 'multiple-choice', question: "How did the student send the essay?", options: ["On paper", "By email", "By post", "In person"], correctIndex: 1, explanation: "'I did send it, by email.'" },
      { id: 90363, type: 'true-false', question: "The teacher never received the essay at all.", answer: false, explanation: "'It did arrive — in my spam folder.'" },
      { id: 90364, type: 'multiple-choice', question: "Where did the email arrive?", options: ["The inbox", "The spam folder", "The trash", "A different account"], correctIndex: 1, explanation: "'in my spam folder.'" },
      { id: 90365, type: 'multiple-choice', question: "What does the teacher say the student deserves?", options: ["A warning", "A good grade", "Extra homework", "Another chance"], correctIndex: 1, explanation: "'You do deserve a good grade.'" }
    ],
    difficulty: 'hard',
    topic: "Ta'kid — emphatic do / does / did",
  },
  reading: {
    passage: "Believe Me\n\nMany people thought that Kamola did not work hard. \"But I do study every night,\" she insisted. \"I did finish all my homework, and I do care about my grades.\" Her teacher smiled. \"I know you do try,\" he said.\n\nKamola wanted to prove them wrong. She did pass the final exam with the highest mark. \"You see, I did tell you the truth,\" she said. Even her classmates admitted that she did deserve the prize. Sometimes one strong word does make a difference, and Kamola's example does show that effort matters.",
    questions: [
      { id: 50230, type: 'multiple-choice' as const, question: "Why does Kamola say 'I DO study every night'?", options: ["To ask a question","To add emphasis / contradict","To show the future","To show the past only"], correctIndex: 1, explanation: "Emphatic 'do' — kuch berish, e'tirozga javob." },
      { id: 50231, type: 'multiple-choice' as const, question: "In 'I DID finish', the main verb is in...", options: ["past form","base form","-ing form","past participle"], correctIndex: 1, explanation: "'did' + base verb (finish, not finished)." },
      { id: 50232, type: 'multiple-choice' as const, question: "'one strong word does make a difference' — 'does' here...", options: ["asks something","emphasises the statement","shows possibility","is a mistake"], correctIndex: 1, explanation: "Emphatic 'does' uchinchi shaxs uchun." },
      { id: 50233, type: 'multiple-choice' as const, question: "Emphatic do/does/did is used to...", options: ["form questions only","strengthen or insist on a statement","make negatives","show the future"], correctIndex: 1, explanation: "Tasdiqni kuchaytirish uchun." }
    ]
  },
  writing: {
    prompt: "Write a paragraph defending an opinion or correcting a misunderstanding. Use emphatic 'do/does/did' to make your statements stronger.",
    modelAnswer: "Some people say that I don't work hard, but I do care about my studies very much. It is true that I failed one test, but I did prepare for it carefully. My teacher does understand my situation, and she does believe in me. I may make mistakes, but I do learn from them. People often misunderstand quiet students; however, we do think deeply, and we do want to succeed. So please, do give me a second chance — I promise I will not disappoint you.",
    wordLimit: 80,
    tips: [
      "Add 'do/does/did' before the base verb: 'I do like it!'",
      "Use it to contradict: 'You think I forgot, but I did remember.'",
      "Keep the main verb in the base form",
      "Use it for strong agreement or insistence"
    ],
  },
  category: 'Emphasis',
  formulas: [
    { label: 'Present Emphasis', structure: 'Subject + do/does + V1\nI do understand your point.\nShe does work very hard.\nWe do want to help.', explanation: "'do/does + fe'l' hozirgi gapni kuchaytiradi.", whenToUse: "Fikrni qat'iy ta'kidlaganda yoki shubhani rad etganda.", example: "I do understand your point.", color: 'green' },
    { label: 'Past Emphasis', structure: 'Subject + did + V1\nI did see him yesterday.\nShe did finish the project.\nThey did arrive on time.', explanation: "'did + fe'l' o'tmish gapini kuchaytiradi.", whenToUse: "O'tmish harakatini ta'kidlab tasdiqlaganda.", example: "I did see him yesterday.", color: 'blue' },
    { label: 'Imperative Emphasis', structure: 'Do + V1 (polite invitation/emphasis)\nDo sit down.\nDo help yourself.\nDo be careful!', explanation: "'Do + fe'l' buyruqni muloyim yoki ta'kidli qiladi.", whenToUse: "Muloyim taklif yoki kuchli iltimos qilganda.", example: "Do sit down.", color: 'purple' },
    { label: 'Negative Emphasis', structure: 'Subject + do/does/did + not + V1 (contrast)\nI do not agree with you at all.\nShe does not like him, not at all.\nWe did not expect this result.', explanation: "'do/does/did not' inkorni kuchaytiradi.", whenToUse: "Qat'iy inkor yoki qarama-qarshilikni ta'kidlaganda.", example: "I do not agree at all.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 EMPHATIC DO NIMA?\n\nEmphatic do \u2014 gapga kuch va urg\u2018u berish uchun ishlatiladi. Odatda do savol va inkorlarda ishlatiladi, lekin TASDIQ gaplarda ham kuch berish uchun qo\u2018llanadi:\n\n  I do like this song! (Men bu qo\u2018shiqni YAXSHI KO\u2018RAMAN!)\n  \u2192 Oddiy: I like this song.\n  \u2192 Emphatic: I DO like this song! (kuchli)\n\n\uD83D\uDCCC Do/Does \u2014 present tense\n\uD83D\uDCCC Did \u2014 past tense\n\uD83D\uDCCC Asosiy fe\u2018l V1 (base form) shaklida qoladi",
    "2\uFE0F\u20E3 PRESENT EMPHASIS (do/does)\n\nHozirgi zamon tasdiq gaplarida urg\u2018u uchun do (I/you/we/they) yoki does (he/she/it) ishlatiladi:\n\n  I do understand your feelings.\n  (Men sizning hislaringizni TUSHUNAMAN.)\n  \u2192 \u201cdo\u201d = haqiqatan tushunaman, ishontirish.\n\n  She does work very hard.\n  (U haqiqatan qattiq ishlaydi.)\n  \u2192 \u201cdoes\u201d = haqiqatan, ikkilanmasdan.\n\n\uD83D\uDD34 Does dan keyin fe\u2018l V1 (works emas, work):\n  She works hard. \u2192 She does work hard. \u2714\n  (does + work, works emas)",
    "3\uFE0F\u20E3 PAST EMPHASIS (did)\n\nO\u2018tgan zamon uchun did ishlatiladi. Asosiy fe\u2018l V1 shaklida qoladi:\n\n  I did see him yesterday.\n  (Men uni kecha KO\u2018RDIM.)\n  \u2192 \u201cdid\u201d = ko\u2018rganimni tasdiqlayman.\n\n  She did finish the project on time.\n  (U loyihani vaqtida TUGATDI.)\n  \u2192 \u201cdid\u201d = tugatganiga ishontirish.\n\n  They did arrive, but very late.\n  (Ular KELISHDI, lekin juda kech.)\n  \u2192 \u201cdid\u201d = zidlik (contrast).\n\n\uD83D\uDD34 Did + V1 (finished emas, finish):\n  She finished \u2192 She did finish. \u2714",
    "4\uFE0F\u20E3 EMPHATIC DO NIMA UCHUN ISHLATILADI?\n\n1) ZIDLIK (Contrast):\n  I don\u2018t agree with you, but I do respect your opinion.\n  (Men siz bilan qo\u2018shilmayman, lekin fikringizni HURMAT QILAMAN.)\n\n2) ISHONTIRISH (Insistence):\n  A: You didn\u2018t lock the door!\n  B: I DID lock the door!\n  (A: Eshikni berkitmading! B: BERKITDIM!)\n\n3) TA'AJJUB (Surprise):\n  So you do know the answer!\n  (Demak, siz javobni BILAR EKANSIZ!)\n\n4) POLITE INVITATION:\n  Do come in! (Kiring, marhamat!)\n  Do sit down! (O\u2018tiring, marhamat!)",
    "5\uFE0F\u20E3 EMPHATIC DO \u2014 TALAFFUZ\n\nEmphatic do juda kuchli talaffuz qilinadi \u2014 odatdagidan ancha balandroq va uzoqroq:\n\n  Normal: I \u2018like it. (oddiy, tez)\n  Emphatic: I \u2018DO like it! (do kuchli, pauza bilan)\n\n\uD83D\uDD34 Yozma ingliz tilida emphatic do \u2014 italics yoki bold bilan ko\u2018rsatiladi:\n  I do understand.\n  She does work hard.\n\n\uD83D\uDD34 So\u2018zlashuvda do \u2014 juda baland ovoz va urg\u2018u bilan aytiladi.\n\uD83D\uDD34 Adverbs (really, certainly, definitely) ham urg\u2018u uchun ishlatiladi:\n  I really do like it!",
    "6\uFE0F\u20E3 DO + BE (Buyruq gaplar)\n\nBe fe\u2018li bilan do imperative (buyruq) gaplarda kuch berish uchun ishlatiladi:\n\n  Do be careful! (Ehtiyot bo\u2018ling! \u2014 kuchli)\n  Do be quiet, please! (Jim bo\u2018ling, iltimos! \u2014 kuchli)\n  Don\u2018t be late! (Kechikmang!)\n\nEslatma: Be bilan do faqat imperative da ishlatiladi. Tasdiq gaplarda be bilan do ishlatilmaydi:\n  \u2714 I am happy. \u2192 I do be happy. \u274C\n\n\uD83D\uDD34 Do + be = faqat buyruq gapda (imperative).\n\uD83D\uDD34 Do + V = tasdiq gapda.",
    "7\uFE0F\u20E3 DO/DOES/DID \u2014 BOSHQA URG\u2018U USULLARI\n\nEmphatic do dan tashqari urg\u2018u berishning boshqa usullari:\n\n1) Really / Certainly / Definitely + verb:\n  I really like this. (Men buni haqiqatan yoqtiraman.)\n  She definitely knows the answer. (U albatta javobni biladi.)\n\n2) Inversion (teskari tartib):\n  Not only did he come late, but he also left early.\n  (U nafaqat kech keldi, balki erta ketdi.)\n\n3) Fronting (oldinga chiqarish):\n  That I do not understand. (Buni men tushunmayman.)\n\n4) Repetition:\n  He is, and always will be, my best friend.",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 Do/does/did dan keyin V3 ishlatish: I did seen him \u2192 I did see him.\n\u2022 Does dan keyin -s qo\u2018shish: She does works hard \u2192 She does work hard.\n\u2022 Be bilan emphatic do ni ishlatish: I do be happy \u2192 I am happy (be bilan do faqat imperative da).\n\u2022 Do ni noto\u2018g\u2018ri joylashtirish: I like do it \u2192 I do like it.\n\u2022 Emphatic do ni hamma gapda ishlatish \u2014 faqat urg\u2018u kerak bo\u2018lganda.\n\u2022 O\u2018zbek tilida \u201c-ha\u201d qo\u2018shimchasi (Men KO\u2018RDIM-HA!) \u2014 ingliz tilida do/did."
    ],
  vocabulary: [
    { en: 'emphasis', uz: 'urg\u2019u, kuch', example: 'Do is used for emphasis in positive sentences.', rule: 'Concept' },
    { en: 'emphatic', uz: 'urg\u2019uli, kuchaytirilgan', example: 'An emphatic sentence uses do/does/did.', rule: 'Adjective' },
    { en: 'insist', uz: 'turib olmoq, qattiq ta\'kidlamoq', example: 'I do insist that you are wrong!', rule: 'Attitude' },
    { en: 'contrast', uz: 'zidlik, qarama-qarshi', example: 'Emphatic do is used for contrast.', rule: 'Function' },
    { en: 'contradict', uz: 'zid kelmoq, inkor etmoq', example: 'I did see him \u2014 I\'m not lying!', rule: 'Response' },
    { en: 'deny', uz: 'inkor qilmoq', example: 'She does not like him at all.', rule: 'Negative' },
    { en: 'confirm', uz: 'tasdiqlamoq', example: 'Yes, I do agree with you.', rule: 'Affirmation' },
    { en: 'polarity', uz: 'musbat/manfiy qutb', example: 'Emphatic do reinforces positive polarity.', rule: 'Grammar' },
    { en: 'intonation', uz: 'ohang, talaffuz', example: 'Emphatic do is stressed in speech.', rule: 'Speaking' },
    { en: 'imperative', uz: 'buyruq mayli', example: 'Do sit down \u2014 polite imperative.', rule: 'Mood' }
    ],
  examples: [
    { en: 'I do understand how you feel \u2014 believe me!', uz: "Men sizning hislaringizni TUSHUNANMAN \u2014 ishoning!" },
    { en: "She does work very hard, even on weekends.", uz: "U HAQIQATAN qattiq ishlaydi, hatto dam olish kunlarida ham." },
    { en: "I did see him yesterday at the supermarket.", uz: "Men uni kecha supermarketda KO'RDIM." },
    { en: "A: You didn't lock the door! B: I DID lock it!", uz: "A: Eshikni berkitmading! B: BERKITDIM!" },
    { en: "I don't agree with you, but I do respect your opinion.", uz: "Men siz bilan qo'shilmayman, lekin fikringizni HURMAT QILAMAN." },
    { en: "Do come in and make yourself at home!", uz: "KIRING va o'zingizni uydagidek his qiling!" },
    { en: "So you do know how to solve this problem!", uz: "Demak, siz bu muammoni qanday hal qilishni BILAR EKANSIZ!" },
    { en: "We did finish the project, but it was very difficult.", uz: "Biz loyihani TUGATDIK, lekin juda qiyin edi." }
    ],
  specialCases: [
    {
      id: 'emphatic-do-vs-auxiliary',
      title: 'Emphatic do vs Auxiliary do farqi',
      rule: "Do uch xil vazifada keladi:\n\n1) Asosiy fe\u2018l (main verb):\n  I do my homework every day. (Uy vazifasini qilaman.)\n  \u2192 do = asosiy fe\u2018l (bajaraman)\n\n2) Yordamchi fe\u2018l (auxiliary) \u2014 savol/inkor:\n  Do you like coffee? (Kofe yoqtirasizmi?)\n  I don\u2018t like coffee. (Kofe yoqtirmayman.)\n  \u2192 do = grammatik vazifa, ma\u2019nosi yo\u2018q\n\n3) Emphatic do \u2014 urg\u2018u:\n  I DO like coffee! (Kofeni YAXSHI KO\u2018RAMAN!)\n  \u2192 do = urg\u2018u, kuchli talaffuz\n\n\uD83D\uDD34 Emphatic do \u2014 faqat tasdiq gaplarda, urg\u2018u bilan.\n\uD83D\uDD34 Auxiliary do \u2014 savol va inkorlarda, urg\u2018usiz.",
      mnemonic: "Auxiliary do = savol/inkor (grammatika). Emphatic do = tasdiq (kuch). \u201cDo you know?\u201d = auxiliary. \u201cI DO know!\u201d = emphatic.",
      commonMistakes: "I do my homework (main verb) vs I DO like it (emphatic). Ma'no farqiga e'tibor bering!\nI do like (emphatic) vs Do I like? (auxiliary question).",
      examples: [
        { en: 'I do my work every day. (main verb = do)', uz: "Men har kuni ishimni qilaman." },
        { en: 'I DO work every day! (emphatic)', uz: "Men har kuni ISHLAYMAN!" }
    ],
      drills: [
        { id: 50234, type: 'fill-blank', instruction: 'Emphatic do yoki auxiliary?', question: 'I ___ like this song very much! (emphatic)', blanks: ['do'], explanation: 'Emphatic = kuchli urg\'u. Qoida: Do/does/did + V1 urg\'u: I DO agree! (ROZIMAN!) Og\'zaki nutqda kuchli his-tuyg\'u.' },
        { id: 50235, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Which sentence uses EMPHATIC do?', options: ['Do you know her?', 'I do not like it.', 'I do understand!', 'She does her work.'], correct: 'I do understand!', explanation: 'Emphatic do \u2014 tasdiq, kuchli' },
        { id: 50236, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I did saw him yesterday at the mall.', errorPart: 'saw', correct: 'I did see him yesterday at the mall.', explanation: 'Did + V1 (saw emas). Qoida: Did you SEE the movie? (Filmni ko\'rdingmi?) \'Did saw\' XATO! \'Did\' + V2 ishlatilmaydi.' }
    ],
    },
    {
      id: 'emphatic-imperative',
      title: 'Do + Imperative (Buyruq gaplar)',
      rule: "Do + imperative \u2014 kuchli iltimos yoki taklif:\n\n  Do sit down and relax.\n  (O\u2018TIRING va dam oling, marhamat.)\n\n  Do help yourself to some tea.\n  (Choydan O\u2018ZINGIZGA OLING, marhamat.)\n\n  Do be careful on the mountain road.\n  (Tog\u2018 yo\u2018lida EHTIYOT BO\u2018LING!)\n\n  Don\u2018t be late for the meeting.\n  (Uchrashuvga kechikmang.)\n\n\uD83D\uDD34 Do + imperative \u2014 rasmiy va mehmonnavoz.\n\uD83D\uDD34 Don\u2018t + imperative \u2014 taqiq.\n\uD83D\uDD34 Be bilan do faqat imperative da ishlatiladi.",
      mnemonic: "Do + imperative = polite but strong request. \u201cDo sit down\u201d = Please sit down (but stronger). \u201cSit down\u201d = oddiy buyruq.",
      commonMistakes: "I do be happy! -- XATO (be bilan do faqat imperative da).\nDo be careful! -- TO'G'RI (imperative).\nDo you be careful! -- XATO (savol shaklida be bilan do ishlatilmaydi).",
      examples: [
        { en: 'Do write to us when you arrive!', uz: "Yetib borgach, BIZGA YOZING!" },
        { en: 'Do enjoy your holiday to the fullest!', uz: "TA'TILDAN to'liq zavqlaning!" }
    ],
      drills: [
        { id: 50237, type: 'fill-blank', instruction: "Do + imperative qo'ying:", question: '___ (sit) down and make yourself comfortable.', blanks: ['Do sit'], explanation: 'Do + sit \u2014 polite imperative' },
        { id: 50238, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Which is a polite imperative with DO?', options: ['Do you go?', 'I do go.', 'Do go now.', 'Not do go.'], correct: 'Do go now.', explanation: 'Do + go \u2014 polite imperative' },
        { id: 50239, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I do be happy with my new job.', errorPart: 'do be', correct: 'I am happy with my new job.', explanation: 'Be bilan do faqat imperative da' }
    ],
    }
    ],
  exercises: [
    { id: 50240, type: 'fill-blank', instruction: "Emphatic do/does qo'ying:", question: 'I ___ like this song! It\'s amazing!', blanks: ['do'], explanation: 'Emphatic do \u2014 present, I bilan' },
    { id: 50241, type: 'fill-blank', instruction: "Emphatic do/does qo'ying:", question: 'She ___ work very hard. Everyone respects her.', blanks: ['does'], explanation: 'Emphatic does — she bilan ishlatiladi. Qoida: does + V1: She does work hard (ta\'kid).' },
    { id: 50242, type: 'fill-blank', instruction: "Emphatic did qo'ying:", question: 'I ___ see him yesterday at the party.', blanks: ['did'], explanation: 'Did + V1 = o\'tgan zamon urg\'u. I DID finish = TUGATDIM! (ta\'kid bilan).' },
    { id: 50243, type: 'fill-blank', instruction: "Emphatic do + imperative qo'ying:", question: '___ (be) careful on the icy roads!', blanks: ['Do be'], explanation: 'Do be \u2014 imperative with be' },
    { id: 50244, type: 'fill-blank', instruction: "Emphatic do bilan to'ldiring:", question: "A: You didn't call me! B: I ___ call you!", blanks: ['did'], explanation: 'Emphatic did \u2014 answer to accusation' },
    { id: 50245, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'I ___ understand your point of view.', blanks: ['do'], explanation: 'I + do (present emphatic) = hozirgi zamonda urg\'u. Qoida: I + do + V1: I do understand. (Men tushunaman - ta\'kidlab.) Inkor: I don\'t understand. Savol: Do you understand?' },
    { id: 50246, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'She ___ work in that office, believe me!', blanks: ['does'], explanation: 'She + does (present emphatic) = 3-shaxs urg\'u. Qoida: Does + V1: She does work here. (U shu erda ishlaydi - ta\'kidlab.) \'Does works\' XATO! \'Does\' dan keyin V1 (toza fe\'l).' },
    { id: 50247, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'I ___ finish the report yesterday.', blanks: ['did'], explanation: 'Yesterday + did (past emphatic)' },
    { id: 50248, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ come in and make yourself at home!', blanks: ['Do'], explanation: 'Do + imperative \\u2014 polite invitation' },
    { id: 50249, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses emphatic DO for contrast?", options: ["I don't agree, but I do respect you.", "I don't agree, but I did respect you.", "I don't agree, but I do not respect you.", "I don't agree, but I don't respect you."], correct: "I don't agree, but I do respect you.", explanation: "Contrast — don't agree vs do respect. Emphatic do qarama-qarshilikni bildiradi." },
    { id: 50250, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I did saw him at the station.', errorPart: 'saw', correct: 'I did see him at the station.', explanation: 'Did + V1 — o\'tgan zamon. Qoida: Did you go? (Bordingmi?) V2 emas, V1 ishlatiladi.' },
    { id: 50251, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'She does works in a hospital.', errorPart: 'works', correct: 'She does work in a hospital.', explanation: 'Does + V1 = 3-shaxs savol. Qoida: Does she work? (Ishlaydimi?) \'Does\' dan keyin V1 (works emas). Does allaqachon 3-shaxsni bildiradi.' },
    { id: 50252, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I do be happy with my results.', errorPart: 'do be', correct: 'I am happy with my results.', explanation: 'Be bilan do faqat imperative da ishlatiladi. Oddiy gapda do + be XATO.' },
    { id: 50253, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'A: You didn\'t call! B: I did called you!', errorPart: 'called', correct: 'A: You didn\'t call! B: I did call you!', explanation: 'Did + V1 = o\'tgan zamon (fe\'l V1). Qoida: Did you call me? (Menga qo\'ng\'iroq qildingmi?) \'Did call\' (called emas). Did o\'tgan zamonni bildiradi, V1 qoladi.' },
    { id: 50254, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Do you be quiet, please!', errorPart: 'Do you be', correct: 'Do be quiet, please!', explanation: 'Do + be \u2014 imperative, you kerak emas' },
    { id: 50255, type: 'transformation', instruction: "Emphatic ga o'zgartiring:", question: 'I like this film. (emphatic)', hint: 'I ...', correct: 'I do like this film!', explanation: 'I + do + like = urg\'u berish (do + V1). Qoida: Hozirgi zamonda urg\'u: I do like it! (Menga yoqadi! - ta\'kidlab.) \'Do\' urg\'u fe\'li sifatida: I do love you. (Men seni sevaman! - kuchli his-tuyg\'u.)' },
    { id: 50256, type: 'transformation', instruction: "Emphatic ga o'zgartiring:", question: 'She works hard. (emphatic)', hint: 'She ...', correct: 'She does work hard!', explanation: 'She + does + work = urg\'u (does + V1). Qoida: \'Does + work\' = ishlaydi (ta\'kidlab). \'She works\' oddiy gap. \'She DOES work\' - kimdir ishlamaydi deb o\'ylaganda ishlatiladi.' },
    { id: 50257, type: 'transformation', instruction: "Emphatic ga o'zgartiring:", question: 'He arrived on time. (emphatic)', hint: 'He ...', correct: 'He did arrive on time!', explanation: 'He + did + arrive = o\'tgan zamonda urg\'u (did + V1). Qoida: \'Did + arrive\' = keldi (ta\'kidlab). Oddiy: He arrived. Urg\'uli: He DID arrive on time! (U o\'z vaqtida KELDI!)' },
    { id: 50258, type: 'transformation', instruction: 'Imperative \u2192 polite:', question: 'Sit down. (make it polite)', hint: 'Do ...', correct: 'Do sit down.', explanation: 'Do + imperative = muloyim buyruq. Qoida: Do sit down. (Marhamat, o\'tiring.) Oddiy \'Sit down\' qattiq, \'Do sit down\' muloyim.' },
    { id: 50259, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["I do understand!", "I do understands!", "I does understand!", "I am do understand!"], correct: "I do understand!", explanation: "I + do + V1 \u2014 to'g'ri" },
 
    { id: 55003, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: 'I ___(1) (do/does) enjoy learning English! My sister ___(2) (do/does) speak three languages fluently. We ___(3) (do/does) need to practise every day. She ___(4) (do/does) understand the importance of education.',
      blanks: ['do', 'does', 'do', 'does'],
      acceptedAnswers: [['do'], ['does'], ['do'], ['does']],
      explanation: 'Do/does + V1 — urg\'u (emphasis). I/we/you/they → do. He/she/it → does.' },

    { id: 55012, type: 'connection',
      instruction: 'Ta\'kidlash',
      prompt: 'Do/does/did bilan urg\'u berib, o\'z qobiliyatlaringiz haqida yozing.',
      hints: ['\'I do enjoy...\'', '\'She does speak...\'', '\'He did finish...\''],
      exampleAnswer: 'I do enjoy learning English every day! She does speak three languages fluently. He did finish the project on time. We do need to practise more.' }
    ,
    {"id":101743,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"emphatic do","options":["tasdiq gaplarda urg'u berish","savol yasash","inkor qilish","kelajakni bildirish"],"correct":"tasdiq gaplarda urg'u berish","explanation":"Emphatic do — tasdiq gapida kuch berish: I DO like it!"},
    {"id":101744,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"did + V1","options":["o'tgan zamonda urg'u","hozirgi zamon urg'u","savol yasash","buyruq"],"correct":"o'tgan zamonda urg'u","explanation":"Did + V1 — o'tmishdagi urg'u: I DID finish!"},


    // ── Interleaved Practice: Emphasis + Fronting ──
    { id: 95641, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I ___ like coffee! (really!) She ___ finish it! (indeed)", blanks: ['do', 'did'], explanation: "Present I → do. Past → did." },
    { id: 95642, type: 'fill-blank', instruction: "Emphatic imperative:", question: "___ (do) be careful! ___ (do) come on time!", blanks: ['Do', 'Do'], explanation: "Do + imperative (kuchli buyruq)." },
    { id: 95643, type: 'error-correction', instruction: "Do + V1 (V2 emas):", question: "I did finished it on time! She does goes there.", errorPart: 'finished / goes', correct: 'I did finish it on time! She does go there.', explanation: "Do/does/did + V1 (base form)." },
    { id: 95644, type: 'fill-blank', instruction: "Fronting (what + clause):", question: "___ (nima) I need is a break. ___ (nima) she said was true.", blanks: ['What', 'What'], explanation: "What + clause + be + focus (fronting)." },
    { id: 95645, type: 'transformation', instruction: "Normal → emphatic:", question: "She likes coffee. → She ___ like coffee! (emphasis)", hint: "She ___ like coffee!", correct: 'does', explanation: "Emphasis → does + V1 (likes → like)." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Do/Does/Did urg\'usi', color: 'bg-emerald-500', icon: '🌱', ids: [50240, 50241, 50242, 50243, 50244] },
    { title: "O'rtacha", desc: 'Tanlash mashqlari', color: 'bg-blue-500', icon: '📘', ids: [50245, 50246, 50247, 50248, 50249] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50250, 50251, 50252, 50253, 50254] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50255, 50256, 50257, 50258, 50259, 55003, 55012, 101743, 101744] },
    { title: "🔀 Aralash", desc: "Emphasis + Fronting farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95641, 95642, 95643, 95644, 95645] },
  ],
  tests: [
    { id: 50260, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Emphatic do qanday gaplarda ishlatiladi?", blanks: ["tasdiq gaplarda (urg'u)"], explanation: "Emphatic do \u2014 tasdiq gaplarda kuch berish uchun" },
    { id: 50261, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Emphatic do dan keyin fe'l qanday shaklda keladi?", blanks: ["V1"], explanation: "Do/does/did + V1 (base form) = urg'u. Qoida: I do work. (Ishlayman, ta'kidlab.) She does sing. (U kuylaydi, ta'kidlab.) 'Does works' XATO! Does work to'g'ri." },
    { id: 50262, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Present tense, she bilan qaysi emphatic shakl ishlatiladi?", blanks: ["does"], explanation: "She + does + V1 = 3-shaxs urg'u (does + V1). Qoida: Does + V1 (siz -s qo'shimchasi): She does work hard. (U qattiq ishlaydi - ta'kidlab.) Odatiy: She works hard. Urg'uli: She DOES work hard." },
    { id: 50263, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Past tense uchun qaysi emphatic shakl?", blanks: ["did"], explanation: "Past = did + V1. Qoida: Did you see him? (Ko'rdingmi?) Did allaqachon o'tganlikni bildiradi." },
    { id: 50264, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Do + imperative qanday ma'noni beradi?", blanks: ["kuchli iltimos/taklif"], explanation: "Do + imperative = polite but strong. Iltimosni kuchliroq ifoda etish uchun ishlatiladi." },
    { id: 50265, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I ___ agree with you!", blanks: ["do"], explanation: "I + do + V1 = ta'kid uchun do + asosiy fe'l. I do like it = Menga haqiqatan yoqadi (oddiy I like dan kuchliroq)." },
    { id: 50266, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "She ___ know the answer, believe me!", blanks: ["does"], explanation: "She + does + know = urg'u (does + V1). Qoida: 'Does + know' = biladi (ta'kidlab). Oddiy: She knows. Urg'uli: She DOES know the answer. (U javobni BILADI.)" },
    { id: 50267, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I ___ tell you the truth yesterday!", blanks: ["did"], explanation: "Yesterday + did + tell = kecha + did + tell. Qoida: Yesterday I told him. (Oddiy.) Yesterday I DID tell him. (Kecha men unga AYTDIM - urg'u). 'Did + tell' urg'u beradi." },
    { id: 50268, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ be quiet, please!", blanks: ["Do"], explanation: "Do + be + imperative = 'be' bilan imperativda urg'u. Qoida: Do be careful! (Ehtiyot bo'ling!) Oddiy: Be careful! Urg'uli: DO be careful! (juda ehtiyot bo'ling - ta'kidlab.)" },
    { id: 50269, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "A: You didn't try! B: I ___ try!", blanks: ["did"], explanation: "Answer to accusation \u2014 emphatic did" },
    { id: 50270, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence shows CONTRAST with emphatic do?", options: ["I don't like tea, but I do like coffee.", "I don't like tea, but I did like coffee.", "I  like tea, but I do like coffee.", "like don't I tea, but I do like coffee."], correct: "I don't like tea, but I do like coffee.", explanation: "'I don't like tea, but I do like coffee' — 'do' urg'u (emphatic) bilan zidlik (contrast) yaratadi: birinchi qism inkor, ikkinchi qism urg'uli 'do' bilan." },
    { id: 50271, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Which is NOT a use of emphatic do?", blanks: ["question formation"], explanation: "Question formation = auxiliary, not emphatic" },
    { id: 50272, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "I ___ be happy if I pass the exam! (correct emphatic form?)", blanks: ["will"], explanation: "Be bilan do faqat imperative da. Bu yerda will be happy" },
    { id: 50273, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses emphatic do CORRECTLY?", options: ["I do respect your opinion.", "I do respects your opinion.", "I does respect your opinion.", "I do respecting your opinion."], correct: "I do respect your opinion.", explanation: "I + do + V1 \u2014 to'g'ri" },
    { id: 50274, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "What is the function of 'do' in 'Do come in'?", blanks: ["emphatic imperative"], explanation: "Do + imperative = polite invitation" },
    ],
  testSections: [
    { title: 'Oson', desc: 'Emphatic do asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50260, 50261, 50262, 50263, 50264] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '📘', ids: [50265, 50266, 50267, 50268, 50269] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '🎯', ids: [50270, 50271, 50272] },
    { title: 'Murakkab', desc: 'Emphatic do master', color: 'bg-rose-500', icon: '🏆', ids: [50273, 50274] }
  ],
}

export const frontingB1plus: DailyLesson = {
  id: 'fronting-b1plus',
  speaking: {
    prompt: "Describe a powerful or dramatic scene from nature or a memory, using an elevated, literary style. Speak for about one minute. Move phrases to the front of your sentences for emphasis (place, time, and negative adverbials with inversion).",
    tips: [
      "Negative fronting + inversion: 'Never have I seen...'",
      "Joy fronting: 'On the hill stood a house.'",
      "'Only then did I understand...'",
      "'Rarely do we...' — urg'u va uslub uchun.",
    ],
    sampleAnswer: "Never had I experienced such a storm. Across the dark sky flashed bright lightning. In the distance rolled the deep sound of thunder. Slowly, the rain began to fall, and soon it was pouring. Only when the wind stopped did I dare to look outside. There, on the wet street, lay fallen branches. Rarely do we witness the true power of nature. So frightened was I that I could not sleep. Little did I know that by morning the sun would shine again, and the world would look completely new.",
  },
  title: 'Fronting',
  subtitle: 'Gap bo\u2018laklarini oldinga chiqarish \u2014 urg\u2018u va stilistik ta\u2019sir',
  level: 'B1+',
  day: 70,
  listening: {
    transcript: "Guide: Welcome to the old castle. On the hill stands a tower over 500 years old.\nTourist: Amazing! And inside?\nGuide: Inside the tower hangs a huge bell. Never have I heard such a beautiful sound.\nTourist: Can we go up?\nGuide: Up the stairs we go! At the top you'll find the best view in the city.\nTourist: Wonderful. What's that painting?\nGuide: On that wall hangs a portrait of the first king. Rarely do visitors notice it.\nTourist: It's beautiful. So peaceful here.\nGuide: Peaceful it is. Little did people know how important this place would become.\nTourist: I'm so glad we came!",
    vocabulary: [
      { word: 'castle', definition: 'qal\'a' },
      { word: 'tower', definition: 'minora' },
      { word: 'bell', definition: 'qo\'ng\'iroq' },
      { word: 'portrait', definition: 'portret' },
      { word: 'peaceful', definition: 'tinch, osoyishta' }
    ],
    questions: [
      { id: 90371, type: 'multiple-choice', question: "What stands on the hill?", options: ["A church", "A tower over 500 years old", "A statue", "A bridge"], correctIndex: 1, explanation: "'On the hill stands a tower over 500 years old' — fronting of place adverbial + inversion." },
      { id: 90372, type: 'multiple-choice', question: "What hangs inside the tower?", options: ["A flag", "A huge bell", "A painting", "A clock"], correctIndex: 1, explanation: "'Inside the tower hangs a huge bell.'" },
      { id: 90373, type: 'multiple-choice', question: "What will you find at the top of the stairs?", options: ["A garden", "The best view in the city", "A museum", "A café"], correctIndex: 1, explanation: "'At the top you'll find the best view in the city.'" },
      { id: 90374, type: 'true-false', question: "Many visitors notice the king's portrait.", answer: false, explanation: "'Rarely do visitors notice it' — negative adverb fronting + inversion." },
      { id: 90375, type: 'multiple-choice', question: "Whose portrait hangs on the wall?", options: ["The guide's", "The first king's", "A famous artist's", "The builder's"], correctIndex: 1, explanation: "'On that wall hangs a portrait of the first king.'" }
    ],
    difficulty: 'hard',
    topic: "Fronting — gap boshiga ko'chirish va inversiya",
  },
  reading: {
    passage: "On the Top of the Hill\n\nOn the top of the hill stood an old fortress. Never had the travellers seen such a beautiful view. In the distance rose the blue mountains, and below them lay a quiet green valley.\n\nRarely do tourists visit this place, so it remains peaceful. So tired were the travellers that they sat down at once. Only after a long rest did they continue. Little did they know that a small village waited just behind the hill. Here, among the trees, they found a tea house. Seldom had they tasted tea so sweet.",
    questions: [
      { id: 50275, type: 'multiple-choice' as const, question: "'On the top of the hill stood a fortress' — why is the order changed?", options: ["It is a mistake","For emphasis/style (fronting)","To ask a question","To show the future"], correctIndex: 1, explanation: "Fronting — joy iborasi oldinga chiqarilgan." },
      { id: 50276, type: 'multiple-choice' as const, question: "After 'Never had the travellers seen', the order is...", options: ["normal","inverted (auxiliary before subject)","a question","passive"], correctIndex: 1, explanation: "Negativ fronting — inversiya kerak." },
      { id: 50277, type: 'multiple-choice' as const, question: "'Rarely do tourists visit' — which word triggers inversion?", options: ["tourists","visit","Rarely","do"], correctIndex: 2, explanation: "Negativ ravish (Rarely) inversiyaga sabab." },
      { id: 50278, type: 'multiple-choice' as const, question: "Fronting is mainly used to...", options: ["save space","add emphasis and dramatic effect","ask questions","make negatives"], correctIndex: 1, explanation: "Urg'u va stilistik ta'sir uchun." }
    ]
  },
  writing: {
    prompt: "Write a descriptive or dramatic paragraph. Move some phrases to the front of your sentences for emphasis and style (place, time, or negative adverbials).",
    modelAnswer: "Never had I seen such a beautiful sunset. On the horizon glowed a deep orange light. Slowly, the sun sank behind the mountains. In the valley below stood an old village, silent and peaceful. Only then did I understand why my grandfather loved this place. Rarely do we stop to notice such moments. There, among the quiet hills, I felt completely at peace. So powerful was the scene that I could not speak. That evening I will always remember.",
    wordLimit: 85,
    tips: [
      "Front a place phrase: 'On the hill stood an old house.'",
      "Front for drama: 'Never had I seen such a view.'",
      "After negative fronting, invert: 'Rarely do we...'",
      "Use it carefully, not in every sentence"
    ],
  },
  category: 'Emphasis',
  formulas: [
    { label: 'Object Fronting', structure: 'Object + Subject + Verb\nThat book I have already read.\nThis problem we must solve first.\nHis name I can\u2019t remember.', explanation: "To'ldiruvchini gap boshiga chiqarib urg'ulash.", whenToUse: "Muayyan obyektni ta'kidlaganda.", example: "That book I have already read.", color: 'green' },
    { label: 'Adverb Fronting', structure: 'Adverb/Phrase + Subject + Verb\nNever have I seen such beauty.\nOnly then did she understand.\nNot until Monday will we know.', explanation: "Ravish/iborani oldga chiqarish (ko'pincha inversiya bilan).", whenToUse: "Vaqt/tarzni ta'kidlab uslubni ko'targanda.", example: "Only then did she understand.", color: 'blue' },
    { label: 'Adjective/Complement Fronting', structure: 'Adjective/Complement + Verb + Subject\nBeautiful is the only word for it.\nStrange as it may seem, he was right.\nHappy are those who help others.', explanation: "Sifat/to'ldiruvchini gap boshiga chiqarish.", whenToUse: "Sifatni kuchli ta'kidlaganda (adabiy uslub).", example: "Strange as it may seem, he was right.", color: 'purple' },
    { label: 'Negative Adverb Fronting', structure: 'Negative adverb + auxiliary + S + V\nSeldom do we see such talent.\nRarely does he complain.\nHardly had I arrived when...', explanation: "Inkor ravish + yordamchi + ega (inversiya).", whenToUse: "Seldom, rarely, hardly bilan.", example: "Seldom do we see such talent.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 FRONTING NIMA?\n\nFronting \u2014 gap bo\u2018lagini odatdagi o\u2018rnidan olib, gap boshiga qo\u2018yish. Bu urg\u2018u va stilistik ta\u2019sir yaratadi:\n\n  Normal: I have already read that book.\n  Fronting: That book I have already read.\n  (O\u2018sha kitobni men allaqachon o\u2018qiganman.)\n  \u2192 \u201cthat book\u201d ga urg\u2018u tushadi.\n\n\uD83D\uDCCC Fronting \u2014 yozma ingliz tilida keng ishlatiladi.\n\uD83D\uDCCC So\u2018zlashuvda kam, faqat kuchli urg\u2018u uchun.",
    "2\uFE0F\u20E3 OBJECT FRONTING\n\nTo\u2018ldiruvchini (object) gap boshiga chiqarish:\n\n  Normal: I don\u2018t understand his decision.\n  Fronting: His decision I don\u2018t understand.\n  (Uning qarorini men tushunmayman.)\n  \u2192 \u201chis decision\u201d ga urg\u2018u.\n\n  Normal: We must solve this problem first.\n  Fronting: This problem we must solve first.\n  (Bu muammoni birinchi hal qilishimiz kerak.)\n\n\uD83D\uDD34 Object fronting \u2014 eng oddiy fronting turi. Inversion talab qilmaydi \u2014 faqat object oldinga chiqadi, gap tuzilishi o\u2018zgarmaydi.",
    "3\uFE0F\u20E3 ADVERB FRONTING (NO INVERSION)\n\nBa\u2019zi adverb va adverb phrase lar gap boshiga chiqishi mumkin, inversion talab qilmaydi:\n\n  Normal: I saw him yesterday.\n  Fronting: Yesterday I saw him. (Kecha men uni ko\u2018rdim.)\n\n  Normal: She works very hard.\n  Fronting: Very hard she works.\n\nBu turdagi fronting oddiy \u2014 faqat adverbni oldinga olib chiqasiz. FE\u2018L VA SUBJECT TARTIBI O\u2018ZGARMAYDI.",
    "4\uFE0F\u20E3 NEGATIVE ADVERB FRONTING (INVERSION)\n\nManfiy ma\u2019noli adverb lar gap boshida kelganda, SUBJECT-FE\u2018L TARTIBI TESKARI bo\u2018ladi (inversion):\n\n  Never have I seen such a wonderful view.\n  (Men hech qachon bunchalik ajoyib manzarani ko\u2018rmaganman.)\n  \u2192 Never + have + I + seen (have I)\n\n  Rarely does she eat out.\n  (U kamdan-kam tashqarida ovqatlanadi.)\n  \u2192 Rarely + does + she + eat (does she)\n\n  Seldom do we receive such compliments.\n  (Biz kamdan-kam bunday iltifot olamiz.)\n  \u2192 Seldom + do + we + receive (do we)",
    "5\uFE0F\u20E3 ONLY + ADVERB FRONTING (INVERSION)\n\nOnly bilan boshlangan phrase lar gap boshida kelsa, inversion kerak:\n\n  Only then did I understand the problem.\n  (Faqat o\u2018shanda men muammoni tushundim.)\n  \u2192 Only then + did + I + understand\n\n  Only later did she realise her mistake.\n  (Faqat keyinroq u xatosini tushundi.)\n\n  Only by working hard can you succeed.\n  (Faqat qattiq ishlash orqali muvaffaqiyatga erishishingiz mumkin.)\n\n  Not until I saw it did I believe it.\n  (Ko\u2018rmagunimcha ishonmadim.)",
    "6\uFE0F\u20E3 SUBJECT/COMPLEMENT FRONTING\n\nBa\u2019zan ot yoki sifatni (complement) oldinga chiqarish mumkin. Bu ko\u2018pincha she\u2019riy yoki adabiy uslub:\n\n  A great man he was, and a great leader too.\n  (U buyuk inson edi va buyuk rahbar ham.)\n\n  Happy are those who remember their past.\n  (Baxtlidir o\u2018tmishini eslaydiganlar.)\n\n  More important is the question of quality.\n  (Muhimroq \u2014 sifat masalasi.)\n\n\uD83D\uDD34 Complement fronting \u2014 adabiy va rasmiy uslub. So\u2018zlashuvda kam ishlatiladi.",
    "7\uFE0F\u20E3 AS / THOUGH FRONTING\n\nAs va though bilan fronting \u2014 concessive ma\u2019no (qaramay):\n\n  Strange as it may seem, I enjoyed the film.\n  (Qanchalik g\u2018alati tuyulmasin, menga film yoqdi.)\n  \u2192 = Although it may seem strange...\n\n  Tired though he was, he continued working.\n  (Qanchalik charchagan bo\u2018lsa ham, u ishlashda davom etdi.)\n\n  Much as I like him, I can\u2018t agree with him.\n  (Uni qanchalik yoqtirsam ham, qo\u2018shila olmayman.)\n\n\uD83D\uDD34 As va though bilan \u2014 adjective/adverb + as/though + subject + verb.",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 Negative adverb fronting da inversion unutish: Never I have seen... \u2192 Never have I seen...\n\u2022 Only dan keyin inversion unutish: Only then I understood... \u2192 Only then did I understand...\n\u2022 Inversion ni noto\u2018g\u2018ri qo\u2018llash: Never did he went... \u2192 Never did he go... (V1)\n\u2022 Object fronting da inversion ishlatish: That book have I read \u2192 That book I have read (oddiy fronting)\n\u2022 Frontingni haddan tashqari ko\u2018p ishlatish \u2014 faqat urg\u2018u kerak bo\u2018lganda."
    ],
  vocabulary: [
    { en: 'fronting', uz: 'gap bo\'lagini oldinga chiqarish', example: 'Fronting puts emphasis on a sentence element.', rule: 'Concept' },
    { en: 'inversion', uz: 'teskari tartib', example: 'Negative adverbs cause inversion in fronting.', rule: 'Grammar' },
    { en: 'emphasis', uz: 'urg\'u', example: 'Fronting is used for emphasis.', rule: 'Purpose' },
    { en: 'negative adverb', uz: 'manfiy ravish', example: 'Never, rarely, seldom are negative adverbs.', rule: 'Adverb type' },
    { en: 'complement', uz: 'to\'ldiruvchi (sifat/ot)', example: 'Happy are those who help others \u2014 complement fronting.', rule: 'Element' },
    { en: 'concessive', uz: 'to\'sindirish, qaramay', example: 'As/though fronting shows concession.', rule: 'Meaning' },
    { en: 'subject-auxiliary inversion', uz: 'ega-yordamchi fe\'l teskari tartibi', example: 'Never have I seen \u2014 have before I.', rule: 'Structure' },
    { en: 'auxiliary', uz: 'yordamchi fe\'l', example: 'Do, have, can are auxiliaries in inversion.', rule: 'Grammar' },
    { en: 'fronted element', uz: 'oldinga chiqarilgan bo\'lak', example: 'The fronted element gets special focus.', rule: 'Element' },
    { en: 'literary style', uz: 'adabiy uslub', example: 'Fronting is common in literary style.', rule: 'Register' }
    ],
  examples: [
    { en: "That movie I've already seen three times!", uz: "O'sha filmni men uch marta ko'rganman!" },
    { en: 'Never have I felt so embarrassed in my life.', uz: "Hayotimda hech qachon bunchalik uyalgan emasman." },
    { en: 'Only then did she realise her mistake.', uz: "Faqat o'shanda u xatosini tushundi." },
    { en: 'Seldom do we meet such kind people.', uz: "Biz kamdan-kam bunday mehribon odamlarni uchratamiz." },
    { en: 'Strange as it may seem, I like rainy weather.', uz: "Qanchalik g'alati tuyulmasin, menga yomg'irli ob-havo yoqadi." },
    { en: 'Not until I tried did I understand how difficult it is.', uz: "Sinab ko'rmagunimcha, bu qanchalik qiyinligini tushunmadim." },
    { en: 'This problem we need to solve before Friday.', uz: "Bu muammoni juma kunigacha hal qilishimiz kerak." },
    { en: 'Hardly had I sat down when the phone rang.', uz: "O'tirganim bilan telefon jiringladi." }
    ],
  specialCases: [
    {
      id: 'fronting-with-inversion',
      title: 'Fronting + Inversion qachon kerak?',
      rule: "Inversion talab qiladigan fronting:\n\n1) Negative adverbs: Never, Rarely, Seldom, Hardly, Scarcely, No sooner, Not only, Not until\n  Never have I... \u2714\n  Rarely does he... \u2714\n  Hardly had I... \u2714\n\n2) Only + time/condition: Only then, Only later, Only by, Only when\n  Only then did I... \u2714\n  Only by working can you... \u2714\n\nInversion talab qilmaydigan fronting:\n\n1) Object fronting: That book I read. \u2714 (inversion YO\u2018Q)\n2) Adverb fronting: Yesterday I saw him. \u2714\n3) Complement fronting: Happy are they. \u2714 (be bilan)\n\n\uD83D\uDD34 Negativ va only \u2192 inversion. Object va adverb \u2192 no inversion.",
      mnemonic: "Negativ va Only = INVERSION. Object va adverb = NO inversion. ESLAB QOLING: Never, Rarely, Seldom, Only \u2192 inversion! That book, Yesterday \u2192 no inversion!",
      commonMistakes: "Never I have seen... \u2192 Never have I seen... (inversion kerak)\nOnly then I understood... \u2192 Only then did I understand... (inversion kerak)\nThat book have I read. \u2192 That book I have read. (inversion kerak EMAS)",
      examples: [
        { en: 'Never have I witnessed such a beautiful sunset.', uz: "Hech qachon bunchalik chiroyli quyosh botishini ko'rmaganman." },
        { en: 'This problem I cannot solve on my own.', uz: "Bu muammoni men o'zim hal qila olmayman." }
    ],
      drills: [
        { id: 50279, type: 'fill-blank', instruction: "Inversion bilan to'ldiring:", question: 'Never ___ I seen such a mess!', blanks: ['have'], explanation: 'Never + inversion = have + I (hech qachon). Qoida: Never have I seen such beauty. (Hech qachon bunday go\'zallik ko\'rmaganman.) Never + have/has + S + V3.' },
        { id: 50280, type: 'fill-blank', instruction: "Inversion bilan to'ldiring:", question: 'Only then ___ she understand the truth.', blanks: ['did'], explanation: 'Only then + did + she + V1 = shundan keyingina u ... Qoida: \'Only then\' gap boshida: Only then did she realize the truth. (Shundan keyingina u haqiqatni tushundi.) Inversiya faqat \'only then\' gap boshida kelganda!' },
        { id: 50281, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Which needs INVERSION?', options: ['That book I read.', 'Yesterday I saw him.', 'Never I saw him.', 'Never have I seen him.'], correct: 'Never have I seen him.', explanation: 'Never + inversion = hech qachon + inversiya. Qoida: \'Never\' gap boshida kelganda inversiya: Never have I seen such beauty. (Men hech qachon bunday go\'zallikni ko\'rmaganman.) Oddiy: I have never seen. Inversiya: Never have I seen.' }
    ],
    },
    {
      id: 'hardly-no-sooner',
      title: "Hardly / No sooner / Scarcely \u2014 Time Fronting",
      rule: "Hardly/Scarcely + had + S + V3 + when + S + V2:\n  Hardly had I arrived when the meeting started.\n  (Yetib kelganim bilan uchrashuv boshlandi.)\n  \u2192 Avval: arrived, keyin: started.\n\nNo sooner + had + S + V3 + than + S + V2:\n  No sooner had I sat down than the phone rang.\n  (O\u2018tirganim bilan telefon jiringladi.)\n\n\uD83D\uDD34 Bu konstruksiyalar ikki harakat birin-ketin sodir bo\u2018lganini ta\u2019kidlaydi.\n\uD83D\uDD34 Hardly ... when; No sooner ... than; Scarcely ... when.\n\uD83D\uDD34 Past Perfect (had + V3) bilan ishlatiladi.",
      mnemonic: "Hardly...when, No sooner...than, Scarcely...when. These are time fronting pairs. HARDLY bilan WHEN, NO SOONER bilan THAN. ESLAB QOLING!",
      commonMistakes: "Hardly I had arrived when... \u2192 Hardly had I arrived when... (inversion)\nNo sooner I sat down when... \u2192 No sooner had I sat down than... (inversion + than)\nHardly...than -- XATO, Hardly...when -- TO'G'RI",
      examples: [
        { en: 'Hardly had I closed the door when the dog started barking.', uz: "Eshikni yopganim bilan it hurishni boshladi." },
        { en: 'No sooner had we left than it started raining.', uz: "Ketganimiz bilan yomg'ir yog'a boshladi." }
    ],
      drills: [
        { id: 50282, type: 'fill-blank', instruction: "Hardly ... when bilan to'ldiring:", question: 'Hardly had I ___ (leave) when he called.', blanks: ['left'], explanation: 'Had + V3 (left) = Past Perfect. Qoida: Had left = ketib bo\'lgan edi: The train had left when we arrived. (Poyezd ketib bo\'lgan edi.)' },
        { id: 50283, type: 'fill-blank', instruction: "No sooner ... than bilan to'ldiring:", question: 'No sooner had we ___ (arrive) than the show started.', blanks: ['arrived'], explanation: 'Had + V3 (arrived) = Past Perfect. Qoida: The guests had arrived before we finished. (Mehmonlar kelib bo\'lgan edi.) Ikkala harakat o\'tmishda.' },
        { id: 50284, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Hardly had she finished ___ the phone rang.', options: ['than', 'when', 'then', 'that'], correct: 'when', explanation: 'Hardly ... when — zudlik bilan (garchi ... deb). \'Hardly had I arrived when it started.\'' }
    ],
    }
    ],
  exercises: [
    { id: 50285, type: 'fill-blank', instruction: "Object fronting: That film ___ (I / see) already.", question: 'That film ___ .', blanks: ['I have already seen'], explanation: 'Object fronting \u2014 no inversion' },
    { id: 50286, type: 'fill-blank', instruction: "Adverb fronting: Yesterday ___ (I / meet) him.", question: 'Yesterday ___ .', blanks: ['I met him'], explanation: 'Adverb fronting \u2014 no inversion' },
    { id: 50287, type: 'fill-blank', instruction: "Negative fronting: Never ___ (I / see) such beauty.", question: 'Never ___ .', blanks: ['have I seen'], explanation: 'Negative + inversion: have I = inkor + inversiya. Qoida: Never, rarely, seldom, hardly, no sooner, not only bilan inversiya: Not only did she sing, but she also danced.' },
    { id: 50288, type: 'fill-blank', instruction: "Only fronting: Only then ___ (she / understand).", question: 'Only then ___ .', blanks: ['did she understand'], explanation: 'Only + inversion: did she = faqat ...dan keyin. Qoida: Only + prepositional phrase + inversion: Only after the exam did she relax. (Imtihondan keyingina u dam oldi.)' },
    { id: 50289, type: 'fill-blank', instruction: "Hardly fronting: Hardly had I arrived ___ the show ended.", question: 'Hardly had I arrived ___ the phone rang.', blanks: ['when'], explanation: 'Hardly ... when — zudlik bilan (garchi ... deb). \'Hardly had I arrived when it started.\'' },
    { id: 50290, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ have I felt so happy!', blanks: ['Never'], explanation: 'Never + inversion = hech qachon + inversiya. Qoida: \'Never\' gap boshida kelganda inversiya: Never have I seen such beauty. (Men hech qachon bunday go\'zallikni ko\'rmaganman.) Oddiy: I have never seen. Inversiya: Never have I seen.' },
    { id: 50291, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'Only later ___ she realise her mistake.', blanks: ['did'], explanation: 'Only later + did + she = keyinroqgina (inversiya). Qoida: \'Only later\' + inversiya: Only later did she find the key. (Keyinroqgina u kalitni topdi.) \'Only later\' vaqtdan keyin sodir bo\'lgan.' },
    { id: 50292, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'Seldom ___ we see such dedication.', blanks: ['do'], explanation: 'Seldom + do + we = kamdan-kam (inversiya). Qoida: \'Seldom\' (kamdan-kam) bilan inversiya: Seldom do we see such beauty. (Biz bunday go\'zallikni kamdan-kam ko\'ramiz.) Inversiya: adverb + do/does/did + subject + V1.' },
    { id: 50293, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'Rarely ___ he complain about anything.', blanks: ['does'], explanation: 'Rarely + does + he = kamdan-kam + inversiya. Qoida: \'Rarely\' gap boshida: Rarely does he complain. (U kamdan-kam shikoyat qiladi.) Inversiya: Rarely + do/does/did + subject + V1.' },
    { id: 50294, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ as it may seem, I enjoyed the film.', blanks: ['Strange'], explanation: 'Adjective + as + subject + verb' },
    { id: 50295, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Never I have seen such a beautiful place.', errorPart: 'I have', correct: 'Never have I seen such a beautiful place.', explanation: 'Never + have I = hech qachon + inversiya. Qoida: Never + have/has + subject + V3: Never have I been there. (Men u erda hech qachon bo\'lmaganman.) Inversiya faqat rasmiy/adabiy uslubda.' },
    { id: 50296, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Only then I understood the problem.', errorPart: 'I understood', correct: 'Only then did I understand the problem.', explanation: 'Only then + did + I + understand' },
    { id: 50297, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Hardly had I sat down than the bell rang.', errorPart: 'than', correct: 'Hardly had I sat down when the bell rang.', explanation: 'Hardly ... when = ...lati bilan... Qoida: Hardly + had + S + V3 + when + S + V2: Hardly had I arrived when it started raining. (Men kelishim bilan yomg\'ir yog\'a boshladi.) \'Than\' bilan XATO!' },
    { id: 50298, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'No sooner I had left than it rained.', errorPart: 'I had', correct: 'No sooner had I left than it rained.', explanation: 'No sooner + inversion: had I + V3 + than. Qoida: No sooner had I closed the door than someone knocked. (Eshikni yopishim bilan kimdir taqillatdi.) \'Than\' bilan, \'when\' emas!' },
    { id: 50299, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'That book have I already read. (no inversion needed)', errorPart: 'have I', correct: 'That book I have already read.', explanation: 'Object fronting \u2014 inversion kerak emas' },
    { id: 50300, type: 'transformation', instruction: 'Fronting bilan qayta yozing:', question: 'I have never seen such talent.', hint: 'Never ...', correct: 'Never have I seen such talent.', explanation: 'Never + inversion = hech qachon + inversiya. Qoida: \'Never\' gap boshida kelganda inversiya: Never have I seen such beauty. (Men hech qachon bunday go\'zallikni ko\'rmaganman.) Oddiy: I have never seen. Inversiya: Never have I seen.' },
    { id: 50301, type: 'transformation', instruction: 'Fronting bilan qayta yozing:', question: 'She only understood it later.', hint: 'Only later ...', correct: 'Only later did she understand it.', explanation: 'Only later + inversion = inversiya (keyinroq). Qoida: \'Only later\' + do/does/did + S + V1: Only later did they discover the truth. (Keyinroq ular haqiqatni kashf etishdi.)' },
    { id: 50302, type: 'transformation', instruction: 'Fronting bilan qayta yozing:', question: 'I don\'t understand his decision.', hint: 'His decision ...', correct: 'His decision I don\'t understand.', explanation: 'Object fronting \u2014 no inversion' },
    { id: 50303, type: 'transformation', instruction: 'Hardly ... when bilan:', question: 'I arrived. Then the phone rang.', hint: 'Hardly had I ...', correct: 'Hardly had I arrived when the phone rang.', explanation: 'Hardly + had + I + V3 + when = ...lati bilan. Qoida: Hardly had I sat down when the phone rang. (O\'tirishim bilan telefon jiringladi.) Inversiya! \'When\' bilan, \'than\' emas.' },
    { id: 50304, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["Seldom do we meet such people.", "Seldom we meet such people.", "Seldom we do meet such people.", "Seldom do we meets such people."], correct: "Seldom do we meet such people.", explanation: "Seldom + inversion \u2014 to'g'ri" },
 
    { id: 55002, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: '___ (1) (Never/Only) had I seen such joy! ___ (2) (Only then/Then only) did I understand how much this meant to her. ___ (3) (So happy/Happily) was she that she cried.',
      blanks: ['Never', 'Only then', 'So happy'],
      acceptedAnswers: [['Never', 'At no time'], ['Only then'], ['So happy']],
      explanation: 'Fronting — urg\'u uchun gap boshiga ko\'chirish. \'Never had I seen\' (inkor fronting). \'Only then did I understand\' (only fronting). \'So happy was she\' (so fronting).' },

    { id: 55011, type: 'connection',
      instruction: 'Fronting bilan urg\'u',
      prompt: 'Fronting (gap boshiga ko\'chirish) ishlatib, hayotingizdagi muhim voqealar haqida yozing.',
      hints: ['\'Never had I...\'', '\'Only then did I...\'', '\'So beautiful was...\''],
      exampleAnswer: 'Never had I seen such a beautiful sunset. Only then did I realize how important family is. So happy was she that she cried.' }
    ,
    {"id":101745,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"never","options":["hech qachon (inversiya kerak)","har doim","ba'zan","kamdan-kam"],"correct":"hech qachon (inversiya kerak)","explanation":"Never — inkor ravish, gap boshida inversiya talab qiladi."},
    {"id":101746,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"seldom","options":["kamdan-kam (inversiya kerak)","tez-tez","hech qachon","har doim"],"correct":"kamdan-kam (inversiya kerak)","explanation":"Seldom — kamdan-kam, inversiya bilan ishlatiladi: Seldom do I go."},


    // ── Interleaved Practice: Fronting + Inversion ──
    { id: 95651, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ I need is peace. ___ have I seen such beauty.", blanks: ['What', 'Never'], explanation: "What + clause (fronting). Never + inversion (Never have I)." },
    { id: 95652, type: 'fill-blank', instruction: "So + adjective + inversion:", question: "___ beautiful was the view that... ___ quickly did he finish that...", blanks: ['So', 'So'], explanation: "So + adjective + inversion + that clause." },
    { id: 95653, type: 'error-correction', instruction: "Fronting — tartib:", question: "What I need is peace. Never I have seen such a thing.", errorPart: 'Never I have seen', correct: 'What I need is peace. Never have I seen such a thing.', explanation: "Fronting (what) normal word order. Never → inversion (Never have I)." },
    { id: 95654, type: 'fill-blank', instruction: "Only then + inversion:", question: "Only then ___ (do) I understand. Only later ___ (do) she realise.", blanks: ['did', 'did'], explanation: "Only then/later + inversion (did + subject + V1)." },
    { id: 95655, type: 'transformation', instruction: "Normal → Fronting:", question: "I really need a holiday. → ___ I need is a holiday.", hint: "___ I need is a holiday.", correct: 'What', explanation: "What + clause + be + focus (fronting)." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Fronting turlari', color: 'bg-emerald-500', icon: '🌱', ids: [50285, 50286, 50287, 50288, 50289] },
    { title: "O'rtacha", desc: 'Tanlash mashqlari', color: 'bg-blue-500', icon: '📘', ids: [50290, 50291, 50292, 50293, 50294] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50295, 50296, 50297, 50298, 50299] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50300, 50301, 50302, 50303, 50304, 55002, 55011, 101745, 101746] },
  
    
    { title: "🔀 Aralash", desc: "Fronting + Inversion farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95651, 95652, 95653, 95654, 95655] },],
  tests: [
    { id: 50305, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Fronting nima?", blanks: ["gap bo'lagini oldinga chiqarish"], explanation: "Fronting = oldinga chiqarish (urg'u uchun so'zni gap boshiga olish). Qoida: Fronting: A beautiful garden it was. (Go'zal bog' edi u.) Odatiy: It was a beautiful garden. Fronting urg'u beradi." },
    { id: 50306, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Negative adverb fronting da nima talab qilinadi?", blanks: ["inversion"], explanation: "Negative adverb + inversion = inkor ravish + inversiya. Qoida: Never, rarely, seldom, hardly, scarcely, no sooner, not only, not until kabi inkor ma'noli so'zlar gap boshida kelganda inversiya: Never have I seen..." },
    { id: 50307, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Never dan keyin qanday tartib?", blanks: ["aux + S + V"], explanation: "Never + auxiliary + subject + verb" },
    { id: 50308, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Object fronting da inversion kerakmi?", blanks: ["yo'q, hech qachon"], explanation: "Object fronting \u2014 no inversion" },
    { id: 50309, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Hardly ... qaysi so'z bilan ishlatiladi?", blanks: ["when"], explanation: "Hardly ... when — zudlik bilan (garchi ... deb). 'Hardly had I arrived when it started.'" },
    { id: 50310, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ have I felt so proud!", blanks: ["Never"], explanation: "Never + inversion = hech qachon + inversiya. Qoida: 'Never' gap boshida kelganda inversiya: Never have I seen such beauty. (Men hech qachon bunday go'zallikni ko'rmaganman.) Oddiy: I have never seen. Inversiya: Never have I seen." },
    { id: 50311, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Only then ___ I understand.", blanks: ["did"], explanation: "Only then + did + I = shundan keyingina (inversiya). Qoida: 'Only then' + inversiya: Only then did I understand. (Shundan keyingina men tushundim.) 'Only' + vaqt/adverb + inversiya talab qiladi." },
    { id: 50312, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Seldom ___ we see such talent.", blanks: ["do"], explanation: "Seldom + do + we = kamdan-kam (inversiya). Qoida: 'Seldom' (kamdan-kam) bilan inversiya: Seldom do we see such beauty. (Biz bunday go'zallikni kamdan-kam ko'ramiz.) Inversiya: adverb + do/does/did + subject + V1." },
    { id: 50313, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ as it may seem, it's true.", blanks: ["Strange"], explanation: "Adjective + as + subject + verb" },
    { id: 50314, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "That book I ___ already.", blanks: ["have read"], explanation: "Object fronting \u2014 normal verb form" },
    { id: 50315, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which needs INVERSION?", options: ["Rarely does he call.", "Rarely did he call.", "Rarely does not he call.", "Rarely doesn't he call."], correct: "Rarely does he call.", explanation: "Rarely + inversion = does he (kamdan-kam). Qoida: Rarely does he complain. (U kamdan-kam shikoyat qiladi.) Rarely + do/does/did + S + V1." },
    { id: 50316, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "No sooner ___ than the show started.", blanks: ["had we arrived"], explanation: "No sooner + had + we + V3 + than = ...lati bilan. Qoida: No sooner had we left than it rained. (Ketishimiz bilan yomg'ir yog'di.) 'No sooner...than' inversiyasi: No sooner + had + S + V3 + than." },
    { id: 50317, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Only by working hard ___ succeed.", blanks: ["can you"], explanation: "Only by + inversion: can you = ... bilangina. Qoida: Only by + V-ing + inversion: Only by working hard can you succeed. (Qattiq ishlash bilangina muvaffaqiyatga erishishingiz mumkin.)" },
    { id: 50318, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is grammatically CORRECT?", options: ["Not until later did she call.", "Not until later she called.", "Not until later she did call.", "Not until later did she called."], correct: "Not until later did she call.", explanation: "Not until + inversion \u2014 to'g'ri" },
    { id: 50319, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence uses CORRECT fronting?", options: ["Never have I been so happy!", "Never I have been so happy!", "Never I been so happy!", "Never have I be so happy!"], correct: "Never have I been so happy!", explanation: "Never + inversion \u2014 to'g'ri" },
    ],
  testSections: [
    { title: 'Oson', desc: 'Fronting asoslari', color: 'bg-emerald-500', icon: '\uD83C\uDF31', ids: [50305, 50306, 50307, 50308, 50309] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '\uD83D\uDCD8', ids: [50310, 50311, 50312, 50313, 50314] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '\uD83D\uDCAA', ids: [50315, 50316, 50317] },
    { title: 'Murakkab', desc: 'Fronting master', color: 'bg-rose-500', icon: '\uD83C\uDFC6', ids: [50318, 50319] }
    ],
}

export const ellipsisSubstitutionB1plus: DailyLesson = {
  id: 'ellipsis-substitution-b1plus',
  speaking: {
    prompt: "Have a natural conversation with a friend about weekend plans. Speak for about one minute. Sound natural by avoiding repetition — use ellipsis and substitution ('one', 'so', 'do', 'too', 'neither').",
    tips: [
      "'I think so' / 'I hope not' — butun gap o'rniga.",
      "'the red one' — otni takrorlamaslik uchun 'one'.",
      "'Me too' / 'So do I' / 'Neither do I'.",
      "Takrorlanadigan so'zlarni tushiring.",
    ],
    sampleAnswer: "'Do you want to go to the cinema tonight?' 'Yes, I'd love to.' 'Which film — the action one or the comedy?' 'The comedy, I think.' 'Me too. Shall we invite Aziz?' 'Yes, let's. And Malika, if she's free.' 'Do you think she is?' 'I hope so.' 'Should we eat before or after?' 'After, I'd say.' 'So would I. Where shall we meet?' 'At the usual place?' 'Sounds good.' 'Great, see you at seven, then.' 'See you!'",
  },
  title: 'Ellipsis & Substitution',
  subtitle: "So'zlarni tushirib qoldirish va o'rniga boshqa so'z ishlatish \u2014 qisqa va tabiiy gap",
  level: 'B1+',
  day: 71,
  listening: {
    transcript: "Anvar: Are you coming to the cinema?\nBek: I'd love to, but I can't. Too much homework.\nAnvar: That's a shame. Dilshod is coming, and so is Laylo.\nBek: Lucky them! Which film are you watching?\nAnvar: The new action one. Have you seen it?\nBek: No, I haven't, but I'd like to.\nAnvar: You should. Everyone says it's great, and it is.\nBek: Maybe next week, if I can.\nAnvar: I hope so. I'll save you a seat if you want one.\nBek: Thanks! I might come if I finish early. If not, next time.",
    vocabulary: [
      { word: 'cinema', definition: 'kinoteatr' },
      { word: 'homework', definition: 'uy vazifasi' },
      { word: 'shame', definition: 'achinarli holat (a shame)' },
      { word: 'seat', definition: 'o\'rindiq' },
      { word: 'save', definition: 'saqlab qo\'ymoq (joy)' }
    ],
    questions: [
      { id: 90381, type: 'multiple-choice', question: "Why can't Bek come to the cinema?", options: ["He's ill", "Too much homework", "No money", "He's tired"], correctIndex: 1, explanation: "'I'd love to, but I can't. Too much homework' — ellipsis: 'I'd love to (come)'." },
      { id: 90382, type: 'multiple-choice', question: "Who else is coming?", options: ["Only Dilshod", "Dilshod and Laylo", "Nobody", "Anvar's brother"], correctIndex: 1, explanation: "'Dilshod is coming, and so is Laylo' — substitution with 'so is'." },
      { id: 90383, type: 'true-false', question: "Bek has already seen the film.", answer: false, explanation: "'No, I haven't, but I'd like to' — ellipsis: 'I'd like to (see it)'." },
      { id: 90384, type: 'multiple-choice', question: "What film are they watching?", options: ["A comedy", "The new action one", "A horror film", "A documentary"], correctIndex: 1, explanation: "'The new action one' — 'one' substitutes 'film'." },
      { id: 90385, type: 'multiple-choice', question: "What will Anvar do for Bek?", options: ["Buy his ticket", "Save him a seat", "Pick him up", "Lend him notes"], correctIndex: 1, explanation: "'I'll save you a seat if you want one' — 'one' = a seat." }
    ],
    difficulty: 'hard',
    topic: "Ellipsis va substitution — so / one / do",
  },
  reading: {
    passage: "A Short Conversation\n\n\"Are you coming to the party?\" asked Bek. \"Yes, I am,\" said Aziza. \"And is your brother coming too?\" \"No, he isn't, but my sister is.\"\n\nBek wanted to buy a gift. \"Should I bring flowers or chocolates?\" \"Bring the red ones,\" Aziza replied, \"they are nicer than the white ones.\" \"I think so too,\" he agreed. \"I can drive us there.\" \"So can I,\" she said, \"but yours is faster.\" At the end, both of them were happy, and so was everyone else at the party.",
    questions: [
      { id: 50320, type: 'multiple-choice' as const, question: "'Yes, I am' is short for...", options: ["Yes, I am coming","Yes, I will","Yes, I do","Yes, I can"], correctIndex: 0, explanation: "Ellipsis — takroriy 'coming' tushirilgan." },
      { id: 50321, type: 'multiple-choice' as const, question: "'Bring the red ones' — 'ones' replaces...", options: ["a verb","flowers (a noun)","a clause","nothing"], correctIndex: 1, explanation: "Substitution — 'ones' otni almashtiradi." },
      { id: 50322, type: 'multiple-choice' as const, question: "'I think so too' — 'so' replaces...", options: ["a noun","a whole clause","an adjective","a place"], correctIndex: 1, explanation: "'so' butun gapni almashtiradi." },
      { id: 50323, type: 'multiple-choice' as const, question: "'So can I' is a way to...", options: ["disagree","agree with a positive statement","ask a question","make a negative"], correctIndex: 1, explanation: "Ijobiyga qo'shilish: So + auxiliary + subject." }
    ]
  },
  writing: {
    prompt: "Write a natural dialogue between two friends making plans. Avoid repeating words by using ellipsis and substitution ('one', 'so', 'do', 'too').",
    modelAnswer: "'Are you free this weekend?' asked Nodir. 'I am, and Aziz is too,' I replied. 'Shall we go to the cinema?' 'Yes, let's. I'd love to.' 'Which film do you want to see?' 'The new one.' 'I think Aziz wants to see it too.' 'So do I.' 'Do you want to eat before the film?' 'I'd rather not.' 'Okay, we'll eat after, then.' 'Sounds good. See you at six?' 'See you then!'",
    wordLimit: 80,
    tips: [
      "Substitute with 'one/ones': 'I'll take the red one.'",
      "'so/do' replace clauses: 'I think so.', 'So do I.'",
      "Leave out repeated words: 'I can go, but she can't.'",
      "Keep it natural, like real speech"
    ],
  },
  category: 'Discourse',
  formulas: [
    { label: 'Ellipsis', structure: "Omitting repeated words\nA: Are you coming? B: Yes, I am (coming).\nShe went home and (she) went to bed.\nHe can swim faster than I can (swim).", explanation: "Takrorlanadigan so'zlarni tushirib qoldirish.", whenToUse: "Kontekstdan tushunarli so'zlarni takrorlamaslik uchun.", example: "A: Are you coming? B: Yes, I am.", color: 'green' },
    { label: 'So / Not substitution', structure: "Replacing clauses with so/not\nA: Is he coming? B: I think so.\nA: Will it rain? B: I hope not.\nDo you think so? I believe so.", explanation: "Butun gapni 'so' yoki 'not' bilan almashtirish.", whenToUse: "think, hope, believe fe'llaridan keyin.", example: "A: Will it rain? B: I hope not.", color: 'blue' },
    { label: 'Do substitution', structure: "Replacing verb with do/does/did\nShe runs faster than he does.\nA: Who broke it? B: I did.\nI don't like coffee but he does.", explanation: "Fe'lni 'do/does/did' bilan almashtirish.", whenToUse: "Fe'lni takrorlamaslik uchun.", example: "She runs faster than he does.", color: 'purple' },
    { label: 'One/Ones substitution', structure: "Replacing noun with one/ones\nWhich car do you like? The red one.\nI prefer the blue ones.\nThis book is better than that one.", explanation: "Otni 'one/ones' bilan almashtirish.", whenToUse: "Sanaladigan otni takrorlamaslik uchun.", example: "Which car? The red one.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 ELLIPSIS VA SUBSTITUTION NIMA?\n\nEllipsis \u2014 takrorlanadigan so\u2018zlarni TUSHIRIB QOLDIRISH:\n  She went home and (she) went to bed.\n  (U uyga keldi va uxlashga ketdi.)\n  \u2192 \u201cshe\u201d takrorlanmaydi.\n\nSubstitution \u2014 takrorlanadigan so\u2018z o\u2018rniga BOSHQA SO\u2018Z ishlatish:\n  A: Do you like coffee? B: Yes, I do. (like coffee \u2192 do)\n  \u2192 \u201clike coffee\u201d o\u2018rniga \u201cdo\u201d.\n\n\uD83D\uDCCC Ellipsis = tushirish (omit)\n\uD83D\uDCCC Substitution = almashtirish (replace)\n\uD83D\uDCCC Ikkala holatda ham gap qisqa va tabiiy bo\u2018ladi.",
    "2\uFE0F\u20E3 SUBJECT ELLIPSIS\n\nIkki gap bir xil subject ga ega bo\u2018lsa, ikkinchi gapda subject tushiriladi (coordinating conjunctions bilan: and, but, or):\n\n  He opened the door and (he) walked in.\n  (U eshikni ochdi va ichkari kirdi.)\n\n  She sat down and (she) began to read.\n  (U o\u2018tirdi va o\u2018qiy boshladi.)\n\n  I went to the store but (I) didn\u2018t buy anything.\n  (Do\u2018konga bordim, lekin hech narsa sotib olmadim.)\n\n\uD83D\uDD34 Agar subject farqli bo\u2018lsa, ellipsis mumkin emas:\n  He arrived and she left. (farqli subject \u2192 ikkalasi ham kerak)",
    "3\uFE0F\u20E3 VERB ELLIPSIS\n\nAuxiliary dan keyin asosiy fe\u2018l tushirilishi mumkin:\n\n  A: Have you finished? B: Yes, I have (finished).\n  A: Tugatdingmi? B: Ha, tugatdim.\n\n  A: Can you swim? B: Yes, I can (swim).\n  A: Suzay olasanmi? B: Ha, suzay olaman.\n\n  She can speak French better than I can (speak French).\n  \u2192 \u201cspeak French\u201d tushirilgan.\n\n  He said he would call, but he didn\u2018t (call).\n  \u2192 \u201ccall\u201d tushirilgan.\n\n\uD83D\uDD34 Auxiliary (have, can, will, do, etc.) dan keyin fe\u2018lni tushirish mumkin.",
    "4\uFE0F\u20E3 DO SUBSTITUTION\n\nDo/does/did \u2014 takrorlanadigan fe\u2018l o\u2018rniga ishlatiladi:\n\n  A: Who broke the window? B: I did.\n  (Derazani kim sindirdi? Men.)\n  \u2192 did = broke the window\n\n  She likes coffee more than he does.\n  (U kofeni undan ko\u2018proq yoqtiradi.)\n  \u2192 does = likes coffee\n\n  I don\u2018t like spicy food, but my wife does.\n  (Men achchiq ovqatni yoqtirmayman, lekin xotinim yoqtiradi.)\n\n\uD83D\uDD34 Do substitution \u2014 fe\u2018l va uning to\u2018ldiruvchisini almashtiradi.",
    "5\uFE0F\u20E3 SO / NOT SUBSTITUTION\n\nSo \u2014 tasdiq gap o\u2018rniga (think, hope, believe, suppose, expect, guess, be afraid):\n\n  A: Is he coming? B: I think so.\n  (U kelyaptimi? Men shunday deb o\u2018ylayman.)\n  \u2192 so = that he is coming\n\n  A: Will it rain? B: I hope not.\n  (Yomg\u2018ir yog\u2018adimi? Umid qilamanki, yo\u2018q.)\n  \u2192 not = that it will not rain\n\n  I believe so. \u2022 I suppose so. \u2022 I guess so.\n  I hope not. \u2022 I think not. (rasmiy) \u2022 I\u2019m afraid not.\n\n\uD83D\uDD34 So \u2014 tasdiq, not \u2014 inkor.\n\uD83D\uDD34 Say va tell bilan so ishlatilmaydi: He said so? \u2192 He said that. (so emas)",
    "6\uFE0F\u20E3 ONE / ONES SUBSTITUTION\n\nOne (birlik) va ones (ko\u2018plik) \u2014 takrorlanadigan ot o\u2018rniga:\n\n  Which car is yours? The red one.\n  (Qaysi mashina sizniki? Qizili.)\n  \u2192 one = car\n\n  I prefer the blue ones.\n  (Men ko\u2018k ranglilarini afzal ko\u2018raman.)\n  \u2192 ones = cars\n\n  This book is more interesting than that one.\n  (Bu kitob undan qiziqarliroq.)\n\n  These apples are fresher than those ones.\n  (Bu olmalar ulardan yangiroq.)\n\n\uD83D\uDD34 One/ones \u2014 faqat sanaladigan otlar bilan. Sanalmaydigan otlar bilan ishlatilmaydi: I like this water. (one emas)",
    "7\uFE0F\u20E3 COMPARATIVE ELLIPSIS\n\nTaqqoslash (comparative) gaplarda qisqartirish keng tarqalgan:\n\n  She is taller than I (am tall).\n  \u2192 \u201cam tall\u201d tushirilgan.\n\n  He runs faster than she (does / runs).\n  \u2192 \u201cdoes\u201d yoki \u201cruns\u201d tushirilgan.\n\n  I earn more than I used to (earn).\n  \u2192 \u201cearn\u201d tushirilgan.\n\n  She has more experience than I (have).\n  \u2192 \u201chave\u201d tushirilgan yoki \u201cdo\u201d bilan: than I do.\n\n\uD83D\uDD34 Comparative ellipsis \u2014 than dan keyin qisqartirish.",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 So ni noto\u2018g\u2018ri ishlatish: He said so \u2192 He said that (so emas). Think so \u2714, say so \u274C.\n\u2022 One/ones ni sanalmaydigan otlar bilan: I like this water one \u2192 I like this water.\n\u2022 Do substitution ni unutish: I like coffee more than she likes coffee \u2192 I like coffee more than she does.\n\u2022 Subject ellipsis ni noto\u2018g\u2018ri ishlatish: He went home and she went to bed \u2192 she ni tushirib bo\u2018lmaydi (farqli subject).\n\u2022 Auxiliary dan keyin fe\u2018lni qaytarish: Yes, I have finished. \u2192 Yes, I have. (qisqa)"
    ],
  vocabulary: [
    { en: 'ellipsis', uz: "so'z tushirib qoldirish", example: 'Ellipsis avoids repetition.', rule: 'Concept' },
    { en: 'substitution', uz: "o'rniga boshqa so'z ishlatish", example: 'Do, so, one are substitution words.', rule: 'Concept' },
    { en: 'auxiliary', uz: 'yordamchi fe\'l', example: 'Auxiliaries are used in ellipsis.', rule: 'Grammar' },
    { en: 'repetition', uz: 'takrorlash', example: 'Ellipsis avoids unnecessary repetition.', rule: 'Problem' },
    { en: 'cohesion', uz: 'bog\'liqlik, uyg\'unlik', example: 'Substitution improves text cohesion.', rule: 'Discourse' },
    { en: 'comparative', uz: 'qiyosiy', example: 'Comparative ellipsis is common after than.', rule: 'Structure' },
    { en: 'coordinate clause', uz: 'teng bog\'langan gap', example: 'And, but, or connect coordinate clauses.', rule: 'Syntax' },
    { en: 'pro-form', uz: "o'rinbosar shakl", example: 'Do, so, one are pro-forms.', rule: 'Linguistics' },
    { en: 'stranding', uz: 'yolg\'iz qolish', example: 'Preposition stranding occurs in ellipsis.', rule: 'Structure' },
    { en: 'antecedent', uz: 'oldindagi so\'z', example: 'One/ones refer back to an antecedent noun.', rule: 'Reference' }
    ],
  examples: [
    { en: 'She opened the door and (she) walked into the room.', uz: "U eshikni ochdi va xonaga kirdi." },
    { en: 'A: Have you finished? B: Yes, I have.', uz: "A: Tugatdingmi? B: Ha, tugatdim." },
    { en: 'A: Who broke the vase? B: I did.', uz: "A: Vazani kim sindirdi? B: Men." },
    { en: 'A: Is he coming? B: I think so.', uz: "A: U kelyaptimi? B: Shunday deb o'ylayman." },
    { en: 'A: Will it rain? B: I hope not.', uz: "A: Yomg'ir yog'adimi? B: Umid qilamanki, yo'q." },
    { en: 'Which dress do you like? The red one.', uz: "Qaysi ko'ylak sizga yoqadi? Qizili." },
    { en: 'I prefer the small ones.', uz: "Men kichiklarini afzal ko'raman." },
    { en: 'She runs faster than he does.', uz: "U undan tezroq yuguradi." }
    ],
  specialCases: [
    {
      id: 'so-vs-not',
      title: "So va Not \u2014 to'g'ri ishlatish",
      rule: "So va not \u2014 fikr bildiruvchi fe\u2018llardan keyin:\n\nTasdiq uchun SO:\n  think: I think so.\n  hope: I hope so.\n  believe: I believe so.\n  suppose: I suppose so.\n  expect: I expect so.\n  guess: I guess so.\n  be afraid: I\u2019m afraid so.\n\nKengaytirish uchun NOT:\n  think: I don\u2018t think so. (yoki: I think not \u2014 rasmiy)\n  hope: I hope not.\n  believe: I don\u2018t believe so.\n  suppose: I don\u2018t suppose so.\n  be afraid: I\u2019m afraid not.\n\n\uD83D\uDD34 Say va tell bilan so ishlatilmaydi. Tell so \u274C, say so \u274C.\n\uD83D\uDD34 Know bilan so ishlatilmaydi: I know so \u274C \u2192 I know that \u2714.",
      mnemonic: "Think/hope/believe + so/not \u2714. Say/tell/know + so/not \u274C. ESLAB QOLING: Think so, hope so, believe so. NOT say so, tell so, know so!",
      commonMistakes: "He said so \u2192 He said that (so emas).\nI know so \u2192 I know that.\nI think not (rasmiy) = I don't think so (norasmiy). Ikkalasi to'g'ri.",
      examples: [
        { en: 'A: Will she pass? B: I think so.', uz: "A: U o'tadimi? B: Shunday deb o'ylayman." },
        { en: 'A: Is he lying? B: I hope not.', uz: "A: U yolg'on gapiryaptimi? B: Umid qilamanki, yo'q." }
    ],
      drills: [
        { id: 50324, type: 'fill-blank', instruction: "So yoki Not bilan to'ldiring:", question: 'A: Is it true? B: I think ___ .', blanks: ['so'], explanation: 'Tasdiq = think so. Qoida: I think so = shunday deb o\'ylayman. Inkor: I don\'t think so. \'So\' oldingi gap o\'rnida.' },
        { id: 50325, type: 'fill-blank', instruction: "So yoki Not bilan to'ldiring:", question: 'A: Will it rain? B: I hope ___ .', blanks: ['not'], explanation: 'Kengaytirish = hope not. Qoida: I hope not (yo\'q deb). \'I don\'t hope so\' XATO! To\'g\'risi: I hope not.' },
        { id: 50326, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Which is CORRECT?', options: ['He said so.', 'I think so.', 'I know so.', 'She told so.'], correct: 'I think so.', explanation: 'Think so \u2714, say/tell/know so \u274C' }
    ],
    },
    {
      id: 'one-ones-usage',
      title: 'One / Ones \u2014 qoidalar va cheklovlar',
      rule: "One (birlik) va ones (ko\u2018plik) \u2014 takrorlanadigan ot o\u2018rniga:\n\n  Which car? The red one. (one = car)\n  Which cars? The red ones. (ones = cars)\n\nQOIDALAR:\n1) Sifatdan keyin ishlatiladi: the big one, a small one.\n2) This/that/these/those dan keyin: this one, those ones.\n3) Which dan keyin: Which one?\n4) Ba\u2018zi hollarda tushirilishi mumkin: Which car? The red (one).\n\nCHEKLASHLAR:\n1) Sanalmaydigan otlar bilan ishlatilmaydi:\n  I like this water. (one emas)\n  I prefer white bread. (one emas)\n\n2) Agar kontekstda aniq bo\u2018lsa, one tushirilishi mumkin:\n  Which book? The red (one).",
      mnemonic: "One/ones = countable nouns only. Sifat + one/ones. Water? Bread? Information? NO one/ones! Car? Book? Apple? YES one/ones!",
      commonMistakes: "I like this water one \u2192 I like this water (sanalmaydigan)\nThese ones are better \u2192 These are better (these dan keyin ones ba'zan tushiriladi)\nA one \u2192 one: a small one \u2714 (a + adjective + one)",
      examples: [
        { en: 'I need a new phone. This old one is broken.', uz: "Menga yangi telefon kerak. Bu eskisi buzilgan." },
        { en: 'Which shoes? The black ones.', uz: "Qaysi tufli? Qoralari." }
    ],
      drills: [
        { id: 50327, type: 'fill-blank', instruction: "One yoki Ones bilan to'ldiring:", question: 'Which jacket? The blue ___ .', blanks: ['one'], explanation: 'Birlik = bitta (singular). Qoida: Ingliz tilida birlik ot bilan birlik fe\'l: one book IS. Ko\'plik ot bilan ko\'plik fe\'l: two books ARE.' },
        { id: 50328, type: 'fill-blank', instruction: "One yoki Ones bilan to'ldiring:", question: 'Which apples? The green ___ .', blanks: ['ones'], explanation: 'Ko\'plik \\u2014 ones (ingliz tilida shunday ishlatiladi)' },
        { id: 50329, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Which is INCORRECT?', options: ['The red one', 'The blue ones', 'This water one', 'Which one?'], correct: 'This water one', explanation: "Sanalmaydigan \u2014 one ishlatilmaydi" }
    ],
    }
    ],
  exercises: [
    { id: 50330, type: 'fill-blank', instruction: "Ellipsis \u2014 subject ni tushiring:", question: 'He sat down and ___ opened his book.', blanks: ['he (optional)'], explanation: "Subject ellipsis \u2014 he tushirilsa ham bo'ladi" },
    { id: 50331, type: 'fill-blank', instruction: "Verb ellipsis:", question: 'A: Can you swim? B: Yes, I ___ .', blanks: ['can'], explanation: 'Can + (swim) tushirilgan = \'can\' dan keyingi fe\'l tushirilgan. Qoida: Kontekstdan tushunarli bo\'lsa, fe\'l tushirilishi mumkin: \'Can you swim?\' \'Yes, I can.\' (Ha, qila olaman - \'swim\' tushirilgan.)' },
    { id: 50332, type: 'fill-blank', instruction: "Do substitution:", question: 'She likes tea more than he ___ .', blanks: ['does'], explanation: 'Does = likes tea = \'does\' \'likes tea\' o\'rnida. Qoida: \'Does\' fe\'l o\'rnida ishlatiladi (substitution): She drinks tea, and he does too. (U choy ichadi, u ham.) \'Does\' = \'drinks tea\' o\'rnida.' },
    { id: 50333, type: 'fill-blank', instruction: "So substitution:", question: 'A: Is he coming? B: I think ___ .', blanks: ['so'], explanation: 'Think so = shunday deb o\'ylash (oldingi gapga ishora). Qoida: \'So\' butun bir gap o\'rnida: Is John coming? I think so. (Jon kelyaptimi? Shunday deb o\'ylayman.) \'So\' = that he is coming ma\'nosida.' },
    { id: 50334, type: 'fill-blank', instruction: "One/ones:", question: 'Which car? The red ___ .', blanks: ['one'], explanation: 'One = car (bironta avtomobil). One oldin aytilgan ot o\'rnida ishlatiladi, takrorlanmaslik uchun.' },
    { id: 50335, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'A: Have you finished? B: Yes, I ___ .', blanks: ['have'], explanation: 'Verb ellipsis: have (finished)' },
    { id: 50336, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'A: Who called? B: I ___ .', blanks: ['did'], explanation: 'Do substitution: did = called. Qoida: \'Do\' fe\'li oldingi fe\'l o\'rnida ishlatiladi: She called, and I did too. (U qo\'ng\'iroq qildi, men ham qildim.) Bu yerda \'did\' = \'called\' o\'rnida.' },
    { id: 50337, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'A: Will she come? B: I think ___ .', blanks: ['so'], explanation: 'Think so = shunday deb o\'ylayman. I think so fikr bildirishda ishlatiladi, I don\'t think so inkor shakli.' },
    { id: 50338, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'Which dress? The blue ___ .', blanks: ['one'], explanation: 'One = dress (bironta ko\'ylak). One o\'rnida ishlatiladi, takrorlanmaslik uchun. Which dress? The red one.' },
    { id: 50339, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'I like these apples more than those ___ .', blanks: ['ones'], explanation: 'Ones = apples (ko\'plik). One o\'rnida ko\'plik ma\'nosida ones ishlatiladi.' },
    { id: 50340, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'A: Is it ready? B: I think not. (informal)', errorPart: 'I think not', correct: "I don't think so.", explanation: "I think not \u2014 rasmiy. Norasmiy: I don't think so" },
    { id: 50341, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'I like this water one.', errorPart: 'one', correct: 'I like this water.', explanation: "Sanalmaydigan \u2014 one ishlatilmaydi" },
    { id: 50342, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'He said so, but I disagree.', errorPart: 'said so', correct: 'He said that, but I disagree.', explanation: 'Say + that + gap = aytmoq. Qoida: \'Say\' dan keyin \'so\' ishlatilmaydi, \'that\' ishlatiladi: He said that he was tired. (U charchaganini aytdi.) \'Say so\' XATO! \'Say that\' to\'g\'ri.' },
    { id: 50343, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'She can sing better than I can sing.', errorPart: 'can sing (second)', correct: 'She can sing better than I can.', explanation: "Verb ellipsis \u2014 sing tushiriladi" },
    { id: 50344, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Which books? The red one.', errorPart: 'one', correct: 'Which books? The red ones.', explanation: 'Ko\'plik \\u2014 ones (ingliz tilida shunday ishlatiladi)' },
    { id: 50345, type: 'transformation', instruction: "Qisqartiring:", question: 'She went home and she had dinner.', hint: 'She went home and ___', correct: 'She went home and had dinner.', explanation: 'Subject ellipsis: she tushirildi' },
    { id: 50346, type: 'transformation', instruction: "Do substitution qiling:", question: 'She likes coffee more than he likes coffee.', hint: 'She likes coffee more than he ___', correct: 'She likes coffee more than he does.', explanation: 'Does = likes coffee = \'does\' \'likes coffee\' o\'rnida. Qoida: \'Does\' oldingi fe\'l + object o\'rnida: He likes coffee, and she does too. (U kofeni yoqtiradi, u ham.)' },
    { id: 50347, type: 'transformation', instruction: "So bilan qisqartiring:", question: 'A: Is it true? B: I think it is true.', hint: 'I think ___', correct: 'I think so.', explanation: 'So = that it is true (shuning uchun to\'g\'ri). Qoida: \'So\' olmosh sifatida: Is he coming? I think so. (U kelyaptimi? Shunday deb o\'ylayman.) \'So\' oldingi gap o\'rnida.' },
    { id: 50348, type: 'transformation', instruction: "One bilan qisqartiring:", question: 'Which car is yours? The red car.', hint: 'The red ___', correct: 'The red one.', explanation: 'One = car (bironta avtomobil). One oldin aytilgan ot o\'rnida ishlatiladi, takrorlanmaslik uchun.' },
    { id: 50349, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["I think so.", "I think such.", "I think like that.", "I think thus."], correct: "I think so.", explanation: "Think so (shunday deb o'ylayman) — to'g'ri javob" },
 
    { id: 55001, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: 'A: Do you like coffee? B: Yes, I ___(1) (do/am). A: I think she passed the exam. B: I think ___(2) (so/too). A: He hasn\'t finished yet. B: But I ___(3) (have/has)! A: I love learning English. B: So ___(4) (do/am) I!',
      blanks: ['do', 'so', 'have', 'do'],
      acceptedAnswers: [['do'], ['so'], ['have'], ['do']],
      explanation: 'Ellipsis — takrorlanmaslik uchun qisqartirish. \'Do\' — like o\'rniga. \'So\' — I think so. \'Have\' — have finished o\'rniga. \'So do I\' — bir xil fikr.' },

    { id: 55010, type: 'connection',
      instruction: 'Qisqa javoblar',
      prompt: 'Do\'stingiz bilan suhbat qiling. Ellipsis va substitution ishlatib, qisqa javoblar bering.',
      hints: ['\'I think so.\'', '\'So do I.\'', '\'I have not seen him.\''],
      exampleAnswer: 'A: Do you like coffee? B: Yes, I do. A: I think English is important. B: I think so too. A: She hasn\'t finished yet. B: But I have!' }
    ,
    {"id":101747,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"ellipsis","options":["so'z tushirib qoldirish","so'z o'rniga boshqa so'z","gapni uzaytirish","savol yasash"],"correct":"so'z tushirib qoldirish","explanation":"Ellipsis — takrorlanuvchi so'zlarni tushirib qoldirish."},
    {"id":101748,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"substitution","options":["so'z o'rniga boshqa so'z ishlatish","so'z tushirib qoldirish","gapni qisqartirish","fe'lni o'zgartirish"],"correct":"so'z o'rniga boshqa so'z ishlatish","explanation":"Substitution — do/so/one kabi so'zlar orqali almashtirish."},


    // ── Interleaved Practice: Ellipsis + So/Neither ──
    { id: 95661, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "'I like tea.' '___ do I.' 'I can't swim.' '___ can I.'", blanks: ['So', 'Neither'], explanation: "Tasdiqqa rozilik → So. Inkorga rozilik → Neither." },
    { id: 95662, type: 'fill-blank', instruction: "Auxiliary ellipsis:", question: "She has finished and so ___ (do) he. They went home and so ___ (do) we.", blanks: ['has', 'did'], explanation: "Auxiliary zamonni mos qiladi: has → has, went → did." },
    { id: 95663, type: 'error-correction', instruction: "Ellipsis — auxiliary:", question: "'I am tired.' 'So I am.' (rozilik)", errorPart: 'So I am', correct: "'I am tired.' 'So am I.'", explanation: "Rozilikda inversiya: So + auxiliary + subject." },
    { id: 95664, type: 'fill-blank', instruction: "Not...either / neither:", question: "A: 'I don't like it.' B: 'I don't ___' / '___ do I.'", blanks: ['either', 'Neither'], explanation: "I don't either / Neither do I (ikkalasi to'g'ri)." },
    { id: 95665, type: 'transformation', instruction: "So bilan rozilik berish:", question: "A: 'I would love to travel.' B agrees (short answer). → 'So ___ ___ .'", hint: "...", correct: 'would I', explanation: "Rozilik: So + auxiliary (would) + I." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Ellipsis va substitution asoslari', color: 'bg-emerald-500', icon: '🌱', ids: [50330, 50331, 50332, 50333, 50334] },
    { title: "O'rtacha", desc: 'Tanlash mashqlari', color: 'bg-blue-500', icon: '📘', ids: [50335, 50336, 50337, 50338, 50339] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50340, 50341, 50342, 50343, 50344] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50345, 50346, 50347, 50348, 50349, 55001, 55010, 101747, 101748] },
  
    
    { title: "🔀 Aralash", desc: "Ellipsis + So/neither auxiliaries farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95661, 95662, 95663, 95664, 95665] },],
  tests: [
    { id: 50350, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Ellipsis nima?", blanks: ["so'z tushirib qoldirish"], explanation: "Ellipsis = tushirib qoldirish (kontekstdan tushunarli bo'lgan so'zni olib tashlash). Qoida: Takrorlanmaslik uchun: (She) went home and (she) watched TV. (U uyga bordi va TV ko'rdi.) 'She' ikkinchi marta aytilmaydi." },
    { id: 50351, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Substitution nima?", blanks: ["so'z o'rniga boshqa so'z ishlatish"], explanation: "Substitution = almashtirish (so'z takrorlanmasligi uchun). Qoida: 'Do/does/did' fe'l o'rnida: She sings better than I do. (U mendan yaxshiroq kuylaydi.) 'Do' = 'sing' fe'lini almashtiradi." },
    { id: 50352, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Do substitution qanday vazifani bajaradi?", blanks: ["fe'l va to'ldiruvchini almashtiradi"], explanation: "Do = verb + object = 'do' urg'u fe'li. Qoida: Do/does/did + V1 urg'u beradi: I do have a car. (Mening mashinam BOR.) Kimdir yo'q deb o'ylasa, shunday javob beriladi." },
    { id: 50353, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "One/ones nima o'rniga ishlatiladi?", blanks: ["ot"], explanation: "One/ones = ot o'rnida ishlatiladi. Qoida: Takrorlanmaslik uchun 'one' (birlik) va 'ones' (ko'plik) ishlatiladi: Which car? The red one. (Qaysi mashina? Qizili.) 'Ones': The blue ones are cheaper. (Ko'klari arzonroq.)" },
    { id: 50354, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "So/not qaysi fe'llardan keyin ishlatiladi?", blanks: ["think, hope, believe"], explanation: "Think/hope/believe + so/not = fikr/umid bildirish. Qoida: 'So' tasdiqda: I believe so. (Ishonaman.) 'Not' inkorda: I believe not. (Ishonmayman.) 'I don't believe so' ham to'g'ri." },
    { id: 50355, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "A: Is she ready? B: I think ___ .", blanks: ["so"], explanation: "Think so = shunday deb o'ylayman. I think so fikr bildirishda ishlatiladi, I don't think so inkor shakli." },
    { id: 50356, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "A: Will it snow? B: I hope ___ .", blanks: ["not"], explanation: "Hope not = Umid qilamanki yo'q. I hope not = Umid qilamanki unday emas. Ellipsis qisqa javob." },
    { id: 50357, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Which shoes? The black ___ .", blanks: ["ones"], explanation: "Ko'plik — ones. Ko'plikdagi otlar uchun ones ishlatiladi: The black ones." },
    { id: 50358, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "She sings better than he ___ .", blanks: ["does"], explanation: "Does = sings = 'does' 'sings' o'rnida. Qoida: Do/does/did substitution: She sings better than he does. (U undan yaxshiroq kuylaydi.) 'Does' = 'sings' o'rnida." },
    { id: 50359, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "A: Have you finished? B: Yes, I ___ .", blanks: ["have"], explanation: "Verb ellipsis: have (finished)" },
    { id: 50360, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is INCORRECT?", options: ["He said so.", "He said that.", "He told me so.", "He spoke so."], correct: "He said so.", explanation: "Say + that, 'say so' emas" },
    { id: 50361, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Which noun CANNOT use one/ones?", blanks: ["water"], explanation: "Sanalmaydigan \u2014 one ishlatilmaydi" },
    { id: 50362, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "A: Who broke it? B: I ___ .", blanks: ["did"], explanation: "Do substitution: did = broke it" },
    { id: 50363, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is grammatically CORRECT?", options: ["She runs faster than he does.", "She runs faster than him.", "She runs faster than he runs.", "She runs faster than his."], correct: "She runs faster than he does.", explanation: "Comparative + do substitution \u2014 to'g'ri" },
    { id: 50364, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which contains a CORRECT ellipsis?", options: ["She sat down and began to read.", "She sat down and she began to read.", "She sat down and to read.", "She sat down and began read."], correct: "She sat down and began to read.", explanation: "Subject ellipsis: (she) began = ega tushirilishi." },
    ],
  testSections: [
    { title: 'Oson', desc: 'Ellipsis/substitution asoslari', color: 'bg-emerald-500', icon: '\uD83C\uDF31', ids: [50350, 50351, 50352, 50353, 50354] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '\uD83D\uDCD8', ids: [50355, 50356, 50357, 50358, 50359] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '\uD83D\uDCAA', ids: [50360, 50361, 50362] },
    { title: 'Murakkab', desc: 'Ellipsis/substitution master', color: 'bg-rose-500', icon: '\uD83C\uDFC6', ids: [50363, 50364] }
    ],
}

export const concessionB1plus: DailyLesson = {
  id: 'concession-b1plus',
  speaking: {
    prompt: "Talk about a difficult decision or a controversial topic, showing both sides. Speak for about one minute. Use concession — 'although', 'even though', 'despite', 'in spite of', 'however', and 'nevertheless'.",
    tips: [
      "'Although / Even though' + to'liq gap.",
      "'Despite / In spite of' + ot yoki V-ing.",
      "'however / nevertheless' — vergul bilan, gap boshida.",
      "Ikki qarama-qarshi tomonni muvozanatlang.",
    ],
    sampleAnswer: "Whether to live in a big city or a small town is a difficult question. Although cities offer more opportunities, they are often stressful. Despite the high cost of living, many people still prefer them. Even though small towns are peaceful, they can be boring for young people. In spite of the quiet, some feel isolated there. Cities are exciting; however, they can be lonely too. Nevertheless, most young people choose the city for its energy. Although I understand both sides, I believe the right choice depends entirely on what each person values most.",
  },
  title: 'Concession',
  subtitle: "Although, Even though, Despite, In spite of, However \u2014 qarama-qarshilik va to'siqsizlik",
  level: 'B1+',
  day: 72,
  listening: {
    transcript: "Reporter: Despite the rain, thousands came to the festival today.\nVisitor: Yes! Although it was cold, we enjoyed every minute.\nReporter: Even though tickets were expensive, the show was worth it.\nVisitor: Definitely. Though I was tired, I stayed until the end.\nReporter: In spite of the crowds, everything was well organised.\nVisitor: True. Despite being far from the stage, we could see clearly.\nReporter: Will you come next year?\nVisitor: Of course, even though it's a long journey.\nReporter: Great to hear. Any complaints?\nVisitor: None, although the food was a little expensive.",
    vocabulary: [
      { word: 'festival', definition: 'festival, bayram' },
      { word: 'crowd', definition: 'olomon' },
      { word: 'organise', definition: 'tashkil qilmoq' },
      { word: 'journey', definition: 'safar, yo\'l' },
      { word: 'complaint', definition: 'shikoyat' }
    ],
    questions: [
      { id: 90391, type: 'multiple-choice', question: "Despite what did thousands come to the festival?", options: ["The heat", "The rain", "The traffic", "The cost"], correctIndex: 1, explanation: "'Despite the rain, thousands came' — despite + noun." },
      { id: 90392, type: 'true-false', question: "The visitor enjoyed the festival even though it was cold.", answer: true, explanation: "'Although it was cold, we enjoyed every minute.'" },
      { id: 90393, type: 'multiple-choice', question: "What does the reporter say about the expensive tickets?", options: ["They were too high", "The show was worth it", "Many refunded them", "They were free later"], correctIndex: 1, explanation: "'Even though tickets were expensive, the show was worth it.'" },
      { id: 90394, type: 'multiple-choice', question: "How well organised was the festival, despite the crowds?", options: ["Badly organised", "Well organised", "Not organised", "Cancelled"], correctIndex: 1, explanation: "'In spite of the crowds, everything was well organised.'" },
      { id: 90395, type: 'multiple-choice', question: "What was the visitor's only minor complaint?", options: ["The rain", "The cold", "The expensive food", "The long queues"], correctIndex: 2, explanation: "'None, although the food was a little expensive.'" }
    ],
    difficulty: 'hard',
    topic: "Qarama-qarshilik — although / though / despite / even though",
  },
  reading: {
    passage: "A Difficult Decision\n\nAlthough the job offer was excellent, Jasur was not sure. Despite the high salary, he would have to move abroad. Even though his family supported him, he felt afraid of leaving home.\n\nIn spite of his doubts, he decided to accept. The work was hard; however, he learned a lot. Although he missed his country, he made new friends. Despite being far away, he called his parents every week. He was tired, but happy. However difficult the first year was, Jasur never regretted his brave choice.",
    questions: [
      { id: 50365, type: 'multiple-choice' as const, question: "'Although the job was excellent, he was not sure' shows...", options: ["a result","a contrast","a reason","a time"], correctIndex: 1, explanation: "'Although' — qarama-qarshilik." },
      { id: 50366, type: 'multiple-choice' as const, question: "After 'Despite' and 'In spite of' we use...", options: ["a full clause","a noun or -ing form","a question","the future"], correctIndex: 1, explanation: "Despite/In spite of + noun/-ing." },
      { id: 50367, type: 'multiple-choice' as const, question: "'The work was hard; however, he learned a lot.' — 'however'...", options: ["joins two nouns","starts a contrasting sentence","shows a reason","is a mistake"], correctIndex: 1, explanation: "'however' yangi gapni boshlaydi, qarama-qarshilik." },
      { id: 50368, type: 'multiple-choice' as const, question: "Which means the same as 'Although he was tired'?", options: ["Because he was tired","Despite being tired","So he was tired","When he was tired"], correctIndex: 1, explanation: "'Although + clause' = 'Despite + -ing'." }
    ]
  },
  writing: {
    prompt: "Write about a difficult decision with arguments on both sides. Show contrast using 'although', 'even though', 'despite', 'in spite of', and 'however'.",
    modelAnswer: "Deciding whether to study abroad was very difficult. Although it offered a better education, it also meant leaving my family. Even though I was excited, I felt afraid of being alone. Despite the high cost, my parents encouraged me to go. In spite of my worries, I knew it was a rare opportunity. The distance would be hard; however, modern technology makes it easy to stay in touch. Although the decision was painful, I finally chose to accept the challenge and grow.",
    wordLimit: 90,
    tips: [
      "'although/even though' + clause: 'Although it was hard...'",
      "'despite/in spite of' + noun or -ing: 'Despite the rain...'",
      "'however' starts a new sentence: '...; however, ...'",
      "Balance both sides of the argument"
    ],
  },
  category: 'Linking Words',
  formulas: [
    { label: 'Although / Though / Even though', structure: 'Although/Though/Even though + clause, main clause\nAlthough it rained, we went out.\nThough he was tired, he kept working.\nEven though she was ill, she came to work.', explanation: "Qarama-qarshilikni bog'lovchi (to'liq gap bilan).", whenToUse: "Kutilmagan natijani ko'rsatganda.", example: "Although it rained, we went out.", color: 'green' },
    { label: 'Despite / In spite of', structure: 'Despite/In spite of + noun/V-ing, main clause\nDespite the rain, we enjoyed the trip.\nIn spite of being tired, he continued.\nDespite the heat, she wore a jacket.', explanation: "Qarama-qarshilik (ot yoki V-ing bilan).", whenToUse: "Ot/gerund bilan ziddiyat bildirganda.", example: "Despite the rain, we enjoyed the trip.", color: 'blue' },
    { label: 'However / Nevertheless', structure: 'Main clause. However/Nevertheless, main clause\nIt rained. However, we still went out.\nHe was tired. Nevertheless, he kept working.\nShe was late. However, she apologised.', explanation: "Ikki mustaqil gapni bog'lovchi qarama-qarshilik.", whenToUse: "Alohida gaplar orasida ziddiyat ko'rsatganda.", example: "It rained. However, we went out.", color: 'purple' },
    { label: 'While / Whereas', structure: 'While/Whereas + clause, main clause (contrast)\nWhile I prefer tea, my brother likes coffee.\nWhereas some enjoy winter, others prefer summer.\nHe is outgoing, while his sister is shy.', explanation: "Ikki fikrni qiyoslab qarama-qarshi qo'yish.", whenToUse: "Ikki narsani solishtirib farqlaganda.", example: "While I prefer tea, my brother likes coffee.", color: 'orange' }
    ],
  rules: [
    "1\uFE0F\u20E3 CONCESSION NIMA?\n\nConcession \u2014 biror qarama-qarshilikka qaramay sodir bo\u2018lgan harakatni ifodalaydi. \u201c...ga qaramay\u201d, \u201c...bo\u2018lsa ham\u201d ma\u2019nolarini beradi:\n\n  Although it was cold, she went swimming.\n  (Sovuq bo\u2018lsa ham, u suzishga ketdi.)\n  \u2192 Sovuq \u2014 lekin suzishga ketdi (qarama-qarshilik).\n\n\uD83D\uDCCC Although/Though/Even though + clause (S + V)\n\uD83D\uDCCC Despite/In spite of + noun / V-ing\n\uD83D\uDCCC However/Nevertheless \u2014 ikkinchi gapda\n\uD83D\uDCCC While/Whereas \u2014 ikki narsani solishtirish",
    "2\uFE0F\u20E3 ALTHOUGH / THOUGH / EVEN THOUGH\n\nBu linking words lar + subject + verb (full clause) bilan ishlatiladi:\n\n  Although he studied hard, he didn\u2018t pass the exam.\n  (Qattiq o\u2018qigan bo\u2018lsa ham, u imtihondan o\u2018ta olmadi.)\n\n  Though the hotel was expensive, it was worth it.\n  (Mehmonxona qimmat bo\u2018lsa ham, arziydi.)\n\n  Even though she was afraid, she spoke up.\n  (Qo\u2018rqqan bo\u2018lsa ham, u gapirdi.)\n  \u2192 Even though = eng kuchlisi.\n\n\uD83D\uDD34 Though \u2014 eng oddiy va so\u2018zlashuvda keng.\n\uD83D\uDD34 Even though \u2014 eng kuchli urg\u2018u.\n\uD83D\uDD34 Although \u2014 rasmiy va yozma.",
    "3\uFE0F\u20E3 THOUGH \u2014 GAP OXIRIDA\n\nThough \u2014 gap oxirida ham ishlatilishi mumkin (so\u2018zlashuv uslubi):\n\n  He didn\u2018t pass the exam. He studied hard, though.\n  (U imtihondan o\u2018ta olmadi. Qattiq o\u2018qigan bo\u2018lsa ham.)\n  \u2192 Though = qaramay (oxirida).\n\n  It was expensive. It was worth it, though.\n  (Qimmat edi. Arzigudek edi, shunga qaramay.)\n\n\uD83D\uDD34 Though oxirida \u2014 \u201chowever\u201d ma\u2019nosida.\n\uD83D\uDD34 This is a very common conversational pattern.\n\n  A: The film was long.\n  B: It was good, though! (Lekin yaxshi edi!)",
    "4\uFE0F\u20E3 DESPITE / IN SPITE OF\n\nDespite va In spite of \u2014 bir xil ma\u2018no. Farqi: despite \u2014 qisqa, in spite of \u2014 uch so\u2018z. Ikkalasidan keyin noun yoki V-ing keladi:\n\n  Despite the rain, we had a great picnic.\n  (Yomg\u2018irga qaramay, ajoyib piknik qildik.)\n  \u2192 despite + noun (the rain)\n\n  In spite of feeling tired, she went to the gym.\n  (Charchaganiga qaramay, u sport zaliga ketdi.)\n  \u2192 in spite of + V-ing (feeling)\n\n  Despite being late, he didn\u2018t apologise.\n  (Kechikkaniga qaramay, u kechirim so\u2018ramadi.)\n\n\uD83D\uDD34 Despite/In spite of + clause emas! Faqat noun yoki V-ing.\n\uD83D\uDD34 In spite of \u2014 always three words, never \u201cin spite\u201d.",
    "5\uFE0F\u20E3 DESPITE/IN SPITE OF + THE FACT THAT\n\nDespite/In spite of dan keyin full clause ishlatmoqchi bo\u2018lsangiz, \u201cthe fact that\u201d qo\u2018shing:\n\n  Despite the fact that he studied hard, he failed.\n  (Qattiq o\u2018qiganiga qaramay, u yiqildi.)\n  \u2192 despite + the fact that + clause\n\n  In spite of the fact that she was ill, she worked.\n  (Kasal bo\u2018lganiga qaramay, u ishladi.)\n\n\uD83D\uDD34 \u201cDespite the fact that\u201d \u2014 \u201calthough\u201d ning rasmiy versiyasi.\n\uD83D\uDD34 So\u2018zlashuvda \u201calthough\u201d qisqa va tabiiy.",
    "6\uFE0F\u20E3 HOWEVER / NEVERTHELESS / NONETHELESS\n\nBu so\u2018zlar ikkinchi gapni boshlaydi. Vergul bilan ajratiladi:\n\n  The weather was terrible. However, we decided to go.\n  (Ob-havo dahshatli edi. Biroq, biz ketishga qaror qildik.)\n\n  He was exhausted. Nevertheless, he continued working.\n  (U charchagan edi. Shunga qaramay, u ishlashda davom etdi.)\n\n  It was expensive. Nonetheless, it was worth every penny.\n  (Qimmat edi. Shunday bo\u2018lsa ham, har bir tiyiniga arzidi.)\n\n\uD83D\uDD34 However \u2014 eng keng tarqalgan.\n\uD83D\uDD34 Nevertheless, Nonetheless \u2014 rasmiy.\n\uD83D\uDD34 However \u2014 o\u2018rtada ham kelishi mumkin: It was, however, too late.",
    "7\uFE0F\u20E3 WHILE / WHEREAS\n\nWhile va whereas \u2014 ikki narsani solishtirish (usually contrasting):\n\n  While I enjoy cooking, my husband prefers eating out.\n  (Men ovqat pishirishni yoqtirsam, erim tashqarida ovqatlanishni afzal ko\u2018radi.)\n\n  Whereas some people love winter, others hate it.\n  (Ba\u2018zi odamlar qishni sevsa, boshqalar uni yomon ko\u2018radi.)\n\n  In Uzbekistan summer is hot, while winter is cold.\n  (O\u2018zbekistonda yoz issiq, qish esa sovuq.)\n\n\uD83D\uDD34 While/whereas + clause.\n\uD83D\uDD34 Vergul \u2014 while/whereas dan keyin.\n\uD83D\uDD34 Whereas \u2014 rasmiy, while \u2014 hamma uslubda.",
    "8\uFE0F\u20E3 O\u2018ZBEKCHA XATOLAR\n\n\u2022 Despite + clause: Despite he studied... \u2192 Despite studying... yoki Despite the fact that he studied...\n\u2022 In spite of \u2014 noto\u2018g\u2018ri yozish: Inspite of \u2192 In spite of (ikki so\u2018z)\n\u2022 Although + but: Although he was tired, but he continued \u2192 Although he was tired, he continued. (but kerak EMAS)\n\u2022 Despite/In spite of vergul: Despite the rain we went out \u2192 Despite the rain, we went out.\n\u2022 However ... but: However, but... \u2192 faqat bittasi.\n\u2022 O\u2018zbek tilida \u201c...ga qaramay, ...ga qaramasdan\u201d \u2014 ingliz tilida although+clause yoki despite+noun."
    ],
  vocabulary: [
    { en: 'concession', uz: "to'siqsizlik, qaramaylik", example: 'Concession shows contrast with expectation.', rule: 'Concept' },
    { en: 'although', uz: '...ga qaramay, ...bo\'lsa ham', example: 'Although it rained, we went out.', rule: 'Conjunction' },
    { en: 'despite', uz: '...ga qaramay', example: 'Despite the rain, we enjoyed it.', rule: 'Preposition' },
    { en: 'in spite of', uz: '...ga qaramay', example: 'In spite of the cold, she went swimming.', rule: 'Preposition' },
    { en: 'however', uz: 'biroq, ammo', example: 'It rained. However, we went out.', rule: 'Adverb' },
    { en: 'nevertheless', uz: 'shunga qaramay', example: 'He was tired. Nevertheless, he worked.', rule: 'Adverb' },
    { en: 'while', uz: '...gan holda, ...ganda', example: 'While I like tea, she likes coffee.', rule: 'Conjunction' },
    { en: 'whereas', uz: 'holbuki, ...gan bo\'lsa', example: 'Whereas some like heat, others prefer cold.', rule: 'Conjunction' },
    { en: 'contrast', uz: 'qarama-qarshilik, farq', example: 'Concession shows contrast between ideas.', rule: 'Meaning' },
    { en: 'expectation', uz: 'kutilma', example: 'Concession goes against expectation.', rule: 'Function' }
    ],
  examples: [
    { en: 'Although it was raining, we decided to go for a walk.', uz: "Yomg'ir yog'ayotgan bo'lsa ham, biz sayrga ketishga qaror qildik." },
    { en: "Even though she was terrified, she gave a brave speech.", uz: "Qo'rqqan bo'lsa ham, u jasurona nutq so'zladi." },
    { en: 'Despite the heavy traffic, we arrived on time.', uz: "Katta tirbandlikka qaramay, biz vaqtida yetib keldik." },
    { en: 'In spite of feeling nervous, he performed brilliantly.', uz: "Asabiy bo'lishiga qaramay, u ajoyib chiqish qildi." },
    { en: 'The hotel was expensive. However, it was worth the price.', uz: "Mehmonxona qimmat edi. Biroq, bu narxga arzidi." },
    { en: 'While I prefer reading books, my brother watches movies.', uz: "Men kitob o'qishni afzal ko'rsam, akam kino ko'radi." },
    { en: "He was exhausted. Nevertheless, he finished the marathon.", uz: "U charchagan edi. Shunga qaramay, u marafonni tugatdi." },
    { en: "Whereas some enjoy winter sports, others prefer summer activities.", uz: "Ba'zilar qishki sportlarni yoqtirsa, boshqalar yozgi mashg'ulotlarni afzal ko'radi." }
    ],
  specialCases: [
    {
      id: 'although-vs-despite',
      title: 'Although vs Despite \u2014 asosiy farqlar',
      rule: "Although + clause (S + V):\n  Although he was tired, he worked.\n  (Charchagan bo\u2018lsa ham, u ishladi.)\n\nDespite + noun / V-ing:\n  Despite his tiredness, he worked.\n  Despite being tired, he worked.\n  (Charchaganiga qaramay, u ishladi.)\n\nALTHOUGH + FULL CLAUSE = Subject + Verb\n  Although it rained... \u2714\n  Although raining... \u274C\n\nDESPITE + NOUN or V-ING\n  Despite the rain... \u2714\n  Despite raining... \u2714\n  Despite it rained... \u274C\n\n\uD83D\uDD34 Agar full clause kerak bo\u2018lsa: Despite the fact that + clause.",
      mnemonic: "Although + CLAUSE (S+V). Despite + NOUN/V-ing. ESLAB QOLING: \u201cAlthough he\u201d \u2714, \u201cDespite he\u201d \u274C. \u201cAlthough tired\u201d \u274C, \u201cDespite being tired\u201d \u2714.",
      commonMistakes: "Despite he studied... \u2192 Despite studying... / Despite the fact that he studied...\nAlthough the rain... \u2192 Although it rained... / Despite the rain...\nAlthough + but: Although he was tired, but he worked \u2192 Although he was tired, he worked.",
      examples: [
        { en: 'Although she was late, she didn\'t apologise.', uz: "Kechikkan bo'lsa ham, u kechirim so'ramadi." },
        { en: 'Despite being late, she didn\'t apologise.', uz: "Kechikkaniga qaramay, u kechirim so'ramadi." }
    ],
      drills: [
        { id: 50369, type: 'fill-blank', instruction: "Although yoki Despite?", question: '___ he was tired, he finished the race.', blanks: ['Although'], explanation: 'Although + clause (he was tired)' },
        { id: 50370, type: 'fill-blank', instruction: "Although yoki Despite?", question: '___ the rain, we enjoyed the picnic.', blanks: ['Despite'], explanation: 'Despite + noun (the rain) = yomg\'irga qaramasdan. Qoida: Despite + noun phrase: Despite the heavy rain, they played football. (Kuchli yomg\'irga qaramasdan, ular futbol o\'ynadi.)' },
        { id: 50371, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Despite he was tired, he continued working.', errorPart: 'Despite he was tired', correct: 'Despite being tired, he continued working.', explanation: 'Despite + V-ing = V-ing bilan, clause emas. Qoida: Despite feeling tired = charchagan his qilishiga qaramasdan. \'Despite + clause\' XATO! \'Despite he was tired\' XATO! \'Although he was tired\' to\'g\'ri.' }
    ],
    },
    {
      id: 'however-despite',
      title: 'However vs Despite \u2014 qayerda ishlatiladi?',
      rule: "However \u2014 ikkinchi gapni boshlaydi (new sentence):\n  It rained. However, we went out.\n  (Yomg\u2018ir yog\u2018di. Biroq, biz chiqib ketdik.)\n\nDespite \u2014 birinchi gap ichida (or second clause):\n  Despite the rain, we went out.\n  (Yomg\u2018irga qaramay, biz chiqib ketdik.)\n\nAHAMIYATLI FARQ:\n  However \u2014 ikki ALOHIDA gap.\n  Despite \u2014 bir gap ichida.\n\nHowever \u2014 o\u2018rtada ham kelishi mumkin:\n  It rained. We, however, decided to go out.\n\nDespite \u2014 faqat boshida yoki ikkinchi clause boshida:\n  We went out despite the rain.",
      mnemonic: "However = new sentence (Biroq...). Despite = same sentence (...ga qaramay). \u201cIt rained. However...\u201d vs \u201cDespite the rain...\u201d. However + comma, despite + noun.",
      commonMistakes: "It rained. Despite, we went out \u2192 It rained. However, we went out. (Despite noun kerak)\nHowever the rain, we went out \u2192 Despite the rain, we went out. (However new sentence kerak)",
      examples: [
        { en: 'The weather was bad. However, we had a great time.', uz: "Ob-havo yomon edi. Biroq, biz ajoyib vaqt o'tkazdik." },
        { en: 'We had a great time despite the bad weather.', uz: "Yomon ob-havoga qaramay, biz ajoyib vaqt o'tkazdik." }
    ],
      drills: [
        { id: 50372, type: 'fill-blank', instruction: "However yoki Despite?", question: 'The traffic was heavy. ___ , we arrived on time.', blanks: ['However'], explanation: 'New sentence = However (yangi gap). Qoida: \'However\' ikki gap orasida: She was tired. However, she finished. Vergul bilan ajratiladi.' },
        { id: 50373, type: 'fill-blank', instruction: "However yoki Despite?", question: '___ the heavy traffic, we arrived on time.', blanks: ['Despite'], explanation: 'Same sentence \u2014 Despite + noun' },
        { id: 50374, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'Which is CORRECT?', options: ['Despite, we went out.', 'However the rain, we went.', 'Despite the rain, we went.', 'However we went out.'], correct: 'Despite the rain, we went.', explanation: 'Despite + noun \u2014 to\'g\'ri' }
    ],
    }
    ],
  exercises: [
    { id: 50375, type: 'fill-blank', instruction: "Although bilan to'ldiring:", question: '___ it was cold, she went swimming.', blanks: ['Although'], explanation: 'Although — qarama-qarshilik bildiradi (garchi). \'Although it rained, we went out.\'' },
    { id: 50376, type: 'fill-blank', instruction: "Despite bilan to'ldiring:", question: '___ the cold, she went swimming.', blanks: ['Despite'], explanation: 'Despite — qarama-qarshilik + noun/V-ing. \'Despite the rain, we went out.\'' },
    { id: 50377, type: 'fill-blank', instruction: "Even though bilan to'ldiring:", question: '___ he was afraid, he spoke up.', blanks: ['Even though'], explanation: 'Even though + clause = ...ga qaramasdan (kuchli). Qoida: \'Even though\' \'although\' dan kuchliroq: Even though he was tired, he kept working. (Charchagan bo\'lsa HAM, u ishlashda davom etdi.)' },
    { id: 50378, type: 'fill-blank', instruction: "In spite of bilan to'ldiring:", question: '___ feeling tired, she finished her work.', blanks: ['In spite of'], explanation: 'In spite of + V-ing = ...ga qaramasdan. Qoida: In spite of + V-ing/noun: In spite of the rain, we enjoyed the trip. (Yomg\'irga qaramasdan, sayohat yoqdi.) \'Despite\' bilan sinonim.' },
    { id: 50379, type: 'fill-blank', instruction: "However bilan to'ldiring:", question: 'The hotel was expensive. ___ , it was worth it.', blanks: ['However'], explanation: 'New sentence = However (yangi gap). Qoida: \'However\' ikki gap orasida: She was tired. However, she finished. Vergul bilan ajratiladi.' },
    { id: 50380, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ the rain, we enjoyed the day.', blanks: ['Despite'], explanation: 'Despite — qarama-qarshilik + noun/V-ing. \'Despite the rain, we went out.\'' },
    { id: 50381, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ it was raining, we enjoyed the day.', blanks: ['Although'], explanation: 'Although — qarama-qarshilik bildiradi (garchi). \'Although it rained, we went out.\'' },
    { id: 50382, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'He was tired. ___ , he kept working.', blanks: ['However'], explanation: 'New sentence = However (yangi gap). Qoida: \'However\' ikki gap orasida: She was tired. However, she finished. Vergul bilan ajratiladi.' },
    { id: 50383, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: '___ I like tea, my brother prefers coffee.', blanks: ['While'], explanation: 'While \\u2014 contrast between two things' },
    { id: 50384, type: 'fill-blank', instruction: 'To\'g\'ri variantni tanlang:', question: 'He was late. It was, ___ , not his fault.', blanks: ['however'], explanation: 'However — o\'rtada ishlatiladi. Gap orasida qarama-qarshilikni bildiradi, vergul bilan.' },
    { id: 50385, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Although he was tired, but he continued working.', errorPart: 'but', correct: 'Although he was tired, he continued working.', explanation: "Although va but birga ishlatilmaydi" },
    { id: 50386, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Despite he was ill, he went to work.', errorPart: 'Despite he was ill', correct: 'Despite being ill, he went to work.', explanation: 'Despite + V-ing = V-ing bilan, clause emas. Qoida: Despite feeling tired = charchagan his qilishiga qaramasdan. \'Despite + clause\' XATO! \'Despite he was tired\' XATO! \'Although he was tired\' to\'g\'ri.' },
    { id: 50387, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Inspite of the rain, we went out.', errorPart: 'Inspite', correct: 'In spite of the rain, we went out.', explanation: 'In spite of \u2014 uch so\'z' },
    { id: 50388, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'It rained. Despite, we went out.', errorPart: 'Despite, we', correct: 'It rained. However, we went out.', explanation: 'Despite + noun, not used alone' },
    { id: 50389, type: 'error-correction', instruction: "Xatoni toping va to'g'rilang:", question: 'Despite the fact he was tired, he worked.', errorPart: 'the fact he was tired', correct: 'Despite the fact that he was tired, he worked.', explanation: "\"The fact that\" — Despite + the fact that + clause" },
    { id: 50390, type: 'transformation', instruction: "Although \u2192 Despite:", question: 'Although he was tired, he continued.', hint: 'Despite ...', correct: 'Despite being tired, he continued.', explanation: 'Although + clause \u2192 Despite + V-ing' },
    { id: 50391, type: 'transformation', instruction: "Despite \u2192 Although:", question: 'Despite the rain, we went out.', hint: 'Although ...', correct: 'Although it rained, we went out.', explanation: 'Despite + noun \u2192 Although + clause' },
    { id: 50392, type: 'transformation', instruction: "However bilan:", question: 'He was late. He was not blamed.', hint: 'He was late. However, ...', correct: 'He was late. However, he was not blamed.', explanation: 'However = ammo (yangi gapda). Qoida: \'However\' birinchi gapga zid keladigan ikkinchi gapni boshlaydi: The weather was bad. However, we still went hiking.' },
    { id: 50393, type: 'transformation', instruction: "While bilan:", question: 'I like summer. She likes winter.', hint: 'While ...', correct: 'While I like summer, she likes winter.', explanation: 'While + contrast = farqli o\'laroq (zidlik). Qoida: \'While\' ikki narsani solishtirishda: While I like coffee, my sister prefers tea. (Men kofeni yoqtirsam, singlim choyni afzal ko\'radi.)' },
    { id: 50394, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is CORRECT?", options: ["Despite the rain, we went.", "Despite of the rain, we went.", "Despite the raining, we went.", "Despite it rained, we went."], correct: "Despite the rain, we went.", explanation: "Despite + noun \u2014 to'g'ri" },
 
    { id: 55000, type: 'passage', instruction: 'Matnni to\'ldiring:',
      passage: '___ (1) (Although/Despite) it was raining, we went for a walk. ___ (2) (Despite/Although) the rain, we enjoyed our walk. She passed the exam ___ (3) (although/despite) she hadn\'t studied much. ___ (4) (In spite/Despite) of the difficulty, she succeeded.',
      blanks: ['Although', 'Despite', 'although', 'In spite'],
      acceptedAnswers: [['Although', 'Though', 'Even though'], ['Despite', 'In spite of'], ['although', 'though'], ['In spite', 'Despite']],
      explanation: 'Although + clause (S+V). Despite/In spite of + noun/V-ing. Qarama-qarshilikni ifodalaydi.' },

    { id: 55009, type: 'connection',
      instruction: 'Qarama-qarshiliklar',
      prompt: 'Hayotingizdagi qiyinchiliklarga qaramay erishgan muvaffaqiyatlaringiz haqida although/despite bilan yozing.',
      hints: ['\'Although it was difficult...\'', '\'Despite the challenges...\'', '\'Even though I...\''],
      exampleAnswer: 'Although learning English was difficult at first, I never gave up. Despite the challenges, I improved every day. Even though I made many mistakes, I kept practising.' }
    ,
    {"id":101749,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"although","options":["...ga qaramay (+ clause)","...ga qaramay (+ noun)","biroq (yangi gap)","...gan holda"],"correct":"...ga qaramay (+ clause)","explanation":"Although — qarama-qarshilik, to'liq gap bilan ishlatiladi."},
    {"id":101750,"type":"vocab-match","instruction":"So'zning ma'nosini tanlang","word":"despite","options":["...ga qaramay (+ noun/V-ing)","...ga qaramay (+ clause)","biroq (yangi gap)","holbuki"],"correct":"...ga qaramay (+ noun/V-ing)","explanation":"Despite — qarama-qarshilik, noun yoki V-ing bilan ishlatiladi."},


    // ── Interleaved Practice: Concession + Contrast ──
    { id: 95671, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ it rained, we went out. ___ the rain, we went out.", blanks: ['Although', 'Despite'], explanation: "Although + clause. Despite + noun." },
    { id: 95672, type: 'fill-blank', instruction: "Despite + V-ing:", question: "Despite ___ (be) tired, she finished. Although she ___ (be) tired, she finished.", blanks: ['being', 'was'], explanation: "Despite + V-ing. Although + clause." },
    { id: 95673, type: 'error-correction', instruction: "Despite vs although:", question: "Despite of the rain, we went out. Although the rain, we went out.", errorPart: 'Despite of / Although the rain', correct: 'Despite the rain, we went out. Although it rained, we went out.', explanation: "Despite + noun (of siz). Although + clause." },
    { id: 95674, type: 'fill-blank', instruction: "Whereas (qarama-qarshi):", question: "He likes tea, ___ she prefers coffee. ___ he is shy, he spoke well.", blanks: ['whereas', 'Although'], explanation: "Whereas = while (contrast). Although = concession." },
    { id: 95675, type: 'transformation', instruction: "Although → Despite:", question: "Although she was tired, she finished. → Despite ___ tired, she finished.", hint: "Despite ___ tired...", correct: 'being', explanation: "Although + clause → Despite + V-ing." }
],
  exerciseSections: [
    { title: "Boshlang'ich", desc: 'Concession turlari', color: 'bg-emerald-500', icon: '🌱', ids: [50375, 50376, 50377, 50378, 50379] },
    { title: "O'rtacha", desc: 'Tanlash mashqlari', color: 'bg-blue-500', icon: '📘', ids: [50380, 50381, 50382, 50383, 50384] },
    { title: "Qiyin", desc: 'Xatolarni topish', color: 'bg-violet-500', icon: '🎯', ids: [50385, 50386, 50387, 50388, 50389] },
    { title: "O'zgartirish", desc: 'Aralash — yakuniy sinov', color: 'bg-teal-500', icon: '🔄', ids: [50390, 50391, 50392, 50393, 50394, 55000, 55009, 101749, 101750] },
  
    
    { title: "🔀 Aralash", desc: "Concession + Contrastive structures farqi", color: 'bg-fuchsia-500', icon: '🔄', ids: [95671, 95672, 95673, 95674, 95675] },],
  tests: [
    { id: 50395, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Concession nima?", blanks: ["qaramay, qarama-qarshilik"], explanation: "Concession = qaramay — tarjima" },
    { id: 50396, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Although dan keyin nima keladi?", blanks: ["full clause (S+V)"], explanation: "Although — qarama-qarshilik bildiradi (garchi). 'Although it rained, we went out.'" },
    { id: 50397, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Despite dan keyin nima keladi?", blanks: ["noun / V-ing"], explanation: "Despite + noun/V-ing = ...ga qaramasdan. Qoida: Despite + noun: Despite the rain, we went out. 'Despite + V-ing': Despite feeling tired, she continued. 'Although' dan farqli: despite + noun (not clause)." },
    { id: 50398, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "However qayerda ishlatiladi?", blanks: ["gap boshida, yangi gapda"], explanation: "However = ammo (yangi gapda). Qoida: 'However' birinchi gapga zid keladigan ikkinchi gapni boshlaydi: The weather was bad. However, we still went hiking." },
    { id: 50399, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "While/Whereas nima uchun ishlatiladi?", blanks: ["solishtirish"], explanation: "While/Whereas = contrast/comparison" },
    { id: 50400, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ it was hot, she wore a jacket.", blanks: ["Although"], explanation: "Although — qarama-qarshilik bildiradi (garchi). 'Although it rained, we went out.'" },
    { id: 50401, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ the heat, she wore a jacket.", blanks: ["Despite"], explanation: "Despite — qarama-qarshilik + noun/V-ing. 'Despite the rain, we went out.'" },
    { id: 50402, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "He was late. ___ , he didn't apologise.", blanks: ["However"], explanation: "New sentence = However (yangi gap). Qoida: 'However' ikki gap orasida: She was tired. However, she finished. Vergul bilan ajratiladi." },
    { id: 50403, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ I love summer, my sister prefers winter.", blanks: ["While"], explanation: "While + contrast = farqli o'laroq (zidlik). Qoida: 'While' ikki narsani solishtirishda: While I like coffee, my sister prefers tea. (Men kofeni yoqtirsam, singlim choyni afzal ko'radi.)" },
    { id: 50404, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "He passed the exam ___ not studying much.", blanks: ["despite"], explanation: "Despite + V-ing (not studying)" },
    { id: 50405, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which is CORRECT?", options: ["In spite of being tired, he continued.", "In spite of be tired, he continued.", "In spite of to be tired, he continued.", "In spite of been tired, he continued."], correct: "In spite of being tired, he continued.", explanation: "In spite of + V-ing \u2014 to'g'ri" },
    { id: 50406, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "Which sentence has the SAME meaning as 'Despite the rain, we went out'?", blanks: ["All of the above"], explanation: "Barchasi similar meaning" },
    { id: 50407, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "___ the fact that he was ill, he went to work.", blanks: ["Despite"], explanation: "Despite + the fact that + clause" },
    { id: 50408, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "Which sentence is grammatically CORRECT?", options: ["He was tired. However, he worked.", "He was tired; however, he worked.", "He was tired, however, he worked.", "He was tired however he worked."], correct: "He was tired. However, he worked.", explanation: "However = new sentence \u2014 to'g'ri" },
    { id: 50409, type: 'fill-blank', instruction: "To'g'ri javobni yozing:", question: "What is the difference between 'although' and 'despite'?", blanks: ["although + clause, despite + noun/V-ing"], explanation: "Although + clause, Despite + noun/V-ing" },
    ],
  testSections: [
    { title: 'Oson', desc: 'Concession asoslari', color: 'bg-emerald-500', icon: '\uD83C\uDF31', ids: [50395, 50396, 50397, 50398, 50399] },
    { title: "O'rtacha", desc: "Qoidani qo'llash", color: 'bg-blue-500', icon: '\uD83D\uDCD8', ids: [50400, 50401, 50402, 50403, 50404] },
    { title: 'Qiyin', desc: 'Murakkab holatlar', color: 'bg-violet-500', icon: '\uD83D\uDCAA', ids: [50405, 50406, 50407] },
    { title: 'Murakkab', desc: 'Concession master', color: 'bg-rose-500', icon: '\uD83C\uDFC6', ids: [50408, 50409] }
    ],
}
