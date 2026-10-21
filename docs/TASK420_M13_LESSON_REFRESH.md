# TASK-420 — M13 dars navigatsiyasini barqarorlashtirish (2026-10-21)

## Muammo va aniq sabab
`useCatalog` avval M13 ning `contentTree`dagi 11 ta eski kichik mavzusini beradi. Server `m13-axr-01..07` published darslarini qaytarganda ularning UUIDlari bilan 7 ta boshqa bobga almashtiradi. `ModulePage` oldin ochilgan mavzuni faqat lokal `activeSubtopicId` state ichida saqlagan va uni yangi `mod.subtopics` ichidan izlagan. Eski `M13.06` yangi 7 UUID orasida yo‘q: `currentSubtopic = null` bo‘lib, dars oynasi yopilgan.

## Qaror
- Faqat M13 uchun `?topic=` query orqali barqaror ochilgan mavzu IDsi saqlanadi; qayta yuklashda shu IDdan tiklanadi.
- Seven-published `m13-axr-06` — **Kontent va auditoriya**, legacy `M13.06` — **Elektron tijorat, to‘lov va blockchain**. Mazmunni chalkashtirmaslik uchun IDlarni tartib bo‘yicha avtomatik o‘zgartirish yo‘q.
- URLda legacy `M13.06` bo‘lsa, published katalog kelganidan keyin ham eski darsning mavjud lokal nazariyasi ko‘rsatiladi; published boblarni yoki DBni o‘zgartirmaydi.
- M13 katalog so‘rovi kutilayotganida 11 eski mavzuli vaqtinchalik navigatsiya ko‘rsatilmaydi.
- Xato `?topic=` xavfsiz modul umumiy ekranida qoladi. M01/M07/M08/M12 rejimlariga tegilmaydi.

## Verification
- `LearningModulePages.test.tsx`ga 4 ta regressiya testi: 11→7 o‘tishda eski darsning saqlanishi va URL tiklash; published UUID darsni yangilash; yuklanish paytida xavfsiz holat; yaroqsiz query.
- GitHub CI: lint, typecheck, test, build va E2E holati merge oldidan tekshiriladi.

## Scope va release
- Kod: `src/pages/ModulePage.tsx` va regressiya test.
- **Migratsiya, production database yozuvi, published lesson revision, manual Vercel deployment yo‘q.**
- `vercel.json`dagi `git.deploymentEnabled: false` saqlanadi. `main`ga faqat CI tekshiruvlaridan keyin merge.
- Qolgan mahsulot masalasi: M13 legacy 11 mavzu va published 7 bobning editorial xaritalari farq qiladi; bu taskda curriculum/release o‘zgartirilmaydi.
