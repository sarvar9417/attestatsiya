# TASK-571 — M01–M13 nazariya darslaridagi «Manba izi» ko‘rinishini tozalash

2026-10-22 read-only audit: Supabase `public.lessons`da 151 published dars, shulardan 88 tasida `Manba izi` iborasi uchraydi. Modullar bo‘yicha shu turdagi qaydlar M08 (19 dars), M12 (15), M14 (7), M15 (8) va boshqa modullarda tarqalgan. `Manba izi` ma’lumotlari attestatsiya ta’lim maqsadi emas, source ingest/audit qaydidir.

## Tuzatish
- `projectLearnerTheoryWithoutEditorialTraces()` faqat o‘quvchiga ko‘rinadigan `TheoryBlock` nusxasida `Manba izi:` bilan boshlanuvchi mustaqil izohni ajratadi.
- `[THEORY-CORPUS-*]` kabi migratsiya identifikatorini sarlavhadan chiqaradi.
- `Manba:` haqiqiy ilmiy manbalari, o‘quv materialining mazmuniy `PDF 29-bet` misollari, kod bloklari, jadvallar, formulalar va testlar saqlanadi.
- M14–M16 uchun oldingi `presentPedagogyTheory` tekshiruvdan o‘tgan qoidalari ishlashda qoladi.
- `public.lessons.body_mdx` original kontenti va manba/audit dalillari joyida qoladi; backend, Supabase migratsiyasi, savollar, kalitlar va tarix o‘zgarmaydi.

## Regressiya
`src/tests/task571GeneralTheorySourceCleanup.test.ts` M08 JS, M12 tarmoq, Markdown, heading marker, turli block turlari, idempotentlik va source preservation tekshiruvlarini qamrab oladi. CI gate frontend-quality, backend va database joblari yashil bo‘lishi kerak.

**Release:** faqat GitHub merge, Vercel deploy YO‘Q, Supabase production update YO‘Q. Rollback: kod commitini revert qilish.

## Qayta hisoblangan ta'sir doirasi va CI baseline

2026-10-22 production read-only audit: barcha published modullarda jami 88 dars / 120 ta `Manba izi` mustaqil paragrafi topildi. M14–M16 (oldingi TASK-547) 18 dars / 41 paragraf; pedagogikadan tashqari M01–M13 70 dars / 79 paragraf. TASK-571 faqat M01–M13 projectionni tozalaydi. PR #571 (TASK-572), commit `4d34d62c`, CI PASS bilan eski group-mock regres­siya testini yangi valid indirect evidentiary guardga moslashtirdi. Ushbu commit PR #570 CI ni hozirgi main bilan qayta ishga tushiradi; production deploy yo‘q.
