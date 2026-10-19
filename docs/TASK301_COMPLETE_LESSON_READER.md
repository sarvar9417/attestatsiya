# TASK-301 — Mavjud nazariyani yagona kitobda saqlash

Task: TASK-301, 2026-10-19. Owner: Codex. Base: current `main`.

## Muammo

M01 uslubidagi BookReader barcha darslarga ulangan, ammo kontent tanlash eski qoidalarga tayanib qolgan:

- M15.01–08 ning 85 ta mavjud izoh/misol/manba bloki kitobdan keyingi yopiq bo‘limda qolgan.
- M14/M15/M16 uchun mavjud manbali qo‘shimchalar alohida yoki qisqargan oqimda qolib ketishi mumkin edi.
- Uzun darsning oxirgi sahifasidan qisqa darsga o‘tishda eski indeks render vaqtida mavjud bo‘lmagan sahifani o‘qigan.
- Jadval parseri nostandart ustunli qatorlarni tashlab yuborgan; book box bir vaqtda content va children bo‘lsa content qismini yashirgan.

## Natija

`completeLessonReader` mavjud kontentni o‘zgartirmasdan bir o‘qish oqimiga yig‘adi. M01 namunasi saqlanadi; barcha bo‘limlar mundarija, oldingi/keyingi tugmalari va progress orqali o‘qiladi.

- M02: tekshirilgan mahalliy kitob birinchi; faqat belgilangan verified addendum va mavjud source supplement qo‘shiladi. Eski qisqa DB konspekti kitob o‘rnini egallamaydi.
- M15: mahalliy asos → 85 mavjud izoh → faqat marker bilan ajratilgan source supplement. Eski qisqa server xulosasi asosiy kitobga aralashtirilmaydi.
- M14/M16: published asos → tekshirilgan mahalliy/manbali qo‘shimchalar; yangi `main`dagi kanonik tartib saqlanadi.
- M04: kanonik published asos va source supplement; eskirgan mahalliy matn published nazariyaga aralashtirilmaydi.
- Qolgan static/UUID darslar mavjud manba va ketma-ketligini saqlaydi.
- Faqat manbalar o‘rtasidagi aynan teng bloklar takror qo‘shilmaydi. Bitta manbadagi takroriy o‘quv bosqichlari saqlanadi.
- M02/M15 ham darsni ochishdan oldin API javobini kutadi. Javob kelgach o‘qish davomida sahifalar o‘zgarmaydi. API xatosi mahalliy fallback va aniq qayta yuklash tugmasini ko‘rsatadi.
- Published/draft chegarasi, savol kalitlari va test boshlash qoidalari saqlanadi.
- Uzun/qisqa dars almashganda reader birinchi sahifaga qaytadi. Oxirgi sahifaga sakrash endi barcha bo‘limlar o‘qildi deb da’vo qilmaydi.
- Noaniq table/diagram/deflist tuzilmasida mavjud matn yashirilmaydi; box content + children ikkalasi ko‘rsatiladi.

## Kontent saqlanish auditi

Joriy statik katalogda 115 ta mahalliy mavzu: **1 771 → 1 856 blok**. Farq — M15dagi ilgari alohida ko‘rsatilgan 85 blok; yangi nazariya yozilmadi. Published server materiallari qo‘shilganda hajm darsning real API javobiga bog‘liq.

16 modulning har birida mavjud bloklar tartibining saqlanishi va har blokning haqiqiy renderer orqali chiqishi tekshiriladi. Bu raqam server-only barcha darslar yoki darslik betlarining to‘liqligi sertifikati emas.

## Tekshiruvlar

- New regression: 16-module corpus preservation/rendering; M15 marked source corpus; M02 verified-only policy; no mutation/exact duplicate preservation; fallback; malformed table row; box content/children; long-to-short lesson transition.
- TopicView integration: first-paint stability; draft/empty rejection; M15 notes/marked supplement reachability; failed source load and retry.
- Desktop/mobile Playwright: M02/M14/M15/M16 pages, complete source text/table reachability, navigation, viewport overflow and test-readiness lock.
- Local lint, TypeScript, production build, answer-key bundle scan and secret scan passed.
- Final rebased full unit suite: **141 files / 905 tests passed** with `npm test -- --run --maxWorkers=4 --testTimeout=30000`.
- Final affected set: **3 files / 58 tests passed** (`CompleteLessonReader` 25, `BookReader` 25, `TopicTheoryStability` 8).
- `git diff --check` passed. GitHub CI has not run for this branch.
- Local Playwright launch unavailable: installed dependency has no Chromium executable; an attempted browser download returned an invalid/truncated archive. The scenarios are ready for GitHub CI, which installs Chromium, but have NOT run successfully yet. Tests use explicit API/session fixtures, not a production account.

## Handoff

O‘zgargan fayllar: TopicView, completeLessonReader, BookReader, BookBlock, Markdown adapter, regressiyalar va ushbu hujjatlar.
Migratsiyalar: yo‘q. Production DB write: yo‘q.
Release: foydalanuvchi GitHub’ga yuborish va merge qilishni tasdiqladi. Deploy taqiqlangan; `vercel.json`dagi git deployment o‘chirilgan holat saqlanadi.

Yaqinda `main`ga kirgan nazariya boyitish va tartiblash ishlari rebase paytida saqlandi. Bu tuzatish yangi nazariyani avtomatik tasdiqlamaydi; barcha darsliklarga betma-bet to‘liqlik auditi ko‘rsatish xatosi tuzatishidan alohida qoladi.

## 2026-10-19 — release authorization update

User explicitly requested merge, with no deployment. GitHub CI must pass on the submitted head. Automatic Vercel Git deployments are disabled (`git.deploymentEnabled: false`). No deployment command or production database operation is authorized.
