# Informatika attestatsiyasi platformasi — loyiha hujjatlari

Ushbu papka AI coderlar va inson dasturchilar platformani bir xil talqin asosida qurishi uchun yagona texnik manbadir.

## Mahsulot maqsadi

O‘zbekiston informatika o‘qituvchilarini attestatsiyaning 50 savollik malaka sinoviga testga yo‘naltirilgan, vertikal mavzular asosidagi va manbasi tekshiriladigan tizim orqali tayyorlash.

Platforma:

- sinflar bo‘yicha emas, mavzuni boshlang‘ichdan murakkabgacha to‘liq o‘rgatadi;
- qisqa nazariyadan keyin Y1, Y2 va Y3 testlari orqali tekshiradi;
- birinchi mustaqil urinishni tushuntirishdan keyingi qayta urinishdan ajratadi;
- xatolar va interval takrorlash asosida adaptiv mashq beradi;
- amaldagi spetsifikatsiyaga aynan mos 50 savol/120 daqiqalik sinov yaratadi;
- har bir dars va savolni darslik yoki rasmiy manba sahifasiga bog‘laydi.

## Hujjatlar ustuvorligi

Qarama-qarshilik bo‘lsa, quyidagi tartib amal qiladi:

1. `DECISIONS.md` — tasdiqlangan arxitektura qarorlari.
2. `PRODUCT_REQUIREMENTS.md` — mahsulot talablari va scope.
3. `DOMAIN_RULES.md` — mastery, savol va imtihonning biznes qoidalari.
4. `DATABASE_SCHEMA.md` va `API_CONTRACTS.md` — texnik kontraktlar.
5. Qolgan maxsus hujjatlar.
6. `TASKS.md` — ishlarni bajarish ketma-ketligi.

Kod bu hujjatlarga zid bo‘lsa, kod emas, hujjat to‘g‘ri deb hisoblanadi. Talabni o‘zgartirish kerak bo‘lsa, avval `DECISIONS.md`ga yangi qaror qo‘shiladi.

## AI coder uchun majburiy o‘qish tartibi

Har bir coder ish boshlashdan oldin:

1. `AGENTS.md`
2. `PROJECT_STATE.md`
3. `DECISIONS.md`
4. `PRODUCT_REQUIREMENTS.md`
5. O‘z vazifasiga tegishli maxsus hujjat
6. `TASKS.md`dagi aynan o‘z taski
7. `ACCEPTANCE_CRITERIA.md`

fayllarini o‘qishi shart.

## Fayllar xaritasi

| Fayl | Maqsad |
|---|---|
| `AGENTS.md` | AI coderlarning qat’iy ish qoidalari |
| `PROJECT_STATE.md` | Joriy bosqich, band tasklar va bloklovchilar |
| `DECISIONS.md` | Tasdiqlangan arxitektura qarorlari |
| `PRODUCT_REQUIREMENTS.md` | Funksional va nofunksional talablar |
| `CONTENT_BLUEPRINT.md` | 16 modul va attestatsiya mazmun daraxti |
| `CONTENT_AUTHORING_STANDARD.md` | Dars va test yozish standarti |
| `SYSTEM_ARCHITECTURE.md` | Komponentlar va kod tuzilishi |
| `DATABASE_SCHEMA.md` | PostgreSQL jadvallari, enumlar va cheklovlar |
| `DOMAIN_RULES.md` | Mastery, SRS, savol va imtihon algoritmlari |
| `API_CONTRACTS.md` | API endpoint va xato kontraktlari |
| `UX_SPEC.md` | O‘quvchi interfeysi va accessibility |
| `ADMIN_CMS.md` | Kontent boshqaruvi va review jarayoni |
| `SECURITY_PRIVACY.md` | Auth, RLS, maxfiylik va xavfsizlik |
| `TESTING_QA.md` | Test piramidasi va quality gate’lar |
| `DEPLOYMENT_OPERATIONS.md` | Muhitlar, migratsiya, backup va monitoring |
| `IMPLEMENTATION_ROADMAP.md` | Bosqichlar va parallel ish yo‘laklari |
| `TASKS.md` | Atomik backlog, dependency va Definition of Done |
| `ACCEPTANCE_CRITERIA.md` | MVP va release qabul mezonlari |
| `GLOSSARY.md` | Yagona terminlar lug‘ati |

## Scope qisqacha

### MVP ichida

- o‘quvchi, muallif, ekspert va administrator rollari;
- 2026 spetsifikatsiyasining versiyalangan blueprint’i;
- vertikal kurs daraxti;
- dars, manba va savol CMS’i;
- Y1, Y2, Y3 savollari;
- diagnostika, practice, checkpoint, review va mock exam;
- mastery va 1/3/7/14/30 kunlik takrorlash;
- xatolar daftari;
- 50 savol/120 daqiqalik imtihon;
- o‘quvchi va kontent analitikasi;
- responsive web/PWA.

### MVP tashqarisida

- native iOS/Android ilova;
- chat, forum va ijtimoiy tarmoq;
- real kodni serverda bajarish;
- proctoring, webcam yoki biometrik nazorat;
- to‘lov tizimi;
- ko‘p tashkilotli SaaS;
- AI yaratgan savolni avtomatik nashr qilish.

## Asosiy texnologik stack

- Node.js 24 LTS.
- `pnpm` va committed lockfile.
- Next.js App Router, React va TypeScript strict mode.
- PostgreSQL, Supabase Auth, Storage va Row Level Security.
- SQL migratsiyalar va Supabase CLI.
- Zod bilan runtime validation.
- Vitest — unit/integration; Playwright — E2E; pgTAP — RLS/database.
- GitHub Actions yoki ekvivalent CI.

Versiyalar loyiha bootstrap’ida aniq pin qilinadi. `latest` yoki suzuvchi dependency production branch’da qoldirilmaydi.

## Darsliklar tahlili

Darsliklardan platformaga kerak bo‘ladigan modul, sahifa va kontent bo‘shliqlari
`CONTENT_BLUEPRINT.md`ga kiritilgan. Shuning uchun ushbu paket tashqi tahlil
fayliga bog‘liq emas va yangi repository’da mustaqil ishlaydi.

## Birinchi amaliy qadam

`TASK-001`dan boshlang. Schema va terminlar tasdiqlanmasdan UI ekranlarini parallel qurishni boshlamang.
