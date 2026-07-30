# Attestatsiya

O‘zbekiston informatika o‘qituvchilarini malaka sinoviga tayyorlash uchun
manbasi tekshiriladigan, server-authoritative va mobilga mos o‘quv platformasi.

## Joriy holat

Loyiha `P0 — xavfsizlik va barqarorlashtirish` bosqichida. UI prototipi ishlaydi,
ammo learner progressi, imtihon scoring’i va mastery hali to‘liq server
haqiqatiga ko‘chirilmagan. Production deploy mavjud emas.

## O‘zgarmas mahsulot qoidalari

- Malaka sinovi: 50 savol, 120 daqiqa, har savol 2 yoki 0 ball.
- Bo‘limlar: 35 mutaxassislik, 5 kasbiy standart, 7 pedagogika, 3 metodika.
- Kognitiv taqsimot: 8 bilish, 35 qo‘llash, 7 mulohaza qilish.
- Formatlar: Y1, Y2 va Y3.
- O‘qitish daraxti: 16 modul; rasmiy baholash blueprint’i alohida o‘q.
- Javob kaliti imtihon tugashidan oldin browser payload’iga chiqmaydi.
- Published dars va savol reviziyalari o‘zgarmas.
- AI yaratgan kontent inson eksperti tasdig‘isiz nashr qilinmaydi.

## Texnik arxitektura

- React 18 + Vite + TypeScript strict.
- Supabase Auth, PostgreSQL, Storage va RLS.
- Yozuv, scoring, exam timer va mastery uchun tekshirilgan RPC/Edge Function
  server chegarasi.
- Zustand faqat vaqtinchalik UI state va offline queue uchun; serverdagi
  evidence yakuniy haqiqat manbasi.
- npm lockfile, Node.js 24 LTS.

Framework va taksonomiya bo‘yicha yakuniy qarorlar
[`DECISIONS.md`](informatika-attestatsiya-platform-spec/DECISIONS.md) ichidagi
ADR-017 va ADR-018’da yozilgan.

## Hujjatlarni o‘qish tartibi

Qarama-qarshilikda quyidagi tartib amal qiladi:

1. `informatika-attestatsiya-platform-spec/DECISIONS.md`
2. `informatika-attestatsiya-platform-spec/PRODUCT_REQUIREMENTS.md`
3. `informatika-attestatsiya-platform-spec/DOMAIN_RULES.md`
4. `informatika-attestatsiya-platform-spec/DATABASE_SCHEMA.md`
   va `API_CONTRACTS.md`
5. qolgan maxsus spetsifikatsiyalar
6. `TASKS.md` va `PROJECT_STATE.md`

Coder ish tartibi uchun avval [`AGENTS.md`](AGENTS.md) o‘qiladi.

## Lokal ishga tushirish

Talablar:

- Node.js 24 LTS
- npm
- Docker Desktop — faqat lokal Supabase kerak bo‘lsa

```bash
cp .env.example .env
npm ci
npm run dev
```

Quality gate:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

`.env` ichida faqat browser uchun mo‘ljallangan Supabase URL va anon key
saqlanadi. DB paroli, personal access token va service-role key repository
fayllarida saqlanmaydi.

Remote UUID sxema o‘zgarganda TypeScript kontraktini Supabase CLI loginidan
quyidagicha qayta generatsiya qiling:

```bash
./scripts/generate-database-types.sh
```

Skript chiqishni avval vaqtinchalik faylda tekshiradi, so‘ng
`src/lib/database.types.ts`ni atomik almashtiradi. Yangi kod
`typedSupabase` clientidan foydalanadi; `supabase` nomi faqat hali UUID
sxemaga ko‘chirilmagan legacy admin ekranlari uchun vaqtinchalik alias.

## Lokal manbalar

`darsliklar/`, `Topics/` va katta bulk-import artefaktlari mualliflik huquqi,
hajm va xavfsizlik sabab Git’ga kiritilmaydi. Ular lokal authoring korpusi
sifatida ishlatiladi. Ochiq learner kontenti qayta yozilgan matn va aniq
source locator’dan iborat bo‘lishi kerak.

## Ish jarayoni

1. `TASKS.md`dan dependency’lari yopilgan task tanlanadi.
2. `PROJECT_STATE.md`da task claim qilinadi.
3. `task/TASK-...` branch yaratiladi.
4. Kod, test va tegishli hujjat birga yangilanadi.
5. Lint, typecheck/build, unit, E2E va kerak bo‘lsa pgTAP ishlatiladi.
