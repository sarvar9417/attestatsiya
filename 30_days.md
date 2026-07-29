# EnglishPath — Speaking OS
## Video kontent + SM-2 SRS + AI Conversation — birlashtirilgan arxitektura (v2)

---

## 0. Vizyon (bir jumlada)

> Foydalanuvchi video-kursdan **kontent** oladi, SRS orqali **unutmaydi**, AI bilan **haqiqiy suhbatda qo'llaydi**, va AI uni **eslab qolib** kundan-kunga chuqurroq shaxsiylashtiradi.

Bu YouTube kursi emas (passiv), bu ChatGPT taklif qilgan 10-bosqichli "hamma narsa birdan" ham emas (qurilmaydi). Bu ikkisining **quriladigan kesishmasi**.

**v2'da nima o'zgardi:** Video kurslarning kontenti bir xil formatda kelmasligi aniqlandi — ba'zi kunlar sof transkript (Day 1, Day 30), ba'zilari tayyor workbook (lug'at jadvali, rolli-o'yin skriptlari, grammatika patternlari bilan — Day 3). Shu sababli schema va kontent-tayyorlash jarayoni ikkalasiga ham moslashtirildi.

---

## 1. Asosiy tsikl (har kunga)

```
┌─────────────────────────────────────────────────────────────┐
│  1. WARM-UP          → SRS due cards (oldingi kunlardan)     │
│  2. TODAY'S CONTENT   → Vocab + sentence patterns + roleplay │
│  3. AI CONVERSATION   → Shu mavzuda erkin, kontekstli suhbat │
│  4. AI FEEDBACK       → Xatolar, yaxshiroq variantlar        │
│  5. SRS UPDATE        → Yangi jumlalar navbatga qo'shiladi   │
└─────────────────────────────────────────────────────────────┘
```

ChatGPT'ning 10 bosqichidan farqi: **shadowing va pronunciation scoring MVP'da yo'q** (bu alohida texnik loyiha, pastda Phase 2'da). Beshta bosqich — bitta o'tirishda 15-20 daqiqada tugaydigan, real quriladigan hajm.

---

## 2. Ma'lumotlar bazasi (Supabase schema)

### `topics` — har kun bitta yozuv
```sql
create table topics (
  id uuid primary key default gen_random_uuid(),
  day_number int unique not null,        -- 1..30
  title_uz text not null,
  title_en text not null,
  grammar_focus text,                     -- "Present Perfect", "Polite requests"
  level text,                             -- A2 / B1 / B1+ / B2
  scenario_context text,                  -- AI'ga beriladigan qisqa vaziyat tavsifi
  roleplay_script jsonb,                  -- Tayyor dialog skeleti (mavjud bo'lsa)
  youtube_id text,                         -- YouTube video ID (masalan 'Pae6tjZ2jxs')
  audio_url text                           -- TTS yoki audio fayl URL'i
);
```

`roleplay_script` — video workbook'da tayyor rolli-o'yin dialogi bo'lsa (masalan Day 3'dagi waiter/customer skripti), shu yerga saqlanadi va AI system promptga to'g'ridan-to'g'ri few-shot namuna sifatida qo'shiladi. Bu AI'ning generatsiya sifatini oshiradi — o'zi to'qib chiqarishiga hojat qolmaydi. Format:
```json
{
  "ai_role": "Waiter",
  "user_role": "Customer",
  "skeleton": [
    {"ai": "Good evening! Do you have a reservation?"},
    {"user_expected": "No, I don't have a reservation. Is that okay?"}
  ]
}
```
Agar video'da tayyor skript bo'lmasa (masalan sof transkript kunlari), bu maydon `null` qoladi — AI faqat `scenario_context`ga tayanadi.

### `sentence_cards` — SRS uchun, har topic'ga 10-12 ta
```sql
create table sentence_cards (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id),
  front_uz text not null,
  back_en text not null,
  audio_url text,
  -- SM-2 maydonlari:
  ease_factor float default 2.5,
  interval_days int default 0,
  repetitions int default 0,
  next_review_date date default current_date,
  user_id uuid references auth.users(id)
);
```

### `vocab_cards` — YANGI: so'z darajasidagi kartalar, alohida
```sql
create table vocab_cards (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id),
  word text not null,
  meaning_uz text not null,
  example_en text not null,
  audio_url text,
  review_direction text default 'both', -- 'uz_to_en', 'en_to_uz', 'both'
  -- SM-2 maydonlari (sentence_cards bilan bir xil, lekin alohida deck):
  ease_factor float default 2.5,
  interval_days int default 0,
  repetitions int default 0,
  next_review_date date default current_date,
  user_id uuid references auth.users(id)
);
```
Har ikkala jadvalga bir xil qo'shimcha maydon: `review_direction text default 'both'` — bu karta ikki tomonlama (UZ→EN, EN→UZ) yoki bir tomonlama ko'rsatilishini belgilaydi.

Nega alohida jadval: so'zlar va to'liq jumlalar unutilish tezligi va qiyinlik darajasi bo'yicha farq qiladi — bitta so'z ("reservation") va bitta jumla ("Do you have a reservation?") bir xil SRS interval bilan yuritilsa, biri haddan tashqari tez, ikkinchisi sekin qaytariladi. Ikkita alohida deck bu muammoni hal qiladi.

### `user_facts` — Life Memory
```sql
create table user_facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  fact_key text not null,
  fact_value text not null,
  learned_from_session_id uuid,
  created_at timestamp default now()
);
```

### `conversation_sessions`
```sql
create table conversation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  topic_id uuid references topics(id),
  transcript jsonb,
  feedback jsonb,
  weak_grammar_points text[],
  created_at timestamp default now()
);
```

### `user_weak_points` — adaptive tracking
```sql
create table user_weak_points (
  user_id uuid references auth.users(id),
  grammar_point text,
  error_count int default 1,
  last_seen date default current_date,
  primary key (user_id, grammar_point)
);
```

---

## 3. Kontent tayyorlash jarayoni (video → baza)

**Muhim yangilanish:** video kurslarning kontenti ikki xil formatda keladi, va ikkalasi ham qo'llab-quvvatlanadi:

```
Format A: Sof transkript (Day 1, Day 30 kabi)
   │
   └─→ Men transkriptni o'qib, eng foydali 10-12 jumlani
       tanlab, standart JSON'ga o'giraman.
       roleplay_script = null (mavjud emas)

Format B: Tayyor workbook (Day 3 kabi — lug'at jadvali,
          grammatika patternlari, tayyor rolli-o'yin dialogi bilan)
   │
   ├─→ Vocabulary jadvali          → vocab_cards
   ├─→ Kun mavzusiga eng yaqin
   │   bo'limdan 10-12 jumla       → sentence_cards
   │   (masalan restoran kuni bo'lsa,
   │    "Restaurant" bo'limidan olinadi,
   │    "Shopping" bo'limi emas)
   └─→ Tayyor rolli-o'yin dialogi  → topics.roleplay_script
```

Bu qattiq parser-skript emas — men har safar qanday format kelsa ham o'qib, moslashib, bir xil chiqish formatiga (JSON) keltiraman. Format B kelganda, sifat avtomatik yuqoriroq bo'ladi (chunki vocab va roleplay tayyor), lekin Format A ham to'liq ishlaydi, faqat kamroq maydon to'ladi.

**Doimiy qoida:** to'liq transkript yoki workbook hech qayerga saqlanmaydi — faqat siqilgan, SRS'ga mos kartalar.

---

## 4. AI Conversation — Claude API dizayni

### System prompt (har sessiyada dinamik quriladi)

```javascript
function buildSystemPrompt(topic, userFacts, weakPoints) {
  const roleplaySection = topic.roleplay_script
    ? `NAMUNA DIALOG (shu oqimni loyihalashtir, so'zma-so'z takrorlama):
Sen: ${topic.roleplay_script.ai_role}
Foydalanuvchi: ${topic.roleplay_script.user_role}
${topic.roleplay_script.skeleton.map(s => 
  s.ai ? `AI: "${s.ai}"` : `Foydalanuvchi kutilgan javob turi: "${s.user_expected}"`
).join('\n')}`
    : `VAZIYAT: ${topic.scenario_context}`;

  return `Sen foydalanuvchining ingliz tili suhbat sherigisan.

BUGUNGI MAVZU: ${topic.title_en}
${roleplaySection}
DARAJA: ${topic.level}

FOYDALANUVCHI HAQIDA (tabiiy suhbatda foydalan, lekin har gapda emas):
${userFacts.map(f => `- ${f.fact_key}: ${f.fact_value}`).join('\n')}

FOYDALANUVCHINING ZAIF NUQTALARI (imkon bo'lsa shu grammatikani ishlatishga undab tur):
${weakPoints.join(', ')}

QOIDALAR:
1. Faqat ingliz tilida, sodda va tabiiy tarzda javob ber.
2. Har javobda 1 ta savol qo'yib, suhbatni davom ettir.
3. Xato bo'lsa, avval tabiiy javob ber, keyin qavs ichida qisqa tuzatish:
   (Better: "I go" → "I went")
4. Foydalanuvchini kamida 15-20 so'zlik javob berishga undab tur.
5. Suhbat 8-10 almashinuvdan keyin tabiiy tugasin.
6. Agar foydalanuvchi o'zi haqida yangi fakt aytsa, javobing OXIRIGA shu formatda belgi qo'sh:
   [FACT: key=daughter, value=bor]`;
}
```

### Life Memory ajratish — alohida, ishonchli chaqiruv orqali

Avvalgi versiyada `[FACT: ...]` belgisini asosiy javob ichidan parsing qilish rejalashtirilgan edi — bu ishonchsiz, chunki LLM formatga har doim 100% rioya qilavermaydi. Tuzatilgan yondashuv: **alohida, kichik chaqiruv**, suhbat oxirida:

```javascript
const factExtractionPrompt = `Quyidagi suhbatdan foydalanuvchi haqida yangi shaxsiy fakt bormi?
Agar bo'lsa JSON qaytar: {"key": "...", "value": "..."}
Agar yo'q bo'lsa: null
Suhbat: ${JSON.stringify(transcript)}`;
```
Bu ikkinchi API chaqiruvi qo'shadi, lekin structured output sifatida ancha barqaror ishlaydi.

### Feedback generatsiyasi (sessiya oxirida)

```javascript
const feedbackPrompt = `Quyidagi suhbatni tahlil qil va JSON qaytar:
{
  "grammar_score": 1-5,
  "vocabulary_score": 1-5,
  "fluency_score": 1-5,
  "top_mistakes": [{"user_said": "...", "correction": "...", "rule": "..."}],
  "better_expressions": [{"basic": "...", "natural": "..."}],
  "weak_grammar_points": ["Present Perfect", ...]
}
Suhbat: ${JSON.stringify(transcript)}`;
```

---

## 5. SRS mantiq (SM-2)

Ikkita alohida deck — `sentence_cards` va `vocab_cards` — parallel ishlaydi, lekin bitta warm-up ekranida birgalikda ko'rsatiladi (ikkalasidan ham due bo'lganlar aralashtirilib chiqadi).

**Adaptive weight:** agar `user_weak_points`da biror grammatika ko'p bo'lsa, o'sha grammatikaga oid jumlalar SRS navbatida tezroq qaytariladi (ease_factor pastroq boshlanadi — bu kartani ko'proq marta ko'rsatadi, chunki interval qisqaradi). Murakkab ML kerak emas — oddiy SQL counter asosida.

---

## 6. Sizga kerak bo'ladigan ish oqimi (har kunlik kontent tayyorlash)

Video transkriptini (yoki workbook'ni) menga tashlaganingizda, men sizga to'g'ridan-to'g'ri shu JSON formatda qaytarib beraman:

```json
{
  "day_number": 5,
  "title_uz": "...",
  "title_en": "...",
  "grammar_focus": "...",
  "level": "B1",
  "scenario_context": "...",
  "roleplay_script": { "...": "... (agar workbook'da mavjud bo'lsa)" },
  "sentence_cards": [ /* 10-12 ta */ ],
  "vocab_cards": [ /* agar workbook'da mavjud bo'lsa */ ]
}
```

Shu JSON'ni to'g'ridan-to'g'ri tegishli jadvallarga insert qilasiz.

---

## 7. Bosqichma-bosqich qurilish rejasi

### MVP — 1-2 hafta
- [ ] Supabase schema (6 jadval: topics, sentence_cards, vocab_cards, user_facts, conversation_sessions, user_weak_points)
- [ ] RLS (Row Level Security) policy'lar — har foydalanuvchi faqat o'z `user_id`siga tegishli qatorlarni ko'rishi uchun
- [ ] 1 kunlik kontentni qo'lda kiritib test qilish
- [ ] SRS review UI (ikkala deck birgalikda)
- [ ] AI conversation UI (matn asosida, ovozsiz chat)
- [ ] Feedback ekrani (JSON'dan render)

### Phase 2
- [ ] Life Memory — alohida fact-extraction chaqiruvi orqali
- [ ] Weak-points adaptive tracking
- [ ] TTS audio (kartalar uchun)
- [ ] Oddiy shadowing (Web Speech API, aniq ball emas)

### Phase 3
- [ ] Gamification (XP, streak, dashboard)
- [ ] Haqiqiy pronunciation scoring (tashqi API)
- [ ] 30 kundan keyin — yangi kontent tsikllari (B2 darajasi uchun)

---

## 8. Nima uchun bu ikki g'oyaning eng kuchli birlashmasi

| Element | Manba | Nega saqlandi |
|---|---|---|
| SRS asosiy tizim | Men | Unutish egri chizig'iga qarshi, ilmiy asoslangan |
| Sentence va vocab decklarini ajratish | v2 tuzatish | Har biri o'z unutilish tezligiga mos SRS oladi |
| AI Conversation + Feedback | ChatGPT | Real qo'llash + tuzatish — YouTube'da yo'q narsa |
| Roleplay script (workbook'dan) | v2 qo'shimcha | AI generatsiya sifatini oshiradi, ishonchliroq suhbat |
| Life Memory (`user_facts`) | ChatGPT | Eng original va kuchli farqlovchi xususiyat |
| Fact extraction — alohida chaqiruv | v2 tuzatish | Asosiy javob ichidan parsing qilishdan ishonchliroq |
| Adaptive weak-points | ChatGPT (soddalashtirilgan) | Foydali, lekin murakkab ML emas — oddiy SQL counter |
| Pronunciation scoring, gamification | ChatGPT (kechiktirilgan) | Foydali, lekin alohida loyiha — MVP'ni bloklamasin |

---

**Keyingi qadam:** qolgan kunlarning video transkriptlarini (yoki workbook'larini) yuboring — men har birini shu formatga o'girib, tayyor JSON qaytaraman.

---

## 9. Existing Frontend Integration (30-Day Challenge Page)

Hozirgi kunda 30-Day Challenge uchun quyidagi frontend komponentlari mavjud:

| Frontend qism | Speaking OS dagi vazifasi | Status |
|---|---|---|
| `src/pages/ThirtyDayChallenge.tsx` | Asosiy sahifa — kun tanlash, tab navigatsiya | ✅ Yarim tayyor (localStorage asosida) |
| `src/data/30dayChallenge/day1.ts` | Format A kontent (transkript asosida) | ✅ To'liq |
| `src/data/30dayChallenge/day2.ts` | Format A kontent (transkript asosida) | ✅ To'liq |
| `src/data/30dayChallenge/types.ts` | ChallengeDay interfeysi (Speaker OS ga moslashtirish kerak) | ✅ Bor, lekin Supabase schema bilan sinxronlash kerak |
| `src/components/30dayChallenge/SentenceBankSection.tsx` | Barcha jumlalar — kelajakda SRS review UI bilan almashtiriladi | ⏳ Vaqtinchalik |
| `src/components/30dayChallenge/QuizSection.tsx` | Quiz/test — kelajakda AI Feedback bilan almashtiriladi | ⏳ Vaqtinchalik |
| `src/components/30dayChallenge/SpeakingSection.tsx` | Voice recording — kelajakda AI Conversation bilan almashtiriladi | ⏳ Vaqtinchalik |

**Migratsiya yo'li:**
1. `day1.ts`, `day2.ts` dagi kontentni Supabase jadvallariga ko'chirish (script orqali)
2. `types.ts` ni `topics`, `sentence_cards`, `vocab_cards` interfeyslari bilan yangilash
3. `SentenceBankSection` → SRS review UI
4. `QuizSection` → AI Feedback
5. `SpeakingSection` → AI Conversation

---

## 10. Codebase File Structure

```
src/
├── pages/
│   └── ThirtyDayChallenge.tsx     # Asosiy sahifa (hali localStorage asosida)
├── data/
│   └── 30dayChallenge/
│       ├── types.ts               # ChallengeDay interfeysi
│       ├── index.ts               # Eksport
│       ├── day1.ts                # Format A (transkript)
│       └── day2.ts                # Format A (transkript)
├── components/
│   └── 30dayChallenge/
│       ├── DaySelector.tsx        # Kun tanlash paneli
│       ├── ChallengeHeader.tsx    # Sarlavha + progress
│       ├── VideoPlayer.tsx        # YouTube embed
│       ├── TranscriptView.tsx     # Transkript ko'rinishi
│       ├── HighlightsSection.tsx  # Dars bo'limlari
│       ├── VocabularySection.tsx  # Lug'at flashcards
│       ├── SentenceBankSection.tsx# Barcha jumlalar (vaqtinchalik)
│       ├── ExerciseSection.tsx    # Mashqlar
│       ├── QuizSection.tsx        # Test (vaqtinchalik)
│       ├── SpeakingSection.tsx    # Voice recording (vaqtinchalik)
│       └── ReviewSection.tsx      # Kun yakuni takrorlash
├── routes/
│   └── AppRoutes.tsx              # Route: /30-day-challenge
├── i18n/
│   ├── uz.json                    # "30-Kun Challenge"
│   ├── en.json                    # "30-Day Challenge"
│   └── ru.json                    # "30-дневный челлендж"
├── components/dashboard/
│   └── ChallengeCard.tsx          # Dashboard widget
└── lib/
    ├── srs.ts                     # SM-2 algoritmi (yangi)
    └── claudeChat.ts              # AI Conversation (yangi)
```

---

## 11. Glossary (Atamalar lug'ati)

| Atama | Ma'nosi |
|---|---|
| **Format A** | Sof transkript — faqat video matni bor, workbook yo'q |
| **Format B** | Tayyor workbook — lug'at jadvali, rolli-o'yin, grammatika patternlari bor |
| **SRS** | Spaced Repetition System — vaqt oralatib takrorlash tizimi |
| **SM-2** | SuperMemo 2 — eng mashhur SRS algoritmi |
| **Ease Factor** | Karta qiyinlik koeffitsienti (default 2.5, past = tez-tez ko'rsatiladi) |
| **Interval Days** | Keyingi takrorlashgacha necha kun kutish |
| **Repetitions** | Karta necha marta muvaffaqiyatli takrorlangan |
| **Due cards** | Bugun takrorlanishi kerak bo'lgan kartalar |
| **Sentence deck** | To'liq jumlalar decki (grammatika va kontekst uchun) |
| **Vocab deck** | Alohida so'zlar decki (tez-tez takrorlanadi) |
| **Life Memory** | Foydalanuvchi haqidagi shaxsiy ma'lumotlar (AI eslab qoladi) |
| **Roleplay script** | Workbook'dan olingan tayyor dialog skeleti |
| **Scenario context** | AI'ga beriladigan vaziyat tavsifi |
| **Weak points** | Foydalanuvchining zaif grammatik nuqtalari |
| **Adaptive weight** | Weak points asosida SRS intervalini qisqartirish |
| **Shadowing** | Eshitgan gapni darhol takrorlash (Phase 2) |
