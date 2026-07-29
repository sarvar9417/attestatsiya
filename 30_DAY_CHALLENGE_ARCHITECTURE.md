# 🏗 30-Day Speaking Challenge — Arxitektura Diagrammasi

---

## 1. 📊 Umumiy Arxitektura

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BROWSER (React SPA)                             │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    App.tsx (Root Shell)                          │  │
│  │  ┌────────────┐  ┌───────────────────┐  ┌──────────────────┐    │  │
│  │  │  Sidebar   │  │   <Routes>        │  │  MobileBottomNav │    │  │
│  │  │            │  │   /30-day-challenge│  │                  │    │  │
│  │  └────────────┘  └───────┬───────────┘  └──────────────────┘    │  │
│  └──────────────────────────┼──────────────────────────────────────┘  │
│                             │                                          │
│  ┌──────────────────────────▼──────────────────────────────────────┐  │
│  │              ThirtyDayChallenge.tsx (Sahifa)                     │  │
│  │                                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │  useState ↔ useProgress (Agar xohlasa)                  │    │  │
│  │  │  currentDay, completedDays, xpEarned                     │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────┬──────────────────────────────────────┘  │
│                             │                                          │
│  ┌──────────────────────────▼──────────────────────────────────────┐  │
│  │                   Komponentlar Tarmog'i                          │  │
│  │                                                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │  │
│  │  │ DaySelector  │  │ ChallengeHeader│ │  ProgressBar        │  │  │
│  │  │ (1-30 kun)   │  │ (sarlavha)    │  │  (xarita)           │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │  │
│  │                                                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │  │
│  │  │  VideoPlayer │  │TranscriptView │  │  VocabularySection  │  │  │
│  │  │  (YouTube)   │  │ (scrollable)  │  │  (flashcards)       │  │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘  │  │
│  │                                                                  │  │
│  │  ┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │SentenceBankSection│  │ExerciseSection│  │   QuizSection   │  │  │
│  │  │ (iboralar)       │  │ (4 xil tur)   │  │ (test)          │  │  │
│  │  └──────────────────┘  └──────────────┘  └──────────────────┘  │  │
│  │                                                                  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐                     │  │
│  │  │ SpeakingSection  │  │  ReviewSection   │                     │  │
│  │  │ (gapirish)       │  │ (takrorlash)     │                     │  │
│  │  └──────────────────┘  └──────────────────┘                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                             │                                          │
│  ┌──────────────────────────▼──────────────────────────────────────┐  │
│  │                     MA'LUMOTLAR MANBALARI                        │  │
│  │                                                                  │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │  │
│  │  │ src/data/       │  │ 30_day/         │  │ YouTube         │  │  │
│  │  │ 30dayChallenge/ │  │ day_1.txt ...   │  │ (video embed)   │  │  │
│  │  │ day1.ts ...     │  │ (transkriptlar) │  │                 │  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 🧩 Komponentlar Ierarxiyasi

```
App.tsx
 └── <Route path="/30-day-challenge">
      └── ThirtyDayChallenge.tsx
           ├── DaySelector.tsx            ← Kunlar navigatsiyasi (1-30)
           ├── ChallengeHeader.tsx        ← Sarlavha + progress + xp
           │    └── ProgressBar.tsx       ← Kun bajarilish foizi
           │
           ├── ContentArea (scrollable)
           │    │
           │    ├── 📺 VideoPlayer.tsx    ← YouTube embed player
           │    │    ├── YouTube iframe
           │    │    └── PlayButton overlay (custom)
           │    │
           │    ├── 📝 TranscriptView.tsx ← Video transkripti
           │    │    ├── Tab: "Transkript"
           │    │    └── Timestamp links (vaqtga sakrash)
           │    │
           │    ├── 🎯 LearningObjectives.tsx ← Maqsadlar ro'yxati
           │    │    └── Checkbox list
           │    │
           │    ├── 💡 HighlightsSection.tsx ← Dars bo'limlari
           │    │    └── Accordion cards
           │    │
           │    ├── 📚 VocabularySection.tsx ← Lug'at
           │    │    ├── FlashcardView (so'z -> ma'no)
           │    │    └── Example sentences
           │    │
           │    ├── 💬 SentenceBankSection.tsx ← Barcha jumlalar
           │    │    ├── Category tabs
           │    │    └── Phrase list with translations
           │    │
           │    ├── ✍️ ExerciseSection.tsx ← Mashqlar
           │    │    ├── DialogueComplete (bo'sh joy to'ldirish)
           │    │    ├── RoleplayView (sahna ko'rinishi)
           │    │    ├── ShadowingView (listen & repeat)
           │    │    └── QuestionsView (savol-javob)
           │    │
           │    ├── 📝 QuizSection.tsx ← Test
           │    │    ├── MultipleChoiceQuestion
           │    │    └── FillBlankQuestion
           │    │
           │    ├── 🎤 SpeakingSection.tsx ← Gapirish
           │    │    └── VoiceRecorder (useSpeechRecognition)
           │    │         ├── Prompt display
           │    │         ├── Tips list
           │    │         └── Record button + timer
           │    │
           │    └── 📋 ReviewSection.tsx ← Takrorlash
           │         ├── Vocabulary recap
           │         ├── Key phrases
           │         └── Main points summary
           │
           └── NavigationFooter
                ├── "← Oldingi kun" button
                ├── "Kunni yakunlash" button
                └── "Keyingi kun →" button
```

---

## 3. 🔄 Ma'lumotlar Oqimi (Data Flow)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW DIAGRAMI                               │
│                                                                         │
│  ┌──────────────┐                                                       │
│  │  30_day/     │  ← Raw video transcripts + workbooks (.txt)          │
│  │  day_1.txt   │                                                       │
│  └──────┬───────┘                                                       │
│         │  Eli bilan qo'lda o'zgartiriladi                              │
│         ▼                                                               │
│  ┌──────────────────────────────────────────────┐                      │
│  │  src/data/30dayChallenge/                    │                      │
│  │                                              │                      │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │                      │
│  │  │ types.ts │  │ day1.ts  │  │ index.ts │   │                      │
│  │  │          │  │ day2.ts  │  │          │   │                      │
│  │  │Interfeys-│  │ day3.ts  │  │ Eksport  │   │                      │
│  │  │lar       │  │ ...      │  │ CHALLENGE│   │                      │
│  │  └──────────┘  └──────────┘  │ _DAYS    │   │                      │
│  │                               └────┬─────┘   │                      │
│  └────────────────────────────────────┼─────────┘                      │
│                                       │                                 │
│                                       ▼                                 │
│  ┌──────────────────────────────────────────────────────┐              │
│  │  ThirtyDayChallenge.tsx (Page Component)             │              │
│  │                                                      │              │
│  │  const day = CHALLENGE_DAYS.find(d => d.day === n)   │              │
│  │  const [currentDay, setCurrentDay] = useState(1)     │              │
│  │  const [completedDays, setCompletedDays] = useState  │              │
│  │    (() => loadFromStorage())                         │              │
│  │  const [xpEarned, setXpEarned] = useState(0)         │              │
│  │                                                      │              │
│  │  ┌──────────────────────────────────────────┐       │              │
│  │  │  useEffect → localStorage.save()         │       │              │
│  │  └──────────────────────────────────────────┘       │              │
│  └──────┬───────┬───────┬───────┬───────┬───────┬──────┘              │
│         │       │       │       │       │       │                      │
│         ▼       ▼       ▼       ▼       ▼       ▼                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                    │
│  │Day │ │Chal│ │Vid │ │Voc │ │Expr│ │Exer│ │Quiz│ ← Props bilan      │
│  │Sel.│ │Head│ │eo  │ │ab  │ │ess │ │cise│ │    │    day ma'lumotlari│
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘                    │
│                                                      ┌────┐ ┌────┐    │
│                                                      │Spea│ │Revi│    │
│                                                      │king│ │ew  │    │
│                                                      └────┘ └────┘    │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  localStorage                                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │  "30dayChallenge_progress" = {                          │    │  │
│  │  │    completedDays: [1, 2, 3],                            │    │  │
│  │  │    currentDay: 4,                                       │    │  │
│  │  │    scores: { 1: 85, 2: 92, 3: 78 },                     │    │  │
│  │  │    xpEarned: 750,                                       │    │  │
│  │  │    lastActive: "2026-07-12"                             │    │  │
│  │  │  }                                                      │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 🧠 State Management (Holat Boshqaruvi)

```
┌─────────────────────────────────────────────────────────────┐
│                 ThirtyDayChallenge State                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  currentDay: number        ← Hozirgi kun (1-30)             │
│  completedDays: Set<number> ← Bajarilgan kunlar             │
│  dayScores: Record<number, number> ← Har bir kun bali      │
│  xpEarned: number          ← Umumiy XP                       │
│  currentTab: string        ← Hozirgi tab (video|vocab|...)   │
│  quizAnswers: Record<number, number> ← Test javoblari       │
│  isSpeaking: boolean       ← Yozib olish holati             │
│                                                              │
│  Funksiyalar:                                                │
│  ├── goToDay(n)             → currentDay = n                 │
│  ├── completeDay(score)     → completedDays + score + XP     │
│  ├── nextDay()              → currentDay++                   │
│  ├── prevDay()              → currentDay-- (agar > 1)        │
│  ├── loadProgress()         → localStorage dan o'qish       │
│  └── saveProgress()         → localStorage ga yozish        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. 📂 Fayl Tuzilishi (To'liq)

```
src/
├── data/
│   └── 30dayChallenge/
│       ├── types.ts           # ChallengeDay va boshqa interfeyslar
│       ├── index.ts           # CHALLENGE_DAYS[], getChallengeDay()
│       ├── day1.ts            # 1-kun ma'lumotlari
│       ├── day2.ts            # 2-kun ma'lumotlari
│       └── ...                # day30.ts gacha
│
├── pages/
│   └── ThirtyDayChallenge.tsx # Asosiy sahifa
│
├── components/
│   └── 30dayChallenge/
│       ├── index.ts           # Barcha komponentlarni re-export
│       ├── DaySelector.tsx    # Kunlar paneli
│       ├── ChallengeHeader.tsx# Sarlavha + progress
│       ├── VideoPlayer.tsx    # YouTube embed
│       ├── TranscriptView.tsx # Transkript
│       ├── LearningObjectives.tsx # Maqsadlar
│       ├── HighlightsSection.tsx # Dars bo'limlari
│       ├── VocabularySection.tsx # Lug'at flashcards
│       ├── SentenceBankSection.tsx # Barcha jumlalar
│       ├── ExerciseSection.tsx # Mashqlar
│       ├── QuizSection.tsx    # Test
│       ├── SpeakingSection.tsx # Speaking amaliyoti
│       └── ReviewSection.tsx  # Takrorlash
│
├── routes/
│   └── AppRoutes.tsx          # + /30-day-challenge route
│
├── hooks/
│   └── useChallengeProgress.ts # Progress hook (localStorage)
│
├── App.tsx                   # + lazy import
│
└── i18n/
    ├── types.ts
    ├── uz.json
    ├── en.json
    └── ru.json
```

---

## 6. 🔌 Data Flow (Kun tanlash → Ko'rsatish)

```
Foydalanuvchi DaySelector tugmasini bosadi
         │
         ▼
setCurrentDay(5)
         │
         ▼
getChallengeDay(5) → src/data/30dayChallenge/day5.ts dagi ma'lumot
         │
         ▼
ChallengeDay obyekti qaytariladi:
{
  id: 'day-5',
  day: 5,
  title: '...',
  level: 'A2',
  video: { youtubeId: '...' },
  transcript: '...',
  vocabulary: [ ... ],
  sentenceBank: { ... },
  exercises: [ ... ],
  quiz: [ ... ],
  speaking: { ... },
  review: { ... }
}
         │
         ▼
Komponentlarga props orqali tarqatiladi:
         │
         ├── VideoPlayer ← day.video.youtubeId
         ├── TranscriptView ← day.transcript
         ├── VocabularySection ← day.vocabulary
         ├── SentenceBankSection ← day.sentenceBank
         ├── ExerciseSection ← day.exercises
         ├── QuizSection ← day.quiz
         ├── SpeakingSection ← day.speaking
         └── ReviewSection ← day.review
```

---

## 7. ⚡ Komponentlar Props API-si

```
ThirtyDayChallenge (asosiy state manager)
│
├── DaySelector
│   Props: { currentDay, totalDays, completedDays, onSelect }
│
├── ChallengeHeader
│   Props: { day: ChallengeDay, progress, xpEarned }
│
├── VideoPlayer
│   Props: { youtubeId, title }
│
├── TranscriptView
│   Props: { transcript: string }
│
├── LearningObjectives
│   Props: { objectives: string[] }
│
├── HighlightsSection
│   Props: { highlights: LessonHighlight[] }
│
├── VocabularySection
│   Props: { vocabulary: ChallengeVocab[] }
│   Events: { onWordLearned: (word: string) => void }
│
├── SentenceBankSection
│   Props: { sentenceBank: SentenceBank }
│
├── ExerciseSection
│   Props: { exercises: ChallengeExercise[] }
│   Events: { onExerciseComplete: (id: number) => void }
│
├── QuizSection
│   Props: { quiz: ChallengeQuiz[] }
│   Events: { onQuizComplete: (score: number) => void }
│
├── SpeakingSection
│   Props: { speaking: ChallengeSpeaking }
│   Events: { onRecordingComplete: (audioUrl: string) => void }
│
└── ReviewSection
    Props: { review: ChallengeReview }
    Events: { onDayComplete: () => void }
```

---

## 8. 📋 Ma'lumotlar Strukturasi (ChallengeDay)

```
ChallengeDay {
  ├── id: string              // 'day-1'
  ├── day: number             // 1
  ├── title: string           // 'Speak English in 30 Days'
  ├── level: string           // 'A2'
  │
  ├── video?: {
  │   ├── youtubeId: string   // YouTube video ID
  │   └── duration: string    // '21:00'
  │ }
  │
  ├── transcript: string      // To'liq transkript matni
  ├── timestamps?: [{ time, text }]  // Vaqt tamg'alari
  │
  ├── learningObjectives: string[]  // Maqsadlar
  ├── highlights: [{           // Dars bo'limlari
  │   ├── title: string
  │   ├── content: string
  │   ├── points?: string[]
  │   └── phrases?: [{ phrase, meaning }]
  │ }]
  │
  ├── vocabulary: [{           // Lug'at
  │   ├── word: string
  │   ├── meaning: string
  │   └── example: string
  │ }]
  │
  ├── sentenceBank: {          // Barcha jumlalar
  │   ├── category: string
  │   └── phrases: string[]
  │ }]
  │
  ├── exercises: [{            // Mashqlar (4 xil tur)
  │   ├── id: number
  │   ├── type: 'dialogue-complete' | 'roleplay' | 'shadowing' | 'questions'
  │   ├── instruction: string
  │   └── content: ...         // Turga qarab farqlanadi
  │ }]
  │
  ├── quiz: [{                 // Test savollari
  │   ├── id: number
  │   ├── type: 'multiple-choice' | 'fill-blank'
  │   ├── question: string
  │   ├── options?: string[]
  │   ├── correct: string | number
  │   └── explanation: string
  │ }]
  │
  ├── speaking: {
  │   ├── prompt: string       // Speaking mavzusi
  │   ├── tips: string[]       // Maslahatlar
  │   └── practiceTime: number // Tavsiya etilgan vaqt (sec)
  │ }
  │
  └── review: {
      ├── vocabulary: string[]  // Kalit so'zlar
      ├── keyPhrases: string[]  // Kalit iboralar
      └── mainPoints: string[]  // Asosiy nuqtalar
    }
}
```

---

## 9. 👁 Views (Foydalanuvchi Ko'rinishlari)

```
┌──────────────────────────────────────────────────────────────────┐
│                    30-DAY CHALLENGE - KUN 1/30                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────┐                    │
│  │  [1] [2] [3] [4] [5] [6] [7] [8] [9]    │  ← Kun tanlash      │
│  │  [10] [11] [12] ... [30]                 │                    │
│  └──────────────────────────────────────────┘                    │
│                                                                   │
│  ┌─ 📺 Video ─────────────────────────────────────────────┐      │
│  │                                                         │      │
│  │              YouTube Video Player                       │      │
│  │                                                         │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ 📖 Transkript ─────────────────────────────────────────┐      │
│  │  "You understand English when you watch videos..."       │      │
│  │  "You know hundreds of words. But when someone..."      │      │
│  │  [Scrollable]                                           │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ 🎯 Maqsadlar ──────────────────────────────────────────┐      │
│  │  ✅ Use 99 essential English sentences                    │      │
│  │  ☐ Speak confidently in real-life situations             │      │
│  │  ☐ Practice shadowing technique                          │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ 📚 Lug'at ────────────────────────────────────────────┐      │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │      │
│  │  │practice │ │improve  │ │confident│ │ fluent  │      │      │
│  │  │   👆    │ │         │ │         │ │         │      │      │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │      │
│  │  Flashcard (bosilsa ma'no chiqadi)                     │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ 💬 Iboralar ──────────────────────────────────────────┐      │
│  │  [Greetings] [Help] [Polite]                           │      │
│  │  Good morning!                                         │      │
│  │  How are you today?                                    │      │
│  │  I'm doing well, thank you.                            │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ ✍️ Mashqlar ──────────────────────────────────────────┐      │
│  │  Tab: [Dialogue] [Roleplay] [Shadowing] [Questions]    │      │
│  │                                                         │      │
│  │  A: "How are you today?"                                │      │
│  │  B: "______________________" ← input field              │      │
│  │                                                         │      │
│  │  [Tekshirish]                                           │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ 📝 Test ─────────────────────────────────────────────┐      │
│  │  1. What does "fluent" mean?                          │      │
│  │  ○ Speaking perfectly without mistakes                │      │
│  │  ● Speaking easily and smoothly                       │      │
│  │  ○ Knowing all English words                          │      │
│  │  ○ Speaking very slowly                               │      │
│  │  [Natijani tekshirish]                                │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ 🎤 Speaking ─────────────────────────────────────────┐      │
│  │  Prompt: "Tell me about your daily routine..."         │      │
│  │  Tips: [Simple present tense ishlating]                │      │
│  │                                                         │      │
│  │           [🔴 Yozib olish]                             │      │
│  │              0:45                                       │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ 📋 Takrorlash ───────────────────────────────────────┐      │
│  │  ✅ practice    ✅ improve    ✅ confident    ✅ fluent │      │
│  │  Key phrases: "I'm doing well..."                      │      │
│  │  Main points: Speak every day...                       │      │
│  └─────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐      │
│  │  [← Oldingi kun]    [Kunni yakunlash 🎉]   [Keyingi →]  │      │
│  └─────────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 10. 🛤 Foydalanuvchi Sayohati (User Journey)

```
Kirish (Route: /30-day-challenge)
   │
   ▼
Challenge bosh sahifasi
   │
   ├── Agar birinchi marta → Day 1 ga yo'naltiriladi
   └── Agar davom etayotgan bo'lsa → oxirgi kunga yo'naltiriladi
        │
        ▼
   Day N da:
        │
        ├── 1️⃣ Video ko'radi (YouTube)
        ├── 2️⃣ Transkript o'qiydi
        ├── 3️⃣ Maqsadlar bilan tanishadi
        ├── 4️⃣ Highlights o'rganadi
        ├── 5️⃣ Vocabulary flashcards yodlaydi
        ├── 6️⃣ Expressions o'rganadi
        ├── 7️⃣ Exercises bajaradi
        ├── 8️⃣ Quiz ishlaydi
        ├── 9️⃣ Speaking amaliyot qiladi
        └── 🔟 Review qiladi
             │
             ▼
        "Kunni yakunlash" tugmasi
             │
             ▼
        ✅ Kun bajarildi → XP oladi
             │
             ▼
        Keyingi kunga o'tadi
```

---

## 11. 🧪 Progress Saqlash (localStorage)

```typescript
// localStorage kaliti: "30dayChallenge_progress"

interface ChallengeProgress {
  completedDays: number[]       // [1, 2, 3, ...]
  currentDay: number            // 4
  dayScores: Record<number, {
    quizScore: number           // 80 (foiz)
    exercisesDone: number[]     // [30001, 30002, ...]
    xpEarned: number            // 45
    completedAt: string         // ISO date
  }>
  totalXp: number               // 750
  lastActive: string            // ISO date
}

// Saqlash:
localStorage.setItem('30dayChallenge_progress', JSON.stringify(progress))

// O'qish:
const saved = localStorage.getItem('30dayChallenge_progress')
const progress: ChallengeProgress | null = saved ? JSON.parse(saved) : null
```

---

## 12. 🔗 Bog'lanishlar

| Boshqa bo'limlar | Aloqasi |
|------------------|---------|
| 📱 **Dashboard** | Challenge progress widget ko'rsatishi mumkin |
| 🏆 **Achievements** | Challenge yakunlash yutuqlari |
| 🗣 **Speaking Path** | Hech qanday bog'liqlik YO'Q |
| 📚 **Daily Lessons** | Hech qanday bog'liqlik YO'Q |
| 💬 **i18n** | Tarjima kalitlari kerak |

---
