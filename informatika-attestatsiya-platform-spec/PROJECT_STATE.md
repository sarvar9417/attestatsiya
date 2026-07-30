# PROJECT_STATE.md — joriy holat

> Bu living document. Har bir coder task boshlaganda va tugatganda yangilaydi.

## Holat

- Loyiha bosqichi: `DEVELOPMENT`
- Joriy milestone: `M0 — Platform skeleton`
- Oxirgi yangilanish: `2026-07-29`
- Production mavjud: `yo'q`
- Database project mavjud: `yo'q`
- Deployment mavjud: `yo'q`

## Tasdiqlangan asos

- React + Vite (Next.js emas, vaqt tejash uchun user qarori)
- TypeScript strict
- 16 modul CONTENT_BLUEPRINT.md bo'yicha
- Yagona 50 savollik mock exam (platform-wide, har modul uchun emas)
- BLUEPRINT: 35 specialty + 5 pro standard + 7 pedagogy + 3 methodology
- Kognitiv: 8 knowledge + 35 application + 7 reasoning
- Module question counts: M01=3, M02=2, M03=5, M04=3, M05=2, M06=3, M07=3, M08=3, M09=2, M10=2, M11=3, M12=2, M13=2, M14=5, M15=7, M16=3

## Faol tasklar

| Task | Egasi | Holat | Boshlangan vaqt | Branch |
|---|---|---|---|---|
| Spec integration | AI | DONE | 2026-07-29 | — |
| Y2/Y3 components | AI | DONE | 2026-07-29 | — |
| Mock blueprint fix | AI | DONE | 2026-07-29 | — |
| Tests | — | PENDING | — | — |
| Supabase migration | — | PENDING | — | — |

Holatlar: `READY`, `CLAIMED`, `IN_PROGRESS`, `BLOCKED`, `IN_REVIEW`, `DONE`.

## Bloklovchilar

| ID | Tavsif | Ta'sir qiluvchi tasklar | Qaror egasi | Holat |
|---|---|---|---|---|
| B-001 | Kasb standarti va pedagogika bo'yicha 5 manba hali korpusga qo'shilmagan | Kontentning M14–M16 qismi | Product owner | OPEN |
| B-002 | Test framework hali o'rnatilmagan | Barcha test tasklari | Tech owner | OPEN |

## Keyingi bajariladigan task

Testlarni yozish (Vitest unit + Playwright E2E).

## So'nggi tugallangan tasklar

| Task | Tugallangan vaqt | Izoh |
|---|---|---|
| contentTree.ts spec integration | 2026-07-29 | 16 modul CONTENT_BLUEPRINT bo'yicha qayta yozildi |
| Y2/Y3 question components | 2026-07-29 | Matching va ordering komponentlari yaratildi |
| Platform-wide mock exam | 2026-07-29 | 50 savollik yagona imtihon, BLUEPRINT asosida |
| topicContent.ts ID update | 2026-07-29 | Barcha subtopic IDlar spec formatiga o'tkazildi |

## Environment holati

| Muhit | URL | Database | Holat |
|---|---|---|---|
| Local | `http://localhost:5173` | localStorage | Ishlayapti |
| Production | TBD | TBD | Yaratilmagan |
