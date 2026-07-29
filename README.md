# EnglishPath

**A2+ dan B2 ga 126 kunlik intensiv ingliz tili o'quv platformasi**

EnglishPath — bu A2+ darajadan B2 darajasigacha 126 kunlik intensiv ingliz tili o'rgatish platformasi. Zamonaviy texnologiyalar va ilmiy yondashuvlar asosida tayyorlangan.

## Xususiyatlari

- **126 kunlik intensiv dastur** — A2+ dan B2 gacha tizimli o'quv rejasi
- **FSRS-5 algoritmi** — Interval takrorlash tizimi (Spaced Repetition) asosida so'zlar va grammatikani eslab qolish
- **Claude AI** — Sun'iy intellekt yordamida writing va speaking tekshiruvi
- **6 ta o'quv bo'limi** — Theory, Drill, Reading, Writing, Speaking, Listening
- **Gamifikasiya tizimi** — XP, streak, daraja ko'tarilishi va yutuqlar
- **PWA qo'llab-quvvatlashi** — Offline rejimda ishlatish mumkin
- **Kundalik pomodoro taymer** — Samaradorlikni oshirish uchun vaqt boshqaruvi
- **Dark mode** — Kechasi ko'rish uchun qulay rejim
- **Responsive dizayn** — Barcha qurilmalarda to'g'ri ko'rinadi
- **I18n qo'llab-quvvatlashi** — O'zbek va ingliz tillarida interfeys
- **Confusable banner** — Aralashtirib yuborish mumkin bo'lgan so'zlarni aniqlash
- **XP va streak animatsiyalari** — O'yin hissi bilan motivatsiya

## Texnologiyalar

| Texnologiya | Versiya | Maqsad |
|---|---|---|
| React | 18.3 | UI komponentlari |
| TypeScript | 5.6 | TypeScript qo'llab-quvvatlashi |
| Vite | 8.0 | Build tool va dev server |
| Tailwind CSS | 3.4 | CSS framework |
| Supabase | 2.105 | Backend va ma'lumotlar bazasi |
| Zustand | 5.0 | Holat boshqaruvi (State management) |
| FSRS-5 | — | Interval takrorlash algoritmi |
| Claude AI | — | Sun'iy intellekt tekshiruvi |
| PWA | — | Progressive Web App |

## O'rnatish

```bash
# Omborni klonlang
git clone https://github.com/your-username/englishpath.git
cd englishpath

# Bog'liqliklarni o'rnating
npm install
```

## Ishga tushirish

```bash
# Development serverini ishga tushiring
npm run dev

# Build qiling
npm run build

# Production versiyasini tekshiring
npm run preview
```

## Testlar

```bash
# Barcha testlarni ishga tushiring
npm test

# Testlarni kuzatib boring
npm run test:watch

# Coverage bilan testlarni ishga tushiring
npm run test:coverage
```

## Loyiha tuzilishi

```
src/
├── components/       # UI komponentlari
│   ├── dailyLesson/  # Dars komponentlari
│   └── ui/           # Umumiy UI komponentlari
├── data/             # Dars ma'lumotlari
├── db/               # IndexedDB (Dexie) sozlamalari
├── hooks/            # Maxsus React hookslari
├://i18n/             # Tarjima fayllari
├── lib/              # Yordamchi kutubxonalar
├── pages/            # Sahifa komponentlari
├── routes/           # Marshrutlar
├── services/         // Xizmatlar (Supabase, AI)
├── store/            # Zustand store
├── types/            # TypeScript turlari
└── utils/            # Yordamchi funksiyalar
```

## Skrinshotlar

<!-- Skrinshotlar shu yerga qo'shiladi -->

```
![Dashboard](screenshots/dashboard.png)
![Lesson View](screenshots/lesson-view.png)
![Dark Mode](screenshots/dark-mode.png)
```

## Litsenziya

MIT License — Barcha huquqlar himoyalangan.

```
MIT License

Copyright (c) 2024 EnglishPath

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
