# Attestatsiya tayyorgarlik platformasi — spetsifikatsiya

Bu papka AI kod agenti (Claude Code) uchun yozilgan. Har bir fayl mustaqil kontekst
bo'lib ishlaydi. Kod yozishdan oldin kerakli faylni to'liq o'qing.

---

## Loyiha nima

O'zbekiston informatika fani o'qituvchilari uchun **attestatsiya (malaka toifa)
sinoviga tayyorgarlik platformasi**. Bepul, ommaviy, ro'yxatdan o'tishsiz
boshlanadi.

Rasmiy asos: *"Umumiy o'rta va maktabdan tashqari ta'lim tashkilotlari informatika
va axborot texnologiyalari fani o'qituvchilarini attestatsiyadan o'tkazish uchun
malaka sinovida foydalaniladigan test topshiriqlari spetsifikatsiyasi"*,
Toshkent — 2026.

**Imtihon formati (o'zgarmas haqiqat):**

| Blok | Savol |
|---|---|
| Mutaxassislik fani | 35 |
| Kasb standarti | 5 |
| Pedagogik mahorat | 10 |
| **Jami** | **50** |

- Vaqt: 120 daqiqa
- Har to'g'ri javob 2 ball, noto'g'ri 0 ball, jami 100 ball
- Savol formatlari: `Y1` (yagona to'g'ri javob), `Y2` (moslashtirish), `Y3` (ketma-ketlik)
- Kognitiv taqsimot: bilish 8, qo'llash 35, mulohaza 7

Ball chegaralari `04-BLUEPRINT.md` da.

---

## Mahsulot mantig'i

```
Foydalanuvchi kiradi (anonim)
  → ixtiyoriy kirish diagnostikasi (25 savol)
  → BO'LIM tanlaydi (9 ta)
      → MAVZU o'qiydi (dars matni)
      → mashq qiladi (ball hisoblanmaydi, javob darhol)
      → mavzu testi (har konstrukt kamida 1 marta qamraladi)
      → keyingi mavzu
  → bo'lim imtihoni
  → barcha bo'lim ochilgach: to'liq 50 talik mock, 120 daqiqa
  → natija: ball + toifa qarori + konstrukt darajasida bo'shliq xaritasi
```

---

## Ierarxiya — butun tizimning o'qi

```
SUBJECT (fan)
  └── MODULE (bo'lim, 9 ta)
        └── LESSON (mavzu, ~35 ta)
              └── CONSTRUCT (baholanadigan atom, ~60 ta)
                    └── QUESTION (savol)
```

`CONSTRUCT` — eng muhim tushuncha. Bu spetsifikatsiyadagi har bir "baholanadigan
bilim va ko'nikma" bandi. Barcha diagnostika, SM-2 takrorlash va blueprint kvotasi
aynan konstrukt darajasida ishlaydi, mavzu darajasida emas.

---

## Fayllarni o'qish tartibi

| Fayl | Nima uchun | Qachon o'qish |
|---|---|---|
| `01-ARCHITECTURE.md` | Stack, papka tuzilmasi, route xaritasi | Boshida, har doim |
| `02-DATABASE.md` | 19 jadval DDL + RLS siyosatlari | Migratsiya yozishdan oldin |
| `03-RPC.md` | 7 ta server funksiyasi, to'liq SQL | Migratsiyadan keyin |
| `04-BLUEPRINT.md` | Spetsifikatsiya ma'lumoti, seed | Seed yozishdan oldin |
| `05-FRONTEND.md` | Dizayn yo'nalishi, komponentlar, sahifalar | UI yozishdan oldin |
| `06-ADMIN.md` | Admin panel modullari | Admin yozishdan oldin |
| `07-ROADMAP.md` | Bosqichma-bosqich vazifalar | Har bosqich boshida |

---

## Buzilmasligi kerak bo'lgan qoidalar

Bular arxitekturaning tayanchi. Ularni "soddalashtirish" tizimni buzadi.

1. **Javob kaliti hech qachon klientga bormaydi.**
   `question_keys` jadvalida `anon` va `user` rollari uchun `select` siyosati
   yo'q. Savollar faqat `start_exam` RPC orqali, kalitsiz beriladi.

2. **Klient bazaga to'g'ridan-to'g'ri yozmaydi.**
   Barcha yozish `security definer` RPC orqali. Klientda faqat `select`
   (ommaviy kontent) va RPC chaqiruvi bo'ladi.

3. **Har jadvalda RLS yoqilgan.**
   Supabase'da siyosat yozilmagan jadval standart holatda ochiq qoladi.
   `alter table ... enable row level security` — istisnosiz.

4. **Blueprint kvotalari bazada, kodda emas.**
   Spetsifikatsiya har yili o'zgaradi. `exams.blueprint_id` orqali eski
   natijalar qaysi versiya bo'yicha olingani saqlanadi.

5. **Ko'p fanlilikka tayyor, lekin UI'da bitta fan.**
   `subject_id` barcha kontent jadvalida bor. UI'da fan tanlash ko'rsatilmaydi
   — `informatika` qattiq bog'langan. Keyinchalik ochish arzon bo'ladi.

6. **`finish_exam` idempotent.**
   Taymer tugashi va foydalanuvchi tugmasi bir vaqtda ishlashi mumkin.

---

## Nomlash konvensiyasi

| Nima | Uslub | Misol |
|---|---|---|
| Postgres jadval, ustun | `snake_case`, inglizcha | `user_construct_stats` |
| Postgres enum qiymat | `snake_case`, o'zbekcha | `'mavzu'`, `'mulohaza'` |
| TypeScript tip | `PascalCase` | `ExamItem` |
| TypeScript o'zgaruvchi | `camelCase` | `constructId` |
| Route segment | o'zbekcha, `kebab-case` | `/bolimlar/[module]/imtihon` |
| Konstrukt kodi | `GURUH.KOD` | `S3.NUM`, `PM.GEN` |
| Fayl (komponent) | `PascalCase.tsx` | `Y2MatchQuestion.tsx` |
| Fayl (util) | `camelCase.ts` | `sm2.ts` |

**Foydalanuvchiga ko'rinadigan matn — faqat o'zbekcha.** Kod ichidagi identifikator
— faqat inglizcha. Aralashtirmang.

---

## Muhit o'zgaruvchilari

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # faqat server, hech qachon NEXT_PUBLIC_ emas
```

`SUPABASE_SERVICE_ROLE_KEY` faqat `lib/supabase/admin.ts` da ishlatiladi va u fayl
`import 'server-only'` bilan boshlanadi.
