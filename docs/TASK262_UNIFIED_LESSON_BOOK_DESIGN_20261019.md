# TASK-262 — Barcha nazariya darslari uchun yagona kitob o‘qish dizayni

Sana: 2026-10-19. Owner: ChatGPT assistenti. Branch: `task/TASK-262-unified-lesson-book-design-20261019`.

## Maqsad
M01 «Axborot va raqamli savodxonlik → Informatika, ma'lumot, axborot va bilim»
darsidagi yagona `BookReader` / `BookBlock` vizual tizimini M02–M16
bo‘limlariga (M14 kasb standarti, M15 pedagogika, M16 metodika ham) qo‘llash.

## Qilingan o‘zgarishlar
- `TopicView`: nazariyasi mavjud barcha mavzular eski ikki-blokli
  komponentdan `BookReader`ga o‘tdi. M01, M05 va oldingi manbali darslar
  avvalgi semantik sarlavha/bo‘lim ajratishini saqlaydi.
- `splitAdaptiveSections`: `source` belgisi yo‘q legacy darslar mavjud
  bloklarning tartibini mutlaqo o‘zgartirmasdan kichik sahifalarga ajratiladi;
  semantik sarlavha yolg‘iz sahifa oxirida qolmaydi.
- `BookBlock`: metadata bilan ifodalangan jadval ham, legacy Markdown
  jadvali ham kitobcha jadval ko‘rinishida ko‘rsatiladi; `list.items`
  bo‘lmasa satrlar asosida ro‘yxat tuziladi.
- Yagona mundarija, klaviatura navigatsiyasi, progress, rangli qutilar,
  manba izi, mobil moslashuv va testga o‘tish kartasi qayta ishlatiladi.
- Eski nazariyalar, DB, published revisionlar, savol/javob kaliti,
  source-locator va auth/test preflight o‘zgarmaydi. M15'ning
  maxsus tasdiqlangan statik nazariyasi saqlanadi; M14/M16
  published server-first qoidalari saqlanadi.
- M02/M14/M15 manbaviy qo‘shimchalar avvalgidek ixtiyoriy
  `details` bo‘limida, published core kontentiga aralashtirilmaydi.

## Acceptance va tekshiruv rejasi
- `src/tests/UnifiedLessonBookDesign.test.tsx`: pedagogika
  bo‘yicha sahifalash, manba bloklari yo‘qolmasligi, Markdown jadval,
  ro‘yxat, HTML xavfsizligi, test preflight blokirovkasi, progress.
- `src/tests/TopicViewNavigation.test.tsx`: M11'dagi eski sahifalash
  kutishlari M01 tipidagi o‘qish navigatsiyasi bilan almashtirildi.
- `src/tests/BookReader.test.tsx`: M01 kitob bo‘limlari va diagramma
  regressiyalari o‘zgarishsiz qolishi kerak.
- Qo‘shimcha tekshiruv: `npm run lint`, `npm run typecheck`,
  `npm test`, `npm run build`, desktop/mobile authenticated E2E.

## Release cheklovi
Bu dizayn o‘zgarishi faqat feature-branch va DRAFT PRda.
`PEDAGOGY_RELEASE_FREEZE.md` amalda: production DB, main merge,
Vercel production deploy taqiqlanadi. CI va real 18/18 pedagogika
hamda boshqa modul ekranlarini vizual QA bilan tekshirish shart.
PR ochilishi release yoki ekspert tasdig‘i emas.

## Rollback
DB migratsiyasi mavjud emas. PRni merge qilmasdan yopish yoki feature
commitlarini qaytarish orqali eski frontend ko‘rinishi qaytadi.
