# DECISIONS.md — arxitektura qarorlari

Har yangi muhim qaror `ADR-###` bilan qo‘shiladi. Eski qaror o‘chirilmaydi; `SUPERSEDED` deb belgilanadi.

## ADR-001 — Modular monolith

- Holat: `ACCEPTED`; framework qismi ADR-017 bilan yangilangan
- Qaror: MVP bitta web ilova va bitta PostgreSQL bazasidan iborat modular monolith bo‘ladi.
- Sabab: jamoa AI coderlardan tashkil topadi; distributed transaction, service discovery va alohida deploylar keraksiz murakkablik yaratadi.
- Natija: domain modullari kodda qat’iy ajratiladi, lekin mikroservisga bo‘linmaydi.

## ADR-002 — Next.js App Router va TypeScript

- Holat: `SUPERSEDED` — ADR-017
- Qaror: full-stack web ilova Next.js App Router va TypeScript strict mode’da quriladi.
- Sabab: server va client render, responsive PWA, bitta repository va typed komponentlar.
- Cheklov: domain logic React component yoki route handler ichida yozilmaydi.

## ADR-003 — Supabase/PostgreSQL

- Holat: `ACCEPTED`
- Qaror: PostgreSQL asosiy ma’lumotlar bazasi; Supabase Auth, Storage va RLS ishlatiladi.
- Sabab: relational integrity, SQL migration, user-level security va lokal stack.
- Cheklov: provider-specific code repository/service qatlamidan tashqariga tarqalmaydi.

## ADR-004 — SQL migration, ORM yo‘q

- Holat: `ACCEPTED`
- Qaror: schema Supabase CLI orqali SQL migratsiyalar bilan boshqariladi; MVP’da ORM qo‘shilmaydi.
- Sabab: RLS, enum, constraint, trigger va database function’lar SQL’da to‘liq nazorat qilinadi.
- Natija: Supabase’dan TypeScript database type’lari generatsiya qilinadi.

## ADR-005 — Relational metadata + validated JSONB payload

- Holat: `ACCEPTED`
- Qaror: savolning filtrlanadigan metadata’si relational ustunlarda, Y1/Y2/Y3 tarkibi versioned `jsonb` payload’da saqlanadi.
- Sabab: savol turlarining strukturasi farqli, lekin qidiruv va blueprint atributlari qat’iy bo‘lishi kerak.
- Cheklov: payload Zod schema va database constraint orqali tekshiriladi.

## ADR-006 — Published revision immutable

- Holat: `ACCEPTED`
- Qaror: published lesson/question revision joyida o‘zgarmaydi. Har tahrir yangi revision.
- Sabab: tarixiy attempt va natijalarni qayta hisoblaganda ayni savolni tiklash.

## ADR-007 — Server authoritative exam

- Holat: `ACCEPTED`
- Qaror: imtihon savollari, `started_at`, `expires_at`, scoring va final submission server tomonidan boshqariladi.
- Sabab: client soati va client javob kalitiga ishonib bo‘lmaydi.

## ADR-008 — Arbitrary code execution MVP’dan tashqarida

- Holat: `ACCEPTED`
- Qaror: Python/JavaScript mavzulari kod natijasini topish, xatoni aniqlash va moslashtirish testlari orqali baholanadi; foydalanuvchi kodi serverda bajarilmaydi.
- Sabab: sandbox va abuse xavfi MVP scope’ini keskin oshiradi.

## ADR-009 — Human review required

- Holat: `ACCEPTED`
- Qaror: AI kontent yozishga yordam berishi mumkin, lekin ekspert tasdiqlamagan material learner’ga ko‘rinmaydi.
- Sabab: attestatsiya savolining fakt, javob va manba aniqligi kritik.

## ADR-010 — Uzbek-first, localization-ready

- Holat: `ACCEPTED`
- Qaror: MVP tili o‘zbek lotin yozuvi; user-facing matn translation key orqali chiqariladi.
- Sabab: maqsadli auditoriya va keyinchalik rus/ingliz tilini qo‘shish imkoniyati.

## ADR-011 — Source traceability

- Holat: `ACCEPTED`
- Qaror: har published lesson va question revision kamida bitta source reference’ga ega bo‘lishi shart.
- Istisno: sof platforma yo‘riqnomasi va tizim xabarlari.

## ADR-012 — First-attempt evidence

- Holat: `ACCEPTED`
- Qaror: mastery faqat mustaqil, javobi yoki tushuntirishi oldin ochilmagan distinct savollarning birinchi urinishlari bilan oshadi.
- Sabab: qayta urinishni haqiqiy bilim bilan aralashtirmaslik.

## ADR-013 — Provisional unlock, delayed stable mastery

- Holat: `ACCEPTED`
- Qaror: o‘quvchi mikro-mavzu bo‘yicha provisional mastery olsa keyingi mavzu ochiladi; stable mastery interval reviewlardan keyin beriladi.
- Sabab: kursni 30 kun kutishga majbur qilmasdan uzoq muddatli bilimni alohida o‘lchash.

## ADR-014 — Full-credit Y2/Y3

- Holat: `ACCEPTED`
- Qaror: amaldagi spetsifikatsiyada har savol 2 yoki 0 ball; Y2/Y3 to‘liq mos kelgandagina 2 ball.
- Natija: practice UI qisman xatolarni ko‘rsatishi mumkin, ammo rasmiy mock score’da partial credit yo‘q.

## ADR-015 — Copyright-safe content

- Holat: `ACCEPTED`
- Qaror: darsliklar manba sifatida ishlatiladi, lekin ochiq platformada to‘liq sahifa yoki katta so‘zma-so‘z bo‘laklar nashr qilinmaydi.
- Natija: izohlar qayta yoziladi; kichik iqtibos va sahifa reference zarurat darajasida ishlatiladi.

## ADR-016 — Versions pinned at bootstrap

- Holat: `SUPERSEDED` — ADR-017
- Qaror: Node 24 LTS, exact package versions va lockfile commit qilinadi.
- Natija: keyingi dependency upgrade alohida task va test bilan amalga oshiriladi.

## ADR-017 — React + Vite, Node 24 va npm

- Holat: `ACCEPTED`
- Qaror: mavjud React 18 + Vite + TypeScript strict frontend saqlanadi.
  Server chegarasi Supabase PostgreSQL, RLS, tekshirilgan RPC va zarur Edge
  Function’lardan iborat bo‘ladi. Node.js 24 LTS, npm va committed
  `package-lock.json` ishlatiladi.
- Sabab: ishlaydigan learner/admin UI va test bazasi mavjud. Next.js’ga
  migratsiya domain xavfsizligi, kontent sifati yoki attestatsiya aniqligiga
  bevosita qiymat qo‘shmaydi.
- Cheklov: browser exam scoring, timer, answer key, role assignment yoki
  mastery uchun authoritative bo‘la olmaydi.
- Supersedes: ADR-002 va ADR-016’ning package manager/toolchain qismi.

## ADR-018 — Ikki o‘qli kontent taksonomiyasi

- Holat: `ACCEPTED`
- Qaror: rasmiy baholash o‘qi va pedagogik o‘qitish o‘qi alohida
  versiyalanadi.
- Baholash o‘qi: rasmiy blueprint guruhlari, savol raqami, kvota, format va
  kognitiv daraja.
- O‘qitish o‘qi: 16 modul → mavzu → mikro-mavzu → o‘quv maqsadi.
- Bog‘lanish: `construct` ikkala o‘qni many-to-many mapping orqali bog‘laydi.
- Sabab: bitta modul rasmiy sinovning bir necha konstruktini o‘rgatishi,
  bitta konstrukt esa bir necha mikro-mavzuda mustahkamlanishi mumkin.
- Natija: modul soni yoki tartibi blueprint kvotasini anglatmaydi; mock
  generator faqat versiyalangan assessment blueprint’dan foydalanadi.
