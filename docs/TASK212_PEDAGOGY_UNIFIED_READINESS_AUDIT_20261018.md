# TASK-212 — Pedagogikaga tayyorlanish: yagona manba va release-readiness auditi
**Sana:** 2026-10-18  
**Ishchi branch:** task/TASK-212-pedagogy-learning-hub-audit-20261018  
**Status:** PARTIAL / DRAFT; production release tasdiqlanmagan.  
**Doira:** M14 kasb standarti, M15 umumiy pedagogika, M16 informatika o‘qitish metodikasi.

## 1. Asosiy tekshirilgan talab
2026-yil informatika attestatsiyasi: 50 test, 120 daqiqa; 35 mutaxassislik, 5 KS, 7 PM.GEN va 3 PM.MET. Jami professional/pedagogik blok 15 savol. M14 (7), M15 (8), M16 (3) — 18 kanonik o‘quv mavzu. Test konstruktlari va mavzular soni bir xil kattalik emas.

Yagona o‘quv ssenariysi: M14/M15/M16 bo‘limini tanlash → kanonik mavzu nazariyasi → shu mavzu uchun serverdagi test-preflight → haqiqiy test → natija/xatolar → 15 savollik umumlashtiruvchi mashq. Rasmiy 50 savollik mock bundan alohida.

## 2. Asosiy source-of-truth va kirilgan manbalar
- Git monorepo: https://github.com/sarvar9417/attestatsiya (source, docs, schema, regressiya).
- Legacy only: sarvar9417/attestatsiya-backend — mustaqil production manbasi emas.
- Google Drive: https://drive.google.com/drive/folders/139UU38VTM85dcWJ8FFtgFK7KTCzsfJ7A
- Normativ exam manba: “Informatika Testlar spesifikatsiyasi.pdf”, 2026, III bo‘lim.
- Drive tarixiy korpusi: “Attestatsiya to'plam ped mahorat @PedMahoratGuli.pdf”, “PedKasb tushgan testlar PedMahoratGuli ...pdf”, “Pedagogik mahorat to'plam 2025.pdf”, “Pedmahorat to'plam 2025 kuzgi.pdf”.
- Oldingi nazariya inventari: Xoliqov — Pedagogik mahorat, Qodirova/Pulatova — Inklyuziv ta’lim, “Dars turlari”, “dars tahlili turlari”, “Pedagogik qobiliyatlar” hamda o‘qituvchi kasb standarti, Mamarajabov va boshqalar — Informatika o‘qitish metodikasi.
- Tarixiy PDFda yozilgan “to‘g‘ri javob” rasmiy/ekspert tasdig‘i emas; original darslik va me’yoriy hujjat bilan xolis tekshirish majburiy.

## 3. Dalil va xavf reyestri (oldingi audit sanalarini saqlab ko‘rsatish)
| ID | Holat va aniq dalil | Ta’sir | Qabul sharti |
|---|---|---|---|
| PED-01 | TASK203 2026-10-18 read-only production snapshot: 424 published (KS 114, PM.GEN 233, PM.MET 77), 0 review; bugungi live DB qayta tekshirilmadi | Noto‘g‘ri son bilan tayyorgarlik tayyorligini oshirib ko‘rsatish xavfi | 18/18 published/keyed pool va revision holatini qayta tekshirish |
| PED-02 | M14 7 mavzu avval 14–18 tadan available; strict mavzu imtihoni 20 savol talab qiladi (oldingi TASK127 P0 snapshot) | Boshlash tugmasi ishlamasligi | Har bir kanonik M14 mavzu 20 ta valid, active, keyed unique savol bilan preflight PASS |
| PED-03 | Legacy 118 published Y1 correct-option-length bias; TASK203 global 400 Y1 ichida 144 mexanik sifat flag | Javob variantlari shaklidan taxmin qilish, validlik pasayadi | Semantik ekspert review, immutable revision + atomic archive; alohida UX/variant testi |
| PED-04 | 249 owner-batch approvals, 82 AI qayta yozgan noto‘g‘ri variant; owner tasdig‘i mustaqil tashqi ekspert xulosasi emas | Bir ma’noli javob, distractor sifati isbotlanmagan | Source-page va independent key/option editorial signoff |
| PED-05 | Tarixiy testlardan 649 private candidate; 195 tekshirilgan, 335 umumiy qabul qilingan lekin source-key mustaqil tekshirilmagan, 119 rad/qorantin (TASK202/203 tarixiy kesimi) | Ishonchsiz savolni nashr qilish xavfi | Private provenance; xato kalitlar karantinda; publishedga avtomatik o'tish yo‘q |
| PED-06 | P0 docs: 78 objective draft, fakt/source_page va question-objective mapping to‘liq emas | 18 keng mavzu spetsifikatsiyaning barcha bandlarini qamrab olganini isbotlamaydi | O‘quv maqsadi → manba-bet → kanonik nazariya → savol mapping va konstrukt qamrov testi |
| PED-07 | Natija uchun ExamRunner natija bosqichida overflow-y-auto, ExamResultActions bor; live authenticated mobile/desktop E2E ko‘rilmagan | Scroll/uyga qaytish regressiyasi ehtimoli | 15-sinov full completion, 320px/desktop scroll, history/home/theory restart E2E |
| PED-08 | PEDAGOGY_RELEASE_FREEZE.md hamda ayrim task docs “PR #121/#127 DRAFT” deydi, biroq 2026-10-18 GitHub API ularning merged ekanini ko‘rsatdi | Hujjat va real Git holati farqi | Release-status xronologiyasini yangilash; GitHub + Vercel + prod DB SHA/parity tekshirilsin |
| PED-09 | M14–16 learner API quick-check va leaked answer xavfi oldingi P0da qayd etilgan, kod himoyasi merge qilingan | Asl baholashni oldindan bilib olish | API, JS assets, anon/auth RLS, checkAnswer oracle regressiya |
| PED-10 | Professional practice boshlang‘ich sahifa avval faqat 3 umumiy karta edi, konkret 18 mavzu va manbalar bitta sahifada ko‘rinmasdi | Materiallar tarqoq seziladi, foydalanuvchi yo‘l topolmaydi | Yagona M14/M15/M16 start UI, kanonik mavzu ro‘yxati, manbalar, history/review yo‘llari |
| PED-11 | M16.02 statik nazariyasi o‘quvchi vaqtining 70% kompyuterda o‘tishi **shart** deya aniq me’yor belgilagan, bu qoida tekshirilgan spetsifikatsiyada topilmadi | Manbasi ko‘rsatilmagan qat’iy ko‘rsatma | Shu aniq raqamli iddao statik nazariyadan chiqarildi; mustaqil QA qo‘shildi; production DBdagi boshqa nusxalar auditda |

**Ehtiyotkorlik:** yuqoridagi production bank sonlari shu sessiyada live database-dan o‘qilmadi; ular GitHubdagi tarixiy monitoring/audit xulosalaridir.

## 4. TASK-212 doirasida bajarilgan xavfsiz ish
- src/pages/ProfessionalPracticePage.tsx — kanonik katalogdan hosil qilinadigan 18 mavzuli yig‘ma boshlang‘ich sahifa; 5/7/3, 15 mashq, nazariya, history/review, asosiy manbalar va turli source-key ishonchliligi haqida eslatma.
- src/tests/ProfessionalPracticePage.test.tsx — modul kvotalari, 18 mavzu, manba caveat va yo‘nalishlar uchun regression test.
- src/data/topicContent.ts — M16.02dagi manbada tasdiqlanmagan majburiy 70% kompyuter-vaqti iddaosi o‘rniga sharoit/maqsadga mos rejalashtirish matni.
- src/tests/PedagogySourceIntegrity.test.ts — no-asossiz 70% va 18 pedagogika static professional mini-quiz kalitlarining yopiq bo‘lishi.
- Xavfsizlik chegarasi o‘zgarmadi: backend scoring, published bank, PDF candidate review holatlari va prod DB o‘zgarmaydi.
- O‘zgarishlar faqat TASK-212 feature branchida. Merge, production Vercel deploy va database migration bajarilmadi.

## 5. Qolgan majburiy release gate
- [ ] Hub uchun vitest + typecheck + lint + build + preview UI tekshiruvi (pass log bilan).
- [ ] Har bir M14/M15/M16 mavzusi nazariyasini haqiqiy 2026 konstrukti va manba sahifalari bilan audit (18/18).
- [ ] Barcha 15-question va 50-question generator kvotalari, Y1/Y2/Y3, server-side scoring, RLS, no key leakage E2E.
- [ ] 18/18 real test preflight; yetishmagan verified published pool ustidan alohida editorial ish.
- [ ] Tarixiy ziddiyatli kalit va 118/144 variant flaglarini mustaqil tahrir bilan to‘g‘rilash.
- [ ] 649 candidate provenance/duplicate/source checks va expertsiz nashrga chiqmasligi tekshiruvi.
- [ ] 320px, 768px, desktop, keyboard hamda 15-question natija scroll/navigatsiya smoke.
- [ ] Exact Git commit + Vercel deployment ID/READY + DB schema/migration revision parity.
- [ ] Published/archived/review holatlarni buzmagan holda oldingi attempts saqlanganligi.
- [ ] Foydalanuvchining yakuniy release bo‘yicha alohida aniq tasdig‘i.

## 6. Qaror
“100% tayyor” statusini berish uchun asos hozircha **yo‘q**. TASK-212 o‘quv navigatsiyasi foundation va audit reyestri; semantik ekspert tekshiruvi va production acceptance majburiy qoladi. PR faqat DRAFT bo‘lsin. Loyiha egasining PEDAGOGY_RELEASE_FREEZE talabi saqlanadi.


## 7. Rasmiy spetsifikatsiya bo‘yicha mavzu-maqsad xaritasi

**Birlamchi tekshirilgan fayl:** “Informatika Testlar spesifikatsiyasi.pdf” (Toshkent, 2026, 10 sahifa). Fizik PDFning 6–7-betlari, 2-jadval va 10-betidagi adabiyotlar ro‘yxati. 6-bet: KS 5 savol va yettita ko‘nikma; 7-bet: umumiy pedagogika 7 savol va sakkizta mazmun bullet, informatika metodikasi 3 savol va uchta bullet. 18 ta kanonik mavzu kodi rasmiy spetsifikatsiyada belgilanmagan — platformaning tahririy moslashtirishidir.

- **Yangi fayl:** src/data/pedagogySpec2026.ts — 7 KS, 8 PM.GEN, 3 PM.MET mavzusi uchun maqsad, guruh va rasmiy PDF sahifasi. Bu spetsifikatsiya qamrovi xaritasi, savollar banki yoki ekspert xulosasi emas.
- **UI:** pedagogika sahifasida har mavzu ostida o‘quvchi nimani bilishi va qo‘llashi kerakligi ko‘rsatiladi. Mavzu va bitta test savoli o‘rtasida majburiy 1:1 kvota yo‘q.
- **Test:** src/tests/PedagogySpec2026.test.ts — 18 mavzu, guruh/sahifa va mavjud nazariya bilan mapping regressioni.
- **Xavfsiz chegara:** mazkur mapping manba-bet, tekshiruvchi imzosi yoki har savolning maqsad bilan bog‘lanishi tekshirilganini bildirmaydi. Baza ichidagi per-question mapping alohida auditdan o‘tishi kerak.

### Natija bahosining serverga bog‘liqligi
- ExamRunner natija ekranida serverning passed=null javobini 60 foiz chegarasi bilan avtomatik “o‘tdi”ga aylantirish to‘xtatildi. 100 foizli pedagogik_15 mashq ham rasmiy attestatsiyadan o‘tganlik hukmi emas.
- src/tests/ExamResultDecision.test.tsx: pedagogik_15 va oddiy mock uchun 100% + passed=null holatlari yangi regressiya; passed=false server qarori mavjud regressiya bilan himoyalangan.

### Dalil chegarasi
- 18 mavzuning rasmiy 2-jadvalga mos nazariy qamrov xaritasi bo‘lishi barcha dars va barcha test kalitlari mustaqil ekspertizadan o‘tgan degani emas.
- Kasbiy adabiyotlarning to‘liq nusxalari bu bosqichda fizik betma-bet solishtirilmadi. Joriy Drive qidiruvida ayrim kitoblar topilmadi; yangi source-page ekspert tasdig‘i yozilmadi.
- M16.02dagi “70% kompyuterda bo‘lishi shart” jumlasi spetsifikatsiya 2-jadval metodika bandida ko‘rsatilmagan; normativ iddao sifatida olib tashlangan. Bu boshqa normativ hujjatlarda hech qanday foizli qoida yo‘q degan da’vo emas.

### CI
Birinchi commit 3edaca5 uchun backend/database/quality PASS tasdiqlangan. Yangi commit uchun CI qayta PASS bo‘lmasa release gate yopilgan hisoblanmaydi.
