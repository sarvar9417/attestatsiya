/**
 * seed-interleaved.ts — Interleaved (aralash) takror mashqlarini qo'shish
 *
 * Har darsga 5 ta mashq: dars mavzusini AVVAL o'rganilgan grammatika bilan
 * aralashtiradi (interleaving — retrieval va farqlashni kuchaytiradi).
 * + "🔀 Aralash" exerciseSection.
 *
 * MUHIM: barcha apostrofli matnlar QO'SHTIRNOQda (parallel skript bir tirnoq +
 * apostrof bilan sintaksisni buzgandi). ID'lar 95001+ (barcha mavjuddan yuqori).
 *
 * Ishlatish: npx tsx scripts/seed-interleaved.ts  (idempotent)
 */
import { readFileSync, writeFileSync } from 'fs'

interface Lesson { id: string; name: string; section: string; exercises: string }

// b1Part1.ts darslari — har biri mavzusini boshqa grammatika bilan aralashtiradi
const B1: Lesson[] = [
  {
    id: 'pastHabits', name: 'Past Habits',
    section: "Past habits + Past Simple/Continuous farqi",
    exercises: `    // ── Interleaved Practice: Past Habits + Past Simple/Continuous ──
    { id: ID0, type: 'multiple-choice', instruction: "O'tgan odat va aniq voqeani farqlang:", question: "When I was a child, I _____ in this park every day. Last week, I _____ my old friend here.", options: ["used to play / met", "played / would meet", "would play / used to meet", "was playing / have met"], correct: "used to play / met", explanation: "Har kuni bolalikda = o'tgan odat → used to play. Last week = aniq voqea → Past Simple (met)." },
    { id: ID1, type: 'fill-blank', instruction: "Used to (odat) va Past Simple (bitta voqea):", question: "I _____ in a small village, but last year I _____ to the city.", blanks: ["used to live", "moved"], explanation: "Qishloqda yashash = o'tgan holat → used to live. Last year I moved = aniq voqea → Past Simple." },
    { id: ID2, type: 'error-correction', instruction: "Would xatosi — state fe'llar bilan would ishlatilmaydi:", question: "When I was young, I would have a red bicycle.", errorPart: "would have", correct: "When I was young, I used to have a red bicycle.", explanation: "Have = state fe'l (egalik). Would faqat action fe'llar bilan; state uchun used to." },
    { id: ID3, type: 'multiple-choice', instruction: "Past Continuous (fon) va Past Simple (uzilish):", question: "I _____ TV when the phone suddenly _____.", options: ["was watching / rang", "watched / was ringing", "used to watch / rang", "would watch / rang"], correct: "was watching / rang", explanation: "Davom etgan fon harakat → Past Continuous; uni uzgan qisqa voqea → Past Simple." },
    { id: ID4, type: 'transformation', instruction: "Past Simple ni Used to ga o'zgartiring (odat ekanini ko'rsatish):", question: "He walked to school every day when he was a child.", hint: "He used to ...", correct: "He used to walk to school every day when he was a child.", explanation: "Har kuni yurish = o'tgan odat → used to walk (endi qilmasligini ta'kidlaydi)." },`,
  },
  {
    id: 'causatives', name: 'Causatives',
    section: "Causative + Active/Passive farqi",
    exercises: `    // ── Interleaved Practice: Causatives + Active/Passive ──
    { id: ID0, type: 'multiple-choice', instruction: "Have something done va o'zi qilish:", question: "I can't cut hair myself, so I _____ at the salon. My sister _____ her own hair.", options: ["have it cut / cuts", "have cut it / cut", "get cut it / is cutting", "had cut / has cut"], correct: "have it cut / cuts", explanation: "Boshqa qildiradi → have it cut (causative). O'zi qiladi → cuts (oddiy active)." },
    { id: ID1, type: 'fill-blank', instruction: "Causative (have/get sth done) ni to'ldiring:", question: "We are _____ our house _____ next month (someone else does it).", blanks: ["having", "painted"], explanation: "Have + object + V3 = boshqaga qildirish: having our house painted." },
    { id: ID2, type: 'error-correction', instruction: "Causative tartibi xatosi:", question: "I had cut my hair yesterday by a barber.", errorPart: "had cut my hair", correct: "I had my hair cut yesterday by a barber.", explanation: "To'g'ri tartib: have + OBJECT + V3 → had my hair cut (object fe'ldan oldin)." },
    { id: ID3, type: 'multiple-choice', instruction: "Passive va Causative farqi:", question: "The window _____ by a thief. Then we _____ by a professional.", options: ["was broken / had it repaired", "broke / repaired it", "is broken / repair it", "had broken / was repaired"], correct: "was broken / had it repaired", explanation: "Oddiy passive (kim sindirgani noma'lum) → was broken. Boshqaga tuzattirish → had it repaired." },
    { id: ID4, type: 'transformation', instruction: "Active ni causative (get something done) ga aylantiring:", question: "A mechanic checks my car every year.", hint: "I get my car ...", correct: "I get my car checked every year.", explanation: "Get + object + V3 = boshqaga qildirish: get my car checked." },`,
  },
  {
    id: 'questionTags', name: 'Question Tags',
    section: "Tag question + Direct/Indirect question farqi",
    exercises: `    // ── Interleaved Practice: Question Tags + Direct/Indirect questions ──
    { id: ID0, type: 'multiple-choice', instruction: "Tag question va direct question:", question: "You are from Tashkent, _____? _____ you live near the centre?", options: ["aren't you / Do", "isn't it / Are", "don't you / Did", "are you / Do"], correct: "aren't you / Do", explanation: "Tasdiq gap → inkor tag (aren't you). Direct question → Do + subject + verb." },
    { id: ID1, type: 'fill-blank', instruction: "Tag qo'shing (inkor gap → tasdiq tag):", question: "She hasn't finished yet, _____?", blanks: ["has she"], explanation: "Inkor gap (hasn't) → tasdiq tag (has she). Auxiliary mosligi: have/has." },
    { id: ID2, type: 'error-correction', instruction: "Indirect question tartibi xatosi:", question: "Can you tell me where is the station?", errorPart: "where is the station", correct: "Can you tell me where the station is?", explanation: "Indirect question'da inversiya yo'q: where the station IS (subject + verb)." },
    { id: ID3, type: 'multiple-choice', instruction: "Tag — to be va to do mosligi:", question: "They went home early, _____? He doesn't smoke, _____?", options: ["didn't they / does he", "don't they / does he", "weren't they / is he", "didn't they / is he"], correct: "didn't they / does he", explanation: "Past Simple (went) → didn't they. Present (doesn't) → does he. Tag auxiliary'ga mos kelishi kerak." },
    { id: ID4, type: 'transformation', instruction: "Direct question ni indirect qiling:", question: "What time does the bus leave?", hint: "Do you know what time ...", correct: "Do you know what time the bus leaves?", explanation: "Indirect: inversiya yo'q, 's' qaytadi → what time the bus leaves." },`,
  },
  {
    id: 'modalsSpeculation', name: 'Modals of Speculation',
    section: "Speculation (taxmin) + Obligation (majburiyat) farqi",
    exercises: `    // ── Interleaved Practice: Modals of Speculation + Obligation ──
    { id: ID0, type: 'multiple-choice', instruction: "Speculation va obligation (bir xil so'z, ikki ma'no):", question: "He _____ be at work now (I'm sure). You _____ finish this by 5 PM (rule).", options: ["must / have to", "might / must", "can't / should", "could / need to"], correct: "must / have to", explanation: "Must be = taxmin (100% ishonch). Have to finish = tashqi majburiyat." },
    { id: ID1, type: 'fill-blank', instruction: "Can't (imkonsiz taxmin) ni to'ldiring:", question: "The lights are off, so they _____ be at home.", blanks: ["can't"], explanation: "Dalilga asoslangan imkonsizlik → can't be (mustn't emas — mustn't = taqiq)." },
    { id: ID2, type: 'error-correction', instruction: "Speculation xatosi — mustn't vs can't:", question: "She speaks perfect French, so she mustn't be a beginner.", errorPart: "mustn't be", correct: "She speaks perfect French, so she can't be a beginner.", explanation: "Imkonsiz taxmin → can't be. Mustn't = taqiq (ruxsat yo'q), taxmin emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Might (ehtimol) va must (majburiyat):", question: "It _____ rain later, take an umbrella. You _____ wear a seatbelt — it's the law.", options: ["might / must", "must / might", "can't / should", "should / might"], correct: "might / must", explanation: "Ehtimollik → might rain. Qonuniy majburiyat → must wear." },
    { id: ID4, type: 'transformation', instruction: "Aniq gapni taxminga (must be) aylantiring:", question: "I'm sure he is tired after the trip.", hint: "He must ...", correct: "He must be tired after the trip.", explanation: "Dalilga asoslangan ishonchli taxmin → must be tired." },`,
  },
  {
    id: 'wishesRegrets', name: 'Wishes and Regrets',
    section: "Wish/regret + Conditionals farqi",
    exercises: `    // ── Interleaved Practice: Wishes/Regrets + Conditionals ──
    { id: ID0, type: 'multiple-choice', instruction: "Wish (hozirgi orzu) va wish (o'tmish afsus):", question: "I wish I _____ taller. I wish I _____ harder for the last exam.", options: ["were / had studied", "was / studied", "am / studied", "were / studied"], correct: "were / had studied", explanation: "Hozirgi orzu → wish + Past (were). O'tmish afsus → wish + Past Perfect (had studied)." },
    { id: ID1, type: 'fill-blank', instruction: "If only (kuchli afsus) + Past Perfect:", question: "If only I _____ (not / miss) the train, I wouldn't be late now.", blanks: ["hadn't missed"], explanation: "O'tmishdagi afsus → if only + Past Perfect (hadn't missed)." },
    { id: ID2, type: 'error-correction', instruction: "Wish xatosi — hozirgi orzu uchun Past:", question: "I wish I have more free time these days.", errorPart: "have", correct: "I wish I had more free time these days.", explanation: "Hozirgi (real bo'lmagan) orzu → wish + Past Simple (had), 'have' emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Wish va third conditional (o'tmish):", question: "I wish I _____ you earlier. If I _____ you, I would have helped.", options: ["had called / had called", "called / called", "have called / called", "had called / called"], correct: "had called / had called", explanation: "Ikkalasi ham o'tmishdagi real bo'lmagan holat → Past Perfect (had called)." },
    { id: ID4, type: 'transformation', instruction: "Real holatni wish (afsus) ga aylantiring:", question: "I didn't buy the tickets, and now they are sold out.", hint: "I wish I ...", correct: "I wish I had bought the tickets.", explanation: "O'tmishdagi qilinmagan ish afsusi → wish + Past Perfect (had bought)." },`,
  },
  {
    id: 'futureFormsReview', name: 'Future Forms',
    section: "Will / Going to / Present Continuous / Present Simple farqi",
    exercises: `    // ── Interleaved Practice: Future Forms (will / going to / PC / PS) ──
    { id: ID0, type: 'multiple-choice', instruction: "Dalilli bashorat (going to) va va'da (will):", question: "Look at those clouds! It _____ rain. Don't worry, I _____ carry your bag.", options: ["is going to / will", "will / is going to", "is going to / is going to", "will / will"], correct: "is going to / will", explanation: "Hozirgi dalil → is going to rain. O'sha onda berilgan va'da → will carry." },
    { id: ID1, type: 'fill-blank', instruction: "Arrangement (PC) va timetable (PS):", question: "I _____ the dentist at 3 tomorrow (arranged). The film _____ at 7 pm (schedule).", blanks: ["am meeting", "starts"], explanation: "Kelishilgan uchrashuv → Present Continuous (am meeting). Jadval → Present Simple (starts)." },
    { id: ID2, type: 'error-correction', instruction: "Spontan qaror — will, going to emas:", question: "The phone is ringing. I am going to answer it.", errorPart: "am going to answer", correct: "The phone is ringing. I will answer it.", explanation: "O'sha onda qabul qilingan qaror → will. Going to oldindan rejalashtirilgan uchun." },
    { id: ID3, type: 'multiple-choice', instruction: "Reja (going to) va kelishuv (Present Continuous):", question: "I _____ start a new course next month. We _____ dinner with friends on Friday.", options: ["am going to / are having", "will / will have", "am having / am going to", "are going to / will have"], correct: "am going to / are having", explanation: "Niyat/reja → am going to start. Aniq kelishilgan tadbir → are having dinner." },
    { id: ID4, type: 'transformation', instruction: "Dalilga asoslangan bashoratni 'going to' bilan yozing:", question: "Be careful! You / fall!", hint: "You ...", correct: "You are going to fall!", explanation: "Hozirgi dalil asosida darhol sodir bo'ladigan bashorat → are going to fall." },`,
  },
  {
    id: 'modalsObligation', name: 'Modals of Obligation',
    section: "Obligation (must/have to) + Speculation (must = taxmin) farqi",
    exercises: `    // ── Interleaved Practice: Obligation + Speculation/Advice ──
    { id: ID0, type: 'multiple-choice', instruction: "Must (majburiyat) va must (taxmin):", question: "You _____ wear a helmet — it's the law. He's not answering; he _____ be asleep.", options: ["must / must", "have to / might", "must / should", "should / must"], correct: "must / must", explanation: "Birinchi must = majburiyat (qonun). Ikkinchi must = ishonchli taxmin. Bir so'z, ikki ma'no." },
    { id: ID1, type: 'fill-blank', instruction: "Mustn't (taqiq) va don't have to (majburiy emas):", question: "You _____ smoke here (it is forbidden), but you _____ wear a tie (it is optional).", blanks: ["mustn't", "don't have to"], explanation: "Taqiq → mustn't. Majburiy emas (ixtiyoriy) → don't have to. Ikkisi butunlay farq qiladi." },
    { id: ID2, type: 'error-correction', instruction: "Should (maslahat) vs must (majburiyat):", question: "You must drink more water if you want, it's just my advice.", errorPart: "must", correct: "You should drink more water if you want, it's just my advice.", explanation: "Maslahat → should. Must = kuchli majburiyat, maslahat uchun emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Have to (tashqi majburiyat) va must (ichki/shaxsiy):", question: "I _____ wear a uniform at work (company rule). I really _____ call my mother — I miss her.", options: ["have to / must", "must / have to", "should / must", "have to / should"], correct: "have to / must", explanation: "Tashqi qoidalar → have to. Ichki, shaxsiy his → must." },
    { id: ID4, type: 'transformation', instruction: "Past majburiyatni 'had to' bilan yozing:", question: "It was necessary for me to work late yesterday.", hint: "I ...", correct: "I had to work late yesterday.", explanation: "O'tmishdagi majburiyat → had to (must'ning o'tgan shakli)." },`,
  },
  {
    id: 'bothEitherNeither', name: 'Both / Either / Neither',
    section: "Both/either/neither + Quantifiers (all/none/every) farqi",
    exercises: `    // ── Interleaved Practice: Both/Either/Neither + Quantifiers ──
    { id: ID0, type: 'multiple-choice', instruction: "Neither (ikkitadan hech qaysi) va none (uchdan ko'pdan hech qaysi):", question: "I have two pens, but _____ of them works. There are six chairs, but _____ of them is free.", options: ["neither / none", "none / neither", "either / none", "neither / either"], correct: "neither / none", explanation: "Ikkita → neither of them. Ikkidan ko'p (olti) → none of them." },
    { id: ID1, type: 'fill-blank', instruction: "Both (ikkalasi) va all (hammasi):", question: "_____ of my two brothers are tall. _____ of the students passed the exam (all of them).", blanks: ["Both", "All"], explanation: "Ikkalasi → Both. Hammasi (ko'plik) → All." },
    { id: ID2, type: 'error-correction', instruction: "Either fe'l mosligi:", question: "Either of the answers are correct.", errorPart: "are", correct: "Either of the answers is correct.", explanation: "Either + birlik fe'l → is correct (each one). 'Are' noto'g'ri." },
    { id: ID3, type: 'multiple-choice', instruction: "Neither...nor va either...or:", question: "_____ Tom _____ Sam came (both absent). You can have _____ tea _____ coffee (one choice).", options: ["Neither / nor / either / or", "Either / or / neither / nor", "Neither / or / either / nor", "Both / and / either / or"], correct: "Neither / nor / either / or", explanation: "Ikkalasi ham yo'q → neither...nor. Ikkidan biri → either...or." },
    { id: ID4, type: 'transformation', instruction: "'Not...and not' ni neither...nor bilan qisqartiring:", question: "She doesn't eat meat and she doesn't eat fish.", hint: "She eats ...", correct: "She eats neither meat nor fish.", explanation: "Ikki inkorni birlashtirish → neither meat nor fish." },`,
  },
  {
    id: 'timeClauses', name: 'Time Clauses',
    section: "Time clauses + Tenses (present/future) farqi",
    exercises: `    // ── Interleaved Practice: Time Clauses + Present/Future ──
    { id: ID0, type: 'multiple-choice', instruction: "Time clause'da kelasi zamon ishlatilmaydi:", question: "I will call you when I _____ home. As soon as the rain _____, we will go out.", options: ["get / stops", "will get / will stop", "get / will stop", "will get / stops"], correct: "get / stops", explanation: "When/as soon as'dan keyin Present Simple (get, stops) — 'will' emas, garchi ma'no kelasi bo'lsa ham." },
    { id: ID1, type: 'fill-blank', instruction: "Until (gacha) + Present Simple:", question: "Wait here until I _____ back. I won't leave until the work _____ finished.", blanks: ["come", "is"], explanation: "Until'dan keyin Present Simple (come) / present passive (is finished) — kelasi ma'noда." },
    { id: ID2, type: 'error-correction', instruction: "While + davomli harakat:", question: "While I will cook dinner, you can set the table.", errorPart: "will cook", correct: "While I cook dinner, you can set the table.", explanation: "While'dan keyin kelasida ham Present Simple/Continuous — 'will' emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Before/after time clause + Past:", question: "After she _____ her homework, she went out. Before we _____, we locked the door.", options: ["had finished / left", "finished / had left", "will finish / leave", "finishes / leaves"], correct: "had finished / left", explanation: "Avval tugagan harakat → Past Perfect (had finished), keyin Past Simple (went/left)." },
    { id: ID4, type: 'transformation', instruction: "Ikki gapni 'as soon as' bilan birlashtiring (kelasi):", question: "The bus will arrive. Then we will get on it.", hint: "As soon as the bus ...", correct: "As soon as the bus arrives, we will get on it.", explanation: "As soon as + Present Simple (arrives), asosiy gap will + V1." },`,
  },
  {
    id: 'indirectQuestions', name: 'Indirect Questions',
    section: "Indirect questions + Reported speech / tags farqi",
    exercises: `    // ── Interleaved Practice: Indirect Questions + Reported Speech ──
    { id: ID0, type: 'multiple-choice', instruction: "Direct va indirect question tartibi:", question: "Direct: 'Where does she live?' Indirect: 'Do you know where she _____?' '_____ she live near here?' (direct)", options: ["lives / Does", "does live / Do", "lives / Is", "live / Does"], correct: "lives / Does", explanation: "Indirect: inversiya yo'q → where she lives. Direct: Does + subject + verb." },
    { id: ID1, type: 'fill-blank', instruction: "If/whether bilan indirect yes/no question:", question: "I wonder _____ the shop is open. Could you tell me _____ this bus goes to the centre.", blanks: ["if", "whether"], explanation: "Indirect yes/no question → if yoki whether bilan boshlanadi." },
    { id: ID2, type: 'error-correction', instruction: "Indirect question'da do/does olib tashlanadi:", question: "Can you tell me what time does the train leave?", errorPart: "does the train leave", correct: "Can you tell me what time the train leaves?", explanation: "Indirect: do/does yo'q, 's' qaytadi → what time the train leaves." },
    { id: ID3, type: 'multiple-choice', instruction: "Indirect question vs question tag:", question: "Do you know who _____ this? You don't know the answer, _____?", options: ["wrote / do you", "did write / don't you", "wrote / did you", "did wrote / do you"], correct: "wrote / do you", explanation: "Indirect → who wrote (inversiyasiz). Inkor gap → tasdiq tag (do you)." },
    { id: ID4, type: 'transformation', instruction: "Direct question'ni indirect (polite) qiling:", question: "How much does this cost?", hint: "Could you tell me how much ...", correct: "Could you tell me how much this costs?", explanation: "Indirect: inversiyasiz, 's' qaytadi → how much this costs." },`,
  },
  {
    id: 'soNeitherAuxiliaries', name: 'So / Neither + Auxiliaries',
    section: "So/Neither agreement + Tenses (auxiliary mosligi)",
    exercises: `    // ── Interleaved Practice: So/Neither + Auxiliary agreement ──
    { id: ID0, type: 'multiple-choice', instruction: "So (tasdiq rozilik) va neither (inkor rozilik):", question: "'I like tea.' '_____ I.' 'I can't swim.' '_____ I.'", options: ["So do / Neither can", "So am / Neither do", "Neither do / So can", "So do / So can"], correct: "So do / Neither can", explanation: "Tasdiqqa rozilik → So + auxiliary (do). Inkorga rozilik → Neither + auxiliary (can)." },
    { id: ID1, type: 'fill-blank', instruction: "Auxiliary zamonni mos qiladi:", question: "'I went to Paris.' 'So _____ I.' 'She has finished.' 'So _____ he.'", blanks: ["did", "has"], explanation: "Past Simple (went) → did. Present Perfect (has finished) → has. Auxiliary asl zamonga mos." },
    { id: ID2, type: 'error-correction', instruction: "So/neither dan keyin inversiya:", question: "'I am tired.' 'So I am.'", errorPart: "So I am", correct: "'I am tired.' 'So am I.'", explanation: "Rozilikda inversiya: So + auxiliary + subject → So am I. ('So I am' = boshqa ma'no)." },
    { id: ID3, type: 'multiple-choice', instruction: "Neither (inkor) — auxiliary tanlash:", question: "'I haven't seen it.' '_____ I.' 'They won't come.' '_____ we.'", options: ["Neither have / Neither will", "Neither did / Neither do", "So have / So will", "Neither has / Neither will"], correct: "Neither have / Neither will", explanation: "Present Perfect inkor (haven't) → Neither have. Future inkor (won't) → Neither will." },
    { id: ID4, type: 'transformation', instruction: "Roziligini 'So' bilan qisqa javob qiling:", question: "A: 'I would love to travel more.' B agrees (short answer).", hint: "So ...", correct: "So would I.", explanation: "Would + rozilik → So would I (auxiliary 'would' takrorlanadi)." },`,
  },
]

// nextBase'ni mavjud 95xxx ID'lardan avtomatik aniqlaymiz — takroriy ishlashda kolliziyasiz.
import { readdirSync } from 'fs'
function computeNextBase(): number {
  let max = 95000
  for (const f of readdirSync('src/data/daily')) {
    if (!f.endsWith('.ts')) continue
    const s = readFileSync(`src/data/daily/${f}`, 'utf-8')
    for (const m of s.matchAll(/id:\s*(95\d{3})/g)) max = Math.max(max, Number(m[1]))
  }
  // keyingi o'nlikdan boshlaymiz (har dars 10 ID bloki)
  return Math.floor(max / 10) * 10 + 10 + 1
}
let nextBase = computeNextBase()

function seed(path: string, lessons: Lesson[]) {
  let content = readFileSync(path, 'utf-8')
  for (const lesson of lessons) {
    const marker = `export const ${lesson.id}: DailyLesson`
    const idx = content.indexOf(marker)
    if (idx === -1) { console.log(`❌ ${lesson.id}: topilmadi`); continue }
    // FAQAT shu darsning o'z bloki (keyingi `export const` gacha) — lookahead overlap'siz
    const nextExport = content.indexOf('\nexport const ', idx + marker.length)
    const block = content.substring(idx, nextExport === -1 ? content.length : nextExport)
    if (block.includes('// ── Interleaved Practice:')) { console.log(`⏭️  ${lesson.id}: mavjud`); continue }

    const base = nextBase; nextBase += 10
    let exText = lesson.exercises
    for (let i = 0; i < 5; i++) exText = exText.split(`ID${i}`).join(String(base + i))
    const ids = [base, base + 1, base + 2, base + 3, base + 4]

    // 1) Mashqlarni exercises massivining yopuvchi `]` idan oldin
    const exEnd = block.indexOf('  ],\n  exerciseSections:')
    if (exEnd === -1) { console.log(`❌ ${lesson.id}: exercises massivi topilmadi`); continue }
    const exAt = idx + exEnd
    content = content.substring(0, exAt) + `\n\n${exText}\n` + content.substring(exAt)

    // 2) Aralash section'ni exerciseSections yopuvchi `]` idan oldin
    const nIdx = content.indexOf(marker)
    const b2 = content.substring(nIdx, nIdx + 60000)
    const secOpen = b2.indexOf('exerciseSections:')
    const secClose = b2.indexOf('\n  ],', secOpen)
    if (secClose === -1) { console.log(`❌ ${lesson.id}: section yopilishi topilmadi`); continue }
    const secAt = nIdx + secClose
    const sectionObj = `\n    { title: "🔀 Aralash", desc: "${lesson.section}", color: 'bg-fuchsia-500', icon: '🔄', ids: [${ids.join(', ')}] },`
    content = content.substring(0, secAt) + sectionObj + content.substring(secAt)

    console.log(`✅ ${lesson.name}: 5 mashq (${base}-${base + 4}) + Aralash`)
  }
  writeFileSync(path, content, 'utf-8')
  console.log(`📁 ${path}: tayyor`)
}

seed('src/data/daily/b1Part1.ts', B1)

const A2_P1: Lesson[] = [
  {
    id: 'modalVerbs', name: 'Modal Verbs',
    section: "Modal fe'llar + Present Simple (odat) farqi",
    exercises: `    // ── Interleaved Practice: Modals + Present Simple ──
    { id: ID0, type: 'multiple-choice', instruction: "Can (qobiliyat) va Present Simple (odat):", question: "She _____ swim very well, and she _____ every morning before work.", options: ["can / swims", "cans / swim", "can / swim", "can to / swims"], correct: "can / swims", explanation: "Qobiliyat → can + V1 (swim). Odat → Present Simple, 3-shaxs +s (swims)." },
    { id: ID1, type: 'fill-blank', instruction: "Must (majburiyat) va don't have to:", question: "You _____ wear a seatbelt in the car. You _____ pay — it is free.", blanks: ["must", "don't have to"], explanation: "Majburiyat → must. Majburiy emas → don't have to." },
    { id: ID2, type: 'error-correction', instruction: "Can + V1 (to'g'ri shakl):", question: "I can to play the guitar.", errorPart: "can to play", correct: "I can play the guitar.", explanation: "Modal + V1 (to'siz). 'Can to' noto'g'ri → can play." },
    { id: ID3, type: 'multiple-choice', instruction: "Might (ehtimol) va must (ishonchli taxmin):", question: "It _____ rain later (not sure). He isn't here; he _____ be ill (I'm sure).", options: ["might / must", "must / might", "can / must", "might / can"], correct: "might / must", explanation: "Ehtimol → might. Dalilli ishonchli taxmin → must be." },
    { id: ID4, type: 'transformation', instruction: "Qobiliyatni 'can' bilan ifodalang:", question: "She knows how to drive a car.", hint: "She ...", correct: "She can drive a car.", explanation: "Qobiliyat → can + V1 (can drive)." },`,
  },
  {
    id: 'articles', name: 'Articles',
    section: "Artikllar (a/an/the) + Countable/Uncountable farqi",
    exercises: `    // ── Interleaved Practice: Articles + Countable/Uncountable ──
    { id: ID0, type: 'multiple-choice', instruction: "A/an (birinchi marta) va the (aniq):", question: "I saw _____ cat in the garden. _____ cat was black.", options: ["a / The", "the / A", "an / The", "a / A"], correct: "a / The", explanation: "Birinchi eslatish → a cat. Endi aniq (o'sha) → The cat." },
    { id: ID1, type: 'fill-blank', instruction: "A va an (tovush qoidasi):", question: "She is _____ honest person and _____ university student.", blanks: ["an", "a"], explanation: "Tovush bo'yicha: honest [o] → an. University [yu] → a (undosh tovush)." },
    { id: ID2, type: 'error-correction', instruction: "Umumiy ma'noда the ishlatilmaydi (uncountable):", question: "The water is important for the health.", errorPart: "the health", correct: "The water is important for health.", explanation: "Umumiy tushuncha (health) → artiklsiz. Bu yerda 'the' kerak emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Zero article (umumiy ko'plik) va the:", question: "_____ dogs are loyal animals. _____ dogs in this house are big.", options: ["Zero / The", "The / Zero", "A / The", "The / A"], correct: "Zero / The", explanation: "Umumiy (barcha itlar) → artiklsiz. Aniq (bu uydagi) → The dogs." },
    { id: ID4, type: 'transformation', instruction: "To'g'ri artikl bilan to'ldiring (birinchi eslatish):", question: "I bought ___ apple and ___ orange.", hint: "...", correct: "I bought an apple and an orange.", explanation: "Tovush bilan boshlanadi (apple, orange) → an." },`,
  },
  {
    id: 'prepositions', name: 'Prepositions of Time and Place',
    section: "Predloglar (in/on/at) + Present Simple farqi",
    exercises: `    // ── Interleaved Practice: Prepositions + Present Simple ──
    { id: ID0, type: 'multiple-choice', instruction: "Vaqt predloglari (at/on/in):", question: "We have a meeting _____ Monday _____ 9 o'clock _____ the morning.", options: ["on / at / in", "at / on / in", "in / at / on", "on / in / at"], correct: "on / at / in", explanation: "Kun → on Monday. Soat → at 9. Qism → in the morning." },
    { id: ID1, type: 'fill-blank', instruction: "Joy predloglari (in/on/at):", question: "The keys are _____ the table. She lives _____ Tashkent _____ Navoi Street.", blanks: ["on", "in", "on"], explanation: "Sirt → on the table. Shahar → in Tashkent. Ko'cha → on Navoi Street." },
    { id: ID2, type: 'error-correction', instruction: "At + soat (in emas):", question: "The film starts in 8 o'clock.", errorPart: "in 8 o'clock", correct: "The film starts at 8 o'clock.", explanation: "Aniq soat → at 8 o'clock ('in' oy/yil uchun)." },
    { id: ID3, type: 'multiple-choice', instruction: "Present Simple + predlog (jadval):", question: "The train _____ at 7 and _____ in London at noon.", options: ["leaves / arrives", "leave / arrive", "is leaving / arrives", "leaves / arrive"], correct: "leaves / arrives", explanation: "Jadval → Present Simple 3-shaxs +s (leaves, arrives) + at/in." },
    { id: ID4, type: 'transformation', instruction: "To'g'ri predlog bilan yozing:", question: "My birthday is ___ June, ___ the 12th.", hint: "...", correct: "My birthday is in June, on the 12th.", explanation: "Oy → in June. Sana → on the 12th." },`,
  },
  {
    id: 'questionsLesson', name: 'Questions',
    section: "Savollar (wh/yes-no) + Present/Past farqi",
    exercises: `    // ── Interleaved Practice: Questions + Present/Past ──
    { id: ID0, type: 'multiple-choice', instruction: "Present va Past savol (do/does/did):", question: "_____ she live here now? _____ you call me yesterday?", options: ["Does / Did", "Do / Does", "Did / Do", "Does / Do"], correct: "Does / Did", explanation: "Present 3-shaxs → Does she live. Past → Did you call." },
    { id: ID1, type: 'fill-blank', instruction: "Savol so'zi (wh-) to'ldiring:", question: "_____ do you live? (place) _____ time does it start? (time)", blanks: ["Where", "What"], explanation: "Joy → Where. Vaqt → What time." },
    { id: ID2, type: 'error-correction', instruction: "Savolда so'z tartibi:", question: "Where you are going?", errorPart: "you are", correct: "Where are you going?", explanation: "Savol tartibi: wh- + auxiliary + subject → Where are you going?" },
    { id: ID3, type: 'multiple-choice', instruction: "Yes/no savol — to be va to do:", question: "_____ they happy? _____ they like coffee?", options: ["Are / Do", "Do / Are", "Are / Are", "Do / Do"], correct: "Are / Do", explanation: "Sifat (happy) → Are they. Fe'l (like) → Do they." },
    { id: ID4, type: 'transformation', instruction: "Gapni savolga aylantiring (Past):", question: "She went to the market.", hint: "Where ...", correct: "Where did she go?", explanation: "Past savol → did + subject + V1 (go), 'went' emas." },`,
  },
  {
    id: 'countableUncountable', name: 'Countable and Uncountable',
    section: "Sanaladigan/sanalmaydigan + Artikl/quantifier farqi",
    exercises: `    // ── Interleaved Practice: Countable/Uncountable + Quantifiers ──
    { id: ID0, type: 'multiple-choice', instruction: "Much (uncountable) va many (countable):", question: "How _____ water do we need? How _____ apples are there?", options: ["much / many", "many / much", "much / much", "many / many"], correct: "much / many", explanation: "Uncountable (water) → much. Countable (apples) → many." },
    { id: ID1, type: 'fill-blank', instruction: "Some (tasdiq) va any (inkor/savol):", question: "I need _____ sugar. There isn't _____ milk in the fridge.", blanks: ["some", "any"], explanation: "Tasdiq → some sugar. Inkor → not any milk." },
    { id: ID2, type: 'error-correction', instruction: "Uncountable bilan 'a' ishlatilmaydi:", question: "Can you give me an information?", errorPart: "an information", correct: "Can you give me some information?", explanation: "Information = uncountable → 'an' yo'q. → some information." },
    { id: ID3, type: 'multiple-choice', instruction: "A few (countable) va a little (uncountable):", question: "I have _____ friends here and _____ free time.", options: ["a few / a little", "a little / a few", "a few / a few", "a little / a little"], correct: "a few / a little", explanation: "Countable (friends) → a few. Uncountable (time) → a little." },
    { id: ID4, type: 'transformation', instruction: "Uncountable otni 'a piece of' bilan sanang:", question: "I want to give you advice (make it countable).", hint: "I want to give you a ...", correct: "I want to give you a piece of advice.", explanation: "Uncountable (advice) → a piece of advice bilan sanaladi." },`,
  },
]
seed('src/data/daily/a2Part1.ts', A2_P1)

const A2_P2: Lesson[] = [
  {
    id: 'adjectiveAdverb', name: 'Adjective vs Adverb',
    section: "Sifat/ravish + Comparative farqi",
    exercises: `    // ── Interleaved Practice: Adjective/Adverb + Comparatives ──
    { id: ID0, type: 'multiple-choice', instruction: "Sifat (be bilan) va ravish (fe'l bilan):", question: "She is a _____ driver. She drives very _____.", options: ["careful / carefully", "carefully / careful", "careful / careful", "carefully / carefully"], correct: "careful / carefully", explanation: "Ot oldida sifat → careful driver. Fe'lni tavsiflaydi → drives carefully (ravish)." },
    { id: ID1, type: 'fill-blank', instruction: "Good (sifat) va well (ravish):", question: "He is a _____ student and he speaks English _____.", blanks: ["good", "well"], explanation: "Ot → good student (sifat). Fe'l → speaks well (ravish, 'good'ning ravishi)." },
    { id: ID2, type: 'error-correction', instruction: "Fe'ldan keyin ravish:", question: "She sings beautiful.", errorPart: "beautiful", correct: "She sings beautifully.", explanation: "Fe'lni (sings) tavsiflaydi → ravish: beautifully." },
    { id: ID3, type: 'multiple-choice', instruction: "Comparative (sifat va ravish):", question: "My car is _____ than yours, and it runs _____.", options: ["faster / faster", "more fast / faster", "faster / more fast", "fast / fast"], correct: "faster / faster", explanation: "Qisqa sifat/ravish → +er (faster) ikkala holда." },
    { id: ID4, type: 'transformation', instruction: "Sifatni ravishga aylantiring:", question: "He is a quick worker.", hint: "He works ...", correct: "He works quickly.", explanation: "Sifat (quick) → ravish (quickly) fe'l bilan." },`,
  },
  {
    id: 'gerundsInfinitives', name: 'Gerunds and Infinitives',
    section: "Gerund/infinitiv + Like/want farqi",
    exercises: `    // ── Interleaved Practice: Gerunds/Infinitives + verb patterns ──
    { id: ID0, type: 'multiple-choice', instruction: "Enjoy + V-ing va want + to V:", question: "I enjoy _____ books, but I want _____ a new hobby.", options: ["reading / to start", "to read / starting", "reading / starting", "to read / to start"], correct: "reading / to start", explanation: "Enjoy + V-ing (reading). Want + to V (to start)." },
    { id: ID1, type: 'fill-blank', instruction: "Decide + to V va finish + V-ing:", question: "She decided _____ (study) medicine. He finished _____ (write) the report.", blanks: ["to study", "writing"], explanation: "Decide + to V. Finish + V-ing." },
    { id: ID2, type: 'error-correction', instruction: "Like + V-ing/to V (avoid + V-ing):", question: "I avoid to eat late at night.", errorPart: "to eat", correct: "I avoid eating late at night.", explanation: "Avoid + V-ing (eating), to V emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Preposition + V-ing:", question: "She is good at _____, and she is interested in _____ a language.", options: ["cooking / learning", "to cook / to learn", "cooking / to learn", "cook / learn"], correct: "cooking / learning", explanation: "Predlogdan keyin (at, in) → V-ing (cooking, learning)." },
    { id: ID4, type: 'transformation', instruction: "Want + to V shaklida yozing:", question: "Her plan is a trip to London. (use 'want')", hint: "She wants ...", correct: "She wants to travel to London.", explanation: "Want + to V (to travel)." },`,
  },
  {
    id: 'passiveVoice', name: 'Passive Voice',
    section: "Passive + Active/Tenses farqi",
    exercises: `    // ── Interleaved Practice: Passive + Active/Tenses ──
    { id: ID0, type: 'multiple-choice', instruction: "Active va passive farqi:", question: "Shakespeare _____ Hamlet. Hamlet _____ by Shakespeare.", options: ["wrote / was written", "was written / wrote", "writes / is written", "wrote / wrote"], correct: "wrote / was written", explanation: "Active: Shakespeare wrote. Passive: Hamlet was written by..." },
    { id: ID1, type: 'fill-blank', instruction: "Present va past passive:", question: "Rice _____ (grow) in Asia. This bridge _____ (build) in 1900.", blanks: ["is grown", "was built"], explanation: "Present passive → is grown. Past passive → was built." },
    { id: ID2, type: 'error-correction', instruction: "Passive V3 shakli:", question: "The window was break by the storm.", errorPart: "was break", correct: "The window was broken by the storm.", explanation: "Passive: be + V3 (broken), 'break' emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Qachon passive (agent muhim emas):", question: "My car _____ yesterday. Someone _____ it from the street.", options: ["was stolen / stole", "stole / was stolen", "is stolen / steals", "was stole / stolen"], correct: "was stolen / stole", explanation: "Kim qilgani noma'lum/muhim emas → passive (was stolen). Active: someone stole." },
    { id: ID4, type: 'transformation', instruction: "Active gapni passivega aylantiring:", question: "They clean the office every day.", hint: "The office ...", correct: "The office is cleaned every day.", explanation: "Present passive → is cleaned." },`,
  },
  {
    id: 'reportedSpeech', name: 'Reported Speech',
    section: "Reported speech + Tenses (backshift) farqi",
    exercises: `    // ── Interleaved Practice: Reported Speech + Tense backshift ──
    { id: ID0, type: 'multiple-choice', instruction: "Direct va reported (zamon orqaga):", question: "Direct: 'I am tired.' Reported: He said he _____ tired. Direct: 'I will come.' Reported: She said she _____ come.", options: ["was / would", "is / will", "was / will", "is / would"], correct: "was / would", explanation: "Reported'da zamon orqaga: am → was, will → would." },
    { id: ID1, type: 'fill-blank', instruction: "Reported question (if/that):", question: "She asked _____ I was free. He told me _____ he was busy.", blanks: ["if", "that"], explanation: "Reported yes/no question → if. Reported statement → that." },
    { id: ID2, type: 'error-correction', instruction: "Reported question — inversiya yo'q:", question: "He asked where was I.", errorPart: "where was I", correct: "He asked where I was.", explanation: "Reported question'da inversiya yo'q → where I was." },
    { id: ID3, type: 'multiple-choice', instruction: "Say va tell farqi:", question: "She _____ that she was happy. She _____ me that she was happy.", options: ["said / told", "told / said", "said / said", "told / told"], correct: "said / told", explanation: "Say + that (object yo'q). Tell + object (me) + that." },
    { id: ID4, type: 'transformation', instruction: "Direct gapni reported qiling:", question: "Tom said: 'I live in Tashkent.'", hint: "Tom said that he ...", correct: "Tom said that he lived in Tashkent.", explanation: "Present → past (live → lived), I → he." },`,
  },
  {
    id: 'firstConditional', name: 'First Conditional',
    section: "First conditional + Time clauses / future farqi",
    exercises: `    // ── Interleaved Practice: First Conditional + Future/Time clauses ──
    { id: ID0, type: 'multiple-choice', instruction: "If + present, will + V1:", question: "If it _____ tomorrow, we _____ at home.", options: ["rains / will stay", "will rain / stay", "rains / stay", "will rain / will stay"], correct: "rains / will stay", explanation: "First conditional: if + Present Simple (rains), asosiy gap will + V1 (will stay)." },
    { id: ID1, type: 'fill-blank', instruction: "When (time clause) va if (shart):", question: "I will call you when I _____ home. I will help if you _____ me.", blanks: ["get", "ask"], explanation: "When/if dan keyin Present Simple (get, ask) — 'will' emas." },
    { id: ID2, type: 'error-correction', instruction: "If qismida 'will' ishlatilmaydi:", question: "If you will study hard, you will pass.", errorPart: "will study", correct: "If you study hard, you will pass.", explanation: "If qismida Present Simple (study). 'Will' faqat asosiy gapда." },
    { id: ID3, type: 'multiple-choice', instruction: "Unless (agar ...masa):", question: "You will be late _____ you hurry. _____ it stops raining, we will stay in.", options: ["unless / Unless", "if / If", "unless / If", "if / Unless"], correct: "unless / Unless", explanation: "Unless = if...not (agar shoshilmasangiz). Unless it stops = agar to'xtamasa." },
    { id: ID4, type: 'transformation', instruction: "Ikki gapni first conditional bilan birlashtiring:", question: "Maybe you will be tired. Then you should rest.", hint: "If you ...", correct: "If you are tired, you should rest.", explanation: "If + Present Simple (are tired), asosiy gap (should rest)." },`,
  },
]
seed('src/data/daily/a2Part2.ts', A2_P2)

const A2_P3: Lesson[] = [
  {
    id: 'verbPatterns', name: 'Verb Patterns',
    section: "Verb + object + to V + Gerund/infinitiv farqi",
    exercises: `    // ── Interleaved Practice: Verb Patterns + Gerund/Infinitive ──
    { id: ID0, type: 'multiple-choice', instruction: "Want + obj + to V va enjoy + V-ing:", question: "I want you _____ early. I enjoy _____ in the morning.", options: ["to come / running", "come / to run", "to come / to run", "coming / running"], correct: "to come / running", explanation: "Want + object + to V (you to come). Enjoy + V-ing (running)." },
    { id: ID1, type: 'fill-blank', instruction: "Tell/ask + obj + to V:", question: "She asked me _____ (help). The teacher told us _____ (be) quiet.", blanks: ["to help", "to be"], explanation: "Ask/tell + object + to V (to help, to be)." },
    { id: ID2, type: 'error-correction', instruction: "Make + obj + V1 (to'siz):", question: "The film made me to cry.", errorPart: "to cry", correct: "The film made me cry.", explanation: "Make + object + V1 (cry), 'to' siz." },
    { id: ID3, type: 'multiple-choice', instruction: "Let (to'siz) va allow (to bilan):", question: "My parents let me _____ out, and they allow me _____ late.", options: ["go / to stay", "to go / stay", "going / staying", "go / stay"], correct: "go / to stay", explanation: "Let + V1 (go). Allow + object + to V (to stay)." },
    { id: ID4, type: 'transformation', instruction: "Want bilan qayta yozing:", question: "I would like you to call me. (use 'want')", hint: "I want ...", correct: "I want you to call me.", explanation: "Want + object + to V (you to call)." },`,
  },
  {
    id: 'timePrepositions', name: 'Time Prepositions',
    section: "Vaqt predloglari + Present Simple farqi",
    exercises: `    // ── Interleaved Practice: Time Prepositions + Present Simple ──
    { id: ID0, type: 'multiple-choice', instruction: "At/on/in (vaqt):", question: "I wake up _____ 7 _____ weekdays, but I sleep late _____ summer.", options: ["at / on / in", "on / at / in", "in / on / at", "at / in / on"], correct: "at / on / in", explanation: "Soat → at 7. Kunlar → on weekdays. Fasl → in summer." },
    { id: ID1, type: 'fill-blank', instruction: "For (davomiylik) va since (boshlanish):", question: "I have lived here _____ five years, _____ 2019.", blanks: ["for", "since"], explanation: "Davr → for five years. Boshlanish nuqtasi → since 2019." },
    { id: ID2, type: 'error-correction', instruction: "On + sana:", question: "My birthday is in the 5th of May.", errorPart: "in the 5th", correct: "My birthday is on the 5th of May.", explanation: "Aniq sana → on the 5th." },
    { id: ID3, type: 'multiple-choice', instruction: "During (davomida) va while (...payt):", question: "I slept _____ the film. I fell asleep _____ I was watching.", options: ["during / while", "while / during", "during / during", "while / while"], correct: "during / while", explanation: "During + ot (the film). While + gap (I was watching)." },
    { id: ID4, type: 'transformation', instruction: "To'g'ri predlog bilan:", question: "The meeting is ___ Friday ___ 3 pm.", hint: "...", correct: "The meeting is on Friday at 3 pm.", explanation: "Kun → on Friday. Soat → at 3 pm." },`,
  },
  {
    id: 'thereIsThereAre', name: 'There is / There are',
    section: "There is/are + Countable/some/any farqi",
    exercises: `    // ── Interleaved Practice: There is/are + Countable/Quantifiers ──
    { id: ID0, type: 'multiple-choice', instruction: "There is (birlik/uncountable) va there are (ko'plik):", question: "_____ a book on the desk. _____ some pens too.", options: ["There is / There are", "There are / There is", "There is / There is", "There are / There are"], correct: "There is / There are", explanation: "Birlik (a book) → There is. Ko'plik (pens) → There are." },
    { id: ID1, type: 'fill-blank', instruction: "There isn't any / there aren't any:", question: "There _____ any milk. There _____ any eggs.", blanks: ["isn't", "aren't"], explanation: "Uncountable (milk) → isn't any. Ko'plik (eggs) → aren't any." },
    { id: ID2, type: 'error-correction', instruction: "Uncountable bilan there is:", question: "There are some water in the bottle.", errorPart: "There are", correct: "There is some water in the bottle.", explanation: "Water = uncountable → There is (singular)." },
    { id: ID3, type: 'multiple-choice', instruction: "How much/many + there:", question: "How _____ chairs are there? How _____ furniture is there?", options: ["many / much", "much / many", "many / many", "much / much"], correct: "many / much", explanation: "Countable (chairs) → many. Uncountable (furniture) → much." },
    { id: ID4, type: 'transformation', instruction: "There is/are bilan yozing:", question: "Two parks exist near my house.", hint: "There ...", correct: "There are two parks near my house.", explanation: "Ko'plik (two parks) → There are." },`,
  },
  {
    id: 'possessives', name: 'Possessives',
    section: "Egalik (mine/'s) + Olmoshlar farqi",
    exercises: `    // ── Interleaved Practice: Possessives + Pronouns ──
    { id: ID0, type: 'multiple-choice', instruction: "Possessive adjective (my) va pronoun (mine):", question: "This is _____ book. The book is _____.", options: ["my / mine", "mine / my", "my / my", "mine / mine"], correct: "my / mine", explanation: "Ot oldida → my book (adjective). Ot o'rniga → it's mine (pronoun)." },
    { id: ID1, type: 'fill-blank', instruction: "Possessive 's (egalik):", question: "This is _____ (Ali) car. These are the _____ (children) toys.", blanks: ["Ali's", "children's"], explanation: "Egalik → Ali's car, children's toys (apostrof + s)." },
    { id: ID2, type: 'error-correction', instruction: "Its (egalik) va it's (it is):", question: "The dog wagged it's tail.", errorPart: "it's", correct: "The dog wagged its tail.", explanation: "Egalik → its (apostrofsiz). It's = it is." },
    { id: ID3, type: 'multiple-choice', instruction: "Whose (kimning) va who's (who is):", question: "_____ bag is this? _____ coming to the party?", options: ["Whose / Who's", "Who's / Whose", "Whose / Whose", "Who's / Who's"], correct: "Whose / Who's", explanation: "Egalik savoli → Whose. Who is → Who's." },
    { id: ID4, type: 'transformation', instruction: "Of o'rniga 's ishlating:", question: "The car of my brother is new.", hint: "My ...", correct: "My brother's car is new.", explanation: "Egalik → brother's car ('s bilan)." },`,
  },
  {
    id: 'someAnyNoEvery', name: 'Some / Any / No / Every',
    section: "Some/any/no + Countable/much-many farqi",
    exercises: `    // ── Interleaved Practice: Some/Any/No + Countable ──
    { id: ID0, type: 'multiple-choice', instruction: "Some (tasdiq) va any (savol/inkor):", question: "I have _____ questions. Do you have _____ questions?", options: ["some / any", "any / some", "some / some", "any / any"], correct: "some / any", explanation: "Tasdiq → some. Savol → any." },
    { id: ID1, type: 'fill-blank', instruction: "No (= not any) va none:", question: "There is _____ sugar left. How many are left? _____.", blanks: ["no", "None"], explanation: "No + ot (no sugar). Otsiz javob → None." },
    { id: ID2, type: 'error-correction', instruction: "Something/anything:", question: "I don't have something to eat.", errorPart: "something", correct: "I don't have anything to eat.", explanation: "Inkorда → anything (something tasdiqда)." },
    { id: ID3, type: 'multiple-choice', instruction: "Everybody + birlik fe'l:", question: "Everybody _____ here. Somebody _____ at the door.", options: ["is / is", "are / are", "is / are", "are / is"], correct: "is / is", explanation: "Everybody/somebody → birlik fe'l (is)." },
    { id: ID4, type: 'transformation', instruction: "Inkor gapни 'any' bilan yozing:", question: "I have no money.", hint: "I don't ...", correct: "I don't have any money.", explanation: "No → not any (don't have any money)." },`,
  },
]
seed('src/data/daily/a2Part3.ts', A2_P3)

const A2_P4: Lesson[] = [
  {
    id: 'presentContinuousFuture', name: 'Present Continuous for Future',
    section: "PC kelajak (arrangement) + Will/Going to farqi",
    exercises: `    // ── Interleaved Practice: PC Future + Will/Going to ──
    { id: ID0, type: 'multiple-choice', instruction: "Arrangement (PC) va prediction (will):", question: "I _____ my friend at 6 (arranged). I think it _____ a good evening.", options: ["am meeting / will be", "will meet / is being", "meet / will be", "am meeting / is"], correct: "am meeting / will be", explanation: "Kelishilgan uchrashuv → am meeting. Bashorat → will be." },
    { id: ID1, type: 'fill-blank', instruction: "PC (reja) va going to (niyat):", question: "We _____ (fly) to Dubai on Monday (booked). I _____ (start) a diet soon.", blanks: ["are flying", "am going to start"], explanation: "Band qilingan reja → are flying (PC). Niyat → am going to start." },
    { id: ID2, type: 'error-correction', instruction: "Kelishilgan reja — PC, will emas:", question: "I will meet the doctor at 3 tomorrow, it's arranged.", errorPart: "will meet", correct: "I am meeting the doctor at 3 tomorrow, it's arranged.", explanation: "Aniq kelishilgan → Present Continuous (am meeting)." },
    { id: ID3, type: 'multiple-choice', instruction: "Timetable (PS) va arrangement (PC):", question: "The plane _____ at 9 (schedule). We _____ at 7 to be early (plan).", options: ["leaves / are arriving", "is leaving / arrive", "leave / are arriving", "leaves / arrive"], correct: "leaves / are arriving", explanation: "Jadval → leaves (PS). Kelishilgan reja → are arriving (PC)." },
    { id: ID4, type: 'transformation', instruction: "Kelishilgan rejani PC bilan yozing:", question: "My plan is to visit grandma on Sunday. (arranged)", hint: "I ...", correct: "I am visiting grandma on Sunday.", explanation: "Aniq reja → Present Continuous (am visiting)." },`,
  },
  {
    id: 'quantifiers', name: 'Quantifiers',
    section: "Quantifiers (much/many/few) + Countable farqi",
    exercises: `    // ── Interleaved Practice: Quantifiers + Countable/Uncountable ──
    { id: ID0, type: 'multiple-choice', instruction: "Few (countable) va little (uncountable):", question: "I have _____ friends but very _____ free time.", options: ["few / little", "little / few", "few / few", "little / little"], correct: "few / little", explanation: "Countable (friends) → few. Uncountable (time) → little." },
    { id: ID1, type: 'fill-blank', instruction: "A lot of (ikkalasi) va much/many:", question: "There is _____ of water and there are _____ of people.", blanks: ["a lot", "a lot"], explanation: "A lot of — countable va uncountable bilan ishlaydi (a lot of water, a lot of people)." },
    { id: ID2, type: 'error-correction', instruction: "Many + countable:", question: "I don't have much books.", errorPart: "much books", correct: "I don't have many books.", explanation: "Books = countable → many (much uncountable uchun)." },
    { id: ID3, type: 'multiple-choice', instruction: "Too much / too many:", question: "There is _____ noise and _____ cars in the city.", options: ["too much / too many", "too many / too much", "too much / too much", "too many / too many"], correct: "too much / too many", explanation: "Uncountable (noise) → too much. Countable (cars) → too many." },
    { id: ID4, type: 'transformation', instruction: "Enough bilan yozing:", question: "We don't have a sufficient number of chairs.", hint: "We don't have ...", correct: "We don't have enough chairs.", explanation: "Yetarli emas → enough chairs." },`,
  },
  {
    id: 'tooEnough', name: 'Too and Enough',
    section: "Too/enough + Comparative/sifat farqi",
    exercises: `    // ── Interleaved Practice: Too/Enough + Adjectives ──
    { id: ID0, type: 'multiple-choice', instruction: "Too (ortiqcha) va enough (yetarli):", question: "This coffee is _____ hot to drink. It isn't cool _____.", options: ["too / enough", "enough / too", "too / too", "enough / enough"], correct: "too / enough", explanation: "Ortiqcha → too hot. Yetarli emas → not cool enough." },
    { id: ID1, type: 'fill-blank', instruction: "Enough + ot va sifat + enough:", question: "He is old _____ to drive. We don't have _____ money.", blanks: ["enough", "enough"], explanation: "Sifatdan keyin → old enough. Otdan oldin → enough money." },
    { id: ID2, type: 'error-correction', instruction: "Enough sifatdan keyin keladi:", question: "She isn't enough tall for the team.", errorPart: "enough tall", correct: "She isn't tall enough for the team.", explanation: "Sifat + enough (tall enough), enough + sifat emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Too + sifat va comparative:", question: "This box is _____ heavy. Can you find a _____ one?", options: ["too / lighter", "enough / light", "too / light", "enough / lighter"], correct: "too / lighter", explanation: "Ortiqcha → too heavy. Solishtirish → lighter one." },
    { id: ID4, type: 'transformation', instruction: "Too ... shaklida yozing:", question: "The bag is so heavy that I can't lift it.", hint: "The bag is ...", correct: "The bag is too heavy to lift.", explanation: "So...that → too + adjective + to V (too heavy to lift)." },`,
  },
  {
    id: 'soSuch', name: 'So and Such',
    section: "So/such + Sifat/comparative farqi",
    exercises: `    // ── Interleaved Practice: So/Such + Adjectives ──
    { id: ID0, type: 'multiple-choice', instruction: "So (+ sifat) va such (+ ot):", question: "The film was _____ good. It was _____ a good film.", options: ["so / such", "such / so", "so / so", "such / such"], correct: "so / such", explanation: "So + sifat (so good). Such + (a) + ot (such a good film)." },
    { id: ID1, type: 'fill-blank', instruction: "So + sifat ... that:", question: "It was _____ cold _____ we stayed home.", blanks: ["so", "that"], explanation: "So + adjective + that (natija): so cold that we stayed." },
    { id: ID2, type: 'error-correction', instruction: "Such + ot iborasi:", question: "It was so a beautiful day.", errorPart: "so a beautiful day", correct: "It was such a beautiful day.", explanation: "Ot iborasi (a beautiful day) → such, so emas." },
    { id: ID3, type: 'multiple-choice', instruction: "So many / so much:", question: "There were _____ people and _____ noise.", options: ["so many / so much", "so much / so many", "such many / such much", "so many / so many"], correct: "so many / so much", explanation: "Countable (people) → so many. Uncountable (noise) → so much." },
    { id: ID4, type: 'transformation', instruction: "Such ... that bilan yozing:", question: "The book was very interesting, so I finished it in a day.", hint: "It was such ...", correct: "It was such an interesting book that I finished it in a day.", explanation: "Such + a/an + adjective + noun + that (natija)." },`,
  },
  {
    id: 'a2Review2', name: 'A2 Review',
    section: "A2 mavzularini aralash takrorlash",
    exercises: `    // ── Interleaved Practice: A2 mixed review ──
    { id: ID0, type: 'multiple-choice', instruction: "Used to va passive:", question: "This castle _____ 500 years ago. People _____ live in it.", options: ["was built / used to", "built / used to", "was built / use to", "is built / used to"], correct: "was built / used to", explanation: "Past passive → was built. O'tgan odat → used to live." },
    { id: ID1, type: 'fill-blank', instruction: "First conditional va comparative:", question: "If you study harder, you _____ get _____ marks (good).", blanks: ["will", "better"], explanation: "First conditional → will get. Comparative → better marks." },
    { id: ID2, type: 'error-correction', instruction: "Present perfect va for/since:", question: "I have lived here since five years.", errorPart: "since five years", correct: "I have lived here for five years.", explanation: "Davr (five years) → for, since boshlanish nuqtasi uchun." },
    { id: ID3, type: 'multiple-choice', instruction: "Reported speech va modal:", question: "She said she _____ swim. He told me he _____ come tomorrow.", options: ["could / would", "can / will", "could / will", "can / would"], correct: "could / would", explanation: "Reported: can → could, will → would." },
    { id: ID4, type: 'transformation', instruction: "Passivega aylantiring:", question: "Someone stole my bike yesterday.", hint: "My bike ...", correct: "My bike was stolen yesterday.", explanation: "Past passive → was stolen (agent muhim emas)." },`,
  },
]
seed('src/data/daily/a2Part4.ts', A2_P4)

const B2_P1: Lesson[] = [
  {
    id: 'unrealPastB2', name: 'Unreal Past',
    section: "Unreal past (wish/if only) + Conditionals farqi",
    exercises: `    // ── Interleaved Practice: Unreal Past + Conditionals ──
    { id: ID0, type: 'multiple-choice', instruction: "Wish (hozir) va wish (o'tmish):", question: "I wish I _____ richer now. I wish I _____ the chance last year.", options: ["were / had taken", "was / took", "am / had taken", "were / took"], correct: "were / had taken", explanation: "Hozirgi orzu → wish + Past (were). O'tmish afsus → wish + Past Perfect (had taken)." },
    { id: ID1, type: 'fill-blank', instruction: "It's time + Past va would rather + Past:", question: "It's time we _____ (leave). I'd rather you _____ (not / smoke) here.", blanks: ["left", "didn't smoke"], explanation: "It's time + Past Simple (left). Would rather + Past Simple (didn't smoke) — boshqaning harakati." },
    { id: ID2, type: 'error-correction', instruction: "Wish + would (bezovta qiluvchi odat):", question: "I wish you will stop interrupting me.", errorPart: "will stop", correct: "I wish you would stop interrupting me.", explanation: "Boshqaning bezovta odati → wish + would (will emas)." },
    { id: ID3, type: 'multiple-choice', instruction: "Unreal past va second conditional:", question: "If only I _____ how! If I _____ how, I would help.", options: ["knew / knew", "know / know", "had known / knew", "knew / had known"], correct: "knew / knew", explanation: "Hozirgi real bo'lmagan holat → Past Simple (knew) ikkalasi." },
    { id: ID4, type: 'transformation', instruction: "Real holatni wish bilan (hozir):", question: "I don't have a car, and it's a problem.", hint: "I wish I ...", correct: "I wish I had a car.", explanation: "Hozirgi yetishmovchilik orzusi → wish + Past Simple (had)." },`,
  },
  {
    id: 'advancedConditionalsB2', name: 'Advanced Conditionals',
    section: "Mixed conditionals + inversion + Unreal past farqi",
    exercises: `    // ── Interleaved Practice: Advanced Conditionals + Unreal Past ──
    { id: ID0, type: 'multiple-choice', instruction: "Mixed conditional (o'tmish → hozir):", question: "If I _____ harder at school, I _____ a better job now.", options: ["had studied / would have", "studied / would have had", "had studied / would have had", "studied / would have"], correct: "had studied / would have", explanation: "O'tmish sharti (had studied) → hozirgi natija (would have) — mixed conditional." },
    { id: ID1, type: 'fill-blank', instruction: "Inversion (if olib tashlanadi):", question: "_____ I known earlier, I would have come. _____ it not for you, I'd be lost.", blanks: ["Had", "Were"], explanation: "If I had → Had I. If it were not → Were it not (inversiya, formal)." },
    { id: ID2, type: 'error-correction', instruction: "Third conditional shakli:", question: "If she would have called, I would have answered.", errorPart: "would have called", correct: "If she had called, I would have answered.", explanation: "If qismida 'would have' ishlatilmaydi → had called (Past Perfect)." },
    { id: ID3, type: 'multiple-choice', instruction: "Wish va third conditional:", question: "I wish you _____ me. If you _____ me, I would have helped.", options: ["had told / had told", "told / told", "had told / told", "would tell / told"], correct: "had told / had told", explanation: "Ikkalasi ham o'tmish real bo'lmagan → Past Perfect (had told)." },
    { id: ID4, type: 'transformation', instruction: "Inversiya bilan yozing (if siz):", question: "If I had known, I would have stayed.", hint: "Had I ...", correct: "Had I known, I would have stayed.", explanation: "If I had → Had I (formal inversiya)." },`,
  },
  {
    id: 'nominalizationB2', name: 'Nominalization',
    section: "Nominalizatsiya + Passive (rasmiy uslub) farqi",
    exercises: `    // ── Interleaved Practice: Nominalization + Passive ──
    { id: ID0, type: 'multiple-choice', instruction: "Fe'l va nominalizatsiya (rasmiy):", question: "Informal: 'They decided to...' Formal: 'The _____ was made to...' (reduce → noun)", options: ["decision / reduction", "decide / reduce", "deciding / reducing", "decided / reduced"], correct: "decision / reduction", explanation: "Rasmiy uslub: decide → decision, reduce → reduction (nominalizatsiya)." },
    { id: ID1, type: 'fill-blank', instruction: "Nominalizatsiya + passive:", question: "The _____ (implement) of the policy _____ (delay) until next year.", blanks: ["implementation", "was delayed"], explanation: "Implement → implementation (noun). Passive → was delayed." },
    { id: ID2, type: 'error-correction', instruction: "Nominalizatsiya — ot shakli:", question: "The analyse of the data took weeks.", errorPart: "analyse", correct: "The analysis of the data took weeks.", explanation: "Fe'l 'analyse' → ot 'analysis'." },
    { id: ID3, type: 'multiple-choice', instruction: "Fe'l → ot (rasmiy):", question: "We must improve safety. → A _____ in safety is needed. We must protect it. → The _____ of it is vital.", options: ["improvement / protection", "improving / protecting", "improve / protect", "improved / protected"], correct: "improvement / protection", explanation: "Improve → improvement, protect → protection (nominalizatsiya)." },
    { id: ID4, type: 'transformation', instruction: "Gapni nominalizatsiya bilan rasmiy qiling:", question: "Prices increased, which worried people.", hint: "The increase ...", correct: "The increase in prices worried people.", explanation: "Increase (fe'l) → the increase (ot) — rasmiy, ixcham." },`,
  },
  {
    id: 'subjunctiveB2', name: 'Subjunctive Mood',
    section: "Subjunktiv + Modals farqi",
    exercises: `    // ── Interleaved Practice: Subjunctive + Modals ──
    { id: ID0, type: 'multiple-choice', instruction: "Subjunctive (recommend that ... be) va modal:", question: "I recommend that he _____ early. He _____ arrive early to get a seat.", options: ["arrive / should", "arrives / should", "arrive / arrives", "arrives / arrive"], correct: "arrive / should", explanation: "Subjunktiv: recommend that he arrive (base form). Maslahat → should arrive." },
    { id: ID1, type: 'fill-blank', instruction: "Insist/demand + that + V1:", question: "They insisted that she _____ (be) present. He demanded that it _____ (be) done now.", blanks: ["be", "be"], explanation: "Subjunktiv: insist/demand + that + base form (be) — barcha shaxslar." },
    { id: ID2, type: 'error-correction', instruction: "Subjunctive — base form:", question: "It is essential that everyone is on time.", errorPart: "is on time", correct: "It is essential that everyone be on time.", explanation: "It is essential that + base form (be), 'is' emas (subjunktiv)." },
    { id: ID3, type: 'multiple-choice', instruction: "Suggest + that va should:", question: "I suggest that we _____ the budget. You _____ check it twice.", options: ["review / should", "reviews / should", "review / reviews", "should review / review"], correct: "review / should", explanation: "Subjunktiv: suggest that we review (base). Maslahat → should check." },
    { id: ID4, type: 'transformation', instruction: "Subjunktiv bilan rasmiy yozing:", question: "The manager said the report must be finished by Friday. (use 'demanded that')", hint: "The manager demanded that ...", correct: "The manager demanded that the report be finished by Friday.", explanation: "Demand + that + base form (be finished)." },`,
  },
  {
    id: 'hedgingB2', name: 'Hedging',
    section: "Hedging (ehtiyotkor til) + Stance/modal farqi",
    exercises: `    // ── Interleaved Practice: Hedging + Stance ──
    { id: ID0, type: 'multiple-choice', instruction: "Hedging (ehtiyotkor) va aniq bayonot:", question: "Strong: 'This proves it.' Hedged: 'This _____ to suggest...' / 'It _____ be the case.'", options: ["seems / may", "proves / must", "shows / will", "is / does"], correct: "seems / may", explanation: "Ehtiyotkor til → seems to suggest, may be the case (kuchsizroq da'vo)." },
    { id: ID1, type: 'fill-blank', instruction: "Tends to / appears:", question: "The data _____ (tend) to support this. It _____ (appear) that more research is needed.", blanks: ["tends", "appears"], explanation: "Hedging fe'llari: tends to, appears that — ehtiyotkor xulosa." },
    { id: ID2, type: 'error-correction', instruction: "Hedging — kuchli da'voni yumshatish:", question: "This definitely causes the problem in all cases.", errorPart: "definitely causes the problem in all cases", correct: "This may contribute to the problem in some cases.", explanation: "Akademik hedging: definitely/all → may/some (ehtiyotkor)." },
    { id: ID3, type: 'multiple-choice', instruction: "It could be argued / arguably:", question: "_____ that prices will rise. This is _____ the best approach.", options: ["It could be argued / arguably", "It proves / definitely", "It shows / certainly", "It is / clearly"], correct: "It could be argued / arguably", explanation: "Hedging: it could be argued, arguably — fikrni ehtiyotkor bildiradi." },
    { id: ID4, type: 'transformation', instruction: "Bayonotni hedge qiling (yumshating):", question: "Coffee improves memory.", hint: "Coffee may ...", correct: "Coffee may improve memory.", explanation: "May + V1 → ehtiyotkor, hedged da'vo." },`,
  },
  {
    id: 'complexPrepositionsB2', name: 'Complex Prepositions',
    section: "Murakkab predloglar + Linking words farqi",
    exercises: `    // ── Interleaved Practice: Complex Prepositions + Linking ──
    { id: ID0, type: 'multiple-choice', instruction: "Due to (+ ot) va because (+ gap):", question: "The delay was _____ heavy rain. We were late _____ it rained.", options: ["due to / because", "because / due to", "due to / due to", "because / because"], correct: "due to / because", explanation: "Due to + ot (heavy rain). Because + gap (it rained)." },
    { id: ID1, type: 'fill-blank', instruction: "In terms of / with regard to:", question: "_____ regard _____ the budget, we have concerns. _____ terms _____ cost, it's high.", blanks: ["With", "to"], explanation: "With regard to / in terms of — rasmiy predlogli iboralar." },
    { id: ID2, type: 'error-correction', instruction: "Despite (+ ot) vs although (+ gap):", question: "Despite it was raining, we went out.", errorPart: "Despite it was raining", correct: "Despite the rain, we went out.", explanation: "Despite + ot (the rain). Gap uchun → although it was raining." },
    { id: ID3, type: 'multiple-choice', instruction: "On behalf of / in addition to:", question: "_____ behalf of the team, I thank you. _____ addition to that, we need staff.", options: ["On / In", "In / On", "On / On", "In / In"], correct: "On / In", explanation: "On behalf of (nomidan). In addition to (bundan tashqari)." },
    { id: ID4, type: 'transformation', instruction: "Because o'rniga 'due to' (ot bilan):", question: "The flight was cancelled because the weather was bad.", hint: "The flight was cancelled due to ...", correct: "The flight was cancelled due to bad weather.", explanation: "Due to + ot ibora (bad weather)." },`,
  },
  {
    id: 'cohesionB2', name: 'Cohesion',
    section: "Kogeziya (this/such/former) + Reference farqi",
    exercises: `    // ── Interleaved Practice: Cohesion + Reference ──
    { id: ID0, type: 'multiple-choice', instruction: "The former va the latter:", question: "Tea and coffee are popular. _____ is calming; _____ gives energy.", options: ["The former / the latter", "The latter / the former", "The first / the second", "This / that"], correct: "The former / the latter", explanation: "Birinchisi (tea) → the former. Ikkinchisi (coffee) → the latter." },
    { id: ID1, type: 'fill-blank', instruction: "Such + bog'lash:", question: "Prices rose sharply. _____ a change affected everyone. _____ is why we acted.", blanks: ["Such", "This"], explanation: "Such a change (oldingi fikrga ishora). This is why (sabab bog'lash)." },
    { id: ID2, type: 'error-correction', instruction: "Reference — 'it' vs 'this':", question: "Sales fell. It is because the economy slowed and prices rose.", errorPart: "It is because", correct: "This was because the economy slowed and prices rose.", explanation: "Oldingi butun fikrga ishora → This (kuchliroq kogeziya)." },
    { id: ID3, type: 'multiple-choice', instruction: "Consequently / moreover (bog'lash):", question: "Costs rose. _____, profits fell. _____, staff left — a second problem.", options: ["Consequently / Moreover", "Moreover / Consequently", "However / Therefore", "Although / Despite"], correct: "Consequently / Moreover", explanation: "Natija → Consequently. Qo'shimcha → Moreover." },
    { id: ID4, type: 'transformation', instruction: "Ikki gapni 'which' bilan bog'lang:", question: "The project failed. This surprised everyone.", hint: "The project failed, which ...", correct: "The project failed, which surprised everyone.", explanation: "Butun fikrga ishora → , which (kogeziya)." },`,
  },
  {
    id: 'registerB2', name: 'Register',
    section: "Register (rasmiy/norasmiy) + Reported speech farqi",
    exercises: `    // ── Interleaved Practice: Register + Reported Speech ──
    { id: ID0, type: 'multiple-choice', instruction: "Norasmiy va rasmiy:", question: "Informal: 'I wanna know...' Formal: 'I would like _____ know...' Informal: 'kids' Formal: '_____'", options: ["to / children", "to / kids", "knowing / children", "for / children"], correct: "to / children", explanation: "Rasmiy: would like to know, children (kids emas)." },
    { id: ID1, type: 'fill-blank', instruction: "Rasmiy phrasal o'rniga lotin fe'l:", question: "Informal: 'find out'. Formal: '_____' (discover). Informal: 'put off'. Formal: '_____' (postpone).", blanks: ["discover", "postpone"], explanation: "Rasmiy uslubda lotin fe'llar: discover, postpone (phrasal o'rniga)." },
    { id: ID2, type: 'error-correction', instruction: "Rasmiy xatda qisqartma yo'q:", question: "I'm writing to inform you that we can't proceed.", errorPart: "I'm writing", correct: "I am writing to inform you that we cannot proceed.", explanation: "Rasmiy register: qisqartmasiz (I am, cannot)." },
    { id: ID3, type: 'multiple-choice', instruction: "Reported speech + rasmiy:", question: "She said: 'I'll sort it out.' Formal report: She stated that she _____ _____ the matter.", options: ["would resolve", "will sort out", "would sort out", "will resolve"], correct: "would resolve", explanation: "Reported (will → would) + rasmiy (sort out → resolve)." },
    { id: ID4, type: 'transformation', instruction: "Norasmiy gapni rasmiy qiling:", question: "Can you help me out with this ASAP?", hint: "I would be grateful if ...", correct: "I would be grateful if you could assist me with this as soon as possible.", explanation: "Rasmiy register: would be grateful, assist, as soon as possible." },`,
  },
]
seed('src/data/daily/b2Part1.ts', B2_P1)

const B2_P2: Lesson[] = [
  {
    id: 'complexSentencesB2', name: 'Complex Sentences',
    section: "Murakkab gaplar + Relative/conjunction farqi",
    exercises: `    // ── Interleaved Practice: Complex Sentences + Relative Clauses ──
    { id: ID0, type: 'multiple-choice', instruction: "Subordinate clause (although) va relative (which):", question: "_____ it was late, we continued. The plan, _____ took months, finally worked.", options: ["Although / which", "Which / although", "Despite / which", "Although / that"], correct: "Although / which", explanation: "Ergash gap → Although. Non-defining relative → , which." },
    { id: ID1, type: 'fill-blank', instruction: "Participle clause + main clause:", question: "_____ (walk) home, I saw an accident. _____ (finish) the task, she left.", blanks: ["Walking", "Having finished"], explanation: "Bir vaqtda → Walking (present participle). Avval tugagan → Having finished (perfect participle)." },
    { id: ID2, type: 'error-correction', instruction: "Fragment (tugallanmagan gap):", question: "Because the weather was bad. We stayed home.", errorPart: "Because the weather was bad. We", correct: "Because the weather was bad, we stayed home.", explanation: "Ergash gap yakka turolmaydi → asosiy gap bilan birlashtiriladi (vergul bilan)." },
    { id: ID3, type: 'multiple-choice', instruction: "Whereas (qarama-qarshi) va while:", question: "He likes tea, _____ she prefers coffee. _____ I cooked, he cleaned.", options: ["whereas / While", "while / Whereas", "although / While", "whereas / Although"], correct: "whereas / While", explanation: "Qarama-qarshilik → whereas. Bir vaqtda → While." },
    { id: ID4, type: 'transformation', instruction: "Ikki gapni relative clause bilan birlashtiring:", question: "The book is on the table. I bought it yesterday.", hint: "The book that ...", correct: "The book that I bought yesterday is on the table.", explanation: "Defining relative → that I bought yesterday." },`,
  },
  {
    id: 'advancedModalsB2', name: 'Advanced Modals',
    section: "Murakkab modallar + Speculation farqi",
    exercises: `    // ── Interleaved Practice: Advanced Modals + Past Speculation ──
    { id: ID0, type: 'multiple-choice', instruction: "Needn't have (keraksiz) va didn't need to:", question: "You _____ worried — it was fine. I _____ go, so I stayed home.", options: ["needn't have / didn't need to", "didn't need to / needn't have", "mustn't have / needn't", "needn't / didn't need"], correct: "needn't have / didn't need to", explanation: "Keraksiz qilingan ish → needn't have. Kerak bo'lmagani uchun qilmadi → didn't need to." },
    { id: ID1, type: 'fill-blank', instruction: "Must have / can't have (o'tmish taxmin):", question: "The ground is wet; it _____ rained. She passed easily; it _____ been hard.", blanks: ["must have", "can't have"], explanation: "O'tmish ishonchli taxmin → must have rained. O'tmish imkonsiz → can't have been." },
    { id: ID2, type: 'error-correction', instruction: "Had better (kuchli maslahat):", question: "You had better to call him now.", errorPart: "had better to call", correct: "You had better call him now.", explanation: "Had better + V1 (to'siz): had better call." },
    { id: ID3, type: 'multiple-choice', instruction: "Should have (o'tmish afsus) va might have (ehtimol):", question: "I _____ studied more (regret). He's late; he _____ missed the bus (possible).", options: ["should have / might have", "might have / should have", "must have / should have", "should have / must have"], correct: "should have / might have", explanation: "O'tmish afsusi → should have studied. O'tmish ehtimoli → might have missed." },
    { id: ID4, type: 'transformation', instruction: "O'tmishdagi ishonchli taxminni yozing:", question: "I'm sure she finished it (it's done now).", hint: "She must ...", correct: "She must have finished it.", explanation: "O'tmish ishonchli taxmin → must have + V3 (finished)." },`,
  },
  {
    id: 'contrastiveStructuresB2', name: 'Contrastive Structures',
    section: "Qarama-qarshilik + Linking words farqi",
    exercises: `    // ── Interleaved Practice: Contrastive + Linking ──
    { id: ID0, type: 'multiple-choice', instruction: "Whereas/while (qarama-qarshi) va however:", question: "Cities are busy, _____ villages are calm. It rained; _____, we still went.", options: ["whereas / however", "however / whereas", "while / although", "whereas / although"], correct: "whereas / however", explanation: "Ikki holatni qarama-qarshi qo'yish → whereas. Gaplararo qarshilik → however." },
    { id: ID1, type: 'fill-blank', instruction: "In contrast / on the other hand:", question: "Tea calms you. _____ contrast, coffee energizes. On the other _____, it can disturb sleep.", blanks: ["In", "hand"], explanation: "In contrast, on the other hand — qarama-qarshi bog'lovchilar." },
    { id: ID2, type: 'error-correction', instruction: "Despite + ot (although + gap):", question: "Despite of the rain, we went out.", errorPart: "Despite of the rain", correct: "Despite the rain, we went out.", explanation: "Despite + ot ('of' siz). 'Despite of' noto'g'ri." },
    { id: ID3, type: 'multiple-choice', instruction: "Unlike (+ ot) va although (+ gap):", question: "_____ his brother, he is shy. _____ he is shy, he spoke well.", options: ["Unlike / Although", "Although / Unlike", "Unlike / Despite", "Despite / Although"], correct: "Unlike / Although", explanation: "Unlike + ot (his brother). Although + gap (he is shy)." },
    { id: ID4, type: 'transformation', instruction: "Although'ni 'despite' bilan yozing:", question: "Although she was tired, she finished.", hint: "Despite ...", correct: "Despite being tired, she finished.", explanation: "Despite + V-ing/ot (being tired)." },`,
  },
  {
    id: 'punctuationB2', name: 'Punctuation',
    section: "Tinish belgilari + Gap tuzilishi farqi",
    exercises: `    // ── Interleaved Practice: Punctuation + Sentence Structure ──
    { id: ID0, type: 'multiple-choice', instruction: "Semicolon va comma:", question: "Two full clauses: 'It rained_ we stayed home.' Non-defining clause: 'My car_ which is old_ broke.'", options: ["; / , ,", ", / ; ;", "; / ; ;", ", / , ,"], correct: "; / , ,", explanation: "Ikki to'liq gap → nuqtali vergul (;). Non-defining clause → ikki vergul (, ,)." },
    { id: ID1, type: 'fill-blank', instruction: "Colon (ro'yxat oldidan):", question: "We need three things_ bread, milk, and eggs.", blanks: [":"], explanation: "Ro'yxat oldidan → ikki nuqta (:)." },
    { id: ID2, type: 'error-correction', instruction: "Apostrof — its vs it's:", question: "The company increased it's profits.", errorPart: "it's", correct: "The company increased its profits.", explanation: "Egalik → its (apostrofsiz). It's = it is." },
    { id: ID3, type: 'multiple-choice', instruction: "Defining (vergulsiz) va non-defining (vergulli):", question: "Defining: 'The man _____ called is here.' Non-defining: 'Tom_ who called_ is here.'", options: ["who (no comma) / , who ,", ", who , / who", "that , / who", "which / that"], correct: "who (no comma) / , who ,", explanation: "Defining (zarur) → vergulsiz. Non-defining (qo'shimcha) → vergullar bilan." },
    { id: ID4, type: 'transformation', instruction: "Comma splice'ni to'g'rilang (semicolon bilan):", question: "It was late, we went home.", hint: "It was late; ...", correct: "It was late; we went home.", explanation: "Ikki to'liq gapni vergul bog'lay olmaydi → nuqtali vergul (;)." },`,
  },
  {
    id: 'academicCollocationsB2', name: 'Academic Collocations',
    section: "Akademik kollokatsiyalar + Lug'at farqi",
    exercises: `    // ── Interleaved Practice: Academic Collocations + Vocabulary ──
    { id: ID0, type: 'multiple-choice', instruction: "Conduct research va draw a conclusion:", question: "Scientists _____ research and then _____ a conclusion.", options: ["conduct / draw", "do / make", "make / do", "take / give"], correct: "conduct / draw", explanation: "Akademik kollokatsiyalar: conduct research, draw a conclusion." },
    { id: ID1, type: 'fill-blank', instruction: "Provide evidence / cite sources:", question: "You must _____ evidence and _____ reliable sources.", blanks: ["provide", "cite"], explanation: "Provide evidence, cite sources — akademik kollokatsiyalar." },
    { id: ID2, type: 'error-correction', instruction: "Make/reach a decision:", question: "The committee did an important decision.", errorPart: "did an important decision", correct: "The committee made an important decision.", explanation: "Make a decision (do emas)." },
    { id: ID3, type: 'multiple-choice', instruction: "Akademik sifat + ot:", question: "There is a _____ difference and a _____ increase.", options: ["significant / substantial", "big / large", "much / many", "strong / hard"], correct: "significant / substantial", explanation: "Akademik: significant difference, substantial increase (big/large o'rniga)." },
    { id: ID4, type: 'transformation', instruction: "Oddiy so'zni akademik kollokatsiya bilan:", question: "The study shows a big change.", hint: "The study reveals a ...", correct: "The study reveals a significant change.", explanation: "Akademik: reveal + significant change." },`,
  },
  {
    id: 'criticalThinkingB2', name: 'Critical Thinking Language',
    section: "Tanqidiy fikrlash tili + Hedging farqi",
    exercises: `    // ── Interleaved Practice: Critical Thinking + Hedging ──
    { id: ID0, type: 'multiple-choice', instruction: "Assumption va bias:", question: "The author makes an _____ that all readers agree. That is a _____.", options: ["assumption / bias", "evidence / fact", "argument / proof", "analysis / source"], correct: "assumption / bias", explanation: "Tanqidiy tahlil: assumption (faraz), bias (noxolislik)." },
    { id: ID1, type: 'fill-blank', instruction: "Correlation vs causation:", question: "This shows _____ (a link), but it doesn't prove _____ (cause and effect).", blanks: ["correlation", "causation"], explanation: "Tanqidiy fikrlash: correlation ≠ causation." },
    { id: ID2, type: 'error-correction', instruction: "Hedging — kuchli da'voni baholash:", question: "This source is definitely reliable and proves everything.", errorPart: "definitely reliable and proves everything", correct: "This source appears reliable but does not prove everything.", explanation: "Tanqidiy/hedged: appears reliable, does not prove everything." },
    { id: ID3, type: 'multiple-choice', instruction: "Evaluate va question (fe'l):", question: "We should _____ the evidence and _____ the author's claims.", options: ["evaluate / question", "accept / believe", "ignore / trust", "copy / repeat"], correct: "evaluate / question", explanation: "Tanqidiy fikrlash: evaluate evidence, question claims." },
    { id: ID4, type: 'transformation', instruction: "Da'voni tanqidiy baholang:", question: "The article says coffee is good. (be critical/hedged)", hint: "The article claims coffee is good, but ...", correct: "The article claims coffee is good, but the evidence is limited.", explanation: "Tanqidiy: claims + but the evidence is limited (baholash)." },`,
  },
  {
    id: 'b2Review', name: 'B2 Review',
    section: "B2 mavzularini aralash takrorlash",
    exercises: `    // ── Interleaved Practice: B2 mixed review ──
    { id: ID0, type: 'multiple-choice', instruction: "Mixed conditional va inversion:", question: "_____ I known, I would act differently now. If I _____ harder, I'd be successful today.", options: ["Had / had worked", "If / worked", "Had / worked", "If / had worked"], correct: "Had / had worked", explanation: "Inversiya → Had I known. Mixed conditional → had worked (o'tmish) → now/today." },
    { id: ID1, type: 'fill-blank', instruction: "Subjunctive va nominalization:", question: "I recommend that the _____ (reduce) _____ (be) approved.", blanks: ["reduction", "be"], explanation: "Nominalization (reduce → reduction) + subjunctive (be approved)." },
    { id: ID2, type: 'error-correction', instruction: "Hedging va akademik uslub:", question: "This research definitely proves coffee improves all memory.", errorPart: "definitely proves coffee improves all memory", correct: "This research suggests coffee may improve memory.", explanation: "Akademik hedging: suggests, may improve (definitely/all/proves emas)." },
    { id: ID3, type: 'multiple-choice', instruction: "Advanced modal va contrast:", question: "You _____ have told me (regret). _____ I was busy, I would have helped.", options: ["should / Although", "must / Despite", "should / Despite", "might / Although"], correct: "should / Although", explanation: "O'tmish afsus → should have told. Qarshilik → Although." },
    { id: ID4, type: 'transformation', instruction: "Rasmiy, nominalizatsiya bilan yozing:", question: "Because prices increased, sales fell.", hint: "The increase ...", correct: "The increase in prices led to a fall in sales.", explanation: "Nominalization: increase, fall — rasmiy, ixcham uslub." },`,
  },
]
seed('src/data/daily/b2Part2.ts', B2_P2)

const B2_P3: Lesson[] = [
  {
    id: 'argumentStructureB2', name: 'Argument Structure',
    section: "Dalil tuzilishi + Cohesion farqi",
    exercises: `    // ── Interleaved Practice: Argument Structure + Cohesion ──
    { id: ID0, type: 'multiple-choice', instruction: "Claim va counterargument:", question: "My _____ is that remote work helps. However, one might _____ that it weakens teams.", options: ["claim / argue", "evidence / prove", "proof / show", "fact / state"], correct: "claim / argue", explanation: "Dalil tuzilishi: claim (asosiy fikr), one might argue (counterargument)." },
    { id: ID1, type: 'fill-blank', instruction: "Furthermore / therefore (bog'lash):", question: "Costs fell. _____ (additionally), quality rose. _____ (so), profits grew.", blanks: ["Furthermore", "Therefore"], explanation: "Qo'shimcha dalil → Furthermore. Natija → Therefore." },
    { id: ID2, type: 'error-correction', instruction: "Refute (qarshi dalilni rad etish):", question: "Some say it is risky. But this point is wrong because of evidence.", errorPart: "this point is wrong because of evidence", correct: "However, the evidence does not support this concern.", explanation: "Akademik refutation: the evidence does not support this concern." },
    { id: ID3, type: 'multiple-choice', instruction: "Granted / nevertheless (concession):", question: "_____, the cost is high. _____, the benefits outweigh it.", options: ["Granted / Nevertheless", "Therefore / Moreover", "Because / So", "However / Although"], correct: "Granted / Nevertheless", explanation: "Tan olish → Granted. Shunga qaramay → Nevertheless." },
    { id: ID4, type: 'transformation', instruction: "Xulosani 'thus' bilan bog'lang:", question: "The benefits are clear. So we should adopt the plan.", hint: "The benefits are clear; thus, ...", correct: "The benefits are clear; thus, we should adopt the plan.", explanation: "Rasmiy xulosa bog'lovchi → thus." },`,
  },
  {
    id: 'stanceMarkersB2', name: 'Stance Markers',
    section: "Pozitsiya belgilari + Hedging farqi",
    exercises: `    // ── Interleaved Practice: Stance Markers + Hedging ──
    { id: ID0, type: 'multiple-choice', instruction: "Frankly va arguably:", question: "_____, I found it dull. It is _____ the best book this year, though many disagree.", options: ["Frankly / arguably", "Arguably / frankly", "Clearly / surely", "Surely / clearly"], correct: "Frankly / arguably", explanation: "Ochig'i → Frankly. Bahsli da'vo → arguably." },
    { id: ID1, type: 'fill-blank', instruction: "Admittedly / undoubtedly:", question: "_____ (tan olish), the plot was weak. The acting was _____ (shubhasiz) excellent.", blanks: ["Admittedly", "undoubtedly"], explanation: "Tan olish → Admittedly. Shubhasiz → undoubtedly." },
    { id: ID2, type: 'error-correction', instruction: "Stance — kuchli da'voni yumshatish:", question: "Obviously everyone agrees this is true.", errorPart: "Obviously everyone agrees this is true", correct: "Arguably, many would agree with this.", explanation: "Ehtiyotkor stance: Arguably, many would agree (obviously/everyone emas)." },
    { id: ID3, type: 'multiple-choice', instruction: "In my view va it seems:", question: "_____ my view, prices will rise. _____ that more time is needed.", options: ["In / It seems", "On / It looks", "At / It feels", "By / It shows"], correct: "In / It seems", explanation: "Pozitsiya: In my view. Hedging → It seems that." },
    { id: ID4, type: 'transformation', instruction: "Fikrni stance marker bilan yumshating:", question: "This is the best solution.", hint: "Arguably, ...", correct: "Arguably, this is the best solution.", explanation: "Bahsli da'vo → Arguably (ehtiyotkor pozitsiya)." },`,
  },
  {
    id: 'paraphrasingB2', name: 'Paraphrasing and Summarising',
    section: "Boshqacha ifodalash + Akademik lug'at farqi",
    exercises: `    // ── Interleaved Practice: Paraphrasing + Academic Vocabulary ──
    { id: ID0, type: 'multiple-choice', instruction: "Paraphrase (sinonim):", question: "'The economy collapsed' → 'The economy _____.' 'numerous' → '_____'", options: ["fell sharply / many", "grew / few", "stayed / some", "rose / a lot"], correct: "fell sharply / many", explanation: "Paraphrase: collapsed → fell sharply, numerous → many/a large number." },
    { id: ID1, type: 'fill-blank', instruction: "In short / to sum up:", question: "_____ short, education reduces poverty. To _____ up, learning leads to jobs.", blanks: ["In", "sum"], explanation: "Xulosa iboralari: in short, to sum up." },
    { id: ID2, type: 'error-correction', instruction: "Paraphrase — bir xil so'zni takrorlamaslik:", question: "The important point is that this point is important.", errorPart: "this point is important", correct: "The key issue is that it carries great weight.", explanation: "Paraphrase: takrorni sinonim bilan almashtirish (key issue, carries great weight)." },
    { id: ID3, type: 'multiple-choice', instruction: "Rephrase (akademik sinonim):", question: "'show' → '_____'. 'big problem' → '_____ issue'.", options: ["demonstrate / major", "tell / small", "see / tiny", "do / little"], correct: "demonstrate / major", explanation: "Akademik paraphrase: show → demonstrate, big → major." },
    { id: ID4, type: 'transformation', instruction: "Gapni paraphrase qiling:", question: "Many people think the plan is very good.", hint: "Numerous individuals consider ...", correct: "Numerous individuals consider the plan highly effective.", explanation: "Paraphrase: many people → numerous individuals, very good → highly effective." },`,
  },
  {
    id: 'advancedVerbPatternsB2', name: 'Advanced Verb Patterns',
    section: "Murakkab fe'l patternlari + Gerund/infinitiv farqi",
    exercises: `    // ── Interleaved Practice: Advanced Verb Patterns + Gerund/Infinitive ──
    { id: ID0, type: 'multiple-choice', instruction: "Urge + obj + to V va avoid + V-ing:", question: "I urge you _____ early, and I'd avoid _____ to the last minute.", options: ["to apply / leaving", "applying / to leave", "to apply / to leave", "applying / leaving"], correct: "to apply / leaving", explanation: "Urge + object + to V (to apply). Avoid + V-ing (leaving)." },
    { id: ID1, type: 'fill-blank', instruction: "Look forward to + V-ing:", question: "I look forward _____ (hear) from you. She admitted _____ (make) a mistake.", blanks: ["to hearing", "making"], explanation: "Look forward to + V-ing (hearing). Admit + V-ing (making)." },
    { id: ID2, type: 'error-correction', instruction: "Recommend + V-ing (to'g'ri):", question: "I recommend to submit it early.", errorPart: "to submit", correct: "I recommend submitting it early.", explanation: "Recommend + V-ing (submitting), to V emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Remember + to V / + V-ing farqi:", question: "Remember _____ the door (duty). I remember _____ it last night (memory).", options: ["to lock / locking", "locking / to lock", "to lock / to lock", "locking / locking"], correct: "to lock / locking", explanation: "Remember + to V (kelajak vazifa). Remember + V-ing (o'tmish xotira)." },
    { id: ID4, type: 'transformation', instruction: "Suggest + V-ing bilan yozing:", question: "Her idea was that we should start tonight.", hint: "She suggested ...", correct: "She suggested starting tonight.", explanation: "Suggest + V-ing (starting)." },`,
  },
  {
    id: 'b2ComprehensiveReview', name: 'B2 Comprehensive Review',
    section: "B2 darajasini keng aralash takrorlash",
    exercises: `    // ── Interleaved Practice: B2 comprehensive review ──
    { id: ID0, type: 'multiple-choice', instruction: "Subjunctive, hedging, stance:", question: "I recommend that it _____ reviewed. _____, this is the strongest option (stance).", options: ["be / Arguably", "is / Obviously", "be / Surely", "is / Clearly"], correct: "be / Arguably", explanation: "Subjunctive (be reviewed) + ehtiyotkor stance (Arguably)." },
    { id: ID1, type: 'fill-blank', instruction: "Inversion va mixed conditional:", question: "_____ I known the risk, I wouldn't be here now. _____ it not for your help, I'd have failed.", blanks: ["Had", "Were"], explanation: "Had I known (inversiya, mixed). Were it not for (inversiya)." },
    { id: ID2, type: 'error-correction', instruction: "Akademik register va nominalization:", question: "Because they didn't plan, the project's failure happened.", errorPart: "Because they didn't plan, the project's failure happened", correct: "The lack of planning led to the project's failure.", explanation: "Nominalization + rasmiy: The lack of planning led to..." },
    { id: ID3, type: 'multiple-choice', instruction: "Advanced modal va critical language:", question: "The results _____ have been affected by bias; we should _____ the evidence carefully.", options: ["may / evaluate", "must / accept", "can / ignore", "will / trust"], correct: "may / evaluate", explanation: "O'tmish ehtimoli (may have) + tanqidiy (evaluate the evidence)." },
    { id: ID4, type: 'transformation', instruction: "Paraphrase + hedge bilan akademik qiling:", question: "Everyone knows this plan is the best.", hint: "It could be argued that ...", correct: "It could be argued that this plan is the most effective.", explanation: "Hedging + paraphrase: it could be argued, most effective." },`,
  },
]
seed('src/data/daily/b2Part3.ts', B2_P3)
