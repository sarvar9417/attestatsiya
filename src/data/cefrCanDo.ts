/**
 * CEFR Can-Do Statements
 *
 * Each level has general can-do statements.
 * Each lesson also has a specific can-do statement showing what
 * the learner will be able to do after completing it.
 *
 * These are displayed in LearnHub lesson cards and LessonView headers
 * to give learners a clear sense of progress (CEFR "I can..." philosophy).
 */

/** Level-wide can-do statements */
export const LEVEL_CAN_DO: Record<string, string[]> = {
  A0: [
    "Salomlashish va o'zimni tanishtirish",
    "Raqamlar va alifboni bilish",
    "Oilam haqida gapirish",
  ],
  A1: [
    "O'zimni va boshqalarni tanishtirish",
    "Oddiy iboralarni tushunish va ishlatish",
    "Sodda savollar berish va javob qaytarish",
    "Kundalik mavzularda gaplasha olish",
  ],
  A2: [
    "O'tmishdagi voqealar haqida gapirish",
    "Qisqa ijtimoiy muloqot qilish",
    "Oddiy yo'l-yo'riq so'rash va berish",
    "Qisqa matn va xatlar yozish",
  ],
  'B1+': [
    "Murakkab fikrlarni ifodalash",
    "Bahslashish va fikrni himoya qilish",
    "Mavhum mavzularda suhbatlashish",
    "Batafsil insho va hisobot yozish",
  ],
  B1: [
    "Tajriba va voqealarni tasvirlash",
    "Fikr va rejalarni tushuntirish",
    "Sayohatda mustaqil muloqot qilish",
    "Bog'langan matn yozish",
  ],
  B2: [
    "Ravon va spontan muloqot qilish",
    "Texnik mavzularda gapirish",
    "Dalil keltirish va bahslashish",
    "Aniq va batafsil matn yozish",
  ],
}

/** Lesson-specific can-do statements mapped by lesson ID */
export const LESSON_CAN_DO: Record<string, string> = {
  // ── A0 ───────────────────────────────────────────────────────────────
  'greetings-names':       "Hello, hi, goodbye — ingliz tilida salomlasha olaman",
  'numbers-alphabet':      "1 dan 10 gacha sanay olaman va alifboni bilaman",
  'family-me':             "Oilam a'zolari haqida gapira olaman",
  'auto-review-1':         "A0 darajasidagi barcha mavzularni takrorlayman",

  // ── A1 ───────────────────────────────────────────────────────────────
  'greetings-introductions': "Hello, goodbye va o'zimni tanishtira olaman",
  'alphabet-greetings':    "Ingliz alifbosini aytib, odamlar bilan salomlasha olaman",
  'numbers-1-100':         "1 dan 100 gacha sanay, yosh va narxlarni ayta olaman",
  'colors-shapes':         "Ranglar va shakllarni ingliz tilida ayta olaman",
  'family':                "Oila a'zolarimni tanishtira olaman",
  'days-months':           "Hafta kunlari, oylar va fasllarni ayta olaman",
  'time-routines':         "Soatni aytib, kunlik tartibim haqida gapira olaman",
  'food-drinks':           "Ovqat va ichimliklar nomlarini bilaman",
  'animals':               "Hayvonlar nomlarini ingliz tilida ayta olaman",
  'body-parts':            "Tana a'zolarini ko'rsatib ayta olaman",
  'clothes':               "Kiyimlar nomlarini bilaman",
  'demonstratives':        "Bu va u kabi ko'rsatish olmoshlarini ishlata olaman",
  'there-is-are':          "Biror narsa bor yoki yo'qligini ayta olaman",
  'prepositions-of-place': "Joylashuvni (in, on, under) ayta olaman",
  'basic-adjectives':      "Sifatlar (big, small, happy) yordamida narsalarni tasvirlay olaman",
  'articles-a-an-the':     "A, an, the artikllarini to'g'ri ishlata olaman",
  'have-got':              "Egalikni (I have got) ifodalay olaman",
  'can-cant':              "Qila olishim va qila olmasligim haqida gapira olaman",
  'simple-present':        "Kunlik odatlarim haqida hozirgi zamonda gapira olaman",
  'present-continuous':    "Hozir sodir bo'layotgan harakatlarni tasvirlay olaman",
  'simple-past':           "O'tgan voqealar haqida gapira olaman",
  'simple-future':         "Kelajak rejalarim (will/going to) haqida gapira olaman",
  'question-words':        "What, where, when kabi savollarni beray olaman",
  'conjunctions':          "And, but, because yordamida gaplarni bog'lay olaman",
  'a1-review':             "A1 darajasidagi barcha mavzularni mustahkamlayman",
  'auto-review-2':         "Birinchi 5 ta A1 mavzusini takrorlayman",
  'auto-review-3':         "Keyingi 5 ta A1 mavzusini takrorlayman",
  'auto-review-4':         "Asosiy tuzilmalarni takrorlayman",
  'auto-review-5':         "Fe'l zamonlari va can/can't ni takrorlayman",

  // ── A2 ───────────────────────────────────────────────────────────────
  'modal-verbs':           "Modal fe'llar (can, must, should) bilan muloqot qila olaman",
  'articles':              "A, an, the artikllarini to'g'ri ishlata olaman",
  'prepositions':          "At, in, on predloglarini vaqt va joyda ishlata olaman",
  'questions':             "Har xil turdagi savollarni bera olaman",
  'countable-uncountable': "Sanaladigan va sanalmaydigan otlarni farqlay olaman",
  'adjective-adverb':      "Sifat va ravishlarni farqlay olaman",
  'comparatives-superlatives': "Ikki narsani solishtirib, eng zo'rini ayta olaman",
  'gerunds-infinitives':   "Gerund va infinitivni to'g'ri ishlata olaman",
  'past-continuous':       "O'tmishda davom etgan harakatlarni tasvirlay olaman",
  'present-perfect':       "O'tmish va hozirgi zamonni bog'lay olaman",
  'passive-voice':         "Majhul nisbatda gapira olaman",
  'reported-speech':       "Boshqalarning gapini aytib bera olaman",
  'first-conditional':     "Real shartlarni ifodalay olaman",
  'verb-patterns':         "Fe'llardan keyin to'g'ri shaklni ishlata olaman",
  'time-prepositions':     "Vaqt predloglarini (before, after, during) ishlata olaman",
  'possessives':           "Egalikni (my, your, 's) to'g'ri ifodalay olaman",
  'some-any-no-every':     "Some, any, no so'zlarini to'g'ri ishlata olaman",
  'present-continuous-future': "Kelajakdagi rejalarni present continuous bilan ayta olaman",
  'quantifiers':           "Much, many, a lot of kabi miqdor so'zlarini ishlata olaman",
  'too-enough':            "Too va enough ni to'g'ri ishlata olaman",
  'so-such':               "So va such yordamida hissiyotlarni kuchaytira olaman",
  'a2-review-2':           "A2 ning ikkinchi qismini takrorlayman",
  'auto-review-6':         "A2 ning birinchi 5 mavzusini takrorlayman",
  'auto-review-7':         "A2 ning ikkinchi 5 mavzusini takrorlayman",
  'auto-review-8':         "A2 ning uchinchi 5 mavzusini takrorlayman",
  'auto-review-9':         "A2 ning to'rtinchi 5 mavzusini takrorlayman",

  // ── B1 ───────────────────────────────────────────────────────────────
  'present-perfect-continuous': "Hozirgacha davom etgan harakatlarni tasvirlay olaman",
  'past-perfect':          "O'tmishdagi ikki harakatni tartib bilan aytib bera olaman",
  'past-perfect-continuous': "O'tmishda davom etib, boshqa harakatgacha bo'lgan jarayonlarni ayta olaman",
  'past-habits':           "O'tmishdagi odatlarim (used to) haqida gapira olaman",
  'future-forms-review':   "Will, going to, present continuous bilan kelajakni ifodalay olaman",
  'future-continuous':     "Kelajakda bir vaqtda sodir bo'ladigan harakatlarni tasvirlay olaman",
  'future-perfect':        "Kelajakda bir vaqtgacha tugagan bo'ladigan ishlarni ayta olaman",
  'modals-obligation':     "Majburiyat va maslahat (must, have to, should) ni ifodalay olaman",
  'modals-speculation':    "Taxmin va ehtimollik (might, could, must be) ni ifodalay olaman",
  'causatives':            "Biror ishni boshqaga qildirish (have/get done) ni ayta olaman",
  'relative-clauses-b1':   "Who/which/that bilan murakkab gaplar tuza olaman",
  'phrasal-verbs-b1':      "Asosiy phrasal verb'larni ishlata olaman",
  'question-tags':         "Question tags bilan tasdiqni tekshira olaman",
  'indirect-questions':    "Muloyim savollarni (Can you tell me...) bera olaman",
  'both-either-neither':   "Both, either, neither ni to'g'ri ishlata olaman",
  'so-neither-auxiliaries': "So do I / Neither do I bilan rozilik bildira olaman",
  'time-clauses':          "When, while, until kabi vaqt bog'lovchilarini ishlata olaman",
  'wishes-regrets':        "Orzu-niyat va pushaymonliklarim (I wish) haqida gapira olaman",
  'pragmatics-formal-informal': "Rasmiy va norasmiy muloqot uslubini farqlay olaman",
  'auto-review-10':        "B1 zamonlarini takrorlayman",
  'auto-review-11':        "B1 futur zamon va modallarni takrorlayman",
  'auto-review-12':        "B1 gap qurilmalarini takrorlayman",
  'auto-review-13':        "B1 vaqt bog'lovchi va orzularni takrorlayman",

  // ── B1+ ──────────────────────────────────────────────────────────────
  'narrative-tenses-b1plus':         "Hikoya qilish uchun barcha o'tgan zamonlarni ishlata olaman",
  'advanced-relative-clauses-b1plus': "Whom, whose bilan murakkab nisbiy gaplar tuza olaman",
  'participle-clauses-b1plus':       "Qisqa va samarali gaplar tuza olaman",
  'infinitive-gerund-advanced-b1plus': "Infinitive va gerundni nozik farqlari bilan ishlata olaman",
  'modal-perfects-b1plus':           "O'tmish haqida taxmin va afsus (must have, should have) bildira olaman",
  'emphasis-does-b1plus':            "Do/does/did yordamida gapga urg'u bera olaman",
  'fronting-b1plus':                 "Gap bo'laklarini oldinga chiqarib, uslubiy ta'sir yarata olaman",
  'ellipsis-substitution-b1plus':    "So'zlarni tushirib qoldirib, tabiiy gaplar tuza olaman",
  'concession-b1plus':               "Although, despite yordamida qarama-qarshilikni ifodalay olaman",
  'linking-words-advanced-b1plus':   "Furthermore, consequently kabi bog'lovchilarni ishlata olaman",
  'collocations-make-do-have-take-b1plus': "Make, do, have, take bilan kollokatsiyalarni ishlata olaman",
  'advanced-phrasal-verbs-b1plus':   "Murakkab phrasal verb'larni (run out of, put up with) ishlata olaman",
  'idioms-common-b1plus':            "20 ta keng tarqalgan idiomni tushunaman va ishlata olaman",
  'prepositional-phrases-b1plus':    "By accident, in advance kabi predlogli iboralarni ishlata olaman",
  'word-formation-b1plus':           "Suffixlar (-tion, -ment) bilan so'z yasay olaman",
  'reporting-verbs-b1plus':          "Suggest, recommend, admit kabi reporting verb'larni ishlata olaman",
  'determiners-advanced-b1plus':     "All, each, every, none ni to'g'ri ishlata olaman",
  'b1plus-review':                   "B1+ darajasidagi barcha mavzularni mustahkamlayman",
  'auto-review-14':                  "B1+ birinchi 5 mavzusini takrorlayman",
  'auto-review-15':                  "B1+ ikkinchi 5 mavzusini takrorlayman",
  'auto-review-16':                  "B1+ kolokatsiya va iboralarni takrorlayman",

  // ── B2 ───────────────────────────────────────────────────────────────
  'unreal-past-b2':                  "Xayoliy vaziyatlar (wish, if only) haqida gapira olaman",
  'advanced-conditionals-b2':        "Mixed va inverted conditionals bilan murakkab shartlarni ifodalay olaman",
  'future-perfect-continuous':       "Kelajakda bir vaqtgacha davom etgan bo'ladigan harakatlarni ayta olaman",
  'nominalization-b2':               "Fe'l va sifatlarni otga aylantirib, rasmiy uslubda yozishim mumkin",
  'subjunctive-b2':                  "Subjunktiv (I suggest that he be) ni ishlata olaman",
  'advanced-passive-b2':             "Murakkab passiv tuzilmalarni ishlata olaman",
  'hedging-b2':                      "Ehtiyotkorlik bilan (seems to, tends to) fikr bildira olaman",
  'complex-prepositions-b2':         "In spite of, by means of kabi murakkab predloglarni ishlata olaman",
  'cohesion-b2':                     "Matn uyg'unligi uchun bog'lovchi va havola vositalarini ishlata olaman",
  'register-b2':                     "Rasmiy va norasmiy uslubni farqlay olaman",
  'complex-sentences-b2':            "Ko'p bo'lakli murakkab gaplar tuza olaman",
  'advanced-modals-b2':              "Needn't have, had better, dare kabi ilg'or modallarni ishlata olaman",
  'contrastive-structures-b2':       "While, whereas, unlike bilan qarama-qarshilikni ifodalay olaman",
  'inversion-b2':                    "Inversiya (Never have I...) bilan urg'u bera olaman",
  'cleft-sentences-b2':              "Ajratilgan gaplar (It is...that) bilan ta'kidlay olaman",
  'punctuation-b2':                  "Colon, semicolon, dash larni to'g'ri ishlata olaman",
  'academic-collocations-b2':        "Conduct research, draw a conclusion kabi akademik iboralarni ishlata olaman",
  'academic-vocabulary-b2':          "50 ta IELTS akademik so'zini bilaman",
  'critical-thinking-b2':            "Argue, claim, refute kabi tanqidiy fikrlash so'zlarini ishlata olaman",
  'b2-review':                       "B2 darajasidagi barcha mavzularni mustahkamlayman",
  'argument-structure-b2':           "Akademik bahs va dalil keltirish (claim, evidence) ni tuza olaman",
  'stance-markers-b2':               "Munosabat va baho (epistemic, evaluative) bildira olaman",
  'paraphrasing-b2':                 "Matnni qayta ifodalab, xulosa chiqara olaman",
  'advanced-verb-patterns-b2':       "Stop/remember/try + ing vs to farqini bilaman",
  'b2-comprehensive-review':         "Barcha B2 mavzularini takrorlab, IELTS ga tayyorman!",
  'british-american-differences':    "British va American ingliz farqlarini bilaman va ishlata olaman",
  'modals-pragmatics-b2':            "Modallar yordamida shakl bildirish va ehtiyotkorlik bilan gapira olaman",
  'auto-review-22':                  "B2 darajasidagi barcha mavzularni yakunlab takrorlayman",
  'auto-review-17':                  "B2 birinchi 5 mavzusini takrorlayman",
  'auto-review-18':                  "B2 akademik yozuv mavzularini takrorlayman",
  'auto-review-19':                  "B2 murakkab grammatikani takrorlayman",
  'auto-review-20':                  "B2 akademik ko'nikmalarni takrorlayman",
  'auto-review-21':                  "B2 yakuniy takrorlash",
}

/** Get can-do statement for a lesson by its ID */
export function getLessonCanDo(lessonId: string): string | undefined {
  return LESSON_CAN_DO[lessonId]
}

/** Get level-wide can-do statements */
export function getLevelCanDo(level: string): string[] {
  // Normalise level keys (B1+ -> B1+, but A2+ doesn't exist in our map)
  const normalised = level === 'A2+' ? 'A2' : level
  return LEVEL_CAN_DO[normalised] ?? []
}
