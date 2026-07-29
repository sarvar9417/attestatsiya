// ═══════════════════════════════════════════════════════════════════════════
// AI Talaffuz Murabbiysi — tovush-fokusli mashqlar.
// O'zbek tilida so'zlashuvchilar uchun eng qiyin inglizcha tovushlarga
// qaratilgan: th, w/v, qisqa/uzun unlilar, urg'u, -ed tugashi, jim harflar.
// ═══════════════════════════════════════════════════════════════════════════

export interface PronunciationPhrase {
  text:   string   // aytiladigan ibora
  ipa:    string   // IPA transkripsiya
  hintUz: string   // qisqa o'zbekcha maslahat
}

export interface PronunciationCategory {
  id:        string
  emoji:     string
  title:     string          // inglizcha fokus
  titleUz:   string          // o'zbekcha
  /** Bu kategoriya nima uchun o'zbeklar uchun qiyin */
  whyUz:     string
  phrases:   PronunciationPhrase[]
}

export const PRONUNCIATION_CATEGORIES: PronunciationCategory[] = [
  {
    id: 'th',
    emoji: '👅',
    title: 'The "th" sound /θ/ /ð/',
    titleUz: '"th" tovushi',
    whyUz: "O'zbek tilida 'th' yo'q — ko'pincha s/z/t/d bilan almashtiriladi. Tilni tishlar orasiga qo'ying.",
    phrases: [
      { text: 'I think this is the third one.', ipa: '/aɪ θɪŋk ðɪs ɪz ðə θɜːd wʌn/', hintUz: "think, third — tilni tishlar orasiga (nafas), this, the — ovozli." },
      { text: 'Thank you for the birthday gift.', ipa: '/θæŋk juː fɔːr ðə ˈbɜːθdeɪ ɡɪft/', hintUz: "Thank, birthday — jim 'th' (s emas!)." },
      { text: 'These three brothers are healthy.', ipa: '/ðiːz θriː ˈbrʌðərz ɑːr ˈhelθi/', hintUz: "These, brothers — ovozli th; three, healthy — nafasli th." },
      { text: 'The weather is better together.', ipa: '/ðə ˈweðər ɪz ˈbetər təˈɡeðər/', hintUz: "weather, together — ovozli th (z emas)." },
    ],
  },
  {
    id: 'w-v',
    emoji: '💋',
    title: '"w" vs "v"',
    titleUz: '"w" va "v" farqi',
    whyUz: "O'zbeklar ko'pincha 'w' ni 'v' deb aytadi. 'w' — lablar dumaloq (puflagandek), 'v' — pastki lab tishga tegadi.",
    phrases: [
      { text: 'We have a very wide window.', ipa: '/wiː hæv ə ˈveri waɪd ˈwɪndoʊ/', hintUz: "We, wide, window — lablar dumaloq; very, have — pastki lab tishga." },
      { text: 'The vet works every Wednesday.', ipa: '/ðə vet wɜːks ˈevri ˈwenzdeɪ/', hintUz: "vet, every — 'v'; works, Wednesday — 'w'." },
      { text: 'I want to visit the village.', ipa: '/aɪ wɒnt tuː ˈvɪzɪt ðə ˈvɪlɪdʒ/', hintUz: "want — 'w'; visit, village — 'v'." },
      { text: 'Where is the wine and water?', ipa: '/weər ɪz ðə waɪn ænd ˈwɔːtər/', hintUz: "Where, wine, water — hammasi 'w' (lablar dumaloq)." },
    ],
  },
  {
    id: 'vowels',
    emoji: '🎵',
    title: 'Short vs long vowels',
    titleUz: 'Qisqa va uzun unlilar',
    whyUz: "ship/sheep, full/fool farqi ma'noni o'zgartiradi. Uzun unlini cho'zib ayting.",
    phrases: [
      { text: 'The sheep is on the ship.', ipa: '/ðə ʃiːp ɪz ɒn ðə ʃɪp/', hintUz: "sheep — uzun /iː/ (cho'zing); ship — qisqa /ɪ/." },
      { text: 'I feel my foot is full.', ipa: '/aɪ fiːl maɪ fʊt ɪz fʊl/', hintUz: "feel — uzun /iː/; foot, full — qisqa /ʊ/." },
      { text: 'He sat on the seat.', ipa: '/hiː sæt ɒn ðə siːt/', hintUz: "sat — qisqa /æ/; seat — uzun /iː/." },
      { text: 'Pull the pool cover.', ipa: '/pʊl ðə puːl ˈkʌvər/', hintUz: "Pull — qisqa /ʊ/; pool — uzun /uː/." },
    ],
  },
  {
    id: 'ed-endings',
    emoji: '⏮️',
    title: 'Past tense "-ed" endings',
    titleUz: '"-ed" tugashlari',
    whyUz: "-ed uch xil aytiladi: /t/, /d/, /ɪd/. Hammasini 'id' deb aytmang!",
    phrases: [
      { text: 'I walked, talked and watched.', ipa: '/aɪ wɔːkt tɔːkt ænd wɒtʃt/', hintUz: "walked, talked, watched — jarangsizdan keyin /t/ (id emas)." },
      { text: 'She played and listened.', ipa: '/ʃiː pleɪd ænd ˈlɪsənd/', hintUz: "played, listened — jarangli/unlidan keyin /d/." },
      { text: 'We wanted and needed it.', ipa: '/wiː ˈwɒntɪd ænd ˈniːdɪd ɪt/', hintUz: "wanted, needed — t/d dan keyin /ɪd/ (faqat shu holatda 'id')." },
      { text: 'They started and decided.', ipa: '/ðeɪ ˈstɑːtɪd ænd dɪˈsaɪdɪd/', hintUz: "started, decided — t/d dan keyin /ɪd/." },
    ],
  },
  {
    id: 'word-stress',
    emoji: '🔊',
    title: 'Word stress',
    titleUz: "So'z urg'usi",
    whyUz: "Inglizchada urg'u muhim — noto'g'ri bo'g'inga urg'u tushsa, so'z tushunarsiz bo'ladi.",
    phrases: [
      { text: 'I took a photograph of a photographer.', ipa: '/ˈfoʊtəɡrɑːf … fəˈtɒɡrəfər/', hintUz: "PHOtograph — 1-bo'g'in; phoTOGrapher — 2-bo'g'in." },
      { text: 'The economy needs economic reform.', ipa: '/ɪˈkɒnəmi … ˌiːkəˈnɒmɪk/', hintUz: "eCOnomy — 2-bo'g'in; ecoNOMic — 3-bo'g'in." },
      { text: 'Please record the new record.', ipa: '/rɪˈkɔːd … ˈrekɔːd/', hintUz: "reCORD (fe'l) — 2-bo'g'in; REcord (ot) — 1-bo'g'in." },
      { text: 'I want to develop my development.', ipa: '/dɪˈveləp … dɪˈveləpmənt/', hintUz: "deVElop, deVElopment — 2-bo'g'inga urg'u." },
    ],
  },
  {
    id: 'silent-letters',
    emoji: '🤫',
    title: 'Silent letters',
    titleUz: 'Jim harflar',
    whyUz: "Ko'p inglizcha so'zlarda yozilgan, lekin aytilmaydigan harflar bor.",
    phrases: [
      { text: 'I know the answer, honestly.', ipa: '/aɪ noʊ ðə ˈɑːnsər ˈɒnɪstli/', hintUz: "know — 'k' jim; answer — 'w' jim; honestly — 'h' jim." },
      { text: 'The knight walked for an hour.', ipa: '/ðə naɪt wɔːkt fɔːr ən ˈaʊər/', hintUz: "knight — 'k' jim; hour — 'h' jim." },
      { text: 'Could you climb the castle?', ipa: '/kʊd juː klaɪm ðə ˈkɑːsəl/', hintUz: "Could — 'l' jim; climb — 'b' jim; castle — 't' jim." },
      { text: 'Listen, the island is calm.', ipa: '/ˈlɪsən ðə ˈaɪlənd ɪz kɑːm/', hintUz: "Listen — 't' jim; island — 's' jim; calm — 'l' jim." },
    ],
  },
]

export function getPronCategory(id: string): PronunciationCategory | undefined {
  return PRONUNCIATION_CATEGORIES.find(c => c.id === id)
}
